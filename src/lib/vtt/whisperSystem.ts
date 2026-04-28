/**
 * VTT Whisper / Private Message System
 *
 * Handles private messages between Wardens and Ascendants in the VTT chat.
 * Whispers are only visible to sender and recipient(s).
 */

// ─── Types ──────────────────────────────────────────────────
export interface WhisperMessage {
	id: string;
	senderId: string;
	senderName: string;
	recipientIds: string[]; // empty = broadcast (not a whisper)
	recipientNames: string[];
	content: string;
	timestamp: string; // ISO
	type: "whisper" | "warden_whisper" | "roll_whisper";
	rollData?: {
		formula: string;
		result: number;
		details: string;
	};
}

export interface ChatParticipant {
	id: string;
	name: string;
	role: "warden" | "ascendant" | "co-warden";
	characterName?: string;
}

// ─── Command Parsing ────────────────────────────────────────

/**
 * Parse whisper commands from chat input
 * Supported formats:
 *   /w PlayerName message
 *   /whisper PlayerName message
 *   /Warden message (whisper to Warden only)
 *   /r formula (public roll)
 *   /wardenroll formula (Warden-only roll)
 */
export function parseWhisperCommand(
	input: string,
	participants: ChatParticipant[],
	senderId: string,
): {
	isWhisper: boolean;
	recipientIds: string[];
	recipientNames: string[];
	content: string;
	type: WhisperMessage["type"];
} | null {
	const trimmed = input.trim();

	// /Warden message — whisper to Warden
	const gmMatch = trimmed.match(/^\/Warden\s+(.+)/i);
	if (gmMatch) {
		const gms = participants.filter(
			(p) => p.role === "warden" || p.role === "co-warden",
		);
		return {
			isWhisper: true,
			recipientIds: gms.map((g) => g.id),
			recipientNames: gms.map((g) => g.name),
			content: gmMatch[1],
			type: "warden_whisper",
		};
	}

	// /w PlayerName message or /whisper PlayerName message
	const whisperMatch = trimmed.match(/^\/(?:w|whisper)\s+"?([^"]+)"?\s+(.+)/i);
	if (whisperMatch) {
		const targetName = whisperMatch[1].toLowerCase().trim();
		const message = whisperMatch[2];

		const target = participants.find(
			(p) =>
				p.name.toLowerCase() === targetName ||
				p.characterName?.toLowerCase() === targetName,
		);

		if (!target) {
			return null; // Unknown recipient
		}

		return {
			isWhisper: true,
			recipientIds: [target.id],
			recipientNames: [target.name],
			content: message,
			type: "whisper",
		};
	}

	// /wardenroll formula — roll visible only to Warden
	const gmrollMatch = trimmed.match(/^\/wardenroll\s+(.+)/i);
	if (gmrollMatch) {
		const gms = participants.filter(
			(p) => p.role === "warden" || p.role === "co-warden",
		);
		return {
			isWhisper: true,
			recipientIds: [...gms.map((g) => g.id), senderId],
			recipientNames: [...gms.map((g) => g.name)],
			content: gmrollMatch[1],
			type: "roll_whisper",
		};
	}

	// Not a whisper command
	return null;
}

/**
 * Check if a whisper message is visible to a specific user
 */
export function isMessageVisibleTo(
	message: WhisperMessage,
	userId: string,
): boolean {
	if (message.recipientIds.length === 0) return true; // Broadcast
	return message.senderId === userId || message.recipientIds.includes(userId);
}

/**
 * Create a whisper message
 */
export function createWhisperMessage(
	senderId: string,
	senderName: string,
	recipientIds: string[],
	recipientNames: string[],
	content: string,
	type: WhisperMessage["type"] = "whisper",
	rollData?: WhisperMessage["rollData"],
): WhisperMessage {
	return {
		id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		senderId,
		senderName,
		recipientIds,
		recipientNames,
		content,
		timestamp: new Date().toISOString(),
		type,
		rollData,
	};
}

/**
 * Format whisper display text
 */
export function formatWhisperLabel(
	message: WhisperMessage,
	currentUserId: string,
): string {
	if (message.type === "warden_whisper") {
		return message.senderId === currentUserId
			? `Whisper to Warden`
			: `${message.senderName} whispers to you`;
	}

	if (message.senderId === currentUserId) {
		return `Whisper to ${message.recipientNames.join(", ")}`;
	}

	return `${message.senderName} whispers to you`;
}
