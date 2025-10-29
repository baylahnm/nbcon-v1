-- =====================================================
-- Seed AI Token Quotas for All Tiers
-- Purpose: Initialize quota limits for subscription tiers
-- Created: October 29, 2025
-- =====================================================

-- =====================================================
-- TIER-BASED QUOTA LIMITS
-- =====================================================
-- Free:       10,000 tokens/month   (100 requests)
-- Basic:      50,000 tokens/month   (500 requests)
-- Pro:       200,000 tokens/month  (2,000 requests)
-- Enterprise: Unlimited             (10,000 requests)
-- =====================================================

-- Clean up existing test data (optional - comment out for append-only)
-- TRUNCATE TABLE public.user_ai_quotas CASCADE;

-- =====================================================
-- Function: Initialize Quota for User
-- =====================================================
CREATE OR REPLACE FUNCTION public.initialize_user_quota(
  p_user_id UUID,
  p_tier TEXT DEFAULT 'free'
)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_token_quota BIGINT;
  v_request_quota BIGINT;
  v_reset_date DATE;
BEGIN
  -- Set quota based on tier
  CASE p_tier
    WHEN 'free' THEN
      v_token_quota := 10000;
      v_request_quota := 100;
    WHEN 'basic' THEN
      v_token_quota := 50000;
      v_request_quota := 500;
    WHEN 'pro' THEN
      v_token_quota := 200000;
      v_request_quota := 2000;
    WHEN 'enterprise' THEN
      v_token_quota := 10000000; -- 10M = "unlimited"
      v_request_quota := 10000;
    ELSE
      v_token_quota := 10000; -- Default to free
      v_request_quota := 100;
  END CASE;

  -- Calculate next month's reset date
  v_reset_date := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE;

  -- Insert or update quota record
  INSERT INTO public.user_ai_quotas (
    user_id,
    monthly_token_quota,
    monthly_request_quota,
    current_month_tokens,
    current_month_requests,
    quota_reset_date,
    allow_overage,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    v_token_quota,
    v_request_quota,
    0, -- Start with 0 usage
    0,
    v_reset_date,
    (p_tier = 'enterprise'), -- Only enterprise allows overage
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    monthly_token_quota = EXCLUDED.monthly_token_quota,
    monthly_request_quota = EXCLUDED.monthly_request_quota,
    quota_reset_date = EXCLUDED.quota_reset_date,
    allow_overage = EXCLUDED.allow_overage,
    updated_at = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION public.initialize_user_quota(UUID, TEXT) TO authenticated;

-- =====================================================
-- Seed All Existing Users with Default Quotas
-- =====================================================

-- Initialize quotas for all users based on their subscription tier
DO $$
DECLARE
  v_user RECORD;
  v_tier TEXT;
BEGIN
  FOR v_user IN 
    SELECT 
      p.user_id,
      p.role,
      COALESCE(s.subscription_tier, 'free') as tier
    FROM public.profiles p
    LEFT JOIN public.subscriptions s ON s.user_id = p.user_id AND s.status = 'active'
  LOOP
    -- Map subscription tier to quota tier
    v_tier := COALESCE(v_user.tier, 'free');
    
    -- Initialize quota
    PERFORM public.initialize_user_quota(v_user.user_id, v_tier);
    
    RAISE NOTICE 'Initialized quota for user % with tier %', v_user.user_id, v_tier;
  END LOOP;
END $$;

-- =====================================================
-- Trigger: Auto-Initialize Quota on Profile Creation
-- =====================================================

CREATE OR REPLACE FUNCTION public.auto_initialize_user_quota()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Initialize with 'free' tier on profile creation
  PERFORM public.initialize_user_quota(NEW.user_id, 'free');
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_auto_initialize_quota ON public.profiles;

-- Create trigger on profile insert
CREATE TRIGGER trigger_auto_initialize_quota
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_initialize_user_quota();

-- =====================================================
-- Trigger: Update Quota on Subscription Change
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_quota_on_subscription_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only update if subscription is now active
  IF NEW.status = 'active' THEN
    PERFORM public.initialize_user_quota(NEW.user_id, NEW.subscription_tier);
    RAISE NOTICE 'Updated quota for user % to tier %', NEW.user_id, NEW.subscription_tier;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_quota_on_subscription ON public.subscriptions;

-- Create trigger on subscription insert/update
CREATE TRIGGER trigger_update_quota_on_subscription
AFTER INSERT OR UPDATE OF subscription_tier, status ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_quota_on_subscription_change();

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check quota distribution by tier
SELECT 
  CASE 
    WHEN monthly_token_quota = 10000 THEN 'free'
    WHEN monthly_token_quota = 50000 THEN 'basic'
    WHEN monthly_token_quota = 200000 THEN 'pro'
    WHEN monthly_token_quota >= 10000000 THEN 'enterprise'
    ELSE 'unknown'
  END as tier,
  COUNT(*) as user_count,
  monthly_token_quota as token_limit,
  monthly_request_quota as request_limit
FROM public.user_ai_quotas
GROUP BY monthly_token_quota, monthly_request_quota
ORDER BY monthly_token_quota;

-- Show sample quotas
SELECT 
  uq.user_id,
  p.email,
  p.role,
  uq.monthly_token_quota,
  uq.current_month_tokens,
  uq.monthly_request_quota,
  uq.current_month_requests,
  uq.quota_reset_date,
  uq.allow_overage
FROM public.user_ai_quotas uq
JOIN public.profiles p ON p.user_id = uq.user_id
LIMIT 10;

-- =====================================================
-- COMPLETED
-- =====================================================
-- ✅ Quota limits defined for all 4 tiers
-- ✅ Function to initialize/update user quotas
-- ✅ All existing users seeded with quotas
-- ✅ Auto-initialization trigger for new users
-- ✅ Auto-update trigger on subscription changes
-- =====================================================

