import { afterEach, describe, expect, it, vi } from "vitest";
import type { ActionResolutionPayloadV2 } from "@/lib/actionResolution";
import { initializeCharacterResources } from "@/lib/characterResources";
import {
	applyCondition,
	createConditionApplicationV1,
} from "@/lib/conditionSystem";
import {
	buildCombatActionPlanV1,
	buildRestActionPlanV1,
} from "@/lib/planning/actionPlans";
import { createCharacterMechanicalSnapshotV1 } from "@/lib/planning/mechanicalSnapshot";

function snapshot() {
	return createCharacterMechanicalSnapshotV1({
		characterId: "character-1",
		displayName: "Planner",
		storedBases: {
			level: 5,
			experience: 6_500,
			abilityScores: {
				strength: 14,
				agility: 12,
				vitality: 16,
				intelligence: 10,
				sense: 10,
				presence: 8,
			},
			hitPointsMaximum: 20,
			baseArmorClass: 15,
			baseSpeed: { walk: 30 },
			proficiencyBonus: 3,
			hitDice: { maximum: 6, size: 8 },
			additional: {},
		},
	});
}

function payload(): ActionResolutionPayloadV2 {
	return {
		version: 2,
		id: "planned-action",
		name: "Planar Snare",
		source: { type: "spell", entryId: "spell-1" },
		kind: "attack",
		actor: { id: "character-1" },
		targets: [{ id: "target-1" }],
		actionEconomy: { type: "action", cost: 1 },
		resourceCosts: [{ resourceId: "mana", amount: 1 }],
		conditionIntents: [
			{
				conditionId: "restrained",
				gate: "on-hit",
				duration: {
					unit: "round",
					anchor: "round",
					value: 2,
					remaining: 2,
				},
				stackingPolicy: "refresh",
				restPolicy: "remove-on-long-rest",
				automationState: "automated",
			},
		],
		duration: null,
		concentration: {
			required: true,
			concentrationId: "spell-1",
			breakExisting: true,
		},
		saveSuccessDamagePolicy: "none",
		mitigationMode: "typed",
		applicationGate: "always",
		automationState: "automated",
		attack: { roll: "1d20+20" },
		damage: { roll: "1d1+2", type: "force" },
		temporaryHitPoints: { roll: "1d1+2" },
	};
}

function restCondition(
	id: string,
	restPolicy: "persist" | "remove-on-long-rest",
) {
	return applyCondition(
		[],
		createConditionApplicationV1({
			conditionId: id,
			source: {
				type: "environment",
				id: "hazard-1",
				name: "Hazard",
				actorId: null,
			},
			duration: {
				unit: "indefinite",
				anchor: "manual",
				value: null,
				remaining: null,
			},
			stackingPolicy: "replace",
			restPolicy,
			automationState: "automated",
		}),
		{ id: `condition-${id}`, appliedAt: "2026-01-01T00:00:00.000Z" },
	).conditions[0];
}

describe("CombatActionPlanV1", () => {
	afterEach(() => vi.restoreAllMocks());

	it("records expected-before operations for costs, temp HP, conditions, and concentration", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.5);
		const character = snapshot();
		const action = payload();
		const context = {
			actor: {
				id: "character-1",
				resources: { mana: 3 },
				concentrationId: null,
			},
			target: {
				id: "target-1",
				armorClass: 10,
				hitPoints: 10,
				maxHitPoints: 10,
				temporaryHitPoints: 0,
				conditions: [],
			},
		};
		const before = JSON.parse(JSON.stringify({ character, action, context }));
		const plan = buildCombatActionPlanV1({
			snapshot: character,
			payload: action,
			context,
		});

		expect(plan.canApply).toBe(true);
		expect(plan.resourceCosts).toEqual([
			{ resourceId: "mana", amount: 1, expectedBefore: 3 },
		]);
		expect(plan.temporaryHitPoints).toEqual({ before: 0, after: 3, delta: 3 });
		expect(plan.concentration).toEqual({
			before: null,
			after: "spell-1",
			operation: "start",
		});
		const resourceOperation = plan.operations.find(
			(operation) => operation.kind === "resource-cost",
		);
		expect(resourceOperation).toMatchObject({
			path: "resources.mana.current",
			expectedBefore: { state: "present", value: 3 },
			after: { state: "present", value: 2 },
		});
		expect(
			plan.operations.some((operation) => operation.kind === "condition"),
		).toBe(true);
		expect({ character, action, context }).toEqual(before);
	});

	it("blocks unresolved legacy mechanics instead of inventing action economy or duration", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.5);
		const plan = buildCombatActionPlanV1({
			snapshot: snapshot(),
			payload: {
				version: 1,
				id: "legacy",
				name: "Legacy Effect",
				source: { type: "item", entryId: "item-1" },
				kind: "attack",
				attack: { roll: "1d20+20" },
				appliesConditions: ["Prone"],
			},
			context: { target: { id: "target-1", armorClass: 10 } },
		});
		expect(plan.canApply).toBe(false);
		expect(plan.requiredChoices.map((choice) => choice.choiceId)).toEqual([
			"action-economy",
			"condition-duration:prone",
		]);
		expect(plan.blockers.every((issue) => issue.blocksApply)).toBe(true);
	});
});

