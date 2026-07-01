import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260630030000_guild_join_requests.sql?raw";

const sql = migrationSource.replace(/\r\n/g, "\n");

describe("guild join requests migration", () => {
	it("creates the request table with a single-pending-per-user guard", () => {
		expect(sql).toContain(
			"CREATE TABLE IF NOT EXISTS public.guild_join_requests",
		);
		expect(sql).toMatch(
			/CHECK \(status IN \('pending', 'approved', 'rejected'\)\)/,
		);
		expect(sql).toMatch(
			/CREATE UNIQUE INDEX IF NOT EXISTS guild_join_requests_one_pending[\s\S]*?WHERE status = 'pending'/,
		);
		expect(sql).toContain("ENABLE ROW LEVEL SECURITY");
	});

	it("approves atomically: leader/vice only, binds the character, marks approved", () => {
		expect(sql).toContain(
			"CREATE OR REPLACE FUNCTION public.approve_guild_join_request",
		);
		expect(sql).toMatch(/IN \('leader', 'vice_master'\)/);
		expect(sql).toMatch(
			/INSERT INTO public\.guild_members \(guild_id, user_id, character_id, role\)/,
		);
		expect(sql).toMatch(
			/UPDATE public\.guild_join_requests\s+SET status = 'approved'/,
		);
		expect(sql).toContain("SECURITY DEFINER");
	});

	it("requests by share code via a definer RPC (bypasses guilds SELECT RLS)", () => {
		expect(sql).toContain(
			"CREATE OR REPLACE FUNCTION public.request_to_join_guild",
		);
		expect(sql).toMatch(/share_code = upper\(trim\(p_share_code\)\)/);
		expect(sql).toMatch(/already a member of this guild/);
		expect(sql).toMatch(
			/GRANT EXECUTE ON FUNCTION public\.request_to_join_guild\(TEXT, UUID, TEXT\) TO authenticated;/,
		);
	});
});
