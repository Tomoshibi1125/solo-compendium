/**
 * Umbral energy — the Umbral Regent's summoning capacity pool.
 *
 * Umbral Legion members summoned by an Umbral Regent persist UNTIL DISMISSED
 * (not a duration), so capacity is gated by a pool rather than a timer. Each
 * summoned member occupies energy by its rank; the pool scales with level and
 * reaches full power (200) at level 20 — mirroring the DB
 * `calculate_shadow_energy_max` ladder. Energy is DERIVED from which members
 * are currently summoned (no separate persisted counter), so it can never drift.
 */

/** Max umbral energy (summoning capacity) at a given character level. */
export function umbralEnergyMax(level: number): number {
	if (!Number.isFinite(level) || level <= 4) return 10;
	if (level <= 8) return 25;
	if (level <= 12) return 50;
	if (level <= 16) return 100;
	return 200;
}

const RANK_COST: Record<string, number> = {
	S: 25,
	A: 15,
	B: 10,
	C: 6,
	D: 3,
	E: 1,
};

/** Energy a summoned Umbral Legion member of the given rank occupies. */
export function umbralEnergyCost(rank: string | null | undefined): number {
	return RANK_COST[String(rank ?? "").toUpperCase()] ?? 5;
}

/** Total energy occupied by a set of members' ranks (currently-summoned). */
export function umbralEnergyUsed(
	ranks: Array<string | null | undefined>,
): number {
	return ranks.reduce((sum, rank) => sum + umbralEnergyCost(rank), 0);
}
