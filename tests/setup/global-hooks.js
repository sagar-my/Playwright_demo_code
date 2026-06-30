import { test as baseTest } from '@playwright/test';

/**
 * Global hooks for all tests
 * Keeps test setup fast by avoiding arbitrary delays.
 */
export const test = baseTest.extend({
  page: async ({ page }, use) => {
    await use(page);
  },
});

// Global afterEach hook - capture screenshots on failure only
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await page.screenshot({ 
      path: `test-results/screenshots/${testInfo.title.replace(/\s+/g, '_')}_${Date.now()}.png`,
      fullPage: true 
    });
  }
});

