/**
 * Accessibility guard: every icon-only <Button size="icon"> must expose an
 * accessible name (aria-label / aria-labelledby / title). lucide icons render
 * aria-hidden, so an unlabeled icon button is announced as a bare "button".
 * Track E (Jul 2026) labeled the existing ones via scripts/add-icon-button-labels.mjs.
 *
 * Brace-aware tag parsing so `onClick={() => ...}` arrows don't truncate the tag.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOTS = [
	join(__dirname, "..", "..", "components"),
	join(__dirname, "..", "..", "pages"),
];
const SKIP_DIRS = new Set(["node_modules", "__tests__"]);

function walk(dir: string, out: string[]): string[] {
	for (const e of readdirSync(dir)) {
		const p = join(dir, e);
		const s = statSync(p);
		if (s.isDirectory()) {
			if (!SKIP_DIRS.has(e)) walk(p, out);
		} else if (extname(p) === ".tsx" && !e.includes(".test.")) out.push(p);
	}
	return out;
}

/** Opening JSX tag starting at `idx` ('<'), skipping `>` inside {…} expressions. */
function tagAt(txt: string, idx: number): string {
	let depth = 0;
	for (let i = idx; i < txt.length; i++) {
		const c = txt[i];
		if (c === "{") depth++;
		else if (c === "}") depth--;
		else if (c === ">" && depth === 0) return txt.slice(idx, i + 1);
	}
	return txt.slice(idx);
}

describe("icon button accessible names", () => {
	it("every <Button size=\"icon\"> has aria-label / aria-labelledby / title", () => {
		const offenders: string[] = [];
		for (const root of ROOTS) {
			for (const file of walk(root, [])) {
				const txt = readFileSync(file, "utf8");
				let i = 0;
				while ((i = txt.indexOf("<Button", i)) !== -1) {
					const tag = tagAt(txt, i);
					if (
						/size=["']icon["']/.test(tag) &&
						!/aria-label|aria-labelledby|(?<!data-)title=/.test(tag)
					) {
						const line = txt.slice(0, i).split("\n").length;
						offenders.push(`${file.split(/[\\/]/).slice(-2).join("/")}:${line}`);
					}
					i += 7;
				}
			}
		}
		expect([...new Set(offenders)]).toEqual([]);
	});
});
