import { describe, expect, it } from "vitest";
import {
	buildEncounterWorkflowPlanV1,
	createEncounterWorkflowEntryId,
	createEncounterWorkflowSourceIdentityV1,
	type EncounterWorkflowInputV1,
	prepareEncounterInitiativeHandoffV1,
	restoreSavedEncounterWorkflowV1,
} from "@/lib/planning/adapters/encounterWorkflow";

const canonical = createEncounterWorkflowSourceIdentityV1(
	"canonical",
	"shared-explicit-id",
);
const homebrew = createEncounterWorkflowSourceIdentityV1(
	"homebrew",
	"shared-explicit-id",
	7,
);

function workflowInput(): EncounterWorkflowInputV1 {
	return {
		campaignId: "campaign-explicit-id",
		name: "Mirror Breach",
		hunterLevel: 8,
		hunterCount: 4,
		objectives: "Seal the breach before round five.",
		totalXP: 2700,
		difficulty: "hard",
		roster: [
			{
				entryId: createEncounterWorkflowEntryId(canonical),
				displayName: "Mirror Hound",
				quantity: 2,
				source: canonical,
				runtimeState: {
					id: canonical.sourceId,
					name: "Mirror Hound",
					hit_points_average: 37,
					armor_class: 15,
					condition_immunities: ["frightened"],
					custom_runtime: { phase: 2, marked: true },
				},
			},
			{
				entryId: createEncounterWorkflowEntryId(homebrew),
				displayName: "Mirror Hound",
				quantity: 1,
				source: homebrew,
				runtimeState: {
					id: homebrew.sourceId,
					name: "Mirror Hound",
					hit_points_average: 51,
					armor_class: 17,
					_homebrew: true,
					homebrewId: homebrew.sourceId,
				},
			},
		],
	};
}

describe("encounter workflow adapter", () => {
	it("keeps canonical and homebrew identities explicit and namespaced", () => {
		const plan = buildEncounterWorkflowPlanV1(workflowInput());

		expect(plan.canApply).toBe(true);
		expect(plan.source.entries.map((entry) => entry.entryId)).toEqual([
			createEncounterWorkflowEntryId(canonical),
			createEncounterWorkflowEntryId(homebrew),
		]);
		expect(plan.source.entries.map((entry) => entry.source)).toMatchObject([
			{
				status: "resolved",
				sourceType: "canonical",
				sourceId: canonical.sourceId,
			},
			{
				status: "resolved",
				sourceType: "homebrew",
				sourceId: homebrew.sourceId,
			},
		]);
		expect(plan.source.entries.map((entry) => entry.entityKind)).toEqual([
			"canonical-anomaly",
			"homebrew",
		]);
	});

	it("produces deterministic instance IDs and embeds lossless workflow data without changing tracker root keys", () => {
		const first = prepareEncounterInitiativeHandoffV1(
			workflowInput(),
			"2040-01-01T00:00:00.000Z",
		);
		const renamed = workflowInput();
		renamed.roster[0].displayName = "A purely descriptive rename";
		const second = prepareEncounterInitiativeHandoffV1(
			renamed,
			"2041-01-01T00:00:00.000Z",
		);

		expect(first.status).toBe("ready");
		expect(second.status).toBe("ready");
		if (first.status !== "ready" || second.status !== "ready") return;
		expect(first.state.combatants.map((combatant) => combatant.id)).toEqual(
			second.state.combatants.map((combatant) => combatant.id),
		);
		expect(Object.keys(first.state)).toEqual([
			"version",
			"savedAt",
			"combatants",
			"currentTurn",
			"round",
		]);
		const attached = first.state.combatants[0].encounterWorkflow;
		expect(attached.handoff).toEqual(first.plan);
		expect(attached.restoration).toEqual(first.plan.restoration);
		expect(attached.controlledEntity.provenance).toMatchObject({
			originScope: "campaign",
			campaignId: "campaign-explicit-id",
			encounterEntryId: createEncounterWorkflowEntryId(canonical),
			quantityIndex: 0,
		});
		expect(attached.state.runtimeState).toEqual(
			workflowInput().roster[0].runtimeState,
		);
	});

	it("fails closed when an entry has no explicit source identity", () => {
		const input = workflowInput();
		input.roster = [
			{
				entryId: "legacy-entry",
				displayName: "A name is not an identity",
				quantity: 1,
				runtimeState: { id: "untyped-id" },
				source: null,
			},
		];

		const result = prepareEncounterInitiativeHandoffV1(
			input,
			"2040-01-01T00:00:00.000Z",
		);

		expect(result.status).toBe("blocked");
		if (result.status !== "blocked") return;
		expect(result.blockers.map((issue) => issue.code)).toContain(
			"encounter-source-unresolved",
		);
		expect("state" in result).toBe(false);
	});

	it("restores new saved encounters through the restoration plan with full runtime state and quantities", () => {
		const input = workflowInput();
		const plan = buildEncounterWorkflowPlanV1(input);
		const restored = restoreSavedEncounterWorkflowV1({
			hunterLevel: input.hunterLevel,
			hunterCount: input.hunterCount,
			objectives: input.objectives,
			workflowPlan: plan,
		});

		expect(restored.mode).toBe("workflow");
		if (restored.mode !== "workflow") return;
		expect(restored.state).toMatchObject({
			name: input.name,
			hunterLevel: 8,
			hunterCount: 4,
			objectives: "Seal the breach before round five.",
			totalXP: 2700,
			difficulty: "hard",
		});
		expect(restored.state.roster).toHaveLength(2);
		expect(restored.state.roster[0]).toMatchObject({
			entryId: createEncounterWorkflowEntryId(canonical),
			quantity: 2,
			source: canonical,
			runtimeState: input.roster[0].runtimeState,
		});
		expect(restored.removeExpandedInstanceIds).toEqual(
			plan.expandedEntities.map((entry) => entry.entity.instanceId),
		);
	});

	it("keeps legacy saves on the party-and-objectives-only fallback", () => {
		const restored = restoreSavedEncounterWorkflowV1({
			hunterLevel: 3,
			hunterCount: 5,
			objectives: "Legacy objective",
		});

		expect(restored).toEqual({
			mode: "legacy",
			hunterLevel: 3,
			hunterCount: 5,
			objectives: "Legacy objective",
		});
		expect("state" in restored).toBe(false);
	});
});
