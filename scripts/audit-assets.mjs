#!/usr/bin/env node
/**
 * audit-assets.mjs
 *
 * Walks the static compendium data and every runtime asset manifest, collects
 * every `image` / `image_url` / `path` reference, verifies that each path
 * resolves to a real file on disk under `public/`, and produces a JSON report
 * plus a human-readable summary.
 *
 * Run:  node scripts/audit-assets.mjs
 * Outputs: audit/assets-report.json, audit/SUMMARY.md
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const DATA_DIR = join(ROOT, "src", "data", "compendium");
const AUDIT_DIR = join(ROOT, "audit");

/** Categories that track a case-insensitive / casing-insensitive disk match. */
const CASE_INSENSITIVE_FS = process.platform === "win32";

/** Slurp every .ts file under src/data/compendium and return concatenated source. */
function readAllDataSources() {
	const files = [];
	function walk(dir) {
		for (const entry of readdirSync(dir)) {
			const p = join(dir, entry);
			const stat = statSync(p);
			if (stat.isDirectory()) {
				walk(p);
			} else if (entry.endsWith(".ts") && !entry.endsWith(".d.ts")) {
				files.push(p);
			}
		}
	}
	walk(DATA_DIR);
	return files;
}

/** Extract every `/generated/...` or `/audio/...` path from a source blob. */
function extractPaths(source) {
	const paths = new Set();
	// Matches "/generated/..." and "/audio/..." inside double-quoted strings
	const re = /"(\/(?:generated|audio)\/[^"\\]+\.(?:webp|png|jpg|jpeg|svg|mp3|ogg|wav|m4a))"/gi;
	let m;
	while ((m = re.exec(source)) !== null) {
		paths.add(m[1]);
	}
	return paths;
}

