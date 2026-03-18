/**
 * Centralized Character Calculation Engine
 *
 * SINGLE SOURCE OF TRUTH for all derived character stats.
 * Uses System Ascendant mechanics.
 *
 * Philosophy:
 * - Pure functions: input base data, output computed stats
 * - No database access, no side effects, no async operations
 * - All derived stats computed on-demand, NEVER stored in database
 * - Deterministic: same input = same output, always
 * - Effect resolution with priority ordering and conflict resolution
 *
 * System Ascendant Terminology:
 * - "Jobs" = D&D Classes (Destroyer, Mage, Esper, Herald, etc.)
 * - "Paths" = D&D Subclasses
 * - "Powers" = D&D Spells
 * - "Relics" = D&D Magic Items
 * - Abilities: STR, AGI (DEX), VIT (CON), INT, SENSE (WIS), PRE (CHA)
 */

import {
	getCasterType,
	getSpellSlotsPerLevel,
	getSystemFavorDie,
	getSystemFavorMax,
} from "./5eCharacterCalculations";
import type { AbilityScore } from "./5eRulesEngine";
import {
	getAbilityModifier,
	getProficiencyBonus,
	SKILLS,
} from "./5eRulesEngine";
import {
	aggregateFeatAndStyleEffects,
	computeAttacksPerAction,
} from "./featEffectParser";
import { type CharacterSenses, computeSenses } from "./sensesEngine";
import {
	bridgeAllFeatEffects,
	mergeAndSortEffects,
	resolveEffectConflicts,
} from "./unifiedEffectSystem";
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
	| "system_favor_max"
	| "system_favor_current"
	| "spell_slots"
	| "feature_uses"
	| "advantage"
	| "disadvantage"
	| "reroll"
	| "minimum_roll";

export interface EffectSource {
	sourceType:
		| "equipment"
		| "feature"
		| "condition"
		| "rune"
		| "level"
		| "job"
		| "path"
		| "awakening"
		| "trait"
		| "feat"
		| "race"
		| "item";
	sourceId: string;
	sourceName?: string;
}

export interface Effect {
	type: EffectType;
	target: EffectTarget;
	value: number | string | boolean | Record<string, unknown>;
	condition?: string;
	priority?: number;
}

import { jobs as JOBS_DATABASE } from "@/data/compendium/jobs";
import { RegentGeminiSystem } from "@/lib/regentGeminiSystem";
import {
	getEffectiveHPMax,
	getEffectiveSpeed,
	resolveRollModifiers,
} from "./conditionEffects";

// ============================================================================
// INPUT TYPES: Base Character Data (from database/props)
// ============================================================================

/**
 * Equipment instance with effects
 */
interface EquipmentInstance {
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
interface FeatureInstance {
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
interface ActiveSpellEffect {
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
interface CharacterJob {
	job: string; // System Ascendant job name (Destroyer, Mage, etc.)
	path?: string; // System Ascendant subclass/path name (level 3, automatic)
	regent?: string; // Regent path ID (quest-gated, DM unlocks)
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
		[key: string]: unknown;
	}; // Full GeminiSovereign AI payload
	level: number;
	hitDie: number; // d6, d8, d10, d12
}

/**
 * Base character data - everything stored in database
 */
interface CharacterBaseData {
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
	systemFavorCurrent: number;

	// Base movement
	baseSpeed: number; // Usually 30

	// Active states
	equippedItems: EquipmentInstance[];
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

/**
 * All computed/derived character stats
 */
interface ComputedCharacterStats {
	// Core derived stats
	proficiencyBonus: number;
	abilityModifiers: Record<AbilityScore, number>;

	// Saving throws
	savingThrows: Record<AbilityScore, { modifier: number; proficient: boolean }>;

	// Skills
	skills: Record<
		string,
		{ modifier: number; proficient: boolean; expertise: boolean }
	>;

	// Combat stats
	armorClass: number;
	initiative: number;
	speed: number;

	// Spellcasting
	spellSaveDC: number | null;
	spellAttackBonus: number | null;
	spellcastingAbility: AbilityScore | null;
	spellSlots: Record<number, { current: number; max: number }>;

	// Perception
	passivePerception: number;

	// Carrying capacity
	carryingCapacity: number;
	currentWeight: number;
	encumbranceTier:
		| "normal"
		| "encumbered"
		| "heavily-encumbered"
		| "over-capacity";

	// System Favor (homebrew inspiration mechanic)
	systemFavorMax: number;
	systemFavorDie: number;

	// HP with exhaustion penalties
	effectiveHPMax: number;

	// Active effects summary
	activeEffects: ComputedEffect[];

	// Roll modifiers from conditions
	rollModifiers: {
		attacks: RollModifierSummary;
		abilityChecks: RollModifierSummary;
		savingThrows: RollModifierSummary;
	};

	// Senses (DDB/Foundry parity — darkvision, blindsight, tremorsense, passives)
	senses?: CharacterSenses;

