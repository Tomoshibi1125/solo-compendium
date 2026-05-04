import { describe, expect, it } from "vitest";
import {
	createUniformDiceFormula,
	type RollableTableRollInput,
	type RollableTableRollResult,
	rollCanonicalTable,
} from "@/lib/rollableTables";

describe("createUniformDiceFormula", () => {
	it("creates a 1dN formula for non-empty uniform tables", () => {
		expect(createUniformDiceFormula(1)).toBe("1d1");
		expect(createUniformDiceFormula(12)).toBe("1d12");
	});

	it("returns null for invalid entry counts", () => {
		expect(createUniformDiceFormula(0)).toBeNull();
		expect(createUniformDiceFormula(-1)).toBeNull();
		expect(createUniformDiceFormula(1.5)).toBeNull();
	});
});

describe("rollCanonicalTable", () => {
	const table: RollableTableRollInput = {
		id: "test-table",
		name: "Test Table",
		dice_formula: "1d3",
		rollable_entries: ["Alpha", "Bravo", "Charlie"],
	};

	it("uses injected random source to select an entry", () => {
		expect(rollCanonicalTable(table, () => 0)?.result).toBe("Alpha");
		expect(rollCanonicalTable(table, () => 0.34)?.result).toBe("Bravo");
		expect(rollCanonicalTable(table, () => 0.99)?.result).toBe("Charlie");
	});

	it("returns roll metadata with table identity and formula", () => {
		const rolled: RollableTableRollResult | null = rollCanonicalTable(
			table,
			() => 0.5,
		);
		expect(rolled).toEqual({
			tableId: "test-table",
			tableName: "Test Table",
			diceFormula: "1d3",
			index: 1,
			result: "Bravo",
		});
	});

	it("derives a formula when table metadata is absent", () => {
		const rolled = rollCanonicalTable(
			{ rollable_entries: ["One", "Two"] },
			() => 0.75,
		);
		expect(rolled?.diceFormula).toBe("1d2");
		expect(rolled?.result).toBe("Two");
	});

	it("clamps out-of-range random values", () => {
		expect(rollCanonicalTable(table, () => -1)?.result).toBe("Alpha");
		expect(rollCanonicalTable(table, () => 1)?.result).toBe("Charlie");
		expect(rollCanonicalTable(table, () => Number.NaN)?.result).toBe("Alpha");
	});

	it("returns null for missing or empty entries", () => {
		expect(rollCanonicalTable({ rollable_entries: [] })).toBeNull();
		expect(rollCanonicalTable({ rollable_entries: null })).toBeNull();
	});
});
