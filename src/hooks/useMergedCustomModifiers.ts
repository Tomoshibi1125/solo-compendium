import { useMemo } from "react";
import {
	type ActiveSpellRow,
	activeSpellsToCustomModifiers,
	useCharacterActiveSpells,
} from "@/hooks/useCharacterActiveSpells";
import {
	type CharacterFeature,
	featureEffectsToCustomModifiers,
	featureModifiersToCustomModifiers,
	useCharacterFeatures,
} from "@/hooks/useCharacterFeatures";
import { useCharacterGuildBenefits } from "@/hooks/useCharacterGuildBenefits";
import {
	type CustomModifier,
	normalizeCustomModifiers,
} from "@/lib/customModifiers";

/**
 * Pure merge of every custom-modifier source. Exported separately from the
 * hook so the composition is unit-testable: a feature-granted ability bonus
 * (e.g. an origin's +2 PRE) MUST survive into the merged list, because
 * dropping it made action-card numbers drift from the sheet's stats panel.
 */
export function mergeCustomModifierSources(input: {
	sheetCustomModifiers: Partial<CustomModifier>[] | null | undefined;
	charFeatures: CharacterFeature[];
	syntheticFeatures: CharacterFeature[];
	activeSpells: ActiveSpellRow[];
	level: number;
}): CustomModifier[] {
	return [
		...normalizeCustomModifiers(input.sheetCustomModifiers),
		...featureModifiersToCustomModifiers(input.charFeatures),
		...featureEffectsToCustomModifiers(input.charFeatures, input.level),
		...featureEffectsToCustomModifiers(input.syntheticFeatures, input.level),
		...activeSpellsToCustomModifiers(input.activeSpells),
	];
}

/**
 * The single merged custom-modifier list for a character:
 *
 *   sheet-entered modifiers
 * + feature/feat flat modifiers
 * + structured feature effects (Tough +2 HP/level, ability bonuses, …)
 * + Guild Base benefits (War Room +Initiative, Vanguard Tactics +Attack, …)
 * + persisted active spells (Bless, Shield of Faith, Haste, …)
 *
 * Every consumer of `useCharacterDerivedStats` MUST pass this merged list,
 * not the raw sheet-state list. Passing only `sheetState.customModifiers`
 * silently drops the feature-derived entries, so ability scores (and every
 * number computed from them — spell attack, save DC, weapon damage) drift
 * from the character sheet, which merges all sources. An origin's +2 PRE
 * reached the stats panel but not the action cards until the action
 * pipeline switched to this hook.
 */
export function useMergedCustomModifiers(
	characterId: string | undefined,
	sheetCustomModifiers: Partial<CustomModifier>[] | null | undefined,
	level: number,
): CustomModifier[] {
	const { data: charFeatures = [] } = useCharacterFeatures(characterId || "");
	const { data: characterActiveSpells = [] } =
		useCharacterActiveSpells(characterId);
	const guildBenefits = useCharacterGuildBenefits(characterId);

	return useMemo(
		() =>
			mergeCustomModifierSources({
				sheetCustomModifiers,
				charFeatures,
				syntheticFeatures: guildBenefits.syntheticFeatures,
				activeSpells: characterActiveSpells,
				level,
			}),
		[
			sheetCustomModifiers,
			charFeatures,
			characterActiveSpells,
			guildBenefits.syntheticFeatures,
			level,
		],
	);
}
