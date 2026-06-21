import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the Supabase client, auth, and toast before importing the hook.
vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: {
		from: vi.fn(),
	},
}));

vi.mock("@/lib/auth/authContext", () => ({
	useAuth: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@/hooks/use-toast", () => ({
	useToast: () => ({ toast: vi.fn() }),
}));

import { useCampaignAnalytics } from "@/hooks/useCampaignAnalytics";
import { supabase } from "@/integrations/supabase/client";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type GetAnalytics = (campaignId: string) => Promise<unknown>;

// Just the subset of CampaignAnalytics this test asserts on.
type AnalyticsShape = {
	activeCharacters: number;
	levelProgression: Array<{
		character_id: string;
		character_name: string;
		starting_level: number;
		current_level: number;
		levels_gained: number;
	}>;
};

// Rows returned for the campaign_member_characters → user_characters embed.
type ProgressionRow = {
	character_id: string;
	user_characters: { name: string | null; level: number | null } | null;
};

let progressionRows: ProgressionRow[] = [];
let capturedProgressionSelect = "";

const makeResult = (table: string): { data: unknown; error: null } => {
	switch (table) {
		case "campaigns":
			return { data: { id: "campaign-1", name: "Test Campaign" }, error: null };
		case "campaign_member_characters":
			return { data: progressionRows, error: null };
		default:
			// members, sessions, combat sessions, loot drops — empty is fine.
			return { data: [], error: null };
	}
};

// A thenable query builder: chainable .select/.eq, terminal .order/.single,
// and awaitable directly after .eq (used by the members/progression queries).
const makeBuilder = (table: string) => {
	const result = makeResult(table);
	const builder = {
		select: (sel: string) => {
			if (table === "campaign_member_characters")
				capturedProgressionSelect = sel;
			return builder;
		},
		eq: () => builder,
		order: () => Promise.resolve(result),
		single: () => Promise.resolve(result),
		// biome-ignore lint/suspicious/noThenProperty: intentional — this mock must be awaitable like a PostgREST query builder (await ...eq()).
		then: (
			resolve: (value: { data: unknown; error: null }) => unknown,
			reject?: (reason: unknown) => unknown,
		) => Promise.resolve(result).then(resolve, reject),
	};
	return builder;
};

const mountProbe = () => {
	const holder: { getFn: GetAnalytics | null } = { getFn: null };

	const Probe: React.FC = () => {
		const { getCampaignAnalytics } = useCampaignAnalytics();
		holder.getFn = getCampaignAnalytics;
		return null;
	};

	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(<Probe />);
	});

	const cleanup = () => {
		act(() => root.unmount());
		container.remove();
	};

	const getFn = holder.getFn;
	if (!getFn) throw new Error("Probe failed to expose getCampaignAnalytics");
	return { getFn, cleanup };
};

describe("useCampaignAnalytics — character progression", () => {
	beforeEach(() => {
		progressionRows = [];
		capturedProgressionSelect = "";
		vi.mocked(supabase.from).mockImplementation(
			(table: string) => makeBuilder(table) as never,
		);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("queries campaign_member_characters with valid PostgREST embed (no SQL-alias / table-star)", async () => {
		const { getFn, cleanup } = mountProbe();
		try {
			await act(async () => {
				await getFn("campaign-1");
			});

			// Must embed the live level from user_characters.
			expect(capturedProgressionSelect).toContain("user_characters");
			expect(capturedProgressionSelect).toContain("level");
			// Must NOT use the invalid table-qualified star or SQL "as" aliasing
			// that previously made this query error out silently.
			expect(capturedProgressionSelect).not.toContain(".*,");
			expect(capturedProgressionSelect).not.toMatch(/\bas\b/);
		} finally {
			cleanup();
		}
	});

	it("maps current_level and character_name from the embedded user_characters row", async () => {
		progressionRows = [
			{ character_id: "char-1", user_characters: { name: "Hero", level: 5 } },
			{
				character_id: "char-2",
				user_characters: { name: "Sidekick", level: 3 },
			},
		];

		const { getFn, cleanup } = mountProbe();
		try {
			let analytics: unknown = null;
			await act(async () => {
				analytics = await getFn("campaign-1");
			});

			expect(analytics).not.toBeNull();
			const result = analytics as AnalyticsShape;
			expect(result.activeCharacters).toBe(2);

			const hero = result.levelProgression.find(
				(p) => p.character_id === "char-1",
			);
			expect(hero).toBeDefined();
			expect(hero?.character_name).toBe("Hero");
			expect(hero?.current_level).toBe(5);
		} finally {
			cleanup();
		}
	});
});
