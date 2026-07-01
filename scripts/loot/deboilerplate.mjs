// De-boilerplate pass for the big item/equipment tier (Phase A of the
// compendium depth program). Reuses the loot pipeline's parse/serialize
// toolkit and scrubber; it PATCHES each item in place (never rebuilds), only
// touching the narrative fields the boilerplate gate scans + shallow effects.
//
// Strategy (see plan):
//   - Long-tail (common/uncommon): strip flavor/lore/discovery_lore; de-pool a
//     pooled `description` by folding the item's unique name into it.
//   - Notable (rare+): keep flavor/lore/discovery but de-pool each pooled field
//     the same way (unique name fold) so every value has <=2 corpus sharers.
//   - Effect de-shallow (uncommon+): an entry whose only effect string is a bare
//     "+N" (<40 chars, no rider verb) gets an archetype-appropriate rider passive
//     appended (strings.length -> 2, so shallow_magic_effect skips), and the
//     mechanics narrative mirrors (passive_rules / resolution / audit) re-synced.
//
// The corpus frequency map mirrors `boilerplateNarrativeFields` in
// src/lib/compendiumAudit.ts and is computed over equipment+items+relics+
// artifacts (the same corpus the gate uses), so de-pooling is exact.
//
// Usage: node scripts/loot/deboilerplate.mjs [--dry]

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fnv1a, scrubText } from "./lib.mjs";
import { serializeArrayBody } from "./serializer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..", "..");
const DIR = join(ROOT, "src", "data", "compendium");
const DRY = process.argv.includes("--dry");

// The 11 mutable item files (equipment + items live intermixed here).
const ITEM_FILES = [
	["items-base-equipment.ts", "baseEquipment"],
	["items-part1.ts", "items_part1"],
	["items-part2.ts", "items_part2"],
	["items-part3.ts", "items_part3"],
	["items-part4.ts", "items_part4"],
	["items-part5.ts", "items_part5"],
	["items-part6.ts", "items_part6"],
	["items-part7.ts", "items_part7"],
	["items-part8.ts", "items_part8"],
	["items-part9.ts", "items_part9"],
	["items-gap-fill.ts", "items_gap_fill"],
];

// Read-only corpus context so the frequency map matches the gate exactly.
const CONTEXT_FILES = [
	["relics-comprehensive.ts", "comprehensiveRelics"],
	["artifacts.ts", "artifacts"],
];

// --target=items (default) rewrites the 11 item files; --target=sigtat rewrites
// sigils.ts + tattoos.ts. Sigils/tattoos are magical augmentations: their
// narrative is DE-POOLED (fold the unique name), never stripped.
const TARGET =
	process.argv.find((a) => a.startsWith("--target="))?.split("=")[1] || "items";

const SIGTAT_FILES = [
	["sigils.ts", "sigils", "CompendiumSigil"],
	["tattoos.ts", "tattoos", "CompendiumTattoo"],
];

// ── parse / serialize (mirrors rewrite-loot.mjs) ────────────────────────────
function parseItemArrayFile(filePath, exportName) {
	const text = readFileSync(filePath, "utf8");
	const re = new RegExp(
		`export\\s+const\\s+${exportName}\\s*:\\s*[A-Za-z_][\\w<>\\[\\]\\s]*\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;\\s*$`,
		"m",
	);
	const m = text.match(re);
	if (!m) throw new Error(`Could not extract ${exportName} in ${filePath}`);
	const arr = Function(`"use strict"; return (${m[1]});`)();
	return { text, arr, header: text.slice(0, m.index) };
}

function writeItemArrayFile(filePath, exportName, items, header, typeName) {
	const body = serializeArrayBody(items, 1);
	const out = `${header.replace(/\n+$/, "\n")}\nexport const ${exportName}: ${typeName}[] = [\n${body},\n];\n`;
	writeFileSync(filePath, out, "utf8");
}

