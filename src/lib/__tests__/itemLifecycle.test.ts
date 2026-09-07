import { describe, expect, it } from "vitest";
import { MAX_ATTUNEMENT_SLOTS } from "@/lib/attunementRules";
import {
	type ItemLifecycleCompatibilityDecisionV1,
	type ItemLifecycleEquipmentRow,
	type ItemLifecycleSourceInput,
	planItemLifecycle,
} from "@/lib/itemLifecycle";

const source = (
	sourceType: string,
	sourceId: string | null,
): ItemLifecycleSourceInput => ({
	kind: "canonical",
	sourceType,
	sourceId,
	sourceVersion: 1,
});

const equipment = (
	overrides: Partial<ItemLifecycleEquipmentRow> = {},
): ItemLifecycleEquipmentRow => ({
	id: overrides.id ?? "equipment-row-1",
	item_id: overrides.item_id ?? "canonical-item-1",
	item_type: overrides.item_type ?? "gear",
	name: overrides.name ?? "Test Aether Gear",
	is_equipped: overrides.is_equipped ?? false,
	is_attuned: overrides.is_attuned ?? false,
	requires_attunement: overrides.requires_attunement ?? true,
	charges_current: Object.hasOwn(overrides, "charges_current")
		? (overrides.charges_current ?? null)
		: 3,
	charges_max: Object.hasOwn(overrides, "charges_max")
		? (overrides.charges_max ?? null)
		: 5,
	sigil_slots_base: overrides.sigil_slots_base ?? 0,
});

const compatible = (
	compatibleValue = true,
): ItemLifecycleCompatibilityDecisionV1 => ({
	status: "automated",
	compatible: compatibleValue,
	reason: compatibleValue
		? "The authored compatibility rule allows this target."
		: "The authored compatibility rule rejects this target.",
	source: source("compatibility-rule", "rule:item-compatibility:v1"),
});

