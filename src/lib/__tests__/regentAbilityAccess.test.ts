import { describe, expect, it } from "vitest";
import { regents } from "@/data/compendium/regents";
import {
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import {
	getActiveRegentAbilityGrants,
	REGENT_ABILITY_GRANTS,
} from "@/lib/regentAbilityAccess";

describe("Task 7 Regent ability access is explicit-only", () => {
	it("quarantines all inferred school and Job-list grants", () => {
		expect(REGENT_ABILITY_GRANTS).toEqual([]);
		for (const regent of regents) {
			expect(
				getActiveRegentAbilityGrants({
					regentNames: [regent.name],
					characterLevel: 20,
				}),
			).toEqual([]);
		}
	});

	it("returns nothing for empty, unknown, or legacy alias tokens", () => {
		for (const regentNames of [
			[],
			["Not A Regent"],
			["Shadow Regent"],
			["Dragon Regent"],
		]) {
			expect(
				getActiveRegentAbilityGrants({ regentNames, characterLevel: 20 }),
			).toEqual([]);
		}
	});

	it("does not broaden a Job's canonical spell options by theme", async () => {
		const withoutRegent = await listLearnableSpells({
			jobName: "Berserker",
			characterLevel: 12,
		});
		const withRegent = await listLearnableSpells({
			jobName: "Berserker",
			regentNames: ["Umbral Regent"],
			characterLevel: 12,
		});
		expect(withRegent.map((entry) => entry.id)).toEqual(
			withoutRegent.map((entry) => entry.id),
		);
	});

	it("does not broaden a Job's canonical martial options by theme", async () => {
		const [basePowers, regentPowers, baseTechniques, regentTechniques] =
			await Promise.all([
				listLearnablePowers({ jobName: "Mage", characterLevel: 12 }),
				listLearnablePowers({
					jobName: "Mage",
					regentNames: ["Beast Regent"],
					characterLevel: 12,
				}),
				listLearnableTechniques({ jobName: "Mage", characterLevel: 12 }),
				listLearnableTechniques({
					jobName: "Mage",
					regentNames: ["Beast Regent"],
					characterLevel: 12,
				}),
			]);
		expect(regentPowers.map((entry) => entry.id)).toEqual(
			basePowers.map((entry) => entry.id),
		);
		expect(regentTechniques.map((entry) => entry.id)).toEqual(
			baseTechniques.map((entry) => entry.id),
		);
	});
});
