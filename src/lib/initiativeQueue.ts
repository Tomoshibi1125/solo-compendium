/**
 * Initiative hand-off queue.
 *
 * The companion combat sub-sheet and the Initiative Tracker live on different
 * routes, so "Add to Initiative" can't call the tracker directly. Instead the
 * source enqueues a lightweight combatant payload to localStorage; the
 * Initiative Tracker drains and appends it on mount / window focus. C3 adds a
 * stable living-instance key so repeated companion handoffs replace the queued
 * projection instead of creating duplicate actors.
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
	/** C3 stable living identity. Source id/name are never dedupe keys. */
	companionInstanceId?: string;
	initiativeMode?: "independent" | "linked";
	initiativeAnchorCharacterId?: string;
	companionProfileVersion?: number;
	companionStateVersion?: number;
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

function mergePendingCombatants(
	current: PendingCombatant[],
	additions: PendingCombatant[],
): PendingCombatant[] {
	const next = [...current];
	const byInstance = new Map<string, number>();
	for (let index = 0; index < next.length; index += 1) {
		const instanceId = next[index]?.companionInstanceId;
		if (instanceId) byInstance.set(instanceId, index);
	}
	for (const addition of additions) {
		const instanceId = addition.companionInstanceId;
		if (instanceId && byInstance.has(instanceId)) {
			next[byInstance.get(instanceId) as number] = addition;
			continue;
		}
		next.push(addition);
		if (instanceId) byInstance.set(instanceId, next.length - 1);
	}
	return next;
}

/** Append combatants to the pending queue; companion identity makes handoff idempotent. */
export function enqueueInitiativeAdditions(
	items: PendingCombatant | PendingCombatant[],
): void {
	if (typeof window === "undefined") return;
	const additions = Array.isArray(items) ? items : [items];
	if (additions.length === 0) return;
	const next = mergePendingCombatants(readQueue(), additions);
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
