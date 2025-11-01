/**
 * Tier-Based Navigation - E2E Tests
 * 
 * Phase D: Testing & Documentation
 * End-to-end tests for tier-based navigation and feature gating
 * 
 * @see docs/nbcon-new-plan/2 6 - 🧪 Phase D Testing & Documentation (Section 6)
 */

import { test, expect, Page } from '@playwright/test';
import { login, mockUser, TEST_USERS } from './utils/auth';

/**
 * Helper to check if a menu item is visible and clickable
 */
async function expectMenuItemVisibility(page: Page, label: string, shouldBeVisible: boolean) {
  const item = page.locator(`button:has-text("${label}"), a:has-text("${label}")`);
  if (shouldBeVisible) {
    await expect(item.first()).toBeVisible();
    await expect(item.first()).not.toHaveClass(/opacity-60|disabled|cursor-not-allowed/);
  } else {
    await expect(item.first()).not.toBeVisible();
  }
}

/**
 * Helper to check if a menu item is visible but locked
 */
async function expectLockedMenuItem(page: Page, label: string) {
  const item = page.locator(`button:has-text("${label}"), a:has-text("${label}")`);
  await expect(item.first()).toBeVisible();
  await expect(item.first()).toHaveClass(/opacity-60|disabled|cursor-not-allowed/);
  // Check for lock icon (adjust selector based on your icon implementation)
  const lockIcon = item.first().locator('svg[data-lucide="lock"], [aria-label*="lock"]');
  const hasLockIcon = await lockIcon.count() > 0;
  if (!hasLockIcon) {
    // Lock might be indicated by disabled state only
    console.warn(`Lock icon not found for "${label}", but item is disabled`);
  }
}

