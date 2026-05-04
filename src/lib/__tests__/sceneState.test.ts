import { describe, expect, it } from "vitest";
import {
	addLightToScene,
	addWallToScene,
	buildDefaultVttScene,
	computeVttHydration,
	createVttLightSourceId,
	createVttSceneId,
	createVttTokenInstanceId,
	createVttWallId,
	DEFAULT_SCENE_SETTINGS,
	deleteVttScene,
	duplicateVttScene,
	getValidActiveTokenId,
	normalizeVttScene,
	normalizeVttTokenBars,
	removeAssetFromVttScenes,
	removeLightFromScene,
	removeWallFromScene,
	updateLightInScene,
	updateWallInScene,
	upsertVttScene,
} from "@/lib/vtt/sceneState";
import type {
	LightSource,
	VTTScene,
	VTTTokenInstance,
	WallSegment,
} from "@/types/vtt";

const createToken = (id: string): VTTTokenInstance => ({
	id,
	name: `Token ${id}`,
	size: "medium",
	x: 0,
	y: 0,
	rotation: 0,
	layer: 1,
	locked: false,
	visible: true,
});

describe("createVttSceneId", () => {
	it("returns scene-prefixed ids", () => {
		expect(createVttSceneId()).toMatch(/^scene-/);
	});

	it("returns collision-resistant ids across repeated calls", () => {
		const ids = new Set(Array.from({ length: 25 }, () => createVttSceneId()));
		expect(ids.size).toBe(25);
	});
});

describe("getValidActiveTokenId", () => {
	const tokens = [createToken("token-1"), createToken("token-2")];

	it("keeps the active token id when the token exists in the current scene", () => {
		expect(getValidActiveTokenId("token-2", tokens)).toBe("token-2");
	});

	it("returns null when the selected token no longer exists", () => {
		expect(getValidActiveTokenId("token-3", tokens)).toBeNull();
	});

	it("returns null when there is no active token", () => {
		expect(getValidActiveTokenId(null, tokens)).toBeNull();
	});
});

describe("normalizeVttTokenBars", () => {
	it("synthesizes a primary hp bar from legacy hp/maxHp fields", () => {
		const token = { ...createToken("token-1"), hp: 7, maxHp: 12 };
		const normalized = normalizeVttTokenBars(token);
		expect(normalized.bars).toEqual([
			{
				id: "hp",
				label: "HP",
				current: 7,
				max: 12,
				color: "#22c55e",
				visible: "all",
			},
		]);
		expect(normalized.hp).toBe(7);
		expect(normalized.maxHp).toBe(12);
	});

	it("uses legacy snake-case hp fields when camel-case fields are absent", () => {
		const token = { ...createToken("token-1"), hp_current: 3, hp_max: 8 };
		const normalized = normalizeVttTokenBars(token);
		expect(normalized.bars?.[0].current).toBe(3);
		expect(normalized.bars?.[0].max).toBe(8);
		expect(normalized.hp).toBe(3);
		expect(normalized.maxHp).toBe(8);
	});

	it("preserves existing bars and caps them to three valid entries", () => {
		const token: VTTTokenInstance = {
			...createToken("token-1"),
			hp: 1,
			maxHp: 2,
			bars: [
				{
					id: "hp",
					label: "HP",
					current: 1,
					max: 2,
					color: "#ef4444",
					visible: "all",
				},
				{
					id: "mana",
					label: "Mana",
					current: 4,
					max: 6,
					color: "#3b82f6",
					visible: "controllers",
				},
				{
					id: "focus",
					label: "Focus",
					current: 2,
					max: 3,
					color: "#eab308",
					visible: "gm",
				},
				{
					id: "overflow",
					label: "Overflow",
					current: 1,
					max: 1,
					color: "#ffffff",
					visible: "all",
				},
			],
		};
		const normalized = normalizeVttTokenBars(token);
		expect(normalized.bars).toHaveLength(3);
		expect(normalized.bars?.map((bar) => bar.id)).toEqual([
			"hp",
			"mana",
			"focus",
		]);
	});

	it("returns the same reference when no migration is needed", () => {
		const token = createToken("token-1");
		expect(normalizeVttTokenBars(token)).toBe(token);
	});
});

