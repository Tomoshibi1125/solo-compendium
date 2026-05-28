import { DEFAULT_SCENE_GRID_OPACITY } from "@/lib/vtt/backgroundTransform";
import type {
	LightSource,
	VTTAnimatedTile,
	VTTRiftRegion,
	VTTScene,
	VTTSceneLevel,
	VTTTokenBar,
	VTTTokenInstance,
	WallSegment,
} from "@/types/vtt";

// -------------------------------------------------------------------
// Misty Pearl A2 — Scene Strata (Foundry v14 multi-floor parity).
// Pure helpers + a backwards-compat normalizer so legacy scenes
// (authored before A2 shipped) get an implicit single ground stratum.
// -------------------------------------------------------------------

/** Stable id of the implicit ground stratum used for back-compat. */
export const DEFAULT_STRATUM_ID = "stratum-ground" as const;

export const createVttSceneLevelId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `stratum-${crypto.randomUUID()}`;
	}
	return `stratum-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Returns the scene with at least one stratum. If the input already
 * has `levels` populated, returns the same reference. Otherwise
 * synthesizes a single ground stratum that carries every existing
 * wall / light id so the renderer can keep treating them as
 * stratum-scoped going forward.
 */
export const normalizeVttSceneLevels = (scene: VTTScene): VTTScene => {
	if (scene.levels && scene.levels.length > 0) return scene;
	const wallIds = (scene.walls ?? []).map((w) => w.id);
	const lightIds = (scene.lights ?? []).map((l) => l.id);
	const ground: VTTSceneLevel = {
		id: DEFAULT_STRATUM_ID,
		name: "Surface",
		elevation: 0,
		order: 0,
		visibleToPlayers: true,
		backgroundImage: scene.backgroundImage,
		wallIds,
		lightIds,
	};
	return { ...scene, levels: [ground] };
};

export const addLevelToScene = (
	scene: VTTScene,
	level: VTTSceneLevel,
): VTTScene => ({
	...scene,
	levels: [...(scene.levels ?? []), level],
});

export const updateLevelInScene = (
	scene: VTTScene,
	levelId: string,
	updates: Partial<VTTSceneLevel>,
): VTTScene => {
	const levels = scene.levels ?? [];
	let didChange = false;
	const next = levels.map((level) => {
		if (level.id !== levelId) return level;
		didChange = true;
		return { ...level, ...updates, id: level.id };
	});
	if (!didChange) return scene;
	return { ...scene, levels: next };
};

export const removeLevelFromScene = (
	scene: VTTScene,
	levelId: string,
): VTTScene => {
	const levels = scene.levels ?? [];
	if (levels.length <= 1) return scene; // refuse to drop the last stratum
	const next = levels.filter((l) => l.id !== levelId);
	if (next.length === levels.length) return scene;
	// Reassign any token still on the removed stratum to the lowest
	// remaining one so they don't disappear.
	const fallback = next.reduce((acc, cur) =>
		cur.order < acc.order ? cur : acc,
	);
	const tokens = scene.tokens.map((token) =>
		token.level === levelId ? { ...token, level: fallback.id } : token,
	);
	return { ...scene, levels: next, tokens };
};

/**
 * Move a token to the given stratum. Updates `level` and resets
 * `elevation` to the stratum's elevation. Returns the same reference
 * when the token id is unknown.
 */
export const moveTokenToLevel = (
	scene: VTTScene,
	tokenId: string,
	levelId: string,
): VTTScene => {
	const level = (scene.levels ?? []).find((l) => l.id === levelId);
	if (!level) return scene;
	let didChange = false;
	const tokens = scene.tokens.map((token) => {
		if (token.id !== tokenId) return token;
		if (token.level === levelId) return token;
		didChange = true;
		return { ...token, level: levelId, elevation: level.elevation };
	});
	if (!didChange) return scene;
	return { ...scene, tokens };
};

export const DEFAULT_SCENE_SETTINGS = {
	gridSize: 50,
	gridOpacity: DEFAULT_SCENE_GRID_OPACITY,
	backgroundScale: 1,
	backgroundOffsetX: 0,
	backgroundOffsetY: 0,
} as const;

export const createVttSceneId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `scene-${crypto.randomUUID()}`;
	}
	return `scene-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createVttTokenInstanceId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `token-${crypto.randomUUID()}`;
	}
	return `token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createVttLightSourceId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `light-${crypto.randomUUID()}`;
	}
	return `light-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Append a `LightSource` to a scene's `lights` collection. Non-mutating; the
 * returned scene reference is a new object suitable for React state updates
 * and scene-sync broadcasting.
 */
