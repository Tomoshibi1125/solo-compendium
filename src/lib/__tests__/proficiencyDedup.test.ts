import { describe, expect, it } from "vitest";
import {
	dedupeProficiencies,
	formatDuplicatesSummary,
} from "@/lib/proficiencyDedup";

describe("dedupeProficiencies (DDB Quickbuilder parity)", () => {
	it("returns both arrays empty for an empty input", () => {
		const result = dedupeProficiencies([]);
		expect(result.unique).toEqual([]);
		expect(result.duplicates).toEqual([]);
	});

	it("preserves order and casing of first occurrence", () => {
		const result = dedupeProficiencies(["Athletics", "Stealth", "Persuasion"]);
		expect(result.unique).toEqual(["Athletics", "Stealth", "Persuasion"]);
		expect(result.duplicates).toEqual([]);
	});

	it("detects exact-string duplicates", () => {
		const result = dedupeProficiencies(["Athletics", "Stealth", "Athletics"]);
		expect(result.unique).toEqual(["Athletics", "Stealth"]);
		expect(result.duplicates).toEqual(["Athletics"]);
	});

	it("treats casing as equivalent (DDB matches case-insensitively)", () => {
		const result = dedupeProficiencies(["Athletics", "athletics", "ATHLETICS"]);
		expect(result.unique).toEqual(["Athletics"]);
		expect(result.duplicates).toEqual(["athletics", "ATHLETICS"]);
	});

	it("trims whitespace before comparison", () => {
		const result = dedupeProficiencies([
			"Athletics",
			"  Athletics  ",
			"\tAthletics\n",
		]);
		expect(result.unique).toEqual(["Athletics"]);
		expect(result.duplicates).toHaveLength(2);
	});

	it("ignores empty / whitespace-only entries", () => {
		const result = dedupeProficiencies(["", "  ", "Stealth", "\t", "Stealth"]);
		expect(result.unique).toEqual(["Stealth"]);
		expect(result.duplicates).toEqual(["Stealth"]);
	});

	it("realistic Job + Background overlap (Stealth + Athletics duplicates)", () => {
		// Acolyte background grants Insight + Religion; Job picks include
		// Insight and Stealth. Net duplicate: Insight.
		const jobSkills = ["Stealth", "Insight"];
		const bgSkills = ["Insight", "Religion"];
		const result = dedupeProficiencies([...jobSkills, ...bgSkills]);
		expect(result.unique).toEqual(["Stealth", "Insight", "Religion"]);
		expect(result.duplicates).toEqual(["Insight"]);
	});

	it("does not mutate the input array", () => {
		const input = ["A", "B", "A"];
		const snapshot = [...input];
		dedupeProficiencies(input);
		expect(input).toEqual(snapshot);
	});

	it("handles arbitrary tool / weapon / armor proficiency strings", () => {
		const result = dedupeProficiencies([
			"Light Armor",
			"Medium Armor",
			"light armor",
			"Smith's Tools",
		]);
		expect(result.unique).toEqual([
			"Light Armor",
			"Medium Armor",
			"Smith's Tools",
		]);
		expect(result.duplicates).toEqual(["light armor"]);
	});
});

describe("formatDuplicatesSummary", () => {
	it("returns null for an empty list (caller can skip the toast)", () => {
		expect(formatDuplicatesSummary([])).toBeNull();
	});

	it("joins all entries when within preview limit", () => {
		expect(formatDuplicatesSummary(["A", "B"])).toBe("A, B");
	});

	it("uses default preview limit of 4", () => {
		expect(formatDuplicatesSummary(["A", "B", "C", "D"])).toBe("A, B, C, D");
	});

	it("appends ellipsis when there are more than the preview limit", () => {
		expect(formatDuplicatesSummary(["A", "B", "C", "D", "E", "F"])).toBe(
			"A, B, C, D, …",
		);
	});

	it("respects a custom preview limit", () => {
		expect(formatDuplicatesSummary(["A", "B", "C"], 2)).toBe("A, B, …");
	});
});
