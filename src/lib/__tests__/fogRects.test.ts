import { describe, expect, it } from "vitest";
import { buildVttFogRects } from "../vtt/fogRects";

describe("buildVttFogRects", () => {
	it("returns no rectangles for missing or fully revealed fog", () => {
		expect(buildVttFogRects(undefined)).toEqual([]);
		expect(
			buildVttFogRects([
				[true, true],
				[true, true],
			]),
		).toEqual([]);
	});

	it("merges matching hidden spans vertically into solid rectangles", () => {
		expect(
			buildVttFogRects([
				[false, false, true, false],
				[false, false, true, false],
				[false, false, true, true],
				[true, true, true, false],
			]),
		).toEqual([
			{ rx: 0, ry: 0, width: 2, height: 3 },
			{ rx: 3, ry: 0, width: 1, height: 2 },
			{ rx: 3, ry: 3, width: 1, height: 1 },
		]);
	});

	it("keeps differently shaped spans separate", () => {
		expect(
			buildVttFogRects([
				[false, true, false],
				[false, false, false],
			]),
		).toEqual([
			{ rx: 0, ry: 0, width: 1, height: 1 },
			{ rx: 2, ry: 0, width: 1, height: 1 },
			{ rx: 0, ry: 1, width: 3, height: 1 },
		]);
	});
});
