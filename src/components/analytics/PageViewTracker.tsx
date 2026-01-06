/**
 * Page View Tracker
 * 
 * Automatically tracks page views when route changes.
 * Only tracks if user has consented to analytics.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';

export function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView({
      path: location.pathname,
      title: document.title,
    });
  }, [location.pathname]);

  return null;
}

