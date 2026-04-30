import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
	type CanonicalCastableEntry,
	isCanonicalCastableAccessible,
	listCanonicalSpells,
} from "@/lib/canonicalCompendium";
import {
	addLocalSpell,
	isLocalCharacterId,
	listLocalSpells,
	removeLocalSpell,
	updateLocalSpell,
} from "@/lib/guestStore";
import { getCharacterCampaignId } from "@/lib/sourcebookAccess";
import { normalizeSpellReference } from "@/lib/spellReference";

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
	const spellIds = new Set(
		rows.map((row) => row.spell_id).filter((id): id is string => Boolean(id)),
	);
	const [allSpells, accessibleSpells] = await Promise.all([
		listCanonicalSpells(),
		listCanonicalSpells(undefined, { campaignId }),
	]);

	const allById = new Map<string, CanonicalCastableEntry>();
	const allByName = new Map<string, CanonicalCastableEntry>();
	for (const entry of allSpells) {
		if (spellIds.has(entry.id)) allById.set(entry.id, entry);
		if (names.has(entry.name)) allByName.set(entry.name, entry);
	}

	const accessibleById = new Map<string, CanonicalCastableEntry>();
	const accessibleByName = new Map<string, CanonicalCastableEntry>();
	for (const entry of accessibleSpells) {
		if (spellIds.has(entry.id)) accessibleById.set(entry.id, entry);
		if (names.has(entry.name)) accessibleByName.set(entry.name, entry);
	}

	return rows
		.filter((row) => {
			const hasCanonicalById = !!row.spell_id && allById.has(row.spell_id);
			const hasCanonicalByName = allByName.has(row.name);
			if (!hasCanonicalById && !hasCanonicalByName) return true;
			if (row.spell_id && accessibleById.has(row.spell_id)) return true;
			return accessibleByName.has(row.name);
		})
		.map((row) => ({
			...row,
			spell:
				(row.spell_id ? accessibleById.get(row.spell_id) : undefined) ??
				accessibleByName.get(row.name),
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
			const canonicalReference = await normalizeSpellReference({
				id: spell.spell_id,
				name: spell.name,
			});
			const spellWithCanonicalId: SpellInsert = {
				...spell,
				spell_id: canonicalReference.spell_id,
			};

			if (isLocalCharacterId(characterId)) {
				return addLocalSpell(characterId, spellWithCanonicalId);
			}

			const campaignId = await getCharacterCampaignId(characterId);

			if (
				spellWithCanonicalId.spell_id &&
				!(await isCanonicalCastableAccessible(
					spellWithCanonicalId.spell_id,
					{ campaignId },
					["spells"],
				))
			) {
				throw new Error("This spell requires sourcebook access.");
			}

			const { data, error } = await supabase
				.from("character_spells")
				.insert({ ...spellWithCanonicalId, character_id: characterId })
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
