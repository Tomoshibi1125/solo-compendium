/**
 * AC Formula System
 * Supports multiple AC calculation paths and auto-selects the highest.
 * User can manually override with a toggle.
 *
 * Standard formulas:
 * - Unarmored: 10 + AGI_mod
 * - Berserker Unarmored Defense: 10 + AGI_mod + VIT_mod (no armor)
 * - Striker Unarmored Defense: 10 + AGI_mod + SENSE_mod (no armor)
 * - Light Armor: armor_base + AGI_mod
 * - Medium Armor: armor_base + min(AGI_mod, 2)
 * - Heavy Armor: armor_base (no AGI)
 * - Shield: +2 to current AC
 * - Mage Armor (spell): 13 + AGI_mod (no armor)
 *
 * Rift Ascendant Job mapping:
 * - Berserker → Barbarian Unarmored Defense (10 + AGI + VIT)
 * - Striker → Monk Unarmored Defense (10 + AGI + SENSE)
 */

import type { AbilityScore } from "./5eRulesEngine";
import { getAbilityModifier } from "./5eRulesEngine";

// ── Types ─────────────────────────────────────────────────────────────

export interface ACContext {
	abilities: Record<AbilityScore, number>;
	job: string;
	/** Equipped armor item, null if unarmored */
	equippedArmor: EquipmentACData | null;
	/** Equipped shield, null if no shield */
	equippedShield: EquipmentACData | null;
	/** Additional flat AC bonuses from magic items, features, etc. */
	miscACBonus: number;
	/** Whether Mage Armor spell is active */
	mageArmorActive: boolean;
}

export interface EquipmentACData {
	name: string;
	baseAC: number;
	armorType: "light" | "medium" | "heavy" | "shield";
	magicBonus: number;
}

export interface ACFormula {
	id: string;
	name: string;
	source: string;
	/** Calculate AC given context. Returns null if not eligible. */
	calculate: (ctx: ACContext) => number | null;
	/** Description for UI tooltip */
	description: string;
}

export interface ACResult {
	/** The highest calculated AC value */
	ac: number;
	/** The formula that produced the highest AC */
	selectedFormula: ACFormula;
	/** All eligible formulas with their calculated AC values */
	allOptions: Array<{ formula: ACFormula; ac: number }>;
	/** Whether a shield bonus is applied */
	shieldApplied: boolean;
	/** Total misc bonus applied */
	miscBonus: number;
}

// ── Formula Definitions ───────────────────────────────────────────────

const UNARMORED_BASE: ACFormula = {
	id: "unarmored",
	name: "Unarmored",
	source: "base",
	description: "10 + AGI modifier",
	calculate: (ctx) => {
		// Only available when not wearing armor
		if (ctx.equippedArmor) return null;
		return 10 + getAbilityModifier(ctx.abilities.AGI);
	},
};

const BERSERKER_UNARMORED: ACFormula = {
	id: "berserker_ud",
	name: "Berserker Unarmored Defense",
	source: "job:berserker",
	description: "10 + AGI modifier + VIT modifier (no armor)",
	calculate: (ctx) => {
		if (ctx.equippedArmor) return null;
		if (ctx.job.toLowerCase() !== "berserker") return null;
		return (
			10 +
			getAbilityModifier(ctx.abilities.AGI) +
			getAbilityModifier(ctx.abilities.VIT)
		);
	},
};

const STRIKER_UNARMORED: ACFormula = {
	id: "striker_ud",
	name: "Striker Unarmored Defense",
	source: "job:striker",
	description: "10 + AGI modifier + SENSE modifier (no armor, no shield)",
	calculate: (ctx) => {
		if (ctx.equippedArmor) return null;
		if (ctx.equippedShield) return null; // Monks lose UD with shield
		if (ctx.job.toLowerCase() !== "striker") return null;
		return (
			10 +
			getAbilityModifier(ctx.abilities.AGI) +
			getAbilityModifier(ctx.abilities.SENSE)
		);
	},
};

