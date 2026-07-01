import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/appError";
import {
	applyFundsDelta,
	CONTRIBUTION_PER_LEVEL,
	contributionProgress,
	getFundsBalance,
	guildLevelForContribution,
	MAX_GUILD_LEVEL,
	memberCapForContribution,
	memberCapForLevel,
} from "@/lib/guildTreasury";

describe("guild treasury funds", () => {
	it("reads a balance, defaulting missing/negative to zero", () => {
		expect(getFundsBalance({ gate: 40 }, "gate")).toBe(40);
		expect(getFundsBalance({}, "core")).toBe(0);
		expect(getFundsBalance(null, "mana")).toBe(0);
	});

	it("deposits and withdraws immutably", () => {
		const a = applyFundsDelta({ gate: 10 }, "gate", 5);
		expect(a).toEqual({ gate: 15 });
		const b = applyFundsDelta(a, "gate", -15);
		expect(b).toEqual({ gate: 0 });
		// original not mutated
		expect(a).toEqual({ gate: 15 });
	});

	it("rejects overdraws and non-integer/zero amounts", () => {
		expect(() => applyFundsDelta({ gate: 3 }, "gate", -4)).toThrowError(
			AppError,
		);
		expect(() => applyFundsDelta({ gate: 3 }, "gate", 0)).toThrowError(
			AppError,
		);
		expect(() => applyFundsDelta({ gate: 3 }, "gate", 1.5)).toThrowError(
			AppError,
		);
	});
});

describe("guild progression (contribution → level → member cap)", () => {
	it("derives level from contribution and clamps to the max", () => {
		expect(guildLevelForContribution(0)).toBe(1);
		expect(guildLevelForContribution(CONTRIBUTION_PER_LEVEL - 1)).toBe(1);
		expect(guildLevelForContribution(CONTRIBUTION_PER_LEVEL)).toBe(2);
		expect(guildLevelForContribution(CONTRIBUTION_PER_LEVEL * 3)).toBe(4);
		expect(guildLevelForContribution(10_000_000)).toBe(MAX_GUILD_LEVEL);
	});

	it("raises the member cap with level", () => {
		expect(memberCapForLevel(1)).toBe(5);
		expect(memberCapForLevel(2)).toBe(8);
		expect(memberCapForContribution(CONTRIBUTION_PER_LEVEL)).toBe(8);
		expect(memberCapForLevel(2)).toBeGreaterThan(memberCapForLevel(1));
	});

	it("reports progress into the current level (zero at max)", () => {
		expect(contributionProgress(CONTRIBUTION_PER_LEVEL + 120)).toEqual({
			into: 120,
			required: CONTRIBUTION_PER_LEVEL,
		});
		expect(contributionProgress(10_000_000)).toEqual({ into: 0, required: 0 });
	});
});
