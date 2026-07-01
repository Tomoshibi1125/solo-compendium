/**
 * Shared generation-history model for the Warden generator tools.
 *
 * Stores a capped, pinnable list of generated records alongside the current
 * one. The whole {@link GenerationHistoryState} is persisted through the
 * existing `useUserToolState` save path — there is no separate storage layer.
 */

export interface HistoryEntry<T> {
	id: string;
	createdAt: string;
	pinned: boolean;
	/** Short human label shown in the history list. */
	label: string;
	record: T;
}

export interface GenerationHistoryState<T> {
	current: T | null;
	history: HistoryEntry<T>[];
}

/** Maximum number of unpinned entries retained; pinned entries always survive. */
export const HISTORY_CAP = 10;

export function emptyHistory<T>(): GenerationHistoryState<T> {
	return { current: null, history: [] };
}

export function makeEntryId(): string {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Set `record` as the current generation and prepend it to history, trimming
 * the oldest unpinned entries beyond {@link HISTORY_CAP}. Pinned entries are
 * never evicted.
 */
export function pushGeneration<T>(
	state: GenerationHistoryState<T>,
	record: T,
	label: string,
): GenerationHistoryState<T> {
	const entry: HistoryEntry<T> = {
		id: makeEntryId(),
		createdAt: new Date().toISOString(),
		pinned: false,
		label,
		record,
	};
	const next: HistoryEntry<T>[] = [];
	let unpinned = 0;
	for (const e of [entry, ...state.history]) {
		if (e.pinned) {
			next.push(e);
		} else if (unpinned < HISTORY_CAP) {
			next.push(e);
			unpinned += 1;
		}
	}
	return { current: record, history: next };
}

export function togglePin<T>(
	state: GenerationHistoryState<T>,
	id: string,
): GenerationHistoryState<T> {
	return {
		...state,
		history: state.history.map((e) =>
			e.id === id ? { ...e, pinned: !e.pinned } : e,
		),
	};
}

export function restoreGeneration<T>(
	state: GenerationHistoryState<T>,
	id: string,
): GenerationHistoryState<T> {
	const entry = state.history.find((e) => e.id === id);
	return entry ? { ...state, current: entry.record } : state;
}

export function removeGeneration<T>(
	state: GenerationHistoryState<T>,
	id: string,
): GenerationHistoryState<T> {
	return { ...state, history: state.history.filter((e) => e.id !== id) };
}
