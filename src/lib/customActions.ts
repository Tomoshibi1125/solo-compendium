/**
 * Custom Action Builder
 * Define homebrew attacks, abilities, and special actions with auto-calculated
 * attack bonus, damage formulas, and save DCs.
 *
 * Equivalent to DDB's "Custom Action" feature.
 * Actions appear alongside auto-generated attacks from equipment in the Actions tab.
 *
 * All functions are pure — callers provide state, functions return results.
 */

import type { CalculatedStats } from "./5eCharacterCalculations";
import type { AbilityScore } from "./5eRulesEngine";
import { getAbilityModifier } from "./5eRulesEngine";

// ── Types ─────────────────────────────────────────────────────────────

export interface CustomAction {
	/** Unique identifier */
	id: string;
	/** Display name */
	name: string;
	/** Action economy type */
	actionType: "action" | "bonus-action" | "reaction" | "free" | "other";
	/** Attack type (if applicable) */
	attackType?: "melee" | "ranged" | "spell" | "none";

	// ── Attack Roll ────────────────────────────────────────────────
	/** Attack bonus: number = flat bonus, "auto" = ability + PB */
	attackBonus?: number | "auto";
	/** Which ability to use for auto attack bonus */
	attackAbility?: AbilityScore;

	// ── Damage ─────────────────────────────────────────────────────
	/** Damage dice formula (e.g. "2d6", "1d8+1d6") */
	damageDice?: string;
	/** Damage type (e.g. "slashing", "fire", "radiant") */
	damageType?: string;
	/** Add this ability modifier to damage */
	damageAbility?: AbilityScore;
	/** Flat damage bonus */
	damageBonus?: number;

	// ── Save-Based ─────────────────────────────────────────────────
	/** Save DC: number = flat DC, "auto" = use spell save DC */
	saveDC?: number | "auto";
	/** Which ability the target saves with */
	saveAbility?: AbilityScore;
	/** What happens on a successful save */
	saveEffect?: string;

	// ── Metadata ───────────────────────────────────────────────────
	/** Range description (e.g. "30 ft", "Self", "Touch") */
	range?: string;
	/** Description text */
	description?: string;
	/** Number of uses per rest (null = unlimited) */
	usesPerRest?: number | null;
	/** When uses recharge */
	recharge?: "short-rest" | "long-rest" | null;
	/** Current uses remaining */
	usesCurrent?: number | null;
	/** Source of this action */
	source?: string;
}

// ── Resolved Action (with calculated values) ──────────────────────────

export interface ResolvedAction {
	action: CustomAction;
	/** Calculated attack bonus (null if no attack roll) */
	attackBonus: number | null;
	/** Full damage formula string (e.g. "2d6 + 4 slashing") */
	damageFormula: string | null;
	/** Calculated save DC (null if no save) */
	saveDC: number | null;
	/** Human-readable summary */
	summary: string;
}

// ── Calculation Functions ─────────────────────────────────────────────

/**
 * Calculate the attack bonus for a custom action.
 */
export function calculateAttackBonus(
	action: CustomAction,
	stats: CalculatedStats,
	abilities: Record<AbilityScore, number>,
): number | null {
	if (!action.attackType || action.attackType === "none") return null;
	if (action.attackBonus === undefined) return null;

	if (typeof action.attackBonus === "number") {
		return action.attackBonus;
	}

	// "auto" mode: ability modifier + proficiency bonus
	if (action.attackBonus === "auto") {
		const ability = action.attackAbility ?? "STR";
		const abilityMod = getAbilityModifier(abilities[ability]);
		return abilityMod + stats.proficiencyBonus;
	}

	return null;
}

/**
 * Calculate the full damage formula for a custom action.
 * Returns a string like "2d6 + 4 slashing" or null if no damage.
 */
export function calculateDamageFormula(
	action: CustomAction,
	abilities: Record<AbilityScore, number>,
): string | null {
	if (!action.damageDice) return null;

	let totalBonus = action.damageBonus ?? 0;

	if (action.damageAbility) {
		totalBonus += getAbilityModifier(abilities[action.damageAbility]);
	}

	const bonusStr =
		totalBonus > 0
			? ` + ${totalBonus}`
			: totalBonus < 0
				? ` - ${Math.abs(totalBonus)}`
				: "";
	const typeStr = action.damageType ? ` ${action.damageType}` : "";

	return `${action.damageDice}${bonusStr}${typeStr}`;
}

/**
 * Calculate the save DC for a custom action.
 */
export function calculateSaveDC(
	action: CustomAction,
	stats: CalculatedStats,
): number | null {
	if (action.saveDC === undefined) return null;

	if (typeof action.saveDC === "number") {
		return action.saveDC;
	}

	// "auto" mode: use the character's spell save DC
	if (action.saveDC === "auto") {
		return stats.spellSaveDC ?? 8 + stats.proficiencyBonus;
	}

	return null;
}

// ── Resolve Full Action ───────────────────────────────────────────────

/**
 * Resolve a custom action into its fully calculated form.
 * This is the main function used by the UI to display actions.
 */
export function resolveAction(
	action: CustomAction,
	stats: CalculatedStats,
	abilities: Record<AbilityScore, number>,
): ResolvedAction {
	const attackBonus = calculateAttackBonus(action, stats, abilities);
	const damageFormula = calculateDamageFormula(action, abilities);
	const saveDC = calculateSaveDC(action, stats);

	// Build summary
	const parts: string[] = [action.name];

	if (action.actionType !== "action") {
		parts.push(`(${action.actionType})`);
	}

	if (attackBonus !== null) {
		const sign = attackBonus >= 0 ? "+" : "";
		parts.push(`${sign}${attackBonus} to hit`);
	}

	if (damageFormula) {
		parts.push(damageFormula);
	}

	if (saveDC !== null && action.saveAbility) {
		parts.push(`DC ${saveDC} ${action.saveAbility} save`);
	}

	if (action.range) {
		parts.push(action.range);
	}

	return {
		action,
		attackBonus,
		damageFormula,
		saveDC,
		summary: parts.join(" | "),
	};
}

// ── Action Management ─────────────────────────────────────────────────

/** Create a new custom action with defaults */
export function createCustomAction(
	partial: Partial<CustomAction> & { name: string },
): CustomAction {
	return {
		id: crypto.randomUUID(),
		actionType: "action",
		attackType: "none",
		...partial,
	};
}

/** Use one charge of a limited-use action */
export function useAction(action: CustomAction): CustomAction {
	if (
		action.usesCurrent === null ||
		action.usesCurrent === undefined ||
		action.usesPerRest === null ||
		action.usesPerRest === undefined
	) {
		return action;
	}

	return {
		...action,
		usesCurrent: Math.max(0, action.usesCurrent - 1),
	};
}

/** Recharge action uses (called by rest automation) */
export function rechargeAction(
	action: CustomAction,
	restType: "short" | "long",
): CustomAction {
	if (
		action.usesPerRest === null ||
		action.usesPerRest === undefined ||
		action.recharge === null ||
		action.recharge === undefined
	) {
		return action;
	}

	const shouldRecharge =
		restType === "long" ||
		(restType === "short" && action.recharge === "short-rest");

	if (shouldRecharge) {
		return { ...action, usesCurrent: action.usesPerRest };
	}

	return action;
}