describe("createVttTokenInstanceId", () => {
	it("returns token-prefixed ids", () => {
		expect(createVttTokenInstanceId()).toMatch(/^token-/);
	});

	it("returns collision-resistant ids across repeated calls", () => {
		const ids = new Set(
			Array.from({ length: 25 }, () => createVttTokenInstanceId()),
		);
		expect(ids.size).toBe(25);
	});
});

describe("createVttLightSourceId", () => {
	it("returns light-prefixed ids", () => {
		expect(createVttLightSourceId()).toMatch(/^light-/);
	});

	it("returns collision-resistant ids across repeated calls", () => {
		const ids = new Set(
			Array.from({ length: 25 }, () => createVttLightSourceId()),
		);
		expect(ids.size).toBe(25);
	});
});

describe("addLightToScene", () => {
	const createLight = (id: string): LightSource => ({
		id,
		x: 5,
		y: 5,
		brightRadius: 6,
		dimRadius: 12,
		color: "#ffffff",
		intensity: 0.8,
		type: "torch",
	});

	it("appends the light to an empty scene", () => {
		const scene = buildDefaultVttScene({ name: "s" });
		const next = addLightToScene(scene, createLight("light-a"));
		expect(next.lights).toHaveLength(1);
		expect(next.lights[0].id).toBe("light-a");
	});

	it("appends without mutating the original scene", () => {
		const scene = buildDefaultVttScene({ name: "s" });
		const before = scene.lights.length;
		addLightToScene(scene, createLight("light-a"));
		expect(scene.lights.length).toBe(before);
	});

	it("preserves existing lights when appending", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: [createLight("light-a")],
		};
		const next = addLightToScene(scene, createLight("light-b"));
		expect(next.lights.map((l) => l.id)).toEqual(["light-a", "light-b"]);
	});

	it("handles scenes whose lights field is undefined", () => {
		// Simulates a scene coming from an older persisted shape.
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: undefined as unknown as LightSource[],
		};
		const next = addLightToScene(scene, createLight("light-a"));
		expect(next.lights).toHaveLength(1);
	});
});

describe("updateLightInScene", () => {
	const createLight = (id: string): LightSource => ({
		id,
		x: 5,
		y: 5,
		brightRadius: 6,
		dimRadius: 12,
		color: "#ffffff",
		intensity: 0.8,
		type: "torch",
	});

	it("patches a single light by id", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: [createLight("light-a"), createLight("light-b")],
		};
		const next = updateLightInScene(scene, "light-b", {
			brightRadius: 2,
			color: "#ff0000",
		});
		expect(next.lights[1].brightRadius).toBe(2);
		expect(next.lights[1].color).toBe("#ff0000");
		expect(next.lights[0].brightRadius).toBe(6);
	});

	it("never allows the id to be overwritten via updates", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: [createLight("light-a")],
		};
		const next = updateLightInScene(scene, "light-a", {
			id: "hijacked",
		} as Partial<LightSource>);
		expect(next.lights[0].id).toBe("light-a");
	});

	it("returns the same scene reference when the id is unknown", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: [createLight("light-a")],
		};
		const next = updateLightInScene(scene, "missing", { brightRadius: 99 });
		expect(next).toBe(scene);
	});

	it("does not mutate the input light objects", () => {
		const original = createLight("light-a");
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: [original],
		};
		updateLightInScene(scene, "light-a", { brightRadius: 99 });
		expect(original.brightRadius).toBe(6);
	});
});

