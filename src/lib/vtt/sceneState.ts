import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

export const DEFAULT_SCENE_SETTINGS = {
	gridSize: 50,
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

export const getValidActiveTokenId = (
	activeTokenId: string | null,
	tokens: VTTTokenInstance[],
) => {
	if (!activeTokenId) return null;
	return tokens.some((token) => token.id === activeTokenId)
		? activeTokenId
		: null;
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
});

export const duplicateVttScene = (scene: VTTScene): VTTScene => ({
	...scene,
	id: createVttSceneId(),
	name: `${scene.name} (copy)`,
	tokens: scene.tokens.map((token) => ({
		...token,
		id: createVttTokenInstanceId(),
	})),
});

export const normalizeVttScene = (scene: VTTScene): VTTScene => ({
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
