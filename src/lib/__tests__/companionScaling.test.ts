import { describe, expect, it } from "vitest";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";
import { resolveCompanionEffectiveStats } from "@/lib/companionInstances";
import {
	companionSourceRank,
	mergeCompanionCombat,
	scaleCompanionAtLevel,
} from "@/lib/companionScaling";
import { createCanonicalCompanionSource } from "@/lib/companions";

const mount = (): CompanionInstanceRecord => ({
	id: "11111111-1111-4111-8111-111111111111",
	owner_scope: "character",
	owner_character_id: "22222222-2222-4222-8222-222222222222",
	owner_campaign_id: null,
	primary_handler_character_id: "22222222-2222-4222-8222-222222222222",
	combat_controller_character_id: null,
	rider_character_id: null,
	identity_kind: "mount",
	source_kind: "canonical-mount",
	source_collection: "vehicles",
	source_id: "mount-bonded-eternal-void-beast",
	source_policy: "snapshot",
	source_revision: "canonical-snapshot-v1",
	source_snapshot_version: 1,
	source_snapshot: createCanonicalCompanionSource({
		canonicalId: "mount-bonded-eternal-void-beast",
		canonicalType: "vehicle",
		canonicalCollection: "vehicles",
		name: "Bonded Eternal Void Beast",
		hpMax: 45,
		baseAc: 14,
		speed: 50,
		rank: "C",
	}),
	profile_version: 1,
	progression_profile: {},
	stat_overrides: {},
	mount_profile: {},
	origin_table: "character_vehicles",
	origin_row_id: "33333333-3333-4333-8333-333333333333",
	created_at: "2026-09-26T00:00:00Z",
	updated_at: "2026-09-26T00:00:00Z",
});

describe("level-scaled living anomalies and mounts", () => {
	it("uses conservative rank and character-level defaults at low and high levels", () => {
		expect(scaleCompanionAtLevel(1, "C", {})).toMatchObject({
			level: 1,
			hpMax: 16,
			baseAc: 12,
			attackBonus: 6,
			saveDc: 12,
			damageDice: "3d6",
		});
		expect(scaleCompanionAtLevel(9, "C", {})).toMatchObject({
			level: 9,
			hpMax: 80,
			baseAc: 14,
			attackBonus: 8,
			saveDc: 14,
			damageDice: "5d6",
		});
		expect(scaleCompanionAtLevel(20, "C", {}).hpMax).toBe(168);
	});

	it("uses bounded Warden coefficients but never a stored enemy HP/AC block", () => {
		const instance = mount();
		instance.progression_profile = {
			scaling: { hpBase: 20, hpPerLevel: 10, acBase: 13, damageDie: 8 },
		};
		const stats = resolveCompanionEffectiveStats(
			instance,
			{
				currentHp: 99,
				hpMax: 999,
				baseAc: 30,
				speed: 50,
			},
			undefined,
			3,
		);
		expect(stats).toMatchObject({ hpMax: 50, currentHp: 50, baseAc: 13 });
		expect(stats?.combatScaling).toMatchObject({
			damageDice: "3d8",
			attackBonus: 6,
		});
		expect(companionSourceRank(instance)).toBe("C");
	});

	it("merges a bonded mount's abilities with its anomaly counterpart's scaled attacks", () => {
		const instance = mount();
		const combat = mergeCompanionCombat(
			instance,
			scaleCompanionAtLevel(1, "C", {}),
		);
		expect(combat.anomalyId).toBe("anomaly-0002");
		expect(
			combat.traits.some(
				(trait) => trait.name === "Beast Instinct" && trait.owner === "mount",
			),
		).toBe(true);
		expect(
			combat.actions.some(
				(action) => action.name === "Pursuit Lunge" && action.owner === "mount",
			),
		).toBe(true);
		const strike = combat.actions.find(
			(action) => action.name === "Shadow Strike",
		);
		expect(strike).toMatchObject({
			owner: "anomaly",
			attackBonus: 6,
			damage: "3d6",
		});
		expect(strike?.description).toContain("+6 to hit");
		expect(strike?.description).toContain("3d6 force damage");
		expect(strike?.description).not.toContain("5d6");
	});
});