describe("removeLightFromScene", () => {
	const createLight = (id: string): LightSource => ({
		id,
		x: 5,
		y: 5,
		brightRadius: 6,
		dimRadius: 12,
		color: "#ffffff",
		intensity: 0.8,
		type: "torch",
	});

	it("removes the matching light and preserves others", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: [
				createLight("light-a"),
				createLight("light-b"),
				createLight("light-c"),
			],
		};
		const next = removeLightFromScene(scene, "light-b");
		expect(next.lights.map((l) => l.id)).toEqual(["light-a", "light-c"]);
	});

	it("returns the same scene reference when the id is unknown", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: [createLight("light-a")],
		};
		const next = removeLightFromScene(scene, "missing");
		expect(next).toBe(scene);
	});

	it("handles removal from a scene with an undefined lights field", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			lights: undefined as unknown as LightSource[],
		};
		const next = removeLightFromScene(scene, "anything");
		// Either returns the original (fast path) or returns a scene with an
		// empty lights array — both are valid; we only assert no crash + no
		// spurious lights.
		expect(next.lights ?? []).toEqual([]);
	});
});

const createWall = (
	id: string,
	type: WallSegment["type"] = "wall",
): WallSegment => ({
	id,
	x1: 0,
	y1: 0,
	x2: 5,
	y2: 0,
	type,
});

describe("createVttWallId", () => {
	it("returns wall-prefixed ids", () => {
		expect(createVttWallId()).toMatch(/^wall-/);
	});

	it("returns collision-resistant ids across repeated calls", () => {
		const ids = new Set(Array.from({ length: 25 }, () => createVttWallId()));
		expect(ids.size).toBe(25);
	});
});

describe("addWallToScene", () => {
	it("appends the wall to an empty scene", () => {
		const scene = buildDefaultVttScene({ name: "s" });
		const next = addWallToScene(scene, createWall("wall-a"));
		expect(next.walls).toHaveLength(1);
		expect(next.walls[0].id).toBe("wall-a");
	});

	it("appends without mutating the original scene", () => {
		const scene = buildDefaultVttScene({ name: "s" });
		const before = scene.walls.length;
		addWallToScene(scene, createWall("wall-a"));
		expect(scene.walls.length).toBe(before);
	});

	it("preserves existing walls when appending", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: [createWall("wall-a")],
		};
		const next = addWallToScene(scene, createWall("wall-b", "door"));
		expect(next.walls.map((w) => w.id)).toEqual(["wall-a", "wall-b"]);
		expect(next.walls[1].type).toBe("door");
	});

	it("handles scenes whose walls field is undefined", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: undefined as unknown as WallSegment[],
		};
		const next = addWallToScene(scene, createWall("wall-a"));
		expect(next.walls).toHaveLength(1);
	});
});

describe("updateWallInScene", () => {
	it("patches a single wall by id", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: [createWall("wall-a"), createWall("wall-b")],
		};
		const next = updateWallInScene(scene, "wall-b", {
			type: "door",
			doorOpen: true,
		});
		expect(next.walls[1].type).toBe("door");
		expect(next.walls[1].doorOpen).toBe(true);
		expect(next.walls[0].type).toBe("wall");
	});

	it("never allows the id to be overwritten via updates", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: [createWall("wall-a")],
		};
		const next = updateWallInScene(scene, "wall-a", {
			id: "hijacked",
		} as Partial<WallSegment>);
		expect(next.walls[0].id).toBe("wall-a");
	});

	it("returns the same scene reference when the id is unknown", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: [createWall("wall-a")],
		};
		const next = updateWallInScene(scene, "missing", { type: "door" });
		expect(next).toBe(scene);
	});

	it("does not mutate the input wall objects", () => {
		const original = createWall("wall-a");
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: [original],
		};
		updateWallInScene(scene, "wall-a", { type: "door" });
		expect(original.type).toBe("wall");
	});
});

describe("removeWallFromScene", () => {
	it("removes the matching wall and preserves others", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: [createWall("wall-a"), createWall("wall-b"), createWall("wall-c")],
		};
		const next = removeWallFromScene(scene, "wall-b");
		expect(next.walls.map((w) => w.id)).toEqual(["wall-a", "wall-c"]);
	});

	it("returns the same scene reference when the id is unknown", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: [createWall("wall-a")],
		};
		const next = removeWallFromScene(scene, "missing");
		expect(next).toBe(scene);
	});

	it("handles removal from a scene with an undefined walls field", () => {
		const scene = {
			...buildDefaultVttScene({ name: "s" }),
			walls: undefined as unknown as WallSegment[],
		};
		const next = removeWallFromScene(scene, "anything");
		expect(next.walls ?? []).toEqual([]);
	});
});

