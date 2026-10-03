import { describe, expect, it } from "vitest";
import { resolveHarvestCheck } from "@/lib/harvestingRules";

describe("M2 harvesting rules", () => {
	it("keeps the fixed core, bulk, and precision checks", () => {
		expect(resolveHarvestCheck("core", "S")).toMatchObject({
			dc: 15,
			durationMinutes: 1,
			grade: "Regent",
		});
		expect(
			["E", "D", "C", "B", "A"].map(
				(rank) =>
					resolveHarvestCheck("bulk", rank as "E" | "D" | "C" | "B" | "A").dc,
			),
		).toEqual([10, 12, 15, 18, 21]);
		expect(
			["E", "D", "C", "B"].map(
				(rank) =>
					resolveHarvestCheck("precision", rank as "E" | "D" | "C" | "B").dc,
			),
		).toEqual([12, 15, 18, 21]);
	});

	it("does not silently fix an authored 21+ outcome", () => {
		expect(() => resolveHarvestCheck("bulk", "S")).toThrow(/Warden-defined/);
		expect(() => resolveHarvestCheck("precision", "A", 20)).toThrow(
			/Warden-defined/,
		);
		expect(resolveHarvestCheck("precision", "A", 24).dc).toBe(24);
		expect(resolveHarvestCheck("bulk", "S", 25).dc).toBe(25);
		expect(() => resolveHarvestCheck("core", "C", 19)).toThrow(/DC 15/);
	});
});
