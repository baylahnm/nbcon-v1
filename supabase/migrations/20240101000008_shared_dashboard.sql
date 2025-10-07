-- 008-shared-dashboard.sql
-- Shared dashboard layouts and widgets

-- Create dashboard layouts table
CREATE TABLE public.dashboard_layouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  layout_name TEXT NOT NULL,
  layout_type TEXT CHECK (layout_type IN ('default', 'custom', 'template')) DEFAULT 'default',
  role_specific BOOLEAN DEFAULT true,
  layout_config JSONB NOT NULL, -- Dashboard layout configuration
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dashboard widgets table
CREATE TABLE public.dashboard_widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  widget_name TEXT NOT NULL UNIQUE,
  widget_type TEXT CHECK (widget_type IN ('chart', 'table', 'card', 'list', 'metric', 'custom')) NOT NULL,
  widget_category TEXT, -- e.g., 'analytics', 'finance', 'projects', 'team'
  widget_config JSONB NOT NULL, -- Widget configuration schema
  widget_data_source TEXT, -- e.g., 'api', 'database', 'static'
  widget_permissions JSONB, -- Role-based permissions for widget
  is_active BOOLEAN DEFAULT true,
  is_system_widget BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user widget preferences table
CREATE TABLE public.user_widget_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  widget_id UUID NOT NULL REFERENCES public.dashboard_widgets(id) ON DELETE CASCADE,
  widget_position JSONB, -- Position and size configuration
  widget_settings JSONB, -- User-specific widget settings
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, widget_id)
);

-- Create dashboard templates table
CREATE TABLE public.dashboard_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_description TEXT,
  template_type TEXT CHECK (template_type IN ('engineer', 'client', 'enterprise', 'admin')) NOT NULL,
  template_config JSONB NOT NULL, -- Template layout configuration
  is_active BOOLEAN DEFAULT true,
  is_system_template BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dashboard analytics table
CREATE TABLE public.dashboard_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  dashboard_id UUID REFERENCES public.dashboard_layouts(id),
  widget_id UUID REFERENCES public.dashboard_widgets(id),
  interaction_type TEXT CHECK (interaction_type IN ('view', 'click', 'resize', 'move', 'configure')) NOT NULL,
  interaction_data JSONB,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for dashboard tables
ALTER TABLE public.dashboard_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_widget_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dashboard tables
-- Dashboard layouts policies
CREATE POLICY "Users can manage their own dashboard layouts"
ON public.dashboard_layouts FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Users can view public dashboard layouts"
ON public.dashboard_layouts FOR SELECT
USING (is_public = true);

CREATE POLICY "Admins can view all dashboard layouts"
ON public.dashboard_layouts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Dashboard widgets policies
CREATE POLICY "Anyone can view active widgets"
ON public.dashboard_widgets FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage widgets"
ON public.dashboard_widgets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- User widget preferences policies
CREATE POLICY "Users can manage their own widget preferences"
ON public.user_widget_preferences FOR ALL
USING (user_id = auth.uid());

-- Dashboard templates policies
CREATE POLICY "Anyone can view active templates"
ON public.dashboard_templates FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage templates"
ON public.dashboard_templates FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Dashboard analytics policies
CREATE POLICY "Users can view their own analytics"
ON public.dashboard_analytics FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "System can insert analytics data"
ON public.dashboard_analytics FOR INSERT
WITH CHECK (true); -- Allow system to insert analytics data

CREATE POLICY "Admins can view all analytics"
ON public.dashboard_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for dashboard tables
CREATE INDEX idx_dashboard_layouts_user_id ON public.dashboard_layouts(user_id);
CREATE INDEX idx_dashboard_layouts_type ON public.dashboard_layouts(layout_type);
CREATE INDEX idx_dashboard_layouts_active ON public.dashboard_layouts(is_active) WHERE is_active = true;
CREATE INDEX idx_dashboard_widgets_type ON public.dashboard_widgets(widget_type);
CREATE INDEX idx_dashboard_widgets_category ON public.dashboard_widgets(widget_category);
CREATE INDEX idx_dashboard_widgets_active ON public.dashboard_widgets(is_active) WHERE is_active = true;
CREATE INDEX idx_user_widget_preferences_user_id ON public.user_widget_preferences(user_id);
CREATE INDEX idx_user_widget_preferences_widget_id ON public.user_widget_preferences(widget_id);
CREATE INDEX idx_user_widget_preferences_enabled ON public.user_widget_preferences(is_enabled) WHERE is_enabled = true;
CREATE INDEX idx_dashboard_templates_type ON public.dashboard_templates(template_type);
CREATE INDEX idx_dashboard_templates_active ON public.dashboard_templates(is_active) WHERE is_active = true;
CREATE INDEX idx_dashboard_analytics_user_id ON public.dashboard_analytics(user_id);
CREATE INDEX idx_dashboard_analytics_type ON public.dashboard_analytics(interaction_type);
CREATE INDEX idx_dashboard_analytics_created_at ON public.dashboard_analytics(created_at);

-- Function to create default dashboard layout for new users
CREATE OR REPLACE FUNCTION create_default_dashboard_layout()
RETURNS TRIGGER AS $$
DECLARE
  default_config JSONB;
  template_config JSONB;
BEGIN
  -- Get default template for user role
  SELECT template_config INTO template_config
  FROM public.dashboard_templates
  WHERE template_type = NEW.role::TEXT
    AND is_active = true
    AND is_system_template = true
  LIMIT 1;
  
  -- If no template found, create basic default config
  IF template_config IS NULL THEN
    default_config := '{
      "widgets": [],
      "layout": "grid",
      "columns": 3,
      "rows": 4
    }'::JSONB;
  ELSE
    default_config := template_config;
  END IF;
  
  -- Create default dashboard layout
  INSERT INTO public.dashboard_layouts (user_id, layout_name, layout_type, role_specific, layout_config)
  VALUES (
    NEW.user_id,
    'Default Dashboard',
    'default',
    true,
    default_config
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default dashboard layout for new users
CREATE TRIGGER create_default_dashboard_layout_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_dashboard_layout();
