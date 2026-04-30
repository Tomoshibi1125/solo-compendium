/**
 * Death Save Rules — DDB / 5e RAW parity regression tests.
 *
 * These lock in the SRD rules so the React hook (`useDeathSaves`) and
 * any future refactors can't drift from the parity baseline.
 */
import { describe, expect, it } from "vitest";
import {
	applyDamageAtZero,
	applyDeathSaveRoll,
	applyHealingAtZero,
	applyReset,
	applyStabilize,
	type DeathSaveState,
	INITIAL_DEATH_SAVE_STATE,
} from "@/lib/deathSaveRules";

const fresh = (overrides: Partial<DeathSaveState> = {}): DeathSaveState => ({
	...INITIAL_DEATH_SAVE_STATE,
	...overrides,
});

describe("INITIAL_DEATH_SAVE_STATE", () => {
	it("has all counters at zero and flags off", () => {
		expect(INITIAL_DEATH_SAVE_STATE).toEqual({
			successes: 0,
			failures: 0,
			isStable: false,
			isDead: false,
		});
	});
});

describe("applyDeathSaveRoll", () => {
	it("Nat 20 resets state and is reported as success", () => {
		const result = applyDeathSaveRoll(fresh({ successes: 1, failures: 2 }), 20);
		expect(result.isNat20).toBe(true);
		expect(result.success).toBe(true);
		expect(result.newState).toEqual(INITIAL_DEATH_SAVE_STATE);
		expect(result.message).toContain("regain 1 HP");
	});

	it("Nat 1 from clean state adds 2 failures (not dead yet)", () => {
		const result = applyDeathSaveRoll(fresh(), 1);
		expect(result.isNat1).toBe(true);
		expect(result.success).toBe(false);
		expect(result.newState).toMatchObject({ failures: 2, isDead: false });
	});

	it("Nat 1 with 1 failure tips to 3 → dead", () => {
		const result = applyDeathSaveRoll(fresh({ failures: 1 }), 1);
		expect(result.newState.failures).toBe(3);
		expect(result.newState.isDead).toBe(true);
		expect(result.message).toContain("died");
	});

	it("Nat 1 caps failures at 3 (no overflow)", () => {
		const result = applyDeathSaveRoll(fresh({ failures: 2 }), 1);
		expect(result.newState.failures).toBe(3);
	});

	it("Roll = 10 is a success (+1)", () => {
		const result = applyDeathSaveRoll(fresh(), 10);
		expect(result.success).toBe(true);
		expect(result.newState.successes).toBe(1);
	});

	it("Roll = 9 is a failure (+1)", () => {
		const result = applyDeathSaveRoll(fresh(), 9);
		expect(result.success).toBe(false);
		expect(result.newState.failures).toBe(1);
	});

	it("3rd success marks the character stable", () => {
		const result = applyDeathSaveRoll(fresh({ successes: 2 }), 15);
		expect(result.newState.successes).toBe(3);
		expect(result.newState.isStable).toBe(true);
		expect(result.message).toContain("stable");
	});

	it("3rd failure marks the character dead", () => {
		const result = applyDeathSaveRoll(fresh({ failures: 2 }), 5);
		expect(result.newState.failures).toBe(3);
		expect(result.newState.isDead).toBe(true);
		expect(result.message).toContain("died");
	});

	it("does not mutate the input state", () => {
		const before: DeathSaveState = fresh({ successes: 1, failures: 1 });
		const snapshot = { ...before };
		applyDeathSaveRoll(before, 11);
		expect(before).toEqual(snapshot);
	});

	it("nat-20 reset clears stable/dead flags too", () => {
		const result = applyDeathSaveRoll(
			{
				successes: 1,
				failures: 2,
				isStable: false,
				isDead: false,
			},
			20,
		);
		expect(result.newState.isDead).toBe(false);
		expect(result.newState.isStable).toBe(false);
	});
});

describe("applyDamageAtZero (massive damage rule)", () => {
	it("damage ≥ HP max kills outright with 3 failures", () => {
		const result = applyDamageAtZero(fresh(), 30, 25);
		expect(result.failures).toBe(3);
		expect(result.isDead).toBe(true);
		expect(result.successes).toBe(0);
		expect(result.isStable).toBe(false);
	});

	it("damage < HP max adds one failure", () => {
		const result = applyDamageAtZero(fresh(), 5, 25);
		expect(result.failures).toBe(1);
		expect(result.isDead).toBe(false);
	});

	it("third sub-massive failure kills", () => {
		const result = applyDamageAtZero(fresh({ failures: 2 }), 5, 25);
		expect(result.failures).toBe(3);
		expect(result.isDead).toBe(true);
	});

	it("damage exactly equal to HP max triggers massive damage", () => {
		const result = applyDamageAtZero(fresh(), 25, 25);
		expect(result.isDead).toBe(true);
	});

	it("clears stable flag when taking damage at 0 HP", () => {
		const result = applyDamageAtZero(fresh({ isStable: true }), 5, 25);
		expect(result.isStable).toBe(false);
	});

	it("does not mutate the input state", () => {
		const before: DeathSaveState = fresh({ failures: 1 });
		const snapshot = { ...before };
		applyDamageAtZero(before, 5, 25);
		expect(before).toEqual(snapshot);
	});
});

describe("applyHealingAtZero", () => {
	it("returns a fresh INITIAL state", () => {
		expect(applyHealingAtZero()).toEqual(INITIAL_DEATH_SAVE_STATE);
	});

	it("returns a NEW object each call (no shared mutation)", () => {
		const a = applyHealingAtZero();
		const b = applyHealingAtZero();
		expect(a).not.toBe(b);
	});
});

describe("applyStabilize", () => {
	it("sets isStable=true without changing other fields", () => {
		const result = applyStabilize(fresh({ failures: 2 }));
		expect(result.isStable).toBe(true);
		expect(result.failures).toBe(2);
	});

	it("does not mutate the input", () => {
		const before = fresh({ failures: 2 });
		applyStabilize(before);
		expect(before.isStable).toBe(false);
	});
});

describe("applyReset", () => {
	it("returns INITIAL state", () => {
		expect(applyReset()).toEqual(INITIAL_DEATH_SAVE_STATE);
	});
});
