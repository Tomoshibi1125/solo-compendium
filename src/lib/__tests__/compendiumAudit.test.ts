import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";
import {
	formatCompendiumAuditReport,
	runCompendiumAudit,
} from "@/lib/compendiumAudit";

describe("compendium audit (provider-backed)", () => {
	it("produces a non-empty report with dataset counts and preserves run shape", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		expect(summary.totalEntries).toBeGreaterThan(0);
		expect(Object.keys(summary.datasets)).toEqual(
			expect.arrayContaining([
				"anomalies",
				"backgrounds",
				"conditions",
				"equipment",
				"feats",
				"items",
				"jobs",
				"locations",
				"paths",
				"powers",
				"regents",
				"relics",
				"runes",
				"sigils",
				"skills",
				"spells",
				"tattoos",
				"techniques",
			]),
		);

		const report = formatCompendiumAuditReport(summary);
		expect(report).toContain("COMPENDIUM AUDIT START");
		expect(report).toContain("COMPENDIUM AUDIT COMPLETE");
	});

	it("never has duplicate ids in canonical datasets", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const duplicateIds = summary.issues.filter(
			(issue) => issue.code === "duplicate_id",
		);
		expect(
			duplicateIds,
			`Unexpected duplicate ids:\n${duplicateIds
				.map((issue) => `- ${issue.dataset}: ${issue.entryId}`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("has no duplicate names in canonical datasets", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const duplicateNames = summary.issues.filter(
			(issue) => issue.code === "duplicate_name",
		);
		expect(
			duplicateNames,
			`Unexpected duplicate names:\n${duplicateNames
				.map((issue) => `- ${issue.dataset}: ${issue.entryName}`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("enforces source_book and description on every entry", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const missingMeta = summary.issues.filter((issue) =>
			issue.code === "missing_source_book" || issue.code === "missing_description",
		);
		expect(
			missingMeta,
			`Entries missing required metadata:\n${missingMeta
				.map((issue) => `- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("castable datasets are free of templated authoring phrases", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const templated = summary.issues.filter(
			(issue) => issue.code === "templated_language",
		);
		expect(
			templated,
			`Templated-language regressions:\n${templated
				.map((issue) => `- ${issue.dataset}:${issue.entryName ?? issue.entryId}`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("castable names are Title Case across all words", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const casing = summary.issues.filter(
			(issue) => issue.code === "naming_case",
		);
		expect(
			casing,
			`Naming-case regressions:\n${casing
				.map((issue) => `- ${issue.dataset}:${issue.entryName ?? issue.entryId}: ${issue.message}`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("name themes align with declared damage types", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const themeMismatches = summary.issues.filter(
			(issue) => issue.code === "damage_theme_mismatch",
		);
		expect(
			themeMismatches,
			`Damage-theme mismatches:\n${themeMismatches
				.map((issue) => `- ${issue.dataset}:${issue.entryName ?? issue.entryId}: ${issue.message}`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("utility/support-named entries do not carry damage rolls", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const utilityDamage = summary.issues.filter(
			(issue) => issue.code === "utility_name_with_damage",
		);
		expect(
			utilityDamage,
			`Utility entries with damage rolls:\n${utilityDamage
				.map((issue) => `- ${issue.dataset}:${issue.entryName ?? issue.entryId}`)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("every castable exposes a resolution mechanic (attack/save/healing)", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const missingResolution = summary.issues.filter(
			(issue) =>
				issue.code === "missing_resolution" || issue.code === "missing_mechanics",
		);
		expect(
			missingResolution,
			`Castable entries without resolution metadata:\n${missingResolution
				.map((issue) => `- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}`)
				.join("\n")}`,
		).toHaveLength(0);
	});
});
