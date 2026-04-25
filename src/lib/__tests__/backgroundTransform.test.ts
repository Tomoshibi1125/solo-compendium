import { describe, expect, it } from "vitest";
import {
	calibrateVttBackgroundToGrid,
	clampVttGridOpacity,
	getVttBackgroundTransform,
	GRID_VISIBILITY_PRESETS,
	resolveVttGridVisibilityPreset,
} from "@/lib/vtt/backgroundTransform";

describe("getVttBackgroundTransform", () => {
	it("derives world and image dimensions from scene size, zoom, and scale", () => {
		const result = getVttBackgroundTransform({
			sceneWidth: 20,
			sceneHeight: 10,
			gridSize: 50,
			zoom: 2,
			backgroundScale: 1.25,
			backgroundOffsetX: 10,
			backgroundOffsetY: -5,
		});

		expect(result.worldWidthPx).toBe(2000);
		expect(result.worldHeightPx).toBe(1000);
		expect(result.imageWidthPx).toBe(2500);
		expect(result.imageHeightPx).toBe(1250);
		expect(result.offsetXPx).toBe(20);
		expect(result.offsetYPx).toBe(-10);
		expect(result.scale).toBe(1.25);
	});
});

describe("calibrateVttBackgroundToGrid", () => {
	it("snaps the chosen anchor to the nearest app-grid intersection", () => {
		const result = calibrateVttBackgroundToGrid({
			anchorPoint: { x: 143, y: 207 },
			referencePoint: { x: 193, y: 207 },
			gridSize: 50,
			zoom: 1,
			backgroundScale: 1,
			backgroundOffsetX: 0,
			backgroundOffsetY: 0,
		});

		expect(result).not.toBeNull();
		expect(result?.backgroundScale).toBe(1);
		expect(result?.backgroundOffsetX).toBe(7);
		expect(result?.backgroundOffsetY).toBe(-7);
		expect(result?.snappedAnchor).toEqual({ x: 150, y: 200 });
	});

	it("rescales the map when the embedded grid square is larger than the app grid", () => {
		const result = calibrateVttBackgroundToGrid({
			anchorPoint: { x: 120, y: 80 },
			referencePoint: { x: 195, y: 80 },
			gridSize: 50,
			zoom: 1,
			backgroundScale: 1.5,
			backgroundOffsetX: 0,
			backgroundOffsetY: 0,
		});

		expect(result).not.toBeNull();
		expect(result?.measuredCellPx).toBe(75);
		expect(result?.targetCellPx).toBe(50);
		expect(result?.backgroundScale).toBe(1);
	});

	it("returns null when the calibration points are too close together", () => {
		expect(
			calibrateVttBackgroundToGrid({
				anchorPoint: { x: 100, y: 100 },
				referencePoint: { x: 103, y: 102 },
				gridSize: 50,
				zoom: 1,
				backgroundScale: 1,
				backgroundOffsetX: 0,
				backgroundOffsetY: 0,
			}),
		).toBeNull();
	});
});

describe("grid visibility helpers", () => {
	it("clamps grid opacity into the valid range", () => {
		expect(clampVttGridOpacity(-1)).toBe(0);
		expect(clampVttGridOpacity(2)).toBe(1);
		expect(clampVttGridOpacity(GRID_VISIBILITY_PRESETS.faded)).toBe(
			GRID_VISIBILITY_PRESETS.faded,
		);
	});

	it("maps opacity values back to a preset label", () => {
		expect(resolveVttGridVisibilityPreset(0)).toBe("hidden");
		expect(resolveVttGridVisibilityPreset(0.08)).toBe("faded");
		expect(resolveVttGridVisibilityPreset(0.2)).toBe("visible");
	});
});
