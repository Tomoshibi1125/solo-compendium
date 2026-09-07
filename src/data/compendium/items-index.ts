import { artifacts as artifactItems } from "./artifacts";
import { type Item, retainCoherentItemCompatibilityCandidates } from "./items";
import { baseEquipment } from "./items-base-equipment";
import { items_gap_fill as itemsGapFill } from "./items-gap-fill";
import { items_part1 as itemsPart1 } from "./items-part1";
import { items_part2 as itemsPart2 } from "./items-part2";
import { items_part3 as itemsPart3 } from "./items-part3";
import { items_part4 as itemsPart4 } from "./items-part4";
import { items_part5 as itemsPart5 } from "./items-part5";
import { items_part6 as itemsPart6 } from "./items-part6";
import { items_part7 as itemsPart7 } from "./items-part7";
import { items_part8 as itemsPart8 } from "./items-part8";
import { items_part9 as itemsPart9 } from "./items-part9";
import {
	type CanonicalEntryRecord,
	type CompendiumCandidate,
	createCompendiumCandidate,
	createCompletenessFirstNameView,
	getRegisteredSource,
	mergeCanonicalCandidates,
} from "./registry";

const itemSourceParts = [
	["items/base-equipment", baseEquipment],
	["items/part-1", itemsPart1],
	["items/part-2", itemsPart2],
	["items/part-3", itemsPart3],
	["items/part-4", itemsPart4],
	["items/part-5", itemsPart5],
	["items/part-6", itemsPart6],
	["items/part-7", itemsPart7],
	["items/part-8", itemsPart8],
	["items/part-9", itemsPart9],
	["items/gap-fill", itemsGapFill],
	["items/artifact-membership", artifactItems],
] as const;

/**
 * Every raw item candidate with source lineage intact. Unlike the former Map
 * assembly, this export never discards an earlier or later source claim.
 */
export const allItemCandidates: CompendiumCandidate[] = itemSourceParts.flatMap(
	([sourceId, items], sourceIndex) => {
		const source = getRegisteredSource(sourceId);
		if (!source) throw new Error(`Unregistered item source: ${sourceId}`);
		return (items as readonly Item[]).map((item, ordinal) =>
			createCompendiumCandidate(
				"items",
				source,
				item as unknown as CanonicalEntryRecord,
				ordinal,
				sourceIndex * 1_000_000 + ordinal,
			),
		);
	},
);

/** Field provenance and blocking identity conflicts for the static item view. */
export const itemRegistryResolution = mergeCanonicalCandidates(
	"items",
	allItemCandidates,
);
export const itemMergeConflicts = itemRegistryResolution.conflicts;

/**
 * Compatibility list used by synchronous Node/book consumers. Distinct-id
 * variants are never mechanically hybridized; the most complete coherent
 * candidate is selected while the id-based conflicts remain blocking above.
 */
export const allItems = createCompletenessFirstNameView(
	retainCoherentItemCompatibilityCandidates(
		itemRegistryResolution.entries.map(
			(entry) => entry.value as unknown as Item,
		),
	) as unknown as CanonicalEntryRecord[],
) as unknown as Item[];
