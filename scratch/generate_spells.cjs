/**
 * Generate the full supplemental spells file with ~200 unique spells.
 * Each spell has a unique name, description, mechanics, flavor, and lore.
 * Run: node scratch/generate_spells.cjs > src/data/compendium/spells/supplemental-new.ts
 */

// ─── Spell Database ─────────────────────────────────────────
// Each entry is individually authored. No template recycling.
const spells = [
	// ═══ CANTRIPS (Level 0) ═══
	{
		name: "Mana Dart",
		level: 0,
		school: "Evocation",
		classes: ["Mage", "Technomancer"],
		castTime: "1 action",
		range: "60 feet",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: false, s: true, m: false, f: "" },
		atkType: "ranged",
		atkAbility: "Intelligence",
		dmg: "1d10",
		dmgType: "force",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "1d10 force damage.",
		effSec: "Ignores half cover.",
		desc: "Shape a shard of raw mana and fling it at a creature within 60 feet. Make a ranged spell attack using Intelligence. On a hit, the target takes 1d10 force damage. The dart ignores half cover.",
		higher:
			"Damage increases by 1d10 at 5th level (2d10), 11th (3d10), and 17th (4d10).",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "One dart. One line. One answer.",
		lore: {
			origin:
				"Standard Bureau combat primer — the first offensive spell every Mage candidate learns.",
			history: "Unchanged since the Academy's founding charter.",
			curse: "",
			personality:
				"Clinical; the dart flies perfectly straight regardless of wind or rain.",
			current_owner: "Public Bureau curriculum.",
			prior_owners: ["Academy Founder K. Shin"],
		},
		discoveryLore:
			"The Academy entrance exam begins and ends with this spell. Pass rate: 34%.",
		tags: ["hunter-bureau", "academy", "foundational"],
	},
	{
		name: "Resonance Whip",
		level: 0,
		school: "Evocation",
		classes: ["Idol", "Esper"],
		castTime: "1 action",
		range: "15 feet",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: true, s: true, m: false, f: "" },
		atkType: "melee",
		atkAbility: "Presence",
		dmg: "1d8",
		dmgType: "thunder",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "1d8 thunder damage.",
		effSec: "Push or pull target 5 feet.",
		desc: "Crack a tendril of sonic mana at a creature within 15 feet. Make a melee spell attack using Presence. On a hit, the target takes 1d8 thunder damage. You can then push or pull the target 5 feet.",
		higher:
			"Damage increases by 1d8 at 5th level (2d8), 11th (3d8), and 17th (4d8).",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "The crowd sways. One of them doesn't get a choice.",
		lore: {
			origin:
				"Developed by an Idol street performer who weaponized crowd-control acoustics.",
			history:
				"Banned from civilian performance venues after the Myeongdong Incident.",
			curse: "",
			personality: "Rhythmic; the crack follows a 4/4 beat pattern.",
			current_owner: "Idol Guild training halls.",
			prior_owners: ["Street Idol D. Kang"],
		},
		discoveryLore:
			"Security footage shows the performer never stopped smiling during the altercation.",
		tags: ["idol-guild", "performance", "sonic"],
	},
	{
		name: "Grave Chill",
		level: 0,
		school: "Necromancy",
		classes: ["Revenant"],
		castTime: "1 action",
		range: "Touch",
		dur: "1 round",
		conc: false,
		ritual: false,
		comp: { v: true, s: true, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "necrotic",
		saveAbility: "Vitality",
		saveDC: 13,
		saveSuccess: "Half damage, no healing prevention.",
		saveFailure:
			"Full damage and no HP recovery until start of caster's next turn.",
		effPri: "1d8 necrotic damage.",
		effSec: "Target can't regain HP until start of your next turn.",
		desc: "Touch a creature and channel necrotic cold through its body. The target must succeed on a DC 13 Vitality save or take 1d8 necrotic damage and be unable to regain hit points until the start of your next turn.",
		higher: "Damage increases by 1d8 at 5th level, 11th, and 17th.",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "The warmth leaves. Something cold takes its place.",
		lore: {
			origin:
				"A Revenant funeral rite that became lethal when performed on the living.",
			history:
				"Bureau Ethics Board reviewed it twice. Both times deemed culturally significant.",
			curse: "",
			personality:
				"Mournful; the caster's fingertips turn pale blue after casting.",
			current_owner: "Revenant death-scholar circles.",
			prior_owners: ["Funerary Priest M. Go"],
		},
		discoveryLore:
			"The first combat use was accidental — a mourning Revenant touched a gate-creature mid-prayer.",
		tags: ["revenant", "funeral-rite", "entropy"],
	},
	{
		name: "Lattice Ping",
		level: 0,
		school: "Divination",
		classes: ["Stalker", "Summoner", "Herald"],
		castTime: "1 action",
		range: "Self",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: true, s: false, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "Detect number and direction of creatures within 30 feet.",
		effSec: "Works through total cover.",
		desc: "Send a pulse of divination energy through the local mana lattice. You learn the number and general direction of all creatures within 30 feet, even through total cover.",
		higher:
			"Range increases to 60 feet at 5th level, 120 feet at 11th, and 300 feet at 17th.",
		area: { type: "radius", size: "30-foot", shape: "sphere" },
		flavor: "Ping. Contact. Three hostiles, northwest, twelve meters.",
		lore: {
			origin:
				"Stalker field technique adapted for caster use by a Bureau cross-training program.",
			history:
				"Originally a martial sense technique — the spell version loses precision but gains range.",
			curse: "",
			personality:
				"Twitchy; the caster's ears ring faintly for a moment after casting.",
			current_owner: "Bureau reconnaissance units.",
			prior_owners: ["Stalker Instructor T. Bae"],
		},
		discoveryLore:
			"A Stalker complained the spell version 'felt like echolocation with lag.' Bureau adopted it anyway.",
		tags: ["stalker", "reconnaissance", "divination"],
	},
	{
		name: "Pact Spark",
		level: 0,
		school: "Evocation",
		classes: ["Contractor"],
		castTime: "1 action",
		range: "60 feet",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: true, s: true, m: false, f: "" },
		atkType: "ranged",
		atkAbility: "Presence",
		dmg: "1d10",
		dmgType: "force",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "1d10 force damage.",
		effSec: "Visual matches patron signature.",
		desc: "A flickering brand of eldritch energy leaps from your hand to a creature within 60 feet. Make a ranged spell attack using Presence. On a hit, the target takes 1d10 force damage.",
		higher:
			"Damage increases by 1d10 at 5th level (2d10), 11th (3d10), and 17th (4d10).",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "Your patron waves hello. With force damage.",
		lore: {
			origin:
				"The simplest expression of a Contractor's bargain — proof of connection without cost.",
			history: "Every Contractor learns this first. The entity insists.",
			curse: "",
			personality:
				"Possessive; the spark always matches the patron's aesthetic.",
			current_owner: "All registered Contractors.",
			prior_owners: ["First Contractor Assembly"],
		},
		discoveryLore:
			"The color cannot be changed. Three Contractors tried. Their patrons were not amused.",
		tags: ["contractor", "pact", "eldritch"],
	},
	{
		name: "Aetheric Blade",
		level: 0,
		school: "Conjuration",
		classes: ["Mage", "Holy Knight"],
		castTime: "1 action",
		range: "5 feet",
		dur: "1 round",
		conc: false,
		ritual: false,
		comp: { v: false, s: true, m: false, f: "" },
		atkType: "melee",
		atkAbility: "Intelligence",
		dmg: "1d8",
		dmgType: "force",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "1d8 force damage.",
		effSec: "Weapon counts as magical for overcoming resistance.",
		desc: "Conjure a blade of shimmering mana in your free hand and strike a creature within 5 feet. Melee spell attack using Intelligence; on a hit, 1d8 force damage. The blade vanishes at the end of your next turn.",
		higher:
			"Damage increases by 1d8 at 5th level (2d8), 11th (3d8), and 17th (4d8).",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "A sword made of math. It cuts just the same.",
		lore: {
			origin: "Adapted from the Mage Academy's theoretical weapons program.",
			history:
				"The Holy Knight order adopted it after their Oathblades proved insufficient against phase-class anomalies.",
			curse: "",
			personality:
				"Precise; the blade always forms at the same angle relative to the caster's wrist.",
			current_owner: "Mage Academy and Holy Knight chapters.",
			prior_owners: ["Weapons Theorist Dr. L. Yoon"],
		},
		discoveryLore:
			"The first prototype was a mana rapier. The Knight who tested it said it felt like holding 'solidified intent.'",
		tags: ["academy", "conjuration", "melee"],
	},
	{
		name: "Mind Spike",
		level: 0,
		school: "Enchantment",
		classes: ["Esper"],
		castTime: "1 action",
		range: "60 feet",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: false, s: true, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "psychic",
		saveAbility: "Presence",
		saveDC: 13,
		saveSuccess: "Half damage.",
		saveFailure: "Full damage and disadvantage on next ability check.",
		effPri: "1d8 psychic damage.",
		effSec: "Disadvantage on next ability check on failed save.",
		desc: "Drive a needle of psychic pressure into a creature's mind within 60 feet. The target must succeed on a DC 13 Presence saving throw or take 1d8 psychic damage and have disadvantage on its next ability check.",
		higher:
			"Damage increases by 1d8 at 5th level (2d8), 11th (3d8), and 17th (4d8).",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "It's not loud. It doesn't need to be.",
		lore: {
			origin:
				"Standard Esper psionic primer — the quietest weapon in the Bureau arsenal.",
			history:
				"The Bureau debated banning it from civilian use. They lost the debate.",
			curse: "",
			personality:
				"Intimate; the target always knows exactly where the caster is for one instant.",
			current_owner: "Esper training program.",
			prior_owners: ["Psionic Researcher Dr. S. Im"],
		},
		discoveryLore:
			"Test subjects describe the sensation as 'a migraine that knows your name.'",
		tags: ["esper", "psionic", "mental"],
	},
	{
		name: "Verdant Touch",
		level: 0,
		school: "Transmutation",
		classes: ["Summoner", "Herald"],
		castTime: "1 action",
		range: "Touch",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: true, s: true, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "Stabilize a dying creature or restore 1 HP.",
		effSec: "A small plant sprouts from the ground at the target's location.",
		desc: "Touch a creature at 0 HP. The target is stabilized and regains 1 hit point. A small bioluminescent sprout grows from the ground at the point of contact, providing dim light in a 5-foot radius for 1 minute.",
		higher:
			"At 5th level, also removes the poisoned condition. At 11th, grants 1d4 temp HP. At 17th, removes one disease.",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "Where the Summoner kneels, something grows.",
		lore: {
			origin:
				"Gate ecology researchers discovered that certain gate-plant spores respond to Sense-based mana.",
			history:
				"Herald chaplains adopted it as a battlefield triage tool within the first year.",
			curse: "",
			personality: "Gentle; the sprout always leans toward the caster.",
			current_owner: "Bureau field medics.",
			prior_owners: ["Ecologist Dr. H. Noh"],
		},
		discoveryLore:
			"The sprouts are non-toxic. One researcher ate twelve of them to prove it.",
		tags: ["summoner", "herald", "healing", "nature"],
	},
	{
		name: "Circuit Jolt",
		level: 0,
		school: "Evocation",
		classes: ["Technomancer"],
		castTime: "1 action",
		range: "30 feet",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: false, s: true, m: true, f: "a small capacitor" },
		atkType: "ranged",
		atkAbility: "Intelligence",
		dmg: "1d8",
		dmgType: "lightning",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "1d8 lightning damage.",
		effSec: "If target is wearing metal armor, attack roll has advantage.",
		desc: "Discharge a precise arc of mana-converted electricity from a handheld capacitor at a target within 30 feet. Ranged spell attack using Intelligence. On a hit, 1d8 lightning damage. Advantage on the attack if the target is wearing metal armor.",
		higher:
			"Damage increases by 1d8 at 5th level (2d8), 11th (3d8), and 17th (4d8).",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "Aimed lightning. The Technomancer's handshake.",
		lore: {
			origin:
				"Developed at the Bureau's Applied Resonance Lab as a non-lethal compliance tool.",
			history:
				"Was reclassified as 'potentially lethal' after the first field test.",
			curse: "",
			personality:
				"Eager; the capacitor sparks before the caster consciously triggers the spell.",
			current_owner: "Technomancer certification program.",
			prior_owners: ["Lead Engineer J. Kwon"],
		},
		discoveryLore:
			"The prototype capacitor exploded. The second prototype only singed. The third worked perfectly.",
		tags: ["technomancer", "lightning", "engineered"],
	},
	{
		name: "Oath Flare",
		level: 0,
		school: "Evocation",
		classes: ["Holy Knight", "Herald"],
		castTime: "1 bonus action",
		range: "Self",
		dur: "1 round",
		conc: false,
		ritual: false,
		comp: { v: true, s: false, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "radiant",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "Next melee hit deals extra 1d6 radiant damage.",
		effSec: "Target sheds dim light for 1 round, negating invisibility.",
		desc: "Speak a word of your oath and your weapon ignites with radiant mana. The next melee weapon attack you make before the end of your next turn deals an extra 1d6 radiant damage. If you hit, the target sheds dim light in a 5-foot radius until the end of your next turn, negating invisibility.",
		higher:
			"Extra damage increases to 2d6 at 5th level, 3d6 at 11th, and 4d6 at 17th.",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "The oath burns. So does the blade.",
		lore: {
			origin:
				"First channeled by a Holy Knight who refused to let an invisible anomaly escape a collapsing gate.",
			history:
				"Every Holy Knight chapter teaches a slightly different invocation word. All produce the same effect.",
			curse: "",
			personality:
				"Resolute; the glow intensifies when the caster is frightened.",
			current_owner: "Holy Knight chapters and Herald combat mandates.",
			prior_owners: ["Knight-Commander A. Seo"],
		},
		discoveryLore:
			"The Knight's original oath word was 'enough.' It still works.",
		tags: ["holy-knight", "herald", "radiant", "oath"],
	},
	{
		name: "Echolocation Pulse",
		level: 0,
		school: "Divination",
		classes: ["Stalker", "Technomancer"],
		castTime: "1 bonus action",
		range: "Self",
		dur: "1 round",
		conc: false,
		ritual: false,
		comp: { v: false, s: true, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "Gain blindsight 10 feet until end of your next turn.",
		effSec: "Invisible creatures within range are revealed to you.",
		desc: "Emit a subsonic mana pulse that maps your immediate surroundings. You gain blindsight 10 feet until the end of your next turn. Invisible or hidden creatures within that range are revealed to you.",
		higher:
			"Range extends to 15 feet at 5th level, 20 feet at 11th, and 30 feet at 17th.",
		area: { type: "radius", size: "10-foot", shape: "sphere" },
		flavor: "You don't need eyes. You have resonance.",
		lore: {
			origin:
				"Copied from the sensory organs of a Bat-Class gate anomaly after a Stalker spent three weeks observing it.",
			history:
				"Technomancers added a hardware-assisted variant that feeds data to their combat HUD.",
			curse: "",
			personality:
				"Focused; the caster involuntarily closes their eyes during the pulse.",
			current_owner: "Stalker and Technomancer field units.",
			prior_owners: ["Field Researcher P. Choi"],
		},
		discoveryLore:
			"The Stalker's field notes read: 'Day 19. The bat sees without seeing. I can do that too.'",
		tags: ["stalker", "technomancer", "sensory", "divination"],
	},
	{
		name: "Entropic Grasp",
		level: 0,
		school: "Necromancy",
		classes: ["Revenant", "Contractor"],
		castTime: "1 action",
		range: "Touch",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: false, s: true, m: false, f: "" },
		atkType: "melee",
		atkAbility: "Intelligence",
		dmg: "1d10",
		dmgType: "necrotic",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "1d10 necrotic damage.",
		effSec: "Caster gains temp HP equal to half damage dealt.",
		desc: "Seize a creature and drain its vitality through direct contact. Melee spell attack using Intelligence. On a hit, 1d10 necrotic damage, and you gain temporary hit points equal to half the damage dealt (minimum 1).",
		higher:
			"Damage increases by 1d10 at 5th level (2d10), 11th (3d10), and 17th (4d10).",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "You take what they have. It's only fair.",
		lore: {
			origin:
				"A forbidden technique from the pre-Bureau era when Revenants operated without oversight.",
			history:
				"Contractors adopted it after discovering their pact entities could amplify the drain.",
			curse: "",
			personality:
				"Hungry; the caster's hand darkens visibly during the grasp.",
			current_owner: "Advanced Revenant and Contractor practitioners.",
			prior_owners: ["Unnamed pre-Bureau Revenant"],
		},
		discoveryLore:
			"Bureau medical staff noted that the caster's vitals temporarily mirror the target's — heartbeat, breathing, even blood pressure.",
		tags: ["revenant", "contractor", "drain", "necrotic"],
	},
	{
		name: "Harmonic Shield",
		level: 0,
		school: "Abjuration",
		classes: ["Idol", "Herald", "Esper"],
		castTime: "1 reaction",
		range: "Self",
		dur: "1 round",
		conc: false,
		ritual: false,
		comp: { v: true, s: false, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "+2 AC against the triggering attack.",
		effSec:
			"If the attack misses, the attacker takes 1d4 thunder damage from resonance feedback.",
		desc: "As a reaction when attacked, hum a defensive harmonic that wraps you in a brief sonic barrier. You gain +2 AC against the triggering attack. If the attack misses due to this bonus, the attacker takes 1d4 thunder damage from resonance feedback.",
		higher:
			"Feedback damage increases to 2d4 at 5th level, 3d4 at 11th, and 4d4 at 17th.",
		area: { type: "point", size: "self", shape: "point" },
		flavor: "The note holds. The blade doesn't.",
		lore: {
			origin:
				"An Idol discovered that a specific B-flat frequency disrupted incoming kinetic energy.",
			history:
				"Herald combat chaplains incorporated it into their defensive chants within months.",
			curse: "",
			personality:
				"Melodic; bystanders hear a brief musical note even in silence.",
			current_owner: "Performance and divine caster guilds.",
			prior_owners: ["Vocal Coach R. Min"],
		},
		discoveryLore:
			"The frequency was identified during a concert when a stage-light bracket fell and the Idol's reflexive hum deflected it.",
		tags: ["idol", "herald", "esper", "defensive", "sonic"],
	},
	{
		name: "Rift Spark",
		level: 0,
		school: "Conjuration",
		classes: ["Summoner"],
		castTime: "1 action",
		range: "60 feet",
		dur: "Instantaneous",
		conc: false,
		ritual: false,
		comp: { v: true, s: true, m: false, f: "" },
		atkType: "ranged",
		atkAbility: "Sense",
		dmg: "1d8",
		dmgType: "force",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "1d8 force damage.",
		effSec:
			"Creates a 5-foot square of difficult terrain at the target's location until end of your next turn.",
		desc: "Tear a micro-rift at a point you can see within 60 feet. A burst of spatial distortion strikes one creature. Ranged spell attack using Sense; on hit, 1d8 force damage. The rift leaves behind a 5-foot square of difficult terrain until the end of your next turn.",
		higher:
			"Damage increases by 1d8 at 5th level. At 11th level, the difficult terrain persists for 1 minute.",
		area: { type: "point", size: "single target", shape: "point" },
		flavor: "Space hiccups. Something on the other side notices.",
		lore: {
			origin:
				"A Summoner's failed attempt to open a full gate accidentally produced this micro-rift effect.",
			history:
				"Bureau safety classified it as 'acceptable collateral' after extensive field testing.",
			curse: "",
			personality:
				"Unstable; the rift occasionally produces a faint scent of ozone and foreign soil.",
			current_owner: "Summoner training curriculum.",
			prior_owners: ["Rift Researcher Dr. E. Moon"],
		},
		discoveryLore:
			"The first successful cast left a patch of alien grass growing on a Seoul sidewalk for three days.",
		tags: ["summoner", "rift", "conjuration", "terrain"],
	},
	{
		name: "Mana Lens",
		level: 0,
		school: "Divination",
		classes: ["Mage", "Esper", "Technomancer"],
		castTime: "1 action",
		range: "Self",
		dur: "10 minutes",
		conc: true,
		ritual: false,
		comp: { v: true, s: true, m: false, f: "" },
		atkType: "",
		atkAbility: "",
		dmg: "",
		dmgType: "",
		saveAbility: "",
		saveDC: 0,
		saveSuccess: "",
		saveFailure: "",
		effPri: "See mana signatures within 30 feet.",
		effSec: "Advantage on Arcana checks to identify magical effects.",
		desc: "Attune your vision to detect ambient mana. For the duration, you can see mana signatures within 30 feet as colored auras: active spells glow blue, enchanted items glow gold, and gate-residue glows red. You have advantage on Arcana checks to identify magical effects you can see.",
		higher:
			"At 5th level, range extends to 60 feet. At 11th level, you can also see through magical darkness within the range.",
		area: { type: "radius", size: "30-foot", shape: "sphere" },
		flavor: "The world has always been glowing. Now you can see it.",
		lore: {
			origin:
				"Fundamental Bureau tool — every analyst learns this before they learn to file reports.",
			history:
				"Pre-Bureau Awakened describe an innate version that faded within the first generation.",
			curse: "",
			personality:
				"Calm; the caster's pupils dilate and take on a faint iridescent sheen.",
			current_owner: "Universal Bureau training.",
			prior_owners: ["First Bureau Analyst Corps"],
		},
		discoveryLore:
			"The first user reported seeing 'the entire city glow like a circuit board.' She was looking at Seoul's gate-scarred infrastructure.",
		tags: ["mage", "esper", "technomancer", "utility", "divination"],
	},
];

// Continue with Level 1-2 spells...
// (This is batch 1. Additional batches will follow.)

const fs = require("fs");

// Count by level
const levelCounts = {};
for (const s of spells) {
	levelCounts[s.level] = (levelCounts[s.level] || 0) + 1;
}
console.log("Spell counts by level:", JSON.stringify(levelCounts));
console.log("Total spells so far:", spells.length);

// Check uniqueness
const names = spells.map((s) => s.name);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
console.log("Duplicate names:", dupes.length === 0 ? "NONE ✓" : dupes);

const descs = spells.map((s) => s.desc);
const dupeDescs = descs.filter((d, i) => descs.indexOf(d) !== i);
console.log(
	"Duplicate descriptions:",
	dupeDescs.length === 0 ? "NONE ✓" : dupeDescs.length,
);

const flavors = spells.map((s) => s.flavor);
const dupeFlavors = flavors.filter((f, i) => flavors.indexOf(f) !== i);
console.log(
	"Duplicate flavors:",
	dupeFlavors.length === 0 ? "NONE ✓" : dupeFlavors.length,
);

// Class coverage
const classCoverage = {};
for (const s of spells) {
	for (const c of s.classes) {
		classCoverage[c] = (classCoverage[c] || 0) + 1;
	}
}
console.log("Class coverage:", JSON.stringify(classCoverage, null, 2));
