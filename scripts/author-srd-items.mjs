// Phase 1b SRD 5.1 completeness: author the SRD equipment staples that RA was
// missing, as clean RA-native base records run through the loot enrichItemPayload
// engine (audit-valid ra-item-v1 payloads, unique per-entry signatures).
//
// Weapons, armor, equipment packs, foci, and Idol instruments are already
// complete (see src/data/srd-item-manifest.json). The genuine gaps are the tool
// proficiency surface (artisan's tools, gaming sets, and the remaining kits),
// two ammunition types, and a handful of functional kits — all confirmed absent
// and rules-referenced. RA-native flavor per compendium-content-ra-native: modern
// setting, gates/Bureau/mana/Hunters — never generic medieval fantasy.
//
// Idempotent: re-running removes any prior output (by the `base-srd-` id prefix)
// and re-adds the current specs.
//
// Usage: node scripts/author-srd-items.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { assignImage } from "./loot/lib.mjs";
import { enrichItemPayload } from "./loot/rebuild.mjs";
import { serializeArrayBody } from "./loot/serializer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(
	__dirname,
	"..",
	"src",
	"data",
	"compendium",
	"items-base-equipment.ts",
);

const isAuthoredId = (id) => /^base-srd-/.test(id);

const TOOL_PROF = (clause) =>
	`While proficient with these tools, add your proficiency bonus to ability checks you make to ${clause}.`;
const GAMING_PROF =
	"While proficient with this gaming set, add your proficiency bonus to ability checks you make to play it.";

