/**
 * Condition/exhaustion → d20 advantage automation (Jul 18 deep audit).
 *
 * The engine has always derived advantage from active conditions and
 * exhaustion (conditionEffects → rollAdvantage), but the character sheet's
 * ability/save/skill/initiative buttons passed ONLY the manual ADV/DIS
 * toggle. A Poisoned or exhausted character rolled straight unless the
 * player noticed and flipped the switch — DDB applies it automatically.
 *
 * These tests pin the rule semantics the sheet now consumes, plus the
 * structural wiring (the sheet must not go back to passing the raw toggle).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	combineAdvantageStates,
	resolveAdvantageForRoll,
} from "@/lib/rollAdvantage";

const ROOT = resolve(__dirname, "../../..");
const src = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

const advantageFor = (
	conditions: string[],
	exhaustionLevel: number,
	rollType: Parameters<typeof resolveAdvantageForRoll>[0]["rollType"],
) =>
	resolveAdvantageForRoll({
		conditions,
		exhaustionLevel,
		rollType,
		customModifiers: [],
	});

describe("condition-driven advantage (the rules the sheet now applies)", () => {
	it("Poisoned imposes disadvantage on attacks and ability checks", () => {
		expect(advantageFor(["poisoned"], 0, "attack_rolls")).toBe("disadvantage");
		expect(advantageFor(["poisoned"], 0, "ability_checks")).toBe(
			"disadvantage",
		);
	});

	it("exhaustion 1 imposes disadvantage on ability checks", () => {
		expect(advantageFor([], 1, "ability_checks")).toBe("disadvantage");
		// …and level 3 extends it to attacks and saves.
		expect(advantageFor([], 3, "attack_rolls")).toBe("disadvantage");
		expect(advantageFor([], 3, "saving_throws")).toBe("disadvantage");
	});

	it("a clean character rolls straight", () => {
		expect(advantageFor([], 0, "ability_checks")).toBe("normal");
		expect(advantageFor([], 0, "saving_throws")).toBe("normal");
	});

	it("condition names are matched case-insensitively", () => {
		expect(advantageFor(["Poisoned"], 0, "attack_rolls")).toBe("disadvantage");
	});

	it("advantage and disadvantage cancel to normal (5e RAW)", () => {
		expect(combineAdvantageStates(["advantage", "disadvantage"])).toBe(
			"normal",
		);
		expect(combineAdvantageStates(["disadvantage", "disadvantage"])).toBe(
			"disadvantage",
		);
		// The manual toggle layers on top rather than replacing the rules: a
		// player asking for advantage while Poisoned nets out to normal.
		expect(
			combineAdvantageStates([
				advantageFor(["poisoned"], 0, "ability_checks"),
				"advantage",
			]),
		).toBe("normal");
	});
});

describe("structural wiring — the sheet consumes the resolver", () => {
	it("the page model exposes a condition-aware d20 resolver", () => {
		const s = src("src/hooks/useCharacterPageModel.ts");
		expect(s.includes("resolveD20Advantage")).toBe(true);
		expect(s.includes("resolveAdvantageForRoll")).toBe(true);
	});

	it("sheet d20 rolls no longer pass the bare UI toggle as advantage", () => {
		const s = src("src/components/character-v2/CharacterSheetV2.tsx");
		// Each d20 roll must route through the resolver.
		const resolverUses = s.match(/resolveD20Advantage\(/g) ?? [];
		expect(resolverUses.length).toBeGreaterThanOrEqual(4);
		// The old shape — `advantage: rollMode` — must be gone.
		expect(/advantage:\s*rollMode\b/.test(s)).toBe(false);
	});
});
