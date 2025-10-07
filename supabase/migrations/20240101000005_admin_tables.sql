-- 005-admin-tables.sql
-- Admin-specific tables and features

-- Create admin audit logs table
CREATE TABLE public.admin_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.profiles(user_id),
  action_type TEXT NOT NULL, -- e.g., 'user_created', 'user_suspended', 'payment_processed'
  target_type TEXT, -- e.g., 'user', 'job', 'payment'
  target_id UUID,
  description TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin system settings table
CREATE TABLE public.admin_system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT CHECK (setting_type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
  description TEXT,
  category TEXT, -- e.g., 'general', 'billing', 'security', 'features'
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin user management table
CREATE TABLE public.admin_user_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  admin_id UUID NOT NULL REFERENCES public.profiles(user_id),
  action_type TEXT NOT NULL CHECK (action_type IN ('suspend', 'unsuspend', 'delete', 'role_change', 'verification')),
  action_reason TEXT,
  previous_data JSONB,
  new_data JSONB,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin platform analytics table
CREATE TABLE public.admin_platform_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,2),
  metric_unit TEXT,
  metric_category TEXT, -- e.g., 'users', 'revenue', 'activity', 'performance'
  dimension_key TEXT, -- e.g., 'role', 'region', 'plan'
  dimension_value TEXT,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin support tickets table
CREATE TABLE public.admin_support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  ticket_type TEXT CHECK (ticket_type IN ('technical', 'billing', 'account', 'feature_request', 'bug_report')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'pending_user', 'resolved', 'closed')) DEFAULT 'open',
  assigned_admin_id UUID REFERENCES public.profiles(user_id),
  resolution_notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create admin support ticket messages table
CREATE TABLE public.admin_support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.admin_support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id),
  sender_type TEXT CHECK (sender_type IN ('user', 'admin')) NOT NULL,
  message_text TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- Internal admin notes
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin feature flags table
CREATE TABLE public.admin_feature_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flag_name TEXT NOT NULL UNIQUE,
  flag_description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  target_users TEXT[], -- Array of user roles or specific user IDs
  target_percentage INTEGER CHECK (target_percentage BETWEEN 0 AND 100),
  rollout_strategy TEXT CHECK (rollout_strategy IN ('gradual', 'immediate', 'a_b_test')),
  conditions JSONB, -- Additional conditions for feature flag
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin notifications table
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type TEXT NOT NULL, -- e.g., 'system_alert', 'user_report', 'payment_issue'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')) DEFAULT 'info',
  target_admins TEXT[], -- Array of admin user IDs
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for admin tables
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_user_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin tables
-- Audit logs policies
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can create audit logs"
ON public.admin_audit_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- System settings policies
CREATE POLICY "Admins can manage system settings"
ON public.admin_system_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Public settings are readable by all"
ON public.admin_system_settings FOR SELECT
USING (is_public = true);

-- User management policies
CREATE POLICY "Admins can manage user actions"
ON public.admin_user_management FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Platform analytics policies
CREATE POLICY "Admins can view platform analytics"
ON public.admin_platform_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can create analytics data"
ON public.admin_platform_analytics FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Support tickets policies
CREATE POLICY "Users can manage their own tickets"
ON public.admin_support_tickets FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all tickets"
ON public.admin_support_tickets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Support messages policies
CREATE POLICY "Users can view their ticket messages"
ON public.admin_support_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_support_tickets
    WHERE id = ticket_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all ticket messages"
ON public.admin_support_messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Feature flags policies
CREATE POLICY "Admins can manage feature flags"
ON public.admin_feature_flags FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Notifications policies
CREATE POLICY "Admins can manage notifications"
ON public.admin_notifications FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for admin tables
CREATE INDEX idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX idx_admin_audit_logs_action_type ON public.admin_audit_logs(action_type);
CREATE INDEX idx_admin_audit_logs_target ON public.admin_audit_logs(target_type, target_id);
CREATE INDEX idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);
CREATE INDEX idx_admin_system_settings_key ON public.admin_system_settings(setting_key);
CREATE INDEX idx_admin_system_settings_category ON public.admin_system_settings(category);
CREATE INDEX idx_admin_user_management_target_user ON public.admin_user_management(target_user_id);
CREATE INDEX idx_admin_user_management_admin_id ON public.admin_user_management(admin_id);
CREATE INDEX idx_admin_user_management_active ON public.admin_user_management(is_active) WHERE is_active = true;
CREATE INDEX idx_admin_platform_analytics_metric ON public.admin_platform_analytics(metric_name);
CREATE INDEX idx_admin_platform_analytics_category ON public.admin_platform_analytics(metric_category);
CREATE INDEX idx_admin_support_tickets_user_id ON public.admin_support_tickets(user_id);
CREATE INDEX idx_admin_support_tickets_status ON public.admin_support_tickets(status);
CREATE INDEX idx_admin_support_tickets_priority ON public.admin_support_tickets(priority);
CREATE INDEX idx_admin_support_tickets_number ON public.admin_support_tickets(ticket_number);
CREATE INDEX idx_admin_support_messages_ticket_id ON public.admin_support_messages(ticket_id);
CREATE INDEX idx_admin_feature_flags_name ON public.admin_feature_flags(flag_name);
CREATE INDEX idx_admin_feature_flags_enabled ON public.admin_feature_flags(is_enabled) WHERE is_enabled = true;
CREATE INDEX idx_admin_notifications_type ON public.admin_notifications(notification_type);
CREATE INDEX idx_admin_notifications_unread ON public.admin_notifications(is_read) WHERE is_read = false;
