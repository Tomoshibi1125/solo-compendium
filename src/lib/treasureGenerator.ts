import { formatRegentVernacular } from "@/lib/vernacular";

// Rarity system for treasure
const RARITY_CHANCES = {
	common: 0.6,
	uncommon: 0.25,
	rare: 0.1,
	very_rare: 0.04,
	legendary: 0.01,
};

export function generateRarity(): string {
	const roll = Math.random();
	let cumulative = 0;

	for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
		cumulative += chance;
		if (roll <= cumulative) {
			return rarity;
		}
	}

	return "common";
}

export const GATE_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

export interface TreasureResult {
	rank: string;
	hundreds: number; // $100 Bills (Platinum)
	tens: number; // $10 Bills (Gold)
	fives: number; // $5 Bills (Electrum)
	ones: number; // $1 Bills (Silver)
	dimes: number; // 10¢ Coins (Copper)
	items: string[];
	materials: string[];
	relics: string[];
	description: string;
}

export const TREASURE_TABLES: Record<
	string,
	{
		tenRange: [number, number];
		hundredChance: number;
		fiveChance: number;
		oneChance: number;
		dimeChance: number;
		itemChance: number;
		materialChance: number;
		relicChance: number;
		items: string[];
		materials: string[];
		relics: string[];
	}
> = {
	E: {
		tenRange: [10, 50],
		hundredChance: 0,
		fiveChance: 0.1,
		oneChance: 0.4,
		dimeChance: 0.7,
		itemChance: 0.3,
		materialChance: 0.2,
		relicChance: 0,
		items: [
			"Vitreous Healing Draught",
			"Low-Grade Mana Sliver",
			"Ashen Dagger",
			"Basic Hemostatic Wrap",
			"Phosphorescent Flare",
			"Reinforced Binding Cable",
		],
		materials: ["Common Echo-Core", "Raw Obsidian Ore", "Weak Mana Residue"],
		relics: [],
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
		items: [
			"Coalesced Vitality Potion",
			"Scintillating Mana Draught",
			"Tempered Ferrum Blade",
			"Laminated Hide Harness",
			"Flickering Relic-Shard",
			"Aether-Woven Cable",
		],
		materials: [
			"Resonant Echo-Core",
			"Refined Ferrum Ore",
			"Crystallized Mana Fragment",
			"Raw Umbral-Thin",
		],
		relics: ["Fractured Echo-Relic"],
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
		items: [
			"Greater Vitality Catalyst",
			"Greater Prismatic Mana Phial",
			"Cold-Forged Steel Arming",
			"Reinforced Brigandine",
			"Stable Relic-Shard",
			"Rift-Touched Trinket",
		],
		materials: [
			"Potent Echo-Core",
			"Cold-Forged Steel Ingot",
			"Refined Prismatic Crystal",
			"Purified Umbral-Thin",
			"Isolated Rift-Fleck",
		],
		relics: ["Pristine Echo-Shard", "Dormant Relic-Core"],
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
		items: [
			"Sovereign Restoration Serum",
			"Apex Mana Tincture",
			"Vanguard's Masterwork Blade",
			"Aether-Infused Plate",
			"Resonating Relic-Component",
			"High-Frequency Arcane Lens",
		],
		materials: [
			"Elite Echo-Core",
			"Mithril-Fused Ingot",
			"Pure Aether-Crystal",
			"Hyper-Condensed Umbral-Thin",
			"Stable Rift-Shard",
		],
		relics: ["Integrated Relic-Lattice", "Pulsing Relic-Heart"],
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
		items: [
			"Architect's Vitality Catalyst",
			"Architect's Mana Infusion",
			"Singularity Blade Schematic",
			"Null-Field Armor Schematic",
			"Pristine Relic-Assembly",
			"Umbral Null-Relic",
		],
		materials: [
			"Eternal-Grade Echo-Core",
			"Adamantine-Fused Ingot",
			"Perfect Aether-Crystal",
			"Singularity-Grade Umbral-Thin",
			"Massive Rift-Core",
			"The Absolute's Blessing Fragment",
		],
		relics: ["Near-Synchronized Relic", "Radiant Relic-Soul"],
	},
	S: {
		tenRange: [5000, 20000],
		hundredChance: 0.8,
		fiveChance: 0.6,
		oneChance: 0.4,
		dimeChance: 0.2,
		itemChance: 1.0,
		materialChance: 0.9,
		relicChance: 0.6,
		items: [
			"Ascendant's Divine Elixir",
			"Eternal's Mana Singularity",
			"Ethereal Artifact Schematic",
			"Void-Reaper Armor Schematic",
			"Omni-Relic Synthesizer",
			"Sovereign Artifact Cluster",
		],
		materials: [
			"God-Tier Eternal Core",
			"Divine Aether-Metal",
			"Infinite Mana Singularity",
			"Void-Grade Umbral-Thin",
			"Rift-Genesis Core",
			"The Absolute's Total Blessing",
		],
		relics: [
			"Sovereign Omni-Relic",
			"Eternal's Fragmented Soul-Core",
			"Umbral Regent Protocol",
		],
	},
};

