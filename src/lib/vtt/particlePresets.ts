/**
 * VTT Particle Effects Library — Best-in-Class Free Presets
 *
 * A vast collection of particle effect configurations for use with
 * `@pixi/particle-emitter`. These presets cover combat, movement,
 * spell casting, environmental atmosphere, damage types, healing,
 * and status conditions.
 *
 * Usage:
 *   import { PARTICLE_PRESETS, getPreset } from '@/lib/vtt/particlePresets';
 *   const config = getPreset('fireball');
 *   const emitter = new Emitter(container, upgradeConfig(config, [texture]));
 */

// ─── Types ──────────────────────────────────────────────────
export interface ParticlePreset {
	/** Human-readable label for UI selectors */
	label: string;
	/** Category for grouping in asset browsers */
	category: ParticleCategory;
	/** The raw emitter configuration (v2 format for @pixi/particle-emitter) */
	config: Record<string, unknown>;
}

export type ParticleCategory =
	| "spell-fire"
	| "spell-ice"
	| "spell-lightning"
	| "spell-necrotic"
	| "spell-radiant"
	| "spell-arcane"
	| "spell-nature"
	| "spell-psychic"
	| "spell-force"
	| "spell-water"
	| "spell-thunder"
	| "spell-illusion"
	| "spell-conjuration"
	| "damage"
	| "healing"
	| "movement"
	| "environment"
	| "status"
	| "aura"
	| "trap"
	| "terrain-hazard"
	| "sa-specific";

// ─── Helpers ────────────────────────────────────────────────
const alpha = (pairs: [number, number][]) => ({
	list: pairs.map(([value, time]) => ({ value, time })),
	isStepped: false,
});
const scale = alpha;
const speed = alpha;
const color = (pairs: [string, number][]) => ({
	list: pairs.map(([value, time]) => ({ value, time })),
	isStepped: false,
});

const pointSpawn = (x = 0, y = 0) => ({
	spawnType: "point" as const,
	pos: { x, y },
});
const burstSpawn = (x = 0, y = 0) => ({
	spawnType: "burst" as const,
	pos: { x, y },
	particleSpacing: 15,
});
const ringSpawn = (x = 0, y = 0, r = 50) => ({
	spawnType: "ring" as const,
	pos: { x, y },
	spawnCircle: { x: 0, y: 0, r, minR: r * 0.85 },
});
const rectSpawn = (x: number, y: number, w: number, h: number) => ({
	spawnType: "rect" as const,
	pos: { x: 0, y: 0 },
	spawnRect: { x, y, w, h },
});

// ─── PRESETS ────────────────────────────────────────────────

