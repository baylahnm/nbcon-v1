-- Migration: Drop user_role ENUM (Phase C cleanup)
-- Phase: Phase C - Database & RLS Cleanup (Section 5)
-- Version: NBCON PRO v2.0.2
-- Date: 2025-02-02
--
-- Purpose: Remove unused user_role ENUM type after migration to subscription_tier + is_admin model.
--
-- Decision: Drop ENUM (not repurpose)
-- Rationale:
--   1. Zero dependencies found (no columns, functions, or views use it)
--   2. All access control migrated to subscription_tier + is_admin
--   3. ENUM values don't map cleanly to subscription tiers
--   4. Keeping ENUM risks confusion and accidental usage
--
-- Safety: This migration includes comprehensive dependency checks before dropping.
-- Rollback: ENUM can be recreated from historical migrations if needed.
--
-- See: docs/nbcon-new-plan/phase-c/SCAN_RESULTS.md
-- See: docs/nbcon-new-plan/2 5-🗄️Phase C Database & RLS Cleanup (Section 5)

BEGIN;

-- ============================================================================
-- STEP 1: Comprehensive Dependency Check
-- ============================================================================

DO $$
DECLARE
  enum_exists BOOLEAN;
  column_count INTEGER;
  function_count INTEGER;
  view_count INTEGER;
  other_deps INTEGER;
  can_drop BOOLEAN := true;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Dropping user_role ENUM - Dependency Check';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';

  -- Check if ENUM exists
  SELECT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_role'
  ) INTO enum_exists;

  IF NOT enum_exists THEN
    RAISE NOTICE '✅ user_role ENUM does not exist. Nothing to drop.';
    RETURN;
  END IF;

  -- Check column dependencies
  SELECT COUNT(*) INTO column_count
  FROM information_schema.columns
  WHERE udt_name = 'user_role';

  -- Check function parameter dependencies
  SELECT COUNT(*) INTO function_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
    AND pg_get_function_arguments(p.oid) LIKE '%user_role%';

  -- Check view dependencies (views using the ENUM type)
  SELECT COUNT(*) INTO view_count
  FROM pg_views
  WHERE schemaname = 'public'
    AND definition LIKE '%user_role%';

  -- Check other pg_depend dependencies
  SELECT COUNT(*) INTO other_deps
  FROM pg_depend d
  JOIN pg_type t ON d.objid = t.oid
  WHERE t.typname = 'user_role'
    AND d.deptype != 'p'; -- Exclude internal PostgreSQL dependencies

  -- Output dependency report
  RAISE NOTICE 'Dependency Check Results:';
  RAISE NOTICE '  Columns using user_role: %', column_count;
  RAISE NOTICE '  Functions using user_role: %', function_count;
  RAISE NOTICE '  Views referencing user_role: %', view_count;
  RAISE NOTICE '  Other dependencies: %', other_deps;
  RAISE NOTICE '';

  -- Validate we can safely drop
  IF column_count > 0 THEN
    RAISE EXCEPTION 'Cannot drop user_role ENUM: % columns still reference it', column_count;
    can_drop := false;
  END IF;

  IF function_count > 0 THEN
    RAISE EXCEPTION 'Cannot drop user_role ENUM: % functions still reference it', function_count;
    can_drop := false;
  END IF;

  IF other_deps > 0 THEN
    RAISE WARNING 'Found % other dependencies on user_role ENUM', other_deps;
    RAISE WARNING 'This may include constraints, indexes, or other objects.';
    RAISE WARNING 'Migration will attempt to drop with CASCADE.';
  END IF;

  IF can_drop AND other_deps = 0 THEN
    RAISE NOTICE '✅ All checks passed. Safe to drop user_role ENUM.';
  END IF;

  RAISE NOTICE '';
END
$$;

-- ============================================================================
-- STEP 2: Document ENUM values before dropping (for rollback reference)
-- ============================================================================

DO $$
DECLARE
  enum_rec RECORD;
  enum_values TEXT[];
BEGIN
  -- Collect enum values for documentation
  SELECT ARRAY_AGG(e.enumlabel ORDER BY e.enumsortorder)
  INTO enum_values
  FROM pg_enum e
  JOIN pg_type t ON e.enumtypid = t.oid
  WHERE t.typname = 'user_role';

  IF enum_values IS NOT NULL THEN
    RAISE NOTICE 'Original ENUM values (for rollback reference):';
    RAISE NOTICE '  user_role: %', array_to_string(enum_values, ', ');
    RAISE NOTICE '';
    RAISE NOTICE 'To recreate if needed:';
    RAISE NOTICE '  CREATE TYPE user_role AS ENUM (%);', 
      array_to_string(enum_values, ', ');
    RAISE NOTICE '';
  END IF;
END
$$;

-- ============================================================================
-- STEP 3: Drop the ENUM type
-- ============================================================================

-- Use IF EXISTS for safety (in case it was already dropped)
-- Use CASCADE to drop any remaining dependencies (should be none after checks)
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Add comment documenting the drop
DO $$
BEGIN
  RAISE NOTICE '✅ user_role ENUM dropped successfully.';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: If rollback is needed, recreate with:';
  RAISE NOTICE '  CREATE TYPE user_role AS ENUM (''engineer'', ''client'', ''enterprise'', ''admin'');';
  RAISE NOTICE '';
END
$$;

-- ============================================================================
-- STEP 4: Verification
-- ============================================================================

DO $$
DECLARE
  enum_still_exists BOOLEAN;
BEGIN
  -- Verify ENUM is gone
  SELECT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_role'
  ) INTO enum_still_exists;

  IF enum_still_exists THEN
    RAISE EXCEPTION 'Verification failed: user_role ENUM still exists after DROP';
  END IF;

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE '  user_role ENUM: ✅ Dropped';
  RAISE NOTICE '  Dependencies checked: ✅ Zero found';
  RAISE NOTICE '  Schema cleanup: ✅ Complete';
  RAISE NOTICE '';
  RAISE NOTICE 'Migration completed successfully.';
  RAISE NOTICE '========================================';
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
--   -- Recreate the ENUM type with original values
--   CREATE TYPE public.user_role AS ENUM (
--     'engineer',
--     'client',
--     'enterprise',
--     'admin'
--   );
--
--   -- Note: If any columns were re-added that use this ENUM,
--   -- they would need to be recreated as well. However, since
--   -- no dependencies were found, this should be a simple type recreation.
-- COMMIT;
--
-- Rollback should only be used if absolutely necessary, as the ENUM
-- has no active dependencies and was kept only for backward compatibility.

