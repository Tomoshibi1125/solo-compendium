/**
 * useCampaignVehicles — campaign-level vehicle roster (the party's shared
 * vehicles), distinct from personal character vehicles (useVehicles.ts) and
 * from Warden item delivery. Persists instance state in `campaign_vehicles`
 * (nickname, current HP, notes); stats hydrate from the canonical vehicle
 * catalog (`allVehicles`). Wires the previously-orphaned campaign_vehicles table.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allVehicles } from "@/data/compendium/vehicles";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { CompendiumVehicle } from "@/types/compendium";

const vehicleById = new Map<string, CompendiumVehicle>(
	allVehicles.map((v) => [v.id, v]),
);

/** Catalog for the Warden's add-vehicle picker. */
export const campaignVehicleCatalog = allVehicles;

const KEY = (campaignId: string) => ["campaign-vehicles", campaignId] as const;

export interface CampaignVehicleRow {
	id: string;
	campaign_id: string;
	vehicle_id: string;
	nickname: string | null;
	current_hp: number;
	max_hp_override: number | null;
	notes: string | null;
	vehicle?: CompendiumVehicle;
}

export function campaignVehicleMaxHp(row: CampaignVehicleRow): number {
	return row.max_hp_override ?? row.vehicle?.hit_points?.max ?? row.current_hp;
}

export function useCampaignVehicles(campaignId: string | undefined) {
	return useQuery({
		queryKey: KEY(campaignId ?? ""),
		enabled: !!campaignId && isSupabaseConfigured,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("campaign_vehicles")
				.select("*")
				.eq("campaign_id", campaignId as string)
				.order("created_at", { ascending: true });
			if (error) throw error;
			return (data ?? []).map((r) => {
				const row = r as unknown as CampaignVehicleRow;
				return { ...row, vehicle: vehicleById.get(row.vehicle_id) };
			});
		},
	});
}

export function useAddCampaignVehicle() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			vehicleId: string;
			nickname?: string;
		}) => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const maxHp = vehicleById.get(input.vehicleId)?.hit_points?.max ?? 30;
			const { error } = await supabase.from("campaign_vehicles").insert({
				campaign_id: input.campaignId,
				vehicle_id: input.vehicleId,
				nickname: input.nickname?.trim() || null,
				current_hp: maxHp,
			});
			if (error) throw error;
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Vehicle added to the campaign fleet." });
		},
		onError: (e) =>
			toast({
				title: "Failed to add vehicle",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
}

export function useUpdateCampaignVehicleHP() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			id: string;
			currentHp: number;
		}) => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const { error } = await supabase
				.from("campaign_vehicles")
				.update({ current_hp: Math.max(0, input.currentHp) })
				.eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_, v) => qc.invalidateQueries({ queryKey: KEY(v.campaignId) }),
		onError: (e) =>
			toast({
				title: "Failed to update vehicle HP",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
}

export function useDeleteCampaignVehicle() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: { campaignId: string; id: string }) => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const { error } = await supabase
				.from("campaign_vehicles")
				.delete()
				.eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Vehicle removed from the fleet." });
		},
		onError: (e) =>
			toast({
				title: "Failed to remove vehicle",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
}
