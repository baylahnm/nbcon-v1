-- ================================================================
-- DATABASE VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to check all required tables
-- ================================================================

-- Step 1: Check if all required tables exist
-- ================================================================

SELECT 
  CASE 
    WHEN COUNT(*) = 6 THEN '✅ ALL 6 TABLES EXIST'
    ELSE '❌ MISSING TABLES - See details below'
  END as overall_status,
  COUNT(*) as tables_found
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'gantt_projects',
    'gantt_tasks',
    'gantt_resources',
    'project_charter_sections',
    'project_risks',
    'project_stakeholders'
  );

-- Step 2: List which specific tables exist
-- ================================================================

SELECT 
  'gantt_projects' as table_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'gantt_projects'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
  'gantt_tasks',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'gantt_tasks'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
  'gantt_resources',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'gantt_resources'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
  'project_charter_sections',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'project_charter_sections'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
  'project_risks',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'project_risks'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END
UNION ALL
SELECT 
  'project_stakeholders',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'project_stakeholders'
  ) THEN '✅ EXISTS' ELSE '❌ MISSING' END;

-- Step 3: Check RLS is enabled on all tables
-- ================================================================

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'gantt_projects',
    'gantt_tasks',
    'gantt_resources',
    'project_charter_sections',
    'project_risks',
    'project_stakeholders'
  )
ORDER BY tablename;

-- Expected: All should show rls_enabled = true

-- Step 4: Check RLS policies exist
-- ================================================================

SELECT 
  tablename,
  policyname,
  cmd as operation,
  qual as using_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'gantt_projects',
    'gantt_tasks',
    'gantt_resources',
    'project_charter_sections',
    'project_risks',
    'project_stakeholders'
  )
ORDER BY tablename, cmd;

-- Expected: Each table should have SELECT, INSERT, UPDATE, DELETE policies

-- Step 5: Check column structure for new tables
-- ================================================================

-- Charter sections columns
SELECT 
  '📄 project_charter_sections' as table_info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'project_charter_sections'
ORDER BY ordinal_position;

-- Risks columns  
SELECT 
  '⚠️ project_risks' as table_info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'project_risks'
ORDER BY ordinal_position;

-- Stakeholders columns
SELECT 
  '👥 project_stakeholders' as table_info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'project_stakeholders'
ORDER BY ordinal_position;

-- ================================================================
-- VERIFICATION COMPLETE
-- ================================================================
-- 
-- If all tables show ✅ EXISTS and RLS enabled = true, you're good!
-- If any show ❌ MISSING, run the corresponding migration file.
-- ================================================================

