/**
 * Sidebar Tier Gating E2E Tests
 * 
 * End-to-end tests for tier-aware sidebar navigation
 * 
 * @version 1.0.0
 * @created October 28, 2025
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

// Test users (update with actual test accounts)
const TEST_USERS = {
  free: {
    email: process.env.TEST_FREE_USER_EMAIL || 'free@nbcon.org',
    password: process.env.TEST_FREE_USER_PASSWORD || 'Test1234@',
  },
  pro: {
    email: process.env.TEST_PRO_USER_EMAIL || 'info@nbcon.org',
    password: process.env.TEST_PRO_USER_PASSWORD || 'Qazwsx1234@',
  },
};

// Helper: Login
async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/auth`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/(free|engineer|enterprise)\/dashboard/, { timeout: 30000 });
}

// ============================================================================
// FREE USER TIER GATING TESTS
// ============================================================================

test.describe('Sidebar Tier Gating - Free User', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.free.email, TEST_USERS.free.password);
  });

  test('should display locked indicators on premium menu items', async ({ page }) => {
    // Check for locked items (items with lock icon)
    const lockedItems = page.locator('[data-locked="true"]');
    const lockedCount = await lockedItems.count();
    
    expect(lockedCount).toBeGreaterThan(0);
  });

  test('should show tier badges on locked items', async ({ page }) => {
    // Find AI Assistant menu item
    const aiAssistant = page.locator('text=AI Assistant').first();
    await expect(aiAssistant).toBeVisible();
    
    // Should have tier badge
    const parentDiv = aiAssistant.locator('xpath=..');
    await expect(parentDiv.locator('text=/basic|pro|enterprise/i')).toBeVisible();
  });

  test('should open upgrade prompt when clicking locked item', async ({ page }) => {
    // Click a locked item
    const lockedItem = page.locator('[data-locked="true"]').first();
    await lockedItem.click();
    
    // Upgrade prompt should appear
    await expect(page.locator('[data-testid="sidebar-upgrade-prompt"]')).toBeVisible();
    await expect(page.locator('text=/Upgrade Required/i')).toBeVisible();
  });

  test('should navigate to subscription page from upgrade prompt', async ({ page }) => {
    // Click locked item
    const lockedItem = page.locator('[data-locked="true"]').first();
    await lockedItem.click();
    
    // Click upgrade button
    await page.click('[data-testid="upgrade-cta-button"]');
    
    // Should navigate to subscription page
    await expect(page).toHaveURL(/\/subscription|\/settings/);
  });

  test('should show upgrade CTA in sidebar footer', async ({ page }) => {
    // Free users should see upgrade CTA
    await expect(page.locator('text=/Unlock Premium/i')).toBeVisible();
    await expect(page.locator('button:has-text("Upgrade Now")')).toBeVisible();
  });

  test('should display all menu sections', async ({ page }) => {
    // Check for section headers
    await expect(page.locator('text=/OVERVIEW/i')).toBeVisible();
    await expect(page.locator('text=/PROJECTS/i')).toBeVisible();
    await expect(page.locator('text=/AI TOOLS/i')).toBeVisible();
  });
});

// ============================================================================
// PRO USER ACCESS TESTS
// ============================================================================

test.describe('Sidebar Tier Gating - Pro User', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.pro.email, TEST_USERS.pro.password);
  });

  test('should not show locked indicators for accessible items', async ({ page }) => {
    // Pro users should see fewer (or no) locked items
    const lockedItems = page.locator('[data-locked="true"]');
    const lockedCount = await lockedItems.count();
    
    // Should have fewer locked items than free tier
    expect(lockedCount).toBeLessThanOrEqual(2); // Maybe only enterprise items
  });

  test('should be able to navigate to AI tools', async ({ page }) => {
    // Click AI Assistant
    await page.click('text=AI Assistant');
    
    // Should navigate successfully (not show upgrade prompt)
    await expect(page).toHaveURL(/\/ai/);
    await expect(page.locator('[data-testid="sidebar-upgrade-prompt"]')).not.toBeVisible();
  });

  test('should show tier badge for paid tier', async ({ page }) => {
    // Should see tier badge in sidebar header
    await expect(page.locator('text=/pro tier/i')).toBeVisible();
  });

  test('should not show upgrade CTA in footer', async ({ page }) => {
    // Pro users should not see upgrade CTA (or see "Upgrade to Enterprise")
    const upgradeCTA = page.locator('button:has-text("Upgrade Now")');
    
    if (await upgradeCTA.isVisible()) {
      // If visible, should mention Enterprise
      await expect(page.locator('text=/enterprise/i')).toBeVisible();
    }
  });
});

// ============================================================================
// SECTION COLLAPSING TESTS
// ============================================================================

test.describe('Sidebar Section Collapsing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.free.email, TEST_USERS.free.password);
  });

  test('should expand/collapse sections on click', async ({ page }) => {
    // Find a section header
    const sectionHeader = page.locator('[data-testid^="sidebar-section-header"]').first();
    await sectionHeader.click();
    
    // Items should collapse
    const sectionId = (await sectionHeader.getAttribute('data-testid'))?.replace('sidebar-section-header-', '');
    if (sectionId) {
      const itemsContainer = page.locator(`[data-testid="sidebar-section-items-${sectionId}"]`);
      await expect(itemsContainer).not.toBeVisible({ timeout: 1000 });
      
      // Click again to expand
      await sectionHeader.click();
      await expect(itemsContainer).toBeVisible({ timeout: 1000 });
    }
  });
});

// ============================================================================
// ACTIVE ROUTE HIGHLIGHTING TESTS
// ============================================================================

test.describe('Active Route Highlighting', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.free.email, TEST_USERS.free.password);
  });

  test('should highlight active route in sidebar', async ({ page }) => {
    // Dashboard should be active initially
    const dashboardItem = page.locator('[data-testid="sidebar-item-dashboard"]');
    await expect(dashboardItem).toHaveAttribute('data-active', 'true');
  });

  test('should update active state on navigation', async ({ page }) => {
    // Navigate to calendar
    await page.click('text=Calendar');
    await expect(page).toHaveURL(/\/calendar/);
    
    // Calendar should now be active
    const calendarItem = page.locator('[data-testid="sidebar-item-calendar"]');
    await expect(calendarItem).toHaveAttribute('data-active', 'true');
  });
});

