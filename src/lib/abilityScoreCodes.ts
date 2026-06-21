/**
 * Canonical `ability_score` enum normalization.
 *
 * The `characters.saving_throw_proficiencies` column (and other ability-typed
 * columns) is a Postgres `ability_score[]` enum that only accepts the codes
 * STR/AGI/VIT/INT/SENSE/PRE. Static/DB job data frequently expresses abilities
 * as display names ("Strength", "Vitality"), so persisting those raw values
 * fails with `22P02 invalid input value for enum ability_score: "Strength"`.
 *
 * Centralizing the name->code coercion here keeps every character create/update
 * path consistent and prevents that mismatch from recurring per call site.
 */
import { ABILITY_DISPLAY_NAMES, type AbilityScore } from "@/lib/5eRulesEngine";

// "strength" -> "STR", "str" -> "STR", "sense" -> "SENSE", etc. Built from the
// canonical display-name table so it stays in sync with the AbilityScore set.
const ABILITY_CODE_BY_NAME: Record<string, AbilityScore> = (() => {
	const map: Record<string, AbilityScore> = {};
	for (const [code, name] of Object.entries(ABILITY_DISPLAY_NAMES)) {
		map[name.toLowerCase()] = code as AbilityScore;
		map[code.toLowerCase()] = code as AbilityScore;
	}
	return map;
})();

/**
 * Normalize a single ability name or code to its canonical `ability_score`
 * enum code, or `null` when the value is not a recognized ability.
 */
function normalizeAbilityScoreCode(
	value: string | null | undefined,
): AbilityScore | null {
	if (!value) return null;
	return ABILITY_CODE_BY_NAME[value.trim().toLowerCase()] ?? null;
}

/**
 * Coerce one or more arrays of ability names/codes into a deduped list of
 * canonical `ability_score` enum codes, dropping any unrecognized entries.
 * Safe to persist into a Postgres `ability_score[]` column.
 */
export function toAbilityScoreCodes(...sources: unknown[]): AbilityScore[] {
	const seen = new Set<AbilityScore>();
	for (const source of sources) {
		if (!Array.isArray(source)) continue;
		for (const raw of source as unknown[]) {
			const code = normalizeAbilityScoreCode(
				typeof raw === "string" ? raw : String(raw),
			);
			if (code) seen.add(code);
		}
	}
	return [...seen];
}
