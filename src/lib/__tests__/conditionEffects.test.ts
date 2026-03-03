import { describe, expect, it } from "vitest";
import {
	CONDITION_EFFECTS,
	EXHAUSTION_TABLE,
	getActivePenaltySummary,
	getEffectiveHPMax,
	getEffectiveSpeed,
	isIncapacitated,
	resolveRollModifiers,
} from "@/lib/conditionEffects";

describe("Condition Effects", () => {
	it("frightened imposes disadvantage on attacks and ability checks", () => {
		const mods = resolveRollModifiers(["Frightened"], 0, "attack_rolls");
		expect(mods.advantageState).toBe("disadvantage");

		const checks = resolveRollModifiers(["Frightened"], 0, "ability_checks");
		expect(checks.advantageState).toBe("disadvantage");
	});

	it("poisoned imposes disadvantage on attacks and ability checks", () => {
		const mods = resolveRollModifiers(["Poisoned"], 0, "attack_rolls");
		expect(mods.advantageState).toBe("disadvantage");
	});

	it("invisible grants advantage on attacks", () => {
		const mods = resolveRollModifiers(["Invisible"], 0, "attack_rolls");
		expect(mods.advantageState).toBe("advantage");
	});

	it("advantage + disadvantage cancel to normal", () => {
		const mods = resolveRollModifiers(
			["Invisible", "Poisoned"],
			0,
			"attack_rolls",
		);
		expect(mods.advantageState).toBe("normal");
	});

	it("paralyzed auto-fails STR and AGI saves", () => {
		const strSave = resolveRollModifiers(["Paralyzed"], 0, "STR_saves");
		expect(strSave.autoFail).toBe(true);

		const agiSave = resolveRollModifiers(["Paralyzed"], 0, "AGI_saves");
		expect(agiSave.autoFail).toBe(true);
	});

	it("restrained imposes disadvantage on AGI saves and sets speed to 0", () => {
		const mods = resolveRollModifiers(["Restrained"], 0, "AGI_saves");
		expect(mods.advantageState).toBe("disadvantage");
		expect(mods.speedMultiplier).toBe(0);
	});

	it("grappled sets speed to 0", () => {
		const speed = getEffectiveSpeed(30, ["Grappled"], 0);
		expect(speed).toBe(0);
	});
});

describe("Exhaustion Effects", () => {
	it("exhaustion 0 has no effects", () => {
		const mods = resolveRollModifiers([], 0, "ability_checks");
		expect(mods.advantageState).toBe("normal");
		expect(mods.speedMultiplier).toBe(1);
	});

	it("exhaustion 1 gives disadvantage on ability checks", () => {
		const mods = resolveRollModifiers([], 1, "ability_checks");
		expect(mods.advantageState).toBe("disadvantage");
	});

	it("exhaustion 2 halves speed", () => {
		const speed = getEffectiveSpeed(30, [], 2);
		expect(speed).toBe(15);
	});

	it("exhaustion 3 gives disadvantage on attacks and saves too", () => {
		const attacks = resolveRollModifiers([], 3, "attack_rolls");
		expect(attacks.advantageState).toBe("disadvantage");

		const saves = resolveRollModifiers([], 3, "saving_throws");
		expect(saves.advantageState).toBe("disadvantage");
	});

	it("exhaustion 4 halves HP max", () => {
		expect(getEffectiveHPMax(40, 4)).toBe(20);
		expect(getEffectiveHPMax(40, 3)).toBe(40);
	});

	it("exhaustion 5 sets speed to 0", () => {
		const speed = getEffectiveSpeed(30, [], 5);
		expect(speed).toBe(0);
	});

	it("exhaustion 6 means death", () => {
		const mods = resolveRollModifiers([], 6, "ability_checks");
		expect(mods.isDead).toBe(true);
	});
});

describe("Combined conditions + exhaustion", () => {
	it("frightened + exhaustion 1 both impose disadvantage (still just disadvantage)", () => {
		const mods = resolveRollModifiers(["Frightened"], 1, "ability_checks");
		expect(mods.advantageState).toBe("disadvantage");
	});

	it("invisible advantage cancels frightened disadvantage on attacks", () => {
		const mods = resolveRollModifiers(
			["Invisible", "Frightened"],
			0,
			"attack_rolls",
		);
		expect(mods.advantageState).toBe("normal");
	});
});

describe("Utility functions", () => {
	it("isIncapacitated detects incapacitating conditions", () => {
		expect(isIncapacitated(["Paralyzed"])).toBe(true);
		expect(isIncapacitated(["Stunned"])).toBe(true);
		expect(isIncapacitated(["Unconscious"])).toBe(true);
		expect(isIncapacitated(["Incapacitated"])).toBe(true);
		expect(isIncapacitated(["Frightened"])).toBe(false);
		expect(isIncapacitated([])).toBe(false);
	});

	it("getActivePenaltySummary returns readable summaries", () => {
		const summaries = getActivePenaltySummary(["Frightened", "Poisoned"], 2);
		expect(summaries.length).toBe(3); // 2 conditions + 1 exhaustion
		expect(summaries[0]).toContain("Frightened");
		expect(summaries[1]).toContain("Poisoned");
		expect(summaries[2]).toContain("Exhaustion 2");
	});

	it("CONDITION_EFFECTS has all standard 5e conditions", () => {
		const expected = [
			"blinded",
			"charmed",
			"deafened",
			"frightened",
			"grappled",
			"incapacitated",
			"invisible",
			"paralyzed",
			"petrified",
			"poisoned",
			"prone",
			"restrained",
			"stunned",
			"unconscious",
		];
		for (const condition of expected) {
			expect(CONDITION_EFFECTS[condition]).toBeDefined();
		}
	});

	it("EXHAUSTION_TABLE has levels 0-6", () => {
		expect(EXHAUSTION_TABLE).toHaveLength(7);
		expect(EXHAUSTION_TABLE[0].level).toBe(0);
		expect(EXHAUSTION_TABLE[6].level).toBe(6);
		expect(EXHAUSTION_TABLE[6].description).toContain("Death");
	});
});
