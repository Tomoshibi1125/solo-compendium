/**
 * Misty Pearl G1 — Public Hooks API ("Bureau Directive Bus").
 *
 * Small, typed event bus that lets the host emit lifecycle events and
 * lets the rest of the codebase (and, eventually, sandboxed modules
 * per G3) subscribe to them.
 *
 * Design goals:
 *   - **Pure module**: no React, no DOM, no Supabase.
 *   - **Frozen payloads**: subscribers get `readonly` snapshots — they
 *     cannot accidentally mutate host state.
 *   - **Stable kind catalog**: adding a new `HookKind` is a public-API
 *     change; removing one is a breaking change. The current set is
 *     documented in `docs/hooks-api.md` (separate ticket).
 *   - **Unsubscribe by handle**: `on()` returns a disposer rather than
 *     requiring a separate `off()` call. Mirrors the Yjs / Liveblocks
 *     convention.
 *   - **Synchronous emit**: keeps the contract simple and side-effect
 *     ordering predictable. Listeners that need async work should
 *     queue it themselves.
 *
 * Errors thrown inside listeners are caught and logged so a single bad
 * listener can't kill an emit chain — Foundry does the same.
 *
 * RA theming: "Bureau Directive Bus" — the System's signal channel.
 */

// -------------------------------------------------------------------
// Event kind catalog. Add new entries here when wiring a new emit site;
// keep the payload type narrow (frozen on emit).
// -------------------------------------------------------------------

export interface HookPayloadMap {
	"token:created": { tokenId: string; sceneId: string };
	"token:moved": {
		tokenId: string;
		sceneId: string;
		/** Prior position. Null when the emit site doesn't have it (e.g. broadcast helpers). */
		from: { x: number; y: number } | null;
		to: { x: number; y: number };
	};
	"token:removed": { tokenId: string; sceneId: string };
	"scene:loaded": { sceneId: string; campaignId: string };
	"scene:changed": {
		previousSceneId: string | null;
		nextSceneId: string | null;
		campaignId: string;
	};
	"combat:turnStart": {
		sessionId: string;
		round: number;
		actorTokenId: string | null;
	};
	"combat:turnEnd": {
		sessionId: string;
		round: number;
		actorTokenId: string | null;
	};
	"combat:roundStart": { sessionId: string; round: number };
	"combat:roundEnd": { sessionId: string; round: number };
	"roll:submitted": {
		actor: string;
		formula: string;
		result: number;
		campaignId: string | null;
	};
	"effect:applied": {
		tokenId: string;
		effectId: string;
		effectName: string;
	};
	"effect:expired": {
		tokenId: string;
		effectId: string;
		effectName: string;
	};
}

export type HookKind = keyof HookPayloadMap;

export type HookListener<K extends HookKind> = (
	payload: Readonly<HookPayloadMap[K]>,
) => void;

export type HookDisposer = () => void;

// -------------------------------------------------------------------
// Registry impl. One module-level instance covers the whole app; this
// matches Foundry's `Hooks` global. For tests we expose `createHookRegistry`
// so each test gets a fresh bus without cross-test leakage.
// -------------------------------------------------------------------

export interface HookRegistry {
	on<K extends HookKind>(kind: K, listener: HookListener<K>): HookDisposer;
	off<K extends HookKind>(kind: K, listener: HookListener<K>): void;
	once<K extends HookKind>(kind: K, listener: HookListener<K>): HookDisposer;
	emit<K extends HookKind>(kind: K, payload: HookPayloadMap[K]): void;
	listenerCount<K extends HookKind>(kind: K): number;
	clear(): void;
}

export function createHookRegistry(): HookRegistry {
	const listeners = new Map<HookKind, Set<HookListener<HookKind>>>();

	const getBucket = <K extends HookKind>(kind: K) => {
		let bucket = listeners.get(kind) as Set<HookListener<K>> | undefined;
		if (!bucket) {
			bucket = new Set<HookListener<K>>();
			listeners.set(kind, bucket as Set<HookListener<HookKind>>);
		}
		return bucket;
	};

	const on: HookRegistry["on"] = (kind, listener) => {
		const bucket = getBucket(kind);
		bucket.add(listener);
		return () => {
			bucket.delete(listener);
		};
	};

	const off: HookRegistry["off"] = (kind, listener) => {
		const bucket = listeners.get(kind);
		bucket?.delete(listener as HookListener<HookKind>);
	};

	const once: HookRegistry["once"] = (kind, listener) => {
		const dispose = on(kind, ((payload) => {
			dispose();
			listener(payload);
		}) as typeof listener);
		return dispose;
	};

	const emit: HookRegistry["emit"] = (kind, payload) => {
		const bucket = listeners.get(kind);
		if (!bucket || bucket.size === 0) return;
		// Freeze a shallow copy so listeners can't mutate host state.
		const frozen = Object.freeze({ ...payload });
		// Snapshot to a list so a disposer fired during emit doesn't
		// skip the next listener.
		const snapshot = Array.from(bucket);
		for (const listener of snapshot) {
			try {
				(listener as HookListener<typeof kind>)(
					frozen as Readonly<HookPayloadMap[typeof kind]>,
				);
			} catch (error) {
				// One bad listener must not kill the chain. Log + continue.
				console.error(`[hooks] listener for "${kind}" threw:`, error);
			}
		}
	};

	const listenerCount: HookRegistry["listenerCount"] = (kind) =>
		listeners.get(kind)?.size ?? 0;

	const clear: HookRegistry["clear"] = () => {
		listeners.clear();
	};

	return { on, off, once, emit, listenerCount, clear };
}

/**
 * App-wide singleton registry. Module-level — there's exactly one bus
 * per page load. Tests should prefer `createHookRegistry()` to keep
 * state isolated.
 */
export const hooks: HookRegistry = createHookRegistry();
