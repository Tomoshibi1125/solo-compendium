import { useMemo } from "react";
import type { ActionResolutionPayload } from "@/lib/actionResolution";
import { getProficiencyBonus } from "@/lib/characterCalculations";
import type { CompendiumPower, CompendiumTechnique } from "@/types/compendium";
import { type AbilityScore, getAbilityModifier } from "@/types/system-rules";
import { useCharacterDerivedStats } from "./useCharacterDerivedStats";
import { useCharacterSheetState } from "./useCharacterSheetState";
import { type CharacterWithAbilities, useCharacters } from "./useCharacters";
import { useEquipment } from "./useEquipment";
import { usePowers } from "./usePowers";
import { useRunes } from "./useRunes";
import { useSigils } from "./useSigils";
import { useTechniques } from "./useTechniques";

type JsonMechanics = Record<string, unknown>;

export type CombatActionType =
	| "weapon"
	| "spell"
	| "power"
	| "technique"
	| "other";

export interface CombatAction {
	id: string;
	name: string;
	type: CombatActionType;
	description?: string;
	activation: string;
	range: string;
	target: string;
	attackBonus?: number;
	damageRoll?: string;
	damageType?: string;
	saveDC?: number;
	saveAbility?: AbilityScore;
	resourceCost?: string;
	resourceCurrent?: number;
	resourceMax?: number;
	payload: ActionResolutionPayload;
	sourceId: string; // The ID of the weapon, power, etc.
}

/**
 * Hook to aggregate all combat actions for a character
 */
