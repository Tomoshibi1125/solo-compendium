import { describe, expect, it } from "vitest";
import identityMigrationSource from "../../../supabase/migrations/20260926020000_companion_c1_identity.sql?raw";
import guardFixSource from "../../../supabase/migrations/20260926020100_companion_c1_guard_fix.sql?raw";
import mountSnapshotSource from "../../../supabase/migrations/20260926020200_companion_c1_mount_snapshot.sql?raw";

const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const migration = normalize(identityMigrationSource);
const guardFix = normalize(guardFixSource);
const mountSnapshot = normalize(mountSnapshotSource);

describe("C1 companion persistence contract", () => {
	it("adds one stable living-instance registry without replacing legacy stores", () => {
		expect(migration).toContain(
			"CREATE TABLE IF NOT EXISTS public.companion_instances",
		);
		for (const table of [
			"character_extras",
			"character_tamed_anomalies",
			"campaign_tamed_anomalies",
			"character_vehicles",
		]) {
			expect(migration).toContain(`ALTER TABLE public.${table}`);
			expect(migration).toContain(
				"ADD COLUMN IF NOT EXISTS companion_instance_id UUID",
			);
		}
		expect(migration).toContain(
			"CONSTRAINT companion_instances_origin_unique UNIQUE (origin_table, origin_row_id)",
		);
	});

	it("backfills each legacy row independently rather than merging by source or name", () => {
		for (const origin of [
			"character_extras",
			"character_tamed_anomalies",
			"campaign_tamed_anomalies",
		]) {
			expect(migration).toContain(`'${origin}'`);
			expect(migration).toContain(`instance.origin_table = '${origin}'`);
		}
		expect(migration).not.toMatch(
			/GROUP BY[^;]*(name|source_id|anomaly_id|npc_id)/i,
		);
		expect(migration).not.toMatch(
			/DISTINCT ON\s*\([^)]*(name|source_id|anomaly_id|npc_id)/i,
		);
	});

	it("keeps ownership, handler, combat controller, and rider separate", () => {
		for (const column of [
			"owner_character_id UUID",
			"owner_campaign_id UUID",
			"primary_handler_character_id UUID",
			"combat_controller_character_id UUID",
			"rider_character_id UUID",
		]) {
			expect(migration).toContain(column);
		}
		expect(migration).toContain("owner_scope IN ('character', 'campaign')");
		expect(migration).toContain("COMPANION_TRANSFER_RPC_REQUIRED");
	});

	it("records source revision, snapshot, profile version, overrides, and mount profile", () => {
		for (const field of [
			"source_policy TEXT",
			"source_revision TEXT NOT NULL",
			"source_snapshot_version INTEGER",
			"source_snapshot JSONB",
			"profile_version INTEGER",
			"progression_profile JSONB",
			"stat_overrides JSONB",
			"mount_profile JSONB",
		]) {
			expect(migration).toContain(field);
		}
		expect(migration).toContain(
			"source_policy IN ('snapshot', 'legacy-live', 'manual')",
		);
		expect(migration).toContain("'legacy-tamed-live-v1'");
	});

	it("keeps constructed vehicles outside living identity and registers mounts explicitly", () => {
		expect(migration).toContain(
			"only living mounts link to a companion instance; constructed vehicles do not",
		);
		expect(mountSnapshot).toContain("IF v_instance IS NULL THEN");
		expect(mountSnapshot).toContain("NEW.companion_source_snapshot := NULL");
		expect(mountSnapshot).toContain(
			"CREATE OR REPLACE FUNCTION public.register_character_vehicle_mount(",
		);
		expect(mountSnapshot).toContain("LIVING_MOUNT_SNAPSHOT_REQUIRED");
		expect(mountSnapshot).toContain(
			"'{provenance,entryType}' IS DISTINCT FROM 'mount'",
		);
	});

	it("preserves frozen living-mount source data through existing row export/import", () => {
		expect(mountSnapshot).toContain(
			"ADD COLUMN IF NOT EXISTS companion_source_snapshot JSONB",
		);
		expect(mountSnapshot).toContain(
			"CREATE OR REPLACE FUNCTION app_private.ensure_character_vehicle_companion_instance()",
		);
		expect(mountSnapshot).toContain("'canonical-snapshot-v1'");
		expect(mountSnapshot).toContain("'imported-mount-ref-v1'");
		expect(mountSnapshot).toContain(
			"Imported IDs are references, not authority",
		);
	});

	it("scopes registry reads and exposes no direct authenticated writes", () => {
		expect(migration).toContain(
			"ALTER TABLE public.companion_instances ENABLE ROW LEVEL SECURITY",
		);
		expect(migration).toContain("CREATE POLICY companion_instances_select");
		expect(migration).toContain("campaign_members");
		expect(migration).toContain("campaign_row.warden_id = (SELECT auth.uid())");
		expect(migration).toContain(
			"REVOKE INSERT, UPDATE, DELETE ON public.companion_instances",
		);
	});

	it("guards mapping/owner fields across all projection table shapes", () => {
		expect(guardFix).toContain("v_new JSONB := to_jsonb(NEW)");
		expect(guardFix).toContain("v_old JSONB := to_jsonb(OLD)");
		expect(guardFix).toContain("COMPANION_MAPPING_IS_DERIVED");
		expect(guardFix).toContain("COMPANION_TRANSFER_RPC_REQUIRED");
		expect(guardFix).not.toContain(
			"NEW.character_id IS DISTINCT FROM OLD.character_id",
		);
	});
});
