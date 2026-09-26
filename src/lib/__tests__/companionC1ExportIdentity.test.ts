import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260926020400_companion_c1_tamed_export_snapshot.sql?raw";
import exportImportSource from "../../hooks/useCharacterExportImport.ts?raw";

const migration = migrationSource.replace(/\r\n/g, "\n");
const exportImport = exportImportSource.replace(/\r\n/g, "\n");

describe("C1 companion export/import identity", () => {
	it("stores portable frozen source envelopes on personal and campaign tamed rows", () => {
		expect(migration).toContain("ALTER TABLE public.character_tamed_anomalies");
		expect(migration).toContain("ALTER TABLE public.campaign_tamed_anomalies");
		expect(migration.match(/ADD COLUMN IF NOT EXISTS companion_source_snapshot JSONB/g)).toHaveLength(2);
		expect(migration).toContain("instance.source_policy = 'snapshot'");
	});

	it("reconstructs imported tamed identity from a validated snapshot instead of trusting a foreign registry id", () => {
		expect(migration).toContain("CREATE OR REPLACE FUNCTION app_private.ensure_character_tamed_companion_instance()");
		expect(migration).toContain("CREATE OR REPLACE FUNCTION app_private.ensure_campaign_tamed_companion_instance()");
		expect(migration).toContain("'{provenance,canonicalType}' = 'anomaly'");
		expect(migration).toContain("'{provenance,canonicalId}' = NEW.anomaly_id");
		expect(migration).toContain("CASE WHEN v_snapshot_valid THEN 'snapshot' ELSE 'legacy-live' END");
	});

	it("prevents clients from rewriting identity or frozen source fields directly", () => {
		expect(migration).toContain("COMPANION_MAPPING_IS_DERIVED");
		expect(migration).toContain("COMPANION_SOURCE_SNAPSHOT_IS_DERIVED");
		expect(migration).toContain("COMPANION_TRANSFER_RPC_REQUIRED");
		expect(migration).toContain("current_setting('app.companion_mapping_write', true) = 'on'");
	});

	it("writes the portable tamed snapshot and registry snapshot in the same taming transaction", () => {
		expect(migration).toContain("SET companion_source_snapshot = p_source_snapshot");
		expect(migration).toContain("SET source_policy = 'snapshot'");
		expect(migration).toContain("source_snapshot = p_source_snapshot");
	});

	it("keeps personal companion rows in the existing character export while excluding campaign ownership rows", () => {
		expect(exportImport).toContain('.from("character_extras")');
		expect(exportImport).toContain('.from("character_vehicles")');
		expect(exportImport).toContain('.from("character_tamed_anomalies")');
		expect(exportImport).toContain("tamed_anomalies: tamedAnomaliesResult.data || []");
		expect(exportImport).not.toContain('.from("campaign_tamed_anomalies")');
	});

	it("keeps unknown additive row fields through the import sanitizer", () => {
		const stripStart = exportImport.indexOf("const stripImportOnlyFields = (");
		const stripEnd = exportImport.indexOf("const createImportedEquipmentRows", stripStart);
		const stripBlock = exportImport.slice(stripStart, stripEnd > stripStart ? stripEnd : undefined);
		expect(stripBlock).toContain("delete copy.id");
		expect(stripBlock).toContain("delete copy.character_id");
		expect(stripBlock).not.toContain("companion_instance_id");
		expect(stripBlock).not.toContain("companion_source_snapshot");
	});
});
