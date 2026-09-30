/**
 * Regenerate the server-owned companion source catalog after an authored
 * Anomaly or mount catalog revision. Applied migrations are immutable, so each
 * run writes a NEW migration:
 *
 *   npx tsx scripts/generate-companion-source-catalog.ts [--timestamp=YYYYMMDDHHMMSS] [--force]
 *
 * The timestamp defaults to the current UTC time; --force overwrites an
 * existing file with the same timestamp. Review the migration before release.
 * Existing living-instance snapshots stay frozen separately.
 *
 * RA-10 scaling inputs (scaling kind, Hit Die, and the Anomaly a mount scales
 * from) come from the same resolver the app uses, so server and client agree.
 */
import { createHash } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { staticDataProvider } from "../src/data/compendium/providers";
import { allMounts } from "../src/data/compendium/vehicles";
import { resolveCompanionScalingSource } from "../src/lib/companionScaling";
import { createCanonicalCompanionSource } from "../src/lib/companions";

const sqlString = (value: string): string => `'${value.replaceAll("'", "''")}'`;
const sqlNullable = (value: string | number | null): string =>
	value === null
		? "NULL"
		: typeof value === "number"
			? String(value)
			: sqlString(value);

interface CatalogRow {
	collection: "anomalies" | "vehicles";
	id: string;
	rank: string | null;
	hpMax: number;
	snapshot: ReturnType<typeof createCanonicalCompanionSource>;
	scalingKind: "stat-block" | "size" | null;
	hitDie: number | null;
	scalingAnomalyId: string | null;
}

function wholePositive(value: unknown, label: string): number {
	const number = Number(value);
	if (!Number.isSafeInteger(number) || number <= 0) {
		throw new Error(`Invalid ${label}: ${String(value)}`);
	}
	return number;
}

function utcTimestamp(date: Date): string {
	return date
		.toISOString()
		.replace(/[-:T]/g, "")
		.replace(/\.\d+Z$/, "");
}

function readOptions(argv: readonly string[]) {
	const timestamp =
		argv
			.find((arg) => arg.startsWith("--timestamp="))
			?.slice("--timestamp=".length) ?? utcTimestamp(new Date());
	if (!/^\d{14}$/.test(timestamp)) {
		throw new Error(`--timestamp must be YYYYMMDDHHMMSS, got ${timestamp}`);
	}
	return { timestamp, force: argv.includes("--force") };
}

/** RA-10 scaling inputs for one catalog entry, from the app's own resolver. */
function scalingFor(
	collection: CatalogRow["collection"],
	id: string,
): Pick<CatalogRow, "scalingKind" | "hitDie" | "scalingAnomalyId"> {
	const source = resolveCompanionScalingSource({
		source_collection: collection,
		source_id: id,
	});
	if (!source)
		return { scalingKind: null, hitDie: null, scalingAnomalyId: null };
	if (source.kind === "size") {
		return {
			scalingKind: "size",
			hitDie: source.hitDie,
			scalingAnomalyId: null,
		};
	}
	if (!source.anomaly) {
		throw new Error(`${collection}:${id} scales from a missing Anomaly`);
	}
	return {
		scalingKind: "stat-block",
		hitDie: source.hitDie,
		scalingAnomalyId: source.anomaly.id,
	};
}

