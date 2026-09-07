import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260906000000_supabase_security_hardening.sql?raw";
import portraitSource from "../../components/character/PortraitUpload.tsx?raw";
import adminHooksSource from "../../hooks/useAdminUsers.ts?raw";
import campaignInvitesSource from "../../hooks/useCampaignInvites.ts?raw";
import campaignsSource from "../../hooks/useCampaigns.ts?raw";
import guildsSource from "../../hooks/useGuilds.ts?raw";
import wardenDeliverySource from "../../hooks/useWardenItemDelivery.ts?raw";
import generatedTypesSource from "../../integrations/supabase/types.ts?raw";
import adminPageSource from "../../pages/Admin.tsx?raw";
import authContextSource from "../auth/authContext.tsx?raw";

const normalize = (source: string) => source.replace(/\r\n/g, "\n");
const migration = normalize(migrationSource);

const between = (source: string, start: string, end: string): string => {
	const startIndex = source.indexOf(start);
	const endIndex = source.indexOf(end, startIndex + start.length);
	if (startIndex < 0 || endIndex < 0) {
		throw new Error(`Could not find source block: ${start} -> ${end}`);
	}
	return source.slice(startIndex, endIndex);
};

const campaignPreviewFunction = between(
	migration,
	"DROP FUNCTION IF EXISTS public.get_campaign_by_share_code(TEXT);",
	"DROP FUNCTION IF EXISTS public.get_campaign_invite_by_token(TEXT);",
);
const invitePreviewFunction = between(
	migration,
	"DROP FUNCTION IF EXISTS public.get_campaign_invite_by_token(TEXT);",
	"-- Internal invite helpers",
);
const campaignCreationFunction = between(
	migration,
	"CREATE OR REPLACE FUNCTION public.create_campaign_with_code(",
	"-- Preserve the six-argument signature",
);
const guildCreationFunction = between(
	migration,
	"CREATE OR REPLACE FUNCTION public.create_guild_with_code(",
	"-- The trigger is not an RPC.",
);

const createCampaignHook = between(
	normalize(campaignsSource),
	"export const useCreateCampaign = () => {",
	"// Update campaign mutation",
);
const joinCampaignHook = between(
	normalize(campaignsSource),
	"export const useJoinCampaign = () => {",
	"// Link character to existing membership mutation",
);
const linkCampaignCharacterHook = between(
	normalize(campaignsSource),
	"export const useLinkCampaignCharacter = () => {",
	"// Update campaign member role mutation",
);
const createInviteHook = between(
	normalize(campaignInvitesSource),
	"export const useCreateCampaignInvite = () => {",
	"export const useAddAscendantCharacterToCampaign = () => {",
);
const revokeInviteHook = between(
	normalize(campaignInvitesSource),
	"export const useDeleteCampaignInvite = () => {",
	"export const useCampaignInviteByToken = (token: string) => {",
);
const createGuildHook = between(
	normalize(guildsSource),
	"export const useCreateGuild = () => {",
	"/** Recruit an NPC into a guild */",
);
const wardenDeliveryHook = between(
	normalize(wardenDeliverySource),
	"export function useWardenItemDelivery() {",
	"function normalizeInventoryType(",
);

