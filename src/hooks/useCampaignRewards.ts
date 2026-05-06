import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";

type LootItem = {
	name: string;
	quantity?: number;
	value_credits?: number;
	value?: number;
};

export const useAssignCampaignLoot = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			items,
			encounterId,
			sessionId,
			assignedToMemberId,
		}: {
			campaignId: string;
			items: LootItem[];
			encounterId?: string | null;
			sessionId?: string | null;
			assignedToMemberId?: string | null;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new AppError("Not authenticated", "AUTH_REQUIRED");

			const { data, error } = await supabase.rpc("assign_campaign_loot", {
				p_campaign_id: campaignId,
				p_items: JSON.parse(JSON.stringify(items)) as Json,
				p_encounter_id: encounterId ?? undefined,
				p_session_id: sessionId ?? undefined,
				p_assigned_to_member_id: assignedToMemberId ?? undefined,
			});

			if (error) throw error;
			return data as string;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "loot"],
			});
			toast({
				title: "Loot assigned",
				description: "Loot drop recorded in campaign ledger.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to assign loot",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
