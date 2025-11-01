# Codext Prompt — Intelligent To-Do Generation & Diagnostic Loop with Cursor

**Version:** 1.0.0  
**Date:** 2025-02-02  
**Status:** 🟢 Active

---

## 🎯 Objective

Establish a smart Codext ↔ Cursor workflow where Codext generates actionable to-dos, requests Cursor diagnostics, then adapts automatically based on the results.

---

## 🧩 PART 1 — Codext To-Do Table with Diagnostic Requests

### **UI Unification (Phase A)**

| ID | Title | Description | Priority | Assigned | Status | Diagnostic Request | Next Action |
|----|--------|--------------|-----------|-----------|---------|--------------------|-------------|
| CODX-001 | Complete UnifiedDashboard | Simplify widget rendering, ensure tier-aware widgets work correctly | High | Cursor | Pending | Check render performance, missing imports, widget tier gating logic | Implement `UnifiedDashboardRefactor()` with memoization |
| CODX-002 | Integrate CoPilot Toolbar | Add floating AI assistant toolbar to AppLayout | Medium | Cursor | Pending | Verify global toolbar mounting point, CSS conflicts, tier-aware actions | Create `CoPilotToolbar.tsx` with FeatureGate integration |
| CODX-003 | Optimize TierAwareSidebar | Improve menu filtering performance by subscription tier | High | Cursor | Pending | Scan for redundant tier checks, async fetch delays, memoization gaps | Refactor `tierFilter()` with useMemo optimization |
| CODX-004 | Clean Legacy Portal Routes | Remove outdated `/free/*`, `/engineer/*`, `/enterprise/*` redirects | Medium | Cursor | Pending | Detect all references to legacy portal routes, check redirect chains | Delete legacy route handlers, add redirects to unified routes |
| CODX-005 | Consolidate FeatureGate | Remove duplicate `shared/FeatureGate.tsx` stub, use main version | Low | Cursor | Pending | Verify no imports reference the shared stub version | Delete `components/portal/shared/FeatureGate.tsx` |

### **Access & Data Model (Phase B)**

| ID | Title | Description | Priority | Assigned | Status | Diagnostic Request | Next Action |
|----|--------|--------------|-----------|-----------|---------|--------------------|-------------|
| CODX-006 | Verify Tier Utilities Coverage | Ensure all tier comparison functions are tested and optimized | Medium | Cursor | Pending | Run `tierUtils.spec.ts`, check edge cases, performance benchmarks | Add missing edge case tests if needed |
| CODX-007 | Audit usePortalAccess Hook | Verify hook correctly reads subscription_tier from all auth stores | High | Cursor | Pending | Test hook with different auth store implementations, check fallbacks | Fix any auth store compatibility issues |
| CODX-008 | Consolidate Auth Store Imports | Standardize auth store import paths across apps/web | Medium | Cursor | Pending | Scan for inconsistent import paths, verify stub vs root store usage | Create unified auth store re-export or alias |

### **Database & RLS (Phase C)**

| ID | Title | Description | Priority | Assigned | Status | Diagnostic Request | Next Action |
|----|--------|--------------|-----------|-----------|---------|--------------------|-------------|
| CODX-009 | Fix get_active_subscription Schema Issue | Resolve `subscriptions.plan` vs `subscriptions.plan_id` mismatch | High | Cursor | Pending | Check `has_feature_access()` function, verify subscriptions table schema | Update function to use correct column reference |
| CODX-010 | Verify RLS Policy Coverage | Ensure all user-accessible tables have proper RLS policies | High | Cursor | Pending | Run RLS audit script, check for unprotected tables | Add missing RLS policies or document exceptions |
| CODX-011 | Validate Account Number Functions | Verify tier-based account number generation works for all tiers | Medium | Cursor | Pending | Test `generate_account_number()` with all subscription tiers | Fix any tier mapping issues |

### **Testing & Documentation (Phase D)**

| ID | Title | Description | Priority | Assigned | Status | Diagnostic Request | Next Action |
|----|--------|--------------|-----------|---------|---------|--------------------|-------------|
| CODX-012 | Execute Unit Test Suite | Run all unit tests and fix any failures | High | Cursor | Pending | Run `pnpm test:unit`, identify failing tests, check mock setup | Fix failing tests, update mocks if needed |
| CODX-013 | Execute E2E Test Suite | Run Playwright tests with proper auth setup | High | Cursor | Pending | Check if test users exist, verify dev server config, run `pnpm test:e2e` | Set up test users or mock auth, fix test configuration |
| CODX-014 | Add Stripe Integration Tests | Create tests for webhook → tier sync flow | High | Cursor | Pending | Check Stripe test mode setup, webhook handler implementation | Write Stripe webhook integration tests |
| CODX-015 | Add RLS Policy SQL Tests | Create SQL-based tests for row-level security policies | Medium | Cursor | Pending | Review existing RLS policies, identify test scenarios | Create SQL test scripts for RLS validation |

### **Stripe Integration (Phase 14)**

| ID | Title | Description | Priority | Assigned | Status | Diagnostic Request | Next Action |
|----|--------|--------------|-----------|-----------|---------|--------------------|-------------|
| CODX-016 | Implement Stripe Webhook Handler | Complete stripe-webhook edge function for tier sync | High | Cursor | Pending | Check existing webhook handler, verify event handling, HMAC validation | Implement or fix webhook handler |
| CODX-017 | Create Checkout Session Endpoint | Implement checkout session creation for upgrades | High | Cursor | Pending | Verify Stripe API integration, price ID mapping, error handling | Create or fix checkout session edge function |
| CODX-018 | Add Billing Portal Integration | Connect Stripe billing portal for subscription management | Medium | Cursor | Pending | Check billing portal setup, verify redirect URLs | Implement billing portal redirect |

