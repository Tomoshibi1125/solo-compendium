/**
 * Misty Pearl G3 — Bureau Directive Extensions (module system).
 *
 * Sandboxed extension API. Modules are JS bundles loaded into a Web
 * Worker so they can't touch the DOM or Supabase directly. They
 * communicate with the host via a typed message contract that:
 *
 *   - lets them SUBSCRIBE to hooks from the Bureau Directive Bus
 *   - lets them READ frozen snapshots of scene state
 *   - lets them REQUEST `Action`s that the host validates + executes
 *     under the caller's existing RBAC
 *   - lets them REGISTER UI extensions in well-known slots
 *
 * **No remote module registry** in v1 — Wardens upload module
 * bundles to their campaign storage manually, and the host opt-in
 * installs them per-campaign. A community-curated registry would be
 * a separate ticket with moderation needs (explicitly out of scope).
 *
 * Risk model: the worker boundary is the airtight seal. If you ever
 * change the message contract, audit the host validators to prevent
 * a module from triggering an action it shouldn't have access to.
 */
import { type HookKind, hooks } from "@/lib/hooks/registry";

export interface ModuleManifest {
	id: string;
	name: string;
	version: string;
	author: string;
	description?: string;
	/** Bundle URL — must be same-origin so we can Workerize it. */
	bundleUrl: string;
	/** Hooks the module wants to subscribe to. */
	hooks: HookKind[];
	/** Action kinds the module wants to dispatch. */
	actions: ModuleActionKind[];
	/** UI slots the module wants to render in. */
	uiSlots?: ModuleUiSlot[];
}

export type ModuleActionKind =
	| "chat:send"
	| "toast:show"
	| "log:append"
	| "scene:fog-toggle";

export type ModuleUiSlot = "right-rail-tab" | "left-rail-section";

interface HostMessage {
	id?: string;
	type: "hook:fire" | "ack:subscribe" | "ack:action" | "scene:snapshot";
	payload?: unknown;
}

interface WorkerMessage {
	id?: string;
	type: "subscribe" | "unsubscribe" | "action" | "scene:request";
	payload: unknown;
}

interface InstalledModule {
	manifest: ModuleManifest;
	worker: Worker;
	hookDisposers: Array<() => void>;
}

/**
 * One module-system instance per campaign. The host owns the Worker
 * lifecycle and translates between Worker messages and the Bureau
 * Directive Bus + scene state.
 */
class ModuleHost {
	private installed: Map<string, InstalledModule> = new Map();
	private sceneSnapshotProvider: () => unknown = () => null;

	setSceneSnapshotProvider(fn: () => unknown) {
		this.sceneSnapshotProvider = fn;
	}

	async install(manifest: ModuleManifest) {
		if (this.installed.has(manifest.id)) {
			throw new Error(`Module ${manifest.id} already installed`);
		}
		// Spawn the worker. We use the `type: "module"` form so the
		// bundle can `import` standard ES modules. The CSP must allow
		// `worker-src 'self' blob:` for this to work.
		const worker = new Worker(manifest.bundleUrl, { type: "module" });
		const hookDisposers: Array<() => void> = [];

		for (const kind of manifest.hooks) {
			const dispose = hooks.on(kind as HookKind, (payload) => {
				worker.postMessage({
					type: "hook:fire",
					payload: { kind, data: payload },
				} satisfies HostMessage);
			});
			hookDisposers.push(dispose);
		}

		worker.addEventListener("message", (evt) => {
			const msg = evt.data as WorkerMessage;
			if (!msg || typeof msg.type !== "string") return;
			this.handleWorkerMessage(manifest, worker, msg);
		});

		this.installed.set(manifest.id, { manifest, worker, hookDisposers });
	}

	uninstall(moduleId: string) {
		const entry = this.installed.get(moduleId);
		if (!entry) return;
		for (const dispose of entry.hookDisposers) dispose();
		entry.worker.terminate();
		this.installed.delete(moduleId);
	}

	uninstallAll() {
		for (const id of Array.from(this.installed.keys())) this.uninstall(id);
	}

	private handleWorkerMessage(
		manifest: ModuleManifest,
		worker: Worker,
		msg: WorkerMessage,
	) {
		switch (msg.type) {
			case "action": {
				const { kind } = (msg.payload ?? {}) as { kind?: ModuleActionKind };
				if (!kind || !manifest.actions.includes(kind)) {
					this.replyError(worker, msg.id, "action_not_authorized");
					return;
				}
				// Action dispatch is delegated to the host UI layer via
				// a custom DOM event so the campaign / VTT page can pick
				// it up under the caller's RBAC. We don't directly call
				// Supabase from here — that would bypass RLS.
				window.dispatchEvent(
					new CustomEvent("bureau:module-action", {
						detail: { moduleId: manifest.id, action: msg.payload },
					}),
				);
				worker.postMessage({
					type: "ack:action",
					id: msg.id,
				} satisfies HostMessage);
				break;
			}
			case "scene:request":
				worker.postMessage({
					type: "scene:snapshot",
					id: msg.id,
					payload: Object.freeze(this.sceneSnapshotProvider()),
				} satisfies HostMessage);
				break;
			default:
				break;
		}
	}

	private replyError(worker: Worker, id: string | undefined, reason: string) {
		worker.postMessage({
			type: "ack:action",
			id,
			payload: { ok: false, reason },
		} satisfies HostMessage);
	}
}

/** Singleton host. One module surface per app session. */
export const moduleHost = new ModuleHost();
