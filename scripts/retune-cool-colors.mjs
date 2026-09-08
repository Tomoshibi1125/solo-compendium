/**
 * Track D sweep: cool raw-Tailwind semantic classes → RA Amethyst-Void tokens,
 * scoped to the core companion/character app (book-rendering surfaces excluded).
 *
 * The earlier `retune-raw-colors.mjs` retuned WARM strays but deliberately left
 * red/blue/green/purple/cyan "already on-brand". They aren't on-brand for an
 * amethyst+cyan app (Tailwind purple 262 ≠ RA amethyst 275; Tailwind green 142
 * yellow-green ≠ RA teal-green 160; Tailwind red 0 ≠ RA crimson 350), so this
 * folds them onto the token vocabulary while preserving each color's meaning.
 *
 * SCOPE: core UI only. Excludes the book-rendering component tree, the
 * shadcn `ui/` kit, and tests — those are intentionally left as-is.
 *
 * Dry-run by default (prints per-file summary); pass --apply to write.
 *   node scripts/retune-cool-colors.mjs
 *   node scripts/retune-cool-colors.mjs --apply
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "src");
const APPLY = process.argv.includes("--apply");

/** Cool raw family → RA token (meaning preserved). */
const FAMILY_TOKEN = {
	red: "destructive", // danger / level-down / damage
	green: "success", // heal / gains / positive
	blue: "shadow-blue", // info / proficiency / stellar
	purple: "resurge", // features / special / amethyst
	cyan: "mana-cyan", // arcane / accent
};

const FAMILIES = Object.keys(FAMILY_TOKEN).join("|");
// `shadow` prefix is deliberately omitted: shadow-<color> would collide with the
// `shadow-blue` token name (shadow-shadow-blue). These cover every real usage.
const PREFIXES = "bg|text|border|ring|from|via|to|fill|stroke";

// hover:border-red-500/30 → prefix=border family=red shade=500 opacity=30
const CLASS_RE = new RegExp(
	`(?<![\\w-])(${PREFIXES})-(${FAMILIES})-(\\d{2,3})(?:/(\\d{1,3}))?(?![\\w])`,
	"g",
);

// Book-rendering + shadcn-kit surfaces are out of scope (owner-classified
// as "not the companion app"), plus tests.
const SKIP_DIRS = new Set([
	"__tests__",
	"node_modules",
	"ui", // shadcn kit (intentionally neutral, knip-ignored)
	"players-book",
	"wardens-directive",
	"anomaly-manifest",
	"meridian",
]);
const SKIP_FILES = new Set([
	"CampaignBookView.tsx",
	"SourceBookLayout.tsx",
	"SourceBookPage.tsx",
	"SourceBookStatBlock.tsx",
	"BookMarkdown.tsx",
	"diceThemes.ts",
]);

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
 * Tokens are single-value (no shade scale), so a dark shade (≥700) is folded
 * into a low-alpha tinted wash for surfaces so it doesn't become a solid slab;
 * text/fill/stroke keep the full token so text stays legible.
 */
function mapClass(prefix, family, shade, opacity) {
	const token = FAMILY_TOKEN[family];
	const shadeNum = Number(shade);
	const op = opacity ? Number(opacity) : null;
	if (shadeNum >= 700) {
		if (["bg", "from", "via", "to"].includes(prefix)) {
			return `${prefix}-${token}/${Math.min(op ?? 25, 25)}`;
		}
		if (["border", "ring"].includes(prefix)) {
			return `${prefix}-${token}/${Math.min(op ?? 40, 40)}`;
		}
	}
	return op ? `${prefix}-${token}/${op}` : `${prefix}-${token}`;
}

// UI + UI-data only. Deliberately excludes src/lib, src/hooks, src/stores, etc.,
// where a "color" string is often a provider BRAND color (OAuth buttons) or an
// illustrative code comment — not an app-chrome class to retune.
const WALK_ROOTS = ["components", "pages", "data"].map((d) => join(SRC, d));
const files = WALK_ROOTS.flatMap((root) => walk(root, []));
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
