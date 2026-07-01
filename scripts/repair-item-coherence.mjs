// Phase 0 coherence repair for items / artifacts / relics.
//
// Removes the `scripts/item-forge.ts` combat injection — a `Math.random()`
// "Deals Xd6 physical or magical damage on hit." + crowd-control rider that was
// stamped onto EVERY item regardless of kind (mundane tools, foci, and named
// weapons alike) — then re-derives the `ra-item-v1` rules payload via the loot
// `enrichItemPayload` engine so `passive_rules` / `resolution` / `formulas`
// stop echoing the injected damage. Real weapon/armor stats, authored
// `effects.passive`, and relic `abilities[]` are preserved.
//
// Usage: node scripts/repair-item-coherence.mjs
//
// Idempotent: the injection signatures below match only item-forge output, so a
// second run is a no-op.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { enrichItemPayload } from "./loot/rebuild.mjs";
import { serializeArrayBody } from "./loot/serializer.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const COMPENDIUM_DIR = join(ROOT, "src", "data", "compendium");

// ---- item-forge injection signatures (see scripts/item-forge.ts:138-139) ----
const INJECTED_DAMAGE = /^Deals .+ physical or magical damage on hit\.?$/;
const INJECTED_RIDER =
	/^Target must make a standard DC saving throw or suffer .+ for 1 round\.?$/;

function isInjected(value) {
	return (
		typeof value === "string" &&
		(INJECTED_DAMAGE.test(value.trim()) || INJECTED_RIDER.test(value.trim()))
	);
}

// Strip the injected fields from the RAW record. `enrichItemPayload` rebuilds
// the entire `mechanics` payload afterwards, so we only need to clean the
// authored surfaces it reads: `effects.primary`, `effects.secondary`, and
// (defensively) any injected string that leaked into `effects.passive`.
function stripInjectedCombat(item) {
	let changed = false;
	const effects = item.effects;
	if (effects && typeof effects === "object" && !Array.isArray(effects)) {
		if (isInjected(effects.primary)) {
			delete effects.primary;
			changed = true;
		}
		if (isInjected(effects.secondary)) {
			delete effects.secondary;
			changed = true;
		}
		if (Array.isArray(effects.passive)) {
			const before = effects.passive.length;
			effects.passive = effects.passive.filter((rule) => !isInjected(rule));
			if (effects.passive.length !== before) changed = true;
		}
	}
	// item-forge also wrote mechanics.damage_profile/condition on some records;
	// enrichItemPayload discards the old mechanics object wholesale, so no action
	// is needed here — the re-derived payload will not contain them.
	return changed;
}

// ---- file IO (mirrors scripts/loot/rewrite-loot.mjs helpers) ----
function parseItemArrayFile(filePath, exportName) {
	const text = readFileSync(filePath, "utf8");
	const re = new RegExp(
		`export\\s+const\\s+${exportName}\\s*:\\s*[A-Za-z_][\\w<>\\[\\]\\s]*\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;\\s*$`,
		"m",
	);
	const m = text.match(re);
	if (!m) throw new Error(`Could not extract ${exportName} in ${filePath}`);
	const arr = Function(`"use strict"; return (${m[1]});`)();
	return { arr, header: text.slice(0, m.index) };
}

function writeItemArrayFile(filePath, exportName, items, header, typeName) {
	const body = serializeArrayBody(items, 1);
	const out = `${header.replace(/\n+$/, "\n")}\nexport const ${exportName}: ${typeName}[] = [\n${body},\n];\n`;
	writeFileSync(filePath, out, "utf8");
}

const FILES = [
	["items-base-equipment.ts", "baseEquipment", "Item"],
	["artifacts.ts", "artifacts", "Item"],
	["relics-comprehensive.ts", "comprehensiveRelics", "Relic"],
];

const summary = {};
for (const [fileName, exportName, typeName] of FILES) {
	const filePath = join(COMPENDIUM_DIR, fileName);
	const { arr, header } = parseItemArrayFile(filePath, exportName);
	let stripped = 0;
	const out = arr.map((raw) => {
		if (stripInjectedCombat(raw)) stripped += 1;
		return enrichItemPayload(raw, fileName);
	});
	writeItemArrayFile(filePath, exportName, out, header, typeName);
	summary[fileName] = { entries: out.length, stripped };
	console.log(`✔ ${fileName}: ${out.length} entries, ${stripped} de-injected`);
}
console.log("\nDone.", JSON.stringify(summary));
