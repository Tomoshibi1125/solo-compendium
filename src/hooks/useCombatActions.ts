import { useMemo } from "react";
import { useCharacterFeatures } from "@/hooks/useCharacterFeatures";
import { useCharacterSheetState } from "@/hooks/useCharacterSheetState";
import {
	type CharacterWithAbilities,
	useCharacters,
} from "@/hooks/useCharacters";
import { useEquipment } from "@/hooks/useEquipment";
import { useMergedCustomModifiers } from "@/hooks/useMergedCustomModifiers";
import { usePowers } from "@/hooks/usePowers";
import { useCharacterRuneKnowledge } from "@/hooks/useRunes";
import { useSigils } from "@/hooks/useSigils";
import { useSpells } from "@/hooks/useSpells";
import { useTattoos } from "@/hooks/useTattoos";
import { useTechniques } from "@/hooks/useTechniques";
import type { ActionResolutionPayload } from "@/lib/actionResolution";
import { scaleCantripDamage } from "@/lib/cantripScaling";
import { getProficiencyBonus } from "@/lib/characterCalculations";
import { buildItemProperties } from "@/lib/characterCreation";
import { sumCustomModifiers } from "@/lib/customModifiers";
import {
	appendAbilityModifierToDamageFormula,
	buildAttackRollFormula,
	formatSignedNumber,
	resolvePowerActionFormula,
} from "@/lib/powerActionFormulas";
import {
	isActionableActionType,
	isSovereignAbilityUnlocked,
	isSovereignFeatureSource,
} from "@/lib/sovereign/applySovereign";
import { resolveSpellActionFormula } from "@/lib/spellActionFormulas";
import { resolveWeaponActionFormula } from "@/lib/weaponActionFormulas";
import {
	findAmmunitionRow,
	getStrikerMartialArtsDie,
	getVersatileDamageDice,
	pickLargerDamageDice,
	weaponRequiresAmmunition,
} from "@/lib/weaponAutomation";
import { isWeaponProficient } from "@/lib/weaponProficiency";
import type { CompendiumPower, CompendiumTechnique } from "@/types/compendium";
import { type AbilityScore, getAbilityModifier } from "@/types/core-rules";
import {
	findCanonicalForRow,
	useCanonicalEquipmentMap,
} from "./useCanonicalEquipmentMap";
import { useCharacterDerivedStats } from "./useCharacterDerivedStats";

type JsonMechanics = Record<string, unknown>;

/**
 * D5 — Brutal Critical extra weapon dice on a crit, by job + level.
 * Berserker/Destroyer (RA Barbarian analogs) gain +1 die at L9, +2 at
 * L13, +3 at L17. Other jobs get 0. Returns the extra die count layered
 * on top of the standard crit doubling.
 */
