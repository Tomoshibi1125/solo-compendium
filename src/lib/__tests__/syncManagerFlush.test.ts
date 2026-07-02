import { beforeEach, describe, expect, it, vi } from "vitest";

// idb-keyval queue backing store.
const getMock = vi.fn(async () => [] as unknown[]);
const setMock = vi.fn(async (_value: unknown) => undefined);
vi.mock("idb-keyval", () => ({
	get: () => getMock(),
	set: (_key: string, value: unknown) => setMock(value),
}));

// Supabase write chain: supabase.from(t).update(d).eq(c, v)[.eq(c, v)] → { error }.
// Each .eq() returns a promise (awaitable at any depth) with a further .eq
// attached, matching the real client's builder.
const eqCalls: Array<[string, string]> = [];
let updatePayload: Record<string, unknown> | null = null;
let chainError: Error | null = null;
type ChainResult = Promise<{ error: Error | null }> & {
	eq: (column: string, value: string) => ChainResult;
};
const chainEq = vi.fn((column: string, value: string): ChainResult => {
	eqCalls.push([column, value]);
	const result = Promise.resolve({ error: chainError }) as ChainResult;
	result.eq = chainEq;
	return result;
});
const updateMock = vi.fn((payload: Record<string, unknown>) => {
	updatePayload = payload;
	return { eq: chainEq };
});
const fromMock = vi.fn((_t: string) => ({ update: updateMock }));
const rpcMock = vi.fn(async () => ({ error: null as Error | null }));
const getUserMock = vi.fn(async () => ({
	data: { user: { id: "user-1" } as { id: string } | null },
}));
vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		from: (t: string) => fromMock(t),
		rpc: (...args: unknown[]) => rpcMock(...(args as [])),
		auth: { getUser: () => getUserMock() },
	},
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

beforeEach(() => {
	getMock.mockReset();
	getMock.mockResolvedValue([]);
	setMock.mockClear();
	chainEq.mockClear();
	eqCalls.length = 0;
	chainError = null;
	updatePayload = null;
	updateMock.mockClear();
	fromMock.mockClear();
	rpcMock.mockClear();
	rpcMock.mockResolvedValue({ error: null });
	getUserMock.mockClear();
	getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } } });
	Object.defineProperty(navigator, "onLine", {
		value: true,
		configurable: true,
	});
});

describe("flushSyncQueue — FlushResult", () => {
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
		chainError = new Error("boom");
		const result = await flushSyncQueue();
		expect(result.failed).toBe(1);
		expect(result.success).toBe(0);
		expect(result.remaining).toBe(1); // retryCount 1 < 3 → kept
	});
});

describe("flushSyncQueue — consolidated processors (ex-BackgroundSyncManager)", () => {
	it("character updates strip protected fields and scope to the owner", async () => {
		getMock.mockResolvedValueOnce([
			{
				id: "q1",
				type: "character" as const,
				action: "update" as const,
				data: {
					id: "character-1",
					user_id: "other-user",
					created_at: "2025-01-01T00:00:00.000Z",
					name: "Updated Ascendant",
				},
				timestamp: 1,
				retryCount: 0,
			},
		]);

		const result = await flushSyncQueue();
		expect(result.success).toBe(1);
		expect(fromMock).toHaveBeenCalledWith("characters");
		expect(updatePayload).toEqual(
			expect.objectContaining({
				name: "Updated Ascendant",
				updated_at: expect.any(String),
			}),
		);
		expect(updatePayload).not.toHaveProperty("id");
		expect(updatePayload).not.toHaveProperty("user_id");
		expect(updatePayload).not.toHaveProperty("created_at");
		expect(eqCalls).toEqual([
			["id", "character-1"],
			["user_id", "user-1"],
		]);
	});

	it("campaign_session log entries route through the session-log RPC", async () => {
		getMock.mockResolvedValueOnce([
			{
				id: "q2",
				type: "campaign_session" as const,
				action: "create" as const,
				data: {
					mode: "log",
					campaign_id: "camp-1",
					title: "Session 3",
					content: "The party breached the Threshold.",
				},
				timestamp: 1,
				retryCount: 0,
			},
		]);

		const result = await flushSyncQueue();
		expect(result.success).toBe(1);
		expect(rpcMock).toHaveBeenCalledWith(
			"add_campaign_session_log",
			expect.objectContaining({
				p_campaign_id: "camp-1",
				p_title: "Session 3",
			}),
		);
	});

	it("marketplace reviews route through the review RPC with the auth user", async () => {
		getMock.mockResolvedValueOnce([
			{
				id: "q3",
				type: "marketplace" as const,
				action: "update" as const,
				data: { mode: "review", item_id: "item-1", rating: 4 },
				timestamp: 1,
				retryCount: 0,
			},
		]);

		const result = await flushSyncQueue();
		expect(result.success).toBe(1);
		expect(rpcMock).toHaveBeenCalledWith(
			"upsert_marketplace_review",
			expect.objectContaining({
				p_item_id: "item-1",
				p_rating: 4,
				p_user_id: "user-1",
			}),
		);
	});

	it("fails (for retry) instead of writing when unauthenticated", async () => {
		getUserMock.mockResolvedValueOnce({ data: { user: null } });
		getMock.mockResolvedValueOnce([charUpdate("c1")]);
		const result = await flushSyncQueue();
		expect(result.failed).toBe(1);
		expect(updateMock).not.toHaveBeenCalled();
	});
});
