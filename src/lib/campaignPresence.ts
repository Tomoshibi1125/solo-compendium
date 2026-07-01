/**
 * Campaign presence aggregation (Part B / B3).
 *
 * Pure helper folding the raw active-user list from `useRealtimeCollaboration`
 * into a deduped, sorted who's-online summary for the campaign roster badge.
 * React/DOM-free so the aggregation is unit-tested without a live channel.
 */

export interface OnlineMemberInput {
	id: string;
	name: string;
}

export interface OnlineSummary {
	/** Distinct online members. */
	count: number;
	/** Deduped, alphabetically-sorted display names. */
	names: string[];
	/** Short roster label, e.g. "3 online". */
	label: string;
}

/**
 * Dedupe active users by id (a member open in two tabs counts once), sort by
 * name, and produce a roster label. Empty/blank names fall back to "Anonymous".
 */
export function summarizeOnlineMembers(
	members: ReadonlyArray<OnlineMemberInput>,
): OnlineSummary {
	const byId = new Map<string, string>();
	for (const member of members) {
		if (!byId.has(member.id)) {
			byId.set(member.id, member.name?.trim() || "Anonymous");
		}
	}
	const names = [...byId.values()].sort((a, b) => a.localeCompare(b));
	const count = names.length;
	const label =
		count === 0
			? "No one online"
			: count === 1
				? "1 online"
				: `${count} online`;
	return { count, names, label };
}
