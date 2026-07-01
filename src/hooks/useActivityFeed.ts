/**
 * useActivityFeed — a persisted, capped activity log scoped to either the
 * current user or a campaign, backed by the shared `useToolState` save path.
 *
 * Pass a `campaignId` to scope to a campaign (shared across members);
 * otherwise it persists per-user. The two scope hooks are both invoked to
 * satisfy the rules of hooks, but only the active one is enabled.
 */
import { useCallback } from "react";
import { useCampaignToolState, useUserToolState } from "@/hooks/useToolState";
import {
	type ActivityFeedState,
	type ActivityInput,
	appendActivity,
	clearActivity,
	emptyActivityFeed,
	removeActivity,
} from "@/lib/activityFeed";

interface UseActivityFeedOptions {
	/** Persistence key, e.g. "guild-activity" or "campaign-activity". */
	toolKey: string;
	/** When set, scopes the feed to the campaign instead of the user. */
	campaignId?: string | null;
	enabled?: boolean;
}

export interface UseActivityFeedResult {
	events: ActivityFeedState["events"];
	log: (input: ActivityInput) => void;
	remove: (id: string) => void;
	clear: () => void;
	isLoading: boolean;
}

export function useActivityFeed({
	toolKey,
	campaignId = null,
	enabled = true,
}: UseActivityFeedOptions): UseActivityFeedResult {
	const scopedToCampaign = !!campaignId;

	const userScope = useUserToolState<ActivityFeedState>(toolKey, {
		initialState: emptyActivityFeed(),
		enabled: enabled && !scopedToCampaign,
	});
	const campaignScope = useCampaignToolState<ActivityFeedState>(
		campaignId,
		toolKey,
		{
			initialState: emptyActivityFeed(),
			enabled: enabled && scopedToCampaign,
		},
	);

	const { state, setState, saveNow, isLoading } = scopedToCampaign
		? campaignScope
		: userScope;

	const log = useCallback(
		(input: ActivityInput) => {
			setState((prev) => {
				const next = appendActivity(prev, input);
				void saveNow(next);
				return next;
			});
		},
		[setState, saveNow],
	);

	const remove = useCallback(
		(id: string) => {
			setState((prev) => {
				const next = removeActivity(prev, id);
				void saveNow(next);
				return next;
			});
		},
		[setState, saveNow],
	);

	const clear = useCallback(() => {
		const next = clearActivity();
		setState(next);
		void saveNow(next);
	}, [setState, saveNow]);

	return { events: state.events, log, remove, clear, isLoading };
}
