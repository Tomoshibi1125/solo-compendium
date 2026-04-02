import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import {
	addLocalPower,
	isLocalCharacterId,
	listLocalPowers,
	removeLocalPower,
	updateLocalPower,
} from "@/lib/guestStore";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";

export type PowerRow = Database["public"]["Tables"]["character_powers"]["Row"];
export type CompendiumPower =
	Database["public"]["Tables"]["compendium_powers"]["Row"];

export interface CharacterPower extends PowerRow {
	power?: CompendiumPower;
}

export type Power = CharacterPower;
type PowerInsert = Database["public"]["Tables"]["character_powers"]["Insert"];
type PowerUpdate = Database["public"]["Tables"]["character_powers"]["Update"];

const buildPowersCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.powers.${userId}.character:${characterId}.v1`;
};

const readCachedPowers = (key: string): Power[] | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as Power[]) : null;
	} catch {
		return null;
	}
};

const writeCachedPowers = (key: string, powers: Power[]) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(powers));
	} catch {
		// ignore
	}
};

export const usePowers = (characterId: string) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: powers = [], isLoading } = useQuery({
		queryKey: ["powers", characterId],
		queryFn: async () => {
			if (isLocalCharacterId(characterId)) {
				return listLocalPowers(characterId) as Power[];
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildPowersCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_powers")
				.select("*")
				.eq("character_id", characterId)
				.order("display_order", { ascending: true })
				.order("power_level", { ascending: true })
				.order("name", { ascending: true });

			if (error) {
				logErrorWithContext(error, "usePowers");
				if (cacheKey) {
					const cached = readCachedPowers(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}

			const powers = (data || []) as Power[];
			if (powers.length === 0) {
				if (cacheKey) {
					writeCachedPowers(cacheKey, powers);
				}
				return powers;
			}

			const uniqueNames = Array.from(
				new Set(powers.map((power) => power.name).filter(Boolean)),
			);
			if (uniqueNames.length === 0) {
				return powers;
			}

			const { data: compendiumPowers, error: compendiumError } = await supabase
				.from("compendium_powers")
				.select("name, source_book")
				.in("name", uniqueNames);

			if (compendiumError) {
				logErrorWithContext(
					compendiumError,
					"usePowers (compendium source lookup)",
				);
				if (cacheKey) {
					writeCachedPowers(cacheKey, powers);
				}
				return powers;
			}

			const sourceBookByName = new Map<string, string | null>();
			(compendiumPowers || []).forEach((power) => {
				sourceBookByName.set(power.name, power.source_book ?? null);
			});

			if (sourceBookByName.size === 0) {
				if (cacheKey) {
					writeCachedPowers(cacheKey, powers);
				}
				return powers;
			}

			const campaignId = await getCharacterCampaignId(characterId);
			const accessibleCompendiumPowers = await filterRowsBySourcebookAccess(
				(compendiumPowers || []) as Array<{
					name: string;
					source_book: string | null;
				}>,
				(power) => power.source_book,
				{ campaignId },
			);
			const accessibleNames = new Set(
				accessibleCompendiumPowers.map((power) => power.name),
			);

			const filtered = powers
				.filter((power) => {
					if (!sourceBookByName.has(power.name)) {
						return true;
					}

					return accessibleNames.has(power.name);
				})
				.map((power) => ({
					...power,
					power: compendiumPowers?.find((cp) => cp.name === power.name),
				}));

			if (cacheKey) {
				writeCachedPowers(
					cacheKey,
					filtered.map(({ power, ...p }) => p as PowerRow),
				);
			}

			return filtered as CharacterPower[];
		},
		enabled: !!characterId,
	});

	const addPower = useMutation({
		mutationFn: async (power: PowerInsert) => {
			if (isLocalCharacterId(characterId)) {
				addLocalPower(characterId, power as Omit<PowerInsert, "character_id">);
				return null;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildPowersCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedPowers(cacheKey);
				if (cached) {
					const now = new Date().toISOString();
					const optimistic: Power = {
						id: `optimistic_${Date.now()}`,
						character_id: characterId,
						created_at: now,
						display_order: cached.length,
						name: power.name,
						power_level: power.power_level ?? 0,
						source: power.source ?? null,
						description: power.description ?? null,
						higher_levels: power.higher_levels ?? null,
						casting_time: power.casting_time ?? null,
						range: power.range ?? null,
						duration: power.duration ?? null,
						concentration: power.concentration ?? false,
						is_prepared: power.is_prepared ?? false,
						is_known: power.is_known ?? true,
					};
					writeCachedPowers(cacheKey, [...cached, optimistic]);
				}
			}

			const campaignId = await getCharacterCampaignId(characterId);
			const { data: compendiumPower, error: compendiumError } = await supabase
				.from("compendium_powers")
				.select("source_book")
				.eq("name", power.name)
				.limit(1)
				.maybeSingle();

			if (compendiumError) {
				logErrorWithContext(
					compendiumError,
					"usePowers.addPower (compendium source lookup)",
				);
			}

			if (
				compendiumPower &&
				!(await isSourcebookAccessible(compendiumPower.source_book, {
					campaignId,
				}))
			) {
				throw new Error("This power requires sourcebook access.");
			}

			const { data, error } = await supabase
				.from("character_powers")
				.insert({ ...power, character_id: characterId });
			if (error) {
				logErrorWithContext(error, "usePowers.addPower");
				throw error;
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["powers", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "usePowers.addPower");
			toast({
				title: "Failed to add power",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const updatePower = useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: PowerUpdate;
		}) => {
			if (isLocalCharacterId(characterId)) {
				updateLocalPower(id, updates);
				return null;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildPowersCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedPowers(cacheKey);
				if (cached) {
					writeCachedPowers(
						cacheKey,
						cached.map((row) =>
							row.id === id ? ({ ...row, ...updates } as Power) : row,
						),
					);
				}
			}

			if (Object.hasOwn(updates, "is_prepared")) {
				const campaignId = await getCharacterCampaignId(characterId);
				const { data: existingPower, error: existingPowerError } =
					await supabase
						.from("character_powers")
						.select("name")
						.eq("id", id)
						.maybeSingle();

				if (existingPowerError) {
					logErrorWithContext(
						existingPowerError,
						"usePowers.updatePower (power lookup)",
					);
				}

				if (existingPower?.name) {
					const { data: compendiumPower, error: compendiumError } =
						await supabase
							.from("compendium_powers")
							.select("source_book")
							.eq("name", existingPower.name)
							.limit(1)
							.maybeSingle();

					if (compendiumError) {
						logErrorWithContext(
							compendiumError,
							"usePowers.updatePower (compendium source lookup)",
						);
					}

					if (
						compendiumPower &&
						!(await isSourcebookAccessible(compendiumPower.source_book, {
							campaignId,
						}))
					) {
						throw new Error("This power requires sourcebook access.");
					}
				}
			}

			const { data, error } = await supabase
				.from("character_powers")
				.update(updates)
				.eq("id", id);
			if (error) {
				logErrorWithContext(error, "usePowers.updatePower");
				throw error;
			}
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["powers", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "usePowers.updatePower");
			toast({
				title: "Failed to update power",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const removePower = useMutation({
		mutationFn: async (id: string) => {
			if (isLocalCharacterId(characterId)) {
				removeLocalPower(id);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildPowersCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedPowers(cacheKey);
				if (cached) {
					writeCachedPowers(
						cacheKey,
						cached.filter((row) => row.id !== id),
					);
				}
			}

			const { error } = await supabase
				.from("character_powers")
				.delete()
				.eq("id", id);
			if (error) {
				logErrorWithContext(error, "usePowers.removePower");
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["powers", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "usePowers.removePower");
			toast({
				title: "Failed to remove power",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const reorderPowers = useMutation({
		mutationFn: async (newOrder: { id: string; display_order: number }[]) => {
			if (isLocalCharacterId(characterId)) {
				for (const { id, display_order } of newOrder) {
					updateLocalPower(id, { display_order });
				}
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildPowersCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedPowers(cacheKey);
				if (cached) {
					const next = cached
						.map((row) => {
							const nextOrder = newOrder.find((o) => o.id === row.id);
							return nextOrder
								? { ...row, display_order: nextOrder.display_order }
								: row;
						})
						.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
					writeCachedPowers(cacheKey, next);
				}
			}

			const updates = newOrder.map(({ id, display_order }) =>
				supabase
					.from("character_powers")
					.update({ display_order })
					.eq("id", id),
			);

			const results = await Promise.all(updates);
			const errors = results.filter((r) => r.error).map((r) => r.error);

			if (errors.length > 0) {
				const error = errors[0];
				logErrorWithContext(error, "usePowers.reorderPowers");
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["powers", characterId] });
		},
		onError: (error) => {
			logErrorWithContext(error, "usePowers.reorderPowers");
			toast({
				title: "Failed to reorder powers",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const preparedCount = powers.filter((p) => p.is_prepared).length;
	const concentrationPower = powers.find(
		(p) => p.concentration && p.is_prepared,
	);

	return {
		powers,
		isLoading,
		addPower: addPower.mutateAsync,
		updatePower: updatePower.mutateAsync,
		removePower: removePower.mutateAsync,
		reorderPowers: reorderPowers.mutateAsync,
		preparedCount,
		concentrationPower,
	};
};
