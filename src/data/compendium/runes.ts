import type { CompendiumRune as RuneCompendiumEntry } from "@/types/compendium";

export type { RuneCompendiumEntry };

import { allRunes } from "./runes/index";

export const systemAscendantRunes: RuneCompendiumEntry[] = allRunes;
