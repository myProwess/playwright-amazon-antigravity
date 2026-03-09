import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Winston Logger Configuration
 * ============================
 * Provides structured logging for test execution with:
 * - Console output with colorized levels
 * - File output to logs/test-execution.log
 * - Timestamped entries in format: [YYYY-MM-DD HH:mm:ss] [LEVEL] message
 */

// Ensure logs directory exists
const logsDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        // Console transport with colorized output
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] [${level}] ${message}`;
                })
            ),
        }),

        // File transport — appends logs to test-execution.log
        new transports.File({
            filename: path.join(logsDir, 'test-execution.log'),
            maxsize: 5 * 1024 * 1024, // 5 MB rotation
            maxFiles: 3,
        }),
    ],
});

export default logger;
