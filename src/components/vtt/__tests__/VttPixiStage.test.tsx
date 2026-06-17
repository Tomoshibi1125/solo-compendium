import { act, createRef, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Hoisted control surface shared with the pixi.js mock factory.
const h = vi.hoisted(() => ({
	initImpl: { fn: (..._args: unknown[]): Promise<void> => Promise.resolve() },
	flags: { strokeThrows: false },
	counts: { text: 0, graphics: 0, container: 0 },
	destroyed: { containers: 0 },
}));

// Mock pixi.js so the stage can be exercised in jsdom (no WebGL). Every display
// object is a minimal no-op stub; Application.init is driven per-test.
vi.mock("pixi.js", () => {
	class Base {
		children: unknown[] = [];
		position = { set: () => {} };
		scale = { set: () => {} };
		anchor = { set: () => {} };
		zIndex = 0;
		x = 0;
		y = 0;
		width = 0;
		height = 0;
		rotation = 0;
		alpha = 1;
		eventMode = "auto";
		cursor = "default";
		visible = true;
		sortableChildren = false;
		blendMode = "normal";
		mask: unknown = null;
		tint = 0xffffff;
		addChild = (c: unknown) => {
			this.children.push(c);
			return c;
		};
		removeChild = (c: unknown) => c;
		removeChildren = () => {
			// Pixi v8 returns the removed children array; mirror that so callers
			// that iterate the result (reconciliation cleanup) work.
			const removed = this.children;
			this.children = [];
			return removed;
		};
		on = () => this;
		destroy = () => {};
	}
	class Container extends Base {
		constructor() {
			super();
			h.counts.container += 1;
		}
		destroy = () => {
			h.destroyed.containers += 1;
		};
	}
	class Graphics extends Base {
		constructor() {
			super();
			h.counts.graphics += 1;
		}
		clear = () => this;
		circle = () => this;
		rect = () => this;
		moveTo = () => this;
		lineTo = () => this;
		arc = () => this;
		closePath = () => this;
		fill = () => this;
		stroke = () => {
			if (h.flags.strokeThrows) throw new Error("stroke boom");
			return this;
		};
	}
	class Sprite extends Base {
		static from = () => new Sprite();
	}
	class Text extends Base {
		style: Record<string, unknown> = {};
		text = "";
		constructor(_opts?: unknown) {
			super();
			h.counts.text += 1;
		}
	}
	class Ticker {
		add = () => this;
		start = () => {};
		stop = () => {};
		destroy = () => {};
	}
	class Application {
		canvas = document.createElement("canvas");
		stage = new Container();
		renderer = { resize: () => {}, generateTexture: () => ({}) };
		init = (...args: unknown[]) => h.initImpl.fn(...args);
		destroy = () => {};
	}
	const Assets = { load: () => Promise.resolve({}) };
	const Texture = { from: () => ({}) };
	return {
		Application,
		Assets,
		Container,
		Graphics,
		Sprite,
		Text,
		Texture,
		Ticker,
	};
});

vi.mock("@/lib/performanceProfile", () => ({
	usePerformanceProfile: () => ({ dpr: [1, 2], fx: { particleCount: 10 } }),
}));

import { VttPixiStage } from "@/components/vtt/VttPixiStage";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type SceneArg = NonNullable<React.ComponentProps<typeof VttPixiStage>["scene"]>;

const makeScene = (overrides: Partial<SceneArg> = {}): SceneArg =>
	({
		width: 10,
		height: 10,
		fogOfWar: false,
		gridOpacity: 0.2,
		...overrides,
	}) as SceneArg;

/** Mount the stage with a container ref whose measured size we control. */
function mountStage(opts: {
	containerWidth: number;
	containerHeight: number;
	scene?: SceneArg | null;
	showGrid?: boolean;
	onInitError?: (err: unknown) => void;
}) {
	const containerEl = document.createElement("div");
	Object.defineProperty(containerEl, "clientWidth", {
		value: opts.containerWidth,
		configurable: true,
	});
	Object.defineProperty(containerEl, "clientHeight", {
		value: opts.containerHeight,
		configurable: true,
	});
	document.body.appendChild(containerEl);
	const containerRef = createRef<HTMLDivElement>();
	(containerRef as { current: HTMLDivElement }).current = containerEl;

	const root = createRoot(containerEl);
	const node: ReactElement = (
		<VttPixiStage
			containerRef={containerRef}
			scene={opts.scene ?? null}
			tokens={[]}
			gridSize={50}
			zoom={1}
			showGrid={opts.showGrid ?? false}
			isWarden={false}
			effectiveVisibleLayers={{ 0: true, 1: true, 2: true, 3: true }}
			activeTokenId={null}
			setActiveTokenId={() => undefined}
			updateToken={() => undefined}
			onRequestZoom={() => undefined}
			onInitError={opts.onInitError}
		/>
	);
	act(() => {
		root.render(node);
	});
	const host = () =>
		containerEl.querySelector<HTMLElement>('[data-testid="vtt-pixi-host"]');
	return {
		host,
		status: () => host()?.getAttribute("data-renderer-status") ?? null,
		unmount: () => {
			act(() => root.unmount());
			containerEl.remove();
		},
	};
}

const flush = async (ms: number) => {
	await act(async () => {
		await vi.advanceTimersByTimeAsync(ms);
	});
};

describe("VttPixiStage renderer lifecycle", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		h.initImpl.fn = () => Promise.resolve();
		h.flags.strokeThrows = false;
		h.counts = { text: 0, graphics: 0, container: 0 };
		h.destroyed = { containers: 0 };
		// These tests intentionally drive failure paths that log diagnostics;
		// silence the expected console noise so CI output stays readable.
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("reaches 'ready' under a normal (sized) layout", async () => {
		const onInitError = vi.fn();
		const stage = mountStage({
			containerWidth: 1280,
			containerHeight: 800,
			onInitError,
		});
		await flush(500);
		expect(stage.status()).toBe("ready");
		expect(onInitError).not.toHaveBeenCalled();
		stage.unmount();
	});

	it("reports 'failed' and calls onInitError when init rejects", async () => {
		h.initImpl.fn = () =>
			Promise.reject(new Error("WebGL context creation failed"));
		const onInitError = vi.fn();
		const stage = mountStage({
			containerWidth: 1280,
			containerHeight: 800,
			onInitError,
		});
		await flush(500);
		expect(stage.status()).toBe("failed");
		expect(onInitError).toHaveBeenCalledTimes(1);
		stage.unmount();
	});

	it("does not hang on 'waiting-for-layout' — times out to fallback when the container never sizes", async () => {
		const onInitError = vi.fn();
		const stage = mountStage({
			containerWidth: 0,
			containerHeight: 0,
			onInitError,
		});
		// Before the watchdog fires, it should still be waiting (not failed).
		await flush(500);
		expect(stage.status()).toBe("waiting-for-layout");
		expect(onInitError).not.toHaveBeenCalled();
		// After the layout-timeout budget, it must hand off to the fallback.
		await flush(4200);
		expect(stage.status()).toBe("layout-timeout");
		expect(onInitError).toHaveBeenCalledTimes(1);
		expect(String(onInitError.mock.calls[0][0])).toMatch(/layout-timeout/i);
		stage.unmount();
	});

	it("converts a render-phase throw into 'render-error' instead of crashing", async () => {
		h.flags.strokeThrows = true;
		const onInitError = vi.fn();
		const stage = mountStage({
			containerWidth: 1280,
			containerHeight: 800,
			scene: makeScene(),
			showGrid: true,
			onInitError,
		});
		await flush(500);
		expect(stage.status()).toBe("render-error");
		expect(onInitError).toHaveBeenCalled();
		expect(String(onInitError.mock.calls[0][0])).toMatch(/render-error/i);
		stage.unmount();
	});
});

