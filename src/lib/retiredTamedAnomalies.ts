/**
 * Character files exported before the tamed rosters retired (RA-9) carry
 * personal tames in `tamed_anomalies`. Each entry becomes a companion sheet
 * row (the `character_extras` shape) so it imports as the character's own
 * companion; the retired table accepts no new rows.
 */
import { resolveCanonicalReference } from "@/lib/canonicalCompendium";
import {
	type CanonicalCompanionSource,
	createCanonicalCompanionSource,
	parseCanonicalCompanionSource,
} from "@/lib/companions";

const recordOrNull = (value: unknown): Record<string, unknown> | null =>
	value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;

const trimmedOrNull = (value: unknown): string | null =>
	typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const finiteOrNull = (value: unknown): number | null => {
	const numeric = typeof value === "number" ? value : Number(value);
	return value !== null && value !== undefined && Number.isFinite(numeric)
		? numeric
		: null;
};

/** The species snapshot: the frozen acquisition snapshot, the catalog, or the row itself. */
async function speciesSnapshot(
	row: Record<string, unknown>,
	anomalyId: string,
): Promise<CanonicalCompanionSource> {
	const frozen = parseCanonicalCompanionSource(row.companion_source_snapshot);
	if (
		frozen?.provenance.canonicalType === "anomaly" &&
		frozen.provenance.canonicalId === anomalyId
	) {
		return frozen;
	}

	const { entry } = await resolveCanonicalReference("anomalies", {
		id: anomalyId,
	});
	if (entry) {
		const fields = entry as unknown as Record<string, unknown>;
		return createCanonicalCompanionSource({
			canonicalId: entry.id,
			canonicalType: "anomaly",
			canonicalCollection: "anomalies",
			entryType: trimmedOrNull(fields.creature_type),
			source: trimmedOrNull(fields.source),
			sourceBook: trimmedOrNull(fields.source_book),
			name: entry.name,
			hpMax: finiteOrNull(fields.hit_points_average) ?? 1,
			baseAc: finiteOrNull(fields.armor_class) ?? 10,
			speed: finiteOrNull(fields.speed_walk) ?? 30,
			rank: trimmedOrNull(fields.gate_rank),
		});
	}

	return createCanonicalCompanionSource({
		canonicalId: anomalyId,
		canonicalType: "anomaly",
		canonicalCollection: "anomalies",
		entryType: "anomaly",
		name: trimmedOrNull(row.nickname) ?? anomalyId,
		hpMax: Math.max(
			1,
			finiteOrNull(row.max_hp_override) ?? finiteOrNull(row.current_hp) ?? 1,
		),
		baseAc: 10,
		speed: 30,
		rank: null,
	});
}

/**
 * Convert retired `tamed_anomalies` entries into companion sheet rows. The
 * rows carry no id, owner, or instance id: the importing character owns the
 * companion, and the server gives it a new living identity and its scaled HP.
 */
export async function companionRowsFromRetiredTames(
	rows: unknown,
): Promise<Record<string, unknown>[]> {
	if (!Array.isArray(rows)) return [];
	const converted = await Promise.all(
		rows.map(async (value) => {
			const row = recordOrNull(value);
			const anomalyId = trimmedOrNull(row?.anomaly_id);
			if (!row || !anomalyId) return null;
			const snapshot = await speciesSnapshot(row, anomalyId);
			const hpMax =
				finiteOrNull(row.max_hp_override) ?? snapshot.sourceFields.hpMax;
			return {
				name: trimmedOrNull(row.nickname) ?? snapshot.sourceFields.name,
				extra_type: "companion",
				hp_current: finiteOrNull(row.current_hp) ?? hpMax,
				hp_max: hpMax,
				ac: snapshot.sourceFields.baseAc,
				speed: snapshot.sourceFields.speed,
				monster_id: null,
				npc_data: snapshot,
				abilities: [],
				equipment: [],
				conditions: Array.isArray(row.conditions) ? row.conditions : [],
				initiative: finiteOrNull(row.initiative),
				notes: trimmedOrNull(row.notes),
				is_active: row.is_summoned === true,
			} satisfies Record<string, unknown>;
		}),
	);
	return converted.filter(
		(row): row is NonNullable<(typeof converted)[number]> => row !== null,
	);
}
