import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { isLocalCharacterId } from "@/lib/guestStore";
import { resolveRuneAbsorption } from "@/lib/runeAutomation";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";
import { getProficiencyBonus } from "@/types/core-rules";

async function loadCanonicalRunes(campaignId?: string | null): Promise<Rune[]> {
	const entries = await listCanonicalEntries("runes", undefined, {
		campaignId,
	});
	return entries as unknown as Rune[];
}

async function hydrateRunesById(
	ids: string[],
	campaignId?: string | null,
): Promise<Map<string, Rune>> {
	if (ids.length === 0) return new Map();
	const runes = await loadCanonicalRunes(campaignId);
	const byId = new Map<string, Rune>();
	for (const rune of runes) {
		if (ids.includes(rune.id)) byId.set(rune.id, rune);
	}
	return byId;
}

type Rune = Database["public"]["Tables"]["compendium_runes"]["Row"];
type _RuneInscription =
	Database["public"]["Tables"]["character_rune_inscriptions"]["Row"] & {
		rune?: Rune;
		equipment?: EquipmentRow;
	};
export type RuneKnowledge =
	Database["public"]["Tables"]["character_rune_knowledge"]["Row"];
type EquipmentRow = Database["public"]["Tables"]["character_equipment"]["Row"];

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
			const campaignId = characterId
				? await getCharacterCampaignId(characterId)
				: null;
			const runes = await loadCanonicalRunes(campaignId);
			return runes.slice().sort((a, b) => {
				const aLvl = a.rune_level ?? 0;
				const bLvl = b.rune_level ?? 0;
				if (aLvl !== bLvl) return aLvl - bLvl;
				return a.name.localeCompare(b.name);
			});
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
				const byId = await hydrateRunesById(localEntries.map((e) => e.rune_id));
				return localEntries.map((e) => ({
					...e,
					rune: byId.get(e.rune_id),
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
				.select("*")
				.eq("character_id", characterId);

			if (error) {
				if (cacheKey) {
					const cached =
						readCachedData<Array<RuneKnowledge & { rune: Rune }>>(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}

			const campaignId = await getCharacterCampaignId(characterId);
			const rows = (data || []) as RuneKnowledge[];
			const byId = await hydrateRunesById(
				rows.map((r) => r.rune_id),
				campaignId,
			);
			const knowledgeEntries = rows.map((rk) => ({
				...rk,
				rune: byId.get(rk.rune_id) as Rune,
			}));

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

			// Get rune from canonical static layer
			const campaignId = await getCharacterCampaignId(characterId);
			const runeMap = await hydrateRunesById([runeId], campaignId);
			const rune = runeMap.get(runeId);
			if (!rune) throw new AppError("Rune not found", "NOT_FOUND");

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
function _checkRuneRequirements(
	_rune: Rune,
	_characterAbilities: Record<string, number>,
	_characterJob: string | null,
	_characterLevel: number,
): { canUse: boolean; penalties: string[]; requirementMultiplier: number } {
	return { canUse: true, penalties: [], requirementMultiplier: 1.0 };
}
