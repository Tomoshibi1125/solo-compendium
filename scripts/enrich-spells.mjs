/**
 * Spell Enrichment Script
 * Reads spells.ts, detects templated/stub entries, and rewrites descriptions
 * with unique, contextually-appropriate content based on name, type, rank, mechanics.
 *
 * Usage: node scripts/enrich-spells.mjs
 */

import fs from "node:fs";
import path from "node:path";

const SPELLS_PATH = path.resolve("src/data/compendium/spells.ts");
const raw = fs.readFileSync(SPELLS_PATH, "utf8");

// ── Extract the JSON array from the TS file ─────────────────────────────
const arrayStart = raw.indexOf("export const spells = [");
if (arrayStart === -1) {
	console.error("Could not find spells array");
	process.exit(1);
}
const header = raw.slice(0, arrayStart);
const arrayBody = raw.slice(arrayStart + "export const spells = [".length);

// Parse entries by finding each top-level object
const entries = [];
let depth = 0;
let current = "";
let inString = false;
let escape = false;

for (let i = 0; i < arrayBody.length; i++) {
	const ch = arrayBody[i];
	if (escape) {
		current += ch;
		escape = false;
		continue;
	}
	if (ch === "\\") {
		current += ch;
		escape = true;
		continue;
	}
	if (ch === '"') {
		inString = !inString;
		current += ch;
		continue;
	}
	if (inString) {
		current += ch;
		continue;
	}

	if (ch === "{") {
		if (depth === 0) current = "{";
		else current += ch;
		depth++;
	} else if (ch === "}") {
		depth--;
		current += ch;
		if (depth === 0) {
			try {
				// Remove trailing commas before parsing
				const cleaned = current.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
				entries.push(JSON.parse(cleaned));
			} catch (e) {
				// Skip unparseable entries
			}
			current = "";
		}
	} else if (depth > 0) {
		current += ch;
	}
}

console.log(`Parsed ${entries.length} spell entries`);

// ── Detect templated descriptions ───────────────────────────────────────
const TEMPLATE_PATTERN =
	/A powerful \w+ spell that \w+ targets with devastating force/i;
const GENERIC_EFFECT = /Deals \w+ damage and applies additional effects/i;

let templatedCount = 0;
let enrichedCount = 0;

// ── Spell name → unique description generators ──────────────────────────
const ELEMENT_DESCRIPTIONS = {
	shadow: [
		"darkness coalesces",
		"shadows gather",
		"void energy pulses",
		"umbral power surges",
	],
	void: [
		"dimensional rift tears open",
		"the void beckons",
		"reality thins",
		"entropy accelerates",
	],
	abyssal: [
		"abyssal energy erupts",
		"demonic resonance builds",
		"hellfire ignites",
		"the abyss responds",
	],
	fire: [
		"flames erupt",
		"heat distorts the air",
		"embers spiral",
		"infernal energy blazes",
	],
	ice: [
		"frost crystallizes",
		"cold bites deep",
		"permafrost spreads",
		"glacial power flows",
	],
	lightning: [
		"electricity arcs",
		"thunder rumbles",
		"static crackles",
		"voltage surges",
	],
	arcane: [
		"mana crystallizes",
		"arcane sigils flare",
		"magical weave tightens",
		"raw power coalesces",
	],
	holy: [
		"divine light blazes",
		"radiance pours forth",
		"sacred energy surges",
		"celestial power descends",
	],
	necrotic: [
		"death energy gathers",
		"life force drains",
		"decay spreads",
		"entropy accelerates",
	],
	force: [
		"invisible force hammers",
		"pure energy strikes",
		"kinetic power releases",
		"raw force detonates",
	],
	psychic: [
		"minds shatter",
		"thought becomes weapon",
		"consciousness fragments",
		"mental energy spikes",
	],
};

const TYPE_VERBS = {
	Attack: [
		"strikes",
		"blasts",
		"assaults",
		"devastates",
		"hammers",
		"shreds",
		"pierces",
		"rends",
	],
	Defense: [
		"shields",
		"protects",
		"wards",
		"deflects",
		"fortifies",
		"guards",
		"barriers against",
	],
	Utility: [
		"manipulates",
		"alters",
		"transforms",
		"reshapes",
		"channels",
		"weaves",
		"crafts",
	],
	Healing: [
		"mends",
		"restores",
		"rejuvenates",
		"revitalizes",
		"regenerates",
		"purifies",
		"heals",
	],
};

const RANK_POWER = {
	D: "minor",
	C: "moderate",
	B: "significant",
	A: "formidable",
	S: "overwhelming",
};

const RANK_FLAVOR = {
	D: "Hunters learn this early in their awakening.",
	C: "A staple in any serious hunter's arsenal.",
	B: "Mastered only by those who've cleared B-rank gates.",
	A: "A technique feared on every battlefield. Few can withstand it.",
	S: "The pinnacle of magical achievement. Legends are built on this power.",
};

