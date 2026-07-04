import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { RA_CURRENCY_TYPES, type RaCurrencyId } from "@/lib/currency";
import { getErrorMessage, logErrorWithContext } from "@/lib/errorHandling";
import {
	readLocalPartyCredits,
	saveLocalPartyCredits,
	shouldUseLocalStash,
} from "@/lib/guestCampaignStash";

type PartyCredits = Record<RaCurrencyId, number>;

const DEFAULT_PARTY_CREDITS: PartyCredits = {
	core: 0,
	gate: 0,
	crystal: 0,
	mana: 0,
};

const parsePartyCredits = (value: unknown): PartyCredits => {
	const parsed =
		value && typeof value === "object"
			? (value as Record<string, unknown>)
			: {};

	return {
		core: Number(parsed.core ?? parsed.pp ?? 0) || 0,
		gate: Number(parsed.gate ?? parsed.gp ?? 0) || 0,
		crystal:
			(Number(parsed.crystal ?? parsed.sp ?? 0) || 0) +
			(Number(parsed.ep ?? 0) || 0) * 5,
		mana: Number(parsed.mana ?? parsed.cp ?? 0) || 0,
	};
};

export const useCampaignGold = (campaignId: string | null) => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: partyCredits = DEFAULT_PARTY_CREDITS, isLoading } = useQuery({
		queryKey: ["campaign_gold", campaignId],
		queryFn: async () => {
			if (!campaignId) return DEFAULT_PARTY_CREDITS;

			if (await shouldUseLocalStash()) {
				const local = readLocalPartyCredits(campaignId);
				return local ? parsePartyCredits(local) : DEFAULT_PARTY_CREDITS;
			}

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
			if (!data?.party_gold) return DEFAULT_PARTY_CREDITS;

			return parsePartyCredits(
				JSON.parse(JSON.stringify(data.party_gold || {})),
			);
		},
		enabled: !!campaignId,
	});

	const updateCredits = useMutation({
		mutationFn: async (newCredits: PartyCredits) => {
			if (!campaignId) throw new Error("No active campaign");

			const sanitized = Object.fromEntries(
				RA_CURRENCY_TYPES.map((currency) => [
					currency.id,
					Math.max(0, Math.floor(newCredits[currency.id] || 0)),
				]),
			) as PartyCredits;

			if (await shouldUseLocalStash()) {
				saveLocalPartyCredits(campaignId, sanitized);
				return { party_gold: sanitized as unknown as Json };
			}

			const { data, error } = await supabase
				.from("campaigns")
				.update({
					party_gold: JSON.parse(JSON.stringify(sanitized)) as Json,
				})
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
				title: "Failed to update Credits",
				description: getErrorMessage(error),
				variant: "destructive",
			});
		},
	});

	return {
		partyCredits,
		partyGold: partyCredits,
		isLoading,
		updateCredits: updateCredits.mutateAsync,
		updateGold: updateCredits.mutateAsync,
	};
};
