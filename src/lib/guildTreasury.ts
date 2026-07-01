// Pure guild treasury + progression math (no app/DB deps) so it backs both the
// UI and the mutation guards from one tested source of truth.

import { AppError } from "@/lib/appError";
import type { RaCurrencyId } from "@/lib/currency";

/** Per-currency guild treasury balances (the `guilds.funds` JSONB shape). */
export type GuildFunds = Partial<Record<RaCurrencyId, number>>;

/** Current balance of one currency in the treasury. */
export const getFundsBalance = (
	funds: GuildFunds | null | undefined,
	currency: RaCurrencyId,
): number => Math.max(0, Math.trunc(funds?.[currency] ?? 0));

/**
 * Apply a signed delta to one currency (deposit > 0, withdraw/payout < 0).
 * Returns a NEW funds object; throws on a non-integer/zero amount or when a
 * withdrawal would overdraw the balance.
 */
export const applyFundsDelta = (
	funds: GuildFunds | null | undefined,
	currency: RaCurrencyId,
	delta: number,
): GuildFunds => {
	if (!Number.isFinite(delta) || !Number.isInteger(delta) || delta === 0) {
		throw new AppError("Enter a whole, non-zero amount.", "INVALID_INPUT");
	}
	const current = getFundsBalance(funds, currency);
	const next = current + delta;
	if (next < 0) {
		throw new AppError(
			"Insufficient guild funds for that withdrawal.",
			"INVALID_INPUT",
		);
	}
	return { ...(funds ?? {}), [currency]: next };
};

// --- Progression (Contribution Points → guild level → member cap) -----------

export const MAX_GUILD_LEVEL = 20;
/** Contribution points needed to advance one level. */
export const CONTRIBUTION_PER_LEVEL = 500;
const BASE_MEMBER_CAP = 5;
const MEMBER_CAP_PER_LEVEL = 3;

/** Guild level derived from cumulative contribution (clamped to MAX_GUILD_LEVEL). */
export const guildLevelForContribution = (contribution: number): number => {
	const c = Math.max(0, Math.trunc(contribution || 0));
	return Math.min(MAX_GUILD_LEVEL, 1 + Math.floor(c / CONTRIBUTION_PER_LEVEL));
};

/** Member cap for a guild level (level 1 = 5, +3 per level). */
export const memberCapForLevel = (level: number): number => {
	const lvl = Math.min(MAX_GUILD_LEVEL, Math.max(1, Math.trunc(level || 1)));
	return BASE_MEMBER_CAP + (lvl - 1) * MEMBER_CAP_PER_LEVEL;
};

/** Convenience: member cap straight from contribution. */
export const memberCapForContribution = (contribution: number): number =>
	memberCapForLevel(guildLevelForContribution(contribution));

/**
 * Progress within the current level: contribution into this level and the
 * amount required to reach the next (0 / required when already at max level).
 */
export const contributionProgress = (
	contribution: number,
): { into: number; required: number } => {
	const c = Math.max(0, Math.trunc(contribution || 0));
	if (guildLevelForContribution(c) >= MAX_GUILD_LEVEL) {
		return { into: 0, required: 0 };
	}
	return { into: c % CONTRIBUTION_PER_LEVEL, required: CONTRIBUTION_PER_LEVEL };
};
