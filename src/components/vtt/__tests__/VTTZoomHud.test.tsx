import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VTTZoomHud } from "@/components/vtt/VTTZoomHud";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

describe("VTTZoomHud", () => {
	const onRequestZoom = vi.fn<(n: number) => void>();
	const onFit = vi.fn<() => void>();
	const onRecenter = vi.fn<() => void>();

	beforeEach(() => {
		onRequestZoom.mockReset();
		onFit.mockReset();
		onRecenter.mockReset();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renders current zoom percentage and exposes controls", () => {
		const { container, unmount } = mount(
			<VTTZoomHud
				zoom={1.2}
				onRequestZoom={onRequestZoom}
				onFit={onFit}
				onRecenter={onRecenter}
			/>,
		);
		expect(
			container.querySelector('[data-testid="vtt-zoom-hud"]'),
		).toBeTruthy();
		const resetBtn = container.querySelector('[data-testid="vtt-zoom-reset"]');
		expect(resetBtn?.textContent).toBe("120%");
		unmount();
	});

	it("clamps zoom-out to the minimum and disables the button at the floor", () => {
		const { container, unmount } = mount(
			<VTTZoomHud
				zoom={0.5}
				onRequestZoom={onRequestZoom}
				onFit={onFit}
				onRecenter={onRecenter}
			/>,
		);
		const out = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-zoom-out"]',
		);
		expect(out?.disabled).toBe(true);
		unmount();
	});

	it("calls onRequestZoom with a clamped increment on zoom-in", () => {
		const { container, unmount } = mount(
			<VTTZoomHud
				zoom={1}
				onRequestZoom={onRequestZoom}
				onFit={onFit}
				onRecenter={onRecenter}
			/>,
		);
		const inBtn = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-zoom-in"]',
		);
		act(() => {
			inBtn?.click();
		});
		expect(onRequestZoom).toHaveBeenCalledWith(1.1);
		unmount();
	});

	it("resets to 100% when percent pill is clicked", () => {
		const { container, unmount } = mount(
			<VTTZoomHud
				zoom={1.5}
				onRequestZoom={onRequestZoom}
				onFit={onFit}
				onRecenter={onRecenter}
			/>,
		);
		const reset = container.querySelector<HTMLButtonElement>(
			'[data-testid="vtt-zoom-reset"]',
		);
		act(() => {
			reset?.click();
		});
		expect(onRequestZoom).toHaveBeenCalledWith(1);
		unmount();
	});

	it("invokes onFit and onRecenter handlers", () => {
		const { container, unmount } = mount(
			<VTTZoomHud
				zoom={1}
				onRequestZoom={onRequestZoom}
				onFit={onFit}
				onRecenter={onRecenter}
			/>,
		);
		act(() => {
			container
				.querySelector<HTMLButtonElement>('[data-testid="vtt-zoom-fit"]')
				?.click();
			container
				.querySelector<HTMLButtonElement>('[data-testid="vtt-zoom-recenter"]')
				?.click();
		});
		expect(onFit).toHaveBeenCalledTimes(1);
		expect(onRecenter).toHaveBeenCalledTimes(1);
		unmount();
	});

	it("hides fit/recenter when `minimal` is set", () => {
		const { container, unmount } = mount(
			<VTTZoomHud
				zoom={1}
				onRequestZoom={onRequestZoom}
				onFit={onFit}
				onRecenter={onRecenter}
				minimal
			/>,
		);
		expect(container.querySelector('[data-testid="vtt-zoom-fit"]')).toBeNull();
		expect(
			container.querySelector('[data-testid="vtt-zoom-recenter"]'),
		).toBeNull();
		unmount();
	});
});
