/**
 * Armor Class Auto-Calculation Hook
 *
 * D&D Beyond parity: dynamically computes AC from equipped armor,
 * shield, AGI modifier, and magical bonuses rather than using a
 * stored static value.
 *
 * Armor categories:
 *  - No armor: 10 + AGI mod
 *  - Light Mana-Weave Armor: armor AC + AGI mod
 *  - Medium Aether Armor: armor AC + min(AGI mod, 2)
 *  - Heavy Carapace Armor: armor AC (no AGI)
 *  - Shield: +2 (or item AC)
 */

import { useMemo } from "react";
import type { AbilityScore } from "@/lib/5eRulesEngine";
import {
	type ACContext,
	calculateBestAC,
	type EquipmentACData,
} from "@/lib/acFormulas";
import { getAbilityModifier } from "@/types/core-rules";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ArmorCategory = "none" | "light" | "medium" | "heavy";

export interface EquippedArmor {
	name: string;
	baseAC: number;
	category: ArmorCategory;
	magicalBonus?: number;
	stealthDisadvantage?: boolean;
	strengthRequirement?: number;
}

export interface EquippedShield {
	name: string;
	acBonus: number; // typically 2
	magicalBonus?: number;
}

export interface ACBreakdown {
	base: number;
	agiModifier: number;
	agiApplied: number; // after cap
	armorAC: number;
	shieldBonus: number;
	magicalBonus: number;
	otherBonuses: number;
	total: number;
	formula: string;
	warnings: string[];
	/**
	 * The canonical AC formula that produced the displayed value
	 * (e.g. "Berserker Unarmored Defense", "Mage Armor", "Armored").
	 * Surfaced for tooltip display so the player sees which path won.
	 */
	selectedFormulaName?: string;
	/** All eligible formulas and their AC values, for tooltip detail. */
	allOptions?: Array<{ name: string; ac: number; source: string }>;
}

/**
 * Optional context that enables RA's specialty AC formulas (Berserker
 * Unarmored Defense, Striker Unarmored Defense, Mage Armor) to be
 * considered automatically. When omitted, calculateAC behaves like the
 * baseline single-formula calculator for backward compatibility.
 */
export interface ACContextExtras {
	job?: string | null;
	abilities?: Record<AbilityScore, number>;
	mageArmorActive?: boolean;
}

// ---------------------------------------------------------------------------
// Pure calculation
// ---------------------------------------------------------------------------