describe("RestActionPlanV1", () => {
	it("plans long-rest recovery through shared resources and condition lifecycle", () => {
		const resources = initializeCharacterResources();
		resources.custom_resources = [
			{
				id: "short-pool",
				name: "Short Pool",
				current: 0,
				max: 2,
				recharge: "short-rest",
			},
			{
				id: "daily-pool",
				name: "Daily Pool",
				current: 1,
				max: 4,
				recharge: "daily",
			},
		];
		resources.temp_hp_sources = [{ amount: 3, source: "Ward" }];
		resources.conditions = [
			restCondition("poisoned", "remove-on-long-rest"),
			restCondition("regent-marked", "persist"),
		];

		const plan = buildRestActionPlanV1({
			snapshot: snapshot(),
			restType: "long",
			resources,
			currentHitPoints: 5,
			currentHitDice: 1,
			concentrationId: "spell-1",
			breakConcentration: true,
		});
		expect(plan.canApply).toBe(true);
		expect(
			Object.fromEntries(
				plan.resourcesAfter.custom_resources.map((resource) => [
					resource.id,
					resource.current,
				]),
			),
		).toEqual({ "short-pool": 2, "daily-pool": 4 });
		expect(
			plan.conditionsAfter.map((condition) => condition.conditionName),
		).toEqual(["regent-marked"]);
		expect(plan.concentration).toEqual({
			before: "spell-1",
			after: null,
			broken: true,
		});
		expect(
			plan.operations.find((operation) => operation.path === "hitPoints")
				?.after,
		).toEqual({ state: "present", value: 20 });
		expect(
			plan.operations.find((operation) => operation.path === "hitDice.current")
				?.after,
		).toEqual({ state: "present", value: 4 });
		expect(plan.resourcesAfter.temp_hp_sources).toEqual([
			{ amount: 3, source: "Ward" },
		]);
	});

	it("requires an explicit short-rest hit-die choice and accepts spend-none", () => {
		const resources = initializeCharacterResources();
		const unresolved = buildRestActionPlanV1({
			snapshot: snapshot(),
			restType: "short",
			resources,
		});
		expect(unresolved.canApply).toBe(false);
		expect(unresolved.requiredChoices[0].choiceId).toBe("short-rest-hit-dice");

		const resolved = buildRestActionPlanV1({
			snapshot: snapshot(),
			restType: "short",
			resources,
			shortRestHitDice: { choice: "none" },
		});
		expect(resolved.canApply).toBe(true);
		expect(resolved.requiredChoices).toEqual([]);
	});

	it("blocks long-rest state changes when current HP/dice are unknown", () => {
		const plan = buildRestActionPlanV1({
			snapshot: snapshot(),
			restType: "long",
			resources: initializeCharacterResources(),
		});
		expect(plan.canApply).toBe(false);
		expect(plan.requiredChoices.map((choice) => choice.choiceId)).toEqual([
			"current-hit-dice",
			"current-hit-points",
		]);
	});
});

