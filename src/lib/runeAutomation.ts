import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { logger } from "@/lib/logger";
import { type RegentGrantKind, regentGrantsAbility } from "@/lib/regentGrants";
import { type AbilityScore, getAbilityModifier } from "@/types/core-rules";
import {
	jobCanLearnPowers,
	jobCanLearnSpells,
	jobCanLearnTechniques,
} from "./jobAbilityAccess";

export type Rune = Database["public"]["Tables"]["compendium_runes"]["Row"];

/**
 * Automatically learn runes based on character progression
 * Some runes may be learned through features or as rewards
 */
export async function autoLearnRunes(
	character: { id: string; level: number; job?: string | null },
	runeIds?: string[],
	isMastered: boolean = false,
): Promise<string[]> {
	if (!runeIds && character) {
		// Logic to determine runes based on character level/job
		console.log(
			`[Warden] Calculating auto-learned runes for Level ${character.level} ${String(character.job)}`,
		);
		return [];
	}
	const targetIds = runeIds || [];
	const characterId = character.id;
	try {
		for (const runeId of targetIds) {
			await supabase.from("character_rune_knowledge").upsert(
				{
					character_id: characterId,
					rune_id: runeId,
					mastery_level: isMastered ? 5 : 1,
					can_teach: isMastered,
				},
				{
					onConflict: "character_id,rune_id",
				},
			);
		}
		return targetIds;
	} catch (error) {
		logger.error("Failed to auto-learn runes:", error);
		throw error;
	}
}

// ---------------------------------------------------------------------------
// Rift Ascendant Rune Absorption — cross-type resolution
// ---------------------------------------------------------------------------

export const FULL_CASTERS = [
	"Mage",
	"Esper",
	"Herald",
	"Revenant",
	"Contractor",
	"Technomancer",
	"Summoner",
	"Idol",
];
export const HALF_CASTERS = ["Holy Knight", "Stalker"];
export const MARTIAL_JOBS = ["Assassin", "Berserker", "Destroyer", "Striker"];

export type RuneRecharge =
	| "at-will"
	| "short-rest"
	| "long-rest"
	| "once-per-day";

export type RuneAbsorptionResult = {
	/** True if the character's archetype doesn't match the rune type */
	isCrossType: boolean;
	/** Recharge cadence for the learned ability */
	recharge: RuneRecharge;
	/** Max uses per rest period (null = unlimited / at-will) */
	usesMax: number | null;
	/** Description of how the ability was adapted */
	adaptationNote: string;
	/** Action type for the learned ability */
	actionType: "action" | "bonus-action" | "reaction" | "passive";
	/** Prefix to prepend to the ability description when cross-type */
	descriptionPrefix: string;
	abilityKind: RegentGrantKind;
	isNativeViaJob: boolean;
	isNativeViaRegent: boolean;
	isCrossClassAdaptation: boolean;
};

export type RuneAbsorptionInput = {
	abilityKind: RegentGrantKind;
	usesPerRest?: string | null;
	characterJob?: string | null;
	characterLevel: number;
	proficiencyBonus: number;
	primaryStatModifier?: number;
	runeRarity?: string | null;
	unlockedRegents?: Array<string | null | undefined>;
	nativeRecharge?: string | null;
	regentFrequency?: string | null;
};

export type RuneAbilityScores = Partial<Record<AbilityScore, number>>;

/**
 * Canonical Cross-Class Adaptation description used in every rune entry.
 * Mirrors the locked formula in `resolveRuneAbsorptionFromInput`:
 *   uses_per_rest = max(1, proficiency_bonus + primary_stat_modifier + rune_rarity_bonus)
 */
export const RUNE_CROSS_CLASS_DESCRIPTION =
	"Cross-Class Adaptation: If the learned ability is outside your native access (Job or unlocked Regent), uses per long rest = max(1, proficiency bonus + primary stat modifier + rune rarity bonus). Native-access abilities follow their normal recharge.";

const PRIMARY_ABILITIES_BY_JOB: Record<string, AbilityScore[]> = {
	assassin: ["AGI", "STR"],
	berserker: ["STR", "VIT"],
	contractor: ["PRE", "INT"],
	destroyer: ["STR", "VIT"],
	esper: ["SENSE", "PRE"],
	herald: ["PRE", "SENSE"],
	"holy knight": ["STR", "PRE"],
	idol: ["PRE", "SENSE"],
	mage: ["INT", "SENSE"],
	revenant: ["PRE", "VIT"],
	stalker: ["AGI", "SENSE"],
	striker: ["STR", "AGI"],
	summoner: ["SENSE", "INT"],
	technomancer: ["INT", "AGI"],
};

