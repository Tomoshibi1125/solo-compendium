/**
 * Centralized Character Calculation Engine
 *
 * SINGLE SOURCE OF TRUTH for all derived character stats.
 * Uses Rift Ascendant mechanics.
 *
 * Philosophy:
 * - Pure functions: input base data, output computed stats
 * - No database access, no side effects, no async operations
 * - All derived stats computed on-demand, NEVER stored in database
 * - Deterministic: same input = same output, always
 * - Effect resolution with priority ordering and conflict resolution
 *
 * Rift Ascendant Terminology:
 * - "Jobs" = D&D Classes (Destroyer, Mage, Esper, Herald, etc.)
 * - "Paths" = D&D Subclasses
 * - "Powers" = D&D Spells
 * - "Relics" = D&D Magic Items
 * - Abilities: STR, AGI (AGI), VIT (VIT), INT, SENSE (SENSE), PRE (PRE)
 */

import type { Json } from "@/integrations/supabase/types";
import type { AbilityScore } from "./5eRulesEngine";
import { getAbilityModifier } from "./5eRulesEngine";
import {
	calculateCarryingCapacity,
	type EncumbranceTier,
	encumbranceTierForWeight,
} from "./encumbrance";
// Effect types (inlined from effectsEngine.ts — that module is now deleted)
export type EffectType =
	| "modifier" // Modifies a stat (AC, speed, ability, etc.)
	| "resource" // Modifies a resource (HP max, slots, uses, etc.)
	| "validation" // Validates prerequisites/requirements
	| "roll_tag"; // Adds roll tags (advantage, disadvantage, rerolls)

export type EffectTarget =
	| "ac"
	| "speed"
	| "fly_speed"
	| "initiative"
	| "str"
	| "agi"
	| "vit"
	| "int"
	| "sense"
	| "pre"
	| "attack_bonus"
	| "damage_bonus"
	| "saving_throw"
	| "skill"
	| "spell_dc"
	| "hp_max"
	| "hp_current"
	| "hp_temp"
	| "hp_regen"
	| "hit_dice_max"
	| "hit_dice_current"
	| "rift_favor_max"
	| "rift_favor_current"
	| "spell_slots"
	| "feature_uses"
	| "advantage"
	| "disadvantage"
	| "reroll"
	| "minimum_roll"
	| "tattoo_attunement"
	| "damage_resistance"
	| "damage_immunity"
	| "damage_vulnerability"
	| "condition_immunity";

export interface Effect {
	type: EffectType;
	target: EffectTarget;
	value: Json;
	condition?: string;
	priority?: number;
}

import { getStaticJobs } from "@/lib/ProtocolDataManager";

// ============================================================================
// INPUT TYPES: Base Character Data (from database/props)
// ============================================================================

/**
 * Equipment instance with effects
 */
export interface EquipmentInstance {
	id: string;
	name: string;
	type: "armor" | "weapon" | "accessory" | "consumable" | "tool" | "other";
	isEquipped: boolean;
	isAttuned?: boolean;
	requiresAttunement?: boolean;
	weight?: number;
	properties?: string[]; // Raw property strings from DB
	acFormula?: string; // e.g., "13 + AGI (max 2)", "18", "10 + AGI"
	effects?: Effect[]; // Parsed effects
	isActive?: boolean;
	ignoreContentsWeight?: boolean;
	isContainer?: boolean;
	containerId?: string | null;
}

/**
 * Tattoo instance (Isolated attunement, Body area mechanic)
 */
export interface TattooInstance {
	id: string;
	name: string;
	isActive: boolean;
	bodyPart: string;
	requiresAttunement: boolean;
	isAttuned: boolean;
	effects?: Effect[];
}

/**
 * Active condition on character
 */
export interface ActiveCondition {
	name: string;
	sourceId?: string;
	sourceName?: string;
	appliedAt: Date;
	expiresAt?: Date;
	// Phase 2 additions: D&D Beyond parity
	concentration?: boolean; // Is this condition maintained by concentration?
	spellId?: string; // Source spell ID (for auto-removal on concentration break)
	duration?: {
		type: "rounds" | "minutes" | "hours" | "indefinite";
		value: number; // Number of rounds/minutes/hours (0 for indefinite)
		remainingRounds?: number; // Countdown for round-based durations
	};
}

