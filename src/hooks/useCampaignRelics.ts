/**
 * useCampaignRelics — the campaign's shared relic vault. Wardens add relics
 * from the catalog; the party sees them read-only. Distinct from personal
 * inventory and from Warden item delivery. Wires the previously-orphaned
 * `campaign_relic_instances` table (member-binding is a later enhancement).
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	comprehensiveRelics,
	type Relic,
} from "@/data/compendium/relics-comprehensive";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

const relicById = new Map<string, Relic>(
	comprehensiveRelics.map((r) => [r.id, r]),
);

/** Catalog for the Warden's add-relic picker. */
export const campaignRelicCatalog = comprehensiveRelics;

const KEY = (campaignId: string) => ["campaign-relics", campaignId] as const;

export interface CampaignRelicRow {
	id: string;
	campaign_id: string;
	relic_id: string | null;
	name: string;
	rarity: string | null;
	value_credits: number | null;
	tradeable: boolean;
	bound_to_member_id: string | null;
	properties: Json;
	relic?: Relic;
}

export function useCampaignRelics(campaignId: string | undefined) {
	return useQuery({
		queryKey: KEY(campaignId ?? ""),
		enabled: !!campaignId && isSupabaseConfigured,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("campaign_relic_instances")
				.select("*")
				.eq("campaign_id", campaignId as string)
				.order("created_at", { ascending: true });
			if (error) throw error;
			return (data ?? []).map((r) => {
				const row = r as unknown as CampaignRelicRow;
				return {
					...row,
					relic: row.relic_id ? relicById.get(row.relic_id) : undefined,
				};
			});
		},
	});
}

export function useAddCampaignRelic() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: { campaignId: string; relicId: string }) => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const relic = relicById.get(input.relicId);
			if (!relic) throw new Error("Relic not found in catalog.");
			const { error } = await supabase.from("campaign_relic_instances").insert({
				campaign_id: input.campaignId,
				relic_id: relic.id,
				name: relic.name,
				rarity: relic.rarity,
				value_credits: relic.value?.amount ?? relic.cost ?? null,
				properties: (relic.properties ?? {}) as unknown as Json,
			});
			if (error) throw error;
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Relic added to the campaign vault." });
		},
		onError: (e) =>
			toast({
				title: "Failed to add relic",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
}

export function useDeleteCampaignRelic() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: { campaignId: string; id: string }) => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const { error } = await supabase
				.from("campaign_relic_instances")
				.delete()
				.eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Relic removed from the vault." });
		},
		onError: (e) =>
			toast({
				title: "Failed to remove relic",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
}
