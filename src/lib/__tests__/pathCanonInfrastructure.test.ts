import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PATH_CASTERS } from "@/data/compendium/pathSpellcasting";
import { paths } from "@/data/compendium/paths";
import {
	getCantripsKnownLimit,
	getCasterType,
	getSpellcastingAbility,
	getSpellSlotsPerLevel,
	getSpellsKnownLimit,
} from "@/lib/characterCalculations";
import { addPathSpellGrants } from "@/lib/characterCreation";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import { createLocalCharacter, listLocalSpells } from "@/lib/guestStore";
import { toCastingReference } from "@/lib/jobRules";
import {
	buildPathOptionFeatureId,
	countOpenPathOptions,
	findPathIn,
	getPathChoiceIssues,
	getPathChoiceLedger,
	getPathOptionGroups,
	pathOptionFeatureName,
} from "@/lib/pathLedger";

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

describe("Path choice ledger in the shared choice totals", () => {
	it("counts cantrip and spell entries for a source without known-count tables", () => {
		const totals = calculateTotalChoices(
			{},
			{
				features: [
					{ level: 3, name: "Grant", description: "Learn 2 cantrips." },
				],
				level_choices: [
					{ level: 3, type: "cantrip", count: 2, source: "Grant" },
					{ level: 6, type: "spell", count: 2, source: "Grant" },
				],
				structured_sources: ["Grant"],
			},
			[],
			6,
		);
		// The ledger counts once; the matching prose is not parsed again.
		expect(totals.cantrips).toBe(2);
		expect(totals.spells).toBe(2);
	});

	it("lets a Path's known-count tables drive cantrips and spells", () => {
		const spellBreaker = paths.find(
			(path) => path.id === "destroyer--spell-breaker",
		);
		if (!spellBreaker) throw new Error("Spell Breaker missing");
		const source = {
			features: spellBreaker.features,
			...getPathChoiceLedger(spellBreaker),
		};
		expect(calculateTotalChoices({}, source, [], 2).spells).toBe(0);
		const atThird = calculateTotalChoices({}, source, [], 3);
		expect(atThird.cantrips).toBe(2);
		expect(atThird.spells).toBe(3);
		const atTenth = calculateTotalChoices({}, source, [], 10);
		expect(atTenth.cantrips).toBe(3);
		expect(atTenth.spells).toBe(7);
	});
});

describe("Path option groups (RA-23)", () => {
	const path = {
		id: "test--path",
		levelChoices: [
			{
				level: 3,
				type: "path-option" as const,
				count: 1,
				source: "Discipline",
				options: [
					{ name: "Alpha", description: "First." },
					{ name: "Beta", description: "Second." },
				],
			},
			{
				level: 6,
				type: "path-option" as const,
				count: 1,
				source: "Discipline",
				options: [{ name: "Gamma", description: "Third." }],
			},
		],
	};

	it("adds later grants to earlier picks and detects recorded rows", () => {
		const recorded = [{ name: pathOptionFeatureName("Discipline", "Alpha") }];
		const atThird = getPathOptionGroups(path, 3, recorded);
		expect(atThird).toHaveLength(1);
		expect(atThird[0]).toMatchObject({ required: 1, chosen: ["Alpha"] });
		expect(countOpenPathOptions(atThird)).toBe(0);

		const atSixth = getPathOptionGroups(path, 6, recorded);
		expect(atSixth[0].required).toBe(2);
		expect(atSixth[0].options.map((option) => option.name)).toEqual([
			"Alpha",
			"Beta",
			"Gamma",
		]);
		expect(countOpenPathOptions(atSixth)).toBe(1);

		const byFeatureId = getPathOptionGroups(path, 6, [
			{ feature_id: buildPathOptionFeatureId(path.id, "Discipline", "Beta") },
		]);
		expect(byFeatureId[0].chosen).toEqual(["Beta"]);
	});

	it("resolves Paths by id, name, and declared alias", () => {
		expect(findPathIn(paths, "assassin--weave-infiltrator")?.id).toBe(
			"assassin--weave-infiltrator",
		);
		expect(findPathIn(paths, { name: "Path of the Lattice-Breaker" })?.id).toBe(
			"assassin--weave-infiltrator",
		);
		expect(findPathIn(paths, { name: "Path of Nothing" })).toBeNull();
	});

	it("keeps every authored Path choice complete", () => {
		const issues = paths.flatMap((path) =>
			getPathChoiceIssues(path).map((issue) => `${path.id}: ${issue}`),
		);
		expect(issues).toEqual([]);
	});
});

