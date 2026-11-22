/**
 * Power / job-innate action formulas (Rift Ascendant).
 *
 * Pure helpers for computing the attack bonus and save DC of compendium
 * powers and other job-innate character abilities. Powers in RA are
 * Awakening-granted job abilities tied to each job's canonical primary
 * stat, NOT a generic spellcasting ability. Spell-driven actions go
 * through `calculateSpellAttackBonus` / `calculateSpellSaveDC` instead.
 *
 * Standard 5e-shaped formulas:
 *
 *   attackBonus = proficiency_bonus + primary_ability_modifier + extra_bonus
 *   saveDC      = 8 + proficiency_bonus + primary_ability_modifier + extra_bonus
 *
 * Per-job primary abilities (authored in data/compendium/jobs.ts — the
 * single source of truth; this list is documentation only):
 *   STR:   Destroyer, Berserker
 *   AGI:   Assassin, Striker
 *   INT:   Mage, Revenant, Technomancer
 *   SENSE: Herald, Summoner, Stalker
 *   PRE:   Esper, Contractor, Holy Knight, Idol
 */
import { getJobPrimaryAbility } from "@/lib/5eCharacterCalculations";
import { getStrikerMartialArtsDie } from "@/lib/weaponAutomation";
import { type AbilityScore, getAbilityModifier } from "@/types/core-rules";

const DICE_ONLY_RE = /^\s*\d+d\d+\s*$/i;

export interface PowerActionFormulaInput {
	job: string | { name: string } | null | undefined;
	abilities: Record<AbilityScore, number>;
	proficiencyBonus: number;
	/** Bonus added to the attack roll, e.g. equipment / sigil / custom modifiers. */
	attackBonus?: number;
	/** Bonus added to the save DC, e.g. equipment / sigil / custom modifiers. */
	dcBonus?: number;
	/** Override the auto-resolved primary ability (e.g. an item that says "uses CHA"). */
	abilityOverride?: AbilityScore | null;
}

export interface PowerActionFormulaResult {
	ability: AbilityScore;
	abilityModifier: number;
	attackBonus: number;
	saveDC: number;
	attackRoll: string;
}

export function formatSignedNumber(value: number): string {
	if (value === 0) return "";
	return value > 0 ? `+${value}` : `${value}`;
}

export function buildAttackRollFormula(attackBonus: number): string {
	return `1d20${formatSignedNumber(attackBonus)}`;
}

export function appendAbilityModifierToDamageFormula(
	formula: string | null | undefined,
	abilityModifier: number,
): string | undefined {
	const trimmed = formula?.trim();
	if (!trimmed) return undefined;
	if (abilityModifier === 0) return trimmed;
	if (!DICE_ONLY_RE.test(trimmed)) return trimmed;
	return `${trimmed}${formatSignedNumber(abilityModifier)}`;
}

/**
 * How a strike ability's damage dice relate to the strike (`mechanics.damage_basis`):
 * - "added": the dice are added to a strike's damage and stay as written.
 * - "unarmed-die": the hit deals its own damage with the Striker unarmed die
 *   for the character's level, so it scales the way unarmed strikes do.
 */
export type AbilityDamageBasis = "added" | "unarmed-die";

/** The Striker unarmed die progression, for rules text and detail pages. */
export const UNARMED_DIE_PROGRESSION =
	"d4; d6 at 5th level, d8 at 11th, d10 at 17th";

export function readAbilityDamageBasis(
	mechanics: unknown,
): AbilityDamageBasis | null {
	if (!mechanics || typeof mechanics !== "object") return null;
	const basis = (mechanics as { damage_basis?: unknown }).damage_basis;
	return basis === "added" || basis === "unarmed-die" ? basis : null;
}

/** The damage roll an ability's action card uses at the character's level. */
export function resolveAbilityDamageRoll(
	formula: string | null | undefined,
	basis: AbilityDamageBasis | null,
	level: number,
	abilityModifier: number,
): string | undefined {
	if (basis === "unarmed-die") {
		return appendAbilityModifierToDamageFormula(
			getStrikerMartialArtsDie(level),
			abilityModifier,
		);
	}
	// Added dice ride on a strike that already carries the modifier.
	if (basis === "added") return formula?.trim() || undefined;
	return appendAbilityModifierToDamageFormula(formula, abilityModifier);
}

/** A readable damage line for compendium and sheet detail views. */
export function describeAbilityDamage(
	formula: string | null | undefined,
	basis: AbilityDamageBasis | null,
	damageType?: string | null,
): string | null {
	const type = damageType?.trim() ? ` ${damageType.trim()}` : "";
	if (basis === "unarmed-die") {
		return `Unarmed die${type} (${UNARMED_DIE_PROGRESSION})`;
	}
	const dice = formula?.trim();
	if (!dice) return null;
	if (basis === "added") return `+${dice}${type}, added to the strike`;
	return `${dice}${type}`;
}

/**
 * Resolve the canonical ability for a power action.
 *
 * Order of precedence:
 *   1. Explicit override (item / feature said "uses X")
 *   2. Canonical job → primary ability map (always set for the 14 jobs)
 *   3. PRE last-resort fallback for unknown jobs (data drift / homebrew)
 */
export function resolvePowerCastingAbility(
	job: PowerActionFormulaInput["job"],
	abilityOverride?: AbilityScore | null,
): AbilityScore {
	if (abilityOverride) return abilityOverride;
	const primary = getJobPrimaryAbility(job);
	if (primary) return primary;
	return "PRE";
}

export function resolvePowerActionFormula(
	input: PowerActionFormulaInput,
): PowerActionFormulaResult {
	const ability = resolvePowerCastingAbility(input.job, input.abilityOverride);
	const score = input.abilities[ability] ?? 10;
	const abilityModifier = getAbilityModifier(score);
	const attackBonus =
		abilityModifier + input.proficiencyBonus + (input.attackBonus ?? 0);
	const saveDC =
		8 + abilityModifier + input.proficiencyBonus + (input.dcBonus ?? 0);
	return {
		ability,
		abilityModifier,
		attackBonus,
		saveDC,
		attackRoll: buildAttackRollFormula(attackBonus),
	};
}
