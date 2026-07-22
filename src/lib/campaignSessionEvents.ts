import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { logger } from "@/lib/logger";

/**
 * Bureau Field Recorder — session event producer.
 *
 * The Session Replay panel reads a merged timeline of a campaign's past: combat
 * turn/round transitions and applied effects (persisted here to
 * `campaign_session_events`) plus dice rolls (already persisted to
 * `campaign_roll_events` by the Game Log). This module is the single writer for
 * the combat/effect half — cloud insert when authenticated, localStorage in
 * guest/local mode. Never throws: recording a session event must not fail the
 * combat action that produced it.
 *
 * VTT event kinds (`token:*`, `scene:*`) are intentionally out of scope — the
 * VTT was retired; only combat/effect kinds are recorded.
 */

/** Recordable, non-VTT session-event kinds. */
export type SessionEventKind =
	| "combat:turnStart"
	| "combat:turnEnd"
	| "combat:roundStart"
	| "combat:roundEnd"
	| "effect:applied"
	| "effect:expired";

export interface SessionEventInput {
	campaignId: string;
	sessionId?: string | null;
	actorId?: string | null;
	kind: SessionEventKind;
	payload: Record<string, unknown>;
}

/** Row shape shared by the cloud table and the guest mirror. */
export interface SessionEventRecord {
	id: number | string;
	campaign_id: string;
	session_id: string | null;
	actor_id: string | null;
	kind: string;
	payload: Record<string, unknown>;
	created_at: string;
}

export const LOCAL_SESSION_EVENTS_KEY =
	"solo-compendium.campaign-session-events.v1";

const LOCAL_EVENT_CAP = 2000;

export function listLocalSessionEvents(
	campaignId: string,
	sessionId?: string | null,
): SessionEventRecord[] {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(LOCAL_SESSION_EVENTS_KEY);
	if (!raw) return [];
	try {
		const all = JSON.parse(raw) as SessionEventRecord[];
		if (!Array.isArray(all)) return [];
		return all
			.filter((e) => e.campaign_id === campaignId)
			.filter((e) => !sessionId || e.session_id === sessionId)
			.sort((a, b) => a.created_at.localeCompare(b.created_at));
	} catch {
		return [];
	}
}

function appendLocalSessionEvent(event: SessionEventRecord) {
	if (typeof window === "undefined") return;
	let all: SessionEventRecord[] = [];
	try {
		const raw = window.localStorage.getItem(LOCAL_SESSION_EVENTS_KEY);
		all = raw ? (JSON.parse(raw) as SessionEventRecord[]) : [];
		if (!Array.isArray(all)) all = [];
	} catch {
		all = [];
	}
	all.push(event);
	try {
		window.localStorage.setItem(
			LOCAL_SESSION_EVENTS_KEY,
			JSON.stringify(all.slice(-LOCAL_EVENT_CAP)),
		);
	} catch {
		// Storage full/unavailable — the combat action itself already succeeded.
	}
}

/**
 * Record one combat/effect session event. Cloud when authed, localStorage in
 * guest mode. Never throws.
 */
export async function publishSessionEvent(
	input: SessionEventInput,
	userId: string | null,
): Promise<void> {
	const localEvent = (): SessionEventRecord => ({
		id: crypto.randomUUID(),
		created_at: new Date().toISOString(),
		campaign_id: input.campaignId,
		session_id: input.sessionId ?? null,
		actor_id: input.actorId ?? null,
		kind: input.kind,
		payload: input.payload,
	});

	if (!isSupabaseConfigured || !userId) {
		appendLocalSessionEvent(localEvent());
		return;
	}

	try {
		const { error } = await supabase.from("campaign_session_events").insert({
			campaign_id: input.campaignId,
			session_id: input.sessionId ?? null,
			actor_id: input.actorId ?? null,
			kind: input.kind,
			payload: input.payload as Json,
		});
		if (error) throw error;
	} catch (error) {
		logger.warn("Session event record failed; keeping local copy", { error });
		appendLocalSessionEvent(localEvent());
	}
}
