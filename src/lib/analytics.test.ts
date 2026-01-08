import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useAnalyticsConsent', () => ({
  getConsentStatus: () => 'accepted',
}));

import { initAnalytics, setAnalyticsConfigOverride, trackEvent, trackPageView } from './analytics';

const resetTestState = () => {
  setAnalyticsConfigOverride(null);
  delete window.plausible;
  delete window.posthog;
  document
    .querySelectorAll('script[data-analytics="plausible"]')
    .forEach((node) => node.remove());
  if (typeof navigator !== 'undefined') {
    Object.defineProperty(navigator, 'doNotTrack', { value: '0', configurable: true });
  }
};

beforeEach(() => {
  resetTestState();
  setAnalyticsConfigOverride({
    enabled: true,
    plausibleDomain: 'example.com',
    posthogKey: 'ph-test',
    posthogHost: 'https://posthog.test',
  });
});

afterEach(() => {
  resetTestState();
  vi.restoreAllMocks();
});

describe('analytics', () => {
  it('tracks events via Plausible and PostHog when enabled', () => {
    window.plausible = vi.fn();
    window.posthog = {
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    };

    trackEvent({ name: 'test_event', properties: { foo: 'bar' } });

    expect(window.plausible).toHaveBeenCalledWith('test_event', { props: { foo: 'bar' } });
    expect(window.posthog.capture).toHaveBeenCalledWith('test_event', { foo: 'bar' });
  });

  it('tracks page views via Plausible and PostHog when enabled', () => {
    window.plausible = vi.fn();
    window.posthog = {
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    };

    trackPageView({ path: '/compendium', title: 'Compendium' });

    expect(window.plausible).toHaveBeenCalledWith('pageview', {
      props: { path: '/compendium', title: 'Compendium' },
    });
    expect(window.posthog.capture).toHaveBeenCalledWith('$pageview', {
      $current_url: window.location.href,
      path: '/compendium',
      title: 'Compendium',
    });
  });

  it('skips tracking when analytics are disabled', () => {
    setAnalyticsConfigOverride({ enabled: false });
    window.plausible = vi.fn();

    trackEvent({ name: 'disabled_event' });

    expect(window.plausible).not.toHaveBeenCalled();
  });

  it('injects the Plausible script only once', () => {
    setAnalyticsConfigOverride({
      enabled: true,
      plausibleDomain: 'example.com',
      posthogKey: undefined,
    });

    initAnalytics();
    initAnalytics();

    const scripts = document.querySelectorAll('script[data-analytics="plausible"]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute('data-domain')).toBe('example.com');
  });
});
