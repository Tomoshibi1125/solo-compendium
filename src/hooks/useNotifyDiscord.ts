/**
 * Misty Pearl E3 — Discord webhook bridge client hook.
 *
 * Thin typed wrapper around the `notify-discord` edge function. Always
 * fire-and-forget: failures are logged and swallowed so the calling
 * action never blocks.
 */
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type DiscordNotifyKind =
	| "session_scheduled"
	| "session_reminder"
	| "warden_broadcast"
	| "dice_roll"
	| "test";

interface DiscordNotifyPayload {
	title?: string;
	date?: string;
	message?: string;
	formula?: string;
	result?: number | string;
	actor?: string;
	[key: string]: unknown;
}

interface DiscordNotifyResult {
	delivered: boolean;
	reason?: string;
	status?: number;
	error?: string;
}

/**
 * Invoke the `notify-discord` edge function. Resolves with
 * `{ delivered: false, ... }` on any failure so callers can show a
 * non-blocking toast without bubbling an exception.
 */
async function invokeNotifyDiscord(args: {
	campaignId: string;
	kind: DiscordNotifyKind;
	payload?: DiscordNotifyPayload;
}): Promise<DiscordNotifyResult> {
	try {
		const { data, error } = await supabase.functions.invoke("notify-discord", {
			body: args,
		});
		if (error) {
			console.warn("[notify-discord] invoke error:", error);
			return { delivered: false, error: error.message ?? "invoke_error" };
		}
		return (data as DiscordNotifyResult) ?? { delivered: false };
	} catch (e) {
		console.warn("[notify-discord] threw:", e);
		return { delivered: false, error: "threw" };
	}
}

export function useNotifyDiscord() {
	const notify = useCallback(
		(args: {
			campaignId: string;
			kind: DiscordNotifyKind;
			payload?: DiscordNotifyPayload;
		}) => invokeNotifyDiscord(args),
		[],
	);
	return { notify };
}
