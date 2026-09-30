import { describe, expect, it } from "vitest";
import { anomalies } from "@/data/compendium/anomalies";
import { allMounts } from "@/data/compendium/vehicles";
import {
	type CompanionInstanceRecord,
	resolveCompanionEffectiveStats,
} from "@/lib/companionInstances";
import {
	companionDamageDiceCount,
	companionProficiencyBonus,
	companionRankTier,
	parseStatBlockHitDie,
	scaleCompanionAtLevel,
	scaleCompanionText,
	sizeHitDie,
} from "@/lib/companionProgression";
import {
	companionHitDicePool,
	companionScalingCharacterId,
	companionSpeciesFacts,
	formatCompanionSpeeds,
	type MergedCompanionCombat,
	mergeCompanionCombat,
	resolveCompanionScalingSource,
	scaleCompanionInstance,
} from "@/lib/companionScaling";
import { createCanonicalCompanionSource } from "@/lib/companions";

const OWNER = "22222222-2222-4222-8222-222222222222";

/** A living companion saved from the Add Companion catalog. */
function companion(
	collection: "anomalies" | "vehicles",
	sourceId: string,
	overrides: Partial<CompanionInstanceRecord> = {},
): CompanionInstanceRecord {
	const isMount = collection === "vehicles";
	const entry = isMount
		? allMounts.find((mount) => mount.id === sourceId)
		: anomalies.find((anomaly) => anomaly.id === sourceId);
	return {
		id: "11111111-1111-4111-8111-111111111111",
		owner_scope: "character",
		owner_character_id: OWNER,
		owner_campaign_id: null,
		primary_handler_character_id: OWNER,
		combat_controller_character_id: OWNER,
		rider_character_id: null,
		identity_kind: isMount ? "mount" : "companion",
		source_kind: isMount ? "canonical-mount" : "canonical-anomaly",
		source_collection: collection,
		source_id: sourceId,
		source_policy: "snapshot",
		source_revision: "canonical-snapshot-v1",
		source_snapshot_version: 1,
		source_snapshot: createCanonicalCompanionSource({
			canonicalId: sourceId,
			canonicalType: isMount ? "vehicle" : "anomaly",
			canonicalCollection: collection,
			name: entry?.name ?? sourceId,
			hpMax: 13,
			baseAc: 10,
			speed: 40,
			rank: entry?.rank ?? null,
		}),
		profile_version: 1,
		progression_profile: {},
		stat_overrides: {},
		mount_profile: isMount ? {} : null,
		origin_table: "character_extras",
		origin_row_id: "33333333-3333-4333-8333-333333333333",
		created_at: "2026-09-28T00:00:00Z",
		updated_at: "2026-09-28T00:00:00Z",
		...overrides,
	};
}

function combatAt(instance: CompanionInstanceRecord, level: number) {
	const scaled = scaleCompanionInstance(instance, level);
	if (!scaled) throw new Error(`${instance.source_id} is not level scaled`);
	return { scaled, combat: mergeCompanionCombat(instance, scaled) };
}

function action(combat: MergedCompanionCombat, name: string) {
	const found = combat.actions.find((entry) => entry.name === name);
	if (!found) throw new Error(`No ${name} action`);
	return found;
}

