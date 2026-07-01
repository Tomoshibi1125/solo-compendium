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
				"artifacts",
				"backgrounds",
				"conditions",
				"equipment",
				"feats",
				"fighting_styles",
				"items",
				"jobs",
				"locations",
				"pantheon",
				"paths",
				"powers",
				"regents",
				"relics",
				"runes",
				"shadow_soldiers",
				"sigils",
				"skills",
				"spells",
				"tattoos",
				"techniques",
				"vehicles",
			]),
		);

		const report = formatCompendiumAuditReport(summary);
		expect(report).toContain("COMPENDIUM AUDIT START");
		expect(report).toContain("COMPENDIUM AUDIT COMPLETE");
	}, 15000);

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
		const missingMeta = summary.issues.filter(
			(issue) =>
				issue.code === "missing_source_book" ||
				issue.code === "missing_description",
		);
		expect(
			missingMeta,
			`Entries missing required metadata:\n${missingMeta
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}`,
				)
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
				.map(
					(issue) => `- ${issue.dataset}:${issue.entryName ?? issue.entryId}`,
				)
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
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.entryName ?? issue.entryId}: ${issue.message}`,
				)
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
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.entryName ?? issue.entryId}: ${issue.message}`,
				)
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
				.map(
					(issue) => `- ${issue.dataset}:${issue.entryName ?? issue.entryId}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("every castable exposes a resolution mechanic (attack/save/healing)", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const missingResolution = summary.issues.filter(
			(issue) =>
				issue.code === "missing_resolution" ||
				issue.code === "missing_mechanics",
		);
		expect(
			missingResolution,
			`Castable entries without resolution metadata:\n${missingResolution
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("equipment and relic mechanics expose DDB-style weapon/armor metadata", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const equipmentMechanicalIssues = summary.issues.filter((issue) =>
			[
				"missing_weapon_type",
				"missing_weapon_damage",
				"missing_weapon_damage_type",
				"missing_armor_class",
				"missing_armor_type",
				"invalid_charges",
				"mechanically_thin_equipment",
			].includes(issue.code),
		);
		expect(
			equipmentMechanicalIssues,
			`Equipment/relic mechanics issues:\n${equipmentMechanicalIssues
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it('every entry uses the single canonical source_book "Rift Ascendant Canon"', async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const offenders = summary.issues.filter(
			(issue) => issue.code === "invalid_source_book",
		);
		expect(
			offenders,
			`Entries with a non-RA-Canon source_book:\n${offenders
				.map(
					(issue) =>
						`- ${issue.dataset}: ${issue.entryName ?? issue.entryId}: ${issue.message}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("vehicles, deities, feats, backgrounds, conditions, skills, sigils, tattoos, fighting styles, and shadow soldiers are structurally complete", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		const completenessCodes = new Set([
			// vehicles
			"missing_vehicle_type",
			"missing_size",
			"missing_speed",
			"missing_armor_class",
			"missing_hit_points",
			"missing_crew_positions",
			"unresolved_anomaly_id",
			// deities
			"missing_deity_rank",
			"missing_deity_directive",
			"missing_deity_sigil",
			"missing_deity_manifestation",
			"missing_deity_home_realm",
			"missing_deity_portfolio",
			"missing_deity_specializations",
			"missing_deity_dogma",
			// feats
			"missing_feat_effects",
			"malformed_feat_prerequisites",
			// backgrounds
			"missing_skill_proficiencies",
			"missing_starting_equipment",
			"missing_background_feature",
			// conditions
			"missing_condition_effects",
			// skills
			"missing_skill_ability",
			// sigils/tattoos
			"missing_passive_bonuses",
			"missing_can_inscribe_on",
			"missing_tattoo_mechanics",
			"missing_tags",
			"tattoo_field_contradiction",
			// item coherence (Phase 0)
			"item_injected_template",
			// de-vague (Phase 1)
			"vague_catchall_name",
			// SRD 5.1 completeness (Phase 1b)
			"srd_completeness",
			// de-boilerplate + effect depth (Phase 2, enforced tier by tier)
			"boilerplate_repetition",
			"shallow_magic_effect",
			// fighting styles
			"malformed_fighting_style_prerequisites",
			// shadow soldiers
			"missing_shadow_rank",
			"missing_shadow_role",
			"missing_shadow_hp",
			"missing_shadow_ac",
			"missing_shadow_traits",
			"missing_shadow_actions",
			// jobs (5e class chassis)
			"job_missing_hit_die",
			"job_missing_primary_ability",
			"job_missing_saving_throws",
			"job_missing_armor_proficiencies",
			"job_missing_weapon_proficiencies",
			"job_missing_skill_choices",
			"job_missing_features",
			"job_spellcasting_missing_ability",
			// paths (5e subclass)
			"path_missing_parent_job",
			"path_missing_features",
			"path_feature_incomplete",
		]);
		const completenessIssues = summary.issues.filter((issue) =>
			completenessCodes.has(issue.code),
		);
		expect(
			completenessIssues,
			`Category completeness gaps:\n${completenessIssues
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}: ${issue.message}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it('has zero errors of any kind (the "100% fleshed out" gate)', async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		expect(
			summary.errors,
			`Compendium audit must surface zero errors. Found ${summary.errors.length}:\n${summary.errors
				.slice(0, 30)
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}: ${issue.message}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});

	it("has zero warnings of any kind (warnings are promoted to gating signals)", async () => {
		const summary = await runCompendiumAudit(staticDataProvider);
		expect(
			summary.warnings,
			`Compendium audit must surface zero warnings. Found ${summary.warnings.length}:\n${summary.warnings
				.slice(0, 30)
				.map(
					(issue) =>
						`- ${issue.dataset}:${issue.code} ${issue.entryName ?? issue.entryId}: ${issue.message}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	});
});

// Guards against a silent false-green: if `items`/`equipment` are ever dropped
// from `boilerplateEnforcedDatasets`, these synthetic pooled/shallow entries
// stop being flagged and the test fails. (Negative-probe made permanent.)
describe("de-boilerplate enforcement covers items + equipment", () => {
	type Entry = Record<string, unknown> & { id: string; name: string };
	const allGetters = [
		"getAnomalies",
		"getArtifacts",
		"getBackgrounds",
		"getConditions",
		"getFeats",
		"getFightingStyles",
		"getItems",
		"getJobs",
		"getLocations",
		"getPantheon",
		"getPaths",
		"getPowers",
		"getRegents",
		"getRelics",
		"getRunes",
		"getShadowSoldiers",
		"getSigils",
		"getSkills",
		"getSpells",
		"getTattoos",
		"getTechniques",
		"getVehicles",
	] as const;

	const makeProvider = (
		overrides: Partial<
			Record<(typeof allGetters)[number], () => Promise<Entry[]>>
		>,
	) => {
		const provider: Record<string, (search?: string) => Promise<Entry[]>> = {};
		for (const key of allGetters) provider[key] = async () => [];
		for (const [key, fn] of Object.entries(overrides))
			provider[key] = fn as () => Promise<Entry[]>;
		return provider as unknown as Parameters<typeof runCompendiumAudit>[0];
	};

	// item_type "misc" -> items dataset; "weapon" -> equipment dataset.
	const base = (over: Partial<Entry>): Entry => ({
		id: `synthetic-${Math.random().toString(36).slice(2)}`,
		name: `Synthetic ${Math.random().toString(36).slice(2)}`,
		source_book: "Rift Ascendant Canon",
		rarity: "uncommon",
		...over,
	});

	it("flags pooled narrative under both items and equipment", async () => {
		const pooledDesc = "Deliberately pooled narrative shared by three entries.";
		const pooledFlavor = "A deliberately pooled flavor line shared three ways.";
		const items: Entry[] = [
			// 3 items-dataset entries sharing a description -> boilerplate on items.
			...[0, 1, 2].map(() =>
				base({ item_type: "misc", description: pooledDesc }),
			),
			// 3 equipment-dataset entries sharing a flavor -> boilerplate on equipment.
			...[0, 1, 2].map((i) =>
				base({
					item_type: "weapon",
					description: `Unique weapon description ${i}.`,
					flavor: pooledFlavor,
				}),
			),
		];
		const summary = await runCompendiumAudit(
			makeProvider({ getItems: async () => items }),
		);
		const boiler = summary.issues.filter(
			(x) => x.code === "boilerplate_repetition",
		);
		expect(boiler.some((x) => x.dataset === "items")).toBe(true);
		expect(boiler.some((x) => x.dataset === "equipment")).toBe(true);
	});

	it("flags a flat +N-only effect under both items and equipment", async () => {
		const items: Entry[] = [
			base({
				item_type: "misc",
				description: "A unique misc description for the shallow probe.",
				effects: { passive: ["+2 to a chosen check."] },
			}),
			base({
				item_type: "weapon",
				description: "A unique weapon description for the shallow probe.",
				effects: { passive: ["+2 luck."] },
			}),
		];
		const summary = await runCompendiumAudit(
			makeProvider({ getItems: async () => items }),
		);
		const shallow = summary.issues.filter(
			(x) => x.code === "shallow_magic_effect",
		);
		expect(shallow.some((x) => x.dataset === "items")).toBe(true);
		expect(shallow.some((x) => x.dataset === "equipment")).toBe(true);
	});

	it("flags pooled narrative under sigils and tattoos", async () => {
		const pooledHistory = "A deliberately pooled sigil/tattoo history line.";
		const sigils: Entry[] = [0, 1, 2].map((i) =>
			base({
				name: `Synthetic Sigil ${i}`,
				description: `Unique sigil description ${i}.`,
				lore: { history: pooledHistory },
			}),
		);
		const tattoos: Entry[] = [0, 1, 2].map((i) =>
			base({
				name: `Synthetic Tattoo ${i}`,
				description: `Unique tattoo description ${i}.`,
				lore: { history: pooledHistory },
			}),
		);
		const summary = await runCompendiumAudit(
			makeProvider({
				getSigils: async () => sigils,
				getTattoos: async () => tattoos,
			}),
		);
		const boiler = summary.issues.filter(
			(x) => x.code === "boilerplate_repetition",
		);
		expect(boiler.some((x) => x.dataset === "sigils")).toBe(true);
		expect(boiler.some((x) => x.dataset === "tattoos")).toBe(true);
	});
});
