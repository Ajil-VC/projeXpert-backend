import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, errors, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

// Create logger
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Error log file (only logs with level "error")
        new transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 1,              // Keep only 1 file, delete old
        }),

        // Combined log file (logs all levels)
        new transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 1,              // Keep only 1 file, delete old
        }),
    ],
});

// log to console in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            colorize(),
            timestamp(),
            logFormat
        ),
    }));
}

export default logger;
