import { beforeEach, describe, expect, it, vi } from "vitest";

// Force the offline/guest path so notify() falls back to the local cache.
vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: false,
	supabase: {
		auth: { getUser: async () => ({ data: { user: null } }) },
		rpc: async () => ({ data: null, error: null }),
	},
}));

import {
	loadNotifications,
	NOTIFICATIONS_UPDATED_EVENT,
} from "@/hooks/useNotifications";
import { notify, notifyError } from "@/lib/notify";

describe("notify (local fallback)", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("writes a notification to the local cache when unauthenticated", async () => {
		await notify({ type: "success", title: "Saved", message: "All good" });
		const stored = loadNotifications();
		expect(stored).toHaveLength(1);
		expect(stored[0]).toMatchObject({
			type: "success",
			title: "Saved",
			message: "All good",
			read: false,
		});
	});

	it("maps extended server kinds onto the 4 local visual types", async () => {
		await notify({ type: "campaign_invite", title: "Invite" });
		expect(loadNotifications()[0].type).toBe("success");
	});

	it("dispatches the live-refresh window event", async () => {
		const handler = vi.fn();
		window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handler);
		await notify({ title: "Hi" });
		expect(handler).toHaveBeenCalledTimes(1);
		window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handler);
	});

	it("notifyError defaults to high priority", async () => {
		await notifyError("Boom");
		expect(loadNotifications()[0]).toMatchObject({
			type: "error",
			priority: "high",
		});
	});
});
