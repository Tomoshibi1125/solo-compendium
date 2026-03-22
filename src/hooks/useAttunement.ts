/**
 * Attunement Slot Management Hook
 *
 * D&D Beyond parity:
 *  - Maximum 3 attuned items (SRD 5e standard)
 *  - Validates attunement requirements before attuning
 *  - Emits item:attune domain events
 *  - Persists attunement state to Supabase
 */

import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
	buildCorePayload,
	DomainEventBus,
	type ItemAttuneEvent,
} from "@/lib/domainEvents";
import { isLocalCharacterId } from "@/lib/guestStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export const MAX_ATTUNEMENT_SLOTS = 6;

export interface AttunableItem {
	id: string;
	name: string;
	requiresAttunement: boolean;
	attunementRequirements?: string | null;
	isAttuned: boolean;
}

export interface AttuneResult {
	success: boolean;
	message: string;
	attunedCount: number;
}

export interface UseAttunementReturn {
	/** Currently attuned items */
	attunedItems: AttunableItem[];
	/** Number of attuned items */
	attunedCount: number;
	/** Slots remaining */
	slotsRemaining: number;
	/** Can attune another item? */
	canAttune: boolean;
	/** Attune an item */
	attune: (item: AttunableItem) => AttuneResult;
	/** Unattune an item */
	unattune: (itemId: string) => AttuneResult;
	/** Check if a specific item can be attuned */
	canAttuneItem: (item: AttunableItem) => { allowed: boolean; reason: string };
	/** Persist to Supabase */
	persist: (
		characterId: string,
		characterName: string,
		jobName: string | null,
		level: number,
		campaignId: string | null,
	) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAttunement(
	initialItems: AttunableItem[] = [],
): UseAttunementReturn {
	const [items, setItems] = useState<AttunableItem[]>(initialItems);

	const attunedItems = useMemo(() => items.filter((i) => i.isAttuned), [items]);
	const attunedCount = attunedItems.length;
	const slotsRemaining = MAX_ATTUNEMENT_SLOTS - attunedCount;
	const canAttune = slotsRemaining > 0;

	const canAttuneItem = useCallback(
		(item: AttunableItem): { allowed: boolean; reason: string } => {
			if (!item.requiresAttunement) {
				return {
					allowed: false,
					reason: `${item.name} does not require attunement.`,
				};
			}
			if (item.isAttuned) {
				return { allowed: false, reason: `${item.name} is already attuned.` };
			}
			if (attunedCount >= MAX_ATTUNEMENT_SLOTS) {
				return {
					allowed: false,
					reason: `Attunement limit reached (${MAX_ATTUNEMENT_SLOTS}/${MAX_ATTUNEMENT_SLOTS}).`,
				};
			}
			return { allowed: true, reason: `Can attune ${item.name}.` };
		},
		[attunedCount],
	);

	const attune = useCallback(
		(item: AttunableItem): AttuneResult => {
			const check = canAttuneItem(item);
			if (!check.allowed) {
				return { success: false, message: check.reason, attunedCount };
			}

			setItems((prev) =>
				prev.map((i) => (i.id === item.id ? { ...i, isAttuned: true } : i)),
			);

			return {
				success: true,
				message: `Attuned to ${item.name}.`,
				attunedCount: attunedCount + 1,
			};
		},
		[canAttuneItem, attunedCount],
	);

	const unattune = useCallback(
		(itemId: string): AttuneResult => {
			const item = items.find((i) => i.id === itemId);
			if (!item) {
				return { success: false, message: "Item not found.", attunedCount };
			}
			if (!item.isAttuned) {
				return {
					success: false,
					message: `${item.name} is not attuned.`,
					attunedCount,
				};
			}

			setItems((prev) =>
				prev.map((i) => (i.id === itemId ? { ...i, isAttuned: false } : i)),
			);

			return {
				success: true,
				message: `Unattuned from ${item.name}.`,
				attunedCount: attunedCount - 1,
			};
		},
		[items, attunedCount],
	);

	const persist = useCallback(
		async (
			characterId: string,
			characterName: string,
			jobName: string | null,
			level: number,
			campaignId: string | null,
		) => {
			if (isLocalCharacterId(characterId)) return;

			for (const item of items) {
				try {
					await supabase
						.from("character_equipment")
						.update({ is_attuned: item.isAttuned })
						.eq("character_id", characterId)
						.eq("name", item.name);
				} catch {
					// Best-effort
				}
			}

			// Emit domain event for the last attunement change
			try {
				const lastAttuned = attunedItems[attunedItems.length - 1];
				if (lastAttuned) {
					const event: ItemAttuneEvent = {
						...buildCorePayload({
							characterId,
							characterName,
							className: jobName,
							level,
							campaignId,
						}),
						type: "item:attune",
						itemId: lastAttuned.id,
						itemName: lastAttuned.name,
						action: "attune",
						currentAttunementCount: attunedCount,
						maxAttunementSlots: MAX_ATTUNEMENT_SLOTS,
					};
					DomainEventBus.emit(event);
				}
			} catch {
				// Best-effort
			}
		},
		[items, attunedItems, attunedCount],
	);

	return {
		attunedItems,
		attunedCount,
		slotsRemaining,
		canAttune,
		attune,
		unattune,
		canAttuneItem,
		persist,
	};
}
