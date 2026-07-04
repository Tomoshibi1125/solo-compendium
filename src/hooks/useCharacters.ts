import type { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { resolveCharacterCanonicalIds } from "@/lib/canonicalCompendium";
import {
	assertCharacterCreatable,
	MAX_CHARACTERS_PER_USER,
} from "@/lib/characterLimits";
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
import { notify } from "@/lib/notify";
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

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

function hasStoredSupabaseSession(): boolean {
	if (typeof window === "undefined" || !window.localStorage) return false;
	return Object.keys(window.localStorage).some((key) => {
		if (key.includes("supabase.auth.token")) return true;
		if (key.includes("sb-") && key.endsWith("-auth-token")) return true;
		if (key.includes("auth-token")) return true;
		return false;
	});
}

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
			let dataWithCanonicalIds: typeof data;
			try {
				dataWithCanonicalIds = await normalizeCharacterOverlayFields(
					await resolveCharacterCanonicalIds(data),
				);
			} catch (enrichErr) {
				console.warn(
					"Canonical ID enrichment failed, using raw data:",
					enrichErr,
				);
				dataWithCanonicalIds = data;
			}
			if (
				!isSupabaseConfigured ||
				(guestEnabled && !hasStoredSupabaseSession())
			) {
				assertCharacterCreatable(
					listLocalCharacters(),
					dataWithCanonicalIds.name,
				);
				return createLocalCharacter(dataWithCanonicalIds);
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				assertCharacterCreatable(
					listLocalCharacters(),
					dataWithCanonicalIds.name,
				);
				return createLocalCharacter(dataWithCanonicalIds);
			}

			// Enforce per-user limits (also enforced authoritatively by the DB
			// trigger + unique index) up-front for a friendly error. Count only the
			// user's *personal* characters — campaign sandbox NPCs live in the same
			// table under the owner's user_id (marked `[SANDBOX_NPC]` in notes) but
			// are hidden from the roster by `filterPersonalCharacters`, so they must
			// not consume the limit either (mirrored by the DB trigger).
			const { data: ownChars, error: ownCharsErr } = await supabase
				.from("characters")
				.select("name, notes")
				.eq("user_id", user.id);
			if (!ownCharsErr && ownChars) {
				assertCharacterCreatable(
					filterPersonalCharacters(ownChars),
					dataWithCanonicalIds.name,
				);
			}

			// `characters.user_id` has a FK to `public.profiles(id)`. Accounts
			// created before the `handle_new_user()` trigger/backfill existed can
			// be missing their `profiles` row, which makes the insert below fail
			// with FK violation 23503 ("violates foreign key constraint
			// characters_user_id_fkey"). The profiles INSERT RLS policy allows a
			// signed-in user to self-insert (`auth.uid() = id`), so idempotently
			// ensure the row exists first. `profiles.email` is NOT NULL, so only
			// attempt this when we have an email; the server-side backfill covers
			// the rare email-less case. Best-effort: a failure here must not mask
			// the real insert error surfaced below.
			if (user.email) {
				try {
					await supabase
						.from("profiles")
						.upsert(
							{ id: user.id, email: user.email },
							{ onConflict: "id", ignoreDuplicates: true },
						);
				} catch (profileErr) {
					logErrorWithContext(profileErr, "useCreateCharacter: ensure profile");
				}
			}

			const { data: character, error } = await supabase
				.from("characters")
				.insert({ ...dataWithCanonicalIds, user_id: user.id })
				.select()
				.single();

			if (error) {
				logErrorWithContext(error, "useCreateCharacter");
				// Map the DB-layer limit backstops to friendly errors (in case the
				// up-front guard was skipped, e.g. a concurrent insert).
				const msg = String(error.message ?? "").toLowerCase();
				if (
					error.code === "23505" &&
					msg.includes("characters_unique_name_per_user")
				) {
					throw new AppError(
						`You already have a character named "${(dataWithCanonicalIds.name ?? "").trim()}". Each character must have a unique name.`,
						"DUPLICATE_CHARACTER_NAME",
						error,
					);
				}
				if (msg.includes("character limit reached")) {
					throw new AppError(
						`Character limit reached — you can have at most ${MAX_CHARACTERS_PER_USER} characters.`,
						"CHARACTER_LIMIT",
						error,
					);
				}
				throw error;
			}

			// Seed the per-ability rows from the values we just persisted on the
			// character row (str/agi/...). The character_abilities table is the
			// source of truth the sheet reads from, so seeding it with the real
			// scores keeps it consistent with the row immediately — previously it
			// was hardcoded to 10 and relied on a later, best-effort upsert to
			// correct it, which left sheets showing all-10s if that upsert was
			// skipped. Upsert (not insert) so this is safe to re-run.
			const abilityColumnByScore: Record<
				AbilityScore,
				"str" | "agi" | "vit" | "int" | "sense" | "pre"
			> = {
				STR: "str",
				AGI: "agi",
				VIT: "vit",
				INT: "int",
				SENSE: "sense",
				PRE: "pre",
			};
			const abilityInserts = (
				Object.keys(abilityColumnByScore) as AbilityScore[]
			).map((ability) => {
				const column = abilityColumnByScore[ability];
				const persisted = (character as Record<string, unknown>)[column];
				const score =
					typeof persisted === "number" && Number.isFinite(persisted)
						? persisted
						: 10;
				return { character_id: character.id, ability, score };
			});

			const { error: abilitiesError } = await supabase
				.from("character_abilities")
				.upsert(abilityInserts, { onConflict: "character_id,ability" });

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

			// Capture previous XP / level so we can detect level-readiness
			// transitions (R6 of Round 2: level-up notification producer).
			let prevXP: number | null = null;
			let prevLevel: number | null = null;
			try {
				const { data: prev } = await supabase
					.from("characters")
					.select("experience, level")
					.eq("id", id)
					.eq("user_id", user.id)
					.maybeSingle();
				prevXP =
					typeof (prev as { experience?: number } | null)?.experience ===
					"number"
						? ((prev as { experience?: number }).experience as number)
						: null;
				prevLevel =
					typeof (prev as { level?: number } | null)?.level === "number"
						? ((prev as { level?: number }).level as number)
						: null;
			} catch {
				// silent — readiness producer is best-effort
			}

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
				const msg = String(error.message ?? "").toLowerCase();
				if (
					error.code === "23505" &&
					msg.includes("characters_unique_name_per_user")
				) {
					throw new AppError(
						`You already have a character named "${(dataWithCanonicalIds.name ?? "").trim()}". Each character must have a unique name.`,
						"DUPLICATE_CHARACTER_NAME",
						error,
					);
				}
				throw error;
			}

			// R6: detect XP threshold crossing and produce a level-readiness
			// notification on the character owner's inbox. Best-effort — must
			// not block character updates.
			try {
				const updated = character as {
					experience?: number;
					level?: number;
					name?: string;
				} | null;
				const nextXP = updated?.experience ?? null;
				const nextLevel = updated?.level ?? null;
				if (
					nextXP != null &&
					nextLevel != null &&
					nextLevel < 20 &&
					prevXP != null &&
					prevLevel === nextLevel
				) {
					const { getXPForLevel } = await import("@/lib/experience");
					const threshold = getXPForLevel(nextLevel + 1);
					if (prevXP < threshold && nextXP >= threshold) {
						// Targets the current user (the character owner), so no
						// explicit userId — notify() defaults to the signed-in user.
						await notify({
							type: "level_ready",
							title: `Level up ready for ${updated?.name ?? "your Ascendant"}`,
							message: `Reached the XP threshold for level ${nextLevel + 1}. Open the sheet to advance.`,
							priority: "high",
							category: "character",
							payload: { character_id: id },
							link: `/characters/${id}`,
						});
					}
				}
			} catch (readinessErr) {
				if (typeof console !== "undefined") {
					console.warn("Level-readiness producer failed", readinessErr);
				}
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
