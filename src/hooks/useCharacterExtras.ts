import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type CharacterExtra = Database["public"]["Tables"]["character_extras"]["Row"];

type CharacterExtraWithAnomaly = CharacterExtra & {
	Anomaly?:
		| (Database["public"]["Tables"]["compendium_Anomalies"]["Row"] & {
				actions?: Database["public"]["Tables"]["compendium_monster_actions"]["Row"][];
		  })
		| null;
};

export function useCharacterExtras(characterId: string) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: extras = [], isLoading } = useQuery({
		queryKey: ["character_extras", characterId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("character_extras")
				.select(`
          *,
          Anomaly:compendium_Anomalies(
            *,
            actions:compendium_monster_actions(*)
          )
        `)
				.eq("character_id", characterId)
				.order("created_at", { ascending: true });

			if (error) {
				toast({
					title: "Error loading extras",
					description: error.message,
					variant: "destructive",
				});
				return [];
			}

			return data as CharacterExtraWithAnomaly[];
		},
		enabled: !!characterId,
	});

	const addExtra = useMutation({
		mutationFn: async (
			newExtra: Omit<CharacterExtra, "id" | "created_at" | "updated_at">,
		) => {
			const { data, error } = await supabase
				.from("character_extras")
				.insert(newExtra)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character_extras", characterId],
			});
			toast({ title: "Extra added" });
		},
		onError: (error) => {
			toast({
				title: "Failed to add extra",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const updateExtra = useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: Partial<CharacterExtra>;
		}) => {
			const { data: updated, error } = await supabase
				.from("character_extras")
				.update(data)
				.eq("id", id)
				.select()
				.single();

			if (error) throw error;
			return updated;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character_extras", characterId],
			});
		},
		onError: (error) => {
			toast({
				title: "Failed to update extra",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const removeExtra = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase
				.from("character_extras")
				.delete()
				.eq("id", id);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character_extras", characterId],
			});
			toast({ title: "Extra removed" });
		},
		onError: (error) => {
			toast({
				title: "Failed to remove extra",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	return {
		extras,
		isLoading,
		addExtra: addExtra.mutateAsync,
		updateExtra: updateExtra.mutateAsync,
		removeExtra: removeExtra.mutateAsync,
	};
}
