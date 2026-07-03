/**
 * Theme-token resolution guard.
 *
 * Tailwind v4 silently generates NO CSS for a color utility whose token is
 * missing from the `@theme` block — `bg-obsidian-charcoal/40` just renders
 * unstyled (this bit tabs.tsx, NavBar, and the character sheet for months).
 * This guard scans every custom-family color utility used in src/ and
 * asserts its `--color-*` token is actually defined in src/index.css.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = join(__dirname, "..", "..");
const INDEX_CSS = join(SRC_ROOT, "index.css");

// Custom RA color families (anything else — slate, red, primary… — is either
// standard Tailwind or a shadcn semantic token and out of scope here).
const FAMILIES =
	"shadow|gate|solar|mana|resurge|system|obsidian|amethyst|void|crimson|gilded|silver|regent|bond";

// Bare family names count too — `text-resurge` resolves via `--color-resurge`,
// which slipped this guard when the suffix was mandatory.
// `:` is deliberately NOT a terminator — it would match CSS property text
// like `text-shadow: …` inside style strings.
const UTILITY_RE = new RegExp(
	`(?<![\\w-])(?:bg|text|border|from|via|to|ring|fill|stroke|outline|accent|caret|decoration|shadow)-((?:${FAMILIES})(?:-[a-z0-9-]+?)?)(?=/|["'\`\\s)\\]}]|$)`,
	"g",
);

// Non-color utilities that share a family prefix. Bare "shadow" only occurs
// as the CSS property name in comments/style strings, never as a color class.
const SKIP = new Set([
	"shadow",
	"shadow-sm",
	"shadow-md",
	"shadow-lg",
	"shadow-xl",
	"shadow-2xl",
	"shadow-inner",
	"shadow-none",
]);

function walk(dir: string, out: string[]): string[] {
	for (const entry of readdirSync(dir)) {
		const p = join(dir, entry);
		const st = statSync(p);
		if (st.isDirectory()) {
			if (["node_modules", "__tests__"].includes(entry)) continue;
			walk(p, out);
		} else if ([".tsx", ".ts"].includes(extname(p))) {
			out.push(p);
		}
	}
	return out;
}

describe("theme token resolution", () => {
	it("every custom-family color utility used in src/ has a defined --color-* token", () => {
		const css = readFileSync(INDEX_CSS, "utf8");
		const tokens = new Set(
			[...css.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]),
		);
		expect(tokens.size).toBeGreaterThan(30); // sanity: @theme parsed

		const offenders: string[] = [];
		for (const file of walk(SRC_ROOT, [])) {
			// Data files carry item ids like "bg-gate-gps" — ids, not classes.
			if (file.includes(join("src", "data"))) continue;
			const content = readFileSync(file, "utf8");
			for (const match of content.matchAll(UTILITY_RE)) {
				const name = match[1];
				if (SKIP.has(name) || tokens.has(name)) continue;
				offenders.push(`${file.replace(SRC_ROOT, "src")} → ${match[0]}`);
			}
		}

		expect([...new Set(offenders)]).toEqual([]);
	});

	it("every var(--x) referenced by a --color-* token is itself defined", () => {
		// A @theme entry like `--color-hunter-blue: hsl(var(--hunter-blue))` is
		// "defined" to the check above, but if the base `--hunter-blue` var has
		// no definition the color resolves to invalid → utilities silently
		// render unstyled. (This exact hole shipped a dead token for months.)
		const css = readFileSync(INDEX_CSS, "utf8");
		const definedVars = new Set(
			[...css.matchAll(/(?<![\w-])--([a-z0-9-]+)\s*:/g)].map((m) => m[1]),
		);

		const offenders: string[] = [];
		for (const match of css.matchAll(
			/--color-([a-z0-9-]+)\s*:[^;]*var\(--([a-z0-9-]+)\)/g,
		)) {
			const [, token, referenced] = match;
			if (!definedVars.has(referenced)) {
				offenders.push(
					`--color-${token} references undefined var --${referenced}`,
				);
			}
		}

		expect(offenders).toEqual([]);
	});
});
