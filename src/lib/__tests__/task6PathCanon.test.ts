import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { type Path, paths } from "@/data/compendium/paths";
import { addJobAwakeningBenefitsForLevel } from "@/lib/characterCreation";
import { calculateFeatureUses } from "@/lib/characterEngine";
import {
	createLocalCharacter,
	listLocalFeatures,
	listLocalSpells,
} from "@/lib/guestStore";
import { rejectedReconciledPathAbilityGrantCandidates } from "@/lib/pathAbilityAccess";
import { getPathOptionGroups } from "@/lib/pathLedger";

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

const TECHNOMANCER_MANDATES = [
	["technomancer--aether-chemist-design", "Architect's Mandates"],
	["technomancer--aether-vessel-design", "Vessel Mandates"],
	["technomancer--resonance-siege-design", "Siege Mandates"],
	["technomancer--synchronist-binary-design", "Synchronist Mandates"],
] as const;

describe("Task 6 Path canon", () => {
	let restoreLocalStorage: (() => void) | undefined;

	beforeEach(() => {
		restoreLocalStorage = installIsolatedLocalStorage();
	});

	afterEach(() => {
		restoreLocalStorage?.();
	});

	it("keeps no inferred Revenant, Stalker, or Technomancer grant candidates", () => {
		expect(
			rejectedReconciledPathAbilityGrantCandidates.filter((grant) =>
				["Revenant", "Stalker", "Technomancer"].includes(grant.jobName),
			),
		).toEqual([]);
	});

	it("gives every created creature a stat block and a lifecycle", () => {
		const creatures = [
			[
				"revenant--entropy-blade",
				"Command the Risen",
				/Risen Thrall: Medium undead/,
			],
			["technomancer--resonance-siege-design", "Aetheric Resonator", /AC 18/],
			[
				"technomancer--synchronist-binary-design",
				"Absolute Defender",
				/Force-Empowered Rend/,
			],
			[
				"technomancer--swarm-conduit-design",
				"Absolute Swarm",
				/Conduit Swarm: Tiny construct/,
			],
		] as const;
		for (const [pathId, name, statBlock] of creatures) {
			const text = feature(pathId, name).description;
			expect(text, name).toMatch(statBlock);
			expect(text, name).toMatch(/custom companion on your sheet/);
			expect(text, name).toMatch(/no Hit Dice/);
			expect(text, name).toMatch(
				/acts on your initiative|takes its type's action/,
			);
		}
	});

	it("makes the Pack Leader's companion one of the character's Anomaly companions", () => {
		const text = feature(
			"stalker--pack-leader",
			"Absolute Companion",
		).description;
		expect(text).toMatch(/one of your Anomaly companions/);
		expect(text).toMatch(
			/keeps its own species stat block, scaled to your level/,
		);
		expect(text).toMatch(/expend a spell slot of 1st level or higher/);
		expect(text).not.toMatch(/Predator of the Land/);
		expect(path("stalker--pack-leader").levelChoices).toBeUndefined();
	});

	it("records each Apex Ascendant pick as a Path choice", () => {
		const groups = getPathOptionGroups(path("stalker--apex-hunter"), 15, []);
		expect(
			groups.map((group) => [
				group.source,
				group.options.map((entry) => entry.name),
			]),
		).toEqual([
			[
				"Ascendant's Resonance",
				["Giant Slayer", "Horde Breaker", "Absolute Will"],
			],
			["Evasive Resilience", ["Multi-target Defense", "Aetheric Escape"]],
			["Absolute Multi-strike", ["Volley", "Whirlwind"]],
			["Apex Defense", ["Evasion", "Redirect", "Uncanny Reflexes"]],
		]);
	});

	it("scales infusion and resonator uses by Technomancer level", () => {
		const infusion = feature(
			"technomancer--aether-chemist-design",
			"Aetheric Infusion",
		);
		const resonator = feature(
			"technomancer--resonance-siege-design",
			"Aetheric Resonator",
		);
		const uses = (formula: string | undefined, level: number) =>
			calculateFeatureUses(formula ?? null, level, 2, {});
		expect(
			[3, 8, 9, 14, 15, 20].map((level) => uses(infusion.uses?.formula, level)),
		).toEqual([1, 1, 2, 2, 3, 3]);
		expect(resonator.actionType).toBe("Action");
		expect(
			[3, 14, 15].map((level) => uses(resonator.uses?.formula, level)),
		).toEqual([1, 1, 2]);
	});

	it("grants Technomancer and Hive spells by name and level", () => {
		for (const [pathId, name] of TECHNOMANCER_MANDATES) {
			const grants = feature(pathId, name).grants?.spells ?? [];
			expect(grants, name).toHaveLength(10);
			expect([...new Set(grants.map((grant) => grant.level))], name).toEqual([
				3, 5, 9, 13, 17,
			]);
		}
		expect(
			feature(
				"stalker--hive-synchronist",
				"Hive Manifestations",
			).grants?.spells.map((grant) => grant.level),
		).toEqual([3, 5, 9, 13, 17]);
	});

	it("seeds resonator uses and mandate spells on the sheet", async () => {
		const siege = path("technomancer--resonance-siege-design");
		const technomancer = jobs.find((entry) => entry.id === "technomancer");
		if (!technomancer) throw new Error("Missing technomancer");
		const character = createLocalCharacter({
			name: "Siege",
			job: "Technomancer",
			level: 5,
			path: siege.name,
			path_id: siege.id,
			int: 16,
		});
		await addJobAwakeningBenefitsForLevel(character.id, technomancer, 5);
		expect(
			listLocalFeatures(character.id).find(
				(row) => row.name === "Aetheric Resonator",
			),
		).toMatchObject({
			uses_max: 1,
			recharge: "long-rest",
			action_type: "Action",
		});
		expect(
			listLocalSpells(character.id)
				.filter((spell) => spell.source === `Path Spell: ${siege.name}`)
				.map((spell) => spell.name)
				.sort(),
		).toEqual([
			"Mana Pulse Grenade",
			"Mana Tripwire Network",
			"Shield Lattice",
			"Triple Ignition",
		]);
	});

	it("states a save DC wherever a Task 6 feature forces a save", () => {
		// Another creature's save ("it makes", "must succeed on"), not yours.
		const forcesSave =
			/(makes|must (?:succeed on|make)|attempt) an? (STR|AGI|VIT|INT|SENSE|PRE) saving throw/;
		for (const owner of paths.filter((entry) =>
			["revenant", "stalker", "technomancer"].includes(entry.jobId),
		)) {
			for (const item of [...owner.features, ...owner.abilities]) {
				if (!forcesSave.test(item.description)) continue;
				expect(item.description, `${owner.id} / ${item.name}`).toMatch(
					/Job save DC|spell save DC/,
				);
			}
		}
	});
});