### **Component Cleanup**

| ID | Title | Description | Priority | Assigned | Status | Diagnostic Request | Next Action |
|----|--------|--------------|-----------|-----------|---------|--------------------|-------------|
| CODX-019 | Remove Duplicate Components | Clean up duplicate FeatureGate, AppLayout if unused | Medium | Cursor | Pending | Verify import usage for all component variants | Delete unused duplicate components |
| CODX-020 | Organize Component Imports | Standardize import paths for portal components | Low | Cursor | Pending | Scan for inconsistent import aliases, missing barrel exports | Create proper barrel exports, fix imports |

### **Theme & Styling**

| ID | Title | Description | Priority | Assigned | Status | Diagnostic Request | Next Action |
|----|--------|--------------|-----------|-----------|---------|--------------------|-------------|
| CODX-021 | Align Theme Tokens | Ensure Tailwind tokens match UI theme across all components | Medium | Cursor | Pending | Check for hard-coded colors, missing CSS variables, dark mode gaps | Update `tailwind.config.ts` and component styles |
| CODX-022 | Verify Responsive Breakpoints | Ensure mobile parity for all portal pages | Medium | Cursor | Pending | Check Tailwind breakpoint usage, mobile viewport testing | Fix responsive layout issues |

---

## ⚙️ PART 2 — Diagnostic Feedback Handling

### **Diagnostic Response Format**

When Cursor returns diagnostics, Codext must parse and categorize:

**✅ Passed Items** → Move to "Execution Ready"  
**⚠️ Warnings** → Generate `/fix` tasks  
**❌ Errors** → Generate `/refactor` tasks

### **Example Diagnostic Loop**

```
🧭 Codext Plan Update — Step CODX-001

Cursor Diagnostic Summary:
Component: UnifiedDashboard.tsx
Issues: 3
- Missing import for `WidgetContainer` component
- Redundant re-renders detected (useMemo missing)
- Tier-aware widget filtering not working correctly

Action Plan:
1. Import `WidgetContainer` from `@/components/portal/shared`
2. Memoize widget rendering with useMemo
3. Fix tier filtering logic in widget visibility checks
4. Rerun unit tests to verify fixes

If ✅ success → move to CODX-002
If ❌ failure → auto-trigger `/fix` cycle
```

---

## 🤖 Codext–Cursor Loop Logic

### **Codext → Cursor (Diagnostic Request)**

```
🧭 Codext To-Do Generation Complete — Diagnostics Requested from Cursor

Run diagnostic on component <name>:
- Check performance metrics
- Validate dependencies and imports
- Detect UI inconsistencies or bugs
- Verify tier-based logic correctness
- Check test coverage gaps

Return summary in compact format:
- Component: <path>
- Issues: <count>
- Priority: <High/Medium/Low>
- Suggested fixes: <list>
```

### **Cursor → Codext (Diagnostic Response)**

```
⚙️ Diagnostic Report:
Component: UnifiedDashboard.tsx
Issues: 2

* Missing import for WidgetContainer (@/components/portal/shared)
* Redundant re-render detected in widget list
✅ Suggested fix: Add useMemo for widget filtering

Component: TierAwareSidebar.tsx
Issues: 0
✅ No issues found - ready for execution
```

### **Codext → Cursor (Follow-up Execution)**

```
🧭 Codext Plan Update — Step CODX-001

Apply diagnostic fixes:
1. Import WidgetContainer
2. Memoize widget rendering
3. Fix tier filtering logic
4. Rerun tests

✅ Confirm test success before proceeding
```

---

## 📋 Current Execution Status

### ✅ Completed Items

- CODX-CLEAN-001: Removed duplicate `tierNavigation.spec.ts` from root tests
- CODX-CLEAN-002: Removed example test file
- CODX-TEST-001: Created Phase D test harness
- CODX-TEST-002: Wrote tier-access unit tests
- CODX-TEST-003: Wrote E2E tier navigation tests

### 🔄 In Progress

- CODX-012: Execute Unit Test Suite (pending execution)
- CODX-013: Execute E2E Test Suite (pending test data setup)

### ⬜ Pending

- All Phase A items (CODX-001 through CODX-005)
- All Phase B items (CODX-006 through CODX-008)
- All Phase C items (CODX-009 through CODX-011)
- All Phase 14 items (CODX-016 through CODX-018)
- Component cleanup (CODX-019 through CODX-020)
- Theme items (CODX-021 through CODX-022)

---

## 🧠 Diagnostic Priority Queue

**High Priority (Run Diagnostics First):**
1. CODX-001: UnifiedDashboard
2. CODX-003: TierAwareSidebar optimization
3. CODX-007: usePortalAccess audit
4. CODX-009: get_active_subscription schema fix
5. CODX-012: Unit test execution
6. CODX-016: Stripe webhook handler

**Medium Priority:**
- CODX-002, CODX-004, CODX-006, CODX-008, CODX-010, CODX-014, CODX-017, CODX-019, CODX-021

**Low Priority:**
- CODX-005, CODX-011, CODX-015, CODX-018, CODX-020, CODX-022

---

## 📝 Next Steps

1. **Run diagnostics** on high-priority items (CODX-001, CODX-003, CODX-007)
2. **Execute test suites** (CODX-012, CODX-013) to establish baseline
3. **Fix critical issues** identified in diagnostics
4. **Proceed with implementation** based on diagnostic feedback

---

**Last Updated:** 2025-02-02  
**Next Diagnostic Run:** High-priority items (CODX-001, CODX-003, CODX-007)

