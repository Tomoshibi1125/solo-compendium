import type { CompendiumTechnique } from "../../types/compendium";

type MartialJob =
	| "Destroyer"
	| "Berserker"
	| "Assassin"
	| "Striker"
	| "Holy Knight"
	| "Technomancer"
	| "Stalker";

type TechniqueMode =
	| "vanguard"
	| "brutal"
	| "precision"
	| "unarmed"
	| "radiant"
	| "engineered"
	| "pursuit";

interface TechniqueFamily {
	classes: MartialJob[];
	mode: TechniqueMode;
	type: string;
	style: string;
	theme: string;
	prefixes: string[];
	forms: string[];
	levels: number[];
	damageType: string;
	ability: string;
	range?: string;
	activation?: "action" | "bonus" | "reaction";
}

interface TechniqueSeed {
	name: string;
	classes: MartialJob[];
	mode: TechniqueMode;
	type: string;
	style: string;
	theme: string;
	level: number;
	damageType: string;
	ability: string;
	range?: string;
	activation?: "action" | "bonus" | "reaction";
}

const FULL_TECHNIQUE_LEVELS = [
	1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8,
	9, 1, 3, 5,
];
const SHARED_TECHNIQUE_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 3, 5];

const techniqueCounts: Record<number, number> = {
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

function diceForLevel(level: number): string {
	return (
		["", "1d8", "2d8", "3d8", "4d8", "5d8", "6d8", "7d8", "8d8", "9d8"][
			level
		] ?? "3d8"
	);
}

function saveForMode(mode: TechniqueMode): string {
	if (mode === "vanguard" || mode === "brutal") return "Strength";
	if (mode === "precision" || mode === "pursuit") return "Sense";
	if (mode === "engineered") return "Intelligence";
	if (mode === "radiant") return "Presence";
	return "Agility";
}

function activationType(seed: TechniqueSeed): "action" | "bonus" | "reaction" {
	if (seed.activation) return seed.activation;
	if (["vanguard", "radiant"].includes(seed.mode)) return "reaction";
	if (["precision", "unarmed", "pursuit"].includes(seed.mode)) return "bonus";
	return "action";
}

function effectFor(
	seed: TechniqueSeed,
	dice: string,
): { primary: string; secondary: string } {
	if (seed.mode === "vanguard") {
		return {
			primary: `Interposes ${seed.theme}, reducing damage and answering with ${dice} ${seed.damageType} damage.`,
			secondary:
				"On a failed save, the target is pushed 5 feet or loses advantage on its next attack.",
		};
	}
	if (seed.mode === "brutal") {
		return {
			primary: `Turns ${seed.theme} into a crushing blow for ${dice} ${seed.damageType} damage.`,
			secondary:
				"On a failed save, the target is knocked prone or has its speed reduced by 10 feet.",
		};
	}
	if (seed.mode === "precision") {
		return {
			primary: `Finds a gap in guard through ${seed.theme} and deals ${dice} ${seed.damageType} damage.`,
			secondary:
				"If the user had advantage, the target cannot take reactions until its next turn.",
		};
	}
	if (seed.mode === "unarmed") {
		return {
			primary: `Channels ${seed.theme} into an unarmed strike for ${dice} ${seed.damageType} damage.`,
			secondary:
				"The user may move 10 feet without provoking opportunity attacks.",
		};
	}
	if (seed.mode === "radiant") {
		return {
			primary: `Binds a weapon path to ${seed.theme} for ${dice} ${seed.damageType} damage.`,
			secondary:
				"An ally within 30 feet gains temporary hit points equal to the technique level.",
		};
	}
	if (seed.mode === "engineered") {
		return {
			primary: `Triggers ${seed.theme} as a prepared device-assisted strike for ${dice} ${seed.damageType} damage.`,
			secondary:
				"The target is marked by harmless tracer light until the end of the next turn.",
		};
	}
	return {
		primary: `Reads ${seed.theme} and attacks for ${dice} ${seed.damageType} damage.`,
		secondary:
			"The user ignores nonmagical difficult terrain until the end of the turn.",
	};
}

function descriptionFor(seed: TechniqueSeed, dice: string): string {
	const save = saveForMode(seed.mode);
	return `You execute ${seed.theme} as a trained martial sequence. Make a weapon, unarmed, or device-assisted attack using ${seed.ability}; on a hit or failed ${save} save, the target takes ${dice} ${seed.damageType} damage and suffers the listed tactical rider. This technique is taught to ${seed.classes.join(", ")} Ascendants.`;
}

function makeSeeds(family: TechniqueFamily): TechniqueSeed[] {
	return family.prefixes.flatMap((prefix, prefixIndex) =>
		family.forms.map((form, formIndex) => ({
			name: `${prefix} ${form}`,
			classes: family.classes,
			mode: family.mode,
			type: family.type,
			style: family.style,
			theme: `${family.theme} through the ${prefix.toLowerCase()} ${form.toLowerCase()} pattern`,
			level:
				family.levels[
					(prefixIndex * family.forms.length + formIndex) % family.levels.length
				],
			damageType: family.damageType,
			ability: family.ability,
			range: family.range,
			activation: family.activation,
		})),
	);
}

function makeTechnique(seed: TechniqueSeed): CompendiumTechnique {
	techniqueCounts[seed.level] += 1;
	const dice = diceForLevel(seed.level);
	const save = saveForMode(seed.mode);
	const effects = effectFor(seed, dice);
	const activation = activationType(seed);
	const range =
		seed.range ??
		(seed.mode === "pursuit" || seed.mode === "engineered"
			? "60 feet"
			: "Self");

	return {
		id: `technique-parity-${seed.level}-${techniqueCounts[seed.level]}-${slug(seed.name)}`,
		name: seed.name,
		display_name: seed.name,
		description: descriptionFor(seed, dice),
		flavor: `${seed.name} is a field-tested technique for ${seed.classes.join(", ")} Ascendants.`,
		tags: ["awakened", "technique", seed.mode, seed.type, ...seed.classes],
		classes: seed.classes,
		rarity: rarityForLevel(seed.level),
		source_book: "Rift Ascendant Canon",
		effects,
		type: seed.type,
		style: seed.style,
		level_requirement: seed.level,
		uses_per_rest_formula: "3/long rest",
		activation: { type: activation },
		range,
		duration: "Instantaneous",
		mechanics: {
			duration: "Instantaneous",
			damage_profile: `${dice} ${seed.damageType}`,
			range,
			type: seed.mode,
			action:
				activation === "bonus"
					? "1 bonus action"
					: activation === "reaction"
						? "1 reaction"
						: "1 action",
			ability: seed.ability,
			lattice_interaction: `${seed.level}-tier ${seed.theme} reinforced by trained mana control`,
			attack: {
				type: seed.damageType,
				mode: range === "Self" ? "melee" : "ranged",
				resolution: "martial_attack",
				modifier: seed.ability,
				damage: dice,
				damage_type: seed.damageType,
			},
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
		discovery_lore: `Bureau instructors standardized ${seed.name} after successful field use by ${seed.classes.join(", ")} teams in unstable gate zones.`,
		theme_tags: [seed.mode, seed.theme, ...seed.classes.map(slug)],
	};
}

const uniqueFamilies: TechniqueFamily[] = [
	{
		classes: ["Destroyer"],
		mode: "vanguard",
		type: "Combat Arts",
		style: "Bulwark Vanguard",
		theme: "shield-line weapon mana",
		damageType: "force",
		ability: "Strength",
		prefixes: ["Rampart", "Stonewall", "Iron", "Anchor", "Citadel"],
		forms: ["Parry", "Advance", "Bind", "Check", "Cover", "Rebuke"],
		levels: FULL_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Berserker"],
		mode: "brutal",
		type: "Combat Arts",
		style: "Ruin Breaker",
		theme: "reckless heavy-weapon momentum",
		damageType: "slashing",
		ability: "Strength",
		prefixes: ["Ruin", "Crimson", "Breaker", "Feral", "Skullsplitter"],
		forms: ["Chop", "Charge", "Cleave", "Drop", "Hook", "Howl"],
		levels: FULL_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Assassin"],
		mode: "precision",
		type: "Combat Arts",
		style: "Silent Edge",
		theme: "angle-cut ambush discipline",
		damageType: "piercing",
		ability: "Agility",
		prefixes: ["Needle", "Veiled", "Midnight", "Ghost", "Viper"],
		forms: ["Cut", "Feint", "Mark", "Step", "Thrust", "Exit"],
		levels: FULL_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Striker"],
		mode: "unarmed",
		type: "Combat Arts",
		style: "Kinetic Fist",
		theme: "breath-timed unarmed pressure",
		damageType: "bludgeoning",
		ability: "Agility",
		prefixes: ["Dragon", "Gale", "Iron", "Thunder", "Nerve"],
		forms: ["Palm", "Kick", "Wheel", "Counter", "Throw", "Rush"],
		levels: FULL_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Holy Knight"],
		mode: "radiant",
		type: "Combat Arts",
		style: "Oathbound Blade",
		theme: "radiant covenant footwork",
		damageType: "radiant",
		ability: "Presence",
		prefixes: ["Dawn", "Oath", "Lion", "Covenant", "Mercy"],
		forms: ["Parry", "Drive", "Challenge", "Smite", "Banner", "Interdict"],
		levels: FULL_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Technomancer"],
		mode: "engineered",
		type: "Combat Arts",
		style: "Gadget Protocol",
		theme: "engineered weapon calibration",
		damageType: "lightning",
		ability: "Intelligence",
		prefixes: ["Relay", "Circuit", "Drone", "Capacitor", "Gyro"],
		forms: ["Shot", "Latch", "Patch", "Vector", "Pulse", "Screen"],
		levels: FULL_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Stalker"],
		mode: "pursuit",
		type: "Combat Arts",
		style: "Quarry Hunter",
		theme: "tracked quarry fieldcraft",
		damageType: "piercing",
		ability: "Sense",
		range: "90 feet",
		prefixes: ["Quarry", "Trail", "Horizon", "Snare", "Feral"],
		forms: ["Shot", "Mark", "Pin", "Pursuit", "Ambush", "Vantage"],
		levels: FULL_TECHNIQUE_LEVELS,
	},
];

const sharedFamilies: TechniqueFamily[] = [
	{
		classes: ["Destroyer", "Berserker"],
		mode: "brutal",
		type: "Combat Arts",
		style: "Frontline Breaker",
		theme: "two-handed shock line",
		damageType: "thunder",
		ability: "Strength",
		prefixes: ["Breaker", "Vanguard"],
		forms: ["Drive", "Sweep", "Crater", "Lock", "Crash"],
		levels: SHARED_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Destroyer", "Holy Knight"],
		mode: "vanguard",
		type: "Combat Arts",
		style: "Aegis Line",
		theme: "protective shield discipline",
		damageType: "force",
		ability: "Strength",
		prefixes: ["Sentinel", "Aegis"],
		forms: ["Brace", "Cover", "Hold", "Answer", "Ward"],
		levels: SHARED_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Assassin", "Stalker"],
		mode: "precision",
		type: "Combat Arts",
		style: "Predator Step",
		theme: "silent quarry execution",
		damageType: "piercing",
		ability: "Agility",
		prefixes: ["Moonless", "Serpent"],
		forms: ["Cut", "Pounce", "Trace", "Pin", "Exit"],
		levels: SHARED_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Assassin", "Striker"],
		mode: "unarmed",
		type: "Combat Arts",
		style: "Close-Quarters Feint",
		theme: "precision counter footwork",
		damageType: "force",
		ability: "Agility",
		prefixes: ["Flash", "Needlepoint"],
		forms: ["Counter", "Elbow", "Hook", "Slip", "Break"],
		levels: SHARED_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Striker", "Technomancer"],
		mode: "engineered",
		type: "Combat Arts",
		style: "Servo Fist",
		theme: "nerve-interface strike timing",
		damageType: "lightning",
		ability: "Agility",
		prefixes: ["Servo", "Coil"],
		forms: ["Jab", "Kick", "Vector", "Brace", "Burst"],
		levels: SHARED_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Holy Knight", "Stalker"],
		mode: "pursuit",
		type: "Combat Arts",
		style: "Vigil Hunt",
		theme: "watchful oath pursuit",
		damageType: "radiant",
		ability: "Sense",
		range: "90 feet",
		prefixes: ["Beacon", "Vigil"],
		forms: ["Shot", "Trail", "Mark", "Flare", "Pin"],
		levels: SHARED_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Berserker", "Technomancer"],
		mode: "engineered",
		type: "Combat Arts",
		style: "Overload Engine",
		theme: "regulated heavy-weapon ignition",
		damageType: "fire",
		ability: "Strength",
		prefixes: ["Furnace", "Plasma"],
		forms: ["Vent", "Rush", "Crown", "Drive", "Breaker"],
		levels: SHARED_TECHNIQUE_LEVELS,
	},
	{
		classes: ["Destroyer", "Berserker", "Assassin", "Striker"],
		mode: "brutal",
		type: "Combat Arts",
		style: "Cross-Guild Martial Protocol",
		theme: "shared awakened combat doctrine",
		damageType: "force",
		ability: "Strength",
		prefixes: ["Apex", "Rift", "Storm", "Adamant", "Nova", "Echo"],
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
		levels: FULL_TECHNIQUE_LEVELS,
	},
];

export const techniques_supplemental: CompendiumTechnique[] = [
	...uniqueFamilies,
	...sharedFamilies,
]
	.flatMap(makeSeeds)
	.map(makeTechnique);
