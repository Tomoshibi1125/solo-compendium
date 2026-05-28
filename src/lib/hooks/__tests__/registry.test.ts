import { describe, expect, it, vi } from "vitest";
import { createHookRegistry } from "@/lib/hooks/registry";

describe("createHookRegistry", () => {
	it("emits to all listeners for the matching kind", () => {
		const bus = createHookRegistry();
		const a = vi.fn();
		const b = vi.fn();
		bus.on("token:created", a);
		bus.on("token:created", b);
		bus.emit("token:created", { tokenId: "t1", sceneId: "s1" });
		expect(a).toHaveBeenCalledTimes(1);
		expect(b).toHaveBeenCalledTimes(1);
		expect(a.mock.calls[0]?.[0]).toEqual({ tokenId: "t1", sceneId: "s1" });
	});

	it("doesn't cross-emit between kinds", () => {
		const bus = createHookRegistry();
		const created = vi.fn();
		const moved = vi.fn();
		bus.on("token:created", created);
		bus.on("token:moved", moved);
		bus.emit("token:created", { tokenId: "t", sceneId: "s" });
		expect(created).toHaveBeenCalledTimes(1);
		expect(moved).not.toHaveBeenCalled();
	});

	it("returns a disposer from on()", () => {
		const bus = createHookRegistry();
		const listener = vi.fn();
		const dispose = bus.on("token:created", listener);
		dispose();
		bus.emit("token:created", { tokenId: "t", sceneId: "s" });
		expect(listener).not.toHaveBeenCalled();
	});

	it("off() removes a specific listener", () => {
		const bus = createHookRegistry();
		const a = vi.fn();
		const b = vi.fn();
		bus.on("token:moved", a);
		bus.on("token:moved", b);
		bus.off("token:moved", a);
		bus.emit("token:moved", {
			tokenId: "t",
			sceneId: "s",
			from: { x: 0, y: 0 },
			to: { x: 1, y: 1 },
		});
		expect(a).not.toHaveBeenCalled();
		expect(b).toHaveBeenCalledTimes(1);
	});

	it("once() fires exactly once then auto-disposes", () => {
		const bus = createHookRegistry();
		const listener = vi.fn();
		bus.once("scene:loaded", listener);
		bus.emit("scene:loaded", { sceneId: "s1", campaignId: "c" });
		bus.emit("scene:loaded", { sceneId: "s2", campaignId: "c" });
		expect(listener).toHaveBeenCalledTimes(1);
	});

	it("freezes the payload so listeners cannot mutate host state", () => {
		const bus = createHookRegistry();
		bus.on("token:created", (payload) => {
			expect(() => {
				(payload as { tokenId: string }).tokenId = "mutated";
			}).toThrow();
		});
		bus.emit("token:created", { tokenId: "t", sceneId: "s" });
	});

	it("a throwing listener does not abort the chain", () => {
		const bus = createHookRegistry();
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const bad = () => {
			throw new Error("boom");
		};
		const good = vi.fn();
		bus.on("roll:submitted", bad);
		bus.on("roll:submitted", good);
		bus.emit("roll:submitted", {
			actor: "Kael",
			formula: "1d20",
			result: 15,
			campaignId: null,
		});
		expect(good).toHaveBeenCalledTimes(1);
		expect(errorSpy).toHaveBeenCalled();
		errorSpy.mockRestore();
	});

	it("disposers fired during emit don't skip the next listener", () => {
		const bus = createHookRegistry();
		const a = vi.fn();
		const b = vi.fn();
		const c = vi.fn();
		const disposeB = bus.on("combat:turnStart", () => {
			a();
			disposeB();
		});
		bus.on("combat:turnStart", b);
		bus.on("combat:turnStart", c);
		bus.emit("combat:turnStart", {
			sessionId: "s",
			round: 1,
			actorTokenId: "t",
		});
		expect(a).toHaveBeenCalled();
		expect(b).toHaveBeenCalled();
		expect(c).toHaveBeenCalled();
	});

	it("listenerCount reports current subscriber count", () => {
		const bus = createHookRegistry();
		expect(bus.listenerCount("token:moved")).toBe(0);
		const dispose = bus.on("token:moved", () => {});
		expect(bus.listenerCount("token:moved")).toBe(1);
		dispose();
		expect(bus.listenerCount("token:moved")).toBe(0);
	});

	it("clear() removes every listener", () => {
		const bus = createHookRegistry();
		bus.on("token:created", () => {});
		bus.on("scene:loaded", () => {});
		bus.clear();
		expect(bus.listenerCount("token:created")).toBe(0);
		expect(bus.listenerCount("scene:loaded")).toBe(0);
	});
});
