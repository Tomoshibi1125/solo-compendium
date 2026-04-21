import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
	CharacterSigilInscriptionRow,
	ExtendedDatabase,
	SigilRow,
} from "@/integrations/supabase/supabaseExtended";

export type { CharacterSigilInscriptionRow, ExtendedDatabase, SigilRow };

// Type-safe client for sigil-related operations is now same as base supabase client
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { isLocalCharacterId } from "@/lib/guestStore";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
} from "@/lib/sourcebookAccess";

export function useCompendiumSigils(characterId?: string) {
	return useQuery({
		queryKey: ["compendium-sigils", characterId ?? "global"],
		queryFn: async () => {
			const campaignId = characterId
				? await getCharacterCampaignId(characterId)
				: null;
			const entries = await listCanonicalEntries("sigils", undefined, {
				campaignId,
			});
			return entries.slice().sort((a, b) => {
				const aLvl = a.rune_level ?? 0;
				const bLvl = b.rune_level ?? 0;
				if (aLvl !== bLvl) return aLvl - bLvl;
				return a.name.localeCompare(b.name);
			}) as unknown as SigilRow[];
		},
	});
}

export function useCharacterSigilInscriptions(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-sigil-inscriptions", characterId],
		queryFn: async () => {
			if (!characterId) return [];
			if (isLocalCharacterId(characterId)) return [];

			const { data, error } = await supabase
				.from("character_sigil_inscriptions")
				.select(`*, equipment:character_equipment(*)`)
				.eq("character_id", characterId)
				.eq("is_active", true);

			if (error) throw error;
			const rows = (data || []) as Array<
				CharacterSigilInscriptionRow & {
					equipment?: unknown;
				}
			>;
			if (rows.length === 0)
				return rows as Array<
					CharacterSigilInscriptionRow & {
						sigil?: SigilRow;
						equipment?: unknown;
					}
				>;

			const campaignId = await getCharacterCampaignId(characterId);
			const canonicalSigils = await listCanonicalEntries("sigils", undefined, {
				campaignId,
			});
			const sigilById = new Map(
				canonicalSigils.map((entry) => [entry.id, entry]),
			);

			const hydrated = rows.map((row) => ({
				...row,
				sigil: sigilById.get(row.sigil_id) as unknown as SigilRow | undefined,
			}));

			return filterRowsBySourcebookAccess(
				hydrated,
				(r) => r.sigil?.source_book,
				{ campaignId },
			);
		},
		enabled: !!characterId,
	});
}

export { useCharacterSigilInscriptions as useSigils };

export function useInscribeSigil() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			equipmentId: string;
			sigilId: string;
			slotIndex: number;
		}) => {
			const { error } = await supabase
				.from("character_sigil_inscriptions")
				.insert({
					character_id: input.characterId,
					equipment_id: input.equipmentId,
					sigil_id: input.sigilId,
					slot_index: input.slotIndex,
					is_active: true,
				});
			if (error) throw error;
		},
		onSuccess: async (_data, vars) => {
			queryClient.invalidateQueries({
				queryKey: ["character-sigil-inscriptions", vars.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character", vars.characterId],
			});
		},
	});
}

export function useRemoveSigil() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			inscriptionId: string;
		}) => {
			const { error } = await supabase
				.from("character_sigil_inscriptions")
				.delete()
				.eq("id", input.inscriptionId);
			if (error) throw error;
		},
		onSuccess: async (_data, vars) => {
			queryClient.invalidateQueries({
				queryKey: ["character-sigil-inscriptions", vars.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character", vars.characterId],
			});
		},
	});
}
