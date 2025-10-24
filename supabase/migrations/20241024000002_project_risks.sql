-- Migration: Project Risks Table
-- Purpose: Store risk data for Risk Register tool
-- Created: 2025-10-24

-- Create project_risks table
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

-- Create indexes for faster queries
CREATE INDEX idx_project_risks_project_id ON public.project_risks(project_id);
CREATE INDEX idx_project_risks_category ON public.project_risks(project_id, category);
CREATE INDEX idx_project_risks_score ON public.project_risks(project_id, risk_score DESC);
CREATE INDEX idx_project_risks_status ON public.project_risks(project_id, status);

-- Enable Row-Level Security
ALTER TABLE public.project_risks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view risks for their own projects
CREATE POLICY "Users can view risks for their projects"
ON public.project_risks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can insert risks for their own projects
CREATE POLICY "Users can insert risks for their projects"
ON public.project_risks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can update risks for their own projects
CREATE POLICY "Users can update risks for their projects"
ON public.project_risks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can delete risks for their own projects
CREATE POLICY "Users can delete risks for their projects"
ON public.project_risks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_project_risks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_risks_updated_at
  BEFORE UPDATE ON public.project_risks
  FOR EACH ROW
  EXECUTE FUNCTION update_project_risks_updated_at();

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration complete: project_risks table created';
  RAISE NOTICE 'Table: project_risks';
  RAISE NOTICE 'Indexes: 4 created';
  RAISE NOTICE 'RLS Policies: 4 created (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE 'Triggers: 1 created (updated_at)';
  RAISE NOTICE 'Computed Column: risk_score = probability × impact';
END $$;

