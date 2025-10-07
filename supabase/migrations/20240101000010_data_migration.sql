-- 010-data-migration.sql
-- Sample data and initial setup

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_name, plan_description, plan_type, price_monthly, price_yearly, features, limits) VALUES
('Free', 'Basic features for getting started', 'free', 0, 0, 
 '{"basic_messaging": true, "profile_creation": true, "job_browsing": true}', 
 '{"messages_per_month": 100, "projects_per_month": 2}'),
 
('Basic', 'Enhanced features for active users', 'basic', 29.99, 299.99,
 '{"advanced_messaging": true, "priority_support": true, "advanced_search": true, "analytics": true}',
 '{"messages_per_month": 1000, "projects_per_month": 10, "storage_gb": 5}'),
 
('Premium', 'Full features for professionals', 'premium', 79.99, 799.99,
 '{"unlimited_messaging": true, "premium_support": true, "ai_assistant": true, "advanced_analytics": true, "custom_branding": true}',
 '{"messages_per_month": -1, "projects_per_month": -1, "storage_gb": 25}'),
 
('Enterprise', 'Custom solutions for large organizations', 'enterprise', 199.99, 1999.99,
 '{"unlimited_everything": true, "dedicated_support": true, "custom_integrations": true, "sso": true, "audit_logs": true}',
 '{"messages_per_month": -1, "projects_per_month": -1, "storage_gb": -1, "users_per_account": -1}');

-- Insert default AI service modes
INSERT INTO public.ai_service_modes (mode_name, mode_description, mode_config, is_active, is_default) VALUES
('General Assistant', 'General purpose AI assistant for various tasks', 
 '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 2000}', true, true),
 
('Code Assistant', 'Specialized AI assistant for coding and development',
 '{"model": "gpt-4", "temperature": 0.3, "max_tokens": 4000, "tools": ["code_interpreter", "web_search"]}', true, false),
 
('Business Analyst', 'AI assistant focused on business analysis and insights',
 '{"model": "gpt-4", "temperature": 0.5, "max_tokens": 3000, "tools": ["data_analysis", "report_generation"]}', true, false);

-- Insert default AI tools
INSERT INTO public.ai_tools (tool_name, tool_description, tool_category, tool_config, tool_permissions) VALUES
('Code Interpreter', 'Execute and analyze code in various programming languages',
 'code', '{"supported_languages": ["python", "javascript", "sql", "bash"], "timeout_seconds": 30}',
 '{"engineer": true, "admin": true}'),
 
('Web Search', 'Search the web for current information',
 'utility', '{"search_provider": "google", "max_results": 10}',
 '{"engineer": true, "client": true, "enterprise": true, "admin": true}'),
 
('Document Generator', 'Generate documents and reports',
 'generation', '{"supported_formats": ["pdf", "docx", "html"], "template_library": true}',
 '{"enterprise": true, "admin": true}'),
 
('Data Analysis', 'Analyze data and generate insights',
 'analysis', '{"supported_formats": ["csv", "json", "xlsx"], "visualization": true}',
 '{"enterprise": true, "admin": true}');

-- Insert default dashboard templates
INSERT INTO public.dashboard_templates (template_name, template_description, template_type, template_config, is_system_template) VALUES
('Engineer Dashboard', 'Default dashboard layout for engineers',
 'engineer', '{
   "widgets": [
     {"id": "profile_summary", "type": "card", "position": {"x": 0, "y": 0, "w": 3, "h": 2}},
     {"id": "recent_jobs", "type": "list", "position": {"x": 3, "y": 0, "w": 3, "h": 3}},
     {"id": "earnings_chart", "type": "chart", "position": {"x": 6, "y": 0, "w": 3, "h": 3}},
     {"id": "skill_ratings", "type": "metric", "position": {"x": 0, "y": 2, "w": 3, "h": 2}},
     {"id": "availability_status", "type": "card", "position": {"x": 3, "y": 3, "w": 3, "h": 2}},
     {"id": "ai_assistant", "type": "custom", "position": {"x": 6, "y": 3, "w": 3, "h": 2}}
   ],
   "layout": "grid",
   "columns": 9,
   "rows": 5
 }', true),

