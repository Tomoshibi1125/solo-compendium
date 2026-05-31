/**
 * Part C — Compendium Job-Detail display parity.
 *
 * The compendium job page resolves a job through `listCanonicalEntries("jobs")`
 * → `provider.getJobs()` → `transformJob`, then JobDetail.tsx reads DISPLAY
 * field names off that object. transformJob historically emitted DB-shaped
 * names (`hit_die` number, `saving_throw_proficiencies`, `hit_points_at_*`),
 * so JobDetail showed generic fallbacks (`d10` / `None` / hidden HP) for every
 * job. These tests lock the display-name contract + the canon weapon choices.
 */
import { describe, expect, it } from "vitest";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";

type JobEntry = Record<string, unknown>;

async function getJob(id: string): Promise<JobEntry> {
	const jobs = await listCanonicalEntries("jobs");
	const job = jobs.find((j) => j.id === id);
	if (!job) throw new Error(`Job "${id}" not found in canonical jobs`);
	return job as unknown as JobEntry;
}

describe("Job detail display parity (transformJob → JobDetail contract)", () => {
	const HIT_DICE: Record<string, string> = {
		idol: "1d8",
		berserker: "1d12",
		mage: "1d6",
		revenant: "1d8",
	};

	it.each(
		Object.entries(HIT_DICE),
	)("%s exposes hit_dice as the die string (not the d10 fallback)", async (id, expected) => {
		const job = await getJob(id);
		expect(job.hit_dice).toBe(expected);
		// The display value must not be the JobDetail "d10" fallback.
		expect(job.hit_dice).not.toBe("d10");
	});

	it.each([
		"idol",
		"berserker",
		"mage",
		"revenant",
	])("%s exposes saving_throws as a non-empty display array", async (id) => {
		const job = await getJob(id);
		expect(Array.isArray(job.saving_throws)).toBe(true);
		expect((job.saving_throws as string[]).length).toBeGreaterThan(0);
	});

	it("Idol and Revenant expose their canonical saving throws", async () => {
		const idol = await getJob("idol");
		const revenant = await getJob("revenant");
		expect(idol.saving_throws).toEqual(["Agility", "Presence"]);
		expect(revenant.saving_throws).toEqual(["Intelligence", "Vitality"]);
	});

	it.each([
		"idol",
		"berserker",
		"mage",
		"revenant",
	])("%s exposes non-empty hp_at_level_1 / hp_at_higher_levels", async (id) => {
		const job = await getJob(id);
		expect(typeof job.hp_at_level_1).toBe("string");
		expect((job.hp_at_level_1 as string).length).toBeGreaterThan(0);
		expect(typeof job.hp_at_higher_levels).toBe("string");
		expect((job.hp_at_higher_levels as string).length).toBeGreaterThan(0);
	});

	it("every job exposes canon weapon_choices (string[][], non-empty groups)", async () => {
		const jobs = await listCanonicalEntries("jobs");
		expect(jobs.length).toBeGreaterThan(0);
		for (const job of jobs) {
			const wc = (job as unknown as JobEntry).weapon_choices as
				| string[][]
				| null
				| undefined;
			expect(Array.isArray(wc), `${job.id} weapon_choices is an array`).toBe(
				true,
			);
			expect(
				(wc as string[][]).length,
				`${job.id} has at least one weapon group`,
			).toBeGreaterThan(0);
			for (const group of wc as string[][]) {
				expect(Array.isArray(group)).toBe(true);
				expect(group.length).toBeGreaterThan(0);
				for (const w of group) expect(typeof w).toBe("string");
			}
		}
	});

	it("passes through senses/defenses where the job defines them (Revenant)", async () => {
		// Revenant has darkvision + necrotic/poison resistances + condition
		// immunities in canon — all must survive the transform for JobDetail.
		const revenant = await getJob("revenant");
		expect(typeof revenant.darkvision).toBe("number");
		expect(Array.isArray(revenant.damage_resistances)).toBe(true);
		expect((revenant.damage_resistances as string[]).length).toBeGreaterThan(0);
		expect(Array.isArray(revenant.condition_immunities)).toBe(true);
	});

	it("exposes the spellcasting object for caster jobs (Mage)", async () => {
		const mage = await getJob("mage");
		expect(mage.spellcasting).toBeTruthy();
		expect((mage.spellcasting as { ability?: string }).ability).toBeTruthy();
	});
});
