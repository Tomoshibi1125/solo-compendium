/**
 * useVTTRealtime — Supabase Realtime channel for multi-user VTT collaboration.
 *
 * Provides broadcast + presence primitives scoped to a campaign+session pair.
 * DM and players share:
 *   - token moves / updates
 *   - scene switches
 *   - fog changes
 *   - chat messages
 *   - dice rolls
 *   - initiative / turn state
 *   - cursor positions (presence)
 *   - map pings
 */

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import {
	type ChatParticipant,
	createPing,
	formatInlineRoll,
	hasInlineRolls,
	type MapPing,
	parseInlineRolls,
	parseWhisperCommand,
} from "@/lib/vtt";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VTTChatMessage {
	id: string;
	userId: string;
	userName: string;
	message: string;
	type:
		| "chat"
		| "dice"
		| "system"
		| "whisper"
		| "emote"
		| "desc"
		| "gmroll"
		| "gm_whisper"
		| "roll_whisper";
	diceFormula?: string;
	diceResult?: number;
	diceCritical?: boolean;
	diceFumble?: boolean;
	diceDisplayText?: string; // Rich display e.g. "[3, 5, ~~1~~] + 4 = **12**"
	whisperTo?: string; // userId for whisper target
	timestamp: number;
}

export interface VTTDiceRoll {
	formula: string;
	result: number;
	rolls: number[];
	critical: boolean;
	fumble: boolean;
}

export interface VTTTokenMove {
	tokenId: string;
	x: number;
	y: number;
	movedBy: string;
}

export interface VTTTokenUpdate {
	tokenId: string;
	updates: Record<string, unknown>;
	updatedBy: string;
}

export interface VTTSceneChange {
	sceneId: string;
	changedBy: string;
}

export interface VTTFogUpdate {
	sceneId: string;
	fogData: boolean[][];
	updatedBy: string;
}

export interface VTTInitiativeState {
	order: {
		tokenId: string;
		name: string;
		initiative: number;
		hp?: number;
		maxHp?: number;
	}[];
	currentTurnIndex: number;
	round: number;
	active: boolean;
}

import type { MapPing as VTTPing } from "@/lib/vtt";
export type { VTTPing };

export interface VTTCursorPosition {
	x: number;
	y: number;
}

export interface VTTPresenceUser {
	userId: string;
	userName: string;
	role: "dm" | "player";
	cursor?: VTTCursorPosition;
	color: string;
	lastSeen: number;
}

// Broadcast event discriminated union
export interface VTTRulerSegment {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
	distance: number;
	userId: string;
	color: string;
}

export interface VTTHandoutShare {
	title: string;
	imageUrl?: string;
	content?: string;
	sharedBy: string;
	sharedById: string;
	timestamp: number;
}

export type VTTBroadcastEvent =
	| { type: "token_move"; payload: VTTTokenMove }
	| { type: "token_update"; payload: VTTTokenUpdate }
	| {
			type: "token_add";
			payload: { token: Record<string, unknown>; addedBy: string };
	  }
	| { type: "token_remove"; payload: { tokenId: string; removedBy: string } }
	| { type: "scene_change"; payload: VTTSceneChange }
	| { type: "fog_update"; payload: VTTFogUpdate }
	| { type: "chat_message"; payload: VTTChatMessage }
	| { type: "dice_roll"; payload: VTTChatMessage }
	| { type: "initiative_update"; payload: VTTInitiativeState }
	| { type: "ping"; payload: VTTPing }
	| {
			type: "scene_sync";
			payload: {
				scenes: unknown[];
				currentSceneId: string | null;
				syncedBy: string;
			};
	  }
	| {
			type: "drawing_update";
			payload: { drawings: unknown[]; sceneId: string; updatedBy: string };
	  }
	| { type: "ruler"; payload: VTTRulerSegment }
	| { type: "ruler_clear"; payload: { userId: string } }
	| { type: "handout_share"; payload: VTTHandoutShare };

type PresencePayload = {
	user_id?: string;
	user_name?: string;
	role?: "dm" | "player";
	cursor?: VTTCursorPosition;
	color?: string;
};

// ---------------------------------------------------------------------------
// User color helper
// ---------------------------------------------------------------------------
const USER_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#84cc16",
	"#22c55e",
	"#14b8a6",
	"#06b6d4",
	"#0ea5e9",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#ec4899",
	"#f43f5e",
];

