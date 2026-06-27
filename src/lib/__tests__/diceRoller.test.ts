import { describe, expect, it } from "vitest";
import {
	isRollableDiceString,
	rollDiceString,
	tryRollDiceString,
} from "@/lib/diceRoller";

describe("rollDiceString", () => {
	it("rejects flat numeric damage payloads; rolls must use dice formulas", () => {
		expect(() => rollDiceString("4")).toThrow(/Invalid dice string/);
	});
});

describe("isRollableDiceString", () => {
	it("accepts dice formulas", () => {
		expect(isRollableDiceString("1d20+5")).toBe(true);
		expect(isRollableDiceString("2d6")).toBe(true);
		expect(isRollableDiceString("4d6 + 3 + 2d6")).toBe(true);
	});
	it("rejects descriptive or flat values that would throw", () => {
		expect(isRollableDiceString("fire damage")).toBe(false);
		expect(isRollableDiceString("4")).toBe(false);
		expect(isRollableDiceString("")).toBe(false);
		expect(isRollableDiceString(null)).toBe(false);
		expect(isRollableDiceString(undefined)).toBe(false);
	});
});

describe("tryRollDiceString", () => {
	it("rolls a valid formula", () => {
		const result = tryRollDiceString("1d6+1");
		expect(result).not.toBeNull();
		expect(result?.result).toBeGreaterThanOrEqual(2);
		expect(result?.result).toBeLessThanOrEqual(7);
	});
	it("returns null for non-rollable input instead of throwing", () => {
		expect(tryRollDiceString("fire damage")).toBeNull();
		expect(tryRollDiceString("4")).toBeNull();
		expect(tryRollDiceString("")).toBeNull();
	});
});
