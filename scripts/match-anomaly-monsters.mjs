#!/usr/bin/env node
/**
 * match-anomaly-monsters.mjs
 *
 * Builds a deterministic mapping from every anomaly (src/data/compendium/anomalies/rank-*.ts)
 * to a monster image in public/generated/compendium/monsters/monster-XXXX.webp.
 *
 * Strategy:
 *   1. Parse every anomaly entry (id, name, type, rank) from the rank files.
 *   2. Enumerate the monster-XXXX.webp files that actually exist on disk.
 *   3. For each anomaly, pick a slot using a keyword-pool system tuned to the
 *      monster range, with a deterministic djb2 hash of the anomaly id as seed.
 *      Priority: name-keyword pool > type-keyword pool > default pool.
 *   4. Emit `audit/anomaly-monster-mapping.json` for Phase 4.1 to apply.
 *
 * Run:  node scripts/match-anomaly-monsters.mjs
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const ANOMALIES_DIR = join(ROOT, "src", "data", "compendium", "anomalies");
const MONSTERS_DIR = join(ROOT, "public", "generated", "compendium", "monsters");
const AUDIT_DIR = join(ROOT, "audit");

// ---------------------------------------------------------------------------
// Anomaly parser — extracts { id, name, type, rank, image } from rank-*.ts
// ---------------------------------------------------------------------------

const ANOMALY_BLOCK_RE = /\{\s*[\s\S]*?id:\s*"(anomaly-[^"]+)"[\s\S]*?\}/g;

function extractField(block, key) {
	const re = new RegExp(`\\b${key}:\\s*"([^"]+)"`);
	const m = block.match(re);
	return m ? m[1] : null;
}

function parseAnomaliesFromFile(filePath) {
	const src = readFileSync(filePath, "utf8");
	const anomalies = [];
	// Use a simpler extraction — split on top-level `{` entries containing `id: "anomaly-`.
	// The file is an array of objects; every object starts at a line-leading `{` and
	// contains `id: "anomaly-XXXX"`. We match non-greedily up to the next such block.
	const idMatches = [...src.matchAll(/id:\s*"(anomaly-[^"]+)"/g)];
	for (let i = 0; i < idMatches.length; i++) {
		const startIdx = idMatches[i].index;
		const endIdx = i + 1 < idMatches.length ? idMatches[i + 1].index : src.length;
		const block = src.slice(startIdx, endIdx);
		const id = idMatches[i][1];
		const name = extractField(block, "name") ?? "";
		const type = extractField(block, "type") ?? "";
		const rank = extractField(block, "rank") ?? "";
		const image = extractField(block, "image") ?? "";
		anomalies.push({ id, name, type, rank, image, sourceFile: filePath.replace(`${ROOT}\\`, "").replace(`${ROOT}/`, "") });
	}
	return anomalies;
}

function loadAllAnomalies() {
	const files = readdirSync(ANOMALIES_DIR).filter(
		(f) => f.startsWith("rank-") && f.endsWith(".ts"),
	);
	const all = [];
	for (const f of files) {
		all.push(...parseAnomaliesFromFile(join(ANOMALIES_DIR, f)));
	}
	return all;
}

// ---------------------------------------------------------------------------
// Monster file enumeration
// ---------------------------------------------------------------------------

function loadMonsterFiles() {
	if (!existsSync(MONSTERS_DIR)) {
		throw new Error(`Monster directory not found: ${MONSTERS_DIR}`);
	}
	const files = readdirSync(MONSTERS_DIR).filter((f) => f.endsWith(".webp"));
	const numbered = files.filter((f) => /^monster-\d+\.webp$/.test(f)).sort();
	const named = files.filter((f) => !/^monster-\d+\.webp$/.test(f));
	return { numbered, named, all: files };
}

// ---------------------------------------------------------------------------
// Deterministic hash (djb2)
// ---------------------------------------------------------------------------

function hashString(s) {
	let h = 5381;
	for (let i = 0; i < s.length; i++) {
		h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
	}
	return h;
}

// ---------------------------------------------------------------------------
// Keyword pools (tuned to monster-XXXX range, N total slots)
// Pool numbers are 1-indexed into the sorted monster list; overlapping OK.
// Pools are proportional to the monster count so we distribute evenly.
// ---------------------------------------------------------------------------

function buildPools(monsterCount) {
	// Proportionally partition the monster range. We target ~broad themes so
	// each pool has at least 20 distinct slots to randomise within.
	// Sum of proportions need not equal 1 — pools can overlap.
	const pct = (from, to) => ({
		start: Math.max(1, Math.floor(from * monsterCount)),
		end: Math.min(monsterCount, Math.floor(to * monsterCount)),
	});

	// Name-keyword pools: check first against the anomaly name.
	const nameKeywordPools = [
		{ keyword: "Dragon", pool: pct(0.0, 0.06) },
		{ keyword: "Phoenix", pool: pct(0.06, 0.09) },
		{ keyword: "Serpent", pool: pct(0.09, 0.13) },
		{ keyword: "Lich", pool: pct(0.13, 0.17) },
		{ keyword: "Revenant", pool: pct(0.17, 0.2) },
		{ keyword: "Wraith", pool: pct(0.2, 0.23) },
		{ keyword: "Horror", pool: pct(0.23, 0.27) },
		{ keyword: "Lurker", pool: pct(0.27, 0.3) },
		{ keyword: "Stalker", pool: pct(0.3, 0.33) },
		{ keyword: "Assassin", pool: pct(0.33, 0.36) },
		{ keyword: "Devourer", pool: pct(0.36, 0.39) },
		{ keyword: "Demon", pool: pct(0.39, 0.45) },
		{ keyword: "Knight", pool: pct(0.45, 0.49) },
		{ keyword: "Overlord", pool: pct(0.49, 0.52) },
		{ keyword: "Warlord", pool: pct(0.52, 0.55) },
		{ keyword: "Berserker", pool: pct(0.55, 0.58) },
		{ keyword: "Herald", pool: pct(0.58, 0.61) },
		{ keyword: "Guardian", pool: pct(0.61, 0.65) },
		{ keyword: "Titan", pool: pct(0.65, 0.7) },
		{ keyword: "Colossus", pool: pct(0.67, 0.72) },
		{ keyword: "God", pool: pct(0.72, 0.78) },
		{ keyword: "Celestial", pool: pct(0.75, 0.8) },
		{ keyword: "Abyss", pool: pct(0.8, 0.85) },
		{ keyword: "Void", pool: pct(0.82, 0.88) },
		{ keyword: "Shadow", pool: pct(0.85, 0.92) },
		{ keyword: "Eternal", pool: pct(0.9, 0.98) },
	];

	// Type-keyword pools: secondary match on the anomaly `type` field.
	const typeKeywordPools = [
		{ keyword: "Dragon", pool: pct(0.0, 0.07) },
		{ keyword: "Undead", pool: pct(0.13, 0.23) },
		{ keyword: "Beast", pool: pct(0.23, 0.35) },
		{ keyword: "Demon", pool: pct(0.39, 0.45) },
		{ keyword: "Elemental", pool: pct(0.45, 0.55) },
		{ keyword: "Humanoid", pool: pct(0.45, 0.55) },
		{ keyword: "Titan", pool: pct(0.65, 0.72) },
		{ keyword: "God", pool: pct(0.72, 0.8) },
		{ keyword: "Fey", pool: pct(0.55, 0.65) },
		{ keyword: "Fiend", pool: pct(0.39, 0.5) },
		{ keyword: "Aberration", pool: pct(0.27, 0.35) },
		{ keyword: "Construct", pool: pct(0.45, 0.55) },
		{ keyword: "Monstrosity", pool: pct(0.23, 0.4) },
	];

	const defaultPool = pct(0.5, 1.0);
	return { nameKeywordPools, typeKeywordPools, defaultPool };
}

function pickSlot(seed, pool) {
	const count = pool.end - pool.start + 1;
	if (count <= 0) return pool.start;
	return pool.start + (hashString(seed) % count);
}

function slotToFilename(slot) {
	return `monster-${String(slot).padStart(4, "0")}.webp`;
}

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function matchAnomaly(anomaly, pools, availableSet) {
	const nameLower = (anomaly.name || "").toLowerCase();
	const typeLower = (anomaly.type || "").toLowerCase();

	// Priority 1 — Name keyword
	for (const { keyword, pool } of pools.nameKeywordPools) {
		if (nameLower.includes(keyword.toLowerCase())) {
			// Try up to 5 re-hashes within the pool to find an existing file.
			for (let attempt = 0; attempt < 5; attempt++) {
				const slot = pickSlot(`${anomaly.id}-${attempt}`, pool);
				const fn = slotToFilename(slot);
				if (availableSet.has(fn)) {
					return {
						filename: fn,
						score: 0.95,
						reason: `name-keyword:${keyword}`,
					};
				}
			}
		}
	}

	// Priority 2 — Type keyword
	for (const { keyword, pool } of pools.typeKeywordPools) {
		if (typeLower.includes(keyword.toLowerCase())) {
			for (let attempt = 0; attempt < 5; attempt++) {
				const slot = pickSlot(`${anomaly.id}-${attempt}`, pool);
				const fn = slotToFilename(slot);
				if (availableSet.has(fn)) {
					return {
						filename: fn,
						score: 0.75,
						reason: `type-keyword:${keyword}`,
					};
				}
			}
		}
	}

	// Priority 3 — Default pool
	for (let attempt = 0; attempt < 10; attempt++) {
		const slot = pickSlot(`${anomaly.id}-default-${attempt}`, pools.defaultPool);
		const fn = slotToFilename(slot);
		if (availableSet.has(fn)) {
			return {
				filename: fn,
				score: 0.5,
				reason: "default-pool",
			};
		}
	}

	// Fallback — any available file keyed by id hash
	const sortedAvail = Array.from(availableSet).sort();
	const idx = hashString(anomaly.id) % sortedAvail.length;
	return {
		filename: sortedAvail[idx],
		score: 0.3,
		reason: "fallback-hash",
	};
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	await mkdir(AUDIT_DIR, { recursive: true });

	console.log("[match] Loading anomalies...");
	const anomalies = loadAllAnomalies();
	console.log(`[match]   Loaded ${anomalies.length} anomaly entries`);

	console.log("[match] Loading monster image filenames...");
	const monsters = loadMonsterFiles();
	console.log(
		`[match]   Found ${monsters.numbered.length} numbered monster files, ${monsters.named.length} named files`,
	);

	const availableSet = new Set(monsters.numbered);
	const pools = buildPools(monsters.numbered.length);

	const mapping = [];
	const byReason = new Map();
	const targetUsage = new Map();

	for (const anomaly of anomalies) {
		const match = matchAnomaly(anomaly, pools, availableSet);
		const proposedPath = `/generated/compendium/monsters/${match.filename}`;
		mapping.push({
			anomalyId: anomaly.id,
			name: anomaly.name,
			type: anomaly.type,
			rank: anomaly.rank,
			currentImage: anomaly.image,
			proposedImage: proposedPath,
			score: match.score,
			reason: match.reason,
			sourceFile: anomaly.sourceFile,
		});
		byReason.set(match.reason, (byReason.get(match.reason) || 0) + 1);
		targetUsage.set(
			match.filename,
			(targetUsage.get(match.filename) || 0) + 1,
		);
	}

	const duplicateTargets = [...targetUsage.entries()]
		.filter(([, count]) => count > 1)
		.sort((a, b) => b[1] - a[1]);

	const summary = {
		generatedAt: new Date().toISOString(),
		totals: {
			anomalies: anomalies.length,
			monsterFilesAvailable: monsters.numbered.length,
			monsterNamedFiles: monsters.named.length,
			lowConfidence: mapping.filter((m) => m.score < 0.5).length,
			duplicateTargetAssignments: duplicateTargets.length,
		},
		reasonCounts: Object.fromEntries(byReason),
		top20DuplicateTargets: duplicateTargets.slice(0, 20).map(([fn, c]) => ({ filename: fn, assignedCount: c })),
		mapping,
	};

	const outPath = join(AUDIT_DIR, "anomaly-monster-mapping.json");
	await writeFile(outPath, JSON.stringify(summary, null, 2), "utf8");
	console.log(`[match] Wrote ${outPath}`);
	console.log("");
	console.log("[match] Summary:");
	console.log(`  anomalies            = ${summary.totals.anomalies}`);
	console.log(`  monsters available   = ${summary.totals.monsterFilesAvailable}`);
	console.log(`  low-confidence (<0.5)= ${summary.totals.lowConfidence}`);
	console.log("  match-reason distribution:");
	for (const [r, c] of Object.entries(summary.reasonCounts).sort((a, b) => b[1] - a[1])) {
		console.log(`    ${r.padEnd(30)} ${c}`);
	}
	if (duplicateTargets.length > 0) {
		console.log(`  duplicate target files: ${duplicateTargets.length}`);
	}
}

main().catch((err) => {
	console.error("[match] FAILED:", err);
	process.exit(1);
});
