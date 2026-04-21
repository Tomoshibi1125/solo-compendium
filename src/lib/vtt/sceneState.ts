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
