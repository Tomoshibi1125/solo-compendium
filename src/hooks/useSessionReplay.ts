/**
 * Bureau Field Recorder client.
 *
 * Reads a campaign's past as a single ordered timeline — combat turn/round
 * transitions + applied effects from `campaign_session_events`, merged with dice
 * rolls from `campaign_roll_events` (the Game Log) — and exposes a scrubber-ready
 * API. During playback it re-emits combat/effect/roll events onto the Bureau
 * Directive Bus so any live listener (module host, future surfaces) can
 * reconstruct the moment; the panel itself renders the readable timeline.
 *
 * VTT kinds (`token:*`, `scene:*`) are out of scope — the VTT was retired.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
	type CampaignRollEventRow,
	listLocalCampaignRollEvents,
} from "@/lib/campaignRollEvents";
import {
	listLocalSessionEvents,
	type SessionEventRecord,
} from "@/lib/campaignSessionEvents";
import { hooks } from "@/lib/hooks/registry";

export interface SessionEventRow {
	id: number | string;
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
	"combat:turnStart",
	"combat:turnEnd",
	"combat:roundStart",
	"combat:roundEnd",
	"roll:submitted",
	"effect:applied",
	"effect:expired",
]);

/** Map a Game Log roll row into the unified session-timeline shape. */
function rollToSessionRow(roll: CampaignRollEventRow): SessionEventRow {
	return {
		id: `roll-${roll.id}`,
		campaign_id: roll.campaign_id,
		session_id: null,
		actor_id: roll.character_id,
		kind: "roll:submitted",
		payload: {
			actor: roll.character_name ?? "Unknown",
			formula: roll.dice_formula,
			result: roll.result,
			campaignId: roll.campaign_id,
			context: roll.context,
			rollType: roll.roll_type,
		},
		created_at: roll.created_at,
	};
}

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
		if (!campaignId) {
			setIsLoading(false);
			return;
		}
		let cancelled = false;

		const mergeAndSet = (
			sessionRows: SessionEventRow[],
			rollRows: CampaignRollEventRow[],
		) => {
			const merged = [...sessionRows, ...rollRows.map(rollToSessionRow)].sort(
				(a, b) => a.created_at.localeCompare(b.created_at),
			);
			setEvents(merged);
		};

		const load = async () => {
			setIsLoading(true);

			// Guest / no-backend: read the localStorage mirrors.
			const {
				data: { user },
			} = isSupabaseConfigured
				? await supabase.auth.getUser()
				: { data: { user: null } };

			if (!isSupabaseConfigured || !user) {
				if (cancelled) return;
				mergeAndSet(
					listLocalSessionEvents(campaignId, sessionId) as SessionEventRow[],
					listLocalCampaignRollEvents(campaignId),
				);
				setIsLoading(false);
				return;
			}

			const sessionQuery = supabase
				.from("campaign_session_events")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: true })
				.limit(20_000);
			const sessionResult = sessionId
				? await sessionQuery.eq("session_id", sessionId)
				: await sessionQuery;

			const rollResult = await supabase
				.from("campaign_roll_events")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: true })
				.limit(20_000);

			if (cancelled) return;

			const isMissingTable = (err: unknown) => {
				const code = (err as { code?: string })?.code;
				return code === "42P01" || code === "PGRST205";
			};

			if (sessionResult.error && !isMissingTable(sessionResult.error)) {
				console.warn("[useSessionReplay] load failed:", sessionResult.error);
			}

			mergeAndSet(
				(sessionResult.error
					? []
					: ((sessionResult.data ??
							[]) as unknown as SessionEventRecord[])) as SessionEventRow[],
				rollResult.error ? [] : (rollResult.data ?? []),
			);
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
			const nextCursor = cursorRef.current;
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
				setCursor(targetMs - startTs);
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
