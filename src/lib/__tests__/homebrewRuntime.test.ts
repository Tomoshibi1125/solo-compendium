import { describe, expect, it } from "vitest";
import { homebrewRuntimeItemToDeliverableItem } from "@/hooks/useWardenItemDelivery";
import {
	filterPublishedHomebrewRecords,
	type HomebrewRuntimeRecord,
	mapHomebrewAnomalyForRuntime,
	mapHomebrewFeatForRuntime,
	mapHomebrewFeaturesForRuntime,
	mapHomebrewItemForRuntime,
	mapHomebrewJobForRuntime,
	mapHomebrewPathForRuntime,
	mapHomebrewPowerForRuntime,
	mapHomebrewSpellForRuntime,
	runtimePathMatchesJob,
	runtimePowerMatchesCharacter,
	runtimeSpellMatchesCharacter,
} from "../homebrewRuntime";
import {
	buildHomebrewDeliverableItem,
	buildHomebrewItemData,
	buildHomebrewItemProperties,
	createDefaultHomebrewItemForm,
	normalizeHomebrewRarity,
} from "../wardenItemHomebrew";

const makeRecord = (
	overrides: Partial<HomebrewRuntimeRecord>,
): HomebrewRuntimeRecord => ({
	id: "homebrew-1",
	content_type: "job",
	name: "Gatebreaker",
	description: "A custom breach-line job.",
	data: {},
	source_book: "Test Homebrew",
	tags: ["test"],
	created_at: "2026-05-04T00:00:00.000Z",
	updated_at: "2026-05-04T00:00:00.000Z",
	...overrides,
});

describe("homebrew anomaly runtime mapping", () => {
	it("maps a homebrew anomaly into encounter-ready stats with explicit fields", () => {
		const record = makeRecord({
			content_type: "anomaly",
			name: "Hollow Choir",
			description: "A shrieking swarm from a collapsed rift.",
			data: {
				gate_rank: "B",
				armor_class: 16,
				hp: 95,
				creature_type: "Aberration",
				str: 18,
				agi: 14,
				damage_immunities: "psychic, poison",
			},
		});
		const anomaly = mapHomebrewAnomalyForRuntime(record);
		expect(anomaly).toMatchObject({
			name: "Hollow Choir",
			gate_rank: "B",
			armor_class: 16,
			hit_points_average: 95,
			creature_type: "Aberration",
			str: 18,
			agi: 14,
			_homebrew: true,
		});
		expect(anomaly.damage_immunities).toEqual(["psychic", "poison"]);
	});

	it("derives CR/XP defaults from rank and falls back for missing stats", () => {
		const anomaly = mapHomebrewAnomalyForRuntime(
			makeRecord({ content_type: "anomaly", name: "Gloom Wisp", data: {} }),
		);
		// Default rank D → CR 1 / 200 XP, AC 12, HP 20, ability scores 10.
		expect(anomaly.gate_rank).toBe("D");
		expect(anomaly.cr).toBe("1");
		expect(anomaly.xp).toBe(200);
		expect(anomaly.armor_class).toBe(12);
		expect(anomaly.hit_points_average).toBe(20);
		expect(anomaly.str).toBe(10);
	});
});

