/**
 * Sentry error tracking and performance monitoring
 * 
 * Initialize Sentry for error tracking and performance monitoring.
 * Set VITE_SENTRY_DSN environment variable to enable Sentry.
 */

import * as Sentry from '@sentry/react';
import { logger } from './logger';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.MODE || 'development';
const VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0';

/**
 * Initialize Sentry if DSN is provided
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    // Sentry is optional - only initialize if DSN is provided
    if (import.meta.env.DEV) {
      logger.debug('[Sentry] DSN not provided, error tracking disabled');
    }
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: ENVIRONMENT,
      release: VERSION,
      
      // Performance Monitoring
      integrations: [
        Sentry.browserTracingIntegration(),
      ],

      // Attach tracing headers only to allowed targets (avoid CORS issues)
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/.*\.supabase\.co/,
      ],

      // Performance Monitoring
      tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
      
      // Session Replay (optional, can be enabled for debugging)
      replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0, // Always capture replays on errors

      // Error filtering
      beforeSend(event, hint) {
        // Filter out known non-critical errors
        if (event.exception) {
          const error = hint.originalException;
          
          // Ignore network errors that are expected (e.g., offline)
          if (error instanceof Error) {
            if (
              error.message.includes('NetworkError') ||
              error.message.includes('Failed to fetch') ||
              error.message.includes('Load failed')
            ) {
              // Only ignore if it's a known network issue, not a critical error
              return null;
            }
          }
        }
        
        return event;
      },

      // Ignore specific errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        'atomicFindClose',
        'fb_xd_fragment',
        'bmi_SafeAddOnload',
        'EBCallBackMessageReceived',
        'conduitPage',
        // Network errors that are expected
        'NetworkError',
        'Failed to fetch',
        // ResizeObserver errors (common, non-critical)
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
      ],

      // Set user context when available
      beforeBreadcrumb(breadcrumb) {
        // Filter out noisy breadcrumbs
        if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
          return null;
        }
        return breadcrumb;
      },
    });

    if (import.meta.env.DEV) {
      logger.log('[Sentry] Initialized successfully');
    }
  } catch (error) {
    logger.error('[Sentry] Failed to initialize:', error);
  }
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(user: { id: string; email?: string; username?: string } | null) {
  if (!SENTRY_DSN) return;
  
  Sentry.setUser(user ? {
    id: user.id,
    email: user.email,
    username: user.username,
  } : null);
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  if (!SENTRY_DSN) return;
  
  Sentry.captureException(error, {
    contexts: {
      custom: context || {},
    },
  });
}

/**
 * Capture message manually
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, unknown>) {
  if (!SENTRY_DSN) return;
  
  Sentry.captureMessage(message, {
    level,
    contexts: {
      custom: context || {},
    },
  });
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  if (!SENTRY_DSN) return;
  
  Sentry.addBreadcrumb(breadcrumb);
}

