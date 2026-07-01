// Local (guest-mode) store + operations for guild join requests. Pure over
// localStorage so the flow is unit-testable; the Supabase path lives in the
// useJoinRequests hook and mirrors these semantics.

import {
	type GuildMember,
	loadLocalGuildMembers,
	loadLocalGuilds,
	saveLocalGuildMembers,
} from "@/hooks/useGuilds";
import { AppError } from "@/lib/appError";
import { listLocalCharacters } from "@/lib/guestStore";
import type { GuildRole } from "@/lib/guildPermissions";

export interface GuildJoinRequest {
	id: string;
	guild_id: string;
	user_id: string;
	character_id: string | null;
	character_name: string | null;
	message: string | null;
	status: "pending" | "approved" | "rejected";
	created_at: string | null;
}

export type ApprovableRole = Extract<
	GuildRole,
	"officer" | "member" | "recruit"
>;

const JOIN_REQUESTS_KEY = "solo-compendium.guilds.joinrequests.v1";

export const loadLocalJoinRequests = (): GuildJoinRequest[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(JOIN_REQUESTS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as GuildJoinRequest[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalJoinRequests = (requests: GuildJoinRequest[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify(requests));
};

export const listLocalPendingJoinRequests = (
	guildId: string,
): GuildJoinRequest[] =>
	loadLocalJoinRequests().filter(
		(r) => r.guild_id === guildId && r.status === "pending",
	);

/** File a pending join request against a guild identified by share code. */
export const requestToJoinGuildLocal = (params: {
	shareCode: string;
	userId: string;
	characterId?: string;
	message?: string;
}): GuildJoinRequest => {
	const code = params.shareCode.trim().toUpperCase();
	if (!code) throw new AppError("Enter a share code", "INVALID_INPUT");

	const guild = loadLocalGuilds().find((g) => g.share_code === code);
	if (!guild)
		throw new AppError("No guild found for that share code", "NOT_FOUND");

	if (
		loadLocalGuildMembers().some(
			(m) => m.guild_id === guild.id && m.user_id === params.userId,
		)
	)
		throw new AppError(
			"You are already a member of this guild",
			"INVALID_INPUT",
		);

	const requests = loadLocalJoinRequests();
	if (
		requests.some(
			(r) =>
				r.guild_id === guild.id &&
				r.user_id === params.userId &&
				r.status === "pending",
		)
	)
		throw new AppError(
			"You already have a pending request for this guild",
			"INVALID_INPUT",
		);

	const characterName = params.characterId
		? (listLocalCharacters().find((c) => c.id === params.characterId)?.name ??
			null)
		: null;
	const request: GuildJoinRequest = {
		id: crypto.randomUUID(),
		guild_id: guild.id,
		user_id: params.userId,
		character_id: params.characterId ?? null,
		character_name: characterName,
		message: params.message ?? null,
		status: "pending",
		created_at: new Date().toISOString(),
	};
	requests.push(request);
	saveLocalJoinRequests(requests);
	return request;
};

/** Approve a pending request → add a character-bound member, mark approved. */
export const approveJoinRequestLocal = (params: {
	requestId: string;
	role?: ApprovableRole;
}): void => {
	const role = params.role ?? "member";
	const requests = loadLocalJoinRequests();
	const req = requests.find((r) => r.id === params.requestId);
	if (!req || req.status !== "pending")
		throw new AppError(
			"Join request not found or already resolved",
			"NOT_FOUND",
		);
	// One guild per character — the same hard stop as the DB unique index.
	if (
		req.character_id &&
		loadLocalGuildMembers().some((m) => m.character_id === req.character_id)
	)
		throw new AppError(
			"That character already belongs to a guild",
			"INVALID_INPUT",
		);
	const member: GuildMember = {
		id: crypto.randomUUID(),
		guild_id: req.guild_id,
		user_id: req.user_id,
		character_id: req.character_id,
		npc_id: null,
		npc_name: null,
		npc_data: null,
		role,
		joined_at: new Date().toISOString(),
		npc_level: null,
		npc_xp: null,
		npc_leveling_mode: null,
	};
	saveLocalGuildMembers([...loadLocalGuildMembers(), member]);
	req.status = "approved";
	saveLocalJoinRequests(requests);
};

/** Reject a pending request. */
export const rejectJoinRequestLocal = (requestId: string): void => {
	const requests = loadLocalJoinRequests();
	const req = requests.find((r) => r.id === requestId);
	if (req) {
		req.status = "rejected";
		saveLocalJoinRequests(requests);
	}
};
