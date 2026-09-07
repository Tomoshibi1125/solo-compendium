/**
 * useSessionQuests — campaign quest board. Wires the previously-broken quest
 * subsystem (session_quests + create/complete/claim RPCs) after the
 * 20260726 re-home migration (campaign-scoped, warden_id RLS). Wardens author
 * quests + mark them complete; players claim rewards onto a character.
 *
 * NOTE: casts to SessionQuestRow / the RPC client keep this typechecking against
 * the pre-migration generated types; regenerate types.ts after applying the
 * migration to drop the casts.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
	buildCampaignWorkflowRpcPreflightV1,
	type CampaignWorkflowRpcReceiptV1,
	executeCampaignWorkflowRpcV1,
} from "@/lib/planning/adapters/campaignWorkflow";

export interface QuestRewards {
	xp?: number;
	gold?: number;
	items?: string[];
}

export interface SessionQuestRow {
	id: string;
	campaign_id: string;
	title: string;
	description: string;
	objectives: string[];
	rewards: QuestRewards;
	status: "active" | "completed" | "failed";
	completion_notes: string | null;
	created_by: string;
	created_at: string | null;
}

const KEY = (campaignId: string) => ["campaign-quests", campaignId];
type RpcClient = (
	fn: string,
	args: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export function useSessionQuests(campaignId: string | undefined) {
	return useQuery({
		queryKey: KEY(campaignId ?? ""),
		enabled: !!campaignId && isSupabaseConfigured,
		queryFn: async () => {
			// RLS restricts rows to the caller's campaigns; filter to this one.
			const { data, error } = await supabase.from("session_quests").select("*");
			if (error) throw error;
			return (data ?? [])
				.map((r) => r as unknown as SessionQuestRow)
				.filter((q) => q.campaign_id === campaignId)
				.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
		},
	});
}

export function useCreateQuest() {
	const qc = useQueryClient();
	const { toast } = useToast();
	const [planningReceipt, setPlanningReceipt] =
		useState<CampaignWorkflowRpcReceiptV1 | null>(null);
	const mutation = useMutation({
		mutationFn: async (input: {
			campaignId: string;
			title: string;
			description: string;
			objectives: string[];
			rewards: QuestRewards;
		}) => {
			setPlanningReceipt(null);
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const preflight = buildCampaignWorkflowRpcPreflightV1({
				operation: "create-quest",
				campaignId: input.campaignId,
			});
			const execution = await executeCampaignWorkflowRpcV1(
				preflight,
				async () => {
					const { error } = await (supabase.rpc as unknown as RpcClient)(
						"create_session_quest",
						{
							p_campaign_id: input.campaignId,
							p_title: input.title,
							p_description: input.description,
							p_objectives: input.objectives,
							p_rewards: input.rewards,
						},
					);
					if (error) throw new Error(error.message);
				},
			);
			setPlanningReceipt(execution.receipt);
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Quest posted to the board." });
		},
		onError: (e) =>
			toast({
				title: "Failed to create quest",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
	return { ...mutation, planningReceipt };
}

export function useCompleteQuest() {
	const qc = useQueryClient();
	const { toast } = useToast();
	const [planningReceipt, setPlanningReceipt] =
		useState<CampaignWorkflowRpcReceiptV1 | null>(null);
	const mutation = useMutation({
		mutationFn: async (input: {
			campaignId: string;
			questId: string;
			notes?: string;
		}) => {
			setPlanningReceipt(null);
			const preflight = buildCampaignWorkflowRpcPreflightV1({
				operation: "complete-quest",
				campaignId: input.campaignId,
				questId: input.questId,
			});
			const execution = await executeCampaignWorkflowRpcV1(
				preflight,
				async () => {
					const { error } = await (supabase.rpc as unknown as RpcClient)(
						"complete_session_quest",
						{
							p_quest_id: input.questId,
							p_completion_notes: input.notes ?? null,
						},
					);
					if (error) throw new Error(error.message);
				},
			);
			setPlanningReceipt(execution.receipt);
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Quest marked complete. Party may claim rewards." });
		},
		onError: (e) =>
			toast({
				title: "Failed to complete quest",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
	return { ...mutation, planningReceipt };
}

export function useClaimQuestRewards() {
	const qc = useQueryClient();
	const { toast } = useToast();
	const [planningReceipt, setPlanningReceipt] =
		useState<CampaignWorkflowRpcReceiptV1 | null>(null);
	const mutation = useMutation({
		mutationFn: async (input: {
			campaignId: string;
			questId: string;
			characterId: string;
		}) => {
			setPlanningReceipt(null);
			const preflight = buildCampaignWorkflowRpcPreflightV1({
				operation: "claim-quest-rewards",
				campaignId: input.campaignId,
				questId: input.questId,
				characterId: input.characterId,
			});
			const execution = await executeCampaignWorkflowRpcV1(
				preflight,
				async () => {
					const { error } = await (supabase.rpc as unknown as RpcClient)(
						"claim_quest_rewards",
						{
							p_quest_id: input.questId,
							p_character_id: input.characterId,
						},
					);
					if (error) throw new Error(error.message);
				},
			);
			setPlanningReceipt(execution.receipt);
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			qc.invalidateQueries({ queryKey: ["character", v.characterId] });
			toast({ title: "Rewards claimed!" });
		},
		onError: (e) =>
			toast({
				title: "Failed to claim rewards",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			}),
	});
	return { ...mutation, planningReceipt };
}

export function useDeleteQuest() {
	const qc = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: { campaignId: string; questId: string }) => {
			const { error } = await supabase
				.from("session_quests")
				.delete()
				.eq("id", input.questId);
			if (error) throw error;
		},
		onSuccess: (_, v) => {
			qc.invalidateQueries({ queryKey: KEY(v.campaignId) });
			toast({ title: "Quest removed." });
		},
	});
}
