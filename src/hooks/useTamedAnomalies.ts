/**
 * Campaign tamed-Anomaly roster and C2 tame/bond adjudication hooks.
 *
 * C1 provides stable living identity. C2 moves all attempt math and retry
 * authority to server RPCs while keeping existing roster/controller fields for
 * compatibility. Client code supplies only dice results plus canonical source
 * identity; it never supplies DC, total, success, PB, or specialization bonus.
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
	/** Empty/unsupported ranks are intentionally preserved for C2 adjudication. */
	rank: string;
}

export type CompanionAttemptOutcome =
	| "success"
	| "failure"
	| "invalid"
	| "already-bonded";

export interface CompanionAttemptResult {
	valid: boolean;
	success?: boolean | null;
	outcome: CompanionAttemptOutcome;
	reason?: string;
	rank?: string | null;
	dc?: number | null;
	selected_roll?: number | null;
	ability?: "PRE";
	ability_modifier?: number;
	proficiency_source_id?: string | null;
	proficiency_bonus?: number;
	specialization_source_id?: string | null;
	specialization_bonus?: number;
	total?: number | null;
	attempt_id?: string | null;
	attempt_chain_id?: string | null;
	retry_of_attempt_id?: string | null;
	tamed_id?: string | null;
	bond_id?: string | null;
	companion_instance_id?: string | null;
	roll_mode?: "normal" | "advantage" | "disadvantage";
}

export interface CompanionAttemptHistoryRow {
	id: string;
	campaign_id: string;
	character_id: string;
	companion_instance_id: string | null;
	target_source_id: string;
	target_rank: string | null;
	attempt_kind: "tame" | "bond";
	attempt_chain_id: string;
	retry_of_attempt_id: string | null;
	adjudication_id: string | null;
	roll_mode: "normal" | "advantage" | "disadvantage";
	roll_primary: number | null;
	roll_secondary: number | null;
	selected_roll: number | null;
	ability: "PRE";
	ability_modifier: number;
	proficiency_source_id: string | null;
	proficiency_bonus: number;
	specialization_source_id: string | null;
	specialization_bonus: number;
	dc: number | null;
	total: number | null;
	outcome: "success" | "failure" | "invalid";
	invalid_reason: string | null;
	created_at: string;
}

export interface CompanionBondRow {
	id: string;
	campaign_id: string;
	companion_instance_id: string;
	character_id: string;
	created_by_attempt_id: string | null;
	bonded_at: string;
	released_at: string | null;
	release_reason: string | null;
	created_at: string;
}

const KEY = (campaignId: string) => ["campaign-tamed-anomalies", campaignId] as const;
const ATTEMPTS_KEY = (campaignId: string) =>
	["companion-bond-attempts", campaignId] as const;
const BONDS_KEY = (campaignId: string) => ["companion-bonds", campaignId] as const;

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
					hp: Number(rec.hit_points_average ?? rec.hit_points ?? rec.hp ?? 1) || 1,
					ac: Number(rec.armor_class ?? rec.ac ?? 10) || 10,
					speed: Number(rec.speed_walk ?? rec.speed ?? 30) || 30,
					// C2 must not silently turn missing/E/unknown rank into D.
					rank: String(rec.gate_rank ?? rec.rank ?? ""),
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

const callRpc: RpcClient = supabase.rpc as unknown as RpcClient;

const parseAttemptResult = (value: unknown): CompanionAttemptResult => {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new Error("Companion attempt returned an invalid response.");
	}
	return value as CompanionAttemptResult;
};

function invalidateC2Campaign(
	queryClient: ReturnType<typeof useQueryClient>,
	campaignId: string,
) {
	queryClient.invalidateQueries({ queryKey: KEY(campaignId) });
	queryClient.invalidateQueries({ queryKey: ATTEMPTS_KEY(campaignId) });
	queryClient.invalidateQueries({ queryKey: BONDS_KEY(campaignId) });
}

export function useTameAnomaly() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const catalog = useAnomalyCatalog();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			characterId: string;
			anomalyId: string;
			rollPrimary: number;
			rollSecondary?: number | null;
			adjudicationId?: string | null;
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
				rank: anomaly.rank || null,
			});
			const { data, error } = await callRpc("resolve_companion_tame_attempt_c2", {
				p_campaign_id: input.campaignId,
				p_character_id: input.characterId,
				p_anomaly_id: input.anomalyId,
				p_source_snapshot: sourceSnapshot as unknown as Json,
				p_roll_primary: input.rollPrimary,
				p_roll_secondary: input.rollSecondary ?? null,
				p_adjudication_id: input.adjudicationId ?? null,
				p_nickname: input.nickname ?? null,
			});
			if (error) throw new Error(error.message);
			return parseAttemptResult(data);
		},
		onSuccess: (result, variables) => {
			invalidateC2Campaign(queryClient, variables.campaignId);
			if (result.companion_instance_id) {
				queryClient.invalidateQueries({
					queryKey: ["companion-instance", result.companion_instance_id],
				});
			}
			if (result.outcome === "success") {
				toast({
					title: "Taming succeeded",
					description: `Total ${result.total ?? "—"} vs DC ${result.dc ?? "—"}.`,
				});
			} else if (result.outcome === "failure") {
				toast({
					title: "Taming failed",
					description: `Total ${result.total ?? "—"} vs DC ${result.dc ?? "—"}. A retry requires Warden adjudication.`,
					variant: "destructive",
				});
			} else {
				toast({
					title: "Taming attempt is not valid",
					description: result.reason ?? "This source requires Warden adjudication.",
					variant: "destructive",
				});
			}
		},
		onError: (error: Error) => {
			toast({ title: "Taming failed", description: error.message, variant: "destructive" });
		},
	});
}

