import { describe, expect, it } from "vitest";
import {
	buildCharacterCreationPlanV1,
	buildLevelTransitionPlanV1,
	type CharacterChoiceRequirementInputV1,
	type LifecycleProvenanceV1,
} from "@/lib/planning/characterLifecyclePlans";

function provenance(
	ruleId: string,
	sourceLevel: number,
): LifecycleProvenanceV1 {
	return {
		version: 1,
		ruleId,
		sourceLevel,
		reference: null,
		sourceEvidence: [],
	};
}

function choice(
	choiceId: string,
	level: number,
): CharacterChoiceRequirementInputV1 {
	return {
		choiceId,
		order: 1,
		level,
		count: 1,
		prompt: `Choose for ${choiceId}`,
		options: [
			{ optionId: `${choiceId}-a`, label: "A" },
			{ optionId: `${choiceId}-b`, label: "B" },
		],
		provenance: provenance(`rule:${choiceId}`, level),
	};
}

describe("buildCharacterCreationPlanV1", () => {
	it("requires level 1, orders grants, and blocks on an unselected choice", () => {
		const plan = buildCharacterCreationPlanV1({
			characterId: "character-draft-1",
			targetLevel: 1,
			grants: [
				{
					grantId: "grant-second",
					order: 2,
					level: 1,
					grantType: "feature",
					provenance: provenance("job:feature-2", 1),
				},
				{
					grantId: "grant-first",
					order: 1,
					level: 1,
					grantType: "proficiency",
					provenance: provenance("job:proficiency", 1),
				},
			],
			choiceRequirements: [choice("creation-style", 1)],
		});

		expect(plan.orderedGrants.map((grant) => grant.grantId)).toEqual([
			"grant-first",
			"grant-second",
		]);
		expect(plan.choices[0]).toMatchObject({
			status: "required",
			selectedOptionIds: [],
		});
		expect(plan.blockers.some((issue) => issue.severity === "manual")).toBe(
			true,
		);
		expect(plan.canApply).toBe(false);

		const invalid = buildCharacterCreationPlanV1({
			characterId: "character-draft-1",
			targetLevel: 2,
		});
		expect(invalid.issues.map((issue) => issue.code)).toContain(
			"creation-level-must-be-one",
		);
	});
});

describe("buildLevelTransitionPlanV1", () => {
	it("does not infer historical choices", () => {
		const plan = buildLevelTransitionPlanV1({
			characterId: "character-1",
			fromLevel: 5,
			toLevel: 6,
			choiceRequirements: [choice("level-four-style", 4), choice("asi", 6)],
			recordedChoices: [
				{
					choiceId: "asi",
					selectedOptionIds: ["asi-b"],
					provenance: [],
				},
			],
		});

		expect(plan.choices).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					choiceId: "level-four-style",
					status: "historical-unresolved",
					selectedOptionIds: [],
				}),
				expect.objectContaining({
					choiceId: "asi",
					status: "selected",
					selectedOptionIds: ["asi-b"],
				}),
			]),
		);
		expect(
			plan.blockers.some(
				(issue) => issue.code === "lifecycle-historical-choice-unresolved",
			),
		).toBe(true);
	});

	it("accepts explicit history and validates the 1–20 boundary", () => {
		const valid = buildLevelTransitionPlanV1({
			characterId: "character-1",
			fromLevel: 19,
			toLevel: 20,
			choiceRequirements: [choice("old-choice", 10)],
			recordedChoices: [
				{
					choiceId: "old-choice",
					selectedOptionIds: ["old-choice-a"],
					provenance: [],
				},
			],
		});
		expect(valid.canApply).toBe(true);
		expect(valid.choices[0].status).toBe("selected");

		const invalid = buildLevelTransitionPlanV1({
			characterId: "character-1",
			fromLevel: 20,
			toLevel: 21,
		});
		expect(invalid.canApply).toBe(false);
		expect(invalid.issues.map((issue) => issue.code)).toContain(
			"transition-level-out-of-range",
		);
	});

	it("propagates authored review blockers with provenance", () => {
		const plan = buildLevelTransitionPlanV1({
			characterId: "character-1",
			fromLevel: 5,
			toLevel: 6,
			grants: [
				{
					grantId: "ambiguous-grant",
					order: 1,
					level: 6,
					grantType: "ability-increase",
					disposition: "review-blocked",
					reviewBlockerId: "canon-review-18",
					provenance: provenance("job:asi-level-6", 6),
				},
			],
		});

		expect(plan.orderedGrants[0].provenance.ruleId).toBe("job:asi-level-6");
		expect(plan.blockers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					severity: "review-blocked",
					reviewBlockerId: "canon-review-18",
				}),
			]),
		);
	});
});

describe("lifecycle preservation and validation", () => {
	it("does not let out-of-range grant dispositions block this transition", () => {
		const plan = buildLevelTransitionPlanV1({
			characterId: "character-1",
			fromLevel: 5,
			toLevel: 6,
			grants: [
				{
					grantId: "future-manual-grant",
					order: 1,
					level: 7,
					grantType: "feature",
					disposition: "review-blocked",
					reviewBlockerId: "future-review",
					provenance: provenance("job:future-feature", 7),
				},
			],
		});

		expect(plan.orderedGrants).toEqual([]);
		expect(plan.canApply).toBe(true);
		expect(plan.issues.map((issue) => issue.code)).toContain(
			"transition-grant-outside-range",
		);
		expect(plan.issues.map((issue) => issue.code)).not.toContain(
			"lifecycle-grant-review-blocked",
		);
	});

	it("preserves unmatched recorded choices without interpreting them", () => {
		const plan = buildLevelTransitionPlanV1({
			characterId: "character-1",
			fromLevel: 5,
			toLevel: 6,
			recordedChoices: [
				{
					choiceId: "legacy-choice-without-catalog-row",
					selectedOptionIds: ["legacy-option"],
					provenance: [],
				},
			],
		});

		expect(plan.unmatchedRecordedChoices).toEqual([
			{
				version: 1,
				status: "uninterpreted",
				choiceId: "legacy-choice-without-catalog-row",
				selectedOptionIds: ["legacy-option"],
				provenance: [],
			},
		]);
		expect(plan.canApply).toBe(true);
	});

	it("blocks invalid choice identity, order, and provenance", () => {
		const malformed = choice("malformed-choice", 6);
		malformed.order = -1;
		malformed.provenance = provenance("", 19);
		malformed.options = [{ optionId: "", label: "Missing identity" }];
		const outOfRange = choice("out-of-range-choice", 21);
		const plan = buildLevelTransitionPlanV1({
			characterId: "character-1",
			fromLevel: 5,
			toLevel: 6,
			choiceRequirements: [malformed, outOfRange],
			recordedChoices: [
				{
					choiceId: "malformed-choice",
					selectedOptionIds: [""],
					provenance: [],
				},
			],
		});

		expect(plan.canApply).toBe(false);
		expect(plan.issues.map((issue) => issue.code)).toEqual(
			expect.arrayContaining([
				"lifecycle-choice-order-invalid",
				"lifecycle-choice-level-out-of-range",
				"lifecycle-choice-provenance-invalid",
				"lifecycle-choice-option-id-required",
			]),
		);
	});
});
