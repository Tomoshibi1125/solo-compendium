/**
 * Service Worker Update Prompt
 * 
 * Prompts users when a new version of the app is available.
 * Uses the Workbox window library to detect service worker updates.
 */

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RefreshCw, X } from 'lucide-react';
import { logger } from '@/lib/logger';

export function ServiceWorkerUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Import workbox-window dynamically
    import('workbox-window').then(({ Workbox }) => {
      const wb = new Workbox('/sw.js');

      // Listen for updates
      wb.addEventListener('waiting', () => {
        setUpdateAvailable(true);
        // Store the waiting service worker
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration?.waiting) {
              setWaitingWorker(registration.waiting);
            }
          });
        }
      });

      // Register the service worker
      wb.register()
        .then(() => {
          if (import.meta.env.DEV) {
            logger.debug('[SW] Service worker registered');
          }
          // Check for updates immediately
          wb.update();
        })
        .catch((error) => {
          logger.warn('[SW] Service worker registration failed:', error);
        });

      // Check for updates periodically (every hour)
      const updateInterval = setInterval(() => {
        wb.update();
      }, 60 * 60 * 1000);

      return () => {
        clearInterval(updateInterval);
      };
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Send skip waiting message
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Wait for the new service worker to activate, then reload
      waitingWorker.addEventListener('statechange', (e) => {
        const sw = e.target as ServiceWorker;
        if (sw.state === 'activated') {
          setUpdateAvailable(false);
          setWaitingWorker(null);
          window.location.reload();
        }
      });
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <Dialog open={updateAvailable} onOpenChange={setUpdateAvailable}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Available</DialogTitle>
          <DialogDescription>
            A new version of Solo Compendium is available. Would you like to update now?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleDismiss}>
            <X className="w-4 h-4 mr-2" />
            Later
          </Button>
          <Button onClick={handleUpdate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