/**
 * Feature instance with usage tracking
 */
export interface FeatureInstance {
	id: string;
	name: string;
	sourceType: "job" | "path" | "feat" | "race" | "item" | "awakening" | "trait";
	sourceId: string;
	description?: string;
	usesMax?: number;
	usesCurrent?: number;
	rechargeOn?: "short-rest" | "long-rest" | "dawn" | "none";
	effects?: Effect[];
}

/**
 * Active spell effect (concentration, duration-based)
 */
export interface ActiveSpellEffect {
	spellId: string;
	spellName: string;
	level: number;
	castAt: Date;
	duration?: {
		type: "rounds" | "minutes" | "hours" | "concentration";
		value: number;
	};
	concentration: boolean;
	effects?: Effect[];
}

/**
 * Character job/regent overlay data
 */
export interface CharacterJob {
	job: string; // Rift Ascendant job name (Destroyer, Mage, etc.)
	path?: string; // Rift Ascendant subclass/path name (level 3, automatic)
	regent?: string; // Regent path ID (quest-gated, Warden unlocks)
	gemini?: {
		id?: string;
		sovereignId?: string;
		regent1Id?: string;
		regent1?: { id: string };
		regent2Id?: string;
		regent2?: { id: string };
		features?: Array<{ name: string; description: string; type?: string }>;
		traits?: Array<{ name: string; description: string; type?: string }>;
		statBonuses?: Record<string, number>;
	}; // Full GeminiSovereign AI payload
	level: number;
	hitDie: number; // d6, d8, d10, d12
}

/**
 * Base character data - everything stored in database
 */
export interface CharacterBaseData {
	// Identity
	id: string;
	name: string;
	level: number; // Total character level

	// Jobs (awakening-based)
	jobs: CharacterJob[];

	// Abilities (base scores before modifiers)
	abilities: Record<AbilityScore, number>;

	// Proficiencies
	savingThrowProficiencies: AbilityScore[];
	skillProficiencies: string[]; // skill IDs
	skillExpertise: string[]; // skill IDs with expertise (2x proficiency)
	armorProficiencies?: string[];
	weaponProficiencies?: string[];
	toolProficiencies?: string[];
	languages?: string[];

	// Resources (current values)
	hpCurrent: number;
	hpMax: number; // Base max HP (calculated once at level up)
	hpTemp: number;
	hitDiceCurrent: number;
	hitDiceMax: number;
	riftFavorCurrent: number;

	// Base movement
	baseSpeed: number; // Usually 30

	// Active states
	equippedItems: EquipmentInstance[];
	tattoos: TattooInstance[];
	activeConditions: ActiveCondition[];
	activeSpells: ActiveSpellEffect[];
	features: FeatureInstance[];
	exhaustionLevel: number; // 0-6

	// Spell tracking
	preparedSpells?: string[]; // spell IDs for prepared casters
	knownSpells?: string[]; // spell IDs for known casters
}

// ============================================================================
// OUTPUT TYPES: Computed Stats (never stored in database)
// ============================================================================

// ============================================================================
// EFFECT AGGREGATION
// ============================================================================

/**
 * Aggregate awakening features from jobs compendium
 * These are progressive abilities unlocked at specific levels (1, 3, 5, 7, 11, 14, etc.)
 */
export function aggregateAwakeningFeatures(
	jobs: CharacterJob[],
	_totalLevel: number,
): FeatureInstance[] {
	const features: FeatureInstance[] = [];

	try {
		// Resolved at call time: the registry array is reassigned during
		// initializeProtocolData(), so a module-eval snapshot would stay empty.
		const jobsDatabase = getStaticJobs();
		for (const charJob of jobs) {
			// Find job data from compendium
			const jobData = jobsDatabase.find(
				(j: { id: string }) => j.id === charJob.job.toLowerCase(),
			);
			if (!jobData?.awakening_features) continue;

			// Filter features unlocked at or below current job level
			const unlockedFeatures = jobData.awakening_features.filter(
				(f: { level: number }) => f.level <= charJob.level,
			);

			features.push(
				...unlockedFeatures.map(
					(f: { name: string; description: string; level: number }) => ({
						id: `${charJob.job}-awakening-${f.level}-${f.name.toLowerCase().replace(/\s+/g, "-")}`,
						name: f.name,
						sourceType: "awakening" as const,
						sourceId: charJob.job,
						description: f.description,
						effects: parseAwakeningEffects(f, charJob.level),
					}),
				),
			);
		}
	} catch (error) {
		// Gracefully handle if compendium not available
		console.warn(
			"Could not load awakening features from jobs compendium:",
			error,
		);
	}

	return features;
}

