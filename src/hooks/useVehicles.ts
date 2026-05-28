/**
 * useVehicles — character-owned + campaign-owned vehicle hooks.
 *
 * Q7 of Round 3. Mirrors `useShadowSoldiers.ts` shape: list, add, HP,
 * conditions, notes. Vehicle stats hydrate from the canonical
 * compendium entry (`vehicleCatalog[vehicle_id]`); persistence stores
 * only the instance state (nickname, current HP, conditions, notes,
 * crew assignments).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";

export interface CharacterVehicleRow {
	id: string;
	character_id: string;
	vehicle_id: string;
	nickname: string | null;
	current_hp: number;
	max_hp_override: number | null;
	conditions: Array<{ id: string; name: string; source?: string }>;
	notes: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface CampaignVehicleRow {
	id: string;
	campaign_id: string;
	vehicle_id: string;
	nickname: string | null;
	current_hp: number;
	max_hp_override: number | null;
	conditions: Array<{ id: string; name: string; source?: string }>;
	notes: string | null;
	crew_assignments: Record<string, string | null>;
	created_at: string;
	updated_at: string;
}

const CHAR_KEY = (id: string) => ["character-vehicles", id] as const;
const CAMP_KEY = (id: string) => ["campaign-vehicles", id] as const;

export function useCharacterVehicles(characterId: string | undefined) {
	return useQuery({
		queryKey: characterId ? CHAR_KEY(characterId) : ["character-vehicles", "_none"],
		queryFn: async () => {
			if (!characterId || !isSupabaseConfigured)
				return [] as CharacterVehicleRow[];
			const { data, error } = await supabase
				.from("character_vehicles" as never)
				.select("*")
				.eq("character_id", characterId);
			if (error) throw error;
			return (data as unknown as CharacterVehicleRow[]) || [];
		},
		enabled: !!characterId,
	});
}

export function useCampaignVehicles(campaignId: string | undefined) {
	return useQuery({
		queryKey: campaignId ? CAMP_KEY(campaignId) : ["campaign-vehicles", "_none"],
		queryFn: async () => {
			if (!campaignId || !isSupabaseConfigured)
				return [] as CampaignVehicleRow[];
			const { data, error } = await supabase
				.from("campaign_vehicles" as never)
				.select("*")
				.eq("campaign_id", campaignId);
			if (error) throw error;
			return (data as unknown as CampaignVehicleRow[]) || [];
		},
		enabled: !!campaignId,
	});
}

export function useAddCharacterVehicle() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleId: string;
			nickname?: string;
			initialHp: number;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { data, error } = await (
				supabase
					.from("character_vehicles" as never)
					.insert({
						character_id: input.characterId,
						vehicle_id: input.vehicleId,
						nickname: input.nickname ?? null,
						current_hp: input.initialHp,
					} as never)
					.select()
					.single() as unknown as Promise<{
					data: CharacterVehicleRow;
					error: Error | null;
				}>
			);
			if (error) throw error;
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: CHAR_KEY(variables.characterId) });
			toast({ title: "Vehicle added" });
		},
	});
}

export function useUpdateCharacterVehicleHP() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleLinkId: string;
			currentHp: number;
		}) => {
			const { error } = await (
				supabase
					.from("character_vehicles" as never)
					.update({ current_hp: input.currentHp } as never)
					.eq("id", input.vehicleLinkId) as unknown as Promise<{
					error: Error | null;
				}>
			);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: CHAR_KEY(variables.characterId) });
		},
	});
}

export function useDeleteCharacterVehicle() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { characterId: string; vehicleLinkId: string }) => {
			const { error } = await (
				supabase
					.from("character_vehicles" as never)
					.delete()
					.eq("id", input.vehicleLinkId) as unknown as Promise<{
					error: Error | null;
				}>
			);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: CHAR_KEY(variables.characterId) });
		},
	});
}
