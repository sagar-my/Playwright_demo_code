// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  //reporter: 'html',
   reporter: [
    ['list'],
    ['allure-playwright']
  ],
  use: {
      headless: false,          
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,         
    navigationTimeout: 30000,      
    expect: {
      timeout: 10000           
    },
  },
  
  globalSetup: undefined,
  globalTeardown: './helpers/globalTeardown.js',

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false, 
        launchOptions: {
          slowMo: 500,  // 500ms delay between actions
        },
      },
    },

  
  ],
});

