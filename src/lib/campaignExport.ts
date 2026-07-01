/**
 * Campaign export serializers (Part B / B1).
 *
 * Pure, side-effect-free builders that turn a campaign's notes + wiki + rules
 * (+ recent rolls) into the shapes the shared {@link "@/components/shared/ExportMenu"}
 * consumes: a Markdown document, a portable content JSON, and a structured
 * session-log model the PDF renderer (`campaignPdf.ts`) draws. Kept React/DOM-free
 * so the serialization is trivially unit-testable.
 */

export interface CampaignExportNote {
	title: string;
	content: string | null;
	category: string;
	is_shared?: boolean;
}

export interface CampaignExportWikiArticle {
	title: string;
	content: string | null;
	category: string | null;
}

export interface CampaignExportRules {
	economy_enabled: boolean;
	economy_max_loot_value: number | null;
	economy_max_relic_value: number | null;
	protocol_enforcement_enabled: boolean;
	failure_injection_enabled: boolean;
	failure_injection_rate: number;
	failure_injection_note?: string | null;
}

export interface CampaignExportRoll {
	character_name: string | null;
	dice_formula: string;
	result: number;
	roll_type: string | null;
	context?: string | null;
	created_at: string;
}

export interface CampaignExportMember {
	name: string;
	role: string;
	level?: number | null;
	job?: string | null;
}

export interface CampaignExportInput {
	campaignName: string;
	rules?: CampaignExportRules | null;
	members?: CampaignExportMember[];
	notes?: CampaignExportNote[];
	wiki?: CampaignExportWikiArticle[];
	rolls?: CampaignExportRoll[];
}

const onOff = (value: boolean): string => (value ? "On" : "Off");
const capLabel = (value: number | null): string =>
	value == null ? "—" : `${value.toLocaleString()} Credits`;

/** Human-readable lines summarising the protocol rule settings. */
export const summarizeCampaignRules = (
	rules: CampaignExportRules | null | undefined,
): string[] => {
	if (!rules) return ["No protocol rules configured."];
	const lines = [
		`Economy Enforcement: ${onOff(rules.economy_enabled)}`,
		`Loot Value Cap: ${capLabel(rules.economy_max_loot_value)}`,
		`Relic Value Cap: ${capLabel(rules.economy_max_relic_value)}`,
		`Protocol Enforcement: ${onOff(rules.protocol_enforcement_enabled)}`,
		`Failure Injection: ${onOff(rules.failure_injection_enabled)}${
			rules.failure_injection_enabled
				? ` (${rules.failure_injection_rate}%)`
				: ""
		}`,
	];
	if (rules.failure_injection_note) {
		lines.push(`Failure Note: ${rules.failure_injection_note}`);
	}
	return lines;
};

/** One readable line per roll, e.g. `Aria — attack: 18 (1d20+5) — vs goblin`. */
export const formatRollLine = (roll: CampaignExportRoll): string => {
	const who = roll.character_name?.trim() || "Unknown";
	const kind = roll.roll_type?.trim();
	const head = kind ? `${who} — ${kind}` : who;
	const ctx = roll.context?.trim() ? ` — ${roll.context.trim()}` : "";
	return `${head}: ${roll.result} (${roll.dice_formula})${ctx}`;
};

/** Stable category → items grouping that preserves first-seen category order. */
const groupByCategory = <T extends { category?: string | null }>(
	items: ReadonlyArray<T>,
	fallback: string,
): Array<{ category: string; items: T[] }> => {
	const order: string[] = [];
	const map = new Map<string, T[]>();
	for (const item of items) {
		const key = (item.category || "").trim() || fallback;
		if (!map.has(key)) {
			map.set(key, []);
			order.push(key);
		}
		map.get(key)?.push(item);
	}
	return order.map((category) => ({
		category,
		items: map.get(category) ?? [],
	}));
};

/**
 * Render the campaign's notes + wiki + rules as a single Markdown document.
 * Sections are omitted when empty so a sparse campaign still reads cleanly.
 */
