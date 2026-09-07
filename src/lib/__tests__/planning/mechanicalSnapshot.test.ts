import { describe, expect, it } from "vitest";
import {
	type CharacterMechanicalSnapshotInputV1,
	createCharacterMechanicalSnapshotV1,
} from "@/lib/planning/mechanicalSnapshot";
import { resolveMechanicalReferenceV1 } from "@/lib/planning/references";

const resolvedCanonical = resolveMechanicalReferenceV1({
	kind: "canonical",
	requestedName: "Aegis Training",
	explicitCandidate: {
		version: 1,
		kind: "canonical",
		id: "feature-aegis-training",
		label: "Aegis Training",
		evidence: [],
		canonicalType: "feature",
		collection: "job-features",
		sourceBook: "Core",
	},
});
const unresolvedQuest = resolveMechanicalReferenceV1({
	kind: "quest",
	requestedName: "The Unindexed Road",
});

function snapshotInput(reverse = false): CharacterMechanicalSnapshotInputV1 {
	const modifiers = [
		{
			version: 1 as const,
			modifierId: "modifier-z",
			target: "armorClass",
			mode: "add" as const,
			value: 1,
			active: true,
			custom: false,
			sourceEvidence: [],
		},
		{
			version: 1 as const,
			modifierId: "modifier-a",
			target: "speed",
			mode: "set" as const,
			value: 35,
			active: true,
			custom: true,
			sourceEvidence: [],
		},
	];
	return {
		characterId: "character-1",
		displayName: "Rin",
		storedBases: {
			level: 4,
			experience: 2700,
			abilityScores: {
				strength: 10,
				agility: 14,
				vitality: 12,
				intelligence: 16,
				sense: 11,
				presence: 9,
			},
			hitPointsMaximum: 31,
			baseArmorClass: 13,
			baseSpeed: { fly: 0, land: 30 },
			proficiencyBonus: 2,
			hitDice: { maximum: 4, size: 8 },
			additional: { storedFlag: true },
		},
		canonicalDerivedValues: [
			{
				version: 1,
				key: "spellSaveDc",
				value: 13,
				formula: "8 + proficiency + intelligence",
				sourceEvidence: [],
				unresolvedReferenceIds: [],
			},
		],
		transient: {
			modifiers: reverse ? [...modifiers].reverse() : modifiers,
			resources: [
				{
					version: 1,
					resourceId: "resource-focus",
					key: "focus",
					current: 2,
					maximum: 3,
					temporary: 0,
					custom: false,
					manual: false,
					sourceEvidence: [],
				},
			],
			effects: [
				{
					version: 1,
					effectId: "effect-ward",
					key: "warded",
					active: true,
					state: { strength: 2 },
					manual: false,
					sourceEvidence: [],
				},
			],
			conditions: [
				{
					version: 1,
					conditionId: "condition-dazed",
					key: "dazed",
					active: true,
					state: { remainingRounds: 1 },
					manual: true,
					sourceEvidence: [],
				},
			],
		},
		referenceResolutions: reverse
			? [unresolvedQuest, resolvedCanonical]
			: [resolvedCanonical, unresolvedQuest],
	};
}

describe("createCharacterMechanicalSnapshotV1", () => {
	it("is deterministic and separates stored, canonical, and transient state", () => {
		const first = createCharacterMechanicalSnapshotV1(snapshotInput());
		const reordered = createCharacterMechanicalSnapshotV1(snapshotInput(true));

		expect(reordered).toEqual(first);
		expect(first.transient.modifiers.map((entry) => entry.modifierId)).toEqual([
			"modifier-a",
			"modifier-z",
		]);
		expect(first.storedBases.hitPointsMaximum).toBe(31);
		expect(first.canonicalDerivedValues[0].key).toBe("spellSaveDc");
		expect(first.transient.conditions[0].state).toEqual({ remainingRounds: 1 });
	});

	it("retains unresolved references without manufacturing an ID", () => {
		const snapshot = createCharacterMechanicalSnapshotV1(snapshotInput());

		expect(snapshot.references.resolved).toHaveLength(1);
		expect(snapshot.references.unresolved).toEqual([
			expect.objectContaining({
				kind: "quest",
				requestedName: "The Unindexed Road",
				candidateId: null,
			}),
		]);
		expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
	});
});

describe("canonical derived value identity", () => {
	it("blocks duplicate keys while keeping output deterministic", () => {
		const base = snapshotInput();
		const canonical = base.canonicalDerivedValues?.[0];
		if (!canonical) throw new Error("canonical snapshot fixture is missing");
		const duplicate = {
			...canonical,
			value: 99,
		};
		const first = createCharacterMechanicalSnapshotV1({
			...base,
			canonicalDerivedValues: [canonical, duplicate],
		});
		const reversed = createCharacterMechanicalSnapshotV1({
			...base,
			canonicalDerivedValues: [duplicate, canonical],
		});

		expect(reversed).toEqual(first);
		expect(first.issues).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					severity: "strict",
					code: "snapshot-duplicate-id",
					path: "canonicalDerivedValues.spellSaveDc",
				}),
			]),
		);
	});
});
