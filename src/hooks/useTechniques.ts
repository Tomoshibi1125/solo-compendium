import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
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

				// Fetch compendium info for local techs
				const { data: compendiumData, error: compError } = await supabase
					.from("compendium_techniques")
					.select("*")
					.in(
						"id",
						localTechs.map((t) => t.technique_id),
					);

				if (compError) throw compError;

				return localTechs.map((t) => ({
					...t,
					technique: compendiumData?.find((ct) => ct.id === t.technique_id),
				}));
			}

			const { data, error } = await supabase
				.from("character_techniques")
				.select(`
					*,
					technique:compendium_techniques(*)
				`)
				.eq("character_id", characterId);

			if (error) throw error;
			return data as CharacterTechnique[];
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
