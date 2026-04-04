import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { logger } from "@/lib/logger";
import type { SyncQueueItem } from "@/lib/offlineStorage";
import {
	type OfflineSyncAction,
	type OfflineSyncType,
	registerOfflineSyncProcessor,
} from "@/lib/offlineSync";

// The generated client now supports these tables via types-extension.ts
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let initialized = false;

const ensureUserContext = async (): Promise<string> => {
	const { data } = await supabase.auth.getUser();
	if (!data.user) {
		throw new Error("AUTH_REQUIRED");
	}
	return data.user.id;
};

const handleHomebrewCreate = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const { id: _removedId, ...payload } = item.data as Record<string, Json>;

	const { error } = await supabase
		.from("homebrew_content")
		.insert(
			payload as Database["public"]["Tables"]["homebrew_content"]["Insert"],
		);

	if (error) throw error;
};

const handleCampaignCombatUpdate = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const data = item.data as Record<string, Json>;
	const mode = typeof data.mode === "string" ? data.mode : "session";
	const campaignId =
		typeof data.campaign_id === "string" ? data.campaign_id : null;
	const sessionId =
		typeof data.session_id === "string" ? data.session_id : null;

	if (!sessionId) {
		throw new Error("COMBAT_SESSION_ID_REQUIRED");
	}

	if (mode === "session") {
		const updates =
			typeof data.updates === "object" && data.updates !== null
				? (data.updates as Record<string, Json>)
				: {};

		const payload: Record<string, Json> = {};
		if (typeof updates.status === "string") {
			payload.status = updates.status;
		}
		const roundValue = updates.round;
		if (typeof roundValue === "number" && Number.isFinite(roundValue)) {
			payload.round = roundValue;
		}
		const turnValue = updates.current_turn;
		if (typeof turnValue === "number" && Number.isFinite(turnValue)) {
			payload.current_turn = turnValue;
		}

		if (Object.keys(payload).length === 0) {
			return;
		}

		let query = supabase
			.from("campaign_combat_sessions")
			.update(
				payload as Database["public"]["Tables"]["campaign_combat_sessions"]["Update"],
			)
			.eq("id", sessionId);

		if (campaignId) {
			query = query.eq("campaign_id", campaignId);
		}

		const { error } = await query;
		if (error) throw error;
		return;
	}

	if (mode === "combatants") {
		if (!campaignId) {
			throw new Error("CAMPAIGN_ID_REQUIRED");
		}

		const rawCombatants = Array.isArray(data.combatants) ? data.combatants : [];
		const payload = rawCombatants
			.map((entry, index) => {
				if (typeof entry !== "object" || entry === null) {
					return null;
				}

				const combatant = entry as Record<string, Json>;
				const combatantId =
					typeof combatant.id === "string" ? combatant.id : null;
				const name =
					typeof combatant.name === "string"
						? combatant.name
						: `Combatant ${index + 1}`;
				const initiativeValue = Number(combatant.initiative ?? 0);

				return {
					id: combatantId ?? `offline-${sessionId}-${index}`,
					campaign_id: campaignId,
					session_id: sessionId,
					name,
					initiative: Number.isFinite(initiativeValue) ? initiativeValue : 0,
					stats: (combatant.stats as Json) ?? {},
					conditions: (combatant.conditions as Json) ?? [],
					flags: (combatant.flags as Json) ?? {},
					member_id:
						typeof combatant.member_id === "string"
							? combatant.member_id
							: null,
				} as Database["public"]["Tables"]["campaign_combatants"]["Insert"];
			})
			.filter(
				(
					combatant,
				): combatant is Database["public"]["Tables"]["campaign_combatants"]["Insert"] =>
					combatant !== null,
			);

		const { error: clearError } = await supabase
			.from("campaign_combatants")
			.delete()
			.eq("campaign_id", campaignId)
			.eq("session_id", sessionId);

		if (clearError) {
			throw clearError;
		}

		if (payload.length === 0) {
			return;
		}

		const { error } = await supabase
			.from("campaign_combatants")
			.upsert(payload, { onConflict: "id" });

		if (error) throw error;
		return;
	}

	throw new Error("UNSUPPORTED_CAMPAIGN_COMBAT_MODE");
};

const handleHomebrewUpdate = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const data = item.data as Record<string, Json>;
	const id = typeof data.id === "string" ? data.id : null;
	if (!id) throw new Error("HOMEBREW_ID_REQUIRED");

	if (typeof data.status === "string") {
		const { error } = await supabase.rpc("set_homebrew_content_status", {
			p_homebrew_id: id,
			p_status: data.status,
			p_visibility_scope: String(data.visibility_scope ?? ""),
			p_campaign_id:
				typeof data.campaign_id === "string" &&
				UUID_PATTERN.test(data.campaign_id)
					? data.campaign_id
					: undefined,
		});
		if (error) throw error;
		return;
	}

	const { id: _remId, ...payload } = data;

	const { error } = await supabase
		.from("homebrew_content")
		.update(
			payload as Database["public"]["Tables"]["homebrew_content"]["Update"],
		)
		.eq("id", id);

	if (error) throw error;
};

const handleHomebrewDelete = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const data = item.data as Record<string, Json>;
	const id = typeof data.id === "string" ? data.id : null;
	if (!id) throw new Error("HOMEBREW_ID_REQUIRED");

	const { error } = await supabase
		.from("homebrew_content")
		.delete()
		.eq("id", id);

	if (error) throw error;
};

const handleMarketplaceCreate = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const { id: _remId, ...payload } = item.data as Record<string, Json>;

	const { error } = await supabase
		.from("marketplace_items")
		.insert(
			payload as Database["public"]["Tables"]["marketplace_items"]["Insert"],
		);

	if (error) throw error;
};

