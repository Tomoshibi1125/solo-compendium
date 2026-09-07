import { describe, expect, it } from "vitest";
import { conditions as catalogConditions } from "@/data/compendium/conditions";
import {
	CONDITION_CATALOG_IDS,
	CONDITION_EFFECTS,
	EXHAUSTION_TABLE,
} from "@/lib/conditionEffects";
import {
	advanceConditionRound,
	advanceConditionsForRest,
	advanceConditionTurn,
	applyCondition,
	breakConcentration,
	CONDITION_LIFECYCLE_VERSION,
	createConditionApplicationV1,
	normalizeCombatConditions,
	reduceConditionLifecycle,
} from "@/lib/conditionSystem";
import { getActiveConditionEffects } from "@/lib/conditions";
import { adaptLegacyConditionTimers } from "@/lib/conditionTimers";
import { buildLongRestConditionState } from "@/lib/restSystem";

const source = {
	type: "spell" as const,
	id: "spell-1",
	name: "Binding Ray",
	actorId: "actor-1",
};

function application(
	overrides: Partial<Parameters<typeof createConditionApplicationV1>[0]> = {},
) {
	return createConditionApplicationV1({
		conditionId: "restrained",
		source,
		duration: {
			unit: "round",
			anchor: "round",
			value: 2,
			remaining: 2,
		},
		stackingPolicy: "stack",
		restPolicy: "remove-on-long-rest",
		automationState: "automated",
		...overrides,
	});
}

const runtime = {
	id: "condition-fixed",
	appliedAt: "2026-01-01T00:00:00.000Z",
};

describe("canonical condition vocabulary", () => {
	it("covers every authored catalog ID from one mechanical authority", () => {
		expect([...CONDITION_CATALOG_IDS].sort()).toEqual(
			catalogConditions.map((condition) => condition.id).sort(),
		);
		for (const condition of catalogConditions) {
			expect(CONDITION_EFFECTS[condition.id]?.id).toBe(condition.id);
		}
	});

	it("marks Rift-specific prose as manual with no inferred mechanics", () => {
		for (const id of [
			"shadow-corrupted",
			"gate-exhausted",
			"essence-drained",
			"shadow-bound",
			"regent-marked",
			"shadow-fused",
		]) {
			expect(CONDITION_EFFECTS[id]).toMatchObject({
				automationState: "manual",
				mechanicalEffects: [],
			});
			expect(CONDITION_EFFECTS[id].manualReason).toBeTruthy();
		}
	});

	it("keeps numeric exhaustion authoritative and the old facade compatible", () => {
		expect(EXHAUSTION_TABLE).toHaveLength(7);
		expect(CONDITION_EFFECTS.exhaustion.mechanicalEffects).toEqual([]);
		const facade = getActiveConditionEffects([" Restrained ", "Stunned"]);
		expect(facade.hasDisadvantage("attack")).toBe(true);
		expect(facade.hasAdvantageAgainst("attack")).toBe(true);
		expect(facade.speedModifier).toBe("zero");
		expect(facade.isIncapacitated).toBe(true);
	});
});

