import type { CompendiumSpell } from "../../../types/compendium";

// ═══════════════════════════════════════════════════════════════════════
// Archetype-shared spell depth.
//
// Part A: caster spell access is gated by SCHOOL, so deepening thin schools
// widens every caster whose school set includes them. These generic,
// non-signature spells primarily backfill Conjuration / Transmutation /
// Divination (Summoner, Esper, Stalker, Herald, Technomancer) plus Abjuration,
// Evocation, Enchantment, and Necromancy depth, spread across ranks D-S.
//
// Built via a factory so each entry satisfies `isAbilityEntryComplete` for
// spells (timing + targeting, structured mechanics, and a save-based
// resolution with a real damage formula + type).
// ═══════════════════════════════════════════════════════════════════════

type Rank = "D" | "C" | "B" | "A" | "S";

// Spell level must fall inside its rank's canonical band:
// D:[0,2], C:[2,4], B:[4,6], A:[6,8], S:[8,9].
const LEVEL_BY_RANK: Record<Rank, number> = { D: 1, C: 2, B: 4, A: 6, S: 8 };
const RARITY_BY_RANK: Record<Rank, string> = {
	D: "common",
	C: "uncommon",
	B: "rare",
	A: "very rare",
	S: "legendary",
};

const CLASSES_BY_SCHOOL: Record<string, string[]> = {
	Conjuration: ["Summoner", "Stalker", "Contractor"],
	Transmutation: [
		"Mage",
		"Esper",
		"Summoner",
		"Stalker",
		"Technomancer",
		"Revenant",
	],
	Divination: [
		"Mage",
		"Esper",
		"Summoner",
		"Herald",
		"Stalker",
		"Technomancer",
	],
	Abjuration: ["Mage", "Herald", "Holy Knight", "Technomancer", "Revenant"],
	Evocation: ["Mage", "Esper", "Herald", "Idol", "Holy Knight", "Technomancer"],
	Enchantment: ["Mage", "Esper", "Idol", "Contractor"],
	Necromancy: ["Mage", "Revenant", "Contractor"],
};

const slug = (name: string): string =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

// Distinct riders woven into each spell's fingerprinted effects so no two
// generated spells collapse to the same functional fingerprint, and to give
// each working a different secondary beat (variety, not filler).
const SPELL_RIDERS = [
	"On a failed save, the target is also marked, glowing faintly until your next turn.",
	"A creature reduced below half its hit points by this spell is knocked prone.",
	"On a failure, the target's speed is halved until the end of its next turn.",
	"This spell ignores the first 5 points of the target's resistance to its damage type.",
	"A failed save also bars the target from taking reactions until your next turn.",
	"If the target is already wounded, it has disadvantage on the save.",
	"On a failure, residual mana clings to the target, dealing 1d4 more at its turn's start.",
	"A creature that fails is pushed 5 feet directly away from the spell's origin.",
	"On a critical failure, the effect's duration against that target doubles.",
	"The spell leaves difficult terrain in a 5-foot radius until your next turn.",
	"On a failure, the target cannot regain hit points until the start of your next turn.",
	"A failed save imposes disadvantage on the target's next saving throw.",
	"If this reduces the target to 0 hit points, you may immediately mark a new target.",
	"On a failure, the target is deafened until the end of its next turn.",
	"A creature that fails sheds dim light, granting attackers advantage until your next turn.",
	"On a failure, the target takes an extra 1d6 if an ally is within 5 feet of it.",
];

let counter = 0;

