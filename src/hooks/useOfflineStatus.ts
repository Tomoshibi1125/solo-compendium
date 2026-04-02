/**
 * Hook to track online/offline status
 * Useful for showing offline indicators and handling offline behavior
 */

import { useEffect, useState } from "react";
import { flushSyncQueue } from "@/lib/syncManager";

export function useOfflineStatus() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true,
	);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleOnline = () => {
			setIsOnline(true);
			void flushSyncQueue().catch(console.error);
		};
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return { isOnline, isOffline: !isOnline };
}
