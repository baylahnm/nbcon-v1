-- =====================================================
-- Phase 3: Token Tracking & Monetization Analytics
-- Created: 2025-01-26
-- Purpose: Track AI token usage for cost analysis and billing
-- =====================================================

-- =====================================================
-- Table: ai_agent_usage (Token Stoichiometry)
-- Tracks detailed token usage per interaction
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ai_agent_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Context
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id),
  session_id UUID REFERENCES public.ai_agent_sessions(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
  
  -- Workflow context
  discipline TEXT NOT NULL, -- Denormalized for fast analytics
  workflow_id TEXT NOT NULL, -- e.g., "beam_design", "boq_generation"
  deliverable_id UUID REFERENCES public.ai_agent_deliverables(id),
  
  -- Token metrics
  tokens_prompt INTEGER NOT NULL DEFAULT 0, -- Input tokens (system + user)
  tokens_completion INTEGER NOT NULL DEFAULT 0, -- Output tokens (assistant)
  tokens_total INTEGER NOT NULL GENERATED ALWAYS AS (tokens_prompt + tokens_completion) STORED,
  
  -- Cost calculation
  model_used TEXT NOT NULL DEFAULT 'gpt-4o-mini', -- Track model for accurate pricing
  cost_usd DECIMAL(10,6) NOT NULL, -- Calculated cost in USD
  cost_sar DECIMAL(10,2) GENERATED ALWAYS AS (cost_usd * 3.75) STORED, -- USD to SAR conversion
  
  -- Performance metrics
  processing_time_ms INTEGER,
  response_quality_score DECIMAL(5,2), -- 0-100, from validation results
  user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX idx_ai_agent_usage_user ON public.ai_agent_usage(user_id, created_at DESC);
CREATE INDEX idx_ai_agent_usage_agent ON public.ai_agent_usage(agent_id, created_at DESC);
CREATE INDEX idx_ai_agent_usage_workflow ON public.ai_agent_usage(workflow_id, created_at DESC);
CREATE INDEX idx_ai_agent_usage_discipline ON public.ai_agent_usage(discipline, created_at DESC);
CREATE INDEX idx_ai_agent_usage_cost ON public.ai_agent_usage(cost_usd DESC);

-- GIN index for metadata queries
CREATE INDEX idx_ai_agent_usage_metadata ON public.ai_agent_usage USING gin(metadata);

-- RLS Policy
CREATE POLICY "Users can view their own agent usage"
ON public.ai_agent_usage FOR SELECT
USING (user_id = auth.uid());

-- Admins can view all usage (for analytics)
CREATE POLICY "Admins can view all agent usage"
ON public.ai_agent_usage FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);


-- =====================================================
-- Analytics Views: Token Stoichiometry
-- =====================================================

-- View 1: Cost per workflow (for pricing optimization)
CREATE OR REPLACE VIEW public.workflow_cost_analytics AS
SELECT 
  workflow_id,
  discipline,
  COUNT(*) as execution_count,
  AVG(tokens_total) as avg_tokens,
  AVG(cost_usd) as avg_cost_usd,
  AVG(cost_sar) as avg_cost_sar,
  AVG(processing_time_ms) as avg_processing_ms,
  AVG(response_quality_score) as avg_quality,
  AVG(user_satisfaction) as avg_satisfaction
FROM public.ai_agent_usage
GROUP BY workflow_id, discipline
ORDER BY avg_cost_usd DESC;

-- View 2: User spending (for billing/quotas)
CREATE OR REPLACE VIEW public.user_ai_spending AS
SELECT 
  u.user_id,
  p.email,
  p.role,
  COUNT(*) as interactions,
  SUM(u.tokens_total) as total_tokens,
  SUM(u.cost_usd) as total_cost_usd,
  SUM(u.cost_sar) as total_cost_sar,
  AVG(u.user_satisfaction) as avg_satisfaction,
  DATE_TRUNC('month', u.created_at) as month
FROM public.ai_agent_usage u
JOIN public.profiles p ON u.user_id = p.user_id
GROUP BY u.user_id, p.email, p.role, month
ORDER BY total_cost_usd DESC;

-- View 3: Discipline profitability (which agents are cost-effective)
CREATE OR REPLACE VIEW public.discipline_roi_metrics AS
SELECT 
  discipline,
  COUNT(*) as usage_count,
  SUM(tokens_total) as total_tokens,
  AVG(tokens_total) as avg_tokens_per_use,
  SUM(cost_usd) as total_cost_usd,
  AVG(cost_usd) as avg_cost_per_use,
  AVG(processing_time_ms) as avg_time_ms,
  AVG(response_quality_score) as avg_quality,
  AVG(user_satisfaction) as avg_satisfaction,
  -- ROI calculation: time saved * hourly rate vs AI cost
  (AVG(processing_time_ms) / 1000.0 / 3600.0 * 100.0) - AVG(cost_usd) as estimated_roi_usd
FROM public.ai_agent_usage
GROUP BY discipline
ORDER BY estimated_roi_usd DESC;

