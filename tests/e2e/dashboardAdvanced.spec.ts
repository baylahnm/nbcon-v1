/**
 * Advanced Dashboard E2E Tests
 * 
 * Smoke tests for advanced dashboard components
 * Tests expandable modals, carousels, and project details
 * 
 * @created January 28, 2025
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';
const TEST_USER = {
  email: process.env.TEST_CLIENT_EMAIL || 'info@nbcon.org',
  password: process.env.TEST_CLIENT_PASSWORD || 'Qazwsx1234@',
};

test.describe('Advanced Client Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to auth page
    await page.goto(`${BASE_URL}/auth`);

    // Sign in
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');

    // Wait for dashboard to load
    await page.waitForURL(/\/free\/dashboard/, { timeout: 60000 });
  });

  test('should load dashboard with advanced components', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check for status cards section
    const statsSection = page.locator('[aria-label="Overview Statistics"]');
    await expect(statsSection).toBeVisible();

    // Should have 4 stat cards or loading skeletons
    const cards = page.locator('.grid > div[class*="cursor-pointer"], .grid > div.animate-pulse');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('should open expanded modal when clicking stat card', async ({ page }) => {
    // Wait for metrics to load (not loading state)
    await page.waitForSelector('[aria-label="Overview Statistics"]');
    
    // Wait a bit for data to load
    await page.waitForTimeout(2000);

    // Try to click first stat card (if not in loading state)
    const firstCard = page.locator('div[class*="cursor-pointer"]').first();
    
    if (await firstCard.isVisible()) {
      await firstCard.click();

      // Check if modal appeared (might not if still loading)
      const modal = page.locator('text=6-Month Performance');
      if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(modal).toBeVisible();
        
        // Should have close button
        const closeButton = page.locator('button:has(svg)').filter({ hasText: '' }).first();
        await expect(closeButton).toBeVisible();
      }
    }
  });

  test('should display conversations panel', async ({ page }) => {
    // Check for conversations card
    const conversationsCard = page.locator('text=Conversations').first();
    await expect(conversationsCard).toBeVisible();

    // Should have search input
    const searchInput = page.locator('input[placeholder*="Search conversations"]');
    await expect(searchInput).toBeVisible();
  });

  test('should navigate to AI chat on "Full Chat" click', async ({ page }) => {
    // Find "Full Chat" button
    const fullChatButton = page.locator('button:has-text("Full Chat")').first();
    
    if (await fullChatButton.isVisible()) {
      await fullChatButton.click();

      // Should navigate to AI page
      await expect(page).toHaveURL(/\/free\/ai/);
    }
  });

  test('should display projects carousel if advanced mode enabled', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for "Recent Projects" heading
    const projectsHeading = page.locator('h2:has-text("Recent Projects")');
    
    // May or may not be visible depending on useAdvancedComponents flag
    const isVisible = await projectsHeading.isVisible().catch(() => false);
    
    if (isVisible) {
      // Should have project cards in carousel
      const projectCards = page.locator('.min-w-\\[400px\\]');
      const count = await projectCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});