const ARMORED: ACFormula = {
	id: "armored",
	name: "Armored",
	source: "equipment",
	description: "Armor base AC + AGI modifier (capped by armor type)",
	calculate: (ctx) => {
		if (!ctx.equippedArmor) return null;
		if (ctx.equippedArmor.armorType === "shield") return null;

		const agiMod = getAbilityModifier(ctx.abilities.AGI);
		const armor = ctx.equippedArmor;

		let appliedAgi: number;
		switch (armor.armorType) {
			case "light":
				appliedAgi = agiMod;
				break;
			case "medium":
				appliedAgi = Math.min(agiMod, 2);
				break;
			case "heavy":
				appliedAgi = 0;
				break;
			default:
				appliedAgi = agiMod;
		}

		return armor.baseAC + appliedAgi + armor.magicBonus;
	},
};

const MAGE_ARMOR: ACFormula = {
	id: "mage_armor",
	name: "Mage Armor",
	source: "spell:mage-armor",
	description: "13 + AGI modifier (no armor)",
	calculate: (ctx) => {
		if (ctx.equippedArmor) return null;
		if (!ctx.mageArmorActive) return null;
		return 13 + getAbilityModifier(ctx.abilities.AGI);
	},
};

/** All built-in AC formulas */
export const AC_FORMULAS: ACFormula[] = [
	UNARMORED_BASE,
	BERSERKER_UNARMORED,
	STRIKER_UNARMORED,
	ARMORED,
	MAGE_ARMOR,
];

// ── Main Calculation ──────────────────────────────────────────────────

/**
 * Calculate the best AC from all eligible formulas.
 * Applies shield and misc bonuses on top.
 *
 * @param ctx The AC calculation context
 * @param customFormulas Additional custom formulas (from features, relics, etc.)
 * @returns The AC result with all options
 */
export function calculateBestAC(
	ctx: ACContext,
	customFormulas: ACFormula[] = [],
): ACResult {
	const allFormulas = [...AC_FORMULAS, ...customFormulas];
	const eligibleOptions: Array<{ formula: ACFormula; ac: number }> = [];

	for (const formula of allFormulas) {
		const ac = formula.calculate(ctx);
		if (ac !== null) {
			eligibleOptions.push({ formula, ac });
		}
	}

	// Sort by AC descending
	eligibleOptions.sort((a, b) => b.ac - a.ac);

	// Fallback to base unarmored if nothing else is eligible
	if (eligibleOptions.length === 0) {
		const fallbackAC = 10 + getAbilityModifier(ctx.abilities.AGI);
		eligibleOptions.push({ formula: UNARMORED_BASE, ac: fallbackAC });
	}

	const best = eligibleOptions[0];
	let finalAC = best.ac;

	// Apply shield bonus (+2 or magic shield)
	let shieldApplied = false;
	if (ctx.equippedShield) {
		finalAC += 2 + ctx.equippedShield.magicBonus;
		shieldApplied = true;
	}

	// Apply misc AC bonuses (from features, relics, etc.)
	finalAC += ctx.miscACBonus;

	return {
		ac: Math.max(finalAC, 0),
		selectedFormula: best.formula,
		allOptions: eligibleOptions,
		shieldApplied,
		miscBonus: ctx.miscACBonus,
	};
}

// ── Utility: Create context from character data ───────────────────────

/**
 * Helper to create an ACContext from common character/equipment data.
 */
export function createACContext(params: {
	abilities: Record<AbilityScore, number>;
	job: string;
	equippedArmor?: EquipmentACData | null;
	equippedShield?: EquipmentACData | null;
	miscACBonus?: number;
	mageArmorActive?: boolean;
}): ACContext {
	return {
		abilities: params.abilities,
		job: params.job,
		equippedArmor: params.equippedArmor ?? null,
		equippedShield: params.equippedShield ?? null,
		miscACBonus: params.miscACBonus ?? 0,
		mageArmorActive: params.mageArmorActive ?? false,
	};
}
