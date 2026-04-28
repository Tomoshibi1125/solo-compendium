// Gap-fill generator: produces themed loot entries in sparse archetypes.
// Output is written to src/data/compendium/items-gap-fill.ts and registered
// in items-index.ts.

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fnv1a } from "./lib.mjs";
import { rebuildItem } from "./rebuild.mjs";
import { serializeArrayBody } from "./serializer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..", "..");
const COMPENDIUM_DIR = join(ROOT, "src", "data", "compendium");

// =============================================================
// Catalog of gap-fill items
// =============================================================
//
// Format: { archetype, name, rarity, weight, value }
// The rebuild engine handles description, lore, flavor, mechanics, image, etc.

const RARITY_VALUE_BANDS = {
	common: { min: 5, max: 80 },
	uncommon: { min: 80, max: 350 },
	rare: { min: 350, max: 2500 },
	epic: { min: 2500, max: 15000 },
	legendary: { min: 15000, max: 100000 },
};

function val(rarity, hash) {
	const b = RARITY_VALUE_BANDS[rarity] || RARITY_VALUE_BANDS.common;
	return b.min + (hash % (b.max - b.min));
}

function weightFor(archetype) {
	if (archetype.startsWith("armor_heavy")) return 50;
	if (archetype.startsWith("armor_medium")) return 25;
	if (archetype.startsWith("armor_light") || archetype === "armor_headgear") return 8;
	if (archetype === "armor_shield") return 6;
	if (archetype.startsWith("firearm_")) return 4 + (archetype.includes("rifle") || archetype.includes("launcher") ? 4 : 0);
	if (archetype.startsWith("melee_")) return archetype.includes("heavy") ? 8 : 3;
	if (archetype.startsWith("ranged_")) return archetype.includes("crossbow") ? 6 : 2;
	if (archetype === "focus_tome") return 5;
	if (archetype.startsWith("focus_")) return 1;
	if (archetype.startsWith("consumable_")) return archetype.includes("grenade") ? 1 : 0.5;
	return 1;
}

// Themed adjective banks per category. Names are constructed: <Adj> <Noun>.
// Pools are large enough that adj × noun combinatorics support hundreds of unique names per archetype × rarity.
const THEMES_BY_RARITY = {
	common: [
		"Bureau-Issue", "Standard", "Tactical", "Reinforced", "Modern", "Bureau-Stamped",
		"Field-Issue", "Quartermaster's", "Service-Grade", "Issue-Standard", "Trainee",
		"Provisional", "Inspector's", "Recruit's", "Patrol", "Service",
		"Bureau-Approved", "Conscript's", "Cadet's", "Standard-Pattern",
	],
	uncommon: [
		"Veteran", "Frontier", "Renegade", "Field-Tested", "Mana-Treated", "Lattice-Stable",
		"Black-Market", "Reclaimed", "Salvaged", "Custom-Forged", "Refit", "Reissue",
		"Decorated", "Hardened", "Adept's", "Operative's", "Specialist's",
		"Sanctioned", "Bonded", "Sworn",
	],
	rare: [
		"Aetheric", "Crimson", "Frost", "Shadow", "Phantom", "Voidtouched",
		"Stormcaller", "Riftbound", "Toxic", "Glacial", "Umbral", "Manaforged",
		"Riftforged", "Oathbound", "Wraithtouched", "Ember", "Sanguine", "Lunar",
		"Stargazer's", "Skyveil", "Dreamfire", "Hexbound", "Lightseeker's", "Tempered",
	],
	epic: [
		"Eclipse", "Starlight", "Inferno", "Abyssal", "Tempest", "Dimensional",
		"Sanctified", "Holy", "Cataclysmic", "Singularity", "Apocalypse", "Archon's",
		"Worldbreaker's", "Wyrmflame", "Doom-Forged", "Resonant", "Hierophant's",
		"Ascendant", "Nebular", "Crownbearer's",
	],
	legendary: [
		"Regent's", "World-Eater", "First-Awakened", "Apex-Forged", "Doombound", "Cursed",
		"Architect's", "Singular", "Genesis", "Final", "Regent-Slayer's", "Echo of Origin",
		"Last-Light", "Dawnbringer's", "Endless", "Crownbearer's Heir", "Origin-Crowned",
	],
};

function pickAdj(rarity, hashSeed) {
	const pool = THEMES_BY_RARITY[rarity] || THEMES_BY_RARITY.common;
	return pool[hashSeed % pool.length];
}

