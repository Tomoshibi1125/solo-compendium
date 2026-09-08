import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import type { BookSection } from "./build-books";
import {
	glasslineArtCoverageSummary,
	glasslineFigure,
} from "./glassline_art_manifest";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");
const markdownPath = resolve(repoRoot, "docs/adventure-glassline-claim.md");
const adventureMarkdown = readFileSync(markdownPath, "utf8").replace(/\r\n/g, "\n");

interface MarkdownChunk {
	title: string;
	markdown: string;
}

const chunksByHeading = splitTopLevelSections(adventureMarkdown);

function sectionMarkdown(...headings: string[]): string {
	return headings
		.map((heading) => {
			const chunk = chunksByHeading.get(heading);
			if (!chunk) {
				throw new Error(`The Glassline Claim is missing required section "${heading}".`);
			}
			return `## ${chunk.title}\n\n${chunk.markdown.trim()}`;
		})
		.join("\n\n");
}

function openingMarkdown(): string {
	const firstSection = adventureMarkdown.search(/^## /m);
	const raw = adventureMarkdown.slice(0, firstSection === -1 ? undefined : firstSection).trim();
	return raw.replace(/^# The Glassline Claim\s*/i, "").trim();
}

function splitTopLevelSections(markdown: string): Map<string, MarkdownChunk> {
	const lines = markdown.split("\n");
	const sections = new Map<string, MarkdownChunk>();
	let currentTitle = "";
	let current: string[] = [];
	for (const line of lines) {
		const match = /^##\s+(.+?)\s*$/.exec(line);
		if (match) {
			if (currentTitle) {
				sections.set(currentTitle, {
					title: currentTitle,
					markdown: current.join("\n").trim(),
				});
			}
			currentTitle = match[1].trim();
			current = [];
			continue;
		}
		if (currentTitle) current.push(line);
	}
	if (currentTitle) {
		sections.set(currentTitle, {
			title: currentTitle,
			markdown: current.join("\n").trim(),
		});
	}
	return sections;
}

function body(markdown: string, figures: string[] = []): string {
	return `${figures.join("")}<div class="campaign-prose glassline-prose">${markdownToHtml(markdown)}</div>`;
}

function splitRow(line: string): string[] {
	let next = line.trim();
	if (next.startsWith("|")) next = next.slice(1);
	if (next.endsWith("|")) next = next.slice(0, -1);
	return next.split("|").map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
	return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function isHeading(line: string): boolean {
	return /^#{1,6}\s+/.test(line);
}

function isListStart(line: string): boolean {
	return /^\s*(?:[-*]|\d+\.)\s+/.test(line);
}

function isBlockquoteStart(line: string): boolean {
	return /^\s*>\s?/.test(line);
}

function isTableStart(lines: string[], index: number): boolean {
	return /\|/.test(lines[index] || "") && isTableSeparator(lines[index + 1] || "");
}

function markdownToHtml(markdown: string): string {
	const lines = markdown.split("\n");
	const out: string[] = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) {
			i++;
			continue;
		}
		if (/^\s*<!--\s*pagebreak\s*-->\s*$/.test(line)) {
			out.push('<div style="break-before: page; page-break-before: always;"></div>');
			i++;
			continue;
		}
		if (/^\s*---+\s*$/.test(line)) {
			out.push("<hr/>");
			i++;
			continue;
		}
		const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
		if (heading) {
			const level = Math.min(4, Math.max(2, heading[1].length + 1));
			out.push(`<h${level}>${inlineMd(heading[2])}</h${level}>`);
			i++;
			continue;
		}
		if (isTableStart(lines, i)) {
			const header = splitRow(lines[i]);
			i += 2;
			const rows: string[][] = [];
			while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim()) {
				rows.push(splitRow(lines[i]));
				i++;
			}
			out.push(`<figure class="campaign-table-wrap"><table class="campaign-table"><thead><tr>${header
				.map((cell) => `<th>${inlineMd(cell)}</th>`)
				.join("")}</tr></thead><tbody>${rows
				.map(
					(row) =>
						`<tr>${row.map((cell) => `<td>${inlineMd(cell)}</td>`).join("")}</tr>`,
				)
				.join("")}</tbody></table></figure>`);
			continue;
		}
		if (isBlockquoteStart(line)) {
			const quoteLines: string[] = [];
			while (i < lines.length && isBlockquoteStart(lines[i])) {
				quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
				i++;
			}
			const paragraphs = quoteLines
				.join("\n")
				.split(/\n\s*\n/)
				.map((paragraph) => paragraph.trim())
				.filter(Boolean)
				.map((paragraph) => `<p>${inlineMd(paragraph.replace(/\n/g, " "))}</p>`)
				.join("");
			out.push(`<blockquote>${paragraphs}</blockquote>`);
			continue;
		}
		if (isListStart(line)) {
			const ordered = /^\s*\d+\.\s+/.test(line);
			const tag = ordered ? "ol" : "ul";
			const items: string[] = [];
			while (i < lines.length && isListStart(lines[i])) {
				const item = lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, "");
				items.push(`<li>${inlineMd(item)}</li>`);
				i++;
			}
			out.push(`<${tag}>${items.join("")}</${tag}>`);
			continue;
		}
		const paragraph: string[] = [line.trim()];
		i++;
		while (
			i < lines.length &&
			lines[i].trim() &&
			!isHeading(lines[i]) &&
			!isTableStart(lines, i) &&
			!isBlockquoteStart(lines[i]) &&
			!isListStart(lines[i]) &&
			!/^\s*---+\s*$/.test(lines[i])
		) {
			paragraph.push(lines[i].trim());
			i++;
		}
		out.push(`<p>${inlineMd(paragraph.join(" ").replace(/\s{2,}/g, " "))}</p>`);
	}
	return out.join("\n");
}

