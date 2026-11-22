/**
 * RA-10: a character's Long Rest also rests its companions, by the same rules,
 * through one awaited server call. A companion failure never undoes the
 * character's own rest.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
	const character = {
		id: "character-1",
		name: "Rest Tester",
		job: "Destroyer",
		path: null,
		level: 5,
		hp_current: 5,
		hp_max: 40,
		hit_dice_current: 1,
		hit_dice_max: 5,
		rift_favor_max: 3,
		exhaustion_level: 0,
		conditions: [],
		gemini_state: {},
	};
	/** A chainable, awaitable stand-in for a Supabase query builder. */
	const chain = (result: unknown, single: unknown = result): unknown => {
		const proxy: unknown = new Proxy(
			{},
			{
				get(_target, property) {
					if (property === "then") {
						return (
							resolve: (value: unknown) => unknown,
							reject: (reason: unknown) => unknown,
						) => Promise.resolve(result).then(resolve, reject);
					}
					if (property === "single" || property === "maybeSingle") {
						return () => Promise.resolve(single);
					}
					return () => proxy;
				},
			},
		);
		return proxy;
	};
	const rpc = vi.fn();
	const from = vi.fn((table: string) =>
		table === "characters"
			? chain({ data: null, error: null }, { data: character, error: null })
			: chain({ data: [], error: null }),
	);
	return { rpc, from };
});

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: true,
	supabase: { from: mocks.from, rpc: mocks.rpc },
}));
vi.mock("@/lib/regentResonance", () => ({
	refillRegentResonance: vi.fn(async () => {}),
}));
vi.mock("@/lib/characterOverlayValidation", () => ({
	normalizeGeminiState: vi.fn(async (state: unknown) => state),
}));

import { executeLongRest, executeShortRest } from "@/lib/restSystem";

const companionCalls = () =>
	mocks.rpc.mock.calls.filter(
		([name]) => name === "rest_companions_for_character",
	);

beforeEach(() => {
	mocks.rpc.mockReset();
	mocks.rpc.mockResolvedValue({ data: 0, error: null });
});

describe("companion rests follow the character's rest", () => {
	it("rests the character's companions on a Long Rest", async () => {
		await expect(executeLongRest("character-1")).resolves.toEqual({});
		expect(companionCalls()).toEqual([
			[
				"rest_companions_for_character",
				{ p_character_id: "character-1", p_rest_kind: "long" },
			],
		]);
	});

	it("reports a companion failure without undoing the character's rest", async () => {
		mocks.rpc.mockImplementation(async (name: string) =>
			name === "rest_companions_for_character"
				? { data: null, error: { message: "COMPANION_REST_FAILED" } }
				: { data: 0, error: null },
		);
		await expect(executeLongRest("character-1")).resolves.toEqual({
			companionRestError: "COMPANION_REST_FAILED",
		});
		expect(mocks.from).toHaveBeenCalledWith("characters");
		expect(
			mocks.rpc.mock.calls.some(
				([name]) => name === "on_long_rest_assign_quests",
			),
		).toBe(true);
	});

	it("leaves a Short Rest's Hit Dice to the Short Rest dialog", async () => {
		await executeShortRest("character-1");
		expect(companionCalls()).toEqual([]);
	});
});
