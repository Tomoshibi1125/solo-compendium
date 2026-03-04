import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { isLocalCharacterId } from "@/lib/guestStore";
import {
	calculateRuneMaxUses,
	resolveRuneAbsorption,
} from "@/lib/runeAutomation";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";
import { getProficiencyBonus } from "@/types/system-rules";

type Rune = Database["public"]["Tables"]["compendium_runes"]["Row"];
type RuneInscription =
	Database["public"]["Tables"]["character_rune_inscriptions"]["Row"];
type RuneKnowledge =
	Database["public"]["Tables"]["character_rune_knowledge"]["Row"];
type Equipment = Database["public"]["Tables"]["character_equipment"]["Row"];

const buildRuneKnowledgeCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.rune-knowledge.${userId}.character:${characterId}.v1`;
};

const buildRuneInscriptionsCacheKey = (userId: string, characterId: string) => {
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
				const runes = data as Rune[];
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
				rarity: r.rarity ?? "common",
				source_book: r.source_book ?? "System Ascendant Canon",
				created_at: r.created_at,
				tags: r.tags ?? null,
				image_url: r.image_url ?? null,
			})) as unknown as Rune[];
		},
	});
}

// Fetch runes a character knows
export function useCharacterRuneKnowledge(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-rune-knowledge", characterId],
		queryFn: async () => {
			if (!characterId) return [];
			if (isLocalCharacterId(characterId)) return [];

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
				rune: rk.rune as Rune,
			})) as Array<RuneKnowledge & { rune: Rune }>;

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

// Fetch runes inscribed on character equipment
export function useCharacterRuneInscriptions(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-rune-inscriptions", characterId],
		queryFn: async () => {
			if (!characterId) return [];
			if (isLocalCharacterId(characterId)) return [];

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildRuneInscriptionsCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_rune_inscriptions")
				.select(`
          *,
          rune:compendium_runes(*),
          equipment:character_equipment(*)
        `)
				.eq("character_id", characterId)
				.eq("is_active", true);

			if (error) {
				if (cacheKey) {
					const cached =
						readCachedData<
							Array<RuneInscription & { rune: Rune; equipment: Equipment }>
						>(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}
			const inscriptions = data.map((ri) => ({
				...ri,
				rune: ri.rune as Rune,
				equipment: ri.equipment as Equipment,
			})) as Array<RuneInscription & { rune: Rune; equipment: Equipment }>;

			const campaignId = await getCharacterCampaignId(characterId);
			const filtered = await filterRowsBySourcebookAccess(
				inscriptions,
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

const buildEquipmentRunesCacheKey = (userId: string, equipmentId: string) => {
	return `solo-compendium.cache.equipment-runes.${userId}.equipment:${equipmentId}.v1`;
};

// Fetch runes on specific equipment
export function useEquipmentRunes(
	equipmentId: string | undefined,
	characterId?: string,
) {
	const authQuery = useQuery({
		queryKey: ["auth-user"],
		queryFn: async () => {
			const { data } = await supabase.auth.getUser();
			return data;
		},
	});
	const user = authQuery.data?.user;

	return useQuery({
		queryKey: ["equipment-runes", equipmentId, characterId ?? "none"],
		queryFn: async () => {
			if (!equipmentId) return [];
			if (equipmentId.startsWith("local_")) return [];

			const cacheKey = user?.id
				? buildEquipmentRunesCacheKey(user.id, equipmentId)
				: null;

			const { data, error } = await supabase
				.from("character_rune_inscriptions")
				.select(`
          *,
          rune:compendium_runes(*)
        `)
				.eq("equipment_id", equipmentId)
				.eq("is_active", true);

			if (error) {
				if (cacheKey) {
					const cached =
						readCachedData<Array<RuneInscription & { rune: Rune }>>(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}
			const equipmentRunes = data.map((ri) => ({
				...ri,
				rune: ri.rune as Rune,
			})) as Array<RuneInscription & { rune: Rune }>;

			const resolvedCharacterId =
				characterId || equipmentRunes[0]?.character_id || null;
			const campaignId = resolvedCharacterId
				? await getCharacterCampaignId(resolvedCharacterId)
				: null;
			const filtered = await filterRowsBySourcebookAccess(
				equipmentRunes,
				(entry) => entry.rune?.source_book,
				{ campaignId },
			);

			if (cacheKey) {
				writeCachedData(cacheKey, filtered);
			}

			return filtered;
		},
		enabled: !!equipmentId,
	});
}

// Inscribe a rune on equipment
export function useInscribeRune() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			characterId,
			equipmentId,
			runeId,
			inscribedBy,
			characterLevel,
		}: {
			characterId: string;
			equipmentId: string;
			runeId: string;
			inscribedBy?: string;
			characterLevel: number;
		}) => {
			if (isLocalCharacterId(characterId)) {
				throw new AppError(
					"Sign in required to inscribe runes",
					"AUTH_REQUIRED",
				);
			}

			// Get rune to check inscription difficulty
			const { data: rune, error: runeError } = await supabase
				.from("compendium_runes")
				.select("*")
				.eq("id", runeId)
				.single();

			if (runeError || !rune)
				throw new AppError("Rune not found", "NOT_FOUND", runeError);

			const campaignId = await getCharacterCampaignId(characterId);
			if (!(await isSourcebookAccessible(rune.source_book, { campaignId }))) {
				throw new AppError(
					"This rune requires sourcebook access.",
					"INVALID_INPUT",
				);
			}

			// Calculate max uses
			const proficiencyBonus = getProficiencyBonus(characterLevel);
			const maxUses = calculateRuneMaxUses(
				rune.uses_per_rest,
				characterLevel,
				proficiencyBonus,
			);
			const initialUses = maxUses === -1 ? 0 : maxUses;

			const { data, error } = await supabase
				.from("character_rune_inscriptions")
				.insert({
					character_id: characterId,
					equipment_id: equipmentId,
					rune_id: runeId,
					inscribed_by: inscribedBy || "Self",
					inscription_quality: 10, // Default quality, can be enhanced with skill checks
					uses_max: maxUses === -1 ? null : maxUses,
					uses_current: initialUses,
				})
				.select()
				.single();

			if (error) throw error;

			// Add to character knowledge if not already known
			await supabase.from("character_rune_knowledge").upsert(
				{
					character_id: characterId,
					rune_id: runeId,
					learned_from: "inscribed",
				},
				{
					onConflict: "character_id,rune_id",
				},
			);

			return data;
		},
		onSuccess: async (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-rune-inscriptions", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["equipment-runes", variables.equipmentId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character-rune-knowledge", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["equipment", variables.characterId],
			});
			// D&D Beyond parity: rune bonuses affect AC/speed/abilities — auto-recalc
			queryClient.invalidateQueries({
				queryKey: ["character", variables.characterId],
			});
		},
	});
}

// Remove rune inscription
export function useRemoveRuneInscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ inscriptionId }: { inscriptionId: string }) => {
			if (inscriptionId.startsWith("local_")) {
				throw new AppError(
					"Sign in required to remove rune inscriptions",
					"AUTH_REQUIRED",
				);
			}

			const { error } = await supabase
				.from("character_rune_inscriptions")
				.delete()
				.eq("id", inscriptionId);

			if (error) throw error;
		},
		onSuccess: async (_result, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-rune-inscriptions"],
			});
			queryClient.invalidateQueries({ queryKey: ["equipment-runes"] });
			// D&D Beyond parity: removing rune recalculates stats
			// Note: inscriptionId doesn't carry characterId, so we do a broad invalidation
			// The character query will re-fetch and the sheet will recalculate
		},
	});
}

// Toggle rune active status
export function useToggleRuneActive() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			inscriptionId,
			isActive,
		}: {
			inscriptionId: string;
			isActive: boolean;
		}) => {
			if (inscriptionId.startsWith("local_")) {
				throw new AppError(
					"Sign in required to toggle rune inscriptions",
					"AUTH_REQUIRED",
				);
			}

			const { error } = await supabase
				.from("character_rune_inscriptions")
				.update({ is_active: isActive })
				.eq("id", inscriptionId);

			if (error) throw error;
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({
				queryKey: ["character-rune-inscriptions"],
			});
			queryClient.invalidateQueries({ queryKey: ["equipment-runes"] });
			// D&D Beyond parity: toggling rune active status changes passive bonuses
			// The character sheet will recalculate from invalidated queries
		},
	});
}

// Use a rune (consume one use on a rune inscription, if tracked)
export function useUseRune() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ inscriptionId }: { inscriptionId: string }) => {
			if (inscriptionId.startsWith("local_")) {
				throw new AppError(
					"Sign in required to use rune inscriptions",
					"AUTH_REQUIRED",
				);
			}

			const { data: inscription, error } = await supabase
				.from("character_rune_inscriptions")
				.select("id, character_id, uses_current, uses_max, times_used")
				.eq("id", inscriptionId)
				.single();

			if (error) throw error;
			if (!inscription)
				throw new AppError("Rune inscription not found", "NOT_FOUND");

			const timesUsed = (inscription.times_used || 0) + 1;

			// If uses are not tracked (null max), treat as unlimited and just increment times_used
			if (inscription.uses_max === null) {
				const { error: updateError } = await supabase
					.from("character_rune_inscriptions")
					.update({ times_used: timesUsed })
					.eq("id", inscriptionId);

				if (updateError) throw updateError;
				return {
					characterId: inscription.character_id,
					usesCurrent: inscription.uses_current,
					usesMax: inscription.uses_max,
				};
			}

			const currentUses = inscription.uses_current ?? inscription.uses_max ?? 0;
			if (currentUses <= 0) {
				throw new AppError("No uses remaining", "INVALID_INPUT");
			}

			const newUses = Math.max(0, currentUses - 1);

			const { error: updateError } = await supabase
				.from("character_rune_inscriptions")
				.update({ uses_current: newUses, times_used: timesUsed })
				.eq("id", inscriptionId);

			if (updateError) throw updateError;
			return {
				characterId: inscription.character_id,
				usesCurrent: newUses,
				usesMax: inscription.uses_max,
			};
		},
		onSuccess: (_data, _variables) => {
			// Invalidate broad queries (we don't always have equipmentId available here)
			queryClient.invalidateQueries({
				queryKey: ["character-rune-inscriptions"],
			});
			queryClient.invalidateQueries({ queryKey: ["equipment-runes"] });
			// Note: characterId-scoped invalidation is handled by the broad invalidation above.
		},
	});
}

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

// Absorb a rune — System Ascendant style one-time consumption
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
				.select("id, job, level")
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
				.insert(featurePayload as never);
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
		},
	});
}

// Check if character meets rune requirements
export function checkRuneRequirements(
	rune: Rune,
	characterAbilities: Record<string, number>,
	characterJob: string | null,
	characterLevel: number,
): { canUse: boolean; penalties: string[]; requirementMultiplier: number } {
	const penalties: string[] = [];
	let requirementMultiplier = 1.0;

	// Check level requirement
	if (characterLevel < (rune.requires_level || 0)) {
		return {
			canUse: false,
			penalties: [`Requires level ${rune.requires_level}`],
			requirementMultiplier: 1.0,
		};
	}

	// Check if job is natural user
	const isNaturalUser =
		rune.requires_job?.includes(characterJob || "") || false;

	// Determine if cross-learning penalty applies
	const isCaster = [
		"Mage",
		"Esper",
		"Herald",
		"Revenant",
		"Contractor",
		"Technomancer",
		"Resonant",
		"Summoner",
	].includes(characterJob || "");
	const isMartial = !isCaster && characterJob !== null;

	if (!isNaturalUser) {
		if (isCaster && rune.rune_type === "martial") {
			requirementMultiplier = Number(rune.caster_requirement_multiplier || 1.5);
			if (rune.caster_penalty) penalties.push(rune.caster_penalty);
		} else if (isMartial && rune.rune_type === "caster") {
			requirementMultiplier = Number(
				rune.martial_requirement_multiplier || 1.5,
			);
			if (rune.martial_penalty) penalties.push(rune.martial_penalty);
		}
	}

	// Check ability score requirements
	const requirements = [
		{ ability: "STR", score: rune.requirement_str || 0 },
		{ ability: "AGI", score: rune.requirement_agi || 0 },
		{ ability: "VIT", score: rune.requirement_vit || 0 },
		{ ability: "INT", score: rune.requirement_int || 0 },
		{ ability: "SENSE", score: rune.requirement_sense || 0 },
		{ ability: "PRE", score: rune.requirement_pre || 0 },
	];

	for (const req of requirements) {
		if (req.score > 0) {
			const requiredScore = Math.ceil(req.score * requirementMultiplier);
			const actualScore = characterAbilities[req.ability] || 0;

			if (actualScore < requiredScore) {
				return {
					canUse: false,
					penalties: [
						`Requires ${req.ability} ${requiredScore} (have ${actualScore})`,
					],
					requirementMultiplier,
				};
			}
		}
	}

	return { canUse: true, penalties, requirementMultiplier };
}
