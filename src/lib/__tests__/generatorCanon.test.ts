/**
 * Generator RA-canon guard.
 *
 * The deterministic Warden-tool generators (Rift/NPC/Treasure/Random-Event/
 * Directive) and the compendium rollable tables drifted off-canon after the
 * brand overhaul ("Awakened Council" instead of the Bureau, Korean-only name
 * pools, D&D ability names, gold/gp currency). This scans every generator
 * surface for the banned pre-overhaul vocabulary so it can't creep back, and
 * covers the static rollable tables with the canon source-book audit.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { rollableTables } from "@/data/compendium/rollableTables";
import {
	auditRollableTableSources,
	type CompendiumAuditIssue,
} from "@/lib/compendiumAudit";

const SRC_ROOT = join(__dirname, "..", "..");

/** Every file that feeds generator output (deterministic pools + prompts + UI). */
const GENERATOR_SURFACE = [
	"data/wardenGeneratorContent.ts",
	"data/compendium/rollableTables.ts",
	"data/toolCatalogs.ts",
	"components/AIContentGeneratorClass.ts",
	"components/warden-directives/DirectiveMatrix.tsx",
	"components/warden-directives/NPCGenerator.tsx",
	"components/warden-directives/DungeonMapGenerator.tsx",
	"components/compendium/GeminiProtocolGenerator.tsx",
	"components/art/ArtGenerator.tsx",
	"components/art/AIEnhancedArtGenerator.tsx",
	"lib/riftGenerator.ts",
	"lib/treasureGenerator.ts",
	"lib/geminiProtocol.ts",
	"pages/warden-directives/GateGenerator.tsx",
	"pages/warden-directives/NPCGenerator.tsx",
	"pages/warden-directives/RandomEventGenerator.tsx",
	"pages/warden-directives/TreasureGenerator.tsx",
	"pages/warden-directives/ArtGenerator.tsx",
] as const;

/** Banned term → a synthetic string the pattern MUST match (self-probe). */
const BANNED: Array<{ pattern: RegExp; probe: string; why: string }> = [
	{
		pattern: /Awakened Council/,
		probe: "report to the Awakened Council",
		why: "canon faction is the Bureau",
	},
	{
		pattern: /\bmonarch\b/i,
		probe: "the Shadow Monarch rises",
		why: "'monarch' belongs to a different franchise",
	},
	{
		pattern: /\bthe reset\b/i,
		probe: "Knows about the reset",
		why: "'the reset' is not RA lore",
	},
	{
		pattern: /Post-Reset/i,
		probe: "Post-Reset Fragment",
		why: "'the reset' is not RA lore",
	},
	{
		pattern: /\bgold pieces?\b/i,
		probe: "500 gold pieces",
		why: "currency is Mana/Crystal/Rift/Core Credits",
	},
	{
		pattern: /\b\d+\s?gp\b/i,
		probe: "costs 25 gp",
		why: "currency is Mana/Crystal/Rift/Core Credits",
	},
	{
		pattern: /\btaverns?\b/i,
		probe: "meet at the tavern",
		why: "RA is modern, not medieval-fantasy",
	},
	{
		pattern: /\blutes?\b/i,
		probe: "strums a lute",
		why: "Idol instruments are electric guitar/synth/DJ controller",
	},
	{
		pattern: /\bhunters?\b/i,
		probe: "an S-Rank Hunter",
		why: "RA uses Ascendant, not Hunter",
	},
	{
		pattern: /\bSeoul\b|\bKorea\b/,
		probe: "the Seoul branch",
		why: "the setting is the Accord (Meridian City), not Korea",
	},
	{
		pattern: /E through SS|\bSS-Rank\b/,
		probe: "rank (E through SS)",
		why: "ranks run E through S (SS was retired)",
	},
	{
		pattern: /\b(DEX|CON|WIS|CHA)\b/,
		probe: "| STR | DEX | CON |",
		why: "RA abilities are STR/AGI/VIT/INT/SENSE/PRE",
	},
];

describe("generator RA-canon guard", () => {
	it("every banned pattern matches its probe (patterns actually detect)", () => {
		for (const { pattern, probe } of BANNED) {
			expect(pattern.test(probe), `${pattern} should match "${probe}"`).toBe(
				true,
			);
		}
	});

	it("no generator surface contains banned pre-overhaul vocabulary", () => {
		const offenders: string[] = [];
		for (const relPath of GENERATOR_SURFACE) {
			const content = readFileSync(join(SRC_ROOT, relPath), "utf8");
			for (const { pattern, why } of BANNED) {
				const match = content.match(pattern);
				if (match) {
					const line = content.slice(0, match.index ?? 0).split("\n").length;
					offenders.push(`src/${relPath}:${line} → "${match[0]}" (${why})`);
				}
			}
		}
		expect(offenders).toEqual([]);
	});
});

describe("rollable-table canon audit", () => {
	it("the shipped rollable tables pass the canon source-book audit", () => {
		const issues: CompendiumAuditIssue[] = [];
		auditRollableTableSources(rollableTables, issues);
		expect(issues).toEqual([]);
	});

	it("negative probe: a non-canon source_book is flagged as an error", () => {
		const issues: CompendiumAuditIssue[] = [];
		auditRollableTableSources(
			[
				{
					id: "probe-table",
					name: "Probe Table",
					description: "A probe.",
					source_book: "Warden's Guide",
				},
			],
			issues,
		);
		expect(
			issues.some(
				(issue) =>
					issue.code === "invalid_source_book" && issue.severity === "error",
			),
		).toBe(true);
	});

	it("negative probe: a missing description is flagged as an error", () => {
		const issues: CompendiumAuditIssue[] = [];
		auditRollableTableSources(
			[
				{
					id: "probe-table",
					name: "Probe Table",
					description: "",
					source_book: "Rift Ascendant Canon",
				},
			],
			issues,
		);
		expect(issues.some((issue) => issue.code === "missing_description")).toBe(
			true,
		);
	});
});
