import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: false,
	supabase: {
		from: vi.fn(),
	},
}));

import {
	DEFAULT_VTT_SESSION_STATUS,
	DEFAULT_VTT_SETTINGS,
	useVTTSettings,
} from "@/hooks/useVTTSettings";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Snapshot = ReturnType<typeof useVTTSettings>;

const requireSnapshot = (snap: Snapshot | null): Snapshot => {
	if (!snap) {
		throw new Error("Expected snapshot to be available");
	}
	return snap;
};

function Probe({
	campaignId,
	onSnapshot,
}: {
	campaignId: string | null;
	onSnapshot: (snap: Snapshot) => void;
}) {
	const hook = useVTTSettings(campaignId);
	useEffect(() => {
		onSnapshot(hook);
	}, [hook, onSnapshot]);
	return null;
}

async function flush() {
	await act(async () => {
		await new Promise<void>((resolve) => setTimeout(resolve, 0));
	});
}

describe("useVTTSettings", () => {
	let client: QueryClient;
	let container: HTMLDivElement;

	beforeEach(() => {
		client = new QueryClient({
			defaultOptions: {
				queries: { retry: false, gcTime: 0, staleTime: 0 },
				mutations: { retry: false },
			},
		});
		container = document.createElement("div");
		document.body.appendChild(container);
	});

	afterEach(() => {
		container.remove();
		vi.clearAllMocks();
	});

	it("returns default settings and 'started' session status when supabase is disabled", async () => {
		let snap: Snapshot | null = null;
		const root = createRoot(container);
		act(() => {
			root.render(
				<QueryClientProvider client={client}>
					<Probe
						campaignId="test-campaign"
						onSnapshot={(s) => {
							snap = s;
						}}
					/>
				</QueryClientProvider>,
			);
		});
		await flush();
		const s = requireSnapshot(snap);
		expect(s.settings).toEqual(DEFAULT_VTT_SETTINGS);
		expect(s.sessionStatus).toEqual(DEFAULT_VTT_SESSION_STATUS);
		act(() => {
			root.unmount();
		});
	});

	it("does not crash when the campaignId is null", async () => {
		let snap: Snapshot | null = null;
		const root = createRoot(container);
		act(() => {
			root.render(
				<QueryClientProvider client={client}>
					<Probe
						campaignId={null}
						onSnapshot={(s) => {
							snap = s;
						}}
					/>
				</QueryClientProvider>,
			);
		});
		await flush();
		const s = requireSnapshot(snap);
		expect(s.settings.allowPlayerPing).toBe(true);
		expect(s.sessionStatus.state).toBe("started");
		act(() => {
			root.unmount();
		});
	});

	it("setSettings + setSessionState are stable no-ops when supabase is disabled", async () => {
		let snap: Snapshot | null = null;
		const root = createRoot(container);
		act(() => {
			root.render(
				<QueryClientProvider client={client}>
					<Probe
						campaignId="test-campaign"
						onSnapshot={(s) => {
							snap = s;
						}}
					/>
				</QueryClientProvider>,
			);
		});
		await flush();
		const s = requireSnapshot(snap);
		expect(() => s.setSettings({ allowPlayerDraw: false })).not.toThrow();
		expect(() => s.setSessionState("paused")).not.toThrow();
		act(() => {
			root.unmount();
		});
	});
});
