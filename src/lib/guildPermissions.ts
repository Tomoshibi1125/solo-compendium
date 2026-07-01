// ============================================================================
// Guild role-based permissions (Solo Leveling-style guild management)
//
// Permissions follow the GUILD-ROLE hierarchy only — Guild Master ▸ Vice-Master
// ▸ Officer ▸ Member ▸ Recruit. They are NEVER gated by an Ascendant's hunter
// rank (E–SS); member rank is informational. Guild creation is unrestricted.
// This module is pure (no app/DB deps) so it backs both UI gating and mutation
// guards from one source of truth.
// ============================================================================

export type GuildRole =
	| "leader"
	| "vice_master"
	| "officer"
	| "member"
	| "recruit";

export interface GuildCapabilities {
	/** Edit guild name / motto / description. */
	canEditInfo: boolean;
	/** Recruit NPCs / invite players. */
	canRecruit: boolean;
	/** Remove a (lower-ranked) member. */
	canKickMember: boolean;
	/** Promote / demote a (lower-ranked) member. */
	canChangeRole: boolean;
	/** Deposit / withdraw / pay out guild funds. */
	canManageTreasury: boolean;
	/** Accept and assign Warden-issued quests. */
	canManageQuests: boolean;
	/** Unlock / configure guild skills & base facilities. */
	canManageSkills: boolean;
	/** Approve or reject pending join requests. */
	canApproveJoins: boolean;
	/** Permanently disband the guild. */
	canDisband: boolean;
	/** Hand the Guild Master role to another member. */
	canTransferLeadership: boolean;
}

/** Hierarchy weight — higher acts on lower. */
const ROLE_ORDER: Record<GuildRole, number> = {
	leader: 4,
	vice_master: 3,
	officer: 2,
	member: 1,
	recruit: 0,
};

export const GUILD_ROLES: GuildRole[] = [
	"leader",
	"vice_master",
	"officer",
	"member",
	"recruit",
];

export function guildRoleWeight(role: GuildRole): number {
	return ROLE_ORDER[role] ?? 0;
}

/** Human label for a role. */
export function guildRoleLabel(role: GuildRole): string {
	switch (role) {
		case "leader":
			return "Guild Master";
		case "vice_master":
			return "Vice-Master";
		case "officer":
			return "Officer";
		case "member":
			return "Member";
		default:
			return "Recruit";
	}
}

/** Capabilities for a given role. Unknown/absent role → recruit (least power). */
export function guildCapabilities(
	role: GuildRole | null | undefined,
): GuildCapabilities {
	const r: GuildRole = role ?? "recruit";
	const isLeader = r === "leader";
	const isVicePlus = r === "leader" || r === "vice_master";
	const isOfficerPlus = isVicePlus || r === "officer";
	return {
		canEditInfo: isVicePlus,
		canRecruit: isOfficerPlus,
		canKickMember: isVicePlus,
		canChangeRole: isVicePlus,
		canManageTreasury: isVicePlus,
		canManageQuests: isOfficerPlus,
		canManageSkills: isLeader,
		canApproveJoins: isVicePlus,
		canDisband: isLeader,
		canTransferLeadership: isLeader,
	};
}

/**
 * Whether `actor` may kick or change the role of `target`. A staff member can
 * only act on members STRICTLY below them in the hierarchy (never a peer or
 * superior, and never themselves).
 */
export function canActOnMember(actor: GuildRole, target: GuildRole): boolean {
	return guildRoleWeight(actor) > guildRoleWeight(target);
}

/**
 * The roles an actor is allowed to assign when changing someone's role — only
 * roles strictly below the actor's own (so an actor can never create a peer or
 * promote above themselves; transferring leadership is a separate action).
 */
export function assignableRoles(actor: GuildRole): GuildRole[] {
	const max = guildRoleWeight(actor);
	// Leadership transfer is a separate action, so "leader" is never assignable here.
	return GUILD_ROLES.filter((r) => r !== "leader" && guildRoleWeight(r) < max);
}

/** Resolve a user's guild role from the member list (leader wins). */
export function resolveGuildRole(
	members: ReadonlyArray<{ user_id: string | null; role: string }>,
	userId: string | null | undefined,
	leaderUserId: string | null | undefined,
): GuildRole | null {
	if (!userId) return null;
	if (leaderUserId && userId === leaderUserId) return "leader";
	const found = members.find((m) => m.user_id === userId);
	return (found?.role as GuildRole) ?? null;
}
