import { describe, expect, it } from "vitest";
import migrationSqlSource from "../../../supabase/migrations/20260216000000_parity_foundation_phase1.sql?raw";

const migrationSql = migrationSqlSource.replace(/\r\n/g, "\n");

describe("phase1 parity foundation migration", () => {
	it("defines sourcebook entitlement tables, RLS, and resolver RPCs", () => {
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.sourcebook_catalog/,
		);
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.user_sourcebook_entitlements/,
		);
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.campaign_sourcebook_shares/,
		);

		expect(migrationSql).toMatch(
			/ALTER TABLE public\.sourcebook_catalog ENABLE ROW LEVEL SECURITY;/,
		);
		expect(migrationSql).toMatch(
			/ALTER TABLE public\.user_sourcebook_entitlements ENABLE ROW LEVEL SECURITY;/,
		);
		expect(migrationSql).toMatch(
			/ALTER TABLE public\.campaign_sourcebook_shares ENABLE ROW LEVEL SECURITY;/,
		);

		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.user_has_sourcebook_access\([\s\S]*?SECURITY DEFINER[\s\S]*?SET row_security = off/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.get_accessible_sourcebooks\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.upsert_user_sourcebook_entitlement\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.share_campaign_sourcebook\(/,
		);
	});

	it("adds homebrew lifecycle/versioning model and guarded publish RPC", () => {
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.homebrew_content_versions/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.capture_homebrew_version_snapshot\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.set_homebrew_content_status\(/,
		);

		expect(migrationSql).toContain("RAISE EXCEPTION 'INVALID_HOMEBREW_STATUS'");
		expect(migrationSql).toContain(
			"RAISE EXCEPTION 'INVALID_VISIBILITY_SCOPE'",
		);
		expect(migrationSql).toContain(
			"RAISE EXCEPTION 'CAMPAIGN_ID_REQUIRED_FOR_CAMPAIGN_VISIBILITY'",
		);
		expect(migrationSql).toContain(
			"RAISE EXCEPTION 'CAMPAIGN_VISIBILITY_FORBIDDEN'",
		);

		expect(migrationSql).toMatch(
			/NEW\.is_public := \(NEW\.status = 'published' AND NEW\.visibility_scope = 'public'\);/,
		);
	});

	it("creates marketplace primitives with entitlement-aware RPC guards", () => {
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.marketplace_items/,
		);
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.marketplace_reviews/,
		);
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.marketplace_downloads/,
		);
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.user_marketplace_entitlements/,
		);

		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.user_has_marketplace_access\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.record_marketplace_download\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.upsert_marketplace_review\(/,
		);

		expect(migrationSql).toContain(
			"RAISE EXCEPTION 'MARKETPLACE_ACCESS_DENIED'",
		);
		expect(migrationSql).toContain("RAISE EXCEPTION 'INVALID_RATING'");
	});

	it("creates campaign scheduling and logs with lifecycle RPCs", () => {
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.campaign_sessions/,
		);
		expect(migrationSql).toMatch(
			/CREATE TABLE IF NOT EXISTS public\.campaign_session_logs/,
		);

		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.upsert_campaign_session\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.add_campaign_session_log\(/,
		);

		expect(migrationSql).toContain(
			"RAISE EXCEPTION 'CAMPAIGN_SESSION_FORBIDDEN'",
		);
		expect(migrationSql).toContain("RAISE EXCEPTION 'SESSION_TITLE_REQUIRED'");
		expect(migrationSql).toContain("RAISE EXCEPTION 'INVALID_LOG_TYPE'");
		expect(migrationSql).toContain("RAISE EXCEPTION 'LOG_CONTENT_REQUIRED'");

		expect(migrationSql).toMatch(/status = COALESCE\(p_status, status\)/);
	});

	it("keeps realtime publication updates idempotent", () => {
		expect(migrationSql).toMatch(
			/DO \$\$[\s\S]*?FROM pg_publication[\s\S]*?pubname = 'supabase_realtime'/,
		);
		expect(migrationSql).toMatch(/FROM pg_publication_tables/);
		expect(migrationSql).toMatch(/tablename = 'campaign_sessions'/);
		expect(migrationSql).toMatch(/tablename = 'campaign_session_logs'/);
		expect(migrationSql).toMatch(/tablename = 'marketplace_items'/);
		expect(migrationSql).toMatch(/tablename = 'marketplace_reviews'/);
	});
});
