import { beforeEach, describe, expect, it, vi } from "vitest";
import { addInnateChannelingForLevel } from "@/lib/characterCreation";
import type { StaticJob } from "@/types/character";

const mocks = vi.hoisted(() => {
	const insertSpy = vi.fn();
	const limitSpy = vi.fn();
	const eqSpy = vi.fn(() => ({ eq: eqSpy, limit: limitSpy }));
	const selectSpy = vi.fn(() => ({ eq: eqSpy }));
	const fromSpy = vi.fn((table: string) => ({
		select: selectSpy,
		insert: insertSpy,
		table,
	}));

	return { eqSpy, fromSpy, insertSpy, limitSpy, selectSpy };
});

vi.mock("@/integrations/supabase/client", () => ({
	supabase: {
		from: mocks.fromSpy,
	},
}));

vi.mock("@/lib/canonicalCompendium", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/lib/canonicalCompendium")>();
	return {
		...actual,
		findCanonicalCastableByName: vi.fn(async (name: string) => ({
			id: `spell-${name.toLowerCase().replace(/\s+/g, "-")}`,
			name,
			canonical_type: "spells",
			power_level: 1,
			description: "Canonical spell description",
			casting_time: "1 action",
			range: "Self",
			duration: "Instantaneous",
			concentration: false,
			ritual: false,
			higher_levels: null,
			source_book: null,
			tags: [],
		})),
	};
});

vi.mock("@/lib/spellReference", () => ({
	normalizeSpellReference: vi.fn(async ({ name }: { name: string }) => ({
		spell_id: `spell-${name.toLowerCase().replace(/\s+/g, "-")}`,
		matchedBy: "name",
	})),
}));

function innateJob(): StaticJob {
	return {
		id: "test-job",
		name: "Test Channeler",
		innateChanneling: {
			ability: "Presence",
			spells: [
				{
					name: "Signal Flare",
					level: 1,
					unlockLevel: 1,
					uses: { value: 1, per: "long-rest" },
				},
			],
		},
	} as StaticJob;
}

describe("character creation persistence boundaries", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.limitSpy.mockResolvedValue({ data: [] });
		mocks.insertSpy.mockResolvedValue({ data: null, error: null });
	});

	it("stores innate channeling spells in character_spells, not character_powers", async () => {
		await addInnateChannelingForLevel("character-id", innateJob(), 1);

		expect(mocks.fromSpy).toHaveBeenCalledWith("character_spells");
		expect(mocks.fromSpy).not.toHaveBeenCalledWith("character_powers");
		expect(mocks.insertSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				character_id: "character-id",
				name: "Signal Flare",
				spell_level: 1,
				spell_id: "spell-signal-flare",
				is_prepared: true,
				is_known: true,
				counts_against_limit: false,
				source: "Racial Channeling: Test Channeler",
				uses_max: 1,
				uses_current: 1,
				recharge: "long-rest",
			}),
		);
	});
});
