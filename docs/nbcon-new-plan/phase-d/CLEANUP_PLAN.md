# Phase D Cleanup Plan

**Date:** 2025-02-02  
**Status:** 🔄 Review Required

---

## 📋 Files Already Deleted ✅

1. ✅ `tests/e2e/tierNavigation.spec.ts`
   - **Reason:** Duplicate of `apps/web/src/tests/e2e/tier-navigation.spec.ts`
   - **Status:** Old role-based version, replaced with tier-based version

2. ✅ `apps/web/src/tests/example.test.ts`
   - **Reason:** Example/placeholder test file
   - **Status:** Replaced with actual test suites

---

## 🔍 Files to Review (NOT DELETING YET)

### 1. Component Duplicates Analysis

**Location:** `apps/web/src/components/portal/`

#### FeatureGate Components:
- `FeatureGate.tsx` (full version, 270+ lines) ✅ **USED** in `AppRouter.tsx`
- `shared/FeatureGate.tsx` (simple version, 11 lines) ⚠️ **May be unused**

**Decision:** Need to check if `shared/FeatureGate.tsx` is imported anywhere

#### AppLayout Components:
- `AppLayout.tsx` (full version, 218+ lines) ✅ **USED** in `AppRouter.tsx`
- `shared/AppLayout.tsx` (simple version, 11 lines) ✅ **USED** in `App.tsx`

**Decision:** Both are used - may need to consolidate or document why both exist

#### TierAwareSidebar Components:
- `TierAwareSidebar.tsx` ✅ Main component
- `shared/TierAwareAppSidebar.tsx` ✅ Used by `shared/AppLayout.tsx`

**Decision:** Both used - different names, both needed

---

### 2. Temporary Files (Gitignored, Safe)

- `apps/web/node_modules/.vite/vitest/results.json`
  - **Type:** Vitest cache file
  - **Location:** node_modules (gitignored)
  - **Action:** No action needed (gitignored)

---

### 3. Auth Store Stub

- `apps/web/src/pages/2-auth/others/stores/auth.ts`
  - **Status:** ✅ **ACTIVELY USED** by:
    - `usePortalAccess.ts`
    - `AppRouter.tsx`
    - Potentially others
  - **Decision:** **DO NOT DELETE** - Required for functionality

---

## ✅ Cleanup Summary

### Already Completed:
1. ✅ Removed duplicate `tierNavigation.spec.ts` from root
2. ✅ Removed example test file
3. ✅ Updated test README with proper structure

### Pending Review:
1. ⚠️ Check if `shared/FeatureGate.tsx` is unused (can be deleted if not imported)
2. ⚠️ Document why both AppLayout versions exist (or consolidate if possible)
3. ✅ Auth store stub is needed - keep it

### Safe to Ignore:
- Vitest cache files in `node_modules/` (gitignored)

---

## 📝 Recommendations

1. **Before deleting anything else:**
   - Verify all imports for `shared/FeatureGate.tsx`
   - Understand why `shared/AppLayout.tsx` and `AppLayout.tsx` both exist
   - Document the component structure if both are needed

2. **Test organization:**
   - ✅ Unit tests co-located with source files
   - ✅ E2E tests in `apps/web/src/tests/e2e/`
   - ✅ Test utilities organized in `utils/` subdirectory

3. **Documentation:**
   - ✅ Test README created
   - ✅ Coverage documentation complete
   - ⬜ Consider adding component architecture doc explaining duplicate components

---

**Next Steps:**
1. Run grep to check if `shared/FeatureGate.tsx` is imported
2. If unused → delete it
3. Document component structure for future reference

