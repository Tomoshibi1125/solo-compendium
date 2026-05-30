import type { RealtimeChannel } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";
import { getLocalUserId } from "@/lib/guestStore";
import { enqueueSyncItem } from "@/lib/syncManager";

export interface CampaignMessage {
	id: string;
	campaign_id: string;
	user_id: string;
	character_name: string | null;
	message_type: "chat" | "roll" | "rift" | "whisper";
	content: string;
	metadata: Json | null;
	created_at: string;
}

const getMessagesKey = (campaignId: string) =>
	`solo-compendium.campaign.${campaignId}.messages`;
const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

const getBrowserWindow = (): Window | null => {
	if (typeof window === "undefined") return null;
	return window;
};

const loadLocalMessages = (campaignId: string): CampaignMessage[] => {
	const activeWindow = getBrowserWindow();
	if (!activeWindow) return [];
	const raw = activeWindow.localStorage.getItem(getMessagesKey(campaignId));
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as CampaignMessage[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

const saveLocalMessages = (campaignId: string, messages: CampaignMessage[]) => {
	const activeWindow = getBrowserWindow();
	if (!activeWindow) return;
	activeWindow.localStorage.setItem(
		getMessagesKey(campaignId),
		JSON.stringify(messages),
	);
};

const broadcastLocalMessage = (
	campaignId: string,
	message: CampaignMessage,
) => {
	const activeWindow = getBrowserWindow();
	if (!activeWindow) return;
	if ("BroadcastChannel" in activeWindow) {
		const channel = new BroadcastChannel(`campaign-messages-${campaignId}`);
		channel.postMessage(message);
		channel.close();
	} else {
		activeWindow.dispatchEvent(
			new CustomEvent(`campaign-message-${campaignId}`, { detail: message }),
		);
	}
};

// Fetch campaign messages
export const useCampaignMessages = (campaignId: string) => {
	return useQuery({
		queryKey: ["campaigns", campaignId, "messages"],
		queryFn: async (): Promise<CampaignMessage[]> => {
			if (!isSupabaseConfigured || import.meta.env.VITE_E2E === "true") {
				return loadLocalMessages(campaignId).sort((a, b) =>
					a.created_at.localeCompare(b.created_at),
				);
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user && guestEnabled) {
				return loadLocalMessages(campaignId).sort((a, b) =>
					a.created_at.localeCompare(b.created_at),
				);
			}

			const { data, error } = await supabase
				.from("campaign_messages")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: true })
				.limit(100);

			if (error) throw error;
			return (data || []) as CampaignMessage[];
		},
		enabled: !!campaignId,
		staleTime: 10000,
		refetchInterval: 30000,
	});
};

