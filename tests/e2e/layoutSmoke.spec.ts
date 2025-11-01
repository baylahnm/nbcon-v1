import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:8081";

for (const path of ["/free/dashboard", "/engineer/dashboard", "/enterprise/dashboard"]) {
  test(`dashboard renders unified layout for ${path}`, async ({ page }) => {
    await page.goto(`${BASE}${path}`);
    await expect(page.getByTestId("dashboard-stats")).toBeVisible();
    await expect(page.getByTestId("dashboard-quick-actions")).toBeVisible();
    await expect(page.getByTestId("dashboard-main-content")).toBeVisible();
  });
}

test("checkout button renders when Stripe is enabled", async ({ page }) => {
  await page.goto(`${BASE}/free/dashboard`);
  const hasStripe = await page.evaluate(() => {
    return typeof (window as any).Stripe !== "undefined";
  });
  if (hasStripe) {
    await expect(page.getByTestId("checkout-button")).toBeVisible();
  } else {
    console.log("Stripe not configured; skipping checkout test");
  }
});
