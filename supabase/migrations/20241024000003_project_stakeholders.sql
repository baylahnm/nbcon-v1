-- Migration: Project Stakeholders Table
-- Purpose: Store stakeholder data for Stakeholder Mapper tool
-- Created: 2025-10-24

-- Create project_stakeholders table
CREATE TABLE IF NOT EXISTS public.project_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  organization TEXT,
  power_level TEXT CHECK (power_level IN ('high', 'low')),
  interest_level TEXT CHECK (interest_level IN ('high', 'low')),
  engagement_strategy TEXT,
  communication_frequency TEXT CHECK (communication_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'as-needed')),
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_project_stakeholders_project_id ON public.project_stakeholders(project_id);
CREATE INDEX idx_project_stakeholders_power ON public.project_stakeholders(project_id, power_level, interest_level);

-- Enable Row-Level Security
ALTER TABLE public.project_stakeholders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view stakeholders for their own projects
CREATE POLICY "Users can view stakeholders for their projects"
ON public.project_stakeholders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can insert stakeholders for their own projects
CREATE POLICY "Users can insert stakeholders for their projects"
ON public.project_stakeholders FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can update stakeholders for their own projects
CREATE POLICY "Users can update stakeholders for their projects"
ON public.project_stakeholders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can delete stakeholders for their own projects
CREATE POLICY "Users can delete stakeholders for their projects"
ON public.project_stakeholders FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_project_stakeholders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_stakeholders_updated_at
  BEFORE UPDATE ON public.project_stakeholders
  FOR EACH ROW
  EXECUTE FUNCTION update_project_stakeholders_updated_at();

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration complete: project_stakeholders table created';
  RAISE NOTICE 'Table: project_stakeholders';
  RAISE NOTICE 'Indexes: 2 created';
  RAISE NOTICE 'RLS Policies: 4 created (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE 'Triggers: 1 created (updated_at)';
END $$;

