/**
 * `notify()` — the one app-wide producer bridge for in-app notifications.
 *
 * Any code (inside or outside React) can call this to drop a notification in
 * the NavBar bell. It prefers the canonical server-backed path
 * (`add_user_notification` RPC, which the `useUserNotifications` inbox picks up
 * via Supabase realtime) and falls back to the local cache + a window event
 * (so the local `useNotifications` hook live-refreshes) when offline / guest /
 * unauthenticated.
 *
 * This is the single API the system phases call instead of poking the
 * notification cache directly.
 */
import {
	loadNotifications,
	NOTIFICATIONS_UPDATED_EVENT,
	type Notification,
	type NotificationPriority,
	type NotificationType,
	saveNotifications,
} from "@/hooks/useNotifications";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export type NotifyKind =
	| "info"
	| "success"
	| "warning"
	| "error"
	| "campaign_invite"
	| "mention"
	| "level_ready"
	| "system";

/** Map the extended server kinds onto the 4 local visual types. */
const KIND_TO_LOCAL_TYPE: Record<NotifyKind, NotificationType> = {
	info: "info",
	success: "success",
	warning: "warning",
	error: "error",
	campaign_invite: "success",
	mention: "info",
	level_ready: "info",
	system: "info",
};

const DAY_MS = 24 * 60 * 60 * 1000;

export interface NotifyInput {
	/**
	 * Target recipient. Defaults to the authenticated current user. Pass an
	 * explicit id to notify someone else (e.g. fanning out a chat mention to
	 * the mentioned member). When targeting another user, only the server
	 * path applies — we can't write into a different user's local cache.
	 */
	userId?: string;
	type?: NotifyKind;
	title: string;
	message?: string;
	priority?: NotificationPriority;
	category?: string;
	link?: string;
	payload?: Record<string, unknown>;
	expiresInDays?: number;
}

function emitUpdated(): void {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
	}
}

function writeLocal(input: NotifyInput): void {
	const now = Date.now();
	const note: Notification = {
		id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
		type: KIND_TO_LOCAL_TYPE[input.type ?? "info"],
		priority: input.priority ?? "normal",
		title: input.title,
		message: input.message,
		read: false,
		createdAt: now,
		category: input.category ?? input.type,
		expiresAt: input.expiresInDays
			? now + input.expiresInDays * DAY_MS
			: undefined,
	};
	saveNotifications([note, ...loadNotifications()]);
	emitUpdated();
}

type RpcFn = (
	name: string,
	params: Record<string, unknown>,
) => Promise<{ data: unknown; error: Error | null }>;

/**
 * Emit a notification. Resolves once persisted (server or local). Never
 * throws — a failed notification must not break the action that triggered it.
 */
export async function notify(input: NotifyInput): Promise<void> {
	if (isSupabaseConfigured) {
		try {
			const { data: auth } = await supabase.auth.getUser();
			const currentUid = auth?.user?.id;
			const targetUid = input.userId ?? currentUid;
			if (targetUid) {
				const { error } = await (supabase.rpc as unknown as RpcFn)(
					"add_user_notification",
					{
						p_user_id: targetUid,
						p_type: input.type ?? "info",
						p_title: input.title,
						p_message: input.message ?? null,
						p_priority: input.priority ?? "normal",
						p_category: input.category ?? null,
						p_payload: input.payload ?? {},
						p_link: input.link ?? null,
						p_expires_at: input.expiresInDays
							? new Date(
									Date.now() + input.expiresInDays * DAY_MS,
								).toISOString()
							: null,
					},
				);
				if (error) throw error;
				// Only nudge the local cache/bell when the note is for the current
				// user — the realtime inbox handles other recipients on their device.
				if (targetUid === currentUid) emitUpdated();
				return;
			}
		} catch (err) {
			logger.warn("notify: server path failed, using local cache", err);
		}
	}
	// Local fallback only applies to the current user's own inbox.
	if (!input.userId) writeLocal(input);
}

/** Fire-and-forget variant for call sites that don't await. */
export function notifyAsync(input: NotifyInput): void {
	void notify(input);
}

export const notifySuccess = (
	title: string,
	opts: Omit<NotifyInput, "title" | "type"> = {},
) => notify({ ...opts, type: "success", title });

export const notifyError = (
	title: string,
	opts: Omit<NotifyInput, "title" | "type"> = {},
) =>
	notify({ ...opts, type: "error", priority: opts.priority ?? "high", title });
