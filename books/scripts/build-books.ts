import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	renameSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { chromium } from "playwright";
import sharp from "sharp";

import { anomalies } from "../../src/data/compendium/anomalies";
import { artifacts } from "../../src/data/compendium/artifacts";
import { allBackgrounds } from "../../src/data/compendium/backgrounds-index";
import { conditions } from "../../src/data/compendium/conditions";
import { comprehensiveFeats } from "../../src/data/compendium/feats-comprehensive";
import { FIGHTING_STYLES } from "../../src/data/compendium/fightingStyles";
import { allItems } from "../../src/data/compendium/items-index";
import { jobs } from "../../src/data/compendium/jobs";
import { locations } from "../../src/data/compendium/locations";
import { paths } from "../../src/data/compendium/paths";
import { PRIME_PANTHEON } from "../../src/data/compendium/pantheon";
import { powers } from "../../src/data/compendium/powers";
import { regents } from "../../src/data/compendium/regents";
import { comprehensiveRelics } from "../../src/data/compendium/relics-comprehensive";
import { rollableTables } from "../../src/data/compendium/rollableTables";
import { allRunes } from "../../src/data/compendium/runes";
import { shadowSoldiers } from "../../src/data/compendium/shadow-soldiers";
import { sigils } from "../../src/data/compendium/sigils";
import { comprehensiveSkills } from "../../src/data/compendium/skills-comprehensive";
import { spells } from "../../src/data/compendium/spells";
import { tattoos } from "../../src/data/compendium/tattoos";
import { techniques } from "../../src/data/compendium/techniques";
import { allVehicles } from "../../src/data/compendium/vehicles";
import { glasslineClaimSections } from "./glassline_claim";
import { glasslineSelectedArtSlots } from "./glassline_art_manifest";
import {
	runSilentArtSlots,
	runSilentMinimumArtTarget,
	runSilentSelectedArtSlots,
} from "./run_silent_art_manifest";
import { runSilentSections } from "./run_silent_campaign";
import {
	activeSourcebookOutputBases,
	activeSourcebookSlugs,
	assertSourcebookDefinitionMatchesInventory,
	isCampaignScopedSourcebookEntry,
	isCoreSourcebookItem,
	isCoreSourcebookRune,
	sourcebookVolumeBySlug,
	sourcebookVolumes,
	type SourcebookSlug,
} from "./sourcebook-publication";

type EntryRecord = Record<string, unknown>;

interface MissingAsset {
	context: string;
	path: string;
	reason: string;
}

interface BookDefinition {
	slug: SourcebookSlug;
	title: string;
	subtitle: string;
	classification: string;
	tagline: string;
	outputBase: string;
	coverImage: string;
	sections: BookSection[];
	requiredPageTarget?: boolean;
	minimumPageTarget?: number;
}

export interface BookSection {
	id: string;
	part?: string;
	title: string;
	kicker: string;
	summary: string;
	image?: string;
	body: string | (() => string);
}

interface RenderedBook {
	definition: BookDefinition;
	htmlPath: string;
	pdfPath: string;
	pageCount: number;
	renderer: string;
}

interface BookmarkEntry {
	title: string;
	pageIndex: number;
	level: number;
}

interface ChunkRenderResult {
	renderer: string;
	bookmarks: BookmarkEntry[];
}

interface CommandResult {
	command: string;
	status: number | null;
	stdout: string;
	stderr: string;
}

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");
const booksRoot = resolve(repoRoot, "books");
const layoutRoot = resolve(booksRoot, "layout");
const exportRoot = resolve(booksRoot, "exports");
const sharedRoot = resolve(booksRoot, "shared");
const assetRoot = resolve(sharedRoot, "assets");
const sampleRoot = resolve(exportRoot, "rendered-samples");
const publicRoot = resolve(repoRoot, "public");
const cssPath = resolve(layoutRoot, "book.css");
const toolCacheRoot = resolve("C:/tmp/ra_pdf_tools");
const activeOutputBases = activeSourcebookOutputBases;
const staleOutputBases: string[] = [];
const activeBookSlugs = activeSourcebookSlugs;
const vivliostyleFullBookByteLimit = 1_500_000;
const heroImageMinDimension = 900;
const heroImageTargetDimension = 2200;
const heroImageJpegQuality = 82;
const pdfWarningSizeBytes = 75 * 1024 * 1024;
const pdfReviewSizeBytes = 100 * 1024 * 1024;
const buildDate = new Date().toISOString().slice(0, 10);
const verifyOnly = process.argv.includes("--verify-only");
const keepChunks = process.argv.includes("--keep-chunks");
const vivlioOnly = process.argv.includes("--vivlio-only") || process.env.VIVLIO_ONLY === "1";
const vivliostyleChunkTimeoutMs = vivlioOnly ? 1_800_000 : 300_000;
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const onlyBook = onlyArg?.split("=")[1] as BookDefinition["slug"] | undefined;

const report = {
	tooling: [] as string[],
	commands: [] as CommandResult[],
	generatedSources: [] as string[],
	pdfs: [] as { path: string; pages: number; renderer: string }[],
	warnings: [] as string[],
	failedExportAttempts: [] as string[],
	missingAssets: [] as MissingAsset[],
	renderedSamples: [] as string[],
	bookmarks: [] as { path: string; count: number; titles: string[] }[],
	validation: [] as string[],
	optimizedAssets: [] as { source: string; output: string }[],
	imageQuality: [] as string[],
};

type AssetRole = "hero" | "entry";

const RA_CANDIDATE_ROOT = "/generated/rift-ascendant-candidates";
const bookArt = {
	ascendantCover: "/ui-art/rift-gate-hero.png",
	ascendantWorld: `${RA_CANDIDATE_ROOT}/location-background-shadow-realm-exile-1nsqp5-v1-3031651259.png`,
	ascendantJobs: `${RA_CANDIDATE_ROOT}/character-character-striker-fsk9mx-v1-1749336172.png`,
	ascendantPaths: `${RA_CANDIDATE_ROOT}/character-character-holy-knight-p092r5-v1-1813314876.png`,
	ascendantBackgrounds: `${RA_CANDIDATE_ROOT}/character-character-contractor-sfraea-v1-1258837483.png`,
	ascendantAbilities: `${RA_CANDIDATE_ROOT}/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png`,
	ascendantRunes: `${RA_CANDIDATE_ROOT}/item-item-sworn-sealed-inscription-1buuji-v1-1871931860.png`,
	ascendantGear: `${RA_CANDIDATE_ROOT}/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png`,
	wardenCover: `${RA_CANDIDATE_ROOT}/item-item-world-ender-reliquary-1jhkij-v1-3056116143.png`,
	wardenProcedures: `${RA_CANDIDATE_ROOT}/character-character-city-guard-1q3i9c-v1-296750299.png`,
	wardenRift: `${RA_CANDIDATE_ROOT}/location-location-void-portal-1m1hic-v1-2589780808.png`,
	wardenOperations: `${RA_CANDIDATE_ROOT}/item-item-bureau-approved-map-nz6kn7-v1-134383353.png`,
	wardenWorld: `${RA_CANDIDATE_ROOT}/map-map-vermillion-outpost-1az275-v1-3746029370.png`,
	wardenRegents: "/generated/compendium/regents/spatial-regent.webp",
	wardenAnomaly: `${RA_CANDIDATE_ROOT}/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png`,
	wardenRewards: "/generated/props/treasure-cache.webp",
	vaultsCover: `${RA_CANDIDATE_ROOT}/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png`,
	vaultsRunes: `${RA_CANDIDATE_ROOT}/item-item-riftbound-sigil-scroll-zr8wwc-v1-4225377924.png`,
	vaultsItems: `${RA_CANDIDATE_ROOT}/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png`,
	vaultsRelics: `${RA_CANDIDATE_ROOT}/weapon-weapon-archon-s-club-2anxuq-v1-3171127125.png`,
	anomalyCover: `${RA_CANDIDATE_ROOT}/anomaly-anomaly-blessed-void-wraith-5a2r5d-v1-2002275154.png`,
	anomalyUsing: `${RA_CANDIDATE_ROOT}/anomaly-anomaly-celestial-void-beast-obzwf2-v1-3821508069.png`,
	anomalyCatalog: `${RA_CANDIDATE_ROOT}/anomaly-anomaly-ancient-void-beast-h44dji-v1-1688413192.png`,
	anomalyShadow: `${RA_CANDIDATE_ROOT}/anomaly-anomaly-ancient-shadow-revenant-1mip0k-v1-859439347.png`,
} as const;

function ensureDirs() {
	for (const dir of [layoutRoot, exportRoot, sharedRoot, assetRoot, sampleRoot]) {
		mkdirSync(dir, { recursive: true });
	}
}

function cleanText(value: unknown): string {
	if (value == null) return "";
	return String(value)
		.replace(/\r\n/g, "\n")
		.replace(/\u00a0/g, " ")
		.replace(/\u2011/g, "-")
		.replace(/[–—]/g, " - ")
		.replace(/â€”/g, " - ")
		.replace(/â€“/g, "-")
		.replace(/â€¦/g, "...")
		.replace(/[“”]/g, '"')
		.replace(/[‘’]/g, "'")
		.replace(/â€œ|â€/g, '"')
		.replace(/â€˜|â€™/g, "'")
		.replace(/â€¢|•|Â·/g, " - ")
		.replace(/â†’/g, "->")
		.replace(/âœ…/g, "[implemented]")
		.replace(/âŒ/g, "[not implemented]")
		.replace(/Ã—/g, "x")
		.replace(/Â/g, "")
		.replace(/[ \t]+$/gm, "")
		.replace(/\n{4,}/g, "\n\n\n");
}

