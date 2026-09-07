import { describe, expect, it } from "vitest";
import {
	evaluatePrerequisites,
	normalizePrerequisiteInput,
	PREREQUISITE_SCHEMA_VERSION,
	parsePrerequisiteText,
	validatePrereq,
} from "@/lib/prerequisites";

const character = {
	level: 5,
	job: { name: "Mage" },
	abilities: { STR: 10, AGI: 14, VIT: 12, INT: 16, SENSE: 10, PRE: 10 },
	features: [{ name: "Spellcasting" }],
	proficiencies: ["Light armor"],
} as const;

describe("versioned prerequisite contracts", () => {
	it("evaluates nested all/any/not groups without changing literal names", () => {
		const result = evaluatePrerequisites(
			{
				all: [
					{ minLevel: 5 },
					{
						any: [{ requiredJob: "Mage" }, { requiredJob: "Stalker" }],
					},
					{ not: { requiredJob: "Destroyer" } },
				],
				outcome: "strict",
			},
			character,
		);

		expect(result.version).toBe(PREREQUISITE_SCHEMA_VERSION);
		expect(result.ok).toBe(true);
		expect(result.blocking).toBe(false);
		expect(result.verified).toBe(true);
		expect(result.issues).toEqual([]);
	});

	it("honors explicit strict, warning, and empty-group outcomes", () => {
		const strict = evaluatePrerequisites(
			{ kind: "level", minimum: 6, outcome: "strict" },
			character,
		);
		const warning = evaluatePrerequisites(
			{ kind: "level", minimum: 6, outcome: "warning" },
			character,
		);
		const groupedWarning = evaluatePrerequisites(
			{ all: [{ minLevel: 6 }], outcome: "warning" },
			character,
		);
		const emptyAny = evaluatePrerequisites({ any: [] }, character);

		expect(strict).toMatchObject({
			ok: false,
			blocking: true,
			verified: true,
			outcome: "strict",
		});
		expect(warning).toMatchObject({
			ok: false,
			blocking: false,
			verified: true,
			outcome: "warning",
		});
		expect(groupedWarning).toMatchObject({
			ok: false,
			blocking: false,
			outcome: "warning",
		});
		expect(emptyAny).toMatchObject({
			ok: false,
			verified: false,
			outcome: "manual",
		});
	});

	it("keeps unknown prose and fields as manual advisories", () => {
		const prose = evaluatePrerequisites(
			"Must have witnessed the violet moon",
			character,
		);
		const object = evaluatePrerequisites(
			{ background: "Unverified archive title" },
			character,
		);

		expect(prose).toMatchObject({
			ok: false,
			blocking: false,
			verified: false,
			state: "manual",
			outcome: "manual",
		});
		expect(prose.advisories[0]).toContain("violet moon");
		expect(object.advisories[0]).toContain("background");
		expect(object.advisories[0]).toContain("Unverified archive title");
	});

	it("normalizes string arrays and known legacy object keys conservatively", () => {
		const contract = normalizePrerequisiteInput([
			"Intelligence 13 or higher",
			"Requires the archivist's approval",
		]);
		const legacyObject = evaluatePrerequisites(
			{ level: 5, class: "Mage", ability: "INT", score: 13 },
			character,
		);

		expect(contract.version).toBe(1);
		expect(contract.root).toMatchObject({ node: "group", operator: "all" });
		expect(legacyObject.ok).toBe(true);
		// Literal legacy names remain names; normalization does not manufacture IDs.
		expect(JSON.stringify(legacyObject.contract)).not.toContain("targetId");
	});

	it("uses three-state any/not behavior when an alternative is manual", () => {
		const satisfiedAny = evaluatePrerequisites(
			{
				any: [{ requiredJob: "Mage" }, "Requires an unknown campaign blessing"],
			},
			character,
		);
		const manualAny = evaluatePrerequisites(
			{
				any: [
					{ requiredJob: "Destroyer" },
					"Requires an unknown campaign blessing",
				],
			},
			character,
		);
		const negated = evaluatePrerequisites(
			{ not: { requiredJob: "Destroyer" } },
			character,
		);

		expect(satisfiedAny.ok).toBe(true);
		expect(satisfiedAny.issues).toEqual([]);
		expect(manualAny.state).toBe("manual");
		expect(manualAny.outcome).toBe("manual");
		expect(negated.ok).toBe(true);
	});
	it("never verifies malformed known fields or unsupported versions", () => {
		for (const input of [
			{ minLevel: "99" },
			{ requiredFeature: ["Spellcasting", 42] },
			{ version: 2, root: { kind: "level", minimum: 99 } },
			{ version: 1 },
		]) {
			const result = evaluatePrerequisites(input, character);
			expect(result).toMatchObject({
				ok: false,
				blocking: false,
				verified: false,
				outcome: "manual",
			});
			expect(result.advisories.length).toBeGreaterThan(0);
		}
	});
});

describe("legacy prerequisite APIs", () => {
	it("preserves validatePrereq checks and positional calling convention", () => {
		expect(
			validatePrereq(
				{
					minAbility: { INT: 13 },
					minLevel: 5,
					requiredJob: "mage",
					requiredFeature: ["Spellcasting"],
					requiredProficiency: ["Light armor"],
				},
				character,
			),
		).toEqual({ ok: true, missing: [] });
	});

	it("does not silently verify textOnly parsed from unknown prose", () => {
		const parsed = parsePrerequisiteText("Requires the Warden's approval");
		expect(parsed?.textOnly).toContain("Warden's approval");

		const result = validatePrereq(parsed, character);
		expect(result.ok).toBe(false);
		expect(result.missing[0]).toContain("Manual review required");
	});
});
