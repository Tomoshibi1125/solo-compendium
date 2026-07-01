import type { CompendiumTechnique } from "../../types/compendium";
import { techniques_archetype } from "./techniques-archetype";
import { techniques_core } from "./techniques-core";
import { techniques_supplemental } from "./techniques-supplemental";

function normalizeTechniqueMechanics(
	technique: CompendiumTechnique,
): CompendiumTechnique {
	// Strip mechanics keys that mirror top-level fields. Each entry's own
	// `limitations` + `uses_per_rest_formula` (per-rest charges, recharge) is the
	// source of truth — the per-character use count is resolved at runtime via the
	// per-ability use economy (see abilityUseEconomy.ts). Job resources
	// (Covenant/Infusion) remain job-feature resources and are no longer injected
	// as a per-ability "Cost" line here.
	const mechanics =
		technique.mechanics && typeof technique.mechanics === "object"
			? (technique.mechanics as Record<string, unknown>)
			: null;

	if (!mechanics) return technique;

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
		...technique,
		mechanics: nextMechanics as CompendiumTechnique["mechanics"],
	};
}

export const techniques: CompendiumTechnique[] = [
	...techniques_core,
	...techniques_supplemental,
	...techniques_archetype,
].map(normalizeTechniqueMechanics);
