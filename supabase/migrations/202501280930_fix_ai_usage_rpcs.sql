-- =====================================================
-- Fix AI Usage RPC Functions
-- Date: January 28, 2025
-- Purpose: Fix nested aggregation issues and ambiguous column references
-- =====================================================

-- =====================================================
-- Fix 1: Update user_ai_quotas table to include request limits
-- =====================================================

DO $$ 
BEGIN
  -- Add monthly_request_quota if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_ai_quotas' 
    AND column_name = 'monthly_request_quota'
  ) THEN
    ALTER TABLE public.user_ai_quotas 
    ADD COLUMN monthly_request_quota BIGINT DEFAULT 1000;
  END IF;
END $$;

-- =====================================================
-- Fix 2: Replace get_user_monthly_usage with simplified version
-- =====================================================

-- Drop existing function first (signature changed - cannot use CREATE OR REPLACE)
DROP FUNCTION IF EXISTS public.get_user_monthly_usage(integer, integer);
DROP FUNCTION IF EXISTS public.get_user_monthly_usage();

CREATE FUNCTION public.get_user_monthly_usage(
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
)
RETURNS TABLE (
  total_tokens BIGINT,
  total_requests BIGINT,
  total_cost_usd NUMERIC,
  total_cost_sar NUMERIC,
  period_start DATE,
  period_end DATE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_period_start DATE;
  v_period_end DATE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Calculate period boundaries
  v_period_start := DATE_TRUNC('month', MAKE_DATE(p_year, p_month, 1));
  v_period_end := (v_period_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

  -- Return aggregated usage using CTE for clarity
  RETURN QUERY
  WITH usage_cte AS (
    SELECT 
      COALESCE(SUM(tokens_total), 0)::BIGINT as tokens_sum,
      COALESCE(COUNT(*), 0)::BIGINT as requests_count,
      COALESCE(SUM(cost_usd), 0)::NUMERIC as cost_usd_sum,
      COALESCE(SUM(cost_sar), 0)::NUMERIC as cost_sar_sum
    FROM public.ai_agent_usage
    WHERE user_id = auth.uid()
      AND created_at >= v_period_start
      AND created_at < (v_period_end + INTERVAL '1 day')
  )
  SELECT 
    tokens_sum as total_tokens,
    requests_count as total_requests,
    cost_usd_sum as total_cost_usd,
    cost_sar_sum as total_cost_sar,
    v_period_start as period_start,
    v_period_end as period_end
  FROM usage_cte;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_monthly_usage(INTEGER, INTEGER) TO authenticated;


-- =====================================================
-- Fix 3: Fix get_thread_messages to avoid ambiguous column references
-- =====================================================

-- Drop existing function first (safer for signature changes)
DROP FUNCTION IF EXISTS public.get_thread_messages(UUID);

-- Use 'thread_id' not 'p_thread_id' to match frontend payload
CREATE FUNCTION public.get_thread_messages(thread_id UUID)
RETURNS TABLE (
  id UUID,
  conversation_id UUID,
  message_type TEXT,
  content TEXT,
  content_type TEXT,
  metadata JSONB,
  parent_message_id UUID,
  is_deleted BOOLEAN,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify user owns this conversation
  IF NOT EXISTS (
    SELECT 1 FROM public.ai_conversations 
    WHERE ai_conversations.id = thread_id 
    AND ai_conversations.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: conversation not found or unauthorized';
  END IF;

  -- Return messages ordered chronologically (fully qualified column names)
  RETURN QUERY
  SELECT 
    ai_messages.id,
    ai_messages.conversation_id,
    ai_messages.message_type,
    ai_messages.content,
    ai_messages.content_type,
    ai_messages.metadata,
    ai_messages.parent_message_id,
    ai_messages.is_deleted,
    ai_messages.created_at
  FROM public.ai_messages
  WHERE ai_messages.conversation_id = thread_id
    AND ai_messages.is_deleted = false
  ORDER BY ai_messages.created_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_thread_messages(UUID) TO authenticated;


-- =====================================================
-- Fix 4: Update check_user_quota to return proper table result
-- =====================================================

-- Drop existing function first (signature changed - cannot use CREATE OR REPLACE)
DROP FUNCTION IF EXISTS public.check_user_quota(integer);

CREATE FUNCTION public.check_user_quota(
  p_estimated_tokens INTEGER
)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining_tokens BIGINT,
  remaining_requests BIGINT,
  quota_limit BIGINT,
  request_limit BIGINT,
  reset_date DATE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_quota RECORD;
  v_would_exceed BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN QUERY SELECT false, 0::BIGINT, 0::BIGINT, 0::BIGINT, 0::BIGINT, CURRENT_DATE;
    RETURN;
  END IF;

  -- Get or create quota record
  SELECT * INTO v_quota
  FROM public.user_ai_quotas
  WHERE user_id = auth.uid();
  
  IF v_quota IS NULL THEN
    -- Create default quota
    INSERT INTO public.user_ai_quotas (user_id)
    VALUES (auth.uid())
    RETURNING * INTO v_quota;
  END IF;
  
  -- Check if reset needed
  IF CURRENT_DATE >= v_quota.quota_reset_date THEN
    UPDATE public.user_ai_quotas
    SET 
      current_month_tokens = 0,
      current_month_cost_usd = 0,
      quota_reset_date = CURRENT_DATE + INTERVAL '1 month'
    WHERE user_id = auth.uid()
    RETURNING * INTO v_quota;
  END IF;
  
  -- Check if would exceed quota
  v_would_exceed := (v_quota.current_month_tokens + p_estimated_tokens) > v_quota.monthly_token_quota;
  
  -- Return result with request limits
  RETURN QUERY SELECT 
    (NOT v_would_exceed OR v_quota.allow_overage)::BOOLEAN as allowed,
    GREATEST(0, v_quota.monthly_token_quota - v_quota.current_month_tokens)::BIGINT as remaining_tokens,
    COALESCE(v_quota.monthly_request_quota, 1000)::BIGINT as remaining_requests, -- Default if not set
    v_quota.monthly_token_quota::BIGINT as quota_limit,
    COALESCE(v_quota.monthly_request_quota, 1000)::BIGINT as request_limit,
    v_quota.quota_reset_date::DATE as reset_date;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_user_quota(INTEGER) TO authenticated;


-- =====================================================
-- Add RLS policy for user_ai_quotas if missing
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_ai_quotas' 
    AND policyname = 'Users can view their own quotas'
  ) THEN
    CREATE POLICY "Users can view their own quotas"
    ON public.user_ai_quotas FOR SELECT
    USING (user_id = auth.uid());
  END IF;
END $$;

-- =====================================================
-- Enable RLS if not already enabled
-- =====================================================

ALTER TABLE public.user_ai_quotas ENABLE ROW LEVEL SECURITY;
