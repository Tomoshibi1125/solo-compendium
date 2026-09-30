import type { CompendiumAnomaly } from "@/types/compendium";
import { anomalies_a } from "./rank-a";
import { anomalies_b } from "./rank-b";
import { anomalies_c } from "./rank-c";
import { anomalies_d } from "./rank-d";
import { anomalies_s } from "./rank-s";

const catalog = [
	...anomalies_s,
	...anomalies_c,
	...anomalies_b,
	...anomalies_a,
	...anomalies_d,
] as unknown as CompendiumAnomaly[];

/** Species facts come from the authored stat block; absent ecology stays unknown. */
export const anomalies: CompendiumAnomaly[] = catalog.map((entry) => ({
	...entry,
	species: entry.species ?? {
		name: entry.name,
		classification: entry.type || null,
	},
	biology: entry.biology ?? {
		size: entry.size ?? null,
		creatureType: entry.type || null,
		senses: entry.senses ?? null,
		landSpeed:
			typeof entry.speed === "number"
				? entry.speed
				: (entry.stats?.speed ?? null),
	},
	ecology: entry.ecology ?? {
		habitats: entry.environment ?? [],
		organization: entry.organization ?? null,
	},
}));
