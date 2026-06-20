import type { CompendiumPower } from "../../types/compendium";

// ═══════════════════════════════════════════════════════════════════════
// Archetype-shared martial powers.
//
// Part A of the "Archetype-Shared Ability Catalogs" plan: the martial power
// pool is gated by ARCHETYPE membership (every martial-capable job sees the
// whole pool), so these entries carry no job-signature names — they are
// generic, fully-fleshed options usable by any martial/hybrid job.
//
// Built through a small factory so every entry satisfies
// `isAbilityEntryComplete` (id/name/description/source_book, tags, timing +
// targeting, structured mechanics, and a save-based resolution with a real
// damage formula + type).
// ═══════════════════════════════════════════════════════════════════════

type Theme =
	| "guard"
	| "strike"
	| "mobility"
	| "control"
	| "elemental"
	| "precision"
	| "entropy"
	| "necrotic"
	| "vanguard";

interface ThemeConfig {
	castingTime: string;
	range: string;
	duration: string;
	action: string;
	ability: string;
	target: string;
	template: (dmg: string, dtype: string, save: string) => string;
	secondary: string;
	// 5e rest cadence: reactive/defensive/mobility arts recover on a short rest;
	// heavy nova / execute effects recover on a long rest.
	rest: "short rest" | "long rest";
}

// 5e per-use charge formula, tiered by power level so low-level arts get the
// proficiency-bonus feel and capstones stay rare. Resolved per-character at
// runtime by computePowerUses/parseUses (e.g. "PB + main stat mod/short rest").
function chargeFormula(
	level: number,
	rest: "short rest" | "long rest",
): string {
	if (level <= 3) return `Proficiency bonus/${rest}`;
	if (level <= 6) return `PB + main stat mod/${rest}`;
	return "main stat mod/long rest";
}

// 5e damage scaling prose: "Damage increases by 1dN per level above {level}th".
function scalingProse(level: number, die: number): string {
	const ord =
		level === 1
			? "1st"
			: level === 2
				? "2nd"
				: level === 3
					? "3rd"
					: `${level}th`;
	return `Damage increases by 1d${die} per level above ${ord}.`;
}

