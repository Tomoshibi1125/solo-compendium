import type { CompendiumTechnique } from "../../types/compendium";
import { canonicalResourceCost } from "./abilityResourceCost";
import { techniques_archetype } from "./techniques-archetype";
import { techniques_core } from "./techniques-core";
import { techniques_supplemental } from "./techniques-supplemental";

function normalizeTechniqueMechanics(
	technique: CompendiumTechnique,
): CompendiumTechnique {
	// Strip mechanics keys that mirror top-level fields. Each entry's own
	// `limitations` + `uses_per_rest_formula` (per-rest charges, recharge) is the
	// source of truth — the per-character use count is resolved at runtime via
	// computeTechniqueUses, which parses 5e-style formula strings.
	const mechanics =
		technique.mechanics && typeof technique.mechanics === "object"
			? (technique.mechanics as Record<string, unknown>)
			: null;

	// Job-exclusive techniques spend that job's canon resource (Holy Knight →
	// Covenant, Technomancer → Infusion). Shared (multi-job) techniques keep
	// their per-rest charge.
	const cost = canonicalResourceCost(
		technique.classes,
		technique.level_requirement,
	);
	const withCost: CompendiumTechnique = cost
		? {
				...technique,
				limitations: {
					...(technique.limitations &&
					typeof technique.limitations === "object" &&
					!Array.isArray(technique.limitations)
						? technique.limitations
						: {}),
					cost,
				},
			}
		: technique;

	if (!mechanics) return withCost;

	const nextMechanics: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(mechanics)) {
		if (
			[
				"duration",
				"range",
				"type",
				"action",
				"action_type",
				"frequency",
			].includes(key)
		)
			continue;
		nextMechanics[key] = value;
	}

	return {
		...withCost,
		mechanics: nextMechanics as CompendiumTechnique["mechanics"],
	};
}

export const techniques: CompendiumTechnique[] = [
	...techniques_core,
	...techniques_supplemental,
	...techniques_archetype,
].map(normalizeTechniqueMechanics);
