import { describe, expect, it } from "vitest";
import { canonicalReviewBlockers } from "@/data/compendium/canon-review-blockers";
import { regents } from "@/data/compendium/regents";
import { REGENT_ABILITY_GRANTS } from "@/lib/regentAbilityAccess";
import { REGENT_GRANTS } from "@/lib/regentGrants";
import { getRegentLeveledFeatures } from "@/lib/regentProgression";

const CANONICAL_IDS = [
	"umbral_regent",
	"radiant_regent",
	"steel_regent",
	"destruction_regent",
	"war_regent",
	"frost_regent",
	"beast_regent",
	"plague_regent",
	"spatial_regent",
	"mimic_regent",
	"blood_regent",
	"gravity_regent",
] as const;

const REJECTED_ALIAS_CANDIDATES = [
	"Shadow Regent",
	"Flame Regent",
	"Titan Regent",
	"Dragon Regent",
	"Architect Regent",
	"Transfiguration Regent",
	"Frost Sovereign",
];

describe("Task 7 canonical Regent matrix", () => {
	it("locks the canonical 12-entry identity roster without unapproved aliases", () => {
		expect(regents.map((regent) => regent.id)).toEqual(CANONICAL_IDS);
		for (const regent of regents) {
			expect(regent.aliases ?? []).not.toEqual(
				expect.arrayContaining(REJECTED_ALIAS_CANDIDATES),
			);
		}
	});

	it("materializes every progression-table row directly at levels 1 through 20", () => {
		for (const regent of regents) {
			const ledger = getRegentLeveledFeatures(regent);
			expect(
				[...new Set(ledger.map((feature) => feature.level))],
				regent.id,
			).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
			for (let level = 1; level <= 20; level += 1) {
				expect(
					ledger
						.filter((feature) => feature.level === level)
						.map((feature) => feature.name),
					`${regent.id} level ${level}`,
				).toEqual(regent.progression_table?.[level]?.features_gained ?? []);
			}
		}
	});

	it("assigns stable unique IDs and repository-field provenance to every row", () => {
		for (const regent of regents) {
			const ledger = getRegentLeveledFeatures(regent);
			expect(new Set(ledger.map((feature) => feature.id)).size).toBe(
				ledger.length,
			);
			for (const feature of ledger) {
				expect(feature.id).toMatch(
					new RegExp(`^regent-feature:${regent.id}:${feature.level}:`),
				);
				expect(feature.provenance.sourcePath).toBe(
					"src/data/compendium/regents.ts",
				);
				expect(feature.provenance.levelSource).toBe("progression_table");
				expect(feature.description).not.toContain("A manifestation of");
			}
		}
	});

	it("links every mechanic-less row to an explicit canon-review blocker", () => {
		const blockerIds = new Set(
			canonicalReviewBlockers.map((blocker) => blocker.id),
		);
		for (const regent of regents) {
			for (const feature of getRegentLeveledFeatures(regent)) {
				if (feature.canonStatus !== "review-blocked") continue;
				expect(feature.reviewBlockerId).toBe(
					`task7:${regent.id}:progression-mechanics`,
				);
				expect(blockerIds.has(feature.reviewBlockerId ?? "")).toBe(true);
				expect(feature.description).toContain("Canon review required");
			}
		}
	});

	it("declares only progression kinds present on each source record", () => {
		for (const regent of regents) {
			expect(REGENT_GRANTS[regent.id as keyof typeof REGENT_GRANTS]).toEqual({
				spell: Boolean(regent.spellcasting),
				power: Boolean(regent.powersKnown),
				technique: Boolean(regent.techniquesKnown),
			});
		}
	});

	it("quarantines all source-unbacked school and Job-list option grants", () => {
		expect(REGENT_ABILITY_GRANTS).toEqual([]);
		expect(
			canonicalReviewBlockers.some(
				(blocker) => blocker.id === "task7:regents:ability-option-identities",
			),
		).toBe(true);
	});
});
