import type { CompendiumRune as RuneCompendiumEntry } from "@/types/compendium";
import { runes_power_powers } from "./power-powers";
import { runes_a } from "./spell-rank-a";
import { runes_b } from "./spell-rank-b";
import { runes_c } from "./spell-rank-c";
import { spell_rank_d_runes } from "./spell-rank-d";
import { runes_s } from "./spell-rank-s";
import { technique_runes } from "./technique-techniques";

export const allRunes: RuneCompendiumEntry[] = [
	...spell_rank_d_runes,
	...runes_c,
	...runes_b,
	...runes_a,
	...runes_s,
	...runes_power_powers,
	...technique_runes,
];
