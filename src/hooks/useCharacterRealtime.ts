import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { clientChannelName } from "@/lib/realtimeChannel";

/**
 * Live-sync a character's core row (HP, conditions, exhaustion, derived-stat
 * caches) across clients. When a player takes damage or gains a condition, a
 * DM (or party member) viewing that shared sheet sees it update without a
 * manual refresh — DDB parity for "the DM can access the player's sheet".
 *
 * Subscribes to `postgres_changes` UPDATE on the `characters` row and
 * invalidates the sheet query. Realtime respects RLS, so a viewer only receives
 * changes to characters they're allowed to read. No-op for guest/local
 * characters and when disabled (e.g. a solo sheet outside any campaign).
 */
export function useCharacterRealtime(
	characterId: string | null | undefined,
	enabled: boolean,
) {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!enabled || !characterId || !isSupabaseConfigured) return;

		const channel = supabase
			.channel(clientChannelName(`character-sync:${characterId}`))
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "characters",
					filter: `id=eq.${characterId}`,
				},
				() => {
					// Refetch the sheet + roster views. Idempotent: the owner's own
					// edits already invalidate these, so a self-triggered event just
					// re-confirms current data.
					queryClient.invalidateQueries({
						queryKey: ["character", characterId],
					});
					queryClient.invalidateQueries({ queryKey: ["characters"] });
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [characterId, enabled, queryClient]);
}
