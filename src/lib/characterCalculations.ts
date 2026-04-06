/**
 * Character Calculations — Re-export Barrel
 *
 * This module was consolidated into 5eCharacterCalculations.ts and 5eRulesEngine.ts.
 * This barrel file preserves backward compatibility for all existing importers.
 */

export type {
	CalculatedStats,
	CasterType,
	CharacterStats,
} from "./5eCharacterCalculations";
// From 5eCharacterCalculations — derived stat computation
export {
	calculateCharacterStats,
	calculateHPMax,
	getCantripsKnownLimit,
	getCasterType,
	getRiftFavorDie,
	getSpellcastingAbility,
	getSpellSlotsPerLevel,
	getSpellsKnownLimit,
	getSpellsPreparedLimit,
} from "./5eCharacterCalculations";
export type {
	AbilityScore,
	Character,
	CharacterAction,
	Job,
	JobFeature,
	JobPath,
	Power,
	Rarity,
	Relic,
	RiftFavorOption,
	Skill,
} from "./5eRulesEngine";
// From 5eRulesEngine — core utility functions and types
export {
	ABILITY_DISPLAY_NAMES,
	formatModifier,
	getAbilityModifier,
	getAvailableFavorOptions,
	getProficiencyBonus,
	getRiftFavorMax,
	LEGACY_5E_TO_SA,
	SKILLS,
} from "./5eRulesEngine";
