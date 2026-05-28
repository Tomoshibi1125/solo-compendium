import { describe, expect, it } from "vitest";
import {
	canEditNote,
	canSeeNoteExists,
	canViewNote,
	createPrivacySettings,
	createSecuredNote,
	filterReadableNotes,
	filterVisibleNotes,
	grantPlayerPermission,
	makePrivate,
	revokePlayerPermission,
	type SecuredNote,
	setNoteVisibility,
	shareWithAll,
} from "@/lib/notePrivacy";

const WARDEN_ID = "warden-1";
const PLAYER_A = "player-a";
const PLAYER_B = "player-b";

const makeNote = (overrides: Partial<SecuredNote> = {}): SecuredNote =>
	createSecuredNote(
		overrides.title ?? "Test Note",
		overrides.content ?? "Body",
		overrides.campaignId ?? "campaign-1",
		overrides.privacy?.ownerId ?? WARDEN_ID,
		overrides.category ?? "campaign_note",
		overrides.privacy?.visibility ?? "private",
	);

describe("createPrivacySettings", () => {
	it("returns a private default with empty permissions", () => {
		const settings = createPrivacySettings(WARDEN_ID);
		expect(settings.visibility).toBe("private");
		expect(settings.ownerId).toBe(WARDEN_ID);
		expect(settings.playerPermissions).toEqual({});
		expect(settings.showTitleOnly).toBe(false);
	});
});

describe("createSecuredNote", () => {
	it("creates a note with the specified visibility", () => {
		const note = createSecuredNote(
			"Title",
			"Content",
			"campaign-1",
			WARDEN_ID,
			"journal",
			"shared",
		);
		expect(note.title).toBe("Title");
		expect(note.content).toBe("Content");
		expect(note.privacy.visibility).toBe("shared");
		expect(note.privacy.ownerId).toBe(WARDEN_ID);
		expect(note.category).toBe("journal");
		expect(note.id).toMatch(/^note-/);
	});
});

describe("canViewNote", () => {
	it("Warden can always view", () => {
		const note = makeNote();
		expect(canViewNote(note, PLAYER_A, true)).toBe(true);
	});

	it("owner can always view", () => {
		const note = makeNote();
		expect(canViewNote(note, WARDEN_ID, false)).toBe(true);
	});

	it("private note is hidden from non-owner players", () => {
		const note = makeNote();
		expect(canViewNote(note, PLAYER_A, false)).toBe(false);
	});

	it("shared note is visible to all", () => {
		const note = shareWithAll(makeNote());
		expect(canViewNote(note, PLAYER_A, false)).toBe(true);
		expect(canViewNote(note, PLAYER_B, false)).toBe(true);
	});

	it("per-player note visible only to granted players", () => {
		let note = makeNote();
		note = grantPlayerPermission(note, PLAYER_A, "read");
		expect(canViewNote(note, PLAYER_A, false)).toBe(true);
		expect(canViewNote(note, PLAYER_B, false)).toBe(false);
	});

	it("per-player write permission also grants view", () => {
		let note = makeNote();
		note = grantPlayerPermission(note, PLAYER_B, "write");
		expect(canViewNote(note, PLAYER_B, false)).toBe(true);
	});
});

describe("canEditNote", () => {
	it("Warden can always edit", () => {
		const note = makeNote();
		expect(canEditNote(note, PLAYER_A, true)).toBe(true);
	});

	it("owner can always edit", () => {
		const note = makeNote();
		expect(canEditNote(note, WARDEN_ID, false)).toBe(true);
	});

	it("shared note cannot be edited by non-owner", () => {
		const note = shareWithAll(makeNote());
		expect(canEditNote(note, PLAYER_A, false)).toBe(false);
	});

	it("per-player read permission does not grant edit", () => {
		let note = makeNote();
		note = grantPlayerPermission(note, PLAYER_A, "read");
		expect(canEditNote(note, PLAYER_A, false)).toBe(false);
	});

	it("per-player write permission grants edit", () => {
		let note = makeNote();
		note = grantPlayerPermission(note, PLAYER_A, "write");
		expect(canEditNote(note, PLAYER_A, false)).toBe(true);
	});
});

