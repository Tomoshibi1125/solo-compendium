import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import {
	addJobAwakeningBenefitsForLevel,
	addLevel1Features,
} from "@/lib/characterCreation";
import {
	createLocalCharacter,
	listLocalFeatures,
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

const resourceModifier = (
	row: ReturnType<typeof feature>,
	target: "resource_cost" | "uses_formula",
) =>
	(Array.isArray(row?.modifiers) ? row.modifiers : []).find(
		(modifier) =>
			modifier !== null &&
			typeof modifier === "object" &&
			!Array.isArray(modifier) &&
			modifier.type === "resource" &&
			modifier.target === target,
	);

describe("Task 6 canonical feature resources", () => {
	let restoreLocalStorage: (() => void) | undefined;

	beforeEach(() => {
		restoreLocalStorage = installIsolatedLocalStorage();
	});

	afterEach(() => {
		restoreLocalStorage?.();
	});

	it("seeds level-1 action/manual metadata without creating phantom charges", async () => {
		const row = createLocalCharacter({
			name: "Prey",
			job: "Stalker",
			level: 1,
		});
		await addLevel1Features(row.id, job("stalker"));
		const preyLock = feature(row.id, "Prey Lock");
		expect(preyLock).toMatchObject({
			feature_id: "job-feature:stalker:prey-lock",
			action_type: "Bonus action",
			uses_max: null,
			uses_current: null,
			recharge: null,
		});
		expect(resourceModifier(preyLock, "uses_formula")).toBeUndefined();
	});

	it("persists Revenant actions and Remnant costs while preserving spent uses", async () => {
		const row = createLocalCharacter({
			name: "Reaper",
			job: "Revenant",
			level: 11,
			int: 18,
		});
		await addJobAwakeningBenefitsForLevel(row.id, job("revenant"), 11);

		const harvest = feature(row.id, "Mortal Harvest");
		expect(harvest).toMatchObject({
			action_type: "Free",
			uses_max: null,
			uses_current: null,
			recharge: null,
		});
		expect(resourceModifier(harvest, "resource_cost")).toMatchObject({
			value: "1+ Remnants",
		});

		const borrowedBreath = feature(row.id, "Borrowed Breath");
		expect(borrowedBreath).toMatchObject({
			action_type: "Triggered",
			uses_max: 1,
			uses_current: 1,
			recharge: "long-rest",
		});
		expect(resourceModifier(borrowedBreath, "resource_cost")).toMatchObject({
			value: "2 Remnants",
		});
		if (!borrowedBreath) throw new Error("Borrowed Breath was not seeded");
		updateLocalFeature(borrowedBreath.id, { uses_current: 0 });

		await addJobAwakeningBenefitsForLevel(row.id, job("revenant"), 11);
		expect(
			listLocalFeatures(row.id).filter(
				(entry) => entry.name === "Borrowed Breath",
			),
		).toHaveLength(1);
		expect(feature(row.id, "Borrowed Breath")?.uses_current).toBe(0);
	});

	it("resolves Stalker and Technomancer formulas without refilling", async () => {
		const stalker = createLocalCharacter({
			name: "Pursuit",
			job: "Stalker",
			level: 6,
		});
		await addJobAwakeningBenefitsForLevel(stalker.id, job("stalker"), 6);
		const pursuit = feature(stalker.id, "Pursuit Burst");
		expect(pursuit).toMatchObject({
			action_type: "Bonus action",
			uses_max: 1,
			uses_current: 1,
			recharge: "short-rest",
		});

		const technomancer = createLocalCharacter({
			name: "Architect",
			job: "Technomancer",
			level: 11,
			int: 18,
		});
		await addJobAwakeningBenefitsForLevel(
			technomancer.id,
			job("technomancer"),
			11,
		);
		const assist = feature(technomancer.id, "Absolute Assist");
		const capacitor = feature(technomancer.id, "Spell Capacitor");
		expect(assist).toMatchObject({
			action_type: "Reaction",
			uses_max: 4,
			uses_current: 4,
			recharge: "long-rest",
		});
		expect(capacitor).toMatchObject({
			uses_max: 8,
			uses_current: 8,
			recharge: "long-rest",
		});
		if (!capacitor) throw new Error("Spell Capacitor was not seeded");
		updateLocalFeature(capacitor.id, { uses_current: 2 });
		await addJobAwakeningBenefitsForLevel(
			technomancer.id,
			job("technomancer"),
			11,
		);
		expect(feature(technomancer.id, "Spell Capacitor")?.uses_current).toBe(2);
	});

	it("persists all 18 path signatures idempotently as path-local feature rows", async () => {
		// biome-ignore format: Compact tuples keep the complete signature matrix auditable.
		const signatures = [
			["revenant", "revenant--void-lord", "Path of the Void Eater", 2, "Devour the Remnant", "Action", "long-rest"],
			["revenant", "revenant--entropy-drinker", "Path of the Black Blood", 2, "Hemorrhage", "Action", "long-rest"],
			["revenant", "revenant--wither-guard", "Path of the Hollow King", 2, "Entropy Carapace", "Bonus action", "long-rest"],
			["revenant", "revenant--entropy-blade", "Path of the Grave Shepherd", 2, "Reaping Decree", "Action", "long-rest"],
			["revenant", "revenant--plague-weaver", "Path of the Dread Veil", 2, "Maw of the Void", "Action", "long-rest"],
			["revenant", "revenant--threshold-walker", "Path of the Threshold Walker", 2, "Threshold Pulse", "Action", "long-rest"],
			["stalker", "stalker--apex-hunter", "Path of the Apex Ascendant", 3, "Prey Manifest", "Bonus action", "short-rest"],
			["stalker", "stalker--pack-leader", "Path of the Pack Leader", 3, "Coordinated Strike", "Action", "short-rest"],
			["stalker", "stalker--umbral-hunter", "Path of the Umbral Ascendant", 3, "Shadow Strike", "Bonus action", "short-rest"],
			["stalker", "stalker--rift-strider", "Path of the Rift Strider", 3, "Planar Collapse", "Action", "long-rest"],
			["stalker", "stalker--apex-slayer", "Path of the Apex Slayer", 3, "Exploit Vulnerability", "Free", "long-rest"],
			["stalker", "stalker--hive-synchronist", "Path of the Hive Synchronist", 3, "Hive Eruption", "Action", "short-rest"],
			["technomancer", "technomancer--aether-chemist-design", "Design: The Aether Chemist", 3, "Volatile Burst", "Action", "long-rest"],
			["technomancer", "technomancer--aether-vessel-design", "Design: The Aether Vessel", 3, "Pulse Overdrive", "Bonus action", "long-rest"],
			["technomancer", "technomancer--resonance-siege-design", "Design: Resonance Siege", 3, "Absolute Salvo", "Bonus action", "short-rest"],
			["technomancer", "technomancer--synchronist-binary-design", "Design: Synchronist Binary", 3, "Absolute Overdrive", "Bonus action", "long-rest"],
			["technomancer", "technomancer--swarm-conduit-design", "Design: Swarm Conduit", 3, "Absolute Convergence", "Action", "short-rest"],
			["technomancer", "technomancer--aether-breacher-design", "Design: Aether Breacher", 3, "Absolute Lockdown", "Action", "long-rest"],
		] as const;

		for (const [
			jobId,
			pathId,
			pathName,
			level,
			abilityName,
			actionType,
			recharge,
		] of signatures) {
			const jobData = job(jobId);
			const row = createLocalCharacter({
				name: pathId,
				job: jobData.name,
				level,
				path: pathName,
				path_id: pathId,
			});
			await addJobAwakeningBenefitsForLevel(row.id, jobData, level);
			const signature = feature(row.id, abilityName);
			const normalizedOwner = pathId.replace(/[^a-z0-9]+/g, "-");
			const normalizedAbility = abilityName
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
			expect(signature, pathId).toMatchObject({
				feature_id: `path-ability:${normalizedOwner}:${normalizedAbility}`,
				source: `Path Ability: ${pathName}`,
				level_acquired: level,
				action_type: actionType,
				uses_max: 1,
				uses_current: 1,
				recharge,
			});
			if (!signature) throw new Error(`Missing ${pathId} signature`);
			updateLocalFeature(signature.id, { uses_current: 0 });
			await addJobAwakeningBenefitsForLevel(row.id, jobData, level);
			expect(
				listLocalFeatures(row.id).filter((entry) => entry.name === abilityName),
			).toHaveLength(1);
			expect(feature(row.id, abilityName)?.uses_current).toBe(0);
		}
	});
});
