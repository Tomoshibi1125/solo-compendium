#!/usr/bin/env node
/**
 * enrich-all-compendium.mjs
 * Deterministic enrichment of ALL Rift Ascendant compendium data.
 * Fills empty lore, mechanics, effects, limitations, tags across all categories.
 * Seeded PRNG ensures identical output on every run.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const _SRC = path.join(ROOT, "src", "data", "compendium");

// ═══════════════════════════════════════════════════════════════
// PRNG — Deterministic random seeded on entity ID
// ═══════════════════════════════════════════════════════════════
function cyrb128(str) {
	let h1 = 1779033703,
		h2 = 3144134277,
		h3 = 1013904242,
		h4 = 2773480762;
	for (let i = 0; i < str.length; i++) {
		const k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	return [
		(h1 ^ h2 ^ h3 ^ h4) >>> 0,
		(h2 ^ h1) >>> 0,
		(h3 ^ h1) >>> 0,
		(h4 ^ h1) >>> 0,
	];
}
function sfc32(a, b, c, d) {
	return () => {
		a >>>= 0;
		b >>>= 0;
		c >>>= 0;
		d >>>= 0;
		let t = (a + b) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		d = (d + 1) | 0;
		t = (t + d) | 0;
		c = (t + c) | 0;
		return (t >>> 0) / 4294967296;
	};
}
function makeRand(id) {
	const s = cyrb128(`${id}_rift_v3`);
	return sfc32(s[0], s[1], s[2], s[3]);
}
function pick(arr, r) {
	return arr[Math.floor(r() * arr.length)];
}
function pickN(arr, n, r) {
	const s = [...arr];
	for (let i = s.length - 1; i > 0; i--) {
		const j = Math.floor(r() * (i + 1));
		[s[i], s[j]] = [s[j], s[i]];
	}
	return s.slice(0, Math.min(n, s.length));
}
function chance(pct, r) {
	return r() < pct;
}

// ═══════════════════════════════════════════════════════════════
// WORD POOLS — Massive variety banks for every field
// ═══════════════════════════════════════════════════════════════

const ORIGINS = [
	"Extracted from the dimensional residue of a collapsed B-Rank Gate in downtown Seoul.",
	"Recovered from the personal vault of a National-Level Hunter who vanished during the Jeju Island Raid.",
	"Decoded from ancient sigil-stones found beneath the ruins of a pre-Awakening temple in Kyoto.",
	"Manifested spontaneously during a double-dungeon event in the American Midwest.",
	"Reverse-engineered from Architect combat data recovered by the Hunter Bureau's R&D division.",
	"Crystallized from raw mana overflow during the catastrophic Seoul Gate Breach of Year 7.",
	"Salvaged from the corpse of an S-Rank anomaly that breached containment in the European Dead Zone.",
	"Unearthed by a mining Guild operating in the mana-saturated quarries of the Australian Outback.",
	"Translated from forbidden shadow-language inscriptions found in a Monarch's throne room.",
	"Born from a System glitch that briefly merged two overlapping Gate instances.",
	"Distilled from the ambient mana of a Red Gate that refused to close for seventeen days.",
	"Created by an unnamed Awakened blacksmith who fed their own life force into the forge.",
	"Discovered embedded in the spine of a petrified World Tree fragment found in Scandinavia.",
	"Emerged from the Hunter Association's classified Project: Lattice Break experiments.",
	"Pulled from the dreams of a comatose S-Rank Hunter by a team of psychic-type Awakened.",
	"Formed naturally in a mana vein so dense that reality itself began to crystallize around it.",
	"Stolen from a Guild vault during the Three-Day War between rival Korean Hunter factions.",
	"Gifted by a dying Regent as payment for a debt that predates human civilization.",
	"Reconstructed from fragments scattered across seven different C-Rank dungeons.",
	"Leaked through a micro-rift that appeared inside the International Hunter Conference hall.",
	"Synthesized in the clandestine laboratories beneath the Chinese Hunter Bureau headquarters.",
	"Found clutched in the hand of a petrified E-Rank Hunter who had been missing for three years.",
	"Woven from the screams of a Gate Boss that achieved sentience moments before death.",
	"Excavated from a pocket dimension that existed for exactly one hour before collapsing.",
	"Confiscated from a black-market dealer operating in the shadow districts of Manila.",
];

const HISTORIES = [
	"First documented during the Second Awakening Wave, when Hunters worldwide reported spontaneous power surges.",
	"Records indicate this was used by the original Clearing Party that neutralized the first S-Rank Gate on Korean soil.",
	"The Hunter Bureau classified this as a Level-4 threat vector before it was repurposed for field operations.",
	"Guild archives show at least three S-Rank Hunters have died attempting to master its full potential.",
	"This technique was banned by the International Guild Association for eighteen months before being reclassified.",
	"Originally developed as a countermeasure against Monarch-class entities during the Sovereignty Wars.",
	"Historical analysis suggests this predates the modern Gate system by several centuries.",
	"The first recorded use caused a localized reality fracture that took a specialized team forty hours to repair.",
	"Multiple Guilds have attempted to replicate this; all reproductions have proven inferior to the original.",
	"Intelligence reports link this to the Shadow Monarch's army, though the connection remains unconfirmed.",
	"This was one of twelve artifacts recovered from the infamous Kamish Raid that changed modern Hunter warfare.",
	"A-Rank appraiser Yoo Myung-Han personally verified its authenticity before it entered general circulation.",
	"The Japanese Hunter Association attempted to classify this as a national treasure to prevent export.",
	"Field reports indicate prolonged exposure causes minor spatial distortions in a three-meter radius.",
	"This was the subject of a bidding war between three S-Rank Guilds that nearly escalated to armed conflict.",
	"Originally thought to be a failed experiment, it was rediscovered when a junior researcher noticed anomalous readings.",
	"The European Hunter Council maintains a standing bounty for information regarding its original creator.",
	"Combat logs from the Busan Incident show this was used to hold a Gate breach for forty-seven minutes.",
	"Archaeological evidence suggests ancient civilizations may have accessed similar power through ritual sacrifice.",
	"The American Hunter Bureau's Project: Starfall attempted to weaponize this before the program was defunded.",
];

const DISCOVERY_LORE = [
	"Found pulsing with residual mana in the aftermath of a Gate break, half-buried in shattered concrete.",
	"Discovered by an E-Rank Hunter who stumbled into an unmarked side passage during a routine dungeon clear.",
	"Appeared in a Hunter's inventory after a System notification that no one else could see.",
	"Sold by a mysterious merchant who appears only during full moons near active Gate sites.",
	"Dropped by a mini-boss that shouldn't have existed according to the Gate's difficulty rating.",
	"Found in a hidden compartment of a relic weapon that had been in Guild storage for years.",
	"Materialized on a Hunter's workbench overnight, leaving scorch marks in the shape of unknown glyphs.",
	"Recovered from a time-locked chest that required three different elemental keys to open.",
	"Purchased from a black-market auction in the underground district of Neo-Seoul for an undisclosed sum.",
	"Gifted by the System itself as a reward for completing a hidden quest chain.",
	"Excavated from the crystallized mana deposit at the center of a depleted Gate core.",
	"Found washed ashore near a coastal Gate, wrapped in fabric that dissolved upon touch.",
	"Traded by a nomadic Awakened who claimed to have no memory of acquiring it.",
	"Located by a detection-type Hunter whose radar ability triggered on an otherwise empty room.",
	"Emerged from a Gate Boss's dissolution cloud, hovering where the creature's heart had been.",
];

const CURSES = [
	"Prolonged use causes the wielder's shadow to move independently, whispering in dead languages.",
	"Each activation permanently reduces the user's maximum HP by 1, imperceptible until it's too late.",
	"The user becomes unable to dream, replaced by visions of the void between Gates.",
	"Leaves a faint mark on the soul visible to Monarchs and entities of comparable power.",
	"Causes mild paranoia after extended use; the user becomes convinced they are being watched through mirrors.",
	"The user's blood turns slightly luminescent, making stealth in darkness progressively more difficult.",
	"Creates a sympathetic bond with the nearest Gate; the user feels physical pain when Gates are destroyed.",
	"Prolonged wielders report hearing a second heartbeat that doesn't match their own.",
	"Corrupts nearby healing magic by 10%, causing heals to occasionally deal damage instead.",
	"The user's reflection in still water shows them as they will look at the moment of their death.",
];

const FLAVOR_VERBS = [
	"Shatters",
	"Unravels",
	"Devours",
	"Eclipses",
	"Ignites",
	"Silences",
	"Crushes",
	"Commands",
	"Reclaims",
	"Absorbs",
	"Binds",
	"Overrides",
	"Fractures",
	"Annihilates",
	"Warps",
	"Corrodes",
	"Sanctifies",
	"Mirrors",
	"Rends",
	"Dissolves",
	"Inverts",
	"Condemns",
	"Purges",
	"Erases",
];
const FLAVOR_OBJECTS = [
	"the fabric of reality",
	"the laws of physics",
	"the boundary between life and death",
	"the architect's design",
	"the dimensional barrier",
	"the concept of distance",
	"the illusion of safety",
	"the chains of mortality",
	"the flow of causality",
	"the silence between heartbeats",
	"the threshold of human potential",
	"the last defense of the unprepared",
	"the certainty of outcomes",
	"the architecture of the soul",
	"the remnants of a dead world",
];
const FLAVOR_CAPS = [
	"A testament to what Hunters have become.",
	"The final equation in a war without end.",
	"A beautiful catastrophe measured in milliseconds.",
	"The reason S-Rank Gates are feared.",
	"A reminder that the System has no mercy.",
	"The breaking point of all resistance.",
	"Proof that some things cannot be survived.",
	"The last thing many anomalies ever see.",
	"A whisper from the edge of oblivion.",
	"The death of hesitation, made manifest.",
	"Evolution compressed into a single, violent instant.",
	"The line between Hunter and monster.",
];

// ═══ SPELL-SPECIFIC POOLS ═══
const SCHOOLS = [
	"Evocation",
	"Conjuration",
	"Abjuration",
	"Transmutation",
	"Necromancy",
	"Divination",
	"Enchantment",
	"Illusion",
];
const DAMAGE_TYPES = [
	"fire",
	"cold",
	"lightning",
	"necrotic",
	"force",
	"radiant",
	"psychic",
	"thunder",
	"acid",
	"poison",
];
const CASTING_TIMES = ["1 action", "1 bonus action", "1 reaction", "1 minute"];
const RANGES_SPELL = [
	"Self",
	"Touch",
	"30 feet",
	"60 feet",
	"90 feet",
	"120 feet",
	"150 feet",
	"300 feet",
];
const DURATIONS_SPELL = [
	"Instantaneous",
	"1 round",
	"1 minute",
	"10 minutes",
	"1 hour",
	"8 hours",
	"24 hours",
	"Until dispelled",
];
const AREAS = [
	{ type: "sphere", size: "10-foot", shape: "sphere" },
	{ type: "sphere", size: "20-foot", shape: "sphere" },
	{ type: "cone", size: "15-foot", shape: "cone" },
	{ type: "cone", size: "30-foot", shape: "cone" },
	{ type: "cone", size: "60-foot", shape: "cone" },
	{ type: "line", size: "30-foot", shape: "line" },
	{ type: "line", size: "60-foot", shape: "line" },
	{ type: "line", size: "100-foot", shape: "line" },
	{ type: "cube", size: "10-foot", shape: "cube" },
	{ type: "cube", size: "20-foot", shape: "cube" },
	{ type: "point", size: "single target", shape: "point" },
	{ type: "cylinder", size: "20-foot", shape: "cylinder" },
];
const SAVE_ABILITIES = [
	"Strength",
	"Agility",
	"Vitality",
	"Intelligence",
	"Sense",
	"Presence",
];

// Varied damage dice pools per rank (NOT uniform)
const SPELL_DAMAGE = {
	E: ["1d4", "1d6", "1d8", "1d10", "2d4", "1d6+2"],
	D: ["1d8", "1d10", "1d12", "2d6", "2d8", "3d4", "1d10+3", "2d6+2"],
	C: ["2d8", "2d10", "3d6", "3d8", "4d6", "2d12", "3d8+4", "4d6+3"],
	B: ["3d10", "4d8", "5d6", "3d12", "4d10", "6d6", "5d8", "4d8+6"],
	A: ["5d10", "6d8", "4d12", "7d6", "5d10+5", "8d6", "6d8+4", "5d12"],
	S: [
		"8d10",
		"6d12",
		"10d8",
		"7d12",
		"12d6",
		"8d10+10",
		"10d10",
		"6d12+8",
		"14d6",
		"9d10+6",
	],
	Z: ["10d12", "12d10", "15d8", "8d12+15", "20d6", "10d12+10", "16d8"],
};

// Cantrip/Level-0 scaling (like D&D cantrips — damage scales at levels 5, 11, 17)
const CANTRIP_SCALING = [
	{
		base: "1d8",
		text: "This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
	},
	{
		base: "1d10",
		text: "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
	},
	{
		base: "1d6",
		text: "This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).",
	},
	{
		base: "1d12",
		text: "This spell's damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).",
	},
	{
		base: "2d4",
		text: "This spell's damage increases by 2d4 when you reach 5th level (4d4), 11th level (6d4), and 17th level (8d4).",
	},
	{
		base: "2d6",
		text: "This spell's damage increases by 2d6 when you reach 5th level (4d6), 11th level (6d6), and 17th level (8d6).",
	},
];

// Upcasting text templates
const UPCAST_TEMPLATES = [
	(die) =>
		`When cast using a higher-rank slot, the damage increases by ${die} for each rank above the base.`,
	(die) =>
		`At higher ranks: +${die} damage per rank above base. At two ranks higher, also add a secondary effect.`,
	(die) =>
		`Upcasting adds ${die} damage per additional rank and extends the duration by 1 round per rank.`,
	(die) =>
		`Each rank above base adds ${die} damage. At 3+ ranks higher, the area of effect doubles.`,
	(die) =>
		`Higher-rank casting: +${die} per rank. The save DC increases by 1 for every two ranks above base.`,
];

const UPCAST_DIE = ["1d4", "1d6", "1d8", "1d10", "1d12", "2d4", "2d6"];

// ═══ TECHNIQUE-SPECIFIC POOLS ═══
const TECHNIQUE_STYLES = [
	"Weapon Art",
	"Unarmed Strike",
	"Defensive Form",
	"Movement Technique",
	"Ranged Discipline",
	"Breath Control",
	"Counter Stance",
	"Assassination Art",
];
const TECHNIQUE_ACTIVATIONS = [
	"1 action",
	"1 bonus action",
	"1 reaction",
	"Part of an attack",
	"Movement action",
];
const TECHNIQUE_FREQUENCIES = [
	"At will",
	"1/short rest",
	"2/short rest",
	"1/long rest",
	"Proficiency bonus/long rest",
	"3/long rest",
];

// ═══ FEAT-SPECIFIC POOLS ═══
const FEAT_TIERS_EXPERT = [
	"Reduce the action cost by one step (action → bonus action, bonus action → free).",
	"Add your proficiency bonus to the damage or healing of this feat's primary effect.",
	"You can use this feat's benefit one additional time before requiring a rest.",
	"The range or area of effect increases by 50%.",
	"You gain advantage on saving throws related to this feat's domain.",
	"Critical hits with this feat's associated actions deal triple damage instead of double.",
	"You can apply this feat's benefit to one ally within 30 feet as a bonus action.",
];
const FEAT_TIERS_MASTER = [
	"The feat's primary effect is maximized (treat all dice as rolling maximum) once per long rest.",
	"You become immune to the damage type most associated with this feat.",
	"Once per long rest, you can use this feat's ability without expending any resources.",
	"Allies within 10 feet gain half the benefit of this feat while you are conscious.",
	"The DC for any saving throws imposed by this feat increases by your proficiency bonus.",
	"You can use this feat as a legendary action (1/round, outside your turn).",
	"This feat's effect persists for 1 additional round/minute after the normal duration ends.",
];

// ═══ TATTOO-SPECIFIC POOLS ═══
const TATTOO_BODY_PARTS = [
	"left arm",
	"right arm",
	"chest",
	"back",
	"left leg",
	"right leg",
	"neck",
	"face",
	"shoulders",
	"hands",
	"spine",
	"ribs",
];
const TATTOO_INK_TYPES = [
	"Void Ink",
	"Mana-Crystal Pigment",
	"Rift Essence Suspension",
	"Shadowblood Tincture",
	"Luminite Extract",
	"Starfall Residue",
	"Abyssal Ichor",
	"Phoenix Ash Emulsion",
	"Titan Marrow Blend",
	"Storm Essence Distillate",
];
const TATTOO_ACTIVATION_ACTIONS = [
	"Flex the tattooed muscle group",
	"Channel mana through the ink circuits",
	"Speak the tattoo's true name",
	"Press your palm against the design",
	"Focus your intent on the glyph",
];

// ═══ SIGIL-SPECIFIC POOLS ═══
const SIGIL_SOCKET_TYPES = [
	"weapon",
	"armor",
	"accessory",
	"shield",
	"helm",
	"boots",
	"gloves",
];
const SIGIL_INSCRIPTION_TOOLS = [
	"Arcane Chisel",
	"Mana Etching Needle",
	"Void Stylus",
	"Crystal Engraver",
	"Rift Calligraphy Brush",
	"Shadow Quill",
];
const SIGIL_PASSIVE_EFFECTS = [
	"+1 to attack rolls",
	"+1 to AC",
	"+1 to saving throws",
	"+5 feet movement speed",
	"Resistance to fire damage",
	"Resistance to cold damage",
	"Resistance to lightning damage",
	"Resistance to necrotic damage",
	"+1d4 to initiative rolls",
	"Advantage on death saving throws",
	"+2 to Strength checks",
	"+2 to Agility checks",
	"+2 to Intelligence checks",
	"+5 temporary HP on short rest",
	"Darkvision 30 feet",
	"+1 to spell save DC",
	"Ignore difficult terrain",
	"+2 to Sense (Perception)",
	"Resistance to psychic damage",
	"+1d6 to first damage roll each turn",
	"Cannot be surprised while conscious",
];
const SIGIL_ACTIVE_EFFECTS = [
	"Cast Shield as a reaction (1/short rest)",
	"Teleport 15 feet as a bonus action (Proficiency/long rest)",
	"Deal 2d6 bonus fire damage on next hit (2/short rest)",
	"Gain +2 AC for 1 minute (1/long rest)",
	"Heal 2d8+2 HP as a bonus action (1/short rest)",
	"Create a 10-foot zone of difficult terrain (2/long rest)",
	"Impose disadvantage on next attack against you (Proficiency/long rest)",
	"Gain advantage on next saving throw (2/short rest)",
	"Deal 1d8 lightning damage to attacker when hit (passive trigger)",
	"Move 10 additional feet without provoking opportunity attacks (at will)",
	"Add 1d8 radiant damage to weapon attacks for 1 minute (1/long rest)",
	"Create dim light in 20-foot radius for 10 minutes (at will)",
	"Grant one ally within 30 feet temporary HP equal to your level (1/short rest)",
	"Reduce incoming damage by 1d10 as a reaction (Proficiency/long rest)",
	"Automatically succeed on next ability check of a chosen type (1/long rest)",
];

// ═══ RUNE ACQUISITION POOLS ═══
const RUNE_DISCOVERY = [
	"Crystallized from the mana-blood of a Gate Boss as it dissolved back into dimensional energy.",
	"Found embedded in the walls of a dungeon that the System flagged as 'anomalous' during mapping.",
	"Purchased from a black-market rune dealer operating in the shadow district of Neo-Seoul.",
	"Dropped by a rare variant monster that displayed intelligence beyond its rank classification.",
	"Awarded by the Hunter Bureau as compensation for completing a classified solo operation.",
	"Discovered in a hidden treasure room after solving an ancient puzzle mechanism in a B-Rank Gate.",
	"Traded by a mysterious figure who appeared at the Gate entrance and vanished after the exchange.",
	"Extracted from a mana crystal cluster that had been growing undisturbed for decades underground.",
	"Won in a high-stakes Hunter tournament organized by the top five Korean Guilds.",
	"Manifested in the user's hand after a near-death experience inside a Red Gate.",
	"Recovered from the personal effects of a retired S-Rank Hunter's estate sale.",
	"Created by a rune-smith who sacrificed their own Awakened abilities to forge it.",
	"Found floating in the spatial void between two Gates that briefly overlapped.",
	"Gifted by a sentient dungeon as a reward for clearing it without destroying any architecture.",
	"Condensed from ambient mana during a rare celestial alignment observed by the Astronomer's Guild.",
];

// ═══ THEME TAGS ═══
const THEME_TAGS_POOL = [
	"gate-zone",
	"post-awakening",
	"hunter-bureau",
	"guild-ops",
	"black-market",
	"rift-energy",
	"monarch-era",
	"shadow-domain",
	"urban-combat",
	"dungeon-core",
	"system-glitch",
	"mana-overflow",
	"dimensional-bleed",
	"ancient-power",
	"modern-warfare",
	"survival",
	"classified",
	"experimental",
	"forbidden",
	"elite-tier",
];

// ═══════════════════════════════════════════════════════════════
// ENRICHMENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function enrichLore(item, r, hasCurse = false) {
	const lore = item.lore || {};
	return {
		origin: lore.origin || pick(ORIGINS, r),
		history: lore.history || pick(HISTORIES, r),
		curse: hasCurse ? pick(CURSES, r) : "",
		personality: lore.personality || "",
		current_owner: lore.current_owner || "",
		prior_owners: lore.prior_owners || [],
	};
}

function enrichFlavor(r) {
	return `${pick(FLAVOR_VERBS, r)} ${pick(FLAVOR_OBJECTS, r)}. ${pick(FLAVOR_CAPS, r)}`;
}

function enrichTags(item, r, category) {
	if (item.tags && item.tags.length > 0) return item.tags;
	const base = [category];
	const pool = [
		"offensive",
		"defensive",
		"utility",
		"support",
		"control",
		"mobility",
		"stealth",
		"perception",
		"healing",
		"damage",
		"buff",
		"debuff",
		"area",
		"single-target",
		"sustained",
		"burst",
		"shadow",
		"fire",
		"ice",
		"lightning",
		"void",
		"radiant",
		"necrotic",
		"psychic",
	];
	return [...base, ...pickN(pool, 2 + Math.floor(r() * 3), r)];
}

function enrichThemeTags(item, r) {
	if (item.theme_tags && item.theme_tags.length > 0) return item.theme_tags;
	return pickN(THEME_TAGS_POOL, 2 + Math.floor(r() * 2), r);
}

// ─── SPELL ENRICHMENT ───
function enrichSpell(item, r) {
	const rank = item.rank || "D";
	const isCantrip = chance(0.15, r) && (rank === "D" || rank === "E");

	// Varied school
	if (!item.school || item.school === "Evocation") {
		item.school = pick(SCHOOLS, r);
	}

	// Level based on rank (varied within rank)
	const levelMap = {
		E: [0, 1],
		D: [0, 1, 2],
		C: [2, 3, 4],
		B: [4, 5, 6],
		A: [6, 7, 8],
		S: [8, 9],
		Z: [9, 10],
	};
	const levels = levelMap[rank] || [0, 1];
	item.level = isCantrip ? 0 : pick(levels, r);

	// Casting time
	item.casting_time = pick(CASTING_TIMES, r);

	// Range
	item.range = pick(RANGES_SPELL, r);

	// Duration
	if (
		item.school === "Abjuration" ||
		item.school === "Transmutation" ||
		item.school === "Enchantment"
	) {
		item.duration = pick(
			["1 minute", "10 minutes", "1 hour", "Until dispelled"],
			r,
		);
		item.concentration = chance(0.6, r);
	} else if (item.school === "Evocation" || item.school === "Necromancy") {
		item.duration = pick(["Instantaneous", "1 round", "1 minute"], r);
		item.concentration = chance(0.2, r);
	} else {
		item.duration = pick(DURATIONS_SPELL, r);
		item.concentration = chance(0.35, r);
	}

	// Damage type and dice
	const dmgType = pick(DAMAGE_TYPES, r);
	const rankKey = SPELL_DAMAGE[rank] ? rank : "D";

	if (isCantrip) {
		const scaling = pick(CANTRIP_SCALING, r);
		item.attack = {
			...item.attack,
			type: pick(["ranged", "melee"], r),
			ability: pick(["Intelligence", "Sense", "Presence"], r),
			damage: scaling.base,
		};
		item.atHigherLevels = scaling.text;
		item.higher_levels = scaling.text;
	} else {
		const dmgDice = pick(SPELL_DAMAGE[rankKey], r);
		item.attack = {
			...item.attack,
			type: pick(["ranged", "melee"], r),
			ability: pick(["Intelligence", "Sense", "Presence"], r),
			damage: dmgDice,
		};

		// Upcasting
		const upDie = pick(UPCAST_DIE, r);
		const upTemplate = pick(UPCAST_TEMPLATES, r);
		item.atHigherLevels = upTemplate(upDie);
		item.higher_levels = item.atHigherLevels;
	}

	// Area
	const area = pick(AREAS, r);
	item.area = { type: area.type, size: area.size, shape: area.shape };

	// Components
	const hasMaterial = chance(0.4, r);
	const materialComponents = [
		"a shard of Gate crystal",
		"crushed mana stone (50gp)",
		"a vial of anomaly blood",
		"a feather from a dimensional beast",
		"powdered rift-iron (100gp)",
		"a fragment of fossilized mana",
		"an Awakened's shed scale",
		"ink made from void essence",
		"a silver thread spun during a Gate event",
	];
	item.components = {
		verbal: chance(0.85, r),
		somatic: chance(0.9, r),
		material: hasMaterial,
		focus: hasMaterial ? pick(materialComponents, r) : "",
	};

	// Saving throw
	const hasSave = chance(0.5, r);
	const saveAbl = pick(SAVE_ABILITIES, r);
	const baseDC = { E: 10, D: 12, C: 14, B: 16, A: 18, S: 20, Z: 22 };
	item.saving_throw = {
		ability: hasSave ? saveAbl : "",
		dc: hasSave ? (baseDC[rank] || 12) + Math.floor(r() * 3) : 0,
		success: hasSave
			? pick(
					[
						"Half damage",
						"No effect",
						"Half damage and no conditions",
						"Pushed 10 feet away",
					],
					r,
				)
			: "",
		failure: hasSave
			? pick(
					[
						"Full damage",
						"Full damage and prone",
						"Full damage and stunned until end of next turn",
						"Full damage and frightened for 1 minute",
					],
					r,
				)
			: "",
	};

	// Rarity scaled to rank
	const rarityMap = {
		E: "common",
		D: "common",
		C: "uncommon",
		B: "rare",
		A: "very_rare",
		S: "legendary",
		Z: "legendary",
	};
	item.rarity = rarityMap[rank] || "common";

	// Mechanics block
	item.mechanics = {
		...item.mechanics,
		action_type: item.casting_time,
		duration: item.duration,
		range: item.range,
		type: item.school,
		save_dc: item.saving_throw?.dc || 0,
		damage_profile: `${item.attack?.damage || "1d8"} ${dmgType}`,
		lattice_interaction: pick(
			[
				"Standard mana circuit",
				"Bypasses lattice shielding",
				"Requires stable lattice connection",
				"Disrupts nearby lattice fields",
				"Amplified by lattice resonance",
			],
			r,
		),
		attack: {
			type: dmgType,
			mode: item.attack?.type || "ranged",
			resolution: "spell_attack",
			modifier: item.attack?.ability || "Intelligence",
			damage: item.attack?.damage || "1d8",
			damage_type: dmgType,
		},
		saving_throw: item.saving_throw,
		frequency: isCantrip ? "At will" : `${item.level || 1}/long rest`,
		action: item.casting_time,
		ability: item.attack?.ability || "Intelligence",
		save: item.saving_throw?.ability || "",
		dc: item.saving_throw?.dc || 0,
		scaling: isCantrip
			? "Scales with character level"
			: "Scales with spell slot rank",
	};

	// Effects
	if (
		!item.effects ||
		(Array.isArray(item.effects) && item.effects.length <= 1)
	) {
		item.effects = [
			item.effect || `Deals ${item.attack?.damage || "1d8"} ${dmgType} damage.`,
		];
		if (hasSave)
			item.effects.push(
				`Target must make a ${saveAbl} saving throw (DC ${item.saving_throw.dc}) or ${item.saving_throw.failure.toLowerCase()}.`,
			);
		if (item.concentration) item.effects.push("Requires concentration.");
	}

	// Lore, flavor, discovery
	const hasCurse = chance(0.08, r);
	item.lore = enrichLore(item, r, hasCurse);
	item.flavor =
		item.flavor &&
		![
			"The sky's wrath concentrated.",
			"A brilliance that rivals the First Gate.",
			"A stillness more absolute than death.",
		].includes(item.flavor)
			? item.flavor
			: enrichFlavor(r);
	item.discovery_lore =
		item.discovery_lore === "Unearthed from the archives."
			? pick(DISCOVERY_LORE, r)
			: item.discovery_lore || pick(DISCOVERY_LORE, r);
	item.tags = enrichTags(item, r, "spell");
	item.theme_tags = enrichThemeTags(item, r);

	return item;
}

// ─── POWER ENRICHMENT ───
function enrichPower(item, r) {
	const hasCurse = chance(0.12, r);
	item.lore = enrichLore(item, r, hasCurse);
	item.flavor =
		item.flavor &&
		item.flavor.length > 30 &&
		!item.flavor.includes("lattice pulse")
			? item.flavor
			: enrichFlavor(r);
	item.discovery_lore =
		!item.discovery_lore ||
		item.discovery_lore === "Unearthed from the archives."
			? pick(DISCOVERY_LORE, r)
			: item.discovery_lore;
	item.tags = enrichTags(item, r, "power");
	item.theme_tags = enrichThemeTags(item, r);

	// Fix cloned attack blocks
	if (item.mechanics) {
		const dmgType = pick(DAMAGE_TYPES, r);
		const dmgDice = pick(
			["2d8", "3d6", "2d10", "4d6", "3d8", "2d12", "5d6", "4d8", "3d10", "6d6"],
			r,
		);
		const actionType = pick(["1 action", "1 bonus action", "1 reaction"], r);
		const freq = pick(
			[
				"At will",
				"2/short rest",
				"Proficiency/long rest",
				"1/short rest",
				"3/long rest",
			],
			r,
		);

		item.mechanics = {
			...item.mechanics,
			action_type: item.mechanics.action_type || actionType,
			type:
				item.mechanics.type ||
				pick(["innate", "awakening", "class", "monstrous", "divine"], r),
			frequency: item.mechanics.frequency || freq,
			action: item.mechanics.action || actionType,
			damage_profile: `${dmgDice} ${dmgType}`,
			lattice_interaction: pick(
				[
					"Standard channel",
					"Direct mana circuit injection",
					"Ambient mana absorption",
					"Lattice bypass — raw power",
					"Resonance amplification",
				],
				r,
			),
			attack: {
				type: dmgType,
				mode: pick(["melee", "ranged", "self", "aura"], r),
				resolution: pick(
					["spell_attack", "ability_check", "automatic", "saving_throw"],
					r,
				),
				modifier: pick(
					["Intelligence", "Strength", "Agility", "Presence", "Sense"],
					r,
				),
				damage: dmgDice,
				damage_type: dmgType,
			},
			saving_throw: {
				ability: pick(SAVE_ABILITIES, r),
				dc: 10 + Math.floor(r() * 12),
				success: pick(["Half damage", "No effect", "Partial effect"], r),
				failure: pick(
					[
						"Full damage",
						"Full effect and prone",
						"Full effect and stunned 1 round",
					],
					r,
				),
			},
		};
	}

	// Limitations
	if (item.limitations) {
		item.limitations = {
			...item.limitations,
			uses:
				item.limitations.uses ||
				pick(
					[
						"2/short rest",
						"Proficiency/long rest",
						"1/short rest",
						"3/long rest",
						"At will",
					],
					r,
				),
			recharge:
				item.limitations.recharge ||
				pick(["Short rest", "Long rest", "Dawn", "Dusk"], r),
		};
	}

	return item;
}

// ─── TECHNIQUE ENRICHMENT ───
function enrichTechnique(item, r) {
	const hasCurse = chance(0.1, r);
	item.lore = enrichLore(item, r, hasCurse);
	item.flavor =
		item.flavor &&
		item.flavor.length > 30 &&
		!item.flavor.includes("lattice pulse")
			? item.flavor
			: enrichFlavor(r);
	item.discovery_lore =
		!item.discovery_lore ||
		item.discovery_lore === "Unearthed from the archives."
			? pick(DISCOVERY_LORE, r)
			: item.discovery_lore;
	item.tags = enrichTags(item, r, "technique");
	item.theme_tags = enrichThemeTags(item, r);

	const style = pick(TECHNIQUE_STYLES, r);
	const dmgType = pick(
		[
			"slashing",
			"bludgeoning",
			"piercing",
			"force",
			"fire",
			"cold",
			"lightning",
			"necrotic",
			"radiant",
		],
		r,
	);
	const dmgDice = pick(
		["1d8", "2d6", "1d10", "1d12", "2d8", "3d6", "2d10", "1d8+4", "2d6+3"],
		r,
	);
	const actType = pick(TECHNIQUE_ACTIVATIONS, r);

	if (item.mechanics) {
		item.mechanics = {
			...item.mechanics,
			action_type: item.mechanics.action_type || actType,
			type: item.mechanics.type || style,
			frequency: item.mechanics.frequency || pick(TECHNIQUE_FREQUENCIES, r),
			action: item.mechanics.action || actType,
			ability:
				item.mechanics.ability ||
				pick(["Strength", "Agility", "Vitality", "Intelligence"], r),
			damage_profile: `${dmgDice} ${dmgType}`,
			lattice_interaction: pick(
				[
					"Physical reinforcement via mana flow",
					"Ki-channeled strike",
					"Raw muscle enhanced by System buffs",
					"Weapon-mana fusion technique",
					"Body-lattice synchronization",
				],
				r,
			),
			attack: {
				type: dmgType,
				mode: pick(["melee", "ranged", "both"], r),
				resolution: pick(
					["weapon_attack", "unarmed_strike", "thrown_attack", "grapple_check"],
					r,
				),
				modifier: pick(["Strength", "Agility"], r),
				damage: dmgDice,
				damage_type: dmgType,
			},
			saving_throw: item.mechanics.saving_throw?.dc
				? item.mechanics.saving_throw
				: {
						ability: pick(["Strength", "Agility", "Vitality"], r),
						dc: 8 + Math.floor(r() * 10),
						success: pick(["Half damage", "No effect", "Pushed 5 feet"], r),
						failure: pick(
							[
								"Full damage and prone",
								"Full damage",
								"Disarmed and staggered",
							],
							r,
						),
					},
		};
	}

	if (item.limitations) {
		item.limitations = {
			...item.limitations,
			uses: item.limitations.uses || pick(TECHNIQUE_FREQUENCIES, r),
			recharge:
				item.limitations.recharge ||
				pick(["Short rest", "Long rest", "After hitting a critical strike"], r),
		};
	}

	return item;
}

// ─── FEAT ENRICHMENT ───
function enrichFeat(item, r) {
	const hasCurse = chance(0.05, r);
	item.lore = enrichLore(item, r, hasCurse);
	item.flavor =
		item.flavor &&
		item.flavor.length > 30 &&
		!item.flavor.includes("lattice pulse")
			? item.flavor
			: enrichFlavor(r);
	item.discovery_lore =
		!item.discovery_lore ||
		item.discovery_lore === "Unearthed from the archives."
			? pick(DISCOVERY_LORE, r)
			: item.discovery_lore;
	item.tags = enrichTags(item, r, "feat");
	item.theme_tags = enrichThemeTags(item, r);

	// Effects
	if (item.effects) {
		if (typeof item.effects === "object" && !Array.isArray(item.effects)) {
			item.effects = {
				...item.effects,
				primary:
					item.effects.primary ||
					item.description?.substring(0, 120) ||
					"Enhances the Hunter's capabilities in this domain.",
				secondary:
					item.effects.secondary ||
					pick(
						[
							"Grants advantage on related ability checks.",
							"Provides resistance to associated damage types.",
							"Reduces resource costs for related actions by half.",
							"Enables a bonus action follow-up once per short rest.",
						],
						r,
					),
				tertiary:
					item.effects.tertiary ||
					pick(
						[
							"Unlocks a passive aura affecting allies within 10 feet.",
							"Grants a once-per-long-rest emergency activation.",
							"Provides a permanent +1 to an associated ability score.",
						],
						r,
					),
				primaryEffect:
					item.effects.primaryEffect ||
					item.description?.substring(0, 100) ||
					"",
				secondaryEffect:
					item.effects.secondaryEffect || "See secondary effect.",
			};
		}
	}

	// Expert & Master tiers in benefits
	if (item.benefits) {
		if (!item.benefits.expert || item.benefits.expert.length === 0) {
			item.benefits.expert = [
				pick(FEAT_TIERS_EXPERT, r),
				pick(FEAT_TIERS_EXPERT, r),
			];
		}
		if (!item.benefits.master || item.benefits.master.length === 0) {
			item.benefits.master = [pick(FEAT_TIERS_MASTER, r)];
		}
	}

	// Mechanics
	if (item.mechanics) {
		item.mechanics = {
			...item.mechanics,
			type:
				item.mechanics.type ||
				pick(["passive", "active", "triggered", "stance"], r),
			frequency:
				item.mechanics.frequency ||
				pick(
					["Passive", "1/short rest", "Proficiency/long rest", "At will"],
					r,
				),
			action:
				item.mechanics.action ||
				pick(
					["None (passive)", "1 bonus action", "1 reaction", "Free action"],
					r,
				),
		};
	}

	// Limitations
	if (item.limitations) {
		item.limitations = {
			...item.limitations,
			uses:
				item.limitations.uses ||
				pick(["Passive", "2/short rest", "Proficiency/long rest"], r),
			recharge:
				item.limitations.recharge ||
				pick(["N/A (passive)", "Short rest", "Long rest"], r),
		};
	}

	return item;
}

// ─── TATTOO ENRICHMENT ───
const usedTattooNames = new Set();
function enrichTattoo(item, r, _index) {
	// De-duplicate names
	if (usedTattooNames.has(item.name)) {
		const suffixes = [
			"Ascendant",
			"Reborn",
			"Eclipse",
			"Zenith",
			"Prime",
			"Apex",
			"Void-Touched",
			"Awakened",
			"Corrupted",
			"Perfected",
		];
		item.name = `${item.name} (${pick(suffixes, r)})`;
	}
	usedTattooNames.add(item.name);

	const hasCurse = chance(0.12, r);
	item.lore = enrichLore(item, r, hasCurse);
	item.flavor = enrichFlavor(r);
	item.discovery_lore = pick(DISCOVERY_LORE, r);
	item.tags = enrichTags(item, r, "tattoo");
	item.theme_tags = enrichThemeTags(item, r);

	const bodyPart = pick(TATTOO_BODY_PARTS, r);
	const inkType = pick(TATTOO_INK_TYPES, r);
	const activationAction = pick(TATTOO_ACTIVATION_ACTIONS, r);

	// Replace template descriptions
	if (
		item.description?.includes("A modern urban fantasy tattoo etched using") ||
		!item.description ||
		item.description.length < 50
	) {
		item.description = `An intricate ${inkType} tattoo inscribed on the ${bodyPart}. The sigil-work pulses with contained mana, its lines shifting subtly when the bearer enters combat. ${activationAction} to unleash its stored power. This tattoo occupies one tattoo attunement slot (separate from equipment attunement).`;
	}

	// Mechanics — tattoo-specific
	const dmgType = pick(DAMAGE_TYPES, r);
	const applicationDC = 10 + Math.floor(r() * 12);
	item.mechanics = {
		...(item.mechanics || {}),
		action_type: activationAction,
		type: "Tattoo",
		frequency: pick(
			[
				"Passive",
				"1/short rest",
				"2/short rest",
				"Proficiency/long rest",
				"1/long rest",
			],
			r,
		),
		duration: pick(
			["Permanent (passive)", "1 minute", "10 minutes", "1 hour"],
			r,
		),
		action: activationAction,
		ability: pick(["Vitality", "Presence", "Intelligence"], r),
		damage_profile: chance(0.6, r)
			? `${pick(["1d6", "1d8", "2d4", "1d10", "2d6"], r)} ${dmgType}`
			: "N/A (utility/defensive)",
		lattice_interaction: `${inkType} resonates with the bearer's mana lattice through dermal contact`,
		attack: {
			type: dmgType,
			mode: "self",
			resolution: "automatic",
			modifier: "",
			damage: "0",
			damage_type: "none",
		},
		saving_throw: { ability: "", dc: 0, success: "", failure: "" },
		stat_bonuses: {},
		special_abilities: [
			`Inscription requires: ${inkType}, DC ${applicationDC} tattooing check, 4 hours of uninterrupted work`,
		],
		restrictions: [
			`Occupies ${bodyPart} tattoo slot`,
			"Tattoo attunement is separate from equipment attunement",
		],
	};

	// Effects
	const primaryEffect =
		item.effect_description ||
		item.effects?.[0] ||
		pick(
			[
				`Gain +2 to ${pick(["Strength", "Agility", "Vitality", "Intelligence", "Sense", "Presence"], r)} while the tattoo is active.`,
				`Deal ${pick(["1d6", "1d8", "2d4"], r)} ${dmgType} damage to creatures that hit you with melee attacks.`,
				`Gain resistance to ${dmgType} damage.`,
				`Your movement speed increases by 10 feet.`,
				`You can see in magical darkness out to 60 feet.`,
			],
			r,
		);

	item.effects = {
		primary: primaryEffect,
		secondary: pick(
			[
				"The ink glows faintly, granting advantage on Intimidation checks.",
				"You ignore the first instance of this damage type each combat.",
				"Allies within 5 feet gain +1 to saving throws.",
				"Your unarmed strikes deal an additional 1d4 of the tattoo's element.",
			],
			r,
		),
		tertiary: pick(
			[
				"Overcharge: Once per long rest, double the primary effect for 1 round.",
				"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
				"Emergency Pulse: When reduced to 0 HP, the tattoo activates automatically (1/long rest).",
			],
			r,
		),
		passive: [primaryEffect],
		active: [
			{
				name: "Tattoo Activation",
				description: `${activationAction} to activate for 1 minute.`,
				action: "Bonus Action",
				frequency: "1/short rest",
			},
		],
		primaryEffect: primaryEffect,
		secondaryEffect: "",
		passiveBonuses: [{ stat: `${dmgType} aura`, value: 1 }],
	};

	// Limitations — SEPARATE attunement
	item.limitations = {
		...(item.limitations || {}),
		uses: pick(
			[
				"Passive + 1 active/short rest",
				"2/short rest",
				"Proficiency/long rest",
				"Passive only",
			],
			r,
		),
		recharge: pick(["Short rest", "Long rest", "Dawn"], r),
		requires_attunement: true,
		conditions: [
			`Requires tattoo attunement slot (${bodyPart})`,
			"Tattoo attunement is independent from equipment attunement",
			`Max tattoos = Proficiency Bonus`,
		],
		charges: 0,
		uses_per_rest: Math.floor(r() * 3) + 1,
		consumable: false,
		prerequisites: [
			`Awakened status`,
			`Tattooing kit proficiency or professional tattoo artist`,
		],
		cost: [100, 250, 500, 1000, 2500, 5000][Math.floor(r() * 6)],
	};

	return item;
}

// ─── SIGIL ENRICHMENT ───
const usedSigilEffects = new Set();
function enrichSigil(item, r) {
	item.lore =
		item.lore && typeof item.lore === "object"
			? enrichLore(item, r, chance(0.08, r))
			: typeof item.lore === "string" && item.lore.length > 20
				? item.lore
				: pick(ORIGINS, r);
	item.flavor =
		item.flavor && item.flavor.length > 10 ? item.flavor : enrichFlavor(r);
	item.discovery_lore = item.discovery_lore || pick(DISCOVERY_LORE, r);
	item.tags =
		item.tags && item.tags.length > 3
			? item.tags
			: enrichTags(item, r, "sigil");

	const socketType = pick(SIGIL_SOCKET_TYPES, r);
	const inscriptionTool = pick(SIGIL_INSCRIPTION_TOOLS, r);
	const inscriptionDC = 10 + Math.floor(r() * 12);
	const materialCost = pick([50, 100, 250, 500, 1000, 2500], r);

	// Ensure unique passive/active combos
	let passive = pick(SIGIL_PASSIVE_EFFECTS, r);
	let active = pick(SIGIL_ACTIVE_EFFECTS, r);
	const comboKey = `${passive}|${active}`;
	if (usedSigilEffects.has(comboKey)) {
		passive = pick(SIGIL_PASSIVE_EFFECTS, r);
		active = pick(SIGIL_ACTIVE_EFFECTS, r);
	}
	usedSigilEffects.add(`${passive}|${active}`);

	item.mechanics = {
		...(item.mechanics || {}),
		action_type: "Passive (socketed) / See active ability",
		type: "Sigil",
		duration: "While socketed/inscribed",
		action: "None (passive) / Varies (active)",
		ability: pick(["Intelligence", "Agility", "Sense"], r),
		damage_profile: "See active effect",
		lattice_interaction: `Inscribed using ${inscriptionTool} — bonds with item's mana lattice`,
		stat_bonuses: {},
		special_abilities: [`Passive: ${passive}`, `Active: ${active}`],
		restrictions: [
			`Socket type: ${socketType}`,
			`Inscription DC: ${inscriptionDC} (${inscriptionTool})`,
			`Material cost: ${materialCost}gp`,
		],
	};

	item.passive_bonuses = item.passive_bonuses || { effect: passive };
	item.can_inscribe_on =
		item.can_inscribe_on ||
		pickN(SIGIL_SOCKET_TYPES, 2 + Math.floor(r() * 3), r);
	// Remove fields not on CompendiumSigil type
	delete item.active_feature;
	delete item.inscription_difficulty;

	// Limitations
	item.limitations = {
		...(item.limitations || {}),
		uses: "Permanent while socketed",
		recharge: "Active ability recharges per rest",
		requires_attunement: false,
		conditions: [
			`Max sigils per item: ${pick([1, 2, 3], r)} (based on item rarity)`,
			`Overlapping sigils of the same type conflict — only the strongest applies`,
			`Removing a sigil requires a DC ${inscriptionDC + 5} check or destroys the sigil`,
		],
		charges: 0,
		consumable: false,
		cost: materialCost,
	};

	return item;
}

// ─── RUNE ENRICHMENT ───
function enrichRune(item, r) {
	// Runes are one-time-use consumables that teach abilities
	item.discovery_lore = item.discovery_lore || pick(RUNE_DISCOVERY, r);
	item.lore = typeof item.lore === "string" ? item.lore : undefined;

	// Activation is always consume
	item.activation_action =
		item.activation_action ||
		"Consume — crush the rune and absorb its knowledge (1 action)";
	item.activation_cost =
		"Consumed on use — the rune shatters and the knowledge is permanently absorbed";
	item.activation_cost_amount = 1;
	item.duration = "Permanent — the learned ability persists indefinitely";
	item.range = "Self";
	item.concentration = false;
	item.uses_per_rest = "One-time use (destroyed after absorption)";
	item.recharge = "N/A — consumable";

	// Cross-class scaling
	const abilityType = item.rune_category || "Spell";
	const crossClassRule = `Cross-Class Adaptation: If the learned ${abilityType.toLowerCase()} is outside the character's native Job, uses per rest = Proficiency Modifier + Job's Primary Stat Modifier. Native-class abilities use the normal class resource system.`;

	// Higher levels
	if (!item.higher_levels) {
		const scalingOptions = [
			`The taught ability scales with character level. At levels 5, 11, and 17, the effect improves as detailed in the ability description.`,
			`At higher proficiency tiers, the ability gains additional uses per rest and its effects intensify.`,
			`Cross-class users can improve this ability by investing downtime (8 hours per improvement tier) to deepen their understanding.`,
			`The ability's damage/healing scales with the user's primary casting stat, regardless of the original class requirement.`,
			`Each additional rune of the same ability category consumed increases the ability's rank by one tier.`,
		];
		item.higher_levels = pick(scalingOptions, r);
	}

	// Enhance description with cross-class rules
	if (item.description && !item.description.includes("Cross-Class")) {
		item.description = `${item.description}\n\n${crossClassRule}`;
	}

	// Tags
	if (!item.tags || item.tags.length < 4) {
		item.tags = [
			...(item.tags || []),
			"one-time-use",
			"learning-item",
			item.rune_category?.toLowerCase() || "general",
		].filter((v, i, a) => a.indexOf(v) === i);
	}

	// Rank based on rarity
	const rankMap = {
		common: "D",
		uncommon: "C",
		rare: "B",
		very_rare: "A",
		legendary: "S",
	};
	item.rank = item.rank || rankMap[item.rarity] || "D";

	return item;
}

// ═══════════════════════════════════════════════════════════════
// FILE I/O — Read TS arrays, write back enriched data
// ═══════════════════════════════════════════════════════════════

function readTsArray(filePath) {
	const absPath = path.resolve(ROOT, filePath);
	if (!fs.existsSync(absPath)) return null;
	const content = fs.readFileSync(absPath, "utf8");

	// Find the array boundaries
	const firstBracket = content.indexOf("[");
	const lastBracket = content.lastIndexOf("]");
	if (firstBracket === -1 || lastBracket === -1) return null;

	let arrayText = content.substring(firstBracket, lastBracket + 1);

	// Handle spread operators with imported arrays — replace with empty arrays
	// This is needed for files like sigils.ts that use ...someArray.map(...)
	arrayText = arrayText.replace(
		/\.\.\.[\w]+(?:\.map\([^)]*\))?/g,
		"/* spread removed */",
	);
	// Remove remaining spread references
	arrayText = arrayText.replace(/\/\* spread removed \*\//g, "");

	try {
		// Use Function constructor to parse (safer than eval)
		const parsed = new Function(`return ${arrayText}`)();
		return { data: parsed, raw: content };
	} catch (e) {
		console.error(`  ⚠ Parse error in ${filePath}: ${e.message}`);
		// Try a more aggressive cleanup
		try {
			// Remove template literal expressions
			arrayText = arrayText.replace(/`[^`]*\$\{[^}]*\}[^`]*`/g, '""');
			const parsed2 = new Function(`return ${arrayText}`)();
			return { data: parsed2, raw: content };
		} catch (e2) {
			console.error(`  ✗ Could not parse ${filePath}: ${e2.message}`);
			return null;
		}
	}
}

