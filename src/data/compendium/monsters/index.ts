import type { CompendiumMonster } from "@/types/compendium";
import { monsters_a } from "./rank-a";
import { monsters_b } from "./rank-b";
import { monsters_c } from "./rank-c";
import { monsters_d } from "./rank-d";
import { monsters_s } from "./rank-s";

export const monsters: CompendiumMonster[] = [
	...monsters_s,
	...monsters_c,
	...monsters_b,
	...monsters_a,
	...monsters_d,
];