export const addLightToScene = (
	scene: VTTScene,
	light: LightSource,
): VTTScene => ({
	...scene,
	lights: [...(scene.lights ?? []), light],
});

/**
 * Patch a single light on a scene by id. Returns the original scene
 * reference when the id is unknown (so callers can skip a broadcast).
 */
export const updateLightInScene = (
	scene: VTTScene,
	lightId: string,
	updates: Partial<LightSource>,
): VTTScene => {
	const lights = scene.lights ?? [];
	let didChange = false;
	const nextLights = lights.map((light) => {
		if (light.id !== lightId) return light;
		didChange = true;
		return { ...light, ...updates, id: light.id };
	});
	if (!didChange) return scene;
	return { ...scene, lights: nextLights };
};

/**
 * Remove a light from a scene by id. Returns the original scene reference
 * when the id is unknown (so callers can skip a broadcast).
 */
export const removeLightFromScene = (
	scene: VTTScene,
	lightId: string,
): VTTScene => {
	const lights = scene.lights ?? [];
	const nextLights = lights.filter((light) => light.id !== lightId);
	if (nextLights.length === lights.length) return scene;
	return { ...scene, lights: nextLights };
};

export const createVttWallId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `wall-${crypto.randomUUID()}`;
	}
	return `wall-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Append a `WallSegment` to a scene's `walls` collection. Non-mutating; the
 * returned scene reference is a new object suitable for React state updates
 * and scene-sync broadcasting.
 */
export const addWallToScene = (
	scene: VTTScene,
	wall: WallSegment,
): VTTScene => ({
	...scene,
	walls: [...(scene.walls ?? []), wall],
});

/**
 * Patch a single wall on a scene by id. Returns the original scene reference
 * when the id is unknown (so callers can skip a broadcast).
 */
export const updateWallInScene = (
	scene: VTTScene,
	wallId: string,
	updates: Partial<WallSegment>,
): VTTScene => {
	const walls = scene.walls ?? [];
	let didChange = false;
	const nextWalls = walls.map((wall) => {
		if (wall.id !== wallId) return wall;
		didChange = true;
		return { ...wall, ...updates, id: wall.id };
	});
	if (!didChange) return scene;
	return { ...scene, walls: nextWalls };
};

/**
 * Remove a wall from a scene by id. Returns the original scene reference
 * when the id is unknown (so callers can skip a broadcast).
 */
export const removeWallFromScene = (
	scene: VTTScene,
	wallId: string,
): VTTScene => {
	const walls = scene.walls ?? [];
	const nextWalls = walls.filter((wall) => wall.id !== wallId);
	if (nextWalls.length === walls.length) return scene;
	return { ...scene, walls: nextWalls };
};

// -------------------------------------------------------------------
// Misty Pearl A3 — Rift Region CRUD helpers (Foundry v14 Scene Regions
// parity). Mirror the wall/light helper pattern: non-mutating, return a
// new scene object when something actually changed, return the original
// reference when the target id is unknown.
// -------------------------------------------------------------------

export const createVttRegionId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `region-${crypto.randomUUID()}`;
	}
	return `region-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const addRegionToScene = (
	scene: VTTScene,
	region: VTTRiftRegion,
): VTTScene => ({
	...scene,
	riftRegions: [...(scene.riftRegions ?? []), region],
});

export const updateRegionInScene = (
	scene: VTTScene,
	regionId: string,
	updates: Partial<VTTRiftRegion>,
): VTTScene => {
	const regions = scene.riftRegions ?? [];
	let didChange = false;
	const next = regions.map((region) => {
		if (region.id !== regionId) return region;
		didChange = true;
		return { ...region, ...updates, id: region.id };
	});
	if (!didChange) return scene;
	return { ...scene, riftRegions: next };
};

export const removeRegionFromScene = (
	scene: VTTScene,
	regionId: string,
): VTTScene => {
	const regions = scene.riftRegions ?? [];
	const next = regions.filter((region) => region.id !== regionId);
	if (next.length === regions.length) return scene;
	return { ...scene, riftRegions: next };
};

// -------------------------------------------------------------------
// Misty Pearl B4 — Animated tile CRUD helpers.
// -------------------------------------------------------------------

