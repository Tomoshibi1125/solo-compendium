/**
 * Analytics Consent Hook
 *
 * Manages user consent for analytics tracking.
 * Respects user privacy by requiring explicit opt-in.
 */

import { useCallback } from "react";
import { useUserLocalState } from "@/hooks/useToolState";

const CONSENT_STORAGE_KEY = "analytics-consent";
const CONSENT_VERSION = 1; // Increment to re-prompt users

export type ConsentStatus = "pending" | "accepted" | "rejected";

interface ConsentData {
	status: ConsentStatus;
	version: number;
	timestamp: number;
}

/**
 * Get current consent status
 */
export function getConsentStatus(): ConsentStatus {
	// This function is now deprecated as consent is managed per user
	// Use the hook instead
	return "pending";
}

/**
 * Hook to manage analytics consent
 */
export function useAnalyticsConsent() {
	const { state: consentData, setState: setConsentData } =
		useUserLocalState<ConsentData | null>(CONSENT_STORAGE_KEY, {
			initialState: null,
		});

	const consentStatus =
		consentData && consentData.version === CONSENT_VERSION
			? consentData.status
			: "pending";

	const showBanner = !consentData || consentData.version !== CONSENT_VERSION;

	const acceptConsent = useCallback(() => {
		const data: ConsentData = {
			status: "accepted",
			version: CONSENT_VERSION,
			timestamp: Date.now(),
		};
		setConsentData(data);
	}, [setConsentData]);

	const rejectConsent = useCallback(() => {
		const data: ConsentData = {
			status: "rejected",
			version: CONSENT_VERSION,
			timestamp: Date.now(),
		};
		setConsentData(data);
	}, [setConsentData]);

	const resetConsent = useCallback(() => {
		setConsentData(null);
	}, [setConsentData]);

	return {
		consentStatus,
		hasConsent: consentStatus === "accepted",
		showBanner,
		acceptConsent,
		rejectConsent,
		resetConsent,
		dismissBanner: () => setConsentData(consentData), // No-op since banner state is derived
	};
}