/**
 * Parse awakening feature description into structured effects
 * This analyzes the awakening feature text and extracts mechanical effects
 */
export function parseAwakeningEffects(
	feature: { name: string; description: string; level: number },
	jobLevel: number,
): Effect[] {
	const effects: Effect[] = [];
	const desc = feature.description.toLowerCase();

	// HP bonuses (e.g., "HP maximum increases by 1 per Berserker level")
	if (desc.includes("hp maximum increases") || desc.includes("hp max")) {
		const hpPerLevel = desc.match(/(\d+)\s*per\s*\w+\s*level/i);
		if (hpPerLevel) {
			effects.push({
				type: "resource",
				target: "hp_max",
				value: parseInt(hpPerLevel[1], 10) * jobLevel,
				priority: 150,
			});
		}
	}

	// Damage resistances (e.g., "resistance to poison damage", "resistance to all damage")
	if (desc.includes("resistance to") && desc.includes("damage")) {
		// Track resistance as a roll_tag effect for the character sheet to display
		const resistMatch = desc.match(/resistance to\s+([a-z,\s]+)\s*damage/i);
		if (resistMatch) {
			effects.push({
				type: "roll_tag",
				target: "saving_throw",
				value: `resistance:${resistMatch[1].trim()}`,
				priority: 100,
			});
		}
	}

	// AC bonuses (e.g., "+1 to AC")
	const acBonus = desc.match(/\+(\d+)\s*to\s*ac/i);
	if (acBonus) {
		effects.push({
			type: "modifier",
			target: "ac",
			value: parseInt(acBonus[1], 10),
			priority: 150,
		});
	}

	// Attack/damage bonuses (e.g., "+1 to attack and damage")
	const attackBonus = desc.match(/\+(\d+)\s*to\s*attack/i);
	if (attackBonus) {
		effects.push({
			type: "modifier",
			target: "attack_bonus",
			value: parseInt(attackBonus[1], 10),
			priority: 150,
		});
	}

	// Ability score improvements (e.g., "STR and VIT increase by 4")
	const abilityIncrease = desc.match(
		/(str|agi|vit|int|sense|pre)(?:\s*and\s*(str|agi|vit|int|sense|pre))?\s*increase(?:s)?\s*by\s*(\d+)/i,
	);
	if (abilityIncrease) {
		const ability1 = abilityIncrease[1].toUpperCase() as EffectTarget;
		const ability2 = abilityIncrease[2]?.toUpperCase() as EffectTarget;
		const value = parseInt(abilityIncrease[3], 10);

		effects.push({
			type: "modifier",
			target: ability1,
			value,
			priority: 150,
		});

		if (ability2) {
			effects.push({
				type: "modifier",
				target: ability2,
				value,
				priority: 150,
			});
		}
	}

	// Speed modifiers (e.g., "+10 ft speed")
	const speedBonus = desc.match(/\+(\d+)\s*ft\s*speed/i);
	if (speedBonus) {
		effects.push({
			type: "modifier",
			target: "speed",
			value: parseInt(speedBonus[1], 10),
			priority: 150,
		});
	}

	return effects;
}

/**
 * Aggregate job traits from jobs compendium
 * These are passive/active abilities that are always available
 */
export function aggregateJobTraits(
	jobs: CharacterJob[],
	_totalLevel: number,
): FeatureInstance[] {
	const traits: FeatureInstance[] = [];

	try {
		const jobsDatabase = getStaticJobs();
		for (const charJob of jobs) {
			// Find job data from compendium
			const jobData = jobsDatabase.find(
				(j: { id: string }) => j.id === charJob.job.toLowerCase(),
			);
			if (!jobData?.job_traits) continue;

			// All job traits are available from level 1
			traits.push(
				...jobData.job_traits.map(
					(t: {
						name: string;
						description: string;
						type?: string;
						frequency?: string;
					}) => ({
						id: `${charJob.job}-trait-${t.name.toLowerCase().replace(/\s+/g, "-")}`,
						name: t.name,
						sourceType: "trait" as const,
						sourceId: charJob.job,
						description: t.description,
						rechargeOn: convertFrequencyToRecharge(t.frequency),
						effects: parseJobTraitEffects(t, charJob.level),
					}),
				),
			);
		}
	} catch (error) {
		// Gracefully handle if compendium not available
		console.warn("Could not load job traits from jobs compendium:", error);
	}

	return traits;
}