function getBrutalCriticalDice(
	job: string | null | undefined,
	level: number,
): number {
	const j = (job ?? "").trim().toLowerCase();
	if (j !== "berserker" && j !== "destroyer") return 0;
	if (level >= 17) return 3;
	if (level >= 13) return 2;
	if (level >= 9) return 1;
	return 0;
}

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
	formulaAbility?: AbilityScore;
	formulaAbilityModifier?: number;
	attackRoll?: string;
	resourceCost?: string;
	resourceCurrent?: number;
	resourceMax?: number;
	/** Ammunition drawn per attack (DDB parity) — 1 spent per attack roll. */
	ammo?: { equipmentId: string; name: string; remaining: number };
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
	const { spells, isLoading: spellsLoading } = useSpells(characterId);
	const { techniques, isLoading: techniquesLoading } =
		useTechniques(characterId);
	const { map: canonicalEquipmentMap } = useCanonicalEquipmentMap(characterId);

	const { data: sigils, isLoading: sigilsLoading } = useSigils(
		characterId || "",
	);
	const { data: runeKnowledge = [] } = useCharacterRuneKnowledge(characterId);
	const { tattoos, isLoading: tattoosLoading } = useTattoos(characterId);
	const { state: sheetState } = useCharacterSheetState(characterId);
	const { data: charFeatures = [] } = useCharacterFeatures(characterId);

	// Merged sheet + feature + guild + active-spell modifiers — MUST match the
	// list the character page model feeds its derived stats, or action-card
	// numbers (spell attack/DC, weapon bonuses) drift from the sheet's.
	const customModifiers = useMergedCustomModifiers(
		characterId,
		sheetState.customModifiers,
		character?.level ?? 1,
	);

	const derivedStats = useCharacterDerivedStats(
		character,
		equipment || [],

		sigils || [],
		customModifiers,
		canonicalEquipmentMap,
		{ runeKnowledge, tattoos },
	);

	const isLoading =
		equipmentLoading ||
		powersLoading ||
		spellsLoading ||
		techniquesLoading ||
		sigilsLoading ||
		tattoosLoading;

	const actions = useMemo(() => {
		if (!character || !derivedStats) return [];

		const profBonus = getProficiencyBonus(character.level);
		const result: CombatAction[] = [];

		// Custom modifiers (merged sheet + feature + guild + active-spell) that
		// apply to every weapon attack/damage. Per-target custom modifiers
		// (e.g. "+1 to Stealth") are handled by the derived-stats pipeline, not
		// here. Both `attack`/`damage` and the `attack_bonus`/`damage_bonus`
		// aliases are summed for parity with how custom modifiers are entered
		// on the sheet UI.
		const customWeaponAttackBonus =
			sumCustomModifiers(customModifiers, "attack") +
			sumCustomModifiers(customModifiers, "attack_bonus");
		const customWeaponDamageBonus =
			sumCustomModifiers(customModifiers, "damage") +
			sumCustomModifiers(customModifiers, "damage_bonus");

		// Helper: Check proficiency (plural-tolerant name + category matching;
		// see weaponProficiency.ts for the SRD semantics and the plural gotcha).
		const isProficient = (item: {
			name: string;
			properties?: string[] | null;
		}) => isWeaponProficient(character.weapon_proficiencies, item);

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
		const weapons = (equipment || []).filter((e) => {
			if (!e.is_equipped) return false;
			if (e.item_type === "weapon") return true;
			const canonical = findCanonicalForRow(canonicalEquipmentMap, e.name);
			const canonicalType = (
				canonical?.item_type ||
				canonical?.equipment_type ||
				""
			).toLowerCase();
			if (canonicalType === "weapon") return true;
			const canonicalProps = canonical
				? buildItemProperties(
						canonical as unknown as Parameters<typeof buildItemProperties>[0],
					)
				: [];
			const props = [
				...((e.properties as string[]) || []),
				...canonicalProps,
			].map((p) => p.toLowerCase());
			return props.some((p) =>
				["simple", "martial", "weapon"].some((tag) => p.includes(tag)),
			);
		});

		// D5: Brutal Critical — Berserker/Destroyer add extra weapon dice on a
		// crit, scaling by level (L9 +1, L13 +2, L17 +3), mirroring the
		// Barbarian feature. Surfaced on the attack payload as critExtraDice
		// so actionResolution rolls the extra dice only on a natural 20.
		const brutalCritDice = getBrutalCriticalDice(
			character.job,
			character.level ?? 1,
		);

		// Monk parity: the Striker job scales unarmed strikes and
		// `striker`-property weapons with a martial-arts die; the Striker Stance
		// fighting style only grants its written flat 1d4/1d6 + finesse
		// treatment, never the scaling.
		const isStrikerJob =
			(character.job ?? "").trim().toLowerCase() === "striker";
		const martialArtsDie = getStrikerMartialArtsDie(character.level ?? 1);
		const hasStrikerStance = charFeatures.some((f) =>
			(f.name ?? "").toLowerCase().includes("striker stance"),
		);

		weapons.forEach((w) => {
			const canonical = findCanonicalForRow(canonicalEquipmentMap, w.name);
			const canonicalProps = canonical
				? buildItemProperties(
						canonical as unknown as Parameters<typeof buildItemProperties>[0],
					)
				: [];
			const rowProps = (w.properties as string[]) || [];
			const props = [...rowProps, ...canonicalProps].map((p) =>
				p.toLowerCase(),
			);
			// `striker`-property weapons count as finesse for the Striker job and
			// Striker Stance holders; only the Striker job scales their die.
			const isStrikerWeapon = props.includes("striker");
			const isFinesse =
				props.includes("finesse") ||
				(isStrikerWeapon && (isStrikerJob || hasStrikerStance));
			const weaponType = canonical?.weapon_type?.toLowerCase() ?? "";
			const isRanged =
				props.some((p) => p.includes("ranged")) ||
				weaponType === "ranged" ||
				weaponType.includes("ranged");

			const hasProf = isProficient({ name: w.name, properties: props });

			// Prefer canonical damage formula; fall back to description-regex parse.
			const canonicalDamage =
				typeof canonical?.damage === "string"
					? canonical.damage
					: typeof canonical?.damage === "number"
						? String(canonical.damage)
						: null;
			const baseDamageDice =
				canonicalDamage?.match(/(\d+d\d+)/)?.[1] ??
				w.description?.match(/(\d+d\d+)/)?.[1] ??
				null;
			// Monk weapon rule: a Striker swaps in the martial-arts die when it
			// beats the weapon's own die.
			const damageDice =
				isStrikerJob && isStrikerWeapon
					? pickLargerDamageDice(baseDamageDice, martialArtsDie)
					: baseDamageDice;
			// `sigilBonuses` is seeded from `equipmentMods` upstream, so it already
			// folds equipment + sigil contributions. Custom-modifier attack/damage
			// bonuses are added here so sheet-level adjustments reach weapon rolls.
			const totalAttackBonus =
				derivedStats.sigilBonuses.attackBonus + customWeaponAttackBonus;
			const sigilDamageBonus = derivedStats.sigilBonuses.damageBonus;
			const totalDamageBonus =
				typeof sigilDamageBonus === "string" && sigilDamageBonus.length > 0
					? customWeaponDamageBonus !== 0
						? `${sigilDamageBonus}${customWeaponDamageBonus > 0 ? "+" : ""}${customWeaponDamageBonus}`
						: sigilDamageBonus
					: customWeaponDamageBonus;
			const formula = resolveWeaponActionFormula({
				abilities: derivedStats.finalAbilities,
				proficiencyBonus: profBonus,
				proficient: hasProf,
				isRanged,
				isFinesse,
				damageDice,
				attackBonus: totalAttackBonus,
				damageBonus: totalDamageBonus,
			});

			const damageType =
				canonical?.damage_type?.toLowerCase() || detectDamageType(w);
			const canonicalRange =
				typeof canonical?.range === "string" && canonical.range.length > 0
					? canonical.range
					: null;
			const range = canonicalRange ?? parseRange(w);

			// DDB parity: ammunition-property weapons draw from a matching ammo
			// inventory row; each attack roll spends 1 (see ActionsList).
			const ammoMatch = weaponRequiresAmmunition(props)
				? findAmmunitionRow(w.name, equipment || [])
				: null;
			const ammo = ammoMatch
				? {
						equipmentId: ammoMatch.id,
						name: ammoMatch.name,
						remaining: ammoMatch.remaining,
					}
				: undefined;

			result.push({
				id: `weapon-${w.id}`,
				name: w.name,
				type: "weapon",
				description: w.description || "",
				activation: "1 action",
				range,
				target: "One creature",
				attackBonus: formula.attackBonus,
				damageRoll: formula.damageRoll,
				damageType,
				formulaAbility: formula.ability,
				formulaAbilityModifier: formula.abilityModifier,
				attackRoll: formula.attackRoll,
				ammo,
				equipmentId: w.id,
				payload: {
					version: 1,
					id: `weapon-${w.id}`,
					name: w.name,
					source: { type: "item", entryId: w.id },
					kind: "attack",
					attack: {
						roll: formula.attackRoll,
						...(brutalCritDice > 0 ? { critExtraDice: brutalCritDice } : {}),
					},
					damage: { roll: formula.damageRoll, type: damageType },
				},
				sourceId: w.id,
			});

			// DDB parity: versatile weapons expose a two-handed damage variant
			// (bare "versatile" property in the catalog → standard die step-up).
			const versatileDice = getVersatileDamageDice(props, damageDice);
			if (versatileDice && !isRanged) {
				const twoHanded = resolveWeaponActionFormula({
					abilities: derivedStats.finalAbilities,
					proficiencyBonus: profBonus,
					proficient: hasProf,
					isRanged,
					isFinesse,
					damageDice: versatileDice,
					attackBonus: totalAttackBonus,
					damageBonus: totalDamageBonus,
				});
				result.push({
					id: `weapon-${w.id}-2h`,
					name: `${w.name} (Two-Handed)`,
					type: "weapon",
					description:
						`${w.description || ""}\nWielded in both hands (versatile).`.trim(),
					activation: "1 action",
					range,
					target: "One creature",
					attackBonus: twoHanded.attackBonus,
					damageRoll: twoHanded.damageRoll,
					damageType,
					formulaAbility: twoHanded.ability,
					formulaAbilityModifier: twoHanded.abilityModifier,
					attackRoll: twoHanded.attackRoll,
					equipmentId: w.id,
					payload: {
						version: 1,
						id: `weapon-${w.id}-2h`,
						name: `${w.name} (Two-Handed)`,
						source: { type: "item", entryId: w.id },
						kind: "attack",
						attack: {
							roll: twoHanded.attackRoll,
							...(brutalCritDice > 0 ? { critExtraDice: brutalCritDice } : {}),
						},
						damage: { roll: twoHanded.damageRoll, type: damageType },
					},
					sourceId: w.id,
				});
			}
		});

		// DDB parity: every character always has an Unarmed Strike attack.
		// 5e RAW: proficient, STR-based, flat 1 + STR bludgeoning. The Striker
		// job upgrades it to the scaling martial-arts die on the better of
		// STR/AGI; Striker Stance holders get the style's written flat die
		// (1d4, or 1d6 with no weapon or shield in hand) on AGI or VIT.
		// Equipment/sigil weapon bonuses deliberately do not reach bare fists;
		// sheet-level custom attack/damage modifiers do.
		{
			const shieldEquipped = (equipment || []).some(
				(e) =>
					e.is_equipped &&
					((e.item_type ?? "").toLowerCase() === "shield" ||
						e.name.toLowerCase().includes("shield")),
			);
			const handsFree = weapons.length === 0 && !shieldEquipped;

			let unarmedAbility: AbilityScore;
			let unarmedAbilityModifier: number;
			let unarmedDamageRoll: string;
			let unarmedNote: string;

			if (isStrikerJob) {
				const formula = resolveWeaponActionFormula({
					abilities: derivedStats.finalAbilities,
					proficiencyBonus: profBonus,
					proficient: true,
					isRanged: false,
					isFinesse: true,
					damageDice: martialArtsDie,
					attackBonus: customWeaponAttackBonus,
					damageBonus: customWeaponDamageBonus,
				});
				unarmedAbility = formula.ability;
				unarmedAbilityModifier = formula.abilityModifier;
				unarmedDamageRoll = formula.damageRoll;
				unarmedNote = `Martial-arts die (${martialArtsDie}) scales with Striker level.`;
			} else if (hasStrikerStance) {
				const agi = getAbilityModifier(derivedStats.finalAbilities.AGI);
				const vit = getAbilityModifier(derivedStats.finalAbilities.VIT);
				unarmedAbility = vit > agi ? "VIT" : "AGI";
				unarmedAbilityModifier = Math.max(agi, vit);
				unarmedDamageRoll = `${handsFree ? "1d6" : "1d4"}${formatSignedNumber(
					unarmedAbilityModifier + customWeaponDamageBonus,
				)}`;
				unarmedNote =
					"Striker Stance: AGI or VIT; 1d4 (1d6 with no weapon or shield in hand).";
			} else {
				const str = getAbilityModifier(derivedStats.finalAbilities.STR);
				unarmedAbility = "STR";
				unarmedAbilityModifier = str;
				unarmedDamageRoll = String(
					Math.max(0, 1 + str + customWeaponDamageBonus),
				);
				unarmedNote = "1 + STR bludgeoning.";
			}

			const unarmedAttackBonus =
				unarmedAbilityModifier + profBonus + customWeaponAttackBonus;
			const unarmedAttackRoll = buildAttackRollFormula(unarmedAttackBonus);
			// Force-Laced Strikes (Striker L6): unarmed strikes count as magical
			// and deal force damage instead of bludgeoning.
			const unarmedDamageType =
				isStrikerJob && (character.level ?? 1) >= 6 ? "force" : "bludgeoning";

			result.push({
				id: "unarmed-strike",
				name: "Unarmed Strike",
				type: "weapon",
				description: `A punch, kick, elbow, or knee. ${unarmedNote}`,
				activation: "1 action",
				range: "5 ft",
				target: "One creature",
				attackBonus: unarmedAttackBonus,
				damageRoll: unarmedDamageRoll,
				damageType: unarmedDamageType,
				formulaAbility: unarmedAbility,
				formulaAbilityModifier: unarmedAbilityModifier,
				attackRoll: unarmedAttackRoll,
				payload: {
					version: 1,
					id: "unarmed-strike",
					name: "Unarmed Strike",
					source: { type: "item", entryId: "unarmed-strike" },
					kind: "attack",
					attack: { roll: unarmedAttackRoll },
					damage: { roll: unarmedDamageRoll, type: unarmedDamageType },
				},
				sourceId: "unarmed-strike",
			});
		}

		// Sheet-level custom modifiers that apply to every spell/power action.
		const customPowerAttackBonus =
			sumCustomModifiers(customModifiers, "attack") +
			sumCustomModifiers(customModifiers, "attack_bonus");
		const customPowerDcBonus = sumCustomModifiers(
			customModifiers,
			"save_bonus",
		);

		// 2. Spell/Power Actions
		(powers || []).forEach((p) => {
			const powerData = p.power as unknown as CompendiumPower;
			if (!powerData) return;

			const powerFormula = resolvePowerActionFormula({
				job: character.job,
				abilities: derivedStats.finalAbilities,
				proficiencyBonus: profBonus,
				attackBonus: customPowerAttackBonus,
				dcBonus: customPowerDcBonus,
			});
			const attackBonus = powerFormula.attackBonus;
			const saveDC = powerFormula.saveDC;

			const mechanics = (powerData.mechanics as unknown as JsonMechanics) || {};
			const target = powerData.target || (mechanics.target as string) || "";
			const damageRoll = appendAbilityModifierToDamageFormula(
				powerData.damage_roll,
				powerFormula.abilityModifier,
			);
			const powerKind = powerData.has_attack_roll
				? "attack"
				: powerData.has_save
					? "save"
					: powerData.damage_roll
						? "damage"
						: "effect";

			result.push({
				id: `power-${p.id}`,
				name: p.name,
				type: powerData.power_type === "Spell" ? "spell" : "power",
				description: p.description || powerData.description || "",
				activation: powerData.activation_time || p.casting_time || "1 action",
				range:
					typeof p.range === "string"
						? p.range
						: typeof powerData.range === "string"
							? powerData.range
							: "Self",
				target: target,
				attackBonus: powerData.has_attack_roll ? attackBonus : undefined,
				saveDC: powerData.has_save ? saveDC : undefined,
				saveAbility: (powerData.save_ability as AbilityScore) || undefined,
				damageRoll,
				damageType: powerData.damage_type || undefined,
				formulaAbility: powerFormula.ability,
				formulaAbilityModifier: powerFormula.abilityModifier,
				attackRoll: powerFormula.attackRoll,
				payload: {
					version: 1,
					id: `power-${p.id}`,
					name: p.name,
					source: {
						type: powerData.power_type === "Spell" ? "spell" : "power",
						entryId: p.id,
					},
					kind: powerKind,
					attack: powerData.has_attack_roll
						? { roll: powerFormula.attackRoll }
						: undefined,
					save: powerData.has_save
						? {
								ability: powerData.save_ability as AbilityScore,
								dc: saveDC,
							}
						: undefined,
					damage: powerData.damage_roll
						? {
								roll: damageRoll ?? powerData.damage_roll,
								type: powerData.damage_type || undefined,
							}
						: undefined,
				},
				sourceId: p.id,
				equipmentId: p.id,
			});
		});

		(spells || []).forEach((s) => {
			const spellData = s.spell as unknown as CompendiumPower | undefined;
			if (!spellData) return;

			// Spells use the canonical spellcasting ability map (per Job),
			// NOT the Job's primary ability. See `spellActionFormulas.ts`
			// and the design note in `powerActionFormulas.ts:9-23`.
			const spellFormula = resolveSpellActionFormula({
				job: character.job,
				abilities: derivedStats.finalAbilities,
				level: character.level ?? 1,
				attackBonus: customPowerAttackBonus,
				dcBonus: customPowerDcBonus,
			});
			const mechanics = (spellData.mechanics as unknown as JsonMechanics) || {};
			const target = spellData.target || (mechanics.target as string) || "";
			// P1.4: Cantrip damage scales by CHARACTER level at L5/11/17.
			// Apply scaling BEFORE appending the ability modifier so a base
			// "1d10" cantrip becomes "2d10 +3" at level 5 with INT 16,
			// matching DDB exactly. Non-cantrips (power_level > 0) pass
			// through unchanged here — upcast scaling is handled separately.
			// CompendiumPower stores level in `power_level`; character row
			// may also carry `spell_level` for legacy reasons.
			const spellLevelRaw =
				(spellData as { power_level?: number }).power_level ??
				(s as unknown as { spell_level?: number }).spell_level ??
				0;
			const isCantrip = spellLevelRaw === 0;
			const baseDamageFormula = isCantrip
				? scaleCantripDamage(spellData.damage_roll ?? "", character.level ?? 1)
				: spellData.damage_roll;
			const damageRoll = appendAbilityModifierToDamageFormula(
				baseDamageFormula,
				spellFormula.abilityModifier,
			);
			const spellKind = spellData.has_attack_roll
				? "attack"
				: spellData.has_save
					? "save"
					: spellData.damage_roll
						? "damage"
						: "effect";

			result.push({
				id: `spell-${s.id}`,
				name: s.name,
				type: "spell",
				description: s.description || spellData.description || "",
				activation: spellData.activation_time || s.casting_time || "1 action",
				range:
					typeof s.range === "string"
						? s.range
						: typeof spellData.range === "string"
							? spellData.range
							: "Self",
				target,
				attackBonus: spellData.has_attack_roll
					? spellFormula.attackBonus
					: undefined,
				saveDC: spellData.has_save ? spellFormula.saveDC : undefined,
				saveAbility: (spellData.save_ability as AbilityScore) || undefined,
				damageRoll,
				damageType: spellData.damage_type || undefined,
				formulaAbility: spellFormula.ability ?? undefined,
				formulaAbilityModifier: spellFormula.abilityModifier,
				attackRoll: spellFormula.attackRoll,
				payload: {
					version: 1,
					id: `spell-${s.id}`,
					name: s.name,
					source: { type: "spell", entryId: s.id },
					kind: spellKind,
					attack: spellData.has_attack_roll
						? { roll: spellFormula.attackRoll }
						: undefined,
					save: spellData.has_save
						? {
								ability: spellData.save_ability as AbilityScore,
								dc: spellFormula.saveDC,
							}
						: undefined,
					damage: spellData.damage_roll
						? {
								roll: damageRoll ?? spellData.damage_roll,
								type: spellData.damage_type || undefined,
							}
						: undefined,
				},
				sourceId: s.id,
			});
		});

		// 3. Technique Actions
		(techniques || []).forEach((t) => {
			const techData = t.technique as unknown as CompendiumTechnique;
			if (!techData) return;

			// F3 (per-class governing ability): techniques use the job's canonical
			// primary ability — the same map powers use via resolvePowerActionFormula
			// (getJobPrimaryAbility) — not a shared STR/AGI heuristic. A technique
			// that names its own save ability still overrides saveAbility below.
			const techniqueFormula = resolvePowerActionFormula({
				job: character.job,
				abilities: derivedStats.finalAbilities,
				proficiencyBonus: profBonus,
				dcBonus: customPowerDcBonus,
			});
			const techniqueAbility: AbilityScore = techniqueFormula.ability;
			const abiMod = techniqueFormula.abilityModifier;
			const saveDC = techniqueFormula.saveDC;

			const mechanics = (techData.mechanics as unknown as JsonMechanics) || {};
			const attackMechanics =
				mechanics.attack &&
				typeof mechanics.attack === "object" &&
				!Array.isArray(mechanics.attack)
					? (mechanics.attack as JsonMechanics)
					: {};
			const attackDamage =
				attackMechanics.damage &&
				typeof attackMechanics.damage === "object" &&
				!Array.isArray(attackMechanics.damage)
					? (attackMechanics.damage as JsonMechanics)
					: {};
			const savingThrow =
				mechanics.saving_throw &&
				typeof mechanics.saving_throw === "object" &&
				!Array.isArray(mechanics.saving_throw)
					? (mechanics.saving_throw as JsonMechanics)
					: {};
			const saveAbility = (
				typeof mechanics.save_ability === "string"
					? mechanics.save_ability
					: typeof savingThrow.ability === "string"
						? savingThrow.ability
						: undefined
			) as AbilityScore | undefined;
			const rawDamageRoll =
				typeof mechanics.damage_roll === "string"
					? mechanics.damage_roll
					: typeof attackMechanics.damage === "string"
						? attackMechanics.damage
						: typeof attackDamage.dice === "string"
							? attackDamage.dice
							: typeof mechanics.damage_profile === "string"
								? mechanics.damage_profile
								: undefined;
			const damageRoll = appendAbilityModifierToDamageFormula(
				rawDamageRoll,
				abiMod,
			);
			const damageType =
				(typeof mechanics.damage_type === "string"
					? mechanics.damage_type
					: typeof attackMechanics.damage_type === "string"
						? attackMechanics.damage_type
						: typeof attackDamage.type === "string"
							? attackDamage.type
							: "physical") || "physical";
			const techniqueKind = saveAbility
				? "save"
				: rawDamageRoll
					? "damage"
					: "effect";

			result.push({
				id: `tech-${t.id}`,
				name: techData.name,
				type: "technique",
				description: techData.description || "",
				activation:
					typeof techData.activation === "string"
						? techData.activation
						: techData.activation?.type || "1 action",
				range:
					typeof techData.range === "string"
						? techData.range
						: techData.range?.type
							? `${techData.range.type} ${techData.range.distance || ""}`.trim()
							: "5 ft",
				target: (mechanics.target as string) || "",
				saveDC: saveAbility ? saveDC : undefined,
				saveAbility,
				damageRoll,
				damageType,
				formulaAbility: techniqueAbility,
				formulaAbilityModifier: abiMod,
				payload: {
					version: 1,
					id: `tech-${t.id}`,
					name: techData.name,
					source: { type: "technique", entryId: t.id },
					kind: techniqueKind,
					save: saveAbility ? { dc: saveDC, ability: saveAbility } : undefined,
					damage: rawDamageRoll
						? {
								roll: damageRoll ?? rawDamageRoll,
								type: damageType,
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

			const rawFeature = sigilData.active_feature;
			const feat: ActiveFeature =
				typeof rawFeature === "object" && rawFeature !== null
					? (rawFeature as ActiveFeature)
					: {};
			// Parse string active_feature: "Name: description (uses)"
			const featureStr = typeof rawFeature === "string" ? rawFeature : "";
			const colonIdx = featureStr.indexOf(":");
			const parsedName =
				colonIdx > 0 ? featureStr.slice(0, colonIdx).trim() : "";
			const parsedDesc =
				colonIdx > 0 ? featureStr.slice(colonIdx + 1).trim() : featureStr;
			const usesMatch = featureStr.match(/\((\d+)\/(short|long)\s*rest\)/i);
			const parsedUses = usesMatch ? parseInt(usesMatch[1], 10) : undefined;
			const parsedAction = featureStr.toLowerCase().includes("bonus action")
				? "1 bonus action"
				: featureStr.toLowerCase().includes("reaction")
					? "1 reaction"
					: "1 action";

			const name = feat.name || parsedName || sigilData.name;
			const sourceName = eq.name;

			result.push({
				id: `sigil-action-${si.id}`,
				name: `${name} (${sourceName})`,
				type: "item-sigil",
				description:
					feat.description || parsedDesc || sigilData.effect_description,
				activation: feat.action_type || parsedAction,
				range: feat.range || "Self",
				target: feat.target || "One creature",
				resourceCurrent: eq.charges_current ?? feat.uses_max ?? parsedUses,
				resourceMax: eq.charges_max ?? feat.uses_max ?? parsedUses,
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
					description:
						feat.description || parsedDesc || sigilData.effect_description,
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

		// Sovereign fusion abilities: surface the ACTIVE ones (those that cost
		// an action / bonus / reaction) as combat actions, mirroring how the
		// same character_features rows appear in the Features tab. Passive
		// abilities remain in Features only. Applies identically to embedded
		// and externally-imported Sovereigns.
		for (const feat of charFeatures) {
			if (!feat.is_active) continue;
			if (!isSovereignFeatureSource(feat.source)) continue;
			if (!isActionableActionType(feat.action_type)) continue;
			// All 8 fusion rows persist from lock-in; only the ones the
			// character has grown into are usable actions.
			if (!isSovereignAbilityUnlocked(feat.level_acquired, character.level))
				continue;
			result.push({
				id: `sovereign-feat-${feat.id}`,
				name: feat.name,
				type: "power",
				description: feat.description || "",
				activation: feat.action_type || "1 action",
				range: "Self",
				target: "",
				payload: {
					version: 1,
					id: `sovereign-feat-${feat.id}`,
					name: feat.name,
					source: { type: "power", entryId: feat.id },
					kind: "effect",
					description: feat.description || undefined,
				},
				sourceId: feat.id,
			});
		}

		return result;
	}, [
		character,
		derivedStats,
		equipment,
		powers,
		spells,
		techniques,
		sigils,
		canonicalEquipmentMap,
		customModifiers,
		charFeatures,
	]);

	return {
		actions,
		isLoading,
	};
};