describe("CombatActionPlanV1 lifecycle choices", () => {
	it("applies distinct duplicate duration choices before creating stable operations", () => {
		const legacyPayload = {
			version: 1 as const,
			id: "legacy-duplicate",
			name: "Legacy Double Effect",
			source: { type: "item" as const, entryId: "item-1" },
			kind: "effect" as const,
			appliesConditions: ["Prone", "Prone"],
		};
		const firstDuration = {
			unit: "round" as const,
			anchor: "round-end" as const,
			value: 2,
			remaining: 2,
		};
		const secondDuration = {
			unit: "indefinite" as const,
			anchor: "manual" as const,
			value: null,
			remaining: null,
		};
		const plan = buildCombatActionPlanV1({
			snapshot: snapshot(),
			payload: legacyPayload,
			context: { target: { id: "target-1" } },
			actionEconomyChoice: "action",
			conditionDurationChoices: {
				"condition-duration:prone:1": firstDuration,
				"condition-duration:prone:2": firstDuration,
			},
		});

		expect(plan.canApply).toBe(true);
		expect(plan.requiredChoices.map((choice) => choice.choiceId)).toEqual([
			"action-economy",
			"condition-duration:prone:1",
			"condition-duration:prone:2",
		]);
		expect(
			plan.resolution.preview.payload.conditionIntents.map(
				(intent) => intent.duration,
			),
		).toEqual([firstDuration, firstDuration]);
		expect(
			plan.resolution.stateChangeIntents
				.filter((intent) => intent.type === "condition")
				.map((intent) => intent.application.duration),
		).toEqual([firstDuration, firstDuration]);
		const conditionOperationIds = plan.operations
			.filter((operation) => operation.kind === "condition")
			.map((operation) => operation.operationId);
		expect(new Set(conditionOperationIds).size).toBe(2);

		const changed = buildCombatActionPlanV1({
			snapshot: snapshot(),
			payload: legacyPayload,
			context: { target: { id: "target-1" } },
			actionEconomyChoice: "action",
			conditionDurationChoices: {
				"condition-duration:prone:1": {
					...firstDuration,
					value: 3,
					remaining: 3,
				},
				"condition-duration:prone:2": secondDuration,
			},
		});
		expect(changed.planId).not.toBe(plan.planId);
		expect(
			changed.operations
				.filter((operation) => operation.kind === "condition")
				.map((operation) => operation.operationId),
		).not.toEqual(conditionOperationIds);
	});

	it("preserves authored order for non-commutative duplicate conditions", () => {
		const action = payload();
		const replaceIntent = (rounds: number) => ({
			...action.conditionIntents[0],
			gate: "always" as const,
			duration: {
				unit: "round" as const,
				anchor: "round" as const,
				value: rounds,
				remaining: rounds,
			},
			stackingPolicy: "replace" as const,
		});
		const plan = buildCombatActionPlanV1({
			snapshot: snapshot(),
			payload: {
				...action,
				kind: "effect",
				attack: undefined,
				damage: undefined,
				temporaryHitPoints: undefined,
				resourceCosts: [],
				concentration: null,
				conditionIntents: [replaceIntent(1), replaceIntent(5)],
			},
			context: { target: { id: "target-1" } },
		});

		const authoredDurations = plan.operations
			.filter((operation) => operation.kind === "condition")
			.map(
				(operation) =>
					(
						operation.intent as unknown as {
							application: { duration: { value: number | null } };
						}
					).application.duration.value,
			);
		expect(authoredDurations).toEqual([1, 5]);
	});

	it("plans lifecycle cleanup for every observed replaced-concentration effect", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.5);
		const concentratedCondition = (id: string) =>
			applyCondition(
				[],
				createConditionApplicationV1({
					conditionId: "restrained",
					source: {
						type: "spell",
						id: "old-spell",
						name: "Old Spell",
						actorId: "character-1",
					},
					duration: {
						unit: "concentration",
						anchor: "concentration",
						value: null,
						remaining: null,
					},
					stackingPolicy: "stack",
					restPolicy: "remove-on-long-rest",
					automationState: "automated",
					concentrationId: "old-spell",
				}),
				{ id, appliedAt: "2026-01-01T00:00:00.000Z" },
			).conditions[0];
		const plan = buildCombatActionPlanV1({
			snapshot: snapshot(),
			payload: payload(),
			context: {
				actor: {
					id: "character-1",
					resources: { mana: 3 },
					concentrationId: "old-spell",
					conditions: [concentratedCondition("actor-old-effect")],
				},
				target: {
					id: "target-1",
					armorClass: 10,
					hitPoints: 10,
					maxHitPoints: 10,
					conditions: [concentratedCondition("target-old-effect")],
				},
			},
		});

		const lifecycleOperations = plan.operations.filter(
			(operation) => operation.kind === "condition-lifecycle",
		);
		expect(
			lifecycleOperations.map((operation) => operation.targetId).sort(),
		).toEqual(["character-1", "target-1"]);
		expect(
			lifecycleOperations.every(
				(operation) =>
					operation.path === "advancedConditions" &&
					operation.after.state === "present" &&
					Array.isArray(operation.after.value) &&
					operation.after.value.length === 0,
			),
		).toBe(true);
	});
});

describe("RestActionPlanV1 hit-die balances", () => {
	it("blocks short-rest hit-die overdraw without clamping or recovery operations", () => {
		const plan = buildRestActionPlanV1({
			snapshot: snapshot(),
			restType: "short",
			resources: initializeCharacterResources(),
			currentHitPoints: 5,
			currentHitDice: 1,
			shortRestHitDice: {
				choice: "spend",
				hitDiceSpent: 2,
				hitPointsRecovered: 7,
			},
		});

		expect(plan.canApply).toBe(false);
		expect(plan.blockers).toContainEqual(
			expect.objectContaining({ code: "short-rest-hit-dice-overdraw" }),
		);
		expect(
			plan.operations.some(
				(operation) =>
					operation.kind === "hit-dice" || operation.kind === "hit-points",
			),
		).toBe(false);
	});
});
