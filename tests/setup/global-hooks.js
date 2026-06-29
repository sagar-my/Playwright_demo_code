import { test as baseTest } from '@playwright/test';

/**
 * Global hooks for all tests
 * Adds wait time after each test execution
 */
export const test = baseTest.extend({
  // Add wait before each test
  page: async ({ page }, use) => {
    // Wait 500ms before starting test
    await page.waitForTimeout(500);
    await use(page);
    // Wait 1 second after test completes (before teardown)
    await page.waitForTimeout(1000);
  },
});

// Global afterEach hook - runs after every test
test.afterEach(async ({ page }, testInfo) => {
  // Wait 1 second after each test for visibility
  await page.waitForTimeout(1000);
  
  // Take screenshot on failure (additional to config)
  if (testInfo.status !== 'passed') {
    await page.screenshot({ 
      path: `test-results/screenshots/${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`,
      fullPage: true 
    });
  }
});

