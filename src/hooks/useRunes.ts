import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	type CanonicalCastableEntry,
	listCanonicalEntries,
} from "@/lib/canonicalCompendium";
import { getCharacterAbilityAccessContext } from "@/lib/characterAbilityAccess";
import {
	addLocalFeature,
	addLocalPower,
	addLocalRuneKnowledge,
	addLocalSpell,
	addLocalTechnique,
	getLocalCharacterState,
	isLocalCharacterId,
	listLocalFeatures,
	listLocalPowers,
	listLocalRuneKnowledge,
	listLocalSpells,
	listLocalTechniques,
} from "@/lib/guestStore";
import {
	autoLearnRunes,
	buildRuneFeatureModifiers,
	getRunePrimaryStatModifier,
	inferRuneAbilityKind,
	type RuneGrantResolution,
	type RuneTeaches,
	resolveRuneAbsorption,
	resolveRuneGrant,
} from "@/lib/runeAutomation";
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
				return addLocalRuneKnowledge(characterId, {
					rune_id: runeId,
					mastery_level: isMastered ? 5 : 1,
					can_teach: isMastered,
				});
			}

			return autoLearnRunes(
				{ id: characterId, level: 1 },
				[runeId],
				isMastered,
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-rune-knowledge", variables.characterId],
			});
		},
	});
}

type CharacterForRuneAbsorption = {
	id: string;
	job: string | null;
	level: number;
	str: number | null;
	agi: number | null;
	vit: number | null;
	int: number | null;
	sense: number | null;
	pre: number | null;
};

function getRuneAbilitySourceLabel(
	runeSourceLabel: string,
	grant: RuneGrantResolution | null,
): string {
	return grant && !grant.isNative
		? `${runeSourceLabel} (Adapted)`
		: runeSourceLabel;
}

function getRuneGrantedUsesMax(
	absorption: ReturnType<typeof resolveRuneAbsorption>,
	grant: RuneGrantResolution | null,
): number | null {
	if (absorption.isCrossClassAdaptation) return absorption.usesMax;
	if (grant?.isUnderLevel) return 1;
	return null;
}

function getRuneGrantedRecharge(
	absorption: ReturnType<typeof resolveRuneAbsorption>,
	grant: RuneGrantResolution | null,
): string | null {
	if (absorption.isCrossClassAdaptation) return absorption.recharge;
	if (grant?.isUnderLevel) return "long-rest";
	return null;
}

function getCastableRowDescription(
	entry: CanonicalCastableEntry,
	absorption: ReturnType<typeof resolveRuneAbsorption>,
): string | null {
	return absorption.descriptionPrefix
		? `${absorption.descriptionPrefix}\n\n${entry.description ?? ""}`.trim()
		: (entry.description ?? null);
}

function isSameRuneSource(
	source: string | null | undefined,
	runeSource: string,
) {
	return source === runeSource || source === `${runeSource} (Adapted)`;
}

async function ensureRemoteRuneSpellGrant(
	characterId: string,
	runeSourceLabel: string,
	absorption: ReturnType<typeof resolveRuneAbsorption>,
	grant: RuneGrantResolution,
): Promise<void> {
	const spell = grant.abilityEntry as CanonicalCastableEntry;
	const source = getRuneAbilitySourceLabel(runeSourceLabel, grant);
	const { data: existing, error: existingError } = await supabase
		.from("character_spells")
		.select("id")
		.eq("character_id", characterId)
		.eq("spell_id", spell.id)
		.eq("source", source)
		.maybeSingle();
	if (existingError) throw existingError;
	if (existing) return;
	const usesMax = getRuneGrantedUsesMax(absorption, grant);
	const { error } = await supabase.from("character_spells").insert({
		character_id: characterId,
		spell_id: spell.id,
		name: spell.name,
		source,
		spell_level: grant.abilityLevel,
		is_prepared: true,
		is_known: true,
		counts_against_limit: false,
		description: getCastableRowDescription(spell, absorption),
		higher_levels: spell.higher_levels ?? null,
		casting_time: spell.casting_time ?? null,
		range: spell.range ?? null,
		duration: spell.duration ?? null,
		concentration: spell.concentration ?? false,
		ritual: spell.ritual ?? false,
		uses_max: usesMax,
		uses_current: usesMax,
		recharge: getRuneGrantedRecharge(absorption, grant),
	});
	if (error) throw error;
}