export function getRunePrimaryStatModifier(
	jobName: string | null | undefined,
	abilities: RuneAbilityScores,
): number {
	const job = (jobName ?? "").trim().toLowerCase();
	const candidates = PRIMARY_ABILITIES_BY_JOB[job] ?? [
		"STR",
		"AGI",
		"VIT",
		"INT",
		"SENSE",
		"PRE",
	];
	return Math.max(
		...candidates.map((ability) =>
			getAbilityModifier(abilities[ability] ?? 10),
		),
	);
}

export function getRuneRarityBonus(rarity: string | null | undefined): number {
	switch ((rarity || "uncommon").toLowerCase()) {
		case "rare":
			return 1;
		case "very_rare":
		case "very rare":
			return 2;
		case "legendary":
			return 3;
		default:
			return 0;
	}
}

function normalizeRuneRecharge(
	value: string | null | undefined,
	fallback: RuneRecharge,
): RuneRecharge {
	const normalized = (value ?? "").trim().toLowerCase().replace(/\s+/g, "-");
	if (!normalized) return fallback;
	if (normalized.includes("at-will")) return "at-will";
	if (normalized.includes("short")) return "short-rest";
	if (normalized.includes("long")) return "long-rest";
	if (normalized.includes("once-per-day") || normalized.includes("daily")) {
		return "once-per-day";
	}
	return fallback;
}

function jobGrantsAbility(
	jobName: string | null | undefined,
	abilityKind: RegentGrantKind,
): boolean {
	if (abilityKind === "spell") return jobCanLearnSpells(jobName);
	if (abilityKind === "power") return jobCanLearnPowers(jobName);
	return jobCanLearnTechniques(jobName);
}

function inferLegacyAbilityKind(runeType: string | null): RegentGrantKind {
	const normalized = (runeType ?? "").trim().toLowerCase();
	if (normalized === "caster" || normalized === "spell") return "spell";
	if (normalized === "power") return "power";
	return "technique";
}

export function inferRuneAbilityKind(rune: {
	teaches?: { kind?: string | null } | null;
	rank?: string | null;
	tags?: string[] | null;
	name?: string | null;
	id?: string | null;
}): RegentGrantKind {
	if (rune.teaches?.kind === "spell") return "spell";
	if (rune.teaches?.kind === "power") return "power";
	if (rune.teaches?.kind === "technique") return "technique";
	const text = [rune.rank, rune.id, rune.name, ...(rune.tags ?? [])]
		.filter((value): value is string => typeof value === "string")
		.join(" ")
		.toLowerCase();
	if (text.includes("power")) return "power";
	if (text.includes("technique")) return "technique";
	return "spell";
}

export function buildRuneFeatureModifiers(
	absorption: RuneAbsorptionResult,
	teaches?: { kind: "spell" | "power" | "technique"; ref: string } | null,
): Record<string, boolean | string | Record<string, string> | null> {
	return {
		acquired_via: "rune",
		ability_kind: absorption.abilityKind,
		is_cross_class_adaptation: absorption.isCrossClassAdaptation,
		is_native_via_job: absorption.isNativeViaJob,
		is_native_via_regent: absorption.isNativeViaRegent,
		teaches: teaches ?? null,
	};
}

