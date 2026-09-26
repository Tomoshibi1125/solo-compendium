import { describe, expect, it } from "vitest";
import {
	BEAST_TAMING_PROFICIENCY_ID,
	bondingDcForRank,
	hasBeastTamingProficiency,
	resolveBondingAttempt,
	resolveBondingSpecializationSource,
	selectBondingRoll,
} from "@/lib/companionBonding";

describe("C2 companion bonding rules", () => {
	it("uses the authored D-S DC ladder and refuses E/unknown defaults", () => {
		expect(bondingDcForRank("D")).toBe(12);
		expect(bondingDcForRank("C")).toBe(14);
		expect(bondingDcForRank("B")).toBe(16);
		expect(bondingDcForRank("A")).toBe(18);
		expect(bondingDcForRank("S")).toBe(20);
		expect(bondingDcForRank("E")).toBeNull();
		expect(bondingDcForRank("unknown")).toBeNull();
		expect(bondingDcForRank(null)).toBeNull();
	});

	it("recognizes Beast Taming proficiency aliases without making expertise double PB", () => {
		expect(
			hasBeastTamingProficiency({
				skillProficiencies: ["Beast Taming"],
				skillExpertise: [],
			}),
		).toBe(true);
		expect(
			hasBeastTamingProficiency({
				skillProficiencies: [],
				skillExpertise: [BEAST_TAMING_PROFICIENCY_ID],
			}),
		).toBe(true);

		const result = resolveBondingAttempt({
			rank: "D",
			pre: 10,
			level: 9,
			rollMode: "normal",
			rollPrimary: 9,
			proficiencyApplies: true,
			specializationBonus: 0,
		});
		// Level 9 PB is +4, and C2 applies it once even if the caller's source is expertise.
		expect(result.proficiencyBonus).toBe(4);
		expect(result.total).toBe(13);
	});

	it("requires exact canonical source ids for the established +2 specialization", () => {
		expect(
			resolveBondingSpecializationSource({
				job: "Stalker",
				jobId: "stalker",
				path: "Path of the Pack Leader",
				pathId: "stalker--pack-leader",
			}),
		).toEqual({
			sourceKind: "path",
			sourceId: "stalker--pack-leader",
			label: "Path of the Pack Leader",
			bonus: 2,
		});
		expect(
			resolveBondingSpecializationSource({
				job: "Stalker",
				jobId: "stalker",
				path: "Path of the Pack Leader",
				pathId: null,
			}),
		).toBeNull();
		expect(
			resolveBondingSpecializationSource({
				job: "Summoner",
				jobId: "summoner",
				path: null,
				pathId: null,
			}),
		).toMatchObject({ sourceKind: "job", sourceId: "summoner", bonus: 2 });
	});

	it("does not let a matching display label turn an unrelated canonical id into a specialization", () => {
		expect(
			resolveBondingSpecializationSource({
				job: "Stalker",
				jobId: "stalker",
				path: "Path of the Pack Leader",
				pathId: "stalker--apex-hunter",
			}),
		).toBeNull();
		expect(
			resolveBondingSpecializationSource({
				job: "Summoner",
				jobId: "berserker",
				path: null,
				pathId: null,
			}),
		).toBeNull();
	});

	it("requires the canonical Path to belong to the matching canonical Job", () => {
		expect(
			resolveBondingSpecializationSource({
				job: "Technomancer",
				jobId: "technomancer",
				path: "Design: Synchronist Binary",
				pathId: "technomancer--synchronist-binary-design",
			}),
		).toMatchObject({
			sourceKind: "path",
			sourceId: "technomancer--synchronist-binary-design",
			bonus: 2,
		});
		expect(
			resolveBondingSpecializationSource({
				job: "Stalker",
				jobId: "stalker",
				path: "Design: Synchronist Binary",
				pathId: "technomancer--synchronist-binary-design",
			}),
		).toBeNull();
	});

	it("applies the +2 specialization at most once even when both Job and Path qualify", () => {
		const source = resolveBondingSpecializationSource({
			job: "Summoner",
			jobId: "summoner",
			path: "Path of the Hive Synchronist",
			pathId: "stalker--hive-synchronist",
		});
		// The mismatched Path is rejected, but the canonical Summoner Job still qualifies.
		expect(source?.sourceKind).toBe("job");

		const result = resolveBondingAttempt({
			rank: "C",
			pre: 14,
			level: 5,
			rollMode: "normal",
			rollPrimary: 8,
			proficiencyApplies: true,
			specializationBonus: source?.bonus ?? 0,
		});
		// 8 + PRE(+2) + PB(+3) + specialization(+2) = 15.
		expect(result.specializationBonus).toBe(2);
		expect(result.total).toBe(15);
	});

	it("resolves normal, advantage and disadvantage from bounded d20 inputs", () => {
		expect(selectBondingRoll("normal", 7, 20)).toEqual({
			valid: true,
			selectedRoll: 7,
		});
		expect(selectBondingRoll("advantage", 7, 15)).toEqual({
			valid: true,
			selectedRoll: 15,
		});
		expect(selectBondingRoll("disadvantage", 7, 15)).toEqual({
			valid: true,
			selectedRoll: 7,
		});
		expect(selectBondingRoll("advantage", 7)).toMatchObject({
			valid: false,
			reason: "SECOND_ROLL_REQUIRED",
		});
		expect(selectBondingRoll("normal", 21)).toMatchObject({
			valid: false,
			reason: "ROLL_OUT_OF_RANGE",
		});
	});

	it("uses PRE and returns invalid instead of inventing an unsupported-rank DC", () => {
		const valid = resolveBondingAttempt({
			rank: "B",
			pre: 16,
			level: 1,
			rollMode: "normal",
			rollPrimary: 11,
			proficiencyApplies: true,
			specializationBonus: 0,
		});
		// 11 + PRE(+3) + PB(+2) = 16 versus B DC 16.
		expect(valid).toMatchObject({ valid: true, dc: 16, total: 16, success: true });

		const invalid = resolveBondingAttempt({
			rank: "E",
			pre: 20,
			level: 20,
			rollMode: "normal",
			rollPrimary: 20,
			proficiencyApplies: true,
			specializationBonus: 2,
		});
		expect(invalid).toMatchObject({
			valid: false,
			dc: null,
			total: null,
			success: null,
			reason: "UNSUPPORTED_TARGET_RANK",
		});
	});
});
