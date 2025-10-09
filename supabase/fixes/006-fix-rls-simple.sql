-- Minimal fix for RLS infinite recursion
-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a secure function that bypasses RLS to check user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'client');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Recreate admin policy using the secure function
DROP POLICY IF EXISTS "Admins can view all profiles using function" ON public.profiles;
CREATE POLICY "Admins can view all profiles using function"
ON public.profiles FOR SELECT
USING (
  public.get_user_role() = 'admin'
  OR
  auth.uid() = user_id
);

