import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	calculateSpellSaveDC,
	getProficiencyBonus,
	getRiftFavorDie,
	getRiftFavorMax,
} from "@/lib/characterCalculations";
import { getEffectiveHpMax, resolveHpMax } from "@/lib/derivedStats";
import { hunterRankForLevel } from "@/lib/hunterRank";
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

	// Speed is the same trap with the opposite sign: the engine reads
	// `character.speed` back as its own base, and the display value carries
	// TRANSIENT penalties (encumbrance, conditions, exhaustion). Persisting it
	// compounds toward zero — 35 → 17 → 8, observed live on Jul 20 the moment
	// exhaustion halving shipped. The column stays the authoritative base.
	it("persistDerivedStats does NOT write speed (either branch)", () => {
		const s = src("src/lib/derivedStats/persistDerivedStats.ts");
		const writes = s.match(/speed:\s*snapshot\.speed/g) ?? [];
		expect(writes.length).toBe(0);
	});

	it("the derived write-through does not persist finalSpeed", () => {
		const s = src("src/hooks/useCharacterDerivedStats.ts");
		const callIdx = s.indexOf("persistDerivedStats(characterId");
		expect(callIdx).toBeGreaterThan(-1);
		const callBlock = s.slice(callIdx, callIdx + 220);
		expect(callBlock.includes("speed:")).toBe(false);
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

describe("Rank truth — one license ladder (audit Phase A)", () => {
	it("hunterRankForLevel is canonical: D at level 1, no E rank", () => {
		expect(hunterRankForLevel(1)).toBe("D");
		expect(hunterRankForLevel(4)).toBe("D");
		expect(hunterRankForLevel(5)).toBe("C");
		expect(hunterRankForLevel(9)).toBe("B");
		expect(hunterRankForLevel(13)).toBe("A");
		expect(hunterRankForLevel(17)).toBe("S");
	});

	it("sheet surfaces delegate to the canonical ladder (no inline ladders)", () => {
		// The sheet badge shipped its own ladder with a phantom "E" tier at
		// level 1 while the HUD used the canonical D — the same character
		// showed two different ranks at once (Jul 18 live smoke).
		for (const rel of [
			"src/components/character-v2/CharacterSheetV2.tsx",
			"src/components/character-v2/CharacterScrollHeader.tsx",
		]) {
			const s = src(rel);
			expect(s.includes("hunterRankForLevel"), `${rel} must delegate`).toBe(
				true,
			);
			expect(
				/level >= 17[\s\S]{0,24}\?[\s\S]{0,10}"S"/.test(s),
				`${rel} must not carry an inline rank ladder`,
			).toBe(false);
		}
	});
});

describe("Proficiency-bonus truth — level-derived, not the cached column", () => {
	it("getProficiencyBonus is the canonical ladder", () => {
		expect(getProficiencyBonus(1)).toBe(2);
		expect(getProficiencyBonus(4)).toBe(2);
		expect(getProficiencyBonus(5)).toBe(3);
		expect(getProficiencyBonus(9)).toBe(4);
		expect(getProficiencyBonus(13)).toBe(5);
		expect(getProficiencyBonus(17)).toBe(6);
	});

	// The characters row carries a proficiency_bonus column that writers can
	// leave stale: the import path never sets it and the guest store defaults
	// it to 2, so an imported level-10 Ascendant showed PB 2 on the roster
	// card while the sheet (which computes from level) showed +4.
	it("roster + roll surfaces derive PB from level, not the stored column", () => {
		for (const rel of [
			"src/pages/Characters.tsx",
			"src/hooks/useGlobalDDBeyondIntegration.ts",
		]) {
			const s = src(rel);
			expect(
				/\.proficiency_bonus\b/.test(s),
				`${rel} must not read the cached proficiency_bonus column`,
			).toBe(false);
			expect(s.includes("getProficiencyBonus"), `${rel} must derive PB`).toBe(
				true,
			);
		}
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
