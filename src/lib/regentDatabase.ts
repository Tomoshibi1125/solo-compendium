// Complete Regent database for the Gemini Protocol fusion engine.
//
// The Sovereign fusion lookup (`aggregateGeminiFeatures`) resolves a saved
// sovereign's `monarch_a_id` / `monarch_b_id` against this list. Those ids are
// the CANONICAL compendium regent ids (e.g. "umbral_regent"), produced by
// `listCanonicalEntries("regents")` → `regents.ts`. The legacy `NINE_REGENTS`
// table used different ids ("shadow_regent", …), so AI/imported sovereigns
// referencing canonical regents could not be resolved and their fusion
// abilities were silently dropped.
//
// This module guarantees EVERY canonical regent is present in the database (by
// its canonical id), unioned with any legacy-only entries for backward compat.
// `regents.ts` is already in the character-sheet bundle (via regentGestalt), so
// this adds no new code-split cost.

import { regents as CANONICAL_REGENTS } from "@/data/compendium/regents";
import { NINE_REGENTS } from "@/lib/nineRegents";
import {
	type Feature,
	type Regent,
	type RegentPath,
	RegentType,
	type Spell,
} from "@/lib/regentTypes";

const ABILITY_TO_REGENT_TYPE: Record<string, RegentType> = {
	strength: RegentType.STRENGTH_REGENT,
	str: RegentType.STRENGTH_REGENT,
	agility: RegentType.AGILITY_REGENT,
	agi: RegentType.AGILITY_REGENT,
	vitality: RegentType.VITALITY_REGENT,
	vit: RegentType.VITALITY_REGENT,
	intelligence: RegentType.INTELLIGENCE_REGENT,
	int: RegentType.INTELLIGENCE_REGENT,
	sense: RegentType.SENSE_REGENT,
	presence: RegentType.PRESENCE_REGENT,
	pre: RegentType.PRESENCE_REGENT,
};

function inferRegentType(regent: Regent): RegentType {
	const first = (regent.primary_ability?.[0] ?? "").trim().toLowerCase();
	return ABILITY_TO_REGENT_TYPE[first] ?? RegentType.PRESENCE_REGENT;
}

function toFeatures(regent: Regent): Feature[] {
	const features: Feature[] = [];
	for (const f of regent.class_features ?? []) {
		if (f?.name && f?.description) {
			features.push({
				name: f.name,
				description: f.description,
				type: f.type ?? "passive",
			});
		}
	}
	for (const f of regent.features ?? []) {
		if (f?.name && f?.description) {
			features.push({
				name: f.name,
				description: f.description,
				type: "passive",
			});
		}
	}
	return features;
}

function toAbilityNames(regent: Regent): string[] {
	const names = new Set<string>();
	for (const a of regent.abilities ?? []) if (a?.name) names.add(a.name);
	for (const f of regent.class_features ?? []) if (f?.name) names.add(f.name);
	return [...names];
}

/** Map a canonical compendium {@link Regent} into the {@link RegentPath} shape. */
export function canonicalRegentToPath(regent: Regent): RegentPath {
	return {
		id: regent.id,
		name: regent.name,
		type: inferRegentType(regent),
		description: regent.description ?? "",
		abilities: toAbilityNames(regent),
		features: toFeatures(regent),
		spells: (regent.spellcasting?.additional_spells ?? []) as Spell[],
		compendiumId: regent.id,
		requirements: {
			statThreshold: regent.regent_requirements?.level ?? 0,
			questCompleted: regent.regent_requirements?.quest_completion,
		},
	};
}

/**
 * Every regent the fusion engine can encounter: all canonical regents (keyed by
 * canonical id, authoritative) plus any legacy nine-regent entries whose ids are
 * not already covered. Deduped by id with canonical entries taking precedence.
 */
export const ALL_REGENTS: RegentPath[] = (() => {
	const byId = new Map<string, RegentPath>();
	for (const regent of CANONICAL_REGENTS) {
		byId.set(regent.id, canonicalRegentToPath(regent));
	}
	for (const legacy of NINE_REGENTS) {
		if (!byId.has(legacy.id)) byId.set(legacy.id, legacy);
	}
	return [...byId.values()];
})();
