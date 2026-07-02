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
	Nature: { name: "Rift Topology", ability: "INT" },
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

/**
 * Retired display names that may persist in character rows
 * (skill_proficiencies / skill_expertise store display strings).
 */
const LEGACY_SKILL_NAME_ALIASES: Record<string, string> = {
	"gate topology": "rift topology",
};

export const normalizeSkillName = (value: string): string => {
	const normalized = value
		.trim()
		.toLowerCase()
		.replace(/[_-]+/g, " ")
		.replace(/\s+/g, " ");
	return LEGACY_SKILL_NAME_ALIASES[normalized] ?? normalized;
};

/**
 * Resolve a skill by its 5e key ("Nature") or its RA display name
 * ("Rift Topology"), normalized. Callers pass display names from
 * getAllSkills(), so a key-only Record lookup would miss every skill whose
 * display name differs from its key.
 */
const SKILL_LOOKUP = new Map<string, SkillDefinition>();
for (const [key, def] of Object.entries(SKILLS)) {
	SKILL_LOOKUP.set(normalizeSkillName(key), def);
	SKILL_LOOKUP.set(normalizeSkillName(def.name), def);
}

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
	const skill =
		SKILLS[skillName] ?? SKILL_LOOKUP.get(normalizeSkillName(skillName));
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
