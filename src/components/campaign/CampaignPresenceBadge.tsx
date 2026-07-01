import { useEffect } from "react";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { summarizeOnlineMembers } from "@/lib/campaignPresence";
import { cn } from "@/lib/utils";

/**
 * Inner roster — only mounted for authenticated Supabase sessions (see the
 * gate below), so the realtime channel never opens in guest/offline mode and
 * can't emit a spurious "connection error" toast.
 */
function PresenceRoster({ campaignId }: { campaignId: string }) {
	const { activeUsers, updatePresence, isConnected } =
		useRealtimeCollaboration(campaignId);

	// Track the current user into presence once connected so other members'
	// rosters include them (the hook only listens; it never self-tracks).
	useEffect(() => {
		if (isConnected) updatePresence({});
	}, [isConnected, updatePresence]);

	const summary = summarizeOnlineMembers(
		activeUsers.map((u) => ({ id: u.id, name: u.name })),
	);
	if (summary.count === 0) return null;

	return (
		<div
			className="flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1"
			title={summary.names.join(", ")}
			data-testid="campaign-presence-badge"
		>
			<span
				className={cn(
					"h-2 w-2 rounded-full",
					isConnected ? "bg-success" : "bg-muted-foreground",
				)}
			/>
			<div className="flex -space-x-2">
				{summary.names.slice(0, 5).map((name) => (
					<span
						key={name}
						className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-[11px] font-medium text-primary-foreground"
						title={name}
					>
						{name.charAt(0).toUpperCase()}
					</span>
				))}
			</div>
			<span className="text-xs text-muted-foreground">{summary.label}</span>
		</div>
	);
}

/**
 * Who's-online roster for a campaign — DDB-style presence. Reuses the existing
 * `useRealtimeCollaboration` presence channel; renders nothing in guest/offline
 * mode. Dice rolls + combat state already broadcast to all members via the
 * realtime hooks (`useCampaignRollFeed` / `useCampaignCombatSession`).
 */
export function CampaignPresenceBadge({ campaignId }: { campaignId: string }) {
	const { user } = useAuth();
	if (!isSupabaseConfigured || !user || !campaignId) return null;
	return <PresenceRoster campaignId={campaignId} />;
}
