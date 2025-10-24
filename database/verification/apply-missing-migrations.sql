-- ================================================================
-- APPLY ALL PROJECT UNIFICATION MIGRATIONS
-- Run this if any tables are missing
-- ================================================================

-- This script combines all 3 migrations into one file
-- Run in Supabase SQL Editor

-- ================================================================
-- MIGRATION 1: project_charter_sections
-- ================================================================

-- Create table for charter sections
CREATE TABLE IF NOT EXISTS public.project_charter_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  section_order INTEGER NOT NULL,
  section_description TEXT,
  content TEXT,
  is_completed BOOLEAN DEFAULT false,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, section_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_charter_sections_project_id 
ON public.project_charter_sections(project_id);

CREATE INDEX IF NOT EXISTS idx_charter_sections_project_order 
ON public.project_charter_sections(project_id, section_order);

-- Enable RLS
ALTER TABLE public.project_charter_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their project charter sections" ON public.project_charter_sections;
CREATE POLICY "Users can view their project charter sections"
ON public.project_charter_sections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert their project charter sections" ON public.project_charter_sections;
CREATE POLICY "Users can insert their project charter sections"
ON public.project_charter_sections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their project charter sections" ON public.project_charter_sections;
CREATE POLICY "Users can update their project charter sections"
ON public.project_charter_sections FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete their project charter sections" ON public.project_charter_sections;
CREATE POLICY "Users can delete their project charter sections"
ON public.project_charter_sections FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_charter_sections_updated_at ON public.project_charter_sections;
CREATE TRIGGER update_charter_sections_updated_at
  BEFORE UPDATE ON public.project_charter_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================================
-- MIGRATION 2: project_risks
-- ================================================================

-- Create table for project risks
CREATE TABLE IF NOT EXISTS public.project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('schedule', 'cost', 'quality', 'safety', 'regulatory', 'resource', 'technical', 'external')),
  probability INTEGER CHECK (probability BETWEEN 1 AND 5),
  impact INTEGER CHECK (impact BETWEEN 1 AND 5),
  risk_score INTEGER GENERATED ALWAYS AS (probability * impact) STORED,
  mitigation_strategy TEXT,
  contingency_plan TEXT,
  status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'assessed', 'mitigated', 'monitored', 'closed')),
  owner TEXT,
  response_strategy TEXT CHECK (response_strategy IN ('avoid', 'mitigate', 'transfer', 'accept')),
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_risks_project_id 
ON public.project_risks(project_id);

CREATE INDEX IF NOT EXISTS idx_risks_project_score 
ON public.project_risks(project_id, risk_score DESC);

CREATE INDEX IF NOT EXISTS idx_risks_category 
ON public.project_risks(project_id, category);

-- Enable RLS
ALTER TABLE public.project_risks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their project risks" ON public.project_risks;
CREATE POLICY "Users can view their project risks"
ON public.project_risks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert their project risks" ON public.project_risks;
CREATE POLICY "Users can insert their project risks"
ON public.project_risks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their project risks" ON public.project_risks;
CREATE POLICY "Users can update their project risks"
ON public.project_risks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete their project risks" ON public.project_risks;
CREATE POLICY "Users can delete their project risks"
ON public.project_risks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_risks_updated_at ON public.project_risks;
CREATE TRIGGER update_risks_updated_at
  BEFORE UPDATE ON public.project_risks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================================
-- MIGRATION 3: project_stakeholders
-- ================================================================

-- Create table for project stakeholders
CREATE TABLE IF NOT EXISTS public.project_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  organization TEXT,
  power_level TEXT CHECK (power_level IN ('high', 'low')),
  interest_level TEXT CHECK (interest_level IN ('high', 'low')),
  engagement_strategy TEXT,
  contact_info TEXT,
  influence_score INTEGER CHECK (influence_score BETWEEN 1 AND 10),
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stakeholders_project_id 
ON public.project_stakeholders(project_id);

CREATE INDEX IF NOT EXISTS idx_stakeholders_project_matrix 
ON public.project_stakeholders(project_id, power_level, interest_level);

-- Enable RLS
ALTER TABLE public.project_stakeholders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their project stakeholders" ON public.project_stakeholders;
CREATE POLICY "Users can view their project stakeholders"
ON public.project_stakeholders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert their project stakeholders" ON public.project_stakeholders;
CREATE POLICY "Users can insert their project stakeholders"
ON public.project_stakeholders FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update their project stakeholders" ON public.project_stakeholders;
CREATE POLICY "Users can update their project stakeholders"
ON public.project_stakeholders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete their project stakeholders" ON public.project_stakeholders;
CREATE POLICY "Users can delete their project stakeholders"
ON public.project_stakeholders FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_stakeholders_updated_at ON public.project_stakeholders;
CREATE TRIGGER update_stakeholders_updated_at
  BEFORE UPDATE ON public.project_stakeholders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check all tables now exist
SELECT 
  'Final Check: ' || COUNT(*)::text || ' of 6 tables exist' as result
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

-- Check RLS is enabled
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as rls_status
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

-- ================================================================
-- SUCCESS MESSAGE
-- ================================================================

SELECT 
  '🎉 ALL MIGRATIONS APPLIED SUCCESSFULLY! 🎉' as message,
  'You can now test the unified project system' as next_step,
  'http://localhost:8080/free/ai-tools/planning' as test_url;

