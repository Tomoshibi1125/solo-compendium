import { describe, expect, it } from "vitest";
import {
	applyLongRestCharges,
	applyShortRestCharges,
	computeCrossClassUses,
	computePowerUses,
	computeTechniqueUses,
	getRarityBonus,
	normalizeRecharge,
} from "@/lib/perRestCharges";

const character = {
	level: 7,
	proficiencyBonus: 3,
	primaryStatModifier: 4,
};

describe("per-rest charge helpers", () => {
	it("applies the locked cross-class formula with rarity bonus", () => {
		expect(
			computeCrossClassUses({
				proficiencyBonus: 3,
				primaryStatModifier: 4,
				rarity: "legendary",
			}),
		).toBe(10);
		expect(
			computeCrossClassUses({
				proficiencyBonus: 2,
				primaryStatModifier: -5,
				rarity: "common",
			}),
		).toBe(1);
	});

	it("locks rarity bonus ladder", () => {
		expect(getRarityBonus("common")).toBe(0);
		expect(getRarityBonus("uncommon")).toBe(0);
		expect(getRarityBonus("rare")).toBe(1);
		expect(getRarityBonus("very_rare")).toBe(2);
		expect(getRarityBonus("very rare")).toBe(2);
		expect(getRarityBonus("legendary")).toBe(3);
	});

	it("normalizes per-rest cadence strings", () => {
		expect(normalizeRecharge("short rest")).toBe("short-rest");
		expect(normalizeRecharge("long-rest")).toBe("long-rest");
		expect(normalizeRecharge("once-per-day")).toBe("daily");
		expect(normalizeRecharge("at-will")).toBe("none");
	});

	it("computes native power uses from limitations", () => {
		expect(
			computePowerUses(
				{ limitations: { uses: "3/long rest", recharge: "long-rest" } },
				character,
			),
		).toEqual({
			abilityKind: "power",
			usesMax: 3,
			recharge: "long-rest",
			isAtWill: false,
		});
	});

	it("computes native technique uses from proficiency formulas", () => {
		expect(
			computeTechniqueUses(
				{ limitations: { uses_per_rest: "proficiency bonus + 2" } },
				character,
			),
		).toEqual({
			abilityKind: "technique",
			usesMax: 5,
			recharge: "none",
			isAtWill: false,
		});
	});

	it("treats at-will abilities as unlimited with no automatic recharge", () => {
		expect(
			computePowerUses({ limitations: { uses: "At-Will" } }, character),
		).toEqual({
			abilityKind: "power",
			usesMax: null,
			recharge: "none",
			isAtWill: true,
		});
	});

	it("forces cross-class adapted abilities to long-rest charges", () => {
		expect(
			computeTechniqueUses(
				{ limitations: { uses: "At-Will" }, frequency: "short-rest" },
				{
					...character,
					isCrossClassAdaptation: true,
					runeRarity: "rare",
				},
			),
		).toEqual({
			abilityKind: "technique",
			usesMax: 8,
			recharge: "long-rest",
			isAtWill: false,
		});
	});

	it("honors Regent ability frequency for native non-cross-class abilities", () => {
		expect(
			computePowerUses(
				{ uses_per_rest: 1, frequency: "once-per-day" },
				character,
			),
		).toEqual({
			abilityKind: "power",
			usesMax: 1,
			recharge: "daily",
			isAtWill: false,
		});
	});

	it("recovers only short-rest and encounter pools on short rest", () => {
		const pools = [
			{ id: "short", current: 0, max: 2, recharge: "short-rest" as const },
			{ id: "long", current: 0, max: 2, recharge: "long-rest" as const },
			{ id: "enc", current: 0, max: 1, recharge: "encounter" as const },
			{ id: "none", current: 0, max: 1, recharge: "none" as const },
		];

		expect(applyShortRestCharges(pools)).toEqual([
			{ id: "short", current: 2, max: 2, recharge: "short-rest" },
			{ id: "long", current: 0, max: 2, recharge: "long-rest" },
			{ id: "enc", current: 1, max: 1, recharge: "encounter" },
			{ id: "none", current: 0, max: 1, recharge: "none" },
		]);
	});

	it("recovers short-rest, long-rest, encounter, and daily pools on long rest", () => {
		const pools = [
			{ id: "short", current: 0, max: 2, recharge: "short-rest" as const },
			{ id: "long", current: 0, max: 2, recharge: "long-rest" as const },
			{ id: "daily", current: 0, max: 1, recharge: "daily" as const },
			{ id: "none", current: 0, max: 1, recharge: "none" as const },
		];

		expect(applyLongRestCharges(pools)).toEqual([
			{ id: "short", current: 2, max: 2, recharge: "short-rest" },
			{ id: "long", current: 2, max: 2, recharge: "long-rest" },
			{ id: "daily", current: 1, max: 1, recharge: "daily" },
			{ id: "none", current: 0, max: 1, recharge: "none" },
		]);
	});
});
