import type { CompendiumTechnique } from "../../types/compendium";

// ═══════════════════════════════════════════════════════════════════════
// Archetype-shared martial techniques.
//
// Part A of the "Archetype-Shared Ability Catalogs" plan: the technique pool
// is gated by ARCHETYPE membership — every martial-capable job sees the whole
// pool. These are generic, fully-fleshed stances and maneuvers carrying no
// job-signature names. Built via a factory so each entry satisfies
// `isAbilityEntryComplete` for techniques (activation/range/duration,
// structured mechanics, usage + recharge limits, and a save-based resolution).
// ═══════════════════════════════════════════════════════════════════════

type Theme =
	| "vanguard"
	| "brutal"
	| "precision"
	| "stance"
	| "ambush"
	| "kinetic"
	| "entropy"
	| "survival";

interface ThemeConfig {
	activation: string;
	range: string;
	duration: string;
	ability: string;
	template: (dmg: string, dtype: string, save: string) => string;
	secondary: string;
	// 5e rest cadence: defensive/stance/survival/unarmed arts recover on a short
	// rest; heavy/precision/ambush/entropy strikes recover on a long rest.
	rest: "short rest" | "long rest";
}

// 5e per-use charge formula, tiered by technique level so low-level forms get
// the proficiency-bonus feel and high-level forms stay rare. Resolved
// per-character at runtime by computeTechniqueUses/parseUses.
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
	vanguard: {
		activation: "reaction",
		range: "Self",
		duration: "Instantaneous",
		ability: "Strength",
		template: (dmg, dtype, save) =>
			`Plant yourself between an ally and harm. The attacker must make a ${save} save, taking ${dmg} ${dtype} damage on a failure as your guard turns its momentum back on it.`,
		secondary: "Damage scales at higher tiers.",
		rest: "short rest",
	},
	brutal: {
		activation: "action",
		range: "Melee",
		duration: "Instantaneous",
		ability: "Strength",
		template: (dmg, dtype, save) =>
			`Commit to a savage swing. The target must make a ${save} save, taking ${dmg} ${dtype} damage on a failure and being knocked prone.`,
		secondary: "Damage scales at higher tiers.",
		rest: "long rest",
	},
	precision: {
		activation: "action",
		range: "Melee",
		duration: "Instantaneous",
		ability: "Agility",
		template: (dmg, dtype, save) =>
			`Strike a vital line with trained precision. The target must make a ${save} save, taking ${dmg} ${dtype} damage on a failure and bleeding at the start of its next turn.`,
		secondary: "Damage scales at higher tiers.",
		rest: "long rest",
	},
	stance: {
		activation: "bonus action",
		range: "Self",
		duration: "1 minute",
		ability: "Strength",
		template: (dmg, dtype, save) =>
			`Settle into a disciplined stance for 1 minute. The first creature to strike you each round must make a ${save} save, taking ${dmg} ${dtype} damage on a failure as you redirect the impact.`,
		secondary: "Damage scales at higher tiers.",
		rest: "short rest",
	},
	ambush: {
		activation: "action",
		range: "Melee",
		duration: "Instantaneous",
		ability: "Agility",
		template: (dmg, dtype, save) =>
			`Strike from concealment or surprise. The target must make a ${save} save, taking ${dmg} ${dtype} damage on a failure; on a failure against a creature unaware of you, the strike is a critical hit.`,
		secondary: "Damage scales at higher tiers.",
		rest: "long rest",
	},
	kinetic: {
		activation: "action",
		range: "Melee",
		duration: "Instantaneous",
		ability: "Agility",
		template: (dmg, dtype, save) =>
			`Channel breath and momentum through an unarmed flurry. The target must make a ${save} save, taking ${dmg} ${dtype} damage on a failure and being pushed 10 feet.`,
		secondary: "Damage scales at higher tiers.",
		rest: "short rest",
	},
	entropy: {
		activation: "action",
		range: "Melee",
		duration: "Instantaneous",
		ability: "Intelligence",
		template: (dmg, dtype, save) =>
			`Lace your weapon with decay. The target must make a ${save} save, taking ${dmg} ${dtype} damage on a failure; this damage ignores resistance.`,
		secondary: "Damage scales at higher tiers.",
		rest: "long rest",
	},
	survival: {
		activation: "bonus action",
		range: "Self",
		duration: "1 minute",
		ability: "Vitality",
		template: (dmg, dtype, save) =>
			`Steel your body against the worst the gate can give. For 1 minute, a creature that hits you in melee must make a ${save} save, taking ${dmg} ${dtype} damage on a failure from your retaliatory reflex.`,
		secondary: "Damage scales at higher tiers.",
		rest: "short rest",
	},
};

