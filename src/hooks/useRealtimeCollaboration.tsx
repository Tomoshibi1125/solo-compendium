import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/authContext";
import { freshSharedChannel } from "@/lib/realtimeChannel";

export type CursorPosition = { x: number; y: number };

export type TextChangePayload = {
	elementId: string;
	content: string;
	cursorPosition?: number;
};

export type CharacterUpdatePayload = {
	characterId: string;
	updates: Record<string, unknown>;
};

export type DiceRollPayload = {
	formula: string;
	result: number;
	details?: Record<string, unknown>;
};

export type MapUpdatePayload = Record<string, unknown>;
export type CombatStatePayload = Record<string, unknown>;

type CollaborationEventBase = {
	userId: string;
	userName: string;
	timestamp: number;
	campaignId: string;
};

type CollaborationEvent =
	| (CollaborationEventBase & { type: "cursor_move"; data: CursorPosition })
	| (CollaborationEventBase & { type: "text_change"; data: TextChangePayload })
	| (CollaborationEventBase & {
			type: "character_update";
			data: CharacterUpdatePayload;
	  })
	| (CollaborationEventBase & { type: "dice_roll"; data: DiceRollPayload })
	| (CollaborationEventBase & {
			type: "map_update";
			data: Record<string, unknown>;
	  })
	| (CollaborationEventBase & {
			type: "combat_state";
			data: CombatStatePayload;
	  });

export type TextChangeEvent = Extract<
	CollaborationEvent,
	{ type: "text_change" }
>;
export type CharacterUpdateEvent = Extract<
	CollaborationEvent,
	{ type: "character_update" }
>;
export type DiceRollEvent = Extract<CollaborationEvent, { type: "dice_roll" }>;
export type MapUpdateEvent = Extract<
	CollaborationEvent,
	{ type: "map_update" }
>;
export type CombatStateEvent = Extract<
	CollaborationEvent,
	{ type: "combat_state" }
