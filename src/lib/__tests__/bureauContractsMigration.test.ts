import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260702010000_bureau_contracts.sql?raw";

const sql = migrationSource.replace(/\r\n/g, "\n");

describe("bureau contracts migration", () => {
	it("creates the dispatch table with kind/rank/status guards and RLS", () => {
		expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.bureau_contracts");
		expect(sql).toMatch(/CHECK \(kind IN \('contract', 'alert'\)\)/);
		expect(sql).toMatch(
			/CHECK \(status IN \('published', 'accepted', 'closed'\)\)/,
		);
		expect(sql).toMatch(
			/CHECK \(rank IN \('E', 'D', 'C', 'B', 'A', 'S', 'SS'\)\)/,
		);
		expect(sql).toContain("ENABLE ROW LEVEL SECURITY");
	});

	it("scopes reads to authenticated users and writes to the publisher", () => {
		expect(sql).toMatch(/FOR SELECT\s+TO authenticated\s+USING \(true\)/);
		expect(sql).toMatch(/publisher_user_id = auth\.uid\(\)/);
	});

	it("accepts atomically: officer-gated, locks the row, inserts the guild quest", () => {
		expect(sql).toContain(
			"CREATE OR REPLACE FUNCTION public.accept_bureau_contract",
		);
		expect(sql).toContain("SECURITY DEFINER");
		expect(sql).toMatch(/IN \('leader', 'vice_master', 'officer'\)/);
		expect(sql).toContain("FOR UPDATE");
		expect(sql).toContain("INSERT INTO public.guild_quests");
		// Reward math mirrors questRewardsForRank (gate credits, 50×/20× factor).
		expect(sql).toMatch(/'funds', 50 \* v_factor/);
		expect(sql).toMatch(/'contribution', 20 \* v_factor/);
		expect(sql).toMatch(/status = 'accepted'/);
	});

	it("exposes only a minimal leaderboard projection", () => {
		expect(sql).toContain(
			"CREATE OR REPLACE FUNCTION public.bureau_guild_leaderboard",
		);
		expect(sql).toMatch(/WHERE g\.is_active/);
		// No sensitive columns leak through the projection.
		expect(sql).not.toMatch(/g\.share_code/);
		expect(sql).not.toMatch(/g\.funds/);
		expect(sql).not.toMatch(/g\.settings/);
	});
});
