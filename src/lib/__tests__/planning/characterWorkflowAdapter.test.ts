import { describe, expect, it } from "vitest";
import {
	buildCharacterCreationWorkflowPlanV1,
	buildCharacterLevelDownPreflightV1,
	buildCharacterLevelUpWorkflowPlanV1,
	type CharacterCreationWorkflowInputV1,
	type CharacterWorkflowChoiceInputV1,
	type CharacterWorkflowIdentityV1,
	createCharacterWorkflowHandoffV1,
} from "@/lib/planning/adapters/characterWorkflowAdapter";

function canonical(
	id: string | null,
	collection: string,
	label = id ?? "Missing",
): CharacterWorkflowIdentityV1 {
	return {
		id,
		label,
		sourceKind: "canonical",
		collection,
		canonicalType: collection,
		sourceBook: "Core",
		persistence: "id",
	};
}

function homebrew(
	id: string,
	collection: string,
	label = id,
): CharacterWorkflowIdentityV1 {
	return {
		id,
		label,
		sourceKind: "homebrew",
		collection,
		persistence: "id",
		sourcePath: `published.${collection}.${id}`,
	};
}

function sourceAddress(
	id: string,
	collection: string,
	path: string,
	label = id,
): CharacterWorkflowIdentityV1 {
	return {
		id,
		label,
		sourceKind: "source-address",
		collection,
		sourcePath: path,
		persistence: "source-address",
	};
}

function choice(
	kind: CharacterWorkflowChoiceInputV1["kind"],
	sourceIndex: number,
	option: CharacterWorkflowIdentityV1,
	grantType: CharacterWorkflowChoiceInputV1["grantType"],
): CharacterWorkflowChoiceInputV1 {
	return {
		kind,
		source: canonical("job-warden", "jobs", "Warden"),
		sourceIndex,
		level: 1,
		count: 1,
		prompt: `Choose ${kind}`,
		options: [option],
		selectedOptionIds: option.id ? [option.id] : [],
		grantType,
	};
}

function creationInput(): CharacterCreationWorkflowInputV1 {
	return {
		characterId: "draft:character-1",
		job: canonical("job-warden", "jobs", "Warden"),
		path: homebrew("hb-path-aegis", "paths", "Aegis Path"),
		background: canonical("background-scout", "backgrounds", "Scout"),
		features: [
			{
				identity: sourceAddress(
					"job-warden:classFeatures:0",
					"job-features",
					"classFeatures[0]",
					"Guard Stance",
				),
				owner: canonical("job-warden", "jobs", "Warden"),
				level: 1,
			},
			{
				identity: homebrew(
					"hb-feature-aegis",
					"homebrew-features",
					"Aegis Pulse",
				),
				owner: homebrew("hb-path-aegis", "paths", "Aegis Path"),
				level: 1,
			},
		],
		fixedGrants: [
			{
				kind: "equipment",
				identity: sourceAddress(
					"job-warden:startingEquipment:0:1",
					"equipment-packages",
					"startingEquipment[0][1]",
					"Shield",
				),
				owner: canonical("job-warden", "jobs", "Warden"),
				level: 1,
				grantType: "equipment",
			},
		],
		choices: [
			choice("power", 0, canonical("power-a", "powers"), "power"),
			choice(
				"technique",
				0,
				canonical("technique-a", "techniques"),
				"technique",
			),
			choice("spell", 0, canonical("spell-a", "spells"), "spell"),
			choice(
				"fighting-style",
				0,
				canonical("style-defense", "fighting-styles"),
				"feature",
			),
			choice(
				"ledger",
				4,
				sourceAddress(
					"job-warden:levelChoices:4:option:0",
					"ledger-options",
					"levelChoices[4].options[0]",
					"Favored Terrain",
				),
				"feature",
			),
		],
	};
}

