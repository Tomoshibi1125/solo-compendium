/**
 * 5e Standard Character Calculations with Rift Ascendant Flavor
 * All calculations follow SRD 5e rules exactly
 */

import type { AbilityScore } from "./5eRulesEngine";
import {
	getAbilityModifier,
	getProficiencyBonus as getProficiencyBonusFromRules,
	getRiftFavorDie,
	getRiftFavorMax,
} from "./5eRulesEngine";
import { computePassiveScore } from "./sensesEngine";

// Re-export for convenience
const getProficiencyBonus = getProficiencyBonusFromRules;

export interface CharacterStats {
	level: number;
	abilities: Record<AbilityScore, number>;
	savingThrowProficiencies: AbilityScore[];
	skillProficiencies: string[];
	skillExpertise: string[];
	armorClass?: number;
	speed?: number;
	job?: string | { name: string } | null;
	/** Jack of All Trades: add half PB to non-proficient ability checks */
	hasHalfProficiency?: boolean;
	/** Override which ability drives a skill, e.g. { "intimidation": "STR" } */
	skillAbilityOverrides?: Record<string, AbilityScore>;
	/**
	 * Gestalt Regent overlay proficiencies, unioned in before save/skill
	 * computation. Saves are AbilityScore codes; skills are skill ids.
	 * (See regentGestalt.getGestaltProficiencies.)
	 */
	gestaltSavingThrowProficiencies?: AbilityScore[];
	gestaltSkillProficiencies?: string[];
}

export interface CalculatedStats {
	proficiencyBonus: number;
	riftFavorDie: number;
	riftFavorMax: number;
	abilityModifiers: Record<AbilityScore, number>;
	savingThrows: Record<AbilityScore, number>;
	skills: Record<string, number>;
	initiative: number;
	armorClass: number;
	speed: number;
	passivePerception: number;
	carryingCapacity: number;
	spellSaveDC: number | null;
	spellAttackBonus: number | null;
}

