#!/usr/bin/env node
/**
 * Protocol Zero — Final Assembly Script
 * Combines all parts and writes the complete adventure module.
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "..", "docs", "adventure-protocol-zero.md");

// Import content generators from parts
import { chapter2, chapter3 } from "./generate-adventure-part2.mjs";
import { chapter4, chapter5 } from "./generate-adventure-part3.mjs";
import { appendices } from "./generate-adventure-part4.mjs";

// Import the base content inline (front matter, intro, overview, ch1 are in generate-adventure.mjs)
// We'll read them via dynamic import
const _base = await import("./generate-adventure.mjs");

// The base script already defines sections array and writes to OUTPUT
// But since it uses a module-level side effect, we need to just call the functions
// The base script defines: frontMatter(), introduction(), adventureOverview(), chapter1()
// These are NOT exported, so we need to restructure.

// Since the base script runs its own writes, let's just build the full content here:

// ---- FRONT MATTER ----
const frontMatter = `# Protocol Zero: A System Ascendant Adventure

**A Campaign for Levels 1–10**
**Estimated Playtime:** 40–60 Hours (12–20 Sessions)
**Setting:** Neo-Seoul, Modern Urban Fantasy
**System:** System Ascendant (d20 / 5e-Compatible)
**Players:** 3–6 Ascendants
**Decree Warden Difficulty:** Intermediate

> *"The System is not your ally. It is a leash you have not yet learned to see."*
> — Valerius, in his final transmission before vanishing
`;

// Build the full document
const _sections = [
	frontMatter,
	chapter2(),
	chapter3(),
	chapter4(),
	chapter5(),
	appendices(),
];

// Read the base content (which has front matter through chapter 1)
import { readFileSync } from "node:fs";

const baseContent = readFileSync(OUTPUT, "utf8");

// Find the end of chapter 1 content and append the rest
const fullContent =
	baseContent +
	"\n" +
	chapter2() +
	"\n" +
	chapter3() +
	"\n" +
	chapter4() +
	"\n" +
	chapter5() +
	"\n" +
	appendices();

writeFileSync(OUTPUT, fullContent, "utf8");

const lines = fullContent.split("\n").length;
const sizeKB = Math.round(Buffer.byteLength(fullContent, "utf8") / 1024);

console.log("=== Protocol Zero — Complete Campaign Book Generated ===");
console.log(`Output: ${OUTPUT}`);
console.log(`Total lines: ${lines}`);
console.log(`File size: ${sizeKB} KB`);
console.log("");

// Verification checks
const placeholders = [
	"TODO",
	"TBD",
	"placeholder",
	"stub",
	"FIXME",
	"...coming soon",
];
let issues = 0;
for (const p of placeholders) {
	if (fullContent.toLowerCase().includes(p.toLowerCase())) {
		console.log(`⚠️  Found placeholder: "${p}"`);
		issues++;
	}
}
if (issues === 0) {
	console.log("✅ No placeholders or stubs found");
}

// Count sections
const h2Count = (fullContent.match(/^## /gm) || []).length;
const h3Count = (fullContent.match(/^### /gm) || []).length;
console.log(`✅ ${h2Count} major sections (## headings)`);
console.log(`✅ ${h3Count} subsections (### headings)`);
console.log("✅ Generation complete!");