export const buildCampaignMarkdown = (input: CampaignExportInput): string => {
	const {
		campaignName,
		rules,
		members = [],
		notes = [],
		wiki = [],
		rolls = [],
	} = input;
	const out: string[] = [];
	out.push(`# ${campaignName || "Untitled Campaign"}`);
	out.push("");
	out.push(`_Exported ${new Date().toISOString()} · Rift Ascendant_`);
	out.push("");

	out.push("## Protocol Rules");
	for (const line of summarizeCampaignRules(rules)) out.push(`- ${line}`);
	out.push("");

	if (members.length > 0) {
		out.push(`## Roster (${members.length})`);
		out.push("| Ascendant | Role | Level | Job |");
		out.push("| --- | --- | --- | --- |");
		for (const m of members) {
			out.push(
				`| ${m.name} | ${m.role} | ${m.level ?? "—"} | ${m.job ?? "—"} |`,
			);
		}
		out.push("");
	}

	if (wiki.length > 0) {
		out.push("## Wiki");
		for (const group of groupByCategory(wiki, "General")) {
			out.push(`### ${group.category}`);
			for (const article of group.items) {
				out.push(`#### ${article.title}`);
				out.push(article.content?.trim() || "_(empty)_");
				out.push("");
			}
		}
	}

	if (notes.length > 0) {
		out.push("## Notes");
		for (const group of groupByCategory(notes, "general")) {
			out.push(`### ${group.category}`);
			for (const note of group.items) {
				const shared = note.is_shared ? " _(shared)_" : "";
				out.push(`#### ${note.title}${shared}`);
				out.push(note.content?.trim() || "_(empty)_");
				out.push("");
			}
		}
	}

	if (rolls.length > 0) {
		out.push("## Recent Rolls");
		for (const roll of rolls) out.push(`- ${formatRollLine(roll)}`);
		out.push("");
	}

	return `${out.join("\n").trimEnd()}\n`;
};

/** Portable content JSON (distinct from the full redacted server bundle). */
export const buildCampaignContentJson = (input: CampaignExportInput) => ({
	campaign: input.campaignName,
	exported_at: new Date().toISOString(),
	rules: input.rules ?? null,
	members: (input.members ?? []).map((m) => ({
		name: m.name,
		role: m.role,
		level: m.level ?? null,
		job: m.job ?? null,
	})),
	wiki: (input.wiki ?? []).map((a) => ({
		title: a.title,
		category: a.category ?? "General",
		content: a.content ?? "",
	})),
	notes: (input.notes ?? []).map((n) => ({
		title: n.title,
		category: n.category,
		is_shared: n.is_shared ?? false,
		content: n.content ?? "",
	})),
});

export interface SessionLogSection {
	heading: string;
	lines: string[];
}

export interface SessionLogModel {
	title: string;
	generatedAt: string;
	sections: SessionLogSection[];
}

/**
 * Structured, render-agnostic model for the PDF session-log. The PDF renderer
 * and the tests both consume this so the content is verified without parsing
 * PDF bytes.
 */
export const buildSessionLogModel = (
	input: CampaignExportInput,
): SessionLogModel => {
	const { campaignName, rules, notes = [], rolls = [] } = input;
	const sections: SessionLogSection[] = [];

	sections.push({
		heading: "Protocol Rules",
		lines: summarizeCampaignRules(rules),
	});

	sections.push({
		heading: "Recent Rolls",
		lines:
			rolls.length > 0 ? rolls.map(formatRollLine) : ["No rolls recorded yet."],
	});

	const noteLines: string[] = [];
	for (const note of notes) {
		noteLines.push(`${note.title}${note.is_shared ? " (shared)" : ""}`);
		const body = note.content?.trim();
		if (body) noteLines.push(body);
		noteLines.push("");
	}
	sections.push({
		heading: "Session Notes",
		lines: noteLines.length > 0 ? noteLines : ["No notes recorded yet."],
	});

	return {
		title: campaignName || "Untitled Campaign",
		generatedAt: new Date().toISOString(),
		sections,
	};
};
