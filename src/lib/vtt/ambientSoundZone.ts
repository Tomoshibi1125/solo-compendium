/**
 * Ambient Positional Sound Zone Engine
 *
 * Provides spatial audio zones on the VTT canvas. Each zone has a center point,
 * radius, and an associated audio track that plays with distance-based volume
 * falloff relative to the camera/token position.
 *
 * Uses Howler.js for playback (already installed). Zone audio fades in/out
 * based on listener proximity.
 *
 * Foundry VTT parity feature.
 */

// ─── Types ──────────────────────────────────────────────────

export type AmbientSoundShape = 'circle' | 'rectangle';

export interface AmbientSoundZone {
    id: string;
    /** Display name for DM panel */
    label: string;
    /** Center position in grid coordinates */
    x: number;
    y: number;
    /** Shape of the falloff region */
    shape: AmbientSoundShape;
    /** Radius in grid squares (for circle) */
    radius: number;
    /** Width/height in grid squares (for rectangle) */
    width?: number;
    height?: number;
    /** Audio track URL or built-in SFX key */
    audioUrl: string;
    /** Base volume at center (0–1) */
    volume: number;
    /** Whether the sound loops */
    loop: boolean;
    /** Whether this zone is currently active */
    enabled: boolean;
    /** Visibility to players (they hear it but don't see the zone) */
    gmOnly: boolean;
    /** Whether walls block this sound */
    walledOcclusion: boolean;
    /** Falloff curve: 'linear' drops uniformly, 'exponential' drops sharp near edge */
    falloff: 'linear' | 'exponential' | 'none';
    /** Category tag for filtering */
    category: 'ambient' | 'music' | 'effect' | 'environment';
}

export interface AmbientSoundState {
    zoneId: string;
    isPlaying: boolean;
    currentVolume: number;
    distanceToListener: number;
}

// ─── Sound Zone Factory ─────────────────────────────────────

/**
 * Create a new ambient sound zone with sensible defaults
 */