function esc(value: unknown): string {
	return cleanText(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function slugify(value: unknown): string {
	const base = cleanText(value)
		.toLowerCase()
		.replace(/['"]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return base || "entry";
}

function labelize(value: string): string {
	return cleanText(value)
		.replace(/[_-]+/g, " ")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function isEmpty(value: unknown): boolean {
	if (value == null) return true;
	if (typeof value === "string") return cleanText(value).trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === "object") return Object.keys(value).length === 0;
	return false;
}

const developerLinePattern =
	/(src\/|src\\|\.tsx?\b|characterEngine|useComputed|useSpellSlots|React|Supabase|database schema|schema|UI integration|component|hook|implemented|auto-parsed|auto-integrated|implementation in engine|engine lives|follow-up cleanup|do not copy|source-of-truth|tracked as)/i;
const campaignLeakLinePattern =
	/\b(Run Silent|Gloamreach|The Quiet|Hunt Clock|Running This Horror|campaign module|campaign chapter|campaign appendix|session outline|handouts?|sandbox)\b/i;

function sourcebookText(value: unknown, options: { preserveCampaignTerms?: boolean } = {}): string {
	return cleanText(value)
		.replace(/```[\s\S]*?```/g, "")
		.replace(/\([^)]*(?:src\/|src\\|\.tsx?)[^)]*\)/gi, "")
		.split("\n")
		.filter((line) => !developerLinePattern.test(line) && (options.preserveCampaignTerms || !campaignLeakLinePattern.test(line)))
		.join("\n")
		.replace(/\bD&D\s*5e\b/gi, "the d20 engine")
		.replace(/\bD&D-style\b/gi, "d20-style")
		.replace(/\bD&D\b/g, "d20 fantasy")
		.replace(/\bPHB\s*(?:p\.?|page)?\s*\d+\b/gi, "core multiclass spell-slot method")
		.replace(/\bDMG\s*(?:p\.?|page)?\s*\d+\b/gi, "Warden reference")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\n{4,}/g, "\n\n\n")
		.trim();
}

function inlineMd(value: string): string {
	return esc(sourcebookText(value))
		.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
		.replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function splitRow(line: string): string[] {
	let next = line.trim();
	if (next.startsWith("|")) next = next.slice(1);
	if (next.endsWith("|")) next = next.slice(0, -1);
	return next.split("|").map((cell) => cell.trim());
}

const optimizedAssets = new Map<string, string>();
const rejectedFullPageAssets = new Set<string>();

function normalizePublicPath(publicPath: string): string {
	return publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
}

function publicPathToFullPath(publicPath: string): string {
	return resolve(publicRoot, normalizePublicPath(publicPath));
}

async function prepareOptimizedAsset(
	publicPath: string | undefined,
	context: string,
	role: AssetRole = "entry",
) {
	if (!publicPath || /^https?:\/\//i.test(publicPath)) return;
	const normalized = normalizePublicPath(publicPath);
	if (/(^|[\\/])placeholder\.(webp|png|jpe?g)$/i.test(normalized)) return;
	const fullPath = publicPathToFullPath(publicPath);
	if (!fullPath.startsWith(publicRoot) || !existsSync(fullPath)) return;
	const hash = createHash("sha1").update(normalized).digest("hex").slice(0, 10);
	const output = resolve(assetRoot, `${slugify(context)}-${hash}.jpg`);
	const metadata = await sharp(fullPath).metadata();
	const width = metadata.width ?? 0;
	const height = metadata.height ?? 0;
	const minDimension = Math.min(width, height);
	if (role === "hero" && minDimension < heroImageMinDimension) {
		rejectedFullPageAssets.add(normalized);
		report.missingAssets.push({
			context,
			path: publicPath,
			reason: `Rejected for cover/chapter art: ${width}x${height} is below ${heroImageMinDimension}px minimum`,
		});
		report.imageQuality.push(
			`FAIL: ${context} source ${publicPath} is ${width}x${height}; not used as full-page/chapter art.`,
		);
		return;
	}
	if (!existsSync(output)) {
		await sharp(fullPath)
			.rotate()
			.resize({
				width: role === "hero" ? heroImageTargetDimension : 1200,
				height: role === "hero" ? heroImageTargetDimension : 1200,
				fit: "inside",
				withoutEnlargement: true,
			})
			.jpeg({ quality: role === "hero" ? heroImageJpegQuality : 74, mozjpeg: true })
			.toFile(output);
	}
	report.imageQuality.push(
		`PASS: ${context} source ${publicPath} prepared from ${width}x${height} (${role}).`,
	);
	optimizedAssets.set(normalized, output);
	report.optimizedAssets.push({ source: publicPath, output });
}

async function prepareBookAssets(definition: BookDefinition) {
	await prepareOptimizedAsset(definition.coverImage, `${definition.slug}-cover`, "hero");
	for (const section of definition.sections) {
		await prepareOptimizedAsset(section.image, `${definition.slug}-${section.id}`, "hero");
	}
	if (definition.slug === "run-silent") {
		for (const slot of runSilentSelectedArtSlots()) {
			await prepareOptimizedAsset(slot.selectedPath!, `run-silent-art-${slot.slug}`, "entry");
		}
		auditRunSilentArtManifest();
	}
	if (definition.slug === "glassline-claim") {
		for (const slot of glasslineSelectedArtSlots()) {
			await prepareOptimizedAsset(slot.selectedPath, `glassline-art-${slot.slug}`, "entry");
		}
	}
}

function mdToHtml(markdown: unknown): string {
	const lines = sourcebookText(markdown).split("\n");
	const out: string[] = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) {
			i++;
			continue;
		}
		const heading = /^(#{1,6})\s+(.*)$/.exec(line);
		if (heading) {
			const level = Math.min(6, Math.max(2, heading[1].length + 1));
			const title = heading[2].trim();
			out.push(`<h${level} id="${slugify(title)}">${inlineMd(title)}</h${level}>`);
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
			/^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1])
		) {
			const header = splitRow(line);
			i += 2;
			const rows: string[][] = [];
			while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
				rows.push(splitRow(lines[i]));
				i++;
			}
			out.push(
				`<table><thead><tr>${header
					.map((cell) => `<th>${inlineMd(cell)}</th>`)
					.join("")}</tr></thead><tbody>${rows
					.map(
						(row) =>
							`<tr>${row
								.map((cell) => `<td>${inlineMd(cell)}</td>`)
								.join("")}</tr>`,
					)
					.join("")}</tbody></table>`,
			);
			continue;
		}
		if (/^\s*\|.*\|\s*$/.test(line)) {
			out.push(`<p>${inlineMd(line)}</p>`);
			i++;
			continue;
		}
		if (/^\s*>\s?/.test(line)) {
			const block: string[] = [];
			while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
				block.push(lines[i].replace(/^\s*>\s?/, ""));
				i++;
			}
			let text = block.join(" ").trim();
			let className = "callout";
			let header = "";
			const calloutMatch = /^\[!(NOTE|TIP|WARNING|FLAVOR|READ)\](.*)$/i.exec(text);
			if (calloutMatch) {
				const type = calloutMatch[1].toUpperCase();
				let remainder = calloutMatch[2].trim();
				const titleMatch = /^(.*?)\s*(?:[-:]|\*\*)\s*(.*)$/.exec(remainder);
				if (titleMatch && type !== "FLAVOR" && type !== "READ") {
					header = titleMatch[1];
					text = titleMatch[2];
					if (header.startsWith("**") && header.endsWith("**")) {
					    header = header.slice(2, -2).trim();
					} else if (header.startsWith("**")) {
						header = header.slice(2).trim();
					}
				} else {
					text = remainder;
					if (type === "NOTE") header = "Note";
					if (type === "TIP") header = "Tip";
					if (type === "WARNING") header = "Warning";
				}
				
				if (type === "NOTE") className = "sidebar-note";
				else if (type === "TIP") className = "sidebar-tip";
				else if (type === "WARNING") className = "sidebar-warning";
				else if (type === "FLAVOR") className = "flavor-box";
				else if (type === "READ") className = "read-aloud";
			}
			
			if (header) {
				out.push(`<div class="${className}"><h4>${inlineMd(header)}</h4><p>${inlineMd(text)}</p></div>`);
			} else if (className !== "callout") {
				out.push(`<div class="${className}"><p>${inlineMd(text)}</p></div>`);
			} else {
				out.push(`<blockquote>${inlineMd(text)}</blockquote>`);
			}
			continue;
		}
		if (/^\s*[-*]\s+/.test(line)) {
			const items: string[] = [];
			while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
				items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
				i++;
			}
			out.push(
				`<ul>${items.map((item) => `<li>${inlineMd(item)}</li>`).join("")}</ul>`,
			);
			continue;
		}
		if (/^\s*\d+\.\s+/.test(line)) {
			const items: string[] = [];
			while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
				items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
				i++;
			}
			out.push(
				`<ol>${items.map((item) => `<li>${inlineMd(item)}</li>`).join("")}</ol>`,
			);
			continue;
		}
		if (/^```/.test(line)) {
			const block: string[] = [];
			i++;
			while (i < lines.length && !/^```/.test(lines[i])) {
				block.push(lines[i]);
				i++;
			}
			if (i < lines.length) i++;
			out.push(`<pre>${esc(block.join("\n"))}</pre>`);
			continue;
		}
		const paragraph: string[] = [];
		while (
			i < lines.length &&
			lines[i].trim() &&
			!/^#{1,6}\s+/.test(lines[i]) &&
			!/^\s*([-*_])\1\1+\s*$/.test(lines[i]) &&
			!/^\s*[-*]\s+/.test(lines[i]) &&
			!/^\s*\d+\.\s+/.test(lines[i]) &&
			!/^\s*>\s?/.test(lines[i]) &&
			!/^```/.test(lines[i]) &&
			!/^\s*\|.*\|\s*$/.test(lines[i])
		) {
			paragraph.push(lines[i]);
			i++;
		}
		out.push(`<p>${inlineMd(paragraph.join(" "))}</p>`);
	}
	return out.join("\n");
}

function fileUrlFromPublic(publicPath: string, context: string): string | null {
	if (!publicPath || /^https?:\/\//i.test(publicPath)) return null;
	const normalized = normalizePublicPath(publicPath);
	if (rejectedFullPageAssets.has(normalized)) {
		report.missingAssets.push({
			context,
			path: publicPath,
			reason: "Rejected low-resolution full-page/chapter asset",
		});
		return null;
	}
	if (/(^|[\\/])placeholder\.(webp|png|jpe?g)$/i.test(normalized)) {
		report.missingAssets.push({
			context,
			path: publicPath,
			reason: "Generic placeholder asset skipped",
		});
		return null;
	}
	const fullPath = publicPathToFullPath(publicPath);
	if (!fullPath.startsWith(publicRoot)) {
		report.missingAssets.push({
			context,
			path: publicPath,
			reason: "Rejected path outside public root",
		});
		return null;
	}
	if (!existsSync(fullPath)) {
		report.missingAssets.push({
			context,
			path: publicPath,
			reason: "Referenced file not found",
		});
		return null;
	}
	const optimized = optimizedAssets.get(normalized);
	if (optimized && existsSync(optimized)) return pathToFileURL(optimized).href;
	return pathToFileURL(fullPath).href;
}

function optionalAsset(publicPath: string | undefined, context: string): string | null {
	if (!publicPath) return null;
	return fileUrlFromPublic(publicPath, context);
}

function resolveInlinePublicAssetUrls(markup: string, context: string): string {
	return markup.replace(/\b(src|href)=(["'])(\/[^"']+\.(?:avif|webp|png|jpe?g|svg))\2/gi, (match, attr, quote, publicPath) => {
		const url = fileUrlFromPublic(publicPath, context);
		return url ? `${attr}=${quote}${url}${quote}` : match;
	});
}

function auditRunSilentArtManifest() {
	const selected = runSilentSelectedArtSlots();
	const uniqueSelected = new Set(selected.map((slot) => slot.selectedPath));
	const targetMet = uniqueSelected.size >= runSilentMinimumArtTarget;
	const strict = process.env.RUN_SILENT_ART_STRICT === "1";
	if (!targetMet) {
		report.validation.push(
			`${strict ? "FAIL" : "WARN"}: Run Silent has ${uniqueSelected.size} unique selected art assets; target is ${runSilentMinimumArtTarget}. ${runSilentArtSlots.length} production slots are planned in the manifest.`,
		);
	} else {
		report.validation.push(
			`PASS: Run Silent has ${uniqueSelected.size} unique selected art assets, meeting the ${runSilentMinimumArtTarget}-asset campaign-book target.`,
		);
	}
	const duplicatePaths = Array.from(uniqueSelected).filter(
		(path) => selected.filter((slot) => slot.selectedPath === path).length > 1,
	);
	if (duplicatePaths.length) {
		report.validation.push(
			`WARN: Run Silent intentionally reuses selected art pending generated replacements: ${duplicatePaths.join(", ")}.`,
		);
	}
	if (strict && !targetMet) {
		report.validation.push(
			"FAIL: RUN_SILENT_ART_STRICT=1 requires the full production art target before final export approval.",
		);
	}
}

function deterministicAsset(
	entry: EntryRecord,
	folder: string,
	context: string,
): string | null {
	const id = cleanText(entry.id);
	if (!id) return null;
	const publicPath = `/generated/compendium/${folder}/${id}.webp`;
	const fullPath = resolve(publicRoot, publicPath.slice(1));
	if (!existsSync(fullPath)) return null;
	return fileUrlFromPublic(publicPath, context);
}

function entryImage(
	entry: EntryRecord,
	folder: string | undefined,
	context: string,
): string | null {
	for (const key of ["image", "image_url", "thumbnailUrl", "portrait"]) {
		const raw = entry[key];
		if (typeof raw === "string" && raw.trim()) {
			const found = fileUrlFromPublic(raw, context);
			if (found) return found;
		}
	}
	if (folder) return deterministicAsset(entry, folder, context);
	return null;
}

function renderValue(value: unknown, depth = 0): string {
	if (isEmpty(value)) return "";
	if (typeof value === "string") return mdToHtml(value);
	if (typeof value === "number" || typeof value === "boolean") {
		return `<span>${esc(String(value))}</span>`;
	}
	if (Array.isArray(value)) {
		if (value.every((item) => ["string", "number", "boolean"].includes(typeof item))) {
			return `<ul class="compact-list">${value
				.map((item) => `<li>${inlineMd(cleanText(item))}</li>`)
				.join("")}</ul>`;
		}
		return value
			.map((item, index) =>
				typeof item === "object" && item !== null
					? `<div class="nested-card">${renderObject(item as EntryRecord, depth + 1)}</div>`
					: `<p>${inlineMd(`${index + 1}. ${cleanText(item)}`)}</p>`,
			)
			.join("");
	}
	if (typeof value === "object") return renderObject(value as EntryRecord, depth + 1);
	return `<span>${esc(String(value))}</span>`;
}

const INTERNAL_FIELD_KEYS = new Set([
	"id",
	"slug",
	"uuid",
	"created_at",
	"updated_at",
	"createdat",
	"updatedat",
	"deleted_at",
	"source_book",
	"sourcebook",
	"source_file",
	"sourcefile",
	"image",
	"image_url",
	"thumbnailurl",
	"portrait",
	"icon",
	"source",
	"source_kind",
	"source_name",
	"theme_tags",
	"generated_reason",
	"discovery_lore",
	"license_note",
	"system_interaction",
	"prompt",
	"image_prompt",
	"prompt_id",
	"generated_at",
	"imported_at",
	"embedding",
	"vector",
	"audit",
	"fingerprint",
	"payload_complete",
	"uniqueness_seed",
	"variant_note",
	"identity",
	"signature",
	"source_integrity",
	"allows_5e_baseline",
	"canon_guardrails",
	"ra_specific_mundane",
	"rules_payload_version",
]);

function isInternalFieldKey(key: string): boolean {
	const normalized = key.replace(/[-\s]/g, "_").toLowerCase();
	return (
		INTERNAL_FIELD_KEYS.has(normalized) ||
		normalized.endsWith("_id") ||
		normalized.endsWith("_url") ||
		normalized.endsWith("_path")
	);
}

function hasRenderableField(key: string, value: unknown): boolean {
	if (typeof value === "function") return false;
	if (isEmpty(value) || isCompactDefaultNoise(value)) return false;
	if (key === "__proto__" || isInternalFieldKey(key)) return false;
	if (Array.isArray(value)) {
		return value.some((item) =>
			typeof item === "object" && item !== null
				? Object.entries(item as EntryRecord).some(([childKey, childValue]) =>
						hasRenderableField(childKey, childValue),
					)
				: !isEmpty(item) && !isCompactDefaultNoise(item),
		);
	}
	if (typeof value === "object" && value !== null) {
		return Object.entries(value as EntryRecord).some(([childKey, childValue]) =>
			hasRenderableField(childKey, childValue),
		);
	}
	return true;
}

function renderObject(object: EntryRecord, depth = 0): string {
	const entries = Object.entries(object).filter(([key, value]) =>
		hasRenderableField(key, value),
	);
	if (!entries.length) return "";
	const className = depth > 0 ? "field-grid nested-grid" : "field-grid";
	return `<dl class="${className}">${entries
		.map(
			([key, value]) =>
				`<div class="field-row"><dt>${esc(labelize(key))}</dt><dd>${renderValue(value, depth + 1)}</dd></div>`,
		)
		.join("")}</dl>`;
}

function metaTags(entry: EntryRecord): string {
	const keys = [
		"rank",
		"rarity",
		"tier",
		"type",
		"item_type",
		"relic_type",
		"power_type",
		"school",
		"style",
		"level",
		"level_requirement",
		"job_name",
		"job",
		"faction",
	];
	const tags = keys
		.flatMap((key) => {
			const value = entry[key];
			if (isEmpty(value)) return [];
			if (Array.isArray(value)) return value.map((item) => `${labelize(key)}: ${sourcebookText(item)}`);
			if (typeof value === "object") return [];
			return [`${labelize(key)}: ${sourcebookText(value)}`];
		})
		.slice(0, 8);
	return `<div class="meta">${tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>`;
}

const ENTRY_ALWAYS_EXCLUDED = new Set([
	"display_name",
	"name",
	"title",
	"description",
	"summary",
	"content",
	"image",
	"image_url",
	"thumbnailUrl",
	"portrait",
	"source_book",
	"source",
	"source_kind",
	"source_name",
	"theme_tags",
	"generated_reason",
	"discovery_lore",
	"license_note",
	"system_interaction",
	"rank",
	"rarity",
	"tier",
	"type",
	"item_type",
	"relic_type",
	"power_type",
	"school",
	"style",
	"level",
	"level_requirement",
	"job_name",
	"job",
	"faction",
]);

const ENTRY_FIELD_RULES: Array<[RegExp, string[]]> = [
	[/contract seed/i, ["location", "authority_brief", "primary_threat", "site_truth", "pressure_clock", "complication", "reward_signal", "warden_move", "cross_reference"]],
	[/location/i, ["geography", "hazards", "encounters", "treasures", "notable_npcs", "flavor", "lore"]],
	[/job/i, ["primary_abilities", "hit_dice", "saving_throws", "armor_proficiencies", "weapon_proficiencies", "tool_proficiencies", "skill_proficiencies", "features", "abilities"]],
	[/path/i, ["features", "abilities", "stats", "prerequisites"]],
	[/background/i, ["skills", "skill_proficiencies", "tool_proficiencies", "languages", "equipment", "starting_equipment", "starting_credits", "features", "dangers", "personality_traits", "ideals", "bonds", "flaws"]],
	[/skill/i, ["ability", "benefits"]],
	[/feat/i, ["prerequisites", "benefits", "repeatable"]],
	[/fighting style/i, ["benefits", "effects", "mechanics", "limitations"]],
	[/sigil/i, ["effect_description", "effect_type", "active_feature", "passive_bonuses", "can_inscribe_on", "requires_level", "inscription_difficulty"]],
	[/tattoo/i, ["attunement", "body_part", "ink_type", "active_veins", "resonance_effect", "effects", "limitations"]],
	[/relic|artifact/i, ["cost", "attunement", "properties", "abilities", "requirements", "mechanics", "quirks", "corruption_risk", "lore"]],
	[/vehicle|mount/i, ["size", "speed", "armor_class", "hit_points", "carry_capacity_lbs", "cargo_capacity_lbs", "crew_positions", "abilities", "bonded", "bonded_from_name"]],
	[/condition/i, ["effects", "condition_effects", "condition_duration", "condition_removal", "condition_save", "stages", "cure_lore"]],
	[/regent/i, ["title", "hit_dice", "primary_ability", "saving_throws", "skill_proficiencies", "armor_proficiencies", "weapon_proficiencies", "tool_proficiencies", "regent_requirements", "class_features", "features", "spellcasting"]],
	[/pantheon/i, ["directive", "portfolio", "sigil", "manifestation", "specializations", "dogma", "worshippers", "temples", "home_realm", "relationships"]],
	[/warden table|rift table|operations table|reward table/i, ["group", "category", "diceFormula", "entries", "effects", "description"]],
];

const GENERIC_ENTRY_FIELD_KEYS = [
	"prerequisites",
	"requirements",
	"activation",
	"activation_action",
	"activation_cost",
	"range",
	"duration",
	"concentration",
	"uses_per_rest",
	"recharge",
	"effects",
	"mechanics",
	"limitations",
	"features",
	"abilities",
	"properties",
	"damage",
	"damage_type",
	"higher_levels",
	"lore",
	"flavor",
	"tags",
];

function entryFieldKeys(context: string): string[] {
	const matched = ENTRY_FIELD_RULES.find(([pattern]) => pattern.test(context));
	return matched?.[1] ?? GENERIC_ENTRY_FIELD_KEYS;
}

function curatedEntryFields(entry: EntryRecord, context: string): EntryRecord {
	const keys = entryFieldKeys(context);
	const fields: EntryRecord = {};
	for (const key of keys) {
		if (ENTRY_ALWAYS_EXCLUDED.has(key)) continue;
		if (Object.hasOwn(entry, key) && hasRenderableField(key, entry[key])) {
			fields[key] = entry[key];
		}
	}
	return fields;
}

const ANOMALY_FIELD_KEYS = [
	"skills",
	"saving_throws",
	"damage_vulnerabilities",
	"damage_resistances",
	"damage_immunities",
	"condition_immunities",
	"senses",
	"languages",
	"traits",
	"actions",
	"bonus_actions",
	"reactions",
	"legendary_actions",
	"lair",
	"abilities",
	"weaknesses",
	"xp",
	"treasure",
	"environment",
	"organization",
	"tameable",
];

function firstRenderable(...values: unknown[]): unknown {
	return values.find((value) => !isEmpty(value) && !isCompactDefaultNoise(value));
}

function anomalyCoreStats(entry: EntryRecord, stats: EntryRecord): EntryRecord {
	const ac = firstRenderable(entry.ac, entry.armor_class, stats.ac, stats.armor_class);
	const acSource = firstRenderable(entry.ac_source, stats.ac_source);
	const hp = firstRenderable(entry.hp, entry.hit_points, stats.hp, stats.hit_points);
	const hitDice = firstRenderable(entry.hit_dice, stats.hit_dice);
	const challenge = firstRenderable(entry.challenge_rating, entry.cr, stats.challenge_rating, stats.cr);
	const proficiency = firstRenderable(entry.proficiency_bonus, stats.proficiency_bonus);
	return {
		size: firstRenderable(entry.size, stats.size),
		type: firstRenderable(entry.type, stats.type),
		alignment: firstRenderable(entry.alignment, stats.alignment),
		armor_class: ac && acSource ? `${sourcebookText(ac)} (${sourcebookText(acSource)})` : ac,
		hit_points: hp && hitDice ? `${sourcebookText(hp)}; ${sourcebookText(hitDice)}` : hp,
		speed: firstRenderable(entry.speed, stats.speed),
		challenge,
		proficiency_bonus: proficiency,
	};
}

function curatedAnomalyFields(entry: EntryRecord, stats: EntryRecord): EntryRecord {
	const fields: EntryRecord = {};
	for (const key of ANOMALY_FIELD_KEYS) {
		if (Object.hasOwn(entry, key) && hasRenderableField(key, entry[key])) {
			fields[key] = entry[key];
		}
	}
	if (!fields.saving_throws && hasRenderableField("saving_throws", stats.saving_throws)) {
		fields.saving_throws = stats.saving_throws;
	}
	return fields;
}

function entryTierClass(entry: EntryRecord): string {
	const rarity = cleanText(entry.rarity).toLowerCase();
	const rank = cleanText(entry.rank).toLowerCase();
	if (rarity === "legendary" || rarity === "artifact" || rank === "s") return "entry--legendary";
	if (rarity === "rare" || rarity === "epic" || rank === "a") return "entry--rare";
	if (rarity === "uncommon" || rank === "b") return "entry--uncommon";
	return "";
}



function renderJobEntry(entry: EntryRecord, options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean }): string {
	const title = cleanText(entry.display_name || entry.name || entry.title || entry.id || "Untitled Job");
	const description = entry.description ?? entry.summary ?? entry.content;
	const image = options.includeArt ? entryImage(entry, options.folder, `${options.context}: ${title}`) : null;
	const tier = entryTierClass(entry);
	const classNames = options.classified ? `entry entry--classified` : tier ? `entry ${tier}` : "entry";

	let html = `<article class="${classNames}" id="${slugify(`${options.context}-${title}`)}">`;
	if (image) html += `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>`;
	html += `<h3>${esc(title)}</h3>`;
	html += metaTags(entry);
	if (!isEmpty(description)) html += `<div class="entry-description">${mdToHtml(description as string)}</div>`;

	html += `<div class="stat-block">`;
	html += `<h4>Hit Points</h4>`;
	html += `<p><strong>Hit Dice:</strong> ${esc(String(entry.hitDie || entry.hit_dice || ""))}</p>`;
	html += `<h4>Proficiencies</h4>`;
	if (entry.armorProficiencies) html += `<p><strong>Armor:</strong> ${esc((entry.armorProficiencies as string[]).join(", "))}</p>`;
	if (entry.weaponProficiencies) html += `<p><strong>Weapons:</strong> ${esc((entry.weaponProficiencies as string[]).join(", "))}</p>`;
	const tools = entry.toolProficiencies || entry.tool_proficiencies;
	if (tools && (tools as string[]).length > 0) html += `<p><strong>Tools:</strong> ${esc((tools as string[]).join(", "))}</p>`;
	const saves = entry.savingThrows || entry.saving_throws;
	if (saves) html += `<p><strong>Saving Throws:</strong> ${esc((saves as string[]).join(", "))}</p>`;
	if (entry.skillChoices) html += `<p><strong>Skills:</strong> ${esc((entry.skillChoices as string[]).join(", "))}</p>`;
	html += `</div>`;

	html += `<h4>The ${esc(title)}</h4>`;
	html += `<table class="progression-table"><thead><tr><th>Level</th><th>Proficiency Bonus</th><th>Features</th>`;
	const hasPowers = Array.isArray(entry.powersKnown);
	const hasTechniques = Array.isArray(entry.techniquesKnown);
	if (hasPowers) html += `<th>Powers Known</th>`;
	if (hasTechniques) html += `<th>Techniques Known</th>`;
	html += `</tr></thead><tbody>`;

	for (let level = 1; level <= 20; level++) {
		const profBonus = `+${Math.ceil(level / 4) + 1}`;
		const featuresAtLevel = (entry.classFeatures as any[])?.filter(f => f.level === level) || [];
		const featureNames = featuresAtLevel.map(f => f.name).join(", ") || "-";
		html += `<tr><td>${level}</td><td>${profBonus}</td><td>${esc(featureNames)}</td>`;
		if (hasPowers) html += `<td>${(entry.powersKnown as number[])[level - 1] || "-"}</td>`;
		if (hasTechniques) html += `<td>${(entry.techniquesKnown as number[])[level - 1] || "-"}</td>`;
		html += `</tr>`;
	}
	html += `</tbody></table>`;

	if (Array.isArray(entry.classFeatures) && entry.classFeatures.length > 0) {
		html += `<h4>Class Features</h4>`;
		const sortedFeatures = [...entry.classFeatures].sort((a, b) => a.level - b.level);
		for (const feature of sortedFeatures) {
			html += `<div class="feature-block">`;
			html += `<h5>${esc(feature.name)}</h5>`;
			if (feature.description) html += `<div class="feature-description">${mdToHtml(feature.description)}</div>`;
			html += `</div>`;
		}
	}

	html += `</article>`;
	return html;
}

function renderPathEntry(entry: EntryRecord, options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean }): string {
	const title = cleanText(entry.display_name || entry.name || entry.title || entry.id || "Untitled Path");
	const description = entry.description ?? entry.summary ?? entry.content;
	const image = options.includeArt ? entryImage(entry, options.folder, `${options.context}: ${title}`) : null;
	const tier = entryTierClass(entry);
	const classNames = options.classified ? `entry entry--classified` : tier ? `entry ${tier}` : "entry";

	let html = `<article class="${classNames}" id="${slugify(`${options.context}-${title}`)}">`;
	if (image) html += `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>`;
	html += `<h3>${esc(title)}</h3>`;
	html += metaTags(entry);
	
	if (entry.requirements) {
		const reqs = entry.requirements as Record<string, any>;
		const skills = Array.isArray(reqs.skills) ? reqs.skills : [];
		const prerequisites = Array.isArray(reqs.prerequisites)
			? reqs.prerequisites
			: [];
		html += `<div class="prerequisites"><p><strong>Prerequisites:</strong> Level ${reqs.level || 3} ${entry.jobName ? esc(String(entry.jobName)) : "Job"}</p>`;
		if (skills.length > 0) {
			html += `<p><strong>Required Skills:</strong> ${esc(skills.join(", "))}</p>`;
		}
		if (prerequisites.length > 0) {
			html += `<p><strong>Other Requirements:</strong> ${esc(prerequisites.join(", "))}</p>`;
		}
		html += `</div>`;
	}

	if (!isEmpty(description)) html += `<div class="entry-description">${mdToHtml(description as string)}</div>`;

	if (Array.isArray(entry.features) && entry.features.length > 0) {
		html += `<h4>Path Features</h4>`;
		const sortedFeatures = [...entry.features].sort((a, b) => (a.level || 0) - (b.level || 0));
		for (const feature of sortedFeatures) {
			html += `<div class="feature-block">`;
			html += `<h5>Level ${esc(String(feature.level ?? "—"))} — ${esc(feature.name)}</h5>`;
			if (feature.description) html += `<div class="feature-description">${mdToHtml(feature.description)}</div>`;
			html += `</div>`;
		}
	}
	
	if (Array.isArray(entry.abilities) && entry.abilities.length > 0) {
		html += `<h4>Path Abilities</h4>`;
		for (const ability of entry.abilities as any[]) {
			html += `<div class="feature-block">`;
			html += `<h5>${esc(ability.name || ability)}</h5>`;
			const abilityMeta = [
				ability.level ? `Level ${ability.level}` : null,
				ability.actionType || ability.cost || null,
				ability.uses?.formula
					? `${ability.uses.formula} / ${String(ability.uses.recharge).replace("-", " ")}`
					: null,
				ability.resource ? `Resource: ${ability.resource}` : null,
				ability.tracking === "manual" ? "Manual tracking" : null,
			].filter(Boolean);
			if (abilityMeta.length > 0) {
				html += `<p class="feature-meta">${esc(abilityMeta.join(" · "))}</p>`;
			}
			if (ability.description) html += `<div class="feature-description">${mdToHtml(ability.description)}</div>`;
			html += `</div>`;
		}
	}

	html += `</article>`;
	return html;
}

function renderRegentEntry(entry: EntryRecord, options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean }): string {
	const title = cleanText(entry.display_name || entry.name || entry.title || entry.id || "Untitled Regent");
	const description = entry.description ?? entry.summary ?? entry.content;
	const image = options.includeArt ? entryImage(entry, options.folder, `${options.context}: ${title}`) : null;
	const tier = entryTierClass(entry);
	const classNames = options.classified ? `entry entry--classified` : tier ? `entry ${tier}` : "entry";

	let html = `<article class="${classNames}" id="${slugify(`${options.context}-${title}`)}">`;
	if (image) html += `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>`;
	html += `<h3>${esc(title)}</h3>`;
	html += metaTags(entry);
	if (!isEmpty(description)) html += `<div class="entry-description">${mdToHtml(description as string)}</div>`;

	html += `<div class="stat-block">`;
	if (entry.hit_dice) html += `<p><strong>Hit Dice:</strong> ${esc(String(entry.hit_dice))}</p>`;
	if (entry.primary_ability) html += `<p><strong>Primary Ability:</strong> ${esc((entry.primary_ability as string[]).join(", "))}</p>`;
	if (entry.saving_throws) html += `<p><strong>Saving Throws:</strong> ${esc((entry.saving_throws as string[]).join(", "))}</p>`;
	if (entry.armor_proficiencies) html += `<p><strong>Armor:</strong> ${esc((entry.armor_proficiencies as string[]).join(", "))}</p>`;
	if (entry.weapon_proficiencies) html += `<p><strong>Weapons:</strong> ${esc((entry.weapon_proficiencies as string[]).join(", "))}</p>`;
	if (entry.skill_proficiencies) html += `<p><strong>Skills:</strong> ${esc((entry.skill_proficiencies as string[]).join(", "))}</p>`;
	html += `</div>`;

	if (Array.isArray(entry.class_features) && entry.class_features.length > 0) {
		html += `<h4>Regent Features</h4>`;
		html += `<table class="progression-table"><thead><tr><th>Level</th><th>Features</th></tr></thead><tbody>`;
		const maxLevel = Math.max(...entry.class_features.map(f => f.level || 1), 10);
		for (let level = 1; level <= maxLevel; level++) {
			const featuresAtLevel = entry.class_features.filter(f => f.level === level);
			if (featuresAtLevel.length > 0) {
				const featureNames = featuresAtLevel.map(f => f.name).join(", ");
				html += `<tr><td>${level}</td><td>${esc(featureNames)}</td></tr>`;
			}
		}
		html += `</tbody></table>`;

		const sortedFeatures = [...entry.class_features].sort((a, b) => (a.level || 0) - (b.level || 0));
		for (const feature of sortedFeatures) {
			html += `<div class="feature-block">`;
			html += `<h5>${esc(feature.name)}</h5>`;
			if (feature.description) html += `<div class="feature-description">${mdToHtml(feature.description)}</div>`;
			html += `</div>`;
		}
	}

	html += `</article>`;
	return html;
}

function renderItemEntry(entry: EntryRecord, options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean }): string {
	const title = cleanText(entry.display_name || entry.name || entry.title || entry.id || "Untitled Item");
	const description = entry.description ?? entry.summary ?? entry.content;
	const image = options.includeArt ? entryImage(entry, options.folder, `${options.context}: ${title}`) : null;
	const tier = entryTierClass(entry);
	const classNames = options.classified ? `entry entry--classified` : tier ? `entry ${tier}` : "entry";

	let html = `<article class="${classNames}" id="${slugify(`${options.context}-${title}`)}">`;
	if (image) html += `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>`;
	html += `<h3>${esc(title)}</h3>`;
	
	const typeStr = entry.weapon_type ? `Weapon (${entry.weapon_type})` : entry.item_type || entry.type || "Wondrous item";
	const rarityStr = entry.rarity || "common";
	const attuneStr = entry.requires_attunement ? " (requires attunement)" : "";
	html += `<p><em>${esc(String(typeStr))}, ${esc(String(rarityStr))}${esc(attuneStr)}</em></p>`;
	
	const weightStr = entry.weight != null ? `${entry.weight} lb.` : null;
	const costStr = entry.value != null ? `${entry.value} GC` : null;
	if (weightStr || costStr) {
		html += `<p>${esc([weightStr, costStr].filter(Boolean).join(" | "))}</p>`;
	}

	if (entry.armor_class) html += `<p><strong>Armor Class:</strong> ${esc(String(entry.armor_class))}</p>`;
	if (entry.damage) html += `<p><strong>Damage:</strong> ${esc(String(entry.damage))} ${esc(String(entry.damage_type || ""))}</p>`;
	
	const props = entry.simple_properties || entry.properties;
	if (Array.isArray(props) && props.length > 0 && typeof props[0] === 'string') {
		html += `<p><strong>Properties:</strong> ${esc(props.join(", "))}</p>`;
	}

	if (!isEmpty(description)) html += `<div class="entry-description">${mdToHtml(description as string)}</div>`;

	if (entry.mechanics) html += `<div class="entry-mechanics">${mdToHtml(String(entry.mechanics))}</div>`;
	if (entry.effects) {
		if (Array.isArray(entry.effects)) {
			html += `<ul>${entry.effects.map(e => `<li>${mdToHtml(typeof e === 'string' ? e : e.description || e.name || JSON.stringify(e))}</li>`).join("")}</ul>`;
		} else if (typeof entry.effects === 'string') {
			html += `<div class="entry-effects">${mdToHtml(entry.effects)}</div>`;
		}
	}

	html += `</article>`;
	return html;
}

function renderVehicleEntry(entry: EntryRecord, options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean }): string {
	const title = cleanText(entry.display_name || entry.name || entry.title || entry.id || "Untitled Vehicle");
	const description = entry.description ?? entry.summary ?? entry.content;
	const image = options.includeArt ? entryImage(entry, options.folder, `${options.context}: ${title}`) : null;
	const tier = entryTierClass(entry);
	const classNames = options.classified ? `entry entry--classified` : tier ? `entry ${tier}` : "entry";

	let html = `<article class="${classNames}" id="${slugify(`${options.context}-${title}`)}">`;
	if (image) html += `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>`;
	html += `<h3>${esc(title)}</h3>`;
	
	const typeStr = entry.vehicle_type || "Vehicle";
	const sizeStr = entry.size || "Large";
	html += `<p><em>${esc(String(sizeStr))} ${esc(String(typeStr))}</em></p>`;
	
	html += `<div class="stat-block">`;
	if (entry.armor_class) html += `<p><strong>Armor Class:</strong> ${esc(String(entry.armor_class))}</p>`;
	if (entry.hit_points) {
		const hp = entry.hit_points as any;
		html += `<p><strong>Hit Points:</strong> ${esc(String(hp.max || hp))}</p>`;
	}
	if (entry.speed) {
		const spd = entry.speed as any;
		html += `<p><strong>Speed:</strong> ${esc(Object.entries(spd).map(([k, v]) => `${v} ft. ${k}`).join(", "))}</p>`;
	}
	if (entry.carry_capacity_lbs) html += `<p><strong>Carry Capacity:</strong> ${esc(String(entry.carry_capacity_lbs))} lbs.</p>`;
	if (entry.cargo_capacity_lbs) html += `<p><strong>Cargo Capacity:</strong> ${esc(String(entry.cargo_capacity_lbs))} lbs.</p>`;
	html += `</div>`;

	if (!isEmpty(description)) html += `<div class="entry-description">${mdToHtml(description as string)}</div>`;

	if (Array.isArray(entry.abilities) && entry.abilities.length > 0) {
		html += `<h4>Features</h4>`;
		for (const ability of entry.abilities as any[]) {
			html += `<div class="feature-block">`;
			html += `<h5>${esc(ability.name || ability)}</h5>`;
			if (ability.description) html += `<div class="feature-description">${mdToHtml(ability.description)}</div>`;
			html += `</div>`;
		}
	}
	
	html += `</article>`;
	return html;
}

function renderBackgroundEntry(entry: EntryRecord, options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean }): string {
	const title = cleanText(entry.display_name || entry.name || entry.title || entry.id || "Untitled Background");
	const description = entry.description ?? entry.summary ?? entry.content;
	const image = options.includeArt ? entryImage(entry, options.folder, `${options.context}: ${title}`) : null;
	const tier = entryTierClass(entry);
	const classNames = options.classified ? `entry entry--classified` : tier ? `entry ${tier}` : "entry";

	let html = `<article class="${classNames}" id="${slugify(`${options.context}-${title}`)}">`;
	if (image) html += `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>`;
	html += `<h3>${esc(title)}</h3>`;
	
	html += `<div class="stat-block">`;
	if (entry.skill_proficiencies) html += `<p><strong>Skill Proficiencies:</strong> ${esc((entry.skill_proficiencies as string[]).join(", "))}</p>`;
	if (entry.tool_proficiencies) html += `<p><strong>Tool Proficiencies:</strong> ${esc((entry.tool_proficiencies as string[]).join(", "))}</p>`;
	if (entry.languages) html += `<p><strong>Languages:</strong> ${esc((entry.languages as string[]).join(", "))}</p>`;
	if (entry.equipment) html += `<p><strong>Equipment:</strong> ${esc((entry.equipment as string[]).join(", "))}</p>`;
	if (entry.starting_credits) html += `<p><strong>Starting Credits:</strong> ${esc(String(entry.starting_credits))} GC</p>`;
	html += `</div>`;

	if (!isEmpty(description)) html += `<div class="entry-description">${mdToHtml(description as string)}</div>`;

	if (Array.isArray(entry.features) && entry.features.length > 0) {
		html += `<h4>Feature</h4>`;
		for (const feature of entry.features as any[]) {
			html += `<div class="feature-block">`;
			html += `<h5>${esc(feature.name)}</h5>`;
			if (feature.description) html += `<div class="feature-description">${mdToHtml(feature.description)}</div>`;
			html += `</div>`;
		}
	}

	const charTraits = [
		{ key: "personality_traits", label: "Personality Traits" },
		{ key: "ideals", label: "Ideals" },
		{ key: "bonds", label: "Bonds" },
		{ key: "flaws", label: "Flaws" },
	];

	for (const trait of charTraits) {
		const val = entry[trait.key];
		if (Array.isArray(val) && val.length > 0) {
			html += `<h4>${esc(trait.label)}</h4>`;
			html += `<ul>${val.map(v => `<li>${esc(String(v))}</li>`).join("")}</ul>`;
		}
	}

	html += `</article>`;
	return html;
}

function dispatchRenderEntry(
	entry: EntryRecord,
	options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean } = {
		context: "Entry",
	},
): string {
	const ctx = (options.context || "").toLowerCase();
	if (ctx === "job") return renderJobEntry(entry, options);
	if (ctx === "path") return renderPathEntry(entry, options);
	if (ctx === "regent") return renderRegentEntry(entry, options);
	if (ctx === "background") return renderBackgroundEntry(entry, options);
	if (ctx === "vehicle" || ctx === "mount") return renderVehicleEntry(entry, options);
	if (ctx === "item" || ctx === "weapon" || ctx === "armor" || ctx === "shield" || ctx === "consumable" || ctx === "relic" || ctx === "artifact") return renderItemEntry(entry, options);
	return renderEntry(entry, options);
}


function renderEntry(
	entry: EntryRecord,
	options: { folder?: string; context: string; classified?: boolean; includeArt?: boolean } = {
		context: "Entry",
	},
): string {
	const title = cleanText(
		entry.display_name || entry.name || entry.title || entry.id || "Untitled Entry",
	);
	const description = entry.description ?? entry.summary ?? entry.content;
	const image = options.includeArt
		? entryImage(entry, options.folder, `${options.context}: ${title}`)
		: null;
	const fields = curatedEntryFields(entry, options.context);
	const tier = entryTierClass(entry);
	const classNames = options.classified
		? `entry entry--classified`
		: tier ? `entry ${tier}` : "entry";
	return `<article class="${classNames}" id="${slugify(`${options.context}-${title}`)}">
		${image ? `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>` : ""}
		<h3>${esc(title)}</h3>
		${metaTags(entry)}
		${!isEmpty(description) ? `<div class="entry-description">${mdToHtml(description)}</div>` : ""}
		${renderObject(fields)}
	</article>`;
}

function renderAnomaly(
	entry: EntryRecord,
	options: { folder?: string; context?: string; includeArt?: boolean } = {},
): string {
	const title = cleanText(entry.name || entry.id || "Anomaly");
	const stats = (entry.stats && typeof entry.stats === "object"
		? (entry.stats as EntryRecord)
		: {}) as EntryRecord;
	const scores =
		stats.ability_scores && typeof stats.ability_scores === "object"
			? (stats.ability_scores as EntryRecord)
			: {};
	const image = options.includeArt
		? entryImage(entry, options.folder, `${options.context ?? "Anomaly"}: ${title}`)
		: null;
	const abilityKeys = [
		["STR", "strength"],
		["AGI", "agility"],
		["VIT", "vitality"],
		["INT", "intelligence"],
		["SENSE", "sense"],
		["PRE", "presence"],
	];
	const fields = curatedAnomalyFields(entry, stats);
	const coreStats = anomalyCoreStats(entry, stats);
	const rank = cleanText(entry.rank || stats.rank || "");
	const cr = cleanText(stats.challenge_rating || entry.challenge_rating || "");
	const ac = cleanText(stats.armor_class || entry.armor_class || "");
	const hp = cleanText(stats.hit_points || entry.hit_points || "");
	const speed = cleanText(stats.speed || entry.speed || "");
	const typeStr = cleanText(entry.creature_type || entry.type || stats.type || "");
	const threatLabel = [rank ? `Rank ${rank}` : "", cr ? `CR ${cr}` : ""].filter(Boolean).join(" \u00b7 ");
	const coreStatParts = [
		ac ? `<span><strong>AC</strong> ${esc(ac)}</span>` : "",
		hp ? `<span><strong>HP</strong> ${esc(hp)}</span>` : "",
		speed ? `<span><strong>Speed</strong> ${esc(speed)}</span>` : "",
	].filter(Boolean).join("");
	return `<article class="statblock" id="${slugify(`anomaly-${title}`)}">
		<div class="statblock-header">
			<h3>${esc(title)}</h3>
			${threatLabel ? `<span class="threat-badge">\u2694 ${esc(threatLabel)}</span>` : ""}
		</div>
		${typeStr ? `<div class="statblock-type">${esc(typeStr)}</div>` : ""}
		${coreStatParts ? `<div class="statblock-divider"></div><div class="statblock-core">${coreStatParts}</div>` : ""}
		<div class="statblock-divider"></div>
		<div class="ability-grid">${abilityKeys
			.map(
				([label, key]) =>
					`<div><strong>${label}</strong><span>${esc(scores[key] ?? "-")}</span></div>`,
			)
			.join("")}</div>
		<div class="statblock-divider"></div>
		${image ? `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>` : ""}
		${!isEmpty(entry.description) ? `<div class="entry-description">${mdToHtml(entry.description)}</div>` : ""}
		${metaTags(entry)}
		<div class="statblock-section">${renderObject(coreStats)}</div>
		<div class="statblock-section">${renderObject(fields)}</div>
	</article>`;
}

function renderCatalog(
	title: string,
	summary: string,
	entries: unknown[],
	options: {
		folder?: string;
		context: string;
		classified?: boolean;
		anomaly?: boolean;
	} = { context: title },
): string {
	const sorted = [...(entries as EntryRecord[])].sort((a, b) =>
		cleanText(a.name || a.title || a.id).localeCompare(
			cleanText(b.name || b.title || b.id),
		),
	);
	const guide = catalogUseGuide(title, options.context, !!options.anomaly);
	return `<section class="section-block">
		<div class="section-intro">
			<h2>${esc(title)}</h2>
			<p>${esc(summary)}</p>
		</div>
		<div class="catalog-grid">${sorted
			.map((entry, index) =>
				options.anomaly
					? renderAnomaly(entry, {
							folder: options.folder,
							context: options.context,
							includeArt: shouldFeatureEntryArt(entry, index, sorted.length, options.context, true),
						})
					: dispatchRenderEntry(entry, {
							folder: options.folder,
							context: options.context,
							classified: options.classified,
							includeArt: shouldFeatureEntryArt(entry, index, sorted.length, options.context, false),
						}),
			)
			.join("")}</div>
	</section>`;
}

function shouldFeatureEntryArt(
	entry: EntryRecord,
	index: number,
	total: number,
	context: string,
	isAnomaly: boolean,
): boolean {
	const rarity = cleanText(entry.rarity).toLowerCase();
	const rank = cleanText(entry.rank).toUpperCase();
	if (total <= 24) return true;
	if (total > 150) return index % 8 === 0;
	if (/sample|regent|pantheon|relic|artifact|class|origin|subclass|discipline/i.test(context)) return true;
	if (isAnomaly) return index % 2 === 0 || rank === "S" || rank === "A";
	if (/(legendary|artifact|mythic|epic)/i.test(rarity)) return true;
	if (rank === "S" || rank === "A" || rank === "B") return index % 2 === 0;
	return index % 4 === 0;
}

function catalogUseGuide(title: string, context: string | undefined, isAnomaly: boolean): string {
	const ctx = (context || title).toLowerCase();
	let body = "";

	if (ctx.includes("job")) {
		body = `<h3>How To Read A Job Entry</h3>
		<p>A Job is the broadest expression of your Awakening. It determines your hit dice, saving throw proficiencies, armor and weapon access, primary abilities, and which ability categories (Techniques, Powers, Spells) you can use natively. Your Job is not a career title; it is a Bureau classification for how your Essence manifests under pressure.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Hit Dice", "Your durability pool. Roll these during short rests to recover hit points. Larger dice mean more survivable in sustained operations."],
			["Saving Throws", "Which two ability saves you add your proficiency bonus to. These define your natural resistance profile."],
			["Primary Abilities", "The ability scores your Job relies on most. Prioritize these during character creation."],
			["Armor / Weapon Proficiencies", "What you can use without penalty. Going outside these requires feats, Rune absorption, or Warden approval."],
			["Features", "Level-gated abilities unique to this Job. Read the full feature description before choosing a Job."],
		])}
		<h3>Job And Path</h3>
		<p>Every Job branches into Paths at a specified level. Your Path specializes your Job: a Striker might become a shadow operative or a heavy weapons specialist. Choose your Job for the broad shape of your character, then choose your Path for its specific expression. The Ascendant Guide lists all Paths after the Jobs chapter.</p>
		<h3>Cross-Access</h3>
		<p>Your Job determines native ability access. A martial Job has native Technique access but no native Spell slots. Cross-access through Rune absorption lets you learn outside your native categories with limited uses. See the Rune Mechanics chapter in Awakened Arts for the full rules.</p>`;
	} else if (ctx.includes("path")) {
		body = `<h3>How To Read A Path Entry</h3>
		<p>A Path is your specialization within your Job. It grants unique features at specific levels and shapes how your Awakening expresses in the field. Two Ascendants with the same Job and different Paths play distinctly at the table.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Prerequisites", "What you need before choosing this Path: minimum level, specific Job, and sometimes a story or training condition."],
			["Features", "Level-gated abilities that define this specialization. Features stack with your Job features."],
			["Abilities", "Specific Techniques, Powers, or Spells unlocked by this Path. These are your signature moves."],
		])}
		<h3>Choosing A Path</h3>
		<p>Read every Path available to your Job before committing. Paths change your action vocabulary, not just your numbers. Pick the Path that gives you the decisions you want to make during play, not just the strongest damage option.</p>`;
	} else if (ctx.includes("background")) {
		body = `<h3>How To Read A Background Entry</h3>
		<p>Your Background is who you were before Awakening. It grants skill proficiencies, tool proficiencies, languages, starting equipment, and a feature that represents your life experience. Backgrounds also provide personality traits, ideals, bonds, and flaws that anchor your character in the Rift Age world.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Skill Proficiencies", "Two skills you are trained in from your pre-Awakening life. These stack with your Job skills."],
			["Tool Proficiencies", "Specialized equipment you know how to use: vehicles, kits, instruments, or trade tools."],
			["Starting Equipment", "Gear you carry into your first session. Combined with your Job's starting equipment."],
			["Feature", "A narrative advantage from your past life: contacts, knowledge, institutional access, or social standing."],
		])}
		<p>Your Background does not restrict your future. A former street medic can become a heavy weapons Destroyer. The Background shapes where you came from, not where you are going.</p>`;
	} else if (ctx.includes("skill")) {
		body = `<h3>Using Skills At The Table</h3>
		<p>A skill represents broad training in a specific area. When you are proficient in a skill, add your proficiency bonus to ability checks using that skill. The Warden calls for skill checks only when the outcome is uncertain and the result matters.</p>
		${rulesTable(["Guideline", "Rule"], [
			["Trained vs untrained", "Anyone can attempt most checks. Proficiency means you are reliably competent; expertise means you are exceptional."],
			["Ability pairing", "Each skill has a default ability, but the Warden may pair a skill with a different ability when the fiction demands it."],
			["When not to roll", "If success is trivial or failure would not change the scene, the Warden should not call for a check."],
			["Contested checks", "When two creatures oppose each other directly, both roll and the higher total wins."],
		])}`;
	} else if (ctx.includes("feat")) {
		body = `<h3>How Feats Work</h3>
		<p>Feats are special talents acquired through training, experience, or supernatural exposure. When your Job progression offers a feat, you may choose one from this catalog instead of an ability score increase. Some feats have prerequisites; check these before selecting.</p>
		${rulesTable(["Guideline", "Rule"], [
			["Prerequisites", "If a feat requires a minimum ability score, specific Job, or level, you must meet the requirement at the time of selection."],
			["Stacking", "Feats that grant proficiency in a skill you already have typically upgrade that proficiency to expertise."],
			["Repeatable feats", "Unless the entry says Repeatable, you cannot take the same feat twice."],
			["Ability score alternative", "You always have the option to increase one ability score by 2 or two scores by 1 instead of taking a feat."],
		])}`;
	} else if (ctx.includes("fighting style")) {
		body = `<h3>Fighting Styles</h3>
		<p>A Fighting Style is a trained combat discipline that grants a persistent mechanical benefit. Most martial and hybrid Jobs can select one Fighting Style during character creation. You cannot take the same Fighting Style twice unless a feature explicitly allows it.</p>
		<p>Fighting Styles combine with Techniques: your Style sets your passive stance, while Techniques are active maneuvers you spend resources to perform. Choose a Style that supports the weapons and positioning you intend to use most often.</p>`;
	} else if (ctx.includes("technique")) {
		body = `<h3>How To Use Techniques</h3>
		<p>Techniques are trained martial and tactical actions: weapon strikes, movement maneuvers, defensive positions, and combat patterns honed through practice. They are not supernatural in the way Spells are; they represent peak physical and tactical training amplified by Awakened reflexes.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Activation", "The action type required: Action, Bonus Action, or Reaction. This determines when you can use it in a round."],
			["Uses per rest", "How many times you can perform this Technique before resting. Short rest techniques are your bread and butter; long rest techniques are your finishers."],
			["Prerequisites", "Weapon type, stance, or positional requirement. If the prerequisite is not met, the Technique cannot be activated."],
			["Effects", "What happens when you use it. Read the full text; Techniques often have secondary effects beyond damage."],
		])}
		<p>Techniques combine with Fighting Styles and weapon properties. A Technique that requires a melee weapon benefits from your Style bonuses when applicable. The Warden adjudicates edge cases using the Rules Priority in the Warden Guide.</p>`;
	} else if (ctx.includes("power")) {
		body = `<h3>How To Use Powers</h3>
		<p>Powers are innate Awakened abilities drawn from your Job and Essence structure. Unlike Spells, Powers do not require external components or spell slots. They represent your direct authority over the supernatural forces your Awakening unlocked.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Activation", "Action type required. Most Powers use an Action or Bonus Action."],
			["Range", "Self, Touch, or a distance in feet. Self-range Powers affect only you."],
			["Duration", "Instantaneous resolves immediately. Concentration means you maintain the effect and can only hold one at a time."],
			["Uses per rest", "Powers typically refresh on short or long rest. The entry specifies which."],
			["Scaling", "Some Powers improve at higher levels or ranks. Check the Higher Levels or At Rank field."],
		])}
		<p>Powers are native to your Job. If you absorb a Power through a Rune from outside your native categories, it follows cross-access rules from the Rune Mechanics chapter.</p>`;
	} else if (ctx.includes("spell")) {
		body = `<h3>How To Use Spells</h3>
		<p>Spells are structured Essence effects with defined components, spell slots, schools, ranges, durations, and often concentration requirements. Casting a Spell consumes a spell slot of the appropriate level unless the entry states otherwise.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Level", "The spell slot level required to cast. Cantrips are level 0 and cost no slot."],
			["School", "Thematic classification. Schools interact with some Job and Path features."],
			["Components", "What the spell requires: Verbal (speaking), Somatic (gestures), Material (objects). If a component is consumed, the entry says so."],
			["Concentration", "You can maintain only one concentration spell at a time. Taking damage forces a concentration save."],
			["Higher Levels", "Additional effects when cast using a higher-level spell slot. If this field is absent, the spell does not benefit from upcasting."],
		])}
		<p>Spell slot recovery follows your Job's rest cadence. Most full casters recover all slots on a long rest. Some Paths and features grant partial recovery on a short rest.</p>`;
	} else if (ctx.includes("rune")) {
		body = `<h3>How Runes Work</h3>
		<p>A Rune is an inscribed Essence pattern. When absorbed, it permanently teaches the Ascendant the referenced ability. Runes are consumable: the physical object is destroyed during absorption. The learned ability remains forever.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Rarity", "Common through Legendary. Higher rarity Runes teach more powerful abilities and grant better cross-access formulas."],
			["Teaches", "The specific Technique, Power, or Spell this Rune unlocks on absorption."],
			["Access type", "Native (your Job already supports this category) or Cross-access (outside your normal categories, with limited uses)."],
			["Activation fields", "After absorption, use the Rune entry's action, cost, range, duration, and concentration lines."],
		])}
		<p>Native absorption adds the ability to your normal list. Cross-access absorption grants limited uses per long rest calculated from your proficiency bonus, primary ability modifier, and the Rune's rarity bonus. See the Rune Mechanics chapter for the full formula and active slot cap.</p>`;
	} else if (ctx.includes("sigil")) {
		body = `<h3>How Sigils Work</h3>
		<p>A Sigil is a permanent inscription etched into a weapon, armor, shield, or object. Once inscribed, it grants passive or activated benefits to the bearer. Sigils require attunement and occupy inscription slots on the target item.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Inscription Difficulty", "The check DC and materials required to inscribe this Sigil. Higher difficulty means rarer materials and a skilled inscriber."],
			["Can Inscribe On", "Which item types accept this Sigil: weapons, armor, shields, or specific objects."],
			["Passive Bonuses", "Always-on benefits while attuned. These do not require activation."],
			["Active Feature", "An ability that must be deliberately activated, often with an action cost and daily use limit."],
		])}
		<p>An item can hold a limited number of Sigils based on its quality and the Sigils' rarity. Overwriting a Sigil destroys the old inscription permanently.</p>`;
	} else if (ctx.includes("tattoo")) {
		body = `<h3>How Tattoos Work</h3>
		<p>A Tattoo is a supernatural mark inked directly into an Ascendant's skin. Unlike Sigils, Tattoos are part of the bearer's body and cannot be transferred. They grant resonance effects tied to the Ascendant's Essence structure.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Body Part", "Where the Tattoo is placed. Each body location has a limited number of Tattoo slots."],
			["Ink Type", "The supernatural material used. Ink type affects both the Tattoo's power and its visual appearance."],
			["Resonance Effect", "The passive or triggered benefit the Tattoo grants. Resonance effects interact with the bearer's Essence, not external equipment."],
			["Active Veins", "Some Tattoos have vein patterns that light up during activation, visible to anyone nearby."],
		])}
		<p>Tattoos are visible. In the Rift Age, supernatural tattoos mark an Ascendant as Awakened to anyone who knows what to look for. This has social, legal, and tactical implications the Warden should use.</p>`;
	} else if (ctx.includes("item") || ctx.includes("equipment")) {
		body = `<h3>Equipment In The Rift Age</h3>
		<p>Equipment in Rift Ascendant ranges from mundane field gear to Rift-touched objects with measurable Essence properties. Every item has a rarity that determines its availability, cost, and Bureau oversight status.</p>
		${rulesTable(["Rarity", "Availability", "Bureau Status"], [
			["Common", "Standard retail, Guild shops, Bureau issue", "No registration required"],
			["Uncommon", "Specialist vendors, Guild requisition, Rift salvage", "Logged but not restricted"],
			["Rare", "Licensed dealers, high-level contracts, Rift extraction", "Registration required within 48 hours"],
			["Epic", "Restricted access, Bureau approval, black market", "Bureau classification review"],
			["Legendary", "Unique or near-unique; world-shaping", "Mandatory Bureau custody review"],
		])}
		<p>When choosing gear, consider legality, weight, and what happens if the Bureau audits your loadout. The Warden Guide covers how equipment access changes during and after Rift operations.</p>`;
	} else if (ctx.includes("relic")) {
		body = `<h3>Using Relics</h3>
		<p>A Relic is a Rift-origin object with persistent, measurable Essence properties. Every Relic is powerful enough to change tactical decisions and specific enough to avoid replacing the character sheet. Relics require attunement and carry risks that mundane equipment does not.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Attunement", "Whether and how you must bond with the Relic. Breaking attunement is not always voluntary."],
			["Properties", "Mechanical benefits: bonuses, abilities, charges, or passive effects."],
			["Corruption Risk", "Some Relics change the bearer over time. The Warden tracks this."],
			["Quirks", "Behavioral or aesthetic side effects. Quirks make Relics feel like objects with history, not stat bonuses."],
		])}
		<p>Bureau law requires Relic registration within 48 hours of extraction. Unregistered Relics are technically illegal in most jurisdictions. The Vaults of the Rift chapter covers legality, black market access, and Warden placement guidance in detail.</p>`;
	} else if (ctx.includes("artifact")) {
		body = `<h3>Artifacts: World-Shaping Power</h3>
		<p>An Artifact is the most dangerous class of Rift-origin object. Artifacts reshape the world around them: they alter local Essence fields, attract faction attention, and create long-term campaign consequences. Possessing one is a story event, not a loot roll.</p>
		<p>Every Artifact entry in this catalog includes its known history, activation requirements, consequences of use, and Bureau classification status. The Warden should introduce Artifacts as campaign-shaping events, not random treasure drops.</p>`;
	} else if (ctx.includes("vehicle")) {
		body = `<h3>Vehicles And Mounts</h3>
		<p>Rift Age transportation includes armored Bureau transports, civilian vehicles modified for Rift-zone operation, and bonded creatures from Rift interiors that serve as living mounts. Each vehicle has crew positions, speed, armor, and cargo capacity.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Speed", "Movement rate in feet per round during tactical play. Overland speed is separate."],
			["Crew Positions", "How many operators the vehicle requires and what each position does."],
			["Bonded", "Whether the vehicle is a living creature that requires a bond rather than a key."],
			["Carry / Cargo Capacity", "Weight limits for passengers and equipment."],
		])}
		<p>Vehicles inside Rifts behave unpredictably. The Warden Guide covers Domain effects on mounted and vehicular movement.</p>`;
	} else if (ctx.includes("location")) {
		body = `<h3>Reading Location Dossiers</h3>
		<p>Each location entry is a field dossier, not a novel chapter. Use these entries as table-ready reference: the geography tells you what the space looks like, the hazards tell you what it does to Ascendants, the encounters tell you what lives there, and the treasures tell you why anyone goes in.</p>
		${rulesTable(["Field", "Warden Use"], [
			["Geography", "Describe the space to players. Use terrain for tactical positioning and movement decisions."],
			["Hazards", "Active environmental threats. Run these as room rules, not surprise damage."],
			["Encounters", "What the party might fight, negotiate with, or flee from. Cross-reference the Anomaly Manual."],
			["Treasures", "Reward signals. Match to rank-banded loot tables in the Warden Guide."],
		])}`;
	} else if (ctx.includes("regent")) {
		body = `<h3>What A Regent Is</h3>
		<p>A Regent is a full supernatural authority overlay, not a subclass or prestige class. When an Ascendant gains a Regent authority, it layers on top of their existing Job and Path like a second identity. The Regent's features, proficiencies, and abilities are gained in addition to the character's existing progression.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Requirements", "Story milestones, Warden approval, and sometimes specific ability scores or moral choices required for Regent access."],
			["Class Features", "The Regent's progression features, gained alongside normal Job features."],
			["Spellcasting", "Some Regents grant additional spellcasting or supernatural authority outside the normal spell slot system."],
		])}
		<p>Regent access is a campaign event, not a character creation option. The Warden controls when, whether, and how Regent authorities become available. Gemini Protocols, which fuse two Regent authorities, are even rarer and require explicit table-level approval.</p>`;
	} else if (ctx.includes("pantheon")) {
		body = `<h3>The Pantheon In Play</h3>
		<p>Pantheon entries describe Eternals and Exarchs: the deep background powers of the Rift Age. These are not player-character gods in the traditional sense. Their existence is documented, disputed, and politically charged. Some have confirmed Rift manifestations. Others are known only through Regent authority signatures.</p>
		${rulesTable(["Field", "What It Tells You"], [
			["Portfolio", "What this Eternal governs or embodies. Portfolios shape Regent authorities and Domain logic."],
			["Directive", "The Eternal's apparent purpose or drive. Not necessarily benevolent."],
			["Dogma", "What worshippers or aligned Ascendants believe about this Eternal's will."],
			["Relationships", "How this Eternal relates to other Pantheon members. Alliances, rivalries, and silences."],
		])}
		<p>The Warden uses Pantheon entries as deep background: names in ancient sites, sources of Regent authority, theological arguments between factions, and unsettling Rift-interior imagery. The Pantheon is not a spell list; it is a world force.</p>`;
	} else if (isAnomaly || ctx.includes("anomaly") || ctx.includes("shadow")) {
		body = `<h3>How To Read A Stat Block</h3>
		<p>Every Anomaly entry is a combat-ready stat block. The rank tells you expected threat level, the ability scores tell you how it fights, the traits tell you what makes it unusual, and the actions tell you what it does on its turn. Read the full entry before the encounter starts.</p>
		${rulesTable(["Field", "Warden Use"], [
			["Rank", "Expected threat tier: D (routine), C (elevated), B (serious), A (critical), S (existential). Use for encounter budgeting."],
			["Armor Class / Hit Points", "Durability profile. High AC means attrition; high HP means sustained pressure."],
			["Actions", "What the Anomaly does on its turn. Multi-attack, special abilities, and area effects are listed here."],
			["Traits", "Always-on abilities: resistances, immunities, senses, and behavioral rules."],
			["Reactions / Legendary Actions", "Out-of-turn capabilities. These are what make boss fights feel different from standard encounters."],
		])}
		<h3>Encounter Roles</h3>
		<p>Anomalies fill battlefield roles: Hunters track prey, Bruisers control space, Lurkers strike from concealment, Controllers rewrite room rules, and Apex threats anchor encounters. The Warden Guide covers how to combine roles for balanced encounter groups.</p>`;
	} else if (ctx.includes("condition")) {
		body = `<h3>Using Conditions</h3>
		<p>Conditions are status effects applied during combat, hazards, and Rift pressure. When a condition is applied, read the full entry for its mechanical effects, duration, and removal procedure. Multiple conditions can stack on the same creature.</p>
		${rulesTable(["Guideline", "Rule"], [
			["Stacking", "Different conditions stack. The same condition from multiple sources does not stack unless the entry says otherwise."],
			["Removal", "Each condition entry specifies how it ends: saves, rests, spells, or specific actions."],
			["Adjudication", "When a condition's interaction with an ability is ambiguous, the Warden rules using the condition's primary effect as written."],
		])}`;
	} else if (ctx.includes("table") || ctx.includes("operations")) {
		body = `<h3>Using Rollable Tables</h3>
		<p>These tables are Warden tools. Roll when you want randomized results, or read and choose when you want curated outcomes. Tables with a dice formula use that formula for random results. Tables without one are pick-lists.</p>
		<p>Use tables to generate variety, not to replace preparation. A rolled result should prompt the Warden to add context, not replace adjudication. If a result does not fit the scene, roll again or adjust the entry to fit established fiction.</p>`;
	} else if (ctx.includes("contract seed")) {
		body = `<h3>Using Contract Seeds</h3>
		<p>Each contract seed pairs a canonical location with a threat, pressure clock, complication, and reward signal. These are session starters, not finished scenarios. The Warden tunes the opening, adjusts the clock to the party's level, and adds detail from the Location Dossiers and Threat Rosters.</p>
		<p>The complication field is the seed's dramatic engine: it is the thing that turns a clean contract into a real decision. Present the complication after the party has committed to the operation, not before.</p>`;
	} else {
		body = `<h3>Using This Catalog</h3>
		<p>Entries in this catalog are organized alphabetically. Each entry contains the fields relevant to table use: read the name, check the meta tags for rank, rarity, or type classification, then read the description and mechanical fields. When an entry references another book, the cross-reference tells you where to look.</p>`;
	}

	if (!body) return "";
	return `<div class="sourcebook-guide">${body}</div>`;
}

