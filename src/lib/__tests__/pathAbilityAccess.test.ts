import { describe, expect, it } from "vitest";
import { powers } from "@/data/compendium/powers";
import { spells } from "@/data/compendium/spells";
import { techniques } from "@/data/compendium/techniques";
import {
	getPathAbilityGrantTokens,
	normalizePathAbilityValue,
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

	it("every PATH_ABILITY_GRANTS.entryNames reference resolves to a real canonical entry", () => {
		const powerNames = new Set(
			powers.map((p) => normalizePathAbilityValue(p.name)),
		);
		const techniqueNames = new Set(
			techniques.map((t) => normalizePathAbilityValue(t.name)),
		);
		const spellNames = new Set(
			spells.map((s) => normalizePathAbilityValue(s.name)),
		);

		const unresolved: string[] = [];
		for (const grant of PATH_ABILITY_GRANTS) {
			if (!grant.entryNames?.length) continue;
			const catalog =
				grant.kind === "power"
					? powerNames
					: grant.kind === "technique"
						? techniqueNames
						: spellNames;
			for (const name of grant.entryNames) {
				if (!catalog.has(normalizePathAbilityValue(name))) {
					unresolved.push(
						`${grant.jobName} / ${grant.pathName} / ${grant.kind} -> "${name}"`,
					);
				}
			}
		}
		expect(unresolved).toEqual([]);
	});
});