const STYLE_BY_THEME: Record<Theme, string> = {
	vanguard: "Defense",
	brutal: "Heavy Weapon",
	precision: "Blade",
	stance: "Stance",
	ambush: "Ambush",
	kinetic: "Unarmed",
	entropy: "Weapon",
	survival: "Survival",
};

const RARITY_BY_LEVEL = (level: number): string =>
	level >= 7
		? "very rare"
		: level >= 5
			? "rare"
			: level >= 3
				? "uncommon"
				: "common";

const slug = (name: string): string =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

// Distinct tactical riders woven into each technique's description so no two
// generated entries collapse to the same functional fingerprint, and to give
// each maneuver a genuinely different secondary effect (variety, not filler).
const RIDERS = [
	"The target is knocked off-balance and has disadvantage on its next attack roll.",
	"On a failure, the target is also pushed 5 feet directly away from you.",
	"A creature that fails is marked, granting your allies advantage against it until your next turn.",
	"Against a target below half its hit points, this maneuver's damage ignores resistance.",
	"You may immediately shift 5 feet without provoking opportunity attacks.",
	"On a hit, the target's speed is halved until the end of its next turn.",
	"A failed save leaves the target unable to take reactions until your next turn.",
	"If this reduces the target to 0 hit points, you regain one use of this technique.",
	"The strike ignores the first 5 points of any damage resistance the target has.",
	"On a failure, the target drops one non-magical item it is holding.",
	"You gain 1d6 temporary hit points for each creature this maneuver hits.",
	"A creature that fails is frightened of you until the end of its next turn.",
	"The blow lands hard enough to deafen the target until your next turn.",
	"On a failure, the target takes an extra 1d4 damage at the start of its next turn.",
	"You may redirect half the damage dealt to a second creature within 5 feet of the target.",
	"While you are below half your hit points, this maneuver deals an extra 1d6 damage.",
	"A failed save imposes disadvantage on the target's next saving throw.",
	"On a hit, you may stand up from prone or end one effect restraining you.",
	"The target cannot regain hit points until the start of your next turn.",
	"If an ally is already engaged with the target, this maneuver's damage increases by 1d6.",
	"On a failure, the target is blinded until the end of its next turn.",
	"You may move up to 10 feet immediately before or after resolving this maneuver.",
	"A creature dropped below a quarter of its hit points by this maneuver loses its reaction.",
	"On a hit, your next attack this turn against the same target has advantage.",
	"The target is grappled until the end of your next turn if it is your size or smaller.",
	"On a failure, the target's attacks deal half damage until the end of its next turn.",
	"You bolster the nearest ally within 10 feet, granting them 1d6 temporary hit points.",
	"A failed save also severs any concentration the target is maintaining.",
	"On a hit, difficult terrain spreads in a 5-foot radius around the target until your next turn.",
	"The target is silenced and cannot speak or cast verbal abilities until your next turn.",
	"If you have not yet acted against this target this combat, the strike is a critical hit on a failure.",
	"On a failure, the target is pulled 5 feet toward you and cannot move away until your next turn.",
];

let counter = 0;

