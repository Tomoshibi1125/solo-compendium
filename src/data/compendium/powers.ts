import type { CompendiumPower } from "../../types/compendium";
import { powers_archetype } from "./powers-archetype";
import { powers_core } from "./powers-core";
import { powers_supplemental } from "./powers-supplemental";

function normalizePowerMechanics(power: CompendiumPower): CompendiumPower {
	// Strip mechanics keys that mirror top-level fields. Each entry's own
	// `limitations` (per-rest charges, recharge) is the source of truth — the
	// per-character use count is resolved at runtime via the per-ability use
	// economy (see abilityUseEconomy.ts), which derives uses from the character's
	// primary ability + proficiency bonus. Job resources (Covenant/Infusion)
	// remain job-feature resources and are no longer injected as a per-ability
	// "Cost" line here.
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
		mechanics: nextMechanics as CompendiumPower["mechanics"],
	};
}

export const powers: CompendiumPower[] = [
	...powers_core,
	...powers_supplemental,
	...powers_archetype,
].map(normalizePowerMechanics);