function getUserColor(userId: string): string {
	let hash = 0;
	for (let i = 0; i < userId.length; i++) {
		hash = userId.charCodeAt(i) + ((hash << 5) - hash);
	}
	return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

// ---------------------------------------------------------------------------
// Advanced Dice Engine (Roll20-class)
// ---------------------------------------------------------------------------
// Supports:
//   NdS        — basic (2d6)
//   NdS+M      — modifier (1d20+5)
//   NdSkh/klN  — keep highest/lowest (4d6kh3, 2d20kl1)
//   NdS!       — exploding (3d6!)
//   NdSro<N    — reroll once below N (1d20ro<2)
//   adv / dis  — shorthand for 2d20kh1 / 2d20kl1
//   multi-term — 2d6+1d4+5-2
//   Inline display shows each die

interface DiceTermResult {
	expression: string;
	rolls: number[];
	kept: number[];
	dropped: number[];
	subtotal: number;
}

export interface VTTDiceRollDetailed {
	formula: string;
	result: number;
	rolls: number[]; // flat array of all kept rolls for backward compat
	terms: DiceTermResult[];
	modifier: number;
	critical: boolean;
	fumble: boolean;
	displayText: string; // e.g. "[3, 5, ~~1~~] + 4 = 12"
}

function rollOneDie(sides: number): number {
	return Math.floor(Math.random() * sides) + 1;
}

function parseDiceTerm(term: string): DiceTermResult {
	// Exploding: NdS!
	const explodingMatch = term.match(
		/^(\d+)d(\d+)(!)?(?:kh(\d+))?(?:kl(\d+))?(?:ro<(\d+))?$/i,
	);
	if (!explodingMatch) {
		return { expression: term, rolls: [], kept: [], dropped: [], subtotal: 0 };
	}

	let count = parseInt(explodingMatch[1], 10);
	const sides = parseInt(explodingMatch[2], 10);
	const exploding = !!explodingMatch[3];
	const keepHighest = explodingMatch[4]
		? parseInt(explodingMatch[4], 10)
		: undefined;
	const keepLowest = explodingMatch[5]
		? parseInt(explodingMatch[5], 10)
		: undefined;
	const rerollOnceBelow = explodingMatch[6]
		? parseInt(explodingMatch[6], 10)
		: undefined;

	const rolls: number[] = [];
	for (let i = 0; i < count; i++) {
		let roll = rollOneDie(sides);

		// Reroll once
		if (rerollOnceBelow !== undefined && roll < rerollOnceBelow) {
			roll = rollOneDie(sides);
		}

		rolls.push(roll);

		// Exploding — if max, roll again (cap at 100 to prevent infinite)
		if (exploding && roll === sides && rolls.length < 100) {
			count += 1;
		}
	}

	// Keep highest / lowest
	let kept = [...rolls];
	let dropped: number[] = [];

	if (keepHighest !== undefined && keepHighest < rolls.length) {
		const sorted = rolls.map((r, i) => ({ r, i })).sort((a, b) => b.r - a.r);
		const keepSet = new Set(sorted.slice(0, keepHighest).map((s) => s.i));
		kept = rolls.filter((_, i) => keepSet.has(i));
		dropped = rolls.filter((_, i) => !keepSet.has(i));
	} else if (keepLowest !== undefined && keepLowest < rolls.length) {
		const sorted = rolls.map((r, i) => ({ r, i })).sort((a, b) => a.r - b.r);
		const keepSet = new Set(sorted.slice(0, keepLowest).map((s) => s.i));
		kept = rolls.filter((_, i) => keepSet.has(i));
		dropped = rolls.filter((_, i) => !keepSet.has(i));
	}

	const subtotal = kept.reduce((a, b) => a + b, 0);

	return { expression: term, rolls, kept, dropped, subtotal };
}

function formatTermDisplay(term: DiceTermResult): string {
	if (term.rolls.length === 0) return term.expression;
	const droppedSet = new Set(
		term.dropped.length > 0
			? (() => {
					const indices: number[] = [];
					const remaining = [...term.dropped];
					for (let i = 0; i < term.rolls.length && remaining.length > 0; i++) {
						const idx = remaining.indexOf(term.rolls[i]);
						if (idx !== -1 && !indices.includes(i)) {
							indices.push(i);
							remaining.splice(idx, 1);
						}
					}
					return indices;
				})()
			: [],
	);
	const parts = term.rolls.map((r, i) =>
		droppedSet.has(i) ? `~~${r}~~` : String(r),
	);
	return `[${parts.join(", ")}]`;
}

export function rollDiceFormula(formula: string): VTTDiceRoll {
	const detailed = rollDiceFormulaDetailed(formula);
	return {
		formula: detailed.formula,
		result: detailed.result,
		rolls: detailed.rolls,
		critical: detailed.critical,
		fumble: detailed.fumble,
	};
}

export function rollDiceFormulaDetailed(
	rawFormula: string,
): VTTDiceRollDetailed {
	let formula = rawFormula.trim().toLowerCase();

	// Shorthand: adv → 2d20kh1, dis → 2d20kl1
	if (formula === "adv" || formula === "advantage") formula = "2d20kh1";
	if (formula === "dis" || formula === "disadvantage") formula = "2d20kl1";

	// Tokenize: split on + and - while preserving sign
	// e.g. "2d6+1d4-3+5" → ["+2d6", "+1d4", "-3", "+5"]
	const tokenRegex =
		/([+-]?)(\d+d\d+(?:!)?(?:kh\d+)?(?:kl\d+)?(?:ro<\d+)?|\d+)/gi;
	const tokens: { sign: number; raw: string; isDice: boolean }[] = [];
	let m: RegExpExecArray | null;
	while ((m = tokenRegex.exec(formula)) !== null) {
		const sign = m[1] === "-" ? -1 : 1;
		const raw = m[2];
		const isDice = /d/i.test(raw);
		tokens.push({ sign, raw, isDice });
	}

	if (tokens.length === 0) {
		return {
			formula: rawFormula,
			result: 0,
			rolls: [],
			terms: [],
			modifier: 0,
			critical: false,
			fumble: false,
			displayText: rawFormula,
		};
	}

	const terms: DiceTermResult[] = [];
	let modifier = 0;
	const allKeptRolls: number[] = [];
	let total = 0;
	const displayParts: string[] = [];

	for (const token of tokens) {
		if (token.isDice) {
			const result = parseDiceTerm(token.raw);
			terms.push(result);
			const contribution = result.subtotal * token.sign;
			total += contribution;
			allKeptRolls.push(...result.kept);
			const prefix =
				token.sign < 0 ? "- " : displayParts.length > 0 ? "+ " : "";
			displayParts.push(`${prefix}${formatTermDisplay(result)}`);
		} else {
			const num = parseInt(token.raw, 10) * token.sign;
			modifier += num;
			total += num;
			const prefix = num < 0 ? "- " : displayParts.length > 0 ? "+ " : "";
			displayParts.push(`${prefix}${Math.abs(num)}`);
		}
	}

	// Detect crit/fumble on first d20 term
	const firstD20Term = terms.find((t) => t.expression.includes("d20"));
	const critical = firstD20Term
		? firstD20Term.kept.length === 1 && firstD20Term.kept[0] === 20
		: false;
	const fumble = firstD20Term
		? firstD20Term.kept.length === 1 && firstD20Term.kept[0] === 1
		: false;

	const displayText = `${displayParts.join(" ")} = **${total}**`;

	return {
		formula: rawFormula,
		result: total,
		rolls: allKeptRolls,
		terms,
		modifier,
		critical,
		fumble,
		displayText,
	};
}

// ---------------------------------------------------------------------------
// Chat command parser
// ---------------------------------------------------------------------------
export type ChatCommand =
	| { type: "chat"; message: string }
	| { type: "roll"; formula: string }
	| { type: "gmroll"; formula: string }
	| { type: "whisper"; target: string; message: string }
	| { type: "emote"; message: string }
	| { type: "desc"; message: string };

export function parseChatCommand(input: string): ChatCommand {
	const trimmed = input.trim();

	// /roll or /r
	const rollMatch = trimmed.match(/^\/r(?:oll)?\s+(.+)/i);
	if (rollMatch) return { type: "roll", formula: rollMatch[1].trim() };

	// /gmroll or /gr
	const gmRollMatch = trimmed.match(/^\/g(?:m)?r(?:oll)?\s+(.+)/i);
	if (gmRollMatch) return { type: "gmroll", formula: gmRollMatch[1].trim() };

	// /w or /whisper
	const whisperMatch = trimmed.match(/^\/w(?:hisper)?\s+"?([^"]+)"?\s+(.+)/i);
	if (whisperMatch)
		return {
			type: "whisper",
			target: whisperMatch[1].trim(),
			message: whisperMatch[2].trim(),
		};

	// /em or /me or /emote
	const emoteMatch = trimmed.match(/^\/(?:em(?:ote)?|me)\s+(.+)/i);
	if (emoteMatch) return { type: "emote", message: emoteMatch[1].trim() };

	// /desc
	const descMatch = trimmed.match(/^\/desc\s+(.+)/i);
	if (descMatch) return { type: "desc", message: descMatch[1].trim() };

	return { type: "chat", message: trimmed };
}

