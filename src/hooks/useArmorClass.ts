/**
 * Armor Class Auto-Calculation Hook
 *
 * D&D Beyond parity: dynamically computes AC from equipped armor,
 * shield, AGI modifier, and magical bonuses rather than using a
 * stored static value.
 *
 * Armor categories:
 *  - No armor: 10 + AGI mod
 *  - Light armor: armor AC + AGI mod
 *  - Medium armor: armor AC + min(AGI mod, 2)
 *  - Heavy armor: armor AC (no AGI)
 *  - Shield: +2 (or item AC)
 */

import { useMemo } from "react";
import { getAbilityModifier } from "@/types/system-rules";

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
): ACBreakdown {
	const agiMod = getAbilityModifier(agiScore);
	const warnings: string[] = [];

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
		// Light armor: armor AC + full AGI mod
		base = armor.baseAC;
		armorAC = armor.baseAC;
		agiApplied = agiMod;
		formula = `${armor.name} (${armor.baseAC}) + AGI (${agiMod >= 0 ? "+" : ""}${agiMod})`;
	} else if (armor.category === "medium") {
		// Medium armor: armor AC + AGI mod (max 2)
		base = armor.baseAC;
		armorAC = armor.baseAC;
		agiApplied = Math.min(agiMod, 2);
		formula = `${armor.name} (${armor.baseAC}) + AGI (${agiApplied >= 0 ? "+" : ""}${agiApplied}, max 2)`;
	} else {
		// Heavy armor: armor AC only
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
): ACBreakdown {
	return useMemo(
		() => calculateAC(agiScore, armor, shield, otherBonuses, strScore),
		[agiScore, armor, shield, otherBonuses, strScore],
	);
}
