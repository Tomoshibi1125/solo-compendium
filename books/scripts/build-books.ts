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

type EntryRecord = Record<string, unknown>;

interface MissingAsset {
	context: string;
	path: string;
	reason: string;
}

type BookSlug = "ascendant" | "warden" | "vaults" | "anomaly-manual";

interface BookDefinition {
	slug: BookSlug;
	title: string;
	subtitle: string;
	classification: string;
	outputBase: string;
	coverImage: string;
	sections: BookSection[];
	requiredPageTarget?: boolean;
	minimumPageTarget?: number;
}

interface BookSection {
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
const activeOutputBases = [
	"Rift Ascendant - Ascendant Guide",
	"Rift Ascendant - Warden Guide",
	"Rift Ascendant - Vaults of the Rift",
	"Rift Ascendant - Anomaly Manual",
];
const staleOutputBases = ["Rift Ascendant - Run Silent Campaign"];
const activeBookSlugs: BookSlug[] = ["ascendant", "warden", "vaults", "anomaly-manual"];
const vivliostyleFullBookByteLimit = 1_500_000;
const heroImageMinDimension = 900;
const heroImageTargetDimension = 2200;
const heroImageJpegQuality = 82;
const pdfWarningSizeBytes = 75 * 1024 * 1024;
const pdfReviewSizeBytes = 100 * 1024 * 1024;
const buildDate = new Date().toISOString().slice(0, 10);
const verifyOnly = process.argv.includes("--verify-only");
const keepChunks = process.argv.includes("--keep-chunks");
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
	ascendantWorld: "/ui-art/gate-portal-3d.webp",
	ascendantJobs: `${RA_CANDIDATE_ROOT}/character-character-striker-fsk9mx-v1-1749336172.png`,
	ascendantPaths: `${RA_CANDIDATE_ROOT}/character-character-holy-knight-p092r5-v1-1813314876.png`,
	ascendantBackgrounds: `${RA_CANDIDATE_ROOT}/character-character-contractor-sfraea-v1-1258837483.png`,
	ascendantAbilities: `${RA_CANDIDATE_ROOT}/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png`,
	ascendantRunes: "/generated/magical/rune-circle.webp",
	ascendantGear: `${RA_CANDIDATE_ROOT}/weapon-weapon-aetheric-compact-smg-pu1oxq-v1-4010952125.png`,
	wardenCover: "/generated/maps/premade/arcane-schematic.webp",
	wardenProcedures: `${RA_CANDIDATE_ROOT}/character-character-city-guard-1q3i9c-v1-296750299.png`,
	wardenRift: "/ui-art/gate-portal-3d.webp",
	wardenOperations: "/ui-art/system-interface.webp",
	wardenWorld: `${RA_CANDIDATE_ROOT}/map-map-vermillion-outpost-1az275-v1-3746029370.png`,
	wardenRegents: "/generated/compendium/regents/spatial-regent.webp",
	wardenAnomaly: `${RA_CANDIDATE_ROOT}/anomaly-anomaly-blessed-demonic-overlord-i0to55-v1-3897619112.png`,
	wardenRewards: "/generated/props/treasure-cache.webp",
	vaultsCover: `${RA_CANDIDATE_ROOT}/weapon-weapon-bonded-conductor-jrhva8-v1-930401703.png`,
	vaultsRunes: "/generated/magical/rune-circle.webp",
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

function sourcebookText(value: unknown): string {
	return cleanText(value)
		.replace(/```[\s\S]*?```/g, "")
		.replace(/\([^)]*(?:src\/|src\\|\.tsx?)[^)]*\)/gi, "")
		.split("\n")
		.filter((line) => !developerLinePattern.test(line) && !campaignLeakLinePattern.test(line))
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
			out.push(`<blockquote>${inlineMd(block.join(" "))}</blockquote>`);
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
				`<dt>${esc(labelize(key))}</dt><dd>${renderValue(value, depth + 1)}</dd>`,
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
	const className = options.classified ? "entry classified" : "entry";
	return `<article class="${className}" id="${slugify(`${options.context}-${title}`)}">
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
	return `<article class="statblock" id="${slugify(`anomaly-${title}`)}">
		${image ? `<figure class="entry-figure"><img src="${image}" alt="${esc(title)}"/></figure>` : ""}
		<h3>${esc(title)}</h3>
		${metaTags(entry)}
		${!isEmpty(entry.description) ? `<div class="entry-description">${mdToHtml(entry.description)}</div>` : ""}
		<div class="ability-grid">${abilityKeys
			.map(
				([label, key]) =>
					`<div><strong>${label}</strong>${esc(scores[key] ?? "-")}</div>`,
			)
			.join("")}</div>
		${renderObject(coreStats)}
		${renderObject(fields)}
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
	const guide = catalogUseGuide(title, options.context, options.anomaly ?? false);
	return `<section class="section-block">
		<div class="section-intro">
			<h2>${esc(title)}</h2>
			<p>${esc(summary)}</p>
			<p class="small muted">Reference entries: ${sorted.length}.</p>
		</div>
		${guide}
		<div class="catalog-grid">${sorted
			.map((entry, index) =>
				options.anomaly
					? renderAnomaly(entry, {
							folder: options.folder,
							context: options.context,
							includeArt: shouldFeatureEntryArt(entry, index, sorted.length, options.context, true),
						})
					: renderEntry(entry, {
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
	if (total <= 12) return true;
	if (total > 80) return false;
	if (/sample|regent|pantheon|relic|artifact/i.test(context)) return index < 8 || index % 12 === 0;
	if (isAnomaly) return index < 5;
	if (/(legendary|artifact|mythic|epic)/i.test(rarity)) return true;
	if (rank === "S" || rank === "A") return index % 3 === 0;
	return index < 6 || index % 16 === 0;
}

function catalogUseGuide(title: string, _context: string, isAnomaly: boolean): string {
	const noun = isAnomaly ? "stat block" : "entry";
	return `<aside class="sourcebook-guide">
		<h3>${esc(title)} At The Table</h3>
		<p>Read each ${noun} for its decision points first: rank, rarity, activation, cost, limits, tags, and lore hooks. In Rift Ascendant play, a catalog item should create a tactical choice, a faction consequence, or a clue about the Rift that produced it.</p>
		<p class="small muted">Curated art marks anchor entries and high-impact references; routine records stay text-first for fast lookup and manageable PDF size.</p>
	</aside>`;
}

function labelFromKey(key: string): string {
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
	return `<section class="section-block compact-section">
		<div class="section-intro">
			<h2>${esc(title)}</h2>
			<p>${esc(summary)}</p>
			<p class="small muted">Reference entries: ${sorted.length}.</p>
		</div>
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
	return (allItems as EntryRecord[]).filter((entry) => {
		const id = cleanText(entry.id).toLowerCase();
		const rarity = cleanText(entry.rarity).toLowerCase();
		return id.startsWith("base-") || rarity === "common";
	});
}