function resolveRuneAbsorptionFromInput(
	input: RuneAbsorptionInput,
): RuneAbsorptionResult {
	const isNativeViaJob = jobGrantsAbility(
		input.characterJob,
		input.abilityKind,
	);
	const regentMatch = (input.unlockedRegents ?? []).find((regent) =>
		regentGrantsAbility(regent, input.abilityKind),
	);
	const isNativeViaRegent = Boolean(regentMatch);
	const isCrossClassAdaptation = !isNativeViaJob && !isNativeViaRegent;

	if (isCrossClassAdaptation) {
		const usesMax = Math.max(
			1,
			input.proficiencyBonus +
				(input.primaryStatModifier ?? 0) +
				getRuneRarityBonus(input.runeRarity),
		);
		const descriptionPrefix = `[Cross-Class Adaptation] Uses per rest = proficiency bonus + primary stat modifier + rune rarity bonus (${usesMax} uses per Long Rest).`;

		return {
			isCrossType: true,
			recharge: "long-rest",
			usesMax,
			adaptationNote: `Cross-class adaptation: ${input.abilityKind} rune (${usesMax} uses).`,
			actionType: "action",
			descriptionPrefix,
			abilityKind: input.abilityKind,
			isNativeViaJob,
			isNativeViaRegent,
			isCrossClassAdaptation,
		};
	}

	const nativeUsesBase = calculateRuneMaxUses(
		input.usesPerRest,
		input.characterLevel,
		input.proficiencyBonus,
	);
	const usesMax = nativeUsesBase === -1 ? null : nativeUsesBase;
	const recharge =
		isNativeViaRegent && !isNativeViaJob
			? normalizeRuneRecharge(input.regentFrequency, "long-rest")
			: normalizeRuneRecharge(
					input.nativeRecharge ?? input.usesPerRest,
					"long-rest",
				);

	return {
		isCrossType: false,
		recharge: usesMax === null ? "at-will" : recharge,
		usesMax,
		adaptationNote:
			usesMax === null
				? "Native absorption: at-will"
				: `Native absorption: ${usesMax} uses per ${recharge}`,
		actionType: "action",
		descriptionPrefix: "",
		abilityKind: input.abilityKind,
		isNativeViaJob,
		isNativeViaRegent,
		isCrossClassAdaptation,
	};
}

export function resolveRuneAbsorption(
	input: RuneAbsorptionInput,
): RuneAbsorptionResult;
export function resolveRuneAbsorption(
	runeType: string | null,
	runeUsesPerRest: string | null | undefined,
	characterJob: string | null,
	characterLevel: number,
	proficiencyBonus: number,
	runeRarity?: string | null,
): RuneAbsorptionResult;
export function resolveRuneAbsorption(
	inputOrRuneType: RuneAbsorptionInput | string | null,
	runeUsesPerRest?: string | null,
	characterJob?: string | null,
	characterLevel?: number,
	proficiencyBonus?: number,
	runeRarity?: string | null,
): RuneAbsorptionResult {
	if (typeof inputOrRuneType === "object" && inputOrRuneType !== null) {
		return resolveRuneAbsorptionFromInput(inputOrRuneType);
	}
	return resolveRuneAbsorptionFromInput({
		abilityKind: inferLegacyAbilityKind(inputOrRuneType),
		usesPerRest: runeUsesPerRest,
		characterJob,
		characterLevel: characterLevel ?? 1,
		proficiencyBonus: proficiencyBonus ?? 2,
		runeRarity,
	});
}

/**
 * Calculate max uses from uses_per_rest string
 * Examples: 'at-will', '1', '2', 'proficiency bonus', 'level', 'proficiency bonus + level'
 */
function calculateRuneMaxUses(
	usesPerRest: string | null | undefined,
	characterLevel: number,
	proficiencyBonus: number,
): number {
	if (!usesPerRest || usesPerRest === "at-will") {
		return -1; // -1 indicates unlimited uses
	}

	// Handle numeric strings
	const numericMatch = usesPerRest.match(/^(\d+)$/);
	if (numericMatch) {
		return parseInt(numericMatch[1], 10);
	}

	// Handle proficiency bonus
	if (
		usesPerRest.toLowerCase().includes("proficiency") ||
		usesPerRest.toLowerCase().includes("prof")
	) {
		if (usesPerRest.toLowerCase().includes("+")) {
			// Extract additional number if present (e.g., "proficiency bonus + 2")
			const additionalMatch = usesPerRest.match(/\+?\s*(\d+)/);
			const additional = additionalMatch ? parseInt(additionalMatch[1], 10) : 0;
			return proficiencyBonus + additional;
		}
		return proficiencyBonus;
	}

	// Handle level
	if (usesPerRest.toLowerCase().includes("level")) {
		if (usesPerRest.toLowerCase().includes("+")) {
			// Extract additional number if present (e.g., "level + 1")
			const additionalMatch = usesPerRest.match(/\+?\s*(\d+)/);
			const additional = additionalMatch ? parseInt(additionalMatch[1], 10) : 0;
			return characterLevel + additional;
		}
		return characterLevel;
	}

	// Default to 1 if we can't parse
	return 1;
}
