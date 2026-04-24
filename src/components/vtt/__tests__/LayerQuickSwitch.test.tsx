import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	type LayerDef,
	LayerQuickSwitch,
} from "@/components/vtt/LayerQuickSwitch";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const LAYERS: LayerDef[] = [
	{ id: 0, label: "Map" },
	{ id: 1, label: "Tokens" },
	{ id: 2, label: "Effects" },
	{ id: 3, label: "Warden" },
];

function mount(node: React.ReactElement) {
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

describe("LayerQuickSwitch", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders one row per layer", () => {
		const { container, unmount } = mount(
			<LayerQuickSwitch
				layers={LAYERS}
				currentLayer={1}
				onSelectLayer={() => {}}
				visibility={{ 0: true, 1: true, 2: true, 3: true }}
				onToggleVisibility={() => {}}
			/>,
		);
		for (const l of LAYERS) {
			expect(
				container.querySelector(`[data-testid="vtt-layer-select-${l.id}"]`),
			).toBeTruthy();
			expect(
				container.querySelector(`[data-testid="vtt-layer-visibility-${l.id}"]`),
			).toBeTruthy();
		}
		unmount();
	});

	it("marks the active layer with aria-pressed=true", () => {
		const { container, unmount } = mount(
			<LayerQuickSwitch
				layers={LAYERS}
				currentLayer={2}
				onSelectLayer={() => {}}
				visibility={{ 0: true, 1: true, 2: true, 3: true }}
				onToggleVisibility={() => {}}
			/>,
		);
		const active = container.querySelector(
			'[data-testid="vtt-layer-select-2"]',
		);
		const inactive = container.querySelector(
			'[data-testid="vtt-layer-select-1"]',
		);
		expect(active?.getAttribute("aria-pressed")).toBe("true");
		expect(inactive?.getAttribute("aria-pressed")).toBe("false");
		unmount();
	});

	it("fires onSelectLayer when a layer button is clicked", () => {
		const onSelectLayer = vi.fn();
		const { container, unmount } = mount(
			<LayerQuickSwitch
				layers={LAYERS}
				currentLayer={1}
				onSelectLayer={onSelectLayer}
				visibility={{ 0: true, 1: true, 2: true, 3: true }}
				onToggleVisibility={() => {}}
			/>,
		);
		const btn = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-layer-select-3"]',
		);
		expect(btn).toBeTruthy();
		act(() => {
			btn?.click();
		});
		expect(onSelectLayer).toHaveBeenCalledWith(3);
		unmount();
	});

	it("fires onToggleVisibility when the eye button is clicked", () => {
		const onToggleVisibility = vi.fn();
		const { container, unmount } = mount(
			<LayerQuickSwitch
				layers={LAYERS}
				currentLayer={1}
				onSelectLayer={() => {}}
				visibility={{ 0: true, 1: true, 2: true, 3: true }}
				onToggleVisibility={onToggleVisibility}
			/>,
		);
		const eye = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-layer-visibility-0"]',
		);
		act(() => {
			eye?.click();
		});
		expect(onToggleVisibility).toHaveBeenCalledWith(0);
		unmount();
	});

	it("applies the optional filter to hide layers", () => {
		const { container, unmount } = mount(
			<LayerQuickSwitch
				layers={LAYERS}
				currentLayer={1}
				onSelectLayer={() => {}}
				visibility={{ 0: true, 1: true, 2: true, 3: true }}
				onToggleVisibility={() => {}}
				filter={(l) => l.id !== 3}
			/>,
		);
		expect(
			container.querySelector('[data-testid="vtt-layer-select-3"]'),
		).toBeNull();
		expect(
			container.querySelector('[data-testid="vtt-layer-select-1"]'),
		).toBeTruthy();
		unmount();
	});
});
