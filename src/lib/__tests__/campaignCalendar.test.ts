import { describe, expect, it } from "vitest";
import {
	advanceClock,
	advanceRest,
	formatClock,
	formatRiftCyclePip,
	normalizeCampaignClock,
	resetRiftCycle,
} from "@/lib/campaignCalendar";

describe("normalizeCampaignClock", () => {
	it("returns defaults for null", () => {
		const c = normalizeCampaignClock(null);
		expect(c.iso).toMatch(/^2026-01-01T08:00:00/);
		expect(c.riftCyclePip).toBe(0);
	});

	it("clamps pip to 0..7", () => {
		expect(normalizeCampaignClock({ iso: "", riftCyclePip: 99 }).riftCyclePip).toBe(
			7,
		);
		expect(
			normalizeCampaignClock({ iso: "", riftCyclePip: -5 }).riftCyclePip,
		).toBe(0);
	});

	it("falls back to default ISO when the input is unparseable", () => {
		const c = normalizeCampaignClock({ iso: "not-a-date" });
		expect(c.iso).toMatch(/^2026-01-01T08:00:00/);
	});
});

describe("advanceClock", () => {
	it("advances by hours and minutes", () => {
		const next = advanceClock(
			{ iso: "2026-05-01T12:00:00.000Z" },
			{ hours: 2, minutes: 30 },
		);
		expect(next.iso).toBe("2026-05-01T14:30:00.000Z");
	});

	it("does not mutate the input", () => {
		const input = { iso: "2026-05-01T12:00:00.000Z", riftCyclePip: 2 };
		advanceClock(input, { hours: 1 });
		expect(input.iso).toBe("2026-05-01T12:00:00.000Z");
		expect(input.riftCyclePip).toBe(2);
	});

	it("rolls into the next day", () => {
		const next = advanceClock(
			{ iso: "2026-05-01T23:30:00.000Z" },
			{ minutes: 45 },
		);
		expect(next.iso).toBe("2026-05-02T00:15:00.000Z");
	});
});

describe("advanceRest", () => {
	it("short rest advances 1 hour with pip unchanged", () => {
		const next = advanceRest(
			{ iso: "2026-05-01T12:00:00.000Z", riftCyclePip: 2 },
			"short",
		);
		expect(next.iso).toBe("2026-05-01T13:00:00.000Z");
		expect(next.riftCyclePip).toBe(2);
	});

	it("watch advances 2 hours with pip unchanged", () => {
		const next = advanceRest(
			{ iso: "2026-05-01T12:00:00.000Z", riftCyclePip: 0 },
			"watch",
		);
		expect(next.iso).toBe("2026-05-01T14:00:00.000Z");
		expect(next.riftCyclePip).toBe(0);
	});

	it("long rest advances 8 hours AND ticks pip up by 1", () => {
		const next = advanceRest(
			{ iso: "2026-05-01T12:00:00.000Z", riftCyclePip: 3 },
			"long",
		);
		expect(next.iso).toBe("2026-05-01T20:00:00.000Z");
		expect(next.riftCyclePip).toBe(4);
	});

	it("long rest caps pip at 7", () => {
		const next = advanceRest(
			{ iso: "2026-05-01T12:00:00.000Z", riftCyclePip: 7 },
			"long",
		);
		expect(next.riftCyclePip).toBe(7);
	});
});

describe("resetRiftCycle", () => {
	it("zeroes the pip and keeps the iso", () => {
		const next = resetRiftCycle({
			iso: "2026-05-01T12:00:00.000Z",
			riftCyclePip: 5,
		});
		expect(next.riftCyclePip).toBe(0);
		expect(next.iso).toBe("2026-05-01T12:00:00.000Z");
	});
});

describe("formatRiftCyclePip", () => {
	it("renders filled pips up to the count", () => {
		expect(formatRiftCyclePip({ iso: "", riftCyclePip: 0 })).toBe(
			"○ ○ ○ ○ ○ ○ ○",
		);
		expect(formatRiftCyclePip({ iso: "", riftCyclePip: 3 })).toBe(
			"● ● ● ○ ○ ○ ○",
		);
		expect(formatRiftCyclePip({ iso: "", riftCyclePip: 7 })).toBe(
			"● ● ● ● ● ● ●",
		);
	});
});

describe("formatClock", () => {
	it("produces a reasonable localized string", () => {
		const s = formatClock({ iso: "2026-05-01T12:00:00.000Z" });
		// Locale-dependent — assert structure rather than exact text.
		expect(s).toMatch(/2026/);
		expect(s).toMatch(/12:00/);
	});
});
