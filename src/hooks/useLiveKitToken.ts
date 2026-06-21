/**
 * Misty Pearl I3 — Client hook that mints a short-lived LiveKit token
 * via the `mint-livekit-token` edge function for the current campaign +
 * session, then refreshes ~5 min before expiry so the SFU connection
 * never drops mid-session.
 */
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseLiveKitTokenOptions {
	campaignId: string | null | undefined;
	sessionId?: string | null;
	/** Set false to skip token minting entirely (e.g. trystero transport). */
	enabled: boolean;
}

interface LiveKitTokenSnapshot {
	url: string;
	token: string;
	room: string;
	expiresAt: number;
}

interface UseLiveKitTokenResult {
	snapshot: LiveKitTokenSnapshot | null;
	isLoading: boolean;
	error: Error | null;
	refresh: () => Promise<void>;
}

export function useLiveKitToken(
	options: UseLiveKitTokenOptions,
): UseLiveKitTokenResult {
	const { campaignId, sessionId, enabled } = options;
	const [snapshot, setSnapshot] = useState<LiveKitTokenSnapshot | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const refresh = useCallback(async () => {
		if (!enabled || !campaignId) return;
		setIsLoading(true);
		setError(null);
		try {
			const { data, error: invokeErr } = await supabase.functions.invoke(
				"mint-livekit-token",
				{ body: { campaignId, sessionId: sessionId ?? null } },
			);
			if (invokeErr) throw invokeErr;
			const payload = data as Partial<LiveKitTokenSnapshot> | null;
			if (
				!payload ||
				typeof payload.url !== "string" ||
				typeof payload.token !== "string" ||
				typeof payload.room !== "string" ||
				typeof payload.expiresAt !== "number"
			) {
				throw new Error("Malformed mint-livekit-token response");
			}
			setSnapshot({
				url: payload.url,
				token: payload.token,
				room: payload.room,
				expiresAt: payload.expiresAt,
			});
		} catch (e) {
			setError(
				e instanceof Error ? e : new Error("Failed to mint LiveKit token"),
			);
		} finally {
			setIsLoading(false);
		}
	}, [campaignId, sessionId, enabled]);

	useEffect(() => {
		if (!enabled || !campaignId) {
			setSnapshot(null);
			return;
		}
		void refresh();
	}, [enabled, campaignId, refresh]);

	// Schedule a pre-expiry refresh.
	useEffect(() => {
		if (!snapshot || !enabled) return;
		const nowSec = Math.floor(Date.now() / 1000);
		const secondsUntilRefresh = Math.max(
			60,
			snapshot.expiresAt - nowSec - 5 * 60,
		);
		const timer = window.setTimeout(() => {
			void refresh();
		}, secondsUntilRefresh * 1000);
		return () => window.clearTimeout(timer);
	}, [snapshot, enabled, refresh]);

	return { snapshot, isLoading, error, refresh };
}
