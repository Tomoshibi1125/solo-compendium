import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const exportCharacterJsonMock = vi.fn(async () => ({}));

vi.mock("@/lib/export", () => ({
	exportCharacterPDF: vi.fn(),
}));
vi.mock("@/hooks/useCharacterExportImport", () => ({
	useCharacterExport: () => ({
		exportCharacterJson: exportCharacterJsonMock,
	}),
}));

import { ExportDialog } from "@/components/character/ExportDialog";
import { exportCharacterPDF } from "@/lib/export";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const downloadJsonMock = exportCharacterJsonMock;
const exportPdfMock = vi.mocked(exportCharacterPDF);

const baseCharacter = {
	id: "char-123",
	name: "Test Mage",
	share_token: "share-tok-abc",
	abilities: { strength: 10, agility: 12 },
} as unknown as Parameters<typeof ExportDialog>[0]["character"];

const mount = (node: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(node);
	});
	return {
		container,
		rerender: (next: React.ReactElement) => {
			act(() => {
				root.render(next);
			});
		},
		unmount: () => {
			act(() => {
				root.unmount();
			});
			container.remove();
		},
	};
};

const queryDialog = (): HTMLElement | null =>
	document.querySelector<HTMLElement>('[data-testid="export-dialog"]');

const queryButtonByText = (text: string): HTMLButtonElement | null => {
	const buttons = Array.from(
		document.querySelectorAll<HTMLButtonElement>("button"),
	);
	return buttons.find((b) => (b.textContent || "").includes(text)) ?? null;
};

