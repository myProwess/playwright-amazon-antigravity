import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { SearchResultsPage } from '../pages/SearchResultsPage.js';

/**
 * Custom Playwright Fixtures
 * ==========================
 * Extends the base Playwright test with page object fixtures.
 * Each fixture automatically initializes the corresponding page object
 * with the current `page`, keeping tests clean and DRY.
 *
 * Usage in test files:
 *   import { test, expect } from '../fixtures/fixtures';
 *   test('my test', async ({ homePage, searchResultsPage }) => { ... });
 */

// Define the shape of custom fixture types
type CustomFixtures = {
    homePage: HomePage;
    searchResultsPage: SearchResultsPage;
};

/**
 * Extended test object with custom page object fixtures.
 * Each fixture is lazily initialized — only created when used in a test.
 */
export const test = base.extend<CustomFixtures>({

    // HomePage fixture: initializes with the default Playwright page
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    // SearchResultsPage fixture: initializes with the Playwright page
    searchResultsPage: async ({ page }, use) => {
        const searchResultsPage = new SearchResultsPage(page);
        await use(searchResultsPage);
    },
});

export { expect } from '@playwright/test';