function getElement(name) {
	const lower = name.toLowerCase();
	if (lower.includes("shadow")) return "shadow";
	if (lower.includes("void")) return "void";
	if (lower.includes("abyss")) return "abyssal";
	if (
		lower.includes("fire") ||
		lower.includes("flame") ||
		lower.includes("infern") ||
		lower.includes("blaze") ||
		lower.includes("magma")
	)
		return "fire";
	if (
		lower.includes("ice") ||
		lower.includes("frost") ||
		lower.includes("frozen") ||
		lower.includes("cryo") ||
		lower.includes("glacial")
	)
		return "ice";
	if (
		lower.includes("lightning") ||
		lower.includes("thunder") ||
		lower.includes("storm") ||
		lower.includes("volt") ||
		lower.includes("electric")
	)
		return "lightning";
	if (
		lower.includes("holy") ||
		lower.includes("divine") ||
		lower.includes("sacred") ||
		lower.includes("celestial") ||
		lower.includes("radiant")
	)
		return "holy";
	if (
		lower.includes("death") ||
		lower.includes("necro") ||
		lower.includes("undead") ||
		lower.includes("wither")
	)
		return "necrotic";
	if (
		lower.includes("psychic") ||
		lower.includes("mind") ||
		lower.includes("mental") ||
		lower.includes("psionic")
	)
		return "psychic";
	if (
		lower.includes("force") ||
		lower.includes("kinetic") ||
		lower.includes("gravity")
	)
		return "force";
	return "arcane";
}

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateDescription(spell) {
	const element = getElement(spell.name);
	const elemDescs =
		ELEMENT_DESCRIPTIONS[element] || ELEMENT_DESCRIPTIONS.arcane;
	const typeVerbs = TYPE_VERBS[spell.type] || TYPE_VERBS.Attack;
	const rankPower = RANK_POWER[spell.rank] || "moderate";
	const rankFlavor = RANK_FLAVOR[spell.rank] || "";

	const verb = pick(typeVerbs);
	const elemDesc = pick(elemDescs);

	if (spell.type === "Attack") {
		return `Channel ${rankPower} ${element} energy as ${elemDesc} around your hands. ${spell.name} ${verb} the target with concentrated destructive force. ${rankFlavor}`;
	}
	if (spell.type === "Defense") {
		return `Weave ${rankPower} ${element} energy into a protective manifestation as ${elemDesc}. ${spell.name} ${verb} against incoming harm with layered magical barriers. ${rankFlavor}`;
	}
	if (spell.type === "Healing") {
		return `Draw upon ${rankPower} ${element} energy as ${elemDesc} around the wounded. ${spell.name} ${verb} damaged tissue and restores vitality. ${rankFlavor}`;
	}
	return `Harness ${rankPower} ${element} energy as ${elemDesc}. ${spell.name} ${verb} the fabric of reality to produce extraordinary effects. ${rankFlavor}`;
}

function generateEffect(spell) {
	const element = getElement(spell.name);
	const dmgType =
		element === "shadow"
			? "necrotic"
			: element === "void"
				? "force"
				: element === "abyssal"
					? "fire"
					: element === "holy"
						? "radiant"
						: element;

	if (spell.type === "Attack") {
		const dice = spell.mechanics?.attack?.damage?.dice || "2d6";
		return `On a hit, deals ${dice} ${dmgType} damage. Critical hits apply the ${element} affliction condition for 1 round.`;
	}
	if (spell.type === "Defense") {
		return `Creates a barrier of ${element} energy that absorbs damage and grants temporary resistance to ${dmgType} damage.`;
	}
	if (spell.type === "Healing") {
		return `Restores hit points and removes one condition caused by ${element}-aligned sources.`;
	}
	return `Produces a ${element}-aligned effect that alters the environment or enhances the caster's capabilities.`;
}

function generateHigherLevels(spell) {
	if (spell.type === "Attack") {
		return `When cast at a higher tier, damage increases by 1d6 per tier above base. At S-rank, the spell gains a secondary effect based on its element.`;
	}
	if (spell.type === "Defense") {
		return `When cast at a higher tier, the barrier absorbs an additional 1d8 damage per tier above base and extends its duration.`;
	}
	if (spell.type === "Healing") {
		return `When cast at a higher tier, healing increases by 1d8 per tier above base. At A-rank and above, also removes one additional condition.`;
	}
	return `When cast at a higher tier, the effect's duration doubles and its area increases by 5 feet per tier above base.`;
}

// ── Process entries ─────────────────────────────────────────────────────
for (const spell of entries) {
	const isTemplated = TEMPLATE_PATTERN.test(spell.description || "");
	const isGenericEffect = GENERIC_EFFECT.test(spell.effect || "");

	if (isTemplated || isGenericEffect) {
		templatedCount++;

		if (isTemplated) {
			spell.description = generateDescription(spell);
			enrichedCount++;
		}

		if (isGenericEffect) {
			spell.effect = generateEffect(spell);
		}

		// Also enrich effects.primary if it's generic
		if (spell.effects?.primary && GENERIC_EFFECT.test(spell.effects.primary)) {
			spell.effects.primary = generateEffect(spell);
		}

		// Add higher_levels if missing
		if (!spell.higher_levels) {
			spell.higher_levels = generateHigherLevels(spell);
		}

		// Add atHigherLevels for DDB parity
		if (!spell.atHigherLevels) {
			spell.atHigherLevels = spell.higher_levels;
		}
	}
}

console.log(
	`Found ${templatedCount} templated entries, enriched ${enrichedCount}`,
);

// ── Write back ──────────────────────────────────────────────────────────
const output =
	header +
	"export const spells = [\n" +
	entries
		.map((e) => "  " + JSON.stringify(e, null, 2).split("\n").join("\n  "))
		.join(",\n") +
	"\n];\n";

fs.writeFileSync(SPELLS_PATH, output, "utf8");
console.log(`Written enriched spells to ${SPELLS_PATH}`);
