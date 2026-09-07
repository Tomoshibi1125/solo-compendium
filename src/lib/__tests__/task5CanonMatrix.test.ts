import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { paths } from "@/data/compendium/paths";

const PATH_MATRIX = {
	"esper--draconic-lineage": [
		"esper",
		"Path of the Aetheric Dragon",
		1,
		["Mana Flow"],
		[1, 1, 6, 14, 18],
		"Dragon Breath",
		undefined,
		undefined,
		"3 Flux",
	],
	"esper--aetheric-cascade": [
		"esper",
		"Path of the Aetheric Cascade",
		1,
		["Mana Flow"],
		[1, 1, 6, 14, 18],
		"Cascade Bolt",
		undefined,
		undefined,
		"1st-level spell slot",
	],
	"esper--shadow-magic": [
		"esper",
		"Path of the Void Resonance",
		1,
		["Stealth", "Mana Flow"],
		[1, 1, 6, 14, 18],
		"Void Lance",
		undefined,
		undefined,
		"2 Flux",
	],
	"esper--storm-sorcery": [
		"esper",
		"Path of the Tempest Core",
		1,
		["Mana Flow", "Rift Topology"],
		[1, 1, 6, 6, 14, 18],
		"Thunder Rift",
		undefined,
		undefined,
		"3rd-level spell slot",
	],
	"esper--absolute-spark": [
		"esper",
		"Path of the Absolute Spark",
		1,
		["Mana Flow", "Cosmic Lore"],
		[1, 1, 6, 14, 18],
		"Absolute Healing Surge",
		undefined,
		undefined,
		"2 Flux",
	],
	"esper--aberrant-mind": [
		"esper",
		"Path of the Psionic Breach",
		1,
		["Mana Flow", "Insight"],
		[1, 1, 6, 6, 14, 18],
		"Psionic Lance",
		undefined,
		undefined,
		"2nd-level spell slot or 2 Flux",
	],
	"summoner--biome-architect": [
		"summoner",
		"Path of the Biome Architect",
		2,
		["Rift Topology"],
		[2, 2, 3, 6, 10, 14],
		"Biome Surge",
		"Action",
		"long-rest",
		undefined,
	],
	"summoner--apex-shifter": [
		"summoner",
		"Path of the Apex Shifter",
		2,
		["Rift Topology", "Survival"],
		[2, 2, 6, 10, 14],
		"Apex Manifestation",
		"Bonus action",
		"long-rest",
		undefined,
	],
	"summoner--dream-weaver": [
		"summoner",
		"Path of the Dream Weaver",
		2,
		["Rift Topology", "Insight"],
		[2, 6, 10, 14],
		"Lush Blessing",
		"Action",
		"long-rest",
		undefined,
	],
	"summoner--pack-commander": [
		"summoner",
		"Path of the Pack Commander",
		2,
		["Rift Topology", "Beast Taming"],
		[2, 2, 6, 10, 14],
		"Absolute Alpha",
		"Bonus action",
		"short-rest",
		undefined,
	],
	"summoner--symbiotic-host": [
		"summoner",
		"Path of the Symbiotic Host",
		2,
		["Rift Topology", "Medicine"],
		[2, 2, 6, 10, 14],
		"Spore Eruption",
		"Action",
		"long-rest",
		undefined,
	],
	"summoner--cosmic-conduit": [
		"summoner",
		"Path of the Cosmic Conduit",
		2,
		["Mana Flow", "Rift Topology"],
		[2, 2, 6, 10, 14],
		"Starfall Manifestation",
		"Action",
		"long-rest",
		undefined,
	],
	"herald--restoration-mandate": [
		"herald",
		"Path of the Restoration Mandate",
		1,
		["Medicine"],
		[1, 1, 2, 6, 8, 17],
		"Mass Restoration",
		"Action",
		"long-rest",
		undefined,
	],
	"herald--radiance-mandate": [
		"herald",
		"Path of the Radiance Mandate",
		1,
		["Cosmic Lore"],
		[1, 1, 2, 6, 8, 17],
		"Solar Burst",
		"Action",
		"short-rest",
		undefined,
	],
	"herald--combat-mandate": [
		"herald",
		"Path of the Combat Mandate",
		1,
		["Athletics", "Cosmic Lore"],
		[1, 1, 2, 6, 8, 17],
		"Refined Weapon",
		"Bonus action",
		"long-rest",
		undefined,
	],
	"herald--knowledge-mandate": [
		"herald",
		"Path of the Knowledge Mandate",
		1,
		["Dimensional Lore", "Cosmic Lore"],
		[1, 2, 6, 8, 17],
		"Aetheric Query",
		"Action (1 minute)",
		"long-rest",
		undefined,
	],
	"herald--storm-mandate": [
		"herald",
		"Path of the Storm Mandate",
		1,
		["Rift Topology", "Cosmic Lore"],
		[1, 1, 2, 6, 8, 17],
		"Call Lightning Manifestation",
		"Action",
		"short-rest",
		undefined,
	],
	"herald--triage-mandate": [
		"herald",
		"Path of the Triage Mandate",
		1,
		["Medicine", "Cosmic Lore"],
		[1, 1, 2, 6, 8, 17],
		"Absolute Safeguard",
		"Action",
		"long-rest",
		undefined,
	],
	"idol--lore-resonance": [
		"idol",
		"Path of the Lore Resonance",
		3,
		["Dimensional Lore", "Performance"],
		[3, 3, 6, 14],
		"Words of Absolute Truth",
		"Action",
		"short-rest",
		undefined,
	],
	"idol--dance-resonance": [
		"idol",
		"Path of the Dance Resonance",
		3,
		["Acrobatics", "Performance"],
		[3, 3, 6, 14],
		"Showstopper Finale",
		"Action",
		"short-rest",
		undefined,
	],
	"idol--hypnotic-resonance": [
		"idol",
		"Path of the Hypnotic Resonance",
		3,
		["Performance", "Persuasion"],
		[3, 3, 6, 14],
		"Absolute Charm",
		"Action",
		"long-rest",
		undefined,
	],
	"idol--blade-resonance": [
		"idol",
		"Path of the Blade Resonance",
		3,
		["Acrobatics", "Performance"],
		[3, 3, 3, 6, 14],
		"Dance of a Thousand Blades",
		"Action",
		"short-rest",
		undefined,
	],
	"idol--shadow-resonance": [
		"idol",
		"Path of the Shadow Resonance",
		3,
		["Deception", "Performance"],
		[3, 3, 6, 14],
		"Psychic Overload",
		"Action",
		"long-rest",
		undefined,
	],
	"idol--genesis-resonance": [
		"idol",
		"Path of the Genesis Resonance",
		3,
		["Mana Flow", "Performance"],
		[3, 3, 6, 14],
		"Absolute Magnum Opus",
		"Action",
		"long-rest",
		undefined,
	],
} as const;

