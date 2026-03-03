import { describe, expect, it } from "vitest";
import {
	COMMON_CANTRIP_DICE,
	getCantripDamageFormula,
	getCantripDiceCount,
	scaleCantripDamage,
} from "@/lib/cantripScaling";

describe("Cantrip Damage Scaling", () => {
	it("returns 1 die at levels 1-4", () => {
		expect(getCantripDiceCount(1)).toBe(1);
		expect(getCantripDiceCount(4)).toBe(1);
	});

	it("returns 2 dice at levels 5-10", () => {
		expect(getCantripDiceCount(5)).toBe(2);
		expect(getCantripDiceCount(10)).toBe(2);
	});

	it("returns 3 dice at levels 11-16", () => {
		expect(getCantripDiceCount(11)).toBe(3);
		expect(getCantripDiceCount(16)).toBe(3);
	});

	it("returns 4 dice at levels 17-20", () => {
		expect(getCantripDiceCount(17)).toBe(4);
		expect(getCantripDiceCount(20)).toBe(4);
	});

	it("getCantripDamageFormula builds correct formula", () => {
		const result = getCantripDamageFormula(10, 5);
		expect(result.diceCount).toBe(2);
		expect(result.dieSize).toBe(10);
		expect(result.formula).toBe("2d10");
	});

	it("scaleCantripDamage parses and scales a base damage string", () => {
		expect(scaleCantripDamage("1d10", 1)).toBe("1d10");
		expect(scaleCantripDamage("1d10", 5)).toBe("2d10");
		expect(scaleCantripDamage("1d10", 11)).toBe("3d10");
		expect(scaleCantripDamage("1d10", 17)).toBe("4d10");
	});

	it("scaleCantripDamage handles d8 cantrips", () => {
		expect(scaleCantripDamage("1d8", 11)).toBe("3d8");
	});

	it("scaleCantripDamage returns original string for non-dice input", () => {
		expect(scaleCantripDamage("special", 5)).toBe("special");
	});

	it("COMMON_CANTRIP_DICE has expected cantrips", () => {
		expect(COMMON_CANTRIP_DICE["Fire Bolt"]).toBe(10);
		expect(COMMON_CANTRIP_DICE["Sacred Flame"]).toBe(8);
		expect(COMMON_CANTRIP_DICE["Toll the Dead"]).toBe(12);
		expect(COMMON_CANTRIP_DICE["Vicious Mockery"]).toBe(4);
	});
});
