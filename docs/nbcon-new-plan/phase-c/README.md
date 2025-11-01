# Phase C: Database & RLS Cleanup — Execution Checklist

**Phase:** Phase C - Database & RLS Cleanup (Section 5)  
**Version Target:** `v2.0.2-db`  
**Reference:** [Section 2.5 Documentation](../2%205-%F0%9F%97%84%EF%B8%8FPhase%20C%20Database%20&%20RLS%20Cleanup%20(Section%205)%2029d608c2eef780b385e3edd6cad6b076.md)

---

## 📋 Overview

Phase C completes the migration from role-based to tier-based access control by:
- Removing all legacy `role` column references
- Replacing remaining role-based functions with tier-based logic
- Finalizing RLS policies to use `is_admin` exclusively
- Verifying zero role references remain in the database
- Tagging database release `v2.0.2-db`

---

## ✅ Execution Checklist

| Task | Status | Notes |
|------|--------|-------|
| **1. Pre-Migration Verification** | | |
| 1.1 Verify `profiles.role` column status | ✅ Complete | Column does not exist (confirmed via SQL check) - may have been dropped via `20250301000003_drop_profiles_role.sql` |
| 1.2 Run RLS audit script (`20250202000002_audit_rls_role_usage.sql`) | Pending | Re-run audit to get current baseline of role references |
| 1.3 Inventory all functions referencing `role` | Pending | Document: `generate_account_number`, `has_feature_access`, `assign_account_number`, etc. |
| 1.4 Check for triggers/constraints using `role` | Pending | Verify no triggers depend on role column |
| 1.5 Backup database before role column drop | Pending | Create backup snapshot for rollback safety |
| **2. Drop Legacy Role Column** | | |
| 2.1 Review existing drop migration (`20250301000003_drop_profiles_role.sql`) | Pending | Verify it's idempotent and includes rollback |
| 2.2 Apply drop migration if role column exists | Pending | Run migration or create new one if needed |
| 2.3 Verify `profiles.role` column is removed | Pending | Confirm column no longer exists |
| 2.4 Check for dependent objects (views, indexes, etc.) | Pending | Ensure no broken dependencies |
| **3. Replace Role References in Functions** | | |
| 3.1 Update `generate_account_number()` function | ✅ Complete | ✅ Replaced `role_type` ENUM parameter with `subscription_tier TEXT`. Maps tiers to prefixes (FR/BAS/PRO/ENT). Verified working via Supabase MCP |
| 3.2 Update `assign_account_number()` trigger function | ✅ Complete | ✅ Uses `NEW.subscription_tier` instead of `NEW.role`. Trigger recreated on profiles table. Verified active via Supabase MCP |
| 3.3 Update `assign_account_number_after()` function | ✅ Complete | ✅ Removed `role` column from INSERT statement. Function compatible with new schema. Migration applied and verified |
| 3.4 Update `create_default_dashboard_layout()` function | ✅ Complete | ✅ Migration `20250202000006_fix_remaining_role_functions.sql` applied. Replaced `NEW.role::TEXT` with `NEW.subscription_tier`. Verified working. |
| 3.5 Update `has_feature_access()` function | ✅ Complete | ✅ Migration `20250202000006_fix_remaining_role_functions.sql` applied. Replaced `SELECT role FROM profiles` with `is_admin` + `subscription_tier` checks. Verified working. |
| 3.6 Review/update `get_user_role()` function | ✅ Complete | Already uses `is_admin` internally (returns 'admin'/'user' strings based on is_admin flag) |
| 3.7 Update `initialize_user_defaults()` function | Pending | Remove role-based logic if present |
| **4. Replace Role References in RLS Policies** | | |
| 4.1 Re-run RLS audit after function updates | Pending | Confirm no policy-level role references remain |
| 4.2 Update any remaining policies using `get_user_role()` | Pending | Replace with direct `is_admin` checks |
| 4.3 Verify all policies use `is_admin` or `subscription_tier` | Pending | Final policy verification |
| **5. Database Schema Updates** | | |
| 5.1 Migrate `account_numbers.role` column (if exists) | ✅ Complete | ✅ Migration applied via Supabase MCP. Column dropped, functions updated, trigger verified |
| 5.1a Analyze account_numbers table data | ✅ Complete | ✅ Audit complete: 0 rows (empty table), 0 distinct roles/users. Documented in `docs/nbcon-new-plan/phase-c/account_numbers.md` |
| 5.1b Create migration for account_numbers.role | ✅ Complete | ✅ Migration created: `supabase/migrations/20250202000004_fix_account_number_functions.sql`. Updates functions, drops role column, includes verification queries |
| 5.1c Update functions referencing account_numbers.role | ✅ Complete | ✅ Functions updated: `generate_account_number()` (TEXT param), `assign_account_number()` (uses NEW.subscription_tier), `assign_account_number_after()` (removed role from INSERT) |
| 5.1d Test migration in staging | ✅ Complete | ✅ Migration applied via Supabase MCP. All verification queries passed: function signatures correct, trigger active, role column dropped, tier prefixes working (FR/BAS/PRO/ENT) |
| 5.2 Update any views referencing `profiles.role` | ✅ Complete | ✅ Scan complete: No views reference `profiles.role`. View `ai_tool_session_summary` already uses `is_admin` (derived role, not column). See `SCAN_RESULTS.md` for details. |
| 5.3 Remove or update `role` ENUM type (if exists) | ✅ Complete | ✅ **Decision:** Drop ENUM. Migration created: `supabase/migrations/20250202000005_drop_user_role_enum.sql`. Includes comprehensive dependency checks, verification, and rollback instructions. Zero dependencies confirmed - safe to drop. |
| **6. Audit & Verification** | | |
| 6.1 Re-run RLS audit script | ✅ Complete | ✅ Re-audit completed 2025-02-02 via Supabase MCP. **Zero high-severity findings** confirmed. Zero medium-severity findings. All role references removed from RLS policies. Previous finding was from old audit (2025-11-01). Current state: All policies use `is_admin` instead of `get_user_role()` or `profiles.role`. Results logged in `audit_rls_findings` table. |
| 6.2 Run grep scan for "role" in migrations | ✅ Complete | ✅ Scan complete: 100+ historical references found (expected in old migrations). **Zero active role references** in current schema. TypeScript source has some `role` properties marked DEPRECATED (backward compatibility). Details in `SCAN_RESULTS.md`. |
| 6.3 Verify no broken function dependencies | ✅ Complete | ✅ All critical functions verified and fixed: `generate_account_number()`, `assign_account_number()`, `get_user_role()`, `initialize_user_defaults()`, `has_feature_access()`, `create_default_dashboard_layout()` all working with tier-based logic. Migration `20250202000006_fix_remaining_role_functions.sql` applied. See `FUNCTION_VERIFICATION.md` |
| 6.4 Test admin access via `is_admin` flag | ✅ Complete | ✅ Tests executed via Supabase MCP. All admin access tests passed: RLS policies verified, admin feature access working, admin table access confirmed. See `TEST_RESULTS.md` |
| 6.5 Test tier-based access enforcement | ✅ Complete | ✅ Tests executed via Supabase MCP. All tier tests passed: tier distribution verified, account number prefixes correct (FR/BAS/PRO/ENT), feature access by tier working, generate_account_number() validated. See `TEST_RESULTS.md` |
| **7. Audit Logging** | | |
| 7.1 Create `audit_log` table (if not exists) | Pending | For tier/admin change tracking |
| 7.2 Create `log_tier_change()` trigger function | Pending | Log subscription_tier changes |
| 7.3 Create `log_admin_change()` trigger function | Pending | Log is_admin flag changes (optional) |
| 7.4 Add triggers to `profiles` table | Pending | AFTER UPDATE triggers for tier/admin changes |
| **8. Migration Documentation** | | |
| 8.1 Update `supabase/migrations/README.md` | Pending | Document Phase C migrations and guardrails |
| 8.2 Create migration summary document | Pending | List all Phase C migrations with descriptions |
| 8.3 Document rollback procedures | Pending | Step-by-step rollback guide for each migration |
| 8.4 Create Phase C completion report | Pending | Summary of changes, risks, and verification |
| **9. TypeScript Type Generation** | | |
| 9.1 Regenerate Supabase types | Pending | `pnpm exec supabase gen types typescript --local > src/types/supabase.ts` |
| 9.2 Verify types reflect role column removal | Pending | Confirm `profiles` type no longer has `role` property |
| 9.3 Update frontend type references | Pending | Remove any TypeScript code referencing `user.role` |
| **10. Database Release Tagging** | | |
| 10.1 Final migration verification | Pending | Ensure all migrations apply cleanly |
| 10.2 Create migration manifest | Pending | List all migrations in Phase C sequence |
| 10.3 Tag database release `v2.0.2-db` | Pending | Create Git tag and document in migration README |
| 10.4 Update `status.md` | Pending | Mark Phase C as complete |
| **11. Testing & Validation** | | |
| 11.1 Run all unit tests | Pending | `pnpm run test` — verify no failures |
| 11.2 Run integration tests | Pending | Test database queries and RLS policies |
| 11.3 Run E2E tests for tier-based access | Pending | Playwright tests for Free/Basic/Pro/Enterprise |
| 11.4 Manual admin access verification | Pending | Test admin users can access all resources |
| 11.5 Verify Stripe webhook tier sync still works | Pending | Ensure subscription_tier updates propagate correctly |

