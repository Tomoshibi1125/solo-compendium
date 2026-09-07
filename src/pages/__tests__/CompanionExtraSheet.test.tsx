import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { enqueueMock, toastMock, updateExtraMock, useCharacterExtrasMock } =
	vi.hoisted(() => ({
		enqueueMock: vi.fn(),
		toastMock: vi.fn(),
		updateExtraMock: vi.fn(),
		useCharacterExtrasMock: vi.fn(),
	}));

vi.mock("@use-gesture/react", () => ({
	useDrag: () => () => ({}),
}));
vi.mock("react-router-dom", () => ({
	useParams: () => ({ characterId: "character-1", extraId: "extra-1" }),
	useNavigate: () => vi.fn(),
	Link: ({
		to,
		children,
		...props
	}: {
		to: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) => (
		<a href={to} {...props}>
			{children}
		</a>
	),
}));
vi.mock("@/components/layout/Layout", () => ({
	Layout: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}));
vi.mock("@/components/ui/AscendantWindow", () => ({
	AscendantWindow: ({
		title,
		children,
	}: {
		title: string;
		children: React.ReactNode;
	}) => <section aria-label={title}>{children}</section>,
}));
vi.mock("@/hooks/use-toast", () => ({
	useToast: () => ({ toast: toastMock }),
}));
vi.mock("@/hooks/useCharacterExtras", () => ({
	useCharacterExtras: useCharacterExtrasMock,
}));
vi.mock("@/lib/initiativeQueue", () => ({
	enqueueInitiativeAdditions: enqueueMock,
}));

import { createCanonicalCompanionSource } from "@/lib/companions";
import CompanionExtraSheet from "@/pages/CompanionExtraSheet";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const canonicalSource = createCanonicalCompanionSource({
	canonicalId: "anomaly-test-stalker",
	canonicalType: "anomaly",
	canonicalCollection: "anomalies",
	entryType: "aberration",
	source: "authored-test-catalog",
	sourceBook: "Test Bestiary",
	name: "Test Stalker",
	hpMax: 24,
	baseAc: 14,
	speed: 40,
	rank: "B",
});

const extra = {
	id: "extra-1",
	character_id: "character-1",
	name: "Test Stalker",
	extra_type: "companion",
	hp_current: 18,
	hp_max: 24,
	ac: 14,
	speed: 40,
	initiative: 13,
	notes: "Keeps watch.",
	equipment: [{ name: "Guard Harness", ac_bonus: 2 }],
	abilities: [
		{
			name: "Rending Claw",
			description: "A precise strike.",
			action_type: "action",
		},
	],
	conditions: [
		{
			id: "condition-fixed-1",
			name: "Frightened",
			applied_at: "2026-01-01T00:00:00.000Z",
		},
	],
	npc_data: canonicalSource,
	is_active: false,
	monster_id: null,
	npc_id: null,
	source_guild_id: null,
	source_member_id: null,
	created_at: "2026-01-01T00:00:00.000Z",
	updated_at: "2026-01-01T00:00:00.000Z",
};

const flush = async () => {
	for (let index = 0; index < 5; index++) {
		await act(async () => {
			await Promise.resolve();
		});
	}
};

const activeCleanups: Array<() => void> = [];

const mountSheet = () => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(<CompanionExtraSheet />);
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

const findButtonByText = (text: string) =>
	Array.from(document.querySelectorAll("button")).find((button) =>
		button.textContent?.includes(text),
	);

beforeEach(() => {
	updateExtraMock.mockResolvedValue({});
	useCharacterExtrasMock.mockReturnValue({
		extras: [extra],
		updateExtra: updateExtraMock,
		isLoading: false,
	});
});

afterEach(() => {
	while (activeCleanups.length > 0) {
		activeCleanups.pop()?.();
	}
	vi.clearAllMocks();
});

describe("CompanionExtraSheet source-aware controls", () => {
	it("renders canonical provenance as read-only while instance state remains editable", async () => {
		mountSheet();
		await flush();

		const sourcePanel = document.querySelector<HTMLElement>(
			'[data-testid="canonical-companion-source"]',
		);
		expect(sourcePanel).toBeTruthy();
		expect(sourcePanel?.textContent).toContain("Canonical source");
		expect(sourcePanel?.textContent).toContain("Read-only");
		expect(sourcePanel?.textContent).toContain("anomaly-test-stalker");
		expect(sourcePanel?.textContent).toContain("Test Bestiary");
		expect(
			sourcePanel?.querySelector("input, textarea, select, button"),
		).toBeNull();

		const initiativeInput = document.querySelector<HTMLInputElement>(
			"#companion-initiative",
		);
		const notesInput = document.querySelector<HTMLTextAreaElement>(
			"#companion-extra-notes",
		);
		expect(initiativeInput?.disabled).toBe(false);
		expect(notesInput?.disabled).toBe(false);
		expect(findButtonByText("-1")).toBeTruthy();
		expect(document.body.textContent).toContain("Maximum HP is source-locked");
		expect(document.body.textContent).toContain("Source abilities · read-only");
	});

	it("queues the saved initiative and current effective combat stats", async () => {
		mountSheet();
		await flush();

		const addButton = findButtonByText("Add to Initiative");
		expect(addButton).toBeTruthy();
		act(() => {
			addButton?.click();
		});

		expect(enqueueMock).toHaveBeenCalledWith({
			name: "Test Stalker",
			hp: 18,
			maxHp: 24,
			ac: 16,
			isHunter: false,
			initiative: 13,
			conditions: [],
		});
	});

	it("exposes labeled progress, notes, and a keyboard-operable condition removal", async () => {
		mountSheet();
		await flush();

		const progress = document.querySelector(
			'[role="progressbar"][aria-label="Test Stalker current hit points"]',
		);
		const notesLabel = document.querySelector(
			'label[for="companion-extra-notes"]',
		);
		const removeCondition = document.querySelector<HTMLButtonElement>(
			'button[aria-label="Remove Frightened condition"]',
		);
		expect(progress).toBeTruthy();
		expect(notesLabel?.textContent).toContain("Companion notes");
		expect(removeCondition).toBeTruthy();

		act(() => {
			removeCondition?.click();
		});
		expect(updateExtraMock).toHaveBeenCalledWith({
			id: "extra-1",
			data: { conditions: [] },
		});
	});
});
