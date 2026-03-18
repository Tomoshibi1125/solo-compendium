import type { CompendiumSpell } from "@/types/compendium";
import { spells_a } from "./rank-a";
import { spells_b } from "./rank-b";
import { spells_c } from "./rank-c";
import { spells_d } from "./rank-d";
import { spells_s } from "./rank-s";

export const spells: CompendiumSpell[] = [
	...spells_d,
	...spells_c,
	...spells_b,
	...spells_a,
	...spells_s,
];
