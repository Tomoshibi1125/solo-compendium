import { describe, expect, it } from "vitest";
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

	it("restricts role updates to the primary Warden and protects the Warden role", () => {
		expect(campaignHooksSource).toContain(
			"Only the primary Warden can manage roles",
		);
		expect(campaignHooksSource).toContain(
			"The primary Warden role cannot be changed",
		);
		expect(campaignDetailSource).toContain("isPrimaryWarden && !isWarden");
	});

	it("records audit details for role changes", () => {
		expect(campaignHooksSource).toContain("campaign_invite_audit_logs");
		expect(campaignHooksSource).toContain('action: "member_role_updated"');
		expect(campaignHooksSource).toContain("previous_role: member.role");
		expect(campaignHooksSource).toContain("next_role: role");
	});

	it("allows co-wardens to opt into Warden mode without promoting ascendants", () => {
		expect(roleModeSource).toContain('eligibleRole === "co-warden"');
		expect(roleModeSource).toContain('storedMode === "warden"');
		expect(roleModeSource).toContain("canChooseWardenMode");
	});
});
