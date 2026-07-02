import { describe, expect, it } from "vitest";
import {
	buildGrants,
	csvRowsToChoiceOptions,
	emptyGrantDraft,
} from "@/lib/featureChoiceGrants";
import { parseCsv, toCsv } from "@/lib/toolExport";

describe("buildGrants — guarded grants builder", () => {
	it("builds feature, feat, and ability_increase grants", () => {
		const { grants, error } = buildGrants([
			{
				...emptyGrantDraft(),
				type: "feature",
				name: "Defense Protocol",
				description: "+1 AC while armored",
			},
			{ ...emptyGrantDraft(), type: "feat", name: "Rift Sentinel" },
			{
				...emptyGrantDraft(),
				type: "ability_increase",
				ability: "SENSE",
				amount: 2,
			},
		]);
		expect(error).toBeUndefined();
		expect(grants).toEqual([
			{
				type: "feature",
				name: "Defense Protocol",
				description: "+1 AC while armored",
			},
			{ type: "feat", name: "Rift Sentinel" },
			{ type: "ability_increase", ability: "SENSE", amount: 2 },
		]);
	});

	it("omits empty feature descriptions", () => {
		const { grants } = buildGrants([
			{ ...emptyGrantDraft(), name: "Bare Feature" },
		]);
		expect(grants).toEqual([{ type: "feature", name: "Bare Feature" }]);
	});

	it("rejects nameless features/feats and out-of-range amounts", () => {
		expect(buildGrants([emptyGrantDraft()]).error).toMatch(/name is required/);
		expect(buildGrants([{ ...emptyGrantDraft(), type: "feat" }]).error).toMatch(
			/feat name is required/,
		);
		expect(
			buildGrants([
				{ ...emptyGrantDraft(), type: "ability_increase", amount: 5 },
			]).error,
		).toMatch(/1 to 3/);
		expect(buildGrants([]).error).toMatch(/at least one/);
	});
});

describe("csvRowsToChoiceOptions — bulk import mapping", () => {
	it("maps valid rows and collects per-line errors without aborting", () => {
		const { options, errors } = csvRowsToChoiceOptions([
			{
				option_key: "defense",
				name: "Defense",
				description: "Sturdy",
				grants: '[{"type":"feature","name":"Defense"}]',
			},
			{ option_key: "", name: "Nameless key", description: "", grants: "" },
			{
				option_key: "bad_json",
				name: "Broken",
				description: "",
				grants: "{not json",
			},
			{
				option_key: "not_array",
				name: "Object grants",
				description: "",
				grants: '{"type":"feat"}',
			},
			{ option_key: "no_grants", name: "Plain", description: "", grants: "" },
		]);

		expect(options).toEqual([
			{
				option_key: "defense",
				name: "Defense",
				description: "Sturdy",
				grants: [{ type: "feature", name: "Defense" }],
			},
			{ option_key: "no_grants", name: "Plain", description: null, grants: [] },
		]);
		expect(errors).toHaveLength(3);
		expect(errors[0]).toContain("Line 3");
		expect(errors[1]).toContain("not valid JSON");
		expect(errors[2]).toContain("must be a JSON array");
	});
});

describe("parseCsv", () => {
	it("round-trips toCsv output including quoted/multiline fields", () => {
		const rows = [
			{
				option_key: "tricky",
				name: 'He said "go"',
				description: "line one\nline two, with comma",
				grants: '[{"type":"feat","name":"X"}]',
			},
		];
		const parsed = parseCsv(
			toCsv(rows, ["option_key", "name", "description", "grants"]),
		);
		expect(parsed).toEqual([rows[0]]);
	});

	it("handles \\r\\n newlines, empty trailing lines, and missing cells", () => {
		const parsed = parseCsv("a,b,c\r\n1,2\r\n\r\n");
		expect(parsed).toEqual([{ a: "1", b: "2", c: "" }]);
	});

	it("returns empty for empty input", () => {
		expect(parseCsv("")).toEqual([]);
	});
});