/** Best-effort path existence check with case verification on Windows. */
function fileExists(relPath) {
	const abs = join(PUBLIC_DIR, relPath.replace(/^\//, ""));
	if (!existsSync(abs)) {
		return { exists: false, casingMismatch: false };
	}
	if (!CASE_INSENSITIVE_FS) {
		return { exists: true, casingMismatch: false };
	}
	// On Windows the FS is case-insensitive; verify real on-disk casing
	// by walking each segment of the path against the actual directory listing.
	const parts = relPath.replace(/^\//, "").split("/");
	let cursor = PUBLIC_DIR;
	for (const part of parts) {
		try {
			const entries = readdirSync(cursor);
			if (!entries.includes(part)) {
				return { exists: true, casingMismatch: true };
			}
			cursor = join(cursor, part);
		} catch {
			return { exists: true, casingMismatch: true };
		}
	}
	return { exists: true, casingMismatch: false };
}

/** Categorise each asset path for the report. */
function categorise(p) {
	if (p.startsWith("/audio/sfx/")) return "audio-sfx";
	if (p.startsWith("/audio/ambient/")) return "audio-ambient";
	if (p.startsWith("/audio/music/")) return "audio-music";
	if (p.startsWith("/audio/")) return "audio-other";
	if (p.startsWith("/generated/compendium/anomalies/")) return "image-anomaly";
	if (p.startsWith("/generated/compendium/monsters/")) return "image-monster";
	if (p.startsWith("/generated/compendium/regents/")) return "image-regent";
	if (p.startsWith("/generated/compendium/Regents/")) return "image-regent-BADCASE";
	if (p.startsWith("/generated/compendium/spells/")) return "image-spell";
	if (p.startsWith("/generated/compendium/items/")) return "image-item";
	if (p.startsWith("/generated/compendium/locations/")) return "image-location";
	if (p.startsWith("/generated/compendium/artifacts/")) return "image-artifact";
	if (p.startsWith("/generated/compendium/relics/")) return "image-relic";
	if (p.startsWith("/generated/compendium/backgrounds/")) return "image-background";
	if (p.startsWith("/generated/compendium/jobs/")) return "image-job";
	if (p.startsWith("/generated/compendium/runes/")) return "image-rune";
	if (p.startsWith("/generated/compendium/techniques/")) return "image-technique";
	if (p.startsWith("/generated/compendium/powers/")) return "image-power";
	if (p.startsWith("/generated/compendium/")) return "image-other-compendium";
	if (p.startsWith("/generated/maps/")) return "image-map";
	if (p.startsWith("/generated/tokens/")) return "image-token";
	if (p.startsWith("/generated/props/")) return "image-prop";
	if (p.startsWith("/generated/effects/")) return "image-effect";
	if (p.startsWith("/generated/conditions/")) return "image-condition";
	return "other";
}

/** Detect the anomaly-placeholder pool pattern. */
function isAnomalyPlaceholderPool(p) {
	return /^\/generated\/compendium\/anomalies\/anomaly-\d{4}\.webp$/.test(p);
}

async function main() {
	await mkdir(AUDIT_DIR, { recursive: true });

	console.log("[audit] Scanning compendium source files...");
	const sourceFiles = readAllDataSources();
	console.log(`[audit]   Found ${sourceFiles.length} .ts files under src/data/compendium`);

	// Also scan runtime manifests that hold audio references
	const manifestFiles = [
		join(ROOT, "src", "lib", "vtt", "vttAssetManifest.ts"),
		join(ROOT, "src", "data", "vttAssetLibrary.ts"),
		join(ROOT, "src", "lib", "audio", "hooks.ts"),
	].filter((f) => existsSync(f));

	const allFiles = [...sourceFiles, ...manifestFiles];
	const pathRefs = new Map(); // path -> { count, sources: Set<string> }

	for (const file of allFiles) {
		const src = readFileSync(file, "utf8");
		const rel = file.replace(`${ROOT}\\`, "").replace(`${ROOT}/`, "");
		const paths = extractPaths(src);
		for (const p of paths) {
			if (!pathRefs.has(p)) {
				pathRefs.set(p, { count: 0, sources: new Set() });
			}
			const ref = pathRefs.get(p);
			ref.count += 1;
			ref.sources.add(rel);
		}
	}

	console.log(`[audit] Extracted ${pathRefs.size} unique asset paths`);

	// Verify each path
	const byCategory = new Map();
	const missing = [];
	const casingMismatch = [];
	const placeholderAnomalies = [];

	for (const [path, ref] of pathRefs) {
		const category = categorise(path);
		const { exists, casingMismatch: mismatch } = fileExists(path);

		if (!byCategory.has(category)) {
			byCategory.set(category, {
				category,
				total: 0,
				missing: 0,
				casingMismatch: 0,
				placeholder: 0,
			});
		}
		const bucket = byCategory.get(category);
		bucket.total += 1;
		if (!exists) {
			bucket.missing += 1;
			missing.push({
				path,
				category,
				refCount: ref.count,
				sources: Array.from(ref.sources),
			});
		} else if (mismatch) {
			bucket.casingMismatch += 1;
			casingMismatch.push({
				path,
				category,
				refCount: ref.count,
				sources: Array.from(ref.sources),
			});
		}
		if (isAnomalyPlaceholderPool(path)) {
			bucket.placeholder += 1;
			placeholderAnomalies.push({ path, refCount: ref.count });
		}
	}

	// Also scan /public/generated/compendium/regents/ for missing files
	const regentDir = join(PUBLIC_DIR, "generated", "compendium", "regents");
	const regentDiskFiles = existsSync(regentDir) ? readdirSync(regentDir) : [];

	const summary = {
		generatedAt: new Date().toISOString(),
		totals: {
			uniquePaths: pathRefs.size,
			missing: missing.length,
			casingMismatch: casingMismatch.length,
			placeholderAnomalies: placeholderAnomalies.length,
		},
		categories: Array.from(byCategory.values()).sort((a, b) =>
			a.category.localeCompare(b.category),
		),
		missing: missing.sort((a, b) => a.path.localeCompare(b.path)),
		casingMismatch: casingMismatch.sort((a, b) => a.path.localeCompare(b.path)),
		placeholderAnomalies: placeholderAnomalies.sort((a, b) =>
			a.path.localeCompare(b.path),
		),
		regentFolder: {
			diskPath: "public/generated/compendium/regents",
			fileCount: regentDiskFiles.length,
			files: regentDiskFiles,
		},
	};

	const outJson = join(AUDIT_DIR, "assets-report.json");
	await writeFile(outJson, JSON.stringify(summary, null, 2), "utf8");
	console.log(`[audit] Wrote ${outJson}`);

	// Human-readable summary
	const lines = [];
	lines.push(`# Asset Audit Summary`);
	lines.push("");
	lines.push(`Generated: ${summary.generatedAt}`);
	lines.push("");
	lines.push(`- **Unique asset paths referenced**: ${summary.totals.uniquePaths}`);
	lines.push(`- **Missing files on disk**: ${summary.totals.missing}`);
	lines.push(`- **Casing mismatches (bad on Linux)**: ${summary.totals.casingMismatch}`);
	lines.push(`- **Anomaly placeholder pool references**: ${summary.totals.placeholderAnomalies}`);
	lines.push(`- **Regent folder on disk**: ${summary.regentFolder.fileCount} files`);
	lines.push("");
	lines.push(`## By category`);
	lines.push("");
	lines.push(`| Category | Total | Missing | Casing | Placeholder |`);
	lines.push(`|----------|-------|---------|--------|-------------|`);
	for (const c of summary.categories) {
		lines.push(
			`| ${c.category} | ${c.total} | ${c.missing} | ${c.casingMismatch} | ${c.placeholder} |`,
		);
	}
	lines.push("");
	if (summary.missing.length > 0) {
		lines.push(`## Missing files (first 50)`);
		lines.push("");
		for (const m of summary.missing.slice(0, 50)) {
			lines.push(`- \`${m.path}\` (${m.category}, ${m.refCount} refs)`);
		}
		if (summary.missing.length > 50) {
			lines.push(`- *...and ${summary.missing.length - 50} more*`);
		}
		lines.push("");
	}
	if (summary.casingMismatch.length > 0) {
		lines.push(`## Casing mismatches`);
		lines.push("");
		for (const m of summary.casingMismatch.slice(0, 50)) {
			lines.push(`- \`${m.path}\` (${m.category}, ${m.refCount} refs)`);
		}
		lines.push("");
	}

	const outMd = join(AUDIT_DIR, "SUMMARY.md");
	await writeFile(outMd, lines.join("\n"), "utf8");
	console.log(`[audit] Wrote ${outMd}`);

	console.log("");
	console.log(`[audit] DONE. Totals: missing=${summary.totals.missing}, casingMismatch=${summary.totals.casingMismatch}, placeholder=${summary.totals.placeholderAnomalies}`);
}

main().catch((err) => {
	console.error("[audit] FAILED:", err);
	process.exit(1);
});
