/**
 * Encumbrance regression tests (DDB / variant-rule parity).
 *
 * Locks in the Rift Ascendant carrying-capacity formula and tier
 * thresholds:
 *   capacity        = STR * 15
 *   encumbered      > STR * 5
 *   heavily-enc.    > STR * 10
 *   over-capacity   > STR * 15
 *
 * Plus the container weight rules:
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
		expect(result.tier).toBe("normal");
	});
});

describe("computeEncumbrance — tier thresholds (STR 10)", () => {
	// STR 10 → encumbered > 50, heavily > 100, over > 150
	it("0 lb is normal", () => {
		const r = computeEncumbrance(10, [] as never[]);
		expect(r.tier).toBe("normal");
	});

	it("exactly 50 lb (STR*5) is still normal", () => {
		const r = computeEncumbrance(10, [item({ weight: 50 }) as never]);
		expect(r.currentWeight).toBe(50);
		expect(r.tier).toBe("normal");
	});

	it("51 lb (just over STR*5) is encumbered", () => {
		const r = computeEncumbrance(10, [item({ weight: 51 }) as never]);
		expect(r.tier).toBe("encumbered");
	});

	it("100 lb (exactly STR*10) is encumbered", () => {
		const r = computeEncumbrance(10, [item({ weight: 100 }) as never]);
		expect(r.tier).toBe("encumbered");
	});

	it("101 lb is heavily-encumbered", () => {
		const r = computeEncumbrance(10, [item({ weight: 101 }) as never]);
		expect(r.tier).toBe("heavily-encumbered");
	});

	it("150 lb (exactly STR*15) is heavily-encumbered (still within capacity)", () => {
		const r = computeEncumbrance(10, [item({ weight: 150 }) as never]);
		expect(r.tier).toBe("heavily-encumbered");
	});

	it("151 lb is over-capacity", () => {
		const r = computeEncumbrance(10, [item({ weight: 151 }) as never]);
		expect(r.tier).toBe("over-capacity");
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
		expect(r.tier).toBe("normal");
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
	it("higher STR → higher thresholds (no tier at 30 lb for STR 18)", () => {
		const r = computeEncumbrance(18, [item({ weight: 30 }) as never]);
		// STR 18: encumbered > 90, so 30 is normal.
		expect(r.tier).toBe("normal");
	});

	it("STR 8 makes a 50-lb load over-capacity (STR*15 = 120 → 50 is encumbered)", () => {
		const r = computeEncumbrance(8, [item({ weight: 50 }) as never]);
		// STR 8: STR*5=40, STR*10=80. 50 > 40 → encumbered.
		expect(r.tier).toBe("encumbered");
	});

	it("STR 8 with 81 lb hits heavily-encumbered", () => {
		const r = computeEncumbrance(8, [item({ weight: 81 }) as never]);
		expect(r.tier).toBe("heavily-encumbered");
	});

	it("STR 8 with 121 lb hits over-capacity", () => {
		const r = computeEncumbrance(8, [item({ weight: 121 }) as never]);
		expect(r.tier).toBe("over-capacity");
	});
});