const NOUNS_BY_ARCHETYPE = {
	// Gear
	gear_amulet: [
		"Amulet", "Pendant", "Talisman", "Locket", "Charm", "Lattice Pendant",
		"Sigil Amulet", "Necklace", "Cord Charm", "Mana Locket", "Bone Pendant",
		"Glass Talisman", "Stone Charm", "Crystal Pendant",
	],
	gear_ring: [
		"Ring", "Signet", "Band", "Loop", "Sealed Ring",
		"Inset Ring", "Mana Band", "Crested Ring", "Rune Ring", "Hammered Band",
		"Twin Band", "Stone Ring", "Bound Ring",
	],
	gear_belt: [
		"Belt", "Sash", "Holster", "Combat Belt", "Utility Belt",
		"Cinch Belt", "Combat Sash", "Battle Strap", "Webbing", "Operator Belt",
		"Tactical Sash", "Buckled Belt",
	],
	gear_boots: [
		"Boots", "Greaves", "Combat Boots", "Tactical Boots", "Stride Boots",
		"Footwraps", "Marching Boots", "Tread Boots", "Field Greaves", "Sprint Boots",
		"Patrol Boots", "Service Boots",
	],
	gear_navigation: [
		"Map", "Atlas", "Schematic", "Chart", "Layout Plate", "Gate Atlas",
		"Survey Map", "Recon Sheet", "Field Plate", "Coordinate Atlas",
	],
	gear_light: [
		"Lantern", "Flashlight", "Field Lantern", "Torch", "Beacon Light",
		"Hooded Lantern", "Bullseye Lantern", "Glow Rod", "Tactical Light", "Lamp",
		"Searchlight", "Pocket Lantern",
	],
	gear_credential: [
		"Badge", "ID Chip", "Tag", "Insignia", "Emblem", "Credential", "Operator ID",
		"Sigil Badge", "Authentication Token", "Identification Plate",
	],
	gear_kit: [
		"Field Kit", "Toolkit", "Medical Kit", "Forensic Kit", "Repair Kit",
		"Survival Kit", "Triage Kit", "Mana-Diagnostic Kit", "Lattice Toolkit",
		"Breach Kit", "Recovery Kit", "Tracking Kit",
	],
	gear_electronics: [
		"Scanner", "Recorder", "Mana Sensor", "Camera", "Receiver", "Tracking Drone",
		"Diagnostic Tool", "Lattice Probe", "Field Computer", "Comm Set", "Spotter Lens",
		"Telemetry Device",
	],
	gear_attire: [
		"Uniform", "Regalia", "Field Garb", "Tailored Suit",
		"Cloak", "Mantle", "Robe", "Hood", "Greatcoat", "Operator's Coat",
		"Hooded Robe", "Ceremonial Robe", "Hunter's Mantle",
	],
	gear_restraint: [
		"Cuffs", "Restraints", "Binders", "Lattice Cuffs", "Mana Cuffs",
		"Mana-Suppressor Cuffs", "Hardlight Cuffs", "Ankle Cuffs", "Manacles",
	],
	gear_bracer: [
		"Bracer", "Wristguard", "Forearm Plate", "Cuff",
		"Combat Bracer", "Hardened Bracer", "Mana-Lined Bracer", "Sigil Bracer",
		"Patrol Bracer",
	],
	gear_misc: [
		"Field Cache", "Token", "Marker", "Stamp", "Insignia",
		"Service Coin", "Pouch", "Pocket Token", "Bureau Marker", "Field Tag",
		"Quartermaster's Token",
	],
	gear_utility: [
		"Rope", "Tether", "Climbing Cable", "Anchor Line", "Repel Rig",
		"Grappling Hook", "Climbing Kit", "Crowbar", "Pry Bar", "Piton Set",
		"Padlock", "Hammer", "Chisel", "Saw", "Bedroll", "Tinderbox", "Mess Kit",
		"Whetstone", "Hand Mirror", "Spyglass", "Hand Drill",
	],

	// Consumables
	consumable_grenade: [
		"Grenade", "Charge", "Bomb", "Mine", "Payload",
		"Frag Charge", "Concussion Grenade", "Lattice Bomb", "EMP Charge",
		"Mana Mine", "Smoke Charge", "Breach Charge", "Detonator",
	],
	consumable_signal: [
		"Flare", "Signal Beacon", "Locator", "Pinger",
		"Smoke Signal", "Distress Beacon", "Marker Flare", "Recall Beacon",
	],
	consumable_scroll: [
		"Scroll", "Inscription", "Sigil Scroll", "Spell Scroll", "Casting Scroll",
		"Rune Scroll", "Cantrip Scroll", "Ward Scroll", "Sealed Inscription",
		"Lattice Scroll", "Battle Scroll",
	],
	consumable_ration: [
		"Ration", "Field Meal", "Trail Mix", "MRE", "Stim Bar",
		"Energy Bar", "Field Pack", "Survival Bar", "Recovery Pack",
	],
	consumable_stim: [
		"Stim", "Injector", "Serum", "Dose", "Syringe",
		"Combat Injector", "Field Stim", "Recovery Stim", "Endurance Serum",
		"Reflex Stim", "Adrenal Injector",
	],
	consumable_potion: [
		"Elixir", "Potion", "Tonic", "Brew", "Draught",
		"Phial", "Vial", "Flask", "Restorative", "Salve", "Cordial",
	],
	consumable_purifier: [
		"Antidote", "Purifier", "Cleanser", "Cure",
		"Detox", "Neutralizer", "Counter-Agent", "Restorative Vial",
	],

	// Foci
	focus_caster: [
		"Focus", "Catalyst", "Conduit", "Orb", "Prism",
		"Sigil Focus", "Mana Crystal", "Channel Stone", "Caster's Bead",
		"Lattice Crystal",
	],
	focus_wand: [
		"Wand", "Rod", "Sceptre", "Baton",
		"Channeler", "Mana Wand", "Cast Rod", "Sigil Wand", "Conductor",
		"Casting Baton",
	],
	focus_tome: [
		"Grimoire", "Codex", "Tome", "Spellbook", "Manual",
		"Casting Codex", "Sigil Tome", "Reference Codex", "Mana Manual",
		"Inscribed Manual",
	],

	// Ranged
	ranged_bow: [
		"Bow", "Longbow", "Recurve Bow", "Compound Bow", "Shortbow",
		"Composite Bow", "Combat Bow", "Field Bow", "Reflex Bow",
	],
	ranged_crossbow: [
		"Crossbow", "Repeater", "Heavy Crossbow", "Hand Crossbow",
		"Light Crossbow", "Auto-Crossbow", "Recurve Crossbow", "Field Crossbow",
	],
	ranged_thrown: [
		"Throwing Stars", "Shuriken", "Chakram", "Throwing Knives", "Throwing Axes",
		"Darts", "Bola", "Javelins", "Throwing Spears",
	],

	// Melee
	melee_blade_heavy: [
		"Greatsword", "Claymore", "Zweihander", "Two-Hander", "Nodachi",
		"Falchion", "Bastard Sword", "War Blade", "Reaver Sword",
	],
	melee_blade_versatile: [
		"Longsword", "Broadsword", "Saber", "Cutlass", "Katana", "Wakizashi",
		"Field Sword", "Service Blade", "Battle Blade",
	],
	melee_blade_finesse: [
		"Dagger", "Stiletto", "Knife", "Tanto", "Kunai", "Rapier",
		"Shortsword", "Field Knife", "Throwing Dagger", "Combat Knife",
	],
	melee_polearm: [
		"Spear", "Glaive", "Halberd", "Naginata", "Pike", "Lance",
		"Trident", "Combat Spear", "War Pike", "Reach Spear",
	],
	melee_bludgeon: [
		"Mace", "Club", "Cudgel", "Flail", "Morningstar", "War Pick",
		"Truncheon", "Combat Mace", "Spiked Mace",
	],
	melee_bludgeon_heavy: [
		"Warhammer", "Maul", "Sledge", "Greatmaul", "Battle Hammer",
		"Combat Sledge", "Bludgeon", "Crusher",
	],
	melee_staff: [
		"Staff", "Quarterstaff", "Combat Staff", "Bo Staff", "Battle Staff",
		"Casting Staff", "Reach Staff",
	],
	melee_axe: [
		"Axe", "Battle Axe", "Tomahawk", "Hand Axe", "War Axe",
		"Greataxe", "Field Axe",
	],
	melee_gauntlet: [
		"Gauntlets", "Knuckles", "Claws", "Battle Gauntlets", "Combat Knuckles",
		"Reinforced Gauntlets", "Strike Gauntlets",
	],
	melee_whip: [
		"Whip", "Chain Whip", "Kusarigama", "Combat Whip", "Lash",
		"Cord Whip", "Bullwhip",
	],
	melee_sickle: [
		"Sickle", "Kama", "Twin Sickles", "Reaping Blade", "Curved Blade",
	],

	// Armor
	armor_light: [
		"Combat Vest", "Tactical Coat", "Mana-Weave Jacket", "Reinforced Robe", "Field Cloak",
		"Stealth Suit", "Light Carapace", "Patrol Coat", "Service Robe",
	],
	armor_medium: [
		"Scale Mail", "Chain Shirt", "Brigandine", "Mail Shirt", "Mana Scale",
		"Layered Mail", "Combat Mail", "Service Brigandine", "Half-Plate",
	],
	armor_heavy: [
		"Plate Armor", "Carapace Armor", "Reinforced Plate", "Heavy Cuirass", "Battle Plate",
		"Field Plate", "Combat Plate", "Bulwark Plate", "Vanguard Plate",
	],
	armor_shield: [
		"Shield", "Tower Shield", "Buckler", "Bulwark", "Kite Shield",
		"Round Shield", "Combat Shield", "Patrol Shield",
	],
	armor_headgear: [
		"Combat Helm", "Tactical Visor", "Reinforced Mask", "Field Cowl", "Greathelm",
		"Service Helm", "Patrol Helm", "Battle Helm", "Operator Helm",
	],

	// Firearms (was previously left out of gap-fill)
	firearm_pistol: [
		"Pistol", "Sidearm", "Revolver", "Service Pistol", "Combat Pistol",
		"Suppressed Pistol", "Snub-Frame", "Magnum", "Holdout Pistol",
	],
	firearm_rifle: [
		"Rifle", "Carbine", "Marksman Rifle", "Service Rifle", "Combat Rifle",
		"Bolt-Action", "Auto-Rifle", "Bullpup",
	],
	firearm_shotgun: [
		"Shotgun", "Scattergun", "Pump-Action", "Auto-Shotgun", "Sawed-Off",
		"Combat Shotgun", "Breaching Shotgun",
	],
	firearm_smg: [
		"SMG", "Submachine Gun", "PDW", "Compact SMG", "Auto-SMG",
	],
	firearm_launcher: [
		"Launcher", "Grenade Launcher", "Rocket Launcher", "Field Launcher",
		"Heavy Launcher",
	],
};

