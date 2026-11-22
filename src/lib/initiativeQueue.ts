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
	/**
	 * Compatibility origin reference used when an older sheet has not yet
	 * loaded the C1 instance row. The C3 bridge resolves this to the stable
	 * living-instance id before a campaign combat actor is created.
	 */
	companionOriginTable?: "character_extras";
	companionOriginRowId?: string;
	companionOwnerCharacterId?: string;
}

export interface CompanionCombatHandoffDetail {
	campaignId: string;
	sessionId: string;
	items: PendingCombatant[];
}

export const COMPANION_COMBAT_HANDOFF_EVENT =
	"solo-compendium:companion-combat-handoff" as const;

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

function inferCompanionOriginFromLocation(
	item: PendingCombatant,
): PendingCombatant {
	if (
		typeof window === "undefined" ||
		item.companionInstanceId ||
		item.companionOriginRowId
	) {
		return item;
	}

	const match = window.location.pathname.match(
		/^\/characters\/([^/]+)\/companions\/extra\/([^/]+)\/?$/,
	);
	if (!match) return item;

	return {
		...item,
		companionOriginTable: "character_extras",
		companionOwnerCharacterId: decodeURIComponent(match[1] ?? ""),
		companionOriginRowId: decodeURIComponent(match[2] ?? ""),
	};
}

function mergePendingCombatants(
	current: PendingCombatant[],
	additions: PendingCombatant[],
): PendingCombatant[] {
	const next = [...current];
	const byInstance = new Map<string, number>();
	const byOrigin = new Map<string, number>();
	for (let index = 0; index < next.length; index += 1) {
		const instanceId = next[index]?.companionInstanceId;
		if (instanceId) byInstance.set(instanceId, index);
		const originTable = next[index]?.companionOriginTable;
		const originRowId = next[index]?.companionOriginRowId;
		if (originTable && originRowId) {
			byOrigin.set(`${originTable}:${originRowId}`, index);
		}
	}
	for (const rawAddition of additions) {
		const addition = inferCompanionOriginFromLocation(rawAddition);
		const instanceId = addition.companionInstanceId;
		if (instanceId && byInstance.has(instanceId)) {
			next[byInstance.get(instanceId) as number] = addition;
			continue;
		}
		const originKey =
			addition.companionOriginTable && addition.companionOriginRowId
				? `${addition.companionOriginTable}:${addition.companionOriginRowId}`
				: null;
		if (originKey && byOrigin.has(originKey)) {
			next[byOrigin.get(originKey) as number] = addition;
			continue;
		}
		next.push(addition);
		if (instanceId) byInstance.set(instanceId, next.length - 1);
		if (originKey) byOrigin.set(originKey, next.length - 1);
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

function campaignCombatContext(): {
	campaignId: string;
	sessionId: string;
} | null {
	if (typeof window === "undefined") return null;
	const params = new URLSearchParams(window.location.search);
	const campaignId = params.get("campaignId")?.trim();
	const sessionId = params.get("sessionId")?.trim();
	return campaignId && sessionId ? { campaignId, sessionId } : null;
}

function isPersistentCompanionHandoff(item: PendingCombatant): boolean {
	return Boolean(
		item.companionInstanceId ||
			(item.companionOriginTable && item.companionOriginRowId),
	);
}

/**
 * Return and clear pending combatants. When the Initiative Tracker is scoped to
 * a persisted campaign combat session, living companions are diverted to the
 * C3 bridge instead of being appended as anonymous local actors. This prevents
 * a second generic combatant row from bypassing stable-instance dedupe.
 */
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

	const context = campaignCombatContext();
	if (!context || queue.length === 0) return queue;

	const persistent = queue.filter(isPersistentCompanionHandoff);
	const local = queue.filter((item) => !isPersistentCompanionHandoff(item));
	if (persistent.length > 0) {
		window.dispatchEvent(
			new CustomEvent<CompanionCombatHandoffDetail>(
				COMPANION_COMBAT_HANDOFF_EVENT,
				{
					detail: {
						campaignId: context.campaignId,
						sessionId: context.sessionId,
						items: persistent,
					},
				},
			),
		);
	}
	return local;
}

/** Non-destructive read — useful for tests / diagnostics. */
export function peekInitiativeAdditions(): PendingCombatant[] {
	return readQueue();
}
