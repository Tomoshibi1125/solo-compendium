import { describe, expect, it, vi } from "vitest";

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
		visible = true;
		blendMode = "normal";
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
	return { Sprite: StubSprite };
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

import { createEffect, EFFECT_PRESETS } from "@/lib/vtt/pixiEffects";

const makeLayer = () =>
	new StubContainer() as unknown as Parameters<typeof createEffect>[0] & {
		children: unknown[];
	};
const texture = {} as unknown as Parameters<typeof createEffect>[1]["texture"];

describe("createEffect", () => {
	it("spawns a budget-scaled burst for every preset", () => {
		for (const preset of EFFECT_PRESETS) {
			const layer = makeLayer();
			createEffect(layer, {
				preset,
				cx: 100,
				cy: 100,
				cell: 50,
				texture,
				particleCount: 20,
			});
			expect(layer.children.length).toBeGreaterThan(0);
			expect(layer.children.length).toBeLessThanOrEqual(70);
		}
	});

	it("advances particles and reports finished once they expire", () => {
		const layer = makeLayer();
		const effect = createEffect(layer, {
			preset: "impact",
			cx: 100,
			cy: 100,
			cell: 50,
			texture,
			particleCount: 20,
		});
		expect(effect.update(16)).toBe(true); // still alive shortly after spawn
		// Impact particles live <0.5s; advancing ~1s must finish the burst.
		let alive = true;
		for (let i = 0; i < 40 && alive; i++) {
			alive = effect.update(50);
		}
		expect(alive).toBe(false);
		effect.destroy();
	});

	it("destroys all sprites and no-ops afterward", () => {
		const layer = makeLayer();
		const effect = createEffect(layer, {
			preset: "magic",
			cx: 0,
			cy: 0,
			cell: 50,
			texture,
			particleCount: 20,
		});
		const sprites = [...(layer.children as Array<{ destroyed: boolean }>)];
		expect(sprites.length).toBeGreaterThan(0);
		effect.destroy();
		expect(sprites.every((s) => s.destroyed)).toBe(true);
		expect(layer.children.length).toBe(0);
		expect(effect.update(16)).toBe(false);
	});
});
