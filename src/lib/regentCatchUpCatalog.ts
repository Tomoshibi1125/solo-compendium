/**
 * @deprecated These functions are no longer used. Regent catch-up no longer requires warden approval.
 * Players now select abilities directly from the canonical catalog just like job/path progression.
 * See: docs/deprecated/regent-catch-up-curation.md
 *
 * This file can be removed in a future cleanup pass.
 */

import { supabase } from "@/integrations/supabase/client";

export type RegentCatchUpKind = "powers" | "techniques" | "cantrips" | "spells";
export interface RegentCuratedOption {
	kind: RegentCatchUpKind;
	id: string;
}

/** Only the unlock owner and its campaign Wardens can read this RLS-protected list. */
export async function listRegentCuratedOptions(
	unlockId: string,
): Promise<RegentCuratedOption[]> {
	const { data, error } = await supabase
		.from("regent_catch_up_options" as never)
		.select("kind, canonical_id")
		.eq("unlock_id", unlockId);
	if (error) throw error;
	return (
		(data ?? []) as unknown as Array<{
			kind: RegentCatchUpKind;
			canonical_id: string;
		}>
	).map((row) => ({
		kind: row.kind,
		id: row.canonical_id,
	}));
}

/** Atomic Warden-only replacement; the database validates exact canonical IDs and owed tiers. */
export async function setRegentCuratedOptions(input: {
	unlockId: string;
	campaignId: string;
	options: RegentCuratedOption[];
}): Promise<number> {
	const rpc = supabase.rpc as unknown as (
		functionName: string,
		args: Record<string, unknown>,
	) => Promise<{ data: unknown; error: { message: string } | null }>;
	const { data, error } = await rpc("set_regent_catch_up_options", {
		p_unlock_id: input.unlockId,
		p_campaign_id: input.campaignId,
		p_options: input.options.map((option) => ({
			kind: option.kind,
			id: option.id,
		})),
	});
	if (error) throw new Error(error.message);
	if (typeof data !== "number")
		throw new Error("The Warden catalog was not confirmed by the server.");
	return data;
}
