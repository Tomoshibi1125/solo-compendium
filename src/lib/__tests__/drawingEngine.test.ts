import { describe, expect, it } from "vitest";
import {
	circlePath,
	createDrawing,
	getTemplateCells,
	measureDistance,
	measurePath,
	rectPath,
} from "../vtt";

describe("VTT Drawing Engine", () => {
	describe("Measurement", () => {
		it("calculates straight distance correctly", () => {
			// 2 squares straight right
			const res = measureDistance({ x: 0, y: 0 }, { x: 100, y: 0 }, 50, 5);
			expect(res.distanceSquares).toBe(2);
			expect(res.distanceFt).toBe(10);
		});

		it("calculates diagonal distance correctly using 1.5 approximation", () => {
			// 2 squares diagonal
			const res = measureDistance({ x: 0, y: 0 }, { x: 100, y: 100 }, 50, 5);
			// straight = 0, diagonal = 2. 2 * 1.5 = 3.
			expect(res.distanceSquares).toBe(3);
			expect(res.distanceFt).toBe(15);
		});

		it("calculates mixed distance correctly", () => {
			// 4 squares right, 2 squares down
			// straight = 2, diag = 2 => squares = 2 + (2 * 1.5) = 5
			const res = measureDistance({ x: 0, y: 0 }, { x: 200, y: 100 }, 50, 5);
			expect(res.distanceSquares).toBe(5);
			expect(res.distanceFt).toBe(25);
		});

		it("measures path over multiple waypoints", () => {
			const points = [
				{ x: 0, y: 0 },
				{ x: 100, y: 0 }, // 2 sq
				{ x: 100, y: 100 }, // +2 sq
			];
			const res = measurePath(points, 50, 5);
			expect(res.distanceSquares).toBe(4);
			expect(res.distanceFt).toBe(20);
		});
	});

	describe("Shape Generators", () => {
		it("generates a circle path", () => {
			const p = circlePath(50, 50, 20);
			expect(p).toContain("M 30 50 A 20 20 0 1 0 70 50 A 20 20 0 1 0 30 50 Z");
		});

		it("generates a rect path", () => {
			const p = rectPath(0, 0, 100, 50);
			expect(p).toBe("M 0 0 L 100 0 L 100 50 L 0 50 Z");
		});
	});

	describe("createDrawing", () => {
		it("initializes a drawing with correct fields", () => {
			const points = [{ x: 10, y: 10 }];
			const drawing = createDrawing(
				"freehand",
				points,
				"#ff0000",
				4,
				"player1",
			);
			expect(drawing.id).toMatch(/^draw-\d+-/);
			expect(drawing.type).toBe("freehand");
			expect(drawing.points).toBe(points);
			expect(drawing.color).toBe("#ff0000");
			expect(drawing.strokeWidth).toBe(4);
			expect(drawing.createdBy).toBe("player1");
			expect(drawing.layer).toBe("drawing");
		});
	});

	describe("getTemplateCells", () => {
		it("calculates sphere cells", () => {
			const cells = getTemplateCells(
				{
					id: "t1",
					type: "sphere",
					origin: { x: 50, y: 50 },
					radiusFt: 5,
					color: "blue",
					opacity: 0.5,
				},
				50,
			);

			// Radius cell 1:
			// dx from -1 to 1, dy from -1 to 1.
			// dist is 0 (dx=0, dy=0), 1 (dx=1, dy=0), sqrt(2)≈1.414 (dx=1, dy=1) > 1 -> not included
			// Included: (0,0), (1,0), (-1,0), (0,1), (0,-1)
			expect(cells.length).toBe(5);
			const points = cells.map((c) => `${c.x},${c.y}`);
			expect(points).toContain("1,1"); // Origin is at x=50, y=50 -> 1,1
			expect(points).toContain("2,1"); // dx=1
			expect(points).toContain("0,1"); // dx=-1
			expect(points).toContain("1,2"); // dy=1
			expect(points).toContain("1,0"); // dy=-1
		});

		it("calculates cube cells", () => {
			const cells = getTemplateCells(
				{
					id: "t2",
					type: "cube",
					origin: { x: 50, y: 50 },
					radiusFt: 10,
					color: "red",
					opacity: 0.5,
				},
				50,
			);

			// Radius cell 2 -> half = 1
			// dx from -1 to 1, dy from -1 to 1 => 3x3 = 9 cells
			expect(cells.length).toBe(9);
		});
	});
});