export const useCombatActions = (characterId: string) => {
	const { data: characters } = useCharacters();
	const character = useMemo(
		() =>
			(characters?.find(
				(c) => c.id === characterId,
			) as CharacterWithAbilities) || null,
		[characters, characterId],
	);

	const { equipment, isLoading: equipmentLoading } = useEquipment(characterId);
	const { powers, isLoading: powersLoading } = usePowers(characterId);
	const { techniques, isLoading: techniquesLoading } =
		useTechniques(characterId);
	const { data: runes, isLoading: runesLoading } = useRunes(characterId);
	const { data: sigils, isLoading: sigilsLoading } = useSigils(
		characterId || "",
	);
	const { state: sheetState } = useCharacterSheetState(characterId);

	const derivedStats = useCharacterDerivedStats(
		character,
		equipment || [],
		runes || [],
		sigils || [],
		sheetState.customModifiers || [],
	);

	const isLoading =
		equipmentLoading ||
		powersLoading ||
		techniquesLoading ||
		runesLoading ||
		sigilsLoading;

	const actions = useMemo(() => {
		if (!character || !derivedStats) return [];

		const profBonus = getProficiencyBonus(character.level);
		const result: CombatAction[] = [];

		// 1. Weapon Actions
		const weapons = (equipment || []).filter(
			(e) =>
				e.is_equipped &&
				(e.item_type === "weapon" ||
					(e.properties as string[])?.some((p) =>
						["simple", "martial", "weapon"].includes(p.toLowerCase()),
					)),
		);

		weapons.forEach((w) => {
			const props =
				(w.properties as string[])?.map((p) => p.toLowerCase()) || [];
			const isFinesse = props.includes("finesse");
			const isRanged = props.includes("ranged");

			// Determine which ability to use
			let ability: AbilityScore = isRanged ? "AGI" : "STR";
			if (isFinesse) {
				const strMod = getAbilityModifier(character.abilities.STR);
				const agiMod = getAbilityModifier(character.abilities.AGI);
				if (agiMod > strMod) ability = "AGI";
			}

			const abiMod = getAbilityModifier(character.abilities[ability]);
			// TODO: Add weapon proficiency check
			const attackBonus = abiMod + profBonus;

			// Basic damage roll parsing (extending characterCalculations logic)
			// For now, using a simple heuristic or checking description
			const damageMatch = w.description?.match(/(\d+d\d+)/);
			const damageRoll = damageMatch
				? `${damageMatch[1]}+${abiMod}`
				: `1d4+${abiMod}`;

			result.push({
				id: `weapon-${w.id}`,
				name: w.name,
				type: "weapon",
				description: w.description || "",
				activation: "1 action",
				range: isRanged ? "80/320" : "5 ft", // TODO: Extract from properties
				target: "One creature",
				attackBonus,
				damageRoll,
				damageType: "physical", // TODO: Detect
				payload: {
					version: 1,
					id: `weapon-${w.id}`,
					name: w.name,
					source: { type: "item", entryId: w.id },
					kind: "attack",
					attack: { roll: `1d20+${attackBonus}` },
					damage: { roll: damageRoll, type: "physical" },
				},
				sourceId: w.id,
			});
		});

		// 2. Spell/Power Actions
		(powers || []).forEach((p) => {
			const powerData = p.power as CompendiumPower; // Cast to our unified type
			if (!powerData) return;

			const castingAbility = character.job === "Technomancer" ? "INT" : "SENSE";
			const abiMod = getAbilityModifier(character.abilities[castingAbility]);
			const attackBonus = abiMod + profBonus;
			const saveDC = 8 + abiMod + profBonus;

			// Use actual properties from CompendiumPower
			const mechanics = (powerData.mechanics as JsonMechanics) || {};

			// Use mechanics here if needed, or remove if unused.
			// Let's keep it but mark it as used by referencing a field if it exists.
			const target = powerData.target || (mechanics.target as string) || "";

			result.push({
				id: `power-${p.id}`,
				name: p.name,
				type: powerData.power_type === "Spell" ? "spell" : "power",
				description: p.description || powerData.description,
				activation: powerData.activation_time || p.casting_time || "1 action",
				range: p.range || powerData.range || "Self",
				target: target,
				attackBonus: powerData.has_attack_roll ? attackBonus : undefined,
				saveDC: powerData.has_save ? saveDC : undefined,
				saveAbility: powerData.save_ability as AbilityScore,
				damageRoll: powerData.damage_roll,
				damageType: powerData.damage_type,
				payload: {
					version: 1,
					id: `power-${p.id}`,
					name: p.name,
					source: {
						type: powerData.power_type === "Spell" ? "spell" : "artifact",
						entryId: p.id,
					},
					kind: powerData.has_attack_roll ? "attack" : "save",
					attack: powerData.has_attack_roll
						? { roll: `1d20+${attackBonus}` }
						: undefined,
					save: powerData.has_save
						? {
								ability: powerData.save_ability as AbilityScore,
								dc: saveDC,
							}
						: undefined,
					damage: powerData.damage_roll
						? {
								roll: powerData.damage_roll,
								type: powerData.damage_type,
							}
						: undefined,
				},
				sourceId: p.id,
			});
		});

		// 3. Technique Actions
		(techniques || []).forEach((t) => {
			const techData = t.technique as CompendiumTechnique;
			if (!techData) return;

			// Techniques often use a specific ability or the highest martial ability
			const strMod = getAbilityModifier(character.abilities.STR);
			const agiMod = getAbilityModifier(character.abilities.AGI);
			const abiMod = Math.max(strMod, agiMod);
			const saveDC = 8 + abiMod + profBonus;

			// Extract mechanics if available
			const mechanics = (techData.mechanics as JsonMechanics) || {};

			result.push({
				id: `tech-${t.id}`,
				name: techData.name,
				type: "technique",
				description: techData.description,
				activation: techData.activation_type || "1 action",
				range: techData.range_desc || "5 ft",
				target: (mechanics.target as string) || "",
				saveDC: mechanics.save_ability ? saveDC : undefined,
				saveAbility: mechanics.save_ability as AbilityScore,
				payload: {
					version: 1,
					id: `tech-${t.id}`,
					name: techData.name,
					source: { type: "technique", entryId: t.id },
					kind: mechanics.save_ability ? "save" : "damage",
					save: mechanics.save_ability
						? { dc: saveDC, ability: mechanics.save_ability as string }
						: undefined,
					damage: mechanics.damage_roll
						? {
								roll: mechanics.damage_roll as string,
								type: (mechanics.damage_type as string) || "physical",
							}
						: undefined,
				},
				sourceId: t.id,
			});
		});

		return result;
	}, [character, derivedStats, equipment, powers, techniques]);

	return {
		actions,
		isLoading,
	};
};
