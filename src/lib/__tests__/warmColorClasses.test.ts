/**
 * Warm-color class guard.
 *
 * The RA brand is strictly cool (amethyst / cyan / teal / platinum / crimson —
 * see ra-theme.css). Warm raw Tailwind families are unambiguous off-brand
 * regressions; the E4 sweep (scripts/retune-raw-colors.mjs) retired them all
 * onto brand tokens. This guard keeps them out. Cool raw families (blue,
 * green, purple, cyan…) stay unguarded — they read on-brand and have legit
 * dynamic uses.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = join(__dirname, "..", "..");

// Utility-shaped warm classes, e.g. `bg-amber-500/20`, `text-orange-400`.
const WARM_CLASS_RE =
	/(?<![\w-])(?:[a-z-]+:)?(?:bg|text|border|ring|from|via|to|fill|stroke|shadow|divide|outline|decoration|accent|caret)-(?:amber|orange|yellow|lime|rose|fuchsia|pink)-\d{2,3}(?:\/\d{1,3})?(?![\w])/g;

// User-selectable cosmetic content and print styles are exempt by design.
const ALLOWLIST = new Set([
	"diceThemes.ts",
	"book-print.css",
	"meridian-print.css",
]);
const SKIP_DIRS = new Set(["node_modules", "__tests__"]);

function walk(dir: string, out: string[]): string[] {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		const st = statSync(p);
		if (st.isDirectory()) {
			if (SKIP_DIRS.has(entry)) continue;
			walk(p, out);
		} else if (
			[".ts", ".tsx", ".css"].includes(extname(p)) &&
			!ALLOWLIST.has(basename(p)) &&
			!entry.includes(".test.")
		) {
			out.push(p);
		}
	}
	return out;
}

describe("warm color classes", () => {
	it("no warm raw Tailwind palette classes outside the allowlist", () => {
		const offenders: string[] = [];
		for (const file of walk(SRC_ROOT, [])) {
			const content = readFileSync(file, "utf8");
			for (const match of content.matchAll(WARM_CLASS_RE)) {
				offenders.push(`${file.replace(SRC_ROOT, "src")} → ${match[0]}`);
			}
		}
		expect([...new Set(offenders)]).toEqual([]);
	});
});
