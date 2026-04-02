import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/authContext";
import { logger } from "@/lib/logger";
import type { SyncAction, SyncItem, SyncItemType } from "@/lib/syncManager";
import {
	enqueueSyncItem,
	flushSyncQueue,
	getSyncQueue,
} from "@/lib/syncManager";

interface BackgroundSyncState {
	isOnline: boolean;
	isSupported: boolean;
	syncQueue: SyncItem[];
	lastSyncTime: string | null;
	isSyncing: boolean;
}

export function useBackgroundSync() {
	const { toast } = useToast();
	const { user } = useAuth();
	const [state, setState] = useState<BackgroundSyncState>({
		isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
		isSupported:
			typeof navigator !== "undefined" &&
			"serviceWorker" in navigator &&
			"SyncManager" in window,
		syncQueue: [],
		lastSyncTime: null,
		isSyncing: false,
	});

	// Refresh queue from IndexedDB
	const refreshQueue = useCallback(async () => {
		const queue = await getSyncQueue();
		setState((prev) => ({ ...prev, syncQueue: queue }));
	}, []);

	// Force sync now
	const forceSyncNow = useCallback(async () => {
		if (!user || !navigator.onLine) return;

		setState((prev) => ({ ...prev, isSyncing: true }));

		try {
			await flushSyncQueue();
			await refreshQueue();
			setState((prev) => ({ ...prev, lastSyncTime: new Date().toISOString() }));
		} catch (error) {
			logger.error("Manual sync failed:", error);
			toast({
				title: "Sync Failed",
				description: "Background synchronization encountered an error.",
				variant: "destructive",
			});
		} finally {
			setState((prev) => ({ ...prev, isSyncing: false }));
		}
	}, [user, refreshQueue, toast]);

	// Monitor online status
	useEffect(() => {
		const handleOnline = () => {
			setState((prev) => ({ ...prev, isOnline: true }));
			forceSyncNow();
		};
		const handleOffline = () =>
			setState((prev) => ({ ...prev, isOnline: false }));

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		refreshQueue();

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [refreshQueue, forceSyncNow]);

	// Add item to sync queue
	const addToSyncQueue = useCallback(
		async (
			type: SyncItemType,
			action: SyncAction,
			data: Record<string, unknown>,
		) => {
			if (!user) return;

			await enqueueSyncItem(type, action, data);
			await refreshQueue();

			// Register background sync if supported
			if (state.isSupported && "serviceWorker" in navigator) {
				const registration = (await navigator.serviceWorker
					.ready) as ServiceWorkerRegistration & {
					sync?: { register: (tag: string) => Promise<void> };
				};
				if (registration.sync) {
					try {
						await registration.sync.register("offline-sync-queue");
					} catch (err) {
						logger.warn(
							"Failed to register background sync, will retry manually when online",
							err,
						);
					}
				}
			}

			if (state.isOnline) {
				forceSyncNow();
			}
		},
		[user, state.isSupported, state.isOnline, refreshQueue, forceSyncNow],
	);

	return {
		...state,
		addToSyncQueue,
		forceSyncNow,
		refreshQueue,
	};
}
