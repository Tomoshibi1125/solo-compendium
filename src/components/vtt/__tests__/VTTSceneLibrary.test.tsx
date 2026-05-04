import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	getVttSceneTokenCount,
	reorderVttScenes,
	VTTSceneLibrary,
	type VTTSceneLibraryProps,
} from "@/components/vtt/VTTSceneLibrary";
import type { VTTScene } from "@/types/vtt";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const buildScene = (
	overrides: Partial<VTTScene> & Pick<VTTScene, "id" | "name">,
): VTTScene => ({
	id: overrides.id,
	name: overrides.name,
	width: overrides.width ?? 20,
	height: overrides.height ?? 20,
	gridSize: overrides.gridSize ?? 5,
	gridType: overrides.gridType ?? "square",
	tokens: overrides.tokens ?? [],
	drawings: overrides.drawings ?? [],
	annotations: overrides.annotations ?? [],
	walls: overrides.walls ?? [],
	lights: overrides.lights ?? [],
	fogOfWar: overrides.fogOfWar ?? false,
	backgroundImage: overrides.backgroundImage,
});

const scenes = [
	buildScene({
		id: "scene-a",
		name: "Rift Gate",
		backgroundImage: "/maps/rift-gate.webp",
		tokens: [{ id: "token-1" }, { id: "token-2" }] as VTTScene["tokens"],
	}),
	buildScene({
		id: "scene-b",
		name: "Empty Arena",
		width: 30,
		height: 25,
	}),
];

const mount = (node: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(node);
	});
	return {
		container,
		unmount: () => {
			act(() => {
				root.unmount();
			});
			container.remove();
		},
	};
};

describe("VTTSceneLibrary", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders scene thumbnails, counts, current state, and fallback previews", () => {
		const props: VTTSceneLibraryProps = {
			scenes,
			currentSceneId: "scene-a",
			liveSceneId: "scene-a",
			isWarden: true,
			onSelectScene: vi.fn(),
			onMakeLiveScene: vi.fn(),
		};
		const { container, unmount } = mount(<VTTSceneLibrary {...props} />);

		const riftCard = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-scene-library-card-rift-gate"]',
		);
		expect(riftCard?.getAttribute("aria-current")).toBe("page");
		expect(riftCard?.textContent).toContain("Rift Gate");
		expect(riftCard?.textContent).toContain("2 tokens");
		expect(container.querySelector("img")?.getAttribute("src")).toBe(
			"/maps/rift-gate.webp",
		);
		expect(getVttSceneTokenCount(scenes[0])).toBe(2);

		const emptyCard = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-scene-library-card-empty-arena"]',
		);
		expect(emptyCard?.textContent).toContain("No map");
		expect(emptyCard?.textContent).toContain("30×25");
		expect(emptyCard?.textContent).toContain("0 tokens");

		unmount();
	});

	it("selects scenes and exposes a go-live action", () => {
		const onSelectScene = vi.fn();
		const onMakeLiveScene = vi.fn();
		const { container, unmount } = mount(
			<VTTSceneLibrary
				scenes={scenes}
				currentSceneId="scene-a"
				liveSceneId="scene-a"
				isWarden
				onSelectScene={onSelectScene}
				onMakeLiveScene={onMakeLiveScene}
			/>,
		);

		const emptyCard = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-scene-library-card-empty-arena"]',
		);
		const goLive = container.querySelector<HTMLButtonElement>(
			'button[aria-label="Make Empty Arena live for players"]',
		);
		expect(emptyCard).toBeTruthy();
		expect(goLive?.getAttribute("aria-pressed")).toBe("false");

		act(() => {
			emptyCard?.click();
			goLive?.click();
		});

		expect(onSelectScene).toHaveBeenCalledWith(scenes[1]);
		expect(onMakeLiveScene).toHaveBeenCalledWith(scenes[1]);
		unmount();
	});

	it("reorders scenes by source and target scene ids", () => {
		expect(reorderVttScenes(scenes, "scene-a", "scene-b")).toEqual([
			scenes[1],
			scenes[0],
		]);
		expect(reorderVttScenes(scenes, "missing", "scene-b")).toBe(scenes);
		expect(reorderVttScenes(scenes, "scene-a", "scene-a")).toBe(scenes);
	});
});