function T(
	name: string,
	level: number,
	dmg: string,
	dtype: string,
	save: string,
	theme: Theme,
	classes: string[],
): CompendiumTechnique {
	counter += 1;
	const cfg = THEME_CONFIG[theme];
	const style = STYLE_BY_THEME[theme];
	// dc 0 is the dynamic save sentinel: the engine resolves the real DC
	// (8 + proficiency bonus + ability modifier) per character at runtime.
	const dc = 0;
	const rider = RIDERS[(counter - 1) % RIDERS.length];
	const description = `${cfg.template(dmg, dtype, save)} ${rider}`;
	const scaleDie = Number(dmg.match(/d(\d+)/)?.[1] ?? "8");
	const secondary = scalingProse(level, scaleDie);
	const uses = chargeFormula(level, cfg.rest);
	const recharge = uses.includes("/short rest") ? "short rest" : "long rest";
	return {
		id: `tech-arch-${level}-${counter}-${slug(name)}`,
		classes,
		name,
		display_name: name,
		description,
		lore: {
			origin: `A ${theme} maneuver drilled into the Bureau's shared martial syllabus.`,
			history:
				"Field-validated and released to every martial-capable awakened.",
			curse: "",
			personality:
				"Disciplined; the form is taught identically across every chapter house.",
			current_owner: "Open Bureau curriculum for martial-capable awakened.",
			prior_owners: ["Bureau Combat Archives"],
		},
		flavor: `${name}: a shared form, earned through repetition rather than bloodline.`,
		tags: ["awakened", "technique", theme, style],
		rarity: RARITY_BY_LEVEL(level),
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: description,
			secondary,
		},
		type: "Combat Arts",
		style,
		level_requirement: level,
		uses_per_rest_formula: uses,
		activation: { type: cfg.activation },
		range: cfg.range,
		duration: cfg.duration,
		components: { verbal: false, somatic: true, material: false },
		mechanics: {
			duration: cfg.duration,
			damage_profile: `${dmg} ${dtype}`,
			range: cfg.range,
			type: theme,
			action: `1 ${cfg.activation}`,
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
		theme_tags: [theme, style.toLowerCase()],
	};
}

const ALL = [
	"Destroyer",
	"Berserker",
	"Assassin",
	"Striker",
	"Holy Knight",
	"Stalker",
	"Technomancer",
];

