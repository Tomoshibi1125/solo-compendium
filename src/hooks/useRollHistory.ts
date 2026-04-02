import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
	addLocalRollHistory,
	isLocalCharacterId,
	listLocalRollHistory,
} from "@/lib/guestStore";

export type RollRecord = Database["public"]["Tables"]["roll_history"]["Row"];
type RollRecordInsert = Database["public"]["Tables"]["roll_history"]["Insert"];
export type RollRecordInsertClient = Omit<
	RollRecordInsert,
	"id" | "user_id" | "created_at"
> & {
	campaign_id?: string | null;
};

const buildRollHistoryCacheKey = (
	userId: string,
	characterId: string | null,
	limit: number,
) => {
	const scope = characterId ? `character:${characterId}` : "all";
	return `solo-compendium.cache.roll-history.${userId}.${scope}.limit-${limit}.v1`;
};

const readCachedRollHistory = (key: string): RollRecord[] | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as RollRecord[]) : null;
	} catch {
		return null;
	}
};

const writeCachedRollHistory = (key: string, records: RollRecord[]) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(records));
	} catch {
		// ignore
	}
};

export const useRollHistory = (characterId?: string, limit = 50) => {
	return useQuery({
		queryKey: ["roll-history", characterId, limit],
		queryFn: async () => {
			if (
				!isSupabaseConfigured ||
				import.meta.env.VITE_E2E === "true" ||
				(characterId && isLocalCharacterId(characterId))
			) {
				return listLocalRollHistory(characterId).slice(0, limit);
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				return listLocalRollHistory(characterId).slice(0, limit);
			}

			const cacheKey = buildRollHistoryCacheKey(
				user.id,
				characterId ?? null,
				limit,
			);

			let query = supabase
				.from("roll_history")
				.select("*")
				.eq("user_id", user.id)
				.order("created_at", { ascending: false })
				.limit(limit);

			if (characterId) {
				query = query.eq("character_id", characterId);
			}

			const { data, error } = await query;
			if (error) {
				const cached = readCachedRollHistory(cacheKey);
				if (cached) return cached;
				throw error;
			}

			const records = (data || []) as RollRecord[];
			writeCachedRollHistory(cacheKey, records);
			return records;
		},
		retry: false, // Don't retry if not authenticated
	});
};

export const useRecordRoll = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (roll: RollRecordInsertClient) => {
			const normalizedRoll = {
				...roll,
				campaign_id: roll.campaign_id ?? null,
				character_id: roll.character_id ?? null,
				context: roll.context ?? null,
				modifiers: roll.modifiers ?? null,
			};
			const isLocal = roll.character_id
				? isLocalCharacterId(roll.character_id)
				: false;
			if (
				!isSupabaseConfigured ||
				import.meta.env.VITE_E2E === "true" ||
				isLocal
			) {
				return addLocalRollHistory({
					...normalizedRoll,
					user_id: "guest",
					created_at: new Date().toISOString(),
				});
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				return addLocalRollHistory({
					...normalizedRoll,
					user_id: "guest",
					created_at: new Date().toISOString(),
				});
			}

			// Optimistically mirror into local cache for offline continuity.
			const cacheKey = buildRollHistoryCacheKey(
				user.id,
				normalizedRoll.character_id,
				50,
			);
			const cached = readCachedRollHistory(cacheKey) ?? [];
			const optimistic: RollRecord = {
				id: `optimistic_${Date.now()}`,
				user_id: user.id,
				created_at: new Date().toISOString(),
				campaign_id: normalizedRoll.campaign_id,
				character_id: normalizedRoll.character_id,
				context: normalizedRoll.context,
				dice_formula: normalizedRoll.dice_formula,
				modifiers: normalizedRoll.modifiers,
				result: normalizedRoll.result,
				roll_type: normalizedRoll.roll_type,
				rolls: normalizedRoll.rolls,
			};
			writeCachedRollHistory(cacheKey, [optimistic, ...cached].slice(0, 50));

			const { data, error } = await supabase
				.from("roll_history")
				.insert({
					...normalizedRoll,
					user_id: user.id,
				})
				.select()
				.single();

			if (error) throw error;

			const nextCached = (readCachedRollHistory(cacheKey) ?? []).filter(
				(r) => !String(r.id).startsWith("optimistic_"),
			);
			writeCachedRollHistory(
				cacheKey,
				[data as RollRecord, ...nextCached].slice(0, 50),
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roll-history"] });
		},
	});
};
