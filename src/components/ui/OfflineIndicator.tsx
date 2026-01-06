/**
 * Offline Indicator
 * 
 * Shows a banner when the user is offline, indicating that some features may be limited.
 */

import { WifiOff } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { isOffline } = useOfflineStatus();

  if (!isOffline) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-amber-500/90 dark:bg-amber-600/90',
        'text-amber-950 dark:text-amber-50',
        'px-4 py-2',
        'flex items-center justify-center gap-2',
        'text-sm font-medium',
        'border-t border-amber-600 dark:border-amber-700',
        'backdrop-blur-sm'
      )}
    >
      <WifiOff className="w-4 h-4" />
      <span>You're offline. Some features may be limited.</span>
    </div>
  );
}

