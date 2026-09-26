import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { HarvestMethod, HarvestRank } from "@/lib/harvestingRules";

export interface HarvestAuthorization {
	id: string;
	campaign_id: string;
	character_id: string;
	source_kind: "canonical-anomaly" | "warden-source";
	source_id: string;
	source_rank: HarvestRank;
	source_note: string;
	method: HarvestMethod;
	material_definition_id: string;
	approved_quantity: number;
	approved_grade: string;
	dc: number;
	duration_minutes: number;
	tool_kind: string;
	tool_evidence: string;
	status: "open" | "resolved" | "revoked";
	created_at: string;
}

export interface HarvestAttemptResult {
	authorization_id: string;
	attempt_id: string;
	success: boolean;
	roll: number;
	intelligence_modifier: number;
	proficiency_bonus: number;
	total: number;
	dc: number;
	lot_id: string | null;
}

export interface HarvestApprovalInput {
	campaignId: string;
	characterId: string;
	sourceKind: "canonical-anomaly" | "warden-source";
	sourceId: string;
	sourceRank: HarvestRank | null;
	sourceNote: string;
	method: HarvestMethod;
	materialDefinitionId: string;
	quantity: number;
	durationMinutes: number;
	toolKind: "harvesting-kit" | "field-extraction-rig" | "approved-equivalent";
	toolEvidence: string;
	wardenDc: number | null;
	operationId: string;
}

type RpcClient = (
	fn: string,
	args: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;
const callRpc = supabase.rpc as unknown as RpcClient;

const characterKey = (characterId: string) =>
	["harvest-authorizations-m2", "character", characterId] as const;
const campaignKey = (campaignId: string) =>
	["harvest-authorizations-m2", "campaign", campaignId] as const;

export function useCharacterHarvesting(characterId: string | undefined) {
	const queryClient = useQueryClient();
	const approvals = useQuery({
		queryKey: characterKey(characterId ?? "_none"),
		enabled: !!characterId && isSupabaseConfigured,
		queryFn: async (): Promise<HarvestAuthorization[]> => {
			if (!characterId) return [];
			const { data, error } = await supabase
				.from("harvest_authorizations_m2" as never)
				.select("*")
				.eq("character_id", characterId)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as unknown as HarvestAuthorization[];
		},
	});
	const resolve = useMutation({
		mutationFn: async (input: {
			authorizationId: string;
			skill: "Medicine" | "Survival";
			operationId: string;
		}): Promise<HarvestAttemptResult> => {
			const { data, error } = await callRpc("resolve_harvest_attempt_m2", {
				p_authorization_id: input.authorizationId,
				p_skill: input.skill,
				p_operation_id: input.operationId,
			});
			if (error) throw new Error(error.message);
			return data as HarvestAttemptResult;
		},
		onSuccess: () => {
			if (!characterId) return;
			queryClient.invalidateQueries({ queryKey: characterKey(characterId) });
			queryClient.invalidateQueries({
				queryKey: ["material-lots-m1", characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character-materials", characterId],
			});
		},
	});
	return { approvals, resolve };
}

export function useCampaignHarvesting(campaignId: string | undefined) {
	const queryClient = useQueryClient();
	const approvals = useQuery({
		queryKey: campaignKey(campaignId ?? "_none"),
		enabled: !!campaignId && isSupabaseConfigured,
		queryFn: async (): Promise<HarvestAuthorization[]> => {
			if (!campaignId) return [];
			const { data, error } = await supabase
				.from("harvest_authorizations_m2" as never)
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as unknown as HarvestAuthorization[];
		},
	});
	const approve = useMutation({
		mutationFn: async (input: HarvestApprovalInput): Promise<string> => {
			const { data, error } = await callRpc("approve_harvest_yield_m2", {
				p_campaign_id: input.campaignId,
				p_character_id: input.characterId,
				p_source_kind: input.sourceKind,
				p_source_id: input.sourceId,
				p_source_rank: input.sourceRank,
				p_source_note: input.sourceNote,
				p_method: input.method,
				p_material_definition_id: input.materialDefinitionId,
				p_quantity: input.quantity,
				p_duration_minutes: input.durationMinutes,
				p_tool_kind: input.toolKind,
				p_tool_evidence: input.toolEvidence,
				p_warden_dc: input.wardenDc,
				p_operation_id: input.operationId,
			});
			if (error) throw new Error(error.message);
			if (typeof data !== "string") throw new Error("No approval ID returned.");
			return data;
		},
		onSuccess: (_, input) => {
			queryClient.invalidateQueries({
				queryKey: campaignKey(input.campaignId),
			});
			queryClient.invalidateQueries({
				queryKey: characterKey(input.characterId),
			});
		},
	});
	const revoke = useMutation({
		mutationFn: async (approvalId: string): Promise<void> => {
			const { error } = await callRpc("revoke_harvest_approval_m2", {
				p_authorization_id: approvalId,
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			if (campaignId) {
				queryClient.invalidateQueries({ queryKey: campaignKey(campaignId) });
			}
		},
	});
	return { approvals, approve, revoke };
}
