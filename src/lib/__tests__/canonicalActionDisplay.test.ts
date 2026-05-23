import { describe, expect, it } from "vitest";
import {
	formatAttackLine,
	formatCompactActionLine,
	formatDamageLine,
	formatSaveLine,
} from "../canonicalActionDisplay";

describe("formatAttackLine", () => {
	it("returns empty string when no info is present", () => {
		expect(formatAttackLine({})).toBe("");
	});

	it("formats ability + attack bonus + roll", () => {
		expect(
			formatAttackLine({
				ability: "AGI",
				abilityModifier: 3,
				attackBonus: 5,
				attackRoll: "1d20+5",
			}),
		).toBe("AGI +3 · Attack +5 (1d20+5)");
	});

	it("renders +0 for zero ability modifier and zero attack bonus", () => {
		expect(
			formatAttackLine({
				ability: "STR",
				abilityModifier: 0,
				attackBonus: 0,
			}),
		).toBe("STR +0 · Attack +0");
	});

	it("falls back to attack roll only when no ability info", () => {
		expect(formatAttackLine({ attackRoll: "1d20+7" })).toBe("1d20+7");
	});

	it("formats negative attack bonus", () => {
		expect(
			formatAttackLine({
				ability: "PRE",
				abilityModifier: -1,
				attackBonus: -1,
			}),
		).toBe("PRE -1 · Attack -1");
	});
});

describe("formatDamageLine", () => {
	it("returns empty string when no damage info", () => {
		expect(formatDamageLine({})).toBe("");
	});

	it("appends ability modifier to dice-only formula", () => {
		expect(
			formatDamageLine({
				damageRoll: "1d8",
				abilityModifier: 3,
				damageType: "piercing",
			}),
		).toBe("1d8 +3 piercing");
	});

	it("does not double-append when formula is already signed", () => {
		expect(
			formatDamageLine({
				damageRoll: "1d8 + 3",
				abilityModifier: 3,
				damageType: "piercing",
			}),
		).toBe("1d8 + 3 piercing");
	});

	it("omits modifier when zero", () => {
		expect(
			formatDamageLine({
				damageRoll: "2d6",
				abilityModifier: 0,
				damageType: "fire",
			}),
		).toBe("2d6 fire");
	});

	it("returns plain formula when no type provided", () => {
		expect(formatDamageLine({ damageRoll: "3d6" })).toBe("3d6");
	});
});

describe("formatSaveLine", () => {
	it("returns empty string when no save DC", () => {
		expect(formatSaveLine({})).toBe("");
	});

	it("returns DC X when ability missing", () => {
		expect(formatSaveLine({ saveDC: 12 })).toBe("DC 12");
	});

	it("formats DC and ability together", () => {
		expect(formatSaveLine({ saveDC: 14, saveAbility: "SENSE" })).toBe(
			"DC 14 SENSE",
		);
	});
});

describe("formatCompactActionLine", () => {
	it("joins non-empty fragments with middle dot", () => {
		expect(
			formatCompactActionLine({
				attack: { attackBonus: 5, attackRoll: "1d20+5" },
				damage: { damageRoll: "1d8 + 3", damageType: "piercing" },
			}),
		).toBe("Attack +5 (1d20+5) · 1d8 + 3 piercing");
	});

	it("omits empty fragments", () => {
		expect(
			formatCompactActionLine({
				save: { saveDC: 10, saveAbility: "STR" },
			}),
		).toBe("DC 10 STR");
	});

	it("returns empty string when no inputs are present", () => {
		expect(formatCompactActionLine({})).toBe("");
	});
});
