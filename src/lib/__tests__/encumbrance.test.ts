/**
 * Encumbrance regression tests.
 *
 * Locks in the Rift Ascendant carrying-capacity formula and tier ladder:
 *   capacity      = STR * 15
 *   unencumbered  ≤ 33% of capacity
 *   light         ≤ 66%
 *   medium        ≤ 100%
 *   heavy         ≤ 200%   (speed −10)
 *   overloaded    > 200%   (speed −20)
 *
 * This file previously pinned 5e's OPTIONAL variant thresholds (5×/10×/15×
 * STR) that `computeEncumbrance` used to apply on its own — but the sheet
 * rendered the lenient percentage bands, so engine and UI disagreed about
 * whether a loaded character was slowed (Jul 18 audit). RA keeps the lenient
 * model by design; both entry points now derive from `encumbranceTierForWeight`
 * (see encumbranceParity.test.ts for the cross-stack agreement guard).
 *
 * Plus the container weight rules, unchanged:
 *   - Inactive container: 0 weight, contents ignored.
 *   - Magic container (ignoreContentsWeight): contents ignored.
 *   - Container itself always counts unless inactive.
 */
import { describe, expect, it } from "vitest";
import { computeEncumbrance } from "@/lib/characterEngine";

interface EquipmentInstanceLite {
	id: string;
	name: string;
	type: "armor" | "weapon" | "accessory" | "consumable" | "tool" | "other";
	isEquipped: boolean;
	weight?: number;
	isContainer?: boolean;
	isActive?: boolean;
	ignoreContentsWeight?: boolean;
	containerId?: string | null;
}

const item = (
	overrides: Partial<EquipmentInstanceLite> = {},
): EquipmentInstanceLite =>
	({
		id: overrides.id ?? "i",
		name: overrides.name ?? "Item",
		type: overrides.type ?? "other",
		isEquipped: overrides.isEquipped ?? true,
		weight: overrides.weight,
		isContainer: overrides.isContainer,
		isActive: overrides.isActive,
		ignoreContentsWeight: overrides.ignoreContentsWeight,
		containerId: overrides.containerId,
	}) as EquipmentInstanceLite;

describe("computeEncumbrance — capacity formula", () => {
	it("capacity = STR * 15", () => {
		// Type assertion safe: computeEncumbrance only accesses the fields
		// declared on EquipmentInstanceLite.
		const result = computeEncumbrance(10, [] as never[]);
		expect(result.capacity).toBe(150);
	});

	it("STR 18 has 270 lb capacity", () => {
		const result = computeEncumbrance(18, [] as never[]);
		expect(result.capacity).toBe(270);
	});

	it("returns 0 weight for empty inventory", () => {
		const result = computeEncumbrance(10, [] as never[]);
		expect(result.currentWeight).toBe(0);
		expect(result.tier).toBe("unencumbered");
	});
});

describe("computeEncumbrance — tier thresholds (STR 10, capacity 150)", () => {
	it("0 lb is unencumbered", () => {
		const r = computeEncumbrance(10, [] as never[]);
		expect(r.tier).toBe("unencumbered");
	});

	it("49 lb (≤33%) is unencumbered", () => {
		const r = computeEncumbrance(10, [item({ weight: 49 }) as never]);
		expect(r.currentWeight).toBe(49);
		expect(r.tier).toBe("unencumbered");
	});

	it("60 lb (≤66%) is a light load", () => {
		const r = computeEncumbrance(10, [item({ weight: 60 }) as never]);
		expect(r.tier).toBe("light");
	});

	it("120 lb (≤100%) is a medium load — still no speed penalty", () => {
		const r = computeEncumbrance(10, [item({ weight: 120 }) as never]);
		expect(r.tier).toBe("medium");
	});

	it("151 lb (just over capacity) becomes heavy", () => {
		const r = computeEncumbrance(10, [item({ weight: 151 }) as never]);
		expect(r.tier).toBe("heavy");
	});

	it("300 lb (exactly 200%) is still heavy", () => {
		const r = computeEncumbrance(10, [item({ weight: 300 }) as never]);
		expect(r.tier).toBe("heavy");
	});

	it("301 lb (>200%) is overloaded", () => {
		const r = computeEncumbrance(10, [item({ weight: 301 }) as never]);
		expect(r.tier).toBe("overloaded");
	});
});

describe("computeEncumbrance — container rules", () => {
	it("inactive container contributes 0 weight and skips its contents", () => {
		const r = computeEncumbrance(10, [
			item({
				id: "pack",
				weight: 5,
				isContainer: true,
				isActive: false,
			}) as never,
			item({ id: "rock-1", weight: 30, containerId: "pack" }) as never,
			item({ id: "rock-2", weight: 30, containerId: "pack" }) as never,
		]);
		// Pack itself is inactive (0) and its 60 lb of contents are ignored.
		expect(r.currentWeight).toBe(0);
		expect(r.tier).toBe("unencumbered");
	});

	it("magic container (ignoreContentsWeight) ignores contents but still has its own weight", () => {
		const r = computeEncumbrance(10, [
			item({
				id: "bag-of-holding",
				weight: 15,
				isContainer: true,
				ignoreContentsWeight: true,
				isActive: true,
			}) as never,
			item({
				id: "rock",
				weight: 200,
				containerId: "bag-of-holding",
			}) as never,
		]);
		// Bag of holding: 15 lb. Contents ignored. Total = 15.
		expect(r.currentWeight).toBe(15);
	});

	it("active mundane container contributes own weight AND its contents", () => {
		const r = computeEncumbrance(10, [
			item({
				id: "backpack",
				weight: 5,
				isContainer: true,
				isActive: true,
			}) as never,
			item({ id: "rock", weight: 30, containerId: "backpack" }) as never,
		]);
		expect(r.currentWeight).toBe(35);
	});

	it("items without a container still count toward weight", () => {
		const r = computeEncumbrance(10, [
			item({ weight: 20 }) as never,
			item({ weight: 5 }) as never,
		]);
		expect(r.currentWeight).toBe(25);
	});

	it("items missing a weight don't crash (treated as 0)", () => {
		const r = computeEncumbrance(10, [
			item({ weight: undefined }) as never,
			item({ weight: 10 }) as never,
		]);
		expect(r.currentWeight).toBe(10);
	});
});

describe("computeEncumbrance — STR scaling", () => {
	it("higher STR → higher thresholds (30 lb is nothing to STR 18)", () => {
		// STR 18 → capacity 270; 30 lb is ~11%.
		const r = computeEncumbrance(18, [item({ weight: 30 }) as never]);
		expect(r.tier).toBe("unencumbered");
	});

	it("the same 50-lb load lands in different tiers by STR", () => {
		// STR 8 → capacity 120, so 50 lb is ~42% → light.
		expect(computeEncumbrance(8, [item({ weight: 50 }) as never]).tier).toBe(
			"light",
		);
		// STR 18 → capacity 270, so 50 lb is ~19% → unencumbered.
		expect(computeEncumbrance(18, [item({ weight: 50 }) as never]).tier).toBe(
			"unencumbered",
		);
	});

	it("STR 8 with 121 lb (just over its 120 capacity) is heavy", () => {
		const r = computeEncumbrance(8, [item({ weight: 121 }) as never]);
		expect(r.tier).toBe("heavy");
	});

	it("STR 8 with 241 lb (>200% of capacity) is overloaded", () => {
		const r = computeEncumbrance(8, [item({ weight: 241 }) as never]);
		expect(r.tier).toBe("overloaded");
	});
});
