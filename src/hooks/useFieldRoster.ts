/**
 * Misty Pearl E4 — Field Roster client hook.
 *
 * Reads from the `campaigns_public_listings` view exposed by migration
 * `20260528000100_add_campaign_public_listing.sql`. Anyone authenticated
 * (or anonymous) can list opt-in public campaigns; joining still flows
 * through the existing share-code redemption so the Warden retains
 * approval authority.
 */
import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export interface FieldRosterListing {
	id: string;
	name: string;
	share_code: string;
	description: string;
	system_tags: string[];
	seats_open: number;
	last_session_iso?: string;
	listed_at?: string;
	updated_at: string;
}

interface PublicListingPayload {
	enabled?: boolean;
	description?: unknown;
	system_tags?: unknown;
	seats_open?: unknown;
	last_session_iso?: unknown;
	listed_at?: unknown;
}

interface PublicListingRow {
	id: string;
	name: string;
	share_code: string;
	updated_at: string;
	public_listing: PublicListingPayload | null;
}

const asString = (v: unknown): string => (typeof v === "string" ? v : "");
const asStringArray = (v: unknown): string[] =>
	Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
const asInt = (v: unknown, fallback = 0): number =>
	typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.round(v)) : fallback;

function normalizeListing(row: PublicListingRow): FieldRosterListing {
	const p = row.public_listing ?? {};
	return {
		id: row.id,
		name: row.name,
		share_code: row.share_code,
		description: asString(p.description),
		system_tags: asStringArray(p.system_tags),
		seats_open: asInt(p.seats_open, 0),
		last_session_iso:
			typeof p.last_session_iso === "string" ? p.last_session_iso : undefined,
		listed_at: typeof p.listed_at === "string" ? p.listed_at : undefined,
		updated_at: row.updated_at,
	};
}

/**
 * Sort comparator used by the Field Roster UI. Listings with a more
 * recent `last_session_iso` rank first; ties fall back to listing
 * recency. Pure — exposed for tests.
 */
export function compareFieldRosterListings(
	a: FieldRosterListing,
	b: FieldRosterListing,
): number {
	const aIso = a.last_session_iso ?? a.listed_at ?? a.updated_at;
	const bIso = b.last_session_iso ?? b.listed_at ?? b.updated_at;
	return bIso.localeCompare(aIso);
}

export function useFieldRoster() {
	return useQuery({
		queryKey: ["field-roster", "v1"] as const,
		queryFn: async (): Promise<FieldRosterListing[]> => {
			if (!isSupabaseConfigured) return [];
			const { data, error } = await supabase
				// biome-ignore lint/suspicious/noExplicitAny: view not yet in generated types
				.from("campaigns_public_listings" as any)
				.select("id, name, share_code, public_listing, updated_at")
				.order("updated_at", { ascending: false })
				.limit(120);
			if (error) {
				// Pre-migration: 42P01 (relation does not exist) → empty list.
				if (
					(error as { code?: string }).code === "42P01" ||
					(error as { code?: string }).code === "PGRST205"
				) {
					return [];
				}
				throw error;
			}
			const rows = (data ?? []) as unknown as PublicListingRow[];
			return rows.map(normalizeListing).sort(compareFieldRosterListings);
		},
		staleTime: 60_000,
	});
}
