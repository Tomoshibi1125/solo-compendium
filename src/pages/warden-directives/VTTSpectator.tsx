import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import { VTTTopBar } from "@/components/vtt/VTTTopBar";
import { VTTZoomHud } from "@/components/vtt/VTTZoomHud";
import { VttPixiStage } from "@/components/vtt/VttPixiStage";
import { useVTTRealtime } from "@/hooks/useVTTRealtime";
import { useVTTSettings } from "@/hooks/useVTTSettings";
import { cn } from "@/lib/utils";

/**
 * Read-only Spectator View — a minimal VTT surface intended for projectors,
 * streaming (OBS), or a second display. Mirrors what Ascendants see:
 *
 *   - No Warden drawers / token library / AI pad / asset browser
 *   - Respects fog of war
 *   - Hides Warden-only drawings / the GM layer
 *   - Still shows pings and shared drawings
 *
 * Follows whichever scene the live campaign is currently on.
 */
const VTTSpectator = () => {
	const { campaignId } = useParams<{ campaignId: string }>();
	const [searchParams] = useSearchParams();
	const sessionId = searchParams.get("session");

	const mapRef = useRef<HTMLDivElement>(null);
	const [zoom, setZoom] = useState(1);

	const vttRealtime = useVTTRealtime({
		campaignId: campaignId || "",
		sessionId: sessionId ?? null,
		isWarden: false, // force spectator/player-side behavior
	});

	const { sessionStatus } = useVTTSettings(campaignId ?? null);

	// Spectator derives its scene state from realtime broadcasts. The Warden
	// pushes a `scene_sync` payload whenever the campaign's scene list or
	// active scene changes; `scene_change` flips the active scene.
	const [scenes, setScenes] = useState<import("@/types/vtt").VTTScene[]>([]);
	const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);

	useEffect(() => {
		const unsubSceneSync = vttRealtime.on("scene_sync", (payload) => {
			setScenes(payload.scenes);
			setCurrentSceneId(payload.currentSceneId);
		});
		const unsubSceneChange = vttRealtime.on("scene_change", (payload) => {
			setCurrentSceneId(payload.sceneId);
		});
		return () => {
			unsubSceneSync();
			unsubSceneChange();
		};
	}, [vttRealtime]);

	const currentScene = useMemo(
		() => scenes.find((s) => s.id === currentSceneId) ?? scenes[0] ?? null,
		[scenes, currentSceneId],
	);

	const visibleTokens = useMemo(() => {
		if (!currentScene?.tokens) return [];
		// Spectator = player POV: only tokens that aren't marked hidden.
		return currentScene.tokens.filter((t) => t.visible);
	}, [currentScene?.tokens]);

	const gridSize = currentScene?.gridSize ?? 50;
	const handleRequestZoom = useCallback((next: number) => {
		setZoom(Math.max(0.5, Math.min(2, next)));
	}, []);
	const handleFitZoom = useCallback(() => {
		if (!mapRef.current || !currentScene) return;
		const rect = mapRef.current.getBoundingClientRect();
		const sw = currentScene.width * gridSize;
		const sh = currentScene.height * gridSize;
		if (!rect.width || !rect.height || sw <= 0 || sh <= 0) return;
		const fit = Math.min(rect.width / sw, rect.height / sh, 2);
		handleRequestZoom(Math.max(0.5, Math.round(fit * 20) / 20));
	}, [currentScene, gridSize, handleRequestZoom]);

	useEffect(() => {
		// When the spectator page mounts we want to snap-fit the initial scene.
		const timer = window.setTimeout(handleFitZoom, 250);
		return () => window.clearTimeout(timer);
	}, [handleFitZoom]);

	const sessionGated =
		sessionStatus.state === "paused" || sessionStatus.state === "ended";

	return (
		<Layout fullBleed>
			<div className="vtt-shell relative w-full h-[100dvh] overflow-hidden">
				<VTTTopBar
					autoHide={false}
					left={
						<>
							<Badge variant="outline" className="text-[10px] shrink-0">
								SPECTATOR
							</Badge>
							<span
								data-testid="vtt-scene-title"
								className="text-sm font-semibold text-primary/90 truncate"
							>
								{currentScene?.name || "Waiting for Warden…"}
							</span>
						</>
					}
					right={
						<Badge
							variant={vttRealtime.isConnected ? "default" : "destructive"}
							className="text-[10px]"
						>
							{vttRealtime.isConnected ? "LIVE" : "OFFLINE"}
						</Badge>
					}
				/>

				<div
					className={cn(
						"absolute inset-0 pt-[44px] px-2 pb-2 flex",
						"vtt-content",
					)}
				>
					<div className="vtt-map-area relative flex-1 min-h-0 min-w-0 overflow-hidden">
						<VTTZoomHud
							zoom={zoom}
							onRequestZoom={handleRequestZoom}
							onFit={handleFitZoom}
							minimal
						/>
						{sessionGated && (
							<div className="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-sm">
								<AscendantWindow
									title={
										sessionStatus.state === "ended"
											? "SESSION ENDED"
											: "SESSION PAUSED"
									}
									variant="alert"
								>
									<AscendantText className="block text-sm text-foreground/70">
										{sessionStatus.message ??
											(sessionStatus.state === "ended"
												? "Your Warden has ended the session."
												: "Your Warden has paused the session.")}
									</AscendantText>
								</AscendantWindow>
							</div>
						)}

						{!currentScene ? (
							<div className="absolute inset-0 flex items-center justify-center">
								<AscendantText className="text-sm text-foreground/60">
									Connecting to scene…
								</AscendantText>
							</div>
						) : (
							<div
								ref={mapRef}
								className="h-full w-full overflow-auto relative bg-background"
							>
								<DynamicStyle
									className="vtt-map-container vtt-map-scene"
									vars={{
										width: `${currentScene.width * gridSize * zoom}px`,
										height: `${currentScene.height * gridSize * zoom}px`,
									}}
								>
									<VttPixiStage
										containerRef={mapRef}
										scene={currentScene}
										tokens={visibleTokens}
										gridSize={gridSize}
										zoom={zoom}
										showGrid
										isWarden={false}
										effectiveVisibleLayers={{
											0: true,
											1: true,
											2: true,
											3: false, // never render GM layer to spectators
										}}
										activeTokenId={null}
										setActiveTokenId={() => undefined}
										updateToken={() => undefined}
										walls={currentScene.walls ?? []}
										lightSources={currentScene.lights ?? []}
										gridConfig={{
											type: currentScene.gridType,
											size: gridSize,
										}}
										onRequestZoom={handleRequestZoom}
									/>
								</DynamicStyle>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default VTTSpectator;
