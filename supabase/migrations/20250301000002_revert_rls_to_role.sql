-- Rollback migration: restore role='admin' predicates if needed
-- Version: NBCON PRO v1.9.0
-- Date: 2025-03-01

DO $$
BEGIN
  -- Example: admin_audit_logs (SELECT)
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_audit_logs'
      AND policyname = 'Admins can view audit logs'
  ) THEN
    EXECUTE $pol$
      ALTER POLICY "Admins can view audit logs" ON public.admin_audit_logs
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
    $pol$;
  END IF;

  -- Example: admin_audit_logs (INSERT WITH CHECK)
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_audit_logs'
      AND policyname = 'Admins can create audit logs'
  ) THEN
    EXECUTE $pol$
      ALTER POLICY "Admins can create audit logs" ON public.admin_audit_logs
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
    $pol$;
  END IF;

  -- TODO: Repeat guarded ALTER POLICY blocks for every table updated in
  -- 20250301000001_update_rls_use_is_admin.sql, matching original FOR actions
  -- (ALL/SELECT/INSERT/UPDATE) and USING/WITH CHECK semantics.

END
$$;
