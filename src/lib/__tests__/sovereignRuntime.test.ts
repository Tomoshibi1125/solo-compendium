import { describe, expect, it } from "vitest";
import { validateActionResolutionPayload } from "@/lib/actionResolution";
import {
	applyResourceRest,
	type CustomResource,
} from "@/lib/characterResources";
import {
	buildSovereignRuntimeActions,
	buildSovereignRuntimeModifiers,
	evaluateSovereignExpression,
	readAttachedSovereignV2,
	reconcileSovereignResourceRows,
} from "@/lib/sovereign/sovereignRuntime";
import type { SovereignV2Definition } from "@/lib/sovereign/sovereignV2Contract";

const ancestry = ["job", "path", "regent-a", "regent-b"] as const;
const definition: SovereignV2Definition = {
	schema_version: 2,
	id: "sovereign.runtime-fixture",
	identity: {
		name: "Runtime Sovereign",
		title: "The Shared Runtime",
		epithet: "Fixture",
	},
	description: "Runtime integration fixture.",
	manifestation: "A stable runtime fixture manifests.",
	fusion_theme: "Runtime",
	combat_doctrine: "Exercise shared actions, resources, modifiers, and rests.",
	primary_abilities: ["PRE"],
	affinities: [
		{
			id: "affinity.runtime",
			name: "Runtime Affinity",
			ancestry: [...ancestry],
		},
	],
	traits: [],
	features: [
		{
			id: "feature.runtime-ward",
			name: "Runtime Ward",
			description: "Persistent cold resistance.",
			ancestry: ["regent-a", "regent-b"],
			modifier_ids: ["modifier.runtime-resistance", "modifier.runtime-save"],
			compatibility: "native",
		},
	],
	abilities: [1, 3, 5, 7, 10, 14, 17, 20].map((level) => ({
		id: `ability.runtime-${level}`,
		name: `Runtime ${level}`,
		description: `Runtime milestone ${level}.`,
		level,
		action_type: level === 1 ? "passive" : "action",
		recharge: level === 14 ? "short-rest" : level >= 17 ? "long-rest" : null,
		is_capstone: level === 17 || level === 20,
		ancestry:
			level >= 17
				? [...ancestry]
				: level % 2
					? ["job", "regent-a"]
					: ["path", "regent-b"],
		modifier_ids: [],
		resource_costs:
			level === 14
				? [{ resource_id: "resource.runtime-focus", amount: 2 }]
				: [],
		mechanics:
			level === 3
				? {
						kind: "attack",
						ability: "PRE",
						range_ft: 30,
						damage: { count: 1, sides: 8, type: "cold" },
					}
				: level === 5
					? {
							kind: "save",
							ability: "PRE",
							save_ability: "AGI",
							range_ft: 30,
							damage: { count: 2, sides: 6, type: "cold" },
							success_damage: "half",
							condition: { id: "deafened", duration_rounds: 1 },
						}
					: level === 14
						? { kind: "healing", range_ft: 30, healing: { count: 3, sides: 8 } }
						: undefined,
		compatibility: "native",
	})),
	resources: [
		{
			id: "resource.runtime-focus",
			name: "Runtime Focus",
			description: "PB plus PRE modifier.",
			ancestry: ["job", "path"],
			maximum: {
				kind: "sum",
				terms: [
					{ kind: "proficiency-bonus" },
					{ kind: "ability-modifier", ability: "PRE" },
				],
			},
			recharge: "short-rest",
		},
	],
	modifiers: [
		{
			id: "modifier.runtime-resistance",
			source_id: "feature.runtime-ward",
			kind: "resistance",
			damage_type: "cold",
			ancestry: ["regent-a"],
			duration: "persistent",
			stacking: "engine-default",
		},
		{
			id: "modifier.runtime-save",
			source_id: "feature.runtime-ward",
			kind: "save-proficiency",
			ability: "PRE",
			ancestry: ["regent-b"],
			duration: "persistent",
			stacking: "engine-default",
		},
	],
	generation: {
		contract_revision: 2,
		ruleset_revision: "rules.runtime",
		canonical_source_revision: "canon.runtime",
		generator: "runtime-test",
		generated_at: "2026-09-25T00:00:00.000Z",
		operation_id: "operation.runtime-test",
		source_ids: {
			job: "job-runtime",
			path: "path-runtime",
			regent_a: "umbral_regent",
			regent_b: "frost_regent",
		},
	},
	compatibility: { status: "native", notes: [] },
};

const character = {
	id: "character.runtime",
	level: 14,
	pre: 16,
	saving_throw_proficiencies: ["STR"],
	skill_proficiencies: [],
	skill_expertise: [],
};

