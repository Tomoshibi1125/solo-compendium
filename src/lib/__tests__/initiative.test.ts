import { describe, expect, it } from "vitest";
import {
	type InitiativeCandidate,
	rollD20,
	rollMonsterInitiative,
} from "@/lib/vtt/initiative";

/**
 * Deterministic RNG helper that cycles through a fixed sequence. Accepts
 * values in `[0, 1)`; passing the same value twice maps to the same d20
 * face so tests stay readable.
 */
const seq = (...values: number[]) => {
	let i = 0;
	return () => {
		const v = values[i % values.length];
		i += 1;
		return v;
	};
};

describe("rollD20", () => {
	it("returns 1 at the low end of the RNG range", () => {
		// Math.floor(0 * 20) + 1 === 1
		expect(rollD20(() => 0)).toBe(1);
	});

	it("returns 20 at the high end of the RNG range", () => {
		// Math.floor(0.999999 * 20) + 1 === 20
		expect(rollD20(() => 0.999999)).toBe(20);
	});

	it("falls in the inclusive 1..20 range for arbitrary uniform samples", () => {
		const samples = Array.from({ length: 50 }, () => rollD20());
		expect(samples.every((s) => s >= 1 && s <= 20)).toBe(true);
	});
});

describe("rollMonsterInitiative", () => {
	const goblin: InitiativeCandidate = {
		id: "c-goblin",
		isHunter: false,
		initiative: 0,
		dexMod: 2,
	};
	const lich: InitiativeCandidate = {
		id: "c-lich",
		isHunter: false,
		initiative: 0,
		dexMod: -1,
	};
	const ascendant: InitiativeCandidate = {
		id: "c-ascendant",
		isHunter: true,
		initiative: 0,
		dexMod: 4,
	};

	it("skips hunter-tagged combatants (player characters stay manual)", () => {
		const rolls = rollMonsterInitiative([ascendant], { rng: () => 0.5 });
		expect(rolls).toHaveLength(0);
	});

	it("rolls only fresh monsters by default (initiative === 0)", () => {
		const alreadyRolled: InitiativeCandidate = { ...goblin, initiative: 17 };
		const rolls = rollMonsterInitiative([goblin, alreadyRolled], {
			rng: seq(0.05, 0.95),
		});
		expect(rolls).toHaveLength(1);
		expect(rolls[0].combatantId).toBe("c-goblin");
	});

	it("re-rolls every monster when rerollAll is true", () => {
		const alreadyRolled: InitiativeCandidate = {
			...lich,
			id: "c-lich2",
			initiative: 14,
		};
		const rolls = rollMonsterInitiative([goblin, alreadyRolled, ascendant], {
			rng: seq(0.05, 0.95),
			rerollAll: true,
		});
		expect(rolls.map((r) => r.combatantId)).toEqual(["c-goblin", "c-lich2"]);
	});

	it("applies dexMod to the d20 total", () => {
		const rolls = rollMonsterInitiative([goblin], { rng: () => 0.5 });
		// Math.floor(0.5 * 20) + 1 = 11; +2 dex = 13
		expect(rolls[0]).toEqual({
			combatantId: "c-goblin",
			rolled: 11,
			modifier: 2,
			total: 13,
		});
	});

	it("defaults missing dexMod to 0", () => {
		const noStats: InitiativeCandidate = {
			id: "c-slime",
			isHunter: false,
			initiative: 0,
		};
		const rolls = rollMonsterInitiative([noStats], { rng: () => 0 });
		expect(rolls[0]).toEqual({
			combatantId: "c-slime",
			rolled: 1,
			modifier: 0,
			total: 1,
		});
	});

	it("returns a fresh array — never mutates the input combatants list", () => {
		const input: InitiativeCandidate[] = [goblin, lich];
		const snapshot = JSON.stringify(input);
		rollMonsterInitiative(input, { rng: seq(0.1, 0.2), rerollAll: true });
		expect(JSON.stringify(input)).toBe(snapshot);
	});

	it("returns an empty list when nothing qualifies", () => {
		expect(rollMonsterInitiative([ascendant])).toEqual([]);
		expect(rollMonsterInitiative([])).toEqual([]);
	});

	it("is deterministic under a fixed RNG sequence", () => {
		const a = rollMonsterInitiative([goblin, lich], {
			rng: seq(0.05, 0.95),
		});
		const b = rollMonsterInitiative([goblin, lich], {
			rng: seq(0.05, 0.95),
		});
		expect(a).toEqual(b);
	});
});
