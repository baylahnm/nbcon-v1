-- ===========================================================
-- NBCON Test Tier Seed
-- Location: tests/e2e/setup/seed-tier-users.sql
-- Purpose: Ensure Playwright tier navigation tests have
--          deterministic Supabase data for all subscription tiers.
-- ===========================================================

-- ===========================================================
-- Step 1: Create / Update Auth Users + Profiles
-- ===========================================================
WITH credentials AS (
  SELECT *
  FROM (VALUES
    ('free@nbcon.org',       'Test1234@',    'free',        'Free',        'User',       false),
    ('basic@nbcon.org',      'Test1234@',    'basic',       'Basic',       'User',       false),
    ('info@nbcon.org',       'Qazwsx1234@',  'pro',         'Pro',         'User',       false),
    ('mahdi.n.baylah@outlook.com', 'Qazwsx1234@',  'enterprise',  'Enterprise',  'User',       false)
  ) AS t(email, password, subscription_tier, first_name, last_name, is_admin)
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
    c.email,
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    '{}'::jsonb,
    FALSE,
    crypt(c.password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  FROM credentials c
  ON CONFLICT (email) DO UPDATE SET
    updated_at = NOW(),
    email_confirmed_at = NOW(),
    last_sign_in_at = NOW()
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
    jsonb_build_object('sub', cu.id::text, 'email', cu.email),
    NOW(),
    NOW(),
    NOW()
  FROM create_user cu
  ON CONFLICT (provider, id) DO UPDATE SET
    updated_at = NOW(),
    last_sign_in_at = NOW()
  RETURNING user_id
)
INSERT INTO public.profiles (
  user_id,
  email,
  first_name,
  last_name,
  subscription_tier,
  is_admin,
  created_at,
  updated_at
)
SELECT
  cu.id,
  c.email,
  c.first_name,
  c.last_name,
  c.subscription_tier,
  c.is_admin,
  NOW(),
  NOW()
FROM create_user cu
JOIN credentials c ON c.email = cu.email
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  subscription_tier = EXCLUDED.subscription_tier,
  is_admin = EXCLUDED.is_admin,
  updated_at = NOW();

-- ===========================================================
-- Step 2: Assign Subscription Plans Per Tier
-- ===========================================================
DO $$
DECLARE
  v_free_user_id        UUID;
  v_basic_user_id       UUID;
  v_pro_user_id         UUID;
  v_enterprise_user_id  UUID;

  v_free_plan_id        UUID;
  v_basic_plan_id       UUID;
  v_pro_plan_id         UUID;
  v_enterprise_plan_id  UUID;

  v_period_end          TIMESTAMP WITH TIME ZONE := NOW() + INTERVAL '30 days';
  v_has_quota_fn        BOOLEAN := FALSE;
BEGIN
  -- Resolve user ids
  SELECT id INTO v_free_user_id FROM auth.users WHERE email = 'free@nbcon.org';
  SELECT id INTO v_basic_user_id FROM auth.users WHERE email = 'basic@nbcon.org';
  SELECT id INTO v_pro_user_id FROM auth.users WHERE email = 'info@nbcon.org';
  SELECT id INTO v_enterprise_user_id FROM auth.users WHERE email = 'mahdi.n.baylah@outlook.com';

  -- Resolve subscription plan ids
  SELECT id INTO v_free_plan_id FROM public.subscription_plans WHERE plan_type = 'free' LIMIT 1;
  SELECT id INTO v_basic_plan_id FROM public.subscription_plans WHERE plan_type = 'basic' LIMIT 1;
  SELECT id INTO v_pro_plan_id FROM public.subscription_plans WHERE plan_type IN ('pro', 'premium') ORDER BY CASE WHEN plan_type = 'pro' THEN 0 ELSE 1 END LIMIT 1;
  SELECT id INTO v_enterprise_plan_id FROM public.subscription_plans WHERE plan_type = 'enterprise' LIMIT 1;

  -- Check if initialize_user_quota function exists (optional dependency)
  SELECT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'initialize_user_quota'
      AND pg_function_is_visible(oid)
  ) INTO v_has_quota_fn;

  IF v_free_user_id IS NOT NULL AND v_free_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    )
    VALUES (
      v_free_user_id,
      v_free_plan_id,
      'active',
      NOW(),
      v_period_end,
      'sub_test_free_' || substr(v_free_user_id::text, 1, 8),
      'cus_test_free_' || substr(v_free_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();

    UPDATE public.profiles
    SET subscription_tier = 'free', updated_at = NOW()
    WHERE user_id = v_free_user_id;

    IF v_has_quota_fn THEN
      PERFORM public.initialize_user_quota(v_free_user_id, 'free');
    END IF;
  END IF;

  IF v_basic_user_id IS NOT NULL AND v_basic_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    )
    VALUES (
      v_basic_user_id,
      v_basic_plan_id,
      'active',
      NOW(),
      v_period_end,
      'sub_test_basic_' || substr(v_basic_user_id::text, 1, 8),
      'cus_test_basic_' || substr(v_basic_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();

    UPDATE public.profiles
    SET subscription_tier = 'basic', updated_at = NOW()
    WHERE user_id = v_basic_user_id;

    IF v_has_quota_fn THEN
      PERFORM public.initialize_user_quota(v_basic_user_id, 'basic');
    END IF;
  END IF;

  IF v_pro_user_id IS NOT NULL AND v_pro_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    )
    VALUES (
      v_pro_user_id,
      v_pro_plan_id,
      'active',
      NOW(),
      v_period_end,
      'sub_test_pro_' || substr(v_pro_user_id::text, 1, 8),
      'cus_test_pro_' || substr(v_pro_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();

    UPDATE public.profiles
    SET subscription_tier = 'pro', updated_at = NOW()
    WHERE user_id = v_pro_user_id;

    IF v_has_quota_fn THEN
      PERFORM public.initialize_user_quota(v_pro_user_id, 'pro');
    END IF;
  END IF;

  IF v_enterprise_user_id IS NOT NULL AND v_enterprise_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_id,
      plan_id,
      subscription_status,
      current_period_start,
      current_period_end,
      stripe_subscription_id,
      stripe_customer_id
    )
    VALUES (
      v_enterprise_user_id,
      v_enterprise_plan_id,
      'active',
      NOW(),
      NOW() + INTERVAL '1 year',
      'sub_test_enterprise_' || substr(v_enterprise_user_id::text, 1, 8),
      'cus_test_enterprise_' || substr(v_enterprise_user_id::text, 1, 8)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan_id = EXCLUDED.plan_id,
      subscription_status = EXCLUDED.subscription_status,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = NOW();

    UPDATE public.profiles
    SET subscription_tier = 'enterprise', updated_at = NOW()
    WHERE user_id = v_enterprise_user_id;

    IF v_has_quota_fn THEN
      PERFORM public.initialize_user_quota(v_enterprise_user_id, 'enterprise');
    END IF;
  END IF;
END $$;

-- ===========================================================
-- Step 3: Verification Snapshot
-- ===========================================================
SELECT
  p.email,
  p.subscription_tier,
  p.is_admin,
  s.subscription_status,
  sp.plan_type,
  s.current_period_end
FROM public.profiles p
LEFT JOIN public.subscriptions s ON s.user_id = p.user_id AND s.subscription_status = 'active'
LEFT JOIN public.subscription_plans sp ON sp.id = s.plan_id
WHERE p.email IN (
  'free@nbcon.org',
  'basic@nbcon.org',
  'info@nbcon.org',
  'mahdi.n.baylah@outlook.com'
)
ORDER BY p.subscription_tier;
