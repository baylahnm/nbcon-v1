-- Create core tables for nbcon engineering marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('engineer', 'client', 'enterprise', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'expired');
CREATE TYPE job_status AS ENUM ('draft', 'open', 'quoted', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE job_priority AS ENUM ('low', 'normal', 'high', 'emergency');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
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

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  description_en TEXT,
  description_ar TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  cr_number TEXT, -- Commercial Registration
  vat_number TEXT,
  location_city TEXT,
  location_region TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engineer_profiles table
CREATE TABLE public.engineer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(user_id) ON DELETE CASCADE,
  sce_license_number TEXT,
  specializations TEXT[], -- Array of engineering specializations
  years_experience INTEGER,
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  availability_status TEXT DEFAULT 'available', -- available, busy, unavailable
  service_radius INTEGER DEFAULT 50, -- km
  languages TEXT[] DEFAULT ARRAY['en', 'ar'],
  certifications JSONB,
  portfolio_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_profiles table
CREATE TABLE public.client_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(user_id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  client_type TEXT DEFAULT 'individual', -- individual, business, enterprise
  preferred_payment_method TEXT,
  budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verifications table
CREATE TABLE public.verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL, -- sce_license, national_id, company_cr
  document_url TEXT,
  verification_data JSONB,
  status verification_status DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  assigned_engineer_id UUID REFERENCES profiles(user_id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  job_type TEXT DEFAULT 'fixed', -- fixed, hourly, milestone
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  currency TEXT DEFAULT 'SAR',
  location_address TEXT,
  location_city TEXT,
  location_region TEXT,
  location_coordinates POINT,
  priority job_priority DEFAULT 'normal',
  status job_status DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  estimated_duration INTEGER, -- in days
  skills_required TEXT[],
  documents JSONB, -- Array of document objects
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engineer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for engineer_profiles
CREATE POLICY "Anyone can view engineer profiles" ON public.engineer_profiles FOR SELECT USING (true);
CREATE POLICY "Engineers can update their own profile" ON public.engineer_profiles FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Engineers can insert their own profile" ON public.engineer_profiles FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- RLS Policies for client_profiles  
CREATE POLICY "Users can view client profiles" ON public.client_profiles FOR SELECT USING (true);
CREATE POLICY "Clients can update their own profile" ON public.client_profiles FOR UPDATE USING (
  auth.uid() = user_id
);
CREATE POLICY "Clients can insert their own profile" ON public.client_profiles FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- RLS Policies for companies
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Company members can update companies" ON public.companies FOR UPDATE TO authenticated USING (true);

-- RLS Policies for verifications
CREATE POLICY "Users can view their own verifications" ON public.verifications FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can insert their own verifications" ON public.verifications FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- RLS Policies for jobs
CREATE POLICY "Anyone can view open jobs" ON public.jobs FOR SELECT USING (
  status IN ('open', 'quoted') OR 
  auth.uid() = client_id OR 
  auth.uid() = assigned_engineer_id
);
CREATE POLICY "Clients can create jobs" ON public.jobs FOR INSERT WITH CHECK (
  auth.uid() = client_id
);
CREATE POLICY "Job owners can update jobs" ON public.jobs FOR UPDATE USING (
  auth.uid() = client_id OR auth.uid() = assigned_engineer_id
);

-- Create update timestamp functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_engineer_profiles_updated_at BEFORE UPDATE ON public.engineer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON public.verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_engineer_profiles_user_id ON public.engineer_profiles(user_id);
CREATE INDEX idx_client_profiles_user_id ON public.client_profiles(user_id);
CREATE INDEX idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX idx_jobs_assigned_engineer_id ON public.jobs(assigned_engineer_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_verifications_user_id ON public.verifications(user_id);
CREATE INDEX idx_verifications_status ON public.verifications(status);