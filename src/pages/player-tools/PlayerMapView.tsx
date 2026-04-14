import { ArrowLeft, Crosshair, Dice1, Minus, Plus, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantText, RiftHeading } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SharedDiceTray } from "@/components/vtt/dice/SharedDiceTray";
import { PlayerToolsPanel } from "@/components/vtt/PlayerToolsPanel";
import { VTTAssetBrowser } from "@/components/vtt/VTTAssetBrowser";
import { VTTCharacterPanel } from "@/components/vtt/VTTCharacterPanel";
import { useCampaignCombatSession } from "@/hooks/useCampaignCombat";
import { useCampaignMembers } from "@/hooks/useCampaigns";
import { useCampaignToolState } from "@/hooks/useToolState";
import { useVTTRealtime } from "@/hooks/useVTTRealtime";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { cn } from "@/lib/utils";
import "@/styles/vtt-player-map.css";
import "@/styles/vtt-performance.css";
import "./PlayerMapView.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import type { LibraryToken } from "@/data/tokenLibraryDefaults";
import {
	type AmbientSoundZone,
	getWeatherCSSAnimation,
	type TerrainZone,
	type VTTDrawing,
	WEATHER_PRESETS,
	type WeatherType,
} from "@/lib/vtt";

interface PlacedToken {
	id: string;
	characterId?: string;
	tokenType?: LibraryToken["type"];
	name: string;
	emoji?: string;
	imageUrl?: string;
	color?: string;
	size: "small" | "medium" | "large" | "huge";
	x: number;
	y: number;
	rotation: number;
	layer: number;
	locked: boolean;
	render?: LibraryToken["render"];
	hp?: number;
	maxHp?: number;
	ac?: number;
	initiative?: number;
	conditions?: string[];
	visible: boolean;
	ownerId?: string;
	auraRadius?: number;
	auraColor?: string;
	lightRadius?: number;
	lightDimRadius?: number;
	showNameplate?: boolean;
	barVisibility?: "always" | "owner" | "Warden";
}

interface Scene {
	id: string;
	name: string;
	width: number;
	height: number;
	backgroundImage?: string;
	backgroundScale?: number;
	backgroundOffsetX?: number;
	backgroundOffsetY?: number;
	gridSize?: number;
	tokens: PlacedToken[];
	fogOfWar: boolean;
	fogData?: boolean[][];
	drawings?: VTTDrawing[];
	weather?: WeatherType;
	terrain?: TerrainZone[];
	ambientSounds?: AmbientSoundZone[];
}

const toSafeClassName = (id: string) => id.replace(/[^a-zA-Z0-9-]/g, "-");

type VTTScenesState = {
	scenes: Scene[];
	currentSceneId: string | null;
};

const SIZE_VALUES = {
	small: 32,
	medium: 48,
	large: 64,
	huge: 96,
};

