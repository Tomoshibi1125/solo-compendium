import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

const { channelHandlers, freshSharedChannel, toast } = vi.hoisted(() => {
	const channelHandlers = new Map<string, (payload: unknown) => void>();
	const channel = {
		on(
			kind: string,
			filter: { event: string },
			callback: (payload: unknown) => void,
		) {
			channelHandlers.set(`${kind}:${filter.event}`, callback);
			return this;
		},
		subscribe(callback: (status: string) => void) {
			callback("SUBSCRIBED");
			return this;
		},
		unsubscribe: vi.fn(),
		track: vi.fn(),
		send: vi.fn(),
	};
	return {
		channelHandlers,
		freshSharedChannel: vi.fn(() => channel),
		toast: vi.fn(),
	};
});

vi.mock("@/lib/realtimeChannel", () => ({ freshSharedChannel }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast }) }));
vi.mock("@/lib/auth/authContext", () => ({
	useAuth: () => ({ user: { id: "user-1", email: "warden@example.test" } }),
}));

import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("useRealtimeCollaboration", () => {
	afterEach(() => {
		channelHandlers.clear();
		vi.clearAllMocks();
	});

	it("updates presence without reconnecting or repeating join and leave pop-ups", () => {
		const holder: {
			current: ReturnType<typeof useRealtimeCollaboration> | null;
		} = {
			current: null,
		};
		const Probe = () => {
			holder.current = useRealtimeCollaboration("campaign-1");
			return null;
		};
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);
		try {
			act(() => root.render(<Probe />));
			expect(freshSharedChannel).toHaveBeenCalledTimes(1);
			const join = channelHandlers.get("presence:join");
			const leave = channelHandlers.get("presence:leave");
			if (!join || !leave)
				throw new Error("Presence handlers were not registered");

			act(() =>
				join({
					key: "user-2",
					newPresences: [{ user_id: "user-2", user_name: "Ascendant" }],
				}),
			);
			expect(holder.current?.activeUsers.map((user) => user.name)).toEqual([
				"Ascendant",
			]);
			expect(freshSharedChannel).toHaveBeenCalledTimes(1);

			act(() => leave({ key: "user-2", leftPresences: [] }));
			expect(holder.current?.activeUsers).toEqual([]);
			expect(freshSharedChannel).toHaveBeenCalledTimes(1);
			expect(toast).not.toHaveBeenCalled();
		} finally {
			act(() => root.unmount());
			container.remove();
		}
	});
});
