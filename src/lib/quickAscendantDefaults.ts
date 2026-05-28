/**
 * Quick Ascendant smart-default helpers (F1 of May 2026 remediation plan).
 *
 * Pure functions — no React, no router, no DB. Lives separately from
 * `QuickAscendantWizard.tsx` so tests can import without dragging the UI
 * graph in. The wizard imports `placeStandardArray` from here.
 */
import type { AbilityScore } from "@/types/core-rules";

// Standard array values — DDB Quickbuilder uses the same baseline.
export const STANDARD_ARRAY: ReadonlyArray<number> = [15, 14, 13, 12, 10, 8];

export const ALL_ABILITIES_CANONICAL_ORDER: ReadonlyArray<AbilityScore> = [
	"STR",
	"AGI",
	"VIT",
	"INT",
	"SENSE",
	"PRE",
];

/**
 * Place the standard array onto abilities, prioritizing the Job's
 * primary ability first, then VIT (drives HP at level 1), then the rest
 * in canonical declared order.
 */
export function placeStandardArray(
	primary: AbilityScore | null,
): Record<AbilityScore, number> {
	const declared = [...ALL_ABILITIES_CANONICAL_ORDER];
	const ordered: AbilityScore[] = [];
	if (primary && declared.includes(primary)) {
		ordered.push(primary);
	}
	if (declared.includes("VIT") && !ordered.includes("VIT")) {
		ordered.push("VIT");
	}
	for (const a of declared) {
		if (!ordered.includes(a)) ordered.push(a);
	}
	const result: Partial<Record<AbilityScore, number>> = {};
	ordered.forEach((ability, idx) => {
		result[ability] = STANDARD_ARRAY[idx] ?? 10;
	});
	return result as Record<AbilityScore, number>;
}
