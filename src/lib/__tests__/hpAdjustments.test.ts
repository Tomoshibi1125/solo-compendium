/**
 * HP / Temp HP / Heal adjustment regression tests (DDB / 5e parity).
 *
 * Locks in the damage absorption rules (THP first), the massive-damage
 * detection used for instant-kill, the at-zero gate that triggers death
 * saves, healing clamp, and the RAW Temp HP "doesn't stack" rule.
 */
import { describe, expect, it } from "vitest";
import { applyDamage, applyHealing, applyTempHp } from "@/lib/hpAdjustments";

describe("applyDamage — temp HP absorbs first", () => {
	it("THP fully absorbs damage smaller than the pool", () => {
		const r = applyDamage({ hpCurrent: 30, hpMax: 30, tempHp: 10, damage: 5 });
		expect(r.newHp).toBe(30);
		expect(r.newTempHp).toBe(5);
		expect(r.hpLost).toBe(0);
		expect(r.droppedToZero).toBe(false);
	});

	it("THP partially absorbs; remainder hits HP", () => {
		const r = applyDamage({ hpCurrent: 30, hpMax: 30, tempHp: 7, damage: 12 });
		expect(r.newTempHp).toBe(0);
		expect(r.hpLost).toBe(5);
		expect(r.newHp).toBe(25);
	});

	it("zero THP — full damage hits HP", () => {
		const r = applyDamage({ hpCurrent: 30, hpMax: 30, tempHp: 0, damage: 8 });
		expect(r.newHp).toBe(22);
		expect(r.newTempHp).toBe(0);
	});
});

describe("applyDamage — HP floor and at-zero detection", () => {
	it("damage taking HP exactly to 0 sets droppedToZero", () => {
		const r = applyDamage({ hpCurrent: 5, hpMax: 30, tempHp: 0, damage: 5 });
		expect(r.newHp).toBe(0);
		expect(r.droppedToZero).toBe(true);
		expect(r.wasAtZero).toBe(false);
	});

	it("excess damage clamps HP at 0 and reports overflow", () => {
		const r = applyDamage({ hpCurrent: 5, hpMax: 30, tempHp: 0, damage: 25 });
		expect(r.newHp).toBe(0);
		expect(r.overflowDamage).toBe(20);
	});

	it("damage while already at 0 sets wasAtZero and not droppedToZero", () => {
		const r = applyDamage({ hpCurrent: 0, hpMax: 30, tempHp: 0, damage: 5 });
		expect(r.wasAtZero).toBe(true);
		expect(r.droppedToZero).toBe(false);
	});
});

describe("applyDamage — massive damage rule (PHB p.197)", () => {
	it("overflow ≥ HP max triggers massiveDamage", () => {
		// Going from 5/30 to 0 with overflow of 30+ → instant kill.
		const r = applyDamage({ hpCurrent: 5, hpMax: 30, tempHp: 0, damage: 35 });
		expect(r.massiveDamage).toBe(true);
		expect(r.overflowDamage).toBe(30);
	});

	it("overflow < HP max does NOT trigger massiveDamage", () => {
		const r = applyDamage({ hpCurrent: 5, hpMax: 30, tempHp: 0, damage: 25 });
		expect(r.massiveDamage).toBe(false);
		expect(r.overflowDamage).toBe(20);
	});

	it("massiveDamage false when already at 0 (caller routes to deathSaves.takeDamageAtZero instead)", () => {
		const r = applyDamage({ hpCurrent: 0, hpMax: 30, tempHp: 0, damage: 100 });
		// Already at 0 → not a transition into 0 → massiveDamage flag here is false.
		// Caller's death-save handler will route this to takeDamageAtZero(damage, hpMax) which
		// re-evaluates the massive rule for the at-zero case.
		expect(r.massiveDamage).toBe(false);
	});

	it("massive damage rule respects THP absorption (THP cushions overflow)", () => {
		const r = applyDamage({ hpCurrent: 5, hpMax: 30, tempHp: 5, damage: 35 });
		// THP absorbs 5, HP loss 30 → newHp 0, overflow 25 < 30 → not massive.
		expect(r.massiveDamage).toBe(false);
		expect(r.overflowDamage).toBe(25);
	});
});

describe("applyDamage — defensive inputs", () => {
	it("damage 0 is a no-op", () => {
		const r = applyDamage({ hpCurrent: 30, hpMax: 30, tempHp: 5, damage: 0 });
		expect(r.newHp).toBe(30);
		expect(r.newTempHp).toBe(5);
		expect(r.hpLost).toBe(0);
	});

	it("negative damage is treated as 0", () => {
		const r = applyDamage({ hpCurrent: 30, hpMax: 30, tempHp: 0, damage: -10 });
		expect(r.newHp).toBe(30);
	});
});

describe("applyHealing", () => {
	it("heals up to but never above HP max", () => {
		const r = applyHealing({ hpCurrent: 25, hpMax: 30, heal: 10 });
		expect(r.newHp).toBe(30);
		expect(r.hpGained).toBe(5);
	});

	it("heal at exact max is a no-op", () => {
		const r = applyHealing({ hpCurrent: 30, hpMax: 30, heal: 5 });
		expect(r.newHp).toBe(30);
		expect(r.hpGained).toBe(0);
	});

	it("wasAtZero true when healing from 0 HP", () => {
		const r = applyHealing({ hpCurrent: 0, hpMax: 30, heal: 5 });
		expect(r.wasAtZero).toBe(true);
		expect(r.newHp).toBe(5);
	});

	it("zero heal is a no-op (no spurious wasAtZero side effect on UI)", () => {
		const r = applyHealing({ hpCurrent: 0, hpMax: 30, heal: 0 });
		expect(r.newHp).toBe(0);
		expect(r.hpGained).toBe(0);
		expect(r.wasAtZero).toBe(true); // The flag still reports state for UI gating
	});

	it("negative heal is clamped to 0 (no damage via this path)", () => {
		const r = applyHealing({ hpCurrent: 10, hpMax: 30, heal: -5 });
		expect(r.newHp).toBe(10);
		expect(r.hpGained).toBe(0);
	});
});

describe("applyTempHp — RAW: doesn't stack, larger replaces", () => {
	it("new pool larger than current replaces it", () => {
		const r = applyTempHp(5, 10);
		expect(r.newTempHp).toBe(10);
		expect(r.replaced).toBe(true);
	});

	it("new pool smaller than current is ignored", () => {
		const r = applyTempHp(10, 5);
		expect(r.newTempHp).toBe(10);
		expect(r.replaced).toBe(false);
	});

	it("equal pools do not replace (RAW: 'larger', strictly greater)", () => {
		const r = applyTempHp(7, 7);
		expect(r.newTempHp).toBe(7);
		expect(r.replaced).toBe(false);
	});

	it("negative new source is treated as 0 (no-op)", () => {
		const r = applyTempHp(5, -10);
		expect(r.newTempHp).toBe(5);
		expect(r.replaced).toBe(false);
	});

	it("from 0 THP, any positive new source replaces", () => {
		const r = applyTempHp(0, 1);
		expect(r.newTempHp).toBe(1);
		expect(r.replaced).toBe(true);
	});
});