async function ensureRemoteRunePowerGrant(
	characterId: string,
	runeSourceLabel: string,
	grant: RuneGrantResolution,
): Promise<void> {
	const power = grant.abilityEntry as CanonicalCastableEntry;
	const source = getRuneAbilitySourceLabel(runeSourceLabel, grant);
	const { data: existing, error: existingError } = await supabase
		.from("character_powers")
		.select("id")
		.eq("character_id", characterId)
		.eq("power_id", power.id)
		.eq("source", source)
		.maybeSingle();
	if (existingError) throw existingError;
	if (existing) return;
	const { error } = await supabase.from("character_powers").insert({
		character_id: characterId,
		power_id: power.id,
		name: power.name,
		source,
		power_level: grant.abilityLevel,
		is_prepared: true,
		is_known: true,
		description: power.description ?? null,
		higher_levels: power.higher_levels ?? null,
		casting_time: power.casting_time ?? null,
		range: power.range ?? null,
		duration: power.duration ?? null,
		concentration: power.concentration ?? false,
	});
	if (error) throw error;
}

async function ensureRemoteRuneTechniqueGrant(
	characterId: string,
	runeSourceLabel: string,
	grant: RuneGrantResolution,
): Promise<void> {
	const techniqueId = grant.abilityEntry.id;
	const source = getRuneAbilitySourceLabel(runeSourceLabel, grant);
	const { data: existing, error: existingError } = await supabase
		.from("character_techniques")
		.select("id")
		.eq("character_id", characterId)
		.eq("technique_id", techniqueId)
		.eq("source", source)
		.maybeSingle();
	if (existingError) throw existingError;
	if (existing) return;
	const { error } = await supabase.from("character_techniques").insert({
		character_id: characterId,
		technique_id: techniqueId,
		source,
	});
	if (error) throw error;
}

async function ensureRemoteRuneAbilityGrant(
	characterId: string,
	runeSourceLabel: string,
	absorption: ReturnType<typeof resolveRuneAbsorption>,
	grant: RuneGrantResolution | null,
): Promise<void> {
	if (!grant) return;
	if (grant.abilityKind === "spell") {
		await ensureRemoteRuneSpellGrant(
			characterId,
			runeSourceLabel,
			absorption,
			grant,
		);
		return;
	}
	if (grant.abilityKind === "power") {
		await ensureRemoteRunePowerGrant(characterId, runeSourceLabel, grant);
		return;
	}
	await ensureRemoteRuneTechniqueGrant(characterId, runeSourceLabel, grant);
}

