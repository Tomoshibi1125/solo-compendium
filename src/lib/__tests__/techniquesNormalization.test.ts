import { describe, expect, it } from "vitest";
import { techniques } from "@/data/compendium/techniques";

describe("techniques data normalization", () => {
	it("does not contain legacy stamina text anywhere", () => {
		expect(JSON.stringify(techniques)).not.toMatch(/Stamina/i);
	});

	it("uses power-style long-rest charges for every technique", () => {
		expect(techniques).toHaveLength(71);
		for (const technique of techniques) {
			expect(technique.uses_per_rest_formula).toBe("3/long rest");
			expect(technique.limitations.uses).toBe("3/long rest");
			expect(technique.limitations.recharge).toBe("long rest");
		}
	});

	it("does not expose activation cost fields", () => {
		for (const technique of techniques) {
			if (typeof technique.activation === "object") {
				expect(technique.activation).not.toHaveProperty("cost");
			}
		}
	});
});
