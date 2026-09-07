import { describe, expect, it } from "vitest";
import {
	buildEncounterHandoffPlanV1,
	buildEncounterRestorationPlanV1,
	type EncounterSnapshotInputV1,
	restoreEncounterSnapshotV1,
} from "@/lib/planning/encounterHandoffPlan";
import { resolveMechanicalReferenceV1 } from "@/lib/planning/references";

const campaignResolution = resolveMechanicalReferenceV1({
	kind: "campaign",
	explicitCandidate: {
		version: 1,
		kind: "campaign",
		id: "campaign-1",
		label: "Glassline",
		evidence: [],
	},
});

function localEncounter(): EncounterSnapshotInputV1 {
	return {
		location: { scope: "local", encounterId: "local-encounter-1" },
		name: "Rift Ambush",
		metadata: { initiativeMode: "grouped", customFlag: true },
		entries: [
			{
				entryId: "entry-hound",
				displayName: "Rift Hound",
				quantity: 2,
				entityKind: "canonical-anomaly",
				controller: {
					status: "resolved",
					controllerKind: "character",
					controllerId: "character-1",
					label: "Rin",
				},
				source: {
					status: "resolved",
					sourceType: "canonical",
					sourceId: "anomaly-rift-hound",
					label: "Rift Hound",
					evidence: [],
				},
				state: { hpCurrent: 12, conditions: ["marked"] },
				metadata: { side: "allies", customColor: "violet" },
			},
		],
	};
}

describe("encounter handoff planning", () => {
	it("expands quantities with stable controlled-entity provenance", () => {
		const input = localEncounter();
		const first = buildEncounterHandoffPlanV1({
			source: input,
			destination: {
				scope: "campaign",
				encounterId: "campaign-encounter-9",
				campaignReference: campaignResolution,
			},
		});
		const repeated = buildEncounterHandoffPlanV1({
			source: localEncounter(),
			destination: {
				scope: "campaign",
				encounterId: "campaign-encounter-9",
				campaignReference: campaignResolution,
			},
		});

		expect(first.canApply).toBe(true);
		expect(first.expandedEntities).toHaveLength(2);
		expect(
			first.expandedEntities.map((entry) => entry.entity.instanceId),
		).toEqual(
			repeated.expandedEntities.map((entry) => entry.entity.instanceId),
		);
		expect(
			first.expandedEntities.map(
				(entry) => entry.entity.provenance.quantityIndex,
			),
		).toEqual([0, 1]);
		expect(first.expandedEntities[0].entity).toMatchObject({
			kind: "canonical-anomaly",
			source: {
				status: "resolved",
				sourceId: "anomaly-rift-hound",
			},
			provenance: {
				originScope: "local",
				originId: "local-encounter-1",
				encounterEntryId: "entry-hound",
			},
		});
	});

	it("restores the complete source snapshot after a local/campaign handoff", () => {
		const handoff = buildEncounterHandoffPlanV1({
			source: localEncounter(),
			destination: {
				scope: "campaign",
				encounterId: "campaign-encounter-9",
				campaignReference: campaignResolution,
			},
		});
		const restoration = buildEncounterRestorationPlanV1(handoff);
		const restored = restoreEncounterSnapshotV1(restoration);

		expect(restored).toEqual(handoff.source);
		expect(restoration.removeFrom).toEqual(handoff.destination);
		expect(restored.metadata).toEqual({
			initiativeMode: "grouped",
			customFlag: true,
		});
		expect(restored.entries[0].state).toEqual({
			hpCurrent: 12,
			conditions: ["marked"],
		});
		expect(restoration.removeExpandedInstanceIds).toEqual(
			handoff.expandedEntities.map((entry) => entry.entity.instanceId),
		);
	});

	it("supports campaign-to-local handoff and reports unresolved provenance", () => {
		const local = localEncounter();
		const source: EncounterSnapshotInputV1 = {
			...local,
			location: {
				scope: "campaign",
				encounterId: "campaign-encounter-9",
				campaignReference: campaignResolution,
			},
			entries: [
				{
					...local.entries[0],
					controller: {
						status: "unresolved",
						controllerKind: "character",
						controllerId: null,
						requestedName: "Unknown handler",
						reason: "No character candidate was supplied",
					},
					source: {
						status: "unresolved",
						sourceType: "canonical",
						sourceId: null,
						requestedName: "Rift Hound",
						reason: "No canonical candidate was supplied",
						evidence: [],
					},
				},
			],
		};
		const plan = buildEncounterHandoffPlanV1({
			source,
			destination: { scope: "local", encounterId: "local-restored" },
		});

		expect(plan.destination.scope).toBe("local");
		expect(plan.canApply).toBe(false);
		expect(plan.issues.map((issue) => issue.code)).toEqual(
			expect.arrayContaining([
				"encounter-controller-unresolved",
				"encounter-source-unresolved",
			]),
		);
		expect(plan.expandedEntities[0].entity.source).toMatchObject({
			status: "unresolved",
			sourceId: null,
		});
	});
});

describe("campaign-scoped controlled provenance", () => {
	it("does not collide when distinct campaigns reuse encounter and entry IDs", () => {
		const secondCampaign = resolveMechanicalReferenceV1({
			kind: "campaign",
			explicitCandidate: {
				version: 1,
				kind: "campaign",
				id: "campaign-2",
				label: "Other Glassline",
				evidence: [],
			},
		});
		const local = localEncounter();
		const sourceFor = (
			campaignReference: typeof campaignResolution,
		): EncounterSnapshotInputV1 => ({
			...local,
			location: {
				scope: "campaign",
				encounterId: "shared-encounter-id",
				campaignReference,
			},
		});
		const first = buildEncounterHandoffPlanV1({
			source: sourceFor(campaignResolution),
			destination: { scope: "local", encounterId: "local-a" },
		});
		const second = buildEncounterHandoffPlanV1({
			source: sourceFor(secondCampaign),
			destination: { scope: "local", encounterId: "local-a" },
		});

		expect(first.expandedEntities[0].entity.instanceId).not.toBe(
			second.expandedEntities[0].entity.instanceId,
		);
		expect(first.expandedEntities[0].entity.provenance.campaignId).toBe(
			"campaign-1",
		);
		expect(second.expandedEntities[0].entity.provenance.campaignId).toBe(
			"campaign-2",
		);

		const toFirstCampaign = buildEncounterHandoffPlanV1({
			source: localEncounter(),
			destination: {
				scope: "campaign",
				encounterId: "shared-destination",
				campaignReference: campaignResolution,
			},
		});
		const toSecondCampaign = buildEncounterHandoffPlanV1({
			source: localEncounter(),
			destination: {
				scope: "campaign",
				encounterId: "shared-destination",
				campaignReference: secondCampaign,
			},
		});
		expect(toFirstCampaign.expandedEntities[0].entity.instanceId).not.toBe(
			toSecondCampaign.expandedEntities[0].entity.instanceId,
		);
		expect(
			toFirstCampaign.expandedEntities[0].entity.provenance.stableKey,
		).toBe(toSecondCampaign.expandedEntities[0].entity.provenance.stableKey);
	});
});
