import { describe, expect, it } from "vitest";
import { parseUvttDocument } from "@/lib/vtt/uvttImport";

const baseDoc = {
	format: 0.3,
	resolution: {
		map_origin: { x: 0, y: 0 },
		map_size: { x: 20, y: 15 },
		pixels_per_grid: 100,
	},
};

describe("parseUvttDocument", () => {
	it("rejects non-objects", () => {
		expect(() => parseUvttDocument(null)).toThrow(/not an object/);
		expect(() => parseUvttDocument("oops")).toThrow(/not an object/);
	});

	it("rejects missing format field (rejects competitor VTT exports)", () => {
		expect(() => parseUvttDocument({ resolution: baseDoc.resolution })).toThrow(
			/missing 'format'/,
		);
	});

	it("rejects unsupported format versions", () => {
		expect(() =>
			parseUvttDocument({ ...baseDoc, format: 5 }),
		).toThrow(/unsupported format/);
	});

	it("computes scene width/height from map_size * pixels_per_grid", () => {
		const { scene } = parseUvttDocument(baseDoc);
		expect(scene.width).toBe(2000);
		expect(scene.height).toBe(1500);
		expect(scene.gridSize).toBe(100);
	});

	it("converts line_of_sight polylines into wall segments", () => {
		const { scene } = parseUvttDocument({
			...baseDoc,
			line_of_sight: [
				[
					{ x: 0, y: 0 },
					{ x: 5, y: 0 },
					{ x: 5, y: 5 },
				],
			],
		});
		expect(scene.walls).toHaveLength(2);
		expect(scene.walls[0]).toMatchObject({
			x1: 0,
			y1: 0,
			x2: 500,
			y2: 0,
			type: "wall",
		});
		expect(scene.walls[1]).toMatchObject({
			x1: 500,
			y1: 0,
			x2: 500,
			y2: 500,
			type: "wall",
		});
	});

	it("converts objects_line_of_sight into terrain-type walls", () => {
		const { scene } = parseUvttDocument({
			...baseDoc,
			objects_line_of_sight: [
				[
					{ x: 1, y: 1 },
					{ x: 2, y: 1 },
				],
			],
		});
		expect(scene.walls).toHaveLength(1);
		expect(scene.walls[0].type).toBe("terrain");
	});

	it("converts portals into door walls with closed=closed state", () => {
		const { scene } = parseUvttDocument({
			...baseDoc,
			portals: [
				{
					bounds: [
						{ x: 3, y: 3 },
						{ x: 4, y: 3 },
					],
					closed: true,
				},
				{
					bounds: [
						{ x: 5, y: 5 },
						{ x: 6, y: 5 },
					],
					closed: false,
				},
			],
		});
		expect(scene.walls).toHaveLength(2);
		expect(scene.walls[0]).toMatchObject({
			type: "door",
			state: "closed",
			doorOpen: false,
		});
		expect(scene.walls[1]).toMatchObject({
			type: "door",
			state: "open",
			doorOpen: true,
		});
	});

	it("converts lights with hex colors", () => {
		const { scene } = parseUvttDocument({
			...baseDoc,
			lights: [
				{
					position: { x: 10, y: 10 },
					range: 8,
					intensity: 0.7,
					color: "ffaa33",
				},
			],
		});
		expect(scene.lights).toHaveLength(1);
		expect(scene.lights[0]).toMatchObject({
			x: 1000,
			y: 1000,
			color: "#ffaa33",
			intensity: 0.7,
			type: "ambient",
		});
		expect(scene.lights[0].dimRadius).toBe(8);
		expect(scene.lights[0].brightRadius).toBeCloseTo(4.8, 5);
	});

	it("strips AARRGGBB alpha from light colors", () => {
		const { scene } = parseUvttDocument({
			...baseDoc,
			lights: [
				{
					position: { x: 0, y: 0 },
					range: 5,
					color: "80ffaa33",
				},
			],
		});
		expect(scene.lights[0].color).toBe("#ffaa33");
	});

	it("returns a data URL when image is present, warns when absent", () => {
		const result = parseUvttDocument({
			...baseDoc,
			image: "iVBORw0KGgo=",
		});
		expect(result.backgroundDataUrl).toBe("data:image/png;base64,iVBORw0KGgo=");
		expect(result.warnings).toHaveLength(0);

		const noImage = parseUvttDocument(baseDoc);
		expect(noImage.backgroundDataUrl).toBeNull();
		expect(noImage.warnings.some((w) => /no embedded image/.test(w))).toBe(true);
	});

	it("defaults missing intensity to 0.85 and clamps to 0..1", () => {
		const { scene } = parseUvttDocument({
			...baseDoc,
			lights: [
				{ position: { x: 0, y: 0 }, range: 3 },
				{ position: { x: 1, y: 1 }, range: 3, intensity: 12 },
				{ position: { x: 2, y: 2 }, range: 3, intensity: -3 },
			],
		});
		expect(scene.lights[0].intensity).toBe(0.85);
		expect(scene.lights[1].intensity).toBe(1);
		expect(scene.lights[2].intensity).toBe(0);
	});

	it("uses caller-provided scene name when present", () => {
		const { scene } = parseUvttDocument(baseDoc, {
			sceneName: "Yongsan Subway",
		});
		expect(scene.name).toBe("Yongsan Subway");
	});

	it("defaults the scene name when none is provided", () => {
		const { scene } = parseUvttDocument(baseDoc);
		expect(scene.name).toBe("Imported Rift");
	});

	it("clamps pixels_per_grid to safe range", () => {
		const tiny = parseUvttDocument({
			...baseDoc,
			resolution: { ...baseDoc.resolution, pixels_per_grid: 2 },
		});
		expect(tiny.scene.gridSize).toBe(8);
		const huge = parseUvttDocument({
			...baseDoc,
			resolution: { ...baseDoc.resolution, pixels_per_grid: 9000 },
		});
		expect(huge.scene.gridSize).toBe(1024);
	});
});
