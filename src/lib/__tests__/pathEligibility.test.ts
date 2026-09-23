import { describe, expect, it } from "vitest";
import { paths } from "@/data/compendium/paths";
import { getPathEligibility, isPathEligible } from "@/lib/pathEligibility";

describe("Path eligibility", () => {
	it("gives every built-in path only an unlock level", () => {
		for (const path of paths) {
			expect(path.requirements).toEqual({ level: path.requirements.level });
		}
	});

	it.each(paths)("$id requires its parent job and unlock level", (path) => {
		const foreignJob = path.jobId === "mage" ? "destroyer" : "mage";
		const eligibleContext = {
			jobId: path.jobId,
			jobName: path.jobName,
			level: path.requirements.level,
		};
		expect(isPathEligible(path, eligibleContext)).toBe(true);
		expect(
			isPathEligible(path, {
				...eligibleContext,
				jobId: foreignJob,
				jobName: foreignJob === "mage" ? "Mage" : "Destroyer",
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
	});

	it("normalizes stable job spellings", () => {
		const path = paths.find((entry) => entry.id === "summoner--apex-shifter");
		if (!path) throw new Error("Missing Apex Shifter path");
		expect(
			isPathEligible(path, {
				jobName: "SUMMONER",
				level: 2,
			}),
		).toBe(true);
	});

	it("does not enforce stale non-job prerequisite metadata", () => {
		const stalePrerequisitePath = {
			id: "test-path",
			jobId: "summoner",
			path_level: 3,
			requirements: {
				level: 3,
				skills: ["A skill that should not gate paths"],
				abilities: ["An ability that should not gate paths"],
				prerequisites: ["A prerequisite that should not gate paths"],
			},
			prerequisites: "A legacy prerequisite that should not gate paths",
		} as unknown as Parameters<typeof getPathEligibility>[0];
		const result = getPathEligibility(stalePrerequisitePath, {
			jobId: "summoner",
			level: 3,
		});

		expect(result.eligible).toBe(true);
	});
});
