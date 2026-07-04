/**
 * F10 guard — combatant condition normalization on hydration.
 *
 * The initiative roster render reads `combatant.advancedConditions` unguarded
 * (`.length`, `.map`). Combatants written by the Encounter Builder handoff or
 * by saves predating the advanced-conditions refactor may omit that field, so
 * hydration must backfill it or the whole tracker crashes. These tests fail RED
 * if the backfill is dropped.
 */
import { describe, expect, it } from "vitest";
import {
	type ConditionEntry,
	normalizeCombatConditions,
} from "@/lib/conditionSystem";

describe("normalizeCombatConditions", () => {
	it("backfills advancedConditions from legacy string conditions (the F10 crash path)", () => {
		const result = normalizeCombatConditions({
			conditions: ["Poisoned", "Prone"],
			// advancedConditions intentionally absent — the handoff omits it.
		});

		// The crash guard: the roster reads .length / .map, so this must be a
		// real array, never undefined.
		expect(Array.isArray(result.advancedConditions)).toBe(true);
		expect(result.advancedConditions).toHaveLength(2);
		expect(result.advancedConditions.map((c) => c.conditionName)).toEqual([
			"poisoned",
			"prone",
		]);
		expect(result.advancedConditions.every((c) => c.isActive)).toBe(true);
		expect(result.conditions).toEqual(["Poisoned", "Prone"]);
	});

	it("preserves existing advancedConditions untouched", () => {
		const existing: ConditionEntry[] = [
			{
				id: "cond-1",
				conditionName: "stunned",
				sourceType: "spell",
				sourceId: "spell-1",
				sourceName: "Hold Person",
				appliedAt: new Date().toISOString(),
				durationRounds: 3,
				remainingRounds: 2,
				concentrationSpellId: "spell-1",
				isActive: true,
			},
		];

		const result = normalizeCombatConditions({
			conditions: ["Stunned"],
			advancedConditions: existing,
		});

		expect(result.advancedConditions).toEqual(existing);
	});

	it("defends both fields against non-array junk", () => {
		const result = normalizeCombatConditions({
			conditions: "not-an-array" as unknown,
			advancedConditions: 42 as unknown,
		});

		expect(result.conditions).toEqual([]);
		expect(result.advancedConditions).toEqual([]);
	});

	it("yields empty arrays for an empty combatant", () => {
		const result = normalizeCombatConditions({});
		expect(result.conditions).toEqual([]);
		expect(result.advancedConditions).toEqual([]);
	});
});
