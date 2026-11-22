import {
	type Campaign,
	type CampaignMember,
	loadLocalCampaigns,
	loadLocalMembers,
	saveLocalMembers,
} from "@/hooks/useCampaigns";
import { AppError } from "@/lib/appError";
import { deriveCampaignInviteStatus } from "@/lib/campaignInviteUtils";
import { getLocalUserId, listLocalCharacters } from "@/lib/guestStore";

export type LocalCampaignInvite = {
	id: string;
	campaign_id: string;
	token: string;
	join_code: string;
	role: "ascendant" | "co-warden";
	expires_at: string | null;
	max_uses: number;
	used_count: number;
	created_at: string;
	created_by: string;
	updated_at: string;
	last_used_at: string | null;
	invite_email: string | null;
	revoked_at: string | null;
	revoked_by: string | null;
	revoked_reason: string | null;
	accepted_user_ids: string[];
};

export type LocalInviteAudit = {
	id: string;
	campaign_id: string;
	invite_id: string;
	actor_id: string;
	action: "invite_created" | "invite_accepted" | "invite_revoked";
	created_at: string;
};

const INVITES_KEY = "solo-compendium.campaign-invites.v1";
const AUDIT_KEY = "solo-compendium.campaign-invite-audit.v1";

const readArray = <T>(key: string): T[] => {
	if (typeof window === "undefined") return [];
	try {
		const parsed = JSON.parse(window.localStorage.getItem(key) || "[]") as T[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const writeArray = <T>(key: string, values: T[]) => {
	if (typeof window !== "undefined") {
		window.localStorage.setItem(key, JSON.stringify(values));
	}
};

export const listLocalCampaignInvites = (
	campaignId: string,
): LocalCampaignInvite[] =>
	readArray<LocalCampaignInvite>(INVITES_KEY)
		.filter((invite) => invite.campaign_id === campaignId)
		.sort((a, b) => b.created_at.localeCompare(a.created_at));

export const getLocalCampaignInvite = (
	accessKey: string,
): LocalCampaignInvite | null => {
	const key = accessKey.trim();
	if (!key) return null;
	return (
		readArray<LocalCampaignInvite>(INVITES_KEY).find(
			(invite) =>
				invite.token === key || invite.join_code === key.toUpperCase(),
		) ?? null
	);
};

const addAudit = (
	invite: LocalCampaignInvite,
	action: LocalInviteAudit["action"],
	actorId: string,
) => {
	writeArray<LocalInviteAudit>(AUDIT_KEY, [
		{
			id: crypto.randomUUID(),
			campaign_id: invite.campaign_id,
			invite_id: invite.id,
			actor_id: actorId,
			action,
			created_at: new Date().toISOString(),
		},
		...readArray<LocalInviteAudit>(AUDIT_KEY),
	]);
};

export const listLocalCampaignInviteAudit = (
	campaignId: string,
): LocalInviteAudit[] =>
	readArray<LocalInviteAudit>(AUDIT_KEY)
		.filter((entry) => entry.campaign_id === campaignId)
		.slice(0, 50);

const requireLocalCampaignManager = (campaignId: string): Campaign => {
	const campaign = loadLocalCampaigns().find(
		(entry) => entry.id === campaignId,
	);
	if (!campaign) throw new AppError("Campaign not found", "NOT_FOUND");
	const actor = getLocalUserId();
	const isManager =
		campaign.warden_id === actor ||
		loadLocalMembers().some(
			(member) =>
				member.campaign_id === campaignId &&
				member.user_id === actor &&
				member.role === "co-warden",
		);
	if (!isManager) throw new AppError("Warden access required", "FORBIDDEN");
	return campaign;
};

const newAccessKey = (prefix: string) =>
	`${prefix}${crypto.randomUUID().replaceAll("-", "")}`;

export const createLocalCampaignInvite = (input: {
	campaignId: string;
	role: "ascendant" | "co-warden";
	expiresAt?: string | null;
	maxUses: number;
	inviteEmail?: string;
}): LocalCampaignInvite => {
	if (input.inviteEmail?.trim()) {
		throw new AppError(
			"Email invitations require an authenticated cloud campaign. Sign in to send this invite by email.",
			"CONFIG",
		);
	}
	requireLocalCampaignManager(input.campaignId);
	if (!Number.isInteger(input.maxUses) || input.maxUses < 1) {
		throw new AppError("Invite max uses must be at least 1", "INVALID_INPUT");
	}
	if (input.expiresAt) {
		const expiresAt = Date.parse(input.expiresAt);
		if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
			throw new AppError(
				"Invite expiration must be a valid future date",
				"INVALID_INPUT",
			);
		}
	}

	const createdAt = new Date().toISOString();
	const invite: LocalCampaignInvite = {
		id: crypto.randomUUID(),
		campaign_id: input.campaignId,
		token: newAccessKey("local_"),
		join_code: newAccessKey("L").slice(0, 8).toUpperCase(),
		role: input.role,
		expires_at: input.expiresAt ?? null,
		max_uses: input.maxUses,
		used_count: 0,
		created_at: createdAt,
		created_by: getLocalUserId(),
		updated_at: createdAt,
		last_used_at: null,
		invite_email: null,
		revoked_at: null,
		revoked_by: null,
		revoked_reason: null,
		accepted_user_ids: [],
	};
	writeArray(INVITES_KEY, [
		invite,
		...readArray<LocalCampaignInvite>(INVITES_KEY),
	]);
	addAudit(invite, "invite_created", invite.created_by);
	return invite;
};

export const revokeLocalCampaignInvite = (
	inviteId: string,
	reason?: string,
): boolean => {
	const invites = readArray<LocalCampaignInvite>(INVITES_KEY);
	const invite = invites.find((entry) => entry.id === inviteId);
	if (!invite || invite.revoked_at) return false;
	requireLocalCampaignManager(invite.campaign_id);
	const now = new Date().toISOString();
	invite.revoked_at = now;
	invite.revoked_by = getLocalUserId();
	invite.revoked_reason = reason?.trim() || null;
	invite.updated_at = now;
	writeArray(INVITES_KEY, invites);
	addAudit(invite, "invite_revoked", invite.revoked_by);
	return true;
};

export const redeemLocalCampaignInvite = (
	accessKey: string,
	characterId?: string,
): string => {
	const invite = getLocalCampaignInvite(accessKey);
	if (!invite) throw new AppError("Invite not found", "NOT_FOUND");
	const campaign = loadLocalCampaigns().find(
		(entry) => entry.id === invite.campaign_id,
	);
	if (!campaign?.is_active)
		throw new AppError("Campaign inactive", "FORBIDDEN");
	const status = deriveCampaignInviteStatus(invite);
	if (status === "revoked") throw new AppError("Invite revoked", "FORBIDDEN");
	if (status === "expired") throw new AppError("Invite expired", "FORBIDDEN");

	const actorId = getLocalUserId();
	const members = loadLocalMembers();
	const memberIndex = members.findIndex(
		(entry) =>
			entry.campaign_id === invite.campaign_id && entry.user_id === actorId,
	);
	const existingMember = memberIndex >= 0;
	const alreadyAccepted = invite.accepted_user_ids.includes(actorId);
	if (
		invite.used_count >= invite.max_uses &&
		!alreadyAccepted &&
		!existingMember
	) {
		throw new AppError("Invite already used", "FORBIDDEN");
	}

	if (
		characterId &&
		!listLocalCharacters().some((entry) => entry.id === characterId)
	) {
		throw new AppError("Character ownership validation failed", "FORBIDDEN");
	}

	if (existingMember) {
		const member = members[memberIndex] as CampaignMember & {
			character_ids?: string[];
		};
		const characterIds = new Set(member.character_ids ?? []);
		if (member.character_id) characterIds.add(member.character_id);
		if (characterId) characterIds.add(characterId);
		member.character_ids = [...characterIds];
		if (!member.character_id && characterId) member.character_id = characterId;
		if (!alreadyAccepted && invite.used_count < invite.max_uses) {
			invite.used_count += 1;
			invite.accepted_user_ids.push(actorId);
		}
	} else {
		members.push({
			id: crypto.randomUUID(),
			campaign_id: invite.campaign_id,
			user_id: actorId,
			character_id: characterId ?? null,
			role: invite.role,
			joined_at: new Date().toISOString(),
			character_ids: characterId ? [characterId] : [],
		} as CampaignMember);
		invite.used_count += 1;
		invite.accepted_user_ids.push(actorId);
	}

	saveLocalMembers(members);
	invite.last_used_at = new Date().toISOString();
	invite.updated_at = invite.last_used_at;
	writeArray(
		INVITES_KEY,
		readArray<LocalCampaignInvite>(INVITES_KEY).map((entry) =>
			entry.id === invite.id ? invite : entry,
		),
	);
	addAudit(invite, "invite_accepted", actorId);
	return invite.campaign_id;
};

export const attachLocalCampaignCharacter = (
	campaignId: string,
	characterId: string,
): void => {
	if (!listLocalCharacters().some((entry) => entry.id === characterId)) {
		throw new AppError("Character ownership validation failed", "FORBIDDEN");
	}
	const userId = getLocalUserId();
	const members = loadLocalMembers();
	const index = members.findIndex(
		(entry) => entry.campaign_id === campaignId && entry.user_id === userId,
	);
	if (index < 0)
		throw new AppError("Not a member of this campaign", "NOT_FOUND");
	const member = members[index] as CampaignMember & {
		character_ids?: string[];
	};
	const characterIds = new Set(member.character_ids ?? []);
	if (member.character_id) characterIds.add(member.character_id);
	characterIds.add(characterId);
	member.character_ids = [...characterIds];
	if (!member.character_id) member.character_id = characterId;
	saveLocalMembers(members);
};
