-- Forward migration: add is_admin flag, preserve admins, drop legacy role column
-- Created: January 27, 2025
-- Purpose: Migrate from role enum to is_admin boolean flag as part of subscription-tier model

-- Step 1: Add is_admin column with default false
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Step 2: Migrate existing admin users to is_admin = true
UPDATE public.profiles
SET is_admin = true
WHERE role = 'admin';

-- Step 3: Show migration statistics
DO $$
DECLARE
  admins_migrated integer;
  total_profiles integer;
BEGIN
  SELECT COUNT(*) INTO admins_migrated FROM public.profiles WHERE is_admin = true;
  SELECT COUNT(*) INTO total_profiles FROM public.profiles;
  
  RAISE NOTICE 'Migration complete: % admin(s) migrated out of % total profiles', admins_migrated, total_profiles;
END $$;

-- Step 4: Update get_user_role() function to use is_admin flag
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_is_admin BOOLEAN;
BEGIN
  -- Check is_admin flag instead of role column
  SELECT is_admin INTO user_is_admin
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  -- Return 'admin' if is_admin is true, otherwise 'user'
  IF user_is_admin THEN
    RETURN 'admin';
  ELSE
    RETURN 'user';
  END IF;
END;
$$;

-- Step 5: Drop the legacy role column and related objects
-- First drop dependent indexes
DROP INDEX IF EXISTS idx_profiles_role;
DROP INDEX IF EXISTS idx_account_numbers_role;

-- Update account_numbers table (preserve role for historical tracking)
-- Note: Keeping role in account_numbers for audit purposes but not for access control

-- Drop the enum type (will cascade if no other tables use it)
-- This may fail if other tables still reference user_role - check dependencies first
-- DROP TYPE IF EXISTS user_role CASCADE;

-- Step 6: Add index for is_admin for query performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- Step 7: Add comment for documentation
COMMENT ON COLUMN public.profiles.is_admin IS 'Flag indicating admin access (replaces legacy role enum)';

-- Note: The role column will remain in the account_numbers table for historical/audit purposes
-- Access control is now handled via the subscriptions table (subscription_tier) and is_admin flag
-- Subscription tier is stored in public.subscriptions, not profiles table

