import { useEffect, useMemo } from "react";
import { type ACBreakdown, calculateAC } from "@/hooks/useArmorClass";
import type { CanonicalEquipmentMap } from "@/hooks/useCanonicalEquipmentMap";
import { findCanonicalForRow } from "@/hooks/useCanonicalEquipmentMap";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import type { EquipmentRow } from "@/hooks/useEquipment";
import type { CharacterSigilInscriptionRow, SigilRow } from "@/hooks/useSigils";
import type { CharacterTattoo } from "@/hooks/useTattoos";
import {
	type CalculatedStats,
	calculateCharacterStats,
} from "@/lib/characterCalculations";
import { buildItemProperties } from "@/lib/characterCreation";
import {
	type CharacterBaseData,
	computeEncumbrance,
	type Effect,
	maintainConcentration,
} from "@/lib/characterEngine";
import { getActiveConditionEffects } from "@/lib/conditions";
import { type CustomModifier, sumCustomModifiers } from "@/lib/customModifiers";
import {
	calculateArmorClassStack,
	calculateInitiativeBreakdown,
	calculateSavingThrows,
	persistDerivedStats,
	resolveHpMax,
} from "@/lib/derivedStats";
import {
	calculateCarryingCapacity,
	calculateEncumbrance,
	calculateTotalWeight,
} from "@/lib/encumbrance";
import {
	applyEquipmentModifiers,
	inferArmorType,
} from "@/lib/equipmentModifiers";
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
import {
	bridgeRelicEffects,
	bridgeRuneEffects,
	bridgeSigilEffects,
	bridgeTattooEffects,
	type UnifiedEffectEntry,
} from "@/lib/unifiedEffectSystem";
import type { AbilityScore } from "@/types/core-rules";

const ABILITY_KEYS: AbilityScore[] = [
	"STR",
	"AGI",
	"VIT",
	"INT",
	"SENSE",
	"PRE",
];

const normalizeSkillName = (value: string): string =>
	value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