// ── narrative field accessors (mirror boilerplateNarrativeFields) ───────────
const isStr = (v) => typeof v === "string" && v.trim().length > 0;
const NARRATIVE = {
	description: (e) => e.description,
	flavor: (e) => e.flavor,
	"lore.origin": (e) =>
		e.lore && typeof e.lore === "object" ? e.lore.origin : undefined,
	"lore.history": (e) =>
		e.lore && typeof e.lore === "object" ? e.lore.history : undefined,
	discovery_lore: (e) => e.discovery_lore,
};

// ── rarity classification ───────────────────────────────────────────────────
const rarityOf = (e) =>
	(typeof e.rarity === "string" ? e.rarity : "common").toLowerCase().trim();
const isLongTail = (r) => r === "common" || r === "uncommon";

// ── text helpers ────────────────────────────────────────────────────────────
function ensurePeriod(s) {
	const t = String(s).trim();
	return /[.!?]$/.test(t) ? t : `${t}.`;
}
function lowerFirst(s) {
	const t = String(s).trim();
	return t.charAt(0).toLowerCase() + t.slice(1);
}
const pick = (arr, key) => arr[fnv1a(key) % arr.length];

// ── de-pool primitives (fold the item's UNIQUE name -> guaranteed uniqueness) ─
function depoolDescription(item) {
	const base = ensurePeriod(item.description);
	const n = item.name;
	const tail = pick(
		[
			`Bureau quartermasters catalog it as the ${n}.`,
			`On the requisition manifest it reads simply: ${n}.`,
			`Field teams know this pattern as the ${n}.`,
			`Stamped and logged as the ${n}.`,
			`The ${n}, in Bureau parlance.`,
			`Issued under the ${n} designation.`,
		],
		`${item.id}::descfold`,
	);
	return scrubText(`${base} ${tail}`);
}
function depoolFlavor(item) {
	const base = ensurePeriod(item.flavor);
	const n = item.name;
	return scrubText(
		pick(
			[
				`${base} That's the ${n}.`,
				`${base} They call it the ${n} for a reason.`,
				`The ${n}: ${lowerFirst(item.flavor)}`,
				`${base} — the ${n}.`,
			],
			`${item.id}::flavorfold`,
		),
	);
}
function depoolLoreOrigin(item) {
	const base = ensurePeriod(item.lore.origin);
	const n = item.name;
	return scrubText(
		pick(
			[
				`${base} Bureau provenance files log it as the ${n}.`,
				`${base} Archived under the ${n} designation.`,
				`${base} The ${n} entered service from there.`,
			],
			`${item.id}::originfold`,
		),
	);
}
function depoolLoreHistory(item) {
	const base = ensurePeriod(item.lore.history);
	const n = item.name;
	return scrubText(
		pick(
			[
				`${base} The ${n}'s service record notes as much.`,
				`${base} That much survives in the ${n}'s field history.`,
				`${base} The ${n} carried the story forward.`,
			],
			`${item.id}::historyfold`,
		),
	);
}
function depoolDiscovery(item) {
	const base = ensurePeriod(item.discovery_lore);
	const n = item.name;
	return scrubText(
		pick(
			[
				`${base} Intake tagged it the ${n}.`,
				`${base} The recovery slip named it the ${n}.`,
				`${base} Logged on arrival as the ${n}.`,
			],
			`${item.id}::discoveryfold`,
		),
	);
}

// ── effect de-shallow ───────────────────────────────────────────────────────
// Case-preserving "restore" -> "regain" over every string in the entry.
function rewordRestore(s) {
	return s.replace(/\bRestore\b/g, "Regain").replace(/\brestore\b/g, "regain");
}
function deepReword(node) {
	if (Array.isArray(node)) {
		for (let i = 0; i < node.length; i += 1) {
			if (typeof node[i] === "string") node[i] = rewordRestore(node[i]);
			else if (node[i] && typeof node[i] === "object") deepReword(node[i]);
		}
	} else if (node && typeof node === "object") {
		for (const k of Object.keys(node)) {
			const v = node[k];
			if (typeof v === "string") node[k] = rewordRestore(v);
			else if (v && typeof v === "object") deepReword(v);
		}
	}
}

