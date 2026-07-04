/**
 * Runtime cross-path drift guards (Track B of the July 2026 formula audit).
 *
 * Two real bugs found by driving the running app:
 *
 * 1. `useCombatActions` fed `useCharacterDerivedStats` only the raw
 *    sheet-state custom modifiers, dropping feature/guild/active-spell
 *    modifiers — so an origin's +2 PRE reached the sheet's stats panel but
 *    not the spell action cards (spell attack/DC/damage all read one low).
 *    `mergeCustomModifierSources` is now the single composition both paths
 *    share; these tests pin the composition.
 *
 * 2. Weapon proficiency name-matching compared the plural authored lists
 *    ("Rapiers") against singular equipment names ("Rapier") and never
 *    matched, silently dropping the proficiency bonus from attack rolls.
 */
import { describe, expect, it } from "vitest";
import type {
	CharacterFeature,
	FeatureModifier,
} from "@/hooks/useCharacterFeatures";
import { mergeCustomModifierSources } from "@/hooks/useMergedCustomModifiers";
import { sumCustomModifiers } from "@/lib/customModifiers";
import { isWeaponProficient } from "@/lib/weaponProficiency";

function buildFeature(
	partial: Partial<CharacterFeature> & {
		id: string;
		name: string;
	},
): CharacterFeature {
	return {
		id: partial.id,
		character_id: partial.character_id ?? "c1",
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

describe("mergeCustomModifierSources (sheet + features + guild + spells)", () => {
	const originBonus: FeatureModifier[] = [
		{ type: "ability_bonus", target: "PRE", value: 2, source: "Origin" },
	];

	it("carries a feature-granted ability bonus into the merged list", () => {
		const merged = mergeCustomModifierSources({
			sheetCustomModifiers: [],
			charFeatures: [
				buildFeature({
					id: "f1",
					name: "Origin Bonus",
					modifiers: originBonus,
				}),
			],
			syntheticFeatures: [],
			activeSpells: [],
			level: 1,
		});
		expect(sumCustomModifiers(merged, "ability_bonus", "PRE")).toBe(2);
	});

	it("guards the exact drift: sheet-state modifiers alone do NOT contain feature bonuses", () => {
		// The pre-fix action pipeline passed only the sheet list; if that list
		// ever becomes equivalent to the merged list this guard is obsolete,
		// not wrong — but while sources are separate, merging must add entries.
		const merged = mergeCustomModifierSources({
			sheetCustomModifiers: [],
			charFeatures: [
				buildFeature({
					id: "f1",
					name: "Origin Bonus",
					modifiers: originBonus,
				}),
			],
			syntheticFeatures: [],
			activeSpells: [],
			level: 1,
		});
		expect(merged.length).toBeGreaterThan(0);
		expect(sumCustomModifiers([], "ability_bonus", "PRE")).toBe(0);
	});

	it("keeps sheet-entered modifiers and inactive features behave as before", () => {
		const merged = mergeCustomModifierSources({
			sheetCustomModifiers: [
				{
					id: "s1",
					type: "skill",
					target: "Stealth",
					value: 1,
					source: "Sheet",
					enabled: true,
				},
			],
			charFeatures: [
				buildFeature({
					id: "f2",
					name: "Dormant",
					is_active: false,
					modifiers: originBonus,
				}),
			],
			syntheticFeatures: [],
			activeSpells: [],
			level: 5,
		});
		expect(sumCustomModifiers(merged, "skill", "Stealth")).toBe(1);
		// Inactive feature contributes nothing.
		expect(sumCustomModifiers(merged, "ability_bonus", "PRE")).toBe(0);
	});

	it("routes guild synthetic features through the structured-effects converter", () => {
		// Real guild synthetic features carry structured `effects` (see
		// useCharacterGuildBenefits), not flat `modifiers`.
		const warRoom = {
			...buildFeature({ id: "guild-war-room", name: "Guild Benefits" }),
			effects: [{ kind: "initiative_bonus", value: 1 }],
		} as CharacterFeature;
		const merged = mergeCustomModifierSources({
			sheetCustomModifiers: [],
			charFeatures: [],
			syntheticFeatures: [warRoom],
			activeSpells: [],
			level: 3,
		});
		expect(sumCustomModifiers(merged, "initiative_bonus")).toBe(1);
	});
});

describe("isWeaponProficient (plural-tolerant name + category match)", () => {
	// Bard-analog (Idol) list, authored plural as in jobs.ts.
	const idolProfs = [
		"Simple weapons",
		"Hand crossbows",
		"Longswords",
		"Rapiers",
		"Shortswords",
	];

	it("matches plural proficiency entries against singular item names", () => {
		expect(isWeaponProficient(idolProfs, { name: "Rapier" })).toBe(true);
		expect(isWeaponProficient(idolProfs, { name: "Longsword" })).toBe(true);
		expect(isWeaponProficient(idolProfs, { name: "Hand Crossbow" })).toBe(true);
	});

	it("matches weapon categories via properties", () => {
		expect(
			isWeaponProficient(idolProfs, {
				name: "Dagger",
				properties: ["Simple", "Finesse"],
			}),
		).toBe(true);
		expect(
			isWeaponProficient(["Simple weapons", "Martial weapons"], {
				name: "Greatsword",
				properties: ["Martial", "Heavy"],
			}),
		).toBe(true);
	});

	it("rejects weapons outside both name and category proficiency", () => {
		expect(
			isWeaponProficient(idolProfs, {
				name: "Greatsword",
				properties: ["Martial", "Heavy"],
			}),
		).toBe(false);
		expect(isWeaponProficient([], { name: "Rapier" })).toBe(false);
		expect(isWeaponProficient(null, { name: "Rapier" })).toBe(false);
	});
});
