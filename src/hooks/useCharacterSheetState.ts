import {
	type QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { useUpdateCharacter } from "@/hooks/useCharacters";
import type { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useSheetUiPersistence } from "@/hooks/useSheetUiPersistence";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { normalizeCharacterResources } from "@/lib/characterResources";
import {
	type CharacterSheetState,
	createDefaultCharacterSheetState,
	type SheetNoteSection,
} from "@/lib/characterSheetState";
import { normalizeCustomModifiers } from "@/lib/customModifiers";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import {
	getLocalCharacterSheetState,
	isLocalCharacterId,
	setLocalCharacterSheetState,
} from "@/lib/guestStore";
import { useCharacterSheetUiStore } from "@/stores/characterSheetUiStore";

type SheetStateRow =
	Database["public"]["Tables"]["character_sheet_state"]["Row"];

const defaultState = createDefaultCharacterSheetState();

function normalizeSheetState(row: SheetStateRow | null): CharacterSheetState {
	if (!row) return defaultState;

	const resources = normalizeCharacterResources(
		row.resources as Record<string, unknown> | null,
	);

	// Safe extraction of UI state from the raw JSON field
	const rawResources = (row.resources as Record<string, unknown>) || {};

	return {
		resources,
		customModifiers: normalizeCustomModifiers(
			row.custom_modifiers as Record<string, unknown>[] | null,
		),
		ui: (rawResources.ui as CharacterSheetState["ui"]) || defaultState.ui,
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

export function useCharacterSheetState(
	characterId: string,
	options?: { manageUiStore?: boolean },
) {
	const manageUiStore = options?.manageUiStore ?? false;
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
					ui:
						(local as { ui?: CharacterSheetState["ui"] }).ui || defaultState.ui,
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

			const resourcesWithUi = {
				...state.resources,
				ui: state.ui,
			};

			const payload: Database["public"]["Tables"]["character_sheet_state"]["Insert"] =
				{
					character_id: characterId,
					user_id: user?.id ?? "",
					resources: JSON.parse(JSON.stringify(resourcesWithUi)),
					custom_modifiers: JSON.parse(JSON.stringify(state.customModifiers)),
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

			// The UI store is the source of truth for the `ui` slice once hydrated,
			// so every save (including mechanical-resource saves) carries the live
			// UI prefs and never clobbers them in the shared JSON column.
			const uiStore = useCharacterSheetUiStore.getState();
			const next: CharacterSheetState = {
				resources: updates.resources ?? current.resources,
				customModifiers: updates.customModifiers ?? current.customModifiers,
				ui:
					updates.ui ??
					(uiStore.hydrated ? uiStore.getPersistedUi() : current.ui),
			};
			queryClient.setQueryData(["character-sheet-state", characterId], next);
			return updateSheetState.mutateAsync(next);
		},
		[characterId, queryClient, updateSheetState],
	);

	// The UI store owns these persisted preferences; edits flow through it and
	// are written back to Supabase by useSheetUiPersistence (debounced), so a
	// tab click no longer fires a mutation every time.
	const setModal = useCallback(
		(modalId: keyof CharacterSheetState["ui"]["modals"], isOpen: boolean) => {
			useCharacterSheetUiStore.getState().setModal(modalId, isOpen);
		},
		[],
	);

	const setActiveTab = useCallback((tab: string) => {
		useCharacterSheetUiStore.getState().setActiveTab(tab);
	}, []);

	// F3 of May 2026 remediation plan: per-section inline notes (DDB parity).
	const setSectionNote = useCallback(
		(section: SheetNoteSection, value: string) => {
			useCharacterSheetUiStore.getState().setSectionNote(section, value);
		},
		[],
	);

	const onAddCondition = useCallback(
		async (
			id: string,
			condition: string,
			updateCharacter: ReturnType<typeof useUpdateCharacter>,
			ascendantTools: ReturnType<typeof useAscendantTools>,
		) => {
			const current = (query.data as CharacterSheetState) || defaultState;
			const entry = {
				id: crypto.randomUUID(),
				conditionName: condition,
				sourceType: "manual" as const,
				sourceId: null,
				sourceName: "Manual",
				appliedAt: new Date().toISOString(),
				durationRounds: null,
				remainingRounds: null,
				concentrationSpellId: null,
				isActive: true,
			};

			const updatedConditions = [
				...(current.resources.conditions || []),
				entry,
			];

			// Update character sheet state (structured data)
			await saveSheetState({
				resources: {
					...current.resources,
					conditions: updatedConditions,
				},
			});

			// Sync names to legacy characters table
			updateCharacter.mutate({
				id,
				data: {
					conditions: updatedConditions.map((c) => c.conditionName),
				},
			});

			ascendantTools
				.trackConditionChange(id, condition, "add")
				.catch(console.error);
		},
		[query.data, saveSheetState],
	);

	const onRemoveCondition = useCallback(
		async (
			id: string,
			conditionId: string,
			updateCharacter: ReturnType<typeof useUpdateCharacter>,
			ascendantTools: ReturnType<typeof useAscendantTools>,
		) => {
			const current = (query.data as CharacterSheetState) || defaultState;
			const conditions = current.resources.conditions || [];
			const removed = conditions.find((c) => c.id === conditionId);
			const updated = conditions.filter((c) => c.id !== conditionId);

			// Update character sheet state (structured data)
			await saveSheetState({
				resources: {
					...current.resources,
					conditions: updated,
				},
			});

			// Sync names to legacy characters table
			updateCharacter.mutate({
				id,
				data: {
					conditions: updated.map((c) => c.conditionName),
				},
			});

			if (removed) {
				ascendantTools
					.trackConditionChange(id, removed.conditionName, "remove")
					.catch(console.error);
			}
		},
		[query.data, saveSheetState],
	);

	const onExhaustionChange = useCallback(
		async (
			id: string,
			delta: number,
			currentExhaustion: number,
			updateCharacter: ReturnType<typeof useUpdateCharacter>,
			ascendantTools: ReturnType<typeof useAscendantTools>,
		) => {
			const newLevel = Math.max(0, Math.min(6, currentExhaustion + delta));
			updateCharacter.mutate({ id, data: { exhaustion_level: newLevel } });
			const action = delta > 0 ? "add" : "remove";
			ascendantTools
				.trackConditionChange(id, "Exhaustion", action)
				.catch(console.error);
		},
		[],
	);

	const handleResourceAdjust = useCallback(
		async (
			id: string,
			field: string,
			delta: number,
			currentValue: number,
			maxValue: number,
			updateCharacter: ReturnType<typeof useUpdateCharacter>,
			ascendantTools: ReturnType<typeof useAscendantTools>,
		) => {
			const nextValue = Math.max(0, Math.min(maxValue, currentValue + delta));
			updateCharacter.mutate({ id, data: { [field]: nextValue } });
			if (delta < 0) {
				const label = field === "hit_dice_current" ? "Hit Dice" : "Rift Favor";
				ascendantTools
					.trackCustomFeatureUsage(id, label, "used", "RA")
					.catch(console.error);
			}
		},
		[],
	);

	const handleShortRest = useCallback(
		async (
			id: string,
			queryClient: QueryClient,
			applyRestResourceUpdates: (type: "short" | "long") => Promise<void>,
			ascendantTools: ReturnType<typeof useAscendantTools>,
			toast: ReturnType<typeof useToast>["toast"],
		) => {
			const { executeShortRest } = await import("@/lib/restSystem");
			await executeShortRest(id);
			queryClient.invalidateQueries({ queryKey: ["character", id] });
			queryClient.invalidateQueries({ queryKey: ["features", id] });
			// Pact slots + per-ability uses recharge on a short rest — refresh
			// their queries or the restored values don't render until refocus.
			queryClient.invalidateQueries({ queryKey: ["spell-slots", id] });
			queryClient.invalidateQueries({ queryKey: ["character-features", id] });
			queryClient.invalidateQueries({ queryKey: ["powers", id] });
			queryClient.invalidateQueries({ queryKey: ["character-spells", id] });
			queryClient.invalidateQueries({ queryKey: ["character-techniques", id] });
			await applyRestResourceUpdates("short");

			ascendantTools
				.trackCustomFeatureUsage(id, "Short Rest", "completed", "RA")
				.catch(console.error);

			toast({
				title: "Short rest completed",
				description: "Short-rest features recharged.",
			});
		},
		[],
	);

	const handleLongRest = useCallback(
		async (
			id: string,
			queryClient: QueryClient,
			applyRestResourceUpdates: (type: "short" | "long") => Promise<void>,
			ascendantTools: ReturnType<typeof useAscendantTools>,
			currentHp: number,
			maxHp: number,
			exhaustion: number,
			toast: ReturnType<typeof useToast>["toast"],
		) => {
			const { executeLongRest } = await import("@/lib/restSystem");
			const result = await executeLongRest(id);
			queryClient.invalidateQueries({ queryKey: ["character", id] });
			queryClient.invalidateQueries({ queryKey: ["features", id] });
			// Slots + per-ability uses reset on a long rest — refresh their
			// queries or the restored values don't render until refocus. The
			// plural list keeps HUD/action-card consumers in sync with hp/HD.
			queryClient.invalidateQueries({ queryKey: ["spell-slots", id] });
			queryClient.invalidateQueries({ queryKey: ["character-features", id] });
			queryClient.invalidateQueries({ queryKey: ["powers", id] });
			queryClient.invalidateQueries({ queryKey: ["character-spells", id] });
			queryClient.invalidateQueries({ queryKey: ["character-techniques", id] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			await applyRestResourceUpdates("long");

			const hpHealed = maxHp - currentHp;
			if (hpHealed > 0)
				ascendantTools
					.trackHealthChange(id, hpHealed, "healing")
					.catch(console.error);
			if (exhaustion > 0)
				ascendantTools
					.trackConditionChange(id, "Exhaustion", "remove")
					.catch(console.error);

			ascendantTools
				.trackCustomFeatureUsage(id, "Hit Dice", "restored", "RA")
				.catch(console.error);
			ascendantTools
				.trackCustomFeatureUsage(id, "Rift Favor", "restored", "RA")
				.catch(console.error);

			toast({
				title: "Long rest completed",
				description:
					"All resources restored. Features recharged. Exhaustion reduced by 1.",
			});
			if (result?.questAssignmentError)
				toast({
					title: "Daily quests not assigned",
					description: result.questAssignmentError,
					variant: "destructive",
				});
		},
		[],
	);

	// Subscribe to the UI store only when this instance manages it (the editable
	// sheet). Non-managing instances select `null`/`false` so store changes never
	// re-render them, and they keep reading the server `ui` from React Query.
	const storeModals = useCharacterSheetUiStore((s) =>
		manageUiStore ? s.modals : null,
	);
	const storeActiveTab = useCharacterSheetUiStore((s) =>
		manageUiStore ? s.activeTab : null,
	);
	const storeSectionNotes = useCharacterSheetUiStore((s) =>
		manageUiStore ? s.sectionNotes : null,
	);
	const storeHydrated = useCharacterSheetUiStore((s) =>
		manageUiStore ? s.hydrated : false,
	);

	const serverState = (query.data as CharacterSheetState) || defaultState;

	useSheetUiPersistence(
		characterId,
		(query.data as CharacterSheetState | undefined)?.ui,
		saveSheetState,
		manageUiStore,
	);

	const state = useMemo<CharacterSheetState>(
		() =>
			manageUiStore && storeHydrated && storeModals
				? {
						resources: serverState.resources,
						customModifiers: serverState.customModifiers,
						ui: {
							modals: storeModals,
							activeTab: storeActiveTab ?? "actions",
							sectionNotes: storeSectionNotes ?? {},
						},
					}
				: serverState,
		[
			manageUiStore,
			serverState,
			storeHydrated,
			storeModals,
			storeActiveTab,
			storeSectionNotes,
		],
	);

	return useMemo(
		() => ({
			state,
			isLoading: query.isLoading,
			isSaving: updateSheetState.isPending,
			saveSheetState,
			setModal,
			setActiveTab,
			setSectionNote,
			onAddCondition,
			onRemoveCondition,
			onExhaustionChange,
			handleResourceAdjust,
			handleShortRest,
			handleLongRest,
		}),
		[
			state,
			query.isLoading,
			updateSheetState.isPending,
			saveSheetState,
			setModal,
			setActiveTab,
			setSectionNote,
			onAddCondition,
			onRemoveCondition,
			onExhaustionChange,
			handleResourceAdjust,
			handleShortRest,
			handleLongRest,
		],
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
