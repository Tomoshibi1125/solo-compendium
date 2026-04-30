import {
	calculateAttackModifier,
	chooseWeaponAttackAbility,
} from "@/lib/derivedStats";
import { type AbilityScore, getAbilityModifier } from "@/types/core-rules";

export interface WeaponActionFormulaInput {
	abilities: Record<AbilityScore, number>;
	proficiencyBonus: number;
	proficient: boolean;
	isRanged: boolean;
	isFinesse: boolean;
	damageDice?: string | null;
	attackBonus?: number;
	damageBonus?: string | number | null;
}

export interface WeaponActionFormulaResult {
	ability: AbilityScore;
	abilityModifier: number;
	attackBonus: number;
	attackRoll: string;
	damageRoll: string;
}

function signedNumber(value: number): string {
	if (value === 0) return "";
	return value > 0 ? `+${value}` : `${value}`;
}

function normalizeDamageBonus(
	value: string | number | null | undefined,
): string {
	if (typeof value === "number") return signedNumber(value);
	return value?.trim() ?? "";
}

function toFlatDamageBonus(value: string): number | null {
	const compact = value.replace(/\s+/g, "");
	if (!compact) return 0;
	if (!/^[+-]?\d+$/.test(compact)) return null;
	return parseInt(compact, 10);
}

function buildDamageRoll(
	damageDice: string | null | undefined,
	abilityModifier: number,
	damageBonus: string | number | null | undefined,
): string {
	const dice = damageDice?.match(/(\d+d\d+)/i)?.[1] ?? "1d4";
	const normalizedBonus = normalizeDamageBonus(damageBonus);
	const flatBonus = toFlatDamageBonus(normalizedBonus);

	if (flatBonus !== null) {
		return `${dice}${signedNumber(abilityModifier + flatBonus)}`;
	}

	return `${dice}${signedNumber(abilityModifier)}${normalizedBonus}`;
}

export function resolveWeaponActionFormula(
	input: WeaponActionFormulaInput,
): WeaponActionFormulaResult {
	const ability = chooseWeaponAttackAbility({
		abilities: input.abilities,
		isRanged: input.isRanged,
		isFinesse: input.isFinesse,
	});
	const abilityModifier = getAbilityModifier(input.abilities[ability]);
	const attackBonus = calculateAttackModifier({
		abilityModifier,
		proficiencyBonus: input.proficiencyBonus,
		proficient: input.proficient,
		bonus: input.attackBonus,
	});

	return {
		ability,
		abilityModifier,
		attackBonus,
		attackRoll: `1d20${signedNumber(attackBonus)}`,
		damageRoll: buildDamageRoll(
			input.damageDice,
			abilityModifier,
			input.damageBonus,
		),
	};
}
