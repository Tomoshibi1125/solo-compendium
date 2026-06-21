#!/usr/bin/env node
// scripts/scrub-ra-canon.mjs
//
// Conservative RA canon org-name scrub for the bulk catalog.
//
// Walks every .ts file under src/data/compendium/** (excluding *.bak files)
// and applies the org-name TERMINOLOGY_FIXES + THEME_TAG_FIXES from
// scripts/loot/lib.mjs that target stray Hunter Bureau / Hunter Association /
// Hunter Academy / Hunter Conference references.
//
// Profession-style "Hunter" / "Hunters" is intentionally NOT scrubbed because
// RA canon already uses it as a class descriptor (see lib.mjs class scrubs).
//
// Usage:
//   node scripts/scrub-ra-canon.mjs          # apply changes
//   node scripts/scrub-ra-canon.mjs --dry    # report only, no writes

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { scrubText, TERMINOLOGY_FIXES, THEME_TAG_FIXES } from "./loot/lib.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const CATALOG_ROOT = join(ROOT, "src", "data", "compendium");

// We run the full TERMINOLOGY_FIXES sweep via `scrubText`. Every regex in that
// table is word-bounded, so running it against TS source is safe: org-name
// keys never appear as identifiers, only inside string literals. Previously
// applied fixes are idempotent and produce zero changes on re-run.
const DRY_RUN = process.argv.includes("--dry");

function listTsFiles(dir, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const info = statSync(full);
		if (info.isDirectory()) {
			listTsFiles(full, out);
		} else if (
			info.isFile() &&
			full.endsWith(".ts") &&
			!full.endsWith(".bak.ts") &&
			!full.endsWith(".lore.bak") &&
			!full.endsWith(".bak")
		) {
			out.push(full);
		}
	}
	return out;
}

function countTerminologyMatches(text) {
	let total = 0;
	for (const [re] of TERMINOLOGY_FIXES) {
		const matches = text.match(re);
		if (matches) total += matches.length;
	}
	return total;
}

// Replace `theme_tags: [..., "hunter-bureau", ...]` and `tags: [..., "...", ...]`
// quoted string entries via THEME_TAG_FIXES. We operate on the quoted string
// form so identifiers are never touched.
function applyThemeTagFixes(text) {
	let out = text;
	let totalReplacements = 0;
	for (const [from, to] of Object.entries(THEME_TAG_FIXES)) {
		if (from === to) continue;
		const escaped = from.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
		const pattern = new RegExp(`(["\`'])${escaped}\\1`, "g");
		const matches = out.match(pattern);
		if (matches && matches.length > 0) {
			out = out.replace(pattern, `$1${to}$1`);
			totalReplacements += matches.length;
		}
	}
	return { out, totalReplacements };
}

// Apply `scrubText` line-by-line, but skip lines that look like identifier
// definitions (e.g. `id: "foo-bar"`) so canonical kebab-case slugs are never
// rewritten by the broad TERMINOLOGY_FIXES list. Names, descriptions, lore,
// and other string literals are still scrubbed.
function scrubTextSkippingIds(text) {
	const lines = text.split("\n");
	return lines
		.map((line) => {
			if (/^\s*id\s*:\s*["'`]/.test(line)) return line;
			return scrubText(line);
		})
		.join("\n");
}

function scrubFile(filePath) {
	const original = readFileSync(filePath, "utf8");
	const textMatches = countTerminologyMatches(original);
	const afterText = scrubTextSkippingIds(original);
	const tagResult = applyThemeTagFixes(afterText);
	const final = tagResult.out;
	const totalReplacements = textMatches + tagResult.totalReplacements;
	const changed = final !== original;
	if (changed && !DRY_RUN) {
		writeFileSync(filePath, final, "utf8");
	}
	return { changed, totalReplacements };
}

const files = listTsFiles(CATALOG_ROOT);
let changedCount = 0;
let totalReplacements = 0;
const report = [];

for (const filePath of files) {
	const result = scrubFile(filePath);
	if (result.changed) {
		changedCount += 1;
		totalReplacements += result.totalReplacements;
		report.push({
			file: relative(ROOT, filePath),
			replacements: result.totalReplacements,
		});
	}
}

console.log(
	`${DRY_RUN ? "[dry-run] " : ""}Scrubbed ${changedCount} file(s); ${totalReplacements} replacement(s) total.`,
);
for (const row of report.sort((a, b) => b.replacements - a.replacements)) {
	console.log(`  ${row.file} — ${row.replacements} replacement(s)`);
}

if (changedCount === 0) {
	console.log("No catalog files needed scrubbing.");
}
