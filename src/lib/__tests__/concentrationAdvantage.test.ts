/**
 * Regression tests for the concentration-save advantage / disadvantage
 * resolution path (DDB parity #5).
 *
 * `useCharacterPageModel` resolves the concentration save mode from
 * `customModifiers` via `resolveAdvantageFromCustomModifiers` against
 * the targets `["concentration_save", "concentration", "save:vit", "vit_save"]`,
 * then passes the result into `useConcentration.takeDamage(mode)`. These
 * tests lock in the resolution behavior so the wiring stays correct.
 */
import { describe, expect, it } from "vitest";
import {
	type CustomModifier,
	resolveAdvantageFromCustomModifiers,
} from "@/lib/customModifiers";

const CONCENTRATION_TARGETS = [
	"concentration_save",
	"concentration",
	"save:vit",
	"vit_save",
];

const adv = (target: string, source: string): CustomModifier => ({
	id: `adv:${source}:${target}`,
	type: "advantage",
	target,
	value: 0,
	source,
	condition: null,
	enabled: true,
});

const dis = (target: string, source: string): CustomModifier => ({
	id: `dis:${source}:${target}`,
	type: "disadvantage",
	target,
	value: 0,
	source,
	condition: null,
	enabled: true,
});

describe("concentration save advantage resolution", () => {
	it("returns 'normal' with no modifiers", () => {
		expect(resolveAdvantageFromCustomModifiers([], CONCENTRATION_TARGETS)).toBe(
			"normal",
		);
	});

	it("War Caster grants advantage on concentration saves", () => {
		// War Caster typically targets "concentration_save".
		const mods = [adv("concentration_save", "Feat: War Caster")];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("advantage");
	});

	it("Resilient (CON) grants advantage via the 'vit_save' target", () => {
		// RA's VIT save proxies the 5e CON save.
		const mods = [adv("vit_save", "Feat: Resilient (VIT)")];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("advantage");
	});

	it("Bear Totem-style 'save:vit' modifier also resolves to advantage", () => {
		const mods = [adv("save:vit", "Bear Totem Aspect")];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("advantage");
	});

	it("returns 'disadvantage' when an enemy buff targets concentration", () => {
		const mods = [dis("concentration", "Aura of Distraction")];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("disadvantage");
	});

	it("cancels to 'normal' when both advantage and disadvantage are present", () => {
		const mods = [
			adv("concentration_save", "War Caster"),
			dis("vit_save", "Poisoned"),
		];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("normal");
	});

	it("ignores disabled modifiers", () => {
		const mods = [
			{ ...adv("concentration_save", "Disabled Feat"), enabled: false },
		];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("normal");
	});

	it("ignores modifiers targeting unrelated saves (e.g. 'str_save')", () => {
		const mods = [adv("str_save", "Some unrelated effect")];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("normal");
	});

	it("'all' / null target counts as a global advantage that hits concentration too", () => {
		const mods = [adv("all", "Heroic Inspiration")];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("advantage");
	});

	it("trims whitespace and matches case-insensitively on targets", () => {
		const mods = [adv("  Concentration_Save  ", "War Caster")];
		expect(
			resolveAdvantageFromCustomModifiers(mods, CONCENTRATION_TARGETS),
		).toBe("advantage");
	});
});
