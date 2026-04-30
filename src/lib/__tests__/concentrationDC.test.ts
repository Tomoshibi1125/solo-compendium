/**
 * Concentration save DC formula tests (DDB / SRD 5e parity).
 *
 * Locks in the per-hit formula `DC = max(10, floor(damage / 2))` so any
 * future engine refactors can't drift from the parity baseline. Used by
 * `useConcentration.takeDamage` and `takeConcentrationDamage`.
 */
import { describe, expect, it } from "vitest";
import { calculateConcentrationDC } from "@/lib/system_ascendant/concentration";

describe("calculateConcentrationDC (DDB / SRD parity)", () => {
	it("returns 10 (the floor) for any damage ≤ 20", () => {
		expect(calculateConcentrationDC(0)).toBe(10);
		expect(calculateConcentrationDC(1)).toBe(10);
		expect(calculateConcentrationDC(10)).toBe(10);
		expect(calculateConcentrationDC(19)).toBe(10);
		expect(calculateConcentrationDC(20)).toBe(10);
	});

	it("returns floor(damage/2) once damage exceeds 20", () => {
		expect(calculateConcentrationDC(21)).toBe(10);
		expect(calculateConcentrationDC(22)).toBe(11);
		expect(calculateConcentrationDC(23)).toBe(11);
		expect(calculateConcentrationDC(40)).toBe(20);
		expect(calculateConcentrationDC(41)).toBe(20);
		expect(calculateConcentrationDC(100)).toBe(50);
	});

	it("treats negative damage as 0 (still produces DC 10)", () => {
		// Defensive: callers typically guard against negative damage, but
		// the helper should never return a sub-10 DC.
		expect(calculateConcentrationDC(-5)).toBe(10);
		expect(calculateConcentrationDC(Number.NEGATIVE_INFINITY)).toBe(10);
	});

	it("rounds down (floor) for odd damage values", () => {
		// Half of 25 is 12.5 → floor → 12.
		expect(calculateConcentrationDC(25)).toBe(12);
		expect(calculateConcentrationDC(27)).toBe(13);
		expect(calculateConcentrationDC(99)).toBe(49);
	});

	it("very large damage produces a high DC (smoke test)", () => {
		expect(calculateConcentrationDC(1000)).toBe(500);
	});
});
