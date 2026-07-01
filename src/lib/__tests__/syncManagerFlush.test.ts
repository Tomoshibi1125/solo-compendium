import { beforeEach, describe, expect, it, vi } from "vitest";

// idb-keyval queue backing store.
const getMock = vi.fn(async () => [] as unknown[]);
const setMock = vi.fn(async (_value: unknown) => undefined);
vi.mock("idb-keyval", () => ({
	get: () => getMock(),
	set: (_key: string, value: unknown) => setMock(value),
}));

// Supabase write chain: supabase.from(t).update(d).eq(c, v) → { error }.
const eqMock = vi.fn(async () => ({ error: null as Error | null }));
const updateMock = vi.fn(() => ({ eq: eqMock }));
const fromMock = vi.fn((_t: string) => ({ update: updateMock }));
vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: { from: (t: string) => fromMock(t) },
}));

// Pass-through the character enrichment helpers so processItem stays simple.
vi.mock("@/lib/canonicalCompendium", () => ({
	resolveCharacterCanonicalIds: async (x: unknown) => x,
}));
vi.mock("@/lib/characterOverlayValidation", () => ({
	normalizeCharacterOverlayFields: async (x: unknown) => x,
}));

import { type FlushResult, flushSyncQueue } from "@/lib/syncManager";

const charUpdate = (id: string) => ({
	id: `character_update_${id}`,
	type: "character" as const,
	action: "update" as const,
	data: { id, name: `Name-${id}` },
	timestamp: 1,
	retryCount: 0,
});

const EMPTY: FlushResult = { success: 0, failed: 0, remaining: 0 };

describe("flushSyncQueue — FlushResult", () => {
	beforeEach(() => {
		getMock.mockReset();
		getMock.mockResolvedValue([]);
		setMock.mockClear();
		eqMock.mockReset();
		eqMock.mockResolvedValue({ error: null });
		updateMock.mockClear();
		fromMock.mockClear();
		Object.defineProperty(navigator, "onLine", {
			value: true,
			configurable: true,
		});
	});

	it("returns an empty result when offline", async () => {
		Object.defineProperty(navigator, "onLine", {
			value: false,
			configurable: true,
		});
		expect(await flushSyncQueue()).toEqual(EMPTY);
	});

	it("returns an empty result when the queue is empty", async () => {
		getMock.mockResolvedValueOnce([]);
		expect(await flushSyncQueue()).toEqual(EMPTY);
	});

	it("counts successes and clears the queue on a clean flush", async () => {
		getMock.mockResolvedValueOnce([charUpdate("c1"), charUpdate("c2")]);
		const result = await flushSyncQueue();
		expect(result).toEqual({ success: 2, failed: 0, remaining: 0 });
		expect(setMock).toHaveBeenCalledWith([]); // nothing requeued
	});

	it("counts failures and requeues them for retry", async () => {
		getMock.mockResolvedValueOnce([charUpdate("c1")]);
		eqMock.mockResolvedValueOnce({ error: new Error("boom") });
		const result = await flushSyncQueue();
		expect(result.failed).toBe(1);
		expect(result.success).toBe(0);
		expect(result.remaining).toBe(1); // retryCount 1 < 3 → kept
	});
});
