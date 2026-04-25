import type React from "react";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/authContext", () => ({
	useAuth: vi.fn(),
}));

import {
	type CampaignRoleEligibility,
	type CampaignRoleMode,
	getCampaignRoleModeStorageKey,
	resolveCampaignRoleMode,
	useCampaignRoleMode,
} from "@/hooks/useCampaignRoleMode";
import { useAuth } from "@/lib/auth/authContext";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Snapshot = {
	currentMode: CampaignRoleMode;
	canActAsWarden: boolean;
	canChooseWardenMode: boolean;
	setCurrentMode: (mode: CampaignRoleMode) => void;
};

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

const useAuthMock = vi.mocked(useAuth);

const mockAuth = (userId: string) => {
	useAuthMock.mockReturnValue({
		user: { id: userId },
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

	return {
		rerender: (next: React.ReactElement) => {
			act(() => {
				root.render(next);
			});
		},
		unmount: () => {
			act(() => {
				root.unmount();
			});
			container.remove();
		},
	};
};

const requireSnapshot = (snapshot: Snapshot | null): Snapshot => {
	if (!snapshot) throw new Error("Expected snapshot");
	return snapshot;
};

const Probe = ({
	campaignId,
	campaignRole,
	onSnapshot,
}: {
	campaignId: string;
	campaignRole: CampaignRoleEligibility;
	onSnapshot: (snapshot: Snapshot) => void;
}) => {
	const result = useCampaignRoleMode(campaignId, campaignRole);

	useEffect(() => {
		onSnapshot(result);
	});

	return null;
};

describe("useCampaignRoleMode", () => {
	beforeEach(() => {
		storage = createMemoryStorage();
		vi.stubGlobal("localStorage", storage);
		mockAuth("user-1");
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it("resolves primary Warden mode as Warden", () => {
		expect(
			resolveCampaignRoleMode({ eligibleRole: "warden", storedMode: null }),
		).toBe("warden");
		expect(
			resolveCampaignRoleMode({
				eligibleRole: "warden",
				storedMode: "ascendant",
			}),
		).toBe("warden");
	});

	it("does not allow Ascendants to act as Warden", async () => {
		let snapshot: Snapshot | null = null;
		const mounted = mount(
			<Probe
				campaignId="campaign-1"
				campaignRole="ascendant"
				onSnapshot={(next) => {
					snapshot = next;
				}}
			/>,
		);

		await waitUntil(() => snapshot !== null);
		act(() => requireSnapshot(snapshot).setCurrentMode("warden"));
		await tick();

		expect(requireSnapshot(snapshot).currentMode).toBe("ascendant");
		expect(requireSnapshot(snapshot).canActAsWarden).toBe(false);
		expect(requireSnapshot(snapshot).canChooseWardenMode).toBe(false);
		mounted.unmount();
	});

	it("lets co-Wardens toggle and persist campaign mode", async () => {
		let snapshot: Snapshot | null = null;
		const storageKey = getCampaignRoleModeStorageKey("campaign-1", "user-1");
		const mounted = mount(
			<Probe
				campaignId="campaign-1"
				campaignRole="co-warden"
				onSnapshot={(next) => {
					snapshot = next;
				}}
			/>,
		);

		await waitUntil(() => snapshot !== null);
		expect(requireSnapshot(snapshot).currentMode).toBe("ascendant");
		act(() => requireSnapshot(snapshot).setCurrentMode("warden"));
		await waitUntil(() => requireSnapshot(snapshot).currentMode === "warden");

		expect(requireSnapshot(snapshot).canActAsWarden).toBe(true);
		expect(storage.getItem(storageKey)).toBe("warden");
		mounted.unmount();

		snapshot = null;
		const remounted = mount(
			<Probe
				campaignId="campaign-1"
				campaignRole="co-warden"
				onSnapshot={(next) => {
					snapshot = next;
				}}
			/>,
		);

		await waitUntil(() => requireSnapshot(snapshot).currentMode === "warden");
		expect(requireSnapshot(snapshot).canChooseWardenMode).toBe(true);
		remounted.unmount();
	});

	it("falls back to Ascendant mode after demotion", async () => {
		let snapshot: Snapshot | null = null;
		const storageKey = getCampaignRoleModeStorageKey("campaign-1", "user-1");
		storage.setItem(storageKey, "warden");
		const mounted = mount(
			<Probe
				campaignId="campaign-1"
				campaignRole="ascendant"
				onSnapshot={(next) => {
					snapshot = next;
				}}
			/>,
		);

		await waitUntil(
			() => snapshot !== null && storage.getItem(storageKey) === null,
		);
		expect(requireSnapshot(snapshot).currentMode).toBe("ascendant");
		expect(requireSnapshot(snapshot).canActAsWarden).toBe(false);
		mounted.unmount();
	});
});
