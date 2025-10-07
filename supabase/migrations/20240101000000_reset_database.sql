-- Reset Database Migration
-- This migration drops all existing tables and prepares for reorganization

-- Drop all existing tables in reverse dependency order
DROP TABLE IF EXISTS public.ai_events CASCADE;
DROP TABLE IF EXISTS public.dashboard_layouts CASCADE;
DROP TABLE IF EXISTS public.profile_extensions CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing enum types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS job_priority CASCADE;

-- Drop existing extensions (will be recreated)
-- Note: Only drop if not used by other tables
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- Clear any existing policies
-- Note: Policies are automatically dropped when tables are dropped

-- This migration prepares the database for the new numbered structure
-- All new migrations (001-010) will be applied after this reset