describe("buildDefaultVttScene", () => {
	it("produces a scene with default grid and empty collections", () => {
		const scene = buildDefaultVttScene({ name: "Scene 1" });
		expect(scene.name).toBe("Scene 1");
		expect(scene.width).toBe(20);
		expect(scene.height).toBe(20);
		expect(scene.gridSize).toBe(DEFAULT_SCENE_SETTINGS.gridSize);
		expect(scene.gridOpacity).toBe(DEFAULT_SCENE_SETTINGS.gridOpacity);
		expect(scene.backgroundScale).toBe(DEFAULT_SCENE_SETTINGS.backgroundScale);
		expect(scene.tokens).toEqual([]);
		expect(scene.drawings).toEqual([]);
		expect(scene.annotations).toEqual([]);
		expect(scene.walls).toEqual([]);
		expect(scene.lights).toEqual([]);
		expect(scene.terrain).toEqual([]);
		expect(scene.ambientSounds).toEqual([]);
		expect(scene.musicMood).toBeNull();
		expect(scene.musicAutoplay).toBe(false);
		expect(scene.musicPlaylistId).toBeNull();
		expect(scene.musicTrackId).toBeNull();
		expect(scene.fogOfWar).toBe(false);
		expect(scene.gridType).toBe("square");
		expect(scene.id).toMatch(/^scene-/);
	});

	it("respects explicit width and height overrides", () => {
		const scene = buildDefaultVttScene({
			name: "Custom",
			width: 40,
			height: 30,
		});
		expect(scene.width).toBe(40);
		expect(scene.height).toBe(30);
	});

	it("produces unique ids across repeated calls", () => {
		const ids = new Set(
			Array.from({ length: 10 }, () => buildDefaultVttScene({ name: "x" }).id),
		);
		expect(ids.size).toBe(10);
	});
});

describe("duplicateVttScene", () => {
	const source: VTTScene = {
		...buildDefaultVttScene({ name: "Source" }),
		tokens: [createToken("token-1"), createToken("token-2")],
	};

	it("assigns a new scene id and appends (copy) to the name", () => {
		const dup = duplicateVttScene(source);
		expect(dup.id).not.toBe(source.id);
		expect(dup.id).toMatch(/^scene-/);
		expect(dup.name).toBe("Source (copy)");
	});

	it("regenerates token ids and preserves token data otherwise", () => {
		const dup = duplicateVttScene(source);
		expect(dup.tokens).toHaveLength(source.tokens.length);
		for (let i = 0; i < source.tokens.length; i += 1) {
			const original = source.tokens[i];
			const copy = dup.tokens[i];
			expect(copy.id).not.toBe(original.id);
			expect(copy.id).toMatch(/^token-/);
			expect(copy.name).toBe(original.name);
			expect(copy.size).toBe(original.size);
		}
	});

	it("does not mutate the source scene", () => {
		const originalIds = source.tokens.map((t) => t.id);
		duplicateVttScene(source);
		expect(source.tokens.map((t) => t.id)).toEqual(originalIds);
	});

	it("preserves scene-linked atmosphere metadata", () => {
		const scene: VTTScene = {
			...source,
			weather: "rain",
			musicMood: "dungeon-exploration",
			musicAutoplay: true,
			musicPlaylistId: "playlist-1",
			musicTrackId: "track-2",
		};
		const dup = duplicateVttScene(scene);
		expect(dup.weather).toBe("rain");
		expect(dup.musicMood).toBe("dungeon-exploration");
		expect(dup.musicAutoplay).toBe(true);
		expect(dup.musicPlaylistId).toBe("playlist-1");
		expect(dup.musicTrackId).toBe("track-2");
	});
});

