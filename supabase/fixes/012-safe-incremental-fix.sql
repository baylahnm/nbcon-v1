-- =====================================================
-- SAFE INCREMENTAL FIX - Only Creates Missing Items
-- Date: October 9, 2025
-- Priority: CRITICAL - Safe to run multiple times
-- =====================================================

-- =====================================================
-- PART 1: CRITICAL - Add Missing INSERT Policy on Profiles
-- =====================================================

DO $$ 
BEGIN
  -- Only create if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
    RAISE NOTICE '✅ INSERT policy created successfully';
  ELSE
    RAISE NOTICE '✅ INSERT policy already exists (OK)';
  END IF;
END $$;

-- =====================================================
-- PART 2: Verify engineer_profiles Table
-- =====================================================

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'engineer_profiles'
  ) THEN
    RAISE NOTICE '✅ engineer_profiles table exists (OK)';
  ELSE
    RAISE NOTICE '⚠️ engineer_profiles table missing - creating...';
    
    CREATE TABLE public.engineer_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
      profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      
      -- Specializations
      specializations JSONB DEFAULT '[]'::jsonb,
      certifications JSONB DEFAULT '[]'::jsonb,
      skills JSONB DEFAULT '[]'::jsonb,
      years_experience TEXT,
      hourly_rate DECIMAL(10,2),
      
      -- Availability
      is_available BOOLEAN DEFAULT true,
      service_radius_km INTEGER DEFAULT 50,
      
      -- Timestamps
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      
      CONSTRAINT valid_experience CHECK (years_experience IN ('0-2', '3-5', '6-10', '11-15', '15+'))
    );

    ALTER TABLE public.engineer_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- =====================================================
-- PART 3: Check RLS Policies on engineer_profiles
-- =====================================================

DO $$ 
BEGIN
  -- SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'engineer_profiles' 
    AND policyname = 'Users can view their own engineer profile'
  ) THEN
    CREATE POLICY "Users can view their own engineer profile"
    ON public.engineer_profiles FOR SELECT
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ SELECT policy created for engineer_profiles';
  ELSE
    RAISE NOTICE '✅ SELECT policy exists for engineer_profiles (OK)';
  END IF;

  -- INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'engineer_profiles' 
    AND policyname = 'Users can insert their own engineer profile'
  ) THEN
    CREATE POLICY "Users can insert their own engineer profile"
    ON public.engineer_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE '✅ INSERT policy created for engineer_profiles';
  ELSE
    RAISE NOTICE '✅ INSERT policy exists for engineer_profiles (OK)';
  END IF;

  -- UPDATE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'engineer_profiles' 
    AND policyname = 'Users can update their own engineer profile'
  ) THEN
    CREATE POLICY "Users can update their own engineer profile"
    ON public.engineer_profiles FOR UPDATE
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ UPDATE policy created for engineer_profiles';
  ELSE
    RAISE NOTICE '✅ UPDATE policy exists for engineer_profiles (OK)';
  END IF;
END $$;

-- =====================================================
-- PART 4: Create Indexes (Safe)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_engineer_profiles_user_id 
ON public.engineer_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_engineer_profiles_specializations 
ON public.engineer_profiles USING GIN (specializations);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id_role 
ON public.profiles(user_id, role);

-- =====================================================
-- PART 5: Table Renames (Safe)
-- =====================================================

-- Rename job_postings to jobs (if needed)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'job_postings'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'jobs'
  ) THEN
    ALTER TABLE public.job_postings RENAME TO jobs;
    RAISE NOTICE '✅ Table renamed: job_postings -> jobs';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'jobs'
  ) THEN
    RAISE NOTICE '✅ jobs table exists (OK)';
  ELSE
    RAISE NOTICE '⚠️ Neither job_postings nor jobs table exists';
  END IF;
END $$;

-- Rename ai_conversations to ai_threads (if needed)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'ai_conversations'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'ai_threads'
  ) THEN
    ALTER TABLE public.ai_conversations RENAME TO ai_threads;
    RAISE NOTICE '✅ Table renamed: ai_conversations -> ai_threads';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'ai_threads'
  ) THEN
    RAISE NOTICE '✅ ai_threads table exists (OK)';
  ELSE
    RAISE NOTICE '⚠️ Neither ai_conversations nor ai_threads exists';
  END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check profiles table INSERT policy (MOST CRITICAL!)
SELECT 
  '🚨 CRITICAL: profiles INSERT Policy' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Users can insert their own profile'
      AND cmd = 'INSERT'
    ) THEN '✅ PASS - Profile creation will work!'
    ELSE '❌ FAIL - Profile creation will fail with 406!'
  END as status;

-- Check engineer_profiles table
SELECT 
  'engineer_profiles Table' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'engineer_profiles'
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status;

-- Count profiles RLS policies
SELECT 
  'profiles Table Policies' as metric,
  COUNT(*)::text || ' total policies' as value
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- List all profiles policies
SELECT 
  policyname as policy_name,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY cmd;

-- Count engineer_profiles RLS policies
SELECT 
  'engineer_profiles Policies' as metric,
  COUNT(*)::text || ' total policies' as value
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'engineer_profiles';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '🎉 Safe incremental fix completed!' as status;
SELECT '✅ All missing items created or verified' as result;
SELECT '⚡ Ready to test signup flow!' as next_action;