// How many items per (archetype × rarity) we want to add.
// Targets are sized to bring each archetype to D&D Beyond-equivalent depth.
// Pool combinatorics: each archetype has ~10 nouns and ~17-20 themes per rarity,
// supporting up to 170-200 unique names per (archetype × rarity) before duplicates.
const TARGETS = [
	// === Wondrous gear: heavy DDB depth (rings/amulets/belts/boots/cloaks have huge magic catalogs) ===
	{ archetype: "gear_amulet", counts: { common: 8, uncommon: 14, rare: 14, epic: 8, legendary: 4 } },
	{ archetype: "gear_ring", counts: { common: 8, uncommon: 18, rare: 18, epic: 10, legendary: 4 } },
	{ archetype: "gear_belt", counts: { common: 6, uncommon: 10, rare: 8, epic: 4, legendary: 2 } },
	{ archetype: "gear_boots", counts: { common: 6, uncommon: 10, rare: 8, epic: 4, legendary: 2 } },
	{ archetype: "gear_attire", counts: { common: 6, uncommon: 12, rare: 10, epic: 5, legendary: 2 } },
	{ archetype: "gear_bracer", counts: { common: 4, uncommon: 8, rare: 6, epic: 3 } },
	{ archetype: "gear_navigation", counts: { common: 6, uncommon: 4, rare: 2 } },
	{ archetype: "gear_light", counts: { common: 6, uncommon: 4, rare: 2 } },
	{ archetype: "gear_credential", counts: { common: 4, uncommon: 3 } },
	{ archetype: "gear_kit", counts: { common: 5, uncommon: 4, rare: 2 } },
	{ archetype: "gear_electronics", counts: { common: 5, uncommon: 5, rare: 3, epic: 1 } },
	{ archetype: "gear_restraint", counts: { common: 3, uncommon: 2, rare: 1 } },
	{ archetype: "gear_utility", counts: { common: 14, uncommon: 6, rare: 2 } },
	{ archetype: "gear_misc", counts: { common: 5, uncommon: 3 } },

	// === Consumables (DDB has a huge consumable catalog: potions, scrolls, grenades, etc.) ===
	{ archetype: "consumable_grenade", counts: { common: 6, uncommon: 8, rare: 6, epic: 3, legendary: 1 } },
	{ archetype: "consumable_signal", counts: { common: 5, uncommon: 3, rare: 1 } },
	{ archetype: "consumable_scroll", counts: { common: 10, uncommon: 18, rare: 18, epic: 10, legendary: 4 } },
	{ archetype: "consumable_ration", counts: { common: 6, uncommon: 2 } },
	{ archetype: "consumable_potion", counts: { common: 4, uncommon: 6, rare: 6, epic: 3, legendary: 1 } },
	{ archetype: "consumable_purifier", counts: { common: 4, uncommon: 4, rare: 2 } },
	{ archetype: "consumable_stim", counts: { common: 4, uncommon: 6, rare: 4, epic: 2 } },

	// === Foci (DDB has wand of fireball, staff of power, etc. — many entries) ===
	{ archetype: "focus_caster", counts: { common: 4, uncommon: 6, rare: 5, epic: 3, legendary: 1 } },
	{ archetype: "focus_wand", counts: { common: 4, uncommon: 8, rare: 8, epic: 4, legendary: 2 } },
	{ archetype: "focus_tome", counts: { common: 4, uncommon: 6, rare: 5, epic: 2, legendary: 1 } },

	// === Ranged ===
	{ archetype: "ranged_bow", counts: { common: 4, uncommon: 6, rare: 5, epic: 2, legendary: 1 } },
	{ archetype: "ranged_crossbow", counts: { common: 4, uncommon: 6, rare: 4, epic: 2 } },
	{ archetype: "ranged_thrown", counts: { common: 5, uncommon: 4, rare: 2 } },

	// === Melee weapons (each weapon class gets ~15-25 entries to mirror DDB +1/+2/+3 spread) ===
	{ archetype: "melee_blade_heavy", counts: { common: 4, uncommon: 8, rare: 6, epic: 3, legendary: 1 } },
	{ archetype: "melee_blade_versatile", counts: { common: 3, uncommon: 4, rare: 3, epic: 2, legendary: 1 } },
	{ archetype: "melee_blade_finesse", counts: { common: 3, uncommon: 4, rare: 3, epic: 2, legendary: 1 } },
	{ archetype: "melee_polearm", counts: { common: 2, uncommon: 3, rare: 3, epic: 1 } },
	{ archetype: "melee_bludgeon", counts: { common: 5, uncommon: 6, rare: 5, epic: 2, legendary: 1 } },
	{ archetype: "melee_bludgeon_heavy", counts: { common: 2, uncommon: 3, rare: 3, epic: 1 } },
	{ archetype: "melee_staff", counts: { common: 4, uncommon: 6, rare: 5, epic: 2, legendary: 1 } },
	{ archetype: "melee_sickle", counts: { common: 2, uncommon: 3, rare: 2, epic: 1 } },
	{ archetype: "melee_axe", counts: { common: 4, uncommon: 6, rare: 5, epic: 2, legendary: 1 } },
	{ archetype: "melee_gauntlet", counts: { common: 2, uncommon: 3, rare: 2, epic: 1 } },
	{ archetype: "melee_whip", counts: { common: 2, uncommon: 3, rare: 2 } },

	// === Armor ===
	{ archetype: "armor_light", counts: { common: 2, uncommon: 4, rare: 3, epic: 1, legendary: 1 } },
	{ archetype: "armor_medium", counts: { common: 4, uncommon: 8, rare: 6, epic: 3, legendary: 1 } },
	{ archetype: "armor_heavy", counts: { common: 2, uncommon: 4, rare: 3, epic: 2, legendary: 1 } },
	{ archetype: "armor_shield", counts: { common: 4, uncommon: 8, rare: 6, epic: 3, legendary: 1 } },
	{ archetype: "armor_headgear", counts: { common: 3, uncommon: 5, rare: 4, epic: 2, legendary: 1 } },

	// === Firearms (now in gap-fill too — DDB-equivalent depth) ===
	{ archetype: "firearm_pistol", counts: { common: 4, uncommon: 6, rare: 5, epic: 2, legendary: 1 } },
	{ archetype: "firearm_rifle", counts: { common: 4, uncommon: 6, rare: 4, epic: 2, legendary: 1 } },
	{ archetype: "firearm_shotgun", counts: { common: 4, uncommon: 5, rare: 3, epic: 1 } },
	{ archetype: "firearm_smg", counts: { common: 4, uncommon: 4, rare: 3, epic: 1 } },
	{ archetype: "firearm_launcher", counts: { common: 2, uncommon: 3, rare: 2, epic: 1 } },
];

