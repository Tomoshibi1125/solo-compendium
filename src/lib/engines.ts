/**
 * Parity Engines Barrel Export
 *
 * Single import point for all parity engine modules (non-VTT).
 * VTT engines are exported from `@/lib/vtt/index.ts` separately.
 */

// Spell effect pipeline
export {
    createActiveSpellEffect,
    spellEffectsToEngineEffects,
    advanceRound,
    dropConcentration,
    hasKnownEffects,
    getKnownSpellEffects,
    type ActiveSpellEffectEntry,
    type SpellModifier,
    type SpellEngineEffect,
} from './spellEffectPipeline';

// Senses engine
export {
    computeSenses,
    formatSenses,
    type CharacterSenses,
    type SenseSource,
} from './sensesEngine';

// Feat & fighting style parser
export {
    parseFightingStyleEffects,
    parseFeatEffects,
    aggregateFeatAndStyleEffects,
    computeAttacksPerAction,
    hasFeatEffects,
    hasFightingStyleEffects,
    type FeatEffect,
} from './featEffectParser';

// Condition system
export {
    applyCondition,
    removeCondition,
    breakConcentrationConditions,
    advanceConditionRound,
    getActiveConditionNames,
    migrateLegacyConditions,
    hasCondition,
    getConditionsFromSource,
    getConditionSummary,
    type ConditionEntry,
    type ConditionChange,
} from './conditionSystem';

// PDF export
export {
    exportCharacterSheetPDF,
    type PDFExportOptions,
    type PDFExportResult,
} from './pdfExport';

// Note privacy
export {
    createSecuredNote,
    createPrivacySettings,
    canViewNote,
    canEditNote,
    canSeeNoteExists,
    setNoteVisibility,
    grantPlayerPermission,
    revokePlayerPermission,
    shareWithAll,
    makePrivate,
    filterVisibleNotes,
    filterReadableNotes,
    type NoteVisibility,
    type NotePermission,
    type NotePrivacySettings,
    type SecuredNote,
} from './notePrivacy';

// Unified effect system
export {
    bridgeFeatEffect,
    bridgeSpellEffect,
    bridgeAllFeatEffects,
    bridgeAllSpellEffects,
    mergeAndSortEffects,
    resolveEffectConflicts,
} from './unifiedEffectSystem';