// ---------------------------------------------------------------------------
// Macro types
// ---------------------------------------------------------------------------
export interface VTTMacro {
	id: string;
	name: string;
	command: string; // e.g. "/roll 1d20+5" or "/roll 8d6"
	tokenId?: string; // optionally bound to a token
	showInBar: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseVTTRealtimeOptions {
	campaignId: string;
	sessionId?: string | null;
	isDM?: boolean;
}

export function useVTTRealtime({
	campaignId,
	sessionId,
	isDM = false,
}: UseVTTRealtimeOptions) {
	const { user } = useAuth();
	const userId = user?.id || "anonymous";
	const userName = user?.email?.split("@")[0] || "Anonymous";
	const userColor = useMemo(() => getUserColor(userId), [userId]);

	const [isConnected, setIsConnected] = useState(false);
	const [presenceUsers, setPresenceUsers] = useState<
		Map<string, VTTPresenceUser>
	>(new Map());
	const [chatMessages, setChatMessages] = useState<VTTChatMessage[]>([]);
	const [pings, setPings] = useState<MapPing[]>([]);
	const [initiativeState, setInitiativeState] = useState<VTTInitiativeState>({
		order: [],
		currentTurnIndex: 0,
		round: 1,
		active: false,
	});

	const channelRef = useRef<RealtimeChannel | null>(null);
	const eventHandlersRef = useRef<Map<string, Set<(payload: any) => void>>>(
		new Map(),
	);

	// Stable channel name
	const channelName = useMemo(
		() => `vtt:${campaignId}${sessionId ? `:${sessionId}` : ""}`,
		[campaignId, sessionId],
	);

	// ------ Event subscription for external consumers ------
	const on = useCallback(
		<T extends VTTBroadcastEvent["type"]>(
			eventType: T,
			handler: (
				payload: Extract<VTTBroadcastEvent, { type: T }>["payload"],
			) => void,
		) => {
			if (!eventHandlersRef.current.has(eventType)) {
				eventHandlersRef.current.set(eventType, new Set());
			}
			eventHandlersRef.current
				.get(eventType)
				?.add(handler as (payload: any) => void);
			return () => {
				eventHandlersRef.current
					.get(eventType)
					?.delete(handler as (payload: any) => void);
			};
		},
		[],
	);

	const emit = useCallback((eventType: string, payload: unknown) => {
		const handlers = eventHandlersRef.current.get(eventType);
		if (handlers) {
			handlers.forEach((handler) => handler(payload));
		}
	}, []);

	// ------ Broadcast helpers ------
	const broadcast = useCallback(
		(event: VTTBroadcastEvent) => {
			const ch = channelRef.current;
			if (!ch || !isConnected) return;
			ch.send({
				type: "broadcast",
				event: "vtt",
				payload: event,
			});
		},
		[isConnected],
	);

	// Token
	const broadcastTokenMove = useCallback(
		(tokenId: string, x: number, y: number) => {
			broadcast({
				type: "token_move",
				payload: { tokenId, x, y, movedBy: userId },
			});
		},
		[broadcast, userId],
	);

	const broadcastTokenUpdate = useCallback(
		(tokenId: string, updates: Record<string, unknown>) => {
			broadcast({
				type: "token_update",
				payload: { tokenId, updates, updatedBy: userId },
			});
		},
		[broadcast, userId],
	);

	const broadcastTokenAdd = useCallback(
		(token: Record<string, unknown>) => {
			broadcast({ type: "token_add", payload: { token, addedBy: userId } });
		},
		[broadcast, userId],
	);

	const broadcastTokenRemove = useCallback(
		(tokenId: string) => {
			broadcast({
				type: "token_remove",
				payload: { tokenId, removedBy: userId },
			});
		},
		[broadcast, userId],
	);

	// Scene
	const broadcastSceneChange = useCallback(
		(sceneId: string) => {
			broadcast({
				type: "scene_change",
				payload: { sceneId, changedBy: userId },
			});
		},
		[broadcast, userId],
	);

	const broadcastSceneSync = useCallback(
		(scenes: unknown[], currentSceneId: string | null) => {
			broadcast({
				type: "scene_sync",
				payload: { scenes, currentSceneId, syncedBy: userId },
			});
		},
		[broadcast, userId],
	);

	// Fog
	const broadcastFogUpdate = useCallback(
		(sceneId: string, fogData: boolean[][]) => {
			broadcast({
				type: "fog_update",
				payload: { sceneId, fogData, updatedBy: userId },
			});
		},
		[broadcast, userId],
	);

	// Drawings
	const broadcastDrawingUpdate = useCallback(
		(drawings: unknown[], sceneId: string) => {
			broadcast({
				type: "drawing_update",
				payload: { drawings, sceneId, updatedBy: userId },
			});
		},
		[broadcast, userId],
	);

	// Chat
	const sendChatMessage = useCallback(
		(
			message: string,
			type: VTTChatMessage["type"] = "chat",
			whisperTo?: string,
		) => {
			const msg: VTTChatMessage = {
				id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
				userId,
				userName,
				message,
				type,
				whisperTo,
				timestamp: Date.now(),
			};
			setChatMessages((prev) => [...prev, msg].slice(-200));
			broadcast({ type: "chat_message", payload: msg });

			// Persist to DB best-effort
			if (isSupabaseConfigured && campaignId) {
				void supabase
					.from("vtt_chat_messages")
					.insert({
						campaign_id: campaignId,
						session_id: sessionId || null,
						user_id: userId === "anonymous" ? null : userId,
						user_name: userName,
						message,
						message_type: type,
						whisper_to: whisperTo || null,
					})
					.then(() => {});
			}
			return msg;
		},
		[broadcast, campaignId, sessionId, userId, userName],
	);

	// Dice (detailed)
	const rollAndBroadcast = useCallback(
		(
			formula: string,
			msgType: "dice" | "gmroll" = "dice",
		): VTTDiceRollDetailed => {
			const roll = rollDiceFormulaDetailed(formula);
			const msg: VTTChatMessage = {
				id: `roll-${Date.now()}-${Math.random().toString(36).slice(2)}`,
				userId,
				userName,
				message: `${formula} = ${roll.result}${roll.critical ? " CRITICAL!" : roll.fumble ? " FUMBLE!" : ""}`,
				type: msgType,
				diceFormula: formula,
				diceResult: roll.result,
				diceCritical: roll.critical,
				diceFumble: roll.fumble,
				diceDisplayText: roll.displayText,
				timestamp: Date.now(),
			};
			setChatMessages((prev) => [...prev, msg].slice(-200));
			broadcast({ type: "dice_roll", payload: msg });

			if (isSupabaseConfigured && campaignId) {
				void supabase
					.from("vtt_chat_messages")
					.insert({
						campaign_id: campaignId,
						session_id: sessionId || null,
						user_id: userId === "anonymous" ? null : userId,
						user_name: userName,
						message: msg.message,
						message_type: msgType,
						dice_formula: formula,
						dice_result: roll.result,
					})
					.then(() => {});
			}
			return roll;
		},
		[broadcast, campaignId, sessionId, userId, userName],
	);

	// Process chat input with slash command support
	const processChat = useCallback(
		(input: string) => {
			const participants: ChatParticipant[] = Array.from(
				presenceUsers.values(),
			).map((u) => ({
				id: u.userId,
				name: u.userName,
				role: u.role as "gm" | "player",
			}));
			participants.push({
				id: userId,
				name: userName,
				role: isDM ? "gm" : "player",
			});

			const whisperCmd = parseWhisperCommand(input, participants, userId);

			if (whisperCmd) {
				if (whisperCmd.type === "roll_whisper") {
					const roll = rollDiceFormulaDetailed(whisperCmd.content);
					const msg: VTTChatMessage = {
						id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
						userId,
						userName,
						message: `${whisperCmd.content} = ${roll.result}${roll.critical ? " CRITICAL!" : roll.fumble ? " FUMBLE!" : ""}`,
						type: whisperCmd.type,
						whisperTo: whisperCmd.recipientIds.join(","),
						timestamp: Date.now(),
						diceFormula: roll.formula,
						diceResult: roll.result,
						diceCritical: roll.critical,
						diceFumble: roll.fumble,
						diceDisplayText: roll.displayText,
					};
					setChatMessages((prev) => [...prev, msg].slice(-200));
					broadcast({ type: "chat_message", payload: msg });
					return;
				}

				const msg: VTTChatMessage = {
					id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
					userId,
					userName,
					message: whisperCmd.content,
					type: whisperCmd.type,
					whisperTo: whisperCmd.recipientIds.join(","),
					timestamp: Date.now(),
				};
				setChatMessages((prev) => [...prev, msg].slice(-200));
				broadcast({ type: "chat_message", payload: msg });
				return;
			}

			const cmd = parseChatCommand(input);
			switch (cmd.type) {
				case "roll":
					rollAndBroadcast(cmd.formula, "dice");
					break;
				case "gmroll":
					rollAndBroadcast(cmd.formula, "gmroll");
					break;
				case "whisper":
					sendChatMessage(cmd.message, "whisper", cmd.target);
					break;
				case "emote":
					sendChatMessage(cmd.message, "emote");
					break;
				case "desc":
					sendChatMessage(cmd.message, "desc");
					break;
				default: {
					// Roll20 parity: resolve [[2d6+3]] inline dice expressions before sending
					if (hasInlineRolls(cmd.message)) {
						const parsed = parseInlineRolls(cmd.message);
						const resolvedText = parsed.segments
							.map((seg) => {
								if (seg.type === "roll")
									return `⟨${formatInlineRoll(seg.result)}⟩`;
								return seg.content;
							})
							.join("");
						sendChatMessage(resolvedText, "chat");
					} else {
						sendChatMessage(cmd.message, "chat");
					}
					break;
				}
			}
		},
		[
			rollAndBroadcast,
			sendChatMessage,
			presenceUsers,
			userId,
			userName,
			isDM,
			broadcast,
		],
	);

	// Initiative
	const broadcastInitiativeUpdate = useCallback(
		(state: VTTInitiativeState) => {
			setInitiativeState(state);
			broadcast({ type: "initiative_update", payload: state });
		},
		[broadcast],
	);

	const nextTurn = useCallback(() => {
		setInitiativeState((prev) => {
			if (!prev.active || prev.order.length === 0) return prev;
			let nextIndex = prev.currentTurnIndex + 1;
			let nextRound = prev.round;
			if (nextIndex >= prev.order.length) {
				nextIndex = 0;
				nextRound += 1;
			}
			const next = { ...prev, currentTurnIndex: nextIndex, round: nextRound };
			broadcast({ type: "initiative_update", payload: next });
			return next;
		});
	}, [broadcast]);

	const prevTurn = useCallback(() => {
		setInitiativeState((prev) => {
			if (!prev.active || prev.order.length === 0) return prev;
			let nextIndex = prev.currentTurnIndex - 1;
			let nextRound = prev.round;
			if (nextIndex < 0) {
				nextIndex = prev.order.length - 1;
				nextRound = Math.max(1, nextRound - 1);
			}
			const next = { ...prev, currentTurnIndex: nextIndex, round: nextRound };
			broadcast({ type: "initiative_update", payload: next });
			return next;
		});
	}, [broadcast]);

	const endCombat = useCallback(() => {
		const next: VTTInitiativeState = {
			order: [],
			currentTurnIndex: 0,
			round: 1,
			active: false,
		};
		setInitiativeState(next);
		broadcast({ type: "initiative_update", payload: next });
	}, [broadcast]);

	// Ruler (live measurement visible to all)
	const [rulerSegments, setRulerSegments] = useState<VTTRulerSegment[]>([]);

	const broadcastRuler = useCallback(
		(
			fromX: number,
			fromY: number,
			toX: number,
			toY: number,
			distance: number,
		) => {
			const segment: VTTRulerSegment = {
				fromX,
				fromY,
				toX,
				toY,
				distance,
				userId,
				color: userColor,
			};
			broadcast({ type: "ruler", payload: segment });
		},
		[broadcast, userColor, userId],
	);

	const clearRuler = useCallback(() => {
		setRulerSegments((prev) => prev.filter((s) => s.userId !== userId));
		broadcast({ type: "ruler_clear", payload: { userId } });
	}, [broadcast, userId]);

	// Handout share
	const [sharedHandout, setSharedHandout] = useState<VTTHandoutShare | null>(
		null,
	);
	const handoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const shareHandout = useCallback(
		(title: string, imageUrl?: string, content?: string) => {
			const handout: VTTHandoutShare = {
				title,
				imageUrl,
				content,
				sharedBy: userName,
				sharedById: userId,
				timestamp: Date.now(),
			};
			setSharedHandout(handout);
			broadcast({ type: "handout_share", payload: handout });
			// Auto-dismiss after 30s
			if (handoutTimeoutRef.current) clearTimeout(handoutTimeoutRef.current);
			handoutTimeoutRef.current = setTimeout(
				() => setSharedHandout(null),
				30000,
			);
		},
		[broadcast, userId, userName],
	);

	const dismissHandout = useCallback(() => {
		if (handoutTimeoutRef.current) {
			clearTimeout(handoutTimeoutRef.current);
			handoutTimeoutRef.current = null;
		}
		setSharedHandout(null);
	}, []);

	// Macros
	const [macros, setMacros] = useState<VTTMacro[]>([]);

	const addMacro = useCallback((macro: Omit<VTTMacro, "id">) => {
		setMacros((prev) => [...prev, { ...macro, id: `macro-${Date.now()}` }]);
	}, []);

	const removeMacro = useCallback((macroId: string) => {
		setMacros((prev) => prev.filter((m) => m.id !== macroId));
	}, []);

	const executeMacro = useCallback(
		(macroId: string) => {
			const macro = macros.find((m) => m.id === macroId);
			if (!macro) return;
			processChat(macro.command);
		},
		[macros, processChat],
	);

	// Ping
	const sendPing = useCallback(
		(x: number, y: number) => {
			const ping = createPing(x, y, userId, userName, "look");
			ping.color = userColor; // override with user color
			setPings((prev) => [...prev, ping].slice(-20));
			broadcast({ type: "ping", payload: ping as never });
			// Auto-remove after 3s
			setTimeout(() => {
				setPings((prev) => prev.filter((p) => p.createdAt !== ping.createdAt));
			}, 3000);
		},
		[broadcast, userColor, userId, userName],
	);

	// Cursor presence
	const updateCursor = useCallback(
		(cursor: VTTCursorPosition) => {
			const ch = channelRef.current;
			if (!ch || !isConnected) return;
			ch.track({
				user_id: userId,
				user_name: userName,
				role: isDM ? "dm" : "player",
				cursor,
				color: userColor,
			});
		},
		[isConnected, isDM, userColor, userId, userName],
	);

	// ------ Channel setup ------
	useEffect(() => {
		if (!campaignId || !isSupabaseConfigured) return;

		const ch = supabase
			.channel(channelName, { config: { broadcast: { self: false } } })
			.on(
				"broadcast",
				{ event: "vtt" },
				({ payload }: { payload: VTTBroadcastEvent }) => {
					if (!payload || !payload.type) return;

					// Internal handling
					switch (payload.type) {
						case "chat_message":
						case "dice_roll":
							setChatMessages((prev) =>
								[...prev, payload.payload as VTTChatMessage].slice(-200),
							);
							break;
						case "initiative_update":
							setInitiativeState(payload.payload as VTTInitiativeState);
							break;
						case "ping": {
							const ping = payload.payload as MapPing; // VTTPing / MapPing mismatch typing bridging
							setPings((prev) => [...prev, ping].slice(-20));
							setTimeout(() => {
								setPings((prev) =>
									prev.filter((p) => p.createdAt !== ping.createdAt),
								);
							}, 3000);
							break;
						}
						case "ruler": {
							const seg = payload.payload as VTTRulerSegment;
							setRulerSegments((prev) => [
								...prev.filter((s) => s.userId !== seg.userId),
								seg,
							]);
							break;
						}
						case "ruler_clear": {
							const { userId: clearUid } = payload.payload as {
								userId: string;
							};
							setRulerSegments((prev) =>
								prev.filter((s) => s.userId !== clearUid),
							);
							break;
						}
						case "handout_share": {
							const incoming = payload.payload as VTTHandoutShare;
							if (!incoming.sharedById) break;
							const sender = presenceUsers.get(incoming.sharedById);
							if (!sender) break;
							// Only accept from DM if a DM is known in presence; otherwise accept from any known user
							const dmPresent = Array.from(presenceUsers.values()).some(
								(u) => u.role === "dm",
							);
							if (dmPresent && sender.role !== "dm") break;
							setSharedHandout(incoming);
							if (handoutTimeoutRef.current)
								clearTimeout(handoutTimeoutRef.current);
							handoutTimeoutRef.current = setTimeout(
								() => setSharedHandout(null),
								30000,
							);
							break;
						}
					}

					// External handlers
					emit(payload.type, payload.payload);
				},
			)
			.on("presence", { event: "sync" }, () => {
				const state = ch.presenceState<PresencePayload>();
				const next = new Map<string, VTTPresenceUser>();
				for (const [_key, presences] of Object.entries(state)) {
					for (const presence of presences as (PresencePayload & {
						presence_ref?: string;
					})[]) {
						const uid = presence.user_id || "unknown";
						if (uid === userId) continue; // skip self
						next.set(uid, {
							userId: uid,
							userName: presence.user_name || "Anonymous",
							role: presence.role || "player",
							cursor: presence.cursor,
							color: presence.color || getUserColor(uid),
							lastSeen: Date.now(),
						});
					}
				}
				setPresenceUsers(next);
			})
			.subscribe((status) => {
				const connected = status === "SUBSCRIBED";
				setIsConnected(connected);
				if (connected) {
					ch.track({
						user_id: userId,
						user_name: userName,
						role: isDM ? "dm" : "player",
						color: userColor,
					});
				}
			});

		channelRef.current = ch;

		// Load recent chat messages from DB
		if (isSupabaseConfigured) {
			void supabase
				.from("vtt_chat_messages")
				.select("*")
				.eq("campaign_id", campaignId)
				.order("created_at", { ascending: false })
				.limit(50)
				.then(({ data }: { data: any[] | null }) => {
					if (data && data.length > 0) {
						const msgs: VTTChatMessage[] = data.reverse().map((row: any) => ({
							id: row.id,
							userId: row.user_id || "unknown",
							userName: row.user_name || "Anonymous",
							message: row.message || "",
							type: row.message_type || "chat",
							diceFormula: row.dice_formula || undefined,
							diceResult: row.dice_result ?? undefined,
							timestamp: new Date(row.created_at).getTime(),
						}));
						setChatMessages((prev) => {
							// Merge: keep DB messages + any local messages not in DB
							const dbIds = new Set(msgs.map((m) => m.id));
							const localOnly = prev.filter((m) => !dbIds.has(m.id));
							return [...msgs, ...localOnly].slice(-200);
						});
					}
				});
		}

		return () => {
			ch.unsubscribe();
			channelRef.current = null;
			setIsConnected(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		channelName,
		campaignId, // External handlers
		emit,
		isDM,
		presenceUsers.get,
		presenceUsers.values,
		userColor,
		userId,
		userName,
	]);

	const activeUsers = useMemo(
		() => Array.from(presenceUsers.values()),
		[presenceUsers],
	);

	return {
		// Connection
		isConnected,
		activeUsers,
		userId,
		userName,
		userColor,

		// Subscriptions
		on,

		// Token broadcasts
		broadcastTokenMove,
		broadcastTokenUpdate,
		broadcastTokenAdd,
		broadcastTokenRemove,

		// Scene broadcasts
		broadcastSceneChange,
		broadcastSceneSync,

		// Fog
		broadcastFogUpdate,

		// Drawings
		broadcastDrawingUpdate,

		// Chat (with slash command support)
		chatMessages,
		sendChatMessage,
		processChat,

		// Dice (Roll20-class: adv/dis, kh/kl, exploding, multi-term)
		rollAndBroadcast,

		// Initiative + turn management
		initiativeState,
		broadcastInitiativeUpdate,
		nextTurn,
		prevTurn,
		endCombat,

		// Pings
		pings,
		sendPing,

		// Cursor
		updateCursor,

		// Ruler (live measurement visible to all)
		rulerSegments,
		broadcastRuler,
		clearRuler,

		// Handout sharing
		sharedHandout,
		shareHandout,
		dismissHandout,

		// Macros
		macros,
		addMacro,
		removeMacro,
		executeMacro,
	};
}
