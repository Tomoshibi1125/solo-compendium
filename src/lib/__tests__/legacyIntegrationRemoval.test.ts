import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../../..");
const file = (relativePath: string) => resolve(ROOT, relativePath);

describe("legacy integration removal", () => {
	it("removes external notification and VTT client artifacts", () => {
		for (const relativePath of [
			"src/hooks/useNotifyDiscord.ts",
			"src/hooks/useCampaignHandouts.ts",
			"src/components/campaign/CampaignHandouts.tsx",
			"supabase/functions/notify-discord/index.ts",
			"scripts/register-discord-commands.ts",
			"docs/Protocol-Zero-VTT-Module.json",
			"docs/warden-tools-vtt-audit.md",
			"docs/warden-tools-vtt-fix-plan.md",
		]) {
			expect(existsSync(file(relativePath)), relativePath).toBe(false);
		}
	});

	it("keeps campaign sessions internal and free of external notification dispatch", () => {
		const sessions = readFileSync(
			file("src/components/campaign/CampaignSessionsPanel.tsx"),
			"utf8",
		);
		expect(sessions).not.toMatch(/discord|useNotify|notifyDiscord/i);
		expect(sessions).toMatch(/generateRecurrenceSchedule/);
		expect(sessions).toMatch(/buildIcsForCampaignSessions/);
		expect(sessions).toMatch(/useSendCampaignMessage/);
	});

	it("ships no retired fields, journal storage, or VTT styling", () => {
		for (const relativePath of [
			"src/components/campaign/CampaignSettings.tsx",
			"src/hooks/useCampaigns.ts",
			"src/hooks/useCampaignSandboxInjector.ts",
			"src/lib/guestStore.ts",
			"src/pages/CampaignDetail.tsx",
			"src/pages/CampaignBookView.tsx",
			"src/integrations/supabase/types.ts",
			"src/components/layout/Layout.tsx",
			"src/styles/mobile-responsive.css",
		]) {
			const source = readFileSync(file(relativePath), "utf8");
			expect(source, relativePath).not.toMatch(
				/discord_webhook|discord_app_id|discord_public_key|vtt_journal_entries|vtt-fullbleed|campaign_handouts|campaign-handouts/i,
			);
		}
	});

	it("adds a forward-only migration that removes the retired database surface", () => {
		const migration = readFileSync(
			file(
				"supabase/migrations/20260907000000_remove_discord_and_vtt_residue.sql",
			),
			"utf8",
		);
		expect(migration).toMatch(
			/DROP TABLE IF EXISTS public\.vtt_journal_entries CASCADE/,
		);
		expect(migration).toMatch(
			/DROP TABLE IF EXISTS public\.discord_command_audit CASCADE/,
		);
		expect(migration).toMatch(
			/DROP TABLE IF EXISTS public\.discord_account_links CASCADE/,
		);
		expect(migration).toMatch(/DROP COLUMN IF EXISTS discord_webhook_url/);
		expect(migration).toMatch(/DROP COLUMN IF EXISTS discord_app_id/);
		expect(migration).toMatch(/DROP COLUMN IF EXISTS discord_public_key/);
	});
});
