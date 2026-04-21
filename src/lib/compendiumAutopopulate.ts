import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

/**
 * Maps RIFT Ranks to Challenge Rating ranges
 */
export const RANK_TO_CR: Record<string, string[]> = {
	E: ["0", "1/8", "1/4", "1/2", "1"],
	D: ["2", "3", "4"],
	C: ["5", "6", "7", "8"],
	B: ["9", "10", "11", "12"],
	A: ["13", "14", "15", "16"],
	S: [
		"17",
		"18",
		"19",
		"20",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"29",
		"30",
	],
};

const lowRankRarities = new Set(["common", "uncommon"]);
const midRankRarities = new Set(["rare", "very_rare"]);
const highRankRarities = new Set(["legendary", "very_rare"]);

function pickRandomEntry<T>(entries: T[]): T | null {
	if (entries.length === 0) {
		return null;
	}

	const randomIndex = Math.floor(Math.random() * entries.length);
	return entries[randomIndex];
}

function matchesRank(entry: StaticCompendiumEntry, rank: string): boolean {
	if (!rank) {
		return true;
	}

	const normalizedRank = rank.trim().toUpperCase();
	if ((entry.gate_rank || entry.rank || "").toUpperCase() === normalizedRank) {
		return true;
	}

	if (typeof entry.cr === "string" && RANK_TO_CR[normalizedRank]) {
		return RANK_TO_CR[normalizedRank].includes(entry.cr);
	}

	return false;
}

function filterEquipmentByRank(
	entries: StaticCompendiumEntry[],
	rank?: string,
): StaticCompendiumEntry[] {
	if (!rank) {
		return entries;
	}

	const normalizedRank = rank.trim().toUpperCase();
	if (normalizedRank === "E" || normalizedRank === "D") {
		return entries.filter((entry) => lowRankRarities.has(entry.rarity || ""));
	}
	if (normalizedRank === "C" || normalizedRank === "B") {
		return entries.filter((entry) => midRankRarities.has(entry.rarity || ""));
	}
	if (normalizedRank === "A" || normalizedRank === "S") {
		return entries.filter((entry) => highRankRarities.has(entry.rarity || ""));
	}

	return entries;
}

export async function getRandomAnomaly(rank?: string) {
	const anomalies = await listCanonicalEntries("anomalies");
	const filtered = rank
		? anomalies.filter((entry) => matchesRank(entry, rank))
		: anomalies;
	return pickRandomEntry(filtered.length > 0 ? filtered : anomalies);
}

export async function getRandomEquipment(rank?: string) {
	const equipment = await listCanonicalEntries("equipment");
	const filtered = filterEquipmentByRank(equipment, rank);
	return pickRandomEntry(filtered.length > 0 ? filtered : equipment);
}

export async function getRandomFeat() {
	const feats = await listCanonicalEntries("feats");
	return pickRandomEntry(feats);
}

export async function getRandomRune() {
	const runes = await listCanonicalEntries("runes");
	return pickRandomEntry(runes);
}