const hasSkill = (
	values: string[] | null | undefined,
	skillName: string,
): boolean => {
	const key = normalizeSkillName(skillName);
	return (values || []).some((value) => normalizeSkillName(value) === key);
};

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
	unifiedEffects: Effect[];
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
	runeKnowledge?: Array<{
		mastery_level?: number | null;
		rune?: UnifiedEffectEntry | null;
	}>;
	tattoos?: CharacterTattoo[];
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
	const runeKnowledge = options?.runeKnowledge ?? [];
	const tattoos = options?.tattoos ?? [];
	const memoized = useMemo(() => {
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
		const activeTattoos = tattoos.filter(
			(tattoo) =>
				tattoo.is_active && (!tattoo.requires_attunement || tattoo.is_attuned),
		);
		const unifiedEffects = [
			...(equipment || [])
				.filter(
					(item) =>
						item.is_equipped &&
						(!item.requires_attunement || item.is_attuned) &&
						!!canonicalEquipmentMap,
				)
				.flatMap((item) => {
					const canonical = findCanonicalForRow(
						canonicalEquipmentMap ?? new Map(),
						item.name,
					);
					if (!canonical) return [];
					return bridgeRelicEffects({
						...(canonical as UnifiedEffectEntry),
						properties: getEquipmentProperties(item),
					});
				}),
			...equippedActiveSigils.flatMap((si) =>
				bridgeSigilEffects(si.sigil as unknown as UnifiedEffectEntry),
			),
			...runeKnowledge
				.filter((entry) => (entry.mastery_level ?? 0) >= 5 && entry.rune)
				.flatMap((entry) =>
					bridgeRuneEffects(entry.rune as UnifiedEffectEntry),
				),
			...activeTattoos.flatMap((tattoo) =>
				bridgeTattooEffects({
					...((tattoo.tattoo ?? {}) as UnifiedEffectEntry),
					id: tattoo.tattoo_id ?? tattoo.id,
					name: tattoo.name,
					description: tattoo.tattoo?.description ?? tattoo.notes,
					effects: tattoo.custom_effects ?? tattoo.tattoo?.effects,
				}),
			),
		];

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

		// hp_max_override (set by Warden intervention or homebrew) wins over
		// the engine-computed value. resolveHpMax returns hp_max_override
		// when present, otherwise the cached hp_max column.
		const resolvedHpMax = resolveHpMax(
			character as { hp_max?: number | null; hp_max_override?: number | null },
		);

		const calculatedStats = {
			...baseStats,
			initiative: initiativeBreakdown.calculatedStatsInitiative,
			savingThrows: finalSavingThrows,
			armorClass: armorClassStack.displayedArmorClass,
			speed: Math.max(0, finalSpeed + customSpeedBonus),
			hpMax: Math.max(1, resolvedHpMax + customHpMaxBonus),
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

		// A2/A3: Extract the actual magical enhancement bonus (+1/+2/+3) from
		// an equipped item rather than assuming a flat +1. Reads a `+N` token
		// from the item name or its properties, plus an explicit canonical
		// magic_bonus field when present. Returns 0 for non-magical gear.
		const extractMagicBonus = (
			item: EquipmentRow | undefined,
			canonical?: ReturnType<typeof findCanonicalForRow> | null,
		): number => {
			if (!item) return 0;
			// Explicit canonical field wins when available.
			const canonBonus = (
				canonical as { magic_bonus?: number | null } | null | undefined
			)?.magic_bonus;
			if (typeof canonBonus === "number" && canonBonus > 0) return canonBonus;
			// Parse "+N" from the name (e.g. "Plate Armor +2", "Shield +1").
			const fromName = item.name?.match(/\+(\d+)/)?.[1];
			if (fromName) return parseInt(fromName, 10);
			// Parse "+N" from any property string.
			const fromProps = getEquipmentProperties(item)
				.map((p) => p.match(/\+(\d+)/)?.[1])
				.find(Boolean);
			return fromProps ? parseInt(fromProps, 10) : 0;
		};

		const extractArmorCategory = (): "none" | "light" | "medium" | "heavy" => {
			// P1.6: Use the canonical inferArmorType helper so the AC
			// engine, equipment step, and proficiency warnings all read
			// from a single classifier. Canonical compendium armor_type
			// takes precedence; falls back to row property parsing.
			const fromCanonical = inferArmorType(canonicalArmor?.armor_type);
			if (
				fromCanonical &&
				(fromCanonical === "light" ||
					fromCanonical === "medium" ||
					fromCanonical === "heavy")
			) {
				return fromCanonical;
			}
			const fromProps = armorItem
				? inferArmorType(getEquipmentProperties(armorItem))
				: null;
			if (
				fromProps &&
				(fromProps === "light" ||
					fromProps === "medium" ||
					fromProps === "heavy")
			) {
				return fromProps;
			}
			return "none";
		};

		// Misc AC bonus = feature stacking (custom modifiers like Cloak of
		// Protection +1) + sigil delta over baseline. Routed in as
		// otherBonuses so the canonical AC engine takes "highest of all
		// valid formulas + flat bonuses" — matching DDB's behavior.
		const sigilACDelta = Math.max(0, sigilBonuses.ac - baseStats.armorClass);
		const miscACBonusForCanonical =
			armorClassStack.customAcBonus +
			armorClassStack.featureACBonus +
			sigilACDelta;

		const armorClassDetail = calculateAC(
			finalAbilities.AGI,
			armorItem
				? {
						name: armorItem.name,
						baseAC: extractArmorBaseAC(),
						category: extractArmorCategory(),
						// A2: real enhancement bonus (+1/+2/+3), not a flat +1.
						magicalBonus: extractMagicBonus(armorItem, canonicalArmor),
						stealthDisadvantage:
							canonicalArmor?.stealth_disadvantage ?? undefined,
						strengthRequirement:
							canonicalArmor?.strength_requirement ?? undefined,
					}
				: null,
			shieldItem
				? {
						name: shieldItem.name,
						// A3: base +2 plus any magical shield enhancement.
						acBonus:
							2 +
							extractMagicBonus(
								shieldItem,
								canonicalEquipmentMap
									? findCanonicalForRow(canonicalEquipmentMap, shieldItem.name)
									: null,
							),
					}
				: null,
			miscACBonusForCanonical,
			finalAbilities.STR,
			{
				// Enable canonical multi-formula path (Berserker/Striker
				// Unarmored Defense, Mage Armor) by passing job + full
				// ability scores. acFormulas.ts:calculateBestAC picks the
				// highest eligible formula automatically.
				job: character.job ?? null,
				abilities: finalAbilities,
				// Mage Armor active state: contributed via the active spells
				// system as a customModifier; passing false here defers to
				// the misc-bonus path. Future enhancement: thread the
				// activeSpells boolean through the hook signature.
				mageArmorActive: false,
			},
		);

		// Canonical AC: overwrite the legacy armorClassStack value with
		// the multi-formula result so the displayed AC matches the
		// breakdown shown in the tooltip. This is the single source of
		// truth — DDB's "evaluate all valid formulas, take highest" model.
		calculatedStats.armorClass = armorClassDetail.total;

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
				proficient: hasSkill(character.skill_proficiencies, skill.name),
				expertise: hasSkill(character.skill_expertise, skill.name),
			};
			return acc;
		}, {});

		// System Protocol: Absolute Reification and Master Lattice Mapping
		const protocolData: CharacterBaseData = {
			id: character.id,
			name: character.name,
			level: character.level,
			jobs: character.job
				? [
						{
							job: character.job,
							level: character.level,
							// A1: use the character's real hit die (Destroyer d12,
							// Mage d6, etc.) instead of a hardcoded d8.
							hitDie: character.hit_dice_size || 8,
						},
					]
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
			tattoos: activeTattoos.map((tattoo) => ({
				id: tattoo.id,
				name: tattoo.name,
				isActive: tattoo.is_active,
				bodyPart: tattoo.body_part ?? "Unknown",
				requiresAttunement: tattoo.requires_attunement,
				isAttuned: tattoo.is_attuned,
				effects: bridgeTattooEffects({
					...((tattoo.tattoo ?? {}) as UnifiedEffectEntry),
					id: tattoo.tattoo_id ?? tattoo.id,
					name: tattoo.name,
					description: tattoo.tattoo?.description ?? tattoo.notes,
					effects: tattoo.custom_effects ?? tattoo.tattoo?.effects,
				}),
			})),
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
			unifiedEffects,
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
		runeKnowledge,
		tattoos,
	]);

	// ─── P0.2: Denormalized cache write-through ─────────────────────
	// Whenever the engine output changes, persist the derived snapshot
	// back to the `characters` row so external readers (VTT token sync,
	// party dashboard, API consumers) see fresh values without re-running
	// the engine. Best-effort — see persistDerivedStats JSDoc.
	const characterId = character?.id ?? null;
	const cacheAC = memoized?.calculatedStats.armorClass ?? null;
	const cacheSpeed = memoized?.finalSpeed ?? null;
	const cacheInitiative = memoized?.finalInitiative ?? null;
	const cacheHpMax = memoized?.calculatedStats.hpMax ?? null;

	useEffect(() => {
		if (
			!characterId ||
			cacheAC === null ||
			cacheSpeed === null ||
			cacheInitiative === null ||
			cacheHpMax === null
		) {
			return;
		}
		void persistDerivedStats(characterId, {
			armorClass: cacheAC,
			speed: cacheSpeed,
			initiative: cacheInitiative,
			hpMax: cacheHpMax,
		});
	}, [characterId, cacheAC, cacheSpeed, cacheInitiative, cacheHpMax]);

	return memoized;
}
