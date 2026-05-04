import { describe, expect, it } from "vitest";
import {
	buildVttFogRects,
	buildVttFogRenderRects,
	buildVttVisibleCellSet,
	isVttTokenVisibleThroughFog,
} from "../vtt/fogRects";

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

	it("renders unexplored cells as opaque and explored cells as dim memory", () => {
		expect(
			buildVttFogRenderRects({
				scene: {
					width: 3,
					height: 2,
					gridSize: 50,
					fogOfWar: true,
					tokenVisionRevealsFog: true,
					fogData: [
						[false, true, true],
						[false, false, true],
					],
				},
				visibleCells: new Set(["1,0"]),
			}),
		).toEqual([
			{ rx: 0, ry: 0, width: 1, height: 1, state: "hidden", opacity: 1 },
			{ rx: 2, ry: 0, width: 1, height: 2, state: "explored", opacity: 0.72 },
			{ rx: 0, ry: 1, width: 2, height: 1, state: "hidden", opacity: 1 },
		]);
	});

	it("uses owned-token vision and active token selection to derive visible cells", () => {
		const scene = {
			width: 8,
			height: 3,
			gridSize: 50,
			fogOfWar: true,
			tokenVisionRevealsFog: true,
		};
		const tokens = [
			{
				id: "owned-a",
				x: 1,
				y: 1,
				ownerId: "user-1",
				tokenType: "character",
				visionRange: 1,
			},
			{
				id: "owned-b",
				x: 6,
				y: 1,
				ownerId: "user-1",
				tokenType: "character",
				visionRange: 1,
			},
			{
				id: "other",
				x: 4,
				y: 1,
				ownerId: "user-2",
				tokenType: "character",
				visionRange: 1,
			},
		];
		const union = buildVttVisibleCellSet(scene, tokens, {
			currentUserId: "user-1",
			rayCount: 32,
		});
		expect(union.has("1,1")).toBe(true);
		expect(union.has("6,1")).toBe(true);
		expect(union.has("4,1")).toBe(false);
		const selected = buildVttVisibleCellSet(scene, tokens, {
			currentUserId: "user-1",
			activeTokenId: "owned-b",
			rayCount: 32,
		});
		expect(selected.has("1,1")).toBe(false);
		expect(selected.has("6,1")).toBe(true);
	});

	it("blocks token visibility when its footprint is under hidden fog", () => {
		const scene = {
			width: 4,
			height: 4,
			gridSize: 50,
			fogOfWar: true,
			fogData: [
				[true, false, false, false],
				[false, false, false, false],
				[false, false, false, false],
				[false, false, false, false],
			],
		};
		expect(
			isVttTokenVisibleThroughFog(
				{ id: "visible-token", x: 0, y: 0, size: "medium" },
				scene,
			),
		).toBe(true);
		expect(
			isVttTokenVisibleThroughFog(
				{ id: "hidden-token", x: 1, y: 1, size: "medium" },
				scene,
			),
		).toBe(false);
	});
});
