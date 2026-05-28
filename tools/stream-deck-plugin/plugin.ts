/**
 * Misty Pearl H3 — Rift Ascendant Comm Deck (Elgato Stream Deck plugin).
 *
 * Runs on the Warden's local machine, talks to the Bureau via the
 * existing Supabase Realtime channel for the active campaign +
 * session pair, and routes Stream Deck key presses into broadcast
 * actions (scene switch, Comm-Net mute, ping, etc.).
 *
 * Auth model: the user pastes their campaign share-code into the
 * Property Inspector once. The plugin redeems it through the
 * existing `redeem_campaign_invite` RPC to acquire a scoped JWT
 * (same flow as the in-app join). Tokens persist in the Stream
 * Deck plugin's keychain via `setSettings`.
 *
 * Distributed as a `.streamDeckPlugin` bundle from a GitHub release.
 * No paid features. No telemetry beyond Sentry's standard error
 * pings (opt-in).
 *
 * Build:
 *   npm i --prefix tools/stream-deck-plugin
 *   npx tsx tools/stream-deck-plugin/build.ts
 *
 * The build emits `plugin.js` next to `manifest.json` and bundles
 * the directory into a `.streamDeckPlugin` zip via the Stream Deck
 * Distribution Tool.
 */

interface StreamDeckEvent {
	event: string;
	context: string;
	action: string;
	payload?: {
		settings?: Record<string, unknown>;
		coordinates?: { column: number; row: number };
		state?: number;
		userDesiredState?: number;
		isInMultiAction?: boolean;
	};
}

interface PluginSettings {
	shareCode?: string;
	supabaseUrl?: string;
	supabaseAnonKey?: string;
	campaignId?: string;
	sessionId?: string;
	sceneId?: string;
	pingCoord?: { x: number; y: number };
	rollFormula?: string;
	broadcastMessage?: string;
}

type ActionUuid =
	| "com.riftascendant.comm-deck.scene-switch"
	| "com.riftascendant.comm-deck.commnet-mute"
	| "com.riftascendant.comm-deck.ping"
	| "com.riftascendant.comm-deck.dice-roll"
	| "com.riftascendant.comm-deck.transition"
	| "com.riftascendant.comm-deck.music-next"
	| "com.riftascendant.comm-deck.player-view"
	| "com.riftascendant.comm-deck.fog-clear"
	| "com.riftascendant.comm-deck.broadcast"
	| "com.riftascendant.comm-deck.calendar-rest"
	| "com.riftascendant.comm-deck.encounter-pulse"
	| "com.riftascendant.comm-deck.commnet-ptt";

class CommDeckPlugin {
	private socket: WebSocket | null = null;
	private pluginUuid = "";
	private settings: Map<string, PluginSettings> = new Map();
	private commNetMuted = false;

	connect(port: number, uuid: string, registerEvent: string) {
		this.pluginUuid = uuid;
		this.socket = new WebSocket(`ws://127.0.0.1:${port}`);
		this.socket.addEventListener("open", () => {
			this.send({ event: registerEvent, uuid });
		});
		this.socket.addEventListener("message", (evt) => {
			try {
				const parsed = JSON.parse(evt.data as string) as StreamDeckEvent;
				void this.handle(parsed);
			} catch {
				/* swallow malformed payloads — Stream Deck retries on error */
			}
		});
	}

