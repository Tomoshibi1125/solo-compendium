import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

import { backgrounds as staticBackgrounds } from "@/data/compendium/backgrounds";
import { jobs as staticJobs } from "@/data/compendium/jobs";
import { paths as staticPaths } from "@/data/compendium/paths";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import {
	getStaticBackgroundsAll,
	getStaticPaths,
	initializeProtocolData,
} from "@/lib/ProtocolDataManager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "..", "..", "..");

// Files / directories the test walks for raw-compendium-query enforcement.
const CHARACTER_FLOW_PATHS = [
	"src/components/character-engine",
	"src/pages/CharacterNew.tsx",
	"src/components/character/LevelUpWizardModal.tsx",
	"src/components/character-v2",
	"src/components/character",
];

// Per the plan + memory: documented exceptions that may still issue raw
// compendium_* table reads. Anything outside this allowlist that grep-matches
// the forbidden table list is a regression.
const EXCEPTED_RELATIVE_PATHS = new Set([
	"src/components/character/FeatureChoicesPanel.tsx",
	"src/components/character/FeatureChoicesAdmin.tsx",
	"src/components/character/LevelUpWizardModal.tsx",
	"src/components/character/NotesManager.tsx",
]);

const FORBIDDEN_TABLE_NAMES = [
	"compendium_jobs",
	"compendium_paths",
	"compendium_backgrounds",
	"compendium_feats",
	"compendium_equipment",
	"compendium_powers",
	"compendium_spells",
	"compendium_techniques",
];

const FORBIDDEN_QUERY_RE = new RegExp(
	`\\.from\\([\\"\\']?(${FORBIDDEN_TABLE_NAMES.join("|")})[\\"\\']?`,
);

function listTsxFiles(absPath: string, out: string[] = []): string[] {
	let info: ReturnType<typeof statSync>;
	try {
		info = statSync(absPath);
	} catch {
		return out;
	}
	if (info.isFile()) {
		if (/\.(tsx?|jsx?)$/.test(absPath)) out.push(absPath);
		return out;
	}
	if (!info.isDirectory()) return out;
	for (const entry of readdirSync(absPath)) {
		if (entry === "__tests__" || entry.endsWith(".test.ts")) continue;
		listTsxFiles(join(absPath, entry), out);
	}
	return out;
}

describe("Character flow canonical sources", () => {
	beforeAll(async () => {
		await initializeProtocolData();
	});

	it("getStaticPaths returns the same data as the static paths catalog", () => {
		const fromProtocol = getStaticPaths();
		expect(fromProtocol.length).toBeGreaterThan(0);
		expect(fromProtocol.length).toBe(staticPaths.length);
		const protocolIds = new Set(fromProtocol.map((p) => p.id));
		for (const path of staticPaths) {
			expect(
				protocolIds.has(path.id),
				`Static path ${path.id} missing from ProtocolDataManager`,
			).toBe(true);
		}
	});

	it("getStaticBackgroundsAll returns the same data as the static backgrounds catalog", () => {
		const fromProtocol = getStaticBackgroundsAll();
		expect(fromProtocol.length).toBeGreaterThan(0);
		const protocolIds = new Set(fromProtocol.map((b) => b.id));
		for (const background of staticBackgrounds) {
			expect(
				protocolIds.has(background.id),
				`Static background ${background.id} missing from ProtocolDataManager`,
			).toBe(true);
		}
	});

	it("listCanonicalEntries('jobs') returns the canonical jobs catalog", async () => {
		const entries = await listCanonicalEntries("jobs");
		expect(entries.length).toBeGreaterThan(0);
		const entryNames = new Set(entries.map((e) => e.name.toLowerCase()));
		for (const job of staticJobs) {
			expect(
				entryNames.has(job.name.toLowerCase()),
				`Static job ${job.name} missing from canonical listing`,
			).toBe(true);
		}
	});

	it("listCanonicalEntries('paths') returns the canonical paths catalog", async () => {
		const entries = await listCanonicalEntries("paths");
		expect(entries.length).toBeGreaterThan(0);
		const entryIds = new Set(entries.map((e) => e.id));
		for (const path of staticPaths) {
			expect(
				entryIds.has(path.id),
				`Static path ${path.id} missing from canonical listing`,
			).toBe(true);
		}
	});

	it("character-flow sources do not issue raw compendium_* table queries (only documented exceptions)", () => {
		const violations: { file: string; line: number; text: string }[] = [];
		for (const relPath of CHARACTER_FLOW_PATHS) {
			const absPath = join(REPO_ROOT, relPath);
			const files = listTsxFiles(absPath);
			for (const file of files) {
				const relFromRepo = file
					.slice(REPO_ROOT.length + 1)
					.replace(/\\/g, "/");
				if (EXCEPTED_RELATIVE_PATHS.has(relFromRepo)) continue;
				const text = readFileSync(file, "utf8");
				const lines = text.split("\n");
				for (let i = 0; i < lines.length; i += 1) {
					const line = lines[i];
					if (FORBIDDEN_QUERY_RE.test(line)) {
						violations.push({
							file: relFromRepo,
							line: i + 1,
							text: line.trim(),
						});
					}
				}
			}
		}
		expect(
			violations.map((v) => `${v.file}:${v.line}  ${v.text}`),
			"Character-flow sources must read canonical static data, not raw compendium_* tables",
		).toEqual([]);
		// Synchronous file walk over large character-flow sources (CharacterNew.tsx
		// ~90KB + character/ + character-v2/). Disk I/O can exceed the default 5s
		// ceiling on slower/synced filesystems, so allow extra headroom.
	}, 30000);
});
