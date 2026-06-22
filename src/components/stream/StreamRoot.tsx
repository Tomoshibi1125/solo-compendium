import { ChatOverlay } from "@/components/stream/ChatOverlay";
import { DiceOverlay } from "@/components/stream/DiceOverlay";
import { RosterOverlay } from "@/components/stream/RosterOverlay";
import { SceneCam } from "@/components/stream/SceneCam";
import { useCampaign } from "@/hooks/useCampaigns";

/**
 * Misty Pearl D1 — Broadcast Stream root.
 *
 * One component covers every view mode (`chat-overlay`, `dice-overlay`,
 * `scene-cam`, `roster`, `cast`) so OBS users can hot-switch by
 * changing the URL `viewMode` segment. Each view is a thin wrapper
 * around existing campaign data — no new realtime channels are added.
 *
 * RA theming: each overlay carries an Ascendant accent border so the
 * stream feels native to the Bureau brand even when composited on
 * top of a streamer's own background art.
 */
export interface CampaignStreamRootProps {
	campaignId: string;
	viewMode: string;
	accent?: string;
	fadeMs?: number;
}

const VIEW_MODES = new Set([
	"chat-overlay",
	"dice-overlay",
	"scene-cam",
	"roster",
	"cast",
]);

export function CampaignStreamRoot({
	campaignId,
	viewMode,
	accent,
	fadeMs,
}: CampaignStreamRootProps) {
	const { data: campaign } = useCampaign(campaignId);
	const normalized = VIEW_MODES.has(viewMode) ? viewMode : "scene-cam";
	const accentColor = accent ? `#${accent.replace(/^#/, "")}` : "#facc15";

	if (!campaign) {
		return (
			<div
				className="min-h-screen flex items-center justify-center bg-transparent text-xs text-white/60"
				data-testid="stream-root-loading"
			>
				Loading Bureau stream…
			</div>
		);
	}

	return (
		<div
			className="min-h-screen w-full bg-transparent text-white"
			data-testid="stream-root"
			data-view-mode={normalized}
			data-campaign-id={campaignId}
			style={{ ["--stream-accent" as string]: accentColor }}
		>
			{normalized === "chat-overlay" && (
				<ChatOverlay campaignId={campaignId} fadeMs={fadeMs} />
			)}
			{normalized === "dice-overlay" && <DiceOverlay campaignId={campaignId} />}
			{normalized === "scene-cam" && <SceneCam campaignId={campaignId} />}
			{normalized === "roster" && <RosterOverlay campaignId={campaignId} />}
			{normalized === "cast" && (
				<>
					<SceneCam campaignId={campaignId} />
					<RosterOverlay campaignId={campaignId} />
				</>
			)}
		</div>
	);
}
