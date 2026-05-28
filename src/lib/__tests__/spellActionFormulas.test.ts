/**
 * Spell action formula regression tests.
 *
 * Locks in:
 *   - Spells use `getSpellcastingAbility(job)` (NOT `getJobPrimaryAbility`)
 *   - 8 + PB + spell-ability mod save DCs
 *   - PB + spell-ability mod attack bonus
 *   - Non-casters return `ability: null` (no spell-casting access)
 *   - Closes B3 / M4 from `docs/ui-canon-parity-audit-2026-05.md`:
 *     spell formulas now go through their dedicated path, not
 *     `resolvePowerActionFormula({ abilityOverride: ... })`.
 */
import { describe, expect, it } from "vitest";
import { resolveSpellActionFormula } from "@/lib/spellActionFormulas";
import type { AbilityScore } from "@/types/core-rules";

const baseAbilities = (
	overrides: Partial<Record<AbilityScore, number>> = {},
): Record<AbilityScore, number> => ({
	STR: 10,
	AGI: 10,
	VIT: 10,
	INT: 10,
	SENSE: 10,
	PRE: 10,
	...overrides,
});

describe("resolveSpellActionFormula — spellcasting ability per Job", () => {
	it("Mage cantrip — INT-based, level 1 = PB 2, INT 16 = +3, save DC 13, atk +5", () => {
		const formula = resolveSpellActionFormula({
			job: "Mage",
			abilities: baseAbilities({ INT: 16 }),
			level: 1,
		});
		expect(formula.ability).toBe("INT");
		expect(formula.abilityModifier).toBe(3);
		// PB(1)=2; attack = PB + mod = 2 + 3 = 5
		expect(formula.attackBonus).toBe(5);
		// DC = 8 + PB + mod = 8 + 2 + 3 = 13
		expect(formula.saveDC).toBe(13);
		expect(formula.attackRoll).toBe("1d20+5");
	});

	it("Esper rank-3 spell — PRE-based, level 5 = PB 3, PRE 18 = +4, save DC 15, atk +7", () => {
		const formula = resolveSpellActionFormula({
			job: "Esper",
			abilities: baseAbilities({ PRE: 18 }),
			level: 5,
		});
		expect(formula.ability).toBe("PRE");
		expect(formula.abilityModifier).toBe(4);
		// PB(5)=3; attack = 3 + 4 = 7
		expect(formula.attackBonus).toBe(7);
		// DC = 8 + 3 + 4 = 15
		expect(formula.saveDC).toBe(15);
	});

	it("Holy Knight — uses Job spellcasting ability (PRE per canonical map)", () => {
		const formula = resolveSpellActionFormula({
			job: "Holy Knight",
			abilities: baseAbilities({ PRE: 14 }),
			level: 3,
		});
		expect(formula.ability).toBe("PRE");
		expect(formula.abilityModifier).toBe(2);
		// PB(3)=2; DC = 8 + 2 + 2 = 12
		expect(formula.saveDC).toBe(12);
	});

	it("Stalker — SENSE-based per RA canon (closed H12 in May audit)", () => {
		const formula = resolveSpellActionFormula({
			job: "Stalker",
			abilities: baseAbilities({ SENSE: 15 }),
			level: 7,
		});
		expect(formula.ability).toBe("SENSE");
		expect(formula.abilityModifier).toBe(2);
		// PB(7)=3; attack = 3 + 2 = 5
		expect(formula.attackBonus).toBe(5);
	});

	it("Non-caster Job (Berserker) returns ability: null", () => {
		const formula = resolveSpellActionFormula({
			job: "Berserker",
			abilities: baseAbilities(),
			level: 5,
		});
		expect(formula.ability).toBeNull();
		expect(formula.abilityModifier).toBe(0);
		// PB(5)=3; with no caster ability, only PB contributes
		expect(formula.attackBonus).toBe(3);
		expect(formula.saveDC).toBe(11);
	});

	it("Applies extra attackBonus and dcBonus additively", () => {
		const formula = resolveSpellActionFormula({
			job: "Mage",
			abilities: baseAbilities({ INT: 16 }),
			level: 1,
			attackBonus: 2,
			dcBonus: 1,
		});
		expect(formula.attackBonus).toBe(5 + 2);
		expect(formula.saveDC).toBe(13 + 1);
	});

	it("Returns attackRoll formula string matching '1d20+N'", () => {
		const formula = resolveSpellActionFormula({
			job: "Mage",
			abilities: baseAbilities({ INT: 16 }),
			level: 5,
		});
		// PB(5)=3 + INT mod(+3) = +6
		expect(formula.attackRoll).toBe("1d20+6");
	});
});
