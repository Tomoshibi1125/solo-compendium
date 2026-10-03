import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { updateExtraMock, useCharacterExtrasMock } = vi.hoisted(() => ({
	updateExtraMock: vi.fn(),
	useCharacterExtrasMock: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
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
vi.mock("@/components/character/AddCompanionDialog", () => ({
	AddCompanionDialog: () => null,
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
vi.mock("@/hooks/useCharacterExtras", () => ({
	useCharacterExtras: useCharacterExtrasMock,
}));
vi.mock("@/hooks/useGlobalDDBeyondIntegration", () => ({
	useAscendantTools: () => ({
		trackConditionChange: vi.fn().mockResolvedValue(undefined),
	}),
}));
vi.mock("@/lib/vernacular", () => ({
	formatRegentVernacular: (value: string) => value,
}));

import { CharacterExtrasPanel } from "@/components/character/CharacterExtrasPanel";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const scaledExtra = {
	id: "extra-dragon",
	character_id: "character-1",
	name: "Ember",
	extra_type: "companion",
	// A stale saved projection; the scaled maximum is authoritative.
	hp_current: 30,
	hp_max: 12,
	ac: 13,
	speed: 30,
	equipment: [{ name: "Barding", ac_bonus: 1 }],
	is_active: false,
	monster_id: null,
	effective_stats: {
		hpMax: 50,
		baseAc: 12,
		speed: 30,
		combatScaling: { level: 5 },
	},
};

const savedStatExtra = {
	id: "extra-ally",
	character_id: "character-1",
	name: "Guild Medic",
	extra_type: "ally",
	hp_current: 18,
	hp_max: 18,
	ac: 14,
	speed: 30,
	equipment: [],
	is_active: false,
	monster_id: null,
	effective_stats: null,
};

const cleanups: Array<() => void> = [];

const mountPanel = () => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(<CharacterExtrasPanel characterId="character-1" />);
	});
	cleanups.push(() => {
		act(() => root.unmount());
		container.remove();
	});
};

const button = (label: string) =>
	document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);

beforeEach(() => {
	updateExtraMock.mockResolvedValue({});
	useCharacterExtrasMock.mockReturnValue({
		extras: [scaledExtra, savedStatExtra],
		addExtra: vi.fn(),
		updateExtra: updateExtraMock,
		removeExtra: vi.fn(),
		isLoading: false,
	});
});

afterEach(() => {
	while (cleanups.length > 0) cleanups.pop()?.();
	vi.clearAllMocks();
});

describe("CharacterExtrasPanel companion vitals", () => {
	it("shows a scaled companion's level-derived HP, AC with gear, and level", () => {
		mountPanel();
		const hp = document.querySelector(
			'[data-testid="companion-extra-hp-extra-dragon"]',
		);
		expect(hp?.textContent).toBe("30/50");
		const card = document.querySelector('section[aria-label="EMBER"]');
		expect(card?.textContent).toContain("Scales · level 5");
		expect(card?.textContent).toContain("AC 13");

		act(() => {
			button("Heal Ember by 1")?.click();
		});
		expect(updateExtraMock).toHaveBeenCalledWith({
			id: "extra-dragon",
			data: { hp_current: 31 },
		});
	});

	it("keeps a saved-stat companion on its saved maximum", () => {
		mountPanel();
		expect(
			document.querySelector('[data-testid="companion-extra-hp-extra-ally"]')
				?.textContent,
		).toBe("18/18");
		expect(button("Heal Guild Medic by 1")?.disabled).toBe(true);
		const card = document.querySelector('section[aria-label="GUILD MEDIC"]');
		expect(card?.textContent).not.toContain("Scales");
	});
});