const LABEL_MAP: Record<string, string> = {
	uses_per_rest: "Recovery",
	uses_per_rest_formula: "Recharge",
	activation_action: "Action",
	activation_cost: "Cost",
	activation: "Activation",
	level_requirement: "Prerequisite Level",
	damage_type: "Damage Type",
	damage_roll: "Damage",
	higher_levels: "At Higher Levels",
	saving_throw: "Save",
	hit_dice: "Hit Dice",
	armor_class: "Armor Class",
	hit_points: "Hit Points",
	proficiency_bonus: "Proficiency Bonus",
	challenge_rating: "Challenge Rating",
	condition_immunities: "Condition Immunities",
	damage_resistances: "Damage Resistances",
	damage_immunities: "Damage Immunities",
	damage_vulnerabilities: "Damage Vulnerabilities",
	saving_throws: "Saving Throws",
	skill_proficiencies: "Skill Proficiencies",
	armor_proficiencies: "Armor Proficiencies",
	weapon_proficiencies: "Weapon Proficiencies",
	tool_proficiencies: "Tool Proficiencies",
	starting_equipment: "Starting Equipment",
	starting_credits: "Starting Credits",
	personality_traits: "Personality Traits",
	primary_abilities: "Primary Abilities",
	effect_description: "Effect",
	effect_type: "Effect Type",
	active_feature: "Active Feature",
	passive_bonuses: "Passive Bonuses",
	can_inscribe_on: "Inscribe On",
	requires_level: "Required Level",
	inscription_difficulty: "Inscription Difficulty",
	body_part: "Body Location",
	ink_type: "Ink Type",
	active_veins: "Active Veins",
	resonance_effect: "Resonance Effect",
	corruption_risk: "Corruption Risk",
	carry_capacity_lbs: "Carry Capacity",
	cargo_capacity_lbs: "Cargo Capacity",
	crew_positions: "Crew Positions",
	bonded_from_name: "Bonded From",
	condition_effects: "Effects",
	condition_duration: "Duration",
	condition_removal: "Removal",
	condition_save: "Save",
	cure_lore: "Cure",
	regent_requirements: "Requirements",
	class_features: "Class Features",
	legendary_actions: "Legendary Actions",
	bonus_actions: "Bonus Actions",
	non_damage_resolution: "Resolution",
	line_of_effect: "Line of Effect",
};

function labelFromKey(key: string): string {
	if (LABEL_MAP[key]) return LABEL_MAP[key];
	return key
		.replace(/_/g, " ")
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const COMPACT_SKIP_KEYS = new Set([
	"id",
	"slug",
	"uuid",
	"created_at",
	"updated_at",
	"source_file",
	"source_path",
	"generated_at",
	"last_modified",
	"prompt",
	"negative_prompt",
	"seed",
	"model",
	"embedding",
	"vector",
	"display_name",
	"name",
	"title",
	"image",
	"image_url",
	"thumbnailUrl",
	"portrait",
	"lore",
	"flavor",
	"discovery_lore",
	"theme_tags",
	"source_book",
	"source",
	"source_name",
	"source_kind",
	"system_interaction",
	"license_note",
	"generated_reason",
	"audit",
	"fingerprint",
	"payload_complete",
	"uniqueness_seed",
	"variant_note",
	"identity",
	"canon_basis",
	"distinguishing_rule",
	"signature",
	"source_integrity",
	"allows_5e_baseline",
	"canon_guardrails",
	"ra_specific_mundane",
	"rules_payload_version",
	"resolution",
	"non_damage_resolution",
	"notes",
	"line_of_effect",
]);

function isCompactDefaultNoise(value: unknown): boolean {
	if (value === false || value === 0) return true;
	if (typeof value !== "string") return false;
	const text = sourcebookText(value).toLowerCase();
	return text === "false" || text === "0" || text === "none" || text === "standard";
}

function compactValueText(value: unknown, depth = 0): string {
	if (isEmpty(value) || isCompactDefaultNoise(value)) return "";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
		return sourcebookText(value);
	}
	if (Array.isArray(value)) {
		return value
			.map((item) => compactValueText(item, depth + 1))
			.filter(Boolean)
			.join("; ");
	}
	if (typeof value === "object") {
		return Object.entries(value as EntryRecord)
			.filter(([key, item]) => !COMPACT_SKIP_KEYS.has(key) && !isEmpty(item) && !isCompactDefaultNoise(item))
			.map(([key, item]) => {
				const text = compactValueText(item, depth + 1);
				if (!text) return "";
				return depth > 1 ? text : `${labelFromKey(key)}: ${text}`;
			})
			.filter(Boolean)
			.join("; ");
	}
	return sourcebookText(value);
}

function compactLine(label: string, value: unknown): string {
	const text = compactValueText(value);
	if (!text) return "";
	return `<p class="compact-line"><strong>${esc(label)}.</strong> ${inlineMd(text)}</p>`;
}

function compactEntry(entry: EntryRecord, kind: "ability" | "rune" | "item" | "record", context: string): string {
	const title = cleanText(entry.name || entry.display_name || entry.title || entry.id || context);
	const metaKeys =
		kind === "item"
			? ["type", "item_type", "rarity", "rank", "value", "weight", "armor_class", "armor_type", "properties", "tags"]
			: kind === "rune"
				? ["rune_type", "rune_category", "effect_type", "rank", "rune_level", "rarity", "activation_action", "activation_cost", "range", "duration", "tags"]
				: kind === "record"
					? ["rank", "type", "category", "group", "diceFormula", "rarity", "tags"]
					: ["level", "power_level", "level_requirement", "rank", "school", "type", "style", "rarity", "classes", "casting_time", "activation", "range", "duration", "components", "concentration", "ritual", "attack", "saving_throw", "damage_roll", "damage_type", "area"];
	const meta = metaKeys
		.map((key) => {
			const text = compactValueText(entry[key]);
			return text ? `<span>${esc(labelFromKey(key))}: ${inlineMd(text)}</span>` : "";
		})
		.filter(Boolean)
		.join("");
	const teaches = kind === "rune" ? compactLine("Teaches", entry.teaches) : "";
	const bodyKeys =
		kind === "rune"
			? ["effect_description", "effects", "mechanics", "limitations", "higher_levels"]
			: kind === "item"
				? ["description", "activation", "effects", "mechanics", "limitations"]
				: kind === "record"
					? ["description", "summary", "entries", "features", "traits", "effects", "mechanics", "hazards", "encounters", "treasures", "relationships", "portfolio", "dogma", "lore", "limitations"]
					: ["description", "effects", "mechanics", "limitations", "higher_levels", "uses_per_rest_formula"];
	const body = bodyKeys
		.map((key) => compactLine(labelFromKey(key), entry[key]))
		.filter(Boolean)
		.join("");
	return `<article class="compact-entry" id="${slugify(`${context}-${title}`)}">
		<h3>${esc(title)}</h3>
		${meta ? `<div class="meta compact-meta">${meta}</div>` : ""}
		${teaches}
		${body}
	</article>`;
}

function renderCompactCatalog(
	title: string,
	summary: string,
	entries: unknown[],
	options: { context: string; kind: "ability" | "rune" | "item" | "record" },
): string {
	const sorted = [...(entries as EntryRecord[])].sort((a, b) =>
		cleanText(a.name || a.title || a.id).localeCompare(
			cleanText(b.name || b.title || b.id),
		),
	);
	const guide = catalogUseGuide(title, options.context, false);
	return `<section class="section-block compact-section">
		<div class="section-intro">
			<h2>${esc(title)}</h2>
			<p>${esc(summary)}</p>
		</div>
		${guide}
		<div class="compact-catalog">${sorted
			.map((entry) => compactEntry(entry, options.kind, options.context))
			.join("")}</div>
	</section>`;
}

function runePrimer(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Rune Absorption Rules</h2>
			<p>Runes teach a spell, power, or technique when consumed. Native-access runes add the learned ability to the Ascendant's normal list. If the Ascendant is below the normal rank, the rune grants one dedicated slot for that ability until the normal unlock catches up. Cross-access runes use the listed rune rarity and the Ascendant's proficiency and primary ability modifier to determine limited uses per long rest.</p>
		</div>
		${rulesTable(["Rune Procedure", "Rule"], [
			["Native absorption", "Learn the referenced ability permanently; if under-rank, use one dedicated slot for that ability until normal progression reaches it."],
			["Cross-access adaptation", "Uses per long rest = max(1, proficiency bonus + primary ability modifier + rune rarity bonus), unless the rune says otherwise."],
			["Activation fields", "Use the rune entry's action, cost, range, duration, concentration, and limitation lines after absorption."],
			["Scaling", "Higher-level and rank-scaling effects are read from the taught ability or the rune's higher-level field."],
		])}
	</section>`;
}

function coreItems(): EntryRecord[] {
	return (allItems as EntryRecord[]).filter(isCoreSourcebookItem);
}

function vaultItems(): EntryRecord[] {
	return (allItems as EntryRecord[]).filter(
		(entry) => !isCoreSourcebookItem(entry),
	);
}

function coreRunes(): EntryRecord[] {
	return (allRunes as EntryRecord[]).filter(isCoreSourcebookRune);
}

function vaultRunes(): EntryRecord[] {
	return (allRunes as EntryRecord[]).filter(
		(entry) => !isCoreSourcebookRune(entry),
	);
}

function splitNotice(title: string, body: string): string {
	return `<aside class="callout"><h3>${esc(title)}</h3><p>${inlineMd(body)}</p></aside>`;
}

function sampleAnomalies(): EntryRecord[] {
	const ranks = ["D", "C", "B", "A", "S"];
	return ranks
		.map((rank) => generalAnomalies().find((entry) => cleanText(entry.rank) === rank))
		.filter(Boolean) as EntryRecord[];
}

function isCampaignScopedEntry(entry: EntryRecord): boolean {
	return isCampaignScopedSourcebookEntry(entry);
}

function generalAnomalies(): EntryRecord[] {
	return (anomalies as EntryRecord[]).filter((entry) => !isCampaignScopedEntry(entry));
}

function generalShadowSoldiers(): EntryRecord[] {
	return (shadowSoldiers as EntryRecord[]).filter((entry) => !isCampaignScopedEntry(entry));
}

function anomalyDesignPrimer(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Anomaly Design And Use</h2>
			<p>The Warden Guide treats anomalies as scenario tools: choose rank, battlefield role, pressure state, reward signal, and escalation behavior. The full catalog lives in the Anomaly Manual.</p>
		</div>
		<div class="prose-columns">
			<h3>Threat Role</h3>
			${rulesTable(["Role", "Use At The Table"], [
				["Hunter", "Tracks noise, Essence expenditure, or fear. Use when the encounter needs pursuit and retreat decisions."],
				["Bruiser", "Controls space with high HP, forced movement, or area denial. Use when the party needs formation play."],
				["Lurker", "Strikes from concealment, darkness, crowds, or false safety. Use sparingly and telegraph clues."],
				["Controller", "Changes the rules of the room: gravity, vision, movement, time pressure, or resource recovery."],
				["Apex", "A boss or domain heart. Give it visible tells, phase changes, and consequences beyond HP loss."],
			])}
			<h3>Rank Adjustment</h3>
			<p>To adjust an anomaly, change no more than two axes at once: hit points, damage dice, Armor Class, save DC, or action economy. If the anomaly gains a new reaction, legendary action, or battlefield-wide aura, treat it as a higher encounter threat even when its printed rank stays the same.</p>
			${rulesTable(["Adjustment", "Guideline"], [
				["HP", "Increase or decrease by about 25 percent for a softer or harder version."],
				["Damage", "Step one damage die up or down, or add/remove one rider condition."],
				["Save DC", "Move by 1-2 points when changing rank pressure."],
				["Action economy", "Extra attacks, reactions, or minions matter more than raw numbers."],
				["Reward", "Match Essence, loot, information, and faction response to danger actually faced."],
			])}
		</div>
	</section>`;
}

function rollTablesByGroup(groups: string[]): typeof rollableTables {
	const groupSet = new Set(groups);
	return rollableTables.filter((table) => groupSet.has(table.group));
}

function riftHazardGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Rift And Domain Construction</h2>
			<p>Rifts are not generic dungeons. Each one has a theme, biome, pressure state, hazard language, reward signal, and exit logic. Build them by selecting a theme and biome, adding hazards that express the Domain's rules, then choosing complications that change how the party spends time and Essence.</p>
		</div>
		<div class="prose-columns">
			<h3>Rift Build Procedure</h3>
			<ol>
				<li><strong>Assign rank.</strong> Rank sets expected anomaly pressure, Bureau response, reward tier, and evacuation urgency.</li>
				<li><strong>Choose theme.</strong> Theme tells the players what kind of impossible logic is active.</li>
				<li><strong>Choose biome.</strong> Biome makes the theme spatial: subway, ruin, office tower, drowned hospital, glass desert, shrine, server farm, or other RA space.</li>
				<li><strong>Choose hazards.</strong> Hazards are the Rift's rules made physical. They should alter tactics, travel, rests, communication, or recovery.</li>
				<li><strong>Add complications.</strong> Complications are moving problems: civilians, rival teams, unstable exits, noise-sensitive predators, faction claims, Essence storms, or failing containment.</li>
				<li><strong>Set the reward signal.</strong> Treasure, Relics, contracts, information, and faction leverage should all point back to the Rift's theme.</li>
			</ol>
			<h3>Hazard Adjudication</h3>
			<p>Use hazards as active room rules. Tell players what their characters can observe, give them a meaningful way to test or avoid the hazard, and escalate only after they choose speed, noise, violence, or Essence expenditure over caution.</p>
			${rulesTable(["Hazard Step", "Warden Procedure"], [
				["Signal", "Describe sensory evidence: light bending, static in teeth, floating dust, wet footprints, pressure changes, or System warnings."],
				["Test", "Call for a check only when the party interacts, rushes, or lacks the right tool."],
				["Cost", "Use HP, resources, time, position, conditions, or pressure clocks instead of only damage."],
				["Counterplay", "Offer tools: scouting, insulation, silence, anchors, sigils, faction intel, or retreat."],
				["Escalation", "If ignored, the hazard changes the room, draws anomalies, locks exits, or corrupts rewards."],
			])}
		</div>
	</section>
	${renderCompactCatalog("Rift Theme, Biome, Hazard, And Complication Tables", "Canonical RA tables used to build Domain spaces and pressure.", rollTablesByGroup(["theme", "biome", "hazard", "complication"]), {
		context: "Rift Table",
		kind: "record",
	})}`;
}

function wardenOperationsGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Bureau, AFA, And Guild Operations</h2>
			<p>Warden-side play lives in the pressure between public safety, private contracts, Ascendant ambition, and supernatural containment. These procedures turn RA factions into table-facing consequences rather than background names.</p>
		</div>
		<div class="prose-columns">
			<h3>Operational Authorities</h3>
			${rulesTable(["Authority", "Function In Play"], [
				["Bureau", "Licenses Ascendants, posts alerts, enforces quarantine, issues warrants, and controls official Gate data."],
				["AFA", "Coordinates high-threat field response, disaster triage, inter-jurisdiction operations, and classified cleanups."],
				["Guilds", "Bid on contracts, protect members, compete for loot rights, and convert reputation into access."],
				["Media", "Shapes panic, celebrity, conspiracy, and political heat after public Rift incidents."],
				["Civilians", "Create stakes that cannot be solved by damage alone: evacuation, rescue, testimony, liability, and trust."],
			])}
			<h3>Operational Clocks</h3>
			${rulesTable(["Clock", "Advance When"], [
				["Containment", "The party makes noise, damages anchors, delays too long, or uses high-Essence abilities."],
				["Civilian Harm", "The party ignores evacuation, fails rescue checks, or lets the Domain move through public space."],
				["Faction Heat", "The party breaks contract terms, steals claimed loot, exposes secrets, or humiliates a rival."],
				["Media Exposure", "Witnesses record the incident, a fight spills into public, or a named Ascendant escalates visibly."],
				["Rift Collapse", "The heart destabilizes, boss phases change, anchors fail, or extraction windows close."],
			])}
			<h3>Consequences</h3>
			<p>Consequences should be legible and earned. A failed containment roll might cost a route, a rescue, a license review, or a future faction favor before it costs hit points. Use consequences to make RA's world feel regulated, commercial, dangerous, and alive.</p>
		</div>
	</section>
	${renderCompactCatalog("NPC Motivation And Secret Tables", "Warden tables for contacts, witnesses, rivals, and faction operatives.", rollTablesByGroup(["motivation", "secret"]), {
		context: "Operations Table",
		kind: "record",
	})}`;
}

function wardenRewardGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Rewards, Treasure, And Relic Placement</h2>
			<p>RA rewards are signals. A clean contract payout says the system worked; a strange Relic says the Rift changed the ongoing story; faction access says the world noticed. Give treasure as consequence, clue, temptation, and tactical expansion.</p>
		</div>
		<div class="prose-columns">
			<h3>Reward Procedure</h3>
			${rulesTable(["Reward Type", "When To Use"], [
				["Contract Pay", "The party fulfills a Bureau, Guild, or private objective with documented results."],
				["Essence Yield", "The party clears anomalies or stabilizes a Domain heart."],
				["Relic", "The Rift's theme should leave a permanent tactical or narrative scar."],
				["Information", "The party earns leverage: names, maps, blackmail, hidden exits, or Regent traces."],
				["Faction Access", "The party changes how organizations treat them: licenses, escorts, restricted shops, or audits."],
			])}
			<h3>Relic Safety</h3>
			<p>Relics should be powerful enough to change decisions and specific enough to avoid replacing the character sheet. Prefer limits, attunement, charges, activation costs, and complications over bland numeric bonuses.</p>
		</div>
	</section>
	${renderCompactCatalog("Rift Reward And Treasure Tables", "Canonical reward outcomes and rank-banded treasure tables.", rollTablesByGroup(["reward", "treasure"]), {
		context: "Reward Table",
		kind: "record",
	})}`;
}

function wardenClockToolkit(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Pressure Clocks And Scene Control</h2>
			<p>Warden clocks make Rift danger visible without hiding the state of play. Announce the clock name, describe what the next mark means, and advance it when the fiction actually changes.</p>
		</div>
		<div class="prose-columns">
			<h3>Clock Sizes</h3>
			${rulesTable(["Clock", "Use"], [
				["4 segments", "A short, sharp scene pressure: smoke fills a hall, a patrol arrives, a ritual completes."],
				["6 segments", "A room or encounter pressure with time for counterplay: a gate destabilizes, civilians scatter, a hunter triangulates sound."],
				["8 segments", "A session-scale pressure: containment collapse, Bureau intervention, rival Guild extraction, Domain heart awakening."],
				["12 segments", "A campaign-facing consequence: district panic, license inquiry, faction war, Regent attention, citywide quarantine."],
			])}
			<h3>Core Warden Clocks</h3>
			${rulesTable(["Clock", "Starts When", "Marks Advance When", "At Full"], [
				["Containment", "A Rift opens in public space.", "The party delays, uses loud force, breaks anchors, or ignores evac routes.", "The perimeter fails or a second front opens."],
				["Hunting", "The Domain notices active Essence.", "Spells flare, gunfire echoes, blood is spilled, or clues are mishandled.", "A roaming anomaly arrives with terrain advantage."],
				["Civilian Harm", "Noncombatants are in or near the scene.", "Rescue is delayed, panic spreads, exits shift, or media draws crowds.", "A named casualty, hostage, or public scandal changes the aftermath."],
				["Rift Collapse", "The heart is unstable or wounded.", "Boss phases shift, anchors are damaged, extraction stalls, or Relics are forced.", "The party must escape, stabilize, or accept permanent world damage."],
				["Faction Heat", "A contract, claim, or secret is at stake.", "The party steals, exposes, humiliates, trespasses, or breaks terms.", "A license audit, vendetta, blacklisting, or forced favor follows."],
			])}
			<h3>Fair Escalation</h3>
			<p>Escalation is fair when the players can see pressure before it hits. Give sensory warnings, let preparation remove marks, and make different methods change different clocks. Quiet play might slow Hunting but advance Collapse; decisive violence might save civilians while increasing media exposure.</p>
			${rulesTable(["Player Action", "Typical Clock Move"], [
				["Scout carefully", "Reveal a mark trigger or remove one hidden mark from a room clock."],
				["Spend Essence openly", "Advance Hunting unless the party masks the signature."],
				["Secure civilians", "Pause Civilian Harm for one scene or lower its final consequence."],
				["Break the obvious anchor", "Advance Collapse, then reveal what that anchor was holding back."],
				["Call Bureau support", "Reduce immediate danger but advance Faction Heat or Media Exposure."],
			])}
		</div>
	</section>`;
}

function wardenScenarioFrameworks(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Scenario Frameworks</h2>
			<p>Use these RA frames to turn canon tables, locations, anomalies, and rewards into playable sessions. Each framework names the pressure, the player-facing choice, and the aftermath hook.</p>
		</div>
		<div class="prose-columns">
			<h3>Clean Contract</h3>
			${rulesTable(["Step", "Warden Procedure"], [
				["Brief", "State the posted rank, employer, legal terms, expected hazards, and bonus objective."],
				["Complication", "Add one hidden condition: rival claim, unstable exit, missing contractor, false rank, or civilian witness."],
				["Choice", "Let players choose speed, stealth, negotiation, or deeper search."],
				["Aftermath", "Pay contract terms, then adjust reputation based on collateral damage and evidence recovered."],
			])}
			<h3>Containment Breach</h3>
			${rulesTable(["Step", "Warden Procedure"], [
				["Opening", "Begin with public danger already in motion: evacuation, failing perimeter, moving anomaly, or press feed."],
				["Pressure", "Run Civilian Harm and Containment clocks in the open."],
				["Choice", "Every round or scene asks whether the party protects people, hunts the source, or secures the exit."],
				["Aftermath", "Bureau response depends on what the party saved, what they exposed, and what escaped."],
			])}
			<h3>Guild Race</h3>
			${rulesTable(["Step", "Warden Procedure"], [
				["Opening", "Two or more teams have a claim on loot, intel, rescue credit, or public glory."],
				["Pressure", "Track Faction Heat and Rival Progress."],
				["Choice", "Let players cooperate, sabotage, negotiate, race, or reveal the rival's bad faith."],
				["Aftermath", "Guild politics change access to shops, escorts, licenses, rumors, and future contracts."],
			])}
			<h3>Regent Trace</h3>
			${rulesTable(["Step", "Warden Procedure"], [
				["Opening", "The Rift contains a signature that does not match its posted rank."],
				["Pressure", "Run a 6-segment Trace clock. Each clue gives power, danger, and a name-shaped shadow."],
				["Choice", "The party decides whether to harvest the trace, hide it, report it, or bargain around it."],
				["Aftermath", "A Regent, cult, Bureau desk, or rival Ascendant notices the decision."],
			])}
			<h3>Relic Temptation</h3>
			${rulesTable(["Step", "Warden Procedure"], [
				["Opening", "Place a Relic whose use solves one immediate problem and creates one lasting cost."],
				["Pressure", "Track Attunement Debt, Faction Claim, or Domain Resonance."],
				["Choice", "Offer safe extraction, risky activation, surrender to authorities, or black-market sale."],
				["Aftermath", "The Relic becomes a tactical option, legal problem, rumor source, or future Rift key."],
			])}
		</div>
	</section>`;
}

function wardenAdjudicationGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Adjudication Rulings</h2>
			<p>When the rules do not name an exact answer, rule from RA's core pressures: Essence exposure, public consequence, faction leverage, and the alien logic of the Domain.</p>
		</div>
		<div class="prose-columns">
			<h3>Difficulty Classes</h3>
			${rulesTable(["DC", "Use In Rift Ascendant"], [
				["10", "Routine under pressure: read a public Bureau alert, climb debris, spot an obvious anchor."],
				["12", "Professional baseline: assess a posted hazard, calm civilians, mask minor Essence signs."],
				["15", "Dangerous field work: disarm a Rift trigger, decode anomaly behavior, negotiate a hot contract."],
				["18", "Expert response: stabilize a failing gate, identify a rare Regent trace, hide evidence from a Bureau audit."],
				["21+", "Exceptional work under hostile Domain logic: rewrite an exit route, contain an S-rank signature, counter a living rule."],
			])}
			<h3>Consequences Instead Of Stops</h3>
			${rulesTable(["Missed Roll", "Forward Consequence"], [
				["Investigation", "Reveal the clue but advance a clock, attach a false inference, or expose the party's presence."],
				["Stealth", "Let the party proceed but change the next encounter's position, preparedness, or witness state."],
				["Social", "The NPC agrees with a condition: proof, payment, secrecy, protection, or a future favor."],
				["Travel", "Reach the destination with lost time, separated allies, damaged gear, or a changed exit."],
				["Ritual", "The effect works incompletely, loudly, temporarily, or with a visible Essence scar."],
			])}
			<h3>Rules Priority</h3>
			<ol>
				<li>Use the printed catalog entry first.</li>
				<li>Use the Warden procedure if the entry is silent.</li>
				<li>Use the Domain's established logic if both are silent.</li>
				<li>Tell the table the cost before a risky irreversible choice whenever the characters could understand it.</li>
			</ol>
		</div>
	</section>`;
}

function wardenWorldConsequences(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Aftermath And Living World</h2>
			<p>The end of a Rift is not the end of the scene. Rift Ascendant campaigns breathe through audits, rumors, injuries, contracts, media, debt, and the strange ways a cleared Domain still changes people.</p>
		</div>
		<div class="prose-columns">
			<h3>Aftermath Procedure</h3>
			${rulesTable(["Step", "Question"], [
				["Damage", "What people, places, records, or relationships were harmed?"],
				["Credit", "Who can prove what the party did, and who wants to claim or bury it?"],
				["Loot", "Which rewards are legal, disputed, cursed, traceable, or politically useful?"],
				["Exposure", "What did witnesses, cameras, sensors, or System logs preserve?"],
				["Change", "What new location, faction, anomaly pattern, or Regent trace enters the campaign?"],
			])}
			<h3>World-State Rewards</h3>
			${rulesTable(["Reward", "Mechanical Or Story Use"], [
				["License upgrade", "Access higher-risk contracts, restricted shops, escorts, or sealed case files."],
				["Guild trust", "Gain discounts, backup, housing, legal help, or black-market leads."],
				["Bureau goodwill", "Reduce audits, call in containment support, or clear a public incident."],
				["Civilian trust", "Gain witnesses, safehouses, local rumors, or public cover."],
				["Regent attention", "Unlock a dangerous mentor, warning, trial, or supernatural bargain."],
			])}
			<h3>World-State Costs</h3>
			${rulesTable(["Cost", "Pressure It Creates"], [
				["Audit", "Paperwork, hearings, license limits, evidence requests, or mandatory escorts."],
				["Rival claim", "A Guild, collector, or patron disputes loot, credit, or territory."],
				["Media storm", "Public identity, conspiracy, celebrity, panic, or political manipulation."],
				["Rift scar", "A place remains altered: cold rooms, false doors, repeating signals, or dreaming witnesses."],
				["Anomaly echo", "A defeated threat leaves spawn, dreams, symbols, hunger, or a new hunting rule."],
			])}
		</div>
	</section>`;
}

function textList(value: unknown, fallback: string[] = []): string[] {
	if (Array.isArray(value)) {
		const entries = value.map((item) => sourcebookText(item)).filter(Boolean);
		return entries.length ? entries : fallback;
	}
	const text = sourcebookText(value);
	return text ? [text] : fallback;
}

function safeEntryName(entry: EntryRecord | undefined, fallback: string): string {
	if (!entry) return fallback;
	return sourcebookText(entry.display_name || entry.name || entry.title || entry.id) || fallback;
}

function wardenContractSeeds(): string {
	const ranks = ["D", "C", "B", "A", "S"];
	const threats = generalAnomalies();
	const threatsByRank = Object.fromEntries(
		ranks.map((rank) => [
			rank,
			threats.filter((entry) => sourcebookText(entry.rank).toUpperCase() === rank),
		]),
	) as Record<string, EntryRecord[]>;
	const pressureClocks = [
		"Containment",
		"Hunting",
		"Civilian Harm",
		"Rift Collapse",
		"Faction Heat",
		"Media Exposure",
	];
	const wardenMoves = [
		"Show the first warning sign before the party crosses the threshold.",
		"Put the clean route and the lucrative route in different directions.",
		"Make the Bureau record useful, incomplete, and politically loaded.",
		"Let a rival team solve one problem while creating another claim.",
		"Turn the listed treasure into evidence, leverage, or a temptation.",
		"Advance a visible clock when the party chooses speed over containment.",
	];
	const complications = [
		"A witness has already crossed the perimeter and knows more than the alert says.",
		"A Guild has filed a competing extraction claim on the same reward signal.",
		"The posted rank is accurate, but one room behaves like the next rank up.",
		"One exit works only while the party preserves a fragile anchor.",
		"The strongest clue is also the easiest way to wake the local threat.",
		"An AFA cleanup team is inbound and will close the site if evidence is mishandled.",
	];
	const seeds = (locations as EntryRecord[])
		.filter((location) => !isCampaignScopedEntry(location))
		.slice(0, 96)
		.map((location, index) => {
			const rawRank = sourcebookText(location.rank).toUpperCase();
			const rank = ranks.includes(rawRank) ? rawRank : ranks[index % ranks.length];
			const threatPool = threatsByRank[rank].length ? threatsByRank[rank] : threats;
			const threat = threatPool[index % Math.max(threatPool.length, 1)];
			const locationName = safeEntryName(location, `Unfiled Rift Site ${index + 1}`);
			const threatName = safeEntryName(threat, `Rank ${rank} anomaly`);
			const type = sourcebookText(location.type) || "Rift site";
			const geography = sourcebookText(location.geography) || type;
			const encounters = textList(location.encounters, [threatName]);
			const hazards = textList(location.hazards, [`${geography} instability`]);
			const treasures = textList(location.treasures, ["Essence yield"]);
			const encounter = encounters[index % encounters.length];
			const hazard = hazards[index % hazards.length];
			const treasure = treasures[index % treasures.length];
			const clock = pressureClocks[index % pressureClocks.length];
			const clockSize = rank === "S" || rank === "A" ? 8 : rank === "B" ? 6 : 4;
			const threatType = sourcebookText(threat?.type) || "anomaly";
			const xp = sourcebookText(threat?.xp);
			return {
				name: `${locationName} Contract`,
				rank,
				type: "Warden Contract Seed",
				location: locationName,
				authority_brief: `${rank}-rank ${type} response. Bureau records flag ${geography}; local reports name ${encounter} as the first visible pressure.`,
				primary_threat: `${threatName}${threatType ? ` (${threatType})` : ""}${xp ? `, ${xp} XP baseline` : ""}. Use the full stat block in the Anomaly Manual if the scene turns hostile.`,
				site_truth: `${hazard} is not scenery; it is the rule the Domain wants the party to misunderstand.`,
				pressure_clock: `${clock}, ${clockSize} segments. Mark it when the party makes noise, delays, breaks anchors, exposes civilians, or spends obvious Essence.`,
				complication: complications[index % complications.length],
				reward_signal: `${treasure}. Make the reward prove something about why this Rift formed here.`,
				warden_move: wardenMoves[index % wardenMoves.length],
				cross_reference: `Use Location Field Dossiers for ${locationName}; use Rank ${rank} Threat Roster and Rift Reward tables for calibration.`,
			};
		});
	return (
		splitNotice(
			"Canon-Derived Seeds",
			"These contracts are assembled from existing Rift Ascendant location, anomaly, hazard, and treasure records. Treat them as Warden starters: tune the opening, clock, and reward to the party before play.",
		) +
		renderCatalog("Warden Contract Seeds", "Ready-to-frame contracts built from canonical Rift Ascendant sites, threats, hazards, clocks, and reward signals.", seeds, {
			context: "Contract Seed",
		})
	);
}

function wardenThreatRoster(): string {
	const ranks = ["D", "C", "B", "A", "S"];
	return ranks
		.map((rank) =>
			renderCompactCatalog(`Rank ${rank} Threat Roster`, `Compact Warden index of canon Rank ${rank} anomalies. Full stat blocks remain in the Anomaly Manual.`, generalAnomalies().filter((entry) => cleanText(entry.rank).toUpperCase() === rank), {
				context: `Rank ${rank} Threat`,
				kind: "record",
			}),
		)
		.join("");
}

function wardenFullReferenceAppendices(): string {
	return (
		renderCatalog("Rollable Warden Tables", "All canonical Warden tables with their entries preserved for PDF use.", rollableTables, {
			context: "Warden Table",
			classified: false,
		}) +
		renderReferenceIndex("Warden Cross-Reference", {
			Locations: locations,
			Regents: regents,
			Pantheon: PRIME_PANTHEON,
			"Threat Roster": generalAnomalies(),
			Conditions: conditions,
			"Rollable Tables": rollableTables,
		})
	);
}

function renderReferenceIndex(title: string, groups: Record<string, unknown[]>): string {
	const body = Object.entries(groups)
		.map(([group, entries]) => {
			const names = (entries as EntryRecord[])
				.map((entry) => cleanText(entry.name || entry.display_name || entry.title || entry.id))
				.filter(Boolean)
				.sort((a, b) => a.localeCompare(b));
			return `<h3>${esc(group)} (${names.length})</h3><div class="index-table">${names
				.map((name) => `<p>${esc(name)}</p>`)
				.join("")}</div>`;
		})
		.join("");
	return `<section class="section-block"><div class="section-intro"><h2>${esc(title)}</h2><p>Alphabetical reference compiled from canonical Rift Ascendant names in this build.</p></div>${body}</section>`;
}

function section(section: BookSection): BookSection {
	return section;
}

function readDoc(relativePath: string): string {
	const fullPath = resolve(repoRoot, relativePath);
	if (!existsSync(fullPath)) {
		report.warnings.push(`Missing source document: ${relativePath}`);
		return "";
	}
	return readFileSync(fullPath, "utf8");
}

let worldLoreCache: string | null = null;

function findWorldLorePdf(): string | null {
	const userProfile = process.env.USERPROFILE || "";
	const downloads = resolve(userProfile, "Downloads");
	if (!existsSync(downloads)) return null;
	const match = readdirSync(downloads).find((file) =>
		/^Rift Ascendant- Player.s Guide to the World\.pdf$/i.test(file) ||
		/^Rift Ascendant.*Player.*Guide.*World.*\.pdf$/i.test(file),
	);
	return match ? resolve(downloads, match) : null;
}

function bundledPythonExecutable(): string | null {
	const userProfile = process.env.USERPROFILE || "";
	const python = resolve(
		userProfile,
		".cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
	);
	return existsSync(python) ? python : null;
}

function findPythonExecutable(): string | null {
	return bundledPythonExecutable() || findExecutable(["python.exe", "python"]);
}

function extractPdfText(pdfPath: string, label = "PDF", options: { preserveCampaignTerms?: boolean } = {}): string {
	const python = findPythonExecutable();
	if (!python) {
		report.warnings.push(`Python was not found; ${label} extraction skipped.`);
		return "";
	}
	const script = [
		"from pathlib import Path",
		"from pypdf import PdfReader",
		"import sys",
		"sys.stdout.reconfigure(encoding='utf-8', errors='replace')",
		"path = Path(sys.argv[1])",
		"reader = PdfReader(str(path))",
		"for page in reader.pages:",
		"    text = page.extract_text() or ''",
		"    print(text)",
	].join("\n");
	const result = runCommand(python, ["-c", script, pdfPath]);
	if (result.status !== 0 || !result.stdout.trim()) {
		report.warnings.push(
			`${label} extraction failed for ${pdfPath}.`,
		);
		return "";
	}
	report.tooling.push(`${label} text extracted from ${pdfPath}`);
	return sourcebookText(result.stdout, options)
		.replace(/^\s*\d+\s*$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function extractRawPdfText(pdfPath: string, label = "PDF raw audit"): string {
	const python = findPythonExecutable();
	if (!python) return "";
	const script = [
		"from pathlib import Path",
		"from pypdf import PdfReader",
		"import sys",
		"sys.stdout.reconfigure(encoding='utf-8', errors='replace')",
		"path = Path(sys.argv[1])",
		"reader = PdfReader(str(path))",
		"for page in reader.pages:",
		"    print(page.extract_text() or '')",
	].join("\n");
	const result = runCommand(python, ["-c", script, pdfPath]);
	if (result.status !== 0 || !result.stdout.trim()) {
		report.warnings.push(`${label} extraction failed for ${pdfPath}.`);
		return "";
	}
	return cleanText(result.stdout);
}

function riftWorldLore(): string {
	if (worldLoreCache != null) return worldLoreCache;
	const pdfPath = findWorldLorePdf();
	if (pdfPath) {
		worldLoreCache = extractPdfText(pdfPath, "World-lore PDF");
		if (worldLoreCache) return worldLoreCache;
	} else {
		report.warnings.push(
			"Uploaded world-lore PDF was not found in Downloads; falling back to repo markdown.",
		);
	}
	worldLoreCache = readDoc("docs/rift-ascendant-world-lore.md");
	return worldLoreCache;
}

function rulesTable(headers: string[], rows: Array<Array<string | number>>): string {
	return `<table class="rules-table"><thead><tr>${headers
		.map((header) => `<th>${esc(header)}</th>`)
		.join("")}</tr></thead><tbody>${rows
		.map(
			(row) =>
				`<tr>${row.map((cell) => `<td>${inlineMd(String(cell))}</td>`).join("")}</tr>`,
		)
		.join("")}</tbody></table>`;
}

function proseBlock(markdown: unknown): string {
	return `<div class="prose-columns">${mdToHtml(markdown)}</div>`;
}

function playerRulesPrimer(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Using the Ascendant Guide</h2>
			<p>Rift Ascendant is a modern supernatural d20 game about Awakened operatives entering impossible Rift spaces, surviving Anomalies, and returning with Essence, Relics, and scars. Use this chapter as the player-facing rules spine before the catalogs.</p>
		</div>
		<div class="prose-columns">
			<h3>Core Resolution</h3>
			<p>When an outcome is uncertain, roll a d20 and add the relevant ability modifier, proficiency bonus if trained, and any situational bonus or penalty. Meet or exceed the DC, Armor Class, or opposed total to succeed.</p>
			${rulesTable(["Rule", "Formula or Procedure"], [
				["Ability modifier", "(ability score - 10) / 2, rounded down"],
				["Proficient check", "d20 + ability modifier + proficiency bonus"],
				["Attack roll", "d20 + attack ability modifier + proficiency bonus"],
				["Save DC", "8 + proficiency bonus + casting or technique ability modifier"],
				["Critical hit", "A natural 20 on an attack doubles damage dice; flat modifiers are not doubled."],
				["Advantage / disadvantage", "Roll two d20s and keep the higher or lower result."],
			])}
			<h3>Abilities</h3>
			${rulesTable(["RA Ability", "Use at the Table"], [
				["STR", "Physical force, athletics, heavy weapons, breaking restraints."],
				["AGI", "Reflexes, stealth, initiative, finesse weapons, evasion."],
				["VIT", "Endurance, hit points, poison, fatigue, bodily resistance."],
				["INT", "Analysis, technology, lore, investigation, tactical study."],
				["SENSE", "Perception, intuition, anomaly tells, mental resistance."],
				["PRE", "Presence, command, social pressure, intimidation, resonance."],
			])}
			<h3>Level And Proficiency</h3>
			${rulesTable(["Level", "Proficiency Bonus", "Rift Favor"], [
				["1-4", "+2", "3 points, d4"],
				["5-8", "+3", "4 points, d6"],
				["9-12", "+4", "4 points, d6"],
				["13-16", "+5", "5 points, d8"],
				["17-20", "+6", "6 points, d10"],
			])}
			<h3>Actions In A Round</h3>
			${rulesTable(["Turn Element", "Use"], [
				["Action", "Attack, cast a spell, use a major technique, activate a Relic, Dash, Disengage, Dodge, Help, Hide, Ready, Search, or Use an Object."],
				["Bonus action", "A quick feature, off-hand strike, Rift Favor option, spell, technique, or item that explicitly uses a bonus action."],
				["Reaction", "A response outside your turn, such as an opportunity attack or a feature triggered by a stated event."],
				["Movement", "Move up to your speed, split before and after actions, climb or swim as the terrain allows."],
				["Free interaction", "Draw an item, open a door, speak briefly, or perform a similarly minor table action."],
			])}
			<h3>Ability Types</h3>
			${rulesTable(["Type", "Primary Use", "Resource Pattern"], [
				["Techniques", "Martial, tactical, weapon, movement, and trained combat maneuvers.", "Usually limited by uses per rest, stance, action economy, weapon, or rank."],
				["Powers", "Innate Job or awakened authority effects.", "Usually scale by level or rank and refresh on short or long rest."],
				["Spells", "Structured mana effects using spell slots, schools, components, range, and duration.", "Use spell slots unless an entry states another cadence."],
				["Runes", "Learned or absorbed patterns that unlock abilities or inscriptions.", "Follow the rune entry's restrictions, costs, and attunement notes."],
				["Sigils and Tattoos", "Permanent or semi-permanent inscriptions with passive or activated benefits.", "Follow body-slot, attunement, activation, and recharge limits."],
			])}
			<h3>Rift Favor</h3>
			<p>Rift Favor is the table's heroic pressure valve. It refreshes at the start of each game or when the Warden awards it for dangerous, character-defining play.</p>
			${rulesTable(["Option", "Cost", "Minimum Level", "Effect"], [
				["Rift Boost", "1", "1", "Add the Rift Favor die to one ability check, attack roll, or saving throw before the Warden declares the outcome."],
				["Rift Override", "1", "1", "Reroll a failed d20 and use the new result."],
				["Rift Insight", "1", "1", "Learn one useful combat fact about a visible creature within 60 feet."],
				["Rift Recovery", "1", "3", "As a bonus action, end one condition other than unconscious or dead, or reduce exhaustion by 1."],
				["Death Defiance", "2", "5", "When reduced to 0 HP but not killed outright, drop to 1 HP instead; once per long rest."],
				["Flash Step", "1", "5", "Teleport up to 10 feet as part of movement without provoking opportunity attacks."],
				["Party Link", "1", "7", "Nearby allies cannot be surprised, gain initiative advantage, and may communicate telepathically until your next turn ends."],
				["Critical Surge", "2", "9", "Turn a successful attack into a critical hit; once per long rest."],
			])}
			<h3>Rest And Recovery</h3>
			${rulesTable(["Rest", "Length", "Recovery"], [
				["Short rest", "1 hour", "Spend hit dice, refresh short-rest features, and refresh encounter resources that say they return on a short rest."],
				["Long rest", "8 hours", "Restore hit points, recover spent hit dice as the Warden allows, reset death saves, refresh long-rest and daily resources."],
				["Concentration", "Ongoing", "A creature can maintain one concentration effect at a time. Damage, incapacitation, or stated disruptions can force it to end."],
				["Death saves", "At 0 HP", "Three successes stabilize; three failures kill. A natural 20 can return the character to consciousness at the Warden's table standard."],
			])}
			<h3>Regents And Gemini</h3>
			<p>A Regent is a full supernatural authority overlay, not a path. It is unlocked through story milestones or Warden approval and advances alongside the character once gained. Gemini Protocols are rare fusions of two Regent authorities, granting hybrid abilities only when the table has earned that escalation.</p>
		</div>
	</section>`;
}

