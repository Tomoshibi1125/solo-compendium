import { beforeEach, describe, expect, it } from "vitest";
import { AppError } from "@/lib/appError";
import {
	approveJoinRequestLocal,
	listLocalPendingJoinRequests,
	loadLocalJoinRequests,
	rejectJoinRequestLocal,
	requestToJoinGuildLocal,
} from "@/lib/guildJoinRequests";

const GUILDS_KEY = "solo-compendium.guilds.v1";
const MEMBERS_KEY = "solo-compendium.guilds.members.v1";

const seedGuild = (overrides: Record<string, unknown> = {}) => {
	const guild = {
		id: "g-1",
		name: "Umbral Vanguard",
		description: null,
		motto: null,
		leader_user_id: "u-leader",
		campaign_id: null,
		share_code: "AB12CD",
		is_active: true,
		settings: {},
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		...overrides,
	};
	localStorage.setItem(GUILDS_KEY, JSON.stringify([guild]));
	localStorage.setItem(
		MEMBERS_KEY,
		JSON.stringify([
			{
				id: "m-leader",
				guild_id: "g-1",
				user_id: "u-leader",
				character_id: "c-leader",
				npc_id: null,
				npc_name: null,
				npc_data: null,
				role: "leader",
				joined_at: new Date().toISOString(),
				npc_level: null,
				npc_xp: null,
				npc_leveling_mode: null,
			},
		]),
	);
	return guild;
};

describe("guild join requests (local flow)", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("files a pending request by share code and admits via approval", () => {
		seedGuild();
		const req = requestToJoinGuildLocal({
			shareCode: "ab12cd", // case-insensitive
			userId: "u-applicant",
			characterId: undefined,
			message: "Let me in",
		});
		expect(req.status).toBe("pending");
		expect(listLocalPendingJoinRequests("g-1")).toHaveLength(1);

		approveJoinRequestLocal({ requestId: req.id, role: "member" });
		const members = JSON.parse(localStorage.getItem(MEMBERS_KEY) ?? "[]");
		expect(
			members.some((m: { user_id: string }) => m.user_id === "u-applicant"),
		).toBe(true);
		// The request is resolved, so the pending queue is empty again.
		expect(listLocalPendingJoinRequests("g-1")).toHaveLength(0);
		expect(loadLocalJoinRequests().find((r) => r.id === req.id)?.status).toBe(
			"approved",
		);
	});

	it("rejects an unknown share code", () => {
		seedGuild();
		expect(() =>
			requestToJoinGuildLocal({ shareCode: "ZZZZZZ", userId: "u-x" }),
		).toThrowError(AppError);
	});

	it("blocks a duplicate pending request from the same user", () => {
		seedGuild();
		requestToJoinGuildLocal({ shareCode: "AB12CD", userId: "u-applicant" });
		expect(() =>
			requestToJoinGuildLocal({ shareCode: "AB12CD", userId: "u-applicant" }),
		).toThrowError(/pending request/i);
	});

	it("blocks a request from an existing member", () => {
		seedGuild();
		expect(() =>
			requestToJoinGuildLocal({ shareCode: "AB12CD", userId: "u-leader" }),
		).toThrowError(/already a member/i);
	});

	it("enforces one guild per character on approval", () => {
		seedGuild();
		// c-leader is already bound to the guild via the leader row.
		const req = requestToJoinGuildLocal({
			shareCode: "AB12CD",
			userId: "u-applicant",
			characterId: "c-leader",
		});
		expect(() =>
			approveJoinRequestLocal({ requestId: req.id, role: "member" }),
		).toThrowError(/already belongs to a guild/i);
	});

	it("declines a request without adding a member", () => {
		seedGuild();
		const req = requestToJoinGuildLocal({
			shareCode: "AB12CD",
			userId: "u-applicant",
		});
		rejectJoinRequestLocal(req.id);
		expect(listLocalPendingJoinRequests("g-1")).toHaveLength(0);
		const members = JSON.parse(localStorage.getItem(MEMBERS_KEY) ?? "[]");
		expect(members).toHaveLength(1); // still just the leader
		expect(loadLocalJoinRequests().find((r) => r.id === req.id)?.status).toBe(
			"rejected",
		);
	});
});