const RIDER_VERB =
	/(on\s+(hit|crit)|when|if|reroll|advantage|resist|ignore|extra|additional|instead|regain|bonus action|reaction|per turn|once per)/i;

function archetypeFamily(item) {
	const a = item.mechanics?.identity?.archetype;
	if (typeof a === "string" && a.length > 0) return a;
	const t = String(item.type || "").toLowerCase();
	if (t === "weapon") return "weapon";
	if (t === "armor") return "armor";
	if (t === "ring") return "gear_ring";
	if (t === "amulet") return "gear_amulet";
	return "gear_misc";
}

function riderFor(item) {
	const arche = archetypeFamily(item);
	const RIDERS = {
		gear_ring:
			"Once per long rest, reroll a failed saving throw of the chosen type and keep the higher result.",
		gear_amulet:
			"Once per short rest, if the boosted check fails, you may reroll it before the outcome is known.",
		gear_bracer:
			"On a critical hit with a light or finesse weapon, deal one extra weapon die of damage.",
		gear_belt:
			"While worn, you have advantage on Strength checks to shove, grapple, or break a grapple.",
		gear_boots:
			"Once per turn, when you Dash you ignore difficult terrain until the end of that turn.",
		weapon:
			"On a critical hit, deal one extra die of the weapon's damage type.",
		armor:
			"When you are hit by a critical hit, once per long rest reduce the extra damage by your proficiency bonus.",
		focus_caster:
			"Once per long rest, reroll a spell's damage die and use the higher result.",
		focus_wand:
			"Once per long rest, reroll a spell's damage die and use the higher result.",
		focus_tome:
			"Once per long rest, reroll a spell's damage die and use the higher result.",
	};
	for (const key of Object.keys(RIDERS)) {
		if (arche === key || arche.startsWith(`${key}_`) || arche.startsWith(key)) {
			return RIDERS[key];
		}
	}
	return "Once per long rest, you may reroll the applied bonus and keep the higher result.";
}

// Replicates auditShallowMagicEffect's item-path detection exactly.
function isShallow(item) {
	const r = rarityOf(item);
	if (!r || r === "common") return false;
	const name = typeof item.name === "string" ? item.name : "";
	if (/\+\s*\d+\s+\w+/.test(name)) return false; // intentional "+N Weapon"
	const effects =
		item.effects && typeof item.effects === "object" ? item.effects : null;
	const passive = Array.isArray(effects?.passive) ? effects.passive : [];
	const strings = passive.filter((x) => typeof x === "string");
	if (strings.length !== 1) return false;
	const only = strings[0];
	return /\+\s*\d+/.test(only) && only.length < 40 && !RIDER_VERB.test(only);
}

function deShallow(item) {
	if (!isShallow(item)) return false;
	const passive = item.effects.passive;
	const only = passive[0];

	// Healing/restore consumables only look "shallow" because the flat-"+N"
	// heuristic misfires on the dice bonus (e.g. "restore 4d4 + 4 hit points").
	// The canonical 5e verb is "regain" (a rider verb the gate excludes), so
	// rewording reads correctly AND clears the gate without an unrelated rider.
	// Deep-reword the whole entry so the EFFECTS panel and every RULES PAYLOAD
	// mirror (resolution / active_rules / audit) stay consistent.
	if (/\brestore\b/i.test(only)) {
		deepReword(item);
		return true;
	}

	// Genuine flat "+N" gear/weapon/armor/focus: append an archetype rider so the
	// item carries a distinctive mechanic (strings.length -> 2 clears the gate).
	const rider = scrubText(riderFor(item));
	item.effects.passive = [...passive, rider];
	const m = item.mechanics;
	if (m && typeof m === "object") {
		if (Array.isArray(m.passive_rules))
			m.passive_rules = [...item.effects.passive];
		if (
			m.resolution &&
			typeof m.resolution === "object" &&
			Array.isArray(m.resolution.passive_effects)
		) {
			m.resolution.passive_effects = [...item.effects.passive];
		}
		if (m.audit && typeof m.audit === "object" && isStr(m.audit.variant_note)) {
			m.audit.variant_note = `${ensurePeriod(m.audit.variant_note)} ${rider}`;
		}
	}
	return true;
}

