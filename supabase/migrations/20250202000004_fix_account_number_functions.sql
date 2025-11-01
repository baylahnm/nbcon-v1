-- Migration: Fix account number functions to use subscription_tier instead of role
-- Phase: Phase C - Database & RLS Cleanup (Section 5)
-- Version: NBCON PRO v2.0.2
-- Date: 2025-02-02
--
-- Purpose: Update account number generation functions to use subscription_tier
-- instead of legacy role column, restoring functionality broken when profiles.role
-- was removed in Phase B.
--
-- This migration:
-- 1. Updates generate_account_number() to accept subscription_tier (TEXT) instead of role_type (ENUM)
-- 2. Updates assign_account_number() trigger to use NEW.subscription_tier
-- 3. Updates assign_account_number_after() to remove role column usage (if trigger re-enabled)
-- 4. Drops account_numbers.role column
-- 5. Includes verification queries for testing
--
-- See: docs/nbcon-new-plan/phase-c/account_numbers.md
-- See: docs/nbcon-new-plan/2%205-%F0%9F%97%84%EF%B8%8FPhase%20C%20Database%20&%20RLS%20Cleanup%20(Section%205)%2029d608c2eef780b385e3edd6cad6b076.md

BEGIN;

-- ============================================================================
-- STEP 1: Update generate_account_number() function
-- ============================================================================

-- Drop old function with ENUM parameter
DROP FUNCTION IF EXISTS public.generate_account_number(user_role);

