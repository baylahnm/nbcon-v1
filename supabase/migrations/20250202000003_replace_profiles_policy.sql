-- Migration: Replace profiles policy to use is_admin instead of get_user_role()
-- Phase: Phase B - Access & Data Model (Section 4)
-- Version: NBCON PRO v2.0.1
-- Date: 2025-02-02
-- 
-- Purpose: Replace legacy role-based RLS policy with tier-based is_admin check.
-- 
-- This migration:
-- 1. Drops existing policy "Admins can view all profiles using function" that uses get_user_role()
-- 2. Creates new policy "Admins can view all profiles" using direct is_admin check
-- 3. Ensures both self-access and admin-access are preserved
--
-- See: docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)
-- See: docs/nbcon-new-plan/2 5- 🗄️ Phase C Database & RLS Cleanup (Section 5)

BEGIN;

-- ============================================================================
-- STEP 1: Drop existing policy that uses get_user_role()
-- ============================================================================

DO $$
BEGIN
    -- Drop the old policy if it exists
    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'profiles' 
          AND policyname = 'Admins can view all profiles using function'
    ) THEN
        DROP POLICY "Admins can view all profiles using function" ON public.profiles;
        RAISE NOTICE 'Dropped policy: "Admins can view all profiles using function"';
    ELSE
        RAISE NOTICE 'Policy "Admins can view all profiles using function" does not exist (may have been dropped already)';
    END IF;
END
$$;

-- ============================================================================
-- STEP 2: Create new policy using direct is_admin check
-- ============================================================================

DO $$
BEGIN
    -- Check if policy already exists (from previous migration attempts)
    IF EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'profiles' 
          AND policyname = 'Admins can view all profiles'
    ) THEN
        -- Drop existing policy first
        DROP POLICY "Admins can view all profiles" ON public.profiles;
        RAISE NOTICE 'Dropped existing "Admins can view all profiles" policy (will recreate)';
    END IF;

    -- Policy allows:
    -- 1. Users to view their own profile (auth.uid() = user_id)
    -- 2. Admins to view all profiles (is_admin = true)
    EXECUTE '
        CREATE POLICY "Admins can view all profiles"
        ON public.profiles
        FOR SELECT
        USING (
            -- Self-access: user can view their own profile
            auth.uid() = user_id
            OR
            -- Admin-access: admins can view any profile
            EXISTS (
                SELECT 1 
                FROM public.profiles 
                WHERE user_id = auth.uid() 
                AND is_admin = true
            )
        )
    ';

    RAISE NOTICE 'Created policy: "Admins can view all profiles" using is_admin check';
END
$$;

-- Add comment for documentation
COMMENT ON POLICY "Admins can view all profiles" ON public.profiles IS 
  'Allows users to view their own profile, and admins (is_admin = true) to view all profiles.
   Replaces legacy get_user_role() check with direct is_admin boolean lookup.
   Phase B: Tier-based access control migration.';

-- ============================================================================
-- STEP 3: Verify policy was created correctly
-- ============================================================================

DO $$
DECLARE
    policy_exists BOOLEAN;
    using_clause TEXT;
BEGIN
    -- Check if new policy exists
    SELECT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'profiles' 
          AND policyname = 'Admins can view all profiles'
    ) INTO policy_exists;

    IF NOT policy_exists THEN
        RAISE EXCEPTION 'Policy "Admins can view all profiles" was not created';
    END IF;

    -- Verify USING clause contains is_admin check
    SELECT qual INTO using_clause
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Admins can view all profiles';

    IF using_clause IS NULL OR using_clause !~* 'is_admin' THEN
        RAISE EXCEPTION 'Policy USING clause does not contain is_admin check: %', using_clause;
    END IF;

    IF using_clause ~* 'get_user_role' THEN
        RAISE EXCEPTION 'Policy still references get_user_role(): %', using_clause;
    END IF;

    RAISE NOTICE 'Verification successful: Policy created with is_admin check';
    RAISE NOTICE 'USING clause: %', using_clause;
END
$$;

-- ============================================================================
-- STEP 4: Log migration completion
-- ============================================================================

DO $$
DECLARE
    old_policy_count INTEGER;
    new_policy_count INTEGER;
BEGIN
    -- Count policies with get_user_role() reference (should be 0)
    SELECT COUNT(*) INTO old_policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND (
        qual ILIKE '%get_user_role()%'
        OR with_check ILIKE '%get_user_role()%'
      );

    -- Count new is_admin-based policy (should be 1)
    SELECT COUNT(*) INTO new_policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Admins can view all profiles'
      AND (
        qual ILIKE '%is_admin%'
        OR with_check ILIKE '%is_admin%'
      );

    RAISE NOTICE '';
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE '  Policies with get_user_role() on profiles: %', old_policy_count;
    RAISE NOTICE '  New is_admin-based policies on profiles: %', new_policy_count;
    RAISE NOTICE '';
    
    IF old_policy_count > 0 THEN
        RAISE WARNING 'Warning: Found % policies still using get_user_role() on profiles table', old_policy_count;
    END IF;

    IF new_policy_count = 0 THEN
        RAISE EXCEPTION 'Migration failed: New is_admin-based policy not found';
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
--   -- Drop new policy
--   DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
--   
--   -- Restore old policy (if needed)
--   CREATE POLICY "Admins can view all profiles using function"
--   ON public.profiles
--   FOR SELECT
--   USING ((get_user_role() = 'admin'::text) OR (auth.uid() = user_id));
-- COMMIT;
--
-- Note: Rollback should only be used if the new policy causes access issues.
-- The new policy maintains the same access pattern with improved performance.
--