// Calculate all derived stats using standard 5e formulas
export function calculateCharacterStats(
	stats: CharacterStats,
): CalculatedStats {
	const { level, abilities, skillExpertise } = stats;

	// Gestalt Regent overlay: union the Job's own proficiencies with the
	// Regent's (a Regent is a full class overlay, not a subclass — its
	// proficiencies are gained in full). De-duped via Set.
	const savingThrowProficiencies: AbilityScore[] = Array.from(
		new Set<AbilityScore>([
			...stats.savingThrowProficiencies,
			...(stats.gestaltSavingThrowProficiencies ?? []),
		]),
	);
	const skillProficiencies: string[] = Array.from(
		new Set<string>([
			...stats.skillProficiencies,
			...(stats.gestaltSkillProficiencies ?? []),
		]),
	);

	const proficiencyBonus = getProficiencyBonus(level);
	const riftFavorDie = getRiftFavorDie(level);
	const riftFavorMax = getRiftFavorMax(level);

	// Calculate ability modifiers (standard 5e formula)
	const abilityModifiers: Record<AbilityScore, number> = {
		STR: getAbilityModifier(abilities.STR),
		AGI: getAbilityModifier(abilities.AGI),
		VIT: getAbilityModifier(abilities.VIT),
		INT: getAbilityModifier(abilities.INT),
		SENSE: getAbilityModifier(abilities.SENSE),
		PRE: getAbilityModifier(abilities.PRE),
	};

	// Calculate saving throws (standard 5e)
	const savingThrows: Record<AbilityScore, number> = {
		STR:
			abilityModifiers.STR +
			(savingThrowProficiencies.includes("STR") ? proficiencyBonus : 0),
		AGI:
			abilityModifiers.AGI +
			(savingThrowProficiencies.includes("AGI") ? proficiencyBonus : 0),
		VIT:
			abilityModifiers.VIT +
			(savingThrowProficiencies.includes("VIT") ? proficiencyBonus : 0),
		INT:
			abilityModifiers.INT +
			(savingThrowProficiencies.includes("INT") ? proficiencyBonus : 0),
		SENSE:
			abilityModifiers.SENSE +
			(savingThrowProficiencies.includes("SENSE") ? proficiencyBonus : 0),
		PRE:
			abilityModifiers.PRE +
			(savingThrowProficiencies.includes("PRE") ? proficiencyBonus : 0),
	};

	// Calculate skills (standard 5e with Rift Ascendant skill names)
	const skills: Record<string, number> = {};

	// Skill to ability mapping (standard 5e)
	const skillAbilities: Record<string, AbilityScore> = {
		athletics: "STR",
		acrobatics: "AGI",
		"sleight-of-hand": "AGI",
		stealth: "AGI",
		arcana: "INT",
		history: "INT",
		investigation: "INT",
		nature: "INT",
		religion: "INT",
		"animal-handling": "SENSE",
		insight: "SENSE",
		medicine: "SENSE",
		perception: "SENSE",
		survival: "SENSE",
		deception: "PRE",
		intimidation: "PRE",
		performance: "PRE",
		persuasion: "PRE",
	};

	Object.entries(skillAbilities).forEach(([skill, defaultAbility]) => {
		// Allow per-skill ability override (e.g., Intimidation with STR instead of PRE)
		const ability = stats.skillAbilityOverrides?.[skill] ?? defaultAbility;
		const abilityMod = abilityModifiers[ability];
		const isProficient = skillProficiencies.includes(skill);
		const hasExpertise = skillExpertise.includes(skill);

		let bonus = abilityMod;
		if (isProficient) {
			bonus += proficiencyBonus;
		} else if (stats.hasHalfProficiency) {
			// Jack of All Trades / Idol Rift Versatility: add floor(PB/2) to non-proficient skills
			bonus += Math.floor(proficiencyBonus / 2);
		}
		if (hasExpertise) bonus += proficiencyBonus; // Expertise adds proficiency bonus again

		skills[skill] = bonus;
	});

	// Calculate initiative (AGI modifier, equivalent to 5e AGI)
	const initiative = abilityModifiers.AGI;

	// AC calculation (base 10 + AGI, can be modified by armor)
	const baseAC = 10 + abilityModifiers.AGI;
	const armorClass = stats.armorClass ?? baseAC;

	// Speed (standard 5e default 30, can be modified by race/features)
	const speed = stats.speed ?? 30;

	// Passive Perception — canonical formula via computePassiveScore.
	// This lightweight calculator does not have access to job/feat senses, so
	// we only fold in the perception skill modifier; the full senses engine
	// path in characterEngine.ts adds Observant feat, Job/Regent senses, etc.
	const passivePerception = computePassiveScore(skills.perception || 0);

	// Carrying capacity (standard 5e: STR score × 15)
	const carryingCapacity = abilities.STR * 15;

	// Spell Save DC and Spell Attack Bonus (standard 5e)
	const spellSaveDC = calculateSpellSaveDC(level, stats.job ?? null, abilities);
	const spellAttackBonus = calculateSpellAttackBonus(
		level,
		stats.job ?? null,
		abilities,
	);

	return {
		proficiencyBonus,
		riftFavorDie,
		riftFavorMax,
		abilityModifiers,
		savingThrows,
		skills,
		initiative,
		armorClass,
		speed,
		passivePerception,
		carryingCapacity,
		spellSaveDC,
		spellAttackBonus,
	};
}

// Calculate HP max using standard 5e formula.
//
// P1.9: when a list of structured FeatureEffects is supplied, this
// function also bakes in `hp_per_level` (e.g. Tough's +2 per level) and
// `hp_flat` contributions. Callers that pass `null` / `undefined` for
// the third arg get the legacy behavior — backward compatible.
export function calculateHPMax(
	level: number,
	hitDieSize: number,
	conModifier: number,
	structuredEffects?:
		| Array<{ kind: string; value?: number }>
		| null
		| undefined,
): number {
	// First level: full hit die + VIT modifier (standard 5e)
	const firstLevelHP = hitDieSize + conModifier;

	// Subsequent levels: average roll + VIT modifier
	const subsequentLevels = level - 1;
	const averagePerLevel = Math.floor(hitDieSize / 2) + 1 + conModifier;
	const subsequentHP = subsequentLevels * averagePerLevel;

	// Structured effect contributions (P1.9):
	//   hp_per_level → scales with character level (e.g. Tough +2/level)
	//   hp_flat      → one-time bump (e.g. Dwarven Toughness analogue)
	let effectHp = 0;
	if (structuredEffects && structuredEffects.length > 0) {
		for (const e of structuredEffects) {
			if (e.kind === "hp_per_level" && typeof e.value === "number") {
				effectHp += e.value * level;
			} else if (e.kind === "hp_flat" && typeof e.value === "number") {
				effectHp += e.value;
			}
		}
	}

	return firstLevelHP + subsequentHP + effectHp;
}

