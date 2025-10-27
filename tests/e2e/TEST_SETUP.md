# E2E Test Setup Guide

## 🚧 Portal Tests Currently Disabled

**Status:** Portal navigation tests are **gated behind a feature flag** until pages are migrated to `PortalLayout`.

**Why:** Tests check for new portal UI elements (breadcrumbs, sidebar, PortalLayout) but pages still use legacy layouts. This would cause false failures.

**When to Enable:** After migrating first page (e.g., HelpPage) to unified portal system.

**How to Enable:**
```bash
# Set environment variable
export ENABLE_PORTAL_TESTS=true

# Or in PowerShell
$env:ENABLE_PORTAL_TESTS="true"

# Then run tests
pnpm test:e2e tests/e2e/portalNavigation.spec.ts
```

---

## 🔴 If All Tests Are Failing (When Enabled)

If you see **all tests failing** with very fast execution times (<30ms), follow these steps:

---

## ✅ Quick Fix Checklist

### 1. **Start Development Server** ⚠️ **REQUIRED**

```bash
# Terminal 1: Start dev server
pnpm dev

# Note the actual URL from output, e.g.:
# ➜  Local:   http://localhost:5173/
```

The tests **require a running server**. They will fail immediately if the server isn't running.

---

### 2. **Verify Server Port**

Check the URL from `pnpm dev` output and update the test configuration:

**Option A: Use Environment Variable (Recommended)**
```bash
# Run tests with custom URL
BASE_URL=http://localhost:5173 pnpm test:e2e tests/e2e/portalNavigation.spec.ts
```

**Option B: Update Test File**
```typescript
// tests/e2e/portalNavigation.spec.ts (Line 18)
const BASE_URL = 'http://localhost:5173'; // Match your dev server port
```

---

### 3. **Verify Test Users Exist**

The tests use these credentials:

```typescript
Client:     mahdi.n.baylah@outlook.com / 1234@
Engineer:   info@nbcon.org / 1234@
Enterprise: enterprise@nbcon.org / 1234@
```

**Check if users exist in Supabase:**

1. Open Supabase dashboard
2. Go to Authentication → Users
3. Verify these emails exist

**If users don't exist:**

**Option A: Create Test Users**
```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES 
  ('mahdi.n.baylah@outlook.com', crypt('1234@', gen_salt('bf')), NOW()),
  ('info@nbcon.org', crypt('1234@', gen_salt('bf')), NOW()),
  ('enterprise@nbcon.org', crypt('1234@', gen_salt('bf')), NOW());
```

**Option B: Use Existing Users**
```bash
# Set environment variables
export TEST_CLIENT_EMAIL="your-client@example.com"
export TEST_CLIENT_PASSWORD="your-password"
export TEST_ENGINEER_EMAIL="your-engineer@example.com"
export TEST_ENGINEER_PASSWORD="your-password"

# Run tests
pnpm test:e2e tests/e2e/portalNavigation.spec.ts
```

---

## 🧪 Test Execution Commands

### Run All Portal Tests
```bash
# Make sure dev server is running first!
pnpm dev

# In another terminal:
pnpm test:e2e tests/e2e/portalNavigation.spec.ts
```

### Run Single Test (Debugging)
```bash
# Run one test to see detailed errors
pnpm test:e2e tests/e2e/portalNavigation.spec.ts -g "should redirect unauthenticated"
```

### Run with UI Mode (Visual Debugging)
```bash
# See browser actions in real-time
pnpm test:e2e tests/e2e/portalNavigation.spec.ts --ui
```

### Run with Custom Configuration
```bash
# Override defaults via environment variables
BASE_URL=http://localhost:8080 \
TEST_CLIENT_EMAIL=test@example.com \
TEST_CLIENT_PASSWORD=password123 \
pnpm test:e2e tests/e2e/portalNavigation.spec.ts
```

---

## 🔍 Troubleshooting Specific Issues

### Issue 1: "page.goto: net::ERR_CONNECTION_REFUSED"

**Cause:** Dev server not running  
**Fix:**
```bash
# Start server in separate terminal
pnpm dev
```

### Issue 2: "Timeout 30000ms exceeded waiting for selector"

**Cause:** Login form elements not found  
**Fix:** Check if auth page uses these selectors:
```typescript
input[type="email"]
input[type="password"]
button:has-text("Sign In")
```

If your form is different, update test selectors.

### Issue 3: "Navigation failed because page was closed"

**Cause:** Authentication failed, user doesn't exist  
**Fix:** Verify test user credentials are correct and users exist in database.

### Issue 4: All tests pass locally but fail in CI

**Cause:** Environment differences  
**Fix:** Set BASE_URL and test credentials in CI environment variables.

---

## 📊 Expected Test Results

When properly configured, you should see:

```
Unified Portal Navigation
  Client Portal Navigation
    ✅ should display portal context correctly
    ✅ should navigate through client portal pages
    ✅ should display breadcrumb trail correctly
    ✅ should highlight active page in sidebar
    ✅ should show AI Tools Planning page with gold-standard design
  
  Engineer Portal Navigation
    ✅ should navigate through engineer portal pages
    ✅ should handle nested learning course routes
    ✅ should display engineer-specific features
  
  ... (25 total portal navigation tests)
```

---

## 🎯 Quick Start (Copy-Paste)

```bash
# 1. Start dev server (Terminal 1)
pnpm dev
# Wait for "Local: http://localhost:5173" message

# 2. Run tests (Terminal 2)
BASE_URL=http://localhost:5173 pnpm test:e2e tests/e2e/portalNavigation.spec.ts

# 3. If tests still fail, run with UI to debug
BASE_URL=http://localhost:5173 pnpm test:e2e tests/e2e/portalNavigation.spec.ts --ui
```

---

## 📞 Need Help?

1. **Check dev server is running:** `curl http://localhost:5173`
2. **Check auth page loads:** `curl http://localhost:5173/auth`
3. **Verify test users exist:** Check Supabase dashboard
4. **Run with UI mode:** See exactly what's failing visually
5. **Check console output:** Look for error messages

---

## ✅ Success Criteria

Tests are passing when you see:

```
All: 25
Passed: 25 ✅
Failed: 0
Flaky: 0
Skipped: 0
```

---

**Last Updated:** January 27, 2025  
**Test Suite:** Portal Navigation E2E Tests  
**Framework:** Playwright

