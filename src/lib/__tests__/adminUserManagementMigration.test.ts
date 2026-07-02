import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260702020000_admin_user_management.sql?raw";

const sql = migrationSource.replace(/\r\n/g, "\n");

describe("admin user management migration", () => {
	it("adds the app-level suspension flag to profiles", () => {
		expect(sql).toContain(
			"ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ",
		);
	});

	it("creates an RLS'd audit log that only wardens can read and nobody can write directly", () => {
		expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.admin_audit_log");
		expect(sql).toContain("ENABLE ROW LEVEL SECURITY");
		expect(sql).toMatch(
			/FOR SELECT\s+USING \(public\.is_warden_or_admin\(\(select auth\.uid\(\)\)\)\)/,
		);
		// No INSERT/UPDATE/DELETE policies: rows come only from the definer fns.
		expect(sql).not.toMatch(/admin_audit_log FOR (INSERT|UPDATE|DELETE)/);
	});

	it("guards both mutations behind the warden check and audits atomically", () => {
		for (const fn of ["admin_set_user_role", "admin_set_user_ban"]) {
			expect(sql).toContain(`CREATE OR REPLACE FUNCTION public.${fn}`);
		}
		const guardCount = (
			sql.match(/IF NOT public\.is_warden_or_admin\(auth\.uid\(\)\)/g) ?? []
		).length;
		expect(guardCount).toBe(2);
		const auditInserts = (
			sql.match(/INSERT INTO public\.admin_audit_log/g) ?? []
		).length;
		expect(auditInserts).toBe(2);
		expect(sql).toMatch(/SECURITY DEFINER/);
	});

	it("validates roles and blocks self-suspension", () => {
		expect(sql).toMatch(/p_role NOT IN \('warden', 'ascendant'\)/);
		expect(sql).toMatch(/p_banned AND p_target = auth\.uid\(\)/);
	});

	it("records role transitions in the audit details", () => {
		expect(sql).toMatch(/jsonb_build_object\('from', v_old, 'to', p_role\)/);
	});
});
