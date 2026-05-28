// --- Bridge types from lib/vtt ---
export type VTTDrawing = import("@/lib/vtt").VTTDrawing;
export type WallSegment = import("@/lib/vtt").WallSegment;
export type WallDirection = import("@/lib/vtt").WallDirection;
export type WallState = import("@/lib/vtt").WallState;
export type LightSource = import("@/lib/vtt").LightSource;
export type WeatherType = import("@/lib/vtt").WeatherType;
export type TerrainZone = import("@/lib/vtt").TerrainZone;
export type AmbientSoundZone = import("@/lib/vtt").AmbientSoundZone;
export type MusicMood = import("@/lib/vtt").MusicMood;

// --- Misty Pearl A2 — Scene Strata (Foundry v14 multi-floor parity) ---

/**
 * A single stratum (floor / level) inside a multi-level Rift Scene.
 * Tokens may carry `level` + `elevation` to scope which stratum they
 * render in. Lights and walls are scoped via id lists below.
 */
export interface VTTSceneLevel {
	id: string;
	/**
	 * RA-themed display label. Examples: "Stratum 0 — Surface",
	 * "Stratum -1 — Subway", "Stratum +1 — Rooftop".
	 */
	name: string;
	/** Grid units below/above ground. 0 = surface, negative = underground. */
	elevation: number;
	/** Render order. Lower order renders first (below higher orders). */
	order: number;
	visibleToPlayers: boolean;
	backgroundImage?: string;
	wallIds: string[];
	lightIds: string[];
}

// --- Misty Pearl A3 — Rift Regions (Foundry v14 Scene Regions parity) ---

/**
 * Behavior fired when a token enters / exits a Rift Region. Discriminated
 * union — add new kinds here when a new behavior is wired into
 * `evaluateRiftRegionEntry` in `@/lib/vtt/regions.ts`.
 */
export type VTTRegionBehavior =
	| { kind: "difficult_terrain"; multiplier: number }
	| { kind: "damage_on_enter"; dice: string; damageType: string }
	| { kind: "whisper_warden"; message: string }
	| { kind: "apply_condition"; condition: string }
	| { kind: "play_sound"; soundId: string };

export interface VTTRiftRegion {
	id: string;
	name: string;
	/** Polygon vertices in scene-pixel coordinates. Must have ≥3 points. */
	polygon: Array<{ x: number; y: number }>;
	color: string;
	opacity: number;
	visibleToPlayers: boolean;
	behaviors: VTTRegionBehavior[];
}

// --- Misty Pearl B1 — Active Effects v2 (Foundry v14 parity) ---

export type TokenEffectDurationKind =
	| "rounds"
	| "minutes"
	| "until_long_rest"
	| "until_combat_end"
	| "permanent";

export type TokenEffectModifier =
	| { kind: "speed_mult"; value: number }
	| { kind: "ac_delta"; value: number }
	| { kind: "damage_resist"; damageType: string }
	| {
			kind: "advantage";
			rollType: "save" | "attack" | "check";
			tag?: string;
	  }
	| { kind: "hp_regen"; dice: string }
	| { kind: "condition"; conditionId: string };

export interface TokenEffect {
	id: string;
	name: string;
	icon: string;
	origin?: string;
	durationKind: TokenEffectDurationKind;
	/** For 'rounds' / 'minutes' kinds: remaining count. Ignored otherwise. */
	durationValue?: number;
	appliedAt: string;
	modifiers: TokenEffectModifier[];
}

// --- Misty Pearl B4 — Animated / Video Tiles ---

export interface VTTAnimatedTile {
	id: string;
	src: string;
	x: number;
	y: number;
	width: number;
	height: number;
	loop: boolean;
	/** Stratum reference (ties to A2 Scene Strata when shipped). */
	level?: string;
	/** Render opacity 0..1. Defaults to 1 if absent. */
	opacity?: number;
}

export type VTTRenderMode = "token" | "overlay";
export type VTTBlendMode =
	| "normal"
	| "multiply"
	| "screen"
	| "overlay"
	| "lighten"
	| "darken"
	| "color-dodge"
	| "plus-lighter";

export interface VTTRenderConfig {
	mode?: VTTRenderMode;
	opacity?: number;
	blendMode?: VTTBlendMode;
}

export type VTTTokenBarVisibility = "all" | "controllers" | "gm";

export interface VTTTokenBar {
	id: string;
	label: string;
	current: number;
	max: number;
	color: string;
	visible: VTTTokenBarVisibility;
}

export interface VTTAsset {
	id: string;
	name: string;
	type: "token" | "map" | "effect" | "prop" | "character" | "Anomaly" | "npc";
	imageUrl: string;
	thumbnailUrl?: string;
	campaignId?: string;
	isCustom?: boolean;
	uploadedBy?: string;
	uploadedAt?: string;
}

