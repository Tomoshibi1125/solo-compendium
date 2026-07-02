/**
 * M8 — artifact mechanic strings must actually reach the engine.
 *
 * Artifacts keep their mechanics in `effects.passive` prose. Those strings
 * flow through buildItemProperties → parseModifiers → the character sheet
 * (useCharacterDerivedStats), so two failure classes matter:
 *  1. DEAD mechanics — canonical 5e phrasings ("Grants resistance to fire
 *     and lightning damage.", "You cannot be frightened…") that the parser
 *     silently ignores.
 *  2. MIS-BINDS — narrative text ("deals 1d6 damage per turn", "DC 15
 *     Strength saving throw") that the bare-number regexes turn into phantom
 *     flat bonuses.
 * These tests pin the intended semantics for both classes, plus the real
 * artifact dataset.
 */

import { describe, expect, it } from "vitest";
import { artifacts } from "@/data/compendium/artifacts";
import { buildItemProperties } from "@/lib/characterCreation";
import { parseModifiers } from "@/lib/equipmentModifiers";

type StaticItemArg = Parameters<typeof buildItemProperties>[0];

const modifiersFor = (id: string) => {
	const artifact = artifacts.find((entry) => entry.id === id);
	if (!artifact) throw new Error(`artifact ${id} missing from dataset`);
	return parseModifiers(
		buildItemProperties(artifact as unknown as StaticItemArg),
	);
};

describe("parseModifiers — narrative text must not mis-bind", () => {
	it("does not turn damage-dice riders into flat damage bonuses", () => {
		const mods = parseModifiers([
			"On critical hit, inflicts a bleeding condition that deals 1d6 damage per turn.",
		]);
		expect(mods.damage).toBeUndefined();
	});

	it("does not turn save DCs into ability score bonuses", () => {
		const mods = parseModifiers([
			"The target must succeed on a DC 15 Strength saving throw or be pulled 10 ft.",
		]);
		expect(mods.str).toBeUndefined();
		expect(mods.agi).toBeUndefined();
	});

	it("does not bind ally-aura bonuses to the wielder", () => {
		const mods = parseModifiers([
			"While this shield is equipped, allies within 10 ft of you gain a +2 bonus to AC and cannot be flanked.",
		]);
		expect(mods.ac).toBeUndefined();
		expect(mods.conditionImmunities).toBeUndefined();
	});

	it("does not bind conditional resistance with no fixed damage type", () => {
		const mods = parseModifiers([
			"While this shield is equipped, you have resistance to the last damage type that dealt you 10 or more damage, until you take that much damage from a different type.",
		]);
		expect(mods.resistances).toBeUndefined();
	});

	it("still binds explicitly signed bonuses", () => {
		const mods = parseModifiers([
			"+1 to attack",
			"+2 damage",
			"+2 Strength",
			"+10 ft speed",
			"+2 to Stealth",
		]);
		expect(mods.attack).toBe(1);
		expect(mods.damage).toBe(2);
		expect(mods.str).toBe(2);
		expect(mods.speed).toBe(10);
		expect(mods.skills?.Stealth).toBe(2);
	});
});

describe("parseModifiers — canonical prose phrasings must bind", () => {
	it("binds 'Grants resistance to <types> damage'", () => {
		const mods = parseModifiers([
			"Grants resistance to fire and lightning damage.",
		]);
		expect(mods.resistances).toEqual(["fire", "lightning"]);
	});

	it("binds 'Grants immunity to <type> damage'", () => {
		const mods = parseModifiers(["Grants immunity to necrotic damage."]);
		expect(mods.immunities).toEqual(["necrotic"]);
	});

	it("binds run-on 'you have resistance to <type> damage' sentences to the type list only", () => {
		const mods = parseModifiers([
			"While attuned, you have resistance to psychic damage and can see normally in magical darkness. You never suffer disadvantage from being unable to see your target.",
		]);
		expect(mods.resistances).toEqual(["psychic"]);
	});

	it("binds 'cannot be <condition>' as a condition immunity", () => {
		const mods = parseModifiers([
			"You cannot be frightened while wielding this blade.",
		]);
		expect(mods.conditionImmunities).toEqual(["frightened"]);
	});

	it("binds 'cannot be knocked prone' as prone immunity", () => {
		const mods = parseModifiers([
			"You are immune to being moved against your will and cannot be knocked prone.",
		]);
		expect(mods.conditionImmunities).toEqual(["prone"]);
	});
});

describe("artifact dataset — mechanic strings bind, narrative stays inert", () => {
	it("Stormcaller (artifact_2) grants fire + lightning resistance", () => {
		const mods = modifiersFor("artifact_2");
		expect(mods.resistances).toEqual(
			expect.arrayContaining(["fire", "lightning"]),
		);
	});

	it("the shroud (artifact_3) grants necrotic immunity", () => {
		const mods = modifiersFor("artifact_3");
		expect(mods.immunities).toEqual(expect.arrayContaining(["necrotic"]));
	});

	it("the dread blade (artifact_5) grants frightened immunity", () => {
		const mods = modifiersFor("artifact_5");
		expect(mods.conditionImmunities).toEqual(
			expect.arrayContaining(["frightened"]),
		);
	});

	it("the void reliquary (artifact_7) grants psychic resistance only", () => {
		const mods = modifiersFor("artifact_7");
		expect(mods.resistances).toEqual(["psychic"]);
	});

	it("the disaster core (artifact_9) grants prone immunity", () => {
		const mods = modifiersFor("artifact_9");
		expect(mods.conditionImmunities).toEqual(expect.arrayContaining(["prone"]));
	});

	it("the adaptive shield (artifact_10) binds no static resistance", () => {
		const mods = modifiersFor("artifact_10");
		expect(mods.resistances).toBeUndefined();
	});

	it("no artifact leaks narrative text into flat numeric bonuses", () => {
		for (const artifact of artifacts) {
			const mods = parseModifiers(
				buildItemProperties(artifact as unknown as StaticItemArg),
			);
			expect(mods.damage, `${artifact.id} damage`).toBeUndefined();
			expect(mods.attack, `${artifact.id} attack`).toBeUndefined();
			for (const ability of [
				"str",
				"agi",
				"vit",
				"int",
				"sense",
				"pre",
			] as const) {
				expect(mods[ability], `${artifact.id} ${ability}`).toBeUndefined();
			}
			expect(mods.speed, `${artifact.id} speed`).toBeUndefined();
			expect(mods.skills, `${artifact.id} skills`).toBeUndefined();
		}
	});
});
