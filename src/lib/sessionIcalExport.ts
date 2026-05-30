/**
 * Misty Pearl E2 — iCal export for campaign sessions.
 *
 * Produces an RFC 5545 VCALENDAR blob from `CampaignSession` rows so
 * Wardens and Ascendants can subscribe to a campaign's schedule from
 * Google Calendar / Apple Calendar / Outlook. Pairs with the recurring
 * session work in `sessionRecurrence.ts` — recurring seed rows produce
 * a single VEVENT with an RRULE, and we suppress the per-occurrence
 * child rows so the calendar shows one repeating series instead of N
 * duplicates.
 *
 * Pure module: no React, no Supabase, no DOM. Side-effect-free.
 */
import { createEvents, type EventAttributes } from "ics";
import {
	parseRecurrenceRule,
	type RecurrenceFrequency,
} from "@/lib/sessionRecurrence";

/**
 * Subset of `CampaignSessionRecord` we actually need to emit a VEVENT.
 * Mirrors the row shape from `useCampaignSessions.ts` without coupling
 * to the hook's import graph.
 */
export interface IcalSessionInput {
	id: string;
	title: string;
	description: string | null;
	scheduled_for: string | null;
	location: string | null;
	/** Seed rows carry a recurrence rule like "FREQ=weekly;COUNT=8". */
	recurrence_rule?: string | null;
	/** Child occurrences link back to their seed. We skip these. */
	recurrence_parent_id?: string | null;
}

export interface BuildIcsOptions {
	/** Campaign name, used as the calendar name. */
	campaignName: string;
	/**
	 * Default duration in hours when a session has no explicit end.
	 * Defaults to 4 — reasonable for a typical TTRPG session.
	 */
	defaultDurationHours?: number;
}

/**
 * Convert an RA-format recurrence frequency ("weekly" | "biweekly" |
 * "monthly") into an RFC 5545 RRULE fragment.
 */
function toRfc5545Freq(freq: RecurrenceFrequency): string {
	switch (freq) {
		case "weekly":
			return "FREQ=WEEKLY";
		case "biweekly":
			// RFC 5545 has no BIWEEKLY — express as WEEKLY with INTERVAL=2.
			return "FREQ=WEEKLY;INTERVAL=2";
		case "monthly":
			return "FREQ=MONTHLY";
		default:
			return "FREQ=WEEKLY";
	}
}

/**
 * Convert an ISO datetime string into the [Y, M, D, h, m] tuple shape
 * `ics` expects. Months are 1-indexed in the ics API.
 */
function isoToDateArray(iso: string): [number, number, number, number, number] {
	const d = new Date(iso);
	return [
		d.getUTCFullYear(),
		d.getUTCMonth() + 1,
		d.getUTCDate(),
		d.getUTCHours(),
		d.getUTCMinutes(),
	];
}

/**
 * Build the RFC 5545 string for a campaign's sessions. Returns the
 * `.ics` text body ready to write to a Blob and download.
 *
 * Throws on `createEvents` failure — the consumer should toast and let
 * the user retry. Unscheduled sessions (`scheduled_for === null`) are
 * silently skipped because a VEVENT requires DTSTART.
 *
 * Recurring children (rows with `recurrence_parent_id`) are dropped so
 * the calendar shows one VEVENT per series, not N. The seed row's
 * `recurrence_rule` becomes the RRULE on its VEVENT.
 */
export function buildIcsForCampaignSessions(
	sessions: IcalSessionInput[],
	options: BuildIcsOptions,
): string {
	const defaultHours = Math.max(
		0.5,
		Math.min(24, options.defaultDurationHours ?? 4),
	);

	const events: EventAttributes[] = [];
	for (const session of sessions) {
		// Skip recurring children — the seed VEVENT covers them via RRULE.
		if (session.recurrence_parent_id) continue;
		if (!session.scheduled_for) continue;

		const start = isoToDateArray(session.scheduled_for);
		const event: EventAttributes = {
			uid: `session-${session.id}@rift-ascendant`,
			start,
			startInputType: "utc",
			startOutputType: "utc",
			duration: { hours: Math.floor(defaultHours), minutes: 0 },
			title: session.title,
			description: session.description ?? undefined,
			location: session.location ?? undefined,
			calName: options.campaignName,
			productId: "rift-ascendant/misty-pearl",
			categories: ["Rift Ascendant", "Session"],
		};

		const recurrence = parseRecurrenceRule(session.recurrence_rule ?? null);
		if (recurrence) {
			event.recurrenceRule = `${toRfc5545Freq(recurrence.frequency)};COUNT=${recurrence.count}`;
		}

		events.push(event);
	}

	if (events.length === 0) {
		// Emit a valid but empty calendar so the user gets a usable file
		// rather than an error — Google/Apple/Outlook accept empty
		// calendars and the user can re-export once sessions are added.
		return [
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//rift-ascendant//misty-pearl//EN",
			`X-WR-CALNAME:${options.campaignName}`,
			"END:VCALENDAR",
			"",
		].join("\r\n");
	}

	const result = createEvents(events, {
		productId: "rift-ascendant/misty-pearl",
		calName: options.campaignName,
		method: "PUBLISH",
	});

	if (result.error || !result.value) {
		throw result.error ?? new Error("Failed to build iCal blob.");
	}
	return result.value;
}

/**
 * Trigger a browser download for the given iCal text under
 * `${slug}.ics`. Pure DOM — no React, safe to call from any click
 * handler. Returns void.
 */
export function downloadIcsBlob(icsText: string, slug: string): void {
	if (typeof window === "undefined") return;
	const safeSlug =
		slug
			.replace(/[^a-z0-9-_]+/gi, "-")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "")
			.toLowerCase() || "campaign";
	const blob = new Blob([icsText], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${safeSlug}.ics`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
