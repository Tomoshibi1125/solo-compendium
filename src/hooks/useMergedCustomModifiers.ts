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
import { useCharacter } from "@/hooks/useCharacters";
import {
	type CustomModifier,
	normalizeCustomModifiers,
} from "@/lib/customModifiers";
import {
	buildSovereignRuntimeModifiers,
	readAttachedSovereignV2,
} from "@/lib/sovereign/sovereignRuntime";

const isProjectedSovereignFeature = (feature: CharacterFeature): boolean =>
	Boolean(
		(feature as CharacterFeature & { sovereign_definition_id?: string | null })
			.sovereign_definition_id,
	);

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
	sovereignModifiers?: CustomModifier[];
}): CustomModifier[] {
	// v2 Sovereign feature rows are a rebuildable projection. Their modifiers
	// use the structured FeatureEffect shape (`kind`, not the legacy flat
	// `type/value` shape), so execute them once from the authoritative definition
	// below instead of letting the legacy feature converter misread or duplicate
	// them. Legacy Sovereigns never carried structured modifiers.
	const normalFeatures = input.charFeatures.filter(
		(feature) => !isProjectedSovereignFeature(feature),
	);
	return [
		...normalizeCustomModifiers(input.sheetCustomModifiers),
		...featureModifiersToCustomModifiers(normalFeatures),
		...featureEffectsToCustomModifiers(normalFeatures, input.level),
		...featureEffectsToCustomModifiers(input.syntheticFeatures, input.level),
		...(input.sovereignModifiers ?? []),
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
 * + authoritative Sovereign v2 modifiers
 * + persisted active spells (Bless, Shield of Faith, Haste, …)
 *
 * Sovereign v2 does not execute arbitrary formula strings. Its bounded
 * definition is converted to the same CustomModifier consumers used by the
 * rest of the sheet (save/skill proficiency deltas and unconditional roll
 * advantage). Resistance and non-numeric proficiencies remain available from
 * the shared Sovereign runtime helper for defense/presentation consumers.
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
	const { data: character } = useCharacter(characterId || "");

	const sovereignModifiers = useMemo(() => {
		if (!character) return [];
		const definition = readAttachedSovereignV2(character.gemini_state);
		return buildSovereignRuntimeModifiers(definition, character)
			.customModifiers;
	}, [character]);

	return useMemo(
		() =>
			mergeCustomModifierSources({
				sheetCustomModifiers,
				charFeatures,
				syntheticFeatures: guildBenefits.syntheticFeatures,
				activeSpells: characterActiveSpells,
				level,
				sovereignModifiers,
			}),
		[
			sheetCustomModifiers,
			charFeatures,
			characterActiveSpells,
			guildBenefits.syntheticFeatures,
			level,
			sovereignModifiers,
		],
	);
}
