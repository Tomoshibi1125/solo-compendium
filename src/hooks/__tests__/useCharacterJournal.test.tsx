import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
	supabase: {
		from: vi.fn(),
	},
}));

import {
	type JournalEntry,
	useCharacterJournal,
} from "@/hooks/useCharacterJournal";
import { supabase } from "@/integrations/supabase/client";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type Snapshot = {
	entries: JournalEntry[];
	isLoading: boolean;
};

const requireSnapshot = (snapshot: Snapshot | null): Snapshot => {
	if (!snapshot) {
		throw new Error("Expected snapshot to be available");
	}
	return snapshot;
};

let storage: Storage;
let remoteRows: JournalEntry[] | null = null;
let remoteError: Error | null = null;

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

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

const buildStorageKey = (characterId: string) =>
	`solo-compendium.character-journal.${characterId}.v1`;

const JournalProbe = ({
	characterId,
	onSnapshot,
}: {
	characterId: string;
	onSnapshot: (snapshot: Snapshot) => void;
}) => {
	const result = useCharacterJournal(characterId);

	useEffect(() => {
		onSnapshot({
			entries: result.data ?? [],
			isLoading: result.isLoading,
		});
	}, [onSnapshot, result.data, result.isLoading]);

	return null;
};

const createFromChain = () => {
	const selectChain = {
		eq: () => selectChain,
		order: async () => ({
			data: remoteRows,
			error: remoteError,
		}),
	};

	return {
		select: () => selectChain,
	};
};

describe("useCharacterJournal local mirror", () => {
	const fromMock = vi.mocked(supabase.from);

	beforeEach(() => {
		remoteRows = null;
		remoteError = null;

		storage = createMemoryStorage();
		vi.stubGlobal("localStorage", storage);

		fromMock.mockImplementation(() => createFromChain() as never);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it("mirrors remote entries into localStorage after hydration", async () => {
		const characterId = "character-1";
		const now = new Date().toISOString();
		remoteRows = [
			{
				id: "remote-1",
				character_id: characterId,
				title: "Remote Entry",
				content: "Hello",
				session_date: null,
				tags: [],
				created_at: now,
				updated_at: now,
			},
		];

		const queryClient = createQueryClient();

		let latest: Snapshot | null = null;
		const unmount = mount(
			<QueryClientProvider client={queryClient}>
				<JournalProbe
					characterId={characterId}
					onSnapshot={(snapshot) => {
						latest = snapshot;
					}}
				/>
			</QueryClientProvider>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);
			expect(snapshot.entries).toHaveLength(1);

			const raw = storage.getItem(buildStorageKey(characterId));
			expect(raw).toBeTruthy();
			expect(JSON.parse(raw || "[]")).toHaveLength(1);
		} finally {
			unmount();
		}
	});

	it("falls back to localStorage when remote load fails", async () => {
		const characterId = "character-2";
		const now = new Date().toISOString();
		const localEntry: JournalEntry = {
			id: "local-1",
			character_id: characterId,
			title: "Local Entry",
			content: "Offline",
			session_date: null,
			tags: [],
			created_at: now,
			updated_at: now,
		};

		storage.setItem(buildStorageKey(characterId), JSON.stringify([localEntry]));
		remoteError = new Error("REMOTE_FAIL");

		const queryClient = createQueryClient();

		let latest: Snapshot | null = null;
		const unmount = mount(
			<QueryClientProvider client={queryClient}>
				<JournalProbe
					characterId={characterId}
					onSnapshot={(snapshot) => {
						latest = snapshot;
					}}
				/>
			</QueryClientProvider>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snapshot = requireSnapshot(latest);
			expect(snapshot.entries).toEqual([localEntry]);
		} finally {
			unmount();
		}
	});
});
