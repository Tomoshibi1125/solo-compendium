/**
 * Proficiency de-duplication utility (D&D Beyond Quickbuilder parity).
 *
 * D&D Beyond's character builder warns when a player's choices grant the
 * same proficiency twice (e.g. a Background skill matches a Job skill the
 * player picked). RA exposes this same UX during character creation —
 * `CharacterNew.handleCreate` runs each proficiency array through this
 * helper, persists only the unique values, and surfaces a toast listing
 * the duplicates so users know their selections overlapped.
 *
 * Pure function — no side effects, safe to test independently.
 */

export interface DedupeResult {
	/** Unique values, preserving the first-seen casing of each entry. */
	unique: string[];
	/** Entries that were dropped because an earlier match was already kept. */
	duplicates: string[];
}

/**
 * Deduplicate an array of proficiency strings case-insensitively while
 * preserving order and the original casing of the first occurrence.
 *
 * Empty / whitespace-only entries are ignored.
 */
export function dedupeProficiencies(
	values: ReadonlyArray<string>,
): DedupeResult {
	const seen = new Set<string>();
	const unique: string[] = [];
	const duplicates: string[] = [];

	for (const raw of values) {
		const key = (raw || "").trim().toLowerCase();
		if (!key) continue;
		if (seen.has(key)) {
			duplicates.push(raw);
		} else {
			seen.add(key);
			unique.push(raw);
		}
	}

	return { unique, duplicates };
}

/**
 * Compose a short, user-facing summary of duplicates suitable for a toast
 * description. Returns null when there are no duplicates so callers can
 * skip emitting the toast entirely.
 */
export function formatDuplicatesSummary(
	duplicates: ReadonlyArray<string>,
	maxPreview: number = 4,
): string | null {
	if (duplicates.length === 0) return null;
	const preview = duplicates.slice(0, maxPreview).join(", ");
	const ellipsis = duplicates.length > maxPreview ? ", …" : "";
	return `${preview}${ellipsis}`;
}
