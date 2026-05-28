import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import type { CustomModifier, CustomModifierType } from "@/lib/customModifiers";
import {
	addLocalFeature,
	isLocalCharacterId,
	listLocalFeatures,
	removeLocalFeature,
} from "@/lib/guestStore";
import { FEAT_EFFECT_PRESETS, type FeatureEffect } from "@/types/featureEffects";

/** Loosened FeatureEffect shape for rows that may carry an authored effects array. */
type FeatureEffectLike = FeatureEffect;

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
	[key: string]: string | number | boolean | undefined;
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
				return listLocalFeatures(characterId) as unknown as CharacterFeature[];
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
				const stored = addLocalFeature(params.characterId, {
					name: params.name,
					source: `Homebrew: ${params.name}`,
					level_acquired: 1,
					description: params.description,
					action_type: "passive",
					is_active: true,
					modifiers: params.modifiers as never,
					homebrew_id: params.homebrewId ?? null,
				});
				return stored as unknown as CharacterFeature;
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
				removeLocalFeature(params.featureId);
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

/**
 * P1.9/B4 — Bake structured feat effects into CustomModifier[].
 *
 * For each active feature, resolve its structured effects (a `effects`
 * array on the row when authored, else the canonical `FEAT_EFFECT_PRESETS`
 * keyed by feat name). This is the path that handles things a flat
 * `modifiers` entry can't express — notably **per-level** HP scaling
 * (Tough = +2 HP × character level). Numeric effects map onto existing
 * CustomModifier types; non-numeric effects (save proficiency, passive-
 * only bonuses) are returned separately for the engine to apply.
 *
 * Feats that already carry explicit `modifiers` are NOT double-counted:
 * presets are only consulted when a feature has no `modifiers` of the
 * equivalent type.
 */
export function featureEffectsToCustomModifiers(
	features: CharacterFeature[],
	characterLevel: number,
): CustomModifier[] {
	const result: CustomModifier[] = [];
	for (const feature of features) {
		if (!feature.is_active) continue;

		// Prefer an authored structured `effects` array; fall back to the
		// canonical preset keyed by the feat's display name.
		const structured =
			(feature as unknown as { effects?: FeatureEffectLike[] }).effects ??
			FEAT_EFFECT_PRESETS[feature.name] ??
			null;
		if (!structured) continue;

		// Skip preset HP if the feature already authored an hp-max modifier
		// (avoid double counting).
		const hasAuthoredHpMod = (feature.modifiers ?? []).some(
			(m) => m.type === "hp-max" || m.type === "hp_max",
		);

		for (const effect of structured) {
			switch (effect.kind) {
				case "hp_per_level":
					if (hasAuthoredHpMod) break;
					result.push(
						mkMod(feature, "hp-max", effect.value * characterLevel),
					);
					break;
				case "hp_flat":
					if (hasAuthoredHpMod) break;
					result.push(mkMod(feature, "hp-max", effect.value));
					break;
				case "ability_score":
					result.push(mkMod(feature, "ability", effect.value, effect.target));
					break;
				case "ac_bonus":
					result.push(mkMod(feature, "ac_bonus", effect.value));
					break;
				case "speed_bonus":
					result.push(mkMod(feature, "speed_bonus", effect.value));
					break;
				case "initiative_bonus":
					result.push(mkMod(feature, "initiative_bonus", effect.value));
					break;
				case "attack_bonus":
					result.push(mkMod(feature, "attack_bonus", effect.value));
					break;
				case "damage_bonus":
					result.push(mkMod(feature, "damage_bonus", effect.value));
					break;
				// passive_bonus, save_proficiency, proficiency, expertise,
				// resistance, advantage, resource_grant, spell_grant are
				// non-flat-numeric and applied by their respective engines
				// (sensesEngine for passives, save-proficiency list for
				// Resilient, etc.). Not emitted as numeric customModifiers.
				default:
					break;
			}
		}
	}
	return result;
}

function mkMod(
	feature: CharacterFeature,
	type: CustomModifierType,
	value: number,
	target?: string,
): CustomModifier {
	return {
		id: `${feature.id}-fx-${type}-${target || "all"}`,
		type,
		target: target || null,
		value,
		source: feature.name,
		condition: null,
		enabled: true,
	};
}
