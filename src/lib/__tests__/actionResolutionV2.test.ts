import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	type ActionResolutionPayload,
	type ActionResolutionPayloadV2,
	getPendingResolution,
	normalizeActionResolutionPayload,
	resolveAction,
	resolveAttack,
	setPendingResolution,
	validateActionResolutionPayload,
} from "@/lib/actionResolution";

const storageKey = "solo-compendium.pending-resolution.v1";

function typedPayload(
	overrides: Partial<ActionResolutionPayloadV2> = {},
): ActionResolutionPayloadV2 {
	return {
		version: 2,
		id: "action-1",
		name: "Binding Bolt",
		source: { type: "spell", entryId: "spell-1" },
		kind: "attack",
		actor: { id: "actor-1", name: "Caster" },
		targets: [{ id: "target-1", name: "Target" }],
		actionEconomy: { type: "action", cost: 1 },
		resourceCosts: [],
		conditionIntents: [],
		duration: null,
		concentration: null,
		saveSuccessDamagePolicy: "none",
		mitigationMode: "typed",
		applicationGate: "always",
		automationState: "automated",
		attack: { roll: "1d20+5" },
		damage: { roll: "1d1+9", type: "fire" },
		...overrides,
	};
}

function restrainedIntent(gate: ActionResolutionPayloadV2["applicationGate"]) {
	return {
		conditionId: "restrained",
		gate,
		duration: {
			unit: "round" as const,
			anchor: "round" as const,
			value: 2,
			remaining: 2,
		},
		stackingPolicy: "refresh" as const,
		restPolicy: "remove-on-long-rest" as const,
		automationState: "automated" as const,
	};
}

describe("ActionResolutionPayload v1/v2 storage", () => {
	beforeEach(() => sessionStorage.clear());
	afterEach(() => vi.restoreAllMocks());

	it("keeps valid v1 storage readable and migrates legacy conditions visibly", () => {
		const v1: ActionResolutionPayload = {
			version: 1,
			id: "legacy",
			name: "Legacy Strike",
			source: { type: "item", entryId: "weapon-1" },
			kind: "attack",
			attack: { roll: "1d20+3" },
			appliesConditions: ["Prone"],
		};
		setPendingResolution(v1);
		expect(getPendingResolution()).toEqual(v1);

		const migrated = normalizeActionResolutionPayload(v1);
		expect(migrated).toMatchObject({ version: 2, legacy: true });
		expect(migrated?.conditionIntents[0]).toMatchObject({
			conditionId: "prone",
			gate: "always",
			legacy: true,
			automationState: "manual",
			duration: { unit: "manual", value: null, remaining: null },
		});
	});

	it("round-trips valid v2 and rejects malformed stored payloads", () => {
		const v2 = typedPayload();
		setPendingResolution(v2);
		expect(getPendingResolution()).toEqual(v2);
		expect(validateActionResolutionPayload(v2).valid).toBe(true);

		sessionStorage.setItem(
			storageKey,
			JSON.stringify({ version: 1, id: "missing-everything" }),
		);
		expect(getPendingResolution()).toBeNull();
		sessionStorage.setItem(storageKey, "{not-json");
		expect(getPendingResolution()).toBeNull();
	});

	it("rejects malformed nested condition source, save, and duration metadata", () => {
		const intent = restrainedIntent("always");
		const malformedSource = typedPayload({
			conditionIntents: [
				{
					...intent,
					source: {
						type: "spell",
						id: "spell-1",
						name: "Binding Bolt",
						actorId: 42,
					} as never,
				},
			],
		});
		const malformedSave = typedPayload({
			conditionIntents: [
				{
					...intent,
					save: {
						ability: "agility",
						dc: 14,
						endsOnSuccess: true,
						repeat: { enabled: true, anchor: "turn-middle" },
					} as never,
				},
			],
		});
		const incoherentDuration = typedPayload({
			conditionIntents: [
				{
					...intent,
					duration: {
						unit: "round",
						anchor: "turn-end",
						value: 2,
						remaining: 2,
					} as never,
				},
			],
		});

		const blankIntentConcentration = typedPayload({
			conditionIntents: [{ ...intent, concentrationId: " " }],
		});
		const paddedIntentConcentration = typedPayload({
			conditionIntents: [{ ...intent, concentrationId: " spell-1 " }],
		});
		const blankActionConcentration = typedPayload({
			concentration: {
				required: true,
				concentrationId: "",
				breakExisting: true,
			},
		});
		const paddedActionConcentration = typedPayload({
			concentration: {
				required: true,
				concentrationId: " spell-1 ",
				breakExisting: true,
			},
		});

		for (const malformed of [
			malformedSource,
			malformedSave,
			incoherentDuration,
			blankIntentConcentration,
			paddedIntentConcentration,
			blankActionConcentration,
			paddedActionConcentration,
		]) {
			expect(validateActionResolutionPayload(malformed).valid).toBe(false);
		}
		sessionStorage.setItem(
			storageKey,
			JSON.stringify(blankActionConcentration),
		);
		expect(getPendingResolution()).toBeNull();
	});
});

