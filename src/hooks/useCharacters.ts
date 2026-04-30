import type { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { resolveCharacterCanonicalIds } from "@/lib/canonicalCompendium";
import { normalizeCharacterOverlayFields } from "@/lib/characterOverlayValidation";
import { filterPersonalCharacters } from "@/lib/characterScope";
import { isNotFoundError, logErrorWithContext } from "@/lib/errorHandling";
import {
	createLocalCharacter,
	deleteLocalCharacter,
	getLocalCharacterWithAbilities,
	isLocalCharacterId,
	listLocalCharacters,
	updateLocalCharacter,
} from "@/lib/guestStore";
import { log } from "@/lib/logger";
import { useOptimisticMutation } from "@/lib/optimisticUpdates";
import type { AbilityScore } from "@/types/core-rules";

// Note: These functions are defined in core-rules.ts but we'll use the ones from characterCalculations

export type Character = Database["public"]["Tables"]["characters"]["Row"];
type CharacterInsert = Database["public"]["Tables"]["characters"]["Insert"];
type CharacterUpdate = Database["public"]["Tables"]["characters"]["Update"];

export interface CharacterWithAbilities extends Character {
	abilities: Record<AbilityScore, number>;
}

export function mapToCharacterWithAbilities(
	char: Character,
): CharacterWithAbilities {
	return {
		...char,
		abilities: {
			STR: char.str || 10,
			AGI: char.agi || 10,
			VIT: char.vit || 10,
			INT: char.int || 10,
			SENSE: char.sense || 10,
			PRE: char.pre || 10,
		},
	};
}

type ExtendedFunctions = {
	get_character_by_share_token: {
		Args: { p_character_id: string; p_share_token: string };
		Returns: Character[];
	};
	generate_character_share_token_for_character: {
		Args: { p_character_id: string };
		Returns: string;
	};
};

type OverrideFunctions<T, U> = Omit<T, keyof U> & U;

type ExtendedDatabase = Omit<Database, "public"> & {
	public: Omit<Database["public"], "Functions"> & {
		Functions: OverrideFunctions<
			Database["public"]["Functions"],
			ExtendedFunctions
		>;
	};
};

const supabaseExtended = supabase as SupabaseClient<ExtendedDatabase>;

export type CharacterListScope = "personal" | "all";

type UseCharactersOptions = {
	scope?: CharacterListScope;
};

// Fetch all characters for current user
export const useCharacters = (options: UseCharactersOptions = {}) => {
	const scope = options.scope ?? "personal";
	return useQuery({
		queryKey: ["characters", scope],
		queryFn: async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				const localCharacters = listLocalCharacters();
				return scope === "all"
					? localCharacters
					: filterPersonalCharacters(localCharacters);
			}

			const { data: characters, error } = await supabase
				.from("characters")
				.select("*")
				.eq("user_id", user.id)
				.order("updated_at", { ascending: false });

			if (error) {
				logErrorWithContext(error, "useCharacters");
				throw error;
			}
			const hydratedCharacters = (characters || []).map(
				mapToCharacterWithAbilities,
			);
			return scope === "all"
				? hydratedCharacters
				: filterPersonalCharacters(hydratedCharacters);
		},
		retry: false, // Don't retry if not authenticated
	});
};

// Fetch single character with abilities
export const useCharacter = (characterId: string, shareToken?: string) => {
	return useQuery({
		queryKey: ["character", characterId, shareToken],
		queryFn: async (): Promise<CharacterWithAbilities | null> => {
			// Guest-lite local character
			if (isLocalCharacterId(characterId)) {
				return getLocalCharacterWithAbilities(
					characterId,
				) as CharacterWithAbilities | null;
			}

			// If share token provided, use it for read-only access
			if (shareToken) {
				const { data: characters, error: charError } =
					await supabaseExtended.rpc("get_character_by_share_token", {
						p_character_id: characterId,
						p_share_token: shareToken,
					});

				if (charError) {
					logErrorWithContext(charError, "useCharacter (share token)");
					if (isNotFoundError(charError)) return null;
					throw charError;
				}
				if (!characters || characters.length === 0) return null;

				const char = characters[0] as Character;

				// Fetch abilities for shared character
				const { data: abilities, error: abilitiesError } = await supabase
					.from("character_abilities")
					.select("ability, score")
					.eq("character_id", characterId);

				if (abilitiesError) throw abilitiesError;

				const abilitiesObj: Record<AbilityScore, number> = {
					STR: 10,
					AGI: 10,
					VIT: 10,
					INT: 10,
					SENSE: 10,
					PRE: 10,
				};

				abilities?.forEach(({ ability, score }) => {
					abilitiesObj[ability] = score;
				});

				return {
					...char,
					abilities: abilitiesObj,
				};
			}

			// Normal authenticated access
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return null; // Return null if not authenticated

			// Fetch character
			const { data: character, error: charError } = await supabase
				.from("characters")
				.select("*")
				.eq("id", characterId)
				.eq("user_id", user.id)
				.maybeSingle();

			if (charError) {
				logErrorWithContext(charError, "useCharacter");
				if (isNotFoundError(charError)) return null;
				throw charError;
			}
			if (!character) return null;

			// Fetch abilities
			const { data: abilities, error: abilitiesError } = await supabase
				.from("character_abilities")
				.select("ability, score")
				.eq("character_id", characterId);

			if (abilitiesError) {
				logErrorWithContext(abilitiesError, "useCharacter (abilities fetch)");
				throw abilitiesError;
			}

			// Build abilities object
			const abilitiesObj: Record<AbilityScore, number> = {
				STR: 10,
				AGI: 10,
				VIT: 10,
				INT: 10,
				SENSE: 10,
				PRE: 10,
			};

			abilities?.forEach(({ ability, score }) => {
				abilitiesObj[ability] = score;
			});

			return {
				...character,
				abilities: abilitiesObj,
			};
		},
		enabled: !!characterId,
		retry: false, // Don't retry if not authenticated
	});
};

