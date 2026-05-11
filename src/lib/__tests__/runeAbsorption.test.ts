import { describe, expect, it } from "vitest";
import {
	type CanonicalCastableEntry,
	listCanonicalPowers,
} from "@/lib/canonicalCompendium";
import {
	getRunePrimaryStatModifier,
	getRuneRarityBonus,
	inferRuneAbilityKind,
	type RuneGrantAccessContext,
	resolveRuneAbsorption,
	resolveRuneGrant,
} from "@/lib/runeAutomation";

const STR16 = 16; // +3
const AGI16 = 16; // +3
const INT16 = 16; // +3

async function getHighLevelDestroyerPower(): Promise<CanonicalCastableEntry> {
	const power = (await listCanonicalPowers()).find((entry) => {
		const classes = (entry as { classes?: unknown }).classes;
		return (
			entry.power_level > 3 &&
			Array.isArray(classes) &&
			classes.includes("Destroyer")
		);
	});
	if (!power) throw new Error("Expected a high-level Destroyer power.");
	return power;
}

describe("resolveRuneAbsorption — locked formula", () => {
	it("striker_absorbs_spell_rune_no_regent → cross-class with stat term", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "spell",
			characterJob: "Striker",
			characterLevel: 5,
			proficiencyBonus: 3,
			primaryStatModifier: 3,
			runeRarity: "uncommon",
			unlockedRegents: [],
		});
		expect(result.isCrossClassAdaptation).toBe(true);
		expect(result.isNativeViaJob).toBe(false);
		expect(result.isNativeViaRegent).toBe(false);
		// max(1, 3 + 3 + 0) = 6
		expect(result.usesMax).toBe(6);
		expect(result.recharge).toBe("long-rest");
		expect(result.descriptionPrefix).toContain("Cross-Class Adaptation");
	});

	it("striker_with_umbral_regent_absorbs_spell_rune → native via Regent", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "spell",
			characterJob: "Striker",
			characterLevel: 5,
			proficiencyBonus: 3,
			primaryStatModifier: 3,
			runeRarity: "uncommon",
			unlockedRegents: ["umbral_regent"],
			usesPerRest: "1",
			nativeRecharge: "long rest",
		});
		expect(result.isCrossClassAdaptation).toBe(false);
		expect(result.isNativeViaRegent).toBe(true);
		expect(result.isNativeViaJob).toBe(false);
		expect(result.recharge).toBe("long-rest");
	});

	it("mage_absorbs_technique_rune_no_regent → cross-class", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "technique",
			characterJob: "Mage",
			characterLevel: 7,
			proficiencyBonus: 3,
			primaryStatModifier: 4,
			runeRarity: "rare",
			unlockedRegents: [],
		});
		expect(result.isCrossClassAdaptation).toBe(true);
		// max(1, 3 + 4 + 1) = 8
		expect(result.usesMax).toBe(8);
	});

	it("mage_with_war_regent_absorbs_technique_rune → native via Regent, recharge follows Regent frequency", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "technique",
			characterJob: "Mage",
			characterLevel: 7,
			proficiencyBonus: 3,
			primaryStatModifier: 4,
			runeRarity: "rare",
			unlockedRegents: ["war_regent"],
			usesPerRest: "1",
			nativeRecharge: "long rest",
			regentFrequency: "short-rest",
		});
		expect(result.isCrossClassAdaptation).toBe(false);
		expect(result.isNativeViaRegent).toBe(true);
		expect(result.recharge).toBe("short-rest");
	});

	it("mage_absorbs_spell_rune → native via Job", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "spell",
			characterJob: "Mage",
			characterLevel: 5,
			proficiencyBonus: 3,
			primaryStatModifier: 4,
			runeRarity: "uncommon",
			unlockedRegents: [],
			usesPerRest: "1",
			nativeRecharge: "long rest",
		});
		expect(result.isCrossClassAdaptation).toBe(false);
		expect(result.isNativeViaJob).toBe(true);
		expect(result.recharge).toBe("long-rest");
	});

	it("berserker_absorbs_technique_rune → native via Job", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "technique",
			characterJob: "Berserker",
			characterLevel: 5,
			proficiencyBonus: 3,
			primaryStatModifier: 3,
			runeRarity: "uncommon",
			unlockedRegents: [],
			usesPerRest: "1",
			nativeRecharge: "long rest",
		});
		expect(result.isCrossClassAdaptation).toBe(false);
		expect(result.isNativeViaJob).toBe(true);
	});

	it("legendary_rune_cross_class → +3 rarity bonus applied", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "spell",
			characterJob: "Striker",
			characterLevel: 5,
			proficiencyBonus: 3,
			primaryStatModifier: 2,
			runeRarity: "legendary",
			unlockedRegents: [],
		});
		// max(1, 3 + 2 + 3) = 8
		expect(result.usesMax).toBe(8);
	});

	it("min_one_use_clamp → result floor of 1", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "spell",
			characterJob: "Striker",
			characterLevel: 1,
			proficiencyBonus: 0,
			primaryStatModifier: -3,
			runeRarity: "common",
			unlockedRegents: [],
		});
		expect(result.usesMax).toBe(1);
	});

	it("stalker_treated_as_half_caster → spell rune absorption is native (not cross-class)", () => {
		const result = resolveRuneAbsorption({
			abilityKind: "spell",
			characterJob: "Stalker",
			characterLevel: 5,
			proficiencyBonus: 3,
			primaryStatModifier: 3,
			runeRarity: "uncommon",
			unlockedRegents: [],
			usesPerRest: "1",
			nativeRecharge: "long rest",
		});
		expect(result.isCrossClassAdaptation).toBe(false);
		expect(result.isNativeViaJob).toBe(true);
	});
});