// [idSuffix, name, item_type, weight, crystalValue, description, effect]
const SPECS = [
	// --- Restraint weapon (SRD Net, modeled as a utility capture tool) ---
	[
		"net-capture",
		"Capture Net",
		"misc",
		3,
		100,
		"A weighted mana-mesh net a Hunter throws to entangle a gate-beast before it can close the distance.",
		"A Large or smaller creature you hit with a ranged attack (range 5/15) is restrained until it uses an action to make a DC 10 Strength check to free itself, or until the net (AC 10, 5 HP) is destroyed.",
	],

	// --- Ammunition ---
	[
		"ammo-blowgun-needles",
		"Blowgun Needles (50)",
		"misc",
		1,
		10,
		"A slim tin of fifty lacquered blowgun needles, each balanced for a clean, silent shot.",
		"Ammunition for a blowgun. Needles recovered after a fight can be reused.",
	],
	[
		"ammo-sling-bullets",
		"Sling Bullets (20)",
		"misc",
		2,
		4,
		"A pouch of twenty cast-lead sling bullets, uniform and dense for consistent range.",
		"Ammunition for a sling. Bullets recovered after a fight can be reused.",
	],

	// --- Artisan's tools (modern crafting kits; item_type "tool") ---
	[
		"tool-alchemist",
		"Alchemist's Supplies",
		"tool",
		8,
		500,
		"A modern chemistry case of retorts, reagents, and mana-stable solvents for brewing field compounds.",
		TOOL_PROF("identify substances or craft alchemical items"),
	],
	[
		"tool-brewer",
		"Brewer's Supplies",
		"tool",
		9,
		200,
		"Portable fermenting gear and mana-purified yeasts for brewing drinkable — and sometimes potent — batches.",
		TOOL_PROF("brew batches and purify tainted water"),
	],
	[
		"tool-calligrapher",
		"Calligrapher's Supplies",
		"tool",
		5,
		100,
		"Precision pens, inks, and stencils for clean official script and forgery-resistant Bureau seals.",
		TOOL_PROF("produce clean script and spot forged documents"),
	],
	[
		"tool-carpenter",
		"Carpenter's Tools",
		"tool",
		6,
		80,
		"A powered kit of saws, drivers, and clamps for framing shelters and barricading gate approaches.",
		TOOL_PROF("build, brace, or breach wooden structures"),
	],
	[
		"tool-cartographer",
		"Cartographer's Tools",
		"tool",
		6,
		150,
		"Drafting instruments and a rangefinder for charting gate interiors and shifting terrain.",
		TOOL_PROF("chart terrain and read maps"),
	],
	[
		"tool-cobbler",
		"Cobbler's Tools",
		"tool",
		5,
		50,
		"Lasts, cutters, and mana-cured adhesives for repairing and reinforcing field footwear.",
		TOOL_PROF("repair and reinforce footwear"),
	],
	[
		"tool-cook",
		"Cook's Utensils",
		"tool",
		8,
		30,
		"A compact field kitchen; a good meal keeps a clear team steady between fights.",
		TOOL_PROF("prepare meals that aid a short rest's recovery"),
	],
	[
		"tool-glassblower",
		"Glassblower's Tools",
		"tool",
		5,
		300,
		"A torch, blowpipe, and shaping jacks for forming lenses, vials, and mana-glass focuses.",
		TOOL_PROF("shape glass lenses, vials, and focuses"),
	],
	[
		"tool-jeweler",
		"Jeweler's Tools",
		"tool",
		2,
		400,
		"Loupes, files, and setting tools for cutting gemstones and mounting mana crystals.",
		TOOL_PROF("appraise gemstones and mount mana crystals"),
	],
	[
		"tool-leatherworker",
		"Leatherworker's Tools",
		"tool",
		5,
		50,
		"Punches, needles, and dyes for cutting and fitting armor leathers and harnesses.",
		TOOL_PROF("craft and repair leather goods and harnesses"),
	],
	[
		"tool-mason",
		"Mason's Tools",
		"tool",
		8,
		80,
		"Trowels, chisels, and a mana-set mortar for raising or breaching stonework.",
		TOOL_PROF("raise or breach stonework"),
	],
	[
		"tool-painter",
		"Painter's Supplies",
		"tool",
		5,
		100,
		"Brushes, pigments, and sealants — for canvases, camouflage, or marking cleared zones.",
		TOOL_PROF("paint, camouflage, or mark surfaces"),
	],
	[
		"tool-potter",
		"Potter's Tools",
		"tool",
		3,
		100,
		"A wheel kit and shaping ribs for forming vessels and ceramic mana-cores.",
		TOOL_PROF("form ceramics and mana-core vessels"),
	],
	[
		"tool-smith",
		"Smith's Tools",
		"tool",
		8,
		200,
		"A portable forge kit for shaping and repairing mana-reactive alloy gear.",
		TOOL_PROF("forge and repair metal gear"),
	],
	[
		"tool-weaver",
		"Weaver's Tools",
		"tool",
		5,
		10,
		"A loom kit and mana-fibre spools for weaving cloth, netting, and ward-lined garments.",
		TOOL_PROF("weave cloth, netting, and ward-lined garments"),
	],
	[
		"tool-woodcarver",
		"Woodcarver's Tools",
		"tool",
		5,
		10,
		"Knives and gouges for carving hafts, stocks, and sigil-etched fetishes.",
		TOOL_PROF("carve hafts, stocks, and fetishes"),
	],

	// --- Gaming sets (RA-native modern games) ---
	[
		"game-dice",
		"Dice Set",
		"tool",
		0,
		10,
		"A set of weighted casino dice in a felt cup — a Hunter's favorite off-duty vice.",
		GAMING_PROF,
	],
	[
		"game-cards",
		"Playing Card Deck",
		"tool",
		0,
		10,
		"A slick plastic-coated card deck, equally at home in a barracks game or a downtown con.",
		GAMING_PROF,
	],
	[
		"game-console",
		"Handheld Game Console",
		"tool",
		1,
		250,
		"A pocket console loaded with the season's hits — and a few underground titles.",
		GAMING_PROF,
	],
	[
		"game-board",
		"Strategy Board Set",
		"tool",
		3,
		80,
		"A modern tactics board game of gates and monarchs, popular in Bureau break rooms.",
		GAMING_PROF,
	],

	// --- Other tool kits ---
	[
		"tool-disguise",
		"Disguise Kit",
		"tool",
		3,
		250,
		"Cosmetics, prosthetics, and quick-change pieces for passing unnoticed.",
		TOOL_PROF("create or see through a disguise"),
	],
	[
		"tool-forgery",
		"Forgery Kit",
		"tool",
		5,
		150,
		"Papers, seals, and inks for producing convincing documents and credentials.",
		TOOL_PROF("forge documents and credentials"),
	],
	[
		"tool-herbalism",
		"Herbalism Kit",
		"tool",
		3,
		50,
		"Pouches, shears, and a press for harvesting gate-flora and preparing remedies.",
		"While proficient with this kit, add your proficiency bonus to checks made to identify or apply herbs, and you can craft antitoxin and healing salves.",
	],
	[
		"tool-navigator",
		"Gate Navigator's Kit",
		"tool",
		2,
		25,
		"Charts, a rift-compass, and a depth gauge for holding a bearing inside a shifting gate.",
		"While proficient with this kit, add your proficiency bonus to checks made to navigate and to avoid getting lost.",
	],
	[
		"tool-poisoner",
		"Poisoner's Kit",
		"tool",
		2,
		50,
		"Vials, filters, and antivenin stock for extracting and applying toxins safely.",
		TOOL_PROF("craft and apply poisons"),
	],

	// --- Functional kits / gear (item_type "misc") ---
	[
		"gear-medkit",
		"Field Medkit",
		"misc",
		3,
		50,
		"A modern trauma kit of tourniquets, sealant, and mana-stimulants — standard on every clear team.",
		"Has ten uses. As an action, expend one use to stabilize a creature at 0 hit points without needing a Medicine check.",
	],
	[
		"gear-climbers-kit",
		"Climber's Kit",
		"misc",
		12,
		25,
		"Pitons, boot tips, gloves, and a harness for scaling the sheer walls a gate throws up.",
		"As an action, anchor yourself with the kit; while anchored you cannot fall more than 25 feet and cannot move more than 25 feet from the anchor without undoing it.",
	],
	[
		"gear-grappling-hook",
		"Grappling Hook",
		"misc",
		4,
		5,
		"A forged three-prong hook rated for a Hunter's line and body weight.",
		"Attach it to a rope to secure a climb or catch and pull an object within reach.",
	],
	[
		"gear-antitoxin-injector",
		"Antitoxin Injector",
		"misc",
		0,
		50,
		"A single-dose auto-injector of broad-spectrum antitoxin, keyed to common gate-venoms.",
		"When you inject a dose, you have advantage on saving throws against poison for 1 hour. It confers no benefit to undead or constructs.",
	],
];

