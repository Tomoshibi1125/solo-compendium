import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

/**
 * Warden-tunable VTT settings that mirror D&D Beyond Maps' "Game Settings"
 * panel. Every flag defaults to the most permissive value matching the
 * current product behavior so upgrading an existing campaign is a no-op.
 */
export interface VTTSettings {
	allowPlayerDraw: boolean;
	allowPlayerPing: boolean;
	allowPlayerPointer: boolean;
	allowPlayerMonsterInteract: boolean;
	allowPlayerFogBrush: boolean;
	wheelBehavior: "zoom" | "scroll";
}

export const DEFAULT_VTT_SETTINGS: VTTSettings = {
	allowPlayerDraw: true,
	allowPlayerPing: true,
	allowPlayerPointer: true,
	allowPlayerMonsterInteract: false,
	allowPlayerFogBrush: false,
	wheelBehavior: "zoom",
};

export type VTTSessionState = "started" | "paused" | "ended";

export interface VTTSessionStatus {
	state: VTTSessionState;
	updated_at: string | null;
	updated_by: string | null;
	message: string | null;
}

export const DEFAULT_VTT_SESSION_STATUS: VTTSessionStatus = {
	state: "started",
	updated_at: null,
	updated_by: null,
	message: null,
};

interface CampaignVTTRow {
	vtt_settings: Partial<VTTSettings> | null;
	vtt_session_status: Partial<VTTSessionStatus> | null;
}

function normalizeSettings(raw: Partial<VTTSettings> | null): VTTSettings {
	return { ...DEFAULT_VTT_SETTINGS, ...(raw ?? {}) };
}

function normalizeSessionStatus(
	raw: Partial<VTTSessionStatus> | null,
): VTTSessionStatus {
	return {
		...DEFAULT_VTT_SESSION_STATUS,
		...(raw ?? {}),
	};
}

/**
 * Load + mutate VTT game settings and session status for a campaign.
 *
 * Degrades gracefully when Supabase isn't configured or the migration hasn't
 * run yet: returns defaults and silently ignores mutations.
 */
export function useVTTSettings(campaignId: string | null | undefined) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const queryKey = ["campaign-vtt-settings", campaignId] as const;

	const query = useQuery({
		queryKey,
		queryFn: async () => {
			if (!campaignId || !isSupabaseConfigured) {
				return {
					settings: DEFAULT_VTT_SETTINGS,
					sessionStatus: DEFAULT_VTT_SESSION_STATUS,
				};
			}
			const { data, error } = await supabase
				.from("campaigns")
				.select("vtt_settings, vtt_session_status")
				.eq("id", campaignId)
				.maybeSingle();
			if (error) {
				// If the columns don't exist yet (pre-migration), fall back.
				if (error.code === "42703" || error.code === "PGRST204") {
					return {
						settings: DEFAULT_VTT_SETTINGS,
						sessionStatus: DEFAULT_VTT_SESSION_STATUS,
					};
				}
				throw error;
			}
			const row = data as CampaignVTTRow | null;
			return {
				settings: normalizeSettings(row?.vtt_settings ?? null),
				sessionStatus: normalizeSessionStatus(row?.vtt_session_status ?? null),
			};
		},
		enabled: !!campaignId,
		staleTime: 30_000,
	});

	const updateSettings = useMutation({
		mutationFn: async (next: Partial<VTTSettings>) => {
			if (!campaignId || !isSupabaseConfigured) return next;
			const current = query.data?.settings ?? DEFAULT_VTT_SETTINGS;
			const merged = { ...current, ...next };
			// Generated Supabase types trail the migration that adds these
			// columns; cast through unknown until types are regenerated.
			const payload = { vtt_settings: merged } as unknown as Record<
				string,
				unknown
			>;
			const { error } = await supabase
				.from("campaigns")
				.update(payload)
				.eq("id", campaignId);
			if (error) throw error;
			return merged;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (err) => {
			toast({
				title: "Couldn't update VTT settings",
				description: err instanceof Error ? err.message : "Unknown error",
				variant: "destructive",
			});
		},
	});

	const updateSessionStatus = useMutation({
		mutationFn: async (next: {
			state: VTTSessionState;
			message?: string | null;
			userId?: string;
		}) => {
			if (!campaignId || !isSupabaseConfigured) return next;
			const nextStatus: VTTSessionStatus = {
				state: next.state,
				message: next.message ?? null,
				updated_at: new Date().toISOString(),
				updated_by: next.userId ?? null,
			};
			// Generated Supabase types trail the migration that adds these
			// columns; cast through unknown until types are regenerated.
			const payload = {
				vtt_session_status: nextStatus,
			} as unknown as Record<string, unknown>;
			const { error } = await supabase
				.from("campaigns")
				.update(payload)
				.eq("id", campaignId);
			if (error) throw error;
			return nextStatus;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		onError: (err) => {
			toast({
				title: "Couldn't update session status",
				description: err instanceof Error ? err.message : "Unknown error",
				variant: "destructive",
			});
		},
	});

	const setSettings = useCallback(
		(next: Partial<VTTSettings>) => updateSettings.mutate(next),
		[updateSettings],
	);
	const setSessionState = useCallback(
		(state: VTTSessionState, message?: string | null, userId?: string) => {
			updateSessionStatus.mutate({ state, message, userId });
		},
		[updateSessionStatus],
	);

	return {
		settings: query.data?.settings ?? DEFAULT_VTT_SETTINGS,
		sessionStatus: query.data?.sessionStatus ?? DEFAULT_VTT_SESSION_STATUS,
		isLoading: query.isLoading,
		error: query.error,
		setSettings,
		setSessionState,
	} as const;
}