describe("resolveRuneAbsorption — legacy positional signature stays compatible", () => {
	it("delegates to the same locked formula path", () => {
		const result = resolveRuneAbsorption(
			"caster",
			"1",
			"Striker",
			5,
			3,
			"rare",
		);
		expect(result.isCrossClassAdaptation).toBe(true);
		expect(result.abilityKind).toBe("spell");
		// max(1, 3 + 0 + 1) = 4 (legacy path defaults stat mod to 0)
		expect(result.usesMax).toBe(4);
	});
});

describe("resolveRuneAbsorption — helpers", () => {
	it("getRunePrimaryStatModifier returns the best primary stat modifier per job", () => {
		expect(getRunePrimaryStatModifier("Mage", { INT: INT16, SENSE: 10 })).toBe(
			3,
		);
		expect(
			getRunePrimaryStatModifier("Striker", { STR: STR16, AGI: AGI16 }),
		).toBe(3);
		expect(
			getRunePrimaryStatModifier(null, { STR: 10, AGI: 10, VIT: 10 }),
		).toBe(0);
	});

	it("getRuneRarityBonus follows the locked ladder", () => {
		expect(getRuneRarityBonus("uncommon")).toBe(0);
		expect(getRuneRarityBonus("rare")).toBe(1);
		expect(getRuneRarityBonus("very_rare")).toBe(2);
		expect(getRuneRarityBonus("legendary")).toBe(3);
	});

	it("inferRuneAbilityKind prefers explicit teaches over rank/tag heuristics", () => {
		expect(
			inferRuneAbilityKind({
				teaches: { kind: "technique" },
				rank: "A",
			}),
		).toBe("technique");
		expect(inferRuneAbilityKind({ rank: "POWER" })).toBe("power");
		expect(inferRuneAbilityKind({ rank: "A" })).toBe("spell");
	});
});

describe("resolveRuneGrant native strict eligibility", () => {
	it("marks a high-level power native but under-level when job can eventually learn it", async () => {
		const power = await getHighLevelDestroyerPower();
		const accessContext: RuneGrantAccessContext = {
			jobName: "Destroyer",
			characterLevel: 5,
			pathName: null,
			regentNames: [],
		};
		const grant = await resolveRuneGrant(
			{ kind: "power", ref: power.name },
			accessContext,
		);
		expect(grant).not.toBeNull();
		expect(grant?.isNative).toBe(true);
		expect(grant?.isUnderLevel).toBe(true);
		expect(grant?.abilityLevel).toBeGreaterThan(grant?.maxNativeLevel ?? 0);
		expect(grant?.promotesAtLevel).toBeGreaterThan(5);
	});

	it("marks a power non-native for a caster job even when level is ignored", async () => {
		const power = await getHighLevelDestroyerPower();
		const grant = await resolveRuneGrant(
			{ kind: "power", ref: power.name },
			{
				jobName: "Mage",
				characterLevel: 20,
				pathName: null,
				regentNames: [],
			},
		);
		expect(grant).not.toBeNull();
		expect(grant?.isNative).toBe(false);
		expect(grant?.isUnderLevel).toBe(false);
	});

	it("treats exact path-granted powers as native only for the selected path", async () => {
		const matchingPathGrant = await resolveRuneGrant(
			{ kind: "power", ref: "Cursed Blade Edge" },
			{
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 1,
				regentNames: [],
			},
		);
		const missingPathGrant = await resolveRuneGrant(
			{ kind: "power", ref: "Cursed Blade Edge" },
			{
				jobName: "Contractor",
				pathName: "Path of the Forgotten Star",
				characterLevel: 1,
				regentNames: [],
			},
		);

		expect(matchingPathGrant).not.toBeNull();
		expect(matchingPathGrant?.isNative).toBe(true);
		expect(matchingPathGrant?.isUnderLevel).toBe(false);
		expect(missingPathGrant).not.toBeNull();
		expect(missingPathGrant?.isNative).toBe(false);
	});
});
