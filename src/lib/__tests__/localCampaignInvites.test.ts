import { beforeEach, describe, expect, it } from "vitest";
import { saveLocalCampaigns } from "@/hooks/useCampaigns";
import { AppError } from "@/lib/appError";
import { createLocalCharacter, getLocalUserId } from "@/lib/guestStore";
import {
	attachLocalCampaignCharacter,
	createLocalCampaignInvite,
	getLocalCampaignInvite,
	listLocalCampaignInviteAudit,
	listLocalCampaignInvites,
	redeemLocalCampaignInvite,
	revokeLocalCampaignInvite,
} from "@/lib/localCampaignInvites";

const campaignId = "local-campaign-1";
const USER_KEY = "solo-compendium.guest.user";

function seedCampaign() {
	saveLocalCampaigns([
		{
			id: campaignId,
			name: "Local Test Campaign",
			description: null,
			warden_id: getLocalUserId(),
			share_code: "LOCAL1",
			is_active: true,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			settings: {},
		},
	]);
}

beforeEach(() => {
	window.localStorage.clear();
	seedCampaign();
});

describe("local campaign invites", () => {
	it("persists an invite and redeems it with multiple owned characters", () => {
		const first = createLocalCharacter({ name: "Aster" });
		const second = createLocalCharacter({ name: "Bram" });
		const invite = createLocalCampaignInvite({
			campaignId,
			role: "ascendant",
			maxUses: 2,
		});

		expect(getLocalCampaignInvite(invite.token)).toMatchObject({
			id: invite.id,
			used_count: 0,
		});
		expect(listLocalCampaignInvites(campaignId)).toHaveLength(1);

		expect(redeemLocalCampaignInvite(invite.join_code, first.id)).toBe(
			campaignId,
		);
		// The same browser identity can attach a secondary character without
		// creating a second campaign member row.
		expect(redeemLocalCampaignInvite(invite.token, second.id)).toBe(campaignId);
		attachLocalCampaignCharacter(campaignId, first.id);

		const member = JSON.parse(
			window.localStorage.getItem("solo-compendium.campaigns.members.v1") ||
				"[]",
		) as Array<{ character_id: string; character_ids?: string[] }>;
		expect(member).toHaveLength(1);
		expect(member[0].character_id).toBe(first.id);
		expect(member[0].character_ids).toEqual([first.id, second.id]);
		expect(getLocalCampaignInvite(invite.token)?.used_count).toBe(1);
		expect(
			listLocalCampaignInviteAudit(campaignId).map((event) => event.action),
		).toEqual(["invite_accepted", "invite_accepted", "invite_created"]);
	});

	it("enforces exhausted uses for another local profile", () => {
		const character = createLocalCharacter({ name: "Aster" });
		const invite = createLocalCampaignInvite({
			campaignId,
			role: "ascendant",
			maxUses: 1,
		});
		redeemLocalCampaignInvite(invite.token, character.id);
		window.localStorage.setItem(USER_KEY, "another-local-profile");

		expect(() => redeemLocalCampaignInvite(invite.token)).toThrow(
			"Invite already used",
		);
	});

	it("rejects email invites and expired, revoked, or unknown links", () => {
		expect(() =>
			createLocalCampaignInvite({
				campaignId,
				role: "ascendant",
				maxUses: 1,
				inviteEmail: "player@example.test",
			}),
		).toThrow("Email invitations require an authenticated cloud campaign");

		const expired = createLocalCampaignInvite({
			campaignId,
			role: "ascendant",
			maxUses: 1,
		});
		const stored = JSON.parse(
			window.localStorage.getItem("solo-compendium.campaign-invites.v1") ||
				"[]",
		) as Array<Record<string, unknown>>;
		stored[0].expires_at = new Date(Date.now() - 60_000).toISOString();
		window.localStorage.setItem(
			"solo-compendium.campaign-invites.v1",
			JSON.stringify(stored),
		);
		expect(() => redeemLocalCampaignInvite(expired.token)).toThrow(
			"Invite expired",
		);

		const revocable = createLocalCampaignInvite({
			campaignId,
			role: "ascendant",
			maxUses: 1,
		});
		expect(revokeLocalCampaignInvite(revocable.id, "Changed plans")).toBe(true);
		expect(() => redeemLocalCampaignInvite(revocable.token)).toThrow(
			"Invite revoked",
		);
		expect(() => redeemLocalCampaignInvite("unknown-token")).toThrow(AppError);
		expect(listLocalCampaignInviteAudit(campaignId)[0].action).toBe(
			"invite_revoked",
		);
	});
});