// =============================================================
// Generation
// =============================================================

function rotateNoun(archetype, idx) {
	const pool = NOUNS_BY_ARCHETYPE[archetype];
	if (!pool) return "Item";
	return pool[idx % pool.length];
}

function generate() {
	const out = [];
	const seenNames = new Set();
	let counter = 0;
	for (const target of TARGETS) {
		const { archetype, counts } = target;
		for (const rarity of ["common", "uncommon", "rare", "epic", "legendary"]) {
			const n = counts[rarity] || 0;
			// Build the deterministic shuffled (adj × noun) catalog for this archetype × rarity.
			const adjPool = THEMES_BY_RARITY[rarity] || THEMES_BY_RARITY.common;
			const nounPool = NOUNS_BY_ARCHETYPE[archetype] || ["Item"];
			const combos = [];
			for (const a of adjPool) for (const x of nounPool) combos.push([a, x]);
			// Deterministic shuffle by FNV
			combos.sort((aPair, bPair) => {
				const aHash = fnv1a(`${archetype}::${rarity}::${aPair.join("/")}`);
				const bHash = fnv1a(`${archetype}::${rarity}::${bPair.join("/")}`);
				return aHash - bHash;
			});
			let placed = 0;
			let idx = 0;
			while (placed < n && idx < combos.length * 4) {
				const baseIdx = idx % combos.length;
				const cycle = Math.floor(idx / combos.length);
				const [adj, noun] = combos[baseIdx];
				// First cycle: bare name. Subsequent cycles: append "Mk II", "Mk III", "Mk IV" suffix.
				let name = `${adj} ${noun}`;
				if (cycle > 0) {
					const mark = ["Mk II", "Mk III", "Mk IV"][cycle - 1] || `Mk ${cycle + 1}`;
					name = `${adj} ${noun} ${mark}`;
				}
				idx += 1;
				if (seenNames.has(name.toLowerCase())) continue;
				seenNames.add(name.toLowerCase());
				counter += 1;
				const id = `gap_${archetype}_${rarity}_${placed}`;
				const rawItem = {
					id,
					name,
					rarity,
					type: archetypeToType(archetype),
					weight: weightFor(archetype),
					value: val(rarity, fnv1a(id)),
					source: "Gap-Fill Catalog",
				};
				out.push(rebuildItem(rawItem, "items-gap-fill.ts"));
				placed += 1;
			}
		}
	}
	return out;
}

