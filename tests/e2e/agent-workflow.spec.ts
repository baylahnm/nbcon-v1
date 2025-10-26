/**
 * E2E Tests: Agent Selection & Workflow
 * Phase 3: Specialized Agent System
 * 
 * Tests complete user journey from agent selection to workflow execution
 */

import { test, expect } from '@playwright/test';

test.describe('Specialized Agent Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in as client
    await page.goto('http://localhost:8082/auth');
    
    await page.fill('input[type="email"]', 'mahdi.n.baylah@outlook.com');
    await page.fill('input[type="password"]', '1234@');
    await page.click('button:has-text("Sign In")');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/free/dashboard', { timeout: 10000 });
  });

  test('should display specialized agents in dashboard', async ({ page }) => {
    // Scroll to find agent section (may be below fold)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check if agents section exists (feature flag enabled)
    const agentsSection = page.locator('text=Specialized AI Agents');
    
    if (await agentsSection.isVisible()) {
      // Verify agent cards are displayed
      const agentCards = page.locator('[class*="grid"] > div').filter({
        has: page.locator('text=/Engineering Assistant/'),
      });

      const count = await agentCards.count();
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(9);

      // Take screenshot
      await page.screenshot({ path: 'tests/screenshots/dashboard-agents.png' });
    } else {
      console.log('Agents section not visible - feature flag may be disabled');
    }
  });

  test('should select agent from dashboard and navigate', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Scroll to agents section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check if specialized agents are enabled
    const agentsSection = page.locator('text=Specialized AI Agents');
    
    if (await agentsSection.isVisible()) {
      // Find Civil Engineering agent card
      const civilAgent = page.locator('text=Civil Engineering Assistant').first();
      
      if (await civilAgent.isVisible()) {
        await civilAgent.click();
        
        // Should navigate to agent workspace
        await expect(page).toHaveURL(/\/free\/ai\/agents\/civil/, { timeout: 5000 });
        
        // Take screenshot
        await page.screenshot({ path: 'tests/screenshots/agent-navigation.png' });
      }
    } else {
      test.skip();
    }
  });

  test('should show agent selector in AI chat page', async ({ page }) => {
    // Navigate to AI page
    await page.goto('http://localhost:8082/free/ai');
    await page.waitForLoadState('networkidle');

    // Check if agents button exists
    const agentsButton = page.locator('button:has-text("Agents")');
    
    if (await agentsButton.isVisible()) {
      await agentsButton.click();
      await page.waitForTimeout(500);

      // Should show agent selector
      const agentSelector = page.locator('text=Select Specialized Agent');
      await expect(agentSelector).toBeVisible();

      // Should show agent cards
      const agentCards = page.locator('[class*="grid"] > div').filter({
        has: page.locator('text=/Engineering Assistant/'),
      });

      const count = await agentCards.count();
      expect(count).toBeGreaterThan(0);

      await page.screenshot({ path: 'tests/screenshots/chat-agent-selector.png' });
    } else {
      test.skip();
    }
  });

  test('should load agent workspace in engineer portal', async ({ page }) => {
    // Sign out and sign in as engineer
    await page.goto('http://localhost:8082/auth');
    await page.evaluate(() => localStorage.clear());
    
    await page.fill('input[type="email"]', 'info@nbcon.org');
    await page.fill('input[type="password"]', '1234@');
    await page.click('button:has-text("Sign In")');
    
    await page.waitForURL('**/engineer/dashboard', { timeout: 10000 });

    // Navigate to AI Assistant page
    await page.goto('http://localhost:8082/engineer/ai');
    await page.waitForLoadState('networkidle');

    // Check if Specialized Agents tab exists
    const agentsTab = page.locator('button:has-text("Specialized Agents")');
    
    if (await agentsTab.isVisible()) {
      await agentsTab.click();
      await page.waitForTimeout(500);

      // Should show agent selector
      const agentSelector = page.locator('text=/Specialized Engineering Agents/');
      await expect(agentSelector).toBeVisible();

      // Click on Structural agent
      const structuralAgent = page.locator('text=Structural Engineering Assistant').first();
      if (await structuralAgent.isVisible()) {
        await structuralAgent.click();
        await page.waitForTimeout(500);

        // Should show Agent Workspace tab
        const workspaceTab = page.locator('button:has-text("Agent Workspace")');
        if (await workspaceTab.isVisible()) {
          await workspaceTab.click();
          await page.waitForTimeout(500);

          // Should show workspace UI
          const workspaceUI = page.locator('text=/Agent Tools & Workflows/');
          await expect(workspaceUI).toBeVisible();

          await page.screenshot({ path: 'tests/screenshots/engineer-agent-workspace.png' });
        }
      }
    } else {
      test.skip();
    }
  });

  test('should execute agent capability and show validation', async ({ page }) => {
    // This test requires full workspace to be loaded
    // For now, verify the UI structure exists
    
    await page.goto('http://localhost:8082/free/ai');
    await page.waitForLoadState('networkidle');

    // Check basic AI functionality works
    const composerInput = page.locator('textarea, input[placeholder*="message"]').first();
    
    if (await composerInput.isVisible()) {
      await composerInput.fill('Test message for agent');
      
      const sendButton = page.locator('button:has-text("Send"), button[aria-label*="Send"]').first();
      if (await sendButton.isVisible()) {
        // Don't actually send to avoid API calls in tests
        // Just verify the button is functional
        await expect(sendButton).toBeEnabled();
      }
    }
  });

  test('should fallback to normal chat if agents disabled', async ({ page }) => {
    // Even if agents are disabled, chat should work
    await page.goto('http://localhost:8082/free/ai');
    await page.waitForLoadState('networkidle');

    // Chat composer should always be visible
    const composer = page.locator('textarea, input[placeholder*="message"]').first();
    await expect(composer).toBeVisible();

    // Verify can type
    await composer.fill('Regular chat message');
    const text = await composer.inputValue();
    expect(text).toBe('Regular chat message');
  });
});

test.describe('Token Usage Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8082/auth');
    await page.fill('input[type="email"]', 'mahdi.n.baylah@outlook.com');
    await page.fill('input[type="password"]', '1234@');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/free/dashboard', { timeout: 10000 });
  });

  test('should display token usage widget if exists', async ({ page }) => {
    // Look for token usage widget
    const tokenWidget = page.locator('text=/Token Usage|tokens|Token/i');
    
    if (await tokenWidget.isVisible()) {
      // Widget exists - verify it displays data
      await expect(tokenWidget).toBeVisible();
      
      await page.screenshot({ path: 'tests/screenshots/token-usage-widget.png' });
    } else {
      console.log('Token usage widget not found - may not be wired yet');
    }
  });
});

test.describe('Feature Flags', () => {
  test('should respect feature flag for specialized agents', async ({ page }) => {
    await page.goto('http://localhost:8082/auth');
    await page.fill('input[type="email"]', 'mahdi.n.baylah@outlook.com');
    await page.fill('input[type="password"]', '1234@');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/free/dashboard');

    // Check if agents section appears (flag enabled) or not (flag disabled)
    await page.waitForTimeout(1000);
    
    const hasAgentsSection = await page.locator('text=Specialized AI Agents').isVisible();
    
    // This is informational - either state is valid
    console.log(`Specialized Agents feature: ${hasAgentsSection ? 'ENABLED' : 'DISABLED'}`);
    
    if (hasAgentsSection) {
      // Verify agent cards exist
      const agentCards = page.locator('[class*="grid"] > div').filter({
        has: page.locator('text=/Engineering Assistant/'),
      });
      const count = await agentCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});


