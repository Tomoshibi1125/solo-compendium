import { describe, expect, it } from "vitest";
import c2Source from "../../../supabase/migrations/20260926030000_companion_c2_bonding.sql?raw";

const migration = c2Source.replace(/\r\n/g, "\n");

describe("C2 companion persistence and adjudication contract", () => {
	it("stores durable attempts, one-shot adjudications, bonds and controller events", () => {
		for (const table of [
			"companion_bond_attempts",
			"companion_attempt_adjudications",
			"companion_bonds",
			"companion_control_events",
		]) {
			expect(migration).toContain(`CREATE TABLE IF NOT EXISTS public.${table}`);
			expect(migration).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`);
		}
		expect(migration).toContain("attempt_chain_id UUID NOT NULL");
		expect(migration).toContain("retry_of_attempt_id UUID");
		expect(migration).toContain("consumed_at TIMESTAMPTZ");
	});

	it("implements only the authored D-S bonding DC ladder", () => {
		for (const [rank, dc] of [
			["D", 12],
			["C", 14],
			["B", 16],
			["A", 18],
			["S", 20],
		] as const) {
			expect(migration).toContain(`WHEN '${rank}' THEN ${dc}`);
		}
		expect(migration).not.toMatch(/WHEN\s+'E'\s+THEN\s+\d+/);
		expect(migration).toContain("'UNSUPPORTED_TARGET_RANK'");
	});

	it("uses PRE, PB once, and at most one source-backed +2", () => {
		expect(migration).toContain("CHECK (ability = 'PRE')");
		expect(migration).toContain("v_pre_mod := floor((v_pre - 10)::NUMERIC / 2)::INTEGER");
		expect(migration).toContain("v_pb := ceil(GREATEST(v_level, 1)::NUMERIC / 4)::INTEGER + 1");
		expect(migration).toContain("v_spec_bonus := 2");
		expect(migration).toContain("specialization_bonus IN (0, 2)");
		expect(migration).toContain("character_row.path_id::TEXT");
		expect(migration).toContain("character_row.job_id::TEXT");
		expect(migration).toContain("'animal handling', 'animal handling', 'beast taming'");
	});

	it("supports advantage/disadvantage only through the bounded roll resolver", () => {
		expect(migration).toContain("p_roll_mode NOT IN ('normal', 'advantage', 'disadvantage')");
		expect(migration).toContain("WHEN 'advantage' THEN GREATEST(p_roll_primary, p_roll_secondary)");
		expect(migration).toContain("WHEN 'disadvantage' THEN LEAST(p_roll_primary, p_roll_secondary)");
		expect(migration).toContain("'SECOND_ROLL_REQUIRED'");
		expect(migration).toContain("p_roll_primary < 1 OR p_roll_primary > 20");
	});

	it("requires canonical source id agreement for tame and bond boundaries", () => {
		expect(migration).toContain("'{provenance,canonicalId}' IS DISTINCT FROM p_anomaly_id");
		expect(migration).toContain("v_instance.source_id IS DISTINCT FROM p_expected_source_id");
		expect(migration).toContain("'CANONICAL_SOURCE_ID_MISMATCH'");
		expect(migration).toContain("'COMPANION_SOURCE_MISMATCH'");
	});

	it("has explicit retry adjudication and no rest-driven retry mechanism", () => {
		expect(migration).toContain("'RETRY_ADJUDICATION_REQUIRED'");
		expect(migration).toContain("retry_of_attempt_id");
		expect(migration).toContain("public.prepare_companion_attempt_adjudication");
		expect(migration).toContain("Rest events never create adjudications");
		expect(migration.toLowerCase()).not.toContain("short-rest retry");
		expect(migration.toLowerCase()).not.toContain("short rest retry");
	});

	it("keeps bond, ownership, handler and controller as separate concepts", () => {
		expect(migration).toContain("CREATE TABLE IF NOT EXISTS public.companion_bonds");
		expect(migration).toContain("Bond is a\n-- distinct relationship");
		expect(migration).not.toMatch(/UPDATE public\.companion_instances[\s\S]{0,300}owner_character_id\s*=/);
		expect(migration).toContain("combat_controller_character_id = p_character_id");
	});

	it("serializes claim/release, rejects active-controller theft, and logs transitions", () => {
		expect(migration).toContain("CREATE OR REPLACE FUNCTION public.claim_anomaly_controller(");
		expect(migration).toContain("CREATE OR REPLACE FUNCTION public.release_anomaly_controller(");
		expect(migration).toContain("FOR UPDATE");
		expect(migration).toContain("'CONTROL_ALREADY_CLAIMED'");
		expect(migration).toContain("INSERT INTO public.companion_control_events");
	});

	it("retires the client-total C1 tame boundary for authenticated callers", () => {
		expect(migration).toContain("REVOKE EXECUTE ON FUNCTION public.attempt_taming_with_source(");
		expect(migration).toContain("public.resolve_companion_tame_attempt_c2");
		expect(migration).toContain("public.resolve_companion_bond_attempt_c2");
	});
});
