import { describe, expect, it } from "vitest";
import { regents as CANONICAL_REGENTS } from "@/data/compendium/regents";
import { ALL_REGENTS, canonicalRegentToPath } from "@/lib/regentDatabase";
import { CANONICAL_REGENT_IDS } from "@/lib/regentIdentity";
import { getRegentLeveledFeatures } from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";

describe("canonical Regent database projections", () => {
	it("contains exactly the twelve canonical projections in identity order", () => {
		expect(ALL_REGENTS).toHaveLength(12);
		expect(ALL_REGENTS.map((regent) => regent.id)).toEqual(
			CANONICAL_REGENT_IDS,
		);
		expect(ALL_REGENTS.some((regent) => regent.id === "shadow_regent")).toBe(
			false,
		);
	});

	it("preserves every direct Task 7 ledger row and its metadata", () => {
		const canonical = CANONICAL_REGENTS.find(
			(regent) => getRegentLeveledFeatures(regent).length > 0,
		);
		expect(canonical).toBeTruthy();
		if (!canonical) return;

		const ledger = getRegentLeveledFeatures(canonical);
		const path = canonicalRegentToPath(canonical);
		expect(path.features).toEqual(ledger);
		expect(path.features).toHaveLength(ledger.length);
		expect(path.features[0]).toMatchObject({
			id: ledger[0].id,
			level: ledger[0].level,
			canonStatus: ledger[0].canonStatus,
			provenance: ledger[0].provenance,
		});
		expect(path.abilities).toEqual(ledger.map((feature) => feature.name));
	});

	it("does not re-append raw feature or ability arrays", () => {
		const fixture = {
			id: "umbral_regent",
			name: "Ledger Fixture",
			class_features: [
				{
					id: "regent-feature:umbral_regent:1:echo",
					level: 1,
					name: "Echo",
					description: "First grant",
					type: "passive",
				},
				{
					id: "regent-feature:umbral_regent:5:echo",
					level: 5,
					name: "Echo",
					description: "Later improvement",
					type: "active",
				},
			],
			abilities: [
				{
					name: "Raw Ability",
					description: "Evidence only",
					type: "active",
				},
			],
			features: [
				{
					name: "Raw Feature",
					description: "Evidence only",
				},
			],
		} as Regent;

		const path = canonicalRegentToPath(fixture);
		expect(path.features.map((feature) => feature.id)).toEqual([
			"regent-feature:umbral_regent:1:echo",
			"regent-feature:umbral_regent:5:echo",
		]);
		expect(path.features.map((feature) => feature.level)).toEqual([1, 5]);
		expect(path.abilities).toEqual(["Echo", "Echo"]);
	});

	it("derives statThreshold from authored ability requirements, not unlock level", () => {
		const fixture = {
			id: "war_regent",
			name: "Requirement Fixture",
			class_features: [],
			regent_requirements: {
				level: 20,
				abilities: { STR: 15, PRE: 13 },
				quest_completion: "Complete the trial",
				warden_approval: true,
			},
		} as Regent;

		const path = canonicalRegentToPath(fixture);
		expect(path.requirements.statThreshold).toBe(15);
		expect(path.requirements.statThreshold).not.toBe(20);
		expect(path.requirements.questCompleted).toBe("Complete the trial");
	});
});
