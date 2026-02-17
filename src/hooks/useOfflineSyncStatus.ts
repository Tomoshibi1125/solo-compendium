import { useEffect, useState } from 'react';
import {
  getOfflineSyncSnapshot,
  processOfflineSyncQueue,
  subscribeOfflineSync,
} from '@/lib/offlineSync';
import { ensureOfflineSyncProcessors } from '@/lib/offlineSyncProcessors';
import { logger } from '@/lib/logger';

export function useOfflineSyncStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [snapshot, setSnapshot] = useState(() => getOfflineSyncSnapshot());

  useEffect(() => {
    ensureOfflineSyncProcessors();
    return subscribeOfflineSync((nextSnapshot) => {
      setSnapshot(nextSnapshot);
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline || snapshot.queueLength === 0) return;

    void processOfflineSyncQueue().catch((error) => {
      logger.warn('[OfflineSync] Queue processing failed:', error);
    });
  }, [isOnline, snapshot.queueLength]);

  return {
    isOnline,
    queueLength: snapshot.queueLength,
    isSyncing: snapshot.isProcessing,
  };
}
