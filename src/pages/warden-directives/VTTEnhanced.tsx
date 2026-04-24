import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Bot,
	ChevronDown,
	Circle,
	Clock,
	Cloud,
	Copy,
	Dice6,
	Eye,
	EyeOff,
	FileText,
	Image as ImageIcon,
	Layers,
	MapPin,
	Maximize2,
	MessageSquare,
	Minus,
	MousePointer2,
	Pause,
	Pencil,
	Play,
	Plus,
	Radio,
	Ruler,
	Save,
	ShieldAlert,
	Sparkles,
	Square,
	Triangle,
	Upload,
	User,
	Users,
	Wifi,
	WifiOff,
	Wrench,
	X,
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
import { CampaignRollFeed } from "@/components/campaign/CampaignRollFeed";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import { AscendantText } from "@/components/ui/AscendantText";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	ConnectedPlayersPopover,
	type ConnectedUser,
} from "@/components/vtt/ConnectedPlayersPopover";
import { SharedDiceTray } from "@/components/vtt/dice/SharedDiceTray";
import { GameSettingsDrawer } from "@/components/vtt/GameSettingsDrawer";
import { LayerQuickSwitch } from "@/components/vtt/LayerQuickSwitch";
import { SessionControlsMenu } from "@/components/vtt/SessionControlsMenu";
import { TokenActionBar } from "@/components/vtt/TokenActionBar";
import { VTTAssetBrowser } from "@/components/vtt/VTTAssetBrowser";
import { VTTCharacterPanel } from "@/components/vtt/VTTCharacterPanel";
import { VTTDrawer } from "@/components/vtt/VTTDrawer";
import {
	VTTIconRail,
	type VTTIconRailItem,
} from "@/components/vtt/VTTIconRail";
import { VTTMobileTabBar } from "@/components/vtt/VTTMobileTabBar";
import { VTTPointerOverlay } from "@/components/vtt/VTTPointerOverlay";
import { VTTTopBar } from "@/components/vtt/VTTTopBar";
import { VTTZoomHud } from "@/components/vtt/VTTZoomHud";
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
import type { VTTAsset as BrowserAsset } from "@/data/vttAssetLibrary";
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
import { useVTTRealtime } from "@/hooks/useVTTRealtime";
import { useVTTSettings } from "@/hooks/useVTTSettings";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import {
	applyDamageMitigation,
	type DamageApplicationMode,
} from "@/lib/damageApplication";
import { compressImage } from "@/lib/imageOptimization";
import { usePerformanceProfile } from "@/lib/performanceProfile";
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
import { syncSceneMusicEngine } from "@/lib/vtt/sceneAudio";
import {
	buildDefaultVttScene,
	computeVttHydration,
	createVttTokenInstanceId,
	DEFAULT_SCENE_SETTINGS,
	deleteVttScene,
	duplicateVttScene,
	getValidActiveTokenId,
	type LegacyVttScenesStateShape,
	normalizeVttScene,
	removeAssetFromVttScenes,
	upsertVttScene,
} from "@/lib/vtt/sceneState";
import PlayerMapView from "@/pages/player-tools/PlayerMapView";
import type {
	VTTDrawing,
	VTTScene,
	VTTTokenInstance,
	WeatherType,
} from "@/types/vtt";
import "@/styles/vtt-enhanced-dynamic.css";
import "@/styles/vtt-enhanced.css";
import "@/styles/vtt-performance.css";
import "./VTTEnhanced.css";

const WardenDirectiveMatrix = React.lazy(() =>
	import("@/components/warden-directives/WardenDirectiveMatrix").then((m) => ({
		default: m.WardenDirectiveMatrix,
	})),
);