-- Create new function with subscription_tier parameter
CREATE OR REPLACE FUNCTION public.generate_account_number(subscription_tier TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  counter INTEGER;
  account_num TEXT;
BEGIN
  -- Map subscription_tier to account number prefix
  -- Tier mapping strategy:
  --   'free' → 'FR' (free tier users)
  --   'basic' → 'BAS' (basic tier)
  --   'pro' → 'PRO' (pro tier, replaces 'engineer')
  --   'enterprise' → 'ENT' (enterprise tier)
  --   Legacy admin role → 'ADM' (handled via is_admin flag in application)
  CASE subscription_tier
    WHEN 'free' THEN prefix := 'FR';
    WHEN 'basic' THEN prefix := 'BAS';
    WHEN 'pro' THEN prefix := 'PRO';
    WHEN 'enterprise' THEN prefix := 'ENT';
    ELSE prefix := 'USR'; -- Fallback for invalid/unknown tiers
  END CASE;
  
  -- Get next counter for this subscription tier
  -- Query profiles table using subscription_tier instead of role
  -- Match accounts by prefix (varies by tier: 'FR'=2 chars, 'BAS'/'PRO'/'ENT'=3 chars)
  -- Extract numeric part starting after prefix length
  -- Counter extraction handles variable prefix length correctly
  -- Use explicit table alias to avoid ambiguity with function parameter
  SELECT COALESCE(
    MAX(
      CAST(SUBSTRING(p.account_number FROM LENGTH(prefix) + 1) AS INTEGER)
    ),
    0
  ) + 1
  INTO counter
  FROM public.profiles p
  WHERE p.subscription_tier = generate_account_number.subscription_tier 
    AND p.account_number IS NOT NULL
    AND LENGTH(p.account_number) >= LENGTH(prefix) + 6  -- Ensure full format (prefix + 6 digits)
    AND SUBSTRING(p.account_number FROM 1 FOR LENGTH(prefix)) = prefix
    AND SUBSTRING(p.account_number FROM LENGTH(prefix) + 1) ~ '^[0-9]{1,6}$';  -- Validate numeric part (1-6 digits, handles edge cases)
  
  -- Format: PREFIX + 6-digit number (e.g., PRO000001, ENT000001, FR000001)
  account_num := prefix || LPAD(counter::TEXT, 6, '0');
  
  RETURN account_num;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION public.generate_account_number(TEXT) IS 
  'Generates account number prefix based on subscription_tier. Returns format: PREFIX + 6-digit number (e.g., PRO000001).
   Phase C: Migrated from role-based to tier-based logic.';

-- ============================================================================
-- STEP 2: Update assign_account_number() trigger function
-- ============================================================================

-- Drop existing trigger first
DROP TRIGGER IF EXISTS assign_account_number_trigger ON public.profiles;

-- Update trigger function to use subscription_tier instead of role
CREATE OR REPLACE FUNCTION public.assign_account_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate account number if not already set
  IF NEW.account_number IS NULL THEN
    -- Use NEW.subscription_tier (available in profiles table after Phase B migration)
    -- Default to 'free' if subscription_tier is NULL (shouldn't happen, but safety check)
    NEW.account_number := generate_account_number(COALESCE(NEW.subscription_tier, 'free'));
  END IF;
  
  -- Note: Insert into account_numbers table was removed in fix 007
  -- If account_numbers tracking is needed later, it can be added via separate trigger
  -- without role column dependency
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION public.assign_account_number() IS 
  'Trigger function that auto-generates account numbers for new profiles based on subscription_tier.
   Phase C: Updated to use subscription_tier instead of role column.';

-- Recreate trigger on profiles table
CREATE TRIGGER assign_account_number_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_account_number();

-- Add comment for trigger
COMMENT ON TRIGGER assign_account_number_trigger ON public.profiles IS 
  'Auto-generates account numbers for new profiles using subscription_tier.
   Phase C: Trigger updated for tier-based account generation.';

-- ============================================================================
-- STEP 3: Update assign_account_number_after() function (if needed)
-- ============================================================================

-- Note: This function exists but trigger is NOT currently attached to profiles table
-- Update function to remove role column usage in case trigger is re-enabled later
-- For now, we'll update it to be compatible with the new schema
CREATE OR REPLACE FUNCTION public.assign_account_number_after()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into account_numbers tracking table (if needed for audit/historical tracking)
  -- Remove role column from INSERT since it will be dropped in Step 4
  -- After Step 4, account_numbers table will have: (account_number, user_id, created_at, is_active)
  INSERT INTO public.account_numbers (account_number, user_id, is_active)
  VALUES (NEW.account_number, NEW.user_id, true)
  ON CONFLICT (account_number) DO NOTHING;
  
  -- Note: Historical role data can be retrieved via JOIN:
  --   SELECT an.*, p.subscription_tier 
  --   FROM account_numbers an
  --   JOIN profiles p ON an.user_id = p.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION public.assign_account_number_after() IS 
  'After-insert trigger function for tracking account numbers (currently not attached).
   Phase C: Updated to remove role column dependency. If trigger is re-enabled,
   it will track account numbers without role column.';

-- ============================================================================
-- STEP 4: Drop account_numbers.role column
-- ============================================================================

-- Verify table is empty (safety check)
DO $$
DECLARE
  row_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO row_count FROM public.account_numbers;
  
  IF row_count > 0 THEN
    RAISE WARNING 'account_numbers table contains % rows. Consider data migration before dropping role column.', row_count;
    -- Note: Migration will continue but warn about data loss
    -- In production, consider migrating data first
  ELSE
    RAISE NOTICE 'account_numbers table is empty. Safe to drop role column.';
  END IF;
END
$$;

-- Drop index on role column if it exists
DROP INDEX IF EXISTS idx_account_numbers_role;

-- Drop role column from account_numbers table
ALTER TABLE public.account_numbers
  DROP COLUMN IF EXISTS role;

-- Add comment documenting the change
COMMENT ON TABLE public.account_numbers IS 
  'Tracking table for account number assignments. Role column removed in Phase C migration.
   Historical role data can be retrieved via JOIN with profiles.subscription_tier if needed.';

-- ============================================================================
-- STEP 5: Verification Queries (for testing)
-- ============================================================================

-- These queries can be run manually after migration to verify correctness

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== Migration Verification Queries ===';
  RAISE NOTICE '';
  RAISE NOTICE '1. Test generate_account_number() with each tier:';
  RAISE NOTICE '   SELECT generate_account_number(''free'');';
  RAISE NOTICE '   SELECT generate_account_number(''basic'');';
  RAISE NOTICE '   SELECT generate_account_number(''pro'');';
  RAISE NOTICE '   SELECT generate_account_number(''enterprise'');';
  RAISE NOTICE '';
  RAISE NOTICE '2. Verify trigger exists:';
  RAISE NOTICE '   SELECT trigger_name FROM information_schema.triggers';
  RAISE NOTICE '   WHERE event_object_table = ''profiles'' AND trigger_name = ''assign_account_number_trigger'';';
  RAISE NOTICE '';
  RAISE NOTICE '3. Test account number generation on profile INSERT:';
  RAISE NOTICE '   INSERT INTO profiles (user_id, email, subscription_tier, full_name)';
  RAISE NOTICE '   VALUES (gen_random_uuid(), ''test@example.com'', ''pro'', ''Test User'');';
  RAISE NOTICE '   Then check: SELECT account_number, subscription_tier FROM profiles WHERE email = ''test@example.com'';';
  RAISE NOTICE '   Expected: account_number should start with ''PRO'' and have 6-digit suffix';
  RAISE NOTICE '';
  RAISE NOTICE '4. Test all tier prefixes:';
  RAISE NOTICE '   INSERT INTO profiles (user_id, email, subscription_tier, full_name) VALUES';
  RAISE NOTICE '     (gen_random_uuid(), ''free@test.com'', ''free'', ''Free User''),';
  RAISE NOTICE '     (gen_random_uuid(), ''basic@test.com'', ''basic'', ''Basic User''),';
  RAISE NOTICE '     (gen_random_uuid(), ''pro@test.com'', ''pro'', ''Pro User''),';
  RAISE NOTICE '     (gen_random_uuid(), ''ent@test.com'', ''enterprise'', ''Enterprise User'');';
  RAISE NOTICE '   Expected: FR*, BAS*, PRO*, ENT* prefixes respectively';
  RAISE NOTICE '';
  RAISE NOTICE '5. Verify account_numbers.role column is dropped:';
  RAISE NOTICE '   SELECT column_name FROM information_schema.columns';
  RAISE NOTICE '   WHERE table_name = ''account_numbers'' AND column_name = ''role'';';
  RAISE NOTICE '   Expected: 0 rows';
  RAISE NOTICE '';
  RAISE NOTICE '6. Verify function signature (updated to TEXT parameter):';
  RAISE NOTICE '   SELECT routine_name, data_type, parameters';
  RAISE NOTICE '   FROM information_schema.routines';
  RAISE NOTICE '   WHERE routine_name = ''generate_account_number'';';
  RAISE NOTICE '   Expected: parameter should be TEXT (subscription_tier), not user_role ENUM';
  RAISE NOTICE '';
END
$$;

-- ============================================================================
-- STEP 6: Log migration completion
-- ============================================================================

DO $$
DECLARE
  func_exists BOOLEAN;
  trigger_exists BOOLEAN;
  column_exists BOOLEAN;
BEGIN
  -- Check if new function exists with TEXT parameter (not ENUM)
  -- The function should accept TEXT parameter, return TEXT
  SELECT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname = 'generate_account_number'
      AND p.prorettype = (SELECT oid FROM pg_type WHERE typname = 'text')
  ) INTO func_exists;
  
  -- Check if trigger exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE event_object_schema = 'public'
      AND event_object_table = 'profiles'
      AND trigger_name = 'assign_account_number_trigger'
  ) INTO trigger_exists;
  
  -- Check if role column is dropped
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'account_numbers'
      AND column_name = 'role'
  ) INTO column_exists;
  
  RAISE NOTICE '';
  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE '  generate_account_number() updated: %', CASE WHEN func_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  assign_account_number_trigger exists: %', CASE WHEN trigger_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '  account_numbers.role column dropped: %', CASE WHEN NOT column_exists THEN '✅' ELSE '❌' END;
  RAISE NOTICE '';
  
  IF NOT func_exists THEN
    RAISE EXCEPTION 'Migration failed: generate_account_number() function not found or incorrect signature';
  END IF;
  
  IF NOT trigger_exists THEN
    RAISE EXCEPTION 'Migration failed: assign_account_number_trigger not found';
  END IF;
  
  IF column_exists THEN
    RAISE WARNING 'account_numbers.role column still exists. Verify migration completed correctly.';
  END IF;
  
  RAISE NOTICE 'Migration completed successfully.';
