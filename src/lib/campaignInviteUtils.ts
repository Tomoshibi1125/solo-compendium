export type CampaignInviteStatus =
	| "active"
	| "expired"
	| "revoked"
	| "used_up"
	| "unknown";

const SHARE_CODE_REGEX = /^[A-Z0-9]{6}$/;

export const normalizeInviteAccessKey = (
	value: string | null | undefined,
): string => {
	return (value ?? "").trim();
};

export const isLikelyShareCode = (
	value: string | null | undefined,
): boolean => {
	const normalized = normalizeInviteAccessKey(value).toUpperCase();
	return SHARE_CODE_REGEX.test(normalized);
};

export const isSafeNextPath = (
	value: string | null | undefined,
): value is string => {
	if (!value) return false;
	return value.startsWith("/") && !value.startsWith("//");
};

export const buildCampaignInviteUrl = (
	origin: string,
	accessKey: string,
): string => {
	const normalizedOrigin = origin.replace(/\/$/, "");
	const key = normalizeInviteAccessKey(accessKey);
	return `${normalizedOrigin}/campaigns/join/${encodeURIComponent(key)}`;
};

export const deriveCampaignInviteStatus = (invite: {
	status?: string | null;
	revoked_at?: string | null;
	expires_at?: string | null;
	max_uses?: number | null;
	used_count?: number | null;
}): CampaignInviteStatus => {
	const normalizedStatus = (invite.status ?? "").toLowerCase();
	if (
		normalizedStatus === "active" ||
		normalizedStatus === "expired" ||
		normalizedStatus === "revoked"
	) {
		return normalizedStatus;
	}
	if (normalizedStatus === "used_up" || normalizedStatus === "used") {
		return "used_up";
	}

	if (invite.revoked_at) return "revoked";
	if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now())
		return "expired";
	if (
		typeof invite.max_uses === "number" &&
		typeof invite.used_count === "number" &&
		invite.max_uses > 0 &&
		invite.used_count >= invite.max_uses
	) {
		return "used_up";
	}

	return "active";
};

export const isCampaignInviteJoinable = (
	status: CampaignInviteStatus,
): boolean => {
	return status === "active" || status === "used_up";
};

export const campaignInviteStatusLabel = (
	status: CampaignInviteStatus,
): string => {
	switch (status) {
		case "active":
			return "Active";
		case "expired":
			return "Expired";
		case "revoked":
			return "Revoked";
		case "used_up":
			return "Used up";
		default:
			return "Unknown";
	}
};

export const campaignInviteStatusMessage = (
	status: CampaignInviteStatus,
): string => {
	switch (status) {
		case "active":
			return "This invite is valid. You can join now.";
		case "expired":
			return "This invite has expired. Ask your Protocol Warden for a fresh invite.";
		case "revoked":
			return "This invite has been revoked by the Protocol Warden.";
		case "used_up":
			return "This invite reached its usage cap. Existing members can still re-open it to attach another character.";
		default:
			return "This invite cannot be verified right now.";
	}
};
