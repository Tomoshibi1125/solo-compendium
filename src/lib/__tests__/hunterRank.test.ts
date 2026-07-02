import { describe, expect, it } from "vitest";

import {
	hunterRankForLevel,
	hunterRankStyleForLevel,
	nextHunterRankAt,
} from "@/lib/hunterRank";

describe("Bureau license rank ladder", () => {
	it("maps levels to ranks at the canonical thresholds", () => {
		expect(hunterRankForLevel(1)).toBe("D");
		expect(hunterRankForLevel(4)).toBe("D");
		expect(hunterRankForLevel(5)).toBe("C");
		expect(hunterRankForLevel(8)).toBe("C");
		expect(hunterRankForLevel(9)).toBe("B");
		expect(hunterRankForLevel(12)).toBe("B");
		expect(hunterRankForLevel(13)).toBe("A");
		expect(hunterRankForLevel(16)).toBe("A");
		expect(hunterRankForLevel(17)).toBe("S");
		expect(hunterRankForLevel(20)).toBe("S");
	});

	it("reports the next promotion threshold, or null at the S ceiling", () => {
		expect(nextHunterRankAt(1)).toEqual({ rank: "C", minLevel: 5 });
		expect(nextHunterRankAt(8)).toEqual({ rank: "B", minLevel: 9 });
		expect(nextHunterRankAt(16)).toEqual({ rank: "S", minLevel: 17 });
		expect(nextHunterRankAt(17)).toBeNull();
	});

	it("styles use the cool gate tokens (no raw rainbow palette)", () => {
		for (const level of [1, 5, 9, 13, 17]) {
			const style = hunterRankStyleForLevel(level);
			expect(style.color).toMatch(/^text-gate-/);
			expect(style.border).toMatch(/^border-gate-/);
		}
	});
});
