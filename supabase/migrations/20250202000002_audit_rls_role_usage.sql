-- Migration: Audit RLS policies for role-based references
-- Phase: Phase B - Access & Data Model (Section 4)
-- Version: NBCON PRO v2.0.1
-- Date: 2025-02-02
-- 
-- Purpose: Inventory all RLS policies that still reference profiles.role or role='admin'
-- before replacing them with subscription_tier + is_admin logic.
--
-- This is a READ-ONLY audit script. It does not modify any policies or data.
-- Results are logged to audit_rls_findings table and output via RAISE NOTICE.
--
-- See: docs/nbcon-new-plan/2 4- 🔐 Phase B Access & Data Model (Section 4)
-- See: docs/nbcon-new-plan/2 5- 🗄️ Phase C Database & RLS Cleanup (Section 5)

BEGIN;

-- ============================================================================
-- STEP 1: Create audit findings table (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_rls_findings (
    id SERIAL PRIMARY KEY,
    audit_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    schema_name TEXT NOT NULL,
    table_name TEXT NOT NULL,
    policy_name TEXT NOT NULL,
    policy_command TEXT, -- SELECT, INSERT, UPDATE, DELETE, ALL
    finding_type TEXT NOT NULL, -- 'role_reference', 'role_admin_check', 'profiles_role_reference'
    finding_detail TEXT NOT NULL, -- The actual policy clause that contains the reference
    policy_definition TEXT, -- Full policy USING/WITH CHECK clauses
    severity TEXT DEFAULT 'medium', -- 'high' (critical), 'medium' (needs replacement), 'low' (informational)
    migration_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_rls_findings_table ON public.audit_rls_findings(schema_name, table_name);
CREATE INDEX IF NOT EXISTS idx_audit_rls_findings_audit_date ON public.audit_rls_findings(audit_date);
CREATE INDEX IF NOT EXISTS idx_audit_rls_findings_type ON public.audit_rls_findings(finding_type);

-- Add comment for documentation
COMMENT ON TABLE public.audit_rls_findings IS 
  'Audit log of RLS policies that reference legacy role-based access patterns.
   Used during Phase B migration from role-based to tier-based access control.';

COMMENT ON COLUMN public.audit_rls_findings.finding_type IS 
  'Type of role reference: role_reference (generic role check), role_admin_check (role=''admin''), profiles_role_reference (profiles.role column)';

COMMENT ON COLUMN public.audit_rls_findings.severity IS 
  'Severity level: high (blocks migration), medium (needs replacement), low (informational/deferred)';

-- ============================================================================
-- STEP 2: Clear previous audit findings for this audit run
-- ============================================================================

-- Optionally, you can truncate or archive old findings
-- For now, we'll just add new findings with a timestamp filter
DELETE FROM public.audit_rls_findings 
WHERE audit_date >= now() - INTERVAL '1 hour'; -- Clear findings from last hour (for re-runs)

-- ============================================================================
-- STEP 3: Audit RLS Policies for Role References
-- ============================================================================

DO $$
DECLARE
    policy_record RECORD;
    finding_count INTEGER := 0;
    total_policies INTEGER := 0;
    role_reference_patterns TEXT[] := ARRAY[
        '%role%admin%',
        '%role%=''admin''%',
        '%role% = ''admin''%',
        '%role%=''admin''%',
        '%role% = ''admin''%',
        '%profiles.role%',
        '%profiles%.role%',
        '%get_user_role()%',
        '%user_role%',
        '%role::%'
    ];
    pattern TEXT;
    found_match BOOLEAN;
    finding_type TEXT;
    severity_level TEXT;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS Policy Audit: Role-Based References';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Scanning all RLS policies in public schema...';
    RAISE NOTICE '';

    -- Iterate through all RLS policies in the public schema
    FOR policy_record IN
        SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd AS command,
            qual AS using_clause,
            with_check AS with_check_clause
        FROM pg_policies
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname
    LOOP
        total_policies := total_policies + 1;
        found_match := false;

        -- Check USING clause
        IF policy_record.using_clause IS NOT NULL THEN
            FOREACH pattern IN ARRAY role_reference_patterns
            LOOP
                IF policy_record.using_clause ILIKE pattern THEN
                    found_match := true;

                    -- Determine finding type and severity
                    IF policy_record.using_clause ILIKE '%role%''admin''%' OR 
                       policy_record.using_clause ILIKE '%role% = ''admin''%' THEN
                        finding_type := 'role_admin_check';
                        severity_level := 'high';
                    ELSIF policy_record.using_clause ILIKE '%profiles.role%' OR
                          policy_record.using_clause ILIKE '%profiles%.role%' THEN
                        finding_type := 'profiles_role_reference';
                        severity_level := 'high';
                    ELSIF policy_record.using_clause ILIKE '%get_user_role()%' THEN
                        finding_type := 'function_role_reference';
                        severity_level := 'medium';
                    ELSE
                        finding_type := 'role_reference';
                        severity_level := 'medium';
                    END IF;

                    -- Insert finding
                    INSERT INTO public.audit_rls_findings (
                        audit_date,
                        schema_name,
                        table_name,
                        policy_name,
                        policy_command,
                        finding_type,
                        finding_detail,
                        policy_definition,
                        severity,
                        migration_required
                    ) VALUES (
                        now(),
                        policy_record.schemaname,
                        policy_record.tablename,
                        policy_record.policyname,
                        policy_record.command::TEXT,
                        finding_type,
                        'USING clause: ' || LEFT(policy_record.using_clause, 200),
                        policy_record.using_clause,
                        severity_level,
                        true
                    );

                    finding_count := finding_count + 1;
                    EXIT; -- Found a match, no need to check other patterns for this clause
                END IF;
            END LOOP;
        END IF;

        -- Check WITH CHECK clause
        IF policy_record.with_check_clause IS NOT NULL AND NOT found_match THEN
            FOREACH pattern IN ARRAY role_reference_patterns
            LOOP
                IF policy_record.with_check_clause ILIKE pattern THEN
                    found_match := true;

                    -- Determine finding type and severity
                    IF policy_record.with_check_clause ILIKE '%role%''admin''%' OR 
                       policy_record.with_check_clause ILIKE '%role% = ''admin''%' THEN
                        finding_type := 'role_admin_check';
                        severity_level := 'high';
                    ELSIF policy_record.with_check_clause ILIKE '%profiles.role%' OR
                          policy_record.with_check_clause ILIKE '%profiles%.role%' THEN
                        finding_type := 'profiles_role_reference';
                        severity_level := 'high';
                    ELSIF policy_record.with_check_clause ILIKE '%get_user_role()%' THEN
                        finding_type := 'function_role_reference';
                        severity_level := 'medium';
                    ELSE
                        finding_type := 'role_reference';
                        severity_level := 'medium';
                    END IF;

                    -- Insert finding
                    INSERT INTO public.audit_rls_findings (
                        audit_date,
                        schema_name,
                        table_name,
                        policy_name,
                        policy_command,
                        finding_type,
                        finding_detail,
                        policy_definition,
                        severity,
                        migration_required
                    ) VALUES (
                        now(),
                        policy_record.schemaname,
                        policy_record.tablename,
                        policy_record.policyname,
                        policy_record.command::TEXT,
                        finding_type,
                        'WITH CHECK clause: ' || LEFT(policy_record.with_check_clause, 200),
                        policy_record.with_check_clause,
                        severity_level,
                        true
                    );

                    finding_count := finding_count + 1;
                    EXIT; -- Found a match, no need to check other patterns for this clause
                END IF;
            END LOOP;
        END IF;
    END LOOP;

    -- ============================================================================
    -- STEP 4: Output Audit Summary
    -- ============================================================================

    RAISE NOTICE '========================================';
    RAISE NOTICE 'Audit Summary';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total policies scanned: %', total_policies;
    RAISE NOTICE 'Policies with role references: %', finding_count;
    RAISE NOTICE '';

    -- Output breakdown by severity
    DECLARE
        high_severity_count INTEGER;
        medium_severity_count INTEGER;
        low_severity_count INTEGER;
    BEGIN
        SELECT COUNT(*) INTO high_severity_count
        FROM public.audit_rls_findings
        WHERE audit_date >= now() - INTERVAL '5 minutes'
        AND severity = 'high';

        SELECT COUNT(*) INTO medium_severity_count
        FROM public.audit_rls_findings
        WHERE audit_date >= now() - INTERVAL '5 minutes'
        AND severity = 'medium';

        SELECT COUNT(*) INTO low_severity_count
        FROM public.audit_rls_findings
        WHERE audit_date >= now() - INTERVAL '5 minutes'
        AND severity = 'low';

        RAISE NOTICE 'Severity Breakdown:';
        RAISE NOTICE '  High (blocks migration): %', high_severity_count;
        RAISE NOTICE '  Medium (needs replacement): %', medium_severity_count;
        RAISE NOTICE '  Low (informational): %', low_severity_count;
        RAISE NOTICE '';
    END;

    -- Output breakdown by finding type
    DECLARE
        type_record RECORD;
        type_name TEXT;
    BEGIN
        RAISE NOTICE 'Finding Types:';
        FOR type_record IN
            SELECT 
                f.finding_type AS finding_type_name,
                COUNT(*) as count
            FROM public.audit_rls_findings f
            WHERE f.audit_date >= now() - INTERVAL '5 minutes'
            GROUP BY f.finding_type
            ORDER BY count DESC
        LOOP
            RAISE NOTICE '  %: %', type_record.finding_type_name, type_record.count;
        END LOOP;
        RAISE NOTICE '';
    END;

    -- Output table-level summary
    DECLARE
        table_record RECORD;
    BEGIN
        RAISE NOTICE 'Tables with Role-Based Policies:';
        FOR table_record IN
            SELECT 
                table_name,
                COUNT(*) as policy_count
            FROM public.audit_rls_findings
            WHERE audit_date >= now() - INTERVAL '5 minutes'
            GROUP BY table_name
            ORDER BY policy_count DESC, table_name
            LIMIT 20
        LOOP
            RAISE NOTICE '  %: % policies', table_record.table_name, table_record.policy_count;
        END LOOP;
        RAISE NOTICE '';
    END;

    -- ============================================================================
    -- STEP 5: Validation & Next Steps
    -- ============================================================================

    IF finding_count > 0 THEN
        RAISE WARNING '========================================';
        RAISE WARNING 'ACTION REQUIRED: Role-Based Policies Found';
        RAISE WARNING '========================================';
        RAISE WARNING 'Found % policies that reference role-based access patterns.', finding_count;
        RAISE WARNING 'These must be replaced with subscription_tier + is_admin logic.';
        RAISE WARNING '';
        RAISE WARNING 'Next Steps:';
        RAISE WARNING '1. Review findings in: SELECT * FROM public.audit_rls_findings WHERE audit_date >= now() - INTERVAL ''5 minutes'';';
        RAISE WARNING '2. Create replacement policies using is_admin instead of role=''admin''';
        RAISE WARNING '3. Test new policies on staging before applying to production';
        RAISE WARNING '4. Apply replacement migration after validation';
        RAISE WARNING '';
        RAISE WARNING 'See: docs/nbcon-new-plan/2 5- 🗄️ Phase C Database & RLS Cleanup (Section 5)';
    ELSE
        RAISE NOTICE '✅ SUCCESS: No role-based policy references found!';
        RAISE NOTICE 'RLS policies are ready for tier-based access model.';
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE 'Detailed findings stored in: public.audit_rls_findings';
    RAISE NOTICE 'Query: SELECT * FROM public.audit_rls_findings WHERE audit_date >= now() - INTERVAL ''5 minutes'' ORDER BY severity DESC, table_name, policy_name;';
    RAISE NOTICE '========================================';
END
$$;

-- ============================================================================
-- STEP 6: Create helpful view for querying audit results
-- ============================================================================

CREATE OR REPLACE VIEW public.v_audit_rls_findings_recent AS
SELECT 
    id,
    audit_date,
    schema_name || '.' || table_name AS full_table_name,
    policy_name,
    policy_command,
    finding_type,
    severity,
    LEFT(finding_detail, 100) AS finding_summary,
    migration_required,
    created_at
FROM public.audit_rls_findings
WHERE audit_date >= now() - INTERVAL '24 hours'
ORDER BY 
    severity DESC, -- High severity first
    table_name,
    policy_name;

COMMENT ON VIEW public.v_audit_rls_findings_recent IS 
  'Recent RLS audit findings (last 24 hours) for easy querying during migration.';

-- ============================================================================
-- STEP 7: Log migration completion
-- ============================================================================

DO $$
DECLARE
    total_findings INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_findings
    FROM public.audit_rls_findings
    WHERE audit_date >= now() - INTERVAL '5 minutes';

    RAISE NOTICE '';
    RAISE NOTICE 'Migration completed successfully.';
    RAISE NOTICE 'Total findings recorded: %', total_findings;
    RAISE NOTICE '';
    RAISE NOTICE 'To view findings, run:';
    RAISE NOTICE '  SELECT * FROM public.v_audit_rls_findings_recent;';
    RAISE NOTICE 'Or query full details:';
    RAISE NOTICE '  SELECT * FROM public.audit_rls_findings WHERE audit_date >= now() - INTERVAL ''5 minutes'' ORDER BY severity DESC;';
END
$$;

COMMIT;

-- Rollback instructions (for emergency use only):
-- BEGIN;
-- DROP VIEW IF EXISTS public.v_audit_rls_findings_recent;
-- DROP TABLE IF EXISTS public.audit_rls_findings;
-- COMMIT;
