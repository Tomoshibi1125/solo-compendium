import { get, set } from "idb-keyval";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { resolveCharacterCanonicalIds } from "@/lib/canonicalCompendium";
import { normalizeCharacterOverlayFields } from "@/lib/characterOverlayValidation";
import { logger } from "@/lib/logger";

export type SyncItemType =
	| "character"
	| "campaign"
	| "roll"
	| "message"
	| "homebrew"
	| "marketplace"
	| "campaign_session"
	| "campaign_combat";
export type SyncAction = "create" | "update" | "delete";

export interface SyncItem {
	id: string;
	type: SyncItemType;
	action: SyncAction;
	data: Record<string, unknown>;
	timestamp: number;
	retryCount: number;
}

const QUEUE_KEY = "solo-compendium-unified-sync-queue";

const TYPE_PRIORITY: Record<SyncItemType, number> = {
	character: 0,
	campaign: 0,
	homebrew: 1,
	campaign_session: 1,
	campaign_combat: 1,
	roll: 2,
	message: 2,
	marketplace: 2,
};

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const requireUserId = async (): Promise<string> => {
	const { data } = await supabase.auth.getUser();
	if (!data.user) throw new Error("AUTH_REQUIRED");
	return data.user.id;
};

export const getSyncQueue = async (): Promise<SyncItem[]> => {
	try {
		const queue = await get(QUEUE_KEY);
		return Array.isArray(queue) ? queue : [];
	} catch (err) {
		logger.error("Failed to read sync queue", err);
		return [];
	}
};

const saveSyncQueue = async (queue: SyncItem[]) => {
	try {
		await set(QUEUE_KEY, queue);
	} catch (err) {
		logger.error("Failed to write sync queue", err);
	}
};

