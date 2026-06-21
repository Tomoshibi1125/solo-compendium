import {
	Application,
	Assets,
	Container,
	Graphics,
	Sprite,
	Text,
	Texture,
	Ticker,
} from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { computeVisibilityPolygon, createHexGrid } from "@/lib/vtt";
import {
	clampVttGridOpacity,
	getVttBackgroundTransform,
} from "@/lib/vtt/backgroundTransform";
import {
	buildVttFogRenderRects,
	buildVttVisibleCellSet,
	isVttTokenVisibleThroughFog,
	VTT_WARDEN_HIDDEN_FOG_OPACITY,
} from "@/lib/vtt/fogRects";
import {
	gridDistanceFeet,
	snapWorldToCell,
} from "@/lib/vtt/interactionGeometry";
import { parsePixiColor } from "@/lib/vtt/pixiColor";
import {
	createEffect,
	type EffectInstance,
	type EffectPreset,
} from "@/lib/vtt/pixiEffects";
import {
	createWeatherEmitter,
	type WeatherEmitter,
	type WeatherType,
} from "@/lib/vtt/pixiWeather";
import { getTokenFootprintPx, type TokenSize } from "@/lib/vtt/tokenSizing";
import type { VTTTokenBar } from "@/types/vtt";

type TokenBlendMode =
	| "normal"
	| "multiply"
	| "screen"
	| "overlay"
	| "lighten"
	| "darken"
	| "color-dodge"
	| "plus-lighter";

type PlacedToken = {
	id: string;
	tokenType?: "character" | "Anomaly" | "npc" | "prop" | "effect" | "custom";
	name: string;
	emoji?: string;
	imageUrl?: string;
	color?: string;
	/** DDB-style explicit token border override (overrides owner default). */
	borderColor?: string;
	/** Shared group id used to move multiple tokens as a unit (Shift+G). */
	groupId?: string;
	size: TokenSize;
	/** Foundry-parity per-token grid footprint overrides. */
	gridWidth?: number;
	gridHeight?: number;
	/** Visual image scale that does not affect the grid footprint. */
	imageScale?: number;
	x: number;
	y: number;
	rotation: number;
	layer: number;
	locked: boolean;
	visible: boolean;
	characterId?: string;
	hp?: number;
	hp_current?: number;
	maxHp?: number;
	hp_max?: number;
	bars?: VTTTokenBar[];
	ac?: number;
	armor_class?: number;
	conditions?: string[];
	ownerId?: string;
	barVisibility?: string;
	render?: {
		mode?: "token" | "overlay";
		opacity?: number;
		blendMode?: TokenBlendMode;
	};
	/** Misty Pearl A2 — stratum id the token currently occupies. */
	level?: string;
};

type SceneLike = {
	width: number;
	height: number;
	backgroundImage?: string;
	backgroundScale?: number;
	backgroundOffsetX?: number;
	backgroundOffsetY?: number;
	gridOpacity?: number;
	fogOfWar: boolean;
	fogData?: boolean[][];
	tokenVisionRevealsFog?: boolean;
	/** Misty Pearl B4 polish — per-scene animated tile overlays. */
	animatedTiles?: Array<{
		id: string;
		src: string;
		x: number;
		y: number;
		width: number;
		height: number;
		loop: boolean;
		level?: string;
		opacity?: number;
	}>;
	/** Misty Pearl A2 — stratum metadata (subset used by gating). */
	levels?: Array<{ id: string; wallIds: string[]; lightIds: string[] }>;
};

/** Committed scene drawing (annotations) rendered on the Pixi annotations layer. */
type StageDrawing = {
	id: string;
	type: "freehand" | "line" | "rectangle" | "circle" | "cone" | "text";
	points: Array<{ x: number; y: number }>;
	color: string;
	strokeWidth: number;
	fillColor?: string;
	fillOpacity?: number;
	layer?: string | number;
	kind?: string;
};
/** Live measurement ruler / AoE template (grid coords). */
type StageMeasurement = {
	start: { x: number; y: number };
	end: { x: number; y: number };
	shape: "line" | "circle" | "cone" | "cube";
	radius: number;
	/** Committed ruler vertices before the active segment (line shape only). */
	waypoints?: Array<{ x: number; y: number }>;
};
/** Live wall-authoring drag preview (grid coords). */
type StageWallPreview = { x1: number; y1: number; x2: number; y2: number };

type VttPixiStageProps = {
	containerRef: React.RefObject<HTMLDivElement | null>;
	scene: SceneLike | null;
	tokens: PlacedToken[];
	gridSize: number;
	zoom: number;
	showGrid: boolean;
	isWarden: boolean;
	effectiveVisibleLayers: Record<number, boolean>;
	activeTokenId: string | null;
	activeTokenIds?: string[];
	targetedTokenIds?: string[];
	activeInitiativeTokenId?: string | null;
	currentUserId?: string | null;
	ownedCharacterId?: string | null;
	setActiveTokenId: (id: string | null) => void;
	onTokenPointerSelect?: (tokenId: string, additive: boolean) => void;
	updateToken: (tokenId: string, updates: Partial<PlacedToken>) => void;
	walls?: import("@/lib/vtt").WallSegment[];
	lightSources?: import("@/lib/vtt").LightSource[];
	gridConfig?: { type: "square" | "hex"; size: number };
	onRequestZoom: (nextZoom: number, cursor?: { x: number; y: number }) => void;
	enableViewportPan?: boolean;
	onTokenDragStart?: (tokenId: string) => void;
	onTokenDragEnd?: (tokenId: string) => void;
	drawMode?: "none" | "ruler" | "cone" | "sphere" | "cube" | "wall";
	onWallCreated?: (x1: number, y1: number, x2: number, y2: number) => void;
	weather?: WeatherType | "none";
	/** Committed annotations (drawings), GPU-rendered; DOM is the fallback. */
	drawings?: StageDrawing[];
	/** Live measurement ruler / AoE template; null when not measuring. */
	measurement?: StageMeasurement | null;
	/** Live wall-authoring preview; null when not drawing a wall. */
	wallPreview?: StageWallPreview | null;
	/** Called when the PixiJS stage is ready, exposing the app and effects container for particle effects */
	onStageReady?: (app: Application, effectsContainer: Container) => void;
	/** Called when Pixi fails to initialize after all retry attempts */
	onInitError?: (err: unknown) => void;
	/**
	 * Misty Pearl A2 — active stratum id. When set, tokens whose `level`
	 * differs render at reduced opacity so the Warden can focus on one
	 * floor at a time. Null = single-stratum / no gating (back-compat).
	 */
	activeStratumId?: string | null;
};

const blendModeToPixi = (mode?: TokenBlendMode) => mode ?? "normal";

const hexToPixiColor = (color: string, fallback = 0x22c55e) =>
	parsePixiColor(color, fallback);

const isAdditivePointerSelection = (event: {
	shiftKey?: boolean;
	ctrlKey?: boolean;
	metaKey?: boolean;
}) => Boolean(event.shiftKey || event.ctrlKey || event.metaKey);

type PixiRendererStatus =
	| "waiting-for-layout"
	| "initializing"
	| "ready"
	| "failed"
	| "layout-timeout"
	| "context-lost"
	| "render-error";

const VTT_MAX_RENDER_RESOLUTION = 1.5;
const VTT_INIT_STABLE_FRAME_COUNT = 2;
const VTT_INIT_MAX_LAYOUT_FRAMES = 12;
// Wall-clock budget before a never-sized map container surfaces a diagnostic
// and hands off to the DOM fallback. Normal layouts report a usable size within
// a frame or two, so this only fires for genuinely collapsed/hidden layouts.
const VTT_LAYOUT_TIMEOUT_MS = 4000;

const formatPixiError = (err: unknown) =>
	err instanceof Error
		? err.message
		: typeof err === "string"
			? err
			: "Unknown Pixi error";

const waitForAnimationFrame = () =>
	new Promise<void>((resolve) => {
		window.requestAnimationFrame(() => resolve());
	});

const measureViewport = (container: HTMLElement | null) => ({
	width: Math.max(0, Math.floor(container?.clientWidth ?? 0)),
	height: Math.max(0, Math.floor(container?.clientHeight ?? 0)),
});

/**
 * Probe a throwaway WebGL context once to learn (a) whether WebGL is available
 * at all and (b) the GPU's max texture size. Cached per page load so we never
 * create throwaway contexts repeatedly. When WebGL is unavailable the init
 * routine short-circuits its retry ladder and hands off to the DOM fallback
 * immediately instead of thrashing the GPU five times.
 */
const probeWebGL = (): { available: boolean; maxTextureSize: number } => {
	try {
		const c = document.createElement("canvas");
		const gl = c.getContext("webgl2") ?? c.getContext("webgl");
		if (gl) {
			const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
			// Lose the context immediately so we don't hog a GPU slot.
			gl.getExtension("WEBGL_lose_context")?.loseContext();
			return {
				available: true,
				maxTextureSize: typeof max === "number" && max > 0 ? max : 4096,
			};
		}
	} catch {
		// Swallow — fall through to safe default.
	}
	return { available: false, maxTextureSize: 4096 };
};

const GPU_PROBE = probeWebGL();
const GPU_MAX_TEXTURE = GPU_PROBE.maxTextureSize;

const scaleWallsForPixiVisibility = (
	walls: import("@/lib/vtt").WallSegment[],
	step: number,
) =>
	walls.map((wall) => ({
		...wall,
		x1: wall.x1 * step,
		y1: wall.y1 * step,
		x2: wall.x2 * step,
		y2: wall.y2 * step,
	}));

type StageLayers = {
	world: Container;
	bg: Container;
	weatherLayer: Container;
	lightingLayer: Container;
	effectsLayer: Container;
	gridLayer: Container;
	wallsLayer: Container;
	tokenLayer: Container;
	nameplateLayer: Container;
	annotationsLayer: Container;
	snapGhostLayer: Container;
	handleLayer: Container;
	fogLayer: Container;
};

