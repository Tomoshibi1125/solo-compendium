import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mutateAsync, trackMock, toastMock } = vi.hoisted(() => ({
	mutateAsync: vi.fn(),
	trackMock: vi.fn(),
	toastMock: vi.fn(),
}));

vi.mock("@/components/character/PortraitUpload", () => ({
	PortraitUpload: () => null,
}));
vi.mock("@/hooks/use-toast", () => ({
	useToast: () => ({ toast: toastMock }),
}));
vi.mock("@/hooks/useCharacters", () => ({
	useUpdateCharacter: () => ({ mutateAsync, isPending: false }),
}));
vi.mock("@/hooks/useGlobalDDBeyondIntegration", () => ({
	useAscendantTools: () => ({ trackCustomFeatureUsage: trackMock }),
}));
vi.mock("@/lib/ai/aiService", () => ({
	aiService: {
		processRequest: vi.fn(),
		getConfiguration: () => ({ defaultService: "test" }),
	},
}));
vi.mock("@/lib/logger", () => ({
	logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
	warn: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
}));

import { CharacterEditDialog } from "@/components/character/CharacterEditDialog";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const baseCharacter = {
	id: "c1",
	name: "Hero",
	level: 3,
	appearance: "",
	backstory: "",
	notes: "",
	portrait_url: null,
} as unknown as CharacterWithAbilities;

const flush = async () => {
	for (let i = 0; i < 5; i++) {
		await act(async () => {
			await Promise.resolve();
		});
	}
};

const activeCleanups: Array<() => void> = [];

const mount = (element: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(element);
	});
	let done = false;
	const unmount = () => {
		if (done) return;
		done = true;
		act(() => {
			root.unmount();
		});
		container.remove();
	};
	activeCleanups.push(unmount);
	return { container, unmount };
};

const findSaveButton = () =>
	Array.from(document.querySelectorAll("button")).find((b) =>
		(b.textContent || "").includes("Save Changes"),
	);

describe("CharacterEditDialog (react-hook-form + zod)", () => {
	beforeEach(() => {
		mutateAsync.mockResolvedValue({ id: "c1", name: "Hero" });
		trackMock.mockResolvedValue(undefined);
	});

	afterEach(() => {
		// Always unmount (even if an assertion threw) so a leaked Radix dialog
		// never bleeds handles into the next test/file.
		while (activeCleanups.length > 0) {
			activeCleanups.pop()?.();
		}
		vi.clearAllMocks();
	});

	it("submits trimmed, null-coalesced values from the seeded form", async () => {
		const onOpenChange = vi.fn();
		const view = mount(
			<CharacterEditDialog
				character={baseCharacter}
				open={true}
				onOpenChange={onOpenChange}
			/>,
		);
		await flush();

		const saveButton = findSaveButton();
		expect(saveButton).toBeTruthy();

		await act(async () => {
			saveButton?.click();
		});
		await flush();

		expect(mutateAsync).toHaveBeenCalledTimes(1);
		expect(mutateAsync).toHaveBeenCalledWith({
			id: "c1",
			data: {
				name: "Hero",
				appearance: null,
				backstory: null,
				notes: null,
			},
		});
		expect(onOpenChange).toHaveBeenCalledWith(false);

		view.unmount();
	});

	it("blocks submit and surfaces a validation toast when the name is empty", async () => {
		const view = mount(
			<CharacterEditDialog
				character={{ ...baseCharacter, name: "" } as CharacterWithAbilities}
				open={true}
				onOpenChange={vi.fn()}
			/>,
		);
		await flush();

		const saveButton = findSaveButton();
		await act(async () => {
			saveButton?.click();
		});
		await flush();

		expect(mutateAsync).not.toHaveBeenCalled();
		expect(toastMock).toHaveBeenCalledWith(
			expect.objectContaining({ title: "Name required" }),
		);

		view.unmount();
	});

	it("trims whitespace around the name before saving", async () => {
		const view = mount(
			<CharacterEditDialog
				character={
					{
						...baseCharacter,
						name: "  Reborn Hero  ",
					} as CharacterWithAbilities
				}
				open={true}
				onOpenChange={vi.fn()}
			/>,
		);
		await flush();

		const saveButton = findSaveButton();
		await act(async () => {
			saveButton?.click();
		});
		await flush();

		expect(mutateAsync).toHaveBeenCalledTimes(1);
		expect(mutateAsync.mock.calls[0][0]).toMatchObject({
			data: { name: "Reborn Hero" },
		});

		view.unmount();
	});
});
