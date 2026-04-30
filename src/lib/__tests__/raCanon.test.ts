import { describe, expect, it } from "vitest";
import { conditions } from "@/data/compendium/conditions";
import { jobs } from "@/data/compendium/jobs";
import { regents } from "@/data/compendium/regents";
import { HALF_CASTERS } from "@/lib/runeAutomation";
import { ABILITY_NAMES } from "@/types/core-rules";

const LOCKED_JOB_IDS = [
	"destroyer",
	"berserker",
	"assassin",
	"striker",
	"mage",
	"esper",
	"revenant",
	"summoner",
	"holy-knight",
	"technomancer",
	"idol",
	"herald",
	"contractor",
	"stalker",
];

const LOCKED_REGENT_IDS = [
	"umbral_regent",
	"radiant_regent",
	"steel_regent",
	"destruction_regent",
	"war_regent",
	"frost_regent",
	"beast_regent",
	"plague_regent",
	"spatial_regent",
	"mimic_regent",
	"blood_regent",
	"gravity_regent",
];

describe("Rift Ascendant canon locks", () => {
	it("keeps the six RA ability scores and display names", () => {
		expect(Object.keys(ABILITY_NAMES)).toEqual([
			"STR",
			"AGI",
			"VIT",
			"INT",
			"SENSE",
			"PRE",
		]);
		expect(ABILITY_NAMES).toEqual({
			STR: "Strength",
			AGI: "Agility",
			VIT: "Vitality",
			INT: "Intelligence",
			SENSE: "Sense",
			PRE: "Presence",
		});
	});

	it("keeps the 2014 six-level exhaustion table", () => {
		const exhaustion = conditions.find(
			(condition) => condition.id === "exhaustion",
		);
		expect(exhaustion?.effects).toEqual([
			"Level 1: Disadvantage on ability checks",
			"Level 2: Speed halved",
			"Level 3: Disadvantage on attack rolls and saving throws",
			"Level 4: Hit point maximum halved",
			"Level 5: Speed reduced to 0",
			"Level 6: Death",
		]);
		expect(exhaustion?.removal).toContain(
			"Finishing a long rest reduces exhaustion level by 1",
		);
	});

	it("keeps exactly the 14 canonical Jobs and no multiclass fields", () => {
		expect(jobs.map((job) => job.id)).toEqual(LOCKED_JOB_IDS);
		for (const job of jobs) {
			expect("multiclass" in job).toBe(false);
			expect(
				(job as unknown as Record<string, unknown>).multiclass,
			).toBeFalsy();
		}
	});

	it("keeps exactly the 12 canonical Regents", () => {
		expect(regents.map((regent) => regent.id)).toEqual(LOCKED_REGENT_IDS);
	});

	it("keeps the locked half-caster job bucket", () => {
		expect(HALF_CASTERS).toEqual(["Holy Knight", "Stalker"]);
	});
});
