/**
 * Misty Pearl H5 — In-world campaign calendar.
 *
 * Pure helpers for tracking the *in-world* date/time of a campaign,
 * decoupled from the real-world wall clock. Foundry equivalent: the
 * Simple Calendar + SmallTime community modules. We bake a minimal
 * version into the host instead of leaving it to a future module.
 *
 * RA theming: the System tracks the Bureau timeline in "Standard
 * Bureau Time" (24-hour clock, Gregorian-aligned calendar — RA canon
 * uses a near-modern Earth setting). Optional Rift-cycle pip (0–7)
 * tracks proximity to the next surge per `docs/rift-ascendant-world-lore.md`.
 *
 * Pure module: no React, no Supabase, no DOM.
 */

/** ISO-like in-world clock snapshot. */
export interface CampaignClock {
	/** ISO 8601 datetime string in UTC. */
	iso: string;
	/** Rift surge proximity pip (0–7 where 7 = imminent). Optional. */
	riftCyclePip?: number;
}

/** Rest blocks used by the time-advance helpers below. */
export type RestKind = "short" | "long" | "watch";

const REST_HOURS: Record<RestKind, number> = {
	short: 1,
	long: 8,
	watch: 2,
};

const DEFAULT_CLOCK: CampaignClock = {
	iso: "2026-01-01T08:00:00.000Z",
	riftCyclePip: 0,
};

/** Returns a CampaignClock with default values for any missing fields. */
export function normalizeCampaignClock(
	raw: Partial<CampaignClock> | null | undefined,
): CampaignClock {
	if (!raw) return { ...DEFAULT_CLOCK };
	const iso = typeof raw.iso === "string" ? raw.iso : DEFAULT_CLOCK.iso;
	const parsed = Date.parse(iso);
	const safeIso = Number.isFinite(parsed)
		? new Date(parsed).toISOString()
		: DEFAULT_CLOCK.iso;
	const pip =
		typeof raw.riftCyclePip === "number" && Number.isFinite(raw.riftCyclePip)
			? Math.max(0, Math.min(7, Math.round(raw.riftCyclePip)))
			: 0;
	return { iso: safeIso, riftCyclePip: pip };
}

/**
 * Advance the clock by an explicit number of hours and minutes. Pure
 * — returns a new clock without mutating the input.
 */
export function advanceClock(
	clock: CampaignClock,
	delta: { hours?: number; minutes?: number },
): CampaignClock {
	const base = normalizeCampaignClock(clock);
	const date = new Date(base.iso);
	const hours = Math.round(delta.hours ?? 0);
	const minutes = Math.round(delta.minutes ?? 0);
	date.setUTCHours(date.getUTCHours() + hours);
	date.setUTCMinutes(date.getUTCMinutes() + minutes);
	return { ...base, iso: date.toISOString() };
}

/**
 * Advance the clock by the duration of a rest block. The Rift cycle
 * pip ticks up on a long rest (one step per 8h), reflecting that gates
 * grow more unstable while the party recovers.
 */
export function advanceRest(
	clock: CampaignClock,
	kind: RestKind,
): CampaignClock {
	const hours = REST_HOURS[kind];
	const advanced = advanceClock(clock, { hours });
	if (kind === "long") {
		const nextPip = Math.min(7, (advanced.riftCyclePip ?? 0) + 1);
		return { ...advanced, riftCyclePip: nextPip };
	}
	return advanced;
}

/** Reset the Rift pip to 0 — typically called when a surge resolves. */
export function resetRiftCycle(clock: CampaignClock): CampaignClock {
	return { ...normalizeCampaignClock(clock), riftCyclePip: 0 };
}

/** Format the clock for display in the panel. */
export function formatClock(clock: CampaignClock): string {
	const normalized = normalizeCampaignClock(clock);
	const d = new Date(normalized.iso);
	return d.toLocaleString(undefined, {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "UTC",
	});
}

/**
 * Format the Rift cycle pip as a 7-step indicator. 0 = quiet, 7 =
 * surge imminent. Useful for the calendar panel's pip row.
 */
export function formatRiftCyclePip(clock: CampaignClock): string {
	const pip = normalizeCampaignClock(clock).riftCyclePip ?? 0;
	return Array.from({ length: 7 }, (_, i) => (i < pip ? "●" : "○")).join(" ");
}

/** Default exports for ergonomic imports. */
export const CAMPAIGN_CALENDAR_DEFAULTS = DEFAULT_CLOCK;
