import * as fs from 'fs';
import * as path from 'path';
import logger from './logger.js';

/**
 * Product data interface for scraped search results
 */
export interface ProductData {
    rank: number;
    title: string;
    price: string;
}

/**
 * Writes an array of scraped product data to a formatted text file.
 *
 * @param products - Array of ProductData objects to write
 * @param filePath - Relative or absolute path for the output file
 */
export function writeProductsToFile(
    products: ProductData[],
    filePath: string = 'top_5_iphones.txt'
): void {
    try {
        const resolvedPath = path.resolve(process.cwd(), filePath);

        // Build formatted output
        const separator = '='.repeat(60);
        const lines: string[] = [
            separator,
            '  TOP 5 SEARCH RESULTS — iPhone 17 Pro on Amazon.in',
            `  Scraped at: ${new Date().toLocaleString()}`,
            separator,
            '',
        ];

        products.forEach((product) => {
            lines.push(`  #${product.rank}`);
            lines.push(`  Title : ${product.title}`);
            lines.push(`  Price : ${product.price}`);
            lines.push(`  ${'-'.repeat(50)}`);
        });

        lines.push('');
        lines.push(separator);

        fs.writeFileSync(resolvedPath, lines.join('\n'), 'utf-8');
        logger.info(`✅ Product data written successfully to: ${resolvedPath}`);
    } catch (error) {
        logger.error(
            `❌ Failed to write product data to file: ${(error as Error).message}`
        );
        throw error;
    }
}
