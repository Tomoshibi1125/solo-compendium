import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import {
	Application,
	Assets,
	Container,
	Graphics,
	Sprite,
	Text,
	Ticker,
} from "pixi.js";
import { useEffect, useMemo, useRef } from "react";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { computeVisibilityPolygon, createHexGrid } from "@/lib/vtt";

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
	size: "small" | "medium" | "large" | "huge";
	x: number;
	y: number;
	rotation: number;
	layer: number;
	locked: boolean;
	visible: boolean;
	hp?: number;
	hp_current?: number;
	maxHp?: number;
	hp_max?: number;
	ac?: number;
	armor_class?: number;
	conditions?: string[];
	render?: {
		mode?: "token" | "overlay";
		opacity?: number;
		blendMode?: TokenBlendMode;
	};
};

type SceneLike = {
	width: number;
	height: number;
	backgroundImage?: string;
	backgroundScale?: number;
	backgroundOffsetX?: number;
	backgroundOffsetY?: number;
	fogOfWar: boolean;
	fogData?: boolean[][];
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
	activeInitiativeTokenId?: string | null;
	setActiveTokenId: (id: string | null) => void;
	updateToken: (tokenId: string, updates: Partial<PlacedToken>) => void;
	walls?: import("@/lib/vtt").WallSegment[];
	lightSources?: import("@/lib/vtt").LightSource[];
	gridConfig?: { type: "square" | "hex"; size: number };
	onRequestZoom: (nextZoom: number) => void;
	onTokenDragStart?: (tokenId: string) => void;
	onTokenDragEnd?: (tokenId: string) => void;
	drawMode?: "none" | "ruler" | "cone" | "sphere" | "cube" | "wall";
	onWallCreated?: (x1: number, y1: number, x2: number, y2: number) => void;
	weather?: "none" | "rain" | "snow" | "embers" | "gas";
	/** Called when the PixiJS stage is ready, exposing the app and effects container for particle effects */
	onStageReady?: (app: Application, effectsContainer: Container) => void;
};

const SIZE_VALUES: Record<PlacedToken["size"], number> = {
	small: 32,
	medium: 48,
	large: 64,
	huge: 96,
};

const blendModeToPixi = (mode?: TokenBlendMode) => mode ?? "normal";