function S(
	name: string,
	rank: Rank,
	school: string,
	dmg: string,
	dtype: string,
	save: string,
): CompendiumSpell {
	counter += 1;
	const level = LEVEL_BY_RANK[rank];
	// dc 0 is the dynamic spell-save sentinel: the engine resolves the real DC
	// (8 + proficiency + spellcasting modifier) at runtime per character.
	const dc = 0;
	const rider = SPELL_RIDERS[(counter - 1) % SPELL_RIDERS.length];
	const description = `Weave a current of ${school.toLowerCase()} mana at a creature within range. It must make a ${save} save, taking ${dmg} ${dtype} damage on a failure and half as much on a success. ${rider}`;
	const higher = `Damage increases by 1d8 for each rank above ${rank}.`;
	const classes = CLASSES_BY_SCHOOL[school] ?? ["Mage"];
	return {
		id: `spell-arch-${rank.toLowerCase()}-${counter}-${slug(name)}`,
		classes,
		name,
		display_name: name,
		description,
		lore: {
			origin: `A ${school} working catalogued in the Bureau's shared arcane index.`,
			history:
				"Documented and released to every caster whose discipline covers this school.",
			curse: "",
			personality:
				"Stable; the resonance pattern is consistent across casters.",
			current_owner: "Open Bureau arcane curriculum.",
			prior_owners: ["Bureau Arcane Archives"],
		},
		flavor: `${name}: a shared working, not the signature of any single lineage.`,
		tags: ["awakened", "magic", rank, school.toLowerCase()],
		rarity: RARITY_BY_RANK[rank],
		source_book: "Rift Ascendant Canon",
		effects: {
			primary: `${dmg} ${dtype} damage (${save} save for half).`,
			secondary: `${higher} ${rider}`,
		},
		level,
		school,
		casting_time: "1 action",
		range: "60 feet",
		duration: "Instantaneous",
		components: { verbal: true, somatic: true, material: false },
		concentration: false,
		ritual: false,
		rank,
		attack: null,
		saving_throw: {
			ability: save,
			dc,
			success: "Half damage.",
			failure: `${dmg} ${dtype} damage.`,
		},
		atHigherLevels: higher,
		higher_levels: higher,
		area: { type: "point", size: "single target", shape: "point" },
		mechanics: {
			duration: "Instantaneous",
			range: "60 feet",
			type: school,
			damage_profile: `${dmg} ${dtype}`,
			action: "1 action",
			ability: save,
			scaling: "Scales with rank",
		},
		discovery_lore:
			"Drawn from the shared arcane index any qualifying caster may study.",
		theme_tags: [school.toLowerCase()],
	};
}

