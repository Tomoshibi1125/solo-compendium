import { describe, expect, it } from "vitest";
import {
	decodeCampaignNoteContent,
	encodeCampaignNoteContent,
	parseCampaignNoteSegments,
} from "@/lib/campaignNoteContent";
import { createPrivacySettings } from "@/lib/notePrivacy";

describe("campaignNoteContent", () => {
	it("round-trips embedded privacy metadata", () => {
		const privacy = createPrivacySettings("warden-1");
		privacy.visibility = "per-player";
		privacy.showTitleOnly = true;
		privacy.playerPermissions = {
			playerA: "read",
			playerB: "write",
		};

		const encoded = encodeCampaignNoteContent({
			body: "Visible text\n[[secret]]Hidden text[[/secret]]",
			privacy,
		});
		const decoded = decodeCampaignNoteContent({
			content: encoded,
			ownerId: "warden-1",
			isShared: false,
		});

		expect(decoded.body).toBe("Visible text\n[[secret]]Hidden text[[/secret]]");
		expect(decoded.privacy.visibility).toBe("per-player");
		expect(decoded.privacy.showTitleOnly).toBe(true);
		expect(decoded.privacy.playerPermissions).toEqual({
			playerA: "read",
			playerB: "write",
		});
	});

	it("falls back to legacy shared/private notes without metadata", () => {
		const decoded = decodeCampaignNoteContent({
			content: "Legacy note body",
			ownerId: "warden-1",
			isShared: true,
		});

		expect(decoded.body).toBe("Legacy note body");
		expect(decoded.privacy.visibility).toBe("shared");
		expect(decoded.hasEmbeddedMetadata).toBe(false);
	});

	it("parses secret blocks into ordered segments", () => {
		const segments = parseCampaignNoteSegments(
			"Alpha\n[[secret:Warden Only]]Bravo[[/secret]]\nCharlie",
		);

		expect(segments).toEqual([
			{ kind: "text", content: "Alpha\n", id: "text-0" },
			{
				kind: "secret",
				label: "Warden Only",
				content: "Bravo",
				id: "secret-1",
			},
			{ kind: "text", content: "\nCharlie", id: "text-2" },
		]);
	});

	it("parses secret blocks without labels", () => {
		const segments = parseCampaignNoteSegments(
			"Before[[secret]]Hidden[[/secret]]After",
		);
		expect(segments[1]).toEqual({
			kind: "secret",
			label: null,
			content: "Hidden",
			id: "secret-1",
		});
	});

	it("parses multiple consecutive secret blocks", () => {
		const segments = parseCampaignNoteSegments(
			"[[secret:A]]First[[/secret]][[secret:B]]Second[[/secret]]",
		);
		const secrets = segments.filter((s) => s.kind === "secret");
		expect(secrets).toHaveLength(2);
		expect(secrets[0].label).toBe("A");
		expect(secrets[1].label).toBe("B");
	});

	it("returns a single text segment when no secrets exist", () => {
		const segments = parseCampaignNoteSegments("Plain text only");
		expect(segments).toEqual([
			{ id: "text-0", kind: "text", content: "Plain text only" },
		]);
	});

	it("handles empty body gracefully", () => {
		const segments = parseCampaignNoteSegments("");
		expect(segments).toEqual([{ id: "text-0", kind: "text", content: "" }]);
	});

	it("handles null/empty content in decode", () => {
		const decoded = decodeCampaignNoteContent({
			content: null,
			ownerId: "owner-1",
			isShared: false,
		});
		expect(decoded.body).toBe("");
		expect(decoded.privacy.visibility).toBe("private");
		expect(decoded.hasEmbeddedMetadata).toBe(false);
	});

	it("encodes minimal privacy with empty permissions", () => {
		const privacy = createPrivacySettings("owner-1");
		const encoded = encodeCampaignNoteContent({ body: "Test", privacy });
		const decoded = decodeCampaignNoteContent({
			content: encoded,
			ownerId: "owner-1",
			isShared: false,
		});
		expect(decoded.privacy.visibility).toBe("private");
		expect(decoded.privacy.playerPermissions).toEqual({});
		expect(decoded.body).toBe("Test");
	});

	it("strips metadata prefix idempotently", () => {
		const privacy = createPrivacySettings("owner-1");
		privacy.visibility = "shared";
		const encoded = encodeCampaignNoteContent({ body: "Body", privacy });
		const reEncoded = encodeCampaignNoteContent({ body: encoded, privacy });
		const decoded = decodeCampaignNoteContent({
			content: reEncoded,
			ownerId: "owner-1",
			isShared: true,
		});
		expect(decoded.body).toBe("Body");
	});
});