export function VttPixiStage({
	containerRef,
	scene,
	tokens,
	gridSize,
	zoom,
	showGrid,
	isWarden,
	effectiveVisibleLayers,
	activeTokenId,
	activeInitiativeTokenId,
	setActiveTokenId,
	updateToken,
	walls = [],
	lightSources = [],
	gridConfig = { type: "square", size: gridSize },
	onRequestZoom,
	onTokenDragStart,
	onTokenDragEnd,
	drawMode = "none",
	onWallCreated,
	weather = "none",
	onStageReady,
}: VttPixiStageProps) {
	const canvasHostRef = useRef<HTMLDivElement | null>(null);
	const appRef = useRef<Application | null>(null);
	const { dpr, fx } = usePerformanceProfile();

	const longPressRef = useRef<{
		tokenId: string;
		timer: number;
		pointerId: number;
	} | null>(null);

	const worldSize = useMemo(() => {
		const w = (scene?.width ?? 0) * gridSize;
		const h = (scene?.height ?? 0) * gridSize;
		return { w, h };
	}, [gridSize, scene?.height, scene?.width]);

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
	const rootContainerRef = useRef<Container | null>(null);

	// ── Persistent layer refs (Foundry VTT pattern: create once, update in-place) ──
	const bgLayerRef = useRef<Container | null>(null);
	const weatherLayerRef = useRef<Container | null>(null);
	const effectsLayerRef = useRef<Container | null>(null);
	const gridLayerRef = useRef<Container | null>(null);
	const wallsLayerRef = useRef<Container | null>(null);
	const drawingsLayerRef = useRef<Container | null>(null);
	const tokenLayerRef = useRef<Container | null>(null);
	const fogLayerRef = useRef<Container | null>(null);

	// ── Caching refs to avoid unnecessary layer rebuilds ──
	const currentBgUrlRef = useRef<string | null>(null);
	const renderIdRef = useRef<number>(0);

	// ── Callback refs: hold latest callback without triggering effects ──
	const setActiveTokenIdRef = useRef(setActiveTokenId);
	setActiveTokenIdRef.current = setActiveTokenId;
	const updateTokenRef = useRef(updateToken);
	updateTokenRef.current = updateToken;
	const onTokenDragStartRef = useRef(onTokenDragStart);
	onTokenDragStartRef.current = onTokenDragStart;
	const onStageReadyRef = useRef(onStageReady);
	onStageReadyRef.current = onStageReady;

	useEffect(() => {
		if (!canvasHostRef.current) return;
		if (appRef.current) return;

		let isMounted = true;
		const app = new Application();
		appRef.current = app;

		let destroyed = false;

		(async () => {
			try {
				await app.init({
					backgroundAlpha: 0,
					antialias: true,
					resolution: Math.min(window.devicePixelRatio || 1, dpr[1]),
					autoDensity: true,
					resizeTo: canvasHostRef.current ?? undefined,
				});
			} catch {
				return;
			}
			if (!isMounted || !canvasHostRef.current) {
				try {
					app.destroy(true, { children: true, texture: true });
				} catch {
					// ignore
				}
				return;
			}

			if (destroyed) {
				try {
					app.destroy(true, { children: true, texture: true });
				} catch {
					// ignore
				}
				return;
			}

			app.canvas.style.display = "block";
			app.canvas.style.touchAction = "none";

			canvasHostRef.current?.appendChild(app.canvas);
		})();

		return () => {
			isMounted = false;
			destroyed = true;
			if (appRef.current) {
				try {
					appRef.current.destroy(true);
				} catch {
					// ignore
				}
				appRef.current = null;
			}
		};
	}, [dpr[1]]);

	// Scale the stage to fit the world within the container
	useEffect(() => {
		const app = appRef.current;
		if (!app?.renderer || !app.stage) return;
		if (worldSize.w <= 0 || worldSize.h <= 0) return;

		const screenW = app.screen.width;
		const screenH = app.screen.height;
		const scale = Math.min(screenW / worldSize.w, screenH / worldSize.h, 1);

		app.stage.scale.set(scale);
		// Center the world within the viewport
		app.stage.x = (screenW - worldSize.w * scale) / 2;
		app.stage.y = (screenH - worldSize.h * scale) / 2;
	}, [worldSize.w, worldSize.h]);

	useEffect(() => {
		const app = appRef.current;
		if (!app) return;

		const stage = app.stage;

		// Only create layer containers if they don't exist yet (Foundry VTT pattern)
		let bg = bgLayerRef.current;
		let weatherLayer = weatherLayerRef.current;
		let effectsLayer = effectsLayerRef.current;
		let grid = gridLayerRef.current;
		let wallsLayer = wallsLayerRef.current;
		let drawings = drawingsLayerRef.current;
		let tokenLayer = tokenLayerRef.current;
		let fog = fogLayerRef.current;

		if (!rootContainerRef.current) {
			stage.removeChildren();
			const root = new Container();
			rootContainerRef.current = root;
			stage.addChild(root);

			bg = new Container();
			weatherLayer = new Container();
			effectsLayer = new Container();
			grid = new Container();
			wallsLayer = new Container();
			drawings = new Container();
			tokenLayer = new Container();
			fog = new Container();

			bgLayerRef.current = bg;
			weatherLayerRef.current = weatherLayer;
			effectsLayerRef.current = effectsLayer;
			gridLayerRef.current = grid;
			wallsLayerRef.current = wallsLayer;
			drawingsLayerRef.current = drawings;
			tokenLayerRef.current = tokenLayer;
			fogLayerRef.current = fog;

			root.addChild(bg);
			root.addChild(weatherLayer);
			root.addChild(effectsLayer);
			root.addChild(grid);
			root.addChild(wallsLayer);
			root.addChild(drawings);
			root.addChild(tokenLayer);
			root.addChild(fog);

			// Expose the app + effects container
			onStageReadyRef.current?.(app, effectsLayer);

			// Persist drawing graphics instance
			if (!drawingGraphicsRef.current) {
				drawingGraphicsRef.current = new Graphics();
			}
			const drawOverlay = drawingGraphicsRef.current;
			drawOverlay.zIndex = 1000;
			root.addChild(drawOverlay);
		}

		if (!bg || !weatherLayer || !grid || !wallsLayer || !tokenLayer || !fog) return;

		const renderBackground = async () => {
			const currentRenderId = ++renderIdRef.current;

			if (!effectiveVisibleLayers[0] || !scene?.backgroundImage) {
				bg.visible = false;
				return;
			}
			bg.visible = true;

			// If the image hasn't changed, just update transforms
			if (currentBgUrlRef.current === scene.backgroundImage && bg.children.length > 0) {
				const sprite = bg.children[0] as Sprite;
				sprite.x = (scene.backgroundOffsetX ?? 0) * zoom;
				sprite.y = (scene.backgroundOffsetY ?? 0) * zoom;
				const scale = scene.backgroundScale ?? 1;
				sprite.scale.set(scale);
				sprite.width = (scene.width ?? 0) * gridSize * zoom * scale;
				sprite.height = (scene.height ?? 0) * gridSize * zoom * scale;
				return;
			}

			try {
				// Await the texture load BEFORE clearing the old background
				const texture = await Assets.load(scene.backgroundImage);
				if (currentRenderId !== renderIdRef.current) return; // Abort if superseded

				const sprite = Sprite.from(texture as never);
				sprite.x = (scene.backgroundOffsetX ?? 0) * zoom;
				sprite.y = (scene.backgroundOffsetY ?? 0) * zoom;
				const scale = scene.backgroundScale ?? 1;
				sprite.scale.set(scale);
				sprite.width = (scene.width ?? 0) * gridSize * zoom * scale;
				sprite.height = (scene.height ?? 0) * gridSize * zoom * scale;
				sprite.alpha = 0.95;

				bg.removeChildren();
				bg.addChild(sprite);
				currentBgUrlRef.current = scene.backgroundImage;
			} catch {
				// If load fails, clear the background
				bg.removeChildren();
				currentBgUrlRef.current = null;
			}
		};

		const renderWeather = () => {
			// Clean up previous emitter
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
			if (!showGrid) return;

			const g = new Graphics();
			g.alpha = 0.2;
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

			g.stroke({ width: 1, color, alpha: 0.4 });

			grid.addChild(g);
		};

		const renderWalls = () => {
			wallsLayer.removeChildren();
			if (!walls || walls.length === 0) return;

			const wg = new Graphics();
			// Walls are drawn in blueish-grey for Warden, mostly invisible for players but we draw them for both right now
			// so players know why they can't see past it (or we can hide for players). Let's make them subtle for players.
			const wallColor = isWarden ? 0xef4444 : 0x000000;
			const wallAlpha = isWarden ? 0.8 : 0.3;

			for (const wall of walls) {
				wg.moveTo(wall.x1 * gridSize * zoom, wall.y1 * gridSize * zoom);
				wg.lineTo(wall.x2 * gridSize * zoom, wall.y2 * gridSize * zoom);
			}

			wg.stroke({
				width: 4,
				color: wallColor,
				alpha: wallAlpha,
				join: "miter",
				cap: "square",
			});

			wallsLayer.addChild(wg);
		};

		const renderFog = () => {
			fog.removeChildren();
			if (!scene?.fogOfWar || !scene.fogData) return;

			const fg = new Graphics();
			fg.alpha = isWarden ? 0.5 : 0.85;
			const step = gridSize * zoom;
			for (let y = 0; y < scene.fogData.length; y += 1) {
				const row = scene.fogData[y];
				if (!row) continue;
				for (let x = 0; x < row.length; x += 1) {
					if (row[x]) continue;
					fg.rect(x * step, y * step, step, step);
				}
			}

			fg.fill({ color: 0x000000, alpha: 0.8 });
			fog.addChild(fg);

			// Line of Sight masking
			if (!isWarden) {
				// Collect tokens that grant vision (owned tokens or all characters if none selected)
				const visionSources = activeTokenId
					? tokens.filter((t) => t.id === activeTokenId)
					: tokens.filter((t) => t.tokenType === "character" && (!t.ownerId || t.ownerId === user?.id));

				if (visionSources.length > 0) {
					const losMask = new Graphics();
					losMask.fill({ color: 0xffffff }); // this will be our mask area

					for (const source of visionSources) {
						const vision = {
							tokenId: source.id,
							x: source.x,
							y: source.y,
							visionRange: 12, // 60ft default vision (12 squares)
							darkvisionRange: 0,
							blindsightRange: 0,
						};

						const polygon = computeVisibilityPolygon(
							vision,
							walls || [],
							gridSize * zoom,
							72,
						);

						if (polygon.vertices.length > 0) {
							losMask.moveTo(polygon.vertices[0][0], polygon.vertices[0][1]);
							for (let i = 1; i < polygon.vertices.length; i++) {
								losMask.lineTo(polygon.vertices[i][0], polygon.vertices[i][1]);
							}
							losMask.closePath();
						}
					}

					// Create a dark overlay that covers the whole map
					const darkness = new Graphics();
					darkness.rect(
						0,
						0,
						(scene?.width || 100) * step,
						(scene?.height || 100) * step,
					);
					darkness.fill({ color: 0x000000, alpha: 0.85 });

					fog.addChild(darkness);
					fog.addChild(losMask);
					darkness.mask = losMask;
				}
			}
		};

		const renderLighting = async () => {
			// Create a render texture for lights to masked on top
			if (lightSources.length === 0) return;
			const lightLayer = new Graphics();
			lightLayer.blendMode = "add";

			for (const light of lightSources) {
				const cx = light.x * gridSize * zoom;
				const cy = light.y * gridSize * zoom;
				const rBright = light.brightRadius * gridSize * zoom;
				const rDim = light.dimRadius * gridSize * zoom;

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
					walls,
					gridSize * zoom,
					72,
				);

				const lightG = new Graphics();
				// Draw dim light
				lightG.circle(cx, cy, rDim);
				lightG.fill({
					color: Number(light.color.replace("#", "0x")),
					alpha: light.intensity * 0.3,
				});

				// Draw bright light
				lightG.circle(cx, cy, rBright);
				lightG.fill({
					color: Number(light.color.replace("#", "0x")),
					alpha: light.intensity * 0.7,
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

			fog.addChild(lightLayer);
		};

		const renderTokens = async () => {
			const currentRenderId = ++renderIdRef.current;

			const visible = tokens.filter((token) => {
				if (!effectiveVisibleLayers[token.layer]) return false;
				return isWarden ? true : token.visible;
			});

			// Pre-load all textures first so we don't yield during construction
			const textures: Record<string, any> = {};
			for (const token of visible) {
				if (token.imageUrl) {
					try {
						textures[token.id] = await Assets.load(token.imageUrl);
					} catch {
						// ignore
					}
				}
			}

			if (currentRenderId !== renderIdRef.current) return; // Abort if a newer render started

			// Now synchronously rebuild the token layer
			tokenLayer.removeChildren();

			for (const token of visible) {
				const size = SIZE_VALUES[token.size] * zoom;
				const isOverlayToken =
					token.render?.mode === "overlay" ||
					token.tokenType === "effect" ||
					token.tokenType === "prop" ||
					(!!token.imageUrl &&
						(token.imageUrl.includes("/generated/props/") ||
							token.imageUrl.includes("/generated/effects/")));

				const container = new Container();
				container.x = token.x * gridSize * zoom;
				container.y = token.y * gridSize * zoom;
				container.width = size;
				container.height = size;
				container.rotation = (token.rotation * Math.PI) / 180;
				container.zIndex = token.layer * 10 + 10;
				container.eventMode = "static";
				container.cursor = token.locked ? "default" : "pointer";

				const tokenBg = new Graphics();
				if (!isOverlayToken) {
					const borderColor = token.color
						? Number(token.color.replace("#", "0x"))
						: 0x3b82f6;
					tokenBg.circle(size / 2, size / 2, size / 2);
					tokenBg.fill({
						color: token.color
							? Number(token.color.replace("#", "0x"))
							: 0x000000,
						alpha: token.color ? 0.25 : 0.12,
					});
					tokenBg.stroke({ width: 2, color: borderColor, alpha: 0.9 });
					if (activeInitiativeTokenId === token.id) {
						tokenBg.stroke({ width: 4, color: 0x10b981, alpha: 1 });
						// Add a subtle glow for the active initiative token
						const glow = new Graphics();
						glow.circle(size / 2, size / 2, size / 2 + 4);
						glow.fill({ color: 0x10b981, alpha: 0.3 });
						container.addChild(glow);
					} else if (activeTokenId === token.id) {
						tokenBg.stroke({ width: 3, color: 0xfbbf24, alpha: 0.9 });
					}
				}
				container.addChild(tokenBg);

				if (token.imageUrl && textures[token.id]) {
					const sprite = Sprite.from(textures[token.id] as never);
					sprite.width = size;
					sprite.height = size;
					sprite.anchor.set(0);
					sprite.alpha = token.render?.opacity ?? 1;
					sprite.blendMode = blendModeToPixi(
						token.render?.blendMode,
					) as Sprite["blendMode"];
					if (!isOverlayToken) {
						sprite.mask = tokenBg;
					}
					sprite.scale.set(1);
					tokenLayer.addChild(container);
					container.addChild(sprite);
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
					const isSelected =
						activeTokenId === token.id || activeInitiativeTokenId === token.id;
					// Only show bars if token is selected/hovered (or always if Warden config dictates, but for now selected)
					if (isSelected || isWarden) {
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

				container.on("pointerdown", (e) => {
					e.stopPropagation();
					setActiveTokenIdRef.current(token.id);
					window.dispatchEvent(
						new CustomEvent("vtt:token-pointerdown", {
							detail: { tokenId: token.id, pointerType: e.pointerType },
						}),
					);
					if (token.locked) return;

					if (e.pointerType === "touch") {
						if (longPressRef.current) {
							window.clearTimeout(longPressRef.current.timer);
							longPressRef.current = null;
						}
						const timer = window.setTimeout(() => {
							updateTokenRef.current(token.id, { rotation: (token.rotation + 90) % 360 });
							longPressRef.current = null;
						}, 550);
						longPressRef.current = {
							tokenId: token.id,
							timer,
							pointerId: e.pointerId,
						};
					}

					dragStateRef.current = { tokenId: token.id, pointerId: e.pointerId };
					onTokenDragStartRef.current?.(token.id);
				});
			}

			tokenLayer.sortableChildren = true;
		};

		void renderBackground();
		renderWeather();
		renderGrid();
		renderWalls();
		renderFog();
		void renderLighting();
		void renderTokens();

		const tickerObj = new Ticker();
		tickerObj.add((tick) => {
			// Emitter expects seconds (DeltaMS / 1000)
			if (weatherEmitterRef.current) {
				weatherEmitterRef.current.update(tick.deltaMS * 0.001);
			}
		});
		tickerObj.start();

		return () => {
			tickerObj.stop();
			tickerObj.destroy();
			if (weatherEmitterRef.current) {
				weatherEmitterRef.current.destroy();
				weatherEmitterRef.current = null;
			}
			// Don't destroy layer containers — they persist across re-renders
		};
	}, [
		activeTokenId,
		activeInitiativeTokenId,
		effectiveVisibleLayers,
		gridSize,
		isWarden,
		scene,
		showGrid,
		tokens,
		walls,
		lightSources,
		weather,
		gridConfig?.type,
		zoom,
		fx.particleCount,
	]);

	// Optimized Zoom Effect: Scale the root container instead of rebuilding the stage
	useEffect(() => {
		if (rootContainerRef.current) {
			rootContainerRef.current.scale.set(zoom);
		}
	}, [zoom]);

	useEffect(() => {
		const host = canvasHostRef.current;
		const app = appRef.current;
		if (!host || !app) return;

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
			const rect = host.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

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
				const rect = host.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const gx = Math.floor(x / (gridSize * zoom));
				const gy = Math.floor(y / (gridSize * zoom));
				updateTokenRef.current(dragState.tokenId, { x: gx, y: gy });
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
				const nextZoom = Math.max(0.5, Math.min(2, pinch.startZoom * ratio));
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
			if (drawMode !== "none") {
				const rect = host.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
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

			if (
				containerRef.current &&
				e.pointerType !== "mouse" &&
				pointersRef.current.size >= 2
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
		zoom,
		drawMode,
		onWallCreated,
	]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaY) < 1) return;

			// Strictly restrict zoom to Ctrl+Wheel interactions
			if (e.ctrlKey) {
				e.preventDefault();
				const direction = e.deltaY > 0 ? -1 : 1;
				const nextZoom = Math.max(0.5, Math.min(2, zoom + direction * 0.1));
				onRequestZoom(nextZoom);
			}
			// Otherwise standard behavior (allows scrolling if container is overflow-scroll)
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
		<div
			ref={canvasHostRef}
			className="w-full h-full relative touch-none"
		/>
	);
}
