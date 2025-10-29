-- =====================================================
-- Create Test Users for Subscription Tier Testing
-- Purpose: Seed test accounts for Free, Basic, Pro, Enterprise tiers
-- Created: October 29, 2025
-- =====================================================

-- =====================================================
-- Step 1: Create Test User Accounts
-- =====================================================

-- Note: These users need to be created via Supabase Auth first
-- This script assumes auth.users already exist and adds subscription data

-- Get user IDs (you'll need to replace these with actual UUIDs after auth creation)
-- For now, we'll use placeholder logic

DO $$
DECLARE
  v_free_user_id UUID;
  v_basic_user_id UUID;
  v_pro_user_id UUID;
  v_enterprise_user_id UUID;
  v_free_plan_id UUID;
  v_basic_plan_id UUID;
  v_pro_plan_id UUID;
  v_enterprise_plan_id UUID;
BEGIN
  
  -- =====================================================
  -- Get Plan IDs
  -- =====================================================
  
  SELECT id INTO v_free_plan_id 
  FROM subscription_plans 
  WHERE plan_type = 'free' 
  LIMIT 1;
  
  SELECT id INTO v_basic_plan_id 
  FROM subscription_plans 
  WHERE plan_type = 'basic' 
  LIMIT 1;
  
  SELECT id INTO v_pro_plan_id 
  FROM subscription_plans 
  WHERE plan_type = 'premium' 
  LIMIT 1;
  
  SELECT id INTO v_enterprise_plan_id 
  FROM subscription_plans 
  WHERE plan_type = 'enterprise' 
  LIMIT 1;
  
  -- =====================================================
  -- Find or Create Test Users
  -- =====================================================
  
  -- Free User
  SELECT user_id INTO v_free_user_id 
  FROM profiles 
  WHERE email = 'free@nbcon.org' 
  LIMIT 1;
  
  -- Basic User  
  SELECT user_id INTO v_basic_user_id 
  FROM profiles 
  WHERE email = 'basic@nbcon.org' 
  LIMIT 1;
  
  -- Pro User
  SELECT user_id INTO v_pro_user_id 
  FROM profiles 
  WHERE email = 'info@nbcon.org' 
  LIMIT 1;
  
  -- Enterprise User
  SELECT user_id INTO v_enterprise_user_id 
  FROM profiles 
  WHERE email = 'mahdi.n.baylah@outlook.com' 
  LIMIT 1;
  
  -- =====================================================
  -- Create/Update Subscriptions
  -- =====================================================
  
  -- Free User Subscription
  IF v_free_user_id IS NOT NULL AND v_free_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      trial_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_free_user_id,
      v_free_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 month',
      NULL,
      'sub_test_free',
      'cus_test_free'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      updated_at = NOW();
    
    RAISE NOTICE 'Created/Updated subscription for free@nbcon.org';
  END IF;
  
  -- Basic User Subscription
  IF v_basic_user_id IS NOT NULL AND v_basic_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      trial_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_basic_user_id,
      v_basic_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 month',
      NULL,
      'sub_test_basic',
      'cus_test_basic'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      updated_at = NOW();
    
    RAISE NOTICE 'Created/Updated subscription for basic@nbcon.org';
  END IF;
  
  -- Pro User Subscription
  IF v_pro_user_id IS NOT NULL AND v_pro_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      trial_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_pro_user_id,
      v_pro_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 month',
      NULL,
      'sub_test_pro',
      'cus_test_pro'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      updated_at = NOW();
    
    RAISE NOTICE 'Created/Updated subscription for info@nbcon.org';
  END IF;
  
  -- Enterprise User Subscription
  IF v_enterprise_user_id IS NOT NULL AND v_enterprise_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      trial_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_enterprise_user_id,
      v_enterprise_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 month',
      NULL,
      'sub_test_enterprise',
      'cus_test_enterprise'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      updated_at = NOW();
    
    RAISE NOTICE 'Created/Updated subscription for mahdi.n.baylah@outlook.com';
  END IF;
  
  -- =====================================================
  -- Initialize AI Quotas for Test Users
  -- =====================================================
  
  IF v_free_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_free_user_id, 'free');
  END IF;
  
  IF v_basic_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_basic_user_id, 'basic');
  END IF;
  
  IF v_pro_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_pro_user_id, 'pro');
  END IF;
  
  IF v_enterprise_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_enterprise_user_id, 'enterprise');
  END IF;
  
END $$;

-- =====================================================
-- Verification Query
-- =====================================================

SELECT 
  p.email,
  p.role,
  sp.plan_type as subscription_tier,
  s.subscription_status,
  uq.monthly_token_quota,
  uq.monthly_request_quota
FROM profiles p
LEFT JOIN subscriptions s ON s.user_id = p.user_id AND s.subscription_status = 'active'
LEFT JOIN subscription_plans sp ON sp.id = s.plan_id
LEFT JOIN user_ai_quotas uq ON uq.user_id = p.user_id
WHERE p.email IN (
  'free@nbcon.org',
  'basic@nbcon.org', 
  'info@nbcon.org',
  'mahdi.n.baylah@outlook.com'
)
ORDER BY 
  CASE sp.plan_type
    WHEN 'free' THEN 1
    WHEN 'basic' THEN 2
    WHEN 'premium' THEN 3
    WHEN 'enterprise' THEN 4
    ELSE 5
  END;

-- =====================================================
-- Instructions
-- =====================================================

-- Before running this script:
-- 1. Ensure test users exist in auth.users (create via Supabase Auth UI or API)
-- 2. Ensure corresponding profiles exist in profiles table
-- 3. Ensure subscription_plans table has all 4 tier plans

-- After running this script:
-- 1. Run the verification query above
-- 2. Confirm all 4 users have correct tier assignments
-- 3. Run E2E tests: pnpm exec playwright test tests/e2e/subscriptionGating.spec.ts

-- =====================================================

