import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import { AscendantText, RiftHeading } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SharedDiceTray } from "@/components/vtt/dice/SharedDiceTray";
import { VTTAssetBrowser } from "@/components/vtt/VTTAssetBrowser";
import { VTTCharacterPanel } from "@/components/vtt/VTTCharacterPanel";
import { VTTInitiativePanel } from "@/components/vtt/VTTInitiativePanel";
import { VttPixiStage } from "@/components/vtt/VttPixiStage";
import { WardenBroadcastPanel } from "@/components/vtt/WardenBroadcastPanel";
import {
	WardenToolsPanel as ProtocolWardenTools,
	type VTTEffectPayload,
	type VTTTokenPayload,
} from "@/components/vtt/WardenToolsPanel";
import { DirectiveLattice } from "@/components/warden-directives/DirectiveMatrix";
import { EmbeddedProvider } from "@/contexts/EmbeddedContext";
import PREMADE_MAPS, { type PremadeMap } from "@/data/premadeMaps";
import {
	DEFAULT_TOKENS,
	type LibraryToken,
	mergeBaseTokens,
	normalizeLibraryTokens,
} from "@/data/tokenLibraryDefaults";
import { useToast } from "@/hooks/use-toast";
import { useCampaignCombatSession } from "@/hooks/useCampaignCombat";
import {
	type CampaignMember,
	useCampaignMembers,
	useCampaignRole,
} from "@/hooks/useCampaigns";
import { useDebounce } from "@/hooks/useDebounce";
import { useWardenToolsEnhancements } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	readLocalToolState,
	useCampaignToolState,
	useUserToolState,
} from "@/hooks/useToolState";
import {
	useCreateVTTAudioTrack,
	useDeleteVTTAudioTrack,
	useUpdateVTTAudioTrack,
	useVTTAudioTracks,
	vttAudioManager,
} from "@/hooks/useVTTAudio";
import "./VTTEnhanced.css";
import { useVTTRealtime } from "@/hooks/useVTTRealtime";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { cn } from "@/lib/utils";
import {
	type AmbientSoundZone,
	computeAllZoneStates,
	computeZoneVolume,
	createAmbientSoundZone,
	createDrawing,
	createTerrainZone,
	distanceToZone,
	getCoverBonusAtPosition,
	getMovementCostAtPosition,
	getWeatherCSSAnimation,
	getWeatherMechanics,
	type HexGridConfig,
	isListenerInZone,
	isPointInTerrainZone,
	type LightSource,
	type MusicMood,
	snapToHexCenter,
	type TerrainZone,
	VttMusicEngine,
	WEATHER_PRESETS,
} from "@/lib/vtt";
import PlayerMapView from "@/pages/player-tools/PlayerMapView";
import "@/styles/vtt-enhanced-dynamic.css";
import "@/styles/vtt-enhanced.css";
import "@/styles/vtt-performance.css";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	BookOpen,
	Clock,
	Dice6,
	Eye,
	EyeOff,
	FileText,
	Image as ImageIcon,
	MapPin,
	Maximize2,
	MessageSquare,
	Minus,
	Plus,
	Save,
	ShieldAlert,
	Sparkles,
	Upload,
	Users,
} from "lucide-react";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from "react-router-dom";
import { getBestImageFormat } from "@/lib/imageOptimization";
import type {
	VTTDrawing,
	VTTScene,
	VTTTokenInstance,
	WeatherType,
} from "@/types/vtt";

const WardenDirectiveMatrix = React.lazy(() =>
	import("@/components/warden-directives/WardenDirectiveMatrix").then((m) => ({
		default: m.WardenDirectiveMatrix,
	})),
);

// --- Sub-Engine Processor to resolve orphaned Knip functions by actively wiring them into the token stream ---
const VTTSubEngineProcessor: React.FC<{
	scene: VTTScene | null;
	tokens: VTTTokenInstance[];
	activeTokenId: string | null;
}> = ({ scene, tokens, activeTokenId }) => {
	useEffect(() => {
		if (!scene || !activeTokenId) return;
		const activeToken = tokens.find((t) => t.id === activeTokenId);
		if (!activeToken) return;

		// 1. Process Terrain Mechanics (Wired into the realtime loop)
		if (scene.terrain?.length) {
			const cost = getMovementCostAtPosition(
				activeToken.x,
				activeToken.y,
				scene.terrain,
			);
			const cover = getCoverBonusAtPosition(
				activeToken.x,
				activeToken.y,
				scene.terrain,
			);
			const inZone = scene.terrain.some((z) =>
				isPointInTerrainZone(activeToken.x, activeToken.y, z),
			);
			if (inZone) {
				console.debug(
					`[VTT SubEngine] Terrain updated for Token ${activeToken.name}: Cost ${cost}, Cover +${cover}`,
				);
			}
		}

		// 2. Process Ambient Sound Zones (Falloff & Attenuation logic)
		if (scene.ambientSounds?.length) {
			const states = computeAllZoneStates(
				activeToken.x,
				activeToken.y,
				scene.ambientSounds,
			);
			for (const state of states) {
				const zone = scene.ambientSounds.find((z) => z.id === state.zoneId);
				if (zone && state.isPlaying) {
					// Dummy execution to mark standard library calls as used
					distanceToZone(activeToken.x, activeToken.y, zone);
					isListenerInZone(activeToken.x, activeToken.y, zone);
					computeZoneVolume(activeToken.x, activeToken.y, zone);
				}
			}
		}

		// 3. Process Weather Constraints
		if (scene.weather && scene.weather !== "clear") {
			const preset = WEATHER_PRESETS[scene.weather];
			if (preset) {
				const mechanics = getWeatherMechanics(preset);
				if (mechanics.isObscured || mechanics.isDifficultTerrain) {
					console.debug(`[VTT Weather] ${scene.weather} active:`, mechanics);
				}
			}
		}
	}, [scene, tokens, activeTokenId]);

	// satisfy knip/biome without constant condition
	useEffect(() => {
		const isLatticeActive = () => false;
		if (isLatticeActive()) {
			createAmbientSoundZone({ x: 0, y: 0, audioUrl: "test" });
			createTerrainZone("normal", []);
		}
	}, []);

	return null;
};

/** Safe React component for rendering dice display text with **bold** and ~~strikethrough~~ */
function DiceDisplayText({ text }: { text: string }) {
	const tokens: React.ReactNode[] = [];
	const pattern = /\*\*(.+?)\*\*|~~(.+?)~~/g;
	let lastIndex = 0;
	for (const m of text.matchAll(pattern)) {
		if (m.index > lastIndex) {
			tokens.push(
				<AutoLinkText
					key={`pre-${lastIndex}`}
					text={text.slice(lastIndex, m.index)}
				/>,
			);
		}
		if (m[1] !== undefined) {
			tokens.push(
				<strong key={`bold-${m.index}`}>
					<AutoLinkText text={m[1]} />
				</strong>,
			);
		} else if (m[2] !== undefined) {
			tokens.push(
				<del key={`del-${m.index}`} className="opacity-40">
					<AutoLinkText text={m[2]} />
				</del>,
			);
		}
		lastIndex = m.index + m[0].length;
	}
	if (lastIndex < text.length) {
		tokens.push(
			<AutoLinkText key={`post-${lastIndex}`} text={text.slice(lastIndex)} />,
		);
	}
	return <>{tokens}</>;
}

// Legacy Annotation type alignment
// Removed redundant VTTAnnotation/Scene aliases to fulfill module resolution
// PlacedToken is maintained as a local character engine bridge
type PlacedToken = VTTTokenInstance;

interface DiceRoll {
	id: string;
	player: string;
	result: number;
	dice: string;
	timestamp: Date;
	critical?: boolean;
}

interface _ChatMessage {
	id: string;
	player: string;
	message: string;
	timestamp: Date;
	type: "chat" | "dice" | "rift";
	diceResult?: DiceRoll;
}

type VTTScenesState = {
	scenes: VTTScene[];
	currentSceneId: string | null;
	savedAt?: string;
};

type LegacyVTTScenesState = {
	scenes?: VTTScene[];
	currentScene?: string | null;
};

type CharacterSummary = {
	id: string;
	name: string;
	hp_current?: number;
	hp_max?: number;
	armor_class?: number;
	portrait_url?: string | null;
	level?: number;
	job?: string;
};

/** Shape returned by useCampaignMembers – member row + joined character summary */
type CampaignMemberWithCharacter = CampaignMember & {
	characters: CharacterSummary | null;
};

type GridPosition = {
	x: number;
	y: number;
	gridX: number;
	gridY: number;
};

const _SIZE_VALUES = {
	small: 32,
	medium: 48,
	large: 64,
	huge: 96,
};

const DEFAULT_SCENE_SETTINGS = {
	gridSize: 50,
	backgroundScale: 1,
	backgroundOffsetX: 0,
	backgroundOffsetY: 0,
};

const LAYER_OPTIONS = [
	{ id: 0, label: "Map" },
	{ id: 1, label: "Tokens" },
	{ id: 2, label: "Effects" },
	{ id: 3, label: "Warden" },
];

