import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import { enqueueOfflineSync } from "@/lib/offlineSync";
import { useOptimisticMutation } from "@/lib/optimisticUpdates";

export type CampaignSessionStatus =
	| "planned"
	| "in_progress"
	| "completed"
	| "cancelled";
export type CampaignSessionLogType =
	| "session"
	| "recap"
	| "loot"
	| "event"
	| "note";

export interface CampaignSessionRecord {
	id: string;
	campaign_id: string;
	title: string;
	description: string | null;
	scheduled_for: string | null;
	status: CampaignSessionStatus;
	location: string | null;
	created_by: string | null;
	created_at: string;
	updated_at: string;
}

export interface CampaignSessionLogRecord {
	id: string;
	campaign_id: string;
	session_id: string | null;
	author_id: string;
	log_type: CampaignSessionLogType;
	title: string;
	content: string;
	metadata: Record<string, unknown>;
	is_player_visible: boolean;
	created_at: string;
	updated_at: string;
}

type UpsertSessionInput = {
	campaignId: string;
	sessionId?: string | null;
	title?: string | null;
	description?: string | null;
	scheduledFor?: string | null;
	status?: CampaignSessionStatus | null;
	location?: string | null;
};

type CreateSessionLogInput = {
	campaignId: string;
	sessionId?: string | null;
	logType?: CampaignSessionLogType;
	title: string;
	content: string;
	metadata?: Record<string, unknown>;
	isPlayerVisible?: boolean;
};

// Supabase client natively extended to support campaign sessions
const KEY = ["campaigns", "sessions"] as const;
const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

const isOfflineError = (error: unknown): boolean => {
	const message =
		typeof error === "object" && error && "message" in error
			? String((error as { message?: unknown }).message ?? "")
			: "";
	const normalized = message.toLowerCase();
	return (
		(typeof navigator !== "undefined" && !navigator.onLine) ||
		normalized.includes("failed to fetch") ||
		normalized.includes("network") ||
		normalized.includes("timeout")
	);
};

const ensureAuthenticatedUser = async (): Promise<{ id: string }> => {
	const { data } = await supabase.auth.getUser();
	if (!data.user) {
		throw new AppError("Not authenticated", "AUTH_REQUIRED");
	}
	return data.user;
};

export const useCampaignSessions = (campaignId: string) => {
	return useQuery({
		queryKey: [...KEY, campaignId],
		queryFn: async (): Promise<CampaignSessionRecord[]> => {
			if (!isSupabaseConfigured || !campaignId) return [];

			const { data } = await supabase.auth.getUser();
			if (!data.user) {
				if (guestEnabled) return [];
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			const { data: rows, error } = await supabase
				.from("campaign_sessions")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("scheduled_for", { ascending: false });

			if (error) throw error;
			return (rows || []) as CampaignSessionRecord[];
		},
		enabled: !!campaignId,
	});
};

export const useCampaignSessionLogs = (
	campaignId: string,
	sessionId?: string | null,
) => {
	return useQuery({
		queryKey: [...KEY, campaignId, "logs", sessionId ?? "all"],
		queryFn: async (): Promise<CampaignSessionLogRecord[]> => {
			if (!isSupabaseConfigured || !campaignId) return [];

			const { data } = await supabase.auth.getUser();
			if (!data.user) {
				if (guestEnabled) return [];
				throw new AppError("Not authenticated", "AUTH_REQUIRED");
			}

			let query = supabase
				.from("campaign_session_logs")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false });

			if (sessionId) {
				query = query.eq("session_id", sessionId);
			}

			const { data: rows, error } = await query;
			if (error) throw error;
			return (rows || []) as any as CampaignSessionLogRecord[];
		},
		enabled: !!campaignId,
	});
};

