import { type Item, retainCoherentItemCompatibilityCandidates } from "./items";
import {
	type CanonicalEntryRecord,
	type CompendiumCandidate,
	createCompendiumCandidate,
	createCompletenessFirstNameView,
	getRegisteredSource,
	type MergeCanonicalCandidatesResult,
	mergeCanonicalCandidates,
} from "./registry";

/**
 * Lazy per-shard item assembly for the app bundle.
 *
 * Source candidates are retained and reconciled by the universal registry.
 * Duplicate names therefore produce reviewable blocking conflicts instead of
 * the former silent "later part wins" Map replacement.
 */

type LoadedItemPart = readonly [sourceId: string, items: readonly Item[]];

export interface LazyItemResolution {
	candidates: CompendiumCandidate[];
	resolution: MergeCanonicalCandidatesResult;
	items: Item[];
}

function reconcileItemParts(
	parts: readonly LoadedItemPart[],
): LazyItemResolution {
	const candidates = parts.flatMap(([sourceId, items], sourceIndex) => {
		const source = getRegisteredSource(sourceId);
		if (!source) throw new Error(`Unregistered item source: ${sourceId}`);
		return items.map((item, ordinal) =>
			createCompendiumCandidate(
				"items",
				source,
				item as unknown as CanonicalEntryRecord,
				ordinal,
				sourceIndex * 1_000_000 + ordinal,
			),
		);
	});
	const resolution = mergeCanonicalCandidates("items", candidates);
	const coherentCandidates = retainCoherentItemCompatibilityCandidates(
		resolution.entries.map((entry) => entry.value as unknown as Item),
	);
	const items = createCompletenessFirstNameView(
		coherentCandidates as unknown as CanonicalEntryRecord[],
	) as unknown as Item[];
	return { candidates, resolution, items };
}

const loadCoreItemParts = (): Promise<LoadedItemPart[]> =>
	Promise.all([
		import("./items-base-equipment").then(
			(m) => ["items/base-equipment", m.baseEquipment] as const,
		),
		import("./items-part1").then(
			(m) => ["items/part-1", m.items_part1] as const,
		),
		import("./items-part2").then(
			(m) => ["items/part-2", m.items_part2] as const,
		),
		import("./items-part3").then(
			(m) => ["items/part-3", m.items_part3] as const,
		),
		import("./items-part4").then(
			(m) => ["items/part-4", m.items_part4] as const,
		),
		import("./items-part5").then(
			(m) => ["items/part-5", m.items_part5] as const,
		),
	]);

const loadAllItemParts = (): Promise<LoadedItemPart[]> =>
	Promise.all([
		loadCoreItemParts(),
		Promise.all([
			import("./items-part6").then(
				(m) => ["items/part-6", m.items_part6] as const,
			),
			import("./items-part7").then(
				(m) => ["items/part-7", m.items_part7] as const,
			),
			import("./items-part8").then(
				(m) => ["items/part-8", m.items_part8] as const,
			),
			import("./items-part9").then(
				(m) => ["items/part-9", m.items_part9] as const,
			),
			import("./items-gap-fill").then(
				(m) => ["items/gap-fill", m.items_gap_fill] as const,
			),
			import("./artifacts").then(
				(m) => ["items/artifact-membership", m.artifacts] as const,
			),
		]),
	]).then(([core, rest]) => [...core, ...rest]);

let coreResolutionPromise: Promise<LazyItemResolution> | null = null;
let allResolutionPromise: Promise<LazyItemResolution> | null = null;

export function loadCoreItemResolution(): Promise<LazyItemResolution> {
	if (!coreResolutionPromise) {
		coreResolutionPromise = loadCoreItemParts().then(reconcileItemParts);
	}
	return coreResolutionPromise;
}

export function loadAllItemResolution(): Promise<LazyItemResolution> {
	if (!allResolutionPromise) {
		allResolutionPromise = loadAllItemParts().then(reconcileItemParts);
	}
	return allResolutionPromise;
}

/** Mirrors the former core item view (base equipment plus parts 1–5). */
export const loadCoreItems = (): Promise<Item[]> =>
	loadCoreItemResolution().then((result) => result.items);

/** Mirrors the broad item view, including later shards, gap-fill, and artifacts. */
export const loadAllItems = (): Promise<Item[]> =>
	loadAllItemResolution().then((result) => result.items);
