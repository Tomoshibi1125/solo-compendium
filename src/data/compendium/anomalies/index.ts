import type { CompendiumAnomaly } from "@/types/compendium";
import { anomalies_a } from "./rank-a";
import { anomalies_b } from "./rank-b";
import { anomalies_c } from "./rank-c";
import { anomalies_d } from "./rank-d";
import { anomalies_s } from "./rank-s";

export const anomalies = [
	...anomalies_s,
	...anomalies_c,
	...anomalies_b,
	...anomalies_a,
	...anomalies_d,
] as unknown as CompendiumAnomaly[];
