import { describe, expect, it } from "vitest";
import type {
	CharacterFeature,
	FeatureModifier,
} from "@/hooks/useCharacterFeatures";
import { featureModifiersToCustomModifiers } from "@/hooks/useCharacterFeatures";
import { sumCustomModifiers } from "@/lib/customModifiers";
import { resolveAdvantageForRoll } from "@/lib/rollAdvantage";

function buildFeature(
	partial: Partial<CharacterFeature> & {
		id: string;
		character_id: string;
		name: string;
	},
): CharacterFeature {
	return {
		id: partial.id,
		character_id: partial.character_id,
		name: partial.name,
		source: partial.source ?? "Test",
		level_acquired: partial.level_acquired ?? 1,
		description: partial.description ?? null,
		uses_current: partial.uses_current ?? null,
		uses_max: partial.uses_max ?? null,
		recharge: partial.recharge ?? null,
		action_type: partial.action_type ?? null,
		is_active: partial.is_active ?? true,
		modifiers: partial.modifiers ?? null,
		homebrew_id: partial.homebrew_id ?? null,
		created_at: partial.created_at ?? new Date().toISOString(),
	};
}

describe("awakening + feat modifier wiring", () => {
	it("applies hp-max modifiers from active features", () => {
		const modifiers: FeatureModifier[] = [
			{ type: "hp-max", value: 5, source: "Tough" },
		];

		const features: CharacterFeature[] = [
			buildFeature({
				id: "f1",
				character_id: "c1",
				name: "Tough",
				is_active: true,
				modifiers,
			}),
		];

		const custom = featureModifiersToCustomModifiers(features);
		expect(sumCustomModifiers(custom, "hp-max")).toBe(5);
	});

	it("applies advantage modifiers to the global roll resolver", () => {
		const modifiers: FeatureModifier[] = [
			{
				type: "advantage",
				value: 0,
				target: "initiative",
				source: "Predator Instinct",
			},
		];

		const features: CharacterFeature[] = [
			buildFeature({
				id: "f2",
				character_id: "c1",
				name: "Predator Instinct",
				is_active: true,
				modifiers,
			}),
		];

		const custom = featureModifiersToCustomModifiers(features);

		const state = resolveAdvantageForRoll({
			conditions: [],
			exhaustionLevel: 0,
			rollType: "ability_checks",
			customModifiers: custom,
			customTargets: ["initiative"],
		});

		expect(state).toBe("advantage");
	});
});
