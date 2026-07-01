/**
 * Full-text search utilities
 * Converts search queries to PostgreSQL full-text search format
 */

import { normalizeRegentSearch } from "@/lib/vernacular";

/**
 * Prepare search text for PostgreSQL tsquery
 * Sanitizes input and converts to safe format
 */
export function normalizeSearchText(searchQuery: string): string {
	if (!searchQuery.trim()) return "";

	// Remove special characters that could break tsquery
	// Keep alphanumeric and spaces
	const cleaned = searchQuery
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\s]/g, " ") // Remove special chars
		.replace(/\s+/g, " ") // Normalize whitespace
		.trim();

	return normalizeRegentSearch(cleaned);
}

/**
 * Hybrid search: real Postgres full-text search for longer queries,
 * ILIKE for short queries (1-2 chars) and as a fallback.
 *
 * D1: For queries ≥ 3 chars we use PostgREST's `.textSearch()` with the
 * `websearch` parser (`websearch_to_tsquery`) on the primary text field
 * — Postgres applies `to_tsvector` automatically, so no tsvector column
 * is required and ranking/stemming work out of the box. If the supplied
 * query builder doesn't expose `.textSearch` (e.g. a stubbed/offline
 * client), we transparently fall back to ILIKE so callers never break.
 */
interface OrCapableQuery<T> {
	or: (filters: string) => T;
}

interface TextSearchCapableQuery<T> {
	textSearch: (
		column: string,
		query: string,
		options?: { type?: "plain" | "phrase" | "websearch"; config?: string },
	) => T;
}

export function hybridSearchQuery<T extends OrCapableQuery<T>>(
	baseQuery: T,
	searchQuery: string,
	searchFields: string[] = ["name", "description"],
	useFullText: boolean = true,
): T {
	if (!searchQuery.trim()) {
		return baseQuery;
	}

	const ilike = () =>
		baseQuery.or(
			searchFields.map((field) => `${field}.ilike.%${searchQuery}%`).join(","),
		);

	// Short queries: ILIKE prefix matching beats stemmed FTS.
	if (searchQuery.length <= 2 || !useFullText) {
		return ilike();
	}

	// Longer queries: prefer real Postgres FTS via websearch_to_tsquery on
	// the primary field. Feature-detect textSearch so offline/guest stubs
	// fall back gracefully.
	const maybeFts = baseQuery as unknown as Partial<TextSearchCapableQuery<T>>;
	if (typeof maybeFts.textSearch === "function") {
		const primaryField = searchFields[0] ?? "name";
		const cleaned = normalizeSearchText(searchQuery);
		if (!cleaned) return ilike();
		return maybeFts.textSearch(primaryField, cleaned, {
			type: "websearch",
		});
	}

	// No FTS support on this builder — ILIKE fallback.
	return ilike();
}
