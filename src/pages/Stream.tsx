import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CampaignStreamRoot } from "@/components/stream/StreamRoot";

/**
 * Misty Pearl D1 — Broadcast Stream page.
 *
 * URL: `/campaigns/:id/stream/:viewMode` where `viewMode ∈ {
 *   "chat-overlay" | "dice-overlay" | "scene-cam" | "roster" | "cast"
 * }`. Renders a transparent-background view of one campaign overlay,
 * optimized to drop into OBS / Streamlabs / Twitch Studio as a Browser
 * Source.
 *
 * Optional query params:
 *   - `?accent=ffaa33` — override the Ascendant accent color.
 *   - `?fade=8000` — chat-overlay message fade duration in ms.
 *
 * RA theming: this is the Bureau Broadcast Stream — externally
 * facing Field Brief layer used for archived debriefs and live
 * sessions.
 */
export default function Stream() {
	const { id, viewMode } = useParams<{
		id: string;
		viewMode: string;
	}>();
	const [searchParams] = useSearchParams();
	const accent = searchParams.get("accent");
	const fade = searchParams.get("fade");

	// Stream pages run in transparent OBS browser sources — drop the
	// global app background so the overlay composites cleanly. We
	// remove the class on unmount in case the user navigates back to a
	// normal app route via gesture.
	useEffect(() => {
		const body = document.body;
		body.classList.add("stream-mode");
		body.dataset.streamView = viewMode ?? "";
		return () => {
			body.classList.remove("stream-mode");
			delete body.dataset.streamView;
		};
	}, [viewMode]);

	if (!id || !viewMode) {
		return (
			<div className="p-6 text-sm text-muted-foreground">
				Misty Pearl D1 — Missing campaign id or view mode.
			</div>
		);
	}

	return (
		<CampaignStreamRoot
			campaignId={id}
			viewMode={viewMode}
			accent={accent ?? undefined}
			fadeMs={fade ? Number(fade) || undefined : undefined}
		/>
	);
}