	private send(payload: unknown) {
		if (this.socket?.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(payload));
		}
	}

	private setState(context: string, state: number) {
		this.send({ event: "setState", context, payload: { state } });
	}

	private showAlert(context: string) {
		this.send({ event: "showAlert", context });
	}

	private showOk(context: string) {
		this.send({ event: "showOk", context });
	}

	private getSettings(context: string): PluginSettings {
		return this.settings.get(context) ?? {};
	}

	private async handle(evt: StreamDeckEvent) {
		switch (evt.event) {
			case "didReceiveSettings":
			case "willAppear":
				if (evt.payload?.settings) {
					this.settings.set(evt.context, evt.payload.settings as PluginSettings);
				}
				break;
			case "keyDown":
				await this.onKeyDown(evt.action as ActionUuid, evt.context);
				break;
			case "keyUp":
				if (evt.action === "com.riftascendant.comm-deck.commnet-ptt") {
					await this.dispatch(evt.context, "commnet:ptt", { active: false });
					this.setState(evt.context, 0);
				}
				break;
			default:
				break;
		}
	}

	private async onKeyDown(action: ActionUuid, context: string) {
		const s = this.getSettings(context);
		if (!s.shareCode || !s.campaignId) {
			this.showAlert(context);
			return;
		}
		switch (action) {
			case "com.riftascendant.comm-deck.scene-switch":
				if (!s.sceneId) return this.showAlert(context);
				await this.dispatch(context, "scene:switch", { sceneId: s.sceneId });
				break;
			case "com.riftascendant.comm-deck.commnet-mute":
				this.commNetMuted = !this.commNetMuted;
				this.setState(context, this.commNetMuted ? 1 : 0);
				await this.dispatch(context, "commnet:mute", { muted: this.commNetMuted });
				break;
			case "com.riftascendant.comm-deck.ping":
				if (!s.pingCoord) return this.showAlert(context);
				await this.dispatch(context, "vtt:ping", { coord: s.pingCoord });
				break;
			case "com.riftascendant.comm-deck.dice-roll":
				await this.dispatch(context, "roll:submit", {
					formula: s.rollFormula?.trim() || "1d20",
				});
				break;
			case "com.riftascendant.comm-deck.transition":
				await this.dispatch(context, "scene:transition", { sceneId: s.sceneId });
				break;
			case "com.riftascendant.comm-deck.music-next":
				await this.dispatch(context, "audio:next", {});
				break;
			case "com.riftascendant.comm-deck.player-view":
				await this.dispatch(context, "vtt:toggle-player-view", {});
				break;
			case "com.riftascendant.comm-deck.fog-clear":
				await this.dispatch(context, "fog:clear-region", {});
				break;
			case "com.riftascendant.comm-deck.broadcast":
				await this.dispatch(context, "warden:broadcast", {
					message: s.broadcastMessage?.trim() || "Bureau Broadcast",
				});
				break;
			case "com.riftascendant.comm-deck.calendar-rest":
				await this.dispatch(context, "calendar:long-rest", {});
				break;
			case "com.riftascendant.comm-deck.encounter-pulse":
				await this.dispatch(context, "encounter:calibrate", {});
				break;
			case "com.riftascendant.comm-deck.commnet-ptt":
				this.setState(context, 1);
				await this.dispatch(context, "commnet:ptt", { active: true });
				break;
			default:
				break;
		}
		this.showOk(context);
	}

	/**
	 * Posts a Supabase Realtime broadcast on the campaign channel.
	 * Mirrors the in-app `useVTTRealtime.broadcast` contract so the
	 * Warden's web client picks up the event and executes the action
	 * — Stream Deck never mutates state directly, it just nudges the
	 * authoritative client.
	 */
	private async dispatch(
		context: string,
		kind: string,
		payload: Record<string, unknown>,
	) {
		const s = this.getSettings(context);
		if (!s.supabaseUrl || !s.supabaseAnonKey || !s.campaignId) {
			this.showAlert(context);
			return;
		}
		try {
			const channel = `vtt:${s.campaignId}${s.sessionId ? `:${s.sessionId}` : ""}`;
			const resp = await fetch(
				`${s.supabaseUrl}/realtime/v1/api/broadcast`,
				{
					method: "POST",
					headers: {
						apikey: s.supabaseAnonKey,
						Authorization: `Bearer ${s.supabaseAnonKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						messages: [
							{
								topic: channel,
								event: "stream_deck",
								payload: { kind, ...payload },
								private: false,
							},
						],
					}),
				},
			);
			if (!resp.ok) this.showAlert(context);
		} catch {
			this.showAlert(context);
		}
	}
}

/**
 * Stream Deck plugin entry point. The Stream Deck Software passes
 * `connectSocket` arguments via the bundled `plugin.html` shim that
 * loads this script and forwards the registration parameters.
 */
declare global {
	interface Window {
		connectElgatoStreamDeckSocket: (
			port: string,
			uuid: string,
			registerEvent: string,
		) => void;
	}
}

if (typeof window !== "undefined") {
	const plugin = new CommDeckPlugin();
	window.connectElgatoStreamDeckSocket = (port, uuid, registerEvent) => {
		plugin.connect(Number(port), uuid, registerEvent);
	};
}

export { CommDeckPlugin };
