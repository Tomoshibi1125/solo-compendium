/**
 * Bulk-rest ↔ sheet-rest parity guard (Jul 18 deep audit, Phase A).
 *
 * Two rest implementations existed: `restSystem.ts` (the sheet's Short/Long
 * Rest buttons) and `bulkOperations.bulkRest` (the roster bar's bulk rest).
 * They disagreed on hit dice, and the bulk one contradicted 5e RAW:
 *
 *   RAW — short rest: hit dice are SPENT to heal, never regained.
 *         long rest:  regain max(1, floor(total/2)) spent hit dice.
 *   bulkRest (before) — short rest: regained ceil(max/2) hit dice (!),
 *                       long rest:  regained ALL hit dice (!).
 *
 * A party that bulk-rested from the roster got free hit dice on every
 * short rest and a full pool on every long rest. bulkRest now delegates
 * to restSystem, so there is one rest engine; this test pins the RAW
 * math and the structural delegation.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../../..");
const src = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

/** RAW long-rest hit-dice regain: half the total, minimum one. */
const rawLongRestRegain = (current: number, max: number) =>
	Math.min(max, current + Math.max(1, Math.floor(max / 2)));

describe("rest hit-dice math (5e RAW)", () => {
	it("long rest regains half the pool (min 1), not the whole pool", () => {
		// Level 5, fully spent → regains 2, NOT 5.
		expect(rawLongRestRegain(0, 5)).toBe(2);
		// Level 1 → minimum of one die.
		expect(rawLongRestRegain(0, 1)).toBe(1);
		// Never exceeds the maximum.
		expect(rawLongRestRegain(4, 5)).toBe(5);
		expect(rawLongRestRegain(5, 5)).toBe(5);
	});

	it("restSystem implements the RAW long-rest formula on both branches", () => {
		const s = src("src/lib/restSystem.ts");
		const matches = s.match(
			/hit_dice_current\s*:\s*Math\.min\(\s*character\.hit_dice_max\s*,\s*character\.hit_dice_current\s*\+\s*Math\.max\(1,\s*Math\.floor\(character\.hit_dice_max\s*\/\s*2\)\)/g,
		);
		// Guest (local) branch + Supabase branch.
		expect(matches?.length ?? 0).toBe(2);
	});

	it("restSystem never regains hit dice on a short rest", () => {
		const s = src("src/lib/restSystem.ts");
		const shortRestSections = s.split(/executeLongRest|longRest/i)[0];
		expect(shortRestSections.includes("hit_dice_current:")).toBe(false);
	});
});

describe("bulkRest delegates to the canonical rest engine", () => {
	it("bulkOperations does not carry its own hit-dice rest math", () => {
		const s = src("src/lib/bulkOperations.ts");
		const restIdx = s.indexOf("export async function bulkRest");
		expect(restIdx).toBeGreaterThan(-1);
		const restFn = s.slice(restIdx, restIdx + 2600);
		// The old fork wrote hit_dice_current directly from its own formula.
		expect(restFn.includes("hitDiceToRestore")).toBe(false);
		expect(restFn.includes("hit_dice_current:")).toBe(false);
		// It must route through restSystem instead.
		expect(/executeShortRest|executeLongRest/.test(restFn)).toBe(true);
	});
});
