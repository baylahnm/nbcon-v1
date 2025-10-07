-- 002-engineer-tables.sql
-- Engineer-specific tables and features

-- Create engineer skills table
CREATE TABLE public.engineer_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engineer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_category TEXT, -- e.g., 'programming', 'design', 'management'
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5), -- 1=beginner, 5=expert
  years_experience INTEGER,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES public.profiles(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engineer portfolio table
CREATE TABLE public.engineer_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engineer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_url TEXT,
  project_image_url TEXT,
  technologies_used TEXT[], -- Array of technologies
  project_category TEXT,
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engineer certifications table
CREATE TABLE public.engineer_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engineer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  certificate_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  verification_status verification_status DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(user_id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engineer ratings table
CREATE TABLE public.engineer_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engineer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(user_id),
  job_id UUID, -- Optional reference to specific job
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  review_text TEXT,
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
  timeliness_rating INTEGER CHECK (timeliness_rating BETWEEN 1 AND 5),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(engineer_id, client_id, job_id)
);

-- Create engineer availability table
CREATE TABLE public.engineer_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  engineer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10,2),
  preferred_project_types TEXT[],
  availability_schedule JSONB, -- Store availability schedule as JSON
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(engineer_id)
);

-- Enable RLS for engineer tables
ALTER TABLE public.engineer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engineer_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engineer_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engineer_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engineer_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for engineer tables
-- Skills policies
CREATE POLICY "Engineers can manage their own skills"
ON public.engineer_skills FOR ALL
USING (engineer_id = auth.uid());

CREATE POLICY "Anyone can view public skills"
ON public.engineer_skills FOR SELECT
USING (true);

-- Portfolio policies
CREATE POLICY "Engineers can manage their own portfolio"
ON public.engineer_portfolio FOR ALL
USING (engineer_id = auth.uid());

CREATE POLICY "Anyone can view public portfolio items"
ON public.engineer_portfolio FOR SELECT
USING (is_public = true);

-- Certifications policies
CREATE POLICY "Engineers can manage their own certifications"
ON public.engineer_certifications FOR ALL
USING (engineer_id = auth.uid());

CREATE POLICY "Anyone can view verified certifications"
ON public.engineer_certifications FOR SELECT
USING (verification_status = 'verified');

-- Ratings policies
CREATE POLICY "Clients can rate engineers"
ON public.engineer_ratings FOR INSERT
WITH CHECK (client_id = auth.uid());

CREATE POLICY "Engineers can view their own ratings"
ON public.engineer_ratings FOR SELECT
USING (engineer_id = auth.uid() OR client_id = auth.uid());

CREATE POLICY "Anyone can view public ratings"
ON public.engineer_ratings FOR SELECT
USING (is_public = true);

-- Availability policies
CREATE POLICY "Engineers can manage their own availability"
ON public.engineer_availability FOR ALL
USING (engineer_id = auth.uid());

CREATE POLICY "Anyone can view engineer availability"
ON public.engineer_availability FOR SELECT
USING (true);

-- Create indexes for engineer tables
CREATE INDEX idx_engineer_skills_engineer_id ON public.engineer_skills(engineer_id);
CREATE INDEX idx_engineer_skills_category ON public.engineer_skills(skill_category);
CREATE INDEX idx_engineer_portfolio_engineer_id ON public.engineer_portfolio(engineer_id);
CREATE INDEX idx_engineer_portfolio_featured ON public.engineer_portfolio(is_featured) WHERE is_featured = true;
CREATE INDEX idx_engineer_certifications_engineer_id ON public.engineer_certifications(engineer_id);
CREATE INDEX idx_engineer_certifications_status ON public.engineer_certifications(verification_status);
CREATE INDEX idx_engineer_ratings_engineer_id ON public.engineer_ratings(engineer_id);
CREATE INDEX idx_engineer_ratings_client_id ON public.engineer_ratings(client_id);
CREATE INDEX idx_engineer_availability_engineer_id ON public.engineer_availability(engineer_id);
CREATE INDEX idx_engineer_availability_available ON public.engineer_availability(is_available) WHERE is_available = true;
