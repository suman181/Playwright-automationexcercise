import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

/**
 * Central framework configuration.
 *  - UI specs run on Chromium, Firefox and WebKit; API specs run once without a browser.
 *  - Fully parallel: every test creates its own unique user, so tests never share state.
 *  - Retries absorb flakiness of the shared public demo site; traces/screenshots/videos are
 *    kept for failures so every red test has debugging evidence.
 */
export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 1,
  workers: env.isCI ? 2 : 4,
  outputDir: 'test-results',

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],

  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-qa', // the site exposes stable data-qa hooks
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },

  projects: [
    { name: 'chromium', testDir: './tests/ui', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testDir: './tests/ui', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testDir: './tests/ui', use: { ...devices['Desktop Safari'] } },
    { name: 'api', testDir: './tests/api' },
  ],
});
