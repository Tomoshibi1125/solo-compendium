/**
 * Anomaly combat-stat reconciliation for the Warden encounter builder.
 *
 * `listCanonicalEntries("anomalies")` returns provider-TRANSFORMED entries
 * (StaticCompendiumEntry): the combat numbers live at `armor_class` /
 * `hit_points_average` / `gate_rank` / `cr`, NOT the raw authored
 * `ac` / `hp` / `rank` / `stats.challenge_rating`. Reading only the raw shape
 * collapsed every anomaly to HP 1 / rank UNKNOWN / CR 1/2 / XP 100 and poisoned
 * the encounter difficulty math. This helper reads the transformed fields first
 * with raw-shape fallbacks, so both authored and provider-transformed entries
 * resolve to the same numbers.
 *
 * Pure module: no React, no Supabase, no DOM, no network.
 */
import { getCRXP } from "@/lib/experience";
import { numericCrToLabel } from "@/lib/monster5eTable";
import type { CompendiumAnomaly } from "@/types/compendium";

/** Gate-rank → fallback CR label when an anomaly carries no explicit CR. */
export const RANK_CR_MAP: Record<string, string> = {
	D: "1/2",
	C: "1",
	B: "4",
	A: "8",
	S: "15",
};

export interface ResolvedAnomalyStats {
	/** CR label, e.g. "1/2", "4". */
	cr: string;
	/** XP derived from the CR label. */
	xp: number;
	/** Gate rank ("D".."S") or null when unknown. */
	rank: string | null;
	/** Average hit points. */
	hp: number;
	/** Armor class. */
	ac: number;
}

const firstNumber = (...values: unknown[]): number | undefined =>
	values.find((v): v is number => typeof v === "number" && Number.isFinite(v));

const firstString = (...values: unknown[]): string | undefined =>
	values.find((v): v is string => typeof v === "string" && v.length > 0);

const withFallback = (value: number | undefined, fallback: number) =>
	value === undefined ? fallback : value;

/**
 * Reconcile an anomaly's combat stats regardless of shape (raw authored vs.
 * provider-transformed). Reads transformed fields first, then raw fallbacks.
 */
export function resolveAnomalyStats(
	anomaly: CompendiumAnomaly,
): ResolvedAnomalyStats {
	const rec = anomaly as unknown as Record<string, unknown>;

	const rank = firstString(rec.gate_rank, rec.rank) ?? null;

	const crCandidate = firstNumber(anomaly.stats?.challenge_rating);
	const crFromEntry =
		typeof rec.cr === "string" && /^\d+(\/\d+)?$/.test(rec.cr) ? rec.cr : null;
	const cr =
		crCandidate !== undefined
			? numericCrToLabel(crCandidate)
			: (crFromEntry ?? RANK_CR_MAP[rank || "D"] ?? "1");

	const hp = withFallback(
		firstNumber(rec.hit_points_average, rec.hp, rec.hit_points),
		1,
	);
	const ac = withFallback(firstNumber(rec.armor_class, rec.ac), 10);

	return { cr, xp: getCRXP(cr), rank, hp, ac };
}