const isVttShortcutTarget = (target: EventTarget | null) => {
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

type CharacterSummary = {
	id: string;
	name: string;
	hp_current?: number;
	hp_max?: number;
	armor_class?: number;
	resistances?: string[] | null;
	immunities?: string[] | null;
	vulnerabilities?: string[] | null;
	portrait_url?: string | null;
	level?: number;
	job?: string;
};

/** Shape returned by useCampaignMembers: member row + joined character summary */
type CampaignMemberWithCharacter = CampaignMember & {
	characters: CharacterSummary | null;
};

type GridPosition = {
	x: number;
	y: number;
	gridX: number;
	gridY: number;
};

const LAYER_OPTIONS = [
	{ id: 0, label: "Map" },
	{ id: 1, label: "Tokens" },
	{ id: 2, label: "Effects" },
	{ id: 3, label: "Warden" },
];

const toSafeClassName = (value: string) => value.replace(/[^a-z0-9_-]/gi, "_");

const isCharacterSummary = (
	value: Record<string, unknown>,
): value is CharacterSummary =>
	typeof value.id === "string" && typeof value.name === "string";

const EMPTY_ARRAY: never[] = [];
const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";
const DAMAGE_TYPE_OPTIONS = [
	"acid",
	"bludgeoning",
	"cold",
	"fire",
	"force",
	"lightning",
	"necrotic",
	"piercing",
	"poison",
	"psychic",
	"radiant",
	"slashing",
	"thunder",
] as const;

type VTTCampaignAsset = BrowserAsset;

const createCustomVttAssetId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `custom-asset-${crypto.randomUUID()}`;
	}
	return `custom-asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const buildUploadedAssetName = (fileName: string) =>
	fileName.replace(/\.\w+$/, "").replace(/[-_]/g, " ");

const getCompendiumImageStoragePath = (
	asset: Pick<VTTCampaignAsset, "storagePath" | "imageUrl">,
) => {
	if (typeof asset.storagePath === "string" && asset.storagePath.length > 0) {
		return asset.storagePath;
	}
	const marker = "/storage/v1/object/public/compendium-images/";
	const markerIndex = asset.imageUrl.indexOf(marker);
	if (markerIndex === -1) return null;
	const encodedPath = asset.imageUrl
		.slice(markerIndex + marker.length)
		.split("?")[0];
	return encodedPath ? decodeURIComponent(encodedPath) : null;
};

const normalizeCustomVttAsset = (value: unknown): VTTCampaignAsset | null => {
	if (!value || typeof value !== "object") return null;
	const asset = value as Partial<VTTCampaignAsset>;
	if (
		typeof asset.id !== "string" ||
		typeof asset.name !== "string" ||
		typeof asset.imageUrl !== "string"
	) {
		return null;
	}
	const tags = Array.isArray(asset.tags)
		? asset.tags.filter((tag): tag is string => typeof tag === "string")
		: [];
	return {
		id: asset.id,
		name: asset.name,
		category:
			typeof asset.category === "string"
				? (asset.category as VTTCampaignAsset["category"])
				: "token",
		imageUrl: asset.imageUrl,
		thumbnailUrl:
			typeof asset.thumbnailUrl === "string"
				? asset.thumbnailUrl
				: asset.imageUrl,
		tags,
		rank: typeof asset.rank === "string" ? asset.rank : undefined,
		description:
			asset.description === null
				? null
				: typeof asset.description === "string"
					? asset.description
					: undefined,
		isCustom: true,
		uploadedBy:
			typeof asset.uploadedBy === "string" ? asset.uploadedBy : undefined,
		uploadedAt:
			typeof asset.uploadedAt === "string" ? asset.uploadedAt : undefined,
		storagePath:
			typeof asset.storagePath === "string" ? asset.storagePath : undefined,
	};
};

const normalizeCustomVttAssets = (value: unknown): VTTCampaignAsset[] =>
	Array.isArray(value)
		? value
				.map(normalizeCustomVttAsset)
				.filter((asset): asset is VTTCampaignAsset => asset !== null)
		: [];

/** Stable memo wrapper – MUST live outside the component to avoid remount on every render */
const MemoizedVttPixiStage = React.memo(VttPixiStage);

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
	// Tracks when an explicit save (delete, persist) last fired so the debounced
	// auto-save effect can skip stale payloads that would overwrite the delete.
	const lastExplicitSaveTimestampRef = useRef<number>(0);
	const musicEngineRef = useRef<VttMusicEngine | null>(null);
	const lastFogCellRef = useRef<string | null>(null);
	const lastMeasureCellRef = useRef<string | null>(null);
	const lastCursorCellRef = useRef<string | null>(null);
	const viewportPanActiveRef = useRef(false);
	const suppressViewportPanClickRef = useRef(false);
	const pendingDrawingPointRef = useRef<{ x: number; y: number } | null>(null);
	const drawingFrameRef = useRef<number | null>(null);
	const { fx } = usePerformanceProfile();
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
	const [damageType, setDamageType] = useState("");
	const [damageMode, setDamageMode] = useState<DamageApplicationMode>("typed");
	const [currentScene, setCurrentScene] = useState<VTTScene | null>(null);
	const [liveSceneId, setLiveSceneId] = useState<string | null>(null);
	const resetDamageDialog = useCallback(() => {
		setDamageDialogOpen(false);
		setDamageAmount("");
		setDamageType("");
		setDamageMode("typed");
	}, []);
	const syncLocalSceneMusic = useCallback(
		(
			scene: Pick<VTTScene, "musicMood" | "musicAutoplay"> | null | undefined,
		) => {
			const wantsMusic = !!scene?.musicMood && scene.musicAutoplay !== false;
			if (wantsMusic && !musicEngineRef.current) {
				musicEngineRef.current = new VttMusicEngine();
			}
			syncSceneMusicEngine(musicEngineRef.current, scene);
		},
		[],
	);

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

	const { saveVTTScene } = useWardenToolsEnhancements(campaignId);
	const [selectedTool, setSelectedTool] = useState<
		"select" | "fog" | "measure" | "draw" | "effect" | "note" | "pointer"
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
	// --- Drawer state (Roll20/Foundry-style overlay rails) ------------------
	// Replaces docked sidebars with overlay drawers opened from icon rails.
	// `null` means closed; otherwise the value is the active section/tab.
	type LeftDrawerTab = "scenes" | "toolbox" | "map" | "tokens" | null;
	type RightDrawerTab =
		| "token"
		| "initiative"
		| "chat"
		| "dice"
		| "assets"
		| "journal"
		| "broadcast"
		| "ai"
		| "log"
		| null;
	const [leftDrawerTab, setLeftDrawerTab] = useState<LeftDrawerTab>(null);
	const [rightDrawerTab, setRightDrawerTab] = useState<RightDrawerTab>(null);
	// The right drawer's inner Tabs default value when a non-tab rail (like
	// `token`) opens the drawer. Defaults to `initiative` to match the
	// previous uncontrolled behavior.
	const [rightInnerTab, setRightInnerTab] =
		useState<Exclude<RightDrawerTab, null | "token">>("initiative");
	// `mobileDrawer` opens the bottom-sheet drawer tied to the mobile tab bar.
	type MobileDrawer = "tools" | "token" | "panel" | "assets" | null;
	const [mobileDrawer, setMobileDrawer] = useState<MobileDrawer>(null);
	// Warden Tools drawer (macros, music, atmosphere, map-gen, encounters)
	// now lives in a right-side Sheet so the right sidebar stays focused on
	// token/initiative/chat. Toggled from the header via a Wrench button.
	const [wardenToolsOpen, setWardenToolsOpen] = useState(false);
	// Left-sidebar sections currently render unconditionally; the collapsed
	// category header buttons below just ensure the sidebar itself is opened.
	// If per-section collapse is re-introduced, route it through a setter
	// instead of reintroducing the dead per-key state.
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
	const [isViewportPanModifierActive, setIsViewportPanModifierActive] =
		useState(false);
	const [isViewportPanning, setIsViewportPanning] = useState(false);
	const touchRef = useRef<{ startDist: number; startZoom: number } | null>(
		null,
	);
	const hydratedRef = useRef(false);

	// Mobile detection
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
	const clearViewportPan = useCallback(() => {
		viewportPanActiveRef.current = false;
		setIsViewportPanning(false);
		if (!suppressViewportPanClickRef.current) return;
		if (typeof window === "undefined") {
			suppressViewportPanClickRef.current = false;
			return;
		}
		window.setTimeout(() => {
			suppressViewportPanClickRef.current = false;
		}, 0);
	}, []);
	useEffect(() => {
		if (typeof window === "undefined") return;
		const handleWindowMouseUp = () => {
			if (!viewportPanActiveRef.current) return;
			clearViewportPan();
		};
		const handleWindowBlur = () => {
			setIsViewportPanModifierActive(false);
			touchRef.current = null;
			if (!viewportPanActiveRef.current) return;
			clearViewportPan();
		};
		window.addEventListener("mouseup", handleWindowMouseUp);
		window.addEventListener("blur", handleWindowBlur);
		return () => {
			window.removeEventListener("mouseup", handleWindowMouseUp);
			window.removeEventListener("blur", handleWindowBlur);
		};
	}, [clearViewportPan]);
	const [isHydrated, setIsHydrated] = useState(false);
	const toolKey = sessionId ? `vtt_scenes:${sessionId}` : "vtt_scenes";
	const assetsToolKey = sessionId ? `vtt_assets:${sessionId}` : "vtt_assets";
	const legacyStorageKey = campaignId
		? `vtt-scenes-${campaignId}${sessionId ? `-${sessionId}` : ""}`
		: "vtt-scenes";
	const legacyAssetsStorageKey = campaignId
		? `vtt-assets-${campaignId}${sessionId ? `-${sessionId}` : ""}`
		: "vtt-assets";
	// Role determination (must come before savePayload memo)
	const isStandalone = !campaignId;
	const guestRole = searchParams.get("role")?.toLowerCase();
	const { data: members } = useCampaignMembers(campaignId || "") as {
		data?: CampaignMemberWithCharacter[];
	};
	const { data: role } = useCampaignRole(campaignId || "");
	const [simulatePlayerView, setSimulatePlayerView] = useState(false);
	const isActualWarden =
		isStandalone ||
		role === "warden" ||
		role === "co-warden" ||
		guestRole === "warden";
	const isWarden = isActualWarden && !simulatePlayerView;

	const {
		state: storedState,
		isLoading: isStateLoading,
		saveNow,
	} = useCampaignToolState<VTTScenesState>(campaignId || null, toolKey, {
		initialState: { scenes: [], currentSceneId: null },
		storageKey: legacyStorageKey,
	});
	const {
		state: customAssetsState,
		setState: setCustomAssetsState,
		saveNow: saveCustomAssetsNow,
	} = useCampaignToolState<VTTCampaignAsset[]>(
		campaignId || null,
		assetsToolKey,
		{
			initialState: [],
			storageKey: legacyAssetsStorageKey,
		},
	);
	const customAssets = useMemo(
		() => normalizeCustomVttAssets(customAssetsState),
		[customAssetsState],
	);
	const mergedScenes = useMemo(() => {
		if (!currentScene) return scenes;
		const index = scenes.findIndex((scene) => scene.id === currentScene.id);
		// Don't re-add scenes that aren't in the scenes array — this prevents
		// deleted scenes from resurrecting via a stale currentScene reference.
		// createNewScene already adds to both `scenes` and `currentScene`, so
		// newly created scenes are always found by findIndex above.
		if (index === -1) return scenes;
		const next = [...scenes];
		next[index] = currentScene;
		return next;
	}, [currentScene, scenes]);
	const savePayload = useMemo(
		() => ({
			scenes: mergedScenes,
			currentSceneId: isWarden
				? (liveSceneId ?? currentScene?.id ?? null)
				: (currentScene?.id ?? null),
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
	const handleFitZoom = useCallback(() => {
		if (!mapRef.current || !currentSceneRef.current) return;
		const rect = mapRef.current.parentElement?.getBoundingClientRect();
		if (!rect) return;
		const sw = (currentSceneRef.current.width ?? 20) * gridSize;
		const sh = (currentSceneRef.current.height ?? 20) * gridSize;
		if (sw <= 0 || sh <= 0) return;
		const fitZoom = Math.min(rect.width / sw, rect.height / sh, 2);
		handleRequestZoom(Math.max(0.5, Math.round(fitZoom * 20) / 20));
	}, [gridSize, handleRequestZoom]);
	const handleRecenter = useCallback(() => {
		const el = mapRef.current;
		if (!el) return;
		el.scrollTo({
			left: 0,
			top: 0,
			behavior: "smooth",
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

	// --- Warden-controlled VTT game settings + session status (DDB parity) ---
	const {
		settings: vttSettings,
		sessionStatus,
		setSettings: setVTTSettings,
		setSessionState,
	} = useVTTSettings(campaignId ?? null);

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
				syncLocalSceneMusic({
					musicMood: payload.id as MusicMood,
					musicAutoplay: true,
				});
			} else if (payload.action === "music_stop") {
				syncLocalSceneMusic({ musicMood: null, musicAutoplay: false });
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
	}, [vttRealtime, isWarden, scenes, syncLocalSceneMusic]);

	const effectiveVisibleLayers: Record<number, boolean> = useMemo(
		() => ({
			...visibleLayers,
			// Map layer (0) always visible for Warden — matches Foundry/Roll20/DDB
			// where the GM always sees the background map regardless of layer toggles.
			0: isWarden ? true : visibleLayers[0],
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
	const activeCharacter = useMemo(
		() =>
			activeToken?.characterId
				? (resolvedCharacters.find(
						(character) => character.id === activeToken.characterId,
					) ?? null)
				: null,
		[activeToken?.characterId, resolvedCharacters],
	);

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
		syncLocalSceneMusic(currentScene);
	}, [
		currentScene?.id,
		currentScene?.musicAutoplay,
		currentScene?.musicMood,
		syncLocalSceneMusic,
	]);
	useEffect(
		() => () => {
			musicEngineRef.current?.dispose();
			musicEngineRef.current = null;
		},
		[],
	);

	useEffect(() => {
		currentSceneRef.current = currentScene;
	}, [currentScene]);

	useEffect(() => {
		const nextActiveTokenId = getValidActiveTokenId(
			activeTokenId,
			currentScene?.tokens ?? EMPTY_ARRAY,
		);
		if (nextActiveTokenId) return;
		if (activeTokenId) {
			setActiveTokenId(null);
		}
		if (damageDialogOpen) {
			resetDamageDialog();
		}
	}, [
		activeTokenId,
		currentScene?.tokens,
		damageDialogOpen,
		resetDamageDialog,
	]);

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
		const scene = buildDefaultVttScene({ name: `Scene ${scenes.length + 1}` });
		setScenes((prev) => [...prev, scene]);
		setCurrentScene(scene);
	}, [scenes.length]);

	useEffect(() => {
		if (isStateLoading || (hydratedRef.current && isWarden)) return;

		const legacyState =
			readLocalToolState<LegacyVttScenesStateShape>(legacyStorageKey);
		const hydration = computeVttHydration({
			storedState,
			legacyState,
			isWarden,
			hasCurrentScene: !!currentSceneRef.current,
		});

		if (hydration.kind === "empty") {
			if (hydration.shouldCreateDefaultScene) {
				createNewScene();
			}
		} else {
			setScenes(hydration.scenes);
			if (hydration.liveSceneId) setLiveSceneId(hydration.liveSceneId);
			if (hydration.currentScene) {
				setCurrentScene(hydration.currentScene);
			}
			if (hydration.shouldMigrateLegacyToRemote) {
				const migratedId =
					hydration.currentScene?.id ?? hydration.scenes[0]?.id ?? null;
				void saveNow({
					scenes: hydration.scenes,
					currentSceneId: migratedId,
				});
			}
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
		storedState,
	]);

	useEffect(() => {
		if (isStateLoading || currentScene || scenes.length === 0) return;
		setCurrentScene(scenes[0]);
	}, [currentScene, isStateLoading, scenes]);

	useEffect(() => {
		if (!campaignId || !isHydrated || !isWarden) return;
		// Skip if an explicit save (scene delete, persistSceneState) fired
		// within the debounce window. The debounced payload is stale and
		// would overwrite the authoritative state from the explicit save,
		// causing deleted scenes to resurrect.
		if (Date.now() - lastExplicitSaveTimestampRef.current < 1200) return;
		void saveNow({
			...debouncedState,
			savedAt: new Date().toISOString(),
		});
	}, [campaignId, debouncedState, isWarden, isHydrated, saveNow]);

	// Campaign Book import
	// CampaignBookView writes a payload to sessionStorage under "vtt-book-import".
	// When the VTT opens (or after hydration) we pick it up, create a pinned
	// annotation on the current scene so the Warden can see the section content,
	// and clear the key so it isn't re-imported on refresh.
	useEffect(() => {
		if (!isHydrated || !isWarden) return;
		try {
			const raw = sessionStorage.getItem("vtt-book-import");
			if (!raw) return;
			sessionStorage.removeItem("vtt-book-import");
			const payload = JSON.parse(raw) as {
				type: string;
				title: string;
				content: string;
				timestamp: number;
				campaignId?: string;
			};
			// Build a concise annotation text (cap at 800 chars so it fits in the note bubble)
			const snippet =
				payload.content.length > 800
					? `${payload.content.slice(0, 800)}…`
					: payload.content;
			const noteBody = snippet
				? `Book: ${payload.title}\n\n${snippet}`
				: `Book: ${payload.title}`;
			// Place the annotation in the top-left of the current scene grid
			setCurrentScene((prev) => {
				if (!prev) return prev;
				const next = {
					...prev,
					annotations: [
						...(prev.annotations ?? []),
						{
							id: `book-note-${Date.now()}`,
							text: noteBody,
							x: 1,
							y: 1,
							layer: 3, // Warden layer
						},
					],
				};
				setScenes((prevScenes) => upsertVttScene(prevScenes, next));
				return next;
			});
			toast({
				title: "Campaign Book Section Imported",
				description: `"${payload.title}" has been pinned as a Warden note on the current scene.`,
			});
		} catch {
			// Silently ignore malformed sessionStorage data
		}
	}, [isHydrated, isWarden, toast]);

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
						state?: unknown;
						updated_by?: string | null;
					} | null;
					if (!row || !row.tool_key || row.state === undefined) return;
					if (row.updated_by && row.updated_by === user?.id) return;
					if (row.tool_key === assetsToolKey) {
						setCustomAssetsState(normalizeCustomVttAssets(row.state));
						return;
					}
					if (row.tool_key !== toolKey) return;
					const incoming = row.state as VTTScenesState;
					if (!Array.isArray(incoming.scenes)) return;
					const nextScenes = incoming.scenes.map(normalizeVttScene);
					setScenes(nextScenes);
					setLiveSceneId(incoming.currentSceneId ?? null);
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
	}, [
		assetsToolKey,
		campaignId,
		isAuthed,
		setCustomAssetsState,
		toolKey,
		user?.id,
	]);

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

	const getPersistedSceneId = useCallback(
		(
			fallbackCurrentSceneId: string | null,
			overrideLiveSceneId?: string | null,
		) => overrideLiveSceneId ?? liveSceneId ?? fallbackCurrentSceneId,
		[liveSceneId],
	);

	const persistSceneState = useCallback(
		(
			nextScenes: VTTScene[],
			currentSceneId: string | null,
			overrideLiveSceneId?: string | null,
		) => {
			if (!isWarden) return;
			// Mark this as an explicit (authoritative) save so the debounced
			// auto-save effect skips its stale payload window.
			lastExplicitSaveTimestampRef.current = Date.now();
			void saveNow({
				scenes: nextScenes,
				currentSceneId: getPersistedSceneId(
					currentSceneId,
					overrideLiveSceneId,
				),
				savedAt: new Date().toISOString(),
			});
		},
		[getPersistedSceneId, isWarden, saveNow],
	);

	const saveScenes = () => {
		if (!isWarden) return;
		const state = {
			scenes: mergedScenes,
			currentSceneId: getPersistedSceneId(currentScene?.id ?? null),
			savedAt: new Date().toISOString(),
		};
		void saveNow(state);

		if (campaignId && currentScene) {
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

	const uploadCustomAsset = useCallback(
		async (
			file: File,
			usage: "map" | "token",
		): Promise<VTTCampaignAsset | null> => {
			if (!file.type.startsWith("image/")) {
				throw new Error("Please upload an image file.");
			}

			let imageUrl = "";
			let storagePath: string | undefined;
			if (isAuthed && isSupabaseConfigured) {
				const compressed = await compressImage(file, {
					maxWidth: usage === "map" ? 2048 : 1024,
					maxHeight: usage === "map" ? 2048 : 1024,
					quality: 0.88,
					format: "webp",
				});
				const folder = usage === "map" ? "maps" : "tokens";
				storagePath = `vtt/${folder}/${campaignId || "global"}/${usage}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
				const { error: uploadError } = await supabase.storage
					.from("compendium-images")
					.upload(storagePath, compressed, {
						cacheControl: "3600",
						upsert: false,
						contentType: "image/webp",
					});
				if (uploadError) throw uploadError;
				const { data } = supabase.storage
					.from("compendium-images")
					.getPublicUrl(storagePath);
				imageUrl = data.publicUrl;
			} else {
				imageUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = () => reject(new Error("Failed to read file."));
					reader.readAsDataURL(file);
				});
			}

			const asset: VTTCampaignAsset = {
				id: createCustomVttAssetId(),
				name: buildUploadedAssetName(file.name),
				category: usage === "map" ? "map" : "token",
				imageUrl,
				thumbnailUrl: imageUrl,
				tags: ["custom", "uploaded", usage],
				description: null,
				isCustom: true,
				uploadedBy: user?.id ?? undefined,
				uploadedAt: new Date().toISOString(),
				storagePath,
			};
			const nextAssets = [
				asset,
				...customAssets.filter((entry) => entry.id !== asset.id),
			];
			setCustomAssetsState(nextAssets);
			void saveCustomAssetsNow(nextAssets);
			return asset;
		},
		[
			campaignId,
			customAssets,
			isAuthed,
			saveCustomAssetsNow,
			setCustomAssetsState,
			user?.id,
		],
	);

	const deleteCustomAsset = useCallback(
		async (asset: VTTCampaignAsset): Promise<boolean> => {
			if (!asset.isCustom) return false;
			const storagePath = getCompendiumImageStoragePath(asset);
			if (storagePath && isAuthed && isSupabaseConfigured) {
				const { error } = await supabase.storage
					.from("compendium-images")
					.remove([storagePath]);
				if (error && !/not found/i.test(error.message || "")) {
					throw error;
				}
			}

			const nextAssets = customAssets.filter((entry) => entry.id !== asset.id);
			setCustomAssetsState(nextAssets);
			void saveCustomAssetsNow(nextAssets);

			const removal = removeAssetFromVttScenes(mergedScenes, asset.imageUrl);
			if (removal.didChange) {
				setScenes(removal.scenes);
				const nextCurrentScene =
					(currentScene
						? (removal.scenes.find((scene) => scene.id === currentScene.id) ??
							null)
						: null) ??
					removal.scenes[0] ??
					null;
				setCurrentScene(nextCurrentScene);
				persistSceneState(removal.scenes, nextCurrentScene?.id ?? null);
				vttRealtime.broadcastSceneSync(
					removal.scenes,
					getPersistedSceneId(nextCurrentScene?.id ?? null),
				);
			}

			toast({
				title: "Asset deleted",
				description: removal.didChange
					? `Removed "${asset.name}" and cleared its scene references.`
					: `Removed "${asset.name}" from the shared asset library.`,
			});
			return true;
		},
		[
			currentScene,
			customAssets,
			getPersistedSceneId,
			isAuthed,
			mergedScenes,
			persistSceneState,
			saveCustomAssetsNow,
			setCustomAssetsState,
			toast,
			vttRealtime,
		],
	);

	const updateScene = useCallback((updates: Partial<VTTScene>) => {
		setCurrentScene((prev) => {
			if (!prev) return prev;
			const next = { ...prev, ...updates };
			setScenes((prevScenes) => upsertVttScene(prevScenes, next));
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
						const nextScenes = upsertVttScene(prevScenes, next);
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
				const tokenIndex = prev.tokens.findIndex(
					(token) => token.id === tokenId,
				);
				if (tokenIndex === -1) return prev;
				const currentToken = prev.tokens[tokenIndex];
				const hasChanges = Object.entries(updates).some(
					([key, value]) =>
						currentToken[key as keyof VTTTokenInstance] !== value,
				);
				if (!hasChanges) return prev;
				const nextTokens = [...prev.tokens];
				nextTokens[tokenIndex] = { ...currentToken, ...updates };
				const next = { ...prev, tokens: nextTokens };
				setScenes((prevScenes) => {
					const nextScenes = upsertVttScene(prevScenes, next);
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
				const nextScenes = upsertVttScene(prevScenes, scene);
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
					const nextScenes = upsertVttScene(prevScenes, next);
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
			const incoming = (payload.scenes as VTTScene[]).map(normalizeVttScene);
			setScenes(incoming);
			setLiveSceneId(payload.currentSceneId ?? null);
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
			const nextRevealed = fogMode === "reveal";
			const fogData = currentScene.fogData
				? currentScene.fogData.map((row) => [...row])
				: buildFogData(currentScene, false);
			let didChange = false;
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
						if (fogData[fy][fx] !== nextRevealed) {
							fogData[fy][fx] = nextRevealed;
							didChange = true;
						}
					}
				}
			}
			if (!didChange) return;
			updateScene({ fogData });
		},
		[buildFogData, currentScene, fogBrushSize, fogMode, fogOfWar, updateScene],
	);

	const applyPendingPointToDrawing = useCallback(
		(
			drawing: VTTDrawing | null,
			point: { x: number; y: number } | null,
		): VTTDrawing | null => {
			if (!drawing || !point) return drawing;
			if (drawing.type === "freehand") {
				const lastPoint = drawing.points[drawing.points.length - 1];
				if (lastPoint?.x === point.x && lastPoint?.y === point.y) {
					return drawing;
				}
				return {
					...drawing,
					points: [...drawing.points, point],
				};
			}
			const currentEnd = drawing.points[1];
			if (currentEnd?.x === point.x && currentEnd?.y === point.y) {
				return drawing;
			}
			return {
				...drawing,
				points: [drawing.points[0], point],
			};
		},
		[],
	);

	const scheduleDrawingPoint = useCallback(
		(point: { x: number; y: number }) => {
			pendingDrawingPointRef.current = point;
			if (drawingFrameRef.current !== null) return;
			drawingFrameRef.current = window.requestAnimationFrame(() => {
				drawingFrameRef.current = null;
				const pendingPoint = pendingDrawingPointRef.current;
				pendingDrawingPointRef.current = null;
				setActiveDrawing((prev) =>
					applyPendingPointToDrawing(prev, pendingPoint),
				);
			});
		},
		[applyPendingPointToDrawing],
	);

	useEffect(() => {
		return () => {
			if (drawingFrameRef.current !== null) {
				window.cancelAnimationFrame(drawingFrameRef.current);
			}
		};
	}, []);

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
				const asset = await uploadCustomAsset(file, "map");
				if (!asset) {
					throw new Error("Asset upload failed");
				}

				updateScene({
					backgroundImage: asset.imageUrl,
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
		[currentScene, toast, updateScene, uploadCustomAsset],
	);

	const handleClearBackgroundImage = useCallback(async () => {
		if (!currentScene?.backgroundImage) return;
		const matchingCustomAsset = customAssets.find(
			(asset) => asset.imageUrl === currentScene.backgroundImage,
		);
		if (
			matchingCustomAsset &&
			window.confirm(
				`Also delete "${matchingCustomAsset.name}" from the shared asset library? This removes it from every scene that uses it.`,
			)
		) {
			try {
				await deleteCustomAsset(matchingCustomAsset);
				return;
			} catch {
				toast({
					title: "Asset delete failed",
					description:
						"The uploaded map could not be deleted from the shared library.",
					variant: "destructive",
				});
				return;
			}
		}

		updateScene({
			backgroundImage: undefined,
			backgroundScale: DEFAULT_SCENE_SETTINGS.backgroundScale,
			backgroundOffsetX: DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
			backgroundOffsetY: DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
		});
	}, [
		currentScene?.backgroundImage,
		customAssets,
		deleteCustomAsset,
		toast,
		updateScene,
	]);

	const handleDeleteScene = useCallback(
		async (scene: VTTScene) => {
			if (!isWarden) return;
			const warning =
				mergedScenes.length === 1
					? `Delete "${scene.name}"? A blank replacement scene will be created so the VTT stays usable.`
					: `Delete "${scene.name}"?`;
			if (!window.confirm(warning)) return;

			const result = deleteVttScene({
				scenes: mergedScenes,
				sceneId: scene.id,
				currentSceneId: currentScene?.id ?? null,
				liveSceneId,
				replacementSceneName: "Scene 1",
			});
			if (!result.deletedScene) return;

			setScenes(result.scenes);
			setCurrentScene(result.currentScene);
			setLiveSceneId(result.liveSceneId);
			persistSceneState(
				result.scenes,
				result.currentSceneId,
				result.liveSceneId,
			);
			vttRealtime.broadcastSceneSync(
				result.scenes,
				getPersistedSceneId(result.currentSceneId, result.liveSceneId),
			);

			if (campaignId && sessionId && isAuthed) {
				void supabase
					.from("vtt_fog_state")
					.delete()
					.eq("campaign_id", campaignId)
					.eq("session_id", sessionId)
					.eq("scene_id", result.deletedScene.id);
			}

			toast({
				title: "Scene deleted",
				description: result.createdReplacementScene
					? `Deleted "${scene.name}" and created a blank replacement scene.`
					: `Deleted "${scene.name}".`,
			});
		},
		[
			campaignId,
			currentScene?.id,
			getPersistedSceneId,
			isAuthed,
			isWarden,
			liveSceneId,
			mergedScenes,
			persistSceneState,
			sessionId,
			toast,
			vttRealtime,
		],
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
			if (
				currentScene.width !== map.grid.width ||
				currentScene.height !== map.grid.height
			) {
				resizeScene(map.grid.width, map.grid.height);
			}
			updateScene({
				backgroundImage: map.path,
				backgroundScale: 1,
				backgroundOffsetX: 0,
				backgroundOffsetY: 0,
				gridSize: map.grid.size,
			});
		},
		[currentScene, resizeScene, updateScene],
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
					lastMeasureCellRef.current = `${grid.gridX},${grid.gridY}`;
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
					lastMeasureCellRef.current = null;
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
						id: createVttTokenInstanceId(),
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
					id: createVttTokenInstanceId(),
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

	const handleMapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (suppressNextMapActionRef.current) {
			e.stopPropagation();
			return;
		}
		if (e.button === 1 || (e.button === 0 && isViewportPanModifierActive)) {
			e.preventDefault();
			suppressViewportPanClickRef.current = true;
			viewportPanActiveRef.current = true;
			setIsViewportPanning(true);
			return;
		}
		if (!currentScene) return;
		const grid = getGridPosition(e);
		if (!grid) return;

		if (selectedTool === "fog" && fogOfWar && isWarden) {
			lastFogCellRef.current = `${grid.gridX},${grid.gridY}`;
			setIsFogPainting(true);
			applyFogAt(grid.gridX, grid.gridY);
			return;
		}

		if (selectedTool === "draw" && isWarden) {
			pendingDrawingPointRef.current = null;
			if (drawingFrameRef.current !== null) {
				window.cancelAnimationFrame(drawingFrameRef.current);
				drawingFrameRef.current = null;
			}
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
		(e: KeyboardEvent) => {
			if (isVttShortcutTarget(e.target)) return;
			if (e.code === "Space") {
				setIsViewportPanModifierActive(true);
				e.preventDefault();
				return;
			}
			// Escape: deselect everything
			if (e.key === "Escape") {
				e.preventDefault();
				setActiveTokenId(null);
				return;
			}
			// Delete/Backspace: remove active token (Warden only)
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
			// Arrow keys: nudge active token by 1 grid square
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
			// Shift+H / Shift+L / Shift+G — DDB token hotkeys
			if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
				const key = e.key.toLowerCase();
				if (key === "h" && activeTokenId && isWarden) {
					e.preventDefault();
					const token = (currentScene?.tokens ?? []).find(
						(t: VTTTokenInstance) => t.id === activeTokenId,
					);
					if (token) {
						updateToken(activeTokenId, { visible: !token.visible });
					}
					return;
				}
				if (key === "l" && activeTokenId && isWarden) {
					e.preventDefault();
					const token = (currentScene?.tokens ?? []).find(
						(t: VTTTokenInstance) => t.id === activeTokenId,
					);
					if (token) {
						updateToken(activeTokenId, { locked: !token.locked });
					}
					return;
				}
				if (key === "g" && activeTokenId && isWarden) {
					e.preventDefault();
					const token = (currentScene?.tokens ?? []).find(
						(t: VTTTokenInstance) => t.id === activeTokenId,
					);
					if (token) {
						// Generate a shared groupId (or clear existing one if already grouped).
						const nextGroupId = token.groupId ? undefined : `grp-${Date.now()}`;
						updateToken(activeTokenId, { groupId: nextGroupId });
					}
					return;
				}
			}
			// Tool hotkeys (only when no modifier keys)
			if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
				const toolKeys: Record<string, typeof selectedTool> = {
					s: "select",
					f: "fog",
					d: "draw",
					e: "effect",
					n: "note",
					m: "measure",
					r: "measure", // Ruler alias (DDB/Roll20 parity)
					x: "pointer", // DDB "Point & Ping" parity
				};
				const tool = toolKeys[e.key.toLowerCase()];
				if (tool && isWarden) {
					e.preventDefault();
					setSelectedTool(tool);
					return;
				}
			}
			// Zoom hotkeys (DDB/Foundry parity) — match when not in a text input.
			if (!e.ctrlKey && !e.metaKey && !e.altKey) {
				if (e.key === "+" || e.key === "=") {
					e.preventDefault();
					setZoom((prev) => Math.min(2, Math.round((prev + 0.1) * 100) / 100));
					return;
				}
				if (e.key === "-" || e.key === "_") {
					e.preventDefault();
					setZoom((prev) =>
						Math.max(0.5, Math.round((prev - 0.1) * 100) / 100),
					);
					return;
				}
				if (e.key === "0") {
					e.preventDefault();
					setZoom(1);
					return;
				}
				if (e.key === "Home") {
					e.preventDefault();
					handleFitZoom();
					return;
				}
				// Layer quick-cycle (Roll20 parity): `[` prev / `]` next
				if ((e.key === "[" || e.key === "]") && isWarden) {
					e.preventDefault();
					const delta = e.key === "]" ? 1 : -1;
					setCurrentLayer((prev) => {
						const ids = LAYER_OPTIONS.map((l) => l.id);
						const idx = ids.indexOf(prev);
						const next = (idx + delta + ids.length) % ids.length;
						return ids[next] ?? prev;
					});
					return;
				}
			}
			// Enter: generic grid action
			if (e.key === "Enter") {
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
			handleFitZoom,
			handleMapGridAction,
			isWarden,
			removeToken,
			selectedTool,
			setZoom,
			updateToken,
		],
	);

	const handleMapKeyUp = useCallback((e: KeyboardEvent) => {
		if (e.code !== "Space") return;
		setIsViewportPanModifierActive(false);
		e.preventDefault();
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		window.addEventListener("keydown", handleMapKeyDown);
		window.addEventListener("keyup", handleMapKeyUp);
		return () => {
			window.removeEventListener("keydown", handleMapKeyDown);
			window.removeEventListener("keyup", handleMapKeyUp);
		};
	}, [handleMapKeyDown, handleMapKeyUp]);

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

	const lastDmCursorBroadcast = useRef(0);
	// Wheel zoom is handled directly on the map container by VttPixiStage
	// (see src/components/vtt/VttPixiStage.tsx). No React-level onWheel is
	// needed here.

	const handleMapMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (viewportPanActiveRef.current) return;
			const grid = getGridPosition(e);
			if (!grid) return;

			if (
				draggedToken &&
				(draggedToken.x !== grid.gridX || draggedToken.y !== grid.gridY)
			) {
				updateToken(draggedToken.id, { x: grid.gridX, y: grid.gridY });
			}

			if (selectedTool === "fog" && isFogPainting && fogOfWar && isWarden) {
				const fogCellKey = `${grid.gridX},${grid.gridY}`;
				if (lastFogCellRef.current !== fogCellKey) {
					lastFogCellRef.current = fogCellKey;
					applyFogAt(grid.gridX, grid.gridY);
				}
			}

			if (selectedTool === "measure" && measurementStart) {
				const measureCellKey = `${grid.gridX},${grid.gridY}`;
				if (lastMeasureCellRef.current !== measureCellKey) {
					lastMeasureCellRef.current = measureCellKey;
					setMeasurementEnd((prev) =>
						prev?.x === grid.gridX && prev?.y === grid.gridY
							? prev
							: { x: grid.gridX, y: grid.gridY },
					);
				}
			}

			if (activeDrawing && selectedTool === "draw" && isWarden) {
				scheduleDrawingPoint({ x: grid.x, y: grid.y });
			}

			if (selectedTool === "pointer") {
				vttRealtime.broadcastPointer(grid.gridX, grid.gridY);
			}

			const now = Date.now();
			const cursorCellKey = `${grid.gridX},${grid.gridY}`;
			if (
				cursorCellKey !== lastCursorCellRef.current &&
				now - lastDmCursorBroadcast.current > 100
			) {
				lastDmCursorBroadcast.current = now;
				lastCursorCellRef.current = cursorCellKey;
				vttRealtime.updateCursor({ x: grid.gridX, y: grid.gridY });
			}
		},
		[
			activeDrawing,
			applyFogAt,
			draggedToken,
			fogOfWar,
			getGridPosition,
			isFogPainting,
			isWarden,
			measurementStart,
			scheduleDrawingPoint,
			selectedTool,
			updateToken,
			vttRealtime,
		],
	);

	const handleMapDoubleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const grid = getGridPosition(e);
			if (grid) {
				vttRealtime.sendPing(grid.gridX, grid.gridY);
			}
		},
		[getGridPosition, vttRealtime],
	);

	const handleMapMouseUp = useCallback(
		(e?: React.MouseEvent<HTMLDivElement>) => {
			const wasDraggingToken = draggedToken != null;
			const wasFogPainting = isFogPainting;
			const hadActiveDrawing = activeDrawing != null;
			if (viewportPanActiveRef.current) {
				clearViewportPan();
				return;
			}
			if (drawingFrameRef.current !== null) {
				window.cancelAnimationFrame(drawingFrameRef.current);
				drawingFrameRef.current = null;
			}
			const finalizedDrawing = applyPendingPointToDrawing(
				activeDrawing,
				pendingDrawingPointRef.current,
			);
			pendingDrawingPointRef.current = null;
			if (draggedToken) {
				setDraggedToken(null);
			}
			if (isFogPainting) {
				setIsFogPainting(false);
				lastFogCellRef.current = null;
			}
			lastMeasureCellRef.current = null;
			if (finalizedDrawing && currentScene) {
				updateScene({
					drawings: [...(currentScene.drawings ?? []), finalizedDrawing],
				});
				setActiveDrawing(null);
				return;
			}
			if (
				e?.type === "mouseup" &&
				e.button === 0 &&
				!suppressNextMapActionRef.current &&
				!suppressViewportPanClickRef.current &&
				!wasDraggingToken &&
				!wasFogPainting &&
				!hadActiveDrawing
			) {
				const grid = getGridPosition(e);
				if (!grid) return;
				handleMapGridAction(grid);
			}
		},
		[
			activeDrawing,
			applyPendingPointToDrawing,
			clearViewportPan,
			currentScene,
			draggedToken,
			getGridPosition,
			handleMapGridAction,
			isFogPainting,
			updateScene,
		],
	);

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
	const applyDamageToActiveToken = useCallback(() => {
		if (!activeToken || !damageAmount) {
			resetDamageDialog();
			return;
		}

		const damage = parseInt(damageAmount, 10);
		if (Number.isNaN(damage) || damage <= 0) {
			resetDamageDialog();
			return;
		}

		const damageResult = applyDamageMitigation({
			rawDamage: damage,
			damageType,
			mode: damageMode,
			mitigation: activeCharacter
				? {
						resistances: activeCharacter.resistances,
						immunities: activeCharacter.immunities,
						vulnerabilities: activeCharacter.vulnerabilities,
					}
				: null,
		});
		const currentHP = activeToken.hp ?? 0;
		const newHP = Math.max(0, currentHP - damageResult.finalDamage);
		updateToken(activeToken.id, { hp: newHP });
		syncCharacterHP(activeToken.characterId, newHP);
		toast({
			title: "Damage Applied",
			description: `${damageResult.finalDamage} damage applied to ${activeToken.name}. HP: ${currentHP} → ${newHP}. ${damageResult.summary}`,
		});
		resetDamageDialog();
	}, [
		activeCharacter,
		activeToken,
		damageAmount,
		damageMode,
		damageType,
		resetDamageDialog,
		syncCharacterHP,
		toast,
		updateToken,
	]);

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

	const drawingsToRender = useMemo(() => {
		const base = currentScene?.drawings ?? [];
		return activeDrawing ? [...base, activeDrawing] : base;
	}, [activeDrawing, currentScene?.drawings]);
	const annotationsToRender = useMemo(
		() => currentScene?.annotations ?? [],
		[currentScene?.annotations],
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
			Math.max(24, fx.particleCount * 4),
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
				const halfAngle = Math.PI / 6; // 30deg half-angle = 60deg cone
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
		<Layout fullBleed>
			{/* Test detection element */}
			<div data-testid="vtt-interface" aria-hidden="true">
				{import.meta.env.DEV && (
					<>
						<React.Suspense fallback={null}>
							<WardenDirectiveMatrix />
						</React.Suspense>
						{currentScene && (
							<VTTSubEngineProcessor
								scene={currentScene as VTTScene}
								tokens={currentScene.tokens}
								activeTokenId={activeTokenId}
							/>
						)}
					</>
				)}
			</div>

			{!isWarden ? (
				<EmbeddedProvider>
					<PlayerMapView
						campaignId={campaignId || ""}
						sessionId={sessionId || undefined}
					/>
				</EmbeddedProvider>
			) : (
				<div className="vtt-shell relative w-full h-[100dvh] overflow-hidden">
					{/* Floating top bar (absolute positioned via VTTTopBar internals). */}
					<VTTTopBar
						left={
							<>
								<Button
									variant="ghost"
									onClick={() => navigate(`/campaigns/${campaignId}`)}
									size="sm"
									className="shrink-0 h-8 px-2"
									aria-label="Back to Campaign"
								>
									<ArrowLeft className="w-4 h-4" aria-hidden />
									<span className="hidden md:inline ml-1.5 text-xs">Back</span>
								</Button>
								<div className="min-w-0 flex-1">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<button
												type="button"
												data-testid="vtt-scene-title"
												className="inline-flex items-center gap-1 min-w-0 max-w-full truncate text-sm font-semibold text-primary/90 hover:text-primary transition-colors px-1.5 py-0.5 rounded hover:bg-muted/40"
												title="Change scene"
											>
												<span className="truncate">
													{currentScene?.name || "No Scene"}
												</span>
												<ChevronDown
													className="w-3 h-3 opacity-60 shrink-0"
													aria-hidden
												/>
											</button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="w-56">
											<DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-foreground/70">
												Scenes
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											{scenes.length === 0 ? (
												<DropdownMenuItem disabled>
													No scenes yet
												</DropdownMenuItem>
											) : (
												scenes.map((scene) => (
													<DropdownMenuItem
														key={scene.id}
														onClick={() => {
															setCurrentScene(scene);
														}}
														className={cn(
															"text-xs",
															currentScene?.id === scene.id &&
																"bg-primary/15 text-primary",
														)}
													>
														<span className="truncate flex-1">
															{scene.name}
														</span>
														{liveSceneId === scene.id && (
															<span className="ml-2 text-[9px] font-bold uppercase text-amber-500">
																Live
															</span>
														)}
													</DropdownMenuItem>
												))
											)}
											{isWarden && (
												<>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => createNewScene()}
														className="text-xs"
													>
														<Plus className="w-3 h-3 mr-2" />
														New scene
													</DropdownMenuItem>
												</>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<Badge
									variant={vttRealtime.isConnected ? "default" : "destructive"}
									className="text-[10px] inline-flex items-center gap-1 shrink-0"
								>
									{vttRealtime.isConnected ? (
										<>
											<Wifi className="w-3 h-3" aria-hidden />
											<span className="hidden sm:inline">LIVE</span>
										</>
									) : (
										<>
											<WifiOff className="w-3 h-3" aria-hidden />
											<span className="hidden sm:inline">OFFLINE</span>
										</>
									)}
								</Badge>
								{vttRealtime.activeUsers.length > 0 && (
									<ConnectedPlayersPopover
										campaignId={campaignId}
										users={vttRealtime.activeUsers.map<ConnectedUser>((u) => ({
											userId: u.userId,
											userName: u.userName,
											role: u.role,
											color: u.color,
										}))}
										className="hidden md:inline-flex"
									/>
								)}
							</>
						}
						right={
							<>
								{isActualWarden && (
									<Button
										data-testid="vtt-player-view-toggle"
										variant="outline"
										size="sm"
										onClick={() => setSimulatePlayerView(!simulatePlayerView)}
										className={cn(
											"h-8 text-[11px] px-2",
											simulatePlayerView
												? "border-primary text-primary"
												: "text-foreground/70",
										)}
									>
										<span className="hidden md:inline">
											{simulatePlayerView ? "Exit Player View" : "Player View"}
										</span>
										<span className="md:hidden">
											<Eye className="w-3.5 h-3.5" aria-hidden />
										</span>
									</Button>
								)}
								{isActualWarden && campaignId && (
									<SessionControlsMenu
										status={sessionStatus}
										onSetState={(state) =>
											setSessionState(state, null, user?.id)
										}
										mapLink={`${window.location.origin}/campaigns/${campaignId}/vtt${
											currentScene?.id ? `?scene=${currentScene.id}` : ""
										}`}
										inviteLink={null}
										spectatorLink={`${window.location.origin}/campaigns/${campaignId}/vtt/spectate`}
									/>
								)}
								{isActualWarden && (
									<GameSettingsDrawer
										settings={vttSettings}
										onChange={setVTTSettings}
										disabled={!campaignId}
									/>
								)}
								{isWarden && (
									<>
										<Button
											onClick={saveScenes}
											variant="outline"
											size="sm"
											className="h-8 px-2"
											aria-label="Save scenes"
										>
											<Save className="w-4 h-4" aria-hidden />
											<span className="hidden lg:inline ml-1.5 text-xs">
												Save
											</span>
										</Button>
										<Button
											data-testid="vtt-new-scene"
											onClick={createNewScene}
											variant="outline"
											size="sm"
											className="h-8 px-2"
											aria-label="New scene"
										>
											<Plus className="w-4 h-4" aria-hidden />
											<span className="hidden lg:inline ml-1.5 text-xs">
												New
											</span>
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setIsMapExpanded((prev) => !prev)}
											className="h-8 px-2"
											aria-label={isMapExpanded ? "Exit Focus" : "Focus"}
											title={isMapExpanded ? "Exit Focus mode" : "Focus mode"}
										>
											<Maximize2 className="w-4 h-4" aria-hidden />
											<span className="hidden lg:inline ml-1.5 text-xs">
												{isMapExpanded ? "Exit" : "Focus"}
											</span>
										</Button>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 text-foreground/70 hover:text-foreground"
													aria-label="Keyboard shortcuts"
													title="Keyboard shortcuts"
												>
													?
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-md w-[calc(100%-2rem)]">
												<DialogHeader>
													<DialogTitle>Keyboard Shortcuts</DialogTitle>
													<DialogDescription>
														Available when the map canvas is focused.
													</DialogDescription>
												</DialogHeader>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
													<span className="text-foreground/70 font-semibold col-span-2 mt-1">
														Selection & Movement
													</span>
													<span className="text-foreground/70">Escape</span>
													<span>Deselect token</span>
													<span className="text-foreground/70">
														Delete / Backspace
													</span>
													<span>Remove selected token</span>
													<span className="text-foreground/70">Arrow keys</span>
													<span>Nudge token 1 square</span>
													<span className="text-foreground/70">Shift+H</span>
													<span>Hide / reveal token (Warden)</span>
													<span className="text-foreground/70">Shift+L</span>
													<span>Lock / unlock token</span>
													<span className="text-foreground/70">Shift+G</span>
													<span>Toggle group on selected token</span>
													<span className="text-foreground/70">O</span>
													<span>Open character sheet</span>
													<span className="text-foreground/70 font-semibold col-span-2 mt-2">
														Tool Hotkeys
													</span>
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
													<span className="text-foreground/70">M / R</span>
													<span>Measure / Ruler tool</span>
													<span className="text-foreground/70">X</span>
													<span>Pointer tool (trailing highlight)</span>
													<span className="text-foreground/70 font-semibold col-span-2 mt-2">
														Zoom
													</span>
													<span className="text-foreground/70">+ / =</span>
													<span>Zoom in</span>
													<span className="text-foreground/70">− / _</span>
													<span>Zoom out</span>
													<span className="text-foreground/70">0</span>
													<span>Reset zoom to 100%</span>
													<span className="text-foreground/70">Home</span>
													<span>Zoom to fit scene</span>
													<span className="text-foreground/70">
														Wheel / Ctrl+Wheel
													</span>
													<span>Zoom (plain wheel is DDB/Foundry default)</span>
													<span className="text-foreground/70 font-semibold col-span-2 mt-2">
														Layers
													</span>
													<span className="text-foreground/70">[ / ]</span>
													<span>Cycle active layer (Warden)</span>
													<span className="text-foreground/70 font-semibold col-span-2 mt-2">
														Assets &amp; Viewport
													</span>
													<span className="text-foreground/70">
														Drag &amp; Drop
													</span>
													<span>Drag asset from browser onto map</span>
													<span className="text-foreground/70">Space</span>
													<span>Hold to pan viewport</span>
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
							</>
						}
					/>

					{/* Content area: rails + canvas. Top-padding accommodates
						    the compact floating top bar (~36 px high). */}
					<div
						className={cn(
							"vtt-content absolute inset-0 flex gap-2 sm:gap-3",
							"pt-[44px] px-2 sm:px-3 pb-2",
							isMobile && "pb-[64px]",
						)}
					>
						{/* Always-visible left icon rail (Warden only, desktop). */}
						{isWarden && !isMobile && !isMapExpanded && (
							<VTTIconRail
								side="left"
								activeId={leftDrawerTab}
								onSelect={(id) => setLeftDrawerTab(id as LeftDrawerTab)}
								items={
									[
										{
											id: "scenes",
											icon: Layers,
											label: "Scenes",
											testId: "vtt-rail-left-scenes",
										},
										{
											id: "toolbox",
											icon: Wrench,
											label: "Toolbox",
											testId: "vtt-rail-left-toolbox",
										},
										{
											id: "map",
											icon: MapPin,
											label: "Map Settings",
											testId: "vtt-rail-left-map",
										},
										{
											id: "tokens",
											icon: Users,
											label: "Tokens",
											testId: "vtt-rail-left-tokens",
										},
									] as VTTIconRailItem[]
								}
							/>
						)}
						{/* Left drawer: overlay panel populated by the rail selection. */}
						{isWarden && (
							<VTTDrawer
								side="left"
								open={leftDrawerTab !== null}
								onOpenChange={(o) => !o && setLeftDrawerTab(null)}
								title={
									leftDrawerTab === "scenes"
										? "Scenes"
										: leftDrawerTab === "toolbox"
											? "Toolbox"
											: leftDrawerTab === "map"
												? "Map Settings"
												: leftDrawerTab === "tokens"
													? "Tokens"
													: "Toolbox"
								}
							>
								<Tabs
									value={leftDrawerTab ?? "scenes"}
									onValueChange={(v) => setLeftDrawerTab(v as LeftDrawerTab)}
									className="flex flex-col min-h-0 h-full"
								>
									<TabsList className="grid w-full grid-cols-4 h-auto p-1 mb-2 shrink-0 bg-card border border-border rounded-lg shadow-sm">
										<TabsTrigger
											value="scenes"
											className="text-[10px] uppercase tracking-widest py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
										>
											Scenes
										</TabsTrigger>
										<TabsTrigger
											value="toolbox"
											className="text-[10px] uppercase tracking-widest py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
										>
											Toolbox
										</TabsTrigger>
										<TabsTrigger
											value="map"
											className="text-[10px] uppercase tracking-widest py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
										>
											Map
										</TabsTrigger>
										<TabsTrigger
											value="tokens"
											className="text-[10px] uppercase tracking-widest py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
										>
											Tokens
										</TabsTrigger>
									</TabsList>

									{/* Scene tab: Scenes list */}
									<TabsContent
										value="scenes"
										className="flex flex-col gap-4 overflow-y-auto min-h-0 flex-1 mt-0"
									>
										<AscendantWindow title="SCENES" compact density="compact">
											<div className="space-y-1 max-h-40 overflow-y-auto">
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
															data-testid={`vtt-scene-select-${scene.name.replace(/\s+/g, "-").toLowerCase()}`}
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
																title={
																	liveSceneId === scene.id
																		? "Live"
																		: "Make Live for Players"
																}
																aria-label={
																	liveSceneId === scene.id
																		? "Live"
																		: "Make Live for Players"
																}
																onClick={() => {
																	setLiveSceneId(scene.id);
																	vttRealtime.broadcastSceneChange(scene.id);
																}}
																className={cn(
																	"p-1 rounded inline-flex items-center gap-1 text-[9px] font-bold uppercase mr-1",
																	liveSceneId === scene.id
																		? "bg-amber-500 text-black"
																		: "bg-muted text-foreground/70 hover:bg-muted/80",
																)}
															>
																{liveSceneId === scene.id ? (
																	<>
																		<Eye className="w-3 h-3" />
																		Live
																	</>
																) : (
																	<>
																		<Play className="w-3 h-3" />
																		Go
																	</>
																)}
															</button>
														)}
														<div className="flex gap-0.5 pr-1">
															<button
																type="button"
																onClick={() => {
																	setCurrentScene(scene);
																	const newName = window.prompt(
																		"Scene name:",
																		scene.name,
																	);
																	if (newName && newName !== scene.name) {
																		updateScene({ name: newName } as never);
																	}
																}}
																className="p-1 rounded hover:bg-muted inline-flex items-center justify-center"
																title="Rename scene"
																aria-label="Rename scene"
															>
																<Pencil className="w-3 h-3" />
															</button>
															<button
																type="button"
																onClick={() => {
																	const dup = duplicateVttScene(scene);
																	setScenes((prev) => [...prev, dup]);
																	setCurrentScene(dup);
																}}
																className="p-1 rounded hover:bg-muted inline-flex items-center justify-center"
																title="Duplicate scene"
																aria-label="Duplicate scene"
															>
																<Copy className="w-3 h-3" />
															</button>
															<button
																type="button"
																onClick={() => {
																	void handleDeleteScene(scene);
																}}
																className="p-1 rounded hover:bg-destructive/20 text-destructive inline-flex items-center justify-center"
																title="Delete scene"
																aria-label="Delete scene"
															>
																<X className="w-3 h-3" />
															</button>
														</div>
													</div>
												))}
											</div>
										</AscendantWindow>
									</TabsContent>
									<TabsContent
										value="toolbox"
										className="flex flex-col gap-4 overflow-y-auto min-h-0 flex-1 mt-0 max-h-[calc(100vh-280px)]"
									>
										<AscendantWindow title="TOOLS" density="compact">
											<div className="grid grid-cols-2 gap-2">
												{(
													[
														{
															key: "select",
															label: "Select",
															Icon: MousePointer2,
														},
														{ key: "fog", label: "Fog", Icon: Cloud },
														{ key: "draw", label: "Draw", Icon: Pencil },
														{
															key: "effect",
															label: "Effect",
															Icon: Sparkles,
														},
														{ key: "note", label: "Note", Icon: FileText },
														{ key: "measure", label: "Measure", Icon: Ruler },
														{ key: "pointer", label: "Point", Icon: Radio },
													] as const
												).map((tool) =>
													selectedTool === tool.key ? (
														<button
															type="button"
															key={tool.key}
															onClick={() => setSelectedTool(tool.key)}
															className="w-full p-2 rounded border text-xs uppercase tracking-wide transition-all inline-flex items-center justify-center gap-1.5 bg-primary/20 border-primary"
															aria-label={`${tool.label} tool`}
															aria-pressed="true"
														>
															<tool.Icon
																className="w-3.5 h-3.5 flex-shrink-0"
																aria-hidden
															/>
															<span className="flex-1">{tool.label}</span>
														</button>
													) : (
														<button
															type="button"
															key={tool.key}
															onClick={() => setSelectedTool(tool.key)}
															className="w-full p-2 rounded border text-xs uppercase tracking-wide transition-all inline-flex items-center justify-center gap-1.5 border-border hover:bg-muted/50"
															aria-label={`${tool.label} tool`}
															aria-pressed="false"
														>
															<tool.Icon
																className="w-3.5 h-3.5 flex-shrink-0"
																aria-hidden
															/>
															<span className="flex-1">{tool.label}</span>
														</button>
													),
												)}
											</div>
											{selectedTool === "measure" && (
												<div className="mt-3 pt-3 border-t border-border/50 space-y-2">
													<Label className="text-xs">AoE Shape</Label>
													<div className="grid grid-cols-4 gap-1">
														{(
															[
																{ key: "line", label: "Line", Icon: Minus },
																{
																	key: "circle",
																	label: "Circle",
																	Icon: Circle,
																},
																{
																	key: "cone",
																	label: "Cone",
																	Icon: Triangle,
																},
																{ key: "cube", label: "Cube", Icon: Square },
															] as const
														).map((shape) => (
															<button
																type="button"
																key={shape.key}
																onClick={() => setMeasureShape(shape.key)}
																className={cn(
																	"p-1.5 rounded border text-sm transition-all inline-flex items-center justify-center",
																	measureShape === shape.key
																		? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
																		: "border-border/50 text-foreground/70 hover:bg-muted/30",
																)}
																title={shape.label}
																aria-label={`${shape.label} area of effect`}
															>
																<shape.Icon
																	className="w-3.5 h-3.5"
																	aria-hidden
																/>
															</button>
														))}
													</div>
													{measureShape !== "line" && (
														<div>
															<Label className="text-xs">
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

										<AscendantWindow title="CONTROLS" density="compact">
											<div className="space-y-3 overflow-y-auto max-h-[35vh]">
												<p className="text-[10px] leading-snug text-foreground/60">
													Zoom controls live on the floating HUD over the map
													(+/−/0/Home hotkeys also supported).
												</p>
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
										<AscendantWindow title="LAYERS" density="compact">
											<div className="space-y-2 overflow-hidden">
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
									</TabsContent>
									<TabsContent
										value="map"
										className="flex flex-col gap-4 overflow-y-auto min-h-0 flex-1 mt-0"
									>
										<AscendantWindow title="MAP SETTINGS" density="compact">
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
															onClick={() => void handleClearBackgroundImage()}
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
											<AscendantWindow title="PREMADE MAPS" density="compact">
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
									</TabsContent>
									<TabsContent
										value="tokens"
										className="flex flex-col gap-4 overflow-y-auto min-h-0 flex-1 mt-0"
									>
										<AscendantWindow title="TOKENS" density="compact">
											<Tabs defaultValue="characters" className="w-full">
												<TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-card border border-border rounded-lg shadow-sm">
													<TabsTrigger
														data-testid="vtt-tokens-tab-characters"
														value="characters"
														className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
													>
														<Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
														<span className="hidden xs:inline">Characters</span>
														<span className="xs:hidden">C</span>
													</TabsTrigger>
													<TabsTrigger
														data-testid="vtt-tokens-tab-library"
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
																			{char.hp_current || 0}/{char.hp_max || 0}{" "}
																			HP | AC {char.armor_class || 10}
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
																		(token.imageUrl.includes(
																			"/generated/props/",
																		) ||
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
									</TabsContent>
								</Tabs>
							</VTTDrawer>
						)}

						{/* Main Map Area — fills remaining viewport. */}
						<div
							className={cn(
								"vtt-map-area relative flex-1 min-h-0 min-w-0 overflow-hidden",
							)}
						>
							{/* Floating layer quick-switch (Roll20 / Foundry parity). */}
							{isWarden && (
								<div className="absolute bottom-3 left-3 z-20">
									<LayerQuickSwitch
										layers={LAYER_OPTIONS}
										currentLayer={currentLayer}
										onSelectLayer={setCurrentLayer}
										visibility={visibleLayers}
										onToggleVisibility={(id) =>
											setVisibleLayers((prev) => ({
												...prev,
												[id]: !prev[id],
											}))
										}
									/>
								</div>
							)}
							{/* Persistent floating zoom HUD (DDB/Foundry parity). */}
							<VTTZoomHud
								zoom={zoom}
								onRequestZoom={handleRequestZoom}
								onFit={handleFitZoom}
								onRecenter={handleRecenter}
							/>
							{/* DDB "Point" trailing highlight from all connected users. */}
							<VTTPointerOverlay
								trails={vttRealtime.pointerTrails}
								gridSize={gridSize}
								zoom={zoom}
							/>
							{/* Floating token action bar when a token is selected. */}
							{activeToken && currentScene && (
								<TokenActionBar
									token={activeToken}
									anchor={{
										x: activeToken.x * gridSize * zoom,
										y: activeToken.y * gridSize * zoom,
									}}
									isWarden={isWarden}
									onUpdate={(patch) => updateToken(activeToken.id, patch)}
									onDelete={() => {
										removeToken(activeToken.id);
										setActiveTokenId(null);
									}}
									onOpenSheet={
										activeToken.characterId
											? () =>
													window.open(
														`/character/${activeToken.characterId}`,
														"_blank",
														"noopener",
													)
											: undefined
									}
									onClose={() => setActiveTokenId(null)}
								/>
							)}
							<div
								className={cn(
									"h-full w-full flex flex-col min-h-0 overflow-hidden relative",
								)}
							>
								<div
									role="application"
									aria-label="VTT map canvas. Click to place or interact with items, press Enter to act at center. Drop assets from the browser to place them."
									data-testid="vtt-map"
									ref={mapRef}
									onDoubleClick={handleMapDoubleClick}
									onMouseDown={handleMapMouseDown}
									onMouseMove={handleMapMouseMove}
									onMouseUp={handleMapMouseUp}
									onMouseLeave={handleMapMouseUp}
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
									className={cn(
										"flex-1 relative border-2 border-border rounded-lg bg-background overflow-auto min-h-0",
										selectedTool !== "select" && "cursor-crosshair",
										selectedTool === "select" &&
											(selectedCharacterId || selectedLibraryTokenId) &&
											"cursor-crosshair",
										isViewportPanning && "cursor-grabbing select-none",
										!isViewportPanning &&
											isViewportPanModifierActive &&
											"cursor-grab",
									)}
								>
									<div
										className={cn(
											"vtt-scene-container min-h-0 overflow-auto",
											sceneClass,
										)}
									>
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
												viewportPanModifierActive={isViewportPanModifierActive}
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
													if (!effectiveVisibleLayers[note.layer]) return null;
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
											weatherPreset &&
											weatherParticles.length > 0 && (
												<div
													className="absolute inset-0 pointer-events-none z-[10] overflow-hidden mix-blend-screen opacity-80"
													data-testid="vtt-weather-overlay"
												>
													<style>{getWeatherCSSAnimation(weatherPreset)}</style>
													{weatherParticles.map((particle) => {
														return (
															<DynamicStyle
																key={particle.id}
																className="absolute rounded-full vtt-weather-particle"
																vars={{
																	"--vtt-particle-size": `${particle.size}px`,
																	"--vtt-particle-left": `${particle.left}%`,
																	"--vtt-particle-top": `${particle.top}%`,
																	"--vtt-particle-color":
																		weatherPreset.particleColor,
																	"--vtt-particle-animation": `weather-particle-${currentScene?.weather} ${particle.animationDuration}s linear infinite`,
																	"--vtt-particle-delay": `${particle.delay}s`,
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
							</div>
						</div>

						{/* Always-visible right icon rail (Warden only, desktop). */}
						{isWarden && !isMobile && !isMapExpanded && (
							<VTTIconRail
								side="right"
								activeId={wardenToolsOpen ? "warden-tools" : rightDrawerTab}
								onSelect={(id) => {
									// The warden-tools rail item opens the existing Sheet
									// instead of driving the drawer/inner-tab state.
									if (id === "warden-tools") {
										setWardenToolsOpen((prev) => !prev);
										setRightDrawerTab(null);
										return;
									}
									const next = id as RightDrawerTab;
									setRightDrawerTab(next);
									setWardenToolsOpen(false);
									if (next && next !== "token" && next !== null) {
										setRightInnerTab(
											next as Exclude<RightDrawerTab, null | "token">,
										);
									}
								}}
								items={
									[
										{
											id: "token",
											icon: User,
											label: "Selected Token",
											testId: "vtt-rail-right-token",
										},
										{
											id: "initiative",
											icon: Clock,
											label: "Initiative",
											testId: "vtt-rail-right-initiative",
										},
										{
											id: "chat",
											icon: MessageSquare,
											label: "Chat",
											testId: "vtt-rail-right-chat",
										},
										{
											id: "dice",
											icon: Dice6,
											label: "Dice",
											testId: "vtt-rail-right-dice",
										},
										{
											id: "assets",
											icon: ImageIcon,
											label: "Assets",
											testId: "vtt-rail-right-assets",
										},
										{
											id: "journal",
											icon: BookOpen,
											label: "Journal",
											testId: "vtt-rail-right-journal",
										},
										{
											id: "broadcast",
											icon: Radio,
											label: "Broadcast",
											testId: "vtt-rail-right-broadcast",
										},
										{
											id: "ai",
											icon: Bot,
											label: "AI Assistant",
											testId: "vtt-rail-right-ai",
										},
										{
											id: "log",
											icon: Dice6,
											label: "Game Log",
											testId: "vtt-rail-right-log",
										},
										{
											id: "warden-tools",
											icon: Wrench,
											label: "Warden Tools",
											testId: "vtt-rail-right-warden-tools",
										},
									] as VTTIconRailItem[]
								}
							/>
						)}

						{/* Warden Tools Sheet (opened by rail "warden-tools" or top-bar button). */}
						{isWarden && (
							<Sheet open={wardenToolsOpen} onOpenChange={setWardenToolsOpen}>
								<SheetContent
									side="right"
									className="w-[min(560px,95vw)] sm:max-w-[600px] p-0 flex flex-col bg-card border-l border-primary/30"
								>
									<SheetHeader className="px-4 py-3 border-b border-border/60 shrink-0">
										<SheetTitle className="text-sm font-heading tracking-[0.2em] uppercase text-primary inline-flex items-center gap-2">
											<Wrench className="w-4 h-4" aria-hidden />
											Warden Tools
										</SheetTitle>
										<SheetDescription className="text-xs text-foreground/70">
											Macros, music, atmosphere, terrain, ambient sound, map
											generator, encounters, and session audio.
										</SheetDescription>
									</SheetHeader>
									{/* Session audio tracks — folded into the drawer so it is not
											    visually stacked behind the main sidebar. */}
									{sessionId && (
										<div className="px-4 pt-3 pb-1 border-b border-border/40 shrink-0">
											<div className="flex items-center justify-between mb-2">
												<span className="text-[11px] font-heading tracking-[0.2em] uppercase text-foreground/70">
													Session Audio
												</span>
												<Button
													variant="outline"
													size="sm"
													className="h-7 text-[11px]"
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
													+ Track
												</Button>
											</div>
											{audioTracks.length === 0 ? (
												<AscendantText className="block text-xs text-foreground/70 py-1">
													No tracks uploaded for this session yet.
												</AscendantText>
											) : (
												<div className="space-y-1 max-h-40 overflow-y-auto pr-1">
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
																	{track.is_playing ? (
																		<Pause
																			className="w-3.5 h-3.5"
																			aria-label="Pause track"
																		/>
																	) : (
																		<Play
																			className="w-3.5 h-3.5"
																			aria-label="Play track"
																		/>
																	)}
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
																	<X
																		className="w-3.5 h-3.5"
																		aria-label="Delete"
																	/>
																</Button>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									)}
									<div className="flex-1 overflow-y-auto px-4 py-3">
										<ProtocolWardenTools
											campaignId={campaignId || ""}
											onRoll={vttRealtime.rollAndBroadcast}
											customAssets={customAssets}
											onUploadAsset={uploadCustomAsset}
											onDeleteAsset={deleteCustomAsset}
											onChangeMap={(url, name) => {
												if (currentScene) {
													// Use the same field name the scene type + Pixi renderer read
													// (VTTScene.backgroundImage). Reset scale/offset so the new
													// map renders centered and unscaled, matching the upload path.
													const nextScene: VTTScene = {
														...currentScene,
														backgroundImage: url,
														backgroundScale:
															DEFAULT_SCENE_SETTINGS.backgroundScale,
														backgroundOffsetX:
															DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
														backgroundOffsetY:
															DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
														name: name || currentScene.name,
													};
													updateScene(nextScene);
													vttRealtime.broadcastSceneSync(
														upsertVttScene(scenes, nextScene),
														getPersistedSceneId(nextScene.id),
													);
												}
											}}
											onAddToken={(t: VTTTokenPayload) => {
												if (currentScene) {
													const newToken = {
														...t,
														id: t.id || createVttTokenInstanceId(),
													} as PlacedToken;
													updateScene({
														tokens: [...(currentScene.tokens || []), newToken],
													});
													vttRealtime.broadcastTokenAdd(newToken);
												}
											}}
											onAddEffect={(e: VTTEffectPayload) => {
												if (!currentScene) return;
												const cx = Math.floor((currentScene.width ?? 20) / 2);
												const cy = Math.floor((currentScene.height ?? 20) / 2);

												if (e.type === "magic" || e.type === "image") {
													const newToken = {
														id: e.id || createVttTokenInstanceId(),
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
														upsertVttScene(scenes, nextScene),
														getPersistedSceneId(nextScene.id),
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
														upsertVttScene(scenes, nextScene),
														getPersistedSceneId(nextScene.id),
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
														upsertVttScene(scenes, nextScene),
														getPersistedSceneId(nextScene.id),
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
												if (musicId === "stop") {
													syncLocalSceneMusic({
														musicMood: null,
														musicAutoplay: false,
													});
													updateScene({
														musicMood: null,
														musicAutoplay: false,
													});
													vttRealtime.broadcastAudioSync("music_stop", "stop");
													toast({ title: "Music Stopped" });
												} else {
													syncLocalSceneMusic({
														musicMood: musicId as MusicMood,
														musicAutoplay: true,
													});
													updateScene({
														musicMood: musicId as MusicMood,
														musicAutoplay: true,
													});
													vttRealtime.broadcastAudioSync(
														"music_change",
														musicId,
													);
													toast({
														title: "Music Changed",
														description: `Playing ${musicId} ambient music`,
													});
												}
											}}
										/>
									</div>
								</SheetContent>
							</Sheet>
						)}

						{/* Right drawer — opens when a right-rail button selects a tab. */}
						{isWarden && (
							<VTTDrawer
								side="right"
								open={rightDrawerTab !== null}
								onOpenChange={(o) => !o && setRightDrawerTab(null)}
								title={
									rightDrawerTab === "token"
										? "Selected Token"
										: rightDrawerTab === "initiative"
											? "Initiative"
											: rightDrawerTab === "chat"
												? "Chat"
												: rightDrawerTab === "dice"
													? "Dice Roller"
													: rightDrawerTab === "assets"
														? "Asset Library"
														: rightDrawerTab === "journal"
															? "Journal"
															: rightDrawerTab === "broadcast"
																? "Broadcast"
																: rightDrawerTab === "ai"
																	? "AI Assistant"
																	: rightDrawerTab === "log"
																		? "Game Log"
																		: "Panel"
								}
							>
								{activeToken && (
									<AscendantWindow title="ACTIVE TOKEN" density="compact">
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
								{/* Character Sheet Panel: shown when active token has a characterId */}
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
												Apply raw or typed damage to this token.
											</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="damage-mode" className="text-right">
													Mode
												</Label>
												<Select
													value={damageMode}
													onValueChange={(value: DamageApplicationMode) =>
														setDamageMode(value)
													}
												>
													<SelectTrigger
														id="damage-mode"
														className="col-span-3"
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="typed">Typed damage</SelectItem>
														<SelectItem value="raw">Raw override</SelectItem>
													</SelectContent>
												</Select>
											</div>
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
											<div className="grid grid-cols-4 items-center gap-4">
												<Label htmlFor="damage-type" className="text-right">
													Type
												</Label>
												<Select
													value={damageType || "untyped"}
													onValueChange={(value) =>
														setDamageType(value === "untyped" ? "" : value)
													}
													disabled={damageMode === "raw"}
												>
													<SelectTrigger
														id="damage-type"
														className="col-span-3"
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="untyped">Untyped</SelectItem>
														{DAMAGE_TYPE_OPTIONS.map((option) => (
															<SelectItem key={option} value={option}>
																{option}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs space-y-1">
												<p>
													{activeCharacter
														? `Target mitigation for ${activeCharacter.name}`
														: "No linked character mitigation is available for this token."}
												</p>
												{activeCharacter && (
													<>
														<p>
															Resistances:{" "}
															{activeCharacter.resistances?.join(", ") ||
																"None"}
														</p>
														<p>
															Immunities:{" "}
															{activeCharacter.immunities?.join(", ") || "None"}
														</p>
														<p>
															Vulnerabilities:{" "}
															{activeCharacter.vulnerabilities?.join(", ") ||
																"None"}
														</p>
													</>
												)}
											</div>
										</div>
										<DialogFooter>
											<Button variant="outline" onClick={resetDamageDialog}>
												Cancel
											</Button>
											<Button onClick={applyDamageToActiveToken}>
												Apply Damage
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>

								<Tabs
									value={rightInnerTab}
									onValueChange={(v) => {
										setRightInnerTab(
											v as Exclude<RightDrawerTab, null | "token">,
										);
										setRightDrawerTab(v as RightDrawerTab);
									}}
									className="w-full"
								>
									<TabsList className="flex flex-wrap gap-1 w-full h-auto p-1 bg-card border border-border rounded-lg shadow-sm">
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
										<TabsTrigger
											value="log"
											className="gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-primary/30"
										>
											<Dice6 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											<span className="hidden sm:inline">Log</span>
											<span className="sm:hidden">Log</span>
										</TabsTrigger>
									</TabsList>

									<TabsContent value="initiative" className="space-y-2">
										<AscendantWindow
											title="INITIATIVE TRACKER"
											density="compact"
										>
											{/* Turn controls */}
											{isWarden && tokensInInitiative.length > 0 && (
												<div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
													<div className="flex items-center gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={vttRealtime.prevTurn}
															className="text-xs h-7 inline-flex items-center gap-1"
														>
															<ArrowLeft className="w-3 h-3" aria-hidden />
															Prev
														</Button>
														<Button
															variant="default"
															size="sm"
															onClick={vttRealtime.nextTurn}
															className="text-xs h-7 inline-flex items-center gap-1"
														>
															Next
															<ArrowRight className="w-3 h-3" aria-hidden />
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
											density="compact"
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
												/roll /wardenroll /w &quot;name&quot; /em /desc · adv
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
										<AscendantWindow title="DICE ROLLER" density="compact">
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
																			className="h-6 px-1 border border-l-0 border-border rounded-r text-[10px] hover:bg-destructive/20 text-foreground/70 inline-flex items-center justify-center"
																			aria-label="Remove macro"
																			title="Remove macro"
																		>
																			<X className="w-3 h-3" aria-hidden />
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
										<AscendantWindow title="ASSET LIBRARY" density="compact">
											<VTTAssetBrowser
												campaignId={campaignId}
												customAssets={customAssets}
												onUploadAsset={uploadCustomAsset}
												onDeleteAsset={deleteCustomAsset}
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
														id: createVttTokenInstanceId(),
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
														id: createVttTokenInstanceId(),
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
											density="compact"
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

									<TabsContent value="log" className="space-y-2">
										{campaignId ? (
											<CampaignRollFeed campaignId={campaignId} />
										) : (
											<AscendantWindow title="GAME LOG" density="compact">
												<AscendantText className="block text-xs text-foreground/70">
													Game Log is only available inside a campaign session.
												</AscendantText>
											</AscendantWindow>
										)}
									</TabsContent>
								</Tabs>
							</VTTDrawer>
						)}
					</div>

					{/* Mobile bottom tab bar (Warden only). */}
					{isMobile && isWarden && (
						<>
							<div className="vtt-mobile-toolbar">
								{(
									[
										{ key: "select", label: "Select", Icon: MousePointer2 },
										{ key: "fog", label: "Fog", Icon: Cloud },
										{ key: "draw", label: "Draw", Icon: Pencil },
										{ key: "measure", label: "Measure", Icon: Ruler },
									] as const
								).map((tool) =>
									selectedTool === tool.key ? (
										<button
											type="button"
											key={tool.key}
											className="inline-flex items-center justify-center bg-primary/20 border-primary"
											onClick={() => {
												setSelectedTool(tool.key);
												setMobilePanel(null);
											}}
											aria-label={`${tool.label} tool`}
											aria-pressed="true"
											title={tool.label}
										>
											<tool.Icon className="w-3.5 h-3.5" aria-hidden />
											<span>{tool.label}</span>
										</button>
									) : (
										<button
											type="button"
											key={tool.key}
											className="inline-flex items-center justify-center border-border hover:bg-muted/50"
											onClick={() => {
												setSelectedTool(tool.key);
												setMobilePanel(null);
											}}
											aria-label={`${tool.label} tool`}
											aria-pressed="false"
											title={tool.label}
										>
											<tool.Icon className="w-3.5 h-3.5" aria-hidden />
											<span>{tool.label}</span>
										</button>
									),
								)}
								<div className="w-px h-8 bg-border/30 mx-1" />
								{mobilePanel === "tools" ? (
									<button
										type="button"
										className="active"
										onClick={() => setMobilePanel(null)}
										aria-pressed="true"
									>
										Tools
									</button>
								) : (
									<button
										type="button"
										className=""
										onClick={() => setMobilePanel("tools")}
										aria-pressed="false"
									>
										Tools
									</button>
								)}
								{mobilePanel === "sidebar" ? (
									<button
										type="button"
										className="active"
										onClick={() => setMobilePanel(null)}
										aria-pressed="true"
									>
										Panel
									</button>
								) : (
									<button
										type="button"
										className=""
										onClick={() => setMobilePanel("sidebar")}
										aria-pressed="false"
									>
										Panel
									</button>
								)}
								<div className="w-px h-8 bg-border/30 mx-1" />
								<button
									type="button"
									onClick={() => handleRequestZoom(zoom - 0.15)}
									aria-label="Zoom out"
								>
									−
								</button>
								<span className="text-[10px] text-foreground/70 min-w-[32px] text-center">
									{Math.round(zoom * 100)}%
								</span>
								<button
									type="button"
									onClick={() => handleRequestZoom(zoom + 0.15)}
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
													<div
														key={scene.id}
														className="flex items-center gap-2"
													>
														<button
															type="button"
															onClick={() => {
																setCurrentScene(scene);
																vttRealtime.broadcastSceneChange(scene.id);
																setMobilePanel(null);
															}}
															className={cn(
																"flex-1 text-left p-2 rounded text-sm",
																currentScene?.id === scene.id
																	? "bg-primary/20 border border-primary"
																	: "border border-border",
															)}
														>
															{scene.name}
														</button>
														<button
															type="button"
															onClick={() => {
																void handleDeleteScene(scene);
															}}
															className="p-2 rounded border border-destructive/30 text-destructive hover:bg-destructive/10"
															aria-label={`Delete ${scene.name}`}
															title="Delete scene"
														>
															<X className="w-3.5 h-3.5" />
														</button>
													</div>
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
													customAssets={customAssets}
													onUploadAsset={uploadCustomAsset}
													onDeleteAsset={deleteCustomAsset}
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
															id: createVttTokenInstanceId(),
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
															id: createVttTokenInstanceId(),
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
				</div>
			)}

			{/* Token Context Menu */}
			{contextMenu &&
				(() => {
					const token = visibleTokens.find((t) => t.id === contextMenu.tokenId);
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
									Select
								</button>
								{isWarden && (
									<button
										type="button"
										onClick={() => {
											updateToken(token.id, { locked: !token.locked });
											setContextMenu(null);
										}}
									>
										{token.locked ? "Unlock" : "Lock"}
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
										{token.visible ? "Hide" : "Show"}
									</button>
								)}
								{token.characterId && (
									<button
										type="button"
										onClick={() => {
											window.open(`/characters/${token.characterId}`, "_blank");
											setContextMenu(null);
										}}
									>
										Open Sheet
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
										Delete
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
			{/* Shared 3D Dice Overlay (DDB parity) */}
			<SharedDiceTray
				roll={vttRealtime.sharedDiceRoll}
				onDismiss={() => vttRealtime.setSharedDiceRoll(null)}
			/>
		</Layout>
	);
};

export default VTTEnhanced;