describe("homebrew runtime mapping", () => {
	it("maps published homebrew jobs into static-compatible runtime jobs", () => {
		const record = makeRecord({
			data: {
				hitDie: "1d10",
				primaryAbility: "strength",
				savingThrows: ["Strength", "Vitality"],
				skillChoices: ["Athletics", "Survival"],
				classFeatures: [
					{
						name: "Breach Impact",
						description: "Hit harder after crossing a gate.",
						level: 1,
						usesFormula: "PB",
						modifiers: [{ type: "bonus", target: "damage", value: 1 }],
					},
				],
				awakeningFeatures: [
					{
						name: "Gate Scar",
						description: "Resonance leaves a defensive mark.",
						level: 2,
					},
				],
			},
		});
		const job = mapHomebrewJobForRuntime(record);

		expect(job).toMatchObject({
			id: "homebrew-1",
			name: "Gatebreaker",
			display_name: "Gatebreaker",
			hitDie: "1d10",
			hit_die: 10,
			primaryAbility: "STR",
			primary_abilities: ["STR"],
			saving_throw_proficiencies: ["STR", "VIT"],
			skillChoices: ["Athletics", "Survival"],
			source_kind: "homebrew",
			_homebrew: true,
			homebrew_id: "homebrew-1",
		});
		expect(job.classFeatures).toHaveLength(1);
		expect(job.classFeatures[0]).toMatchObject({
			name: "Breach Impact",
			level: 1,
			uses_formula: "PB",
			homebrew_id: "homebrew-1",
		});
		expect(job.awakeningFeatures[0]).toMatchObject({
			name: "Gate Scar",
			level: 2,
		});
		expect(mapHomebrewFeaturesForRuntime(record, "job")[0]).toMatchObject({
			name: "Breach Impact",
			is_path_feature: false,
		});
	});

	it("maps homebrew paths and matches them to stored job names or ids", () => {
		const path = mapHomebrewPathForRuntime(
			makeRecord({
				id: "path-1",
				content_type: "path",
				name: "Fracture Knight",
				description: "A custom path.",
				data: {
					jobName: "Gatebreaker",
					pathLevel: 3,
					features: [
						{
							name: "Fracture Guard",
							description: "Brace against gate shock.",
							level: 3,
							recharge: "short rest",
						},
					],
				},
			}),
		);

		expect(path).toMatchObject({
			id: "path-1",
			name: "Fracture Knight",
			jobName: "Gatebreaker",
			job_name: "Gatebreaker",
			path_level: 3,
			_homebrew: true,
		});
		expect(path.features[0]).toMatchObject({
			name: "Fracture Guard",
			level: 3,
			is_path_feature: true,
			recharge: "short rest",
		});
		expect(runtimePathMatchesJob(path, null, "Gatebreaker")).toBe(true);
		expect(runtimePathMatchesJob(path, null, "Destroyer")).toBe(false);
	});

	it("maps homebrew spells for runtime spell pickers", () => {
		const spell = mapHomebrewSpellForRuntime(
			makeRecord({
				id: "spell-1",
				content_type: "spell",
				name: "Lattice Flicker",
				description: "A small burst of gate-lattice light.",
				data: {
					level: 0,
					castingTime: "1 action",
					range: "60 feet",
					duration: "Instantaneous",
					concentration: "false",
					ritual: "true",
					jobs: ["Gatebreaker"],
					paths: ["Fracture Knight"],
				},
			}),
		);

		expect(spell).toMatchObject({
			id: "spell-1",
			name: "Lattice Flicker",
			power_level: 0,
			casting_time: "1 action",
			range: "60 feet",
			duration: "Instantaneous",
			concentration: false,
			ritual: true,
			jobs: ["Gatebreaker"],
			paths: ["Fracture Knight"],
			_homebrew: true,
			homebrew_id: "spell-1",
		});
		expect(
			runtimeSpellMatchesCharacter(spell, "Gatebreaker", "Fracture Knight"),
		).toBe(true);
		expect(
			runtimeSpellMatchesCharacter(spell, "Gatebreaker", "Other Path"),
		).toBe(false);
	});

	it("maps homebrew powers for runtime power pickers", () => {
		const power = mapHomebrewPowerForRuntime(
			makeRecord({
				id: "power-1",
				content_type: "power",
				name: "Resonance Break",
				description: "A focused strike through mana circuits.",
				data: {
					powerLevel: 2,
					powerType: "attack",
					castingTime: "1 action",
					range: "30 feet",
					duration: "Instantaneous",
					hasAttackRoll: "true",
					damageRoll: "2d8",
					damageType: "force",
					jobs: ["Gatebreaker"],
					paths: ["Fracture Knight"],
				},
			}),
		);

		expect(power).toMatchObject({
			id: "power-1",
			name: "Resonance Break",
			canonical_type: "powers",
			power_level: 2,
			power_type: "attack",
			casting_time: "1 action",
			range: "30 feet",
			duration: "Instantaneous",
			has_attack_roll: true,
			damage_roll: "2d8",
			damage_type: "force",
			jobs: ["Gatebreaker"],
			paths: ["Fracture Knight"],
			_homebrew: true,
			homebrew_id: "power-1",
		});
		expect(
			runtimePowerMatchesCharacter(power, "Gatebreaker", "Fracture Knight"),
		).toBe(true);
		expect(
			runtimePowerMatchesCharacter(power, "Destroyer", "Fracture Knight"),
		).toBe(false);
	});

	it("maps homebrew items for runtime equipment add flows", () => {
		const item = mapHomebrewItemForRuntime(
			makeRecord({
				id: "item-1",
				content_type: "item",
				name: "Resonance Blade",
				description: "A custom blade tuned to mana circuits.",
				data: {
					type: "weapon",
					properties: ["light", "finesse"],
					weight: "2.5",
					rarity: "rare",
					value_credits: 1200,
					damage: "1d8",
					damageType: "force",
					requiresAttunement: "true",
					charges: "3",
					modifiers: { attack_bonus: 1 },
				},
			}),
		);

		expect(item).toMatchObject({
			id: "item-1",
			item_id: null,
			name: "Resonance Blade",
			equipment_type: "weapon",
			item_type: "weapon",
			properties: ["light", "finesse"],
			weight: 2.5,
			rarity: "rare",
			value_credits: 1200,
			damage: "1d8",
			damage_type: "force",
			requires_attunement: true,
			charges: 3,
			_homebrew: true,
			homebrew_id: "item-1",
		});
		expect(item.custom_modifiers).toMatchObject({
			attack_bonus: 1,
			homebrew_id: "item-1",
			source: "homebrew",
		});
		expect(homebrewRuntimeItemToDeliverableItem(item).valueCredits).toBe(1200);
	});

	it("builds inline Warden homebrew items as usable equipment payload data", () => {
		const form = {
			...createDefaultHomebrewItemForm(),
			name: "Aegis Circuit Mantle",
			description: "A mantle threaded with defensive mana circuits.",
			itemType: "armor",
			rarity: "rare",
			weight: "4.5",
			valueCredits: "2500",
			armorClass: "15",
			armorType: "light",
			acBonus: "1",
			attackBonus: "2",
			damageBonus: "3",
			charges: "4",
			requiresAttunement: true,
			isContainer: true,
			capacityWeight: "20",
			resistancesText: "fire, cold",
			immunitiesText: "poison",
			propertiesText: "Advantage on resonance checks",
		};

		const data = buildHomebrewItemData(form);
		const deliverable = buildHomebrewDeliverableItem(form, "homebrew-item-1");

		expect(normalizeHomebrewRarity("none")).toBeNull();
		expect(buildHomebrewItemProperties(form)).toEqual(data.properties);
		expect(data).toMatchObject({
			type: "armor",
			rarity: "rare",
			weight: 4.5,
			value_credits: 2500,
			armor_class: "15",
			armor_type: "light",
			charges: 4,
			requires_attunement: true,
			is_container: true,
			capacity_weight: 20,
			resistances: ["fire", "cold"],
			immunities: ["poison"],
		});
		expect(data.properties).toEqual(
			expect.arrayContaining([
				"AC 15",
				"light",
				"+1 AC",
				"+2 to attack",
				"+3 to damage",
				"Resistance: fire, cold",
				"Immunity: poison",
				"Advantage on resonance checks",
			]),
		);
		expect(deliverable).toMatchObject({
			id: "homebrew-item-1",
			homebrewId: "homebrew-item-1",
			sourceKind: "homebrew",
			type: "armor",
			rarity: "rare",
			chargesCurrent: 4,
			chargesMax: 4,
			requiresAttunement: true,
			isContainer: true,
			capacityWeight: 20,
		});
		expect(deliverable.customModifiers).toMatchObject({
			acBonus: 1,
			attackBonus: 2,
			damageBonus: 3,
			source: "homebrew",
			homebrew_id: "homebrew-item-1",
		});
	});

	it("maps homebrew feats for runtime feature add flows", () => {
		const feat = mapHomebrewFeatForRuntime(
			makeRecord({
				id: "feat-1",
				content_type: "feat",
				name: "Lattice Veteran",
				description: "You have survived repeated gate-lattice exposure.",
				data: {
					prerequisites: { level: 4 },
					benefits: ["Gain +1 to resonance checks."],
					modifiers: { resonance_bonus: 1 },
				},
			}),
		);

		expect(feat).toMatchObject({
			id: "feat-1",
			feat_id: null,
			name: "Lattice Veteran",
			description: "You have survived repeated gate-lattice exposure.",
			prerequisites: { level: 4 },
			benefits: ["Gain +1 to resonance checks."],
			modifiers: { resonance_bonus: 1 },
			_homebrew: true,
			homebrew_id: "feat-1",
		});
	});

	it("filters records by homebrew content type", () => {
		const records = [
			makeRecord({ id: "job-1", content_type: "job" }),
			makeRecord({ id: "path-1", content_type: "path" }),
		];

		expect(
			filterPublishedHomebrewRecords(records, "job").map((r) => r.id),
		).toEqual(["job-1"]);
	});
});