describe("Supabase security hardening source contract", () => {
	it("projects the two anonymous lookups to their approved DTOs", () => {
		expect(campaignPreviewFunction).toMatch(
			/RETURNS TABLE \(\s*id UUID,\s*name TEXT,\s*description TEXT,\s*share_code TEXT,\s*is_active BOOLEAN\s*\)/,
		);
		expect(campaignPreviewFunction).not.toMatch(
			/warden_id|party_gold|settings|created_at|updated_at/,
		);

		expect(invitePreviewFunction).toMatch(
			/RETURNS TABLE \(\s*campaign_id UUID,\s*campaign_name TEXT,\s*campaign_description TEXT,\s*role TEXT,\s*expires_at TIMESTAMPTZ,\s*status TEXT\s*\)/,
		);
		expect(invitePreviewFunction).not.toMatch(
			/invite_email|join_code TEXT|max_uses INTEGER|used_count INTEGER/,
		);
	});

	it("revokes implicit execution and grants anon only the two previews", () => {
		expect(migration).toContain(
			"REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon, authenticated;",
		);
		expect(migration).toContain(
			"GRANT EXECUTE ON FUNCTION public.get_campaign_by_share_code(TEXT)\n  TO anon, authenticated;",
		);
		expect(migration).toContain(
			"GRANT EXECUTE ON FUNCTION public.get_campaign_invite_by_token(TEXT)\n  TO anon, authenticated;",
		);
		expect(migration).toContain(
			"DROP FUNCTION IF EXISTS public.exec_sql(TEXT);",
		);
	});

	it("binds campaign and guild creation to auth.uid()", () => {
		for (const block of [campaignCreationFunction, guildCreationFunction]) {
			expect(block).toContain("v_actor UUID := auth.uid()");
			expect(block).toContain("IS DISTINCT FROM v_actor");
			expect(block).toContain("Actor mismatch");
		}
		expect(campaignCreationFunction).toMatch(
			/VALUES \(btrim\(p_name\), NULLIF\(btrim\(p_description\), ''\), v_actor, v_share_code\)/,
		);
		expect(guildCreationFunction).toMatch(
			/NULLIF\(btrim\(p_motto\), ''\),\s*v_actor,\s*p_campaign_id/,
		);
	});

	it("uses canonical app_metadata for account administration", () => {
		expect(migration).toContain(
			"auth_user.raw_app_meta_data ->> 'account_role' = 'admin'",
		);
		expect(authContextSource).toContain(
			'authUser.app_metadata?.account_role === "admin"',
		);
		expect(adminHooksSource).toContain(
			"enabled: isSupabaseConfigured && accountAdminId !== null",
		);
		expect(adminHooksSource).toContain("if (!user?.isAccountAdmin)");
		expect(adminPageSource).toContain("{canManageAccounts && (");
	});

	it("removes broad listing policies but preserves owner-prefixed known URLs", () => {
		for (const policy of [
			"Public read access for audio tracks",
			"Anyone can view avatars",
			"Public read access for character portraits",
			"Public read access for custom tokens",
			"Public read access for generated art",
		]) {
			expect(migration).toContain(
				`DROP POLICY IF EXISTS "${policy}" ON storage.objects;`,
			);
		}
		expect(migration).toContain(
			'CREATE POLICY "Owners can select their public assets"',
		);
		expect(migration).toContain(
			"(storage.foldername(name))[1] = (SELECT auth.uid())::TEXT",
		);
		expect(portraitSource).toContain(
			`const filePath = \`\${user.id}/portraits/\${fileName}\`;`,
		);
	});

	it("keeps configured backend mutations fail-closed when RPCs fail", () => {
		expect(createCampaignHook).toContain(
			'supabase.rpc("create_campaign_with_code"',
		);
		expect(createCampaignHook).not.toMatch(
			/\.from\("campaigns"\)\s*\.insert|\.from\("campaign_members"\)\s*\.insert/,
		);

		expect(joinCampaignHook).toContain('supabase.rpc("join_campaign_by_code"');
		expect(joinCampaignHook).not.toContain(
			'supabase.rpc("join_campaign_by_id"',
		);
		expect(joinCampaignHook).not.toMatch(
			/\.from\("campaign_members"\)\s*\.(insert|update|upsert)/,
		);
		expect(linkCampaignCharacterHook).toContain(
			'"add_ascendant_character_to_campaign"',
		);
		expect(linkCampaignCharacterHook).not.toMatch(
			/\.from\("campaign_members"\)\s*\.(insert|update|upsert)/,
		);

		expect(createInviteHook).toContain('supabase.rpc("create_campaign_invite"');
		expect(createInviteHook).not.toMatch(
			/\.from\("campaign_invites"\)\s*\.(insert|update|upsert|delete)/,
		);
		expect(revokeInviteHook).toContain('supabase.rpc("revoke_campaign_invite"');
		expect(revokeInviteHook).not.toMatch(
			/\.from\("campaign_invites"\)\s*\.(insert|update|upsert|delete)/,
		);

		expect(createGuildHook).toContain('supabase.rpc("create_guild_with_code"');
		expect(createGuildHook).not.toMatch(
			/\.from\("guilds"\)\s*\.insert|\.from\("guild_members"\)\s*\.insert/,
		);

		expect(wardenDeliveryHook).toContain(
			'const { error } = await rpcClient("warden_grant_character_equipment"',
		);
		expect(wardenDeliveryHook).not.toMatch(
			/\.from\("character_equipment"\)\s*\.(insert|upsert)/,
		);
	});

	it("keeps generated API types aligned with the hardened catalog", () => {
		expect(generatedTypesSource).not.toContain("exec_sql:");
		const campaignType = between(
			generatedTypesSource,
			"get_campaign_by_share_code:",
			"get_campaign_invite_by_token:",
		);
		expect(campaignType).toContain("description: string;");
		expect(campaignType).toContain("share_code: string;");
		expect(campaignType).not.toMatch(/warden_id|party_gold|settings/);

		const inviteType = between(
			generatedTypesSource,
			"get_campaign_invite_by_token:",
			"get_campaign_linked_characters:",
		);
		expect(inviteType).toContain("campaign_description: string;");
		expect(inviteType).toContain("status: string;");
		expect(inviteType).not.toMatch(
			/invite_email|join_code|max_uses|used_count/,
		);
	});
});
