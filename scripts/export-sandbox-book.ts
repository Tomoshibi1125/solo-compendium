/**
 * export-sandbox-book.ts
 *
 * Regenerates "The Shadow of the Regent" campaign book as a PDF, rendered
 * directly from the live in-app module data so the book can never drift from
 * the module. Run with:  npm run export:book
 *
 * The module aggregator (`ascendant-sandbox-module.ts`) cannot be imported in
 * Node because it pulls in a Vite `?raw` markdown import. Instead we import the
 * import-safe data sub-modules directly and read the world-lore markdown from
 * disk, reproducing the same chapter order the app uses.
 */

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

import { chaptersPart1 } from "../src/data/compendium/sandbox/sandbox-chapters-part1";
import { chaptersPart2 } from "../src/data/compendium/sandbox/sandbox-chapters-part2";
import { chaptersPart3 } from "../src/data/compendium/sandbox/sandbox-chapters-part3";
import { chaptersPart4 } from "../src/data/compendium/sandbox/sandbox-chapters-part4";
import { chaptersPart5 } from "../src/data/compendium/sandbox/sandbox-chapters-part5";
import { chaptersPart6 } from "../src/data/compendium/sandbox/sandbox-chapters-part6";
import { chaptersPart7 } from "../src/data/compendium/sandbox/sandbox-chapters-part7";
import { chaptersPart8 } from "../src/data/compendium/sandbox/sandbox-chapters-part8";
import { sandboxEncounters } from "../src/data/compendium/sandbox/sandbox-encounters";
import { sandboxFactions } from "../src/data/compendium/sandbox/sandbox-factions";
import { sandboxHandoutsExpanded } from "../src/data/compendium/sandbox/sandbox-handouts";
import { sandboxLootTables } from "../src/data/compendium/sandbox/sandbox-loot";
import { sandboxQuests } from "../src/data/compendium/sandbox/sandbox-quests";
import { sandboxTimeline } from "../src/data/compendium/sandbox/sandbox-timeline";
import { sandboxWardenNotes } from "../src/data/compendium/sandbox/sandbox-warden-notes";
import { sandboxRecruitableNPCs } from "../src/data/compendium/sandbox-npcs";

// ---------------------------------------------------------------------------
// Module metadata (mirrors ascendant-sandbox-module.ts — kept in sync by hand
// because the aggregator itself is not Node-importable).
// ---------------------------------------------------------------------------
const MODULE_TITLE = "The Shadow of the Regent";
const MODULE_VERSION = 9;
const MODULE_SUBTITLE =
	"A mature paranormal-horror campaign for Levels 1-15, set inside the Gloamreach — a country-sized S-Rank Rift Interior ruled by its Anchor, the Regent.";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

// ---------------------------------------------------------------------------
// Wiki chapter order — reproduces `sandboxWikiChapters` from the aggregator.
// ---------------------------------------------------------------------------
type Chapter = { title: string; content: string };

const worldLoreMd = readFileSync(
	resolve(repoRoot, "docs/rift-ascendant-world-lore.md"),
	"utf8",
);
const worldLoreChapter: Chapter = {
	title: "Rift Ascendant Lore: The Rift Age and the Gloamreach",
	content: worldLoreMd,
};

const [chapterZero, ...part4Rest] = chaptersPart4 as Chapter[];
const chapters: Chapter[] = [
	worldLoreChapter,
	...(chapterZero ? [chapterZero] : []),
	...(chaptersPart1 as Chapter[]),
	...(chaptersPart2 as Chapter[]),
	...(chaptersPart3 as Chapter[]),
	...part4Rest,
	...(chaptersPart5 as Chapter[]),
	...(chaptersPart6 as Chapter[]),
	...(chaptersPart7 as Chapter[]),
	...(chaptersPart8 as Chapter[]),
];

