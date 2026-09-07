/**
 * Companion substrate tests — pure HP/AC math, provenance, and JSON helpers.
 */
import { describe, expect, it } from "vitest";
import type { SandboxNPC } from "@/data/compendium/sandbox-npcs";
import {
	abilitiesFromCanonicalSource,
	abilitiesFromNpc,
	createCanonicalCompanionSource,
	effectiveCompanionAc,
	equipmentAcBonus,
	leveledCompanionHp,
	parseAbilities,
	parseCanonicalCompanionSource,
	parseEquipment,
} from "@/lib/companions";

const makeNpc = (overrides: Partial<SandboxNPC> = {}): SandboxNPC =>
	({
		hp: 20,
		ac: 14,
		level: 3,
		keyAbilities: ["Guard Stance", "Riposte"],
		leveling: {
			xp: 0,
			xpToNextLevel: 0,
			autoLevel: true,
			maxLevel: 20,
			hpPerLevel: 5,
			levelAbilities: {},
		},
		...overrides,
	}) as unknown as SandboxNPC;

describe("leveledCompanionHp", () => {
	it("returns base hp at the companion's base level", () => {
		const npc = makeNpc();
		expect(leveledCompanionHp(npc, npc.level)).toBe(20);
	});

	it("adds hpPerLevel for each level gained above base", () => {
		const npc = makeNpc();
		expect(leveledCompanionHp(npc, npc.level + 2)).toBe(20 + 2 * 5);
	});

	it("never drops below base hp when below the base level", () => {
		const npc = makeNpc();
		expect(leveledCompanionHp(npc, npc.level - 5)).toBe(20);
	});
});

describe("equipmentAcBonus / effectiveCompanionAc", () => {
	it("sums finite ac bonuses and ignores gear without one", () => {
		expect(
			equipmentAcBonus([{ name: "Shield", ac_bonus: 2 }, { name: "Cloak" }]),
		).toBe(2);
	});

	it("ignores non-finite ac bonuses", () => {
		expect(
			equipmentAcBonus([
				{ name: "Shield", ac_bonus: 2 },
				{ name: "Broken", ac_bonus: Number.NaN },
				{ name: "Weird", ac_bonus: Number.POSITIVE_INFINITY },
			]),
		).toBe(2);
	});

	it("adds gear bonuses to the base AC", () => {
		expect(
			effectiveCompanionAc(13, [
				{ name: "Shield", ac_bonus: 2 },
				{ name: "Cloak" },
			]),
		).toBe(15);
	});
});

describe("abilitiesFromNpc", () => {
	it("maps key abilities to action-typed entries", () => {
		const npc = makeNpc({ keyAbilities: ["Guard Stance", "Riposte"] });
		expect(abilitiesFromNpc(npc)).toEqual([
			{ name: "Guard Stance", action_type: "action" },
			{ name: "Riposte", action_type: "action" },
		]);
	});
});

describe("canonical companion provenance", () => {
	it.each([
		{
			canonicalId: "anomaly-ember-hound",
			canonicalType: "anomaly" as const,
			canonicalCollection: "anomalies" as const,
			entryType: "beast",
		},
		{
			canonicalId: "mount-bureau-warhorse",
			canonicalType: "vehicle" as const,
			canonicalCollection: "vehicles" as const,
			entryType: "mount",
		},
	])("round-trips the selected $canonicalType id, type, source, and snapshot fields", ({
		canonicalId,
		canonicalType,
		canonicalCollection,
		entryType,
	}) => {
		const snapshot = createCanonicalCompanionSource({
			canonicalId,
			canonicalType,
			canonicalCollection,
			entryType,
			source: "authored-catalog",
			sourceBook: "Rift Ascendant Canon",
			name: "Selected Companion",
			hpMax: 37,
			baseAc: 15,
			speed: 45,
			rank: "B",
		});

		expect(parseCanonicalCompanionSource(snapshot)).toEqual(snapshot);
		expect(snapshot.provenance).toEqual({
			canonicalId,
			canonicalType,
			canonicalCollection,
			entryType,
			source: "authored-catalog",
			sourceBook: "Rift Ascendant Canon",
		});
	});

	it("does not mistake a legacy raw guild NPC snapshot for canonical provenance", () => {
		expect(
			parseCanonicalCompanionSource({
				id: "npc-1",
				name: "Glassline Scout",
				leveling: { maxLevel: 10 },
			}),
		).toBeNull();
	});

	it("preserves only authored canonical ability text and drops nameless rows", () => {
		expect(
			abilitiesFromCanonicalSource(
				[
					{ name: "Pounce", description: "Move, then strike." },
					{ name: "Shadow Step", action_type: "bonus" },
					{ description: "No authored name." },
				],
				"trait",
			),
		).toEqual([
			{
				name: "Pounce",
				description: "Move, then strike.",
				action_type: "trait",
			},
			{ name: "Shadow Step", action_type: "bonus" },
		]);
	});
});

describe("parseEquipment", () => {
	it("drops entries with no name and coerces types", () => {
		const parsed = parseEquipment([
			{ name: "Shield", ac_bonus: 2 },
			{ ac_bonus: 1 },
			{ name: "" },
			"not-an-object",
			null,
		]);
		expect(parsed).toEqual([{ name: "Shield", ac_bonus: 2 }]);
	});

	it("returns [] for non-array input", () => {
		expect(parseEquipment("nope")).toEqual([]);
	});
});

describe("parseAbilities", () => {
	it("drops nameless entries and defaults action_type to action", () => {
		const parsed = parseAbilities([
			{ name: "Smite" },
			{ description: "orphan" },
			{ name: "Focus", action_type: "bonus" },
		]);
		expect(parsed).toEqual([
			{ name: "Smite", action_type: "action" },
			{ name: "Focus", action_type: "bonus" },
		]);
	});
});
