import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-router-dom", () => ({
	useNavigate: () => vi.fn(),
}));

vi.mock("@/components/ui/AscendantWindow", () => ({
	AscendantWindow: ({
		children,
		title,
	}: {
		children: React.ReactNode;
		title?: string;
	}) => <section aria-label={title}>{children}</section>,
}));

vi.mock("@/components/ui/dialog", () => ({
	Dialog: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogHeader: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	DialogTitle: ({ children }: { children: React.ReactNode }) => (
		<h2>{children}</h2>
	),
	DialogTrigger: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

vi.mock("@/components/ui/tabs", () => ({
	Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	TabsContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	TabsList: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	TabsTrigger: ({ children }: { children: React.ReactNode }) => (
		<button type="button">{children}</button>
	),
}));

vi.mock("@/components/warden-directives/DirectiveMatrix", () => ({
	DirectiveLattice: () => <div>Directive Lattice</div>,
}));

vi.mock("@/components/warden-directives/EncounterBuilder", () => ({
	EncounterBuilder: () => <div>Encounter Builder</div>,
}));

vi.mock("@/pages/warden-directives/GateGenerator", () => ({
	default: () => <div>Gate Generator</div>,
}));

vi.mock("@/pages/warden-directives/NPCGenerator", () => ({
	default: () => <div>NPC Generator</div>,
}));

vi.mock("@/components/warden-directives/NPCGenerator", () => ({
	NPCGenerator: () => <div>NPC Generator</div>,
}));

vi.mock("@/pages/warden-directives/RandomEventGenerator", () => ({
	default: () => <div>Random Event Generator</div>,
}));

vi.mock("@/pages/warden-directives/RelicWorkshop", () => ({
	default: () => <div>Relic Workshop</div>,
}));

vi.mock("@/pages/warden-directives/RollableTables", () => ({
	default: () => <div>Rollable Tables</div>,
}));

vi.mock("@/pages/warden-directives/TreasureGenerator", () => ({
	default: () => <div>Treasure Generator</div>,
}));

vi.mock("@/pages/warden-directives/TokenLibrary", () => ({
	default: () => <div>Token Library</div>,
}));

vi.mock("@/components/warden-directives/DungeonMapGenerator", () => ({
	DungeonMapGenerator: () => <div>Dungeon Map Generator</div>,
}));

vi.mock("@/components/art/AIEnhancedArtGenerator", () => ({
	AIEnhancedArtGenerator: () => <div>AI Art Generator</div>,
}));

vi.mock("@/components/vtt/PartyDashboardPanel", () => ({
	PartyDashboardPanel: () => <div>Party Dashboard</div>,
}));

vi.mock("@/components/vtt/VTTAssetBrowser", () => ({
	VTTAssetBrowser: () => <div>Asset Browser</div>,
}));

vi.mock("@/hooks/use-toast", () => ({
	useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/hooks/useCampaigns", () => ({
	useCampaignMembers: () => ({ data: [] }),
}));

vi.mock("@/hooks/useGlobalDDBeyondIntegration", () => ({
	useAscendantTools: () => ({
		trackCustomFeatureUsage: vi.fn().mockResolvedValue(undefined),
	}),
}));

vi.mock("@/hooks/useWardenAudio", () => ({
	useWardenAudio: () => ({
		onMusicChange: vi.fn(),
		onPlaySound: vi.fn(),
	}),
}));

vi.mock("@/lib/vtt/rollMacros", () => ({
	useMacros: () => ({
		macros: [
			{
				id: "default-d20",
				name: "d20",
				formula: "1d20",
				category: "custom",
				createdAt: "2026-01-01T00:00:00.000Z",
			},
		],
	}),
}));

import { WardenToolsPanel } from "@/components/vtt/WardenToolsPanel";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mount = (node: React.ReactElement) => {
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
};

const tick = async () => {
	await act(async () => {
		await Promise.resolve();
	});
};

const waitUntil = async (predicate: () => boolean, timeoutMs = 1500) => {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		await tick();
		if (predicate()) return;
	}
	throw new Error("Timed out waiting for condition");
};

const getButton = (container: HTMLElement, label: string) => {
	const button = Array.from(container.querySelectorAll("button")).find((el) =>
		el.textContent?.includes(label),
	);
	if (!button) {
		throw new Error(`Expected button with label ${label}`);
	}
	return button;
};

describe("WardenToolsPanel collapsible sections", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("connects section toggles to stable collapsible panels", async () => {
		const { container, unmount } = mount(<WardenToolsPanel />);
		await waitUntil(() =>
			Array.from(container.querySelectorAll("button")).some((el) =>
				el.textContent?.includes("Terrain Effects"),
			),
		);
		const sections = [
			["Saved Macros", "warden-tools-macros-panel", "true"],
			["Ambient Music", "warden-tools-music-panel", "false"],
			["Terrain Effects", "warden-tools-terrain-panel", "false"],
			["Ambient Audio Zones", "warden-tools-ambient-panel", "false"],
		] as const;

		for (const [label, panelId, expanded] of sections) {
			const button = getButton(container, label);
			const panel = container.querySelector<HTMLElement>(`#${panelId}`);
			expect(button.getAttribute("aria-expanded")).toBe(expanded);
			expect(button.getAttribute("aria-controls")).toBe(panelId);
			expect(panel).toBeTruthy();
			expect(panel?.hidden).toBe(expanded === "false");
		}

		const musicButton = getButton(container, "Ambient Music");
		const musicPanel = container.querySelector<HTMLElement>(
			"#warden-tools-music-panel",
		);
		act(() => {
			musicButton.click();
		});
		expect(musicButton.getAttribute("aria-expanded")).toBe("true");
		expect(musicPanel?.hidden).toBe(false);

		unmount();
	});

	it("collapses dense sections and enlarges tap targets on mobile", async () => {
		const { container, unmount } = mount(<WardenToolsPanel isMobile />);
		await waitUntil(() =>
			Array.from(container.querySelectorAll("button")).some((el) =>
				el.textContent?.includes("Terrain Effects"),
			),
		);

		expect(
			container.querySelector<HTMLElement>("[data-mobile]")?.dataset.mobile,
		).toBe("true");

		const macrosButton = getButton(container, "Saved Macros");
		const macrosPanel = container.querySelector<HTMLElement>(
			"#warden-tools-macros-panel",
		);
		expect(macrosButton.getAttribute("aria-expanded")).toBe("false");
		expect(macrosPanel?.hidden).toBe(true);
		expect(macrosButton.className).toContain("min-h-11");

		const npcButton = getButton(container, "NPC");
		expect(npcButton.className).toContain("min-h-16");

		unmount();
	});
});