async function main(): Promise<void> {
	const { timestamp, force } = readOptions(process.argv.slice(2));
	const output = join(
		process.cwd(),
		`supabase/migrations/${timestamp}_companion_source_catalog_refresh.sql`,
	);
	if (existsSync(output) && !force) {
		throw new Error(`${output} exists; pass --force to overwrite it.`);
	}

	const anomalies = await staticDataProvider.getAnomalies();
	const rows: CatalogRow[] = anomalies.map((entry) => {
		const hpMax = wholePositive(entry.hit_points_average, `${entry.id} HP`);
		const baseAc = wholePositive(entry.armor_class, `${entry.id} AC`);
		const speed = Number(entry.speed_walk ?? 30) || 30;
		const rank = String(entry.gate_rank ?? entry.rank ?? "").trim() || null;
		return {
			collection: "anomalies",
			id: entry.id,
			rank,
			hpMax,
			snapshot: createCanonicalCompanionSource({
				canonicalId: entry.id,
				canonicalType: "anomaly",
				canonicalCollection: "anomalies",
				entryType: "anomaly",
				source: null,
				sourceBook: null,
				name: entry.name,
				hpMax,
				baseAc,
				speed,
				rank,
			}),
			...scalingFor("anomalies", entry.id),
		};
	});

	for (const mount of allMounts.filter(
		(entry) => entry.vehicle_type === "mount",
	)) {
		const hpMax = wholePositive(mount.hit_points.max, `${mount.id} HP`);
		const baseAc = wholePositive(mount.armor_class, `${mount.id} AC`);
		const speed = Number(mount.speed?.land ?? 0);
		if (!Number.isSafeInteger(speed) || speed < 0) {
			throw new Error(`Invalid ${mount.id} speed`);
		}
		const rank = mount.rank ?? null;
		rows.push({
			collection: "vehicles",
			id: mount.id,
			rank,
			hpMax,
			snapshot: createCanonicalCompanionSource({
				canonicalId: mount.id,
				canonicalType: "vehicle",
				canonicalCollection: "vehicles",
				entryType: "mount",
				source:
					typeof (mount as { source?: unknown }).source === "string"
						? ((mount as { source?: string }).source ?? null)
						: null,
				sourceBook: mount.source_book ?? null,
				name: mount.name,
				hpMax,
				baseAc,
				speed,
				rank,
			}),
			...scalingFor("vehicles", mount.id),
		});
	}

	const keys = rows.map((row) => `${row.collection}:${row.id}`);
	if (new Set(keys).size !== keys.length) {
		throw new Error("Duplicate canonical companion source ID");
	}
	rows.sort((a, b) =>
		a.collection === b.collection
			? a.id.localeCompare(b.id)
			: a.collection.localeCompare(b.collection),
	);

	// The revision names the catalog content, so an unchanged catalog keeps it.
	const revision = `canon.${createHash("sha256")
		.update(JSON.stringify(rows))
		.digest("hex")
		.slice(0, 8)}`;
	const values = rows.map(
		(row) =>
			`  (${sqlString(row.collection)}, ${sqlString(row.id)}, ${sqlNullable(row.rank)}, ${row.hpMax}, ${sqlString(JSON.stringify(row.snapshot))}::jsonb, ${sqlString(revision)}, ${sqlNullable(row.scalingKind)}, ${sqlNullable(row.hitDie)}, ${sqlNullable(row.scalingAnomalyId)})`,
	);
	const sql = `-- Generated by scripts/generate-companion-source-catalog.ts (${revision}).
-- Server authority for companion source IDs, acquisition stats, and the RA-10
-- scaling inputs: scaling kind, Hit Die, and the Anomaly a mount scales from.
-- A NULL scaling kind is a companion that keeps its saved stats.
BEGIN;

ALTER TABLE app_private.canonical_companion_sources
  ADD COLUMN IF NOT EXISTS scaling_kind TEXT,
  ADD COLUMN IF NOT EXISTS hit_die INTEGER,
  ADD COLUMN IF NOT EXISTS scaling_anomaly_id TEXT;

ALTER TABLE app_private.canonical_companion_sources
  DROP CONSTRAINT IF EXISTS canonical_companion_sources_scaling_check;
ALTER TABLE app_private.canonical_companion_sources
  ADD CONSTRAINT canonical_companion_sources_scaling_check CHECK (
    (scaling_kind IS NULL AND hit_die IS NULL AND scaling_anomaly_id IS NULL)
    OR (scaling_kind = 'stat-block' AND hit_die IN (4, 6, 8, 10, 12, 20)
        AND scaling_anomaly_id IS NOT NULL)
    OR (scaling_kind = 'size' AND hit_die IN (4, 6, 8, 10, 12, 20)
        AND scaling_anomaly_id IS NULL)
  );

INSERT INTO app_private.canonical_companion_sources (
  source_collection, source_id, rank, hp_max, snapshot, source_revision,
  scaling_kind, hit_die, scaling_anomaly_id
) VALUES
${values.join(",\n")}
ON CONFLICT (source_collection, source_id) DO UPDATE SET
  rank = EXCLUDED.rank,
  hp_max = EXCLUDED.hp_max,
  snapshot = EXCLUDED.snapshot,
  source_revision = EXCLUDED.source_revision,
  scaling_kind = EXCLUDED.scaling_kind,
  hit_die = EXCLUDED.hit_die,
  scaling_anomaly_id = EXCLUDED.scaling_anomaly_id;

REVOKE ALL ON app_private.canonical_companion_sources FROM PUBLIC, anon, authenticated;

COMMIT;
`;
	writeFileSync(output, sql, "utf8");
	const scaled = rows.filter((row) => row.scalingKind !== null).length;
	console.log(
		`Wrote ${rows.length} canonical sources (${scaled} scaled, ${revision}) to ${output}`,
	);
}

main().catch((error: unknown) => {
	console.error(error);
	process.exitCode = 1;
});