function archetypeToType(a) {
	if (a.startsWith("firearm_") || a.startsWith("melee_") || a.startsWith("ranged_") || a === "focus_wand") return "weapon";
	if (a.startsWith("armor_")) return "armor";
	if (a.startsWith("consumable_")) return "consumable";
	if (a === "focus_tome") return "scroll";
	if (a === "focus_caster") return "focus";
	if (a === "gear_amulet") return "amulet";
	if (a === "gear_ring") return "ring";
	return "wondrous";
}

function writeOutput(items) {
	const filePath = join(COMPENDIUM_DIR, "items-gap-fill.ts");
	const header = `import type { Item } from "./items";\n\n// Auto-generated gap-fill items. Source: scripts/loot/generate-gapfill.mjs\n// To regenerate, run: node scripts/loot/generate-gapfill.mjs\n`;
	const body = serializeArrayBody(items, 1);
	const out = `${header}\nexport const items_gap_fill: Item[] = [\n${body},\n];\n`;
	writeFileSync(filePath, out, "utf8");
	console.log(`✔ wrote ${filePath} (${items.length} entries)`);
	return items.length;
}

function ensureRegisteredInIndex() {
	const indexPath = join(COMPENDIUM_DIR, "items-index.ts");
	if (!existsSync(indexPath)) {
		console.warn(`! items-index.ts not found at ${indexPath}; skipping registration`);
		return;
	}
	const text = readFileSync(indexPath, "utf8");
	if (text.includes("items_gap_fill") || text.includes("items-gap-fill")) {
		console.log("✔ items-gap-fill already registered in items-index.ts");
		return;
	}
	console.warn("! items-gap-fill not registered in items-index.ts. Manual edit recommended (see README at top of generated file).");
}

function main() {
	const items = generate();
	writeOutput(items);
	ensureRegisteredInIndex();
}

main();
