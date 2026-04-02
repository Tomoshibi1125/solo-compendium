import { useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

export type BroadcastTheme =
	| "system"
	| "warden"
	| "red-gate"
	| "boss"
	| "achievement"
	| "whisper";

export interface BroadcastPayload {
	id: string;
	campaign_id: string;
	user_id: string;
	message: string;
	message_type: BroadcastTheme;
	target_user_ids: string[] | null;
	created_at: string;
	sender_name?: string;
}

export const useVTTBroadcast = (
	campaignId: string | undefined,
	sessionId?: string,
	onReceive?: (payload: BroadcastPayload) => void,
) => {
	const { user } = useAuth();
	const { toast } = useToast();

	const channelName = `vtt:${campaignId}${sessionId ? `:${sessionId}` : ""}`;

	const sendBroadcast = useCallback(
		async (
			message: string,
			theme: BroadcastTheme = "system",
			targets: string[] | null = null,
		) => {
			if (!campaignId || !user) return;

			// Map to DB schema: content, character_name, metadata
			const dbPayload = {
				campaign_id: campaignId,
				user_id: user.id,
				content: message,
				message_type: theme,
				target_user_ids: targets,
			};

			// 1. Send via Realtime Channel (Transient) — Unified Channel Name
			const channel = supabase.channel(channelName);
			await channel.send({
				type: "broadcast",
				event: "vtt_message",
				payload: {
					...dbPayload,
					id: crypto.randomUUID(),
					created_at: new Date().toISOString(),
					sender_name: user.email?.split("@")[0] || "Protocol Warden",
					// For transient broadcast, we keep the original targeting for easier filtering
					target_user_ids: targets,
				},
			});

			// 2. Persist to DB (History)
			const { error } = await supabase
				.from("campaign_messages")
				.insert(dbPayload);

			if (error) {
				console.error("Failed to persist broadcast:", error);
				toast({
					title: "Broadcast Error",
					description:
						"Message sent in real-time but failed to save to history.",
					variant: "destructive",
				});
			}
		},
		[campaignId, channelName, user, toast],
	);

	useEffect(() => {
		if (!campaignId || !user) return;

		const channel = supabase
			.channel(channelName)
			.on("broadcast", { event: "vtt_message" }, ({ payload }) => {
				// Filter based on targeting
				const isTargeted =
					!payload.target_user_ids ||
					payload.target_user_ids.length === 0 ||
					payload.target_user_ids.includes(user.id) ||
					payload.user_id === user.id; // Show to sender too

				if (isTargeted && onReceive) {
					onReceive(payload as BroadcastPayload);
				}
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [campaignId, channelName, user, onReceive]);

	return { sendBroadcast };
};