export function useBondCompanion() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			characterId: string;
			companionInstanceId: string;
			expectedSourceId: string;
			rollPrimary: number;
			rollSecondary?: number | null;
			adjudicationId?: string | null;
		}) => {
			const { data, error } = await callRpc("resolve_companion_bond_attempt_c2", {
				p_campaign_id: input.campaignId,
				p_character_id: input.characterId,
				p_companion_instance_id: input.companionInstanceId,
				p_expected_source_id: input.expectedSourceId,
				p_roll_primary: input.rollPrimary,
				p_roll_secondary: input.rollSecondary ?? null,
				p_adjudication_id: input.adjudicationId ?? null,
			});
			if (error) throw new Error(error.message);
			return parseAttemptResult(data);
		},
		onSuccess: (result, variables) => {
			invalidateC2Campaign(queryClient, variables.campaignId);
			if (result.outcome === "success" || result.outcome === "already-bonded") {
				toast({
					title: result.outcome === "already-bonded" ? "Bond already active" : "Bond established",
					description:
					result.total != null && result.dc != null
						? `Total ${result.total} vs DC ${result.dc}.`
						: undefined,
				});
			} else if (result.outcome === "failure") {
				toast({
					title: "Bond attempt failed",
					description: `Total ${result.total ?? "—"} vs DC ${result.dc ?? "—"}. A retry requires Warden adjudication.`,
					variant: "destructive",
				});
			} else {
				toast({
					title: "Bond attempt is not valid",
					description: result.reason ?? "Warden adjudication is required.",
					variant: "destructive",
				});
			}
		},
		onError: (error: Error) => {
			toast({ title: "Bond attempt failed", description: error.message, variant: "destructive" });
		},
	});
}

export function usePrepareCompanionAttemptAdjudication() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			characterId: string;
			targetSourceId: string;
			attemptKind: "tame" | "bond";
			companionInstanceId?: string | null;
			rollMode?: "normal" | "advantage" | "disadvantage";
			proficiencyMode?: "default" | "apply" | "suppress";
			specializationMode?: "default" | "apply" | "suppress";
			retryOfAttemptId?: string | null;
			reason?: string | null;
		}) => {
			const { data, error } = await callRpc("prepare_companion_attempt_adjudication", {
				p_campaign_id: input.campaignId,
				p_character_id: input.characterId,
				p_target_source_id: input.targetSourceId,
				p_attempt_kind: input.attemptKind,
				p_companion_instance_id: input.companionInstanceId ?? null,
				p_roll_mode: input.rollMode ?? "normal",
				p_proficiency_mode: input.proficiencyMode ?? "default",
				p_specialization_mode: input.specializationMode ?? "default",
				p_retry_of_attempt_id: input.retryOfAttemptId ?? null,
				p_reason: input.reason ?? null,
			});
			if (error) throw new Error(error.message);
			if (typeof data !== "string" || !data) {
				throw new Error("Adjudication did not return an id.");
			}
			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ATTEMPTS_KEY(variables.campaignId) });
		},
	});
}

export function useCompanionBondAttempts(campaignId: string | undefined) {
	return useQuery({
		queryKey: ATTEMPTS_KEY(campaignId ?? ""),
		enabled: !!campaignId && isSupabaseConfigured,
		queryFn: async (): Promise<CompanionAttemptHistoryRow[]> => {
			if (!campaignId) return [];
			const { data, error } = await supabase
				.from("companion_bond_attempts" as never)
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false })
				.limit(100);
			if (error) throw error;
			return (data ?? []) as unknown as CompanionAttemptHistoryRow[];
		},
	});
}

export function useCompanionBonds(campaignId: string | undefined) {
	return useQuery({
		queryKey: BONDS_KEY(campaignId ?? ""),
		enabled: !!campaignId && isSupabaseConfigured,
		queryFn: async (): Promise<CompanionBondRow[]> => {
			if (!campaignId) return [];
			const { data, error } = await supabase
				.from("companion_bonds" as never)
				.select("*")
				.eq("campaign_id", campaignId)
				.is("released_at", null)
				.order("bonded_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as unknown as CompanionBondRow[];
		},
	});
}

export function useClaimAnomalyController() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			tamedId: string;
			characterId: string;
		}) => {
			const { error } = await callRpc("claim_anomaly_controller", {
				p_tamed_id: input.tamedId,
				p_character_id: input.characterId,
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: (_, variables) => {
			invalidateC2Campaign(queryClient, variables.campaignId);
			queryClient.invalidateQueries({
				queryKey: ["character-companion-instances", variables.characterId],
			});
		},
		onError: (error: Error) =>
			toast({
				title: "Failed to take control",
				description: error.message,
				variant: "destructive",
			}),
	});
}

export function useReleaseAnomalyController() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { campaignId: string; tamedId: string }) => {
			const { error } = await callRpc("release_anomaly_controller", {
				p_tamed_id: input.tamedId,
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: (_, variables) => invalidateC2Campaign(queryClient, variables.campaignId),
	});
}

export function useUpdateTamedAnomalyHP() {
	const queryClient = useQueryClient();
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
		onSuccess: (_, variables) => invalidateC2Campaign(queryClient, variables.campaignId),
	});
}

export function useDeleteTamedAnomaly() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: { campaignId: string; id: string }) => {
			const { error } = await supabase
				.from("campaign_tamed_anomalies")
				.delete()
				.eq("id", input.id);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			invalidateC2Campaign(queryClient, variables.campaignId);
			toast({ title: "Anomaly released from the roster." });
		},
	});
}
