/**
 * 5e Standard Character Calculations with System Ascendant Flavor
 * All calculations follow SRD 5e rules exactly
 */

import type { AbilityScore } from "./5eRulesEngine";
import {
	getAbilityModifier,
	getProficiencyBonus as getProficiencyBonusFromRules,
} from "./5eRulesEngine";

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
}

export interface CalculatedStats {
	proficiencyBonus: number;
	systemFavorDie: number;
	systemFavorMax: number;
	abilityModifiers: Record<AbilityScore, number>;
	savingThrows: Record<AbilityScore, number>;
	skills: Record<string, number>;
	initiative: number;
	armorClass: number;
	speed: number;
	passivePerception: number;
	carryingCapacity: number;
}

// Calculate all derived stats using standard 5e formulas
export function calculateCharacterStats(
	stats: CharacterStats,
): CalculatedStats {
	const {
		level,
		abilities,
		savingThrowProficiencies,
		skillProficiencies,
		skillExpertise,
	} = stats;

	const proficiencyBonus = getProficiencyBonus(level);
	const systemFavorDie = getSystemFavorDie(level);
	const systemFavorMax = getSystemFavorMax(level);

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

	// Calculate skills (standard 5e with System Ascendant skill names)
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

	Object.entries(skillAbilities).forEach(([skill, ability]) => {
		const abilityMod = abilityModifiers[ability];
		const isProficient = skillProficiencies.includes(skill);
		const hasExpertise = skillExpertise.includes(skill);

		let bonus = abilityMod;
		if (isProficient) bonus += proficiencyBonus;
		if (hasExpertise) bonus += proficiencyBonus; // Expertise adds proficiency bonus again

		skills[skill] = bonus;
	});

	// Calculate initiative (AGI modifier, equivalent to 5e DEX)
	const initiative = abilityModifiers.AGI;

	// AC calculation (base 10 + AGI, can be modified by armor)
	const baseAC = 10 + abilityModifiers.AGI;
	const armorClass = stats.armorClass ?? baseAC;

	// Speed (standard 5e default 30, can be modified by race/features)
	const speed = stats.speed ?? 30;

	// Passive Perception (standard 5e: 10 + Perception skill)
	const passivePerception = 10 + (skills.perception || 0);

	// Carrying capacity (standard 5e: STR score × 15)
	const carryingCapacity = abilities.STR * 15;

	return {
		proficiencyBonus,
		systemFavorDie,
		systemFavorMax,
		abilityModifiers,
		savingThrows,
		skills,
		initiative,
		armorClass,
		speed,
		passivePerception,
		carryingCapacity,
	};
}

// Calculate HP max using standard 5e formula
export function calculateHPMax(
	level: number,
	hitDieSize: number,
	conModifier: number,
): number {
	// First level: full hit die + CON modifier (standard 5e)
	const firstLevelHP = hitDieSize + conModifier;

	// Subsequent levels: average roll + CON modifier
	const subsequentLevels = level - 1;
	const averagePerLevel = Math.floor(hitDieSize / 2) + 1 + conModifier;
	const subsequentHP = subsequentLevels * averagePerLevel;

	return firstLevelHP + subsequentHP;
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

	// Full casters (standard 5e)
	const fullCasters = ["Wizard", "Cleric", "Druid", "Sorcerer", "Bard"];
	// Half casters (standard 5e)
	const halfCasters = ["Paladin", "Ranger"];
	// Non-casters (no spell slots)
	const nonCasters = ["Fighter", "Barbarian", "Rogue", "Monk"];
	// Artificer special case
	const artificers = ["Artificer"];

	// Map System Ascendant canonical 14 jobs to 5e equivalents
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

// Calculate spells known limit (standard 5e)
export function getSpellsKnownLimit(
	job: string | { name: string } | null | undefined,
	level: number,
): number | null {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return null;

	// Known casters have limits
	if (["Esper", "Contractor", "Idol"].includes(jobName)) {
		return level + 1; // Known casters: level + 1
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

	// Prepared casters: ability modifier + level (minimum 1) - standard 5e
	const preparedCasters = [
		"Mage",
		"Technomancer",
		"Revenant",
		"Stalker",
		"Herald",
		"Holy Knight",
		"Summoner",
	];
	if (preparedCasters.includes(jobName)) {
		return Math.max(1, abilityModifier + level);
	}

	return null;
}

// System Favor calculations (mapped to various 5e inspiration mechanics)
export function getSystemFavorDie(level: number): number {
	if (level <= 4) return 4;
	if (level <= 10) return 6;
	if (level <= 16) return 8;
	return 10;
}

export function getSystemFavorMax(level: number): number {
	// Aligned with unified engine: 3/4/5/6 by tier (System Ascendant canonical formula)
	if (level <= 4) return 3;
	if (level <= 10) return 4;
	if (level <= 16) return 5;
	return 6;
}

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
