/**
 * Shared activity-feed model — an append-only, capped log of notable events
 * (generated / exported / published / joined / synced …) for a user- or
 * campaign-scoped tool. Persisted through the existing `useToolState` save
 * path (see {@link "@/hooks/useActivityFeed"}); there is no separate storage
 * layer. Pure + testable, mirroring `generationHistory.ts`.
 */

export interface ActivityEvent {
	id: string;
	/** ISO timestamp. */
	at: string;
	/** Machine kind, e.g. "generated" | "exported" | "published" | "joined". */
	kind: string;
	/** Short human label shown in the feed. */
	label: string;
	/** Optional grouping tag, e.g. "guild" | "campaign" | "marketplace". */
	category?: string;
	/** Optional structured payload for re-open / re-export. */
	meta?: Record<string, unknown>;
}

export interface ActivityFeedState {
	events: ActivityEvent[];
}

/** Maximum number of events retained; oldest are evicted first. */
export const ACTIVITY_CAP = 50;

export const emptyActivityFeed = (): ActivityFeedState => ({ events: [] });

export function makeActivityId(): string {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ActivityInput {
	kind: string;
	label: string;
	category?: string;
	meta?: Record<string, unknown>;
	/** Override the timestamp (defaults to now). */
	at?: string;
}

/** Prepend an event and trim to {@link ACTIVITY_CAP}. */
export function appendActivity(
	state: ActivityFeedState,
	input: ActivityInput,
): ActivityFeedState {
	const event: ActivityEvent = {
		id: makeActivityId(),
		at: input.at ?? new Date().toISOString(),
		kind: input.kind,
		label: input.label,
		...(input.category ? { category: input.category } : {}),
		...(input.meta ? { meta: input.meta } : {}),
	};
	return { events: [event, ...state.events].slice(0, ACTIVITY_CAP) };
}

export function removeActivity(
	state: ActivityFeedState,
	id: string,
): ActivityFeedState {
	return { events: state.events.filter((e) => e.id !== id) };
}

export function clearActivity(): ActivityFeedState {
	return emptyActivityFeed();
}
