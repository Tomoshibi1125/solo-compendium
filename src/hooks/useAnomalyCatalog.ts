import { useQuery } from "@tanstack/react-query";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

export interface AnomalyCatalogEntry {
	id: string;
	name: string;
	hp: number;
	ac: number;
	speed: number;
	/** The authored rank; empty when the entry has none. */
	rank: string;
}

/** The canonical Anomaly catalog, keyed by species id. */
export function useAnomalyCatalog() {
	return useQuery({
		queryKey: ["anomaly-catalog"],
		staleTime: Number.POSITIVE_INFINITY,
		queryFn: async () => {
			const entries = await listCanonicalEntries("anomalies");
			const map = new Map<string, AnomalyCatalogEntry>();
			for (const entry of entries) {
				const record = entry as unknown as Record<string, unknown>;
				map.set(entry.id, {
					id: entry.id,
					name: entry.name,
					hp:
						Number(
							record.hit_points_average ?? record.hit_points ?? record.hp ?? 1,
						) || 1,
					ac: Number(record.armor_class ?? record.ac ?? 10) || 10,
					speed: Number(record.speed_walk ?? record.speed ?? 30) || 30,
					rank: String(record.gate_rank ?? record.rank ?? ""),
				});
			}
			return map;
		},
	});
}
