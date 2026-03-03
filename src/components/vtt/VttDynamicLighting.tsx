/**
 * VTT Dynamic Lighting Module
 *
 * Re-exports and enhances the existing dynamic lighting infrastructure
 * already built into VttPixiStage. The core raycasting/visibility polygon
 * engine lives in `@/lib/vtt` (computeVisibilityPolygon, createHexGrid).
 * This module provides:
 *
 *  - Type definitions for light sources and walls
 *  - Preset light source configurations
 *  - Utility functions for dynamic lighting operations
 */

// ─── Types ──────────────────────────────────────────────────

export interface LightSource {
    id: string;
    /** Grid coordinate X */
    x: number;
    /** Grid coordinate Y */
    y: number;
    /** Bright light radius in grid squares */
    brightRadius: number;
    /** Dim light radius in grid squares (extends beyond bright) */
    dimRadius: number;
    /** CSS hex color */
    color: string;
    /** Intensity multiplier (0–1) */
    intensity: number;
    /** Whether this light flickers (e.g. torch effect) */
    flicker?: boolean;
    /** Flicker speed multiplier */
    flickerSpeed?: number;
    /** Flicker intensity variance */
    flickerVariance?: number;
    /** Human-readable label */
    label?: string;
}

export interface WallSegment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    /** Whether this wall blocks vision */
    blocksVision: boolean;
    /** Whether this wall blocks movement */
    blocksMovement: boolean;
    /** Whether this is a one-way wall (vision only from one side) */
    oneWay?: boolean;
    /** Whether this is a door (can be opened/closed) */
    isDoor?: boolean;
    doorOpen?: boolean;
}

export interface VisionSource {
    tokenId: string;
    x: number;
    y: number;
    /** Standard vision range in grid squares */
    visionRange: number;
    /** Darkvision range (sees dim as bright, dark as dim) */
    darkvisionRange: number;
    /** Blindsight range (ignores line of sight) */
    blindsightRange: number;
}

// ─── Light Source Presets ────────────────────────────────────

