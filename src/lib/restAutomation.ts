/**
 * Rest Automation System
 * Handles short rest and long rest mechanics for Rift Ascendant characters.
 *
 * Short Rest: Spend hit dice to heal, recharge "short-rest" features,
 *             Contractor (Pact) spell slots recharge.
 * Long Rest:  Full HP, half hit dice recovery, all spell slots, all features,
 *             reduce exhaustion by 1, reset Rift Favor to max.
 *
 * All functions are pure — callers provide state, functions return results.
 * Database persistence is the caller's responsibility.
 */

import {
	getCasterType,
	getRiftFavorMax,
	getSpellSlotsPerLevel,
} from "./5eCharacterCalculations";
import type { AbilityScore } from "./5eRulesEngine";
import { getAbilityModifier } from "./5eRulesEngine";

// ── Types ─────────────────────────────────────────────────────────────

export interface RestCharacterState {
	level: number;
	job: string;
	abilities: Record<AbilityScore, number>;
	hitPoints: {
		current: number;
		max: number;
		temp: number;
	};
	hitDice: {
		current: number; // Available hit dice
		max: number; // Equal to level
		size: number; // d6, d8, d10, d12
	};
	exhaustionLevel: number;
	riftFavor: {
		current: number;
		max: number;
		dieSize: number;
	};
	spellSlots?: Record<number, { current: number; max: number }>;
	features?: Array<{
		id: string;
		name: string;
		uses_current: number | null;
		uses_max: number | null;
		recharge: string | null; // "short-rest" | "long-rest" | "encounter" | null
	}>;
	conditions?: string[];
}

export interface RestResult {
	/** Updated character state after rest */
	updatedState: RestCharacterState;
	/** Summary of changes */
	changes: RestChange[];
}

export interface RestChange {
	field: string;
	label: string;
	before: number | string;
	after: number | string;
}

export interface HitDieSpendResult {
	hpGained: number;
	roll: number;
	vitMod: number;
	total: number;
}

// ── Hit Die Spending (Short Rest) ─────────────────────────────────────

/**
 * Calculate the HP gained from spending one hit die.
 * Standard 5e: roll hit die + VIT modifier (minimum 0 HP gained per die).
 *
 * @param hitDieSize The size of the hit die (e.g., 8 for d8)
 * @param vitScore The character's VIT (Constitution) score
 * @param roll The actual die roll result (1 to hitDieSize). Pass null for average.
 */
export function calculateHitDieHeal(
	hitDieSize: number,
	vitScore: number,
	roll: number | null = null,
): HitDieSpendResult {
	const vitMod = getAbilityModifier(vitScore);
	const actualRoll = roll ?? Math.floor(hitDieSize / 2) + 1; // Average if no roll provided
	const total = Math.max(0, actualRoll + vitMod); // Minimum 0 per 5e rules

	return {
		hpGained: total,
		roll: actualRoll,
		vitMod,
		total,
	};
}

// ── Short Rest ────────────────────────────────────────────────────────

/**
 * Perform a short rest.
 *
 * Effects:
 * - Spend hit dice to heal (caller specifies how many)
 * - Recharge features with recharge = "short-rest"
 * - Contractor (Pact caster) spell slots recharge
 *
 * @param state Current character state
 * @param hitDiceToSpend Number of hit dice to spend for healing
 * @param dieRolls Optional array of specific die roll results. If not provided, uses average.
 */
export function performShortRest(
	state: RestCharacterState,
	hitDiceToSpend: number,
	dieRolls?: number[],
): RestResult {
	const changes: RestChange[] = [];
	const updated = structuredClone(state);

	// 1. Hit die spending for healing
	const actualSpend = Math.min(hitDiceToSpend, updated.hitDice.current);
	let totalHealing = 0;

	for (let i = 0; i < actualSpend; i++) {
		const roll = dieRolls?.[i] ?? null;
		const result = calculateHitDieHeal(
			updated.hitDice.size,
			updated.abilities.VIT,
			roll,
		);
		totalHealing += result.hpGained;
	}

	if (actualSpend > 0) {
		const beforeHP = updated.hitPoints.current;
		const beforeDice = updated.hitDice.current;

		updated.hitDice.current -= actualSpend;
		updated.hitPoints.current = Math.min(
			updated.hitPoints.current + totalHealing,
			updated.hitPoints.max,
		);

		changes.push({
			field: "hitPoints.current",
			label: "Hit Points",
			before: beforeHP,
			after: updated.hitPoints.current,
		});
		changes.push({
			field: "hitDice.current",
			label: "Hit Dice Remaining",
			before: beforeDice,
			after: updated.hitDice.current,
		});
	}

	// 2. Recharge short-rest features
	if (updated.features) {
		for (const feature of updated.features) {
			if (
				feature.recharge === "short-rest" &&
				feature.uses_current !== null &&
				feature.uses_max !== null &&
				feature.uses_current < feature.uses_max
			) {
				changes.push({
					field: `feature:${feature.id}`,
					label: `${feature.name} (recharged)`,
					before: feature.uses_current,
					after: feature.uses_max,
				});
				feature.uses_current = feature.uses_max;
			}
		}
	}

	// 3. Contractor (Pact) spell slots recharge on short rest
	const casterType = getCasterType(updated.job);
	if (casterType === "pact" && updated.spellSlots) {
		const maxSlots = getSpellSlotsPerLevel("pact", updated.level);
		for (const [levelStr, maxCount] of Object.entries(maxSlots)) {
			const level = parseInt(levelStr, 10);
			if (maxCount > 0 && updated.spellSlots[level]) {
				const before = updated.spellSlots[level].current;
				updated.spellSlots[level].current = maxCount;
				if (before < maxCount) {
					changes.push({
						field: `spellSlots.${level}`,
						label: `Pact Slots (Level ${level})`,
						before,
						after: maxCount,
					});
				}
			}
		}
	}

	return { updatedState: updated, changes };
}