describe("resolveAction orchestration", () => {
	afterEach(() => vi.restoreAllMocks());

	it("makes a natural 1 miss a standard attack despite a high modifier", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const outcome = resolveAttack(
			{
				version: 1,
				id: "nat-1",
				name: "Certain Hit",
				source: { type: "item", entryId: "weapon" },
				kind: "attack",
				attack: { roll: "1d20+99" },
			},
			1,
		);
		expect(outcome).toMatchObject({
			kind: "attack",
			attackRoll: 1,
			hit: false,
		});
	});

	it("cancels target-provided advantage/disadvantage and gates on-hit conditions on a miss", () => {
		vi.spyOn(Math, "random").mockReturnValue(0);
		const result = resolveAction(
			typedPayload({
				attack: { roll: "1d20" },
				conditionIntents: [restrainedIntent("on-hit")],
			}),
			{
				target: {
					id: "target-1",
					armorClass: 30,
					conditions: ["Blinded", "Invisible"],
				},
			},
		);
		expect(result.preview.attackMode).toBe("normal");
		expect(result.outcome).toMatchObject({ kind: "attack", hit: false });
		expect(result.application.conditions[0].status).toBe("skipped-gate");
		expect(
			result.stateChangeIntents.some((intent) => intent.type === "condition"),
		).toBe(false);
	});

	it("applies half-on-success before canonical typed mitigation", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.95);
		const result = resolveAction(
			typedPayload({
				kind: "save",
				attack: undefined,
				save: { dc: 10, ability: "agility", roll: "1d20" },
				saveSuccessDamagePolicy: "half",
			}),
			{
				target: {
					id: "target-1",
					hitPoints: 20,
					damageResistances: ["fire damage"],
				},
			},
		);
		expect(result.outcome).toMatchObject({ kind: "save", success: true });
		// 10 rolled -> 5 on successful save -> 2 after resistance (round down).
		expect(result.application.damage?.finalDamage).toBe(2);
		expect(result.stateChangeIntents).toContainEqual(
			expect.objectContaining({
				type: "hit-points",
				delta: -2,
				expectedBefore: 20,
				after: 18,
			}),
		);
	});

	it("auto-fails authored saves and applies only failed-save conditions", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.95);
		const result = resolveAction(
			typedPayload({
				kind: "save",
				attack: undefined,
				save: { dc: 2, ability: "AGI", roll: "1d20+10" },
				conditionIntents: [restrainedIntent("on-failed-save")],
			}),
			{
				target: {
					id: "target-1",
					conditions: ["Paralyzed"],
					conditionImmunities: [],
				},
			},
		);
		expect(result.preview.saveAutoFail).toBe(true);
		expect(result.outcome).toMatchObject({ kind: "save", success: false });
		const conditionIntent = result.stateChangeIntents.find(
			(intent) => intent.type === "condition",
		);
		expect(conditionIntent).toMatchObject({
			type: "condition",
			targetId: "target-1",
			application: {
				conditionId: "restrained",
				source: {
					type: "spell",
					id: "spell-1",
					name: "Binding Bolt",
					actorId: "actor-1",
				},
			},
		});
	});

	it("honors condition immunity and consumes temporary HP before HP", () => {
		vi.spyOn(Math, "random").mockReturnValue(0.5);
		const immune = resolveAction(
			typedPayload({ conditionIntents: [restrainedIntent("on-hit")] }),
			{
				target: {
					id: "target-1",
					armorClass: 1,
					hitPoints: 20,
					temporaryHitPoints: 4,
					conditionImmunities: ["Restrained"],
				},
			},
		);
		expect(immune.application.conditions[0].status).toBe("immune");
		expect(
			immune.stateChangeIntents.filter(
				(intent) => intent.type === "temporary-hit-points",
			),
		).toContainEqual(
			expect.objectContaining({ delta: -4, expectedBefore: 4, after: 0 }),
		);
		expect(immune.stateChangeIntents).toContainEqual(
			expect.objectContaining({ type: "hit-points", delta: -6, after: 14 }),
		);
	});
});

