/**
 * 5e Rules Engine with Rift Ascendant Flavor
 * Converts all mechanics to standard 5e while preserving homebrew terminology
 */

// Rift Ascendant canonical ability scores
export type AbilityScore = "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";

export const ABILITY_DISPLAY_NAMES: Record<AbilityScore, string> = {
	STR: "Strength",
	AGI: "Agility",
	VIT: "Vitality",
	INT: "Intelligence",
	SENSE: "Sense",
	PRE: "Presence",
};

// Legacy 5e → Rift Ascendant mapping (for importing external data only)
export const LEGACY_5E_TO_SA: Record<string, AbilityScore> = {
	STR: "STR",
	AGI: "AGI",
	VIT: "VIT",
	INT: "INT",
	SENSE: "SENSE",
	PRE: "PRE",
	// Legacy mapping
	DEX: "AGI",
	CON: "VIT",
	WIS: "SENSE",
	CHA: "PRE",
};

export interface Skill {
	id: string;
	name: string;
	ability: AbilityScore;
	description: string;
}

export const SKILLS: Skill[] = [
	{
		id: "athletics",
		name: "Athletics",
		ability: "STR",
		description: "Physical feats of strength",
	},
	{
		id: "acrobatics",
		name: "Acrobatics",
		ability: "AGI",
		description: "Balance and agility maneuvers",
	},
	{
		id: "sleight-of-hand",
		name: "Sleight of Hand",
		ability: "AGI",
		description: "Fine motor skills and stealth",
	},
	{
		id: "stealth",
		name: "Stealth",
		ability: "AGI",
		description: "Moving unnoticed",
	},
	{
		id: "arcana",
		name: "Mana Flow",
		ability: "INT",
		description: "Magical knowledge and Rift anomalies",
	},
	{
		id: "history",
		name: "Dimensional Lore",
		ability: "INT",
		description: "Recalling past events and Ascendant lore",
	},
	{
		id: "investigation",
		name: "Investigation",
		ability: "INT",
		description: "Deductive reasoning and analysis",
	},
	{
		id: "nature",
		name: "Rift Topology",
		ability: "INT",
		description: "Natural world and creatures",
	},
	{
		id: "religion",
		name: "Cosmic Lore",
		ability: "INT",
		description: "Cults, rituals, and spiritual traditions",
	},
	{
		id: "animal-handling",
		name: "Beast Taming",
		ability: "SENSE",
		description: "Animal training and behavior",
	},
	{
		id: "insight",
		name: "Insight",
		ability: "SENSE",
		description: "Reading motives and emotions",
	},
	{
		id: "medicine",
		name: "Medicine",
		ability: "SENSE",
		description: "Field treatment and diagnosis",
	},
	{
		id: "perception",
		name: "Perception",
		ability: "SENSE",
		description: "Noticing details and threats",
	},
	{
		id: "survival",
		name: "Survival",
		ability: "SENSE",
		description: "Wilderness navigation and tracking",
	},
	{
		id: "deception",
		name: "Deception",
		ability: "PRE",
		description: "Lying and misdirection",
	},
	{
		id: "intimidation",
		name: "Intimidation",
		ability: "PRE",
		description: "Coercion and threats",
	},
	{
		id: "performance",
		name: "Performance",
		ability: "PRE",
		description: "Entertaining and public speaking",
	},
	{
		id: "persuasion",
		name: "Persuasion",
		ability: "PRE",
		description: "Negotiation and diplomacy",
	},
];

// Standard 5e DC ladder with Rift Ascendant examples
export const DC_LADDER = [
	{
		dc: 5,
		difficulty: "Very Easy",
		examples: "Hop a small barrier, recall recent public news",
	},
	{
		dc: 10,
		difficulty: "Easy",
		examples: "Climb a chain-link fence, impress a minor guild officer",
	},
	{
		dc: 15,
		difficulty: "Medium",
		examples: "Track a careful target, bypass a magical barrier",
	},
	{
		dc: 20,
		difficulty: "Hard",
		examples: "Leap between moving vehicles, notice a hidden sniper",
	},
	{
		dc: 25,
		difficulty: "Very Hard",
		examples: "Convince a hostile guild officer to back down",
	},
	{
		dc: 30,
		difficulty: "Nearly Impossible",
		examples: "Legendary feats, holding a collapsing portal",
	},
];

// Standard 5e rarity levels
// Canonical RA rarity ladder (kept in sync with `src/types/core-rules.ts`):
// common < uncommon < rare < very-rare < epic < legendary < mythic < artifact.
export type Rarity =
	| "common"
	| "uncommon"
	| "rare"
	| "very-rare"
	| "epic"
	| "legendary"
	| "mythic"
	| "artifact";

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

// Standard 5e utility functions with Rift Ascendant flavor.
// NOTE: kept in sync with `src/types/core-rules.ts:getAbilityModifier`.
// Both include the NaN/Infinity guard to prevent character-sheet NaN
// propagation when ability scores are temporarily unset during creation.
// See `docs/ui-canon-parity-audit-2026-05.md` finding M3.
export function getAbilityModifier(score: number): number {
	if (!Number.isFinite(score)) return 0;
	return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
	return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Standard 5e proficiency bonus
export function getProficiencyBonus(level: number): number {
	return Math.ceil(level / 4) + 1;
}

// ── Rift Favor ────────────────────────────────────────────────────────
// Core mechanic: identical to D&D Inspiration (roll die, add to d20 roll).
// Additional usage options provide thematic versatility fitting the
// Rift Ascendant tone. Each costs 1 Rift Favor unless noted.

// Aligned with unified engine: 3/4/5/6 by tier (Rift Ascendant canonical formula)
export function getRiftFavorMax(level: number): number {
	if (level <= 4) return 3;
	if (level <= 10) return 4;
	if (level <= 16) return 5;
	return 6;
}

export function getRiftFavorDie(level: number): number {
	if (level <= 4) return 4;
	if (level <= 10) return 6;
	if (level <= 16) return 8;
	return 10;
}

// Normalize any ability string (including legacy 5e) to Rift Ascendant
export function normalizeAbility(ability: string): AbilityScore {
	return LEGACY_5E_TO_SA[ability.toUpperCase()] || (ability as AbilityScore);
}

// Get display name for an ability
export function getAbilityDisplayName(ability: AbilityScore): string {
	return ABILITY_DISPLAY_NAMES[ability];
}
