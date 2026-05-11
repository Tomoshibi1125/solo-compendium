import { describe, expect, it } from "vitest";
import {
	getPathAbilityGrantTokens,
	PATH_ABILITY_GRANTS,
	pathGrantsAbilityKind,
} from "@/lib/pathAbilityAccess";

describe("pathAbilityAccess exported grant catalog", () => {
	it("exposes auditable exact path grants without broadening base access", () => {
		expect(PATH_ABILITY_GRANTS.length).toBeGreaterThan(0);
		expect(
			pathGrantsAbilityKind({
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				characterLevel: 1,
				kind: "power",
			}),
		).toBe(true);
		expect(
			pathGrantsAbilityKind({
				jobName: "Contractor",
				pathName: "Path of the Forgotten Star",
				characterLevel: 1,
				kind: "power",
			}),
		).toBe(false);

		const tokens = getPathAbilityGrantTokens(PATH_ABILITY_GRANTS);
		expect(tokens).toContain("path-of-the-cursed-blade");
		expect(tokens).toContain("contractor");
	});
});
