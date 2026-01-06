/**
 * Analytics Consent Hook
 * 
 * Manages user consent for analytics tracking.
 * Respects user privacy by requiring explicit opt-in.
 */

import { useState, useEffect, useCallback } from 'react';

const CONSENT_STORAGE_KEY = 'solo-compendium-analytics-consent';
const CONSENT_VERSION = 1; // Increment to re-prompt users

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

interface ConsentData {
  status: ConsentStatus;
  version: number;
  timestamp: number;
}

/**
 * Load consent status from localStorage
 */
function loadConsent(): ConsentData | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as ConsentData;
  } catch {
    return null;
  }
}

/**
 * Save consent status to localStorage
 */
function saveConsent(status: ConsentStatus): void {
  const data: ConsentData = {
    status,
    version: CONSENT_VERSION,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Check if consent is needed (not set or version mismatch)
 */
function isConsentNeeded(): boolean {
  const consent = loadConsent();
  if (!consent) return true;
  if (consent.version !== CONSENT_VERSION) return true;
  return false;
}

/**
 * Get current consent status
 */
export function getConsentStatus(): ConsentStatus {
  const consent = loadConsent();
  if (!consent || consent.version !== CONSENT_VERSION) return 'pending';
  return consent.status;
}

/**
 * Hook to manage analytics consent
 */
export function useAnalyticsConsent() {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() => getConsentStatus());
  const [showBanner, setShowBanner] = useState(() => isConsentNeeded());

  const acceptConsent = useCallback(() => {
    saveConsent('accepted');
    setConsentStatus('accepted');
    setShowBanner(false);
  }, []);

  const rejectConsent = useCallback(() => {
    saveConsent('rejected');
    setConsentStatus('rejected');
    setShowBanner(false);
  }, []);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsentStatus('pending');
    setShowBanner(true);
  }, []);

  return {
    consentStatus,
    hasConsent: consentStatus === 'accepted',
    showBanner,
    acceptConsent,
    rejectConsent,
    resetConsent,
    dismissBanner: () => setShowBanner(false),
  };
}

