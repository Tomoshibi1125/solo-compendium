#!/usr/bin/env node
/**
 * optimize-public-images.mjs
 *
 * In-place recompression of heavy raster images that the app actually serves.
 * Filenames and dimensions are preserved, so no source references change.
 *
 *   node scripts/optimize-public-images.mjs           # apply
 *   node scripts/optimize-public-images.mjs --dry-run # report only
 *
 * Scope: PNG/JPG files >= MIN_BYTES under public/, excluding:
 *   - public/generated/adventures/**  (book-print source — keep max quality)
 *   - public/draco/**                 (decoder payloads, not images we own)
 * A file is only rewritten when the recompressed result is >= MIN_SAVINGS
 * smaller; otherwise the original is kept.
 */
import { readdirSync, statSync } from "node:fs";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");

const MIN_BYTES = 300 * 1024;
const MIN_SAVINGS = 0.15;
const EXCLUDE = [
	join(PUBLIC_DIR, "generated", "adventures"),
	join(PUBLIC_DIR, "draco"),
];

const dryRun = process.argv.includes("--dry-run");

function* walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (EXCLUDE.some((ex) => full.startsWith(ex))) continue;
			yield* walk(full);
		} else {
			yield full;
		}
	}
}

async function recompress(file, ext) {
	const input = await readFile(file);
	const image = sharp(input);
	let output;
	if (ext === ".png") {
		// Palette quantization: near-lossless for painted/AI art, 60-80% smaller.
		output = await image
			.png({ palette: true, quality: 90, compressionLevel: 9, effort: 10 })
			.toBuffer();
	} else {
		output = await image.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
	}
	return { input, output };
}

const candidates = [];
for (const file of walk(PUBLIC_DIR)) {
	const ext = extname(file).toLowerCase();
	if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") continue;
	const size = statSync(file).size;
	if (size < MIN_BYTES) continue;
	candidates.push({ file, ext: ext === ".jpeg" ? ".jpg" : ext, size });
}

candidates.sort((a, b) => b.size - a.size);
console.log(
	`[optimize] ${candidates.length} images >= ${Math.round(MIN_BYTES / 1024)}KB${dryRun ? " (dry run)" : ""}`,
);

let before = 0;
let after = 0;
let rewritten = 0;
for (const { file, ext, size } of candidates) {
	const { output } = await recompress(file, ext);
	const rel = relative(PUBLIC_DIR, file);
	before += size;
	if (output.length <= size * (1 - MIN_SAVINGS)) {
		after += output.length;
		rewritten += 1;
		if (!dryRun) {
			// Write via temp + rename so an interrupt never truncates an asset.
			const tmp = `${file}.opt-tmp`;
			await writeFile(tmp, output);
			await unlink(file);
			await rename(tmp, file);
		}
		console.log(
			`  ${rel}: ${(size / 1048576).toFixed(2)}MB -> ${(output.length / 1048576).toFixed(2)}MB`,
		);
	} else {
		after += size;
	}
}

console.log(
	`[optimize] ${rewritten}/${candidates.length} rewritten; total ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`,
);