describe("character creation workflow adapter", () => {
	it("maps ID-first canonical, homebrew, source-address, and selected catalogs", () => {
		const plan = buildCharacterCreationWorkflowPlanV1(creationInput());

		expect(plan.canApply).toBe(true);
		expect(plan.choices).toHaveLength(5);
		expect(plan.choices.every((entry) => entry.status === "selected")).toBe(
			true,
		);
		expect(plan.orderedGrants.map((grant) => grant.grantType)).toEqual(
			expect.arrayContaining([
				"custom",
				"feature",
				"equipment",
				"power",
				"technique",
				"spell",
			]),
		);
		const homebrewFeature = plan.orderedGrants.find(
			(grant) => grant.payload.entityId === "hb-feature-aegis",
		);
		expect(homebrewFeature?.provenance).toMatchObject({
			reference: null,
			sourceEvidence: expect.arrayContaining([
				expect.objectContaining({
					kind: "homebrew",
					sourceId: "hb-feature-aegis",
				}),
			]),
		});
		const power = plan.orderedGrants.find(
			(grant) => grant.payload.entityId === "power-a",
		);
		expect(power?.provenance.reference).toMatchObject({
			kind: "canonical",
			id: "power-a",
		});
	});

	it("never uses labels as grant or choice identities", () => {
		const original = creationInput();
		const renamed: CharacterCreationWorkflowInputV1 = {
			...original,
			job: { ...original.job, label: "Localized Warden" },
			background: { ...original.background, label: "Localized Scout" },
			choices: original.choices?.map((entry) => ({
				...entry,
				source: { ...entry.source, label: "Localized Owner" },
				options: entry.options.map((option) => ({
					...option,
					label: `Localized ${option.label}`,
				})),
			})),
		};
		const first = buildCharacterCreationWorkflowPlanV1(original);
		const second = buildCharacterCreationWorkflowPlanV1(renamed);

		expect(second.orderedGrants.map((grant) => grant.grantId)).toEqual(
			first.orderedGrants.map((grant) => grant.grantId),
		);
		expect(second.choices.map((entry) => entry.choiceId)).toEqual(
			first.choices.map((entry) => entry.choiceId),
		);
	});

	it("blocks missing IDs and selected rows whose persistence is display-only", () => {
		const input = creationInput();
		const displayOnlySpell = {
			...homebrew("hb-spell-1", "spells", "Homebrew Bolt"),
			persistence: "display-only" as const,
		};
		input.job = canonical(null, "jobs", "Name Is Not An Identity");
		input.choices = [choice("spell", 0, displayOnlySpell, "spell")];
		const plan = buildCharacterCreationWorkflowPlanV1(input);

		expect(plan.canApply).toBe(false);
		expect(plan.blockers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: "character-workflow-identity-required",
				}),
				expect.objectContaining({
					code: "character-workflow-identity-not-persisted",
					severity: "review-blocked",
				}),
			]),
		);
	});
});

describe("character level transition workflow adapter", () => {
	it("maps features, Regent provenance, feats, abilities, and ledger choices", () => {
		const job = canonical("job-warden", "jobs", "Warden");
		const regent = canonical("regent-frost", "regents", "Frost Regent");
		const plan = buildCharacterLevelUpWorkflowPlanV1({
			characterId: "character-1",
			fromLevel: 3,
			toLevel: 4,
			job,
			features: [
				{
					identity: sourceAddress(
						"job-warden:classFeatures:3",
						"job-features",
						"classFeatures[3]",
						"Aegis Improvement",
					),
					owner: job,
					level: 4,
				},
				{
					identity: canonical(
						"regent-feature:frost:4:ice-wall",
						"regent-features",
						"Ice Wall",
					),
					owner: regent,
					level: 4,
				},
			],
			abilityIncrease: {
				source: sourceAddress(
					"job-warden:abilityIncrease:4",
					"ability-increases",
					"abilityScoreImprovements[0]",
					"Level 4 ASI",
				),
				points: { STR: 1, VIT: 1 },
				expectedPoints: 2,
			},
			choices: [
				{
					...choice("feat", 0, canonical("feat-alert", "feats"), "feat"),
					level: 4,
				},
				{
					...choice(
						"ledger",
						2,
						sourceAddress(
							"job-warden:levelChoices:2:option:0",
							"ledger-options",
							"levelChoices[2].options[0]",
							"Tool Mastery",
						),
						"feature",
					),
					level: 4,
				},
			],
		});

		expect(plan.canApply).toBe(true);
		expect(plan.orderedGrants).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ grantType: "ability-increase" }),
				expect.objectContaining({ grantType: "feat" }),
				expect.objectContaining({
					grantType: "feature",
					provenance: expect.objectContaining({
						sourceEvidence: expect.arrayContaining([
							expect.objectContaining({ sourceId: "regent-frost" }),
						]),
					}),
				}),
			]),
		);
	});

	it("fails closed for review-blocked Regents, retraining, and unresolved ledgers", () => {
		const job = canonical("job-warden", "jobs", "Warden");
		const plan = buildCharacterLevelUpWorkflowPlanV1({
			characterId: "character-1",
			fromLevel: 4,
			toLevel: 5,
			job,
			features: [
				{
					identity: canonical(
						"regent-feature:frost:5:unknown",
						"regent-features",
						"Unresolved Regent Feature",
					),
					owner: canonical("regent-frost", "regents", "Frost Regent"),
					level: 5,
					disposition: "review-blocked",
					reviewBlockerId: "regent-review-5",
				},
			],
			retrain: {
				kind: "spell",
				ownedRowId: "character-spell-1",
				currentReferenceId: "spell-old",
				replacement: canonical("spell-new", "spells"),
			},
			unresolvedLedger: [
				{ owner: job, ledgerIndex: 7, level: 5, type: "tool", count: 1 },
			],
		});

		expect(plan.canApply).toBe(false);
		expect(plan.blockers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: "lifecycle-grant-review-blocked",
					reviewBlockerId: "regent-review-5",
				}),
				expect.objectContaining({
					code: "character-workflow-retrain-not-representable-v1",
				}),
				expect.objectContaining({
					code: "character-workflow-ledger-options-unresolved",
				}),
			]),
		);
	});
});

