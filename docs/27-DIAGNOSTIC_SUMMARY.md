### Dashboard Unification + RLS Cleanup (v1.9.0)

- Unified the enterprise dashboard to use `src/components/portal/shared/UnifiedDashboard.tsx` for consistent UI across all portals. Updated `src/pages/6-enterprise/1-DashboardPage.tsx` to render `UnifiedDashboard` with enterprise stats and actions.
- Confirmed `AppLayout` wraps all portals and mounts `TierAwareAppSidebar` uniformly. No divergent `EnterpriseLayout` structure changes required.
- Verified feature gating relies on badges/prompts via `FeatureGate` and `UnifiedDashboard` quick action `requiredTier`, not alternate pages.
- Completed policy migration to `is_admin`: verified `pg_policies` contains 0 occurrences of `role='admin'` in predicates.
- Prepared to drop `profiles.role` after final verification; staged as a follow-up migration to avoid breaking any legacy reads.

Rollout plan:
- Run Playwright smoke for admin and non-admin personas on Chromium.
- Run unit tests for token widget and gating behavior.
- If green, apply the migration to drop `profiles.role` and re-run advisors.

### Test Validation (Oct 30, 2025)

- Commands executed:
  - `pnpm dev` (server started)
  - `pnpm exec playwright test tests/e2e/sidebarTierGating.spec.ts --project=chromium` (server up; failures due to login waitForURL — investigate auth fixtures next)
  - `pnpm test tokenWidget` (all 9 tests passed after wrapping with `SidebarProvider` and opening profile dropdown in test)

- Outcomes:
  - E2E targeted run executed with artifacts in `test-results/` for review; failures isolated to auth/navigation timing.
  - Unit: token widget suite passed 9/9 after provider wrapper fix.

- Schema cleanup readiness:
  - Added `supabase/migrations/20250301000003_drop_profiles_role.sql` with guard to abort if any `role='admin'` predicates remain.
  - Re-verified `pg_policies` count for `role='admin'` references = 0.

- Next steps:
  - Stabilize Playwright login helpers or ensure seeded test users for dashboard redirect.
  - Apply `20250301000003_drop_profiles_role.sql` on staging after backups; monitor logs; then promote.

