import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260926020300_companion_c1_taming_snapshot.sql?raw";
import hookSource from "../../hooks/useTamedAnomalies.ts?raw";

const migration = migrationSource.replace(/\r\n/g, "\n");
const hook = hookSource.replace(/\r\n/g, "\n");

describe("C1 taming source boundary", () => {
	it("requires a canonical Anomaly snapshot matching the requested source", () => {
		expect(migration).toContain(
			"CREATE OR REPLACE FUNCTION public.attempt_taming_with_source(",
		);
		expect(migration).toContain(
			"'{provenance,canonicalType}' IS DISTINCT FROM 'anomaly'",
		);
		expect(migration).toContain(
			"'{provenance,canonicalId}' IS DISTINCT FROM p_anomaly_id",
		);
		expect(migration).toContain("TAMING_SOURCE_SNAPSHOT_REQUIRED");
	});

	it("wraps legacy taming and freezes the instance source in the same transaction", () => {
		expect(migration).toContain("v_tamed_id := public.attempt_taming(");
		expect(migration).toContain("SET source_policy = 'snapshot'");
		expect(migration).toContain("source_revision = 'canonical-snapshot-v1'");
		expect(migration).toContain("source_snapshot = p_source_snapshot");
		expect(migration).toContain("TAMING_COMPANION_IDENTITY_MISSING");
	});

	it("retires direct authenticated calls that could bypass source snapshots", () => {
		expect(migration).toMatch(
			/REVOKE EXECUTE ON FUNCTION public\.attempt_taming\([\s\S]*?FROM PUBLIC, anon, authenticated;/,
		);
		expect(migration).toMatch(
			/GRANT EXECUTE ON FUNCTION public\.attempt_taming_with_source\([\s\S]*?TO authenticated;/,
		);
	});

	it("has the client build a canonical companion envelope and call the C2 resolver", () => {
		expect(hook).toContain("createCanonicalCompanionSource({");
		expect(hook).toContain('canonicalType: "anomaly"');
		expect(hook).toContain('canonicalCollection: "anomalies"');
		expect(hook).toContain('"resolve_companion_tame_attempt_c2"');
		expect(hook).not.toContain('"attempt_taming_with_source"');
		expect(hook).not.toContain('"attempt_taming",');
	});
});
