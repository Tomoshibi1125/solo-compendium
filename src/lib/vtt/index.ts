/**
 * VTT Engine Barrel Export
 *
 * Single import point for all VTT sub-engines. Consumers import from
 * `@/lib/vtt` instead of individual files.
 */

// Drawing & measurement
export {
    pointsToSVGPath,
    measureDistance,
    measurePath,
    getTemplateCells,
    circlePath,
    rectPath,
    createDrawing,
    type DrawingPoint,
    type VTTDrawing,
    type MeasurementResult,
    type MeasurementTemplate,
} from './drawingEngine';

// Dynamic lighting
export {
    rayWallIntersection,
    computeVisibilityPolygon,
    isCellVisible,
    computeLightLevel,
    createWall,
    toggleDoor,
    snapToGrid,
    type WallSegment,
    type LightSource,
    type TokenVision,
    type VisibilityPolygon,
} from './lightingEngine';

// Hex grid
export {
    createHexGrid,
    pixelToHex,
    hexToPixel,
    hexDistance,
    hexesInRadius,
    getHexGridSVGPaths,
    snapToHexCenter,
    hexNeighbors,
    type HexGridConfig,
    type HexCell,
    type HexOrientation,
} from './hexGrid';

// Map ping
export {
    createPing,
    pruneExpiredPings,
    isOnCooldown,
    getPingAnimationCSS,
    DEFAULT_PING_CONFIG,
    type MapPing,
    type PingConfig,
} from './mapPing';

// Whisper system
export {
    parseWhisperCommand,
    isMessageVisibleTo,
    createWhisperMessage,
    formatWhisperLabel,
    type WhisperMessage,
    type ChatParticipant,
} from './whisperSystem';

// Inline rolls
export {
    rollDiceExpression,
    parseInlineRolls,
    formatInlineRoll,
    hasInlineRolls,
    type InlineRollResult,
    type ParsedChatMessage,
    type ChatSegment,
} from './inlineRolls';

// Roll macros
export {
    createMacro,
    generateCharacterMacros,
    saveMacrosToLocal,
    loadMacrosFromLocal,
    createDefaultMacroBar,
    getMacroByHotkey,
    type RollMacro,
    type MacroCategory,
    type MacroBar,
} from './rollMacros';

// Terrain & weather
export {
    createTerrainZone,
    isPointInTerrainZone,
    getMovementCostAtPosition,
    getCoverBonusAtPosition,
    getWeatherMechanics,
    getWeatherCSSAnimation,
    TERRAIN_PRESETS,
    WEATHER_PRESETS,
    type TerrainType,
    type WeatherType,
    type TerrainZone,
    type WeatherEffect,
} from './terrainWeatherEngine';

// Ambient sound zones
export {
    createAmbientSoundZone,
    distanceToZone,
    isListenerInZone,
    computeZoneVolume,
    computeAllZoneStates,
    AMBIENT_SOUND_PRESETS,
    type AmbientSoundZone,
    type AmbientSoundState,
} from './ambientSoundZone';

// VTT Asset Manifest
export {
    MAP_ASSETS,
    TOKEN_ASSETS,
    PROP_ASSETS,
    EFFECT_ASSETS,
    AUDIO_ASSETS,
    ALL_ASSETS,
    getAssetsByCategory,
    searchAssets,
    getAssetsByTier,
    getMapsForTier,
    getMonsterTokensForTier,
    getAssetSummary,
    type VTTAsset,
    type AssetCategory,
} from './vttAssetManifest';