function extractExportInfo(content) {
	const match = content.match(
		/export\s+const\s+(\w+)\s*(?::\s*([\w[\]<>, ]+))?\s*=/,
	);
	if (!match) return null;
	return { varName: match[1], typeName: match[2] || "" };
}

function extractImportLine(content) {
	const lines = content.split("\n");
	const imports = lines.filter((l) => l.trim().startsWith("import"));
	return imports.join("\n");
}

function writeTsFile(filePath, importLine, varName, typeName, data) {
	const absPath = path.resolve(ROOT, filePath);

	// Convert data to JSON then fix up for TypeScript
	let jsonStr = JSON.stringify(data, null, "\t");
	// Remove quotes from object keys (TypeScript style)
	jsonStr = jsonStr.replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)"\s*:/g, "$1:");

	const typeAnnotation = typeName ? `: ${typeName}` : "";
	const output = `${importLine}\n\nexport const ${varName}${typeAnnotation} = ${jsonStr};\n`;

	fs.writeFileSync(absPath, output, "utf8");
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════

function processFile(filePath, enrichFn, label) {
	process.stdout.write(`  ${label}: ${filePath}... `);

	const result = readTsArray(filePath);
	if (!result) {
		console.log("SKIP (not found or parse error)");
		return 0;
	}

	const { data, raw } = result;
	const exportInfo = extractExportInfo(raw);
	const importLine = extractImportLine(raw);

	if (!exportInfo) {
		console.log("SKIP (no export found)");
		return 0;
	}

	let count = 0;
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		if (!item || !item.id) continue;
		const r = makeRand(item.id);
		enrichFn(item, r, i);
		count++;
	}

	writeTsFile(
		filePath,
		importLine,
		exportInfo.varName,
		exportInfo.typeName,
		data,
	);
	console.log(`✓ ${count} entries enriched`);
	return count;
}