describe("resolver application ordering and blockers", () => {
	it("blocks a missing resource balance without emitting a debit intent", () => {
		const result = resolveAction(
			typedPayload({
				kind: "effect",
				attack: undefined,
				damage: undefined,
				resourceCosts: [{ resourceId: "mana", amount: 1 }],
			}),
			{
				actor: { id: "actor-1" },
				target: { id: "target-1" },
			},
		);

		expect(result.application.blockers).toContain(
			"Current balance for mana is required.",
		);
		expect(
			result.stateChangeIntents.some(
				(intent) => intent.type === "resource-cost",
			),
		).toBe(false);
	});

	it("orders same-key concentration cleanup before the replacement condition", () => {
		const result = resolveAction(
			typedPayload({
				kind: "effect",
				attack: undefined,
				damage: undefined,
				conditionIntents: [
					{
						...restrainedIntent("always"),
						duration: {
							unit: "concentration",
							anchor: "concentration",
							value: null,
							remaining: null,
						},
						concentrationId: "spell-1",
					},
				],
				concentration: {
					required: true,
					concentrationId: "spell-1",
					breakExisting: true,
				},
			}),
			{
				actor: { id: "actor-1", concentrationId: "spell-1" },
				target: { id: "target-1" },
			},
		);
		const concentrationIndex = result.stateChangeIntents.findIndex(
			(intent) => intent.type === "concentration",
		);
		const conditionIndex = result.stateChangeIntents.findIndex(
			(intent) => intent.type === "condition",
		);
		expect(concentrationIndex).toBeGreaterThanOrEqual(0);
		expect(concentrationIndex).toBeLessThan(conditionIndex);
		expect(result.stateChangeIntents[concentrationIndex]).toMatchObject({
			type: "concentration",
			operation: "replace",
			concentrationId: "spell-1",
			previousConcentrationId: "spell-1",
		});
	});

	it("uses one canonical fallback identity for concentration state and effects", () => {
		const result = resolveAction(
			typedPayload({
				id: " action-1 ",
				kind: "effect",
				attack: undefined,
				damage: undefined,
				conditionIntents: [
					{
						...restrainedIntent("always"),
						duration: {
							unit: "concentration",
							anchor: "concentration",
							value: null,
							remaining: null,
						},
					},
				],
				concentration: {
					required: true,
					concentrationId: null,
					breakExisting: true,
				},
			}),
			{
				actor: { id: "actor-1" },
				target: { id: "target-1" },
			},
		);
		const concentration = result.stateChangeIntents.find(
			(intent) => intent.type === "concentration",
		);
		const condition = result.stateChangeIntents.find(
			(intent) => intent.type === "condition",
		);
		expect(concentration).toMatchObject({ concentrationId: "action-1" });
		expect(condition).toMatchObject({
			application: { concentrationId: "action-1" },
		});
	});
});

describe("InitiativeTracker action consumer boundary", () => {
	it("checks blockers before mutations and cleans replaced concentration effects", () => {
		const trackerSource = readFileSync(
			resolve(
				__dirname,
				"../../../src/pages/warden-directives/InitiativeTracker.tsx",
			),
			"utf8",
		);
		const applyStart = trackerSource.indexOf(
			"const applyResolutionToTarget = () => {",
		);
		const applyEnd = trackerSource.indexOf("\n\treturn (", applyStart);
		const applyBody = trackerSource.slice(applyStart, applyEnd);
		const blockerCheck = applyBody.indexOf(
			"if (resolved.application.blockers.length > 0)",
		);
		expect(blockerCheck).toBeGreaterThan(-1);
		for (const mutation of [
			"setPendingResolution(pending);",
			"setResolutionOutcome(",
			"logEvent(",
			"resolved.stateChangeIntents.forEach(applyIntent);",
		]) {
			expect(applyBody.indexOf(mutation)).toBeGreaterThan(blockerCheck);
		}
		const blockerReturn = applyBody.indexOf("return;", blockerCheck);
		expect(blockerReturn).toBeGreaterThan(blockerCheck);
		expect(blockerReturn).toBeLessThan(
			applyBody.indexOf("setPendingResolution(pending);"),
		);

		const concentrationStart = trackerSource.indexOf(
			"const setCombatantConcentration = (",
		);
		const concentrationEnd = trackerSource.indexOf(
			"\n\tconst addCondition = (",
			concentrationStart,
		);
		const concentrationBody = trackerSource.slice(
			concentrationStart,
			concentrationEnd,
		);
		expect(concentrationBody).toContain("breakConcentration(");
		expect(concentrationBody.indexOf("breakConcentration(")).toBeLessThan(
			concentrationBody.indexOf("concentrationId: isConcentratingActor"),
		);
	});
});
