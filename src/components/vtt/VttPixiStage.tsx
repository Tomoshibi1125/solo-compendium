import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
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
	weather?: "none" | "rain" | "snow" | "embers" | "gas";
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

const hexToPixiColor = (color: string, fallback = 0x22c55e) => {
	const normalized = color.trim().replace(/^#/, "");
	if (!/^[0-9a-f]{6}$/i.test(normalized)) return fallback;
	return Number.parseInt(normalized, 16);
};

const isAdditivePointerSelection = (event: {
	shiftKey?: boolean;
	ctrlKey?: boolean;
	metaKey?: boolean;
}) => Boolean(event.shiftKey || event.ctrlKey || event.metaKey);

type PixiRendererStatus =
	| "waiting-for-layout"
	| "initializing"
	| "ready"
	| "failed";

const VTT_MAX_RENDER_RESOLUTION = 1.5;
const VTT_INIT_STABLE_FRAME_COUNT = 2;
const VTT_INIT_MAX_LAYOUT_FRAMES = 12;

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

/** Query the GPU's max texture size via a throwaway WebGL context. */
const getMaxTextureSize = (): number => {
	try {
		const c = document.createElement("canvas");
		const gl = c.getContext("webgl2") ?? c.getContext("webgl");
		if (gl) {
			const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
			// Lose the context immediately so we don't hog a GPU slot.
			gl.getExtension("WEBGL_lose_context")?.loseContext();
			return max;
		}
	} catch {
		// Swallow — fall through to safe default.
	}
	return 4096;
};

// Cache once per page load so we don't create throwaway contexts repeatedly.
const GPU_MAX_TEXTURE = getMaxTextureSize();

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
	snapGhostLayer: Container;
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

	const dragStateRef = useRef<{ tokenId: string; pointerId: number } | null>(
		null,
	);
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
	const weatherEmitterRef = useRef<Emitter | null>(null);
	const worldContainerRef = useRef<Container | null>(null);
	// Snap-to-grid ghost overlay shown while dragging a token. Populated by
	// the stage-init effect and consumed by pointer handlers in a separate
	// effect, so we share it via a ref rather than nested closure scope.
	const snapGhostLayerRef = useRef<Container | null>(null);
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

			// Attempt init with progressively lower settings on failure.
			const attempts: Array<{
				resolution: number;
				width: number;
				height: number;
				antialias: boolean;
			}> = [
				{
					resolution: safeResolution,
					width: canvasW,
					height: canvasH,
					antialias: false,
				},
				{
					resolution: safeResolution,
					width: canvasW,
					height: canvasH,
					antialias: true,
				},
				{ resolution: 1, width: canvasW, height: canvasH, antialias: false },
				{
					resolution: 0.75,
					width: canvasW,
					height: canvasH,
					antialias: false,
				},
				{
					resolution: 1,
					width: Math.ceil(canvasW / 2),
					height: Math.ceil(canvasH / 2),
					antialias: false,
				},
			];

			let app: Application | null = null;
			let lastError: unknown = null;

			for (let i = 0; i < attempts.length; i++) {
				if (destroyed) return;
				const cfg = attempts[i];
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
						powerPreference: "high-performance",
					});
					app = candidate;
					if (i > 0) {
						console.warn(
							`[VTT Pixi] Initialized on attempt ${i + 1} with resolution=${cfg.resolution}, size=${cfg.width}×${cfg.height}`,
						);
					}
					break;
				} catch (err) {
					lastError = err;
					console.error(
						`[VTT Pixi] Init attempt ${i + 1}/${attempts.length} failed:`,
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
				const message = `Pixi init failed after all retries: ${formatPixiError(lastError)}`;
				setRendererStatus("failed");
				setRendererError(message);
				console.error(
					"[VTT Pixi] All init attempts failed. GPU_MAX_TEXTURE =",
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
		const snapGhostLayer = new Container();
		const fogLayer = new Container();
		if (!drawingGraphicsRef.current) {
			drawingGraphicsRef.current = new Graphics();
		}
		const drawOverlay = drawingGraphicsRef.current;
		drawOverlay.clear();
		drawOverlay.zIndex = 1000;

		worldContainerRef.current = world;
		snapGhostLayerRef.current = snapGhostLayer;
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
			snapGhostLayer,
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
		world.addChild(nameplateLayer);
		world.addChild(fogLayer);
		world.addChild(drawOverlay);
		syncWorldTransform();

		onStageReady?.(app, effectsLayer);

		const ticker = new Ticker();
		ticker.add((tick) => {
			if (weatherEmitterRef.current) {
				weatherEmitterRef.current.update(tick.deltaMS * 0.001);
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
			drawOverlay.clear();
			stage.removeChildren();
			stageLayersRef.current = null;
			worldContainerRef.current = null;
			snapGhostLayerRef.current = null;
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
			tokenLayer,
			nameplateLayer,
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
						tile.level &&
						activeStratumId &&
						tile.level !== activeStratumId
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

			if (!weather || weather === "none") return;

			const width = (scene?.width || 100) * gridSize * zoom;
			const height = (scene?.height || 100) * gridSize * zoom;

			// Base texture for simple shapes (circle/square equivalent)
			const particleGraphic = new Graphics();
			particleGraphic.circle(0, 0, 4);
			particleGraphic.fill(0xffffff);
			const texture = app.renderer.generateTexture(particleGraphic);

			let config: unknown = null;

			if (weather === "rain") {
				config = {
					alpha: {
						list: [
							{ value: 0.5, time: 0 },
							{ value: 0.1, time: 1 },
						],
						isStepped: false,
					},
					scale: {
						list: [
							{ value: 0.1, time: 0 },
							{ value: 0.8, time: 1 },
						],
						isStepped: false,
					},
					color: {
						list: [
							{ value: "ffffff", time: 0 },
							{ value: "aaaaaa", time: 1 },
						],
						isStepped: false,
					},
					speed: {
						list: [
							{ value: 800, time: 0 },
							{ value: 900, time: 1 },
						],
						isStepped: false,
					},
					startRotation: { min: 65, max: 75 },
					rotationSpeed: { min: 0, max: 0 },
					lifetime: { min: 0.8, max: 1.5 },
					frequency: 0.004,
					spawnChance: 1,
					particlesPerWave: 1,
					emitterLifetime: -1,
					maxParticles: Math.min(1000, fx.particleCount * 30),
					pos: { x: 0, y: 0 },
					addAtBack: false,
					spawnType: "rect",
					spawnRect: { x: 0, y: -200, w: width, h: 20 },
				};
			} else if (weather === "snow") {
				config = {
					alpha: {
						list: [
							{ value: 0.8, time: 0 },
							{ value: 0, time: 1 },
						],
						isStepped: false,
					},
					scale: {
						list: [
							{ value: 0.5, time: 0 },
							{ value: 0.2, time: 1 },
						],
						isStepped: false,
					},
					color: {
						list: [
							{ value: "ffffff", time: 0 },
							{ value: "ffffff", time: 1 },
						],
						isStepped: false,
					},
					speed: {
						list: [
							{ value: 50, time: 0 },
							{ value: 100, time: 1 },
						],
						isStepped: false,
					},
					startRotation: { min: 70, max: 110 },
					rotationSpeed: { min: -50, max: 50 },
					lifetime: { min: 3, max: 5 },
					frequency: 0.02,
					spawnChance: 1,
					particlesPerWave: 1,
					emitterLifetime: -1,
					maxParticles: Math.min(500, fx.particleCount * 20),
					pos: { x: 0, y: 0 },
					addAtBack: false,
					spawnType: "rect",
					spawnRect: { x: 0, y: -200, w: width, h: height },
				};
			} else if (weather === "embers") {
				config = {
					alpha: {
						list: [
							{ value: 1, time: 0 },
							{ value: 0, time: 1 },
						],
						isStepped: false,
					},
					scale: {
						list: [
							{ value: 0.5, time: 0 },
							{ value: 0.1, time: 1 },
						],
						isStepped: false,
					},
					color: {
						list: [
							{ value: "ff6600", time: 0 },
							{ value: "ff0000", time: 1 },
						],
						isStepped: false,
					},
					speed: {
						list: [
							{ value: 100, time: 0 },
							{ value: 50, time: 1 },
						],
						isStepped: false,
					},
					startRotation: { min: 250, max: 290 }, // float upwards
					rotationSpeed: { min: -100, max: 100 },
					lifetime: { min: 1.5, max: 3 },
					frequency: 0.05,
					spawnChance: 1,
					particlesPerWave: 1,
					emitterLifetime: -1,
					maxParticles: Math.min(300, fx.particleCount * 12),
					pos: { x: 0, y: 0 },
					addAtBack: false,
					spawnType: "rect",
					spawnRect: { x: 0, y: height, w: width, h: 50 },
				};
			} else if (weather === "gas") {
				config = {
					alpha: {
						list: [
							{ value: 0, time: 0 },
							{ value: 0.4, time: 0.5 },
							{ value: 0, time: 1 },
						],
						isStepped: false,
					},
					scale: {
						list: [
							{ value: 2, time: 0 },
							{ value: 4, time: 1 },
						],
						isStepped: false,
					},
					color: {
						list: [
							{ value: "66aa66", time: 0 },
							{ value: "226622", time: 1 },
						],
						isStepped: false,
					},
					speed: {
						list: [
							{ value: 20, time: 0 },
							{ value: 5, time: 1 },
						],
						isStepped: false,
					},
					startRotation: { min: 0, max: 360 },
					rotationSpeed: { min: -10, max: 10 },
					lifetime: { min: 4, max: 8 },
					frequency: 0.2,
					spawnChance: 1,
					particlesPerWave: 1,
					emitterLifetime: -1,
					maxParticles: Math.min(150, fx.particleCount * 6),
					pos: { x: 0, y: 0 },
					addAtBack: false,
					spawnType: "rect",
					spawnRect: { x: 0, y: 0, w: width, h: height },
				};
			}

			if (config) {
				weatherEmitterRef.current = new Emitter(
					weatherLayer as never,
					upgradeConfig(config as never, [texture]),
				);
				weatherEmitterRef.current.emit = true;
			}
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
			const levels = (scene as { levels?: Array<{ id: string; wallIds: string[] }> })
				?.levels;
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
			for (const rect of fogRects) {
				const fg = new Graphics();
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
				const polygon = computeVisibilityPolygon(
					vision,
					visibilityWalls,
					step,
					72,
				);

				const lightG = new Graphics();
				// Draw dim light
				lightG.circle(cx, cy, rDim);
				lightG.fill({
					color: Number(light.color.replace("#", "0x")),
					alpha: light.intensity * 0.3 * stratumAlpha,
				});

				// Draw bright light
				lightG.circle(cx, cy, rBright);
				lightG.fill({
					color: Number(light.color.replace("#", "0x")),
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

		const renderTokens = async () => {
			tokenLayer.removeChildren();
			nameplateLayer.removeChildren();

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
				if (!renderActive) return;
				// Grid-unit footprint (industry standard: Roll20/Foundry/DDB).
				// Medium = 1×1 cells, Large = 2×2, Huge = 3×3, Gargantuan = 4×4,
				// Tiny = 0.5×0.5. Previous code used fixed pixel constants
				// (48/64/96) which made tokens look tiny on scenes with larger
				// grid sizes (e.g. sandbox scenes use gridSize=70).
				const { width: footprintW, height: footprintH } = getTokenFootprintPx(
					token.size,
					gridSize,
					zoom,
					{ gridWidth: token.gridWidth, gridHeight: token.gridHeight },
				);
				// Circle/bar geometry stays square — use the larger dimension so
				// non-square tokens are fully circumscribed.
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

				const container = new Container();
				container.x = token.x * gridSize * zoom;
				container.y = token.y * gridSize * zoom;
				container.width = footprintW;
				container.height = footprintH;
				container.rotation = (token.rotation * Math.PI) / 180;
				container.zIndex = token.layer * 10 + 10;
				container.eventMode = "static";
				container.cursor = token.locked ? "default" : "pointer";
				// Misty Pearl A2 — Strata gating. Tokens on inactive strata
				// render dimmed so the Warden can focus on one floor. Null
				// activeStratumId or tokens without a level fall through.
				if (activeStratumId && token.level && token.level !== activeStratumId) {
					container.alpha = 0.25;
				}

				const tokenBg = new Graphics();
				if (!isOverlayToken) {
					// DDB-style explicit border override wins over owner/default color.
					const overrideBorderHex = token.borderColor
						? Number(token.borderColor.replace("#", "0x"))
						: null;
					const ownerBorderHex = token.color
						? Number(token.color.replace("#", "0x"))
						: 0x3b82f6;
					const borderColor = overrideBorderHex ?? ownerBorderHex;
					tokenBg.circle(size / 2, size / 2, size / 2);
					tokenBg.fill({
						color: token.color
							? Number(token.color.replace("#", "0x"))
							: 0x000000,
						alpha: token.color ? 0.25 : 0.12,
					});
					tokenBg.stroke({
						width: overrideBorderHex !== null ? 3 : 2,
						color: borderColor,
						alpha: 0.9,
					});
					if (activeInitiativeTokenId === token.id) {
						tokenBg.stroke({ width: 4, color: 0x10b981, alpha: 1 });
						// Add a subtle glow for the active initiative token
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
						// Foundry parity: imageScale multiplies sprite size but
						// never the grid footprint/token.
						sprite.width = footprintW * imageScale;
						sprite.height = footprintH * imageScale;
						// Re-center after scale so oversized art stays centered.
						const offsetX = (footprintW - sprite.width) / 2;
						const offsetY = (footprintH - sprite.height) / 2;
						sprite.x = offsetX;
						sprite.y = offsetY;
						sprite.anchor.set(0);
						sprite.alpha = token.render?.opacity ?? 1;
						sprite.blendMode = blendModeToPixi(
							token.render?.blendMode,
						) as Sprite["blendMode"];
						if (!isOverlayToken) {
							sprite.mask = tokenBg;
						}
						// NOTE: don't call sprite.scale.set(1) here — sprite.width/height
						// internally update scale to match our target footprint, and
						// resetting to 1 would collapse the sprite back to texture size.
						tokenLayer.addChild(container);
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
						tokenLayer.addChild(container);
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
					tokenLayer.addChild(container);
				}

				// Draw Status Bars (HP, AC, etc)
				if (!isOverlayToken) {
					const showSelectedBars =
						isSelected || activeInitiativeTokenId === token.id;
					// D2: bar visibility is config-driven — "always" shows for
					// everyone, "owner" shows to the token's owner, Warden always
					// sees bars, and otherwise bars appear on selection/active turn.
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
							// HP Bar
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

							// AC Bar (using arbitrary max of 30 for visualization)
							const ac = token.ac ?? token.armor_class;
							if (typeof ac === "number") {
								drawBar(ac, 30, 0x3b82f6); // Blue AC bar
							}
						}
					}
				}

				// Draw Conditions if they exist
				if (
					!isOverlayToken &&
					token.conditions &&
					token.conditions.length > 0
				) {
					// Draw small colored dots for conditions at the top right
					const dotRadius = 4;
					let dotOffsetX = size - dotRadius;

					for (const _condition of token.conditions) {
						const dot = new Graphics();
						dot.circle(dotOffsetX, dotRadius, dotRadius);
						dot.fill({ color: 0xeab308 }); // Amber for conditions
						dot.stroke({ color: 0x000000, width: 1 });
						container.addChild(dot);
						dotOffsetX -= dotRadius * 2 + 2;
					}
				}

				// ── Nameplate (always-visible token label, Foundry parity) ──────────────
				if (!isOverlayToken) {
					const label = new Text({
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
					label.anchor.set(0.5, 0);
					// Position nameplate below the token. Horizontal center is half
					// the footprint width; vertical anchor uses full footprint
					// height so non-square tokens still get a well-placed label.
					label.x = token.x * gridSize * zoom + footprintW / 2;
					label.y = token.y * gridSize * zoom + footprintH + 2;
					label.zIndex = token.layer * 10 + 11;
					// Highlight nameplate if token is active initiative token
					if (activeInitiativeTokenId === token.id) {
						label.style.fill = 0x10b981;
					} else if (isSelected) {
						label.style.fill = 0xfbbf24;
					}
					nameplateLayer.addChild(label);
				}

				container.on("pointerdown", (e) => {
					if (e.pointerType === "mouse" && e.button !== 0) {
						return;
					}
					e.stopPropagation();
					const additive = isAdditivePointerSelection(e);
					if (onTokenPointerSelect) {
						onTokenPointerSelect(token.id, additive);
					} else {
						setActiveTokenId(token.id);
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

					if (e.pointerType === "touch") {
						if (longPressRef.current) {
							window.clearTimeout(longPressRef.current.timer);
							longPressRef.current = null;
						}
						const timer = window.setTimeout(() => {
							updateToken(token.id, { rotation: (token.rotation + 90) % 360 });
							longPressRef.current = null;
						}, 550);
						longPressRef.current = {
							tokenId: token.id,
							timer,
							pointerId: e.pointerId,
						};
					}

					dragStateRef.current = { tokenId: token.id, pointerId: e.pointerId };
					onTokenDragStart?.(token.id);
				});
			}

			tokenLayer.sortableChildren = true;
		};

		void renderBackground();
		void renderAnimatedTiles();
		renderWeather();
		renderGrid();
		renderWalls();
		renderFog();
		void renderLighting();
		void renderTokens();

		return () => {
			renderActive = false;
		};
	}, [
		activeTokenId,
		activeTokenIds,
		targetedTokenIds,
		activeInitiativeTokenId,
		appReady,
		currentUserId,
		effectiveVisibleLayers,
		fogVisibleCells,
		gridSize,
		isWarden,
		onTokenPointerSelect,
		scene,
		setActiveTokenId,
		showGrid,
		tokens,
		walls,
		lightSources,
		weather,
		gridConfig?.type,
		onTokenDragStart,
		updateToken,
		zoom,
		fx.particleCount,
		activeStratumId,
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
				const { x: px, y: py } = getWorldPointerPosition(e.clientX, e.clientY);
				const gx = Math.floor(px / (gridSize * zoom));
				const gy = Math.floor(py / (gridSize * zoom));
				// Show snap-to-grid ghost cell via the shared layer ref so both
				// the stage-init effect and these pointer handlers agree on target.
				const ghostLayer = snapGhostLayerRef.current;
				if (ghostLayer) {
					ghostLayer.removeChildren();
					const step = gridSize * zoom;
					const ghost = new Graphics();
					ghost.rect(gx * step, gy * step, step, step);
					ghost.fill({ color: 0xfbbf24, alpha: 0.18 });
					ghost.stroke({ width: 2, color: 0xfbbf24, alpha: 0.7 });
					ghostLayer.addChild(ghost);
				}
				updateToken(dragState.tokenId, { x: gx, y: gy });
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
				onRequestZoom(nextZoom);
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

			const dragState = dragStateRef.current;
			if (dragState && dragState.pointerId === e.pointerId) {
				dragStateRef.current = null;
				snapGhostLayerRef.current?.removeChildren();
				onTokenDragEnd?.(dragState.tokenId);
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
				e.button === 2
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
