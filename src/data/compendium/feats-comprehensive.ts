/**
 * Comprehensive Feats — Rebuilt with unique descriptions, mechanics, and lore.
 *
 * Organized into four tiers following 5e 2024 PHB feat structure, adapted to RA canon:
 *   Tier 1: Awakening Feats (level 1, no ASI) — 12 feats
 *   Tier 2: General Feats (level 4+, half-feats with +1 ASI) — 17 feats
 *   Tier 3: Fighting Style Feats (class feature) — 11 feats
 *   Tier 4: Zenith Boons (level 19+, capstone) — 7 feats
 *
 * Total: 47 unique feats, each with distinct mechanics, description, flavor,
 * and discovery lore. Zero boilerplate.
 */
import type { CompendiumFeat } from "../../types/compendium";
import { generalFeats } from "./feats-general";
import { awakeningFeats } from "./feats-generator";
import { fightingStyleFeats, zenithBoons } from "./feats-styles-boons";

export const comprehensiveFeats: CompendiumFeat[] = [
	...awakeningFeats,
	...generalFeats,
	...fightingStyleFeats,
	...zenithBoons,
];
