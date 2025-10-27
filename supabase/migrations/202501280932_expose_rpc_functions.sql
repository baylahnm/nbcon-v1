-- =====================================================
-- Force PostgREST to Expose RPC Functions
-- Date: January 28, 2025
-- Purpose: Fix 404 errors on RPC endpoints
-- =====================================================

-- =====================================================
-- Method 1: Explicitly grant execute permissions
-- =====================================================

GRANT EXECUTE ON FUNCTION public.get_thread_messages(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ai_threads() TO authenticated;
-- Note: add_thread_message may not exist yet
-- GRANT EXECUTE ON FUNCTION public.add_thread_message(UUID, TEXT, TEXT, JSONB) TO authenticated;

-- create_ai_thread has two overloads
GRANT EXECUTE ON FUNCTION public.create_ai_thread(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_ai_thread(TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_monthly_usage(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_quota(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_context() TO authenticated;


-- =====================================================
-- Method 2: Ensure functions are in public schema
-- =====================================================

-- Move any stray functions to public schema if needed
UPDATE pg_proc 
SET pronamespace = 'public'::regnamespace
WHERE proname IN (
  'get_thread_messages',
  'get_ai_threads',
  'create_ai_thread',
  'get_user_monthly_usage',
  'check_user_quota'
)
AND pronamespace != 'public'::regnamespace;


-- =====================================================
-- Method 3: Verify PostgREST can discover these functions
-- =====================================================

-- PostgREST looks for functions with:
-- 1. Function in public schema
-- 2. SECURITY DEFINER or function accessible to anonymous/authenticated roles
-- 3. EXECUTE permission granted

-- Check current status:
SELECT 
  proname as function_name,
  pronamespace::regnamespace as schema,
  prosecdef as security_definer,
  CASE 
    WHEN has_function_privilege('anon', p.oid, 'execute') THEN '✅ anon'
    ELSE '❌ no anon'
  END as anon_access,
  CASE 
    WHEN has_function_privilege('authenticated', p.oid, 'execute') THEN '✅ authenticated'
    ELSE '❌ no authenticated'
  END as auth_access
FROM pg_proc p
WHERE proname IN (
  'get_thread_messages',
  'get_ai_threads',
  'create_ai_thread',
  'get_user_monthly_usage',
  'check_user_quota'
)
AND pronamespace = 'public'::regnamespace;


-- =====================================================
-- Method 4: Alternative - Grant to anon role as well
-- =====================================================

-- If authenticated-only grants don't work, try granting to anon
GRANT EXECUTE ON FUNCTION public.get_thread_messages(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_ai_threads() TO anon;
-- GRANT EXECUTE ON FUNCTION public.add_thread_message(UUID, TEXT, TEXT, JSONB) TO anon;

GRANT EXECUTE ON FUNCTION public.create_ai_thread(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.create_ai_thread(TEXT, TEXT, TEXT, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_monthly_usage(INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.check_user_quota(INTEGER) TO anon;


-- =====================================================
-- Troubleshooting Notes
-- =====================================================

-- If 404 persists after this migration:
-- 1. Restart Supabase instance (PostgREST needs to reload schema)
-- 2. Check PostgREST logs for "function not found" errors
-- 3. Verify function signatures match exactly what frontend expects
-- 4. Try calling function directly via psql to ensure it exists
-- 5. Check if there are multiple function overloads causing confusion

