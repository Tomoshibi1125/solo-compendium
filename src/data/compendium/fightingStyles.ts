// RA Fighting Style Catalog
// Additive + overlap-trimmed per the DDB parity plan (§2f).
// Recipients: Destroyer (L1), Holy Knight (L2), Stalker (L2).
// - 5 kept D&D classics that still fit RA as-is.
// - 6 RA-native styles tied to RA-specific gear properties (firearms, burst-fire,
//   striker gauntlets, Anomaly creature tag, elemental damage types).
// Archery dropped in favor of Gunslinger. Natural Explorer dropped in favor of
// Anomaly Hunter + Stalker's existing Favored Terrain class feature.

export type FightingStyleSource = "dnd-baseline" | "ra-native";

export interface FightingStyle {
	id: string;
	name: string;
	description: string;
	source: FightingStyleSource;
	// Optional: job-proficiency prerequisites (e.g. shield proficiency for
	// Protection). Satisfied if the chooser's job armorProficiencies contains
	// the listed string, or if unspecified.
	prerequisites?: string[];
	// Optional: structured modifier hooks used by the character engine. These
	// are authoritative for numeric/mechanical effects so the prose description
	// never drifts from what actually applies in play.
	modifiers?: {
		// Attack bonus applied to weapons matching a property/tag.
		attackBonus?: { value: number; propertyTag: string };
		// AC bonus applied while wearing any armor.
		acBonusInArmor?: number;
		// Flat damage bonus for a one-handed melee weapon with no off-hand weapon.
		oneHandedMeleeNoOffhandDamage?: number;
		// Flat damage bonus added once per turn on hit vs specified creature tag.
		perTurnDamageBonusVsTag?: { tag: string; value: number };
		// Flat damage bonus added on hit with a weapon whose damage type is in list.
		damageBonusByDamageType?: { types: string[]; value: number };
		// Off-hand attack adds ability modifier (Two-Weapon Fighting).
		offhandAddsAbilityMod?: boolean;
		// Reroll 1s and 2s on damage dice for 2H/versatile-2H melee.
		rerollLowOnTwoHanded?: boolean;
		// Special opt-in flags consumed by the engine for the more exotic styles.
		flags?: Array<
			| "gunslinger-ignore-close-range-penalty"
			| "suppressive-fire-on-miss"
			| "burst-fire-bonus-die"
			| "striker-stance"
			| "protection-reaction"
		>;
		// Damage die to add once per turn on hit with a burst-fire weapon.
		burstFireBonusDie?: string;
		// Base die for unarmed strikes while using Striker Stance.
		strikerStanceUnarmedDie?: string;
	};
}

