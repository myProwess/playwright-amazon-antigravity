import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * ========================
 * - Screenshots: Captured automatically on test failure
 * - Traces: Retained on failure for debugging
 * - Headed mode: Controlled via HEADED env variable
 *   Run headed:   HEADED=true npx playwright test
 *   Run headless:  npx playwright test  (default)
 * - Reporter: Allure for rich reports + HTML for quick viewing
 * - Timeouts: 90s per test, 30s per action for Amazon's dynamic loading
 */

export default defineConfig({
    /* Directory containing test files */
    testDir: './tests',

    /* Maximum time one test can run (90 seconds for Amazon's heavy pages) */
    timeout: 90_000,

    /* Global expect timeout */
    expect: {
        timeout: 15_000,
    },

    /* Fail the build on CI if you accidentally left test.only in the source code */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Run tests sequentially for this Amazon scenario (one browser, one flow) */
    workers: 1,

    /* Reporters: Allure for detailed reporting + HTML for quick local viewing */
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['allure-playwright'],
    ],

    /* Shared settings for all projects */
    use: {
        /* Base URL for Amazon India */
        baseURL: 'https://www.amazon.in',

        /* Automatically capture screenshot on failure */
        screenshot: 'only-on-failure',

        /* Retain trace on failure for debugging */
        trace: 'retain-on-failure',

        /* Record video on failure */
        video: 'retain-on-failure',

        /* Action timeout (30 seconds) */
        actionTimeout: 30_000,

        /* Navigation timeout (60 seconds for Amazon's heavy pages) */
        navigationTimeout: 60_000,

        /* Headed mode: set HEADED=true env var to run in headed mode */
        headless: process.env.HEADED !== 'true',

        /* Viewport size - set to null to allow browser to maximize */
        viewport: null,

        /* Launch Options to maximize browser upon startup */
        launchOptions: {
            args: ['--start-maximized']
        },

        /* Ignore HTTPS errors */
        ignoreHTTPSErrors: true,

        /* User agent to avoid bot detection */
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },

    /* Configure Chromium project */
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                /* Disable device viewport to rely on maximized window */
                viewport: null,
            },
        },
    ],
});
