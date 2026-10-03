import { describe, expect, it } from "vitest";
import hardeningSource from "../../../supabase/migrations/20260926041000_companion_c2_retry_source_hardening.sql?raw";

const migration = hardeningSource.replace(/\r\n/g, "\n");

describe("C2 retry/source hardening", () => {
	it("puts an authoritative retry gate in front of tame attempts", () => {
		expect(migration).toContain(
			"RENAME TO resolve_companion_tame_attempt_c2_unchecked",
		);
		expect(migration).toContain(
			"CREATE OR REPLACE FUNCTION public.resolve_companion_tame_attempt_c2(",
		);
		expect(migration).toContain("v_latest.outcome IN ('failure', 'invalid')");
		expect(migration).toContain("'RETRY_ADJUDICATION_REQUIRED'");
		expect(migration).toContain(
			"v_adjudication.retry_of_attempt_id IS DISTINCT FROM v_latest.id",
		);
	});

	it("only lets the public wrapper execute the unchecked implementation", () => {
		expect(migration).toContain(
			"REVOKE ALL ON FUNCTION public.resolve_companion_tame_attempt_c2_unchecked(",
		);
		expect(migration).toContain("FROM PUBLIC, anon, authenticated");
		expect(migration).toContain(
			"RETURN public.resolve_companion_tame_attempt_c2_unchecked(",
		);
		expect(migration).toContain(
			"GRANT EXECUTE ON FUNCTION public.resolve_companion_tame_attempt_c2(",
		);
	});

	it("uses the latest tame outcome so a later distinct creature can start a fresh chain after success", () => {
		expect(migration).toContain(
			"ORDER BY attempt.created_at DESC, attempt.id DESC",
		);
		expect(migration).toContain("LIMIT 1");
		expect(migration).not.toContain(
			"AND attempt.outcome IN ('failure', 'invalid')\n  ORDER BY",
		);
	});

	it("uses exact canonical specialization ids and paired Jobs", () => {
		for (const id of [
			"stalker--pack-leader",
			"stalker--hive-synchronist",
			"technomancer--synchronist-binary-design",
		]) {
			expect(migration).toContain(`'${id}'`);
		}
		for (const job of ["summoner", "contractor", "esper"]) {
			expect(migration).toContain(`'${job}'`);
		}
		expect(migration).not.toContain("COALESCE(v_path, '') ~*");
		expect(migration).not.toContain("lower(btrim(COALESCE(v_job, '')))");
	});
});
