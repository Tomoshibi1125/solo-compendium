import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

// AutoLinkText pulls in react-router + the startup-data query; stub it to a
// plain text node so this focused unit test doesn't need those providers. The
// panel's own formatting/disclosure logic (the thing under test) is unaffected.
vi.mock("@/components/compendium/AutoLinkText", () => ({
	AutoLinkText: ({ text }: { text: string }) => text,
}));

import { AddDialogDetailPanel } from "@/components/character/AddDialogDetailPanel";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const activeCleanups: Array<() => void> = [];

const mount = (element: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(element);
	});
	const unmount = () => {
		act(() => {
			root.unmount();
		});
		container.remove();
	};
	activeCleanups.push(unmount);
	return { container, unmount };
};

const findToggle = (container: HTMLElement) =>
	Array.from(container.querySelectorAll("button")).find((b) =>
		(b.textContent || "").includes("Show details"),
	);

afterEach(() => {
	while (activeCleanups.length > 0) {
		activeCleanups.pop()?.();
	}
});

describe("AddDialogDetailPanel (row → full canonical detail)", () => {
	it("hides full-detail fields until the row is expanded, then reveals them", () => {
		const { container } = mount(
			<AddDialogDetailPanel
				stats={[
					{ label: "Damage", value: "1d8 slashing" },
					{ label: "Weight", value: "3 lb." },
				]}
				properties={["Finesse", "Versatile"]}
				description="A finely balanced blade."
				sourceBook="Rift Ascendant Canon"
			/>,
		);

		// Collapsed: the disclosure toggle is present but the full-detail fields
		// (weapon properties, damage stat) that the summary row omits are hidden.
		const toggle = findToggle(container);
		expect(toggle).toBeTruthy();
		expect(container.textContent).not.toContain("Finesse");
		expect(container.textContent).not.toContain("1d8 slashing");

		// Expanded: the same canonical fields the Compendium detail surfaces
		// (properties + stats) are now rendered inline.
		act(() => {
			toggle?.click();
		});
		expect(container.textContent).toContain("Finesse");
		expect(container.textContent).toContain("Versatile");
		expect(container.textContent).toContain("1d8 slashing");
		expect(container.textContent).toContain("A finely balanced blade.");
	});

	it("reveals vehicle capacity + structured effects/limitations on expand", () => {
		const { container } = mount(
			<AddDialogDetailPanel
				stats={[{ label: "Carry Capacity", value: "480 lb." }]}
				effects={{ primary: "Grants advantage on Athletics checks." }}
				limitations={{ requires_attunement: true }}
			/>,
		);

		const toggle = findToggle(container);
		expect(container.textContent).not.toContain("480 lb.");

		act(() => {
			toggle?.click();
		});
		expect(container.textContent).toContain("480 lb.");
		expect(container.textContent).toContain(
			"Grants advantage on Athletics checks.",
		);
		expect(container.textContent).toContain("Attunement");
	});

	it("renders nothing when there is no canonical detail to show", () => {
		const { container } = mount(<AddDialogDetailPanel stats={[]} />);
		expect(container.textContent).toBe("");
	});
});
