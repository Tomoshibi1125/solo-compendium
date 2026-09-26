/**
 * useTamedAnomalies — the party's tamed-anomaly roster (campaign-scoped),
 * wiring campaign_tamed_anomalies + its existing RPCs. C1 layers stable
 * companion-instance identity over the legacy row while preserving the row's
 * current taming/controller fields for compatibility.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import {
	indexCompanionInstances,
	resolveCompanionEffectiveStats,
	type CompanionInstanceRecord,
	type EffectiveCompanionStats,
} from "@/lib/companionInstances";
import { createCanonicalCompanionSource } from "@/lib/companions";

export interface TamedAnomalyRow {
	id: string;
	campaign_id: string;
	anomaly_id: string;
	companion_instance_id: string;
	nickname: string | null;
	current_hp: number;
	max_hp_override: number | null;
	bond_level: number;
	current_controller_character_id: string | null;
	primary_handler_character_id: string | null;
	tamed_by_character_id: string | null;
	is_summoned: boolean;
	companion_instance?: CompanionInstanceRecord | null;
	effective_stats?: EffectiveCompanionStats | null;
	anomaly?: AnomalyCatalogEntry;
}

export interface AnomalyCatalogEntry {
	id: string;
	name: string;
	hp: number;
	ac: number;
	speed: number;
	rank: string;
}

const KEY = (campaignId: string) => ["campaign-tamed-anomalies", campaignId];

/** Taming DC derived from the anomaly's gate-rank (legacy C2 predecessor). */
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
					ac: Number(rec.armor_class ?? 10) || 10,
					speed: Number(rec.speed_walk ?? 30) || 30,
					rank: String(rec.gate_rank ?? rec.rank ?? "D"),
				});
			}
			return map;
		},
	});
}

async function loadInstances(ids: readonly string[]) {
	const unique = Array.from(new Set(ids.filter(Boolean)));
	if (unique.length === 0) return [] as CompanionInstanceRecord[];
	const { data, error } = await supabase
		.from("companion_instances" as never)
		.select("*")
		.in("id", unique);
	if (error) throw error;
	return (data ?? []) as unknown as CompanionInstanceRecord[];
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
			const rows = (data ?? []) as unknown as TamedAnomalyRow[];
			const instances = await loadInstances(
				rows.map((row) => row.companion_instance_id),
			);
			const byId = indexCompanionInstances(instances);
			const map = catalog.data;
			return rows.map((row) => {
				const anomaly = map?.get(row.anomaly_id);
				const instance = byId.get(row.companion_instance_id) ?? null;
				const liveFallback = anomaly
					? {
							name: anomaly.name,
							hpMax: anomaly.hp,
							baseAc: anomaly.ac,
							speed: anomaly.speed,
							rank: anomaly.rank,
						}
					: null;
				return {
					...row,
					anomaly,
					companion_instance: instance,
					effective_stats: instance
						? resolveCompanionEffectiveStats(
								instance,
								{
									nickname: row.nickname,
									currentHp: row.current_hp,
									hpMax: row.max_hp_override,
								},
								liveFallback,
							)
						: null,
				};
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
	const catalog = useAnomalyCatalog();
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
			const anomaly = catalog.data?.get(input.anomalyId);
			if (!anomaly) {
				throw new Error("The canonical Anomaly source could not be resolved.");
			}
			const sourceSnapshot = createCanonicalCompanionSource({
				canonicalId: anomaly.id,
				canonicalType: "anomaly",
				canonicalCollection: "anomalies",
				entryType: "anomaly",
				source: null,
				sourceBook: null,
				name: anomaly.name,
				hpMax: anomaly.hp,
				baseAc: anomaly.ac,
				speed: anomaly.speed,
				rank: anomaly.rank,
			});
			const { data, error } = await (supabase.rpc as unknown as RpcClient)(
				"attempt_taming_with_source",
				{
					p_campaign_id: input.campaignId,
					p_character_id: input.characterId,
					p_anomaly_id: input.anomalyId,
					p_roll_total: input.rollTotal,
					p_dc: input.dc,
					p_initial_hp: input.initialHp,
					p_source_snapshot: sourceSnapshot as unknown as Json,
					p_bond_initial: input.bondInitial ?? 1,
					p_nickname: input.nickname ?? null,
				},
			);
			if (error) throw new Error(error.message);
			return data as string | null;
		},
		onSuccess: (id, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			qc.invalidateQueries({
				queryKey: ["character-companion-instances", v.characterId],
			});
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
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			qc.invalidateQueries({
				queryKey: ["character-companion-instances", v.characterId],
			});
		},
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
