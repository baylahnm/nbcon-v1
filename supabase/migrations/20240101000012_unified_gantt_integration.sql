-- 012-unified-gantt-integration.sql
-- Integrate existing project tables with Gantt functionality
-- This creates a unified project data layer for all AI Tools

-- Add Gantt-specific fields to existing project tables
-- This allows all tools to share the same project data

-- Add Gantt fields to client_projects
ALTER TABLE public.client_projects 
ADD COLUMN IF NOT EXISTS gantt_project_id UUID REFERENCES public.gantt_projects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS gantt_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gantt_start_date DATE,
ADD COLUMN IF NOT EXISTS gantt_end_date DATE,
ADD COLUMN IF NOT EXISTS gantt_budget DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS gantt_currency TEXT DEFAULT 'SAR';

-- Add Gantt fields to enterprise_projects  
ALTER TABLE public.enterprise_projects
ADD COLUMN IF NOT EXISTS gantt_project_id UUID REFERENCES public.gantt_projects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS gantt_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gantt_start_date DATE,
ADD COLUMN IF NOT EXISTS gantt_end_date DATE,
ADD COLUMN IF NOT EXISTS gantt_budget DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS gantt_currency TEXT DEFAULT 'SAR';

-- Create a unified projects view that combines all project types
CREATE OR REPLACE VIEW public.unified_projects AS
SELECT 
  'client' as project_source,
  cp.id as source_project_id,
  cp.project_name as name,
  cp.project_description as description,
  COALESCE(cp.gantt_start_date, cp.created_at::date) as start_date,
  COALESCE(cp.gantt_end_date, cp.created_at::date + INTERVAL '30 days') as end_date,
  cp.client_id as owner_id,
  cp.project_type as project_type,
  cp.project_status as status,
  COALESCE(cp.gantt_budget, cp.budget_min, 0) as budget,
  COALESCE(cp.gantt_currency, cp.currency, 'SAR') as currency,
  cp.project_location as location,
  cp.gantt_project_id,
  cp.gantt_enabled,
  cp.created_at,
  cp.updated_at
FROM public.client_projects cp
WHERE cp.gantt_enabled = true

UNION ALL

SELECT 
  'enterprise' as project_source,
  ep.id as source_project_id,
  ep.project_name as name,
  ep.project_description as description,
  COALESCE(ep.gantt_start_date, ep.created_at::date) as start_date,
  COALESCE(ep.gantt_end_date, ep.created_at::date + INTERVAL '30 days') as end_date,
  ep.company_id as owner_id,
  ep.project_type as project_type,
  ep.project_status as status,
  COALESCE(ep.gantt_budget, ep.budget, 0) as budget,
  COALESCE(ep.gantt_currency, ep.currency, 'SAR') as currency,
  NULL as location,
  ep.gantt_project_id,
  ep.gantt_enabled,
  ep.created_at,
  ep.updated_at
FROM public.enterprise_projects ep
WHERE ep.gantt_enabled = true

UNION ALL

SELECT 
  'gantt' as project_source,
  gp.id as source_project_id,
  gp.name,
  gp.description,
  gp.start_date,
  gp.end_date,
  gp.created_by as owner_id,
  gp.project_type,
  gp.status,
  COALESCE(gp.budget, 0) as budget,
  gp.currency,
  gp.location,
  gp.id as gantt_project_id,
  true as gantt_enabled,
  gp.created_at,
  gp.updated_at
FROM public.gantt_projects gp;

-- Create a unified tasks view that includes all task types
CREATE OR REPLACE VIEW public.unified_tasks AS
SELECT 
  gt.id,
  gt.project_id,
  gt.title,
  gt.description,
  gt.start_date,
  gt.end_date,
  gt.duration,
  gt.progress,
  gt.parent_id,
  gt.sort_order,
  gt.is_milestone,
  gt.is_critical_path,
  gt.priority,
  gt.task_type,
  gt.crew_size,
  gt.estimated_hours,
  gt.actual_hours,
  gt.cost_estimate,
  gt.actual_cost,
  gt.created_at,
  gt.updated_at,
  'gantt' as task_source
FROM public.gantt_tasks gt

UNION ALL

-- Add project_tasks if they exist (from other migrations)
SELECT 
  pt.id,
  pt.project_id,
  pt.title,
  pt.description,
  pt.start_date,
  pt.end_date,
  pt.duration,
  pt.progress,
  pt.parent_id,
  pt.sort_order,
  pt.is_milestone,
  pt.is_critical_path,
  pt.priority,
  pt.task_type,
  pt.crew_size,
  pt.estimated_hours,
  pt.actual_hours,
  pt.cost_estimate,
  pt.actual_cost,
  pt.created_at,
  pt.updated_at,
  'project' as task_source
FROM public.project_tasks pt
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_tasks');

-- Create function to enable Gantt for existing projects
CREATE OR REPLACE FUNCTION enable_gantt_for_project(
  project_source TEXT,
  source_project_id UUID,
  user_id UUID
) RETURNS UUID AS $$
DECLARE
  gantt_project_id UUID;
  project_data RECORD;