describe("VttPixiStage token reconciliation", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		h.initImpl.fn = () => Promise.resolve();
		h.flags.strokeThrows = false;
		h.counts = { text: 0, graphics: 0, container: 0 };
		h.destroyed = { containers: 0 };
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	type TokenArg = React.ComponentProps<typeof VttPixiStage>["tokens"][number];
	const makeToken = (id: string, over: Partial<TokenArg> = {}): TokenArg =>
		({
			id,
			name: id,
			size: "medium",
			x: 1,
			y: 1,
			rotation: 0,
			layer: 1,
			locked: false,
			visible: true,
			// Use an image so the token uses the sprite branch (no emoji Text),
			// keeping the Text counter limited to reusable nameplates.
			imageUrl: "token.png",
			...over,
		}) as TokenArg;

	function mountTokens() {
		const containerEl = document.createElement("div");
		Object.defineProperty(containerEl, "clientWidth", {
			value: 1280,
			configurable: true,
		});
		Object.defineProperty(containerEl, "clientHeight", {
			value: 800,
			configurable: true,
		});
		document.body.appendChild(containerEl);
		const containerRef = createRef<HTMLDivElement>();
		(containerRef as { current: HTMLDivElement }).current = containerEl;
		// Stable refs so re-rendering only the token list does not re-run the
		// static-layer effect (keeps the object counters attributable to tokens).
		const scene = makeScene();
		const layers = { 0: true, 1: true, 2: true, 3: true };
		const root = createRoot(containerEl);
		const render = (
			tokens: TokenArg[],
			activeTokenId: string | null = null,
		) => {
			act(() => {
				root.render(
					<VttPixiStage
						containerRef={containerRef}
						scene={scene}
						tokens={tokens}
						gridSize={50}
						zoom={1}
						showGrid={false}
						isWarden
						effectiveVisibleLayers={layers}
						activeTokenId={activeTokenId}
						setActiveTokenId={() => undefined}
						updateToken={() => undefined}
						onRequestZoom={() => undefined}
					/>,
				);
			});
		};
		const host = () =>
			containerEl.querySelector<HTMLElement>('[data-testid="vtt-pixi-host"]');
		return {
			render,
			status: () => host()?.getAttribute("data-renderer-status") ?? null,
			unmount: () => {
				act(() => root.unmount());
				containerEl.remove();
			},
		};
	}

	it("skips unchanged tokens on re-render (no new objects)", async () => {
		const stage = mountTokens();
		stage.render([makeToken("a"), makeToken("b")]);
		await flush(500);
		expect(stage.status()).toBe("ready");
		const snap = { ...h.counts };
		// Re-render with a fresh array of equal-content tokens.
		stage.render([makeToken("a"), makeToken("b")]);
		await flush(200);
		expect(h.counts.container).toBe(snap.container);
		expect(h.counts.text).toBe(snap.text);
		expect(h.counts.graphics).toBe(snap.graphics);
		stage.unmount();
	});

	it("rebuilds only the changed token and reuses its nameplate", async () => {
		const stage = mountTokens();
		stage.render([makeToken("a"), makeToken("b")]);
		await flush(500);
		const snap = { ...h.counts };
		// Move token "a" only.
		stage.render([makeToken("a", { x: 5 }), makeToken("b")]);
		await flush(200);
		// The changed token redraws graphics, but reuses its container and its
		// nameplate Text (the costly object).
		expect(h.counts.graphics).toBeGreaterThan(snap.graphics);
		expect(h.counts.container).toBe(snap.container);
		expect(h.counts.text).toBe(snap.text);
		stage.unmount();
	});

	it("destroys containers for removed tokens", async () => {
		const stage = mountTokens();
		stage.render([makeToken("a"), makeToken("b")]);
		await flush(500);
		const before = h.destroyed.containers;
		stage.render([makeToken("a")]); // remove "b"
		await flush(200);
		expect(h.destroyed.containers).toBeGreaterThan(before);
		stage.unmount();
	});
});
