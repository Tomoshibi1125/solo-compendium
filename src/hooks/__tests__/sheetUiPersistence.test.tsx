import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	SHEET_UI_PERSIST_DEBOUNCE_MS,
	useSheetUiPersistence,
} from "@/hooks/useSheetUiPersistence";
import { useCharacterSheetUiStore } from "@/stores/characterSheetUiStore";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const serverUi = {
	modals: {
		edit: false,
		share: false,
		export: false,
		levelUp: false,
		defenses: false,
		health: false,
	},
	activeTab: "features",
	sectionNotes: { notes: "from server" },
};

const Harness = ({
	characterId,
	save,
	enabled,
}: {
	characterId: string;
	save: (updates: unknown) => Promise<unknown>;
	enabled: boolean;
}) => {
	useSheetUiPersistence(characterId, serverUi, save, enabled);
	return null;
};

const mount = (element: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(element);
	});
	return {
		unmount: () => {
			act(() => {
				root.unmount();
			});
			container.remove();
		},
	};
};

describe("useSheetUiPersistence", () => {
	beforeEach(() => {
		useCharacterSheetUiStore.getState().reset();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("hydrates the store from the server ui without persisting", () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const view = mount(<Harness characterId="c1" save={save} enabled={true} />);
		try {
			const s = useCharacterSheetUiStore.getState();
			expect(s.hydrated).toBe(true);
			expect(s.activeTab).toBe("features");
			expect(s.sectionNotes.notes).toBe("from server");
			expect(s.dirtyRevision).toBe(0);
			expect(save).not.toHaveBeenCalled();
		} finally {
			view.unmount();
		}
	});

	it("debounces and coalesces rapid pref edits into a single save", () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const view = mount(<Harness characterId="c1" save={save} enabled={true} />);
		try {
			act(() => {
				useCharacterSheetUiStore.getState().setActiveTab("stats");
				useCharacterSheetUiStore.getState().setActiveTab("inventory");
				useCharacterSheetUiStore.getState().setActiveTab("powers");
			});
			expect(save).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(SHEET_UI_PERSIST_DEBOUNCE_MS);
			});

			expect(save).toHaveBeenCalledTimes(1);
			expect(save).toHaveBeenCalledWith({
				ui: expect.objectContaining({ activeTab: "powers" }),
			});
		} finally {
			view.unmount();
		}
	});

	it("writes through only the ui slice so mechanical resources are not clobbered", () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const view = mount(<Harness characterId="c1" save={save} enabled={true} />);
		try {
			act(() => {
				useCharacterSheetUiStore.getState().setModal("health", true);
			});
			act(() => {
				vi.advanceTimersByTime(SHEET_UI_PERSIST_DEBOUNCE_MS);
			});

			expect(save).toHaveBeenCalledTimes(1);
			const payload = save.mock.calls[0][0] as { ui: { modals: object } };
			expect(Object.keys(payload)).toEqual(["ui"]);
			expect((payload.ui.modals as { health: boolean }).health).toBe(true);
		} finally {
			view.unmount();
		}
	});

	it("flushes a pending save on unmount", () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const view = mount(<Harness characterId="c1" save={save} enabled={true} />);
		act(() => {
			useCharacterSheetUiStore.getState().setActiveTab("stats");
		});
		expect(save).not.toHaveBeenCalled();

		view.unmount();
		expect(save).toHaveBeenCalledTimes(1);
	});

	it("does not hydrate or persist when not managing the store", () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const view = mount(
			<Harness characterId="c1" save={save} enabled={false} />,
		);
		try {
			expect(useCharacterSheetUiStore.getState().hydrated).toBe(false);

			act(() => {
				useCharacterSheetUiStore.getState().setActiveTab("stats");
			});
			act(() => {
				vi.advanceTimersByTime(SHEET_UI_PERSIST_DEBOUNCE_MS);
			});

			expect(save).not.toHaveBeenCalled();
		} finally {
			view.unmount();
		}
	});
});
