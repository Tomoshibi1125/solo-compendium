import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

interface OfflineDataCache {
	compendium: Record<string, any>;
	characters: Record<string, any>;
	campaigns: Record<string, any>;
	diceRolls: any[];
}

export function useOfflineDataAccess() {
	const { toast } = useToast();

	const cacheCompendiumItem = useCallback(async (item: any) => {
		try {
			if (typeof window === "undefined") return;

			const cacheKey = `compendium_${item.id}`;
			localStorage.setItem(
				cacheKey,
				JSON.stringify({
					data: item,
					cached_at: new Date().toISOString(),
				}),
			);
		} catch (error) {
			console.warn("Failed to cache compendium item:", error);
		}
	}, []);

	const getCachedCompendiumItem = useCallback((itemId: string) => {
		try {
			if (typeof window === "undefined") return null;

			const cacheKey = `compendium_${itemId}`;
			const cached = localStorage.getItem(cacheKey);
			if (!cached) return null;

			const parsed = JSON.parse(cached);
			// Return cached if less than 1 hour old
			const age = Date.now() - new Date(parsed.cached_at).getTime();
			if (age > 3600000) {
				// 1 hour
				localStorage.removeItem(cacheKey);
				return null;
			}

			return parsed.data;
		} catch (error) {
			console.warn("Failed to retrieve cached compendium item:", error);
			return null;
		}
	}, []);

	const cacheCharacter = useCallback(async (character: any) => {
		try {
			if (typeof window === "undefined") return;

			const cacheKey = `character_${character.id}`;
			localStorage.setItem(
				cacheKey,
				JSON.stringify({
					data: character,
					cached_at: new Date().toISOString(),
				}),
			);
		} catch (error) {
			console.warn("Failed to cache character:", error);
		}
	}, []);

	const getCachedCharacter = useCallback((characterId: string) => {
		try {
			if (typeof window === "undefined") return null;

			const cacheKey = `character_${characterId}`;
			const cached = localStorage.getItem(cacheKey);
			if (!cached) return null;

			const parsed = JSON.parse(cached);
			// Return cached if less than 30 minutes old
			const age = Date.now() - new Date(parsed.cached_at).getTime();
			if (age > 1800000) {
				// 30 minutes
				localStorage.removeItem(cacheKey);
				return null;
			}

			return parsed.data;
		} catch (error) {
			console.warn("Failed to retrieve cached character:", error);
			return null;
		}
	}, []);

	const cacheCampaign = useCallback(async (campaign: any) => {
		try {
			if (typeof window === "undefined") return;

			const cacheKey = `campaign_${campaign.id}`;
			localStorage.setItem(
				cacheKey,
				JSON.stringify({
					data: campaign,
					cached_at: new Date().toISOString(),
				}),
			);
		} catch (error) {
			console.warn("Failed to cache campaign:", error);
		}
	}, []);

	const getCachedCampaign = useCallback((campaignId: string) => {
		try {
			if (typeof window === "undefined") return null;

			const cacheKey = `campaign_${campaignId}`;
			const cached = localStorage.getItem(cacheKey);
			if (!cached) return null;

			const parsed = JSON.parse(cached);
			// Return cached if less than 15 minutes old
			const age = Date.now() - new Date(parsed.cached_at).getTime();
			if (age > 900000) {
				// 15 minutes
				localStorage.removeItem(cacheKey);
				return null;
			}

			return parsed.data;
		} catch (error) {
			console.warn("Failed to retrieve cached campaign:", error);
			return null;
		}
	}, []);

	const clearCache = useCallback(() => {
		try {
			if (typeof window === "undefined") return;

			const keys = Object.keys(localStorage);
			const cacheKeys = keys.filter(
				(key) =>
					key.startsWith("compendium_") ||
					key.startsWith("character_") ||
					key.startsWith("campaign_"),
			);

			cacheKeys.forEach((key) => localStorage.removeItem(key));

			toast({
				title: "Cache Cleared",
				description: "Offline cache has been cleared",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to clear cache",
				variant: "destructive",
			});
		}
	}, [toast]);

	const getCacheSize = useCallback(() => {
		try {
			if (typeof window === "undefined") return 0;

			let totalSize = 0;
			const keys = Object.keys(localStorage);

			keys.forEach((key) => {
				if (
					key.startsWith("compendium_") ||
					key.startsWith("character_") ||
					key.startsWith("campaign_")
				) {
					const value = localStorage.getItem(key);
					if (value) {
						totalSize += value.length;
					}
				}
			});

			return Math.round(totalSize / 1024); // Return size in KB
		} catch (error) {
			return 0;
		}
	}, []);

	// Enhanced caching for D&D Beyond parity
	const cacheWithExpiration = useCallback(
		(key: string, data: any, ttlMs: number) => {
			try {
				if (typeof window === "undefined") return;

				localStorage.setItem(
					key,
					JSON.stringify({
						data,
						cached_at: new Date().toISOString(),
						expires_at: new Date(Date.now() + ttlMs).toISOString(),
					}),
				);
			} catch (error) {
				console.warn(`Failed to cache ${key}:`, error);
			}
		},
		[],
	);

	const getCachedWithExpiration = useCallback((key: string) => {
		try {
			if (typeof window === "undefined") return null;

			const cached = localStorage.getItem(key);
			if (!cached) return null;

			const parsed = JSON.parse(cached);

			// Check if expired
			if (parsed.expires_at && new Date(parsed.expires_at) < new Date()) {
				localStorage.removeItem(key);
				return null;
			}

			return parsed.data;
		} catch (error) {
			console.warn(`Failed to retrieve cached ${key}:`, error);
			return null;
		}
	}, []);

	return {
		cacheCompendiumItem,
		getCachedCompendiumItem,
		cacheCharacter,
		getCachedCharacter,
		cacheCampaign,
		getCachedCampaign,
		clearCache,
		getCacheSize,
		cacheWithExpiration,
		getCachedWithExpiration,
	};
}