// Calculate Spell Save DC (standard 5e: 8 + PB + spellcasting ability modifier)
export function calculateSpellSaveDC(
	level: number,
	job: string | { name: string } | null | undefined,
	abilities: Record<AbilityScore, number>,
): number | null {
	const ability = getSpellcastingAbility(job);
	if (!ability) return null;
	const mod = getAbilityModifier(abilities[ability]);
	const pb = getProficiencyBonus(level);
	return 8 + pb + mod;
}

// Calculate Spell Attack Bonus (standard 5e: PB + spellcasting ability modifier)
export function calculateSpellAttackBonus(
	level: number,
	job: string | { name: string } | null | undefined,
	abilities: Record<AbilityScore, number>,
): number | null {
	const ability = getSpellcastingAbility(job);
	if (!ability) return null;
	const mod = getAbilityModifier(abilities[ability]);
	const pb = getProficiencyBonus(level);
	return pb + mod;
}

// Standard 5e spell slot calculations
export type CasterType =
	| "full"
	| "half"
	| "pact"
	| "third"
	| "artificer"
	| "none";

export function getCasterType(
	job: string | { name: string } | null | undefined,
): CasterType {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return "none";

	// Revenant is a hybrid half-caster (spells + martial powers/techniques),
	// reclassified from full-caster as part of the unarmored-drain-tank rework.
	// This early return takes precedence over the Revenant→Wizard identity map
	// below (which is now unreached for caster-type purposes).
	if (jobName === "Revenant") return "half";

	// Full casters (standard 5e)
	const fullCasters = ["Wizard", "Cleric", "Druid", "Sorcerer", "Bard"];
	// Half casters (standard 5e)
	const halfCasters = ["Paladin", "Ranger"];
	// Non-casters (no spell slots)
	const nonCasters = ["Fighter", "Barbarian", "Rogue", "Monk"];
	// Artificer special case
	const artificers = ["Artificer"];

	// Map Rift Ascendant canonical 14 jobs to 5e equivalents
	const jobMapping: Record<string, string> = {
		Destroyer: "Fighter",
		Berserker: "Barbarian",
		Assassin: "Rogue",
		Striker: "Monk",
		Mage: "Wizard",
		Esper: "Sorcerer",
		Revenant: "Wizard",
		Summoner: "Druid",
		Herald: "Cleric",
		Contractor: "Warlock",
		Stalker: "Ranger",
		"Holy Knight": "Paladin",
		Technomancer: "Artificer",
		Idol: "Bard",
	};

	const pactCasters = ["Warlock"];

	const standardJob = jobMapping[jobName] || jobName;

	if (nonCasters.includes(standardJob)) return "none";
	if (fullCasters.includes(standardJob)) return "full";
	if (halfCasters.includes(standardJob)) return "half";
	if (pactCasters.includes(standardJob)) return "pact";
	if (artificers.includes(standardJob)) return "artificer";
	return "none";
}

