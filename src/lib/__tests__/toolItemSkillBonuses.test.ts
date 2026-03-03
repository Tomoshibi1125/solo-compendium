import { describe, expect, test } from "vitest";
import { applyEquipmentModifiers } from "../equipmentModifiers";

describe("Tool-style item mechanics (skill bonuses)", () => {
	test("Equipped item can grant +2 to Investigation via properties string", () => {
		const res = applyEquipmentModifiers(
			10,
			30,
			{ STR: 10, AGI: 10, VIT: 10, INT: 10, SENSE: 10, PRE: 10 },
			[
				{
					is_equipped: true,
					is_attuned: false,
					requires_attunement: false,
					properties: ["+2 to Investigation"],
				},
			],
		);

		expect(res.skillBonuses["Investigation"]).toBe(2);
	});

	test("Wildcard skill bonus applies via skills[*]", () => {
		const res = applyEquipmentModifiers(
			10,
			30,
			{ STR: 10, AGI: 10, VIT: 10, INT: 10, SENSE: 10, PRE: 10 },
			[
				{
					is_equipped: true,
					is_attuned: false,
					requires_attunement: false,
					properties: ["+1 to all skills"],
				},
			],
		);

		expect(res.skillBonuses["*"]).toBe(1);
	});
});
