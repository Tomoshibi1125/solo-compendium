import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { logger } from "@/lib/logger";

export type CampaignRollEventRow =
	Database["public"]["Tables"]["campaign_roll_events"]["Row"];

/**
 * Guest/local fallback store for the campaign roll feed. The same key the
 * feed's local polling mode reads — keep the two in lockstep.
 */
export const LOCAL_ROLL_EVENTS_KEY = "solo-compendium.campaign-roll-events.v1";

const LOCAL_EVENT_CAP = 200;

export function listLocalCampaignRollEvents(
	campaignId: string,
): CampaignRollEventRow[] {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(LOCAL_ROLL_EVENTS_KEY);
	if (!raw) return [];
	try {
		const all = JSON.parse(raw) as CampaignRollEventRow[];
		return Array.isArray(all)
			? all.filter((e) => e.campaign_id === campaignId).slice(0, 50)
			: [];
	} catch {
		return [];
	}
}

export function appendLocalCampaignRollEvent(event: CampaignRollEventRow) {
	if (typeof window === "undefined") return;
	let all: CampaignRollEventRow[] = [];
	try {
		const raw = window.localStorage.getItem(LOCAL_ROLL_EVENTS_KEY);
		all = raw ? (JSON.parse(raw) as CampaignRollEventRow[]) : [];
		if (!Array.isArray(all)) all = [];
	} catch {
		all = [];
	}
	all.unshift(event);
	try {
		window.localStorage.setItem(
			LOCAL_ROLL_EVENTS_KEY,
			JSON.stringify(all.slice(0, LOCAL_EVENT_CAP)),
		);
	} catch {
		// Storage full/unavailable — the roll itself already succeeded.
	}
}

/** DDB-parity roll visibility: `public` = everyone; `dm_only` = roller + DM. */
export type RollVisibility = "public" | "dm_only";

export interface CampaignRollEventInput {
	campaign_id: string;
	character_id?: string | null;
	character_name?: string | null;
	dice_formula: string;
	result: number;
	rolls: number[];
	roll_type?: string | null;
	context?: string | null;
	modifiers?: Json | null;
	visibility?: RollVisibility;
}

/**
 * Publish one roll to the campaign's shared roll feed (`campaign_roll_events`)
 * — the persisted "Game Log" every member's CampaignRollFeed / Activity panel
 * subscribes to. Cloud when authenticated, localStorage in guest/local mode.
 *
 * Never throws: the feed is a side channel — a failed publish must not fail
 * the roll that produced it.
 */
export async function publishCampaignRollEvent(
	input: CampaignRollEventInput,
	userId: string | null,
): Promise<void> {
	const visibility: RollVisibility = input.visibility ?? "public";

	const localEvent = (): CampaignRollEventRow =>
		({
			id: crypto.randomUUID(),
			created_at: new Date().toISOString(),
			campaign_id: input.campaign_id,
			user_id: userId ?? "guest",
			character_id: input.character_id ?? null,
			character_name: input.character_name ?? null,
			dice_formula: input.dice_formula,
			result: input.result,
			rolls: input.rolls,
			roll_type: input.roll_type ?? null,
			context: input.context ?? null,
			modifiers: input.modifiers ?? null,
			visibility,
		}) as CampaignRollEventRow;

	if (!isSupabaseConfigured || !userId) {
		appendLocalCampaignRollEvent(localEvent());
		return;
	}

	try {
		// Only send `visibility` for secret rolls: omitting it for public rolls
		// lets the column's DB default apply and keeps inserts working against a
		// database where the (additive) visibility migration hasn't landed yet.
		const { error } = await supabase.from("campaign_roll_events").insert({
			campaign_id: input.campaign_id,
			user_id: userId,
			character_id: input.character_id ?? null,
			character_name: input.character_name ?? null,
			dice_formula: input.dice_formula,
			result: input.result,
			rolls: input.rolls,
			roll_type: input.roll_type ?? null,
			context: input.context ?? null,
			modifiers: input.modifiers ?? null,
			...(visibility === "dm_only" ? { visibility } : {}),
		});
		if (error) throw error;
	} catch (error) {
		logger.warn("Campaign roll feed publish failed; keeping local copy", {
			error,
		});
		appendLocalCampaignRollEvent(localEvent());
	}
}
