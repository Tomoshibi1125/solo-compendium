/**
 * Realtime channel-name helpers.
 *
 * supabase-js returns the SAME RealtimeChannel instance for a repeated channel
 * name, and v2.110+ throws on `.on()` after `subscribe()`. React StrictMode's
 * dev double-mount trips exactly that: the first mount subscribes, its cleanup
 * `removeChannel` is still in flight when the second mount asks for the same
 * name and gets the already-subscribed instance back (crashed CharacterSheetV2
 * via useRegentUnlocks).
 */

import { supabase } from "@/integrations/supabase/client";

let channelNonce = 0;

/**
 * Client-local channel name for `postgres_changes` subscriptions. Those topics
 * are client-local (the server routes by the filter, not the name), so a
 * per-mount nonce sidesteps instance reuse entirely. Do NOT use for
 * broadcast/presence channels — their names must match across clients; use
 * `freshSharedChannel` there instead.
 */
export function clientChannelName(base: string): string {
	channelNonce += 1;
	return `${base}:c${channelNonce}`;
}

/**
 * Broadcast/presence channel with a shared (cross-client) name: tears down any
 * stale same-name instance before creating, so a remount never touches an
 * already-subscribed channel.
 */
export function freshSharedChannel(name: string) {
	for (const existing of supabase.getChannels()) {
		if (existing.topic === `realtime:${name}`) {
			supabase.removeChannel(existing);
		}
	}
	return supabase.channel(name);
}
