import { describe, expect, it } from "vitest";
import type { ActivityEvent } from "@/lib/activityFeed";
import {
	CAMPAIGN_ACTIVITY_CAP,
	type CampaignRollLike,
	mergeCampaignActivity,
	rollToActivityEvent,
} from "@/lib/campaignActivity";

const roll = (over: Partial<CampaignRollLike> = {}): CampaignRollLike => ({
	id: "r1",
	created_at: "2026-06-30T12:00:00Z",
	character_name: "Aria",
	result: 18,
	roll_type: "attack",
	dice_formula: "1d20+5",
	...over,
});

describe("rollToActivityEvent", () => {
	it("maps a roll into a prefixed, labeled activity event", () => {
		const event = rollToActivityEvent(roll());
		expect(event.id).toBe("roll-r1");
		expect(event.kind).toBe("roll");
		expect(event.label).toBe("Aria rolled 18 (attack) · 1d20+5");
	});

	it("falls back when character name / roll type are absent", () => {
		const event = rollToActivityEvent(
			roll({ character_name: null, roll_type: null }),
		);
		expect(event.label).toBe("Someone rolled 18 · 1d20+5");
	});
});

describe("mergeCampaignActivity", () => {
	const logged: ActivityEvent[] = [
		{
			id: "a1",
			at: "2026-06-30T13:00:00Z",
			kind: "joined",
			label: "Kara linked to the campaign",
			category: "membership",
		},
	];

	it("merges logged events + rolls newest-first", () => {
		const merged = mergeCampaignActivity(logged, [
			roll({ id: "r1", created_at: "2026-06-30T11:00:00Z" }),
			roll({ id: "r2", created_at: "2026-06-30T14:00:00Z" }),
		]);
		expect(merged.map((e) => e.id)).toEqual(["roll-r2", "a1", "roll-r1"]);
	});

	it("caps the merged feed length", () => {
		const many = Array.from({ length: 150 }, (_, i) =>
			roll({
				id: `r${i}`,
				created_at: `2026-06-30T${String(i % 24).padStart(2, "0")}:00:00Z`,
			}),
		);
		expect(mergeCampaignActivity([], many)).toHaveLength(CAMPAIGN_ACTIVITY_CAP);
	});

	it("returns only logged events when there are no rolls", () => {
		expect(mergeCampaignActivity(logged, [])).toEqual(logged);
	});
});
