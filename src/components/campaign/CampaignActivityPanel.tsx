import { useMemo } from "react";
import { ActivityFeedPanel } from "@/components/shared/ActivityFeedPanel";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { useCampaignRollFeed } from "@/hooks/useCampaignRollFeed";
import { mergeCampaignActivity } from "@/lib/campaignActivity";

interface CampaignActivityPanelProps {
	campaignId: string;
}

/**
 * Campaign Activity tab — one chronological feed unifying the campaign-scoped
 * persisted activity log (membership changes, generation/import, exports via
 * {@link useActivityFeed}) with the live dice-roll stream
 * ({@link useCampaignRollFeed}). Roll events are derived (id-prefixed `roll-`)
 * and aren't individually removable; the persisted log can be cleared.
 */
export function CampaignActivityPanel({
	campaignId,
}: CampaignActivityPanelProps) {
	const { events: logged, clear } = useActivityFeed({
		toolKey: "campaign-activity",
		campaignId,
	});
	const { events: rolls } = useCampaignRollFeed(campaignId);

	const merged = useMemo(
		() => mergeCampaignActivity(logged, rolls),
		[logged, rolls],
	);

	return (
		<ActivityFeedPanel
			title="CAMPAIGN ACTIVITY"
			events={merged}
			onClear={logged.length > 0 ? clear : undefined}
			emptyLabel="No campaign activity yet. Rolls, joins, and exports show here."
		/>
	);
}
