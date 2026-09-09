import { describe, expect, it } from "vitest";
import campaignRosterMigrationSource from "../../../supabase/migrations/20260908000000_campaign_roster_security.sql?raw";
import roleModeSource from "../../hooks/useCampaignRoleMode.ts?raw";
import campaignHooksSource from "../../hooks/useCampaigns.ts?raw";
import campaignDetailSource from "../../pages/CampaignDetail.tsx?raw";

describe("co-warden role flow source invariants", () => {
	it("exposes only ascendant and co-warden as mutable member roles", () => {
		expect(campaignHooksSource).toContain('role: "ascendant" | "co-warden";');
		expect(campaignDetailSource).toContain(
			'type ManagedCampaignRole = "ascendant" | "co-warden";',
		);
		expect(campaignDetailSource).toContain('<SelectItem value="co-warden">');
		expect(campaignDetailSource).not.toContain('value="co-system"');
	});

	it("allows primary and co-Wardens to manage non-primary roles while protecting the Warden role", () => {
		expect(campaignHooksSource).toContain("Campaign manager access required");
		expect(campaignHooksSource).toContain(
			"The primary Warden role cannot be changed",
		);
		expect(campaignDetailSource).toContain("hasWardenAccess && !isWarden");
	});

	it("records audit details for role changes", () => {
		expect(campaignRosterMigrationSource).toContain(
			"campaign_invite_audit_logs",
		);
		expect(campaignRosterMigrationSource).toContain("'member_role_updated'");
		expect(campaignRosterMigrationSource).toContain("previous_role");
		expect(campaignRosterMigrationSource).toContain("next_role");
	});

	it("allows co-wardens to opt into Warden mode without promoting ascendants", () => {
		expect(roleModeSource).toContain('eligibleRole === "co-warden"');
		expect(roleModeSource).toContain('storedMode === "warden"');
		expect(roleModeSource).toContain("canChooseWardenMode");
	});
});
