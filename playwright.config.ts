import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for System Ascendant E2E tests.
 * Dual-context (DM + Player) tests live under ./tests/.
 * Legacy root-level specs (dm-campaign-controls, etc.) still run via testDir match.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts', '*.spec.ts'],
  testIgnore: ['**/node_modules/**', '**/dist/**'],
  timeout: 60_000, // Reduced from 120s for faster failure detection
  expect: { timeout: 8_000 }, // Slightly reduced
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // Add 1 retry for local stability
  /* Opt out of parallel tests to avoid state interference across persistent accounts/tool-state. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:8080',

    /* Headed mode so the run is watchable */
    headless: false,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15_000, // Reduced from 20s

    /* Collect trace when retrying the failed test. */
    trace: 'retain-on-failure',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Reduced slowMo for faster execution while maintaining visibility */
    launchOptions: {
      slowMo: 400, // Reduced from 800ms
      args: [
        '--disable-web-security', // Help with CORS issues
        '--disable-features=VizDisplayCompositor', // Stability improvement
        '--no-sandbox', // Stability in CI environments
        '--disable-dev-shm-usage' // Prevent memory issues
      ]
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
