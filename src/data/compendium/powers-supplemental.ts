import type { CompendiumPower } from "../../types/compendium";

type MartialJob =
	| "Destroyer"
	| "Berserker"
	| "Assassin"
	| "Striker"
	| "Holy Knight"
	| "Technomancer"
	| "Stalker";

type PowerMode =
	| "guard"
	| "overload"
	| "ambush"
	| "kinetic"
	| "radiant"
	| "device"
	| "tracking";

type PowerSchool =
	| "Abjuration"
	| "Conjuration"
	| "Divination"
	| "Enchantment"
	| "Evocation"
	| "Illusion"
	| "Necromancy"
	| "Transmutation";

interface PowerFamily {
	classes: MartialJob[];
	mode: PowerMode;
	school: PowerSchool;
	theme: string;
	prefixes: string[];
	forms: string[];
	levels: number[];
	damageType: string;
	range?: string;
	duration?: string;
	castingTime?: string;
}

interface PowerSeed {
	name: string;
	classes: MartialJob[];
	mode: PowerMode;
	school: PowerSchool;
	theme: string;
	level: number;
	damageType: string;
	range?: string;
	duration?: string;
	castingTime?: string;
}

const FULL_POWER_LEVELS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 2, 4, 6, 8, 1, 3, 5, 7,
	9, 2, 4, 6,
];
const SHARED_POWER_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 3, 5];

const powerCounts: Record<number, number> = {
	1: 100,
	2: 100,
	3: 100,
	4: 100,
	5: 100,
	6: 100,
	7: 100,
	8: 100,
	9: 100,
};

