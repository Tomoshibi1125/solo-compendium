/**
 * Character Calculations — Re-export Barrel
 *
 * This module was consolidated into 5eCharacterCalculations.ts and 5eRulesEngine.ts.
 * This barrel file preserves backward compatibility for all existing importers.
 */

// From 5eRulesEngine — core utility functions and types
export {
    getAbilityModifier,
    formatModifier,
    getProficiencyBonus,
    getAvailableFavorOptions,
    getSystemFavorMax,
    ABILITY_DISPLAY_NAMES,
    LEGACY_5E_TO_SA,
    SKILLS,
} from './5eRulesEngine';

export type {
    AbilityScore,
    Character,
    CharacterAction,
    Skill,
    Rarity,
    Job,
    JobFeature,
    JobPath,
    Power,
    Relic,
    SystemFavorOption,
} from './5eRulesEngine';

// From 5eCharacterCalculations — derived stat computation
export {
    calculateCharacterStats,
    calculateHPMax,
    getCasterType,
    getSpellSlotsPerLevel,
    getSpellcastingAbility,
    getSpellsKnownLimit,
    getSpellsPreparedLimit,
    getSystemFavorDie,
    getCantripsKnownLimit,
} from './5eCharacterCalculations';

export type {
    CharacterStats,
    CalculatedStats,
    CasterType,
} from './5eCharacterCalculations';
