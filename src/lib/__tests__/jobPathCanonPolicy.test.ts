/**
 * Job and Path canon policy (RA-22 – RA-28): retired names, Path attributes,
 * and canonical names on import.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { artifacts } from "@/data/compendium/artifacts";
import { locations } from "@/data/compendium/locations";
import { paths } from "@/data/compendium/paths";
import { regents } from "@/data/compendium/regents";
import { sigils } from "@/data/compendium/sigils";
import { buildImportedCharacterInsert } from "@/hooks/useCharacterExportImport";
import { resolveCanonicalReference } from "@/lib/canonicalCompendium";
import { getRegentFeatureModifiers } from "@/lib/characterCreation";

const SRC_ROOT = join(__dirname, "..", "..");
const RETIRED_REGENT_NAMES = [
	"Shadow Regent",
	"Flame Regent",
	"Titan Regent",
	"Dragon Regent",
	"Architect Regent",
	"Transfiguration Regent",
	"Frost Sovereign",
];

describe("retired names (RA-27)", () => {
	it("resolve a retired Path name only through its declared alias", async () => {
		const escalating = paths.find(
			(path) => path.id === "berserker--escalating-resonance",
		);
		expect(escalating?.aliases).toEqual(["Path of the Feedback Loop"]);
		const resolution = await resolveCanonicalReference("paths", {
			name: "Path of the Feedback Loop",
		});
		expect(resolution.entry?.id).toBe("berserker--escalating-resonance");
	});

	it("store the canonical id and name when an import names a retired Path", async () => {
		const insert = await buildImportedCharacterInsert(
			{
				name: "Old Export",
				job: "Assassin",
				path: "Path of the Lattice-Breaker",
				level: 3,
			},
			"guest",
		);
		expect(insert.path_id).toBe("assassin--weave-infiltrator");
		expect(insert.path).toBe(
			paths.find((path) => path.id === "assassin--weave-infiltrator")?.name,
		);
		expect(insert.job).toBe("Assassin");
	});

	it("never resolve retired Regent names to Regent modifiers", () => {
		for (const name of RETIRED_REGENT_NAMES) {
			expect(getRegentFeatureModifiers(name, "Umbral Command", 10)).toEqual([]);
			expect(
				getRegentFeatureModifiers(name, "Breath of Annihilation", 10),
			).toEqual([]);
		}
		expect(
			getRegentFeatureModifiers("Umbral Regent", "Umbral Command", 10),
		).not.toEqual([]);
	});

	it("keep retired Regent names out of shipped data and UI text", () => {
		const shipped = JSON.stringify([regents, artifacts, sigils, locations]);
		const ui = [
			"components/dice/diceThemes.ts",
			"components/campaign/CampaignWiki.tsx",
			"lib/sensesEngine.ts",
		].map((relPath) => readFileSync(join(SRC_ROOT, relPath), "utf8"));
		for (const name of RETIRED_REGENT_NAMES) {
			expect(shipped.includes(name), name).toBe(false);
			for (const text of ui) expect(text.includes(name), name).toBe(false);
		}
	});
});

describe("Path attributes (RA-25)", () => {
	it("are build guidance: no Path grants ability score increases", () => {
		for (const path of paths) {
			expect(path.stats.primaryAttribute, path.id).toBeTruthy();
			expect(Object.keys(path.stats).sort(), path.id).toEqual(
				path.stats.secondaryAttribute
					? ["primaryAttribute", "secondaryAttribute"]
					: ["primaryAttribute"],
			);
		}
	});
});
