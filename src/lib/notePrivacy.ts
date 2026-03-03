/**
 * Note Privacy Engine
 *
 * Provides per-player note visibility control for campaign notes, journal
 * entries, and handouts. Supports private (DM-only), shared (all players),
 * and per-player visibility with read/write permission levels.
 *
 * Roll20 / Foundry VTT parity feature.
 */

// ─── Types ──────────────────────────────────────────────────

export type NoteVisibility = "private" | "shared" | "per-player";
export type NotePermission = "none" | "read" | "write";

export interface NotePrivacySettings {
	/** Who can see this note */
	visibility: NoteVisibility;
	/** The user who owns the note (usually DM) */
	ownerId: string;
	/** Per-player permissions (used when visibility is 'per-player') */
	playerPermissions: Record<string, NotePermission>;
	/** Whether players can see the note exists but not its content */
	showTitleOnly: boolean;
	/** Optional password protection */
	passwordHash?: string;
}

export interface SecuredNote {
	id: string;
	title: string;
	content: string;
	campaignId: string;
	privacy: NotePrivacySettings;
	createdAt: string;
	updatedAt: string;
	/** Category for filtering */
	category:
		| "journal"
		| "handout"
		| "campaign_note"
		| "session_note"
		| "character_note";
}

// ─── Factory Functions ──────────────────────────────────────

/**
 * Create default privacy settings (private to DM)
 */
export function createPrivacySettings(ownerId: string): NotePrivacySettings {
	return {
		visibility: "private",
		ownerId,
		playerPermissions: {},
		showTitleOnly: false,
	};
}

/**
 * Create a new secured note
 */
export function createSecuredNote(
	title: string,
	content: string,
	campaignId: string,
	ownerId: string,
	category: SecuredNote["category"] = "campaign_note",
	visibility: NoteVisibility = "private",
): SecuredNote {
	return {
		id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		title,
		content,
		campaignId,
		privacy: {
			visibility,
			ownerId,
			playerPermissions: {},
			showTitleOnly: false,
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		category,
	};
}

// ─── Permission Checks ──────────────────────────────────────

/**
 * Check if a user can VIEW a note's content
 */
export function canViewNote(
	note: SecuredNote,
	userId: string,
	isGM: boolean,
): boolean {
	if (isGM) return true;
	if (note.privacy.ownerId === userId) return true;

	switch (note.privacy.visibility) {
		case "shared":
			return true;
		case "private":
			return false;
		case "per-player": {
			const perm = note.privacy.playerPermissions[userId];
			return perm === "read" || perm === "write";
		}
		default:
			return false;
	}
}

/**
 * Check if a user can EDIT a note's content
 */
export function canEditNote(
	note: SecuredNote,
	userId: string,
	isGM: boolean,
): boolean {
	if (isGM) return true;
	if (note.privacy.ownerId === userId) return true;

	if (note.privacy.visibility === "per-player") {
		return note.privacy.playerPermissions[userId] === "write";
	}

	return false;
}

/**
 * Check if a user can see the note exists (title visible in sidebar)
 */
export function canSeeNoteExists(
	note: SecuredNote,
	userId: string,
	isGM: boolean,
): boolean {
	if (isGM) return true;
	if (note.privacy.ownerId === userId) return true;

	if (note.privacy.visibility === "shared") return true;

	if (note.privacy.visibility === "per-player") {
		const perm = note.privacy.playerPermissions[userId];
		if (perm === "read" || perm === "write") return true;
		return note.privacy.showTitleOnly;
	}

	return false;
}

// ─── Permission Mutation ────────────────────────────────────

/**
 * Set visibility for a note
 */
export function setNoteVisibility(
	note: SecuredNote,
	visibility: NoteVisibility,
): SecuredNote {
	return {
		...note,
		privacy: { ...note.privacy, visibility },
		updatedAt: new Date().toISOString(),
	};
}

/**
 * Grant a player permission on a note
 */
export function grantPlayerPermission(
	note: SecuredNote,
	playerId: string,
	permission: NotePermission,
): SecuredNote {
	return {
		...note,
		privacy: {
			...note.privacy,
			visibility: "per-player",
			playerPermissions: {
				...note.privacy.playerPermissions,
				[playerId]: permission,
			},
		},
		updatedAt: new Date().toISOString(),
	};
}

/**
 * Revoke a player's permission (set to 'none')
 */
export function revokePlayerPermission(
	note: SecuredNote,
	playerId: string,
): SecuredNote {
	const { [playerId]: _, ...remaining } = note.privacy.playerPermissions;
	return {
		...note,
		privacy: {
			...note.privacy,
			playerPermissions: remaining,
		},
		updatedAt: new Date().toISOString(),
	};
}

/**
 * Share a note with all campaign members (set to 'shared')
 */
export function shareWithAll(note: SecuredNote): SecuredNote {
	return setNoteVisibility(note, "shared");
}

/**
 * Make a note private (DM-only)
 */
export function makePrivate(note: SecuredNote): SecuredNote {
	return setNoteVisibility(note, "private");
}

// ─── Filtering ──────────────────────────────────────────────

/**
 * Filter notes that a user can see (for sidebar rendering)
 */
export function filterVisibleNotes(
	notes: SecuredNote[],
	userId: string,
	isGM: boolean,
): SecuredNote[] {
	return notes.filter((n) => canSeeNoteExists(n, userId, isGM));
}

/**
 * Filter notes that a user can read (content accessible)
 */
export function filterReadableNotes(
	notes: SecuredNote[],
	userId: string,
	isGM: boolean,
): SecuredNote[] {
	return notes.filter((n) => canViewNote(n, userId, isGM));
}
