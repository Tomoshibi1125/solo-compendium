import type { CompendiumRune as RuneCompendiumEntry } from "@/types/compendium";
import { runes_power_powers } from "./power-powers";
import { runes_skill_skills } from "./skill-runes";
import { runes_a } from "./spell-rank-a";
import { runes_b } from "./spell-rank-b";
import { runes_c } from "./spell-rank-c";
import { runes_d } from "./spell-rank-d";
import { runes_s } from "./spell-rank-s";
import { runes_technique_techniques } from "./technique-techniques";
export const allRunes: RuneCompendiumEntry[] = [
	...runes_d,
	...runes_c,
	...runes_b,
	...runes_a,
	...runes_s,
	...runes_power_powers,
	...runes_technique_techniques,
	...runes_skill_skills
];;