function parseItemArrayFile(filePath, exportName) {
	const text = readFileSync(filePath, "utf8");
	const re = new RegExp(
		`export\\s+const\\s+${exportName}\\s*:\\s*[A-Za-z_][\\w<>\\[\\]\\s]*\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;\\s*$`,
		"m",
	);
	const m = text.match(re);
	const arr = Function(`"use strict"; return (${m[1]});`)();
	return { arr, header: text.slice(0, m.index) };
}

function buildBaseRecord([
	idSuffix,
	name,
	itemType,
	weight,
	amount,
	description,
	effect,
]) {
	const id = `base-srd-${idSuffix}`;
	return {
		id,
		name,
		source_book: "Rift Ascendant Canon",
		description,
		rarity: "common",
		type: "wondrous",
		image: assignImage("items-base-equipment.ts", id, name),
		weight,
		value: { currency: "crystal", amount },
		item_type: itemType,
		sigil_slots_base: 0,
		properties: {},
		effects: { passive: [effect] },
	};
}

const { arr, header } = parseItemArrayFile(FILE, "baseEquipment");
const kept = arr.filter((e) => !isAuthoredId(e.id));
const removed = arr.length - kept.length;
const added = SPECS.map((spec) =>
	enrichItemPayload(buildBaseRecord(spec), "items-base-equipment.ts"),
);
const out = [...kept, ...added];

const body = serializeArrayBody(out, 1);
writeFileSync(
	FILE,
	`${header.replace(/\n+$/, "\n")}\nexport const baseEquipment: Item[] = [\n${body},\n];\n`,
	"utf8",
);
console.log(
	`items-base-equipment.ts: removed ${removed} prior SRD entries, added ${added.length} RA-native SRD staples (total ${out.length}).`,
);
