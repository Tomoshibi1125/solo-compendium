import { beforeEach, describe, expect, it } from "vitest";
import {
	LOCAL_SESSION_EVENTS_KEY,
	listLocalSessionEvents,
	publishSessionEvent,
} from "@/lib/campaignSessionEvents";

describe("campaign session event local store", () => {
	beforeEach(() => {
		window.localStorage.removeItem(LOCAL_SESSION_EVENTS_KEY);
	});

	it("publishes to the local store in guest mode (null user) without throwing", async () => {
		await publishSessionEvent(
			{
				campaignId: "camp-1",
				sessionId: "sess-1",
				kind: "combat:roundStart",
				payload: { round: 2 },
			},
			null,
		);
		const events = listLocalSessionEvents("camp-1");
		expect(events).toHaveLength(1);
		expect(events[0]).toMatchObject({
			campaign_id: "camp-1",
			session_id: "sess-1",
			kind: "combat:roundStart",
		});
		expect(events[0].payload).toMatchObject({ round: 2 });
	});

	it("filters by campaign and (optionally) session, oldest-first", async () => {
		await publishSessionEvent(
			{
				campaignId: "camp-1",
				sessionId: "s1",
				kind: "combat:roundStart",
				payload: {},
			},
			null,
		);
		await publishSessionEvent(
			{
				campaignId: "camp-2",
				sessionId: "s2",
				kind: "combat:roundStart",
				payload: {},
			},
			null,
		);
		await publishSessionEvent(
			{
				campaignId: "camp-1",
				sessionId: "s3",
				kind: "effect:applied",
				payload: {},
			},
			null,
		);

		expect(listLocalSessionEvents("camp-1")).toHaveLength(2);
		expect(listLocalSessionEvents("camp-2")).toHaveLength(1);
		expect(listLocalSessionEvents("camp-1", "s1")).toHaveLength(1);
		// oldest-first ordering
		const kinds = listLocalSessionEvents("camp-1").map((e) => e.kind);
		expect(kinds).toEqual(["combat:roundStart", "effect:applied"]);
	});
});
