import { useEffect, useMemo } from "react";
import { calculateAC } from "@/hooks/useArmorClass";
import type { CanonicalEquipmentMap } from "@/hooks/useCanonicalEquipmentMap";
import { findCanonicalForRow } from "@/hooks/useCanonicalEquipmentMap";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import type { EquipmentRow } from "@/hooks/useEquipment";
import type { CharacterSigilInscriptionRow, SigilRow } from "@/hooks/useSigils";
import type { CharacterTattoo } from "@/hooks/useTattoos";
import { calculateCharacterStats } from "@/lib/characterCalculations";
import { buildItemProperties } from "@/lib/characterCreation";
import {
	type CharacterBaseData,
	computeEncumbrance,
	maintainConcentration,
} from "@/lib/characterEngine";
import {
	applyExhaustionToHpMax,
	getExhaustionSpeedMultiplier,
} from "@/lib/conditionEffects";
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
	isWornArmorRow,
} from "@/lib/equipmentModifiers";
import { computeAttacksPerAction } from "@/lib/featEffectParser";
import {
	computeGestaltSummary,
	getRegentHpContribution,
} from "@/lib/regentGestalt";
import {
	extractSensesFromProperties,
	type SpecialSense,
} from "@/lib/sensesEngine";
import { applySigilBonuses } from "@/lib/sigilAutomation";
import {
	calculateSkillModifier,
	getAllSkills,
	normalizeSkillName,
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

const hasSkill = (
	values: string[] | null | undefined,
	skillName: string,
): boolean => {
	const key = normalizeSkillName(skillName);
	return (values || []).some((value) => normalizeSkillName(value) === key);
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

		// Gestalt Regent overlay: a Regent is a full class overlay (not a
		// subclass). Resolve unlocked regent ids → rich class data and union
		// their proficiencies/saves into the base computation. Regent level ==
		// character level (gestalt), so features/profs reflect the full overlay.
		const gestalt = computeGestaltSummary(regentIds, character.level);

		const baseStats = calculateCharacterStats({
			level: character.level,
			abilities: character.abilities,
			savingThrowProficiencies: character.saving_throw_proficiencies || [],
			skillProficiencies: character.skill_proficiencies || [],
			skillExpertise: character.skill_expertise || [],
			armorClass: character.armor_class,
			speed: character.speed,
			gestaltSavingThrowProficiencies: gestalt.proficiencies.savingThrows,
			gestaltSkillProficiencies: gestalt.proficiencies.skills,
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

		// "light"/"heavy" are weapon properties too — classification must go
		// through isWornArmorRow or an equipped Sickle/dagger reads as armor
		// and suppresses unarmored defense (Jul 18 audit).
		const equippedArmor = (equipment || []).some((item) => {
			if (!item.is_equipped) return false;
			if (item.requires_attunement && !item.is_attuned) return false;
			return isWornArmorRow({
				item_type: item.item_type,
				properties: getEquipmentProperties(item),
			});
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

		// Gestalt Regent overlay HP: the Regent's hit die is ADDITIVE on top of
		// the base Job HP (Solo-Leveling power spike), applied reactively so it
		// is retroactive the instant a Regent is unlocked. The stored hp_max
		// stays Job-only — no migration, no double count. hp_max_override (if
		// set) is treated as an explicit final value and is NOT augmented.
		const hasHpOverride =
			typeof (character as { hp_max_override?: number | null })
				.hp_max_override === "number";
		const regentHpBonus = hasHpOverride
			? 0
			: getRegentHpContribution(
					gestalt.regentHitDieContribution,
					character.level,
				);

		// Exhaustion (PHB p.291): speed halved at level 2+, zero at 5+, and HP
		// maximum halved at 4+. These rules existed only inside the retired
		// engine, so the sheet never applied them — while the exhaustion badge
		// already told the player "Speed halved" (Jul 19 audit). Applied last so
		// the penalty lands on the fully-adjusted values, and kept separate from
		// the condition speed block above so nothing is halved twice.
		const exhaustionLevel = character.exhaustion_level || 0;
		const speedBeforeExhaustion = Math.max(0, finalSpeed + customSpeedBonus);
		const hpMaxBeforeExhaustion = Math.max(
			1,
			resolvedHpMax + customHpMaxBonus + regentHpBonus,
		);

		const calculatedStats = {
			...baseStats,
			initiative: initiativeBreakdown.calculatedStatsInitiative,
			savingThrows: finalSavingThrows,
			armorClass: armorClassStack.displayedArmorClass,
			speed: Math.floor(
				speedBeforeExhaustion * getExhaustionSpeedMultiplier(exhaustionLevel),
			),
			hpMax: applyExhaustionToHpMax(hpMaxBeforeExhaustion, exhaustionLevel),
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

		// Gear-granted senses (a relic with "darkvision 60 ft" in its
		// properties) union with the persisted job/racial senses, longest range
		// winning. This previously ran only inside the retired engine, so an
		// item granting a sense contributed nothing to the sheet.
		const equipmentSenses = extractSensesFromProperties(
			(equipment || [])
				.filter(
					(item) =>
						item.is_equipped && (!item.requires_attunement || item.is_attuned),
				)
				.map((item) => ({ properties: getEquipmentProperties(item) })),
		);
		const senseRange = (name: SpecialSense): number =>
			Math.max(parseSense(name), equipmentSenses[name] ?? 0);

		const senses = {
			darkvision: senseRange("darkvision"),
			blindsight: senseRange("blindsight"),
			tremorsense: senseRange("tremorsense"),
			truesight: senseRange("truesight"),
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
			// Weapon-typed rows can never be worn armor — "light"/"heavy" are
			// weapon properties, so token matching alone misclassifies them
			// (the Jul 18 Sickle bug: UD jobs lost their AC formula).
			if (e.item_type === "weapon") return false;
			if (
				isWornArmorRow({
					item_type: e.item_type,
					properties: getEquipmentProperties(e),
				})
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
			options?: { ignoreProperties?: boolean },
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
			// Parse "+N" from any property string — except for shields, whose
			// rows carry a baseline "+2 AC" property written at creation; that
			// baseline is already the shield's acBonus, not an enhancement.
			if (options?.ignoreProperties) return 0;
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
		// Sigil AC delta over the exact value applySigilBonuses was seeded
		// with (equipmentMods.armorClass). Measuring against the unarmored
		// baseStats.armorClass instead would leak the armor's own AC into the
		// misc bonus (chain mail 16 vs base 11 → phantom +5).
		const sigilACDelta = Math.max(
			0,
			sigilBonuses.ac - equipmentMods.armorClass,
		);
		const miscACBonusForCanonical =
			armorClassStack.customAcBonus +
			armorClassStack.featureACBonus +
			// Defense fighting style: +N AC only while wearing armor.
			(armorItem
				? sumCustomModifiers(customModifiers, "ac_bonus_in_armor")
				: 0) +
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
						// A3: base +2 plus any magical shield enhancement (from the
						// name or canonical magic_bonus; the row's own "+2 AC"
						// property is the baseline, not an enhancement).
						acBonus:
							2 +
							extractMagicBonus(
								shieldItem,
								canonicalEquipmentMap
									? findCanonicalForRow(canonicalEquipmentMap, shieldItem.name)
									: null,
								{ ignoreProperties: true },
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
	// back to the `characters` row so external readers (party dashboard,
	// API consumers) see fresh values without re-running
	// the engine. Best-effort — see persistDerivedStats JSDoc.
	const characterId = character?.id ?? null;
	const cacheAC = memoized?.calculatedStats.armorClass ?? null;
	const cacheSpeed = memoized?.finalSpeed ?? null;
	const cacheInitiative = memoized?.finalInitiative ?? null;

	useEffect(() => {
		if (
			!characterId ||
			cacheAC === null ||
			cacheSpeed === null ||
			cacheInitiative === null
		) {
			return;
		}
		// NOTE: hp_max is deliberately NOT cached here — it is authoritative-
		// stored (rolled HP preserved, maintained additively by level-up) and is
		// read back as the base by the engine. Persisting the display value
		// (base + gestalt + custom) would re-feed those bonuses on refetch →
		// runaway HP inflation. See persistDerivedStats / getEffectiveHpMax.
		void persistDerivedStats(characterId, {
			armorClass: cacheAC,
			speed: cacheSpeed,
			initiative: cacheInitiative,
		});
	}, [characterId, cacheAC, cacheSpeed, cacheInitiative]);

	return memoized;
}
