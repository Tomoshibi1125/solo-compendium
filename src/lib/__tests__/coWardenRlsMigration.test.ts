import { describe, expect, it } from "vitest";
import migrationSqlSource from "../../../supabase/migrations/20260428020000_restore_co_warden_campaign_system.sql?raw";

const migrationSql = migrationSqlSource.replace(/\r\n/g, "\n");

describe("co-warden RLS helper restoration migration", () => {
	it("restores is_campaign_system to authorize co-wardens", () => {
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.is_campaign_system\(/,
		);
		expect(migrationSql).toContain("AND role = 'co-warden'");
		expect(migrationSql).not.toContain("AND role = 'co-system'");
	});

	it("keeps the helper usable by RLS policies", () => {
		expect(migrationSql).toContain("SECURITY DEFINER");
		expect(migrationSql).toContain("SET row_security = off");
		expect(migrationSql).toMatch(
			/GRANT EXECUTE ON FUNCTION public\.is_campaign_system\(UUID, UUID\) TO authenticated;/,
		);
	});
});
