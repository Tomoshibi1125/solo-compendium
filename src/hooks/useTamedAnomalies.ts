/**
 * useTamedAnomalies — universal taming substrate hook layer (Q6 of Round 3).
 *
 * Mirrors the shape of `useShadowSoldiers.ts`. The campaign-scoped table
 * (`campaign_tamed_anomalies`) is the primary store; guests / solo
 * characters use `character_tamed_anomalies`.
 *
 * Producer RPCs:
 *   - `attempt_taming` — universal taming check; returns row id or null
 *   - `claim_anomaly_controller` — any party member can claim
 *   - `release_anomaly_controller` — clears the lock
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";

export interface TamedAnomalyRow {
	id: string;
	campaign_id?: string | null;
	character_id?: string | null;
	anomaly_id: string;
	nickname: string | null;
	current_hp: number;
	max_hp_override: number | null;
	bond_level: number;
	conditions: Array<{ id: string; name: string; source?: string }>;
	notes: string | null;
	primary_handler_character_id?: string | null;
	current_controller_character_id?: string | null;
	initiative: number | null;
	tamed_at: string;
	tamed_by_character_id?: string | null;
	is_summoned: boolean;
	created_at: string;
	updated_at: string;
}

const CAMPAIGN_KEY = (campaignId: string) =>
	["campaign-tamed-anomalies", campaignId] as const;
const CHARACTER_KEY = (characterId: string) =>
	["character-tamed-anomalies", characterId] as const;

export function useCampaignTamedAnomalies(campaignId: string | undefined) {
	return useQuery({
		queryKey: campaignId ? CAMPAIGN_KEY(campaignId) : ["campaign-tamed-anomalies", "_none"],
		queryFn: async () => {
			if (!campaignId || !isSupabaseConfigured)
				return [] as TamedAnomalyRow[];
			const { data, error } = await supabase
				.from("campaign_tamed_anomalies" as never)
				.select("*")
				.eq("campaign_id", campaignId);
			if (error) throw error;
			return (data as unknown as TamedAnomalyRow[]) || [];
		},
		enabled: !!campaignId,
	});
}

export function useCharacterTamedAnomalies(characterId: string | undefined) {
	return useQuery({
		queryKey: characterId
			? CHARACTER_KEY(characterId)
			: ["character-tamed-anomalies", "_none"],
		queryFn: async () => {
			if (!characterId || !isSupabaseConfigured)
				return [] as TamedAnomalyRow[];
			const { data, error } = await supabase
				.from("character_tamed_anomalies" as never)
				.select("*")
				.eq("character_id", characterId);
			if (error) throw error;
			return (data as unknown as TamedAnomalyRow[]) || [];
		},
		enabled: !!characterId,
	});
}

export interface AttemptTamingInput {
	campaignId: string | null;
	characterId: string;
	anomalyId: string;
	rollTotal: number;
	dc: number;
	initialHp: number;
	bondInitial?: number;
	nickname?: string;
}

export function useAttemptTaming() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: AttemptTamingInput) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { data, error } = await (
				supabase.rpc as unknown as (
					name: string,
					params: Record<string, unknown>,
				) => Promise<{ data: unknown; error: Error | null }>
			)("attempt_taming", {
				p_campaign_id: input.campaignId,
				p_character_id: input.characterId,
				p_anomaly_id: input.anomalyId,
				p_roll_total: input.rollTotal,
				p_dc: input.dc,
				p_initial_hp: input.initialHp,
				p_bond_initial: input.bondInitial ?? 1,
				p_nickname: input.nickname ?? null,
			});
			if (error) throw error;
			return (data as string | null) ?? null;
		},
		onSuccess: (newId, variables) => {
			if (variables.campaignId) {
				queryClient.invalidateQueries({
					queryKey: CAMPAIGN_KEY(variables.campaignId),
				});
			} else {
				queryClient.invalidateQueries({
					queryKey: CHARACTER_KEY(variables.characterId),
				});
			}
			toast({
				title: newId ? "Anomaly tamed" : "Taming failed",
				description: newId
					? "The creature is now part of your party roster."
					: "The roll didn't meet the DC. Try again after a short rest.",
				variant: newId ? "default" : "destructive",
			});
		},
		onError: (err: Error) => {
			toast({
				title: "Taming attempt errored",
				description: err.message,
				variant: "destructive",
			});
		},
	});
}

export function useClaimAnomalyController() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			tamedId: string;
			characterId: string;
			campaignId: string;
		}) => {
			if (!isSupabaseConfigured)
				throw new AppError("Supabase not configured", "CONFIG");
			const { data, error } = await (
				supabase.rpc as unknown as (
					name: string,
					params: Record<string, unknown>,
				) => Promise<{ data: unknown; error: Error | null }>
			)("claim_anomaly_controller", {
				p_tamed_id: input.tamedId,
				p_character_id: input.characterId,
			});
			if (error) throw error;
			return data as boolean;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: CAMPAIGN_KEY(variables.campaignId),
			});
			toast({ title: "Control claimed" });
		},
	});
}

export function useReleaseAnomalyController() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: { tamedId: string; campaignId: string }) => {
			if (!isSupabaseConfigured) return;
			const { error } = await (
				supabase.rpc as unknown as (
					name: string,
					params: Record<string, unknown>,
				) => Promise<{ data: unknown; error: Error | null }>
			)("release_anomaly_controller", {
				p_tamed_id: input.tamedId,
			});
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: CAMPAIGN_KEY(variables.campaignId),
			});
		},
	});
}

export function useUpdateTamedHP() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: {
			tamedId: string;
			campaignId?: string | null;
			characterId?: string | null;
			currentHp: number;
		}) => {
			const tableName = input.campaignId
				? "campaign_tamed_anomalies"
				: "character_tamed_anomalies";
			const { error } = await (
				supabase
					.from(tableName as never)
					.update({ current_hp: input.currentHp } as never)
					.eq("id", input.tamedId) as unknown as Promise<{
					error: Error | null;
				}>
			);
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			if (variables.campaignId) {
				queryClient.invalidateQueries({
					queryKey: CAMPAIGN_KEY(variables.campaignId),
				});
			} else if (variables.characterId) {
				queryClient.invalidateQueries({
					queryKey: CHARACTER_KEY(variables.characterId),
				});
			}
		},
	});
}
