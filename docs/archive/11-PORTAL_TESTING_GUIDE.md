# 🧪 Portal E2E Testing Guide

**Date:** January 27, 2025  
**Status:** ✅ Tests Gated Behind Feature Flag  
**Ready:** After first page migration

---

## 🚧 Current Status: Tests Disabled

**Portal navigation E2E tests are currently DISABLED by default** until at least one page is migrated to the unified portal system.

### Why Tests Are Disabled

The 25 portal navigation tests check for:
- ✅ `PortalLayout` wrapper
- ✅ Dynamic breadcrumb trails
- ✅ Portal sidebar navigation
- ✅ Portal context availability

**Problem:** Pages still use legacy layouts (ClientLayout, EngineerLayout, EnterpriseLayout), so these assertions would fail.

**Solution:** Tests gated behind `ENABLE_PORTAL_TESTS` feature flag.

---

## 📋 Current Test Status

```
┌─────────────────────────────────────────────────┐
│          E2E TEST SUITE STATUS                   │
├─────────────────────────────────────────────────┤
│ Portal Navigation Tests:    25 ⏸️  DISABLED     │
│ Orchestrator Workflow Tests: 12 ⏸️  SKIPPED     │
│ Agent Workflow Tests:        9  ⏸️  SKIPPED     │
│                                                  │
│ Reason: Legacy UI still active                  │
│ Solution: Migrate first page to PortalLayout    │
│                                                  │
│ To Enable: Set ENABLE_PORTAL_TESTS=true         │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## ✅ When to Enable Tests

### Step 1: Migrate First Page (Recommended: HelpPage)

**Why HelpPage:**
- Low risk (minimal business logic)
- Low traffic
- Simple content
- Easy rollback

**Migration Process:**
```typescript
// src/pages/4-free/11-HelpPage.tsx

// Before (Old Layout)
import ClientLayout from '@/pages/2-auth/others/layouts/ClientLayout';

export default function HelpPage() {
  return (
    <ClientLayout>
      <div className="p-6">
        {/* Content */}
      </div>
    </ClientLayout>
  );
}

// After (Unified Portal)
import { PortalLayout } from '@/components/portal';
import { PageHeader } from '@/components/portal/shared';
import { HelpCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <PortalLayout>
      <div className="space-y-4">
        <PageHeader
          icon={HelpCircle}
          title="Help & Support"
          subtitle="Find answers and resources"
        />
        {/* Rest of content */}
      </div>
    </PortalLayout>
  );
}
```

### Step 2: Test Migrated Page Manually

```bash
# 1. Start dev server
pnpm dev

# 2. Open in browser
http://localhost:8080/free/help

# 3. Verify:
# ✓ Page loads without errors
# ✓ Sidebar appears
# ✓ Breadcrumb shows: Home > Help
# ✓ Theme switching works
# ✓ Mobile drawer works
```

### Step 3: Enable Portal Tests

```bash
# PowerShell
$env:ENABLE_PORTAL_TESTS="true"
pnpm test:e2e tests/e2e/portalNavigation.spec.ts

# Bash/Linux
export ENABLE_PORTAL_TESTS=true
pnpm test:e2e tests/e2e/portalNavigation.spec.ts
```

---

## 🚀 Running Tests (When Ready)

### Prerequisites

**1. Dev Server Running** ⚠️ **REQUIRED**
```bash
# Terminal 1: Keep this running
pnpm dev

# Output should show:
# ➜  Local:   http://localhost:8080/
```

**2. Test Users Exist** ⚠️ **REQUIRED**
- **Client:** `mahdi.n.baylah@outlook.com` / `1234@`
- **Engineer:** `info@nbcon.org` / `1234@`
- **Enterprise:** `enterprise@nbcon.org` / `1234@`

**3. Feature Flag Enabled**
```bash
$env:ENABLE_PORTAL_TESTS="true"
```

### Run Commands

```bash
# All portal tests (Terminal 2, separate from dev server)
pnpm test:e2e tests/e2e/portalNavigation.spec.ts

# Single test for debugging
pnpm test:e2e tests/e2e/portalNavigation.spec.ts -g "should display portal context"

# With UI mode (see browser actions)
pnpm test:e2e tests/e2e/portalNavigation.spec.ts --ui

# With headed mode (visible browser)
pnpm test:e2e tests/e2e/portalNavigation.spec.ts --headed
```

---

## 🔧 Creating Test Users

If test users don't exist in your Supabase database:

### Option 1: Via UI (Recommended)

```bash
# 1. Start dev server
pnpm dev

# 2. Open auth page
http://localhost:8080/auth

# 3. Sign up three users:
Email: mahdi.n.baylah@outlook.com | Password: 1234@ | Role: Client
Email: info@nbcon.org              | Password: 1234@ | Role: Engineer
Email: enterprise@nbcon.org        | Password: 1234@ | Role: Enterprise

# 4. Verify in Supabase Dashboard
Authentication → Users → Check all three exist
```

### Option 2: Via Supabase Dashboard

```
1. Open Supabase Dashboard
2. Go to Authentication → Users → Add User
3. Create three users with credentials from above
4. Manually set role in profiles table
```

### Option 3: Via SQL (Advanced)

```sql
-- In Supabase SQL Editor
-- Note: This is for development only

