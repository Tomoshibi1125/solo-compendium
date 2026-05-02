import { useMemo } from "react";
import { type ACBreakdown, calculateAC } from "@/hooks/useArmorClass";
import type { CanonicalEquipmentMap } from "@/hooks/useCanonicalEquipmentMap";
import { findCanonicalForRow } from "@/hooks/useCanonicalEquipmentMap";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import type { EquipmentRow } from "@/hooks/useEquipment";
import type { CharacterSigilInscriptionRow, SigilRow } from "@/hooks/useSigils";
import {
	type CalculatedStats,
	calculateCharacterStats,
} from "@/lib/characterCalculations";
import { buildItemProperties } from "@/lib/characterCreation";
import {
	type CharacterBaseData,
	computeEncumbrance,
	maintainConcentration,
} from "@/lib/characterEngine";
import { getActiveConditionEffects } from "@/lib/conditions";
import { type CustomModifier, sumCustomModifiers } from "@/lib/customModifiers";
import {
	calculateArmorClassStack,
	calculateInitiativeBreakdown,
	calculateSavingThrows,
} from "@/lib/derivedStats";
import {
	calculateCarryingCapacity,
	calculateEncumbrance,
	calculateTotalWeight,
} from "@/lib/encumbrance";
import { applyEquipmentModifiers } from "@/lib/equipmentModifiers";
import { computeAttacksPerAction } from "@/lib/featEffectParser";
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
import { ABILITY_NAMES, type AbilityScore } from "@/types/core-rules";

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

interface EquipmentModifierResult {
	armorClass: number;
	speed: number;
	abilityModifiers: Record<string, number>;
	attackBonus: number;
	damageBonus: number;
	savingThrowBonuses: Record<string, number>;
	skillBonuses: Record<string, number>;
	resistances: string[];
	immunities: string[];
	vulnerabilities: string[];
	conditionImmunities: string[];
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
	/** D&D Beyond parity: number of attacks granted per Attack action. */
	attacksPerAction: number;
};

interface UseCharacterDerivedStatsOptions {
	/** Whether the character has any feature/feat that grants Extra Attack. */
	hasExtraAttackFeature?: boolean;
	/** Active regent IDs (Steel/Titan grant bonus attacks). */
	regentIds?: string[];
}

