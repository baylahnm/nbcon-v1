-- 011-gantt-tables.sql
-- Gantt chart functionality for construction project management

-- Create Gantt projects table
CREATE TABLE public.gantt_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_by UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  project_type TEXT DEFAULT 'construction' CHECK (project_type IN ('construction', 'renovation', 'infrastructure', 'residential', 'commercial')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  budget DECIMAL(15,2),
  currency TEXT DEFAULT 'SAR',
  location TEXT,
  is_template BOOLEAN DEFAULT false,
  template_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Gantt tasks table
CREATE TABLE public.gantt_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  duration INTEGER, -- days
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  parent_id UUID REFERENCES public.gantt_tasks(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_milestone BOOLEAN DEFAULT false,
  is_critical_path BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  task_type TEXT DEFAULT 'task' CHECK (task_type IN ('task', 'milestone', 'phase', 'deliverable')),
  crew_size INTEGER DEFAULT 1,
  estimated_hours DECIMAL(8,2),
  actual_hours DECIMAL(8,2),
  cost_estimate DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Gantt dependencies table
CREATE TABLE public.gantt_dependencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_task_id UUID NOT NULL REFERENCES public.gantt_tasks(id) ON DELETE CASCADE,
  to_task_id UUID NOT NULL REFERENCES public.gantt_tasks(id) ON DELETE CASCADE,
  dependency_type TEXT DEFAULT 'finish-to-start' CHECK (dependency_type IN ('finish-to-start', 'start-to-start', 'finish-to-finish', 'start-to-finish')),
  lag_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_task_id, to_task_id)
);

-- Create Gantt resources table (crew management)
CREATE TABLE public.gantt_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- e.g., 'foreman', 'electrician', 'plumber', 'crane_operator'
  hourly_rate DECIMAL(8,2),
  availability_schedule JSONB, -- Store availability as JSON
  skills TEXT[],
  contact_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Gantt task assignments table
CREATE TABLE public.gantt_task_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.gantt_tasks(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.gantt_resources(id) ON DELETE CASCADE,
  assigned_hours DECIMAL(8,2),
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(task_id, resource_id)
);

-- Create Gantt change orders table
CREATE TABLE public.gantt_change_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  change_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scope_changes TEXT,
  cost_impact DECIMAL(12,2),
  schedule_impact_days INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
  requested_by UUID REFERENCES public.profiles(user_id),
  approved_by UUID REFERENCES public.profiles(user_id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Gantt punch list table
CREATE TABLE public.gantt_punch_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.gantt_projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.gantt_tasks(id) ON DELETE CASCADE,
  item_description TEXT NOT NULL,
  location TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'verified')),
  assigned_to UUID REFERENCES public.gantt_resources(id),
  due_date DATE,
  completed_date DATE,
  notes TEXT,
  photos JSONB, -- Store photo URLs as JSON array
  created_by UUID NOT NULL REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_gantt_projects_created_by ON public.gantt_projects(created_by);
CREATE INDEX idx_gantt_projects_status ON public.gantt_projects(status);
CREATE INDEX idx_gantt_tasks_project_id ON public.gantt_tasks(project_id);
CREATE INDEX idx_gantt_tasks_parent_id ON public.gantt_tasks(parent_id);
CREATE INDEX idx_gantt_tasks_start_date ON public.gantt_tasks(start_date);
CREATE INDEX idx_gantt_tasks_end_date ON public.gantt_tasks(end_date);
CREATE INDEX idx_gantt_dependencies_from_task ON public.gantt_dependencies(from_task_id);
CREATE INDEX idx_gantt_dependencies_to_task ON public.gantt_dependencies(to_task_id);
CREATE INDEX idx_gantt_resources_project_id ON public.gantt_resources(project_id);
CREATE INDEX idx_gantt_task_assignments_task_id ON public.gantt_task_assignments(task_id);
CREATE INDEX idx_gantt_task_assignments_resource_id ON public.gantt_task_assignments(resource_id);
CREATE INDEX idx_gantt_change_orders_project_id ON public.gantt_change_orders(project_id);
CREATE INDEX idx_gantt_punch_list_project_id ON public.gantt_punch_list(project_id);

-- Enable RLS
ALTER TABLE public.gantt_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gantt_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gantt_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gantt_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gantt_task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gantt_change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gantt_punch_list ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Gantt projects
CREATE POLICY "Users can view their own gantt projects"
ON public.gantt_projects FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Users can create gantt projects"
ON public.gantt_projects FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own gantt projects"
ON public.gantt_projects FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own gantt projects"
ON public.gantt_projects FOR DELETE
USING (auth.uid() = created_by);

-- RLS Policies for Gantt tasks
CREATE POLICY "Users can view tasks from their projects"
ON public.gantt_tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can create tasks in their projects"
ON public.gantt_tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can update tasks in their projects"
ON public.gantt_tasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can delete tasks from their projects"
ON public.gantt_tasks FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- RLS Policies for other tables (similar pattern)
CREATE POLICY "Users can view dependencies from their projects"
ON public.gantt_dependencies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_tasks t1
    JOIN public.gantt_projects p ON t1.project_id = p.id
    WHERE t1.id = from_task_id AND p.created_by = auth.uid()
  )
);

CREATE POLICY "Users can manage dependencies in their projects"
ON public.gantt_dependencies FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_tasks t1
    JOIN public.gantt_projects p ON t1.project_id = p.id
    WHERE t1.id = from_task_id AND p.created_by = auth.uid()
  )
);

-- Similar policies for resources, assignments, change orders, and punch list
CREATE POLICY "Users can view resources from their projects"
ON public.gantt_resources FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can manage resources in their projects"
ON public.gantt_resources FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can view task assignments from their projects"
ON public.gantt_task_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_tasks t
    JOIN public.gantt_projects p ON t.project_id = p.id
    WHERE t.id = task_id AND p.created_by = auth.uid()
  )
);

CREATE POLICY "Users can manage task assignments in their projects"
ON public.gantt_task_assignments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_tasks t
    JOIN public.gantt_projects p ON t.project_id = p.id
    WHERE t.id = task_id AND p.created_by = auth.uid()
  )
);

CREATE POLICY "Users can view change orders from their projects"
ON public.gantt_change_orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can manage change orders in their projects"
ON public.gantt_change_orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can view punch list from their projects"
ON public.gantt_punch_list FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

CREATE POLICY "Users can manage punch list in their projects"
ON public.gantt_punch_list FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.gantt_projects 
    WHERE id = project_id AND created_by = auth.uid()
  )
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_gantt_projects_updated_at
  BEFORE UPDATE ON public.gantt_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_gantt_tasks_updated_at
  BEFORE UPDATE ON public.gantt_tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_gantt_resources_updated_at
  BEFORE UPDATE ON public.gantt_resources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_gantt_change_orders_updated_at
  BEFORE UPDATE ON public.gantt_change_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_gantt_punch_list_updated_at
  BEFORE UPDATE ON public.gantt_punch_list
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