export function VttPixiStage({
	containerRef,
	scene,
	tokens,
	gridSize,
	zoom,
	showGrid,
	isWarden,
	effectiveVisibleLayers,
	activeTokenId = null,
	activeTokenIds = [],
	targetedTokenIds = [],
	activeInitiativeTokenId = null,
	currentUserId = null,
	ownedCharacterId = null,
	setActiveTokenId,
	onTokenPointerSelect,
	updateToken,
	walls = [],
	lightSources = [],
	gridConfig = { type: "square", size: gridSize },
	onRequestZoom,
	enableViewportPan = true,
	onTokenDragStart,
	onTokenDragEnd,
	drawMode = "none",
	onWallCreated,
	weather = "none",
	drawings,
	measurement,
	wallPreview,
	onStageReady,
	onInitError,
	activeStratumId = null,
}: VttPixiStageProps) {
	const canvasHostRef = useRef<HTMLElement | null>(null);
	const appRef = useRef<Application | null>(null);
	const { dpr, fx } = usePerformanceProfile();
	const [rendererStatus, setRendererStatus] =
		useState<PixiRendererStatus>("waiting-for-layout");
	const [rendererError, setRendererError] = useState<string | null>(null);
	// Tracks whether the Pixi Application has finished its async init.
	// The render effect depends on this so it re-fires once the app is ready.
	const [appReady, setAppReady] = useState(false);

	const longPressRef = useRef<{
		tokenId: string;
		timer: number;
		pointerId: number;
	} | null>(null);
	const stageLayersRef = useRef<StageLayers | null>(null);
	const tickerRef = useRef<Ticker | null>(null);

	const worldSize = useMemo(() => {
		const w = (scene?.width ?? 0) * gridSize * zoom;
		const h = (scene?.height ?? 0) * gridSize * zoom;
		return { w, h };
	}, [gridSize, zoom, scene?.height, scene?.width]);
	const fogVisibleCells = useMemo(() => {
		if (!scene?.fogOfWar || !scene.tokenVisionRevealsFog || isWarden)
			return null;
		return buildVttVisibleCellSet(
			{
				width: scene.width,
				height: scene.height,
				gridSize,
				fogOfWar: scene.fogOfWar,
				tokenVisionRevealsFog: scene.tokenVisionRevealsFog,
				fogData: scene.fogData,
				walls,
			},
			tokens,
			{
				currentUserId,
				ownedCharacterId,
				activeTokenId,
			},
		);
	}, [
		activeTokenId,
		currentUserId,
		gridSize,
		isWarden,
		ownedCharacterId,
		scene?.fogData,
		scene?.fogOfWar,
		scene?.height,
		scene?.tokenVisionRevealsFog,
		scene?.width,
		tokens,
		walls,
	]);
	const worldSizeRef = useRef(worldSize);

	useEffect(() => {
		worldSizeRef.current = worldSize;
	}, [worldSize]);

	useEffect(() => {
		activeTokenIdsRef.current = activeTokenIds;
	}, [activeTokenIds]);

	// Token drag state. We move the dragged sprite(s) in pixel space during the
	// gesture and commit a single snapped grid position per token on drop (DDB/
	// Roll20 feel) instead of mutating scene state on every pointermove.
	const dragStateRef = useRef<{
		pointerId: number;
		primaryTokenId: string;
		originGX: number;
		originGY: number;
		memberIds: string[];
		startPointerX: number | null;
		startPointerY: number | null;
		memberStart: Map<string, { x: number; y: number }> | null;
	} | null>(null);
	// Token rotate-handle gesture: drag the knob above a single selected token to
	// spin it; commit one updateToken({rotation}) on release (Shift snaps to 15°).
	const rotateStateRef = useRef<{
		pointerId: number;
		tokenId: string;
		centerX: number;
		centerY: number;
		group: Container;
	} | null>(null);
	// Live map of tokenId → its Pixi container, repopulated on every token
	// render so the drag handlers can move/snap the right sprites across
	// rebuilds (e.g. the selection rebuild that fires at drag start).
	const tokenContainersRef = useRef<Map<string, Container>>(new Map());
	// Reconciliation cache: tokenId → its persistent container + nameplate +
	// a signature of every visual input. Unchanged tokens are skipped entirely;
	// changed tokens are rebuilt in place (container/nameplate reused) so a
	// single move/selection no longer rebuilds the whole token layer.
	const tokenRenderCacheRef = useRef<
		Map<
			string,
			{ container: Container; nameplate: Text | null; signature: string }
		>
	>(new Map());
	// Current token data by id, read by the once-attached pointer handlers so
	// they always act on live position/lock state across reconciles.
	const tokensByIdRef = useRef<Map<string, PlacedToken>>(new Map());
	// Latest token interaction callbacks, read by the once-attached pointer
	// handlers so reused containers never call a stale closure.
	const tokenInteractionRef = useRef({
		onTokenPointerSelect,
		setActiveTokenId,
		onTokenDragStart,
		updateToken,
		isWarden,
		currentUserId,
	});
	// Latest multi-selection, read by the (stable) pointer handlers via a ref so
	// they don't need to re-bind whenever the selection changes.
	const activeTokenIdsRef = useRef<string[]>(activeTokenIds);
	// Per-light visibility-polygon memo (keyed on walls + light + step) so static
	// re-renders that don't touch walls/lights skip the expensive recompute.
	const lightPolygonCacheRef = useRef<
		Map<
			string,
			{ key: string; polygon: ReturnType<typeof computeVisibilityPolygon> }
		>
	>(new Map());
	const scrollDragRef = useRef<{
		pointerId: number;
		startX: number;
		startY: number;
		startLeft: number;
		startTop: number;
	} | null>(null);
	const pointersRef = useRef<Map<number, PointerEvent>>(new Map());
	const pinchRef = useRef<{
		aId: number;
		bId: number;
		startDist: number;
		startZoom: number;
		centerClientX: number;
		centerClientY: number;
	} | null>(null);

	// Drawing state
	const drawingRef = useRef<{
		startX: number;
		startY: number;
		currentX: number;
		currentY: number;
		active: boolean;
	} | null>(null);
	const drawingGraphicsRef = useRef<Graphics | null>(null);

	// Weather state
	const weatherEmitterRef = useRef<WeatherEmitter | null>(null);
	// Active one-shot FX bursts + a shared particle texture, driven by the ticker.
	const activeEffectsRef = useRef<EffectInstance[]>([]);
	const effectTextureRef = useRef<Texture | null>(null);
	const worldContainerRef = useRef<Container | null>(null);
	// Cleanup for the WebGL context-loss listener attached after a successful
	// init. Held in a ref so the init effect's cleanup closure can detach it.
	const contextLossCleanupRef = useRef<(() => void) | null>(null);
	// Snap-to-grid ghost overlay shown while dragging a token. Populated by
	// the stage-init effect and consumed by pointer handlers in a separate
	// effect, so we share it via a ref rather than nested closure scope.
	const snapGhostLayerRef = useRef<Container | null>(null);
	const handleLayerRef = useRef<Container | null>(null);
	const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

	const syncWorldTransform = useCallback(() => {
		const world = worldContainerRef.current;
		if (!world) return;
		const container = containerRef.current;
		world.position.set(
			-(container?.scrollLeft ?? 0),
			-(container?.scrollTop ?? 0),
		);
	}, [containerRef]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateViewportSize = () => {
			const { width: nextWidth, height: nextHeight } =
				measureViewport(container);
			setViewportSize((prev) =>
				prev.width === nextWidth && prev.height === nextHeight
					? prev
					: { width: nextWidth, height: nextHeight },
			);
		};

		updateViewportSize();
		let frame = 0;
		let attempts = 0;
		const retryUntilSized = () => {
			if (attempts >= VTT_INIT_MAX_LAYOUT_FRAMES) return;
			attempts += 1;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				updateViewportSize();
				const next = measureViewport(container);
				if (next.width <= 0 || next.height <= 0) {
					retryUntilSized();
				}
			});
		};
		if (container.clientWidth <= 0 || container.clientHeight <= 0) {
			retryUntilSized();
		}

		if (typeof ResizeObserver === "undefined") {
			window.addEventListener("resize", updateViewportSize);
			return () => {
				if (frame !== 0) {
					window.cancelAnimationFrame(frame);
				}
				window.removeEventListener("resize", updateViewportSize);
			};
		}

		const observer = new ResizeObserver(() => {
			updateViewportSize();
		});
		observer.observe(container);
		return () => {
			if (frame !== 0) {
				window.cancelAnimationFrame(frame);
			}
			observer.disconnect();
		};
	}, [containerRef]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let frame = 0;
		const handleScroll = () => {
			if (frame !== 0) return;
			frame = window.requestAnimationFrame(() => {
				frame = 0;
				syncWorldTransform();
			});
		};

		handleScroll();
		container.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			if (frame !== 0) {
				window.cancelAnimationFrame(frame);
			}
			container.removeEventListener("scroll", handleScroll);
		};
	}, [containerRef, syncWorldTransform]);

	const viewportReady = viewportSize.width > 0 && viewportSize.height > 0;

	useEffect(() => {
		if (!canvasHostRef.current) return;
		if (appRef.current) return;
		if (!viewportReady) {
			setRendererStatus("waiting-for-layout");
			return;
		}

		let destroyed = false;

		(async () => {
			setRendererStatus("initializing");
			setRendererError(null);
			let stableFrames = 0;
			let measured = measureViewport(containerRef.current);
			for (let i = 0; i < VTT_INIT_MAX_LAYOUT_FRAMES; i++) {
				if (destroyed) return;
				await waitForAnimationFrame();
				const next = measureViewport(containerRef.current);
				if (next.width <= 0 || next.height <= 0) {
					stableFrames = 0;
					measured = next;
					continue;
				}
				const isStable =
					Math.abs(next.width - measured.width) <= 1 &&
					Math.abs(next.height - measured.height) <= 1;
				stableFrames = isStable ? stableFrames + 1 : 0;
				measured = next;
				if (stableFrames >= VTT_INIT_STABLE_FRAME_COUNT) break;
			}
			if (destroyed) return;
			if (measured.width <= 0 || measured.height <= 0) {
				setRendererStatus("waiting-for-layout");
				return;
			}

			const canvasW = Math.max(1, measured.width);
			const canvasH = Math.max(1, measured.height);
			const desiredRes = Math.min(
				window.devicePixelRatio || 1,
				dpr[1],
				VTT_MAX_RENDER_RESOLUTION,
			);
			const maxDim = Math.max(canvasW, canvasH);
			const safeResolution =
				maxDim * desiredRes > GPU_MAX_TEXTURE
					? Math.max(0.5, Math.floor((GPU_MAX_TEXTURE / maxDim) * 100) / 100)
					: desiredRes;

			// Attempt init with progressively safer settings on failure. We vary
			// powerPreference across attempts because some GPUs/drivers refuse a
			// "high-performance" context but grant "low-power" (hybrid-GPU
			// laptops, remote desktop, certain driver configs) — the previous
			// ladder only varied resolution, so it could never recover from that.
			// Pixi's GpuPowerPreference is "high-performance" | "low-power".
			const attempts: Array<{
				resolution: number;
				width: number;
				height: number;
				antialias: boolean;
				powerPreference: "high-performance" | "low-power";
			}> = [
				{
					resolution: safeResolution,
					width: canvasW,
					height: canvasH,
					antialias: false,
					powerPreference: "high-performance",
				},
				{
					resolution: safeResolution,
					width: canvasW,
					height: canvasH,
					antialias: false,
					powerPreference: "low-power",
				},
				{
					resolution: 1,
					width: canvasW,
					height: canvasH,
					antialias: false,
					powerPreference: "high-performance",
				},
				{
					resolution: 1,
					width: canvasW,
					height: canvasH,
					antialias: false,
					powerPreference: "low-power",
				},
				{
					resolution: 0.75,
					width: Math.ceil(canvasW / 2),
					height: Math.ceil(canvasH / 2),
					antialias: false,
					powerPreference: "low-power",
				},
			];
			// When the preflight probe reports no WebGL, try once then fall back
			// fast rather than thrashing the GPU through all five attempts.
			const initAttempts = GPU_PROBE.available
				? attempts
				: attempts.slice(0, 1);

			let app: Application | null = null;
			let lastError: unknown = null;

			for (let i = 0; i < initAttempts.length; i++) {
				if (destroyed) return;
				const cfg = initAttempts[i];
				const candidate = new Application();
				try {
					await candidate.init({
						backgroundAlpha: 0,
						antialias: cfg.antialias,
						resolution: cfg.resolution,
						autoDensity: true,
						width: cfg.width,
						height: cfg.height,
						preference: "webgl",
						powerPreference: cfg.powerPreference,
					});
					app = candidate;
					if (i > 0) {
						console.warn(
							`[VTT Pixi] Initialized on attempt ${i + 1} (resolution=${cfg.resolution}, size=${cfg.width}×${cfg.height}, power=${cfg.powerPreference})`,
						);
					}
					break;
				} catch (err) {
					lastError = err;
					console.error(
						`[VTT Pixi] Init attempt ${i + 1}/${initAttempts.length} failed:`,
						err,
						{ ...cfg },
					);
					try {
						candidate.destroy(true);
					} catch {
						// ignore cleanup errors
					}
				}
			}

			if (!app) {
				const webglNote = GPU_PROBE.available
					? ""
					: " (WebGL unavailable in this browser/GPU)";
				const message = `Pixi init failed after all retries${webglNote}: ${formatPixiError(lastError)}`;
				setRendererStatus("failed");
				setRendererError(message);
				console.error(
					"[VTT Pixi] All init attempts failed. webglAvailable =",
					GPU_PROBE.available,
					"GPU_MAX_TEXTURE =",
					GPU_MAX_TEXTURE,
					"viewport =",
					canvasW,
					"×",
					canvasH,
					"world =",
					Math.max(1, Math.floor(worldSizeRef.current.w)),
					"×",
					Math.max(1, Math.floor(worldSizeRef.current.h)),
					"canvas =",
					canvasW,
					"×",
					canvasH,
				);
				onInitError?.(new Error(message));
				return;
			}

			if (destroyed) {
				try {
					app.destroy(true);
				} catch {
					// ignore
				}
				return;
			}

			app.canvas.style.display = "block";
			app.canvas.style.width = "100%";
			app.canvas.style.height = "100%";
			app.canvas.style.touchAction = "none";

			// Surface a lost WebGL context (driver reset, GPU eviction, too many
			// live contexts) as a diagnostic and hand off to the DOM fallback;
			// the consumer's retry remounts a fresh Application.
			const readyApp = app;
			const handleContextLost = (event: Event) => {
				event.preventDefault();
				if (destroyed) return;
				console.warn("[VTT Pixi] WebGL context lost.");
				setRendererStatus("context-lost");
				setRendererError("WebGL context lost — switching to fallback.");
				onInitError?.(new Error("context-lost: WebGL context was lost."));
			};
			readyApp.canvas.addEventListener(
				"webglcontextlost",
				handleContextLost as EventListener,
				false,
			);
			contextLossCleanupRef.current = () => {
				readyApp.canvas.removeEventListener(
					"webglcontextlost",
					handleContextLost as EventListener,
				);
			};

			canvasHostRef.current?.appendChild(app.canvas);
			if (canvasHostRef.current) {
				canvasHostRef.current.dataset.rendererWidth = String(canvasW);
				canvasHostRef.current.dataset.rendererHeight = String(canvasH);
			}
			// Only set the ref AFTER successful init so the guard at the
			// top of this effect doesn't block future re-init if init had
			// previously failed.
			appRef.current = app;
			// Signal that the app is ready so the render effect can run.
			setRendererStatus("ready");
			setAppReady(true);
		})();

		return () => {
			destroyed = true;
			contextLossCleanupRef.current?.();
			contextLossCleanupRef.current = null;
			if (appRef.current) {
				try {
					appRef.current.destroy(true);
				} catch {
					// ignore
				}
				appRef.current = null;
			}
			setAppReady(false);
			setRendererStatus("waiting-for-layout");
		};
	}, [containerRef, dpr[1], onInitError, viewportReady]);

	// Layout-timeout watchdog: a never-sized map container would otherwise leave
	// the renderer stuck on "waiting-for-layout" forever (blank map, no
	// fallback, no diagnostic). Normal layouts flip viewportReady within a frame
	// or two, which clears this before it can fire.
	useEffect(() => {
		if (viewportReady || appReady) return;
		if (rendererStatus === "failed" || rendererStatus === "layout-timeout") {
			return;
		}
		const timer = window.setTimeout(() => {
			// Re-measure to avoid acting on stale state (e.g. layout that landed
			// in the same tick the timer fired).
			const measured = measureViewport(containerRef.current);
			if (appRef.current || (measured.width > 0 && measured.height > 0)) {
				return;
			}
			const message =
				"Map area never reported a usable size; switched to the DOM fallback.";
			setRendererStatus("layout-timeout");
			setRendererError(message);
			onInitError?.(new Error(`layout-timeout: ${message}`));
		}, VTT_LAYOUT_TIMEOUT_MS);
		return () => window.clearTimeout(timer);
	}, [appReady, containerRef, onInitError, rendererStatus, viewportReady]);

	useEffect(() => {
		const app = appRef.current;
		if (!app?.renderer) return;
		if (viewportSize.width <= 0 || viewportSize.height <= 0) return;
		try {
			app.renderer.resize(
				Math.max(1, Math.floor(viewportSize.width)),
				Math.max(1, Math.floor(viewportSize.height)),
			);
		} catch (err) {
			const message = `Pixi resize failed: ${formatPixiError(err)}`;
			setRendererStatus("failed");
			setRendererError(message);
			onInitError?.(new Error(message));
			return;
		}
		if (canvasHostRef.current) {
			canvasHostRef.current.dataset.rendererWidth = String(
				Math.max(1, Math.floor(viewportSize.width)),
			);
			canvasHostRef.current.dataset.rendererHeight = String(
				Math.max(1, Math.floor(viewportSize.height)),
			);
		}
	}, [onInitError, viewportSize.height, viewportSize.width]);

	useEffect(() => {
		const app = appRef.current;
		if (!app || !appReady) return;

		const stage = app.stage;
		stage.removeChildren();

		const world = new Container();
		const bg = new Container();
		const weatherLayer = new Container();
		const lightingLayer = new Container();
		const effectsLayer = new Container();
		const gridLayer = new Container();
		const wallsLayer = new Container();
		const tokenLayer = new Container();
		const nameplateLayer = new Container();
		const annotationsLayer = new Container();
		const snapGhostLayer = new Container();
		const handleLayer = new Container();
		const fogLayer = new Container();
		if (!drawingGraphicsRef.current) {
			drawingGraphicsRef.current = new Graphics();
		}
		const drawOverlay = drawingGraphicsRef.current;
		drawOverlay.clear();
		drawOverlay.zIndex = 1000;

		worldContainerRef.current = world;
		snapGhostLayerRef.current = snapGhostLayer;
		handleLayerRef.current = handleLayer;
		stageLayersRef.current = {
			world,
			bg,
			weatherLayer,
			lightingLayer,
			effectsLayer,
			gridLayer,
			wallsLayer,
			tokenLayer,
			nameplateLayer,
			annotationsLayer,
			snapGhostLayer,
			handleLayer,
			fogLayer,
		};

		stage.addChild(world);
		world.addChild(bg);
		world.addChild(weatherLayer);
		world.addChild(lightingLayer);
		world.addChild(effectsLayer);
		world.addChild(gridLayer);
		world.addChild(wallsLayer);
		world.addChild(tokenLayer);
		world.addChild(snapGhostLayer);
		world.addChild(handleLayer);
		world.addChild(nameplateLayer);
		world.addChild(fogLayer);
		world.addChild(annotationsLayer);
		world.addChild(drawOverlay);
		syncWorldTransform();

		onStageReady?.(app, effectsLayer);

		const ticker = new Ticker();
		ticker.add((tick) => {
			const emitter = weatherEmitterRef.current;
			if (emitter) {
				try {
					emitter.update(tick.deltaMS);
				} catch (err) {
					// Never let a per-frame weather glitch break the ticker/app.
					console.error("[VTT Pixi] Weather update failed; disabling.", err);
					emitter.destroy();
					weatherEmitterRef.current = null;
				}
			}
			// Advance + retire one-shot effects.
			const effects = activeEffectsRef.current;
			for (let i = effects.length - 1; i >= 0; i--) {
				let alive = false;
				try {
					alive = effects[i].update(tick.deltaMS);
				} catch (err) {
					console.error("[VTT Pixi] Effect update failed; removing.", err);
				}
				if (!alive) {
					effects[i].destroy();
					effects.splice(i, 1);
				}
			}
		});
		ticker.start();
		tickerRef.current = ticker;

		return () => {
			if (tickerRef.current === ticker) {
				ticker.stop();
				ticker.destroy();
				tickerRef.current = null;
			}
			if (weatherEmitterRef.current) {
				weatherEmitterRef.current.destroy();
				weatherEmitterRef.current = null;
			}
			for (const effect of activeEffectsRef.current) effect.destroy();
			activeEffectsRef.current = [];
			effectTextureRef.current?.destroy(true);
			effectTextureRef.current = null;
			drawOverlay.clear();
			stage.removeChildren();
			stageLayersRef.current = null;
			worldContainerRef.current = null;
			snapGhostLayerRef.current = null;
			// The layers (and their token containers/nameplates) were just torn
			// down — drop the reconciliation cache so a re-init rebuilds cleanly.
			tokenRenderCacheRef.current.clear();
			tokenContainersRef.current.clear();
			tokensByIdRef.current.clear();
			lightPolygonCacheRef.current.clear();
		};
	}, [appReady, onStageReady, syncWorldTransform]);

	useEffect(() => {
		const app = appRef.current;
		const layers = stageLayersRef.current;
		if (!app || !appReady || !layers) return;

		const {
			bg,
			weatherLayer,
			lightingLayer,
			gridLayer: grid,
			wallsLayer,
			fogLayer: fog,
		} = layers;

		let renderActive = true;
		if (canvasHostRef.current) {
			delete canvasHostRef.current.dataset.bgLoaded;
		}

		const renderBackground = async () => {
			bg.removeChildren();
			if (!scene?.backgroundImage || !effectiveVisibleLayers[0]) return;
			const backgroundTransform = getVttBackgroundTransform({
				sceneWidth: scene.width ?? 0,
				sceneHeight: scene.height ?? 0,
				gridSize,
				zoom,
				backgroundScale: scene.backgroundScale,
				backgroundOffsetX: scene.backgroundOffsetX,
				backgroundOffsetY: scene.backgroundOffsetY,
			});
			// Misty Pearl B4 — animated / video background branch.
			// Pixi v8 accepts a `<video>` element as a texture source.
			const isVideo = /\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(
				scene.backgroundImage,
			);
			try {
				if (isVideo) {
					const video = document.createElement("video");
					video.src = scene.backgroundImage;
					video.loop = true;
					video.muted = true;
					video.playsInline = true;
					video.autoplay = true;
					video.crossOrigin = "anonymous";
					// Browser autoplay policies require muted + a user gesture.
					// We're already muted; play() may still reject — we swallow.
					video.play().catch(() => {});
					await new Promise<void>((resolve) => {
						const onLoaded = () => {
							video.removeEventListener("loadeddata", onLoaded);
							resolve();
						};
						video.addEventListener("loadeddata", onLoaded);
						// Safety timeout: don't hang the renderer if metadata stalls.
						window.setTimeout(resolve, 4000);
					});
					if (!renderActive) return;
					const videoTexture = Texture.from(video);
					const sprite = Sprite.from(videoTexture);
					sprite.x = backgroundTransform.offsetXPx;
					sprite.y = backgroundTransform.offsetYPx;
					sprite.width = backgroundTransform.imageWidthPx;
					sprite.height = backgroundTransform.imageHeightPx;
					sprite.alpha = 0.95;
					bg.addChild(sprite);
					if (canvasHostRef.current) {
						canvasHostRef.current.dataset.bgLoaded = "video";
					}
					return;
				}
				const texture = await Assets.load(scene.backgroundImage);
				if (!renderActive) return;
				const sprite = Sprite.from(texture as never);
				sprite.x = backgroundTransform.offsetXPx;
				sprite.y = backgroundTransform.offsetYPx;
				sprite.width = backgroundTransform.imageWidthPx;
				sprite.height = backgroundTransform.imageHeightPx;
				sprite.alpha = 0.95;
				bg.addChild(sprite);
				if (canvasHostRef.current) {
					canvasHostRef.current.dataset.bgLoaded = "true";
				}
			} catch (err) {
				console.warn("[VTT] Failed to load background image:", err);
			}
		};

		// Misty Pearl B4 polish — animated tile overlays. Sit above the
		// background but below tokens. Per-stratum alpha gating mirrors
		// the wall/light/token logic in A2.
		const renderAnimatedTiles = async () => {
			const tiles = scene?.animatedTiles ?? [];
			if (tiles.length === 0) return;
			for (const tile of tiles) {
				const isVideo = /\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(tile.src);
				try {
					let texture: unknown;
					if (isVideo) {
						const video = document.createElement("video");
						video.src = tile.src;
						video.loop = tile.loop;
						video.muted = true;
						video.playsInline = true;
						video.autoplay = true;
						video.crossOrigin = "anonymous";
						video.play().catch(() => {});
						await new Promise<void>((resolve) => {
							const onLoaded = () => {
								video.removeEventListener("loadeddata", onLoaded);
								resolve();
							};
							video.addEventListener("loadeddata", onLoaded);
							window.setTimeout(resolve, 4000);
						});
						if (!renderActive) return;
						texture = Texture.from(video);
					} else {
						texture = await Assets.load(tile.src);
						if (!renderActive) return;
					}
					const sprite = Sprite.from(texture as never);
					sprite.x = tile.x * zoom;
					sprite.y = tile.y * zoom;
					sprite.width = tile.width * zoom;
					sprite.height = tile.height * zoom;
					const stratumDim =
						tile.level && activeStratumId && tile.level !== activeStratumId
							? 0.25
							: 1;
					sprite.alpha = (tile.opacity ?? 1) * stratumDim;
					bg.addChild(sprite);
				} catch (err) {
					console.warn("[VTT] Failed to load animated tile:", err);
				}
			}
		};

		const renderWeather = () => {
			if (weatherEmitterRef.current) {
				weatherEmitterRef.current.destroy();
				weatherEmitterRef.current = null;
			}
			weatherLayer.removeChildren();

			if (!weather || weather === "none" || weather === "clear") return;
			if (!app.renderer) return;

			const width = (scene?.width || 100) * gridSize * zoom;
			const height = (scene?.height || 100) * gridSize * zoom;

			// Shared 8px white circle texture; the emitter tints it per particle.
			const particleGraphic = new Graphics();
			particleGraphic.circle(0, 0, 4);
			particleGraphic.fill(0xffffff);
			const texture = app.renderer.generateTexture(particleGraphic);
			particleGraphic.destroy();

			weatherEmitterRef.current = createWeatherEmitter(weatherLayer, {
				type: weather,
				width,
				height,
				texture,
				particleCount: fx.particleCount,
			});
		};

		const renderGrid = () => {
			grid.removeChildren();
			const gridOpacity = clampVttGridOpacity(scene?.gridOpacity);
			if (!showGrid || gridOpacity <= 0) return;

			const g = new Graphics();
			const color = 0xffffff;
			const step = gridSize * zoom;
			const width = (scene?.width ?? 0) * step;
			const height = (scene?.height ?? 0) * step;

			if (gridConfig?.type === "hex") {
				const { grid: hexGridObj } = createHexGrid({
					orientation: "flat",
					size: step / Math.sqrt(3), // size is the radius. For pointy/flat logic to fit width
					cols: scene?.width ?? 20,
					rows: scene?.height ?? 20,
					originX: 0,
					originY: 0,
				});

				hexGridObj.forEach(
					(hex: { corners: Array<{ x: number; y: number }> }) => {
						const corners = hex.corners;
						if (corners && corners.length >= 6) {
							g.moveTo(corners[0].x, corners[0].y);
							for (let i = 1; i < corners.length; i++) {
								g.lineTo(corners[i].x, corners[i].y);
							}
							g.closePath();
						}
					},
				);
			} else {
				for (let x = 0; x <= width; x += step) {
					g.moveTo(x, 0);
					g.lineTo(x, height);
				}
				for (let y = 0; y <= height; y += step) {
					g.moveTo(0, y);
					g.lineTo(width, y);
				}
			}
			g.stroke({ width: 1, color, alpha: gridOpacity });
			grid.addChild(g);
		};

		const renderWalls = () => {
			wallsLayer.removeChildren();
			if (!walls || walls.length === 0) return;

			const wallColor = isWarden ? 0xef4444 : 0x000000;
			const baseAlpha = isWarden ? 0.8 : 0.3;
			const dimAlpha = baseAlpha * 0.25;

			// Misty Pearl A2 — split walls into active-stratum / inactive-
			// stratum buckets so off-floor walls render dimmed. Falls back
			// to a single graphics blob for legacy single-stratum scenes.
			const levels = (
				scene as { levels?: Array<{ id: string; wallIds: string[] }> }
			)?.levels;
			const wallStratum = new Map<string, string>();
			if (levels && levels.length > 0 && activeStratumId) {
				for (const level of levels) {
					for (const wallId of level.wallIds) {
						wallStratum.set(wallId, level.id);
					}
				}
			}

			const drawBucket = (bucket: typeof walls, alpha: number) => {
				if (bucket.length === 0) return;
				const wg = new Graphics();
				for (const wall of bucket) {
					wg.moveTo(wall.x1 * gridSize * zoom, wall.y1 * gridSize * zoom);
					wg.lineTo(wall.x2 * gridSize * zoom, wall.y2 * gridSize * zoom);
				}
				wg.stroke({
					width: 4,
					color: wallColor,
					alpha,
					join: "miter",
					cap: "square",
				});
				wallsLayer.addChild(wg);
			};

			if (wallStratum.size === 0) {
				drawBucket(walls, baseAlpha);
				return;
			}
			const active: typeof walls = [];
			const inactive: typeof walls = [];
			for (const wall of walls) {
				const stratum = wallStratum.get(wall.id);
				if (stratum && stratum !== activeStratumId) inactive.push(wall);
				else active.push(wall);
			}
			drawBucket(inactive, dimAlpha);
			drawBucket(active, baseAlpha);
		};

		const renderFog = () => {
			fog.removeChildren();
			if (!scene?.fogOfWar) return;
			const step = gridSize * zoom;
			const fogRects = buildVttFogRenderRects({
				scene: {
					width: scene.width,
					height: scene.height,
					gridSize,
					fogOfWar: scene.fogOfWar,
					tokenVisionRevealsFog: isWarden ? false : scene.tokenVisionRevealsFog,
					fogData: scene.fogData,
				},
				visibleCells: isWarden ? null : fogVisibleCells,
				showExploredMemory: !isWarden,
			});
			if (fogRects.length > 0) {
				// Batch every fog cell into one Graphics (one draw object instead
				// of N) — each fill applies to the rect declared just before it.
				const fg = new Graphics();
				for (const rect of fogRects) {
					fg.rect(
						rect.rx * step,
						rect.ry * step,
						rect.width * step,
						rect.height * step,
					);
					fg.fill({
						color: rect.state === "hidden" ? 0x000000 : 0x1a1510,
						alpha: isWarden ? VTT_WARDEN_HIDDEN_FOG_OPACITY : rect.opacity,
					});
				}
				fog.addChild(fg);
			}
		};

		const renderLighting = async () => {
			lightingLayer.removeChildren();
			if (lightSources.length === 0) return;
			const lightLayer = new Container();
			lightLayer.blendMode = "add";
			const step = gridSize * zoom;
			const visibilityWalls = scaleWallsForPixiVisibility(walls, step);
			// Memo key shared by all lights this pass — walls + step define the
			// visibility geometry; per-light position/radius is appended below.
			const wallsKey = `${step}|${JSON.stringify(walls)}`;

			// Misty Pearl A2 — per-stratum gating for lights.
			const levels = (
				scene as { levels?: Array<{ id: string; lightIds: string[] }> }
			)?.levels;
			const lightStratum = new Map<string, string>();
			if (levels && levels.length > 0 && activeStratumId) {
				for (const level of levels) {
					for (const lightId of level.lightIds) {
						lightStratum.set(lightId, level.id);
					}
				}
			}

			for (const light of lightSources) {
				const cx = (light.x + 0.5) * step;
				const cy = (light.y + 0.5) * step;
				const rBright = light.brightRadius * step;
				const rDim = light.dimRadius * step;
				const stratum = lightStratum.get(light.id);
				const stratumAlpha =
					stratum && activeStratumId && stratum !== activeStratumId ? 0.25 : 1;

				const vision = {
					tokenId: light.id,
					x: light.x,
					y: light.y,
					visionRange: Math.max(light.brightRadius, light.dimRadius),
					darkvisionRange: 0,
					blindsightRange: 0,
				};
				const polyKey = `${wallsKey}|${light.x},${light.y},${light.brightRadius},${light.dimRadius}`;
				const cachedPoly = lightPolygonCacheRef.current.get(light.id);
				let polygon: ReturnType<typeof computeVisibilityPolygon>;
				if (cachedPoly && cachedPoly.key === polyKey) {
					polygon = cachedPoly.polygon;
				} else {
					polygon = computeVisibilityPolygon(vision, visibilityWalls, step, 72);
					lightPolygonCacheRef.current.set(light.id, {
						key: polyKey,
						polygon,
					});
				}

				const lightG = new Graphics();
				// Draw dim light
				lightG.circle(cx, cy, rDim);
				lightG.fill({
					color: parsePixiColor(light.color, 0xffffff),
					alpha: light.intensity * 0.3 * stratumAlpha,
				});

				// Draw bright light
				lightG.circle(cx, cy, rBright);
				lightG.fill({
					color: parsePixiColor(light.color, 0xffffff),
					alpha: light.intensity * 0.7 * stratumAlpha,
				});

				if (polygon.vertices.length > 0) {
					const mask = new Graphics();
					mask.moveTo(polygon.vertices[0][0], polygon.vertices[0][1]);
					for (let i = 1; i < polygon.vertices.length; i++) {
						mask.lineTo(polygon.vertices[i][0], polygon.vertices[i][1]);
					}
					mask.closePath();
					mask.fill({ color: 0xffffff });

					lightLayer.addChild(mask);
					lightG.mask = mask;
				}

				lightLayer.addChild(lightG);
			}

			lightingLayer.addChild(lightLayer);
		};

		// Snap-to-grid ghost rendering lives in the pointer-handler effect below;
		// we share the layer via snapGhostLayerRef because the pointer handlers
		// run in a separate effect closure and need access to it.

		// A render-phase throw must never bubble out of this effect (the
		// route-level ErrorBoundary would replace the whole VTT) nor silently
		// blank the scene. Report it as a non-fatal diagnostic and hand off to
		// the DOM fallback, which renders the same scene from React state.
		const reportRenderError = (label: string, err: unknown) => {
			if (!renderActive) return;
			console.error(`[VTT Pixi] Render phase '${label}' failed:`, err);
			setRendererStatus("render-error");
			setRendererError(`Render failed (${label}): ${formatPixiError(err)}`);
			onInitError?.(
				new Error(`render-error: ${label}: ${formatPixiError(err)}`),
			);
		};

		try {
			renderWeather();
			renderGrid();
			renderWalls();
			renderFog();
		} catch (err) {
			reportRenderError("layers", err);
		}
		void renderBackground().catch((err) =>
			reportRenderError("background", err),
		);
		void renderAnimatedTiles().catch((err) =>
			reportRenderError("animated-tiles", err),
		);
		void renderLighting().catch((err) => reportRenderError("lighting", err));

		return () => {
			renderActive = false;
		};
	}, [
		appReady,
		effectiveVisibleLayers,
		fogVisibleCells,
		gridSize,
		isWarden,
		onInitError,
		scene,
		showGrid,
		walls,
		lightSources,
		weather,
		gridConfig?.type,
		zoom,
		fx.particleCount,
		activeStratumId,
	]);

	useEffect(() => {
		const app = appRef.current;
		const layers = stageLayersRef.current;
		if (!app || !appReady || !layers) return;

		const { tokenLayer, nameplateLayer } = layers;

		let renderActive = true;

		const reportRenderError = (label: string, err: unknown) => {
			if (!renderActive) return;
			console.error(`[VTT Pixi] Render phase '${label}' failed:`, err);
			setRendererStatus("render-error");
			setRendererError(`Render failed (${label}): ${formatPixiError(err)}`);
			onInitError?.(
				new Error(`render-error: ${label}: ${formatPixiError(err)}`),
			);
		};

		const buildTokenSignature = (
			token: PlacedToken,
			ctx: {
				footprintW: number;
				footprintH: number;
				isOverlayToken: boolean;
				isSelected: boolean;
				isTargeted: boolean;
				isActiveInit: boolean;
				dimStratum: boolean;
			},
		) =>
			JSON.stringify([
				token.x,
				token.y,
				token.rotation,
				token.layer,
				token.size,
				token.gridWidth,
				token.gridHeight,
				token.color,
				token.borderColor,
				token.imageUrl,
				token.imageScale,
				token.emoji,
				token.name,
				token.render?.mode,
				token.render?.opacity,
				token.render?.blendMode,
				token.hp,
				token.hp_current,
				token.maxHp,
				token.hp_max,
				token.ac,
				token.armor_class,
				token.bars,
				token.conditions,
				token.barVisibility,
				token.ownerId,
				token.locked,
				ctx.footprintW,
				ctx.footprintH,
				ctx.isOverlayToken,
				ctx.isSelected,
				ctx.isTargeted,
				ctx.isActiveInit,
				ctx.dimStratum,
				isWarden,
				currentUserId,
			]);

		// Attached exactly once per container. Reads live token data + callbacks
		// via refs so reused containers never act on stale closures.
		const attachTokenPointerHandlers = (
			container: Container,
			tokenId: string,
		) => {
			container.on("pointerdown", (e) => {
				const token = tokensByIdRef.current.get(tokenId);
				if (!token) return;
				if (e.pointerType === "mouse" && e.button !== 0) return;
				e.stopPropagation();
				const additive = isAdditivePointerSelection(e);
				const handlers = tokenInteractionRef.current;
				if (handlers.onTokenPointerSelect) {
					handlers.onTokenPointerSelect(token.id, additive);
				} else {
					handlers.setActiveTokenId(token.id);
				}
				window.dispatchEvent(
					new CustomEvent("vtt:token-pointerdown", {
						detail: {
							tokenId: token.id,
							pointerType: e.pointerType,
							additive,
						},
					}),
				);
				if (token.locked || additive) return;
				// Players may select any token but only move/rotate their own
				// (DDB/Roll20 ownership parity). The Warden controls everything.
				if (
					!handlers.isWarden &&
					token.ownerId &&
					token.ownerId !== handlers.currentUserId
				) {
					return;
				}

				if (e.pointerType === "touch") {
					if (longPressRef.current) {
						window.clearTimeout(longPressRef.current.timer);
						longPressRef.current = null;
					}
					const timer = window.setTimeout(() => {
						handlers.updateToken(token.id, {
							rotation: (token.rotation + 90) % 360,
						});
						longPressRef.current = null;
					}, 550);
					longPressRef.current = {
						tokenId: token.id,
						timer,
						pointerId: e.pointerId,
					};
				}

				// Drag the whole multi-selection together when the grabbed token
				// is part of it; otherwise just this token.
				const selection = activeTokenIdsRef.current;
				const memberIds =
					selection.length > 1 && selection.includes(token.id)
						? [...selection]
						: [token.id];
				// Hide the rotate handle while dragging the token body.
				for (const ch of handleLayerRef.current?.removeChildren() ?? [])
					ch.destroy();
				dragStateRef.current = {
					pointerId: e.pointerId,
					primaryTokenId: token.id,
					originGX: token.x,
					originGY: token.y,
					memberIds,
					startPointerX: null,
					startPointerY: null,
					memberStart: null,
				};
				handlers.onTokenDragStart?.(token.id);
			});
		};

		const renderTokens = async () => {
			const cache = tokenRenderCacheRef.current;
			tokensByIdRef.current.clear();

			const visible = tokens.filter((token) => {
				if (!effectiveVisibleLayers[token.layer]) return false;
				if (isWarden) return true;
				if (!token.visible) return false;
				if (!scene) return true;
				return isVttTokenVisibleThroughFog(
					token,
					{
						width: scene.width,
						height: scene.height,
						gridSize,
						fogOfWar: scene.fogOfWar,
						tokenVisionRevealsFog: scene.tokenVisionRevealsFog,
						fogData: scene.fogData,
					},
					fogVisibleCells,
				);
			});
			for (const token of visible) {
				tokensByIdRef.current.set(token.id, token);
			}

			const seen = new Set<string>();

			for (const token of visible) {
				if (!renderActive) return;
				// Grid-unit footprint (Roll20/Foundry/DDB parity).
				const { width: footprintW, height: footprintH } = getTokenFootprintPx(
					token.size,
					gridSize,
					zoom,
					{ gridWidth: token.gridWidth, gridHeight: token.gridHeight },
				);
				const size = Math.max(footprintW, footprintH);
				const imageScale = token.imageScale ?? 1;
				const isOverlayToken =
					token.render?.mode === "overlay" ||
					token.tokenType === "effect" ||
					token.tokenType === "prop" ||
					(!!token.imageUrl &&
						(token.imageUrl.includes("/generated/props/") ||
							token.imageUrl.includes("/generated/effects/")));
				const isSelected =
					activeTokenId === token.id || activeTokenIds.includes(token.id);
				const isTargeted = targetedTokenIds.includes(token.id);
				const isActiveInit = activeInitiativeTokenId === token.id;
				const dimStratum = !!(
					activeStratumId &&
					token.level &&
					token.level !== activeStratumId
				);

				seen.add(token.id);
				const signature = buildTokenSignature(token, {
					footprintW,
					footprintH,
					isOverlayToken,
					isSelected,
					isTargeted,
					isActiveInit,
					dimStratum,
				});
				const existing = cache.get(token.id);
				// Unchanged token — skip all work (the win for large scenes).
				if (existing && existing.signature === signature) continue;

				// (Re)build just this token. Reuse the container (keeps the
				// once-attached pointer handler + drag continuity); free old
				// child GPU resources before redrawing.
				let container = existing?.container;
				if (container) {
					for (const child of container.removeChildren()) child.destroy();
				} else {
					container = new Container();
					container.eventMode = "static";
					attachTokenPointerHandlers(container, token.id);
					tokenLayer.addChild(container);
				}
				tokenContainersRef.current.set(token.id, container);

				// Pivot at the footprint centre so rotation spins in place (DDB/
				// Foundry) instead of swinging around the cell corner. Position is the
				// centre; drag/snap convert back to the top-left cell via half-footprint.
				container.pivot.set(footprintW / 2, footprintH / 2);
				container.x = token.x * gridSize * zoom + footprintW / 2;
				container.y = token.y * gridSize * zoom + footprintH / 2;
				container.width = footprintW;
				container.height = footprintH;
				container.rotation = (token.rotation * Math.PI) / 180;
				container.zIndex = token.layer * 10 + 10;
				container.cursor = token.locked ? "default" : "pointer";
				// Misty Pearl A2 — strata gating dims off-floor tokens.
				container.alpha = dimStratum ? 0.25 : 1;

				const tokenBg = new Graphics();
				if (!isOverlayToken) {
					// DDB-style explicit border override wins over owner/default.
					const overrideBorderHex = token.borderColor
						? parsePixiColor(token.borderColor, 0x3b82f6)
						: null;
					const ownerBorderHex = parsePixiColor(token.color, 0x3b82f6);
					const borderColor = overrideBorderHex ?? ownerBorderHex;
					tokenBg.circle(size / 2, size / 2, size / 2);
					tokenBg.fill({
						color: parsePixiColor(token.color, 0x000000),
						alpha: token.color ? 0.25 : 0.12,
					});
					tokenBg.stroke({
						width: overrideBorderHex !== null ? 3 : 2,
						color: borderColor,
						alpha: 0.9,
					});
					if (isActiveInit) {
						tokenBg.stroke({ width: 4, color: 0x10b981, alpha: 1 });
						const glow = new Graphics();
						glow.circle(size / 2, size / 2, size / 2 + 4);
						glow.fill({ color: 0x10b981, alpha: 0.3 });
						container.addChild(glow);
					} else if (isSelected) {
						tokenBg.stroke({ width: 3, color: 0xfbbf24, alpha: 0.9 });
					}
				}
				container.addChild(tokenBg);
				if (isTargeted) {
					const targetRing = new Graphics();
					targetRing.circle(size / 2, size / 2, size / 2 + 7);
					targetRing.stroke({ width: 3, color: 0xef4444, alpha: 0.95 });
					targetRing.moveTo(size / 2 - 8, size / 2);
					targetRing.lineTo(size / 2 + 8, size / 2);
					targetRing.moveTo(size / 2, size / 2 - 8);
					targetRing.lineTo(size / 2, size / 2 + 8);
					targetRing.stroke({ width: 2, color: 0xef4444, alpha: 0.95 });
					container.addChild(targetRing);
				}

				if (token.imageUrl) {
					try {
						const texture = await Assets.load(token.imageUrl);
						if (!renderActive) return;
						const sprite = Sprite.from(texture as never);
						sprite.width = footprintW * imageScale;
						sprite.height = footprintH * imageScale;
						sprite.x = (footprintW - sprite.width) / 2;
						sprite.y = (footprintH - sprite.height) / 2;
						sprite.anchor.set(0);
						sprite.alpha = token.render?.opacity ?? 1;
						sprite.blendMode = blendModeToPixi(
							token.render?.blendMode,
						) as Sprite["blendMode"];
						if (!isOverlayToken) {
							sprite.mask = tokenBg;
						}
						container.addChild(sprite);
					} catch {
						const text = new Text({
							text: token.emoji || "@",
							style: { fill: 0xffffff, fontSize: size * 0.4 },
						});
						text.x = size / 2;
						text.y = size / 2;
						text.anchor.set(0.5);
						container.addChild(text);
					}
				} else {
					const text = new Text({
						text: token.emoji || "@",
						style: { fill: 0xffffff, fontSize: size * 0.4 },
					});
					text.x = size / 2;
					text.y = size / 2;
					text.anchor.set(0.5);
					container.addChild(text);
				}

				// Status bars (HP/AC/custom) — config-driven visibility.
				if (!isOverlayToken) {
					const showSelectedBars = isSelected || isActiveInit;
					const globalBarVisible =
						isWarden ||
						token.barVisibility === "always" ||
						(token.barVisibility === "owner" &&
							token.ownerId === currentUserId) ||
						!token.barVisibility;
					if (
						(showSelectedBars ||
							isWarden ||
							token.barVisibility === "always") &&
						globalBarVisible
					) {
						let barOffset = 0;
						const drawBar = (current: number, max: number, color: number) => {
							const barWidth = size * 0.8;
							const barHeight = 4;
							const percent =
								max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
							const bg = new Graphics();
							bg.rect(
								size / 2 - barWidth / 2,
								size + 2 + barOffset,
								barWidth,
								barHeight,
							);
							bg.fill({ color: 0x000000, alpha: 0.7 });
							const fill = new Graphics();
							fill.rect(
								size / 2 - barWidth / 2,
								size + 2 + barOffset,
								barWidth * percent,
								barHeight,
							);
							fill.fill({ color });
							container.addChild(bg);
							container.addChild(fill);
							barOffset += barHeight + 2;
						};

						const explicitBars = Array.isArray(token.bars) ? token.bars : [];
						if (explicitBars.length > 0) {
							for (const bar of explicitBars.slice(0, 3)) {
								const visible =
									isWarden ||
									bar.visible === "all" ||
									(bar.visible === "controllers" &&
										token.ownerId === currentUserId);
								if (!visible || bar.max <= 0) continue;
								drawBar(bar.current, bar.max, hexToPixiColor(bar.color));
							}
						} else {
							const hp = token.hp ?? token.hp_current;
							const maxHp = token.maxHp ?? token.hp_max;
							if (
								typeof hp === "number" &&
								typeof maxHp === "number" &&
								maxHp > 0
							) {
								const hpPercent = hp / maxHp;
								const barColor =
									hpPercent > 0.5
										? 0x22c55e
										: hpPercent > 0.2
											? 0xeab308
											: 0xef4444;
								drawBar(hp, maxHp, barColor);
							}
							const ac = token.ac ?? token.armor_class;
							if (typeof ac === "number") {
								drawBar(ac, 30, 0x3b82f6);
							}
						}
					}
				}

				// Condition dots (top-right).
				if (
					!isOverlayToken &&
					token.conditions &&
					token.conditions.length > 0
				) {
					const dotRadius = 4;
					let dotOffsetX = size - dotRadius;
					for (const _condition of token.conditions) {
						const dot = new Graphics();
						dot.circle(dotOffsetX, dotRadius, dotRadius);
						dot.fill({ color: 0xeab308 });
						dot.stroke({ color: 0x000000, width: 1 });
						container.addChild(dot);
						dotOffsetX -= dotRadius * 2 + 2;
					}
				}

				// Nameplate — reused across reconciles (Text builds are costly).
				let nameplate = existing?.nameplate ?? null;
				if (!isOverlayToken) {
					if (!nameplate) {
						nameplate = new Text({
							text: token.name,
							style: {
								fill: 0xf0e6ff,
								fontSize: Math.max(10, Math.round(size * 0.22)),
								fontWeight: "bold",
								stroke: { color: 0x000000, width: 3 },
								dropShadow: {
									color: 0x000000,
									blur: 4,
									alpha: 0.8,
									distance: 1,
								},
							},
						});
						nameplate.anchor.set(0.5, 0);
						nameplateLayer.addChild(nameplate);
					} else {
						nameplate.text = token.name;
						nameplate.style.fontSize = Math.max(10, Math.round(size * 0.22));
					}
					nameplate.x = token.x * gridSize * zoom + footprintW / 2;
					nameplate.y = token.y * gridSize * zoom + footprintH + 2;
					nameplate.zIndex = token.layer * 10 + 11;
					nameplate.style.fill = isActiveInit
						? 0x10b981
						: isSelected
							? 0xfbbf24
							: 0xf0e6ff;
				} else if (nameplate) {
					nameplate.destroy();
					nameplate = null;
				}

				cache.set(token.id, { container, nameplate, signature });
			}

			// Retire tokens no longer visible/present.
			for (const [id, entry] of cache) {
				if (seen.has(id)) continue;
				entry.container.destroy({ children: true });
				entry.nameplate?.destroy();
				cache.delete(id);
				tokenContainersRef.current.delete(id);
			}

			tokenLayer.sortableChildren = true;
			nameplateLayer.sortableChildren = true;
		};

		// Keep the once-attached pointer handlers pointed at the latest callbacks.
		tokenInteractionRef.current = {
			onTokenPointerSelect,
			setActiveTokenId,
			onTokenDragStart,
			updateToken,
			isWarden,
			currentUserId,
		};

		void renderTokens().catch((err) => reportRenderError("tokens", err));

		return () => {
			renderActive = false;
		};
	}, [
		appReady,
		tokens,
		activeTokenId,
		activeTokenIds,
		targetedTokenIds,
		activeInitiativeTokenId,
		effectiveVisibleLayers,
		fogVisibleCells,
		currentUserId,
		isWarden,
		gridSize,
		zoom,
		scene,
		activeStratumId,
		onTokenPointerSelect,
		setActiveTokenId,
		onTokenDragStart,
		updateToken,
		onInitError,
	]);

	// Annotations on GPU (committed drawings + live measurement/AoE template +
	// wall preview). DOM equivalents in VTTEnhanced render only on Pixi failure.
	useEffect(() => {
		const app = appRef.current;
		const layers = stageLayersRef.current;
		if (!app || !appReady || !layers) return;
		const layer = layers.annotationsLayer;
		// Free the previous frame's Graphics/Text (measurement redraws on every
		// mouse-move) — removeChildren only detaches; destroy frees GPU buffers.
		for (const child of layer.removeChildren()) child.destroy();
		const step = gridSize * zoom;
		try {
			for (const drawing of drawings ?? []) {
				if (drawing.layer === "Warden" && !isWarden) continue;
				// Text drawings render as DOM annotations/notes (left intact); the
				// GPU annotations layer only draws geometric primitives.
				if (drawing.type === "text") continue;
				const g = new Graphics();
				const stroke = parsePixiColor(drawing.color, 0xffffff);
				const opacity = drawing.fillOpacity ?? 1;
				const width = Math.max(1, drawing.strokeWidth);
				const pts = drawing.points ?? [];
				if (drawing.type === "freehand") {
					if (pts.length > 0) {
						g.moveTo((pts[0].x + 0.5) * step, (pts[0].y + 0.5) * step);
						for (let i = 1; i < pts.length; i++) {
							g.lineTo((pts[i].x + 0.5) * step, (pts[i].y + 0.5) * step);
						}
						g.stroke({
							width,
							color: stroke,
							alpha: opacity,
							cap: "round",
							join: "round",
						});
					}
				} else if (drawing.type === "line") {
					const p1 = pts[0];
					const p2 = pts[1] ?? p1;
					if (p1) {
						g.moveTo((p1.x + 0.5) * step, (p1.y + 0.5) * step);
						g.lineTo((p2.x + 0.5) * step, (p2.y + 0.5) * step);
						g.stroke({ width, color: stroke, alpha: opacity, cap: "round" });
					}
				} else if (drawing.type === "cone") {
					const apex = pts[0];
					const far = pts[1] ?? apex;
					if (apex) {
						const ax = (apex.x + 0.5) * step;
						const ay = (apex.y + 0.5) * step;
						const fx2 = (far.x + 0.5) * step;
						const fy2 = (far.y + 0.5) * step;
						const r = Math.hypot(fx2 - ax, fy2 - ay);
						const ang = Math.atan2(fy2 - ay, fx2 - ax);
						const ha = Math.PI / 6;
						g.poly([
							ax,
							ay,
							ax + r * Math.cos(ang - ha),
							ay + r * Math.sin(ang - ha),
							ax + r * Math.cos(ang + ha),
							ay + r * Math.sin(ang + ha),
						]);
						g.fill({
							color: parsePixiColor(drawing.fillColor ?? drawing.color, stroke),
							alpha: drawing.fillOpacity ?? 0.22,
						});
					}
				} else {
					// rectangle / circle — bbox + 1 cell of padding (matches DOM).
					const p1 = pts[0];
					const p2 = pts[1] ?? p1;
					if (p1) {
						const x1 = Math.min(p1.x, p2.x) * step;
						const y1 = Math.min(p1.y, p2.y) * step;
						const x2 = Math.max(p1.x, p2.x) * step;
						const y2 = Math.max(p1.y, p2.y) * step;
						const w = Math.max(1, x2 - x1) + step;
						const hgt = Math.max(1, y2 - y1) + step;
						if (drawing.type === "circle") {
							g.ellipse(x1 + w / 2, y1 + hgt / 2, w / 2, hgt / 2);
						} else {
							g.rect(x1, y1, w, hgt);
						}
						if (drawing.fillColor) {
							g.fill({
								color: parsePixiColor(drawing.fillColor, stroke),
								alpha: drawing.fillOpacity ?? 0.18,
							});
						}
						g.stroke({ width, color: stroke, alpha: 0.9 });
					}
				}
				layer.addChild(g);
			}

			if (wallPreview) {
				const g = new Graphics();
				g.moveTo(wallPreview.x1 * step, wallPreview.y1 * step);
				g.lineTo(wallPreview.x2 * step, wallPreview.y2 * step);
				g.stroke({ width: 3, color: 0xf59e0b, alpha: 0.85, cap: "round" });
				layer.addChild(g);
			}

			if (measurement) {
				const { start, end, shape, radius } = measurement;
				const sx = (start.x + 0.5) * step;
				const sy = (start.y + 0.5) * step;
				const ex = (end.x + 0.5) * step;
				const ey = (end.y + 0.5) * step;
				const tint = 0x22d3ee;
				const g = new Graphics();
				let labelText: string;
				let labelX = ex;
				let labelY = ey;
				if (shape === "line") {
					const wpts = measurement.waypoints ?? [];
					const path = wpts.length > 0 ? [...wpts, start, end] : [start, end];
					g.moveTo((path[0].x + 0.5) * step, (path[0].y + 0.5) * step);
					for (let i = 1; i < path.length; i++) {
						g.lineTo((path[i].x + 0.5) * step, (path[i].y + 0.5) * step);
					}
					g.stroke({
						width: 3,
						color: tint,
						alpha: 0.95,
						cap: "round",
						join: "round",
					});
					// Sum the 5e-diagonal distance per leg; label multi-leg rulers
					// per-segment with a vertex dot, single-segment at the midpoint.
					let total = 0;
					for (let i = 1; i < path.length; i++) {
						const a = path[i - 1];
						const b = path[i];
						const dx = Math.abs(b.x - a.x);
						const dy = Math.abs(b.y - a.y);
						total += Math.max(dx, dy) + Math.min(dx, dy) * 0.5;
					}
					if (wpts.length > 0) {
						for (let i = 1; i < path.length; i++) {
							const a = path[i - 1];
							const b = path[i];
							const dx = Math.abs(b.x - a.x);
							const dy = Math.abs(b.y - a.y);
							const seg = Math.max(dx, dy) + Math.min(dx, dy) * 0.5;
							const segLabel = new Text({
								text: `${seg.toFixed(1)}u`,
								style: {
									fill: 0xffffff,
									fontSize: 11,
									stroke: { color: 0x000000, width: 3 },
								},
							});
							segLabel.anchor.set(0.5);
							segLabel.x = ((a.x + b.x) / 2 + 0.5) * step;
							segLabel.y = ((a.y + b.y) / 2 + 0.5) * step - 9;
							layer.addChild(segLabel);
						}
						for (const p of path) {
							const dot = new Graphics();
							dot.circle((p.x + 0.5) * step, (p.y + 0.5) * step, 3);
							dot.fill({ color: tint, alpha: 0.95 });
							layer.addChild(dot);
						}
					}
					labelText = `${total.toFixed(1)}u (${(total * 5).toFixed(0)} ft)`;
					labelX = wpts.length > 0 ? ex : (sx + ex) / 2;
					labelY = wpts.length > 0 ? ey : (sy + ey) / 2;
				} else if (shape === "circle") {
					g.circle(ex, ey, radius * step);
					g.fill({ color: tint, alpha: 0.15 });
					g.stroke({ width: 2, color: tint, alpha: 0.9 });
					labelText = `circle ${radius * 5}ft`;
				} else if (shape === "cone") {
					const r = radius * step;
					const ang = Math.atan2(ey - sy, ex - sx);
					const ha = Math.PI / 6;
					g.poly([
						sx,
						sy,
						sx + r * Math.cos(ang - ha),
						sy + r * Math.sin(ang - ha),
						sx + r * Math.cos(ang + ha),
						sy + r * Math.sin(ang + ha),
					]);
					g.fill({ color: tint, alpha: 0.18 });
					g.stroke({ width: 2, color: tint, alpha: 0.9 });
					labelText = `cone ${radius * 5}ft`;
					labelX = (sx + ex) / 2;
					labelY = (sy + ey) / 2;
				} else {
					const side = radius * step;
					g.rect(ex - side / 2, ey - side / 2, side, side);
					g.fill({ color: tint, alpha: 0.15 });
					g.stroke({ width: 2, color: tint, alpha: 0.9 });
					labelText = `cube ${radius * 5}ft`;
				}
				layer.addChild(g);
				const label = new Text({
					text: labelText,
					style: {
						fill: 0xffffff,
						fontSize: 13,
						fontWeight: "bold",
						stroke: { color: 0x000000, width: 3 },
					},
				});
				label.anchor.set(0.5);
				label.x = labelX;
				label.y = labelY - 12;
				layer.addChild(label);
			}
		} catch (err) {
			// Annotations are non-critical — never let a bad drawing crash the VTT.
			console.error("[VTT Pixi] Annotation render failed:", err);
		}
	}, [drawings, measurement, wallPreview, gridSize, zoom, isWarden, appReady]);

	// Drag-rotate handle (DDB/Roll20/Foundry): a knob above the single selected,
	// movable token. Dragging the knob spins the token (pointer-up commits one
	// updateToken); re-renders whenever the selection or that token changes.
	useEffect(() => {
		const app = appRef.current;
		const layers = stageLayersRef.current;
		if (!app || !appReady || !layers) return;
		const layer = layers.handleLayer;
		for (const child of layer.removeChildren()) child.destroy();
		const ids =
			activeTokenIds.length > 0
				? activeTokenIds
				: activeTokenId
					? [activeTokenId]
					: [];
		if (ids.length !== 1) return;
		const token = tokens.find((t) => t.id === ids[0]);
		if (!token || token.locked) return;
		// Ownership: Warden or the token's owner may rotate (player parity).
		if (!isWarden && token.ownerId && token.ownerId !== currentUserId) return;
		const { width: fpW, height: fpH } = getTokenFootprintPx(
			token.size,
			gridSize,
			zoom,
			{ gridWidth: token.gridWidth, gridHeight: token.gridHeight },
		);
		const step = gridSize * zoom;
		const centerX = token.x * step + fpW / 2;
		const centerY = token.y * step + fpH / 2;
		const reach = fpH / 2 + Math.max(18, step * 0.45);

		const group = new Container();
		group.position.set(centerX, centerY);
		group.rotation = (token.rotation * Math.PI) / 180;
		const stalk = new Graphics();
		stalk.moveTo(0, -(fpH / 2));
		stalk.lineTo(0, -reach);
		stalk.stroke({ width: 2, color: 0xfbbf24, alpha: 0.85 });
		group.addChild(stalk);
		const knob = new Graphics();
		knob.circle(0, -reach, 7);
		knob.fill({ color: 0xfbbf24, alpha: 0.95 });
		knob.stroke({ width: 2, color: 0x000000, alpha: 0.6 });
		// Larger, near-invisible grab area so the knob is easy to hit.
		knob.circle(0, -reach, 15);
		knob.fill({ color: 0xfbbf24, alpha: 0.001 });
		knob.eventMode = "static";
		knob.cursor = "grab";
		knob.on("pointerdown", (e) => {
			if (e.pointerType === "mouse" && e.button !== 0) return;
			e.stopPropagation();
			window.dispatchEvent(
				new CustomEvent("vtt:token-pointerdown", {
					detail: {
						tokenId: token.id,
						pointerType: e.pointerType,
						rotate: true,
					},
				}),
			);
			rotateStateRef.current = {
				pointerId: e.pointerId,
				tokenId: token.id,
				centerX,
				centerY,
				group,
			};
		});
		group.addChild(knob);
		layer.addChild(group);
	}, [
		activeTokenId,
		activeTokenIds,
		tokens,
		gridSize,
		zoom,
		isWarden,
		currentUserId,
		appReady,
	]);

	useEffect(() => {
		const host = canvasHostRef.current;
		const app = appRef.current;
		if (!host || !app) return;
		const getWorldPointerPosition = (clientX: number, clientY: number) => {
			const viewport = containerRef.current ?? host;
			const rect = viewport.getBoundingClientRect();
			return {
				x: clientX - rect.left + (containerRef.current?.scrollLeft ?? 0),
				y: clientY - rect.top + (containerRef.current?.scrollTop ?? 0),
			};
		};

		// Token containers are centre-pivoted; the grid snap math wants the
		// top-left cell, so convert centre → top-left via the token's footprint.
		const tokenTopLeft = (id: string, c: Container) => {
			const tk = tokensByIdRef.current.get(id);
			const fp = getTokenFootprintPx(tk?.size ?? "medium", gridSize, zoom, {
				gridWidth: tk?.gridWidth,
				gridHeight: tk?.gridHeight,
			});
			return {
				x: c.position.x - fp.width / 2,
				y: c.position.y - fp.height / 2,
			};
		};

		const renderDrawingTemplate = (
			x1: number,
			y1: number,
			x2: number,
			y2: number,
		) => {
			const g = drawingGraphicsRef.current;
			if (!g) return;
			g.clear();
			if (drawMode === "none") return;

			const dx = x2 - x1;
			const dy = y2 - y1;
			const distPixels = Math.hypot(dx, dy);
			const angle = Math.atan2(dy, dx);
			// Feet conversion assumes 5ft per grid square
			const distFeet = Math.round((distPixels / (gridSize * zoom)) * 5);

			if (drawMode === "ruler") {
				g.moveTo(x1, y1);
				g.lineTo(x2, y2);
				g.stroke({ width: 4, color: 0xffea00, alpha: 0.8 });

				const label = new Text({
					text: `${distFeet}ft`,
					style: {
						fill: 0xffffff,
						fontSize: 16,
						stroke: { color: 0x000000, width: 3 },
					},
				});
				label.x = x2 + 10;
				label.y = y2 + 10;
				g.addChild(label);

				// Remove old labels
				for (let i = g.children.length - 1; i >= 0; i--) {
					if (g.children[i] !== label) g.removeChild(g.children[i]);
				}
			} else if (drawMode === "cone") {
				const coneAngle = Math.PI / 3; // 60 degrees
				g.moveTo(x1, y1);
				g.arc(x1, y1, distPixels, angle - coneAngle / 2, angle + coneAngle / 2);
				g.lineTo(x1, y1);
				g.fill({ color: 0xff0000, alpha: 0.3 });
				g.stroke({ width: 2, color: 0xff0000, alpha: 0.8 });

				const label = new Text({
					text: `${distFeet}ft Cone`,
					style: {
						fill: 0xffffff,
						fontSize: 16,
						stroke: { color: 0x000000, width: 3 },
					},
				});
				label.x = x2 + 10;
				label.y = y2 + 10;
				for (let i = g.children.length - 1; i >= 0; i--)
					g.removeChild(g.children[i]);
				g.addChild(label);
			} else if (drawMode === "sphere") {
				g.circle(x1, y1, distPixels);
				g.fill({ color: 0x3b82f6, alpha: 0.3 });
				g.stroke({ width: 2, color: 0x3b82f6, alpha: 0.8 });

				const label = new Text({
					text: `${distFeet}ft Radius`,
					style: {
						fill: 0xffffff,
						fontSize: 16,
						stroke: { color: 0x000000, width: 3 },
					},
				});
				label.x = x2 + 10;
				label.y = y2 + 10;
				for (let i = g.children.length - 1; i >= 0; i--)
					g.removeChild(g.children[i]);
				g.addChild(label);
			} else if (drawMode === "cube") {
				const sizePx = Math.max(Math.abs(dx), Math.abs(dy));
				// Force the square to originate from x1, y1
				const signX = dx < 0 ? -1 : 1;
				const signY = dy < 0 ? -1 : 1;
				g.rect(x1, y1, sizePx * signX, sizePx * signY);
				g.fill({ color: 0xa855f7, alpha: 0.3 });
				g.stroke({ width: 2, color: 0xa855f7, alpha: 0.8 });

				const sizeFeet = Math.round((sizePx / (gridSize * zoom)) * 5);
				const label = new Text({
					text: `${sizeFeet}ft Cube`,
					style: {
						fill: 0xffffff,
						fontSize: 16,
						stroke: { color: 0x000000, width: 3 },
					},
				});
				label.x = x2 + 10;
				label.y = y2 + 10;
				for (let i = g.children.length - 1; i >= 0; i--)
					g.removeChild(g.children[i]);
				g.addChild(label);
			}
		};

		const handlePointerMove = (e: PointerEvent) => {
			const { x, y } = getWorldPointerPosition(e.clientX, e.clientY);

			if (drawMode !== "none" && drawingRef.current?.active) {
				drawingRef.current.currentX = x;
				drawingRef.current.currentY = y;
				renderDrawingTemplate(
					drawingRef.current.startX,
					drawingRef.current.startY,
					drawingRef.current.currentX,
					drawingRef.current.currentY,
				);
				return;
			}

			const rotateState = rotateStateRef.current;
			if (rotateState && rotateState.pointerId === e.pointerId) {
				let deg =
					(Math.atan2(y - rotateState.centerY, x - rotateState.centerX) * 180) /
						Math.PI +
					90;
				if (e.shiftKey) deg = Math.round(deg / 15) * 15;
				const rad = (deg * Math.PI) / 180;
				rotateState.group.rotation = rad;
				const rc = tokenContainersRef.current.get(rotateState.tokenId);
				if (rc) rc.rotation = rad;
				return;
			}

			const dragState = dragStateRef.current;
			if (dragState && dragState.pointerId === e.pointerId) {
				if (
					longPressRef.current &&
					longPressRef.current.pointerId === e.pointerId
				) {
					window.clearTimeout(longPressRef.current.timer);
					longPressRef.current = null;
				}
				if (
					scrollDragRef.current &&
					scrollDragRef.current.pointerId === e.pointerId
				) {
					scrollDragRef.current = null;
				}
				const world = getWorldPointerPosition(e.clientX, e.clientY);
				const step = gridSize * zoom;
				// Capture the grab origin + each member's start position on the
				// first move — after any selection-triggered token rebuild — so
				// the sprites track the cursor smoothly without jumping.
				if (dragState.startPointerX === null) {
					dragState.startPointerX = world.x;
					dragState.startPointerY = world.y;
					dragState.memberStart = new Map();
					for (const id of dragState.memberIds) {
						const c = tokenContainersRef.current.get(id);
						if (c) {
							dragState.memberStart.set(id, {
								x: c.position.x,
								y: c.position.y,
							});
						}
					}
				}
				const deltaX = world.x - (dragState.startPointerX ?? world.x);
				const deltaY = world.y - (dragState.startPointerY ?? world.y);
				// Move the dragged sprite(s) in pixel space — no scene mutation,
				// so the render effect does not re-run mid-drag.
				for (const id of dragState.memberIds) {
					const c = tokenContainersRef.current.get(id);
					const start = dragState.memberStart?.get(id);
					if (c && start) c.position.set(start.x + deltaX, start.y + deltaY);
				}
				// Snapped ghost + live distance label for the primary token.
				const ghostLayer = snapGhostLayerRef.current;
				const primary = tokenContainersRef.current.get(
					dragState.primaryTokenId,
				);
				if (ghostLayer && primary) {
					ghostLayer.removeChildren();
					const tl = tokenTopLeft(dragState.primaryTokenId, primary);
					const snapped = snapWorldToCell(tl.x, tl.y, step);
					const ghost = new Graphics();
					ghost.rect(snapped.gridX * step, snapped.gridY * step, step, step);
					ghost.fill({ color: 0xfbbf24, alpha: 0.18 });
					ghost.stroke({ width: 2, color: 0xfbbf24, alpha: 0.7 });
					ghostLayer.addChild(ghost);
					const feet = gridDistanceFeet(
						snapped.gridX - dragState.originGX,
						snapped.gridY - dragState.originGY,
					);
					if (feet > 0) {
						const label = new Text({
							text: `${feet} ft`,
							style: {
								fill: 0xffffff,
								fontSize: 14,
								fontWeight: "bold",
								stroke: { color: 0x000000, width: 3 },
							},
						});
						label.x = snapped.gridX * step + step + 4;
						label.y = snapped.gridY * step;
						ghostLayer.addChild(label);
					}
				}
				return;
			}

			const scrollDrag = scrollDragRef.current;
			if (
				scrollDrag &&
				scrollDrag.pointerId === e.pointerId &&
				containerRef.current
			) {
				const dx = e.clientX - scrollDrag.startX;
				const dy = e.clientY - scrollDrag.startY;
				containerRef.current.scrollLeft = scrollDrag.startLeft - dx;
				containerRef.current.scrollTop = scrollDrag.startTop - dy;
			}

			const pinch = pinchRef.current;
			if (pinch) {
				const a = pointersRef.current.get(pinch.aId);
				const b = pointersRef.current.get(pinch.bId);
				if (!a || !b) return;
				const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
				if (pinch.startDist <= 0) return;
				const ratio = dist / pinch.startDist;
				const nextZoom = Math.max(0.1, Math.min(3, pinch.startZoom * ratio));
				// Zoom about the live pinch midpoint (finger-anchored, like DDB
				// Maps / Foundry) so the map doesn't drift away from the fingers.
				const pinchContainer = containerRef.current;
				if (pinchContainer) {
					const rect = pinchContainer.getBoundingClientRect();
					onRequestZoom(nextZoom, {
						x: (a.clientX + b.clientX) / 2 - rect.left,
						y: (a.clientY + b.clientY) / 2 - rect.top,
					});
				} else {
					onRequestZoom(nextZoom);
				}
			}
		};

		const handlePointerUp = (e: PointerEvent) => {
			if (drawingRef.current?.active) {
				if (drawMode === "wall" && onWallCreated) {
					onWallCreated(
						drawingRef.current.startX,
						drawingRef.current.startY,
						drawingRef.current.currentX,
						drawingRef.current.currentY,
					);
				}

				drawingRef.current = null;
				if (drawingGraphicsRef.current) drawingGraphicsRef.current.clear();
				return;
			}

			const rotateState = rotateStateRef.current;
			if (rotateState && rotateState.pointerId === e.pointerId) {
				rotateStateRef.current = null;
				const rc = tokenContainersRef.current.get(rotateState.tokenId);
				const deg = rc ? Math.round((rc.rotation * 180) / Math.PI) : 0;
				updateToken(rotateState.tokenId, {
					rotation: ((deg % 360) + 360) % 360,
				});
				// Re-arm the map-action suppressor so the release doesn't fire a stray
				// grid action (mirrors the token drag-end behaviour).
				window.dispatchEvent(
					new CustomEvent("vtt:token-pointerdown", {
						detail: {
							tokenId: rotateState.tokenId,
							pointerType: e.pointerType,
							rotate: true,
						},
					}),
				);
			}

			const dragState = dragStateRef.current;
			if (dragState && dragState.pointerId === e.pointerId) {
				dragStateRef.current = null;
				snapGhostLayerRef.current?.removeChildren();
				// Only commit if the token actually moved (a plain click already
				// handled selection on pointerdown). Snap each dragged token to a
				// grid cell with a single state update apiece.
				if (dragState.startPointerX !== null) {
					const step = gridSize * zoom;
					// Hold Alt to drop at a free (fractional) position; otherwise
					// snap to the nearest grid cell (DDB/Foundry parity).
					const freePlace = e.altKey;
					for (const id of dragState.memberIds) {
						const c = tokenContainersRef.current.get(id);
						if (!c) continue;
						const tl = tokenTopLeft(id, c);
						if (freePlace && step > 0) {
							updateToken(id, {
								x: Math.round((tl.x / step) * 100) / 100,
								y: Math.round((tl.y / step) * 100) / 100,
							});
						} else {
							const snapped = snapWorldToCell(tl.x, tl.y, step);
							updateToken(id, { x: snapped.gridX, y: snapped.gridY });
						}
					}
					for (const id of dragState.memberIds) {
						onTokenDragEnd?.(id);
					}
				}
			}

			if (
				longPressRef.current &&
				longPressRef.current.pointerId === e.pointerId
			) {
				window.clearTimeout(longPressRef.current.timer);
				longPressRef.current = null;
			}

			const scrollDrag = scrollDragRef.current;
			if (scrollDrag && scrollDrag.pointerId === e.pointerId) {
				scrollDragRef.current = null;
			}

			pointersRef.current.delete(e.pointerId);

			const pinch = pinchRef.current;
			if (pinch && (pinch.aId === e.pointerId || pinch.bId === e.pointerId)) {
				pinchRef.current = null;
			}
		};

		const handlePointerDown = (e: PointerEvent) => {
			if (
				enableViewportPan &&
				containerRef.current &&
				e.pointerType === "mouse" &&
				(e.button === 2 || e.button === 1)
			) {
				e.preventDefault();
				scrollDragRef.current = {
					pointerId: e.pointerId,
					startX: e.clientX,
					startY: e.clientY,
					startLeft: containerRef.current.scrollLeft,
					startTop: containerRef.current.scrollTop,
				};
				return;
			}

			if (drawMode !== "none") {
				const { x, y } = getWorldPointerPosition(e.clientX, e.clientY);
				drawingRef.current = {
					startX: x,
					startY: y,
					currentX: x,
					currentY: y,
					active: true,
				};
				return;
			}

			pointersRef.current.set(e.pointerId, e);

			if (pointersRef.current.size === 2) {
				// A second finger starts a pinch — cancel any single-finger pan so
				// the viewport doesn't scroll and zoom simultaneously.
				scrollDragRef.current = null;
				const entries = [...pointersRef.current.values()];
				const a = entries[0];
				const b = entries[1];
				pinchRef.current = {
					aId: a.pointerId,
					bId: b.pointerId,
					startDist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
					startZoom: zoom,
					centerClientX: (a.clientX + b.clientX) / 2,
					centerClientY: (a.clientY + b.clientY) / 2,
				};
				return;
			}

			// Single-finger touch on the empty map pans the viewport (DDB / Foundry
			// touch parity). The Pixi token handler runs first and sets a drag/
			// rotate state when a token is grabbed, so we only pan when none is
			// active and no draw/ruler tool is selected.
			if (
				enableViewportPan &&
				containerRef.current &&
				e.pointerType === "touch" &&
				pointersRef.current.size === 1 &&
				drawMode === "none" &&
				!dragStateRef.current &&
				!rotateStateRef.current &&
				!longPressRef.current
			) {
				scrollDragRef.current = {
					pointerId: e.pointerId,
					startX: e.clientX,
					startY: e.clientY,
					startLeft: containerRef.current.scrollLeft,
					startTop: containerRef.current.scrollTop,
				};
			}
		};

		const handlePointerUpdate = (e: PointerEvent) => {
			if (pointersRef.current.has(e.pointerId)) {
				pointersRef.current.set(e.pointerId, e);
			}
		};

		host.addEventListener("pointerdown", handlePointerDown);
		host.addEventListener("pointermove", handlePointerUpdate);
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp);
		window.addEventListener("pointercancel", handlePointerUp);

		return () => {
			host.removeEventListener("pointerdown", handlePointerDown);
			host.removeEventListener("pointermove", handlePointerUpdate);
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
			window.removeEventListener("pointercancel", handlePointerUp);
		};
	}, [
		containerRef,
		gridSize,
		onRequestZoom,
		onTokenDragEnd,
		updateToken,
		enableViewportPan,
		zoom,
		drawMode,
		onWallCreated,
	]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaY) < 1) return;

			// Plain wheel zooms the canvas (DDB Maps / Foundry / pinch parity).
			// Ctrl/Cmd+Wheel is also accepted for users used to the Roll20
			// pattern. Panel scrolls are unaffected because this listener is
			// scoped to the map container element.
			e.preventDefault();
			// deltaMode 0 = pixel, 1 = line, 2 = page. Normalize to a small
			// per-notch zoom delta so trackpads and mice feel similar.
			const normalized =
				e.deltaMode === 0
					? e.deltaY / 100
					: e.deltaMode === 1
						? e.deltaY / 3
						: e.deltaY;
			const direction = normalized > 0 ? -1 : 1;
			const magnitude = e.ctrlKey || e.metaKey ? 0.2 : 0.1;
			const nextZoom = Math.max(0.1, Math.min(3, zoom + direction * magnitude));
			if (Math.abs(nextZoom - zoom) > 0.001) {
				// Foundry-parity zoom-at-cursor: pass the wheel event's
				// container-relative offset so scroll adjusts to keep the
				// world-point under the cursor stationary after zoom.
				const rect = container.getBoundingClientRect();
				onRequestZoom(nextZoom, {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top,
				});
			}
		};

		container.addEventListener("wheel", handleWheel, { passive: false });
		return () => {
			container.removeEventListener("wheel", handleWheel as EventListener);
		};
	}, [containerRef, onRequestZoom, zoom]);

	useEffect(() => {
		const host = canvasHostRef.current;
		if (!host) return;

		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
		};

		host.addEventListener("contextmenu", handleContextMenu);
		return () => {
			host.removeEventListener("contextmenu", handleContextMenu);
		};
	}, []);

	// One-shot FX: anything can dispatch `vtt:play-effect` with a preset + grid
	// cell to spawn a GPU effect burst on the effects layer (combat/spell FX).
	useEffect(() => {
		const handlePlayEffect = (event: Event) => {
			const app = appRef.current;
			const layers = stageLayersRef.current;
			if (!app?.renderer || !layers) return;
			const detail = (event as CustomEvent).detail as {
				preset?: EffectPreset;
				gridX?: number;
				gridY?: number;
			} | null;
			if (
				!detail ||
				typeof detail.gridX !== "number" ||
				typeof detail.gridY !== "number"
			) {
				return;
			}
			// Lazily build a shared circle texture for effect particles.
			if (!effectTextureRef.current) {
				const g = new Graphics();
				g.circle(0, 0, 4);
				g.fill(0xffffff);
				effectTextureRef.current = app.renderer.generateTexture(g);
				g.destroy();
			}
			const cell = gridSize * zoom;
			try {
				const effect = createEffect(layers.effectsLayer, {
					preset: detail.preset ?? "impact",
					cx: (detail.gridX + 0.5) * cell,
					cy: (detail.gridY + 0.5) * cell,
					cell,
					texture: effectTextureRef.current,
					particleCount: fx.particleCount,
				});
				activeEffectsRef.current.push(effect);
			} catch (err) {
				console.error("[VTT Pixi] Failed to play effect:", err);
			}
		};
		window.addEventListener(
			"vtt:play-effect",
			handlePlayEffect as EventListener,
		);
		return () =>
			window.removeEventListener(
				"vtt:play-effect",
				handlePlayEffect as EventListener,
			);
	}, [gridSize, zoom, fx.particleCount]);

	return (
		<DynamicStyle
			ref={canvasHostRef}
			data-testid="vtt-pixi-host"
			data-renderer-status={rendererStatus}
			data-renderer-error={rendererError ?? undefined}
			data-renderer-preference="webgl"
			data-renderer-width={
				viewportSize.width > 0 ? String(viewportSize.width) : undefined
			}
			data-renderer-height={
				viewportSize.height > 0 ? String(viewportSize.height) : undefined
			}
			className="relative touch-none"
			vars={{
				position: "sticky",
				top: 0,
				left: 0,
				width:
					viewportSize.width > 0
						? `min(100%, ${viewportSize.width}px)`
						: "100%",
				height:
					viewportSize.height > 0
						? `min(100%, ${viewportSize.height}px)`
						: "100%",
				overflow: "hidden",
				"z-index": 1,
			}}
		/>
	);
}
