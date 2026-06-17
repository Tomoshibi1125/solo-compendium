import { describe, expect, it, vi } from "vitest";

// Stub Pixi's Sprite + Graphics so the renderer runs without a GPU/WebGL.
vi.mock("pixi.js", () => {
	class StubPoint {
		x = 0;
		y = 0;
		set(x: number, y?: number) {
			this.x = x;
			this.y = y ?? x;
		}
	}
	class StubSprite {
		texture: unknown;
		anchor = new StubPoint();
		position = new StubPoint();
		scale = new StubPoint();
		tint = 0xffffff;
		alpha = 1;
		rotation = 0;
		parent: StubContainer | null = null;
		destroyed = false;
		constructor(texture: unknown) {
			this.texture = texture;
		}
		destroy() {
			this.destroyed = true;
			this.parent?.removeChild(this);
			this.parent = null;
		}
	}
	class StubGraphics {
		alpha = 1;
		parent: StubContainer | null = null;
		destroyed = false;
		rect() {
			return this;
		}
		fill() {
			return this;
		}
		destroy() {
			this.destroyed = true;
			this.parent?.removeChild(this);
			this.parent = null;
		}
	}
	return { Sprite: StubSprite, Graphics: StubGraphics };
});

class StubContainer {
	children: Array<{ parent: StubContainer | null }> = [];
	addChild<T extends { parent: StubContainer | null }>(child: T): T {
		this.children.push(child);
		child.parent = this;
		return child;
	}
	removeChild<T extends { parent: StubContainer | null }>(child: T): T {
		const index = this.children.indexOf(child);
		if (index >= 0) this.children.splice(index, 1);
		return child;
	}
}

import { createWeatherEmitter } from "@/lib/vtt/pixiWeather";

const makeLayer = () =>
	new StubContainer() as unknown as Parameters<
		typeof createWeatherEmitter
	>[0] & {
		children: unknown[];
	};
const texture = {} as unknown as Parameters<
	typeof createWeatherEmitter
>[1]["texture"];

describe("createWeatherEmitter", () => {
	it("builds a budget-scaled particle pool for precipitation types", () => {
		const layer = makeLayer();
		createWeatherEmitter(layer, {
			type: "rain",
			width: 800,
			height: 600,
			texture,
			particleCount: 10,
		});
		// rain design count 80 × (budget 10 / 40) = 20.
		expect(layer.children.length).toBe(20);
	});

	it("scales with the performance budget and clamps to safe bounds", () => {
		const low = makeLayer();
		createWeatherEmitter(low, {
			type: "rain",
			width: 800,
			height: 600,
			texture,
			particleCount: 0,
		});
		expect(low.children.length).toBe(6); // floor

		const high = makeLayer();
		createWeatherEmitter(high, {
			type: "blizzard",
			width: 800,
			height: 600,
			texture,
			particleCount: 200,
		});
		// blizzard 300 × 200/40 = 1500 → clamped to 400.
		expect(high.children.length).toBe(400);
	});

	it("renders fog as a single tint layer, not a particle field", () => {
		const layer = makeLayer();
		createWeatherEmitter(layer, {
			type: "fog",
			width: 800,
			height: 600,
			texture,
			particleCount: 40,
		});
		expect(layer.children.length).toBe(1);
	});

	it("renders nothing for clear / wind", () => {
		for (const type of ["clear", "wind"] as const) {
			const layer = makeLayer();
			createWeatherEmitter(layer, {
				type,
				width: 800,
				height: 600,
				texture,
				particleCount: 40,
			});
			expect(layer.children.length).toBe(0);
		}
	});

	it("advances particles on update; ignores non-positive and oversized deltas", () => {
		const layer = makeLayer();
		const emitter = createWeatherEmitter(layer, {
			type: "snow",
			width: 800,
			height: 600,
			texture,
			particleCount: 40,
		});
		const before = (
			layer.children as Array<{ position: { x: number; y: number } }>
		).map((c) => ({ x: c.position.x, y: c.position.y }));
		expect(() => emitter.update(16)).not.toThrow();
		const after = (
			layer.children as Array<{ position: { x: number; y: number } }>
		).map((c) => ({ x: c.position.x, y: c.position.y }));
		expect(
			after.some((p, i) => p.x !== before[i].x || p.y !== before[i].y),
		).toBe(true);
		expect(() => emitter.update(0)).not.toThrow();
		expect(() => emitter.update(100000)).not.toThrow();
	});

	it("destroys all display objects and no-ops after destroy", () => {
		const layer = makeLayer();
		const emitter = createWeatherEmitter(layer, {
			type: "ash_fall",
			width: 800,
			height: 600,
			texture,
			particleCount: 40,
		});
		const sprites = [...(layer.children as Array<{ destroyed: boolean }>)];
		expect(sprites.length).toBeGreaterThan(0);
		emitter.destroy();
		expect(sprites.every((s) => s.destroyed)).toBe(true);
		expect(layer.children.length).toBe(0);
		expect(() => emitter.update(16)).not.toThrow();
	});
});
