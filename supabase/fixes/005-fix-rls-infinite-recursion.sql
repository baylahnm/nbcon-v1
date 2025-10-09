-- Fix: Infinite recursion in profiles RLS policies
-- Issue: Admin policy queries profiles table within profiles policy check

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate with non-recursive approach using JWT metadata
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  -- Check if user has admin role from JWT metadata
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  OR
  -- Fallback: allow if user_id matches (for self-access)
  auth.uid() = user_id
);

-- Alternative: If JWT metadata isn't populated, use a stable function
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Use a direct query with security definer to bypass RLS
  SELECT role INTO user_role
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'client');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Simpler admin policy using the function
DROP POLICY IF EXISTS "Admins can view all profiles using function" ON public.profiles;
CREATE POLICY "Admins can view all profiles using function"
ON public.profiles FOR SELECT
USING (
  public.get_user_role() = 'admin'
  OR
  auth.uid() = user_id
);

-- Make sure the first two basic policies still exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

