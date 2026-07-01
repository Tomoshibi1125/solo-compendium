import { describe, expect, it } from "vitest";
import {
	assignableRoles,
	canActOnMember,
	type GuildRole,
	guildCapabilities,
	guildRoleLabel,
	guildRoleWeight,
	resolveGuildRole,
} from "@/lib/guildPermissions";

/**
 * Mirrors the predicate GuildDetail.tsx uses to decide whether to show a
 * member's promote/demote/kick action menu. Kept in lock-step with the page.
 */
const showsMemberMenu = (
	actorRole: GuildRole | null,
	targetRole: GuildRole,
): boolean => {
	if (!actorRole) return false;
	const caps = guildCapabilities(actorRole);
	return (
		targetRole !== "leader" &&
		canActOnMember(actorRole, targetRole) &&
		(caps.canChangeRole || caps.canKickMember || caps.canTransferLeadership)
	);
};

describe("guildCapabilities", () => {
	it("gives the Guild Master every capability", () => {
		const c = guildCapabilities("leader");
		expect(Object.values(c).every(Boolean)).toBe(true);
	});

	it("lets the Vice-Master manage the guild but not disband or transfer", () => {
		const c = guildCapabilities("vice_master");
		expect(c.canEditInfo).toBe(true);
		expect(c.canKickMember).toBe(true);
		expect(c.canManageTreasury).toBe(true);
		expect(c.canDisband).toBe(false);
		expect(c.canTransferLeadership).toBe(false);
		expect(c.canManageSkills).toBe(false);
	});

	it("lets Officers recruit and run quests but not kick or change roles", () => {
		const c = guildCapabilities("officer");
		expect(c.canRecruit).toBe(true);
		expect(c.canManageQuests).toBe(true);
		expect(c.canKickMember).toBe(false);
		expect(c.canChangeRole).toBe(false);
		expect(c.canManageTreasury).toBe(false);
	});

	it("gives plain members and recruits no management powers", () => {
		for (const role of ["member", "recruit"] as GuildRole[]) {
			const c = guildCapabilities(role);
			expect(c.canRecruit).toBe(false);
			expect(c.canKickMember).toBe(false);
			expect(c.canEditInfo).toBe(false);
		}
	});

	it("treats an absent role as the least-privileged", () => {
		expect(guildCapabilities(null)).toEqual(guildCapabilities("recruit"));
	});
});

describe("hierarchy guards (role-only, never hunter-rank)", () => {
	it("only acts on strictly-lower roles", () => {
		expect(canActOnMember("leader", "vice_master")).toBe(true);
		expect(canActOnMember("vice_master", "officer")).toBe(true);
		expect(canActOnMember("officer", "member")).toBe(true);
		// peers and superiors are off-limits
		expect(canActOnMember("officer", "officer")).toBe(false);
		expect(canActOnMember("member", "officer")).toBe(false);
		expect(canActOnMember("vice_master", "leader")).toBe(false);
	});

	it("only assigns roles below the actor", () => {
		expect(assignableRoles("leader")).toEqual([
			"vice_master",
			"officer",
			"member",
			"recruit",
		]);
		expect(assignableRoles("vice_master")).toEqual([
			"officer",
			"member",
			"recruit",
		]);
		expect(assignableRoles("officer")).toEqual(["member", "recruit"]);
		expect(assignableRoles("member")).toEqual(["recruit"]);
		expect(assignableRoles("recruit")).toEqual([]);
	});

	it("orders the hierarchy correctly", () => {
		expect(guildRoleWeight("leader")).toBeGreaterThan(
			guildRoleWeight("vice_master"),
		);
		expect(guildRoleWeight("recruit")).toBe(0);
	});
});

describe("resolveGuildRole", () => {
	const members = [
		{ user_id: "u-leader", role: "leader" },
		{ user_id: "u-vice", role: "vice_master" },
		{ user_id: null, role: "recruit" }, // an NPC recruit
	];

	it("returns leader for the guild's leader_user_id even without a row", () => {
		expect(resolveGuildRole([], "u-leader", "u-leader")).toBe("leader");
	});

	it("reads the role from the member list", () => {
		expect(resolveGuildRole(members, "u-vice", "u-leader")).toBe("vice_master");
	});

	it("returns null for non-members and guests", () => {
		expect(resolveGuildRole(members, "stranger", "u-leader")).toBeNull();
		expect(resolveGuildRole(members, null, "u-leader")).toBeNull();
	});
});

describe("GuildDetail member-menu visibility (capability + lower-role guard)", () => {
	it("lets staff act only on strictly-lower members", () => {
		expect(showsMemberMenu("leader", "vice_master")).toBe(true);
		expect(showsMemberMenu("leader", "member")).toBe(true);
		expect(showsMemberMenu("vice_master", "officer")).toBe(true);
		// never on a peer, a superior, or another leader
		expect(showsMemberMenu("vice_master", "vice_master")).toBe(false);
		expect(showsMemberMenu("officer", "vice_master")).toBe(false);
		expect(showsMemberMenu("vice_master", "leader")).toBe(false);
	});

	it("hides the menu from roles without management capabilities", () => {
		// officers can act on lower members by hierarchy, but lack kick/role/transfer caps
		expect(canActOnMember("officer", "member")).toBe(true);
		expect(showsMemberMenu("officer", "member")).toBe(false);
		expect(showsMemberMenu("member", "recruit")).toBe(false);
		expect(showsMemberMenu(null, "recruit")).toBe(false);
	});

	it("labels every role for the roster badge", () => {
		expect(guildRoleLabel("leader")).toBe("Guild Master");
		expect(guildRoleLabel("vice_master")).toBe("Vice-Master");
		expect(guildRoleLabel("recruit")).toBe("Recruit");
	});
});
