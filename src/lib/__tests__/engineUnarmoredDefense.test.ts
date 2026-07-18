/**
 * Engine-path unarmored defense (Jul 18 prod smoke fix).
 *
 * CharacterSheetV2 renders AC from characterEngine.computeCharacterStats →
 * computeArmorClass. That path only knew "armor formula or 10 + AGI", so
 * Revenant / Berserker / Striker sheets displayed 10 + AGI while unarmored
 * even though acFormulas.ts implements their job formulas — the two AC
 * stacks disagreed and the flagship sheet showed the wrong number.
 *
 * These tests pin the engine path to the same job formulas as
 * acFormulas.ts (highest eligible wins, DDB-style).
 */
import { describe, expect, it } from "vitest";
import {
	type CharacterBaseData,
	computeCharacterStats,
	type EquipmentInstance,
} from "../characterEngine";

const makeBaseCharacter = (
	overrides: Partial<CharacterBaseData> = {},
): CharacterBaseData => ({
	id: "character-ud",
	name: "UD Test",
	level: 1,
	jobs: [],
	abilities: {
		STR: 10,
		AGI: 10,
		VIT: 10,
		INT: 10,
		SENSE: 10,
		PRE: 10,
	},
	savingThrowProficiencies: [],
	skillProficiencies: [],
	skillExpertise: [],
	hpCurrent: 10,
	hpMax: 10,
	hpTemp: 0,
	hitDiceCurrent: 1,
	hitDiceMax: 1,
	riftFavorCurrent: 0,
	baseSpeed: 30,
	equippedItems: [],
	tattoos: [],
	activeConditions: [],
	activeSpells: [],
	features: [],
	exhaustionLevel: 0,
	...overrides,
});

const shield: EquipmentInstance = {
	id: "shield-1",
	name: "Shield",
	type: "armor",
	isEquipped: true,
	properties: ["shield"],
};

const lightArmor: EquipmentInstance = {
	id: "armor-1",
	name: "Mana-Weave Vest",
	type: "armor",
	isEquipped: true,
	acFormula: "12 + AGI",
};

describe("engine unarmored defense parity with acFormulas", () => {
	it("Revenant unarmored uses 10 + INT + VIT (Deathbound Flesh)", () => {
		const stats = computeCharacterStats(
			makeBaseCharacter({
				jobs: [{ job: "Revenant", level: 1, hitDie: 8 }],
				abilities: { STR: 14, AGI: 12, VIT: 16, INT: 15, SENSE: 10, PRE: 8 },
			}),
		);
		// 10 + INT(+2) + VIT(+3) = 15, not 10 + AGI(+1) = 11.
		expect(stats.armorClass).toBe(15);
	});

	it("Revenant keeps unarmored defense with a shield (+2)", () => {
		const stats = computeCharacterStats(
			makeBaseCharacter({
				jobs: [{ job: "Revenant", level: 1, hitDie: 8 }],
				abilities: { STR: 14, AGI: 12, VIT: 16, INT: 15, SENSE: 10, PRE: 8 },
				equippedItems: [shield],
			}),
		);
		expect(stats.armorClass).toBe(17);
	});

	it("Berserker unarmored uses 10 + STR + VIT", () => {
		const stats = computeCharacterStats(
			makeBaseCharacter({
				jobs: [{ job: "Berserker", level: 1, hitDie: 12 }],
				abilities: { STR: 16, AGI: 12, VIT: 14, INT: 10, SENSE: 10, PRE: 8 },
			}),
		);
		expect(stats.armorClass).toBe(15);
	});

	it("Striker unarmored uses 10 + AGI + SENSE but loses it with a shield", () => {
		const base = makeBaseCharacter({
			jobs: [{ job: "Striker", level: 1, hitDie: 8 }],
			abilities: { STR: 10, AGI: 14, VIT: 12, INT: 10, SENSE: 16, PRE: 8 },
		});
		expect(computeCharacterStats(base).armorClass).toBe(15);
		// Shield disqualifies Striker UD → falls back to 10 + AGI + shield 2.
		expect(
			computeCharacterStats({ ...base, equippedItems: [shield] }).armorClass,
		).toBe(14);
	});

	it("worn armor disables unarmored defense (armored formula wins path)", () => {
		const stats = computeCharacterStats(
			makeBaseCharacter({
				jobs: [{ job: "Revenant", level: 1, hitDie: 8 }],
				abilities: { STR: 14, AGI: 12, VIT: 16, INT: 15, SENSE: 10, PRE: 8 },
				equippedItems: [lightArmor],
			}),
		);
		// 12 + AGI(+1) = 13; Deathbound Flesh requires no armor.
		expect(stats.armorClass).toBe(13);
	});

	it("non-UD jobs keep the plain 10 + AGI baseline", () => {
		const stats = computeCharacterStats(
			makeBaseCharacter({
				jobs: [{ job: "Mage", level: 1, hitDie: 6 }],
				abilities: { STR: 10, AGI: 14, VIT: 10, INT: 16, SENSE: 10, PRE: 8 },
			}),
		);
		expect(stats.armorClass).toBe(12);
	});
});
