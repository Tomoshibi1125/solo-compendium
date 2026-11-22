import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/authContext";
import { freshSharedChannel } from "@/lib/realtimeChannel";

/**
 * Campaign real-time presence + shared dice.
 *
 * Scope note (2026-07): the collaboration channel once carried cursor / text /
 * character-update / map / combat-state broadcasts, but those were obsolete
 * scaffolding with no producers or listeners and were removed.
 * Cross-client sync now rides durable DB tables + `postgres_changes`
 * subscriptions instead: combat via `useCampaignCombat`, character HP/state via
 * `useCharacterRealtime`. This hook keeps the two things that are actually
 * live: member presence and shared dice-roll toasts.
 */

export type CursorPosition = { x: number; y: number };

export type DiceRollPayload = {
	formula: string;
	result: number;
	details?: Record<string, unknown>;
};

type CollaborationEventBase = {
	userId: string;
	userName: string;
	timestamp: number;
	campaignId: string;
};

type CollaborationEvent = CollaborationEventBase & {
	type: "dice_roll";
	data: DiceRollPayload;
};

export type DiceRollEvent = CollaborationEvent;

export type PresencePayload = {
	user_id?: string;
	user_name?: string;
	cursor?: CursorPosition;
	isTyping?: boolean;
	currentElement?: string;
};

export interface ActiveUser {
	id: string;
	name: string;
	cursor?: CursorPosition;
	lastSeen: number;
	isTyping?: boolean;
	currentElement?: string;
}

// Validation Guards
export function isPresencePayload(v: unknown): v is PresencePayload {
	if (typeof v !== "object" || v === null) return false;
	const p = v as PresencePayload;
	return (
		(p.user_id === undefined || typeof p.user_id === "string") &&
		(p.user_name === undefined || typeof p.user_name === "string")
	);
}

export function isCollaborationEvent(v: unknown): v is CollaborationEvent {
	if (typeof v !== "object" || v === null) return false;
	const e = v as CollaborationEvent;
	return e.type === "dice_roll" && typeof e.userId === "string";
}

export function useRealtimeCollaboration(campaignId: string) {
	const [channel, setChannel] = useState<RealtimeChannel | null>(null);
	const [activeUsers, setActiveUsers] = useState<Map<string, ActiveUser>>(
		new Map(),
	);
	const [isConnected, setIsConnected] = useState(false);
	const { toast } = useToast();
	const { user } = useAuth();
	const currentUserId = user?.id || "anonymous";
	const currentUserName = user?.email?.split("@")[0] || "Anonymous";

	const handleDiceRoll = useCallback(
		(event: DiceRollEvent) => {
			// Emit a DOM event so any interested surface can react, plus a toast.
			window.dispatchEvent(
				new CustomEvent("collaboration:dice_roll", { detail: event }),
			);
			toast({
				title: "Dice Roll",
				description: `${event.userName} rolled ${event.data.formula}: ${event.data.result}`,
			});
		},
		[toast],
	);

	const handleCollaborationEvent = useCallback(
		(event: CollaborationEvent) => {
			if (event.type === "dice_roll") handleDiceRoll(event);
		},
		[handleDiceRoll],
	);

	const handleUserJoin = useCallback(
		(key: string, presences: PresencePayload[]) => {
			const presence = presences.at(-1);
			if (!presence) return;
			const activeUser: ActiveUser = {
				id: presence.user_id ?? key,
				name: presence.user_name || "Anonymous",
				lastSeen: Date.now(),
			};
			setActiveUsers((previous) => {
				const next = new Map(previous);
				next.set(key, activeUser);
				return next;
			});
		},
		[],
	);

	const handleUserLeave = useCallback((key: string) => {
		setActiveUsers((previous) => {
			if (!previous.has(key)) return previous;
			const next = new Map(previous);
			next.delete(key);
			return next;
		});
	}, []);

	// Initialize real-time connection
	useEffect(() => {
		if (!campaignId) return;

		// Shared broadcast/presence topic — tear down any stale same-name
		// instance first (StrictMode remounts; supabase-js 2.110 throws on
		// .on() after subscribe()).
		const newChannel = freshSharedChannel(`campaign_${campaignId}`)
			.on("broadcast", { event: "collaboration" }, (payload) => {
				const event = payload.payload;
				if (isCollaborationEvent(event)) {
					handleCollaborationEvent(event);
				}
			})
			.on("presence", { event: "join" }, ({ key, newPresences }) => {
				const validated: PresencePayload[] = (newPresences || [])
					.map((p: unknown) => {
						const data = p as Record<string, unknown>;
						return {
							user_id:
								typeof data.user_id === "string" ? data.user_id : undefined,
							user_name:
								typeof data.user_name === "string" ? data.user_name : undefined,
							cursor: typeof data.cursor === "object" ? data.cursor : undefined,
							isTyping:
								typeof data.isTyping === "boolean" ? data.isTyping : false,
							currentElement:
								typeof data.currentElement === "string"
									? data.currentElement
									: undefined,
						} as PresencePayload;
					})
					.filter(isPresencePayload);
				handleUserJoin(key, validated);
			})
			.on("presence", { event: "leave" }, ({ key }) => {
				handleUserLeave(key);
			})
			.on("presence", { event: "sync" }, () => {
				// Handle initial sync
			})
			.subscribe((status) => {
				setIsConnected(status === "SUBSCRIBED");
			});

		setChannel(newChannel);

		return () => {
			newChannel.unsubscribe();
		};
	}, [campaignId, handleCollaborationEvent, handleUserJoin, handleUserLeave]);

	const broadcastDiceRoll = useCallback(
		(formula: string, result: number, details?: Record<string, unknown>) => {
			if (!channel || !isConnected) return;

			channel.send({
				type: "broadcast",
				event: "collaboration",
				payload: {
					type: "dice_roll",
					userId: currentUserId,
					userName: currentUserName,
					data: { formula, result, details },
					timestamp: Date.now(),
					campaignId,
				} as CollaborationEvent,
			});
		},
		[channel, isConnected, campaignId, currentUserId, currentUserName],
	);

	// Update user presence
	const updatePresence = useCallback(
		(state: Record<string, unknown>) => {
			if (!channel || !isConnected) return;

			channel.track({
				user_id: currentUserId,
				user_name: currentUserName,
				...state,
			});
		},
		[channel, isConnected, currentUserId, currentUserName],
	);

	return {
		isConnected,
		activeUsers: Array.from(activeUsers.values()),
		broadcastDiceRoll,
		updatePresence,
	};
}
