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
// AoE templates (lingering spell effects — Roll20 parity)
export {
	AOE_BORDER_COLORS,
	AOE_COLORS,
	type AoEShape,
	type AoETemplate,
	createAoETemplate,
	DEFAULT_CONE_WIDTH,
	getAoEBounds,
	getConeSVGPath,
	getLineSVGPath,
	isCellInAoE,
} from "./aoeTemplates";
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

// Explorer mode fog (tri-state: unexplored / visible / previously explored)
export {
	createExplorerFog,
	type ExplorerFogGrid,
	eraseCells,
	FOG_STATE_STYLES,
	type FogState,
	getFogCellStyle,
	hideCells,
	migrateFromBooleanFog,
	revealCells,
	toBooleanFog,
	toggleFogCell,
	updateFogFromVision,
} from "./explorerFog";

// Foreground layer (overhead tiles — Foundry VTT parity)
export {
	computeTileOpacity,
	createForegroundTile,
	type ForegroundTile,
	type ForegroundTileMode,
	getSceneForegroundTiles,
	getTileTransformCSS,
	isTokenUnderTile,
} from "./foregroundLayer";

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
// Map pins (interactive markers — Roll20 parity)
export {
	createMapPin,
	findPinAtPosition,
	getPinEmoji,
	getScenePins,
	getVisiblePins,
	type MapPin as VTTMapPin,
	type MapPinIcon,
	type MapPinLinkType,
	PIN_COLORS,
	PIN_ICON_EMOJIS,
	PIN_SIZE_PX,
} from "./mapPins";
// Particle effects library (102+ presets)
export {
	getPreset as getParticlePreset,
	listCategories as listParticleCategories,
	listPresets as listParticlePresets,
	PARTICLE_PRESETS,
	type ParticleCategory,
	type ParticlePreset,
} from "./particlePresets";
// Party dashboard
export {
	calculatePartySummary,
	generateAlerts,
	generateDashboard,
	getEncounterMultiplier,
	getEncounterThresholds,
	getUrgencyOrder,
	type PartyAlert,
	type PartyDashboardData,
	type PartyMember,
	type PartySummary,
} from "./partyDashboard";
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
// Token-character deep linking
export {
	applyTokenBarChange,
	type CharacterSyncData,
	createTokenLink,
	getDefaultBarConfig,
	type LinkedStat,
	markerToCondition,
	syncCharacterToToken,
	type TokenBarChange,
	type TokenBarConfig,
	type TokenBarState,
	type TokenLink,
	type TokenSyncResult,
} from "./tokenCharacterLink";
// Token status markers (Roll20 parity)
export {
	BUILT_IN_MARKERS,
	getMarkerBadgeStyle,
	getMarkerById,
	getMarkerClipPath,
	getMarkerDisplayText,
	getMarkerPosition,
	type MarkerShape,
	type MarkerSlot,
	type TokenMarkerAssignment,
	type TokenStatusMarker,
} from "./tokenStatusMarkers";
// VTT Asset Manifest
export {
	ALL_ASSETS,
	type AssetCategory,
	AUDIO_ASSETS,
	EFFECT_ASSETS,
	getAnomalyTokensForTier,
	getAssetSummary,
	getAssetsByCategory,
	getAssetsByTier,
	getMapsForTier,
	MAP_ASSETS,
	MUSIC_ASSETS,
	PROP_ASSETS,
	SFX_ASSET_MAP,
	type SfxEntry,
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
