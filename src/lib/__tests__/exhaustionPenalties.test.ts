/**
 * Exhaustion speed + HP-max penalties (Jul 19 audit, third pass).
 *
 * The rules (PHB p.291: speed halved at 2, HP max halved at 4, speed 0 at 5)
 * were implemented in `conditionEffects.ts` but reachable ONLY through
 * `characterEngine.computeCharacterStats`, which had zero production callers.
 * So the sheet never applied them — while the exhaustion badge already told
 * the player "Speed halved". The roll penalties were separately wired on
 * Jul 19 and are covered by conditionRollAutomation.test.ts.
 *
 * These tests pin the rule ladder plus the structural wiring, so the sheet
 * cannot silently regress to ignoring exhaustion again.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	applyExhaustionToHpMax,
	getExhaustionSpeedMultiplier,
} from "@/lib/conditionEffects";

const ROOT = resolve(__dirname, "../../..");
const src = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

describe("exhaustion speed multiplier", () => {
	it("is unaffected below level 2", () => {
		expect(getExhaustionSpeedMultiplier(0)).toBe(1);
		expect(getExhaustionSpeedMultiplier(1)).toBe(1);
	});

	it("halves speed from level 2 through 4", () => {
		expect(getExhaustionSpeedMultiplier(2)).toBe(0.5);
		expect(getExhaustionSpeedMultiplier(3)).toBe(0.5);
		expect(getExhaustionSpeedMultiplier(4)).toBe(0.5);
	});

	it("zeroes speed at level 5 and beyond", () => {
		expect(getExhaustionSpeedMultiplier(5)).toBe(0);
		// Level 6 is death; the table clamps, so speed stays 0 rather than
		// falling off the end of the array.
		expect(getExhaustionSpeedMultiplier(6)).toBe(0);
	});

	it("applied to a 30 ft walk speed gives the expected table values", () => {
		const speedAt = (level: number) =>
			Math.floor(30 * getExhaustionSpeedMultiplier(level));
		expect(speedAt(0)).toBe(30);
		expect(speedAt(2)).toBe(15);
		expect(speedAt(5)).toBe(0);
	});
});

describe("exhaustion HP-max penalty", () => {
	it("does nothing below level 4", () => {
		expect(applyExhaustionToHpMax(40, 0)).toBe(40);
		expect(applyExhaustionToHpMax(40, 3)).toBe(40);
	});

	it("halves the maximum at level 4 and beyond", () => {
		expect(applyExhaustionToHpMax(40, 4)).toBe(20);
		expect(applyExhaustionToHpMax(41, 4)).toBe(20); // rounds down
		expect(applyExhaustionToHpMax(40, 5)).toBe(20);
	});

	it("never drops the maximum below 1", () => {
		expect(applyExhaustionToHpMax(1, 4)).toBe(1);
	});
});

describe("structural wiring — the sheet consumes exhaustion", () => {
	it("derived stats apply both penalties", () => {
		const s = src("src/hooks/useCharacterDerivedStats.ts");
		expect(s.includes("getExhaustionSpeedMultiplier")).toBe(true);
		expect(s.includes("applyExhaustionToHpMax")).toBe(true);
		// The level must actually be read, not just carried in an unused object
		// (the original bug: it sat in `protocolData` and nothing consumed it).
		expect(/exhaustionLevel\s*=\s*character\.exhaustion_level/.test(s)).toBe(
			true,
		);
	});

	it("the sheet clamps displayed current HP to the (possibly reduced) max", () => {
		const s = src("src/components/character-v2/CharacterSheetV2.tsx");
		expect(s.includes("displayHpCurrent")).toBe(true);
		expect(
			/displayHpCurrent\s*=\s*Math\.min\(\s*character\.hp_current/.test(s),
		).toBe(true);
	});
});
