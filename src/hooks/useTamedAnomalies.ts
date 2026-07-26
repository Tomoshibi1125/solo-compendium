/**
 * useTamedAnomalies — the party's tamed-anomaly roster (campaign-scoped),
 * wiring the previously-orphaned campaign_tamed_anomalies table + its RPCs
 * (attempt_taming / claim_anomaly_controller / release_anomaly_controller).
 * The taming rule lives in src/lib/taming.ts; attempt_taming re-gates on the
 * DC server-side. Anomaly stats hydrate from the canonical anomaly catalog.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

export interface TamedAnomalyRow {
	id: string;
	campaign_id: string;
	anomaly_id: string;
	nickname: string | null;
	current_hp: number;
	max_hp_override: number | null;
	bond_level: number;
	current_controller_character_id: string | null;
	primary_handler_character_id: string | null;
	tamed_by_character_id: string | null;
	is_summoned: boolean;
	anomaly?: AnomalyCatalogEntry;
}

export interface AnomalyCatalogEntry {
	id: string;
	name: string;
	hp: number;
	rank: string;
}

const KEY = (campaignId: string) => ["campaign-tamed-anomalies", campaignId];

/** Taming DC derived from the anomaly's gate-rank (no per-anomaly DC field). */
export function tamingDcForRank(rank: string): number {
	switch (rank.toUpperCase()) {
		case "E":
			return 10;
		case "D":
			return 12;
		case "C":
			return 14;
		case "B":
			return 16;
		case "A":
			return 18;
		case "S":
			return 20;
		default:
			return 13;
	}
}

export function useAnomalyCatalog() {
	return useQuery({
		queryKey: ["anomaly-taming-catalog"],
		staleTime: Number.POSITIVE_INFINITY,
		queryFn: async () => {
			const entries = await listCanonicalEntries("anomalies");
			const map = new Map<string, AnomalyCatalogEntry>();
			for (const e of entries) {
				const rec = e as unknown as Record<string, unknown>;
				map.set(e.id, {
					id: e.id,
					name: e.name,
					hp: Number(rec.hit_points_average ?? rec.hit_points ?? 1) || 1,
					rank: String(rec.gate_rank ?? rec.rank ?? "D"),
				});
			}
			return map;
		},
	});
}

export function useTamedAnomalies(campaignId: string | undefined) {
	const catalog = useAnomalyCatalog();
	return useQuery({
		queryKey: KEY(campaignId ?? ""),
		enabled: !!campaignId && isSupabaseConfigured && catalog.isSuccess,
		queryFn: async () => {
			const { data, error } = await supabase
				.from("campaign_tamed_anomalies")
				.select("*")
				.eq("campaign_id", campaignId as string)
				.order("tamed_at", { ascending: false });
			if (error) throw error;
			const map = catalog.data;
			return (data ?? []).map((r) => {
				const row = r as unknown as TamedAnomalyRow;
				return { ...row, anomaly: map?.get(row.anomaly_id) };
			});
		},
	});
}

type RpcClient = (
	fn: string,
	args: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export function useTameAnomaly() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			characterId: string;
			anomalyId: string;
			rollTotal: number;
			dc: number;
			initialHp: number;
			bondInitial?: number;
			nickname?: string | null;
		}) => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const { data, error } = await (supabase.rpc as unknown as RpcClient)(
				"attempt_taming",
				{
					p_campaign_id: input.campaignId,
					p_character_id: input.characterId,
					p_anomaly_id: input.anomalyId,
					p_roll_total: input.rollTotal,
					p_dc: input.dc,
					p_initial_hp: input.initialHp,
					p_bond_initial: input.bondInitial ?? 1,
					p_nickname: input.nickname ?? null,
				},
			);
			if (error) throw new Error(error.message);
			return data as string | null;
		},
		onSuccess: (id, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast(
				id
					? { title: "Anomaly tamed! It joins the party roster." }
					: {
							title: "Taming failed",
							description: "The roll didn't beat the DC.",
							variant: "destructive",
						},
			);
		},
		onError: (e) =>
			toast({
				title: "Taming failed",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
}

export function useClaimAnomalyController() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			tamedId: string;
			characterId: string;
		}) => {
			const { error } = await (supabase.rpc as unknown as RpcClient)(
				"claim_anomaly_controller",
				{ p_tamed_id: input.tamedId, p_character_id: input.characterId },
			);
			if (error) throw new Error(error.message);
		},
		onSuccess: (_, v) => qc.invalidateQueries({ queryKey: KEY(v.campaignId) }),
		onError: (e) =>
			toast({
				title: "Failed to take control",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
}

export function useReleaseAnomalyController() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input: { campaignId: string; tamedId: string }) => {
			const { error } = await (supabase.rpc as unknown as RpcClient)(
				"release_anomaly_controller",
				{ p_tamed_id: input.tamedId },
			);
			if (error) throw new Error(error.message);
		},
		onSuccess: (_, v) => qc.invalidateQueries({ queryKey: KEY(v.campaignId) }),
	});
}

export function useUpdateTamedAnomalyHP() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			id: string;
			currentHp: number;
		}) => {
			const { error } = await supabase
				.from("campaign_tamed_anomalies")
				.update({ current_hp: Math.max(0, input.currentHp) })
				.eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_, v) => qc.invalidateQueries({ queryKey: KEY(v.campaignId) }),
	});
}

export function useDeleteTamedAnomaly() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: { campaignId: string; id: string }) => {
			const { error } = await supabase
				.from("campaign_tamed_anomalies")
				.delete()
				.eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Anomaly released from the roster." });
		},
	});
}