export const createVttAnimatedTileId = () => {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return `tile-${crypto.randomUUID()}`;
	}
	return `tile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const addAnimatedTileToScene = (
	scene: VTTScene,
	tile: VTTAnimatedTile,
): VTTScene => ({
	...scene,
	animatedTiles: [...(scene.animatedTiles ?? []), tile],
});

export const updateAnimatedTileInScene = (
	scene: VTTScene,
	tileId: string,
	updates: Partial<VTTAnimatedTile>,
): VTTScene => {
	const tiles = scene.animatedTiles ?? [];
	let didChange = false;
	const next = tiles.map((tile) => {
		if (tile.id !== tileId) return tile;
		didChange = true;
		return { ...tile, ...updates, id: tile.id };
	});
	if (!didChange) return scene;
	return { ...scene, animatedTiles: next };
};

export const removeAnimatedTileFromScene = (
	scene: VTTScene,
	tileId: string,
): VTTScene => {
	const tiles = scene.animatedTiles ?? [];
	const next = tiles.filter((tile) => tile.id !== tileId);
	if (next.length === tiles.length) return scene;
	return { ...scene, animatedTiles: next };
};

/**
 * Returns true when the given URL is a video MIME we can render as an
 * animated tile via Pixi `VideoTexture` / `<video>` element.
 */
export const isAnimatedTileUrl = (url: string | undefined): boolean => {
	if (!url) return false;
	const lower = url.toLowerCase();
	return (
		lower.endsWith(".mp4") ||
		lower.endsWith(".webm") ||
		lower.endsWith(".ogv") ||
		lower.endsWith(".mov") ||
		lower.endsWith(".gif") ||
		(lower.endsWith(".webp") && lower.includes("anim"))
	);
};

export const getValidActiveTokenId = (
	activeTokenId: string | null,
	tokens: VTTTokenInstance[],
) => {
	if (!activeTokenId) return null;
	return tokens.some((token) => token.id === activeTokenId)
		? activeTokenId
		: null;
};

export const normalizeVttTokenBars = (
	token: VTTTokenInstance,
): VTTTokenInstance => {
	const existingBars = Array.isArray(token.bars)
		? token.bars
				.filter(
					(bar): bar is VTTTokenBar =>
						typeof bar?.id === "string" &&
						typeof bar.label === "string" &&
						typeof bar.current === "number" &&
						typeof bar.max === "number" &&
						typeof bar.color === "string" &&
						(bar.visible === "all" ||
							bar.visible === "controllers" ||
							bar.visible === "gm"),
				)
				.slice(0, 3)
		: [];
	const hp = token.hp ?? token.hp_current;
	const maxHp = token.maxHp ?? token.hp_max;
	if (
		existingBars.length > 0 ||
		typeof hp !== "number" ||
		typeof maxHp !== "number" ||
		maxHp <= 0
	) {
		if (!Array.isArray(token.bars)) return token;
		return { ...token, bars: existingBars };
	}
	return {
		...token,
		hp,
		maxHp,
		bars: [
			{
				id: "hp",
				label: "HP",
				current: hp,
				max: maxHp,
				color: "#22c55e",
				visible: "all",
			},
		],
	};
};

interface BuildDefaultVttSceneInput {
	name: string;
	width?: number;
	height?: number;
}

export const buildDefaultVttScene = ({
	name,
	width = 20,
	height = 20,
}: BuildDefaultVttSceneInput): VTTScene => ({
	id: createVttSceneId(),
	name,
	width,
	height,
	gridSize: DEFAULT_SCENE_SETTINGS.gridSize,
	gridOpacity: DEFAULT_SCENE_SETTINGS.gridOpacity,
	backgroundScale: DEFAULT_SCENE_SETTINGS.backgroundScale,
	backgroundOffsetX: DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
	backgroundOffsetY: DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
	tokens: [],
	drawings: [],
	annotations: [],
	walls: [],
	lights: [],
	fogOfWar: false,
	tokenVisionRevealsFog: false,
	gridType: "square",
	weather: "clear",
	musicMood: null,
	musicAutoplay: false,
	musicPlaylistId: null,
	musicTrackId: null,
	terrain: [],
	ambientSounds: [],
});

export const duplicateVttScene = (scene: VTTScene): VTTScene => ({
	...scene,
	id: createVttSceneId(),
	name: `${scene.name} (copy)`,
	tokens: scene.tokens.map((token) => ({
		...normalizeVttTokenBars(token),
		id: createVttTokenInstanceId(),
	})),
});

export const normalizeVttScene = (scene: VTTScene): VTTScene => ({
	...scene,
	gridSize: scene.gridSize ?? DEFAULT_SCENE_SETTINGS.gridSize,
	gridOpacity: scene.gridOpacity ?? DEFAULT_SCENE_SETTINGS.gridOpacity,
	backgroundScale:
		scene.backgroundScale ?? DEFAULT_SCENE_SETTINGS.backgroundScale,
	backgroundOffsetX:
		scene.backgroundOffsetX ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
	backgroundOffsetY:
		scene.backgroundOffsetY ?? DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
	tokens: Array.isArray(scene.tokens)
		? scene.tokens.map(normalizeVttTokenBars)
		: [],
	drawings: Array.isArray(scene.drawings) ? scene.drawings : [],
	annotations: Array.isArray(scene.annotations) ? scene.annotations : [],
	walls: Array.isArray(scene.walls) ? scene.walls : [],
	lights: Array.isArray(scene.lights) ? scene.lights : [],
	tokenVisionRevealsFog: scene.tokenVisionRevealsFog ?? false,
	musicMood: scene.musicMood ?? null,
	musicAutoplay: scene.musicAutoplay ?? false,
	musicPlaylistId: scene.musicPlaylistId ?? null,
	musicTrackId: scene.musicTrackId ?? null,
	terrain: Array.isArray(scene.terrain) ? scene.terrain : [],
	ambientSounds: Array.isArray(scene.ambientSounds) ? scene.ambientSounds : [],
	weather: scene.weather,
	gridType: scene.gridType ?? "square",
});

export const upsertVttScene = (
	scenes: VTTScene[],
	nextScene: VTTScene,
): VTTScene[] => {
	const index = scenes.findIndex((scene) => scene.id === nextScene.id);
	if (index === -1) return [...scenes, nextScene];
	const next = [...scenes];
	next[index] = nextScene;
	return next;
};

interface DeleteVttSceneInput {
	scenes: VTTScene[];
	sceneId: string;
	currentSceneId?: string | null;
	liveSceneId?: string | null;
	replacementSceneName?: string;
}

interface DeleteVttSceneResult {
	scenes: VTTScene[];
	currentScene: VTTScene | null;
	currentSceneId: string | null;
	liveSceneId: string | null;
	deletedScene: VTTScene | null;
	createdReplacementScene: boolean;
}

export const deleteVttScene = ({
	scenes,
	sceneId,
	currentSceneId = null,
	liveSceneId = null,
	replacementSceneName = "Scene 1",
}: DeleteVttSceneInput): DeleteVttSceneResult => {
	const deletedScene = scenes.find((scene) => scene.id === sceneId) ?? null;
	if (!deletedScene) {
		const preservedCurrentScene =
			(currentSceneId
				? (scenes.find((scene) => scene.id === currentSceneId) ?? null)
				: null) ??
			scenes[0] ??
			null;
		const preservedLiveScene =
			(liveSceneId
				? (scenes.find((scene) => scene.id === liveSceneId) ?? null)
				: null) ?? preservedCurrentScene;
		return {
			scenes,
			currentScene: preservedCurrentScene,
			currentSceneId: preservedCurrentScene?.id ?? null,
			liveSceneId: preservedLiveScene?.id ?? null,
			deletedScene: null,
			createdReplacementScene: false,
		};
	}

	const remainingScenes = scenes.filter((scene) => scene.id !== sceneId);
	const deletedIndex = scenes.findIndex((scene) => scene.id === sceneId);
	const createdReplacementScene = remainingScenes.length === 0;
	const nextScenes = createdReplacementScene
		? [buildDefaultVttScene({ name: replacementSceneName })]
		: remainingScenes;
	const preservedCurrentScene = currentSceneId
		? (nextScenes.find((scene) => scene.id === currentSceneId) ?? null)
		: null;
	const preservedLiveScene = liveSceneId
		? (nextScenes.find((scene) => scene.id === liveSceneId) ?? null)
		: null;
	const fallbackScene =
		preservedCurrentScene ??
		preservedLiveScene ??
		nextScenes[Math.min(Math.max(deletedIndex, 0), nextScenes.length - 1)] ??
		nextScenes[0] ??
		null;

	return {
		scenes: nextScenes,
		currentScene: fallbackScene,
		currentSceneId: fallbackScene?.id ?? null,
		liveSceneId: preservedLiveScene?.id ?? fallbackScene?.id ?? null,
		deletedScene,
		createdReplacementScene,
	};
};

interface RemoveAssetFromVttScenesResult {
	scenes: VTTScene[];
	didChange: boolean;
	removedBackgroundSceneIds: string[];
	removedTokenIds: string[];
}

export const removeAssetFromVttScenes = (
	scenes: VTTScene[],
	assetUrl: string,
): RemoveAssetFromVttScenesResult => {
	let didChange = false;
	const removedBackgroundSceneIds: string[] = [];
	const removedTokenIds: string[] = [];

	const nextScenes = scenes.map((scene) => {
		const backgroundMatches = scene.backgroundImage === assetUrl;
		const nextTokens = scene.tokens.filter((token) => {
			const matches = token.imageUrl === assetUrl;
			if (matches) {
				removedTokenIds.push(token.id);
			}
			return !matches;
		});

		if (!backgroundMatches && nextTokens.length === scene.tokens.length) {
			return scene;
		}

		didChange = true;
		if (backgroundMatches) {
			removedBackgroundSceneIds.push(scene.id);
		}

		return {
			...scene,
			backgroundImage: backgroundMatches ? undefined : scene.backgroundImage,
			gridOpacity: backgroundMatches
				? DEFAULT_SCENE_SETTINGS.gridOpacity
				: scene.gridOpacity,
			backgroundScale: backgroundMatches
				? DEFAULT_SCENE_SETTINGS.backgroundScale
				: scene.backgroundScale,
			backgroundOffsetX: backgroundMatches
				? DEFAULT_SCENE_SETTINGS.backgroundOffsetX
				: scene.backgroundOffsetX,
			backgroundOffsetY: backgroundMatches
				? DEFAULT_SCENE_SETTINGS.backgroundOffsetY
				: scene.backgroundOffsetY,
			tokens: nextTokens,
		};
	});

	return {
		scenes: nextScenes,
		didChange,
		removedBackgroundSceneIds,
		removedTokenIds,
	};
};

export interface VttScenesStateShape {
	scenes?: VTTScene[];
	currentSceneId?: string | null;
}

export interface LegacyVttScenesStateShape {
	scenes?: VTTScene[];
	currentScene?: string | null;
}

export type VttHydrationResult =
	| {
			kind: "empty";
			shouldCreateDefaultScene: boolean;
	  }
	| {
			kind: "hydrated";
			scenes: VTTScene[];
			liveSceneId: string | null;
			currentScene: VTTScene | null;
			shouldMigrateLegacyToRemote: boolean;
	  };

interface ComputeVttHydrationInput {
	storedState: VttScenesStateShape;
	legacyState: LegacyVttScenesStateShape | null;
	isWarden: boolean;
	hasCurrentScene: boolean;
}

/**
 * Pure reducer-style helper that decides how the VTT should hydrate scenes
 * from remote tool state + legacy local storage. Keeps the component's
 * hydration effect side-effect free and unit-testable.
 */
export const computeVttHydration = ({
	storedState,
	legacyState,
	isWarden,
	hasCurrentScene,
}: ComputeVttHydrationInput): VttHydrationResult => {
	const storedScenes = Array.isArray(storedState.scenes)
		? storedState.scenes
		: [];
	const legacyScenes = Array.isArray(legacyState?.scenes)
		? legacyState.scenes
		: [];
	const legacyCurrentId =
		typeof legacyState?.currentScene === "string"
			? legacyState.currentScene
			: null;
	const nextScenes = (
		storedScenes.length > 0 ? storedScenes : legacyScenes
	).map(normalizeVttScene);
	const nextCurrentId = storedState.currentSceneId ?? legacyCurrentId ?? null;

	if (nextScenes.length === 0) {
		return {
			kind: "empty",
			shouldCreateDefaultScene: isWarden,
		};
	}

	const hydratedScene =
		nextScenes.find((scene) => scene.id === nextCurrentId) ?? nextScenes[0];
	const shouldSetCurrent = !isWarden || !hasCurrentScene;
	const shouldMigrateLegacyToRemote =
		isWarden && storedScenes.length === 0 && legacyScenes.length > 0;

	return {
		kind: "hydrated",
		scenes: nextScenes,
		liveSceneId: nextCurrentId,
		currentScene: shouldSetCurrent ? hydratedScene : null,
		shouldMigrateLegacyToRemote,
	};
};
