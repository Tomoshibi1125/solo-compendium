import { describe, expect, it } from "vitest";
import {
	cellDistance,
	cellDistanceFeet,
	gridDistanceCells,
	gridDistanceFeet,
	hexDistanceCells,
	snapWorldToCell,
} from "@/lib/vtt/interactionGeometry";

describe("snapWorldToCell", () => {
	it("snaps to the nearest cell index", () => {
		expect(snapWorldToCell(0, 0, 50)).toEqual({ gridX: 0, gridY: 0 });
		expect(snapWorldToCell(74, 26, 50)).toEqual({ gridX: 1, gridY: 1 });
		expect(snapWorldToCell(80, 120, 50)).toEqual({ gridX: 2, gridY: 2 });
	});

	it("rounds half-cells to the nearer gridline", () => {
		// 1.4 cells -> 1, 1.6 cells -> 2
		expect(snapWorldToCell(70, 0, 50)).toEqual({ gridX: 1, gridY: 0 });
		expect(snapWorldToCell(80, 0, 50)).toEqual({ gridX: 2, gridY: 0 });
	});

	it("handles negative positions", () => {
		expect(snapWorldToCell(-40, -60, 50)).toEqual({ gridX: -1, gridY: -1 });
	});

	it("guards against a non-positive or NaN cell size", () => {
		expect(snapWorldToCell(123, 456, 0)).toEqual({ gridX: 0, gridY: 0 });
		expect(snapWorldToCell(123, 456, -5)).toEqual({ gridX: 0, gridY: 0 });
		expect(snapWorldToCell(123, 456, Number.NaN)).toEqual({
			gridX: 0,
			gridY: 0,
		});
	});
});

describe("gridDistanceCells (5e diagonal variant)", () => {
	it("orthogonal distance equals the cell delta", () => {
		expect(gridDistanceCells(3, 0)).toBe(3);
		expect(gridDistanceCells(0, 4)).toBe(4);
	});

	it("first diagonal counts 1, each extra diagonal adds 0.5", () => {
		expect(gridDistanceCells(1, 1)).toBe(1.5);
		expect(gridDistanceCells(2, 2)).toBe(3);
		expect(gridDistanceCells(3, 1)).toBe(3.5); // 3 straight + 1 diagonal overlap
	});

	it("ignores sign", () => {
		expect(gridDistanceCells(-2, -2)).toBe(3);
		expect(gridDistanceCells(-3, 0)).toBe(3);
	});
});

describe("gridDistanceFeet", () => {
	it("multiplies cell distance by feet-per-cell (default 5)", () => {
		expect(gridDistanceFeet(3, 0)).toBe(15);
		expect(gridDistanceFeet(1, 1)).toBe(7.5);
		expect(gridDistanceFeet(2, 2, 10)).toBe(30);
	});
});

describe("hexDistanceCells (flat-top, odd-q)", () => {
	it("is zero for the same cell", () => {
		expect(hexDistanceCells(3, 3, 3, 3)).toBe(0);
	});

	it("counts adjacent hexes as distance 1", () => {
		expect(hexDistanceCells(0, 0, 1, 0)).toBe(1);
		expect(hexDistanceCells(0, 0, 0, 1)).toBe(1);
	});

	it("accumulates over multiple columns", () => {
		expect(hexDistanceCells(0, 0, 2, 0)).toBe(2);
	});
});

describe("cellDistance / cellDistanceFeet", () => {
	it("uses the 5e square diagonal for non-hex grids", () => {
		expect(cellDistance(0, 0, 1, 1, "square")).toBe(1.5);
		expect(cellDistanceFeet(0, 0, 3, 0, "square")).toBe(15);
	});

	it("uses hex distance for hex grids", () => {
		expect(cellDistance(0, 0, 2, 0, "hex")).toBe(2);
		expect(cellDistanceFeet(0, 0, 1, 0, "hex")).toBe(5);
	});
});
