/**
 * Taming substrate tests — Q6 of Round 3.
 */
import { describe, expect, it } from "vitest";
import {
	attemptTaming,
	formatControllerBonusesSummary,
	getControllerBonuses,
	type TamingCharacterContext,
} from "@/lib/taming";

const baseCharacter = (
	overrides: Partial<TamingCharacterContext> = {},
): TamingCharacterContext => ({
	id: "char-1",
	job: null,
	path: null,
	abilities: {
		STR: 10,
		AGI: 10,
		VIT: 10,
		INT: 10,
		SENSE: 10,
		PRE: 10,
	},
	proficiencyBonus: 2,
	...overrides,
});

describe("getControllerBonuses — path detection", () => {
	it("detects Pack Leader on a Stalker character", () => {
		const bonuses = getControllerBonuses(
			baseCharacter({ job: "Stalker", path: "Path of the Pack Leader" }),
		);
		expect(bonuses.hasPackLeader).toBe(true);
		expect(bonuses.bonusActions).toContain("Coordinated Strike");
	});

	it("detects Summoner (biome-bonded) on the Summoner Job", () => {
		const bonuses = getControllerBonuses(
			baseCharacter({ job: "Summoner", path: null }),
		);
		expect(bonuses.hasSummoner).toBe(true);
	});

	it("detects Contractor + Pact of the Chain", () => {
		const bonuses = getControllerBonuses(
			baseCharacter({
				job: "Contractor",
				path: "Pact of the Chain",
			}),
		);
		expect(bonuses.hasContractor).toBe(true);
	});

	it("detects Esper Entity Shift", () => {
		const bonuses = getControllerBonuses(
			baseCharacter({ job: "Esper", path: "Path of the Entity Shift" }),
		);
		expect(bonuses.hasEsper).toBe(true);
	});

	it("detects Synchronist Binary", () => {
		const bonuses = getControllerBonuses(
			baseCharacter({
				job: "Technomancer",
				path: "Path of the Synchronist Binary",
			}),
		);
		expect(bonuses.hasSynchronist).toBe(true);
	});

	it("detects Hive Synchronist", () => {
		const bonuses = getControllerBonuses(
			baseCharacter({
				job: "Stalker",
				path: "Path of the Hive Synchronist",
			}),
		);
		expect(bonuses.hasHive).toBe(true);
	});

	it("returns zero bonuses for a non-bonding character", () => {
		const bonuses = getControllerBonuses(
			baseCharacter({ job: "Berserker", path: "Path of the Mana Scars" }),
		);
		expect(bonuses.hasPackLeader).toBe(false);
		expect(bonuses.hasSummoner).toBe(false);
		expect(bonuses.hasContractor).toBe(false);
		expect(bonuses.hasEsper).toBe(false);
		expect(bonuses.hasSynchronist).toBe(false);
		expect(bonuses.hasHive).toBe(false);
		expect(bonuses.bonusActions).toHaveLength(0);
	});
});

describe("attemptTaming — happy path + path bonus", () => {
	it("succeeds when roll + ability mod + PB meets DC", () => {
		const result = attemptTaming(
			baseCharacter({ abilities: { ...baseCharacter().abilities, SENSE: 16 } }),
			{ dc: 12, ability: "SENSE" },
			10,
		);
		// roll(10) + SENSE mod(+3) + PB(2) = 15 >= DC 12.
		expect(result.success).toBe(true);
		expect(result.total).toBe(15);
		expect(result.bondLevel).toBeGreaterThanOrEqual(1);
	});

	it("fails when total < DC and surfaces a reason", () => {
		const result = attemptTaming(
			baseCharacter(),
			{ dc: 20, ability: "SENSE" },
			5,
		);
		expect(result.success).toBe(false);
		expect(result.bondLevel).toBe(0);
		expect(result.reason).toContain("Failed by");
	});

	it("applies +2 path bonus for Pack Leader", () => {
		const result = attemptTaming(
			baseCharacter({
				job: "Stalker",
				path: "Path of the Pack Leader",
				abilities: { ...baseCharacter().abilities, SENSE: 14 },
			}),
			{ dc: 15, ability: "SENSE" },
			10,
		);
		// roll(10) + SENSE(+2) + PB(2) + path(+2) = 16 >= DC 15.
		expect(result.success).toBe(true);
		expect(result.total).toBe(16);
	});

	it("honors bond_initial when provided", () => {
		const result = attemptTaming(
			baseCharacter(),
			{ dc: 5, ability: "PRE", bond_initial: 3 },
			10,
		);
		expect(result.success).toBe(true);
		expect(result.bondLevel).toBe(3);
	});
});

describe("formatControllerBonusesSummary", () => {
	it("returns null when no bonuses apply", () => {
		const summary = formatControllerBonusesSummary(
			getControllerBonuses(baseCharacter({ job: "Berserker" })),
		);
		expect(summary).toBeNull();
	});

	it("comma-joins active path labels", () => {
		const summary = formatControllerBonusesSummary(
			getControllerBonuses(
				baseCharacter({
					job: "Stalker",
					path: "Path of the Pack Leader + Hive Synchronist",
				}),
			),
		);
		expect(summary).toContain("Pack Leader");
		expect(summary).toContain("Hive");
	});
});
