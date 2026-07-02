import { useCallback, useEffect, useState } from "react";
import { getSyncQueue } from "@/lib/syncManager";

/**
 * Passive reader of the unified offline-sync queue (lib/syncManager) for the
 * app-level offline banner. Flushing is owned by useBackgroundSync (online
 * events + post-enqueue), so this hook only observes: it re-reads the queue
 * length on mount, connectivity changes, and a slow heartbeat while anything
 * is pending.
 */
export function useOfflineSyncStatus() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true,
	);
	const [queueLength, setQueueLength] = useState(0);

	const refresh = useCallback(async () => {
		const queue = await getSyncQueue();
		setQueueLength(queue.length);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleOnline = () => {
			setIsOnline(true);
			void refresh();
		};
		const handleOffline = () => {
			setIsOnline(false);
			void refresh();
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		void refresh();

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [refresh]);

	// Heartbeat only while something is pending or we're offline — the queue
	// empties via useBackgroundSync's flush, which this picks up.
	useEffect(() => {
		if (isOnline && queueLength === 0) return;
		const timer = window.setInterval(() => {
			void refresh();
		}, 15_000);
		return () => window.clearInterval(timer);
	}, [isOnline, queueLength, refresh]);

	return {
		isOnline,
		queueLength,
	};
}
