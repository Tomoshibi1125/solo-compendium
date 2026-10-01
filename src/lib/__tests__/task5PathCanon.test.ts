import { describe, expect, it } from "vitest";
import { type Path, paths } from "@/data/compendium/paths";
import { powers } from "@/data/compendium/powers";
import { techniques } from "@/data/compendium/techniques";
import {
	listLearnablePowers,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import {
	getPathChoiceIssues,
	getPathChoiceLedger,
	getPathOptionGroups,
} from "@/lib/pathLedger";
import {
	describeAbilityDamage,
	readAbilityDamageBasis,
	resolveAbilityDamageRoll,
} from "@/lib/powerActionFormulas";
import {
	getStrikerMartialArtsDie,
	pathUsesStrikerUnarmedDie,
} from "@/lib/weaponAutomation";

const DANCE = "idol--dance-resonance";
const DANCE_NAME = "Path of the Dance Resonance";

const path = (id: string): Path => {
	const match = paths.find((entry) => entry.id === id);
	if (!match) throw new Error(`Missing path ${id}`);
	return match;
};

const feature = (pathId: string, name: string) => {
	const match = path(pathId).features.find((item) => item.name === name);
	if (!match) throw new Error(`Missing ${pathId} / ${name}`);
	return match;
};

const catalogEntry = (
	list: readonly { name: string; mechanics?: unknown }[],
	name: string,
) => {
	const match = list.find((entry) => entry.name === name);
	if (!match) throw new Error(`Missing catalog entry ${name}`);
	return match as {
		name: string;
		description?: string;
		higher_levels?: string | null;
		mechanics?: unknown;
	};
};

// Combat Choreography's Dance Repertoire, by the level each entry unlocks.
const REPERTOIRE = {
	power: {
		3: ["Dissonant Strike", "Kinetic Rush"],
		6: ["Shockwave Palm"],
		14: ["Killing Tempo", "Infinite Barrage"],
	},
	technique: {
		3: ["Rhythmic Strike", "Nerve Disruption"],
		6: ["Meridian Cascade"],
		14: ["Whirlwind Execution", "Infinite Combo"],
	},
} as const;

const repertoireAt = (kind: "power" | "technique", level: number) =>
	Object.entries(REPERTOIRE[kind])
		.filter(([unlock]) => Number(unlock) <= level)
		.flatMap(([, names]) => [...names])
		.sort();

const learnedNames = async (
	kind: "power" | "technique",
	pathName: string | undefined,
	characterLevel: number,
) => {
	const list =
		kind === "power"
			? await listLearnablePowers({
					jobName: "Idol",
					pathName,
					characterLevel,
				})
			: await listLearnableTechniques({
					jobName: "Idol",
					pathName,
					characterLevel,
				});
	return list.map((entry) => entry.name);
};

describe("Task 5 Path canon: Dance Resonance", () => {
	it("records the Combat Choreography discipline as a Path choice", () => {
		expect(getPathChoiceIssues(path(DANCE))).toEqual([]);
		expect(getPathOptionGroups(path(DANCE), 2, [])).toEqual([]);
		const [group] = getPathOptionGroups(path(DANCE), 3, []);
		expect(group).toMatchObject({
			source: "Combat Choreography",
			required: 1,
		});
		expect(group.options.map((option) => option.name)).toEqual([
			"K-Pop",
			"Contemporary",
			"Ballet",
			"Hip-Hop",
		]);
		const hipHop = group.options.find((option) => option.name === "Hip-Hop");
		expect(hipHop?.description).toMatch(
			/Once per turn.*unarmed strike, push it up to 10 feet/,
		);
		expect(hipHop?.description).not.toMatch(/force damage/);
	});

	it("states the unarmed die, the switch rule, and the repertoire", () => {
		const text = feature(DANCE, "Combat Choreography").description;
		expect(text).toMatch(
			/Striker unarmed die: a d4.*d6 at 5th.*d8 at 11th.*d10 at 17th/,
		);
		expect(text).toMatch(/whenever you gain an Idol level, you can switch/);
		expect(text).toMatch(/Hip-Hop: once per turn.*push it up to 10 feet/);
		expect(text).not.toMatch(/PRS|force damage/);
		for (const names of [
			...Object.values(REPERTOIRE.power),
			...Object.values(REPERTOIRE.technique),
		]) {
			for (const name of names) expect(text).toContain(name);
		}
	});

	it("counts one repertoire power and technique at 3rd, 6th, and 14th level", () => {
		const source = {
			features: path(DANCE).features,
			...getPathChoiceLedger(path(DANCE)),
		};
		const expected: Array<[number, number]> = [
			[2, 0],
			[3, 1],
			[5, 1],
			[6, 2],
			[13, 2],
			[14, 3],
			[20, 3],
		];
		for (const [level, count] of expected) {
			const totals = calculateTotalChoices({}, source, [], level);
			expect(totals.powers, `powers at ${level}`).toBe(count);
			expect(totals.techniques, `techniques at ${level}`).toBe(count);
		}
	});

	it("limits the repertoire to its named entries, by level", async () => {
		for (const kind of ["power", "technique"] as const) {
			const base = new Set(await learnedNames(kind, undefined, 20));
			for (const level of [2, 3, 5, 6, 13, 14, 20]) {
				const added = (await learnedNames(kind, DANCE_NAME, level))
					.filter((name) => !base.has(name))
					.sort();
				expect(added, `${kind}s at ${level}`).toEqual(
					repertoireAt(kind, level),
				);
			}
			const lore = await learnedNames(kind, "Path of the Lore Resonance", 20);
			expect(
				lore.filter((name) => !base.has(name)),
				`Lore ${kind}s`,
			).toEqual([]);
		}
	});

	it("marks which repertoire dice are added and which use the unarmed die", () => {
		const added = [
			catalogEntry(powers, "Dissonant Strike"),
			catalogEntry(powers, "Kinetic Rush"),
			catalogEntry(powers, "Shockwave Palm"),
			catalogEntry(powers, "Killing Tempo"),
			catalogEntry(powers, "Infinite Barrage"),
			catalogEntry(techniques, "Whirlwind Execution"),
			catalogEntry(techniques, "Infinite Combo"),
		];
		for (const entry of added) {
			expect(readAbilityDamageBasis(entry.mechanics), entry.name).toBe("added");
			// Added dice stay flat: no upcast or per-level damage growth.
			expect(
				`${entry.description ?? ""} ${entry.higher_levels ?? ""}`,
				entry.name,
			).not.toMatch(/damage increases by/i);
		}
		for (const name of [
			"Rhythmic Strike",
			"Nerve Disruption",
			"Meridian Cascade",
		]) {
			const entry = catalogEntry(techniques, name);
			expect(readAbilityDamageBasis(entry.mechanics), name).toBe("unarmed-die");
			expect(entry.description, name).toMatch(/your unarmed die/);
		}
		const rhythmic = catalogEntry(techniques, "Rhythmic Strike");
		expect(rhythmic.description).toMatch(/unarmed die \+ your PRE modifier/);
		expect(rhythmic.description).not.toMatch(/PRS/);
	});
});

describe("Dance Resonance unarmed damage", () => {
	it("gives Dance Resonance Idols the Striker unarmed die", () => {
		expect(pathUsesStrikerUnarmedDie({ path_id: DANCE })).toBe(true);
		expect(pathUsesStrikerUnarmedDie({ path: DANCE_NAME })).toBe(true);
		expect(
			pathUsesStrikerUnarmedDie({
				path: "Path of the Lore Resonance",
				path_id: "idol--lore-resonance",
			}),
		).toBe(false);
		expect(pathUsesStrikerUnarmedDie(null)).toBe(false);
	});

	it("scales unarmed-die damage by level and keeps added dice flat", () => {
		const byLevel: Array<[number, string]> = [
			[3, "1d4"],
			[5, "1d6"],
			[11, "1d8"],
			[17, "1d10"],
		];
		for (const [level, die] of byLevel) {
			expect(getStrikerMartialArtsDie(level)).toBe(die);
			expect(resolveAbilityDamageRoll("1d4", "unarmed-die", level, 3)).toBe(
				`${die}+3`,
			);
			expect(resolveAbilityDamageRoll("1d8", "added", level, 3)).toBe("1d8");
		}
		// Entries without a basis keep the old rule: dice plus the modifier.
		expect(resolveAbilityDamageRoll("2d6", null, 5, 2)).toBe("2d6+2");
	});

	it("describes the damage basis on detail views", () => {
		expect(describeAbilityDamage("2d6", "added", "bludgeoning")).toBe(
			"+2d6 bludgeoning, added to the strike",
		);
		expect(describeAbilityDamage("1d4", "unarmed-die", "thunder")).toBe(
			"Unarmed die thunder (d4; d6 at 5th level, d8 at 11th, d10 at 17th)",
		);
		expect(describeAbilityDamage("3d6", null, "force")).toBe("3d6 force");
	});
});
