import {
  BackgroundSyncManager,
  type SyncQueueItem,
  type SyncQueueProcessor,
} from '@/lib/offlineStorage';
import { warn } from '@/lib/logger';

const syncManager = BackgroundSyncManager.getInstance();

export type OfflineSyncType = SyncQueueItem['type'];
export type OfflineSyncAction = SyncQueueItem['action'];

export const enqueueOfflineSync = (
  type: OfflineSyncType,
  action: OfflineSyncAction,
  data: Record<string, unknown>
): SyncQueueItem => {
  const item = syncManager.addToQueue(type, action, data);

  // Register background sync if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      const sync = (reg as Record<string, any>)?.sync;
      if (sync?.register) {
        sync.register('offline-queue').catch((err: unknown) => {
          warn('[Background Sync] Registration failed:', err);
        });
      }
    });
  }

  return item;
};

export const processOfflineSyncQueue = (): Promise<void> => syncManager.processQueue();

export const subscribeOfflineSync = (
  listener: (snapshot: { queueLength: number; isProcessing: boolean }) => void
): (() => void) => syncManager.subscribe(listener);

export const getOfflineSyncSnapshot = () => syncManager.getSnapshot();

export const registerOfflineSyncProcessor = (
  type: OfflineSyncType,
  action: OfflineSyncAction,
  processor: SyncQueueProcessor
) => {
  syncManager.registerProcessor(type, action, processor);
};

export const unregisterOfflineSyncProcessor = (
  type: OfflineSyncType,
  action: OfflineSyncAction
) => {
  syncManager.unregisterProcessor(type, action);
};