describe("Task 5 canonical job/path matrix", () => {
	it("locks all 24 stable path identities, requirements, progression, and local abilities", () => {
		expect(Object.keys(PATH_MATRIX)).toHaveLength(24);
		for (const [id, expected] of Object.entries(PATH_MATRIX)) {
			const [
				jobId,
				name,
				level,
				skills,
				featureLevels,
				abilityName,
				actionType,
				recharge,
				resource,
			] = expected;
			const path = paths.find((entry) => entry.id === id);
			expect(path, id).toBeDefined();
			if (!path) continue;
			expect(path.jobId).toBe(jobId);
			expect(path.name).toBe(name);
			expect(path.requirements).toMatchObject({ level, skills: [...skills] });
			expect(path.features.map((feature) => feature.level)).toEqual([
				...featureLevels,
			]);
			expect(path.abilities).toHaveLength(1);
			expect(path.abilities[0]).toMatchObject({
				name: abilityName,
				level,
				...(actionType ? { actionType } : {}),
				...(recharge
					? { uses: { formula: "1", recharge }, tracking: "uses" }
					: {}),
				...(resource ? { resource, tracking: "resource" } : {}),
			});
		}
	});

	it("locks casting modes, level arrays, and deterministic class resources", () => {
		const expectedJobs = {
			esper: { ability: "Presence", mode: "known" },
			summoner: { ability: "Sense", mode: "prepared" },
			herald: { ability: "Sense", mode: "prepared" },
			idol: { ability: "Presence", mode: "known" },
		} as const;

		for (const [id, expected] of Object.entries(expectedJobs)) {
			const job = jobs.find((entry) => entry.id === id);
			expect(job, id).toBeDefined();
			if (!job?.spellcasting) continue;
			expect(job.spellcasting.ability).toBe(expected.ability);
			expect(job.spellcasting.cantripsKnown).toHaveLength(20);
			if (expected.mode === "known") {
				expect(job.spellcasting.spellsKnown).toHaveLength(20);
			} else {
				expect(job.spellcasting.spellsKnown).toBeUndefined();
			}
			for (const slots of Object.values(job.spellcasting.spellSlots ?? {})) {
				expect(slots).toHaveLength(20);
			}
			expect(new Set(job.abilities).size).toBe(job.abilities.length);
		}

		const classFeature = (jobId: string, name: string) =>
			jobs
				.find((entry) => entry.id === jobId)
				?.classFeatures?.find((feature) => feature.name === name);
		expect(classFeature("esper", "Flux Pool")).toMatchObject({
			level: 2,
			uses: { formula: "level", recharge: "short-rest" },
		});
		expect(classFeature("idol", "Hype")).toMatchObject({
			level: 1,
			uses: {
				formula: "PRE mod",
				recharge: "long-rest",
				rechargeChanges: [{ level: 5, recharge: "short-rest" }],
			},
		});
		expect(classFeature("summoner", "Entity Shift")).toMatchObject({
			level: 2,
			uses: { formula: "2", recharge: "short-rest", unlimitedAtLevel: 20 },
		});
		expect(classFeature("summoner", "Biome Command")).toMatchObject({
			level: 8,
			uses: {
				formula: "1 + level / 14",
				recharge: "long-rest",
				unlimitedAtLevel: 20,
			},
		});
	});

	it("structures source-explicit Task 5 path feature actions, uses, and resources", () => {
		const pathFeature = (pathId: string, featureName: string) =>
			paths
				.find((path) => path.id === pathId)
				?.features.find((feature) => feature.name === featureName);

		expect(
			pathFeature("esper--absolute-spark", "Absolute Favor"),
		).toMatchObject({
			uses: { formula: "1", recharge: "short-rest" },
			tracking: "uses",
		});
		expect(
			pathFeature("summoner--apex-shifter", "Absolute Entity Shift"),
		).toMatchObject({ actionType: "Bonus action" });
		expect(
			pathFeature("herald--radiance-mandate", "Warding Spark"),
		).toMatchObject({
			actionType: "Reaction",
			uses: { formula: "SENSE mod", recharge: "long-rest" },
			tracking: "uses",
		});
		expect(
			pathFeature("idol--lore-resonance", "Cutting Remarks"),
		).toMatchObject({
			actionType: "Reaction",
			resource: "1 Hype die",
			tracking: "resource",
		});
		expect(
			pathFeature("idol--genesis-resonance", "Animating Rite"),
		).toMatchObject({
			actionType: "Action",
			uses: { formula: "1", recharge: "long-rest" },
			tracking: "uses",
		});
	});

	it("maps canonical Task 5 feature names to deterministic modifiers", async () => {
		const { getPathFeatureModifiers } = await import("@/lib/characterCreation");
		expect(
			getPathFeatureModifiers(
				"Esper",
				"Path of the Aetheric Dragon",
				"Aetheric Scale Armor",
				8,
			),
		).toEqual([
			{
				type: "ac_base",
				value: 13,
				target: "AGI",
				source: "Aetheric Scale Armor",
			},
			{
				type: "hp-max",
				value: 8,
				target: "hp_max",
				source: "Aetheric Scale Armor",
			},
		]);
		expect(
			getPathFeatureModifiers(
				"Summoner",
				"Path of the Apex Shifter",
				"Absolute Entity Shift",
				2,
			),
		).toMatchObject([{ type: "bonus_action_shift", target: "Entity Shift" }]);
		expect(
			getPathFeatureModifiers(
				"Herald",
				"Path of the Restoration Mandate",
				"Anchor of Life",
				1,
			),
		).toMatchObject([{ type: "healing_bonus", value: 2 }]);
		expect(
			getPathFeatureModifiers(
				"Idol",
				"Path of the Lore Resonance",
				"Cutting Remarks",
				3,
			),
		).toMatchObject([{ type: "dissonance_effect", target: "hype_die" }]);
	});
});
