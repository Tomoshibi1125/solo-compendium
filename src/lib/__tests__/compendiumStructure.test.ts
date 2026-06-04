import { describe, expect, it } from "vitest";
import { items_gap_fill } from "@/data/compendium/items-gap-fill";
import { jobs } from "@/data/compendium/jobs";
import { paths } from "@/data/compendium/paths";
import { staticDataProvider } from "@/data/compendium/providers";
import { regents } from "@/data/compendium/regents";

/**
 * Structural content-coverage audit (audit findings M11/M12/M13).
 *
 * These tests lock STRUCTURAL canon correctness — that every entry has the
 * fields the engine/UI depend on and that cross-references resolve. They do
 * NOT review prose/balance. They guard against regressions as content grows.
 */

describe("content structure — paths (M11)", () => {
	const jobIds = new Set(jobs.map((j) => j.id));

	it("every path references a real parent job id", () => {
		const orphans = paths
			.filter((p) => !jobIds.has(p.jobId))
			.map((p) => `${p.id} → jobId "${p.jobId}"`);
		expect(orphans, `orphan path jobIds: ${orphans.join(", ")}`).toEqual([]);
	});

	it("every path has an id, name, and at least one feature", () => {
		const bad = paths
			.filter(
				(p) =>
					!p.id ||
					!p.name ||
					!Array.isArray(p.features) ||
					p.features.length === 0,
			)
			.map((p) => p.id || p.name || "<unnamed>");
		expect(bad, `paths missing id/name/features: ${bad.join(", ")}`).toEqual(
			[],
		);
	});

	it("every path feature has a name and a numeric level", () => {
		const bad: string[] = [];
		for (const p of paths) {
			for (const f of p.features ?? []) {
				if (!f.name || typeof f.level !== "number") {
					bad.push(`${p.id}: ${f.name ?? "<unnamed feature>"}`);
				}
			}
		}
		expect(bad, `malformed path features: ${bad.join(", ")}`).toEqual([]);
	});
});

describe("content structure — regents (M12)", () => {
	it("every regent has id, name, hit_dice, primary_ability, and granted content", () => {
		// Caster regents use class_features[] (leveled); martial regents use
		// abilities[]/features[] (level-agnostic). Either constitutes the
		// gestalt overlay's granted content.
		const bad = regents
			.filter((r) => {
				const hasContent =
					(Array.isArray(r.class_features) && r.class_features.length > 0) ||
					(Array.isArray(r.abilities) && r.abilities.length > 0) ||
					(Array.isArray(r.features) && r.features.length > 0);
				return (
					!r.id ||
					!r.name ||
					!r.hit_dice ||
					!Array.isArray(r.primary_ability) ||
					r.primary_ability.length === 0 ||
					!hasContent
				);
			})
			.map((r) => r.id || r.name || "<unnamed>");
		expect(bad, `regents missing core class fields: ${bad.join(", ")}`).toEqual(
			[],
		);
	});

	it("every regent class_feature has a name and a numeric level (gestalt leveling)", () => {
		const bad: string[] = [];
		for (const r of regents) {
			for (const f of r.class_features ?? []) {
				if (!f.name || typeof f.level !== "number") {
					bad.push(`${r.id}: ${f.name ?? "<unnamed feature>"}`);
				}
			}
		}
		expect(bad, `malformed regent class_features: ${bad.join(", ")}`).toEqual(
			[],
		);
	});

	it("every regent hit_dice parses to a real die size (additive gestalt HP)", () => {
		const bad = regents
			.filter((r) => !/d(\d+)/i.test(r.hit_dice ?? ""))
			.map((r) => `${r.id}: "${r.hit_dice}"`);
		expect(bad, `unparseable regent hit_dice: ${bad.join(", ")}`).toEqual([]);
	});
});

describe("content structure — gap-fill items (M13)", () => {
	// RA uses a single canonical 8-tier rarity ladder (ascending), shared by
	// the `Item` type (src/data/compendium/items.ts) and the core-rules
	// `Rarity` union (src/types/core-rules.ts): epic is a distinct tier ABOVE
	// very-rare, mythic sits above legendary (top-end relics), and artifact
	// caps the ladder.
	const VALID_RARITIES = new Set([
		"common",
		"uncommon",
		"rare",
		"very-rare",
		"epic",
		"legendary",
		"mythic",
		"artifact",
	]);

	it("every gap-fill item has an id, name, valid rarity, and a type", () => {
		const bad = items_gap_fill
			.filter(
				(it) =>
					!it.id ||
					!it.name ||
					!it.rarity ||
					!VALID_RARITIES.has(String(it.rarity).toLowerCase()) ||
					!it.type,
			)
			.map(
				(it) => `${it.id || it.name}: rarity="${it.rarity}" type="${it.type}"`,
			);
		expect(
			bad,
			`gap-fill items with invalid rarity/type (${bad.length}): ${bad
				.slice(0, 10)
				.join(", ")}`,
		).toEqual([]);
	});

	it("gap-fill item ids are unique", () => {
		const ids = items_gap_fill.map((it) => it.id);
		const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
		expect(
			dupes,
			`duplicate gap-fill ids: ${dupes.slice(0, 10).join(", ")}`,
		).toEqual([]);
	});
});

describe("classes carry no rarity (jobs & paths are not items)", () => {
	// The provider must NOT fabricate a rarity from rank/tier for jobs/paths —
	// they are classes, not items. Verifies the normalized provider output, not
	// the raw data (raw data never had rarity; the bug was provider-injected).
	it("provider-normalized jobs expose no rarity", async () => {
		const entries = await staticDataProvider.getJobs();
		const withRarity = entries
			.filter((e) => e.rarity != null)
			.map((e) => `${e.name}: ${e.rarity}`);
		expect(withRarity, `jobs with rarity: ${withRarity.join(", ")}`).toEqual(
			[],
		);
	});

	it("provider-normalized paths expose no rarity", async () => {
		const entries = await staticDataProvider.getPaths();
		const withRarity = entries
			.filter((e) => e.rarity != null)
			.map((e) => `${e.name}: ${e.rarity}`);
		expect(withRarity, `paths with rarity: ${withRarity.join(", ")}`).toEqual(
			[],
		);
	});
});

describe("job skill-choice count is the canonical CHOOSE count (not the pool size)", () => {
	// The "Choose N skills" number must be the canonical per-job count, never the
	// size of the skill-options pool. Idol's pool is 18 but it chooses 4.
	const EXPECTED: Record<string, number> = { Idol: 4, Assassin: 4, Stalker: 3 };

	it("every job's skill_choice_count is in [1, pool] and matches canon", async () => {
		const entries = (await staticDataProvider.getJobs()) as Array<{
			name: string;
			skill_choice_count?: number | null;
			skill_choices?: string[] | null;
		}>;
		const bad: string[] = [];
		for (const j of entries) {
			const count = j.skill_choice_count;
			const pool = Array.isArray(j.skill_choices) ? j.skill_choices.length : 0;
			if (typeof count !== "number" || count < 1) {
				bad.push(`${j.name}: missing/invalid count=${count}`);
			} else if (pool > 0 && count > pool) {
				bad.push(`${j.name}: count ${count} > pool ${pool}`);
			}
			if (EXPECTED[j.name] !== undefined && count !== EXPECTED[j.name]) {
				bad.push(`${j.name}: count ${count} ≠ canon ${EXPECTED[j.name]}`);
			}
		}
		expect(bad, `skill_choice_count issues: ${bad.join("; ")}`).toEqual([]);
	});
});
