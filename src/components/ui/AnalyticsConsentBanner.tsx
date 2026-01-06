/**
 * Analytics Consent Banner
 * 
 * Displays a banner asking users to consent to analytics tracking.
 * Respects user privacy by requiring explicit opt-in.
 */

import { Button } from '@/components/ui/button';
import { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';
import { initAnalytics } from '@/lib/analytics';
import { BarChart3, X, Shield } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export function AnalyticsConsentBanner() {
  const { showBanner, acceptConsent, rejectConsent, dismissBanner } = useAnalyticsConsent();

  // Initialize analytics if consent is accepted
  useEffect(() => {
    const consent = localStorage.getItem('solo-compendium-analytics-consent');
    if (consent) {
      const data = JSON.parse(consent);
      if (data.status === 'accepted') {
        initAnalytics();
      }
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  const handleAccept = () => {
    acceptConsent();
    initAnalytics();
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-card border-t border-border',
        'px-4 py-4 shadow-lg',
        'backdrop-blur-sm'
      )}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Help Improve Solo Compendium
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              We use privacy-respecting analytics to understand how you use the app and improve it.
              No personal data is collected, and you can opt out at any time. Analytics are completely optional.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAccept} size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Accept Analytics
              </Button>
              <Button onClick={rejectConsent} variant="outline" size="sm">
                No Thanks
              </Button>
              <Button onClick={dismissBanner} variant="ghost" size="sm" className="gap-2">
                <X className="w-4 h-4" />
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

