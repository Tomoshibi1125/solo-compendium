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
 * Per-job primary abilities:
 *   STR:   Destroyer, Berserker
 *   AGI:   Assassin, Striker
 *   INT:   Mage, Revenant, Technomancer
 *   SENSE: Herald, Summoner, Stalker
 *   PRE:   Esper, Contractor, Holy Knight, Idol
 */
import { getJobPrimaryAbility } from "@/lib/5eCharacterCalculations";
import { type AbilityScore, getAbilityModifier } from "@/types/core-rules";

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
	return { ability, abilityModifier, attackBonus, saveDC };
}
