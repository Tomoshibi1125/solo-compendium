import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

/**
 * Sourcebook access.
 *
 * Rift Ascendant is free: the paid sourcebook entitlement layer was retired
 * (migration 20260725000000) and its projection RPC, which read the dropped
 * tables and failed on every call, was removed (20260930100100). Every
 * sourcebook is accessible. These functions remain the single seam that
 * canonical lookups, pickers, and search call, so the "inaccessible" branch of
 * canonical reference resolution keeps one well-defined source of truth.
 */
export type SourcebookAccessContext = {
	campaignId?: string | null;
};

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function isSourcebookAccessible(
	_sourceBook: string | null | undefined,
	_context: SourcebookAccessContext = {},
): Promise<boolean> {
	return true;
}

export async function filterRowsBySourcebookAccess<T>(
	rows: T[],
	_getSourcebook: (row: T) => string | null | undefined,
	_context: SourcebookAccessContext = {},
): Promise<T[]> {
	return rows;
}

export async function getCharacterCampaignId(
	characterId: string,
): Promise<string | null> {
	if (!isSupabaseConfigured || !UUID_PATTERN.test(characterId)) {
		return null;
	}

	const { data, error } = await supabase
		.from("campaign_members")
		.select("campaign_id, joined_at")
		.eq("character_id", characterId)
		.order("joined_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (error) {
		logger.warn(
			"Failed to resolve campaign context for character sourcebook access:",
			error,
		);
		return null;
	}

	return data?.campaign_id ?? null;
}