function inlineMd(value: string): string {
	const code: string[] = [];
	const tokenized = value.replace(/`([^`]+)`/g, (_, raw) => {
		code.push(`<code>${escapeHtml(raw)}</code>`);
		return `\u0000CODE${code.length - 1}\u0000`;
	});
	return escapeHtml(tokenized)
		.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
		.replace(/\*([^*]+)\*/g, "<em>$1</em>")
		.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => code[Number(index)] ?? "");
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export const glasslineClaimSections: BookSection[] = [
	{
		id: "warden-overview",
		part: "Introduction",
		title: "Warden Overview",
		kicker: "One-Shot Packet",
		summary: "The premise, canon locks, source authority, runtime targets, and table pacing for The Glassline Claim.",
		image: "/generated/compendium/locations/location-0001.webp",
		body: () =>
			body(`${openingMarkdown()}\n\n${sectionMarkdown("Warden Overview", "How To Run This One-Shot")}`, [
				glasslineFigure("cover-eternal-shadow-dungeon", "The Eternal Shadow Dungeon is the canon Rank-D site for this introductory operation."),
				glasslineArtCoverageSummary(),
			]),
	},
	{
		id: "episode-and-briefing",
		part: "Introduction",
		title: "Episode Flow And Player Briefing",
		kicker: "First Episode Rhythm",
		summary: "Cold open, title beat, player prompts, the player-facing contract briefing, and the live-table intake prologue.",
		image: "/generated/adventures/glassline-claim/mira-voss.png",
		body: () =>
			body(sectionMarkdown("Episode Flow", "Player Briefing", "Scene 0: New License Day"), [
				glasslineFigure("mira-voss", "Mira Voss turns the party's first legal contract into a professional field operation."),
			]),
	},
	{
		id: "npc-and-escort-duty",
		part: "Running The Job",
		title: "NPCs And Escort Duty",
		kicker: "Crew And Responsibilities",
		summary: "The Ironclad crew, rival claim agent, L3-HOUND, escort priorities, crew exposure, and regulated Rift access.",
		image: "/generated/adventures/glassline-claim/l3-hound-rift-hauler.png",
		body: () =>
			body(sectionMarkdown("Key NPCs", "Ironclad Rift-Hauler: L3-HOUND", "Running Escort Duty"), [
				glasslineFigure("l3-hound-rift-hauler", "Ironclad Rift-Hauler L3-HOUND is a loaned logistics asset, not a combat tank or permanent reward."),
			]),
	},
	{
		id: "rules-and-scaling",
		part: "Running The Job",
		title: "Difficulty, Scaling, And Enemies",
		kicker: "Warden Reference",
		summary: "RA DCs, Rift Favor reminders, encounter budgets, scaling guidance, and canon Shadow anomaly summaries.",
		image: "/generated/maps/premade/shadow-labyrinth.webp",
		body: () =>
			body(sectionMarkdown("Difficulty And Checks", "Encounter Scaling", "Canon Enemy Summaries"), [
				glasslineFigure("shadow-labyrinth-map", "Use the shadow labyrinth as positioning inspiration for corridors, side routes, and work zones."),
				glasslineFigure("corrupted-shadow-anomaly", "Corrupted Shadow anomaly (anomaly-0021)."),
				glasslineFigure("cursed-shadow-anomaly", "Cursed Shadow anomaly (anomaly-0061)."),
				glasslineFigure("ancient-shadow-anomaly", "Ancient Shadow anomaly (anomaly-0081)."),
				glasslineFigure("legendary-shadow-anomaly", "Legendary Shadow anomaly (anomaly-0141)."),
			]),
	},
	{
		id: "scenes-1-2",
		part: "Adventure Scenes",
		title: "Contract And Threshold",
		kicker: "Scenes 1-2",
		summary: "Ironclad staging-yard briefing, L3-HOUND assignment, and Bureau threshold intake.",
		image: "/generated/adventures/glassline-claim/briefing-contract.png",
		body: () =>
			body(sectionMarkdown("Scene 1: Ironclad Contract Briefing", "Scene 2: Bureau Threshold Intake"), [
				glasslineFigure("briefing-contract", "Ironclad briefs the licensed Ascendant escorts before the scheduled D-rank operation."),
				glasslineFigure("rift-threshold", "The threshold is stable for the scheduled operation; the risk is the job inside it."),
			]),
	},
	{
		id: "scenes-3-4",
		part: "Adventure Scenes",
		title: "First Corridor And Survey Marker L-3",
		kicker: "Scenes 3-4",
		summary: "Moving escort formation, first vehicle-side anomaly contact, route marking, and survey work under pressure.",
		image: "/generated/adventures/glassline-claim/l3-haul-sector-moving-escort.png",
		body: () =>
			body(sectionMarkdown("Scene 3: First Corridor Escort", "Scene 4: Survey Marker L-3"), [
				glasslineFigure("l3-haul-sector-moving-escort", "The L-3 Glassline Haul Sector is large enough for a professional vehicle escort, but Hound creates responsibilities as well as mobility."),
				glasslineFigure("survey-marker-l3", "Survey Marker L-3 turns the party's job from paperwork into field responsibility."),
			]),
	},
	{
		id: "scene-5-rival-claim",
		part: "Adventure Scenes",
		title: "Rival Claim Dispute",
		kicker: "Scene 5",
		summary: "A competing licensed crew challenges salvage rights through law, pressure, proof, or escalation.",
		image: "/generated/adventures/glassline-claim/rival-claim-dispute.png",
		body: () =>
			body(sectionMarkdown("Scene 5: Rival Claim Dispute"), [
				glasslineFigure("rival-claim-dispute", "The rival claim dispute tests professionalism before it ever tests initiative."),
			]),
	},
	{
		id: "scene-6-glassline-seam",
		part: "Adventure Scenes",
		title: "The Glassline Seam",
		kicker: "Scene 6",
		summary: "Safe, standard, and aggressive extraction choices with consequences but no countdown clock.",
		image: "/generated/adventures/glassline-claim/glassline-seam-extraction.png",
		body: () =>
			body(sectionMarkdown("Scene 6: The Glassline Seam"), [
				glasslineFigure("glassline-seam-extraction", "Extraction choices change samples, injuries, gear strain, and reputation without assuming Rift collapse."),
			]),
	},
	{
		id: "scene-7-claim-guardian",
		part: "Adventure Scenes",
		title: "Claim Guardian",
		kicker: "Scene 7",
		summary: "The final tactical encounter against a canon Rank-D Shadow anomaly variant blocking safe extraction.",
		image: "/generated/adventures/glassline-claim/claim-guardian-reveal.png",
		body: () =>
			body(sectionMarkdown("Scene 7: Claim Guardian"), [
				glasslineFigure("claim-guardian-reveal", "The Claim Guardian appears when the seam's defended point is reached, not because the Rift is destabilizing."),
			]),
	},
	{
		id: "scene-8-debrief",
		part: "Adventure Scenes",
		title: "Debrief And Carryover",
		kicker: "Scene 8",
		summary: "Payout, registered salvage, Bureau/Guild reputation, optional progression, and Run Silent handoff.",
		image: "/generated/compendium/locations/location-0001.webp",
		body: () => body(sectionMarkdown("Scene 8: Debrief And Carryover")),
	},
	{
		id: "rewards",
		part: "Rewards",
		title: "Rewards And Progression",
		kicker: "Canon Carryover",
		summary: "Rank-D payout, salvage parcels, uncommon bonus, favors, legal harvest, and the level-up switch.",
		image: "/ui-art/bureau_light_survey_rover.png",
		body: () => body(sectionMarkdown("Rewards")),
	},
	{
		id: "handouts-and-run-sheet",
		part: "Appendices",
		title: "Handouts And Quick Run Sheet",
		kicker: "Table Tools",
		summary: "Contract card, Bureau advisory, crew roster, AFA mission feed, reward card, quick run sheet, and acceptance checklist.",
		image: "/ui-art/rift-gate-hero.png",
		body: () => body(sectionMarkdown("Warden Handouts", "Quick Run Sheet", "Acceptance Checklist")),
	},
];
