export const GATE_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

export type GateRank = (typeof GATE_RANKS)[number];
// Full canonical rarity ladder (see src/types/core-rules.ts): epic is a
// distinct tier above very-rare; mythic sits above legendary (used by the
// top-end relic catalogue); artifact is the apex.
export type TreasureRarity =
	| "common"
	| "uncommon"
	| "rare"
	| "very-rare"
	| "epic"
	| "legendary"
	| "mythic"
	| "artifact";

// Drop weights across the full ladder (sums to 1.0). Mythic, epic, and artifact
// are rare end-game drops so the top-tier relics are actually loot-eligible.
export const TREASURE_RARITY_CHANCES: Record<TreasureRarity, number> = {
	common: 0.576,
	uncommon: 0.24,
	rare: 0.1,
	"very-rare": 0.05,
	epic: 0.02,
	legendary: 0.008,
	mythic: 0.004,
	artifact: 0.002,
};

export interface TreasureTableConfig {
	tenRange: [number, number];
	hundredChance: number;
	fiveChance: number;
	oneChance: number;
	dimeChance: number;
	itemChance: number;
	materialChance: number;
	relicChance: number;
}

export const TREASURE_TABLES: Record<GateRank, TreasureTableConfig> = {
	E: {
		tenRange: [10, 50],
		hundredChance: 0,
		fiveChance: 0.1,
		oneChance: 0.4,
		dimeChance: 0.7,
		itemChance: 0.3,
		materialChance: 0.2,
		relicChance: 0,
	},
	D: {
		tenRange: [50, 200],
		hundredChance: 0.05,
		fiveChance: 0.2,
		oneChance: 0.5,
		dimeChance: 0.6,
		itemChance: 0.5,
		materialChance: 0.4,
		relicChance: 0.1,
	},
	C: {
		tenRange: [200, 500],
		hundredChance: 0.1,
		fiveChance: 0.3,
		oneChance: 0.6,
		dimeChance: 0.4,
		itemChance: 0.6,
		materialChance: 0.5,
		relicChance: 0.15,
	},
	B: {
		tenRange: [500, 1500],
		hundredChance: 0.2,
		fiveChance: 0.4,
		oneChance: 0.5,
		dimeChance: 0.2,
		itemChance: 0.7,
		materialChance: 0.6,
		relicChance: 0.25,
	},
	A: {
		tenRange: [1500, 5000],
		hundredChance: 0.4,
		fiveChance: 0.5,
		oneChance: 0.3,
		dimeChance: 0.1,
		itemChance: 0.8,
		materialChance: 0.7,
		relicChance: 0.4,
	},
	S: {
		tenRange: [5000, 20000],
		hundredChance: 0.8,
		fiveChance: 0.6,
		oneChance: 0.4,
		dimeChance: 0.2,
		itemChance: 1,
		materialChance: 0.9,
		relicChance: 0.6,
	},
};

export const TREASURE_ITEM_RARITIES: Record<
	GateRank,
	readonly TreasureRarity[]
> = {
	E: ["common"],
	D: ["common", "uncommon"],
	C: ["uncommon", "rare"],
	B: ["rare", "very-rare"],
	A: ["very-rare", "epic", "legendary"],
	S: ["epic", "legendary", "mythic", "artifact"],
};

export const TREASURE_RELIC_RARITIES: Record<
	GateRank,
	readonly TreasureRarity[]
> = {
	E: ["common"],
	D: ["uncommon", "common"],
	C: ["rare", "uncommon"],
	B: ["rare", "very-rare"],
	A: ["very-rare", "epic", "legendary"],
	S: ["epic", "legendary", "mythic", "artifact"],
};

export const TREASURE_MATERIALS: Record<GateRank, readonly string[]> = {
	E: ["Common Echo-Core", "Raw Obsidian Ore", "Weak Mana Residue"],
	D: [
		"Resonant Echo-Core",
		"Refined Ferrum Ore",
		"Crystallized Mana Fragment",
		"Raw Umbral-Thin",
	],
	C: [
		"Potent Echo-Core",
		"Cold-Forged Steel Ingot",
		"Refined Prismatic Crystal",
		"Purified Umbral-Thin",
		"Isolated Rift-Fleck",
	],
	B: [
		"Elite Echo-Core",
		"anomaly-grade alloy-Fused Ingot",
		"Pure Aether-Crystal",
		"Hyper-Condensed Umbral-Thin",
		"Stable Rift-Shard",
	],
	A: [
		"Eternal-Grade Echo-Core",
		"lattice-stable composite-Fused Ingot",
		"Perfect Aether-Crystal",
		"Singularity-Grade Umbral-Thin",
		"Massive Rift-Core",
		"The Absolute's Blessing Fragment",
	],
	S: [
		"God-Tier Eternal Core",
		"Divine Aether-Metal",
		"Infinite Mana Singularity",
		"Void-Grade Umbral-Thin",
		"Rift-Genesis Core",
		"The Absolute's Total Blessing",
	],
};

export const RELIC_RANKS = [...GATE_RANKS] as const;
export const RELIC_TYPES = ["weapon", "armor", "accessory", "tool"] as const;
export type RelicType = (typeof RELIC_TYPES)[number];

export const RELIC_RARITY_LEVELS = [
	"common",
	"uncommon",
	"rare",
	"very-rare",
	"epic",
	"legendary",
	"mythic",
	"artifact",
] as const;
export type RelicRarity = (typeof RELIC_RARITY_LEVELS)[number];

export const RELIC_PROPERTY_TYPES = ["passive", "active", "bonus"] as const;
export type RelicPropertyType = (typeof RELIC_PROPERTY_TYPES)[number];

export interface RelicBalanceGuideline {
	properties: number | readonly [number, number];
	maxBonus: number;
	description: string;
}

export const RELIC_BALANCE_GUIDELINES: Record<
	RelicRarity,
	RelicBalanceGuideline
> = {
	common: {
		properties: 1,
		maxBonus: 1,
		description:
			"Basic relics with simple benefits. +1 to attacks or AC, minor utility.",
	},
	uncommon: {
		properties: [1, 2],
		maxBonus: 2,
		description:
			"Improved relics. +1 to attacks and damage, or +2 AC, minor active abilities.",
	},
	rare: {
		properties: [2, 3],
		maxBonus: 3,
		description:
			"Powerful relics. +2 bonuses, significant active abilities, or unique effects.",
	},
	"very-rare": {
		properties: [3, 4],
		maxBonus: 4,
		description:
			"Exceptional relics. +3 bonuses, powerful active abilities, multiple effects.",
	},
	epic: {
		properties: [4, 5],
		maxBonus: 5,
		description:
			"Epic relics. +4 to +5 bonuses, multiple powerful active abilities, reality-bending effects just shy of legend.",
	},
	legendary: {
		properties: [5, 6],
		maxBonus: 6,
		description:
			"Legendary relics. +5 or higher bonuses, game-changing signature abilities famed across an era.",
	},
	mythic: {
		properties: [6, 7],
		maxBonus: 7,
		description:
			"Mythic relics. Named legends of the Rift — multiple signature abilities and world-tier bonuses.",
	},
	artifact: {
		properties: [7, 8],
		maxBonus: 8,
		description:
			"Artifact-tier relics. Unique world-shaping items of mythic power with multiple legendary abilities.",
	},
};
