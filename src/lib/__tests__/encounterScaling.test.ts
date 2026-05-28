import { describe, expect, it } from "vitest";
import {
	analyzeCombatRound,
	type CombatRoundSnapshot,
} from "@/lib/encounterScaling";

const snapshot = (
	combatants: CombatRoundSnapshot["combatants"],
): CombatRoundSnapshot => ({
	sessionId: "s1",
	round: 1,
	combatants,
});

describe("analyzeCombatRound", () => {
	it("returns fair + no recommendation when both sides are mid-fight", () => {
		const r = analyzeCombatRound(
			snapshot([
				{ id: "p1", side: "party", hp: 30, maxHp: 50 },
				{ id: "p2", side: "party", hp: 25, maxHp: 50 },
				{ id: "e1", side: "enemy", hp: 25, maxHp: 50 },
				{ id: "e2", side: "enemy", hp: 30, maxHp: 50 },
			]),
		);
		expect(r.band).toBe("fair");
		expect(r.shouldRecommend).toBe(false);
		expect(r.suggestedScale).toBe(1);
	});

	it("flags deadly when party is < 25% and enemies > 60%", () => {
		const r = analyzeCombatRound(
			snapshot([
				{ id: "p1", side: "party", hp: 5, maxHp: 50 },
				{ id: "p2", side: "party", hp: 5, maxHp: 50 },
				{ id: "e1", side: "enemy", hp: 35, maxHp: 50 },
				{ id: "e2", side: "enemy", hp: 35, maxHp: 50 },
			]),
		);
		expect(r.band).toBe("deadly");
		expect(r.shouldRecommend).toBe(true);
		expect(r.suggestedScale).toBeLessThan(1);
		expect(r.recommendation).toMatch(/Bureau Field Calibration/);
	});

	it("flags trivial when party is > 85% and enemies < 35%", () => {
		const r = analyzeCombatRound(
			snapshot([
				{ id: "p1", side: "party", hp: 48, maxHp: 50 },
				{ id: "p2", side: "party", hp: 47, maxHp: 50 },
				{ id: "e1", side: "enemy", hp: 5, maxHp: 50 },
				{ id: "e2", side: "enemy", hp: 8, maxHp: 50 },
			]),
		);
		expect(r.band).toBe("trivial");
		expect(r.suggestedScale).toBeGreaterThan(1);
	});

	it("downed combatants are excluded from active threat", () => {
		const r = analyzeCombatRound(
			snapshot([
				{ id: "p1", side: "party", hp: 50, maxHp: 50, threat: 2 },
				{ id: "e1", side: "enemy", hp: 0, maxHp: 50, threat: 4, downed: true },
				{ id: "e2", side: "enemy", hp: 50, maxHp: 50, threat: 2 },
			]),
		);
		// Active enemy threat = 2, party threat = 2 → ratio 1.
		expect(r.threatRatio).toBe(1);
	});

	it("party-wiped: zero party HP yields huge threatRatio sentinel", () => {
		const r = analyzeCombatRound(
			snapshot([
				{ id: "p1", side: "party", hp: 0, maxHp: 50, downed: true },
				{ id: "e1", side: "enemy", hp: 50, maxHp: 50 },
			]),
		);
		expect(r.partyHealthRatio).toBe(0);
		expect(r.threatRatio).toBeGreaterThan(10);
	});

	it("handles missing maxHp by treating it as current HP floor", () => {
		const r = analyzeCombatRound(
			snapshot([
				{ id: "p1", side: "party", hp: 10, maxHp: 0 },
				{ id: "e1", side: "enemy", hp: 5, maxHp: 0 },
			]),
		);
		expect(r.partyHealthRatio).toBeGreaterThan(0);
		expect(r.enemyHealthRatio).toBeGreaterThan(0);
	});

	it("recommendation text follows the RA naming convention", () => {
		const r = analyzeCombatRound(
			snapshot([
				{ id: "p1", side: "party", hp: 50, maxHp: 50 },
				{ id: "e1", side: "enemy", hp: 10, maxHp: 50 },
			]),
		);
		expect(r.recommendation).toMatch(/Bureau Field Calibration/);
		expect(r.recommendation).not.toMatch(/DM|GM|player\b/i);
	});
});