export function getSpellSlotsPerLevel(
	casterType: CasterType,
	level: number,
): Record<number, number> {
	const slots: Record<number, number> = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
	};

	if (casterType === "none" || level === 0) {
		return slots;
	}

	// Full caster progression (standard 5e PHB table)
	if (casterType === "full") {
		const fullCasterTable: Record<number, number[]> = {
			1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
			2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
			3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
			4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
			5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
			6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
			7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
			8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
			9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
			10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
			11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
			12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
			13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
			14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
			15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
			16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
			17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
			18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
			19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
			20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
		};

		const levelSlots =
			fullCasterTable[Math.min(level, 20)] || fullCasterTable[20];
		for (let i = 0; i < 9; i++) {
			slots[i + 1] = levelSlots[i];
		}
	}

	// Pact caster progression (Warlock-style: few slots, all same level, recharge on short rest)
	if (casterType === "pact") {
		const pactSlotTable: Record<number, [number, number]> = {
			// [slot count, slot level]
			1: [1, 1],
			2: [2, 1],
			3: [2, 2],
			4: [2, 2],
			5: [2, 3],
			6: [2, 3],
			7: [2, 4],
			8: [2, 4],
			9: [2, 5],
			10: [2, 5],
			11: [3, 5],
			12: [3, 5],
			13: [3, 5],
			14: [3, 5],
			15: [3, 5],
			16: [3, 5],
			17: [4, 5],
			18: [4, 5],
			19: [4, 5],
			20: [4, 5],
		};
		const [count, slotLevel] =
			pactSlotTable[Math.min(level, 20)] || pactSlotTable[20];
		slots[slotLevel] = count;
		return slots;
	}

	// Half caster progression (standard 5e PHB table)
	if (casterType === "half") {
		const halfCasterTable: Record<number, number[]> = {
			1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
			3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
			4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
			5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
			6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
			7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
			8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
			9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
			10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
			11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
			12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
			13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
			14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
			15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
			16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
			17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
			18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
			19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
			20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
		};

		const levelSlots =
			halfCasterTable[Math.min(level, 20)] || halfCasterTable[20];
		for (let i = 0; i < 9; i++) {
			slots[i + 1] = levelSlots[i];
		}
	}

	// Artificer progression (Tasha's Cauldron)
	if (casterType === "artificer") {
		const artificerTable: Record<number, number[]> = {
			1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
			3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
			4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
			5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
			6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
			7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
			8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
			9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
			10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
			11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
			12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
			13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
			14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
			15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
			16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
			17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
			18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
			19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
			20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
		};

		const levelSlots =
			artificerTable[Math.min(level, 20)] || artificerTable[20];
		for (let i = 0; i < 9; i++) {
			slots[i + 1] = levelSlots[i];
		}
	}

	return slots;
}

// Get spellcasting ability (standard 5e)
export function getSpellcastingAbility(
	job: string | { name: string } | null | undefined,
): AbilityScore | null {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return null;

	// Map canonical 14 SA jobs to spellcasting abilities
	const jobAbilityMap: Record<string, AbilityScore> = {
		Mage: "INT",
		Revenant: "INT",
		Technomancer: "INT",
		Herald: "SENSE",
		Summoner: "SENSE",
		Stalker: "SENSE",
		Esper: "PRE",
		Contractor: "PRE",
		"Holy Knight": "PRE",
		Idol: "PRE",
	};

	return jobAbilityMap[jobName] || null;
}

/**
 * Canonical primary ability for each of the 14 Rift Ascendant jobs.
 *
 * Used as the authoritative ability for innate / job-granted powers and
 * abilities, including for non-casters whose powers are martial or
 * physical in nature. Casters' primary ability matches their spellcasting
 * ability; martial classes use STR or AGI per their archetype.
 *
 *   STR:   Destroyer, Berserker
 *   AGI:   Assassin, Striker
 *   INT:   Mage, Revenant, Technomancer
 *   SENSE: Herald, Summoner, Stalker
 *   PRE:   Esper, Contractor, Holy Knight, Idol
 */
export function getJobPrimaryAbility(
	job: string | { name: string } | null | undefined,
): AbilityScore | null {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return null;

	const jobPrimaryAbilityMap: Record<string, AbilityScore> = {
		Destroyer: "STR",
		Berserker: "STR",
		Assassin: "AGI",
		Striker: "AGI",
		Mage: "INT",
		Revenant: "INT",
		Technomancer: "INT",
		Herald: "SENSE",
		Summoner: "SENSE",
		Stalker: "SENSE",
		Esper: "PRE",
		Contractor: "PRE",
		"Holy Knight": "PRE",
		Idol: "PRE",
	};

	return jobPrimaryAbilityMap[jobName] || null;
}

