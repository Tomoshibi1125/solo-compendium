import { describe, expect, it } from "vitest";
import exceptionRegisterSource from "../../../docs/supabase-security-exception-register.md?raw";
import campaignRosterMigrationSource from "../../../supabase/migrations/20260908000000_campaign_roster_security.sql?raw";
import campaignCharactersSource from "../../components/campaign/CampaignCharacters.tsx?raw";
import characterSheetSource from "../../components/character-v2/CharacterSheetV2.tsx?raw";
import campaignHooksSource from "../../hooks/useCampaigns.ts?raw";
import characterPageModelSource from "../../hooks/useCharacterPageModel.ts?raw";
import characterHooksSource from "../../hooks/useCharacters.ts?raw";
import generatedTypesSource from "../../integrations/supabase/types.ts?raw";
import campaignDetailSource from "../../pages/CampaignDetail.tsx?raw";

const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const migration = normalize(campaignRosterMigrationSource);

const between = (source: string, start: string, end: string) => {
	const startIndex = source.indexOf(start);
	const endIndex = source.indexOf(end, startIndex + start.length);
	if (startIndex < 0 || endIndex < 0) {
		throw new Error(`Could not find source block: ${start} -> ${end}`);
	}
	return source.slice(startIndex, endIndex);
};

describe("campaign roster security boundary", () => {
	it("keeps the roster RPC actor-checked and limited to its safe DTO", () => {
		const rosterFunction = between(
			migration,
			"CREATE OR REPLACE FUNCTION public.get_campaign_roster",
			"REVOKE ALL ON FUNCTION public.get_campaign_roster",
		);

		expect(rosterFunction).toContain("SECURITY DEFINER");
		expect(rosterFunction).toContain("SET search_path = pg_catalog, public");
		expect(rosterFunction).toContain("CAMPAIGN_ROSTER_FORBIDDEN");
		expect(rosterFunction).toMatch(
			/RETURNS TABLE \(\s*campaign_member_id UUID,\s*user_id UUID,\s*display_name TEXT,\s*role TEXT,\s*joined_at TIMESTAMPTZ,\s*character_id UUID,\s*character_name TEXT,\s*character_level INTEGER,\s*character_job TEXT,\s*portrait_url TEXT,\s*is_shared BOOLEAN\s*\)/,
		);
		expect(rosterFunction).not.toMatch(/email|metadata|notes|token/i);
		expect(migration).toContain(
			"GRANT EXECUTE ON FUNCTION public.get_campaign_roster(UUID) TO authenticated;",
		);
	});

	it("exposes only exact-granted campaign management RPCs and keeps the primary immutable", () => {
		for (const signature of [
			"public.set_campaign_member_role(UUID, UUID, TEXT)",
			"public.remove_campaign_member(UUID, UUID)",
			"public.detach_campaign_member_character(UUID, UUID, UUID)",
		]) {
			expect(migration).toContain(`REVOKE ALL ON FUNCTION ${signature}`);
			expect(migration).toContain(
				`GRANT EXECUTE ON FUNCTION ${signature}\n  TO authenticated;`,
			);
		}
		expect(migration.match(/PRIMARY_WARDEN_IMMUTABLE/g)).toHaveLength(3);
		expect(migration).toContain("CREATE POLICY campaign_members_leave_self");
	});

	it("uses the private relationship helper for read-only sheet RLS", () => {
		const helper = between(
			migration,
			"CREATE OR REPLACE FUNCTION app_private.can_read_campaign_character",
			"REVOKE ALL ON FUNCTION app_private.can_read_campaign_character",
		);
		expect(helper).toContain("p_actor = auth.uid()");
		expect(helper).toContain("public.is_campaign_system");
		expect(helper).toContain("SET row_security = off");
		expect(migration).toContain(
			"CREATE POLICY campaign_managers_read_linked_characters",
		);
		expect(migration).toContain("FOR SELECT");
		expect(migration).toContain("character_sheet_state");
		expect(migration).toContain("character_requisition_profiles");
		expect(migration).not.toContain(
			"FOR UPDATE TO authenticated USING (\n    app_private.can_read_campaign_character",
		);
	});

	it("uses the roster and management RPCs rather than direct campaign-member writes", () => {
		const rosterHook = between(
			normalize(campaignHooksSource),
			"export const useCampaignMembers = (campaignId: string) => {",
			"// Create campaign mutation",
		);
		expect(rosterHook).toContain('supabase.rpc("get_campaign_roster"');
		expect(rosterHook).not.toContain('.from("campaign_members").select');
		expect(campaignHooksSource).toContain(
			'supabase.rpc("set_campaign_member_role"',
		);
		expect(campaignHooksSource).toContain(
			'supabase.rpc("remove_campaign_member"',
		);
		expect(campaignHooksSource).toContain('"detach_campaign_member_character"');
	});

	it("renders roster identity, gives co-Wardens controls, and makes non-owner sheets read-only", () => {
		expect(campaignDetailSource).toContain("member.display_name");
		expect(campaignDetailSource).toContain("No Ascendant linked");
		expect(campaignDetailSource).toContain("hasWardenAccess && !isWarden");
		expect(campaignDetailSource).toContain("Detach");
		expect(campaignDetailSource).toContain("Remove");
		expect(campaignCharactersSource).toContain(
			"const canViewSheet = hasWardenAccess || isOwner;",
		);
		const singleCharacterHook = between(
			normalize(characterHooksSource),
			"export const useCharacter = (characterId: string, shareToken?: string) => {",
			"// Create character",
		);
		expect(singleCharacterHook).not.toContain('.eq("user_id", user.id)');
		expect(characterPageModelSource).toContain(
			"character.user_id !== user?.id",
		);
		expect(characterSheetSource).toMatch(
			/<CharacterExtrasPanel\s+characterId={character\.id}\s+isReadOnly={isReadOnly}\s*\/>/,
		);
		expect(characterSheetSource).toContain(
			"{!isReadOnly && <CharacterBackupPanel characterId={character.id} />}",
		);
	});

	it("keeps generated types and the reviewed exception register in sync", () => {
		for (const signature of [
			"app_private.can_read_campaign_character(uuid,uuid)",
			"public.get_campaign_roster(uuid)",
			"public.set_campaign_member_role(uuid,uuid,text)",
			"public.remove_campaign_member(uuid,uuid)",
			"public.detach_campaign_member_character(uuid,uuid,uuid)",
		]) {
			expect(exceptionRegisterSource).toContain(signature);
		}
		expect(exceptionRegisterSource).toContain(
			"leaked-password protection remains intentionally deferred",
		);
		expect(generatedTypesSource).toContain("get_campaign_roster:");
		expect(generatedTypesSource).toContain("set_campaign_member_role:");
		expect(generatedTypesSource).toContain("remove_campaign_member:");
		expect(generatedTypesSource).toContain("detach_campaign_member_character:");
	});
});