BEGIN
  -- Get project data based on source
  IF project_source = 'client' THEN
    SELECT 
      cp.project_name,
      cp.project_description,
      COALESCE(cp.gantt_start_date, cp.created_at::date) as start_date,
      COALESCE(cp.gantt_end_date, cp.created_at::date + INTERVAL '30 days') as end_date,
      COALESCE(cp.gantt_budget, cp.budget_min, 0) as budget,
      COALESCE(cp.gantt_currency, cp.currency, 'SAR') as currency,
      cp.project_location as location,
      cp.project_type
    INTO project_data
    FROM public.client_projects cp
    WHERE cp.id = source_project_id AND cp.client_id = user_id;
  ELSIF project_source = 'enterprise' THEN
    SELECT 
      ep.project_name,
      ep.project_description,
      COALESCE(ep.gantt_start_date, ep.created_at::date) as start_date,
      COALESCE(ep.gantt_end_date, ep.created_at::date + INTERVAL '30 days') as end_date,
      COALESCE(ep.gantt_budget, ep.budget, 0) as budget,
      COALESCE(ep.gantt_currency, ep.currency, 'SAR') as currency,
      NULL as location,
      ep.project_type
    INTO project_data
    FROM public.enterprise_projects ep
    WHERE ep.id = source_project_id AND ep.company_id = user_id;
  ELSE
    RAISE EXCEPTION 'Invalid project source: %', project_source;
  END IF;

  -- Check if project exists and user has access
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found or access denied';
  END IF;

  -- Create Gantt project
  INSERT INTO public.gantt_projects (
    name, description, start_date, end_date, created_by, 
    project_type, status, budget, currency, location
  ) VALUES (
    project_data.project_name,
    project_data.project_description,
    project_data.start_date,
    project_data.end_date,
    user_id,
    project_data.project_type,
    'planning',
    project_data.budget,
    project_data.currency,
    project_data.location
  ) RETURNING id INTO gantt_project_id;

  -- Link the original project to the Gantt project
  IF project_source = 'client' THEN
    UPDATE public.client_projects 
    SET gantt_project_id = enable_gantt_for_project.gantt_project_id, gantt_enabled = true
    WHERE id = source_project_id;
  ELSIF project_source = 'enterprise' THEN
    UPDATE public.enterprise_projects 
    SET gantt_project_id = enable_gantt_for_project.gantt_project_id, gantt_enabled = true
    WHERE id = source_project_id;
  END IF;

  RETURN gantt_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's projects for Gantt
CREATE OR REPLACE FUNCTION get_user_gantt_projects(user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  project_type TEXT,
  status TEXT,
  budget DECIMAL(15,2),
  currency TEXT,
  location TEXT,
  project_source TEXT,
  source_project_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.gantt_project_id as id,
    up.name,
    up.description,
    up.start_date,
    up.end_date,
    up.project_type,
    up.status,
    up.budget,
    up.currency,
    up.location,
    up.project_source,
    up.source_project_id,
    up.created_at,
    up.updated_at
  FROM public.unified_projects up
  WHERE up.owner_id = user_id
  ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get tasks for a Gantt project
CREATE OR REPLACE FUNCTION get_gantt_project_tasks(gantt_project_id UUID, user_id UUID)
RETURNS TABLE (
  id UUID,
  project_id UUID,
  title TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  duration INTEGER,
  progress DECIMAL(5,2),
  parent_id UUID,
  sort_order INTEGER,
  is_milestone BOOLEAN,
  is_critical_path BOOLEAN,
  priority TEXT,
  task_type TEXT,
  crew_size INTEGER,
  estimated_hours DECIMAL(8,2),
  actual_hours DECIMAL(8,2),
  cost_estimate DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Check if user has access to this project
  IF NOT EXISTS (
    SELECT 1 FROM public.gantt_projects gp 
    WHERE gp.id = gantt_project_id AND gp.created_by = user_id
  ) THEN
    RAISE EXCEPTION 'Access denied to project';
  END IF;

  RETURN QUERY
  SELECT 
    gt.id,
    gt.project_id,
    gt.title,
    gt.description,
    gt.start_date,
    gt.end_date,
    gt.duration,
    gt.progress,
    gt.parent_id,
    gt.sort_order,
    gt.is_milestone,
    gt.is_critical_path,
    gt.priority,
    gt.task_type,
    gt.crew_size,
    gt.estimated_hours,
    gt.actual_hours,
    gt.cost_estimate,
    gt.actual_cost,
    gt.created_at,
    gt.updated_at
  FROM public.gantt_tasks gt
  WHERE gt.project_id = gantt_project_id
  ORDER BY gt.sort_order, gt.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_projects_gantt_enabled ON public.client_projects(gantt_enabled) WHERE gantt_enabled = true;
CREATE INDEX IF NOT EXISTS idx_enterprise_projects_gantt_enabled ON public.enterprise_projects(gantt_enabled) WHERE gantt_enabled = true;
CREATE INDEX IF NOT EXISTS idx_client_projects_gantt_project_id ON public.client_projects(gantt_project_id) WHERE gantt_project_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_enterprise_projects_gantt_project_id ON public.enterprise_projects(gantt_project_id) WHERE gantt_project_id IS NOT NULL;

-- Grant permissions for the views and functions
GRANT SELECT ON public.unified_projects TO authenticated;
GRANT SELECT ON public.unified_tasks TO authenticated;
GRANT EXECUTE ON FUNCTION enable_gantt_for_project(TEXT, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_gantt_projects(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_gantt_project_tasks(UUID, UUID) TO authenticated;

-- Add RLS policies for the new fields
CREATE POLICY "Users can update their own client project Gantt settings"
ON public.client_projects FOR UPDATE
USING (client_id = auth.uid());

CREATE POLICY "Users can update their own enterprise project Gantt settings"
ON public.enterprise_projects FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.enterprise_companies ec
    WHERE ec.id = company_id AND ec.owner_id = auth.uid()
  )
);
