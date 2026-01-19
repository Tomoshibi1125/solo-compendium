/**
 * Privacy-Respecting Analytics
 * 
 * Analytics tracking that only works when user has explicitly consented.
 * No tracking occurs without consent.
 * 
 * Supports multiple analytics providers:
 * - Custom events (stored locally, can be sent to your backend)
 * - Plausible Analytics (privacy-friendly)
 * - PostHog (optional)
 * - Google Analytics (optional, not recommended for privacy)
 */

import { getConsentStatus } from '@/hooks/useAnalyticsConsent';
import { logger } from '@/lib/logger';

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
};

type AnalyticsPageView = {
  path: string;
  title?: string;
  userId?: string;
};

type AnalyticsConfig = {
  enabled: boolean;
  plausibleDomain?: string;
  posthogKey?: string;
  posthogHost: string;
};

let analyticsConfigOverride: Partial<AnalyticsConfig> | null = null;

export function setAnalyticsConfigOverride(override: Partial<AnalyticsConfig> | null): void {
  analyticsConfigOverride = override;
}

function getAnalyticsConfig(): AnalyticsConfig {
  const base: AnalyticsConfig = {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
    posthogKey: import.meta.env.VITE_POSTHOG_KEY,
    posthogHost: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  };

  return analyticsConfigOverride ? { ...base, ...analyticsConfigOverride } : base;
}

function isDoNotTrackEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';
}

function isTestEnv(): boolean {
  return import.meta.env.MODE === 'test' || Boolean(import.meta.env.VITEST);
}

/**
 * Check if analytics should be tracked
 */
function shouldTrack(config: AnalyticsConfig): boolean {
  if (!config.enabled) return false;
  if (isDoNotTrackEnabled()) return false;
  if (typeof window === 'undefined') return false;

  // Only track if user has consented
  const consent = getConsentStatus();
  return consent === 'accepted';
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  const config = getAnalyticsConfig();
  if (!shouldTrack(config)) return;

  try {
    // Log event (can be extended to send to your backend)
    if (import.meta.env.DEV) {
      logger.debug('[Analytics] Event:', event);
    }

    // Plausible Analytics
    if (config.plausibleDomain && typeof window !== 'undefined' && window.plausible) {
      window.plausible(event.name, {
        props: event.properties,
      });
    }

    // PostHog
    if (config.posthogKey && typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(event.name, event.properties);
    }

    // Custom analytics endpoint (if you have one)
    // You can send events to your own backend here
    // Example:
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // }).catch(() => {}); // Fail silently
  } catch (error) {
    // Fail silently - analytics should never break the app
    logger.warn('[Analytics] Failed to track event:', error);
  }
}

/**
 * Track a page view
 */
export function trackPageView(page: AnalyticsPageView): void {
  const config = getAnalyticsConfig();
  if (!shouldTrack(config)) return;

  try {
    if (import.meta.env.DEV) {
      logger.debug('[Analytics] Page view:', page);
    }

    // Plausible Analytics
    if (config.plausibleDomain && typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', {
        props: {
          path: page.path,
          title: page.title,
        },
      });
    }

    // PostHog
    if (config.posthogKey && typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: page.path,
        title: page.title,
      });
    }
  } catch (error) {
    logger.warn('[Analytics] Failed to track page view:', error);
  }
}

/**
 * Identify a user (only when consented)
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  const config = getAnalyticsConfig();
  if (!shouldTrack(config)) return;

  try {
    // PostHog
    if (config.posthogKey && typeof window !== 'undefined' && window.posthog) {
      window.posthog.identify(userId, traits);
    }

    // Custom analytics
    // You can send user identification to your backend here
  } catch (error) {
    logger.warn('[Analytics] Failed to identify user:', error);
  }
}

/**
 * Reset user identification (on logout)
 */
export function resetUser(): void {
  const config = getAnalyticsConfig();
  if (!shouldTrack(config)) return;

  try {
    // PostHog
    if (config.posthogKey && typeof window !== 'undefined' && window.posthog) {
      window.posthog.reset();
    }
  } catch (error) {
    logger.warn('[Analytics] Failed to reset user:', error);
  }
}

/**
 * Initialize analytics providers (only if consented)
 */
export function initAnalytics(): void {
  const config = getAnalyticsConfig();
  if (!shouldTrack(config)) return;

  // Initialize Plausible
  if (config.plausibleDomain && typeof document !== 'undefined') {
    const existing = document.querySelector('script[data-analytics="plausible"]');
    if (!existing) {
      const script = document.createElement('script');
      script.defer = true;
      script.dataset.domain = config.plausibleDomain;
      script.dataset.analytics = 'plausible';
      if (isTestEnv()) {
        script.dataset.src = 'https://plausible.io/js/script.js';
      } else {
        script.src = 'https://plausible.io/js/script.js';
      }
      document.head.appendChild(script);
    }
  }

  // Initialize PostHog
  if (config.posthogKey && typeof window !== 'undefined' && !window.posthog) {
    import('posthog-js').then((posthog) => {
      posthog.default.init(config.posthogKey!, {
        api_host: config.posthogHost,
        loaded: (ph) => {
          if (import.meta.env.DEV) {
            ph.debug(); // Enable debug mode in development
          }
        },
      });
      window.posthog = posthog.default as unknown as Window['posthog'];
    });
  }
}

// Common event names for consistency
export const AnalyticsEvents = {
  // User actions
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  
  // Character actions
  CHARACTER_CREATED: 'character_created',
  CHARACTER_UPDATED: 'character_updated',
  CHARACTER_DELETED: 'character_deleted',
  CHARACTER_LEVELED_UP: 'character_leveled_up',
  CHARACTER_EXPORTED: 'character_exported',
  
  // Compendium actions
  COMPENDIUM_SEARCHED: 'compendium_searched',
  COMPENDIUM_ITEM_VIEWED: 'compendium_item_viewed',
  COMPENDIUM_ITEM_FAVORITED: 'compendium_item_favorited',
  
  // Campaign actions
  CAMPAIGN_CREATED: 'campaign_created',
  CAMPAIGN_JOINED: 'campaign_joined',
  
  // Feature usage
  DICE_ROLLED: 'dice_rolled',
  POWER_CAST: 'power_cast',
  EQUIPMENT_EQUIPPED: 'equipment_equipped',
  FEATURE_USED: 'feature_used',
  
  // UI interactions
  COMMAND_PALETTE_OPENED: 'command_palette_opened',
  EXPORT_DIALOG_OPENED: 'export_dialog_opened',
} as const;

