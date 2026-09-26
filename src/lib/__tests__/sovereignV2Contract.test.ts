import { describe, expect, it } from "vitest";
import {
	normalizeExternalSovereignActionType,
	normalizeExternalSovereignRecharge,
	readSovereignDefinition,
	sovereignModifierToFeatureEffect,
	SovereignExpressionSchema,
	toExternalSovereignActionType,
	toExternalSovereignRecharge,
	validateSovereignV2Definition,
	type SovereignV2Definition,
} from "@/lib/sovereign/sovereignV2Contract";

const ancestry = ["job", "path", "regent-a", "regent-b"] as const;

const validDefinition: SovereignV2Definition = {
	schema_version: 2,
	id: "sovereign.frostvoid.v2",
	identity: {
		name: "Frostvoid Sovereign",
		title: "Sovereign of the Frozen Shadow",
		epithet: "The Still Horizon",
	},
	description: "A fused sovereign definition used as a strict v2 fixture.",
	manifestation: "Black frost condenses into a single stable sovereign form.",
	fusion_theme: "Singularity Frost",
	combat_doctrine: "Control space, force movement, and finish isolated targets.",
	primary_abilities: ["STR", "PRE"],
	affinities: [
		{
			id: "affinity.frostvoid",
			name: "Frostvoid",
			description: "A declared synthesis affinity.",
			ancestry: [...ancestry],
		},
	],
	traits: [],
	features: [
		{
			id: "feature.void-resistance",
			name: "Void Resistance",
			description: "The sovereign carries an authored persistent resistance.",
			ancestry: ["regent-a", "regent-b"],
			modifier_ids: ["modifier.void-resistance"],
			compatibility: "native",
		},
	],
	abilities: [1, 3, 5, 7, 10, 14, 17, 20].map((level) => ({
		id: `ability.milestone-${level}`,
		name: `Milestone ${level}`,
		description: `A typed level ${level} sovereign milestone.`,
		level,
		action_type: level === 1 ? "passive" : "action",
		recharge: level >= 14 ? "long-rest" : null,
		is_capstone: level === 17 || level === 20,
		ancestry:
			level === 17 || level === 20
				? [...ancestry]
				: level % 2 === 0
					? ["job", "regent-a"]
					: ["path", "regent-b"],
		modifier_ids: [],
		resource_costs: level === 14 ? [{ resource_id: "resource.focus", amount: 1 }] : [],
		compatibility: "native",
	})),
	resources: [
		{
			id: "resource.focus",
			name: "Sovereign Focus",
			description: "A typed resource whose exact balance budget is defined elsewhere.",
			ancestry: ["job", "path"],
			maximum: { kind: "proficiency-bonus" },
			recharge: "long-rest",
		},
	],
	modifiers: [
		{
			id: "modifier.void-resistance",
			source_id: "feature.void-resistance",
			kind: "resistance",
			damage_type: "cold",
			ancestry: ["regent-a", "regent-b"],
			duration: "persistent",
			stacking: "engine-default",
		},
	],
	generation: {
		contract_revision: 2,
		ruleset_revision: "rules.2026-09-25",
		canonical_source_revision: "canon.38e473eb",
		generator: "sovereign-fixture",
		generated_at: "2026-09-25T00:00:00.000Z",
		operation_id: "operation.fixture-1",
		source_ids: {
			job: "job-destroyer",
			path: "path-frostwarden",
			regent_a: "umbral_regent",
			regent_b: "frost_regent",
		},
	},
	compatibility: { status: "native", notes: [] },
};

const clone = (): SovereignV2Definition => structuredClone(validDefinition);

