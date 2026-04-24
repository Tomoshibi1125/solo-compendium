import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VTTTopBar } from "@/components/vtt/VTTTopBar";

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

describe("VTTTopBar", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("applies pointer-events-none to the outer container so clicks pass through", () => {
		const { container, unmount } = mount(
			<VTTTopBar
				left={<span data-testid="left-slot">L</span>}
				right={<span data-testid="right-slot">R</span>}
			/>,
		);
		const bar = container.querySelector<HTMLDivElement>(
			'[data-testid="vtt-topbar"]',
		);
		expect(bar).toBeTruthy();
		expect(bar?.classList.contains("pointer-events-none")).toBe(true);
		// Children slots should accept pointer events.
		const leftSlot = container.querySelector('[data-testid="left-slot"]');
		const leftContainer = leftSlot?.parentElement;
		expect(leftContainer?.classList.contains("pointer-events-auto")).toBe(true);
		unmount();
	});

	it("renders left and right slots", () => {
		const { container, unmount } = mount(
			<VTTTopBar
				left={<span data-testid="left-slot">L</span>}
				right={<span data-testid="right-slot">R</span>}
			/>,
		);
		expect(container.querySelector('[data-testid="left-slot"]')).toBeTruthy();
		expect(container.querySelector('[data-testid="right-slot"]')).toBeTruthy();
		unmount();
	});

	it("fades to idle state after the idle timeout", () => {
		vi.useFakeTimers();
		const { container, unmount } = mount(
			<VTTTopBar left={<span>L</span>} right={<span>R</span>} idleMs={50} />,
		);
		const bar = container.querySelector<HTMLDivElement>(
			'[data-testid="vtt-topbar"]',
		);
		expect(bar?.getAttribute("data-idle")).toBe("false");
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(bar?.getAttribute("data-idle")).toBe("true");
		unmount();
	});

	it("does not fade when autoHide is disabled", () => {
		vi.useFakeTimers();
		const { container, unmount } = mount(
			<VTTTopBar
				left={<span>L</span>}
				right={<span>R</span>}
				autoHide={false}
				idleMs={50}
			/>,
		);
		const bar = container.querySelector<HTMLDivElement>(
			'[data-testid="vtt-topbar"]',
		);
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(bar?.hasAttribute("data-idle")).toBe(false);
		unmount();
	});
});
