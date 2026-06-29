/**
 * Rift Ascendant Component & Utility Barrels
 * This file formally exports and wires application features and utilities
 * that might be dynamically loaded, externally requested, or pending UI implementation.
 */

// --- UI Components ---
export * from "./components/CharacterLevelUp";
export * from "./components/CharacterSheet/LongRestDialog";
export * from "./components/CharacterSheet/ProficienciesLanguages";
export * from "./components/CharacterSheet/SensesDisplay";
export * from "./components/character/CharacterFAB";
export * from "./components/character/CharacterResourcesPanel";
export * from "./components/character/LimitedUseTracker";
export * from "./components/character/SovereignOverlayPanel";
export * from "./components/compendium/SendToInventoryDialog";
// --- Libraries ---
export * from "./data/compendium/providers/utils";
export * from "./data/compendium/regentPortraits";
export * from "./data/compendium/rollableTables";
export * from "./data/compendium/sandbox/sandbox-sessions";
export * from "./data/compendium/shadow-soldiers";
// staticDataProvider deleted — was an orphan duplicate of providers/index.ts
// missing rollableTables. Canonical source is providers/index.ts. (May 2026 audit M10)
export * from "./data/compendium/wardenToolConfig";
export * from "./data/toolCatalogs";
// --- Hooks ---
export * from "./hooks/useAudioProtocol";
export * from "./hooks/useCampaignHandouts";
export * from "./hooks/useCharacterAbilities";
export * from "./hooks/useCharacters";
export * from "./lib/5eCharacterCalculations";
export * from "./lib/acFormulas";
export * from "./lib/ai/hooks";
export * from "./lib/anomalyImageResolver";
export * from "./lib/campaignNoteContent";
export * from "./lib/canonicalCompendium";
export * from "./lib/characterCreation";
export * from "./lib/compendiumAudit";
export * from "./lib/customActions";
export * from "./lib/damageApplication";
export * from "./lib/deathSaves";
export * from "./lib/fieldOverrides";
export * from "./lib/fullTextSearch";
export * from "./lib/resourceTracking";
export * from "./lib/restAutomation";
export {
	gainRiftFavor,
	getAffordableOptions,
	getAvailableFavorOptions,
	initializeRiftFavor,
	type RiftFavorOption,
	type RiftFavorState,
	resetOnLongRest,
	type SpendResult,
	spendRiftFavor,
	updateForLevel,
} from "./lib/riftFavor";
export * from "./lib/spellCasting";
export * from "./lib/treasureGenerator";
