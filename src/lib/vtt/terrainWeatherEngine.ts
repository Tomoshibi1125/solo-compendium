/**
 * Terrain & Weather Overlay Engine
 *
 * Provides terrain classification zones and animated weather overlays for the VTT
 * canvas. Terrain zones affect movement costs, and weather effects add visual
 * atmosphere and optional mechanical penalties (obscurement, difficult terrain).
 *
 * Foundry VTT parity feature.
 */

// ─── Types ──────────────────────────────────────────────────

export type TerrainType =
	| "normal"
	| "difficult" // half speed
	| "hazardous" // damage per round
	| "water_shallow" // difficult terrain
	| "water_deep" // swim speed required
	| "lava" // extreme damage
	| "ice" // AGI save or fall prone
	| "mud" // half speed + STR save
	| "magical" // Warden-defined effect
	| "elevated" // height advantage
	| "pit" // fall hazard
	| "cover_half" // +2 AC
	| "cover_three_quarter" // +5 AC
	| "cover_full"; // total cover

export type WeatherType =
	| "clear"
	| "rain"
	| "heavy_rain"
	| "snow"
	| "blizzard"
	| "fog"
	| "dense_fog"
	| "sandstorm"
	| "wind"
	| "thunderstorm"
	| "magical_darkness"
	| "ash_fall";

export interface TerrainZone {
	id: string;
	type: TerrainType;
	/** Polygon vertices in grid coordinates */
	vertices: { x: number; y: number }[];
	/** Movement cost multiplier (1 = normal, 2 = difficult, 0 = impassable) */
	movementCost: number;
	/** RGBA fill color for overlay */
	fillColor: string;
	/** Optional per-round damage (lava, hazardous) */
	damagePerRound?: { dice: string; type: string };
	/** Optional save DC (ice, mud) */
	saveDC?: number;
	/** Cover bonus to AC */
	coverAC?: number;
	label?: string;
	visible: boolean;
}

export interface WeatherEffect {
	id: string;
	type: WeatherType;
	intensity: number; // 0–1 scale
	/** Visibility reduction in feet (0 = no effect) */
	visibilityReduction: number;
	/** Whether this creates difficult terrain */
	difficultTerrain: boolean;
	/** Whether ranged attacks have disadvantage */
	rangedDisadvantage: boolean;
	/** Particle count per frame (for rendering) */
	particleCount: number;
	/** Particle velocity { dx, dy } per frame */
	particleVelocity: { dx: number; dy: number };
	/** Particle color/opacity */
	particleColor: string;
	/** Optional associated sound (e.g., thunder, wind) */
	ambientSoundId?: string;
}

// ─── Terrain Presets ────────────────────────────────────────

export const TERRAIN_PRESETS: Record<
	TerrainType,
	Omit<TerrainZone, "id" | "vertices" | "visible">
> = {
	normal: {
		type: "normal",
		movementCost: 1,
		fillColor: "rgba(0,0,0,0)",
		label: "Normal",
	},
	difficult: {
		type: "difficult",
		movementCost: 2,
		fillColor: "rgba(139,90,43,0.25)",
		label: "Difficult Terrain",
	},
	hazardous: {
		type: "hazardous",
		movementCost: 2,
		fillColor: "rgba(200,50,50,0.3)",
		label: "Hazardous",
		damagePerRound: { dice: "1d6", type: "varies" },
	},
	water_shallow: {
		type: "water_shallow",
		movementCost: 2,
		fillColor: "rgba(65,105,225,0.2)",
		label: "Shallow Water",
	},
	water_deep: {
		type: "water_deep",
		movementCost: 0,
		fillColor: "rgba(0,0,139,0.35)",
		label: "Deep Water",
	},
	lava: {
		type: "lava",
		movementCost: 0,
		fillColor: "rgba(255,69,0,0.5)",
		label: "Lava",
		damagePerRound: { dice: "10d10", type: "fire" },
	},
	ice: {
		type: "ice",
		movementCost: 2,
		fillColor: "rgba(173,216,230,0.25)",
		label: "Ice",
		saveDC: 10,
	},
	mud: {
		type: "mud",
		movementCost: 2,
		fillColor: "rgba(101,67,33,0.3)",
		label: "Mud",
		saveDC: 12,
	},
	magical: {
		type: "magical",
		movementCost: 1,
		fillColor: "rgba(138,43,226,0.2)",
		label: "Magical Zone",
	},
	elevated: {
		type: "elevated",
		movementCost: 1,
		fillColor: "rgba(200,200,200,0.15)",
		label: "Elevated",
	},
	pit: {
		type: "pit",
		movementCost: 0,
		fillColor: "rgba(30,30,30,0.4)",
		label: "Pit",
	},
	cover_half: {
		type: "cover_half",
		movementCost: 1,
		fillColor: "rgba(100,100,100,0.15)",
		label: "Half Cover",
		coverAC: 2,
	},
	cover_three_quarter: {
		type: "cover_three_quarter",
		movementCost: 1,
		fillColor: "rgba(100,100,100,0.25)",
		label: "Three-Quarter Cover",
		coverAC: 5,
	},
	cover_full: {
		type: "cover_full",
		movementCost: 0,
		fillColor: "rgba(100,100,100,0.4)",
		label: "Full Cover",
		coverAC: 99,
	},
};

