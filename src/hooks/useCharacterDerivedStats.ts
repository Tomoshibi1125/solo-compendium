import { useMemo } from "react";

import { type ACBreakdown, calculateAC } from "@/hooks/useArmorClass";
import type { CharacterFeature } from "@/hooks/useCharacterFeatures";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import type { EquipmentRow } from "@/hooks/useEquipment";
import type { CharacterSigilInscriptionRow, SigilRow } from "@/hooks/useSigils";
import {
	type CalculatedStats,
	calculateCharacterStats,
} from "@/lib/characterCalculations";
import {
	type CharacterBaseData,
	computeEncumbrance,
	maintainConcentration,
} from "@/lib/characterEngine";
import { getActiveConditionEffects } from "@/lib/conditions";
import {
	type CustomModifier,
	resolveAdvantageFromCustomModifiers,
	sumCustomModifiers,
} from "@/lib/customModifiers";
import {
	calculateCarryingCapacity,
	calculateEncumbrance,
	calculateTotalWeight,
} from "@/lib/encumbrance";
import { applyEquipmentModifiers } from "@/lib/equipmentModifiers";
import { aggregateFeatAndStyleEffects } from "@/lib/featEffectParser";
import {
	applySigilBonuses,
	type SigilBonusResult,
} from "@/lib/sigilAutomation";
import {
	calculateSkillModifier,
	getAllSkills,
	type SkillDefinition,
} from "@/lib/skills";
import { getUnarmoredDefenseBaseAC } from "@/lib/unarmoredDefense";
import {
	ABILITY_NAMES,
	type AbilityScore,
	getAbilityModifier,
} from "@/types/core-rules";

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

interface EquipmentModifierResult {
	armorClass: number;
	speed: number;
	abilityModifiers: Record<string, number>;
	attackBonus: number;
	damageBonus: number;
	savingThrowBonuses: Record<string, number>;
	skillBonuses: Record<string, number>;
}

export type DerivedStats = {
	calculatedStats: CalculatedStats;
	skills: Record<
		string,
		{
			modifier: number;
			passive: number;
			ability: AbilityScore;
			proficient: boolean;
			expertise: boolean;
		}
	>;
	encumbranceValue: number;
	encumbranceMax: number;
	finalAbilities: Record<AbilityScore, number>;
	customAbilityBonuses: number;
	allSkills: SkillDefinition[];
	equipmentMods: EquipmentModifierResult;
	sigilBonuses: SigilBonusResult;
	finalSpeed: number;
	otherSpeeds: Record<string, number>;
	finalInitiative: number;
	initiativeAdvantage: "normal" | "advantage" | "disadvantage";
	baseStats: CalculatedStats;
	finalTraits: string[];
	// 100% Parity Data
	senses: {
		darkvision: number;
		blindsight: number;
		tremorsense: number;
		truesight: number;
	};
	senseStrings: string[];
	resistances: string[];
	immunities: string[];
	vulnerabilities: string[];
	conditionImmunities: string[];
	protocolEncumbrance: ReturnType<typeof computeEncumbrance>;
	protocolEncumbranceDetail: ReturnType<typeof calculateEncumbrance>;
	protocolConcentration: boolean;
	armorClassDetail: ACBreakdown;
	savingThrowsBreakdown: Record<
		AbilityScore,
		{ source: string; value: number }[]
	>;
	skillsBreakdown: Record<string, { source: string; value: number }[]>;
};