	// Attacks per action (Extra Attack from Job/Regent)
	attacksPerAction?: number;
}

/**
 * Computed effect after resolution
 */
interface ComputedEffect {
	source: EffectSource;
	target: EffectTarget;
	value: number | string | boolean | Record<string, unknown>;
	displayText: string; // Human-readable effect description
	priority: number;
}

/**
 * Roll modifier summary for a roll type
 */
interface RollModifierSummary {
	advantage: boolean;
	disadvantage: boolean;
	flatModifier: number;
	autoFail: boolean;
	sources: string[]; // List of effect sources
}

// ============================================================================
// EFFECT AGGREGATION
// ============================================================================

/**
 * Aggregate awakening features from jobs compendium
 * These are progressive abilities unlocked at specific levels (1, 3, 5, 7, 11, 14, etc.)
 */
function aggregateAwakeningFeatures(
	jobs: CharacterJob[],
	_totalLevel: number,
): FeatureInstance[] {
	const features: FeatureInstance[] = [];

	try {
		for (const charJob of jobs) {
			// Find job data from compendium
			const jobData = JOBS_DATABASE.find(
				(j: { id: string }) => j.id === charJob.job.toLowerCase(),
			);
			if (!jobData?.awakeningFeatures) continue;

			// Filter features unlocked at or below current job level
			const unlockedFeatures = jobData.awakeningFeatures.filter(
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
function parseAwakeningEffects(
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
function aggregateJobTraits(
	jobs: CharacterJob[],
	_totalLevel: number,
): FeatureInstance[] {
	const traits: FeatureInstance[] = [];

	try {
		for (const charJob of jobs) {
			// Find job data from compendium
			const jobData = JOBS_DATABASE.find(
				(j: { id: string }) => j.id === charJob.job.toLowerCase(),
			);
			if (!jobData?.jobTraits) continue;

			// All job traits are available from level 1
			traits.push(
				...jobData.jobTraits.map(
					(t: {
						name: string;
						description: string;
						type: string;
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
function convertFrequencyToRecharge(
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
function parseJobTraitEffects(
	trait: {
		name: string;
		description: string;
		type: string;
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
		// This is situational and handled by DM/UI, not automatic
	}

	return effects;
}

/**
 * Aggregate regent features (quest-gated sovereign subclass)
 * Regents are DM-unlocked, NOT level-gated
 */
function aggregateRegentFeatures(jobs: CharacterJob[]): FeatureInstance[] {
	const features: FeatureInstance[] = [];

	try {
		for (const charJob of jobs) {
			// Check if job has regent unlocked
			if (!charJob.regent) continue;

			// Find regent data from database
			const regentData = RegentGeminiSystem.REGENT_DATABASE.find(
				(r: { id: string }) => r.id === charJob.regent,
			);
			if (!regentData) continue;

			// Add regent features
			if (regentData.features) {
				features.push(
					...regentData.features.map(
						(f: { name: string; description: string; type: string }) => ({
							id: `${charJob.job}-regent-${f.name.toLowerCase().replace(/\s+/g, "-")}`,
							name: f.name,
							sourceType: "path" as const, // Regents are sovereign subclasses
							sourceId: regentData.id,
							description: f.description,
							effects: parseRegentFeatureEffects(f, charJob.level),
						}),
					),
				);
			}
		}
	} catch (error) {
		// Gracefully handle if regent system not available
		console.warn("Could not load regent features:", error);
	}

	return features;
}

/**
 * Parse regent feature description into structured effects
 * Regents are full class overlays and can grant bonuses (AC, attack, damage, speed, etc.)
 * NO direct stat bonuses (STR, AGI, VIT, INT, SENSE, PRE)
 */
function parseRegentFeatureEffects(
	feature: { name: string; description: string; type: string },
	_jobLevel: number,
): Effect[] {
	const effects: Effect[] = [];
	const desc = feature.description.toLowerCase();

	// AC bonuses (e.g., "AC 22", "natural AC 18", "+2 AC")
	const naturalAC = desc.match(/(?:natural )?ac\s*[=:]\s*(\d+)/i);
	if (naturalAC) {
		effects.push({
			type: "modifier",
			target: "ac",
			value: parseInt(naturalAC[1], 10),
			priority: 170,
		});
	} else {
		const acBonus = desc.match(/\+(\d+)\s*(?:to\s*)?ac/i);
		if (acBonus) {
			effects.push({
				type: "modifier",
				target: "ac",
				value: parseInt(acBonus[1], 10),
				priority: 170,
			});
		}
	}

	// Attack bonuses (e.g., "+2 to attack rolls")
	const attackBonus = desc.match(/\+(\d+)\s*to\s*attack(?:\s*rolls)?/i);
	if (attackBonus) {
		effects.push({
			type: "modifier",
			target: "attack_bonus",
			value: parseInt(attackBonus[1], 10),
			priority: 170,
		});
	}

	// Damage bonuses (e.g., "+4d6 fire damage", "take 6d8 radiant/round")
	const damageBonus = desc.match(/(\d+d\d+)\s*([a-z]+)\s*damage/i);
	if (damageBonus) {
		// Combat damage dice effect — store as a damage_bonus modifier
		// The dice expression is tracked for display; numeric estimate used for modifier
		const diceExpr = damageBonus[1]; // e.g., "4d6"
		const diceCount = parseInt(diceExpr.split("d")[0], 10) || 1;
		const diceSides = parseInt(diceExpr.split("d")[1], 10) || 6;
		const avgDamage = Math.floor((diceCount * (diceSides + 1)) / 2);
		effects.push({
			type: "modifier",
			target: "damage_bonus",
			value: avgDamage,
			condition: `${diceExpr} ${damageBonus[2] || ""} damage`.trim(),
			priority: 170,
		});
	}

	// Speed bonuses (e.g., "fly 60 ft", "speed 120 ft")
	const flySpeed = desc.match(/fly\s*(\d+)\s*ft/i);
	if (flySpeed) {
		effects.push({
			type: "modifier",
			target: "fly_speed",
			value: parseInt(flySpeed[1], 10),
			priority: 170,
		});
	}

	const baseSpeed = desc.match(/(?:^|[^\w])speed\s*[=:]\s*(\d+)\s*ft/i);
	if (baseSpeed) {
		effects.push({
			type: "modifier",
			target: "speed",
			value: parseInt(baseSpeed[1], 10),
			priority: 170,
		});
	}

	// Initiative bonuses (e.g., "+4 to initiative")
	const initiativeBonus = desc.match(/\+(\d+)\s*to\s*initiative/i);
	if (initiativeBonus) {
		effects.push({
			type: "modifier",
			target: "initiative",
			value: parseInt(initiativeBonus[1], 10),
			priority: 170,
		});
	}

	// Spell DC bonuses (e.g., "spell DC +2")
	const spellDCBonus = desc.match(/spell\s*(?:save\s*)?dc\s*\+(\d+)/i);
	if (spellDCBonus) {
		effects.push({
			type: "modifier",
			target: "spell_dc",
			value: parseInt(spellDCBonus[1], 10),
			priority: 170,
		});
	}

	// Regeneration (e.g., "regeneration 15 HP/turn", "regain 25 HP at start of turn")
	const regeneration = desc.match(/(?:regeneration|regain)\s*(\d+)\s*hp/i);
	if (regeneration) {
		effects.push({
			type: "resource",
			target: "hp_regen",
			value: parseInt(regeneration[1], 10),
			priority: 170,
		});
	}

	// Resistances (handled by character resistances array, but note for display)
	if (
		desc.includes("immunity to all damage") ||
		desc.includes("immune to all")
	) {
		// Special case: Titan Regent's invulnerability
		// This is too powerful for auto-effect, must be handled by DM
	}

	if (desc.includes("resistance to all") || desc.includes("resist all")) {
		// Resistance to all damage types
	}

	// Advantage effects
	if (desc.includes("advantage on all rolls")) {
		effects.push({
			type: "roll_tag",
			target: "advantage",
			value: true,
			condition: "all rolls",
			priority: 170,
		});
	}

	return effects;
}

/**
 * Aggregate Gemini Protocol fusion features
 * Gemini creates Sovereigns: Job + Path + Regent A + Regent B
 * NOTE: Sovereigns are powerful subclass overlays, they do NOT grant stat bonuses
 * The integrated AI generates the fusion sovereign based on the combination
 */
function aggregateGeminiFeatures(jobs: CharacterJob[]): FeatureInstance[] {
	const features: FeatureInstance[] = [];

	try {
		for (const charJob of jobs) {
			// Check if job has Gemini fusion
			if (!charJob.gemini) continue;

			// Find regent data for both regents (handles legacy IDs or full objects)
			const regent1Id = charJob.gemini.regent1Id || charJob.gemini.regent1?.id;
			const regent2Id = charJob.gemini.regent2Id || charJob.gemini.regent2?.id;
			const sovereignId = (charJob.gemini.sovereignId ||
				charJob.gemini.id ||
				"unknown") as string;

			const regent1 = RegentGeminiSystem.REGENT_DATABASE.find(
				(r: { id: string }) => r.id === regent1Id,
			);
			const regent2 = RegentGeminiSystem.REGENT_DATABASE.find(
				(r: { id: string }) => r.id === regent2Id,
			);

			if (!regent1 || !regent2) continue;

			// Add merged features from both regents
			if (regent1.features) {
				features.push(
					...regent1.features.map(
						(f: { name: string; description: string; type: string }) => ({
							id: `${charJob.job}-gemini-r1-${f.name.toLowerCase().replace(/\s+/g, "-")}`,
							name: f.name,
							sourceType: "path" as const,
							sourceId: sovereignId,
							description: f.description,
							effects: parseRegentFeatureEffects(f, charJob.level),
						}),
					),
				);
			}

			if (regent2.features) {
				features.push(
					...regent2.features.map(
						(f: { name: string; description: string; type: string }) => ({
							id: `${charJob.job}-gemini-r2-${f.name.toLowerCase().replace(/\s+/g, "-")}`,
							name: f.name,
							sourceType: "path" as const,
							sourceId: sovereignId,
							description: f.description,
							effects: parseRegentFeatureEffects(f, charJob.level),
						}),
					),
				);
			}

			// Load AI-generated sovereign features directly from the gemini state payload
			if (charJob.gemini.features && Array.isArray(charJob.gemini.features)) {
				features.push(
					...charJob.gemini.features.map(
						(f: { name: string; description: string; type?: string }) => ({
							id: `${charJob.job}-gemini-ai-feat-${f.name.toLowerCase().replace(/\s+/g, "-")}`,
							name: `[Sovereign] ${f.name}`,
							sourceType: "path" as const,
							sourceId: sovereignId,
							description: f.description,
							effects: parseRegentFeatureEffects(f as never, charJob.level),
						}),
					),
				);
			}

			if (charJob.gemini.traits && Array.isArray(charJob.gemini.traits)) {
				features.push(
					...charJob.gemini.traits.map(
						(t: { name: string; description: string; type?: string }) => ({
							id: `${charJob.job}-gemini-ai-trait-${t.name.toLowerCase().replace(/\s+/g, "-")}`,
							name: `[Sovereign Trait] ${t.name}`,
							sourceType: "trait" as const,
							sourceId: sovereignId,
							description: t.description,
							effects: parseRegentFeatureEffects(t as never, charJob.level),
						}),
					),
				);
			}

			// Load AI-generated stat bonuses
			if (charJob.gemini.statBonuses) {
				const bonuses = charJob.gemini.statBonuses;
				const statEffects: Effect[] = [];
				for (const [stat, bonus] of Object.entries(bonuses)) {
					statEffects.push({
						type: "modifier",
						target: stat as EffectTarget,
						value: bonus,
						priority: 180,
					});
				}
				if (statEffects.length > 0) {
					features.push({
						id: `${charJob.job}-gemini-ai-stats`,
						name: `Sovereign Authority`,
						sourceType: "path" as const,
						sourceId: sovereignId,
						description: `Permanent physiological enhancement derived from Sovereign fusion.`,
						effects: statEffects,
					});
				}
			}
		}
	} catch (error) {
		// Gracefully handle if regent system not available
		console.warn("Could not load Gemini features:", error);
	}

	return features;
}

/**
 * Aggregate all effects from all sources
 */
function aggregateEffects(base: CharacterBaseData): Effect[] {
	const allEffects: Effect[] = [];

	// Equipment effects (Priority: 100-199)
	for (const item of base.equippedItems) {
		if (!item.isEquipped) continue;
		if (item.requiresAttunement && !item.isAttuned) continue;
		if (item.effects) {
			allEffects.push(
				...item.effects.map((e) => ({ ...e, priority: e.priority ?? 100 })),
			);
		}
	}

	// Feature effects (Priority: 200-299)
	for (const feature of base.features) {
		if (feature.effects) {
			allEffects.push(
				...feature.effects.map((e) => ({ ...e, priority: e.priority ?? 200 })),
			);
		}
	}

	// Awakening features (Priority: 150-199 - between equipment and features)
	const awakeningFeatures = aggregateAwakeningFeatures(base.jobs, base.level);
	for (const feature of awakeningFeatures) {
		if (feature.effects) {
			allEffects.push(
				...feature.effects.map((e) => ({ ...e, priority: e.priority ?? 150 })),
			);
		}
	}

	// Job traits (Priority: 160-199 - between awakening and features)
	const jobTraits = aggregateJobTraits(base.jobs, base.level);
	for (const trait of jobTraits) {
		if (trait.effects) {
			allEffects.push(
				...trait.effects.map((e) => ({ ...e, priority: e.priority ?? 160 })),
			);
		}
	}

	// Regent features (Priority: 170-179 - quest-gated sovereign subclasses)
	const regentFeatures = aggregateRegentFeatures(base.jobs);
	for (const feature of regentFeatures) {
		if (feature.effects) {
			allEffects.push(
				...feature.effects.map((e) => ({ ...e, priority: e.priority ?? 170 })),
			);
		}
	}

	// Gemini Protocol fusion (Priority: 180-199 - ultimate fusion bonuses)
	const geminiFeatures = aggregateGeminiFeatures(base.jobs);
	for (const feature of geminiFeatures) {
		if (feature.effects) {
			allEffects.push(
				...feature.effects.map((e) => ({ ...e, priority: e.priority ?? 180 })),
			);
		}
	}

	// Spell effects (Priority: 300-399)
	for (const spell of base.activeSpells) {
		if (spell.effects) {
			allEffects.push(
				...spell.effects.map((e) => ({ ...e, priority: e.priority ?? 300 })),
			);
		}
	}

	// Feat & Fighting Style effects (Priority: 200 — Foundry Active Effects parity)
	// Parse character feats and fighting styles into mechanical bonuses
	const featNames = base.features
		.filter((f) => f.sourceType === "feat")
		.map((f) => f.name);
	const fightingStyles = base.features
		.filter((f) => f.name.toLowerCase().includes("fighting style"))
		.map((f) => f.name.replace(/fighting style:\s*/i, "").trim());

	const rawFeatEffects = aggregateFeatAndStyleEffects(
		featNames,
		fightingStyles,
		base.level,
	);
	const bridgedFeatEffects = bridgeAllFeatEffects(rawFeatEffects);
	allEffects.push(...bridgedFeatEffects);

	// Condition effects are handled separately by conditionEffects.ts

	// Final: merge, sort by priority, and resolve conflicts (Foundry parity)
	return resolveEffectConflicts(mergeAndSortEffects(allEffects));
}

/**
 * Apply effects to a base value with conflict resolution
 */
function applyEffectsToStat(
	baseValue: number,
	effects: Effect[],
	target: EffectTarget,
): number {
	let result = baseValue;

	// Filter effects for this target
	const relevantEffects = effects.filter(
		(e) =>
			e.target === target &&
			e.type === "modifier" &&
			typeof e.value === "number",
	);

	// Sort by priority (lower = applied first)
	relevantEffects.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

	// Apply effects with D&D 5e stacking rules:
	// - Group by priority bucket (acts as bonus type: equipment=200, feat=300, etc.)
	// - Within each group, only the highest modifier applies (same-type non-stacking)
	// - Untyped bonuses (priority 100 or undefined) all stack normally
	// - Negative modifiers (penalties) always stack
	const untypedBucket = 100;
	const grouped = new Map<number, number[]>();

	for (const effect of relevantEffects) {
		const val = effect.value as number;
		const bucket = effect.priority ?? untypedBucket;

		// Penalties always apply (stack). Untyped bonuses (bucket 100) also stack.
		if (val < 0 || bucket === untypedBucket) {
			result += val;
		} else {
			// Typed bonuses: collect, keep highest per type
			if (!grouped.has(bucket)) grouped.set(bucket, []);
			grouped.get(bucket)?.push(val);
		}
	}

	// For typed bonus groups, apply only the highest
	for (const values of grouped.values()) {
		result += Math.max(...values);
	}

	return result;
}

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Compute ability modifiers from ability scores + effects
 */
function computeAbilityModifiers(
	baseAbilities: Record<AbilityScore, number>,
	effects: Effect[],
): Record<AbilityScore, number> {
	const modifiers = {} as Record<AbilityScore, number>;

	for (const ability of [
		"STR",
		"AGI",
		"VIT",
		"INT",
		"SENSE",
		"PRE",
	] as AbilityScore[]) {
		// Apply effects to ability score
		const finalScore = applyEffectsToStat(
			baseAbilities[ability],
			effects,
			ability as EffectTarget,
		);

		// Calculate modifier using 5e formula
		modifiers[ability] = getAbilityModifier(finalScore);
	}

	return modifiers;
}

/**
 * Compute saving throws
 */
function computeSavingThrows(
	abilityModifiers: Record<AbilityScore, number>,
	proficiencies: AbilityScore[],
	proficiencyBonus: number,
): Record<AbilityScore, { modifier: number; proficient: boolean }> {
	const saves: Record<AbilityScore, { modifier: number; proficient: boolean }> =
		{} as Record<AbilityScore, { modifier: number; proficient: boolean }>;

	for (const ability of [
		"STR",
		"AGI",
		"VIT",
		"INT",
		"SENSE",
		"PRE",
	] as AbilityScore[]) {
		const proficient = proficiencies.includes(ability);
		saves[ability] = {
			modifier: abilityModifiers[ability] + (proficient ? proficiencyBonus : 0),
			proficient,
		};
	}

	return saves;
}

/**
 * Compute skill modifiers
 */
function computeSkills(
	abilityModifiers: Record<AbilityScore, number>,
	skillProficiencies: string[],
	skillExpertise: string[],
	proficiencyBonus: number,
): Record<
	string,
	{ modifier: number; proficient: boolean; expertise: boolean }
> {
	const skills = {} as Record<
		string,
		{ modifier: number; proficient: boolean; expertise: boolean }
	>;

	for (const skill of SKILLS) {
		const abilityMod = abilityModifiers[skill.ability];
		const proficient = skillProficiencies.includes(skill.id);
		const expertise = skillExpertise.includes(skill.id);

		let modifier = abilityMod;
		if (proficient) modifier += proficiencyBonus;
		if (expertise) modifier += proficiencyBonus; // Expertise = 2x proficiency

		skills[skill.id] = { modifier, proficient, expertise };
	}

	return skills;
}

/**
 * Compute armor class
 * Handles unarmored, light/medium/heavy armor, shields, and effects
 */
function computeArmorClass(
	_baseAbilities: Record<AbilityScore, number>,
	abilityModifiers: Record<AbilityScore, number>,
	equippedItems: EquipmentInstance[],
	effects: Effect[],
): number {
	// Find equipped armor (if any)
	const armor = equippedItems.find(
		(item) =>
			item.type === "armor" &&
			item.isEquipped &&
			(!item.requiresAttunement || item.isAttuned),
	);

	let baseAC = 10;

	if (armor?.acFormula) {
		// Parse AC formula (e.g., "13 + AGI (max 2)", "18", "10 + AGI")
		baseAC = parseACFormula(armor.acFormula, abilityModifiers);
	} else {
		// Unarmored: 10 + AGI
		baseAC = 10 + abilityModifiers.AGI;
	}

	// Apply shield bonus (if equipped)
	const shield = equippedItems.find(
		(item) =>
			item.properties?.includes("shield") &&
			item.isEquipped &&
			(!item.requiresAttunement || item.isAttuned),
	);
	if (shield) {
		baseAC += 2; // Standard shield bonus
	}

	// Apply AC effects (rings, spells, etc.)
	baseAC = applyEffectsToStat(baseAC, effects, "ac");

	return baseAC;
}

/**
 * Parse AC formula from armor
 */
function parseACFormula(
	formula: string,
	abilityMods: Record<AbilityScore, number>,
): number {
	// Handle simple numeric AC (plate armor: "18")
	if (/^\d+$/.test(formula)) {
		return parseInt(formula, 10);
	}

	// Handle formulas like "10 + AGI", "13 + AGI (max 2)"
	let ac = 0;

	// Extract base number
	const baseMatch = formula.match(/(\d+)/);
	if (baseMatch) {
		ac = parseInt(baseMatch[1], 10);
	}

	// Extract ability modifier
	if (formula.includes("AGI")) {
		let agiMod = abilityMods.AGI;

		// Check for max cap
		const maxMatch = formula.match(/max\s+(\d+)/i);
		if (maxMatch) {
			const max = parseInt(maxMatch[1], 10);
			agiMod = Math.min(agiMod, max);
		}

		ac += agiMod;
	}

	return ac;
}

/**
 * Compute spell save DC and attack bonus
 */
function computeSpellcasting(
	jobs: CharacterJob[],
	abilityModifiers: Record<AbilityScore, number>,
	proficiencyBonus: number,
): {
	saveDC: number | null;
	attackBonus: number | null;
	ability: AbilityScore | null;
} {
	// Determine spellcasting ability from primary job
	const primaryJob = jobs[0];
	if (!primaryJob) return { saveDC: null, attackBonus: null, ability: null };

	const spellcastingAbility = getSpellcastingAbilityForJob(primaryJob.job);
	if (!spellcastingAbility)
		return { saveDC: null, attackBonus: null, ability: null };

	const abilityMod = abilityModifiers[spellcastingAbility];
	const saveDC = 8 + proficiencyBonus + abilityMod;
	const attackBonus = proficiencyBonus + abilityMod;

	return { saveDC, attackBonus, ability: spellcastingAbility };
}

/**
 * Get spellcasting ability for a System Ascendant job
 */
function getSpellcastingAbilityForJob(job: string): AbilityScore | null {
	const abilityMap: Record<string, AbilityScore> = {
		// INT casters
		Mage: "INT",
		Revenant: "INT",
		Technomancer: "INT",
		// SENSE (Wisdom) casters
		Herald: "SENSE",
		Summoner: "SENSE",
		Stalker: "SENSE",
		// PRE (Charisma) casters
		Esper: "PRE",
		Contractor: "PRE",
		"Holy Knight": "PRE",
		Idol: "PRE",
	};

	return abilityMap[job] || null;
}

/**
 * Compute spell slots for character (single job + regent overlays)
 * Uses the standard 5e spell slot tables from 5eCharacterCalculations.ts
 */
function computeSpellSlots(
	jobs: CharacterJob[],
	level: number,
): Record<number, { current: number; max: number }> {
	const slots = {} as Record<number, { current: number; max: number }>;
	for (let i = 1; i <= 9; i++) {
		slots[i] = { current: 0, max: 0 };
	}

	const primaryJob = jobs[0];
	if (!primaryJob) return slots;

	// Determine caster type from the primary job
	const casterType = getCasterType(primaryJob.job);
	if (casterType === "none") return slots;

	// Get max spell slots for this caster type + level
	const maxSlots = getSpellSlotsPerLevel(casterType, level);

	for (let i = 1; i <= 9; i++) {
		slots[i] = { current: maxSlots[i] ?? 0, max: maxSlots[i] ?? 0 };
	}

	// Regent overlay spell slots: if regent paths have spellcasting features,
	// add bonus slots. Regent spellcasting adds 1 bonus slot per even level
	// for their highest available spell level (SA parity with Foundry multiclass).
	for (const job of jobs) {
		if (job.regent && job.level >= 2) {
			const regentBonusLevel = Math.min(Math.floor(job.level / 2), 5);
			for (let sl = 1; sl <= regentBonusLevel; sl++) {
				slots[sl] = {
					current: slots[sl].current + 1,
					max: slots[sl].max + 1,
				};
			}
		}
	}

	return slots;
}

/**
 * Extract sense grants from equipped items' properties.
 * Items like "Goggles of Night" include "darkvision 60 ft" in their properties.
 */
function extractEquipmentSenses(items: EquipmentInstance[]): Array<{
	type: "equipment";
	name: string;
	sense: "darkvision" | "blindsight" | "tremorsense" | "truesight";
	range: number;
}> {
	const senses: Array<{
		type: "equipment";
		name: string;
		sense: "darkvision" | "blindsight" | "tremorsense" | "truesight";
		range: number;
	}> = [];
	const sensePattern =
		/(darkvision|blindsight|tremorsense|truesight)\s*(\d+)\s*ft/gi;

	for (const item of items) {
		if (!item.isEquipped) continue;
		for (const prop of item.properties ?? []) {
			const matches = Array.from(prop.matchAll(sensePattern));
			for (const match of matches) {
				senses.push({
					type: "equipment",
					name: item.name,
					sense: match[1].toLowerCase() as
						| "darkvision"
						| "blindsight"
						| "tremorsense"
						| "truesight",
					range: match[2] ? parseInt(match[2], 10) : 0,
				});
			}
		}
	}
	return senses;
}

/**
 * Extract sense grants from active spell effects.
 * Spells like "Darkvision" include sense keywords in their effects or name.
 */
function extractSpellSenses(spells: ActiveSpellEffect[]): Array<{
	type: "spell";
	name: string;
	sense: "darkvision" | "blindsight" | "tremorsense" | "truesight";
	range: number;
}> {
	const senses: Array<{
		type: "spell";
		name: string;
		sense: "darkvision" | "blindsight" | "tremorsense" | "truesight";
		range: number;
	}> = [];
	const sensePattern =
		/(darkvision|blindsight|tremorsense|truesight)\s*(\d+)\s*ft/gi;

	for (const spell of spells) {
		// Check spell name for sense keywords (e.g., "Darkvision 60 ft")
		const nameMatch = spell.spellName.match(sensePattern);
		if (nameMatch) {
			for (const m of nameMatch) {
				const parts = m.match(
					/(darkvision|blindsight|tremorsense|truesight)\s*(\d+)/i,
				);
				if (parts) {
					senses.push({
						type: "spell",
						name: spell.spellName,
						sense: parts[1].toLowerCase() as
							| "darkvision"
							| "blindsight"
							| "tremorsense"
							| "truesight",
						range: parseInt(parts[2], 10),
					});
				}
			}
		}
		sensePattern.lastIndex = 0;
	}
	return senses;
}

/**
 * Compute carrying capacity and encumbrance
 */
function computeEncumbrance(
	strScore: number,
	equippedItems: EquipmentInstance[],
): {
	capacity: number;
	currentWeight: number;
	tier: "normal" | "encumbered" | "heavily-encumbered" | "over-capacity";
} {
	const capacity = strScore * 15; // System Ascendant scaling

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

	let tier: "normal" | "encumbered" | "heavily-encumbered" | "over-capacity" =
		"normal";
	if (currentWeight > capacity) {
		tier = "over-capacity";
	} else if (currentWeight > strScore * 10) {
		tier = "heavily-encumbered";
	} else if (currentWeight > strScore * 5) {
		tier = "encumbered";
	}

	return { capacity, currentWeight, tier };
}

// ============================================================================
// MAIN ENGINE FUNCTION
// ============================================================================

/**
 * Compute all derived character stats from base data
 *
 * This is the SINGLE SOURCE OF TRUTH for character calculations.
 * UI components should NEVER compute stats directly - always use this function.
 *
 * @param base - Base character data from database
 * @returns Fully computed character stats
 */
// biome-ignore lint/correctness/noUnusedVariables: exported for use in other modules
function computeCharacterStats(
	base: CharacterBaseData,
): ComputedCharacterStats {
	// 1. Calculate proficiency bonus from total level
	const proficiencyBonus = getProficiencyBonus(base.level);

	// 2. Aggregate all effects from equipment, features, spells
	const effects = aggregateEffects(base);

	// 3. Compute ability modifiers (with effects applied to base scores)
	const abilityModifiers = computeAbilityModifiers(base.abilities, effects);

	// 4. Compute saving throws
	const savingThrows = computeSavingThrows(
		abilityModifiers,
		base.savingThrowProficiencies,
		proficiencyBonus,
	);

	// 5. Compute skills
	const skills = computeSkills(
		abilityModifiers,
		base.skillProficiencies,
		base.skillExpertise,
		proficiencyBonus,
	);

	// 6. Compute armor class
	const armorClass = computeArmorClass(
		base.abilities,
		abilityModifiers,
		base.equippedItems,
		effects,
	);

	// 7. Compute initiative (AGI modifier + effects)
	const initiative =
		abilityModifiers.AGI + applyEffectsToStat(0, effects, "initiative");

	// 8. Compute speed (base + effects + conditions + exhaustion + encumbrance)
	const conditionNames = base.activeConditions.map((c) => c.name);
	const baseSpeed = applyEffectsToStat(base.baseSpeed, effects, "speed");

	// 12. Compute carrying capacity (moved earlier for speed penalty)
	const encumbrance = computeEncumbrance(
		base.abilities.STR,
		base.equippedItems,
	);

	// Apply encumbrance speed penalty (5e variant rule, D&D Beyond parity)
	let speedAfterEncumbrance = baseSpeed;
	if (encumbrance.tier === "heavily-encumbered") {
		speedAfterEncumbrance = Math.max(0, baseSpeed - 20);
	} else if (encumbrance.tier === "encumbered") {
		speedAfterEncumbrance = Math.max(0, baseSpeed - 10);
	} else if (encumbrance.tier === "over-capacity") {
		speedAfterEncumbrance = 0;
	}

	const speed = getEffectiveSpeed(
		speedAfterEncumbrance,
		conditionNames,
		base.exhaustionLevel,
	);

	// 9. Compute spellcasting stats
	const spellcasting = computeSpellcasting(
		base.jobs,
		abilityModifiers,
		proficiencyBonus,
	);

	// 10. Compute spell slots
	const spellSlots = computeSpellSlots(base.jobs, base.level);

	// 11. Compute passive perception
	const _passivePerception = 10 + skills.perception.modifier;

	// Encumbrance already computed above (step 12)

	// 13. System Favor (homebrew inspiration mechanic)
	const systemFavorMax = getSystemFavorMax(base.level);
	const systemFavorDie = getSystemFavorDie(base.level);

	// 14. Effective HP max with exhaustion penalty
	const effectiveHPMax = getEffectiveHPMax(base.hpMax, base.exhaustionLevel);

	// 15. Roll modifiers from conditions
	const rollModifiers = {
		attacks: summarizeRollModifiers(
			conditionNames,
			base.exhaustionLevel,
			"attack_rolls",
		),
		abilityChecks: summarizeRollModifiers(
			conditionNames,
			base.exhaustionLevel,
			"ability_checks",
		),
		savingThrows: summarizeRollModifiers(
			conditionNames,
			base.exhaustionLevel,
			"saving_throws",
		),
	};

	// 16. Build computed effects summary for UI display
	const activeEffects = buildEffectsSummary(effects, base);

	// 17. Compute senses (DDB/Foundry parity — darkvision, blindsight, tremorsense, passives)
	const regentIds = base.jobs
		.filter((j) => Boolean(j.regent))
		.map((j) => j.regent as string);
	const senses = computeSenses(
		base.jobs[0]?.job ?? null,
		base.jobs[0]?.path ?? null,
		regentIds,
		extractEquipmentSenses(base.equippedItems), // equipmentSenses — extracted from equipped items
		extractSpellSenses(base.activeSpells), // spellSenses — extracted from active spell effects
		abilityModifiers.SENSE,
		abilityModifiers.INT,
		proficiencyBonus,
		base.skillProficiencies.includes("perception"),
		base.skillProficiencies.includes("investigation"),
		base.skillProficiencies.includes("insight"),
		base.skillExpertise.includes("perception"),
		base.features.some((f) => f.name.toLowerCase() === "observant"),
	);

	// 18. Compute attacks per action (Extra Attack from Job/Regent — Foundry parity)
	const attacksPerAction = computeAttacksPerAction(
		base.jobs[0]?.job ?? null,
		base.level,
		regentIds,
		base.features.some((f) => f.name.toLowerCase().includes("extra attack")),
	);

	return {
		proficiencyBonus,
		abilityModifiers,
		savingThrows,
		skills,
		armorClass,
		initiative,
		speed,
		spellSaveDC: spellcasting.saveDC,
		spellAttackBonus: spellcasting.attackBonus,
		spellcastingAbility: spellcasting.ability,
		spellSlots,
		passivePerception: senses.passivePerception,
		carryingCapacity: encumbrance.capacity,
		currentWeight: encumbrance.currentWeight,
		encumbranceTier: encumbrance.tier,
		systemFavorMax,
		systemFavorDie,
		effectiveHPMax,
		activeEffects,
		rollModifiers,
		senses,
		attacksPerAction,
	};
}

/**
 * Summarize roll modifiers for display
 */
function summarizeRollModifiers(
	conditions: string[],
	exhaustionLevel: number,
	rollType:
		| "attack_rolls"
		| "ability_checks"
		| "saving_throws"
		| "AGI_saves"
		| "STR_saves",
): RollModifierSummary {
	const resolved = resolveRollModifiers(conditions, exhaustionLevel, rollType);

	return {
		advantage: resolved.advantageState === "advantage",
		disadvantage: resolved.advantageState === "disadvantage",
		flatModifier: resolved.flatModifier,
		autoFail: resolved.autoFail,
		sources: conditions,
	};
}

/**
 * Build effects summary for UI display
 */
function buildEffectsSummary(
	_effects: Effect[],
	base: CharacterBaseData,
): ComputedEffect[] {
	const computed: ComputedEffect[] = [];

	// Add equipment effects
	for (const item of base.equippedItems) {
		if (!item.isEquipped || (item.requiresAttunement && !item.isAttuned))
			continue;
		if (item.effects) {
			for (const effect of item.effects) {
				computed.push({
					source: {
						sourceType: "equipment",
						sourceId: item.id,
						sourceName: item.name,
					},
					target: effect.target,
					value: effect.value,
					displayText: formatEffectDisplay(effect, item.name),
					priority: effect.priority ?? 100,
				});
			}
		}
	}

	// Add awakening feature effects
	const awakeningFeatures = aggregateAwakeningFeatures(base.jobs, base.level);
	for (const feature of awakeningFeatures) {
		if (feature.effects) {
			for (const effect of feature.effects) {
				computed.push({
					source: {
						sourceType: "awakening",
						sourceId: feature.sourceId,
						sourceName: feature.name,
					},
					target: effect.target,
					value: effect.value,
					displayText: formatEffectDisplay(effect, feature.name),
					priority: effect.priority ?? 150,
				});
			}
		}
	}

	// Add job trait effects
	const jobTraits = aggregateJobTraits(base.jobs, base.level);
	for (const trait of jobTraits) {
		if (trait.effects) {
			for (const effect of trait.effects) {
				computed.push({
					source: {
						sourceType: "trait",
						sourceId: trait.sourceId,
						sourceName: trait.name,
					},
					target: effect.target,
					value: effect.value,
					displayText: formatEffectDisplay(effect, trait.name),
					priority: effect.priority ?? 160,
				});
			}
		}
	}

	// Add regent feature effects
	const regentFeatures = aggregateRegentFeatures(base.jobs);
	for (const feature of regentFeatures) {
		if (feature.effects) {
			for (const effect of feature.effects) {
				computed.push({
					source: {
						sourceType: "path",
						sourceId: feature.sourceId,
						sourceName: feature.name,
					},
					target: effect.target,
					value: effect.value,
					displayText: formatEffectDisplay(effect, feature.name),
					priority: effect.priority ?? 170,
				});
			}
		}
	}

	// Add Gemini fusion effects
	const geminiFeatures = aggregateGeminiFeatures(base.jobs);
	for (const feature of geminiFeatures) {
		if (feature.effects) {
			for (const effect of feature.effects) {
				computed.push({
					source: {
						sourceType: "path",
						sourceId: feature.sourceId,
						sourceName: feature.name,
					},
					target: effect.target,
					value: effect.value,
					displayText: formatEffectDisplay(effect, feature.name),
					priority: effect.priority ?? 180,
				});
			}
		}
	}

	// Add feature effects
	for (const feature of base.features) {
		if (feature.effects) {
			for (const effect of feature.effects) {
				computed.push({
					source: {
						sourceType: feature.sourceType,
						sourceId: feature.id,
						sourceName: feature.name,
					},
					target: effect.target,
					value: effect.value,
					displayText: formatEffectDisplay(effect, feature.name),
					priority: effect.priority ?? 200,
				});
			}
		}
	}

	return computed.sort((a, b) => a.priority - b.priority);
}

/**
 * Format effect for display
 */
function formatEffectDisplay(effect: Effect, sourceName: string): string {
	if (effect.type === "modifier" && typeof effect.value === "number") {
		const sign = effect.value >= 0 ? "+" : "";
		return `${sign}${effect.value} ${effect.target} (${sourceName})`;
	}

	return `${effect.target} (${sourceName})`;
}

/**
 * Auto-calculate feature uses from formula
 */
export function calculateFeatureUses(
	formula: string | null,
	level: number,
	proficiencyBonus: number,
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

	// Try to evaluate simple math expressions safely (without eval)
	try {
		const expression = lowerFormula
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
