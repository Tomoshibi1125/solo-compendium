// Canon resource-cost derivation for job-EXCLUSIVE catalog abilities.
//
// Under the archetype model, a power/technique shared across several martial
// jobs has no single canon resource, so it keeps its 5e per-rest charge. But an
// entry locked to ONE job (classes === ["Holy Knight"] or ["Technomancer"])
// belongs to that job's resource economy and should spend it:
//   - Holy Knight  → Covenant   (Covenant Bond / Casting / Strike / Assault)
//   - Technomancer → Infusion   (Absolute Infusion / Infusion Optimization —
//                                 the Technomancer's canon spendable resource)
//
// The amount scales with the ability's level/tier so low-tier arts are cheap and
// capstones are expensive, mirroring the existing paths.ts resource-cost
// convention. Rendered as a "Cost" line by detailFormatters and surfaced
// wherever limitations.cost is shown.

const SINGLE_JOB_RESOURCE: Record<string, string> = {
	"holy knight": "Covenant",
	technomancer: "Infusion",
};

/** Tier the spend by ability level: 1–3 → 1, 4–6 → 2, 7–9 → 3. */
function resourceAmountForLevel(level: number | null | undefined): number {
	const lvl = typeof level === "number" && level > 0 ? level : 1;
	if (lvl >= 7) return 3;
	if (lvl >= 4) return 2;
	return 1;
}

/**
 * Returns a canon resource cost string (e.g. "2 Covenant", "3 Mandate-Flux")
 * for a job-exclusive ability, or null when the ability is shared across
 * multiple jobs / has no single-job canon resource (those keep per-rest).
 */
export function canonicalResourceCost(
	classes: string[] | null | undefined,
	level: number | null | undefined,
): string | null {
	if (!Array.isArray(classes) || classes.length !== 1) return null;
	const resource = SINGLE_JOB_RESOURCE[classes[0].trim().toLowerCase()];
	if (!resource) return null;
	return `${resourceAmountForLevel(level)} ${resource}`;
}
