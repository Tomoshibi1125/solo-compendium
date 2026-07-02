#!/usr/bin/env node
/**
 * generate-brand-assets.mjs — one-off brand asset pipeline for the RA logo + Rift Site hero.
 *
 * Usage:
 *   node scripts/generate-brand-assets.mjs "<path-to-logo.png>" "<path-to-rift-site-scene.png>"
 *
 * Outputs (all under public/):
 *   ui-art/ra-logo-full.{png,webp,avif}        — full logo w/ wordmark, 1024px
 *   ui-art/ra-logo-mark.{png,webp,avif}        — square crop of the circular monogram, 512px
 *   ui-art/rift-site-hero.{webp,avif}          — full-size hero scene
 *   ui-art/ra-portrait-fallback.{webp,avif}    — vertical crop of the hero scene (compendium portrait fallback)
 *   favicon.ico                                 — 16/32/48 multi-size (PNG-encoded ICO entries)
 *   icon-192.png, icon-512.png                  — PWA icons (black bg, maskable-safe)
 *   apple-touch-icon.png                        — 180×180
 *   opengraph.jpg                               — 1200×630 hero crop + full logo composited center
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const [logoPath, scenePath] = process.argv.slice(2);
if (!logoPath || !scenePath) {
	console.error(
		'Usage: node scripts/generate-brand-assets.mjs "<logo.png>" "<rift-site-scene.png>"',
	);
	process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const UI_ART = path.join(PUBLIC, "ui-art");

/**
 * The monogram circle (with its four compass spikes) occupies the upper
 * portion of the 1254×1254 logo; the wordmark sits below it. Crop box tuned
 * by eye against the source: square centered on the circle.
 */
const MARK_CROP = { left: 187, top: 50, width: 880, height: 880 };

async function emitTriplet(pipeline, basename, { png = true, size } = {}) {
	const resized = size
		? pipeline.clone().resize(size, size, { fit: "inside" })
		: pipeline.clone();
	const jobs = [
		resized
			.clone()
			.webp({ quality: 82 })
			.toFile(path.join(UI_ART, `${basename}.webp`)),
		resized
			.clone()
			.avif({ quality: 55 })
			.toFile(path.join(UI_ART, `${basename}.avif`)),
	];
	if (png) {
		jobs.push(
			resized
				.clone()
				.png({ compressionLevel: 9, palette: false })
				.toFile(path.join(UI_ART, `${basename}.png`)),
		);
	}
	await Promise.all(jobs);
	console.log(`  ✓ ui-art/${basename}.{${png ? "png," : ""}webp,avif}`);
}

/**
 * Minimal ICO writer: ICONDIR + one ICONDIRENTRY per image, with PNG-encoded
 * payloads (valid since Windows Vista; supported by every modern browser).
 */
function buildIco(pngBuffers, sizes) {
	const count = pngBuffers.length;
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(count, 4);

	const entries = [];
	let offset = 6 + 16 * count;
	for (let i = 0; i < count; i++) {
		const entry = Buffer.alloc(16);
		const dim = sizes[i] >= 256 ? 0 : sizes[i];
		entry.writeUInt8(dim, 0); // width
		entry.writeUInt8(dim, 1); // height
		entry.writeUInt8(0, 2); // palette
		entry.writeUInt8(0, 3); // reserved
		entry.writeUInt16LE(1, 4); // color planes
		entry.writeUInt16LE(32, 6); // bpp
		entry.writeUInt32LE(pngBuffers[i].length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += pngBuffers[i].length;
		entries.push(entry);
	}
	return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
	await mkdir(UI_ART, { recursive: true });

	const logo = sharp(logoPath);
	const scene = sharp(scenePath);
	const logoMeta = await logo.metadata();
	const sceneMeta = await scene.metadata();
	console.log(
		`Inputs: logo ${logoMeta.width}×${logoMeta.height}, scene ${sceneMeta.width}×${sceneMeta.height}`,
	);

	// ── Full logo (wordmark included) ──────────────────────────
	console.log("Full logo:");
	await emitTriplet(sharp(logoPath), "ra-logo-full", { size: 1024 });

	// ── Mark (monogram circle square crop) ─────────────────────
	console.log("Logo mark:");
	const mark = sharp(logoPath).extract(MARK_CROP);
	await emitTriplet(mark, "ra-logo-mark", { size: 512 });

	// ── Rift Site hero (full frame, no png — large) ────────────
	console.log("Rift Site hero:");
	await sharp(scenePath)
		.webp({ quality: 70 })
		.toFile(path.join(UI_ART, "rift-site-hero.webp"));
	await sharp(scenePath)
		.avif({ quality: 50 })
		.toFile(path.join(UI_ART, "rift-site-hero.avif"));
	console.log("  ✓ ui-art/rift-site-hero.{webp,avif}");

	// ── Portrait fallback: vertical crop centered on the rift ──
	// The rift threshold sits at roughly x≈62–78% of the frame; take a
	// 3:4 portrait around it.
	const pw = Math.round(sceneMeta.height * 0.75);
	const pl = Math.min(
		Math.round(sceneMeta.width * 0.68) - Math.round(pw / 2),
		sceneMeta.width - pw,
	);
	const portrait = sharp(scenePath).extract({
		left: Math.max(0, pl),
		top: 0,
		width: pw,
		height: sceneMeta.height,
	});
	await portrait
		.clone()
		.resize(480, 640, { fit: "cover" })
		.webp({ quality: 78 })
		.toFile(path.join(UI_ART, "ra-portrait-fallback.webp"));
	await portrait
		.clone()
		.resize(480, 640, { fit: "cover" })
		.avif({ quality: 55 })
		.toFile(path.join(UI_ART, "ra-portrait-fallback.avif"));
	console.log("  ✓ ui-art/ra-portrait-fallback.{webp,avif}");

	// ── PWA / favicon set from the mark (black bg is maskable-safe) ──
	console.log("PWA icons:");
	const markFlat = sharp(logoPath)
		.extract(MARK_CROP)
		.flatten({ background: "#000000" });
	const iconJobs = [
		[192, "icon-192.png"],
		[512, "icon-512.png"],
		[180, "apple-touch-icon.png"],
	];
	for (const [size, name] of iconJobs) {
		await markFlat
			.clone()
			.resize(size, size)
			.png({ compressionLevel: 9 })
			.toFile(path.join(PUBLIC, name));
		console.log(`  ✓ ${name}`);
	}

	const icoSizes = [16, 32, 48];
	const icoPngs = [];
	for (const size of icoSizes) {
		icoPngs.push(await markFlat.clone().resize(size, size).png().toBuffer());
	}
	await writeFile(
		path.join(PUBLIC, "favicon.ico"),
		buildIco(icoPngs, icoSizes),
	);
	console.log("  ✓ favicon.ico (16/32/48)");

	// ── OpenGraph: 1200×630 hero crop + full logo centered ─────
	console.log("OpenGraph:");
	const ogLogo = await sharp(logoPath)
		.resize(460, 460, { fit: "inside" })
		.png()
		.toBuffer();
	await sharp(scenePath)
		.resize(1200, 630, { fit: "cover", position: "attention" })
		.composite([{ input: ogLogo, gravity: "center" }])
		.jpeg({ quality: 82 })
		.toFile(path.join(PUBLIC, "opengraph.jpg"));
	console.log("  ✓ opengraph.jpg (1200×630)");

	console.log("\nDone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
