/**
 * Test suite for choice calculations integration
 * Verifies that CharacterNew and JobDetail correctly calculate skill choices from awakening features
 */

import { describe, expect, it } from "vitest";
import {
	type ChoiceGrant,
	type ChoiceSourceData,
	calculateTotalChoices,
	getChoiceGrantDetails,
} from "../choiceCalculations";

// Mock static job data with awakening features and traits
const mockStaticJob = {
	name: "Idol",
	skillChoices: [
		"Acrobatics",
		"Animal Handling",
		"Arcana",
		"Athletics",
		"Deception",
		"History",
		"Insight",
		"Intimidation",
		"Investigation",
		"Medicine",
		"Nature",
		"Perception",
		"Performance",
		"Persuasion",
		"Religion",
		"Sleight of Hand",
		"Stealth",
		"Survival",
	],
	awakening_features: [
		{
			name: "Broad-Spectrum Awakening",
			description: "Gain proficiency in two additional skills of your choice.",
			level: 1,
		},
	],
	job_traits: [
		{
			name: "Rift Versatility",
			description: "Add half prof bonus to unproficient checks.",
			type: "passive",
		},
		{
			name: "Specialist Training",
			description: "Double proficiency on two chosen skill proficiencies.",
			type: "passive",
		},
	],
};

// Mock database job data
const mockDbJob = {
	skill_choice_count: 2,
	skill_choices: [
		"Acrobatics",
		"Animal Handling",
		"Arcana",
		"Athletics",
		"Deception",
		"History",
		"Insight",
		"Intimidation",
		"Investigation",
		"Medicine",
		"Nature",
		"Perception",
		"Performance",
		"Persuasion",
		"Religion",
		"Sleight of Hand",
		"Stealth",
		"Survival",
	],
};

describe("Choice Calculations Integration", () => {
	describe("calculateTotalChoices", () => {
		it("should correctly calculate total choices for Idol job with awakening features", () => {
			// Create enhanced job data as CharacterNew does
			const enhancedJobData = {
				...mockDbJob,
				awakening_features: mockStaticJob.awakening_features || [],
				job_traits: mockStaticJob.job_traits || [],
			};

			const result = calculateTotalChoices(enhancedJobData, null, [], 1);

			// Should have base skills + awakening skills
			expect(result.skills).toBe(4); // 2 base + 2 from awakening
			expect(result.expertise).toBe(2); // 2 from Specialist Training trait
			expect(result.feats).toBe(0);
			expect(result.spells).toBe(0);
			expect(result.powers).toBe(0);
		});

		it("should return only base choices when no awakening features exist", () => {
			const jobWithoutFeatures = {
				...mockDbJob,
				awakening_features: [],
				job_traits: [],
			};

			const result = calculateTotalChoices(jobWithoutFeatures, null, [], 1);

			expect(result.skills).toBe(2); // Only base choices
			expect(result.expertise).toBe(0);
		});

		it("should handle jobs with multiple awakening features granting choices", () => {
			const jobWithMultipleFeatures = {
				...mockDbJob,
				awakening_features: [
					{
						name: "Feature 1",
						description:
							"Gain proficiency in two additional skills of your choice.",
						level: 1,
					},
					{
						name: "Feature 2",
						description: "Gain one additional feat of your choice.",
						level: 1,
					},
				],
				job_traits: [],
			};

			const result = calculateTotalChoices(
				jobWithMultipleFeatures,
				null,
				[],
				1,
			);

			expect(result.skills).toBe(4); // 2 base + 2 from feature
			expect(result.feats).toBe(1); // 1 from feature
		});
	});

	describe("getChoiceGrantDetails", () => {
		it("should return detailed choice grants for UI display", () => {
			const enhancedJobData = {
				...mockDbJob,
				awakening_features: mockStaticJob.awakening_features || [],
				job_traits: mockStaticJob.job_traits || [],
			};

			const details = getChoiceGrantDetails(enhancedJobData, null, [], 1);

			expect(details).toHaveLength(2); // 1 awakening feature + 1 trait with expertise

			// Check awakening feature grant
			const skillGrant = details.find((g: ChoiceGrant) => g.type === "skills");
			expect(skillGrant).toBeDefined();
			expect(skillGrant?.count).toBe(2);
			expect(skillGrant?.source).toBe("Job: Broad-Spectrum Awakening");

			// Check trait expertise grant
			const expertiseGrant = details.find(
				(g: ChoiceGrant) => g.type === "expertise",
			);
			expect(expertiseGrant).toBeDefined();
			expect(expertiseGrant?.count).toBe(2);
			expect(expertiseGrant?.source).toBe("Trait: Specialist Training");
		});

		it("should return empty array when no features exist", () => {
			const jobWithoutFeatures = {
				...mockDbJob,
				awakening_features: [],
				job_traits: [],
			};

			const details = getChoiceGrantDetails(jobWithoutFeatures, null, [], 1);

			expect(details).toHaveLength(0);
		});
	});

	describe("Pattern Matching", () => {
		it("should correctly parse written numbers in descriptions", () => {
			const testCases = [
				{
					desc: "Gain proficiency in two additional skills of your choice.",
					expected: { type: "skills", count: 2 },
				},
				{
					desc: "Gain one additional feat of your choice.",
					expected: { type: "feats", count: 1 },
				},
				{
					desc: "Double proficiency on four chosen skill proficiencies.",
					expected: { type: "expertise", count: 4 },
				},
				{
					desc: "Gain proficiency in 2 additional skills of your choice.",
					expected: { type: "skills", count: 2 },
				},
				{
					desc: "Learn 3 additional feats of your choice.",
					expected: { type: "feats", count: 3 },
				},
			];

			for (const testCase of testCases) {
				const details = getChoiceGrantDetails(
					{
						skill_choice_count: 0,
						awakening_features: [
							{ name: "Test", description: testCase.desc, level: 1 },
						],
						job_traits: [],
					} as ChoiceSourceData,
					null,
					[],
					1,
				);

				const grant = details.find(
					(g: ChoiceGrant) => g.type === testCase.expected.type,
				);
				expect(grant).toBeDefined();
				expect(grant?.count).toBe(testCase.expected.count);
			}
		});
	});
});
