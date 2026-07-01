import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SandboxNPC } from "@/data/compendium/sandbox-npcs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import {
	abilitiesFromNpc,
	GUILD_ALLY_EXTRA_TYPE,
	leveledCompanionHp,
} from "@/lib/companions";

type CharacterExtra = Database["public"]["Tables"]["character_extras"]["Row"];
type CharacterExtraInsert =
	Database["public"]["Tables"]["character_extras"]["Insert"];

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
		mutationFn: async (newExtra: CharacterExtraInsert) => {
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

/**
 * Carry a recruited guild NPC onto a character sheet as a combat-ready ally
 * Companion. Snapshots the NPC's leveled stats + key abilities into a
 * `character_extras` row and records provenance (npc/guild/member ids) so a
 * future "re-sync from guild" is possible. The unique
 * `(character_id, npc_id)` index prevents adding the same ally twice.
 */
export function useAddGuildAllyCompanion() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (params: {
			characterId: string;
			npc: SandboxNPC;
			/** Current guild level of the recruit (defaults to the NPC's base level). */
			level?: number;
			guildId?: string;
			memberId?: string;
		}) => {
			const { characterId, npc } = params;
			const level = params.level ?? npc.level;
			const hp = leveledCompanionHp(npc, level);
			const note = [npc.title, npc.rank ? `Rank ${npc.rank}` : null]
				.filter(Boolean)
				.join(" · ");

			const { data, error } = await supabase
				.from("character_extras")
				.insert({
					character_id: characterId,
					extra_type: GUILD_ALLY_EXTRA_TYPE,
					name: npc.name,
					hp_current: hp,
					hp_max: hp,
					ac: npc.ac,
					speed: 30,
					is_active: false,
					monster_id: null,
					notes: note || null,
					npc_id: npc.id,
					source_guild_id: params.guildId ?? null,
					source_member_id: params.memberId ?? null,
					npc_data: JSON.parse(JSON.stringify(npc)) as Json,
					abilities: abilitiesFromNpc(npc) as unknown as Json,
					equipment: [] as unknown as Json,
					conditions: [] as unknown as Json,
					initiative: null,
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character_extras", variables.characterId],
			});
			toast({
				title: "Ally added to sheet",
				description: `${variables.npc.name} joined the character's Companions.`,
			});
		},
		onError: (error: Error, variables) => {
			const msg = String(error.message ?? "").toLowerCase();
			const duplicate =
				msg.includes("duplicate key") ||
				msg.includes("idx_character_extras_character_npc") ||
				msg.includes("unique");
			toast({
				title: "Could not add ally",
				description: duplicate
					? `${variables.npc.name} is already on that character's sheet.`
					: error.message,
				variant: "destructive",
			});
		},
	});
}
