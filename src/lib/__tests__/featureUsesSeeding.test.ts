import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { calculateFeatureUses } from "@/lib/characterEngine";
import {
	buildFeatureUseModifiers,
	readFeatureUseMetadata,
	resolveFeatureRecharge,
	resolveFeatureUsesMax,
	resolveStoredFeatureRecharge,
} from "@/lib/featureUses";

// Representative ability spread used to resolve ability-modifier uses formulas.
// getAbilityModifier: (score - 10) / 2, floored. PRE 16 → +3, SENSE 14 → +2,
// INT 18 → +4.
const SAMPLE_ABILITIES = {
	STR: 12,
	AGI: 14,
	VIT: 13,
	INT: 18,
	SENSE: 14,
	PRE: 16,
} as const;

describe("calculateFeatureUses — ability-modifier formulas (Phase D)", () => {
	it("resolves a bare ability modifier from scores", () => {
		expect(calculateFeatureUses("PRE mod", 1, 2, SAMPLE_ABILITIES)).toBe(3);
		expect(calculateFeatureUses("SENSE mod", 1, 2, SAMPLE_ABILITIES)).toBe(2);
		expect(calculateFeatureUses("INT mod", 5, 3, SAMPLE_ABILITIES)).toBe(4);
	});

	it("resolves an ability modifier combined with constants and level", () => {
		expect(calculateFeatureUses("1 + PRE mod", 1, 2, SAMPLE_ABILITIES)).toBe(4);
		expect(calculateFeatureUses("5 * level", 3, 2, SAMPLE_ABILITIES)).toBe(15);
	});

	it("supports full ability names and the 'modifier' spelling", () => {
		expect(
			calculateFeatureUses("presence modifier", 1, 2, SAMPLE_ABILITIES),
		).toBe(3);
	});

	it("returns null when an ability formula has no scores (graceful for autoUpdate)", () => {
		expect(calculateFeatureUses("PRE mod", 1, 2)).toBeNull();
		expect(calculateFeatureUses("PRE mod", 1, 2, null)).toBeNull();
	});

	it("preserves existing non-ability behavior (regression guard)", () => {
		expect(calculateFeatureUses("level", 7, 3)).toBe(7);
		expect(calculateFeatureUses("proficiency bonus", 7, 3)).toBe(3);
		expect(calculateFeatureUses("2", 1, 2)).toBe(2);
		expect(calculateFeatureUses("level / 2", 6, 3)).toBe(3);
		expect(calculateFeatureUses(null, 1, 2)).toBeNull();
	});
});