describe("RA-10 companion progression", () => {
	it("uses proficiency bonus, cantrip-pace dice counts, and rank tiers", () => {
		expect(
			[1, 4, 5, 8, 9, 12, 13, 16, 17, 20].map(companionProficiencyBonus),
		).toEqual([2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
		expect([1, 4, 5, 10, 11, 16, 17, 20].map(companionDamageDiceCount)).toEqual(
			[1, 1, 2, 2, 3, 3, 4, 4],
		);
		expect(["E", "D", "C", "B", "A", "S"].map(companionRankTier)).toEqual([
			0, 1, 2, 3, 4, 5,
		]);
		expect(companionRankTier(null)).toBe(1);
		expect(companionRankTier("unranked")).toBe(1);
	});

	it("derives maximum HP, Hit Dice, AC, attack, and save DC from level, die, and rank", () => {
		expect(scaleCompanionAtLevel(5, { rank: "D", hitDie: 10 })).toMatchObject({
			level: 5,
			hitDice: "5d10",
			hpMax: 50,
			proficiencyBonus: 3,
			baseAc: 12,
			attackBonus: 6,
			saveDc: 12,
			damageDiceCount: 2,
		});
		expect(scaleCompanionAtLevel(20, { rank: "S", hitDie: 12 })).toMatchObject({
			hpMax: 240,
			baseAc: 19,
			attackBonus: 13,
			saveDc: 19,
			damageDiceCount: 4,
		});
		expect(scaleCompanionAtLevel(0, { rank: null, hitDie: 8 })).toMatchObject({
			level: 1,
			hpMax: 8,
			baseAc: 11,
			attackBonus: 5,
			saveDc: 11,
		});
		expect(scaleCompanionAtLevel(99, { rank: "C", hitDie: 6 }).level).toBe(20);
	});

	it("reads the stat-block Hit Die and falls back to size", () => {
		expect(parseStatBlockHitDie("12 (1d10 + 6)")).toBe(10);
		expect(parseStatBlockHitDie("264 (23d8 + 160)")).toBe(8);
		expect(parseStatBlockHitDie("no dice")).toBeNull();
		expect(
			["Tiny", "small", "Medium", "large", "Huge", "gargantuan"].map(
				sizeHitDie,
			),
		).toEqual([4, 6, 8, 10, 12, 20]);
		expect(sizeHitDie("colossal")).toBeNull();
	});
});

describe("which companions scale", () => {
	it("scales an Anomaly companion from its stat block", () => {
		const instance = companion("anomalies", "anomaly-0006");
		const source = resolveCompanionScalingSource(instance);
		expect(source).toMatchObject({ kind: "stat-block", hitDie: 10 });
		expect(source?.anomaly?.name).toBe("Eternal Ancient Dragon");
		expect(scaleCompanionInstance(instance, 5)?.hpMax).toBe(50);
	});

	it("scales a linked mount from its Anomaly's Hit Die rather than its own size", () => {
		// The mount entry is Large; the linked Eternal Void Beast is Medium (13d8).
		const instance = companion("vehicles", "mount-bonded-eternal-void-beast");
		expect(resolveCompanionScalingSource(instance)).toMatchObject({
			kind: "stat-block",
			hitDie: 8,
		});
		expect(scaleCompanionInstance(instance, 5)?.hpMax).toBe(40);
	});

	it("flags exactly the canon combat-capable mounts and scales them by size", () => {
		expect(
			allMounts
				.filter((mount) => mount.combat_capable)
				.map((mount) => mount.name)
				.sort(),
		).toEqual([
			"Bureau K9 (Mastiff-class)",
			"Bureau Warhorse",
			"Mana-Touched Wolf",
			"Mountain Patrol Bear",
			"Pantheon Steed",
		]);
		expect(
			resolveCompanionScalingSource(
				companion("vehicles", "mount-mountain-patrol-bear"),
			),
		).toMatchObject({ kind: "size", hitDie: 10 });
		expect(
			resolveCompanionScalingSource(
				companion("vehicles", "mount-mana-touched-wolf"),
			),
		).toMatchObject({ kind: "size", hitDie: 8 });
	});

	it("renames the Holy Knight mount to Pantheon Steed without changing its id", () => {
		const steed = allMounts.find(
			(mount) => mount.id === "mount-sovereign-steed",
		);
		expect(steed).toMatchObject({
			name: "Pantheon Steed",
			display_name: "Pantheon Steed",
		});
		expect(allMounts.some((mount) => /sovereign/i.test(mount.name))).toBe(
			false,
		);
	});

	it("keeps utility mounts, guild allies, and custom companions on saved stats", () => {
		const horse = companion("vehicles", "mount-bureau-riding-horse");
		expect(resolveCompanionScalingSource(horse)).toBeNull();
		expect(scaleCompanionInstance(horse, 10)).toBeNull();
		expect(
			resolveCompanionEffectiveStats(horse, { currentHp: 9 }, undefined, 10),
		).toMatchObject({
			hpMax: 13,
			baseAc: 10,
			currentHp: 9,
			combatScaling: null,
		});
		expect(
			resolveCompanionScalingSource({
				source_collection: null,
				source_id: "npc-guild-medic",
			}),
		).toBeNull();
		expect(
			resolveCompanionScalingSource({
				source_collection: "compendium_monsters",
				source_id: "44444444-4444-4444-8444-444444444444",
			}),
		).toBeNull();
	});

	it("scales with the owning character, not a rider or controller", () => {
		expect(
			companionScalingCharacterId({
				owner_character_id: "owner",
				primary_handler_character_id: "handler",
				combat_controller_character_id: "controller",
			}),
		).toBe("owner");
		expect(
			companionScalingCharacterId({
				owner_character_id: null,
				primary_handler_character_id: "handler",
				combat_controller_character_id: "controller",
			}),
		).toBe("handler");
	});
});

describe("companion Hit Dice for rests", () => {
	it("gives a level-scaled companion L Hit Dice of its scaling die", () => {
		const wolf = companion("vehicles", "mount-mana-touched-wolf", {
			combat_state: { hp: 12, hitDiceSpent: 2 },
		});
		expect(companionHitDicePool(wolf, scaleCompanionInstance(wolf, 5))).toEqual(
			{ die: 8, max: 5, spent: 2, available: 3 },
		);
	});

	it("never counts more spent dice than the companion has", () => {
		const dragon = companion("anomalies", "anomaly-0006");
		const scaled = scaleCompanionInstance(dragon, 3);
		const pool = (hitDiceSpent: unknown) =>
			companionHitDicePool({ combat_state: { hitDiceSpent } }, scaled);
		expect(pool(99)).toMatchObject({ max: 3, spent: 3, available: 0 });
		expect(pool(-4)).toMatchObject({ spent: 0, available: 3 });
		expect(pool("2")).toMatchObject({ spent: 0, available: 3 });
		expect(pool(1.9)).toMatchObject({ spent: 1, available: 2 });
		expect(companionHitDicePool({ combat_state: null }, scaled)).toMatchObject({
			spent: 0,
			available: 3,
		});
	});

	it("gives a companion that keeps its saved stats no Hit Dice", () => {
		const horse = companion("vehicles", "mount-bureau-riding-horse");
		expect(scaleCompanionInstance(horse, 5)).toBeNull();
		expect(companionHitDicePool(horse, null)).toBeNull();
	});
});

describe("scaled attacks and effects", () => {
	it("scales a 1d6 attack's dice count and adds proficiency bonus", () => {
		const instance = companion("anomalies", "anomaly-0006");
		const damageAt = (level: number) =>
			action(combatAt(instance, level).combat, "Shadow Strike").damage;
		expect([1, 5, 11, 17].map(damageAt)).toEqual([
			"1d6 + 2",
			"2d6 + 3",
			"3d6 + 4",
			"4d6 + 6",
		]);
		const strike = action(combatAt(instance, 5).combat, "Shadow Strike");
		expect(strike).toMatchObject({
			source: "anomaly",
			group: "action",
			kind: "attack",
			attackBonus: 6,
			saveDc: null,
			damageType: "necrotic",
		});
		expect(strike.description).toBe(
			"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 2d6 + 3 necrotic damage.",
		);
	});

	it("rolls save-based effects without proficiency bonus and keeps recharge ranges", () => {
		const roar = action(
			combatAt(companion("anomalies", "anomaly-0006"), 5).combat,
			"Abyssal Roar",
		);
		expect(roar).toMatchObject({
			kind: "save",
			attackBonus: null,
			saveDc: 12,
			damage: "2d6",
			recharge: "5-6",
		});
		expect(roar.description).toBe(
			"Recharge 5–6. Each creature in a 20-foot cone must make a DC 12 Vitality saving throw, taking 2d6 force damage on a failed save, or half as much on a success.",
		);
	});

	it("keeps each roll's die size and leaves non-damage dice unchanged", () => {
		const scaled = scaleCompanionAtLevel(5, { rank: "C", hitDie: 10 });
		expect(
			scaleCompanionText(
				"Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 3d10 + 4 slashing damage.",
				scaled,
				"attack",
			),
		).toBe(
			"Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 2d10 + 3 slashing damage.",
		);
		expect(
			scaleCompanionText(
				"The target is stunned for 1d4 rounds and takes 1d6 psychic damage (DC 15 Sense save).",
				scaled,
				"dice",
			),
		).toBe(
			"The target is stunned for 1d4 rounds and takes 2d6 psychic damage (DC 13 Sense save).",
		);
	});

	it("adds proficiency bonus once per attack and recomputes printed averages", () => {
		const grasp = action(
			combatAt(companion("anomalies", "anomaly-0701"), 5).combat,
			"Grasp and Pull",
		);
		expect(grasp).toMatchObject({
			kind: "attack",
			damage: "2d8 + 3",
			saveDc: 12,
		});
		expect(grasp.description).toBe(
			"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12 (2d8 + 3) necrotic damage, and the target is grappled (escape DC 12) as the Worn drags it toward the dark.",
		);
		expect(
			scaleCompanionText(
				"Hit: 1d8 piercing damage plus 1d6 poison damage.",
				scaleCompanionAtLevel(1, { rank: "D", hitDie: 8 }),
				"attack",
			),
		).toBe("Hit: 1d8 + 2 piercing damage plus 1d6 poison damage.");
	});

	it("drops the K9 bite's authored flat bonus and adds proficiency bonus", () => {
		const bite = action(
			combatAt(companion("vehicles", "mount-bureau-k9-mastiff"), 5).combat,
			"Bite",
		);
		expect(bite).toMatchObject({
			source: "mount",
			kind: "attack",
			damage: "2d6 + 3",
			attackBonus: 6,
			saveDc: 12,
		});
		expect(bite.description).toBe(
			"Melee Weapon Attack: +6 to hit, reach 5 ft. Hit: 2d6 + 3 piercing damage. Target STR save DC 12 or knocked prone.",
		);
	});

	it("gives size-scaled mounts their natural attacks", () => {
		const { scaled, combat } = combatAt(
			companion("vehicles", "mount-mana-touched-wolf"),
			5,
		);
		expect(scaled).toMatchObject({ kind: "size", hpMax: 40, hitDice: "5d8" });
		const bite = action(combat, "Bite");
		expect(bite).toMatchObject({
			source: "natural",
			kind: "attack",
			attackBonus: 6,
			damage: "2d8 + 3",
			damageType: "piercing",
		});
		expect(bite.description).toBe(
			"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 2d8 + 3 piercing damage.",
		);

		const bear = combatAt(
			companion("vehicles", "mount-mountain-patrol-bear"),
			11,
		).combat;
		expect(bear.actions.map((entry) => entry.name)).toEqual([
			"Multiattack",
			"Bite",
			"Claws",
		]);
		expect(
			bear.actions
				.filter((entry) => entry.source === "natural")
				.map((entry) => `${entry.name} ${entry.damage} ${entry.damageType}`),
		).toEqual(["Bite 3d10 + 4 piercing", "Claws 3d10 + 4 slashing"]);
		expect(bear.traits.map((trait) => trait.name)).toContain("Cold Resistance");

		const hooves = action(
			combatAt(companion("vehicles", "mount-sovereign-steed"), 1).combat,
			"Hooves",
		);
		expect(hooves).toMatchObject({ damage: "1d10 + 2", attackBonus: 7 });
	});

	it("merges a linked mount's abilities with its Anomaly's actions and traits", () => {
		const { combat } = combatAt(
			companion("vehicles", "mount-bonded-eternal-void-beast"),
			1,
		);
		expect(combat.anomalyId).toBe("anomaly-0002");
		// The mount is C rank: attack 2 + 2 + PB 2; the stat block's 5d6 becomes 1d6 + PB.
		expect(action(combat, "Shadow Strike")).toMatchObject({
			source: "anomaly",
			group: "action",
			attackBonus: 6,
			damage: "1d6 + 2",
		});
		expect(action(combat, "Pursuit Lunge")).toMatchObject({
			source: "mount",
			group: "bonus",
		});
		expect(action(combat, "Nimble Reposition")).toMatchObject({
			source: "anomaly",
			group: "bonus",
		});
		expect(action(combat, "Retaliate")).toMatchObject({ group: "reaction" });
		// The bonded overlay's Beast Instinct replaces the wild trait of that name.
		expect(
			combat.traits
				.filter((trait) => trait.name === "Beast Instinct")
				.map((trait) => trait.source),
		).toEqual(["mount"]);
		expect(combat.traits.map((trait) => trait.name)).toContain(
			"Ascendant Physiology",
		);
	});

	it("scales a linked mount's save ability and rolls extra damage without proficiency bonus", () => {
		const breath = action(
			combatAt(
				companion("vehicles", "mount-bonded-ancient-dragon-hatchling"),
				5,
			).combat,
			"Ember Breath",
		);
		// B rank: DC 8 + 3 + PB 3.
		expect(breath).toMatchObject({
			kind: "save",
			saveDc: 14,
			damage: "2d6",
			recharge: "5-6",
		});
		expect(breath.description).toContain(
			"DC 14 AGI save, taking 2d6 fire damage",
		);

		const shared = action(
			combatAt(companion("vehicles", "mount-bonded-shadow-anomaly"), 5).combat,
			"Shared Shadow Strike",
		);
		expect(shared.damage).toBe("2d6");
		expect(shared.description).toContain("an extra 2d6 necrotic damage");
	});

	it("includes legendary actions and leaves lair actions with the wild creature's lair", () => {
		const { combat } = combatAt(companion("anomalies", "anomaly-0005"), 20);
		expect(
			combat.actions
				.filter((entry) => entry.group === "legendary")
				.map((entry) => entry.name),
		).toEqual(["Detect", "Strike", "Surge (Costs 2 Actions)"]);
		expect(combat.actions.some((entry) => entry.name === "Lattice Surge")).toBe(
			false,
		);
	});

	it("gives every scaled creature its full authored action list", () => {
		const { combat } = combatAt(
			companion("vehicles", "mount-mana-touched-wolf"),
			1,
		);
		expect(combat.actions.map((entry) => entry.name)).toEqual(["Bite"]);
		expect(combat.traits.map((entry) => entry.name)).toEqual(["Mana-Sense"]);
	});
});

describe("species facts on the companion sheet", () => {
	it("reads ability scores and defenses from the stat block and uses the scaled PB", () => {
		const instance = companion("anomalies", "anomaly-0006");
		const scaled = scaleCompanionInstance(instance, 5);
		if (!scaled) throw new Error("expected scaling");
		const facts = companionSpeciesFacts(instance, scaled);
		expect(facts).toMatchObject({
			speciesName: "Eternal Ancient Dragon",
			size: "Large",
			creatureType: "Elemental",
			languages: "Primordial",
			damageVulnerabilities: ["radiant"],
			damageResistances: ["necrotic"],
			damageImmunities: ["poison"],
			weaknesses: ["Light", "Holy Damage"],
			speeds: [{ mode: "walk", feet: 30 }],
		});
		expect(
			facts?.abilities.map((entry) => `${entry.ability} ${entry.score}`),
		).toEqual(["STR 12", "AGI 14", "VIT 16", "INT 10", "SENSE 10", "PRE 10"]);
		// Proficient saves and skills add PB 3 at level 5, not the wild block's +2.
		expect(facts?.savingThrows).toEqual([
			{ ability: "AGI", bonus: 5 },
			{ ability: "VIT", bonus: 6 },
		]);
		expect(facts?.skills).toEqual([
			{ name: "Perception", bonus: 3 },
			{ name: "Mana Flow", bonus: 3 },
		]);
		expect(facts?.senses).toBe("darkvision 60 ft., passive Perception 13");
	});

	it("uses a linked mount's own size and speeds with its Anomaly's scores", () => {
		const instance = companion("vehicles", "mount-bonded-eternal-void-wraith");
		const scaled = scaleCompanionInstance(instance, 1);
		if (!scaled) throw new Error("expected scaling");
		const facts = companionSpeciesFacts(instance, scaled);
		expect(facts?.speciesName).toBe("Eternal Void Wraith");
		expect(facts?.size).toBe("medium");
		expect(facts?.speeds).toEqual([{ mode: "fly", feet: 50 }]);
		expect(facts?.abilities).toHaveLength(6);
	});

	it("reports only size and speeds for a size-scaled mount", () => {
		const instance = companion("vehicles", "mount-mana-touched-wolf");
		const scaled = scaleCompanionInstance(instance, 1);
		if (!scaled) throw new Error("expected scaling");
		expect(companionSpeciesFacts(instance, scaled)).toMatchObject({
			speciesName: "Mana-Touched Wolf",
			size: "medium",
			abilities: [],
			savingThrows: [],
			skills: [],
			senses: null,
			speeds: [{ mode: "walk", feet: 50 }],
		});
	});

	it("formats speeds as a stat block does", () => {
		expect(
			formatCompanionSpeeds([
				{ mode: "fly", feet: 80 },
				{ mode: "walk", feet: 30 },
			]),
		).toBe("30 ft., fly 80 ft.");
		expect(formatCompanionSpeeds([{ mode: "fly", feet: 50 }])).toBe(
			"fly 50 ft.",
		);
	});
});

describe("effective companion stats", () => {
	it("uses scaled maximum HP and keeps current HP through a level-up", () => {
		const instance = companion("anomalies", "anomaly-0006");
		expect(
			resolveCompanionEffectiveStats(
				instance,
				{ currentHp: 30, hpMax: 12, baseAc: 13, speed: 30 },
				undefined,
				5,
			),
		).toMatchObject({ hpMax: 50, currentHp: 30, baseAc: 12, speed: 30 });
		const levelSix = resolveCompanionEffectiveStats(
			instance,
			{ currentHp: 30, speed: 30 },
			undefined,
			6,
		);
		expect(levelSix).toMatchObject({ hpMax: 60, currentHp: 30 });
		expect(levelSix?.combatScaling).toMatchObject({
			hitDice: "6d10",
			proficiencyBonus: 3,
		});
	});
});
