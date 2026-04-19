import { describe, expect, it } from "vitest";
import {
	buildDefaultVttScene,
	computeVttHydration,
	createVttSceneId,
	createVttTokenInstanceId,
	DEFAULT_SCENE_SETTINGS,
	duplicateVttScene,
	getValidActiveTokenId,
	normalizeVttScene,
	upsertVttScene,
} from "@/lib/vtt/sceneState";
import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

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

describe("buildDefaultVttScene", () => {
	it("produces a scene with default grid and empty collections", () => {
		const scene = buildDefaultVttScene({ name: "Scene 1" });
		expect(scene.name).toBe("Scene 1");
		expect(scene.width).toBe(20);
		expect(scene.height).toBe(20);
		expect(scene.gridSize).toBe(DEFAULT_SCENE_SETTINGS.gridSize);
		expect(scene.backgroundScale).toBe(DEFAULT_SCENE_SETTINGS.backgroundScale);
		expect(scene.tokens).toEqual([]);
		expect(scene.drawings).toEqual([]);
		expect(scene.annotations).toEqual([]);
		expect(scene.walls).toEqual([]);
		expect(scene.lights).toEqual([]);
		expect(scene.terrain).toEqual([]);
		expect(scene.ambientSounds).toEqual([]);
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
		expect(normalized.terrain).toEqual([]);
		expect(normalized.ambientSounds).toEqual([]);
		expect(normalized.gridType).toBe("square");
	});

	it("preserves explicit values rather than overwriting them", () => {
		const scene = buildDefaultVttScene({ name: "Scene" });
		scene.gridSize = 80;
		scene.gridType = "hex";
		const normalized = normalizeVttScene(scene);
		expect(normalized.gridSize).toBe(80);
		expect(normalized.gridType).toBe("hex");
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
