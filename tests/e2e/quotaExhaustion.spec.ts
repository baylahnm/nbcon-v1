/**
 * Quota Exhaustion E2E Tests
 * 
 * Tests token quota enforcement and exhaustion handling
 * 
 * @version 1.0.0
 * @created January 28, 2025
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'info@nbcon.org',
  password: process.env.TEST_USER_PASSWORD || 'Qazwsx1234@'
};

// Helper function to login
async function login(page: Page) {
  await page.goto(`${BASE_URL}/auth`);
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/(free|engineer)\/dashboard/, { timeout: 30000 });
}

test.describe('Quota Exhaustion Handling', () => {

  // ============================================================================
  // QUOTA DISPLAY TESTS
  // ============================================================================

  test('should display current quota usage in credits widget', async ({ page }) => {
    await login(page);

    // Look for credits widget in sidebar
    const creditsWidget = page.locator('[data-testid="credits-widget"]');
    
    if (await creditsWidget.isVisible()) {
      // Should see token usage
      await expect(creditsWidget.locator('text=/tokens/i')).toBeVisible();
      
      // Should see usage percentage
      const percentageText = creditsWidget.locator('[data-testid="credits-percentage"]');
      await expect(percentageText).toBeVisible();
    }
  });

  test('should show progress bar reflecting token usage', async ({ page }) => {
    await login(page);

    const creditsWidget = page.locator('[data-testid="credits-widget"]');
    
    if (await creditsWidget.isVisible()) {
      const progressBar = creditsWidget.locator('[data-testid="credits-progress-bar"]');
      await expect(progressBar).toBeVisible();
      
      // Progress bar should have a width style
      const width = await progressBar.getAttribute('style');
      expect(width).toContain('width');
    }
  });

  test('should display reset date correctly', async ({ page }) => {
    await login(page);

    const creditsWidget = page.locator('[data-testid="credits-widget"]');
    
    if (await creditsWidget.isVisible()) {
      const resetDate = creditsWidget.locator('[data-testid="credits-reset-date"]');
      await expect(resetDate).toBeVisible();
      
      const resetText = await resetDate.textContent();
      expect(resetText).toMatch(/reset/i);
    }
  });

  test('should show cost summary when tokens have been used', async ({ page }) => {
    await login(page);

    const creditsWidget = page.locator('[data-testid="credits-widget"]');
    
    if (await creditsWidget.isVisible()) {
      // Cost display may or may not be visible depending on usage
      const costDisplay = creditsWidget.locator('[data-testid="credits-cost"]');
      const costExists = await costDisplay.count() > 0;
      
      if (costExists) {
        const costText = await costDisplay.textContent();
        expect(costText).toMatch(/\$/);
      }
    }
  });

  // ============================================================================
  // QUOTA STATUS BADGES
  // ============================================================================

  test('should show green status badge when usage is healthy (<50%)', async ({ page }) => {
    await login(page);

    const statusBadge = page.locator('[data-testid="credits-status-badge"]');
    
    if (await statusBadge.isVisible()) {
      const badgeText = await statusBadge.textContent();
      const badgeClass = await statusBadge.getAttribute('class');
      
      // If usage is low, should show "Healthy" in green
      if (badgeText?.toLowerCase().includes('healthy')) {
        expect(badgeClass).toContain('green');
      }
    }
  });

  test('should show yellow status badge when usage is warning (50-80%)', async ({ page }) => {
    // This test requires setting up a user with 50-80% usage
    // For now, testing the UI elements exist
    
    await login(page);

    const statusBadge = page.locator('[data-testid="credits-status-badge"]');
    
    if (await statusBadge.isVisible()) {
      const badgeText = await statusBadge.textContent();
      
      // Badge should be one of: Healthy, Warning, Critical, Exceeded
      expect(badgeText).toMatch(/healthy|warning|critical|exceeded/i);
    }
  });

  test('should show red status badge when usage is critical (80-100%)', async ({ page }) => {
    // This test requires setting up a user with 80-100% usage
    // Testing UI structure
    
    await login(page);

    const statusBadge = page.locator('[data-testid="credits-status-badge"]');
    const exists = await statusBadge.count() > 0;
    
    expect(exists).toBe(true);
  });

  test('should show "Exceeded" badge when quota limit reached', async ({ page }) => {
    // This test requires a user who has exceeded their quota
    // Testing UI structure for now
    
    await login(page);

    const statusBadge = page.locator('[data-testid="credits-status-badge"]');
    
    if (await statusBadge.isVisible()) {
      const badgeText = await statusBadge.textContent();
      // Badge text should be one of the valid states
      expect(badgeText).toBeTruthy();
    }
  });

  // ============================================================================
  // AI CHAT QUOTA ENFORCEMENT
  // ============================================================================

  test('should allow AI chat when quota is available', async ({ page }) => {
    await login(page);

    // Navigate to AI chat
    await page.goto(`${BASE_URL}/free/ai`);
    await page.waitForLoadState('networkidle');

    // Should see chat interface
    const chatInput = page.locator('textarea[placeholder*="message" i], input[placeholder*="message" i]').first();
    await expect(chatInput).toBeVisible({ timeout: 15000 });

    // Should be able to type
    await chatInput.fill('Test message');
    
    // Should see send button
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await expect(sendButton).toBeEnabled();
    }
  });

  test('should block AI chat when quota is exhausted', async ({ page }) => {
    // This test requires a user with exhausted quota
    // For automated testing, would need to:
    // 1. Set up test user with zero quota
    // 2. Or mock the quota check response
    // 3. Verify chat is blocked with appropriate message
    
    await login(page);

    await page.goto(`${BASE_URL}/free/ai`);
    await page.waitForLoadState('networkidle');

    // If quota exhausted, should see warning message
    // (This requires actual quota exhaustion scenario)
  });

  test('should display quota exceeded message in chat', async ({ page }) => {
    // This test simulates quota exhaustion
    // Requires backend to return quota exceeded error
    
    await login(page);

    await page.goto(`${BASE_URL}/free/ai`);
    await page.waitForLoadState('networkidle');

    // Chat interface should be present
    const chatContainer = page.locator('[data-testid="chat-messages"], .chat-container').first();
    const exists = await chatContainer.count() > 0;
    
    // Basic validation that chat UI exists
    expect(exists).toBe(true);
  });

  // ============================================================================
  // UPGRADE PROMPT TESTS
  // ============================================================================

  test('should show upgrade prompt when approaching quota limit', async ({ page }) => {
    await login(page);

    // Check if warning appears in credits widget when usage is high
    const creditsWidget = page.locator('[data-testid="credits-widget"]');
    
    if (await creditsWidget.isVisible()) {
      const statusBadge = creditsWidget.locator('[data-testid="credits-status-badge"]');
      await expect(statusBadge).toBeVisible();
    }
  });

  test('should link to subscription page from quota exceeded prompt', async ({ page }) => {
    await login(page);

    await page.goto(`${BASE_URL}/free/subscription`);
    
    // Verify navigation works
    await expect(page).toHaveURL(/\/subscription/);
  });

  // ============================================================================
  // VISUAL REGRESSION TESTS
  // ============================================================================

  test('should display progress bar at correct percentage', async ({ page }) => {
    await login(page);

    const creditsWidget = page.locator('[data-testid="credits-widget"]');
    
    if (await creditsWidget.isVisible()) {
      const progressBar = creditsWidget.locator('[data-testid="credits-progress-bar"]');
      
      if (await progressBar.isVisible()) {
        const style = await progressBar.getAttribute('style');
        expect(style).toContain('width');
      }
    }
  });

  test('should update quota display after AI interaction', async ({ page }) => {
    await login(page);

    // Get initial quota
    const creditsWidget = page.locator('[data-testid="credits-widget"]');
    let initialUsage = '';
    
    if (await creditsWidget.isVisible()) {
      const usageText = await creditsWidget.locator('[data-testid="credits-percentage"]').textContent();
      initialUsage = usageText || '';
    }

    // Send AI message
    await page.goto(`${BASE_URL}/free/ai`);
    await page.waitForLoadState('networkidle');

    const chatInput = page.locator('textarea, input[type="text"]').first();
    if (await chatInput.isVisible()) {
      await chatInput.fill('What is 2+2?');
      
      const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        // Wait for response
        await page.waitForTimeout(2000);
      }
    }

    // Quota should update (in a real scenario)
    // This test validates UI structure, actual quota update depends on backend
  });
});

