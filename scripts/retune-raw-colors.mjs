/**
 * One-off E4 sweep: decorative raw Tailwind palette classes → RA brand tokens.
 *
 * Retunes the off-brand color families (warm golds/oranges plus the odd cool
 * strays) onto the cool brand token vocabulary. Semantic families that already
 * read on-brand (red/blue/green/purple/cyan) and neutrals (slate/gray/…) are
 * intentionally out of scope, as are user-selectable dice themes and print CSS.
 *
 * Dry-run by default (prints per-file replacement summary); pass --apply to write.
 *
 *   node scripts/retune-raw-colors.mjs
 *   node scripts/retune-raw-colors.mjs --apply
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "src");
const APPLY = process.argv.includes("--apply");

/** Off-brand family → brand token. */
const FAMILY_TOKEN = {
	amber: "gate-s",
	yellow: "gate-s",
	orange: "gate-a",
	rose: "gate-a",
	pink: "resurge-violet",
	fuchsia: "resurge-violet",
	violet: "resurge-violet",
	lime: "system-green",
	emerald: "system-green",
	teal: "system-green",
	sky: "mana-cyan",
	indigo: "hunter-blue",
};

const FAMILIES = Object.keys(FAMILY_TOKEN).join("|");
const PREFIXES =
	"bg|text|border|ring|from|via|to|fill|stroke|shadow|divide|outline|decoration|accent|caret";

// hover:border-amber-500/60 → prefix=border family=amber shade=500 opacity=60
const CLASS_RE = new RegExp(
	`(?<![\\w-])(${PREFIXES})-(${FAMILIES})-(\\d{2,3})(?:/(\\d{1,3}))?(?![\\w])`,
	"g",
);

const SKIP_FILES = new Set(["diceThemes.ts"]);
const SKIP_DIRS = new Set(["__tests__", "node_modules"]);

function walk(dir, out) {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		const st = statSync(p);
		if (st.isDirectory()) {
			if (SKIP_DIRS.has(entry)) continue;
			walk(p, out);
		} else if (
			[".ts", ".tsx"].includes(extname(p)) &&
			!SKIP_FILES.has(entry) &&
			!entry.includes(".test.")
		) {
			out.push(p);
		}
	}
	return out;
}

/**
 * Brand tokens are single-value (no shade scale), so the shade is folded into
 * an opacity that keeps the original character on the obsidian theme:
 *  - bright shades (≤600) map straight across, keeping any /opacity;
 *  - dark washes (≥700) become low-alpha tinted washes of the same token.
 */
function mapClass(prefix, family, shade, opacity) {
	const token = FAMILY_TOKEN[family];
	const shadeNum = Number(shade);
	const op = opacity ? Number(opacity) : null;
	if (shadeNum >= 700) {
		if (["bg", "from", "via", "to"].includes(prefix)) {
			const capped = Math.min(op ?? 25, 25);
			return `${prefix}-${token}/${capped}`;
		}
		if (["border", "divide", "ring", "outline"].includes(prefix)) {
			const capped = Math.min(op ?? 40, 40);
			return `${prefix}-${token}/${capped}`;
		}
	}
	return op ? `${prefix}-${token}/${op}` : `${prefix}-${token}`;
}

const files = walk(SRC, []);
let totalReplacements = 0;
const fileSummaries = [];
const mappingSamples = new Map();

for (const file of files) {
	const before = readFileSync(file, "utf8");
	let count = 0;
	const after = before.replace(
		CLASS_RE,
		(whole, prefix, family, shade, opacity) => {
			const mapped = mapClass(prefix, family, shade, opacity);
			if (!mappingSamples.has(whole)) mappingSamples.set(whole, mapped);
			count++;
			return mapped;
		},
	);
	if (count > 0) {
		totalReplacements += count;
		fileSummaries.push([relative(ROOT, file).split(sep).join("/"), count]);
		if (APPLY) writeFileSync(file, after);
	}
}

fileSummaries.sort((a, b) => b[1] - a[1]);
console.log(
	`${APPLY ? "APPLIED" : "DRY RUN"} — ${totalReplacements} replacements in ${fileSummaries.length} files\n`,
);
for (const [file, count] of fileSummaries)
	console.log(`${String(count).padStart(5)}  ${file}`);
console.log("\nUnique class mappings:");
for (const [from, to] of [...mappingSamples.entries()].sort()) {
	console.log(`  ${from} → ${to}`);
}
