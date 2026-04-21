import type {
	StaticCompendiumEntry,
	StaticDataProvider,
} from "@/data/compendium/providers/types";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";

export const staticCanonicalEntryTypes = [
	"jobs",
	"paths",
	"powers",
	"runes",
	"relics",
	"anomalies",
	"backgrounds",
	"conditions",
	"regents",
	"feats",
	"skills",
	"equipment",
	"shadow-soldiers",
	"items",
	"spells",
	"techniques",
	"artifacts",
	"locations",
	"sigils",
	"tattoos",
	"deities",
	"pantheon",
] as const;

export type StaticCanonicalEntryType =
	(typeof staticCanonicalEntryTypes)[number];

const equipmentItemTypes = new Set([
	"weapon",
	"armor",
	"shield",
	"gear",
	"tools",
]);

const providerMethodByType: Record<
	StaticCanonicalEntryType,
	keyof StaticDataProvider
> = {
	jobs: "getJobs",
	paths: "getPaths",
	powers: "getPowers",
	runes: "getRunes",
	relics: "getRelics",
	anomalies: "getAnomalies",
	backgrounds: "getBackgrounds",
	conditions: "getConditions",
	regents: "getRegents",
	feats: "getFeats",
	skills: "getSkills",
	equipment: "getItems",
	"shadow-soldiers": "getShadowSoldiers",
	items: "getItems",
	spells: "getSpells",
	techniques: "getTechniques",
	artifacts: "getArtifacts",
	locations: "getLocations",
	sigils: "getSigils",
	tattoos: "getTattoos",
	deities: "getPantheon",
	pantheon: "getPantheon",
};

let staticProviderPromise: Promise<StaticDataProvider> | null = null;

async function loadStaticProvider(): Promise<StaticDataProvider> {
	if (!staticProviderPromise) {
		staticProviderPromise = import("@/data/compendium/providers").then(
			(module) => module.staticDataProvider as StaticDataProvider,
		);
	}

	return staticProviderPromise;
}

export function isStaticCanonicalEntryType(
	value: string,
): value is StaticCanonicalEntryType {
	return staticCanonicalEntryTypes.includes(value as StaticCanonicalEntryType);
}

export function isEquipmentLikeEntry(entry: StaticCompendiumEntry): boolean {
	const itemType = (entry.item_type || entry.equipment_type || "")
		.toLowerCase()
		.trim();
	return equipmentItemTypes.has(itemType);
}

export function classifyCanonicalItemType(
	entry: StaticCompendiumEntry,
): "equipment" | "items" {
	return isEquipmentLikeEntry(entry) ? "equipment" : "items";
}

export async function listCanonicalEntries(
	type: StaticCanonicalEntryType,
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<StaticCompendiumEntry[]> {
	const provider = await loadStaticProvider();
	const methodName = providerMethodByType[type];
	let entries = await provider[methodName](search);

	if (type === "equipment") {
		entries = entries.filter(isEquipmentLikeEntry);
	} else if (type === "items") {
		entries = entries.filter((entry) => !isEquipmentLikeEntry(entry));
	}

	return filterRowsBySourcebookAccess(
		entries,
		(entry) => entry.source_book,
		accessContext,
	);
}

export async function findCanonicalEntryByName(
	type: StaticCanonicalEntryType,
	name: string,
): Promise<StaticCompendiumEntry | null> {
	if (!name) return null;
	const provider = await loadStaticProvider();
	const methodName = providerMethodByType[type];
	const entries = await provider[methodName]();
	const lookup = name.trim().toLowerCase();
	const match = entries.find((entry) => entry.name.toLowerCase() === lookup);
	if (match && type === "equipment" && !isEquipmentLikeEntry(match))
		return null;
	if (match && type === "items" && isEquipmentLikeEntry(match)) return null;
	return match ?? null;
}

export async function listCanonicalEntriesBatch(
	types: readonly StaticCanonicalEntryType[],
	search?: string,
	accessContext?: { campaignId?: string | null },
): Promise<Map<StaticCanonicalEntryType, StaticCompendiumEntry[]>> {
	const results = await Promise.all(
		types.map(
			async (type) =>
				[
					type,
					await listCanonicalEntries(type, search, accessContext),
				] as const,
		),
	);

	return new Map(results);
}
