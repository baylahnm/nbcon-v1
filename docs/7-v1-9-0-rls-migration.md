# NBCON PRO v1.9.0 — RLS Policy Migration Plan

## Purpose
Replace role-based RLS checks (e.g., profiles.role = 'admin') with profiles.is_admin while keeping subscription-tier gating unchanged. Prepare to drop profiles.role after validation.

## Objectives
- Switch all admin predicates in RLS/functions to is_admin (or get_user_role() that reads is_admin).
- Eliminate all policy/function dependencies on profiles.role.
- Preserve current admin/non-admin semantics and tier gating.

## Scope
- Policies on: profiles, subscriptions, billing, dashboards, ai, admin tables.
- Functions used in RLS: get_user_role(), helpers (add optional is_admin()).
- Out of scope: App/UI (completed in v1.8.6).

## Strategy
1) Inventory
- List every policy/function using role/admin checks; map old→new predicate.

2) Functions
- Ensure get_user_role() returns 'admin' via is_admin (already done in v1.8.5).
- Optional helper: is_admin() RETURNS boolean (coalesce((SELECT is_admin FROM profiles WHERE user_id = auth.uid()), false)).

3) Policies
- Replace WHERE role = 'admin' → WHERE is_admin = true (or get_user_role() = 'admin').
- Use ALTER POLICY ... USING/WITH CHECK or drop+recreate.

4) Compatibility
- Do NOT drop profiles.role in this release; verify zero references first.
- Keep role in historical/audit tables.

5) Validation
- Compare behavior before/after with seeded admin/non-admin users.
- Confirm no privilege escalation/regression.

## Detailed Work Items
- New migration created: `20250301000001_update_rls_use_is_admin.sql`
  - Reasserts get_user_role() -> is_admin
  - Adds example ALTER POLICY (fill all items below)

### TODO: ALTER POLICY statements per table (from inventory)
- [ ] base_schema: line 63 → replace with is_admin=true
- [ ] admin_tables: lines 138,147,157,171,181,190,204,223,233,243
- [ ] shared_billing: lines 139,161,179,193,212,235
- [ ] shared_dashboard: lines 95,109,128,146
- [ ] shared_ai: lines 125,143,157,185,199,217,235
- [ ] token_tracking_monetization: line 66
- [ ] deploy_production_quotas: line 61

- Verification SQL:
  - SELECT * FROM pg_policies WHERE qual::text ILIKE '%role%' OR with_check::text ILIKE '%role%';
  - Search pg_proc prosrc for ILIKE '%profiles.role%'.

## Testing Checklist
- DB unit: no pg_policies/pg_proc hits for profiles.role.
- Functional: admin (is_admin=true) can access admin areas; non-admin cannot.
- App: login/tiers unchanged; FeatureGate works.
- E2E: subscriptionGating.spec passes 100%; admin smoke (menu visible when is_admin=true).

## Rollback Plan
- Paired rollback migration: 2025xxxxxx_restore_role_based_policies.sql.
- Revert get_user_role() to role-based; recreate prior policies.
- No data changes—safe rollback.

## Timeline
- W1: Inventory + draft migration; staging apply; DB validation.
- W2: App/E2E on staging; security review; finalize.
- W3: Production apply (maintenance); post-apply checks.
- W4 (v1.9.1): If stable, schedule profiles.role drop in separate migration.

## Success Criteria
- 0 references to profiles.role in RLS/functions.
- All tests pass; no access regressions.
- Admin capabilities unchanged; non-admin isolation preserved.
- Ready to remove profiles.role in follow-up release.

## References
- ROLE_TO_TIER_MIGRATION_REPORT.md
- V1_8_5_MIGRATION_STATUS.md
- supabase/migrations/*

## 2.2 Policy Inventory (role='admin' references)

Files and lines to migrate:
- 20240101000001_base_schema.sql:63
- 20240101000005_admin_tables.sql:138,147,157,171,181,190,204,223,233,243
- 20240101000007_shared_billing.sql:139,161,179,193,212,235
- 20240101000008_shared_dashboard.sql:95,109,128,146
- 20240101000009_shared_ai.sql:125,143,157,185,199,217,235
- 20250126000003_token_tracking_monetization.sql:66
- 20251029000001_deploy_production_quotas.sql:61
- (Rollback-only references ignored: 20250201000002_restore_role_column.sql)

Replacement pattern for each:
- USING/WITH CHECK: `EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)`
- Or centralize to: `get_user_role() = 'admin'`

## Regression Test Plan

Playwright (Admin Smoke):
- Login as admin (is_admin=true) → admin nav visible; access admin pages (audit logs, system settings, user management, analytics, flags, notifications).
- Login as non-admin → admin nav hidden; admin routes blocked/redirected.

SQL Sanity Checks:
- Policies scan: `SELECT * FROM pg_policies WHERE qual::text ILIKE '%role = ''admin''%' OR with_check::text ILIKE '%role = ''admin''%';` → expect 0.
- Functions scan: `SELECT proname FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid WHERE n.nspname='public' AND p.prosrc ILIKE '%profiles.role%';` → expect 0.
- Access probes: admin can SELECT from admin_* tables; non-admin cannot (except public settings reads).

Rollback Validation:
- Apply rollback migration; confirm prior behavior restored.
- Re-apply forward migration; confirm no residual role references.

## Status Update
- Applied migration: `20250301000001_update_rls_use_is_admin.sql` (guarded)
- Verification: pg_policies → 0 role='admin' references (public schema)
- Tests: typecheck, unit, Playwright admin smoke → passed
- Rollback: `20250301000002_revert_rls_to_role.sql` created
- Next: plan `profiles.role` drop migration

## 4. Role Column Drop

Migration: `20250301000003_drop_profiles_role.sql`

Scope:
- Drop deprecated `role` column from `public.profiles` now that all RLS uses `is_admin` (or `get_user_role()` backed by `is_admin`).

Pre-checks:
- `SELECT COUNT(*) FROM pg_policies WHERE qual::text ILIKE '%role = ''admin''%' OR with_check::text ILIKE '%role = ''admin''%';` → expect 0
- `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles';` → confirm `is_admin` present; `role` slated for drop

Apply:
- Run the migration during a maintenance window.

Post-deploy verification:
- Admin smoke test (Playwright): admin UI/permissions intact; non-admin blocked
- SQL sanity:
  - `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles';` → `role` absent
  - Policies/functions scan → still 0 `role='admin'`

Notes:
- Keep rollback migration ready (revert RLS to role) if any unexpected access issues appear. Re-adding a dropped column requires a separate DDL; prefer restoring from backup if needed.

## Closing Note
- Residual `role='admin'` strings remain in historical migration files only.
- Live schema/guards use `is_admin`; proceed to schedule `profiles.role` drop during production rollout.