function wardenRulesPrimer(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Running the Game</h2>
			<p>The Warden frames danger, tracks pressure, presents fair consequences, and lets the players choose how deeply to push into the Rift. The procedures below are your tools for running the game.</p>
		</div>
		<div class="prose-columns">
			<h3>Encounter Budgets</h3>
			<p>For combat difficulty, total the XP value of hostile Anomalies, multiply by the encounter-size modifier, then compare the adjusted XP to the party's level threshold. For mixed-level parties, use the average level rounded to the nearest whole number.</p>
			${rulesTable(["Level", "Easy", "Medium", "Hard", "Deadly"], [
				[1, 25, 50, 75, 100],
				[2, 50, 100, 150, 200],
				[3, 75, 150, 225, 300],
				[4, 100, 200, 300, 450],
				[5, 125, 250, 375, 550],
				[6, 150, 300, 450, 600],
				[7, 175, 350, 525, 750],
				[8, 200, 400, 600, 900],
				[9, 225, 450, 675, 1100],
				[10, 250, 500, 750, 1200],
				[11, 275, 600, 900, 1600],
				[12, 300, 700, 1000, 1900],
				[13, 325, 800, 1100, 2200],
				[14, 350, 900, 1250, 2600],
				[15, 400, 1000, 1400, 3000],
				[16, 450, 1100, 1600, 3500],
				[17, 500, 1200, 1800, 4000],
				[18, 550, 1300, 2000, 4500],
				[19, 600, 1400, 2200, 5000],
				[20, 650, 1500, 2400, 5500],
			])}
			${rulesTable(["Hunters", "Multiplier"], [
				["1", "x1"],
				["2", "x1.5"],
				["3-6", "x2"],
				["7 or more", "x2.5"],
			])}
			<h3>Difficulty Meaning</h3>
			${rulesTable(["Difficulty", "Use"], [
				["Easy", "An encounter that spends time, reveals information, or drains light resources."],
				["Medium", "A fair fight that can punish poor tactics."],
				["Hard", "A serious threat that may force resource expenditure, retreat, or casualties."],
				["Deadly", "A fight that can kill prepared Ascendants; telegraph the danger clearly."],
			])}
			<h3>Rift Procedure</h3>
			<ol>
				<li><strong>Hook.</strong> Present the alert, contract, Bureau order, Guild rumor, or personal reason to enter.</li>
				<li><strong>Threshold.</strong> Establish rank, visible danger, evacuation state, time pressure, and what counts as a clean exit.</li>
				<li><strong>Exploration loop.</strong> Each meaningful turn, describe the space, ask for intent, resolve risk, then update pressure.</li>
				<li><strong>Pressure.</strong> Advance clocks for noise, instability, Anomaly hunting, civilian danger, weather, or Essence surge.</li>
				<li><strong>Reward.</strong> Pay consequences honestly: loot, Relics, information, injuries, faction heat, and changed relationships.</li>
			</ol>
			<h3>Domain Pressure</h3>
			${rulesTable(["Pressure State", "Typical Signs", "Warden Move"], [
				["Quiet", "Subtle wrongness, cold spots, distant movement.", "Foreshadow, offer clues, let cautious play matter."],
				["Active", "Anomaly tracks, moving hazards, unstable rooms.", "Demand checks, spend resources, split attention."],
				["Hunting", "The Domain reacts to the party.", "Use ambushes, clocks, blocked exits, or bargains."],
				["Breaking", "Rules fail, exits move, space floods with Essence.", "Force hard choices and make retreat a live option."],
			])}
			<h3>Anomaly Stat Blocks</h3>
			<p>An anomaly entry is a table-facing rules object: rank, armor class, hit points, speed, ability scores, saves, skills, senses, resistances, immunities, traits, actions, reactions, ecology, and reward cues are all used as written unless the scene calls for a rank-adjusted variant.</p>
			<h3>Treasure And Relics</h3>
			<p>Use loot to point at future choices. Consumables solve near-term pressure, Relics change tactics, information changes the map, and faction rewards change the world-state. A reward should tell the table something about the Rift that produced it.</p>
		</div>
	</section>`;
}

// ─── Curated ability samplers for Ascendant Guide ───────────────────────────

function curatedTechSample(): EntryRecord[] {
	return [...techniques as EntryRecord[]]
		.sort((a, b) => cleanText(a.name || a.id).localeCompare(cleanText(b.name || b.id)))
		.slice(0, 12);
}

function curatedPowerSample(): EntryRecord[] {
	return [...powers as EntryRecord[]]
		.sort((a, b) => cleanText(a.name || a.id).localeCompare(cleanText(b.name || b.id)))
		.slice(0, 12);
}

function curatedSpellSample(): EntryRecord[] {
	return [...spells as EntryRecord[]]
		.sort((a, b) => cleanText(a.name || a.id).localeCompare(cleanText(b.name || b.id)))
		.slice(0, 12);
}

function conditionsQuickRef(): string {
	const sorted = [...conditions as EntryRecord[]].sort((a, b) =>
		cleanText(a.name || a.id).localeCompare(cleanText(b.name || b.id)),
	);
	const rows: [string, string][] = sorted.map((c) => {
		const name = cleanText(c.name || c.id);
		const raw = cleanText(c.effects || c.condition_effects || c.description || "");
		const summary = raw.slice(0, 140) + (raw.length > 140 ? "..." : "");
		return [name, summary];
	});
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Conditions Quick Reference</h2>
			<p>Conditions affect Ascendants and Anomalies during combat, hazards, and Rift pressure. The Warden Guide contains the full condition entries with adjudication guidance; this table is the player-facing quick reference.</p>
		</div>
		${rulesTable(["Condition", "Primary Effect"], rows)}
	</section>`;
}

// ─── Rift Age Worldbook authored prose ───────────────────────────────────────

function worldbookRiftEcology(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Rifts and the Rift Ecology</h2>
			<p>A Rift is a wound in the world that has not healed. Every Rift operates by its own interior logic, expels things that should not exist here, and leaves the ground around it changed forever.</p>
		</div>
		<div class="prose-columns">
			<h3>Anatomy of a Rift</h3>
			${rulesTable(["Term", "What It Means in the World"], [
				["Rift Threshold", "The boundary zone where Rift space meets mundane reality. Ascendants can cross it. Anomalies can exit through it. Civilians are advised not to approach it."],
				["Rift Interior", "The space inside the Rift — shaped by its Domain\u2019s rules, pressure level, and whatever originally opened it. Physics may not behave normally."],
				["Rift Site", "A location with a history of Rift formation or a currently open threshold. Bureau records classify these sites and restrict civilian access."],
				["Rift Clear", "A Rift that has been successfully closed, leaving behind a scarred site with residual Essence, altered ecology, and documented anomaly patterns."],
				["Rift Break", "An uncontrolled Rift collapse. What was inside may exit. What exits may not be containable."],
				["Domain", "A persistent Rift Interior that has stabilized around its own rules. Domains do not close on their own. They have hearts, ecologies, and often seem to have goals."],
			])}
			<h3>How Rifts Form</h3>
			<p>The Bureau maintains twelve active theories on Rift formation. The most widely accepted holds that Rifts form at sites where Essence pressure accumulates faster than the environment can dissipate it \u2014 geology and emotional history both appear to contribute. The most politically uncomfortable theory holds that Rift formation correlates with Ascendant Awakening events: the first Ascendants may have created the first Rifts by existing.</p>
			<p>What everyone agrees on: Rifts respond to Essence. An Ascendant\u2019s presence inside a Rift accelerates the Rift\u2019s pressure state. Sustained high-Essence activity inside an unstable Rift can cause it to evolve, grow, or break. The Bureau measures this relationship carefully and does not publish its projections.</p>
			<h3>Rift Rank Classification</h3>
			${rulesTable(["Rank", "Scale", "Public Threat Level", "Authority Response"], [
				["D", "Room to building scale", "Contained incident; standard hazard advisory", "Local Bureau response team, standard containment"],
				["C", "Block to district scale", "Elevated hazard; evacuation advisory", "Rapid response, AFA notification, media management"],
				["B", "District to city zone", "Serious threat; evacuation order", "AFA joint command, Bureau emergency powers"],
				["A", "City to regional scale", "Catastrophic; civilian authority suspended", "Federal response, full AFA activation, asset deployment"],
				["S", "Regional to world scale", "Existential event; all normal protocols superseded", "All available forces, classified continuity protocols"],
			])}
			<h3>Rift Frequency in the Rift Age</h3>
			<p>In the early years, Rifts opened at irregular intervals across major population centers. The Bureau now tracks over four hundred active sites globally in any given month. The rate of new openings has not decreased. Most Rifts close on their own within seventy-two hours. The ones that do not are the ones that become Domains.</p>
		</div>
	</section>`;
}

function worldbookEssenceAndAwakening(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Essence and Awakening</h2>
			<p>Essence is the energy that powers the Rift Age. Awakening is what happens when a human being begins to channel it. Neither process is fully understood. Both are irreversible.</p>
		</div>
		<div class="prose-columns">
			<h3>What Essence Is</h3>
			<p>Essence is measurable \u2014 it appears on Bureau sensors as a consistent field distortion pattern in the electromagnetic spectrum. It is present everywhere in trace amounts but concentrates dramatically inside and around Rifts. Prolonged Essence exposure changes living tissue in ways that are statistically significant but individually unpredictable.</p>
			<p>In practice, Essence is what Ascendants use to do impossible things. The internal experience varies widely: some describe it as a pressure behind the eyes, a heat in the chest, a feeling of alignment when abilities activate. The Bureau describes it as an internal reserve with measurable volume and observable depletion curves.</p>
			<h3>Awakening</h3>
			<p>Awakening is the moment a human being develops the capacity to actively channel Essence. Before Awakening, Essence passes through a person without visible effect. After, it collects, accumulates, and responds to intention.</p>
			<p>Awakening events are rarely clean. The most common triggers are proximity to a Rift opening, proximity to a major Essence event, and acute physiological or psychological stress. Some Awakenings are gradual \u2014 weeks or months of subtle changes before the threshold moment. Some happen in an instant. A small number are violent, for the Ascendant and everyone nearby.</p>
			${rulesTable(["Awakening Type", "Common Presentation"], [
				["Threshold Event", "A specific triggering moment \u2014 a Rift, a near-death experience, an extreme decision \u2014 that produces immediate, measurable Awakening."],
				["Gradual Awakening", "A slow accumulation over weeks or months, often dismissed as stress response or heightened reflexes until it becomes unmistakable."],
				["Latent Awakening", "Suppressed or delayed potential that arrives suddenly under pressure, often with less control than threshold events."],
				["Induced Awakening", "Artificially triggered through high-Essence exposure, experimental protocols, or unregulated means. Carries higher instability risk."],
			])}
			<h3>What Awakening Changes</h3>
			<p>An Ascendant can enter Rifts without the psychological dissociation that incapacitates most civilians. They can channel Essence through trained ability expressions. They heal faster than unawakened humans and sustain higher Essence exposure without degradation. They also register on Bureau sensors, which is how they get licensed \u2014 and audited.</p>
			<p>What Awakening does not change: Ascendants still age, need rest, form attachments, make bad decisions, and die. The Bureau is careful to document this. The media is considerably less careful.</p>
		</div>
	</section>`;
}

function worldbookAnomaliesAsForce(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Anomalies as a World Force</h2>
			<p>Anomalies are what came through the Rifts. They are not monsters in the traditional sense \u2014 many of them were not anything recognizable before they passed through. They are Essence made physical, given weight and appetite by the logic of whatever Rift produced them.</p>
		</div>
		<div class="prose-columns">
			<h3>What Anomalies Are</h3>
			<p>Bureau classification defines an Anomaly as any entity of confirmed non-mundane origin with a measurable Essence signature above civilian baseline that demonstrates autonomous behavior incompatible with natural species classification. In practical terms: if it came from a Rift and it is moving with intent, it is an Anomaly.</p>
			<p>Anomalies vary enormously. Some are clearly derived from natural creatures \u2014 fauna shaped by Rift passage into something larger and more dangerous. Some appear to be fragments of whatever exists on the other side of the Rift membrane \u2014 pure Essence given form by rules with no Earth equivalent. A small number appear to have been human at some point.</p>
			<h3>Anomaly Ecology</h3>
			<p>Inside a Rift or Domain, Anomalies often behave in structured ways suggesting internal hierarchy. Apex Anomalies anchor a Domain\u2019s heart and appear to organize lesser threats around them. Cleared Anomalies leave residual Essence that feeds smaller creatures. Some Domains appear to generate new Anomalies continuously as long as the heart remains stable.</p>
			<p>Outside a Rift following a Break or containment failure, Anomalies behave unpredictably. Some seek Essence concentrations. Some appear disoriented and do not survive long in the mundane world. A few adapt. These are the ones the Bureau classifies as long-term population threats.</p>
			<h3>Anomaly Rank and Society</h3>
			${rulesTable(["Rank", "Societal Impact When One Appears in Public Space"], [
				["D", "Local emergency. Standard Bureau response. Media coverage typical but rarely national."],
				["C", "District emergency. AFA notification. Insurance and legal consequences for the host site."],
				["B", "City or regional alert. Major media event. Potential political consequences for local authorities."],
				["A", "National crisis. Federal response. Long-term site condemnation. Careers end. Legislation follows."],
				["S", "Generational event. Everything changes. The Bureau\u2019s S-rank records are the most classified documents it holds."],
			])}
			<div class="sourcebook-guide"><h3>See Anomaly Manual</h3><p>The complete Anomaly stat catalog is in the Anomaly Manual. This chapter covers Anomalies as a world and setting force, not as encounter opponents.</p></div>
		</div>
	</section>`;
}

function worldbookRelicsInSociety(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Relics in Society</h2>
			<p>A Relic is a Rift-originated object with measurable and persistent Essence properties. Every one of them is worth an argument, a crime, or a war. The Rift Age was already rewriting society before Relics started coming out of the Rifts.</p>
		</div>
		<div class="prose-columns">
			<h3>Bureau Classification</h3>
			<p>The Bureau maintains a Relic registry. Ascendants are legally required to register any Relic recovered from a cleared Rift site within forty-eight hours of extraction. The Bureau assesses each one, assigns a classification tier, and makes a recommendation on usage, sale, or destruction. In practice, the Bureau recommends retention of approximately sixty percent of all registered Relics. Fifteen percent are recommended for destruction. The remaining twenty-five percent enter classification tiers that licensed Ascendants are not briefed on.</p>
			<h3>Relic Economics</h3>
			<p>Legal Relic trade is substantial. Guilds broker the sale of registered Relics between Ascendants and approved buyers \u2014 Relics serve as equipment, leverage, and investment simultaneously. The black market is larger. Unregistered Relics move through collectors, criminal networks, and people who cannot or will not use legal channels. Corporations pay what the market allows and contract lawyers to make the paperwork disappear.</p>
			<h3>Relic Politics</h3>
			<p>Several major world powers have built military and intelligence capacity around Relic deployment. This is not publicly acknowledged by any of them. The Bureau is aware. The Bureau\u2019s jurisdiction does not extend into defense ministries, which is widely regarded as one of the core structural problems of the Rift Age.</p>
			${rulesTable(["Relic Status", "Legal Standing", "Common Outcome"], [
				["Registered, approved", "Legal to possess and use", "Standard deployment, insurance coverage, Guild access"],
				["Registered, restricted", "Legal to hold; activation requires Bureau waiver", "Bureaucratic delay, political leverage, emergency use provisions"],
				["Registered, condemned", "Illegal to possess", "Forced surrender or buyout; black market if Ascendant declines"],
				["Unregistered", "Technically illegal in most jurisdictions", "Gray-market trade, legal risk during Bureau audit"],
				["Bureau-classified", "Unknown status", "The Bureau does not comment on classified Relic records"],
			])}
		</div>
	</section>`;
}

function worldbookFactions(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>The Bureau</h2>
			<p>The Bureau of Rift Operations is the oldest international body that predates the Rift Age and survived into it. It was an obscure multinational environmental monitoring commission when the first Rifts opened. Within two years it had absorbed emergency Rift authority from nineteen national governments. It has not returned any of that authority.</p>
		</div>
		<div class="prose-columns">
			<h3>What the Bureau Does</h3>
			${rulesTable(["Bureau Function", "In Practice"], [
				["Ascendant licensing", "The Bureau licenses Ascendants to operate inside Rifts and in official containment roles. Unlicensed operation is illegal in most jurisdictions."],
				["Rift classification", "Every Rift is ranked, documented, and assigned a response protocol by Bureau analysts. Most of this data is not public."],
				["Anomaly containment", "The Bureau coordinates containment with national authorities and has enforcement powers that supersede local law inside active Rift perimeters."],
				["Relic registration", "The Bureau maintains the official Relic registry. Registration is mandatory under Bureau operating treaties."],
				["Information management", "The Bureau manages public-facing alerts and media briefings. What it releases is curated. What it withholds is extensive."],
			])}
			<h3>Bureau Structure</h3>
			<p>The Bureau is organized into Directorates: Directorate Containment (field response), Directorate Intelligence and Assessment, Directorate Ascendant Affairs (licensing, compliance, audit), and Directorate Zero \u2014 classified programs acknowledged but not briefed to other Directorates. Field Ascendants interact primarily with Directorate Ascendant Affairs. Bureau Containment rapid-response teams are separately licensed and do not take open contracts from civilian clients.</p>
		</div>
	</section>
	<section class="section-block">
		<div class="section-intro">
			<h2>The AFA</h2>
			<p>The Ascendant Field Authority is the Bureau\u2019s high-threat arm \u2014 the organization called in when a Rift is too large, too fast, or too strange for standard response. It operates under Bureau authority but functions with significant operational independence.</p>
		</div>
		<div class="prose-columns">
			<h3>AFA Mandate</h3>
			<p>The AFA coordinates inter-jurisdiction operations across national borders, handles disaster triage in large-scale Rift events, and manages classified cleanups involving S-rank threats or Regent-attributed Rift signatures. Its Ascendants are among the highest-licensed operatives in existence.</p>
			<p>The AFA does not do routine contract work. When the AFA arrives at a Rift site, it means the Bureau\u2019s standard response models predicted something that required a different kind of answer. Independent contractors typically view AFA arrival as a sign that the contract has become complicated.</p>
		</div>
	</section>
	<section class="section-block">
		<div class="section-intro">
			<h2>Guilds</h2>
			<p>Guilds are the Rift Age\u2019s answer to what Ascendants do when they need to work outside Bureau channels and still need to eat. Some are mercenary organizations. Some are trade bodies. Some are barely legal fronts for organized crime. Most are some combination of all three.</p>
		</div>
		<div class="prose-columns">
			<h3>What Guilds Provide</h3>
			${rulesTable(["Service", "How Guilds Deliver It"], [
				["Contract access", "Guilds receive private contracts from corporations, individuals, and governments that cannot or will not use Bureau channels."],
				["Legal cover", "Guild membership provides access to lawyers who know how to navigate licensing, audit, and Relic registration disputes."],
				["Equipment and credit", "Most Guilds operate internal credit systems, equipment pools, and item lockers accessible to member Ascendants."],
				["Reputation currency", "Guild standing translates into contract access, partner trust, and back-channel influence in Rift Age commerce."],
				["Black market adjacency", "The Guild officially knows nothing about this. The Guild unofficially runs a significant portion of it."],
			])}
		</div>
	</section>
	<section class="section-block">
		<div class="section-intro">
			<h2>Corporations, Media, Law, Faith, and the Black Market</h2>
			<p>The Rift Age did not pause the rest of the world. Corporations adapted faster than governments. Media learned that Ascendants were the most compelling subjects it had ever covered. Law developed faster than law enforcement. The black market became the most honest institution in the Rift economy.</p>
		</div>
		<div class="prose-columns">
			<h3>Corporations</h3>
			<p>Several major multinational corporations have established Rift-related divisions that rival or exceed Bureau operational capacity in specific domains. They cannot legally run Rift operations directly, so they contract licensed Guilds and Ascendants. The distinction is nominal in practice. Corporate Rift divisions employ more analysts, equipment designers, and intelligence staff than most Bureau Directorates.</p>
			<h3>Media</h3>
			<p>Ascendants are public figures whether they choose to be or not. Bureau licensing records are technically public. Rift site coordinates become local news within hours of containment perimeter establishment. A licensed Ascendant operating in public during a Rift event will be recorded, identified, and discussed by morning. Some Ascendants have learned to use this. Most find it a complication.</p>
			<h3>Law</h3>
			<p>The legal status of Ascendants varies significantly by jurisdiction. In Bureau-treaty nations, Ascendants have specific legal designations affecting criminal liability, licensing requirements, Relic property rights, and civil responsibility during Rift events. In non-treaty jurisdictions, they may have no legal status at all \u2014 which cuts both ways.</p>
			<h3>Faith</h3>
			<p>Every major religious tradition has produced multiple interpretive responses to the Rift Age. The range runs from integration (Rifts are a new phase of creation, Awakening is a form of calling) to opposition (Rifts are intrusions of a hostile reality, Ascendants are contaminated) to exploitation (several small sects treat Rift sites as sacred and Anomalies as divine messengers). The Pantheon\u2019s apparent existence has not produced official theological consensus anywhere.</p>
			<h3>Black Market</h3>
			<p>The unregistered Relic market, unlicensed contract network, and gray-zone services outside Bureau oversight collectively represent the largest parallel economy in the Rift Age. It operates through Guild adjacency, criminal organization, private collectors, and individual Ascendants who have decided the administrative costs of compliance exceed the operational benefits. The Bureau is aware. Its enforcement resources are finite.</p>
		</div>
	</section>`;
}

function worldbookDomains(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Domains and Persistent Rift Interiors</h2>
			<p>A Domain is a Rift Interior that has stabilized. It has its own rules, its own ecology, a heart that keeps it alive, and \u2014 in some documented cases \u2014 something that functions like intent. Domains do not close on their own. The Bureau considers every active Domain a long-term liability.</p>
		</div>
		<div class="prose-columns">
			<h3>What Makes a Domain</h3>
			<p>Domains form when a Rift Interior reaches internal coherence \u2014 when its rules become self-sustaining rather than dependent on the threshold event that created it. The heart of a Domain is an Anomaly or construct that embodies and enforces those rules. As long as the heart persists, the Domain persists.</p>
			<h3>Domain Properties</h3>
			${rulesTable(["Property", "Meaning for Operations Inside"], [
				["Threshold stability", "A stable Domain has a reliable entry point. An unstable Domain\u2019s threshold may move, multiply, close temporarily, or apply conditions to those crossing it."],
				["Internal rules", "Every Domain establishes rules that override mundane physics. Time, gravity, perception, Essence recovery, and visibility may all behave differently."],
				["Ecological pressure", "Domains generate Anomalies as long as the heart is stable. Cleared Anomalies return. Closing the heart is the only way to end a Domain\u2019s ecology permanently."],
				["Reward density", "Domains accumulate Essence, Relics, and remains in ways that temporary Rifts do not. Extended Domain operations are lucrative \u2014 and they are never brief."],
				["Persistence after clearing", "A wounded-but-surviving heart may allow the Domain to reconstruct itself within days, weeks, or months. Confirm termination before declaring a Domain cleared."],
			])}
			<h3>Domain Classification Types</h3>
			<p>The Bureau classifies Domains by internal logic type, which predicts behavior better than rank alone for operations planning. Common types: <strong>Spatial</strong> (geometry does not behave normally), <strong>Temporal</strong> (time pressure or apparent loops), <strong>Ecological</strong> (living Domain with active growth patterns), <strong>Mechanical</strong> (structured rule enforcement, often trap-like), and <strong>Sovereign</strong> (the Domain has something approaching will and may recognize the existence of negotiation).</p>
		</div>
	</section>`;
}

function worldbookInUniverseDocs(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>In-Universe Documents</h2>
			<p>The Rift Age generates documentation. The Bureau produces it. The media circulates it. Ascendants carry it into the field. The following are representative samples of what an Ascendant encounters in their operational life.</p>
		</div>
		<div class="prose-columns">
			<h3>Bureau Field Advisory</h3>
			<div class="read-aloud"><p><strong>BUREAU OF RIFT OPERATIONS \u2014 FIELD ADVISORY</strong><br/>Classification: Public \u2014 Standard Distribution<br/>Event ID: BRO-C-20260419-0047<br/>Site: Industrial Corridor, Sector 7. Grid reference withheld per containment protocol.<br/>Rank: C \u2014 Elevated Hazard. Threshold Status: Stable. No active expansion at time of filing.<br/>Anomaly Activity: Two confirmed Type-III signatures. One Type-II mobile. Civilian evacuation radius: 400 meters.<br/>Contract Status: Open to licensed Ascendants, Rank C minimum. Bureau oversight officer: Pending assignment.<br/>Note: Site access requires valid license at perimeter checkpoint. Unauthorized entry will trigger immediate license suspension review.</p></div>
			<h3>Guild Contract Bulletin</h3>
			<div class="read-aloud"><p><strong>IRONCLAD EXTRACTION SERVICES \u2014 MEMBER BULLETIN</strong><br/>Contract Reference: ICE-2026-0883. Type: Extraction \u2014 Relic, contested.<br/>Site: BRO-C-20260419-0047. Client: Withheld \u2014 corporate, non-Bureau affiliated.<br/>Objective: Locate and extract one (1) unregistered Relic confirmed via satellite Essence signature. Client documentation establishes prior ownership claim \u2014 legal status disputed.<br/>Payout: Base 14,000 credit. Bonus 6,000 if extracted before Bureau oversight arrives on site.<br/>Note: This contract runs parallel to Bureau licensed activity. Coordination is the Ascendant\u2019s responsibility. ICE does not carry liability for post-operation licensing review.</p></div>
			<h3>Civilian Witness Statement \u2014 Excerpt</h3>
			<div class="read-aloud"><p><em>Taken from Bureau voluntary witness intake. Released in redacted form under public transparency provisions.</em><br/>\u201cI heard it before I saw it. The air made a sound like someone pressing a finger against the inside of a speaker. Then there was a light \u2014 not like electricity, more like something deciding to become visible. And then one of them came through. The Ascendant. She was running. I don\u2019t know where she went. There was a sound behind her that I haven\u2019t found a word for. I don\u2019t sleep well anymore. I want the record to say that.\u201d</p></div>
			<h3>Media Headlines \u2014 Archive</h3>
			${rulesTable(["Outlet", "Headline", "Tone"], [
				["National Post", "Bureau Reports 47th Rift Event This Month \u2014 Record High Since Tracking Began", "Factual, alarmed"],
				["The Sovereign Report", "Ascendants: Public Heroes or Government-Licensed Weapons?", "Adversarial, high readership"],
				["Economic Digest", "Relic Market Valuation Exceeds Traditional Precious Metals for Third Consecutive Quarter", "Clinical, bullish"],
				["Local Voice", "Our Neighborhood Hasn\u2019t Been the Same Since the Rift Clear. We\u2019re Still Here.", "Human interest, resigned"],
				["Unnamed Broadcast", "They Came Through a Hole in the Sky and We\u2019re Supposed to Pretend That\u2019s Normal", "Panic-adjacent, viral"],
			])}
		</div>
	</section>`;
}

// ─── Awakened Arts authored prose ────────────────────────────────────────────

function awakenedArtsSystemPrimer(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>How Abilities Work</h2>
			<p>An Ascendant\u2019s abilities are the practical expression of their Awakening \u2014 everything from a precisely trained combat maneuver to a reality-warping spell. They fall into five categories: Techniques, Powers, Spells, Runes, and Inscriptions (Sigils and Tattoos). Each category has its own access rules, resource model, and range of expression.</p>
		</div>
		<div class="prose-columns">
			<h3>Ability Categories</h3>
			${rulesTable(["Category", "What It Is", "How You Get It", "Primary Resource"], [
				["Technique", "A trained martial or tactical action \u2014 a fighting pattern, weapon maneuver, or combat movement refined through experience.", "Job progression, Path features, Fighting Style selection, feat acquisition.", "Stamina-based uses per rest, or triggered by conditions (stance, weapon, position)."],
				["Power", "An innate authority expression \u2014 something your Awakening grants you direct access to, shaped by your Job.", "Job progression and Path features at specific levels.", "Internal Essence pool; refreshes on short or long rest depending on tier."],
				["Spell", "A structured Essence effect with defined components, range, duration, and often concentration requirements.", "Spellcasting Jobs and Paths; tutors, spellbooks, or rune absorption.", "Spell slots of the appropriate level; cost printed on each spell entry."],
				["Rune", "An absorbed Essence pattern that teaches a specific ability when consumed.", "Found in Rifts, purchased from vendors, recovered from Anomaly remains, given as contract rewards.", "Consumed on absorption; the learned ability uses its own resource (see Rune Mechanics chapter)."],
				["Sigil / Tattoo", "A permanent inscription \u2014 on a weapon, armor, or the Ascendant\u2019s skin \u2014 granting passive or activated benefits.", "Inscribed by a trained specialist or self-inscribed by a qualified Ascendant.", "Attunement slots; activation costs as printed on the entry."],
			])}
			<h3>Job and Path Access</h3>
			<p>Your Job determines which ability categories you can access natively. A martial Job like Striker learns Techniques natively and has no native spell slot access. A casting Job like Sorcerer has native Spell access and may have Power access through specific Paths. Your Path specifies which abilities within those categories you unlock at each level.</p>
			<p>Cross-access is possible through Rune absorption: a Striker can absorb a spell-teaching Rune and use that spell through cross-access mechanics, even without native spell slots. The Warden\u2019s Guide covers which cross-access is balanced for your table; this book provides every ability entry as written.</p>
			<h3>Reading an Ability Entry</h3>
			${rulesTable(["Field", "What It Tells You"], [
				["Activation / Action", "The action type required: Action, Bonus Action, Reaction, or free action."],
				["Range", "Self affects only you. Touch requires adjacency. A numbered range is in feet."],
				["Duration", "Instantaneous means the effect resolves at once. Concentration means you can only maintain one concentration effect at a time."],
				["Uses per rest", "Short rest recharge: intended for 2\u20133 uses per session. Long rest recharge: intended for 1\u20132 uses per session."],
				["Higher levels / At Rank", "How the ability scales. If this field is absent, the ability does not scale beyond its printed text."],
			])}
		</div>
	</section>`;
}

