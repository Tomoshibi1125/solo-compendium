import type { CompendiumTechnique } from "../../types/compendium";

// ─── Unique lore and flavor pools ──────────────────────────
const TECH_LORE: string[] = [
	"Refined during a three-day gate siege when the raid party ran out of mana potions and had to fight with technique alone.",
	"Adapted from Destroyer combat doctrine after a training exercise destroyed the facility's reinforced walls.",
	"First executed by a Striker cadet during a live-fire test — the instructors stopped the exam to document it.",
	"Stolen from a rogue guild's training compound during a Bureau enforcement raid.",
	"Reconstructed from the movement patterns of an Assassin captured on Bureau security cameras during the Osaka Incident.",
	"Developed by a Berserker who trained exclusively with wild anomalies in uncleared gate zones for an entire year.",
	"Bureau kinesiologists measured the nerve-gate activation pattern and published it as a standard training reference.",
	"Found carved into the stone floor of a long-abandoned martial training hall inside a sealed B-Rank gate.",
	"Created by a Holy Knight who refused to use any weapon except her fists until she could channel her oath through them.",
	"A Technomancer designed a mechanical training rig that could replicate this technique's mana flow with 99.7% accuracy.",
	"Standardized after a Stalker demonstrated it could incapacitate gate-born predators three ranks above her classification.",
	"Compiled from oral teachings of an Awakened martial artist who never registered with the Bureau.",
	"Bureau training manuals include a full-page warning about what happens when this technique is performed incorrectly.",
	"Emerged when a Striker's nerve-gate misfired during sparring and produced an effect more potent than the intended technique.",
	"Codified after the Battle of Incheon Gate, where close-quarters combat became the only viable option against swarming anomalies.",
	"Donated to the public training archives by an anonymous S-Rank Hunter with a note that read: 'You'll need this.'",
	"Reverse-engineered from the defensive stance of a B-Rank gate boss that no melee fighter could breach for 40 minutes.",
	"First taught to Bureau cadets who complained that existing techniques were 'too slow for real gates.'",
	"A cross-discipline technique born from a Destroyer and Assassin training together for a joint gate-clear operation.",
	"Bureau medical staff documented the strain pattern and established a mandatory recovery protocol for repeated use.",
	"Created by accident during a sparring match when one fighter's mana circuit resonated with their opponent's weapon.",
	"Formalized after three independent guilds submitted nearly identical combat reports describing the same unnamed maneuver.",
	"Adapted from a pre-Awakening martial art by an instructor who discovered that mana enhancement made it lethal.",
	"Classified as 'restricted' after a training demonstration put a B-Rank instructor in the medical ward for a week.",
	"Developed under fire when a Berserker's primary weapon shattered mid-fight inside an A-Rank gate.",
	"Bureau historians trace this technique to the earliest documented gate clears, before formal combat training existed.",
	"Tested to failure by Bureau combat engineers — the failure point exceeded the structural integrity of the testing equipment.",
	"A Stalker recorded herself performing this technique 10,000 times to identify the optimal nerve-gate activation window.",
	"Guild rivalry drove two competing dojos to independently perfect this technique within the same month.",
	"First performed at full power during the Jeju Island Raid, where it became the standard for close-quarters gate combat.",
];

const TECH_FLAVOR: string[] = [
	"They teach the form. The gate teaches the intent.",
	"Fast enough that the target's mana field doesn't register the hit until it's over.",
	"Bureau instructors demonstrate once. The wall demonstrates what happens after.",
	"Every hunter who's been inside a gate knows this motion. Most of them learned it by watching someone else die.",
	"The technique is simple. The discipline to execute it under pressure is not.",
	"It doesn't look like much. That's by design.",
	"The mana cost is minimal. The physical toll is significant.",
	"Named after the sound it makes on impact. You'll recognize it.",
	"Bureau-certified for use against anomalies up to two ranks above the practitioner. Unofficially, three.",
	"The form is ancient. The mana enhancement is new. Together, they're something else.",
	"You don't pull this one out unless you mean it.",
	"It works better in confined spaces. Gates are always confined spaces.",
	"The older Hunters perform it without thinking. The younger ones can't stop thinking about it.",
	"Healers can tell you've been practicing. The micro-fractures are distinctive.",
	"Bureau safety protocols explicitly forbid practicing this above 50% power without medical staff present.",
	"It teaches your body to move faster than your thoughts. That's the point.",
	"Some techniques are art. This one is math.",
	"The feedback loop between nerve-gate and weapon creates a resonance you can feel through the floor.",
	"Guild combat evaluations always include this. Failure means more training. Success means a promotion.",
	"It's the first thing you forget in a panic. It's the last thing you should.",
	"The precision required is inhuman. Fortunately, you're Awakened.",
	"Bureau analysts calculated the force output. Then they recalculated. Then they stopped calculating.",
	"Every weapon responds to this differently. Finding the right pairing is half the mastery.",
	"The pain is temporary. The muscle memory is permanent.",
	"There's a reason this is the technique that S-Rank Hunters still practice daily.",
	"You hear the crack before you feel the impact. If you feel it, you're the target.",
	"Clean form. Maximum output. Minimum wasted movement. That's the standard.",
	"The technique doesn't care about rank. Only execution.",
	"It's not the most powerful technique. It's the most consistent. Consistency wins fights.",
	"The Bureau doesn't rank techniques by power. They rank them by survival rate. This one ranks high.",
];

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

function damageTypeForSeed(seed: TechniqueSeed): string {
	if (/\b(thunder|storm)\b/i.test(seed.name)) return "thunder";
	return seed.damageType;
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
	const seedIdx = seed.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
	const dice = diceForLevel(seed.level);
	const damageType = damageTypeForSeed(seed);
	const save = saveForMode(seed.mode);
	const resolvedSeed = { ...seed, damageType };
	const effects = effectFor(resolvedSeed, dice);
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
		description: descriptionFor(resolvedSeed, dice),
		flavor: TECH_FLAVOR[seedIdx % TECH_FLAVOR.length],
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
			damage_profile: `${dice} ${damageType}`,
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
				type: damageType,
				mode: range === "Self" ? "melee" : "ranged",
				resolution: "martial_attack",
				modifier: seed.ability,
				damage: dice,
				damage_type: damageType,
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
		discovery_lore:
			TECH_LORE[(seedIdx * 7 + seed.level * 3) % TECH_LORE.length],
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
