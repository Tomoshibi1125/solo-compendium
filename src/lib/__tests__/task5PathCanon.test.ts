import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { type Path, paths } from "@/data/compendium/paths";
import { powers } from "@/data/compendium/powers";
import { spells } from "@/data/compendium/spells";
import { techniques } from "@/data/compendium/techniques";
import {
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "@/lib/canonicalCompendium";
import {
	addJobAwakeningBenefitsForLevel,
	reconcilePathSpellGrants,
} from "@/lib/characterCreation";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import {
	addLocalFeature,
	createLocalCharacter,
	listLocalSpells,
	removeLocalFeature,
} from "@/lib/guestStore";
import {
	buildPathOptionFeatureId,
	getChosenPathOptionGrants,
	getPathChoiceIssues,
	getPathChoiceLedger,
	getPathOptionGroups,
	pathOptionFeatureName,
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

const installIsolatedLocalStorage = (): (() => void) => {
	const store = new Map<string, string>();
	const storage: Storage = {
		get length() {
			return store.size;
		},
		clear: () => store.clear(),
		getItem: (key) => store.get(key) ?? null,
		key: (index) => Array.from(store.keys())[index] ?? null,
		removeItem: (key) => {
			store.delete(key);
		},
		setItem: (key, value) => {
			store.set(key, String(value));
		},
	};
	const prior = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
	Object.defineProperty(globalThis, "localStorage", {
		value: storage,
		configurable: true,
		writable: true,
	});
	return () => {
		if (prior) Object.defineProperty(globalThis, "localStorage", prior);
		else
			delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
	};
};

const optionNames = (pathId: string, level: number) =>
	getPathOptionGroups(path(pathId), level, []).flatMap((group) =>
		group.options.map((entry) => entry.name),
	);

const pathSpellNames = (characterId: string, pathName: string) =>
	listLocalSpells(characterId)
		.filter((spell) => spell.source === `Path Spell: ${pathName}`)
		.map((spell) => spell.name)
		.sort();

const TASK5_JOBS = new Set(["esper", "summoner", "herald", "idol"]);

describe("Task 5 Path canon", () => {
	let restoreLocalStorage: (() => void) | undefined;

	beforeEach(() => {
		restoreLocalStorage = installIsolatedLocalStorage();
	});

	afterEach(() => {
		restoreLocalStorage?.();
	});

	it("records the Aetheric Dragon's resonance and binds its damage type", () => {
		expect(optionNames("esper--draconic-lineage", 1)).toEqual([
			"Ember",
			"Storm",
			"Frost",
			"Venom",
			"Corrosion",
		]);
		expect(
			feature("esper--draconic-lineage", "regent-tier Resonance").description,
		).toMatch(/This choice is permanent/);
		const breath = path("esper--draconic-lineage").abilities.find(
			(entry) => entry.name === "Dragon Breath",
		);
		expect(breath?.description).toMatch(/your resonance's type.*Job save DC/s);
	});

	it("authors the full d20 Aetheric Cascade table", () => {
		const trigger = feature("esper--aetheric-cascade", "Cascade Trigger");
		for (let roll = 1; roll <= 20; roll += 1) {
			expect(trigger.description).toContain(`${roll}, `);
		}
		expect(trigger.description).toMatch(/Saving throws use your Job save DC/);
		expect(
			feature("esper--aetheric-cascade", "Selective Cascade").description,
		).toMatch(/roll twice and use either number/);
	});

	it("gives the Absolute Spark an affinity spell and the Herald list", async () => {
		const spark = path("esper--absolute-spark");
		const [affinity] = getPathOptionGroups(spark, 1, []);
		expect(
			affinity.options.map((entry) => entry.grants?.spells[0].name),
		).toEqual([
			"Healing Resonance",
			"Soul Siphon",
			"Resonance Pulse",
			"Hex Contract",
			"Aegis of the Absolute",
		]);
		const base = new Set(
			(await listLearnableSpells({ jobName: "Esper", characterLevel: 5 })).map(
				(entry) => entry.id,
			),
		);
		const withPath = await listLearnableSpells({
			jobName: "Esper",
			pathName: spark.name,
			characterLevel: 5,
		});
		const added = withPath.filter((entry) => !base.has(entry.id));
		expect(added.length).toBeGreaterThan(0);
		expect(added.every((entry) => entry.power_level <= 3)).toBe(true);
	});

	it("grants the Psionic Breach imprint spells at their Esper levels", async () => {
		const breach = path("esper--aberrant-mind");
		const character = createLocalCharacter({
			name: "Breach",
			job: "Esper",
			level: 5,
			path: breach.name,
			path_id: breach.id,
		});
		const esper = jobs.find((entry) => entry.id === "esper");
		if (!esper) throw new Error("Missing esper");
		await addJobAwakeningBenefitsForLevel(character.id, esper, 5);
		expect(pathSpellNames(character.id, breach.name)).toEqual([
			"Psychic Barrier",
			"Psychic Lance",
			"Whisper Network",
		]);
	});

	it("binds Biome Mantras spells to the recorded biome and swaps them", async () => {
		const architect = path("summoner--biome-architect");
		expect(optionNames(architect.id, 3)).toEqual([
			"Arctic",
			"Coastal",
			"Desert",
			"Forest",
			"Grassland",
			"Mountain",
			"Swamp",
			"Subterranean",
		]);
		const character = createLocalCharacter({
			name: "Architect",
			job: "Summoner",
			level: 5,
			path: architect.name,
			path_id: architect.id,
		});
		const record = (biome: string) =>
			addLocalFeature(character.id, {
				feature_id: buildPathOptionFeatureId(
					architect.id,
					"Biome Mantras",
					biome,
				),
				name: pathOptionFeatureName("Biome Mantras", biome),
				source: `Path Choice: ${architect.name}`,
				level_acquired: 3,
				description: biome,
				is_active: true,
			});
		const forest = record("Forest");
		await reconcilePathSpellGrants(character.id, { id: architect.id }, 5);
		expect(pathSpellNames(character.id, architect.name)).toEqual([
			"Rift Flora Eruption",
			"Snaring Vines",
		]);

		removeLocalFeature(forest.id);
		record("Desert");
		await reconcilePathSpellGrants(character.id, { id: architect.id }, 5);
		expect(pathSpellNames(character.id, architect.name)).toEqual([
			"Mana Barrage",
			"Triple Ignition",
		]);
	});

	it("records Lore proficiencies and Arcane Secrets as structured picks", () => {
		const lore = path("idol--lore-resonance");
		const source = { features: lore.features, ...getPathChoiceLedger(lore) };
		expect(calculateTotalChoices({}, source, [], 3).skills).toBe(3);
		const secrets = getPathOptionGroups(lore, 6, []).find(
			(group) => group.source === "Arcane Secrets",
		);
		expect(secrets?.required).toBe(2);
		expect(secrets?.options).toHaveLength(14);
		expect(
			secrets?.options.every((entry) => entry.grants?.spells.length === 1),
		).toBe(true);
		expect(calculateTotalChoices({}, source, [], 6).spells).toBe(0);
	});

	it("defines Summoner essence as spell slots and drops vague wording", () => {
		for (const owner of paths.filter((entry) => TASK5_JOBS.has(entry.jobId))) {
			for (const item of [...owner.features, ...owner.abilities]) {
				expect(item.description, `${owner.id} / ${item.name}`).not.toMatch(
					/essence|normaliz|wizard spell list|Guiding Resonance|PRS/i,
				);
			}
		}
		expect(
			feature("summoner--biome-architect", "Biome Absorption").description,
		).toMatch(/recover expended spell slots/);
	});
});

describe("Path spell grants", () => {
	it("resolves every feature and option grant to a catalog spell", () => {
		const names = new Set(spells.map((spell) => spell.name.toLowerCase()));
		const missing: string[] = [];
		for (const owner of paths) {
			const grants = [
				...owner.features.flatMap((item) => item.grants?.spells ?? []),
				...(owner.levelChoices ?? []).flatMap((choice) =>
					(choice.options ?? []).flatMap((entry) => entry.grants?.spells ?? []),
				),
			];
			for (const grant of grants) {
				if (!names.has(grant.name.toLowerCase()))
					missing.push(`${owner.id}: ${grant.name}`);
			}
			expect(getPathChoiceIssues(owner), owner.id).toEqual([]);
		}
		expect(missing).toEqual([]);
	});

	it("reads chosen option grants with their own levels", () => {
		const architect = path("summoner--biome-architect");
		const rows = [
			{
				name: pathOptionFeatureName("Biome Mantras", "Mountain"),
				feature_id: buildPathOptionFeatureId(
					architect.id,
					"Biome Mantras",
					"Mountain",
				),
			},
		];
		expect(getChosenPathOptionGrants(architect, 9, rows)).toEqual([
			{
				level: 3,
				grants: {
					spells: [
						{ name: "Stone Spikes", level: 3 },
						{ name: "Gravity Well", level: 5 },
						{ name: "Gravity Crush", level: 7 },
						{ name: "Rift Fissure", level: 9 },
					],
				},
			},
		]);
	});
});
