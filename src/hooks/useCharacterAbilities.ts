import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import { isLocalCharacterId, setLocalAbilities } from "@/lib/guestStore";
import type { AbilityScore } from "@/types/core-rules";

export const useUpdateCharacterAbilities = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			characterId,
			abilities,
		}: {
			characterId: string;
			abilities: Record<AbilityScore, number>;
		}) => {
			if (isLocalCharacterId(characterId)) {
				setLocalAbilities(characterId, abilities);
				return abilities;
			}

			const rows = Object.entries(abilities).map(([ability, score]) => ({
				character_id: characterId,
				ability: ability as AbilityScore,
				score,
			}));

			const { error } = await supabase
				.from("character_abilities")
				.upsert(rows, { onConflict: "character_id,ability" });

			if (error) {
				logErrorWithContext(error, "useUpdateCharacterAbilities");
				throw error;
			}

			return abilities;
		},
		onSuccess: async (abilities, variables) => {
			queryClient.setQueryData(["character", variables.characterId], (old) => {
				if (!old) return old;
				const previous = old as CharacterWithAbilities;
				return {
					...previous,
					abilities,
				};
			});
			// D&D Beyond parity: auto-recalculate derived stats when abilities change
			if (!isLocalCharacterId(variables.characterId)) {
				queryClient.invalidateQueries({
					queryKey: ["character", variables.characterId],
				});
			}
		},
		onError: (error) => {
			toast({
				title: "Failed to update abilities",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});
};
