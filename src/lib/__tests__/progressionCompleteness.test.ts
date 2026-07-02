/**
 * Progression completeness sweep — jobs / paths / regents.
 *
 * The class table promises subclass content with "Feature from your X"
 * marker rows, and LevelUpWizardModal grants path features by exact level
 * match (feature.level === newLevel). A marker level that some path fails
 * to cover is therefore a dead level-up for that job+path combo — exactly
 * how Destroyer/Tactician shipped without its level-18 feature. This suite
 * pins the full catalog:
 *
 *  1. every job has level-1 features and a level-20 capstone;
 *  2. every job has its full complement of 6 paths;
 *  3. every path delivers a feature at its own unlock level and at every
 *     marker level its job's class table promises;
 *  4. all 12 canonical regents resolve in the fusion database by id.
 */

import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { paths } from "@/data/compendium/paths";
import { regents } from "@/data/compendium/regents";
import { ALL_REGENTS } from "@/lib/regentDatabase";

const PATH_FEATURE_MARKER_RE = /^Feature from your /i;

describe("progression completeness (jobs × paths × regents)", () => {
	it("ships all 14 jobs with 6 paths each", () => {
		expect(jobs).toHaveLength(14);
		for (const job of jobs) {
			const jobPaths = paths.filter((p) => p.jobName === job.name);
			expect(jobPaths, `${job.name} paths`).toHaveLength(6);
		}
	});

	for (const job of jobs) {
		const feats = job.classFeatures ?? [];
		const markers = feats
			.filter((f) => PATH_FEATURE_MARKER_RE.test(f.description ?? ""))
			.map((f) => f.level);
		const jobPaths = paths.filter((p) => p.jobName === job.name);

		it(`${job.name}: has level-1 features and a level-20 capstone`, () => {
			expect(feats.some((f) => f.level === 1)).toBe(true);
			expect(feats.some((f) => f.level === 20)).toBe(true);
		});

		it(`${job.name}: every path covers its unlock level and all promised marker levels`, () => {
			const gaps: string[] = [];
			for (const p of jobPaths) {
				const levels = new Set(p.features.map((f) => f.level));
				const unlock = p.requirements?.level;
				if (typeof unlock !== "number" || unlock < 1 || unlock > 20) {
					gaps.push(`${p.name}: invalid unlock level ${unlock}`);
					continue;
				}
				if (!levels.has(unlock))
					gaps.push(`${p.name}: no feature at its unlock level ${unlock}`);
				for (const m of markers) {
					if (!levels.has(m))
						gaps.push(`${p.name}: class table promises a path feature at ${m}`);
				}
				for (const l of levels) {
					if (l < 1 || l > 20)
						gaps.push(`${p.name}: feature level ${l} out of range`);
				}
			}
			expect(gaps).toEqual([]);
		});
	}

	it("all 12 canonical regents resolve in the fusion database by canonical id", () => {
		expect(regents).toHaveLength(12);
		const byId = new Set(ALL_REGENTS.map((r) => r.id));
		const missing = regents.filter((r) => !byId.has(r.id)).map((r) => r.id);
		expect(missing).toEqual([]);
	});
});
