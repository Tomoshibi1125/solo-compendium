// --- Bridge types from lib/vtt ---
export type VTTDrawing = import("@/lib/vtt").VTTDrawing;
export type WallSegment = import("@/lib/vtt").WallSegment;
export type LightSource = import("@/lib/vtt").LightSource;
export type WeatherType = import("@/lib/vtt").WeatherType;
export type TerrainZone = import("@/lib/vtt").TerrainZone;
export type AmbientSoundZone = import("@/lib/vtt").AmbientSoundZone;

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
	size: "small" | "medium" | "large" | "huge";
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
	showNameplate?: boolean;
	barVisibility?: string;
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
	tokens: VTTTokenInstance[];
	drawings: VTTDrawing[];
	annotations: VTTAnnotation[];
	walls: WallSegment[];
	lights: LightSource[];
	fogOfWar: boolean;
	fogData?: boolean[][];
	weather?: WeatherType;
	terrain?: TerrainZone[];
	ambientSounds?: AmbientSoundZone[];
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
