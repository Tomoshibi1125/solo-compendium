import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import {
	GATE_RANKS,
	type GateRank,
	TREASURE_ITEM_RARITIES,
	TREASURE_MATERIALS,
	TREASURE_RARITY_CHANCES,
	TREASURE_RELIC_RARITIES,
	TREASURE_TABLES,
	type TreasureRarity,
} from "@/data/compendium/wardenToolConfig";
import { listCanonicalEntriesBatch } from "@/lib/canonicalCompendium";
import { formatRegentVernacular } from "@/lib/vernacular";
import {
	toWardenLinkedEntry,
	type WardenGenerationContextType,
	type WardenLinkedEntry,
} from "@/lib/wardenGenerationContext";

export { GATE_RANKS, TREASURE_TABLES };

export function generateRarity(): TreasureRarity {
	const roll = Math.random();
	let cumulative = 0;

	for (const [rarity, chance] of Object.entries(
		TREASURE_RARITY_CHANCES,
	) as Array<[TreasureRarity, number]>) {
		cumulative += chance;
		if (roll <= cumulative) {
			return rarity;
		}
	}

	return "common";
}

export interface TreasureResult {
	rank: string;
	hundreds: number; // $100 Bills (Platinum)
	tens: number; // $10 Bills (Gold)
	fives: number; // $5 Bills (Electrum)
	ones: number; // $1 Bills (Silver)
	dimes: number; // 10¢ Coins (Copper)
	items: string[];
	itemEntries: WardenLinkedEntry[];
	materials: string[];
	relics: string[];
	relicEntries: WardenLinkedEntry[];
	description: string;
}

function isGateRank(rank: string): rank is GateRank {
	return GATE_RANKS.includes(rank as GateRank);
}

function normalizeTreasureRarity(rarity?: string | null): TreasureRarity {
	const normalized = (rarity || "common").toLowerCase().replace(/_/g, "-");
	if (
		normalized === "common" ||
		normalized === "uncommon" ||
		normalized === "rare" ||
		normalized === "very-rare" ||
		normalized === "legendary"
	) {
		return normalized;
	}
	return "common";
}

function filterEntriesByRarity(
	entries: StaticCompendiumEntry[],
	allowedRarities: readonly TreasureRarity[],
): StaticCompendiumEntry[] {
	return entries.filter((entry) =>
		allowedRarities.includes(normalizeTreasureRarity(entry.rarity)),
	);
}

function pickUniqueLinkedEntries(
	entries: WardenLinkedEntry[],
	count: number,
): WardenLinkedEntry[] {
	const pool = [...entries];
	const selected: WardenLinkedEntry[] = [];
	const selectedNames = new Set<string>();

	while (pool.length > 0 && selected.length < count) {
		const index = Math.floor(Math.random() * pool.length);
		const [entry] = pool.splice(index, 1);
		if (!selectedNames.has(entry.name)) {
			selectedNames.add(entry.name);
			selected.push(entry);
		}
	}

	return selected;
}

function linkEntries(
	type: WardenGenerationContextType,
	entries: StaticCompendiumEntry[],
): WardenLinkedEntry[] {
	return entries.map((entry) => toWardenLinkedEntry(type, entry));
}

function pickUniqueStrings(
	entries: readonly string[],
	count: number,
): string[] {
	const pool = [...entries];
	const selected: string[] = [];

	while (pool.length > 0 && selected.length < count) {
		const index = Math.floor(Math.random() * pool.length);
		const [entry] = pool.splice(index, 1);
		if (!selected.includes(entry)) {
			selected.push(entry);
		}
	}

	return selected;
}

export async function generateTreasure(rank: string): Promise<TreasureResult> {
	if (!isGateRank(rank)) {
		return {
			rank,
			hundreds: 0,
			tens: 0,
			fives: 0,
			ones: 0,
			dimes: 0,
			items: [],
			itemEntries: [],
			materials: [],
			relics: [],
			relicEntries: [],
			description: `Invalid rank: ${rank}`,
		};
	}

	const table = TREASURE_TABLES[rank];
	const pools = await listCanonicalEntriesBatch([
		"equipment",
		"items",
		"tattoos",
		"sigils",
		"relics",
		"artifacts",
	]);

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

	const itemCandidateEntries = [
		...linkEntries("equipment", pools.get("equipment") || []),
		...linkEntries("items", pools.get("items") || []),
		...linkEntries("tattoos", pools.get("tattoos") || []),
		...linkEntries("sigils", pools.get("sigils") || []),
	];
	const itemCandidates = filterEntriesByRarity(
		itemCandidateEntries.map((entry) => entry.entry),
		TREASURE_ITEM_RARITIES[rank],
	)
		.map((entry) =>
			itemCandidateEntries.find((linked) => linked.id === entry.id),
		)
		.filter(Boolean) as WardenLinkedEntry[];

	const numItems =
		Math.random() < table.itemChance
			? rank === "S"
				? 2 + Math.floor(Math.random() * 3)
				: 1 + Math.floor(Math.random() * 2)
			: 0;
	const itemEntries =
		numItems > 0
			? pickUniqueLinkedEntries(
					itemCandidates.length > 0 ? itemCandidates : itemCandidateEntries,
					numItems,
				)
			: [];
	const items = itemEntries.map((entry) => entry.name);

	const numMaterials =
		Math.random() < table.materialChance
			? 1 + Math.floor(Math.random() * 2)
			: 0;
	const materials =
		numMaterials > 0
			? pickUniqueStrings(TREASURE_MATERIALS[rank], numMaterials)
			: [];

	const relicCandidateEntries = [
		...linkEntries("relics", pools.get("relics") || []),
		...linkEntries("artifacts", pools.get("artifacts") || []),
	];
	const relicCandidates = filterEntriesByRarity(
		relicCandidateEntries.map((entry) => entry.entry),
		TREASURE_RELIC_RARITIES[rank],
	)
		.map((entry) =>
			relicCandidateEntries.find((linked) => linked.id === entry.id),
		)
		.filter(Boolean) as WardenLinkedEntry[];
	const numRelics = Math.random() < table.relicChance ? 1 : 0;
	const relicEntries =
		numRelics > 0
			? pickUniqueLinkedEntries(
					relicCandidates.length > 0 ? relicCandidates : relicCandidateEntries,
					numRelics,
				)
			: [];
	const relics = relicEntries.map((entry) => entry.name);

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
		itemEntries,
		materials: displayMaterials,
		relics: displayRelics,
		relicEntries,
		description: formatRegentVernacular(descriptions.join(" ")),
	};
}
