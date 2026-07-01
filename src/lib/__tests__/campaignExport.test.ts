import { describe, expect, it } from "vitest";
import {
	buildCampaignContentJson,
	buildCampaignMarkdown,
	buildSessionLogModel,
	type CampaignExportInput,
	formatRollLine,
	summarizeCampaignRules,
} from "@/lib/campaignExport";

const input: CampaignExportInput = {
	campaignName: "Gloamreach Nights",
	rules: {
		economy_enabled: true,
		economy_max_loot_value: 500,
		economy_max_relic_value: null,
		protocol_enforcement_enabled: false,
		failure_injection_enabled: true,
		failure_injection_rate: 25,
		failure_injection_note: "Quiet stalks the careless",
	},
	wiki: [
		{ title: "The Quiet", content: "An unseen predator.", category: "Lore" },
		{ title: "Old Man Crane", content: "Native guide.", category: "NPCs" },
	],
	notes: [
		{
			title: "Session 1",
			content: "Party fled the marsh.",
			category: "recap",
			is_shared: true,
		},
		{ title: "Secret", content: null, category: "warden" },
	],
	rolls: [
		{
			character_name: "Aria",
			dice_formula: "1d20+5",
			result: 18,
			roll_type: "attack",
			context: "vs stalker",
			created_at: "2026-06-30T00:00:00Z",
		},
	],
};

describe("campaign markdown export", () => {
	const md = buildCampaignMarkdown(input);

	it("includes the campaign title and every populated section", () => {
		expect(md).toContain("# Gloamreach Nights");
		expect(md).toContain("## Protocol Rules");
		expect(md).toContain("## Wiki");
		expect(md).toContain("## Notes");
		expect(md).toContain("## Recent Rolls");
	});

	it("groups wiki + notes by category and renders content", () => {
		expect(md).toContain("### Lore");
		expect(md).toContain("#### The Quiet");
		expect(md).toContain("An unseen predator.");
		expect(md).toContain("### recap");
		expect(md).toContain("#### Session 1 _(shared)_");
		// Empty note content falls back rather than printing "null".
		expect(md).not.toContain("null");
		expect(md).toContain("_(empty)_");
	});

	it("omits empty sections", () => {
		const sparse = buildCampaignMarkdown({ campaignName: "Bare" });
		expect(sparse).toContain("## Protocol Rules");
		expect(sparse).not.toContain("## Wiki");
		expect(sparse).not.toContain("## Notes");
		expect(sparse).not.toContain("## Recent Rolls");
		expect(sparse).not.toContain("## Roster");
	});

	it("renders a roster table when members are present", () => {
		const withRoster = buildCampaignMarkdown({
			campaignName: "Crew",
			members: [
				{ name: "Aria", role: "warden", level: 5, job: "Vanguard" },
				{ name: "Unlinked Ascendant", role: "ascendant" },
			],
		});
		expect(withRoster).toContain("## Roster (2)");
		expect(withRoster).toContain("| Aria | warden | 5 | Vanguard |");
		expect(withRoster).toContain("| Unlinked Ascendant | ascendant | — | — |");
	});
});

describe("campaign content JSON export", () => {
	it("produces a portable, normalized shape", () => {
		const json = buildCampaignContentJson(input);
		expect(json.campaign).toBe("Gloamreach Nights");
		expect(json.rules?.failure_injection_rate).toBe(25);
		expect(json.wiki).toHaveLength(2);
		expect(json.notes[0]).toMatchObject({
			title: "Session 1",
			category: "recap",
			is_shared: true,
		});
		// Null content is normalized to an empty string for portability.
		expect(json.notes[1].content).toBe("");
	});
});

describe("session-log model + helpers", () => {
	it("summarizes rules into readable lines", () => {
		const lines = summarizeCampaignRules(input.rules);
		expect(lines).toContain("Economy Enforcement: On");
		expect(lines).toContain("Protocol Enforcement: Off");
		expect(lines.some((l) => l.includes("25%"))).toBe(true);
	});

	it("formats a roll line", () => {
		expect(formatRollLine(input.rolls?.[0] as never)).toBe(
			"Aria — attack: 18 (1d20+5) — vs stalker",
		);
	});

	it("builds a session-log model with rules, rolls, and notes sections", () => {
		const model = buildSessionLogModel(input);
		expect(model.title).toBe("Gloamreach Nights");
		const headings = model.sections.map((s) => s.heading);
		expect(headings).toEqual([
			"Protocol Rules",
			"Recent Rolls",
			"Session Notes",
		]);
		const rollSection = model.sections.find(
			(s) => s.heading === "Recent Rolls",
		);
		expect(rollSection?.lines[0]).toContain("Aria");
	});

	it("falls back gracefully when empty", () => {
		const model = buildSessionLogModel({ campaignName: "Empty" });
		const rolls = model.sections.find((s) => s.heading === "Recent Rolls");
		expect(rolls?.lines).toEqual(["No rolls recorded yet."]);
	});
});