export function generateTreasure(rank: string): TreasureResult {
	const table = TREASURE_TABLES[rank];
	if (!table) {
		return {
			rank,
			hundreds: 0,
			tens: 0,
			fives: 0,
			ones: 0,
			dimes: 0,
			items: [],
			materials: [],
			relics: [],
			description: `Invalid rank: ${rank}`,
		};
	}

	const tens = Math.floor(
		Math.random() * (table.tenRange[1] - table.tenRange[0] + 1) +
			table.tenRange[0],
	);

	const hundreds =
		Math.random() < table.hundredChance ? Math.floor(Math.random() * 5) + 1 : 0;
	const fives =
		Math.random() < table.fiveChance ? Math.floor(Math.random() * 10) + 1 : 0;
	const ones =
		Math.random() < table.oneChance ? Math.floor(Math.random() * 20) + 5 : 0;
	const dimes =
		Math.random() < table.dimeChance ? Math.floor(Math.random() * 50) + 10 : 0;

	const items: string[] = [];
	const numItems =
		Math.random() < table.itemChance
			? rank === "S"
				? 2 + Math.floor(Math.random() * 3)
				: 1 + Math.floor(Math.random() * 2)
			: 0;
	for (let i = 0; i < numItems; i += 1) {
		const item = table.items[Math.floor(Math.random() * table.items.length)];
		if (!items.includes(item)) {
			items.push(item);
		}
	}

	const materials: string[] = [];
	const numMaterials =
		Math.random() < table.materialChance
			? 1 + Math.floor(Math.random() * 2)
			: 0;
	for (let i = 0; i < numMaterials; i += 1) {
		const material =
			table.materials[Math.floor(Math.random() * table.materials.length)];
		if (!materials.includes(material)) {
			materials.push(material);
		}
	}

	const relics: string[] = [];
	const numRelics = Math.random() < table.relicChance ? 1 : 0;
	for (let i = 0; i < numRelics; i += 1) {
		const relic = table.relics[Math.floor(Math.random() * table.relics.length)];
		if (!relics.includes(relic)) {
			relics.push(relic);
		}
	}

	const descriptions: string[] = [];
	const displayItems = items.map(formatRegentVernacular);
	const displayMaterials = materials.map(formatRegentVernacular);
	const displayRelics = relics.map(formatRegentVernacular);

	let currencyDesc = `Rift Rank ${rank} treasure hoard containing $${tens * 10} USD (in $10 Bills).`;
	const extras = [];
	if (hundreds > 0) extras.push(`${hundreds} x $100 Bills`);
	if (fives > 0) extras.push(`${fives} x $5 Bills`);
	if (ones > 0) extras.push(`${ones} x $1 Bills`);
	if (dimes > 0) extras.push(`${dimes} x 10¢ Coins`);

	if (extras.length > 0) {
		currencyDesc += ` Additional denominations: ${extras.join(", ")}.`;
	}
	descriptions.push(currencyDesc);

	if (displayItems.length > 0) {
		descriptions.push(`Items found: ${displayItems.join(", ")}.`);
	}

	if (displayMaterials.length > 0) {
		descriptions.push(`Materials recovered: ${displayMaterials.join(", ")}.`);
	}

	if (displayRelics.length > 0) {
		descriptions.push(
			`Relics discovered: ${displayRelics.join(", ")} - these are particularly valuable and rare!`,
		);
	}

	return {
		rank,
		hundreds,
		tens,
		fives,
		ones,
		dimes,
		items: displayItems,
		materials: displayMaterials,
		relics: displayRelics,
		description: formatRegentVernacular(descriptions.join(" ")),
	};
}
