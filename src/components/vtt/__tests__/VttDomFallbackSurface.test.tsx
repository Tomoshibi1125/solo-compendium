import { act, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VttDomFallbackSurface } from "@/components/vtt/VttDomFallbackSurface";
import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

vi.mock("@/components/ui/OptimizedImage", () => ({
	OptimizedImage: ({
		src,
		alt,
		className,
	}: {
		src: string;
		alt: string;
		className?: string;
	}) => <img src={src} alt={alt} className={className} />,
}));

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

function mount(node: ReactElement) {
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
}

const makeScene = (overrides: Partial<VTTScene> = {}): VTTScene => ({
	id: "scene-1",
	name: "Test Scene",
	width: 10,
	height: 8,
	backgroundImage: "https://example.com/map.webp",
	backgroundScale: 1.5,
	backgroundOffsetX: 1,
	backgroundOffsetY: 2,
	gridSize: 50,
	gridType: "square",
	gridOpacity: 0.18,
	tokens: [],
	drawings: [],
	annotations: [],
	walls: [],
	lights: [],
	fogOfWar: false,
	musicMood: null,
	musicAutoplay: false,
	terrain: [],
	ambientSounds: [],
	...overrides,
});

const makeToken = (
	overrides: Partial<VTTTokenInstance> = {},
): VTTTokenInstance => ({
	id: "token-1",
	name: "Hero",
	size: "medium",
	x: 2,
	y: 3,
	rotation: 0,
	layer: 1,
	locked: false,
	visible: true,
	tokenType: "character",
	color: "#ff0000",
	...overrides,
});

describe("VttDomFallbackSurface", () => {
	const setActiveTokenId = vi.fn<(id: string | null) => void>();

	beforeEach(() => {
		setActiveTokenId.mockReset();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders background transform, grid, fog cells, and token selection", () => {
		const scene = makeScene({
			fogOfWar: true,
			fogData: [
				[true, false],
				[false, true],
			],
		});
		const token = makeToken({ hp: 12, maxHp: 20 });
		const { container, unmount } = mount(
			<VttDomFallbackSurface
				scene={scene}
				tokens={[token]}
				gridSize={50}
				zoom={2}
				showGrid
				activeTokenId={null}
				activeInitiativeTokenId={null}
				setActiveTokenId={setActiveTokenId}
			/>,
		);
		const root = container.querySelector(
			'[data-testid="vtt-dom-fallback-surface"]',
		);
		expect(root).toBeTruthy();
		const background = container.querySelector<HTMLElement>(
			'[data-testid="vtt-dom-fallback-background"]',
		);
		expect(background?.style.left).toBe("2px");
		expect(background?.style.top).toBe("4px");
		expect(background?.style.width).toBe("1500px");
		expect(background?.style.height).toBe("1200px");
		const grid = container.querySelector<HTMLElement>(
			'[data-testid="vtt-dom-fallback-grid"]',
		);
		expect(grid?.style.backgroundSize).toBe("100px 100px");
		expect(grid?.style.opacity).toBe("0.18");
		const fog = container.querySelector('[data-testid="vtt-dom-fallback-fog"]');
		expect(fog?.children.length).toBe(2);
		const tokenButton = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-dom-fallback-token-token-1"]',
		);
		expect(tokenButton?.title).toBe("Hero (12/20 HP)");
		act(() => {
			tokenButton?.dispatchEvent(
				new MouseEvent("mousedown", { bubbles: true }),
			);
		});
		expect(setActiveTokenId).toHaveBeenCalledWith("token-1");
		unmount();
	});

	it("suppresses the grid overlay when showGrid is false", () => {
		const scene = makeScene({ gridOpacity: 0.08 });
		const { container, unmount } = mount(
			<VttDomFallbackSurface
				scene={scene}
				tokens={[]}
				gridSize={50}
				zoom={1}
				showGrid={false}
				activeTokenId={null}
				activeInitiativeTokenId={null}
				setActiveTokenId={setActiveTokenId}
			/>,
		);
		expect(
			container.querySelector('[data-testid="vtt-dom-fallback-grid"]'),
		).toBeNull();
		unmount();
	});
});