function ensureLocalRuneAbilityGrant(
	characterId: string,
	runeSourceLabel: string,
	absorption: ReturnType<typeof resolveRuneAbsorption>,
	grant: RuneGrantResolution | null,
): void {
	if (!grant) return;
	const source = getRuneAbilitySourceLabel(runeSourceLabel, grant);
	if (grant.abilityKind === "spell") {
		const spell = grant.abilityEntry as CanonicalCastableEntry;
		if (
			listLocalSpells(characterId).some(
				(row) => row.spell_id === spell.id && row.source === source,
			)
		)
			return;
		const usesMax = getRuneGrantedUsesMax(absorption, grant);
		addLocalSpell(characterId, {
			spell_id: spell.id,
			name: spell.name,
			source,
			spell_level: grant.abilityLevel,
			is_prepared: true,
			is_known: true,
			counts_against_limit: false,
			description: getCastableRowDescription(spell, absorption),
			higher_levels: spell.higher_levels ?? null,
			casting_time: spell.casting_time ?? null,
			range: spell.range ?? null,
			duration: spell.duration ?? null,
			concentration: spell.concentration ?? false,
			ritual: spell.ritual ?? false,
			uses_max: usesMax,
			uses_current: usesMax,
			recharge: getRuneGrantedRecharge(absorption, grant),
		});
		return;
	}
	if (grant.abilityKind === "power") {
		const power = grant.abilityEntry as CanonicalCastableEntry;
		if (
			listLocalPowers(characterId).some(
				(row) => row.power_id === power.id && row.source === source,
			)
		)
			return;
		addLocalPower(characterId, {
			power_id: power.id,
			name: power.name,
			source,
			power_level: grant.abilityLevel,
			is_prepared: true,
			is_known: true,
			description: power.description ?? null,
			higher_levels: power.higher_levels ?? null,
			casting_time: power.casting_time ?? null,
			range: power.range ?? null,
			duration: power.duration ?? null,
			concentration: power.concentration ?? false,
		});
		return;
	}
	if (
		listLocalTechniques(characterId).some(
			(row) =>
				row.technique_id === grant.abilityEntry.id && row.source === source,
		)
	)
		return;
	addLocalTechnique(characterId, {
		technique_id: grant.abilityEntry.id,
		source,
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
			const isLocal = isLocalCharacterId(characterId);
			let character: CharacterForRuneAbsorption | null = null;
			let unlockedRegents: string[] = [];
			if (isLocal) {
				const localState = getLocalCharacterState(characterId);
				if (!localState) throw new AppError("Character not found", "NOT_FOUND");
				const localCharacter =
					localState.character as Partial<CharacterForRuneAbsorption>;
				character = {
					id: characterId,
					job: localCharacter.job ?? null,
					level: localCharacter.level ?? 1,
					str: localCharacter.str ?? 10,
					agi: localCharacter.agi ?? 10,
					vit: localCharacter.vit ?? 10,
					int: localCharacter.int ?? 10,
					sense: localCharacter.sense ?? 10,
					pre: localCharacter.pre ?? 10,
				};
			} else {
				const { data, error: charError } = await supabase
					.from("characters")
					.select("id, job, level, str, agi, vit, int, sense, pre")
					.eq("id", characterId)
					.single();
				if (charError || !data)
					throw new AppError("Character not found", "NOT_FOUND");
				character = data as CharacterForRuneAbsorption;
				const { data: regentRows } = await supabase
					.from("character_regent_unlocks")
					.select("regent_id")
					.eq("character_id", characterId);
				unlockedRegents = (regentRows ?? []).map((row) => row.regent_id);
			}

			const abilityContext =
				await getCharacterAbilityAccessContext(characterId);
			unlockedRegents = Array.from(
				new Set([...unlockedRegents, ...abilityContext.regentNames]),
			);
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

			const runeSourceLabel = `Rune: ${rune.name}`;
			if (isLocal) {
				const existing = listLocalFeatures(characterId).some((feature) =>
					isSameRuneSource(feature.source, runeSourceLabel),
				);
				if (existing) {
					throw new AppError(
						"You have already absorbed this rune",
						"INVALID_INPUT",
					);
				}
			} else {
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
			}

			const profBonus = getProficiencyBonus(character.level);
			const canonicalRune = rune as unknown as {
				teaches?: RuneTeaches;
				rank?: string | null;
			};
			const teaches = canonicalRune.teaches;
			const grant = await resolveRuneGrant(teaches ?? null, abilityContext);
			if (teaches && !grant) {
				throw new AppError(
					"The ability taught by this rune is not available in the canonical catalog or sourcebook access.",
					"INVALID_INPUT",
				);
			}
			const abilityKind =
				grant?.abilityKind ??
				inferRuneAbilityKind({
					teaches: canonicalRune.teaches,
					rank: canonicalRune.rank ?? null,
					tags: rune.tags,
					name: rune.name,
					id: rune.id,
				});
			const primaryStatModifier = getRunePrimaryStatModifier(character.job, {
				STR: character.str ?? 10,
				AGI: character.agi ?? 10,
				VIT: character.vit ?? 10,
				INT: character.int ?? 10,
				SENSE: character.sense ?? 10,
				PRE: character.pre ?? 10,
			});
			const absorption = resolveRuneAbsorption({
				abilityKind,
				usesPerRest: rune.uses_per_rest,
				characterJob: character.job,
				characterLevel: character.level,
				proficiencyBonus: profBonus,
				primaryStatModifier,
				runeRarity: rune.rarity,
				unlockedRegents,
				nativeRecharge: rune.recharge,
				forceCrossClassAdaptation: grant ? !grant.isNative : undefined,
			});

			const baseDescription = rune.effect_description || rune.description || "";
			const fullDescription = absorption.descriptionPrefix
				? `${absorption.descriptionPrefix}\n\n${baseDescription}`
				: baseDescription;
			const featureUsesMax = getRuneGrantedUsesMax(absorption, grant);
			const featureRecharge = getRuneGrantedRecharge(absorption, grant);
			const modifiers = buildRuneFeatureModifiers(
				absorption,
				teaches ?? null,
				grant,
			);
			const featurePayload = {
				name: rune.name,
				source: runeSourceLabel,
				description: fullDescription,
				level_acquired: character.level,
				is_active: true,
				action_type: absorption.actionType,
				uses_max: featureUsesMax,
				uses_current: featureUsesMax,
				recharge: featureRecharge,
				modifiers:
					modifiers as Database["public"]["Tables"]["character_features"]["Insert"]["modifiers"],
			};

			if (isLocal) {
				addLocalFeature(characterId, featurePayload);
				ensureLocalRuneAbilityGrant(
					characterId,
					runeSourceLabel,
					absorption,
					grant,
				);
				addLocalRuneKnowledge(characterId, {
					rune_id: runeId,
					mastery_level: 5,
					can_teach: false,
				});
			} else {
				const { error: insertError } = await supabase
					.from("character_features")
					.insert({ ...featurePayload, character_id: characterId });
				if (insertError) throw insertError;
				await ensureRemoteRuneAbilityGrant(
					characterId,
					runeSourceLabel,
					absorption,
					grant,
				);
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
			}

			return { runeName: rune.name, absorption, grant };
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
			queryClient.invalidateQueries({
				queryKey: ["character-spells", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["powers", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character-techniques", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["spell-slots", variables.characterId],
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
