import { describe, expect, it } from "vitest";
import {
	resolveTechniqueUseFormula,
	resolveTechniqueUseRollType,
} from "@/lib/techniqueActionFormula";

describe("techniqueActionFormula", () => {
	it("uses combat action payload damage before local display fields", () => {
		expect(
			resolveTechniqueUseFormula({
				damageRoll: "1d4+2",
				payload: {
					version: 1,
					id: "tech-local",
					name: "Technique",
					source: { type: "technique", entryId: "owned-tech" },
					kind: "damage",
					damage: { roll: "2d6+4", type: "physical" },
				},
			}),
		).toBe("2d6+4");
	});

	it("uses save DC and effect labels instead of a zero fallback", () => {
		expect(
			resolveTechniqueUseFormula({
				payload: {
					version: 1,
					id: "tech-save",
					name: "Save Technique",
					source: { type: "technique", entryId: "owned-save-tech" },
					kind: "save",
					save: { dc: 15, ability: "AGI" },
				},
			}),
		).toBe("DC 15");
		expect(
			resolveTechniqueUseFormula({
				payload: {
					version: 1,
					id: "tech-effect",
					name: "Effect Technique",
					source: { type: "technique", entryId: "owned-effect-tech" },
					kind: "effect",
				},
			}),
		).toBe("effect");
		expect(resolveTechniqueUseFormula(null)).toBe("technique");
	});

	it("derives roll type from combat action payload kind", () => {
		expect(
			resolveTechniqueUseRollType({
				payload: {
					version: 1,
					id: "tech-damage",
					name: "Damage Technique",
					source: { type: "technique", entryId: "owned-damage-tech" },
					kind: "damage",
					damage: { roll: "1d8" },
				},
			}),
		).toBe("damage");
		expect(
			resolveTechniqueUseRollType({
				payload: {
					version: 1,
					id: "tech-save",
					name: "Save Technique",
					source: { type: "technique", entryId: "owned-save-tech" },
					kind: "save",
					save: { dc: 14 },
				},
			}),
		).toBe("save");
		expect(resolveTechniqueUseRollType(undefined)).toBe("ability");
	});
});
