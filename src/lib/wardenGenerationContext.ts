import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import type { StaticCanonicalEntryType } from "@/lib/canonicalCompendium";
import { listCanonicalEntriesBatch } from "@/lib/canonicalCompendium";
import { RANK_TO_CR } from "@/lib/compendiumAutopopulate";

export const WARDEN_GENERATION_CONTEXT_TYPES = [
	"anomalies",
	"locations",
	"rollable-tables",
	"equipment",
	"items",
	"relics",
	"runes",
	"sigils",
	"artifacts",
	"regents",
	"conditions",
	"feats",
	"backgrounds",
	"techniques",
	"spells",
	"powers",
	"tattoos",
] as const satisfies readonly StaticCanonicalEntryType[];

export type WardenGenerationContextType =
	(typeof WARDEN_GENERATION_CONTEXT_TYPES)[number];

export interface WardenLinkedEntry {
	id: string;
	type: WardenGenerationContextType;
	name: string;
	description: string | null;
	rank: string | null;
	rarity: string | null;
	sourceBook: string | null;
	tags: string[];
	imageUrl: string | null;
	entry: StaticCompendiumEntry;
}

interface WardenGenerationContext {
	campaignId?: string | null;
	entriesByType: Map<WardenGenerationContextType, WardenLinkedEntry[]>;
	allEntries: WardenLinkedEntry[];
	pickOne: (
		type: WardenGenerationContextType,
		options?: WardenPickOptions,
	) => WardenLinkedEntry | null;
	pickMany: (
		type: WardenGenerationContextType,
		count: number,
		options?: WardenPickOptions,
	) => WardenLinkedEntry[];
}

interface WardenPickOptions {
	rank?: string | null;
	theme?: string | null;
	biome?: string | null;
	rarities?: readonly string[];
	tags?: readonly string[];
	bossOnly?: boolean;
}

export function toWardenLinkedEntry(
	type: WardenGenerationContextType,
	entry: StaticCompendiumEntry,
): WardenLinkedEntry {
	return {
		id: entry.id,
		type,
		name: entry.display_name || entry.name,
		description: entry.description ?? null,
		rank: entry.gate_rank ?? entry.rank ?? null,
		rarity: normalizeRarity(entry.rarity),
		sourceBook: entry.source_book ?? null,
		tags: Array.isArray(entry.tags) ? entry.tags.filter(Boolean) : [],
		imageUrl: entry.image_url ?? null,
		entry,
	};
}

export async function loadWardenGenerationContext(options?: {
	campaignId?: string | null;
	types?: readonly WardenGenerationContextType[];
}): Promise<WardenGenerationContext> {
	const types = options?.types ?? WARDEN_GENERATION_CONTEXT_TYPES;
	const batches = await listCanonicalEntriesBatch(types, undefined, {
		campaignId: options?.campaignId ?? null,
	});
	const entriesByType = new Map<
		WardenGenerationContextType,
		WardenLinkedEntry[]
	>();

	for (const type of types) {
		entriesByType.set(
			type,
			(batches.get(type) || []).map((entry) =>
				toWardenLinkedEntry(type, entry),
			),
		);
	}

	const context: WardenGenerationContext = {
		campaignId: options?.campaignId ?? null,
		entriesByType,
		allEntries: Array.from(entriesByType.values()).flat(),
		pickOne: (type, pickOptions) =>
			pickOne(entriesByType.get(type) || [], pickOptions),
		pickMany: (type, count, pickOptions) =>
			pickMany(entriesByType.get(type) || [], count, pickOptions),
	};

	return context;
}

function filterWardenEntries(
	entries: WardenLinkedEntry[],
	options?: WardenPickOptions,
): WardenLinkedEntry[] {
	if (!options) return entries;
	const normalizedRarities = new Set(
		(options.rarities || []).map((rarity) => normalizeRarity(rarity)),
	);
	const normalizedTags = (options.tags || []).map((tag) => tag.toLowerCase());
	const theme = options.theme?.toLowerCase().trim();
	const biome = options.biome?.toLowerCase().trim();

	return entries.filter((entry) => {
		if (options.rank && !matchesRank(entry.entry, options.rank)) return false;
		if (options.bossOnly && !entry.entry.is_boss) return false;
		if (normalizedRarities.size > 0) {
			const rarity = normalizeRarity(entry.rarity);
			if (!rarity || !normalizedRarities.has(rarity)) return false;
		}
		if (normalizedTags.length > 0) {
			const entryTags = entry.tags.map((tag) => tag.toLowerCase());
			if (!normalizedTags.some((tag) => entryTags.includes(tag))) return false;
		}
		if (theme && !entryMatchesTerm(entry, theme)) {
			if (biome && !entryMatchesTerm(entry, biome)) return false;
		}
		return true;
	});
}

function pickOne(
	entries: WardenLinkedEntry[],
	options?: WardenPickOptions,
): WardenLinkedEntry | null {
	const filtered = filterWardenEntries(entries, options);
	const pool = filtered.length > 0 ? filtered : entries;
	if (pool.length === 0) return null;
	return pool[Math.floor(Math.random() * pool.length)];
}

function pickMany(
	entries: WardenLinkedEntry[],
	count: number,
	options?: WardenPickOptions,
): WardenLinkedEntry[] {
	const filtered = filterWardenEntries(entries, options);
	const pool = [...(filtered.length > 0 ? filtered : entries)];
	const selected: WardenLinkedEntry[] = [];

	while (pool.length > 0 && selected.length < count) {
		const index = Math.floor(Math.random() * pool.length);
		const [entry] = pool.splice(index, 1);
		selected.push(entry);
	}

	return selected;
}

export function rankToTreasureRarities(rank: string): string[] {
	switch (rank.trim().toUpperCase()) {
		case "E":
		case "D":
			return ["common", "uncommon"];
		case "C":
		case "B":
			return ["uncommon", "rare", "very-rare"];
		case "A":
		case "S":
			return ["rare", "very-rare", "legendary"];
		default:
			return ["common", "uncommon", "rare"];
	}
}

function matchesRank(entry: StaticCompendiumEntry, rank: string): boolean {
	const normalizedRank = rank.trim().toUpperCase();
	if (!normalizedRank) return true;
	if ((entry.gate_rank || entry.rank || "").toUpperCase() === normalizedRank) {
		return true;
	}
	if (typeof entry.cr === "string" && RANK_TO_CR[normalizedRank]) {
		return RANK_TO_CR[normalizedRank].includes(entry.cr);
	}
	if (typeof entry.level === "number") {
		const level = entry.level;
		if (normalizedRank === "E") return level <= 3;
		if (normalizedRank === "D") return level >= 2 && level <= 6;
		if (normalizedRank === "C") return level >= 5 && level <= 10;
		if (normalizedRank === "B") return level >= 9 && level <= 14;
		if (normalizedRank === "A") return level >= 13 && level <= 18;
		if (normalizedRank === "S") return level >= 17;
	}
	return false;
}

function normalizeRarity(rarity?: string | null): string | null {
	return rarity?.toLowerCase().replace(/_/g, "-") ?? null;
}

function entryMatchesTerm(entry: WardenLinkedEntry, term: string): boolean {
	const haystack = [
		entry.name,
		entry.description ?? "",
		entry.entry.theme ?? "",
		entry.entry.location_type ?? "",
		entry.entry.artifact_type ?? "",
		...entry.tags,
	]
		.join(" ")
		.toLowerCase();
	return haystack.includes(term);
}
