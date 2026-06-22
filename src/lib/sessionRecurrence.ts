/**
 * Session recurrence generator (F4 of May 2026 remediation plan).
 *
 * Closes the Session Planner 🟡 finding from
 * `docs/warden-tools-vtt-audit.md:62`. Pure functions — no DB, no
 * library dependency (RA only needs weekly / bi-weekly / monthly
 * patterns, no full RRULE).
 */

export type RecurrenceFrequency = "weekly" | "biweekly" | "monthly";

export interface RecurrenceRule {
	frequency: RecurrenceFrequency;
	/** Number of instances to generate, including the seed. Capped 1..52. */
	count: number;
}

/**
 * Parse a serialized recurrence rule from the DB column.
 *
 * Format: `FREQ=weekly;COUNT=8` — a subset of RFC 5545 we can hand-roll.
 * Returns `null` for unparseable / unknown frequency.
 */
export function parseRecurrenceRule(
	value: string | null | undefined,
): RecurrenceRule | null {
	if (!value) return null;
	const parts = value.split(";").map((p) => p.trim().toLowerCase());
	let frequency: RecurrenceFrequency | null = null;
	let count = 8;
	for (const part of parts) {
		const [k, v] = part.split("=").map((s) => s.trim());
		if (k === "freq") {
			if (v === "weekly" || v === "biweekly" || v === "monthly") {
				frequency = v;
			}
		} else if (k === "count") {
			const parsed = Number.parseInt(v, 10);
			if (Number.isFinite(parsed)) {
				count = Math.max(1, Math.min(52, parsed));
			}
		}
	}
	if (!frequency) return null;
	return { frequency, count: Math.max(1, Math.min(52, count)) };
}

export function serializeRecurrenceRule(rule: RecurrenceRule): string {
	return `FREQ=${rule.frequency};COUNT=${rule.count}`;
}

/**
 * Step the given date forward by one occurrence of the recurrence.
 */
export function stepRecurrence(
	current: Date,
	frequency: RecurrenceFrequency,
): Date {
	const next = new Date(current.getTime());
	switch (frequency) {
		case "weekly":
			next.setDate(next.getDate() + 7);
			break;
		case "biweekly":
			next.setDate(next.getDate() + 14);
			break;
		case "monthly":
			next.setMonth(next.getMonth() + 1);
			break;
		default:
			break;
	}
	return next;
}

/**
 * Generate the schedule (including the seed) for a recurrence rule
 * starting at `seed`.
 *
 * Returns an array of ISO date strings (UTC) — the consumer can
 * round-trip them through Date() if needed.
 */
export function generateRecurrenceSchedule(
	seed: Date,
	rule: RecurrenceRule,
): string[] {
	const out: string[] = [seed.toISOString()];
	let cursor = new Date(seed.getTime());
	for (let i = 1; i < rule.count; i++) {
		cursor = stepRecurrence(cursor, rule.frequency);
		out.push(cursor.toISOString());
	}
	return out;
}
