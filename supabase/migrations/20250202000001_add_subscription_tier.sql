-- Migration: Add subscription_tier column to profiles table
-- Phase: Phase B - Access & Data Model (Section 4)
-- Version: NBCON PRO v2.0.1
-- Date: 2025-02-02
-- 
-- Purpose: Add subscription_tier column to profiles table as the first step
-- in migrating from role-based to tier-based access control.
--
-- This migration:
-- 1. Adds subscription_tier column with CHECK constraint
-- 2. Sets default value to 'free' for all existing and new rows
-- 3. Populates existing rows with 'free' tier
-- 4. Retains role column (will be removed in later migration)
--
-- See: docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)

BEGIN;

-- ============================================================================
-- STEP 1: Add subscription_tier column
-- ============================================================================

-- Add subscription_tier column with default 'free' and CHECK constraint
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' 
CHECK (subscription_tier IN ('free', 'basic', 'pro', 'enterprise'));

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.subscription_tier IS 
  'Subscription tier for plan-based access control (free → basic → pro → enterprise). 
   Replaces role-based access. Default is "free" for all users.';

-- ============================================================================
-- STEP 2: Populate existing rows with default 'free' tier
-- ============================================================================

-- Update all existing rows that have NULL subscription_tier (safety check)
UPDATE public.profiles
SET subscription_tier = 'free'
WHERE subscription_tier IS NULL;

-- Verify no NULL values remain
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count
  FROM public.profiles
  WHERE subscription_tier IS NULL;
  
  IF null_count > 0 THEN
    RAISE EXCEPTION 'Migration failed: % rows still have NULL subscription_tier', null_count;
  END IF;
  
  RAISE NOTICE 'All existing profiles migrated to subscription_tier = ''free''';
END $$;

-- ============================================================================
-- STEP 3: Create index for performance
-- ============================================================================

-- Add index for subscription_tier queries (used by FeatureGate and TierAwareSidebar)
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier 
ON public.profiles(subscription_tier);

-- Add comment for index
COMMENT ON INDEX idx_profiles_subscription_tier IS 
  'Index for subscription_tier to optimize tier-based access queries';

-- ============================================================================
-- STEP 4: Verification and logging
-- ============================================================================

-- Log migration statistics
DO $$
DECLARE
  total_profiles INTEGER;
  free_count INTEGER;
  basic_count INTEGER;
  pro_count INTEGER;
  enterprise_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_profiles FROM public.profiles;
  SELECT COUNT(*) INTO free_count FROM public.profiles WHERE subscription_tier = 'free';
  SELECT COUNT(*) INTO basic_count FROM public.profiles WHERE subscription_tier = 'basic';
  SELECT COUNT(*) INTO pro_count FROM public.profiles WHERE subscription_tier = 'pro';
  SELECT COUNT(*) INTO enterprise_count FROM public.profiles WHERE subscription_tier = 'enterprise';
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration Complete: Add subscription_tier';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total profiles: %', total_profiles;
  RAISE NOTICE 'Free tier: %', free_count;
  RAISE NOTICE 'Basic tier: %', basic_count;
  RAISE NOTICE 'Pro tier: %', pro_count;
  RAISE NOTICE 'Enterprise tier: %', enterprise_count;
  RAISE NOTICE '========================================';
  
  -- Safety check: all rows should be 'free' at this point (unless manually set)
  IF free_count != total_profiles AND basic_count = 0 AND pro_count = 0 AND enterprise_count = 0 THEN
    RAISE WARNING 'Unexpected tier distribution detected. Expected all rows to be ''free''.';
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Ensure role column is retained (not dropped)
-- ============================================================================

-- Safety check: verify role column still exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'role'
  ) THEN
    RAISE WARNING 'Role column not found in profiles table. This migration assumes role column exists.';
  ELSE
    RAISE NOTICE 'Role column confirmed present. It will be dropped in a later migration after RLS policies are updated.';
  END IF;
END $$;

COMMIT;

-- ============================================================================
-- POST-MIGRATION NOTES
-- ============================================================================
--
-- Next Steps:
-- 1. Update RLS policies to use subscription_tier + is_admin (see Phase B plan)
-- 2. Update frontend hooks (usePortalAccess) to read subscription_tier
-- 3. Test FeatureGate and TierAwareSidebar with new column
-- 4. After verification, drop role column in future migration (Phase C)
--
-- Rollback:
-- To rollback this migration, run:
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS subscription_tier;
--   DROP INDEX IF EXISTS idx_profiles_subscription_tier;
--
-- Testing:
-- Verify migration with:
--   SELECT subscription_tier, COUNT(*) 
--   FROM public.profiles 
--   GROUP BY subscription_tier;
--
-- Expected result: All rows should show 'free' (unless manually updated)
-- ============================================================================

