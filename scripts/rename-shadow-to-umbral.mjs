/**
 * Phase 4b: rename residual "Shadow Legion / Shadow Soldier" DISPLAY terms to
 * the canon "Umbral Legion / Umbral Legionnaire". These space-separated,
 * capitalized terms only ever appear in prose/labels — internal identifiers use
 * `ShadowSoldier` / `shadow-soldiers` / `shadow_soldier` (no space) and are left
 * untouched, as are the cool `shadow-*` color tokens. Tests are skipped so the
 * canon-terminology probes keep their literals.
 *
 * Dry-run by default; --apply to write.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "src");
const APPLY = process.argv.includes("--apply");

// Order matters: plural before singular.
const REPLACEMENTS = [
	["Shadow Soldiers", "Umbral Legionnaires"],
	["Shadow Soldier", "Umbral Legionnaire"],
	["Shadow Legion", "Umbral Legion"],
	["Shadow Extraction", "Umbral Extraction"],
	["Shadow Army", "Umbral Legion"],
];

const SKIP_DIRS = new Set(["node_modules", "__tests__"]);

function walk(dir, out) {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		const st = statSync(p);
		if (st.isDirectory()) {
			if (SKIP_DIRS.has(entry)) continue;
			walk(p, out);
		} else if (
			[".ts", ".tsx"].includes(extname(p)) &&
			!entry.includes(".test.")
		) {
			out.push(p);
		}
	}
	return out;
}

let total = 0;
const summaries = [];
for (const file of walk(SRC, [])) {
	let text = readFileSync(file, "utf8");
	let count = 0;
	for (const [from, to] of REPLACEMENTS) {
		const parts = text.split(from);
		if (parts.length > 1) {
			count += parts.length - 1;
			text = parts.join(to);
		}
	}
	if (count > 0) {
		total += count;
		summaries.push([relative(ROOT, file).split(sep).join("/"), count]);
		if (APPLY) writeFileSync(file, text);
	}
}

summaries.sort((a, b) => b[1] - a[1]);
console.log(
	`${APPLY ? "APPLIED" : "DRY RUN"} — ${total} replacements in ${summaries.length} files\n`,
);
for (const [f, c] of summaries) console.log(`${String(c).padStart(4)}  ${f}`);