const THEME_CONFIG: Record<Theme, ThemeConfig> = {
	guard: {
		castingTime: "1 reaction",
		range: "Self",
		duration: "Instantaneous",
		action: "1 reaction",
		ability: "Vitality",
		target: "Self or one ally within 5 feet",
		template: (dmg, dtype, save) =>
			`Harden your mana into a reactive ward. When you or an ally within 5 feet takes damage, force the attacker to make a ${save} save; on a failure it takes ${dmg} ${dtype} damage and the ward absorbs the blow, halving the triggering damage.`,
		secondary: "Damage and absorption increase by 1d8 at higher tiers.",
		rest: "short rest",
	},
	strike: {
		castingTime: "1 action",
		range: "Melee",
		duration: "Instantaneous",
		action: "1 action",
		ability: "Strength",
		target: "One creature within reach",
		template: (dmg, dtype, save) =>
			`Pour mana into a single brutal blow. The target must make a ${save} save, taking ${dmg} ${dtype} damage on a failure and half as much on a success.`,
		secondary: "Damage increases by 1d8 at higher tiers.",
		rest: "long rest",
	},
	mobility: {
		castingTime: "1 bonus action",
		range: "Self",
		duration: "Instantaneous",
		action: "1 bonus action",
		ability: "Agility",
		target: "Self",
		template: (dmg, dtype, save) =>
			`Blink across the battlefield on a surge of kinetic mana, then strike. One creature you end adjacent to must make a ${save} save, taking ${dmg} ${dtype} damage on a failure.`,
		secondary: "Distance and damage increase at higher tiers.",
		rest: "short rest",
	},
	control: {
		castingTime: "1 action",
		range: "30 feet",
		duration: "1 minute",
		action: "1 action",
		ability: "Presence",
		target: "One creature you can see",
		template: (dmg, dtype, save) =>
			`Bind a target in a lattice of disruptive mana. It must make a ${save} save, taking ${dmg} ${dtype} damage and being restrained until the end of your next turn on a failure.`,
		secondary: "Affects an additional target at higher tiers.",
		rest: "long rest",
	},
	elemental: {
		castingTime: "1 action",
		range: "60 feet",
		duration: "Instantaneous",
		action: "1 action",
		ability: "Intelligence",
		target: "Each creature in a 15-foot area",
		template: (dmg, dtype, save) =>
			`Unleash a burst of raw ${dtype} mana. Each creature in the area must make a ${save} save, taking ${dmg} ${dtype} damage on a failure and half as much on a success.`,
		secondary: "Damage increases by 1d8 at higher tiers.",
		rest: "long rest",
	},
	precision: {
		castingTime: "1 action",
		range: "120 feet",
		duration: "Instantaneous",
		action: "1 action",
		ability: "Agility",
		target: "One creature you can see",
		template: (dmg, dtype, save) =>
			`Exploit a flaw in a target's guard with surgical timing. It must make a ${save} save, taking ${dmg} ${dtype} damage on a failure; on a failure by 5 or more the strike is a critical hit.`,
		secondary: "Damage increases by 1d8 at higher tiers.",
		rest: "long rest",
	},
	entropy: {
		castingTime: "1 action",
		range: "60 feet",
		duration: "Instantaneous",
		action: "1 action",
		ability: "Intelligence",
		target: "One creature you can see",
		template: (dmg, dtype, save) =>
			`Accelerate the decay woven through a target. It must make a ${save} save, taking ${dmg} ${dtype} damage on a failure; this damage ignores resistance.`,
		secondary: "Damage increases by 1d8 at higher tiers.",
		rest: "long rest",
	},
	necrotic: {
		castingTime: "1 action",
		range: "Melee",
		duration: "Instantaneous",
		action: "1 action",
		ability: "Intelligence",
		target: "One creature within reach",
		template: (dmg, dtype, save) =>
			`Drain the living essence from a target with a withering touch. It must make a ${save} save, taking ${dmg} ${dtype} damage on a failure, and you regain hit points equal to half the damage dealt.`,
		secondary: "Damage and healing increase at higher tiers.",
		rest: "long rest",
	},
	vanguard: {
		castingTime: "1 reaction",
		range: "Self",
		duration: "Instantaneous",
		action: "1 reaction",
		ability: "Strength",
		target: "One creature within reach",
		template: (dmg, dtype, save) =>
			`Answer an enemy's aggression with an immediate counter. When a creature within reach hits an ally, it must make a ${save} save, taking ${dmg} ${dtype} damage on a failure and being marked by your guard.`,
		secondary: "Damage increases by 1d8 at higher tiers.",
		rest: "short rest",
	},
};

const RARITY_BY_LEVEL = (level: number): string =>
	level >= 7
		? "legendary"
		: level >= 5
			? "very rare"
			: level >= 3
				? "rare"
				: level >= 2
					? "uncommon"
					: "common";

const slug = (name: string): string =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

let counter = 0;

function P(
	name: string,
	level: number,
	school: string,
	dmg: string,
	dtype: string,
	save: string,
	theme: Theme,
	classes: string[],
): CompendiumPower {
	counter += 1;
	const cfg = THEME_CONFIG[theme];
	// dc 0 is the dynamic spell-save sentinel: the engine resolves the real DC
	// (8 + proficiency bonus + spellcasting ability modifier) per character at
	// runtime, the same way spells and the canonical save-DC helper do.
	const dc = 0;
	const description = cfg.template(dmg, dtype, save);
	const scaleDie = Number(dmg.match(/d(\d+)/)?.[1] ?? "8");
	const higher = scalingProse(level, scaleDie);
	const uses = chargeFormula(level, cfg.rest);
	const recharge = uses.includes("/short rest") ? "short rest" : "long rest";
	return {
		id: `power-arch-${level}-${counter}-${slug(name)}`,
		classes,
		name,
		display_name: name,
		description,
		lore: {
			origin: `A ${theme} discipline catalogued in the Bureau's shared awakened training compendium.`,
			history:
				"Field-validated across multiple gate operations and made available to all martial-capable awakened.",
			curse: "",
			personality: "Reliable; the mana signature is clean and well-documented.",
			current_owner: "Open Bureau curriculum for martial-capable awakened.",
			prior_owners: ["Bureau Combat Archives"],
		},
		flavor: `${name}: a shared martial art, mastered through drill rather than lineage.`,
		tags: ["awakened", "power", theme, school],
		rarity: RARITY_BY_LEVEL(level),
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: description,
			secondary: higher,
		},
		power_type: "Innate",
		power_level: level,
		casting_time: cfg.castingTime,
		range: cfg.range,
		duration: cfg.duration,
		concentration: false,
		ritual: false,
		school,
		target: cfg.target,
		has_save: true,
		save_ability: save,
		damage_roll: dmg,
		damage_type: dtype,
		higher_levels: higher,
		components: { verbal: true, somatic: true, material: false },
		mechanics: {
			duration: cfg.duration,
			damage_profile: `${dmg} ${dtype}`,
			range: cfg.range,
			type: theme,
			action: cfg.action,
			ability: cfg.ability,
			dc,
			saving_throw: {
				ability: save,
				dc,
				success: "Half damage and no rider effect.",
				failure: description,
			},
		},
		limitations: {
			uses,
			recharge,
			requires_attunement: false,
			conditions: ["Must be conscious"],
		},
		discovery_lore:
			"Drawn from the shared martial pool every Bureau-certified combatant may train.",
		theme_tags: [theme, school.toLowerCase()],
	};
}

