/**
 * Sheet damage pipeline (Jul 18 audit follow-up).
 *
 * The HP dialog used to hand the sheet a bare number: no damage type, and
 * `tempHp: 0` hardcoded. So a character's resistances never applied to manual
 * damage and their temporary HP was displayed but never absorbed anything —
 * both engines existed, neither was wired. A critical hit at 0 HP also cost
 * one death-save failure instead of two.
 *
 * These tests pin the rules in dependency order (mitigation → temp HP → HP →
 * death saves) plus the structural wiring the sheet must keep.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	type CharacterResources,
	consumeTemporaryHP,
	initializeCharacterResources,
} from "@/lib/characterResources";
import { applyDamageMitigation } from "@/lib/damageApplication";
import {
	applyDamageAtZero,
	INITIAL_DEATH_SAVE_STATE,
} from "@/lib/deathSaveRules";
import { applyDamage } from "@/lib/hpAdjustments";

const ROOT = resolve(__dirname, "../../..");
const src = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

const withTempHp = (
	sources: Array<{ amount: number; source: string; expires_at?: string }>,
): CharacterResources => ({
	...initializeCharacterResources(),
	temp_hp_sources: sources,
});

describe("temp HP absorbs damage (RA pools sources — house rule)", () => {
	it("drains sources in order and reports what was absorbed", () => {
		const resources = withTempHp([
			{ amount: 5, source: "Remnants" },
			{ amount: 8, source: "Mantra" },
		]);
		const { resources: after, absorbed } = consumeTemporaryHP(resources, 7);
		expect(absorbed).toBe(7);
		// Oldest source fully spent and dropped; the newer one partially spent.
		expect(after.temp_hp_sources).toEqual([{ amount: 6, source: "Mantra" }]);
	});

	it("absorbs only what it has and leaves the rest for real HP", () => {
		const { resources: after, absorbed } = consumeTemporaryHP(
			withTempHp([{ amount: 3, source: "Remnants" }]),
			10,
		);
		expect(absorbed).toBe(3);
		expect(after.temp_hp_sources).toEqual([]);
	});

	it("pooling is INTENTIONAL: two sources stack rather than taking the higher", () => {
		// 5e RAW would keep only the larger (8). RA deliberately pools to 13 —
		// do not "fix" this to RAW without the owner's say-so.
		const { absorbed } = consumeTemporaryHP(
			withTempHp([
				{ amount: 5, source: "Remnants" },
				{ amount: 8, source: "Mantra" },
			]),
			13,
		);
		expect(absorbed).toBe(13);
	});

	it("ignores expired sources", () => {
		const past = new Date(Date.now() - 60_000).toISOString();
		const { absorbed } = consumeTemporaryHP(
			withTempHp([{ amount: 9, source: "Stale", expires_at: past }]),
			5,
		);
		expect(absorbed).toBe(0);
	});

	it("zero damage is a no-op", () => {
		const resources = withTempHp([{ amount: 4, source: "Remnants" }]);
		const { resources: after, absorbed } = consumeTemporaryHP(resources, 0);
		expect(absorbed).toBe(0);
		expect(after).toBe(resources);
	});
});

describe("full pipeline: mitigation → temp HP → HP", () => {
	const mitigation = { resistances: ["necrotic"], immunities: ["poison"] };

	it("resistance halves before temp HP absorbs", () => {
		// 10 necrotic → 5 after resistance → 4 absorbed by THP → 1 to HP.
		const mitigated = applyDamageMitigation({
			rawDamage: 10,
			damageType: "necrotic",
			mitigation,
		});
		expect(mitigated.finalDamage).toBe(5);

		const result = applyDamage({
			hpCurrent: 11,
			hpMax: 11,
			tempHp: 4,
			damage: mitigated.finalDamage,
		});
		expect(result.newTempHp).toBe(0);
		expect(result.newHp).toBe(10);
	});

	it("immunity zeroes the hit entirely", () => {
		const mitigated = applyDamageMitigation({
			rawDamage: 12,
			damageType: "poison",
			mitigation,
		});
		expect(mitigated.finalDamage).toBe(0);
	});

	it("untyped damage bypasses mitigation (the DM already applied it)", () => {
		const mitigated = applyDamageMitigation({
			rawDamage: 10,
			damageType: null,
			mitigation,
		});
		expect(mitigated.finalDamage).toBe(10);
	});
});

describe("critical hits at 0 HP cost two death saves (PHB p.197)", () => {
	it("a normal hit costs one failure, a critical costs two", () => {
		expect(applyDamageAtZero(INITIAL_DEATH_SAVE_STATE, 3, 20).failures).toBe(1);
		expect(
			applyDamageAtZero(INITIAL_DEATH_SAVE_STATE, 3, 20, true).failures,
		).toBe(2);
	});

	it("a critical on an existing failure is lethal", () => {
		const state = { ...INITIAL_DEATH_SAVE_STATE, failures: 1 };
		const next = applyDamageAtZero(state, 3, 20, true);
		expect(next.failures).toBe(3);
		expect(next.isDead).toBe(true);
	});

	it("failures stay capped at three", () => {
		const state = { ...INITIAL_DEATH_SAVE_STATE, failures: 2 };
		expect(applyDamageAtZero(state, 3, 20, true).failures).toBe(3);
	});

	it("massive damage still kills outright regardless of crit flag", () => {
		const next = applyDamageAtZero(INITIAL_DEATH_SAVE_STATE, 20, 20, false);
		expect(next.isDead).toBe(true);
	});
});

describe("structural wiring — the sheet uses the full pipeline", () => {
	it("the damage handler no longer hardcodes tempHp: 0", () => {
		const s = src("src/components/character-v2/CharacterSheetV2.tsx");
		expect(/tempHp:\s*0\b/.test(s)).toBe(false);
		expect(s.includes("applyDamageMitigation")).toBe(true);
		expect(s.includes("consumeTemporaryHP")).toBe(true);
	});

	it("the dialog offers a damage type and a critical-hit flag", () => {
		const s = src("src/components/CharacterSheet/HealthDialog.tsx");
		expect(s.includes("damage-type-select")).toBe(true);
		expect(s.includes("critical-hit-checkbox")).toBe(true);
	});
});
