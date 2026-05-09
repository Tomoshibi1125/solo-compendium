/**
 * Feature Description Parser
 *
 * Infers structured metadata (action_type, recharge, uses_formula) from
 * natural-language feature and trait descriptions in the compendium data.
 *
 * Static job features in jobs.ts only carry `{ name, description, level }`,
 * so this parser bridges the gap by detecting patterns like "Bonus action:",
 * "Once per short rest", "Prof bonus uses per long rest", etc.
 */

interface ParsedFeatureMetadata {
	/** The inferred action economy type. */
	action_type: "action" | "bonus-action" | "reaction" | "passive" | null;
	/** The inferred recharge period. */
	recharge: "short-rest" | "long-rest" | null;
	/** The inferred uses formula (e.g. "prof" for proficiency bonus uses). */
	uses_formula: string | null;
}

/**
 * Parse a feature description to extract action_type, recharge, and uses_formula.
 *
 * Detection order (first match wins for action_type):
 *   1. "Reaction:" / "as a reaction" → reaction
 *   2. "Bonus action:" / "as a bonus action" → bonus-action
 *   3. "1 action" / "Action:" / "as an action" → action
 *   4. Otherwise → passive
 *
 * Recharge:
 *   - "per short rest" / "short rest" (with uses context) → short-rest
 *   - "per long rest" / "long rest" (with uses context) → long-rest
 *
 * Uses formula:
 *   - "Prof bonus uses" / "proficiency bonus uses" → "prof"
 *   - "X mod uses" (ability mod) → ability abbreviation
 *   - "Once per" → inferred as 1 use
 *   - "Twice per" → inferred as 2 uses
 *   - "X/short rest" or "X/long rest" → numeric
 */
export function parseFeatureMetadata(
	description: string | null | undefined,
): ParsedFeatureMetadata {
	const result: ParsedFeatureMetadata = {
		action_type: null,
		recharge: null,
		uses_formula: null,
	};

	if (!description) return result;

	const lower = description.toLowerCase();

	// ── Action Type ──────────────────────────────────────────────────────
	if (
		lower.includes("reaction:") ||
		lower.includes("as a reaction") ||
		lower.includes("use your reaction") ||
		lower.includes("1 reaction")
	) {
		result.action_type = "reaction";
	} else if (
		lower.includes("bonus action:") ||
		lower.includes("bonus action,") ||
		lower.includes("as a bonus action") ||
		lower.includes("1 bonus action")
	) {
		result.action_type = "bonus-action";
	} else if (
		lower.includes("1 action") ||
		lower.includes("action:") ||
		lower.includes("as an action")
	) {
		result.action_type = "action";
	} else {
		result.action_type = "passive";
	}

	// ── Recharge ─────────────────────────────────────────────────────────
	if (
		lower.includes("per short rest") ||
		lower.includes("/short rest") ||
		lower.includes("once per short rest") ||
		lower.includes("twice per short rest") ||
		(lower.includes("short rest") && lower.includes("uses"))
	) {
		result.recharge = "short-rest";
	} else if (
		lower.includes("per long rest") ||
		lower.includes("/long rest") ||
		lower.includes("once per long rest") ||
		lower.includes("twice per long rest") ||
		(lower.includes("long rest") && lower.includes("uses"))
	) {
		result.recharge = "long-rest";
	}

	// ── Uses Formula ─────────────────────────────────────────────────────
	if (
		lower.includes("prof bonus uses") ||
		lower.includes("proficiency bonus uses") ||
		lower.includes("prof bonus times") ||
		lower.includes("proficiency bonus times")
	) {
		result.uses_formula = "prof";
	} else if (/\bagility\s+mod(?:ifier)?\s+uses\b/i.test(lower)) {
		result.uses_formula = "AGI_mod";
	} else if (/\bstrength\s+mod(?:ifier)?\s+uses\b/i.test(lower)) {
		result.uses_formula = "STR_mod";
	} else if (/\bvitality\s+mod(?:ifier)?\s+uses\b/i.test(lower)) {
		result.uses_formula = "VIT_mod";
	} else if (/\bintelligence\s+mod(?:ifier)?\s+uses\b/i.test(lower)) {
		result.uses_formula = "INT_mod";
	} else if (/\bsense\s+mod(?:ifier)?\s+uses\b/i.test(lower)) {
		result.uses_formula = "SENSE_mod";
	} else if (/\bpresence\s+mod(?:ifier)?\s+uses\b/i.test(lower)) {
		result.uses_formula = "PRE_mod";
	}

	return result;
}