describe("validateSovereignV2Definition", () => {
	it("accepts the strict v2 fixture and canonical source expectations", () => {
		const result = validateSovereignV2Definition(validDefinition, {
			job: "job-destroyer",
			regent_a: "umbral_regent",
		});
		expect(result.ok).toBe(true);
	});

	it("rejects an out-of-order milestone and a duplicate stable id", () => {
		const candidate = clone();
		candidate.abilities[0].level = 3;
		candidate.features[0].id = candidate.abilities[0].id;
		const result = validateSovereignV2Definition(candidate);
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors.join(" ")).toMatch(/level-1 milestone/i);
		expect(result.errors.join(" ")).toMatch(/globally unique/i);
	});

	it("requires both capstones to declare all four sources", () => {
		const candidate = clone();
		candidate.abilities[6].ancestry = ["job", "path", "regent-a"];
		const result = validateSovereignV2Definition(candidate);
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors.join(" ")).toMatch(/all four fusion sources/i);
	});

	it("rejects forged references and unsupported automation shapes", () => {
		const candidate = clone();
		candidate.abilities[0].modifier_ids = ["modifier.missing"];
		const badReference = validateSovereignV2Definition(candidate);
		expect(badReference.ok).toBe(false);

		const unsupported = {
			...validDefinition,
			modifiers: [
				{
					id: "modifier.unsupported",
					source_id: "feature.void-resistance",
					kind: "ability-score",
					ability: "STR",
					value: 10,
					ancestry: ["job"],
					duration: "persistent",
					stacking: "engine-default",
				},
			],
		};
		expect(validateSovereignV2Definition(unsupported).ok).toBe(false);
	});

	it("rejects mismatched canonical generation inputs", () => {
		const result = validateSovereignV2Definition(validDefinition, {
			path: "path-other",
		});
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors.join(" ")).toMatch(/does not match the canonical input/i);
	});
});

describe("bounded expression grammar", () => {
	it("accepts declarative expressions and rejects arbitrary formula strings", () => {
		expect(
			SovereignExpressionSchema.safeParse({
				kind: "sum",
				terms: [
					{ kind: "dice", count: 2, sides: 6, bonus: 1 },
					{ kind: "ability-modifier", ability: "PRE" },
				],
			}).success,
		).toBe(true);
		expect(SovereignExpressionSchema.safeParse("2d6 + PRE").success).toBe(false);
		expect(
			SovereignExpressionSchema.safeParse({
				kind: "constant",
				value: Number.MAX_SAFE_INTEGER + 1,
			}).success,
		).toBe(false);
	});
});

describe("external vocabulary adapters", () => {
	it("round-trips external action vocabulary through the internal hyphenated form", () => {
		expect(normalizeExternalSovereignActionType("bonus_action")).toBe("bonus-action");
		expect(
			normalizeExternalSovereignActionType(
				toExternalSovereignActionType("bonus-action"),
			),
		).toBe("bonus-action");
	});

	it("round-trips recharge vocabulary without creating a second runtime vocabulary", () => {
		expect(normalizeExternalSovereignRecharge("short_rest")).toBe("short-rest");
		expect(
			normalizeExternalSovereignRecharge(
				toExternalSovereignRecharge("long-rest"),
			),
		).toBe("long-rest");
	});
});

describe("compatibility reader", () => {
	it("returns native v2 definitions only after semantic validation", () => {
		const result = readSovereignDefinition(validDefinition);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.kind).toBe("v2");
		expect(result.compatibility.status).toBe("native");
	});

	it("preserves an unversioned legacy record without fabricating v2 ancestry or ids", () => {
		const legacy = {
			name: "Legacy Sovereign",
			title: "Old Contract",
			description: "An existing unversioned saved record.",
			abilities: [
				{
					name: "Legacy Ability",
					description: "Visible legacy mechanics remain readable.",
					level: 1,
					action_type: "1 action",
				},
			],
			custom_legacy_field: { keep: true },
		};
		const result = readSovereignDefinition(legacy);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.kind).toBe("legacy");
		expect(result.definition).toBe(legacy);
		expect(result.compatibility.status).toBe("legacy-visible");
		expect(result.compatibility.unsupported).toContain("declared-ancestry");
		expect(result.definition).not.toHaveProperty("schema_version");
	});
});

describe("existing FeatureEffect mapping", () => {
	it("maps only supported v2 automation into the shared effect consumer", () => {
		expect(
			sovereignModifierToFeatureEffect({
				id: "modifier.test",
				source_id: "feature.test",
				kind: "advantage",
				roll_type: "save",
				condition: "against fear",
				ancestry: ["regent-a"],
				duration: "persistent",
				stacking: "engine-default",
			}),
		).toEqual({ kind: "advantage", rollType: "save", condition: "against fear" });
	});
});
