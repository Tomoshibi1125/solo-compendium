/**
 * One-off: add a structured `range` to weapon entries that carry the "thrown"
 * property but no range field (the range previously lived only in prose). The
 * generator source (variation.mjs) is fixed for future regens; this patches the
 * already-committed data so it is complete now. Run: npx tsx scripts/patch-thrown-range.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { staticDataProvider } from "../src/data/compendium/providers/index";
import { runCompendiumAudit } from "../src/lib/compendiumAudit";

const summary = await runCompendiumAudit(staticDataProvider);
const targetIds = new Set(
	summary.issues
		.filter((i) => i.code === "weapon_missing_range")
		.map((i) => i.entryId)
		.filter((id): id is string => Boolean(id)),
);
console.log(`Targets needing range: ${targetIds.size}`);

const files = [
	"items-base-equipment.ts",
	"items-part1.ts",
	"items-part2.ts",
	"items-part3.ts",
	"items-part4.ts",
	"items-part5.ts",
	"items-part6.ts",
	"items-part7.ts",
	"items-part8.ts",
	"items-part9.ts",
	"items-gap-fill.ts",
	"artifacts.ts",
];

let totalInserted = 0;
for (const file of files) {
	const path = join(process.cwd(), "src", "data", "compendium", file);
	let text: string;
	try {
		text = readFileSync(path, "utf8");
	} catch {
		continue;
	}
	const lines = text.split("\n");
	const insertions: number[] = [];
	let pendingId: string | null = null;
	for (let i = 0; i < lines.length; i += 1) {
		const idMatch = lines[i].match(/^\s*id:\s*"([^"]+)"/);
		if (idMatch) {
			pendingId = targetIds.has(idMatch[1]) ? idMatch[1] : null;
			continue;
		}
		if (pendingId && /^\s*simple_properties:/.test(lines[i])) {
			insertions.push(i);
			pendingId = null;
		}
	}
	if (insertions.length === 0) continue;
	// Apply from the bottom up so earlier indices stay valid.
	for (let k = insertions.length - 1; k >= 0; k -= 1) {
		const idx = insertions[k];
		const indent = lines[idx].match(/^\s*/)?.[0] ?? "\t\t";
		lines.splice(idx + 1, 0, `${indent}range: "Thrown (20/60)",`);
	}
	writeFileSync(path, lines.join("\n"), "utf8");
	totalInserted += insertions.length;
	console.log(`${file}: inserted ${insertions.length}`);
}
console.log(`done — inserted ${totalInserted} range fields`);
