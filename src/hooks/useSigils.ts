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
import {
	addLocalSigilInscription,
	isLocalCharacterId,
	listLocalEquipment,
	listLocalSigilInscriptions,
	removeLocalSigilInscription,
} from "@/lib/guestStore";
import { validateSigilInscription } from "@/lib/sigilAutomation";
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
			if (isLocalCharacterId(characterId)) {
				const rows = listLocalSigilInscriptions(characterId).filter(
					(row) => row.is_active,
				);
				if (rows.length === 0)
					return rows as Array<
						CharacterSigilInscriptionRow & {
							sigil?: SigilRow;
							equipment?: unknown;
						}
					>;

				const canonicalSigils = await listCanonicalEntries("sigils");
				const sigilById = new Map(
					canonicalSigils.map((entry) => [entry.id, entry]),
				);
				const equipmentById = new Map(
					listLocalEquipment(characterId).map((entry) => [entry.id, entry]),
				);

				return rows.map((row) => ({
					...row,
					sigil: sigilById.get(row.sigil_id) as unknown as SigilRow | undefined,
					equipment: equipmentById.get(row.equipment_id),
				}));
			}

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
			if (isLocalCharacterId(input.characterId)) {
				const equipment = listLocalEquipment(input.characterId).find(
					(row) => row.id === input.equipmentId,
				);
				if (!equipment) throw new Error("Equipment not found");
				const sigil = (await listCanonicalEntries("sigils")).find(
					(entry) => entry.id === input.sigilId,
				);
				if (!sigil) throw new Error("Sigil not found");
				const validation = validateSigilInscription({
					equipment,
					sigil,
					slotIndex: input.slotIndex,
					existingInscriptions: listLocalSigilInscriptions(input.characterId),
				});
				if (!validation.allowed) throw new Error(validation.reason);
				addLocalSigilInscription(input.characterId, {
					equipment_id: input.equipmentId,
					sigil_id: input.sigilId,
					slot_index: input.slotIndex,
					is_active: true,
				});
				return;
			}

			const campaignId = await getCharacterCampaignId(input.characterId);
			const { data: equipment, error: equipmentError } = await supabase
				.from("character_equipment")
				.select("*")
				.eq("character_id", input.characterId)
				.eq("id", input.equipmentId)
				.maybeSingle();
			if (equipmentError) throw equipmentError;
			if (!equipment) throw new Error("Equipment not found");
			const { data: existingInscriptions, error: inscriptionsError } =
				await supabase
					.from("character_sigil_inscriptions")
					.select("equipment_id, slot_index, is_active")
					.eq("character_id", input.characterId)
					.eq("equipment_id", input.equipmentId)
					.eq("is_active", true);
			if (inscriptionsError) throw inscriptionsError;
			const sigil = (
				await listCanonicalEntries("sigils", undefined, { campaignId })
			).find((entry) => entry.id === input.sigilId);
			if (!sigil) throw new Error("Sigil not found");
			const validation = validateSigilInscription({
				equipment,
				sigil,
				slotIndex: input.slotIndex,
				existingInscriptions: existingInscriptions ?? [],
			});
			if (!validation.allowed) throw new Error(validation.reason);

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
			if (isLocalCharacterId(input.characterId)) {
				removeLocalSigilInscription(input.inscriptionId);
				return;
			}

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