describe("ExportDialog (smoke wiring)", () => {
	beforeEach(() => {
		downloadJsonMock.mockClear();
		exportPdfMock.mockClear();
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("renders the three export entry points in the default action list view", () => {
		const onOpenChange = vi.fn();
		const { unmount } = mount(
			<ExportDialog
				open
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		expect(queryDialog()).toBeTruthy();
		expect(queryButtonByText("Export as JSON")).toBeTruthy();
		expect(queryButtonByText("Preview PDF")).toBeTruthy();
		expect(queryButtonByText("Export as PDF")).toBeTruthy();
		expect(
			document.querySelector('[data-testid="export-pdf-preview"]'),
		).toBeNull();

		unmount();
	});

	it("JSON button calls the canonical JSON exporter and closes the dialog", () => {
		const onOpenChange = vi.fn();
		const { unmount } = mount(
			<ExportDialog
				open
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		const jsonBtn = queryButtonByText("Export as JSON");
		expect(jsonBtn).toBeTruthy();
		act(() => {
			jsonBtn?.click();
		});

		expect(downloadJsonMock).toHaveBeenCalledTimes(1);
		expect(downloadJsonMock).toHaveBeenCalledWith(baseCharacter.id);
		expect(onOpenChange).toHaveBeenCalledWith(false);
		expect(exportPdfMock).not.toHaveBeenCalled();

		unmount();
	});

	it("Preview PDF button switches to the iframe view with ?print=true&token=...", () => {
		const onOpenChange = vi.fn();
		const { unmount } = mount(
			<ExportDialog
				open
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		const previewBtn = document.querySelector<HTMLButtonElement>(
			'[data-testid="export-preview-btn"]',
		);
		expect(previewBtn).toBeTruthy();
		act(() => {
			previewBtn?.click();
		});

		const previewSurface = document.querySelector<HTMLElement>(
			'[data-testid="export-pdf-preview"]',
		);
		expect(previewSurface).toBeTruthy();

		const iframe = previewSurface?.querySelector("iframe");
		expect(iframe).toBeTruthy();
		const src = iframe?.getAttribute("src") ?? "";
		expect(src).toContain(`/characters/${baseCharacter.id}`);
		expect(src).toContain("print=true");
		expect(src).toContain(`token=${baseCharacter.share_token}`);

		// Print and Open-in-new-tab buttons must be available in preview mode
		expect(
			document.querySelector('[data-testid="export-print-from-preview"]'),
		).toBeTruthy();
		expect(queryButtonByText("Open in new tab")).toBeTruthy();

		unmount();
	});

	it("Print/Save-as-PDF button invokes the iframe's contentWindow.print()", () => {
		const onOpenChange = vi.fn();
		const { unmount } = mount(
			<ExportDialog
				open
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		const previewBtn = document.querySelector<HTMLButtonElement>(
			'[data-testid="export-preview-btn"]',
		);
		act(() => {
			previewBtn?.click();
		});

		const iframe = document.querySelector(
			'[data-testid="export-pdf-preview"] iframe',
		) as HTMLIFrameElement | null;
		expect(iframe).toBeTruthy();

		// Replace the iframe's contentWindow.print with a spy. jsdom provides
		// a real contentWindow but its print() is a no-op; spying lets us
		// assert ExportDialog wires the click through to the iframe.
		const printSpy = vi.fn();
		const focusSpy = vi.fn();
		Object.defineProperty(iframe, "contentWindow", {
			value: { print: printSpy, focus: focusSpy },
			configurable: true,
		});

		const printBtn = document.querySelector<HTMLButtonElement>(
			'[data-testid="export-print-from-preview"]',
		);
		expect(printBtn).toBeTruthy();
		act(() => {
			printBtn?.click();
		});

		expect(focusSpy).toHaveBeenCalledTimes(1);
		expect(printSpy).toHaveBeenCalledTimes(1);

		unmount();
	});

	it("Direct 'Export as PDF' button calls exportCharacterPDF with id + share token", () => {
		const onOpenChange = vi.fn();
		const { unmount } = mount(
			<ExportDialog
				open
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		const pdfBtn = queryButtonByText("Export as PDF");
		expect(pdfBtn).toBeTruthy();
		act(() => {
			pdfBtn?.click();
		});

		expect(exportPdfMock).toHaveBeenCalledTimes(1);
		expect(exportPdfMock).toHaveBeenCalledWith(baseCharacter.id, {
			shareToken: baseCharacter.share_token,
		});
		expect(onOpenChange).toHaveBeenCalledWith(false);

		unmount();
	});

	it("resets the preview view when the dialog is reopened after closing", () => {
		const onOpenChange = vi.fn();
		const harness = mount(
			<ExportDialog
				open
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		// Enter preview mode
		const previewBtn = document.querySelector<HTMLButtonElement>(
			'[data-testid="export-preview-btn"]',
		);
		act(() => {
			previewBtn?.click();
		});
		expect(
			document.querySelector('[data-testid="export-pdf-preview"]'),
		).toBeTruthy();

		// Close
		harness.rerender(
			<ExportDialog
				open={false}
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		// Reopen — should be back in default action-list view, not preview
		harness.rerender(
			<ExportDialog
				open
				onOpenChange={onOpenChange}
				character={baseCharacter}
			/>,
		);

		expect(
			document.querySelector('[data-testid="export-pdf-preview"]'),
		).toBeNull();
		expect(queryButtonByText("Preview PDF")).toBeTruthy();

		harness.unmount();
	});

	it("omits the token query param when the character has no share_token", () => {
		const tokenless = {
			...baseCharacter,
			share_token: null,
		} as unknown as typeof baseCharacter;

		const onOpenChange = vi.fn();
		const { unmount } = mount(
			<ExportDialog open onOpenChange={onOpenChange} character={tokenless} />,
		);

		const previewBtn = document.querySelector<HTMLButtonElement>(
			'[data-testid="export-preview-btn"]',
		);
		act(() => {
			previewBtn?.click();
		});

		const iframe = document.querySelector(
			'[data-testid="export-pdf-preview"] iframe',
		) as HTMLIFrameElement | null;
		const src = iframe?.getAttribute("src") ?? "";
		expect(src).toContain(`/characters/${tokenless.id}`);
		expect(src).toContain("print=true");
		expect(src).not.toContain("token=");

		unmount();
	});
});
