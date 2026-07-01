// Per-ability "X per rest" use economy (5e SRD 5.1 alignment).
//
// SRD rule: only cantrip-level (power_level 0) abilities are cast at will.
// Everything above cantrip level is a limited resource. Casters keep spell slots
// (unchanged); at-will martial jobs — which have no spell slots — instead track
// each leveled power/technique per-ability: uses_max = primary-ability modifier
// + proficiency bonus, recharging on a short rest (low tiers) or long rest (high
// tiers).
//
// This complements perRestCharges.ts (which parses per-entry authored formulas):
// here we derive the *uniform* grant persisted onto character_powers /
// character_techniques rows at seed/level-up time, which restSystem.ts then
// recharges by rest type.

import { getJobPrimaryAbility } from "@/lib/5eCharacterCalculations";
import {
	type AbilityScore,
	getAbilityModifier,
	getProficiencyBonus,
} from "@/lib/5eRulesEngine";
import type { ResourceRecharge } from "@/lib/characterResources";
import { getJobPowerMode } from "@/lib/jobAbilityAccess";

export type AbilityUseKind = "power" | "technique";

/** Powers of tier 1–3 recharge on a short rest; tier 4+ on a long rest. */
export const POWER_SHORT_REST_MAX_TIER = 3;
/** Techniques (no 0–9 tier) tier by unlock level: ≤6 short rest, >6 long rest. */
export const TECHNIQUE_SHORT_REST_MAX_LEVEL = 6;

export interface AbilityUseGrantInput {
	kind: AbilityUseKind;
	job: string | null | undefined;
	/** Character level (drives proficiency bonus). */
	level: number;
	abilities: Partial<Record<AbilityScore, number>> | null | undefined;
	/** Power tier 0–9 (`power_level`). 0 = cantrip. Ignored for techniques. */
	powerLevel?: number | null;
	/** Technique unlock level (`level_requirement`) — tiers technique recharge. */
	levelRequirement?: number | null;
	/** Per-ability override: `true` = always at-will; `false` = always tracked. */
	atWill?: boolean | null;
}

export interface AbilityUseGrant {
	uses_max: number;
	uses_current: number;
	recharge: Extract<ResourceRecharge, "short-rest" | "long-rest">;
}

function primaryAbilityModifier(
	job: string | null | undefined,
	abilities: Partial<Record<AbilityScore, number>> | null | undefined,
): number {
	const primary = getJobPrimaryAbility(job);
	const score = (primary ? abilities?.[primary] : undefined) ?? 10;
	return getAbilityModifier(score);
}

/**
 * Derive the per-ability "X per rest" grant for a power/technique under the
 * 5e-SRD-5.1 use economy, or `null` when the ability should stay unlimited /
 * untracked here:
 *   - an explicit `atWill: true` override,
 *   - powers on a slot-cast job (casters/hybrids expend spell slots),
 *   - cantrip / level-0 powers (at-will per SRD) unless `atWill: false`.
 * Otherwise `uses_max = max(1, primary-ability mod + proficiency bonus)`, with
 * recharge short/long by scale.
 */
export function deriveAbilityUseGrant(
	input: AbilityUseGrantInput,
): AbilityUseGrant | null {
	const { kind, job, level, abilities, powerLevel, levelRequirement, atWill } =
		input;

	// Explicit override to unlimited.
	if (atWill === true) return null;

	// Powers cast from spell slots (prepared/known caster + hybrid jobs) are not
	// tracked per-ability — they already expend slots. Techniques never use slots.
	if (kind === "power" && getJobPowerMode(job) !== "at-will") return null;

	// Cantrips (power_level 0) are at-will/unlimited unless forced to be tracked.
	const isCantripTier = kind === "power" && (powerLevel ?? 0) <= 0;
	if (isCantripTier && atWill !== false) return null;

	const usesMax = Math.max(
		1,
		primaryAbilityModifier(job, abilities) + getProficiencyBonus(level),
	);

	const recharge: AbilityUseGrant["recharge"] =
		kind === "power"
			? (powerLevel ?? 1) <= POWER_SHORT_REST_MAX_TIER
				? "short-rest"
				: "long-rest"
			: (levelRequirement ?? 1) <= TECHNIQUE_SHORT_REST_MAX_LEVEL
				? "short-rest"
				: "long-rest";

	return { uses_max: usesMax, uses_current: usesMax, recharge };
}
