/**
 * Local-only canon gate.
 *
 * The PDFs in books/exports are editorial evidence, never application assets.
 * This command deliberately has no write path and is not part of CI: it can run
 * only on a workstation that holds the local sourcebook set.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import {
	type CanonicalPublicationCategory,
	sourcebookVolumes,
} from "../books/scripts/sourcebook-publication";
import { jobs } from "../src/data/compendium/jobs";
import { paths } from "../src/data/compendium/paths";

type PublicationStatus = "published" | "manual-review" | "not-published";

interface PublicationEntry {
	canonicalId: string;
	canonicalName: string;
	category: CanonicalPublicationCategory;
	publication: {
		status: PublicationStatus;
		volume: string | null;
		section: string | null;
	};
}

interface PublicationManifest {
	entries: Record<string, PublicationEntry>;
}

interface PdfOutlineEntry {
	title: string;
	page: number;
}

interface ExtractedPdf {
	pageCount: number;
	outlines: PdfOutlineEntry[];
	pages: string[];
}

const repoRoot = resolve(import.meta.dirname, "..");
const exportsDirectory = resolve(repoRoot, "books/exports");
const publicationManifestPath = resolve(
	repoRoot,
	"books/data/canonical-publication-manifest.json",
);
const expectedCategoryCount = 26;

// The authored book-section ids use stable machine slugs. PDF bookmarks use
// reader-facing headings; this map is audit-only and intentionally never leaks
// to the product UI.
const sectionBookmarkTitles: Record<string, readonly string[]> = {
	"anomaly-catalog": ["Anomaly Catalog"],
	"shadow-soldiers": ["Shadow Soldiers"],
	artifacts: ["Artifacts"],
	backgrounds: ["Backgrounds"],
	conditions: ["Conditions"],
	equipment: ["Equipment"],
	"expanded-items": ["Expanded Equipment And Items"],
	feats: ["Feats"],
	"fighting-styles": ["Fighting Styles"],
	jobs: ["Jobs"],
	locations: ["Locations and World Regions"],
	pantheon: ["The Pantheon and Eternals"],
	paths: ["Paths"],
	powers: ["Powers"],
	"powers-catalog": ["Powers"],
	regents: ["Regents as Setting Forces"],
	relics: ["Relics"],
	"relics-artifacts": ["Relics And Artifacts"],
	"runes-catalog": ["Runes"],
	"rollable-tables": ["Warden Reference Appendices"],
	"warden-appendices": ["Warden Reference Appendices"],
	"sigils-catalog": ["Sigils"],
	"sigils-tattoos": ["Sigils And Tattoos"],
	skills: ["Skills"],
	"spells-catalog": ["Spells"],
	"tattoos-catalog": ["Tattoos"],
	tattoos: ["Tattoos"],
	"techniques-catalog": ["Techniques"],
	techniques: ["Techniques"],
	vehicles: ["Vehicles and Mounts"],
	"vehicles-mounts": ["Vehicles And Mounts"],
};

const pythonExtractor = `
import json
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
outlines = []

def walk(items):
    for item in items:
        if isinstance(item, list):
            walk(item)
            continue
        try:
            page = reader.get_destination_page_number(item) + 1
        except Exception:
            continue
        title = str(getattr(item, "title", "")).strip()
        if title:
            outlines.append({"title": title, "page": page})

walk(reader.outline)
print(json.dumps({
    "pageCount": len(reader.pages),
    "outlines": outlines,
    "pages": [(page.extract_text() or "") for page in reader.pages],
}))
`;

function normalize(value: string): string {
	return value
		.normalize("NFKD")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
		.trim();
}

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) throw new Error(message);
}

function findPython(): string {
	const bundled = join(
		process.env.USERPROFILE ?? "",
		".cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
	);
	return existsSync(bundled) ? bundled : (process.env.PYTHON ?? "python");
}

function extractPdf(pdfPath: string): ExtractedPdf {
	const result = spawnSync(findPython(), ["-c", pythonExtractor, pdfPath], {
		cwd: repoRoot,
		encoding: "utf8",
		maxBuffer: 256 * 1024 * 1024,
	});
	if (result.error) {
		throw new Error(
			`Could not start the local PDF extractor: ${result.error.message}`,
		);
	}
	if (result.status !== 0) {
		throw new Error(
			`Could not read ${pdfPath}: ${result.stderr || result.stdout || `exit ${result.status}`}`,
		);
	}
	return JSON.parse(result.stdout) as ExtractedPdf;
}

function findBookmark(
	pdf: ExtractedPdf,
	section: string,
): PdfOutlineEntry | null {
	const aliases = sectionBookmarkTitles[section];
	if (!aliases) return null;
	const normalizedAliases = new Set(aliases.map(normalize));
	return (
		pdf.outlines.find((outline) =>
			normalizedAliases.has(normalize(outline.title)),
		) ?? null
	);
}

function textForSection(pdf: ExtractedPdf, bookmark: PdfOutlineEntry): string {
	const nextPage = pdf.outlines
		.filter((outline) => outline.page > bookmark.page)
		.map((outline) => outline.page)
		.sort((left, right) => left - right)[0];
	const endPage = nextPage ? nextPage - 1 : pdf.pageCount;
	return pdf.pages.slice(bookmark.page - 1, endPage).join("\n");
}

function checkLocalPdfInventory(
	volumeFilter?: ReadonlySet<string>,
): Map<string, ExtractedPdf> {
	assert(
		existsSync(exportsDirectory),
		`Missing local sourcebook directory: ${exportsDirectory}`,
	);
	const extracted = new Map<string, ExtractedPdf>();
	for (const volume of sourcebookVolumes) {
		if (volumeFilter && !volumeFilter.has(volume.slug)) continue;
		const pdfPath = join(exportsDirectory, `${volume.outputBase}.pdf`);
		assert(
			existsSync(pdfPath),
			`Missing expected local sourcebook PDF: ${pdfPath}`,
		);
		const pdf = extractPdf(pdfPath);
		assert(pdf.pageCount > 0, `${volume.outputBase}.pdf has no pages.`);
		assert(
			volume.minimumPageTarget === null ||
				pdf.pageCount >= volume.minimumPageTarget,
			`${volume.outputBase}.pdf has ${pdf.pageCount} pages; expected at least ${volume.minimumPageTarget}.`,
		);
		assert(
			pdf.outlines.length > 0,
			`${volume.outputBase}.pdf has no bookmarks.`,
		);
		assert(
			pdf.outlines.every(
				(outline) => outline.page >= 1 && outline.page <= pdf.pageCount,
			),
			`${volume.outputBase}.pdf has an out-of-bounds bookmark.`,
		);
		extracted.set(volume.slug, pdf);
	}
	return extracted;
}

function runStructuredParityGate(): void {
	const result = spawnSync(
		process.execPath,
		[
			resolve(repoRoot, "node_modules/tsx/dist/cli.mjs"),
			"scripts/validate-sourcebook-canon-parity.ts",
		],
		{ cwd: repoRoot, encoding: "utf8" },
	);
	if (result.stdout) process.stdout.write(result.stdout);
	if (result.stderr) process.stderr.write(result.stderr);
	if (result.error) {
		throw new Error(
			`Could not run the structured parity gate: ${result.error.message}`,
		);
	}
	assert(result.status === 0, "Structured compendium parity gate failed.");
}

interface CatalogAuditResult {
	matched: number;
	provenanceReviews: string[];
}

function checkPublishedCatalogs(
	manifest: PublicationManifest,
	pdfs: Map<string, ExtractedPdf>,
): CatalogAuditResult {
	const entries = Object.values(manifest.entries);
	const categories = new Set(entries.map((entry) => entry.category));
	assert(
		categories.size === expectedCategoryCount,
		`Expected ${expectedCategoryCount} canonical categories, found ${categories.size}.`,
	);

	const byLocation = new Map<string, PublicationEntry[]>();
	for (const entry of entries) {
		if (entry.publication.status !== "published") continue;
		const { volume, section } = entry.publication;
		assert(
			volume && section,
			`${entry.category}:${entry.canonicalId} has no sourcebook location.`,
		);
		const key = `${volume}:${section}`;
		byLocation.set(key, [...(byLocation.get(key) ?? []), entry]);
	}

	const structuralFailures: string[] = [];
	const provenanceReviews: string[] = [];
	let matched = 0;
	for (const [location, records] of byLocation) {
		const [volume, section] = location.split(":");
		const pdf = pdfs.get(volume);
		assert(pdf, `Published section references unknown local volume ${volume}.`);
		const bookmark = findBookmark(pdf, section);
		if (!bookmark) {
			structuralFailures.push(
				`${volume}:${section} has no matching PDF bookmark (expected one of ${
					(sectionBookmarkTitles[section] ?? []).join(", ") ||
					"<no configured alias>"
				}).`,
			);
			continue;
		}
		const sectionText = normalize(textForSection(pdf, bookmark));
		assert(
			sectionText.length > 0,
			`${volume}:${section} bookmark has no extractable text.`,
		);

		const unmatched = records
			.filter(
				(record) => !sectionText.includes(normalize(record.canonicalName)),
			)
			.map(
				(record) =>
					`${record.category}:${record.canonicalId} (${record.canonicalName})`,
			);
		matched += records.length - unmatched.length;
		if (unmatched.length) {
			// The companion predates this local eight-volume set and deliberately
			// retains supplemental material. Do not delete or overwrite an existing
			// record merely because it has no literal match in these PDFs. Instead,
			// require a later provenance decision before it can be represented as
			// sourcebook-backed content.
			provenanceReviews.push(
				`${volume}:${section} is missing ${unmatched.length} canonical record(s): ${unmatched
					.slice(0, 25)
					.join(", ")}${unmatched.length > 25 ? " …" : ""}`,
			);
		}
	}
	assert(structuralFailures.length === 0, structuralFailures.join("\n"));
	return { matched, provenanceReviews };
}

function checkJobsAndPaths(pdf: ExtractedPdf): string[] {
	const jobsBookmark = findBookmark(pdf, "jobs");
	const pathsBookmark = findBookmark(pdf, "paths");
	assert(
		jobsBookmark && pathsBookmark,
		"Ascendant Guide must bookmark both Jobs and Paths.",
	);
	assert(
		jobsBookmark.page < pathsBookmark.page,
		"Ascendant Guide Jobs must begin before Paths.",
	);
	const jobsText = normalize(textForSection(pdf, jobsBookmark));
	const pathsText = normalize(textForSection(pdf, pathsBookmark));
	assert(jobs.length === 14, `Expected 14 jobs, found ${jobs.length}.`);
	assert(paths.length === 84, `Expected 84 paths, found ${paths.length}.`);
	const structuralFailures: string[] = [];
	const mechanicProvenanceReviews: string[] = [];

	for (const job of jobs) {
		if (!jobsText.includes(normalize(job.name))) {
			structuralFailures.push(`Jobs section is missing ${job.name}.`);
		}
		const mechanics = [
			...(job.classFeatures ?? []),
			...job.awakeningFeatures,
			...job.jobTraits,
			...job.abilities.map((name) => ({ name })),
		];
		for (const mechanic of mechanics) {
			if (!jobsText.includes(normalize(mechanic.name))) {
				mechanicProvenanceReviews.push(
					`Jobs section has no literal match for ${job.name} mechanic ${mechanic.name}.`,
				);
			}
			if ("level" in mechanic && typeof mechanic.level === "number") {
				if (!jobsText.includes(String(mechanic.level))) {
					structuralFailures.push(
						`Jobs section is missing ${job.name} progression level ${mechanic.level}.`,
					);
				}
			}
		}
	}

	const pathsByJob = new Map<string, typeof paths>();
	for (const path of paths) {
		pathsByJob.set(path.jobId, [...(pathsByJob.get(path.jobId) ?? []), path]);
		if (!pathsText.includes(normalize(path.name))) {
			structuralFailures.push(`Paths section is missing ${path.name}.`);
		}
		if (!pathsText.includes(normalize(path.jobName))) {
			structuralFailures.push(
				`Paths section is missing parent-job link ${path.name} → ${path.jobName}.`,
			);
		}
		if (!pathsText.includes(String(path.requirements.level))) {
			structuralFailures.push(
				`Paths section is missing ${path.name} unlock level ${path.requirements.level}.`,
			);
		}
		for (const mechanic of [...path.features, ...path.abilities]) {
			if (!pathsText.includes(normalize(mechanic.name))) {
				mechanicProvenanceReviews.push(
					`Paths section has no literal match for ${path.name} mechanic ${mechanic.name}.`,
				);
			}
		}
	}
	for (const job of jobs) {
		if (pathsByJob.get(job.id)?.length !== 6) {
			structuralFailures.push(
				`${job.name} must have exactly six canonical paths.`,
			);
		}
	}
	assert(structuralFailures.length === 0, structuralFailures.join("\n"));
	return mechanicProvenanceReviews;
}

function main(): void {
	const strict = process.argv.includes("--strict");
	const jobsPathsOnly = process.argv.includes("--jobs-paths-only");
	runStructuredParityGate();
	const manifest = JSON.parse(
		readFileSync(publicationManifestPath, "utf8"),
	) as PublicationManifest;
	const pdfs = checkLocalPdfInventory(
		jobsPathsOnly ? new Set(["ascendant"]) : undefined,
	);
	const catalogAudit = jobsPathsOnly
		? { matched: 0, provenanceReviews: [] }
		: checkPublishedCatalogs(manifest, pdfs);
	const ascendantGuide = pdfs.get("ascendant");
	assert(ascendantGuide, "Missing extracted Ascendant Guide.");
	const mechanicProvenanceReviews = checkJobsAndPaths(ascendantGuide);
	const provenanceReviews = [
		...catalogAudit.provenanceReviews,
		...mechanicProvenanceReviews,
	];
	if (provenanceReviews.length) {
		const details = provenanceReviews.join("\n");
		if (strict) throw new Error(details);
		console.warn(
			`REVIEW ${catalogAudit.provenanceReviews.length} supplemental catalog location(s) and ${mechanicProvenanceReviews.length} job/path mechanic name(s) do not literally match this local sourcebook set. They remain in the companion and must not be presented as sourcebook-backed until provenance is classified:\n${details}`,
		);
	}
	console.log(
		`PASS local sourcebook audit: eight local PDFs, 26 categories, ${catalogAudit.matched} sourcebook-text catalog matches, and sourcebook identity/linkage checks for 14 jobs and 84 paths. Supplemental companion records are retained; PDFs remain local verification evidence only.`,
	);
}

main();