// Real-time subscription for campaign messages
export const useCampaignMessagesRealtime = (
	campaignId: string,
	onNewMessage: (message: CampaignMessage) => void,
) => {
	const { user, loading } = useAuth();
	const channelRef = useRef<RealtimeChannel | BroadcastChannel | null>(null);
	const onNewMessageRef = useRef(onNewMessage);

	useEffect(() => {
		onNewMessageRef.current = onNewMessage;
	}, [onNewMessage]);

	useEffect(() => {
		if (!campaignId) return;
		if (loading) return;

		if (
			!isSupabaseConfigured ||
			import.meta.env.VITE_E2E === "true" ||
			(guestEnabled && !user)
		) {
			const activeWindow = getBrowserWindow();
			if (!activeWindow) return;
			if ("BroadcastChannel" in activeWindow) {
				const channel = new BroadcastChannel(`campaign-messages-${campaignId}`);
				channel.onmessage = (event) => {
					onNewMessageRef.current(event.data as CampaignMessage);
				};
				channelRef.current = channel;
				return () => {
					channel.close();
					channelRef.current = null;
				};
			}

			const handler = (event: Event) => {
				const detail = (event as CustomEvent).detail as CampaignMessage;
				onNewMessageRef.current(detail);
			};
			activeWindow.addEventListener(`campaign-message-${campaignId}`, handler);
			return () =>
				activeWindow.removeEventListener(
					`campaign-message-${campaignId}`,
					handler,
				);
		}

		const channel = supabase
			.channel(`campaign-messages-${campaignId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "campaign_messages",
					filter: `campaign_id=eq.${campaignId}`,
				},
				(payload) => {
					onNewMessageRef.current(payload.new as CampaignMessage);
				},
			)
			.subscribe();

		channelRef.current = channel;

		return () => {
			if (channelRef.current) {
				if ("unsubscribe" in channelRef.current) {
					supabase.removeChannel(channelRef.current);
				} else if ("close" in channelRef.current) {
					channelRef.current.close();
				}
				channelRef.current = null;
			}
		};
	}, [campaignId, loading, user]);
};

// Send message mutation
export const useSendCampaignMessage = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			campaignId,
			content,
			characterName,
			messageType = "chat",
			metadata = {},
		}: {
			campaignId: string;
			content: string;
			characterName?: string;
			messageType?: "chat" | "roll" | "rift" | "whisper";
			metadata?: Json;
		}) => {
			const isOfflineMode =
				typeof navigator !== "undefined" && !navigator.onLine;

			if (
				!isSupabaseConfigured ||
				import.meta.env.VITE_E2E === "true" ||
				isOfflineMode
			) {
				const now = new Date().toISOString();
				const next: CampaignMessage = {
					id: crypto.randomUUID(),
					campaign_id: campaignId,
					user_id: getLocalUserId(),
					character_name: characterName || null,
					message_type: messageType,
					content,
					metadata,
					created_at: now,
				};
				const updated = [...loadLocalMessages(campaignId), next];
				saveLocalMessages(campaignId, updated);
				broadcastLocalMessage(campaignId, next);

				if (isOfflineMode) {
					await enqueueSyncItem("message", "create", {
						campaign_id: campaignId,
						user_id: getLocalUserId(),
						message_type: messageType,
						content,
						metadata:
							typeof metadata === "object" &&
							metadata !== null &&
							!Array.isArray(metadata)
								? (metadata as Record<string, unknown>)
								: {},
						character_name: characterName || null,
					});
				}
				return next;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				const now = new Date().toISOString();
				const next: CampaignMessage = {
					id: crypto.randomUUID(),
					campaign_id: campaignId,
					user_id: getLocalUserId(),
					character_name: characterName || null,
					message_type: messageType,
					content,
					metadata,
					created_at: now,
				};
				const updated = [...loadLocalMessages(campaignId), next];
				saveLocalMessages(campaignId, updated);
				broadcastLocalMessage(campaignId, next);
				return next;
			}

			const { data, error } = await supabase
				.from("campaign_messages")
				.insert({
					campaign_id: campaignId,
					user_id: user.id,
					content,
					character_name: characterName || null,
					message_type: messageType,
					metadata,
				})
				.select()
				.single();

			if (error) throw error;

			// R6 of Round 2 — fan out chat mentions to the user_notifications
			// inbox. Scan content for `@<member-name>` tokens and produce a
			// `mention` notification for each recipient. Best-effort: failures
			// must not block the chat send.
			try {
				const matches = (content || "").match(/@[A-Za-z0-9_-]{2,40}/g);
				if (matches && matches.length > 0) {
					const { data: members } = await supabase
						.from("campaign_members")
						.select("user_id, characters(name)")
						.eq("campaign_id", campaignId);
					const memberRows =
						(members as Array<{
							user_id: string;
							characters: { name: string | null } | null;
						}> | null) || [];
					const seen = new Set<string>();
					for (const token of matches) {
						const handle = token.slice(1).toLowerCase();
						const recipient = memberRows.find(
							(m) =>
								m.user_id !== user.id &&
								(m.characters?.name ?? "").toLowerCase().includes(handle),
						);
						if (!recipient || seen.has(recipient.user_id)) continue;
						seen.add(recipient.user_id);
						await (
							supabase.rpc as unknown as (
								name: string,
								params: Record<string, unknown>,
							) => Promise<{ data: unknown; error: Error | null }>
						)("add_user_notification", {
							p_user_id: recipient.user_id,
							p_type: "mention",
							p_title: `Mentioned in campaign chat`,
							p_message:
								content.length > 120 ? `${content.slice(0, 117)}…` : content,
							p_priority: "normal",
							p_category: "campaign",
							p_payload: { campaign_id: campaignId },
							p_link: `/campaigns/${campaignId}`,
							p_expires_at: null,
						});
					}
				}
			} catch (mentionErr) {
				// Logged but never bubbles — chat must keep working.
				if (typeof console !== "undefined") {
					console.warn("Mention notification fan-out failed", mentionErr);
				}
			}

			return data as CampaignMessage;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "messages"],
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to send message",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

// Delete message mutation (for Wardens)
export const useDeleteCampaignMessage = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: async ({
			messageId,
			campaignId,
		}: {
			messageId: string;
			campaignId: string;
		}) => {
			if (!isSupabaseConfigured || import.meta.env.VITE_E2E === "true") {
				const existing = loadLocalMessages(campaignId);
				const next = existing.filter((msg) => msg.id !== messageId);
				saveLocalMessages(campaignId, next);
				return;
			}

			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user && guestEnabled) {
				const existing = loadLocalMessages(campaignId);
				const next = existing.filter((msg) => msg.id !== messageId);
				saveLocalMessages(campaignId, next);
				return;
			}

			const { error } = await supabase
				.from("campaign_messages")
				.delete()
				.eq("id", messageId);

			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["campaigns", variables.campaignId, "messages"],
			});
			toast({
				title: "Message deleted",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to delete message",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