function slug(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function rarityForLevel(level: number): string {
	if (level >= 9) return "legendary";
	if (level >= 7) return "epic";
	if (level >= 5) return "rare";
	if (level >= 3) return "uncommon";
	return "common";
}

function abilityForClasses(classes: MartialJob[]): string {
	if (classes.includes("Technomancer")) return "Intelligence";
	if (classes.includes("Stalker")) return "Sense";
	if (classes.includes("Holy Knight")) return "Presence";
	if (classes.includes("Assassin") || classes.includes("Striker"))
		return "Agility";
	return "Strength";
}

function saveForMode(mode: PowerMode): string {
	if (mode === "guard" || mode === "overload") return "Vitality";
	if (mode === "ambush" || mode === "tracking") return "Sense";
	if (mode === "device") return "Intelligence";
	if (mode === "radiant") return "Presence";
	return "Strength";
}

function diceForLevel(level: number): string {
	return (
		["", "2d6", "3d6", "4d6", "5d6", "6d6", "7d6", "8d6", "9d6", "10d6"][
			level
		] ?? "4d6"
	);
}

function castingTimeFor(seed: PowerSeed): string {
	if (seed.castingTime) return seed.castingTime;
	if (seed.mode === "guard") return "1 reaction";
	if (["ambush", "kinetic", "tracking"].includes(seed.mode))
		return "1 bonus action";
	return "1 action";
}

function effectFor(
	seed: PowerSeed,
	dice: string,
): { primary: string; secondary: string } {
	if (seed.mode === "guard") {
		return {
			primary: `Creates a reinforced mana shell that reduces incoming damage and retaliates for ${dice} ${seed.damageType} damage.`,
			secondary:
				"The protected creature can shift 5 feet without provoking opportunity attacks.",
		};
	}
	if (seed.mode === "overload") {
		return {
			primary: `Releases a volatile body-current for ${dice} ${seed.damageType} damage.`,
			secondary:
				"On a failed save, the target is pushed 10 feet or knocked prone.",
		};
	}
	if (seed.mode === "ambush") {
		return {
			primary: `Conceals the user in a brief rift shadow and strikes for ${dice} ${seed.damageType} damage.`,
			secondary:
				"If the user had advantage, the target cannot take reactions until its next turn.",
		};
	}
	if (seed.mode === "kinetic") {
		return {
			primary: `Condenses nerve-gate force into an impact dealing ${dice} ${seed.damageType} damage.`,
			secondary: "The user may move 10 feet before or after the impact.",
		};
	}
	if (seed.mode === "radiant") {
		return {
			primary: `Channels oathbound radiance for ${dice} ${seed.damageType} damage or temporary hit points.`,
			secondary:
				"An ally within 30 feet gains advantage on its next save against fear or charm.",
		};
	}
	if (seed.mode === "device") {
		return {
			primary: `Deploys a compact mana device that deals ${dice} ${seed.damageType} damage.`,
			secondary:
				"The device can mark, illuminate, stabilize, or disrupt one mundane sensor until the end of the next turn.",
		};
	}
	return {
		primary: `Locks onto a quarry signature and deals ${dice} ${seed.damageType} damage.`,
		secondary:
			"The user learns the target's direction until the end of the next turn if it remains within 300 feet.",
	};
}

function descriptionFor(seed: PowerSeed, dice: string): string {
	const save = saveForMode(seed.mode);
	const ability = abilityForClasses(seed.classes);
	return `You tune ${seed.theme} through your awakened body and field gear. A creature in range must make a ${save} saving throw, taking ${dice} ${seed.damageType} damage on a failure or half as much on a success. You use ${ability} for any attack or save interactions, and the power adds the listed tactical rider for ${seed.classes.join(", ")} Ascendants.`;
}

function makeSeeds(family: PowerFamily): PowerSeed[] {
	return family.prefixes.flatMap((prefix, prefixIndex) =>
		family.forms.map((form, formIndex) => ({
			name: `${prefix} ${form}`,
			classes: family.classes,
			mode: family.mode,
			school: family.school,
			theme: family.theme,
			level:
				family.levels[
					(prefixIndex * family.forms.length + formIndex) % family.levels.length
				],
			damageType: family.damageType,
			range: family.range,
			duration: family.duration,
			castingTime: family.castingTime,
		})),
	);
}

function makePower(seed: PowerSeed): CompendiumPower {
	powerCounts[seed.level] += 1;
	const dice = diceForLevel(seed.level);
	const save = saveForMode(seed.mode);
	const ability = abilityForClasses(seed.classes);
	const castingTime = castingTimeFor(seed);
	const effects = effectFor(seed, dice);
	const range = seed.range ?? (seed.mode === "guard" ? "Self" : "60 feet");
	const duration = seed.duration ?? "Instantaneous";

	return {
		id: `power-parity-${seed.level}-${powerCounts[seed.level]}-${slug(seed.name)}`,
		name: seed.name,
		display_name: seed.name,
		description: descriptionFor(seed, dice),
		flavor: `${seed.name} is a field-ready awakened power for ${seed.classes.join(", ")} Ascendants.`,
		tags: ["awakened", "power", seed.mode, seed.school, ...seed.classes],
		classes: seed.classes,
		rarity: rarityForLevel(seed.level),
		source_book: "Rift Ascendant Canon",
		effects,
		power_type: "Innate",
		power_level: seed.level,
		casting_time: castingTime,
		range,
		duration,
		concentration: false,
		ritual: false,
		school: seed.school,
		target:
			seed.mode === "guard" ? "Self or one adjacent ally" : "One creature",
		has_save: true,
		save_ability: save,
		damage_roll: dice,
		damage_type: seed.damageType,
		mechanics: {
			duration,
			damage_profile: `${dice} ${seed.damageType}`,
			range,
			type: seed.mode,
			ability,
			lattice_interaction: `${seed.level}-tier ${seed.theme} stabilized through gate-lattice resonance`,
			saving_throw: {
				ability: save,
				dc: 0,
				success: "Half damage and no rider.",
				failure: effects.secondary,
			},
		},
		limitations: {
			uses: "3/long rest",
			recharge: "long rest",
			requires_attunement: false,
			conditions: ["Must be conscious"],
		},
		discovery_lore: `Bureau field auditors catalogued ${seed.name} after repeated reports from ${seed.classes.join(", ")} teams operating near unstable gates.`,
		theme_tags: [seed.mode, seed.theme, ...seed.classes.map(slug)],
	};
}

const uniqueFamilies: PowerFamily[] = [
	{
		classes: ["Destroyer"],
		mode: "guard",
		school: "Abjuration",
		theme: "reinforced frame resonance",
		damageType: "force",
		prefixes: ["Rampart", "Obsidian", "Titan", "Bulwark", "Anchor"],
		forms: ["Shell", "Rebuke", "Brace", "Intercept", "Aegis", "Lock"],
		levels: FULL_POWER_LEVELS,
	},
	{
		classes: ["Berserker"],
		mode: "overload",
		school: "Transmutation",
		theme: "volatile muscle-current resonance",
		damageType: "fire",
		prefixes: ["Fury", "Crimson", "Rupture", "Dreadnought", "Thermal"],
		forms: ["Surge", "Howl", "Crash", "Break", "Pulse", "Roar"],
		levels: FULL_POWER_LEVELS,
	},
	{
		classes: ["Assassin"],
		mode: "ambush",
		school: "Illusion",
		theme: "umbral footwork resonance",
		damageType: "necrotic",
		prefixes: ["Veiled", "Nocturne", "Silent", "Needle", "Phantom"],
		forms: ["Step", "Gash", "Mark", "Feint", "Cloak", "Cut"],
		levels: FULL_POWER_LEVELS,
	},
	{
		classes: ["Striker"],
		mode: "kinetic",
		school: "Evocation",
		theme: "nerve-gate kinetic pressure",
		damageType: "thunder",
		prefixes: ["Impulse", "Dragon", "Gale", "Iron", "Nerve"],
		forms: ["Palm", "Burst", "Step", "Pulse", "Counter", "Wheel"],
		levels: FULL_POWER_LEVELS,
	},
	{
		classes: ["Holy Knight"],
		mode: "radiant",
		school: "Abjuration",
		theme: "oathbound Absolute radiance",
		damageType: "radiant",
		prefixes: ["Oath", "Dawn", "Covenant", "Lionheart", "Seraphic"],
		forms: ["Ward", "Smite", "Banner", "Charge", "Mercy", "Rebuke"],
		levels: FULL_POWER_LEVELS,
	},
	{
		classes: ["Technomancer"],
		mode: "device",
		school: "Transmutation",
		theme: "tool-bound mana engineering",
		damageType: "lightning",
		prefixes: ["Circuit", "Capacitor", "Drone", "Relay", "Nanite"],
		forms: ["Dart", "Mesh", "Patch", "Spark", "Latch", "Screen"],
		levels: FULL_POWER_LEVELS,
	},
	{
		classes: ["Stalker"],
		mode: "tracking",
		school: "Divination",
		theme: "prey-lock rift ecology",
		damageType: "piercing",
		prefixes: ["Quarry", "Trail", "Feral", "Horizon", "Riftwood"],
		forms: ["Mark", "Scent", "Snare", "Sight", "Pursuit", "Fang"],
		levels: FULL_POWER_LEVELS,
	},
];

const sharedFamilies: PowerFamily[] = [
	{
		classes: ["Destroyer", "Berserker"],
		mode: "overload",
		school: "Evocation",
		theme: "frontline shockwave resonance",
		damageType: "thunder",
		prefixes: ["Breaker", "Vanguard"],
		forms: ["Crash", "Wave", "Drive", "Fault", "Hammer"],
		levels: SHARED_POWER_LEVELS,
	},
	{
		classes: ["Destroyer", "Holy Knight"],
		mode: "guard",
		school: "Abjuration",
		theme: "shared bulwark lattice",
		damageType: "force",
		prefixes: ["Sentinel", "Parapet"],
		forms: ["Oath", "Wall", "Cover", "Bastion", "Hold"],
		levels: SHARED_POWER_LEVELS,
	},
	{
		classes: ["Assassin", "Stalker"],
		mode: "ambush",
		school: "Illusion",
		theme: "predator shadow resonance",
		damageType: "poison",
		prefixes: ["Viper", "Moonless"],
		forms: ["Pounce", "Needle", "Trail", "Silence", "Snare"],
		levels: SHARED_POWER_LEVELS,
	},
	{
		classes: ["Assassin", "Striker"],
		mode: "kinetic",
		school: "Evocation",
		theme: "precision impact current",
		damageType: "force",
		prefixes: ["Needlepoint", "Flash"],
		forms: ["Elbow", "Kick", "Riposte", "Burst", "Reversal"],
		levels: SHARED_POWER_LEVELS,
	},
	{
		classes: ["Striker", "Technomancer"],
		mode: "device",
		school: "Transmutation",
		theme: "calibrated nerve-interface hardware",
		damageType: "lightning",
		prefixes: ["Servo", "Impulse"],
		forms: ["Brace", "Vector", "Knuckle", "Gyro", "Coil"],
		levels: SHARED_POWER_LEVELS,
	},
	{
		classes: ["Holy Knight", "Stalker"],
		mode: "tracking",
		school: "Divination",
		theme: "vigilant quarry oath",
		damageType: "radiant",
		prefixes: ["Vigil", "Beacon"],
		forms: ["Trail", "Arrow", "Brand", "Flare", "Hunt"],
		levels: SHARED_POWER_LEVELS,
	},
	{
		classes: ["Berserker", "Technomancer"],
		mode: "overload",
		school: "Transmutation",
		theme: "regulated overload furnace",
		damageType: "fire",
		prefixes: ["Furnace", "Plasma"],
		forms: ["Vent", "Rush", "Crown", "Engine", "Burst"],
		levels: SHARED_POWER_LEVELS,
	},
	{
		classes: ["Destroyer", "Berserker", "Assassin", "Striker"],
		mode: "kinetic",
		school: "Evocation",
		theme: "cross-discipline martial gate pressure",
		damageType: "force",
		prefixes: ["Apex", "Rift", "Storm", "Iron", "Nova", "Echo"],
		forms: [
			"Drive",
			"Guard",
			"Rush",
			"Feint",
			"Break",
			"Surge",
			"Counter",
			"Vault",
			"Pulse",
			"Lock",
		],
		levels: FULL_POWER_LEVELS,
	},
];

export const powers_supplemental: CompendiumPower[] = [
	...uniqueFamilies,
	...sharedFamilies,
]
	.flatMap(makeSeeds)
	.map(makePower);