describe("level-down preflight and snapshot handoff", () => {
	it("only permits removal when ownership and reversal history are complete", () => {
		const incomplete = buildCharacterLevelDownPreflightV1({
			characterId: "character-1",
			fromLevel: 6,
			toLevel: 5,
			sourceKey: "progression:character-1",
			ownershipAndHistoryComplete: false,
			records: [
				{
					recordKey: "feature-level-6",
					level: 6,
					value: { kind: "feature" },
					provenSourceKey: "progression:character-1",
				},
			],
		});
		expect(incomplete.canRemoveProgression).toBe(false);
		expect(incomplete.reconciliationPlan.operations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					recordKey: "feature-level-6",
					status: "remove",
				}),
				expect.objectContaining({
					recordKey: "preflight:ownership-and-history-proof",
					status: "review-blocked",
				}),
			]),
		);

		const complete = buildCharacterLevelDownPreflightV1({
			characterId: "character-1",
			fromLevel: 6,
			toLevel: 5,
			sourceKey: "progression:character-1",
			ownershipAndHistoryComplete: true,
			records: [
				{
					recordKey: "feature-level-6",
					level: 6,
					value: { kind: "feature" },
					provenSourceKey: "progression:character-1",
				},
			],
		});
		expect(complete.canRemoveProgression).toBe(true);
	});

	it("creates a stored-base snapshot as the cache handoff without derived persistence", () => {
		const creationPlan = buildCharacterCreationWorkflowPlanV1({
			...creationInput(),
			characterId: "character-actual-1",
		});
		const handoff = createCharacterWorkflowHandoffV1({
			workflowKind: "creation",
			plan: creationPlan,
			displayName: "Rin",
			storedBases: {
				level: 1,
				experience: 0,
				abilityScores: {
					strength: 12,
					agility: 14,
					vitality: 13,
					intelligence: 10,
					sense: 11,
					presence: 8,
				},
				hitPointsMaximum: 10,
				baseArmorClass: 12,
				baseSpeed: { land: 30 },
				proficiencyBonus: 2,
				hitDice: { maximum: 1, size: 8 },
				additional: { jobId: "job-warden" },
			},
		});

		expect(handoff.snapshot).toMatchObject({
			character: { id: "character-actual-1" },
			storedBases: {
				level: 1,
				additional: {
					jobId: "job-warden",
					lifecyclePlanId: creationPlan.planId,
				},
			},
			canonicalDerivedValues: [],
		});
		expect(handoff.cacheInvalidationKeys).toEqual([
			["characters"],
			["character", "character-actual-1"],
		]);
	});
});
