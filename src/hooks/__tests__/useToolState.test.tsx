import type React from "react";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/authContext", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		from: vi.fn(),
	},
}));

import { usePreferredCampaignSelection } from "@/hooks/usePreferredCampaignSelection";
import { useCampaignToolState, useUserToolState } from "@/hooks/useToolState";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

type ProbeState = {
	value: number;
};

type ProbeSnapshot = {
	state: ProbeState;
	isLoading: boolean;
	saveNow: (nextState?: ProbeState) => Promise<void>;
};

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let remoteUserState: ProbeState | null = null;
let remoteCampaignState: ProbeState | null = null;
const upsertCalls: Array<{ table: string; payload: Record<string, unknown> }> = [];
let storage: Storage;

const createMemoryStorage = (): Storage => {
	const store = new Map<string, string>();

	return {
		getItem: (key: string) =>
			store.has(key) ? (store.get(key) ?? null) : null,
		setItem: (key: string, value: string) => {
			store.set(key, String(value));
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		clear: () => {
			store.clear();
		},
		key: (index: number) => Array.from(store.keys())[index] ?? null,
		get length() {
			return store.size;
		},
	} as Storage;
};

const resolveMaybeSingle = (
	table: string,
): { data: { state: ProbeState } | null; error: null } => {
	if (table === "user_tool_states") {
		return {
			data: remoteUserState ? { state: remoteUserState } : null,
			error: null,
		};
	}
	if (table === "campaign_tool_states") {
		return {
			data: remoteCampaignState ? { state: remoteCampaignState } : null,
			error: null,
		};
	}
	return { data: null, error: null };
};

const createFromChain = (table: string) => {
	const selectChain = {
		eq: () => selectChain,
		maybeSingle: async () => resolveMaybeSingle(table),
	};

	return {
		select: () => selectChain,
		upsert: async (payload: Record<string, unknown>) => {
			upsertCalls.push({ table, payload });
			return { error: null };
		},
	};
};

const requireSnapshot = (snapshot: ProbeSnapshot | null): ProbeSnapshot => {
	if (!snapshot) {
		throw new Error("Expected probe snapshot to be available");
	}
	return snapshot;
};

const useAuthMock = vi.mocked(useAuth);
const fromMock = vi.mocked(supabase.from);

const mockAuth = (userId: string | null) => {
	useAuthMock.mockReturnValue({
		user: userId ? ({ id: userId } as never) : null,
		loading: false,
	} as unknown as ReturnType<typeof useAuth>);
};

const tick = async () => {
	await act(async () => {
		await Promise.resolve();
	});
};

const waitUntil = async (predicate: () => boolean, timeoutMs = 1500) => {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		await tick();
		if (predicate()) return;
	}
	throw new Error("Timed out waiting for condition");
};

const mount = (element: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);

	act(() => {
		root.render(element);
	});

	return () => {
		act(() => {
			root.unmount();
		});
		container.remove();
	};
};

const UserProbe = ({
	storageKey,
	onSnapshot,
}: {
	storageKey: string;
	onSnapshot: (snapshot: ProbeSnapshot) => void;
}) => {
	const result = useUserToolState<ProbeState>("tool_stateuser_probe", {
		initialState: { value: 0 },
		storageKey,
	});

	useEffect(() => {
		onSnapshot({
			state: result.state,
			isLoading: result.isLoading,
			saveNow: result.saveNow,
		});
	});

	return null;
};

const CampaignProbe = ({
	storageKey,
	campaignId,
	onSnapshot,
}: {
	storageKey: string;
	campaignId: string;
	onSnapshot: (snapshot: ProbeSnapshot) => void;
}) => {
	const result = useCampaignToolState<ProbeState>(
		campaignId,
		"tool_state_campaign_probe",
		{
			initialState: { value: 0 },
			storageKey,
		},
	);

	useEffect(() => {
		onSnapshot({
			state: result.state,
			isLoading: result.isLoading,
			saveNow: result.saveNow,
		});
	});

	return null;
};

const PreferredCampaignProbe = ({
	onSnapshot,
}: {
	onSnapshot: (snapshot: {
		campaignId: string | null;
		isLoading: boolean;
		set: (id: string | null) => Promise<void>;
	}) => void;
}) => {
	const result = usePreferredCampaignSelection("test_tool");

	useEffect(() => {
		onSnapshot({
			campaignId: result.campaignId,
			isLoading: result.isLoading,
			set: result.setPreferredCampaignId,
		});
	});

	return null;
};