('Client Dashboard', 'Default dashboard layout for clients',
 'client', '{
   "widgets": [
     {"id": "project_overview", "type": "card", "position": {"x": 0, "y": 0, "w": 4, "h": 2}},
     {"id": "active_projects", "type": "list", "position": {"x": 4, "y": 0, "w": 4, "h": 3}},
     {"id": "budget_tracking", "type": "chart", "position": {"x": 8, "y": 0, "w": 4, "h": 3}},
     {"id": "engineer_reviews", "type": "list", "position": {"x": 0, "y": 2, "w": 4, "h": 3}},
     {"id": "recent_messages", "type": "list", "position": {"x": 4, "y": 3, "w": 4, "h": 2}},
     {"id": "ai_assistant", "type": "custom", "position": {"x": 8, "y": 3, "w": 4, "h": 2}}
   ],
   "layout": "grid",
   "columns": 12,
   "rows": 5
 }', true),

('Enterprise Dashboard', 'Default dashboard layout for enterprise users',
 'enterprise', '{
   "widgets": [
     {"id": "company_overview", "type": "card", "position": {"x": 0, "y": 0, "w": 3, "h": 2}},
     {"id": "team_performance", "type": "chart", "position": {"x": 3, "y": 0, "w": 3, "h": 3}},
     {"id": "project_portfolio", "type": "list", "position": {"x": 6, "y": 0, "w": 3, "h": 3}},
     {"id": "financial_summary", "type": "metric", "position": {"x": 9, "y": 0, "w": 3, "h": 2}},
     {"id": "vendor_management", "type": "list", "position": {"x": 0, "y": 2, "w": 3, "h": 3}},
     {"id": "procurement_status", "type": "list", "position": {"x": 3, "y": 3, "w": 3, "h": 2}},
     {"id": "compliance_status", "type": "card", "position": {"x": 6, "y": 3, "w": 3, "h": 2}},
     {"id": "ai_assistant", "type": "custom", "position": {"x": 9, "y": 2, "w": 3, "h": 3}}
   ],
   "layout": "grid",
   "columns": 12,
   "rows": 5
 }', true),

('Admin Dashboard', 'Default dashboard layout for administrators',
 'admin', '{
   "widgets": [
     {"id": "system_overview", "type": "card", "position": {"x": 0, "y": 0, "w": 3, "h": 2}},
     {"id": "user_activity", "type": "chart", "position": {"x": 3, "y": 0, "w": 3, "h": 3}},
     {"id": "revenue_analytics", "type": "chart", "position": {"x": 6, "y": 0, "w": 3, "h": 3}},
     {"id": "support_tickets", "type": "list", "position": {"x": 9, "y": 0, "w": 3, "h": 3}},
     {"id": "system_health", "type": "metric", "position": {"x": 0, "y": 2, "w": 3, "h": 2}},
     {"id": "feature_flags", "type": "list", "position": {"x": 3, "y": 3, "w": 3, "h": 2}},
     {"id": "audit_logs", "type": "list", "position": {"x": 6, "y": 3, "w": 3, "h": 2}},
     {"id": "ai_analytics", "type": "custom", "position": {"x": 9, "y": 3, "w": 3, "h": 2}}
   ],
   "layout": "grid",
   "columns": 12,
   "rows": 5
 }', true);

