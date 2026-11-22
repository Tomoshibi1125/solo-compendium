import { describe, expect, it } from "vitest";
import { type Path, paths } from "@/data/compendium/paths";
import { findCanonicalCastableByName } from "@/lib/canonicalCompendium";
import { calculateFeatureUses } from "@/lib/characterEngine";
import {
	calculateTotalChoices,
	getLevelUpChoiceDeltas,
} from "@/lib/choiceCalculations";
import { getPathChoiceLedger } from "@/lib/pathLedger";

const path = (id: string): Path => {
	const match = paths.find((entry) => entry.id === id);
	if (!match) throw new Error(`Missing path ${id}`);
	return match;
};

const feature = (pathId: string, name: string) => {
	const match = path(pathId).features.find((entry) => entry.name === name);
	if (!match) throw new Error(`Missing ${pathId} / ${name}`);
	return match;
};

const ability = (pathId: string, name: string) => {
	const match = path(pathId).abilities.find((entry) => entry.name === name);
	if (!match) throw new Error(`Missing ${pathId} / ${name}`);
	return match;
};

const choiceSource = (pathId: string) => {
	const entry = path(pathId);
	return { features: entry.features, ...getPathChoiceLedger(entry) };
};

const TASK3_PATHS = [
	"mage--phantasmist",
	"destroyer--spell-breaker",
	"destroyer--apex-predator",
	"destroyer--tactician",
	"mage--matter-weaver",
	"contractor--infernal-conduit",
	"contractor--void-whisperer",
	"contractor--radiant-vessel",
	"contractor--cursed-blade",
	"contractor--deep-dweller",
	"holy-knight--dominance-mandate",
	"holy-knight--atonement-mandate",
	"holy-knight--exaltation-mandate",
];

describe("Task 3 Path canon", () => {
	it("authors the Phantasmist's phantasm instead of a missing cantrip", () => {
		const text = feature("mage--phantasmist", "Refined Projection").description;
		expect(text).not.toMatch(/Minor Illusion/);
		expect(text).toMatch(/Intelligence \(Investigation\) check/);
	});

	it("gives the Spell Breaker third-caster known counts", () => {
		const spellBreaker = path("destroyer--spell-breaker");
		expect(spellBreaker.spellcasting?.source).toBe("Weave-Combat Attunement");
		const atThird = calculateTotalChoices(
			{},
			choiceSource(spellBreaker.id),
			[],
			3,
		);
		expect(atThird).toMatchObject({ cantrips: 2, spells: 3 });
		const atTwentieth = calculateTotalChoices(
			{},
			choiceSource(spellBreaker.id),
			[],
			20,
		);
		expect(atTwentieth).toMatchObject({ cantrips: 3, spells: 13 });
	});

	it("asks the Apex Predator for a second Fighting Style at 10th level", () => {
		const source = choiceSource("destroyer--apex-predator");
		expect(getLevelUpChoiceDeltas({}, source, [], 9, 10).fightingStyles).toBe(
			1,
		);
		expect(
			feature("destroyer--apex-predator", "Secondary Discipline").description,
		).toMatch(/RA Fighting Style catalog/);
	});

	it("learns Tactician maneuvers as Techniques and scales tactical dice", () => {
		const source = choiceSource("destroyer--tactician");
		expect(calculateTotalChoices({}, source, [], 3).techniques).toBe(3);
		expect(calculateTotalChoices({}, source, [], 15).techniques).toBe(9);
		const charge = feature("destroyer--tactician", "Tactical Charge");
		expect(charge).toMatchObject({
			uses: { recharge: "short-rest" },
			tracking: "uses",
		});
		const dice = (level: number, pb: number) =>
			calculateFeatureUses(charge.uses?.formula ?? null, level, pb);
		expect([
			dice(3, 2),
			dice(6, 3),
			dice(7, 3),
			dice(14, 5),
			dice(15, 5),
		]).toEqual([4, 4, 5, 5, 6]);
	});

	it("names every Aetheric Core benefit as a Path option", () => {
		const choices = path("mage--matter-weaver").levelChoices ?? [];
		const core = choices.find((choice) => choice.source === "Aetheric Core");
		expect(core).toMatchObject({ level: 6, type: "path-option", count: 1 });
		expect(core?.options?.map((option) => option.name)).toEqual([
			"Night Lattice",
			"Swift Lattice",
			"Enduring Lattice",
			"Acid Ward",
			"Cold Ward",
			"Fire Ward",
			"Lightning Ward",
			"Thunder Ward",
		]);
		const rite = feature("mage--matter-weaver", "Master Weaver's Rite");
		expect(rite.description).toMatch(/until you finish a long rest/);
		for (const effect of [
			"Grand Realignment",
			"Purge",
			"Raise the Fallen",
			"Reverse the Years",
		]) {
			expect(rite.description).toContain(effect);
		}
	});

	it("grants the Radiant Vessel two canonical radiant cantrips", async () => {
		const light = feature("contractor--radiant-vessel", "Absolute Light");
		const names = light.grants?.spells.map((spell) => spell.name) ?? [];
		expect(names).toEqual(["Oath Flare", "Corona Storm"]);
		for (const name of names) {
			const spell = await findCanonicalCastableByName(name, undefined, [
				"spells",
			]);
			expect(spell?.power_level, name).toBe(0);
		}
		expect(
			feature("contractor--radiant-vessel", "Aetheric Radiance"),
		).toMatchObject({
			actionType: "Bonus action",
			uses: { formula: "1 + level", recharge: "long-rest" },
			tracking: "uses",
		});
	});

	it("quantifies the Contractor and Holy Knight effects the review flagged", () => {
		expect(
			feature("contractor--infernal-conduit", "Aetheric Siphon").description,
		).toMatch(/PRE modifier \+ your Contractor level/);
		expect(
			feature("contractor--infernal-conduit", "Hurl Through the Void")
				.description,
		).toMatch(/no saving throw.*end of your next turn.*10d10 psychic/s);
		expect(
			ability("contractor--void-whisperer", "Void Scream").description,
		).toMatch(
			/INT saving throw against your Job save DC.*stunned until the end of your next turn/s,
		);
		expect(
			feature("contractor--void-whisperer", "Absolute Thrall").description,
		).toMatch(/no saving throw.*only one thrall/s);
		expect(feature("contractor--cursed-blade", "Absolute Curse")).toMatchObject(
			{
				actionType: "Bonus action",
				uses: { formula: "1", recharge: "short-rest" },
			},
		);
		expect(
			feature("contractor--cursed-blade", "Aetheric Remnant").description,
		).toMatch(/Spectral Sentinel \(Medium\): AC 12; 22 hit points/);
		expect(
			feature("contractor--deep-dweller", "Tentacle of the Absolute"),
		).toMatchObject({ uses: { formula: "PB", recharge: "long-rest" } });
		expect(
			ability("holy-knight--atonement-mandate", "Harmonic Shield").description,
		).toMatch(/within 30 feet.*half \(rounded down\)/s);
		expect(
			ability("holy-knight--exaltation-mandate", "Heroic Manifestation")
				.description,
		).toMatch(/3d8 radiant damage/);
	});

	it("leaves no 5e class names or vague placeholders in Task 3 Path text", () => {
		const banned =
			/\b(wizard|warlock|paladin|fighter)\b|various buffs|absolute (bonus|equivalent)|restorative output|unnamed/i;
		for (const id of TASK3_PATHS) {
			const entry = path(id);
			for (const item of [...entry.features, ...entry.abilities]) {
				expect(item.description, `${id} / ${item.name}`).not.toMatch(banned);
			}
		}
	});
});
