import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import {
	getCasterType,
	getSpellSlotsPerLevel,
} from "@/lib/characterCalculations";
import {
	getLocalCharacterState,
	isLocalCharacterId,
	listLocalSpellSlots,
	updateLocalSpellSlotRow,
	upsertLocalSpellSlot,
} from "@/lib/guestStore";

export interface SpellSlotData {
	level: number;
	max: number;
	current: number;
	recoveredOnShortRest: boolean;
	recoveredOnLongRest: boolean;
}

type SpellSlotRow =
	Database["public"]["Tables"]["character_spell_slots"]["Row"];

const buildSpellSlotsCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.spell-slots.${userId}.character:${characterId}.v1`;
};

const readCachedSpellSlots = (key: string): SpellSlotData[] | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? (parsed as SpellSlotData[]) : null;
	} catch {
		return null;
	}
};

const writeCachedSpellSlots = (key: string, slots: SpellSlotData[]) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(slots));
	} catch {
		// ignore
	}
};

/**
 * Fetch spell slots for a character
 */
export const useSpellSlots = (
	characterId: string,
	job: string | null,
	characterLevel: number,
) => {
	return useQuery({
		queryKey: ["spell-slots", characterId],
		queryFn: async (): Promise<SpellSlotData[]> => {
			if (isLocalCharacterId(characterId)) {
				// Local: ensure slots exist based on derived caster progression.
				const casterType = getCasterType(job);
				const expectedSlots = getSpellSlotsPerLevel(casterType, characterLevel);
				const isPactCaster = casterType === "pact";

				const existing = listLocalSpellSlots(characterId);
				const byLevel = new Map(existing.map((s) => [s.spell_level, s]));

				for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
					const maxSlots = expectedSlots[spellLevel];
					if (maxSlots <= 0) continue;
					if (byLevel.has(spellLevel)) continue;

					const row = upsertLocalSpellSlot(characterId, {
						spell_level: spellLevel,
						slots_max: maxSlots,
						slots_current: maxSlots,
						slots_recovered_on_short_rest: isPactCaster ? 1 : 0,
						slots_recovered_on_long_rest: 1,
					});
					byLevel.set(spellLevel, row);
				}

				const slots: SpellSlotData[] = [];
				for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
					const maxSlots = expectedSlots[spellLevel];
					if (maxSlots <= 0) continue;

					const row = byLevel.get(spellLevel);
					if (!row) continue;

					slots.push({
						level: spellLevel,
						max: row.slots_max ?? maxSlots,
						current: row.slots_current ?? maxSlots,
						recoveredOnShortRest: row.slots_recovered_on_short_rest === 1,
						recoveredOnLongRest: row.slots_recovered_on_long_rest === 1,
					});
				}

				return slots;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildSpellSlotsCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_spell_slots")
				.select("*")
				.eq("character_id", characterId)
				.order("spell_level", { ascending: true });

			if (error) {
				if (cacheKey) {
					const cached = readCachedSpellSlots(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}

			// Get expected slots based on caster type and level
			const casterType = getCasterType(job);
			const expectedSlots = getSpellSlotsPerLevel(casterType, characterLevel);

			// Create array of spell slot data
			const slots: SpellSlotData[] = [];

			for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
				const maxSlots = expectedSlots[spellLevel];

				// Find existing slot record
				const existing = data?.find((s) => s.spell_level === spellLevel);

				if (maxSlots > 0 || existing) {
					slots.push({
						level: spellLevel,
						max: existing?.slots_max ?? maxSlots,
						current: existing?.slots_current ?? maxSlots,
						recoveredOnShortRest: existing?.slots_recovered_on_short_rest === 1,
						recoveredOnLongRest: existing?.slots_recovered_on_long_rest === 1,
					});
				}
			}

			if (cacheKey) {
				writeCachedSpellSlots(cacheKey, slots);
			}
			return slots;
		},
		enabled: !!characterId,
	});
};

/**
 * Update spell slot current count
 */
export const useUpdateSpellSlot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			characterId,
			spellLevel,
			current,
		}: {
			characterId: string;
			spellLevel: number;
			current: number;
		}) => {
			if (isLocalCharacterId(characterId)) {
				const entry = getLocalCharacterState(characterId);
				if (!entry) throw new AppError("Ascendant not found", "NOT_FOUND");

				const casterType = getCasterType(entry.character.job);
				const expectedSlots = getSpellSlotsPerLevel(
					casterType,
					entry.character.level,
				);
				const maxSlots = expectedSlots[spellLevel];
				if (maxSlots <= 0) return;

				const existing = listLocalSpellSlots(characterId).find(
					(s) => s.spell_level === spellLevel,
				);
				if (existing) {
					updateLocalSpellSlotRow(existing.id, {
						slots_current: Math.max(0, current),
					});
				} else {
					upsertLocalSpellSlot(characterId, {
						spell_level: spellLevel,
						slots_max: maxSlots,
						slots_current: Math.max(0, current),
						slots_recovered_on_short_rest: casterType === "pact" ? 1 : 0,
						slots_recovered_on_long_rest: 1,
					});
				}
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildSpellSlotsCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedSpellSlots(cacheKey);
				const seed =
					cached ??
					(queryClient.getQueryData(["spell-slots", characterId]) as
						| SpellSlotData[]
						| undefined) ??
					null;
				if (seed) {
					const nextCached = seed.map((slot) =>
						slot.level === spellLevel
							? { ...slot, current: Math.max(0, current) }
							: slot,
					);
					writeCachedSpellSlots(cacheKey, nextCached);
				}
			}

			// Check if slot exists
			const { data: existing } = await supabase
				.from("character_spell_slots")
				.select("id")
				.eq("character_id", characterId)
				.eq("spell_level", spellLevel)
				.single();

			if (existing) {
				// Update existing
				const { error } = await supabase
					.from("character_spell_slots")
					.update({ slots_current: Math.max(0, current) })
					.eq("id", existing.id);

				if (error) throw error;
			} else {
				// Create new if we have a max value
				const { data: character } = await supabase
					.from("characters")
					.select("job, level")
					.eq("id", characterId)
					.single();

				if (character) {
					const casterType = getCasterType(character.job);
					const expectedSlots = getSpellSlotsPerLevel(
						casterType,
						character.level,
					);
					const maxSlots = expectedSlots[spellLevel];

					if (maxSlots > 0) {
						const { error } = await supabase
							.from("character_spell_slots")
							.insert({
								character_id: characterId,
								spell_level: spellLevel,
								slots_max: maxSlots,
								slots_current: Math.max(0, current),
								slots_recovered_on_short_rest: 0,
								slots_recovered_on_long_rest: 1,
							});

						if (error) throw error;
					}
				}
			}
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["spell-slots", variables.characterId],
			});
		},
	});
};

/**
 * Initialize spell slots for a character (called on level up or job change)
 */
export const useInitializeSpellSlots = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			characterId,
			job,
			level,
		}: {
			characterId: string;
			job: string | null;
			level: number;
		}) => {
			if (isLocalCharacterId(characterId)) {
				const casterType = getCasterType(job);
				const expectedSlots = getSpellSlotsPerLevel(casterType, level);
				const isPactCaster = casterType === "pact";

				const existing = listLocalSpellSlots(characterId);
				for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
					const maxSlots = expectedSlots[spellLevel];
					if (maxSlots <= 0) continue;

					const existingSlot = existing.find(
						(s) => s.spell_level === spellLevel,
					);
					const newCurrent = existingSlot
						? Math.min(existingSlot.slots_current, maxSlots)
						: maxSlots;

					upsertLocalSpellSlot(characterId, {
						spell_level: spellLevel,
						slots_max: maxSlots,
						slots_current: newCurrent,
						slots_recovered_on_short_rest: isPactCaster
							? 1
							: (existingSlot?.slots_recovered_on_short_rest ?? 0),
						slots_recovered_on_long_rest:
							existingSlot?.slots_recovered_on_long_rest ?? 1,
					});
				}

				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildSpellSlotsCacheKey(user.id, characterId)
				: null;

			const casterType = getCasterType(job);
			const expectedSlots = getSpellSlotsPerLevel(casterType, level);
			const isPactCaster = casterType === "pact";

			// Get existing slots
			const { data: existing, error: existingError } = await supabase
				.from("character_spell_slots")
				.select("*")
				.eq("character_id", characterId);

			if (existingError) throw existingError;

			for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
				const maxSlots = expectedSlots[spellLevel];
				if (maxSlots <= 0) continue;

				// Find existing slot record
				const existingSlot = existing?.find(
					(s) => s.spell_level === spellLevel,
				) as SpellSlotRow | undefined;

				const nextCurrent = existingSlot
					? Math.min(existingSlot.slots_current ?? maxSlots, maxSlots)
					: maxSlots;

				if (existingSlot?.id) {
					const { error: updateError } = await supabase
						.from("character_spell_slots")
						.update({
							slots_max: maxSlots,
							slots_current: nextCurrent,
						})
						.eq("id", existingSlot.id);
					if (updateError) throw updateError;
				} else {
					const { error: insertError } = await supabase
						.from("character_spell_slots")
						.insert({
							character_id: characterId,
							spell_level: spellLevel,
							slots_max: maxSlots,
							slots_current: nextCurrent,
							slots_recovered_on_short_rest: isPactCaster ? 1 : 0,
							slots_recovered_on_long_rest: 1,
						});
					if (insertError) throw insertError;
				}
			}

			if (cacheKey) {
				const { data: refreshed, error: refreshError } = await supabase
					.from("character_spell_slots")
					.select("*")
					.eq("character_id", characterId)
					.order("spell_level", { ascending: true });
				if (refreshError) throw refreshError;

				const slots: SpellSlotData[] = [];
				for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
					const expectedMax = expectedSlots[spellLevel];
					const row = (refreshed || []).find(
						(s) => s.spell_level === spellLevel,
					) as SpellSlotRow | undefined;
					if (expectedMax <= 0 && !row) continue;

					slots.push({
						level: spellLevel,
						max: row?.slots_max ?? expectedMax,
						current: row?.slots_current ?? row?.slots_max ?? expectedMax,
						recoveredOnShortRest: row?.slots_recovered_on_short_rest === 1,
						recoveredOnLongRest: row?.slots_recovered_on_long_rest === 1,
					});
				}
				writeCachedSpellSlots(cacheKey, slots);
			}
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["spell-slots", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character", variables.characterId],
			});
		},
	});
};

/**
 * Recover spell slots on rest
 */
// biome-ignore lint/correctness/noUnusedVariables: exported for use in other modules
const useRecoverSpellSlots = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			characterId,
			restType,
		}: {
			characterId: string;
			restType: "short" | "long";
		}) => {
			if (isLocalCharacterId(characterId)) {
				const slots = listLocalSpellSlots(characterId);
				for (const slot of slots) {
					if (restType === "long") {
						updateLocalSpellSlotRow(slot.id, { slots_current: slot.slots_max });
					} else {
						if (slot.slots_recovered_on_short_rest === 1) {
							updateLocalSpellSlotRow(slot.id, {
								slots_current: slot.slots_max,
							});
						}
					}
				}
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			const cacheKey = user?.id
				? buildSpellSlotsCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				const cached = readCachedSpellSlots(cacheKey);
				const seed =
					cached ??
					(queryClient.getQueryData(["spell-slots", characterId]) as
						| SpellSlotData[]
						| undefined) ??
					null;
				if (seed) {
					const nextCached = seed.map((slot) => {
						if (restType === "long") {
							return { ...slot, current: slot.max };
						}
						return slot.recoveredOnShortRest
							? { ...slot, current: slot.max }
							: slot;
					});
					writeCachedSpellSlots(cacheKey, nextCached);
				}
			}

			const { data: slots } = await supabase
				.from("character_spell_slots")
				.select("*")
				.eq("character_id", characterId);

			if (!slots) return;

			const operations = slots.map((slot) => {
				if (restType === "long") {
					// Long rest: recover all slots
					return supabase
						.from("character_spell_slots")
						.update({ slots_current: slot.slots_max })
						.eq("id", slot.id);
				} else {
					// Short rest: only recover slots that are marked for short rest recovery
					if (slot.slots_recovered_on_short_rest === 1) {
						return supabase
							.from("character_spell_slots")
							.update({ slots_current: slot.slots_max })
							.eq("id", slot.id);
					}
					return Promise.resolve({ data: null, error: null });
				}
			});

			await Promise.all(operations);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["spell-slots", variables.characterId],
			});
		},
	});
};
