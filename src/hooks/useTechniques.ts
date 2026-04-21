import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import {
	addLocalTechnique,
	isLocalCharacterId,
	listLocalTechniques,
	removeLocalTechnique,
} from "@/lib/guestStore";

export type TechniqueRow =
	Database["public"]["Tables"]["character_techniques"]["Row"];
export type CompendiumTechnique =
	Database["public"]["Tables"]["compendium_techniques"]["Row"];

export interface CharacterTechnique extends TechniqueRow {
	technique?: CompendiumTechnique;
}

async function hydrateTechniquesById(
	ids: string[],
): Promise<Map<string, CompendiumTechnique>> {
	if (ids.length === 0) return new Map();
	const entries = await listCanonicalEntries("techniques");
	const byId = new Map<string, CompendiumTechnique>();
	for (const entry of entries) {
		if (ids.includes(entry.id)) {
			byId.set(entry.id, entry as unknown as CompendiumTechnique);
		}
	}
	return byId;
}

/**
 * Hook to manage character techniques
 */
export const useTechniques = (characterId: string) => {
	const queryClient = useQueryClient();

	const { data: techniques, isLoading } = useQuery({
		queryKey: ["character-techniques", characterId],
		queryFn: async (): Promise<CharacterTechnique[]> => {
			if (isLocalCharacterId(characterId)) {
				const localTechs = listLocalTechniques(characterId);
				const byId = await hydrateTechniquesById(
					localTechs.map((t) => t.technique_id),
				);
				return localTechs.map((t) => ({
					...t,
					technique: byId.get(t.technique_id),
				}));
			}

			const { data, error } = await supabase
				.from("character_techniques")
				.select("*")
				.eq("character_id", characterId);

			if (error) throw error;
			const rows = (data || []) as TechniqueRow[];
			const byId = await hydrateTechniquesById(rows.map((r) => r.technique_id));
			return rows.map((row) => ({
				...row,
				technique: byId.get(row.technique_id),
			}));
		},
		enabled: !!characterId,
	});

	const addTechnique = useMutation({
		mutationFn: async (techniqueId: string) => {
			if (isLocalCharacterId(characterId)) {
				return addLocalTechnique(characterId, { technique_id: techniqueId });
			}

			const { data, error } = await supabase
				.from("character_techniques")
				.insert({
					character_id: characterId,
					technique_id: techniqueId,
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-techniques", characterId],
			});
		},
	});

	const removeTechnique = useMutation({
		mutationFn: async (id: string) => {
			if (isLocalCharacterId(characterId)) {
				return removeLocalTechnique(id);
			}

			const { error } = await supabase
				.from("character_techniques")
				.delete()
				.eq("id", id);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-techniques", characterId],
			});
		},
	});

	return {
		techniques,
		isLoading,
		addTechnique,
		removeTechnique,
	};
};

/**
 * Hook to browse all techniques in the compendium
 */
export const useCompendiumTechniques = () => {
	return useQuery({
		queryKey: ["compendium-techniques"],
		queryFn: async () => {
			const entries = await listCanonicalEntries("techniques");
			return entries
				.slice()
				.sort((a, b) =>
					a.name.localeCompare(b.name),
				) as unknown as CompendiumTechnique[];
		},
	});
};
