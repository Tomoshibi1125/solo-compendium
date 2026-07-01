/**
 * Initiative hand-off queue.
 *
 * The companion combat sub-sheet and the Initiative Tracker live on different
 * routes, so "Add to Initiative" can't call the tracker directly. Instead the
 * source enqueues a lightweight combatant payload to localStorage; the
 * Initiative Tracker drains and appends it on mount / window focus. This keeps
 * the feature universal (works with or without a campaign) and avoids coupling
 * the two components.
 */

export interface PendingCombatant {
	/** Optional stable id; the tracker generates one if omitted. */
	id?: string;
	name: string;
	hp?: number;
	maxHp?: number;
	ac?: number;
	initiative?: number;
	isHunter?: boolean;
	conditions?: string[];
	dexMod?: number;
}

const QUEUE_KEY = "solo-compendium.initiative.pending-adds.v1";

function readQueue(): PendingCombatant[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(QUEUE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as PendingCombatant[]) : [];
	} catch {
		return [];
	}
}

/** Append combatants to the pending queue (merged with anything already there). */
export function enqueueInitiativeAdditions(
	items: PendingCombatant | PendingCombatant[],
): void {
	if (typeof window === "undefined") return;
	const additions = Array.isArray(items) ? items : [items];
	if (additions.length === 0) return;
	const next = [...readQueue(), ...additions];
	try {
		window.localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
	} catch {
		// Storage full / unavailable — silently drop; not worth surfacing.
	}
}

/** Return and clear all pending combatants. */
export function drainInitiativeAdditions(): PendingCombatant[] {
	if (typeof window === "undefined") return [];
	const queue = readQueue();
	if (queue.length > 0) {
		try {
			window.localStorage.removeItem(QUEUE_KEY);
		} catch {
			// ignore
		}
	}
	return queue;
}

/** Non-destructive read — useful for tests / diagnostics. */
export function peekInitiativeAdditions(): PendingCombatant[] {
	return readQueue();
}
