import type React from "react";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/authContext", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: false,
	supabase: {
		from: vi.fn(),
	},
}));

import { useAuth } from "@/lib/auth/authContext";
import {
	MACRO_STORAGE_KEY,
	type RollMacro,
	useMacros,
} from "@/lib/vtt/rollMacros";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Snapshot = ReturnType<typeof useMacros>;

const useAuthMock = vi.mocked(useAuth);

const requireSnapshot = (snapshot: Snapshot | null): Snapshot => {
	if (!snapshot) {
		throw new Error("Expected macro snapshot to be available");
	}
	return snapshot;
};

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

const Probe = ({
	onSnapshot,
}: {
	onSnapshot: (snapshot: Snapshot) => void;
}) => {
	const result = useMacros();
	useEffect(() => {
		onSnapshot(result);
	});
	return null;
};

describe("useMacros", () => {
	beforeEach(() => {
		vi.stubGlobal("localStorage", createMemoryStorage());
		useAuthMock.mockReturnValue({
			user: null,
			loading: false,
		} as unknown as ReturnType<typeof useAuth>);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it("seeds the default macro and mirrors it to local storage", async () => {
		let snapshot: Snapshot | null = null;
		const unmount = mount(<Probe onSnapshot={(next) => (snapshot = next)} />);

		await waitUntil(() => !!snapshot && !snapshot.isLoading);
		const snap = requireSnapshot(snapshot);

		expect(snap.macros).toHaveLength(1);
		expect(snap.macros[0]).toMatchObject({
			id: "default-d20",
			name: "d20",
			formula: "1d20",
			category: "custom",
		});
		const stored = JSON.parse(
			localStorage.getItem(MACRO_STORAGE_KEY) ?? "[]",
		) as RollMacro[];
		expect(stored).toHaveLength(1);
		expect(stored[0].id).toBe("default-d20");

		unmount();
	});

	it("hydrates legacy local macros through the synced hook", async () => {
		const legacyMacro: RollMacro = {
			id: "legacy-attack",
			name: "Legacy Attack",
			formula: "1d20+5",
			category: "attack",
			createdAt: "2026-01-01T00:00:00.000Z",
		};
		localStorage.setItem(MACRO_STORAGE_KEY, JSON.stringify([legacyMacro]));
		let snapshot: Snapshot | null = null;
		const unmount = mount(<Probe onSnapshot={(next) => (snapshot = next)} />);

		await waitUntil(() => {
			const current = snapshot as Snapshot | null;
			return (
				!!current &&
				!current.isLoading &&
				current.macros[0]?.id === legacyMacro.id
			);
		});
		const snap = requireSnapshot(snapshot);

		expect(snap.macros).toEqual([legacyMacro]);
		unmount();
	});
});
