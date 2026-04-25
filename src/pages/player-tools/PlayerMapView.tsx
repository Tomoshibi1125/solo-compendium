import {
	ArrowLeft,
	Clock,
	Crosshair,
	Dice1,
	Dice6,
	ImageIcon,
	MessageSquare,
	Send,
	User as UserIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AscendantText } from "@/components/ui/AscendantText";
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
import { VTTDrawer } from "@/components/vtt/VTTDrawer";
import {
	VTTIconRail,
	type VTTIconRailItem,
} from "@/components/vtt/VTTIconRail";
import { VTTPointerOverlay } from "@/components/vtt/VTTPointerOverlay";
import { VTTTopBar } from "@/components/vtt/VTTTopBar";
import { VTTZoomHud } from "@/components/vtt/VTTZoomHud";
import type { VTTAsset } from "@/data/vttAssetLibrary";
import { useCampaignCombatSession } from "@/hooks/useCampaignCombat";
import { useCampaignMembers } from "@/hooks/useCampaigns";
import { useCampaignToolState } from "@/hooks/useToolState";
import { useVTTRealtime } from "@/hooks/useVTTRealtime";
import { useVTTSettings } from "@/hooks/useVTTSettings";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { cn } from "@/lib/utils";
import { syncSceneMusicEngine } from "@/lib/vtt/sceneAudio";
import { getTokenSizePx } from "@/lib/vtt/tokenSizing";
import "@/styles/vtt-player-map.css";
import "@/styles/vtt-performance.css";
import "./PlayerMapView.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import type { LibraryToken } from "@/data/tokenLibraryDefaults";
import {
	type AmbientSoundZone,
	getWeatherCSSAnimation,
	type MusicMood,
	type TerrainZone,
	type VTTDrawing,
	VttMusicEngine,
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
	musicMood?: MusicMood | null;
	musicAutoplay?: boolean;
	terrain?: TerrainZone[];
	ambientSounds?: AmbientSoundZone[];
}

const toSafeClassName = (id: string) => id.replace(/[^a-zA-Z0-9-]/g, "-");

type VTTScenesState = {
	scenes: Scene[];
	currentSceneId: string | null;
};

const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";

