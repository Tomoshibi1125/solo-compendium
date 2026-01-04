/**
 * Logger utility for development and production
 * Only logs in development mode, with exceptions for critical errors
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

/**
 * Development logger - logs everything
 */
const devLogger: Logger = {
  log: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
  warn: (...args) => console.warn(...args),
  debug: (...args) => console.debug(...args),
};

/**
 * Production logger - only logs critical errors
 */
const prodLogger: Logger = {
  log: () => {}, // No-op in production
  error: (...args) => {
    // Only log critical errors in production
    console.error(...args);
  },
  warn: () => {}, // No-op in production
  debug: () => {}, // No-op in production
};

/**
 * Critical errors that should always be logged (even in production)
 */
const criticalErrors: string[] = [
  'Missing Supabase',
  'Supabase connection',
  'ErrorBoundary',
  'Root element not found',
];

/**
 * Check if an error message should be logged in production
 */
function isCriticalError(...args: unknown[]): boolean {
  const message = args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.message;
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(' ');

  return criticalErrors.some((critical) =>
    message.toLowerCase().includes(critical.toLowerCase())
  );
}

/**
 * Production logger with critical error support
 */
const prodLoggerWithCritical: Logger = {
  log: () => {}, // No-op in production
  error: (...args) => {
    // Always log critical errors, even in production
    if (isCriticalError(...args)) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    // Warn about critical issues in production
    if (isCriticalError(...args)) {
      console.warn(...args);
    }
  },
  debug: () => {}, // No-op in production
};

// Export the appropriate logger based on environment
export const logger: Logger = isDevelopment
  ? devLogger
  : prodLoggerWithCritical;

// Export convenience functions
export const log = logger.log.bind(logger);
export const error = logger.error.bind(logger);
export const warn = logger.warn.bind(logger);
export const debug = logger.debug.bind(logger);

