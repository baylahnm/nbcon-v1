-- =====================================================
-- Create Auth Test Users + Assign Subscriptions
-- Purpose: Complete setup for E2E subscription tier testing
-- Created: October 29, 2025
-- =====================================================

-- =====================================================
-- Step 1: Create Auth Users (with encrypted passwords)
-- =====================================================

WITH credentials(email, password, role_type) AS (
  VALUES
    ('free@nbcon.org', 'Test1234@', 'client'),
    ('basic@nbcon.org', 'Test1234@', 'client'),
    ('info@nbcon.org', 'Qazwsx1234@', 'client'),
    ('mahdi.n.baylah@outlook.com', 'Qazwsx1234@', 'enterprise')
),
create_user AS (
  INSERT INTO auth.users (
    id, 
    instance_id, 
    role, 
    aud, 
    email, 
    raw_app_meta_data, 
    raw_user_meta_data,
    is_super_admin, 
    encrypted_password, 
    created_at, 
    updated_at, 
    last_sign_in_at,
    email_confirmed_at, 
    confirmation_sent_at, 
    confirmation_token, 
    recovery_token,
    email_change_token_new, 
    email_change
  )
  SELECT
    gen_random_uuid(), 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated',
    email, 
    json_build_object('provider', 'email', 'providers', ARRAY['email'])::jsonb,
    '{}'::jsonb, 
    FALSE,
    crypt(password, gen_salt('bf')), 
    NOW(), 
    NOW(), 
    NOW(), 
    NOW(), 
    NOW(), 
    '', 
    '', 
    '', 
    ''
  FROM credentials
  ON CONFLICT (email) DO UPDATE SET
    updated_at = NOW(),
    email_confirmed_at = NOW()
  RETURNING id, email
),
create_identity AS (
  INSERT INTO auth.identities (
    id, 
    provider, 
    user_id, 
    identity_data, 
    last_sign_in_at, 
    created_at, 
    updated_at
  )
  SELECT
    cu.id, 
    'email', 
    cu.id, 
    json_build_object('sub', cu.id::text, 'email', cu.email)::jsonb,
    NOW(), 
    NOW(), 
    NOW()
  FROM create_user cu
  ON CONFLICT (provider, id) DO UPDATE SET
    updated_at = NOW()
  RETURNING user_id
),
create_profile AS (
  INSERT INTO profiles (
    user_id,
    email,
    role,
    full_name,
    created_at,
    updated_at
  )
  SELECT
    cu.id,
    cu.email,
    c.role_type,
    CASE cu.email
      WHEN 'free@nbcon.org' THEN 'Free Test User'
      WHEN 'basic@nbcon.org' THEN 'Basic Test User'
      WHEN 'info@nbcon.org' THEN 'Pro Test User'
      WHEN 'mahdi.n.baylah@outlook.com' THEN 'Enterprise Test User'
    END,
    NOW(),
    NOW()
  FROM create_user cu
  JOIN credentials c ON c.email = cu.email
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    updated_at = NOW()
  RETURNING user_id, email
)
SELECT 
  cp.email,
  'Auth user + profile created' as status
FROM create_profile cp;

