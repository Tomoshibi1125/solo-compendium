import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
	CharacterSigilInscriptionRow,
	ExtendedDatabase,
	Json,
	SigilRow,
} from "@/integrations/supabase/supabaseExtended";

export type { CharacterSigilInscriptionRow, ExtendedDatabase, SigilRow };

import type { SupabaseClient } from "@supabase/supabase-js";
import { isLocalCharacterId } from "@/lib/guestStore";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
} from "@/lib/sourcebookAccess";

interface StaticSigil {
	id: string;
	name: string;
	description: string;
	effect_description?: string;
	rune_type?: string;
	rune_category?: string;
	rune_level?: number;
	rarity?: string;
	effect_type?: string;
	requires_level?: number;
	passive_bonuses?: Json;
	can_inscribe_on?: string[];
	inscription_difficulty?: number;
	image_url?: string;
	tags?: string[];
	source_book?: string;
	created_at: string;
}

// Type-safe client for sigil-related operations
const sigilClient = supabase as unknown as SupabaseClient<ExtendedDatabase>;

export function useCompendiumSigils(characterId?: string) {
	return useQuery({
		queryKey: ["compendium-sigils", characterId ?? "global"],
		queryFn: async () => {
			const { data, error } = await sigilClient
				.from("compendium_sigils")
				.select("*")
				.order("sigil_level", { ascending: true })
				.order("name", { ascending: true });

			if (!error && data && data.length > 0) {
				const campaignId = characterId
					? await getCharacterCampaignId(characterId)
					: null;
				return (await filterRowsBySourcebookAccess(
					data ?? [],
					(row) => row.source_book,
					{ campaignId },
				)) as SigilRow[];
			}

			const { staticDataProvider } = await import(
				"@/data/compendium/staticDataProvider"
			);
			const staticSigils = (await staticDataProvider.getSigils(
				"",
			)) as unknown as StaticSigil[];
			return staticSigils.map((s) => ({
				id: s.id,
				name: s.name,
				description: s.description,
				effect_description: s.effect_description ?? s.description,
				sigil_type: s.rune_type ?? "utility",
				sigil_category: s.rune_category ?? "General",
				sigil_level: s.rune_level ?? 1,
				rarity: s.rarity ?? "common",
				effect_type: s.effect_type ?? "passive",
				requires_level: s.requires_level ?? null,
				passive_bonuses: s.passive_bonuses ?? {},
				can_inscribe_on: s.can_inscribe_on ?? null,
				inscription_difficulty: s.inscription_difficulty ?? null,
				tags: s.tags ?? null,
				image_url: s.image_url ?? null,
				source_book: s.source_book ?? null,
				created_at: s.created_at,
				updated_at: null,
			}));
		},
	});
}

export function useCharacterSigilInscriptions(characterId: string | undefined) {
	return useQuery({
		queryKey: ["character-sigil-inscriptions", characterId],
		queryFn: async () => {
			if (!characterId) return [];
			if (isLocalCharacterId(characterId)) return [];

			const { data, error } = await sigilClient
				.from("character_sigil_inscriptions")
				.select(
					`*, sigil:compendium_sigils(*), equipment:character_equipment(*)`,
				)
				.eq("character_id", characterId)
				.eq("is_active", true);

			if (error) throw error;
			const rows = data || [];

			const campaignId = await getCharacterCampaignId(characterId);
			return await filterRowsBySourcebookAccess(
				rows,
				(r) => r.sigil?.source_book,
				{
					campaignId,
				},
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
			const { error } = await sigilClient
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
			const { error } = await sigilClient
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
