import { parseCanonicalCompanionSource } from "@/lib/companions";

export type CompanionOwnerScope = "character" | "campaign";
export type CompanionSourcePolicy = "snapshot" | "legacy-live" | "manual";

export interface CompanionInstanceRecord {
	id: string;
	owner_scope: CompanionOwnerScope;
	owner_character_id: string | null;
	owner_campaign_id: string | null;
	primary_handler_character_id: string | null;
	combat_controller_character_id: string | null;
	rider_character_id: string | null;
	identity_kind: string;
	source_kind: string;
	source_collection: string | null;
	source_id: string | null;
	source_policy: CompanionSourcePolicy;
	source_revision: string;
	source_snapshot_version: number;
	source_snapshot: unknown;
	profile_version: number;
	progression_profile: unknown;
	stat_overrides: unknown;
	mount_profile: unknown;
	/** C3 durable combat state shared by tracker/session projections. */
	combat_state?: unknown;
	/** Optimistic-concurrency revision for the durable C3 combat state. */
	combat_state_version?: number;
	origin_table: string;
	origin_row_id: string;
	created_at: string;
	updated_at: string;
}

export interface CompanionBaseStats {
	name: string;
	hpMax: number;
	baseAc: number;
	speed: number;
	rank?: string | null;
}

export interface CompanionStateProjection {
	name?: string | null;
	nickname?: string | null;
	currentHp?: number | null;
	hpMax?: number | null;
	baseAc?: number | null;
	speed?: number | null;
}

export interface EffectiveCompanionStats extends CompanionBaseStats {
	instanceId: string;
	currentHp: number;
	sourceId: string | null;
	sourceRevision: string;
	sourcePolicy: CompanionSourcePolicy;
	profileVersion: number;
	usesLiveCatalogFallback: boolean;
}

const finiteNumber = (value: unknown): number | null =>
	typeof value === "number" && Number.isFinite(value) ? value : null;

const positiveOrNull = (value: unknown): number | null => {
	const numeric = finiteNumber(value);
	return numeric !== null && numeric >= 0 ? numeric : null;
};

const stringOrNull = (value: unknown): string | null =>
	typeof value === "string" && value.trim().length > 0 ? value : null;

function recordOrNull(value: unknown): Record<string, unknown> | null {
	return value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

/**
 * Read the frozen source snapshot without assuming every legacy row already
 * has the canonical-compendium v1 envelope. Manual/guild snapshots retain the
 * persisted fields they had when C1 mapped the row.
 */
export function readCompanionSnapshotBaseStats(
	snapshot: unknown,
): CompanionBaseStats | null {
	const canonical = parseCanonicalCompanionSource(snapshot);
	if (canonical) {
		return {
			name: canonical.sourceFields.name,
			hpMax: Math.max(0, canonical.sourceFields.hpMax),
			baseAc: canonical.sourceFields.baseAc,
			speed: Math.max(0, canonical.sourceFields.speed),
			rank: canonical.sourceFields.rank,
		};
	}

	const record = recordOrNull(snapshot);
	if (!record) return null;
	const name = stringOrNull(record.name);
	const hpMax = positiveOrNull(record.hpMax);
	const baseAc = finiteNumber(record.baseAc);
	const speed = positiveOrNull(record.speed);
	if (!name || hpMax === null || baseAc === null || speed === null) return null;
	return {
		name,
		hpMax,
		baseAc,
		speed,
		rank: stringOrNull(record.rank),
	};
}

function readStatOverrides(raw: unknown): Partial<CompanionBaseStats> {
	const record = recordOrNull(raw);
	if (!record) return {};
	const hpMax = positiveOrNull(record.hpMax);
	const baseAc = finiteNumber(record.baseAc);
	const speed = positiveOrNull(record.speed);
	return {
		...(hpMax !== null ? { hpMax } : {}),
		...(baseAc !== null ? { baseAc } : {}),
		...(speed !== null ? { speed } : {}),
	};
}

/**
 * Resolve effective creature stats from one stable living instance.
 *
 * Priority is deliberate:
 * 1. frozen source snapshot when present;
 * 2. live catalog only for explicitly legacy-live instances;
 * 3. versioned instance stat overrides;
 * 4. existing persisted projection fields (to preserve current sheets).
 *
 * A catalog edit therefore cannot silently rewrite a snapshot-backed companion.
 */
export function resolveCompanionEffectiveStats(
	instance: CompanionInstanceRecord,
	projection: CompanionStateProjection,
	liveCatalogFallback?: CompanionBaseStats | null,
): EffectiveCompanionStats | null {
	const snapshot = readCompanionSnapshotBaseStats(instance.source_snapshot);
	const mayUseLive = instance.source_policy === "legacy-live";
	const source =
		snapshot ?? (mayUseLive ? (liveCatalogFallback ?? null) : null);

	const projectedName =
		stringOrNull(projection.nickname) ?? stringOrNull(projection.name);
	const projectedHpMax = positiveOrNull(projection.hpMax);
	const projectedAc = finiteNumber(projection.baseAc);
	const projectedSpeed = positiveOrNull(projection.speed);
	const overrides = readStatOverrides(instance.stat_overrides);

	const name = projectedName ?? source?.name ?? "Companion";
	const hpMax = projectedHpMax ?? overrides.hpMax ?? source?.hpMax ?? null;
	const baseAc = projectedAc ?? overrides.baseAc ?? source?.baseAc ?? null;
	const speed = projectedSpeed ?? overrides.speed ?? source?.speed ?? null;
	if (hpMax === null || baseAc === null || speed === null) return null;

	const currentHp = Math.min(
		hpMax,
		Math.max(0, positiveOrNull(projection.currentHp) ?? hpMax),
	);
	return {
		instanceId: instance.id,
		name,
		currentHp,
		hpMax,
		baseAc,
		speed,
		rank: source?.rank ?? null,
		sourceId: instance.source_id,
		sourceRevision: instance.source_revision,
		sourcePolicy: instance.source_policy,
		profileVersion: instance.profile_version,
		usesLiveCatalogFallback:
			snapshot === null && mayUseLive && !!liveCatalogFallback,
	};
}

/** Stable identity, never source id/name, determines whether two rows are one creature. */
export function isSameLivingCompanion(
	left: Pick<CompanionInstanceRecord, "id"> | null | undefined,
	right: Pick<CompanionInstanceRecord, "id"> | null | undefined,
): boolean {
	return !!left && !!right && left.id === right.id;
}

export function indexCompanionInstances(
	instances: readonly CompanionInstanceRecord[],
): ReadonlyMap<string, CompanionInstanceRecord> {
	return new Map(instances.map((instance) => [instance.id, instance]));
}