// ── main ────────────────────────────────────────────────────────────────────
function parseMutable(specs) {
	return specs.map(([file, exp, type]) => {
		const { arr, header } = parseItemArrayFile(join(DIR, file), exp);
		return { file, exp, header, arr, type: type || "Item" };
	});
}

function buildFreq(groups) {
	const freq = {};
	for (const label of Object.keys(NARRATIVE)) freq[label] = new Map();
	for (const g of groups) {
		for (const item of g.arr) {
			for (const [label, get] of Object.entries(NARRATIVE)) {
				const v = get(item);
				if (isStr(v)) freq[label].set(v, (freq[label].get(v) ?? 0) + 1);
			}
		}
	}
	return freq;
}

// De-pool a "notable"/augmentation entry: keep narrative, fold the unique name
// into any field that is pooled (>2 corpus sharers).
function depoolNotable(item, shared, stats) {
	if (shared("description", item.description)) {
		item.description = depoolDescription(item);
		stats.descDepooled += 1;
	}
	if (shared("flavor", item.flavor)) {
		item.flavor = depoolFlavor(item);
		stats.flavorDepooled += 1;
	}
	if (item.lore && typeof item.lore === "object") {
		if (shared("lore.origin", item.lore.origin)) {
			item.lore.origin = depoolLoreOrigin(item);
			stats.loreOriginDepooled += 1;
		}
		if (shared("lore.history", item.lore.history)) {
			item.lore.history = depoolLoreHistory(item);
			stats.loreHistoryDepooled += 1;
		}
	}
	if (shared("discovery_lore", item.discovery_lore)) {
		item.discovery_lore = depoolDiscovery(item);
		stats.discoveryDepooled += 1;
	}
}

function main() {
	const itemGroups = parseMutable(ITEM_FILES);
	const sigtatGroups = parseMutable(SIGTAT_FILES);
	const context = CONTEXT_FILES.map(([file, exp]) => {
		const { arr } = parseItemArrayFile(join(DIR, file), exp);
		return { arr };
	});
	// Frequency map spans the exact gate corpus so de-pooling is precise.
	const freq = buildFreq([...itemGroups, ...sigtatGroups, ...context]);
	const shared = (label, v) => isStr(v) && (freq[label].get(v) ?? 0) > 2;

	const stats = {
		entries: 0,
		stripped: 0,
		descDepooled: 0,
		flavorDepooled: 0,
		loreOriginDepooled: 0,
		loreHistoryDepooled: 0,
		discoveryDepooled: 0,
		deShallowed: 0,
	};

	const groups = TARGET === "sigtat" ? sigtatGroups : itemGroups;

	for (const g of groups) {
		for (const item of g.arr) {
			stats.entries += 1;
			if (TARGET === "sigtat") {
				// Augmentations: de-pool, never strip, no effect de-shallow.
				depoolNotable(item, shared, stats);
				continue;
			}
			const r = rarityOf(item);
			if (isLongTail(r)) {
				if ("flavor" in item || "lore" in item || "discovery_lore" in item) {
					delete item.flavor;
					delete item.lore;
					delete item.discovery_lore;
					stats.stripped += 1;
				}
				if (shared("description", item.description)) {
					item.description = depoolDescription(item);
					stats.descDepooled += 1;
				}
			} else {
				depoolNotable(item, shared, stats);
			}
			if (deShallow(item)) stats.deShallowed += 1;
		}
	}

	if (DRY) {
		console.log(`DRY RUN (target=${TARGET}) — no files written.`);
		console.log(JSON.stringify(stats, null, 2));
		return;
	}

	for (const g of groups) {
		writeItemArrayFile(join(DIR, g.file), g.exp, g.arr, g.header, g.type);
	}
	console.log(`Wrote ${groups.length} files (target=${TARGET}).`);
	console.log(JSON.stringify(stats, null, 2));
}

main();
