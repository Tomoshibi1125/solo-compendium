import { describe, expect, it } from "vitest";
import {
	type CompanionInstanceRecord,
	isSameLivingCompanion,
	readCompanionSnapshotBaseStats,
	resolveCompanionEffectiveStats,
} from "@/lib/companionInstances";
import { createCanonicalCompanionSource } from "@/lib/companions";

const baseInstance = (
	overrides: Partial<CompanionInstanceRecord> = {},
): CompanionInstanceRecord => ({
	id: "11111111-1111-4111-8111-111111111111",
	owner_scope: "character",
	owner_character_id: "22222222-2222-4222-8222-222222222222",
	owner_campaign_id: null,
	primary_handler_character_id: "22222222-2222-4222-8222-222222222222",
	combat_controller_character_id: "22222222-2222-4222-8222-222222222222",
	rider_character_id: null,
	identity_kind: "companion",
	source_kind: "canonical-anomaly",
	source_collection: "anomalies",
	source_id: "echo-wolf",
	source_policy: "snapshot",
	source_revision: "canonical-snapshot-v1",
	source_snapshot_version: 1,
	source_snapshot: createCanonicalCompanionSource({
		canonicalId: "echo-wolf",
		canonicalType: "anomaly",
		canonicalCollection: "anomalies",
		name: "Echo Wolf",
		hpMax: 30,
		baseAc: 14,
		speed: 40,
		rank: "C",
	}),
	profile_version: 1,
	progression_profile: {},
	stat_overrides: {},
	mount_profile: null,
	origin_table: "character_extras",
	origin_row_id: "33333333-3333-4333-8333-333333333333",
	created_at: "2026-09-25T00:00:00.000Z",
	updated_at: "2026-09-25T00:00:00.000Z",
	...overrides,
});

describe("C1 companion instance resolver", () => {
	it("reads the existing canonical companion snapshot envelope", () => {
		expect(
			readCompanionSnapshotBaseStats(baseInstance().source_snapshot),
		).toEqual({
			name: "Echo Wolf",
			hpMax: 30,
			baseAc: 14,
			speed: 40,
			rank: "C",
		});
	});

	it("preserves existing sheet fields over frozen source fields", () => {
		const stats = resolveCompanionEffectiveStats(baseInstance(), {
			name: "Old Name",
			nickname: "Nyx",
			currentHp: 17,
			hpMax: 35,
			baseAc: 16,
			speed: 45,
		});
		expect(stats).toMatchObject({
			name: "Nyx",
			currentHp: 17,
			hpMax: 35,
			baseAc: 16,
			speed: 45,
			sourceRevision: "canonical-snapshot-v1",
			usesLiveCatalogFallback: false,
		});
	});

	it("does not let live catalog edits rewrite snapshot-backed companions", () => {
		const stats = resolveCompanionEffectiveStats(
			baseInstance(),
			{},
			{ name: "Changed Wolf", hpMax: 99, baseAc: 22, speed: 90, rank: "S" },
		);
		expect(stats).toMatchObject({
			name: "Echo Wolf",
			hpMax: 30,
			baseAc: 14,
			speed: 40,
			rank: "C",
			usesLiveCatalogFallback: false,
		});
	});

	it("uses a live catalog fallback only for explicitly legacy-live instances", () => {
		const legacy = baseInstance({
			source_policy: "legacy-live",
			source_revision: "legacy-tamed-live-v1",
			source_snapshot: {
				kind: "legacy-tamed-state",
				version: 1,
				anomalyId: "echo-wolf",
			},
		});
		const stats = resolveCompanionEffectiveStats(
			legacy,
			{ currentHp: 12 },
			{ name: "Echo Wolf", hpMax: 30, baseAc: 14, speed: 40, rank: "C" },
		);
		expect(stats).toMatchObject({
			currentHp: 12,
			hpMax: 30,
			baseAc: 14,
			speed: 40,
			usesLiveCatalogFallback: true,
		});
	});

	it("keeps two creatures with the same canonical source distinct", () => {
		const first = baseInstance();
		const second = baseInstance({
			id: "44444444-4444-4444-8444-444444444444",
			origin_row_id: "55555555-5555-4555-8555-555555555555",
		});
		expect(first.source_id).toBe(second.source_id);
		expect(isSameLivingCompanion(first, second)).toBe(false);
		expect(isSameLivingCompanion(first, first)).toBe(true);
	});

	it("lets two projections share one living instance identity", () => {
		const instance = baseInstance({ identity_kind: "mount" });
		const extraProjection = { id: instance.id };
		const vehicleProjection = { id: instance.id };
		expect(isSameLivingCompanion(extraProjection, vehicleProjection)).toBe(
			true,
		);
	});
});
