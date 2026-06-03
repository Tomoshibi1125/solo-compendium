import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	calculateSpellSaveDC,
	getRiftFavorDie,
	getRiftFavorMax,
} from "@/lib/characterCalculations";
import { getEffectiveHpMax, resolveHpMax } from "@/lib/derivedStats";
import { getRegentHpContributionForIds } from "@/lib/regentGestalt";

const ROOT = resolve(__dirname, "../../..");
const src = (rel: string) => readFileSync(resolve(ROOT, rel), "utf8");

/**
 * UI↔data TRUTH parity guard (audit Part 1). Locks the invariants that the
 * sheet/external readers display the engine truth — and, critically, that HP
 * does NOT inflate when the computed value is fed back through the engine
 * (the derived-cache write-through bug, D1).
 */

describe("HP max truth", () => {
	it("getEffectiveHpMax = base + gestalt regent HP (override-aware)", () => {
		const character = { hp_max: 40, level: 8 };
		// No regent → base only.
		expect(getEffectiveHpMax(character, 0)).toBe(40);
		// d12 regent at level 8: 12 + 7*(6+1)=12+49=61 added on top.
		const contribution = getRegentHpContributionForIds(["umbral_regent"], 8);
		expect(contribution).toBeGreaterThan(0);
		expect(getEffectiveHpMax(character, contribution)).toBe(40 + contribution);
	});

	it("honors hp_max_override (override wins, gestalt NOT added)", () => {
		const character = { hp_max: 40, hp_max_override: 99, level: 8 };
		expect(resolveHpMax(character)).toBe(99);
		// Even with a regent contribution, override is final.
		expect(getEffectiveHpMax(character, 50)).toBe(99);
	});
});

describe("D1 structural guard — derived cache must not clobber authoritative hp_max", () => {
	it("persistDerivedStats does NOT write hp_max", () => {
		const s = src("src/lib/derivedStats/persistDerivedStats.ts");
		// The Supabase .update({...}) payload must not include hp_max.
		const updateBlock = s.slice(s.indexOf(".update("), s.indexOf(".eq(")) || s;
		expect(updateBlock.includes("hp_max:")).toBe(false);
	});

	it("the derived write-through does not persist hpMax", () => {
		const s = src("src/hooks/useCharacterDerivedStats.ts");
		const callIdx = s.indexOf("persistDerivedStats(characterId");
		expect(callIdx).toBeGreaterThan(-1);
		const callBlock = s.slice(callIdx, callIdx + 220);
		expect(callBlock.includes("hpMax:")).toBe(false);
	});
});

describe("D2 structural guard — sheet renders HP from engine, not raw cache", () => {
	it("CharacterSheetV2 does not read character.hp_max for display/clamp", () => {
		const s = src("src/components/character-v2/CharacterSheetV2.tsx");
		expect(s.includes("character.hp_max")).toBe(false);
		// It must use the engine-computed effectiveHpMax instead.
		expect(s.includes("effectiveHpMax")).toBe(true);
	});

	it("CharacterSheetV2 does not read raw rift_favor_max/die for display", () => {
		const s = src("src/components/character-v2/CharacterSheetV2.tsx");
		expect(s.includes("character.rift_favor_max")).toBe(false);
		expect(s.includes("character.rift_favor_die")).toBe(false);
	});
});

describe("Rift Favor truth (level-derived, not stale cache)", () => {
	it("max/die come from level tiers", () => {
		expect(getRiftFavorMax(1)).toBe(3);
		expect(getRiftFavorMax(5)).toBe(4);
		expect(getRiftFavorMax(11)).toBe(5);
		expect(getRiftFavorMax(17)).toBe(6);
		expect(getRiftFavorDie(1)).toBe(4);
		expect(getRiftFavorDie(5)).toBe(6);
		expect(getRiftFavorDie(11)).toBe(8);
		expect(getRiftFavorDie(17)).toBe(10);
	});
});

describe("Spell DC truth", () => {
	it("calculateSpellSaveDC = 8 + PB + casting mod", () => {
		const abilities = {
			STR: 10,
			AGI: 10,
			VIT: 10,
			INT: 18,
			SENSE: 10,
			PRE: 10,
		};
		// Mage (INT caster), level 5 → PB +3, INT +4 → DC 15.
		expect(calculateSpellSaveDC(5, "Mage", abilities)).toBe(15);
		// Non-caster → null.
		expect(calculateSpellSaveDC(5, "Destroyer", abilities)).toBeNull();
	});
});
