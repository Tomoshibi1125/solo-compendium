import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isLocalCharacterId } from "@/lib/guestStore";
import {
	filterRowsBySourcebookAccess,
	getCharacterCampaignId,
} from "@/lib/sourcebookAccess";

export type SigilRow = {
	id: string;
	name: string;
	description: string;
	effect_description: string;
	sigil_type: string;
	sigil_category: string;
	sigil_level: number;
	rarity: string;
	effect_type: string;
	requires_level: number | null;
	passive_bonuses: unknown;
	can_inscribe_on: string[] | null;
	inscription_difficulty: number | null;
	tags: string[] | null;
	image_url: string | null;
	source_book: string | null;
	created_at: string | null;
	updated_at: string | null;
};

export type CharacterSigilInscriptionRow = {
	id: string;
	character_id: string;
	equipment_id: string;
	sigil_id: string;
	slot_index: number;
	is_active: boolean;
	sigil?: SigilRow;
	equipment?: unknown;
};

export function useCompendiumSigils(characterId?: string) {
	return useQuery({
		queryKey: ["compendium-sigils", characterId ?? "global"],
		queryFn: async () => {
			const { data, error } = await (supabase as unknown as any)
				.from("compendium_sigils")
				.select("*")
				.order("sigil_level", { ascending: true })
				.order("name", { ascending: true });

			if (!error && data && data.length > 0) {
				const campaignId = characterId
					? await getCharacterCampaignId(characterId)
					: null;
				return filterRowsBySourcebookAccess(
					(data as unknown as SigilRow[]) ?? [],
					(row) => (row as SigilRow).source_book,
					{ campaignId },
				) as unknown as SigilRow[];
			}

			const { staticDataProvider } = await import(
				"@/data/compendium/staticDataProvider"
			);
			const staticSigils = await staticDataProvider.getSigils("");
			return staticSigils.map((s) => ({
				id: s.id,
				name: s.name,
				description: s.description,
				effect_description:
					(s as unknown as { effect_description?: string }).effect_description ??
					s.description,
				sigil_type: (s as unknown as { rune_type?: string }).rune_type ?? "utility",
				sigil_category: (s as unknown as { rune_category?: string }).rune_category ?? "General",
				sigil_level: (s as unknown as { rune_level?: number }).rune_level ?? 1,
				rarity: s.rarity ?? "common",
				effect_type: (s as unknown as { effect_type?: string }).effect_type ?? "passive",
				requires_level:
					(s as unknown as { requires_level?: number }).requires_level ?? null,
				passive_bonuses:
					(s as unknown as { passive_bonuses?: unknown }).passive_bonuses ?? {},
				can_inscribe_on:
					(s as unknown as { can_inscribe_on?: string[] }).can_inscribe_on ?? null,
				inscription_difficulty:
					(s as unknown as { inscription_difficulty?: number })
						.inscription_difficulty ?? null,
				tags: s.tags ?? null,
				image_url: (s as unknown as { image_url?: string | null }).image_url ?? null,
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

			const { data, error } = await (supabase as unknown as any)
				.from("character_sigil_inscriptions")
				.select(`*, sigil:compendium_sigils(*), equipment:character_equipment(*)`)
				.eq("character_id", characterId)
				.eq("is_active", true);

			if (error) throw error;
			const rows = (data || []) as unknown as CharacterSigilInscriptionRow[];

			const campaignId = await getCharacterCampaignId(characterId);
			return filterRowsBySourcebookAccess(
				rows,
				(r) => r.sigil?.source_book,
				{ campaignId },
			) as unknown as CharacterSigilInscriptionRow[];
		},
		enabled: !!characterId,
	});
}

export function useInscribeSigil() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			equipmentId: string;
			sigilId: string;
			slotIndex: number;
		}) => {
			const { error } = await (supabase as unknown as any)
				.from("character_sigil_inscriptions")
				.insert({
					character_id: input.characterId,
					equipment_id: input.equipmentId,
					sigil_id: input.sigilId,
					slot_index: input.slotIndex,
					is_active: true,
				} as any);
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
		mutationFn: async (input: { characterId: string; inscriptionId: string }) => {
			const { error } = await (supabase as unknown as any)
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
