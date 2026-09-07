import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { addJobAwakeningBenefitsForLevel } from "@/lib/characterCreation";
import {
	createLocalCharacter,
	listLocalFeatures,
	updateLocalCharacter,
	updateLocalFeature,
} from "@/lib/guestStore";

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

const job = (id: string) => {
	const match = jobs.find((entry) => entry.id === id);
	if (!match) throw new Error(`Missing job ${id}`);
	return match;
};

const feature = (characterId: string, name: string) =>
	listLocalFeatures(characterId).find((entry) => entry.name === name);

describe("Task 5 canonical feature resources", () => {
	let restoreLocalStorage: (() => void) | undefined;

	beforeEach(() => {
		restoreLocalStorage = installIsolatedLocalStorage();
	});

	afterEach(() => {
		restoreLocalStorage?.();
	});

	it("seeds Flux at level 2 with level-scaled short-rest uses without refilling", async () => {
		const row = createLocalCharacter({ name: "Flux", job: "Esper", level: 2 });
		await addJobAwakeningBenefitsForLevel(row.id, job("esper"), 2);

		const flux = feature(row.id, "Flux Pool");
		expect(flux).toMatchObject({
			uses_max: 2,
			uses_current: 2,
			recharge: "short-rest",
		});
		if (!flux) throw new Error("Flux Pool was not seeded");
		updateLocalFeature(flux.id, { uses_current: 1 });

		updateLocalCharacter(row.id, { level: 4 });
		await addJobAwakeningBenefitsForLevel(row.id, job("esper"), 4);
		expect(feature(row.id, "Flux Pool")).toMatchObject({
			uses_max: 4,
			uses_current: 1,
			recharge: "short-rest",
		});
	});

	it("changes Hype from long-rest to short-rest at level 5", async () => {
		const row = createLocalCharacter({
			name: "Hype",
			job: "Idol",
			level: 1,
			pre: 16,
		});
		await addJobAwakeningBenefitsForLevel(row.id, job("idol"), 1);
		const hype = feature(row.id, "Hype");
		expect(hype).toMatchObject({
			uses_max: 3,
			uses_current: 3,
			recharge: "long-rest",
		});
		if (!hype) throw new Error("Hype was not seeded");
		updateLocalFeature(hype.id, { uses_current: 1 });

		updateLocalCharacter(row.id, { level: 5 });
		await addJobAwakeningBenefitsForLevel(row.id, job("idol"), 5);
		expect(feature(row.id, "Hype")).toMatchObject({
			uses_max: 3,
			uses_current: 1,
			recharge: "short-rest",
		});
	});

	it("gates and scales Summoner feature resources at levels 2, 8, 14, and 20", async () => {
		const row = createLocalCharacter({
			name: "Shift",
			job: "Summoner",
			level: 1,
		});
		await addJobAwakeningBenefitsForLevel(row.id, job("summoner"), 1);
		expect(feature(row.id, "Entity Shift")).toBeUndefined();
		expect(feature(row.id, "Biome Command")).toBeUndefined();

		updateLocalCharacter(row.id, { level: 2 });
		await addJobAwakeningBenefitsForLevel(row.id, job("summoner"), 2);
		expect(feature(row.id, "Entity Shift")).toMatchObject({
			uses_max: 2,
			recharge: "short-rest",
		});
		expect(feature(row.id, "Biome Command")).toBeUndefined();

		updateLocalCharacter(row.id, { level: 8 });
		await addJobAwakeningBenefitsForLevel(row.id, job("summoner"), 8);
		const biome = feature(row.id, "Biome Command");
		expect(biome).toMatchObject({ uses_max: 1, recharge: "long-rest" });
		if (!biome) throw new Error("Biome Command was not seeded");
		updateLocalFeature(biome.id, { uses_current: 0 });

		updateLocalCharacter(row.id, { level: 14 });
		await addJobAwakeningBenefitsForLevel(row.id, job("summoner"), 14);
		expect(feature(row.id, "Biome Command")).toMatchObject({
			uses_max: 2,
			uses_current: 0,
			recharge: "long-rest",
		});

		updateLocalCharacter(row.id, { level: 20 });
		await addJobAwakeningBenefitsForLevel(row.id, job("summoner"), 20);
		expect(feature(row.id, "Entity Shift")).toMatchObject({
			uses_max: null,
			uses_current: null,
			recharge: null,
		});
		expect(feature(row.id, "Biome Command")).toMatchObject({
			uses_max: null,
			uses_current: null,
			recharge: null,
		});
	});

	it("persists path-local abilities as idempotent feature state, not catalog grants", async () => {
		const row = createLocalCharacter({
			name: "Apex",
			job: "Summoner",
			level: 2,
			path: "Path of the Apex Shifter",
			path_id: "summoner--apex-shifter",
		});
		await addJobAwakeningBenefitsForLevel(row.id, job("summoner"), 2);
		const ability = feature(row.id, "Apex Manifestation");
		expect(ability).toMatchObject({
			feature_id: "path-ability:summoner-apex-shifter:apex-manifestation",
			source: "Path Ability: Path of the Apex Shifter",
			level_acquired: 2,
			action_type: "Bonus action",
			uses_max: 1,
			uses_current: 1,
			recharge: "long-rest",
		});
		if (!ability) throw new Error("Apex Manifestation was not seeded");
		updateLocalFeature(ability.id, { uses_current: 0 });
		await addJobAwakeningBenefitsForLevel(row.id, job("summoner"), 2);
		expect(
			listLocalFeatures(row.id).filter(
				(entry) => entry.name === "Apex Manifestation",
			),
		).toHaveLength(1);
		expect(feature(row.id, "Apex Manifestation")?.uses_current).toBe(0);
	});
});
