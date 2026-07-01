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

import { getConsentStatus } from "@/hooks/useAnalyticsConsent";
import type { Json } from "@/integrations/supabase/types";
import { logger } from "@/lib/logger";

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

const analyticsConfigOverride: Partial<AnalyticsConfig> | null = null;

function getAnalyticsConfig(): AnalyticsConfig {
	const base: AnalyticsConfig = {
		enabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
		plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
		posthogKey: import.meta.env.VITE_POSTHOG_KEY,
		posthogHost: import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
	};

	return analyticsConfigOverride
		? { ...base, ...analyticsConfigOverride }
		: base;
}

function isDoNotTrackEnabled(): boolean {
	if (typeof navigator === "undefined") return false;
	return navigator.doNotTrack === "1" || navigator.doNotTrack === "yes";
}

function isTestEnv(): boolean {
	return import.meta.env.MODE === "test" || Boolean(import.meta.env.VITEST);
}

/**
 * Check if analytics should be tracked
 */
function shouldTrack(config: AnalyticsConfig): boolean {
	if (!config.enabled) return false;
	if (isDoNotTrackEnabled()) return false;
	if (typeof window === "undefined") return false;

	// Only track if user has consented
	const consent = getConsentStatus();
	return consent === "accepted";
}

/**
 * Track a page view
 */
export function trackPageView(page: AnalyticsPageView): void {
	const config = getAnalyticsConfig();
	if (!shouldTrack(config)) return;

	try {
		if (import.meta.env.DEV) {
			logger.debug("[Analytics] Page view:", page);
		}

		// Plausible Analytics
		if (
			config.plausibleDomain &&
			typeof window !== "undefined" &&
			window.plausible
		) {
			window.plausible("pageview", {
				props: {
					path: page.path,
					title: page.title,
				},
			});
		}

		// PostHog
		if (config.posthogKey && typeof window !== "undefined" && window.posthog) {
			window.posthog.capture("$pageview", {
				$current_url: window.location.href,
				path: page.path,
				title: page.title,
			});
		}
	} catch (error) {
		logger.warn("[Analytics] Failed to track page view:", error);
	}
}

import type { PostHog } from "posthog-js";

declare global {
	interface Window {
		posthog?: PostHog;
		plausible?: (
			eventName: string,
			options?: { props?: Record<string, Json | undefined> },
		) => void;
	}
}

/**
 * Initialize analytics providers (only if consented)
 */
export function initAnalytics(): void {
	const config = getAnalyticsConfig();
	if (!shouldTrack(config)) return;

	// Initialize Plausible
	if (config.plausibleDomain && typeof document !== "undefined") {
		const existing = document.querySelector(
			'script[data-analytics="plausible"]',
		);
		if (!existing) {
			const script = document.createElement("script");
			script.defer = true;
			script.dataset.domain = config.plausibleDomain;
			script.dataset.analytics = "plausible";
			if (isTestEnv()) {
				script.dataset.src = "https://plausible.io/js/script.js";
			} else {
				script.src = "https://plausible.io/js/script.js";
			}
			document.head.appendChild(script);
		}
	}

	// Initialize PostHog
	if (config.posthogKey && typeof window !== "undefined" && !window.posthog) {
		import("posthog-js").then((posthog) => {
			const ph = posthog.default;
			ph.init(config.posthogKey as string, {
				api_host: config.posthogHost,
				loaded: (loadedPh) => {
					if (import.meta.env.DEV) {
						loadedPh.debug(); // Enable debug mode in development
					}
				},
			});
			window.posthog = ph;
		});
	}
}
