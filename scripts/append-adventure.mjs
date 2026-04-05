#!/usr/bin/env node
/**
 * Appends chapters 2-5 and all appendices to the adventure file.
 */
import { appendFileSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "..", "docs", "adventure-protocol-zero.md");

import { chapter2, chapter3 } from "./generate-adventure-part2.mjs";
import { chapter4, chapter5 } from "./generate-adventure-part3.mjs";
import { appendices } from "./generate-adventure-part4.mjs";

const additions = [
	chapter2(),
	chapter3(),
	chapter4(),
	chapter5(),
	appendices(),
].join("\n");

appendFileSync(OUTPUT, "\n" + additions, "utf8");

const full = readFileSync(OUTPUT, "utf8");
const lines = full.split("\n").length;
const sizeKB = Math.round(Buffer.byteLength(full, "utf8") / 1024);

console.log("=== Protocol Zero — Complete Campaign Book ===");
console.log(`Total lines: ${lines}`);
console.log(`File size: ${sizeKB} KB`);

// Verify no placeholders
const bad = ["TODO", "TBD", "placeholder", "stub", "FIXME", "coming soon"];
let issues = 0;
for (const p of bad) {
	if (full.toLowerCase().includes(p.toLowerCase())) {
		console.log(`⚠️  Found: "${p}"`);
		issues++;
	}
}
if (issues === 0) console.log("✅ No placeholders found");

const h2 = (full.match(/^## /gm) || []).length;
const h3 = (full.match(/^### /gm) || []).length;
console.log(`✅ ${h2} major sections | ${h3} subsections`);
console.log("✅ Done!");
