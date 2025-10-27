-- =====================================================
-- Fix RLS Policies for AI Tables
-- Date: January 28, 2025
-- Purpose: Fix 406 errors on user_ai_quotas and enable proper access
-- =====================================================

-- =====================================================
-- Fix user_ai_quotas RLS policies
-- =====================================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own quotas" ON public.user_ai_quotas;

-- Allow users to SELECT their own quota
CREATE POLICY "Users can view their own quotas"
ON public.user_ai_quotas FOR SELECT
USING (user_id = auth.uid());

-- Allow users to INSERT their own quota (auto-creation)
CREATE POLICY "Users can insert their own quotas"
ON public.user_ai_quotas FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Allow users to UPDATE their own quota
CREATE POLICY "Users can update their own quotas"
ON public.user_ai_quotas FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE public.user_ai_quotas ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- Verify get_thread_messages function exists with correct name
-- =====================================================

-- Check if the function exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'get_thread_messages' 
    AND pronamespace = 'public'::regnamespace
  ) THEN
    RAISE NOTICE 'get_thread_messages function does not exist - will be created';
  ELSE
    RAISE NOTICE 'get_thread_messages function exists';
  END IF;
END $$;


-- =====================================================
-- Create helper function to verify auth and return user context
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_current_user_context()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  is_authenticated BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    auth.uid() as user_id,
    (SELECT email FROM auth.users WHERE id = auth.uid()) as user_email,
    (auth.uid() IS NOT NULL) as is_authenticated;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_context() TO authenticated;


-- =====================================================
-- Add missing RLS policies for ai_agent_usage if needed
-- =====================================================

DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'ai_agent_usage' 
    AND policyname = 'Users can view their own usage'
  ) THEN
    CREATE POLICY "Users can view their own usage"
    ON public.ai_agent_usage FOR SELECT
    USING (user_id = auth.uid());
  END IF;

  -- INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'ai_agent_usage' 
    AND policyname = 'Users can insert their own usage'
  ) THEN
    CREATE POLICY "Users can insert their own usage"
    ON public.ai_agent_usage FOR INSERT
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.ai_agent_usage ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- Expose RPC functions to PostgREST API
-- =====================================================

-- Grant necessary permissions for PostgREST to expose these functions
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT EXECUTE ON FUNCTIONS TO authenticated;

-- Ensure functions are accessible via RPC endpoints
-- PostgREST automatically exposes functions with EXECUTE grants
-- If 404 persists, may need to restart Supabase instance


-- =====================================================
-- Verification query (run this to confirm everything works)
-- =====================================================

-- This should return your current context
-- SELECT * FROM public.get_current_user_context();

