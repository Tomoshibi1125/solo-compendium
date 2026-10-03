import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { type Path, paths } from "@/data/compendium/paths";
import { addJobAwakeningBenefitsForLevel } from "@/lib/characterCreation";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import {
	addLocalFeature,
	createLocalCharacter,
	listLocalFeatures,
} from "@/lib/guestStore";
import { getPathChoiceLedger, getPathOptionGroups } from "@/lib/pathLedger";

const path = (id: string): Path => {
	const match = paths.find((entry) => entry.id === id);
	if (!match) throw new Error(`Missing path ${id}`);
	return match;
};

const entry = (pathId: string, name: string) => {
	const owner = path(pathId);
	const match = [...owner.features, ...owner.abilities].find(
		(item) => item.name === name,
	);
	if (!match) throw new Error(`Missing ${pathId} / ${name}`);
	return match;
};

const optionNames = (pathId: string, level: number) =>
	getPathOptionGroups(path(pathId), level, []).flatMap((group) =>
		group.options.map((option) => option.name),
	);

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

const STRIKER_PATHS = [
	"striker--kinetic-core",
	"striker--phantom-step",
	"striker--aetheric-channeler",
	"striker--entropic-flow",
	"striker--blade-conductor",
	"striker--harmonic-surgeon",
];

describe("Task 4 Path canon", () => {
	it("binds Gate Beast aspects to one recorded Primal Aspect choice", () => {
		expect(optionNames("berserker--gate-beast", 3)).toEqual([
			"Tank-Beast",
			"Raptor",
			"Pack-Leader",
		]);
		const aspect = path("berserker--gate-beast").features.find(
			(feature) => feature.name === "Primal Aspect",
		);
		expect(aspect?.formerNames).toEqual(["Bonded Aspect"]);
		for (const name of ["Biological Adaptation", "Apex Mandate"]) {
			expect(entry("berserker--gate-beast", name).description).toMatch(
				/your aspect/i,
			);
		}
		expect(
			entry("berserker--gate-beast", "Aetheric Commune").description,
		).not.toMatch(/Commune with Nature/);
	});

	it("scales and saves every Rift Storm aura effect", () => {
		expect(optionNames("berserker--rift-storm", 3)).toEqual([
			"Inferno",
			"Tempest",
			"Glacial",
		]);
		const vent = entry("berserker--rift-storm", "Aetheric Vent").description;
		expect(vent).toMatch(/3 at 5th level, 4 at 10th, 5 at 15th, and 6 at 20th/);
		expect(vent).toMatch(/AGI saving throw against your Job save DC/);
		const discharge = entry(
			"berserker--rift-storm",
			"Volatile Discharge",
		).description;
		expect(discharge).toMatch(/half your Berserker level \(rounded down\)/);
		expect(discharge).toMatch(
			/speed reduced to 0 until the start of your next turn/,
		);
		expect(
			entry("berserker--rift-storm", "Storm Detonation").description,
		).toMatch(/each creature of your choice within 30 feet.*Job save DC/s);
	});

	it("authors the full d8 Anomaly Surge chart and its controls", () => {
		const surge = entry(
			"berserker--aetheric-anomaly",
			"Anomaly Surge",
		).description;
		for (let roll = 1; roll <= 8; roll += 1) {
			expect(surge).toContain(`${roll}, `);
		}
		expect(surge).toMatch(/Job save DC/);
		expect(
			entry("berserker--aetheric-anomaly", "Controlled Distortion").description,
		).toMatch(/roll twice and choose.*same number.*any effect/s);
	});

	it("defines the Weave Infiltrator's Harmonic Hand and casting package", () => {
		const intrusion = entry("assassin--weave-infiltrator", "Weave Intrusion");
		expect(intrusion.description).toMatch(/Harmonic Hand: as an action/);
		expect(intrusion.description).toMatch(/enchantment or illusion/);
		const source = {
			features: path("assassin--weave-infiltrator").features,
			...getPathChoiceLedger(path("assassin--weave-infiltrator")),
		};
		expect(calculateTotalChoices({}, source, [], 3)).toMatchObject({
			cantrips: 2,
			spells: 3,
		});
	});

	it("states how every Path changes Vulnerability Analysis", () => {
		expect(
			entry("assassin--weave-infiltrator", "Shadow Casting").description,
		).toMatch(
			/once-per-turn limit and the advantage or adjacent-ally condition still apply/,
		);
		expect(
			entry("assassin--shadow-herald", "Coordinated Exploit").description,
		).toMatch(/doesn't use your own Vulnerability Analysis/);
		expect(
			entry("assassin--blade-dancer", "Mandated Audacity").description,
		).toMatch(/no other creature is within 5 feet of you/);
		expect(
			entry("assassin--vanguard-outrider", "Recursive Phase Strike")
				.description,
		).toMatch(/not against a creature you've already dealt/);
		expect(entry("assassin--gate-runner", "Phase Grab")).toMatchObject({
			uses: { formula: "PB", recharge: "long-rest" },
			tracking: "uses",
		});
	});

	it("uses only Striker vocabulary and gives every signature an action", () => {
		const legacy =
			/Rapid Barrage|Aetheric Pulse|spirit point|Spirit Combat|Minor Illusion|Sanctuary|wizard/i;
		for (const id of STRIKER_PATHS) {
			const owner = path(id);
			for (const item of [...owner.features, ...owner.abilities]) {
				expect(item.description, `${id} / ${item.name}`).not.toMatch(legacy);
			}
			for (const signature of owner.abilities) {
				expect(signature.actionType, `${id} / ${signature.name}`).toBeTruthy();
			}
		}
		expect(optionNames("striker--aetheric-channeler", 3)).toHaveLength(5);
		expect(optionNames("striker--aetheric-channeler", 17)).toHaveLength(11);
	});

	it("drops level-up cantrip picks that had no learnable cantrips", () => {
		for (const [pathId, level] of [
			["striker--aetheric-channeler", 6],
			["berserker--mana-scars", 10],
		] as const) {
			const source = {
				features: path(pathId).features,
				...getPathChoiceLedger(path(pathId)),
			};
			expect(calculateTotalChoices({}, source, [], level).cantrips).toBe(0);
		}
	});
});

describe("Gate Beast legacy aspect rows", () => {
	let restoreLocalStorage: (() => void) | undefined;

	beforeEach(() => {
		restoreLocalStorage = installIsolatedLocalStorage();
	});

	afterEach(() => {
		restoreLocalStorage?.();
	});

	it("adopts a stored Bonded Aspect row as Primal Aspect", async () => {
		const character = createLocalCharacter({
			name: "Beast",
			job: "Berserker",
			level: 3,
			path: "Path of the Gate Beast",
			path_id: "berserker--gate-beast",
		});
		addLocalFeature(character.id, {
			name: "Bonded Aspect",
			source: "Path Feature: Path of the Gate Beast",
			level_acquired: 3,
			description: "Legacy row.",
			is_active: true,
		});
		const berserker = jobs.find((job) => job.id === "berserker");
		if (!berserker) throw new Error("Missing berserker");
		await addJobAwakeningBenefitsForLevel(character.id, berserker, 3);
		const rows = listLocalFeatures(character.id);
		expect(rows.filter((row) => row.name === "Bonded Aspect")).toHaveLength(0);
		expect(rows.filter((row) => row.name === "Primal Aspect")).toHaveLength(1);
	});
});