export function useCharacterDerivedStats(
	character: CharacterWithAbilities | null | undefined,
	equipment: EquipmentRow[],
	activeSigils: CharacterSigilInscriptionRow[],
	customModifiers: CustomModifier[],
	features: CharacterFeature[] = [],
) {
	return useMemo(() => {
		if (!character) return null;

		const virtualCustomModifiers: CustomModifier[] = [...customModifiers];
		const featNames = features
			.filter((f) => f.source === "feat")
			.map((f) => f.name);
		const fightingStyles = features
			.filter((f) => f.name.toLowerCase().includes("fighting style"))
			.map((f) => f.name.replace(/fighting style:\s*/i, "").trim());

		const featEffects = aggregateFeatAndStyleEffects(
			featNames,
			fightingStyles,
			character.level,
		);

		featEffects.forEach((fe, idx) => {
			let type: CustomModifier["type"] = "bonus";
			let target: string | null = fe.target.toLowerCase();
			if (fe.type === "advantage") type = "advantage";
			if (fe.type === "disadvantage") type = "disadvantage";

			if (target === "initiative") {
				type = "initiative_bonus";
				target = null;
			} else if (target === "speed") {
				type = "speed_bonus";
				target = null;
			} else if (target === "ac") {
				type = "ac_bonus";
				target = null;
			} else if (target === "saving_throws") {
				type = "save_bonus";
				target = "all";
			} else if (target === "hp_max") {
				type = "hp_max";
				target = null;
			} else if (
				ABILITY_KEYS.map((k) => k.toLowerCase()).includes(
					target as AbilityScore | string,
				)
			) {
				type = "ability_bonus";
				target = target.toUpperCase();
			}

			virtualCustomModifiers.push({
				id: `feat-${idx}`,
				type,
				target,
				value: fe.value,
				source: fe.source,
				enabled: true,
			});
		});

		const hasHalfProficiency = features.some(
			(f) =>
				f.name.toLowerCase().includes("jack of all trades") ||
				f.name.toLowerCase().includes("half-proficiency") ||
				f.name.toLowerCase().includes("half proficiency"),
		);

		const baseStats = calculateCharacterStats({
			level: character.level,
			abilities: character.abilities,
			savingThrowProficiencies: character.saving_throw_proficiencies || [],
			skillProficiencies: character.skill_proficiencies || [],
			skillExpertise: character.skill_expertise || [],
			armorClass: character.armor_class,
			speed: character.speed,
			hasHalfProficiency,
		});

		const equippedArmor = (equipment || []).some((item) => {
			const props = (item.properties || []).map((p: string) => p.toLowerCase());
			if (!item.is_equipped) return false;
			if (item.requires_attunement && !item.is_attuned) return false;
			return (
				props.includes("light") ||
				props.includes("medium") ||
				props.includes("heavy")
			);
		});

		const unarmoredDefenseBase = equippedArmor
			? null
			: getUnarmoredDefenseBaseAC(character.job, character.abilities);
		const baseACForEquipment = unarmoredDefenseBase ?? baseStats.armorClass;

		const equipmentMods = applyEquipmentModifiers(
			baseACForEquipment,
			character.speed,
			character.abilities,
			(equipment || []).map((item) => ({
				...item,
				properties: item.properties || undefined,
				is_equipped: item.is_equipped || false,
				is_attuned: item.is_attuned || false,
				requires_attunement: item.requires_attunement || false,
			})),
		);

		const equipmentModifiedAbilities = { ...character.abilities };
		Object.entries(equipmentMods.abilityModifiers || {}).forEach(
			([key, value]) => {
				if (value !== 0) {
					const ability =
						key.toUpperCase() as keyof typeof equipmentModifiedAbilities;
					if (ability in equipmentModifiedAbilities) {
						equipmentModifiedAbilities[ability] =
							(equipmentModifiedAbilities[ability] || 0) + (value as number);
					}
				}
			},
		);

		const equippedActiveSigils = (activeSigils || []).filter(
			(
				si,
			): si is CharacterSigilInscriptionRow & {
				sigil: SigilRow;
				equipment: EquipmentRow;
			} =>
				!!(
					si.sigil &&
					si.equipment?.is_equipped &&
					(!si.equipment.requires_attunement || si.equipment.is_attuned) &&
					si.is_active
				),
		);

		const sigilBonuses = applySigilBonuses(
			{
				ac: equipmentMods.armorClass,
				speed: equipmentMods.speed,
				abilities: equipmentModifiedAbilities,
				attackBonus: equipmentMods.attackBonus,
				damageBonus:
					typeof equipmentMods.damageBonus === "number"
						? equipmentMods.damageBonus > 0
							? `+${equipmentMods.damageBonus}`
							: ""
						: equipmentMods.damageBonus || "",
				traits: [],
			},
			equippedActiveSigils.map((si) => ({
				sigil: si.sigil,
				is_active: si.is_active,
			})),
		);

		const finalAbilities = { ...equipmentModifiedAbilities };
		Object.entries(sigilBonuses.abilities).forEach(([ability, value]) => {
			if (
				ability in finalAbilities &&
				value >
					(equipmentModifiedAbilities[
						ability as keyof typeof equipmentModifiedAbilities
					] || 0)
			) {
				finalAbilities[ability as keyof typeof finalAbilities] = value;
			}
		});

		const customAbilityBonuses = ABILITY_KEYS.reduce((acc, ability) => {
			const bonus = sumCustomModifiers(
				virtualCustomModifiers,
				"ability",
				ability,
			);
			const featureBonus = sumCustomModifiers(
				virtualCustomModifiers,
				"ability_bonus",
				ability,
			);
			return acc + bonus + featureBonus;
		}, 0);

		ABILITY_KEYS.forEach((ability) => {
			const bonus =
				sumCustomModifiers(virtualCustomModifiers, "ability", ability) +
				sumCustomModifiers(virtualCustomModifiers, "ability_bonus", ability);
			if (bonus !== 0) {
				finalAbilities[ability] = (finalAbilities[ability] || 0) + bonus;
			}
		});

		const initiativeAdvantage = resolveAdvantageFromCustomModifiers(
			virtualCustomModifiers,
			["initiative", "initiative_advantage"],
		);
		const initiativeBonus =
			sumCustomModifiers(virtualCustomModifiers, "initiative_bonus") +
			sumCustomModifiers(virtualCustomModifiers, "initiative");
		const finalInitiative =
			getAbilityModifier(finalAbilities.AGI) + initiativeBonus;

		const featureACBonus = sumCustomModifiers(
			virtualCustomModifiers,
			"ac_bonus",
		);
		const baseACValue = sumCustomModifiers(virtualCustomModifiers, "ac_base");
		let finalAC = baseStats.armorClass + featureACBonus;
		if (baseACValue > 0) {
			finalAC = Math.max(
				finalAC,
				baseACValue + getAbilityModifier(finalAbilities.AGI) + featureACBonus,
			);
		}

		const customSaveBonuses = ABILITY_KEYS.reduce(
			(acc, ability) => {
				acc[ability] =
					sumCustomModifiers(virtualCustomModifiers, "save", ability) +
					sumCustomModifiers(virtualCustomModifiers, "save_bonus", ability);
				return acc;
			},
			{} as Record<AbilityScore, number>,
		);

		const savingThrowsBreakdown: Record<
			AbilityScore,
			{ source: string; value: number }[]
		> = {} as Record<AbilityScore, { source: string; value: number }[]>;
		const finalSavingThrows: Record<AbilityScore, number> = {} as Record<
			AbilityScore,
			number
		>;

		ABILITY_KEYS.forEach((k) => {
			savingThrowsBreakdown[k] = [];
			finalSavingThrows[k] = 0;
		});

		ABILITY_KEYS.forEach((ability) => {
			const mod = getAbilityModifier(finalAbilities[ability]);
			const isProf = character.saving_throw_proficiencies?.includes(ability);
			const customBonus = customSaveBonuses[ability];

			const breakdown = [{ source: `${ability} Mod`, value: mod }];
			let total = mod;

			if (isProf) {
				breakdown.push({
					source: "Proficiency",
					value: baseStats.proficiencyBonus,
				});
				total += baseStats.proficiencyBonus;
			}
			if (customBonus !== 0) {
				breakdown.push({ source: "Custom Modifiers", value: customBonus });
				total += customBonus;
			}

			savingThrowsBreakdown[ability] = breakdown;
			finalSavingThrows[ability] = total;
		});

		const totalWeight = calculateTotalWeight(equipment);
		const carryingCapacity = calculateCarryingCapacity(finalAbilities.STR);
		const encumbrance = calculateEncumbrance(totalWeight, carryingCapacity);

		let finalSpeed = sigilBonuses.speed;
		if (encumbrance.status === "heavy") {
			finalSpeed = Math.max(0, finalSpeed - 10);
		} else if (encumbrance.status === "overloaded") {
			finalSpeed = Math.max(0, finalSpeed - 20);
		}

		const conditionEffects = getActiveConditionEffects(
			character.conditions || [],
		);
		if (conditionEffects.speedModifier === "zero") {
			finalSpeed = 0;
		} else if (typeof conditionEffects.speedModifier === "number") {
			finalSpeed = Math.max(0, finalSpeed + conditionEffects.speedModifier);
		}

		const customAcBonus = sumCustomModifiers(customModifiers, "ac");
		const customSpeedBonus = sumCustomModifiers(customModifiers, "speed");
		const customInitiativeBonus = sumCustomModifiers(
			customModifiers,
			"initiative",
		);
		const customHpMaxBonus = sumCustomModifiers(customModifiers, "hp-max");

		const calculatedStats = {
			...baseStats,
			initiative: baseStats.initiative + customInitiativeBonus,
			savingThrows: finalSavingThrows,
			armorClass: sigilBonuses.ac + customAcBonus,
			speed: Math.max(0, finalSpeed + customSpeedBonus),
			hpMax: Math.max(1, (character.hp_max ?? 1) + customHpMaxBonus),
			encumbrance,
		};

		// 100% Parity Data Extraction
		const senseStrings = character.senses || [];
		const resistances = character.resistances || [];
		const immunities = character.immunities || [];
		const vulnerabilities = character.vulnerabilities || [];
		const conditionImmunities = character.condition_immunities || [];

		const parseSense = (name: string): number => {
			const sense = senseStrings.find((s) =>
				s.toLowerCase().startsWith(name.toLowerCase()),
			);
			if (!sense) return 0;
			const match = sense.match(/\d+/);
			return match ? parseInt(match[0], 10) : 0;
		};

		const senses = {
			darkvision: parseSense("darkvision"),
			blindsight: parseSense("blindsight"),
			tremorsense: parseSense("tremorsense"),
			truesight: parseSense("truesight"),
		};

		// Multi-Speeds Extraction
		const otherSpeeds: Record<string, number> = {};
		(equipment || []).forEach((item) => {
			if (!item.is_equipped) return;
			(item.properties || []).forEach((prop) => {
				const lower = prop.toLowerCase();
				const flyMatch = lower.match(/fly\s+(\d+)ft/i);
				if (flyMatch)
					otherSpeeds.fly = Math.max(
						otherSpeeds.fly || 0,
						parseInt(flyMatch[1], 10),
					);
				const swimMatch = lower.match(/swim\s+(\d+)ft/i);
				if (swimMatch)
					otherSpeeds.swim = Math.max(
						otherSpeeds.swim || 0,
						parseInt(swimMatch[1], 10),
					);
				const climbMatch = lower.match(/climb\s+(\d+)ft/i);
				if (climbMatch)
					otherSpeeds.climb = Math.max(
						otherSpeeds.climb || 0,
						parseInt(climbMatch[1], 10),
					);
			});
		});

		// AC Breakdown Replacement using authoritative calculateAC
		const armorItem = (equipment || []).find(
			(e) =>
				e.is_equipped &&
				(!e.requires_attunement || e.is_attuned) &&
				(e.properties || []).some((p) =>
					["light", "medium", "heavy"].includes(p.toLowerCase()),
				),
		);
		const shieldItem = (equipment || []).find(
			(e) =>
				e.is_equipped &&
				(!e.requires_attunement || e.is_attuned) &&
				(e.properties || []).some((p) => p.toLowerCase() === "shield"),
		);

		const armorClassDetail = calculateAC(
			finalAbilities.AGI,
			armorItem
				? {
						name: armorItem.name,
						baseAC: parseInt(
							armorItem.properties
								?.find((p) => p.toLowerCase().startsWith("ac "))
								?.match(/\d+/)?.[0] || "10",
							10,
						),
						category:
							(armorItem.properties
								?.find((p) =>
									["light", "medium", "heavy"].includes(p.toLowerCase()),
								)
								?.toLowerCase() as "none" | "light" | "medium" | "heavy") ||
							"none",
						magicalBonus: armorItem.properties?.some((p) =>
							p.toLowerCase().includes("magic"),
						)
							? 1
							: 0, // heuristic
					}
				: null,
			shieldItem
				? {
						name: shieldItem.name,
						acBonus: 2, // Standard
					}
				: null,
			customAcBonus +
				sigilBonuses.ac -
				(sigilBonuses.ac === baseStats.armorClass
					? baseStats.armorClass
					: sigilBonuses.ac), // Re-derive bonuses
			finalAbilities.STR,
		);

		const encumbranceMax = Math.max(
			calculatedStats.encumbrance.carryingCapacity,
			1,
		);
		const encumbranceValue = Math.min(
			calculatedStats.encumbrance.totalWeight,
			encumbranceMax,
		);

		const skillsBreakdown: Record<string, { source: string; value: number }[]> =
			{};
		const allSkills: SkillDefinition[] = getAllSkills();
		const skills = allSkills.reduce<
			Record<
				string,
				{
					modifier: number;
					passive: number;
					ability: AbilityScore;
					proficient: boolean;
					expertise: boolean;
				}
			>
		>((acc, skill) => {
			const abilityMod = getAbilityModifier(finalAbilities[skill.ability]);
			const isProficient = (character.skill_proficiencies || []).includes(
				skill.name,
			);
			const hasExpertise = (character.skill_expertise || []).includes(
				skill.name,
			);

			const baseModifier = calculateSkillModifier(
				skill.name,
				finalAbilities,
				character.skill_proficiencies || [],
				character.skill_expertise || [],
				calculatedStats.proficiencyBonus,
				hasHalfProficiency,
			);
			const equipmentSkillBonus =
				(equipmentMods.skillBonuses?.[skill.name] || 0) +
				(equipmentMods.skillBonuses?.["*"] || 0);
			const customSkillBonus = sumCustomModifiers(
				customModifiers,
				"skill",
				skill.name,
			);

			const breakdown = [{ source: `${skill.ability} Mod`, value: abilityMod }];
			if (isProficient) {
				breakdown.push({
					source: "Proficiency",
					value: calculatedStats.proficiencyBonus,
				});
			} else if (hasHalfProficiency) {
				breakdown.push({
					source: "Half-Proficiency",
					value: Math.floor(calculatedStats.proficiencyBonus / 2),
				});
			}
			if (hasExpertise) {
				breakdown.push({
					source: "Expertise",
					value: calculatedStats.proficiencyBonus,
				});
			}
			if (equipmentSkillBonus !== 0) {
				breakdown.push({
					source: "Relic / Equipment",
					value: equipmentSkillBonus,
				});
			}
			if (customSkillBonus !== 0) {
				breakdown.push({ source: "Custom Modifiers", value: customSkillBonus });
			}
			skillsBreakdown[skill.name] = breakdown;

			const modifier = baseModifier + equipmentSkillBonus + customSkillBonus;
			acc[skill.name] = {
				modifier,
				passive: 10 + modifier,
				ability: skill.ability,
				proficient: isProficient,
				expertise: hasExpertise,
			};
			return acc;
		}, {});

		// System Protocol: Absolute Reification and Master Lattice Mapping
		const protocolData: CharacterBaseData = {
			id: character.id,
			name: character.name,
			level: character.level,
			jobs: character.job
				? [{ job: character.job, level: character.level, hitDie: 8 }]
				: [],
			abilities: character.abilities,
			savingThrowProficiencies: (character.saving_throw_proficiencies ||
				[]) as AbilityScore[],
			skillProficiencies: character.skill_proficiencies || [],
			skillExpertise: character.skill_expertise || [],
			hpCurrent: character.hp_current || 0,
			hpMax: character.hp_max || 0,
			hpTemp: character.hp_temp || 0,
			hitDiceCurrent: character.hit_dice_current || 0,
			hitDiceMax: character.hit_dice_max || 0,
			riftFavorCurrent: character.rift_favor_current || 0,
			baseSpeed: character.speed || 30,
			equippedItems: (equipment || []).map((item) => ({
				id: item.id,
				name: item.name,
				type:
					(item.item_type as
						| "armor"
						| "weapon"
						| "accessory"
						| "consumable"
						| "tool"
						| "other") || "other",
				isEquipped: !!item.is_equipped,
				weight: item.weight || 0,
			})),
			tattoos: [],
			activeConditions: [],
			activeSpells: [],
			features: [],
			exhaustionLevel: character.exhaustion_level || 0,
		};

		const protocolEncumbrance = computeEncumbrance(
			protocolData.abilities.STR,
			protocolData.equippedItems,
		);
		const protocolEncumbranceDetail = calculateEncumbrance(
			protocolEncumbrance.currentWeight,
			protocolEncumbrance.capacity,
		);
		const protocolConcentration = maintainConcentration(
			character.id,
			10,
			"Passive Protocol",
		);

		return {
			calculatedStats,
			skills,
			encumbranceValue,
			encumbranceMax,
			finalAbilities,
			customAbilityBonuses,
			allSkills,
			equipmentMods,
			sigilBonuses,
			finalSpeed: calculatedStats.speed,
			otherSpeeds,
			finalInitiative,
			initiativeAdvantage,
			baseStats,
			finalTraits: sigilBonuses.traits,
			senses,
			senseStrings,
			resistances,
			immunities,
			vulnerabilities,
			conditionImmunities,
			protocolEncumbrance,
			protocolEncumbranceDetail,
			protocolConcentration,
			armorClassDetail,
			savingThrowsBreakdown,
			skillsBreakdown,
		};
	}, [character, equipment, activeSigils, customModifiers, features]);
}
