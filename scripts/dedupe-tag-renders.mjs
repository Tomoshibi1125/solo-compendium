/**
 * Compendium detail components render `<X>.tags.map(tag => <Badge key={tag}>)`.
 * When an entry's tags array contains a duplicate value (e.g. the rank letter
 * appears twice), React warns "two children with the same key" and the badge is
 * shown twice. This codemod wraps each tag map with `[...new Set(<X>.tags ?? [])]`
 * so keys are always unique and duplicate badges are removed.
 *
 * Idempotent: lines already containing `new Set(` are skipped.
 * Run: node scripts/dedupe-tag-renders.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "src", "components", "compendium");
// Matches data.tags / entry.tags / note.tags / (data as {...}).tags  followed
// by optional `?` then `.map(`, but NOT when already wrapped in `new Set(`.
const RE =
	/(?<!new Set\()((?:\(data as \{[^}]*\}\)|data|entry|note)\.tags)\??\.map\(/g;

let filesChanged = 0;
let sites = 0;
for (const name of readdirSync(DIR)) {
	if (!name.endsWith(".tsx")) continue;
	const path = join(DIR, name);
	const src = readFileSync(path, "utf8");
	let count = 0;
	const next = src.replace(RE, (_m, expr) => {
		count += 1;
		return `[...new Set(${expr} ?? [])].map(`;
	});
	if (count > 0 && next !== src) {
		writeFileSync(path, next, "utf8");
		filesChanged += 1;
		sites += count;
		console.log(`  ${name}: ${count} site(s)`);
	}
}
console.log(`Done. ${sites} tag-map site(s) across ${filesChanged} file(s).`);