// Archetype-shared pool owners = every martial-capable job (4 pure martials +
// 4 hybrids). These generic arts carry no job signature, so all of them own it.
const ALL = [
	"Destroyer",
	"Berserker",
	"Assassin",
	"Striker",
	"Holy Knight",
	"Stalker",
	"Technomancer",
	"Revenant",
];

export const powers_archetype: CompendiumPower[] = [
	// ── Guard / vanguard (defensive bulwark options) ───────────────────────
	P("Aegis Bastion", 1, "Abjuration", "2d8", "force", "Vitality", "guard", ALL),
	P("Warding Pulse", 1, "Abjuration", "2d6", "force", "Vitality", "guard", ALL),
	P("Phalanx Wall", 2, "Abjuration", "3d6", "force", "Vitality", "guard", ALL),
	P(
		"Iron Reprisal",
		2,
		"Abjuration",
		"3d8",
		"force",
		"Strength",
		"vanguard",
		ALL,
	),
	P(
		"Sentinel Bulwark",
		3,
		"Abjuration",
		"4d8",
		"force",
		"Vitality",
		"guard",
		ALL,
	),
	P(
		"Bastion Echo",
		3,
		"Abjuration",
		"4d6",
		"thunder",
		"Vitality",
		"guard",
		ALL,
	),
	P(
		"Guardian Riposte",
		4,
		"Abjuration",
		"5d8",
		"force",
		"Strength",
		"vanguard",
		ALL,
	),
	P(
		"Bulwark Detonation",
		5,
		"Abjuration",
		"6d8",
		"force",
		"Vitality",
		"guard",
		ALL,
	),
	P(
		"Aegis Overload",
		7,
		"Abjuration",
		"8d8",
		"force",
		"Vitality",
		"guard",
		ALL,
	),
	P(
		"Last Wall Standing",
		9,
		"Abjuration",
		"10d8",
		"force",
		"Vitality",
		"guard",
		ALL,
	),
	// ── Strike (single-target burst) ───────────────────────────────────────
	P(
		"Sundering Blow",
		1,
		"Evocation",
		"2d10",
		"bludgeoning",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Crushing Arc",
		1,
		"Evocation",
		"2d8",
		"slashing",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Riven Strike",
		2,
		"Evocation",
		"3d10",
		"slashing",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Hammerfall",
		3,
		"Evocation",
		"4d10",
		"bludgeoning",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Cleaving Surge",
		3,
		"Evocation",
		"4d8",
		"slashing",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Skull Splitter",
		4,
		"Evocation",
		"5d10",
		"bludgeoning",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Titan Blow",
		5,
		"Evocation",
		"6d10",
		"bludgeoning",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Worldbreaker Swing",
		7,
		"Evocation",
		"8d10",
		"bludgeoning",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Final Cleave",
		9,
		"Evocation",
		"10d10",
		"slashing",
		"Strength",
		"strike",
		ALL,
	),
	// ── Mobility (reposition + hit) ────────────────────────────────────────
	P(
		"Kinetic Dash",
		1,
		"Transmutation",
		"2d6",
		"force",
		"Agility",
		"mobility",
		ALL,
	),
	P(
		"Kinetic Lunge",
		2,
		"Transmutation",
		"3d6",
		"force",
		"Agility",
		"mobility",
		ALL,
	),
	P(
		"Slipstream Cut",
		3,
		"Transmutation",
		"4d6",
		"slashing",
		"Agility",
		"mobility",
		ALL,
	),
	P(
		"Blur Rush",
		4,
		"Transmutation",
		"5d6",
		"force",
		"Agility",
		"mobility",
		ALL,
	),
	P(
		"Surge Stride",
		5,
		"Transmutation",
		"6d6",
		"force",
		"Agility",
		"mobility",
		ALL,
	),
	P(
		"Comet Charge",
		7,
		"Transmutation",
		"8d6",
		"force",
		"Agility",
		"mobility",
		ALL,
	),
	// ── Control (lockdown) ─────────────────────────────────────────────────
	P(
		"Binding Lattice",
		1,
		"Enchantment",
		"2d6",
		"psychic",
		"Presence",
		"control",
		ALL,
	),
	P(
		"Snare Pulse",
		2,
		"Enchantment",
		"3d6",
		"psychic",
		"Presence",
		"control",
		ALL,
	),
	P(
		"Gravity Cage",
		3,
		"Enchantment",
		"4d6",
		"force",
		"Presence",
		"control",
		ALL,
	),
	P(
		"Stagger Field",
		4,
		"Enchantment",
		"5d6",
		"psychic",
		"Presence",
		"control",
		ALL,
	),
	P(
		"Paralytic Web",
		5,
		"Enchantment",
		"6d6",
		"psychic",
		"Presence",
		"control",
		ALL,
	),
	P(
		"Dominion Snare",
		7,
		"Enchantment",
		"8d6",
		"psychic",
		"Presence",
		"control",
		ALL,
	),
	// ── Elemental (AoE) ────────────────────────────────────────────────────
	P("Cinder Burst", 1, "Evocation", "2d6", "fire", "Agility", "elemental", ALL),
	P("Frost Nova", 2, "Evocation", "3d6", "cold", "Agility", "elemental", ALL),
	P(
		"Arc Discharge",
		3,
		"Evocation",
		"4d6",
		"lightning",
		"Agility",
		"elemental",
		ALL,
	),
	P(
		"Ember Barrage",
		4,
		"Evocation",
		"5d6",
		"fire",
		"Agility",
		"elemental",
		ALL,
	),
	P(
		"Glacier Break",
		5,
		"Evocation",
		"6d6",
		"cold",
		"Agility",
		"elemental",
		ALL,
	),
	P(
		"Thunder Vortex",
		7,
		"Evocation",
		"8d6",
		"lightning",
		"Agility",
		"elemental",
		ALL,
	),
	P(
		"Meteor Crash",
		9,
		"Evocation",
		"10d6",
		"fire",
		"Agility",
		"elemental",
		ALL,
	),
	// ── Precision (exploit) ────────────────────────────────────────────────
	P(
		"Pinpoint Shot",
		1,
		"Transmutation",
		"2d8",
		"piercing",
		"Agility",
		"precision",
		ALL,
	),
	P(
		"Vital Mark",
		2,
		"Transmutation",
		"3d8",
		"piercing",
		"Agility",
		"precision",
		ALL,
	),
	P(
		"Seam Splitter",
		3,
		"Transmutation",
		"4d8",
		"piercing",
		"Agility",
		"precision",
		ALL,
	),
	P(
		"Killing Window",
		4,
		"Transmutation",
		"5d8",
		"piercing",
		"Agility",
		"precision",
		ALL,
	),
	P(
		"Heartseeker",
		5,
		"Transmutation",
		"6d8",
		"piercing",
		"Agility",
		"precision",
		ALL,
	),
	P(
		"Perfect Aim",
		7,
		"Transmutation",
		"8d8",
		"piercing",
		"Agility",
		"precision",
		ALL,
	),
	// ── Entropy (resistance-piercing decay) ────────────────────────────────
	P(
		"Entropic Lash",
		1,
		"Necromancy",
		"2d8",
		"necrotic",
		"Vitality",
		"entropy",
		ALL,
	),
	P(
		"Decay Bolt",
		2,
		"Necromancy",
		"3d8",
		"necrotic",
		"Vitality",
		"entropy",
		ALL,
	),
	P(
		"Rot Surge",
		3,
		"Necromancy",
		"4d8",
		"necrotic",
		"Vitality",
		"entropy",
		ALL,
	),
	P(
		"Void Fracture",
		4,
		"Necromancy",
		"5d8",
		"necrotic",
		"Vitality",
		"entropy",
		ALL,
	),
	P(
		"Unmaking Wave",
		5,
		"Necromancy",
		"6d8",
		"necrotic",
		"Vitality",
		"entropy",
		ALL,
	),
	P(
		"Cessation Pulse",
		7,
		"Necromancy",
		"8d8",
		"necrotic",
		"Vitality",
		"entropy",
		ALL,
	),
	P(
		"Oblivion Tide",
		9,
		"Necromancy",
		"10d8",
		"necrotic",
		"Vitality",
		"entropy",
		ALL,
	),
	// ── Necrotic (drain touch) ─────────────────────────────────────────────
	P(
		"Withering Grasp",
		1,
		"Necromancy",
		"2d6",
		"necrotic",
		"Vitality",
		"necrotic",
		ALL,
	),
	P(
		"Leeching Touch",
		2,
		"Necromancy",
		"3d6",
		"necrotic",
		"Vitality",
		"necrotic",
		ALL,
	),
	P(
		"Grave Siphon",
		3,
		"Necromancy",
		"4d6",
		"necrotic",
		"Vitality",
		"necrotic",
		ALL,
	),
	P(
		"Soul Tap",
		4,
		"Necromancy",
		"5d6",
		"necrotic",
		"Vitality",
		"necrotic",
		ALL,
	),
	P(
		"Life Reaver",
		5,
		"Necromancy",
		"6d6",
		"necrotic",
		"Vitality",
		"necrotic",
		ALL,
	),
	P(
		"Marrow Drinker",
		7,
		"Necromancy",
		"8d6",
		"necrotic",
		"Vitality",
		"necrotic",
		ALL,
	),
	// ── Extra spread to deepen low/mid tiers ───────────────────────────────
	P(
		"Shatter Guard",
		1,
		"Evocation",
		"2d8",
		"thunder",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Concussive Slam",
		2,
		"Evocation",
		"3d8",
		"thunder",
		"Strength",
		"strike",
		ALL,
	),
	P(
		"Riptide Kick",
		1,
		"Transmutation",
		"2d6",
		"bludgeoning",
		"Agility",
		"mobility",
		ALL,
	),
	P(
		"Vault Strike",
		3,
		"Transmutation",
		"4d6",
		"bludgeoning",
		"Agility",
		"mobility",
		ALL,
	),
	P(
		"Suppression Net",
		1,
		"Enchantment",
		"2d6",
		"force",
		"Presence",
		"control",
		ALL,
	),
	P(
		"Mind Spike",
		3,
		"Enchantment",
		"4d6",
		"psychic",
		"Presence",
		"control",
		ALL,
	),
	P("Scorch Line", 2, "Evocation", "3d6", "fire", "Agility", "elemental", ALL),
	P("Sleet Lance", 3, "Evocation", "4d8", "cold", "Agility", "precision", ALL),
	P(
		"Bleeding Cut",
		2,
		"Transmutation",
		"3d8",
		"slashing",
		"Agility",
		"precision",
		ALL,
	),
	P(
		"Hex Bolt",
		1,
		"Necromancy",
		"2d6",
		"necrotic",
		"Intelligence",
		"entropy",
		ALL,
	),
	P(
		"Corrosion Spike",
		3,
		"Necromancy",
		"4d8",
		"acid",
		"Vitality",
		"entropy",
		ALL,
	),
	P(
		"Famine Touch",
		2,
		"Necromancy",
		"3d8",
		"necrotic",
		"Vitality",
		"necrotic",
		ALL,
	),
	P("Bulwark Vow", 1, "Abjuration", "2d6", "radiant", "Vitality", "guard", ALL),
	P(
		"Counter Sentinel",
		2,
		"Abjuration",
		"3d6",
		"force",
		"Strength",
		"vanguard",
		ALL,
	),
	P(
		"Retort Slam",
		3,
		"Abjuration",
		"4d8",
		"thunder",
		"Strength",
		"vanguard",
		ALL,
	),
];
