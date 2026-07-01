import { beforeEach, describe, expect, it, vi } from "vitest";

// Server path enabled so we exercise the RPC + userId targeting (the consolidated
// single-producer behaviour). A distinct file from notify.test.ts because the
// supabase mock differs (that one forces the offline/local fallback).
const rpcSpy = vi.fn(
	async (_name: string, _params: Record<string, unknown>) => ({
		data: "note-id" as string | null,
		error: null as Error | null,
	}),
);
const getUserMock = vi.fn(async () => ({
	data: { user: { id: "current-user" } },
}));

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		auth: { getUser: () => getUserMock() },
		rpc: (name: string, params: Record<string, unknown>) =>
			rpcSpy(name, params),
	},
}));

import { loadNotifications } from "@/hooks/useNotifications";
import { notify } from "@/lib/notify";

describe("notify — server path + userId targeting", () => {
	beforeEach(() => {
		localStorage.clear();
		rpcSpy.mockClear();
		rpcSpy.mockResolvedValue({ data: "note-id", error: null });
		getUserMock.mockClear();
	});

	it("sends to the current user by default (no local fallback on success)", async () => {
		await notify({ type: "success", title: "Saved" });
		expect(rpcSpy).toHaveBeenCalledWith(
			"add_user_notification",
			expect.objectContaining({
				p_user_id: "current-user",
				p_type: "success",
				p_title: "Saved",
			}),
		);
		expect(loadNotifications()).toHaveLength(0);
	});

	it("routes to an explicit recipient when userId is set", async () => {
		await notify({ userId: "other-user", type: "mention", title: "@you" });
		expect(rpcSpy).toHaveBeenCalledWith(
			"add_user_notification",
			expect.objectContaining({ p_user_id: "other-user", p_type: "mention" }),
		);
	});

	it("never writes to the local cache when targeting another user, even on failure", async () => {
		rpcSpy.mockResolvedValueOnce({ data: null, error: new Error("boom") });
		await notify({ userId: "other-user", title: "x" });
		expect(loadNotifications()).toHaveLength(0);
	});

	it("falls back to the local cache for the current user when the server fails", async () => {
		rpcSpy.mockResolvedValueOnce({ data: null, error: new Error("boom") });
		await notify({ title: "self fallback" });
		expect(loadNotifications()).toHaveLength(1);
		expect(loadNotifications()[0]).toMatchObject({ title: "self fallback" });
	});
});