-- View 4: Anomaly detection (unusual token consumption)
CREATE OR REPLACE VIEW public.token_usage_anomalies AS
SELECT 
  u.*,
  p.email,
  a.display_name as agent_name,
  (u.tokens_total - subq.avg_tokens) / NULLIF(subq.stddev_tokens, 0) as z_score
FROM public.ai_agent_usage u
JOIN public.profiles p ON u.user_id = p.user_id
JOIN public.ai_agents a ON u.agent_id = a.id
CROSS JOIN LATERAL (
  SELECT 
    AVG(tokens_total) as avg_tokens,
    STDDEV(tokens_total) as stddev_tokens
  FROM public.ai_agent_usage
  WHERE workflow_id = u.workflow_id
) subq
WHERE ABS((u.tokens_total - subq.avg_tokens) / NULLIF(subq.stddev_tokens, 0)) > 2.0 -- 2 standard deviations
ORDER BY u.created_at DESC;


-- =====================================================
-- RPC Functions: Token & Cost Queries
-- =====================================================

-- Get user's monthly token usage
CREATE OR REPLACE FUNCTION public.get_user_monthly_usage(
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  p_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
)
RETURNS TABLE (
  total_interactions BIGINT,
  total_tokens BIGINT,
  total_cost_usd NUMERIC,
  total_cost_sar NUMERIC,
  by_discipline JSONB
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_interactions,
    SUM(tokens_total)::BIGINT as total_tokens,
    SUM(cost_usd)::NUMERIC as total_cost_usd,
    SUM(cost_sar)::NUMERIC as total_cost_sar,
    jsonb_object_agg(
      discipline,
      jsonb_build_object(
        'interactions', COUNT(*),
        'tokens', SUM(tokens_total),
        'cost_usd', SUM(cost_usd),
        'cost_sar', SUM(cost_sar)
      )
    ) as by_discipline
  FROM public.ai_agent_usage
  WHERE user_id = auth.uid()
    AND EXTRACT(YEAR FROM created_at) = p_year
    AND EXTRACT(MONTH FROM created_at) = p_month
  GROUP BY NULL; -- Aggregate all rows
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_monthly_usage(INTEGER, INTEGER) TO authenticated;


-- Get workflow cost benchmarks (for pricing)
CREATE OR REPLACE FUNCTION public.get_workflow_cost_benchmarks()
RETURNS TABLE (
  workflow_id TEXT,
  discipline TEXT,
  avg_cost_usd NUMERIC,
  avg_cost_sar NUMERIC,
  avg_tokens INTEGER,
  execution_count BIGINT,
  quality_score NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.workflow_id,
    u.discipline,
    AVG(u.cost_usd)::NUMERIC as avg_cost_usd,
    AVG(u.cost_sar)::NUMERIC as avg_cost_sar,
    AVG(u.tokens_total)::INTEGER as avg_tokens,
    COUNT(*)::BIGINT as execution_count,
    AVG(u.response_quality_score)::NUMERIC as quality_score
  FROM public.ai_agent_usage u
  WHERE u.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY u.workflow_id, u.discipline
  ORDER BY execution_count DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_workflow_cost_benchmarks() TO authenticated;


-- =====================================================
-- Triggers: Auto-calculate costs
-- =====================================================

-- Function to calculate cost based on model and tokens
CREATE OR REPLACE FUNCTION public.calculate_ai_cost()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_cost_usd DECIMAL(10,6);
  v_input_cost_per_1k DECIMAL(10,6);
  v_output_cost_per_1k DECIMAL(10,6);
BEGIN
  -- Pricing as of Jan 2025 (OpenAI)
  CASE NEW.model_used
    WHEN 'gpt-4o' THEN
      v_input_cost_per_1k := 0.0025;   -- $2.50 per 1M tokens
      v_output_cost_per_1k := 0.010;   -- $10.00 per 1M tokens
    WHEN 'gpt-4o-mini' THEN
      v_input_cost_per_1k := 0.00015;  -- $0.15 per 1M tokens
      v_output_cost_per_1k := 0.0006;  -- $0.60 per 1M tokens
    ELSE
      v_input_cost_per_1k := 0.0003;   -- Default conservative estimate
      v_output_cost_per_1k := 0.0012;
  END CASE;
  
  -- Calculate total cost
  v_cost_usd := (NEW.tokens_prompt * v_input_cost_per_1k / 1000.0) + 
                (NEW.tokens_completion * v_output_cost_per_1k / 1000.0);
  
  NEW.cost_usd := v_cost_usd;
  
  RETURN NEW;
END;
$$;

-- Attach trigger
CREATE TRIGGER trigger_calculate_ai_cost
BEFORE INSERT ON public.ai_agent_usage
FOR EACH ROW
EXECUTE FUNCTION public.calculate_ai_cost();


-- =====================================================
-- Quota Management
-- =====================================================

-- Table: User AI quotas (for billing tiers)
CREATE TABLE IF NOT EXISTS public.user_ai_quotas (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  
  -- Monthly allowances
  monthly_token_quota BIGINT DEFAULT 100000, -- 100K tokens/month (free tier)
  monthly_cost_quota_usd DECIMAL(10,2) DEFAULT 5.00, -- $5/month
  
  -- Current month usage (reset monthly)
  current_month_tokens BIGINT DEFAULT 0,
  current_month_cost_usd DECIMAL(10,2) DEFAULT 0,
  quota_reset_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
  
  -- Overages
  allow_overage BOOLEAN DEFAULT false,
  overage_rate_multiplier DECIMAL(5,2) DEFAULT 2.0, -- 2x rate for overages
  
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policy
CREATE POLICY "Users can view their own quotas"
ON public.user_ai_quotas FOR SELECT
USING (user_id = auth.uid());


-- Function: Check if user has quota available
CREATE OR REPLACE FUNCTION public.check_user_quota(
  p_estimated_tokens INTEGER
)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_quota RECORD;
  v_would_exceed BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
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
    WHERE user_id = auth.uid();
    
    RETURN true; -- New month, quota available
  END IF;
  
  -- Check if would exceed quota
  v_would_exceed := (v_quota.current_month_tokens + p_estimated_tokens) > v_quota.monthly_token_quota;
  
  -- Allow if under quota OR overages allowed
  RETURN NOT v_would_exceed OR v_quota.allow_overage;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_user_quota(INTEGER) TO authenticated;


-- Function: Update quota after usage
CREATE OR REPLACE FUNCTION public.update_user_quota()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update monthly usage counters
  INSERT INTO public.user_ai_quotas (user_id, current_month_tokens, current_month_cost_usd)
  VALUES (NEW.user_id, NEW.tokens_total, NEW.cost_usd)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    current_month_tokens = user_ai_quotas.current_month_tokens + NEW.tokens_total,
    current_month_cost_usd = user_ai_quotas.current_month_cost_usd + NEW.cost_usd,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Trigger to update quota after each usage
CREATE TRIGGER trigger_update_user_quota
AFTER INSERT ON public.ai_agent_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_user_quota();


-- =====================================================
-- Monetization Analytics Views
-- =====================================================

-- Daily revenue metrics (for billing dashboard)
CREATE OR REPLACE VIEW public.daily_ai_revenue AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_interactions,
  SUM(tokens_total) as total_tokens,
  SUM(cost_usd) as total_cost_usd,
  SUM(cost_sar) as total_cost_sar,
  AVG(cost_usd) as avg_cost_per_interaction,
  AVG(processing_time_ms) as avg_processing_time_ms
FROM public.ai_agent_usage
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;


-- Per-user profitability (cost vs subscription value)
CREATE OR REPLACE VIEW public.user_ai_profitability AS
SELECT 
  u.user_id,
  p.email,
  p.role,
  COUNT(*) as interactions_this_month,
  SUM(u.cost_usd) as cost_this_month_usd,
  SUM(u.cost_sar) as cost_this_month_sar,
  q.monthly_cost_quota_usd as quota_usd,
  (q.monthly_cost_quota_usd - SUM(u.cost_usd)) as remaining_quota_usd,
  CASE 
    WHEN SUM(u.cost_usd) > q.monthly_cost_quota_usd THEN 'over_quota'
    WHEN SUM(u.cost_usd) > q.monthly_cost_quota_usd * 0.8 THEN 'warning'
    ELSE 'healthy'
  END as quota_status
FROM public.ai_agent_usage u
JOIN public.profiles p ON u.user_id = p.user_id
LEFT JOIN public.user_ai_quotas q ON u.user_id = q.user_id
WHERE u.created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY u.user_id, p.email, p.role, q.monthly_cost_quota_usd
ORDER BY cost_this_month_usd DESC;


-- Agent efficiency ranking (cost vs quality)
CREATE OR REPLACE VIEW public.agent_efficiency_ranking AS
SELECT 
  a.discipline,
  a.display_name,
  COUNT(u.id) as usage_count,
  AVG(u.tokens_total) as avg_tokens,
  AVG(u.cost_usd) as avg_cost_usd,
  AVG(u.response_quality_score) as avg_quality,
  AVG(u.user_satisfaction) as avg_satisfaction,
  -- Efficiency score: quality per dollar spent
  AVG(u.response_quality_score) / NULLIF(AVG(u.cost_usd), 0) as efficiency_score
FROM public.ai_agents a
LEFT JOIN public.ai_agent_usage u ON a.id = u.agent_id
WHERE u.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY a.id, a.discipline, a.display_name
ORDER BY efficiency_score DESC;


-- =====================================================
-- Verification Queries
-- =====================================================

-- Test token tracking
-- INSERT INTO ai_agent_usage (user_id, agent_id, discipline, workflow_id, tokens_prompt, tokens_completion, model_used)
-- SELECT auth.uid(), id, discipline, 'test_workflow', 1000, 500, 'gpt-4o-mini'
-- FROM ai_agents LIMIT 1;
-- 
-- SELECT * FROM workflow_cost_analytics;
-- SELECT * FROM user_ai_spending WHERE user_id = auth.uid();