const PlayerMapView = ({
	campaignId,
	sessionId,
}: {
	campaignId?: string;
	sessionId?: string;
} = {}) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const effectiveCampaignId = (campaignId ||
		searchParams.get("campaign") ||
		"") as string;
	const effectiveSessionId = (sessionId ||
		searchParams.get("sessionId") ||
		"") as string;
	const { user } = useAuth();

	// Query campaign members to find player's character even without token
	const { data: members } = useCampaignMembers(effectiveCampaignId);
	const myCharacterId = useMemo(() => {
		if (!user?.id || !members) return null;
		const myMember = members.find(
			(m: { user_id?: string }) => m.user_id === user.id,
		);
		if (!myMember) return null;
		const chars = (myMember as Record<string, unknown>).characters;
		if (chars && typeof chars === "object" && "id" in chars)
			return (chars as Record<string, unknown>).id as string;
		// Also check character_id directly on the member
		if ((myMember as Record<string, unknown>).character_id)
			return (myMember as Record<string, unknown>).character_id as string;
		return null;
	}, [members, user?.id]);

	const mapRef = useRef<HTMLDivElement>(null);
	const [zoom, setZoom] = useState(1);
	const [showGrid, setShowGrid] = useState(true);
	const [newMessage, setNewMessage] = useState("");
	const [draggedTokenId, setDraggedTokenId] = useState<string | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [mobilePanel, setMobilePanel] = useState<string | null>(null);
	const _touchRef = useRef<{ startDist: number; startZoom: number } | null>(
		null,
	);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	// Scene state received from Warden
	const [currentScene, setCurrentScene] = useState<Scene | null>(null);

	const { data: combatData } = useCampaignCombatSession(
		effectiveCampaignId,
		effectiveSessionId,
	);
	const activeTurnIndex = combatData?.session?.current_turn ?? -1;

	// Realtime connection
	const vttRealtime = useVTTRealtime({
		campaignId: effectiveCampaignId,
		sessionId: effectiveSessionId || undefined,
		isWarden: false,
	});

	// Subscribe to campaign_tool_states for scene data from Warden
	const toolKey = effectiveSessionId
		? `vtt_scenes:${effectiveSessionId}`
		: "vtt_scenes";
	const legacyStorageKey = effectiveCampaignId
		? `vtt-scenes-${effectiveCampaignId}${effectiveSessionId ? `-${effectiveSessionId}` : ""}`
		: "vtt-scenes";
	const { state: storedState, isLoading } =
		useCampaignToolState<VTTScenesState>(effectiveCampaignId || null, toolKey, {
			initialState: { scenes: [], currentSceneId: null },
			storageKey: legacyStorageKey,
		});

	// Hydrate scene from stored state
	useEffect(() => {
		if (isLoading) return;
		const scenes = Array.isArray(storedState.scenes) ? storedState.scenes : [];
		if (scenes.length > 0) {
			const selected =
				scenes.find((s) => s.id === storedState.currentSceneId) || scenes[0];
			setCurrentScene(selected);
		}
	}, [isLoading, storedState.currentSceneId, storedState.scenes]);

	// Also subscribe to realtime postgres changes for campaign_tool_states
	useEffect(() => {
		if (!effectiveCampaignId || !isSupabaseConfigured) return;

		const channel = supabase
			.channel(`player-vtt-scenes-${effectiveCampaignId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "campaign_tool_states",
					filter: `campaign_id=eq.${effectiveCampaignId}`,
				},
				(payload) => {
					const row = payload.new as {
						tool_key?: string;
						state?: VTTScenesState;
						updated_by?: string | null;
					} | null;
					if (!row || row.tool_key !== toolKey || !row.state) return;
					if (row.updated_by && row.updated_by === user?.id) return;
					const incoming = row.state;
					if (!Array.isArray(incoming.scenes)) return;
					const selected =
						incoming.scenes.find(
							(s: Scene) => s.id === incoming.currentSceneId,
						) ||
						incoming.scenes[0] ||
						null;
					setCurrentScene(selected);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [effectiveCampaignId, toolKey, user?.id]);

	// Listen for realtime broadcasts from Warden
	useEffect(() => {
		if (!effectiveCampaignId) return;

		const unsub1 = vttRealtime.on("token_move", (payload) => {
			if (payload.movedBy === vttRealtime.userId) return;
			setCurrentScene((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					tokens: prev.tokens.map((t) =>
						t.id === payload.tokenId ? { ...t, x: payload.x, y: payload.y } : t,
					),
				};
			});
		});

		const unsub2 = vttRealtime.on("token_update", (payload) => {
			if (payload.updatedBy === vttRealtime.userId) return;
			setCurrentScene((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					tokens: prev.tokens.map((t) =>
						t.id === payload.tokenId
							? { ...t, ...(payload.updates as Partial<PlacedToken>) }
							: t,
					),
				};
			});
		});

		const unsub3 = vttRealtime.on("token_add", (payload) => {
			setCurrentScene((prev) => {
				if (!prev) return prev;
				const newToken = payload.token as unknown as PlacedToken;
				if (prev.tokens.some((t) => t.id === newToken.id)) return prev;
				return { ...prev, tokens: [...prev.tokens, newToken] };
			});
		});

		const unsub4 = vttRealtime.on("token_remove", (payload) => {
			setCurrentScene((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					tokens: prev.tokens.filter((t) => t.id !== payload.tokenId),
				};
			});
		});

		const unsub5 = vttRealtime.on("scene_sync", (payload) => {
			if (payload.syncedBy === vttRealtime.userId) return;
			const incoming = payload.scenes as Scene[];
			const selected =
				incoming.find((s) => s.id === payload.currentSceneId) ||
				incoming[0] ||
				null;
			setCurrentScene(selected);
		});

		const unsub6 = vttRealtime.on("scene_change", (payload) => {
			if (payload.changedBy === vttRealtime.userId) return;
			// Scene change handled by campaign_tool_states subscription
		});

		return () => {
			unsub1();
			unsub2();
			unsub3();
			unsub4();
			unsub5();
			unsub6();
		};
	}, [effectiveCampaignId, vttRealtime]);

	const gridSize = currentScene?.gridSize ?? 50;

	// Visible tokens (player only sees visible tokens, not Warden (Warden) layer)
	const visibleTokens = useMemo(() => {
		if (!currentScene?.tokens) return [];
		return currentScene.tokens.filter((t) => t.visible && t.layer !== 3);
	}, [currentScene?.tokens]);

	// Check if user owns a token
	const isOwnToken = useCallback(
		(token: PlacedToken) => {
			if (!user?.id) return false;
			return token.ownerId === user.id || token.characterId === user.id;
		},
		[user?.id],
	);

	// Initiative order
	const tokensInInitiative = useMemo(
		() =>
			[...visibleTokens]
				.filter((t) => t.initiative !== undefined && t.initiative !== null)
				.sort((a, b) => (b.initiative || 0) - (a.initiative || 0)),
		[visibleTokens],
	);

	// Grid position from mouse event
	const getGridPosition = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!mapRef.current) return null;
			const rect = mapRef.current.getBoundingClientRect();
			const scrollLeft = mapRef.current.scrollLeft;
			const scrollTop = mapRef.current.scrollTop;
			const x = e.clientX - rect.left + scrollLeft;
			const y = e.clientY - rect.top + scrollTop;
			const gx = Math.floor(x / (gridSize * zoom));
			const gy = Math.floor(y / (gridSize * zoom));
			return { gx, gy };
		},
		[gridSize, zoom],
	);

	// Double-click to ping
	const handleMapDoubleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const pos = getGridPosition(e);
			if (pos) {
				vttRealtime.sendPing(pos.gx, pos.gy);
			}
		},
		[getGridPosition, vttRealtime],
	);

	// Token drag handlers — players can drag tokens they own
	const handleTokenMouseDown = useCallback(
		(token: PlacedToken, e: React.MouseEvent) => {
			if (token.locked || !isOwnToken(token)) return;
			e.stopPropagation();
			setDraggedTokenId(token.id);
		},
		[isOwnToken],
	);

	const handleMapMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!draggedTokenId) return;
			const pos = getGridPosition(e);
			if (!pos) return;
			setCurrentScene((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					tokens: prev.tokens.map((t) =>
						t.id === draggedTokenId ? { ...t, x: pos.gx, y: pos.gy } : t,
					),
				};
			});
		},
		[draggedTokenId, getGridPosition],
	);

	const handleMapMouseUp = useCallback(() => {
		if (!draggedTokenId) return;
		const token = currentScene?.tokens.find((t) => t.id === draggedTokenId);
		if (token) {
			vttRealtime.broadcastTokenMove(draggedTokenId, token.x, token.y);
		}
		setDraggedTokenId(null);
	}, [currentScene?.tokens, draggedTokenId, vttRealtime]);

	// Broadcast cursor position on mouse move (throttled)
	const lastCursorBroadcast = useRef(0);
	const handleCursorMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const now = Date.now();
			if (now - lastCursorBroadcast.current < 100) return; // throttle 100ms
			lastCursorBroadcast.current = now;
			const pos = getGridPosition(e);
			if (pos) {
				vttRealtime.updateCursor({ x: pos.gx, y: pos.gy });
			}
		},
		[getGridPosition, vttRealtime],
	);

	const sceneWidth = currentScene?.width ?? 20;
	const sceneHeight = currentScene?.height ?? 20;

	const _overlayStyles = useMemo(() => {
		const parts: string[] = [];
		const sceneWidthPx = sceneWidth * gridSize * zoom;
		const sceneHeightPx = sceneHeight * gridSize * zoom;
		parts.push(
			`.vtt-map-scene { --scene-width: ${sceneWidthPx}px; --scene-height: ${sceneHeightPx}px; }`,
		);

		if (currentScene?.drawings) {
			currentScene.drawings.forEach((drawing) => {
				if (drawing.layer === "Warden") return;
				const safeId = toSafeClassName(drawing.id);

				if (
					drawing.type === "line" ||
					drawing.type === "rectangle" ||
					drawing.type === "circle"
				) {
					const p1 = drawing.points[0];
					const p2 = drawing.points[1] || p1;
					const x1 = Math.min(p1.x, p2.x) * gridSize * zoom;
					const y1 = Math.min(p1.y, p2.y) * gridSize * zoom;
					const x2 = Math.max(p1.x, p2.x) * gridSize * zoom;
					const y2 = Math.max(p1.y, p2.y) * gridSize * zoom;

					if (drawing.type === "line") {
						const startX = (p1.x + 0.5) * gridSize * zoom;
						const startY = (p1.y + 0.5) * gridSize * zoom;
						const endX = (p2.x + 0.5) * gridSize * zoom;
						const endY = (p2.y + 0.5) * gridSize * zoom;
						const length = Math.hypot(endX - startX, endY - startY);
						const angle =
							(Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;
						parts.push(
							`.vtt-drawing-line-${safeId} { left: ${startX}px; top: ${startY}px; width: ${length}px; height: ${drawing.strokeWidth}px; background-color: ${drawing.color}; transform: rotate(${angle}deg); transform-origin: 0 50%; opacity: ${drawing.fillOpacity ?? 1}; }`,
						);
						return;
					}

					const width = Math.max(1, x2 - x1) + gridSize * zoom;
					const height = Math.max(1, y2 - y1) + gridSize * zoom;
					const fill = drawing.fillColor ?? "transparent";

					parts.push(
						`.vtt-drawing-shape-${safeId} { left: ${x1}px; top: ${y1}px; width: ${width}px; height: ${height}px; border-color: ${drawing.color}; border-width: ${drawing.strokeWidth}px; background-color: ${fill}; opacity: ${drawing.fillOpacity ?? 0.18}; }`,
					);
				}
			});
		}
		return parts.join("\n");
	}, [currentScene?.drawings, gridSize, sceneWidth, sceneHeight, zoom]);

	return (
		<Layout>
			<div className="container mx-auto px-4 py-4 max-w-[1920px]">
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<div>
						<Button variant="ghost" onClick={() => navigate("/player-tools")}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Player Tools
						</Button>
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="mt-1"
						>
							BATTLE MAP {currentScene ? `— ${currentScene.name}` : ""}
						</RiftHeading>
					</div>

					<div className="flex items-center gap-2">
						<Badge
							variant={vttRealtime.isConnected ? "default" : "destructive"}
						>
							{vttRealtime.isConnected ? "Connected" : "Disconnected"}
						</Badge>
						{vttRealtime.activeUsers.length > 0 && (
							<div className="flex -space-x-1.5">
								{vttRealtime.activeUsers.slice(0, 5).map((u) => (
									<DynamicStyle
										key={u.userId}
										className="vtt-user-avatar"
										vars={{ "--avatar-bg-color": u.color }}
										title={`${u.userName} (${u.role})`}
									>
										{u.userName.charAt(0).toUpperCase()}
									</DynamicStyle>
								))}
							</div>
						)}
					</div>
				</div>

				{!effectiveCampaignId ? (
					<AscendantWindow title="NO CAMPAIGN" variant="alert">
						<AscendantText className="block text-sm text-muted-foreground">
							Open this page from a campaign to view the shared map.
						</AscendantText>
					</AscendantWindow>
				) : (
					<div
						className={cn(
							"grid grid-cols-1 xl:grid-cols-12 gap-4",
							"vtt-main-grid",
						)}
					>
						{/* Main Map Area */}
						<div className="col-span-1 xl:col-span-9 min-h-0">
							<AscendantWindow
								title="MAP"
								className={cn(
									"min-h-[40vh] xl:min-h-0 xl:h-full",
									isMobile && "h-[100dvh]",
								)}
								contentClassName="flex-1 flex flex-col"
							>
								{/* Controls */}
								<div className="flex items-center gap-2 mb-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
									>
										<Minus className="w-3 h-3" />
									</Button>
									<span className="text-xs w-12 text-center">
										{Math.round(zoom * 100)}%
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setZoom(Math.min(2, zoom + 0.1))}
									>
										<Plus className="w-3 h-3" />
									</Button>
									{!isMobile && (
										<div className="flex items-center gap-1 ml-2">
											<input
												type="checkbox"
												checked={showGrid}
												onChange={(e) => setShowGrid(e.target.checked)}
												className="w-3 h-3"
												id="playerGrid"
											/>
											<label
												htmlFor="playerGrid"
												className="text-xs cursor-pointer"
											>
												Grid
											</label>
										</div>
									)}
									{!isMobile && (
										<div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
											<Crosshair className="w-3 h-3" />
											Double-click to ping
										</div>
									)}
								</div>

								{/* Map Canvas */}
								<div
									ref={mapRef}
									className="flex-1 relative border-2 border-border rounded-lg bg-background overflow-auto"
									onMouseMove={(e) => {
										handleMapMouseMove(e);
										handleCursorMove(e);
									}}
									onMouseUp={handleMapMouseUp}
									onMouseLeave={handleMapMouseUp}
									onDoubleClick={handleMapDoubleClick}
									role="application"
									aria-label="Battle Map Canvas"
								>
									<ErrorBoundary>
										<DynamicStyle
											className="vtt-map-container vtt-map-scene"
											vars={{
												width: `${sceneWidth * gridSize * zoom}px`,
												height: `${sceneHeight * gridSize * zoom}px`,
											}}
										>
											{/* Background image */}
											{currentScene?.backgroundImage && (
												<div className="absolute inset-0">
													<DynamicStyle
														vars={{
															"--bg-scale": currentScene.backgroundScale ?? 1,
														}}
													>
														<OptimizedImage
															src={currentScene.backgroundImage}
															alt="Map background"
															className="w-full h-full object-cover vtt-background-image"
															size="large"
														/>
													</DynamicStyle>
												</div>
											)}

											{/* Grid overlay */}
											{showGrid && (
												<DynamicStyle
													as="div"
													className="vtt-grid-overlay"
													vars={{
														"--grid-bg-size": `${gridSize * zoom}px ${gridSize * zoom}px`,
														"--grid-border-color": "hsl(var(--border))",
													}}
												/>
											)}

											{/* Fog of war */}
											{currentScene?.fogOfWar && currentScene.fogData && (
												<div className="absolute inset-0 pointer-events-none vtt-fog-overlay-layer z-[90]">
													{currentScene.fogData
														.flatMap((row, ry) =>
															row.map((revealed, rx) => ({ revealed, rx, ry })),
														)
														.map((cell) =>
															!cell.revealed ? (
																<DynamicStyle
																	key={`fog-${cell.rx}-${cell.ry}`}
																	className="absolute vtt-fog-cell bg-black"
																	vars={{
																		left: `${cell.rx * gridSize * zoom}px`,
																		top: `${cell.ry * gridSize * zoom}px`,
																		width: `${gridSize * zoom}px`,
																		height: `${gridSize * zoom}px`,
																		opacity: 0.9,
																	}}
																/>
															) : null,
														)}
												</div>
											)}

											{/* DOM Overlays (Drawings, Terrain, Weather, Ambient Sounds) */}
											{currentScene?.terrain &&
												currentScene.terrain.length > 0 && (
													<div className="absolute inset-0 pointer-events-none z-[1]">
														<svg className="absolute inset-0 w-full h-full overflow-visible">
															<title>Map Terrain Zones</title>
															{currentScene.terrain.map((zone) => {
																if (!zone.visible) return null;
																const gZoom = gridSize * zoom;
																const pointsStr = zone.vertices
																	.map(
																		(v) =>
																			`${(v.x + 0.5) * gZoom},${(v.y + 0.5) * gZoom}`,
																	)
																	.join(" ");
																return (
																	<polygon
																		key={zone.id}
																		points={pointsStr}
																		fill={zone.fillColor}
																		stroke={zone.fillColor.replace(
																			/[\d.]+\)$/g,
																			"1)",
																		)}
																		strokeWidth={2}
																	/>
																);
															})}
														</svg>
													</div>
												)}

											{currentScene?.drawings &&
												currentScene.drawings.length > 0 && (
													<div className="absolute inset-0 pointer-events-none z-[2]">
														{currentScene.drawings.map((drawing) => {
															if (drawing.layer === "Warden") return null; // Only player layers

															if (drawing.type === "freehand") {
																const gZoom = gridSize * zoom;
																const pointsStr = drawing.points
																	.map(
																		(p) =>
																			`${(p.x + 0.5) * gZoom},${(p.y + 0.5) * gZoom}`,
																	)
																	.join(" ");
																return (
																	<svg
																		key={drawing.id}
																		className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
																	>
																		<title>Map Freehand Drawing</title>
																		<polyline
																			points={pointsStr}
																			fill="none"
																			stroke={drawing.color}
																			strokeWidth={drawing.strokeWidth}
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			opacity={drawing.fillOpacity ?? 1}
																		/>
																	</svg>
																);
															}

															if (drawing.type === "line") {
																return (
																	<div
																		key={drawing.id}
																		className={cn(
																			"vtt-drawing-line absolute origin-left rounded-full pointer-events-none",
																			`vtt-drawing-line-${toSafeClassName(drawing.id)}`,
																		)}
																	/>
																);
															}
															return (
																<div
																	key={drawing.id}
																	className={cn(
																		"vtt-drawing-shape absolute border-solid box-border pointer-events-none",
																		drawing.type === "circle" && "rounded-full",
																		`vtt-drawing-shape-${toSafeClassName(drawing.id)}`,
																	)}
																/>
															);
														})}
													</div>
												)}

											{/* Weather overlay */}
											{currentScene?.weather &&
												currentScene.weather !== "clear" &&
												WEATHER_PRESETS[
													currentScene.weather as keyof typeof WEATHER_PRESETS
												] && (
													<div
														className="absolute inset-0 pointer-events-none z-[100] overflow-hidden mix-blend-screen opacity-80"
														data-testid="vtt-weather-overlay"
													>
														<style>
															{getWeatherCSSAnimation(
																WEATHER_PRESETS[
																	currentScene.weather as keyof typeof WEATHER_PRESETS
																],
															)}
														</style>
														{Array.from({
															length: Math.min(
																WEATHER_PRESETS[
																	currentScene.weather as keyof typeof WEATHER_PRESETS
																].particleCount,
																200,
															),
														})
															.map((_, idx) => idx)
															.map((i) => {
																const size = Math.random() * 4 + 2;
																const left = Math.random() * 100;
																const top = Math.random() * 100;
																const animDuration = Math.random() * 2 + 1;
																const delay = Math.random() * -2;
																return (
																	<DynamicStyle
																		key={`weather-particle-${currentScene.weather}-${i}`}
																		className="absolute rounded-full"
																		vars={{
																			width: `${size}px`,
																			height: `${size}px`,
																			left: `${left}%`,
																			top: `${top}%`,
																			backgroundColor:
																				WEATHER_PRESETS[
																					currentScene?.weather as keyof typeof WEATHER_PRESETS
																				].particleColor,
																			animation: `weather-particle-${currentScene?.weather} ${animDuration}s linear infinite`,
																			animationDelay: `${delay}s`,
																		}}
																	/>
																);
															})}
													</div>
												)}

											{/* Token Auras */}
											{visibleTokens
												.filter((t) => t.auraRadius && t.auraRadius > 0)
												.map((token) => {
													const auraSize =
														((token.auraRadius as number) * 2 + 1) *
														gridSize *
														zoom;
													const tokenSize = SIZE_VALUES[token.size] * zoom;
													const centerOffset = tokenSize / 2 - auraSize / 2;
													return (
														<DynamicStyle
															key={`aura-${token.id}`}
															className="absolute rounded-full pointer-events-none animate-pulse vtt-token-aura"
															vars={{
																"--aura-left":
																	token.x * gridSize * zoom + centerOffset,
																"--aura-top":
																	token.y * gridSize * zoom + centerOffset,
																"--aura-size": `${auraSize}px`,
																"--aura-bg-color": `${token.auraColor || "#3b82f6"}18`,
																"--aura-border-color": `${token.auraColor || "#3b82f6"}40`,
																"--aura-z-index": token.layer * 10 + 5,
															}}
														/>
													);
												})}

											{/* Tokens */}
											{visibleTokens.map((token) => {
												const size = SIZE_VALUES[token.size] * zoom;
												const canDrag = isOwnToken(token) && !token.locked;
												const hpPercent =
													token.maxHp && token.maxHp > 0
														? ((token.hp ?? 0) / token.maxHp) * 100
														: null;
												const isOverlay =
													token.tokenType === "effect" ||
													token.tokenType === "prop";
												return (
													<DynamicStyle
														as="button"
														type="button"
														key={token.id}
														className={cn(
															"vtt-token-container transition-all p-0 bg-transparent border-none text-left",
															canDrag ? "cursor-move" : "cursor-default",
															draggedTokenId === token.id && "opacity-70",
														)}
														vars={{
															"--token-x": token.x * gridSize * zoom,
															"--token-y": token.y * gridSize * zoom,
															"--token-size": `${size}px`,
															"--token-rotation": `${token.rotation}deg`,
															"--token-z-index": token.layer,
														}}
														onMouseDown={
															canDrag
																? (e: React.MouseEvent) =>
																		handleTokenMouseDown(token, e)
																: undefined
														}
														title={`${token.name}${token.hp !== undefined ? ` (${token.hp}/${token.maxHp} HP)` : ""}${canDrag ? " — drag to move" : ""}`}
													>
														<DynamicStyle
															className={cn(
																"vtt-token-inner",
																isOverlay
																	? "vtt-token-overlay"
																	: "rounded-full vtt-token-base",
															)}
															vars={{
																"--token-bg-color": isOverlay
																	? "transparent"
																	: token.color
																		? `${token.color}40`
																		: "rgba(0,0,0,0.3)",
																"--token-border-color": isOverlay
																	? "transparent"
																	: token.color || "hsl(var(--primary))",
																"--token-font-size": `${size * 0.35}px`,
															}}
														>
															{token.imageUrl ? (
																<OptimizedImage
																	src={token.imageUrl}
																	alt={token.name}
																	className={cn(
																		"w-full h-full",
																		isOverlay
																			? "object-contain"
																			: "object-cover rounded-full",
																	)}
																	size="small"
																/>
															) : (
																token.emoji ||
																token.name.charAt(0).toUpperCase()
															)}
														</DynamicStyle>

														{/* HP bar */}
														{hpPercent !== null && !isOverlay && (
															<div className="vtt-hp-bar-container">
																<DynamicStyle
																	as="div"
																	className={cn(
																		"vtt-hp-bar vtt-hp-bar-fill",
																		(hpPercent as number) > 50 && "high",
																		(hpPercent as number) > 25 &&
																			(hpPercent as number) <= 50 &&
																			"medium",
																		(hpPercent as number) <= 25 && "low",
																	)}
																	vars={{
																		"--hp-width": `${Math.max(0, Math.min(100, hpPercent))}%`,
																	}}
																/>
															</div>
														)}

														{/* Conditions */}
														{token.conditions &&
															token.conditions.length > 0 && (
																<div className="vtt-conditions">
																	{token.conditions.slice(0, 3).map((cond) => (
																		<span
																			key={`${token.id}-cond-${cond}`}
																			className="vtt-condition-badge"
																			title={cond}
																		>
																			{cond.charAt(0).toUpperCase()}
																		</span>
																	))}
																</div>
															)}
													</DynamicStyle>
												);
											})}

											{/* Pings overlay */}
											{vttRealtime.pings.length > 0 && (
												<div className="absolute inset-0 pointer-events-none vtt-pings-overlay z-[100]">
													{vttRealtime.pings.map((ping) => (
														<DynamicStyle
															key={ping.createdAt}
															className="absolute animate-ping vtt-ping"
															vars={{
																"--ping-left": (ping.x + 0.5) * gridSize * zoom,
																"--ping-top": (ping.y + 0.5) * gridSize * zoom,
																"--ping-color": ping.color,
																left: "var(--ping-left)px",
																top: "var(--ping-top)px",
																width: "40px",
																height: "40px",
																borderRadius: "50%",
																transform: "translate(-50%, -50%)",
																border: `4px solid ${ping.color}`,
															}}
														/>
													))}
												</div>
											)}

											{/* Remote cursors */}
											{vttRealtime.activeUsers.filter((u) => u.cursor).length >
												0 && (
												<div className="absolute inset-0 pointer-events-none vtt-cursors-overlay">
													{vttRealtime.activeUsers
														.filter((u) => u.cursor)
														.map((u) => (
															<DynamicStyle
																key={u.userId}
																className="absolute transition-all duration-100"
																vars={{
																	"--cursor-left":
																		((u.cursor?.x ?? 0) + 0.5) *
																		gridSize *
																		zoom,
																	"--cursor-top":
																		((u.cursor?.y ?? 0) + 0.5) *
																		gridSize *
																		zoom,
																}}
															>
																<DynamicStyle
																	className="w-3 h-3 rounded-full border-2 border-white vtt-cursor-dot"
																	vars={{
																		"--cursor-dot-bg": u.color,
																	}}
																/>
																<DynamicStyle
																	className="absolute top-4 left-0 text-[10px] px-1 rounded text-white whitespace-nowrap vtt-cursor-label"
																	vars={{
																		"--cursor-label-bg": u.color,
																	}}
																>
																	{u.userName}
																</DynamicStyle>
															</DynamicStyle>
														))}
												</div>
											)}

											{/* Empty state */}
											{visibleTokens.length === 0 &&
												!currentScene?.backgroundImage && (
													<div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
														<p className="text-sm font-mono uppercase tracking-widest animate-pulse">
															Waiting for Warden to establish lattice link...
														</p>
													</div>
												)}
										</DynamicStyle>
									</ErrorBoundary>
								</div>
							</AscendantWindow>
						</div>

						{/* Right Sidebar — hidden on mobile, shown via bottom sheet */}
						<div
							className={cn(
								"col-span-1 xl:col-span-3 flex flex-col gap-4 xl:overflow-y-auto min-h-0",
								isMobile && "hidden",
							)}
						>
							{/* Player Tools Panel */}
							<PlayerToolsPanel
								characterId={myCharacterId || undefined}
								onRollDice={(formula) => vttRealtime.rollAndBroadcast(formula)}
								onSendMessage={(message, type) =>
									vttRealtime.sendChatMessage(message, type as never)
								}
								onUseAbility={(ability) => {
									// Handle ability usage
									vttRealtime.rollAndBroadcast(`1d20+${ability}`);
								}}
								onCastSpell={(spellId) => {
									// Handle spell casting
									vttRealtime.sendChatMessage(`Casts ${spellId}!`, "emote");
								}}
								onTakeAction={(action) => {
									// Handle action taken
									vttRealtime.sendChatMessage(
										`Takes ${action} action!`,
										"emote",
									);
								}}
							/>

							<Tabs defaultValue="sheet" className="w-full">
								<TabsList className="grid w-full grid-cols-5">
									<TabsTrigger value="sheet">Sheet</TabsTrigger>
									<TabsTrigger value="chat">Chat</TabsTrigger>
									<TabsTrigger value="dice">Dice</TabsTrigger>
									<TabsTrigger value="init">Init</TabsTrigger>
									<TabsTrigger value="assets">Assets</TabsTrigger>
								</TabsList>

								<TabsContent
									value="sheet"
									className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto"
								>
									{(() => {
										// Auto-detect: first from owned token, then from campaign membership
										const ownToken = visibleTokens.find(
											(t) => isOwnToken(t) && t.characterId,
										);
										const charId = ownToken?.characterId || myCharacterId;
										if (charId) {
											return (
												<VTTCharacterPanel
													characterId={charId}
													onRoll={(formula) =>
														vttRealtime.rollAndBroadcast(formula)
													}
													onChat={(msg, type) =>
														vttRealtime.sendChatMessage(msg, type)
													}
													campaignId={effectiveCampaignId}
												/>
											);
										}
										return (
											<AscendantWindow title="CHARACTER" compact>
												<AscendantText className="block text-xs text-muted-foreground text-center py-4">
													No character linked. Join the campaign with a
													character to see your sheet here.
												</AscendantText>
											</AscendantWindow>
										);
									})()}
								</TabsContent>

								<TabsContent value="chat" className="space-y-2">
									<AscendantWindow
										title="CHAT"
										className="flex flex-col h-[400px]"
									>
										<div className="flex-1 overflow-y-auto space-y-2 mb-2">
											{vttRealtime.chatMessages.map((msg) => (
												<div key={msg.id} className="text-xs">
													{msg.type === "emote" ? (
														<div className="p-1.5 rounded border-l-2 border-amber-500 bg-amber-500/10 italic text-amber-200">
															* {msg.userName} {msg.message}
														</div>
													) : msg.type === "desc" ? (
														<div className="p-1.5 rounded border border-slate-600 bg-slate-800/60 text-center font-heading text-slate-200">
															{msg.message}
														</div>
													) : (
														<>
															<div className="flex items-center gap-1 mb-0.5">
																<span className="font-semibold text-foreground">
																	{msg.userName}
																</span>
																{msg.type === "whisper" && (
																	<Badge
																		variant="outline"
																		className="text-[9px] px-1 py-0 border-teal-500/50 text-teal-400"
																	>
																		whisper
																	</Badge>
																)}
																{msg.type === "wardenroll" && (
																	<Badge
																		variant="outline"
																		className="text-[9px] px-1 py-0 border-amber-500/50 text-amber-400"
																	>
																		Warden
																	</Badge>
																)}
																<span className="text-muted-foreground text-[10px]">
																	{new Date(msg.timestamp).toLocaleTimeString()}
																</span>
															</div>
															<div
																className={cn(
																	"p-1.5 rounded",
																	msg.type === "chat" &&
																		"border border-border bg-muted/20",
																	msg.type === "rift" &&
																		"border-l-2 border-slate-500 bg-slate-800/40 text-slate-300",
																	msg.type === "dice" &&
																		"border border-cyan-500/40 bg-cyan-950/30 text-cyan-100",
																	msg.type === "wardenroll" &&
																		"border border-amber-500/40 bg-amber-950/30 text-amber-100",
																	msg.type === "whisper" &&
																		"border border-teal-500/30 bg-teal-950/30 italic text-teal-200",
																)}
															>
																{msg.diceDisplayText ? (
																	<span>
																		{msg.diceDisplayText
																			.split(/(\*\*.*?\*\*|~~.*?~~)/)
																			.map((part) => {
																				if (
																					part.startsWith("**") &&
																					part.endsWith("**")
																				) {
																					return (
																						<strong key={crypto.randomUUID()}>
																							{part.slice(2, -2)}
																						</strong>
																					);
																				}
																				if (
																					part.startsWith("~~") &&
																					part.endsWith("~~")
																				) {
																					return (
																						<del
																							key={crypto.randomUUID()}
																							className="opacity-40"
																						>
																							{part.slice(2, -2)}
																						</del>
																					);
																				}
																				return (
																					<span key={crypto.randomUUID()}>
																						{part}
																					</span>
																				);
																			})}
																	</span>
																) : (
																	msg.message
																)}
																{msg.diceCritical && (
																	<span className="ml-1 text-green-400 font-bold">
																		CRITICAL!
																	</span>
																)}
																{msg.diceFumble && (
																	<span className="ml-1 text-red-400 font-bold">
																		FUMBLE!
																	</span>
																)}
															</div>
														</>
													)}
												</div>
											))}
										</div>
										<div className="text-[9px] text-muted-foreground mb-1 px-1">
											/roll /w &quot;name&quot; /em /desc &bull; adv dis 4d6kh3
										</div>
										<div className="flex gap-2">
											<Input
												value={newMessage}
												onChange={(e) => setNewMessage(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === "Enter" && newMessage.trim()) {
														vttRealtime.processChat(newMessage);
														setNewMessage("");
													}
												}}
												placeholder="Type message or /roll 1d20+5..."
												className="text-xs h-8"
											/>
											<Button
												onClick={() => {
													if (newMessage.trim()) {
														vttRealtime.processChat(newMessage);
														setNewMessage("");
													}
												}}
												size="sm"
											>
												<Send className="w-3 h-3" />
											</Button>
										</div>
									</AscendantWindow>
								</TabsContent>

								<TabsContent value="dice" className="space-y-2">
									<AscendantWindow title="DICE ROLLER">
										<div className="space-y-3">
											<div className="grid grid-cols-2 gap-2">
												{["1d20", "1d12", "2d6", "1d100", "1d8", "1d4"].map(
													(formula) => (
														<Button
															key={formula}
															onClick={() =>
																vttRealtime.rollAndBroadcast(formula)
															}
															variant="outline"
															size="sm"
															className="text-xs"
														>
															<Dice1 className="w-3 h-3 mr-1" />
															{formula}
														</Button>
													),
												)}
											</div>
											<div className="flex gap-2">
												<Input
													placeholder="1d20+5"
													className="text-xs h-8"
													onKeyPress={(e) => {
														if (e.key === "Enter") {
															const input = e.target as HTMLInputElement;
															if (input.value.trim()) {
																vttRealtime.rollAndBroadcast(
																	input.value.trim(),
																);
																input.value = "";
															}
														}
													}}
												/>
											</div>
											<div className="max-h-40 overflow-y-auto space-y-1">
												{vttRealtime.chatMessages
													.filter((m) => m.type === "dice")
													.slice(-8)
													.map((roll) => (
														<div
															key={roll.id}
															className="text-xs p-1.5 rounded border bg-muted/30 flex justify-between"
														>
															<span className="truncate">
																{roll.userName}: {roll.diceFormula}
															</span>
															<span
																className={cn(
																	"font-bold ml-2",
																	roll.diceCritical && "text-green-400",
																)}
															>
																{roll.diceResult}
															</span>
														</div>
													))}
											</div>
										</div>
									</AscendantWindow>
								</TabsContent>

								<TabsContent value="init" className="space-y-2">
									<AscendantWindow title="INITIATIVE">
										<div className="space-y-2">
											{tokensInInitiative.length === 0 ? (
												<AscendantText className="block text-xs text-muted-foreground text-center py-4">
													No tokens in initiative order yet.
												</AscendantText>
											) : (
												tokensInInitiative.map((token, index) => {
													const hpPercent =
														token.maxHp && token.maxHp > 0
															? ((token.hp ?? 0) / token.maxHp) * 100
															: null;
													return (
														<div
															key={token.id}
															className={cn(
																"p-2 rounded border flex items-center gap-2",
																index === activeTurnIndex
																	? "bg-primary/20 border-primary"
																	: "",
															)}
														>
															<span className="font-resurge text-lg w-6 text-center">
																{index + 1}
															</span>
															<div className="flex-1 min-w-0">
																<div className="text-xs font-semibold truncate">
																	{token.name}
																</div>
																{hpPercent !== null && (
																	<div className="h-1 rounded-full bg-black/30 mt-0.5">
																		<DynamicStyle
																			as="div"
																			className={cn(
																				"h-full rounded-full vtt-initiative-hp-bar",
																				(hpPercent as number) > 50 && "high",
																				(hpPercent as number) > 25 &&
																					(hpPercent as number) <= 50 &&
																					"medium",
																				(hpPercent as number) <= 25 && "low",
																			)}
																			vars={{
																				"--initiative-hp-width": `${Math.max(0, Math.min(100, hpPercent))}%`,
																			}}
																		/>
																	</div>
																)}
															</div>
															<span className="text-xs font-semibold">
																{token.initiative}
															</span>
														</div>
													);
												})
											)}
										</div>
									</AscendantWindow>
								</TabsContent>

								<TabsContent value="assets" className="space-y-2">
									<AscendantWindow title="ASSET LIBRARY">
										<VTTAssetBrowser
											campaignId={campaignId}
											readOnly={false}
											onUseAsToken={(_imageUrl, name) => {
												vttRealtime.sendChatMessage(
													`wants to use "${name}" as their token`,
													"rift",
												);
											}}
										/>
									</AscendantWindow>
								</TabsContent>
							</Tabs>

							{/* Token list */}
							<AscendantWindow title="TOKENS ON MAP" compact>
								<div className="space-y-1 max-h-48 overflow-y-auto">
									{visibleTokens.map((token) => (
										<div
											key={token.id}
											className="flex items-center gap-2 text-xs p-1 rounded hover:bg-muted/30"
										>
											{token.imageUrl ? (
												<OptimizedImage
													src={token.imageUrl}
													alt={token.name}
													className="w-5 h-5 rounded-full object-cover"
													size="thumbnail"
												/>
											) : (
												<span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
													{token.emoji || token.name.charAt(0)}
												</span>
											)}
											<span className="truncate flex-1">{token.name}</span>
											{isOwnToken(token) && (
												<Badge
													variant="outline"
													className="text-[9px] px-1 py-0"
												>
													You
												</Badge>
											)}
										</div>
									))}
									{visibleTokens.length === 0 && (
										<AscendantText className="block text-xs text-muted-foreground text-center py-2">
											No tokens yet.
										</AscendantText>
									)}
								</div>
							</AscendantWindow>
						</div>
					</div>
				)}

				{/* Mobile Player Toolbar + Bottom Sheet */}
				{isMobile && effectiveCampaignId && (
					<>
						<div className="vtt-mobile-toolbar">
							<button
								type="button"
								onClick={() => setZoom(Math.max(0.5, zoom - 0.15))}
							>
								−
							</button>
							<span className="text-[10px] text-muted-foreground min-w-[32px] text-center">
								{Math.round(zoom * 100)}%
							</span>
							<button
								type="button"
								onClick={() => setZoom(Math.min(2, zoom + 0.15))}
							>
								+
							</button>
							<div className="w-px h-8 bg-border/30 mx-1" />
							<button
								type="button"
								className={cn(mobilePanel === "chat" && "active")}
								onClick={() =>
									setMobilePanel(mobilePanel === "chat" ? null : "chat")
								}
							>
								Chat
							</button>
							<button
								type="button"
								className={cn(mobilePanel === "dice" && "active")}
								onClick={() =>
									setMobilePanel(mobilePanel === "dice" ? null : "dice")
								}
							>
								Dice
							</button>
							<button
								type="button"
								className={cn(mobilePanel === "init" && "active")}
								onClick={() =>
									setMobilePanel(mobilePanel === "init" ? null : "init")
								}
							>
								Init
							</button>
							<button
								type="button"
								className={cn(mobilePanel === "sheet" && "active")}
								onClick={() =>
									setMobilePanel(mobilePanel === "sheet" ? null : "sheet")
								}
							>
								Sheet
							</button>
							<button
								type="button"
								className={cn(mobilePanel === "assets" && "active")}
								onClick={() =>
									setMobilePanel(mobilePanel === "assets" ? null : "assets")
								}
							>
								Assets
							</button>
						</div>

						<div className={cn("vtt-bottom-sheet", mobilePanel && "open")}>
							<div className="vtt-bottom-sheet-handle" />
							<div className="vtt-bottom-sheet-content">
								{mobilePanel === "chat" && (
									<div>
										<div className="space-y-2 max-h-[40vh] overflow-y-auto mb-2">
											{vttRealtime.chatMessages.slice(-20).map((msg) => (
												<div
													key={msg.id}
													className="text-xs p-1.5 rounded border border-border/40 bg-muted/10"
												>
													<span className="font-semibold">
														{msg.userName}:{" "}
													</span>
													{msg.diceDisplayText ? (
														<span>
															{msg.diceDisplayText
																.split(/(\*\*.*?\*\*|~~.*?~~)/)
																.map((part) => {
																	if (
																		part.startsWith("**") &&
																		part.endsWith("**")
																	) {
																		return (
																			<strong key={crypto.randomUUID()}>
																				{part.slice(2, -2)}
																			</strong>
																		);
																	}
																	if (
																		part.startsWith("~~") &&
																		part.endsWith("~~")
																	) {
																		return (
																			<del
																				key={crypto.randomUUID()}
																				className="opacity-40"
																			>
																				{part.slice(2, -2)}
																			</del>
																		);
																	}
																	return (
																		<span key={crypto.randomUUID()}>
																			{part}
																		</span>
																	);
																})}
														</span>
													) : (
														msg.message
													)}
												</div>
											))}
										</div>
										<div className="flex gap-1">
											<Input
												value={newMessage}
												onChange={(e) => setNewMessage(e.target.value)}
												placeholder="Type..."
												className="h-9 text-sm"
												onKeyPress={(e) => {
													if (e.key === "Enter" && newMessage.trim()) {
														vttRealtime.processChat(newMessage);
														setNewMessage("");
													}
												}}
											/>
											<Button
												size="sm"
												className="h-9 px-3"
												onClick={() => {
													if (newMessage.trim()) {
														vttRealtime.processChat(newMessage);
														setNewMessage("");
													}
												}}
											>
												Send
											</Button>
										</div>
									</div>
								)}
								{mobilePanel === "dice" && (
									<div className="grid grid-cols-4 gap-2">
										{[
											"1d4",
											"1d6",
											"1d8",
											"1d10",
											"1d12",
											"1d20",
											"2d6",
											"1d100",
										].map((formula) => (
											<Button
												key={formula}
												variant="outline"
												size="sm"
												className="text-xs h-10"
												onClick={() => vttRealtime.rollAndBroadcast(formula)}
											>
												{formula}
											</Button>
										))}
									</div>
								)}
								{mobilePanel === "init" && (
									<div className="space-y-1 max-h-[40vh] overflow-y-auto">
										{tokensInInitiative.length === 0 ? (
											<AscendantText className="block text-xs text-muted-foreground text-center py-4">
												No initiative order yet.
											</AscendantText>
										) : (
											tokensInInitiative.map((token, index) => (
												<div
													key={token.id}
													className={cn(
														"flex items-center gap-2 p-2 rounded text-sm border transition-colors",
														index === activeTurnIndex
															? "bg-primary/20 border-primary shadow-sm"
															: "border-border/40",
													)}
												>
													<span className="truncate flex-1">{token.name}</span>
													<span className="font-bold">{token.initiative}</span>
												</div>
											))
										)}
									</div>
								)}
								{mobilePanel === "sheet" &&
									(() => {
										const ownToken = visibleTokens.find(
											(t) => isOwnToken(t) && t.characterId,
										);
										const charId = ownToken?.characterId || myCharacterId;
										if (charId) {
											return (
												<VTTCharacterPanel
													characterId={charId}
													onRoll={(formula) =>
														vttRealtime.rollAndBroadcast(formula)
													}
													onChat={(msg, type) =>
														vttRealtime.sendChatMessage(msg, type)
													}
													campaignId={effectiveCampaignId}
												/>
											);
										}
										return (
											<AscendantText className="block text-xs text-muted-foreground text-center py-4">
												No character linked.
											</AscendantText>
										);
									})()}
								{mobilePanel === "assets" && (
									<VTTAssetBrowser
										campaignId={effectiveCampaignId}
										readOnly={false}
										onUseAsToken={(_imageUrl, name) => {
											vttRealtime.sendChatMessage(
												`wants to use "${name}" as their token`,
												"rift",
											);
											setMobilePanel(null);
										}}
									/>
								)}
							</div>
						</div>
					</>
				)}

				{/* Handout Share Popup Overlay */}
				{vttRealtime.sharedHandout && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
						<button
							type="button"
							className="absolute inset-0 w-full h-full bg-black/60 cursor-default outline-none"
							onClick={vttRealtime.dismissHandout}
							aria-label="Close handout"
						/>
						<div className="bg-background border-2 border-primary rounded-lg shadow-2xl max-w-lg w-full relative z-10 p-6 pointer-events-auto">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-resurge text-lg font-bold gradient-text-shadow">
									{vttRealtime.sharedHandout.title}
								</h3>
								<button
									type="button"
									onClick={vttRealtime.dismissHandout}
									className="text-muted-foreground hover:text-foreground text-lg"
								>
									&times;
								</button>
							</div>
							{vttRealtime.sharedHandout.imageUrl && (
								<div className="mb-4 rounded-lg overflow-hidden border border-border">
									<OptimizedImage
										src={vttRealtime.sharedHandout.imageUrl}
										alt={vttRealtime.sharedHandout.title}
										className="w-full max-h-[400px] object-contain"
										size="large"
									/>
								</div>
							)}
							{vttRealtime.sharedHandout.content && (
								<div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto">
									{vttRealtime.sharedHandout.content}
								</div>
							)}
							<div className="mt-3 text-xs text-muted-foreground text-right">
								Shared by {vttRealtime.sharedHandout.sharedBy}
							</div>
						</div>
					</div>
				)}
			</div>
			{/* Shared 3D Dice Overlay (DDB parity) */}
			<SharedDiceTray
				roll={vttRealtime.sharedDiceRoll}
				onDismiss={() => vttRealtime.setSharedDiceRoll(null)}
			/>
		</Layout>
	);
};

export default PlayerMapView;
