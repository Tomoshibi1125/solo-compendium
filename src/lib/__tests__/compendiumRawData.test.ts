/**
 * Raw-data self-completeness guard.
 *
 * The provider-backed audit (compendiumAudit.test.ts) can pass even when the
 * SOURCE data is thin, because transforms derive/fill some fields at runtime
 * (e.g. spell resolution, source_book defaults). This test runs the same audit
 * against the RAW exported arrays — the authored data itself — and asserts zero
 * errors, so the data stays self-complete for 5e and the provider's derivations
 * remain redundant safety nets rather than load-bearing.
 *
 * Datasets whose raw shape intentionally differs from the audited shape (and
 * which are normalized only by their transform) are out of scope here and fed
 * empty, matching scripts/audit-compendium-raw.ts.
 */
import { describe, expect, it } from "vitest";
import { anomalies } from "@/data/compendium/anomalies";
import { artifacts } from "@/data/compendium/artifacts";
import { FIGHTING_STYLES } from "@/data/compendium/fightingStyles";
import { allItems } from "@/data/compendium/items-index";
import { PRIME_PANTHEON } from "@/data/compendium/pantheon";
import { powers } from "@/data/compendium/powers";
import { comprehensiveRelics } from "@/data/compendium/relics-comprehensive";
import { allRunes } from "@/data/compendium/runes/index";
import { shadowSoldiers } from "@/data/compendium/shadow-soldiers";
import { spells } from "@/data/compendium/spells";
import { techniques } from "@/data/compendium/techniques";
import { allVehicles } from "@/data/compendium/vehicles";
import { runCompendiumAudit } from "@/lib/compendiumAudit";

// biome-ignore lint/suspicious/noExplicitAny: raw arrays are cast to the audit's loose entry shape.
const raw = (v: unknown[]) => async () => v as any[];
const empty = async () => [];

const rawProvider = {
	getAnomalies: raw(anomalies),
	getArtifacts: raw(artifacts),
	getBackgrounds: empty,
	getConditions: empty,
	getFeats: empty,
	getFightingStyles: raw(FIGHTING_STYLES),
	getItems: raw(allItems),
	getJobs: empty,
	getLocations: empty,
	getPantheon: raw(PRIME_PANTHEON),
	getPaths: empty,
	getPowers: raw(powers),
	getRegents: empty,
	getRelics: raw(comprehensiveRelics),
	getRunes: raw(allRunes),
	getShadowSoldiers: raw(shadowSoldiers),
	getSigils: empty,
	getSkills: empty,
	getSpells: raw(spells),
	getTattoos: empty,
	getTechniques: raw(techniques),
	getVehicles: raw(allVehicles),
} as Parameters<typeof runCompendiumAudit>[0];

describe("raw compendium data is self-complete (pre-transform)", () => {
	it("audits the authored arrays with zero errors", async () => {
		const summary = await runCompendiumAudit(rawProvider);
		expect(
			summary.errors,
			`Raw-data audit must surface zero errors. Found ${summary.errors.length}:\n${summary.errors
				.slice(0, 40)
				.map(
					(i) =>
						`- ${i.dataset}:${i.code} ${i.entryName ?? i.entryId}: ${i.message}`,
				)
				.join("\n")}`,
		).toHaveLength(0);
	}, 20000);
});