---

## 🔍 Current State Analysis

### Role Column Status
- **profiles.role:** ❌ Does not exist (confirmed removed)
- **account_numbers.role:** ⚠️ **EXISTS** — Must migrate or drop (USER-DEFINED type, NOT NULL)
- **Migration File:** `supabase/migrations/20250301000003_drop_profiles_role.sql` (exists, targets profiles only)

### Functions Requiring Updates
| Function Name | Reference Type | Priority | Status |
|---------------|----------------|----------|--------|
| `generate_account_number(role_type)` | Parameter + WHERE clause | High | Pending |
| `assign_account_number()` | `NEW.role` reference | High | Pending |
| `assign_account_number_after()` | `NEW.role` insertion | High | Pending |
| `create_default_dashboard_layout()` | `NEW.role::TEXT` | Medium | Pending |
| `has_feature_access()` | `SELECT role FROM profiles` | High | Pending |
| `get_user_role()` | Uses `is_admin` (already updated) | Low | ✅ Complete |

### RLS Policies Status
- **Profiles Policy:** ✅ Updated to use `is_admin` (audit finding resolved)
- **Account Numbers Table:** ✅ RLS enabled — 2 policies found: "Allow system to insert" (INSERT), "Users can view their own account number" (SELECT using auth.uid())
- **Other Policies:** ⏳ Pending audit re-run after function updates

