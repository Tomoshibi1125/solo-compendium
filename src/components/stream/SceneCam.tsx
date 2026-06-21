import { Link } from "react-router-dom";

/**
 * Misty Pearl D1 — Scene cam.
 *
 * Browser-source view that points the streamer at the player-facing
 * map without UI chrome. We embed `AscendantMapView` via an iframe-
 * adjacent SPA link — opening `/campaigns/:id/vtt` directly in the
 * stream window is the canonical path. This component renders a
 * "click to open" prompt and a fallback note so OBS users know what
 * to point their layout at.
 */
interface SceneCamProps {
	campaignId: string;
}

export function SceneCam({ campaignId }: SceneCamProps) {
	return (
		<div
			className="fixed inset-0 flex items-center justify-center pointer-events-auto"
			data-testid="stream-scene-cam"
		>
			<div className="rounded-md border border-[var(--stream-accent)]/40 bg-black/70 backdrop-blur-md p-6 text-center max-w-md">
				<p className="font-resurge text-[10px] uppercase tracking-[0.4em] text-[var(--stream-accent)]">
					Bureau Field Cam
				</p>
				<p className="mt-2 text-sm text-white/90">
					In OBS / Twitch Studio, point your Browser Source at the player VTT
					route below for a chrome-free scene view.
				</p>
				<div className="mt-3 rounded-md bg-black/60 px-3 py-2 font-mono text-xs text-[var(--stream-accent)]">
					/campaigns/{campaignId}/vtt
				</div>
				<Link
					to={`/campaigns/${campaignId}/vtt`}
					className="mt-3 inline-block text-xs text-[var(--stream-accent)] underline"
				>
					Open scene now →
				</Link>
			</div>
		</div>
	);
}
