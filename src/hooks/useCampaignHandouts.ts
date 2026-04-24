import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";

export interface HandoutEntry {
	id: string;
	title: string;
	content: string;
	visibleToPlayers: boolean;
	category: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Guest-aware: returns true when Supabase isn't configured OR when the
 * user is signed out. The sandbox injector writes handouts to
 * localStorage in both cases, so the reader must fall through.
 */
const isLocalMode = async (): Promise<boolean> => {
	if (!isSupabaseConfigured) return true;
	const { data } = await supabase.auth.getUser();
	return !data.user;
};

const JOURNAL_CATEGORIES = ["session", "note", "lore", "handout"] as const;
const toJournalCategory = (value: Json): string => {
	return (JOURNAL_CATEGORIES as readonly string[]).includes(String(value))
		? String(value)
		: "note";
};

const readLocalJournals = (campaignId: string): HandoutEntry[] => {
	const saved = localStorage.getItem(`vtt-journal-${campaignId}`);
	if (!saved) return [];
	try {
		return JSON.parse(saved) as HandoutEntry[];
	} catch {
		return [];
	}
};

const writeLocalJournals = (campaignId: string, entries: HandoutEntry[]) => {
	localStorage.setItem(`vtt-journal-${campaignId}`, JSON.stringify(entries));
};

/**
 * Reactive hook for campaign handouts — uses `useQuery` so that
 * `queryClient.invalidateQueries({ queryKey: ["vtt_journal_entries", campaignId] })`
 * from the sandbox injector triggers an automatic refetch.
 */
export const useCampaignHandouts = (campaignId: string | null) => {
	const { loading } = useAuth();

	const { data: entries = [], isLoading } = useQuery({
		queryKey: ["vtt_journal_entries", campaignId],
		queryFn: async (): Promise<HandoutEntry[]> => {
			if (!campaignId) return [];

			if (await isLocalMode()) {
				return readLocalJournals(campaignId);
			}

			const { data, error } = await supabase
				.from("vtt_journal_entries")
				.select(
					"id, title, content, category, visible_to_players, created_at, updated_at",
				)
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("[useCampaignHandouts] Query error:", error);
				// Fall back to local cache
				return readLocalJournals(campaignId);
			}

			const mapped = (data || []).map((row) => ({
				id: row.id,
				title: row.title,
				content: row.content ?? "",
				category: toJournalCategory(row.category),
				visibleToPlayers: !!row.visible_to_players,
				createdAt: row.created_at,
				updatedAt: row.updated_at,
			}));

			// Mirror to localStorage for offline fallback
			writeLocalJournals(campaignId, mapped);
			return mapped;
		},
		enabled: !!campaignId && !loading,
		staleTime: 30_000, // 30s — refetches on invalidation or tab focus
	});

	return { entries, isLoading };
};
