import type { ChoiceSourceData, LedgerChoice } from "@/lib/choiceCalculations";
import type { Regent } from "@/lib/regentTypes";

/**
 * Regent leveled-feature normalization.
 *
 * Regents are Warden-unlocked class overlays that should be as mechanically
 * comprehensive as jobs — including a leveled `class_features` list spanning
 * levels 1-20 that every consumer (the level-up wizard's per-level regent
 * display, `RegentUnlocksPanel`, `canonicalRegentToPath`) can read.
 *
 * Some regents already carry a curated `class_features` set (Umbral, Frost,
 * Beast, Spatial, Blood, Gravity). Others (Radiant, Steel, Destruction, War,
 * and the truncated Plague / Mimic) keep the same content in the flatter
 * `abilities` + `features` arrays plus a full `progression_table` that maps each
 * level to the feature names it grants. This module joins those back together so
 * ALL regents expose a complete, level-indexed feature list without duplicating
 * content into the data file.
 */

export type RegentFeatureType =
	| "passive"
	| "active"
	| "action"
	| "bonus-action"
	| "reaction";

export type RegentFeatureFrequency =
	| "at-will"
	| "short-rest"
	| "long-rest"
	| "once-per-day"
	| "once-per-long-rest";

export interface RegentLeveledFeature {
	level: number;
	name: string;
	description: string;
	type: RegentFeatureType;
	frequency?: RegentFeatureFrequency;
}

// A curated set is treated as authoritative once it reaches the high tiers; the
// progression_table derivation is only used to fill regents that lack one.
const CURATED_AUTHORITATIVE_MIN_MAX_LEVEL = 15;

// Generic progression markers referenced by progression_table.features_gained
// that aren't defined as a named ability/feature. Given sensible descriptions so
// the level-up display never shows a bare name.
const GENERIC_MARKER_DESCRIPTIONS: Record<string, string> = {
	"regent attribute enhancement":
		"Your bond with the Regent deepens: increase one ability score by 2, or two ability scores by 1 (to a maximum of 20).",
	"regent power resonance":
		"The Regent's authority resonates more strongly through you — the save DCs and effect scaling of your Regent features rise with your attunement.",
};

function normalizeName(name: string): string {
	return name.trim().toLowerCase();
}

type LookupEntry = {
	description: string;
	type: RegentFeatureType;
	frequency?: RegentFeatureFrequency;
};

function buildNameLookup(regent: Regent): Map<string, LookupEntry> {
	const lookup = new Map<string, LookupEntry>();
	// Curated class_features first (richest source, carries an explicit type).
	for (const f of regent.class_features ?? []) {
		if (f?.name && f?.description) {
			lookup.set(normalizeName(f.name), {
				description: f.description,
				type: f.type ?? "passive",
				frequency: f.frequency,
			});
		}
	}
	// Named abilities carry an action economy type + frequency.
	for (const a of regent.abilities ?? []) {
		if (a?.name && a?.description && !lookup.has(normalizeName(a.name))) {
			lookup.set(normalizeName(a.name), {
				description: a.description,
				type: a.type ?? "passive",
				frequency:
					a.frequency === "once-per-day" ||
					a.frequency === "short-rest" ||
					a.frequency === "long-rest" ||
					a.frequency === "at-will"
						? a.frequency
						: undefined,
			});
		}
	}
	// Flat features are passive descriptors.
	for (const f of regent.features ?? []) {
		if (f?.name && f?.description && !lookup.has(normalizeName(f.name))) {
			lookup.set(normalizeName(f.name), {
				description: f.description,
				type: "passive",
			});
		}
	}
	return lookup;
}

function maxCuratedLevel(regent: Regent): number {
	const levels = (regent.class_features ?? []).map((f) => f.level);
	return levels.length ? Math.max(...levels) : 0;
}

function sortDedupe(features: RegentLeveledFeature[]): RegentLeveledFeature[] {
	const seen = new Set<string>();
	const out: RegentLeveledFeature[] = [];
	for (const f of features) {
		const key = `${f.level}:${normalizeName(f.name)}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(f);
	}
	return out.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

function deriveFromProgressionTable(regent: Regent): RegentLeveledFeature[] {
	const table = regent.progression_table;
	if (!table) return [];
	const lookup = buildNameLookup(regent);
	const theme = regent.theme ?? "Regent";
	const derived: RegentLeveledFeature[] = [];
	for (const [levelKey, entry] of Object.entries(table)) {
		const level = Number.parseInt(levelKey, 10);
		if (!Number.isFinite(level)) continue;
		for (const name of entry.features_gained ?? []) {
			const norm = normalizeName(name);
			const match = lookup.get(norm);
			const description =
				match?.description ??
				GENERIC_MARKER_DESCRIPTIONS[norm] ??
				`${name}. A manifestation of the ${theme} Regent's authority gained at this tier.`;
			derived.push({
				level,
				name,
				description,
				type: match?.type ?? "passive",
				frequency: match?.frequency,
			});
		}
	}
	return derived;
}

/**
 * Returns a complete, level-indexed feature list for a regent (spanning its full
 * progression, 1-20 where the source data supports it). Curated `class_features`
 * are authoritative once they reach the high tiers; otherwise the list is derived
 * from `progression_table` joined with `abilities`/`features`, with any curated
 * class_features overlaid (curated descriptions win by level+name).
 */
export function getRegentLeveledFeatures(
	regent: Regent,
): RegentLeveledFeature[] {
	const curated: RegentLeveledFeature[] = (regent.class_features ?? []).map(
		(f) => ({
			level: f.level,
			name: f.name,
			description: f.description,
			type: f.type ?? "passive",
			frequency: f.frequency,
		}),
	);

	if (maxCuratedLevel(regent) >= CURATED_AUTHORITATIVE_MIN_MAX_LEVEL) {
		return sortDedupe(curated);
	}

	// Derive full coverage, then overlay curated entries so their (level, name)
	// descriptions take precedence over the derived ones.
	const derived = deriveFromProgressionTable(regent);
	return sortDedupe([...curated, ...derived]);
}

/** Features a regent grants at exactly the given level. */
export function getRegentFeaturesAtLevel(
	regent: Regent,
	level: number,
): RegentLeveledFeature[] {
	return getRegentLeveledFeatures(regent).filter((f) => f.level === level);
}

/**
 * Adapt a regent into a {@link ChoiceSourceData} so the shared ledger engine
 * (`calculateTotalChoices` / `getLevelUpChoiceDeltas`) counts its full
 * independent progression — casters via `spellcasting.cantrips_known` /
 * `spells_known`, martials via `powersKnown` / `techniquesKnown`, plus any
 * `levelChoices`. The regent's spellcasting already uses snake_case keys that
 * match ChoiceSourceData directly.
 */
export function regentToChoiceSource(regent: Regent): ChoiceSourceData {
	return {
		name: regent.name,
		skill_choice_count: 0,
		cantrips_known: regent.spellcasting?.cantrips_known,
		spells_known: regent.spellcasting?.spells_known,
		powers_known: regent.powersKnown,
		techniques_known: regent.techniquesKnown,
		level_choices: regent.levelChoices as LedgerChoice[] | undefined,
	};
}
