import { describe, expect, test } from "vitest";
import {
	ABILITY_DISPLAY_NAMES,
	DC_LADDER,
	getAbilityDisplayName,
	getAbilityModifier,
	getProficiencyBonus,
	getSystemFavorDie,
	getSystemFavorMax,
	normalizeAbility,
	RARITY_LABELS,
} from "../5eRulesEngine";

describe("5e Rules Engine", () => {
	test("Ability modifier calculation", () => {
		expect(getAbilityModifier(10)).toBe(0);
		expect(getAbilityModifier(11)).toBe(0);
		expect(getAbilityModifier(12)).toBe(1);
		expect(getAbilityModifier(14)).toBe(2);
		expect(getAbilityModifier(20)).toBe(5);
		expect(getAbilityModifier(1)).toBe(-5);
	});

	test("Proficiency bonus calculation (5e standard)", () => {
		expect(getProficiencyBonus(1)).toBe(2);
		expect(getProficiencyBonus(2)).toBe(2);
		expect(getProficiencyBonus(3)).toBe(2);
		expect(getProficiencyBonus(4)).toBe(2);
		expect(getProficiencyBonus(5)).toBe(3);
		expect(getProficiencyBonus(8)).toBe(3);
		expect(getProficiencyBonus(9)).toBe(4);
		expect(getProficiencyBonus(13)).toBe(5);
		expect(getProficiencyBonus(17)).toBe(6);
		expect(getProficiencyBonus(20)).toBe(6);
	});

	test("System Favor calculations", () => {
		expect(getSystemFavorMax(1)).toBe(3);
		expect(getSystemFavorMax(4)).toBe(3);
		expect(getSystemFavorMax(5)).toBe(4);
		expect(getSystemFavorMax(10)).toBe(4);
		expect(getSystemFavorMax(11)).toBe(5);
		expect(getSystemFavorMax(16)).toBe(5);
		expect(getSystemFavorMax(17)).toBe(6);
		expect(getSystemFavorMax(20)).toBe(6);

		expect(getSystemFavorDie(1)).toBe(4);
		expect(getSystemFavorDie(4)).toBe(4);
		expect(getSystemFavorDie(5)).toBe(6);
		expect(getSystemFavorDie(10)).toBe(6);
		expect(getSystemFavorDie(11)).toBe(8);
		expect(getSystemFavorDie(16)).toBe(8);
		expect(getSystemFavorDie(17)).toBe(10);
		expect(getSystemFavorDie(20)).toBe(10);
	});

	test("Ability normalization", () => {
		expect(normalizeAbility("STR")).toBe("STR");
		expect(normalizeAbility("AGI")).toBe("AGI");
		expect(normalizeAbility("VIT")).toBe("VIT");
		expect(normalizeAbility("INT")).toBe("INT");
		expect(normalizeAbility("SENSE")).toBe("SENSE");
		expect(normalizeAbility("PRE")).toBe("PRE");

		// Test legacy 5e normalization
		expect(normalizeAbility("DEX")).toBe("AGI");
		expect(normalizeAbility("CON")).toBe("VIT");
		expect(normalizeAbility("WIS")).toBe("SENSE");
		expect(normalizeAbility("CHA")).toBe("PRE");

		// Test case insensitivity
		expect(normalizeAbility("str")).toBe("STR");
		expect(normalizeAbility("agi")).toBe("AGI");
	});

	test("System Ascendant ability display names", () => {
		expect(getAbilityDisplayName("STR")).toBe("Strength");
		expect(getAbilityDisplayName("AGI")).toBe("Agility");
		expect(getAbilityDisplayName("VIT")).toBe("Vitality");
		expect(getAbilityDisplayName("INT")).toBe("Intelligence");
		expect(getAbilityDisplayName("SENSE")).toBe("Sense");
		expect(getAbilityDisplayName("PRE")).toBe("Presence");
	});

	test("DC ladder structure", () => {
		expect(DC_LADDER).toHaveLength(6);
		expect(DC_LADDER[0].dc).toBe(5);
		expect(DC_LADDER[0].difficulty).toBe("Very Easy");
		expect(DC_LADDER[5].dc).toBe(30);
		expect(DC_LADDER[5].difficulty).toBe("Nearly Impossible");
	});

	test("Rarity labels", () => {
		expect(RARITY_LABELS.common).toBe("Common");
		expect(RARITY_LABELS.uncommon).toBe("Uncommon");
		expect(RARITY_LABELS.rare).toBe("Rare");
		expect(RARITY_LABELS["very-rare"]).toBe("Very Rare");
		expect(RARITY_LABELS.legendary).toBe("Legendary");
	});

	test("Ability display names completeness", () => {
		const abilities = ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"] as const;
		const expectedNames = [
			"Strength",
			"Agility",
			"Vitality",
			"Intelligence",
			"Sense",
			"Presence",
		];

		abilities.forEach((ability, index) => {
			expect(ABILITY_DISPLAY_NAMES[ability]).toBeDefined();
			expect(ABILITY_DISPLAY_NAMES[ability]).toBe(expectedNames[index]);
		});
	});
});