// ─── Weather Presets ────────────────────────────────────────

export const WEATHER_PRESETS: Record<WeatherType, WeatherEffect> = {
	clear: {
		id: "w-clear",
		type: "clear",
		intensity: 0,
		visibilityReduction: 0,
		difficultTerrain: false,
		rangedDisadvantage: false,
		particleCount: 0,
		particleVelocity: { dx: 0, dy: 0 },
		particleColor: "transparent",
	},
	rain: {
		id: "w-rain",
		type: "rain",
		intensity: 0.4,
		visibilityReduction: 0,
		difficultTerrain: false,
		rangedDisadvantage: false,
		particleCount: 80,
		particleVelocity: { dx: -1, dy: 6 },
		particleColor: "rgba(100,150,255,0.3)",
	},
	heavy_rain: {
		id: "w-hrain",
		type: "heavy_rain",
		intensity: 0.8,
		visibilityReduction: 100,
		difficultTerrain: false,
		rangedDisadvantage: true,
		particleCount: 200,
		particleVelocity: { dx: -2, dy: 10 },
		particleColor: "rgba(80,120,220,0.5)",
	},
	snow: {
		id: "w-snow",
		type: "snow",
		intensity: 0.3,
		visibilityReduction: 0,
		difficultTerrain: true,
		rangedDisadvantage: false,
		particleCount: 60,
		particleVelocity: { dx: 0.5, dy: 1 },
		particleColor: "rgba(255,255,255,0.6)",
	},
	blizzard: {
		id: "w-blizzard",
		type: "blizzard",
		intensity: 1.0,
		visibilityReduction: 30,
		difficultTerrain: true,
		rangedDisadvantage: true,
		particleCount: 300,
		particleVelocity: { dx: 5, dy: 3 },
		particleColor: "rgba(220,230,255,0.7)",
	},
	fog: {
		id: "w-fog",
		type: "fog",
		intensity: 0.5,
		visibilityReduction: 60,
		difficultTerrain: false,
		rangedDisadvantage: false,
		particleCount: 0,
		particleVelocity: { dx: 0, dy: 0 },
		particleColor: "rgba(200,200,200,0.4)",
	},
	dense_fog: {
		id: "w-dfog",
		type: "dense_fog",
		intensity: 0.9,
		visibilityReduction: 10,
		difficultTerrain: false,
		rangedDisadvantage: true,
		particleCount: 0,
		particleVelocity: { dx: 0, dy: 0 },
		particleColor: "rgba(180,180,180,0.6)",
	},
	sandstorm: {
		id: "w-sand",
		type: "sandstorm",
		intensity: 0.8,
		visibilityReduction: 30,
		difficultTerrain: true,
		rangedDisadvantage: true,
		particleCount: 250,
		particleVelocity: { dx: 8, dy: 1 },
		particleColor: "rgba(210,180,120,0.5)",
	},
	wind: {
		id: "w-wind",
		type: "wind",
		intensity: 0.5,
		visibilityReduction: 0,
		difficultTerrain: false,
		rangedDisadvantage: true,
		particleCount: 0,
		particleVelocity: { dx: 0, dy: 0 },
		particleColor: "transparent",
	},
	thunderstorm: {
		id: "w-thunder",
		type: "thunderstorm",
		intensity: 0.9,
		visibilityReduction: 60,
		difficultTerrain: false,
		rangedDisadvantage: true,
		particleCount: 200,
		particleVelocity: { dx: -3, dy: 8 },
		particleColor: "rgba(80,100,200,0.4)",
		ambientSoundId: "sfx-thunder",
	},
	magical_darkness: {
		id: "w-magdark",
		type: "magical_darkness",
		intensity: 1.0,
		visibilityReduction: 0,
		difficultTerrain: false,
		rangedDisadvantage: true,
		particleCount: 40,
		particleVelocity: { dx: 0, dy: -0.5 },
		particleColor: "rgba(20,0,40,0.7)",
	},
	ash_fall: {
		id: "w-ash",
		type: "ash_fall",
		intensity: 0.6,
		visibilityReduction: 30,
		difficultTerrain: false,
		rangedDisadvantage: false,
		particleCount: 100,
		particleVelocity: { dx: 0.3, dy: 2 },
		particleColor: "rgba(100,100,100,0.4)",
	},
};