// Canonical SRD "Spells Known" tables for RA's known casters, indexed by
// character level 1–20. These MIRROR the static per-Job arrays in
// `data/compendium/jobs.ts` (the creation / level-up wizard reads those arrays;
// this function feeds the sheet's known-spells badge). They are bound together
// by a guard test so the badge can never again drift from the creation limit —
// the badge previously used a rough `level + 1`, which mis-counted (e.g. an Idol
// at L1 showed 2 but could actually learn 4; an Esper at L12 showed 13 vs 12).
const SPELLS_KNOWN_TABLES: Record<string, number[]> = {
	// Esper → Sorcerer
	Esper: [
		2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15,
	],
	// Idol → Bard
	Idol: [
		4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22,
	],
	// Contractor → Warlock
	Contractor: [
		2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 15, 15, 15,
	],
};

// Calculate spells known limit (standard 5e)
export function getSpellsKnownLimit(
	job: string | { name: string } | null | undefined,
	level: number,
): number | null {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return null;

	// Stalker → Ranger: a KNOWN half-caster (not prepared). Ranger knows no
	// spells at level 1 and thereafter follows the SRD Ranger "Spells Known"
	// column = ceil(level/2)+1 (2→2, 3→3, 5→4, 9→6, … 20→11). The earlier
	// floor(level/2)+1 under-counted at every odd level ≥3.
	if (jobName === "Stalker") {
		return level < 2 ? 0 : Math.ceil(level / 2) + 1;
	}

	// Known full/pact casters (Sorcerer/Warlock/Bard analogs) use their exact
	// SRD tables so the sheet badge matches the creation-wizard limit.
	const table = SPELLS_KNOWN_TABLES[jobName];
	if (table) {
		const idx = Math.max(0, Math.min(level - 1, 19));
		return table[idx];
	}

	// Other classes are prepared casters
	return null;
}

// Calculate spells prepared limit (standard 5e)
export function getSpellsPreparedLimit(
	job: string | { name: string } | null | undefined,
	level: number,
	abilityModifier: number,
): number | null {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return null;

	const spellcastingAbility = getSpellcastingAbility(job);
	if (!spellcastingAbility) return null;

	// Half-caster prepared casters use ability modifier + half level (min 1):
	//   Revenant (drain-tank rework), Holy Knight → Paladin, and Technomancer →
	//   Artificer. All three have half-caster spell slots, so — matching
	//   Paladin/Artificer RAW — they prepare mod + floor(level/2), not the
	//   full-caster mod + level. (Holy Knight and Technomancer were previously
	//   over-counted with the full-caster formula.)
	const halfCasterPrepared = ["Revenant", "Holy Knight", "Technomancer"];
	if (halfCasterPrepared.includes(jobName)) {
		return Math.max(1, abilityModifier + Math.floor(level / 2));
	}

	// Full-caster prepared casters: ability modifier + level (minimum 1) - SRD.
	// Stalker is intentionally excluded — its 5e counterpart (Ranger) is a KNOWN
	// caster, so it uses getSpellsKnownLimit instead of a prepared limit.
	const preparedCasters = ["Mage", "Herald", "Summoner"];
	if (preparedCasters.includes(jobName)) {
		return Math.max(1, abilityModifier + level);
	}

	return null;
}

// Rift Favor calculations re-exported from `5eRulesEngine.ts` so a single
// canonical source owns the formula. See `docs/ui-canon-parity-audit-2026-05.md`
// finding L1 (duplicate definitions consolidated 2026-05). Imported into
// the top of this module too — for in-file use plus public re-export.
export { getRiftFavorDie, getRiftFavorMax };

/**
 * Calculate cantrips known limit (standard 5e progression)
 * Returns null if the job doesn't learn cantrips
 */
export function getCantripsKnownLimit(
	job: string | { name: string } | null | undefined,
	level: number,
): number | null {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return null;
	const j = jobName.toLowerCase();

	// Full casters: Mage (Wizard), Herald (Cleric), Esper (Sorcerer), Idol (Bard), Summoner (Druid)
	const fullCasterCantrips: Record<string, number[]> = {
		// [levels 1-20] cantrips known
		mage: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
		herald: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
		esper: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
		idol: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		summoner: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	};

	// Pactcasters: Contractor (Warlock)
	const pactcasterCantrips: Record<string, number[]> = {
		contractor: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
		technomancer: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
	};

	const table = fullCasterCantrips[j] ?? pactcasterCantrips[j];
	if (!table) return null; // Martial jobs don't get cantrips

	const idx = Math.max(0, Math.min(level - 1, 19));
	return table[idx];
}