export function createAmbientSoundZone(
    partial: Partial<AmbientSoundZone> & Pick<AmbientSoundZone, 'x' | 'y' | 'audioUrl'>,
): AmbientSoundZone {
    return {
        id: `amb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label: 'Ambient Sound',
        shape: 'circle',
        radius: 5,
        volume: 0.6,
        loop: true,
        enabled: true,
        gmOnly: true,
        walledOcclusion: false,
        falloff: 'linear',
        category: 'ambient',
        ...partial,
    };
}

// ─── Distance & Volume Calculations ─────────────────────────

/**
 * Calculate distance from a listener position to the zone edge.
 * Returns 0 if the listener is inside the zone.
 */
export function distanceToZone(
    listenerX: number, listenerY: number,
    zone: AmbientSoundZone,
): number {
    if (zone.shape === 'circle') {
        const dx = listenerX - zone.x;
        const dy = listenerY - zone.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return Math.max(0, dist - zone.radius);
    }

    // Rectangle
    const halfW = (zone.width ?? zone.radius * 2) / 2;
    const halfH = (zone.height ?? zone.radius * 2) / 2;
    const dx = Math.max(0, Math.abs(listenerX - zone.x) - halfW);
    const dy = Math.max(0, Math.abs(listenerY - zone.y) - halfH);
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a listener is within the active radius of a zone
 */
export function isListenerInZone(
    listenerX: number, listenerY: number,
    zone: AmbientSoundZone,
): boolean {
    return distanceToZone(listenerX, listenerY, zone) === 0;
}

/**
 * Compute the effective volume for a zone given the listener's position.
 * Returns 0 if outside the zone's hearing range (2× radius).
 */
export function computeZoneVolume(
    listenerX: number, listenerY: number,
    zone: AmbientSoundZone,
): number {
    if (!zone.enabled) return 0;

    const dist = distanceToZone(listenerX, listenerY, zone);
    const hearingRange = zone.radius; // Sound audible within the radius

    if (dist >= hearingRange) return 0;
    if (dist === 0) return zone.volume;

    const ratio = dist / hearingRange;

    switch (zone.falloff) {
        case 'none':
            return zone.volume;
        case 'exponential':
            return zone.volume * Math.pow(1 - ratio, 2);
        case 'linear':
        default:
            return zone.volume * (1 - ratio);
    }
}

/**
 * Process all zones for a given listener position.
 * Returns the desired state for each zone (volume, playing).
 */
export function computeAllZoneStates(
    listenerX: number, listenerY: number,
    zones: AmbientSoundZone[],
): AmbientSoundState[] {
    return zones
        .filter((z) => z.enabled)
        .map((zone) => {
            const dist = distanceToZone(listenerX, listenerY, zone);
            const vol = computeZoneVolume(listenerX, listenerY, zone);
            return {
                zoneId: zone.id,
                isPlaying: vol > 0.01,
                currentVolume: Math.round(vol * 100) / 100,
                distanceToListener: Math.round(dist * 10) / 10,
            };
        });
}

// ─── Preset Ambient Sounds ──────────────────────────────────

export const AMBIENT_SOUND_PRESETS: Record<string, Partial<AmbientSoundZone>> = {
    // Natural environments
    'campfire': { label: 'Campfire', radius: 3, category: 'environment', falloff: 'exponential' },
    'waterfall': { label: 'Waterfall', radius: 8, category: 'environment', falloff: 'linear' },
    'river': { label: 'River', radius: 5, category: 'environment', falloff: 'linear', shape: 'rectangle' },
    'wind': { label: 'Wind', radius: 15, category: 'environment', falloff: 'none' },
    'thunder': { label: 'Thunder', radius: 30, category: 'environment', falloff: 'none' },
    'birds': { label: 'Bird Song', radius: 10, category: 'environment', falloff: 'linear' },
    'rain': { label: 'Rain', radius: 20, category: 'environment', falloff: 'none' },
    'ocean': { label: 'Ocean Waves', radius: 12, category: 'environment', falloff: 'linear' },
    'insects': { label: 'Insects / Cicadas', radius: 8, category: 'environment', falloff: 'linear' },
    'volcano': { label: 'Volcanic Rumble', radius: 15, category: 'environment', falloff: 'exponential' },
    'swamp': { label: 'Swamp Bubbles', radius: 6, category: 'environment', falloff: 'exponential' },
    'wolves': { label: 'Wolf Howls', radius: 20, category: 'environment', falloff: 'linear' },
    'crickets': { label: 'Night Crickets', radius: 12, category: 'environment', falloff: 'linear' },
    'storm': { label: 'Heavy Storm', radius: 30, category: 'environment', falloff: 'none' },
    'desert_wind': { label: 'Desert Wind', radius: 18, category: 'environment', falloff: 'none' },
    'jungle': { label: 'Dense Jungle', radius: 10, category: 'environment', falloff: 'linear' },
    'creek': { label: 'Babbling Creek', radius: 4, category: 'environment', falloff: 'exponential' },

    // Interior / Urban
    'crowd': { label: 'Tavern Crowd', radius: 6, category: 'ambient', falloff: 'exponential' },
    'cave_drip': { label: 'Cave Drip', radius: 4, category: 'ambient', falloff: 'exponential' },
    'forge': { label: 'Forge', radius: 5, category: 'environment', falloff: 'exponential' },
    'machinery': { label: 'Machinery', radius: 6, category: 'environment', falloff: 'linear' },
    'market': { label: 'Market Bustle', radius: 8, category: 'ambient', falloff: 'exponential' },
    'dungeon_creak': { label: 'Dungeon Creaks', radius: 10, category: 'ambient', falloff: 'linear' },
    'library': { label: 'Library Whispers', radius: 4, category: 'ambient', falloff: 'exponential' },
    'church_bells': { label: 'Church Bells', radius: 15, category: 'ambient', falloff: 'linear' },
    'prison': { label: 'Prison / Jail', radius: 6, category: 'ambient', falloff: 'exponential' },
    'sewer': { label: 'Sewer Drains', radius: 5, category: 'ambient', falloff: 'exponential' },
    'arena': { label: 'Arena / Colosseum Crowd', radius: 12, category: 'ambient', falloff: 'linear' },
    'workshop': { label: 'Tinkerer Workshop', radius: 4, category: 'ambient', falloff: 'exponential' },
    'clock_tower': { label: 'Clock Tower Ticking', radius: 3, category: 'ambient', falloff: 'exponential' },

    // Mystical / SA-specific
    'chanting': { label: 'Chanting', radius: 7, category: 'ambient', falloff: 'exponential' },
    'portal_hum': { label: 'Portal Hum', radius: 4, category: 'effect', falloff: 'exponential' },
    'gate_resonance': { label: 'Gate Resonance', radius: 8, category: 'effect', falloff: 'exponential' },
    'shadow_whisper': { label: 'Shadow Whisper', radius: 5, category: 'effect', falloff: 'exponential' },
    'system_pulse': { label: 'System Pulse', radius: 6, category: 'effect', falloff: 'exponential' },
    'monarch_aura': { label: 'Monarch Aura', radius: 7, category: 'effect', falloff: 'exponential' },
    'boss_tension': { label: 'Boss Encounter Tension', radius: 12, category: 'effect', falloff: 'linear' },
    'dimensional_static': { label: 'Dimensional Static', radius: 5, category: 'effect', falloff: 'exponential' },
    'awakening_ceremony': { label: 'Awakening Ceremony', radius: 8, category: 'effect', falloff: 'exponential' },
    'hunter_training': { label: 'Hunter Training Ground', radius: 6, category: 'effect', falloff: 'linear' },
    'rune_activation': { label: 'Rune Activation Hum', radius: 3, category: 'effect', falloff: 'exponential' },
    'regression_warning': { label: 'Regression Warning', radius: 10, category: 'effect', falloff: 'none' },
};

