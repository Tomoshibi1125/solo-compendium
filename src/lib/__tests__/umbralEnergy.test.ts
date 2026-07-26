import { describe, expect, it } from "vitest";
import {
	umbralEnergyCost,
	umbralEnergyMax,
	umbralEnergyUsed,
} from "@/lib/umbralEnergy";

describe("umbralEnergy", () => {
	it("scales the capacity pool to full power (200) at level 20", () => {
		expect(umbralEnergyMax(1)).toBe(10);
		expect(umbralEnergyMax(4)).toBe(10);
		expect(umbralEnergyMax(5)).toBe(25);
		expect(umbralEnergyMax(8)).toBe(25);
		expect(umbralEnergyMax(12)).toBe(50);
		expect(umbralEnergyMax(16)).toBe(100);
		expect(umbralEnergyMax(17)).toBe(200);
		expect(umbralEnergyMax(20)).toBe(200);
	});

	it("occupies energy by rank (higher rank costs more)", () => {
		expect(umbralEnergyCost("S")).toBe(25);
		expect(umbralEnergyCost("A")).toBe(15);
		expect(umbralEnergyCost("e")).toBe(1);
		expect(umbralEnergyCost(null)).toBe(5);
		expect(umbralEnergyCost("???")).toBe(5);
	});

	it("sums used energy across currently-summoned ranks", () => {
		expect(umbralEnergyUsed(["S", "B", "B"])).toBe(45);
		expect(umbralEnergyUsed([])).toBe(0);
	});
});
