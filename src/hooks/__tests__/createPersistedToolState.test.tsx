import type React from "react";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	__clearToolStateRegistry,
	type RemoteAdapter,
	usePersistedToolState,
} from "@/hooks/createPersistedToolState";

type ProbeState = { value: number };

type ProbeSnapshot = {
	state: ProbeState;
	isLoading: boolean;
	isAuthed: boolean;
	saveNow: (next?: ProbeState) => Promise<void>;
	setState: React.Dispatch<React.SetStateAction<ProbeState>>;
};

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let storage: Storage;

const createMemoryStorage = (): Storage => {
	const store = new Map<string, string>();
	return {
		getItem: (key) => (store.has(key) ? (store.get(key) ?? null) : null),
		setItem: (key, value) => {
			store.set(key, String(value));
		},
		removeItem: (key) => {
			store.delete(key);
		},
		clear: () => {
			store.clear();
		},
		key: (index) => Array.from(store.keys())[index] ?? null,
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

const Probe = ({
	storageKey,
	enabled = true,
	authLoading = false,
	adapter,
	onSnapshot,
}: {
	storageKey: string;
	enabled?: boolean;
	authLoading?: boolean;
	adapter: RemoteAdapter<ProbeState>;
	onSnapshot: (snapshot: ProbeSnapshot) => void;
}) => {
	const result = usePersistedToolState<ProbeState>({
		storageKey,
		initialState: { value: 0 },
		enabled,
		authLoading,
		adapter,
	});

	useEffect(() => {
		onSnapshot({
			state: result.state,
			isLoading: result.isLoading,
			isAuthed: result.isAuthed,
			saveNow: result.saveNow,
			setState: result.setState,
		});
	});

	return null;
};

const renderInto = (element: React.ReactElement) => {
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

const localAdapter = (): RemoteAdapter<ProbeState> => ({
	canUseRemote: false,
	scopeReady: true,
	load: vi.fn(() => null),
	save: vi.fn(async () => {}),
});

describe("usePersistedToolState", () => {
	beforeEach(() => {
		storage = createMemoryStorage();
		vi.stubGlobal("localStorage", storage);
		__clearToolStateRegistry();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it("hydrates from localStorage when remote returns null", async () => {
		const storageKey = "factory.hydrate-local";
		storage.setItem(storageKey, JSON.stringify({ value: 7 }));
		const adapter: RemoteAdapter<ProbeState> = {
			canUseRemote: true,
			scopeReady: true,
			load: vi.fn(async () => null),
			save: vi.fn(async () => {}),
		};

		let latest: ProbeSnapshot | null = null;
		const view = renderInto(
			<Probe
				storageKey={storageKey}
				adapter={adapter}
				onSnapshot={(s) => {
					latest = s;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			expect((latest as unknown as ProbeSnapshot).state).toEqual({ value: 7 });
			expect(adapter.load).toHaveBeenCalledTimes(1);
		} finally {
			view.unmount();
		}
	});

	it("prefers remote and mirrors it to localStorage", async () => {
		const storageKey = "factory.remote-wins";
		const adapter: RemoteAdapter<ProbeState> = {
			canUseRemote: true,
			scopeReady: true,
			load: vi.fn(async () => ({ value: 42 })),
			save: vi.fn(async () => {}),
		};

		let latest: ProbeSnapshot | null = null;
		const view = renderInto(
			<Probe
				storageKey={storageKey}
				adapter={adapter}
				onSnapshot={(s) => {
					latest = s;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			expect((latest as unknown as ProbeSnapshot).state).toEqual({ value: 42 });
			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 42,
			});
		} finally {
			view.unmount();
		}
	});

	it("uses local fallback and skips remote when remote is unavailable (guest)", async () => {
		const storageKey = "factory.guest";
		storage.setItem(storageKey, JSON.stringify({ value: 8 }));
		const adapter = localAdapter();

		let latest: ProbeSnapshot | null = null;
		const view = renderInto(
			<Probe
				storageKey={storageKey}
				adapter={adapter}
				onSnapshot={(s) => {
					latest = s;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snap = latest as unknown as ProbeSnapshot;
			expect(snap.state).toEqual({ value: 8 });
			expect(snap.isAuthed).toBe(false);
			expect(adapter.load).not.toHaveBeenCalled();

			await act(async () => {
				await snap.saveNow({ value: 9 });
			});
			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 9,
			});
			expect(adapter.save).not.toHaveBeenCalled();
		} finally {
			view.unmount();
		}
	});

	it("mirrors locally but skips remote when scope is not ready", async () => {
		const storageKey = "factory.unscoped";
		storage.setItem(storageKey, JSON.stringify({ value: 3 }));
		const adapter: RemoteAdapter<ProbeState> = {
			canUseRemote: true,
			scopeReady: false,
			load: vi.fn(async () => ({ value: 999 })),
			save: vi.fn(async () => {}),
		};

		let latest: ProbeSnapshot | null = null;
		const view = renderInto(
			<Probe
				storageKey={storageKey}
				adapter={adapter}
				onSnapshot={(s) => {
					latest = s;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snap = latest as unknown as ProbeSnapshot;
			expect(snap.state).toEqual({ value: 3 });
			expect(adapter.load).not.toHaveBeenCalled();

			await act(async () => {
				await snap.saveNow({ value: 4 });
			});
			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 4,
			});
			expect(adapter.save).not.toHaveBeenCalled();
		} finally {
			view.unmount();
		}
	});

	it("saveNow writes local always and remote when allowed", async () => {
		const storageKey = "factory.save-remote";
		const adapter: RemoteAdapter<ProbeState> = {
			canUseRemote: true,
			scopeReady: true,
			load: vi.fn(async () => null),
			save: vi.fn(async () => {}),
		};

		let latest: ProbeSnapshot | null = null;
		const view = renderInto(
			<Probe
				storageKey={storageKey}
				adapter={adapter}
				onSnapshot={(s) => {
					latest = s;
				}}
			/>,
		);

		try {
			await waitUntil(() => !!latest && !latest.isLoading);
			const snap = latest as unknown as ProbeSnapshot;

			await act(async () => {
				await snap.saveNow({ value: 11 });
			});
			expect(JSON.parse(storage.getItem(storageKey) || "null")).toEqual({
				value: 11,
			});
			expect(adapter.save).toHaveBeenCalledTimes(1);
			expect(adapter.save).toHaveBeenCalledWith({ value: 11 });
		} finally {
			view.unmount();
		}
	});

	it("waits for auth before loading, then hydrates once auth resolves", async () => {
		const storageKey = "factory.auth-gating";
		const adapter: RemoteAdapter<ProbeState> = {
			canUseRemote: true,
			scopeReady: true,
			load: vi.fn(async () => ({ value: 77 })),
			save: vi.fn(async () => {}),
		};

		let latest: ProbeSnapshot | null = null;
		const onSnapshot = (s: ProbeSnapshot) => {
			latest = s;
		};
		const view = renderInto(
			<Probe
				storageKey={storageKey}
				authLoading={true}
				adapter={adapter}
				onSnapshot={onSnapshot}
			/>,
		);

		try {
			await tick();
			expect(adapter.load).not.toHaveBeenCalled();
			expect((latest as unknown as ProbeSnapshot).isLoading).toBe(true);

			view.rerender(
				<Probe
					storageKey={storageKey}
					authLoading={false}
					adapter={adapter}
					onSnapshot={onSnapshot}
				/>,
			);

			await waitUntil(
				() =>
					!!latest && (latest as unknown as ProbeSnapshot).state.value === 77,
			);
			expect(adapter.load).toHaveBeenCalledTimes(1);
		} finally {
			view.unmount();
		}
	});

	it("shares one source of truth across consumers of the same key", async () => {
		const storageKey = "factory.dedup";
		const adapterA = localAdapter();
		const adapterB = localAdapter();

		let snapA: ProbeSnapshot | null = null;
		let snapB: ProbeSnapshot | null = null;
		const view = renderInto(
			<>
				<Probe
					storageKey={storageKey}
					adapter={adapterA}
					onSnapshot={(s) => {
						snapA = s;
					}}
				/>
				<Probe
					storageKey={storageKey}
					adapter={adapterB}
					onSnapshot={(s) => {
						snapB = s;
					}}
				/>
			</>,
		);

		try {
			await waitUntil(() => !!snapA && !!snapB);

			await act(async () => {
				(snapA as unknown as ProbeSnapshot).setState({ value: 5 });
			});

			await waitUntil(
				() =>
					(snapA as unknown as ProbeSnapshot).state.value === 5 &&
					(snapB as unknown as ProbeSnapshot).state.value === 5,
			);
			expect((snapB as unknown as ProbeSnapshot).state).toEqual({ value: 5 });
		} finally {
			view.unmount();
		}
	});
});
