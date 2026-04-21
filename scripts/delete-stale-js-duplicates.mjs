#!/usr/bin/env node
/**
 * Deletes stale .js files in src/ that duplicate their .ts or .tsx sources.
 *
 * Why: Some tool (likely an editor's background TypeScript service) has been
 * emitting compiled JSX output alongside each .ts/.tsx file. These .js files:
 *   - Are not tracked in git.
 *   - Are never imported by any source code.
 *   - Break Biome (duplicate module errors, format issues).
 *   - Confuse knip by inflating the project file set.
 *
 * This script deletes any src/**\/*.js file that has a sibling .ts or .tsx
 * with the same basename. Standalone .js files are left alone.
 */

import { readdirSync, statSync, rmSync, existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");

function walk(dir, out = []) {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const st = statSync(full);
		if (st.isDirectory()) walk(full, out);
		else out.push(full);
	}
	return out;
}

const all = walk(SRC);
const jsFiles = all.filter((f) => extname(f) === ".js");

let deleted = 0;
const kept = [];

for (const jsPath of jsFiles) {
	const base = basename(jsPath, ".js");
	const dir = dirname(jsPath);
	const tsSibling = join(dir, `${base}.ts`);
	const tsxSibling = join(dir, `${base}.tsx`);

	if (existsSync(tsSibling) || existsSync(tsxSibling)) {
		rmSync(jsPath, { force: true });
		deleted += 1;
	} else {
		kept.push(jsPath);
	}
}

console.log(`Deleted ${deleted} stale .js files paired with .ts/.tsx sources.`);
if (kept.length > 0) {
	console.log(`\nKept ${kept.length} standalone .js files:`);
	for (const k of kept) console.log(`  ${k}`);
}
