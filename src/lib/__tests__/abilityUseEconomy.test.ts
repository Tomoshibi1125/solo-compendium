import { describe, expect, it } from "vitest";
import type { AbilityScore } from "@/lib/5eRulesEngine";
import { deriveAbilityUseGrant } from "@/lib/abilityUseEconomy";

// Destroyer's primary ability is STR. At level 1 the proficiency bonus is +2, so
// a STR 16 (+3) Destroyer gets 3 + 2 = 5 uses per rest for a tracked ability.
const DESTROYER_ABILITIES: Partial<Record<AbilityScore, number>> = {
	STR: 16,
	AGI: 14,
	INT: 10,
	PRE: 12,
	SENSE: 12,
	VIT: 12,
};

describe("deriveAbilityUseGrant — 5e-SRD per-ability use economy", () => {
	it("limits a leveled martial power to (primary mod + PB), short rest for tiers 1-3", () => {
		const grant = deriveAbilityUseGrant({
			kind: "power",
			job: "Destroyer",
			level: 1,
			abilities: DESTROYER_ABILITIES,
			powerLevel: 2,
		});
		expect(grant).toEqual({
			uses_max: 5,
			uses_current: 5,
			recharge: "short-rest",
		});
	});

	it("recharges high-tier (4+) martial powers on a long rest", () => {
		const grant = deriveAbilityUseGrant({
			kind: "power",
			job: "Destroyer",
			level: 1,
			abilities: DESTROYER_ABILITIES,
			powerLevel: 4,
		});
		expect(grant?.recharge).toBe("long-rest");
		expect(grant?.uses_max).toBe(5);
	});

	it("leaves cantrip (level-0) powers at-will / untracked", () => {
		expect(
			deriveAbilityUseGrant({
				kind: "power",
				job: "Destroyer",
				level: 1,
				abilities: DESTROYER_ABILITIES,
				powerLevel: 0,
			}),
		).toBeNull();
	});

	it("honours atWill:true (forced unlimited) and atWill:false (forced tracked)", () => {
		// atWill:true on a leveled power → untracked.
		expect(
			deriveAbilityUseGrant({
				kind: "power",
				job: "Destroyer",
				level: 1,
				abilities: DESTROYER_ABILITIES,
				powerLevel: 3,
				atWill: true,
			}),
		).toBeNull();
		// atWill:false on a cantrip → tracked.
		const forced = deriveAbilityUseGrant({
			kind: "power",
			job: "Destroyer",
			level: 1,
			abilities: DESTROYER_ABILITIES,
			powerLevel: 0,
			atWill: false,
		});
		expect(forced?.uses_max).toBe(5);
	});

	it("leaves slot-casting jobs' leveled powers untracked (they use spell slots)", () => {
		expect(
			deriveAbilityUseGrant({
				kind: "power",
				job: "Holy Knight", // prepared → spell slots
				level: 1,
				abilities: DESTROYER_ABILITIES,
				powerLevel: 2,
			}),
		).toBeNull();
	});

	it("tracks techniques for any job, tiering recharge by unlock level", () => {
		const low = deriveAbilityUseGrant({
			kind: "technique",
			job: "Destroyer",
			level: 1,
			abilities: DESTROYER_ABILITIES,
			levelRequirement: 3,
		});
		expect(low?.recharge).toBe("short-rest");
		const high = deriveAbilityUseGrant({
			kind: "technique",
			job: "Destroyer",
			level: 1,
			abilities: DESTROYER_ABILITIES,
			levelRequirement: 9,
		});
		expect(high?.recharge).toBe("long-rest");
	});

	it("scales uses with level (proficiency bonus) and clamps to at least 1", () => {
		// Level 5 → PB +3; STR +3 → 6 uses.
		const l5 = deriveAbilityUseGrant({
			kind: "power",
			job: "Destroyer",
			level: 5,
			abilities: DESTROYER_ABILITIES,
			powerLevel: 1,
		});
		expect(l5?.uses_max).toBe(6);
		// Dump primary (STR 8 → -1) at level 1 (PB +2) → max(1, 1) = 1.
		const dump = deriveAbilityUseGrant({
			kind: "power",
			job: "Destroyer",
			level: 1,
			abilities: { STR: 8 },
			powerLevel: 1,
		});
		expect(dump?.uses_max).toBe(1);
	});
});
