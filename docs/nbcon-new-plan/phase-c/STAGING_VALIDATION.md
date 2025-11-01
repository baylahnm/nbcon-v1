# Phase C - Account Numbers Migration: Staging Validation Guide

**Migration:** `20250202000004_fix_account_number_functions.sql`  
**Date:** 2025-02-02  
**Status:** Ready for Staging Validation

---

## Pre-Migration Checklist

Before running the migration in staging, verify:

- [ ] Staging database is backed up
- [ ] `profiles.subscription_tier` column exists (from Phase B)
- [ ] `profiles.role` column does NOT exist (removed in Phase B)
- [ ] `account_numbers` table structure matches expected schema
- [ ] Staging environment matches production configuration

---

## Step 1: Run Migration

```bash
# Navigate to project root
cd /path/to/nbcon-v1

# Apply migration to staging Supabase project
supabase migration up --db-url <STAGING_DB_URL>

# OR if using Supabase CLI with linked project
supabase db push --db-url <STAGING_DB_URL>
```

**Expected Output:**
- Migration runs successfully
- Transaction commits
- Verification summary shows ✅ for all checks

---

## Step 2: Execute Verification Queries

Run each query below and verify expected results:

### 2.1 Test Function with Each Tier

```sql
-- Test generate_account_number() with each subscription tier
SELECT generate_account_number('free');      -- Expected: FR000001 (or FR000002 if accounts exist)
SELECT generate_account_number('basic');     -- Expected: BAS000001 (or next number)
SELECT generate_account_number('pro');       -- Expected: PRO000001 (or next number)
SELECT generate_account_number('enterprise'); -- Expected: ENT000001 (or next number)
SELECT generate_account_number('invalid');   -- Expected: USR000001 (fallback)
```

**Expected Results:**
- ✅ All functions return valid account numbers
- ✅ Prefixes match tier: FR, BAS, PRO, ENT
- ✅ Format: PREFIX + 6-digit number (e.g., `PRO000001`)
- ✅ Invalid tier returns `USR` prefix

---

### 2.2 Verify Trigger Exists

```sql
SELECT 
    trigger_name,
    event_object_table,
    event_manipulation,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'profiles'
  AND trigger_name = 'assign_account_number_trigger';
```

**Expected Results:**
- ✅ 1 row returned
- ✅ `event_manipulation` = 'INSERT'
- ✅ `action_timing` = 'BEFORE'

---

### 2.3 Test Account Number Generation on Profile INSERT

```sql
-- Create test profile with pro tier
INSERT INTO profiles (user_id, email, subscription_tier, full_name)
VALUES (gen_random_uuid(), 'test-pro@example.com', 'pro', 'Test Pro User')
RETURNING account_number, subscription_tier;

-- Verify account number was generated
SELECT account_number, subscription_tier 
FROM profiles 
WHERE email = 'test-pro@example.com';
```

**Expected Results:**
- ✅ Account number is generated automatically (NOT NULL)
- ✅ Account number starts with `PRO` prefix
- ✅ Account number has 6-digit suffix (e.g., `PRO000001`)

---

### 2.4 Test All Tier Prefixes

```sql
-- Insert test profiles for each tier
INSERT INTO profiles (user_id, email, subscription_tier, full_name) VALUES
  (gen_random_uuid(), 'test-free@example.com', 'free', 'Free User'),
  (gen_random_uuid(), 'test-basic@example.com', 'basic', 'Basic User'),
  (gen_random_uuid(), 'test-pro2@example.com', 'pro', 'Pro User'),
  (gen_random_uuid(), 'test-enterprise@example.com', 'enterprise', 'Enterprise User')
RETURNING email, subscription_tier, account_number;

-- Verify prefixes
SELECT 
  email,
  subscription_tier,
  account_number,
  SUBSTRING(account_number FROM 1 FOR CASE 
    WHEN subscription_tier = 'free' THEN 2
    ELSE 3
  END) as prefix
FROM profiles
WHERE email LIKE 'test-%@example.com'
ORDER BY subscription_tier;
```

**Expected Results:**
- ✅ 4 rows inserted successfully
- ✅ `free` → `FR*` prefix
- ✅ `basic` → `BAS*` prefix
- ✅ `pro` → `PRO*` prefix
- ✅ `enterprise` → `ENT*` prefix
- ✅ All account numbers are unique

---

### 2.5 Verify `account_numbers.role` Column is Dropped

```sql
SELECT column_name 
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'account_numbers'
  AND column_name = 'role';
```

**Expected Results:**
- ✅ 0 rows returned (column does not exist)

