/**
 * useCanonicalEquipmentMap — Look up canonical compendium data for a
 * character's equipment rows by name.
 *
 * The character_equipment table stores user-edited copies of items; structured
 * fields like `armor_class`, `damage`, `damage_type` aren't always preserved
 * on the row. This hook produces a Map<lowercase_name, StaticCompendiumEntry>
 * scoped to the character's current campaign sourcebook access, so consumers
 * (useCombatActions, useCharacterDerivedStats, EquipmentItem) can read
 * authoritative canonical fields without regex-parsing description text.
 *
 * The query is cached in TanStack so multiple consumers share a single fetch.
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { StaticCompendiumEntry } from "@/data/compendium/providers/types";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";

export type CanonicalEquipmentMap = Map<string, StaticCompendiumEntry>;

/**
 * Build a name-keyed lookup of canonical equipment + item entries the
 * character can access. Names are normalized to lowercase + trimmed so
 * matching is case-insensitive.
 */
export function useCanonicalEquipmentMap(characterId: string | undefined): {
	map: CanonicalEquipmentMap;
	isLoading: boolean;
} {
	const { data: entries = [], isLoading } = useQuery({
		queryKey: ["canonical-equipment-map", characterId ?? "guest"],
		queryFn: async (): Promise<StaticCompendiumEntry[]> => {
			const campaignId = characterId
				? await getCharacterCampaignId(characterId)
				: null;
			// Pull both equipment-shape and items-shape entries — item_type can
			// vary (weapon/armor/relic/consumable/gear) and consumers care about
			// canonical fields regardless of the bucket.
			const [equipment, items] = await Promise.all([
				listCanonicalEntries("equipment", undefined, { campaignId }),
				listCanonicalEntries("items", undefined, { campaignId }),
			]);
			return [...equipment, ...items];
		},
		// Canonical data is effectively static — cache aggressively.
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
	});

	const map = useMemo(() => {
		const result: CanonicalEquipmentMap = new Map();
		for (const entry of entries) {
			const key = entry.name?.trim().toLowerCase();
			if (!key) continue;
			// Prefer the first match; both equipment and items buckets may
			// surface the same canonical row in edge cases.
			if (!result.has(key)) result.set(key, entry);
		}
		return result;
	}, [entries]);

	return { map, isLoading };
}

/**
 * Resolve a single equipment row's canonical entry by name. Returns null when
 * no canonical match exists (homebrew or freeform items).
 */
export function findCanonicalForRow(
	map: CanonicalEquipmentMap,
	rowName: string | null | undefined,
): StaticCompendiumEntry | null {
	if (!rowName) return null;
	return map.get(rowName.trim().toLowerCase()) ?? null;
}