// Create character
export const useCreateCharacter = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: Omit<CharacterInsert, "user_id">) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			const dataWithCanonicalIds = await normalizeCharacterOverlayFields(
				await resolveCharacterCanonicalIds(data),
			);
			if (!user) {
				return createLocalCharacter(dataWithCanonicalIds);
			}

			const { data: character, error } = await supabase
				.from("characters")
				.insert({ ...dataWithCanonicalIds, user_id: user.id })
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useCreateCharacter");
				throw error;
			}

			// Create default ability scores
			const defaultAbilities: AbilityScore[] = [
				"STR",
				"AGI",
				"VIT",
				"INT",
				"SENSE",
				"PRE",
			];
			const abilityInserts = defaultAbilities.map((ability) => ({
				character_id: character.id,
				ability,
				score: 10,
			}));

			const { error: abilitiesError } = await supabase
				.from("character_abilities")
				.insert(abilityInserts);

			if (abilitiesError) {
				logErrorWithContext(abilitiesError, "useCreateCharacter (abilities)");
				// Don't throw - character was created, abilities can be fixed later
			}

			return character;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			log("Ascendant created successfully");
		},
		onError: (error) => {
			logErrorWithContext(error, "useCreateCharacter");
		},
	});
};

// Update character
export const useUpdateCharacter = () => {
	const _queryClient = useQueryClient();
	const { addToSyncQueue } = useBackgroundSync();

	return useOptimisticMutation<
		Character | NonNullable<ReturnType<typeof updateLocalCharacter>>,
		{ id: string; data: CharacterUpdate },
		{ previousData: unknown; mutationKey: unknown }
	>(
		(variables) => ["character", variables.id, undefined],
		async ({ id, data }: { id: string; data: CharacterUpdate }) => {
			const dataWithCanonicalIds = await normalizeCharacterOverlayFields(
				await resolveCharacterCanonicalIds(data),
			);
			if (isLocalCharacterId(id)) {
				const updated = updateLocalCharacter(id, dataWithCanonicalIds);
				if (!updated) throw new AppError("Ascendant not found", "NOT_FOUND");
				return updated;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { data: character, error } = await supabase
				.from("characters")
				.update({
					...dataWithCanonicalIds,
					updated_at: new Date().toISOString(),
				})
				.eq("id", id)
				.eq("user_id", user.id)
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useUpdateCharacter");
				throw error;
			}
			return character;
		},
		// Optimistic calculation: immediately patch the character's properties
		(oldData, { data }) => {
			if (!oldData) return oldData;
			return {
				...oldData,
				...data,
				updated_at: new Date().toISOString(),
			};
		},
		(variables) => {
			addToSyncQueue("character", "update", {
				id: variables.id,
				...variables.data,
			});
		},
	);
};

// Delete character
export const useDeleteCharacter = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			if (isLocalCharacterId(id)) {
				deleteLocalCharacter(id);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { error } = await supabase
				.from("characters")
				.delete()
				.eq("id", id)
				.eq("user_id", user.id);

			if (error) {
				logErrorWithContext(error, "useDeleteCharacter");
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["characters"] });
		},
		onError: (error) => {
			logErrorWithContext(error, "useDeleteCharacter");
		},
	});
};

// Generate share token for character
export const useGenerateShareToken = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (characterId: string): Promise<string> => {
			if (isLocalCharacterId(characterId)) {
				throw new AppError(
					"Sharing requires a signed-in account",
					"AUTH_REQUIRED",
				);
			}

			const { data, error } = await supabaseExtended.rpc(
				"generate_character_share_token_for_character",
				{
					p_character_id: characterId,
				},
			);

			if (error) throw error;
			return data as string;
		},
		onSuccess: (_, characterId) => {
			queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			log("Share link generated");
		},
		onError: (error: Error) => {
			logErrorWithContext(error, "useGenerateShareToken");
		},
	});
};

// Note: calculateDerivedStats was removed - use calculateCharacterStats from lib/characterCalculations instead
