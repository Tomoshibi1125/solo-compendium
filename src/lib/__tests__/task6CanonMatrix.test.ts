import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { paths } from "@/data/compendium/paths";
import {
	getJobAwakeningFeatureModifiers,
	getPathFeatureModifiers,
} from "@/lib/characterCreation";

interface PathExpectation {
	jobId: "revenant" | "stalker" | "technomancer";
	name: string;
	aliases?: string[];
	level: number;
	skills: string[];
	featureLevels: number[];
	abilityName: string;
	actionType: string;
	recharge: "short-rest" | "long-rest";
}

const PATH_MATRIX: Record<string, PathExpectation> = {
	"revenant--void-lord": {
		jobId: "revenant",
		name: "Path of the Void Eater",
		aliases: ["Path of the Void Lord"],
		level: 2,
		skills: ["Mana Flow", "Medicine"],
		featureLevels: [2, 2, 6, 10, 14],
		abilityName: "Devour the Remnant",
		actionType: "Action",
		recharge: "long-rest",
	},
	"revenant--entropy-drinker": {
		jobId: "revenant",
		name: "Path of the Black Blood",
		aliases: ["Path of the Entropy Drinker"],
		level: 2,
		skills: ["Mana Flow", "Persuasion"],
		featureLevels: [2, 2, 6, 10, 14],
		abilityName: "Hemorrhage",
		actionType: "Action",
		recharge: "long-rest",
	},
	"revenant--wither-guard": {
		jobId: "revenant",
		name: "Path of the Hollow King",
		aliases: ["Path of the Wither Guard"],
		level: 2,
		skills: ["Mana Flow", "Athletics"],
		featureLevels: [2, 2, 6, 10, 14],
		abilityName: "Entropy Carapace",
		actionType: "Bonus action",
		recharge: "long-rest",
	},
	"revenant--entropy-blade": {
		jobId: "revenant",
		name: "Path of the Grave Shepherd",
		aliases: ["Path of the Entropy Blade"],
		level: 2,
		skills: ["Mana Flow", "Cosmic Lore"],
		featureLevels: [2, 2, 6, 10, 14],
		abilityName: "Reaping Decree",
		actionType: "Action",
		recharge: "long-rest",
	},
	"revenant--plague-weaver": {
		jobId: "revenant",
		name: "Path of the Dread Veil",
		aliases: ["Path of the Plague Weaver"],
		level: 2,
		skills: ["Mana Flow", "Intimidation"],
		featureLevels: [2, 2, 6, 10, 14],
		abilityName: "Maw of the Void",
		actionType: "Action",
		recharge: "long-rest",
	},
	"revenant--threshold-walker": {
		jobId: "revenant",
		name: "Path of the Threshold Walker",
		level: 2,
		skills: ["Mana Flow", "Insight"],
		featureLevels: [2, 2, 6, 10, 14],
		abilityName: "Threshold Pulse",
		actionType: "Action",
		recharge: "long-rest",
	},
	"stalker--apex-hunter": {
		jobId: "stalker",
		name: "Path of the Apex Ascendant",
		aliases: ["Path of the Apex Hunter"],
		level: 3,
		skills: ["Survival", "Perception"],
		featureLevels: [3, 7, 11, 15],
		abilityName: "Prey Manifest",
		actionType: "Bonus action",
		recharge: "short-rest",
	},
	"stalker--pack-leader": {
		jobId: "stalker",
		name: "Path of the Pack Leader",
		level: 3,
		skills: ["Beast Taming", "Rift Topology"],
		featureLevels: [3, 7, 11, 15],
		abilityName: "Coordinated Strike",
		actionType: "Action",
		recharge: "short-rest",
	},
	"stalker--umbral-hunter": {
		jobId: "stalker",
		name: "Path of the Umbral Ascendant",
		aliases: ["Path of the Umbral Hunter"],
		level: 3,
		skills: ["Stealth", "Perception"],
		featureLevels: [3, 3, 7, 11, 15],
		abilityName: "Shadow Strike",
		actionType: "Bonus action",
		recharge: "short-rest",
	},
	"stalker--rift-strider": {
		jobId: "stalker",
		name: "Path of the Rift Strider",
		level: 3,
		skills: ["Mana Flow", "Survival"],
		featureLevels: [3, 3, 7, 11, 15],
		abilityName: "Planar Collapse",
		actionType: "Action",
		recharge: "long-rest",
	},
	"stalker--apex-slayer": {
		jobId: "stalker",
		name: "Path of the Apex Slayer",
		level: 3,
		skills: ["Investigation", "Survival"],
		featureLevels: [3, 3, 7, 11, 15],
		abilityName: "Exploit Vulnerability",
		actionType: "Free",
		recharge: "long-rest",
	},
	"stalker--hive-synchronist": {
		jobId: "stalker",
		name: "Path of the Hive Synchronist",
		level: 3,
		skills: ["Rift Topology", "Survival"],
		featureLevels: [3, 3, 7, 11, 15],
		abilityName: "Hive Eruption",
		actionType: "Action",
		recharge: "short-rest",
	},
	"technomancer--aether-chemist-design": {
		jobId: "technomancer",
		name: "Design: The Aether Chemist",
		level: 3,
		skills: ["Mana Flow", "Medicine"],
		featureLevels: [3, 3, 3, 5, 9, 15],
		abilityName: "Volatile Burst",
		actionType: "Action",
		recharge: "long-rest",
	},
	"technomancer--aether-vessel-design": {
		jobId: "technomancer",
		name: "Design: The Aether Vessel",
		level: 3,
		skills: ["Mana Flow", "Athletics"],
		featureLevels: [3, 3, 3, 5, 9, 15],
		abilityName: "Pulse Overdrive",
		actionType: "Bonus action",
		recharge: "long-rest",
	},
	"technomancer--resonance-siege-design": {
		jobId: "technomancer",
		name: "Design: Resonance Siege",
		level: 3,
		skills: ["Mana Flow"],
		featureLevels: [3, 3, 3, 5, 9, 15],
		abilityName: "Absolute Salvo",
		actionType: "Bonus action",
		recharge: "short-rest",
	},
	"technomancer--synchronist-binary-design": {
		jobId: "technomancer",
		name: "Design: Synchronist Binary",
		level: 3,
		skills: ["Mana Flow", "Athletics"],
		featureLevels: [3, 3, 3, 5, 9, 15],
		abilityName: "Absolute Overdrive",
		actionType: "Bonus action",
		recharge: "long-rest",
	},
	"technomancer--swarm-conduit-design": {
		jobId: "technomancer",
		name: "Design: Swarm Conduit",
		level: 3,
		skills: ["Mana Flow", "Investigation"],
		featureLevels: [3, 3, 5, 9, 15],
		abilityName: "Absolute Convergence",
		actionType: "Action",
		recharge: "short-rest",
	},
	"technomancer--aether-breacher-design": {
		jobId: "technomancer",
		name: "Design: Aether Breacher",
		level: 3,
		skills: ["Mana Flow", "Investigation"],
		featureLevels: [3, 3, 5, 9, 15],
		abilityName: "Absolute Lockdown",
		actionType: "Action",
		recharge: "long-rest",
	},
};

