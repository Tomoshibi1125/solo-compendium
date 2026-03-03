import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { CompendiumEntry } from "@/hooks/useStartupData";
import { logger } from "@/lib/logger";
import { OfflineStorageManager } from "@/lib/offlineStorage";

const CACHE_STALENESS_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_TIMESTAMP_KEY = "offline-cache-warmed-at";

const offlineStorage = new OfflineStorageManager();

/**
 * Warms the IndexedDB offline cache with startup compendium data and characters
 * so the app can function when the network is unavailable.
 */
export function useOfflineCacheWarmer() {
	const queryClient = useQueryClient();
	const warmedRef = useRef(false);

	useEffect(() => {
		if (warmedRef.current) return;

		const lastWarmed = localStorage.getItem(CACHE_TIMESTAMP_KEY);
		if (lastWarmed && Date.now() - Number(lastWarmed) < CACHE_STALENESS_MS) {
			warmedRef.current = true;
			return;
		}

		const warmCache = async () => {
			try {
				await offlineStorage.init();

				// Warm compendium entries from React Query cache
				const startupData = queryClient.getQueryData<{
					entries: CompendiumEntry[];
				}>(["startup-data"]);

				if (startupData?.entries?.length) {
					const batchSize = 50;
					for (let i = 0; i < startupData.entries.length; i += batchSize) {
						const batch = startupData.entries.slice(i, i + batchSize);
						await Promise.all(
							batch.map((entry) =>
								offlineStorage.storeCompendiumItem({
									id: entry.id,
									name: entry.name,
									description: entry.description,
									type: entry.type,
									source_book: entry.source_book,
									rarity: entry.rarity,
									tags: entry.tags,
									image_url: entry.image_url,
									level: entry.level,
									cr: entry.cr,
									gate_rank: entry.gate_rank,
									is_boss: entry.is_boss,
								}),
							),
						);
					}
					logger.log(
						`[OfflineCache] Warmed ${startupData.entries.length} compendium entries`,
					);
				}

				// Warm characters from React Query cache
				const characterQueries = queryClient.getQueriesData<unknown[]>({
					queryKey: ["characters"],
				});
				let characterCount = 0;
				for (const [, data] of characterQueries) {
					if (!Array.isArray(data)) continue;
					for (const char of data) {
						const c = char as Record<string, unknown>;
						if (typeof c.id === "string") {
							await offlineStorage.storeCharacter({
								id: c.id,
								userId: c.user_id as string | undefined,
								...c,
							});
							characterCount++;
						}
					}
				}
				if (characterCount > 0) {
					logger.log(`[OfflineCache] Warmed ${characterCount} characters`);
				}

				localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
				warmedRef.current = true;
			} catch (error) {
				logger.error("[OfflineCache] Failed to warm cache:", error);
			}
		};

		// Delay cache warming to avoid blocking initial render
		const timerId = setTimeout(warmCache, 3000);
		return () => clearTimeout(timerId);
	}, [queryClient]);
}
