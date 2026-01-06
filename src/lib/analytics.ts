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

// Analytics provider configuration
const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

/**
 * Check if analytics should be tracked
 */
function shouldTrack(): boolean {
  if (!ANALYTICS_ENABLED) return false;
  
  // Only track if user has consented
  const consent = getConsentStatus();
  return consent === 'accepted';
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (!shouldTrack()) return;

  try {
    // Log event (can be extended to send to your backend)
    if (import.meta.env.DEV) {
      console.log('[Analytics] Event:', event);
    }

    // Plausible Analytics
    if (PLAUSIBLE_DOMAIN && typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(event.name, {
        props: event.properties,
      });
    }

    // PostHog
    if (POSTHOG_KEY && typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event.name, event.properties);
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
    console.error('[Analytics] Failed to track event:', error);
  }
}

/**
 * Track a page view
 */
export function trackPageView(page: AnalyticsPageView): void {
  if (!shouldTrack()) return;

  try {
    if (import.meta.env.DEV) {
      console.log('[Analytics] Page view:', page);
    }

    // Plausible Analytics
    if (PLAUSIBLE_DOMAIN && typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview', {
        props: {
          path: page.path,
          title: page.title,
        },
      });
    }

    // PostHog
    if (POSTHOG_KEY && typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: page.path,
        title: page.title,
      });
    }
  } catch (error) {
    console.error('[Analytics] Failed to track page view:', error);
  }
}

/**
 * Identify a user (only when consented)
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (!shouldTrack()) return;

  try {
    // PostHog
    if (POSTHOG_KEY && typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.identify(userId, traits);
    }

    // Custom analytics
    // You can send user identification to your backend here
  } catch (error) {
    console.error('[Analytics] Failed to identify user:', error);
  }
}

/**
 * Reset user identification (on logout)
 */
export function resetUser(): void {
  if (!shouldTrack()) return;

  try {
    // PostHog
    if (POSTHOG_KEY && typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.reset();
    }
  } catch (error) {
    console.error('[Analytics] Failed to reset user:', error);
  }
}

/**
 * Initialize analytics providers (only if consented)
 */
export function initAnalytics(): void {
  if (!shouldTrack()) return;

  // Initialize Plausible
  if (PLAUSIBLE_DOMAIN && typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = PLAUSIBLE_DOMAIN;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  // Initialize PostHog
  if (POSTHOG_KEY && typeof window !== 'undefined') {
    import('posthog-js').then((posthog) => {
      posthog.default.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        loaded: (ph) => {
          if (import.meta.env.DEV) {
            ph.debug(); // Enable debug mode in development
          }
        },
      });
      (window as any).posthog = posthog.default;
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