-- Insert default dashboard widgets
INSERT INTO public.dashboard_widgets (widget_name, widget_type, widget_category, widget_config, widget_data_source, widget_permissions, is_system_widget) VALUES
('Profile Summary', 'card', 'profile', '{"title": "Profile Summary", "show_avatar": true, "show_stats": true}', 'database', '{"engineer": true, "client": true, "enterprise": true}', true),
('Recent Jobs', 'list', 'jobs', '{"title": "Recent Jobs", "limit": 5, "show_status": true}', 'database', '{"engineer": true, "client": true}', true),
('Earnings Chart', 'chart', 'finance', '{"title": "Earnings Overview", "chart_type": "line", "period": "30_days"}', 'database', '{"engineer": true, "enterprise": true}', true),
('Project Overview', 'card', 'projects', '{"title": "Project Overview", "show_progress": true, "show_timeline": true}', 'database', '{"client": true, "enterprise": true}', true),
('Team Performance', 'chart', 'team', '{"title": "Team Performance", "chart_type": "bar", "metrics": ["completion_rate", "quality_score"]}', 'database', '{"enterprise": true}', true),
('AI Assistant', 'custom', 'ai', '{"title": "AI Assistant", "height": "300px", "show_chat": true}', 'api', '{"engineer": true, "client": true, "enterprise": true, "admin": true}', true),
('System Overview', 'card', 'system', '{"title": "System Overview", "show_metrics": true, "show_alerts": true}', 'database', '{"admin": true}', true),
('User Activity', 'chart', 'analytics', '{"title": "User Activity", "chart_type": "area", "period": "7_days"}', 'database', '{"admin": true}', true),
('Support Tickets', 'list', 'support', '{"title": "Support Tickets", "limit": 10, "show_priority": true}', 'database', '{"admin": true}', true);

-- Insert default system settings
INSERT INTO public.admin_system_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
('site_name', 'nbocn', 'string', 'The name of the application', 'general', true),
('site_description', 'Professional Engineering Marketplace', 'string', 'The description of the application', 'general', true),
('default_currency', 'USD', 'string', 'Default currency for pricing and payments', 'billing', false),
('max_file_size_mb', '50', 'number', 'Maximum file upload size in MB', 'features', false),
('ai_enabled', 'true', 'boolean', 'Whether AI features are enabled', 'features', true),
('maintenance_mode', 'false', 'boolean', 'Whether the site is in maintenance mode', 'general', true),
('registration_enabled', 'true', 'boolean', 'Whether new user registration is enabled', 'security', true),
('email_verification_required', 'true', 'boolean', 'Whether email verification is required for new users', 'security', false);

-- Insert default feature flags
INSERT INTO public.admin_feature_flags (flag_name, flag_description, is_enabled, target_users, rollout_strategy) VALUES
('ai_assistant', 'Enable AI assistant feature', true, ARRAY['engineer', 'client', 'enterprise', 'admin'], 'immediate'),
('advanced_analytics', 'Enable advanced analytics dashboard', true, ARRAY['enterprise', 'admin'], 'immediate'),
('real_time_messaging', 'Enable real-time messaging features', true, ARRAY['engineer', 'client', 'enterprise', 'admin'], 'immediate'),
('video_calls', 'Enable video calling features', false, ARRAY['engineer', 'client', 'enterprise'], 'gradual'),
('mobile_app', 'Enable mobile app features', false, ARRAY['engineer', 'client', 'enterprise', 'admin'], 'gradual'),
('api_access', 'Enable API access for enterprise users', true, ARRAY['enterprise'], 'immediate');

-- Create a function to initialize default data for new users
CREATE OR REPLACE FUNCTION initialize_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign default subscription plan based on role
  INSERT INTO public.subscriptions (user_id, plan_id, subscription_status)
  SELECT 
    NEW.user_id,
    sp.id,
    'active'
  FROM public.subscription_plans sp
  WHERE sp.plan_type = 'free'
  LIMIT 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to initialize defaults for new users
CREATE TRIGGER initialize_user_defaults_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_defaults();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_number_active ON public.profiles(account_number) WHERE account_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON public.subscriptions(subscription_status) WHERE subscription_status = 'active';
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_events_user_date ON public.ai_events(user_id, created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with role-based access and account numbers';
COMMENT ON TABLE public.account_numbers IS 'Tracking table for account number assignments by role';
COMMENT ON TABLE public.subscription_plans IS 'Available subscription plans with features and limits';
COMMENT ON TABLE public.ai_service_modes IS 'Configurable AI service modes for different use cases';
COMMENT ON TABLE public.dashboard_templates IS 'Predefined dashboard templates for different user roles';
COMMENT ON TABLE public.admin_system_settings IS 'System-wide configuration settings';
COMMENT ON TABLE public.admin_feature_flags IS 'Feature flags for controlling application features';
