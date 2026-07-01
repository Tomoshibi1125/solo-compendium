import { describe, expect, it } from "vitest";
import onePerCharacterSource from "../../../supabase/migrations/20260630010000_guild_one_per_character.sql?raw";
import characterLimitsSource from "../../../supabase/migrations/20260630020000_character_limits.sql?raw";

const onePerCharacter = onePerCharacterSource.replace(/\r\n/g, "\n");
const characterLimits = characterLimitsSource.replace(/\r\n/g, "\n");

describe("one-guild-per-character migration", () => {
	it("replaces the per-user index with a per-character unique index", () => {
		expect(onePerCharacter).toContain(
			"DROP INDEX IF EXISTS public.guild_members_one_per_user",
		);
		expect(onePerCharacter).toMatch(
			/CREATE UNIQUE INDEX IF NOT EXISTS guild_members_one_per_character\s+ON public\.guild_members\(character_id\)\s+WHERE character_id IS NOT NULL/,
		);
	});

	it("binds the founding character on the leader membership row", () => {
		expect(onePerCharacter).toContain("p_character_id UUID DEFAULT NULL");
		expect(onePerCharacter).toMatch(
			/INSERT INTO public\.guild_members \(guild_id, user_id, character_id, role\)/,
		);
		expect(onePerCharacter).toMatch(
			/GRANT EXECUTE ON FUNCTION public\.create_guild_with_code\(TEXT, TEXT, TEXT, UUID, UUID, UUID\) TO authenticated;/,
		);
	});
});

describe("per-user character limits migration", () => {
	it("enforces at most 6 characters per user via a BEFORE INSERT trigger", () => {
		expect(characterLimits).toContain(
			"CREATE OR REPLACE FUNCTION public.enforce_character_limit()",
		);
		expect(characterLimits).toMatch(/COUNT\(\*\)[\s\S]*?>= 6/);
		expect(characterLimits).toMatch(
			/CREATE TRIGGER enforce_character_limit_trigger\s+BEFORE INSERT ON public\.characters/,
		);
	});

	it("enforces a case-insensitive unique character name per user", () => {
		expect(characterLimits).toMatch(
			/CREATE UNIQUE INDEX IF NOT EXISTS characters_unique_name_per_user\s+ON public\.characters\(user_id, lower\(name\)\)/,
		);
	});
});