describe("item lifecycle plan v1", () => {
	it("plans equip/unequip transitions with stable optimistic operations", () => {
		const input = {
			source: source("compendium-item", "canonical-item-1"),
			equipment: equipment(),
			action: { kind: "equip" as const },
		};
		const first = planItemLifecycle(input);
		const second = planItemLifecycle(input);

		expect(first).toMatchObject({
			version: 1,
			status: "automated",
			outcome: "ready",
			canApply: true,
			action: "equip",
			target: { kind: "equipment", targetId: "equipment-row-1" },
			sourceIds: ["canonical-item-1"],
			issues: [],
		});
		expect(first.operations).toHaveLength(1);
		expect(first.operations[0]).toMatchObject({
			kind: "equipment-update",
			action: "equip",
			expectedBefore: { field: "is_equipped", value: false },
			after: { field: "is_equipped", value: true },
		});
		expect(second.planId).toBe(first.planId);
		expect(second.operations[0]?.operationId).toBe(
			first.operations[0]?.operationId,
		);

		expect(
			planItemLifecycle({
				...input,
				equipment: equipment({ is_equipped: true }),
				action: { kind: "unequip" },
			}),
		).toMatchObject({
			status: "automated",
			outcome: "ready",
			operations: [
				{
					expectedBefore: { field: "is_equipped", value: true },
					after: { field: "is_equipped", value: false },
				},
			],
		});
	});

	it("keeps plan and operation identities stable across display-only renames", () => {
		const beforeRename = planItemLifecycle({
			source: source("compendium-item", "canonical-item-1"),
			equipment: equipment({ name: "Original Display Name" }),
			action: { kind: "equip" },
		});
		const afterRename = planItemLifecycle({
			source: source("compendium-item", "canonical-item-1"),
			equipment: equipment({ name: "Renamed Display Label" }),
			action: { kind: "equip" },
		});
		expect(afterRename.planId).toBe(beforeRename.planId);
		expect(afterRename.operations[0]?.operationId).toBe(
			beforeRename.operations[0]?.operationId,
		);

		const compatibilityPlan = (label: string) =>
			planItemLifecycle({
				source: source("character-equipment", "equipment-row-1"),
				target: { kind: "rune", targetId: "rune-target-1", label },
				action: {
					kind: "check-compatibility",
					compatibilityKind: "rune",
					candidate: source("compendium-rune", "rune-1"),
					decision: compatible(),
				},
			});
		expect(compatibilityPlan("Renamed Rune").planId).toBe(
			compatibilityPlan("Original Rune").planId,
		);
	});

	it("uses the existing attunement rules and treats satisfied state as a no-op", () => {
		const base = {
			source: source("compendium-item", "canonical-item-1"),
			equipment: equipment(),
		};
		expect(
			planItemLifecycle({
				...base,
				action: { kind: "attune", currentAttunedCount: 1 },
			}),
		).toMatchObject({
			status: "automated",
			outcome: "ready",
			operations: [
				{
					expectedBefore: { field: "is_attuned", value: false },
					after: { field: "is_attuned", value: true },
					guards: [
						{
							kind: "equipment-field-equals",
							field: "requires_attunement",
							value: true,
						},
						{
							kind: "attuned-count-equals",
							value: 1,
							maximum: MAX_ATTUNEMENT_SLOTS,
						},
					],
				},
			],
		});

		const atLimit = planItemLifecycle({
			...base,
			action: {
				kind: "attune",
				currentAttunedCount: MAX_ATTUNEMENT_SLOTS,
			},
		});
		expect(atLimit).toMatchObject({
			status: "manual",
			outcome: "blocked",
			canApply: false,
			operations: [],
			issues: [{ code: "item-lifecycle-attunement-rejected" }],
		});

		expect(
			planItemLifecycle({
				...base,
				equipment: equipment({ is_attuned: true }),
				action: { kind: "attune", currentAttunedCount: 1 },
			}),
		).toMatchObject({ status: "automated", outcome: "noop", operations: [] });

		expect(
			planItemLifecycle({
				...base,
				equipment: equipment({ is_attuned: true }),
				action: { kind: "unattune" },
			}),
		).toMatchObject({
			status: "automated",
			outcome: "ready",
			operations: [
				{
					expectedBefore: { field: "is_attuned", value: true },
					after: { field: "is_attuned", value: false },
				},
			],
		});
	});

	it("changes only explicit, bounded charge ledgers", () => {
		const base = {
			source: source("compendium-item", "charged-item-1"),
			equipment: equipment({
				item_id: "charged-item-1",
				charges_current: 3,
				charges_max: 5,
			}),
		};
		expect(
			planItemLifecycle({
				...base,
				action: { kind: "set-charges", chargesCurrent: 2 },
			}),
		).toMatchObject({
			status: "automated",
			outcome: "ready",
			operations: [
				{
					expectedBefore: { field: "charges_current", value: 3 },
					after: { field: "charges_current", value: 2 },
					guards: [
						{
							kind: "equipment-field-equals",
							field: "charges_max",
							value: 5,
						},
					],
				},
			],
		});

		expect(
			planItemLifecycle({
				...base,
				action: { kind: "set-charges", chargesCurrent: 6 },
			}),
		).toMatchObject({
			status: "manual",
			outcome: "blocked",
			operations: [],
			issues: [{ code: "item-lifecycle-charge-target-invalid" }],
		});

		expect(
			planItemLifecycle({
				...base,
				equipment: equipment({ charges_current: null, charges_max: 5 }),
				action: { kind: "set-charges", chargesCurrent: 5 },
			}),
		).toMatchObject({
			status: "manual",
			issues: [{ code: "item-lifecycle-charge-state-invalid" }],
		});
	});

	it("requires source-backed compatibility before changing socket capacity", () => {
		const plan = planItemLifecycle({
			source: source("compendium-item", "socket-item-1"),
			equipment: equipment({ item_id: "socket-item-1" }),
			action: {
				kind: "set-sockets",
				sigilSlotsBase: 1,
				compatibility: compatible(),
			},
		});
		expect(plan).toMatchObject({
			status: "automated",
			outcome: "ready",
			compatibility: {
				kind: "socket",
				status: "automated",
				compatible: true,
				decisionSourceId: "rule:item-compatibility:v1",
			},
			operations: [
				{
					expectedBefore: { field: "sigil_slots_base", value: 0 },
					after: { field: "sigil_slots_base", value: 1 },
				},
			],
		});

		const rejected = planItemLifecycle({
			source: source("compendium-item", "socket-item-1"),
			equipment: equipment({ item_id: "socket-item-1" }),
			action: {
				kind: "set-sockets",
				sigilSlotsBase: 1,
				compatibility: compatible(false),
			},
		});
		expect(rejected).toMatchObject({
			status: "automated",
			outcome: "incompatible",
			canApply: false,
			operations: [],
		});
	});

	it.each([
		"socket",
		"inscription",
		"tattoo",
		"rune",
	] as const)("represents explicit %s compatibility without inferring from names", (compatibilityKind) => {
		const plan = planItemLifecycle({
			source: source("character-equipment", "equipment-row-1"),
			target: {
				kind: compatibilityKind,
				targetId: `target:${compatibilityKind}:1`,
				label: `Display-only ${compatibilityKind}`,
			},
			action: {
				kind: "check-compatibility",
				compatibilityKind,
				candidate: source(
					`${compatibilityKind}-candidate`,
					`candidate:${compatibilityKind}:1`,
				),
				decision: compatible(),
			},
		});

		expect(plan).toMatchObject({
			version: 1,
			status: "automated",
			outcome: "noop",
			operations: [],
			compatibility: {
				kind: compatibilityKind,
				status: "automated",
				compatible: true,
				candidateSourceId: `candidate:${compatibilityKind}:1`,
			},
		});
		expect(plan.sourceIds).toEqual(
			[
				`candidate:${compatibilityKind}:1`,
				"equipment-row-1",
				"rule:item-compatibility:v1",
			].sort(),
		);
	});

	it("keeps Aetheric Infusion review-blocked without creating item rules", () => {
		const plan = planItemLifecycle({
			source: source(
				"path-feature",
				"technomancer--aether-chemist-design:aetheric-infusion",
			),
			target: {
				kind: "inscription",
				targetId: "unresolved-infusion-lifecycle",
				label: "Aetheric Infusion",
			},
			action: {
				kind: "check-compatibility",
				compatibilityKind: "inscription",
				candidate: source("unresolved-item", null),
				decision: compatible(),
			},
			resolution: {
				status: "review-blocked",
				reason:
					"Infusion identities, recipes, durations, targets, and prepared choices are unresolved.",
				reviewBlockerId:
					"task6:technomancer-aether-chemist:infusion-identities",
			},
		});

		expect(plan).toMatchObject({
			status: "review-blocked",
			outcome: "blocked",
			operations: [],
			reviewBlockerId: "task6:technomancer-aether-chemist:infusion-identities",
			issues: [
				{
					severity: "review-blocked",
					reviewBlockerId:
						"task6:technomancer-aether-chemist:infusion-identities",
				},
			],
		});
	});

	it("keeps Spell Capacitor lifecycle manual instead of assigning device charges", () => {
		const plan = planItemLifecycle({
			source: source("job-feature", "technomancer:spell-capacitor"),
			equipment: equipment({
				id: "proposed-capacitor-device",
				item_id: null,
				name: "Proposed Spell Capacitor",
			}),
			action: { kind: "set-charges", chargesCurrent: 2 },
			resolution: {
				status: "manual",
				reason:
					"Device count, replacement, attunement, destruction, and charge ownership are unresolved.",
				instructions: "Await authored device lifecycle rules.",
			},
		});

		expect(plan).toMatchObject({
			status: "manual",
			outcome: "blocked",
			canApply: false,
			operations: [],
			manual: { instructions: "Await authored device lifecycle rules." },
		});
	});

	it("blocks automated compatibility when candidate or rule IDs are absent", () => {
		const missingCandidate = planItemLifecycle({
			source: source("character-equipment", "equipment-row-1"),
			target: { kind: "rune", targetId: "rune-target", label: null },
			action: {
				kind: "check-compatibility",
				compatibilityKind: "rune",
				candidate: source("compendium-rune", null),
				decision: compatible(),
			},
		});
		expect(missingCandidate).toMatchObject({
			status: "manual",
			outcome: "blocked",
			operations: [],
			issues: [{ code: "item-lifecycle-candidate-source-id-missing" }],
		});

		const missingRule = planItemLifecycle({
			source: source("character-equipment", "equipment-row-1"),
			target: { kind: "tattoo", targetId: "tattoo-target", label: null },
			action: {
				kind: "check-compatibility",
				compatibilityKind: "tattoo",
				candidate: source("compendium-tattoo", "tattoo-1"),
				decision: {
					status: "automated",
					compatible: true,
					reason: "Claimed compatible without identified rules.",
					source: source("compatibility-rule", null),
				},
			},
		});
		expect(missingRule).toMatchObject({
			status: "manual",
			issues: [{ code: "item-lifecycle-compatibility-source-id-missing" }],
		});
	});
});
