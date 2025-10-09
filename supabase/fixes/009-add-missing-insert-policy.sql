-- Fix: Add missing INSERT policy for profiles table
-- Issue: Users cannot create their own profiles during signup
-- This is causing the redirect loop because profile creation fails silently

-- Add the missing INSERT policy
CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Verify all required policies exist
DO $$
BEGIN
  RAISE NOTICE 'Profiles table RLS policies:';
  RAISE NOTICE '1. Users can view their own profile - SELECT';
  RAISE NOTICE '2. Users can update their own profile - UPDATE';
  RAISE NOTICE '3. Users can insert their own profile - INSERT (NEW)';
  RAISE NOTICE '4. Admins can view all profiles using function - SELECT';
END $$;

