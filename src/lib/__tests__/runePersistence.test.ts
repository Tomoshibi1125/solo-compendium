import { beforeEach, describe, expect, it, vi } from "vitest";

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
	supabase: { rpc },
}));

import { autoLearnRunes } from "@/lib/runeAutomation";

describe("canonical rune persistence", () => {
	beforeEach(() => {
		rpc.mockReset();
	});

	it("persists the static rune key through the owner-checked RPC", async () => {
		rpc.mockResolvedValue({ data: [], error: null });

		await expect(
			autoLearnRunes({ id: "3d7bc8e4-7252-4b05-b41f-b8907131351d", level: 4 }, [
				"rune-spell-fireball",
			]),
		).resolves.toEqual(["rune-spell-fireball"]);

		expect(rpc).toHaveBeenCalledWith("discover_character_rune", {
			p_character_id: "3d7bc8e4-7252-4b05-b41f-b8907131351d",
			p_rune_key: "rune-spell-fireball",
			p_is_mastered: false,
		});
	});

	it("propagates persistence failures instead of reporting a false success", async () => {
		const error = { code: "42501", message: "You do not own this character" };
		rpc.mockResolvedValue({ data: null, error });

		await expect(
			autoLearnRunes({ id: "3d7bc8e4-7252-4b05-b41f-b8907131351d", level: 4 }, [
				"rune-spell-fireball",
			]),
		).rejects.toEqual(error);
	});
});
