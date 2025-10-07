-- 001-base-schema.sql
-- Core user authentication and base schema setup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create base enum types
CREATE TYPE user_role AS ENUM ('engineer', 'client', 'enterprise', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'deleted');

-- Create base profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  account_number TEXT UNIQUE, -- New: Account number for tracking
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
CREATE TABLE public.account_numbers (
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
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

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

CREATE TRIGGER assign_account_number_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION assign_account_number();

-- Create indexes
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_account_number ON public.profiles(account_number);
CREATE INDEX idx_account_numbers_role ON public.account_numbers(role);
CREATE INDEX idx_account_numbers_active ON public.account_numbers(is_active);
