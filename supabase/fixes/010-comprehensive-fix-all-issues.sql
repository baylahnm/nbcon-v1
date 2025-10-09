-- ========================================================================
-- COMPREHENSIVE FIX FOR ALL DATABASE/CODE MISMATCHES
-- Date: October 9, 2025
-- Purpose: Fix redirect loop and schema mismatches
-- ========================================================================

-- =================
-- 1. ADD MISSING INSERT POLICY (CRITICAL - FIXES REDIRECT LOOP FOR NEW USERS)
-- =================

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Verify it was created
DO $$
BEGIN
  RAISE NOTICE '✅ INSERT policy added for profiles table';
END $$;

-- =================
-- 2. CREATE MISSING engineer_profiles TABLE
-- =================

-- This table is queried by DashboardContent but doesn't exist
CREATE TABLE IF NOT EXISTS public.engineer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  specializations TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  availability_status TEXT DEFAULT 'available',
  sce_license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS
ALTER TABLE public.engineer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own engineer profile"
ON public.engineer_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engineer profile"
ON public.engineer_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own engineer profile"
ON public.engineer_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Add index
CREATE INDEX IF NOT EXISTS idx_engineer_profiles_user_id ON public.engineer_profiles(user_id);

DO $$
BEGIN
  RAISE NOTICE '✅ engineer_profiles table created';
END $$;

-- =================
-- 3. RENAME job_postings TO jobs (FOR CODE COMPATIBILITY)
-- =================

-- Check if job_postings exists and jobs doesn't
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'job_postings' AND table_schema = 'public')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jobs' AND table_schema = 'public') THEN
    ALTER TABLE public.job_postings RENAME TO jobs;
    RAISE NOTICE '✅ job_postings table renamed to jobs';
  ELSE
    RAISE NOTICE 'ℹ️  job_postings table already renamed or jobs table already exists';
  END IF;
END $$;

-- =================
-- 4. RENAME ai_conversations TO ai_threads (FOR CODE COMPATIBILITY)
-- =================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_conversations' AND table_schema = 'public')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_threads' AND table_schema = 'public') THEN
    ALTER TABLE public.ai_conversations RENAME TO ai_threads;
    RAISE NOTICE '✅ ai_conversations table renamed to ai_threads';
  ELSE
    RAISE NOTICE 'ℹ️  ai_conversations already renamed or ai_threads already exists';
  END IF;
END $$;

-- =================
-- 5. OPTIMIZE get_user_role() FUNCTION (REDUCE TIMEOUT)
-- =================

-- Add index to speed up role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id_role ON public.profiles(user_id, role);

-- Optimize the function
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Optimized query with index
  SELECT role INTO user_role
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'client');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

DO $$
BEGIN
  RAISE NOTICE '✅ get_user_role() function optimized with index';
END $$;

-- =================
-- VERIFICATION QUERIES
-- =================

-- Check all policies on profiles table
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd as command,
  qual as using_clause
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Verify tables exist
SELECT 
  table_name, 
  CASE 
    WHEN table_name IN ('profiles', 'engineer_profiles', 'jobs', 'ai_threads', 'messages', 'conversations') 
    THEN '✅ CRITICAL'
    ELSE 'ℹ️  Other'
  END as importance
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'engineer_profiles', 'jobs', 'job_postings', 'ai_threads', 'ai_conversations')
ORDER BY table_name;

-- ========================================================================
-- END OF COMPREHENSIVE FIX
-- Apply this file to Supabase via SQL Editor or CLI
-- ========================================================================