describe("canSeeNoteExists", () => {
	it("Warden always sees note existence", () => {
		const note = makeNote();
		expect(canSeeNoteExists(note, PLAYER_A, true)).toBe(true);
	});

	it("owner always sees note existence", () => {
		const note = makeNote();
		expect(canSeeNoteExists(note, WARDEN_ID, false)).toBe(true);
	});

	it("private note is invisible to others", () => {
		const note = makeNote();
		expect(canSeeNoteExists(note, PLAYER_A, false)).toBe(false);
	});

	it("shared note is visible to all", () => {
		const note = shareWithAll(makeNote());
		expect(canSeeNoteExists(note, PLAYER_A, false)).toBe(true);
	});

	it("per-player with showTitleOnly reveals existence to non-granted players", () => {
		let note = makeNote();
		note = grantPlayerPermission(note, PLAYER_A, "read");
		note = {
			...note,
			privacy: { ...note.privacy, showTitleOnly: true },
		};
		// Player A has read access
		expect(canSeeNoteExists(note, PLAYER_A, false)).toBe(true);
		// Player B has no access but showTitleOnly is true
		expect(canSeeNoteExists(note, PLAYER_B, false)).toBe(true);
	});

	it("per-player without showTitleOnly hides from non-granted players", () => {
		let note = makeNote();
		note = grantPlayerPermission(note, PLAYER_A, "read");
		expect(canSeeNoteExists(note, PLAYER_B, false)).toBe(false);
	});
});

describe("mutation helpers", () => {
	it("setNoteVisibility updates visibility", () => {
		const note = makeNote();
		const shared = setNoteVisibility(note, "shared");
		expect(shared.privacy.visibility).toBe("shared");
		expect(shared).not.toBe(note);
		expect(note.privacy.visibility).toBe("private");
	});

	it("grantPlayerPermission sets per-player visibility", () => {
		const note = makeNote();
		const updated = grantPlayerPermission(note, PLAYER_A, "read");
		expect(updated.privacy.visibility).toBe("per-player");
		expect(updated.privacy.playerPermissions[PLAYER_A]).toBe("read");
	});

	it("revokePlayerPermission removes a player entry", () => {
		let note = makeNote();
		note = grantPlayerPermission(note, PLAYER_A, "read");
		note = grantPlayerPermission(note, PLAYER_B, "write");
		const updated = revokePlayerPermission(note, PLAYER_A);
		expect(updated.privacy.playerPermissions[PLAYER_A]).toBeUndefined();
		expect(updated.privacy.playerPermissions[PLAYER_B]).toBe("write");
	});

	it("shareWithAll sets shared visibility", () => {
		const note = shareWithAll(makeNote());
		expect(note.privacy.visibility).toBe("shared");
	});

	it("makePrivate sets private visibility", () => {
		const note = makePrivate(shareWithAll(makeNote()));
		expect(note.privacy.visibility).toBe("private");
	});
});

describe("filterVisibleNotes", () => {
	const privateNote = makeNote();
	const sharedNote = shareWithAll(makeNote());
	const perPlayerNote = grantPlayerPermission(makeNote(), PLAYER_A, "read");
	const allNotes = [privateNote, sharedNote, perPlayerNote];

	it("Warden sees all notes", () => {
		expect(filterVisibleNotes(allNotes, PLAYER_B, true)).toHaveLength(3);
	});

	it("player sees shared and granted notes only", () => {
		const visible = filterVisibleNotes(allNotes, PLAYER_A, false);
		expect(visible).toContain(sharedNote);
		expect(visible).toContain(perPlayerNote);
		expect(visible).not.toContain(privateNote);
	});

	it("player without grants sees only shared", () => {
		const visible = filterVisibleNotes(allNotes, PLAYER_B, false);
		expect(visible).toHaveLength(1);
		expect(visible[0]).toBe(sharedNote);
	});
});

describe("filterReadableNotes", () => {
	const privateNote = makeNote();
	const sharedNote = shareWithAll(makeNote());
	const allNotes = [privateNote, sharedNote];

	it("Warden can read all", () => {
		expect(filterReadableNotes(allNotes, PLAYER_A, true)).toHaveLength(2);
	});

	it("player can read shared but not private", () => {
		const readable = filterReadableNotes(allNotes, PLAYER_A, false);
		expect(readable).toHaveLength(1);
		expect(readable[0]).toBe(sharedNote);
	});
});
