/**
 * Misty Pearl A3 + B4 — sceneState helpers for Rift Regions and
 * Animated Tiles. Co-located here to keep the original
 * `sceneState.test.ts` untouched (no test deletion or weakening per
 * plan invariants).
 */
import { describe, expect, it } from "vitest";
import {
	addAnimatedTileToScene,
	addRegionToScene,
	createVttAnimatedTileId,
	createVttRegionId,
	isAnimatedTileUrl,
	removeAnimatedTileFromScene,
	removeRegionFromScene,
	updateAnimatedTileInScene,
	updateRegionInScene,
} from "@/lib/vtt/sceneState";
import type { VTTAnimatedTile, VTTRiftRegion, VTTScene } from "@/types/vtt";

const baseScene = (): VTTScene => ({
	id: "scene-1",
	name: "Test",
	width: 1000,
	height: 1000,
	gridSize: 50,
	gridType: "square",
	tokens: [],
	drawings: [],
	annotations: [],
	walls: [],
	lights: [],
	fogOfWar: false,
});

const region = (overrides: Partial<VTTRiftRegion> = {}): VTTRiftRegion => ({
	id: overrides.id ?? createVttRegionId(),
	name: "Test Region",
	polygon: [
		{ x: 0, y: 0 },
		{ x: 100, y: 0 },
		{ x: 100, y: 100 },
	],
	color: "#ffffff",
	opacity: 0.3,
	visibleToPlayers: true,
	behaviors: [],
	...overrides,
});

const tile = (overrides: Partial<VTTAnimatedTile> = {}): VTTAnimatedTile => ({
	id: overrides.id ?? createVttAnimatedTileId(),
	src: "https://example.com/x.webm",
	x: 100,
	y: 100,
	width: 200,
	height: 200,
	loop: true,
	...overrides,
});

describe("Rift Region scene helpers", () => {
	it("addRegionToScene appends and returns a new scene", () => {
		const scene = baseScene();
		const r = region();
		const next = addRegionToScene(scene, r);
		expect(next).not.toBe(scene);
		expect(next.riftRegions).toHaveLength(1);
		expect(next.riftRegions?.[0].id).toBe(r.id);
	});

	it("updateRegionInScene patches by id without mutating", () => {
		const scene = addRegionToScene(baseScene(), region({ id: "r1" }));
		const next = updateRegionInScene(scene, "r1", { color: "#ff0000" });
		expect(next).not.toBe(scene);
		expect(next.riftRegions?.[0].color).toBe("#ff0000");
		// id field is preserved even if updates included id
		const sneaky = updateRegionInScene(scene, "r1", {
			id: "evil",
		} as Partial<VTTRiftRegion>);
		expect(sneaky.riftRegions?.[0].id).toBe("r1");
	});

	it("updateRegionInScene returns the same reference on unknown id", () => {
		const scene = addRegionToScene(baseScene(), region({ id: "r1" }));
		const next = updateRegionInScene(scene, "unknown", { color: "#abc" });
		expect(next).toBe(scene);
	});

	it("removeRegionFromScene drops by id", () => {
		const scene = addRegionToScene(baseScene(), region({ id: "r1" }));
		const next = removeRegionFromScene(scene, "r1");
		expect(next).not.toBe(scene);
		expect(next.riftRegions).toEqual([]);
	});

	it("removeRegionFromScene returns the same reference on unknown id", () => {
		const scene = addRegionToScene(baseScene(), region({ id: "r1" }));
		const next = removeRegionFromScene(scene, "ghost");
		expect(next).toBe(scene);
	});
});

describe("Animated tile scene helpers", () => {
	it("addAnimatedTileToScene appends and returns a new scene", () => {
		const scene = baseScene();
		const t = tile();
		const next = addAnimatedTileToScene(scene, t);
		expect(next).not.toBe(scene);
		expect(next.animatedTiles).toHaveLength(1);
		expect(next.animatedTiles?.[0].id).toBe(t.id);
	});

	it("updateAnimatedTileInScene patches by id and preserves id", () => {
		const scene = addAnimatedTileToScene(baseScene(), tile({ id: "t1" }));
		const next = updateAnimatedTileInScene(scene, "t1", { x: 500, y: 600 });
		expect(next.animatedTiles?.[0]).toMatchObject({
			id: "t1",
			x: 500,
			y: 600,
		});
	});

	it("updateAnimatedTileInScene returns the same reference on unknown id", () => {
		const scene = addAnimatedTileToScene(baseScene(), tile({ id: "t1" }));
		const next = updateAnimatedTileInScene(scene, "missing", { x: 5 });
		expect(next).toBe(scene);
	});

	it("removeAnimatedTileFromScene drops by id", () => {
		const scene = addAnimatedTileToScene(baseScene(), tile({ id: "t1" }));
		const next = removeAnimatedTileFromScene(scene, "t1");
		expect(next.animatedTiles).toEqual([]);
	});
});

describe("isAnimatedTileUrl", () => {
	it("recognizes common video extensions", () => {
		for (const url of [
			"https://x/y.mp4",
			"https://x/y.webm",
			"https://x/y.ogv",
			"https://x/y.mov",
			"https://x/y.gif",
		]) {
			expect(isAnimatedTileUrl(url)).toBe(true);
		}
	});

	it("recognizes animated webp via filename hint", () => {
		expect(isAnimatedTileUrl("https://x/anim-flame.webp")).toBe(true);
		expect(isAnimatedTileUrl("https://x/static.webp")).toBe(false);
	});

	it("rejects plain images", () => {
		expect(isAnimatedTileUrl("https://x/y.png")).toBe(false);
		expect(isAnimatedTileUrl("https://x/y.jpg")).toBe(false);
	});

	it("handles undefined and empty string", () => {
		expect(isAnimatedTileUrl(undefined)).toBe(false);
		expect(isAnimatedTileUrl("")).toBe(false);
	});
});