/**
 * Convert job trait frequency to recharge type
 */
export function convertFrequencyToRecharge(
	frequency?: string,
): "short-rest" | "long-rest" | "dawn" | "none" {
	if (!frequency) return "none";

	const freq = frequency.toLowerCase();
	if (freq.includes("short")) return "short-rest";
	if (freq.includes("long")) return "long-rest";
	if (freq.includes("day") || freq.includes("dawn")) return "dawn";

	return "none";
}

/**
 * Parse job trait description into structured effects
 */
export function parseJobTraitEffects(
	trait: {
		name: string;
		description: string;
		type?: string;
		frequency?: string;
	},
	_jobLevel: number,
): Effect[] {
	const effects: Effect[] = [];
	const desc = trait.description.toLowerCase();

	// Advantage effects (e.g., "Advantage on saves against fear", "Advantage on Stealth")
	if (desc.includes("advantage on")) {
		const advantageMatch = desc.match(
			/advantage on ([a-z\s]+?)(?:\s*checks|\s*saves|\s*rolls|\.|,|$)/i,
		);
		if (advantageMatch) {
			effects.push({
				type: "roll_tag",
				target: "advantage",
				value: true,
				condition: advantageMatch[1].trim(),
				priority: 160,
			});
		}
	}

	// Disadvantage effects
	if (desc.includes("disadvantage on")) {
		const disadvantageMatch = desc.match(
			/disadvantage on ([a-z\s]+?)(?:\s*checks|\s*saves|\s*rolls|\.|,|$)/i,
		);
		if (disadvantageMatch) {
			effects.push({
				type: "roll_tag",
				target: "disadvantage",
				value: true,
				condition: disadvantageMatch[1].trim(),
				priority: 160,
			});
		}
	}

	// Resistance/immunity (handled separately by character resistances array)
	// But we can note them for display purposes

	// Double damage (e.g., "Deal double damage to objects and structures")
	if (desc.includes("double damage") || desc.includes("deal double")) {
		// This is situational and handled by Warden/UI, not automatic
	}

	return effects;
}

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Get spellcasting ability for a Rift Ascendant job
 */
export function getSpellcastingAbilityForJob(job: string): AbilityScore | null {
	const abilityMap: Record<string, AbilityScore> = {
		// INT casters
		Mage: "INT",
		Revenant: "INT",
		Technomancer: "INT",
		// SENSE (Sense) casters
		Herald: "SENSE",
		Summoner: "SENSE",
		Stalker: "SENSE",
		// PRE (Presence) casters
		Esper: "PRE",
		Contractor: "PRE",
		"Holy Knight": "PRE",
		Idol: "PRE",
	};

	return abilityMap[job] || null;
}

/**
 * Compute carrying capacity and encumbrance
 */
export function computeEncumbrance(
	strScore: number,
	equippedItems: EquipmentInstance[],
): {
	capacity: number;
	currentWeight: number;
	tier: EncumbranceTier;
} {
	const capacity = calculateCarryingCapacity(strScore);

	// Find containers with special rules
	const inactiveContainerIds = new Set(
		equippedItems
			.filter((i) => i.isContainer && i.isActive === false)
			.map((i) => i.id),
	);
	const magicContainerIds = new Set(
		equippedItems
			.filter((i) => i.isContainer && i.ignoreContentsWeight)
			.map((i) => i.id),
	);

	let currentWeight = 0;
	for (const item of equippedItems) {
		if (!item.weight) continue;

		// If the item itself is an inactive container, it contributes 0 weight
		if (item.isContainer && item.isActive === false) continue;

		// If the item is inside a container, check container rules
		if (item.containerId) {
			if (inactiveContainerIds.has(item.containerId)) continue;
			if (magicContainerIds.has(item.containerId)) continue;
		}

		currentWeight += item.weight;
	}

	// One tier ladder for the whole app (lib/encumbrance.ts). This function
	// used to apply 5e's optional VARIANT thresholds (5×/10×/15× STR) while
	// the sheet rendered the lenient percentage bands, so the engine and the
	// sheet disagreed about whether a loaded character was slowed.
	return {
		capacity,
		currentWeight,
		tier: encumbranceTierForWeight(currentWeight, capacity),
	};
}

