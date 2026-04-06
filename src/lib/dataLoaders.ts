/**
 * AUTHORITATIVE DATA LOADERS
 * Centralized dynamic import hub to resolve mixed-import build warnings.
 */

import type { Json, Tables } from "@/integrations/supabase/types";
import type { StaticBackground, StaticJob } from "@/types/character";
import type {
	CompendiumAnomaly,
	CompendiumBackground,
	CompendiumCondition,
	CompendiumFeat,
	CompendiumItem,
	CompendiumLocation,
	CompendiumPath,
	CompendiumRegent,
	CompendiumRelic,
	CompendiumRune,
	CompendiumSkill,
	CompendiumSpell,
	CompendiumTattoo,
	CompendiumTechnique,
} from "@/types/compendium";

type Regent = Tables<"compendium_regents">;

export const loadJobs = (): Promise<StaticJob[]> =>
	import("@/data/compendium/jobs").then((m) => m.jobs);
export const loadItems = (): Promise<CompendiumItem[]> =>
	import("@/data/compendium/items").then((m) => m.items as CompendiumItem[]);
export const loadBackgrounds = (): Promise<StaticBackground[]> =>
	import("@/data/compendium/backgrounds").then((m) => m.backgrounds);
export const loadAnomalies = (): Promise<CompendiumAnomaly[]> =>
	import("@/data/compendium/anomalies").then((m) => m.anomalies);
export const loadSpells = (): Promise<CompendiumSpell[]> =>
	import("@/data/compendium/spells").then((m) => m.spells);
export const loadRuneCompendium = (): Promise<CompendiumRune[]> =>
	import("@/data/compendium/runes/index").then((m) => m.allRunes);

// SourceBook specific / Comprehensive loaders
export const loadConditions = (): Promise<CompendiumCondition[]> =>
	import("@/data/compendium/conditions").then((m) => m.conditions);
export const loadFeats = (): Promise<CompendiumFeat[]> =>
	import("@/data/compendium/feats-comprehensive").then(
		(m) => m.comprehensiveFeats as CompendiumFeat[],
	);
export const loadLocations = (): Promise<CompendiumLocation[]> =>
	import("@/data/compendium/locations").then((m) => m.locations);
export const loadRegents = (): Promise<CompendiumRegent[]> =>
	import("@/data/compendium/regents").then((m) => {
		const raw = m.regents as (CompendiumRegent | Regent)[];
		return raw.map((r): CompendiumRegent => {
			if ("progression_table" in r && r.progression_table) {
				const formalTable: Record<
					string,
					{ features_gained: string[]; abilities_improved: string[] }
				> = {};
				const entries = Object.entries(
					r.progression_table as Record<string, Json>,
				);
				for (const [level, val] of entries) {
					const data = val as {
						features_gained?: string[];
						abilities_improved?: string[];
					};
					formalTable[String(level)] = {
						features_gained: data.features_gained || [],
						abilities_improved: data.abilities_improved || [],
					};
				}
				return { ...r, progression_table: formalTable } as CompendiumRegent;
			}
			return r as CompendiumRegent;
		});
	});
export const loadRelics = (): Promise<CompendiumRelic[]> =>
	import("@/data/compendium/relics-comprehensive").then(
		(m) => m.comprehensiveRelics,
	);
export const loadSigils = (): Promise<CompendiumRune[]> =>
	import("@/data/compendium/sigils").then((m) => m.sigils as CompendiumRune[]);
export const loadSkills = (): Promise<CompendiumSkill[]> =>
	import("@/data/compendium/skills-comprehensive").then(
		(m) => m.comprehensiveSkills,
	);
export const loadTattoos = (): Promise<CompendiumTattoo[]> =>
	import("@/data/compendium/tattoos").then(
		(m) => m.tattoos as CompendiumTattoo[],
	);
export const loadTechniques = (): Promise<CompendiumTechnique[]> =>
	import("@/data/compendium/techniques").then((m) => m.techniques);
export const loadBackgroundsAll = (): Promise<CompendiumBackground[]> =>
	import("@/data/compendium/backgrounds-index").then((m) => m.allBackgrounds);
export const loadItemsAll = (): Promise<CompendiumItem[]> =>
	import("@/data/compendium/items-index").then(
		(m) => m.allItems as CompendiumItem[],
	);
export const loadPaths = (): Promise<CompendiumPath[]> =>
	import("@/data/compendium/paths").then((m) => m.paths);
