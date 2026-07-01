/**
 * Campaign Activity aggregation (Part B / B2).
 *
 * Pure helpers that fold the live dice-roll stream into the shared
 * {@link ActivityEvent} shape and merge it with the campaign-scoped persisted
 * activity log into one chronological feed. Kept React/DOM-free so the
 * aggregation is unit-tested without rendering.
 */

import type { ActivityEvent } from "@/lib/activityFeed";

/** The roll fields the Activity feed needs (subset of `campaign_roll_events`). */
export interface CampaignRollLike {
	id: string;
	created_at: string;
	character_name: string | null;
	result: number;
	roll_type: string | null;
	dice_formula: string;
}

/** Cap on the merged feed length (rolls + logged events). */
export const CAMPAIGN_ACTIVITY_CAP = 100;

/** Map a campaign roll event into a display `ActivityEvent` (id-prefixed). */
export function rollToActivityEvent(roll: CampaignRollLike): ActivityEvent {
	return {
		id: `roll-${roll.id}`,
		at: roll.created_at,
		kind: "roll",
		category: "roll",
		label: `${roll.character_name || "Someone"} rolled ${roll.result}${
			roll.roll_type ? ` (${roll.roll_type})` : ""
		} · ${roll.dice_formula}`,
	};
}

/**
 * Merge the persisted activity log with the live roll stream into one
 * newest-first feed, capped at {@link CAMPAIGN_ACTIVITY_CAP}.
 */
export function mergeCampaignActivity(
	logged: ReadonlyArray<ActivityEvent>,
	rolls: ReadonlyArray<CampaignRollLike>,
): ActivityEvent[] {
	return [...logged, ...rolls.map(rollToActivityEvent)]
		.sort((a, b) => b.at.localeCompare(a.at))
		.slice(0, CAMPAIGN_ACTIVITY_CAP);
}