const isPlayerMapShortcutTarget = (target: EventTarget | null) => {
	if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) {
		return false;
	}
	return (
		target.isContentEditable ||
		target.closest(
			"button, input, select, textarea, [contenteditable='true'], [role='textbox']",
		) !== null
	);
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
	const { fx } = usePerformanceProfile();

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
	// Right drawer state for the Player view — mirrors the Warden view's
	// overlay-drawer pattern. Opens by clicking a right-rail icon.
	type PlayerDrawerTab = "sheet" | "chat" | "dice" | "init" | "assets" | null;
	const [playerDrawerTab, setPlayerDrawerTab] = useState<PlayerDrawerTab>(
		typeof window !== "undefined" && window.innerWidth >= 1280 ? "sheet" : null,
	);
	const touchRef = useRef<{ startDist: number; startZoom: number } | null>(
		null,
	);
	const lastDraggedCellRef = useRef<string | null>(null);
	const lastCursorCellRef = useRef<string | null>(null);
	const viewportPanRef = useRef<{
		startX: number;
		startY: number;
		startLeft: number;
		startTop: number;
	} | null>(null);
	const spacePanPressedRef = useRef(false);
	const [isViewportPanning, setIsViewportPanning] = useState(false);
	const musicEngineRef = useRef<VttMusicEngine | null>(null);
	const syncPlayerSceneMusic = useCallback(
		(scene: Pick<Scene, "musicMood" | "musicAutoplay"> | null | undefined) => {
			const wantsMusic = !!scene?.musicMood && scene.musicAutoplay !== false;
			if (wantsMusic && !musicEngineRef.current) {
				musicEngineRef.current = new VttMusicEngine();
			}
			syncSceneMusicEngine(musicEngineRef.current, scene);
		},
		[],
	);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
		const updateMobileState = (event?: MediaQueryListEvent) => {
			setIsMobile(event?.matches ?? mediaQuery.matches);
		};
		updateMobileState();
		if (typeof mediaQuery.addEventListener === "function") {
			mediaQuery.addEventListener("change", updateMobileState);
			return () => mediaQuery.removeEventListener("change", updateMobileState);
		}
		mediaQuery.addListener(updateMobileState);
		return () => mediaQuery.removeListener(updateMobileState);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const handleWindowMouseUp = () => {
			if (!viewportPanRef.current) return;
			viewportPanRef.current = null;
			setIsViewportPanning(false);
		};
		const handleWindowBlur = () => {
			spacePanPressedRef.current = false;
			touchRef.current = null;
			lastDraggedCellRef.current = null;
			setDraggedTokenId(null);
			if (!viewportPanRef.current) return;
			viewportPanRef.current = null;
			setIsViewportPanning(false);
		};
		window.addEventListener("mouseup", handleWindowMouseUp);
		window.addEventListener("blur", handleWindowBlur);
		return () => {
			window.removeEventListener("mouseup", handleWindowMouseUp);
			window.removeEventListener("blur", handleWindowBlur);
		};
	}, []);

	// Scene state received from Warden
	const [currentScene, setCurrentScene] = useState<Scene | null>(null);
	useEffect(() => {
		syncPlayerSceneMusic(currentScene);
	}, [currentScene, syncPlayerSceneMusic]);
	useEffect(
		() => () => {
			musicEngineRef.current?.dispose();
			musicEngineRef.current = null;
		},
		[],
	);

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

	// Warden-tunable player permissions + session gate (DDB parity).
	const { settings: vttSettings, sessionStatus } = useVTTSettings(
		effectiveCampaignId || null,
	);
	const sessionGated =
		sessionStatus.state === "paused" || sessionStatus.state === "ended";

	// Subscribe to campaign_tool_states for scene data from Warden
	const toolKey = effectiveSessionId
		? `vtt_scenes:${effectiveSessionId}`
		: "vtt_scenes";
	const assetsToolKey = effectiveSessionId
		? `vtt_assets:${effectiveSessionId}`
		: "vtt_assets";
	const legacyStorageKey = effectiveCampaignId
		? `vtt-scenes-${effectiveCampaignId}${effectiveSessionId ? `-${effectiveSessionId}` : ""}`
		: "vtt-scenes";
	const legacyAssetsStorageKey = effectiveCampaignId
		? `vtt-assets-${effectiveCampaignId}${effectiveSessionId ? `-${effectiveSessionId}` : ""}`
		: "vtt-assets";
	const { state: storedState, isLoading } =
		useCampaignToolState<VTTScenesState>(effectiveCampaignId || null, toolKey, {
			initialState: { scenes: [], currentSceneId: null },
			storageKey: legacyStorageKey,
		});
	const { state: sharedCustomAssets } = useCampaignToolState<VTTAsset[]>(
		effectiveCampaignId || null,
		assetsToolKey,
		{
			initialState: [],
			storageKey: legacyAssetsStorageKey,
		},
	);

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
		const unsub7 = vttRealtime.on("audio_sync", (payload) => {
			if (payload.playedBy === vttRealtime.userId) return;
			if (payload.action === "music_change" && payload.id) {
				syncPlayerSceneMusic({
					musicMood: payload.id as MusicMood,
					musicAutoplay: true,
				});
			} else if (payload.action === "music_stop") {
				syncPlayerSceneMusic({ musicMood: null, musicAutoplay: false });
			}
		});

		return () => {
			unsub1();
			unsub2();
			unsub3();
			unsub4();
			unsub5();
			unsub6();
			unsub7();
		};
	}, [effectiveCampaignId, syncPlayerSceneMusic, vttRealtime]);

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

	// Double-click to ping (respect Warden-configured permission)
	const handleMapDoubleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!vttSettings.allowPlayerPing) return;
			if (sessionGated) return;
			const pos = getGridPosition(e);
			if (pos) {
				vttRealtime.sendPing(pos.gx, pos.gy);
			}
		},
		[getGridPosition, sessionGated, vttRealtime, vttSettings.allowPlayerPing],
	);

	const handleRequestZoom = useCallback((nextZoom: number) => {
		setZoom((prev) => {
			const clamped = Math.max(0.1, Math.min(3, nextZoom));
			if (Math.abs(prev - clamped) < 0.001) return prev;
			return clamped;
		});
	}, []);
	const handleFitZoom = useCallback(() => {
		if (!mapRef.current || !currentScene) return;
		const rect = mapRef.current.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		const sw = (currentScene.width ?? 20) * gridSize;
		const sh = (currentScene.height ?? 20) * gridSize;
		if (sw <= 0 || sh <= 0) return;
		const fit = Math.min(rect.width / sw, rect.height / sh, 3);
		handleRequestZoom(Math.max(0.1, Math.round(fit * 20) / 20));
	}, [currentScene, gridSize, handleRequestZoom]);
	const handleRecenter = useCallback(() => {
		const el = mapRef.current;
		if (!el) return;
		el.scrollTo({ left: 0, top: 0, behavior: "smooth" });
	}, []);

	// Auto-fit zoom when the active scene changes.
	const prevPlayerSceneIdRef = useRef<string | null>(null);
	useEffect(() => {
		const id = currentScene?.id ?? null;
		if (id && id !== prevPlayerSceneIdRef.current) {
			prevPlayerSceneIdRef.current = id;
			requestAnimationFrame(() => handleFitZoom());
		}
	}, [currentScene?.id, handleFitZoom]);

	const clearViewportPan = useCallback(() => {
		viewportPanRef.current = null;
		setIsViewportPanning(false);
	}, []);

	const handleMapMouseDown = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (
				(e.button === 1 || (e.button === 0 && spacePanPressedRef.current)) &&
				mapRef.current
			) {
				e.preventDefault();
				viewportPanRef.current = {
					startX: e.clientX,
					startY: e.clientY,
					startLeft: mapRef.current.scrollLeft,
					startTop: mapRef.current.scrollTop,
				};
				setIsViewportPanning(true);
			}
		},
		[],
	);

	// Token drag handlers — players can drag tokens they own
	const handleTokenMouseDown = useCallback(
		(token: PlacedToken, e: React.MouseEvent) => {
			if (e.button === 1 || (e.button === 0 && spacePanPressedRef.current)) {
				return;
			}
			if (token.locked || !isOwnToken(token)) return;
			e.stopPropagation();
			lastDraggedCellRef.current = `${token.x},${token.y}`;
			setDraggedTokenId(token.id);
		},
		[isOwnToken],
	);

	const handleMapMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const viewportPan = viewportPanRef.current;
			if (viewportPan && mapRef.current) {
				mapRef.current.scrollLeft =
					viewportPan.startLeft - (e.clientX - viewportPan.startX);
				mapRef.current.scrollTop =
					viewportPan.startTop - (e.clientY - viewportPan.startY);
				return;
			}
			if (!draggedTokenId) return;
			const pos = getGridPosition(e);
			if (!pos) return;
			const cellKey = `${pos.gx},${pos.gy}`;
			if (lastDraggedCellRef.current === cellKey) return;
			lastDraggedCellRef.current = cellKey;
			setCurrentScene((prev) => {
				if (!prev) return prev;
				const tokenIndex = prev.tokens.findIndex(
					(t) => t.id === draggedTokenId,
				);
				if (tokenIndex === -1) return prev;
				const currentToken = prev.tokens[tokenIndex];
				if (currentToken.x === pos.gx && currentToken.y === pos.gy) return prev;
				const nextTokens = [...prev.tokens];
				nextTokens[tokenIndex] = { ...currentToken, x: pos.gx, y: pos.gy };
				return {
					...prev,
					tokens: nextTokens,
				};
			});
		},
		[draggedTokenId, getGridPosition],
	);

	const handleMapMouseUp = useCallback(() => {
		if (viewportPanRef.current) {
			clearViewportPan();
			return;
		}
		if (!draggedTokenId) return;
		const token = currentScene?.tokens.find((t) => t.id === draggedTokenId);
		if (token) {
			vttRealtime.broadcastTokenMove(draggedTokenId, token.x, token.y);
		}
		lastDraggedCellRef.current = null;
		setDraggedTokenId(null);
	}, [clearViewportPan, currentScene?.tokens, draggedTokenId, vttRealtime]);

	// Broadcast cursor position on mouse move (throttled)
	const lastCursorBroadcast = useRef(0);
	// Tracks the held-X pointer tool (DDB "Point" parity). Declared up here
	// because `handleCursorMove` closes over it for the mouse-move broadcast.
	const pointerPressedRef = useRef(false);
	const handleCursorMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (viewportPanRef.current) return;
			// Pointer-tool broadcast when the player is holding X.
			if (pointerPressedRef.current) {
				const pointerPos = getGridPosition(e);
				if (pointerPos) {
					vttRealtime.broadcastPointer(pointerPos.gx, pointerPos.gy);
				}
			}
			const now = Date.now();
			if (now - lastCursorBroadcast.current < 100) return; // throttle 100ms
			lastCursorBroadcast.current = now;
			const pos = getGridPosition(e);
			if (pos) {
				const cellKey = `${pos.gx},${pos.gy}`;
				if (lastCursorCellRef.current === cellKey) return;
				lastCursorCellRef.current = cellKey;
				vttRealtime.updateCursor({ x: pos.gx, y: pos.gy });
			}
		},
		[getGridPosition, vttRealtime],
	);

	const handleMapWheel = useCallback(
		(e: React.WheelEvent<HTMLDivElement>) => {
			if (Math.abs(e.deltaY) < 1) return;
			// Plain wheel zooms the canvas (DDB Maps / Foundry parity).
			// Ctrl/Cmd+Wheel still works and uses a larger step.
			e.preventDefault();
			const normalized =
				e.deltaMode === 0
					? e.deltaY / 100
					: e.deltaMode === 1
						? e.deltaY / 3
						: e.deltaY;
			const direction = normalized > 0 ? -1 : 1;
			const magnitude = e.ctrlKey || e.metaKey ? 0.2 : 0.1;
			handleRequestZoom(zoom + direction * magnitude);
		},
		[handleRequestZoom, zoom],
	);

	const handleMapTouchStart = useCallback(
		(e: React.TouchEvent<HTMLDivElement>) => {
			if (e.touches.length !== 2) return;
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			touchRef.current = {
				startDist: Math.hypot(dx, dy),
				startZoom: zoom,
			};
		},
		[zoom],
	);

	const handleMapTouchMove = useCallback(
		(e: React.TouchEvent<HTMLDivElement>) => {
			if (e.touches.length !== 2 || !touchRef.current) return;
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const nextDist = Math.hypot(dx, dy);
			if (touchRef.current.startDist <= 0) return;
			e.preventDefault();
			handleRequestZoom(
				(touchRef.current.startZoom * nextDist) / touchRef.current.startDist,
			);
		},
		[handleRequestZoom],
	);

	const handleMapTouchEnd = useCallback(() => {
		touchRef.current = null;
	}, []);

	const handleMapKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (isPlayerMapShortcutTarget(e.target)) return;
			if (e.code === "Space") {
				spacePanPressedRef.current = true;
				e.preventDefault();
				return;
			}
			// Hold-X pointer (DDB "Point" parity, respects Warden permission).
			if (
				!e.ctrlKey &&
				!e.metaKey &&
				!e.altKey &&
				e.key.toLowerCase() === "x" &&
				vttSettings.allowPlayerPointer &&
				!sessionGated
			) {
				e.preventDefault();
				pointerPressedRef.current = true;
				return;
			}
			// Zoom hotkeys (DDB/Foundry parity)
			if (!e.ctrlKey && !e.metaKey && !e.altKey) {
				if (e.key === "+" || e.key === "=") {
					e.preventDefault();
					handleRequestZoom(zoom + 0.1);
					return;
				}
				if (e.key === "-" || e.key === "_") {
					e.preventDefault();
					handleRequestZoom(zoom - 0.1);
					return;
				}
				if (e.key === "0") {
					e.preventDefault();
					handleRequestZoom(1);
					return;
				}
				if (e.key === "Home") {
					e.preventDefault();
					handleFitZoom();
					return;
				}
			}
		},
		[
			handleFitZoom,
			handleRequestZoom,
			sessionGated,
			vttSettings.allowPlayerPointer,
			zoom,
		],
	);

	const handleMapKeyUp = useCallback(
		(e: KeyboardEvent) => {
			if (e.code === "Space") {
				spacePanPressedRef.current = false;
				e.preventDefault();
				return;
			}
			if (e.key.toLowerCase() === "x" && pointerPressedRef.current) {
				pointerPressedRef.current = false;
				vttRealtime.clearPointer();
			}
		},
		[vttRealtime],
	);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.addEventListener("keydown", handleMapKeyDown);
		window.addEventListener("keyup", handleMapKeyUp);
		return () => {
			window.removeEventListener("keydown", handleMapKeyDown);
			window.removeEventListener("keyup", handleMapKeyUp);
		};
	}, [handleMapKeyDown, handleMapKeyUp]);

	const sceneWidth = currentScene?.width ?? 20;
	const sceneHeight = currentScene?.height ?? 20;
	const ownCharacterId = useMemo(() => {
		const ownToken = visibleTokens.find((t) => isOwnToken(t) && t.characterId);
		return ownToken?.characterId || myCharacterId;
	}, [isOwnToken, myCharacterId, visibleTokens]);
	const fogCells = useMemo(() => {
		if (!currentScene?.fogOfWar || !currentScene.fogData) return [];
		return currentScene.fogData.flatMap((row, ry) =>
			row
				.map((revealed, rx) => ({ revealed, rx, ry }))
				.filter((cell) => !cell.revealed),
		);
	}, [currentScene?.fogData, currentScene?.fogOfWar]);
	const auraTokens = useMemo(
		() => visibleTokens.filter((t) => t.auraRadius && t.auraRadius > 0),
		[visibleTokens],
	);
	const weatherPreset = useMemo(() => {
		const weather = currentScene?.weather;
		if (!weather || weather === "clear") return null;
		return WEATHER_PRESETS[weather as keyof typeof WEATHER_PRESETS] ?? null;
	}, [currentScene?.weather]);
	const weatherParticles = useMemo(() => {
		if (!weatherPreset || !currentScene?.weather) return [];
		const particleCount = Math.min(
			weatherPreset.particleCount,
			Math.max(16, fx.particleCount * 4),
		);
		return Array.from({ length: particleCount }, (_, index) => ({
			id: `${currentScene.id}-${currentScene.weather}-${index}`,
			size: Math.random() * 4 + 2,
			left: Math.random() * 100,
			top: Math.random() * 100,
			animationDuration: Math.random() * 2 + 1,
			delay: Math.random() * -2,
		}));
	}, [
		currentScene?.id,
		currentScene?.weather,
		fx.particleCount,
		weatherPreset,
	]);

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
		<Layout fullBleed>
			<div className="vtt-shell relative w-full h-[100dvh] overflow-hidden">
				<VTTTopBar
					left={
						<>
							<Button
								variant="ghost"
								onClick={() => navigate("/player-tools")}
								size="sm"
								className="shrink-0 h-8 px-2"
								aria-label="Back to Player Tools"
							>
								<ArrowLeft className="w-4 h-4" aria-hidden />
								<span className="hidden md:inline ml-1.5 text-xs">Back</span>
							</Button>
							<div className="min-w-0 flex-1">
								<span
									data-testid="vtt-scene-title"
									className="block text-sm font-semibold text-primary/90 truncate max-w-full px-1.5 py-0.5"
								>
									{currentScene?.name || "No Scene"}
								</span>
							</div>
							<Badge
								variant={vttRealtime.isConnected ? "default" : "destructive"}
								className="text-[10px] shrink-0"
							>
								{vttRealtime.isConnected ? "LIVE" : "OFFLINE"}
							</Badge>
							{vttRealtime.activeUsers.length > 0 && (
								<div className="hidden md:flex -space-x-1.5 shrink-0">
									{vttRealtime.activeUsers.slice(0, 5).map((u) => (
										<DynamicStyle
											key={u.userId}
											className="vtt-user-avatar w-5 h-5 text-[9px]"
											vars={{ "--avatar-bg-color": u.color }}
											title={`${u.userName} (${u.role})`}
										>
											{u.userName.charAt(0).toUpperCase()}
										</DynamicStyle>
									))}
								</div>
							)}
						</>
					}
				/>

				{!effectiveCampaignId ? (
					<div className="absolute inset-0 pt-[44px] px-4 flex items-center justify-center">
						<AscendantWindow title="NO CAMPAIGN" variant="alert">
							<AscendantText className="block text-sm text-muted-foreground">
								Open this page from a campaign to view the shared map.
							</AscendantText>
						</AscendantWindow>
					</div>
				) : (
					<div
						className={cn(
							"vtt-content absolute inset-0 flex gap-2 sm:gap-3",
							"pt-[44px] px-2 sm:px-3 pb-2",
							isMobile && "pb-[64px]",
						)}
					>
						{/* Main Map Area fills remaining viewport. */}
						<div className="vtt-map-area relative flex-1 min-h-0 min-w-0 overflow-hidden">
							{/* Session gate overlay (DDB parity): Warden paused / ended. */}
							{sessionGated && (
								<div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm">
									<AscendantWindow
										title={
											sessionStatus.state === "ended"
												? "SESSION ENDED"
												: "SESSION PAUSED"
										}
										variant="alert"
									>
										<AscendantText className="block text-sm text-foreground/70 max-w-sm text-center">
											{sessionStatus.message ??
												(sessionStatus.state === "ended"
													? "Your Warden has ended the session. Please stand by."
													: "Your Warden has paused the session. Please stand by.")}
										</AscendantText>
									</AscendantWindow>
								</div>
							)}
							<div
								className={cn(
									"h-full w-full flex flex-col min-h-0 overflow-hidden relative",
								)}
							>
								{/* DDB "Point" trailing highlight rendered on top of canvas. */}
								<VTTPointerOverlay
									trails={vttRealtime.pointerTrails}
									gridSize={gridSize}
									zoom={zoom}
								/>
								{/* Persistent floating zoom HUD — bottom-right over canvas. */}
								<VTTZoomHud
									zoom={zoom}
									onRequestZoom={handleRequestZoom}
									onFit={handleFitZoom}
									onRecenter={handleRecenter}
								/>
								{!isMobile && (
									<div className="flex items-center justify-end gap-3 mb-2 text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<input
												type="checkbox"
												checked={showGrid}
												onChange={(e) => setShowGrid(e.target.checked)}
												className="w-3 h-3"
												id="playerGrid"
											/>
											<label htmlFor="playerGrid" className="cursor-pointer">
												Grid
											</label>
										</div>
										<div className="flex items-center gap-1">
											<Crosshair className="w-3 h-3" />
											Double-click to ping
										</div>
									</div>
								)}

								{/* Map Canvas */}
								<div
									ref={mapRef}
									className={cn(
										"flex-1 relative border-2 border-border rounded-lg bg-background overflow-auto",
										isViewportPanning && "cursor-grabbing select-none",
									)}
									onMouseDown={handleMapMouseDown}
									onMouseMove={(e) => {
										handleMapMouseMove(e);
										handleCursorMove(e);
									}}
									onMouseUp={handleMapMouseUp}
									onMouseLeave={handleMapMouseUp}
									onDoubleClick={handleMapDoubleClick}
									onWheel={handleMapWheel}
									onTouchStart={handleMapTouchStart}
									onTouchMove={handleMapTouchMove}
									onTouchEnd={handleMapTouchEnd}
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
													{fogCells.map((cell) => (
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
													))}
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
											{weatherPreset && weatherParticles.length > 0 && (
												<div
													className="absolute inset-0 pointer-events-none z-[100] overflow-hidden mix-blend-screen opacity-80"
													data-testid="vtt-weather-overlay"
												>
													<style>{getWeatherCSSAnimation(weatherPreset)}</style>
													{weatherParticles.map((particle) => {
														return (
															<DynamicStyle
																key={particle.id}
																className="absolute rounded-full"
																vars={{
																	width: `${particle.size}px`,
																	height: `${particle.size}px`,
																	left: `${particle.left}%`,
																	top: `${particle.top}%`,
																	backgroundColor: weatherPreset.particleColor,
																	animation: `weather-particle-${currentScene?.weather} ${particle.animationDuration}s linear infinite`,
																	animationDelay: `${particle.delay}s`,
																}}
															/>
														);
													})}
												</div>
											)}

											{/* Token Auras */}
											{auraTokens.map((token) => {
												const auraSize =
													((token.auraRadius as number) * 2 + 1) *
													gridSize *
													zoom;
												const tokenSize = getTokenSizePx(
													token.size,
													gridSize,
													zoom,
												);
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
												// Grid-unit footprint (Roll20/Foundry/DDB parity).
												const size = getTokenSizePx(token.size, gridSize, zoom);
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
							</div>
						</div>

						{/* Right icon rail — desktop only. Tapping an icon opens its drawer. */}
						{!isMobile && (
							<VTTIconRail
								side="right"
								activeId={playerDrawerTab}
								onSelect={(id) => setPlayerDrawerTab(id as PlayerDrawerTab)}
								items={
									[
										{
											id: "sheet",
											icon: UserIcon,
											label: "Character Sheet",
											testId: "vtt-rail-player-sheet",
										},
										{
											id: "chat",
											icon: MessageSquare,
											label: "Chat",
											testId: "vtt-rail-player-chat",
										},
										{
											id: "dice",
											icon: Dice6,
											label: "Dice",
											testId: "vtt-rail-player-dice",
										},
										{
											id: "init",
											icon: Clock,
											label: "Initiative",
											testId: "vtt-rail-player-init",
										},
										{
											id: "assets",
											icon: ImageIcon,
											label: "Assets",
											testId: "vtt-rail-player-assets",
										},
									] as VTTIconRailItem[]
								}
							/>
						)}

						{/* Right drawer — panels slide over the canvas instead of stealing space. */}
						<VTTDrawer
							side="right"
							open={playerDrawerTab !== null}
							onOpenChange={(o) => !o && setPlayerDrawerTab(null)}
							title={
								playerDrawerTab === "sheet"
									? "Character Sheet"
									: playerDrawerTab === "chat"
										? "Chat"
										: playerDrawerTab === "dice"
											? "Dice Roller"
											: playerDrawerTab === "init"
												? "Initiative"
												: playerDrawerTab === "assets"
													? "Assets"
													: "Panel"
							}
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

							<Tabs
								value={playerDrawerTab ?? "sheet"}
								onValueChange={(v) => setPlayerDrawerTab(v as PlayerDrawerTab)}
								className="w-full"
							>
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
										if (ownCharacterId) {
											return (
												<VTTCharacterPanel
													characterId={ownCharacterId}
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
											customAssets={sharedCustomAssets}
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
						</VTTDrawer>
					</div>
				)}

				{/* Mobile Player Toolbar + Bottom Sheet */}
				{isMobile && effectiveCampaignId && (
					<>
						<div className="vtt-mobile-toolbar">
							<button
								type="button"
								onClick={() => handleRequestZoom(zoom - 0.15)}
							>
								−
							</button>
							<span className="text-[10px] text-muted-foreground min-w-[32px] text-center">
								{Math.round(zoom * 100)}%
							</span>
							<button
								type="button"
								onClick={() => handleRequestZoom(zoom + 0.15)}
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
										if (ownCharacterId) {
											return (
												<VTTCharacterPanel
													characterId={ownCharacterId}
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
										customAssets={sharedCustomAssets}
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
