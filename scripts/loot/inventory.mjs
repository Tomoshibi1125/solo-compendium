// Inventory pass: classify every loot entry by archetype and report category counts
// + duplicate-template detection. Read-only; emits a JSON report.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { classifyArchetype } from "./lib.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..", "..");
const COMPENDIUM_DIR = join(ROOT, "src", "data", "compendium");

function parseArrayLiteral(filePath, exportName) {
	const text = readFileSync(filePath, "utf8");
	const re = new RegExp(
		`export\\s+const\\s+${exportName}\\s*:\\s*[A-Za-z_][\\w<>\\[\\]\\s]*\\s*=\\s*(\\[[\\s\\S]*\\])\\s*;`,
		"m",
	);
	const m = text.match(re);
	if (!m) return [];
	try {
		return Function(`"use strict"; return (${m[1]});`)();
	} catch (_e) {
		return [];
	}
}

const FILES = [
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
	["artifacts.ts", "artifacts"],
];

const allItems = [];
for (const [fn, exp] of FILES) {
	const arr = parseArrayLiteral(join(COMPENDIUM_DIR, fn), exp);
	for (const it of arr) allItems.push({ ...it, _file: fn });
}

const byArchetype = new Map();
const byRarity = new Map();
const dupeDescriptions = new Map();
const dupePassives = new Map();
const dupeFlavors = new Map();
const items = [];

for (const it of allItems) {
	const archetype = classifyArchetype(it.name, it.type);
	byArchetype.set(archetype, (byArchetype.get(archetype) || 0) + 1);
	const rk = `${archetype}/${it.rarity || "common"}`;
	byRarity.set(rk, (byRarity.get(rk) || 0) + 1);

	if (typeof it.description === "string") {
		dupeDescriptions.set(it.description, (dupeDescriptions.get(it.description) || 0) + 1);
	}
	if (typeof it.flavor === "string") {
		dupeFlavors.set(it.flavor, (dupeFlavors.get(it.flavor) || 0) + 1);
	}
	const passives = it.effects?.passive;
	if (Array.isArray(passives)) {
		for (const p of passives) {
			if (typeof p === "string" && p.length > 4) {
				dupePassives.set(p, (dupePassives.get(p) || 0) + 1);
			}
		}
	}

	items.push({
		file: it._file,
		id: it.id,
		name: it.name,
		rarity: it.rarity,
		type: it.type,
		archetype,
	});
}

const archetypeReport = [...byArchetype.entries()].sort((a, b) => b[1] - a[1]);
const rarityReport = [...byRarity.entries()].sort((a, b) => b[1] - a[1]);
const dupeDescTop = [...dupeDescriptions.entries()].filter(([, n]) => n > 4).sort((a, b) => b[1] - a[1]);
const dupePassiveTop = [...dupePassives.entries()].filter(([, n]) => n > 5).sort((a, b) => b[1] - a[1]);
const dupeFlavorTop = [...dupeFlavors.entries()].filter(([, n]) => n > 5).sort((a, b) => b[1] - a[1]);

const report = {
	totals: {
		items: allItems.length,
		archetypes: archetypeReport.length,
	},
	archetypeReport,
	rarityReport: rarityReport.slice(0, 80),
	dupeDescriptions: dupeDescTop,
	dupePassives: dupePassiveTop,
	dupeFlavors: dupeFlavorTop,
	items,
};

writeFileSync(join(__dirname, "inventory-report.json"), JSON.stringify(report, null, 2), "utf8");

// Print summary
console.log(`Total items: ${allItems.length}\n`);
console.log("=== ARCHETYPE COUNTS (sorted desc) ===");
for (const [a, n] of archetypeReport) console.log(`  ${a.padEnd(28)} ${n}`);
console.log("\n=== TOP DUPLICATE DESCRIPTIONS (>4) ===");
for (const [d, n] of dupeDescTop.slice(0, 12)) console.log(`  ${n}× ${d.slice(0, 80)}`);
console.log("\n=== TOP DUPLICATE PASSIVES (>5) ===");
for (const [d, n] of dupePassiveTop.slice(0, 15)) console.log(`  ${n}× ${d.slice(0, 80)}`);
console.log("\n=== TOP DUPLICATE FLAVORS (>5) ===");
for (const [d, n] of dupeFlavorTop.slice(0, 12)) console.log(`  ${n}× ${d.slice(0, 80)}`);
