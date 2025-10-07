-- 004-enterprise-tables.sql
-- Enterprise-specific tables and features

-- Create enterprise companies table
CREATE TABLE public.enterprise_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enterprise_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_name_ar TEXT,
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
  country TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('small', 'medium', 'large', 'enterprise')),
  annual_revenue DECIMAL(15,2),
  is_verified BOOLEAN DEFAULT false,
  verification_documents JSONB,
  compliance_certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enterprise teams table
CREATE TABLE public.enterprise_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.enterprise_companies(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  team_description TEXT,
  team_lead_id UUID REFERENCES public.profiles(user_id),
  department TEXT,
  team_size INTEGER,
  team_budget DECIMAL(12,2),
  team_goals TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enterprise team members table
CREATE TABLE public.enterprise_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.enterprise_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  role_in_team TEXT NOT NULL, -- e.g., 'member', 'lead', 'manager'
  permissions JSONB, -- Team-specific permissions
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(team_id, user_id)
);

-- Create enterprise projects table
CREATE TABLE public.enterprise_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.enterprise_companies(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.enterprise_teams(id),
  project_name TEXT NOT NULL,
  project_description TEXT,
  project_type TEXT, -- e.g., 'internal', 'client', 'research'
  project_category TEXT,
  budget DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  project_status TEXT DEFAULT 'planning' CHECK (project_status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  required_skills TEXT[],
  project_requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enterprise procurement table
CREATE TABLE public.enterprise_procurement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.enterprise_companies(id) ON DELETE CASCADE,
  procurement_type TEXT NOT NULL, -- e.g., 'services', 'software', 'consulting'
  title TEXT NOT NULL,
  description TEXT,
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  requirements TEXT[],
  evaluation_criteria JSONB,
  procurement_status TEXT DEFAULT 'draft' CHECK (procurement_status IN ('draft', 'published', 'evaluation', 'awarded', 'completed', 'cancelled')),
  submission_deadline TIMESTAMP WITH TIME ZONE,
  evaluation_deadline TIMESTAMP WITH TIME ZONE,
  awarded_to UUID REFERENCES public.profiles(user_id),
  awarded_amount DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enterprise vendors table
CREATE TABLE public.enterprise_vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.enterprise_companies(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT, -- e.g., 'individual', 'company', 'agency'
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  vendor_rating DECIMAL(3,2) CHECK (vendor_rating BETWEEN 1 AND 5),
  total_projects INTEGER DEFAULT 0,
  total_spent DECIMAL(15,2) DEFAULT 0,
  last_project_date TIMESTAMP WITH TIME ZONE,
  vendor_status TEXT DEFAULT 'active' CHECK (vendor_status IN ('active', 'inactive', 'blacklisted')),
  vendor_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enterprise analytics table
CREATE TABLE public.enterprise_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.enterprise_companies(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,2),
  metric_unit TEXT,
  metric_category TEXT, -- e.g., 'financial', 'operational', 'team'
  period_start DATE,
  period_end DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for enterprise tables
ALTER TABLE public.enterprise_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_procurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for enterprise tables
-- Companies policies
CREATE POLICY "Enterprise users can manage their own company"
ON public.enterprise_companies FOR ALL
USING (enterprise_id = auth.uid());

CREATE POLICY "Team members can view their company"
ON public.enterprise_companies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_team_members etm
    JOIN public.enterprise_teams et ON et.id = etm.team_id
    WHERE etm.user_id = auth.uid() AND et.company_id = enterprise_companies.id
  )
);

-- Teams policies
CREATE POLICY "Company members can manage teams"
ON public.enterprise_teams FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_companies
    WHERE id = company_id AND enterprise_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.enterprise_team_members
    WHERE team_id = id AND user_id = auth.uid() AND role_in_team = 'lead'
  )
);

-- Team members policies
CREATE POLICY "Team leads can manage team members"
ON public.enterprise_team_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_teams
    WHERE id = team_id AND team_lead_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.enterprise_companies ec
    JOIN public.enterprise_teams et ON et.company_id = ec.id
    WHERE et.id = team_id AND ec.enterprise_id = auth.uid()
  )
);

-- Projects policies
CREATE POLICY "Company members can manage projects"
ON public.enterprise_projects FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_companies
    WHERE id = company_id AND enterprise_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.enterprise_team_members etm
    JOIN public.enterprise_teams et ON et.id = etm.team_id
    WHERE etm.user_id = auth.uid() AND et.id = team_id
  )
);

-- Procurement policies
CREATE POLICY "Company members can manage procurement"
ON public.enterprise_procurement FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_companies
    WHERE id = company_id AND enterprise_id = auth.uid()
  )
);

-- Vendors policies
CREATE POLICY "Company members can manage vendors"
ON public.enterprise_vendors FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_companies
    WHERE id = company_id AND enterprise_id = auth.uid()
  )
);

-- Analytics policies
CREATE POLICY "Company members can view analytics"
ON public.enterprise_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_companies
    WHERE id = company_id AND enterprise_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.enterprise_team_members etm
    JOIN public.enterprise_teams et ON et.id = etm.team_id
    WHERE etm.user_id = auth.uid() AND et.company_id = company_id
  )
);

-- Create indexes for enterprise tables
CREATE INDEX idx_enterprise_companies_enterprise_id ON public.enterprise_companies(enterprise_id);
CREATE INDEX idx_enterprise_companies_verified ON public.enterprise_companies(is_verified) WHERE is_verified = true;
CREATE INDEX idx_enterprise_teams_company_id ON public.enterprise_teams(company_id);
CREATE INDEX idx_enterprise_teams_lead_id ON public.enterprise_teams(team_lead_id);
CREATE INDEX idx_enterprise_team_members_team_id ON public.enterprise_team_members(team_id);
CREATE INDEX idx_enterprise_team_members_user_id ON public.enterprise_team_members(user_id);
CREATE INDEX idx_enterprise_team_members_active ON public.enterprise_team_members(is_active) WHERE is_active = true;
CREATE INDEX idx_enterprise_projects_company_id ON public.enterprise_projects(company_id);
CREATE INDEX idx_enterprise_projects_team_id ON public.enterprise_projects(team_id);
CREATE INDEX idx_enterprise_projects_status ON public.enterprise_projects(project_status);
CREATE INDEX idx_enterprise_procurement_company_id ON public.enterprise_procurement(company_id);
CREATE INDEX idx_enterprise_procurement_status ON public.enterprise_procurement(procurement_status);
CREATE INDEX idx_enterprise_vendors_company_id ON public.enterprise_vendors(company_id);
CREATE INDEX idx_enterprise_vendors_status ON public.enterprise_vendors(vendor_status);
CREATE INDEX idx_enterprise_analytics_company_id ON public.enterprise_analytics(company_id);
CREATE INDEX idx_enterprise_analytics_category ON public.enterprise_analytics(metric_category);
