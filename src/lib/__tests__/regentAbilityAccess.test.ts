/**
 * Regent ability-access grants must resolve to REAL compendium entries.
 *
 * The user chose "full independent progression" for regents. That only works if
 * a regent's granted spell/power/technique picks resolve to options — otherwise
 * the level-up wizard would demand N picks with 0 available (the Revenant-class
 * hard block). These tests prove the additive regent grant layer surfaces
 * options that a bare (non-caster) base job would not.
 */

import { describe, expect, it } from "vitest";
import { regents } from "@/data/compendium/regents";
import {
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import { getActiveRegentAbilityGrants } from "@/lib/regentAbilityAccess";

const CASTER_REGENTS = [
	"Umbral Regent",
	"Radiant Regent",
	"Destruction Regent",
	"Frost Regent",
	"Plague Regent",
	"Spatial Regent",
	"Blood Regent",
	"Gravity Regent",
];
const MARTIAL_REGENTS = [
	"Steel Regent",
	"War Regent",
	"Beast Regent",
	"Mimic Regent",
];

describe("regent ability-access grant coverage", () => {
	it("every canonical regent has at least one ability grant", () => {
		for (const regent of regents) {
			const grants = getActiveRegentAbilityGrants({
				regentNames: [regent.name],
				characterLevel: 20,
			});
			expect(
				grants.length,
				`${regent.name}: needs at least one ability grant`,
			).toBeGreaterThan(0);
		}
	});

	it("caster regents grant spells; martial regents grant powers + techniques", () => {
		for (const name of CASTER_REGENTS) {
			const spellGrants = getActiveRegentAbilityGrants({
				regentNames: [name],
				characterLevel: 20,
				kind: "spell",
			});
			expect(spellGrants.length, `${name}: caster spell grant`).toBeGreaterThan(
				0,
			);
		}
		for (const name of MARTIAL_REGENTS) {
			const powerGrants = getActiveRegentAbilityGrants({
				regentNames: [name],
				characterLevel: 20,
				kind: "power",
			});
			const techGrants = getActiveRegentAbilityGrants({
				regentNames: [name],
				characterLevel: 20,
				kind: "technique",
			});
			expect(
				powerGrants.length,
				`${name}: martial power grant`,
			).toBeGreaterThan(0);
			expect(
				techGrants.length,
				`${name}: martial technique grant`,
			).toBeGreaterThan(0);
		}
	});

	it("returns nothing without a matching regent name", () => {
		expect(
			getActiveRegentAbilityGrants({ regentNames: [], characterLevel: 20 }),
		).toHaveLength(0);
		expect(
			getActiveRegentAbilityGrants({
				regentNames: ["Not A Regent"],
				characterLevel: 20,
			}),
		).toHaveLength(0);
	});
});

describe("regent grants resolve to real compendium entries (no empty picks)", () => {
	it("a caster regent lets a non-caster base job learn themed leveled spells", async () => {
		// Berserker is a pure martial job — it learns no spells on its own.
		const withoutRegent = await listLearnableSpells({
			jobName: "Berserker",
			characterLevel: 12,
		});
		const withUmbral = await listLearnableSpells({
			jobName: "Berserker",
			regentNames: ["Umbral Regent"],
			characterLevel: 12,
		});
		const leveledFromRegent = withUmbral.filter((s) => s.power_level > 0);
		expect(
			leveledFromRegent.length,
			"Umbral overlay must surface leveled spells for a Berserker",
		).toBeGreaterThan(0);
		expect(withUmbral.length).toBeGreaterThan(withoutRegent.length);
	});

	it("a martial regent lets a caster base job learn themed powers + techniques", async () => {
		const powers = await listLearnablePowers({
			jobName: "Mage",
			regentNames: ["Beast Regent"],
			characterLevel: 12,
		});
		const techniques = await listLearnableTechniques({
			jobName: "Mage",
			regentNames: ["Beast Regent"],
			characterLevel: 12,
		});
		expect(
			powers.length,
			"Beast overlay must surface powers for a Mage",
		).toBeGreaterThan(0);
		expect(
			techniques.length,
			"Beast overlay must surface techniques for a Mage",
		).toBeGreaterThan(0);
	});
});
