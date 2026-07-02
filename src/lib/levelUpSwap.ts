/**
 * Level-up retraining (DDB parity): when a KNOWN-repertoire job gains a
 * level, it may swap one known entry for another it could legally learn —
 * the 5e "spell swap" for known casters (sorcerer/bard/ranger analogs) and
 * the Battle-Master-style maneuver swap for technique repertoires.
 *
 * Prepared casters never need this (they re-prepare after each rest), and
 * cantrips are excluded per the 5e rule.
 */

import { getSpellsKnownLimit } from "@/lib/5eCharacterCalculations";
import {
	getJobPowerMode,
	getJobTechniqueMode,
	jobCanLearnTechniques,
} from "@/lib/jobAbilityAccess";

export type SwapKind = "spell" | "power" | "technique";

export interface SwapKindOption {
	kind: SwapKind;
	label: string;
}

/**
 * Which ability kinds this job may retrain on level-up. Spells follow the
 * known-caster split (Esper/Contractor/Idol/Stalker), powers/techniques
 * follow their access-mode maps ("known" repertoires only).
 */
export function getSwappableKinds(
	job: string | null | undefined,
	newLevel: number,
): SwapKindOption[] {
	if (!job) return [];
	const kinds: SwapKindOption[] = [];
	const knownLimit = getSpellsKnownLimit(job, newLevel);
	if (knownLimit !== null && knownLimit > 0) {
		kinds.push({ kind: "spell", label: "Spell" });
	}
	if (getJobPowerMode(job) === "known") {
		kinds.push({ kind: "power", label: "Power" });
	}
	if (getJobTechniqueMode(job) === "known" && jobCanLearnTechniques(job)) {
		kinds.push({ kind: "technique", label: "Technique" });
	}
	return kinds;
}
