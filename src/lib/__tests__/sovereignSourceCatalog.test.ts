/**
 * The canonical Sovereign source catalog has three copies that must agree:
 * the static compendium the app reads, the generated module the Sovereign
 * API function loads, and the database catalog server validation uses. Regenerate both
 * copies with scripts/generate-sovereign-source-catalog.ts.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { staticDataProvider } from "@/data/compendium/providers";
import { CANONICAL_REGENT_IDS } from "@/lib/regentIdentity";
import { buildSovereignSourceCatalog } from "@/lib/sovereign/sovereignSourceCatalog";
import { SOVEREIGN_SOURCES } from "../../../api/_sovereignSources";

const migrationsDir = resolve(process.cwd(), "supabase/migrations");

function latestCatalogMigration(): string {
	const files = readdirSync(migrationsDir)
		.filter((file) => file.endsWith("_sovereign_source_catalog.sql"))
		.sort();
	const latest = files.at(-1);
	if (!latest) throw new Error("No Sovereign source catalog migration");
	return readFileSync(resolve(migrationsDir, latest), "utf8");
}

const sqlText = (literal: string) => literal.slice(1, -1).replaceAll("''", "'");

describe("canonical Sovereign source catalog", () => {
	it("api/_sovereignSources.ts equals the catalog built from the static compendium", async () => {
		const [jobs, paths, regents] = await Promise.all([
			staticDataProvider.getJobs(),
			staticDataProvider.getPaths(),
			staticDataProvider.getRegents(),
		]);
		expect(SOVEREIGN_SOURCES).toEqual(
			buildSovereignSourceCatalog({ jobs, paths, regents }),
		);
	});

	it("the latest database catalog migration lists the same ids", () => {
		const sql = latestCatalogMigration();
		expect(sql).toContain(
			"DELETE FROM app_private.canonical_sovereign_sources;",
		);
		const rows = [
			...sql.matchAll(
				/\('(job|path|regent)', ('(?:[^']|'')+'), ('(?:[^']|'')+'), (NULL|'(?:[^']|'')+')\)/g,
			),
		].map((match) => ({
			kind: match[1],
			id: sqlText(match[2]),
			name: sqlText(match[3]),
			job_id: match[4] === "NULL" ? undefined : sqlText(match[4]),
		}));
		expect(rows).toEqual(
			SOVEREIGN_SOURCES.map((source) => ({
				kind: source.kind,
				id: source.id,
				name: source.name,
				job_id: source.job_id,
			})),
		);
	});

	it("offers exactly the twelve canonical Regents and paths owned by known jobs", () => {
		const regentIds = SOVEREIGN_SOURCES.filter(
			(source) => source.kind === "regent",
		).map((source) => source.id);
		expect([...regentIds].sort()).toEqual([...CANONICAL_REGENT_IDS].sort());

		const jobIds = new Set(
			SOVEREIGN_SOURCES.filter((source) => source.kind === "job").map(
				(source) => source.id,
			),
		);
		for (const path of SOVEREIGN_SOURCES.filter(
			(source) => source.kind === "path",
		)) {
			expect(jobIds.has(path.job_id ?? ""), path.id).toBe(true);
		}
	});
});
