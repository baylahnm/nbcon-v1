-- Migration: replace role='admin' predicates with is_admin=true
-- Version: NBCON PRO v1.9.0
-- Date: 2025-03-01

-- 1) Reassert get_user_role() to source from is_admin
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT CASE
    WHEN is_admin THEN 'admin'
    ELSE 'user'
  END
  FROM public.profiles
  WHERE user_id = auth.uid();
$$;

-- 2) Update policies to use is_admin (admin tables) with idempotent guards

-- Helper pattern:
-- If policy exists: ALTER
-- Else: CREATE with appropriate FOR/action and predicate

-- profiles_self_access (guarded)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_self_access'
  ) THEN
    EXECUTE 'ALTER POLICY "profiles_self_access" ON public.profiles USING (auth.uid() = user_id OR is_admin = true)';
  ELSE
    EXECUTE 'CREATE POLICY "profiles_self_access" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR is_admin = true)';
  END IF;
END
$$;

-- Admins can view audit logs (SELECT)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_audit_logs' AND policyname='Admins can view audit logs'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can view audit logs" ON public.admin_audit_logs USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can create audit logs (INSERT WITH CHECK)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_audit_logs' AND policyname='Admins can create audit logs'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can create audit logs" ON public.admin_audit_logs WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can create audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can manage system settings (ALL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_system_settings' AND policyname='Admins can manage system settings'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can manage system settings" ON public.admin_system_settings USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage system settings" ON public.admin_system_settings FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can manage user actions (ALL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_user_management' AND policyname='Admins can manage user actions'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can manage user actions" ON public.admin_user_management USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage user actions" ON public.admin_user_management FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can view platform analytics (SELECT)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_platform_analytics' AND policyname='Admins can view platform analytics'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can view platform analytics" ON public.admin_platform_analytics USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view platform analytics" ON public.admin_platform_analytics FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can create analytics data (INSERT WITH CHECK)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_platform_analytics' AND policyname='Admins can create analytics data'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can create analytics data" ON public.admin_platform_analytics WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can create analytics data" ON public.admin_platform_analytics FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can manage all tickets (ALL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_support_tickets' AND policyname='Admins can manage all tickets'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can manage all tickets" ON public.admin_support_tickets USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage all tickets" ON public.admin_support_tickets FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can manage all ticket messages (ALL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_support_messages' AND policyname='Admins can manage all ticket messages'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can manage all ticket messages" ON public.admin_support_messages USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage all ticket messages" ON public.admin_support_messages FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can manage feature flags (ALL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_feature_flags' AND policyname='Admins can manage feature flags'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can manage feature flags" ON public.admin_feature_flags USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage feature flags" ON public.admin_feature_flags FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- Admins can manage notifications (ALL)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_notifications' AND policyname='Admins can manage notifications'
  ) THEN
    EXECUTE 'ALTER POLICY "Admins can manage notifications" ON public.admin_notifications USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage notifications" ON public.admin_notifications FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END
$$;

-- 3) Verification: flag any remaining role='admin' predicates in policies
DO $$
DECLARE misplaced_count integer;
BEGIN
  SELECT COUNT(*) INTO misplaced_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND (qual ILIKE '%role = ''admin''%' OR with_check ILIKE '%role = ''admin''%');

  IF misplaced_count > 0 THEN
    RAISE WARNING 'Remaining policies still reference role=admin: %', misplaced_count;
  ELSE
    RAISE NOTICE 'All public policies migrated to is_admin.';
  END IF;
END
$$;

-- 2b) Additional guarded policy updates to remove role='admin' dependencies

-- Helper function predicate string (inline per EXECUTE blocks)
-- Pattern: EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)