export const spells_archetype: CompendiumSpell[] = [
	// ── Conjuration (18): Summoner / Stalker / Contractor ───────────────────
	S("Summon Spite Swarm", "D", "Conjuration", "2d6", "piercing", "Agility"),
	S("Conjure Caltrops", "D", "Conjuration", "2d6", "piercing", "Agility"),
	S("Bound Blade", "D", "Conjuration", "2d8", "force", "Agility"),
	S("Hound of the Rift", "C", "Conjuration", "3d6", "force", "Strength"),
	S("Snaring Vines", "C", "Conjuration", "3d6", "bludgeoning", "Strength"),
	S("Conjured Volley", "C", "Conjuration", "3d8", "piercing", "Agility"),
	S("Tentacle Field", "B", "Conjuration", "4d6", "bludgeoning", "Strength"),
	S("Summon Pack Beast", "B", "Conjuration", "4d8", "slashing", "Strength"),
	S("Rift Hound Maul", "B", "Conjuration", "4d6", "piercing", "Agility"),
	S("Conjure Spear Wall", "B", "Conjuration", "4d8", "piercing", "Agility"),
	S("Maw of the Hive", "A", "Conjuration", "5d8", "piercing", "Vitality"),
	S("Summon Apex Beast", "A", "Conjuration", "5d8", "slashing", "Strength"),
	S("Devouring Swarm", "A", "Conjuration", "5d6", "acid", "Vitality"),
	S("Rift the Horde", "S", "Conjuration", "6d8", "force", "Vitality"),
	S("Avatar of the Wild", "S", "Conjuration", "6d8", "slashing", "Strength"),
	S("Conjure Lesser Swarm", "D", "Conjuration", "2d6", "acid", "Vitality"),
	S("Thornfang Strike", "C", "Conjuration", "3d8", "piercing", "Agility"),
	S("Pack Ambush", "B", "Conjuration", "4d6", "slashing", "Agility"),
	// ── Transmutation (16): Summoner / Esper / Stalker / Techno / Revenant ──
	S("Caustic Transmute", "D", "Transmutation", "2d8", "acid", "Vitality"),
	S("Kinetic Accelerate", "D", "Transmutation", "2d6", "force", "Agility"),
	S("Stone Spikes", "C", "Transmutation", "3d8", "piercing", "Agility"),
	S("Flesh to Slag", "C", "Transmutation", "3d6", "acid", "Vitality"),
	S("Gravity Crush", "B", "Transmutation", "4d8", "force", "Strength"),
	S("Rust Wave", "B", "Transmutation", "4d6", "acid", "Vitality"),
	S("Rending Flux", "B", "Transmutation", "4d8", "bludgeoning", "Strength"),
	S("Disintegrate Edge", "A", "Transmutation", "5d8", "force", "Vitality"),
	S("Tectonic Crush", "A", "Transmutation", "5d6", "force", "Vitality"),
	S("Unmake Matter", "S", "Transmutation", "6d8", "force", "Vitality"),
	S("Accelerant Burst", "D", "Transmutation", "2d6", "fire", "Agility"),
	S("Warp Step Strike", "C", "Transmutation", "3d6", "force", "Agility"),
	S("Heavy Field", "C", "Transmutation", "3d8", "force", "Strength"),
	S("Corrode Armor", "B", "Transmutation", "4d6", "acid", "Vitality"),
	S("Entropy Transmute", "A", "Transmutation", "5d8", "necrotic", "Vitality"),
	S("Singularity Pull", "S", "Transmutation", "6d6", "force", "Strength"),
	// ── Divination (16): Mage / Esper / Summoner / Herald / Stalker / Techno ─
	S("Mind Lance", "D", "Divination", "2d8", "psychic", "Sense"),
	S("Foresight Strike", "D", "Divination", "2d6", "psychic", "Sense"),
	S("Piercing Insight", "C", "Divination", "3d8", "psychic", "Sense"),
	S("Truesight Bolt", "C", "Divination", "3d6", "radiant", "Sense"),
	S("Premonition Cut", "B", "Divination", "4d8", "psychic", "Sense"),
	S("Mind Fracture", "B", "Divination", "4d6", "psychic", "Sense"),
	S("Augur's Judgment", "B", "Divination", "4d8", "radiant", "Sense"),
	S("Fate Sever", "A", "Divination", "5d8", "psychic", "Sense"),
	S("Omniscient Strike", "A", "Divination", "5d6", "psychic", "Sense"),
	S("Eye of the End", "S", "Divination", "6d8", "psychic", "Sense"),
	S("Probing Pulse", "D", "Divination", "2d6", "force", "Sense"),
	S("Exploit Flaw", "C", "Divination", "3d8", "force", "Sense"),
	S("Augur Spike", "C", "Divination", "3d6", "psychic", "Sense"),
	S("Prophetic Ruin", "B", "Divination", "4d6", "radiant", "Sense"),
	S("Certain Death", "A", "Divination", "5d8", "necrotic", "Sense"),
	S("Inevitability", "S", "Divination", "6d6", "psychic", "Sense"),
	// ── Abjuration (8): Herald / Holy Knight / Technomancer / Revenant ──────
	S("Warding Flare", "D", "Abjuration", "2d8", "radiant", "Vitality"),
	S("Null Field", "C", "Abjuration", "3d8", "force", "Vitality"),
	S("Banishing Pulse", "B", "Abjuration", "4d8", "radiant", "Presence"),
	S("Dispelling Lance", "B", "Abjuration", "4d6", "force", "Vitality"),
	S("Sanctuary Burst", "A", "Abjuration", "5d8", "radiant", "Presence"),
	S("Aegis Detonation", "A", "Abjuration", "5d6", "force", "Vitality"),
	S("Absolute Ward", "S", "Abjuration", "6d8", "radiant", "Presence"),
	S("Rebuke the Profane", "C", "Abjuration", "3d6", "radiant", "Presence"),
	// ── Evocation (6): Herald / Esper / Idol / Holy Knight / Technomancer ───
	S("Searing Lance", "C", "Evocation", "3d8", "fire", "Agility"),
	S("Storm Hammer", "B", "Evocation", "4d8", "lightning", "Agility"),
	S("Radiant Beam", "B", "Evocation", "4d6", "radiant", "Vitality"),
	S("Frost Detonation", "A", "Evocation", "5d8", "cold", "Vitality"),
	S("Sunfire Pillar", "A", "Evocation", "5d6", "fire", "Agility"),
	S("Cataclysm Bolt", "S", "Evocation", "6d8", "lightning", "Agility"),
	// ── Enchantment (6): Esper / Idol / Contractor ─────────────────────────
	S("Discordant Note", "D", "Enchantment", "2d6", "psychic", "Presence"),
	S("Compelling Word", "C", "Enchantment", "3d6", "psychic", "Presence"),
	S("Maddening Chord", "B", "Enchantment", "4d6", "psychic", "Presence"),
	S("Crushing Despair", "A", "Enchantment", "5d6", "psychic", "Presence"),
	S("Mind Shatter", "A", "Enchantment", "5d8", "psychic", "Presence"),
	S("Absolute Command", "S", "Enchantment", "6d6", "psychic", "Presence"),
	// ── Necromancy (8): Mage / Revenant / Contractor ───────────────────────
	S("Wither Bolt", "D", "Necromancy", "2d8", "necrotic", "Vitality"),
	S("Sepulchral Wither", "C", "Necromancy", "3d8", "necrotic", "Vitality"),
	S("Soul Leech", "C", "Necromancy", "3d6", "necrotic", "Vitality"),
	S("Corpse Bloom", "B", "Necromancy", "4d8", "necrotic", "Vitality"),
	S("Entropy Surge", "B", "Necromancy", "4d6", "necrotic", "Vitality"),
	S("Death Spiral", "A", "Necromancy", "5d8", "necrotic", "Vitality"),
	S("Soul Harvest", "A", "Necromancy", "5d6", "necrotic", "Vitality"),
	S("Annihilation Word", "S", "Necromancy", "6d8", "necrotic", "Vitality"),
];
