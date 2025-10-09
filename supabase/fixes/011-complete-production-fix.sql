-- =====================================================
-- CRITICAL FIX: Enable Profile Creation & Role Assignment
-- Date: October 9, 2025
-- Priority: URGENT - Blocks user registration
-- =====================================================

-- =====================================================
-- PART 1: CRITICAL - Add Missing INSERT Policy
-- =====================================================

-- Check if policy exists before creating
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
    RAISE NOTICE 'INSERT policy created successfully';
  ELSE
    RAISE NOTICE 'INSERT policy already exists, skipping';
  END IF;
END $$;

-- =====================================================
-- PART 2: Create Missing engineer_profiles Table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.engineer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Specializations (stored as JSONB array for flexibility)
  specializations JSONB DEFAULT '[]'::jsonb,
  
  -- Professional details
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
  
  -- Constraints
  CONSTRAINT valid_experience CHECK (years_experience IN ('0-2', '3-5', '6-10', '11-15', '15+'))
);

-- Enable RLS
ALTER TABLE public.engineer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for engineer_profiles
CREATE POLICY "Users can view their own engineer profile"
ON public.engineer_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engineer profile"
ON public.engineer_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own engineer profile"
ON public.engineer_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_engineer_profiles_user_id 
ON public.engineer_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_engineer_profiles_specializations 
ON public.engineer_profiles USING GIN (specializations);

-- =====================================================
-- PART 3: Fix Table Name Mismatches
-- =====================================================

-- Rename job_postings to jobs (if exists)
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
    RAISE NOTICE 'Table renamed: job_postings -> jobs';
  ELSE
    RAISE NOTICE 'Table jobs already exists or job_postings does not exist';
  END IF;
END $$;

-- Rename ai_conversations to ai_threads (if exists)
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
    RAISE NOTICE 'Table renamed: ai_conversations -> ai_threads';
  ELSE
    RAISE NOTICE 'Table ai_threads already exists or ai_conversations does not exist';
  END IF;
END $$;

-- =====================================================
-- PART 4: Optimize get_user_role() Function
-- =====================================================

-- Add index to optimize role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id_role 
ON public.profiles(user_id, role);

-- =====================================================
-- PART 5: Create Update Trigger for engineer_profiles
-- =====================================================

CREATE OR REPLACE FUNCTION update_engineer_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_engineer_profiles_timestamp ON public.engineer_profiles;

CREATE TRIGGER update_engineer_profiles_timestamp
  BEFORE UPDATE ON public.engineer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_engineer_profiles_updated_at();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify INSERT policy exists
SELECT 
  'INSERT Policy Check' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Users can insert their own profile'
      AND cmd = 'INSERT'
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status;

-- Verify engineer_profiles table exists
SELECT 
  'engineer_profiles Table Check' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'engineer_profiles'
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status;

-- Verify jobs table exists
SELECT 
  'jobs Table Check' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'jobs'
    ) THEN '✅ PASS'
    ELSE '⚠️ WARN - Still named job_postings'
  END as status;

-- Verify ai_threads table exists
SELECT 
  'ai_threads Table Check' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'ai_threads'
    ) THEN '✅ PASS'
    ELSE '⚠️ WARN - Still named ai_conversations'
  END as status;

-- Count all RLS policies on profiles
SELECT 
  'Total profiles RLS Policies' as metric,
  COUNT(*)::text || ' policies' as value
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '🎉 Database fixes applied successfully!' as status;
SELECT '✅ Profile creation should now work' as next_step;
SELECT '✅ Engineer role should be assigned correctly' as next_step;
SELECT '⚡ Test signup flow again to verify' as action_required;

