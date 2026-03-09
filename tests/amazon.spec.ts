import { test, expect } from '../fixtures/fixtures.js';
import { writeProductsToFile, type ProductData } from '../utils/fileWriter.js';
import logger from '../utils/logger.js';

/**
 * Amazon E2E Test Suite — iPhone 17 Pro Search & Verify
 * =====================================================
 * Comprehensive end-to-end test that:
 * 1. Navigates to Amazon and searches for "Iphone 17 pro"
 * 2. Scrapes top 5 product titles & prices → writes to top_5_iphones.txt
 * 3. Extracts the first product's price and logs it
 */
test.describe('Amazon iPhone 17 Pro — Search, Scrape, and Verify', () => {

    test('Complete E2E: Search → Scrape → Extract Price', async ({
        homePage,
        searchResultsPage,
    }) => {

        // =========================================================================
        // STEP 1: Navigate to Amazon and search for "Iphone 17 pro"
        // =========================================================================
        logger.info('━'.repeat(60));
        logger.info('STEP 1: Navigate to Amazon and search for "Iphone 17 pro"');
        logger.info('━'.repeat(60));

        await homePage.navigateToHome();
        await homePage.searchForProduct('Iphone 17 pro');

        // =========================================================================
        // STEP 2: Scrape top 5 product titles & prices → write to file
        // =========================================================================
        logger.info('━'.repeat(60));
        logger.info('STEP 2: Scrape top 5 products and write to file');
        logger.info('━'.repeat(60));

        const top5Products: ProductData[] =
            await searchResultsPage.scrapeTopProducts(5);

        // Write scraped data to top_5_iphones.txt
        writeProductsToFile(top5Products, 'top_5_iphones.txt');

        // Assert we got results
        expect(top5Products.length).toBeGreaterThan(0);
        logger.info(
            `📝 ${top5Products.length} products written to top_5_iphones.txt`
        );

        // =========================================================================
        // STEP 3: Extract first product price and log it
        // =========================================================================
        logger.info('━'.repeat(60));
        logger.info('STEP 3: Extract first product price');
        logger.info('━'.repeat(60));

        const firstProductPrice =
            await searchResultsPage.getFirstProductPrice();

        logger.info(`🏷️ FIRST PRODUCT PRICE FROM SEARCH PAGE: ${firstProductPrice}`);
        expect(firstProductPrice).not.toBe('Price not available');

        logger.info('━'.repeat(60));
        logger.info('🎉 ALL STEPS COMPLETED SUCCESSFULLY!');
        logger.info('━'.repeat(60));
    });
});