>;

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
	return typeof e.type === "string" && typeof e.userId === "string";
}

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
	cursor?: { x: number; y: number };
	lastSeen: number;
	isTyping?: boolean;
	currentElement?: string;
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

	const updateCursorPosition = useCallback(
		(userId: string, position: { x: number; y: number }) => {
			setActiveUsers((prev) => {
				const newMap = new Map(prev);
				const user = newMap.get(userId);
				if (user) {
					newMap.set(userId, {
						...user,
						cursor: position,
						lastSeen: Date.now(),
					});
				}
				return newMap;
			});
		},
		[],
	);

	const handleTextChange = useCallback((event: TextChangeEvent) => {
		// Emit custom event for text changes
		window.dispatchEvent(
			new CustomEvent("collaboration:text_change", {
				detail: event,
			}),
		);
	}, []);

	const handleCharacterUpdate = useCallback((event: CharacterUpdateEvent) => {
		// Emit custom event for character updates
		window.dispatchEvent(
			new CustomEvent("collaboration:character_update", {
				detail: event,
			}),
		);
	}, []);

	const handleDiceRoll = useCallback(
		(event: DiceRollEvent) => {
			// Emit custom event for dice rolls
			window.dispatchEvent(
				new CustomEvent("collaboration:dice_roll", {
					detail: event,
				}),
			);

			toast({
				title: "Dice Roll",
				description: `${event.userName} rolled ${event.data.formula}: ${event.data.result}`,
			});
		},
		[toast],
	);

	const handleMapUpdate = useCallback((event: MapUpdateEvent) => {
		// Emit custom event for map updates
		window.dispatchEvent(
			new CustomEvent("collaboration:map_update", {
				detail: event,
			}),
		);
	}, []);

	const handleCombatStateUpdate = useCallback((event: CombatStateEvent) => {
		// Emit custom event for combat state updates
		window.dispatchEvent(
			new CustomEvent("collaboration:combat_state", {
				detail: event,
			}),
		);
	}, []);

	const handleCollaborationEvent = useCallback(
		(event: CollaborationEvent) => {
			switch (event.type) {
				case "cursor_move":
					updateCursorPosition(event.userId, event.data);
					break;
				case "text_change":
					handleTextChange(event);
					break;
				case "character_update":
					handleCharacterUpdate(event);
					break;
				case "dice_roll":
					handleDiceRoll(event);
					break;
				case "map_update":
					handleMapUpdate(event);
					break;
				case "combat_state":
					handleCombatStateUpdate(event);
					break;
			}
		},
		[
			updateCursorPosition,
			handleTextChange,
			handleCharacterUpdate,
			handleDiceRoll,
			handleMapUpdate,
			handleCombatStateUpdate,
		],
	);

	const handleUserJoin = useCallback(
		(key: string, presences: PresencePayload[]) => {
			presences.forEach((presence) => {
				const userId = presence.user_id ?? key;
				const user: ActiveUser = {
					id: userId,
					name: presence.user_name || "Anonymous",
					lastSeen: Date.now(),
				};
				setActiveUsers((prev) => new Map(prev.set(key, user)));

				toast({
					title: "User Joined",
					description: `${user.name} joined the campaign`,
				});
			});
		},
		[toast],
	);

	const handleUserLeave = useCallback(
		(key: string, _presences: PresencePayload[]) => {
			const user = activeUsers.get(key);
			if (user) {
				setActiveUsers((prev) => {
					const newMap = new Map(prev);
					newMap.delete(key);
					return newMap;
				});

				toast({
					title: "User Left",
					description: `${user.name} left the campaign`,
				});
			}
		},
		[toast, activeUsers],
	);

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
						const data = p as Record<string, unknown>; // Bridge to unknown-access data
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
			.on("presence", { event: "leave" }, ({ key, leftPresences }) => {
				const validated: PresencePayload[] = (leftPresences || [])
					.map((p: unknown) => {
						const data = p as Record<string, unknown>;
						return {
							user_id:
								typeof data.user_id === "string" ? data.user_id : undefined,
							user_name:
								typeof data.user_name === "string" ? data.user_name : undefined,
						} as PresencePayload;
					})
					.filter(isPresencePayload);
				handleUserLeave(key, validated);
			})
			.on("presence", { event: "sync" }, () => {
				// Handle initial sync
			})
			.subscribe((status) => {
				setIsConnected(status === "SUBSCRIBED");
				if (status === "SUBSCRIBED") {
					toast({
						title: "Connected to Campaign",
						description: "Real-time collaboration enabled",
					});
				} else if (status === "CHANNEL_ERROR") {
					toast({
						title: "Connection Error",
						description: "Unable to connect to real-time features",
						variant: "destructive",
					});
				}
			});

		setChannel(newChannel);

		return () => {
			newChannel.unsubscribe();
		};
	}, [
		campaignId,
		handleCollaborationEvent,
		handleUserJoin,
		handleUserLeave,
		toast,
	]);

	// Broadcasting functions
	const broadcastCursorMove = useCallback(
		(position: { x: number; y: number }) => {
			if (!channel || !isConnected) return;

			const payload: CollaborationEvent = {
				type: "cursor_move",
				userId: currentUserId,
				userName: currentUserName,
				data: position,
				timestamp: Date.now(),
				campaignId,
			};

			channel.send({
				type: "broadcast",
				event: "collaboration",
				payload,
			});
		},
		[channel, isConnected, campaignId, currentUserId, currentUserName],
	);

	const broadcastTextChange = useCallback(
		(elementId: string, content: string, cursorPosition?: number) => {
			if (!channel || !isConnected) return;

			channel.send({
				type: "broadcast",
				event: "collaboration",
				payload: {
					type: "text_change",
					userId: currentUserId,
					userName: currentUserName,
					data: { elementId, content, cursorPosition },
					timestamp: Date.now(),
					campaignId,
				} as CollaborationEvent,
			});
		},
		[channel, isConnected, campaignId, currentUserId, currentUserName],
	);

	const broadcastCharacterUpdate = useCallback(
		(characterId: string, updates: Record<string, unknown>) => {
			if (!channel || !isConnected) return;

			channel.send({
				type: "broadcast",
				event: "collaboration",
				payload: {
					type: "character_update",
					userId: currentUserId,
					userName: currentUserName,
					data: { characterId, updates },
					timestamp: Date.now(),
					campaignId,
				} as CollaborationEvent,
			});
		},
		[channel, isConnected, campaignId, currentUserId, currentUserName],
	);

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

	const broadcastMapUpdate = useCallback(
		(mapData: MapUpdatePayload) => {
			if (!channel || !isConnected) return;

			channel.send({
				type: "broadcast",
				event: "collaboration",
				payload: {
					type: "map_update",
					userId: currentUserId,
					userName: currentUserName,
					data: mapData,
					timestamp: Date.now(),
					campaignId,
				} as CollaborationEvent,
			});
		},
		[channel, isConnected, campaignId, currentUserId, currentUserName],
	);

	const broadcastCombatState = useCallback(
		(combatState: CombatStatePayload) => {
			if (!channel || !isConnected) return;

			channel.send({
				type: "broadcast",
				event: "collaboration",
				payload: {
					type: "combat_state",
					userId: currentUserId,
					userName: currentUserName,
					data: combatState,
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
		broadcastCursorMove,
		broadcastTextChange,
		broadcastCharacterUpdate,
		broadcastDiceRoll,
		broadcastMapUpdate,
		broadcastCombatState,
		updatePresence,
	};
}
