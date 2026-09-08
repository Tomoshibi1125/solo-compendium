import {
	createDiceRollSession,
	diceFromResolvedRoll,
	rollManualDicePool,
} from "@/lib/diceTraySession";

describe("dice tray sessions", () => {
	it("keeps an immutable resolved outcome separate from its presentation dice", () => {
		const session = createDiceRollSession({
			id: "session-1",
			source: "character",
			formula: "1d20+5",
			context: "Arcana",
			modifier: 5,
			total: 24,
			rolls: [19],
		});

		expect(session.total).toBe(24);
		expect(session.theme).toBe("umbral-ascendant");
		expect(session.displayMode).toBe("animated");
		expect(session.dice).toEqual([
			expect.objectContaining({ sides: 20, value: 19 }),
		]);
		expect(Object.isFrozen(session)).toBe(true);
		expect(Object.isFrozen(session.dice)).toBe(true);
		expect(Object.isFrozen(session.dice[0])).toBe(true);
	});

	it("preserves an adapter's resolved critical state and selected theme", () => {
		const session = createDiceRollSession({
			formula: "1d20",
			total: 20,
			rolls: [20],
			theme: "frost-regent",
			isCritical: false,
		});

		expect(session.theme).toBe("frost-regent");
		expect(session.displayMode).toBe("animated");
		expect(session.isCritical).toBe(false);
	});

	it("shows both dice for a resolved advantage check without changing the kept total", () => {
		const session = createDiceRollSession({
			formula: "1d20+3",
			context: "Stealth",
			modifier: 3,
			total: 20,
			rolls: [17],
			droppedRolls: [4],
		});

		expect(session.dice).toEqual([
			expect.objectContaining({ sides: 20, value: 17, kept: true }),
			expect.objectContaining({ sides: 20, value: 4, dropped: true }),
		]);
		expect(session.total).toBe(20);
	});

	it("expands a d100 outcome into clearly marked tens and ones dice", () => {
		const dice = diceFromResolvedRoll("1d100", [100]);
		expect(dice).toHaveLength(2);
		expect(dice[0]).toEqual(
			expect.objectContaining({
				value: 10,
				displayValue: 0,
				displayMode: "percentile-tens",
			}),
		);
		expect(dice[1]).toEqual(
			expect.objectContaining({
				value: 10,
				displayValue: 0,
				displayMode: "percentile-ones",
			}),
		);
	});

	it("uses advantage only for a single d20 manual check", () => {
		const result = rollManualDicePool(
			[{ sides: 20, count: 1 }],
			2,
			"advantage",
		);
		expect(result.rolls).toHaveLength(1);
		expect(result.droppedRolls).toHaveLength(1);
		expect(result.dice).toHaveLength(2);
		expect(result.dice[0]?.kept).toBe(true);
		expect(result.dice[1]?.dropped).toBe(true);
		expect(result.total).toBe(result.rolls[0] + 2);

		const pool = rollManualDicePool([{ sides: 20, count: 2 }], 0, "advantage");
		expect(pool.rolls).toHaveLength(2);
		expect(pool.droppedRolls).toHaveLength(0);
	});
});