export const useUpsertCampaignSession = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useOptimisticMutation<
		{ queued: boolean; sessionId: string | null },
		UpsertSessionInput,
		{ previousData: CampaignSessionRecord[] | undefined; mutationKey: any }
	>(
		(variables) => [...KEY, variables.campaignId],
		async (input: UpsertSessionInput) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			await ensureAuthenticatedUser();

			const { data, error } = await supabase.rpc("upsert_campaign_session", {
				p_campaign_id: input.campaignId,
				p_session_id: input.sessionId ?? undefined,
				p_title: input.title ?? undefined,
				p_description: input.description ?? undefined,
				p_scheduled_for: input.scheduledFor ?? undefined,
				p_status: input.status ?? undefined,
				p_location: input.location ?? undefined,
			} as any);

			if (error) throw error;
			return {
				queued: false,
				sessionId: (data as string) ?? null,
			};
		},
		// Optimistic calculation
		(oldData: CampaignSessionRecord[] | undefined, input) => {
			if (!oldData) return oldData;

			const sessionIndex = oldData.findIndex((s) => s.id === input.sessionId);
			const newSession: CampaignSessionRecord = {
				id: input.sessionId || `temp-${Date.now()}`,
				campaign_id: input.campaignId,
				title: input.title || "New Session",
				description: input.description || null,
				scheduled_for: input.scheduledFor || null,
				status: input.status || "planned",
				location: input.location || null,
				created_by: "local-user", // Will be overwritten by DB
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			if (sessionIndex >= 0) {
				// Update existing loosely
				const updatedQueue = [...oldData];
				updatedQueue[sessionIndex] = {
					...updatedQueue[sessionIndex],
					...newSession,
				};
				return updatedQueue;
			} else {
				// Prepend new session loosely
				return [newSession, ...oldData];
			}
		},
		(input) => {
			enqueueOfflineSync(
				"campaign_session",
				input.sessionId ? "update" : "create",
				{
					mode: "session",
					campaign_id: input.campaignId,
					session_id: input.sessionId ?? null,
					title: input.title ?? null,
					description: input.description ?? null,
					scheduled_for: input.scheduledFor ?? null,
					status: input.status ?? null,
					location: input.location ?? null,
				},
			);
		},
	);
};

export const useDeleteCampaignSession = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useOptimisticMutation<
		{ queued: boolean },
		{ campaignId: string; sessionId: string },
		{ previousData: CampaignSessionRecord[] | undefined; mutationKey: any }
	>(
		(variables) => [...KEY, variables.campaignId],
		async ({
			campaignId,
			sessionId,
		}: {
			campaignId: string;
			sessionId: string;
		}) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			await ensureAuthenticatedUser();

			const { error } = await supabase
				.from("campaign_sessions")
				.delete()
				.eq("id", sessionId);
			if (error) throw error;
			return { queued: false };
		},
		(oldData: CampaignSessionRecord[] | undefined, { sessionId }) => {
			if (!oldData) return oldData;
			return oldData.filter((s) => s.id !== sessionId);
		},
		(variables) => {
			enqueueOfflineSync("campaign_session", "delete", {
				mode: "session",
				campaign_id: variables.campaignId,
				session_id: variables.sessionId,
			});
		},
	);
};

export const useAddCampaignSessionLog = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useOptimisticMutation<
		{ queued: boolean; logId: string | null },
		CreateSessionLogInput,
		{ previousData: CampaignSessionLogRecord[] | undefined; mutationKey: any }
	>(
		(variables) => [
			...KEY,
			variables.campaignId,
			"logs",
			variables.sessionId ?? "all",
		],
		async (input: CreateSessionLogInput) => {
			if (!isSupabaseConfigured) {
				throw new AppError("Supabase not configured", "CONFIG");
			}
			await ensureAuthenticatedUser();

			const { data, error } = await supabase.rpc("add_campaign_session_log", {
				p_campaign_id: input.campaignId,
				p_session_id: input.sessionId ?? undefined,
				p_log_type: input.logType ?? "session",
				p_title: input.title,
				p_content: input.content,
				p_metadata: (input.metadata as any) ?? {},
				p_is_player_visible: input.isPlayerVisible ?? true,
			} as any);

			if (error) throw error;
			return {
				queued: false,
				logId: (data as string) ?? null,
			};
		},
		// Optimistic Calculation
		(oldData: CampaignSessionLogRecord[] | undefined, input) => {
			if (!oldData) return oldData;
			const newLog: CampaignSessionLogRecord = {
				id: `temp-${Date.now()}`,
				campaign_id: input.campaignId,
				session_id: input.sessionId ?? null,
				author_id: "local-user", // DB overwrites this
				log_type: input.logType ?? "session",
				title: input.title,
				content: input.content,
				metadata: input.metadata ?? {},
				is_player_visible: input.isPlayerVisible ?? true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			// Prepend to top
			return [newLog, ...oldData];
		},
		(input) => {
			enqueueOfflineSync("campaign_session", "create", {
				mode: "log",
				campaign_id: input.campaignId,
				session_id: input.sessionId ?? null,
				log_type: input.logType ?? "session",
				title: input.title,
				content: input.content,
				metadata: input.metadata ?? {},
				is_player_visible: input.isPlayerVisible ?? true,
			});
		},
	);
};
