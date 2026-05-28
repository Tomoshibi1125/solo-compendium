import { describe, expect, it } from "vitest";
import {
	buildIcsForCampaignSessions,
	type IcalSessionInput,
} from "@/lib/sessionIcalExport";

describe("buildIcsForCampaignSessions", () => {
	const baseSession: IcalSessionInput = {
		id: "session-1",
		title: "Session 1: Yongsan Gate",
		description: "Investigate the breach in Yongsan District.",
		scheduled_for: "2026-06-01T18:00:00.000Z",
		location: "Discord / VTT",
	};

	it("emits a valid VCALENDAR envelope with the campaign name", () => {
		const ics = buildIcsForCampaignSessions([baseSession], {
			campaignName: "Yongsan Vigil",
		});

		expect(ics).toMatch(/^BEGIN:VCALENDAR/m);
		expect(ics).toMatch(/END:VCALENDAR/);
		expect(ics).toMatch(/X-WR-CALNAME:Yongsan Vigil/);
		expect(ics).toMatch(/BEGIN:VEVENT/);
		expect(ics).toMatch(/SUMMARY:Session 1: Yongsan Gate/);
		expect(ics).toMatch(/LOCATION:Discord/);
	});

	it("emits an empty but valid calendar when there are no sessions", () => {
		const ics = buildIcsForCampaignSessions([], {
			campaignName: "Empty Vigil",
		});
		expect(ics).toMatch(/BEGIN:VCALENDAR/);
		expect(ics).toMatch(/X-WR-CALNAME:Empty Vigil/);
		expect(ics).toMatch(/END:VCALENDAR/);
		expect(ics).not.toMatch(/BEGIN:VEVENT/);
	});

	it("skips sessions without a scheduled date (DTSTART required)", () => {
		const ics = buildIcsForCampaignSessions(
			[
				{ ...baseSession, id: "a", scheduled_for: null },
				{ ...baseSession, id: "b" },
			],
			{ campaignName: "Mixed" },
		);
		// Exactly one VEVENT should appear.
		const eventMatches = ics.match(/BEGIN:VEVENT/g) ?? [];
		expect(eventMatches.length).toBe(1);
	});

	it("skips recurring children so the seed RRULE drives display", () => {
		const ics = buildIcsForCampaignSessions(
			[
				{ ...baseSession, id: "seed", recurrence_rule: "FREQ=weekly;COUNT=4" },
				{ ...baseSession, id: "child-1", recurrence_parent_id: "seed" },
				{ ...baseSession, id: "child-2", recurrence_parent_id: "seed" },
			],
			{ campaignName: "Weekly Vigil" },
		);
		const eventMatches = ics.match(/BEGIN:VEVENT/g) ?? [];
		expect(eventMatches.length).toBe(1);
		expect(ics).toMatch(/RRULE:FREQ=WEEKLY;COUNT=4/);
	});

	it("converts biweekly to RFC 5545 (WEEKLY;INTERVAL=2)", () => {
		const ics = buildIcsForCampaignSessions(
			[
				{
					...baseSession,
					recurrence_rule: "FREQ=biweekly;COUNT=6",
				},
			],
			{ campaignName: "Biweekly Vigil" },
		);
		expect(ics).toMatch(/RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=6/);
	});

	it("uppercases the monthly frequency", () => {
		const ics = buildIcsForCampaignSessions(
			[
				{
					...baseSession,
					recurrence_rule: "FREQ=monthly;COUNT=12",
				},
			],
			{ campaignName: "Monthly Vigil" },
		);
		expect(ics).toMatch(/RRULE:FREQ=MONTHLY;COUNT=12/);
	});

	it("does not emit an RRULE for a session without a recurrence rule", () => {
		const ics = buildIcsForCampaignSessions([baseSession], {
			campaignName: "One-off",
		});
		expect(ics).not.toMatch(/RRULE:/);
	});

	it("uses the productId / calendar name tags expected by readers", () => {
		const ics = buildIcsForCampaignSessions([baseSession], {
			campaignName: "Test",
		});
		expect(ics).toMatch(/PRODID:.*rift-ascendant\/misty-pearl/);
	});

	it("uses session location verbatim when provided", () => {
		const ics = buildIcsForCampaignSessions(
			[{ ...baseSession, location: "Game Room B" }],
			{ campaignName: "Test" },
		);
		expect(ics).toMatch(/LOCATION:Game Room B/);
	});

	it("includes a UID derived from the session id", () => {
		const ics = buildIcsForCampaignSessions(
			[{ ...baseSession, id: "abcd-1234" }],
			{ campaignName: "Test" },
		);
		expect(ics).toMatch(/UID:session-abcd-1234@rift-ascendant/);
	});
});
