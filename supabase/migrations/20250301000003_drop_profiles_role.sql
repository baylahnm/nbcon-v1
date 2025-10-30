-- Migration: Drop legacy profiles.role column (post-is_admin migration)
-- Version: NBCON PRO v1.9.0
-- Date: 2025-10-30

BEGIN;

-- Safety check: ensure no policies still reference role='admin'
DO $$
DECLARE cnt integer;
BEGIN
  SELECT COUNT(*) INTO cnt
  FROM pg_policies
  WHERE schemaname = 'public'
    AND (qual ILIKE '%role = ''admin''%' OR with_check ILIKE '%role = ''admin''%');
  IF cnt > 0 THEN
    RAISE EXCEPTION 'Abort: Found % policy predicates still referencing role=admin', cnt;
  END IF;
END $$;

-- Drop dependent indexes if any
DROP INDEX IF EXISTS idx_profiles_role;

-- Drop column from profiles
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS role;

COMMIT;

-- Final migration (v1.9.0): drop deprecated role column now that RLS uses is_admin
-- Safety: Ensure all RLS policies/functions reference is_admin or get_user_role()
-- Apply during maintenance window after successful staging verification

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
