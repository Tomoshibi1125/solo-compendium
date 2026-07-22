import { beforeEach, describe, expect, it } from "vitest";
import {
	appendLocalCampaignRollEvent,
	type CampaignRollEventRow,
	LOCAL_ROLL_EVENTS_KEY,
	listLocalCampaignRollEvents,
	publishCampaignRollEvent,
} from "@/lib/campaignRollEvents";

const event = (
	over: Partial<CampaignRollEventRow> = {},
): CampaignRollEventRow =>
	({
		id: crypto.randomUUID(),
		created_at: new Date().toISOString(),
		campaign_id: "camp-1",
		user_id: "guest",
		character_id: "char-1",
		character_name: "Aria",
		dice_formula: "1d20+5",
		result: 18,
		rolls: [13],
		roll_type: "attack",
		context: "Longsword attack",
		modifiers: null,
		...over,
	}) as CampaignRollEventRow;

describe("campaign roll feed local store", () => {
	beforeEach(() => {
		window.localStorage.removeItem(LOCAL_ROLL_EVENTS_KEY);
	});

	it("returns only events for the requested campaign, newest first", () => {
		appendLocalCampaignRollEvent(event({ campaign_id: "camp-1", result: 1 }));
		appendLocalCampaignRollEvent(event({ campaign_id: "camp-2", result: 2 }));
		appendLocalCampaignRollEvent(event({ campaign_id: "camp-1", result: 3 }));

		const feed = listLocalCampaignRollEvents("camp-1");
		expect(feed.map((e) => e.result)).toEqual([3, 1]);
	});

	it("caps the persisted log so storage cannot grow unbounded", () => {
		for (let i = 0; i < 260; i++) {
			appendLocalCampaignRollEvent(event({ campaign_id: "camp-1", result: i }));
		}
		const raw = window.localStorage.getItem(LOCAL_ROLL_EVENTS_KEY);
		const all = JSON.parse(raw ?? "[]") as CampaignRollEventRow[];
		expect(all.length).toBeLessThanOrEqual(200);
		// The feed view itself is limited to the most recent 50.
		expect(listLocalCampaignRollEvents("camp-1").length).toBe(50);
	});

	it("publishes to the local store in guest mode (null user) without throwing", async () => {
		await publishCampaignRollEvent(
			{
				campaign_id: "camp-1",
				character_id: "char-1",
				character_name: "Aria",
				dice_formula: "1d20+3",
				result: 15,
				rolls: [12],
				roll_type: "ability",
				context: "STR check",
			},
			null,
		);
		const feed = listLocalCampaignRollEvents("camp-1");
		expect(feed).toHaveLength(1);
		expect(feed[0]).toMatchObject({
			character_name: "Aria",
			result: 15,
			roll_type: "ability",
		});
	});

	it("defaults visibility to public and records dm_only for secret rolls", async () => {
		await publishCampaignRollEvent(
			{
				campaign_id: "camp-1",
				dice_formula: "1d20",
				result: 10,
				rolls: [10],
			},
			null,
		);
		await publishCampaignRollEvent(
			{
				campaign_id: "camp-1",
				dice_formula: "1d20",
				result: 20,
				rolls: [20],
				visibility: "dm_only",
			},
			null,
		);
		const feed = listLocalCampaignRollEvents("camp-1");
		// newest-first
		expect(feed[0].visibility).toBe("dm_only");
		expect(feed[1].visibility).toBe("public");
	});
});
