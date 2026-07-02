/**
 * useUserNotifications — server-backed in-app notification inbox.
 *
 * R6 of Round 2 remediation. Layered on top of the existing local-cache
 * `useNotifications` hook so the UI stays the same. When authenticated,
 * we pull from `public.user_notifications` and mirror into the local
 * cache (offline-first); when offline / guest, we fall back to the
 * cache exclusively.
 *
 * Production is centralized in the standalone `notify()` bridge
 * (`@/lib/notify`) — this hook is now a pure consumer (inbox reader +
 * mark-read). `markReadOnServer` calls the `mark_user_notification_read` RPC.
 *
 * Consumer entry point: returns the same shape as `useNotifications`
 * so `NotificationCenter.tsx` doesn't need to change.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import {
	loadNotifications,
	type Notification,
	type NotificationPriority,
	type NotificationType,
	saveNotifications,
} from "@/hooks/useNotifications";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { clientChannelName } from "@/lib/realtimeChannel";

const KEY = ["user_notifications"] as const;

interface ServerNotificationRow {
	id: string;
	user_id: string;
	type: string;
	priority: string;
	title: string;
	message: string | null;
	payload: Record<string, unknown>;
	category: string | null;
	link: string | null;
	read_at: string | null;
	created_at: string;
	expires_at: string | null;
}

const SERVER_TYPE_TO_LOCAL: Record<string, NotificationType> = {
	info: "info",
	success: "success",
	warning: "warning",
	error: "error",
	campaign_invite: "success",
	mention: "info",
	level_ready: "info",
	system: "info",
};

function rowToNotification(row: ServerNotificationRow): Notification {
	return {
		id: row.id,
		type:
			SERVER_TYPE_TO_LOCAL[row.type] ??
			(row.type as NotificationType) ??
			"info",
		priority: (row.priority as NotificationPriority) ?? "normal",
		title: row.title,
		message: row.message ?? undefined,
		read: row.read_at != null,
		createdAt: new Date(row.created_at).getTime(),
		expiresAt: row.expires_at ? new Date(row.expires_at).getTime() : undefined,
		category: row.category ?? row.type,
	};
}

/**
 * Read all server-backed notifications (most recent 100). Falls back to
 * the localStorage cache when Supabase isn't configured or the call
 * fails.
 */
async function fetchServerNotifications(): Promise<Notification[]> {
	if (!isSupabaseConfigured) return loadNotifications();
	try {
		const { data: authData } = await supabase.auth.getUser();
		if (!authData?.user) return loadNotifications();
		const { data, error } = await supabase
			.from("user_notifications")
			.select("*")
			.eq("user_id", authData.user.id)
			.order("created_at", { ascending: false })
			.limit(100);
		if (error) throw error;
		const rows = (data as unknown as ServerNotificationRow[]) || [];
		const list = rows.map(rowToNotification);
		// Mirror into local cache so the existing UI / offline path stays warm.
		saveNotifications(list);
		return list;
	} catch (err) {
		logger.warn("useUserNotifications: fetch failed, using local cache", err);
		return loadNotifications();
	}
}

export function useUserNotifications() {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: KEY,
		queryFn: fetchServerNotifications,
		// Refresh on focus so the bell updates when the user returns.
		refetchOnWindowFocus: true,
		// D4: Realtime (below) is the primary freshness signal; polling is now
		// only a slow reconnect fallback (5 min) instead of the old 60s churn.
		refetchInterval: 300_000,
		staleTime: 60_000,
	});

	// D4: Subscribe to the user's notification row changes via Supabase
	// Realtime so the inbox/bell updates instantly on INSERT/UPDATE, with
	// the slow poll above as a reconnect safety net.
	useEffect(() => {
		if (!isSupabaseConfigured) return;
		let cancelled = false;
		let channel: ReturnType<typeof supabase.channel> | null = null;
		(async () => {
			const { data } = await supabase.auth.getUser();
			const uid = data?.user?.id;
			if (!uid || cancelled) return;
			channel = supabase
				.channel(clientChannelName(`user_notifications:${uid}`))
				.on(
					"postgres_changes" as never,
					{
						event: "*",
						schema: "public",
						table: "user_notifications",
						filter: `user_id=eq.${uid}`,
					} as never,
					() => {
						queryClient.invalidateQueries({ queryKey: KEY });
					},
				)
				.subscribe();
		})();
		return () => {
			cancelled = true;
			if (channel) supabase.removeChannel(channel);
		};
	}, [queryClient]);

	const markReadMutation = useMutation({
		mutationFn: async (notificationId: string) => {
			if (!isSupabaseConfigured) return false;
			const { data, error } = await (
				supabase.rpc as unknown as (
					name: string,
					params: Record<string, unknown>,
				) => Promise<{ data: unknown; error: Error | null }>
			)("mark_user_notification_read", {
				p_notification_id: notificationId,
			});
			if (error) throw error;
			return data as boolean;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: KEY });
		},
	});

	const notifications = query.data ?? [];
	const unreadCount = useMemo(
		() => notifications.filter((n) => !n.read).length,
		[notifications],
	);

	const markReadOnServer = useCallback(
		(id: string) => markReadMutation.mutate(id),
		[markReadMutation],
	);

	return {
		notifications,
		unreadCount,
		isLoading: query.isLoading,
		markReadOnServer,
	};
}