export function useCharacterDerivedStats(
	character: CharacterWithAbilities | null | undefined,
	equipment: EquipmentRow[],

	activeSigils: CharacterSigilInscriptionRow[],
	customModifiers: CustomModifier[],
	canonicalEquipmentMap?: CanonicalEquipmentMap,
	options?: UseCharacterDerivedStatsOptions,
) {
	const hasExtraAttackFeature = options?.hasExtraAttackFeature ?? false;
	const regentIds = options?.regentIds ?? [];
	return useMemo(() => {
		if (!character) return null;

		const baseStats = calculateCharacterStats({
			level: character.level,
			abilities: character.abilities,
			savingThrowProficiencies: character.saving_throw_proficiencies || [],
			skillProficiencies: character.skill_proficiencies || [],
			skillExpertise: character.skill_expertise || [],
			armorClass: character.armor_class,
			speed: character.speed,
		});

		const getEquipmentProperties = (item: EquipmentRow): string[] => {
			const rowProperties = (item.properties || []).filter(
				(prop): prop is string => typeof prop === "string",
			);
			const canonical = canonicalEquipmentMap
				? findCanonicalForRow(canonicalEquipmentMap, item.name)
				: null;
			const canonicalProperties = canonical
				? buildItemProperties(
						canonical as unknown as Parameters<typeof buildItemProperties>[0],
					)
				: [];
			return Array.from(
				new Map(
					[...rowProperties, ...canonicalProperties].map(
						(prop) => [prop.toLowerCase(), prop] as const,
					),
				).values(),
			);
		};

		const equippedArmor = (equipment || []).some((item) => {
			const props = getEquipmentProperties(item).map((p) => p.toLowerCase());
			if (!item.is_equipped) return false;
			if (item.requires_attunement && !item.is_attuned) return false;
			return (
				props.some((p) => p.includes("light")) ||
				props.some((p) => p.includes("medium")) ||
				props.some((p) => p.includes("heavy"))
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
				properties: getEquipmentProperties(item),
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
			const bonus = sumCustomModifiers(customModifiers, "ability", ability);
			const featureBonus = sumCustomModifiers(
				customModifiers,
				"ability_bonus",
				ability,
			);
			return acc + bonus + featureBonus;
		}, 0);

		ABILITY_KEYS.forEach((ability) => {
			const bonus =
				sumCustomModifiers(customModifiers, "ability", ability) +
				sumCustomModifiers(customModifiers, "ability_bonus", ability);
			if (bonus !== 0) {
				finalAbilities[ability] = (finalAbilities[ability] || 0) + bonus;
			}
		});

		const initiativeBreakdown = calculateInitiativeBreakdown({
			agilityScore: finalAbilities.AGI,
			baseInitiative: baseStats.initiative,
			customModifiers,
		});
		const armorClassStack = calculateArmorClassStack({
			baseArmorClass: baseStats.armorClass,
			agilityScore: finalAbilities.AGI,
			sigilArmorClass: sigilBonuses.ac,
			customModifiers,
		});
		const finalSavingThrows = calculateSavingThrows({
			abilities: finalAbilities,
			savingThrowProficiencies: character.saving_throw_proficiencies,
			proficiencyBonus: baseStats.proficiencyBonus,
			customModifiers,
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

		const customSpeedBonus = sumCustomModifiers(customModifiers, "speed");
		const customHpMaxBonus = sumCustomModifiers(customModifiers, "hp-max");

		const calculatedStats = {
			...baseStats,
			initiative: initiativeBreakdown.calculatedStatsInitiative,
			savingThrows: finalSavingThrows,
			armorClass: armorClassStack.displayedArmorClass,
			speed: Math.max(0, finalSpeed + customSpeedBonus),
			hpMax: Math.max(1, (character.hp_max ?? 1) + customHpMaxBonus),
			encumbrance,
		};

		// 100% Parity Data Extraction
		const senseStrings = character.senses || [];
		const resistances = Array.from(
			new Set([...(character.resistances || []), ...equipmentMods.resistances]),
		);
		const immunities = Array.from(
			new Set([...(character.immunities || []), ...equipmentMods.immunities]),
		);
		const vulnerabilities = Array.from(
			new Set([
				...(character.vulnerabilities || []),
				...equipmentMods.vulnerabilities,
			]),
		);
		const conditionImmunities = Array.from(
			new Set([
				...(character.condition_immunities || []),
				...equipmentMods.conditionImmunities,
			]),
		);

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
			getEquipmentProperties(item).forEach((prop) => {
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

		// AC Breakdown Replacement using authoritative calculateAC.
		// Prefer canonical compendium fields (armor_type, armor_class) when the
		// row name matches a canonical entry — falls back to row-property regex
		// parsing for homebrew/freeform items.
		const isArmorRow = (e: EquipmentRow): boolean => {
			if (e.item_type === "armor") return true;
			const rowProps = getEquipmentProperties(e).map((p) => p.toLowerCase());
			if (
				rowProps.some((p) =>
					["light", "medium", "heavy"].some((tag) => p.includes(tag)),
				)
			)
				return true;
			if (canonicalEquipmentMap) {
				const canonical = findCanonicalForRow(canonicalEquipmentMap, e.name);
				const canonItemType = canonical?.item_type?.toLowerCase();
				if (canonItemType === "armor") return true;
				const canonArmorType = canonical?.armor_type?.toLowerCase();
				if (
					canonArmorType &&
					["light", "medium", "heavy"].includes(canonArmorType)
				)
					return true;
			}
			return false;
		};

		const armorItem = (equipment || []).find(
			(e) =>
				e.is_equipped &&
				(!e.requires_attunement || e.is_attuned) &&
				isArmorRow(e),
		);
		const shieldItem = (equipment || []).find((e) => {
			if (!e.is_equipped) return false;
			if (e.requires_attunement && !e.is_attuned) return false;
			const rowProps = getEquipmentProperties(e).map((p) => p.toLowerCase());
			if (rowProps.some((p) => p.includes("shield"))) return true;
			if (canonicalEquipmentMap) {
				const canonical = findCanonicalForRow(canonicalEquipmentMap, e.name);
				const canonItemType = canonical?.item_type?.toLowerCase();
				if (canonItemType === "shield") return true;
			}
			return false;
		});

		const canonicalArmor = armorItem
			? findCanonicalForRow(canonicalEquipmentMap ?? new Map(), armorItem.name)
			: null;

		/** Extract a numeric AC from canonical formula text or row properties. */
		const extractArmorBaseAC = (): number => {
			if (canonicalArmor) {
				const raw = canonicalArmor.armor_class;
				if (typeof raw === "number") return raw;
				if (typeof raw === "string") {
					const m = raw.match(/\d+/);
					if (m) return parseInt(m[0], 10);
				}
			}
			const fromRow = armorItem
				? getEquipmentProperties(armorItem)
						.find((p) => p.toLowerCase().startsWith("ac "))
						?.match(/\d+/)?.[0]
				: undefined;
			return fromRow ? parseInt(fromRow, 10) : 10;
		};

		const extractArmorCategory = (): "none" | "light" | "medium" | "heavy" => {
			const canonCategory = canonicalArmor?.armor_type?.toLowerCase();
			if (
				canonCategory &&
				["light", "medium", "heavy"].includes(canonCategory)
			) {
				return canonCategory as "light" | "medium" | "heavy";
			}
			const rowCategory = armorItem
				? getEquipmentProperties(armorItem)
						.find((p) =>
							["light", "medium", "heavy"].some((tag) =>
								p.toLowerCase().includes(tag),
							),
						)
						?.toLowerCase()
				: undefined;
			return (rowCategory as "light" | "medium" | "heavy") ?? "none";
		};

		const armorClassDetail = calculateAC(
			finalAbilities.AGI,
			armorItem
				? {
						name: armorItem.name,
						baseAC: extractArmorBaseAC(),
						category: extractArmorCategory(),
						magicalBonus: getEquipmentProperties(armorItem).some((p) =>
							p.toLowerCase().includes("magic"),
						)
							? 1
							: 0, // heuristic
						stealthDisadvantage:
							canonicalArmor?.stealth_disadvantage ?? undefined,
						strengthRequirement:
							canonicalArmor?.strength_requirement ?? undefined,
					}
				: null,
			shieldItem
				? {
						name: shieldItem.name,
						acBonus: 2, // Standard
					}
				: null,
			armorClassStack.customAcBonus +
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
			const baseModifier = calculateSkillModifier(
				skill.name,
				finalAbilities,
				character.skill_proficiencies || [],
				character.skill_expertise || [],
				calculatedStats.proficiencyBonus,
			);
			const equipmentSkillBonus =
				(equipmentMods.skillBonuses?.[skill.name] || 0) +
				(equipmentMods.skillBonuses?.["*"] || 0);
			const customSkillBonus = sumCustomModifiers(
				customModifiers,
				"skill",
				skill.name,
			);
			const modifier = baseModifier + equipmentSkillBonus + customSkillBonus;
			acc[skill.name] = {
				modifier,
				passive: 10 + modifier,
				ability: skill.ability,
				proficient: (character.skill_proficiencies || []).includes(skill.name),
				expertise: (character.skill_expertise || []).includes(skill.name),
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

		// D&D Beyond / Foundry parity: number of attacks per Attack action,
		// computed from Job + level + Regents + Extra-Attack features.
		const attacksPerAction = computeAttacksPerAction(
			character.job ?? null,
			character.level ?? 1,
			regentIds,
			hasExtraAttackFeature,
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
			finalInitiative: initiativeBreakdown.finalInitiative,
			initiativeAdvantage: initiativeBreakdown.advantage,
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
			attacksPerAction,
		};
	}, [
		character,
		equipment,
		activeSigils,
		customModifiers,
		canonicalEquipmentMap,
		hasExtraAttackFeature,
		regentIds,
	]);
}