export function calculateAC(
	agiScore: number,
	armor: EquippedArmor | null,
	shield: EquippedShield | null,
	otherBonuses: number = 0,
	strScore?: number,
	extras?: ACContextExtras,
): ACBreakdown {
	const agiMod = getAbilityModifier(agiScore);
	const warnings: string[] = [];

	// ── Canonical path ──────────────────────────────────────────────
	// When the caller supplies job + ability scores, delegate to the
	// canonical acFormulas multi-formula evaluator so RA-specific
	// formulas (Berserker / Striker Unarmored Defense, Mage Armor) are
	// considered automatically and the highest result wins — matching
	// DDB's "take highest of all valid formulas" behavior.
	if (extras?.job && extras?.abilities) {
		const equippedArmor: EquipmentACData | null =
			armor && armor.category !== "none"
				? {
						name: armor.name,
						baseAC: armor.baseAC,
						armorType: armor.category,
						magicBonus: armor.magicalBonus ?? 0,
					}
				: null;
		const equippedShield: EquipmentACData | null = shield
			? {
					name: shield.name,
					baseAC: shield.acBonus,
					armorType: "shield",
					magicBonus: shield.magicalBonus ?? 0,
				}
			: null;

		const ctx: ACContext = {
			abilities: extras.abilities,
			job: extras.job,
			equippedArmor,
			equippedShield,
			miscACBonus: otherBonuses,
			mageArmorActive: extras.mageArmorActive ?? false,
		};
		const result = calculateBestAC(ctx);

		// Stealth/STR warnings still surface from the armor item itself
		if (armor?.stealthDisadvantage) {
			warnings.push(`${armor.name} imposes disadvantage on Stealth checks.`);
		}
		if (
			armor?.strengthRequirement &&
			strScore &&
			strScore < armor.strengthRequirement
		) {
			warnings.push(
				`STR ${strScore} is below ${armor.name}'s requirement of ${armor.strengthRequirement}. Speed reduced by 10 ft.`,
			);
		}

		return {
			base: armor && armor.category !== "none" ? armor.baseAC : 10,
			agiModifier: agiMod,
			agiApplied: agiMod,
			armorAC: armor && armor.category !== "none" ? armor.baseAC : 0,
			shieldBonus: equippedShield
				? equippedShield.baseAC + equippedShield.magicBonus
				: 0,
			magicalBonus: equippedArmor?.magicBonus ?? 0,
			otherBonuses,
			total: result.ac,
			formula: `${result.selectedFormula.description} (= ${result.ac})`,
			warnings,
			selectedFormulaName: result.selectedFormula.name,
			allOptions: result.allOptions.map((o) => ({
				name: o.formula.name,
				ac: o.ac,
				source: o.formula.source,
			})),
		};
	}

	// ── Legacy single-formula path (backward compatibility) ─────────
	let base: number;
	let agiApplied: number;
	let armorAC = 0;
	let formula: string;

	if (!armor || armor.category === "none") {
		// Unarmored: 10 + AGI mod
		base = 10;
		agiApplied = agiMod;
		formula = `10 + AGI (${agiMod >= 0 ? "+" : ""}${agiMod})`;
	} else if (armor.category === "light") {
		// Light Mana-Weave Armor: armor AC + full AGI mod
		base = armor.baseAC;
		armorAC = armor.baseAC;
		agiApplied = agiMod;
		formula = `${armor.name} (${armor.baseAC}) + AGI (${agiMod >= 0 ? "+" : ""}${agiMod})`;
	} else if (armor.category === "medium") {
		// Medium Aether Armor: armor AC + AGI mod (max 2)
		base = armor.baseAC;
		armorAC = armor.baseAC;
		agiApplied = Math.min(agiMod, 2);
		formula = `${armor.name} (${armor.baseAC}) + AGI (${agiApplied >= 0 ? "+" : ""}${agiApplied}, max 2)`;
	} else {
		// Heavy Carapace Armor: armor AC only
		base = armor.baseAC;
		armorAC = armor.baseAC;
		agiApplied = 0;
		formula = `${armor.name} (${armor.baseAC})`;

		// Check STR requirement
		if (
			armor.strengthRequirement &&
			strScore &&
			strScore < armor.strengthRequirement
		) {
			warnings.push(
				`STR ${strScore} is below ${armor.name}'s requirement of ${armor.strengthRequirement}. Speed reduced by 10 ft.`,
			);
		}
	}

	// Stealth disadvantage warning
	if (armor?.stealthDisadvantage) {
		warnings.push(`${armor.name} imposes disadvantage on Stealth checks.`);
	}

	// Shield
	const shieldBonus = shield ? shield.acBonus + (shield.magicalBonus ?? 0) : 0;
	if (shield) {
		formula += ` + Shield (${shieldBonus})`;
	}

	// Magical armor bonus
	const magicalBonus = armor?.magicalBonus ?? 0;
	if (magicalBonus > 0) {
		formula += ` + Magic (+${magicalBonus})`;
	}

	// Other bonuses
	if (otherBonuses !== 0) {
		formula += ` + Other (${otherBonuses >= 0 ? "+" : ""}${otherBonuses})`;
	}

	const total = base + agiApplied + shieldBonus + magicalBonus + otherBonuses;

	return {
		base,
		agiModifier: agiMod,
		agiApplied,
		armorAC,
		shieldBonus,
		magicalBonus,
		otherBonuses,
		total,
		formula,
		warnings,
	};
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useArmorClass(
	agiScore: number,
	armor: EquippedArmor | null,
	shield: EquippedShield | null,
	otherBonuses: number = 0,
	strScore?: number,
	extras?: ACContextExtras,
): ACBreakdown {
	return useMemo(
		() => calculateAC(agiScore, armor, shield, otherBonuses, strScore, extras),
		[agiScore, armor, shield, otherBonuses, strScore, extras],
	);
}