-- =====================================================
-- Step 2: Assign Subscriptions to Test Users
-- =====================================================

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
  
  -- Get Plan IDs
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
  
  -- Get User IDs
  SELECT user_id INTO v_free_user_id 
  FROM profiles 
  WHERE email = 'free@nbcon.org' 
  LIMIT 1;
  
  SELECT user_id INTO v_basic_user_id 
  FROM profiles 
  WHERE email = 'basic@nbcon.org' 
  LIMIT 1;
  
  SELECT user_id INTO v_pro_user_id 
  FROM profiles 
  WHERE email = 'info@nbcon.org' 
  LIMIT 1;
  
  SELECT user_id INTO v_enterprise_user_id 
  FROM profiles 
  WHERE email = 'mahdi.n.baylah@outlook.com' 
  LIMIT 1;
  
  -- Free User Subscription
  IF v_free_user_id IS NOT NULL AND v_free_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_free_user_id,
      v_free_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 year',
      'sub_test_free_' || substring(v_free_user_id::text, 1, 8),
      'cus_test_free_' || substring(v_free_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Free tier assigned to free@nbcon.org';
  ELSE
    RAISE WARNING '⚠️ Could not assign Free tier (user_id: %, plan_id: %)', v_free_user_id, v_free_plan_id;
  END IF;
  
  -- Basic User Subscription
  IF v_basic_user_id IS NOT NULL AND v_basic_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_basic_user_id,
      v_basic_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 year',
      'sub_test_basic_' || substring(v_basic_user_id::text, 1, 8),
      'cus_test_basic_' || substring(v_basic_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Basic tier assigned to basic@nbcon.org';
  ELSE
    RAISE WARNING '⚠️ Could not assign Basic tier (user_id: %, plan_id: %)', v_basic_user_id, v_basic_plan_id;
  END IF;
  
  -- Pro User Subscription
  IF v_pro_user_id IS NOT NULL AND v_pro_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_pro_user_id,
      v_pro_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 year',
      'sub_test_pro_' || substring(v_pro_user_id::text, 1, 8),
      'cus_test_pro_' || substring(v_pro_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Pro tier assigned to info@nbcon.org';
  ELSE
    RAISE WARNING '⚠️ Could not assign Pro tier (user_id: %, plan_id: %)', v_pro_user_id, v_pro_plan_id;
  END IF;
  
  -- Enterprise User Subscription
  IF v_enterprise_user_id IS NOT NULL AND v_enterprise_plan_id IS NOT NULL THEN
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    ) VALUES (
      v_enterprise_user_id,
      v_enterprise_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 year',
      'sub_test_enterprise_' || substring(v_enterprise_user_id::text, 1, 8),
      'cus_test_enterprise_' || substring(v_enterprise_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Enterprise tier assigned to mahdi.n.baylah@outlook.com';
  ELSE
    RAISE WARNING '⚠️ Could not assign Enterprise tier (user_id: %, plan_id: %)', v_enterprise_user_id, v_enterprise_plan_id;
  END IF;
  
  -- Initialize AI Quotas
  IF v_free_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_free_user_id, 'free');
    RAISE NOTICE '✅ AI quota initialized for Free user';
  END IF;
  
  IF v_basic_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_basic_user_id, 'basic');
    RAISE NOTICE '✅ AI quota initialized for Basic user';
  END IF;
  
  IF v_pro_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_pro_user_id, 'pro');
    RAISE NOTICE '✅ AI quota initialized for Pro user';
  END IF;
  
  IF v_enterprise_user_id IS NOT NULL THEN
    PERFORM initialize_user_quota(v_enterprise_user_id, 'enterprise');
    RAISE NOTICE '✅ AI quota initialized for Enterprise user';
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
  s.current_period_end,
  uq.monthly_token_quota,
  uq.tokens_used_this_month,
  uq.monthly_request_quota,
  uq.requests_used_this_month
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
-- Test Credentials
-- =====================================================

-- Free Tier:
--   Email: free@nbcon.org
--   Password: Test1234@
--   Expected: 10,000 tokens/month, 100 requests/month

-- Basic Tier:
--   Email: basic@nbcon.org
--   Password: Test1234@
--   Expected: 50,000 tokens/month, 500 requests/month

-- Pro Tier:
--   Email: info@nbcon.org
--   Password: Qazwsx1234@
--   Expected: 200,000 tokens/month, 2,000 requests/month

-- Enterprise Tier:
--   Email: mahdi.n.baylah@outlook.com
--   Password: Qazwsx1234@
--   Expected: 10,000,000 tokens/month, 10,000 requests/month

-- =====================================================
-- Next Steps
-- =====================================================

-- 1. Run this script: psql $SUPABASE_DB_URL -f database/scripts/create-auth-test-users.sql
-- 2. Verify results with the SELECT query above
-- 3. Run E2E tests: pnpm exec playwright test tests/e2e/subscriptionGating.spec.ts
-- 4. Login as each user to manually verify gating behavior

-- =====================================================

