import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
	canAttuneItem as canAttuneItemRules,
	canUnattuneItem as canUnattuneItemRules,
	MAX_ATTUNEMENT_SLOTS,
} from "@/lib/attunementRules";
import {
	isCanonicalEntryAccessible,
	listCanonicalEntries,
	resolveCanonicalReference,
} from "@/lib/canonicalCompendium";
import {
	buildCorePayload,
	DomainEventBus,
	type ItemAttuneEvent,
} from "@/lib/domainEvents";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import {
	addLocalEquipment,
	isLocalCharacterId,
	listLocalEquipment,
	removeLocalEquipment,
	updateLocalEquipment,
} from "@/lib/guestStore";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
} from "@/lib/sourcebookAccess";

export type EquipmentRow =
	Database["public"]["Tables"]["character_equipment"]["Row"];
type EquipmentRowInsert =
	Database["public"]["Tables"]["character_equipment"]["Insert"];
type EquipmentRowUpdate =
	Database["public"]["Tables"]["character_equipment"]["Update"];

const buildEquipmentCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.equipment.${userId}.character:${characterId}.v1`;
};

const readCachedEquipment = (key: string): EquipmentRow[] | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as EquipmentRow[]) : null;
	} catch {
		return null;
	}
};

const writeCachedEquipment = (key: string, equipment: EquipmentRow[]) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(equipment));
	} catch {
		// ignore
	}
};

export const useEquipment = (characterId: string) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: equipment = [], isLoading } = useQuery({
		queryKey: ["equipment", characterId],
		queryFn: async () => {
			if (isLocalCharacterId(characterId)) {
				return listLocalEquipment(characterId) as EquipmentRow[];
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildEquipmentCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_equipment")
				.select("*")
				.eq("character_id", characterId)
				.order("display_order", { ascending: true })
				.order("item_type", { ascending: true })
				.order("name", { ascending: true });

			if (error) {
				logErrorWithContext(error, "useEquipment");
				if (cacheKey) {
					const cached = readCachedEquipment(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}

			const equipment = (data || []) as EquipmentRow[];
			if (equipment.length === 0) {
				if (cacheKey) {
					writeCachedEquipment(cacheKey, equipment);
				}
				return equipment;
			}

			const uniqueNames = new Set(
				equipment.map((item) => item.name).filter(Boolean),
			);
			const uniqueItemIds = new Set(
				equipment
					.map((item) => item.item_id)
					.filter((id): id is string => Boolean(id)),
			);
			if (uniqueNames.size === 0 && uniqueItemIds.size === 0) {
				return equipment;
			}

			const campaignId = await getCharacterCampaignId(characterId);
			const allCanonicalEquipment = await listCanonicalEntries("equipment");
			const accessibleCanonicalEquipment = await filterRowsBySourcebookAccess(
				allCanonicalEquipment,
				(entry) => entry.source_book,
				{ campaignId },
			);

			const allById = new Map<string, string | null>();
			const allByName = new Map<string, string | null>();
			for (const entry of allCanonicalEquipment) {
				if (uniqueItemIds.has(entry.id)) {
					allById.set(entry.id, entry.source_book ?? null);
				}
				if (uniqueNames.has(entry.name)) {
					allByName.set(entry.name, entry.source_book ?? null);
				}
			}

			if (allByName.size === 0 && allById.size === 0) {
				if (cacheKey) {
					writeCachedEquipment(cacheKey, equipment);
				}
				return equipment;
			}

			const accessibleIds = new Set(
				accessibleCanonicalEquipment.map((entry) => entry.id),
			);
			const accessibleNames = new Set(
				accessibleCanonicalEquipment.map((entry) => entry.name),
			);

			const filtered = equipment.filter((item) => {
				const hasCanonicalById = !!item.item_id && allById.has(item.item_id);
				const hasCanonicalByName = allByName.has(item.name);
				if (!hasCanonicalById && !hasCanonicalByName) {
					return true;
				}

				if (item.item_id && accessibleIds.has(item.item_id)) {
					return true;
				}
				return accessibleNames.has(item.name);
			});

			if (cacheKey) {
				writeCachedEquipment(cacheKey, filtered);
			}

			return filtered;
		},
		enabled: !!characterId,
	});

	const addEquipment = useMutation({
		mutationFn: async (item: EquipmentRowInsert) => {
			const canonicalResolution = await resolveCanonicalReference("equipment", {
				id: item.item_id,
				name: item.name,
			});
			const canonicalEntry = canonicalResolution.entry;
			const itemWithCanonicalId: EquipmentRowInsert = {
				...item,
				item_id: canonicalEntry?.id ?? item.item_id ?? null,
			};

			if (isLocalCharacterId(characterId)) {
				addLocalEquipment(
					characterId,
					itemWithCanonicalId as Omit<EquipmentRowInsert, "character_id">,
				);
				return null;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildEquipmentCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedEquipment(cacheKey);
				if (cached) {
					const now = new Date().toISOString();
					const optimistic: EquipmentRow = {
						id: `optimistic_${Date.now()}`,
						character_id: characterId,
						created_at: now,
						display_order: cached.length,
						name: itemWithCanonicalId.name,
						item_id: itemWithCanonicalId.item_id ?? null,
						item_type: itemWithCanonicalId.item_type,
						quantity: itemWithCanonicalId.quantity ?? 1,
						is_equipped: itemWithCanonicalId.is_equipped ?? false,
						is_attuned: itemWithCanonicalId.is_attuned ?? false,
						requires_attunement:
							itemWithCanonicalId.requires_attunement ?? false,
						description: itemWithCanonicalId.description ?? null,
						properties: itemWithCanonicalId.properties ?? null,
						weight: itemWithCanonicalId.weight ?? null,
						value_credits: itemWithCanonicalId.value_credits ?? null,
						rarity: itemWithCanonicalId.rarity ?? null,
						relic_tier: itemWithCanonicalId.relic_tier ?? null,
						charges_current: itemWithCanonicalId.charges_current ?? null,
						charges_max: itemWithCanonicalId.charges_max ?? null,
						container_id: itemWithCanonicalId.container_id ?? null,
						sigil_slots_base: itemWithCanonicalId.sigil_slots_base ?? 0,
						is_container: itemWithCanonicalId.is_container ?? false,
						capacity_weight: itemWithCanonicalId.capacity_weight ?? null,
						capacity_volume: itemWithCanonicalId.capacity_volume ?? null,
						is_active: itemWithCanonicalId.is_active ?? true,
						ignore_contents_weight:
							itemWithCanonicalId.ignore_contents_weight ?? false,
						custom_modifiers: itemWithCanonicalId.custom_modifiers ?? null,
					};
					writeCachedEquipment(cacheKey, [...cached, optimistic]);
				}
			}

			const campaignId = await getCharacterCampaignId(characterId);

			if (
				itemWithCanonicalId.item_id &&
				!(await isCanonicalEntryAccessible(
					"equipment",
					itemWithCanonicalId.item_id,
					{
						campaignId,
					},
				))
			) {
				throw new Error("This equipment requires sourcebook access.");
			}

			const { data, error } = await supabase
				.from("character_equipment")
				.insert({ ...itemWithCanonicalId, character_id: characterId });
			if (error) {
				logErrorWithContext(error, "useEquipment.addEquipment");
				throw error;
			}
			return data;
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["equipment", characterId] });
			// D&D Beyond parity: auto-recalculate AC/speed when equipment is added
			if (!isLocalCharacterId(characterId)) {
				queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			}
		},
		onError: (error) => {
			logErrorWithContext(error, "useEquipment.addEquipment");
			toast({
				title: "Failed to add equipment",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const updateEquipment = useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: EquipmentRowUpdate;
		}) => {
			// D&D Beyond parity: validate attunement transitions before they hit
			// the DB. Catches both "exceeded slot cap" and "item doesn't require
			// attunement" — and lets us emit the item:attune domain event with
			// accurate before/after slot counts.
			const beforeRow = equipment.find((row) => row.id === id);
			const isAttuneFlip =
				beforeRow !== undefined &&
				typeof updates.is_attuned === "boolean" &&
				updates.is_attuned !== beforeRow.is_attuned;
			if (isAttuneFlip && beforeRow) {
				const itemRef = {
					id: beforeRow.id,
					name: beforeRow.name,
					requiresAttunement: beforeRow.requires_attunement === true,
					isAttuned: beforeRow.is_attuned === true,
				};
				const validation = updates.is_attuned
					? canAttuneItemRules(itemRef, attunedCount)
					: canUnattuneItemRules(itemRef);
				if (!validation.allowed) {
					throw new Error(validation.reason);
				}
			}

			if (isLocalCharacterId(characterId)) {
				updateLocalEquipment(id, updates);
			} else {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				const cacheKey = user?.id
					? buildEquipmentCacheKey(user.id, characterId)
					: null;
				if (cacheKey) {
					const cached = readCachedEquipment(cacheKey);
					if (cached) {
						writeCachedEquipment(
							cacheKey,
							cached.map((row) =>
								row.id === id ? ({ ...row, ...updates } as EquipmentRow) : row,
							),
						);
					}
				}

				const { error } = await supabase
					.from("character_equipment")
					.update(updates)
					.eq("id", id);
				if (error) {
					logErrorWithContext(error, "useEquipment.updateEquipment");
					throw error;
				}
			}

			// Best-effort domain event for attunement transitions. Listeners
			// (analytics, derived stats invalidation, etc.) react to this.
			if (isAttuneFlip && beforeRow) {
				try {
					const nextAttunedCount = updates.is_attuned
						? attunedCount + 1
						: attunedCount - 1;
					const event: ItemAttuneEvent = {
						...buildCorePayload({
							characterId,
							characterName: beforeRow.name,
							className: null,
							level: 0,
							campaignId: null,
						}),
						type: "item:attune",
						itemId: beforeRow.id,
						itemName: beforeRow.name,
						action: updates.is_attuned ? "attune" : "unattune",
						currentAttunementCount: nextAttunedCount,
						maxAttunementSlots: MAX_ATTUNEMENT_SLOTS,
					};
					DomainEventBus.emit(event);
				} catch {
					// Best-effort
				}
			}
			return null;
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["equipment", characterId] });
			queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			// D&D Beyond parity: auto-recalculate AC/speed when equipment changes
			if (!isLocalCharacterId(characterId)) {
				queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			}
		},
		onError: (error) => {
			logErrorWithContext(error, "useEquipment.updateEquipment");
			toast({
				title: "Failed to update equipment",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const removeEquipment = useMutation({
		mutationFn: async (id: string) => {
			if (isLocalCharacterId(characterId)) {
				removeLocalEquipment(id);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildEquipmentCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedEquipment(cacheKey);
				if (cached) {
					writeCachedEquipment(
						cacheKey,
						cached.filter((row) => row.id !== id),
					);
				}
			}

			const { error } = await supabase
				.from("character_equipment")
				.delete()
				.eq("id", id);
			if (error) {
				logErrorWithContext(error, "useEquipment.removeEquipment");
				throw error;
			}
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["equipment", characterId] });
			queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			// D&D Beyond parity: auto-recalculate AC/speed when equipment is removed
			if (!isLocalCharacterId(characterId)) {
				queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			}
		},
		onError: (error) => {
			logErrorWithContext(error, "useEquipment.removeEquipment");
			toast({
				title: "Failed to remove equipment",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const reorderEquipment = useMutation({
		mutationFn: async (newOrder: { id: string; display_order: number }[]) => {
			if (isLocalCharacterId(characterId)) {
				for (const { id, display_order } of newOrder) {
					updateLocalEquipment(id, { display_order });
				}
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildEquipmentCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedEquipment(cacheKey);
				if (cached) {
					const next = cached
						.map((row) => {
							const nextOrder = newOrder.find((o) => o.id === row.id);
							return nextOrder
								? { ...row, display_order: nextOrder.display_order }
								: row;
						})
						.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
					writeCachedEquipment(cacheKey, next);
				}
			}

			// Batch update all items with their new order
			const updates = newOrder.map(({ id, display_order }) =>
				supabase
					.from("character_equipment")
					.update({ display_order })
					.eq("id", id),
			);

			const results = await Promise.all(updates);
			const errors = results.filter((r) => r.error).map((r) => r.error);

			if (errors.length > 0) {
				const error = errors[0];
				logErrorWithContext(error, "useEquipment.reorderEquipment");
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["equipment", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "useEquipment.reorderEquipment");
			toast({
				title: "Failed to reorder equipment",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	// Attunement limit comes from @/lib/attunementRules (single source of truth).
	const attunedCount = equipment.filter((e) => e.is_attuned).length;
	const canAttune = attunedCount < MAX_ATTUNEMENT_SLOTS;

	return {
		equipment,
		isLoading,
		addEquipment: addEquipment.mutateAsync,
		updateEquipment: updateEquipment.mutateAsync,
		removeEquipment: removeEquipment.mutateAsync,
		reorderEquipment: reorderEquipment.mutateAsync,
		attunedCount,
		canAttune,
	};
};
