# Phase C - Testing Guide

**Date:** 2025-02-02  
**Purpose:** Test admin access and tier-based access enforcement after Phase C migrations  
**Tasks:** 6.4 (Admin Access) and 6.5 (Tier Gating)

---

## Task 6.4: Test Admin Access via `is_admin` Flag

### Objective
Verify that users with `is_admin = true` can access admin resources and that admin RLS policies work correctly.

### Prerequisites
- Database migrations applied (Phase C complete)
- At least one test user with `is_admin = true`
- At least one test user with `is_admin = false`
- Admin resources/endpoints available for testing

### Test Cases

#### Test 1: Verify Admin User Can Access All Profiles
**SQL Verification:**
```sql
-- As admin user, verify can SELECT all profiles
SELECT COUNT(*) as accessible_profiles
FROM profiles;

-- Expected: Should return total count of profiles (all profiles)
```

**RLS Policy Check:**
```sql
-- Verify RLS policy exists
SELECT policyname, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND policyname LIKE '%admin%';

-- Expected: Policy should use is_admin check
```

#### Test 2: Verify Non-Admin User Can Only Access Own Profile
**SQL Verification:**
```sql
-- As non-admin user, verify can only SELECT own profile
SELECT user_id, email, is_admin
FROM profiles
WHERE user_id = auth.uid();

-- Expected: Should return only current user's profile
```

#### Test 3: Verify Admin Functions Work
**Functions to Test:**
- `has_feature_access(user_uuid, feature_name)` - Should return `true` for admins
- Admin-specific queries/endpoints

**SQL Test:**
```sql
-- Test has_feature_access for admin user
SELECT has_feature_access(
  (SELECT user_id FROM profiles WHERE is_admin = true LIMIT 1),
  'any_feature'
) as admin_access;

-- Expected: Should return true (admin has access to all features)
```

#### Test 4: Verify Admin RLS Policies Across Tables
**Tables with Admin Policies:**
- `admin_audit_logs`
- `admin_platform_analytics`
- `subscriptions` (admin view all)
- `payments` (admin view all)
- `invoices` (admin view all)
- `ai_events` (admin view all)
- `jobs` (admin view all)
- `user_ai_quotas` (admin view all)

**SQL Test:**
```sql
-- As admin, verify can access admin tables
SELECT COUNT(*) as admin_accessible
FROM admin_audit_logs;

-- Expected: Should return count (admin can view all)
```

### Manual Testing Steps

1. **Login as Admin User**
   - Verify `is_admin = true` in profile
   - Navigate to admin dashboard/resources
   - Should have access to all features

2. **Login as Non-Admin User**
   - Verify `is_admin = false` in profile
   - Navigate to admin dashboard/resources
   - Should be blocked/redirected

3. **Test Admin Endpoints**
   - Access admin-only API endpoints
   - Verify 200 OK for admin users
   - Verify 403 Forbidden for non-admin users

---

## Task 6.5: Test Tier-Based Access Enforcement

### Objective
Verify that subscription tier changes reflect correctly in access control and that tier-based gates work as expected.

### Prerequisites
- Test users with different subscription tiers: `free`, `basic`, `pro`, `enterprise`
- Stripe webhook configured or manual tier updates possible
- Feature gates/components tested

### Test Cases

#### Test 1: Verify Subscription Tier Column Updates
**SQL Verification:**
```sql
-- Check subscription_tier distribution
SELECT 
  subscription_tier,
  COUNT(*) as user_count
FROM profiles
GROUP BY subscription_tier
ORDER BY subscription_tier;

-- Expected: Users distributed across tiers (free, basic, pro, enterprise)
```

#### Test 2: Test Account Number Generation by Tier
**SQL Test:**
```sql
-- Test account number prefixes match tiers
SELECT 
  subscription_tier,
  account_number,
  SUBSTRING(account_number FROM 1 FOR CASE 
    WHEN subscription_tier = 'free' THEN 2
    ELSE 3
  END) as prefix
FROM profiles
WHERE account_number IS NOT NULL
ORDER BY subscription_tier, account_number;

-- Expected: 
-- free → FR*
-- basic → BAS*
-- pro → PRO*
-- enterprise → ENT*
```

#### Test 3: Test has_feature_access() by Tier
**Feature Mapping:**
- `free` tier: Limited features
- `basic` tier: Basic features
- `pro` tier: Pro features
- `enterprise` tier: All features
- `admin` (via is_admin): All features

**SQL Test:**
```sql
-- Test feature access for each tier
SELECT 
  p.subscription_tier,
  p.is_admin,
  has_feature_access(p.user_id, 'unlimited_jobs') as can_access_unlimited_jobs,
  has_feature_access(p.user_id, 'job_matching') as can_access_job_matching,
  has_feature_access(p.user_id, 'team_management') as can_access_team_management
FROM profiles p
WHERE subscription_tier IN ('free', 'basic', 'pro', 'enterprise')
  OR is_admin = true
LIMIT 10;

-- Expected: Access should match tier capabilities
```

#### Test 4: Test Tier Changes via Stripe Webhook
**Manual Steps:**
1. Simulate subscription upgrade via Stripe webhook
2. Verify `profiles.subscription_tier` updates
3. Verify access changes immediately
4. Test downgrade scenario

