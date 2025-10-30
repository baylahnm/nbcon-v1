-- Rollback migration: restore role column, drop is_admin flag
-- Created: January 27, 2025
-- Purpose: Rollback from is_admin boolean to role enum for emergency recovery

-- Step 1: Recreate the user_role enum type
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('engineer', 'client', 'enterprise', 'admin');

-- Step 2: Add role column back to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role;

-- Step 3: Migrate is_admin back to role for admin users
UPDATE public.profiles
SET role = 'admin'
WHERE is_admin = true;

-- Step 4: Set default role for non-admin users (fallback to 'client')
UPDATE public.profiles
SET role = 'client'
WHERE role IS NULL;

-- Step 5: Make role NOT NULL after populating
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Step 6: Drop is_admin column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_admin;

-- Step 7: Recreate indexes
DROP INDEX IF EXISTS idx_profiles_is_admin;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_account_numbers_role ON public.account_numbers(role);

-- Step 8: Show rollback statistics
DO $$
DECLARE
  admin_count integer;
  total_profiles integer;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE role = 'admin';
  SELECT COUNT(*) INTO total_profiles FROM public.profiles;
  
  RAISE NOTICE 'Rollback complete: % admin(s) restored, % total profiles', admin_count, total_profiles;
END $$;

-- Warning: This rollback will lose the distinction between subscription tiers
-- All users will default to 'client' role after rollback

COMMENT ON COLUMN public.profiles.role IS 'User role restored from rollback (emergency recovery only)';

