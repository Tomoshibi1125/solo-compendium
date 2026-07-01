import { describe, expect, it } from "vitest";

import createInviteApiSource from "../../../api/createInvite.js?raw";
import migrationSqlSource from "../../../supabase/migrations/20260506140500_harden_campaign_invite_linking.sql?raw";
import { useAddPlayerCharacterToCampaign } from "../../hooks/useCampaignInvites";
import campaignInviteHooksSource from "../../hooks/useCampaignInvites.ts?raw";
import campaignHooksSource from "../../hooks/useCampaigns.ts?raw";
import campaignDetailSource from "../../pages/CampaignDetail.tsx?raw";
import campaignJoinSource from "../../pages/CampaignJoin.tsx?raw";
import partyStashSource from "../../pages/PartyStash.tsx?raw";

const migrationSql = migrationSqlSource.replace(/\r\n/g, "\n");

describe("campaign invite/linking hardening invariants", () => {
	it("canonicalizes invite and membership roles in the database contract", () => {
		expect(migrationSql).toContain(
			"CHECK (role IN ('ascendant', 'co-warden'))",
		);
		expect(migrationSql).toContain("WHEN 'hunter' THEN 'ascendant'");
		expect(migrationSql).toContain("WHEN 'co-system' THEN 'co-warden'");
		expect(migrationSql).toContain("p_role TEXT DEFAULT 'ascendant'");
		expect(migrationSql).toContain(
			"VALUES (v_campaign_id, auth.uid(), p_character_id, v_role)",
		);
		expect(migrationSql).not.toContain("p_role TEXT DEFAULT 'hunter'");
	});

	it("provides canonical join and character-linking RPCs", () => {
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.join_campaign_by_id\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.join_campaign_by_code\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.add_ascendant_character_to_campaign\(/,
		);
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.get_campaign_linked_characters\(/,
		);
		expect(migrationSql).toContain("public.attach_campaign_member_character");
		expect(migrationSql).toContain("campaign_member_characters");
	});

	it("keeps legacy character-linking as a thin compatibility shim only", () => {
		expect(migrationSql).toMatch(
			/CREATE OR REPLACE FUNCTION public\.add_player_character_to_campaign\([\s\S]*SELECT public\.add_ascendant_character_to_campaign/,
		);
	});

	it("uses Warden/Ascendant terminology in invite API and canonical frontend paths", () => {
		expect(createInviteApiSource).toContain("warden_id");
		expect(createInviteApiSource).toContain('.eq("role", "co-warden")');
		expect(createInviteApiSource).toContain(
			"Only the campaign Warden can create invites",
		);
		expect(createInviteApiSource).toContain('? "co-warden"');
		expect(createInviteApiSource).toContain(': "ascendant"');
		expect(campaignInviteHooksSource).toContain(
			"useAddAscendantCharacterToCampaign",
		);
		expect(campaignInviteHooksSource).toContain(
			"add_ascendant_character_to_campaign",
		);
		expect(campaignInviteHooksSource).toContain(
			"useAddPlayerCharacterToCampaign",
		);
		expect(useAddPlayerCharacterToCampaign).toEqual(expect.any(Function));
		expect(campaignHooksSource).toContain("join_campaign_by_id");
		expect(campaignHooksSource).toContain(
			"add_ascendant_character_to_campaign",
		);
		expect(campaignHooksSource).toContain(
			'["campaigns", campaignId, "has-warden-access"]',
		);
		expect(campaignDetailSource).toContain("Invite Ascendants");
		expect(campaignJoinSource).toContain(
			"Tokens are included in invite links from your Warden.",
		);
		expect(campaignDetailSource).not.toContain("Invite Players");
		expect(campaignDetailSource).not.toContain("**System**");
	});

	it("updates dependent consumers to use linked character records", () => {
		expect(partyStashSource).toContain("campaign_member_characters");
		expect(partyStashSource).toContain("campaign_member_id");
	});
});
