/**
 * Feature Effects — Structured Schema (P1.9 hybrid migration)
 *
 * Discriminated union describing the mechanical impact of features,
 * feats, awakening upgrades, job traits, regents, and gemini fusions.
 * Replaces (over time) the regex-based parser in `characterEngine.ts`.
 *
 * Hybrid strategy:
 *  - New content authors structured effects directly.
 *  - Legacy content (where `effects` is undefined) falls back to the
 *    regex parser in `aggregateAwakeningFeatures` / `aggregateJobTraits`.
 *  - Backfill is opportunistic — start with feats whose modifiers
 *    touch HP, AC, proficiency, or passives. Narrative features that
 *    only affect roleplay can stay text-only.
 *
 * Consumer: `unifiedEffectSystem.ts` (priority-bucketed aggregator).
 * Each FeatureEffect is converted to a UnifiedEffectEntry there, so
 * stacking rules (same-type non-stacking, penalties always stack)
 * apply uniformly.
 */

import type { AbilityScore } from "@/types/core-rules";

// ── Discriminated union ────────────────────────────────────────────

/**
 * The kind of mechanical impact a feature has. Each kind narrows the
 * remaining shape via TypeScript discriminated-union semantics.
 */
export type FeatureEffectKind =
	| "ability_score"
	| "hp_per_level"
	| "hp_flat"
	| "speed_bonus"
	| "ac_formula"
	| "ac_bonus"
	| "proficiency"
	| "expertise"
	| "resistance"
	| "advantage"
	| "passive_bonus"
	| "resource_grant"
	| "spell_grant"
	| "save_proficiency"
	| "initiative_bonus"
	| "attack_bonus"
	| "damage_bonus";

export type ProficiencyKind =
	| "skill"
	| "save"
	| "tool"
	| "weapon"
	| "armor"
	| "language";

export type RollKind = "attack" | "check" | "save";
export type RechargeKind = "short" | "long" | "day" | "encounter";

export type FeatureEffect =
	| { kind: "ability_score"; target: AbilityScore; value: number }
	| { kind: "hp_per_level"; value: number }
	| { kind: "hp_flat"; value: number }
	| { kind: "speed_bonus"; value: number }
	| { kind: "ac_formula"; formulaId: string }
	| { kind: "ac_bonus"; value: number }
	| {
			kind: "proficiency";
			proficiencyType: ProficiencyKind;
			target: string;
	  }
	| { kind: "expertise"; skill: string }
	| { kind: "resistance"; damageType: string }
	| { kind: "advantage"; rollType: RollKind; condition?: string }
	| {
			kind: "passive_bonus";
			passive: "perception" | "insight" | "investigation" | "stealth";
			value: number;
	  }
	| {
			kind: "resource_grant";
			resource: string;
			uses: number;
			recovery: RechargeKind;
	  }
	| { kind: "spell_grant"; spellId: string; alwaysPrepared?: boolean }
	| { kind: "save_proficiency"; ability: AbilityScore }
	| { kind: "initiative_bonus"; value: number }
	| { kind: "attack_bonus"; value: number; weaponType?: string }
	| { kind: "damage_bonus"; value: number; damageType?: string };

// ── Common feat presets (P1.9 seed set) ─────────────────────────────

/**
 * Canonical structured effects for the most common SRD feats.
 * Use these as seed data when backfilling legacy text-only feats.
 */
export const FEAT_EFFECT_PRESETS: Record<string, FeatureEffect[]> = {
	Tough: [{ kind: "hp_per_level", value: 2 }],
	Resilient_STR: [{ kind: "save_proficiency", ability: "STR" }],
	Resilient_AGI: [{ kind: "save_proficiency", ability: "AGI" }],
	Resilient_VIT: [{ kind: "save_proficiency", ability: "VIT" }],
	Resilient_INT: [{ kind: "save_proficiency", ability: "INT" }],
	Resilient_SENSE: [{ kind: "save_proficiency", ability: "SENSE" }],
	Resilient_PRE: [{ kind: "save_proficiency", ability: "PRE" }],
	Lucky: [
		{ kind: "resource_grant", resource: "lucky", uses: 3, recovery: "long" },
	],
	Alert: [{ kind: "initiative_bonus", value: 5 }],
	Observant: [
		{ kind: "passive_bonus", passive: "perception", value: 5 },
		{ kind: "passive_bonus", passive: "investigation", value: 5 },
	],
	Mobile: [{ kind: "speed_bonus", value: 10 }],
	"Heavy Armor Master": [
		// Damage reduction applies via resistance subset; the AC bonus per
		// the SRD adds +1 STR up to 20 — those are encoded by the caller's
		// ASI choice + a resistance-style hook here.
		{ kind: "ability_score", target: "STR", value: 1 },
	],
	"Athletic Adept": [
		{ kind: "ability_score", target: "STR", value: 1 },
		{ kind: "proficiency", proficiencyType: "skill", target: "Athletics" },
	],
	"Skilled Practitioner": [
		{ kind: "proficiency", proficiencyType: "skill", target: "Investigation" },
		{ kind: "proficiency", proficiencyType: "skill", target: "Perception" },
		{ kind: "proficiency", proficiencyType: "skill", target: "Insight" },
	],
};

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Type predicate for use in pipelines.
 */
export function isFeatureEffect(value: unknown): value is FeatureEffect {
	if (!value || typeof value !== "object") return false;
	const kind = (value as { kind?: unknown }).kind;
	if (typeof kind !== "string") return false;
	const known: FeatureEffectKind[] = [
		"ability_score",
		"hp_per_level",
		"hp_flat",
		"speed_bonus",
		"ac_formula",
		"ac_bonus",
		"proficiency",
		"expertise",
		"resistance",
		"advantage",
		"passive_bonus",
		"resource_grant",
		"spell_grant",
		"save_proficiency",
		"initiative_bonus",
		"attack_bonus",
		"damage_bonus",
	];
	return known.includes(kind as FeatureEffectKind);
}

/**
 * Compute the additive HP-per-level contribution from a list of
 * structured effects. Consumed by `calculateHPMax` so that Tough's
 * +2 HP/level (and any homebrew equivalent) bakes into the displayed
 * max HP automatically.
 */
export function sumHpPerLevel(
	effects: FeatureEffect[] | null | undefined,
): number {
	if (!effects) return 0;
	let total = 0;
	for (const e of effects) {
		if (e.kind === "hp_per_level") total += e.value;
	}
	return total;
}

/**
 * Compute the additive HP-flat contribution from a list of structured
 * effects (one-time bumps like Dwarven Toughness analogues).
 */
export function sumHpFlat(effects: FeatureEffect[] | null | undefined): number {
	if (!effects) return 0;
	let total = 0;
	for (const e of effects) {
		if (e.kind === "hp_flat") total += e.value;
	}
	return total;
}