describe("Third-caster Path spellcasting", () => {
	const spellBreaker = {
		name: "Destroyer",
		id: "destroyer",
		pathId: "destroyer--spell-breaker",
	};

	it("casts only through the Path of the Path's own Job", () => {
		expect(getCasterType("Destroyer")).toBe("none");
		expect(getCasterType(spellBreaker)).toBe("third");
		expect(getSpellcastingAbility(spellBreaker)).toBe("INT");
		expect(
			getCasterType({ name: "Berserker", pathId: "destroyer--spell-breaker" }),
		).toBe("none");
		// A casting Job keeps its own progression.
		expect(
			getCasterType({ name: "Mage", pathId: "destroyer--spell-breaker" }),
		).toBe("full");
		expect(
			getCasterType(
				toCastingReference({
					job: "Assassin",
					path: "Path of the Lattice-Breaker",
				}),
			),
		).toBe("third");
	});

	it("uses the third-caster slot and known-count tables", () => {
		expect(getSpellSlotsPerLevel("third", 2)[1]).toBe(0);
		expect(getSpellSlotsPerLevel("third", 3)).toMatchObject({ 1: 2, 2: 0 });
		expect(getSpellSlotsPerLevel("third", 7)).toMatchObject({ 1: 4, 2: 2 });
		expect(getSpellSlotsPerLevel("third", 13)).toMatchObject({
			1: 4,
			2: 3,
			3: 2,
		});
		expect(getSpellSlotsPerLevel("third", 20)).toMatchObject({
			1: 4,
			2: 3,
			3: 3,
			4: 1,
		});
		expect(getCantripsKnownLimit(spellBreaker, 3)).toBe(2);
		expect(getCantripsKnownLimit(spellBreaker, 10)).toBe(3);
		expect(getSpellsKnownLimit(spellBreaker, 3)).toBe(3);
		expect(getSpellsKnownLimit(spellBreaker, 20)).toBe(13);
		expect(getSpellsKnownLimit("Destroyer", 20)).toBeNull();
	});

	it("matches the Path catalog's names and aliases", () => {
		for (const caster of PATH_CASTERS) {
			const path = paths.find((candidate) => candidate.id === caster.pathId);
			expect(path, caster.pathId).toBeDefined();
			expect(path?.jobId).toBe(caster.jobId);
			expect(path?.spellcasting).toEqual(caster.spellcasting);
			expect([...caster.names].sort()).toEqual(
				[path?.name ?? "", ...(path?.aliases ?? [])].sort(),
			);
			expect(
				path?.features.some(
					(feature) => feature.name === caster.spellcasting.source,
				),
			).toBe(true);
		}
	});
});

describe("Path spell grants", () => {
	let restoreLocalStorage: (() => void) | undefined;

	beforeEach(() => {
		restoreLocalStorage = installIsolatedLocalStorage();
	});

	afterEach(() => {
		restoreLocalStorage?.();
	});

	it("adds granted spells once, from their own level", async () => {
		const character = createLocalCharacter({
			name: "Grantee",
			job: "Contractor",
			level: 1,
		});
		const features = [
			{
				level: 1,
				grants: {
					spells: [{ name: "Oath Flare" }, { name: "Mana Lens", level: 3 }],
				},
			},
		];
		await addPathSpellGrants(character.id, "Test Path", features, 1);
		await addPathSpellGrants(character.id, "Test Path", features, 1);
		let granted = listLocalSpells(character.id).filter(
			(spell) => spell.source === "Path Spell: Test Path",
		);
		expect(granted.map((spell) => spell.name)).toEqual(["Oath Flare"]);
		expect(granted[0]).toMatchObject({
			is_known: true,
			counts_against_limit: false,
			spell_level: 0,
		});

		await addPathSpellGrants(character.id, "Test Path", features, 3);
		granted = listLocalSpells(character.id).filter(
			(spell) => spell.source === "Path Spell: Test Path",
		);
		expect(granted.map((spell) => spell.name).sort()).toEqual([
			"Mana Lens",
			"Oath Flare",
		]);
	});
});