export const enqueueSyncItem = async (
	type: SyncItemType,
	action: SyncAction,
	data: Record<string, unknown>,
) => {
	const queue = await getSyncQueue();
	queue.push({
		id: `${type}_${action}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		type,
		action,
		data,
		timestamp: Date.now(),
		retryCount: 0,
	});
	await saveSyncQueue(queue);
	logger.log(`Item enqueued for offline sync: ${type} ${action}`);
};

const processItem = async (item: SyncItem) => {
	const { type, action, data } = item;

	switch (type) {
		case "character":
			if (action === "create") {
				const resolved = await normalizeCharacterOverlayFields(
					await resolveCharacterCanonicalIds(
						data as Database["public"]["Tables"]["characters"]["Insert"],
					),
				);
				const { error } = await supabase.from("characters").insert([resolved]);
				if (error) throw error;
			} else if (action === "update") {
				// Ownership defense-in-depth (beyond RLS): scope to the current
				// user and strip fields the client must never overwrite.
				const userId = await requireUserId();
				const {
					id,
					user_id: _userId,
					created_at: _createdAt,
					...updateData
				} = data;
				const resolved = await normalizeCharacterOverlayFields(
					await resolveCharacterCanonicalIds(
						updateData as Database["public"]["Tables"]["characters"]["Update"],
					),
				);
				const { error } = await supabase
					.from("characters")
					.update({
						...(resolved as Database["public"]["Tables"]["characters"]["Update"]),
						updated_at: new Date().toISOString(),
					})
					.eq("id", id as string)
					.eq("user_id", userId);
				if (error) throw error;
			} else if (action === "delete") {
				const { error } = await supabase
					.from("characters")
					.delete()
					.eq("id", data.id as string);
				if (error) throw error;
			}
			break;

		case "campaign":
			if (action === "create") {
				const { error } = await supabase
					.from("campaigns")
					.insert([
						data as Database["public"]["Tables"]["campaigns"]["Insert"],
					]);
				if (error) throw error;
			} else if (action === "update") {
				const { id, ...updateData } = data;
				const { error } = await supabase
					.from("campaigns")
					.update(
						updateData as Database["public"]["Tables"]["campaigns"]["Update"],
					)
					.eq("id", id as string);
				if (error) throw error;
			} else if (action === "delete") {
				const { error } = await supabase
					.from("campaigns")
					.delete()
					.eq("id", data.id as string);
				if (error) throw error;
			}
			break;

		case "roll":
			if (action === "create") {
				const rollData =
					data as Database["public"]["Tables"]["roll_history"]["Insert"];
				const { error: rollError } = await supabase
					.from("roll_history")
					.insert(rollData);
				if (rollError) throw rollError;

				await supabase.from("campaign_messages").insert({
					campaign_id: rollData.campaign_id ?? "",
					user_id: rollData.user_id ?? "",
					message_type: "roll",
					content: `${rollData.context || "Roll"}: ${rollData.dice_formula} = ${rollData.result}`,
					metadata: { roll_data: rollData } as Json,
				});
			} else if (action === "delete") {
				const { error } = await supabase
					.from("roll_history")
					.delete()
					.eq("id", data.id as string);
				if (error) throw error;
			}
			break;

		case "message":
			if (action === "create") {
				const { error } = await supabase
					.from("campaign_messages")
					.insert([
						data as Database["public"]["Tables"]["campaign_messages"]["Insert"],
					]);
				if (error) throw error;
			}
			break;

		case "homebrew":
			if (action === "create") {
				// Server generates the id — a locally-minted one would collide.
				const { id: _localId, ...payload } = data;
				const { error } = await supabase
					.from("homebrew_content")
					.insert([
						payload as Database["public"]["Tables"]["homebrew_content"]["Insert"],
					]);
				if (error) throw error;
			} else if (action === "update") {
				const id = typeof data.id === "string" ? data.id : null;
				if (!id) throw new Error("HOMEBREW_ID_REQUIRED");

				// Status flips route through the guarded RPC (visibility rules).
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
					break;
				}

				const { id: _remId, ...updateData } = data;
				const { error } = await supabase
					.from("homebrew_content")
					.update(
						updateData as Database["public"]["Tables"]["homebrew_content"]["Update"],
					)
					.eq("id", id);
				if (error) throw error;
			} else if (action === "delete") {
				const { error } = await supabase
					.from("homebrew_content")
					.delete()
					.eq("id", data.id as string);
				if (error) throw error;
			}
			break;

		case "marketplace":
			if (action === "create") {
				const { id: _localId, ...payload } = data;
				const { error } = await supabase
					.from("marketplace_items")
					.insert([
						payload as Database["public"]["Tables"]["marketplace_items"]["Insert"],
					]);
				if (error) throw error;
			} else if (action === "update") {
				const mode = typeof data.mode === "string" ? data.mode : null;

				if (mode === "download" || mode === "review") {
					const userId = await requireUserId();
					const itemId = typeof data.item_id === "string" ? data.item_id : null;
					if (!itemId) throw new Error("MARKETPLACE_ITEM_REQUIRED");

					if (mode === "download") {
						const { error } = await supabase.rpc(
							"record_marketplace_download",
							{
								p_item_id: itemId,
								p_user_id: userId,
							},
						);
						if (error) throw error;
						break;
					}

					const ratingValue = Number(data.rating ?? 5);
					const { error } = await supabase.rpc("upsert_marketplace_review", {
						p_item_id: itemId,
						p_rating: Number.isFinite(ratingValue) ? ratingValue : 5,
						p_comment:
							typeof data.comment === "string" ? data.comment : undefined,
						p_user_id: userId,
					});
					if (error) throw error;
					break;
				}

				const id = typeof data.id === "string" ? data.id : null;
				if (!id) throw new Error("MARKETPLACE_ID_REQUIRED");
				const { id: _remId, ...updateData } = data;
				const { error } = await supabase
					.from("marketplace_items")
					.update(
						updateData as Database["public"]["Tables"]["marketplace_items"]["Update"],
					)
					.eq("id", id);
				if (error) throw error;
			} else if (action === "delete") {
				const { error } = await supabase
					.from("marketplace_items")
					.delete()
					.eq("id", data.id as string);
				if (error) throw error;
			}
			break;

		case "campaign_session":
			if (action === "create" || action === "update") {
				const mode = typeof data.mode === "string" ? data.mode : "session";
				if (mode === "log") {
					const { error } = await supabase.rpc("add_campaign_session_log", {
						p_campaign_id: String(data.campaign_id ?? ""),
						p_session_id:
							typeof data.session_id === "string" ? data.session_id : undefined,
						p_log_type:
							(data.log_type as "session" | "combat" | "milestone") ??
							"session",
						p_title: String(data.title ?? ""),
						p_content: String(data.content ?? ""),
						p_metadata: (data.metadata as Record<string, Json>) ?? {},
						p_is_player_visible: Boolean(data.is_player_visible ?? true),
					});
					if (error) throw error;
					break;
				}

				const { error } = await supabase.rpc("upsert_campaign_session", {
					p_campaign_id: String(data.campaign_id ?? ""),
					p_session_id:
						typeof data.session_id === "string" &&
						UUID_PATTERN.test(data.session_id)
							? data.session_id
							: undefined,
					p_title: typeof data.title === "string" ? data.title : undefined,
					p_description:
						typeof data.description === "string" ? data.description : undefined,
					p_scheduled_for:
						typeof data.scheduled_for === "string"
							? data.scheduled_for
							: undefined,
					p_status:
						(data.status as
							| "scheduled"
							| "active"
							| "completed"
							| "cancelled"
							| undefined) ?? undefined,
					p_location:
						typeof data.location === "string" ? data.location : undefined,
				});
				if (error) throw error;
			} else if (action === "delete") {
				const mode = typeof data.mode === "string" ? data.mode : "session";
				if (mode !== "session") break;
				const sessionId =
					typeof data.session_id === "string" ? data.session_id : null;
				if (!sessionId) throw new Error("SESSION_ID_REQUIRED");
				const { error } = await supabase
					.from("campaign_sessions")
					.delete()
					.eq("id", sessionId);
				if (error) throw error;
			}
			break;

		case "campaign_combat":
			await processCampaignCombat(data);
			break;

		default:
			throw new Error(`Unsupported sync type: ${type}`);
	}
};

/**
 * Offline combat sync — "session" mode patches the combat session row,
 * "combatants" mode replaces the session's combatant set wholesale (the
 * offline client owns the authoritative snapshot it queued).
 */
const processCampaignCombat = async (data: Record<string, unknown>) => {
	const mode = typeof data.mode === "string" ? data.mode : "session";
	const campaignId =
		typeof data.campaign_id === "string" ? data.campaign_id : null;
	const sessionId =
		typeof data.session_id === "string" ? data.session_id : null;
	if (!sessionId) throw new Error("COMBAT_SESSION_ID_REQUIRED");

	if (mode === "session") {
		const updates =
			typeof data.updates === "object" && data.updates !== null
				? (data.updates as Record<string, unknown>)
				: {};

		const payload: Record<string, Json> = {};
		if (typeof updates.status === "string") payload.status = updates.status;
		if (typeof updates.round === "number" && Number.isFinite(updates.round)) {
			payload.round = updates.round;
		}
		if (
			typeof updates.current_turn === "number" &&
			Number.isFinite(updates.current_turn)
		) {
			payload.current_turn = updates.current_turn;
		}
		if (Object.keys(payload).length === 0) return;

		let query = supabase
			.from("campaign_combat_sessions")
			.update(
				payload as Database["public"]["Tables"]["campaign_combat_sessions"]["Update"],
			)
			.eq("id", sessionId);
		if (campaignId) query = query.eq("campaign_id", campaignId);

		const { error } = await query;
		if (error) throw error;
		return;
	}

	if (mode === "combatants") {
		if (!campaignId) throw new Error("CAMPAIGN_ID_REQUIRED");

		const rawCombatants = Array.isArray(data.combatants) ? data.combatants : [];
		const payload = rawCombatants
			.map((entry, index) => {
				if (typeof entry !== "object" || entry === null) return null;
				const combatant = entry as Record<string, unknown>;
				const initiativeValue = Number(combatant.initiative ?? 0);
				return {
					id:
						typeof combatant.id === "string"
							? combatant.id
							: `offline-${sessionId}-${index}`,
					campaign_id: campaignId,
					session_id: sessionId,
					name:
						typeof combatant.name === "string"
							? combatant.name
							: `Combatant ${index + 1}`,
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
		if (clearError) throw clearError;

		if (payload.length === 0) return;

		const { error } = await supabase
			.from("campaign_combatants")
			.upsert(payload, { onConflict: "id" });
		if (error) throw error;
		return;
	}

	throw new Error("UNSUPPORTED_CAMPAIGN_COMBAT_MODE");
};

export interface FlushResult {
	/** Items that synced successfully and were removed from the queue. */
	success: number;
	/** Items that failed this pass (still queued for retry, or dropped after 3 tries). */
	failed: number;
	/** Items left in the queue after this pass. */
	remaining: number;
}

export const flushSyncQueue = async (): Promise<FlushResult> => {
	const empty: FlushResult = { success: 0, failed: 0, remaining: 0 };
	if (typeof navigator !== "undefined" && !navigator.onLine) return empty;
	if (!isSupabaseConfigured) return empty;

	const queue = await getSyncQueue();
	if (queue.length === 0) return empty;

	// Sort by priority EXPLICITLY before timestamp
	const sortedQueue = queue.sort((a, b) => {
		const priorityA = TYPE_PRIORITY[a.type];
		const priorityB = TYPE_PRIORITY[b.type];
		if (priorityA !== priorityB) return priorityA - priorityB;
		return a.timestamp - b.timestamp;
	});

	const remainingQueue: SyncItem[] = [];
	let successCount = 0;
	let failedCount = 0;

	for (const item of sortedQueue) {
		try {
			await processItem(item);
			successCount++;
		} catch (err) {
			logger.error(`Sync failed for ${item.type} ${item.id}`, err);
			failedCount++;
			const failedItem = { ...item, retryCount: item.retryCount + 1 };
			if (failedItem.retryCount < 3) {
				remainingQueue.push(failedItem);
			}
		}
	}

	await saveSyncQueue(remainingQueue);
	if (successCount > 0) {
		logger.log(`Successfully synced ${successCount} items from unified queue`);
	}

	return {
		success: successCount,
		failed: failedCount,
		remaining: remainingQueue.length,
	};
};
