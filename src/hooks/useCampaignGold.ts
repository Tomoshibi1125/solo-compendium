import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";

// D&D 5e standard coin denominations
export interface PartyGold {
	gp: number;
	sp: number;
	cp: number;
	pp: number;
	ep: number;
}

const DEFAULT_PARTY_GOLD: PartyGold = {
	gp: 0,
	sp: 0,
	cp: 0,
	pp: 0,
	ep: 0,
};

export const useCampaignGold = (campaignId: string | null) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: partyGold = DEFAULT_PARTY_GOLD, isLoading } = useQuery({
		queryKey: ["campaign_gold", campaignId],
		queryFn: async () => {
			if (!campaignId) return DEFAULT_PARTY_GOLD;

			const { data, error } = await supabase
				.from("campaigns")
				.select("party_gold")
				.eq("id", campaignId)
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignGold.query");
				throw error;
			}

			// Fallback to default if null or empty
			if (!data?.party_gold) return DEFAULT_PARTY_GOLD;

			const parsed = data.party_gold as unknown as Partial<PartyGold>;

			return {
				gp: parsed.gp || 0,
				sp: parsed.sp || 0,
				cp: parsed.cp || 0,
				pp: parsed.pp || 0,
				ep: parsed.ep || 0,
			};
		},
		enabled: !!campaignId,
	});

	const updateGold = useMutation({
		mutationFn: async (newGold: PartyGold) => {
			if (!campaignId) throw new Error("No active campaign");

			const { data, error } = await supabase
				.from("campaigns")
				.update({ party_gold: newGold as unknown as number })
				.eq("id", campaignId)
				.select("party_gold")
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignGold.update");
				throw error;
			}

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["campaign_gold", campaignId],
			});
			toast({ title: "Party wealth updated" });
		},
		onError: (error) => {
			logErrorWithContext(error, "useCampaignGold.update");
			toast({
				title: "Failed to update gold",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	return {
		partyGold,
		isLoading,
		updateGold: updateGold.mutateAsync,
	};
};