function vaultItems(): EntryRecord[] {
	const coreIds = new Set(coreItems().map((entry) => cleanText(entry.id)));
	return (allItems as EntryRecord[]).filter((entry) => !coreIds.has(cleanText(entry.id)));
}

function coreRunes(): EntryRecord[] {
	return (allRunes as EntryRecord[]).filter((entry) => {
		const rank = cleanText(entry.rank).toLowerCase();
		const rarity = cleanText(entry.rarity).toLowerCase();
		return rarity === "common" || rank === "d" || rank === "level 1 power" || rank === "level 1 technique";
	});
}

function vaultRunes(): EntryRecord[] {
	const coreIds = new Set(coreRunes().map((entry) => cleanText(entry.id)));
	return (allRunes as EntryRecord[]).filter((entry) => !coreIds.has(cleanText(entry.id)));
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

const campaignScopedPatterns = [
	/\bRun Silent\b/i,
	/\bGloamreach\b/i,
	/\bThe Quiet\b/i,
	/\bHunt Clock\b/i,
	/\bRunning This Horror\b/i,
	/\bsandbox\b/i,
];

function isCampaignScopedEntry(entry: EntryRecord): boolean {
	const title = cleanText(entry.name || entry.display_name || entry.title || entry.id);
	if (/\b(the quiet|hollowed|caller|worn|wrong shape)\b/i.test(title)) return true;
	const text = sourcebookText(JSON.stringify(entry));
	return campaignScopedPatterns.some((pattern) => pattern.test(text));
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

function extractPdfText(pdfPath: string, label = "PDF"): string {
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
	return sourcebookText(result.stdout)
		.replace(/^\s*\d+\s*$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
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
			<p>The Warden frames danger, tracks pressure, presents fair consequences, and lets the players choose how deeply to push into the Rift. Use the procedures below as table-facing rules, not software implementation notes.</p>
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

function buildAscendantBook(): BookDefinition {
	const playerCoreRunes = coreRunes();
	const playerCoreItems = coreItems();
	const sections: BookSection[] = [
		section({
			id: "world-lore",
			part: "Part 1: The Rift Age",
			title: "The Rift Age",
			kicker: "Player Field Primer",
			summary:
				"Canonical player-facing world lore, terminology, institutions, and Rift Age assumptions.",
			image: bookArt.ascendantWorld,
			body: () => proseBlock(riftWorldLore()),
		}),
		section({
			id: "core-mechanics",
			part: "Part 1: The Rift Age",
			title: "Core Rules",
			kicker: "Ascendant Systems",
			summary:
				"Player-facing d20 procedures, action economy, resources, rests, active abilities, and Rift Favor.",
			image: bookArt.ascendantAbilities,
			body: playerRulesPrimer(),
		}),
		section({
			id: "jobs",
			part: "Part 2: Creating An Ascendant",
			title: "Jobs",
			kicker: "Awakening Classifications",
			summary:
				"All canonical Jobs with progression, traits, awakening features, proficiencies, hit dice, and structured mechanics.",
			image: bookArt.ascendantJobs,
			body: renderCatalog("Jobs", "The Bureau's broad classifications for Ascendant power expression.", jobs, {
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
				"All canonical Paths, prerequisites, features, path tiers, linked Jobs, and mechanics.",
			image: bookArt.ascendantPaths,
			body: renderCatalog("Paths", "Specialized expressions of each Job.", paths, {
				context: "Path",
			}),
		}),
		section({
			id: "backgrounds",
			part: "Part 2: Creating An Ascendant",
			title: "Backgrounds",
			kicker: "Origin Records",
			summary:
				"All canonical Backgrounds with features, proficiencies, equipment, ideals, bonds, flaws, and dangers.",
			image: bookArt.ascendantBackgrounds,
			body: renderCatalog("Backgrounds", "Origin, training, and social context for Ascendants.", allBackgrounds, {
				folder: "backgrounds",
				context: "Background",
			}),
		}),
		section({
			id: "skills-feats-styles",
			part: "Part 2: Creating An Ascendant",
			title: "Skills, Feats, And Fighting Styles",
			kicker: "Build Options",
			summary:
				"All canonical skills, feats, and fighting styles with benefits, prerequisites, and rules fields.",
			image: bookArt.ascendantAbilities,
			body:
				renderCatalog("Skills", "Canonical skill benefits and ability associations.", comprehensiveSkills, {
					context: "Skill",
				}) +
				renderCatalog("Feats", "Canonical feats, prerequisites, benefits, and repeatability.", comprehensiveFeats, {
					context: "Feat",
				}) +
				renderCatalog("Fighting Styles", "Canonical fighting style choices and combat cues.", FIGHTING_STYLES, {
					context: "Fighting Style",
				}),
		}),
		section({
			id: "techniques-powers-spells",
			part: "Part 3: Powers And Gear",
			title: "Techniques, Powers, And Spells",
			kicker: "Active Ability Catalog",
			summary:
				"All three RA ability categories with activation, range, duration, components, effects, limitations, and scaling.",
			image: bookArt.ascendantAbilities,
			body:
				renderCompactCatalog("Techniques", "Martial and tactical abilities, including uses, limitations, and scaling.", techniques, {
					context: "Technique",
					kind: "ability",
				}) +
				renderCompactCatalog("Powers", "Innate or Job-driven powers with primary ability, recharge, and scaling data.", powers, {
					context: "Power",
					kind: "ability",
				}) +
				renderCompactCatalog("Spells", "Spell-slot abilities with casting time, range, duration, components, and structured spell data.", spells, {
					context: "Spell",
					kind: "ability",
				}),
		}),
		section({
			id: "runes-sigils-tattoos",
			part: "Part 3: Powers And Gear",
			title: "Runes, Sigils, And Tattoos",
			kicker: "Inscribed Power",
			summary:
				"All canonical learning runes, sigils, and tattoos with restrictions, activation, passive bonuses, and lore.",
			image: bookArt.ascendantRunes,
			body:
				runePrimer() +
				splitNotice(
					"Core And Vault Split",
					"The Ascendant Guide includes common, Rank D, and level-1 learning runes for character creation and early play. Higher-rank and rarer runes are printed in Vaults of the Rift so the core player guide stays usable at the table.",
				) +
				renderCompactCatalog("Core Runes", "Core learning runes for character creation, early advancement, and common table lookup.", playerCoreRunes, {
					context: "Rune",
					kind: "rune",
				}) +
				renderCatalog("Sigils", "Permanent and active inscription effects.", sigils, {
					context: "Sigil",
				}) +
				renderCatalog("Tattoos", "Attunement tattoos, body locations, active veins, and resonance effects.", tattoos, {
					context: "Tattoo",
				}),
		}),
		section({
			id: "equipment-relics-vehicles",
			part: "Part 3: Powers And Gear",
			title: "Equipment, Relics, Artifacts, And Vehicles",
			kicker: "Field Inventory",
			summary:
				"All canonical items, relics, artifacts, vehicles, mounts, equipment rules, costs, properties, and mechanics.",
			image: bookArt.ascendantGear,
			body:
				splitNotice(
					"Core And Vault Split",
					"The Ascendant Guide includes base equipment and common field items. Uncommon, rare, epic, and legendary equipment move to Vaults of the Rift, matching the way expanded treasure books keep a core rulebook readable.",
				) +
				renderCompactCatalog("Core Equipment And Items", "Base equipment and common field items for player-facing character creation and table lookup.", playerCoreItems, {
					context: "Item",
					kind: "item",
				}) +
				renderCatalog("Relics", "Named high-power Rift artifacts and their mechanics.", comprehensiveRelics, {
					folder: "relics",
					context: "Relic",
				}) +
				renderCatalog("Artifacts", "Major artifact records presented as table-facing references.", artifacts, {
					folder: "artifacts",
					context: "Artifact",
				}) +
				renderCatalog("Vehicles And Mounts", "Mounts, land, air, water, and Rift vehicles.", allVehicles, {
					context: "Vehicle",
				}),
		}),
		section({
			id: "conditions-index",
			part: "Appendices",
			title: "Conditions And Player Index",
			kicker: "Reference",
			summary:
				"Condition rules and alphabetical references for table lookup.",
			image: bookArt.ascendantWorld,
			body:
				renderCatalog("Conditions", "Canonical condition effects, stages, duration, and removal rules.", conditions, {
					context: "Condition",
				}) +
				renderReferenceIndex("Ascendant Guide Index", {
					Jobs: jobs,
					Paths: paths,
					Backgrounds: allBackgrounds,
					Skills: comprehensiveSkills,
					Feats: comprehensiveFeats,
					Techniques: techniques,
					Powers: powers,
					Spells: spells,
					Runes: playerCoreRunes,
					Sigils: sigils,
					Tattoos: tattoos,
					Items: playerCoreItems,
					Relics: comprehensiveRelics,
					Vehicles: allVehicles,
				}),
		}),
	];
	return {
		slug: "ascendant",
		title: "Rift Ascendant - Ascendant Guide",
		subtitle:
			"A full player-facing sourcebook compiled from canonical Rift Ascendant rules, mechanics, and compendium data.",
		classification: "Player Field Edition",
		outputBase: "Rift Ascendant - Ascendant Guide",
		coverImage: bookArt.ascendantCover,
		sections,
		requiredPageTarget: true,
	};
}

function buildWardenBook(): BookDefinition {
	const sections: BookSection[] = [
		section({
			id: "warden-procedures",
			part: "Part 1: Warden Operations",
			title: "Running Rift Ascendant",
			kicker: "Warden Operations",
			summary:
				"Canonical Warden-facing procedures, world systems, encounter budgets, Rift pressure, and anomaly adjudication.",
			image: bookArt.wardenProcedures,
			body: () => wardenRulesPrimer(),
		}),
		section({
			id: "pressure-clocks",
			part: "Part 1: Warden Operations",
			title: "Pressure Clocks And Scene Control",
			kicker: "Visible Consequences",
			summary:
				"Open Warden clocks for containment, hunting anomalies, civilian danger, Rift collapse, and faction heat.",
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
		title: "Rift Ascendant - Warden Guide",
		subtitle:
			"A Warden-facing sourcebook for running Rift Ascendant: Rift hazards, Domain pressure, encounter math, factions, rewards, adjudication, and world operations.",
		classification: "Warden Classified Edition",
		outputBase: "Rift Ascendant - Warden Guide",
		coverImage: bookArt.wardenCover,
		sections,
		minimumPageTarget: 250,
	};
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
			id: "relics-artifacts",
			part: "Part 4: Relics And Artifacts",
			title: "Relics And Artifacts",
			kicker: "Rift Treasure",
			summary:
				"Named Relics, artifacts, activation rules, limitations, rarity, lore, and mechanics.",
			image: bookArt.vaultsRelics,
			body: () =>
				renderCatalog("Relics", "Named high-power Rift artifacts and their mechanics.", comprehensiveRelics, {
					folder: "relics",
					context: "Relic",
				}) +
				renderCatalog("Artifacts", "Major artifact records presented as table-facing references.", artifacts, {
					folder: "artifacts",
					context: "Artifact",
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
		title: "Rift Ascendant - Vaults of the Rift",
		subtitle:
			"An expanded player-facing supplement for higher-rank runes, uncommon-to-legendary equipment, Relics, and artifacts.",
		classification: "Supplement",
		outputBase: "Rift Ascendant - Vaults of the Rift",
		coverImage: bookArt.vaultsCover,
		sections,
		requiredPageTarget: false,
	};
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
				"Procedures for reading anomaly stat blocks, tuning rank, selecting threat roles, and placing rewards.",
			image: bookArt.anomalyUsing,
			body: () =>
				anomalyDesignPrimer() +
				splitNotice(
					"Warden Guide Relationship",
					"The Warden Guide explains how to run encounters and Domains. This book is the complete stat-block catalog.",
				),
		}),
		section({
			id: "anomaly-catalog",
			part: "Part 2: Anomaly Catalog",
			title: "Anomaly Catalog",
			kicker: "Threat Stat Blocks",
			summary:
				"All canonical anomalies with stat blocks, traits, actions, resistances, vulnerabilities, ecology, rank, and reward data.",
			image: bookArt.anomalyCatalog,
			body: () =>
				renderCatalog("Anomalies", "Full general anomaly catalog for Warden reference.", anomalyCatalog, {
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
				"Shadow soldier reference entities and stat-block style support records.",
			image: bookArt.anomalyShadow,
			body: () =>
				renderCatalog("Shadow Soldiers", "Shadow soldier reference entities.", shadowCatalog, {
					context: "Shadow Soldier",
					anomaly: true,
				}),
		}),
		section({
			id: "anomaly-index",
			part: "Appendices",
			title: "Anomaly Index",
			kicker: "Reference",
			summary:
				"Generated alphabetical references for anomaly lookup.",
			image: bookArt.anomalyCatalog,
			body: () => renderReferenceIndex("Anomaly Manual Index", {
				Anomalies: anomalyCatalog,
				"Shadow Soldiers": shadowCatalog,
			}),
		}),
	];
	return {
		slug: "anomaly-manual",
		title: "Rift Ascendant - Anomaly Manual",
		subtitle:
			"The monster-manual style sourcebook for Rift Ascendant anomalies, shadow soldiers, threat roles, and stat blocks.",
		classification: "Threat Catalog",
		outputBase: "Rift Ascendant - Anomaly Manual",
		coverImage: bookArt.anomalyCover,
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
	}
}

function tocFor(definition: BookDefinition): string {
	let tocPart = "";
	return definition.sections
		.map((item) => {
			const partHeading =
				item.part && item.part !== tocPart
					? ((tocPart = item.part), `<li class="toc-part">${esc(item.part)}</li>`)
					: "";
			return `${partHeading}<li><a href="#${item.id}">${esc(item.title)}</a> - ${esc(item.summary)}</li>`;
		})
		.join("");
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
		<div class="book-code">A modern supernatural urban fantasy sourcebook.</div>
	</section>
	<section class="front-matter">
		<h1>Preface</h1>
		<div class="front-card">
			<p><strong>Using this book.</strong> Read the opening chapters first, then use the catalog chapters as table references. Rules entries are written for play: prerequisites, activation, range, duration, costs, limits, recharge cadence, ranks, rarity, and tags appear where the canon provides them.</p>
			<p><strong>Terminology.</strong> An Ascendant is an Awakened character. A Job is the broad power classification. A Path is a specialization. Techniques, Powers, and Spells are separate active ability types. A Warden is the table authority for Rifts, Domains, Anomalies, and world consequences.</p>
			<p><strong>Canon note.</strong> When a catalog entry and a prose explanation conflict, use the catalog entry at the table unless your Warden intentionally changes it for the current game.</p>
		</div>
	</section>
	<nav class="toc">
		<h1>Contents</h1>
		<ol>${tocFor(definition)}</ol>
	</nav>`;
}

function sectionHtml(definition: BookDefinition, item: BookSection, index: number): string {
	const image = optionalAsset(item.image, `${definition.title}: ${item.title}`);
	const body = typeof item.body === "function" ? item.body() : item.body;
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
	margin: 0.58in 0.56in 0.72in;
	@top-left {
		content: "Rift Ascendant";
		font-family: "Aptos", "Segoe UI", sans-serif;
		font-size: 7pt;
		color: #4b5c70;
	}
	@top-right {
		content: string(chapter-title);
		font-family: "Aptos", "Segoe UI", sans-serif;
		font-size: 7pt;
		color: #4b5c70;
	}
	@bottom-center {
		content: none;
		font-family: "Aptos", "Segoe UI", sans-serif;
		font-size: 7pt;
		color: #4b5c70;
	}
}
@page:first {
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
		font-family: "Aptos", "Segoe UI", "Arial", sans-serif;
		font-size: 10.15pt;
		line-height: 1.42;
		color: #161a20;
		background: #f6f1e8;
	}
	h1, h2, h3, h4 {
		font-family: "Aptos Display", "Aptos", "Segoe UI", sans-serif;
		letter-spacing: 0;
		color: #111827;
	}
	.chapter > .chapter-opener h1 {
		string-set: chapter-title content(text);
	}
	.cover {
		height: 11in;
		min-height: 11in;
		border: 0;
		background:
			linear-gradient(135deg, rgba(3, 6, 15, 0.96), rgba(15, 23, 42, 0.82)),
			var(--cover-image, none),
			radial-gradient(circle at 20% 18%, rgba(116, 242, 255, 0.30), transparent 33%),
			radial-gradient(circle at 88% 8%, rgba(167, 139, 250, 0.30), transparent 28%),
			#050711;
	}
	.cover h1 {
		font-size: 33pt;
		line-height: 0.98;
		letter-spacing: 0;
	}
	.cover-tile {
		border-color: rgba(116, 242, 255, 0.55);
		background: rgba(6, 13, 28, 0.82);
	}
	.front-card,
	.callout {
		background: #eef7fb;
		border: 0.7pt solid #8bd7e6;
		border-left: 4pt solid #0891b2;
	}
	.chapter-opener {
		border: 0;
		background:
			linear-gradient(135deg, rgba(7, 10, 23, 0.94), rgba(21, 28, 52, 0.78)),
			var(--chapter-image, none),
			#09101f;
		background-size: cover;
		background-position: center;
		color: #f8fbff;
	}
	.chapter-opener h1,
	.chapter-opener p,
	.chapter-opener .eyebrow {
		color: #f8fbff;
	}
	.section-intro {
		border-top: 1.8pt solid #0891b2;
		border-bottom: 0.5pt solid #b8c7d8;
		padding: 0.08in 0;
		margin-bottom: 0.13in;
	}
	.section-intro h2 {
		font-size: 16.5pt;
		color: #0f172a;
	}
	.prose-columns,
	.catalog-grid,
	.compact-catalog {
		column-gap: 0.3in;
	}
	.sourcebook-guide {
		border-top: 1.2pt solid #0f766e;
		border-bottom: 0.5pt solid #b8c7d8;
		background: #f0f8f7;
		padding: 0.1in 0.12in;
		margin-bottom: 0.14in;
	}
	.sourcebook-guide h3 {
		font-size: 11.8pt;
		color: #0f172a;
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
		background: #102033;
		color: #f8fbff;
		border-color: #324963;
	}
	td {
		background: rgba(255, 255, 255, 0.58);
	}
	.entry,
	.compact-entry,
	.statblock {
		border-radius: 2pt;
		border-color: #93a4ba;
		box-shadow: none;
	}
	.entry {
		padding: 0.095in 0.035in 0.105in;
		margin-bottom: 0.1in;
	}
	.entry h3 {
		font-size: 12.1pt;
	}
	.compact-entry {
		padding: 0.065in 0.045in 0.07in;
		margin-bottom: 0.08in;
	}
	.compact-entry h3 {
		font-size: 10.1pt;
		line-height: 1.12;
	}
	.compact-line {
		font-size: 8pt;
		line-height: 1.3;
	}
	.statblock {
		break-inside: auto;
		page-break-inside: auto;
		padding: 0.13in;
	}
	.statblock h3 {
		font-size: 13pt;
	}
	.field-grid dt {
		font-size: 7.7pt;
	}
	.nested-grid {
		display: block;
		margin: 0.02in 0;
	}
	.nested-grid dt {
		display: inline;
		font-size: 7.2pt;
		letter-spacing: 0.02em;
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
		margin-bottom: 0.025in;
	}
	.entry-figure {
		width: 1.25in;
	}
	.meta span,
	.tag {
		background: #0f253b;
		color: #ecfeff;
		border-color: #27667d;
		font-size: 7pt;
		letter-spacing: 0.03em;
	}
	.index-table {
		font-size: 8.2pt;
		column-gap: 0.22in;
	}
	.small {
		font-size: 8pt;
	}
	p, li {
		orphans: 2;
		widows: 2;
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
			env: { ...process.env, PYTHONIOENCODING: "utf-8" },
		})
		: spawnSync(command, args, {
		cwd,
		encoding: "utf8",
		windowsHide: true,
		maxBuffer: 1024 * 1024 * 50,
		timeout: timeoutMs,
		env: { ...process.env, PYTHONIOENCODING: "utf-8" },
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
	], repoRoot, 60000);
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
		120000,
	);
	if (result.status === 0 && existsSync(pdfPath)) return true;
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
			y: 23,
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
import json
import os
import sys

path = Path(sys.argv[1])
bookmarks = json.loads(sys.argv[2])
title = sys.argv[3]
reader = PdfReader(str(path))
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

function auditPdfContent(definition: Pick<BookDefinition, "title">, pdfPath: string) {
	const text = extractPdfText(pdfPath, `${definition.title} PDF audit`);
	if (!text) {
		report.warnings.push(`Text audit skipped for ${definition.title}; PDF text extraction returned no content.`);
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
	if (!verifyOnly) {
		writeFileSync(
			buildReportPath,
			`# Rift Ascendant PDF Build Report

Generated: ${buildDate}

## Tooling

- Node/tsx TypeScript exporter
- Playwright Chromium fallback renderer
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
	const definitions = [
		{
			slug: "ascendant" as const,
			title: "Rift Ascendant - Ascendant Guide",
			outputBase: "Rift Ascendant - Ascendant Guide",
			requiredPageTarget: true,
			minimumPageTarget: 300,
		},
		{
			slug: "warden" as const,
			title: "Rift Ascendant - Warden Guide",
			outputBase: "Rift Ascendant - Warden Guide",
			requiredPageTarget: false,
			minimumPageTarget: 250,
		},
		{
			slug: "vaults" as const,
			title: "Rift Ascendant - Vaults of the Rift",
			outputBase: "Rift Ascendant - Vaults of the Rift",
			requiredPageTarget: false,
		},
		{
			slug: "anomaly-manual" as const,
			title: "Rift Ascendant - Anomaly Manual",
			outputBase: "Rift Ascendant - Anomaly Manual",
			requiredPageTarget: false,
		},
	];
	removeStaleCampaignOutputs();
	for (const definition of definitions) {
		const pdfPath = resolve(exportRoot, `${definition.outputBase}.pdf`);
		if (!existsSync(pdfPath)) {
			report.validation.push(`FAIL: Missing PDF ${pdfPath}`);
			continue;
		}
		const pageCount = await pdfInfo(pdfPath);
		report.pdfs.push({ path: pdfPath, pages: pageCount, renderer: "Existing PDF" });
		const minimumPageTarget = definition.minimumPageTarget ?? (definition.requiredPageTarget ? 300 : 0);
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

async function main() {
	ensureDirs();
	removeHtmlDeliverables();
	removeStaleCampaignOutputs();
	report.tooling.push(`Node ${process.version}`);
	report.tooling.push("Playwright PDF renderer available through project dependency");
	if (verifyOnly) {
		await verifyExisting();
		return;
	}
	const builds = [
		{ slug: "ascendant" as const, build: buildAscendantBook },
		{ slug: "warden" as const, build: buildWardenBook },
		{ slug: "vaults" as const, build: buildVaultsBook },
		{ slug: "anomaly-manual" as const, build: buildAnomalyManual },
	].filter((item) => !onlyBook || item.slug === onlyBook);
	if (onlyBook && builds.length === 0) {
		throw new Error(
			`Unknown --only value "${onlyBook}". Use ${activeBookSlugs.join(", ")}.`,
		);
	}
	for (const { build } of builds) {
		// Keep each book scoped tightly; full catalog HTML can be large before Chromium paginates it.
		const book = build();
		await renderBook(book);
	}
	removeHtmlDeliverables();
	auditNoHtmlExports();
	writeReports();
	const failures = report.validation.filter((item) => item.startsWith("FAIL"));
	if (failures.length) {
		console.error(failures.join("\n"));
		process.exitCode = 1;
		return;
	}
	console.log(report.pdfs.map((pdf) => `${pdf.path} (${pdf.pages} pages)`).join("\n"));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