**SQL Verification:**
```sql
-- Before update
SELECT user_id, subscription_tier, is_admin
FROM profiles
WHERE email = 'test@example.com';

-- Simulate tier update (via webhook or manual)
UPDATE profiles
SET subscription_tier = 'pro'
WHERE email = 'test@example.com';

-- After update - verify change
SELECT user_id, subscription_tier, updated_at
FROM profiles
WHERE email = 'test@example.com';

-- Expected: subscription_tier updated, updated_at refreshed
```

#### Test 5: Test Feature Gates in Application
**Components to Test:**
- `FeatureGate` component
- `TierAwareSidebar` navigation
- Tier-based routing restrictions
- Upgrade prompts

**Manual Testing:**
1. **Free Tier User:**
   - Navigate to pro/enterprise features
   - Should see upgrade prompts
   - Limited features visible

2. **Pro Tier User:**
   - Navigate to pro features
   - Should have access
   - Enterprise features show upgrade prompt

3. **Enterprise Tier User:**
   - Navigate to all features
   - Should have full access

4. **Admin User:**
   - Navigate to any feature
   - Should have access (bypass tier gates)

#### Test 6: Verify Tier-Based Menu Visibility
**Test Menu Items:**
- Free tier: Basic menu items only
- Basic tier: Basic + some pro items
- Pro tier: Pro items visible
- Enterprise tier: All items visible
- Admin: All items (via is_admin bypass)

**SQL Test (check menu config):**
```typescript
// In application, verify menuConfig.ts
// Test getMenuForTier() function
// Should filter menu items based on subscription_tier
```

---

## Automated Test Script (Supabase SQL)

```sql
-- Comprehensive Tier & Admin Access Test
DO $$
DECLARE
  admin_user_id UUID;
  free_user_id UUID;
  pro_user_id UUID;
  test_result TEXT;
  pass_count INTEGER := 0;
  fail_count INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Phase C: Tier & Admin Access Tests';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';

  -- Get test users
  SELECT user_id INTO admin_user_id 
  FROM profiles WHERE is_admin = true LIMIT 1;
  
  SELECT user_id INTO free_user_id 
  FROM profiles WHERE subscription_tier = 'free' AND is_admin = false LIMIT 1;
  
  SELECT user_id INTO pro_user_id 
  FROM profiles WHERE subscription_tier = 'pro' AND is_admin = false LIMIT 1;

  -- Test 1: Admin has feature access
  IF admin_user_id IS NOT NULL THEN
    BEGIN
      IF has_feature_access(admin_user_id, 'any_feature') THEN
        RAISE NOTICE '✅ Test 1: Admin has feature access - PASS';
        pass_count := pass_count + 1;
      ELSE
        RAISE WARNING '❌ Test 1: Admin feature access - FAIL';
        fail_count := fail_count + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING '❌ Test 1: Admin feature access error - %', SQLERRM;
      fail_count := fail_count + 1;
    END;
  ELSE
    RAISE WARNING '⚠️  Test 1: No admin user found - SKIP';
  END IF;

  -- Test 2: Account number prefixes match tiers
  IF free_user_id IS NOT NULL THEN
    BEGIN
      SELECT account_number INTO test_result
      FROM profiles WHERE user_id = free_user_id;
      
      IF test_result LIKE 'FR%' THEN
        RAISE NOTICE '✅ Test 2: Free tier account prefix (FR) - PASS';
        pass_count := pass_count + 1;
      ELSE
        RAISE WARNING '❌ Test 2: Free tier account prefix - FAIL (got: %)', test_result;
        fail_count := fail_count + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING '❌ Test 2: Account prefix check error - %', SQLERRM;
    END;
  ELSE
    RAISE WARNING '⚠️  Test 2: No free tier user found - SKIP';
  END IF;

  IF pro_user_id IS NOT NULL THEN
    BEGIN
      SELECT account_number INTO test_result
      FROM profiles WHERE user_id = pro_user_id;
      
      IF test_result LIKE 'PRO%' THEN
        RAISE NOTICE '✅ Test 3: Pro tier account prefix (PRO) - PASS';
        pass_count := pass_count + 1;
      ELSE
        RAISE WARNING '❌ Test 3: Pro tier account prefix - FAIL (got: %)', test_result;
        fail_count := fail_count + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING '❌ Test 3: Account prefix check error - %', SQLERRM;
    END;
  ELSE
    RAISE WARNING '⚠️  Test 3: No pro tier user found - SKIP';
  END IF;

  -- Summary
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Test Summary:';
  RAISE NOTICE '  Passed: %', pass_count;
  RAISE NOTICE '  Failed: %', fail_count;
  RAISE NOTICE '========================================';
END
$$;
```

---

## Manual Testing Checklist

### Admin Access (Task 6.4)
- [ ] Admin user can view all profiles
- [ ] Admin user can access admin dashboard
- [ ] Admin user can view admin-only tables/data
- [ ] Non-admin user cannot access admin resources
- [ ] `has_feature_access()` returns true for admins
- [ ] RLS policies allow admin access

### Tier Gating (Task 6.5)
- [ ] Free tier users see limited features
- [ ] Pro tier users see pro features
- [ ] Enterprise tier users see all features
- [ ] Subscription tier updates reflect immediately
- [ ] Account numbers use correct tier prefixes
- [ ] Feature gates show upgrade prompts for locked features
- [ ] Menu items filter correctly by tier
- [ ] Admin users bypass tier gates

---

**Last Updated:** 2025-02-02  
**Next Review:** After completing tests 6.4 and 6.5

