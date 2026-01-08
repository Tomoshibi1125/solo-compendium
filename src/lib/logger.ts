/**
 * Logger utility for development and production
 * Only logs in development mode, with exceptions for critical errors
 */

const isDevelopment = import.meta.env.DEV;

export interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

type LoggerMode = 'development' | 'production';

type LoggerSink = Pick<Console, 'log' | 'error' | 'warn' | 'debug'>;

type LoggerOptions = {
  mode: LoggerMode;
  criticalPatterns: string[];
  sink: LoggerSink;
};

const noop = (..._args: unknown[]) => undefined;

/**
 * Critical errors that should always be logged (even in production)
 */
const defaultCriticalPatterns: string[] = [
  'Missing Supabase',
  'Missing required environment variables',
  'Supabase connection',
  '[Sentry]',
  '[SW]',
  'ErrorBoundary',
  'Root element not found',
];

/**
 * Check if an error message should be logged in production
 */
function isCriticalError(args: unknown[], criticalPatterns: string[]): boolean {
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

  return criticalPatterns.some((critical) => message.toLowerCase().includes(critical.toLowerCase()));
}

const defaultOptions: LoggerOptions = {
  mode: isDevelopment ? 'development' : 'production',
  criticalPatterns: defaultCriticalPatterns,
  sink: console,
};

export function createLogger(overrides: Partial<LoggerOptions> = {}): Logger {
  const options: LoggerOptions = {
    ...defaultOptions,
    ...overrides,
    criticalPatterns: overrides.criticalPatterns ?? defaultOptions.criticalPatterns,
    sink: overrides.sink ?? defaultOptions.sink,
    mode: overrides.mode ?? defaultOptions.mode,
  };

  if (options.mode === 'development') {
    return {
      log: (...args) => options.sink.log(...args),
      error: (...args) => options.sink.error(...args),
      warn: (...args) => options.sink.warn(...args),
      debug: (...args) => options.sink.debug(...args),
    };
  }

  const shouldLog = (...args: unknown[]) => isCriticalError(args, options.criticalPatterns);

  return {
    log: noop,
    error: (...args) => {
      if (shouldLog(...args)) {
        options.sink.error(...args);
      }
    },
    warn: (...args) => {
      if (shouldLog(...args)) {
        options.sink.warn(...args);
      }
    },
    debug: noop,
  };
}

// Export the appropriate logger based on environment
export const logger: Logger = createLogger();

// Export convenience functions
export const log = logger.log.bind(logger);
export const error = logger.error.bind(logger);
export const warn = logger.warn.bind(logger);
export const debug = logger.debug.bind(logger);

