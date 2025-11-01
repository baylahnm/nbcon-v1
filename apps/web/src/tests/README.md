# Testing Infrastructure - apps/web

**Phase D: Testing & Documentation**

This directory contains the unified test harness for the `apps/web` project.

---

## 📁 Directory Structure

```
apps/web/src/tests/
├── e2e/                    # End-to-end tests (Playwright)
│   ├── tier-navigation.spec.ts
│   └── utils/
│       └── auth.ts         # Auth helper utilities
├── setup/
│   └── vitest.setup.ts     # Global test setup (mocks, cleanup)
└── README.md               # This file
```

**Note:** Unit tests are co-located with their source files:
- `src/shared/utils/tierUtils.spec.ts`
- `src/hooks/usePortalAccess.spec.ts`
- `src/components/portal/FeatureGate.spec.tsx`
- `src/components/portal/TierAwareSidebar.spec.tsx`

---

## 🧪 Running Tests

### Unit Tests

```bash
# From apps/web directory
pnpm test:unit

# Run specific test file
pnpm test:unit tierUtils

# Watch mode
pnpm test:unit:watch

# Coverage report
pnpm test:unit:coverage
```

### E2E Tests

```bash
# Start dev server first (Terminal 1)
pnpm dev

# Run E2E tests (Terminal 2)
pnpm test:e2e

# Run specific test
pnpm test:e2e tier-navigation

# Run with UI mode
pnpm test:e2e:ui
```

---

## 🔧 Test Configuration

### Vitest

- **Config:** `apps/web/vitest.config.ts`
- **Environment:** jsdom (for React components)
- **Setup File:** `src/tests/setup/vitest.setup.ts`

### Playwright

- **Config:** `apps/web/playwright.config.ts`
- **Base URL:** `http://localhost:5173` (or from env)
- **Browsers:** Chromium, Firefox, WebKit, Mobile

---

## 📝 Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { tierMeetsRequirement } from '@/shared/utils/tierUtils';

describe('tierMeetsRequirement', () => {
  it('should return true when user tier meets requirement', () => {
    expect(tierMeetsRequirement('pro', 'basic')).toBe(true);
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from './utils/auth';

test('free user should see upgrade prompts', async ({ page }) => {
  await login(page, TEST_USERS.free);
  await page.goto('/ai-tools');
  await expect(page.getByText(/Upgrade/i)).toBeVisible();
});
```

---

## 🎯 Test Utilities

### Mock Helpers (`setup/vitest.setup.ts`)

- `createMockAuthState(tier, isAdmin)` - Create mock auth state
- `createMockUsePortalAccess(tier, isAdmin)` - Create mock hook

### Auth Utilities (`e2e/utils/auth.ts`)

- `login(page, user)` - Login helper
- `logout(page)` - Logout helper
- `TEST_USERS` - Pre-configured test users
- `mockUser(tier, isAdmin)` - Create mock user

---

## 🚧 Test Data Requirements

E2E tests require test users in Supabase. See `docs/nbcon-new-plan/phase-d/TEST_COVERAGE.md` for setup instructions.

---

## 📚 Related Documentation

- [Phase D Coverage Report](../../../../docs/nbcon-new-plan/phase-d/TEST_COVERAGE.md)
- [Phase D README](../../../../docs/nbcon-new-plan/phase-d/README.md)
- [Phase D Plan](../../../../docs/nbcon-new-plan/2%206%20-%20%F0%9F%A7%AA%20Phase%20D%20Testing%20&%20Documentation%20(Section%206%2029d608c2eef780458037ddd75a214776.md)

---

**Last Updated:** 2025-02-02
