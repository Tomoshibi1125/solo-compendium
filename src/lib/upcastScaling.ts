/**
 * Upcast Damage Scaling
 *
 * D&D Beyond parity: when a leveled (non-cantrip) spell is cast at a
 * higher slot level than its base, its damage dice scale automatically.
 *
 * RA spell entries store the upcast rule as free-form English text in
 * `higher_levels` / `atHigherLevels`. This module parses the most common
 * patterns ("Each rank above D adds +1d10 cold damage", "increases by
 * 1d8 at rank B (2d10), rank A (3d10)") and returns an additive damage
 * formula like "+2d10" that can be appended to the base damage roll.
 *
 * Coverage matches DDB's "Consumes Spell Slot = Yes, Cast at level
 * blank → auto-upcast to expended slot level" pattern for the majority
 * of well-formed compendium entries. Spells whose text doesn't match a
 * known pattern simply pass through unchanged, identical to DDB
 * behavior for homebrew spells without structured scaling data.
 */

// ── Pattern matchers ────────────────────────────────────────────────

/**
 * Pattern A: "Each rank/slot/level above [base] adds +NdM [type]"
 * Examples:
 *   "Each rank above D adds +1d10 cold damage"
 *   "Each slot level above 3rd adds 1d6 damage"
 *   "For each slot level above 1st, the damage increases by 1d8"
 */
const PER_LEVEL_RE =
	/(?:each|for each|per)\s+(?:rank|slot|spell\s+slot)\s+(?:level\s+)?(?:above|over)\s+\S+?[\s,]+(?:the\s+damage\s+)?(?:adds?|increases?\s+by)\s+\+?(\d+)d(\d+)/i;

/**
 * Pattern B: "Adds +NdM per [unit] above [base]"
 */
const ADDS_PER_RE =
	/adds?\s+\+?(\d+)d(\d+)\s+\w*\s*(?:per|for each)\s+(?:rank|slot|spell\s+slot|level)\s+(?:above|over)/i;

/**
 * Pattern C: "damage increases by NdM at [levels...]"
 * Lower precision — only used when no per-level pattern matched.
 */
const INCREASES_AT_RE =
	/(?:damage\s+)?increases?\s+(?:by\s+)?\+?(\d+)d(\d+)\s+\w*\s*at\s+/i;

// ── Public API ──────────────────────────────────────────────────────

interface UpcastScalingResult {
	/** Additional damage formula, e.g. "+2d10". Empty string if no scaling. */
	additionalDamage: string;
	/** Number of slot levels above the base level the spell is being cast at. */
	upcastLevels: number;
	/** Whether the scaling rule was parsed from the higher_levels text. */
	parsed: boolean;
}

/**
 * Compute the additional damage dice when casting a leveled spell at a
 * slot above its base level. Returns an empty string when no scaling
 * applies or when the higher_levels text cannot be parsed.
 *
 * @param spellBaseLevel    The spell's base level (e.g. 3 for Fireball).
 * @param castAtLevel       The slot level being expended.
 * @param higherLevelsText  The spell's higher_levels description.
 *
 * Example:
 *   parseUpcastScaling(3, 5, "Each slot above 3rd adds +1d6 fire")
 *     → { additionalDamage: "+2d6", upcastLevels: 2, parsed: true }
 */
export function parseUpcastScaling(
	spellBaseLevel: number,
	castAtLevel: number,
	higherLevelsText: string | null | undefined,
): UpcastScalingResult {
	const upcastLevels = Math.max(0, castAtLevel - spellBaseLevel);
	if (upcastLevels === 0 || !higherLevelsText) {
		return { additionalDamage: "", upcastLevels, parsed: false };
	}

	const text = higherLevelsText.trim();

	// Try high-precision patterns first
	for (const re of [PER_LEVEL_RE, ADDS_PER_RE]) {
		const match = text.match(re);
		if (match) {
			const dicePerLevel = Number.parseInt(match[1] ?? "1", 10);
			const dieSize = Number.parseInt(match[2] ?? "0", 10);
			if (!dicePerLevel || !dieSize) continue;
			const totalDice = dicePerLevel * upcastLevels;
			return {
				additionalDamage: `+${totalDice}d${dieSize}`,
				upcastLevels,
				parsed: true,
			};
		}
	}

	// Lower-precision fallback (single-die step per slot)
	const stepMatch = text.match(INCREASES_AT_RE);
	if (stepMatch) {
		const dicePerLevel = Number.parseInt(stepMatch[1] ?? "1", 10);
		const dieSize = Number.parseInt(stepMatch[2] ?? "0", 10);
		if (dicePerLevel && dieSize) {
			const totalDice = dicePerLevel * upcastLevels;
			return {
				additionalDamage: `+${totalDice}d${dieSize}`,
				upcastLevels,
				parsed: true,
			};
		}
	}

	return { additionalDamage: "", upcastLevels, parsed: false };
}

/**
 * Append the upcast damage to a base damage formula.
 *
 * Example:
 *   applyUpcastToFormula("8d6", 3, 5, "Each slot above 3rd adds +1d6 fire")
 *     → "8d6+2d6"
 */
export function applyUpcastToFormula(
	baseDamageFormula: string | null | undefined,
	spellBaseLevel: number,
	castAtLevel: number,
	higherLevelsText: string | null | undefined,
): string {
	if (!baseDamageFormula) return baseDamageFormula ?? "";
	const result = parseUpcastScaling(
		spellBaseLevel,
		castAtLevel,
		higherLevelsText,
	);
	if (!result.additionalDamage) return baseDamageFormula;
	return `${baseDamageFormula}${result.additionalDamage}`;
}