export const techniques_archetype: CompendiumTechnique[] = [
	// ── Level 1 (18) ───────────────────────────────────────────────────────
	T("Bracing Stand", 1, "1d8", "force", "Strength", "vanguard", ALL),
	T("Shield Check", 1, "1d8", "bludgeoning", "Strength", "vanguard", ALL),
	T("Overhead Smash", 1, "1d10", "bludgeoning", "Strength", "brutal", ALL),
	T("Wide Cleave", 1, "1d8", "slashing", "Strength", "brutal", ALL),
	T("Quick Jab", 1, "1d6", "piercing", "Agility", "precision", ALL),
	T("Low Cut", 1, "1d8", "slashing", "Agility", "precision", ALL),
	T("Ready Guard", 1, "1d6", "force", "Strength", "stance", ALL),
	T("Coiled Spring", 1, "1d6", "force", "Strength", "stance", ALL),
	T("Back-Alley Strike", 1, "1d8", "piercing", "Agility", "ambush", ALL),
	T("Throat Jab", 1, "1d6", "bludgeoning", "Agility", "ambush", ALL),
	T("Palm Thrust", 1, "1d6", "bludgeoning", "Agility", "kinetic", ALL),
	T("Sweeping Kick", 1, "1d8", "bludgeoning", "Agility", "kinetic", ALL),
	T("Withering Edge", 1, "1d8", "necrotic", "Vitality", "entropy", ALL),
	T("Rusting Cut", 1, "1d6", "acid", "Vitality", "entropy", ALL),
	T("Grit Through", 1, "1d6", "force", "Vitality", "survival", ALL),
	T("Second Wind Stand", 1, "1d6", "force", "Vitality", "survival", ALL),
	T("Guard Break", 1, "1d8", "bludgeoning", "Strength", "vanguard", ALL),
	T("Opening Feint", 1, "1d6", "piercing", "Agility", "ambush", ALL),
	// ── Level 3 (20) ─────────────────────────────────────────────────────────
	T("Interpose", 3, "2d8", "force", "Strength", "vanguard", ALL),
	T("Counter Bash", 3, "2d8", "bludgeoning", "Strength", "vanguard", ALL),
	T("Crushing Overhead", 3, "3d8", "bludgeoning", "Strength", "brutal", ALL),
	T("Reaping Swing", 3, "2d10", "slashing", "Strength", "brutal", ALL),
	T("Twin Fang Cut", 3, "2d8", "piercing", "Agility", "precision", ALL),
	T("Tendon Slice", 3, "2d8", "slashing", "Agility", "precision", ALL),
	T("Iron Posture", 3, "2d6", "force", "Strength", "stance", ALL),
	T("Flowing Guard", 3, "2d6", "force", "Agility", "stance", ALL),
	T("Shadow Pounce", 3, "2d10", "slashing", "Agility", "ambush", ALL),
	T("Blindside Cut", 3, "2d8", "slashing", "Agility", "ambush", ALL),
	T("Thunder Palm", 3, "2d8", "thunder", "Agility", "kinetic", ALL),
	T("Spinning Heel", 3, "2d8", "bludgeoning", "Agility", "kinetic", ALL),
	T("Corroding Slash", 3, "2d8", "necrotic", "Vitality", "entropy", ALL),
	T("Blight Thrust", 3, "2d8", "necrotic", "Intelligence", "entropy", ALL),
	T("Endure Pain", 3, "2d6", "force", "Vitality", "survival", ALL),
	T("Battle Trance", 3, "2d6", "force", "Vitality", "survival", ALL),
	T("Shield Slam", 3, "2d8", "bludgeoning", "Strength", "vanguard", ALL),
	T("Heavy Backhand", 3, "2d10", "bludgeoning", "Strength", "brutal", ALL),
	T("Pressure Point", 3, "2d6", "piercing", "Agility", "precision", ALL),
	T("Decay Riposte", 3, "2d6", "necrotic", "Vitality", "entropy", ALL),
	// ── Level 5 (30, mid-tier heavy) ─────────────────────────────────────────
	T("Bulwark Counter", 5, "3d8", "force", "Strength", "vanguard", ALL),
	T("Aegis Riposte", 5, "3d8", "thunder", "Strength", "vanguard", ALL),
	T("Sentinel Slam", 5, "3d10", "bludgeoning", "Strength", "vanguard", ALL),
	T("Devastating Cleave", 5, "4d8", "slashing", "Strength", "brutal", ALL),
	T("Earthshaker Blow", 5, "4d10", "bludgeoning", "Strength", "brutal", ALL),
	T("Berserk Rend", 5, "4d8", "slashing", "Strength", "brutal", ALL),
	T("Vital Puncture", 5, "3d10", "piercing", "Agility", "precision", ALL),
	T("Arterial Slash", 5, "3d8", "slashing", "Agility", "precision", ALL),
	T("Phantom Edge", 5, "3d10", "piercing", "Agility", "precision", ALL),
	T("Mountain Stance", 5, "3d6", "force", "Strength", "stance", ALL),
	T("River Stance", 5, "3d6", "cold", "Agility", "stance", ALL),
	T("Ember Stance", 5, "3d6", "fire", "Strength", "stance", ALL),
	T("Killer Instinct", 5, "4d8", "piercing", "Agility", "ambush", ALL),
	T("Silent Execution", 5, "4d10", "piercing", "Agility", "ambush", ALL),
	T("Garrote Strike", 5, "3d8", "slashing", "Agility", "ambush", ALL),
	T("Hurricane Kick", 5, "3d10", "bludgeoning", "Agility", "kinetic", ALL),
	T("Iron Fist Barrage", 5, "3d8", "bludgeoning", "Agility", "kinetic", ALL),
	T("Pressure Wave", 5, "3d8", "thunder", "Agility", "kinetic", ALL),
	T("Entropy Cleave", 5, "4d8", "necrotic", "Vitality", "entropy", ALL),
	T("Rotting Thrust", 5, "3d10", "necrotic", "Intelligence", "entropy", ALL),
	T("Decay Sunder", 5, "3d8", "necrotic", "Vitality", "entropy", ALL),
	T("Unbowed Stand", 5, "3d6", "force", "Vitality", "survival", ALL),
	T("Pain Threshold", 5, "3d6", "force", "Vitality", "survival", ALL),
	T("Bloodied Resolve", 5, "3d8", "force", "Vitality", "survival", ALL),
	T("Guard Crusher", 5, "3d10", "bludgeoning", "Strength", "vanguard", ALL),
	T("Reckless Hew", 5, "4d8", "slashing", "Strength", "brutal", ALL),
	T("Eye Slit", 5, "3d8", "piercing", "Agility", "precision", ALL),
	T("Coiled Strike", 5, "3d8", "force", "Strength", "stance", ALL),
	T("Ghost Cut", 5, "3d10", "slashing", "Agility", "ambush", ALL),
	T("Withering Flurry", 5, "3d8", "necrotic", "Intelligence", "entropy", ALL),
	// ── Level 7 (16) ───────────────────────────────────────────────────────
	T("Immovable Aegis", 7, "5d8", "force", "Strength", "vanguard", ALL),
	T("Titanic Smash", 7, "5d10", "bludgeoning", "Strength", "brutal", ALL),
	T("Ruinous Cleave", 7, "5d8", "slashing", "Strength", "brutal", ALL),
	T("Death Mark Strike", 7, "5d10", "piercing", "Agility", "precision", ALL),
	T("Perfect Incision", 7, "5d8", "slashing", "Agility", "precision", ALL),
	T("Adamant Stance", 7, "4d6", "force", "Strength", "stance", ALL),
	T("Tempest Stance", 7, "4d6", "lightning", "Agility", "stance", ALL),
	T("Assassinate", 7, "6d8", "piercing", "Agility", "ambush", ALL),
	T("Shadow Massacre", 7, "5d10", "slashing", "Agility", "ambush", ALL),
	T("Dragon Kick", 7, "5d10", "bludgeoning", "Agility", "kinetic", ALL),
	T("Thousand Palms", 7, "5d8", "bludgeoning", "Agility", "kinetic", ALL),
	T("Annihilating Edge", 7, "5d8", "necrotic", "Intelligence", "entropy", ALL),
	T("Plague Cleave", 7, "5d10", "necrotic", "Vitality", "entropy", ALL),
	T("Last Bastion", 7, "4d8", "force", "Vitality", "survival", ALL),
	T("Undying Stand", 7, "4d8", "force", "Vitality", "survival", ALL),
	T("Crippling Counter", 7, "5d8", "bludgeoning", "Strength", "vanguard", ALL),
	// ── Level 9 (12) ───────────────────────────────────────────────────────
	T("World Aegis", 9, "6d8", "force", "Strength", "vanguard", ALL),
	T("Cataclysm Swing", 9, "6d10", "bludgeoning", "Strength", "brutal", ALL),
	T("Sundering Apocalypse", 9, "6d10", "slashing", "Strength", "brutal", ALL),
	T("Fatal Precision", 9, "6d10", "piercing", "Agility", "precision", ALL),
	T("Severing Truth", 9, "6d8", "slashing", "Agility", "precision", ALL),
	T("Eternal Stance", 9, "5d6", "force", "Strength", "stance", ALL),
	T("Death From Nowhere", 9, "7d8", "piercing", "Agility", "ambush", ALL),
	T("Final Flurry", 9, "6d10", "bludgeoning", "Agility", "kinetic", ALL),
	T(
		"Total Annihilation Cut",
		9,
		"6d10",
		"necrotic",
		"Intelligence",
		"entropy",
		ALL,
	),
	T("Entropy Apex", 9, "6d8", "necrotic", "Vitality", "entropy", ALL),
	T("Deathless Bastion", 9, "5d8", "force", "Vitality", "survival", ALL),
	T("Reaper Counter", 9, "6d8", "necrotic", "Vitality", "vanguard", ALL),
];
