/**
 * E2E Test Utilities - Authentication Helpers
 * 
 * Phase D: Testing & Documentation
 * Helper functions for authenticating users in Playwright E2E tests
 * 
 * @see docs/nbcon-new-plan/2 6 - 🧪 Phase D Testing & Documentation (Section 6)
 */

import { Page } from '@playwright/test';
import type { SubscriptionTier } from '@/shared/types/subscription';

/**
 * Test user configuration
 * These should match your test database or be set up via test fixtures
 */
export const TEST_USERS = {
  free: {
    email: process.env.TEST_FREE_EMAIL || 'free@test.nbcon.com',
    password: process.env.TEST_FREE_PASSWORD || 'test123456',
    tier: 'free' as SubscriptionTier,
    isAdmin: false,
  },
  basic: {
    email: process.env.TEST_BASIC_EMAIL || 'basic@test.nbcon.com',
    password: process.env.TEST_BASIC_PASSWORD || 'test123456',
    tier: 'basic' as SubscriptionTier,
    isAdmin: false,
  },
  pro: {
    email: process.env.TEST_PRO_EMAIL || 'pro@test.nbcon.com',
    password: process.env.TEST_PRO_PASSWORD || 'test123456',
    tier: 'pro' as SubscriptionTier,
    isAdmin: false,
  },
  enterprise: {
    email: process.env.TEST_ENTERPRISE_EMAIL || 'enterprise@test.nbcon.com',
    password: process.env.TEST_ENTERPRISE_PASSWORD || 'test123456',
    tier: 'enterprise' as SubscriptionTier,
    isAdmin: false,
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@test.nbcon.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'test123456',
    tier: 'free' as SubscriptionTier, // Admins can have any tier
    isAdmin: true,
  },
};

/**
 * Mock user data for testing (when not using real auth)
 */
export function mockUser(
  tier: SubscriptionTier = 'free',
  isAdmin: boolean = false
): typeof TEST_USERS.free {
  return {
    email: `${tier}@test.nbcon.com`,
    password: 'test123456',
    tier,
    isAdmin,
  };
}

/**
 * Login helper - authenticates a user via the login page
 * 
 * @param page - Playwright page object
 * @param user - Test user credentials
 * @param options - Optional login options
 */
export async function login(
  page: Page,
  user: typeof TEST_USERS.free,
  options?: { skipWait?: boolean }
): Promise<void> {
  // Navigate to login page
  await page.goto('/login');

  // Fill in credentials (try multiple selector patterns)
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  const submitButton = page.locator('button:has-text("Sign In"), button:has-text("Login"), button[type="submit"]').first();

  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);

  // Submit login form
  await submitButton.click();

  if (!options?.skipWait) {
    // Wait for successful redirect (adjust selector based on your app)
    await page.waitForURL(/\/dashboard|\/overview|\/portal/, { timeout: 10000 });

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Logout helper - clears the session
 */
export async function logout(page: Page): Promise<void> {
  // Look for logout button (adjust selector based on your app)
  await page.click('button:has-text("Sign Out"), button:has-text("Logout"), [data-testid="logout"]');
  
  // Wait for redirect to login/home
  await page.waitForURL(/\/login|\/auth|\//, { timeout: 5000 });
}

/**
 * Create authenticated context with storage state
 * This can be used to persist auth across tests
 */
export async function createAuthenticatedContext(
  browserContext: any,
  user: typeof TEST_USERS.free
): Promise<any> {
  const page = await browserContext.newPage();
  await login(page, user);
  
  // Save storage state for reuse
  await browserContext.storageState({ path: `tests/e2e/.auth/${user.tier}.json` });
  await page.close();
  
  return browserContext;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for authenticated user indicators
  const hasUserMenu = await page.locator('[data-testid="user-menu"], [aria-label*="user"]').count() > 0;
  const hasLogoutButton = await page.locator('button:has-text("Sign Out"), button:has-text("Logout")').count() > 0;
  
  return hasUserMenu || hasLogoutButton;
}

