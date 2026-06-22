import type { AbilityScore } from "@/types/core-rules";
import { formatSignedNumber } from "./powerActionFormulas";

const DICE_ONLY_RE = /^\s*\d+d\d+\s*$/i;
const TRAILING_SIGN_RE = /[+-]\s*\d+(?:\.\d+)?$/;

export interface AttackLineInput {
	ability?: AbilityScore | string | null;
	abilityModifier?: number | null;
	attackRoll?: string | null;
	attackBonus?: number | null;
}

export interface DamageLineInput {
	damageRoll?: string | null;
	damageType?: string | null;
	abilityModifier?: number | null;
}

export interface SaveLineInput {
	saveDC?: number | null;
	saveAbility?: AbilityScore | string | null;
}

export function formatAttackLine(input: AttackLineInput): string {
	const { ability, abilityModifier, attackRoll, attackBonus } = input;
	const hasModifier =
		typeof abilityModifier === "number" && Number.isFinite(abilityModifier);
	const hasBonus =
		typeof attackBonus === "number" && Number.isFinite(attackBonus);
	const hasRoll =
		typeof attackRoll === "string" && attackRoll.trim().length > 0;

	if (!hasModifier && !hasBonus && !hasRoll) return "";

	const parts: string[] = [];
	if (ability && hasModifier) {
		parts.push(
			`${ability} ${formatSignedNumber(abilityModifier as number) || "+0"}`,
		);
	}
	if (hasBonus) {
		parts.push(`Attack ${formatSignedNumber(attackBonus as number) || "+0"}`);
	}
	const head = parts.join(" · ");
	if (head && hasRoll) return `${head} (${(attackRoll as string).trim()})`;
	if (head) return head;
	return (attackRoll as string).trim();
}

export function formatDamageLine(input: DamageLineInput): string {
	const trimmed = input.damageRoll?.trim();
	if (!trimmed) return "";

	let formula = trimmed;
	const mod = input.abilityModifier;
	const hasMod = typeof mod === "number" && Number.isFinite(mod) && mod !== 0;
	const alreadySigned = TRAILING_SIGN_RE.test(formula);

	if (hasMod && DICE_ONLY_RE.test(formula) && !alreadySigned) {
		formula = `${formula} ${formatSignedNumber(mod as number)}`;
	}

	const type = input.damageType?.trim();
	return type ? `${formula} ${type}` : formula;
}

export function formatSaveLine(input: SaveLineInput): string {
	const dc = input.saveDC;
	if (typeof dc !== "number" || !Number.isFinite(dc)) return "";
	const ability = input.saveAbility?.toString().trim();
	return ability ? `DC ${dc} ${ability}` : `DC ${dc}`;
}

export function formatCompactActionLine(input: {
	attack?: AttackLineInput;
	save?: SaveLineInput;
	damage?: DamageLineInput;
}): string {
	const parts: string[] = [];
	const attack = input.attack ? formatAttackLine(input.attack) : "";
	const save = input.save ? formatSaveLine(input.save) : "";
	const damage = input.damage ? formatDamageLine(input.damage) : "";
	if (attack) parts.push(attack);
	if (save) parts.push(save);
	if (damage) parts.push(damage);
	return parts.join(" · ");
}
