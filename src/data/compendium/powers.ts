import type { CompendiumPower } from "../../types/compendium";
import { powers_core } from "./powers-core";
import { powers_supplemental } from "./powers-supplemental";

function normalizePowerMechanics(power: CompendiumPower): CompendiumPower {
	const mechanics =
		power.mechanics && typeof power.mechanics === "object"
			? (power.mechanics as Record<string, unknown>)
			: null;
	if (!mechanics) return power;

	const nextMechanics: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(mechanics)) {
		if (["duration", "range", "ability", "action", "action_type"].includes(key))
			continue;
		nextMechanics[key] = value;
	}

	return {
		...power,
		mechanics: nextMechanics,
	};
}

export const powers: CompendiumPower[] = [
	...powers_core,
	...powers_supplemental,
].map(normalizePowerMechanics);
