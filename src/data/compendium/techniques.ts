import type { CompendiumTechnique } from "../../types/compendium";
import { techniques_core } from "./techniques-core";
import { techniques_supplemental } from "./techniques-supplemental";

function normalizeTechniqueMechanics(
	technique: CompendiumTechnique,
): CompendiumTechnique {
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
		mechanics: nextMechanics,
	};
}

export const techniques: CompendiumTechnique[] = [
	...techniques_core,
	...techniques_supplemental,
].map(normalizeTechniqueMechanics);
