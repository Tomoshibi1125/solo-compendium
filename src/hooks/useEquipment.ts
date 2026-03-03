import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
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
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";

type Equipment = Database["public"]["Tables"]["character_equipment"]["Row"];
type EquipmentInsert =
	Database["public"]["Tables"]["character_equipment"]["Insert"];
type EquipmentUpdate =
	Database["public"]["Tables"]["character_equipment"]["Update"];

const buildEquipmentCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.equipment.${userId}.character:${characterId}.v1`;
};

const readCachedEquipment = (key: string): Equipment[] | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? (parsed as Equipment[]) : null;
	} catch {
		return null;
	}
};

const writeCachedEquipment = (key: string, equipment: Equipment[]) => {
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
				return listLocalEquipment(characterId) as Equipment[];
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

			const equipment = (data || []) as Equipment[];
			if (equipment.length === 0) {
				if (cacheKey) {
					writeCachedEquipment(cacheKey, equipment);
				}
				return equipment;
			}

			const uniqueNames = Array.from(
				new Set(equipment.map((item) => item.name).filter(Boolean)),
			);
			if (uniqueNames.length === 0) {
				return equipment;
			}

			const { data: compendiumEquipment, error: compendiumError } =
				await supabase
					.from("compendium_equipment")
					.select("name, source_book")
					.in("name", uniqueNames);

			if (compendiumError) {
				logErrorWithContext(
					compendiumError,
					"useEquipment (compendium source lookup)",
				);
				if (cacheKey) {
					writeCachedEquipment(cacheKey, equipment);
				}
				return equipment;
			}

			const sourceBookByName = new Map<string, string | null>();
			(compendiumEquipment || []).forEach((entry) => {
				sourceBookByName.set(entry.name, entry.source_book ?? null);
			});

			if (sourceBookByName.size === 0) {
				if (cacheKey) {
					writeCachedEquipment(cacheKey, equipment);
				}
				return equipment;
			}

			const campaignId = await getCharacterCampaignId(characterId);
			const accessibleCompendiumEquipment = await filterRowsBySourcebookAccess(
				(compendiumEquipment || []) as Array<{
					name: string;
					source_book: string | null;
				}>,
				(entry) => entry.source_book,
				{ campaignId },
			);
			const accessibleNames = new Set(
				accessibleCompendiumEquipment.map((entry) => entry.name),
			);

			const filtered = equipment.filter((item) => {
				if (!sourceBookByName.has(item.name)) {
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
		mutationFn: async (item: EquipmentInsert) => {
			if (isLocalCharacterId(characterId)) {
				addLocalEquipment(
					characterId,
					item as unknown as Omit<EquipmentInsert, "character_id">,
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
					const optimistic: Equipment = {
						id: `optimistic_${Date.now()}`,
						character_id: characterId,
						created_at: now,
						display_order: cached.length,
						name: item.name,
						item_type: item.item_type,
						quantity: item.quantity ?? 1,
						is_equipped: item.is_equipped ?? false,
						is_attuned: item.is_attuned ?? false,
						requires_attunement: item.requires_attunement ?? false,
						description: item.description ?? null,
						properties: item.properties ?? null,
						weight: item.weight ?? null,
						value_credits: item.value_credits ?? null,
						rarity: item.rarity ?? null,
						relic_tier: item.relic_tier ?? null,
						charges_current: item.charges_current ?? null,
						charges_max: item.charges_max ?? null,
						container_id: item.container_id ?? null,
						is_container: item.is_container ?? false,
						capacity_weight: item.capacity_weight ?? null,
						capacity_volume: item.capacity_volume ?? null,
						is_active: item.is_active ?? true,
						ignore_contents_weight: item.ignore_contents_weight ?? false,
						custom_modifiers: item.custom_modifiers ?? null,
					};
					writeCachedEquipment(cacheKey, [...cached, optimistic]);
				}
			}

			const campaignId = await getCharacterCampaignId(characterId);
			const { data: compendiumEquipment, error: compendiumError } =
				await supabase
					.from("compendium_equipment")
					.select("source_book")
					.eq("name", item.name)
					.limit(1)
					.maybeSingle();

			if (compendiumError) {
				logErrorWithContext(
					compendiumError,
					"useEquipment.addEquipment (compendium source lookup)",
				);
			}

			if (
				compendiumEquipment &&
				!(await isSourcebookAccessible(compendiumEquipment.source_book, {
					campaignId,
				}))
			) {
				throw new Error("This equipment requires sourcebook access.");
			}

			const { data, error } = await supabase
				.from("character_equipment")
				.insert({ ...item, character_id: characterId });
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
			updates: EquipmentUpdate;
		}) => {
			if (isLocalCharacterId(characterId)) {
				updateLocalEquipment(id, updates);
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
					writeCachedEquipment(
						cacheKey,
						cached.map((row) =>
							row.id === id ? ({ ...row, ...updates } as Equipment) : row,
						),
					);
				}
			}

			const { data, error } = await supabase
				.from("character_equipment")
				.update(updates)
				.eq("id", id);
			if (error) {
				logErrorWithContext(error, "useEquipment.updateEquipment");
				throw error;
			}
			return data;
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

	// Check attunement limit (max 3)
	const attunedCount = equipment.filter((e) => e.is_attuned).length;
	const canAttune = attunedCount < 3;

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