const handleMarketplaceUpdate = async (item: SyncQueueItem) => {
	const userId = await ensureUserContext();
	const data = item.data as Record<string, Json>;
	const mode = typeof data.mode === "string" ? data.mode : null;

	if (mode === "download") {
		const itemId = typeof data.item_id === "string" ? data.item_id : null;
		if (!itemId) throw new Error("MARKETPLACE_ITEM_REQUIRED");

		const { error } = await supabase.rpc("record_marketplace_download", {
			p_item_id: itemId,
			p_user_id: userId,
		});
		if (error) throw error;
		return;
	}

	if (mode === "review") {
		const itemId = typeof data.item_id === "string" ? data.item_id : null;
		if (!itemId) throw new Error("MARKETPLACE_ITEM_REQUIRED");

		const ratingValue = data.rating;
		const rating =
			typeof ratingValue === "number" ? ratingValue : Number(ratingValue || 0);
		const { error } = await supabase.rpc("upsert_marketplace_review", {
			p_item_id: itemId,
			p_rating: Number.isFinite(rating) ? rating : 5,
			p_comment: typeof data.comment === "string" ? data.comment : undefined,
			p_user_id: userId,
		});
		if (error) throw error;
		return;
	}

	const id = typeof data.id === "string" ? data.id : null;
	if (!id) throw new Error("MARKETPLACE_ID_REQUIRED");

	const { id: _remId, ...payload } = data;

	const { error } = await supabase
		.from("marketplace_items")
		.update(
			payload as Database["public"]["Tables"]["marketplace_items"]["Update"],
		)
		.eq("id", id);

	if (error) throw error;
};

const handleMarketplaceDelete = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const data = item.data as Record<string, Json>;
	const id = typeof data.id === "string" ? data.id : null;
	if (!id) throw new Error("MARKETPLACE_ID_REQUIRED");

	const { error } = await supabase
		.from("marketplace_items")
		.delete()
		.eq("id", id);

	if (error) throw error;
};

const handleCampaignSessionCreate = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const data = item.data as Record<string, Json>;
	const mode = typeof data.mode === "string" ? data.mode : "session";

	if (mode === "log") {
		const { error } = await supabase.rpc("add_campaign_session_log", {
			p_campaign_id: String(data.campaign_id ?? ""),
			p_session_id:
				typeof data.session_id === "string" ? data.session_id : undefined,
			p_log_type:
				(data.log_type as "session" | "combat" | "milestone") ?? "session",
			p_title: String(data.title ?? ""),
			p_content: String(data.content ?? ""),
			p_metadata: (data.metadata as Record<string, Json>) ?? {},
			p_is_player_visible: Boolean(data.is_player_visible ?? true),
		});
		if (error) throw error;
		return;
	}

	const { error } = await supabase.rpc("upsert_campaign_session", {
		p_campaign_id: String(data.campaign_id ?? ""),
		p_session_id:
			typeof data.session_id === "string" && UUID_PATTERN.test(data.session_id)
				? data.session_id
				: undefined,
		p_title: typeof data.title === "string" ? data.title : undefined,
		p_description:
			typeof data.description === "string" ? data.description : undefined,
		p_scheduled_for:
			typeof data.scheduled_for === "string" ? data.scheduled_for : undefined,
		p_status:
			(data.status as
				| "scheduled"
				| "active"
				| "completed"
				| "cancelled"
				| undefined) ?? undefined,
		p_location: typeof data.location === "string" ? data.location : undefined,
	});

	if (error) throw error;
};

const handleCampaignSessionUpdate = async (item: SyncQueueItem) => {
	await handleCampaignSessionCreate(item);
};

const handleCampaignSessionDelete = async (item: SyncQueueItem) => {
	await ensureUserContext();
	const data = item.data as Record<string, Json>;
	const mode = typeof data.mode === "string" ? data.mode : "session";
	if (mode !== "session") {
		return;
	}

	const sessionId =
		typeof data.session_id === "string" ? data.session_id : null;
	if (!sessionId) throw new Error("SESSION_ID_REQUIRED");

	const { error } = await supabase
		.from("campaign_sessions")
		.delete()
		.eq("id", sessionId);

	if (error) throw error;
};

const register = (
	type: OfflineSyncType,
	action: OfflineSyncAction,
	processor: (item: SyncQueueItem) => Promise<void>,
) => {
	registerOfflineSyncProcessor(type, action, async (item) => {
		try {
			await processor(item);
		} catch (error) {
			logger.warn(`[OfflineSync] Failed ${type}:${action}`, error);
			throw error;
		}
	});
};

export const ensureOfflineSyncProcessors = () => {
	if (initialized || !isSupabaseConfigured) {
		return;
	}

	register("homebrew", "create", handleHomebrewCreate);
	register("homebrew", "update", handleHomebrewUpdate);
	register("homebrew", "delete", handleHomebrewDelete);

	register("marketplace", "create", handleMarketplaceCreate);
	register("marketplace", "update", handleMarketplaceUpdate);
	register("marketplace", "delete", handleMarketplaceDelete);

	register("campaign_session", "create", handleCampaignSessionCreate);
	register("campaign_session", "update", handleCampaignSessionUpdate);
	register("campaign_session", "delete", handleCampaignSessionDelete);

	register("campaign_combat", "create", handleCampaignCombatUpdate);
	register("campaign_combat", "update", handleCampaignCombatUpdate);
	register("campaign_combat", "delete", handleCampaignCombatUpdate);

	initialized = true;
};