export const LIGHT_PRESETS: Record<string, Omit<LightSource, 'id' | 'x' | 'y'>> = {
    // Standard D&D/SA light sources
    torch: {
        brightRadius: 4,
        dimRadius: 8,
        color: '#ffaa44',
        intensity: 0.85,
        flicker: true,
        flickerSpeed: 1.0,
        flickerVariance: 0.15,
        label: 'Torch',
    },
    lantern: {
        brightRadius: 6,
        dimRadius: 12,
        color: '#ffcc66',
        intensity: 0.9,
        flicker: true,
        flickerSpeed: 0.3,
        flickerVariance: 0.05,
        label: 'Lantern',
    },
    bullseyeLantern: {
        brightRadius: 12,
        dimRadius: 24,
        color: '#ffdd77',
        intensity: 0.95,
        label: 'Bullseye Lantern',
    },
    candle: {
        brightRadius: 1,
        dimRadius: 2,
        color: '#ffbb55',
        intensity: 0.6,
        flicker: true,
        flickerSpeed: 1.5,
        flickerVariance: 0.25,
        label: 'Candle',
    },
    lightSpell: {
        brightRadius: 4,
        dimRadius: 8,
        color: '#ffffff',
        intensity: 0.9,
        label: 'Light (Cantrip)',
    },
    daylight: {
        brightRadius: 12,
        dimRadius: 24,
        color: '#ffffee',
        intensity: 1.0,
        label: 'Daylight',
    },
    dancingLights: {
        brightRadius: 2,
        dimRadius: 2,
        color: '#aaddff',
        intensity: 0.7,
        flicker: true,
        flickerSpeed: 0.8,
        flickerVariance: 0.1,
        label: 'Dancing Lights',
    },
    continuousFlame: {
        brightRadius: 4,
        dimRadius: 8,
        color: '#ff8844',
        intensity: 0.85,
        label: 'Continual Flame',
    },

    // SA-specific / thematic lights
    gateGlow: {
        brightRadius: 6,
        dimRadius: 10,
        color: '#8844ff',
        intensity: 0.75,
        flicker: true,
        flickerSpeed: 0.4,
        flickerVariance: 0.08,
        label: 'Gate Resonance Glow',
    },
    shadowFlicker: {
        brightRadius: 2,
        dimRadius: 6,
        color: '#664488',
        intensity: 0.5,
        flicker: true,
        flickerSpeed: 2.0,
        flickerVariance: 0.3,
        label: 'Shadow Flicker',
    },
    monarchPresence: {
        brightRadius: 8,
        dimRadius: 16,
        color: '#ffcc00',
        intensity: 0.9,
        flicker: true,
        flickerSpeed: 0.2,
        flickerVariance: 0.04,
        label: 'Monarch Presence',
    },
    necroticAura: {
        brightRadius: 3,
        dimRadius: 8,
        color: '#44ff44',
        intensity: 0.6,
        flicker: true,
        flickerSpeed: 0.6,
        flickerVariance: 0.12,
        label: 'Necrotic Aura',
    },
    radiantBeacon: {
        brightRadius: 10,
        dimRadius: 20,
        color: '#ffffcc',
        intensity: 1.0,
        label: 'Radiant Beacon',
    },
    campfire: {
        brightRadius: 4,
        dimRadius: 12,
        color: '#ff6622',
        intensity: 0.8,
        flicker: true,
        flickerSpeed: 0.7,
        flickerVariance: 0.18,
        label: 'Campfire',
    },

    // Additional standard lights
    brazier: {
        brightRadius: 6, dimRadius: 10, color: '#ff7744', intensity: 0.85,
        flicker: true, flickerSpeed: 0.5, flickerVariance: 0.12, label: 'Brazier',
    },
    forgeLight: {
        brightRadius: 8, dimRadius: 14, color: '#ff4422', intensity: 0.9,
        flicker: true, flickerSpeed: 0.9, flickerVariance: 0.1, label: 'Forge / Furnace',
    },
    moonlight: {
        brightRadius: 0, dimRadius: 20, color: '#aabbdd', intensity: 0.35,
        label: 'Moonlight (Dim)',
    },
    bioluminescence: {
        brightRadius: 2, dimRadius: 6, color: '#44ddcc', intensity: 0.55,
        flicker: true, flickerSpeed: 0.3, flickerVariance: 0.06, label: 'Bioluminescence',
    },
    faerieFire: {
        brightRadius: 2, dimRadius: 2, color: '#ff66ff', intensity: 0.7,
        flicker: true, flickerSpeed: 1.2, flickerVariance: 0.08, label: 'Faerie Fire',
    },
    streetLamp: {
        brightRadius: 4, dimRadius: 10, color: '#ffdd88', intensity: 0.8,
        label: 'Street Lamp / Sconce',
    },
    crystalGlow: {
        brightRadius: 3, dimRadius: 8, color: '#88ccff', intensity: 0.65,
        flicker: true, flickerSpeed: 0.2, flickerVariance: 0.04, label: 'Crystal / Gem Glow',
    },
    inferno: {
        brightRadius: 10, dimRadius: 20, color: '#ff3300', intensity: 1.0,
        flicker: true, flickerSpeed: 1.5, flickerVariance: 0.2, label: 'Inferno / Blaze',
    },
    witchLight: {
        brightRadius: 3, dimRadius: 6, color: '#66ff88', intensity: 0.6,
        flicker: true, flickerSpeed: 0.6, flickerVariance: 0.15, label: 'Witch Light / Will-o-Wisp',
    },
    starlight: {
        brightRadius: 0, dimRadius: 12, color: '#ccccff', intensity: 0.25,
        label: 'Starlight (Very Dim)',
    },
    dimCorridor: {
        brightRadius: 1, dimRadius: 4, color: '#998877', intensity: 0.4,
        flicker: true, flickerSpeed: 0.3, flickerVariance: 0.08, label: 'Dim Corridor / Dungeon',
    },
    lavaGlow: {
        brightRadius: 4, dimRadius: 10, color: '#ff5500', intensity: 0.8,
        flicker: true, flickerSpeed: 0.4, flickerVariance: 0.1, label: 'Lava Glow',
    },
};

// ─── Utility Functions ──────────────────────────────────────

/**
 * Create a LightSource from a preset key and a position.
 */
export function createLightFromPreset(
    presetKey: string,
    x: number,
    y: number,
): LightSource {
    const preset = LIGHT_PRESETS[presetKey];
    if (!preset) throw new Error(`Unknown light preset: ${presetKey}`);
    return {
        id: `light-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        x,
        y,
        ...preset,
    };
}

/**
 * Compute a flickering intensity value using time and the light's flicker settings.
 * Returns the effective intensity for this frame.
 */
export function computeFlickerIntensity(light: LightSource, timeSeconds: number): number {
    if (!light.flicker) return light.intensity;
    const speed = light.flickerSpeed ?? 1.0;
    const variance = light.flickerVariance ?? 0.1;
    // Use multiple sine waves for organic flicker
    const flicker =
        Math.sin(timeSeconds * speed * 6.28) * 0.4 +
        Math.sin(timeSeconds * speed * 3.14 * 1.7) * 0.3 +
        Math.sin(timeSeconds * speed * 9.42 * 0.6) * 0.3;
    return Math.max(0.1, light.intensity + flicker * variance);
}

/**
 * Get all available light preset keys.
 */
export function listLightPresets(): Array<{ key: string; label: string }> {
    return Object.entries(LIGHT_PRESETS).map(([key, preset]) => ({
        key,
        label: preset.label ?? key,
    }));
}
