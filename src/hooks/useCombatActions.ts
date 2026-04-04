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

interface ActiveFeature {
	name?: string;
	description?: string;
	action_type?: string;
	range?: string;
	target?: string;
	uses_max?: number;
	damage?: string;
	resolution?: string;
}

export type CombatActionType =
	| "weapon"
	| "spell"
	| "power"
	| "technique"
	| "item-sigil"
	| "other";

export interface CombatAction {
	id: string;
	name: string;
	type: CombatActionType;
	description?: string;
	activation: string;
	range?: string;
	target?: string;
	attackBonus?: number;
	damageRoll?: string;
	damageType?: string;
	saveDC?: number;
	saveAbility?: AbilityScore;
	resourceCost?: string;
	resourceCurrent?: number;
	resourceMax?: number;
	equipmentId?: string;
	inscriptionId?: string;
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

		// Helper: Check proficiency
		const isProficient = (item: {
			name: string;
			properties?: string[] | null;
		}) => {
			const profs = (character.weapon_proficiencies || []).map((p) =>
				p.toLowerCase(),
			);
			const itemProps =
				(item.properties as string[])?.map((p) => p.toLowerCase()) || [];

			// Name match
			if (profs.includes(item.name.toLowerCase())) return true;

			// Category match
			if (
				itemProps.includes("simple") &&
				profs.some((p) => p.includes("simple"))
			)
				return true;
			if (
				itemProps.includes("martial") &&
				profs.some((p) => p.includes("martial"))
			)
				return true;

			return false;
		};

		// Helper: Parse Range
		const parseRange = (item: {
			properties?: string[] | null;
			description?: string | null;
		}) => {
			const props = (item.properties as string[]) || [];
			const rangeProp = props.find((p) => p.toLowerCase().includes("/"));
			if (rangeProp) return rangeProp;

			if (props.some((p) => p.toLowerCase().includes("reach"))) return "10 ft";

			const descMatch = item.description?.match(/range (\d+\/\d+)/i);
			if (descMatch) return descMatch[1];

			return props.some((p) => p.toLowerCase().includes("ranged"))
				? "80/320"
				: "5 ft";
		};

		// Helper: Detect Damage Type
		const detectDamageType = (item: {
			name: string;
			description?: string | null;
		}) => {
			const content = `${item.name} ${item.description}`.toLowerCase();
			if (content.includes("slashing")) return "slashing";
			if (content.includes("piercing")) return "piercing";
			if (content.includes("bludgeoning")) return "bludgeoning";
			if (content.includes("fire")) return "fire";
			if (content.includes("cold")) return "cold";
			if (content.includes("lightning")) return "lightning";
			if (content.includes("force")) return "force";
			if (content.includes("psychic")) return "psychic";
			if (content.includes("necrotic")) return "necrotic";
			if (content.includes("radiant")) return "radiant";
			if (content.includes("acid")) return "acid";
			if (content.includes("poison")) return "poison";
			if (content.includes("thunder")) return "thunder";
			return "physical";
		};

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
			const hasProf = isProficient(w);
			const attackBonus = abiMod + (hasProf ? profBonus : 0);

			// Basic damage roll parsing
			const damageMatch = w.description?.match(/(\d+d\d+)/);
			const damageRoll = damageMatch
				? `${damageMatch[1]}+${abiMod}`
				: `1d4+${abiMod}`;

			const damageType = detectDamageType(w);
			const range = parseRange(w);

			result.push({
				id: `weapon-${w.id}`,
				name: w.name,
				type: "weapon",
				description: w.description || "",
				activation: "1 action",
				range,
				target: "One creature",
				attackBonus,
				damageRoll,
				damageType,
				equipmentId: w.id,
				payload: {
					version: 1,
					id: `weapon-${w.id}`,
					name: w.name,
					source: { type: "item", entryId: w.id },
					kind: "attack",
					attack: { roll: `1d20+${attackBonus}` },
					damage: { roll: damageRoll, type: damageType },
				},
				sourceId: w.id,
			});
		});

		// 2. Spell/Power Actions
		(powers || []).forEach((p) => {
			const powerData = p.power as CompendiumPower;
			if (!powerData) return;

			const castingAbility = character.job === "Technomancer" ? "INT" : "SENSE";
			const abiMod = getAbilityModifier(character.abilities[castingAbility]);
			const attackBonus = abiMod + profBonus;
			const saveDC = 8 + abiMod + profBonus;

			const mechanics = (powerData.mechanics as JsonMechanics) || {};
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
				equipmentId: p.id,
			});
		});

		// 3. Technique Actions
		(techniques || []).forEach((t) => {
			const techData = t.technique as CompendiumTechnique;
			if (!techData) return;

			const strMod = getAbilityModifier(character.abilities.STR);
			const agiMod = getAbilityModifier(character.abilities.AGI);
			const abiMod = Math.max(strMod, agiMod);
			const saveDC = 8 + abiMod + profBonus;

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

		// 4. Sigil Actions (Item Abilities)
		(sigils || []).forEach((si) => {
			const sigilData = si.sigil;
			if (!sigilData?.active_feature) return;

			const eq = (equipment || []).find((e) => e.id === si.equipment_id);
			if (!eq?.is_equipped || (eq.requires_attunement && !eq.is_attuned))
				return;

			const feat = sigilData.active_feature as ActiveFeature;
			const name = feat.name || sigilData.name;
			const sourceName = eq.name;

			result.push({
				id: `sigil-action-${si.id}`,
				name: `${name} (${sourceName})`,
				type: "item-sigil",
				description: feat.description || sigilData.effect_description,
				activation: feat.action_type || "1 action",
				range: feat.range || "Self",
				target: feat.target || "One creature",
				resourceCurrent: eq.charges_current ?? feat.uses_max,
				resourceMax: eq.charges_max ?? feat.uses_max,
				payload: {
					version: 1,
					id: `sigil-action-${si.id}`,
					name: name,
					source: { type: "item", entryId: eq.id },
					kind:
						feat.damage || feat.resolution
							? feat.resolution
								? "save"
								: "damage"
							: "effect",
					description: feat.description || sigilData.effect_description,
					save: feat.resolution
						? {
								dc: parseInt(feat.resolution.match(/\d+/)?.[0] || "10", 10),
								ability: feat.resolution.toLowerCase().includes("str")
									? "STR"
									: feat.resolution.toLowerCase().includes("agi")
										? "AGI"
										: feat.resolution.toLowerCase().includes("con")
											? "VIT"
											: feat.resolution.toLowerCase().includes("int")
												? "INT"
												: feat.resolution.toLowerCase().includes("wis")
													? "SENSE"
													: "PRE",
							}
						: undefined,
					damage: feat.damage
						? {
								roll: feat.damage,
								type: feat.damage.split(" ").slice(1).join(" ") || "energy",
							}
						: undefined,
				},
				sourceId: eq.id,
			});
		});

		return result;
	}, [character, derivedStats, equipment, powers, techniques, sigils]);

	return {
		actions,
		isLoading,
	};
};
