import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260630040000_guild_quests.sql?raw";

const sql = migrationSource.replace(/\r\n/g, "\n");

describe("guild quests migration", () => {
	it("creates the quest table with a status guard and RLS", () => {
		expect(sql).toContain("CREATE TABLE IF NOT EXISTS public.guild_quests");
		expect(sql).toMatch(
			/CHECK \(status IN \('active', 'completed', 'failed'\)\)/,
		);
		expect(sql).toContain("ENABLE ROW LEVEL SECURITY");
		expect(sql).toMatch(/IN \('leader', 'vice_master', 'officer'\)/);
	});

	it("resolves atomically: officer-gated, credits the guild, advances NPCs", () => {
		expect(sql).toContain(
			"CREATE OR REPLACE FUNCTION public.resolve_guild_quest",
		);
		expect(sql).toContain("SECURITY DEFINER");
		// credits treasury + contribution
		expect(sql).toMatch(/UPDATE public\.guilds[\s\S]*?contribution = /);
		// advances assigned NPC members one level
		expect(sql).toMatch(
			/UPDATE public\.guild_members[\s\S]*?npc_level = COALESCE\(npc_level, 1\) \+ 1/,
		);
		expect(sql).toMatch(/status = 'completed'/);
		expect(sql).toMatch(/status = 'failed'/);
	});
});