describe("Task 6 canonical job/path matrix", () => {
	it("locks all 18 stable path identities, requirements, progression, aliases, and local signatures", () => {
		expect(Object.keys(PATH_MATRIX)).toHaveLength(18);
		for (const [id, expected] of Object.entries(PATH_MATRIX)) {
			const path = paths.find((entry) => entry.id === id);
			expect(path, id).toBeDefined();
			if (!path) continue;
			expect(path.jobId).toBe(expected.jobId);
			expect(path.name).toBe(expected.name);
			expect(path.aliases ?? []).toEqual(expected.aliases ?? []);
			expect(path.requirements).toMatchObject({
				level: expected.level,
				skills: expected.skills,
			});
			expect(path.features.map((feature) => feature.level)).toEqual(
				expected.featureLevels,
			);
			expect(path.abilities).toHaveLength(1);
			expect(path.abilities[0]).toMatchObject({
				name: expected.abilityName,
				level: expected.level,
				actionType: expected.actionType,
				uses: { formula: "1", recharge: expected.recharge },
				tracking: "uses",
			});
		}
	});

	it("locks source-explicit Task 6 job actions, uses, and resource costs", () => {
		const classFeature = (jobId: string, name: string) =>
			jobs
				.find((job) => job.id === jobId)
				?.classFeatures?.find((feature) => feature.name === name);
		const awakeningFeature = (jobId: string, name: string) =>
			jobs
				.find((job) => job.id === jobId)
				?.awakeningFeatures?.find((feature) => feature.name === name);

		expect(classFeature("revenant", "Mortal Harvest")).toMatchObject({
			actionType: "Free",
			resource: "1+ Remnants",
			tracking: "resource",
		});
		expect(classFeature("revenant", "Entropic Bulwark")).toMatchObject({
			actionType: "Reaction",
			resource: "1 Remnant",
			tracking: "resource",
		});
		expect(classFeature("revenant", "Aetheric Realignment")).toMatchObject({
			resource: "1 Remnant",
			tracking: "resource",
		});
		expect(classFeature("revenant", "Borrowed Breath")).toMatchObject({
			actionType: "Triggered",
			uses: { formula: "1", recharge: "long-rest" },
			resource: "2 Remnants",
			tracking: "uses",
		});
		expect(classFeature("revenant", "Zenith Mandate")).toMatchObject({
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		});
		expect(classFeature("stalker", "Prey Lock")).toMatchObject({
			actionType: "Bonus action",
			tracking: "manual",
		});
		expect(awakeningFeature("stalker", "Pursuit Burst")).toMatchObject({
			actionType: "Bonus action",
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		});
		expect(classFeature("technomancer", "Absolute Assist")).toMatchObject({
			actionType: "Reaction",
			uses: { formula: "INT mod", recharge: "long-rest" },
			tracking: "uses",
		});
		expect(classFeature("technomancer", "Spell Capacitor")).toMatchObject({
			uses: { formula: "2 * INT mod", recharge: "long-rest" },
			tracking: "uses",
		});
	});

	it("maps only source-backed Task 6 deterministic modifiers", () => {
		expect(
			getJobAwakeningFeatureModifiers("Technomancer", "Mandate Vision", 1),
		).toEqual([
			{
				type: "expertise",
				value: 0,
				target: "skill:INT_magic_items",
				source: "Mandate Vision",
			},
		]);
		expect(
			getJobAwakeningFeatureModifiers(
				"Technomancer",
				"Infusion Optimization",
				6,
			)[0]?.value,
		).toBe(3);
		expect(
			getJobAwakeningFeatureModifiers(
				"Technomancer",
				"Infusion Optimization",
				14,
			)[0]?.value,
		).toBe(6);
		expect(
			getJobAwakeningFeatureModifiers("Technomancer", "Blueprint Vision", 1),
		).toEqual([]);
		expect(
			getPathFeatureModifiers(
				"Stalker",
				"Path of the Umbral Ascendant",
				"Void-Minded",
				7,
			),
		).toEqual([
			{
				type: "proficiency",
				value: 0,
				target: "save:SENSE",
				source: "Void-Minded",
			},
		]);
		expect(
			getPathFeatureModifiers(
				"Technomancer",
				"Design: The Aether Vessel",
				"Absolute Multi-strike",
				4,
			),
		).toEqual([]);
		for (const pathName of [
			"Design: The Aether Vessel",
			"Design: Synchronist Binary",
		]) {
			expect(
				getPathFeatureModifiers(
					"Technomancer",
					pathName,
					"Absolute Multi-strike",
					5,
				),
			).toEqual([
				{
					type: "extra_attack",
					value: 1,
					target: "attack_action",
					source: "Absolute Multi-strike",
				},
			]);
		}
	});
});
