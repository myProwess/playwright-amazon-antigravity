import { type Page } from '@playwright/test';
import logger from '../utils/logger.js';
import { type ProductData } from '../utils/fileWriter.js';

/**
 * SearchResultsPage Page Object
 * =============================
 * Encapsulates Amazon's search results page interactions:
 * - Scraping product titles and prices from organic results
 * - Extracting the price of a specific product
 *
 * Uses dynamic XPath locators targeting data attributes for resilience.
 */
export class SearchResultsPage {
    private page: Page;

    // --- Dynamic XPath Locators ---

    /** All organic search result containers (excludes ads) */
    private readonly searchResultItems =
        'xpath=//div[@data-component-type="s-search-result" and not(contains(@class,"AdHolder"))]';

    /** Product title within a search result — targets the h2 > a > span pattern */
    private readonly productTitleXPath =
        'xpath=.//h2//a//span[@class="a-size-medium a-color-base a-text-normal"]';

    /** Fallback title XPath for different layouts */
    private readonly productTitleFallbackXPath =
        'xpath=.//h2//a//span';

    /** Product price (whole part) within a search result */
    private readonly productPriceWholeXPath =
        'xpath=.//span[@class="a-price"]//span[@class="a-price-whole"]';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Scrape the top N organic search results for title and price.
     *
     * @param count - Number of top results to scrape (default: 5)
     * @returns Array of ProductData objects with rank, title, and price
     */
    async scrapeTopProducts(count: number = 5): Promise<ProductData[]> {
        logger.info(`📦 Scraping top ${count} product results...`);

        const products: ProductData[] = [];
        const resultItems = this.page.locator(this.searchResultItems);
        const totalResults = await resultItems.count();

        logger.info(`Found ${totalResults} organic search results on the page`);

        const itemsToScrape = Math.min(count, totalResults);

        for (let i = 0; i < itemsToScrape; i++) {
            try {
                const item = resultItems.nth(i);

                // Extract title — try primary XPath, fall back if needed
                let title = '';
                const titleElement = item.locator(this.productTitleXPath);
                if ((await titleElement.count()) > 0) {
                    title = (await titleElement.first().textContent()) || '';
                } else {
                    const fallbackTitle = item.locator(this.productTitleFallbackXPath);
                    if ((await fallbackTitle.count()) > 0) {
                        title = (await fallbackTitle.first().textContent()) || '';
                    }
                }
                title = title.trim() || 'Title not available';

                // Extract price
                let price = 'Price not available';
                const priceElement = item.locator(this.productPriceWholeXPath);
                if ((await priceElement.count()) > 0) {
                    const priceText = (await priceElement.first().textContent()) || '';
                    // Clean up price text — remove trailing dot and whitespace
                    const cleanPrice = priceText.replace(/[.,\s]+$/, '').trim();
                    if (cleanPrice) {
                        price = `₹${cleanPrice}`;
                    }
                }

                const product: ProductData = {
                    rank: i + 1,
                    title,
                    price,
                };

                products.push(product);
                logger.info(`  #${i + 1}: ${title.substring(0, 60)}... — ${price}`);
            } catch (error) {
                logger.warn(
                    `⚠️ Could not scrape result #${i + 1}: ${(error as Error).message}`
                );
                products.push({
                    rank: i + 1,
                    title: 'Error extracting title',
                    price: 'Error extracting price',
                });
            }
        }

        logger.info(`✅ Successfully scraped ${products.length} products`);
        return products;
    }

    /**
     * Get the price of the first organic search result.
     *
     * @returns The price string (e.g., "₹1,34,900")
     */
    async getFirstProductPrice(): Promise<string> {
        logger.info('💰 Extracting price of the first product...');

        const firstResult = this.page
            .locator(this.searchResultItems)
            .first();

        const priceElement = firstResult.locator(this.productPriceWholeXPath);

        let price = 'Price not available';
        if ((await priceElement.count()) > 0) {
            const priceText = (await priceElement.first().textContent()) || '';
            const cleanPrice = priceText.replace(/[.,\s]+$/, '').trim();
            if (cleanPrice) {
                price = `₹${cleanPrice}`;
            }
        }

        logger.info(`💰 First product price: ${price}`);
        return price;
    }
}