-- Create test users (simplified - adjust for your auth setup)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES 
  ('mahdi.n.baylah@outlook.com', crypt('1234@', gen_salt('bf')), NOW()),
  ('info@nbcon.org', crypt('1234@', gen_salt('bf')), NOW()),
  ('enterprise@nbcon.org', crypt('1234@', gen_salt('bf')), NOW());

-- Then create profiles for each with appropriate roles
-- (Your actual signup flow will do this automatically)
```

---

## 📊 Expected Test Results (When Enabled)

### Success State

```
Unified Portal Navigation
  Client Portal Navigation
    ✅ should display portal context correctly (125ms)
    ✅ should navigate through client portal pages (842ms)
    ✅ should display breadcrumb trail correctly (156ms)
    ✅ should highlight active page in sidebar (203ms)
    ✅ should show AI Tools Planning page with gold-standard design (198ms)
  
  Engineer Portal Navigation
    ✅ should navigate through engineer portal pages (673ms)
    ✅ should handle nested learning course routes (287ms)
    ✅ should display engineer-specific features (234ms)
  
  Enterprise Portal Navigation
    ✅ should handle enterprise portal pages (156ms)
  
  Portal Permission Enforcement
    ✅ should redirect unauthenticated users to auth (98ms)
    ✅ should redirect to correct portal based on role (456ms)
    ✅ should block cross-portal access (389ms)
  
  Portal UI Coherence
    ✅ should use consistent design system across pages (567ms)
    ✅ should maintain theme consistency (234ms)
    ✅ should use gradient icons for page headers (123ms)
  
  ... (25 total tests)

PASSED: 25/25 ✅
```

### Disabled State (Current)

```
Unified Portal Navigation
  ⏸️  All tests skipped (ENABLE_PORTAL_TESTS=false)
  
Reason: Pages not migrated to PortalLayout yet
Action: Migrate first page, then enable tests
```

---

## 🎯 Migration Roadmap

### Phase 1: First Page Migration (This Week)

**Recommended:** HelpPage (`/free/help`)

**Steps:**
1. Wrap with `PortalLayout`
2. Replace header with `PageHeader`
3. Test manually in browser
4. Enable portal tests
5. Run E2E suite
6. Fix any issues
7. Deploy

**Time:** 1-2 hours

### Phase 2: Low-Risk Pages (Week 2-3)

**Pages to migrate:**
- SettingsPage (`/free/settings`)
- ProfilePage (`/free/profile`)  
- NetworkPage (`/free/network`)

**After each:**
- Run E2E tests
- Verify in production
- Gather feedback

### Phase 3: Medium-Risk Pages (Week 4-6)

**Pages to migrate:**
- BrowseEngineersPage
- MyProjectsPage
- CalendarPage
- MessagesPage
- LearningPage

### Phase 4: Critical Pages (Week 7-8)

**Pages to migrate last:**
- DashboardPage (high traffic)
- PostJobPage (revenue-critical)
- FinancePage (business-critical)

---

## 🔍 Troubleshooting

### Tests Skip Immediately

**Cause:** Feature flag is disabled (by design)  
**Expected:** Tests show "ENABLE_PORTAL_TESTS=false" in output  
**Action:** This is correct until page migration

### Tests Fail at Login (When Enabled)

**Cause:** Test users don't exist  
**Fix:** Create users using steps above

### Tests Timeout Looking for Elements (When Enabled)

**Cause:** Portal elements don't exist yet (pages not migrated)  
**Expected:** This is why tests are disabled by default  
**Action:** Migrate first page before enabling

### Dev Server Won't Start

**Cause:** Port 8080 already in use  
**Fix:**
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process or change port in vite.config.ts
```

---

## 📋 Pre-Test Checklist

Before enabling portal tests:

- [ ] **At least 1 page migrated** to PortalLayout (e.g., HelpPage)
- [ ] **Migrated page tested** manually in browser
- [ ] **Breadcrumb appears** on migrated page
- [ ] **Sidebar navigation** works
- [ ] **Dev server running** on port 8080
- [ ] **Test users exist** in Supabase
- [ ] **Test users can login** manually

---

## 🎉 When Tests Pass

After first page migration and tests passing:

```
✅ Foundation validated in production
✅ Portal system working correctly
✅ Ready to migrate more pages
✅ Can track progress with E2E suite
```

**Next Steps:**
1. Migrate 2-3 more pages
2. Re-run tests after each
3. Build confidence in system
4. Accelerate migration pace

---

## 📖 Related Documentation

- **Migration Guide:** `docs/9-UNIFIED_PORTAL_MIGRATION.md`
- **Test Setup:** `tests/e2e/TEST_SETUP.md`
- **Foundation Summary:** `PORTAL_FOUNDATION_COMPLETE.md`

---

**Created:** January 27, 2025  
**Purpose:** Guide portal test enablement after page migration  
**Status:** Tests ready, waiting for migration

