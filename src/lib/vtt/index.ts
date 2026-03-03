/**
 * VTT Engine Barrel Export
 *
 * Single import point for all VTT sub-engines. Consumers import from
 * `@/lib/vtt` instead of individual files.
 */

// Ambient sound zones
export {
	AMBIENT_SOUND_PRESETS,
	type AmbientSoundState,
	type AmbientSoundZone,
	computeAllZoneStates,
	computeZoneVolume,
	createAmbientSoundZone,
	distanceToZone,
	isListenerInZone,
} from "./ambientSoundZone";
// Drawing & measurement
export {
	circlePath,
	createDrawing,
	type DrawingPoint,
	getTemplateCells,
	type MeasurementResult,
	type MeasurementTemplate,
	measureDistance,
	measurePath,
	pointsToSVGPath,
	rectPath,
	type VTTDrawing,
} from "./drawingEngine";

// Hex grid
export {
	createHexGrid,
	getHexGridSVGPaths,
	type HexCell,
	type HexGridConfig,
	type HexOrientation,
	hexDistance,
	hexesInRadius,
	hexNeighbors,
	hexToPixel,
	pixelToHex,
	snapToHexCenter,
} from "./hexGrid";
// Inline rolls
export {
	type ChatSegment,
	formatInlineRoll,
	hasInlineRolls,
	type InlineRollResult,
	type ParsedChatMessage,
	parseInlineRolls,
	rollDiceExpression,
} from "./inlineRolls";
// Dynamic lighting
export {
	computeLightLevel,
	computeVisibilityPolygon,
	createWall,
	isCellVisible,
	type LightSource,
	rayWallIntersection,
	snapToGrid,
	type TokenVision,
	toggleDoor,
	type VisibilityPolygon,
	type WallSegment,
} from "./lightingEngine";
// Map ping
export {
	createPing,
	DEFAULT_PING_CONFIG,
	getPingAnimationCSS,
	isOnCooldown,
	type MapPing,
	type PingConfig,
	pruneExpiredPings,
} from "./mapPing";
// Particle effects library (102+ presets)
export {
	getPreset as getParticlePreset,
	listCategories as listParticleCategories,
	listPresets as listParticlePresets,
	PARTICLE_PRESETS,
	type ParticleCategory,
	type ParticlePreset,
} from "./particlePresets";
// Roll macros
export {
	createDefaultMacroBar,
	createMacro,
	generateCharacterMacros,
	getMacroByHotkey,
	loadMacrosFromLocal,
	type MacroBar,
	type MacroCategory,
	type RollMacro,
	saveMacrosToLocal,
} from "./rollMacros";
// Terrain & weather
export {
	createTerrainZone,
	getCoverBonusAtPosition,
	getMovementCostAtPosition,
	getWeatherCSSAnimation,
	getWeatherMechanics,
	isPointInTerrainZone,
	TERRAIN_PRESETS,
	type TerrainType,
	type TerrainZone,
	WEATHER_PRESETS,
	type WeatherEffect,
	type WeatherType,
} from "./terrainWeatherEngine";

// VTT Asset Manifest
export {
	ALL_ASSETS,
	type AssetCategory,
	AUDIO_ASSETS,
	EFFECT_ASSETS,
	getAssetSummary,
	getAssetsByCategory,
	getAssetsByTier,
	getMapsForTier,
	getMonsterTokensForTier,
	MAP_ASSETS,
	MUSIC_ASSETS,
	PROP_ASSETS,
	searchAssets,
	TOKEN_ASSETS,
	type VTTAsset,
} from "./vttAssetManifest";
// Procedural ambient music engine (20 moods, zero copyright)
export {
	type MusicMood,
	VttMusicEngine,
} from "./vttMusicEngine";
// Whisper system
export {
	type ChatParticipant,
	createWhisperMessage,
	formatWhisperLabel,
	isMessageVisibleTo,
	parseWhisperCommand,
	type WhisperMessage,
} from "./whisperSystem";
