-- Complete Database Restoration Script for nbocn
-- This script combines all migrations in the correct order
-- Run this in your Supabase SQL Editor if CLI restoration fails

-- ==============================================
-- 000: Reset Database (if needed)
-- ==============================================
-- Uncomment the following lines if you need to reset the database
-- WARNING: This will delete all existing data!

/*
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
*/

-- ==============================================
-- 001: Base Schema
-- ==============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create base enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('engineer', 'client', 'enterprise', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create base profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  account_number TEXT UNIQUE,
  account_status account_status DEFAULT 'active',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  location_city TEXT,
  location_region TEXT,
  preferred_language TEXT DEFAULT 'en',
  theme_preference TEXT DEFAULT 'light',
  rtl_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create account tracking table
CREATE TABLE IF NOT EXISTS public.account_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_number TEXT NOT NULL UNIQUE,
  role user_role NOT NULL,
  user_id UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_numbers ENABLE ROW LEVEL SECURITY;

-- Base RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function to generate account numbers
CREATE OR REPLACE FUNCTION generate_account_number(role_type user_role)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  counter INTEGER;
  account_num TEXT;
BEGIN
  -- Set prefix based on role
  CASE role_type
    WHEN 'engineer' THEN prefix := 'ENG';
    WHEN 'client' THEN prefix := 'CLI';
    WHEN 'enterprise' THEN prefix := 'ENT';
    WHEN 'admin' THEN prefix := 'ADM';
    ELSE prefix := 'USR';
  END CASE;
  
  -- Get next counter for this role
  SELECT COALESCE(MAX(CAST(SUBSTRING(account_number FROM 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.account_numbers 
  WHERE role = role_type AND is_active = true;
  
  -- Format: PREFIX + 6-digit number (e.g., ENG000001)
  account_num := prefix || LPAD(counter::TEXT, 6, '0');
  
  RETURN account_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate account numbers
CREATE OR REPLACE FUNCTION assign_account_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.account_number IS NULL THEN
    NEW.account_number := generate_account_number(NEW.role);
  END IF;
  
  -- Insert into account_numbers tracking table
  INSERT INTO public.account_numbers (account_number, role, user_id)
  VALUES (NEW.account_number, NEW.role, NEW.user_id)
  ON CONFLICT (account_number) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_account_number_trigger ON public.profiles;
CREATE TRIGGER assign_account_number_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION assign_account_number();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_account_number ON public.profiles(account_number);
CREATE INDEX IF NOT EXISTS idx_account_numbers_role ON public.account_numbers(role);
CREATE INDEX IF NOT EXISTS idx_account_numbers_active ON public.account_numbers(is_active);

-- ==============================================
-- Continue with other migrations...
-- ==============================================

-- Note: This is a simplified version. For complete restoration,
-- you should run each migration file individually in order:
-- 001-base-schema.sql
-- 001-core-tables.sql
-- 002-conversations-messaging.sql
-- 002-engineer-tables.sql
-- 003-billing-subscriptions.sql
-- 003-client-tables.sql
-- 004-dashboard-layouts.sql
-- 004-enterprise-tables.sql
-- 005-admin-tables.sql
-- 005-profile-extensions.sql
-- 006-ai-service-modes.sql
-- 006-shared-messaging.sql
-- 007-ai-events-tracking.sql
-- 007-shared-billing.sql
-- 008-shared-dashboard.sql
-- 009-shared-ai.sql
-- 010-data-migration.sql

-- ==============================================
-- Success Message
-- ==============================================
DO $$
BEGIN
    RAISE NOTICE 'Base schema created successfully!';
    RAISE NOTICE 'Please run the remaining migration files in order for complete restoration.';
END $$;
