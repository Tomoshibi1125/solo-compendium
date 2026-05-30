import { describe, expect, it } from "vitest";
import { sceneToThreeDescriptor } from "@/lib/vtt/threeAdapters";
import type { VTTScene } from "@/types/vtt";

const baseScene = (overrides: Partial<VTTScene> = {}): VTTScene => ({
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
	...overrides,
});

describe("sceneToThreeDescriptor", () => {
	it("synthesizes a default ground stratum for legacy scenes", () => {
		const d = sceneToThreeDescriptor(baseScene());
		expect(d.strata).toHaveLength(1);
		expect(d.strata[0].id).toBe("stratum-ground");
		expect(d.strata[0].groundY).toBe(0);
	});

	it("converts wall pixel coords into grid units", () => {
		const d = sceneToThreeDescriptor(
			baseScene({
				walls: [{ id: "w1", x1: 0, y1: 0, x2: 100, y2: 0, type: "wall" }],
			}),
		);
		expect(d.walls).toHaveLength(1);
		expect(d.walls[0].from).toEqual({ x: 0, z: 0 });
		expect(d.walls[0].to).toEqual({ x: 2, z: 0 });
	});

	it("uses reduced height for windows and ethereal walls", () => {
		const d = sceneToThreeDescriptor(
			baseScene({
				walls: [
					{ id: "wall", x1: 0, y1: 0, x2: 50, y2: 0, type: "wall" },
					{ id: "win", x1: 0, y1: 0, x2: 50, y2: 0, type: "window" },
					{ id: "eth", x1: 0, y1: 0, x2: 50, y2: 0, type: "ethereal" },
				],
			}),
		);
		const wall = d.walls.find((w) => w.id === "wall");
		const window = d.walls.find((w) => w.id === "win");
		const ethereal = d.walls.find((w) => w.id === "eth");
		expect(wall?.height).toBeGreaterThan(window?.height ?? Infinity);
		expect(window?.height).toBeGreaterThan(ethereal?.height ?? Infinity);
	});

	it("stacks strata by order with vertical separation", () => {
		const d = sceneToThreeDescriptor(
			baseScene({
				levels: [
					{
						id: "ground",
						name: "Surface",
						elevation: 0,
						order: 0,
						visibleToPlayers: true,
						wallIds: [],
						lightIds: [],
					},
					{
						id: "roof",
						name: "Roof",
						elevation: 3,
						order: 1,
						visibleToPlayers: true,
						wallIds: [],
						lightIds: [],
					},
				],
			}),
		);
		expect(d.strata).toHaveLength(2);
		expect(d.strata[0].groundY).toBeLessThan(d.strata[1].groundY);
	});

	it("scopes tokens by their level for groundY computation", () => {
		const d = sceneToThreeDescriptor(
			baseScene({
				levels: [
					{
						id: "ground",
						name: "Surface",
						elevation: 0,
						order: 0,
						visibleToPlayers: true,
						wallIds: [],
						lightIds: [],
					},
					{
						id: "roof",
						name: "Roof",
						elevation: 3,
						order: 1,
						visibleToPlayers: true,
						wallIds: [],
						lightIds: [],
					},
				],
				tokens: [
					{
						id: "t1",
						name: "Surface walker",
						x: 1,
						y: 1,
						rotation: 0,
						layer: 0,
						locked: false,
						visible: true,
						size: "medium",
						level: "ground",
					},
					{
						id: "t2",
						name: "Roof walker",
						x: 2,
						y: 2,
						rotation: 0,
						layer: 0,
						locked: false,
						visible: true,
						size: "medium",
						level: "roof",
					},
				],
			}),
		);
		const t1 = d.tokens.find((t) => t.id === "t1");
		const t2 = d.tokens.find((t) => t.id === "t2");
		expect(t1?.position.y).toBeLessThan(t2?.position.y ?? -Infinity);
	});
});