test.describe('Tier-Based Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe('Free Tier User', () => {
    test('should see only free-tier menu items', async ({ page }) => {
      await login(page, TEST_USERS.free);

      // Verify free-tier items are visible
      await expectMenuItemVisibility(page, 'Overview', true);
      await expectMenuItemVisibility(page, 'Dashboard', true);
      await expectMenuItemVisibility(page, 'Calendar', true);
      await expectMenuItemVisibility(page, 'Projects', true);

      // Verify pro-tier items are NOT accessible
      await expectMenuItemVisibility(page, 'AI Tools', false);
      await expectMenuItemVisibility(page, 'Finance', false);

      // Verify enterprise items are NOT accessible
      await expectMenuItemVisibility(page, 'Workforce Management', false);
    });

    test('should see upgrade prompts for locked features', async ({ page }) => {
      await login(page, TEST_USERS.free);

      // Try to access a pro-tier feature
      await page.goto('/ai-tools');
      
      // Should see upgrade prompt
      await expect(page.getByText(/Feature Locked/i)).toBeVisible();
      await expect(page.getByText(/Upgrade to Pro/i)).toBeVisible();
    });

    test('should show tier badge in sidebar', async ({ page }) => {
      await login(page, TEST_USERS.free);

      // Check for tier indicator in sidebar
      await expect(page.getByText(/Plan:.*free/i)).toBeVisible();
    });
  });

  test.describe('Basic Tier User', () => {
    test('should see basic-tier menu items', async ({ page }) => {
      await login(page, TEST_USERS.basic);

      // Verify basic-tier items
      await expectMenuItemVisibility(page, 'Overview', true);
      await expectMenuItemVisibility(page, 'Browse Engineers', true);
      await expectMenuItemVisibility(page, 'Post New Job', true);

      // Verify pro-tier items are still locked
      await expectMenuItemVisibility(page, 'AI Tools', false);
      await expectMenuItemVisibility(page, 'Finance', false);
    });

    test('should have access to basic features but not pro', async ({ page }) => {
      await login(page, TEST_USERS.basic);

      // Basic features should work
      await page.goto('/overview');
      await expect(page).toHaveURL(/\/overview/);

      // Pro features should be locked
      await page.goto('/ai-tools');
      await expect(page.getByText(/Upgrade/i)).toBeVisible();
    });
  });

  test.describe('Pro Tier User', () => {
    test('should see all pro-tier menu items', async ({ page }) => {
      await login(page, TEST_USERS.pro);

      // Verify pro-tier items
      await expectMenuItemVisibility(page, 'AI Tools', true);
      await expectMenuItemVisibility(page, 'Finance', true);
      await expectMenuItemVisibility(page, 'Timesheets', true);

      // Enterprise items should still be locked
      await expectMenuItemVisibility(page, 'Workforce Management', false);
    });

    test('should have access to AI Tools', async ({ page }) => {
      await login(page, TEST_USERS.pro);

      await page.goto('/ai-tools');
      await expect(page).toHaveURL(/\/ai-tools/);
      await expect(page.getByText(/AI Tools|AI Assistant/i)).toBeVisible();
    });

    test('should have access to Finance features', async ({ page }) => {
      await login(page, TEST_USERS.pro);

      await page.goto('/finance');
      await expect(page).toHaveURL(/\/finance/);
      // Verify finance content is visible (not locked)
      await expect(page.getByText(/Feature Locked/i)).not.toBeVisible();
    });
  });

  test.describe('Enterprise Tier User', () => {
    test('should see all menu items including enterprise', async ({ page }) => {
      await login(page, TEST_USERS.enterprise);

      // Verify all tiers are accessible
      await expectMenuItemVisibility(page, 'Overview', true);
      await expectMenuItemVisibility(page, 'AI Tools', true);
      await expectMenuItemVisibility(page, 'Workforce Management', true);
      await expectMenuItemVisibility(page, 'Teams Management', true);
      await expectMenuItemVisibility(page, 'Business Intelligence', true);
    });

    test('should have access to enterprise features', async ({ page }) => {
      await login(page, TEST_USERS.enterprise);

      await page.goto('/enterprise/workforce');
      await expect(page).toHaveURL(/\/enterprise\/workforce/);
      await expect(page.getByText(/Feature Locked/i)).not.toBeVisible();
    });
  });

  test.describe('Admin User', () => {
    test('should see all menu items regardless of tier', async ({ page }) => {
      await login(page, TEST_USERS.admin);

      // Admins should see everything
      await expectMenuItemVisibility(page, 'Overview', true);
      await expectMenuItemVisibility(page, 'AI Tools', true);
      await expectMenuItemVisibility(page, 'Workforce Management', true);
    });

    test('should have admin badge displayed', async ({ page }) => {
      await login(page, TEST_USERS.admin);

      await expect(page.getByText(/Admin/i)).toBeVisible();
    });

    test('should bypass all feature gates', async ({ page }) => {
      await login(page, TEST_USERS.admin);

      // Admin should access any feature
      await page.goto('/ai-tools');
      await expect(page.getByText(/Feature Locked/i)).not.toBeVisible();

      await page.goto('/enterprise/workforce');
      await expect(page.getByText(/Feature Locked/i)).not.toBeVisible();
    });
  });

  test.describe('Navigation Flow', () => {
    test('free user navigating through accessible routes', async ({ page }) => {
      await login(page, TEST_USERS.free);

      // Navigate through free-tier routes
      await page.click('text=Overview');
      await expect(page).toHaveURL(/\/overview/);

      await page.click('text=Dashboard');
      await expect(page).toHaveURL(/\/dashboard/);

      await page.click('text=Projects');
      await expect(page).toHaveURL(/\/projects/);
    });

    test('pro user accessing tier-restricted routes', async ({ page }) => {
      await login(page, TEST_USERS.pro);

      // Access pro-tier routes
      await page.click('text=AI Tools');
      await expect(page).toHaveURL(/\/ai-tools/);

      await page.click('text=Finance');
      await expect(page).toHaveURL(/\/finance/);
    });

    test('attempting direct URL access to locked feature', async ({ page }) => {
      await login(page, TEST_USERS.free);

      // Try to access pro-tier feature directly
      await page.goto('/ai-tools');
      
      // Should show upgrade prompt
      await expect(page.getByText(/Upgrade/i)).toBeVisible();
      
      // Should not see actual feature content
      await expect(page.getByText(/AI Assistant|AI Tools Hub/i)).not.toBeVisible();
    });
  });

  test.describe('Upgrade Flow', () => {
    test('should show upgrade button in locked feature', async ({ page }) => {
      await login(page, TEST_USERS.free);

      await page.goto('/ai-tools');
      
      // Verify upgrade button exists
      const upgradeButton = page.getByRole('button', { name: /Upgrade to/i });
      await expect(upgradeButton).toBeVisible();

      // Click upgrade button (should open modal or redirect)
      await upgradeButton.click();
      
      // Verify upgrade flow initiated (modal opens or redirects to checkout)
      // This depends on your upgrade implementation
      await page.waitForTimeout(1000); // Wait for modal/redirect
    });

    test('should display tier comparison in upgrade card', async ({ page }) => {
      await login(page, TEST_USERS.basic);

      await page.goto('/ai-tools');
      
      // Should show current tier (basic) and required tier (pro)
      await expect(page.getByText(/Current Plan/i)).toBeVisible();
      await expect(page.getByText(/Required Plan/i)).toBeVisible();
      await expect(page.getByText(/basic/i)).toBeVisible();
      await expect(page.getByText(/pro/i)).toBeVisible();
    });
  });

  test.describe('Sidebar Behavior', () => {
    test('sidebar should filter menu items by tier', async ({ page }) => {
      await login(page, TEST_USERS.free);

      const sidebar = page.locator('[data-testid="sidebar"]');
      await expect(sidebar).toBeVisible();

      // Count visible menu items (should match free-tier items)
      const menuItems = sidebar.locator('a[href*="/"]');
      const count = await menuItems.count();
      expect(count).toBeGreaterThan(0);

      // Verify locked items are not in navigation (or marked as locked)
      const aiToolsLink = sidebar.locator('a[href="/ai-tools"]');
      const exists = await aiToolsLink.count();
      // Either item doesn't exist or is disabled/locked
      if (exists > 0) {
        await expect(aiToolsLink).toHaveAttribute('aria-disabled', 'true');
      }
    });

    test('sidebar should show tier indicator', async ({ page }) => {
      await login(page, TEST_USERS.pro);

      await expect(page.getByText(/Plan:.*pro/i)).toBeVisible();
    });
  });
});