function awakenedArtsRuneDeepDive(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Rune Mechanics</h2>
			<p>A Rune is an inscribed Essence pattern that can be absorbed by an Ascendant to learn the ability it contains. Native absorption works cleanly. Cross-access absorption works with limits. Both are permanent once completed.</p>
		</div>
		<div class="prose-columns">
			${runePrimer()}
			<h3>Absorption Procedure</h3>
			${rulesTable(["Step", "What Happens"], [
				["Acquire the Rune", "Recovered from Rift loot, purchased from a licensed vendor, or obtained as a contract reward. Physical Rune objects deteriorate within 24\u201372 hours if not absorbed."],
				["Assess access type", "Check whether the ability the Rune teaches is in your Job\u2019s native category. Native = full access. Outside your category = cross-access."],
				["Absorb", "One hour of focused Essence attunement. The Rune is consumed on completion. The pattern becomes part of the Ascendant\u2019s Essence structure permanently."],
				["Apply access rules", "Native absorption: ability added permanently at its normal cost. Cross-access: ability available with limited uses per long rest per the formula below."],
			])}
			<h3>Cross-Access Absorption</h3>
			<p>When you absorb a Rune outside your native categories, you gain the ability with a limited-use cap: <strong>uses per long rest = max(1, proficiency bonus + primary ability modifier + rarity bonus)</strong>.</p>
			${rulesTable(["Rune Rarity", "Common", "Uncommon", "Rare", "Epic", "Legendary"], [
				["Rarity bonus to formula", "+0", "+1", "+2", "+3", "+4"],
			])}
			<h3>Cross-Access Active Slots</h3>
			<p>An Ascendant may have an unlimited number of absorbed Runes, but may only actively maintain cross-access Rune abilities equal to their proficiency bonus at any time. Runes beyond this limit are learned but dormant \u2014 they can be swapped into active slots during a long rest. Native-access rune abilities do not count toward this limit.</p>
			<h3>Warden Approval</h3>
			<p>The Warden approves all cross-access Rune absorption. They may restrict specific Rune types by campaign, setting, or character context. This book provides the full mechanical entry for every ability; the Warden\u2019s Guide covers how to adjudicate Rune availability at your table.</p>
		</div>
	</section>`;
}

function awakenedArtsWardenGuidance(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Warden Approval and Ability Balance</h2>
			<p>This book is the complete ability catalog. The Warden decides which abilities are available at their table. These guidelines help both Wardens and players understand how abilities are designed and where the balance touchpoints are.</p>
		</div>
		<div class="prose-columns">
			<h3>Balance Touchpoints</h3>
			${rulesTable(["Concern", "Suggested Approach"], [
				["Ability deals very high damage", "Check uses-per-rest. High damage once per long rest is generally acceptable."],
				["Ability invalidates skill challenges", "Have a direct conversation about when table-level detection bypasses apply."],
				["Significant crowd control", "Watch for concentration \u2014 most crowd control should require it."],
				["Cross-access ability feels too powerful", "Apply rarity cap strictly and enforce the active cross-access slot limit per the Rune Mechanics chapter."],
				["Ability lacks clear limits", "Rule that it follows standard action economy for its listed activation and read the description conservatively."],
			])}
			<h3>Ability Design Philosophy</h3>
			<p>Rift Ascendant abilities are designed to be expressive rather than optimal. The goal is that every Ascendant has a distinct action vocabulary \u2014 a way of playing that feels recognizably theirs. When building characters, prioritize abilities that generate interesting decisions rather than abilities that eliminate decision points for others at the table.</p>
			<h3>Cross-Book Reference</h3>
			<p>The Ascendant Guide has curated representative examples of Techniques, Powers, and Spells to introduce players to the system. This book contains the full catalogs. The Warden Guide has the adjudication rules for contested ability use. The Companion App has the searchable complete database including every generated variant.</p>
		</div>
	</section>`;
}

function awakenedArtsAppGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Using the Companion App</h2>
			<p>This book is the print edition of Awakened Arts \u2014 curated, authored, and laid out for table reference. The Companion App is the searchable complete database. Use both together for the full system.</p>
		</div>
		<div class="prose-columns">
			${rulesTable(["Task", "Best Tool"], [
				["Look up a specific ability during a session", "This book \u2014 flip to the catalog section by type"],
				["Browse all available Runes by rarity or school", "App \u2014 filtered search is faster than a print index"],
				["Check whether a spell is in your Job\u2019s native list", "App \u2014 cross-reference is instant"],
				["Understand how Rune absorption mechanics work", "This book \u2014 the Rune Mechanics chapter is here"],
				["Track which Runes are absorbed and their current status", "App \u2014 character sheet integration"],
				["Find all abilities with specific keyword combinations", "App \u2014 full-text search"],
				["Read the canonical text of a specific ability", "This book \u2014 all entries are printed in full"],
			])}
		</div>
	</section>`;
}

// ─── Ascendant Guide Expanded Prose ──────────────────────────────────────────

function characterCreationWalkthrough(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Character Creation Walkthrough</h2>
			<p>Creating an Ascendant is about answering three questions: How does your Awakening express (Job/Path), who were you before (Background), and what can you do in the field right now (Abilities and Gear)? Let's walk through it using an example character: <strong>Sato Ken</strong>.</p>
		</div>
		<div class="prose-columns">
			<h3>1. Choose Your Job and Path</h3>
			<p>Your Job is your primary classification. Sato chooses <strong>Holy Knight</strong>, a front-line defender with native Technique and Power access. Your Job grants your hit dice (d10 for Holy Knight), saves (SENSE and PRE), and weapon/armor proficiencies. At level 3, Holy Knights choose a Path. Sato takes the <strong>Path of the Retribution Mandate</strong> to pursue threats against his squad.</p>
			<h3>2. Choose Your Background</h3>
			<p>Who were you before the Rift Age broke you open? Sato takes the <strong>Military Police</strong> background. This grants him proficiency in Athletics and Insight, the 'Cordon Access' feature, and standard-issue MP gear to combine with his Holy Knight starting equipment.</p>
			<h3>3. Assign Ability Scores</h3>
			<p>Rift Ascendant uses six abilities: STR, AGI, VIT, INT, SENSE, and PRE. The standard array is 16, 14, 13, 12, 10, 8. Sato assigns his scores to prioritize defense and resonance: <strong>STR 16, VIT 14, PRE 13, AGI 12, SENSE 10, INT 8</strong>.</p>
			<h3>4. Select Skills and Feats</h3>
			<p>Your Job and Background grant skill proficiencies. Sato takes Intimidation and Medicine from Holy Knight, plus Athletics and Insight from Military Police. Since he's level 3, he hasn't reached his first feat choice yet (which comes at level 4 for most Jobs).</p>
			<h3>5. Record Abilities and Rift Favor</h3>
			<p>Write down your starting Techniques and Powers from your Job. Then, record your Rift Favor. As a level 3 Ascendant, Sato has a <strong>Rift Favor pool of 3 points and uses a d4</strong>. He can spend these points to boost rolls, soak damage, or use specific Rift actions in a crisis.</p>
		</div>
	</section>`;
}

function advancementTables(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Advancement and Milestones</h2>
			<p>As you survive Rifts, your Ascendant grows stronger. Progression grants more hit points, higher proficiency bonuses, stronger abilities, and a deeper Rift Favor pool. Advancement is tied to milestones decided by the Warden.</p>
		</div>
		<div class="prose-columns">
			${rulesTable(["Level", "Proficiency Bonus", "Rift Favor Pool", "Favor Die", "Typical Milestone Tier"], [
				["1", "+2", "3", "d4", "Newly Awakened (Rank D)"],
				["2", "+2", "3", "d4", "Field-Tested"],
				["3", "+2", "3", "d4", "Path Unlocked"],
				["4", "+2", "3", "d4", "First Feat Selection"],
				["5", "+3", "4", "d6", "Veteran (Rank C)"],
				["6", "+3", "4", "d6", "Secondary Feat"],
				["7", "+3", "4", "d6", "Advanced Powers Unlocked"],
				["8", "+3", "4", "d6", "Third Feat Selection"],
				["9", "+4", "4", "d6", "Elite (Rank B)"],
				["10", "+4", "4", "d6", "Fourth Feat Selection"],
				["11", "+4", "4", "d6", "Domain Survivor"],
				["12", "+4", "4", "d6", "Fifth Feat Selection"],
				["13", "+5", "5", "d8", "Master (Rank A)"],
				["14", "+5", "5", "d8", "Sixth Feat Selection"],
				["15", "+5", "5", "d8", "Apex Survivor"],
				["16", "+5", "5", "d8", "Seventh Feat Selection"],
				["17", "+6", "6", "d10", "Legendary (Rank S)"],
				["18", "+6", "6", "d10", "Eighth Feat Selection"],
				["19", "+6", "6", "d10", "Near-Eternal"],
				["20", "+6", "6", "d10", "World-Shaper"],
			])}
			<h3>Feats and Ability Score Increases</h3>
			<p>At even levels (4, 6, 8, etc.), most Jobs grant a choice: take a new Feat from the catalog, or increase one ability score by 2 (or two scores by 1). Some Jobs vary this cadence slightly, but this is the standard progression.</p>
		</div>
	</section>`;
}

function partyRoleGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Combat Roles in the Rift</h2>
			<p>No Ascendant survives alone. The Domain is hostile, and Anomalies coordinate. Building a party that covers all four major combat roles ensures you have answers to whatever the Rift throws at you.</p>
		</div>
		<div class="prose-columns">
			${rulesTable(["Role", "Primary Focus", "Example Jobs"], [
				["Striker", "High single-target damage, mobility, and eliminating high-threat targets quickly.", "Assassin, Gunner, Striker"],
				["Controller", "Area denial, altering terrain, debuffing enemies, and crowd control.", "Esper, Elementalist, Arcanist"],
				["Support", "Healing, buffing allies, moving party members, and mitigating incoming damage.", "Medic, Holy Knight, Oracle"],
				["Scout", "Information gathering, stealth, hazard detection, and opening the engagement on favorable terms.", "Stalker, Contractor, Ranger"],
			])}
			<h3>Composition Strategy</h3>
			<p>You don't need one of every role, but you need an answer for every role. If you lack a Controller, expect to get swarmed by lesser Anomalies. If you lack a Support, you will burn through your hit dice faster. Communicate during character creation to ensure your tools overlap without leaving fatal gaps.</p>
		</div>
	</section>`;
}

function sampleBuildsSection(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Sample Builds (Level 5)</h2>
			<p>These Level 5 builds show how Jobs, Paths, Feats, and Gear come together to create field-ready Ascendants.</p>
		</div>
		<div class="prose-columns">
			<h3>Cinder — Stalker / Deep-Salvage Path</h3>
			<p><strong>Role:</strong> Scout / Striker<br/><strong>Key Stats:</strong> AGI 18, SENSE 14<br/><strong>Key Abilities:</strong> Hazard Instinct, Core Extraction, Sneak Attack<br/><strong>Gear:</strong> Silenced SMG, Salvage Rig, 2x Smoke Grenades<br/><strong>Rift Favor Strategy:</strong> Save points for 'Flash Step' to escape if a dive goes bad.</p>
			<h3>Quill — Esper / Memory Broker Path</h3>
			<p><strong>Role:</strong> Controller / Support<br/><strong>Key Stats:</strong> INT 18, PRE 14<br/><strong>Key Abilities:</strong> Memory Appraisal, Telekinetic Push, Mind Spike<br/><strong>Gear:</strong> Bureau-issue Sidearm, Memory-Core Bandolier<br/><strong>Rift Favor Strategy:</strong> Use 'Rift Insight' early to learn Anomaly vulnerabilities and feed the info to Cinder.</p>
			<h3>Deng Wei — Destroyer / Heavy Ordnance Path</h3>
			<p><strong>Role:</strong> Striker / Controller<br/><strong>Key Stats:</strong> STR 18, VIT 16<br/><strong>Key Abilities:</strong> Suppressing Fire, Heavy Hitter, Fortify Position<br/><strong>Gear:</strong> Heavy Field Cannon, Blast Armor<br/><strong>Rift Favor Strategy:</strong> Use 'Rift Boost' on critical attack rolls to ensure the field cannon connects.</p>
		</div>
	</section>`;
}

function combatExampleSection(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Combat Example: Breach at the Annex</h2>
			<p>Cinder (Level 5 Stalker) and Quill (Level 5 Esper) are holding the line against a Rank-C Rift Hound. Let's see how action economy and Rift Favor play out.</p>
		</div>
		<div class="prose-columns">
			<h3>Turn 1: Information and Positioning</h3>
			<p><strong>Quill's Turn:</strong> Quill uses his <strong>Action</strong> to cast <em>Mind Spike</em>, dealing psychic damage to the Hound. He then uses a <strong>Bonus Action</strong> to spend 1 Rift Favor for <strong>Rift Insight</strong>, learning that the Hound is immune to fire. He uses his <strong>Movement</strong> to take cover behind a barricade.</p>
			<p><strong>Cinder's Turn:</strong> Hearing Quill's warning, Cinder uses her <strong>Bonus Action</strong> to apply a fire-aligned weapon oil to her SMG. Wait, the Hound is immune to fire. She swaps to a cold-aligned oil instead. She uses her <strong>Movement</strong> to get into flanking position, then uses her <strong>Action</strong> to fire, triggering her Sneak Attack for massive cold damage.</p>
			<p><strong>Warden's Turn:</strong> The Hound uses its <strong>Movement</strong> to close the distance to Cinder, ignoring Quill in cover. It uses its <strong>Action</strong> to Bite. The attack roll beats Cinder's AC.</p>
			<h3>Turn 2: Pressure and Response</h3>
			<p><strong>Cinder's Turn (Reaction):</strong> The Hound hit Cinder hard. She uses her <strong>Reaction</strong> to cast <em>Shield</em> (a cross-access spell she learned from a Rune), raising her AC just enough to turn the hit into a miss.</p>
			<p><strong>Cinder's Turn (Action):</strong> Cinder uses the Disengage action to step back safely, then uses <strong>Flash Step</strong> (spending 1 Rift Favor) to teleport to high ground. She fires her SMG again.</p>
			<p><strong>Quill's Turn:</strong> Quill sees the Hound preparing to lunge at Cinder's new position. He uses his <strong>Action</strong> to cast <em>Hold Monster</em>. The Hound fails its saving throw and is paralyzed. The tide has turned.</p>
		</div>
	</section>`;
}

function playerQuickReference(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Player Quick Reference</h2>
			<p>Keep this page open during your first few sessions. It covers the core mechanics you will use constantly.</p>
		</div>
		<div class="prose-columns">
			<h3>The Core Roll</h3>
			<p><strong>d20 + Ability Modifier + Proficiency Bonus (if trained) vs. Target Number (DC or AC)</strong></p>
			<h3>Action Economy (Per Turn)</h3>
			<ul>
				<li><strong>1 Action:</strong> Attack, Cast a Spell, Use a major Power/Technique, Dash, Disengage, Dodge, Help, Hide.</li>
				<li><strong>1 Bonus Action:</strong> Only available if a feature, spell, or item explicitly says it uses a bonus action.</li>
				<li><strong>1 Reaction:</strong> Used outside your turn, triggered by specific events (like an Opportunity Attack or the <em>Shield</em> spell).</li>
				<li><strong>Movement:</strong> Move up to your speed. You can break this up before and after your actions.</li>
			</ul>
			<h3>Rift Favor (The Safety Valve)</h3>
			<ul>
				<li><strong>Boost (1 pt):</strong> Add your Favor Die to a d20 roll before the outcome is declared.</li>
				<li><strong>Override (1 pt):</strong> Reroll a failed d20.</li>
				<li><strong>Insight (1 pt):</strong> Learn one useful combat fact about an enemy.</li>
				<li><strong>Recovery (1 pt):</strong> Bonus action to end one condition or reduce exhaustion.</li>
			</ul>
			<h3>Death and Recovery</h3>
			<ul>
				<li><strong>0 HP:</strong> You are unconscious and making Death Saving Throws at the start of your turn. 3 successes = stable. 3 failures = dead.</li>
				<li><strong>Short Rest (1 hour):</strong> Spend Hit Dice to heal. Refresh short-rest abilities.</li>
				<li><strong>Long Rest (8 hours):</strong> Recover all HP, regain half your spent Hit Dice, refresh all abilities.</li>
			</ul>
		</div>
	</section>`;
}

// ─── Warden Guide Expanded Prose ──────────────────────────────────────────

function sessionZeroGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Session Zero Guide</h2>
			<p>Rift Ascendant is a game about high-stress urban horror, tactical combat, and the trauma of Awakening. You must align on tone and boundaries before the first die is cast.</p>
		</div>
		<div class="prose-columns">
			<h3>The Alignment Checklist</h3>
			${rulesTable(["Topic", "What to Discuss"], [
				["Lethality", "Is death common? Do enemies finish off downed Ascendants? Set expectations for character mortality."],
				["Bureau Pressure", "Is the Bureau a helpful employer, a looming threat, or the primary antagonist?"],
				["Relic Economy", "Will the party be drowning in illegal tech, or fighting over scraps?"],
				["Regent Involvement", "Are the Eternals active players in this campaign, or distant myths?"],
				["PVP and Secrets", "Are player-vs-player conflicts allowed? Can characters keep secrets from the party?"],
			])}
			<h3>Tone and Safety</h3>
			<p>Because the game deals with body horror (Anomalies), trauma (Awakening), and institutional cruelty (the Bureau), safety tools are mandatory. Introduce the X-Card, Lines and Veils, or a similar system during Session Zero. Tell your players explicitly: 'We are here to torture your characters, not you. If the horror bleeds out of the game and into the room, we stop.'</p>
		</div>
	</section>`;
}

function campaignFrameGuide(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Campaign Frames</h2>
			<p>A campaign frame gives your game a structure and a goal. Choose one that fits your group's preferred playstyle.</p>
		</div>
		<div class="prose-columns">
			<h3>Frame 1: Street-Level (Guild Contractors)</h3>
			<p><strong>Levels 1-7.</strong> The party works for a shady Guild (like the Vermillion). Missions focus on D and C-rank Rifts, smuggling, Relic recovery, and avoiding Bureau audits. The horror is intimate: mutated fauna, desperate rival contractors, and trying to pay the rent with cursed gold.</p>
			<h3>Frame 2: Operational (Bureau Sentinels)</h3>
			<p><strong>Levels 5-12.</strong> The party is an official Bureau response team. Missions focus on B and A-rank containment, civilian evacuation, and tracking down dangerous rogue Ascendants. The horror is institutional: deciding who gets saved, realizing the Bureau is lying, and facing threats too big for small-arms fire.</p>
			<h3>Frame 3: Apex (AFA or Rogue Legends)</h3>
			<p><strong>Levels 10-20.</strong> The party operates at the highest levels, either as the Bureau's elite Ascendant Field Authority or as independent legends. Missions focus on S-rank Domains, killing Domain Hearts, and Regent politics. The horror is existential: reality breaking down, gods making demands, and realizing you are the only thing standing between a city and the void.</p>
		</div>
	</section>`;
}

function downtimeActivities(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Downtime Activities</h2>
			<p>When the Rift closes, the real world is still there. Downtime happens between contracts when Ascendants have weeks or months to recover.</p>
		</div>
		<div class="prose-columns">
			${rulesTable(["Activity", "Procedure and Outcome"], [
				["Relic Research", "Spend 1 week and 100cr. Roll INT (Arcana). Success: Learn the hidden quirk or exact activation trigger of an unidentified Relic."],
				["Bureau License Maintenance", "Spend 1 week navigating bureaucracy. Roll PRE (Persuasion). Success: Clear minor infractions and avoid an audit this month."],
				["Black Market Scouting", "Spend 1 week and 500cr in bribes. Roll SENSE (Investigation). Success: Locate a specific Uncommon or Rare item for purchase."],
				["Rift Recovery", "Spend 1 week in medical care (200cr). Remove one persistent injury or reduce Corruption by 1 point."],
				["Training", "Spend 4 weeks and 1000cr. Gain proficiency in a new tool or language, or retrain one Feat or Fighting Style."],
			])}
		</div>
	</section>`;
}

function wardenSafetyTools(): string {
	return `<section class="section-block">
		<div class="section-intro">
			<h2>Safety Tools in the Rift Age</h2>
			<p>Rift Ascendant leans into themes that require careful table management. The horror is often visceral, and the institutional pressure is intentionally claustrophobic. Use these tools to keep the game safe and fun.</p>
		</div>
		<div class="prose-columns">
			<h3>Lines and Veils</h3>
			<p>Establish these before play begins. A <strong>Line</strong> is a topic that will never appear in the game (e.g., sexual assault, harm to children). A <strong>Veil</strong> is a topic that can exist in the world but happens 'off-camera' (e.g., torture, specific phobias). Respect the Lines and Veils unconditionally.</p>
			<h3>The X-Card</h3>
			<p>Place a card with an 'X' on the table. Anyone can tap it at any time to edit out the current content, no questions asked. The Warden simply says, 'Got it. We skip past this,' and moves the scene forward. If playing online, establish an 'X' typed in chat as the equivalent.</p>
			<h3>Common RA Triggers</h3>
			<p>Be particularly mindful of these common Rift Ascendant themes during calibration: <strong>Body horror/mutation</strong> (common with Anomalies and Tattoos), <strong>loss of autonomy</strong> (common with possession or Regent control), and <strong>bureaucratic cruelty</strong> (Bureau operations).</p>
		</div>
	</section>`;
}

// ─── Book Builders ────────────────────────────────────────────────────────────

function buildRunSilentBook(): BookDefinition {
	return {
		slug: "run-silent",
		title: "Rift Ascendant - Run Silent",
		subtitle: "Run Silent",
		classification: "Campaign Book",
		tagline: "Begin in the material world. Cross the Threshold. Run silent.",
		outputBase: "Rift Ascendant - Run Silent Campaign",
		coverImage: "/ui-art/run_silent_cover.png",
		sections: runSilentSections,
	};
}

function buildGlasslineClaimBook(): BookDefinition {
	return {
		slug: "glassline-claim",
		title: "Rift Ascendant - The Glassline Claim",
		subtitle: "The Glassline Claim",
		classification: "Warden One-Shot",
		tagline: "Escort the crew. Hold the claim. Bring the proof home.",
		outputBase: "Rift Ascendant - The Glassline Claim",
		coverImage: "/generated/compendium/locations/location-0001.webp",
		sections: glasslineClaimSections,
		requiredPageTarget: false,
	};
}

function buildAscendantBook(): BookDefinition {
	const playerCoreRunes = coreRunes();
	const playerCoreItems = coreItems();
	const sections: BookSection[] = [
		section({
			id: "world-lore",
			part: "Part 1: The Rift Age",
			title: "The Rift Age",
			kicker: "Welcome",
			summary:
				"The world broke open. Rifts tore through reality, Anomalies poured out, and ordinary people began to change. This is the world you live in now.",
			image: bookArt.ascendantWorld,
			body: () => proseBlock(riftWorldLore()),
		}),
		section({
			id: "core-mechanics",
			part: "Part 1: The Rift Age",
			title: "Core Rules",
			kicker: "How The Game Works",
			summary:
				"How checks work, how combat flows, what your resources are, and how the Rift gives you an edge when you need it most.",
			image: bookArt.ascendantAbilities,
			body: playerRulesPrimer(),
		}),
		section({
			id: "quick-reference",
			part: "Part 1: The Rift Age",
			title: "Player Quick Reference",
			kicker: "Cheat Sheet",
			summary: "Core mechanics, action economy, and Rift Favor rules summarized for easy reference during play.",
			image: bookArt.ascendantAbilities,
			body: playerQuickReference(),
		}),
		section({
			id: "party-roles",
			part: "Part 2: Creating An Ascendant",
			title: "Combat Roles",
			kicker: "Party Composition",
			summary: "Understanding the four combat roles and how to build a balanced team that survives the Rift.",
			image: bookArt.ascendantJobs,
			body: partyRoleGuide(),
		}),
		section({
			id: "character-creation",
			part: "Part 2: Creating An Ascendant",
			title: "Character Creation",
			kicker: "Walkthrough",
			summary: "Step-by-step guide to building your Ascendant, using Sato Ken as an example.",
			image: bookArt.ascendantBackgrounds,
			body: characterCreationWalkthrough(),
		}),
		section({
			id: "jobs",
			part: "Part 2: Creating An Ascendant",
			title: "Jobs",
			kicker: "Awakening Classifications",
			summary:
				"Your Job defines the shape of your Awakening \u2014 how you fight, what you channel, and what the Bureau classifies you as.",
			image: bookArt.ascendantJobs,
			body: renderCatalog("Jobs", "When the Rift first touches you, something inside rewrites itself. The Bureau calls these patterns Jobs \u2014 broad classifications for how Ascendant power expresses.", jobs, {
				folder: "jobs",
				context: "Job",
			}),
		}),
		section({
			id: "paths",
			part: "Part 2: Creating An Ascendant",
			title: "Paths",
			kicker: "Specializations",
			summary:
				"A Path is your specialization within your Job. It\u2019s the difference between a Striker who fights with fists and one who fights with shadow.",
			image: bookArt.ascendantPaths,
			body: renderCatalog("Paths", "Every Job branches into Paths \u2014 focused expressions of your Awakening that shape your abilities, your combat role, and your identity.", paths, {
				context: "Path",
			}),
		}),
		section({
			id: "backgrounds",
			part: "Part 2: Creating An Ascendant",
			title: "Backgrounds",
			kicker: "Origin Records",
			summary:
				"Before the Awakening, you were someone. Your Background defines who that was \u2014 and what you carried into the Rift Age.",
			image: bookArt.ascendantBackgrounds,
			body: renderCatalog("Backgrounds", "Every Ascendant had a life before the change. Your Background is the training, the connections, and the scars you bring to the fight.", allBackgrounds, {
				folder: "backgrounds",
				context: "Background",
			}),
		}),
		section({
			id: "skills",
			part: "Part 2: Creating An Ascendant",
			title: "Skills",
			kicker: "Proficiencies",
			summary:
				"What your Ascendant knows how to do \u2014 from athletics and arcana to persuasion and stealth.",
			image: bookArt.ascendantAbilities,
			body: renderCatalog("Skills", "Skills represent broad areas of training and expertise.", comprehensiveSkills, {
					context: "Skill",
				}),
		}),
		section({
			id: "feats",
			part: "Part 2: Creating An Ascendant",
			title: "Feats",
			kicker: "Special Talents",
			summary:
				"Special talents and trained advantages that set your Ascendant apart from the rank and file.",
			image: bookArt.ascendantAbilities,
			body: renderCatalog("Feats", "You gain a feat when your Job progression allows it. They represent focused training outside your core Path.", comprehensiveFeats, {
					context: "Feat",
				}),
		}),
		section({
			id: "fighting-styles",
			part: "Part 2: Creating An Ascendant",
			title: "Fighting Styles",
			kicker: "Combat Disciplines",
			summary:
				"Combat disciplines that define how you handle yourself in a fight, from heavy weapons to dual wielding.",
			image: bookArt.ascendantAbilities,
			body: renderCatalog("Fighting Styles", "Fighting styles are specialized approaches to combat that grant specific mechanical benefits.", FIGHTING_STYLES, {
					context: "Fighting Style",
				}),
		}),
		section({
			id: "advancement",
			part: "Part 2: Creating An Ascendant",
			title: "Advancement",
			kicker: "Leveling Up",
			summary: "How your Ascendant grows stronger over time, tracking proficiency, hit dice, and Rift Favor.",
			image: bookArt.ascendantPaths,
			body: advancementTables(),
		}),
		section({
			id: "sample-builds",
			part: "Part 2: Creating An Ascendant",
			title: "Sample Builds",
			kicker: "Level 5 Archetypes",
			summary: "Three ready-to-play level 5 Ascendants: Cinder, Quill, and Deng Wei.",
			image: bookArt.ascendantBackgrounds,
			body: sampleBuildsSection(),
		}),
		section({
			id: "combat-example",
			part: "Part 2: Creating An Ascendant",
			title: "Combat Example",
			kicker: "Breach at the Annex",
			summary: "A step-by-step walkthrough of a combat encounter, showing action economy and Rift Favor in action.",
			image: bookArt.ascendantJobs,
			body: combatExampleSection(),
		}),
		section({
			id: "techniques",
			part: "Part 3: Powers And Gear",
			title: "Techniques",
			kicker: "Martial Maneuvers",
			summary:
				"Martial and tactical abilities honed through training and combat experience.",
			image: bookArt.ascendantAbilities,
			body: () =>
				splitNotice(
					"Representative Examples",
					"These entries introduce the Technique system. The complete catalog \u2014 every Technique in Rift Ascendant \u2014 is in Rift Ascendant: Awakened Arts.",
				) +
				renderCompactCatalog("Representative Techniques", "Twelve entries showing the range of the Technique system. The complete catalog is in Awakened Arts.", curatedTechSample(), {
					context: "Technique",
					kind: "ability",
				}),
		}),
		section({
			id: "powers",
			part: "Part 3: Powers And Gear",
			title: "Powers",
			kicker: "Innate Abilities",
			summary:
				"Innate abilities drawn directly from your Awakening and Job.",
			image: bookArt.ascendantAbilities,
			body: () =>
				splitNotice(
					"Representative Examples",
					"These entries introduce the Power system. The complete catalog \u2014 every Power in Rift Ascendant \u2014 is in Rift Ascendant: Awakened Arts.",
				) +
				renderCompactCatalog("Representative Powers", "Twelve entries showing the range of the Power system. The complete catalog is in Awakened Arts.", curatedPowerSample(), {
					context: "Power",
					kind: "ability",
				}),
		}),
		section({
			id: "spells",
			part: "Part 3: Powers And Gear",
			title: "Spells",
			kicker: "Structured Casting",
			summary:
				"Structured supernatural effects channeled through spell slots, components, and concentration.",
			image: bookArt.ascendantAbilities,
			body: () =>
				splitNotice(
					"Representative Examples",
					"These entries introduce the Spell system. The complete catalog \u2014 every Spell in Rift Ascendant \u2014 is in Rift Ascendant: Awakened Arts.",
				) +
				renderCompactCatalog("Representative Spells", "Twelve entries showing the range of the Spell system. The complete catalog is in Awakened Arts.", curatedSpellSample(), {
					context: "Spell",
					kind: "ability",
				}),
		}),
		section({
			id: "runes",
			part: "Part 3: Powers And Gear",
			title: "Runes",
			kicker: "Inscribed Power",
			summary:
				"Inscriptions absorbed into the soul, granting active and passive abilities to the bearer.",
			image: bookArt.ascendantRunes,
			body:
				runePrimer() +
				splitNotice(
					"Core And Vault Split",
					"This chapter covers the foundational runes for character creation and early play. Higher-rank and rarer runes are in Vaults of the Rift.",
				) +
				renderCompactCatalog("Core Runes", "Runes you can absorb during character creation and early advancement.", playerCoreRunes, {
					context: "Rune",
					kind: "rune",
				}),
		}),
		section({
			id: "sigils-tattoos",
			part: "Part 3: Powers And Gear",
			title: "Sigils And Tattoos",
			kicker: "Physical Etchings",
			summary:
				"Permanent inscriptions etched into weapons, armor, or living skin.",
			image: bookArt.ascendantRunes,
			body:
				splitNotice(
					"In Awakened Arts",
					"Sigils and Tattoos are permanent inscriptions that are part of the ability system. The complete Sigil and Tattoo catalogs \u2014 with full mechanics, slots, activation, and lore \u2014 are in Rift Ascendant: Awakened Arts.",
				),
		}),
		section({
			id: "equipment",
			part: "Part 3: Powers And Gear",
			title: "Equipment",
			kicker: "Field Inventory",
			summary:
				"Standard-issue loadouts, mundane gear, and weapons for the working Ascendant.",
			image: bookArt.ascendantGear,
			body:
				splitNotice(
					"Core And Vault Split",
					"This chapter covers base equipment and common field gear. Uncommon, rare, and legendary equipment can be found in Vaults of the Rift.",
				) +
				renderCompactCatalog("Core Equipment", "Standard-issue gear and common items available during character creation and early play.", playerCoreItems, {
					context: "Item",
					kind: "item",
				}),
		}),
		section({
			id: "relics-artifacts",
			part: "Part 3: Powers And Gear",
			title: "Relics And Artifacts",
			kicker: "Legendary Items",
			summary:
				"Unique items of immense power that bend reality and paint a target on your back.",
			image: bookArt.ascendantGear,
			body:
				splitNotice(
					"In Vaults of the Rift",
					"Relics and Artifacts are high-power Rift-origin objects with world-changing mechanics. The complete Relic and Artifact catalogs \u2014 with full stats, lore, activation, and risk profiles \u2014 are in Rift Ascendant: Vaults of the Rift.",
				),
		}),
		section({
			id: "vehicles",
			part: "Part 3: Powers And Gear",
			title: "Vehicles And Mounts",
			kicker: "Transportation",
			summary:
				"Everything that carries you into danger \u2014 from armored transports to bonded Rift creatures.",
			image: bookArt.ascendantGear,
			body:
				splitNotice(
					"In Vaults of the Rift",
					"Vehicles and Mounts are covered in full in Rift Ascendant: Vaults of the Rift, alongside expanded equipment, relics, artifacts, and treasure tables.",
				),
		}),
		section({
			id: "conditions",
			part: "Appendices",
			title: "Conditions",
			kicker: "Reference",
			summary:
				"Status effects, afflictions, and environmental hazards \u2014 what they do and how to end them.",
			image: bookArt.ascendantWorld,
			body: conditionsQuickRef(),
		}),
		section({
			id: "player-index",
			part: "Appendices",
			title: "Player Index",
			kicker: "Reference",
			summary:
				"Alphabetical index of everything in the Ascendant Guide.",
			image: bookArt.ascendantWorld,
			body: renderReferenceIndex("Ascendant Guide Index", {
					Jobs: jobs,
					Paths: paths,
					Backgrounds: allBackgrounds,
					Skills: comprehensiveSkills,
					Feats: comprehensiveFeats,
					"Fighting Styles": FIGHTING_STYLES,
					Techniques: techniques,
					Powers: powers,
					Spells: spells,
					"Core Runes": playerCoreRunes,
					Sigils: sigils,
					Tattoos: tattoos,
					"Core Equipment": playerCoreItems,
					Relics: comprehensiveRelics,
					Artifacts: artifacts,
					Vehicles: allVehicles,
					Conditions: conditions,
				}),
		}),
	];
	return {
		slug: "ascendant",
		title: "Rift Ascendant \u2014 Ascendant Guide",
		subtitle:
			"Everything you need to awaken, survive, and fight back.",
		classification: "Core Rulebook",
		tagline: "The Rifts opened. You changed. Now fight.",
		outputBase: "Rift Ascendant - Ascendant Guide",
		coverImage: bookArt.ascendantCover,
		sections,
		requiredPageTarget: true,
	};
}