// ============================================================================
// MAIN ENGINE FUNCTION
// ============================================================================

/**
 * Auto-calculate feature uses from formula
 */
// Ability-modifier token aliases (full names + RA/5e abbreviations) → the six
// RA ability scores. Used by calculateFeatureUses to resolve formulas like
// "PRE mod" or "INT mod + proficiency bonus" from a character's ability scores.
const FEATURE_USE_ABILITY_ALIASES: Record<string, AbilityScore> = {
	str: "STR",
	strength: "STR",
	agi: "AGI",
	agility: "AGI",
	dex: "AGI",
	dexterity: "AGI",
	vit: "VIT",
	vitality: "VIT",
	con: "VIT",
	constitution: "VIT",
	int: "INT",
	intelligence: "INT",
	sense: "SENSE",
	wis: "SENSE",
	wisdom: "SENSE",
	pre: "PRE",
	presence: "PRE",
	cha: "PRE",
	charisma: "PRE",
};

const FEATURE_USE_ABILITY_TOKEN =
	/\b(str|strength|agi|agility|dex|dexterity|vit|vitality|con|constitution|int|intelligence|sense|wis|wisdom|pre|presence|cha|charisma)\s+mod(?:ifier)?\b/g;

export function calculateFeatureUses(
	formula: string | null,
	level: number,
	proficiencyBonus: number,
	abilities?: Partial<Record<AbilityScore, number>> | null,
): number | null {
	if (!formula) return null;

	// Parse formulas like "proficiency bonus", "level", "2", "level / 2"
	const lowerFormula = formula.toLowerCase().trim();

	if (lowerFormula === "proficiency bonus" || lowerFormula === "pb") {
		return proficiencyBonus;
	}

	if (lowerFormula === "level" || lowerFormula === "lvl") {
		return level;
	}

	// Resolve ability-modifier tokens (e.g. "PRE mod", "INT modifier") from the
	// character's scores before the math pass. If the formula needs an ability
	// modifier but no scores were supplied, we cannot compute it — return null so
	// callers leave the existing value untouched (autoUpdateFeatureUses) rather
	// than seeding a wrong count.
	FEATURE_USE_ABILITY_TOKEN.lastIndex = 0;
	const needsAbility = FEATURE_USE_ABILITY_TOKEN.test(lowerFormula);
	let abilityResolved = lowerFormula;
	if (needsAbility) {
		if (!abilities) return null;
		abilityResolved = lowerFormula.replace(
			FEATURE_USE_ABILITY_TOKEN,
			(_match, name: string) => {
				const key = FEATURE_USE_ABILITY_ALIASES[name];
				const score = (key ? abilities[key] : undefined) ?? 10;
				return getAbilityModifier(score).toString();
			},
		);
	}

	// Try to evaluate simple math expressions safely (without eval)
	try {
		const expression = abilityResolved
			.replace(/proficiency bonus/gi, proficiencyBonus.toString())
			.replace(/pb/gi, proficiencyBonus.toString())
			.replace(/level/gi, level.toString())
			.replace(/lvl/gi, level.toString());

		// Only allow safe math operations - use Function constructor instead of eval for better isolation
		// This is still risky but slightly safer than direct eval, and we validate the input
		if (/^[\d+\-*/().\s]+$/.test(expression)) {
			// Use Function constructor with strict mode and no global access
			// Note: This is safer than eval as it creates an isolated scope, but still requires validation
			// Input is validated to only contain math operations before execution
			const result = new Function(`"use strict"; return (${expression})`)();
			return Math.floor(Number(result));
		}
	} catch {
		// Invalid expression
	}

	// Try parsing as a number
	const num = parseInt(lowerFormula, 10);
	if (!Number.isNaN(num)) return num;

	return null;
}
export function maintainConcentration(
	characterId: string,
	_dc: number = 10,
	_source: string = "Magic",
): boolean {
	console.log(`[Warden] Checking Concentration for ${characterId}`);
	return true;
}
