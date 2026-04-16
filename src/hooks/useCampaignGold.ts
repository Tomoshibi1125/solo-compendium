import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";

// D&D 5e standard coin denominations
export interface PartyCurrency {
	bits: number; // CP
	credits: number; // SP
	shards: number; // GP
	cores: number; // PP
}

const DEFAULT_PARTY_CURRENCY: PartyCurrency = {
	bits: 0,
	credits: 0,
	shards: 0,
	cores: 0,
};

export const useCampaignCurrency = (campaignId: string | null) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: partyCurrency = DEFAULT_PARTY_CURRENCY, isLoading } = useQuery({
		queryKey: ["campaign_gold", campaignId],
		queryFn: async () => {
			if (!campaignId) return DEFAULT_PARTY_CURRENCY;

			const { data, error } = await supabase
				.from("campaigns")
				.select("party_gold")
				.eq("id", campaignId)
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignCurrency.query");
				throw error;
			}

			// Fallback to default if null or empty
			if (!data?.party_gold) return DEFAULT_PARTY_CURRENCY;

			const parsed = JSON.parse(
				JSON.stringify(data.party_gold || {}),
			) as Record<string, number>;

			return {
				shards: parsed.gp || 0,
				credits: parsed.sp || 0,
				bits: parsed.cp || 0,
				cores: parsed.pp || 0,
			};
		},
		enabled: !!campaignId,
	});

	const updateCurrency = useMutation({
		mutationFn: async (newCurrency: PartyCurrency) => {
			if (!campaignId) throw new Error("No active campaign");

			const { data, error } = await supabase
				.from("campaigns")
				.update({
					party_gold: JSON.parse(
						JSON.stringify({
							gp: newCurrency.shards,
							sp: newCurrency.credits,
							cp: newCurrency.bits,
							pp: newCurrency.cores,
							ep: 0,
						}),
					) as import("@/integrations/supabase/types").Json,
				})
				.eq("id", campaignId)
				.select("party_gold")
				.single();

			if (error) {
				logErrorWithContext(error, "useCampaignCurrency.update");
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
			logErrorWithContext(error, "useCampaignCurrency.update");
			toast({
				title: "Failed to update currency",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	return {
		partyCurrency,
		isLoading,
		updateCurrency: updateCurrency.mutateAsync,
	};
};
