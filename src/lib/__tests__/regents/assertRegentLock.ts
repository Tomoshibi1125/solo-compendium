import { expect } from "vitest";
import { canonicalReviewBlockers } from "@/data/compendium/canon-review-blockers";
import { regents } from "@/data/compendium/regents";
import { REGENT_GRANTS, type RegentGrantProfile } from "@/lib/regentGrants";

const VALID_TYPES = new Set([
	"action",
	"bonus-action",
	"reaction",
	"passive",
	"active",
]);
const VALID_FREQUENCIES = new Set([
	"at-will",
	"short-rest",
	"long-rest",
	"once-per-day",
	"once-per-long-rest",
]);
const VALID_TRACKING = new Set(["uses", "resource", "manual"]);
const LOCKED_LEVELS = [1, 2, 3, 4, 5, 7, 10] as const;
const HIGH_TIER_PATTERN =
	/absolute|eternal|cosmic|supreme|regent|god|omnipotence|transcendence|apocalypse|authority/i;

export interface RegentLockExpectation {
	id: keyof typeof REGENT_GRANTS;
	theme: string;
	quest: string;
	prerequisiteJob?: string;
	powerLevel: number;
	featureCount: number;
	frequencies: readonly string[];
	progression: Record<(typeof LOCKED_LEVELS)[number], readonly string[]>;
	grants: Readonly<RegentGrantProfile>;
}

export function assertRegentLock(expected: RegentLockExpectation): void {
	const regent = regents.find((entry) => entry.id === expected.id);
	expect(regent).toBeDefined();
	if (!regent) return;

	expect(regent.theme).toBe(expected.theme);
	expect(regent.requirements?.quest_completion).toBe(expected.quest);
	expect(regent.requirements?.warden_verification).toBe(true);
	expect(regent.requirements?.prerequisite_job).toBe(expected.prerequisiteJob);
	expect(regent.requirements?.power_level).toBe(expected.powerLevel);
	expect(REGENT_GRANTS[expected.id]).toEqual(expected.grants);

	const features = regent.class_features ?? [];
	const progressionFeatureCount = Object.values(
		regent.progression_table ?? {},
	).reduce((total, row) => total + (row.features_gained?.length ?? 0), 0);
	expect(features).toHaveLength(progressionFeatureCount);
	expect(new Set(features.map((feature) => feature.id)).size).toBe(
		features.length,
	);
	for (const feature of features) {
		expect(feature.id).toBe(
			`regent-feature:${regent.id}:${feature.level}:${feature.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "")}`,
		);
		expect(feature.name.trim().length).toBeGreaterThan(0);
		expect(feature.description.trim().length).toBeGreaterThan(0);
		expect(VALID_TYPES.has(feature.type)).toBe(true);
		expect(feature.provenance?.sourcePath).toBe(
			"src/data/compendium/regents.ts",
		);
		expect(["source-backed", "review-blocked"]).toContain(feature.canonStatus);
		if (feature.frequency) {
			expect(VALID_FREQUENCIES.has(feature.frequency)).toBe(true);
		}
		if (feature.tracking) {
			expect(VALID_TRACKING.has(feature.tracking)).toBe(true);
		}
		if (feature.canonStatus === "review-blocked") {
			expect(
				canonicalReviewBlockers.some(
					(blocker) => blocker.id === feature.reviewBlockerId,
				),
			).toBe(true);
		}
	}

	const frequencies = Array.from(
		new Set(features.map((feature) => feature.frequency).filter(Boolean)),
	).sort();
	expect(frequencies).toEqual([...expected.frequencies].sort());

	for (const level of LOCKED_LEVELS) {
		expect(regent.progression_table?.[level]?.features_gained).toEqual(
			expected.progression[level],
		);
		expect(
			features
				.filter((feature) => feature.level === level)
				.map((feature) => feature.name),
		).toEqual(expected.progression[level]);
	}

	const highTierText = [
		regent.description,
		...(regent.progression_table?.[20]?.features_gained ?? []),
		...(regent.progression_table?.[10]?.features_gained ?? []),
	]
		.filter(Boolean)
		.join(" ");
	expect(highTierText).toMatch(HIGH_TIER_PATTERN);
}
