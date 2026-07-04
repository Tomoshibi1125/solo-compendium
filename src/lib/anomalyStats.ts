/**
 * Anomaly stat-block reconciliation for the Warden encounter builder.
 *
 * `listCanonicalEntries("anomalies")` returns provider-TRANSFORMED entries
 * (StaticCompendiumEntry): the combat numbers live at `armor_class` /
 * `hit_points_average` / `gate_rank` / `cr`, the creature type at
 * `creature_type`, and the ability scores + saving throws at the TOP level
 * (`str`/`agi`/… and `saving_throws`) — NOT the raw authored `ac` / `hp` /
 * `rank` / `type` / `stats.challenge_rating` / `stats.ability_scores`. Reading
 * only the raw shape collapsed every anomaly to HP 1 / rank UNKNOWN / CR 1/2 /
 * XP 100, creature type "Unknown", and every ability defaulted to 10 — which
 * poisoned the encounter difficulty math and the displayed stat block. This
 * helper reads the transformed fields first with raw-shape fallbacks, so both
 * authored and provider-transformed entries resolve to the same values.
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

export interface ResolvedAnomalyAbilities {
	str: number;
	agi: number;
	vit: number;
	int: number;
	sense: number;
	pre: number;
}

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
	/** Creature type label, e.g. "Dragon"; "Unknown" when absent. */
	creatureType: string;
	/** Ability scores (default 10 each). */
	abilities: ResolvedAnomalyAbilities;
	/** Saving-throw bonus map, or null when absent. */
	savingThrows: Record<string, number> | null;
}

const firstNumber = (...values: unknown[]): number | undefined =>
	values.find((v): v is number => typeof v === "number" && Number.isFinite(v));

const firstString = (...values: unknown[]): string | undefined =>
	values.find((v): v is string => typeof v === "string" && v.length > 0);

const withFallback = (value: number | undefined, fallback: number) =>
	value === undefined ? fallback : value;

const asNumberRecord = (value: unknown): Record<string, number> | null => {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const entries = Object.entries(value as Record<string, unknown>).filter(
		([, v]) => typeof v === "number" && Number.isFinite(v),
	);
	return entries.length > 0
		? (Object.fromEntries(entries) as Record<string, number>)
		: null;
};

/**
 * Reconcile an anomaly's stat block regardless of shape (raw authored vs.
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

	const creatureType =
		firstString(rec.creature_type, anomaly.type) ?? "Unknown";

	const scores = anomaly.stats?.ability_scores ?? {};
	const abilities: ResolvedAnomalyAbilities = {
		str: withFallback(firstNumber(rec.str, scores.strength), 10),
		agi: withFallback(firstNumber(rec.agi, scores.agility), 10),
		vit: withFallback(firstNumber(rec.vit, scores.vitality), 10),
		int: withFallback(firstNumber(rec.int, scores.intelligence), 10),
		sense: withFallback(firstNumber(rec.sense, scores.sense), 10),
		pre: withFallback(firstNumber(rec.pre, scores.presence), 10),
	};

	const savingThrows =
		asNumberRecord(rec.saving_throws) ?? anomaly.stats?.saving_throws ?? null;

	return {
		cr,
		xp: getCRXP(cr),
		rank,
		hp,
		ac,
		creatureType,
		abilities,
		savingThrows,
	};
}
