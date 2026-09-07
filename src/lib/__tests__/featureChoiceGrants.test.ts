import { describe, expect, it } from "vitest";
import {
	buildGrants,
	createFeatureChoiceGrantProjectionKey,
	createFeatureChoiceGrantSourceKey,
	csvRowsToChoiceOptions,
	emptyGrantDraft,
	FEATURE_CHOICE_GRANT_SCHEMA_VERSION,
	parseFeatureChoiceGrant,
	parseFeatureChoiceGrants,
	projectFeatureChoiceGrants,
	validateFeatureChoiceGrants,
} from "@/lib/featureChoiceGrants";
import { parseCsv, toCsv } from "@/lib/toolExport";

const canonicalFeature = {
	version: FEATURE_CHOICE_GRANT_SCHEMA_VERSION,
	type: "feature",
	targetCategory: "feature",
	targetId: "explicit-feature-id",
	name: "Defense Protocol",
	provenance: {
		kind: "canonical",
		sourceType: "test-fixture",
		sourceId: "explicit-option-id",
		path: "grants[0]",
	},
	choicePolicy: "fixed",
	replacementPolicy: "none",
	replacementTargetId: null,
	status: "strict",
} as const;

describe("versioned feature-choice grant contracts", () => {
	it("parses a fully explicit canonical grant and derives stable keys", () => {
		const first = parseFeatureChoiceGrant(canonicalFeature);
		const second = parseFeatureChoiceGrant(canonicalFeature);

		expect(first.valid).toBe(true);
		expect(first.grant).toMatchObject({
			version: 1,
			type: "feature",
			targetCategory: "feature",
			targetId: "explicit-feature-id",
			status: "strict",
		});
		expect(first.grant?.sourceKey).toBe(second.grant?.sourceKey);
		expect(first.grant?.projectionKey).toBe(second.grant?.projectionKey);
		if (!first.grant) throw new Error("Expected parsed grant");
		expect(createFeatureChoiceGrantSourceKey(first.grant)).toBe(
			first.grant.sourceKey,
		);
		expect(createFeatureChoiceGrantProjectionKey(first.grant)).toBe(
			first.grant.projectionKey,
		);
		expect(first.persistedGrant).toMatchObject({
			version: 1,
			targetId: "explicit-feature-id",
			provenance: canonicalFeature.provenance,
			choicePolicy: "fixed",
			replacementPolicy: "none",
			status: "strict",
		});
	});

	it("assigns distinct, replayable source keys to repeated provenance", () => {
		const result = parseFeatureChoiceGrants([
			canonicalFeature,
			{
				...canonicalFeature,
				targetId: "second-explicit-feature-id",
				name: "Second Protocol",
			},
		]);

		expect(result.valid).toBe(true);
		expect(result.grants.map((grant) => grant.sourceOrdinal)).toEqual([0, 1]);
		expect(result.grants[0]?.sourceKey).not.toBe(result.grants[1]?.sourceKey);
		for (const grant of result.grants) {
			expect(createFeatureChoiceGrantSourceKey(grant)).toBe(grant.sourceKey);
		}
	});

	it("compatibly parses legacy feature, feat, and ability JSON without inventing IDs", () => {
		const result = parseFeatureChoiceGrants([
			{ type: "feature", name: "Defense Protocol" },
			{ type: "feat", name: "Rift Sentinel" },
			{ type: "ability_increase", ability: "SENSE", amount: "2" },
		]);

		expect(result.valid).toBe(true);
		expect(result.grants).toMatchObject([
			{
				type: "feature",
				targetCategory: "feature",
				targetId: null,
				status: "manual",
			},
			{
				type: "feat",
				targetCategory: "feat",
				targetId: null,
				status: "manual",
			},
			{
				type: "ability_increase",
				targetCategory: "ability",
				targetId: "SENSE",
				status: "warning",
				amount: 2,
			},
		]);
		expect(
			result.issues.filter((entry) => entry.status === "manual"),
		).toHaveLength(2);
		expect(projectFeatureChoiceGrants(result.grants)).toEqual([
			{ type: "feature", name: "Defense Protocol" },
			{ type: "feat", name: "Rift Sentinel" },
			{ type: "ability_increase", ability: "SENSE", amount: 2 },
		]);
	});

	it("keeps proven additional persisted grant kinds as manual passthrough", () => {
		const result = parseFeatureChoiceGrants([
			{ type: "tool_proficiency", name: "Navigator's tools" },
		]);

		expect(result.valid).toBe(true);
		expect(result.grants[0]).toMatchObject({
			type: "legacy_passthrough",
			legacyType: "tool_proficiency",
			targetId: null,
			status: "manual",
		});
		expect(projectFeatureChoiceGrants(result.grants)).toEqual([
			{ type: "tool_proficiency", name: "Navigator's tools" },
		]);
	});

	it("rejects malformed supported grants, unknown types, and invalid policies", () => {
		for (const invalid of [
			[null],
			[{ type: "feature", name: "" }],
			[{ type: "ability_increase", ability: "DEX", amount: 1 }],
			[{ type: "ability_increase", ability: "AGI", amount: 4 }],
			[{ type: "invented_mechanic", name: "No canon" }],
			[
				{
					...canonicalFeature,
					replacementPolicy: "replace",
					replacementTargetId: null,
				},
			],
		]) {
			const result = validateFeatureChoiceGrants(invalid);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		}
	});
});

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

	it("preserves canonical identity and policies through CSV persistence", () => {
		const replacementGrant = {
			...canonicalFeature,
			replacementPolicy: "replace",
			replacementTargetId: "explicit-replaced-feature-id",
		};
		const { options, errors } = csvRowsToChoiceOptions([
			{
				option_key: "canonical_replacement",
				name: "Canonical replacement",
				description: "",
				grants: JSON.stringify([replacementGrant]),
			},
		]);

		expect(errors).toEqual([]);
		expect(options[0]?.grants).toEqual([
			expect.objectContaining({
				version: 1,
				targetCategory: "feature",
				targetId: "explicit-feature-id",
				provenance: canonicalFeature.provenance,
				choicePolicy: "fixed",
				replacementPolicy: "replace",
				replacementTargetId: "explicit-replaced-feature-id",
				status: "strict",
			}),
		]);
		expect(parseFeatureChoiceGrants(options[0]?.grants).valid).toBe(true);
	});

	it("routes semantic grant validation through the shared parser", () => {
		const { options, errors } = csvRowsToChoiceOptions([
			{
				option_key: "invalid_ability",
				name: "Invalid ability",
				description: "",
				grants: '[{"type":"ability_increase","ability":"DEX","amount":1}]',
			},
			{
				option_key: "valid_feat",
				name: "Valid feat",
				description: "",
				grants: '[{"type":"feat","name":"Alert"}]',
			},
		]);

		expect(errors).toHaveLength(1);
		expect(errors[0]).toContain("Line 2");
		expect(errors[0]).toContain("unknown ability");
		expect(options).toEqual([
			{
				option_key: "valid_feat",
				name: "Valid feat",
				description: null,
				grants: [{ type: "feat", name: "Alert" }],
			},
		]);
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
