import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

	it("translates the Defense acBonusInArmor payload, skips other object shapes", () => {
		// Fighting styles and rune grants store `modifiers` as object payloads.
		// Rune promotion state must still be skipped without throwing, but the
		// one stat-bearing fighting-style key (Defense's acBonusInArmor) is
		// translated into an armor-conditional custom modifier.
		const features: CharacterFeature[] = [
			buildFeature({
				id: "f-style",
				character_id: "c1",
				name: "Fighting Style: Defense",
				is_active: true,
				modifiers: {
					acBonusInArmor: 1,
				} as unknown as CharacterFeature["modifiers"],
			}),
			buildFeature({
				id: "f-rune",
				character_id: "c1",
				name: "Rune: Borrowed Thunder",
				is_active: true,
				modifiers: {
					runeGrant: { abilityId: "thunder-step", promoted: true },
				} as unknown as CharacterFeature["modifiers"],
			}),
			buildFeature({
				id: "f-array",
				character_id: "c1",
				name: "Tough",
				is_active: true,
				modifiers: [{ type: "hp-max", value: 5, source: "Tough" }],
			}),
		];

		const custom = featureModifiersToCustomModifiers(features);
		expect(custom).toHaveLength(2);
		expect(sumCustomModifiers(custom, "hp-max")).toBe(5);
		expect(sumCustomModifiers(custom, "ac_bonus_in_armor")).toBe(1);
		const defense = custom.find((m) => m.type === "ac_bonus_in_armor");
		expect(defense?.source).toBe("Fighting Style: Defense");
		expect(defense?.condition).toBe("while wearing armor");
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

describe("Defense AC structural guard", () => {
	// The derived-stats hook has no render harness, so guard the consumption
	// wiring the same way uiTruthParity guards D1/D2: read the source and
	// assert ac_bonus_in_armor is summed behind the armorItem gate.
	it("useCharacterDerivedStats sums ac_bonus_in_armor only while armor is equipped", () => {
		const s = readFileSync(
			resolve(__dirname, "../../hooks/useCharacterDerivedStats.ts"),
			"utf8",
		);
		const sumCall = 'sumCustomModifiers(customModifiers, "ac_bonus_in_armor")';
		const idx = s.indexOf(sumCall);
		expect(idx).toBeGreaterThan(-1);
		const gate = s.slice(Math.max(0, idx - 120), idx);
		expect(gate.includes("armorItem")).toBe(true);
	});

	// The sigil AC delta must be measured against the value applySigilBonuses
	// was seeded with (equipmentMods.armorClass); measuring against the
	// unarmored baseStats.armorClass leaks the armor's own AC into the misc
	// bonus (chain mail 16 vs base 11 → phantom +5 on the sheet).
	it("sigilACDelta baselines against equipmentMods.armorClass, not baseStats", () => {
		const s = readFileSync(
			resolve(__dirname, "../../hooks/useCharacterDerivedStats.ts"),
			"utf8",
		);
		// Whitespace-collapsed so formatter line wrapping can't break the guard.
		const flat = s.replace(/\s+/g, "");
		expect(
			flat.includes("Math.max(0,sigilBonuses.ac-equipmentMods.armorClass"),
		).toBe(true);
		expect(flat.includes("sigilBonuses.ac-baseStats.armorClass")).toBe(false);
	});
});