export const PARTICLE_PRESETS: Record<string, ParticlePreset> = {
	// ═══════════════════════ FIRE SPELLS ═══════════════════════
	fireball: {
		label: "Fireball",
		category: "spell-fire",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.6, 0.5],
				[0, 1],
			]),
			scale: scale([
				[1.2, 0],
				[2.8, 0.4],
				[0.2, 1],
			]),
			color: color([
				["ffcc00", 0],
				["ff4400", 0.5],
				["220000", 1],
			]),
			speed: speed([
				[600, 0],
				[200, 0.5],
				[50, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -120, max: 120 },
			lifetime: { min: 0.4, max: 0.9 },
			frequency: 0.001,
			particlesPerWave: 40,
			emitterLifetime: 0.25,
			maxParticles: 200,
			addAtBack: false,
		},
	},
	flameJet: {
		label: "Flame Jet / Burning Hands",
		category: "spell-fire",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.9, 0],
				[0.5, 0.6],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[1.4, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ffee66", 0],
				["ff6600", 0.4],
				["330000", 1],
			]),
			speed: speed([
				[400, 0],
				[250, 1],
			]),
			startRotation: { min: -15, max: 15 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 0.3, max: 0.7 },
			frequency: 0.008,
			particlesPerWave: 3,
			emitterLifetime: 1.5,
			maxParticles: 300,
			addAtBack: false,
		},
	},
	wallOfFire: {
		label: "Wall of Fire",
		category: "spell-fire",
		config: {
			...rectSpawn(-100, 0, 200, 10),
			alpha: alpha([
				[0.8, 0],
				[0.4, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.4, 0],
				[1.2, 0.4],
				[0.2, 1],
			]),
			color: color([
				["ffdd44", 0],
				["ff3300", 0.5],
				["110000", 1],
			]),
			speed: speed([
				[120, 0],
				[80, 1],
			]),
			startRotation: { min: 260, max: 280 },
			rotationSpeed: { min: -60, max: 60 },
			lifetime: { min: 0.6, max: 1.2 },
			frequency: 0.01,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 400,
			addAtBack: false,
		},
	},
	emberFloat: {
		label: "Floating Embers",
		category: "spell-fire",
		config: {
			...ringSpawn(0, 0, 40),
			alpha: alpha([
				[1, 0],
				[0.6, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.5, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ffaa00", 0],
				["ff4400", 0.5],
				["220000", 1],
			]),
			speed: speed([
				[30, 0],
				[60, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -80, max: 80 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.05,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ICE SPELLS ═══════════════════════
	coneOfCold: {
		label: "Cone of Cold",
		category: "spell-ice",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.9, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[1.6, 0.6],
				[0.5, 1],
			]),
			color: color([
				["ffffff", 0],
				["88ddff", 0.4],
				["4488cc", 1],
			]),
			speed: speed([
				[500, 0],
				[300, 0.5],
				[100, 1],
			]),
			startRotation: { min: -20, max: 20 },
			rotationSpeed: { min: -30, max: 30 },
			lifetime: { min: 0.5, max: 1.0 },
			frequency: 0.006,
			particlesPerWave: 4,
			emitterLifetime: 0.6,
			maxParticles: 250,
			addAtBack: false,
		},
	},
	iceShatter: {
		label: "Ice Shatter",
		category: "spell-ice",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.8, 0.3],
				[0, 1],
			]),
			scale: scale([
				[0.8, 0],
				[0.3, 1],
			]),
			color: color([
				["eeffff", 0],
				["66aacc", 0.5],
				["224466", 1],
			]),
			speed: speed([
				[500, 0],
				[100, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -200, max: 200 },
			lifetime: { min: 0.3, max: 0.8 },
			frequency: 0.001,
			particlesPerWave: 30,
			emitterLifetime: 0.15,
			maxParticles: 100,
			addAtBack: false,
		},
	},
	frostAura: {
		label: "Frost Aura",
		category: "spell-ice",
		config: {
			...ringSpawn(0, 0, 50),
			alpha: alpha([
				[0, 0],
				[0.5, 0.3],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ccffff", 0],
				["88bbdd", 0.5],
				["446688", 1],
			]),
			speed: speed([
				[10, 0],
				[30, 0.5],
				[5, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 2, max: 4 },
			frequency: 0.06,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 80,
			addAtBack: true,
		},
	},

	// ═══════════════════════ LIGHTNING SPELLS ═══════════════════════
	lightningBolt: {
		label: "Lightning Bolt",
		category: "spell-lightning",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[1, 0.1],
				[0, 0.4],
			]),
			scale: scale([
				[0.6, 0],
				[0.1, 1],
			]),
			color: color([
				["ffffff", 0],
				["aaddff", 0.2],
				["4488ff", 1],
			]),
			speed: speed([
				[1200, 0],
				[800, 1],
			]),
			startRotation: { min: -5, max: 5 },
			rotationSpeed: { min: -300, max: 300 },
			lifetime: { min: 0.08, max: 0.2 },
			frequency: 0.002,
			particlesPerWave: 8,
			emitterLifetime: 0.15,
			maxParticles: 150,
			addAtBack: false,
		},
	},
	chainLightning: {
		label: "Chain Lightning",
		category: "spell-lightning",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[0.7, 0.2],
				[0, 0.5],
			]),
			scale: scale([
				[0.4, 0],
				[0.2, 1],
			]),
			color: color([
				["ffffff", 0],
				["ccddff", 0.1],
				["6688ff", 1],
			]),
			speed: speed([
				[800, 0],
				[400, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -500, max: 500 },
			lifetime: { min: 0.05, max: 0.15 },
			frequency: 0.003,
			particlesPerWave: 5,
			emitterLifetime: 0.5,
			maxParticles: 200,
			addAtBack: false,
		},
	},
	electricSpark: {
		label: "Electric Sparks",
		category: "spell-lightning",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.1, 1],
			]),
			color: color([
				["ffffff", 0],
				["aaccff", 0.3],
				["4466cc", 1],
			]),
			speed: speed([
				[300, 0],
				[80, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -400, max: 400 },
			lifetime: { min: 0.1, max: 0.4 },
			frequency: 0.001,
			particlesPerWave: 15,
			emitterLifetime: 0.1,
			maxParticles: 80,
			addAtBack: false,
		},
	},

	// ═══════════════════════ NECROTIC SPELLS ═══════════════════════
	necroticBurst: {
		label: "Necrotic Burst",
		category: "spell-necrotic",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.8, 0],
				[0.5, 0.4],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[2.0, 0.5],
				[0.3, 1],
			]),
			color: color([
				["aa44ff", 0],
				["440066", 0.5],
				["110022", 1],
			]),
			speed: speed([
				[300, 0],
				[80, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -60, max: 60 },
			lifetime: { min: 0.5, max: 1.2 },
			frequency: 0.001,
			particlesPerWave: 20,
			emitterLifetime: 0.3,
			maxParticles: 120,
			addAtBack: false,
		},
	},
	soulDrain: {
		label: "Soul Drain",
		category: "spell-necrotic",
		config: {
			...ringSpawn(0, 0, 60),
			alpha: alpha([
				[0, 0],
				[0.7, 0.3],
				[0.4, 0.7],
				[0, 1],
			]),
			scale: scale([
				[1.0, 0],
				[0.3, 1],
			]),
			color: color([
				["cc88ff", 0],
				["662299", 0.5],
				["220044", 1],
			]),
			speed: speed([
				[5, 0],
				[80, 0.5],
				[150, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 1.0, max: 2.0 },
			frequency: 0.04,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},
	deathCloud: {
		label: "Death Cloud / Cloudkill",
		category: "spell-necrotic",
		config: {
			...ringSpawn(0, 0, 80),
			alpha: alpha([
				[0, 0],
				[0.35, 0.3],
				[0.25, 0.7],
				[0, 1],
			]),
			scale: scale([
				[1.5, 0],
				[3.5, 0.5],
				[4.0, 1],
			]),
			color: color([
				["88ff88", 0],
				["336633", 0.5],
				["112211", 1],
			]),
			speed: speed([
				[15, 0],
				[8, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 3, max: 6 },
			frequency: 0.15,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 60,
			addAtBack: true,
		},
	},

	// ═══════════════════════ RADIANT SPELLS ═══════════════════════
	radiantFlare: {
		label: "Radiant Flare",
		category: "spell-radiant",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.8, 0.3],
				[0, 0.8],
			]),
			scale: scale([
				[0.3, 0],
				[2.0, 0.3],
				[0.5, 1],
			]),
			color: color([
				["ffffee", 0],
				["ffdd44", 0.3],
				["ff8800", 1],
			]),
			speed: speed([
				[500, 0],
				[200, 0.5],
				[50, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -50, max: 50 },
			lifetime: { min: 0.3, max: 0.8 },
			frequency: 0.001,
			particlesPerWave: 35,
			emitterLifetime: 0.2,
			maxParticles: 150,
			addAtBack: false,
		},
	},
	holyBeam: {
		label: "Holy Beam / Guiding Bolt",
		category: "spell-radiant",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[0.7, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[0.8, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ffffcc", 0],
				["ffcc44", 0.4],
				["cc8800", 1],
			]),
			speed: speed([
				[700, 0],
				[500, 1],
			]),
			startRotation: { min: -8, max: 8 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 0.2, max: 0.5 },
			frequency: 0.004,
			particlesPerWave: 6,
			emitterLifetime: 0.4,
			maxParticles: 200,
			addAtBack: false,
		},
	},
	divineShield: {
		label: "Divine Shield / Sanctuary",
		category: "spell-radiant",
		config: {
			...ringSpawn(0, 0, 45),
			alpha: alpha([
				[0, 0],
				[0.6, 0.2],
				[0.4, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.5, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ffffdd", 0],
				["ffcc66", 0.5],
				["aa8833", 1],
			]),
			speed: speed([
				[10, 0],
				[25, 0.5],
				[5, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -30, max: 30 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.04,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 70,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ARCANE SPELLS ═══════════════════════
	magicMissile: {
		label: "Magic Missile",
		category: "spell-arcane",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[0.6, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.4, 0],
				[0.2, 1],
			]),
			color: color([
				["ddccff", 0],
				["8866ff", 0.5],
				["4422aa", 1],
			]),
			speed: speed([
				[600, 0],
				[400, 1],
			]),
			startRotation: { min: -10, max: 10 },
			rotationSpeed: { min: -80, max: 80 },
			lifetime: { min: 0.15, max: 0.35 },
			frequency: 0.005,
			particlesPerWave: 3,
			emitterLifetime: 0.3,
			maxParticles: 60,
			addAtBack: false,
		},
	},
	arcaneExplosion: {
		label: "Arcane Explosion",
		category: "spell-arcane",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.6, 0.4],
				[0, 1],
			]),
			scale: scale([
				[0.8, 0],
				[2.2, 0.4],
				[0.3, 1],
			]),
			color: color([
				["eeccff", 0],
				["8844cc", 0.4],
				["220044", 1],
			]),
			speed: speed([
				[500, 0],
				[150, 0.5],
				[30, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -100, max: 100 },
			lifetime: { min: 0.4, max: 0.9 },
			frequency: 0.001,
			particlesPerWave: 30,
			emitterLifetime: 0.25,
			maxParticles: 180,
			addAtBack: false,
		},
	},
	portalRift: {
		label: "Portal / Rift",
		category: "spell-arcane",
		config: {
			...ringSpawn(0, 0, 55),
			alpha: alpha([
				[0, 0],
				[0.7, 0.2],
				[0.5, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.5],
				[0.4, 1],
			]),
			color: color([
				["ff88ff", 0],
				["8844cc", 0.5],
				["220044", 1],
			]),
			speed: speed([
				[20, 0],
				[40, 0.5],
				[10, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 80, max: 120 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.03,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 120,
			addAtBack: true,
		},
	},

	// ═══════════════════════ NATURE SPELLS ═══════════════════════
	thornWhip: {
		label: "Thorn Whip / Entangle",
		category: "spell-nature",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.8, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.6, 0.5],
				[0.1, 1],
			]),
			color: color([
				["88ff44", 0],
				["44aa22", 0.5],
				["114400", 1],
			]),
			speed: speed([
				[300, 0],
				[150, 1],
			]),
			startRotation: { min: -25, max: 25 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 0.3, max: 0.6 },
			frequency: 0.008,
			particlesPerWave: 3,
			emitterLifetime: 0.8,
			maxParticles: 100,
			addAtBack: false,
		},
	},
	moonbeam: {
		label: "Moonbeam",
		category: "spell-nature",
		config: {
			...ringSpawn(0, 0, 30),
			alpha: alpha([
				[0, 0],
				[0.7, 0.2],
				[0.5, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.4, 0],
				[1.0, 0.5],
				[0.6, 1],
			]),
			color: color([
				["eeeeff", 0],
				["aabbee", 0.5],
				["6688bb", 1],
			]),
			speed: speed([
				[60, 0],
				[20, 1],
			]),
			startRotation: { min: 80, max: 100 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 1.5, max: 3.0 },
			frequency: 0.04,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 80,
			addAtBack: true,
		},
	},

	// ═══════════════════════ PSYCHIC SPELLS ═══════════════════════
	psychicScream: {
		label: "Psychic Scream",
		category: "spell-psychic",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.9, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[3.0, 0.5],
				[4.5, 1],
			]),
			color: color([
				["ff88cc", 0],
				["cc44aa", 0.4],
				["440022", 1],
			]),
			speed: speed([
				[400, 0],
				[100, 0.5],
				[20, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -80, max: 80 },
			lifetime: { min: 0.5, max: 1.0 },
			frequency: 0.001,
			particlesPerWave: 25,
			emitterLifetime: 0.2,
			maxParticles: 120,
			addAtBack: false,
		},
	},

	// ═══════════════════════ DAMAGE FX ═══════════════════════
	bloodSplatter: {
		label: "Blood Splatter",
		category: "damage",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.6, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.6, 0.3],
				[0.1, 1],
			]),
			color: color([
				["ff2200", 0],
				["aa0000", 0.5],
				["330000", 1],
			]),
			speed: speed([
				[300, 0],
				[80, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -100, max: 100 },
			lifetime: { min: 0.3, max: 0.7 },
			frequency: 0.001,
			particlesPerWave: 15,
			emitterLifetime: 0.1,
			maxParticles: 60,
			addAtBack: false,
		},
	},
	sparks: {
		label: "Metal Sparks (Slash/Pierce)",
		category: "damage",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.7, 0.3],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.1, 1],
			]),
			color: color([
				["ffffcc", 0],
				["ffaa44", 0.3],
				["664400", 1],
			]),
			speed: speed([
				[400, 0],
				[120, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -200, max: 200 },
			lifetime: { min: 0.15, max: 0.5 },
			frequency: 0.001,
			particlesPerWave: 20,
			emitterLifetime: 0.08,
			maxParticles: 50,
			addAtBack: false,
		},
	},
	shatter: {
		label: "Shatter / Bludgeon Impact",
		category: "damage",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.5, 0.4],
				[0, 1],
			]),
			scale: scale([
				[0.6, 0],
				[0.3, 1],
			]),
			color: color([
				["ccbbaa", 0],
				["887766", 0.5],
				["332211", 1],
			]),
			speed: speed([
				[350, 0],
				[60, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -250, max: 250 },
			lifetime: { min: 0.2, max: 0.6 },
			frequency: 0.001,
			particlesPerWave: 25,
			emitterLifetime: 0.1,
			maxParticles: 80,
			addAtBack: false,
		},
	},
	criticalHit: {
		label: "Critical Hit Flash",
		category: "damage",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[1, 0.1],
				[0, 0.4],
			]),
			scale: scale([
				[0.5, 0],
				[3.0, 0.2],
				[0.5, 1],
			]),
			color: color([
				["ffffff", 0],
				["ffaa00", 0.2],
				["ff0000", 1],
			]),
			speed: speed([
				[600, 0],
				[200, 0.5],
				[40, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -150, max: 150 },
			lifetime: { min: 0.2, max: 0.5 },
			frequency: 0.001,
			particlesPerWave: 40,
			emitterLifetime: 0.15,
			maxParticles: 150,
			addAtBack: false,
		},
	},

	// ═══════════════════════ HEALING ═══════════════════════
	healingGlow: {
		label: "Healing Glow",
		category: "healing",
		config: {
			...ringSpawn(0, 0, 35),
			alpha: alpha([
				[0, 0],
				[0.7, 0.3],
				[0.4, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.7, 0.5],
				[0.2, 1],
			]),
			color: color([
				["aaffaa", 0],
				["44ff44", 0.5],
				["006600", 1],
			]),
			speed: speed([
				[10, 0],
				[40, 0.5],
				[60, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 1.0, max: 2.5 },
			frequency: 0.04,
			particlesPerWave: 2,
			emitterLifetime: 2.0,
			maxParticles: 80,
			addAtBack: true,
		},
	},
	divineHeal: {
		label: "Divine Healing",
		category: "healing",
		config: {
			...ringSpawn(0, 0, 30),
			alpha: alpha([
				[0, 0],
				[0.8, 0.3],
				[0.5, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.6, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ffffcc", 0],
				["ffcc66", 0.5],
				["cc8800", 1],
			]),
			speed: speed([
				[15, 0],
				[50, 0.5],
				[80, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 1.0, max: 2.0 },
			frequency: 0.035,
			particlesPerWave: 3,
			emitterLifetime: 1.5,
			maxParticles: 100,
			addAtBack: true,
		},
	},

	// ═══════════════════════ MOVEMENT ═══════════════════════
	dustTrail: {
		label: "Dust Trail (Walking)",
		category: "movement",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.5, 0],
				[0.2, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[1.0, 0.5],
				[1.5, 1],
			]),
			color: color([
				["ccbb99", 0],
				["998866", 0.5],
				["665544", 1],
			]),
			speed: speed([
				[20, 0],
				[10, 1],
			]),
			startRotation: { min: 240, max: 300 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 0.5, max: 1.2 },
			frequency: 0.08,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 30,
			addAtBack: true,
		},
	},
	voidStep: {
		label: "Void Step (Teleport)",
		category: "movement",
		config: {
			...ringSpawn(0, 0, 30),
			alpha: alpha([
				[0, 0],
				[0.8, 0.2],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[1.2, 0.3],
				[0.1, 1],
			]),
			color: color([
				["cc88ff", 0],
				["6622cc", 0.4],
				["110033", 1],
			]),
			speed: speed([
				[10, 0],
				[60, 0.5],
				[120, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 100, max: 200 },
			lifetime: { min: 0.3, max: 0.8 },
			frequency: 0.001,
			particlesPerWave: 20,
			emitterLifetime: 0.3,
			maxParticles: 80,
			addAtBack: false,
		},
	},
	dashBlur: {
		label: "Dash / Sprint Blur",
		category: "movement",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.4, 0],
				[0.1, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[1.5, 0.5],
				[2.0, 1],
			]),
			color: color([
				["aaccff", 0],
				["4488cc", 0.5],
				["224466", 1],
			]),
			speed: speed([
				[5, 0],
				[2, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -5, max: 5 },
			lifetime: { min: 0.2, max: 0.5 },
			frequency: 0.03,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 20,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ENVIRONMENT ═══════════════════════
	torchFlicker: {
		label: "Torch Flicker",
		category: "environment",
		config: {
			...pointSpawn(0, -10),
			alpha: alpha([
				[0.8, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.4, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ffcc44", 0],
				["ff6600", 0.5],
				["220000", 1],
			]),
			speed: speed([
				[30, 0],
				[50, 1],
			]),
			startRotation: { min: 255, max: 285 },
			rotationSpeed: { min: -30, max: 30 },
			lifetime: { min: 0.4, max: 0.9 },
			frequency: 0.03,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 40,
			addAtBack: true,
		},
	},
	magicGlow: {
		label: "Ambient Magic Glow",
		category: "environment",
		config: {
			...ringSpawn(0, 0, 60),
			alpha: alpha([
				[0, 0],
				[0.3, 0.3],
				[0.2, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[1.2, 0.5],
				[0.5, 1],
			]),
			color: color([
				["ccccff", 0],
				["8866cc", 0.5],
				["332266", 1],
			]),
			speed: speed([
				[8, 0],
				[15, 0.5],
				[3, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 3, max: 6 },
			frequency: 0.1,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 40,
			addAtBack: true,
		},
	},
	waterDrip: {
		label: "Water Drip / Cave",
		category: "environment",
		config: {
			...rectSpawn(-100, -20, 200, 10),
			alpha: alpha([
				[0.7, 0],
				[0.3, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.1, 0],
				[0.3, 0.5],
				[0.1, 1],
			]),
			color: color([
				["aaddff", 0],
				["6699cc", 0.5],
				["334466", 1],
			]),
			speed: speed([
				[200, 0],
				[300, 1],
			]),
			startRotation: { min: 85, max: 95 },
			rotationSpeed: { min: 0, max: 0 },
			lifetime: { min: 0.4, max: 0.8 },
			frequency: 0.2,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 20,
			addAtBack: true,
		},
	},
	fireflies: {
		label: "Fireflies",
		category: "environment",
		config: {
			...ringSpawn(0, 0, 100),
			alpha: alpha([
				[0, 0],
				[0.8, 0.3],
				[0.6, 0.5],
				[0, 0.8],
				[0.5, 0.9],
				[0, 1],
			]),
			scale: scale([
				[0.15, 0],
				[0.25, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ccff66", 0],
				["88cc44", 0.5],
				["446622", 1],
			]),
			speed: speed([
				[5, 0],
				[15, 0.5],
				[5, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 3, max: 6 },
			frequency: 0.15,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 25,
			addAtBack: true,
		},
	},

	// ═══════════════════════ STATUS / AURAS ═══════════════════════
	poisoned: {
		label: "Poisoned Bubbles",
		category: "status",
		config: {
			...ringSpawn(0, 0, 20),
			alpha: alpha([
				[0, 0],
				[0.6, 0.3],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.15, 0],
				[0.35, 0.5],
				[0.1, 1],
			]),
			color: color([
				["66ff66", 0],
				["33aa33", 0.5],
				["004400", 1],
			]),
			speed: speed([
				[20, 0],
				[40, 1],
			]),
			startRotation: { min: 260, max: 280 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 1.0, max: 2.0 },
			frequency: 0.08,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 30,
			addAtBack: true,
		},
	},
	burning: {
		label: "Burning Status",
		category: "status",
		config: {
			...ringSpawn(0, 0, 20),
			alpha: alpha([
				[0.7, 0],
				[0.4, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.5, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ffcc44", 0],
				["ff4400", 0.5],
				["220000", 1],
			]),
			speed: speed([
				[30, 0],
				[50, 1],
			]),
			startRotation: { min: 255, max: 285 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 0.4, max: 0.8 },
			frequency: 0.04,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 50,
			addAtBack: true,
		},
	},
	stunned: {
		label: "Stunned / Stars",
		category: "status",
		config: {
			...ringSpawn(0, -15, 25),
			alpha: alpha([
				[0, 0],
				[0.8, 0.2],
				[0.5, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.15, 0],
				[0.3, 0.5],
				[0.15, 1],
			]),
			color: color([
				["ffffaa", 0],
				["ffcc44", 0.5],
				["886600", 1],
			]),
			speed: speed([
				[5, 0],
				[10, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 60, max: 100 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.1,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 8,
			addAtBack: false,
		},
	},
	rageAura: {
		label: "Rage / Berserk Aura",
		category: "aura",
		config: {
			...ringSpawn(0, 0, 35),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ff4444", 0],
				["cc0000", 0.5],
				["440000", 1],
			]),
			speed: speed([
				[15, 0],
				[30, 0.5],
				[50, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 0.8, max: 1.5 },
			frequency: 0.04,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 80,
			addAtBack: true,
		},
	},
	blessAura: {
		label: "Bless / Buff Aura",
		category: "aura",
		config: {
			...ringSpawn(0, 0, 35),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.5, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ffffcc", 0],
				["ffdd66", 0.5],
				["aa8800", 1],
			]),
			speed: speed([
				[10, 0],
				[25, 0.5],
				[40, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 1, max: 2.5 },
			frequency: 0.05,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 50,
			addAtBack: true,
		},
	},
	concentrationAura: {
		label: "Concentration Aura",
		category: "aura",
		config: {
			...ringSpawn(0, 0, 28),
			alpha: alpha([
				[0, 0],
				[0.4, 0.3],
				[0.2, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.15, 0],
				[0.35, 0.5],
				[0.1, 1],
			]),
			color: color([
				["88ccff", 0],
				["4488cc", 0.5],
				["224466", 1],
			]),
			speed: speed([
				[5, 0],
				[15, 0.5],
				[5, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 30, max: 60 },
			lifetime: { min: 2, max: 4 },
			frequency: 0.08,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 30,
			addAtBack: true,
		},
	},

	// ═══════════════════════ FORCE SPELLS ═══════════════════════
	eldritchBlast: {
		label: "Eldritch Blast",
		category: "spell-force",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[0.6, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.15, 1],
			]),
			color: color([
				["ccaaff", 0],
				["6644cc", 0.5],
				["220044", 1],
			]),
			speed: speed([
				[900, 0],
				[600, 1],
			]),
			startRotation: { min: -5, max: 5 },
			rotationSpeed: { min: -60, max: 60 },
			lifetime: { min: 0.1, max: 0.25 },
			frequency: 0.004,
			particlesPerWave: 4,
			emitterLifetime: 0.3,
			maxParticles: 80,
			addAtBack: false,
		},
	},
	forceWall: {
		label: "Wall of Force",
		category: "spell-force",
		config: {
			...rectSpawn(-100, 0, 200, 5),
			alpha: alpha([
				[0, 0],
				[0.4, 0.3],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.6, 0.5],
				[0.3, 1],
			]),
			color: color([
				["eeddff", 0],
				["8866cc", 0.5],
				["442266", 1],
			]),
			speed: speed([
				[5, 0],
				[10, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.04,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},
	gravityWell: {
		label: "Gravity Well",
		category: "spell-force",
		config: {
			...ringSpawn(0, 0, 80),
			alpha: alpha([
				[0.6, 0],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.8, 0],
				[0.2, 1],
			]),
			color: color([
				["aaaacc", 0],
				["444466", 0.5],
				["111122", 1],
			]),
			speed: speed([
				[5, 0],
				[80, 0.5],
				[200, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 60, max: 120 },
			lifetime: { min: 0.8, max: 1.5 },
			frequency: 0.03,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 120,
			addAtBack: true,
		},
	},
	shieldBubble: {
		label: "Shield / Barrier Bubble",
		category: "spell-force",
		config: {
			...ringSpawn(0, 0, 40),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.4, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ccddff", 0],
				["6688cc", 0.5],
				["334466", 1],
			]),
			speed: speed([
				[3, 0],
				[8, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 20, max: 50 },
			lifetime: { min: 2, max: 4 },
			frequency: 0.05,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 80,
			addAtBack: true,
		},
	},
	repulsionWave: {
		label: "Repulsion Wave",
		category: "spell-force",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.8, 0],
				[0.4, 0.4],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[2.5, 0.5],
				[0.3, 1],
			]),
			color: color([
				["ddddff", 0],
				["8888cc", 0.4],
				["333366", 1],
			]),
			speed: speed([
				[500, 0],
				[150, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -30, max: 30 },
			lifetime: { min: 0.3, max: 0.7 },
			frequency: 0.001,
			particlesPerWave: 30,
			emitterLifetime: 0.2,
			maxParticles: 120,
			addAtBack: false,
		},
	},

	// ═══════════════════════ WATER / ACID SPELLS ═══════════════════════
	acidSplash: {
		label: "Acid Splash",
		category: "spell-water",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.9, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.6, 0.4],
				[0.1, 1],
			]),
			color: color([
				["ccff44", 0],
				["88aa22", 0.5],
				["334400", 1],
			]),
			speed: speed([
				[250, 0],
				[60, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -80, max: 80 },
			lifetime: { min: 0.3, max: 0.7 },
			frequency: 0.001,
			particlesPerWave: 18,
			emitterLifetime: 0.15,
			maxParticles: 80,
			addAtBack: false,
		},
	},
	tidalWave: {
		label: "Tidal Wave",
		category: "spell-water",
		config: {
			...rectSpawn(-80, 0, 160, 20),
			alpha: alpha([
				[0.7, 0],
				[0.4, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.8, 0],
				[1.5, 0.5],
				[0.5, 1],
			]),
			color: color([
				["aaddff", 0],
				["4488cc", 0.5],
				["113355", 1],
			]),
			speed: speed([
				[300, 0],
				[100, 1],
			]),
			startRotation: { min: -10, max: 10 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 0.5, max: 1.0 },
			frequency: 0.006,
			particlesPerWave: 5,
			emitterLifetime: 0.8,
			maxParticles: 200,
			addAtBack: false,
		},
	},
	waterJet: {
		label: "Water Jet / Geyser",
		category: "spell-water",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.8, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.5],
				[0.2, 1],
			]),
			color: color([
				["cceeFF", 0],
				["5599cc", 0.5],
				["224455", 1],
			]),
			speed: speed([
				[500, 0],
				[200, 1],
			]),
			startRotation: { min: 260, max: 280 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 0.4, max: 0.8 },
			frequency: 0.008,
			particlesPerWave: 4,
			emitterLifetime: 1.0,
			maxParticles: 150,
			addAtBack: false,
		},
	},
	acidRain: {
		label: "Acid Rain",
		category: "spell-water",
		config: {
			...rectSpawn(-120, -40, 240, 10),
			alpha: alpha([
				[0.6, 0],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.1, 0],
				[0.2, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ddff44", 0],
				["88aa22", 0.5],
				["334400", 1],
			]),
			speed: speed([
				[300, 0],
				[400, 1],
			]),
			startRotation: { min: 85, max: 95 },
			rotationSpeed: { min: 0, max: 0 },
			lifetime: { min: 0.3, max: 0.6 },
			frequency: 0.02,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},

	// ═══════════════════════ THUNDER SPELLS ═══════════════════════
	thunderwave: {
		label: "Thunderwave",
		category: "spell-thunder",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.9, 0],
				[0.3, 0.4],
				[0, 0.8],
			]),
			scale: scale([
				[0.8, 0],
				[3.0, 0.4],
				[5.0, 1],
			]),
			color: color([
				["ffffff", 0],
				["aabbdd", 0.3],
				["445566", 1],
			]),
			speed: speed([
				[600, 0],
				[200, 0.5],
				[50, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 0.3, max: 0.6 },
			frequency: 0.001,
			particlesPerWave: 35,
			emitterLifetime: 0.15,
			maxParticles: 140,
			addAtBack: false,
		},
	},
	shatterBoom: {
		label: "Shatter (Sonic)",
		category: "spell-thunder",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.5, 0.3],
				[0, 0.7],
			]),
			scale: scale([
				[0.6, 0],
				[2.0, 0.3],
				[0.4, 1],
			]),
			color: color([
				["eeeeff", 0],
				["8899bb", 0.4],
				["334455", 1],
			]),
			speed: speed([
				[400, 0],
				[120, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -150, max: 150 },
			lifetime: { min: 0.2, max: 0.5 },
			frequency: 0.001,
			particlesPerWave: 25,
			emitterLifetime: 0.2,
			maxParticles: 100,
			addAtBack: false,
		},
	},
	sonicBoom: {
		label: "Sonic Boom",
		category: "spell-thunder",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.7, 0],
				[0.2, 0.5],
				[0, 1],
			]),
			scale: scale([
				[1.0, 0],
				[4.0, 0.5],
				[6.0, 1],
			]),
			color: color([
				["ddddee", 0],
				["8899aa", 0.4],
				["334455", 1],
			]),
			speed: speed([
				[800, 0],
				[300, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 0.15, max: 0.35 },
			frequency: 0.001,
			particlesPerWave: 20,
			emitterLifetime: 0.1,
			maxParticles: 60,
			addAtBack: false,
		},
	},
	thunderClap: {
		label: "Thunder Clap",
		category: "spell-thunder",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.6, 0.2],
				[0, 0.5],
			]),
			scale: scale([
				[0.4, 0],
				[1.5, 0.3],
				[0.2, 1],
			]),
			color: color([
				["ffffff", 0],
				["ccddee", 0.2],
				["556677", 1],
			]),
			speed: speed([
				[700, 0],
				[250, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -200, max: 200 },
			lifetime: { min: 0.1, max: 0.3 },
			frequency: 0.001,
			particlesPerWave: 30,
			emitterLifetime: 0.1,
			maxParticles: 80,
			addAtBack: false,
		},
	},
	stormVortex: {
		label: "Storm Vortex",
		category: "spell-thunder",
		config: {
			...ringSpawn(0, 0, 70),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.4, 0],
				[1.0, 0.5],
				[0.3, 1],
			]),
			color: color([
				["ccddee", 0],
				["6688aa", 0.5],
				["334455", 1],
			]),
			speed: speed([
				[20, 0],
				[50, 0.5],
				[15, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 80, max: 160 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.03,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 120,
			addAtBack: true,
		},
	},
	whirlwind: {
		label: "Whirlwind",
		category: "spell-thunder",
		config: {
			...ringSpawn(0, 0, 50),
			alpha: alpha([
				[0.5, 0],
				[0.3, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.6, 0],
				[1.2, 0.5],
				[0.4, 1],
			]),
			color: color([
				["ddddcc", 0],
				["998877", 0.5],
				["554433", 1],
			]),
			speed: speed([
				[30, 0],
				[60, 0.5],
				[20, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 120, max: 200 },
			lifetime: { min: 1, max: 2 },
			frequency: 0.025,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ILLUSION SPELLS ═══════════════════════
	mirrorImage: {
		label: "Mirror Image",
		category: "spell-illusion",
		config: {
			...ringSpawn(0, 0, 30),
			alpha: alpha([
				[0, 0],
				[0.3, 0.2],
				[0.15, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.8, 0],
				[1.2, 0.5],
				[0.6, 1],
			]),
			color: color([
				["ddddff", 0],
				["9999cc", 0.5],
				["444466", 1],
			]),
			speed: speed([
				[3, 0],
				[8, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 15, max: 30 },
			lifetime: { min: 2, max: 4 },
			frequency: 0.06,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 60,
			addAtBack: true,
		},
	},
	blurEffect: {
		label: "Blur",
		category: "spell-illusion",
		config: {
			...ringSpawn(0, 0, 20),
			alpha: alpha([
				[0.2, 0],
				[0.1, 0.5],
				[0, 1],
			]),
			scale: scale([
				[1.5, 0],
				[2.0, 0.5],
				[1.0, 1],
			]),
			color: color([
				["ccccee", 0],
				["888899", 0.5],
				["444455", 1],
			]),
			speed: speed([
				[2, 0],
				[5, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 0.5, max: 1.0 },
			frequency: 0.03,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 50,
			addAtBack: true,
		},
	},
	phantasmalForce: {
		label: "Phantasmal / Illusory",
		category: "spell-illusion",
		config: {
			...ringSpawn(0, 0, 40),
			alpha: alpha([
				[0, 0],
				[0.4, 0.2],
				[0.2, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.7, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ff88ff", 0],
				["aa44cc", 0.5],
				["440066", 1],
			]),
			speed: speed([
				[8, 0],
				[20, 0.5],
				[5, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -30, max: 30 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.05,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 60,
			addAtBack: true,
		},
	},
	darknessSpell: {
		label: "Darkness / Hunger of Hadar",
		category: "spell-illusion",
		config: {
			...ringSpawn(0, 0, 60),
			alpha: alpha([
				[0, 0],
				[0.6, 0.2],
				[0.4, 0.8],
				[0, 1],
			]),
			scale: scale([
				[1.0, 0],
				[2.5, 0.5],
				[3.0, 1],
			]),
			color: color([
				["222222", 0],
				["111111", 0.5],
				["000000", 1],
			]),
			speed: speed([
				[5, 0],
				[10, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -5, max: 5 },
			lifetime: { min: 3, max: 5 },
			frequency: 0.08,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 60,
			addAtBack: true,
		},
	},

	// ═══════════════════════ CONJURATION SPELLS ═══════════════════════
	summonCircle: {
		label: "Summoning Circle",
		category: "spell-conjuration",
		config: {
			...ringSpawn(0, 0, 55),
			alpha: alpha([
				[0, 0],
				[0.7, 0.2],
				[0.5, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.5, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ffcc66", 0],
				["cc8844", 0.5],
				["662200", 1],
			]),
			speed: speed([
				[5, 0],
				[15, 0.5],
				[5, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 40, max: 80 },
			lifetime: { min: 2, max: 4 },
			frequency: 0.04,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},
	spiritGuardians: {
		label: "Spirit Guardians",
		category: "spell-conjuration",
		config: {
			...ringSpawn(0, 0, 50),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.6, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ffffdd", 0],
				["ffcc55", 0.5],
				["886622", 1],
			]),
			speed: speed([
				[15, 0],
				[30, 0.5],
				[10, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 50, max: 90 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.035,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 80,
			addAtBack: true,
		},
	},
	cloudOfDaggers: {
		label: "Cloud of Daggers",
		category: "spell-conjuration",
		config: {
			...ringSpawn(0, 0, 25),
			alpha: alpha([
				[0.8, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.15, 0],
				[0.3, 0.3],
				[0.1, 1],
			]),
			color: color([
				["ccccdd", 0],
				["888899", 0.5],
				["444455", 1],
			]),
			speed: speed([
				[80, 0],
				[120, 0.5],
				[60, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -300, max: 300 },
			lifetime: { min: 0.3, max: 0.6 },
			frequency: 0.02,
			particlesPerWave: 4,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: false,
		},
	},
	webSpell: {
		label: "Web",
		category: "spell-conjuration",
		config: {
			...ringSpawn(0, 0, 60),
			alpha: alpha([
				[0, 0],
				[0.3, 0.3],
				[0.2, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[1.5, 0.5],
				[0.8, 1],
			]),
			color: color([
				["eeeeee", 0],
				["aaaaaa", 0.5],
				["666666", 1],
			]),
			speed: speed([
				[3, 0],
				[6, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -3, max: 3 },
			lifetime: { min: 3, max: 6 },
			frequency: 0.1,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 40,
			addAtBack: true,
		},
	},

	// ═══════════════════════ TRAPS ═══════════════════════
	flameTrap: {
		label: "Flame Trap",
		category: "trap",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.7, 0.3],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[1.5, 0.3],
				[0.2, 1],
			]),
			color: color([
				["ffcc00", 0],
				["ff4400", 0.4],
				["220000", 1],
			]),
			speed: speed([
				[400, 0],
				[100, 1],
			]),
			startRotation: { min: 240, max: 300 },
			rotationSpeed: { min: -80, max: 80 },
			lifetime: { min: 0.3, max: 0.7 },
			frequency: 0.001,
			particlesPerWave: 25,
			emitterLifetime: 0.2,
			maxParticles: 100,
			addAtBack: false,
		},
	},
	spikePit: {
		label: "Spike Pit",
		category: "trap",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.8, 0],
				[0.4, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.1, 1],
			]),
			color: color([
				["998877", 0],
				["665544", 0.5],
				["332211", 1],
			]),
			speed: speed([
				[300, 0],
				[80, 1],
			]),
			startRotation: { min: 240, max: 300 },
			rotationSpeed: { min: -100, max: 100 },
			lifetime: { min: 0.2, max: 0.5 },
			frequency: 0.001,
			particlesPerWave: 20,
			emitterLifetime: 0.15,
			maxParticles: 60,
			addAtBack: false,
		},
	},
	glyphOfWarding: {
		label: "Glyph of Warding",
		category: "trap",
		config: {
			...ringSpawn(0, 0, 35),
			alpha: alpha([
				[0, 0],
				[0.8, 0.1],
				[0.4, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[1.0, 0.2],
				[0.3, 1],
			]),
			color: color([
				["ffaa44", 0],
				["ff4400", 0.3],
				["440000", 1],
			]),
			speed: speed([
				[200, 0],
				[60, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 0.3, max: 0.6 },
			frequency: 0.001,
			particlesPerWave: 20,
			emitterLifetime: 0.3,
			maxParticles: 80,
			addAtBack: false,
		},
	},

	// ═══════════════════════ TERRAIN HAZARDS ═══════════════════════
	lavaPool: {
		label: "Lava Pool",
		category: "terrain-hazard",
		config: {
			...ringSpawn(0, 0, 50),
			alpha: alpha([
				[0.6, 0],
				[0.4, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.4, 0],
				[0.8, 0.5],
				[0.3, 1],
			]),
			color: color([
				["ffcc00", 0],
				["ff4400", 0.5],
				["331100", 1],
			]),
			speed: speed([
				[15, 0],
				[30, 0.5],
				[50, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 1, max: 2.5 },
			frequency: 0.05,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 80,
			addAtBack: true,
		},
	},
	quicksand: {
		label: "Quicksand / Sinking",
		category: "terrain-hazard",
		config: {
			...ringSpawn(0, 0, 40),
			alpha: alpha([
				[0, 0],
				[0.3, 0.3],
				[0.15, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.5, 0],
				[1.0, 0.5],
				[0.5, 1],
			]),
			color: color([
				["ccaa77", 0],
				["886644", 0.5],
				["443322", 1],
			]),
			speed: speed([
				[3, 0],
				[8, 0.5],
				[3, 1],
			]),
			startRotation: { min: 80, max: 100 },
			rotationSpeed: { min: 5, max: 15 },
			lifetime: { min: 2, max: 4 },
			frequency: 0.08,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 50,
			addAtBack: true,
		},
	},
	toxicGas: {
		label: "Toxic Gas Cloud",
		category: "terrain-hazard",
		config: {
			...ringSpawn(0, 0, 70),
			alpha: alpha([
				[0, 0],
				[0.3, 0.3],
				[0.2, 0.7],
				[0, 1],
			]),
			scale: scale([
				[1.5, 0],
				[3.0, 0.5],
				[4.0, 1],
			]),
			color: color([
				["aaff66", 0],
				["668833", 0.5],
				["223311", 1],
			]),
			speed: speed([
				[8, 0],
				[15, 0.5],
				[5, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -8, max: 8 },
			lifetime: { min: 3, max: 6 },
			frequency: 0.12,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 50,
			addAtBack: true,
		},
	},

	// ═══════════════════════ SA-SPECIFIC EFFECTS ═══════════════════════
	gateBreach: {
		label: "Gate Breach",
		category: "sa-specific",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.7, 0.3],
				[0, 0.8],
			]),
			scale: scale([
				[0.5, 0],
				[2.5, 0.3],
				[0.5, 1],
			]),
			color: color([
				["ff88ff", 0],
				["8844cc", 0.3],
				["220044", 1],
			]),
			speed: speed([
				[500, 0],
				[150, 0.5],
				[30, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -120, max: 120 },
			lifetime: { min: 0.4, max: 0.9 },
			frequency: 0.001,
			particlesPerWave: 35,
			emitterLifetime: 0.3,
			maxParticles: 180,
			addAtBack: false,
		},
	},
	monarchAwakening: {
		label: "Monarch Awakening",
		category: "sa-specific",
		config: {
			...ringSpawn(0, 0, 60),
			alpha: alpha([
				[0, 0],
				[0.8, 0.2],
				[0.5, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[1.0, 0.5],
				[0.5, 1],
			]),
			color: color([
				["ffddaa", 0],
				["cc8844", 0.5],
				["663300", 1],
			]),
			speed: speed([
				[20, 0],
				[40, 0.5],
				[80, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -30, max: 30 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.03,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 120,
			addAtBack: true,
		},
	},
	systemAlert: {
		label: "System Alert / Notification",
		category: "sa-specific",
		config: {
			...ringSpawn(0, 0, 35),
			alpha: alpha([
				[0, 0],
				[0.9, 0.1],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.5, 0.3],
				[0.2, 1],
			]),
			color: color([
				["44ccff", 0],
				["2288cc", 0.3],
				["114466", 1],
			]),
			speed: speed([
				[30, 0],
				[60, 0.5],
				[15, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 0.8, max: 1.5 },
			frequency: 0.02,
			particlesPerWave: 4,
			emitterLifetime: 1.5,
			maxParticles: 100,
			addAtBack: false,
		},
	},
	shadowRealmRift: {
		label: "Shadow Realm Rift",
		category: "sa-specific",
		config: {
			...ringSpawn(0, 0, 50),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.4, 0],
				[1.2, 0.5],
				[0.6, 1],
			]),
			color: color([
				["664488", 0],
				["332244", 0.5],
				["110022", 1],
			]),
			speed: speed([
				[10, 0],
				[25, 0.5],
				[8, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 40, max: 80 },
			lifetime: { min: 2, max: 4 },
			frequency: 0.04,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ADDITIONAL FIRE ═══════════════════════
	fireBolt: {
		label: "Fire Bolt",
		category: "spell-fire",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[0.7, 0.4],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.15, 1],
			]),
			color: color([
				["ffee44", 0],
				["ff6600", 0.5],
				["330000", 1],
			]),
			speed: speed([
				[800, 0],
				[500, 1],
			]),
			startRotation: { min: -5, max: 5 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 0.1, max: 0.25 },
			frequency: 0.005,
			particlesPerWave: 5,
			emitterLifetime: 0.2,
			maxParticles: 60,
			addAtBack: false,
		},
	},
	immolation: {
		label: "Immolation / Engulf",
		category: "spell-fire",
		config: {
			...ringSpawn(0, 0, 25),
			alpha: alpha([
				[0.8, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.5],
				[0.2, 1],
			]),
			color: color([
				["ffffcc", 0],
				["ff6600", 0.5],
				["330000", 1],
			]),
			speed: speed([
				[40, 0],
				[80, 0.5],
				[120, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -60, max: 60 },
			lifetime: { min: 0.5, max: 1.0 },
			frequency: 0.02,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 120,
			addAtBack: true,
		},
	},
	meteorStrike: {
		label: "Meteor / Falling Star",
		category: "spell-fire",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.8, 0.2],
				[0, 0.6],
			]),
			scale: scale([
				[1.0, 0],
				[3.0, 0.3],
				[0.5, 1],
			]),
			color: color([
				["ffffff", 0],
				["ffaa22", 0.3],
				["660000", 1],
			]),
			speed: speed([
				[700, 0],
				[200, 0.5],
				[40, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -100, max: 100 },
			lifetime: { min: 0.3, max: 0.7 },
			frequency: 0.001,
			particlesPerWave: 45,
			emitterLifetime: 0.2,
			maxParticles: 200,
			addAtBack: false,
		},
	},

	// ═══════════════════════ ADDITIONAL ICE ═══════════════════════
	iceStorm: {
		label: "Ice Storm / Hail",
		category: "spell-ice",
		config: {
			...rectSpawn(-80, -40, 160, 10),
			alpha: alpha([
				[0.8, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.4, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ffffff", 0],
				["aaccee", 0.5],
				["446688", 1],
			]),
			speed: speed([
				[350, 0],
				[450, 1],
			]),
			startRotation: { min: 80, max: 100 },
			rotationSpeed: { min: -100, max: 100 },
			lifetime: { min: 0.3, max: 0.6 },
			frequency: 0.015,
			particlesPerWave: 4,
			emitterLifetime: -1,
			maxParticles: 150,
			addAtBack: false,
		},
	},
	sleetStorm: {
		label: "Sleet Storm",
		category: "spell-ice",
		config: {
			...rectSpawn(-100, -30, 200, 10),
			alpha: alpha([
				[0.5, 0],
				[0.3, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.1, 0],
				[0.2, 0.5],
				[0.1, 1],
			]),
			color: color([
				["eeeeff", 0],
				["bbccdd", 0.5],
				["667788", 1],
			]),
			speed: speed([
				[200, 0],
				[300, 1],
			]),
			startRotation: { min: 70, max: 110 },
			rotationSpeed: { min: -50, max: 50 },
			lifetime: { min: 0.4, max: 0.8 },
			frequency: 0.01,
			particlesPerWave: 5,
			emitterLifetime: -1,
			maxParticles: 200,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ADDITIONAL NATURE ═══════════════════════
	entangle: {
		label: "Entangle / Vines",
		category: "spell-nature",
		config: {
			...ringSpawn(0, 0, 50),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.8],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.5, 0.5],
				[0.2, 1],
			]),
			color: color([
				["88cc44", 0],
				["447722", 0.5],
				["223311", 1],
			]),
			speed: speed([
				[20, 0],
				[40, 0.5],
				[10, 1],
			]),
			startRotation: { min: 80, max: 100 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.04,
			particlesPerWave: 3,
			emitterLifetime: -1,
			maxParticles: 100,
			addAtBack: true,
		},
	},
	callLightning: {
		label: "Call Lightning",
		category: "spell-nature",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[1, 0.05],
				[0, 0.3],
			]),
			scale: scale([
				[0.4, 0],
				[0.1, 1],
			]),
			color: color([
				["ffffff", 0],
				["ccddff", 0.1],
				["4466aa", 1],
			]),
			speed: speed([
				[1000, 0],
				[600, 1],
			]),
			startRotation: { min: 85, max: 95 },
			rotationSpeed: { min: -200, max: 200 },
			lifetime: { min: 0.05, max: 0.15 },
			frequency: 0.001,
			particlesPerWave: 10,
			emitterLifetime: 0.1,
			maxParticles: 50,
			addAtBack: false,
		},
	},
	insectPlague: {
		label: "Insect Plague / Swarm",
		category: "spell-nature",
		config: {
			...ringSpawn(0, 0, 45),
			alpha: alpha([
				[0.6, 0],
				[0.4, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.08, 0],
				[0.15, 0.5],
				[0.08, 1],
			]),
			color: color([
				["886633", 0],
				["554422", 0.5],
				["221100", 1],
			]),
			speed: speed([
				[60, 0],
				[100, 0.5],
				[40, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -200, max: 200 },
			lifetime: { min: 0.5, max: 1.0 },
			frequency: 0.01,
			particlesPerWave: 6,
			emitterLifetime: -1,
			maxParticles: 200,
			addAtBack: false,
		},
	},
	sunbeam: {
		label: "Sunbeam",
		category: "spell-nature",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[1, 0],
				[0.8, 0.3],
				[0, 0.8],
			]),
			scale: scale([
				[0.5, 0],
				[1.2, 0.3],
				[0.3, 1],
			]),
			color: color([
				["ffffee", 0],
				["ffee88", 0.3],
				["cc8800", 1],
			]),
			speed: speed([
				[600, 0],
				[400, 1],
			]),
			startRotation: { min: -5, max: 5 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 0.2, max: 0.5 },
			frequency: 0.004,
			particlesPerWave: 6,
			emitterLifetime: 0.5,
			maxParticles: 150,
			addAtBack: false,
		},
	},

	// ═══════════════════════ ADDITIONAL DAMAGE ═══════════════════════
	poisonSlash: {
		label: "Poison Slash",
		category: "damage",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.9, 0],
				[0.5, 0.4],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.4, 0.3],
				[0.1, 1],
			]),
			color: color([
				["88ff44", 0],
				["448822", 0.5],
				["113300", 1],
			]),
			speed: speed([
				[250, 0],
				[60, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -80, max: 80 },
			lifetime: { min: 0.2, max: 0.5 },
			frequency: 0.001,
			particlesPerWave: 15,
			emitterLifetime: 0.1,
			maxParticles: 50,
			addAtBack: false,
		},
	},
	forceImpact: {
		label: "Force Impact",
		category: "damage",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[0.9, 0],
				[0.4, 0.3],
				[0, 0.7],
			]),
			scale: scale([
				[0.4, 0],
				[1.5, 0.3],
				[0.2, 1],
			]),
			color: color([
				["eeddff", 0],
				["8866cc", 0.3],
				["332255", 1],
			]),
			speed: speed([
				[350, 0],
				[100, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -60, max: 60 },
			lifetime: { min: 0.2, max: 0.4 },
			frequency: 0.001,
			particlesPerWave: 20,
			emitterLifetime: 0.12,
			maxParticles: 60,
			addAtBack: false,
		},
	},

	// ═══════════════════════ ADDITIONAL HEALING ═══════════════════════
	regeneration: {
		label: "Regeneration",
		category: "healing",
		config: {
			...ringSpawn(0, 0, 25),
			alpha: alpha([
				[0, 0],
				[0.6, 0.3],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.15, 0],
				[0.4, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ccffcc", 0],
				["66cc66", 0.5],
				["228822", 1],
			]),
			speed: speed([
				[8, 0],
				[20, 0.5],
				[30, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.06,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 40,
			addAtBack: true,
		},
	},
	massCure: {
		label: "Mass Cure / Mass Heal",
		category: "healing",
		config: {
			...ringSpawn(0, 0, 70),
			alpha: alpha([
				[0, 0],
				[0.5, 0.2],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.5],
				[0.3, 1],
			]),
			color: color([
				["ffffcc", 0],
				["88ff88", 0.5],
				["228822", 1],
			]),
			speed: speed([
				[30, 0],
				[60, 0.5],
				[100, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 1, max: 2 },
			frequency: 0.02,
			particlesPerWave: 4,
			emitterLifetime: 2.0,
			maxParticles: 150,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ADDITIONAL MOVEMENT ═══════════════════════
	flyTrail: {
		label: "Fly / Levitate Trail",
		category: "movement",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.4, 0],
				[0.2, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.4, 0.5],
				[0.15, 1],
			]),
			color: color([
				["ccddff", 0],
				["6688cc", 0.5],
				["334466", 1],
			]),
			speed: speed([
				[5, 0],
				[10, 1],
			]),
			startRotation: { min: 80, max: 100 },
			rotationSpeed: { min: -15, max: 15 },
			lifetime: { min: 0.5, max: 1.5 },
			frequency: 0.06,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 25,
			addAtBack: true,
		},
	},
	swimBubbles: {
		label: "Swim Bubbles",
		category: "movement",
		config: {
			...pointSpawn(),
			alpha: alpha([
				[0.5, 0],
				[0.3, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.1, 0],
				[0.25, 0.5],
				[0.1, 1],
			]),
			color: color([
				["cceeFF", 0],
				["88bbdd", 0.5],
				["446677", 1],
			]),
			speed: speed([
				[30, 0],
				[50, 1],
			]),
			startRotation: { min: 255, max: 285 },
			rotationSpeed: { min: -10, max: 10 },
			lifetime: { min: 0.5, max: 1.2 },
			frequency: 0.06,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 30,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ADDITIONAL ENVIRONMENT ═══════════════════════
	mistFog: {
		label: "Mist / Fog",
		category: "environment",
		config: {
			...ringSpawn(0, 0, 100),
			alpha: alpha([
				[0, 0],
				[0.2, 0.3],
				[0.15, 0.7],
				[0, 1],
			]),
			scale: scale([
				[2.0, 0],
				[4.0, 0.5],
				[5.0, 1],
			]),
			color: color([
				["cccccc", 0],
				["999999", 0.5],
				["666666", 1],
			]),
			speed: speed([
				[3, 0],
				[8, 0.5],
				[3, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -3, max: 3 },
			lifetime: { min: 5, max: 10 },
			frequency: 0.2,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 30,
			addAtBack: true,
		},
	},
	fallingLeaves: {
		label: "Falling Leaves",
		category: "environment",
		config: {
			...rectSpawn(-120, -40, 240, 10),
			alpha: alpha([
				[0.7, 0],
				[0.5, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.15, 0],
				[0.25, 0.5],
				[0.1, 1],
			]),
			color: color([
				["cc8844", 0],
				["886622", 0.5],
				["443311", 1],
			]),
			speed: speed([
				[20, 0],
				[40, 0.5],
				[60, 1],
			]),
			startRotation: { min: 80, max: 100 },
			rotationSpeed: { min: -60, max: 60 },
			lifetime: { min: 2, max: 5 },
			frequency: 0.15,
			particlesPerWave: 1,
			emitterLifetime: -1,
			maxParticles: 30,
			addAtBack: true,
		},
	},
	snowDrift: {
		label: "Snow Drift",
		category: "environment",
		config: {
			...rectSpawn(-120, -30, 240, 10),
			alpha: alpha([
				[0.6, 0],
				[0.4, 0.5],
				[0, 1],
			]),
			scale: scale([
				[0.08, 0],
				[0.15, 0.5],
				[0.06, 1],
			]),
			color: color([
				["ffffff", 0],
				["ddeeff", 0.5],
				["aabbcc", 1],
			]),
			speed: speed([
				[15, 0],
				[30, 0.5],
				[50, 1],
			]),
			startRotation: { min: 75, max: 105 },
			rotationSpeed: { min: -20, max: 20 },
			lifetime: { min: 3, max: 7 },
			frequency: 0.06,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 60,
			addAtBack: true,
		},
	},

	// ═══════════════════════ ADDITIONAL SA-SPECIFIC ═══════════════════════
	hunterAwakening: {
		label: "Hunter Awakening",
		category: "sa-specific",
		config: {
			...ringSpawn(0, 0, 40),
			alpha: alpha([
				[0, 0],
				[0.7, 0.2],
				[0.4, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.2, 0],
				[0.6, 0.5],
				[0.2, 1],
			]),
			color: color([
				["44ccff", 0],
				["2288aa", 0.5],
				["114455", 1],
			]),
			speed: speed([
				[15, 0],
				[30, 0.5],
				[60, 1],
			]),
			startRotation: { min: 250, max: 290 },
			rotationSpeed: { min: -25, max: 25 },
			lifetime: { min: 1, max: 2 },
			frequency: 0.025,
			particlesPerWave: 3,
			emitterLifetime: 2.0,
			maxParticles: 100,
			addAtBack: true,
		},
	},
	systemCrash: {
		label: "System Crash / Glitch",
		category: "sa-specific",
		config: {
			...burstSpawn(),
			alpha: alpha([
				[1, 0],
				[0.5, 0.3],
				[0, 0.6],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.2],
				[0.1, 1],
			]),
			color: color([
				["ff4444", 0],
				["44ff44", 0.2],
				["4444ff", 0.5],
				["ff4444", 1],
			]),
			speed: speed([
				[300, 0],
				[80, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: -300, max: 300 },
			lifetime: { min: 0.15, max: 0.4 },
			frequency: 0.001,
			particlesPerWave: 25,
			emitterLifetime: 0.3,
			maxParticles: 100,
			addAtBack: false,
		},
	},
	dimensionGate: {
		label: "Dimension Gate Opening",
		category: "sa-specific",
		config: {
			...ringSpawn(0, 0, 45),
			alpha: alpha([
				[0, 0],
				[0.8, 0.15],
				[0.5, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.3, 0],
				[0.8, 0.3],
				[0.4, 1],
			]),
			color: color([
				["88aaff", 0],
				["4466cc", 0.4],
				["222266", 1],
			]),
			speed: speed([
				[10, 0],
				[25, 0.5],
				[5, 1],
			]),
			startRotation: { min: 0, max: 360 },
			rotationSpeed: { min: 60, max: 100 },
			lifetime: { min: 1.5, max: 3 },
			frequency: 0.03,
			particlesPerWave: 4,
			emitterLifetime: -1,
			maxParticles: 120,
			addAtBack: true,
		},
	},
	regressionCurse: {
		label: "Regression Curse",
		category: "sa-specific",
		config: {
			...ringSpawn(0, 0, 30),
			alpha: alpha([
				[0, 0],
				[0.6, 0.2],
				[0.3, 0.7],
				[0, 1],
			]),
			scale: scale([
				[0.8, 0],
				[0.3, 0.5],
				[0.1, 1],
			]),
			color: color([
				["ff6666", 0],
				["cc2244", 0.5],
				["440011", 1],
			]),
			speed: speed([
				[5, 0],
				[20, 0.5],
				[40, 1],
			]),
			startRotation: { min: 80, max: 100 },
			rotationSpeed: { min: -40, max: 40 },
			lifetime: { min: 1, max: 2 },
			frequency: 0.04,
			particlesPerWave: 2,
			emitterLifetime: -1,
			maxParticles: 60,
			addAtBack: true,
		},
	},
};

// ─── Public API ─────────────────────────────────────────────

/** Get a preset by its key. Throws if not found. */
export function getPreset(key: string): ParticlePreset["config"] {
	const preset = PARTICLE_PRESETS[key];
	if (!preset) throw new Error(`Unknown particle preset: ${key}`);
	return preset.config;
}

/** List all presets, optionally filtered by category. */
export function listPresets(
	category?: ParticleCategory,
): Array<{ key: string } & ParticlePreset> {
	return Object.entries(PARTICLE_PRESETS)
		.filter(([, p]) => !category || p.category === category)
		.map(([key, p]) => ({ key, ...p }));
}

/** Get all unique categories. */
export function listCategories(): ParticleCategory[] {
	const set = new Set<ParticleCategory>();
	for (const p of Object.values(PARTICLE_PRESETS)) set.add(p.category);
	return Array.from(set);
}