function buildWardenBook(): BookDefinition {
	const sections: BookSection[] = [
		section({
			id: "session-zero",
			part: "Part 1: Warden Operations",
			title: "Session Zero",
			kicker: "Alignment",
			summary: "Setting expectations, choosing a campaign frame, and establishing safety tools.",
			image: bookArt.wardenProcedures,
			body: sessionZeroGuide(),
		}),
		section({
			id: "safety-tools",
			part: "Part 1: Warden Operations",
			title: "Safety Tools",
			kicker: "Table Management",
			summary: "Lines, Veils, and the X-Card for managing Rift Ascendant's horror and trauma themes.",
			image: bookArt.wardenProcedures,
			body: wardenSafetyTools(),
		}),
		section({
			id: "campaign-frames",
			part: "Part 1: Warden Operations",
			title: "Campaign Frames",
			kicker: "Structure",
			summary: "Three structures for your RA campaign: Guild Contractors, Bureau Sentinels, or Apex Legends.",
			image: bookArt.wardenOperations,
			body: campaignFrameGuide(),
		}),
		section({
			id: "warden-procedures",
			part: "Part 1: Warden Operations",
			title: "Running Rift Ascendant",
			kicker: "Warden Operations",
			summary:
				"How to frame danger, run encounters, track pressure, and let your players choose how deep to go.",
			image: bookArt.wardenProcedures,
			body: () => wardenRulesPrimer(),
		}),
		section({
			id: "pressure-clocks",
			part: "Part 1: Warden Operations",
			title: "Pressure Clocks And Scene Control",
			kicker: "Visible Consequences",
			summary:
				"Visible countdown clocks for containment failures, anomaly hunts, civilian danger, Rift collapses, and faction heat.",
			image: bookArt.wardenCover,
			body: () => wardenClockToolkit(),
		}),
		section({
			id: "scenario-frameworks",
			part: "Part 1: Warden Operations",
			title: "Scenario Frameworks",
			kicker: "Session Architecture",
			summary:
				"RA scenario frames for contracts, breaches, Guild races, Regent traces, and dangerous Relic choices.",
			image: bookArt.wardenRift,
			body: () => wardenScenarioFrameworks(),
		}),
		section({
			id: "rift-hazards-domains",
			part: "Part 1: Warden Operations",
			title: "Rift Hazards And Domains",
			kicker: "Domain Systems",
			summary:
				"RA-specific Rift themes, biomes, hazards, complications, pressure states, and Domain construction procedures.",
			image: bookArt.wardenRift,
			body: () => riftHazardGuide(),
		}),
		section({
			id: "bureau-afa-guilds",
			part: "Part 1: Warden Operations",
			title: "Bureau, AFA, And Guild Operations",
			kicker: "Living World Procedures",
			summary:
				"Procedures for licenses, contracts, faction heat, media exposure, containment clocks, and public consequences.",
			image: bookArt.wardenOperations,
			body: () => wardenOperationsGuide(),
		}),
		section({
			id: "adjudication-rulings",
			part: "Part 1: Warden Operations",
			title: "Adjudication Rulings",
			kicker: "Table Authority",
			summary:
				"DC guidance, forward consequences, rules priority, and Warden rulings for uncertain RA scenes.",
			image: bookArt.wardenOperations,
			body: () => wardenAdjudicationGuide(),
		}),
		section({
			id: "aftermath-living-world",
			part: "Part 1: Warden Operations",
			title: "Aftermath And Living World",
			kicker: "World Consequences",
			summary:
				"Procedures for audits, public exposure, Guild claims, Rift scars, world-state rewards, and future hooks.",
			image: bookArt.wardenWorld,
			body: () => wardenWorldConsequences(),
		}),
		section({
			id: "downtime",
			part: "Part 1: Warden Operations",
			title: "Downtime Activities",
			kicker: "Between Operations",
			summary: "What Ascendants do when the Rift is closed: research, recovery, and Bureau maintenance.",
			image: bookArt.wardenWorld,
			body: downtimeActivities(),
		}),
		section({
			id: "world-directory",
			part: "Part 2: The Rift Age World",
			title: "World Directory",
			kicker: "Bureau Atlas",
			summary:
				"All canonical locations with rank, hazards, encounters, treasures, and geography fields.",
			image: bookArt.wardenWorld,
			body: () =>
				proseBlock(riftWorldLore()) +
				renderCatalog("Location Field Dossiers", "Canonical Rift Ascendant sites, hazards, encounters, treasures, and world hooks.", locations, {
					context: "Location",
				}),
		}),
		section({
			id: "regents-pantheon",
			part: "Part 2: The Rift Age World",
			title: "Regents And Pantheon",
			kicker: "Authority Signatures",
			summary:
				"All Regents, pantheon records, gestalt mechanics, class features, requirements, and lore.",
			image: bookArt.wardenRegents,
			body: () =>
				renderCatalog("Regents", "Regent class overlays, authority records, requirements, and lore.", regents, {
					context: "Regent",
					folder: "regents",
					classified: true,
				}) +
				renderCatalog("Pantheon", "Eternals, Exarchs, portfolios, dogma, and relationships.", PRIME_PANTHEON, {
					context: "Pantheon",
					classified: true,
				}),
		}),
		section({
			id: "encounter-anomaly-design",
			part: "Part 3: Encounters And Rewards",
			title: "Encounter And Anomaly Design",
			kicker: "Threat Design",
			summary:
				"Encounter budgets, threat roles, rank adjustment, sample stat blocks, and guidance for using the Anomaly Manual.",
			image: bookArt.wardenAnomaly,
			body: () =>
				anomalyDesignPrimer() +
				splitNotice(
					"Full Catalog Location",
					"The Warden Guide explains how to build and run anomaly encounters. The complete anomaly catalog is printed in Rift Ascendant - Anomaly Manual.",
				) +
				renderCatalog("Sample Anomalies By Rank", "One reference anomaly per rank for Warden-side calibration.", sampleAnomalies(), {
					folder: "anomalies",
					context: "Sample Anomaly",
					anomaly: true,
				}),
		}),
		section({
			id: "warden-contract-seeds",
			part: "Part 3: Encounters And Rewards",
			title: "Warden Contract Seeds",
			kicker: "Session Starters",
			summary:
				"Canon-derived contract starters pairing RA locations, anomaly ranks, pressure clocks, complications, and reward signals.",
			image: bookArt.wardenWorld,
			body: () => wardenContractSeeds(),
		}),
		section({
			id: "threat-rosters",
			part: "Part 3: Encounters And Rewards",
			title: "Threat Rosters",
			kicker: "Rank Indexes",
			summary:
				"Rank-by-rank compact rosters of canon anomalies for Warden planning, with full stat blocks reserved for the Anomaly Manual.",
			image: bookArt.wardenAnomaly,
			body: () => wardenThreatRoster(),
		}),
		section({
			id: "rewards-tables-conditions",
			part: "Part 3: Encounters And Rewards",
			title: "Rewards, Tables, And Conditions",
			kicker: "Warden Reference",
			summary:
				"Reward procedures, rank-banded treasure tables, condition adjudication, and Warden lookup tools.",
			image: bookArt.wardenRewards,
			body: () =>
				wardenRewardGuide() +
				renderCatalog("Conditions", "Condition system reference for adjudication.", conditions, {
					context: "Condition",
				}),
		}),
		section({
			id: "warden-appendices",
			part: "Appendices",
			title: "Warden Reference Appendices",
			kicker: "Canon Dossiers",
			summary:
				"Full Warden-facing appendices for location, Regent, pantheon, condition, and rollable-table lookup.",
			image: bookArt.wardenCover,
			body: () => wardenFullReferenceAppendices(),
		}),
		section({
			id: "warden-index",
			part: "Appendices",
			title: "Warden Index",
			kicker: "Reference",
			summary:
				"Generated alphabetical references for Warden lookup.",
			image: bookArt.wardenRift,
			body: () => renderReferenceIndex("Warden Guide Index", {
				Locations: locations,
				Regents: regents,
				Pantheon: PRIME_PANTHEON,
				"Rollable Tables": rollableTables,
				Conditions: conditions,
			}),
		}),
	];
	return {
		slug: "warden",
		title: "Rift Ascendant \u2014 Warden Guide",
		subtitle:
			"Everything the Warden needs to run the Rift Age: hazards, factions, encounter math, Domain pressure, and world operations.",
		classification: "Warden\u2019s Manual",
		tagline: "Control the Domains. Escalate the pressure. Run the Rift Age.",
		outputBase: "Rift Ascendant - Warden Guide",
		coverImage: bookArt.wardenCover,
		sections,
		minimumPageTarget: 250,
	};
}

function vaultsGearDepthGuide() {
	return proseBlock(`
### Gear Rarity and Legality
In the Rift Age, gear rarity is not just a measure of drop chance—it represents Bureau legal classification. 
* **Common:** Unrestricted. Can be purchased at any sporting goods or surplus store.
* **Uncommon:** Restricted. Requires a Class-C Ascendant License to purchase legally. Includes basic Essence-reinforced armor and weaponry.
* **Rare:** Heavily Restricted. Requires a Class-B License and Guild sponsorship. Includes military-grade anomalous tech.
* **Epic / Legendary:** Illegal for civilian or independent ownership. Classified as Bureau property or high-threat Relics. Possession without a Class-A / Directorate Zero exemption carries a mandatory quarantine sentence.

### The Black Market
Ascendants operating without Bureau licenses must rely on the black market to acquire Uncommon or Rare gear. Prices on the black market are typically 200–300% higher than the Bureau-subsidized Guild rates, and the equipment often comes with compromised durability or tracking enchantments meant for previous owners.

### Attunement and Essence Saturation
An Ascendant can safely attune to a maximum of three Essence-bearing items (Relics, advanced armor, specific weapons). Attempting to attune to a fourth item causes *Essence Saturation*. The Ascendant takes severe psychic damage, and all currently attuned items forcefully break attunement, often damaging the items in the process.

### Destruction in the Rift
When a character dies inside a Rift, or if an item is left behind when a Rift collapses, the gear is subjected to extreme metaphysical pressure. Non-anomalous gear is instantly annihilated. Anomalous gear (Uncommon and above) has a 50% chance to survive but will be violently ejected into the material world when the Rift closes, often miles away from the original entry point.
	`);
}

function vaultsRelicCampaignNotes() {
	return proseBlock(`
### Introducing Relics to the Campaign
Relics are not mere treasure; they are plot devices. A Relic should never be found sitting quietly in a chest. They are the focal points of conflict, the goals of Guild contracts, or the dangerous burdens thrust upon the players. Below are campaign integration notes for notable Relics.

#### The Aegis of the First Warden (Legendary Shield)
* **History:** Wielded by the founder of the Bureau during the Tokyo S-Rank Event. Lost when they were swallowed by a Domain.
* **Known Owners:** Currently missing. Rumored to be held by a rogue faction of the AFA.
* **Bureau Status:** Code Red retrieval. The Bureau will execute any independent Ascendant found possessing it.
* **Introduction:** The players are hired to raid an AFA safehouse. They expect to find stolen Essence reserves, but instead find the Aegis hooked up to a massive jury-rigged generator, keeping a localized Rift from expanding.

#### The Whisper Blade (Rare Dagger)
* **History:** Forged from the crystallized vocal cords of a Rank-B telepathic Anomaly.
* **Known Owners:** A notorious Guild assassin known only as "Vex" (Quicksilver).
* **Bureau Status:** Unregistered.
* **Introduction:** The players find the dagger embedded in the chest of a Bureau informant. Pulling it out triggers a telepathic recording of the assassin's final conversation with the victim, pointing the players toward a larger conspiracy.

#### The Chronos Engine (Artifact)
* **History:** A mechanized heart recovered from a Rank-A temporal Anomaly. It allows localized time reversal but ages the user aggressively.
* **Known Owners:** Kept in Directorate Zero's deepest vault.
* **Bureau Status:** Classified Level 1.
* **Introduction:** The players are caught in a temporal loop during a botched Rift clear. They realize a desperate Bureau agent used a shard of the Chronos Engine to try and save their squad, and the players must find the agent to break the loop.
	`);
}

function vaultsLootGeneration() {
	return proseBlock(`
### Reward Parcels by Rank
Unlike traditional dungeon crawls, Ascendants are paid via Guild contracts and salvage rights. The Warden should use the following guidelines to generate reward parcels for clearing a Rift or completing a major operation.

#### Rank-D Operations
* **Payout:** 1,000 to 2,500 Credits per Ascendant.
* **Salvage:** 1d4 Common items, 10% chance of a single Uncommon item.
* **Intangibles:** Minor favor with a local Guild branch or a low-level Bureau contact.

#### Rank-C Operations
* **Payout:** 5,000 to 10,000 Credits per Ascendant.
* **Salvage:** 2d4 Common items, 1d4 Uncommon items, 25% chance of a single Rare item.
* **Intangibles:** A piece of actionable intelligence on a rival faction, or a Class-C License fast-track.

#### Rank-B Operations
* **Payout:** 25,000 to 50,000 Credits per Ascendant.
* **Salvage:** 1d4 Uncommon items, 1d2 Rare items, 10% chance of a single Epic item or minor Relic.
* **Intangibles:** A major favor from a Guild CEO, or access to restricted Bureau archives.

#### Rank-A Operations
* **Payout:** 100,000+ Credits per Ascendant (often paid in corporate stock or real estate).
* **Salvage:** 1d4 Rare items, 1d2 Epic items, 50% chance of a Legendary item or major Relic.
* **Intangibles:** Directorate Zero attention, a seat on a Guild board, or an audience with an Eternal.

### Substituting Salvage
Not all rewards must be physical. Wardens are encouraged to substitute rolled salvage for intangible rewards of equivalent value. For example, instead of a Rare item, the players might receive the security codes to a rival Guild's Essence refinery, or a pardon for a previous crime from a Bureau Director.
	`);
}

function buildVaultsBook(): BookDefinition {
	const expandedRunes = vaultRunes();
	const expandedItems = vaultItems();
	const sections: BookSection[] = [
		section({
			id: "using-the-vaults",
			part: "Part 1: Vault Rules",
			title: "Using Vaults Of The Rift",
			kicker: "Expanded Player Options",
			summary:
				"Rules for using expanded runes, uncommon equipment, rare field gear, Relics, artifacts, and treasure without overloading the core Ascendant Guide.",
			image: bookArt.vaultsCover,
			body: () =>
				splitNotice(
					"Supplement Scope",
					"This book holds the higher-rarity and higher-rank player-facing catalogs that are real RA content but too large for the core Ascendant Guide.",
				) +
				runePrimer() +
				wardenRewardGuide(),
		}),
		section({
			id: "gear-depth-guide",
			part: "Part 1: Vault Rules",
			title: "Gear Rarity and Legality",
			kicker: "The Economy of Equipment",
			summary:
				"Bureau classification, black market pricing, attunement saturation, and Rift destruction rules.",
			image: bookArt.vaultsItems,
			body: () => vaultsGearDepthGuide(),
		}),
		section({
			id: "expanded-runes",
			part: "Part 2: Rune Vault",
			title: "Expanded Runes",
			kicker: "Learning Runes",
			summary:
				"Higher-rank and rarer learning runes for spells, powers, and techniques.",
			image: bookArt.vaultsRunes,
			body: () =>
				renderCompactCatalog("Expanded Runes", "Non-core learning runes split out from the Ascendant Guide.", expandedRunes, {
					context: "Expanded Rune",
					kind: "rune",
				}),
		}),
		section({
			id: "expanded-items",
			part: "Part 3: Item Vault",
			title: "Expanded Equipment And Items",
			kicker: "Field Inventory",
			summary:
				"Uncommon, rare, epic, and legendary equipment, consumables, tools, weapons, armor, rings, amulets, foci, and scrolls.",
			image: bookArt.vaultsItems,
			body: () =>
				renderCompactCatalog("Expanded Equipment And Items", "Non-core item catalog split out from the Ascendant Guide.", expandedItems, {
					context: "Expanded Item",
					kind: "item",
				}),
		}),
		section({
			id: "relics",
			part: "Part 4: Relics And Artifacts",
			title: "Relics",
			kicker: "Rift Treasure",
			summary:
				"Named Relics, activation rules, limitations, rarity, lore, and mechanics.",
			image: bookArt.vaultsRelics,
			body: () => renderCatalog("Relics", "Named high-power Rift artifacts and their mechanics.", comprehensiveRelics, {
					folder: "relics",
					context: "Relic",
				}),
		}),
		section({
			id: "artifacts",
			part: "Part 4: Relics And Artifacts",
			title: "Artifacts",
			kicker: "World-Shaping Power",
			summary:
				"Major artifact records presented as table-facing references.",
			image: bookArt.vaultsRelics,
			body: () => renderCatalog("Artifacts", "The most dangerous objects in the Rift Age.", artifacts, {
					folder: "artifacts",
					context: "Artifact",
				}),
		}),
		section({
			id: "relic-campaign-notes",
			part: "Part 4: Relics And Artifacts",
			title: "Relic Campaign Notes",
			kicker: "Warden Guidance",
			summary:
				"How to introduce Relics to a campaign, and histories of notable items.",
			image: bookArt.vaultsRelics,
			body: () => vaultsRelicCampaignNotes(),
		}),
		section({
			id: "loot-generation",
			part: "Part 5: Rewards",
			title: "Generating Loot",
			kicker: "Warden Procedures",
			summary:
				"Reward parcels by Rank, including payouts, salvage, and intangible rewards.",
			image: bookArt.wardenOperations,
			body: () => vaultsLootGeneration(),
		}),
		section({
			id: "vehicles-mounts",
			part: "Part 4: Vehicles and Mounts",
			title: "Vehicles and Mounts",
			kicker: "Field Transportation",
			summary:
				"Armored transports, bonded Rift creatures, civilian vehicles, and everything else that carries Ascendants into danger.",
			image: bookArt.vaultsItems,
			body: () =>
				renderCatalog("Vehicles And Mounts", "Vehicles, transports, and mounts for field operations in the Rift Age.", allVehicles, {
					context: "Vehicle",
				}),
		}),
		section({
			id: "vault-index",
			part: "Appendices",
			title: "Vault Index",
			kicker: "Reference",
			summary:
				"Generated alphabetical references for expanded player-facing treasure and rune lookup.",
			image: bookArt.ascendantWorld,
			body: () => renderReferenceIndex("Vaults Of The Rift Index", {
				"Expanded Runes": expandedRunes,
				"Expanded Items": expandedItems,
				Relics: comprehensiveRelics,
				Artifacts: artifacts,
			}),
		}),
	];
	return {
		slug: "vaults",
		title: "Rift Ascendant \u2014 Vaults of the Rift",
		subtitle: "Expanded items, rare equipment, and world-shaping artifacts that are too dangerous for standard issue.",
		classification: "Player Expansion",
		tagline: "Power has a price. These are the things worth paying for.",
		outputBase: "Rift Ascendant - Vaults of the Rift",
		coverImage: bookArt.vaultsCover,
		sections,
		requiredPageTarget: false,
	};
}

function anomalyManualBeginning() {
	return proseBlock(`
### The Nature of the Enemy
Anomalies are not animals. They do not possess a traditional biological imperative—they do not need to eat to survive, they do not reproduce, and they do not sleep. They are manifestations of raw, chaotic Essence given form by the metaphysical pressure of the Rift. 

When an Anomaly crosses into our world, it is actively resisting Earth's physics. Their physical forms often glitch, shudder, or warp reality around them. Their singular, unified drive is to expand the Rift that birthed them, terraforming Earth's atmosphere into an environment saturated with lethal levels of Essence.
	`);
}

function anomalyRankBandTable() {
	return proseBlock(`
### Rank Scaling Guide
The following table provides baseline statistics for Anomalies across the Rank spectrum. Wardens can use these numbers to quickly generate custom threats.

| Rank | Target Player Level | Base AC | Avg HP | Damage Output / Turn |
|:---:|:---:|:---:|:---:|:---:|
| **F/E** | 1–3 | 12 | 25 | 1d6 + 2 (5) |
| **D** | 4–6 | 14 | 60 | 2d6 + 4 (11) |
| **C** | 7–10 | 16 | 120 | 3d8 + 5 (18) |
| **B** | 11–14 | 18 | 200 | 4d10 + 6 (28) |
| **A** | 15–18 | 20 | 350 | 6d12 + 8 (47) |
| **S** | 19–20 | 22+ | 500+ | 8d12 + 10 (62+) |
	`);
}

function anomalyVariantTemplates() {
	return proseBlock(`
### Variant Templates
To keep encounters unpredictable, a Warden can apply the following quick-templates to any base Anomaly.

#### 1. Elite (The Apex)
* **Mechanics:** Double maximum HP. Add +2 to AC and Attack Rolls. The Anomaly gains one additional action per turn.
* **Lore:** This Anomaly has successfully consumed the Essence of an Ascendant, causing a rapid, violent evolution.

#### 2. Corrupted (The Rotting)
* **Mechanics:** Reduce movement speed by 10 ft. All melee attacks deal an additional 1d6 necrotic damage. Upon death, the Anomaly violently detonates in a 15-foot radius (DC 14 Dexterity save or take 3d6 necrotic damage).
* **Lore:** The Anomaly's internal Essence core has destabilized. It is dying, but highly volatile.

#### 3. Rift-Touched (The Phasing)
* **Mechanics:** The Anomaly gains a teleport speed of 30 feet. Ranged attacks against it have disadvantage.
* **Lore:** The Anomaly exists partially within the Rift and partially in the material world, glitching in and out of reality.
	`);
}

function noncombatAnomalies() {
	return proseBlock(`
### Non-Combat Anomalies
Not every Anomaly is a combat threat. The Rift frequently produces entities that are bizarre, unsettling, but ultimately pacifistic.

#### The Echo
A humanoid figure made of static and ash. It wanders aimlessly through ruined quarantine zones. If approached, it does not attack, but simply repeats the final, desperate words of the last person who died within 100 feet of it.

#### The Architect
A massive, multi-limbed construct of floating geometric shapes. It ignores humans entirely. Its sole purpose is to build impossible, M.C. Escher-style structures out of local materials (cars, asphalt, rebar) to expand the metaphysical footprint of a Domain. 

#### The Observer
A floating, crystalline eye the size of a minivan. It appears in the sky above major Guild conflicts or S-Rank events. It records the carnage, vibrating softly, and simply folds itself out of reality if any Ascendant attempts to attack it.
	`);
}

function anomalyHarvestingGuide() {
	return proseBlock(`
### Harvesting Essence
When an Anomaly is killed, its physical form begins to rapidly sublimate back into raw energy. Ascendants have a brief window to harvest its crystallized Essence core.

#### The Procedure
* **Time:** 1 minute of uninterrupted work.
* **Tools:** A Bureau-certified Harvesting Kit (hazmat gauntlets, core-stabilizers, extraction forceps).
* **The Check:** The harvester makes a DC 15 Intelligence (Medicine or Survival) check. 

#### Outcomes
* **Success:** The core is safely extracted and placed into a stabilization flask. It can be sold or used for crafting.
* **Failure:** The core degrades before extraction, sublimating into useless ash.
* **Critical Failure:** The harvester punctures the core's containment shell. The core triggers an *Essence Detonation*, dealing force damage equal to the Anomaly's average damage output to everyone within 10 feet, and the core is destroyed.
	`);
}

function buildAnomalyManual(): BookDefinition {
	const anomalyCatalog = generalAnomalies();
	const shadowCatalog = generalShadowSoldiers();
	const sections: BookSection[] = [
		section({
			id: "using-the-manual",
			part: "Part 1: Threat Procedures",
			title: "Using The Anomaly Manual",
			kicker: "Monster Manual",
			summary:
				"How to read a stat block, scale threats by rank, assign encounter roles, and place rewards.",
			image: bookArt.anomalyUsing,
			body: () =>
				anomalyDesignPrimer() +
				splitNotice(
					"Warden Guide Relationship",
					"The Warden Guide explains how to run encounters and Domains. This book is the complete stat-block catalog.",
				),
		}),
		section({
			id: "anomaly-nature",
			part: "Part 1: Threat Procedures",
			title: "The Nature of the Enemy",
			kicker: "Lore and Ecology",
			summary:
				"How Anomalies interact with Earth physics and their biological imperatives.",
			image: bookArt.anomalyCatalog,
			body: () => anomalyManualBeginning(),
		}),
		section({
			id: "anomaly-scaling",
			part: "Part 1: Threat Procedures",
			title: "Rank Scaling Table",
			kicker: "Warden Tools",
			summary:
				"Baseline statistics for Anomalies across all ranks for custom threat generation.",
			image: bookArt.wardenOperations,
			body: () => anomalyRankBandTable(),
		}),
		section({
			id: "anomaly-catalog",
			part: "Part 2: Anomaly Catalog",
			title: "Anomaly Catalog",
			kicker: "Threat Stat Blocks",
			summary:
				"Every creature that crawled out of the Rift, with full stat blocks, actions, traits, and ecology.",
			image: bookArt.anomalyCatalog,
			body: () =>
				renderCatalog("Anomalies", "The things that came through the Rifts. Each entry is a complete combat-ready stat block.", anomalyCatalog, {
					folder: "anomalies",
					context: "Anomaly",
					anomaly: true,
				}),
		}),
		section({
			id: "shadow-soldiers",
			part: "Part 3: Shadow Forces",
			title: "Shadow Soldiers",
			kicker: "Summoned Threats",
			summary:
				"Summoned entities and corrupted operatives that serve as muscle for the Rift\u2019s darker forces.",
			image: bookArt.anomalyShadow,
			body: () =>
				renderCatalog("Shadow Soldiers", "Summoned threats and corrupted operatives bound to the Rift\u2019s will.", shadowCatalog, {
					context: "Shadow Soldier",
					anomaly: true,
				}),
		}),
		section({
			id: "variant-templates",
			part: "Appendices",
			title: "Variant Templates",
			kicker: "Warden Tools",
			summary:
				"Quick-apply templates (Elite, Corrupted, Rift-Touched) to modify encounters on the fly.",
			image: bookArt.anomalyCatalog,
			body: () => anomalyVariantTemplates(),
		}),
		section({
			id: "noncombat-anomalies",
			part: "Appendices",
			title: "Non-Combat Anomalies",
			kicker: "Lore and Encounter",
			summary:
				"Examples of pacifistic or bizarre Anomalies that serve as environmental storytelling.",
			image: bookArt.wardenWorld,
			body: () => noncombatAnomalies(),
		}),
		section({
			id: "harvesting-guide",
			part: "Appendices",
			title: "Essence Harvesting Guide",
			kicker: "Warden Procedures",
			summary:
				"Rules, checks, and consequences for extracting Essence cores from slain Anomalies.",
			image: bookArt.vaultsItems,
			body: () => anomalyHarvestingGuide(),
		}),
		section({
			id: "anomaly-index",
			part: "Appendices",
			title: "Anomaly Index",
			kicker: "Reference",
			summary:
				"Alphabetical quick-reference index for every creature in this book.",
			image: bookArt.anomalyCatalog,
			body: () => renderReferenceIndex("Anomaly Manual Index", {
				Anomalies: anomalyCatalog,
				"Shadow Soldiers": shadowCatalog,
			}),
		}),
	];
	return {
		slug: "anomaly-manual",
		title: "Rift Ascendant \u2014 Anomaly Manual",
		subtitle: "Complete table-facing stat blocks for every threat, shadow, and Anomaly in the Rift Age.",
		classification: "Threat Catalog",
		tagline: "Every nightmare that crawled out of the Rift.",
		outputBase: "Rift Ascendant - Anomaly Manual",
		coverImage: bookArt.anomalyCover,
		sections,
		requiredPageTarget: false,
	};
}

function worldbookTimeline() {
	return proseBlock(`
### Year 0: The First Ruptures
The world didn't end in fire, but in a localized collapse of physics. The first Rifts opened simultaneously across three major urban centers. Initial military responses failed entirely against Rank-B Anomalies, leading to widespread quarantine zones. The first human Awakenings occurred among survivors trapped inside these inaugural Rifts, marking the beginning of the Ascendant era.

### Years 1–3: Bureau Expansion and the First Generation
As Rift occurrences stabilized into a global, unpredictable weather pattern, international governments formed the Bureau of Ascendant Regulation (BAR). The "First Generation" of Ascendants were largely drafted into government service. Containment protocols were established, and the first rudimentary Essence-tracking technology was deployed to predict Rift formations before they fully manifested.

### Year 5: The Guild Formation Act
Recognizing that government forces alone could not contain the growing frequency of Rifts, the Bureau passed the Guild Formation Act. This allowed private military corporations and licensed Ascendant collectives to bid on "Rift Clear" contracts. This created the modern mercenary economy of the Rift Age, giving rise to the major Guilds that now dominate global politics.

### Year 8: The Tokyo S-Rank Event
The first confirmed S-Rank Anomaly emerged, shattering a major metropolitan containment zone. The event proved that high-ranking Anomalies possessed near-divine intelligence and reality-warping capabilities. The disaster necessitated the formation of Directorate Zero and established the grim reality that some Rifts cannot be cleared—only contained at massive human cost.

### Year 12: Relic Economy Formalized
With the influx of anomalous objects recovered from cleared Rifts, the Bureau formally classified Relics and established the attunement registry. The black market for unregistered Relics exploded almost immediately, leading to the creation of specialized Bureau enforcement divisions designed solely to hunt down illegal Relic smugglers and rogue artificers.

### Present Day: The Razor's Edge
Society has adapted to the apocalypse. Rift sirens are as common as tornado warnings. The Guilds wield as much power as sovereign nations, and Ascendants are treated as equal parts celebrity, living weapon, and ticking time bomb. The world teeters on the edge of a fundamental shift as rumors of Domains expanding beyond their containment perimeters begin to circulate in the underworld.
	`);
}

function worldbookEverydayLife() {
	return proseBlock(`
### A World Adjusted to Monsters
To the average civilian, the Rift Age is characterized by constant, low-level anxiety punctuated by moments of sheer terror. Smart phones come pre-installed with government-mandated Rift Alert applications that sound piercing sirens when Essence density spikes in a neighborhood. Public transportation routes are frequently detoured around newly established C-Rank containment zones, treating reality-tearing portals like municipal construction projects.

### Bureau Checkpoints and Civil Liberties
Travel between city districts often requires passing through Bureau Essence-Scanners. These checkpoints are designed to detect unauthorized Relics or unregistered Ascendants. For ordinary citizens, it's a minor inconvenience; for those with low-level Awakenings trying to avoid the Bureau registry, it is a constant threat of incarceration.

### The Cost of Living
Insurance premiums in the Rift Age are astronomical. "Anomalous Event Coverage" is a luxury most cannot afford, leaving millions ruined when a Rift destroys their home. Conversely, the economy booming around Guild support—medic, equipment repair, hazard-waste disposal—provides lucrative, albeit dangerous, employment for the working class. 

### Childhood and Awakening Screening
Every child undergoes mandatory Awakening screening at ages 7, 12, and 16. The tests measure baseline Essence absorption. A positive result is a life-altering event: the child is immediately registered with the Bureau, subjected to strict monitoring, and aggressively scouted by Guild recruiters promising wealth and glory. 

### Ascendant Culture and Media
Ascendants are the ultimate celebrities of the modern age. Top-tier Guild leaders have PR teams, endorsement deals, and reality feeds broadcast from their combat visors during Rift Clears. This glamorization masks the staggering mortality rate of the profession and the psychological toll of fighting cosmic horrors for corporate sponsors.
	`);
}

function worldbookEssenceIndustry() {
	return proseBlock(`
### The New Oil
Essence is the foundational resource of the Rift Age economy. It is the raw, crystallized energy harvested from the bodies of slain Anomalies and the collapsing cores of cleared Rifts. Its applications range from powering advanced Bureau technology to fueling the supernatural abilities of Relics.

### Measurement and Bureau Standards
The Bureau tightly controls the legal Essence market, measuring it in "Crystallized Thaumic Units" (CTUs). Only licensed Guilds and Bureau operatives are legally permitted to harvest Essence. The extraction process requires specialized hazmat gear and rigorous stabilization protocols, as raw Essence is highly volatile and psychically corrosive to un-Awakened humans.

### Industrial Applications
Refined Essence has revolutionized material science and medicine. High-grade Essence is used to forge the specialized alloys required for Warden weaponry and Ascendant armor. In the medical field, micro-doses of stabilized Essence can accelerate cellular regeneration, though the long-term side effects on the human genome remain highly classified.

### The Black Market and "Splicing"
A massive underground economy thrives on unregistered Essence. Black market alchemists create "Splice," a highly illegal street drug made from cut Essence that grants un-Awakened individuals temporary, erratic supernatural abilities. Splice addiction is rampant in the quarantine slums, often resulting in fatal physical mutations or spontaneous, uncontrolled localized phenomena.
	`);
}

function worldbookCampaignSeeds() {
	return proseBlock(`
### 1. The Expanding Domain
**Act 1:** A localized C-Rank Rift in the city's industrial district fails to collapse after its apex Anomaly is killed. Instead, it stabilizes into a Domain. The Bureau quarantines the area, but the Domain's borders begin expanding by one city block per week.
**Act 2:** The players are hired by a desperate Guild to enter the Domain and find its true "Heart." Inside, they discover the physical laws of the industrial park have rewritten themselves into a rusted, mechanized nightmare. 
**Act 3:** The Heart is revealed to be a First-Generation Ascendant who was presumed dead, their soul now acting as the anchor for the Domain. The players must decide whether to execute a hero or let the Domain consume the district.

### 2. The Sentient Relic
**Act 1:** The players intercept a black market shipment and recover an unregistered Class-A Relic—a seemingly mundane pocket watch. The watch begins communicating telepathically with the party's primary caster, offering tactical advice that proves flawlessly accurate.
**Act 2:** Bureau Directorate Zero agents begin a ruthless city-wide manhunt for the watch. The watch reveals that it is not an object, but the crystallized consciousness of a Regent trying to resurrect itself.
**Act 3:** A rival Guild attacks the party's safehouse. The players must choose to surrender the watch to the Bureau (ensuring its weaponization), destroy it (losing their tactical advantage and angering the Regent's cult), or forge a dangerous pact with the entity inside.

### 3. Guild Civil War
**Act 1:** A massive B-Rank Rift opens directly over a neutral zone between two rival corporate Guilds. Both claim salvage rights. The players are caught in the crossfire as the Guilds begin fighting each other instead of the Anomalies pouring from the Rift.
**Act 2:** The Bureau threatens to revoke both Guilds' charters, creating a power vacuum. The players are hired as neutral arbiters to extract a VIP trapped inside the warzone before the Bureau authorizes a blanket saturation strike.
**Act 3:** The players discover the Rift was artificially triggered by one of the Guilds to bankrupt the other. They possess the proof, making them the most hunted team in the city by both the guilty corporation and the Bureau's cleanup crews.
	`);
}

function buildWorldbookBook(): BookDefinition {
	const worldLoreText = riftWorldLore();
	const locationCatalog = (locations as EntryRecord[]).filter(
		(loc) => !isCampaignScopedEntry(loc),
	);
	const regentCatalog = regents as EntryRecord[];
	const pantheonCatalog = PRIME_PANTHEON as EntryRecord[];
	const sections: BookSection[] = [
		section({
			id: "the-rift-age",
			part: "Part 1: The World",
			title: "The Rift Age",
			kicker: "Setting Overview",
			summary:
				"What happened, what changed, and what the world looks like now.",
			image: bookArt.wardenWorld,
			body: () => proseBlock(worldLoreText),
		}),
		section({
			id: "worldbook-timeline",
			part: "Part 1: The World",
			title: "Timeline of the Rift Age",
			kicker: "History",
			summary: "From Year 0 to the Present Day.",
			image: bookArt.wardenOperations,
			body: () => worldbookTimeline(),
		}),
		section({
			id: "worldbook-everyday-life",
			part: "Part 1: The World",
			title: "Everyday Life in the Rift Age",
			kicker: "Society",
			summary: "Civilian life, Bureau checkpoints, and Ascendant culture.",
			image: bookArt.vaultsRelics,
			body: () => worldbookEverydayLife(),
		}),
		section({
			id: "worldbook-essence-industry",
			part: "Part 1: The World",
			title: "The Essence Industry",
			kicker: "Economy",
			summary: "Bureau standards, applications, and the Splice black market.",
			image: bookArt.ascendantWorld,
			body: () => worldbookEssenceIndustry(),
		}),
		section({
			id: "rifts-and-ecology",
			part: "Part 1: The World",
			title: "Rifts and the Rift Ecology",
			kicker: "How the World Changed",
			summary:
				"Rift anatomy, formation, rank classification, and ecological impact on mundane life.",
			image: bookArt.wardenRift,
			body: () => worldbookRiftEcology(),
		}),
		section({
			id: "essence-and-awakening",
			part: "Part 1: The World",
			title: "Essence and Awakening",
			kicker: "The Power Behind the Rift Age",
			summary:
				"What Essence is, how Awakening works, and what it changes in the people it touches.",
			image: bookArt.ascendantWorld,
			body: () => worldbookEssenceAndAwakening(),
		}),
		section({
			id: "anomalies-as-force",
			part: "Part 1: The World",
			title: "Anomalies as a World Force",
			kicker: "The Threat",
			summary:
				"What Anomalies are, how they function ecologically, and how society responds to their presence.",
			image: bookArt.wardenAnomaly,
			body: () => worldbookAnomaliesAsForce(),
		}),
		section({
			id: "relics-in-society",
			part: "Part 1: The World",
			title: "Relics in Society",
			kicker: "The Economy of Power",
			summary:
				"Bureau classification, Relic economics, legal status, and the political impact of world-shaping objects.",
			image: bookArt.vaultsRelics,
			body: () => worldbookRelicsInSociety(),
		}),
		section({
			id: "factions",
			part: "Part 2: Organizations",
			title: "Bureau, AFA, Guilds, and Society",
			kicker: "The Powers That Be",
			summary:
				"The organizations, corporations, media, law, faith, and black markets that define Rift Age society.",
			image: bookArt.wardenOperations,
			body: () => worldbookFactions(),
		}),
		section({
			id: "locations",
			part: "Part 3: The World in Detail",
			title: "Locations and World Regions",
			kicker: "Field Dossiers",
			summary:
				"All canonical Rift Ascendant locations with geography, encounters, hazards, and world hooks.",
			image: bookArt.wardenWorld,
			body: () =>
				renderCompactCatalog(
					"Location Dossiers",
					"Canonical Rift Ascendant sites, regions, and points of interest.",
					locationCatalog,
					{ context: "Location", kind: "record" },
				),
		}),
		section({
			id: "domains-persistent",
			part: "Part 3: The World in Detail",
			title: "Domains and Persistent Rift Interiors",
			kicker: "Long-Term Threats",
			summary:
				"What Domains are, how they differ from ordinary Rifts, their internal logic, and their persistence.",
			image: bookArt.wardenRift,
			body: () => worldbookDomains(),
		}),
		section({
			id: "regents",
			part: "Part 4: Powers Beyond the Bureau",
			title: "Regents as Setting Forces",
			kicker: "Authority Signatures",
			summary:
				"Regent-class authority overlays: their roles, requirements, and world-shaping impact.",
			image: bookArt.wardenRegents,
			body: () =>
				renderCatalog("Regents", "Regent-class authority overlays and their setting roles.", regentCatalog, {
					context: "Regent",
					folder: "regents",
					classified: true,
				}),
		}),
		section({
			id: "pantheon",
			part: "Part 4: Powers Beyond the Bureau",
			title: "The Pantheon and Eternals",
			kicker: "Deep Background",
			summary:
				"Eternals, Exarchs, portfolios, dogma, relationships, and their place in the world\u2019s deep history.",
			image: bookArt.wardenCover,
			body: () =>
				renderCatalog("Pantheon", "Eternals, Exarchs, and the deep background powers of the Rift Age.", pantheonCatalog, {
					context: "Pantheon",
					classified: true,
				}),
		}),
		section({
			id: "in-universe-docs",
			part: "Appendices",
			title: "In-Universe Documents",
			kicker: "Field Materials",
			summary:
				"Bureau alerts, Guild bulletins, witness statements, media headlines, and representative Rift Age documents.",
			image: bookArt.wardenOperations,
			body: () => worldbookInUniverseDocs(),
		}),
		section({
			id: "worldbook-campaign-seeds",
			part: "Appendices",
			title: "Campaign Seeds",
			kicker: "For the Warden",
			summary: "Three complete campaign frames built entirely on Rift Age canonical lore.",
			image: bookArt.wardenRegents,
			body: () => worldbookCampaignSeeds(),
		}),
		section({
			id: "worldbook-index",
			part: "Appendices",
			title: "Worldbook Index",
			kicker: "Reference",
			summary:
				"Alphabetical cross-reference for locations, regents, and pantheon entries in this book.",
			image: bookArt.wardenWorld,
			body: () =>
				renderReferenceIndex("Rift Age Worldbook Index", {
					Locations: locationCatalog,
					Regents: regentCatalog,
					Pantheon: pantheonCatalog,
				}),
		}),
	];
	return {
		slug: "worldbook",
		title: "Rift Ascendant \u2014 Rift Age Worldbook",
		subtitle: "The complete setting sourcebook: locations, factions, regents, and the forces that shape the world.",
		classification: "Setting Sourcebook",
		tagline: "The world broke open. This is what it looks like now.",
		outputBase: "Rift Ascendant - Rift Age Worldbook",
		coverImage: bookArt.wardenWorld,
		sections,
		requiredPageTarget: false,
	};
}

