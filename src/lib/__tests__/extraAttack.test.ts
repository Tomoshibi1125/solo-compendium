import { describe, expect, it } from "vitest";
import { computeAttacksPerAction } from "@/lib/featEffectParser";

describe("computeAttacksPerAction (Extra Attack DDB parity)", () => {
	describe("base case", () => {
		it("returns 1 attack for a level-1 character with no job", () => {
			expect(computeAttacksPerAction(null, 1, [])).toBe(1);
		});

		it("returns 1 attack for a non-martial job at any level", () => {
			expect(computeAttacksPerAction("Mage", 1, [])).toBe(1);
			expect(computeAttacksPerAction("Mage", 5, [])).toBe(1);
			expect(computeAttacksPerAction("Mage", 20, [])).toBe(1);
		});

		it("returns 1 attack for a martial job below level 5", () => {
			expect(computeAttacksPerAction("Destroyer", 4, [])).toBe(1);
			expect(computeAttacksPerAction("Berserker", 1, [])).toBe(1);
		});
	});

	describe("martial Extra Attack at level 5", () => {
		it.each([
			"Destroyer",
			"Berserker",
			"Striker",
			"Holy Knight",
			"Stalker",
		])("grants 2 attacks to %s at level 5", (job) => {
			expect(computeAttacksPerAction(job, 5, [])).toBe(2);
		});

		it("matches case-insensitively", () => {
			expect(computeAttacksPerAction("DESTROYER", 5, [])).toBe(2);
			expect(computeAttacksPerAction("destroyer", 5, [])).toBe(2);
		});
	});

	describe("Destroyer high-tier scaling (Fighter-like)", () => {
		it("grants 3 attacks at level 11", () => {
			expect(computeAttacksPerAction("Destroyer", 11, [])).toBe(3);
		});

		it("grants 4 attacks at level 20", () => {
			expect(computeAttacksPerAction("Destroyer", 20, [])).toBe(4);
		});

		it("does NOT extend to other martial jobs at level 11+", () => {
			expect(computeAttacksPerAction("Berserker", 11, [])).toBe(2);
			expect(computeAttacksPerAction("Berserker", 20, [])).toBe(2);
		});
	});

	describe("Regent unlocks", () => {
		it("Steel regent grants 2 attacks even on a non-martial job at level 1", () => {
			expect(computeAttacksPerAction("Mage", 1, ["Steel"])).toBe(2);
		});

		it("Titan regent grants 2 attacks even on a non-martial job at level 1", () => {
			expect(computeAttacksPerAction("Mage", 1, ["Titan"])).toBe(2);
		});

		it("does not stack regent extra-attack with martial extra-attack", () => {
			// Destroyer L5 already has 2; steel does not bump to 3.
			expect(computeAttacksPerAction("Destroyer", 5, ["Steel"])).toBe(2);
		});

		it("respects the higher of regent vs Destroyer high-tier", () => {
			expect(computeAttacksPerAction("Destroyer", 11, ["Steel"])).toBe(3);
		});
	});

	describe("Extra Attack feature flag", () => {
		it("grants 2 attacks when hasExtraAttack=true on a non-martial caster", () => {
			expect(computeAttacksPerAction("Mage", 1, [], true)).toBe(2);
		});

		it("does not reduce already-higher attack counts", () => {
			expect(computeAttacksPerAction("Destroyer", 11, [], true)).toBe(3);
		});

		it("is idempotent with martial extra attack at L5", () => {
			expect(computeAttacksPerAction("Destroyer", 5, [], true)).toBe(2);
		});
	});
});
