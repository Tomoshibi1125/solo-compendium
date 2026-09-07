import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { addExtraMock, addGuildAllyMock, useQueryMock } = vi.hoisted(() => ({
	addExtraMock: vi.fn(),
	addGuildAllyMock: vi.fn(),
	useQueryMock: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
	useQuery: useQueryMock,
}));
vi.mock("@/hooks/useCharacterExtras", () => ({
	useCharacterExtras: () => ({ addExtra: addExtraMock }),
	useAddGuildAllyCompanion: () => ({
		mutateAsync: addGuildAllyMock,
		isPending: false,
	}),
}));
vi.mock("@/lib/canonicalCompendium", () => ({
	listCanonicalEntries: vi.fn(),
}));
vi.mock("@/data/compendium/sandbox-npcs", () => ({
	sandboxRecruitableNPCs: [],
}));
vi.mock("@/lib/vernacular", () => ({
	formatRegentVernacular: (value: string) => value,
}));
vi.mock("@/components/character/AddDialogDetailPanel", () => ({
	AddDialogDetailPanel: () => null,
}));

import { AddCompanionDialog } from "@/components/character/AddCompanionDialog";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const statblock = {
	id: "anomaly-test-stalker",
	name: "Test Stalker",
	creature_type: "aberration",
	gate_rank: "B",
	hit_points_average: 42,
	armor_class: 15,
	speed_walk: 35,
	source: "authored-test-catalog",
	source_book: "Test Bestiary",
	Anomaly_traits: [{ name: "Keen Senses", description: "Sees through fog." }],
	Anomaly_actions: [
		{
			name: "Rending Claw",
			description: "A precise strike.",
			action_type: "action",
		},
	],
};

const mount = {
	id: "mount-test-runner",
	name: "Test Runner",
	vehicle_type: "mount",
	rank: "C",
	hit_points: { max: 24 },
	armor_class: 12,
	speed: { land: 60 },
	source: "authored-test-catalog",
	source_book: "Test Stable Guide",
	abilities: [
		{
			name: "Sure-Footed",
			description: "Ignores rough ground.",
			action_type: "passive",
		},
	],
};

const flush = async () => {
	for (let index = 0; index < 5; index++) {
		await act(async () => {
			await Promise.resolve();
		});
	}
};

const activeCleanups: Array<() => void> = [];

const mountDialog = (element: React.ReactElement) => {
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
	return { unmount };
};

const findButton = (label: string) =>
	Array.from(document.querySelectorAll("button")).find(
		(button) => button.getAttribute("aria-label") === label,
	);

beforeEach(() => {
	addExtraMock.mockResolvedValue({ id: "extra-1" });
	addGuildAllyMock.mockResolvedValue({ id: "extra-ally" });
	useQueryMock.mockImplementation((options: { queryKey: [string, string] }) => {
		if (options.queryKey[0] === "companion-statblocks") {
			return { data: [statblock], isLoading: false };
		}
		if (options.queryKey[0] === "companion-mounts") {
			return { data: [mount], isLoading: false };
		}
		return { data: [], isLoading: false };
	});
});

afterEach(() => {
	while (activeCleanups.length > 0) {
		activeCleanups.pop()?.();
	}
	vi.clearAllMocks();
});

describe("AddCompanionDialog canonical persistence", () => {
	it("persists statblock identity, type, source, fields, and authored abilities", async () => {
		const onOpenChange = vi.fn();
		mountDialog(
			<AddCompanionDialog
				open={true}
				onOpenChange={onOpenChange}
				characterId="character-1"
			/>,
		);
		await flush();

		const search = document.querySelector<HTMLInputElement>(
			"#companion-catalog-search",
		);
		const searchLabel = document.querySelector(
			'label[for="companion-catalog-search"]',
		);
		expect(search).toBeTruthy();
		expect(searchLabel?.textContent).toContain("Search statblocks");

		const addButton = findButton("Add Test Stalker");
		expect(addButton).toBeTruthy();
		await act(async () => {
			addButton?.click();
			await Promise.resolve();
		});
		await flush();

		expect(addExtraMock).toHaveBeenCalledTimes(1);
		expect(addExtraMock).toHaveBeenCalledWith(
			expect.objectContaining({
				character_id: "character-1",
				name: "Test Stalker",
				extra_type: "companion",
				hp_current: 42,
				hp_max: 42,
				ac: 15,
				speed: 35,
				monster_id: null,
				abilities: [
					{
						name: "Keen Senses",
						description: "Sees through fog.",
						action_type: "trait",
					},
					{
						name: "Rending Claw",
						description: "A precise strike.",
						action_type: "action",
					},
				],
				npc_data: {
					kind: "canonical-compendium",
					version: 1,
					provenance: {
						canonicalId: "anomaly-test-stalker",
						canonicalType: "anomaly",
						canonicalCollection: "anomalies",
						entryType: "aberration",
						source: "authored-test-catalog",
						sourceBook: "Test Bestiary",
					},
					sourceFields: {
						name: "Test Stalker",
						hpMax: 42,
						baseAc: 15,
						speed: 35,
						rank: "B",
					},
				},
			}),
		);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("persists mount provenance and the selected canonical land speed", async () => {
		mountDialog(
			<AddCompanionDialog
				open={true}
				onOpenChange={vi.fn()}
				characterId="character-1"
			/>,
		);
		await flush();

		const mountsTab = Array.from(
			document.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
		).find((tab) => tab.textContent?.includes("Mounts"));
		expect(mountsTab).toBeTruthy();
		act(() => {
			mountsTab?.dispatchEvent(
				new MouseEvent("mousedown", { bubbles: true, button: 0 }),
			);
		});
		await flush();

		const addButton = findButton("Add Test Runner");
		expect(addButton).toBeTruthy();
		await act(async () => {
			addButton?.click();
			await Promise.resolve();
		});
		await flush();

		expect(addExtraMock).toHaveBeenCalledWith(
			expect.objectContaining({
				extra_type: "mount",
				speed: 60,
				abilities: [
					{
						name: "Sure-Footed",
						description: "Ignores rough ground.",
						action_type: "passive",
					},
				],
				npc_data: expect.objectContaining({
					provenance: {
						canonicalId: "mount-test-runner",
						canonicalType: "vehicle",
						canonicalCollection: "vehicles",
						entryType: "mount",
						source: "authored-test-catalog",
						sourceBook: "Test Stable Guide",
					},
					sourceFields: expect.objectContaining({ speed: 60 }),
				}),
			}),
		);
	});
});
