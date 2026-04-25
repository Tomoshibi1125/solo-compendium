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
export * from "./components/vtt/ConnectedPlayersPopover";
export * from "./components/vtt/dice/DiceVisibilityControl";
export * from "./components/vtt/GameSettingsDrawer";
export * from "./components/vtt/LayerQuickSwitch";
export * from "./components/vtt/SessionControlsMenu";
export * from "./components/vtt/TokenActionBar";
export * from "./components/vtt/VTTDrawer";
export * from "./components/vtt/VTTIconRail";
export * from "./components/vtt/VTTInitiativePanel";
export * from "./components/vtt/VTTMobileTabBar";
export * from "./components/vtt/VTTPointerOverlay";
export * from "./components/vtt/VTTTopBar";
export * from "./components/vtt/VTTZoomHud";
export * from "./components/vtt/VttDomFallbackSurface";
// --- Libraries ---
export * from "./data/compendium/providers/utils";
export * from "./data/compendium/regentPortraits";
export * from "./data/compendium/rollableTables";
export * from "./data/compendium/sandbox/sandbox-sessions";
export * from "./data/compendium/shadow-soldiers";
export * from "./data/compendium/staticDataProvider";
export * from "./data/compendium/wardenToolConfig";
export * from "./data/toolCatalogs";
// --- Hooks ---
export * from "./hooks/useAudioProtocol";
export * from "./hooks/useCampaignHandouts";
export * from "./hooks/useCharacterAbilities";
export * from "./hooks/useCharacters";
export * from "./hooks/useVTTRealtime";
export * from "./hooks/useWardenAudio";
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
export * from "./lib/vtt";
export * from "./lib/vtt/backgroundTransform";
export * from "./lib/vtt/fogRects";
export * from "./lib/vtt/sceneAudio";
export * from "./lib/vtt/sceneState";
export * from "./lib/vtt/tokenSizing";