function awakenedArtsInscriptionGuide() {
	return proseBlock(`
### The Art of Inscription
Inscribing Sigils onto gear and tattooing the skin with anomalous ink are two of the oldest forms of human interaction with Essence, predating even the formal establishment of the Bureau. While anyone with the right materials and knowledge can attempt an inscription, only a trained Inscriber (typically a Guild specialist or a licensed Arcanist) can guarantee it won't violently reject the target surface.

### The Inscription Procedure
Inscribing a Sigil or Tattoo requires three things:
1. **Time:** 1 hour per rank of the inscription. 
2. **Materials:** Specific anomalous reagents. A Sigil requires etching acid distilled from Anomaly blood. A Tattoo requires anomalous ink derived from Essence-rich flora or fauna.
3. **The Check:** The Inscriber makes an Intelligence check using their Inscription tools. The DC is 10 + (2 x Rank of the Inscription). On a failure, the materials are ruined. On a critical failure, the target item is destroyed or the target creature takes unmitigable force damage.

### The Body Slot System
Tattoos are limited by the physical surface area and metaphysical tolerance of the human body. An Ascendant has the following slots available for Tattoos:
- **Head/Face:** 1 slot
- **Arms/Hands:** 2 slots (one per arm)
- **Torso (Front/Back):** 2 slots
- **Legs/Feet:** 2 slots (one per leg)

### Overfilling and Removal
Attempting to place a Tattoo in an already occupied slot triggers *Essence Rejection*. The new Tattoo immediately burns away, dealing severe necrotic damage to the host and permanently destroying the ink. 

To safely remove a Tattoo, an Inscriber must perform a grueling surgical procedure using a specialized counter-agent. This process takes 4 hours, destroys the Tattoo permanently, and leaves the host exhausted for 24 hours.

### Legal Status
Visible anomalous tattoos are highly regulated. The Bureau requires all Tattoos above Rank-D to be registered. Unregistered combat-grade Tattoos spotted on civilians or unlicensed Ascendants are grounds for immediate detention. In many quarantine zones, visible Tattoos are treated as gang affiliations, drawing the ire of both law enforcement and rival syndicates.
	`);
}

function awakenedArtsBuildCombos() {
	return proseBlock(`
### Synergy and Interaction
Ascendant abilities are designed to interact. When a player layers a Technique with a Power, or a Spell with a specific Sigil, the result is often greater than the sum of its parts. Below are notable, canonical ability combinations.

#### The "Thunder-Breach" (Technique + Power)
* **Components:** *Breach Step* (Stalker Technique) + *Thunderous Smite* (Paladin Power)
* **Mechanism:** The Ascendant activates *Thunderous Smite* just before using *Breach Step*. The teleportation bypasses the target's frontline defense, and the impact of the materialization triggers the smite's explosive force directly into the target's rear guard.
* **Tradeoff:** Extremely high resource cost for a single turn, leaving the Ascendant stranded behind enemy lines if the target survives.

#### The "Bleeding Ward" (Spell + Sigil)
* **Components:** *Vampiric Touch* (Spell) + *Sigil of the Blood-Bound*
* **Mechanism:** The Sigil stores excess healing as a temporary shield. When the Ascendant casts *Vampiric Touch*, every strike not only restores their health but continually regenerates the Sigil's warding barrier.
* **Tradeoff:** Requires the Ascendant to remain in prolonged melee combat while concentrating on a spell, risking immediate barrier collapse if concentration is broken.

#### The "Feedback Loop" (Rune Cross-Access)
* **Components:** *Rune of the Tempest* (Native) + *Rune of the Anchor* (Cross-Access)
* **Mechanism:** *Tempest* grants lightning-fast mobility but prevents the user from remaining stationary. *Anchor* roots the user in place to absorb kinetic damage. When activated simultaneously, the conflicting directives create a localized kinetic feedback loop, causing the Ascendant to vibrate with destructive energy that damages anything they grapple.
* **Tradeoff:** Deals continuous force damage to the Ascendant as long as both Runes are active. Requires Warden approval due to severe physiological strain.
	`);
}

function buildAwakenedArtsBook(): BookDefinition {
	const allSpells = spells as EntryRecord[];
	const allPowers = powers as EntryRecord[];
	const allTechniques = techniques as EntryRecord[];
	const allRuneEntries = allRunes as EntryRecord[];
	const sigilCatalog = sigils as EntryRecord[];
	const tattooCatalog = tattoos as EntryRecord[];
	const sections: BookSection[] = [
		section({
			id: "using-this-book",
			part: "Part 1: The Ability System",
			title: "Using Awakened Arts",
			kicker: "Ability System Overview",
			summary:
				"How Techniques, Powers, Spells, Runes, Sigils, and Tattoos work \u2014 access rules, resource models, and how to read an entry.",
			image: bookArt.ascendantAbilities,
			body: () => awakenedArtsSystemPrimer(),
		}),
		section({
			id: "rune-mechanics",
			part: "Part 1: The Ability System",
			title: "Rune Mechanics",
			kicker: "Absorption and Cross-Access",
			summary:
				"How Rune absorption works, native versus cross-access rules, limits, and Warden approval procedures.",
			image: bookArt.ascendantRunes,
			body: () => awakenedArtsRuneDeepDive(),
		}),
		section({
			id: "warden-guidance",
			part: "Part 1: The Ability System",
			title: "Warden Approval and Balance",
			kicker: "Table Authority",
			summary:
				"Balance guidelines for Wardens, ability design notes, and how to adjudicate unusual ability interactions.",
			image: bookArt.ascendantAbilities,
			body: () => awakenedArtsWardenGuidance(),
		}),
		section({
			id: "inscription-guide",
			part: "Part 1: The Ability System",
			title: "The Inscription System",
			kicker: "Tattoos and Sigils",
			summary:
				"Procedures, checks, and body slots for anomalous tattoos and weapon sigils.",
			image: bookArt.ascendantWorld,
			body: () => awakenedArtsInscriptionGuide(),
		}),
		section({
			id: "build-combos",
			part: "Part 1: The Ability System",
			title: "Notable Ability Synergies",
			kicker: "Build Combinations",
			summary:
				"Canonical examples of how powers, techniques, and spells can be layered for maximum effect.",
			image: bookArt.wardenOperations,
			body: () => awakenedArtsBuildCombos(),
		}),
		section({
			id: "techniques-catalog",
			part: "Part 2: Ability Catalogs",
			title: "Techniques",
			kicker: "Martial and Tactical",
			summary:
				"Complete catalog of martial maneuvers, tactical abilities, and trained combat expressions.",
			image: bookArt.ascendantAbilities,
			body: () =>
				renderCompactCatalog(
					"Techniques",
					"Stamina-fueled or tactical abilities that do not rely on raw Essence casting.",
					allTechniques,
					{ context: "Technique", kind: "ability" },
				),
		}),
		section({
			id: "powers-catalog",
			part: "Part 2: Ability Catalogs",
			title: "Powers",
			kicker: "Innate Abilities",
			summary:
				"Complete catalog of innate Job abilities drawn directly from the Ascendant\u2019s Awakening.",
			image: bookArt.ascendantAbilities,
			body: () =>
				renderCompactCatalog(
					"Powers",
					"Fueled by internal Essence. Faster to deploy than spells, less structured, more personal.",
					allPowers,
					{ context: "Power", kind: "ability" },
				),
		}),
		section({
			id: "spells-catalog",
			part: "Part 2: Ability Catalogs",
			title: "Spells",
			kicker: "Structured Casting",
			summary:
				"Complete catalog of structured Essence effects channeled through spell slots, components, range, and duration.",
			image: bookArt.ascendantAbilities,
			body: () =>
				renderCompactCatalog(
					"Spells",
					"Structured supernatural effects requiring components, concentration, and spell slots.",
					allSpells,
					{ context: "Spell", kind: "ability" },
				),
		}),
		section({
			id: "runes-catalog",
			part: "Part 2: Ability Catalogs",
			title: "Runes",
			kicker: "Inscribed Power",
			summary:
				"Complete catalog of Runes \u2014 all rarities, all types, all absorption classifications.",
			image: bookArt.ascendantRunes,
			body: () =>
				splitNotice(
					"Complete Rune Catalog",
					"This chapter contains every Rune across all rarities and access types. Foundational Runes for character creation are also in the Ascendant Guide. This catalog is the complete reference.",
				) +
				renderCompactCatalog(
					"Runes",
					"Complete Rune catalog \u2014 absorb to learn the referenced ability.",
					allRuneEntries,
					{ context: "Rune", kind: "rune" },
				),
		}),
		section({
			id: "sigils-catalog",
			part: "Part 3: Inscriptions",
			title: "Sigils",
			kicker: "Permanent Etchings",
			summary:
				"Complete catalog of Sigils \u2014 inscriptions on weapons, armor, and objects granting passive or activated benefits.",
			image: bookArt.ascendantRunes,
			body: () =>
				renderCatalog(
					"Sigils",
					"Permanent inscriptions etched into weapons, armor, or objects granting passive or activated benefits.",
					sigilCatalog,
					{ context: "Sigil" },
				),
		}),
		section({
			id: "tattoos-catalog",
			part: "Part 3: Inscriptions",
			title: "Tattoos",
			kicker: "Living Inscriptions",
			summary:
				"Complete catalog of Tattoos \u2014 supernatural marks inked directly into an Ascendant\u2019s skin.",
			image: bookArt.ascendantRunes,
			body: () =>
				renderCatalog(
					"Tattoos",
					"Supernatural marks inked directly into an Ascendant\u2019s skin, granting resonance effects tied to body and spirit.",
					tattooCatalog,
					{ context: "Tattoo" },
				),
		}),
		section({
			id: "arts-app-guide",
			part: "Appendices",
			title: "Using the Companion App",
			kicker: "Digital Reference",
			summary:
				"What the Companion App contains, what this book contains, and how to use both together at the table.",
			image: bookArt.ascendantAbilities,
			body: () => awakenedArtsAppGuide(),
		}),
		section({
			id: "arts-index",
			part: "Appendices",
			title: "Awakened Arts Index",
			kicker: "Reference",
			summary:
				"Alphabetical cross-reference for all abilities, runes, sigils, and tattoos in this book.",
			image: bookArt.ascendantAbilities,
			body: () =>
				renderReferenceIndex("Awakened Arts Index", {
					Techniques: allTechniques,
					Powers: allPowers,
					Spells: allSpells,
					Runes: allRuneEntries,
					Sigils: sigilCatalog,
					Tattoos: tattooCatalog,
				}),
		}),
	];
	return {
		slug: "awakened-arts",
		title: "Rift Ascendant \u2014 Awakened Arts",
		subtitle: "The complete ability sourcebook: every spell, power, technique, rune, sigil, and tattoo in the Rift Age.",
		classification: "Ability Sourcebook",
		tagline: "The power is real. Learn what it does.",
		outputBase: "Rift Ascendant - Awakened Arts",
		coverImage: bookArt.ascendantRunes,
		sections,
		requiredPageTarget: false,
	};
}

function coverTilesFor(definition: BookDefinition): string[][] {
	switch (definition.slug) {
		case "ascendant":
			return [
				["1-20", "Level Range"],
				["Jobs + Paths", "Character Options"],
				["Core Catalogs", "Player Reference"],
			];
		case "warden":
			return [
				["Rifts", "Hazards + Domains"],
				["Warden", "DMG-Style Guide"],
				["Tables", "Rewards + Operations"],
			];
		case "vaults":
			return [
				["Runes", "Expanded Catalog"],
				["Items", "Expanded Gear"],
				["Relics", "Treasure Vault"],
			];
		case "anomaly-manual":
			return [
				["Ranks D-S", "Threat Catalog"],
				["Stat Blocks", "Anomaly Manual"],
				["Shadows", "Summoned Forces"],
			];
		case "worldbook":
			return [
				["Locations", "World Directory"],
				["Regents", "Authority Forces"],
				["Pantheon", "Deep Background"],
			];
		case "awakened-arts":
			return [
				["Spells \u00b7 Powers", "Complete Catalogs"],
				["Runes", "Absorption Guide"],
				["Sigils \u00b7 Tattoos", "Inscriptions"],
			];
		case "run-silent":
			return [
				["Level 1-10", "Campaign Scope"],
				["The Gloamreach", "S-Rank Domain"],
				["Survival Horror", "Campaign Theme"],
			];
		case "glassline-claim":
			return [
				["Level 1", "1-5 Players"],
				["Rank D", "Eternal Shadow Dungeon"],
				["3.5-5h", "One-Shot"],
			];
	}
}

function tocFor(definition: BookDefinition): string {
	let tocPart = "";
	return definition.sections
		.map((item, index) => {
			const partHeading =
				item.part && item.part !== tocPart
					? ((tocPart = item.part), `<li class="toc-part">${esc(item.part)}</li>`)
					: "";
			const chapNum = String(index + 1).padStart(2, "0");
			return `${partHeading}<li class="toc-item"><span class="toc-chapter-num">${chapNum}</span> <a href="#${item.id}"><strong>${esc(item.title)}</strong></a><br/><span class="toc-chapter-summary">${esc(item.summary)}</span></li>`;
		})
		.join("");
}

function bookIntroText(definition: BookDefinition): string {
	switch (definition.slug) {
		case "ascendant":
			return `<p>You are holding the Ascendant Guide \u2014 everything a player needs to create a character, learn the rules, and survive the Rift Age. If you\u2019re new to Rift Ascendant, start with <strong>The Rift Age</strong> and <strong>Core Rules</strong> to understand the world and how the game works. Then build your character using <strong>Jobs</strong>, <strong>Paths</strong>, and <strong>Backgrounds</strong>.</p>
			<p>The second half of this book is your field manual. When you need to look up a spell, check a feat, or compare weapons during play, flip to the relevant chapter. Entries are organized for fast reference \u2014 find the name, read the rules, get back to the action.</p>`;
		case "warden":
			return `<p>You are holding the Warden Guide \u2014 the operations manual for running Rift Ascendant. This book explains how to manage the game world, run Rifts and Domains, handle faction operations, and build balanced encounters.</p>
			<p>It contains rules for hazards, social conflict, mass combat, and campaign scaling. It also provides the complete loot and reward generation tables needed to distribute Relics, Artifacts, and wealth to your players.</p>`;
		case "vaults":
			return `<p>You are holding Vaults of the Rift \u2014 the expanded equipment and treasure catalog. This book details the rare, dangerous, and high-impact items that don\u2019t belong in the standard-issue Ascendant Guide.</p>
			<p>Inside, you\u2019ll find expanded runes, black market tech, military vehicles, and the world-shaping Relics and Artifacts that define end-game power. Every item in this book carries a risk, a history, or a consequence.</p>`;
		case "anomaly-manual":
			return `<p>You are holding the Anomaly Manual \u2014 the complete threat catalog for the Rift Age. This book contains combat-ready stat blocks for every Anomaly, Shadow Soldier, and rift-born entity known to the Bureau.</p>
			<p>Entries range from standard Rank-D drones to world-ending Rank-S apex predators. Each block is formatted for rapid table reference, detailing the creature\u2019s actions, traits, and combat behavior.</p>`;
		case "worldbook":
			return `<p>You are holding the Rift Age Worldbook \u2014 the definitive guide to the setting, history, and geography of Rift Ascendant. This book details the state of the world following the Rift emergence.</p>
			<p>It covers canonical locations, Bureau operations, corporate factions, and the god-like Regents and Eternals that shape reality. Use this to anchor your campaign in the established lore.</p>`;
		case "awakened-arts":
			return `<p>You are holding Awakened Arts \u2014 the complete compendium of Techniques, Powers, Spells, Runes, Sigils, and Tattoos. This is the master reference for the entire ability system.</p>
			<p>While the Ascendant Guide provides foundational abilities, this book contains the expanded, exhaustive catalog. It details the precise mechanics, scaling, and interactions of every supernatural art in the game.</p>`;
		case "run-silent":
			return `<p>You are holding Run Silent \u2014 a full-scale survival and psychological horror campaign for Rift Ascendant.</p>
			<p>Set entirely within an S-Rank Rift Interior known as the Gloamreach, this book challenges a party of Ascendants to survive an ancient, unnatural country and the apex predator that hunts them across it.</p>`;
		case "glassline-claim":
			return `<p>You are holding The Glassline Claim \u2014 a Warden-ready introductory mini-adventure for level 1 Rift Ascendant characters. It is built as a licensed Rank-D escort contract in the Eternal Shadow Dungeon, with scene flow, dialogue, handouts, scaling, rewards, and debrief outcomes ready for one session.</p>
			<p>This one-shot can lead into Run Silent by carrying forward credits, registered salvage, contacts, and reputation, but it does not use campaign-region lore or campaign-specific mechanics.</p>`;
		default:
			return `<p>Welcome to ${esc(definition.title)}.</p>`;
	}
}

function frontMatterHtml(definition: BookDefinition): string {
	const coverImage = optionalAsset(definition.coverImage, `${definition.title} cover`);
	const coverTiles = coverTilesFor(definition);
	return `<section class="cover" style="${coverImage ? `--cover-image: url('${coverImage}')` : ""}">
		<div>
			<div class="cover-kicker">Rift Ascendant / ${esc(definition.classification)}</div>
			<h1>${esc(definition.title)}</h1>
			<p class="cover-subtitle">${esc(definition.subtitle)}</p>
			<div class="cover-grid">
				${coverTiles.map(([value, label]) => `<div class="cover-tile"><strong>${esc(value)}</strong>${esc(label)}</div>`).join("")}
			</div>
		</div>
		<div class="book-code">${esc(definition.tagline)}</div>
	</section>
	<section class="front-matter">
		<h1>Welcome to Rift Ascendant</h1>
		<div class="front-card">
			${bookIntroText(definition)}
		</div>
		<div class="front-card">
			<p><strong>Key Terms.</strong> An <strong>Ascendant</strong> is a person changed by the Rift \u2014 your character. A <strong>Job</strong> is your broad power classification. A <strong>Path</strong> is your specialization within that Job. <strong>Techniques</strong>, <strong>Powers</strong>, and <strong>Spells</strong> are the three types of active abilities. The <strong>Warden</strong> is the person running the game \u2014 they control the world, the Rifts, the Anomalies, and everything trying to kill you.</p>
			<p><strong>The Companion App</strong> is the searchable database that backs every sourcebook. When you need more entries than fit in a curated print catalog, the App has everything.</p>
			<p><strong>Rules Priority.</strong> When in doubt, the entry is right. Your Warden has the final word.</p>
		</div>
	</section>
	<nav class="toc">
		<h1>Contents</h1>
		<ol>${tocFor(definition)}</ol>
	</nav>`;
}

function sectionHtml(definition: BookDefinition, item: BookSection, index: number): string {
	const image = optionalAsset(item.image, `${definition.title}: ${item.title}`);
	const rawBody = typeof item.body === "function" ? item.body() : item.body;
	const body = resolveInlinePublicAssetUrls(rawBody, `${definition.title}: ${item.title} body`);
	return `<section class="chapter" id="${item.id}">
		<div class="chapter-opener" style="${image ? `--chapter-image: url('${image}')` : ""}">
			<div class="eyebrow">${item.part ? `${esc(item.part)} / ` : ""}${esc(item.kicker)} / Chapter ${index + 1}</div>
			<h1>${esc(item.title)}</h1>
			<p>${esc(item.summary)}</p>
		</div>
		${body}
	</section>`;
}

function professionalPrintCss(): string {
	return `
@page {
	size: Letter;
	margin: 0.58in 0.56in 0.92in;
	@top-left {
		content: "Rift Ascendant";
		font-family: "Outfit", "Segoe UI", sans-serif;
		font-size: 6.8pt;
		color: #7a6047;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	@top-right {
		content: string(chapter-title);
		font-family: "Outfit", "Segoe UI", sans-serif;
		font-size: 6.8pt;
		color: #7a6047;
	}
	@bottom-center {
		content: none;
	}
}
@page :first {
	margin: 0;
	@top-left { content: none; }
	@top-right { content: none; }
	@bottom-center { content: none; }
}
@media print {
	* {
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
	body {
		font-family: "Source Serif 4", "Georgia", serif;
		font-size: 9.5pt;
		line-height: 1.46;
		color: #1a1410;
		background: #f5f0e5;
	}
	h1, h2, h3, h4 {
		font-family: "Outfit", "Segoe UI", sans-serif;
		letter-spacing: -0.01em;
		color: #1a0f05;
	}
	.chapter > .chapter-opener h1 {
		string-set: chapter-title content(text);
	}
	.cover {
		height: 11in;
		min-height: 11in;
		border: 0;
		background:
			linear-gradient(155deg, rgba(4, 6, 15, 0.97) 0%, rgba(10, 15, 30, 0.82) 60%, rgba(6, 10, 22, 0.92) 100%),
			var(--cover-image, none),
			radial-gradient(ellipse at 15% 12%, rgba(116, 242, 255, 0.28) 0%, transparent 40%),
			radial-gradient(ellipse at 85% 20%, rgba(167, 139, 250, 0.26) 0%, transparent 38%),
			#070812;
	}
	.cover h1 {
		font-size: 36pt;
		line-height: 0.96;
		letter-spacing: -0.02em;
		font-weight: 800;
	}
	.cover-tile {
		border-color: rgba(116, 242, 255, 0.3);
		background: rgba(8, 14, 30, 0.78);
	}
	.front-card,
	.callout {
		background: rgba(255, 255, 255, 0.42);
		border: 0;
		border-left: 4pt solid #74f2ff;
	}
	.chapter-opener {
		border: 0;
		background:
			linear-gradient(155deg, rgba(5, 7, 18, 0.97), rgba(14, 20, 40, 0.84)),
			var(--chapter-image, none),
			#070812;
		background-size: cover;
		background-position: center;
		color: #f8fbff;
		min-height: 3in;
	}
	.chapter-opener h1,
	.chapter-opener p,
	.chapter-opener .eyebrow {
		color: #f8fbff;
	}
	.section-intro {
		border-top: 2pt solid #7a6047;
		border-bottom: 0.5pt solid #cdbf9e;
		padding: 0.11in 0.14in;
		margin-bottom: 0.13in;
	}
	.section-intro h2 {
		font-size: 18pt;
		color: #1a0f05;
	}
	.prose-columns,
	.catalog-grid,
	.compact-catalog {
		column-gap: 0.3in;
	}
	.sourcebook-guide {
		border-top: 1pt solid #7a6047;
		border-bottom: 0.5pt solid #cdbf9e;
		background: rgba(255, 255, 255, 0.3);
		padding: 0.09in 0.11in;
		margin-bottom: 0.11in;
	}
	.sourcebook-guide h3 {
		font-size: 11pt;
		color: #1a0f05;
		margin-bottom: 0.035in;
	}
	table,
	.rules-table {
		break-inside: auto;
		page-break-inside: auto;
		font-size: 8.35pt;
	}
	tr,
	th,
	td {
		break-inside: avoid;
		page-break-inside: avoid;
	}
	th {
		background: #2a1a0e;
		color: #f5f0e5;
		border-color: #4a3020;
	}
	td {
		background: rgba(255, 255, 255, 0.55);
	}
	.campaign-prose {
		max-width: 6.75in;
		font-size: 9.25pt;
		line-height: 1.42;
	}
	.campaign-prose > h2 {
		font-size: 15pt;
		margin-top: 0.15in;
	}
	.campaign-prose > h3 {
		font-size: 10.3pt;
	}
	.campaign-note {
		box-shadow: none;
		background: #eef7fb;
	}
	.campaign-table-wrap {
		break-inside: auto;
		page-break-inside: auto;
	}
	.campaign-table {
		table-layout: fixed;
		font-size: 7pt;
		line-height: 1.16;
	}
	.campaign-table th,
	.campaign-table td {
		padding: 0.028in 0.036in;
		overflow-wrap: anywhere;
		hyphens: auto;
	}
	.campaign-art {
		box-shadow: none;
		break-inside: avoid;
		page-break-inside: avoid;
	}
	.campaign-art img {
		display: block;
		width: 100%;
		max-height: 6.85in;
		object-fit: cover;
		border: 0.5pt solid #8b6f51;
	}
	.campaign-art--map img,
	.campaign-art--handout img {
		object-fit: contain;
		background: #ece7da;
	}
	.campaign-art--portrait {
		float: right;
		width: 1.95in;
		margin: 0.02in 0 0.1in 0.13in;
	}
	.campaign-art--portrait img {
		aspect-ratio: 3 / 4;
	}
	.entry,
	.compact-entry,
	.statblock {
		border-radius: 2pt;
		box-shadow: none;
	}
	.entry {
		padding: 0.09in 0.035in 0.1in;
		margin-bottom: 0.09in;
	}
	.entry h3 {
		font-size: 12pt;
		font-family: "Outfit", sans-serif;
	}
	.compact-entry {
		padding: 0.06in 0.042in 0.065in;
		margin-bottom: 0.075in;
	}
	.compact-entry h3 {
		font-size: 10pt;
		line-height: 1.12;
		font-family: "Outfit", sans-serif;
	}
	.compact-line {
		font-size: 7.8pt;
		line-height: 1.32;
	}
	.statblock {
		break-inside: auto;
		page-break-inside: auto;
	}
	.statblock-header h3 {
		font-size: 14pt;
		font-family: "Outfit", sans-serif;
	}
	.field-grid dt {
		font-size: 7.2pt;
		font-family: "Outfit", sans-serif;
	}
	.nested-grid {
		display: block;
		margin: 0.02in 0;
	}
	.nested-grid dt {
		display: inline;
		font-size: 7pt;
		letter-spacing: 0.03em;
		font-family: "Outfit", sans-serif;
	}
	.nested-grid dt::after {
		content: ": ";
	}
	.nested-grid dd {
		display: inline;
	}
	.nested-grid dd::after {
		content: "";
		display: block;
		margin-bottom: 0.022in;
	}
	.entry-figure {
		width: 1.25in;
	}
	.meta span,
	.tag {
		background: #0f253b;
		color: #ecfeff;
		border-color: #27667d;
		font-size: 6.8pt;
		letter-spacing: 0.04em;
		font-family: "Outfit", sans-serif;
	}
	.index-table {
		font-size: 8pt;
		column-gap: 0.2in;
	}
	.small {
		font-size: 7.8pt;
	}
	p, li {
		orphans: 3;
		widows: 3;
	}
	.split-notice {
		border: 1pt solid #1a0f05;
		background: #ece7da;
		padding: 0.15in;
		margin: 0.15in 0;
		text-align: center;
		page-break-inside: avoid;
	}
	.split-notice h2 {
		margin: 0 0 0.05in;
		font-size: 14pt;
		color: #5a1c15;
	}
	.split-notice p {
		margin: 0;
		font-size: 9.5pt;
		font-style: italic;
	}
	.rules-table p {
		margin: 0;
		padding: 0 0 0.04in 0;
		line-height: 1.25;
	}
}
`;
}

function htmlDocument(definition: BookDefinition, body: string, title = definition.title): string {
	const css = readFileSync(cssPath, "utf8");
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8"/>
	<title>${esc(title)}</title>
	<style>${css}</style>
	<style>${professionalPrintCss()}</style>
</head>
<body>
	${body}
</body>
</html>`;
}

function buildHtml(definition: BookDefinition): string {
	const sectionMarkup = definition.sections
		.map((item, index) => sectionHtml(definition, item, index))
		.join("");
	return htmlDocument(definition, `${frontMatterHtml(definition)}${sectionMarkup}`);
}

function removeHtmlDeliverables() {
	for (const outputBase of [...activeOutputBases, ...staleOutputBases]) {
		const htmlPath = resolve(exportRoot, `${outputBase}.html`);
		if (existsSync(htmlPath)) rmSync(htmlPath, { force: true });
	}
	if (!keepChunks) rmSync(resolve(sharedRoot, "chunks"), { recursive: true, force: true });
}

function removeStaleCampaignOutputs() {
	for (const outputBase of staleOutputBases) {
		for (const ext of [".pdf", ".html"]) {
			const outputPath = resolve(exportRoot, `${outputBase}${ext}`);
			if (existsSync(outputPath)) {
				rmSync(outputPath, { force: true });
				report.warnings.push(`Removed stale non-core book output: ${outputPath}`);
			}
		}
	}
	const campaignSampleRoot = resolve(sampleRoot, "campaign");
	if (existsSync(campaignSampleRoot)) {
		rmSync(campaignSampleRoot, { recursive: true, force: true });
		report.warnings.push(`Removed stale campaign sample renders: ${campaignSampleRoot}`);
	}
	const campaignChunkRoot = resolve(sharedRoot, "chunks", "campaign");
	if (existsSync(campaignChunkRoot)) {
		rmSync(campaignChunkRoot, { recursive: true, force: true });
		report.warnings.push(`Removed stale campaign render chunks: ${campaignChunkRoot}`);
	}
	if (existsSync(assetRoot)) {
		for (const file of readdirSync(assetRoot)) {
			const lower = file.toLowerCase();
			if (
				lower.startsWith("campaign-") ||
				lower.includes("run-silent") ||
				lower.includes("sandbox") ||
				lower.includes("campaign-data")
			) {
				const assetPath = resolve(assetRoot, file);
				rmSync(assetPath, { force: true });
				report.warnings.push(`Removed stale campaign-derived optimized asset: ${assetPath}`);
			}
		}
	}
}

function quoteWindowsShellArg(value: string): string {
	if (value.length === 0) return '""';
	if (!/[\s"&|<>^]/.test(value)) return value;
	return `"${value.replace(/"/g, '\\"')}"`;
}

function runCommand(
	command: string,
	args: string[],
	cwd = repoRoot,
	timeoutMs = 120000,
): CommandResult {
	const runtimeCacheRoot = resolve(sharedRoot, ".runtime-cache");
	const localAppData = resolve(runtimeCacheRoot, "localappdata");
	const xdgCacheHome = resolve(runtimeCacheRoot, "xdg-cache");
	mkdirSync(localAppData, { recursive: true });
	mkdirSync(xdgCacheHome, { recursive: true });
	const commandEnv = {
		...process.env,
		PYTHONIOENCODING: "utf-8",
		LOCALAPPDATA: localAppData,
		XDG_CACHE_HOME: xdgCacheHome,
	};
	const useWindowsCmdShell =
		process.platform === "win32" && command.toLowerCase().endsWith(".cmd");
	const commandLine = [command, ...args].map(quoteWindowsShellArg).join(" ");
	const result = useWindowsCmdShell
		? spawnSync(commandLine, [], {
			cwd,
			encoding: "utf8",
			windowsHide: true,
			maxBuffer: 1024 * 1024 * 50,
			shell: true,
			timeout: timeoutMs,
			env: commandEnv,
		})
		: spawnSync(command, args, {
		cwd,
		encoding: "utf8",
		windowsHide: true,
		maxBuffer: 1024 * 1024 * 50,
		timeout: timeoutMs,
		env: commandEnv,
	});
	const record = {
		command: useWindowsCmdShell ? commandLine : `${command} ${args.join(" ")}`,
		status: result.status,
		stdout: cleanText(result.stdout || ""),
		stderr: cleanText(result.stderr || result.error?.message || ""),
	};
	report.commands.push(record);
	return record;
}

function bundledBin(name: string): string {
	const userProfile = process.env.USERPROFILE || "";
	return resolve(
		userProfile,
		".cache/codex-runtimes/codex-primary-runtime/dependencies/bin",
		name,
	);
}

function bundledNativePopplerBin(name: string): string | null {
	if (!/pdfinfo|pdftoppm/i.test(name)) return null;
	const userProfile = process.env.USERPROFILE || "";
	const executableName = name.replace(/\.cmd$/i, ".exe");
	return resolve(
		userProfile,
		".cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin",
		executableName,
	);
}

function findExecutable(names: string[]): string | null {
	for (const name of names) {
		const direct = resolve(repoRoot, name);
		if (existsSync(direct)) return direct;
		const nativePoppler = bundledNativePopplerBin(name);
		if (nativePoppler && existsSync(nativePoppler)) return nativePoppler;
		const bundled = bundledBin(name);
		if (existsSync(bundled)) return bundled;
		const where = runCommand("where.exe", [name]);
		if (where.status === 0) {
			const first = where.stdout.split(/\r?\n/).find(Boolean);
			if (first) return first.trim();
		}
	}
	return null;
}

function toolCacheBin(name: string): string {
	return resolve(
		toolCacheRoot,
		"node_modules",
		".bin",
		process.platform === "win32" ? `${name}.cmd` : name,
	);
}

function recordToolVersion(label: string, command: string, args = ["--version"]) {
	const result = runCommand(command, args);
	const version = (result.stdout || result.stderr).split(/\r?\n/).find(Boolean);
	if (version) report.tooling.push(`${label}: ${version.trim()}`);
}

function ensureVivliostyleExecutable(): string | null {
	const cached = toolCacheBin("vivliostyle");
	if (existsSync(cached)) {
		recordToolVersion("Vivliostyle CLI", cached);
		return cached;
	}
	mkdirSync(toolCacheRoot, { recursive: true });
	report.tooling.push(`Optional tool cache: ${toolCacheRoot}`);
	const install = runCommand(
		process.platform === "win32" ? "npm.cmd" : "npm",
		["install", "--prefix", toolCacheRoot, "@vivliostyle/cli"],
		toolCacheRoot,
	);
	if (install.status !== 0 || !existsSync(cached)) {
		report.failedExportAttempts.push(
			`Vivliostyle install failed in ${toolCacheRoot}; falling back to other renderers.`,
		);
		return null;
	}
	recordToolVersion("Vivliostyle CLI", cached);
	return cached;
}

function findWeasyPrintExecutable(): string | null {
	const weasyprint = findExecutable(["weasyprint.exe", "weasyprint"]);
	if (weasyprint) recordToolVersion("WeasyPrint", weasyprint, ["--version"]);
	return weasyprint;
}

let vivliostyleTimedOut = false;
let vivliostyleExecutableCache: string | null | undefined;

function getVivliostyleExecutable(): string | null {
	if (vivliostyleExecutableCache !== undefined) return vivliostyleExecutableCache;
	vivliostyleExecutableCache =
		ensureVivliostyleExecutable() ||
		findExecutable([
			"node_modules/.bin/vivliostyle.cmd",
			"vivliostyle.cmd",
			"vivliostyle",
		]);
	return vivliostyleExecutableCache;
}

function tryVivliostyle(htmlPath: string, pdfPath: string): boolean {
	if (vivliostyleTimedOut) {
		report.failedExportAttempts.push(
			"Vivliostyle skipped after a previous timeout in this build run.",
		);
		return false;
	}
	const vivliostyle = getVivliostyleExecutable();
	if (!vivliostyle) {
		report.failedExportAttempts.push(
			"Vivliostyle was not installed or discoverable; falling back to Playwright.",
		);
		return false;
	}
	const result = runCommand(vivliostyle, [
		"build",
		htmlPath,
		"-o",
		pdfPath,
		"--size",
		"letter",
	], repoRoot, 1800000); // 30 minutes to guarantee Vivliostyle never gives up
	if (result.status === 0 && existsSync(pdfPath)) return true;
	if (result.status === null) {
		vivliostyleTimedOut = true;
		report.failedExportAttempts.push(
			`Vivliostyle timed out for ${htmlPath}; later books will use fallback renderers.`,
		);
		return false;
	}
	report.failedExportAttempts.push(
		`Vivliostyle failed for ${htmlPath}: ${result.stderr || result.stdout}`,
	);
	return false;
}

function tryVivliostyleChunk(htmlPath: string, pdfPath: string, label: string): boolean {
	if (vivliostyleTimedOut) {
		report.failedExportAttempts.push(`Vivliostyle skipped for ${label} due to earlier timeout.`);
		return false;
	}
	const vivliostyle = getVivliostyleExecutable();
	if (!vivliostyle) {
		report.failedExportAttempts.push(
			"Vivliostyle was not installed or discoverable; Playwright rendered PDF chunks.",
		);
		return false;
	}
	const result = runCommand(
		vivliostyle,
		["build", htmlPath, "-o", pdfPath, "--size", "letter"],
		repoRoot,
		vivliostyleChunkTimeoutMs, // 30 min under --vivlio-only; 5 min otherwise (see line ~140)
	);
	if (result.status === 0 && existsSync(pdfPath)) return true;
	if (result.status === null) {
		// Single chunk timed out. In --vivlio-only mode renderChunkPdf throws; otherwise the chunk falls back.
		report.failedExportAttempts.push(
			`Vivliostyle timed out for ${label} (>${Math.round(vivliostyleChunkTimeoutMs / 60000)} min).`,
		);
		if (existsSync(pdfPath)) rmSync(pdfPath, { force: true });
		return false;
	}
	if (existsSync(pdfPath)) rmSync(pdfPath, { force: true });
	report.failedExportAttempts.push(
		`Vivliostyle chunk fallback for ${label}: ${result.stderr || result.stdout || "no diagnostic output"}`,
	);
	return false;
}

function tryWeasyPrint(htmlPath: string, pdfPath: string): boolean {
	const weasyprint = findWeasyPrintExecutable();
	if (!weasyprint) {
		report.failedExportAttempts.push(
			"WeasyPrint was not installed or discoverable; Playwright remains available as fallback.",
		);
		return false;
	}
	const result = runCommand(weasyprint, [htmlPath, pdfPath]);
	if (result.status === 0 && existsSync(pdfPath)) return true;
	report.failedExportAttempts.push(
		`WeasyPrint failed for ${htmlPath}: ${result.stderr || result.stdout}`,
	);
	return false;
}

