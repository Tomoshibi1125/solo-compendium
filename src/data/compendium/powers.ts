import type { CompendiumPower } from "../../types/compendium";
import { canonicalResourceCost } from "./abilityResourceCost";
import { powers_archetype } from "./powers-archetype";
import { powers_core } from "./powers-core";
import { powers_supplemental } from "./powers-supplemental";

function normalizePowerMechanics(power: CompendiumPower): CompendiumPower {
	// Strip mechanics keys that mirror top-level fields. Each entry's own
	// `limitations` (per-rest charges, recharge) is the source of truth — the
	// per-character use count is resolved at runtime via computePowerUses, which
	// parses 5e-style formula strings ("Proficiency bonus/short rest", etc.).
	const mechanics =
		power.mechanics && typeof power.mechanics === "object"
			? (power.mechanics as Record<string, unknown>)
			: null;

	// Job-exclusive entries spend that job's canon resource (e.g. a Holy-Knight-
	// only power costs Covenant; a Technomancer-only power costs Infusion).
	// Broadly-shared (multi-job) entries have no single canon resource and keep
	// their per-rest charge unchanged.
	const cost = canonicalResourceCost(power.classes, power.power_level);
	const withCost: CompendiumPower = cost
		? {
				...power,
				limitations: {
					...(power.limitations &&
					typeof power.limitations === "object" &&
					!Array.isArray(power.limitations)
						? power.limitations
						: {}),
					cost,
				},
			}
		: power;

	if (!mechanics) return withCost;

	const nextMechanics: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(mechanics)) {
		if (["duration", "range", "ability", "action", "action_type"].includes(key))
			continue;
		nextMechanics[key] = value;
	}

	return {
		...withCost,
		mechanics: nextMechanics as CompendiumPower["mechanics"],
	};
}

export const powers: CompendiumPower[] = [
	...powers_core,
	...powers_supplemental,
	...powers_archetype,
].map(normalizePowerMechanics);
