import { describe, expect, it } from "vitest";
import {
	evaluateMountEligibility,
	mergeCompanionTurnEntries,
	readCompanionCombatProfile,
	readCompanionMountProfile,
	readCompanionRestRule,
	resolveTurnOrder,
} from "@/lib/companionCombat";

describe("C3 companion combat rules", () => {
	it("uses one deterministic turn-order resolver for initiative ties", () => {
		const rows = resolveTurnOrder([
			{ id: "z", initiative: 12, created_at: "2026-01-01T00:00:02Z" },
			{ id: "a", initiative: 18, created_at: "2026-01-01T00:00:03Z" },
			{ id: "b", initiative: 18, created_at: "2026-01-01T00:00:01Z" },
		]);
		expect(rows.map((row) => row.id)).toEqual(["b", "a", "z"]);
	});

	it("dedupes a repeated combat handoff by living instance id, never name/source", () => {
		const merged = mergeCompanionTurnEntries(
			[
				{ id: "actor-1", initiative: 10, companion_instance_id: "instance-1" },
				{ id: "actor-2", initiative: 8, companion_instance_id: "instance-2" },
			],
			[
				{
					id: "actor-1-new",
					initiative: 14,
					companion_instance_id: "instance-1",
				},
				{ id: "actor-3", initiative: 7, companion_instance_id: "instance-3" },
			],
		);
		expect(merged).toHaveLength(3);
		expect(
			merged.find((row) => row.companion_instance_id === "instance-1"),
		).toMatchObject({
			id: "actor-1-new",
			initiative: 14,
		});
	});

	it("defaults reactions to a separate pool unless a profile explicitly shares the rider pool", () => {
		expect(readCompanionCombatProfile({})).toMatchObject({
			reactionPool: "separate",
			progressionMode: null,
		});
		expect(
			readCompanionCombatProfile({
				combat: {
					reactionPool: "shared-rider",
					actionEconomy: { actions: 1, reactions: 1 },
				},
				progression: { mode: "milestone" },
			}),
		).toMatchObject({
			reactionPool: "shared-rider",
			actionEconomy: { actions: 1, reactions: 1 },
			progressionMode: "milestone",
		});
	});

	it("does not synthesize rest healing when no authored rule exists", () => {
		expect(readCompanionRestRule({}, "short")).toBeNull();
		expect(
			readCompanionRestRule(
				{
					rest: {
						long: {
							heal: { kind: "flat", amount: 6 },
							conditions: "preserve",
							clearDowned: true,
							resources: { focus: 2 },
						},
					},
				},
				"long",
			),
		).toEqual({
			heal: { kind: "flat", amount: 6 },
			conditions: "preserve",
			clearDowned: true,
			resources: { focus: 2 },
		});
	});

	it("enforces only mount limits explicitly present in the authored profile", () => {
		const profile = readCompanionMountProfile({
			riderLimit: 1,
			allowedRiderSizes: ["small", "medium"],
			allowedTerrain: ["ground"],
			requiresTack: true,
			requiresTraining: true,
		});
		expect(
			evaluateMountEligibility({
				profile,
				riderSize: "medium",
				terrain: "ground",
				hasTack: true,
				isTrained: true,
			}),
		).toEqual({ valid: true });
		expect(
			evaluateMountEligibility({
				profile,
				riderSize: "large",
				terrain: "ground",
				hasTack: true,
				isTrained: true,
			}),
		).toEqual({ valid: false, reason: "MOUNT_RIDER_SIZE_REJECTED" });
	});
});
