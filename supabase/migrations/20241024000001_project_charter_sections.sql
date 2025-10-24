-- Migration: Project Charter Sections Table
-- Purpose: Store charter sections for Project Charter Generator tool
-- Created: 2025-10-24

-- Create project_charter_sections table
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
  
  -- Ensure unique section per project
  UNIQUE(project_id, section_name)
);

-- Create index for faster queries
CREATE INDEX idx_charter_sections_project_id ON public.project_charter_sections(project_id);
CREATE INDEX idx_charter_sections_order ON public.project_charter_sections(project_id, section_order);

-- Enable Row-Level Security
ALTER TABLE public.project_charter_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view charter sections for their own projects
CREATE POLICY "Users can view charter sections for their projects"
ON public.project_charter_sections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can insert charter sections for their own projects
CREATE POLICY "Users can insert charter sections for their projects"
ON public.project_charter_sections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can update charter sections for their own projects
CREATE POLICY "Users can update charter sections for their projects"
ON public.project_charter_sections FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policy: Users can delete charter sections for their own projects
CREATE POLICY "Users can delete charter sections for their projects"
ON public.project_charter_sections FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_charter_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_charter_sections_updated_at
  BEFORE UPDATE ON public.project_charter_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_charter_sections_updated_at();

-- Verification
DO $$
BEGIN
  RAISE NOTICE '✅ Migration complete: project_charter_sections table created';
  RAISE NOTICE 'Table: project_charter_sections';
  RAISE NOTICE 'Indexes: 2 created';
  RAISE NOTICE 'RLS Policies: 4 created (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE 'Triggers: 1 created (updated_at)';
END $$;

