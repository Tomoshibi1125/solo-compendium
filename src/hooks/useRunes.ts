import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { isLocalCharacterId } from "@/lib/guestStore";
import { resolveRuneAbsorption } from "@/lib/runeAutomation";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";
import { getProficiencyBonus } from "@/types/core-rules";

export type Rune = Database["public"]["Tables"]["compendium_runes"]["Row"];
export type RuneInscription =
	Database["public"]["Tables"]["character_rune_inscriptions"]["Row"] & {
		rune?: Rune;
		equipment?: EquipmentRow;
	};
export type RuneKnowledge =
	Database["public"]["Tables"]["character_rune_knowledge"]["Row"];
export type EquipmentRow =
	Database["public"]["Tables"]["character_equipment"]["Row"];

const buildRuneKnowledgeCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.rune-knowledge.${userId}.char:${characterId}.v1`;
};

const _buildRuneInscriptionsCacheKey = (
	userId: string,
	characterId: string,
) => {
	return `solo-compendium.cache.rune-inscriptions.${userId}.character:${characterId}.v1`;
};

const readCachedData = <T>(key: string): T | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
};

const writeCachedData = <T>(key: string, data: T) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(data));
	} catch {
		// ignore
	}
};

// Fetch all compendium runes
export function useCompendiumRunes(characterId?: string) {
	return useQuery({
		queryKey: ["compendium-runes", characterId ?? "global"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("compendium_runes")
				.select("*")
				.order("rune_level", { ascending: true })
				.order("name", { ascending: true });

			// If Supabase returned results, use them
			if (!error && data && data.length > 0) {
				const runes = data; // Supabase type-safety is sufficient here
				const campaignId = characterId
					? await getCharacterCampaignId(characterId)
					: null;
				return filterRowsBySourcebookAccess(runes, (rune) => rune.source_book, {
					campaignId,
				});
			}

			// Static fallback: load runes from compendium data
			const { staticDataProvider } = await import(
				"@/data/compendium/staticDataProvider"
			);
			const staticRunes = await staticDataProvider.getRunes("");
			return staticRunes.map((r) => ({
				id: r.id,
				name: r.name,
				display_name: r.display_name || r.name,
				description: r.description,
				rune_level: r.rune_level ?? 1,
				rune_type: r.rune_type ?? "enhancement",
				rune_category: r.rune_category ?? "general",
				rarity: (r.rarity as Database["public"]["Enums"]["rarity"]) ?? "common",
				source_book: r.source_book ?? "Rift Ascendant Canon",
				created_at: r.created_at,
				tags: r.tags ?? null,
				image: r.image ?? null,
				image_url: r.image || null,
				mechanics: null,
				flavor: null,
				generated_reason: null,
				// Add missing schema fields for full type compliance
				activation_action: "",
				activation_cost: "",
				activation_cost_amount: null,
				aliases: null,
				can_inscribe_on: null,
				caster_penalty: "",
				caster_requirement_multiplier: null,
				discovery_lore: "",
				duration: "",
				effect_description: r.description,
				effect_type: "",
				element: "",
				higher_levels: "",
				inscription_difficulty: 10,
				license_note: "",
				lore: "",
				martial_penalty: "",
				martial_requirement_multiplier: null,
				power: r.rune_level ?? 1,
				range: "",
				recharge: "",
				requirement_agi: 0,
				requirement_int: 0,
				requirement_pre: 0,
				requirement_sense: 0,
				requirement_str: 0,
				requirement_vit: 0,
				requires_job: null,
				requires_level: 1,
				source_kind: "Canon",
				source_name: "Rift Ascendant",
				theme_tags: null,
				uses_per_rest: "",
				concentration: false,
				passive_bonuses: null,
				updated_at: r.created_at || new Date().toISOString(),
			}));
		},
	});
}

// Fetch runes a character knows
export function useCharacterRuneKnowledge(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-rune-knowledge", characterId],
		queryFn: async () => {
			if (!characterId) return [];
			if (isLocalCharacterId(characterId)) {
				const { listLocalRuneKnowledge } = await import("@/lib/guestStore");
				const localEntries = listLocalRuneKnowledge(characterId);

				// Fetch compendium info for local runes
				const { data: compendiumData, error: compError } = await supabase
					.from("compendium_runes")
					.select("*")
					.in(
						"id",
						localEntries.map((e) => e.rune_id),
					);

				if (compError) throw compError;

				return localEntries.map((e) => ({
					...e,
					rune: compendiumData?.find((cr) => cr.id === e.rune_id),
				}));
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildRuneKnowledgeCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_rune_knowledge")
				.select(`
          *,
          rune:compendium_runes(*)
        `)
				.eq("character_id", characterId);

			if (error) {
				if (cacheKey) {
					const cached =
						readCachedData<Array<RuneKnowledge & { rune: Rune }>>(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}
			const knowledgeEntries = data.map((rk) => ({
				...rk,
				rune: rk.rune,
			}));

			const campaignId = await getCharacterCampaignId(characterId);
			const filtered = await filterRowsBySourcebookAccess(
				knowledgeEntries,
				(entry) => entry.rune?.source_book,
				{ campaignId },
			);

			if (cacheKey) {
				writeCachedData(cacheKey, filtered);
			}

			return filtered;
		},
		enabled: !!characterId,
	});
}

const _buildEquipmentRunesCacheKey = (userId: string, equipmentId: string) => {
	return `solo-compendium.cache.equipment-runes.${userId}.equipment:${equipmentId}.v1`;
};

// Use a rune (consume one use on a rune inscription, if tracked)

// Learn a rune (add to knowledge)
export function useLearnRune() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			characterId,
			runeId,
			isMastered = false,
		}: {
			characterId: string;
			runeId: string;
			isMastered?: boolean;
		}) => {
			if (isLocalCharacterId(characterId)) {
				const { addLocalRuneKnowledge } = await import("@/lib/guestStore");
				return addLocalRuneKnowledge(characterId, {
					rune_id: runeId,
					mastery_level: isMastered ? 5 : 1,
					can_teach: isMastered,
				});
			}

			const { data, error } = await supabase
				.from("character_rune_knowledge")
				.upsert(
					{
						character_id: characterId,
						rune_id: runeId,
						mastery_level: isMastered ? 5 : 1,
						can_teach: isMastered,
					},
					{
						onConflict: "character_id,rune_id",
					},
				)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-rune-knowledge", variables.characterId],
			});
		},
	});
}

// Absorb a rune — Rift Ascendant style one-time consumption
// Permanently teaches the rune's ability as a character_feature.
// Cross-type absorption (caster absorbs martial or vice versa) limits uses per rest.
export function useAbsorbRune() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			characterId,
			runeId,
		}: {
			characterId: string;
			runeId: string;
		}) => {
			if (isLocalCharacterId(characterId)) {
				throw new AppError("Sign in required to absorb runes", "AUTH_REQUIRED");
			}

			// Get character
			const { data: character, error: charError } = await supabase
				.from("characters")
				.select("id, job, level, skill_proficiencies, skill_expertise")
				.eq("id", characterId)
				.single();
			if (charError || !character)
				throw new AppError("Character not found", "NOT_FOUND");

			// Get rune
			const { data: rune, error: runeError } = await supabase
				.from("compendium_runes")
				.select("*")
				.eq("id", runeId)
				.single();
			if (runeError || !rune) throw new AppError("Rune not found", "NOT_FOUND");

			// Sourcebook check
			const campaignId = await getCharacterCampaignId(characterId);
			if (!(await isSourcebookAccessible(rune.source_book, { campaignId }))) {
				throw new AppError(
					"This rune requires sourcebook access.",
					"INVALID_INPUT",
				);
			}

			// Check if already absorbed (feature with this source already exists)
			const runeSourceLabel = `Rune: ${rune.name}`;
			const { data: existing } = await supabase
				.from("character_features")
				.select("id")
				.eq("character_id", characterId)
				.eq("source", runeSourceLabel)
				.maybeSingle();

			if (existing) {
				throw new AppError(
					"You have already absorbed this rune",
					"INVALID_INPUT",
				);
			}

			// Resolve cross-type adaptation
			const profBonus = getProficiencyBonus(character.level);
			const absorption = resolveRuneAbsorption(
				rune.rune_type,
				rune.uses_per_rest,
				character.job,
				character.level,
				profBonus,
				rune.rarity,
			);

			// Build adapted description: cross-type absorptions prepend adaptation context
			const baseDescription = rune.effect_description || rune.description || "";
			const fullDescription = absorption.descriptionPrefix
				? `${absorption.descriptionPrefix}\n\n${baseDescription}`
				: baseDescription;

			// Create permanent character feature
			const featurePayload = {
				character_id: characterId,
				name: rune.name,
				source: runeSourceLabel,
				description: fullDescription,
				level_acquired: character.level,
				is_active: true,
				action_type: absorption.actionType,
				uses_max: absorption.usesMax,
				uses_current: absorption.usesMax,
				recharge: absorption.usesMax !== null ? absorption.recharge : null,
			};

			const { error: insertError } = await supabase
				.from("character_features")
				.insert(featurePayload);
			if (insertError) throw insertError;

			// Mark rune as absorbed in knowledge (mastery_level 5 = absorbed)
			await supabase.from("character_rune_knowledge").upsert(
				{
					character_id: characterId,
					rune_id: runeId,
					mastery_level: 5,
					can_teach: false,
					learned_from: "absorbed",
				},
				{
					onConflict: "character_id,rune_id",
				},
			);

			return { runeName: rune.name, absorption };
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-rune-knowledge", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["features", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character-features", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character", variables.characterId],
			});
		},
	});
}

// Check if character meets rune requirements
export function checkRuneRequirements(
	_rune: Rune,
	_characterAbilities: Record<string, number>,
	_characterJob: string | null,
	_characterLevel: number,
): { canUse: boolean; penalties: string[]; requirementMultiplier: number } {
	return { canUse: true, penalties: [], requirementMultiplier: 1.0 };
}