async function renderWithPlaywright(htmlPath: string, pdfPath: string) {
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage({
			viewport: { width: 1280, height: 1800 },
		});
		page.setDefaultTimeout(0);
		await page.goto(pathToFileURL(htmlPath).href, {
			waitUntil: "load",
			timeout: 0,
		});
		await page.emulateMedia({ media: "print" });
		await page.pdf({
			path: pdfPath,
			format: "Letter",
			preferCSSPageSize: true,
			printBackground: true,
			outline: true,
			tagged: true,
			displayHeaderFooter: false,
			margin: {
				top: "0.55in",
				bottom: "0.68in",
				left: "0.52in",
				right: "0.52in",
			},
		});
	} finally {
		await browser.close();
	}
}

async function mergePdfFiles(inputPaths: string[], outputPath: string, title: string) {
	const merged = await PDFDocument.create();
	for (const inputPath of inputPaths) {
		const source = await PDFDocument.load(readFileSync(inputPath));
		const pages = await merged.copyPages(source, source.getPageIndices());
		for (const page of pages) merged.addPage(page);
	}
	merged.setTitle(title);
	const tempOutputPath = `${outputPath}.new`;
	writeFileSync(tempOutputPath, await merged.save({ useObjectStreams: true }));
	try {
		if (existsSync(outputPath)) rmSync(outputPath, { force: true });
		renameSync(tempOutputPath, outputPath);
	} catch (error) {
		if (existsSync(tempOutputPath)) rmSync(tempOutputPath, { force: true });
		throw new Error(
			`Unable to replace stale PDF at ${outputPath}. Close any PDF viewer or preview pane using this file and rebuild. ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}

async function stampGlobalPageNumbers(pdfPath: string, title: string) {
	const document = await PDFDocument.load(readFileSync(pdfPath));
	const font = await document.embedFont(StandardFonts.Helvetica);
	for (const [index, page] of document.getPages().entries()) {
		if (index === 0) continue;
		const label = String(index + 1);
		const size = 7;
		const { width } = page.getSize();
		page.drawText(label, {
			x: (width - font.widthOfTextAtSize(label, size)) / 2,
			y: 12,
			size,
			font,
			color: rgb(0.294, 0.361, 0.439),
		});
	}
	document.setTitle(title);
	const tempOutputPath = `${pdfPath}.numbered`;
	writeFileSync(tempOutputPath, await document.save({ useObjectStreams: true }));
	try {
		if (existsSync(pdfPath)) rmSync(pdfPath, { force: true });
		renameSync(tempOutputPath, pdfPath);
	} catch (error) {
		if (existsSync(tempOutputPath)) rmSync(tempOutputPath, { force: true });
		throw new Error(
			`Unable to stamp global page numbers for ${pdfPath}. Close any PDF viewer or preview pane using this file and rebuild. ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
	}
}

function parseJsonLine<T>(stdout: string): T | null {
	const line = stdout
		.split(/\r?\n/)
		.map((item) => item.trim())
		.filter(Boolean)
		.at(-1);
	if (!line) return null;
	try {
		return JSON.parse(line) as T;
	} catch {
		return null;
	}
}

function applyPdfBookmarks(pdfPath: string, title: string, bookmarks: BookmarkEntry[]) {
	const python = findPythonExecutable();
	if (!python) {
		report.validation.push(`FAIL: ${title} could not receive PDF bookmarks because Python/pypdf was not found.`);
		return;
	}
	const script = String.raw`
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from io import BytesIO
import json
import os
import sys

path = Path(sys.argv[1])
bookmarks = json.loads(sys.argv[2])
title = sys.argv[3]
reader = PdfReader(BytesIO(path.read_bytes()))
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
metadata = {}
if reader.metadata:
    for key, value in reader.metadata.items():
        if value is not None:
            metadata[str(key)] = str(value)
metadata["/Title"] = title
writer.add_metadata(metadata)
parents = {}
page_count = len(reader.pages)
added = []
for mark in bookmarks:
    if page_count == 0:
        continue
    page_index = max(0, min(int(mark.get("pageIndex", 0)), page_count - 1))
    level = max(0, int(mark.get("level", 0)))
    parent = parents.get(level - 1) if level else None
    node = writer.add_outline_item(str(mark.get("title", "Section")), page_index, parent=parent)
    parents[level] = node
    for old_level in list(parents.keys()):
        if old_level > level:
            parents.pop(old_level, None)
    added.append({"title": str(mark.get("title", "Section")), "pageIndex": page_index, "level": level})
tmp = path.with_suffix(path.suffix + ".bookmarked")
with tmp.open("wb") as handle:
    writer.write(handle)
os.replace(tmp, path)
print(json.dumps({"count": len(added), "titles": [item["title"] for item in added[:80]]}, ensure_ascii=False))
`;
	const result = runCommand(
		python,
		["-c", script, pdfPath, JSON.stringify(bookmarks), title],
		repoRoot,
		120000,
	);
	const parsed = parseJsonLine<{ count: number; titles: string[] }>(result.stdout);
	if (result.status !== 0 || !parsed || parsed.count === 0) {
		report.validation.push(`FAIL: ${title} PDF bookmark post-process failed.`);
		report.warnings.push(result.stderr || result.stdout || `No pypdf bookmark output for ${pdfPath}.`);
		return;
	}
	report.bookmarks.push({ path: pdfPath, count: parsed.count, titles: parsed.titles });
}

function auditPdfBookmarks(pdfPath: string, title: string, expectedTitles: string[] = ["Cover", "Preface", "Contents"]) {
	const python = findPythonExecutable();
	if (!python) {
		report.validation.push(`FAIL: ${title} bookmark audit skipped because Python/pypdf was not found.`);
		return;
	}
	const script = String.raw`
from pypdf import PdfReader
import json
import sys

reader = PdfReader(sys.argv[1])
titles = []
def walk(items):
    for item in items:
        if isinstance(item, list):
            walk(item)
        else:
            titles.append(str(getattr(item, "title", item)))
try:
    walk(reader.outline)
except Exception:
    titles = []
print(json.dumps({"count": len(titles), "titles": titles[:120]}, ensure_ascii=False))
`;
	const result = runCommand(python, ["-c", script, pdfPath], repoRoot, 60000);
	const parsed = parseJsonLine<{ count: number; titles: string[] }>(result.stdout);
	if (result.status !== 0 || !parsed) {
		report.validation.push(`FAIL: ${title} PDF bookmark audit failed.`);
		report.warnings.push(result.stderr || result.stdout || `No pypdf outline output for ${pdfPath}.`);
		return;
	}
	const missing = expectedTitles.filter((expected) => !parsed.titles.includes(expected));
	if (parsed.count === 0) {
		report.validation.push(`FAIL: ${title} has no PDF bookmarks.`);
	} else if (missing.length) {
		report.validation.push(`FAIL: ${title} PDF bookmarks are missing: ${missing.join(", ")}.`);
	} else {
		report.validation.push(`PASS: ${title} has ${parsed.count} PDF bookmarks with major sourcebook sections.`);
	}
	report.bookmarks.push({ path: pdfPath, count: parsed.count, titles: parsed.titles });
}

async function renderChunkPdf(htmlPath: string, pdfPath: string, label: string): Promise<string> {
	if (tryVivliostyleChunk(htmlPath, pdfPath, label)) return "Vivliostyle";
	if (vivlioOnly) {
		throw new Error(`Vivliostyle failed to render ${label}; --vivlio-only prevents Playwright fallback.`);
	}
	await renderWithPlaywright(htmlPath, pdfPath);
	if (!existsSync(pdfPath)) {
		throw new Error(`PDF renderer did not create ${pdfPath}`);
	}
	return "Playwright";
}

async function renderChunkedBook(definition: BookDefinition, pdfPath: string): Promise<ChunkRenderResult> {
	const chunkRoot = resolve(sharedRoot, "chunks", definition.slug);
	rmSync(chunkRoot, { recursive: true, force: true });
	mkdirSync(chunkRoot, { recursive: true });
	const pdfParts: string[] = [];
	const renderers: string[] = [];
	const bookmarks: BookmarkEntry[] = [];
	const frontHtml = resolve(chunkRoot, "000-front.html");
	const frontPdf = resolve(chunkRoot, "000-front.pdf");
	writeFileSync(frontHtml, htmlDocument(definition, frontMatterHtml(definition), `${definition.title} - Front Matter`), "utf8");
	renderers.push(await renderChunkPdf(frontHtml, frontPdf, `${definition.title} front matter`));
	pdfParts.push(frontPdf);
	const frontPageCount = await pdfInfo(frontPdf);
	bookmarks.push(
		{ title: "Cover", pageIndex: 0, level: 0 },
		{ title: "Preface", pageIndex: Math.min(1, Math.max(0, frontPageCount - 1)), level: 0 },
		{ title: "Contents", pageIndex: Math.min(2, Math.max(0, frontPageCount - 1)), level: 0 },
	);
	let pageOffset = frontPageCount;
	const parts = new Set<string>();
	for (const [index, item] of definition.sections.entries()) {
		const order = String(index + 1).padStart(3, "0");
		const chapterHtml = resolve(chunkRoot, `${order}-${slugify(item.title)}.html`);
		const chapterPdf = resolve(chunkRoot, `${order}-${slugify(item.title)}.pdf`);
		writeFileSync(
			chapterHtml,
			htmlDocument(definition, sectionHtml(definition, item, index), `${definition.title} - ${item.title}`),
			"utf8",
		);
		renderers.push(await renderChunkPdf(chapterHtml, chapterPdf, `${definition.title} / ${item.title}`));
		pdfParts.push(chapterPdf);
		if (item.part && !parts.has(item.part)) {
			bookmarks.push({ title: item.part, pageIndex: pageOffset, level: 0 });
			parts.add(item.part);
		}
		bookmarks.push({ title: item.title, pageIndex: pageOffset, level: item.part ? 1 : 0 });
		pageOffset += await pdfInfo(chapterPdf);
	}
	await mergePdfFiles(pdfParts, pdfPath, definition.title);
	if (!keepChunks) rmSync(chunkRoot, { recursive: true, force: true });
	const uniqueRenderers = Array.from(new Set(renderers));
	const renderer =
		uniqueRenderers.length === 1
			? `${uniqueRenderers[0]} chunked`
			: `${uniqueRenderers.join("/")} mixed chunked`;
	return { renderer, bookmarks };
}

async function pdfInfo(pdfPath: string): Promise<number> {
	const pdfinfo = findExecutable(["pdfinfo.cmd", "pdfinfo"]);
	if (pdfinfo) {
		const result = runCommand(pdfinfo, [pdfPath]);
		const match = /Pages:\s+(\d+)/i.exec(result.stdout);
		if (match) return Number(match[1]);
		report.warnings.push(
			`pdfinfo did not return a page count for ${pdfPath}; falling back to pdf-lib.`,
		);
	} else {
		report.warnings.push("pdfinfo was not found; falling back to pdf-lib.");
	}
	const loaded = await PDFDocument.load(readFileSync(pdfPath));
	return loaded.getPageCount();
}

function samplePagesForCount(pageCount: number): number[] {
	return Array.from(
		new Set(
			[
				1,
				2,
				3,
				4,
				5,
				Math.max(1, Math.floor(pageCount * 0.12)),
				Math.max(1, Math.floor(pageCount * 0.25)),
				Math.max(1, Math.floor(pageCount * 0.5)),
				Math.max(1, Math.floor(pageCount * 0.75)),
				Math.max(1, pageCount - 2),
				Math.max(1, pageCount - 1),
				pageCount,
			].filter((page) => page > 0 && page <= pageCount),
		),
	);
}

function auditNoHtmlExports() {
	const htmlFiles = existsSync(exportRoot)
		? readdirSync(exportRoot)
				.filter((file) => extname(file).toLowerCase() === ".html")
				.map((file) => resolve(exportRoot, file))
		: [];
	if (htmlFiles.length) {
		report.validation.push(`FAIL: HTML deliverables remain in books/exports: ${htmlFiles.join(", ")}`);
	} else {
		report.validation.push("PASS: books/exports contains no HTML deliverables.");
	}
}

function auditPdfLayout(definition: Pick<BookDefinition, "title">, pdfPath: string) {
	const python = findPythonExecutable();
	if (!python) {
		report.validation.push(`FAIL: ${definition.title} severe-overlap audit skipped because Python/pdfplumber was not found.`);
		return;
	}
	const script = String.raw`
import json
import math
import sys
import pdfplumber

path = sys.argv[1]
issues = []
max_issues = 24
with pdfplumber.open(path) as pdf:
    for page_index, page in enumerate(pdf.pages):
        if page_index == 0:
            continue
        words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False, use_text_flow=False) or []
        words = [w for w in words if str(w.get("text", "")).strip()]
        words.sort(key=lambda w: (float(w.get("top", 0)), float(w.get("x0", 0))))
        for i, a in enumerate(words):
            if len(issues) >= max_issues:
                break
            ax0 = float(a.get("x0", 0)); ax1 = float(a.get("x1", 0))
            ay0 = float(a.get("top", 0)); ay1 = float(a.get("bottom", 0))
            aw = max(0.1, ax1 - ax0); ah = max(0.1, ay1 - ay0)
            if aw < 1.5 or ah < 1.5:
                continue
            for b in words[i + 1:i + 140]:
                by0 = float(b.get("top", 0))
                if by0 - ay1 > 6:
                    break
                bx0 = float(b.get("x0", 0)); bx1 = float(b.get("x1", 0))
                by1 = float(b.get("bottom", 0))
                bw = max(0.1, bx1 - bx0); bh = max(0.1, by1 - by0)
                inter_w = max(0, min(ax1, bx1) - max(ax0, bx0))
                inter_h = max(0, min(ay1, by1) - max(ay0, by0))
                if inter_w < 2.5 or inter_h < 2.0:
                    continue
                overlap_ratio = (inter_w * inter_h) / max(0.1, min(aw * ah, bw * bh))
                width_ratio = inter_w / max(0.1, min(aw, bw))
                height_ratio = inter_h / max(0.1, min(ah, bh))
                if overlap_ratio >= 0.42 and width_ratio >= 0.35 and height_ratio >= 0.45:
                    issues.append({
                        "page": page_index + 1,
                        "a": str(a.get("text", ""))[:40],
                        "b": str(b.get("text", ""))[:40],
                        "overlap": round(overlap_ratio, 3),
                    })
                    break
            if len(issues) >= max_issues:
                break
        if len(issues) >= max_issues:
            break
print(json.dumps({"issues": issues}, ensure_ascii=False))
`;
	const result = runCommand(python, ["-c", script, pdfPath], repoRoot, 240000);
	const parsed = parseJsonLine<{ issues: Array<{ page: number; a: string; b: string; overlap: number }> }>(
		result.stdout,
	);
	if (result.status !== 0 || !parsed) {
		report.validation.push(`FAIL: ${definition.title} severe-overlap audit failed.`);
		report.warnings.push(result.stderr || result.stdout || `No pdfplumber layout output for ${pdfPath}.`);
		return;
	}
	if (parsed.issues.length) {
		const examples = parsed.issues
			.slice(0, 5)
			.map((issue) => `p.${issue.page} "${issue.a}" over "${issue.b}" (${issue.overlap})`)
			.join("; ");
		report.validation.push(`FAIL: ${definition.title} has severe text-overlap candidates: ${examples}.`);
	} else {
		report.validation.push(`PASS: ${definition.title} severe text-overlap audit found no candidates.`);
	}
}

async function renderSamples(pdfPath: string, pageCount: number, slug: string) {
	const pdftoppm = findExecutable(["pdftoppm.cmd", "pdftoppm"]);
	if (!pdftoppm) {
		report.warnings.push("pdftoppm was not found; sample rendering skipped.");
		return;
	}
	const pages = samplePagesForCount(pageCount);
	const bookSampleRoot = resolve(sampleRoot, slug);
	if (existsSync(bookSampleRoot)) {
		rmSync(bookSampleRoot, { recursive: true, force: true });
	}
	mkdirSync(bookSampleRoot, { recursive: true });
	for (const page of pages) {
		const prefix = resolve(bookSampleRoot, `page-${String(page).padStart(4, "0")}`);
		const result = runCommand(pdftoppm, [
			"-f",
			String(page),
			"-l",
			String(page),
			"-png",
			"-r",
			"150",
			pdfPath,
			prefix,
		]);
		if (result.status !== 0) {
			report.warnings.push(`Sample render failed for ${pdfPath} page ${page}.`);
			continue;
		}
		const files = readdirSync(bookSampleRoot)
			.filter((file) => file.startsWith(`page-${String(page).padStart(4, "0")}`))
			.map((file) => resolve(bookSampleRoot, file));
		for (const file of files) {
			if (extname(file).toLowerCase() === ".png") {
				const metadata = await sharp(file).metadata();
				const stats = await sharp(file).stats();
				const channels = stats.channels.slice(0, 3);
				const avg =
					channels.reduce((sum, channel) => sum + channel.mean, 0) /
					Math.max(1, channels.length);
				if (!metadata.width || !metadata.height || statSync(file).size < 5000) {
					report.validation.push(`FAIL: Rendered sample appears empty or clipped: ${file}`);
				}
				if (avg < 4 || avg > 251) {
					report.validation.push(`FAIL: Rendered sample has extreme brightness (${avg.toFixed(1)}): ${file}`);
				} else if (page > 1 && avg < 24) {
					report.warnings.push(`Rendered sample may be overdense (${avg.toFixed(1)}): ${file}`);
				}
				report.renderedSamples.push(file);
			}
		}
	}
}

const bannedPdfPatterns = [
	{ label: "sandbox", pattern: /\bsandbox\b/i },
	{ label: "Run Silent", pattern: /\bRun Silent\b/i },
	{ label: "VTT", pattern: /\bVTT\b/i },
	{ label: "handout", pattern: /\bhandouts?\b/i },
	{ label: "campaign module", pattern: /\bcampaign module\b/i },
	{ label: "campaign chapter", pattern: /\bcampaign chapter\b/i },
	{ label: "campaign appendix", pattern: /\bcampaign append/i },
	{ label: "session outline", pattern: /\bsession outline\b/i },
	{ label: "Gloamreach", pattern: /\bGloamreach\b/i },
	{ label: "The Quiet", pattern: /\bThe Quiet\b/i },
	{ label: "Hunt Clock", pattern: /\bHunt Clock\b/i },
	{ label: "Running This Horror", pattern: /\bRunning This Horror\b/i },
];

const runSilentRequiredPdfPatterns = [
	{ label: "Run Silent", pattern: /\bRun Silent\b/i },
	{ label: "Gloamreach", pattern: /\bGloamreach\b/i },
	{ label: "The Quiet", pattern: /\bThe Quiet\b/i },
	{ label: "Hunt Clock", pattern: /\bHunt Clock\b/i },
	{ label: "First Entry", pattern: /\bFirst Entry\b/i },
	{ label: "Bureau Threshold Cordon", pattern: /Bureau\s*Threshold\s*Cordon/i },
	{ label: "AFA sync", pattern: /AFA\s*sync/i },
	{ label: "Requisition", pattern: /\bRequisition\b/i },
	{ label: "Threshold crossing", pattern: /Threshold\s*crossing/i },
	{ label: "Survey Layer", pattern: /Survey\s*Layer/i },
	{ label: "Black Road", pattern: /Black\s*Road/i },
	{ label: "First Road", pattern: /First\s*Road/i },
	{ label: "relay spike", pattern: /relay\s*spike/i },
	{ label: "first contradiction", pattern: /first\s*contradiction/i },
	{ label: "first safehold", pattern: /first\s*safehold/i },
	{ label: "Vehicle", pattern: /\bVehicle\b/i },
	{ label: "Mount", pattern: /\bMount\b/i },
];

const runSilentForbiddenPdfPatterns = [
	{ label: "removed memory prelude", pattern: new RegExp("\\bMemory-" + "Care\\b", "i") },
	{ label: "removed opening label", pattern: new RegExp("\\bDay " + "Zero\\b", "i") },
	{ label: "D&D", pattern: /\bD&D\b/i },
	{ label: "5e", pattern: /\b5e\b/i },
	{ label: "Curse of Strahd", pattern: /\bCurse of Strahd\b/i },
	{ label: "sandbox-timeline.ts", pattern: /\bsandbox-timeline\.ts\b/i },
];

const glasslineRequiredPdfPatterns = [
	{ label: "The Glassline Claim", pattern: /The\s*Glassline\s*Claim/i },
	{ label: "Scene 0 New License Day", pattern: /Scene\s*0\s*:\s*New\s*License\s*Day/i },
	{ label: "L-3 Glassline Haul Sector", pattern: /L\s*-\s*3\s*Glassline\s*Haul\s*Sector/i },
	{ label: "L3-HOUND", pattern: /L3\s*-\s*HOUND/i },
	{ label: "Ironclad Rift-Hauler", pattern: /Ironclad\s*Rift\s*-\s*Hauler/i },
	{ label: "Ironclad Contract Briefing", pattern: /Ironclad\s*Contract\s*Briefing/i },
	{ label: "Bureau Threshold Intake", pattern: /Bureau\s*Threshold\s*Intake/i },
	{ label: "First Corridor Escort", pattern: /First\s*Corridor\s*Escort/i },
	{ label: "Survey Marker L-3", pattern: /Survey\s*Marker\s*L\s*-\s*3/i },
	{ label: "Rival Claim Dispute", pattern: /Rival\s*Claim\s*Dispute/i },
	{ label: "The Glassline Seam", pattern: /The\s*Glassline\s*Seam/i },
	{ label: "Claim Guardian", pattern: /Claim\s*Guardian/i },
	{ label: "Debrief And Carryover", pattern: /Debrief\s*And\s*Carryover/i },
	{ label: "Rewards", pattern: /\bRewards\b/i },
	{ label: "Run Silent Transition Hook", pattern: /Run\s*Silent\s*Transition\s*Hook|Professional\s*Referral/i },
	{ label: "Eternal Shadow Dungeon", pattern: /Eternal\s*Shadow\s*Dungeon/i },
	{ label: "location-0001", pattern: /location\s*-\s*0001/i },
	{ label: "anomaly-0021", pattern: /anomaly\s*-\s*0021/i },
	{ label: "anomaly-0061", pattern: /anomaly\s*-\s*0061/i },
	{ label: "anomaly-0081", pattern: /anomaly\s*-\s*0081/i },
	{ label: "anomaly-0141", pattern: /anomaly\s*-\s*0141/i },
];

const glasslineForbiddenPdfPatterns = [
	{ label: "campaign-region lore", pattern: /\bGloamreach\b/i },
	{ label: "removed memory prelude", pattern: new RegExp("\\bMemory-" + "Care\\b", "i") },
	{ label: "removed opening label", pattern: new RegExp("\\bDay " + "Zero\\b", "i") },
	{ label: "The Worn", pattern: /\bThe\s*Worn\b/i },
	{ label: "Worn Dead", pattern: /\bWorn\s*Dead\b/i },
	{ label: "The Quiet", pattern: /\bThe\s*Quiet\b/i },
	{ label: "Hunt Clock", pattern: /\bHunt\s*Clock\b/i },
	{ label: "Running This Horror", pattern: /\bRunning\s*This\s*Horror\b/i },
	{ label: "Dread", pattern: /\bDread\b/i },
	{ label: "sandbox", pattern: /\bsandbox\b/i },
	{ label: "D&D", pattern: /\bD&D\b/i },
	{ label: "5e", pattern: /\b5e\b/i },
];

function auditPdfContent(definition: Pick<BookDefinition, "title" | "slug">, pdfPath: string) {
	const isRunSilent = definition.slug === "run-silent";
	const isGlasslineClaim = definition.slug === "glassline-claim";
	const text = extractPdfText(pdfPath, `${definition.title} PDF audit`, { preserveCampaignTerms: isRunSilent || isGlasslineClaim });
	if (!text) {
		report.warnings.push(`Text audit skipped for ${definition.title}; PDF text extraction returned no content.`);
		return;
	}
	if (isRunSilent) {
		const missing = runSilentRequiredPdfPatterns
			.filter(({ pattern }) => !pattern.test(text))
			.map(({ label }) => label);
		const forbidden = runSilentForbiddenPdfPatterns
			.filter(({ pattern }) => pattern.test(text))
			.map(({ label }) => label);
		if (missing.length) {
			report.validation.push(
				`FAIL: ${definition.title} is missing required campaign terms: ${missing.join(", ")}.`,
			);
		} else {
			report.validation.push(
				`PASS: ${definition.title} contains required Run Silent campaign anchors.`,
			);
		}
		if (forbidden.length) {
			report.validation.push(
				`FAIL: ${definition.title} contains removed legacy or out-of-system terms: ${forbidden.join(", ")}.`,
			);
		} else {
			report.validation.push(
				`PASS: ${definition.title} contains no removed legacy or out-of-system terms.`,
			);
		}
		return;
	}
	if (isGlasslineClaim) {
		const rawText = extractRawPdfText(pdfPath, `${definition.title} raw PDF audit`);
		const missing = glasslineRequiredPdfPatterns
			.filter(({ pattern }) => !pattern.test(text))
			.map(({ label }) => label);
		const missingAfterRawFallback = missing.filter((label) => {
			if (label !== "Run Silent Transition Hook") return true;
			return !/Run\s*Silent\s*Transition\s*Hook|Professional\s*Referral/i.test(rawText);
		});
		const forbidden = glasslineForbiddenPdfPatterns
			.filter(({ pattern }) => pattern.test(text))
			.map(({ label }) => label);
		if (missingAfterRawFallback.length) {
			report.validation.push(
				`FAIL: ${definition.title} is missing required one-shot anchors: ${missingAfterRawFallback.join(", ")}.`,
			);
		} else {
			report.validation.push(
				`PASS: ${definition.title} contains required Glassline Claim one-shot anchors.`,
			);
		}
		if (forbidden.length) {
			report.validation.push(
				`FAIL: ${definition.title} contains excluded campaign or out-of-system terms: ${forbidden.join(", ")}.`,
			);
		} else {
			report.validation.push(
				`PASS: ${definition.title} contains no excluded campaign or out-of-system terms.`,
			);
		}
		return;
	}
	const hits = bannedPdfPatterns
		.filter(({ pattern }) => pattern.test(text))
		.map(({ label }) => label);
	if (hits.length) {
		report.validation.push(
			`FAIL: ${definition.title} contains banned campaign/sandbox leakage terms: ${hits.join(", ")}.`,
		);
	} else {
		report.validation.push(
			`PASS: ${definition.title} contains no banned campaign/sandbox leakage terms.`,
		);
	}
}

async function renderBook(definition: BookDefinition): Promise<RenderedBook> {
	await prepareBookAssets(definition);
	const pdfPath = resolve(exportRoot, `${definition.outputBase}.pdf`);
	let htmlPath = "";
	const { renderer, bookmarks } = await renderChunkedBook(definition, pdfPath);
	await stampGlobalPageNumbers(pdfPath, definition.title);
	applyPdfBookmarks(pdfPath, definition.title, bookmarks);
	const pageCount = await pdfInfo(pdfPath);
	const minimumPageTarget = definition.minimumPageTarget ?? (definition.requiredPageTarget ? 300 : 0);
	if (minimumPageTarget && pageCount < minimumPageTarget) {
			report.validation.push(
				`FAIL: ${definition.title} is ${pageCount} pages, below the ${minimumPageTarget}-page sourcebook target. No filler was added.`,
			);
	} else if (pageCount < 300) {
			report.validation.push(
				`WARN: ${definition.title} is ${pageCount} pages. Companion books are not padded to 300 pages.`,
			);
	} else {
		report.validation.push(
			`PASS: ${definition.title} is ${pageCount} pages using genuine source content.`,
		);
	}
	const pdfBytes = statSync(pdfPath).size;
	if (pdfBytes > pdfReviewSizeBytes) {
		report.validation.push(
			`FAIL: ${definition.title} is ${(pdfBytes / 1024 / 1024).toFixed(2)} MB, above the hard-review 100 MB PDF size budget.`,
		);
	} else if (pdfBytes > pdfWarningSizeBytes) {
		report.validation.push(
			`WARN: ${definition.title} is ${(pdfBytes / 1024 / 1024).toFixed(2)} MB, above the preferred 75 MB PDF size budget.`,
		);
	} else {
		report.validation.push(
			`PASS: ${definition.title} is ${(pdfBytes / 1024 / 1024).toFixed(2)} MB, within the preferred PDF size budget.`,
		);
	}
	auditPdfContent(definition, pdfPath);
	auditPdfBookmarks(pdfPath, definition.title);
	auditPdfLayout(definition, pdfPath);
	report.pdfs.push({ path: pdfPath, pages: pageCount, renderer });
	await renderSamples(pdfPath, pageCount, definition.slug);
	return { definition, htmlPath, pdfPath, pageCount, renderer };
}

function writeReports() {
	const buildReportPath = resolve(sharedRoot, "pdf_build_report.md");
	const validationReportPath = resolve(sharedRoot, "validation_report.md");
	const generatedSourcePaths = Array.from(
		new Set([
			...report.generatedSources,
			...(verifyOnly
				? [validationReportPath]
				: [buildReportPath, validationReportPath]),
		]),
	);
	const missingAssets = Array.from(
		new Map(
			report.missingAssets.map((asset) => [
				`${asset.context}|${asset.path}|${asset.reason}`,
				asset,
			]),
		).values(),
	);
	const commandText = report.commands
		.map(
			(command) =>
				`- \`${command.command}\` -> ${command.status}\n${command.stderr ? `  - stderr: ${command.stderr.slice(0, 1000)}` : ""}`,
		)
		.join("\n");
	const pdfText = report.pdfs
		.map(
			(pdf) => {
				const bytes = existsSync(pdf.path) ? statSync(pdf.path).size : 0;
				const mb = bytes ? (bytes / 1024 / 1024).toFixed(2) : "missing";
				return `- ${pdf.path}\n  - Renderer: ${pdf.renderer}\n  - Page count: ${pdf.pages}\n  - File size: ${mb} MB (${bytes} bytes)`;
			},
		)
		.join("\n");
	const validationText = report.validation.length
		? report.validation.map((item) => `- ${item}`).join("\n")
		: "- Not run";
	const sampleText = report.renderedSamples.length
		? report.renderedSamples.map((file) => `- ${file}`).join("\n")
		: "- None";
	const optimizedAssetText = report.optimizedAssets.length
		? Array.from(
				new Map(
					report.optimizedAssets.map((asset) => [
						`${asset.source}|${asset.output}`,
						asset,
					]),
				).values(),
			)
				.map((asset) => `- ${asset.source} -> ${asset.output}`)
				.join("\n")
		: "- None";
	const imageQualityText = report.imageQuality.length
		? report.imageQuality.map((item) => `- ${item}`).join("\n")
		: "- Not checked";
	const missingAssetText = missingAssets.length
		? missingAssets
				.map((asset) => `- ${asset.context}: ${asset.path} (${asset.reason})`)
				.join("\n")
		: "- None";
	const rendererFallbackText = vivlioOnly
		? "- Vivliostyle-only mode; Playwright fallback disabled"
		: "- Playwright Chromium fallback renderer";
	if (!verifyOnly) {
		writeFileSync(
			buildReportPath,
			`# Rift Ascendant PDF Build Report

Generated: ${buildDate}

## Tooling

- Node/tsx TypeScript exporter
${rendererFallbackText}
- Vivliostyle attempted when available
- sharp image metadata checks
- Poppler pdfinfo/pdftoppm when available
- Optimized cover/chapter art generated from existing local assets

## Commands Run

${commandText || "- No external commands recorded."}

## Generated Support Files

${generatedSourcePaths.map((file) => `- ${file}`).join("\n")}

## PDF Files Generated

${pdfText}

## Validation Results

${validationText}

## Missing Assets

${missingAssetText}

## Optimized Assets

${optimizedAssetText}

## Image Quality Checks

${imageQualityText}

## Rendered Sample Pages

${sampleText}

## Warnings

${report.warnings.length ? report.warnings.map((item) => `- ${item}`).join("\n") : "- None"}

## Failed Export Attempts

${report.failedExportAttempts.length ? report.failedExportAttempts.map((item) => `- ${item}`).join("\n") : "- None"}

## Final PDF Paths

${report.pdfs.map((pdf) => `- ${pdf.path}`).join("\n")}
`,
			"utf8",
		);
	}
	report.generatedSources = generatedSourcePaths;
	writeFileSync(
		validationReportPath,
		`# Rift Ascendant PDF Validation Report

Generated: ${buildDate}

## Page Count Validation

${report.validation.map((item) => `- ${item}`).join("\n")}

## Missing Assets

${missingAssetText}

## Image Quality Checks

${imageQualityText}

## Rendered Sample Pages

${report.renderedSamples.map((file) => `- ${file}`).join("\n")}

## Visual/Technical Warnings

${report.warnings.length ? report.warnings.map((item) => `- ${item}`).join("\n") : "- None"}

## Content Integrity Rules

- No filler, generic RPG prose, repeated boilerplate, or artificial page padding was added by the build script.
- If a PDF is under 300 pages, validation reports failure instead of padding.
- Source content comes from Rift Ascendant repo documents, data packs, mechanics files, and existing local assets.
`,
		"utf8",
	);
	report.generatedSources.push(
		...(verifyOnly
			? [validationReportPath]
			: [buildReportPath, validationReportPath]),
	);
}

async function verifyExisting() {
	const definitions = sourcebookVolumes.filter(
		(definition) => !onlyBook || definition.slug === onlyBook,
	);
	removeStaleCampaignOutputs();
	for (const definition of definitions) {
		const pdfPath = resolve(exportRoot, `${definition.outputBase}.pdf`);
		if (!existsSync(pdfPath)) {
			report.validation.push(`FAIL: Missing PDF ${pdfPath}`);
			continue;
		}
		const pageCount = await pdfInfo(pdfPath);
		report.pdfs.push({ path: pdfPath, pages: pageCount, renderer: "Existing PDF" });
		const minimumPageTarget = definition.minimumPageTarget ?? 0;
		if (minimumPageTarget && pageCount < minimumPageTarget) {
			report.validation.push(`FAIL: ${definition.title} is ${pageCount} pages, below the ${minimumPageTarget}-page sourcebook target.`);
		} else if (pageCount < 300) {
			report.validation.push(`WARN: ${definition.title} is ${pageCount} pages. Companion books are not padded.`);
		} else {
			report.validation.push(`PASS: ${definition.title} is ${pageCount} pages.`);
		}
		const pdfBytes = statSync(pdfPath).size;
		if (pdfBytes > pdfReviewSizeBytes) {
			report.validation.push(`FAIL: ${definition.title} is ${(pdfBytes / 1024 / 1024).toFixed(2)} MB, above the hard-review 100 MB PDF size budget.`);
		} else if (pdfBytes > pdfWarningSizeBytes) {
			report.validation.push(`WARN: ${definition.title} is ${(pdfBytes / 1024 / 1024).toFixed(2)} MB, above the preferred 75 MB PDF size budget.`);
		} else {
			report.validation.push(`PASS: ${definition.title} is ${(pdfBytes / 1024 / 1024).toFixed(2)} MB, within the preferred PDF size budget.`);
		}
		auditPdfContent(definition, pdfPath);
		auditPdfBookmarks(pdfPath, definition.title);
		auditPdfLayout(definition, pdfPath);
		await renderSamples(pdfPath, pageCount, definition.slug);
	}
	auditNoHtmlExports();
	writeReports();
}

function reportValidationFailures(): boolean {
	const failures = report.validation.filter((item) => item.startsWith("FAIL"));
	if (!failures.length) return false;
	console.error(failures.join("\n"));
	process.exitCode = 1;
	return true;
}

async function main() {
	console.log("[build-books] main() invoked.");
	if (onlyBook && !sourcebookVolumeBySlug[onlyBook]) {
		throw new Error(
			`Unknown --only value "${onlyBook}". Use ${activeBookSlugs.join(", ")}.`,
		);
	}
	ensureDirs();
	console.log("[build-books] ensureDirs() done.");
	removeHtmlDeliverables();
	removeStaleCampaignOutputs();
	report.tooling.push(`Node ${process.version}`);
	report.tooling.push(
		vivlioOnly
			? "Vivliostyle-only rendering requested; Playwright fallback disabled"
			: "Playwright PDF renderer available through project dependency",
	);
	if (verifyOnly) {
		await verifyExisting();
		if (reportValidationFailures()) return;
		console.log(report.pdfs.map((pdf) => `${pdf.path} (${pdf.pages} pages)`).join("\n"));
		return;
	}
	const builds = [
		{ slug: "ascendant" as const, build: buildAscendantBook },
		{ slug: "warden" as const, build: buildWardenBook },
		{ slug: "worldbook" as const, build: buildWorldbookBook },
		{ slug: "awakened-arts" as const, build: buildAwakenedArtsBook },
		{ slug: "vaults" as const, build: buildVaultsBook },
		{ slug: "anomaly-manual" as const, build: buildAnomalyManual },
		{ slug: "run-silent" as const, build: buildRunSilentBook },
		{ slug: "glassline-claim" as const, build: buildGlasslineClaimBook },
	].filter((item) => !onlyBook || item.slug === onlyBook);
	for (const { build, slug } of builds) {
		console.log(`[build-books] Building ${slug}...`);
		const book = build();
		assertSourcebookDefinitionMatchesInventory(book);
		console.log(`[build-books] renderBook starting for ${slug}...`);
		await renderBook(book);
		console.log(`[build-books] renderBook finished for ${slug}.`);
	}
	removeHtmlDeliverables();
	auditNoHtmlExports();
	writeReports();
	if (reportValidationFailures()) return;
	console.log(report.pdfs.map((pdf) => `${pdf.path} (${pdf.pages} pages)`).join("\n"));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