describe("shared condition lifecycle", () => {
	it("supports deterministic IDs/time and all duplicate policies", () => {
		const first = applyCondition([], application(), runtime);
		expect(first.conditions[0]).toMatchObject({
			id: "condition-fixed",
			appliedAt: runtime.appliedAt,
			version: 1,
			conditionName: "restrained",
		});

		const refreshed = applyCondition(
			first.conditions,
			application({
				stackingPolicy: "refresh",
				duration: {
					unit: "round",
					anchor: "round",
					value: 4,
					remaining: 4,
				},
			}),
			{ id: "unused", appliedAt: "2027-01-01T00:00:00.000Z" },
		);
		expect(refreshed.change.type).toBe("refreshed");
		expect(refreshed.conditions).toHaveLength(1);
		expect(refreshed.conditions[0].id).toBe("condition-fixed");
		expect(refreshed.conditions[0].remainingRounds).toBe(4);

		const ignored = applyCondition(
			refreshed.conditions,
			application({ stackingPolicy: "ignore" }),
			{ id: "ignored" },
		);
		expect(ignored.conditions).toBe(refreshed.conditions);
		expect(ignored.change.type).toBe("ignored");

		const stacked = applyCondition(
			ignored.conditions,
			application({ stackingPolicy: "stack" }),
			{ id: "stacked", appliedAt: runtime.appliedAt },
		);
		expect(stacked.conditions).toHaveLength(2);

		const replaced = applyCondition(
			stacked.conditions,
			application({ stackingPolicy: "replace" }),
			{ id: "replacement", appliedAt: runtime.appliedAt },
		);
		expect(replaced.conditions).toHaveLength(1);
		expect(replaced.conditions[0].id).toBe("replacement");
		expect(replaced.change.type).toBe("replaced");
	});

	it("expires only on the authored round/turn anchor", () => {
		const roundEntry = applyCondition(
			[],
			application({
				duration: {
					unit: "round",
					anchor: "round",
					value: 1,
					remaining: 1,
				},
			}),
			runtime,
		).conditions;
		expect(
			advanceConditionTurn(roundEntry, "turn-end").conditions,
		).toHaveLength(1);
		const roundEndEvent = {
			version: CONDITION_LIFECYCLE_VERSION,
			type: "round-end" as const,
			round: 2,
		};
		expect(
			reduceConditionLifecycle(roundEntry, roundEndEvent).conditions,
		).toHaveLength(1);
		expect(advanceConditionRound(roundEntry, 2).conditions).toEqual([]);

		const roundEndEntry = applyCondition(
			[],
			application({
				duration: {
					unit: "round",
					anchor: "round-end",
					value: 1,
					remaining: 1,
				},
			}),
			runtime,
		).conditions;
		expect(advanceConditionRound(roundEndEntry, 2).conditions).toHaveLength(1);
		expect(
			reduceConditionLifecycle(roundEndEntry, roundEndEvent).conditions,
		).toEqual([]);

		const turnEntry = applyCondition(
			[],
			application({
				duration: {
					unit: "turn",
					anchor: "turn-end",
					value: 1,
					remaining: 1,
				},
			}),
			runtime,
		).conditions;
		expect(advanceConditionRound(turnEntry, 2).conditions).toHaveLength(1);
		expect(advanceConditionTurn(turnEntry, "turn-end").conditions).toEqual([]);
	});

	it("breaks matching concentration and filters long rest by policy", () => {
		const concentration = applyCondition(
			[],
			application({
				concentrationId: "concentration-1",
				duration: {
					unit: "concentration",
					anchor: "concentration",
					value: null,
					remaining: null,
				},
			}),
			runtime,
		).conditions;
		const broken = breakConcentration(concentration, "concentration-1");
		expect(broken.conditions).toEqual([]);
		expect(broken.changes[0].type).toBe("concentration_broken");

		const removable = applyCondition(
			[],
			application({
				conditionId: "poisoned",
				restPolicy: "remove-on-long-rest",
			}),
			{ id: "remove", appliedAt: runtime.appliedAt },
		).conditions[0];
		const persistent = applyCondition(
			[],
			application({
				conditionId: "regent-marked",
				restPolicy: "persist",
			}),
			{ id: "persist", appliedAt: runtime.appliedAt },
		).conditions[0];
		const rested = advanceConditionsForRest([removable, persistent], "long");
		expect(rested.conditions.map((entry) => entry.id)).toEqual(["persist"]);

		const restState = buildLongRestConditionState(
			{ resources: { conditions: [removable, persistent] } },
			["poisoned", "regent-marked"],
		);
		expect(restState.legacyConditions).toEqual(["regent-marked"]);
		expect(restState.conditionsCleared).toEqual(["poisoned"]);
	});

	it("filters malformed hydration and adapts absolute legacy timers", () => {
		const valid = applyCondition([], application(), runtime).conditions[0];
		const normalized = normalizeCombatConditions({
			conditions: ["Restrained"],
			advancedConditions: [valid, { id: "malformed" }],
		});
		expect(normalized.advancedConditions).toEqual([valid]);

		const malformedMetadata = [
			{ ...valid, version: 2 },
			{
				id: "incomplete-v1",
				conditionName: "restrained",
				sourceType: "spell",
				sourceId: "spell-1",
				sourceName: "Binding Ray",
				appliedAt: runtime.appliedAt,
				durationRounds: 2,
				remainingRounds: 2,
				concentrationSpellId: null,
				isActive: true,
				version: 1,
			},
			{
				...valid,
				sourceIdentity: {
					type: "spell",
					id: "spell-1",
					name: "Binding Ray",
					actorId: 42,
				},
			},
			{
				...valid,
				duration: {
					unit: "round",
					anchor: "turn-end",
					value: 2,
					remaining: 2,
				},
			},
			{
				...valid,
				save: {
					ability: "agility",
					dc: 12,
					endsOnSuccess: true,
					repeat: { enabled: true, anchor: "turn-middle" },
				},
			},
			{ ...valid, stackingPolicy: "merge" },
			{ ...valid, restPolicy: "remove-sometime" },
			{ ...valid, automationState: "guess" },
			{ ...valid, remainingRounds: 99 },
		];
		expect(
			normalizeCombatConditions({
				advancedConditions: [valid, ...malformedMetadata],
			}).advancedConditions,
		).toEqual([valid]);

		let nextId = 0;
		const adapted = adaptLegacyConditionTimers(
			["Prone", "Custom Aura", "Expired"],
			{ Prone: 8, Expired: 3 },
			3,
			{
				idFactory: () => `legacy-${++nextId}`,
				now: () => runtime.appliedAt,
			},
		);
		expect(adapted.map((entry) => entry.conditionName)).toEqual([
			"prone",
			"custom aura",
		]);
		expect(adapted[0]).toMatchObject({
			legacy: true,
			remainingRounds: 5,
			duration: { unit: "round", remaining: 5 },
		});
		expect(adapted[1]).toMatchObject({
			legacy: true,
			automationState: "manual",
			duration: { unit: "manual", remaining: null },
		});
	});
});
