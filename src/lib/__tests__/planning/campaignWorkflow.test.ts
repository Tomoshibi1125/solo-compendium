import { describe, expect, it, vi } from "vitest";
import {
	buildCampaignWorkflowRpcPreflightV1,
	buildCraftingMutationPlanV1,
	CampaignWorkflowBlockedError,
	CraftingWorkflowBlockedError,
	executeCampaignWorkflowRpcV1,
	executeCraftingMutationV1,
} from "@/lib/planning/adapters/campaignWorkflow";
import type {
	MechanicalReference,
	SerializableRecord,
} from "@/lib/planning/contracts";

const noCompensationNeeded = {
	kind: "not-required",
	reason: "This test boundary performs one direct write.",
} as const;

function materialValue(quantity: number): SerializableRecord {
	return {
		character_id: "character-1",
		material_id: "material-iron",
		quantity,
	};
}

function actionableCraftingPlan() {
	return buildCraftingMutationPlanV1({
		characterId: "character-1",
		recordKey: "material:material-iron",
		referenceType: "material",
		referenceId: "material-iron",
		current: materialValue(2),
		desired: materialValue(3),
		sourceOwnership: { kind: "stored-scope" },
		compensation: noCompensationNeeded,
	});
}

describe("campaign workflow RPC preflight", () => {
	it("is deterministic and keeps display labels out of identity", () => {
		const first = buildCampaignWorkflowRpcPreflightV1({
			operation: "complete-quest",
			campaignId: "campaign-1",
			campaignLabel: "Old campaign display name",
			questId: "quest-1",
			questLabel: "Old quest display name",
		});
		const repeated = buildCampaignWorkflowRpcPreflightV1({
			operation: "complete-quest",
			campaignId: "campaign-1",
			campaignLabel: "Old campaign display name",
			questId: "quest-1",
			questLabel: "Old quest display name",
		});
		const renamed = buildCampaignWorkflowRpcPreflightV1({
			operation: "complete-quest",
			campaignId: "campaign-1",
			campaignLabel: "Renamed campaign",
			questId: "quest-1",
			questLabel: "Renamed quest",
		});

		expect(repeated).toEqual(first);
		expect(renamed.planId).toBe(first.planId);
		expect(renamed.operation.operationId).toBe(first.operation.operationId);
		expect(renamed.references.campaign).toMatchObject({
			id: "campaign-1",
			label: "Renamed campaign",
		});
		expect(renamed.references.quest).toMatchObject({
			id: "quest-1",
			label: "Renamed quest",
		});
	});

	it("resolves IDs only and fails closed for unresolved or ambiguous official references", () => {
		const labelOnly = buildCampaignWorkflowRpcPreflightV1({
			operation: "deploy-campaign-encounter",
			campaignId: "",
			campaignLabel: "A display label is not an ID",
			encounterId: "encounter-1",
		});
		expect(labelOnly.canInvoke).toBe(false);
		expect(labelOnly.references.campaign).toBeNull();
		expect(labelOnly.blockers[0]?.code).toBe("reference-id-empty");

		const canonicalA: MechanicalReference = {
			version: 1,
			kind: "canonical",
			id: "item-a",
			label: "Official Relic",
			evidence: [],
			canonicalType: "item",
			collection: "core",
			sourceBook: "Core",
		};
		const canonicalB: MechanicalReference = {
			...canonicalA,
			id: "item-b",
		};
		const unresolved = buildCampaignWorkflowRpcPreflightV1({
			operation: "create-quest",
			campaignId: "campaign-1",
			officialReferences: [
				{
					requestKey: "reward-item",
					kind: "canonical",
					requestedName: "Official Relic",
				},
			],
		});
		const ambiguous = buildCampaignWorkflowRpcPreflightV1({
			operation: "create-quest",
			campaignId: "campaign-1",
			officialReferences: [
				{
					requestKey: "reward-item",
					kind: "canonical",
					requestedName: "Official Relic",
					candidates: [canonicalB, canonicalA],
				},
			],
		});

		expect(unresolved.canInvoke).toBe(false);
		expect(unresolved.blockers[0]).toMatchObject({
			code: "reference-explicit-candidate-required",
			severity: "manual",
		});
		expect(ambiguous.canInvoke).toBe(false);
		expect(ambiguous.blockers[0]).toMatchObject({
			code: "reference-ambiguous",
			severity: "manual",
		});
	});

	it("invokes one RPC only after preflight and creates its receipt after success", async () => {
		const preflight = buildCampaignWorkflowRpcPreflightV1({
			operation: "deploy-campaign-encounter",
			campaignId: "campaign-1",
			encounterId: "encounter-1",
		});
		const invokeRpc = vi.fn(async () => "combat-session-1");

		const execution = await executeCampaignWorkflowRpcV1(preflight, invokeRpc);

		expect(invokeRpc).toHaveBeenCalledTimes(1);
		expect(execution.result).toBe("combat-session-1");
		expect(execution.receipt).toMatchObject({
			boundary: "single-rpc",
			rpcName: "deploy_campaign_encounter",
			outcome: "applied",
			planId: preflight.planId,
		});

		const blocked = buildCampaignWorkflowRpcPreflightV1({
			operation: "complete-quest",
			campaignId: "campaign-1",
			questId: "",
		});
		const blockedRpc = vi.fn(async () => undefined);
		await expect(
			executeCampaignWorkflowRpcV1(blocked, blockedRpc),
		).rejects.toBeInstanceOf(CampaignWorkflowBlockedError);
		expect(blockedRpc).not.toHaveBeenCalled();
	});
});

describe("crafting mutation planning", () => {
	it("rejects stale expected-before state before the direct write", async () => {
		const plan = actionableCraftingPlan();
		const write = vi.fn(async () => ({ quantity: 3 }));

		await expect(
			executeCraftingMutationV1(plan, materialValue(9), write),
		).rejects.toBeInstanceOf(CraftingWorkflowBlockedError);
		expect(write).not.toHaveBeenCalled();
	});

	it("marks direct writes non-atomic and retains a receipt only after success", async () => {
		const plan = actionableCraftingPlan();
		const write = vi.fn(async () => ({ quantity: 3 }));

		const execution = await executeCraftingMutationV1(
			plan,
			materialValue(2),
			write,
		);

		expect(write).toHaveBeenCalledTimes(1);
		expect(plan).toMatchObject({
			writeBoundary: "client-checked-direct-write",
			databaseAtomicity: "not-claimed",
		});
		expect(execution.receipt).toMatchObject({
			boundary: "client-checked-direct-write",
			databaseAtomic: false,
			outcome: "applied",
		});
	});

	it("emits explicit manual blockers when ownership or compensation is unproven", async () => {
		const plan = buildCraftingMutationPlanV1({
			characterId: "character-1",
			recordKey: "material:material-iron",
			referenceType: "material",
			referenceId: "material-iron",
			current: materialValue(2),
			desired: materialValue(3),
			sourceOwnership: {
				kind: "unproven",
				reason: "No stored source key is available.",
			},
			compensation: {
				kind: "unproven",
				reason: "The mutation would require a second compensating write.",
			},
		});
		const write = vi.fn(async () => undefined);

		expect(plan.canApply).toBe(false);
		expect(plan.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					code: "crafting-source-ownership-unproven",
					severity: "manual",
				}),
				expect.objectContaining({
					code: "crafting-compensation-unproven",
					severity: "manual",
				}),
			]),
		);
		await expect(
			executeCraftingMutationV1(plan, materialValue(2), write),
		).rejects.toBeInstanceOf(CraftingWorkflowBlockedError);
		expect(write).not.toHaveBeenCalled();
	});
});
