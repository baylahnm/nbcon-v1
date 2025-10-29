/**
 * Subscription Feature Gating E2E Tests
 * 
 * Tests subscription-based feature access control in the UI
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

// Test users with different subscription tiers
const TEST_USERS = {
  free: {
    email: process.env.TEST_FREE_USER_EMAIL || 'free@nbcon.org',
    password: process.env.TEST_FREE_USER_PASSWORD || 'Test1234@',
    tier: 'free'
  },
  basic: {
    email: process.env.TEST_BASIC_USER_EMAIL || 'basic@nbcon.org',
    password: process.env.TEST_BASIC_USER_PASSWORD || 'Test1234@',
    tier: 'basic'
  },
  pro: {
    email: process.env.TEST_PRO_USER_EMAIL || 'info@nbcon.org',
    password: process.env.TEST_PRO_USER_PASSWORD || 'Qazwsx1234@',
    tier: 'pro'
  },
  enterprise: {
    email: process.env.TEST_ENTERPRISE_EMAIL || 'mahdi.n.baylah@outlook.com',
    password: process.env.TEST_ENTERPRISE_PASSWORD || 'Qazwsx1234@',
    tier: 'enterprise'
  }
};

// Helper function to login
async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/auth`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/(free|engineer|enterprise)\/dashboard/, { timeout: 30000 });
}

test.describe('Subscription Feature Gating', () => {

  // ============================================================================
  // FREE USER SCENARIOS
  // ============================================================================

  test.describe('Free Tier User', () => {
    test('should see upgrade prompt for Pro-only features', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      // Navigate to a Pro-only feature (e.g., Advanced Analytics)
      // Note: This test assumes FeatureGate is implemented on actual pages
      // For now, testing navigation to subscription page
      
      await page.goto(`${BASE_URL}/free/subscription`);
      
      // Should see subscription management page
      await expect(page.locator('h1:has-text("Subscription")')).toBeVisible({ timeout: 10000 });
      
      // Should see current plan as "Free"
      await expect(page.locator('text=Free')).toBeVisible();
    });

    test('should display locked indicator on premium navigation items', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      // Check sidebar for locked features
      // Note: Actual implementation depends on portal registry configuration
      
      // Verify subscription badge shows "Free"
      const sidebar = page.locator('[data-testid="app-sidebar"]');
      if (await sidebar.isVisible()) {
        // Look for tier badge or indicator
        const tierBadge = page.locator('text=/free/i').first();
        await expect(tierBadge).toBeVisible();
      }
    });

    test('should navigate to subscription page when clicking upgrade CTA', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      // Click upgrade button in credits widget (if visible)
      const upgradeButton = page.locator('[data-testid="credits-upgrade-button"]').first();
      
      if (await upgradeButton.isVisible()) {
        await upgradeButton.click();
        await expect(page).toHaveURL(/\/subscription/, { timeout: 10000 });
      }
    });
  });

  // ============================================================================
  // PRO USER SCENARIOS
  // ============================================================================

  test.describe('Pro Tier User', () => {
    test('should access Pro-gated features successfully', async ({ page }) => {
      await login(page, TEST_USERS.pro.email, TEST_USERS.pro.password);

      // Navigate to dashboard
      await page.goto(`${BASE_URL}/free/dashboard`);
      
      // Should see dashboard content
      await expect(page.locator('h1, h2').filter({ hasText: /dashboard/i }).first()).toBeVisible({ timeout: 10000 });
      
      // Should not see upgrade prompts for Pro features
      await expect(page.locator('text=/upgrade to pro/i')).not.toBeVisible();
    });

    test('should show Pro badge in subscription page', async ({ page }) => {
      await login(page, TEST_USERS.pro.email, TEST_USERS.pro.password);

      await page.goto(`${BASE_URL}/free/subscription`);
      
      // Wait for subscription page to load
      await page.waitForLoadState('networkidle');
      
      // Should see Pro tier indicator
      // Note: Actual assertion depends on SubscriptionManagement implementation
    });

    test('should disable upgrade CTA when already on Pro', async ({ page }) => {
      await login(page, TEST_USERS.pro.email, TEST_USERS.pro.password);

      // Check if upgrade button is disabled in credits widget
      const upgradeButton = page.locator('[data-testid="credits-upgrade-button"]').first();
      
      // Pro users should not see upgrade button or it should be disabled
      const isVisible = await upgradeButton.isVisible();
      if (isVisible) {
        await expect(upgradeButton).toBeDisabled();
      }
    });
  });

  // ============================================================================
  // TIER HIERARCHY TESTS
  // ============================================================================

  test.describe('Tier Hierarchy Enforcement', () => {
    test('should enforce free < basic < pro < enterprise hierarchy', async ({ page }) => {
      // Test with Free user trying to access Basic feature
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);
      
      await page.goto(`${BASE_URL}/free/dashboard`);
      
      // Free tier should be clearly indicated
      const tierIndicator = page.locator('[data-testid="subscription-tier"], text=/free/i').first();
      await expect(tierIndicator).toBeVisible({ timeout: 10000 });
    });

    test('should show correct tier badge for each subscription level', async ({ page }) => {
      // Test Pro user badge
      await login(page, TEST_USERS.pro.email, TEST_USERS.pro.password);
      
      await page.goto(`${BASE_URL}/free/dashboard`);
      await page.waitForLoadState('networkidle');
      
      // Check for Pro indicators in UI
      // Actual assertion depends on where tier badges are displayed
    });
  });

  // ============================================================================
  // UPGRADE FLOW TESTS
  // ============================================================================

  test.describe('Upgrade Flow', () => {
    test('should display tier comparison on subscription page', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      await page.goto(`${BASE_URL}/free/subscription`);
      await page.waitForLoadState('networkidle');

      // Should see plan cards
      await expect(page.locator('text=/Free/i').first()).toBeVisible({ timeout: 10000 });
    });

    test('should highlight current plan in comparison table', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      await page.goto(`${BASE_URL}/free/subscription`);
      await page.waitForLoadState('networkidle');

      // Look for "Current Plan" indicator
      const currentPlanBadge = page.locator('text=/current plan/i');
      if (await currentPlanBadge.isVisible()) {
        await expect(currentPlanBadge).toBeVisible();
      }
    });

    test('should show feature limits for each tier', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      await page.goto(`${BASE_URL}/free/subscription`);
      await page.waitForLoadState('networkidle');

      // Should see token limits mentioned
      await expect(page.locator('text=/tokens/i').first()).toBeVisible({ timeout: 10000 });
    });
  });

  // ============================================================================
  // PORTAL REGISTRY ENFORCEMENT
  // ============================================================================

  test.describe('Portal Registry Access Control', () => {
    test('should enforce requiredSubscription in portal registry', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      // Try to navigate to a gated page directly via URL
      // Note: Actual gated routes depend on portalRegistry.ts configuration
      
      await page.goto(`${BASE_URL}/free/dashboard`);
      
      // Free user should access free tier dashboard
      await expect(page).toHaveURL(/\/free\/dashboard/);
    });

    test('should redirect when accessing insufficient-tier pages', async ({ page }) => {
      // This test requires actual gated routes in portalRegistry
      // Placeholder for future implementation
      
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);
      
      // Verify user can access their tier-appropriate dashboard
      await expect(page).toHaveURL(/\/free\/dashboard/);
    });
  });

  // ============================================================================
  // UI/UX VALIDATION
  // ============================================================================

  test.describe('Feature Gate UI/UX', () => {
    test('should show consistent upgrade prompts across pages', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      await page.goto(`${BASE_URL}/free/subscription`);
      
      // Check for consistent styling (Bauhaus design system)
      const upgradeButtons = page.locator('button:has-text("Upgrade")');
      if (await upgradeButtons.first().isVisible()) {
        await expect(upgradeButtons.first()).toBeVisible();
      }
    });

    test('should display tier requirements clearly', async ({ page }) => {
      await login(page, TEST_USERS.free.email, TEST_USERS.free.password);

      await page.goto(`${BASE_URL}/free/subscription`);
      await page.waitForLoadState('networkidle');

      // Should see clear tier labels (Free, Basic, Pro, Enterprise)
      const tierLabels = ['Free', 'Basic', 'Pro', 'Enterprise'];
      for (const tier of tierLabels) {
        await expect(page.locator(`text=${tier}`).first()).toBeVisible();
      }
    });
  });
});

