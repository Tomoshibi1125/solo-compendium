import { describe, expect, it } from "vitest";
import { paths } from "@/data/compendium/paths";
import { getPathEligibility, isPathEligible } from "@/lib/pathEligibility";

const RECONCILED_PATH_JOBS = new Set([
	"esper",
	"summoner",
	"herald",
	"idol",
	"revenant",
	"stalker",
	"technomancer",
]);
const reconciledPaths = paths.filter((path) =>
	RECONCILED_PATH_JOBS.has(path.jobId),
);

describe("Task 5-6 path eligibility", () => {
	it("covers all 42 canonical paths", () => {
		expect(reconciledPaths).toHaveLength(42);
		expect(
			Object.fromEntries(
				Array.from(RECONCILED_PATH_JOBS, (jobId) => [
					jobId,
					reconciledPaths.filter((path) => path.jobId === jobId).length,
				]),
			),
		).toEqual({
			esper: 6,
			summoner: 6,
			herald: 6,
			idol: 6,
			revenant: 6,
			stalker: 6,
			technomancer: 6,
		});
	});

	it.each(
		reconciledPaths,
	)("$id requires its parent job, unlock level, and every authored skill", (path) => {
		const requiredSkills = path.requirements.skills ?? [];
		const eligibleContext = {
			jobId: path.jobId,
			jobName: path.jobName,
			level: path.requirements.level,
			skillProficiencies: requiredSkills,
		};
		expect(isPathEligible(path, eligibleContext)).toBe(true);
		expect(
			isPathEligible(path, {
				...eligibleContext,
				jobId: "mage",
				jobName: "Mage",
			}),
		).toBe(false);

		if (path.requirements.level > 1) {
			expect(
				isPathEligible(path, {
					...eligibleContext,
					level: path.requirements.level - 1,
				}),
			).toBe(false);
		}
		if (requiredSkills.length > 0) {
			const result = getPathEligibility(path, {
				...eligibleContext,
				skillProficiencies: requiredSkills.slice(1),
			});
			expect(result.eligible).toBe(false);
			expect(result.missingSkills).toContain(requiredSkills[0]);
		}
	});

	it("normalizes stable job and legacy skill spellings", () => {
		const path = paths.find((entry) => entry.id === "summoner--apex-shifter");
		if (!path) throw new Error("Missing Apex Shifter path");
		expect(
			isPathEligible(path, {
				jobName: "SUMMONER",
				level: 2,
				skillProficiencies: ["Gate Topology", "survival"],
			}),
		).toBe(true);
	});
});