// ---------------------------------------------------------------------------
// Minimal, dependency-free Markdown -> HTML (headings, bold/italic/code,
// tables, ordered/unordered lists, blockquotes, hr, paragraphs).
// ---------------------------------------------------------------------------
function esc(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inlineMd(s: string): string {
	return esc(s)
		.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
		.replace(/\*([^*]+)\*/g, "<em>$1</em>")
		.replace(/`([^`]+)`/g, "<code>$1</code>");
}
function splitRow(line: string): string[] {
	let s = line.trim();
	if (s.startsWith("|")) s = s.slice(1);
	if (s.endsWith("|")) s = s.slice(0, -1);
	return s.split("|").map((c) => c.trim());
}
function isBlockStart(line: string): boolean {
	return (
		/^\s*$/.test(line) ||
		/^#{1,6}\s/.test(line) ||
		/^\s*\|.*\|\s*$/.test(line) ||
		/^\s*[-*]\s+/.test(line) ||
		/^\s*\d+\.\s+/.test(line) ||
		/^\s*>\s?/.test(line) ||
		/^\s*([-*_])\1\1+\s*$/.test(line)
	);
}
function mdToHtml(md: string): string {
	const lines = md.replace(/\r\n/g, "\n").split("\n");
	const out: string[] = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (/^\s*$/.test(line)) {
			i++;
			continue;
		}
		const h = /^(#{1,6})\s+(.*)$/.exec(line);
		if (h) {
			const lvl = h[1].length;
			out.push(`<h${lvl}>${inlineMd(h[2].trim())}</h${lvl}>`);
			i++;
			continue;
		}
		if (/^\s*([-*_])\1\1+\s*$/.test(line)) {
			out.push("<hr/>");
			i++;
			continue;
		}
		if (
			/^\s*\|.*\|\s*$/.test(line) &&
			i + 1 < lines.length &&
			lines[i + 1].includes("-") &&
			/^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1])
		) {
			const header = splitRow(line);
			i += 2;
			const rows: string[][] = [];
			while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
				rows.push(splitRow(lines[i]));
				i++;
			}
			let t = `<table><thead><tr>${header
				.map((c) => `<th>${inlineMd(c)}</th>`)
				.join("")}</tr></thead><tbody>`;
			for (const r of rows) {
				t += `<tr>${r.map((c) => `<td>${inlineMd(c)}</td>`).join("")}</tr>`;
			}
			t += "</tbody></table>";
			out.push(t);
			continue;
		}
		if (/^\s*>\s?/.test(line)) {
			const buf: string[] = [];
			while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
				buf.push(lines[i].replace(/^\s*>\s?/, ""));
				i++;
			}
			out.push(`<blockquote>${inlineMd(buf.join(" "))}</blockquote>`);
			continue;
		}
		if (/^\s*[-*]\s+/.test(line)) {
			const buf: string[] = [];
			while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
				buf.push(lines[i].replace(/^\s*[-*]\s+/, ""));
				i++;
			}
			out.push(`<ul>${buf.map((x) => `<li>${inlineMd(x)}</li>`).join("")}</ul>`);
			continue;
		}
		if (/^\s*\d+\.\s+/.test(line)) {
			const buf: string[] = [];
			while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
				buf.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
				i++;
			}
			out.push(`<ol>${buf.map((x) => `<li>${inlineMd(x)}</li>`).join("")}</ol>`);
			continue;
		}
		const buf: string[] = [];
		while (i < lines.length && !isBlockStart(lines[i])) {
			buf.push(lines[i]);
			i++;
		}
		out.push(`<p>${inlineMd(buf.join(" "))}</p>`);
	}
	return out.join("\n");
}

function titleCase(s: string): string {
	return s
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Appendix renderers (structured data -> HTML).
// ---------------------------------------------------------------------------
function renderNpcs(): string {
	const npcs = sandboxRecruitableNPCs as any[];
	const cards = npcs
		.map((n) => {
			const abilities = Array.isArray(n.keyAbilities)
				? n.keyAbilities.map((a: string) => `<li>${inlineMd(a)}</li>`).join("")
				: "";
			return `<div class="card">
        <h3>${esc(n.name ?? "Unknown")}${n.title ? ` — <span class="muted">${esc(n.title)}</span>` : ""}</h3>
        <p class="stat"><strong>Faction:</strong> ${esc(titleCase(String(n.faction ?? "—")))} ·
          <strong>Level:</strong> ${esc(String(n.level ?? "—"))} ·
          <strong>AC:</strong> ${esc(String(n.ac ?? "—"))} ·
          <strong>HP:</strong> ${esc(String(n.hp ?? "—"))} ·
          <strong>Location:</strong> ${esc(String(n.location ?? "—"))}</p>
        ${n.job ? `<p class="stat"><strong>Job:</strong> ${esc(String(n.job))}</p>` : ""}
        ${n.description ? `<p>${inlineMd(String(n.description))}</p>` : ""}
        ${n.personality ? `<p><strong>Personality.</strong> ${inlineMd(String(n.personality))}</p>` : ""}
        ${n.motivation ? `<p><strong>Motivation.</strong> ${inlineMd(String(n.motivation))}</p>` : ""}
        ${abilities ? `<p class="stat"><strong>Key Abilities</strong></p><ul>${abilities}</ul>` : ""}
        ${n.recruitCondition ? `<p><strong>Recruit.</strong> ${inlineMd(String(n.recruitCondition))}</p>` : ""}
      </div>`;
		})
		.join("\n");
	return cards;
}

function renderFactions(): string {
	const factions = sandboxFactions as any[];
	return factions
		.map((f) => {
			const benefits = Array.isArray(f.joiningBenefits)
				? `<ul>${f.joiningBenefits.map((b: string) => `<li>${inlineMd(b)}</li>`).join("")}</ul>`
				: "";
			return `<div class="card">
        <h3>${esc(f.name ?? "Faction")}</h3>
        ${f.tagline ? `<p class="muted">${inlineMd(String(f.tagline))}</p>` : ""}
        ${f.description ? `<p>${inlineMd(String(f.description))}</p>` : ""}
        <p class="stat"><strong>Starting reputation:</strong> ${esc(String(f.startingReputation ?? "—"))}</p>
        ${benefits ? `<p class="stat"><strong>Joining benefits</strong></p>${benefits}` : ""}
      </div>`;
		})
		.join("\n");
}

function renderEncounters(): string {
	const encs = sandboxEncounters as any[];
	return encs
		.map((e) => {
			const monsters = Array.isArray(e.monsters)
				? e.monsters
						.map((m: any) =>
							typeof m === "string"
								? m
								: `${m.name ?? m.alias ?? "anomaly"}${m.count ? ` ×${m.count}` : ""}`,
						)
						.join(", ")
				: "";
			const hazards = Array.isArray(e.hazards) ? e.hazards.join("; ") : "";
			const rewards = Array.isArray(e.rewards) ? e.rewards.join("; ") : "";
			return `<div class="card">
        <h3>${esc(e.name ?? "Encounter")} <span class="tag">${esc(String(e.difficulty ?? ""))}</span></h3>
        ${e.sceneRef ? `<p class="muted">Site: ${esc(String(e.sceneRef))}</p>` : ""}
        ${e.description ? `<p>${inlineMd(String(e.description))}</p>` : ""}
        ${monsters ? `<p class="stat"><strong>Anomalies:</strong> ${esc(monsters)}</p>` : ""}
        ${hazards ? `<p class="stat"><strong>Hazards:</strong> ${inlineMd(hazards)}</p>` : ""}
        ${rewards ? `<p class="stat"><strong>Rewards:</strong> ${inlineMd(rewards)}</p>` : ""}
      </div>`;
		})
		.join("\n");
}

function renderQuests(): string {
	const quests = sandboxQuests as any[];
	return quests
		.map((q) => {
			const objs = Array.isArray(q.objectives)
				? `<ul>${q.objectives.map((o: string) => `<li>${inlineMd(o)}</li>`).join("")}</ul>`
				: "";
			return `<div class="card">
        <h3><span class="tag">${esc(String(q.rank ?? "?"))}</span> ${esc(q.title ?? "Quest")}</h3>
        ${q.summary ? `<p>${inlineMd(String(q.summary))}</p>` : ""}
        ${objs ? `<p class="stat"><strong>Objectives</strong></p>${objs}` : ""}
        ${q.rewardNotes ? `<p><strong>Reward.</strong> ${inlineMd(String(q.rewardNotes))}</p>` : ""}
      </div>`;
		})
		.join("\n");
}

function renderLoot(): string {
	const tables = sandboxLootTables as any[];
	return tables
		.map((t) => {
			const entries = Array.isArray(t.entries)
				? `<ul>${t.entries
						.map((e: any) =>
							`<li>${inlineMd(typeof e === "string" ? e : (e.name ?? e.item ?? JSON.stringify(e)))}</li>`,
						)
						.join("")}</ul>`
				: "";
			return `<div class="card"><h3>${esc(t.name ?? t.rank ?? "Loot Table")}</h3>${entries}</div>`;
		})
		.join("\n");
}

function renderTimeline(): string {
	const events = sandboxTimeline as any[];
	const rows = events
		.map(
			(e) =>
				`<tr><td>${esc(String(e.day))}</td><td>${esc(e.title ?? "")}</td><td>${inlineMd(String(e.description ?? ""))}${e.factionImpact ? `<br/><em>${inlineMd(String(e.factionImpact))}</em>` : ""}</td></tr>`,
		)
		.join("");
	return `<table><thead><tr><th>Day</th><th>Beat</th><th>Effect</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderHandouts(): string {
	const handouts = sandboxHandoutsExpanded as any[];
	return handouts
		.map(
			(h) =>
				`<div class="handout"><h3>${esc(h.title ?? "Handout")}${h.visibleToPlayers === false ? ' <span class="tag">Warden</span>' : ' <span class="tag">Player</span>'}</h3>${mdToHtml(String(h.content ?? ""))}</div>`,
		)
		.join("\n");
}

function renderWardenNotes(): string {
	const notes = sandboxWardenNotes as any[];
	return notes
		.map(
			(n) =>
				`<div class="card"><h3>${esc(n.title ?? "Note")} <span class="tag">${esc(String(n.category ?? ""))}</span></h3>${mdToHtml(String(n.content ?? ""))}</div>`,
		)
		.join("\n");
}

// ---------------------------------------------------------------------------
// Assemble the book HTML.
// ---------------------------------------------------------------------------
function slug(s: string): string {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const tocItems = chapters
	.map((c) => `<li><a href="#${slug(c.title)}">${esc(c.title)}</a></li>`)
	.join("\n");

const chaptersHtml = chapters
	.map(
		(c) =>
			`<section class="chapter" id="${slug(c.title)}"><h1 class="chapter-title">${esc(c.title)}</h1>${mdToHtml(c.content)}</section>`,
	)
	.join("\n");

const appendix = (id: string, title: string, body: string) =>
	`<section class="chapter appendix" id="${id}"><h1 class="chapter-title">${esc(title)}</h1>${body}</section>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<style>
:root { --ink:#1a1714; --accent:#6d1f1f; --muted:#6b625a; --rule:#d8cfc4; }
* { box-sizing: border-box; }
@page { size: A4; margin: 18mm 16mm; }
body { font-family: Georgia, "Iowan Old Style", "Times New Roman", serif; color: var(--ink); line-height: 1.5; font-size: 10.6pt; }
h1,h2,h3,h4 { font-family: "Trebuchet MS", "Segoe UI", Helvetica, sans-serif; color: var(--accent); line-height: 1.2; }
.cover { height: 245mm; display: flex; flex-direction: column; justify-content: center; text-align: center; page-break-after: always; }
.cover .kicker { letter-spacing: .35em; text-transform: uppercase; color: var(--muted); font-family: "Trebuchet MS", sans-serif; font-size: 11pt; }
.cover h1 { font-size: 40pt; margin: 10px 0 6px; color: var(--ink); }
.cover .sub { font-size: 13pt; color: var(--muted); max-width: 70%; margin: 0 auto; }
.cover .meta { margin-top: 40px; color: var(--muted); font-family: "Trebuchet MS", sans-serif; font-size: 10pt; }
.toc { page-break-after: always; }
.toc h1 { border-bottom: 2px solid var(--accent); padding-bottom: 6px; }
.toc ol { columns: 2; column-gap: 14mm; }
.toc a { color: var(--ink); text-decoration: none; }
.chapter { page-break-before: always; }
.chapter-title { font-size: 22pt; border-bottom: 2px solid var(--accent); padding-bottom: 6px; margin-bottom: 10px; }
h2 { font-size: 14pt; margin-top: 16px; border-bottom: 1px solid var(--rule); padding-bottom: 3px; }
h3 { font-size: 12pt; margin-top: 12px; }
p { margin: 7px 0; }
ul,ol { margin: 6px 0 6px 18px; }
li { margin: 2px 0; }
table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 9.6pt; }
th,td { border: 1px solid var(--rule); padding: 4px 7px; text-align: left; vertical-align: top; }
th { background: #f3ede4; font-family: "Trebuchet MS", sans-serif; }
blockquote { border-left: 3px solid var(--accent); margin: 10px 0; padding: 2px 12px; color: var(--muted); font-style: italic; }
code { background: #f1ece4; padding: 1px 4px; border-radius: 3px; font-size: 9pt; }
hr { border: none; border-top: 1px solid var(--rule); margin: 14px 0; }
.card { border: 1px solid var(--rule); border-radius: 5px; padding: 8px 12px; margin: 10px 0; break-inside: avoid; }
.handout { border: 1px dashed var(--accent); border-radius: 5px; padding: 8px 14px; margin: 12px 0; break-inside: avoid; background: #faf6ef; }
.card h3, .handout h3 { margin-top: 0; }
.muted { color: var(--muted); }
.stat { font-size: 9.6pt; margin: 4px 0; }
.tag { font-family: "Trebuchet MS", sans-serif; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .08em; background: var(--accent); color: #fff; padding: 1px 6px; border-radius: 9px; vertical-align: middle; }
</style></head>
<body>
<div class="cover">
  <div class="kicker">Rift Ascendant · Warden's Edition</div>
  <h1>${esc(MODULE_TITLE)}</h1>
  <div class="sub">${esc(MODULE_SUBTITLE)}</div>
  <div class="meta">Generated from the live compendium module · v${MODULE_VERSION} · ${new Date().toISOString().slice(0, 10)}<br/>${chapters.length} chapters · ${(sandboxRecruitableNPCs as any[]).length} allies · ${(sandboxHandoutsExpanded as any[]).length} handouts</div>
</div>
<nav class="toc"><h1>Contents</h1><ol>${tocItems}</ol></nav>
${chaptersHtml}
${appendix("appendix-allies", "Appendix A — Recruitable Allies", renderNpcs())}
${appendix("appendix-factions", "Appendix B — Factions of the Gloamreach", renderFactions())}
${appendix("appendix-encounters", "Appendix C — Domain Encounters", renderEncounters())}
${appendix("appendix-quests", "Appendix D — Side Quests", renderQuests())}
${appendix("appendix-loot", "Appendix E — Treasure & Relics", renderLoot())}
${appendix("appendix-timeline", "Appendix F — The Gate Break Track", renderTimeline())}
${appendix("appendix-handouts", "Appendix G — Handouts", renderHandouts())}
${appendix("appendix-warden", "Appendix H — Warden's Secrets", renderWardenNotes())}
</body></html>`;

// ---------------------------------------------------------------------------
// Render to PDF via Playwright.
// ---------------------------------------------------------------------------
async function main() {
	const outDir = resolve(repoRoot, "exports");
	mkdirSync(outDir, { recursive: true });
	const htmlPath = resolve(outDir, "the-shadow-of-the-regent.html");
	const pdfPath = resolve(outDir, "the-shadow-of-the-regent.pdf");
	writeFileSync(htmlPath, html, "utf8");
	console.log(`HTML written: ${htmlPath} (${chapters.length} chapters)`);

	let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
	try {
		browser = await chromium.launch();
	} catch (err) {
		console.error(
			"\nCould not launch Chromium. Install the browser with:\n  npx playwright install chromium\n",
		);
		throw err;
	}
	const page = await browser.newPage();
	await page.setContent(html, { waitUntil: "load" });
	await page.pdf({
		path: pdfPath,
		format: "A4",
		printBackground: true,
		margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" },
		displayHeaderFooter: true,
		headerTemplate: "<span></span>",
		footerTemplate:
			'<div style="width:100%;font-size:8px;color:#999;font-family:Trebuchet MS,sans-serif;text-align:center;">The Shadow of the Regent · <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
	});
	await browser.close();

	const kb = Math.round(statSync(pdfPath).size / 1024);
	console.log(`PDF written: ${pdfPath} (${kb} KB)`);
}

main().catch((err) => {
	console.error(err);
	process.exitCode = 1;
});
