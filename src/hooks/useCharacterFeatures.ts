import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import type { CustomModifier, CustomModifierType } from "@/lib/customModifiers";
import { isLocalCharacterId } from "@/lib/guestStore";

export interface CharacterFeature {
	id: string;
	character_id: string;
	name: string;
	source: string;
	level_acquired: number;
	description: string | null;
	uses_current: number | null;
	uses_max: number | null;
	recharge: string | null;
	action_type: string | null;
	is_active: boolean;
	modifiers: FeatureModifier[] | null;
	homebrew_id: string | null;
	created_at: string;
}

export interface FeatureModifier {
	type: CustomModifierType;
	value: number;
	die?: string;
	target?: string;
	source: string;
}

const buildFeaturesCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.character-features.${userId}.character:${characterId}.v1`;
};

const readCachedFeatures = (key: string): CharacterFeature[] | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		return JSON.parse(raw) as CharacterFeature[];
	} catch {
		return null;
	}
};

const writeCachedFeatures = (key: string, features: CharacterFeature[]) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(features));
	} catch {
		// ignore
	}
};

export const useCharacterFeatures = (characterId: string) => {
	const { user, loading: authLoading } = useAuth();

	return useQuery({
		queryKey: ["character-features", characterId],
		queryFn: async (): Promise<CharacterFeature[]> => {
			if (!characterId) return [];

			if (isLocalCharacterId(characterId)) {
				const raw = window.localStorage.getItem("character-features");
				if (!raw) return [];
				const local = JSON.parse(raw) as Record<string, CharacterFeature[]>;
				return local[characterId] || [];
			}

			if (!isSupabaseConfigured || (!user && !authLoading)) {
				return [];
			}

			const cacheKey = user?.id
				? buildFeaturesCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_features")
				.select("*")
				.eq("character_id", characterId)
				.order("created_at", { ascending: true });

			if (error) {
				if (cacheKey) {
					const cached = readCachedFeatures(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}

			const next = (data || []) as CharacterFeature[];
			if (cacheKey) {
				writeCachedFeatures(cacheKey, next);
			}
			return next;
		},
		enabled: !!characterId && !authLoading,
	});
};

export const useApplyHomebrewFeature = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const { user } = useAuth();

	return useMutation({
		mutationFn: async (params: {
			characterId: string;
			homebrewId: string;
			name: string;
			description: string;
			modifiers: FeatureModifier[];
		}) => {
			const feature: CharacterFeature = {
				id: crypto.randomUUID(),
				character_id: params.characterId,
				name: params.name,
				source: `Homebrew: ${params.name}`,
				level_acquired: 1,
				description: params.description,
				uses_current: null,
				uses_max: null,
				recharge: null,
				action_type: "passive",
				is_active: true,
				modifiers: params.modifiers,
				homebrew_id: params.homebrewId,
				created_at: new Date().toISOString(),
			};

			if (isLocalCharacterId(params.characterId)) {
				const raw = window.localStorage.getItem("character-features");
				const local = raw
					? (JSON.parse(raw) as Record<string, CharacterFeature[]>)
					: {};
				local[params.characterId] = [
					...(local[params.characterId] || []),
					feature,
				];
				window.localStorage.setItem(
					"character-features",
					JSON.stringify(local),
				);
				return feature;
			}

			const cacheKey = user?.id
				? buildFeaturesCacheKey(user.id, params.characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedFeatures(cacheKey) ?? [];
				writeCachedFeatures(cacheKey, [...cached, feature]);
			}

			const { data, error } = await supabase
				.from("character_features")
				.insert({
					character_id: params.characterId,
					name: params.name,
					source: `Homebrew: ${params.name}`,
					level_acquired: 1,
					description: params.description,
					action_type: "passive",
					is_active: true,
					modifiers: params.modifiers as never,
					homebrew_id: params.homebrewId ?? null,
				})
				.select()
				.single();

			if (error) throw error;
			return data as CharacterFeature;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-features", variables.characterId],
			});
			toast({
				title: "Feature Applied",
				description: `${variables.name} has been applied to your character.`,
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to apply feature",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export const useRemoveCharacterFeature = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const { user } = useAuth();

	return useMutation({
		mutationFn: async (params: { featureId: string; characterId: string }) => {
			if (isLocalCharacterId(params.characterId)) {
				const raw = window.localStorage.getItem("character-features");
				const local = raw
					? (JSON.parse(raw) as Record<string, CharacterFeature[]>)
					: {};
				local[params.characterId] = (local[params.characterId] || []).filter(
					(f) => f.id !== params.featureId,
				);
				window.localStorage.setItem(
					"character-features",
					JSON.stringify(local),
				);
				return;
			}

			const cacheKey = user?.id
				? buildFeaturesCacheKey(user.id, params.characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedFeatures(cacheKey);
				if (cached) {
					writeCachedFeatures(
						cacheKey,
						cached.filter((f) => f.id !== params.featureId),
					);
				}
			}

			const { error } = await supabase
				.from("character_features")
				.delete()
				.eq("id", params.featureId);

			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-features", variables.characterId],
			});
			toast({ title: "Feature Removed" });
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to remove feature",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Convert FeatureModifiers from all active character features into CustomModifier[] */
export function featureModifiersToCustomModifiers(
	features: CharacterFeature[],
): CustomModifier[] {
	const result: CustomModifier[] = [];
	for (const feature of features) {
		if (!feature.is_active || !feature.modifiers) continue;
		for (const mod of feature.modifiers) {
			result.push({
				id: `${feature.id}-${mod.type}-${mod.target || "all"}`,
				type: mod.type,
				target: mod.target || null,
				value: mod.value,
				source: mod.source || feature.name,
				condition: null,
				enabled: true,
			});
		}
	}
	return result;
}