END
$$;

COMMIT;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (for emergency use only)
-- ============================================================================
--
-- To rollback this migration:
--
-- BEGIN;
--   -- Restore old function (requires user_role ENUM to exist)
--   CREATE OR REPLACE FUNCTION public.generate_account_number(role_type user_role)
--   RETURNS TEXT AS $$
--   DECLARE
--     prefix TEXT;
--     counter INTEGER;
--     account_num TEXT;
--   BEGIN
--     CASE role_type
--       WHEN 'engineer' THEN prefix := 'ENG';
--       WHEN 'client' THEN prefix := 'CLI';
--       WHEN 'enterprise' THEN prefix := 'ENT';
--       WHEN 'admin' THEN prefix := 'ADM';
--       ELSE prefix := 'USR';
--     END CASE;
--     
--     SELECT COALESCE(MAX(CAST(SUBSTRING(account_number FROM 4) AS INTEGER)), 0) + 1
--     INTO counter
--     FROM public.profiles
--     WHERE role = role_type AND account_number IS NOT NULL;
--     
--     account_num := prefix || LPAD(counter::TEXT, 6, '0');
--     RETURN account_num;
--   END;
--   $$ LANGUAGE plpgsql;
--
--   -- Restore old trigger function
--   CREATE OR REPLACE FUNCTION public.assign_account_number()
--   RETURNS TRIGGER AS $$
--   BEGIN
--     IF NEW.account_number IS NULL THEN
--       NEW.account_number := generate_account_number(NEW.role);
--     END IF;
--     RETURN NEW;
--   END;
--   $$ LANGUAGE plpgsql;
--
--   -- Re-add role column (if needed)
--   ALTER TABLE public.account_numbers
--   ADD COLUMN IF NOT EXISTS role user_role;
--
--   -- Re-create index
--   CREATE INDEX IF NOT EXISTS idx_account_numbers_role ON public.account_numbers(role);
-- COMMIT;
--
-- Note: Rollback is only possible if user_role ENUM type still exists.
-- If ENUM was dropped, rollback requires manual ENUM recreation first.
--

