/**
 * Reusable, Zustand-backed persistence lifecycle for client-owned "tool state".
 *
 * This captures the localStorage-mirror -> remote-load -> offline-fallback ->
 * explicit-saveNow lifecycle exactly once, so `useUserToolState`,
 * `useCampaignToolState`, and any future tool reuse it instead of
 * reimplementing it.
 *
 * State for a given `storageKey` lives in a single keyed Zustand store, so all
 * consumers of the same key share one source of truth (previously each hook
 * instance held its own `useState`, which could silently drift). React Query
 * remains the source of truth for server-owned domain data; this is strictly
 * for client-owned preferences that are merely persisted server-side.
 */
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { warn as logWarn } from "@/lib/logger";

const DEFAULT_STORAGE_PREFIX = "solo-compendium.tool";

export const buildToolStorageKey = (toolKey: string) =>
	`${DEFAULT_STORAGE_PREFIX}.${toolKey}`;

export const readLocalToolState = <T>(storageKey: string): T | null => {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return null;
		return JSON.parse(raw) as T;
	} catch (error) {
		logWarn(
			`Failed to read tool state from localStorage: ${storageKey}`,
			error,
		);
		return null;
	}
};

export const writeLocalToolState = <T>(storageKey: string, state: T): void => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(storageKey, JSON.stringify(state));
	} catch (error) {
		logWarn(`Failed to write tool state to localStorage: ${storageKey}`, error);
	}
};

export type ToolStateOptions<T> = {
	storageKey?: string;
	initialState: T;
	enabled?: boolean;
};

export type ToolStateResult<T> = {
	state: T;
	setState: Dispatch<SetStateAction<T>>;
	isLoading: boolean;
	saveNow: (nextState?: T) => Promise<void>;
	isAuthed: boolean;
};

/**
 * Scope-specific remote behavior. The factory owns the lifecycle; the adapter
 * owns "how do I talk to the remote for this particular scope".
 */
export type RemoteAdapter<T> = {
	/** Returns null when remote is unavailable for this render. */
	load: () => Promise<T | null> | null;
	save: (state: T) => Promise<void>;
	/** authed + supabase configured + has id. */
	canUseRemote: boolean;
	/** e.g. campaignId present; when false we mirror locally but skip remote. */
	scopeReady: boolean;
};

interface ToolStateStore<T> {
	state: T;
	isLoading: boolean;
	/** Identity the store was last hydrated for; re-hydrate when it changes. */
	hydrationKey: string | null;
	setState: (updater: SetStateAction<T>) => void;
	setLoading: (isLoading: boolean) => void;
	setHydrationKey: (key: string | null) => void;
	hydrate: (state: T) => void;
}

type ToolStore<T> = UseBoundStore<StoreApi<ToolStateStore<T>>>;

const registry = new Map<string, ToolStore<unknown>>();

const isUpdater = <T>(value: SetStateAction<T>): value is (prev: T) => T =>
	typeof value === "function";

const getToolStore = <T>(storageKey: string, initialState: T): ToolStore<T> => {
	const existing = registry.get(storageKey);
	if (existing) return existing as unknown as ToolStore<T>;

	const store = create<ToolStateStore<T>>((set) => ({
		state: initialState,
		isLoading: true,
		hydrationKey: null,
		setState: (updater) =>
			set((s) => ({
				state: isUpdater(updater) ? updater(s.state) : updater,
			})),
		setLoading: (isLoading) => set({ isLoading }),
		setHydrationKey: (hydrationKey) => set({ hydrationKey }),
		hydrate: (state) => set({ state }),
	}));

	registry.set(storageKey, store as unknown as ToolStore<unknown>);
	return store;
};

/** Test-only helper: drop all keyed stores so cases start from a clean slate. */
export const __clearToolStateRegistry = () => {
	registry.clear();
};

export function usePersistedToolState<T>(args: {
	storageKey: string;
	initialState: T;
	enabled: boolean;
	authLoading: boolean;
	adapter: RemoteAdapter<T>;
}): ToolStateResult<T> {
	const { storageKey, initialState, enabled, authLoading, adapter } = args;
	const { canUseRemote, scopeReady } = adapter;

	// Keep the latest adapter without re-running the load effect on every render
	// (the wrapper hooks build a fresh adapter object each render).
	const adapterRef = useRef(adapter);
	adapterRef.current = adapter;

	const useStore = getToolStore<T>(storageKey, initialState);
	const state = useStore((s) => s.state);
	const storeIsLoading = useStore((s) => s.isLoading);

	useEffect(() => {
		if (!enabled) {
			useStore.getState().setLoading(false);
			return;
		}
		if (authLoading) return;

		const identity = `${canUseRemote ? "remote" : "local"}|${
			scopeReady ? "scoped" : "unscoped"
		}`;

		// Already hydrated for this identity: don't refetch (and don't clobber
		// any unsaved local edits) on remount.
		if (useStore.getState().hydrationKey === identity) {
			useStore.getState().setLoading(false);
			return;
		}

		let active = true;
		const run = async () => {
			useStore.getState().setLoading(true);
			const fallback = readLocalToolState<T>(storageKey);

			if (!scopeReady || !canUseRemote) {
				if (active) {
					if (fallback !== null) useStore.getState().hydrate(fallback);
					useStore.getState().setHydrationKey(identity);
					useStore.getState().setLoading(false);
				}
				return;
			}

			const pending = adapterRef.current.load();
			const remote = pending ? await pending : null;
			if (!active) return;

			if (remote !== null) {
				useStore.getState().hydrate(remote);
				writeLocalToolState(storageKey, remote);
			} else if (fallback !== null) {
				useStore.getState().hydrate(fallback);
			}
			useStore.getState().setHydrationKey(identity);
			useStore.getState().setLoading(false);
		};

		void run();
		return () => {
			active = false;
		};
	}, [storageKey, enabled, authLoading, canUseRemote, scopeReady, useStore]);

	const setState = useCallback<Dispatch<SetStateAction<T>>>(
		(updater) => {
			useStore.getState().setState(updater);
		},
		[useStore],
	);

	const saveNow = useCallback(
		async (nextState?: T) => {
			if (!enabled) return;
			const payload = nextState ?? useStore.getState().state;
			writeLocalToolState(storageKey, payload);
			if (!scopeReady || !canUseRemote) return;
			await adapterRef.current.save(payload);
		},
		[enabled, scopeReady, canUseRemote, storageKey, useStore],
	);

	return {
		state,
		setState,
		isLoading: enabled ? storeIsLoading : false,
		saveNow,
		isAuthed: canUseRemote,
	};
}
