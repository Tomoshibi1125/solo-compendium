import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import {
	addLocalFeature,
	isLocalCharacterId,
	listLocalFeatures,
	updateLocalFeature,
} from "@/lib/guestStore";

type Feature = Database["public"]["Tables"]["character_features"]["Row"];
type FeatureUpdate =
	Database["public"]["Tables"]["character_features"]["Update"];

const buildFeaturesCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.features.${userId}.character:${characterId}.v1`;
};

const readCachedFeatures = (key: string): Feature[] | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as Feature[]) : null;
	} catch {
		return null;
	}
};

const writeCachedFeatures = (key: string, features: Feature[]) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(features));
	} catch {
		// ignore
	}
};

export const useFeatures = (characterId: string) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: features = [], isLoading } = useQuery({
		queryKey: ["features", characterId],
		queryFn: async () => {
			if (isLocalCharacterId(characterId)) {
				return listLocalFeatures(characterId) as Feature[];
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildFeaturesCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_features")
				.select("*")
				.eq("character_id", characterId)
				.order("display_order", { ascending: true })
				.order("level_acquired", { ascending: true })
				.order("name", { ascending: true });

			if (error) {
				logErrorWithContext(error, "useFeatures");
				if (cacheKey) {
					const cached = readCachedFeatures(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}

			const next = (data || []) as Feature[];
			if (cacheKey) {
				writeCachedFeatures(cacheKey, next);
			}
			return next;
		},
	});

	const addFeature = useMutation({
		mutationFn: async (
			feature: Database["public"]["Tables"]["character_features"]["Insert"],
		) => {
			if (isLocalCharacterId(characterId)) {
				return addLocalFeature(characterId, feature);
			}

			const { data, error } = await supabase
				.from("character_features")
				.insert({ ...feature, character_id: characterId })
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useFeatures.addFeature");
				throw error;
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["features", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "useFeatures.addFeature");
			toast({
				title: "Failed to add feature",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const updateFeature = useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: FeatureUpdate;
		}) => {
			if (isLocalCharacterId(characterId)) {
				updateLocalFeature(id, updates);
				return null;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildFeaturesCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedFeatures(cacheKey);
				if (cached) {
					writeCachedFeatures(
						cacheKey,
						cached.map((row) =>
							row.id === id ? ({ ...row, ...updates } as Feature) : row,
						),
					);
				}
			}

			const { data, error } = await supabase
				.from("character_features")
				.update(updates)
				.eq("id", id);

			if (error) {
				logErrorWithContext(error, "useFeatures.updateFeature");
				throw error;
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["features", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "useFeatures.updateFeature");
			toast({
				title: "Failed to update feature",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const reorderFeatures = useMutation({
		mutationFn: async (newOrder: { id: string; display_order: number }[]) => {
			if (isLocalCharacterId(characterId)) {
				for (const { id, display_order } of newOrder) {
					updateLocalFeature(id, { display_order });
				}
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildFeaturesCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedFeatures(cacheKey);
				if (cached) {
					const next = cached
						.map((row) => {
							const nextOrder = newOrder.find((o) => o.id === row.id);
							return nextOrder
								? { ...row, display_order: nextOrder.display_order }
								: row;
						})
						.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
					writeCachedFeatures(cacheKey, next);
				}
			}

			const updates = newOrder.map(({ id, display_order }) =>
				supabase
					.from("character_features")
					.update({ display_order })
					.eq("id", id),
			);

			const results = await Promise.all(updates);
			const errors = results.filter((r) => r.error).map((r) => r.error);

			if (errors.length > 0) {
				const error = errors[0];
				logErrorWithContext(error, "useFeatures.reorderFeatures");
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["features", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "useFeatures.reorderFeatures");
			toast({
				title: "Failed to reorder features",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const activeFeatures = features.filter((f) => f.is_active);
	const featuresWithUses = features.filter((f) => f.uses_max !== null);

	return {
		features,
		isLoading,
		addFeature: addFeature.mutateAsync,
		updateFeature: updateFeature.mutateAsync,
		reorderFeatures: reorderFeatures.mutateAsync,
		activeFeatures,
		featuresWithUses,
	};
};

/**
 * Hook to browse all feats in the compendium
 */
export const useCompendiumFeats = () => {
	return useQuery({
		queryKey: ["compendium-feats"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("compendium_feats")
				.select("*")
				.order("name", { ascending: true });

			if (error) {
				console.error("Error fetching compendium feats:", error);
				throw error;
			}
			return data;
		},
	});
};
