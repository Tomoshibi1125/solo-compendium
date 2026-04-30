/**
 * Attunement Slot Management Hook
 *
 * Local stateful client of the shared attunement rules in
 * `@/lib/attunementRules`. Useful for staging an attunement workflow client-side
 * (e.g. a wizard, a simulation, or the Warden Directive Matrix) without hitting
 * the DB on every interaction.
 *
 * For the live character-sheet flow, prefer `useEquipment()` — it owns Supabase
 * persistence, optimistic cache updates, and emits the `item:attune` domain
 * event from the shared rules module. This hook intentionally mirrors that
 * validation logic so behavior stays identical.
 */

import { useCallback, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
	type AttunableItemRef,
	canAttuneItem as canAttuneItemRules,
	canUnattuneItem as canUnattuneItemRules,
	MAX_ATTUNEMENT_SLOTS,
} from "@/lib/attunementRules";
import {
	buildCorePayload,
	DomainEventBus,
	type ItemAttuneEvent,
} from "@/lib/domainEvents";
import { isLocalCharacterId } from "@/lib/guestStore";

// Re-export so existing consumers keep their import path stable.
export { MAX_ATTUNEMENT_SLOTS } from "@/lib/attunementRules";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AttunableItem extends AttunableItemRef {
	attunementRequirements?: string | null;
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
		(item: AttunableItem) => canAttuneItemRules(item, attunedCount),
		[attunedCount],
	);

	const attune = useCallback(
		(item: AttunableItem): AttuneResult => {
			const check = canAttuneItemRules(item, attunedCount);
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
		[attunedCount],
	);

	const unattune = useCallback(
		(itemId: string): AttuneResult => {
			const item = items.find((i) => i.id === itemId);
			if (!item) {
				return { success: false, message: "Item not found.", attunedCount };
			}
			const check = canUnattuneItemRules(item);
			if (!check.allowed) {
				return { success: false, message: check.reason, attunedCount };
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