// ── Long Rest ─────────────────────────────────────────────────────────

/**
 * Perform a long rest.
 *
 * Effects:
 * - HP restored to max
 * - Recover half of max hit dice (minimum 1)
 * - All spell slots restored
 * - All features with "short-rest" or "long-rest" recharge restored
 * - Exhaustion reduced by 1
 * - Rift Favor reset to max
 * - Temp HP preserved (per 5e rules, temp HP doesn't reset)
 *
 * @param state Current character state
 */
export function performLongRest(state: RestCharacterState): RestResult {
	const changes: RestChange[] = [];
	const updated = structuredClone(state);

	// 1. HP restored to max
	if (updated.hitPoints.current < updated.hitPoints.max) {
		changes.push({
			field: "hitPoints.current",
			label: "Hit Points",
			before: updated.hitPoints.current,
			after: updated.hitPoints.max,
		});
		updated.hitPoints.current = updated.hitPoints.max;
	}

	// 2. Recover half of max hit dice (minimum 1)
	const hitDiceToRecover = Math.max(1, Math.floor(updated.hitDice.max / 2));
	const beforeDice = updated.hitDice.current;
	updated.hitDice.current = Math.min(
		updated.hitDice.current + hitDiceToRecover,
		updated.hitDice.max,
	);
	if (beforeDice < updated.hitDice.current) {
		changes.push({
			field: "hitDice.current",
			label: "Hit Dice Recovered",
			before: beforeDice,
			after: updated.hitDice.current,
		});
	}

	// 3. All spell slots restored
	const casterType = getCasterType(updated.job);
	if (casterType !== "none" && updated.spellSlots) {
		const maxSlots = getSpellSlotsPerLevel(casterType, updated.level);
		for (const [levelStr, maxCount] of Object.entries(maxSlots)) {
			const level = parseInt(levelStr, 10);
			if (maxCount > 0 && updated.spellSlots[level]) {
				const before = updated.spellSlots[level].current;
				if (before < maxCount) {
					changes.push({
						field: `spellSlots.${level}`,
						label: `Spell Slots (Level ${level})`,
						before,
						after: maxCount,
					});
				}
				updated.spellSlots[level].current = maxCount;
			}
		}
	}

	// 4. All features recharged (short-rest + long-rest)
	if (updated.features) {
		for (const feature of updated.features) {
			const rechargeable =
				feature.recharge === "short-rest" ||
				feature.recharge === "long-rest" ||
				feature.recharge === "encounter";

			if (
				rechargeable &&
				feature.uses_current !== null &&
				feature.uses_max !== null &&
				feature.uses_current < feature.uses_max
			) {
				changes.push({
					field: `feature:${feature.id}`,
					label: `${feature.name} (recharged)`,
					before: feature.uses_current,
					after: feature.uses_max,
				});
				feature.uses_current = feature.uses_max;
			}
		}
	}

	// 5. Exhaustion reduced by 1 (requires food & water per 5e rules)
	if (updated.exhaustionLevel > 0) {
		changes.push({
			field: "exhaustionLevel",
			label: "Exhaustion Level",
			before: updated.exhaustionLevel,
			after: updated.exhaustionLevel - 1,
		});
		updated.exhaustionLevel -= 1;
	}

	// 6. Rift Favor reset to max
	const riftMax = getRiftFavorMax(updated.level);
	if (updated.riftFavor.current < riftMax) {
		changes.push({
			field: "riftFavor.current",
			label: "Rift Favor",
			before: updated.riftFavor.current,
			after: riftMax,
		});
		updated.riftFavor.current = riftMax;
	}
	updated.riftFavor.max = riftMax;

	return { updatedState: updated, changes };
}

// ── Utilities ─────────────────────────────────────────────────────────

/** Format a rest result into human-readable chat messages */
export function formatRestSummary(
	restType: "short" | "long",
	result: RestResult,
): string[] {
	const lines: string[] = [
		`═══ ${restType === "short" ? "Short Rest" : "Long Rest"} Complete ═══`,
	];

	if (result.changes.length === 0) {
		lines.push("No changes — all resources were already at full.");
	} else {
		for (const change of result.changes) {
			lines.push(`• ${change.label}: ${change.before} → ${change.after}`);
		}
	}

	return lines;
}
