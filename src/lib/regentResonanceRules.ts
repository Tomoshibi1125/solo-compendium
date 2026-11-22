/**
 * Regent Resonance and known-ability tables (RA-1 and RA-6 in
 * docs/canon/rift-ascendant-canon-locks.md).
 *
 * Dependency-free so the guest store and the Supabase-backed Resonance hooks
 * share one copy. The server mirrors the Resonance table in
 * `app_private.regent_resonance_max`; the canon parity test compares them.
 */

/** Resonance maximum at character levels 1–20. */
export const REGENT_RESONANCE_MAX = [
	1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8,
] as const;

/** Martial and half-caster Regents: known Powers, and separately Techniques. */
export const REGENT_ABILITY_KNOWN_BY_LEVEL = [
	2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8,
] as const;

const levelIndex = (level: number): number =>
	Math.min(20, Math.max(1, Math.floor(level))) - 1;

export function getRegentAbilityKnownCount(level: number): number {
	return REGENT_ABILITY_KNOWN_BY_LEVEL[levelIndex(level)];
}

export function getRegentResonanceMax(level: number): number {
	return REGENT_RESONANCE_MAX[levelIndex(level)];
}

/** Tier 5 costs 1, tiers 6–7 cost 2, tiers 8–9 cost 3; other tiers never spend. */
export function getRegentResonanceCost(tier: number): number | null {
	if (!Number.isInteger(tier) || tier < 5 || tier > 9) return null;
	return tier === 5 ? 1 : tier <= 7 ? 2 : 3;
}
