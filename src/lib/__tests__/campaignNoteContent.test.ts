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
			"Alpha\n[[secret:GM Only]]Bravo[[/secret]]\nCharlie",
		);

		expect(segments).toEqual([
			{ kind: "text", content: "Alpha\n" },
			{ kind: "secret", label: "GM Only", content: "Bravo" },
			{ kind: "text", content: "\nCharlie" },
		]);
	});
});
