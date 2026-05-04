import { describe, expect, it } from "vitest";
import {
	bridgeEffectBearingEntry,
	bridgeRelicEffects,
	bridgeRuneEffects,
	bridgeSigilEffects,
	bridgeTattooEffects,
	EFFECT_SOURCE_PRIORITIES,
	type UnifiedEffectKind,
} from "../unifiedEffectSystem";

describe("unified effect system", () => {
	it("exposes source priorities for generic bridge callers", () => {
		const kind: UnifiedEffectKind = "sigil";
		expect(EFFECT_SOURCE_PRIORITIES[kind]).toBe(130);
		expect(
			bridgeEffectBearingEntry(
				{ id: "generic-sigil", passive_bonuses: { ac_bonus: 1 } },
				kind,
			),
		).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ target: "ac", value: 1, priority: 130 }),
			]),
		);
	});

	it("normalizes relic mechanics and properties into canonical effects", () => {
		const effects = bridgeRelicEffects({
			id: "relic-1",
			name: "Test Relic",
			properties: ["+1 to attack", "+2 AC"],
			mechanics: {
				stat_bonuses: { Presence: 1 },
				resistance: ["necrotic"],
			},
		});

		expect(effects).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					target: "attack_bonus",
					value: 1,
					priority: 110,
				}),
				expect.objectContaining({ target: "ac", value: 2, priority: 110 }),
				expect.objectContaining({ target: "pre", value: 1, priority: 110 }),
				expect.objectContaining({
					target: "damage_resistance",
					value: ["necrotic"],
					priority: 110,
				}),
			]),
		);
	});

	it("normalizes active sigil passive bonuses", () => {
		const effects = bridgeSigilEffects({
			id: "sigil-1",
			name: "Test Sigil",
			passive_bonuses: {
				ac_bonus: 1,
				speed_bonus: 5,
				ability_scores: { STR: 2 },
			},
		});

		expect(effects).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ target: "ac", value: 1, priority: 130 }),
				expect.objectContaining({ target: "speed", value: 5, priority: 130 }),
				expect.objectContaining({ target: "str", value: 2, priority: 130 }),
			]),
		);
	});

	it("normalizes tattoo effects without treating conditional resonance as flat AC", () => {
		const effects = bridgeTattooEffects({
			id: "tattoo-1",
			name: "Test Tattoo",
			effects: {
				primary: "Your movement speed increases by 10 feet.",
				tertiary:
					"Resonance: When multiple tattoos are active, gain +1 AC per active tattoo.",
				passiveBonuses: [{ stat: "tattoo attunement", value: 1 }],
			},
		});

		expect(effects).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ target: "speed", value: 10, priority: 140 }),
				expect.objectContaining({
					target: "tattoo_attunement",
					value: 1,
					priority: 140,
				}),
			]),
		);
		expect(effects).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({ target: "ac", value: 1 }),
			]),
		);
	});

	it("normalizes absorbed rune-style effect descriptions", () => {
		const effects = bridgeRuneEffects({
			id: "rune-1",
			name: "Rune of Guarding",
			effect_description:
				"You gain resistance to fire damage and +1 to saving throws.",
		});

		expect(effects).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					target: "damage_resistance",
					value: ["fire"],
					priority: 120,
				}),
				expect.objectContaining({
					target: "saving_throw",
					value: 1,
					priority: 120,
				}),
			]),
		);
	});
});