async function main() {
	console.log("══════════════════════════════════════════════════════");
	console.log("  RIFT ASCENDANT — COMPENDIUM ENRICHMENT ENGINE v3");
	console.log("══════════════════════════════════════════════════════\n");

	let total = 0;

	// ── SPELLS ──
	console.log("📜 SPELLS");
	for (const rank of ["s", "a", "b", "c", "d", "e", "z"]) {
		total += processFile(
			`src/data/compendium/spells/rank-${rank}.ts`,
			enrichSpell,
			`Rank ${rank.toUpperCase()}`,
		);
	}

	// ── POWERS ──
	console.log("\n⚡ POWERS");
	total += processFile("src/data/compendium/powers.ts", enrichPower, "Powers");

	// ── TECHNIQUES ──
	console.log("\n🗡️ TECHNIQUES");
	total += processFile(
		"src/data/compendium/techniques.ts",
		enrichTechnique,
		"Techniques",
	);

	// ── FEATS ──
	console.log("\n🏆 FEATS");
	total += processFile(
		"src/data/compendium/feats-comprehensive.ts",
		enrichFeat,
		"Feats",
	);

	// ── TATTOOS ──
	console.log("\n🖋️ TATTOOS");
	total += processFile(
		"src/data/compendium/tattoos.ts",
		enrichTattoo,
		"Tattoos",
	);

	// ── SIGILS ──
	console.log("\n🔮 SIGILS");
	total += processFile("src/data/compendium/sigils.ts", enrichSigil, "Sigils");

	// ── RUNES ──
	console.log("\n💎 RUNES");
	const runeFiles = [
		"src/data/compendium/runes/power-powers.ts",
		"src/data/compendium/runes/spell-rank-a.ts",
		"src/data/compendium/runes/spell-rank-b.ts",
		"src/data/compendium/runes/spell-rank-c.ts",
		"src/data/compendium/runes/spell-rank-d.ts",
		"src/data/compendium/runes/spell-rank-s.ts",
		"src/data/compendium/runes/technique-techniques.ts",
	];
	for (const rf of runeFiles) {
		total += processFile(rf, enrichRune, path.basename(rf, ".ts"));
	}

	// ── ITEMS ──
	console.log("\n🗃️ ITEMS");
	for (let i = 1; i <= 9; i++) {
		total += processFile(
			`src/data/compendium/items-part${i}.ts`,
			(item, r) => {
				const hasCurse = chance(0.1, r);
				item.lore = enrichLore(item, r, hasCurse);
				item.flavor =
					item.flavor &&
					item.flavor.length > 30 &&
					!item.flavor.includes("lattice pulse")
						? item.flavor
						: enrichFlavor(r);
				item.discovery_lore =
					!item.discovery_lore ||
					item.discovery_lore === "Unearthed from the archives."
						? pick(DISCOVERY_LORE, r)
						: item.discovery_lore;
				item.tags = enrichTags(item, r, "equipment");
				item.theme_tags = enrichThemeTags(item, r);
				return item;
			},
			`Part ${i}`,
		);
	}
	total += processFile(
		"src/data/compendium/items-base-equipment.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, chance(0.05, r));
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.discovery_lore = item.discovery_lore || pick(DISCOVERY_LORE, r);
			item.tags = enrichTags(item, r, "equipment");
			item.theme_tags = enrichThemeTags(item, r);
			return item;
		},
		"Base Equipment",
	);
	total += processFile(
		"src/data/compendium/items.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, chance(0.08, r));
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.discovery_lore = item.discovery_lore || pick(DISCOVERY_LORE, r);
			item.tags = enrichTags(item, r, "equipment");
			item.theme_tags = enrichThemeTags(item, r);
			return item;
		},
		"Items Index",
	);

	// ── RELICS ──
	console.log("\n👑 RELICS");
	total += processFile(
		"src/data/compendium/relics-comprehensive.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, chance(0.15, r));
			item.flavor = enrichFlavor(r);
			item.discovery_lore = item.discovery_lore || pick(DISCOVERY_LORE, r);
			item.tags = enrichTags(item, r, "relic");
			item.theme_tags = enrichThemeTags(item, r);
			return item;
		},
		"Relics",
	);

	// ── BACKGROUNDS ──
	console.log("\n📋 BACKGROUNDS");
	total += processFile(
		"src/data/compendium/backgrounds.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, false);
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.discovery_lore = item.discovery_lore || pick(DISCOVERY_LORE, r);
			item.tags = enrichTags(item, r, "background");
			item.theme_tags = enrichThemeTags(item, r);
			return item;
		},
		"Backgrounds",
	);
	total += processFile(
		"src/data/compendium/backgrounds-part2.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, false);
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.tags = enrichTags(item, r, "background");
			return item;
		},
		"Backgrounds Part 2",
	);

	// ── LOCATIONS ──
	console.log("\n🗺️ LOCATIONS");
	total += processFile(
		"src/data/compendium/locations.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, false);
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.tags = enrichTags(item, r, "location");
			item.theme_tags = enrichThemeTags(item, r);
			return item;
		},
		"Locations",
	);

	// ── CONDITIONS ──
	console.log("\n💀 CONDITIONS");
	total += processFile(
		"src/data/compendium/conditions.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, false);
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.tags = enrichTags(item, r, "condition");
			return item;
		},
		"Conditions",
	);

	// ── SKILLS ──
	console.log("\n📊 SKILLS");
	total += processFile(
		"src/data/compendium/skills-comprehensive.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, false);
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.tags = enrichTags(item, r, "skill");
			return item;
		},
		"Skills",
	);

	// ── PATHS ──
	console.log("\n🛤️ PATHS");
	total += processFile(
		"src/data/compendium/paths.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, false);
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.tags = enrichTags(item, r, "path");
			item.theme_tags = enrichThemeTags(item, r);
			return item;
		},
		"Paths",
	);

	// ── JOBS ──
	console.log("\n💼 JOBS");
	total += processFile(
		"src/data/compendium/jobs.ts",
		(item, r) => {
			item.lore = enrichLore(item, r, false);
			item.flavor =
				item.flavor && item.flavor.length > 30 ? item.flavor : enrichFlavor(r);
			item.tags = enrichTags(item, r, "job");
			item.theme_tags = enrichThemeTags(item, r);
			return item;
		},
		"Jobs",
	);

	console.log("\n══════════════════════════════════════════════════════");
	console.log(`  ✅ ENRICHMENT COMPLETE — ${total} entries processed`);
	console.log("══════════════════════════════════════════════════════\n");
}

main().catch(console.error);