describe("normalizeVttScene", () => {
	it("fills in default grid and empties missing collections", () => {
		const rawScene = {
			id: "scene-raw",
			name: "Raw",
			width: 10,
			height: 10,
			tokens: [],
		} as unknown as VTTScene;

		const normalized = normalizeVttScene(rawScene);

		expect(normalized.gridSize).toBe(DEFAULT_SCENE_SETTINGS.gridSize);
		expect(normalized.gridOpacity).toBe(DEFAULT_SCENE_SETTINGS.gridOpacity);
		expect(normalized.backgroundScale).toBe(
			DEFAULT_SCENE_SETTINGS.backgroundScale,
		);
		expect(normalized.backgroundOffsetX).toBe(
			DEFAULT_SCENE_SETTINGS.backgroundOffsetX,
		);
		expect(normalized.backgroundOffsetY).toBe(
			DEFAULT_SCENE_SETTINGS.backgroundOffsetY,
		);
		expect(normalized.drawings).toEqual([]);
		expect(normalized.annotations).toEqual([]);
		expect(normalized.walls).toEqual([]);
		expect(normalized.lights).toEqual([]);
		expect(normalized.musicMood).toBeNull();
		expect(normalized.musicAutoplay).toBe(false);
		expect(normalized.terrain).toEqual([]);
		expect(normalized.ambientSounds).toEqual([]);
		expect(normalized.gridType).toBe("square");
	});

	it("preserves explicit values rather than overwriting them", () => {
		const scene = buildDefaultVttScene({ name: "Scene" });
		scene.gridSize = 80;
		scene.gridType = "hex";
		scene.gridOpacity = 0.04;
		scene.musicMood = "boss-epic";
		scene.musicAutoplay = true;
		scene.musicPlaylistId = "playlist-1";
		scene.musicTrackId = "track-2";
		const normalized = normalizeVttScene(scene);
		expect(normalized.gridSize).toBe(80);
		expect(normalized.gridType).toBe("hex");
		expect(normalized.gridOpacity).toBe(0.04);
		expect(normalized.musicMood).toBe("boss-epic");
		expect(normalized.musicAutoplay).toBe(true);
		expect(normalized.musicPlaylistId).toBe("playlist-1");
		expect(normalized.musicTrackId).toBe("track-2");
	});

	it("normalizes legacy scenes without scene-linked audio references", () => {
		const rawScene = {
			...buildDefaultVttScene({ name: "Legacy" }),
			musicPlaylistId: undefined,
			musicTrackId: undefined,
		};
		const normalized = normalizeVttScene(rawScene);
		expect(normalized.musicPlaylistId).toBeNull();
		expect(normalized.musicTrackId).toBeNull();
	});
});

describe("upsertVttScene", () => {
	const scene = (id: string, name: string): VTTScene => ({
		...buildDefaultVttScene({ name }),
		id,
	});

	it("appends a new scene when the id is not present", () => {
		const initial = [scene("s-1", "one")];
		const next = upsertVttScene(initial, scene("s-2", "two"));
		expect(next).toHaveLength(2);
		expect(next.map((s) => s.id)).toEqual(["s-1", "s-2"]);
	});

	it("replaces the scene in place when the id matches", () => {
		const initial = [scene("s-1", "one"), scene("s-2", "two")];
		const next = upsertVttScene(initial, scene("s-2", "renamed"));
		expect(next).toHaveLength(2);
		expect(next[0].name).toBe("one");
		expect(next[1].name).toBe("renamed");
	});

	it("does not mutate the input array", () => {
		const initial = [scene("s-1", "one")];
		const clone = [...initial];
		upsertVttScene(initial, scene("s-2", "two"));
		expect(initial).toEqual(clone);
	});
});

