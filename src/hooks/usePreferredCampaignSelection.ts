import { useCallback, useEffect } from "react";
import { useUserToolState } from "@/hooks/useToolState";

type PreferredCampaignSelection = {
	campaignId: string | null;
};

export function usePreferredCampaignSelection(toolKey: string) {
	const storageKey = `solo-compendium.preferred-campaign.${toolKey}.v1`;
	const { state, isLoading, saveNow } =
		useUserToolState<PreferredCampaignSelection>(
			`preferred_campaign:${toolKey}`,
			{
				initialState: { campaignId: null },
				storageKey,
			},
		);

	const setPreferredCampaignId = useCallback(
		async (campaignId: string | null) => {
			await saveNow({ campaignId });
		},
		[saveNow],
	);

	return {
		campaignId: state.campaignId,
		isLoading,
		setPreferredCampaignId,
	};
}

export function useHydratedPreferredCampaignId(args: {
	toolKey: string;
	campaigns: Array<{ id: string }>;
	urlCampaignId: string | null;
	isCampaignIdValid: (campaignId: string) => boolean;
	onResolveCampaignId: (campaignId: string) => void;
}) {
	const {
		toolKey,
		campaigns,
		urlCampaignId,
		isCampaignIdValid,
		onResolveCampaignId,
	} = args;
	const {
		campaignId: preferredCampaignId,
		isLoading,
		setPreferredCampaignId,
	} = usePreferredCampaignSelection(toolKey);

	useEffect(() => {
		if (isLoading) return;
		if (campaigns.length === 0) return;

		if (urlCampaignId && isCampaignIdValid(urlCampaignId)) {
			void setPreferredCampaignId(urlCampaignId);
			return;
		}

		if (preferredCampaignId && isCampaignIdValid(preferredCampaignId)) {
			onResolveCampaignId(preferredCampaignId);
			return;
		}

		const fallback = campaigns[0]?.id;
		if (fallback) {
			onResolveCampaignId(fallback);
			void setPreferredCampaignId(fallback);
		}
	}, [
		campaigns,
		isCampaignIdValid,
		isLoading,
		onResolveCampaignId,
		preferredCampaignId,
		setPreferredCampaignId,
		urlCampaignId,
	]);
}
