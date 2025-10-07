-- 003-client-tables.sql
-- Client-specific tables and features

-- Create client projects table
CREATE TABLE public.client_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_type TEXT, -- e.g., 'web_development', 'mobile_app', 'consulting'
  project_category TEXT, -- e.g., 'ecommerce', 'saas', 'portfolio'
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  project_status TEXT DEFAULT 'planning' CHECK (project_status IN ('planning', 'active', 'completed', 'cancelled')),
  timeline_weeks INTEGER,
  required_skills TEXT[],
  project_location TEXT,
  is_remote BOOLEAN DEFAULT true,
  project_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.client_projects(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  preferred_skills TEXT[],
  budget_min DECIMAL(12,2),
  budget_max DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  job_type TEXT CHECK (job_type IN ('hourly', 'fixed_price', 'milestone')) NOT NULL,
  job_status TEXT DEFAULT 'open' CHECK (job_status IN ('draft', 'open', 'closed', 'cancelled')),
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'emergency')),
  timeline_weeks INTEGER,
  location_type TEXT DEFAULT 'remote' CHECK (location_type IN ('remote', 'onsite', 'hybrid')),
  location_city TEXT,
  location_region TEXT,
  is_featured BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client reviews table (for reviewing engineers)
CREATE TABLE public.client_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES public.profiles(user_id),
  job_id UUID, -- Optional reference to specific job
  project_id UUID REFERENCES public.client_projects(id),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5) NOT NULL,
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  timeliness_rating INTEGER CHECK (timeliness_rating BETWEEN 1 AND 5),
  review_text TEXT,
  would_hire_again BOOLEAN,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, engineer_id, job_id)
);

-- Create client preferences table
CREATE TABLE public.client_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  preferred_engineer_level TEXT CHECK (preferred_engineer_level IN ('junior', 'mid', 'senior', 'expert')),
  preferred_communication_method TEXT[],
  timezone TEXT DEFAULT 'UTC',
  notification_preferences JSONB,
  budget_preferences JSONB,
  project_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

-- Create client company table (for clients who represent companies)
CREATE TABLE public.client_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_type TEXT, -- e.g., 'startup', 'enterprise', 'agency'
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
  website TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

-- Enable RLS for client tables
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client tables
-- Projects policies
CREATE POLICY "Clients can manage their own projects"
ON public.client_projects FOR ALL
USING (client_id = auth.uid());

CREATE POLICY "Engineers can view public projects"
ON public.client_projects FOR SELECT
USING (true);

-- Job postings policies
CREATE POLICY "Clients can manage their own job postings"
ON public.job_postings FOR ALL
USING (client_id = auth.uid());

CREATE POLICY "Anyone can view open job postings"
ON public.job_postings FOR SELECT
USING (job_status = 'open');

CREATE POLICY "Engineers can view all job postings"
ON public.job_postings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'engineer'
  )
);

-- Reviews policies
CREATE POLICY "Clients can manage their own reviews"
ON public.client_reviews FOR ALL
USING (client_id = auth.uid());

CREATE POLICY "Engineers can view their own reviews"
ON public.client_reviews FOR SELECT
USING (engineer_id = auth.uid() OR client_id = auth.uid());

CREATE POLICY "Anyone can view public reviews"
ON public.client_reviews FOR SELECT
USING (is_public = true);

-- Preferences policies
CREATE POLICY "Clients can manage their own preferences"
ON public.client_preferences FOR ALL
USING (client_id = auth.uid());

-- Company policies
CREATE POLICY "Clients can manage their own company info"
ON public.client_companies FOR ALL
USING (client_id = auth.uid());

CREATE POLICY "Anyone can view verified company info"
ON public.client_companies FOR SELECT
USING (is_verified = true);

-- Create indexes for client tables
CREATE INDEX idx_client_projects_client_id ON public.client_projects(client_id);
CREATE INDEX idx_client_projects_status ON public.client_projects(project_status);
CREATE INDEX idx_client_projects_type ON public.client_projects(project_type);
CREATE INDEX idx_job_postings_client_id ON public.job_postings(client_id);
CREATE INDEX idx_job_postings_status ON public.job_postings(job_status);
CREATE INDEX idx_job_postings_type ON public.job_postings(job_type);
CREATE INDEX idx_job_postings_featured ON public.job_postings(is_featured) WHERE is_featured = true;
CREATE INDEX idx_job_postings_expires ON public.job_postings(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_client_reviews_client_id ON public.client_reviews(client_id);
CREATE INDEX idx_client_reviews_engineer_id ON public.client_reviews(engineer_id);
CREATE INDEX idx_client_preferences_client_id ON public.client_preferences(client_id);
CREATE INDEX idx_client_companies_client_id ON public.client_companies(client_id);
CREATE INDEX idx_client_companies_verified ON public.client_companies(is_verified) WHERE is_verified = true;
