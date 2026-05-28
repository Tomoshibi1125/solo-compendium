/**
 * Misty Pearl H4 — Bureau Field Recorder client.
 *
 * Reads `campaign_session_events` rows, exposes a scrubber-ready API,
 * and emits replayed events back onto the Bureau Directive Bus so
 * existing UI (Pixi stage, initiative tracker, chat) reconstructs the
 * past without any new code paths.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { hooks } from "@/lib/hooks/registry";

export interface SessionEventRow {
	id: number;
	campaign_id: string;
	session_id: string | null;
	actor_id: string | null;
	kind: string;
	payload: Record<string, unknown>;
	created_at: string;
}

export interface UseSessionReplayOptions {
	campaignId: string;
	sessionId?: string | null;
}

export interface UseSessionReplayResult {
	events: SessionEventRow[];
	isLoading: boolean;
	cursor: number;
	playing: boolean;
	speed: number;
	setCursor: (next: number) => void;
	setSpeed: (next: number) => void;
	play: () => void;
	pause: () => void;
	stop: () => void;
}

const REPLAY_HOOK_KINDS = new Set([
	"token:created",
	"token:moved",
	"token:removed",
	"scene:changed",
	"combat:turnStart",
	"combat:turnEnd",
	"combat:roundStart",
	"combat:roundEnd",
	"roll:submitted",
	"effect:applied",
	"effect:expired",
]);

export function useSessionReplay({
	campaignId,
	sessionId,
}: UseSessionReplayOptions): UseSessionReplayResult {
	const [events, setEvents] = useState<SessionEventRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [cursor, setCursor] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [speed, setSpeed] = useState(1);
	const playingRef = useRef(playing);
	const cursorRef = useRef(cursor);
	const speedRef = useRef(speed);

	playingRef.current = playing;
	cursorRef.current = cursor;
	speedRef.current = speed;

	useEffect(() => {
		if (!isSupabaseConfigured || !campaignId) {
			setIsLoading(false);
			return;
		}
		let cancelled = false;
		const load = async () => {
			setIsLoading(true);
			const query = supabase
				// biome-ignore lint/suspicious/noExplicitAny: pre-typegen table
				.from("campaign_session_events" as any)
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: true })
				.limit(20_000);
			const filtered = sessionId
				? await query.eq("session_id", sessionId)
				: await query;
			if (cancelled) return;
			const { data, error } = filtered;
			if (error) {
				if (
					(error as { code?: string }).code !== "42P01" &&
					(error as { code?: string }).code !== "PGRST205"
				) {
					console.warn("[useSessionReplay] load failed:", error);
				}
				setEvents([]);
			} else {
				setEvents((data ?? []) as unknown as SessionEventRow[]);
			}
			setIsLoading(false);
		};
		void load();
		return () => {
			cancelled = true;
		};
	}, [campaignId, sessionId]);

	useEffect(() => {
		if (!playing) return;
		let raf: number | null = null;
		let lastTs = performance.now();
		const tick = (now: number) => {
			raf = requestAnimationFrame(tick);
			if (!playingRef.current) return;
			const elapsedMs = (now - lastTs) * speedRef.current;
			lastTs = now;
			if (events.length === 0) return;
			let nextCursor = cursorRef.current;
			let consumed = 0;
			const startTs = events[0]?.created_at
				? Date.parse(events[0].created_at)
				: now;
			const cursorMs = startTs + cursorRef.current;
			const targetMs = cursorMs + elapsedMs;
			while (nextCursor + consumed < events.length) {
				const e = events[nextCursor + consumed];
				const t = Date.parse(e.created_at);
				if (t > targetMs) break;
				if (REPLAY_HOOK_KINDS.has(e.kind)) {
					hooks.emit(
						e.kind as Parameters<typeof hooks.emit>[0],
						e.payload as never,
					);
				}
				consumed += 1;
			}
			if (consumed > 0) {
				setCursor(nextCursor + consumed > events.length - 1
					? targetMs - startTs
					: targetMs - startTs);
			}
			if (nextCursor + consumed >= events.length) {
				setPlaying(false);
				playingRef.current = false;
			}
		};
		raf = requestAnimationFrame(tick);
		return () => {
			if (raf !== null) cancelAnimationFrame(raf);
		};
	}, [playing, events]);

	const api = useMemo<UseSessionReplayResult>(
		() => ({
			events,
			isLoading,
			cursor,
			playing,
			speed,
			setCursor: (next) => setCursor(Math.max(0, next)),
			setSpeed: (next) => setSpeed(Math.max(0.25, Math.min(8, next))),
			play: () => setPlaying(true),
			pause: () => setPlaying(false),
			stop: () => {
				setPlaying(false);
				setCursor(0);
			},
		}),
		[events, isLoading, cursor, playing, speed],
	);

	return api;
}