describe("Sovereign v2 shared runtime", () => {
	it("reads only active strict v2 definitions", () => {
		expect(
			readAttachedSovereignV2({
				isActive: true,
				sovereignDefinition: definition,
			})?.id,
		).toBe(definition.id);
		expect(
			readAttachedSovereignV2({
				isActive: false,
				sovereignDefinition: definition,
			}),
		).toBeNull();
	});

	it("evaluates bounded expressions deterministically", () => {
		expect(
			evaluateSovereignExpression(definition.resources[0].maximum, character),
		).toBe(8); // PB +4 at level 14, PRE +3 => 7? core PB level 14 is +5.
	});

	it("reconciles stable resource rows and recharges through the shared rest path", () => {
		const seeded = reconcileSovereignResourceRows([], definition, character);
		expect(seeded.changed).toBe(true);
		expect(seeded.rows).toHaveLength(1);
		expect(seeded.rows[0].sourceKey).toBe(
			"sovereign:sovereign.runtime-fixture:resource.runtime-focus",
		);
		const spent: CustomResource[] = [{ ...seeded.rows[0], current: 1 }];
		const stable = reconcileSovereignResourceRows(spent, definition, character);
		expect(stable.rows[0].current).toBe(1);
		const rested = applyResourceRest(
			{
				inspiration: { inspiration_points: 0, inspiration_used: false },
				death_saves: {
					death_save_successes: 0,
					death_save_failures: 0,
					is_stable: false,
				},
				temp_hp_sources: [],
				custom_resources: stable.rows,
				conditions: [],
				tracking: { autoSpendAmmo: false },
			},
			"short",
		);
		expect(rested.custom_resources[0].current).toBe(
			rested.custom_resources[0].max,
		);
		expect(
			reconcileSovereignResourceRows(rested.custom_resources, null, character)
				.rows,
		).toEqual([]);
	});

	it("gates actions by level and exposes stable resource costs", () => {
		const rows = reconcileSovereignResourceRows([], definition, character).rows;
		const actions = buildSovereignRuntimeActions(definition, character, rows);
		expect(
			actions.some((action) => action.sourceId === "ability.runtime-17"),
		).toBe(false);
		const level14 = actions.find(
			(action) => action.sourceId === "ability.runtime-14",
		);
		expect(level14?.resourceCosts?.[0]).toMatchObject({
			resourceId: "resource.runtime-focus",
			amount: 2,
		});
		expect(level14?.recharge).toBe("short-rest");
	});

	it("projects bounded attack, save, condition, and healing mechanics into shared v2 actions", () => {
		const rows = reconcileSovereignResourceRows([], definition, character).rows;
		const actions = buildSovereignRuntimeActions(definition, character, rows);
		const attack = actions.find(
			(action) => action.sourceId === "ability.runtime-3",
		);
		expect(attack?.attackBonus).toBe(8);
		expect(attack?.payload).toMatchObject({
			version: 2,
			kind: "attack",
			attack: { roll: "1d20+8" },
			damage: { roll: "1d8", type: "cold" },
		});
		const save = actions.find(
			(action) => action.sourceId === "ability.runtime-5",
		);
		expect(save?.payload).toMatchObject({
			version: 2,
			kind: "save",
			save: { dc: 16, ability: "AGI" },
			saveSuccessDamagePolicy: "half",
			conditionIntents: [
				{
					conditionId: "deafened",
					gate: "on-failed-save",
					duration: { unit: "round", value: 1 },
				},
			],
		});
		const healing = actions.find(
			(action) => action.sourceId === "ability.runtime-14",
		);
		expect(healing?.payload).toMatchObject({
			version: 2,
			kind: "healing",
			healing: { roll: "3d8" },
			resourceCosts: [
				{
					resourceId:
						"sovereign:sovereign.runtime-fixture:resource.runtime-focus",
					amount: 2,
				},
			],
		});
		for (const action of [attack, save, healing]) {
			expect(validateActionResolutionPayload(action?.payload).valid).toBe(true);
		}
	});

	it("bridges supported persistent modifiers without double-counting base proficiency", () => {
		const runtime = buildSovereignRuntimeModifiers(definition, character);
		expect(runtime.resistances).toEqual(["cold"]);
		expect(runtime.customModifiers).toContainEqual(
			expect.objectContaining({ type: "save", target: "PRE", value: 5 }),
		);
		const alreadyProficient = buildSovereignRuntimeModifiers(definition, {
			...character,
			saving_throw_proficiencies: ["STR", "PRE"],
		});
		expect(
			alreadyProficient.customModifiers.some(
				(modifier) => modifier.type === "save" && modifier.target === "PRE",
			),
		).toBe(false);
	});

	it("preserves all eight milestones and both capstones in the authority", () => {
		expect(definition.abilities.map((ability) => ability.level)).toEqual([
			1, 3, 5, 7, 10, 14, 17, 20,
		]);
		expect(
			definition.abilities.filter((ability) => ability.is_capstone),
		).toHaveLength(2);
	});
});
