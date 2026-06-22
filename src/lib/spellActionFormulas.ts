/**
 * Spell action formulas (Rift Ascendant).
 *
 * Pure helpers for computing the attack bonus and save DC of compendium
 * spells. Spells in RA use the canonical spellcasting ability map (per
 * Job) rather than the Job's primary ability — this is the difference
 * vs. Powers, which use the primary ability. See
 * `src/lib/powerActionFormulas.ts` for the Power equivalent.
 *
 * The header in `powerActionFormulas.ts:9-23` explicitly says spell-driven
 * actions should NOT go through `resolvePowerActionFormula` with an
 * `abilityOverride`. This module provides the dedicated spell path.
 *
 * Standard 5e-shaped formulas:
 *
 *   attackBonus = proficiency_bonus + spellcasting_ability_modifier + extra_bonus
 *   saveDC      = 8 + proficiency_bonus + spellcasting_ability_modifier + extra_bonus
 *
 * Per-job spellcasting abilities (resolved via `getSpellcastingAbility`):
 *   - Prepared casters (Mage, Technomancer, Revenant, Stalker, Herald,
 *     Holy Knight, Summoner) — uses each Job's spell-prep stat.
 *   - Known casters (Esper, Contractor, Idol) — uses each Job's
 *     known-spell stat.
 *   - Non-casters return `null`; spell actions on a non-caster are
 *     treated as no-op (attack/DC undefined).
 */
import { getSpellcastingAbility } from "@/lib/5eCharacterCalculations";
import {
	buildAttackRollFormula,
	type PowerActionFormulaResult,
} from "@/lib/powerActionFormulas";
import {
	type AbilityScore,
	getAbilityModifier,
	getProficiencyBonus,
} from "@/types/core-rules";

export interface SpellActionFormulaInput {
	job: string | { name: string } | null | undefined;
	abilities: Record<AbilityScore, number>;
	/**
	 * Character level — required because Proficiency Bonus is derived from
	 * level (`ceil(level / 4) + 1`). Spell formulas always need PB.
	 */
	level: number;
	/** Bonus added to the attack roll, e.g. equipment / sigil / custom modifiers. */
	attackBonus?: number;
	/** Bonus added to the save DC, e.g. equipment / sigil / custom modifiers. */
	dcBonus?: number;
}

/**
 * Resolve the spell-casting attack roll, save DC, ability used, and
 * ability modifier in one call. Mirrors `resolvePowerActionFormula`'s
 * return shape so downstream consumers (action card, payload builders)
 * can swap between Power and Spell formulas without branching.
 *
 * If the Job has no canonical spellcasting ability (non-caster), every
 * numeric field falls back to `null`-equivalent zeros and the resolved
 * ability is `null`. Callers should guard against the `null` ability
 * before surfacing attack/DC numbers to the UI.
 */
export function resolveSpellActionFormula(
	input: SpellActionFormulaInput,
): PowerActionFormulaResult & { ability: AbilityScore | null } {
	const ability = getSpellcastingAbility(input.job);
	const proficiencyBonus = getProficiencyBonus(input.level);
	if (!ability) {
		return {
			ability: null as unknown as AbilityScore,
			abilityModifier: 0,
			attackBonus: proficiencyBonus + (input.attackBonus ?? 0),
			saveDC: 8 + proficiencyBonus + (input.dcBonus ?? 0),
			attackRoll: buildAttackRollFormula(
				proficiencyBonus + (input.attackBonus ?? 0),
			),
		};
	}
	const score = input.abilities[ability] ?? 10;
	const abilityModifier = getAbilityModifier(score);
	const attackBonus =
		abilityModifier + proficiencyBonus + (input.attackBonus ?? 0);
	const saveDC = 8 + abilityModifier + proficiencyBonus + (input.dcBonus ?? 0);
	return {
		ability,
		abilityModifier,
		attackBonus,
		saveDC,
		attackRoll: buildAttackRollFormula(attackBonus),
	};
}
