-- =====================================================
-- Deploy Production AI Token Quotas
-- Purpose: Production deployment of quota system
-- Created: October 29, 2025
-- =====================================================

-- This migration ensures all components are in place for production

-- =====================================================
-- Step 1: Verify user_ai_quotas table exists
-- =====================================================

-- Table should exist from migration 20250126000003
-- If not, create it now

CREATE TABLE IF NOT EXISTS public.user_ai_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  
  -- Quota limits
  monthly_token_quota BIGINT NOT NULL DEFAULT 10000,
  monthly_request_quota BIGINT NOT NULL DEFAULT 100,
  
  -- Current usage
  current_month_tokens BIGINT NOT NULL DEFAULT 0,
  current_month_requests BIGINT NOT NULL DEFAULT 0,
  
  -- Reset tracking
  quota_reset_date DATE NOT NULL,
  allow_overage BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_user_ai_quotas_user_id ON public.user_ai_quotas(user_id);

-- =====================================================
-- Step 2: Ensure RLS policies are in place
-- =====================================================

ALTER TABLE public.user_ai_quotas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own quota" ON public.user_ai_quotas;
DROP POLICY IF EXISTS "Admins can view all quotas" ON public.user_ai_quotas;

-- Users can view their own quota
CREATE POLICY "Users can view their own quota"
ON public.user_ai_quotas FOR SELECT
USING (user_id = auth.uid());

-- Admins can view all quotas
CREATE POLICY "Admins can view all quotas"
ON public.user_ai_quotas FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- System can update quotas (via SECURITY DEFINER functions)
CREATE POLICY "System can update quotas"
ON public.user_ai_quotas FOR UPDATE
USING (true)
WITH CHECK (true);

-- System can insert quotas (via SECURITY DEFINER functions)
CREATE POLICY "System can insert quotas"
ON public.user_ai_quotas FOR INSERT
WITH CHECK (true);

-- =====================================================
-- Step 3: Create helper function to get current quota status
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_quota_status()
RETURNS TABLE (
  used BIGINT,
  "limit" BIGINT,
  remaining BIGINT,
  percentage NUMERIC,
  reset_date DATE,
  status TEXT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_quota RECORD;
  v_percentage NUMERIC;
  v_status TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  -- Get user's quota record
  SELECT * INTO v_quota
  FROM public.user_ai_quotas
  WHERE user_id = auth.uid();

  -- If no quota record, return defaults
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      0::BIGINT as used,
      10000::BIGINT as "limit",
      10000::BIGINT as remaining,
      0::NUMERIC as percentage,
      (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE as reset_date,
      'healthy'::TEXT as status;
    RETURN;
  END IF;

  -- Calculate percentage
  v_percentage := (v_quota.current_month_tokens::NUMERIC / NULLIF(v_quota.monthly_token_quota, 0)::NUMERIC * 100);
  
  -- Determine status
  IF v_percentage >= 100 THEN
    v_status := 'exceeded';
  ELSIF v_percentage >= 90 THEN
    v_status := 'critical';
  ELSIF v_percentage >= 75 THEN
    v_status := 'warning';
  ELSE
    v_status := 'healthy';
  END IF;

  -- Return quota status
  RETURN QUERY SELECT 
    v_quota.current_month_tokens as used,
    v_quota.monthly_token_quota as "limit",
    (v_quota.monthly_token_quota - v_quota.current_month_tokens) as remaining,
    v_percentage as percentage,
    v_quota.quota_reset_date as reset_date,
    v_status as status;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_quota_status() TO authenticated;

-- =====================================================
-- Step 4: Create monthly quota reset function
-- =====================================================

CREATE OR REPLACE FUNCTION public.reset_monthly_quotas()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_reset_count INTEGER := 0;
BEGIN
  -- Reset quotas for users whose reset date has passed
  UPDATE public.user_ai_quotas
  SET 
    current_month_tokens = 0,
    current_month_requests = 0,
    quota_reset_date = (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE,
    updated_at = NOW()
  WHERE quota_reset_date <= CURRENT_DATE;

  GET DIAGNOSTICS v_reset_count = ROW_COUNT;
  
  RAISE NOTICE 'Reset % user quotas', v_reset_count;
  RETURN v_reset_count;
END;
$$;

-- Grant execution to service role for cron jobs
GRANT EXECUTE ON FUNCTION public.reset_monthly_quotas() TO service_role;

-- =====================================================
-- Step 5: Validation queries
-- =====================================================

-- Count users with quotas
DO $$
DECLARE
  v_quota_count INTEGER;
  v_user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_quota_count FROM public.user_ai_quotas;
  SELECT COUNT(*) INTO v_user_count FROM public.profiles;
  
  RAISE NOTICE 'Quotas: %, Users: %', v_quota_count, v_user_count;
  
  IF v_quota_count < v_user_count THEN
    RAISE NOTICE 'WARNING: Some users missing quota records. Run seed script.';
  END IF;
END $$;

-- =====================================================
-- DEPLOYMENT COMPLETE
-- =====================================================
-- ✅ user_ai_quotas table verified/created
-- ✅ RLS policies configured
-- ✅ get_user_quota_status() function created
-- ✅ reset_monthly_quotas() function created
-- ✅ Ready for production use
-- 
-- NEXT STEPS:
-- 1. Run: supabase/seeds/seed_ai_token_quotas.sql
-- 2. Set: VITE_USE_MOCK_TOKENS=false in .env
-- 3. Test: pnpm test tokenWidget
-- =====================================================

