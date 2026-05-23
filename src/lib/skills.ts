import type { AbilityScore } from "@/types/core-rules";
import { getAbilityModifier } from "./characterCalculations";

export interface SkillDefinition {
	name: string;
	ability: AbilityScore;
}

const SKILLS: Record<string, SkillDefinition> = {
	Athletics: { name: "Athletics", ability: "STR" },
	Acrobatics: { name: "Acrobatics", ability: "AGI" },
	"Sleight of Hand": { name: "Sleight of Hand", ability: "AGI" },
	Stealth: { name: "Stealth", ability: "AGI" },
	Investigation: { name: "Investigation", ability: "INT" },
	History: { name: "Dimensional Lore", ability: "INT" },
	Arcana: { name: "Mana Flow", ability: "INT" },
	Nature: { name: "Gate Topology", ability: "INT" },
	Religion: { name: "Cosmic Lore", ability: "INT" },
	Perception: { name: "Perception", ability: "SENSE" },
	Insight: { name: "Insight", ability: "SENSE" },
	Medicine: { name: "Medicine", ability: "SENSE" },
	Survival: { name: "Survival", ability: "SENSE" },
	Deception: { name: "Deception", ability: "PRE" },
	Intimidation: { name: "Intimidation", ability: "PRE" },
	Performance: { name: "Performance", ability: "PRE" },
	Persuasion: { name: "Persuasion", ability: "PRE" },
};

const normalizeSkillName = (value: string): string =>
	value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

const hasSkill = (values: string[], skillName: string): boolean => {
	const key = normalizeSkillName(skillName);
	return values.some((value) => normalizeSkillName(value) === key);
};

export function calculateSkillModifier(
	skillName: string,
	abilities: Record<AbilityScore, number>,
	proficiencies: string[],
	expertise: string[],
	proficiencyBonus: number,
): number {
	const skill = SKILLS[skillName];
	if (!skill) return 0;

	const abilityMod = getAbilityModifier(abilities[skill.ability]);
	let modifier = abilityMod;

	if (hasSkill(expertise, skillName)) {
		modifier += proficiencyBonus * 2;
	} else if (hasSkill(proficiencies, skillName)) {
		modifier += proficiencyBonus;
	}

	return modifier;
}

export function calculatePassiveSkill(
	skillName: string,
	abilities: Record<AbilityScore, number>,
	proficiencies: string[],
	expertise: string[],
	proficiencyBonus: number,
): number {
	const modifier = calculateSkillModifier(
		skillName,
		abilities,
		proficiencies,
		expertise,
		proficiencyBonus,
	);
	return 10 + modifier;
}

export function getAllSkills(): SkillDefinition[] {
	return Object.values(SKILLS);
}
