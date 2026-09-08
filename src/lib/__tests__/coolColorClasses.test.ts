/**
 * Cool-color class guard (Track D, Jul 2026).
 *
 * The core companion/character app must color-code UI with RA Amethyst-Void
 * tokens (destructive / success / shadow-blue / resurge / mana-cyan …), not raw
 * Tailwind hues — Tailwind's generic red/blue/green/purple/cyan are the wrong
 * hues for an amethyst+cyan brand. `scripts/retune-cool-colors.mjs` folded them
 * onto tokens; this guard keeps them out of the core UI.
 *
 * Scope mirrors the codemod: `src/components` + `src/pages`, `.ts`/`.tsx` only.
 * Deliberately NOT guarded (and so not walked here):
 *   - the book-rendering tree + the shadcn `ui/` kit (owner-classified as
 *     "not the companion app");
 *   - `src/data/toolCatalogs.ts`, whose category classes are private names paired
 *     with recolored CSS shims in AscendantTools.css / WardenProtocols.css;
 *   - `src/lib` / `src/hooks`, where a "color" is often a provider BRAND color
 *     (OAuth buttons) or an illustrative comment.
 * The `shadow-` prefix is excluded (it collides with the `shadow-blue` token and
 * covers legit shimmed box-shadow glows).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = join(__dirname, "..", "..");
const WALK_ROOTS = ["components", "pages"].map((d) => join(SRC_ROOT, d));

// Utility-shaped raw cool classes, e.g. `bg-blue-500/20`, `text-red-400`,
// `hover:border-purple-500/60`, `from-green-500`.
const COOL_CLASS_RE =
	/(?<![\w-])(?:[a-z-]+:)?(?:bg|text|border|ring|from|via|to|fill|stroke)-(?:red|green|blue|purple|cyan)-\d{2,3}(?:\/\d{1,3})?(?![\w])/g;

const SKIP_DIRS = new Set([
	"node_modules",
	"__tests__",
	"ui",
	"players-book",
	"wardens-directive",
	"anomaly-manifest",
	"meridian",
]);
const ALLOWLIST = new Set([
	"CampaignBookView.tsx",
	"SourceBookLayout.tsx",
	"SourceBookPage.tsx",
	"SourceBookStatBlock.tsx",
	"BookMarkdown.tsx",
]);

function walk(dir: string, out: string[]): string[] {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		const st = statSync(p);
		if (st.isDirectory()) {
			if (SKIP_DIRS.has(entry)) continue;
			walk(p, out);
		} else if (
			[".ts", ".tsx"].includes(extname(p)) &&
			!ALLOWLIST.has(basename(p)) &&
			!entry.includes(".test.")
		) {
			out.push(p);
		}
	}
	return out;
}

describe("cool color classes", () => {
	it("no raw Tailwind cool palette classes in the core companion app", () => {
		const offenders: string[] = [];
		for (const root of WALK_ROOTS) {
			for (const file of walk(root, [])) {
				const content = readFileSync(file, "utf8");
				for (const match of content.matchAll(COOL_CLASS_RE)) {
					offenders.push(`${file.replace(SRC_ROOT, "src")} → ${match[0]}`);
				}
			}
		}
		expect([...new Set(offenders)]).toEqual([]);
	});
});
