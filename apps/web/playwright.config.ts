import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for apps/web
 * 
 * Phase D: Testing & Documentation
 * E2E test configuration with environment-based URL
 * 
 * @see docs/nbcon-new-plan/2 6 - 🧪 Phase D Testing & Documentation (Section 6)
 */

// Get base URL from environment or default to local dev server
const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.VITE_APP_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github']] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Allow more time for auth redirects and async operations
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm --filter nbcon-web dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for dev server startup
    stdout: 'ignore',
    stderr: 'pipe',
  },
});