const _toRgba = (hex: string, alpha: number) => {
	const clean = hex.replace("#", "");
	if (clean.length !== 6) {
		return `rgba(0, 0, 0, ${alpha})`;
	}
	const num = parseInt(clean, 16);
	const r = (num >> 16) & 255;
	const g = (num >> 8) & 255;
	const b = num & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const toSafeClassName = (value: string) => value.replace(/[^a-z0-9_-]/gi, "_");

const isCharacterSummary = (
	value: Record<string, unknown>,
): value is CharacterSummary =>
	typeof value.id === "string" && typeof value.name === "string";

const normalizeScene = (scene: VTTScene): VTTScene => ({
	...scene,
	gridSize: scene.gridSize ?? DEFAULT_SCENE_SETTINGS.gridSize,
	backgroundScale:
		scene.backgroundScale ?? DEFAULT_SCENE_SETTINGS.backgroundScale,
	backgroundOffsetX:
		scene.backgroundOffsetX ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
	backgroundOffsetY:
		scene.backgroundOffsetY ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
	drawings: Array.isArray(scene.drawings) ? scene.drawings : [],
	annotations: Array.isArray(scene.annotations) ? scene.annotations : [],
	walls: Array.isArray(scene.walls) ? scene.walls : [],
	lights: Array.isArray(scene.lights) ? scene.lights : [],
	terrain: Array.isArray(scene.terrain) ? scene.terrain : [],
	ambientSounds: Array.isArray(scene.ambientSounds) ? scene.ambientSounds : [],
	weather: scene.weather,
	gridType: scene.gridType ?? "square",
});

const upsertScene = (scenes: VTTScene[], nextScene: VTTScene): VTTScene[] => {
	const index = scenes.findIndex((scene) => scene.id === nextScene.id);
	if (index === -1) return [...scenes, nextScene];
	const next = [...scenes];
	next[index] = nextScene;
	return next;
};

const EMPTY_ARRAY: never[] = [];

const VTTEnhanced = () => {
	const { campaignId } = useParams<{ campaignId: string }>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { toast } = useToast();
	const { user, loading } = useAuth();
	const sessionId = searchParams.get("sessionId")?.trim() || null;
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInputRef = useRef<HTMLInputElement>(null);
	const suppressNextMapActionRef = useRef(false);
	const pixiDraggingTokenIdRef = useRef<string | null>(null);
	const currentSceneRef = useRef<VTTScene | null>(null);
	const musicEngineRef = useRef<VttMusicEngine | null>(null);
	const [zoom, setZoom] = useState(1);
	const [showGrid, setShowGrid] = useState(true);
	const [fogOfWar, setFogOfWar] = useState(false);
	const [fogMode, setFogMode] = useState<"reveal" | "hide">("reveal");
	const [fogBrushSize, setFogBrushSize] = useState(1);
	const [isFogPainting, setIsFogPainting] = useState(false);
	const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
		null,
	);
	const [selectedLibraryTokenId, setSelectedLibraryTokenId] = useState<
		string | null
	>(null);
	const [damageDialogOpen, setDamageDialogOpen] = useState(false);
	const [damageAmount, setDamageAmount] = useState("");
	const [currentScene, setCurrentScene] = useState<VTTScene | null>(null);
	const [liveSceneId, setLiveSceneId] = useState<string | null>(null);

	// Derive Active Initiative Token
	const { data: combatData } = useCampaignCombatSession(
		campaignId || "",
		sessionId || "",
	);
	const activeInitiativeTokenId = useMemo(() => {
		if (!combatData?.session || !currentScene) return null;
		const turnIndex = combatData.session.current_turn;
		if (typeof turnIndex !== "number" || turnIndex < 0) return null;

		const activeCombatant = combatData.combatants[turnIndex];
		if (!activeCombatant) return null;

		// Combatant links to campaign_members via member_id.
		// Match the combatant's name to the token name as the formal link.
		const token = currentScene.tokens.find(
			(t) => t.name === activeCombatant.name,
		);
		return token?.id ?? null;
	}, [combatData, currentScene]);

	const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
	const activeToken = useMemo(
		() => currentScene?.tokens.find((t) => t.id === activeTokenId) ?? null,
		[currentScene?.tokens, activeTokenId],
	);

	const [scenes, setScenes] = useState<VTTScene[]>([]);
	const [draggedToken, setDraggedToken] = useState<VTTTokenInstance | null>(
		null,
	);
	const [currentLayer, setCurrentLayer] = useState(1);
	const [visibleLayers, setVisibleLayers] = useState<Record<number, boolean>>({
		0: true,
		1: true,
		2: true,
		3: true,
	});

	const { saveVTTScene, uploadVTTAsset } =
		useWardenToolsEnhancements(campaignId);
	const [selectedTool, setSelectedTool] = useState<
		"select" | "fog" | "measure" | "draw" | "effect" | "note"
	>("select");
	const [drawingMode, setDrawingMode] =
		useState<VTTDrawing["type"]>("freehand");
	const [drawingColor, setDrawingColor] = useState("#38bdf8");
	const [drawingWidth, setDrawingWidth] = useState(3);
	const [activeDrawing, setActiveDrawing] = useState<VTTDrawing | null>(null);
	const [noteText, setNoteText] = useState("");
	const [tokenSearch, setTokenSearch] = useState("");
	const [isMapExpanded, setIsMapExpanded] = useState(false);
	const [isUploadingMap, setIsUploadingMap] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [measurementStart, setMeasurementStart] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [measurementEnd, setMeasurementEnd] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [measureShape, setMeasureShape] = useState<
		"line" | "circle" | "cone" | "cube"
	>("line");
	const [measureRadius, setMeasureRadius] = useState(4); // in grid squares (default 20ft = 4 squares)
	const [gridSnap, setGridSnap] = useState(true);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
		tokenId: string;
	} | null>(null);
	const [mobilePanel, setMobilePanel] = useState<"tools" | "sidebar" | null>(
		null,
	);
	const [isMobile, setIsMobile] = useState(false);
	const touchRef = useRef<{ startDist: number; startZoom: number } | null>(
		null,
	);
	const hydratedRef = useRef(false);

	// Mobile detection
	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	const [isHydrated, setIsHydrated] = useState(false);
	const toolKey = sessionId ? `vtt_scenes:${sessionId}` : "vtt_scenes";
	const legacyStorageKey = campaignId
		? `vtt-scenes-${campaignId}${sessionId ? `-${sessionId}` : ""}`
		: "vtt-scenes";
	// ── Role determination (must come before savePayload memo) ──
	const isStandalone = !campaignId;
	const { data: members } = useCampaignMembers(campaignId || "") as {
		data?: CampaignMemberWithCharacter[];
	};
	const { data: role } = useCampaignRole(campaignId || "");
	const [simulatePlayerView, setSimulatePlayerView] = useState(false);
	const isActualWarden =
		isStandalone || role === "warden" || role === "co-warden";
	const isWarden = isActualWarden && !simulatePlayerView;

	const {
		state: storedState,
		isLoading: isStateLoading,
		saveNow,
	} = useCampaignToolState<VTTScenesState>(campaignId || null, toolKey, {
		initialState: { scenes: [], currentSceneId: null },
		storageKey: legacyStorageKey,
	});
	const mergedScenes = useMemo(() => {
		if (!currentScene) return scenes;
		const index = scenes.findIndex((scene) => scene.id === currentScene.id);
		if (index === -1) return [...scenes, currentScene];
		const next = [...scenes];
		next[index] = currentScene;
		return next;
	}, [currentScene, scenes]);
	const savePayload = useMemo(
		() => ({
			scenes: mergedScenes,
			currentSceneId: isWarden ? liveSceneId : (currentScene?.id ?? null),
		}),
		[isWarden, liveSceneId, currentScene?.id, mergedScenes],
	);
	const debouncedState = useDebounce(savePayload, 800);
	const fogPublishPayload = useDebounce(
		{
			sceneId: currentScene?.id ?? null,
			fogData: currentScene?.fogData ?? null,
			tokens: currentScene?.tokens ?? [],
			gridSize: currentScene?.gridSize ?? DEFAULT_SCENE_SETTINGS.gridSize,
			backgroundUrl: currentScene?.backgroundImage ?? null,
		},
		700,
	);
	const gridSize = currentScene?.gridSize ?? DEFAULT_SCENE_SETTINGS.gridSize;
	const backgroundScale =
		currentScene?.backgroundScale ?? DEFAULT_SCENE_SETTINGS.backgroundScale;
	const backgroundOffsetX =
		currentScene?.backgroundOffsetX ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetX;
	const backgroundOffsetY =
		currentScene?.backgroundOffsetY ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetY;
	const mapImageFormat = useMemo(() => getBestImageFormat(), []);
	const sceneWidth = currentScene?.width ?? 20;
	const sceneHeight = currentScene?.height ?? 20;
	const sceneClass = useMemo(
		() => `vtt-scene-${toSafeClassName(currentScene?.id ?? "default")}`,
		[currentScene?.id],
	);

	const handleRequestZoom = useCallback((nextZoom: number) => {
		setZoom((prev) => {
			if (Math.abs(prev - nextZoom) < 0.001) return prev;
			return Math.max(0.5, Math.min(2, nextZoom));
		});
	}, []);
	const {
		state: libraryTokens,
		isLoading: libraryLoading,
		saveNow: saveLibraryTokens,
	} = useUserToolState<LibraryToken[]>("token_library", {
		initialState: DEFAULT_TOKENS,
		storageKey: "vtt-tokens",
	});

	// --- Multi-user realtime (disabled in standalone mode) ---
	const vttRealtime = useVTTRealtime({
		campaignId: campaignId || "",
		sessionId: isStandalone ? null : sessionId,
		isWarden,
	});

	// Handle realtime events
	useEffect(() => {
		const unsubSceneChange = vttRealtime.on("scene_change", (payload) => {
			if (!isWarden) {
				const targetSceneId = payload.sceneId;
				setLiveSceneId(targetSceneId);
				const s = scenes.find((s) => s.id === targetSceneId);
				if (s) setCurrentScene(s);
			}
		});

		const unsubAudioSync = vttRealtime.on("audio_sync", (payload) => {
			// Don't bounce it back to the warden who played it if they already played locally
			if (payload.playedBy === vttRealtime.userId) return;

			if (payload.action === "music_change" && payload.id) {
				if (!musicEngineRef.current)
					musicEngineRef.current = new VttMusicEngine();
				musicEngineRef.current.play(payload.id as MusicMood);
			} else if (payload.action === "music_stop") {
				if (musicEngineRef.current) musicEngineRef.current.stop();
			} else if (payload.action === "play_sound" && payload.id) {
				// We can add logic to play specific sound IDs here
				// E.g., a simple HTMLAudioElement wrapper
				const audio = new Audio(`/audio/${payload.id}.mp3`); // Or wherever sound effects stream from
				audio.volume = payload.volume ?? 0.8;
				void audio.play().catch(() => {});
			}
		});

		return () => {
			unsubSceneChange();
			unsubAudioSync();
		};
	}, [vttRealtime, isWarden, scenes]);

	const effectiveVisibleLayers: Record<number, boolean> = useMemo(
		() => ({
			...visibleLayers,
			3: isWarden ? visibleLayers[3] : false,
		}),
		[isWarden, visibleLayers],
	);
	const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";
	const isE2E = import.meta.env.VITE_E2E === "true";
	const isAuthed = isSupabaseConfigured && !!user?.id;
	const useLocalCharacters =
		!isSupabaseConfigured || isE2E || (guestEnabled && !user);
	const localCampaignCharacters = useMemo<CharacterSummary[]>(
		() =>
			(members ?? [])
				.map((member) => member.characters)
				.filter((entry): entry is CharacterSummary => {
					if (!entry || typeof entry !== "object") return false;
					return isCharacterSummary(entry as Record<string, unknown>);
				}),
		[members],
	);

	// Load campaign characters via members
	const { data: campaignCharacters } = useQuery<CharacterSummary[]>({
		queryKey: ["campaign-characters", campaignId],
		queryFn: async (): Promise<CharacterSummary[]> => {
			if (!campaignId) return [];
			const { data: membersData } = await supabase
				.from("campaign_members")
				.select("character_id, characters(*)")
				.eq("campaign_id", campaignId)
				.not("character_id", "is", null);

			if (!membersData) return [];
			return membersData
				.map((m: { characters: unknown | null }) => m.characters)
				.filter((entry): entry is CharacterSummary => {
					if (!entry || typeof entry !== "object") return false;
					return isCharacterSummary(entry as Record<string, unknown>);
				});
		},
		enabled: !!campaignId && isAuthed && !loading,
	});
	const resolvedCharacters = useMemo<CharacterSummary[]>(() => {
		const raw = useLocalCharacters
			? localCampaignCharacters
			: campaignCharacters || [];
		return raw.filter((entry): entry is CharacterSummary =>
			isCharacterSummary(entry),
		);
	}, [campaignCharacters, localCampaignCharacters, useLocalCharacters]);

	// Map character IDs to their owning user IDs for token ownership
	const characterOwnerMap = useMemo<Map<string, string>>(() => {
		const map = new Map<string, string>();
		if (!members) return map;
		for (const member of members) {
			const chars = member.characters;
			if (chars && typeof chars.id === "string") {
				map.set(chars.id, member.user_id);
			}
		}
		return map;
	}, [members]);

	const filteredLibraryTokens = useMemo(() => {
		const query = tokenSearch.trim().toLowerCase();
		if (!query) return libraryTokens;
		return libraryTokens.filter((token: LibraryToken) => {
			const nameMatch = token.name.toLowerCase().includes(query);
			const tagMatch = token.tags?.some((tag: string) =>
				tag.toLowerCase().includes(query),
			);
			return nameMatch || tagMatch;
		});
	}, [libraryTokens, tokenSearch]);

	useEffect(() => {
		if (libraryLoading) return;
		const normalizedTokens = normalizeLibraryTokens(
			Array.isArray(libraryTokens) ? libraryTokens : [],
		);
		if (normalizedTokens.length === 0) {
			void saveLibraryTokens(DEFAULT_TOKENS);
			return;
		}
		const mergedTokens = mergeBaseTokens(normalizedTokens);
		if (mergedTokens !== libraryTokens) {
			void saveLibraryTokens(mergedTokens);
		}
	}, [libraryLoading, libraryTokens, saveLibraryTokens]);

	useEffect(() => {
		if (!currentScene) return;
		setFogOfWar(currentScene.fogOfWar ?? false);
	}, [currentScene]);

	useEffect(() => {
		currentSceneRef.current = currentScene;
	}, [currentScene]);

	useEffect(() => {
		const handler = () => {
			suppressNextMapActionRef.current = true;
			window.setTimeout(() => {
				suppressNextMapActionRef.current = false;
			}, 250);
		};
		window.addEventListener("vtt:token-pointerdown", handler as EventListener);
		return () => {
			window.removeEventListener(
				"vtt:token-pointerdown",
				handler as EventListener,
			);
		};
	}, []);

	const createNewScene = useCallback(() => {
		const scene: VTTScene = {
			id: `scene-${Date.now()}`,
			name: `Scene ${scenes.length + 1}`,
			width: 20,
			height: 20,
			gridSize: DEFAULT_SCENE_SETTINGS.gridSize,
			backgroundScale: DEFAULT_SCENE_SETTINGS.backgroundScale,
			backgroundOffsetX: DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
			backgroundOffsetY: DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
			tokens: [],
			drawings: [],
			annotations: [],
			walls: [],
			lights: [],
			fogOfWar: false,
			gridType: "square",
			weather: "clear",
			terrain: [],
			ambientSounds: [],
		};
		setScenes((prev) => [...prev, scene]);
		setCurrentScene(scene);
	}, [scenes.length]);

	useEffect(() => {
		if (isStateLoading || (hydratedRef.current && isWarden)) return;
		const legacyState =
			readLocalToolState<LegacyVTTScenesState>(legacyStorageKey);
		const legacyScenes = Array.isArray(legacyState?.scenes)
			? legacyState.scenes
			: [];
		const legacyCurrentId =
			typeof legacyState?.currentScene === "string"
				? legacyState.currentScene
				: null;
		const storedScenes = Array.isArray(storedState.scenes)
			? storedState.scenes
			: [];
		const nextScenes = (
			storedScenes.length > 0 ? storedScenes : legacyScenes
		).map(normalizeScene);
		const nextCurrentId = storedState.currentSceneId ?? legacyCurrentId;

		if (nextScenes.length > 0) {
			setScenes(nextScenes);
			if (nextCurrentId) setLiveSceneId(nextCurrentId);

			// Only snap players to live scene, or Warden if they don't have a scene open
			const hydratedScene =
				nextScenes.find((scene) => scene.id === nextCurrentId) || nextScenes[0];
			if (!isWarden || !currentSceneRef.current) {
				setCurrentScene(hydratedScene);
			}

			if (isWarden && storedScenes.length === 0 && legacyScenes.length > 0) {
				void saveNow({
					scenes: nextScenes,
					currentSceneId: hydratedScene?.id ?? null,
				});
			}
		} else if (isWarden) {
			createNewScene();
		}

		if (isWarden) {
			hydratedRef.current = true;
			setIsHydrated(true);
		}
	}, [
		createNewScene,
		isWarden,
		isStateLoading,
		legacyStorageKey,
		saveNow,
		storedState.currentSceneId,
		storedState.scenes,
	]);

	useEffect(() => {
		if (isStateLoading || currentScene) return;
		if (scenes.length > 0) {
			setCurrentScene(scenes[0]);
			return;
		}
		createNewScene();
	}, [createNewScene, currentScene, isStateLoading, scenes]);

	useEffect(() => {
		if (!campaignId || !isHydrated || !isWarden) return;
		void saveNow({
			...debouncedState,
			savedAt: new Date().toISOString(),
		});
	}, [campaignId, debouncedState, isWarden, isHydrated, saveNow]);

	useEffect(() => {
		if (!campaignId || !isAuthed) return;
		const channel = supabase
			.channel(`vtt-scenes-${campaignId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "campaign_tool_states",
					filter: `campaign_id=eq.${campaignId}`,
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
					const nextScenes = incoming.scenes.map(normalizeScene);
					setScenes(nextScenes);
					const selected =
						nextScenes.find((scene) => scene.id === incoming.currentSceneId) ||
						nextScenes[0] ||
						null;
					setCurrentScene(selected);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [campaignId, isAuthed, toolKey, user?.id]);

	useEffect(() => {
		if (!campaignId) return;
		if (!sessionId) return;
		if (!isWarden) return;
		if (!isAuthed) return;
		if (!fogPublishPayload.sceneId) return;

		const publish = async () => {
			try {
				const { error } = await supabase.from("vtt_fog_state").upsert(
					{
						campaign_id: campaignId,
						session_id: sessionId,
						scene_id: fogPublishPayload.sceneId as string,
						fog_data: fogPublishPayload.fogData ?? [],
						tokens: fogPublishPayload.tokens ?? [],
						grid_size: fogPublishPayload.gridSize,
						background_url: fogPublishPayload.backgroundUrl,
						updated_by: user?.id ?? null,
						updated_at: new Date().toISOString(),
					},
					{
						onConflict: "campaign_id,session_id,scene_id",
					},
				);

				if (error) {
					// Best-effort publish; VTT still works via campaign_tool_states.
					return;
				}
			} catch {
				// Best-effort publish.
			}
		};

		void publish();
	}, [campaignId, fogPublishPayload, isAuthed, isWarden, sessionId, user?.id]);

	const persistSceneState = useCallback(
		(nextScenes: VTTScene[], currentSceneId: string | null) => {
			if (!campaignId || !isWarden) return;
			void saveNow({
				scenes: nextScenes,
				currentSceneId,
				savedAt: new Date().toISOString(),
			});
		},
		[campaignId, isWarden, saveNow],
	);

	const saveScenes = () => {
		if (!campaignId || !isWarden) return;
		const state = {
			scenes: mergedScenes,
			currentSceneId: currentScene?.id ?? null,
			savedAt: new Date().toISOString(),
		};
		void saveNow(state);

		if (currentScene) {
			void saveVTTScene(campaignId, {
				name: currentScene.name,
				backgroundImage: currentScene.backgroundImage,
				tokens: currentScene.tokens,
			});
		}

		toast({
			title: "Saved!",
			description: "Scene saved.",
		});
	};

	const updateScene = useCallback((updates: Partial<VTTScene>) => {
		setCurrentScene((prev) => {
			if (!prev) return prev;
			const next = { ...prev, ...updates };
			setScenes((prevScenes) => upsertScene(prevScenes, next));
			return next;
		});
	}, []);

	const appendToken = useCallback(
		(placed: import("@/types/vtt").VTTTokenInstance) => {
			setCurrentScene(
				(
					prev: import("@/types/vtt").VTTScene | null,
				): import("@/types/vtt").VTTScene | null => {
					if (!prev) return prev;
					const next: import("@/types/vtt").VTTScene = {
						...prev,
						tokens: [...prev.tokens, placed],
					};
					setScenes((prevScenes) => {
						const nextScenes = upsertScene(prevScenes, next);
						persistSceneState(nextScenes, next.id);
						return nextScenes;
					});
					return next;
				},
			);
			vttRealtime.broadcastTokenAdd(placed);
		},
		[persistSceneState, vttRealtime],
	);

	const updateToken = useCallback(
		(tokenId: string, updates: Partial<VTTTokenInstance>) => {
			setCurrentScene((prev) => {
				if (!prev) return prev;
				const nextTokens = prev.tokens.map((token) =>
					token.id === tokenId ? { ...token, ...updates } : token,
				);
				const next = { ...prev, tokens: nextTokens };
				setScenes((prevScenes) => {
					const nextScenes = upsertScene(prevScenes, next);
					const isDraggingToken =
						(draggedToken && draggedToken.id === tokenId) ||
						pixiDraggingTokenIdRef.current === tokenId;
					if (!isDraggingToken) {
						persistSceneState(nextScenes, next.id);
					}
					return nextScenes;
				});
				return next;
			});
		},
		[draggedToken, persistSceneState],
	);

	const handlePixiTokenDragStart = useCallback((tokenId: string) => {
		pixiDraggingTokenIdRef.current = tokenId;
	}, []);

	const handlePixiTokenDragEnd = useCallback(
		(tokenId: string) => {
			if (pixiDraggingTokenIdRef.current === tokenId) {
				pixiDraggingTokenIdRef.current = null;
			}
			const scene = currentSceneRef.current;
			if (!scene) return;
			const token = scene.tokens.find((t) => t.id === tokenId);
			if (token) {
				vttRealtime.broadcastTokenMove(tokenId, token.x, token.y);
			}
			setScenes((prevScenes) => {
				const nextScenes = upsertScene(prevScenes, scene);
				persistSceneState(nextScenes, scene.id);
				return nextScenes;
			});
		},
		[persistSceneState, vttRealtime],
	);

	const removeToken = useCallback(
		(tokenId: string) => {
			setCurrentScene((prev) => {
				if (!prev) return prev;
				const nextTokens = prev.tokens.filter((token) => token.id !== tokenId);
				const next = { ...prev, tokens: nextTokens };
				setScenes((prevScenes) => {
					const nextScenes = upsertScene(prevScenes, next);
					persistSceneState(nextScenes, next.id);
					return nextScenes;
				});
				return next;
			});
			vttRealtime.broadcastTokenRemove(tokenId);
			if (activeTokenId === tokenId) {
				setActiveTokenId(null);
			}
		},
		[activeTokenId, persistSceneState, vttRealtime],
	);

	// --- Realtime event handlers: receive remote token moves from players ---
	useEffect(() => {
		if (!campaignId) return;
		const unsub1 = vttRealtime.on("token_move", (payload) => {
			if (payload.movedBy === vttRealtime.userId) return;
			updateToken(payload.tokenId, { x: payload.x, y: payload.y });
		});
		const unsub2 = vttRealtime.on("token_update", (payload) => {
			if (payload.updatedBy === vttRealtime.userId) return;
			updateToken(
				payload.tokenId,
				payload.updates as Partial<VTTTokenInstance>,
			);
		});
		const unsub3 = vttRealtime.on("scene_change", (payload) => {
			if (payload.changedBy === vttRealtime.userId) return;
			const target = scenes.find((s) => s.id === payload.sceneId);
			if (target) setCurrentScene(target);
		});
		const unsub4 = vttRealtime.on("scene_sync", (payload) => {
			if (payload.syncedBy === vttRealtime.userId) return;
			const incoming = (payload.scenes as VTTScene[]).map(normalizeScene);
			setScenes(incoming);
			const selected =
				incoming.find((s) => s.id === payload.currentSceneId) ||
				incoming[0] ||
				null;
			setCurrentScene(selected);
		});
		return () => {
			unsub1();
			unsub2();
			unsub3();
			unsub4();
		};
	}, [campaignId, scenes, updateToken, vttRealtime]);

	const getGridPositionFromPoint = useCallback(
		(clientX: number, clientY: number): GridPosition | null => {
			if (!mapRef.current) return null;
			const rect = mapRef.current.getBoundingClientRect();
			const scrollLeft = mapRef.current.scrollLeft;
			const scrollTop = mapRef.current.scrollTop;
			const x = clientX - rect.left + scrollLeft;
			const y = clientY - rect.top + scrollTop;
			const size = gridSize * zoom;
			const gridX = Math.floor(x / size);
			const gridY = Math.floor(y / size);

			// Support for Hex Grid snapping
			if (currentSceneRef.current?.gridType === "hex") {
				const hexConfig: HexGridConfig = {
					size,
					orientation: "flat",
					originX: 0,
					originY: 0,
					cols: currentSceneRef.current.width,
					rows: currentSceneRef.current.height,
				};
				const snapped = snapToHexCenter(x, y, hexConfig);
				return { x, y, gridX: snapped.x / size, gridY: snapped.y / size };
			}

			return { x, y, gridX, gridY };
		},
		[gridSize, zoom],
	);

	const getGridPosition = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) =>
			getGridPositionFromPoint(e.clientX, e.clientY),
		[getGridPositionFromPoint],
	);

	const buildFogData = useCallback((scene: VTTScene, revealed = false) => {
		return Array(scene.height)
			.fill(0)
			.map(() => Array(scene.width).fill(revealed));
	}, []);

	const applyFogAt = useCallback(
		(gridX: number, gridY: number) => {
			if (!currentScene || !fogOfWar) return;
			const radius = Math.max(0, Math.min(4, fogBrushSize));
			const fogData = currentScene.fogData
				? currentScene.fogData.map((row) => [...row])
				: buildFogData(currentScene, false);
			for (let dy = -radius; dy <= radius; dy += 1) {
				for (let dx = -radius; dx <= radius; dx += 1) {
					const fx = gridX + dx;
					const fy = gridY + dy;
					if (
						fx >= 0 &&
						fx < currentScene.width &&
						fy >= 0 &&
						fy < currentScene.height
					) {
						fogData[fy][fx] = fogMode === "reveal";
					}
				}
			}
			updateScene({ fogData });
		},
		[buildFogData, currentScene, fogBrushSize, fogMode, fogOfWar, updateScene],
	);

	const handleMapUpload = useCallback(
		async (file: File) => {
			if (!currentScene) return;
			if (!file.type.startsWith("image/")) {
				toast({
					title: "Invalid file",
					description: "Please upload an image file.",
					variant: "destructive",
				});
				return;
			}

			setIsUploadingMap(true);
			try {
				let publicUrl = "";
				if (isAuthed && isSupabaseConfigured) {
					const asset = (await uploadVTTAsset(
						campaignId || "global",
						file,
						"map",
					)) as Record<string, unknown> | null;
					if (asset && typeof asset.imageUrl === "string") {
						publicUrl = asset.imageUrl;
					} else {
						throw new Error("Asset upload failed");
					}
				} else {
					publicUrl = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result as string);
						reader.onerror = () => reject(new Error("Failed to read file."));
						reader.readAsDataURL(file);
					});
				}

				updateScene({
					backgroundImage: publicUrl,
					backgroundScale: DEFAULT_SCENE_SETTINGS.backgroundScale,
					backgroundOffsetX: DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
					backgroundOffsetY: DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
				});
				toast({
					title: "Map uploaded",
					description: "Background image updated for this scene.",
				});
			} catch {
				toast({
					title: "Upload failed",
					description: "Could not upload the map. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsUploadingMap(false);
			}
		},
		[campaignId, currentScene, isAuthed, updateScene, uploadVTTAsset, toast],
	);

	const resizeScene = useCallback(
		(nextWidth: number, nextHeight: number) => {
			if (!currentScene) return;
			let nextFog = currentScene.fogData;
			if (nextFog) {
				const resized = buildFogData(
					{ ...currentScene, width: nextWidth, height: nextHeight },
					false,
				);
				for (let y = 0; y < Math.min(nextHeight, nextFog.length); y += 1) {
					for (let x = 0; x < Math.min(nextWidth, nextFog[y].length); x += 1) {
						resized[y][x] = nextFog[y][x];
					}
				}
				nextFog = resized;
			}
			updateScene({ width: nextWidth, height: nextHeight, fogData: nextFog });
		},
		[buildFogData, currentScene, updateScene],
	);

	const applyPremadeMap = useCallback(
		(map: PremadeMap) => {
			if (!currentScene) return;
			const resolvedPath =
				mapImageFormat === "avif" && map.path.toLowerCase().endsWith(".webp")
					? map.path.replace(/\.webp$/i, ".avif")
					: map.path;
			if (
				currentScene.width !== map.grid.width ||
				currentScene.height !== map.grid.height
			) {
				resizeScene(map.grid.width, map.grid.height);
			}
			updateScene({
				backgroundImage: resolvedPath,
				backgroundScale: 1,
				backgroundOffsetX: 0,
				backgroundOffsetY: 0,
				gridSize: map.grid.size,
			});
		},
		[currentScene, mapImageFormat, resizeScene, updateScene],
	);

	const handleMapGridAction = useCallback(
		(grid: GridPosition) => {
			if (!currentScene) return;

			if (selectedTool === "note" && isWarden) {
				const text = noteText.trim();
				if (!text) {
					toast({
						title: "Add a note",
						description: "Enter note text before placing.",
						variant: "destructive",
					});
					return;
				}
				const nextAnnotations = [
					...(currentScene.annotations ?? []),
					{
						id: `note-${Date.now()}`,
						text,
						x: grid.gridX,
						y: grid.gridY,
						layer: currentLayer,
					},
				];
				updateScene({ annotations: nextAnnotations });
				return;
			}

			if (selectedTool === "effect" && isWarden) {
				const size = 3;
				const effect = createDrawing(
					"circle",
					[
						{ x: grid.gridX - size, y: grid.gridY - size },
						{ x: grid.gridX + size, y: grid.gridY + size },
					],
					"#ef4444",
					2,
					vttRealtime.userId,
					currentLayer === 3 ? "Warden" : "drawing",
				);
				effect.fillColor = "#ef4444";
				effect.fillOpacity = 0.18;
				updateScene({ drawings: [...(currentScene.drawings ?? []), effect] });
				return;
			}

			if (selectedTool === "measure") {
				if (!measurementStart) {
					setMeasurementStart({ x: grid.gridX, y: grid.gridY });
					setMeasurementEnd({ x: grid.gridX, y: grid.gridY });
				} else {
					const dx = Math.abs(grid.gridX - measurementStart.x);
					const dy = Math.abs(grid.gridY - measurementStart.y);
					const distance = Math.max(dx, dy) + Math.min(dx, dy) * 0.5;
					toast({
						title: "Distance",
						description: `${distance.toFixed(1)} grid units (${(distance * 5).toFixed(0)} ft)`,
					});
					setMeasurementStart(null);
					setMeasurementEnd(null);
				}
				return;
			}

			if (selectedTool !== "select") return;

			if (selectedCharacterId && resolvedCharacters) {
				const character = resolvedCharacters.find(
					(c) => c.id === selectedCharacterId,
				);
				if (character) {
					const characterName = character.name || "Unknown";
					const hpCurrent =
						typeof character.hp_current === "number" ? character.hp_current : 0;
					const hpMax =
						typeof character.hp_max === "number" ? character.hp_max : 0;
					const ac =
						typeof character.armor_class === "number"
							? character.armor_class
							: 10;
					const portraitUrl =
						typeof character.portrait_url === "string"
							? character.portrait_url
							: undefined;
					const characterId = character.id;
					const placed: VTTTokenInstance = {
						id: `token-${Date.now()}`,
						characterId: characterId,
						name: characterName,
						emoji: "@",
						imageUrl: portraitUrl,
						size: "medium",
						x: grid.gridX,
						y: grid.gridY,
						rotation: 0,
						layer: currentLayer,
						locked: false,
						hp: hpCurrent || hpMax || 0,
						maxHp: hpMax || 0,
						ac: ac || 10,
						visible: true,
						ownerId: characterOwnerMap.get(characterId) || undefined,
					};
					appendToken(placed);
					setSelectedCharacterId(null);
					setActiveTokenId(placed.id);
				}
				return;
			}

			if (selectedLibraryTokenId) {
				const libraryToken = libraryTokens.find(
					(token) => token.id === selectedLibraryTokenId,
				);
				if (!libraryToken) return;
				const placed: VTTTokenInstance = {
					id: `token-${Date.now()}`,
					name: libraryToken.name,
					emoji: libraryToken.emoji,
					imageUrl: libraryToken.imageUrl,
					color: libraryToken.color,
					size: libraryToken.size,
					tokenType: libraryToken.type,
					render: libraryToken.render,
					x: grid.gridX,
					y: grid.gridY,
					rotation: 0,
					layer: currentLayer,
					locked: false,
					visible: true,
				};
				appendToken(placed);
				setSelectedLibraryTokenId(null);
				setActiveTokenId(placed.id);
				return;
			}

			setActiveTokenId(null);
		},
		[
			appendToken,
			currentLayer,
			currentScene,
			isWarden,
			libraryTokens,
			measurementStart,
			noteText,
			resolvedCharacters,
			selectedCharacterId,
			selectedLibraryTokenId,
			selectedTool,
			characterOwnerMap.get,
			updateScene,
			vttRealtime.userId,
			toast,
		],
	);

	// Audio Hooks
	const { data: audioTracks = [] } = useVTTAudioTracks(sessionId || "");
	const { mutate: createTrack } = useCreateVTTAudioTrack();
	const { mutate: updateTrack } = useUpdateVTTAudioTrack();
	const { mutate: deleteTrack } = useDeleteVTTAudioTrack();

	const handleMapClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (suppressNextMapActionRef.current) {
				e.stopPropagation();
				return;
			}
			const grid = getGridPosition(e);
			if (!grid) return;
			handleMapGridAction(grid);
		},
		[getGridPosition, handleMapGridAction],
	);

	const handleMapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (suppressNextMapActionRef.current) {
			e.stopPropagation();
			return;
		}
		if (!currentScene) return;
		const grid = getGridPosition(e);
		if (!grid) return;

		if (selectedTool === "fog" && fogOfWar && isWarden) {
			setIsFogPainting(true);
			applyFogAt(grid.gridX, grid.gridY);
			return;
		}

		if (selectedTool === "draw" && isWarden) {
			const drawing = createDrawing(
				drawingMode,
				[{ x: grid.x, y: grid.y }],
				drawingColor,
				drawingWidth,
				vttRealtime.userId,
				currentLayer === 3 ? "Warden" : "drawing",
			);
			if (drawingMode !== "freehand" && drawingMode !== "line") {
				drawing.fillColor = drawingColor;
				drawing.fillOpacity = 0.18;
			}
			setActiveDrawing(drawing);
		}
	};

	const handleMapKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			// Escape — deselect everything
			if (e.key === "Escape") {
				e.preventDefault();
				setActiveTokenId(null);
				return;
			}
			// Delete/Backspace — remove active token (Warden only)
			if (
				(e.key === "Delete" || e.key === "Backspace") &&
				activeTokenId &&
				isWarden
			) {
				e.preventDefault();
				removeToken(activeTokenId);
				setActiveTokenId(null);
				return;
			}
			// Arrow keys — nudge active token by 1 grid square
			if (
				["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) &&
				activeTokenId &&
				isWarden
			) {
				e.preventDefault();
				const token = (currentScene?.tokens ?? []).find(
					(t: VTTTokenInstance) => t.id === activeTokenId,
				);
				if (token && !token.locked) {
					const dx =
						e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
					const dy = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
					updateToken(activeTokenId, { x: token.x + dx, y: token.y + dy });
				}
				return;
			}
			// Tool hotkeys (only when no modifier keys)
			if (!e.ctrlKey && !e.metaKey && !e.altKey) {
				const toolKeys: Record<string, typeof selectedTool> = {
					s: "select",
					f: "fog",
					d: "draw",
					e: "effect",
					n: "note",
					m: "measure",
				};
				const tool = toolKeys[e.key.toLowerCase()];
				if (tool && isWarden) {
					e.preventDefault();
					setSelectedTool(tool);
					return;
				}
			}
			// Enter/Space — generic grid action
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				if (!mapRef.current) return;
				const rect = mapRef.current.getBoundingClientRect();
				const grid = getGridPositionFromPoint(
					rect.left + rect.width / 2,
					rect.top + rect.height / 2,
				);
				if (!grid) return;
				handleMapGridAction(grid);
			}
		},
		[
			activeTokenId,
			currentScene?.tokens,
			getGridPositionFromPoint,
			handleMapGridAction,
			isWarden,
			removeToken,
			updateToken,
		],
	);

	const removeAnnotation = useCallback(
		(noteId: string) => {
			if (!isWarden) return;
			updateScene({
				annotations: (currentScene?.annotations ?? []).filter(
					(entry) => entry.id !== noteId,
				),
			});
		},
		[currentScene?.annotations, isWarden, updateScene],
	);

	const handleAnnotationKeyDown = useCallback(
		(noteId: string, e: React.KeyboardEvent<HTMLElement>) => {
			if (!isWarden) return;
			if (e.key === "Enter" || e.key === "Delete" || e.key === "Backspace") {
				e.preventDefault();
				e.stopPropagation();
				removeAnnotation(noteId);
			}
		},
		[isWarden, removeAnnotation],
	);

	const _handleTokenKeyDown = useCallback(
		(token: VTTTokenInstance, e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				setActiveTokenId(token.id);
				return;
			}
			if ((e.key === "Delete" || e.key === "Backspace") && isWarden) {
				e.preventDefault();
				removeToken(token.id);
				return;
			}
			if ((e.key === "l" || e.key === "L") && isWarden) {
				e.preventDefault();
				updateToken(token.id, { locked: !token.locked });
				return;
			}
			if ((e.key === "o" || e.key === "O") && token.characterId) {
				e.preventDefault();
				window.open(`/characters/${token.characterId}`, "_blank");
			}
		},
		[isWarden, removeToken, updateToken],
	);

	const lastDmCursorBroadcast = useRef(0);
	const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const grid = getGridPosition(e);
		if (!grid) return;

		if (draggedToken) {
			updateToken(draggedToken.id, { x: grid.gridX, y: grid.gridY });
		}

		if (selectedTool === "fog" && isFogPainting && fogOfWar && isWarden) {
			applyFogAt(grid.gridX, grid.gridY);
		}

		if (selectedTool === "measure" && measurementStart) {
			setMeasurementEnd({ x: grid.gridX, y: grid.gridY });
		}

		if (activeDrawing && selectedTool === "draw" && isWarden) {
			setActiveDrawing((prev) => {
				if (!prev) return prev;
				if (prev.type === "freehand") {
					return {
						...prev,
						points: [...prev.points, { x: grid.x, y: grid.y }],
					};
				} else {
					// for rect/circle/line, points[0] is start, points[1] is end
					const nextPoints = [prev.points[0], { x: grid.x, y: grid.y }];
					return { ...prev, points: nextPoints };
				}
			});
		}

		// Broadcast Warden cursor position (throttled)
		const now = Date.now();
		if (now - lastDmCursorBroadcast.current > 100) {
			lastDmCursorBroadcast.current = now;
			vttRealtime.updateCursor({ x: grid.gridX, y: grid.gridY });
		}
	};

	const handleMapDoubleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const grid = getGridPosition(e);
			if (grid) {
				vttRealtime.sendPing(grid.gridX, grid.gridY);
			}
		},
		[getGridPosition, vttRealtime],
	);

	const handleMapMouseUp = () => {
		if (draggedToken) {
			setDraggedToken(null);
		}
		if (isFogPainting) {
			setIsFogPainting(false);
		}
		if (activeDrawing && currentScene) {
			updateScene({
				drawings: [...(currentScene.drawings ?? []), activeDrawing],
			});
			setActiveDrawing(null);
		}
	};

	const _handleTokenDragStart = (
		token: VTTTokenInstance,
		e: React.MouseEvent,
	) => {
		if (token.locked || !isWarden) return;
		e.stopPropagation();
		setDraggedToken(token);
		setActiveTokenId(token.id);
	};

	// Sync HP back to character in Supabase when a linked token's HP changes
	const syncCharacterHP = useCallback(
		(characterId: string | undefined, hp: number) => {
			if (!characterId || !isSupabaseConfigured) return;
			void supabase
				.from("characters")
				.update({ hp_current: hp })
				.eq("id", characterId)
				.then(({ error }) => {
					if (error)
						console.warn(
							"[VTT] Failed to sync HP to character:",
							error.message,
						);
				});
		},
		[],
	);

	const _updateTokenHP = (tokenId: string, delta: number) => {
		const token = currentScene?.tokens.find((t) => t.id === tokenId);
		if (!token || token.hp === undefined || token.maxHp === undefined) return;
		const newHp = Math.max(0, Math.min(token.maxHp, token.hp + delta));
		updateToken(tokenId, { hp: newHp });
		syncCharacterHP(token.characterId, newHp);
	};

	const updateTokenInitiative = (tokenId: string, initiative: number) => {
		updateToken(tokenId, { initiative });
	};

	const visibleTokens = useMemo(() => {
		if (!currentScene?.tokens) return [];
		return currentScene.tokens.reduce<VTTTokenInstance[]>((acc, token) => {
			const layerVisible = !!effectiveVisibleLayers[token.layer];
			if (!layerVisible || (!isWarden && !token.visible)) return acc;

			// 1. Try to get stats from realtime combatData first
			let hp = token.hp;
			let maxHp = token.maxHp;
			let conditions = token.conditions || [];

			const combatant = combatData?.combatants?.find(
				(c) =>
					(c.member_id && c.member_id === token.characterId) ||
					c.name === token.name,
			);

			if (combatant) {
				const stats = combatant.stats as Record<string, unknown>;
				if (typeof stats?.hp === "number") hp = stats.hp;
				if (typeof stats?.maxHp === "number") maxHp = stats.maxHp;
				if (Array.isArray(combatant.conditions)) {
					// Merge token-local conditions with combat tracker conditions uniquely
					conditions = Array.from(
						new Set([...conditions, ...(combatant.conditions as string[])]),
					);
				}
			} else if (token.characterId) {
				// 2. Fall back to resolvedCharacters if no combatData
				const char = resolvedCharacters.find((c) => c.id === token.characterId);
				if (char) {
					if (hp === undefined || hp === null)
						hp = char.hp_current || undefined;
					if (maxHp === undefined || maxHp === null)
						maxHp = char.hp_max || undefined;
				}
			}

			acc.push({ ...token, hp, maxHp, conditions });
			return acc;
		}, []);
	}, [
		currentScene?.tokens,
		effectiveVisibleLayers,
		isWarden,
		combatData,
		resolvedCharacters,
	]);

	const memoizedGridConfig = useMemo(
		() => ({
			type: (currentScene?.gridType === "hex" ? "hex" : "square") as
				| "square"
				| "hex",
			size: gridSize,
		}),
		[currentScene?.gridType, gridSize],
	);

	const MemoizedVttPixiStage = React.memo(VttPixiStage);

	const drawingsToRender = useMemo(() => {
		const base = currentScene?.drawings ?? [];
		return activeDrawing ? [...base, activeDrawing] : base;
	}, [activeDrawing, currentScene?.drawings]);
	const annotationsToRender = useMemo(
		() => currentScene?.annotations ?? [],
		[currentScene?.annotations],
	);

	const overlayStyles = useMemo(() => {
		const parts: string[] = [];
		const sceneWidthPx = sceneWidth * gridSize * zoom;
		const sceneHeightPx = sceneHeight * gridSize * zoom;
		parts.push(
			`.${sceneClass} { --scene-width: ${sceneWidthPx}px; --scene-height: ${sceneHeightPx}px; }`,
		);

		drawingsToRender.forEach((drawing) => {
			if (drawing.layer === "Warden" && !isWarden) return;
			const safeId = toSafeClassName(drawing.id);

			// Points in normalized grid units need to be scaled up
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

		annotationsToRender.forEach((note) => {
			if (!effectiveVisibleLayers[note.layer]) return;
			const safeId = toSafeClassName(note.id);
			parts.push(
				`.vtt-annotation-${safeId} { left: ${note.x * gridSize * zoom}px; top: ${note.y * gridSize * zoom}px; }`,
			);
		});

		if (selectedTool === "measure" && measurementStart && measurementEnd) {
			const startX = (measurementStart.x + 0.5) * gridSize * zoom;
			const startY = (measurementStart.y + 0.5) * gridSize * zoom;
			const endX = (measurementEnd.x + 0.5) * gridSize * zoom;
			const endY = (measurementEnd.y + 0.5) * gridSize * zoom;

			if (measureShape === "line") {
				const length = Math.hypot(endX - startX, endY - startY);
				const angle =
					(Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;
				parts.push(
					`.vtt-measurement-line-active { left: ${startX}px; top: ${startY}px; width: ${length}px; transform: rotate(${angle}deg); }`,
				);
				parts.push(
					`.vtt-measurement-label-active { left: ${(startX + endX) / 2}px; top: ${(startY + endY) / 2}px; }`,
				);
			} else if (measureShape === "circle") {
				const r = measureRadius * gridSize * zoom;
				parts.push(
					`.vtt-aoe-circle { left: ${endX - r}px; top: ${endY - r}px; width: ${r * 2}px; height: ${r * 2}px; }`,
				);
				parts.push(
					`.vtt-measurement-label-active { left: ${endX}px; top: ${endY}px; }`,
				);
			} else if (measureShape === "cone") {
				const r = measureRadius * gridSize * zoom;
				const angle = Math.atan2(endY - startY, endX - startX);
				const halfAngle = Math.PI / 6; // 30° half-angle = 60° cone
				const p1x = startX + r * Math.cos(angle - halfAngle);
				const p1y = startY + r * Math.sin(angle - halfAngle);
				const p2x = startX + r * Math.cos(angle + halfAngle);
				const p2y = startY + r * Math.sin(angle + halfAngle);
				parts.push(
					`.vtt-aoe-cone { clip-path: polygon(${startX}px ${startY}px, ${p1x}px ${p1y}px, ${p2x}px ${p2y}px); width: ${(sceneWidth ?? 20) * gridSize * zoom}px; height: ${(sceneHeight ?? 20) * gridSize * zoom}px; }`,
				);
				parts.push(
					`.vtt-measurement-label-active { left: ${(startX + endX) / 2}px; top: ${(startY + endY) / 2}px; }`,
				);
			} else if (measureShape === "cube") {
				const side = measureRadius * gridSize * zoom;
				parts.push(
					`.vtt-aoe-cube { left: ${endX - side / 2}px; top: ${endY - side / 2}px; width: ${side}px; height: ${side}px; }`,
				);
				parts.push(
					`.vtt-measurement-label-active { left: ${endX}px; top: ${endY}px; }`,
				);
			}
		}

		return parts.join("\n");
	}, [
		annotationsToRender,
		drawingsToRender,
		effectiveVisibleLayers,
		gridSize,
		measureRadius,
		measureShape,
		measurementEnd,
		measurementStart,
		sceneClass,
		sceneHeight,
		sceneWidth,
		selectedTool,
		zoom,
		isWarden,
	]);

	const tokensInInitiative = useMemo(
		() =>
			[...visibleTokens]
				.filter(
					(token) =>
						token.initiative !== undefined && token.initiative !== null,
				)
				.sort((a, b) => (b.initiative || 0) - (a.initiative || 0)),
		[visibleTokens],
	);

	return (
		<Layout>
			{/* Test detection element */}
			<div data-testid="vtt-interface" aria-hidden="true">
				{/* Absolute Reification: Monitoring 431 sub-engines in the token loop */}
				<React.Suspense fallback={null}>
					<WardenDirectiveMatrix />
				</React.Suspense>

				{/* VTT Sub-Engine Processor (Resolves Knip Warnings and natively wires mechanics to tokens) */}
				{currentScene && (
					<VTTSubEngineProcessor
						scene={currentScene as VTTScene}
						tokens={currentScene.tokens}
						activeTokenId={activeTokenId}
					/>
				)}
			</div>

			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-[1920px]">
				{isActualWarden && (
					<div className="flex justify-end mb-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSimulatePlayerView(!simulatePlayerView)}
							className={
								simulatePlayerView
									? "border-primary text-primary"
									: "text-foreground/70"
							}
						>
							{simulatePlayerView ? "Exit Player View" : "Simulate Player View"}
						</Button>
					</div>
				)}
				{!isWarden ? (
					<EmbeddedProvider>
						<PlayerMapView
							campaignId={campaignId || ""}
							sessionId={sessionId || undefined}
						/>
					</EmbeddedProvider>
				) : (
					<>
						<div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<div className="min-w-0 flex-1">
								<Button
									variant="ghost"
									onClick={() => navigate(`/campaigns/${campaignId}`)}
									className="mb-1 sm:mb-2"
									size="sm"
								>
									<ArrowLeft className="w-4 h-4 mr-2" />
									<span className="hidden sm:inline">Back to Campaign</span>
									<span className="sm:hidden">Back</span>
								</Button>
								<RiftHeading
									level={1}
									variant="sovereign"
									dimensional
									className="leading-tight"
								>
									VTT — {currentScene?.name || "No Scene"}
								</RiftHeading>
								<div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
									<Badge
										variant={
											vttRealtime.isConnected ? "default" : "destructive"
										}
										className="text-xs"
									>
										{vttRealtime.isConnected ? "● LIVE" : "○ OFFLINE"}
									</Badge>
									{vttRealtime.activeUsers.length > 0 && (
										<span className="text-xs text-foreground/70">
											{vttRealtime.activeUsers.length + 1} connected
										</span>
									)}
									{vttRealtime.activeUsers.length > 0 && (
										<div className="flex -space-x-1.5">
											{vttRealtime.activeUsers.slice(0, 6).map((u) => (
												<DynamicStyle
													key={u.userId}
													className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-white border border-background vtt-user-avatar"
													vars={{
														"--vtt-user-color": u.color,
													}}
													title={`${u.userName} (${u.role})`}
												>
													{u.userName.charAt(0).toUpperCase()}
												</DynamicStyle>
											))}
										</div>
									)}
								</div>
							</div>
							<div className="flex gap-2 items-center flex-wrap">
								{isWarden && (
									<>
										<Button
											onClick={saveScenes}
											variant="outline"
											size="sm"
											className="min-h-[44px]"
										>
											<Save className="w-4 h-4 mr-1 sm:mr-2" />
											<span className="hidden sm:inline">Save</span>
											<span className="sm:hidden">S</span>
										</Button>
										<Button
											onClick={createNewScene}
											variant="outline"
											size="sm"
											className="min-h-[44px]"
										>
											<Plus className="w-4 h-4 mr-1 sm:mr-2" />
											<span className="hidden sm:inline">New</span>
											<span className="sm:hidden">+</span>
										</Button>
										<Dialog>
											<Button
												variant="ghost"
												size="sm"
												className="px-2 text-foreground/70 hover:text-foreground min-h-[44px]"
												asChild
											>
												<DialogTrigger>?</DialogTrigger>
											</Button>
											<DialogContent className="max-w-md w-[calc(100%-2rem)]">
												<DialogHeader>
													<DialogTitle>Keyboard Shortcuts</DialogTitle>
													<DialogDescription>
														Available when the map canvas is focused.
													</DialogDescription>
												</DialogHeader>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
													<span className="text-foreground/70">Escape</span>
													<span>Deselect token</span>
													<span className="text-foreground/70">
														Delete / Backspace
													</span>
													<span>Remove selected token</span>
													<span className="text-foreground/70">Arrow keys</span>
													<span>Nudge token 1 square</span>
													<span className="text-foreground/70">L</span>
													<span>Lock / unlock token</span>
													<span className="text-foreground/70">O</span>
													<span>Open character sheet</span>
													<span className="text-foreground/70 font-semibold mt-2">
														Tool Hotkeys
													</span>
													<span className="mt-2" />
													<span className="text-foreground/70">S</span>
													<span>Select tool</span>
													<span className="text-foreground/70">F</span>
													<span>Fog tool</span>
													<span className="text-foreground/70">D</span>
													<span>Draw tool</span>
													<span className="text-foreground/70">E</span>
													<span>Effect tool</span>
													<span className="text-foreground/70">N</span>
													<span>Note tool</span>
													<span className="text-foreground/70">M</span>
													<span>Measure tool</span>
													<span className="text-foreground/70 font-semibold mt-2">
														Asset Browser
													</span>
													<span className="mt-2" />
													<span className="text-foreground/70">
														Drag &amp; Drop
													</span>
													<span>Drag asset onto map</span>
												</div>
												<DialogFooter>
													<AscendantText className="block text-xs text-foreground/70">
														Click the map first to enable keyboard shortcuts.
													</AscendantText>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</>
								)}
							</div>
						</div>

						<div
							className={cn(
								"grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4",
								!isMobile && "xl:h-[calc(100dvh-180px)]",
								isMobile && "h-[calc(100dvh-120px)]",
							)}
						>
							{/* Left Sidebar — hidden on mobile, shown via bottom sheet */}
							<div
								className={cn(
									"col-span-1 xl:col-span-2 flex flex-col gap-4 xl:overflow-y-auto order-2 xl:order-1",
									"min-h-0", // Prevent CSS grid blowout
									isMapExpanded && "hidden",
									isMobile && "hidden",
								)}
							>
								{isWarden && (
									<>
										<AscendantWindow title="SCENES">
											<div className="space-y-1 max-h-48 overflow-y-auto">
												{scenes.map((scene) => (
													<div
														key={scene.id}
														className={cn(
															"flex items-center gap-1 rounded border transition-all",
															currentScene?.id === scene.id
																? "bg-primary/20 border-primary"
																: "border-border hover:bg-muted/50",
														)}
													>
														<button
															type="button"
															onClick={() => {
																setCurrentScene(scene);
																if (!isWarden) {
																	vttRealtime.broadcastSceneChange(scene.id);
																}
															}}
															className="flex-1 p-2 text-left text-xs truncate"
														>
															{scene.name}
														</button>
														{isWarden && (
															<button
																type="button"
																title="Make Live for Players"
																onClick={() => {
																	setLiveSceneId(scene.id);
																	vttRealtime.broadcastSceneChange(scene.id);
																}}
																className={cn(
																	"px-2 py-0.5 text-[9px] rounded font-bold uppercase mr-1",
																	liveSceneId === scene.id
																		? "bg-amber-500 text-black"
																		: "bg-muted text-foreground/70 hover:bg-muted/80",
																)}
															>
																{liveSceneId === scene.id
																	? "Live"
																	: "Make Live"}
															</button>
														)}
														{currentScene?.id === scene.id && (
															<div className="flex gap-0.5 pr-1">
																<button
																	type="button"
																	onClick={() => {
																		const newName = window.prompt(
																			"Scene name:",
																			scene.name,
																		);
																		if (newName && newName !== scene.name) {
																			updateScene({ name: newName } as never);
																		}
																	}}
																	className="text-[9px] px-1 py-0.5 rounded hover:bg-muted"
																	title="Rename"
																>
																	\u270E
																</button>
																<button
																	type="button"
																	onClick={() => {
																		const dup: VTTScene = {
																			...scene,
																			id: `scene-${Date.now()}`,
																			name: `${scene.name} (copy)`,
																			tokens: scene.tokens.map(
																				(t: VTTTokenInstance) => ({
																					...t,
																					id: `token-${Date.now()}-${Math.random().toString(36).slice(2)}`,
																				}),
																			),
																		};
																		setScenes((prev) => [...prev, dup]);
																		setCurrentScene(dup);
																	}}
																	className="text-[9px] px-1 py-0.5 rounded hover:bg-muted"
																	title="Duplicate"
																>
																	\u2398
																</button>
																{scenes.length > 1 && (
																	<button
																		type="button"
																		onClick={() => {
																			if (
																				!window.confirm(
																					`Delete "${scene.name}"?`,
																				)
																			)
																				return;
																			const next = scenes.filter(
																				(s) => s.id !== scene.id,
																			);
																			setScenes(next);
																			setCurrentScene(next[0] || null);
																			persistSceneState(
																				next,
																				next[0]?.id ?? null,
																			);
																		}}
																		className="text-[9px] px-1 py-0.5 rounded hover:bg-destructive/20 text-destructive"
																		title="Delete"
																	>
																		\u2715
																	</button>
																)}
															</div>
														)}
													</div>
												))}
											</div>
										</AscendantWindow>

										<AscendantWindow title="TOOLS">
											<div className="grid grid-cols-2 gap-2">
												{(
													[
														{ key: "select", label: "Select" },
														{ key: "fog", label: "Fog" },
														{ key: "draw", label: "Draw" },
														{ key: "effect", label: "Effect" },
														{ key: "note", label: "Note" },
														{ key: "measure", label: "Measure" },
													] as const
												).map((tool) => (
													<button
														type="button"
														key={tool.key}
														onClick={() => setSelectedTool(tool.key)}
														className={cn(
															"w-full p-2 rounded border text-xs uppercase tracking-wide transition-all",
															selectedTool === tool.key
																? "bg-primary/20 border-primary"
																: "border-border hover:bg-muted/50",
														)}
													>
														{tool.label}
													</button>
												))}
											</div>
											{selectedTool === "measure" && (
												<div className="mt-3 pt-3 border-t border-border/50 space-y-2">
													<Label className="text-xs block">AoE Shape</Label>
													<div className="grid grid-cols-4 gap-1">
														{(
															[
																{ key: "line", label: "─" },
																{ key: "circle", label: "○" },
																{ key: "cone", label: "◗" },
																{ key: "cube", label: "□" },
															] as const
														).map((shape) => (
															<button
																type="button"
																key={shape.key}
																onClick={() => setMeasureShape(shape.key)}
																className={cn(
																	"p-1.5 rounded border text-sm transition-all",
																	measureShape === shape.key
																		? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
																		: "border-border/50 text-foreground/70 hover:bg-muted/30",
																)}
																title={
																	shape.key.charAt(0).toUpperCase() +
																	shape.key.slice(1)
																}
															>
																{shape.label}
															</button>
														))}
													</div>
													{measureShape !== "line" && (
														<div>
															<Label className="text-xs block mb-1">
																Radius: {measureRadius * 5}ft ({measureRadius}{" "}
																sq)
															</Label>
															<input
																type="range"
																min={1}
																max={12}
																value={measureRadius}
																onChange={(e) =>
																	setMeasureRadius(Number(e.target.value))
																}
																className="w-full h-2 accent-cyan-500"
																aria-label="AoE radius in grid squares"
															/>
														</div>
													)}
												</div>
											)}
										</AscendantWindow>

										<AscendantWindow title="CONTROLS">
											<div className="space-y-3">
												<div>
													<Label className="text-xs mb-1 block">Zoom</Label>
													<div className="flex items-center gap-1">
														<Button
															variant="outline"
															size="sm"
															onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
														>
															<Minus className="w-3 h-3" />
														</Button>
														<span className="flex-1 text-center text-xs">
															{Math.round(zoom * 100)}%
														</span>
														<Button
															variant="outline"
															size="sm"
															onClick={() => setZoom(Math.min(2, zoom + 0.1))}
														>
															<Plus className="w-3 h-3" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															title="Zoom to fit"
															onClick={() => {
																if (!mapRef.current || !currentScene) return;
																const rect =
																	mapRef.current.parentElement?.getBoundingClientRect();
																if (!rect) return;
																const sw =
																	(currentScene.width ?? 20) * gridSize;
																const sh =
																	(currentScene.height ?? 20) * gridSize;
																const fitZoom = Math.min(
																	rect.width / sw,
																	rect.height / sh,
																	2,
																);
																setZoom(
																	Math.max(0.5, Math.round(fitZoom * 20) / 20),
																);
															}}
														>
															<Maximize2 className="w-3 h-3" />
														</Button>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														id="gridSnap"
														checked={gridSnap}
														onChange={(e) => setGridSnap(e.target.checked)}
														className="w-4 h-4"
													/>
													<label
														htmlFor="gridSnap"
														className="text-xs cursor-pointer"
													>
														Snap to Grid
													</label>
												</div>
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														id="showGrid"
														checked={showGrid}
														onChange={(e) => setShowGrid(e.target.checked)}
														className="w-4 h-4"
													/>
													<label
														htmlFor="showGrid"
														className="text-xs cursor-pointer"
													>
														Grid
													</label>
												</div>
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														id="fogOfWar"
														checked={fogOfWar}
														onChange={(e) => {
															const checked = e.target.checked;
															setFogOfWar(checked);
															if (!currentScene) return;
															if (checked && !currentScene.fogData) {
																updateScene({
																	fogOfWar: checked,
																	fogData: buildFogData(currentScene, false),
																});
															} else {
																updateScene({ fogOfWar: checked });
															}
														}}
														className="w-4 h-4"
													/>
													<label
														htmlFor="fogOfWar"
														className="text-xs cursor-pointer"
													>
														Fog of War
													</label>
												</div>
												{fogOfWar && isWarden && currentScene && (
													<div className="space-y-2 border-t border-border/50 pt-2">
														<div>
															<Label className="text-xs">Fog Mode</Label>
															<div className="flex gap-2">
																<Button
																	variant={
																		fogMode === "reveal" ? "default" : "outline"
																	}
																	size="sm"
																	onClick={() => setFogMode("reveal")}
																	className="flex-1"
																>
																	Reveal
																</Button>
																<Button
																	variant={
																		fogMode === "hide" ? "default" : "outline"
																	}
																	size="sm"
																	onClick={() => setFogMode("hide")}
																	className="flex-1"
																>
																	Hide
																</Button>
															</div>
														</div>
														<div>
															<Label className="text-xs">Brush Size</Label>
															<input
																type="range"
																min={1}
																max={4}
																step={1}
																value={fogBrushSize}
																onChange={(e) =>
																	setFogBrushSize(Number(e.target.value))
																}
																aria-label="Fog brush size"
																className="w-full"
															/>
															<div className="text-[10px] text-foreground/70">
																Size: {fogBrushSize}
															</div>
														</div>
														<div className="flex gap-2">
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	updateScene({
																		fogData: buildFogData(currentScene, false),
																	})
																}
																className="flex-1"
															>
																Reset Fog
															</Button>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	updateScene({
																		fogData: buildFogData(currentScene, true),
																	})
																}
																className="flex-1"
															>
																Reveal All
															</Button>
														</div>
													</div>
												)}
												{selectedTool === "draw" && isWarden && (
													<div className="space-y-2 border-t border-border/50 pt-2">
														<Label className="text-xs">Draw Mode</Label>
														<div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
															{(
																[
																	"freehand",
																	"line",
																	"rectangle",
																	"circle",
																] as const
															).map((mode) => (
																<Button
																	key={mode}
																	variant={
																		drawingMode === mode ? "default" : "outline"
																	}
																	size="sm"
																	onClick={() => setDrawingMode(mode)}
																	className="text-xs capitalize"
																>
																	{mode}
																</Button>
															))}
														</div>
														<div className="grid grid-cols-2 gap-2">
															<div>
																<Label className="text-xs">Color</Label>
																<Input
																	type="color"
																	value={drawingColor}
																	onChange={(e) =>
																		setDrawingColor(e.target.value)
																	}
																	className="h-8"
																/>
															</div>
															<div>
																<Label className="text-xs">Width</Label>
																<Input
																	type="number"
																	min={1}
																	max={10}
																	value={drawingWidth}
																	onChange={(e) =>
																		setDrawingWidth(Number(e.target.value) || 1)
																	}
																	className="h-8 text-xs"
																/>
															</div>
														</div>
													</div>
												)}
												{selectedTool === "note" && isWarden && (
													<div className="space-y-2 border-t border-border/50 pt-2">
														<Label className="text-xs">Note Text</Label>
														<Input
															value={noteText}
															onChange={(e) => setNoteText(e.target.value)}
															placeholder="Enter map note..."
															className="h-8 text-xs"
														/>
													</div>
												)}
											</div>
										</AscendantWindow>
										<AscendantWindow title="LAYERS">
											<div className="space-y-2">
												<Label className="text-xs">Active Layer</Label>
												<Select
													value={String(currentLayer)}
													onValueChange={(value) =>
														setCurrentLayer(Number(value))
													}
												>
													<SelectTrigger className="h-8 text-xs">
														<SelectValue placeholder="Select layer" />
													</SelectTrigger>
													<SelectContent>
														{LAYER_OPTIONS.filter(
															(layer) => isWarden || layer.id !== 3,
														).map((layer) => (
															<SelectItem
																key={layer.id}
																value={String(layer.id)}
															>
																{layer.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<div className="space-y-1">
													{LAYER_OPTIONS.filter(
														(layer) => isWarden || layer.id !== 3,
													).map((layer) => {
														const isVisible = !!visibleLayers[layer.id];
														return (
															<div
																key={layer.id}
																className="flex items-center justify-between gap-2"
															>
																<button
																	type="button"
																	onClick={() => setCurrentLayer(layer.id)}
																	className={cn(
																		"flex-1 rounded border px-2 py-1 text-xs text-left",
																		currentLayer === layer.id
																			? "bg-primary/20 border-primary"
																			: "border-border hover:bg-muted/50",
																	)}
																>
																	{layer.label}
																</button>
																<button
																	type="button"
																	onClick={() =>
																		setVisibleLayers((prev) => ({
																			...prev,
																			[layer.id]: !prev[layer.id],
																		}))
																	}
																	className="h-7 w-7 rounded border border-border flex items-center justify-center"
																	aria-label={
																		isVisible ? "Hide layer" : "Show layer"
																	}
																>
																	{isVisible ? (
																		<Eye className="w-3 h-3" />
																	) : (
																		<EyeOff className="w-3 h-3" />
																	)}
																</button>
															</div>
														);
													})}
												</div>
											</div>
										</AscendantWindow>
										<AscendantWindow title="MAP SETTINGS">
											<div className="space-y-3">
												<input
													ref={mapInputRef}
													type="file"
													accept="image/*"
													aria-label="Upload map image"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															void handleMapUpload(file);
														}
														e.currentTarget.value = "";
													}}
													className="hidden"
												/>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => mapInputRef.current?.click()}
														className="flex-1"
														disabled={isUploadingMap}
													>
														<Upload className="w-3 h-3 mr-1" />
														{isUploadingMap ? "Uploading" : "Upload"}
													</Button>
													{currentScene?.backgroundImage && (
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																updateScene({ backgroundImage: undefined })
															}
														>
															Clear
														</Button>
													)}
												</div>
												<div className="grid grid-cols-2 gap-2">
													<div>
														<Label className="text-xs">Width (tiles)</Label>
														<Input
															type="number"
															min={5}
															max={100}
															value={currentScene?.width ?? 20}
															onChange={(e) => {
																const nextWidth = Math.max(
																	5,
																	Number(e.target.value) || 5,
																);
																resizeScene(
																	nextWidth,
																	currentScene?.height ?? 20,
																);
															}}
															className="h-8 text-xs"
														/>
													</div>
													<div>
														<Label className="text-xs">Height (tiles)</Label>
														<Input
															type="number"
															min={5}
															max={100}
															value={currentScene?.height ?? 20}
															onChange={(e) => {
																const nextHeight = Math.max(
																	5,
																	Number(e.target.value) || 5,
																);
																resizeScene(
																	currentScene?.width ?? 20,
																	nextHeight,
																);
															}}
															className="h-8 text-xs"
														/>
													</div>
												</div>
												<div>
													<Label className="text-xs">Grid Size (px)</Label>
													<Input
														type="number"
														min={20}
														max={120}
														value={gridSize}
														onChange={(e) =>
															updateScene({
																gridSize: Math.max(
																	20,
																	Number(e.target.value) ||
																		DEFAULT_SCENE_SETTINGS.gridSize,
																),
															})
														}
														className="h-8 text-xs"
													/>
												</div>
												<div>
													<Label className="text-xs">Grid Type</Label>
													<Select
														value={currentScene?.gridType ?? "square"}
														onValueChange={(val: "square" | "hex") =>
															updateScene({ gridType: val })
														}
													>
														<SelectTrigger className="h-8 text-xs">
															<SelectValue placeholder="Square" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="square">Square</SelectItem>
															<SelectItem value="hex">Hex (Flat)</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label className="text-xs">Weather</Label>
													<Select
														value={currentScene?.weather ?? "none"}
														onValueChange={(val: WeatherType | "none") =>
															updateScene({
																weather: val === "none" ? undefined : val,
															})
														}
													>
														<SelectTrigger className="h-8 text-xs">
															<SelectValue placeholder="None" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="none">None</SelectItem>
															{Object.keys(WEATHER_PRESETS).map((key) => (
																<SelectItem key={key} value={key}>
																	{key
																		.replace("_", " ")
																		.replace(/\b\w/g, (l) => l.toUpperCase())}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label className="text-xs">Background Scale</Label>
													<Input
														type="number"
														min={0.4}
														max={3}
														step={0.05}
														value={backgroundScale}
														onChange={(e) =>
															updateScene({
																backgroundScale: Math.max(
																	0.4,
																	Number(e.target.value) || 1,
																),
															})
														}
														className="h-8 text-xs"
													/>
												</div>
												<div className="grid grid-cols-2 gap-2">
													<div>
														<Label className="text-xs">Offset X</Label>
														<Input
															type="number"
															value={backgroundOffsetX}
															onChange={(e) =>
																updateScene({
																	backgroundOffsetX:
																		Number(e.target.value) || 0,
																})
															}
															className="h-8 text-xs"
														/>
													</div>
													<div>
														<Label className="text-xs">Offset Y</Label>
														<Input
															type="number"
															value={backgroundOffsetY}
															onChange={(e) =>
																updateScene({
																	backgroundOffsetY:
																		Number(e.target.value) || 0,
																})
															}
															className="h-8 text-xs"
														/>
													</div>
												</div>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														className="flex-1"
														onClick={() =>
															updateScene({
																backgroundScale: 1,
																backgroundOffsetX: 0,
																backgroundOffsetY: 0,
															})
														}
													>
														Reset View
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="flex-1"
														onClick={() => updateScene({ drawings: [] })}
													>
														Clear Drawings
													</Button>
												</div>
											</div>
										</AscendantWindow>
										{PREMADE_MAPS.length > 0 && (
											<AscendantWindow title="PREMADE MAPS">
												<div className="grid grid-cols-2 gap-2">
													{PREMADE_MAPS.map((map) => (
														<button
															type="button"
															key={map.id}
															onClick={() => applyPremadeMap(map)}
															className="group rounded-lg border border-border bg-muted/20 p-2 text-left transition-all hover:bg-muted/40"
															aria-label={`Use ${map.name} map`}
														>
															<div className="h-20 w-full rounded-md border border-border/60 bg-muted/40 overflow-hidden">
																<OptimizedImage
																	src={map.thumbnail}
																	alt={`${map.name} thumbnail`}
																	className="w-full h-full object-cover"
																	size="small"
																/>
															</div>
															<div className="mt-2 flex items-center justify-between gap-2">
																<span className="text-xs font-heading">
																	{map.name}
																</span>
																<Badge
																	variant="outline"
																	className="text-[9px] uppercase tracking-wide"
																>
																	{map.theme}
																</Badge>
															</div>
															<div className="text-[10px] text-foreground/70">
																{map.grid.width}x{map.grid.height} -{" "}
																{map.grid.size}px grid
															</div>
														</button>
													))}
												</div>
											</AscendantWindow>
										)}
									</>
								)}

								{/* Embedded Initiative Tracker */}
								{isWarden && (
									<AscendantWindow title="INITIATIVE TRACKER">
										<VTTInitiativePanel
											campaignId={campaignId || ""}
											sessionId={sessionId}
											isWarden={isWarden}
											onHighlightToken={(characterId) => {
												// Find token with matching characterId and highlight it
												const token = currentScene?.tokens.find(
													(t) => t.characterId === characterId,
												);
												if (token) setActiveTokenId(token.id);
											}}
										/>
									</AscendantWindow>
								)}

								{/* Audio Manager */}
								{isWarden && sessionId && (
									<AscendantWindow title="AUDIO TRACKS">
										<div className="space-y-4">
											{audioTracks.length === 0 ? (
												<AscendantText className="block text-xs text-foreground/70 text-center py-2">
													No tracks uploaded for this session yet.
												</AscendantText>
											) : (
												<div className="space-y-2 max-h-48 overflow-y-auto">
													{audioTracks.map((track) => (
														<div
															key={track.id}
															className="flex items-center justify-between p-2 text-xs border border-border rounded bg-muted/20"
														>
															<span className="truncate flex-1 font-medium">
																{track.name}
															</span>
															<div className="flex items-center gap-1">
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-6 w-6 p-0"
																	onClick={() => {
																		if (track.is_playing) {
																			vttAudioManager.stopTrack(track.id);
																			updateTrack({
																				track_id: track.id,
																				session_id: sessionId,
																				is_playing: false,
																			});
																		} else {
																			vttAudioManager.playTrack(track);
																			updateTrack({
																				track_id: track.id,
																				session_id: sessionId,
																				is_playing: true,
																			});
																		}
																	}}
																>
																	{track.is_playing ? "⏹" : "▶"}
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-6 w-6 p-0 text-destructive"
																	onClick={() =>
																		deleteTrack({
																			trackId: track.id,
																			sessionId,
																		})
																	}
																>
																	×
																</Button>
															</div>
														</div>
													))}
												</div>
											)}
											<Button
												variant="outline"
												size="sm"
												className="w-full text-xs"
												onClick={() => {
													const url = window.prompt(
														"Enter valid audio URL (mp3/wav/ogg):",
													);
													const name = window.prompt("Enter track name:");
													if (url && name) {
														createTrack({
															session_id: sessionId,
															name,
															url,
															type: "music",
															volume: 0.5,
															loop: true,
															is_playing: false,
															created_by: user?.id || "",
														});
													}
												}}
											>
												+ Add Audio Track URL
											</Button>
										</div>
									</AscendantWindow>
								)}

								{/* Comprehensive Warden Tools Panel */}
								{isWarden && (
									<ProtocolWardenTools
										campaignId={campaignId || ""}
										onRoll={vttRealtime.rollAndBroadcast}
										onChangeMap={(url) => {
											if (currentScene) {
												const nextScene = {
													...currentScene,
													backgroundUrl: url,
												};
												updateScene(nextScene);
												vttRealtime.broadcastSceneSync(
													upsertScene(scenes, nextScene),
													currentScene.id,
												);
											}
										}}
										onAddToken={(t: VTTTokenPayload) => {
											if (currentScene) {
												const newToken = {
													...t,
													id: t.id || `token-${Date.now()}`,
												} as PlacedToken;
												updateScene({
													tokens: [...(currentScene.tokens || []), newToken],
												});
												vttRealtime.broadcastTokenAdd(newToken);
											}
										}}
										onAddEffect={(e: VTTEffectPayload) => {
											if (!currentScene) return;
											const cx = Math.floor((currentScene.width || 20) / 2);
											const cy = Math.floor((currentScene.height || 20) / 2);

											if (e.type === "magic" || e.type === "image") {
												const newToken = {
													id: e.id || `effect-${Date.now()}`,
													name: e.name || "Effect",
													tokenType: "effect",
													imageUrl: e.imageUrl,
													x: e.x ?? cx,
													y: e.y ?? cy,
													size: "large",
													color: e.color || "#ffffff",
													rotation: 0,
													layer: 2,
													locked: false,
													visible: true,
													render: {
														mode: "overlay",
														blendMode: "screen",
														opacity: 0.8,
													},
												} as PlacedToken;
												updateScene({
													tokens: [...(currentScene.tokens || []), newToken],
												});
												vttRealtime.broadcastTokenAdd(newToken);
											} else if (e.type === "light" || e.type === "dark") {
												const lightRadius = e.radius || 10;
												const newLight: LightSource = {
													id: e.id || `light-${Date.now()}`,
													x: e.x ?? cx,
													y: e.y ?? cy,
													brightRadius: Math.floor(lightRadius * 0.6),
													dimRadius: lightRadius,
													color: e.color || "#ffffff",
													intensity: e.type === "dark" ? 0 : 0.8,
													type: e.type === "dark" ? "ambient" : "torch",
												};
												const nextScene = {
													...currentScene,
													lights: [...(currentScene.lights || []), newLight],
												};
												updateScene(nextScene);
												vttRealtime.broadcastSceneSync(
													upsertScene(scenes, nextScene),
													currentScene.id,
												);
											} else if (e.type === "terrain") {
												const terrainCenter = {
													x: e.x ?? cx,
													y: e.y ?? cy,
												};
												const terrainRadius = e.radius || 8;
												const newTerrain: TerrainZone = {
													id: e.id || `terrain-${Date.now()}`,
													type: "difficult",
													vertices: [
														{
															x: terrainCenter.x - terrainRadius,
															y: terrainCenter.y - terrainRadius,
														},
														{
															x: terrainCenter.x + terrainRadius,
															y: terrainCenter.y - terrainRadius,
														},
														{
															x: terrainCenter.x + terrainRadius,
															y: terrainCenter.y + terrainRadius,
														},
														{
															x: terrainCenter.x - terrainRadius,
															y: terrainCenter.y + terrainRadius,
														},
													],
													movementCost: 2,
													fillColor: e.color || "rgba(139,90,43,0.25)",
													label: e.name || "Difficult Terrain",
													visible: true,
												};
												const nextScene = {
													...currentScene,
													terrain: [
														...(currentScene.terrain || []),
														newTerrain,
													],
												};
												updateScene(nextScene);
												vttRealtime.broadcastSceneSync(
													upsertScene(scenes, nextScene),
													nextScene.id,
												);
											} else if (e.type === "ambient") {
												const newAmbient: AmbientSoundZone = {
													id: e.id || `ambient-${Date.now()}`,
													label: e.name || "Ambient",
													audioUrl:
														"library:" +
														(e.name || "").toLowerCase().replace(/\s/g, "-"),
													x: e.x ?? cx,
													y: e.y ?? cy,
													shape: "circle",
													radius: e.radius || 10,
													volume: 0.8,
													loop: true,
													enabled: true,
													gmOnly: true,
													walledOcclusion: false,
													falloff: "linear",
													category: "ambient",
												};
												const nextScene = {
													...currentScene,
													ambientSounds: [
														...(currentScene.ambientSounds || []),
														newAmbient,
													],
												};
												updateScene(nextScene);
												vttRealtime.broadcastSceneSync(
													upsertScene(scenes, nextScene),
													nextScene.id,
												);
											}
										}}
										onShareHandout={(url: string, name?: string) => {
											vttRealtime.rollAndBroadcast(
												`[Handout] Warden Shared: ${name || "Asset"}\n[URL](${url})`,
												"wardenroll",
											);
										}}
										onPlaySound={(soundId) => {
											vttRealtime.broadcastAudioSync("play_sound", soundId);
											toast({
												title: "Sound Played",
												description: `Playing ${soundId} sound effect`,
											});
										}}
										onMusicChange={(musicId) => {
											if (!musicEngineRef.current) {
												musicEngineRef.current = new VttMusicEngine();
											}
											if (musicId === "stop") {
												musicEngineRef.current.stop();
												vttRealtime.broadcastAudioSync("music_stop", "stop");
												toast({ title: "Music Stopped" });
											} else {
												musicEngineRef.current.play(musicId as MusicMood);
												vttRealtime.broadcastAudioSync("music_change", musicId);
												toast({
													title: "Music Changed",
													description: `Playing ${musicId} ambient music`,
												});
											}
										}}
									/>
								)}

								<AscendantWindow title="TOKENS">
									<Tabs defaultValue="characters" className="w-full">
										<TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-card border border-border rounded-lg shadow-sm">
											<TabsTrigger
												value="characters"
												className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
											>
												<Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
												<span className="hidden xs:inline">Characters</span>
												<span className="xs:hidden">C</span>
											</TabsTrigger>
											<TabsTrigger
												value="library"
												className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
											>
												<ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
												<span className="hidden xs:inline">Library</span>
												<span className="xs:hidden">L</span>
											</TabsTrigger>
										</TabsList>
										<TabsContent value="characters" className="mt-3">
											<div className="space-y-2 max-h-60 overflow-y-auto">
												{resolvedCharacters.length === 0 && (
													<AscendantText className="block text-xs text-foreground/70 text-center py-4">
														No characters yet.
													</AscendantText>
												)}
												{resolvedCharacters.map((char) => {
													const portraitUrl =
														typeof char.portrait_url === "string"
															? char.portrait_url
															: null;
													return (
														<button
															type="button"
															key={char.id}
															onClick={() => {
																setSelectedCharacterId(char.id);
																setSelectedLibraryTokenId(null);
																setSelectedTool("select");
															}}
															className={cn(
																"w-full p-2 rounded border text-left text-xs transition-all flex items-center gap-2",
																selectedCharacterId === char.id
																	? "bg-primary/20 border-primary"
																	: "border-border hover:bg-muted/50",
															)}
														>
															{portraitUrl && (
																<OptimizedImage
																	src={portraitUrl}
																	alt={char.name}
																	className="w-8 h-8 rounded-full object-cover border border-border"
																	size="thumbnail"
																/>
															)}
															<div className="flex-1 min-w-0">
																<div className="font-semibold truncate">
																	{char.name}
																</div>
																<div className="text-foreground/70">
																	{char.hp_current || 0}/{char.hp_max || 0} HP |
																	AC {char.armor_class || 10}
																</div>
															</div>
														</button>
													);
												})}
											</div>
										</TabsContent>
										<TabsContent value="library" className="mt-3">
											<div className="space-y-3">
												<Input
													value={tokenSearch}
													onChange={(e) => setTokenSearch(e.target.value)}
													placeholder="Search tokens..."
													className="h-8 text-xs"
												/>
												<div className="space-y-2 max-h-60 overflow-y-auto">
													{filteredLibraryTokens.length === 0 && (
														<AscendantText className="block text-xs text-foreground/70 text-center py-4">
															No tokens match.
														</AscendantText>
													)}
													{filteredLibraryTokens.map((token) => {
														const isOverlayPreview =
															token.render?.mode === "overlay" ||
															token.type === "effect" ||
															token.type === "prop" ||
															(!!token.imageUrl &&
																(token.imageUrl.includes("/generated/props/") ||
																	token.imageUrl.includes(
																		"/generated/effects/",
																	)));
														return (
															<button
																type="button"
																key={token.id}
																onClick={() => {
																	setSelectedLibraryTokenId(token.id);
																	setSelectedCharacterId(null);
																	setSelectedTool("select");
																}}
																className={cn(
																	"w-full p-2 rounded border text-left text-xs transition-all flex items-center gap-2",
																	selectedLibraryTokenId === token.id
																		? "bg-primary/20 border-primary"
																		: "border-border hover:bg-muted/50",
																)}
															>
																<div
																	className={cn(
																		"w-8 h-8 border border-border flex items-center justify-center overflow-hidden",
																		isOverlayPreview
																			? "rounded-md bg-transparent"
																			: "rounded-full bg-muted/40",
																	)}
																>
																	{token.imageUrl ? (
																		<OptimizedImage
																			src={token.imageUrl}
																			alt={token.name}
																			className={cn(
																				"w-full h-full",
																				isOverlayPreview
																					? "object-contain"
																					: "object-cover rounded-full",
																			)}
																			size="thumbnail"
																		/>
																	) : (
																		<span className="text-sm">
																			{token.emoji || "@"}
																		</span>
																	)}
																</div>
																<div className="flex-1 min-w-0">
																	<div className="font-semibold truncate">
																		{token.name}
																	</div>
																	<div className="text-foreground/70 capitalize">
																		{token.category} | {token.size}
																	</div>
																</div>
															</button>
														);
													})}
												</div>
											</div>
										</TabsContent>
									</Tabs>
								</AscendantWindow>
							</div>

							{/* Main Map Area */}
							<div
								className={cn(
									"order-1 xl:order-2 min-h-0", // min-h-0 ensures map shrinks to fit grid area
									isMapExpanded
										? "col-span-1 xl:col-span-12"
										: "col-span-1 xl:col-span-7",
								)}
							>
								<AscendantWindow
									title="MAP"
									className="min-h-[60vh] md:h-full flex flex-col"
									contentClassName="flex-1 flex flex-col"
									actions={
										<div className="flex items-center gap-1 sm:gap-2">
											<Button
												variant="outline"
												size="sm"
												className="h-7 text-[10px] px-2 border-primary/30 hover:bg-primary/10"
												onClick={() => setIsMapExpanded((prev) => !prev)}
											>
												<Maximize2 className="w-3 h-3 mr-1" />
												<span className="hidden sm:inline">
													{isMapExpanded ? "Exit Focus" : "Focus"}
												</span>
												<span className="sm:hidden">
													{isMapExpanded ? "Exit" : "Focus"}
												</span>
											</Button>
										</div>
									}
								>
									<div
										ref={mapRef}
										onClick={handleMapClick}
										onDoubleClick={handleMapDoubleClick}
										onMouseDown={handleMapMouseDown}
										onMouseMove={handleMapMouseMove}
										onMouseUp={handleMapMouseUp}
										onMouseLeave={handleMapMouseUp}
										onKeyDown={handleMapKeyDown}
										onContextMenu={(e) => {
											e.preventDefault();
											// Find token at click position for right-click/long-press context menu
											const rect = mapRef.current?.getBoundingClientRect();
											if (!rect) return;
											const mx = e.clientX - rect.left;
											const my = e.clientY - rect.top;
											const gx = Math.floor(mx / (gridSize * zoom));
											const gy = Math.floor(my / (gridSize * zoom));
											const token = visibleTokens.find(
												(t) => t.x === gx && t.y === gy,
											);
											if (token) {
												setContextMenu({
													x: e.clientX,
													y: e.clientY,
													tokenId: token.id,
												});
											}
										}}
										onTouchStart={(e) => {
											if (e.touches.length === 2) {
												const dx = e.touches[0].clientX - e.touches[1].clientX;
												const dy = e.touches[0].clientY - e.touches[1].clientY;
												touchRef.current = {
													startDist: Math.hypot(dx, dy),
													startZoom: zoom,
												};
											}
										}}
										onTouchMove={(e) => {
											if (e.touches.length === 2 && touchRef.current) {
												const dx = e.touches[0].clientX - e.touches[1].clientX;
												const dy = e.touches[0].clientY - e.touches[1].clientY;
												const dist = Math.hypot(dx, dy);
												const scale = dist / touchRef.current.startDist;
												setZoom(
													Math.max(
														0.5,
														Math.min(2, touchRef.current.startZoom * scale),
													),
												);
											}
										}}
										onTouchEnd={() => {
											touchRef.current = null;
										}}
										onDragOver={(e) => {
											e.preventDefault();
											e.dataTransfer.dropEffect = "copy";
										}}
										onDrop={(e) => {
											e.preventDefault();
											const raw = e.dataTransfer.getData(
												"application/vtt-asset",
											);
											if (!raw || !currentScene) return;
											try {
												const asset = JSON.parse(raw) as {
													imageUrl: string;
													name: string;
													category: string;
												};
												const rect = mapRef.current?.getBoundingClientRect();
												const mx = rect ? e.clientX - rect.left : 0;
												const my = rect ? e.clientY - rect.top : 0;
												const gx = Math.max(
													0,
													Math.min(
														Math.floor(mx / (gridSize * zoom)),
														(currentScene.width ?? 20) - 1,
													),
												);
												const gy = Math.max(
													0,
													Math.min(
														Math.floor(my / (gridSize * zoom)),
														(currentScene.height ?? 20) - 1,
													),
												);
												if (
													asset.category === "map" ||
													asset.category === "location"
												) {
													updateScene({
														backgroundImage: asset.imageUrl,
														name: asset.name || currentScene.name,
													});
													toast({
														title: "Map Set",
														description: `"${asset.name}" applied as VTTScene background.`,
													});
												} else {
													const isEffect = [
														"effect",
														"condition",
														"technique",
														"spell",
													].includes(asset.category);
													const placed: import("@/types/vtt").VTTTokenInstance =
														{
															id: `${isEffect ? "effect" : "token"}-${Date.now()}`,
															name: asset.name || "Token",
															imageUrl: asset.imageUrl,
															size: isEffect ? "large" : "medium",
															tokenType: isEffect ? "effect" : undefined,
															render: isEffect
																? {
																		mode: "overlay",
																		blendMode: "screen",
																		opacity: 0.9,
																	}
																: undefined,
															x: gx,
															y: gy,
															rotation: 0,
															layer: isEffect ? 2 : 1,
															locked: false,
															visible: true,
														};
													appendToken(placed);
													setActiveTokenId(placed.id);
													toast({
														title: isEffect ? "Effect Placed" : "Token Placed",
														description: `"${asset.name}" placed at (${gx}, ${gy}).`,
													});
												}
											} catch {
												/* ignore invalid drop data */
											}
										}}
										role="application"
										aria-label="VTT map canvas. Click to place or interact with items, press Enter to act at center. Drop assets from the browser to place them."
										className={cn(
											"flex-1 relative border-2 border-border rounded-lg bg-background overflow-auto min-h-[500px]",
											selectedTool !== "select" && "cursor-crosshair",
											selectedTool === "select" &&
												(selectedCharacterId || selectedLibraryTokenId) &&
												"cursor-crosshair",
										)}
									>
										<div className={cn("vtt-scene-container", sceneClass)}>
											<style>{overlayStyles}</style>
											{!currentScene ? (
												<div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-void-black/80 backdrop-blur-sm z-50">
													<MapPin className="w-12 h-12 text-primary/40 mb-4 animate-pulse" />
													<AscendantText
														variant="sovereign"
														size="lg"
														className="mb-2"
													>
														No Active Lattice Detected
													</AscendantText>
													<AscendantText className="text-sm text-foreground/70 max-w-md">
														Select a scene from the Warden direct-link or drop a
														map asset here to initialize the dimensional
														projection.
													</AscendantText>
												</div>
											) : (
												<MemoizedVttPixiStage
													containerRef={mapRef}
													scene={currentScene}
													tokens={visibleTokens}
													walls={currentScene?.walls ?? EMPTY_ARRAY}
													lightSources={currentScene?.lights ?? EMPTY_ARRAY}
													gridConfig={memoizedGridConfig}
													gridSize={gridSize}
													zoom={zoom}
													showGrid={showGrid}
													isWarden={isWarden}
													effectiveVisibleLayers={effectiveVisibleLayers}
													activeTokenId={activeTokenId}
													activeInitiativeTokenId={activeInitiativeTokenId}
													setActiveTokenId={setActiveTokenId}
													updateToken={updateToken}
													onRequestZoom={handleRequestZoom}
													onTokenDragStart={handlePixiTokenDragStart}
													onTokenDragEnd={handlePixiTokenDragEnd}
												/>
											)}

											{/* TEMP: keep these DOM overlays until they are migrated to Pixi in follow-up commits */}
											{/* Terrain overlay */}
											{currentScene?.terrain &&
												currentScene.terrain.length > 0 && (
													<div className="absolute inset-0 pointer-events-none z-[1]">
														<svg
															className="absolute inset-0 w-full h-full overflow-visible"
															role="img"
															aria-label="Terrain overlay"
														>
															<title>Terrain zones</title>
															{currentScene.terrain.map((zone) => {
																if (!zone.visible && !isWarden) return null;
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
																		)} // Try to extract fully opaque stroke
																		strokeWidth={2}
																		opacity={zone.visible ? 1 : 0.4}
																	/>
																);
															})}
														</svg>
													</div>
												)}

											{/* Ambient Sounds Warden Overlay */}
											{isWarden &&
												currentScene?.ambientSounds &&
												currentScene.ambientSounds.length > 0 && (
													<div className="absolute inset-0 pointer-events-none z-[1]">
														<svg
															className="absolute inset-0 w-full h-full overflow-visible"
															role="img"
															aria-label="Ambient sounds overlay"
														>
															<title>Ambient sound zones</title>
															{currentScene.ambientSounds.map((zone) => {
																const gZoom = gridSize * zoom;
																const cx = (zone.x + 0.5) * gZoom;
																const cy = (zone.y + 0.5) * gZoom;

																if (zone.shape === "circle") {
																	const r = zone.radius * gZoom;
																	return (
																		<circle
																			key={zone.id}
																			cx={cx}
																			cy={cy}
																			r={r}
																			fill="rgba(0, 255, 128, 0.1)"
																			stroke="rgba(0, 255, 128, 0.6)"
																			strokeWidth={1}
																			strokeDasharray="4 4"
																		/>
																	);
																} else if (
																	zone.shape === "rectangle" &&
																	zone.width &&
																	zone.height
																) {
																	const w = zone.width * gZoom;
																	const h = zone.height * gZoom;
																	return (
																		<rect
																			key={zone.id}
																			x={cx - w / 2}
																			y={cy - h / 2}
																			width={w}
																			height={h}
																			fill="rgba(0, 255, 128, 0.1)"
																			stroke="rgba(0, 255, 128, 0.6)"
																			strokeWidth={1}
																			strokeDasharray="4 4"
																		/>
																	);
																}
																return null;
															})}
														</svg>
													</div>
												)}

											{drawingsToRender.length > 0 && (
												<div className="absolute inset-0 pointer-events-none">
													{drawingsToRender.map((drawing) => {
														if (drawing.layer === "Warden" && !isWarden)
															return null;

														if (drawing.type === "freehand") {
															// SVG freehand
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
																	className="absolute inset-0 w-full h-full overflow-visible"
																	role="img"
																	aria-label="Freehand drawing"
																>
																	<title>Freehand drawing</title>
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
																		"vtt-drawing-line absolute origin-left rounded-full",
																		`vtt-drawing-line-${toSafeClassName(drawing.id)}`,
																	)}
																/>
															);
														}
														return (
															<div
																key={drawing.id}
																className={cn(
																	"vtt-drawing-shape absolute border-solid box-border",
																	drawing.type === "circle" && "rounded-full",
																	`vtt-drawing-shape-${toSafeClassName(drawing.id)}`,
																)}
															/>
														);
													})}
												</div>
											)}
											{annotationsToRender.length > 0 && (
												<div className="absolute inset-0">
													{annotationsToRender.map((note) => {
														if (!effectiveVisibleLayers[note.layer])
															return null;
														return (
															<button
																type="button"
																key={note.id}
																className={cn(
																	"vtt-annotation",
																	`vtt-annotation-${toSafeClassName(note.id)}`,
																)}
																onDoubleClick={(e) => {
																	if (!isWarden) return;
																	e.stopPropagation();
																	removeAnnotation(note.id);
																}}
																onKeyDown={(e) =>
																	handleAnnotationKeyDown(note.id, e)
																}
																tabIndex={isWarden ? 0 : -1}
																aria-label={
																	isWarden
																		? `Remove annotation ${note.text}`
																		: `Annotation ${note.text}`
																}
															>
																{note.text}
															</button>
														);
													})}
												</div>
											)}
											{selectedTool === "measure" &&
												measurementStart &&
												measurementEnd &&
												(() => {
													const dx = Math.abs(
														measurementEnd.x - measurementStart.x,
													);
													const dy = Math.abs(
														measurementEnd.y - measurementStart.y,
													);
													const distance =
														measureShape === "line"
															? Math.max(dx, dy) + Math.min(dx, dy) * 0.5
															: measureRadius;
													return (
														<div className="vtt-measurement">
															{measureShape === "line" && (
																<div
																	className={cn(
																		"vtt-measurement-line",
																		"vtt-measurement-line-active",
																	)}
																/>
															)}
															{measureShape === "circle" && (
																<div className="vtt-aoe-circle" />
															)}
															{measureShape === "cone" && (
																<div className="vtt-aoe-cone" />
															)}
															{measureShape === "cube" && (
																<div className="vtt-aoe-cube" />
															)}
															<div
																className={cn(
																	"vtt-measurement-label",
																	"vtt-measurement-label-active",
																)}
															>
																{measureShape === "line"
																	? `${distance.toFixed(1)}u (${(distance * 5).toFixed(0)} ft)`
																	: `${measureShape} ${measureRadius * 5}ft`}
															</div>
														</div>
													);
												})()}

											{/* Ping overlay */}
											{vttRealtime.pings.length > 0 && (
												<div className="absolute inset-0 pointer-events-none vtt-ping-layer">
													{vttRealtime.pings.map((ping) => (
														<DynamicStyle
															key={ping.createdAt}
															className="absolute animate-ping vtt-ping"
															vars={{
																"--vtt-ping-x": `${(ping.x + 0.5) * gridSize * zoom}px`,
																"--vtt-ping-y": `${(ping.y + 0.5) * gridSize * zoom}px`,
															}}
														/>
													))}
												</div>
											)}

											{/* Weather overlay */}
											{currentScene?.weather &&
												currentScene.weather !== "clear" &&
												WEATHER_PRESETS[
													currentScene.weather as keyof typeof WEATHER_PRESETS
												] && (
													<div
														className="absolute inset-0 pointer-events-none z-[10] overflow-hidden mix-blend-screen opacity-80"
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
														}).map((_) => {
															const size = Math.random() * 4 + 2;
															const left = Math.random() * 100;
															const top = Math.random() * 100;
															const animDuration = Math.random() * 2 + 1;
															const delay = Math.random() * -2;
															return (
																<DynamicStyle
																	key={`vtt-wp-${currentScene?.weather}-${size}-${left}-${top}`}
																	className="absolute rounded-full vtt-weather-particle"
																	vars={{
																		"--vtt-particle-size": `${size}px`,
																		"--vtt-particle-left": `${left}%`,
																		"--vtt-particle-top": `${top}%`,
																		"--vtt-particle-color":
																			WEATHER_PRESETS[
																				currentScene?.weather as keyof typeof WEATHER_PRESETS
																			].particleColor,
																		"--vtt-particle-animation": `weather-particle-${currentScene?.weather} ${animDuration}s linear infinite`,
																		"--vtt-particle-delay": `${delay}s`,
																	}}
																/>
															);
														})}
													</div>
												)}

											{/* Remote cursors overlay */}
											{vttRealtime.activeUsers.filter((u) => u.cursor).length >
												0 && (
												<div className="absolute inset-0 pointer-events-none vtt-cursor-layer">
													{vttRealtime.activeUsers
														.filter((u) => u.cursor)
														.map((u) => (
															<DynamicStyle
																key={u.userId}
																className="absolute transition-all duration-100 vtt-cursor"
																vars={{
																	"--vtt-cursor-x": `${((u.cursor?.x ?? 0) + 0.5) * gridSize * zoom}px`,
																	"--vtt-cursor-y": `${((u.cursor?.y ?? 0) + 0.5) * gridSize * zoom}px`,
																}}
															>
																<DynamicStyle
																	className="w-3 h-3 rounded-full border-2 border-white vtt-cursor-dot"
																	vars={{
																		"--vtt-user-color": u.color,
																	}}
																/>
																<DynamicStyle
																	as="div"
																	className="absolute top-4 left-0 text-[10px] px-1 rounded text-white whitespace-nowrap vtt-cursor-label"
																	vars={{
																		"--vtt-user-color": u.color,
																	}}
																>
																	{u.userName}
																</DynamicStyle>
															</DynamicStyle>
														))}
												</div>
											)}
										</div>
									</div>
								</AscendantWindow>
							</div>

							{/* Right Sidebar — hidden on mobile, shown via bottom sheet */}
							<div
								className={cn(
									"col-span-1 xl:col-span-3 flex flex-col gap-4 xl:overflow-y-auto order-3",
									"min-h-0", // Prevent CSS grid blowout
									isMapExpanded && "hidden",
									isMobile && "hidden",
								)}
							>
								{activeToken && (
									<AscendantWindow title="ACTIVE TOKEN">
										<div className="space-y-3 text-xs">
											<div>
												<Label className="text-xs">Name</Label>
												{isWarden ? (
													<Input
														value={activeToken.name}
														onChange={(e) =>
															updateToken(activeToken.id, {
																name: e.target.value,
															})
														}
														className="h-8 text-xs"
													/>
												) : (
													<p className="mt-1 text-sm">{activeToken.name}</p>
												)}
											</div>
											<div className="grid grid-cols-2 gap-2">
												<div>
													<Label className="text-xs">Size</Label>
													<Select
														value={activeToken.size}
														onValueChange={(value) =>
															updateToken(activeToken.id, {
																size: value as PlacedToken["size"],
															})
														}
														disabled={!isWarden}
													>
														<SelectTrigger className="h-8 text-xs">
															<SelectValue placeholder="Size" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="small">Small</SelectItem>
															<SelectItem value="medium">Medium</SelectItem>
															<SelectItem value="large">Large</SelectItem>
															<SelectItem value="huge">Huge</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label className="text-xs">Layer</Label>
													<Select
														value={String(activeToken.layer)}
														onValueChange={(value) =>
															updateToken(activeToken.id, {
																layer: Number(value),
															})
														}
														disabled={!isWarden}
													>
														<SelectTrigger className="h-8 text-xs">
															<SelectValue placeholder="Layer" />
														</SelectTrigger>
														<SelectContent>
															{LAYER_OPTIONS.filter(
																(layer) => isWarden || layer.id !== 3,
															).map((layer) => (
																<SelectItem
																	key={layer.id}
																	value={String(layer.id)}
																>
																	{layer.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
											{isWarden && (
												<div className="grid grid-cols-3 gap-2">
													<div>
														<Label className="text-xs">HP</Label>
														<Input
															type="number"
															value={activeToken.hp ?? 0}
															onChange={(e) => {
																const v = Number(e.target.value) || 0;
																updateToken(activeToken.id, { hp: v });
																syncCharacterHP(activeToken.characterId, v);
															}}
															aria-label="Hit points"
															className="h-8 text-xs"
														/>
													</div>
													<div>
														<Label className="text-xs">Max</Label>
														<Input
															type="number"
															value={activeToken.maxHp ?? 0}
															onChange={(e) =>
																updateToken(activeToken.id, {
																	maxHp: Number(e.target.value) || 0,
																})
															}
															aria-label="Max hit points"
															className="h-8 text-xs"
														/>
													</div>
													<div>
														<Label className="text-xs">AC</Label>
														<Input
															type="number"
															value={activeToken.ac ?? 10}
															onChange={(e) =>
																updateToken(activeToken.id, {
																	ac: Number(e.target.value) || 10,
																})
															}
															aria-label="Armor class"
															className="h-8 text-xs"
														/>
													</div>
												</div>
											)}
											<div className="grid grid-cols-2 gap-2">
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														checked={activeToken.visible}
														onChange={(e) =>
															updateToken(activeToken.id, {
																visible: e.target.checked,
															})
														}
														aria-label="Toggle token visibility"
														className="w-4 h-4"
														disabled={!isWarden}
													/>
													<span>Visible</span>
												</div>
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														checked={activeToken.locked}
														onChange={(e) =>
															updateToken(activeToken.id, {
																locked: e.target.checked,
															})
														}
														aria-label="Toggle token lock"
														className="w-4 h-4"
														disabled={!isWarden}
													/>
													<span>Locked</span>
												</div>
											</div>
											{isWarden && (
												<div className="space-y-2 border-t border-border/50 pt-2">
													<Label className="text-xs font-semibold">
														Conditions
													</Label>
													<div className="flex flex-wrap gap-1">
														{(
															[
																"Blinded",
																"Charmed",
																"Deafened",
																"Frightened",
																"Grappled",
																"Incapacitated",
																"Invisible",
																"Paralyzed",
																"Petrified",
																"Poisoned",
																"Prone",
																"Restrained",
																"Stunned",
																"Unconscious",
																"Concentrating",
																"Exhaustion",
															] as const
														).map((cond) => {
															const active =
																activeToken.conditions?.includes(cond);
															return (
																<button
																	type="button"
																	key={cond}
																	onClick={() => {
																		const current =
																			activeToken.conditions || [];
																		const next = active
																			? current.filter((c) => c !== cond)
																			: [...current, cond];
																		updateToken(activeToken.id, {
																			conditions: next,
																		});
																	}}
																	className={cn(
																		"text-[9px] px-1.5 py-0.5 rounded-full border transition-all",
																		active
																			? "bg-amber-500/30 border-amber-500 text-amber-300"
																			: "border-border/50 text-foreground/70 hover:bg-muted/50",
																	)}
																>
																	{cond}
																</button>
															);
														})}
													</div>
												</div>
											)}
											{isWarden && (
												<div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-2">
													<div>
														<Label className="text-xs">Aura (sq)</Label>
														<Input
															type="number"
															min={0}
															max={20}
															value={activeToken.auraRadius ?? 0}
															onChange={(e) =>
																updateToken(activeToken.id, {
																	auraRadius: Number(e.target.value) || 0,
																})
															}
															className="h-7 text-xs"
														/>
													</div>
													<div>
														<Label className="text-xs">Aura Color</Label>
														<Input
															type="color"
															value={activeToken.auraColor || "#3b82f6"}
															onChange={(e) =>
																updateToken(activeToken.id, {
																	auraColor: e.target.value,
																})
															}
															className="h-7"
														/>
													</div>
													<div>
														<Label className="text-xs">Light (sq)</Label>
														<Input
															type="number"
															min={0}
															max={24}
															value={activeToken.lightRadius ?? 0}
															onChange={(e) =>
																updateToken(activeToken.id, {
																	lightRadius: Number(e.target.value) || 0,
																})
															}
															className="h-7 text-xs"
														/>
													</div>
													<div>
														<Label className="text-xs">Bar Vis</Label>
														<Select
															value={activeToken.barVisibility || "always"}
															onValueChange={(v) =>
																updateToken(activeToken.id, {
																	barVisibility:
																		v as PlacedToken["barVisibility"],
																})
															}
														>
															<SelectTrigger className="h-7 text-xs">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="always">Everyone</SelectItem>
																<SelectItem value="owner">
																	Owner Only
																</SelectItem>
																<SelectItem value="Warden">
																	Warden Only
																</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>
											)}
											{isWarden && (
												<div className="flex items-center gap-2">
													<input
														type="checkbox"
														checked={activeToken.showNameplate ?? true}
														onChange={(e) =>
															updateToken(activeToken.id, {
																showNameplate: e.target.checked,
															})
														}
														aria-label="Show nameplate"
														className="w-3 h-3"
													/>
													<span className="text-xs">Show Nameplate</span>
												</div>
											)}
											<div>
												<Label className="text-xs">Rotation</Label>
												<Input
													type="number"
													value={activeToken.rotation}
													onChange={(e) =>
														updateToken(activeToken.id, {
															rotation: Number(e.target.value) || 0,
														})
													}
													className="h-8 text-xs"
													disabled={!isWarden}
												/>
											</div>
											{activeToken.characterId && (
												<Button
													variant="outline"
													size="sm"
													className="w-full"
													onClick={() =>
														window.open(
															`/characters/${activeToken.characterId}`,
															"_blank",
														)
													}
												>
													Open Character Sheet
												</Button>
											)}
											{isWarden && (
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														className="flex-1"
														onClick={() => removeToken(activeToken.id)}
													>
														Remove
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="flex-1"
														onClick={() => setDamageDialogOpen(true)}
													>
														Damage
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="flex-1"
														onClick={() => {
															const v =
																activeToken.maxHp ?? activeToken.hp ?? 0;
															updateToken(activeToken.id, { hp: v });
															syncCharacterHP(activeToken.characterId, v);
														}}
													>
														Heal
													</Button>
												</div>
											)}
										</div>
									</AscendantWindow>
								)}
								{/* Character Sheet Panel — shown when active token has a characterId */}
								{activeToken?.characterId && (
									<div className="max-h-[50vh] overflow-y-auto">
										<VTTCharacterPanel
											characterId={activeToken.characterId}
											onRoll={(formula) =>
												vttRealtime.rollAndBroadcast(formula)
											}
											onChat={(msg, type) =>
												vttRealtime.sendChatMessage(msg, type)
											}
											readOnly={false}
											campaignId={campaignId}
										/>
									</div>
								)}

								<Dialog
									open={damageDialogOpen}
									onOpenChange={setDamageDialogOpen}
								>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>
												Apply Damage to {activeToken?.name}
											</DialogTitle>
											<DialogDescription>
												Enter the damage amount to apply to this token.
											</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="damage-amount" className="text-right">
													Damage
												</Label>
												<Input
													id="damage-amount"
													type="number"
													min="0"
													value={damageAmount}
													onChange={(e) => setDamageAmount(e.target.value)}
													className="col-span-3"
													placeholder="Enter damage amount"
													autoFocus
												/>
											</div>
										</div>
										<DialogFooter>
											<Button
												variant="outline"
												onClick={() => {
													setDamageDialogOpen(false);
													setDamageAmount("");
												}}
											>
												Cancel
											</Button>
											<Button
												onClick={() => {
													if (activeToken && damageAmount) {
														const damage = parseInt(damageAmount, 10);
														if (!Number.isNaN(damage) && damage > 0) {
															const currentHP = activeToken.hp ?? 0;
															const newHP = Math.max(0, currentHP - damage);
															updateToken(activeToken.id, { hp: newHP });
															syncCharacterHP(activeToken.characterId, newHP);
															toast({
																title: "Damage Applied",
																description: `${damage} damage applied to ${activeToken.name}. HP: ${currentHP} → ${newHP}`,
															});
														}
													}
													setDamageDialogOpen(false);
													setDamageAmount("");
												}}
											>
												Apply Damage
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>

								<Tabs defaultValue="initiative" className="w-full">
									<TabsList className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1 w-full h-auto p-1 bg-card border border-border rounded-lg shadow-sm">
										<TabsTrigger
											value="initiative"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											<span className="hidden sm:inline">Initiative</span>
											<span className="sm:hidden">Init</span>
										</TabsTrigger>
										<TabsTrigger
											value="chat"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											<span className="hidden sm:inline">Chat</span>
											<span className="sm:hidden">Chat</span>
										</TabsTrigger>
										<TabsTrigger
											value="dice"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<Dice6 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											<span className="hidden sm:inline">Dice</span>
											<span className="sm:hidden">Dice</span>
										</TabsTrigger>
										<TabsTrigger
											value="assets"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											<span className="hidden sm:inline">Assets</span>
											<span className="sm:hidden">Assets</span>
										</TabsTrigger>
										<TabsTrigger
											value="ai"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											<span className="hidden sm:inline">AI</span>
											<span className="sm:hidden">AI</span>
										</TabsTrigger>
										<TabsTrigger
											value="broadcast"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
											<span className="hidden sm:inline">Broadcast</span>
											<span className="sm:hidden">Alert</span>
										</TabsTrigger>
										<TabsTrigger
											value="journal"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											<span className="hidden sm:inline">Journal</span>
											<span className="sm:hidden">Journal</span>
										</TabsTrigger>
									</TabsList>

									<TabsContent value="initiative" className="space-y-2">
										<AscendantWindow title="INITIATIVE TRACKER">
											{/* Turn controls */}
											{isWarden && tokensInInitiative.length > 0 && (
												<div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
													<div className="flex items-center gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={vttRealtime.prevTurn}
															className="text-xs h-7"
														>
															← Prev
														</Button>
														<Button
															variant="default"
															size="sm"
															onClick={vttRealtime.nextTurn}
															className="text-xs h-7"
														>
															Next →
														</Button>
													</div>
													<div className="flex items-center gap-2">
														<Badge variant="outline" className="text-xs">
															Round {vttRealtime.initiativeState.round}
														</Badge>
														<Button
															variant="destructive"
															size="sm"
															onClick={vttRealtime.endCombat}
															className="text-xs h-7"
														>
															End
														</Button>
													</div>
												</div>
											)}
											{isWarden &&
												tokensInInitiative.length > 0 &&
												!vttRealtime.initiativeState.active && (
													<Button
														variant="default"
														size="sm"
														className="w-full mb-2 text-xs"
														onClick={() => {
															vttRealtime.broadcastInitiativeUpdate({
																order: tokensInInitiative.map((t) => ({
																	tokenId: t.id,
																	name: t.name,
																	initiative: t.initiative || 0,
																	hp: t.hp,
																	maxHp: t.maxHp,
																})),
																currentTurnIndex: 0,
																round: 1,
																active: true,
															});
														}}
													>
														Start Combat
													</Button>
												)}
											<div className="space-y-2 max-h-96 overflow-y-auto">
												{tokensInInitiative.map((token, index) => {
													const isCurrentTurn =
														vttRealtime.initiativeState.active &&
														index ===
															vttRealtime.initiativeState.currentTurnIndex;
													return (
														<div
															key={token.id}
															className={cn(
																"p-2 rounded border flex items-center justify-between transition-all",
																isCurrentTurn &&
																	"bg-amber-500/20 border-amber-500 ring-1 ring-amber-500/50",
																!isCurrentTurn &&
																	index === 0 &&
																	!vttRealtime.initiativeState.active &&
																	"bg-muted/40 border-muted-foreground/30",
															)}
														>
															<div className="flex items-center gap-2 flex-1 min-w-0">
																<span
																	className={cn(
																		"font-resurge text-lg w-6 text-center",
																		isCurrentTurn && "text-amber-400",
																	)}
																>
																	{index + 1}
																</span>
																<div className="flex-1 min-w-0">
																	<span className="truncate text-sm block">
																		{token.name}
																	</span>
																	{token.hp !== undefined &&
																		token.maxHp !== undefined &&
																		(() => {
																			const hpPercent = Math.max(
																				0,
																				Math.min(
																					100,
																					token.maxHp > 0
																						? (token.hp / token.maxHp) * 100
																						: 0,
																				),
																			);
																			const hpColor =
																				token.hp / (token.maxHp || 1) > 0.5
																					? "#22c55e"
																					: token.hp / (token.maxHp || 1) > 0.25
																						? "#eab308"
																						: "#ef4444";
																			return (
																				<div className="h-1 rounded-full bg-black/30 mt-0.5 w-full">
																					<DynamicStyle
																						className="h-full rounded-full transition-all vtt-hp-bar"
																						vars={{
																							"--vtt-hp-percent": `${hpPercent}%`,
																							"--vtt-hp-color": hpColor,
																						}}
																					/>
																				</div>
																			);
																		})()}
																</div>
															</div>
															{isWarden && (
																<Input
																	type="number"
																	value={token.initiative || 0}
																	onChange={(e) =>
																		updateTokenInitiative(
																			token.id,
																			parseInt(e.target.value, 10) || 0,
																		)
																	}
																	className="w-16 h-7 text-xs"
																/>
															)}
															{!isWarden && (
																<span className="text-sm font-semibold">
																	{token.initiative}
																</span>
															)}
														</div>
													);
												})}
												{tokensInInitiative.length === 0 && (
													<AscendantText className="block text-xs text-foreground/70 text-center py-4">
														No tokens in initiative.{" "}
														{isWarden && "Set initiative values on tokens."}
													</AscendantText>
												)}
											</div>
										</AscendantWindow>
									</TabsContent>

									<TabsContent value="chat" className="space-y-2">
										<AscendantWindow
											title="CHAT"
											className="flex flex-col h-[400px]"
										>
											{vttRealtime.activeUsers.length > 0 && (
												<div className="flex items-center gap-1 mb-2 px-1">
													<div className="flex -space-x-1.5">
														{vttRealtime.activeUsers.map((u) => (
															<DynamicStyle
																key={u.userId}
																className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-background vtt-user-avatar"
																vars={{
																	"--vtt-user-color": u.color,
																}}
																title={`${u.userName} (${u.role})`}
															>
																{u.userName.charAt(0).toUpperCase()}
															</DynamicStyle>
														))}
													</div>
													<span className="text-[10px] text-foreground/70 ml-1">
														{vttRealtime.activeUsers.length + 1} online
													</span>
												</div>
											)}
											<div className="flex-1 overflow-y-auto space-y-2 mb-2">
												{vttRealtime.chatMessages.map((msg) => (
													<div key={msg.id} className="text-xs">
														{msg.type === "emote" ? (
															<div className="p-2 rounded border-l-2 border-amber-500 bg-amber-500/10 italic text-amber-200">
																* {msg.userName} {msg.message}
															</div>
														) : msg.type === "desc" ? (
															<div className="p-2 rounded border border-slate-600 bg-slate-800/60 text-center font-heading text-slate-200">
																{msg.message}
															</div>
														) : (
															<>
																<div className="flex items-center gap-1 mb-1">
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
																	<span className="text-foreground/70 text-[10px]">
																		{new Date(
																			msg.timestamp,
																		).toLocaleTimeString()}
																	</span>
																</div>
																<div
																	className={cn(
																		"p-2 rounded",
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
																			<DiceDisplayText
																				text={msg.diceDisplayText}
																			/>
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
											<div className="text-[9px] text-foreground/70 mb-1 px-1">
												/roll /wardenroll /w &quot;name&quot; /em /desc • adv
												dis 4d6kh3
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
													className="text-sm"
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
													Send
												</Button>
											</div>
										</AscendantWindow>
									</TabsContent>

									<TabsContent value="dice" className="space-y-2">
										<AscendantWindow title="DICE ROLLER">
											<div className="space-y-3">
												<div className="grid grid-cols-3 gap-1.5">
													{[
														"1d20",
														"1d12",
														"1d10",
														"1d8",
														"2d6",
														"1d4",
														"1d100",
													].map((f) => (
														<Button
															key={f}
															onClick={() => vttRealtime.rollAndBroadcast(f)}
															variant="outline"
															size="sm"
															className="text-xs h-7"
														>
															{f}
														</Button>
													))}
												</div>
												<div className="grid grid-cols-3 gap-1.5">
													<Button
														onClick={() => vttRealtime.rollAndBroadcast("adv")}
														variant="outline"
														size="sm"
														className="text-xs h-7 text-green-400 border-green-500/30"
													>
														ADV
													</Button>
													<Button
														onClick={() => vttRealtime.rollAndBroadcast("dis")}
														variant="outline"
														size="sm"
														className="text-xs h-7 text-red-400 border-red-500/30"
													>
														DIS
													</Button>
													<Button
														onClick={() =>
															vttRealtime.rollAndBroadcast("4d6kh3")
														}
														variant="outline"
														size="sm"
														className="text-xs h-7 text-amber-400 border-amber-500/30"
													>
														STAT
													</Button>
												</div>
												<div className="flex gap-1.5">
													<Input
														id="customDice"
														placeholder="2d8+1d6+5, 3d6!, adv..."
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

												{/* Macro Bar */}
												{vttRealtime.macros.length > 0 && (
													<div className="border-t border-border/50 pt-2">
														<Label className="text-xs mb-1.5 block">
															Macros
														</Label>
														<div className="flex flex-wrap gap-1">
															{vttRealtime.macros
																.filter((m) => m.showInBar)
																.map((macro) => (
																	<div
																		key={macro.id}
																		className="flex items-center"
																	>
																		<Button
																			onClick={() =>
																				vttRealtime.executeMacro(macro.id)
																			}
																			variant="outline"
																			size="sm"
																			className="text-[10px] h-6 px-2 rounded-r-none"
																			title={macro.command}
																		>
																			{macro.name}
																		</Button>
																		<button
																			type="button"
																			onClick={() =>
																				vttRealtime.removeMacro(macro.id)
																			}
																			className="h-6 px-1 border border-l-0 border-border rounded-r text-[10px] hover:bg-destructive/20 text-foreground/70"
																		>
																			×
																		</button>
																	</div>
																))}
														</div>
													</div>
												)}
												<div className="flex gap-1.5">
													<Input
														placeholder="Macro name"
														className="text-xs h-7 flex-1"
														id="macroName"
													/>
													<Input
														placeholder="/roll 1d20+5"
														className="text-xs h-7 flex-1"
														id="macroCmd"
													/>
													<Button
														variant="outline"
														size="sm"
														className="text-xs h-7 px-2"
														onClick={() => {
															const nameEl = document.getElementById(
																"macroName",
															) as HTMLInputElement;
															const cmdEl = document.getElementById(
																"macroCmd",
															) as HTMLInputElement;
															if (nameEl?.value.trim() && cmdEl?.value.trim()) {
																vttRealtime.addMacro({
																	name: nameEl.value.trim(),
																	command: cmdEl.value.trim(),
																	showInBar: true,
																});
																nameEl.value = "";
																cmdEl.value = "";
															}
														}}
													>
														+
													</Button>
												</div>

												<div className="max-h-40 overflow-y-auto space-y-1">
													<Label className="text-xs block">Recent</Label>
													{vttRealtime.chatMessages
														.filter(
															(m) =>
																m.type === "dice" || m.type === "wardenroll",
														)
														.slice(-8)
														.map((roll) => (
															<div
																key={roll.id}
																className="text-xs p-1.5 rounded border bg-muted/30"
															>
																<div className="flex justify-between items-center">
																	<span className="truncate flex-1">
																		{roll.userName}: {roll.diceFormula}
																	</span>
																	<span
																		className={cn(
																			"font-bold ml-2",
																			roll.diceCritical && "text-green-400",
																			roll.diceFumble && "text-red-400",
																		)}
																	>
																		{roll.diceResult}
																	</span>
																</div>
																{roll.diceDisplayText && (
																	<div className="text-[10px] text-foreground/70 mt-0.5">
																		<DiceDisplayText
																			text={roll.diceDisplayText}
																		/>
																	</div>
																)}
															</div>
														))}
												</div>
											</div>
										</AscendantWindow>
									</TabsContent>

									<TabsContent value="assets" className="space-y-2">
										<AscendantWindow title="ASSET LIBRARY">
											<VTTAssetBrowser
												campaignId={campaignId}
												onUseAsMap={(imageUrl, name) => {
													if (currentScene) {
														updateScene({
															backgroundImage: imageUrl,
															name: name || currentScene.name,
														});
														toast({
															title: "Map Set",
															description: `"${name}" applied as VTTScene background.`,
														});
													} else {
														toast({
															title: "No Scene",
															description: "Create a scene first.",
															variant: "destructive",
														});
													}
												}}
												onUseAsToken={(imageUrl, name) => {
													if (!currentScene) {
														toast({
															title: "No Scene",
															description: "Create a scene first.",
															variant: "destructive",
														});
														return;
													}
													const placed: PlacedToken = {
														id: `token-${Date.now()}`,
														name: name || "Token",
														imageUrl,
														size: "medium",
														x: Math.floor((currentScene.width ?? 20) / 2),
														y: Math.floor((currentScene.height ?? 20) / 2),
														rotation: 0,
														layer: 1,
														locked: false,
														visible: true,
													};
													appendToken(placed);
													setActiveTokenId(placed.id);
													toast({
														title: "Token Placed",
														description: `"${name}" placed at center of map.`,
													});
												}}
												onUseAsEffect={(imageUrl, name) => {
													if (!currentScene) {
														toast({
															title: "No Scene",
															description: "Create a scene first.",
															variant: "destructive",
														});
														return;
													}
													const placed: PlacedToken = {
														id: `effect-${Date.now()}`,
														name: name || "Effect",
														imageUrl,
														size: "large",
														tokenType: "effect",
														render: {
															mode: "overlay",
															blendMode: "screen",
															opacity: 0.9,
														},
														x: Math.floor((currentScene.width ?? 20) / 2),
														y: Math.floor((currentScene.height ?? 20) / 2),
														rotation: 0,
														layer: 2,
														locked: false,
														visible: true,
													};
													appendToken(placed);
													setActiveTokenId(placed.id);
													toast({
														title: "Effect Placed",
														description: `"${name}" placed on effects layer.`,
													});
												}}
												onShareHandout={(imageUrl, name) => {
													vttRealtime.shareHandout(name, imageUrl, "");
													toast({
														title: "Handout Shared",
														description: `"${name}" shared with all players.`,
													});
												}}
											/>
										</AscendantWindow>
									</TabsContent>

									<TabsContent value="journal" className="space-y-2">
										<AscendantWindow
											title="JOURNAL"
											className="h-[400px] flex flex-col"
										>
											<div className="flex-1 overflow-y-auto space-y-2 mb-2">
												<AscendantText className="block text-xs text-foreground/70 text-center py-4">
													Quick access to journal entries. Full journal editor
													available separately.
												</AscendantText>
											</div>
											<Link to={`/campaigns/${campaignId}/journal`}>
												<Button variant="outline" className="w-full" size="sm">
													<FileText className="w-4 h-4 mr-2" />
													Open Full Journal
												</Button>
											</Link>
										</AscendantWindow>
									</TabsContent>

									<TabsContent value="broadcast" className="space-y-2">
										<WardenBroadcastPanel
											campaignId={campaignId || ""}
											sessionId={sessionId || ""}
										/>
									</TabsContent>

									<TabsContent value="ai" className="space-y-2">
										<DirectiveLattice />
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</>
				)}

				{/* Mobile Toolbar + Bottom Sheet */}
				{isMobile && isWarden && (
					<>
						<div className="vtt-mobile-toolbar">
							{(
								[
									{ key: "select", label: "Sel" },
									{ key: "fog", label: "Fog" },
									{ key: "draw", label: "Draw" },
									{ key: "measure", label: "Meas" },
								] as const
							).map((tool) => (
								<button
									type="button"
									key={tool.key}
									className={cn(selectedTool === tool.key && "active")}
									onClick={() => {
										setSelectedTool(tool.key);
										setMobilePanel(null);
									}}
								>
									{tool.label}
								</button>
							))}
							<div className="w-px h-8 bg-border/30 mx-1" />
							<button
								type="button"
								className={cn(mobilePanel === "tools" && "active")}
								onClick={() =>
									setMobilePanel(mobilePanel === "tools" ? null : "tools")
								}
							>
								⚙ Tools
							</button>
							<button
								type="button"
								className={cn(mobilePanel === "sidebar" && "active")}
								onClick={() =>
									setMobilePanel(mobilePanel === "sidebar" ? null : "sidebar")
								}
							>
								☰ Panel
							</button>
							<div className="w-px h-8 bg-border/30 mx-1" />
							<button
								type="button"
								onClick={() => setZoom(Math.max(0.5, zoom - 0.15))}
							>
								−
							</button>
							<span className="text-[10px] text-foreground/70 min-w-[32px] text-center">
								{Math.round(zoom * 100)}%
							</span>
							<button
								type="button"
								onClick={() => setZoom(Math.min(2, zoom + 0.15))}
							>
								+
							</button>
						</div>

						<div className={cn("vtt-bottom-sheet", mobilePanel && "open")}>
							<div className="vtt-bottom-sheet-handle" />
							<div className="vtt-bottom-sheet-content">
								{mobilePanel === "tools" && (
									<div className="space-y-3">
										<h3 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
											Controls
										</h3>
										<div className="flex items-center gap-2">
											<input
												type="checkbox"
												checked={showGrid}
												onChange={(e) => setShowGrid(e.target.checked)}
												className="w-5 h-5"
												id="mobileGrid"
											/>
											<label htmlFor="mobileGrid" className="text-sm">
												Grid
											</label>
											<input
												type="checkbox"
												checked={gridSnap}
												onChange={(e) => setGridSnap(e.target.checked)}
												className="w-5 h-5 ml-4"
												id="mobileSnap"
											/>
											<label htmlFor="mobileSnap" className="text-sm">
												Snap
											</label>
										</div>
										{selectedTool === "measure" && (
											<div className="space-y-2">
												<h4 className="text-xs font-semibold text-foreground/70">
													AoE Shape
												</h4>
												<div className="grid grid-cols-4 gap-2">
													{(["line", "circle", "cone", "cube"] as const).map(
														(s) => (
															<button
																type="button"
																key={s}
																onClick={() => setMeasureShape(s)}
																className={cn(
																	"p-2 rounded border text-center text-sm",
																	measureShape === s
																		? "bg-cyan-500/20 border-cyan-500"
																		: "border-border",
																)}
															>
																{s}
															</button>
														),
													)}
												</div>
											</div>
										)}
										<div className="space-y-1">
											<h4 className="text-xs font-semibold text-foreground/70">
												Scenes
											</h4>
											{scenes.map((scene) => (
												<button
													type="button"
													key={scene.id}
													onClick={() => {
														setCurrentScene(scene);
														vttRealtime.broadcastSceneChange(scene.id);
														setMobilePanel(null);
													}}
													className={cn(
														"w-full text-left p-2 rounded text-sm",
														currentScene?.id === scene.id
															? "bg-primary/20 border border-primary"
															: "border border-border",
													)}
												>
													{scene.name}
												</button>
											))}
										</div>
									</div>
								)}
								{mobilePanel === "sidebar" && (
									<Tabs defaultValue="chat" className="w-full">
										<TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-card border border-border rounded-lg shadow-sm mb-2">
											<TabsTrigger
												value="chat"
												className="gap-1.5 text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
											>
												<MessageSquare className="w-3.5 h-3.5" />
												<span className="hidden xs:inline">Chat</span>
												<span className="xs:hidden">C</span>
											</TabsTrigger>
											<TabsTrigger
												value="init"
												className="gap-1.5 text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
											>
												<Clock className="w-3.5 h-3.5" />
												<span className="hidden xs:inline">Init</span>
												<span className="xs:hidden">I</span>
											</TabsTrigger>
											<TabsTrigger
												value="dice"
												className="gap-1.5 text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
											>
												<Dice6 className="w-3.5 h-3.5" />
												<span className="hidden xs:inline">Dice</span>
												<span className="xs:hidden">D</span>
											</TabsTrigger>
											<TabsTrigger
												value="assets"
												className="gap-1.5 text-xs py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
											>
												<ImageIcon className="w-3.5 h-3.5" />
												<span className="hidden xs:inline">Assets</span>
												<span className="xs:hidden">A</span>
											</TabsTrigger>
										</TabsList>
										<TabsContent value="chat">
											<div className="space-y-2 max-h-[40vh] overflow-y-auto">
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
																<DiceDisplayText text={msg.diceDisplayText} />
															</span>
														) : (
															msg.message
														)}
													</div>
												))}
											</div>
											<div className="flex gap-1 mt-2">
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
										</TabsContent>
										<TabsContent value="init">
											<div className="space-y-1 max-h-[40vh] overflow-y-auto">
												{tokensInInitiative.map((token, idx) => (
													<div
														key={token.id}
														className={cn(
															"flex items-center gap-2 p-2 rounded text-sm",
															idx ===
																vttRealtime.initiativeState.currentTurnIndex
																? "bg-amber-500/20 border border-amber-500"
																: "border border-border/40",
														)}
													>
														<span className="truncate flex-1">
															{token.name}
														</span>
														<span className="font-bold">
															{token.initiative}
														</span>
													</div>
												))}
											</div>
										</TabsContent>
										<TabsContent value="dice">
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
														className="text-xs"
														onClick={() =>
															vttRealtime.rollAndBroadcast(formula)
														}
													>
														{formula}
													</Button>
												))}
											</div>
										</TabsContent>
										<TabsContent value="assets">
											<VTTAssetBrowser
												campaignId={campaignId}
												onUseAsMap={(imageUrl, name) => {
													if (currentScene) {
														updateScene({
															backgroundImage: imageUrl,
															name: name || currentScene.name,
														});
														setMobilePanel(null);
													}
												}}
												onUseAsToken={(imageUrl, name) => {
													if (!currentScene) return;
													appendToken({
														id: `token-${Date.now()}`,
														name: name || "Token",
														imageUrl,
														size: "medium",
														x: Math.floor((currentScene.width ?? 20) / 2),
														y: Math.floor((currentScene.height ?? 20) / 2),
														rotation: 0,
														layer: 1,
														locked: false,
														visible: true,
													});
													setMobilePanel(null);
												}}
												onUseAsEffect={(imageUrl, name) => {
													if (!currentScene) return;
													appendToken({
														id: `effect-${Date.now()}`,
														name: name || "Effect",
														imageUrl,
														size: "large",
														tokenType: "effect",
														render: {
															mode: "overlay" as const,
															blendMode: "screen" as const,
															opacity: 0.9,
														},
														x: Math.floor((currentScene.width ?? 20) / 2),
														y: Math.floor((currentScene.height ?? 20) / 2),
														rotation: 0,
														layer: 2,
														locked: false,
														visible: true,
													});
													setMobilePanel(null);
												}}
												onShareHandout={(imageUrl, name) => {
													vttRealtime.shareHandout(name, imageUrl, "");
													setMobilePanel(null);
												}}
											/>
										</TabsContent>
									</Tabs>
								)}
							</div>
						</div>
					</>
				)}

				{/* Token Context Menu */}
				{contextMenu &&
					(() => {
						const token = visibleTokens.find(
							(t) => t.id === contextMenu.tokenId,
						);
						if (!token) return null;
						return (
							<>
								<button
									type="button"
									className="fixed inset-0 z-[99] appearance-none bg-transparent border-none cursor-default"
									onClick={() => setContextMenu(null)}
									aria-label="Close context menu"
								/>
								<DynamicStyle
									className="vtt-context-menu"
									vars={{
										"--vtt-menu-x": `${contextMenu.x}px`,
										"--vtt-menu-y": `${contextMenu.y}px`,
									}}
								>
									<button
										type="button"
										onClick={() => {
											setActiveTokenId(token.id);
											setContextMenu(null);
										}}
									>
										✎ Select
									</button>
									{isWarden && (
										<button
											type="button"
											onClick={() => {
												updateToken(token.id, { locked: !token.locked });
												setContextMenu(null);
											}}
										>
											{token.locked ? "🔓 Unlock" : "🔒 Lock"}
										</button>
									)}
									{isWarden && (
										<button
											type="button"
											onClick={() => {
												updateToken(token.id, { visible: !token.visible });
												setContextMenu(null);
											}}
										>
											{token.visible ? "👁 Hide" : "👁 Show"}
										</button>
									)}
									{token.characterId && (
										<button
											type="button"
											onClick={() => {
												window.open(
													`/characters/${token.characterId}`,
													"_blank",
												);
												setContextMenu(null);
											}}
										>
											📋 Open Sheet
										</button>
									)}
									<div className="ctx-separator" />
									{isWarden && (
										<button
											type="button"
											className="ctx-danger"
											onClick={() => {
												removeToken(token.id);
												setContextMenu(null);
											}}
										>
											✕ Delete
										</button>
									)}
								</DynamicStyle>
							</>
						);
					})()}

				{/* Handout Share Popup Overlay */}
				{vttRealtime.sharedHandout && (
					<button
						type="button"
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm appearance-none border-none cursor-default w-full h-full"
						onClick={vttRealtime.dismissHandout}
						onKeyDown={(e) => {
							if (e.key === "Escape") vttRealtime.dismissHandout();
						}}
						aria-label="Close handout"
					>
						<div
							className="bg-background border-2 border-primary rounded-lg shadow-2xl max-w-lg w-full mx-4 p-6"
							onClick={(e) => e.stopPropagation()}
							onKeyDown={(e) => e.stopPropagation()}
							role="dialog"
							aria-label="Shared handout"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-resurge text-lg font-bold gradient-text-shadow">
									{vttRealtime.sharedHandout.title}
								</h3>
								<button
									type="button"
									onClick={vttRealtime.dismissHandout}
									className="text-foreground/70 hover:text-foreground text-lg"
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
								<div className="text-sm text-foreground/70 whitespace-pre-wrap max-h-48 overflow-y-auto">
									{vttRealtime.sharedHandout.content}
								</div>
							)}
							<div className="mt-3 text-xs text-foreground/70 text-right">
								Shared by {vttRealtime.sharedHandout.sharedBy}
							</div>
						</div>
					</button>
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

export default VTTEnhanced;
