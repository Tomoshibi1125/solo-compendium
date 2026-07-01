import { describe, expect, it } from "vitest";
import { summarizeOnlineMembers } from "@/lib/campaignPresence";

describe("summarizeOnlineMembers", () => {
	it("reports no one online for an empty roster", () => {
		expect(summarizeOnlineMembers([])).toEqual({
			count: 0,
			names: [],
			label: "No one online",
		});
	});

	it("dedupes a member open in multiple tabs by id", () => {
		const summary = summarizeOnlineMembers([
			{ id: "u1", name: "Aria" },
			{ id: "u1", name: "Aria" },
			{ id: "u2", name: "Crane" },
		]);
		expect(summary.count).toBe(2);
		expect(summary.names).toEqual(["Aria", "Crane"]);
		expect(summary.label).toBe("2 online");
	});

	it("sorts names and singularizes the label for one member", () => {
		const summary = summarizeOnlineMembers([
			{ id: "u2", name: "Zara" },
			{ id: "u2", name: "Zara" },
		]);
		expect(summary.label).toBe("1 online");
		expect(summary.names).toEqual(["Zara"]);
	});

	it("falls back to Anonymous for blank names", () => {
		const summary = summarizeOnlineMembers([{ id: "u1", name: "   " }]);
		expect(summary.names).toEqual(["Anonymous"]);
	});
});
