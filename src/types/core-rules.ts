// Rift Ascendant 5e SRD Data Types
// Based on parsed SRD and core rule references

// Ability Scores (Rift Ascendant uses different names)
export type AbilityScore = "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";

export const ABILITY_NAMES: Record<AbilityScore, string> = {
	STR: "Strength",
	AGI: "Agility",
	VIT: "Vitality",
	INT: "Intelligence",
	SENSE: "Sense",
	PRE: "Presence",
};

// Skill definitions
export interface Skill {
	id: string;
	name: string;
	defaultAbility: AbilityScore;
	description: string;
}

export const SKILLS: Skill[] = [
	{
		id: "athletics",
		name: "Athletics",
		defaultAbility: "STR",
		description: "Climbing, swimming, breaking restraints",
	},
	{
		id: "acrobatics",
		name: "Acrobatics",
		defaultAbility: "AGI",
		description: "Grappling, balancing, tumbling, avoiding falls",
	},
	{
		id: "sleight-of-hand",
		name: "Sleight of Hand",
		defaultAbility: "AGI",
		description: "Palming items, quick draws, subtle relic use",
	},
	{
		id: "stealth",
		name: "Stealth",
		defaultAbility: "AGI",
		description: "Moving quietly, hiding from sensors or Anomalies",
	},
	{
		id: "arcana",
		name: "Mana Flow",
		defaultAbility: "INT",
		description:
			"Understanding Rifts, Rift anomalies, and power theory in the post-reset world",
	},
	{
		id: "history",
		name: "Dimensional Lore",
		defaultAbility: "INT",
		description: "Recalling past events, notable Ascendants, major incidents",
	},
	{
		id: "investigation",
		name: "Investigation",
		defaultAbility: "INT",
		description: "Reconstructing events, searching for clues, analyzing scenes",
	},
	{
		id: "nature",
		name: "Rift Topology",
		defaultAbility: "INT",
		description: "Knowing wild ecosystems, beasts, natural hazards",
	},
	{
		id: "religion",
		name: "Cosmic Lore",
		defaultAbility: "INT",
		description: "Understanding cults, rituals, spiritual traditions",
	},
	{
		id: "insight",
		name: "Insight",
		defaultAbility: "SENSE",
		description: "Reading motives, noticing lies, sensing emotional states",
	},
	{
		id: "medicine",
		name: "Medicine",
		defaultAbility: "SENSE",
		description:
			"Stabilizing the dying, diagnosing conditions, field treatment",
	},
	{
		id: "perception",
		name: "Perception",
		defaultAbility: "SENSE",
		description: "Spotting ambushes, hearing distant noises, noticing details",
	},
	{
		id: "survival",
		name: "Survival",
		defaultAbility: "SENSE",
		description:
			"Tracking, navigating wilderness, predicting weather or Break patterns",
	},
	{
		id: "deception",
		name: "Deception",
		defaultAbility: "PRE",
		description: "Lying, forging personas, misdirecting in conversation",
	},
	{
		id: "intimidation",
		name: "Intimidation",
		defaultAbility: "PRE",
		description: "Coercing, making threats, projecting menace",
	},
	{
		id: "performance",
		name: "Performance",
		defaultAbility: "PRE",
		description: "Entertaining, public speaking, social displays",
	},
	{
		id: "persuasion",
		name: "Persuasion",
		defaultAbility: "PRE",
		description: "Negotiating, convincing, diplomacy, calming crowds",
	},
];

// Rarity levels — canonical Rift Ascendant ladder (low → high).
// Epic is a distinct tier ABOVE very-rare; mythic sits above legendary (used by
// the top-end relic catalogue); artifact is the reserved apex. Keep this in
// sync with `src/lib/5eRulesEngine.ts:Rarity` and the item/treasure rarity
// unions. NOTE: the persisted DB `rarity` enum is a narrower 5-value set
// (common/uncommon/rare/very_rare/legendary, underscore form) — higher tiers
// are display-only on enum-backed columns and preserved via item metadata.
export type Rarity =
	| "common"
	| "uncommon"
	| "rare"
	| "very-rare"
	| "epic"
	| "legendary"
	| "mythic"
	| "artifact";

/** Canonical rarity order (ascending). Index = tier rank. */
export const RARITY_ORDER: readonly Rarity[] = [
	"common",
	"uncommon",
	"rare",
	"very-rare",
	"epic",
	"legendary",
	"mythic",
	"artifact",
];

export const RARITY_LABELS: Record<Rarity, string> = {
	common: "Common",
	uncommon: "Uncommon",
	rare: "Rare",
	"very-rare": "Very Rare",
	epic: "Epic",
	legendary: "Legendary",
	mythic: "Mythic",
	artifact: "Artifact",
};

// Utility functions
export function getAbilityModifier(score: number): number {
	if (!Number.isFinite(score)) return 0;
	return Math.floor((score - 10) / 2);
}

// formatModifier moved to lib/characterCalculations.ts to avoid duplication

export function getProficiencyBonus(level: number): number {
	return Math.ceil(level / 4) + 1;
}
