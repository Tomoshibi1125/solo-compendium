/**
 * Environment Variable Validation
 * 
 * Validates required environment variables on app startup
 */

import { logger } from './logger';
import { AppError } from './appError';
import { getRuntimeEnvValue } from './runtimeEnv';

const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
] as const;

const OPTIONAL_ENV_VARS = [
  'VITE_SENTRY_DSN',
  'VITE_APP_VERSION',
  'VITE_ANALYTICS_ENABLED',
  'VITE_PLAUSIBLE_DOMAIN',
  'VITE_POSTHOG_KEY',
  'VITE_POSTHOG_HOST',
] as const;

interface ValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validate environment variables
 */
export function validateEnv(): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required vars
  for (const varName of REQUIRED_ENV_VARS) {
    const value = getRuntimeEnvValue(varName);
    if (!value || value.trim() === '') {
      missing.push(varName);
    }
  }
  const hasSupabaseKey = Boolean(getRuntimeEnvValue('VITE_SUPABASE_PUBLISHABLE_KEY') || getRuntimeEnvValue('VITE_SUPABASE_ANON_KEY'));
  if (!hasSupabaseKey) {
    missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  }

  // Check optional vars (warn if partially configured)
  const sentryVars = OPTIONAL_ENV_VARS.filter(v => v.startsWith('VITE_SENTRY_'));
  const hasSomeSentryVars = sentryVars.some(v => import.meta.env[v]);
  const hasAllSentryVars = sentryVars.every(v => import.meta.env[v]);

  if (hasSomeSentryVars && !hasAllSentryVars) {
    warnings.push('Sentry is partially configured. Some Sentry features may not work.');
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Validate and throw if invalid
 */
export function validateEnvOrThrow(): void {
  const result = validateEnv();

  if (!result.valid) {
    const errorMessage = `Missing required environment variables:\n${result.missing.map(v => `  - ${v}`).join('\n')}\n\nPlease check your .env file or environment configuration.`;
    // Critical config issue: always surface in logs (logger allows critical errors in production)
    logger.error(errorMessage);
    throw new AppError(errorMessage, 'CONFIG');
  }

  if (result.warnings.length > 0) {
    logger.warn('Environment validation warnings:');
    result.warnings.forEach(warning => logger.warn(`  - ${warning}`));
  }
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(name: string, fallback?: string): string {
  const value = import.meta.env[name];
  if (!value || value.trim() === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new AppError(`Environment variable ${name} is not set and no fallback provided`, 'CONFIG');
  }
  return value;
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return import.meta.env.MODE === 'development';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return import.meta.env.MODE === 'production';
}

