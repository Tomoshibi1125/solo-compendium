// Canonical Regent projections used by the Gemini/Sovereign runtime.
//
// NINE_REGENTS is retained as historical evidence only. Runtime identity and
// projections are locked to the twelve canonical compendium Regents.

import { regents as CANONICAL_REGENTS } from "@/data/compendium/regents";
import {
	CANONICAL_REGENT_IDS,
	resolveCanonicalRegentId,
} from "@/lib/regentIdentity";
import { getRegentLeveledFeatures } from "@/lib/regentProgression";
import {
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

function getStatThreshold(regent: Regent): number {
	const thresholds = Object.values(
		regent.regent_requirements?.abilities ?? {},
	).filter((value): value is number => Number.isFinite(value));
	return thresholds.length > 0 ? Math.max(...thresholds) : 0;
}

/** Map one canonical compendium Regent into the legacy RegentPath shape. */
export function canonicalRegentToPath(regent: Regent): RegentPath {
	const canonicalId = resolveCanonicalRegentId(regent.id);
	if (!canonicalId) {
		throw new Error(`Unsupported Regent projection ID: ${regent.id}`);
	}
	const canonicalRegent =
		regent.id === canonicalId ? regent : { ...regent, id: canonicalId };
	// Task 7 already materialized this ledger at the data boundary. Read it once
	// and project that same array; do not re-append raw abilities/features.
	const ledger = getRegentLeveledFeatures(canonicalRegent);

	return {
		id: canonicalId,
		name: canonicalRegent.name,
		type: inferRegentType(canonicalRegent),
		description: canonicalRegent.description ?? "",
		abilities: ledger.map((feature) => feature.name),
		features: ledger,
		spells: (canonicalRegent.spellcasting?.additional_spells ?? []) as Spell[],
		compendiumId: canonicalId,
		requirements: {
			statThreshold: getStatThreshold(canonicalRegent),
			questCompleted: canonicalRegent.regent_requirements?.quest_completion,
		},
	};
}

const CANONICAL_BY_ID = new Map(
	CANONICAL_REGENTS.map((regent) => [regent.id, regent] as const),
);

/** Exactly the twelve locked canonical projections, in canonical identity order. */
export const ALL_REGENTS: RegentPath[] = CANONICAL_REGENT_IDS.map((id) => {
	const regent = CANONICAL_BY_ID.get(id);
	if (!regent) throw new Error(`Missing canonical Regent data for ${id}`);
	return canonicalRegentToPath(regent);
});