export const FIGHTING_STYLES: FightingStyle[] = [
	// --- Kept D&D classics ----------------------------------------------------
	{
		id: "defense",
		name: "Defense",
		description:
			"While you are wearing armor, you gain a +1 bonus to AC. Applies to light, medium, and heavy armor — including RA's gate-forged carapace plating.",
		source: "dnd-baseline",
		modifiers: { acBonusInArmor: 1 },
	},
	{
		id: "dueling",
		name: "Dueling",
		description:
			"When you are wielding a melee weapon in one hand and no other weapon, you gain a +2 bonus to damage rolls with that weapon. Shields are allowed.",
		source: "dnd-baseline",
		modifiers: { oneHandedMeleeNoOffhandDamage: 2 },
	},
	{
		id: "great-weapon-fighting",
		name: "Great Weapon Fighting",
		description:
			"When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll. The weapon must have the two-handed or versatile property.",
		source: "dnd-baseline",
		modifiers: { rerollLowOnTwoHanded: true },
	},
	{
		id: "protection",
		name: "Protection",
		description:
			"When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.",
		source: "dnd-baseline",
		prerequisites: ["Shields"],
		modifiers: { flags: ["protection-reaction"] },
	},
	{
		id: "two-weapon-fighting",
		name: "Two-Weapon Fighting",
		description:
			"When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.",
		source: "dnd-baseline",
		modifiers: { offhandAddsAbilityMod: true },
	},

	// --- RA-native additions --------------------------------------------------
	{
		id: "gunslinger",
		name: "Gunslinger",
		description:
			"You gain a +2 bonus to attack rolls made with firearms (weapons with the `firearm` property). You also ignore the magnum-frame `-1 within 5 ft.` close-range penalty on any firearm you wield.",
		source: "ra-native",
		modifiers: {
			attackBonus: { value: 2, propertyTag: "firearm" },
			flags: ["gunslinger-ignore-close-range-penalty"],
		},
	},
	{
		id: "suppressive-fire",
		name: "Suppressive Fire",
		description:
			"When you miss with a firearm attack on your turn, the target has disadvantage on the first attack roll it makes before the start of your next turn. This fits naturally with `suppressed` and `silent` firearms — your volume of fire pins the target regardless of whether a round connects.",
		source: "ra-native",
		modifiers: { flags: ["suppressive-fire-on-miss"] },
	},
	{
		id: "burst-discipline",
		name: "Burst Discipline",
		description:
			"Once per turn, when you hit with an attack using a weapon that has the `burst-fire` property, you deal an extra 1d6 damage of the weapon's damage type. You do not expend additional ammunition for this bonus.",
		source: "ra-native",
		modifiers: {
			flags: ["burst-fire-bonus-die"],
			burstFireBonusDie: "1d6",
		},
	},
	{
		id: "anomaly-hunter",
		name: "Anomaly Hunter",
		description:
			"You gain a +1 bonus to attack and damage rolls against creatures with the Anomaly tag. Per the Ascendant Bureau's canonical threat taxonomy, this covers gate-spawn, void-remnants, and dimension-bleed entities.",
		source: "ra-native",
		modifiers: {
			perTurnDamageBonusVsTag: { tag: "Anomaly", value: 1 },
			attackBonus: { value: 1, propertyTag: "__vs-anomaly__" },
		},
	},
	{
		id: "lattice-infused-striking",
		name: "Lattice-Infused Striking",
		description:
			"When you hit with a weapon whose damage type is force, radiant, necrotic, psychic, fire, cold, lightning, thunder, or void, you deal an extra 1 damage of the weapon's damage type. Works naturally with RA's elemental-typed gear — Mana-Infused Warhammers, Obsidian Daggers, Starlight Halberds, and similar.",
		source: "ra-native",
		modifiers: {
			damageBonusByDamageType: {
				types: [
					"force",
					"radiant",
					"necrotic",
					"psychic",
					"fire",
					"cold",
					"lightning",
					"thunder",
					"void",
				],
				value: 1,
			},
		},
	},
	{
		id: "striker-stance",
		name: "Striker Stance",
		description:
			"Your unarmed strikes use your Agility or Vitality modifier (your choice) for attack and damage rolls, and deal 1d4 bludgeoning damage (1d6 if you have no weapon or shield in any hand). Weapons with the `striker` property count as finesse for you. Works with Obsidian Gauntlets, Shattered Gauntlets, Starlight Gauntlets, and other Striker-property gear.",
		source: "ra-native",
		modifiers: {
			flags: ["striker-stance"],
			strikerStanceUnarmedDie: "1d4",
		},
	},
];

// Convenience lookup helpers.
export function getFightingStyleById(id: string): FightingStyle | undefined {
	return FIGHTING_STYLES.find((s) => s.id === id);
}

export function getAllFightingStyleIds(): string[] {
	return FIGHTING_STYLES.map((s) => s.id);
}

// Returns the subset available to a job given its proficiencies. Protection is
// gated on shield proficiency; everything else is unconditional.
export function getFightingStylesForJob(
	armorProficiencies: string[] | undefined,
): FightingStyle[] {
	const hasShield = Boolean(
		armorProficiencies?.some((p) => p.toLowerCase().includes("shield")),
	);
	return FIGHTING_STYLES.filter((s) => {
		if (!s.prerequisites || s.prerequisites.length === 0) return true;
		if (s.prerequisites.includes("Shields")) return hasShield;
		return true;
	});
}

// One-time migration helper: map a legacy Stalker Fighting Style selection
// (from the old "Archery / Defense / Dueling / Two-Weapon Fighting / Natural
// Explorer" list) onto the new catalog. Unknown legacy ids are returned as-is
// for the UI to prompt the user for a fresh selection.
export function migrateLegacyFightingStyleId(legacyId: string): string {
	const key = legacyId.toLowerCase().replace(/[\s_]+/g, "-");
	if (key === "archery") return "gunslinger";
	if (key === "natural-explorer") return "anomaly-hunter";
	return key;
}
