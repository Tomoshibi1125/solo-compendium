import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
	type CanonicalCastableEntry,
	findCanonicalCastableByName,
	listCanonicalSpells,
} from "@/lib/canonicalCompendium";
import {
	addLocalSpell,
	isLocalCharacterId,
	listLocalSpells,
	removeLocalSpell,
	updateLocalSpell,
} from "@/lib/guestStore";
import {
	getCharacterCampaignId,
	isSourcebookAccessible,
} from "@/lib/sourcebookAccess";

type SpellRow = Database["public"]["Tables"]["character_spells"]["Row"];
type SpellInsert = Database["public"]["Tables"]["character_spells"]["Insert"];
type SpellUpdate = Database["public"]["Tables"]["character_spells"]["Update"];

export interface CharacterSpell extends SpellRow {
	spell?: CanonicalCastableEntry;
}

async function hydrateCharacterSpells(
	rows: SpellRow[],
	campaignId?: string | null,
): Promise<CharacterSpell[]> {
	if (rows.length === 0) return [];

	const names = new Set(rows.map((row) => row.name).filter(Boolean));
	const [allSpells, accessibleSpells] = await Promise.all([
		listCanonicalSpells(),
		listCanonicalSpells(undefined, { campaignId }),
	]);
	const allByName = new Map<string, CanonicalCastableEntry>();
	for (const entry of allSpells) {
		if (names.has(entry.name)) allByName.set(entry.name, entry);
	}
	const accessibleByName = new Map<string, CanonicalCastableEntry>();
	for (const entry of accessibleSpells) {
		if (names.has(entry.name)) accessibleByName.set(entry.name, entry);
	}

	return rows
		.filter((row) => !allByName.has(row.name) || accessibleByName.has(row.name))
		.map((row) => ({
			...row,
			spell: accessibleByName.get(row.name),
		}));
}

export const useSpells = (characterId: string) => {
	const queryClient = useQueryClient();

	const { data: spells = [], isLoading } = useQuery({
		queryKey: ["character-spells", characterId],
		queryFn: async (): Promise<CharacterSpell[]> => {
			if (isLocalCharacterId(characterId)) {
				return hydrateCharacterSpells(listLocalSpells(characterId));
			}

			const { data, error } = await supabase
				.from("character_spells")
				.select("*")
				.eq("character_id", characterId)
				.order("display_order", { ascending: true })
				.order("spell_level", { ascending: true })
				.order("name", { ascending: true });

			if (error) throw error;
			const campaignId = await getCharacterCampaignId(characterId);
			return hydrateCharacterSpells((data || []) as SpellRow[], campaignId);
		},
		enabled: !!characterId,
	});

	const addSpell = useMutation({
		mutationFn: async (spell: SpellInsert) => {
			if (isLocalCharacterId(characterId)) {
				return addLocalSpell(characterId, spell);
			}

			const campaignId = await getCharacterCampaignId(characterId);
			const canonicalEntry = await findCanonicalCastableByName(
				spell.name,
				undefined,
				["spells"],
			);

			if (
				canonicalEntry &&
				!(await isSourcebookAccessible(canonicalEntry.source_book, {
					campaignId,
				}))
			) {
				throw new Error("This spell requires sourcebook access.");
			}

			const { data, error } = await supabase
				.from("character_spells")
				.insert({ ...spell, character_id: characterId })
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-spells", characterId],
			});
		},
	});

	const updateSpell = useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: SpellUpdate;
		}) => {
			if (isLocalCharacterId(characterId)) {
				updateLocalSpell(id, updates);
				return null;
			}

			const { data, error } = await supabase
				.from("character_spells")
				.update(updates)
				.eq("id", id)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-spells", characterId],
			});
		},
	});

	const removeSpell = useMutation({
		mutationFn: async (id: string) => {
			if (isLocalCharacterId(characterId)) {
				removeLocalSpell(id);
				return null;
			}

			const { error } = await supabase
				.from("character_spells")
				.delete()
				.eq("id", id);
			if (error) throw error;
			return null;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-spells", characterId],
			});
		},
	});

	return {
		spells,
		isLoading,
		addSpell,
		updateSpell,
		removeSpell,
	};
};