describe("job classFeatures limited-use annotations (Phase D)", () => {
	const annotated = jobs.flatMap((job) =>
		(job.classFeatures ?? []).flatMap((cf) =>
			cf.uses
				? [{ job: job.name, name: cf.name, level: cf.level, uses: cf.uses }]
				: [],
		),
	);

	it("annotates the representative resource pools called out in the plan", () => {
		const names = new Set(annotated.map((a) => a.name));
		for (const expected of [
			"Impulse Rites", // Striker impulse pool
			"Flux Pool", // Esper flux pool
			"Hype", // Idol hype pool
			"Oath Sense", // Holy Knight channel
			"Receive Signal", // Herald signal pool
		]) {
			expect(names.has(expected)).toBe(true);
		}
	});

	it("every annotated uses formula resolves to a non-negative integer", () => {
		for (const cf of annotated) {
			const value = calculateFeatureUses(
				cf.uses.formula,
				Math.max(cf.level, 1),
				2,
				SAMPLE_ABILITIES,
			);
			expect(
				value,
				`${cf.job} / ${cf.name} (${cf.uses.formula})`,
			).not.toBeNull();
			expect(value ?? -1).toBeGreaterThanOrEqual(0);
		}
	});

	it("encodes the exact Task 5 resource unlocks, scaling, cadence, and capstones", () => {
		const feature = (jobId: string, name: string) => {
			const match = jobs
				.find((job) => job.id === jobId)
				?.classFeatures?.find((entry) => entry.name === name);
			if (!match?.uses) throw new Error(`Missing ${jobId} / ${name} uses`);
			return { ...match, uses: match.uses };
		};

		const flux = feature("esper", "Flux Pool");
		expect(flux.level).toBe(2);
		expect(resolveFeatureUsesMax(flux.uses, 2, 2, SAMPLE_ABILITIES)).toBe(2);
		expect(resolveFeatureRecharge(flux.uses, 2)).toBe("short-rest");

		const hype = feature("idol", "Hype");
		expect(hype.level).toBe(1);
		expect(resolveFeatureUsesMax(hype.uses, 1, 2, SAMPLE_ABILITIES)).toBe(3);
		expect(resolveFeatureRecharge(hype.uses, 4)).toBe("long-rest");
		expect(resolveFeatureRecharge(hype.uses, 5)).toBe("short-rest");
		const storedHype = readFeatureUseMetadata(
			buildFeatureUseModifiers(hype.uses, hype.name),
		);
		expect(resolveStoredFeatureRecharge(storedHype, 4)).toBe("long-rest");
		expect(resolveStoredFeatureRecharge(storedHype, 5)).toBe("short-rest");

		const shift = feature("summoner", "Entity Shift");
		expect(shift.level).toBe(2);
		expect(resolveFeatureUsesMax(shift.uses, 2, 2, SAMPLE_ABILITIES)).toBe(2);
		expect(resolveFeatureRecharge(shift.uses, 2)).toBe("short-rest");
		expect(
			resolveFeatureUsesMax(shift.uses, 20, 6, SAMPLE_ABILITIES),
		).toBeNull();
		expect(resolveFeatureRecharge(shift.uses, 20)).toBeNull();

		const biome = feature("summoner", "Biome Command");
		expect(biome.level).toBe(8);
		expect(resolveFeatureUsesMax(biome.uses, 8, 3, SAMPLE_ABILITIES)).toBe(1);
		expect(resolveFeatureUsesMax(biome.uses, 14, 5, SAMPLE_ABILITIES)).toBe(2);
		expect(
			resolveFeatureUsesMax(biome.uses, 20, 6, SAMPLE_ABILITIES),
		).toBeNull();
	});

	it("encodes the exact Task 6 formulas and recovery cadences", () => {
		const findFeature = (
			jobId: string,
			collection: "classFeatures" | "awakeningFeatures",
			name: string,
		) => {
			const match = jobs
				.find((job) => job.id === jobId)
				?.[collection]?.find((entry) => entry.name === name);
			if (!match) throw new Error(`Missing ${jobId} / ${name}`);
			return match;
		};

		for (const name of ["Borrowed Breath", "Zenith Mandate"]) {
			expect(findFeature("revenant", "classFeatures", name)).toMatchObject({
				uses: { formula: "1", recharge: "long-rest" },
				tracking: "uses",
			});
		}
		expect(
			findFeature("stalker", "awakeningFeatures", "Pursuit Burst"),
		).toMatchObject({
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		});
		expect(findFeature("stalker", "classFeatures", "Prey Lock")).toMatchObject({
			actionType: "Bonus action",
			tracking: "manual",
		});

		const assist = findFeature(
			"technomancer",
			"classFeatures",
			"Absolute Assist",
		);
		if (!assist.uses) throw new Error("Missing Absolute Assist uses");
		expect(resolveFeatureUsesMax(assist.uses, 7, 3, SAMPLE_ABILITIES)).toBe(4);
		expect(resolveFeatureRecharge(assist.uses, 7)).toBe("long-rest");

		const capacitor = findFeature(
			"technomancer",
			"classFeatures",
			"Spell Capacitor",
		);
		if (!capacitor.uses) throw new Error("Missing Spell Capacitor uses");
		expect(resolveFeatureUsesMax(capacitor.uses, 11, 4, SAMPLE_ABILITIES)).toBe(
			8,
		);
		expect(resolveFeatureRecharge(capacitor.uses, 11)).toBe("long-rest");
	});

	it("every annotated recharge is a valid rest cadence", () => {
		for (const cf of annotated) {
			expect(["short-rest", "long-rest"]).toContain(cf.uses.recharge);
		}
	});
});
