import { type Page } from '@playwright/test';
import logger from '../utils/logger.js';

/**
 * HomePage Page Object
 * ====================
 * Encapsulates Amazon's home page interactions:
 * - Navigating to the home page
 * - Searching for products using the search bar
 *
 * Uses dynamic XPath locators for resilience against UI changes.
 */
export class HomePage {
    private page: Page;

    // --- Dynamic XPath Locators ---
    /** Search input field — targets the main search box by its ID attribute */
    private readonly searchInput = 'xpath=//input[@id="twotabsearchtextbox"]';

    /** Search submit button — targets the search icon/button */
    private readonly searchButton = 'xpath=//input[@id="nav-search-submit-button"]';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to Amazon home page and wait for the page to fully load.
     * Uses 'domcontentloaded' for faster initial load, then waits for the search box.
     */
    async navigateToHome(): Promise<void> {
        logger.info('🏠 Navigating to Amazon India home page...');
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });

        // Wait for the search box to be visible — confirms page is interactive
        await this.page.waitForSelector(this.searchInput, {
            state: 'visible',
            timeout: 30_000,
        });

        logger.info('✅ Amazon home page loaded successfully');
    }

    /**
     * Search for a product using Amazon's search bar.
     * Types the query, submits the search, and waits for results to load.
     *
     * @param query - The search term (e.g., "Iphone 17 pro")
     */
    async searchForProduct(query: string): Promise<void> {
        logger.info(`🔍 Searching for: "${query}"`);

        // Clear any existing text and type the search query
        const searchBox = this.page.locator(this.searchInput);
        await searchBox.click();
        await searchBox.fill(query);

        // Click the search button
        await this.page.locator(this.searchButton).click();

        // Wait for search results to load by waiting for result items to appear
        await this.page.waitForSelector(
            'xpath=//div[@data-component-type="s-search-result"]',
            { state: 'visible', timeout: 30_000 }
        );

        logger.info(`✅ Search results loaded for: "${query}"`);
    }
}
