import { get, set } from "idb-keyval";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { logger } from "@/lib/logger";

export type SyncItemType =
	| "character"
	| "campaign"
	| "roll"
	| "message"
	| "homebrew"
	| "marketplace";
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
	roll: 2,
	message: 2,
	marketplace: 2,
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
				const { error } = await supabase
					.from("characters")
					.insert([
						data as Database["public"]["Tables"]["characters"]["Insert"],
					]);
				if (error) throw error;
			} else if (action === "update") {
				const { id, ...updateData } = data;
				const { error } = await supabase
					.from("characters")
					.update(
						updateData as Database["public"]["Tables"]["characters"]["Update"],
					)
					.eq("id", id as string);
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
				const { error } = await supabase
					.from("homebrew_content")
					.insert([
						data as Database["public"]["Tables"]["homebrew_content"]["Insert"],
					]);
				if (error) throw error;
			} else if (action === "update") {
				const { id, ...updateData } = data;
				const { error } = await supabase
					.from("homebrew_content")
					.update(
						updateData as Database["public"]["Tables"]["homebrew_content"]["Update"],
					)
					.eq("id", id as string);
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
				const { error } = await supabase
					.from("marketplace_items")
					.insert([
						data as Database["public"]["Tables"]["marketplace_items"]["Insert"],
					]);
				if (error) throw error;
			}
			break;

		default:
			throw new Error(`Unsupported sync type: ${type}`);
	}
};

export const flushSyncQueue = async () => {
	if (typeof navigator !== "undefined" && !navigator.onLine) return;
	if (!isSupabaseConfigured) return;

	const queue = await getSyncQueue();
	if (queue.length === 0) return;

	// Sort by priority EXPLICITLY before timestamp
	const sortedQueue = queue.sort((a, b) => {
		const priorityA = TYPE_PRIORITY[a.type];
		const priorityB = TYPE_PRIORITY[b.type];
		if (priorityA !== priorityB) return priorityA - priorityB;
		return a.timestamp - b.timestamp;
	});

	const remainingQueue: SyncItem[] = [];
	let successCount = 0;

	for (const item of sortedQueue) {
		try {
			await processItem(item);
			successCount++;
		} catch (err) {
			logger.error(`Sync failed for ${item.type} ${item.id}`, err);
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
};