// ─── Engine Functions ───────────────────────────────────────

/**
 * Create a terrain zone from a preset and polygon vertices
 */
export function createTerrainZone(
	type: TerrainType,
	vertices: { x: number; y: number }[],
	overrides?: Partial<TerrainZone>,
): TerrainZone {
	const preset = TERRAIN_PRESETS[type];
	return {
		id: `terrain-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		...preset,
		vertices,
		visible: true,
		...overrides,
	};
}

/**
 * Check if a point is inside a terrain zone polygon (ray casting)
 */
export function isPointInTerrainZone(
	px: number,
	py: number,
	zone: TerrainZone,
): boolean {
	const { vertices } = zone;
	let inside = false;
	for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
		const xi = vertices[i].x,
			yi = vertices[i].y;
		const xj = vertices[j].x,
			yj = vertices[j].y;
		const intersect =
			yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}
	return inside;
}

/**
 * Get effective movement cost at a position across all terrain zones
 */
export function getMovementCostAtPosition(
	px: number,
	py: number,
	zones: TerrainZone[],
): number {
	let maxCost = 1;
	for (const zone of zones) {
		if (zone.visible && isPointInTerrainZone(px, py, zone)) {
			if (zone.movementCost === 0) return 0; // Impassable
			maxCost = Math.max(maxCost, zone.movementCost);
		}
	}
	return maxCost;
}

/**
 * Get cover AC bonus at a position
 */
export function getCoverBonusAtPosition(
	px: number,
	py: number,
	zones: TerrainZone[],
): number {
	let maxCover = 0;
	for (const zone of zones) {
		if (zone.visible && zone.coverAC && isPointInTerrainZone(px, py, zone)) {
			maxCover = Math.max(maxCover, zone.coverAC);
		}
	}
	return maxCover;
}

/**
 * Get the current weather's mechanical effect summary
 */
export function getWeatherMechanics(weather: WeatherEffect): {
	isObscured: boolean;
	isDifficultTerrain: boolean;
	rangedDisadvantage: boolean;
	visibilityFeet: number | null;
} {
	return {
		isObscured: weather.visibilityReduction > 0,
		isDifficultTerrain: weather.difficultTerrain,
		rangedDisadvantage: weather.rangedDisadvantage,
		visibilityFeet:
			weather.visibilityReduction > 0
				? Math.max(5, 120 - weather.visibilityReduction)
				: null,
	};
}

/**
 * Generate CSS keyframe animation name for weather particles
 */
export function getWeatherCSSAnimation(weather: WeatherEffect): string {
	if (weather.particleCount === 0) return "";
	const { dx, dy } = weather.particleVelocity;
	return `
@keyframes weather-particle-${weather.type} {
  0%   { transform: translate(0, 0); opacity: ${weather.intensity}; }
  100% { transform: translate(${dx * 100}px, ${dy * 100}px); opacity: 0; }
}`;
}
