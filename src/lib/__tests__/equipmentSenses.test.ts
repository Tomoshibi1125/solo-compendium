/**
 * Gear-granted special senses (Jul 19 audit, third pass).
 *
 * Extraction existed only in `characterEngine.extractEquipmentSenses`, which
 * was reachable solely through `computeCharacterStats` — a function with zero
 * production callers. So a relic granting "darkvision 60 ft" contributed
 * nothing to the sheet's SPECIAL_SENSES block. Job/racial senses were never
 * affected: those persist on the `senses` column and are parsed separately.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { extractSensesFromProperties } from "@/lib/sensesEngine";

const ROOT = resolve(__dirname, "../../..");
const src = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

describe("extractSensesFromProperties", () => {
	it("reads a sense and its range from an item property", () => {
		expect(
			extractSensesFromProperties([
				{ properties: ["requires attunement", "darkvision 60 ft"] },
			]),
		).toEqual({ darkvision: 60 });
	});

	it("keeps the LONGEST range when several items grant the same sense", () => {
		const found = extractSensesFromProperties([
			{ properties: ["darkvision 30 ft"] },
			{ properties: ["darkvision 120 ft"] },
			{ properties: ["darkvision 60 ft"] },
		]);
		expect(found.darkvision).toBe(120);
	});

	it("collects each of the four special senses independently", () => {
		const found = extractSensesFromProperties([
			{ properties: ["blindsight 10 ft", "tremorsense 30 ft"] },
			{ properties: ["truesight 15 ft"] },
		]);
		expect(found).toEqual({
			blindsight: 10,
			tremorsense: 30,
			truesight: 15,
		});
	});

	it("is case-insensitive and tolerates spacing", () => {
		expect(
			extractSensesFromProperties([{ properties: ["Darkvision  90ft"] }])
				.darkvision,
		).toBe(90);
	});

	it("ignores gear with no sense text, and null/absent properties", () => {
		expect(
			extractSensesFromProperties([
				{ properties: ["1d6 slashing", "light"] },
				{ properties: null },
				{},
				{ properties: [null, undefined] },
			]),
		).toEqual({});
	});

	it("does not invent a sense from prose without a range", () => {
		// "grants darkvision" with no distance yields nothing rather than 0 ft.
		expect(
			extractSensesFromProperties([
				{ properties: ["grants darkvision in dim light"] },
			]),
		).toEqual({});
	});

	it("binds self-directed prose forms", () => {
		expect(
			extractSensesFromProperties([
				{ properties: ["you gain darkvision 60 ft"] },
			]).darkvision,
		).toBe(60);
		expect(
			extractSensesFromProperties([
				{ properties: ["you have truesight 30 ft"] },
			]).truesight,
		).toBe(30);
		expect(
			extractSensesFromProperties([{ properties: ["grants blindsight 10 ft"] }])
				.blindsight,
		).toBe(10);
	});

	// The house rule: a sense the item grants to SOMEONE ELSE, or that merely
	// appears mid-sentence, must never bind to the wearer. Every one of these
	// bound wrongly under the original "match anywhere" regex (verified red).
	it("never binds a sense granted to someone/something else", () => {
		expect(
			extractSensesFromProperties([
				{ properties: ["your ally gains darkvision 60 ft"] },
			]),
		).toEqual({});
		expect(
			extractSensesFromProperties([
				{ properties: ["the target has truesight 30 ft"] },
			]),
		).toEqual({});
		// A Technomancer ultimate describing a deployed device — the caster does
		// NOT gain the drone's truesight.
		expect(
			extractSensesFromProperties([
				{ properties: ["a scanner (truesight 120 ft)"] },
			]),
		).toEqual({});
	});

	it("does not bind a sense buried mid-sentence", () => {
		expect(
			extractSensesFromProperties([
				{
					properties: [
						"while attuned, creatures within 30 ft with darkvision 60 ft are revealed",
					],
				},
			]),
		).toEqual({});
	});
});

describe("structural wiring — the sheet unions gear senses", () => {
	it("derived stats extract senses from equipped gear", () => {
		const s = src("src/hooks/useCharacterDerivedStats.ts");
		expect(s.includes("extractSensesFromProperties")).toBe(true);
		// Must take the best of persisted vs gear, not replace one with the other.
		expect(/Math\.max\(parseSense\(name\)/.test(s)).toBe(true);
	});
});
