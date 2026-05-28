/**
 * Session recurrence locks (F4 of May 2026 remediation plan).
 */
import { describe, expect, it } from "vitest";
import {
	generateRecurrenceSchedule,
	parseRecurrenceRule,
	serializeRecurrenceRule,
	stepRecurrence,
} from "@/lib/sessionRecurrence";

describe("parseRecurrenceRule", () => {
	it("parses canonical FREQ=weekly;COUNT=8", () => {
		const rule = parseRecurrenceRule("FREQ=weekly;COUNT=8");
		expect(rule).toEqual({ frequency: "weekly", count: 8 });
	});
	it("returns null for unparseable input", () => {
		expect(parseRecurrenceRule(null)).toBeNull();
		expect(parseRecurrenceRule("")).toBeNull();
		expect(parseRecurrenceRule("FREQ=daily")).toBeNull();
		expect(parseRecurrenceRule("garbage")).toBeNull();
	});
	it("defaults count to 8 if missing", () => {
		const rule = parseRecurrenceRule("FREQ=monthly");
		expect(rule?.count).toBe(8);
	});
	it("clamps count to [1, 52]", () => {
		expect(parseRecurrenceRule("FREQ=weekly;COUNT=0")?.count).toBe(1);
		expect(parseRecurrenceRule("FREQ=weekly;COUNT=999")?.count).toBe(52);
	});
	it("round-trips serialize → parse", () => {
		const rule = { frequency: "biweekly" as const, count: 12 };
		const serialized = serializeRecurrenceRule(rule);
		expect(parseRecurrenceRule(serialized)).toEqual(rule);
	});
});

describe("stepRecurrence", () => {
	const seed = new Date("2026-05-25T18:00:00.000Z");

	it("weekly adds 7 days", () => {
		const next = stepRecurrence(seed, "weekly");
		expect(next.toISOString()).toBe("2026-06-01T18:00:00.000Z");
	});
	it("biweekly adds 14 days", () => {
		const next = stepRecurrence(seed, "biweekly");
		expect(next.toISOString()).toBe("2026-06-08T18:00:00.000Z");
	});
	it("monthly advances month", () => {
		const next = stepRecurrence(seed, "monthly");
		expect(next.toISOString()).toBe("2026-06-25T18:00:00.000Z");
	});
});

describe("generateRecurrenceSchedule", () => {
	it("generates N instances starting at seed for weekly Fridays", () => {
		const seed = new Date("2026-05-29T17:00:00.000Z"); // Friday
		const schedule = generateRecurrenceSchedule(seed, {
			frequency: "weekly",
			count: 4,
		});
		expect(schedule).toHaveLength(4);
		expect(schedule[0]).toBe("2026-05-29T17:00:00.000Z");
		expect(schedule[1]).toBe("2026-06-05T17:00:00.000Z");
		expect(schedule[2]).toBe("2026-06-12T17:00:00.000Z");
		expect(schedule[3]).toBe("2026-06-19T17:00:00.000Z");
	});
	it("generates 1 instance when count is 1 (just the seed)", () => {
		const seed = new Date("2026-05-25T18:00:00.000Z");
		const schedule = generateRecurrenceSchedule(seed, {
			frequency: "monthly",
			count: 1,
		});
		expect(schedule).toEqual([seed.toISOString()]);
	});
});