**Verify remaining columns:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'account_numbers'
ORDER BY ordinal_position;
```

**Expected Columns:**
- ✅ `id` (uuid, NOT NULL)
- ✅ `account_number` (text, NOT NULL)
- ✅ `user_id` (uuid, nullable)
- ✅ `created_at` (timestamptz, NOT NULL)
- ✅ `is_active` (boolean, nullable)
- ❌ `role` (should NOT exist)

---

### 2.6 Verify Function Signature

```sql
-- Check function parameters
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as parameters,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'generate_account_number';
```

**Expected Results:**
- ✅ 1 row returned
- ✅ `parameters` contains `subscription_tier text` (NOT `role_type user_role`)
- ✅ `return_type` = `text`

---

### 2.7 Test Counter Logic (Sequential Numbers)

```sql
-- Insert multiple profiles with same tier to verify counter increments
INSERT INTO profiles (user_id, email, subscription_tier, full_name) VALUES
  (gen_random_uuid(), 'pro-1@test.com', 'pro', 'Pro 1'),
  (gen_random_uuid(), 'pro-2@test.com', 'pro', 'Pro 2'),
  (gen_random_uuid(), 'pro-3@test.com', 'pro', 'Pro 3')
RETURNING email, account_number;

-- Verify sequential numbering
SELECT 
    account_number,
    SUBSTRING(account_number FROM 4)::INTEGER as number_part
FROM profiles
WHERE email LIKE 'pro-%@test.com'
ORDER BY account_number;
```

**Expected Results:**
- ✅ 3 rows inserted
- ✅ Account numbers are sequential: `PRO000001`, `PRO000002`, `PRO000003`
- ✅ Counter logic works correctly

---

## Step 3: Verify No Broken Dependencies

### 3.1 Check for Remaining Role References

```sql
-- Search for any remaining references to account_numbers.role
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_definition LIKE '%account_numbers.role%';
```

**Expected Results:**
- ✅ 0 rows returned (no functions reference the dropped column)

---

### 3.2 Test RLS Policies Still Work

```sql
-- Verify users can view their own account numbers (if RLS is enabled)
-- This requires authenticated context, test with actual user session

-- Check RLS policies on account_numbers
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'account_numbers';
```

**Expected Results:**
- ✅ Policies exist and don't reference `role` column
- ✅ Policies use `auth.uid()` and `user_id` correctly

---

## Step 4: Cleanup Test Data (Optional)

After validation, optionally clean up test data:

```sql
-- Remove test profiles created during validation
DELETE FROM profiles 
WHERE email LIKE 'test-%@example.com' 
   OR email LIKE 'pro-%@test.com';
```

---

## Step 5: Validation Sign-off

Once all verification queries pass:

- [ ] ✅ Function works with all tiers
- [ ] ✅ Trigger attached and functional
- [ ] ✅ Account numbers generated on INSERT
- [ ] ✅ All tier prefixes correct
- [ ] ✅ `role` column dropped
- [ ] ✅ Function signature updated
- [ ] ✅ Counter logic works sequentially
- [ ] ✅ No broken dependencies

**Next Steps:**
1. Mark checklist items 5.1a-5.1d as complete
2. Update Phase C status in `docs/nbcon-new-plan/status.md`
3. Proceed with remaining Phase C tasks (drop profiles.role, update other functions, etc.)

---

## Troubleshooting

### Issue: Migration fails with "column does not exist"

**Cause:** `account_numbers.role` column was already dropped in a previous migration.

**Fix:** Migration uses `DROP COLUMN IF EXISTS`, so this should not occur. If it does, check migration history.

---

### Issue: Account numbers not generated on INSERT

**Cause:** Trigger not firing or function error.

**Fix:**
1. Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'assign_account_number_trigger';`
2. Check function definition: `SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'assign_account_number';`
3. Check logs for function errors

---

### Issue: Wrong prefix generated

**Cause:** `subscription_tier` value doesn't match CASE statement.

**Fix:** Verify `subscription_tier` values in database match: `'free'`, `'basic'`, `'pro'`, `'enterprise'` (lowercase, exact match)

---

### Issue: Counter not incrementing

**Cause:** Counter query not finding existing accounts.

**Fix:** Verify counter query logic matches prefix length correctly (FR=2, BAS/PRO/ENT=3)

---

## Related Documentation

- Migration file: `supabase/migrations/20250202000004_fix_account_number_functions.sql`
- Audit document: `docs/nbcon-new-plan/phase-c/account_numbers.md`
- Phase C checklist: `docs/nbcon-new-plan/phase-c/README.md`