describe("useToolState local fallback behavior", () => {
	beforeEach(() => {
		remoteUserState = null;
		remoteCampaignState = null;
		upsertCalls.length = 0;

		storage = createMemoryStorage();
		vi.stubGlobal("localStorage", storage);

		mockAuth("user-1");
		fromMock.mockImplementation(
			(table: string) => createFromChain(table) as never,
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("mirrors remote user state into local storage after hydration", async () => {
		const storageKey = "test.tool-state.user.remote-hydration";
		remoteUserState = { value: 42 };

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<UserProbe
				storageKey={storageKey}
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			expect(snapshot.state).toEqual({ value: 42 });
			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 42,
			});
		} finally {
			unmount();
		}
	});

	it("writes local user mirror before remote upsert when authenticated", async () => {
		const storageKey = "test.tool-state.user.authed-save";

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<UserProbe
				storageKey={storageKey}
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			await act(async () => {
				await snapshot.saveNow({ value: 7 });
			});

			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 7,
			});

			const userUpserts = upsertCalls.filter(
				(call) => call.table === "user_tool_states",
			);
			expect(userUpserts).toHaveLength(1);
			expect((userUpserts[0].payload as { state: ProbeState }).state).toEqual({
				value: 7,
			});
		} finally {
			unmount();
		}
	});

	it("falls back to local user state when authenticated remote state is missing", async () => {
		const storageKey = "test.tool-state.user.authed-fallback";
		storage.setItem(storageKey, JSON.stringify({ value: 8 }));

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<UserProbe
				storageKey={storageKey}
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			expect(snapshot.state).toEqual({ value: 8 });
		} finally {
			unmount();
		}
	});

	it("loads and saves user state locally when unauthenticated", async () => {
		const storageKey = "test.tool-state.user.unauth";
		mockAuth(null);
		storage.setItem(storageKey, JSON.stringify({ value: 5 }));

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<UserProbe
				storageKey={storageKey}
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			expect(snapshot.state).toEqual({ value: 5 });

			await act(async () => {
				await snapshot.saveNow({ value: 6 });
			});

			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 6,
			});
			expect(
				upsertCalls.filter((call) => call.table === "user_tool_states"),
			).toHaveLength(0);
		} finally {
			unmount();
		}
	});

	it("mirrors remote campaign state into local storage after hydration", async () => {
		const storageKey = "test.tool-state.campaign.remote-hydration";
		remoteCampaignState = { value: 12 };

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<CampaignProbe
				storageKey={storageKey}
				campaignId="campaign-1"
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			expect(snapshot.state).toEqual({ value: 12 });
			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 12,
			});
		} finally {
			unmount();
		}
	});

	it("falls back to local campaign state when authenticated remote state is missing", async () => {
		const storageKey = "test.tool-state.campaign.authed-fallback";
		storage.setItem(storageKey, JSON.stringify({ value: 11 }));

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<CampaignProbe
				storageKey={storageKey}
				campaignId="campaign-1"
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			expect(snapshot.state).toEqual({ value: 11 });
		} finally {
			unmount();
		}
	});

	it("loads and saves campaign state locally when unauthenticated", async () => {
		const storageKey = "test.tool-state.campaign.unauth";
		mockAuth(null);
		storage.setItem(storageKey, JSON.stringify({ value: 3 }));

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<CampaignProbe
				storageKey={storageKey}
				campaignId="campaign-2"
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			expect(snapshot.state).toEqual({ value: 3 });

			await act(async () => {
				await snapshot.saveNow({ value: 9 });
			});

			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 9,
			});
			expect(
				upsertCalls.filter((call) => call.table === "campaign_tool_states"),
			).toHaveLength(0);
		} finally {
			unmount();
		}
	});

	it("writes local campaign mirror before remote upsert when authenticated", async () => {
		const storageKey = "test.tool-state.campaign.authed-save";

		let latest: ProbeSnapshot | null = null;
		const unmount = mount(
			<CampaignProbe
				storageKey={storageKey}
				campaignId="campaign-2"
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);

			await act(async () => {
				await snapshot.saveNow({ value: 15 });
			});

			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 15,
			});

			const campaignUpserts = upsertCalls.filter(
				(call) => call.table === "campaign_tool_states",
			);
			expect(campaignUpserts).toHaveLength(1);
			expect(
				(campaignUpserts[0].payload as { state: ProbeState }).state,
			).toEqual({ value: 15 });
		} finally {
			unmount();
		}
	});

	it("persists preferred campaign selection in user tool state and mirrors to local storage", async () => {
		const storageKey = "solo-compendium.preferred-campaign.test_tool.v1";

		let latest: {
			campaignId: string | null;
			isLoading: boolean;
			set: (id: string | null) => Promise<void>;
		} | null = null;

		const unmount = mount(
			<PreferredCampaignProbe
				onSnapshot={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);

			await act(async () => {
				await (latest as NonNullable<typeof latest>).set("campaign-xyz");
			});

			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				campaignId: "campaign-xyz",
			});

			const userUpserts = upsertCalls.filter(
				(call) => call.table === "user_tool_states",
			);
			expect(userUpserts).toHaveLength(1);
			expect((userUpserts[0].payload as { tool_key: string }).tool_key).toBe(
				"preferred_campaign:test_tool",
			);
			expect(
				(userUpserts[0].payload as { state: { campaignId: string } }).state,
			).toEqual({ campaignId: "campaign-xyz" });
		} finally {
			unmount();
		}
	});
});