export interface VTTTokenInstance {
	id: string;
	characterId?: string;
	tokenType?: "character" | "Anomaly" | "npc" | "prop" | "effect" | "custom";
	name: string;
	emoji?: string;
	imageUrl?: string;
	portrait_url?: string;
	color?: string;
	size: "tiny" | "small" | "medium" | "large" | "huge" | "gargantuan";
	/** Foundry-parity per-token footprint override in grid units. */
	gridWidth?: number;
	gridHeight?: number;
	/** Image-only scale multiplier, decoupled from grid footprint. */
	imageScale?: number;
	x: number;
	y: number;
	rotation: number;
	layer: number;
	locked: boolean;
	render?: VTTRenderConfig;
	hp?: number;
	hp_current?: number;
	maxHp?: number;
	hp_max?: number;
	bars?: VTTTokenBar[];
	ac?: number;
	armor_class?: number;
	initiative?: number;
	conditions?: string[];
	visible: boolean;
	ownerId?: string;
	auraRadius?: number;
	auraColor?: string;
	lightRadius?: number;
	lightDimRadius?: number;
	visionRange?: number;
	darkvisionRange?: number;
	blindsightRange?: number;
	showNameplate?: boolean;
	barVisibility?: string;
	/** DDB-style token border color (overrides owner default). */
	borderColor?: string;
	/** Shared group id used to move multiple tokens together (Shift+G). */
	groupId?: string;
	/**
	 * Misty Pearl A2 — id of the stratum the token currently occupies.
	 * Tokens without a `level` fall into the default ground stratum.
	 */
	level?: string;
	/**
	 * Misty Pearl A2 — token z-axis altitude in grid units. Positive =
	 * flying / above the stratum surface, negative = burrowing /
	 * below. Pure display until vision/LoS engine consumes it.
	 */
	elevation?: number;
	/**
	 * Misty Pearl B1 — Active Effects v2 (Foundry v14 parity).
	 * Stack of programmatic effects that modify derived stats
	 * (AC / speed / advantages / regen / resistances / conditions)
	 * with explicit expiration policies. Resolved via
	 * `resolveTokenStats()` in `@/lib/vtt/tokenEffects`.
	 */
	effects?: TokenEffect[];
}

export interface VTTAnnotation {
	id: string;
	text: string;
	x: number;
	y: number;
	layer: number;
}

export interface VTTScene {
	id: string;
	name: string;
	width: number;
	height: number;
	backgroundImage?: string;
	backgroundScale?: number;
	backgroundOffsetX?: number;
	backgroundOffsetY?: number;
	gridSize: number;
	gridType: "square" | "hex";
	gridOpacity?: number;
	tokens: VTTTokenInstance[];
	drawings: VTTDrawing[];
	annotations: VTTAnnotation[];
	walls: WallSegment[];
	lights: LightSource[];
	fogOfWar: boolean;
	tokenVisionRevealsFog?: boolean;
	fogData?: boolean[][];
	weather?: WeatherType;
	musicMood?: MusicMood | null;
	musicAutoplay?: boolean;
	musicPlaylistId?: string | null;
	musicTrackId?: string | null;
	terrain?: TerrainZone[];
	ambientSounds?: AmbientSoundZone[];
	/**
	 * Misty Pearl B3 — optional override for the title card text that
	 * appears during a scene transition. Defaults to the scene name when
	 * unset. (Foundry v14 parity.)
	 */
	transitionTitle?: string;
	/**
	 * Misty Pearl A3 — Rift Regions (Foundry v14 Scene Regions parity).
	 * Polygon zones with attached behaviors that fire on token entry.
	 */
	riftRegions?: VTTRiftRegion[];
	/**
	 * Misty Pearl B4 — Animated / video tile overlays. Sit above the
	 * background but below tokens. `src` is typically a `.webm` /
	 * `.mp4` URL or an animated webp / gif.
	 */
	animatedTiles?: VTTAnimatedTile[];
	/**
	 * Misty Pearl A2 — Scene Strata. When present and non-empty, the
	 * scene is treated as multi-floor; tokens with matching
	 * `level === stratum.id` render in that stratum's container, others
	 * fall into the default ground stratum (back-compat for scenes
	 * authored before A2 shipped).
	 */
	levels?: VTTSceneLevel[];
}

export interface VTTJournalEntry {
	id: string;
	title: string;
	content: string;
}

export interface VTTCampaignExport {
	manifestVersion: string;
	campaign: {
		id: string;
		name: string;
		system: string;
		description: string;
	};
	scenes: VTTScene[];
	assets: VTTAsset[];
	tokens: VTTTokenInstance[];
	journals: VTTJournalEntry[];
	compendium: {
		anomalies: import("./compendium").CompendiumAnomaly[];
		items: Array<
			| import("./compendium").CompendiumRelic
			| import("./compendium").CompendiumItem
		>;
	};
}

export const VTT_TYPE_REGISTRY_CERTIFIED = true;
