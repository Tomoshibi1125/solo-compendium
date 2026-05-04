import { describe, expect, it } from "vitest";
import {
	type CharacterBaseData,
	computeCharacterStats,
	type Effect,
} from "../characterEngine";

const tattooEffects: Effect[] = [
	{ type: "modifier", target: "speed", value: 10, priority: 140 },
	{ type: "modifier", target: "tattoo_attunement", value: 1, priority: 140 },
];

const makeBaseCharacter = (
	overrides: Partial<CharacterBaseData> = {},
): CharacterBaseData => ({
	id: "character-1",
	name: "Test Character",
	level: 4,
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
	hpCurrent: 24,
	hpMax: 24,
	hpTemp: 0,
	hitDiceCurrent: 4,
	hitDiceMax: 4,
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

describe("character engine tattoo runtime", () => {
	it("applies active attuned tattoo effects and tattoo attunement counts", () => {
		const stats = computeCharacterStats(
			makeBaseCharacter({
				tattoos: [
					{
						id: "tattoo-1",
						name: "Resonance Vein",
						isActive: true,
						bodyPart: "arm",
						requiresAttunement: true,
						isAttuned: true,
						effects: tattooEffects,
					},
					{
						id: "tattoo-2",
						name: "Dormant Vein",
						isActive: false,
						bodyPart: "back",
						requiresAttunement: false,
						isAttuned: false,
						effects: [
							{ type: "modifier", target: "speed", value: 30, priority: 140 },
						],
					},
				],
			}),
		);

		expect(stats.speed).toBe(40);
		expect(stats.tattooAttunement).toEqual({ current: 1, max: 2 });
		expect(stats.activeEffects).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ target: "speed", value: 10, priority: 140 }),
			]),
		);
		expect(stats.activeEffects).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({ target: "speed", value: 30 }),
			]),
		);
	});
});
