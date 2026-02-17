import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type NavigatorConnection = Navigator & {
  connection?: {
    type?: string;
    effectiveType?: string;
  };
};

// PWA Service Worker Registration
export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [swUpdate, setSwUpdate] = useState<ServiceWorker | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Read service worker registration state and listen for updates.
    // Registration is centralized in ServiceWorkerUpdatePrompt to avoid duplicate registers.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration()
        .then(registration => {
          if (!registration) {
            logger.warn('[SW] No existing registration found. Ensure ServiceWorkerUpdatePrompt is mounted.');
            return;
          }

          logger.debug('SW registration detected: ', registration);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            logger.debug('SW update found');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setSwUpdate(newWorker);
                }
              });
            }
          });

          // Check for existing waiting service worker
          if (registration.waiting) {
            setSwUpdate(registration.waiting);
          }
        })
        .catch(error => {
          logger.error('SW registration lookup failed: ', error);
        });
    }

    // Check if app is already installed
    if ('standalone' in window.navigator || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Process offline sync queue when coming back online
      import('@/lib/offlineSync').then(({ processOfflineSyncQueue }) => {
        processOfflineSyncQueue().catch((err) =>
          logger.warn('[SW] Failed to process offline queue on reconnect:', err)
        );
      });
      // Register Background Sync tag if supported
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          if ('sync' in reg) {
            (reg as any).sync.register('offline-queue').catch((err: unknown) =>
              logger.debug('[SW] Background Sync registration skipped:', err)
            );
          }
        });
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = useCallback(async () => {
    if (!isInstallable) return;

    try {
      if (deferredPrompt) {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        logger.debug(`User response to the install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      }
    } catch (error) {
      logger.error('PWA installation failed:', error);
    }
  }, [deferredPrompt, isInstallable]);

  const updateServiceWorker = useCallback(async () => {
    if (!swUpdate) return;

    swUpdate.postMessage({ type: 'SKIP_WAITING' });
    
    // Wait for the new service worker to become active
    await new Promise(resolve => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        clearTimeout(timeoutId);
        resolve(undefined);
      }, { signal: controller.signal });
    });

    window.location.reload();
  }, [swUpdate]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    swUpdate,
    installPWA,
    updateServiceWorker,
  };
}

// Network Status Hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('unknown');

  useEffect(() => {
    const updateConnectionInfo = () => {
      setIsOnline(navigator.onLine);
      
      if ('connection' in navigator) {
        const connection = (navigator as NavigatorConnection).connection;
        setConnectionType(connection?.type || 'unknown');
        setEffectiveType(connection?.effectiveType || 'unknown');
      }
    };

    const handleOnline = () => updateConnectionInfo();
    const handleOffline = () => updateConnectionInfo();
    const handleConnectionChange = () => updateConnectionInfo();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('connectionchange', handleConnectionChange);

    updateConnectionInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('connectionchange', handleConnectionChange);
    };
  }, []);

  return {
    isOnline,
    connectionType,
    effectiveType,
  };
}


