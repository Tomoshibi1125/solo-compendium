import { useCampaignMembers } from "@/hooks/useCampaigns";

/**
 * Misty Pearl D1 — Roster overlay (OBS Browser Source).
 *
 * Connected Ascendants + role pills. Designed to drop into OBS as a
 * corner overlay so streamers don't have to maintain a separate
 * "party" graphic. Reads from the existing campaign-members query.
 */
export interface RosterOverlayProps {
	campaignId: string;
}

export function RosterOverlay({ campaignId }: RosterOverlayProps) {
	const { data: members = [] } = useCampaignMembers(campaignId);

	return (
		<div
			className="fixed bottom-6 right-6 max-w-xs space-y-1.5 pointer-events-none"
			data-testid="stream-roster-overlay"
		>
			<p className="text-[10px] uppercase tracking-[0.4em] text-[var(--stream-accent)]">
				Bureau Roster
			</p>
			<div className="rounded-md border border-[var(--stream-accent)]/40 bg-black/65 backdrop-blur-sm p-3 space-y-1">
				{members.length === 0 && (
					<p className="text-xs text-white/60 italic">
						No operatives registered.
					</p>
				)}
				{members.map((member) => (
					<div
						key={member.id}
						className="flex items-center justify-between gap-2 text-xs text-white"
					>
						<span className="truncate">
							{member.character_id ? "Ascendant" : "Operative"} ·{" "}
							{member.user_id.slice(0, 8)}
						</span>
						<span className="text-[9px] uppercase tracking-wide text-[var(--stream-accent)]">
							{member.role}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default RosterOverlay;
