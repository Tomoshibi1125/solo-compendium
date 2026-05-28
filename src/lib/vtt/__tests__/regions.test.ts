import { describe, expect, it } from "vitest";
import {
	evaluateRiftRegionEntry,
	findContainingRegions,
	pointInRegion,
	RIFT_REGION_PRESETS,
} from "@/lib/vtt/regions";
import type { VTTRiftRegion } from "@/types/vtt";

const square = (x: number, y: number, size: number) => [
	{ x, y },
	{ x: x + size, y },
	{ x: x + size, y: y + size },
	{ x, y: y + size },
];

const makeRegion = (
	overrides: Partial<VTTRiftRegion> = {},
): VTTRiftRegion => ({
	id: "r1",
	name: "Test Zone",
	polygon: square(0, 0, 100),
	color: "#ffffff",
	opacity: 0.3,
	visibleToPlayers: true,
	behaviors: [],
	...overrides,
});

describe("pointInRegion", () => {
	it("returns true inside a square", () => {
		expect(pointInRegion({ x: 50, y: 50 }, square(0, 0, 100))).toBe(true);
	});

	it("returns false outside a square", () => {
		expect(pointInRegion({ x: 150, y: 50 }, square(0, 0, 100))).toBe(false);
	});

	it("returns false for degenerate polygons", () => {
		expect(pointInRegion({ x: 0, y: 0 }, [])).toBe(false);
		expect(
			pointInRegion({ x: 0, y: 0 }, [{ x: 0, y: 0 }, { x: 10, y: 10 }]),
		).toBe(false);
	});
});

describe("findContainingRegions", () => {
	it("returns only the regions containing the point", () => {
		const r1 = makeRegion({ id: "r1", polygon: square(0, 0, 100) });
		const r2 = makeRegion({ id: "r2", polygon: square(50, 50, 100) });
		const r3 = makeRegion({ id: "r3", polygon: square(500, 500, 100) });
		const hits = findContainingRegions({ x: 75, y: 75 }, [r1, r2, r3]);
		expect(hits.map((r) => r.id).sort()).toEqual(["r1", "r2"]);
	});

	it("returns [] when there are no regions", () => {
		expect(findContainingRegions({ x: 0, y: 0 }, undefined)).toEqual([]);
		expect(findContainingRegions({ x: 0, y: 0 }, [])).toEqual([]);
	});
});

describe("evaluateRiftRegionEntry", () => {
	const region = makeRegion({
		id: "r-bleed",
		polygon: square(0, 0, 100),
		behaviors: [
			{ kind: "damage_on_enter", dice: "2d6", damageType: "necrotic" },
			{ kind: "whisper_warden", message: "Entered the bleed." },
		],
	});

	it("emits behavior events on fresh entry (outside → inside)", () => {
		const events = evaluateRiftRegionEntry({
			tokenId: "t1",
			prev: { x: -50, y: -50 },
			next: { x: 50, y: 50 },
			regions: [region],
		});
		expect(events).toHaveLength(2);
		expect(events[0]).toEqual({
			kind: "damage_on_enter",
			tokenId: "t1",
			regionId: "r-bleed",
			dice: "2d6",
			damageType: "necrotic",
		});
		expect(events[1]).toEqual({
			kind: "whisper_warden",
			tokenId: "t1",
			regionId: "r-bleed",
			message: "Entered the bleed.",
		});
	});

	it("does NOT re-emit when token stays inside the region", () => {
		const events = evaluateRiftRegionEntry({
			tokenId: "t1",
			prev: { x: 25, y: 25 },
			next: { x: 75, y: 75 },
			regions: [region],
		});
		expect(events).toEqual([]);
	});

	it("does NOT emit when token moves outside or stays outside", () => {
		const outsideThenOutside = evaluateRiftRegionEntry({
			tokenId: "t1",
			prev: { x: 200, y: 200 },
			next: { x: 250, y: 250 },
			regions: [region],
		});
		expect(outsideThenOutside).toEqual([]);

		const insideThenOutside = evaluateRiftRegionEntry({
			tokenId: "t1",
			prev: { x: 50, y: 50 },
			next: { x: 200, y: 200 },
			regions: [region],
		});
		expect(insideThenOutside).toEqual([]);
	});

	it("emits on first move when prev is null and next is inside", () => {
		const events = evaluateRiftRegionEntry({
			tokenId: "t1",
			prev: null,
			next: { x: 50, y: 50 },
			regions: [region],
		});
		expect(events).toHaveLength(2);
	});

	it("aggregates events across multiple regions", () => {
		const r1 = makeRegion({
			id: "a",
			polygon: square(0, 0, 100),
			behaviors: [{ kind: "play_sound", soundId: "thunder" }],
		});
		const r2 = makeRegion({
			id: "b",
			polygon: square(50, 50, 100),
			behaviors: [{ kind: "apply_condition", condition: "blinded" }],
		});
		const events = evaluateRiftRegionEntry({
			tokenId: "t1",
			prev: { x: -10, y: -10 },
			next: { x: 75, y: 75 },
			regions: [r1, r2],
		});
		expect(events.map((e) => e.kind).sort()).toEqual([
			"apply_condition",
			"play_sound",
		]);
	});

	it("returns [] for undefined or empty region list", () => {
		expect(
			evaluateRiftRegionEntry({
				tokenId: "t",
				prev: null,
				next: { x: 0, y: 0 },
				regions: undefined,
			}),
		).toEqual([]);
	});
});

describe("RIFT_REGION_PRESETS", () => {
	it("ships at least the 6 documented presets", () => {
		const names = RIFT_REGION_PRESETS.map((p) => p.name);
		expect(names).toContain("Mana Storm");
		expect(names).toContain("Void Bleed");
		expect(names).toContain("Sovereign Aura");
		expect(names).toContain("Sanctum Ward");
		expect(names).toContain("Healing Spring");
		expect(names).toContain("Difficult Terrain");
	});

	it("every preset has at least one behavior", () => {
		for (const preset of RIFT_REGION_PRESETS) {
			expect(preset.behaviors.length).toBeGreaterThan(0);
		}
	});
});