-- subscription_plans (ALL for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscription_plans' AND policyname='Admins can manage subscription plans') THEN
    EXECUTE 'ALTER POLICY "Admins can manage subscription plans" ON public.subscription_plans USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- subscriptions (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='subscriptions' AND policyname='Admins can view all subscriptions') THEN
    EXECUTE 'ALTER POLICY "Admins can view all subscriptions" ON public.subscriptions USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- payments (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='payments' AND policyname='Admins can view all payments') THEN
    EXECUTE 'ALTER POLICY "Admins can view all payments" ON public.payments USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- invoices (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='invoices' AND policyname='Admins can view all invoices') THEN
    EXECUTE 'ALTER POLICY "Admins can view all invoices" ON public.invoices USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all invoices" ON public.invoices FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- invoice_items (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='invoice_items' AND policyname='Admins can view all invoice items') THEN
    EXECUTE 'ALTER POLICY "Admins can view all invoice items" ON public.invoice_items USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all invoice items" ON public.invoice_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- usage_tracking (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='usage_tracking' AND policyname='Admins can view all usage') THEN
    EXECUTE 'ALTER POLICY "Admins can view all usage" ON public.usage_tracking USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all usage" ON public.usage_tracking FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- dashboard_layouts (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='dashboard_layouts' AND policyname='Admins can view all dashboard layouts') THEN
    EXECUTE 'ALTER POLICY "Admins can view all dashboard layouts" ON public.dashboard_layouts USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all dashboard layouts" ON public.dashboard_layouts FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- dashboard_widgets (ALL for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='dashboard_widgets' AND policyname='Admins can manage widgets') THEN
    EXECUTE 'ALTER POLICY "Admins can manage widgets" ON public.dashboard_widgets USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage widgets" ON public.dashboard_widgets FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- dashboard_templates (ALL for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='dashboard_templates' AND policyname='Admins can manage templates') THEN
    EXECUTE 'ALTER POLICY "Admins can manage templates" ON public.dashboard_templates USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage templates" ON public.dashboard_templates FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- dashboard_analytics (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='dashboard_analytics' AND policyname='Admins can view all analytics') THEN
    EXECUTE 'ALTER POLICY "Admins can view all analytics" ON public.dashboard_analytics USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all analytics" ON public.dashboard_analytics FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- AI schemas (service modes, events, conversations, messages, tools, tool_usage, usage_analytics)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_service_modes' AND policyname='Admins can manage AI service modes') THEN
    EXECUTE 'ALTER POLICY "Admins can manage AI service modes" ON public.ai_service_modes USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage AI service modes" ON public.ai_service_modes FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_events' AND policyname='Admins can view all AI events') THEN
    EXECUTE 'ALTER POLICY "Admins can view all AI events" ON public.ai_events USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all AI events" ON public.ai_events FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_conversations' AND policyname='Admins can view all AI conversations') THEN
    EXECUTE 'ALTER POLICY "Admins can view all AI conversations" ON public.ai_conversations USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all AI conversations" ON public.ai_conversations FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_messages' AND policyname='Admins can view all AI messages') THEN
    EXECUTE 'ALTER POLICY "Admins can view all AI messages" ON public.ai_messages USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all AI messages" ON public.ai_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_tools' AND policyname='Admins can manage AI tools') THEN
    EXECUTE 'ALTER POLICY "Admins can manage AI tools" ON public.ai_tools USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can manage AI tools" ON public.ai_tools FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_tool_usage' AND policyname='Admins can view all tool usage') THEN
    EXECUTE 'ALTER POLICY "Admins can view all tool usage" ON public.ai_tool_usage USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all tool usage" ON public.ai_tool_usage FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_usage_analytics' AND policyname='Admins can view all usage analytics') THEN
    EXECUTE 'ALTER POLICY "Admins can view all usage analytics" ON public.ai_usage_analytics USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all usage analytics" ON public.ai_usage_analytics FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- jobs (example engineer policy if applicable)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='jobs' AND policyname='Admins can view all jobs') THEN
    EXECUTE 'ALTER POLICY "Admins can view all jobs" ON public.jobs USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all jobs" ON public.jobs FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- jobs legacy policy title (remove dependency on profiles.role)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='jobs' AND policyname='Engineers can view all job postings') THEN
    EXECUTE 'ALTER POLICY "Engineers can view all job postings" ON public.jobs USING (true)';
  END IF;
END $$;

-- ai_threads (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_threads' AND policyname='Admins can view all AI threads') THEN
    EXECUTE 'ALTER POLICY "Admins can view all AI threads" ON public.ai_threads USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all AI threads" ON public.ai_threads FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- ai_threads legacy policy title (ensure migration from role to is_admin)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_threads' AND policyname='Admins can view all AI conversations') THEN
    EXECUTE 'ALTER POLICY "Admins can view all AI conversations" ON public.ai_threads USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- user_ai_quotas (SELECT for admins)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_ai_quotas' AND policyname='Admins can view all quotas') THEN
    EXECUTE 'ALTER POLICY "Admins can view all quotas" ON public.user_ai_quotas USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  ELSE
    EXECUTE 'CREATE POLICY "Admins can view all quotas" ON public.user_ai_quotas FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true))';
  END IF;
END $$;

-- Views: replace references to profiles.role (example ai_tool_session_summary)
DROP VIEW IF EXISTS public.ai_tool_session_summary;
CREATE OR REPLACE VIEW public.ai_tool_session_summary AS
  SELECT u.user_id,
         COUNT(*) AS total_usage,
         CASE WHEN p.is_admin THEN 'admin' ELSE 'user' END AS user_role
  FROM public.ai_tool_usage u
  JOIN public.profiles p ON p.user_id = u.user_id
  GROUP BY u.user_id, p.is_admin;