describe("deleteVttScene", () => {
	const scene = (id: string, name: string): VTTScene => ({
		...buildDefaultVttScene({ name }),
		id,
	});

	it("removes the requested scene and falls back to the next available scene", () => {
		const sceneOne = scene("s-1", "one");
		const sceneTwo = scene("s-2", "two");
		const sceneThree = scene("s-3", "three");

		const result = deleteVttScene({
			scenes: [sceneOne, sceneTwo, sceneThree],
			sceneId: sceneTwo.id,
			currentSceneId: sceneTwo.id,
			liveSceneId: sceneTwo.id,
		});

		expect(result.deletedScene?.id).toBe(sceneTwo.id);
		expect(result.scenes.map((entry) => entry.id)).toEqual([
			sceneOne.id,
			sceneThree.id,
		]);
		expect(result.currentSceneId).toBe(sceneThree.id);
		expect(result.liveSceneId).toBe(sceneThree.id);
		expect(result.createdReplacementScene).toBe(false);
	});

	it("creates a blank replacement scene when deleting the last remaining scene", () => {
		const onlyScene = scene("s-1", "only");

		const result = deleteVttScene({
			scenes: [onlyScene],
			sceneId: onlyScene.id,
			currentSceneId: onlyScene.id,
			liveSceneId: onlyScene.id,
			replacementSceneName: "Fresh Scene",
		});

		expect(result.deletedScene?.id).toBe(onlyScene.id);
		expect(result.scenes).toHaveLength(1);
		expect(result.scenes[0].id).not.toBe(onlyScene.id);
		expect(result.scenes[0].name).toBe("Fresh Scene");
		expect(result.currentSceneId).toBe(result.scenes[0].id);
		expect(result.liveSceneId).toBe(result.scenes[0].id);
		expect(result.createdReplacementScene).toBe(true);
	});

	it("returns the original scene state when the scene id does not exist", () => {
		const sceneOne = scene("s-1", "one");
		const sceneTwo = scene("s-2", "two");

		const result = deleteVttScene({
			scenes: [sceneOne, sceneTwo],
			sceneId: "missing",
			currentSceneId: sceneTwo.id,
			liveSceneId: sceneOne.id,
		});

		expect(result.deletedScene).toBeNull();
		expect(result.scenes).toEqual([sceneOne, sceneTwo]);
		expect(result.currentSceneId).toBe(sceneTwo.id);
		expect(result.liveSceneId).toBe(sceneOne.id);
	});
});

describe("removeAssetFromVttScenes", () => {
	it("clears matching scene backgrounds and removes placed tokens using the same asset", () => {
		const assetUrl = "https://example.com/custom-asset.webp";
		const sceneOne: VTTScene = {
			...buildDefaultVttScene({ name: "one" }),
			backgroundImage: assetUrl,
			gridOpacity: 0,
			backgroundScale: 1.4,
			backgroundOffsetX: 3,
			backgroundOffsetY: 4,
			tokens: [
				{ ...createToken("token-1"), imageUrl: assetUrl },
				{
					...createToken("token-2"),
					imageUrl: "https://example.com/keep.webp",
				},
			],
		};
		const sceneTwo: VTTScene = {
			...buildDefaultVttScene({ name: "two" }),
			tokens: [{ ...createToken("token-3"), imageUrl: assetUrl }],
		};

		const result = removeAssetFromVttScenes([sceneOne, sceneTwo], assetUrl);

		expect(result.didChange).toBe(true);
		expect(result.removedBackgroundSceneIds).toEqual([sceneOne.id]);
		expect(result.removedTokenIds).toEqual(["token-1", "token-3"]);
		expect(result.scenes[0].backgroundImage).toBeUndefined();
		expect(result.scenes[0].gridOpacity).toBe(
			DEFAULT_SCENE_SETTINGS.gridOpacity,
		);
		expect(result.scenes[0].backgroundScale).toBe(
			DEFAULT_SCENE_SETTINGS.backgroundScale,
		);
		expect(result.scenes[0].tokens.map((token) => token.id)).toEqual([
			"token-2",
		]);
		expect(result.scenes[1].tokens).toEqual([]);
	});

	it("returns unchanged scenes when no scene references the asset", () => {
		const sceneOne = buildDefaultVttScene({ name: "one" });
		const result = removeAssetFromVttScenes(
			[sceneOne],
			"https://example.com/missing.webp",
		);

		expect(result.didChange).toBe(false);
		expect(result.scenes).toEqual([sceneOne]);
		expect(result.removedBackgroundSceneIds).toEqual([]);
		expect(result.removedTokenIds).toEqual([]);
	});
});

