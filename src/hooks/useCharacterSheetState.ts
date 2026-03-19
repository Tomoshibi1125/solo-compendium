import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { normalizeCharacterResources } from "@/lib/characterResources";
import {
	type CharacterSheetState,
	createDefaultCharacterSheetState,
} from "@/lib/characterSheetState";
import { normalizeCustomModifiers } from "@/lib/customModifiers";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import {
	getLocalCharacterSheetState,
	isLocalCharacterId,
	setLocalCharacterSheetState,
} from "@/lib/guestStore";

type SheetStateRow =
	Database["public"]["Tables"]["character_sheet_state"]["Row"];

const defaultState = createDefaultCharacterSheetState();

function normalizeSheetState(row: SheetStateRow | null): CharacterSheetState {
	if (!row) return defaultState;
	return {
		resources: normalizeCharacterResources(
			row.resources as unknown as CharacterSheetState["resources"],
		),
		customModifiers: normalizeCustomModifiers(
			row.custom_modifiers as unknown as CharacterSheetState["customModifiers"],
		),
	};
}

const buildSheetStateCacheKey = (userId: string, characterId: string) => {
	return `solo-compendium.cache.character-sheet-state.${userId}.character:${characterId}.v1`;
};

const readCachedSheetState = (key: string): CharacterSheetState | null => {
	try {
		if (typeof window === "undefined") return null;
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		return JSON.parse(raw) as CharacterSheetState;
	} catch {
		return null;
	}
};

const writeCachedSheetState = (key: string, state: CharacterSheetState) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(key, JSON.stringify(state));
	} catch {
		// ignore
	}
};

export function useCharacterSheetState(characterId: string) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const authQuery = useQuery({
		queryKey: ["auth-user"],
		queryFn: async () => {
			const { data } = await supabase.auth.getUser();
			return data;
		},
	});
	const user = authQuery.data?.user;

	const query = useQuery({
		queryKey: ["character-sheet-state", characterId],
		queryFn: async () => {
			if (!characterId) return defaultState;
			if (isLocalCharacterId(characterId)) {
				const local = getLocalCharacterSheetState(characterId);
				if (!local) return defaultState;
				return {
					resources: normalizeCharacterResources(local.resources),
					customModifiers: normalizeCustomModifiers(local.customModifiers),
				};
			}

			const cacheKey = user?.id
				? buildSheetStateCacheKey(user.id, characterId)
				: null;

			const { data, error } = await supabase
				.from("character_sheet_state")
				.select("*")
				.eq("character_id", characterId)
				.maybeSingle();

			if (error) {
				logErrorWithContext(error, "useCharacterSheetState");
				if (cacheKey) {
					const cached = readCachedSheetState(cacheKey);
					if (cached) return cached;
				}
				throw error;
			}

			const next = normalizeSheetState(data as SheetStateRow | null);
			if (cacheKey) {
				writeCachedSheetState(cacheKey, next);
			}
			return next;
		},
		enabled: !!characterId,
	});

	const updateSheetState = useMutation({
		mutationFn: async (state: CharacterSheetState) => {
			if (!characterId) return defaultState;
			if (isLocalCharacterId(characterId)) {
				setLocalCharacterSheetState(characterId, state);
				return state;
			}

			const cacheKey = user?.id
				? buildSheetStateCacheKey(user.id, characterId)
				: null;
			if (cacheKey) {
				writeCachedSheetState(cacheKey, state);
			}

			const payload: Database["public"]["Tables"]["character_sheet_state"]["Insert"] =
				{
					character_id: characterId,
					resources:
						state.resources as unknown as Database["public"]["Tables"]["character_sheet_state"]["Insert"]["resources"],
					custom_modifiers:
						state.customModifiers as unknown as Database["public"]["Tables"]["character_sheet_state"]["Insert"]["custom_modifiers"],
				};

			const { data, error } = await supabase
				.from("character_sheet_state")
				.upsert(payload, { onConflict: "character_id" })
				.select("*")
				.single();

			if (error) {
				logErrorWithContext(error, "useCharacterSheetState.update");
				throw error;
			}

			return normalizeSheetState(data as SheetStateRow);
		},
		onSuccess: (data) => {
			queryClient.setQueryData(["character-sheet-state", characterId], data);
		},
		onError: (error) => {
			toast({
				title: "Failed to update sheet",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	const saveSheetState = useCallback(
		async (updates: Partial<CharacterSheetState>) => {
			const current =
				queryClient.getQueryData<CharacterSheetState>([
					"character-sheet-state",
					characterId,
				]) || defaultState;
			const next: CharacterSheetState = {
				resources: updates.resources ?? current.resources,
				customModifiers: updates.customModifiers ?? current.customModifiers,
			};
			return updateSheetState.mutateAsync(next);
		},
		[characterId, queryClient, updateSheetState],
	);

	return useMemo(
		() => ({
			state: query.data || defaultState,
			isLoading: query.isLoading,
			isSaving: updateSheetState.isPending,
			saveSheetState,
		}),
		[query.data, query.isLoading, updateSheetState.isPending, saveSheetState],
	);
}

/**
 * Convenience hook for character resources
 */
export function useCharacterResources(characterId: string) {
	const { state, saveSheetState } = useCharacterSheetState(characterId);
	return [
		state.resources,
		(resources: CharacterSheetState["resources"]) =>
			saveSheetState({ resources }),
	] as const;
}
