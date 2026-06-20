/**
 * audit-ability-owners.ts
 *
 * Aligns each supplemental + core power/technique's owner-job (`classes`) list
 * with the job-name(s) in its `tags` — the SAME association the job detail page
 * ("Related Powers") uses, so the learnable list and the job page agree. RA
 * model: a power/technique is owned by the job(s) in its `classes` list; a job
 * learns it natively only if it is an owner — everyone else uses the Rune
 * system (paths are the owner-side additive layer).
 *
 * Ownership = the martial-capable job(s) named in `tags`:
 *   - tagged with martial-capable job(s) → those jobs own it (its 5e-class
 *     signature, e.g. Adrenaline Surge → Destroyer/Fighter). Broad generics
 *     (≥3 tagged jobs) also extend to Revenant, omitted from the legacy lists.
 *   - tagged only with spell-caster job(s) (Idol/Herald/Contractor/Esper/
 *     Summoner/Mage), which cannot natively learn powers/techniques → owner-less
 *     (path/Rune only, e.g. Pact Blade, Idol's Magnum Opus).
 *   - no job tag → generic shared pool (all martial-capable jobs).
 *
 * Archetype-shared pools (powers-archetype / techniques-archetype) are owned by
 * all 8 via their `ALL` constant and are left untouched.
 *
 * Run:  npx tsx scripts/audit-ability-owners.ts          (writes files)
 *       npx tsx scripts/audit-ability-owners.ts --dry     (report only)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { powers_core } from "../src/data/compendium/powers-core";
import { powers_supplemental } from "../src/data/compendium/powers-supplemental";
import { techniques_core } from "../src/data/compendium/techniques-core";
import { techniques_supplemental } from "../src/data/compendium/techniques-supplemental";

const DRY = process.argv.includes("--dry");

const MARTIAL_CAPABLE = [
	"Destroyer",
	"Berserker",
	"Assassin",
	"Striker",
	"Holy Knight",
	"Stalker",
	"Technomancer",
	"Revenant",
];
const CASTER_JOBS = [
	"Mage",
	"Esper",
	"Summoner",
	"Idol",
	"Herald",
	"Contractor",
];

type Entry = {
	id: string;
	name?: string | null;
	classes?: string[] | null;
	tags?: string[] | null;
};

function computeOwners(entry: Entry): string[] {
	const tl = (entry.tags ?? []).map((t) => t.trim().toLowerCase());
	const martialTags = MARTIAL_CAPABLE.filter((j) =>
		tl.includes(j.toLowerCase()),
	);
	if (martialTags.length === 0) {
		const casterTags = CASTER_JOBS.filter((j) => tl.includes(j.toLowerCase()));
		// caster-only signature → path/Rune; untagged → generic shared pool.
		return casterTags.length > 0 ? [] : [...MARTIAL_CAPABLE];
	}
	const owners = [...martialTags];
	// Broad generics belong to Revenant too (omitted from the legacy lists).
	if (owners.length >= 3 && !owners.includes("Revenant"))
		owners.push("Revenant");
	return MARTIAL_CAPABLE.filter((j) => owners.includes(j));
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serialize(owners: string[]): string {
	if (owners.length === 0) return "[]";
	return `[${owners.map((o) => `"${o}"`).join(", ")}]`;
}

function processFile(relPath: string, entries: Entry[]) {
	const abs = join(process.cwd(), relPath);
	let text = readFileSync(abs, "utf8");
	let changed = 0;
	const misses: string[] = [];
	const emptied: string[] = [];
	for (const entry of entries) {
		const owners = computeOwners(entry);
		const re = new RegExp(
			`(\\bid:\\s*"${escapeRegExp(entry.id)}",\\s*classes:\\s*)\\[[^\\]]*\\]`,
		);
		if (!re.test(text)) {
			misses.push(entry.id);
			continue;
		}
		const before = JSON.stringify((entry.classes ?? []).slice().sort());
		const after = JSON.stringify(owners.slice().sort());
		if (before !== after) {
			changed += 1;
			if (owners.length === 0) emptied.push(entry.id);
		}
		text = text.replace(re, `$1${serialize(owners)}`);
	}
	if (!DRY) writeFileSync(abs, text, "utf8");
	console.log(
		`\n${relPath}: ${changed}/${entries.length} changed${DRY ? " (dry)" : ""}`,
	);
	if (emptied.length)
		console.log(`  → owner-less (path+Rune): ${emptied.length} entries`);
	if (misses.length) console.log(`  ⚠ NO MATCH for ids: ${misses.join(", ")}`);
}

function report(label: string, entries: Entry[]) {
	const counts: Record<string, number> = {};
	for (const j of MARTIAL_CAPABLE) counts[j] = 0;
	let empty = 0;
	for (const e of entries) {
		const owners = computeOwners(e);
		if (owners.length === 0) empty += 1;
		for (const j of owners) counts[j] += 1;
	}
	console.log(`\n=== projected ${label} owners (sup+core only) ===`);
	console.log(`  owner-less []: ${empty}`);
	for (const j of MARTIAL_CAPABLE)
		console.log(`  ${j.padEnd(14)} ${counts[j]}`);
}

processFile("src/data/compendium/powers-core.ts", powers_core);
processFile("src/data/compendium/powers-supplemental.ts", powers_supplemental);
processFile("src/data/compendium/techniques-core.ts", techniques_core);
processFile(
	"src/data/compendium/techniques-supplemental.ts",
	techniques_supplemental,
);

report("POWERS (sup+core)", [...powers_core, ...powers_supplemental]);
report("TECHNIQUES (sup+core)", [
	...techniques_core,
	...techniques_supplemental,
]);
