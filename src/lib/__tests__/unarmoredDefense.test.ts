import { describe, expect, test } from "vitest";
import { getUnarmoredDefenseBaseAC } from "../unarmoredDefense";

describe("Unarmored Defense", () => {
	test("Striker uses 10 + AGI mod + SENSE mod", () => {
		const ac = getUnarmoredDefenseBaseAC("Striker", {
			AGI: 16, // +3
			SENSE: 14, // +2
		});
		expect(ac).toBe(15);
	});

	test("Berserker uses 10 + STR mod + VIT mod (ignores AGI)", () => {
		const ac = getUnarmoredDefenseBaseAC("Berserker", {
			STR: 16, // +3
			AGI: 18, // +4 — must be ignored; only Striker keys off AGI
			VIT: 18, // +4
		});
		expect(ac).toBe(17);
	});

	test("Revenant uses 10 + INT mod + VIT mod (ignores AGI)", () => {
		const ac = getUnarmoredDefenseBaseAC("Revenant", {
			AGI: 18, // +4 — must be ignored for the Unarmored Requiem
			INT: 16, // +3
			VIT: 14, // +2
		});
		expect(ac).toBe(15);
	});

	test("Other jobs return null", () => {
		const ac = getUnarmoredDefenseBaseAC("Mage", {
			AGI: 18,
			SENSE: 18,
			VIT: 18,
		});
		expect(ac).toBeNull();
	});
});