describe("computeVttHydration", () => {
	const sceneOne = buildDefaultVttScene({ name: "one" });
	const sceneTwo = buildDefaultVttScene({ name: "two" });

	it("returns empty with Warden default-scene creation when both stores are empty", () => {
		const result = computeVttHydration({
			storedState: { scenes: [], currentSceneId: null },
			legacyState: null,
			isWarden: true,
			hasCurrentScene: false,
		});
		expect(result).toEqual({
			kind: "empty",
			shouldCreateDefaultScene: true,
		});
	});

	it("returns empty without default-scene creation for Ascendants", () => {
		const result = computeVttHydration({
			storedState: { scenes: [], currentSceneId: null },
			legacyState: null,
			isWarden: false,
			hasCurrentScene: false,
		});
		expect(result).toEqual({
			kind: "empty",
			shouldCreateDefaultScene: false,
		});
	});

	it("hydrates from stored state and snaps to the live scene id", () => {
		const result = computeVttHydration({
			storedState: {
				scenes: [sceneOne, sceneTwo],
				currentSceneId: sceneTwo.id,
			},
			legacyState: null,
			isWarden: false,
			hasCurrentScene: false,
		});
		if (result.kind !== "hydrated") throw new Error("expected hydrated");
		expect(result.scenes.map((s) => s.id)).toEqual([sceneOne.id, sceneTwo.id]);
		expect(result.liveSceneId).toBe(sceneTwo.id);
		expect(result.currentScene?.id).toBe(sceneTwo.id);
		expect(result.shouldMigrateLegacyToRemote).toBe(false);
	});

	it("does not snap Warden when they already have an active scene", () => {
		const result = computeVttHydration({
			storedState: {
				scenes: [sceneOne, sceneTwo],
				currentSceneId: sceneTwo.id,
			},
			legacyState: null,
			isWarden: true,
			hasCurrentScene: true,
		});
		if (result.kind !== "hydrated") throw new Error("expected hydrated");
		expect(result.currentScene).toBeNull();
	});

	it("falls back to the first scene when the live scene id is unknown", () => {
		const result = computeVttHydration({
			storedState: {
				scenes: [sceneOne, sceneTwo],
				currentSceneId: "unknown",
			},
			legacyState: null,
			isWarden: false,
			hasCurrentScene: false,
		});
		if (result.kind !== "hydrated") throw new Error("expected hydrated");
		expect(result.currentScene?.id).toBe(sceneOne.id);
	});

	it("migrates legacy local scenes to remote for Warden when remote is empty", () => {
		const result = computeVttHydration({
			storedState: { scenes: [], currentSceneId: null },
			legacyState: {
				scenes: [sceneOne, sceneTwo],
				currentScene: sceneTwo.id,
			},
			isWarden: true,
			hasCurrentScene: false,
		});
		if (result.kind !== "hydrated") throw new Error("expected hydrated");
		expect(result.scenes.map((s) => s.id)).toEqual([sceneOne.id, sceneTwo.id]);
		expect(result.liveSceneId).toBe(sceneTwo.id);
		expect(result.currentScene?.id).toBe(sceneTwo.id);
		expect(result.shouldMigrateLegacyToRemote).toBe(true);
	});

	it("does not migrate legacy scenes for Ascendants", () => {
		const result = computeVttHydration({
			storedState: { scenes: [], currentSceneId: null },
			legacyState: {
				scenes: [sceneOne],
				currentScene: sceneOne.id,
			},
			isWarden: false,
			hasCurrentScene: false,
		});
		if (result.kind !== "hydrated") throw new Error("expected hydrated");
		expect(result.shouldMigrateLegacyToRemote).toBe(false);
	});
});