### Account Numbers Table Structure
- **Columns:** `id` (uuid), `account_number` (text), `role` (USER-DEFINED ENUM, NOT NULL), `user_id` (uuid), `created_at` (timestamptz), `is_active` (boolean)
- **RLS Status:** Enabled with 2 policies
- **Action Required:** Migrate or drop `role` column before updating functions

---

## 🚨 Critical Dependencies

1. **Account Numbers Table Migration (BLOCKER)**
   - ⚠️ **CRITICAL:** `account_numbers.role` column MUST be migrated/dropped BEFORE updating functions
   - Functions `assign_account_number()` and `assign_account_number_after()` depend on this column
   - Decision needed: Drop column entirely OR migrate to subscription_tier-based logic
   - **Action:** Complete tasks 5.1a, 5.1b, 5.1c BEFORE task 3.2 and 3.3

2. **Function Updates Must Precede Column Drop** (for profiles.role if it existed)
   - ✅ Already handled — profiles.role is confirmed removed
   - But account_numbers.role requires function updates AFTER migration

3. **Execution Order (CRITICAL)**
   - Step 1: Migrate account_numbers.role (tasks 5.1a-5.1c)
   - Step 2: Update all functions (tasks 3.1-3.7)
   - Step 3: Re-run RLS audit (task 6.1)
   - Step 4: Final verification (tasks 6.2-6.5)

4. **Rollback Strategy**
   - Keep backup of `account_numbers` table before migration
   - Document how to restore `role` column if needed
   - Test rollback procedures on staging

---

## 📝 Migration Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `20250301000003_drop_profiles_role.sql` | Drop role column | Exists |
| `20250202000002_audit_rls_role_usage.sql` | RLS audit script | ✅ Applied |
| `20250202000003_replace_profiles_policy.sql` | Profiles policy update | ✅ Applied |
| `TBD_function_updates.sql` | Update role-based functions | Pending |
| `TBD_account_numbers_migration.sql` | Migrate account_numbers table | Pending |

---

## ✅ Definition of Done

Phase C is complete when:
- ✅ `profiles.role` column confirmed removed (or verified it was already removed)
- ✅ Zero role references in RLS policies (audit returns 0 findings)
- ✅ All functions updated to use `subscription_tier` + `is_admin`
- ✅ All tests pass (unit, integration, E2E)
- ✅ Supabase types regenerated
- ✅ Database tagged as `v2.0.2-db`
- ✅ Documentation updated
- ✅ Migration rollback procedures documented

---

## 🔗 Related Documentation

- [Phase C Section Documentation](../2%205-%F0%9F%97%84%EF%B8%8FPhase%20C%20Database%20&%20RLS%20Cleanup%20(Section%205)%2029d608c2eef780b385e3edd6cad6b076.md)
- [Phase B Completion Summary](../2%204-%20%F0%9F%94%90%20Phase%20B%20Access%20&%20Data%20Model%20(Section%204)%2029d608c2eef780fd9a40ca180e4a7a6b.md)
- [Account Numbers Audit](./account_numbers.md) - Complete audit and migration strategy
- [Staging Validation Guide](./STAGING_VALIDATION.md) - Step-by-step validation for account numbers migration
- [Scan Results](./SCAN_RESULTS.md) - Role reference scan results for Tasks 5.2, 5.3, and 6.2
- [Function Verification](./FUNCTION_VERIFICATION.md) - Function dependency verification results
- [Testing Guide](./TESTING_GUIDE.md) - Comprehensive test plans for Tasks 6.4 and 6.5
- [Migration README](../../../supabase/migrations/README.md)
- [Status Tracker](../status.md)

---

**Last Updated:** 2025-02-02  
**Last Audit:** 2025-02-02 (Zero high-severity findings ✅)  
**Next Review:** After Phase C execution begins

