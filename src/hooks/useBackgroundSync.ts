import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

interface BackgroundSyncManager {
	isOnline: boolean;
	isSupported: boolean;
	syncQueue: OfflineSyncItem[];
	lastSyncTime: string | null;
	isSyncing: boolean;
}

interface OfflineSyncItem {
	id: string;
	type: string;
	action: "create" | "update" | "delete";
	data: Record<string, any>;
	timestamp: string;
	retryCount: number;
}

export function useBackgroundSync() {
	const { toast } = useToast();
	const { user } = useAuth();
	const [state, setState] = useState<BackgroundSyncManager>({
		isOnline: navigator.onLine,
		isSupported: "serviceWorker" in navigator && "SyncManager" in window,
		syncQueue: [],
		lastSyncTime: null,
		isSyncing: false,
	});

	// Monitor online status
	useEffect(() => {
		const handleOnline = () =>
			setState((prev) => ({ ...prev, isOnline: true }));
		const handleOffline = () =>
			setState((prev) => ({ ...prev, isOnline: false }));

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	// Process character sync
	const processCharacterSync = async (action: string, data: any) => {
		switch (action) {
			case "create":
				await supabase.from("characters").insert([data] as never[]);
				break;
			case "update": {
				const { id, ...updateData } = data;
				await supabase
					.from("characters")
					.update({ ...updateData } as never)
					.eq("id", id);
				break;
			}
			case "delete":
				await supabase.from("characters").delete().eq("id", data.id);
				break;
		}
	};

	// Process campaign sync
	const processCampaignSync = async (action: string, data: any) => {
		switch (action) {
			case "create":
				await supabase.from("campaigns").insert([data] as never[]);
				break;
			case "update": {
				const { id, ...updateData } = data;
				await supabase
					.from("campaigns")
					.update({ ...updateData } as never)
					.eq("id", id);
				break;
			}
			case "delete":
				await supabase.from("campaigns").delete().eq("id", data.id);
				break;
		}
	};

	// Process roll sync
	const processRollSync = async (action: string, data: any) => {
		switch (action) {
			case "create":
				await supabase.from("roll_history").insert(data as never);
				break;
			case "update": {
				const { id, ...updateData } = data;
				await supabase
					.from("roll_history")
					.update({ ...updateData } as never)
					.eq("id", id);
				break;
			}
			case "delete":
				await supabase.from("roll_history").delete().eq("id", data.id);
				break;
		}
	};

	// Process homebrew sync
	const processHomebrewSync = async (action: string, data: any) => {
		switch (action) {
			case "create":
				await supabase.from("homebrew_content").insert([data] as never[]);
				break;
			case "update": {
				const { id, ...updateData } = data;
				await supabase
					.from("homebrew_content")
					.update({ ...updateData } as never)
					.eq("id", id);
				break;
			}
			case "delete":
				await supabase.from("homebrew_content").delete().eq("id", data.id);
				break;
		}
	};

	// Process marketplace sync
	const processMarketplaceSync = async (action: string, data: any) => {
		switch (action) {
			case "create":
				await supabase.from("marketplace_items").insert([data] as never[]);
				break;
			case "update": {
				const { id, ...updateData } = data;
				await supabase
					.from("marketplace_items")
					.update({ ...updateData } as never)
					.eq("id", id);
				break;
			}
			case "delete":
				await supabase.from("marketplace_items").delete().eq("id", data.id);
				break;
		}
	};

	// Process individual sync item
	const processSyncItem = useCallback(
		async (item: OfflineSyncItem) => {
			const { type, action, data } = item;

			switch (type) {
				case "character":
					await processCharacterSync(action, data);
					break;
				case "campaign":
					await processCampaignSync(action, data);
					break;
				case "roll":
					await processRollSync(action, data);
					break;
				case "homebrew":
					await processHomebrewSync(action, data);
					break;
				case "marketplace":
					await processMarketplaceSync(action, data);
					break;
				default:
					console.warn(`Unknown sync type: ${type}`);
			}
		},
		[],
	);

	// Process sync queue
	const processSyncQueue = useCallback(async () => {
		const queueData = localStorage.getItem("offlineSyncQueue") || "[]";
		const queue: OfflineSyncItem[] = JSON.parse(queueData);

		if (queue.length === 0) return;

		const processedItems: string[] = [];
		const failedItems: OfflineSyncItem[] = [];

		for (const item of queue) {
			try {
				await processSyncItem(item);
				processedItems.push(item.id);
			} catch (error) {
				console.error(`Failed to sync item ${item.id}:`, error);

				// Increment retry count
				const failedItem = { ...item, retryCount: item.retryCount + 1 };

				// If retry count is less than 3, add back to queue
				if (failedItem.retryCount < 3) {
					failedItems.push(failedItem);
				} else {
					console.error(
						`Item ${item.id} exceeded max retry count, dropping from queue`,
					);
				}
			}
		}

		// Update queue in localStorage
		const updatedQueue = queue
			.filter((item) => !processedItems.includes(item.id))
			.concat(failedItems);
		localStorage.setItem("offlineSyncQueue", JSON.stringify(updatedQueue));

		// Update state
		setState((prev) => ({
			...prev,
			syncQueue: updatedQueue,
			lastSyncTime: new Date().toISOString(),
		}));

		if (processedItems.length > 0) {
			toast({
				title: "Sync Complete",
				description: `Successfully synchronized ${processedItems.length} items.`,
			});
		}

		if (failedItems.length > 0) {
			toast({
				title: "Partial Sync",
				description: `${failedItems.length} items failed to sync and will be retried later.`,
				variant: "destructive",
			});
		}
	}, [toast, processSyncItem]);

	// Handle sync events
	const handleSyncEvent = useCallback(
		async (event: any) => {
			if (!user || !state.isOnline) return;

			setState((prev) => ({ ...prev, isSyncing: true }));

			try {
				if (event.tag === "offline-sync-queue") {
					await processSyncQueue();
				}
			} catch (error) {
				console.error("Background sync failed:", error);
				toast({
					title: "Sync Failed",
					description:
						"Background sync encountered an error. Some data may not be synchronized.",
					variant: "destructive",
				});
			} finally {
				setState((prev) => ({ ...prev, isSyncing: false }));
			}
		},
		[user, state.isOnline, toast, processSyncQueue],
	);

	// Check if background sync is supported
	useEffect(() => {
		const checkSupport = () => {
			const supported = "serviceWorker" in navigator && "SyncManager" in window;
			setState((prev) => ({ ...prev, isSupported: supported }));

			if (supported) {
				// Register sync event listener
				navigator.serviceWorker.ready.then((registration) => {
					registration.addEventListener("sync", handleSyncEvent);
				});
			}
		};

		checkSupport();
	}, [handleSyncEvent]);

	// Add item to sync queue
	const addToSyncQueue = useCallback(
		(
			type: string,
			action: "create" | "update" | "delete",
			data: Record<string, any>,
		) => {
			if (!user) return;

			const item: OfflineSyncItem = {
				id: `${type}_${action}_${Date.now()}`,
				type,
				action,
				data,
				timestamp: new Date().toISOString(),
				retryCount: 0,
			};

			// Add to queue in localStorage
			const queueData = localStorage.getItem("offlineSyncQueue") || "[]";
			const queue: OfflineSyncItem[] = JSON.parse(queueData);
			queue.push(item);
			localStorage.setItem("offlineSyncQueue", JSON.stringify(queue));

			// Register background sync if supported
			if (state.isSupported && "serviceWorker" in navigator) {
				navigator.serviceWorker.ready.then((registration) => {
					// Register background sync
					if ("sync" in registration) {
						const syncManager = (registration as Record<string, any>).sync;
						if (syncManager) {
							syncManager.register("offline-sync-queue");
						}
					}
				});
			}

			setState((prev) => ({
				...prev,
				syncQueue: [...prev.syncQueue, item],
			}));
		},
		[user, state.isSupported],
	);

	// Force sync now
	const forceSyncNow = useCallback(async () => {
		if (!user || !state.isOnline) return;

		setState((prev) => ({ ...prev, isSyncing: true }));

		try {
			await processSyncQueue();
		} catch (error) {
			console.error("Manual sync failed:", error);
			toast({
				title: "Sync Failed",
				description: "Manual synchronization failed. Please try again later.",
				variant: "destructive",
			});
		} finally {
			setState((prev) => ({ ...prev, isSyncing: false }));
		}
	}, [user, state.isOnline, processSyncQueue, toast]);

	// Clear sync queue
	const clearSyncQueue = useCallback(() => {
		localStorage.setItem("offlineSyncQueue", "[]");
		setState((prev) => ({ ...prev, syncQueue: [] }));
	}, []);

	// Get sync statistics
	const getSyncStats = useCallback(() => {
		const queueData = localStorage.getItem("offlineSyncQueue") || "[]";
		const queue: OfflineSyncItem[] = JSON.parse(queueData);

		return {
			totalItems: queue.length,
			pendingItems: queue.filter((item) => item.retryCount < 3).length,
			failedItems: queue.filter((item) => item.retryCount >= 3).length,
			oldestItem: queue.length > 0 ? queue[0].timestamp : null,
			newestItem: queue.length > 0 ? queue[queue.length - 1].timestamp : null,
		};
	}, []);

	// Load initial queue from localStorage
	useEffect(() => {
		const queueData = localStorage.getItem("offlineSyncQueue") || "[]";
		const queue: OfflineSyncItem[] = JSON.parse(queueData);
		setState((prev) => ({ ...prev, syncQueue: queue }));
	}, []);

	// Auto-sync when coming back online
	useEffect(() => {
		if (state.isOnline && state.syncQueue.length > 0 && !state.isSyncing) {
			forceSyncNow();
		}
	}, [state.isOnline, state.syncQueue.length, state.isSyncing, forceSyncNow]);

	return {
		...state,
		addToSyncQueue,
		forceSyncNow,
		clearSyncQueue,
		getSyncStats,
	};
}
