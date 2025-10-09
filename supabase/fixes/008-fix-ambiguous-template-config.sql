-- Fix ambiguous column reference 'template_config' in create_default_dashboard_layout() function
-- Rename the variable to avoid conflict with column name

CREATE OR REPLACE FUNCTION create_default_dashboard_layout()
RETURNS TRIGGER AS $$
DECLARE
  default_config JSONB;
  tmpl_config JSONB;  -- RENAMED from template_config to avoid ambiguity
BEGIN
  -- Get default template for user role
  SELECT dt.template_config INTO tmpl_config  -- Use table alias for clarity
  FROM public.dashboard_templates dt
  WHERE dt.template_type = NEW.role::TEXT
    AND dt.is_active = true
    AND dt.is_system_template = true
  LIMIT 1;
  
  -- If no template found, create basic default config
  IF tmpl_config IS NULL THEN
    default_config := '{
      "widgets": [],
      "layout": "grid",
      "columns": 3,
      "rows": 4
    }'::JSONB;
  ELSE
    default_config := tmpl_config;
  END IF;
  
  -- Create default dashboard layout
  INSERT INTO public.dashboard_layouts (user_id, layout_name, layout_type, role_specific, layout_config)
  VALUES (
    NEW.user_id,
    'Default Dashboard',
    'default',
    true,  -- BOOLEAN value
    default_config
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

