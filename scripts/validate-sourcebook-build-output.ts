import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PDFDocument } from "pdf-lib";

import {
	activeSourcebookSlugs,
	type SourcebookSlug,
	sourcebookVolumeBySlug,
	sourcebookVolumes,
} from "../books/scripts/sourcebook-publication";

/**
 * Source inventory only (works before generated outputs exist):
 *   npx --no-install tsx scripts/validate-sourcebook-build-output.ts --source-only
 *
 * Crawl the complete generated output set:
 *   npx --no-install tsx scripts/validate-sourcebook-build-output.ts
 *
 * Crawl one generated volume:
 *   npx --no-install tsx scripts/validate-sourcebook-build-output.ts --only=ascendant
 */

interface PublicationManifest {
	volumes: Array<{
		slug: string;
		title: string;
		outputBase: string;
		version: null;
		versionStatus: "manual";
		sections: string[];
	}>;
	entries: Record<
		string,
		{
			publication: {
				status: string;
				volume: string | null;
				section: string | null;
				version: null;
				versionStatus: "manual";
				page: null;
				pageStatus: "manual";
			};
		}
	>;
}

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const exportRootArg = process.argv.find((argument) =>
	argument.startsWith("--export-root="),
);
const exportRoot = exportRootArg
	? resolve(repoRoot, exportRootArg.slice("--export-root=".length))
	: resolve(repoRoot, "books/exports");
const manifestPath = resolve(
	repoRoot,
	"books/data/canonical-publication-manifest.json",
);
const sourceOnly = process.argv.includes("--source-only");
const selfTest = process.argv.includes("--self-test");
const onlyArgument = process.argv.find((argument) =>
	argument.startsWith("--only="),
);
const onlyValue = onlyArgument?.slice("--only=".length);

function validateSourceInventory(manifest: PublicationManifest): string[] {
	const errors: string[] = [];
	if (sourcebookVolumes.length !== 8) {
		errors.push(
			`Authored sourcebook inventory has ${sourcebookVolumes.length} volumes, expected 8.`,
		);
	}
	if (new Set(activeSourcebookSlugs).size !== activeSourcebookSlugs.length) {
		errors.push("Authored sourcebook inventory has duplicate slugs.");
	}
	if (
		new Set(sourcebookVolumes.map((volume) => volume.outputBase)).size !==
		sourcebookVolumes.length
	) {
		errors.push(
			"Authored sourcebook inventory has duplicate output basenames.",
		);
	}

	const manifestVolumes = new Map(
		manifest.volumes.map((volume) => [volume.slug, volume]),
	);
	for (const volume of sourcebookVolumes) {
		const manifestVolume = manifestVolumes.get(volume.slug);
		if (!manifestVolume) {
			errors.push(`Publication manifest is missing volume ${volume.slug}.`);
			continue;
		}
		if (
			manifestVolume.title !== volume.title ||
			manifestVolume.outputBase !== volume.outputBase
		) {
			errors.push(`Publication manifest metadata drifted for ${volume.slug}.`);
		}
		if (
			JSON.stringify(manifestVolume.sections) !==
			JSON.stringify(volume.sections)
		) {
			errors.push(`Publication manifest sections drifted for ${volume.slug}.`);
		}
		if (
			manifestVolume.version !== null ||
			manifestVolume.versionStatus !== "manual"
		) {
			errors.push(
				`${volume.slug} version must remain null/manual until authored.`,
			);
		}
		if (new Set(volume.sections).size !== volume.sections.length) {
			errors.push(`${volume.slug} has duplicate authored section IDs.`);
		}
	}
	if (manifestVolumes.size !== sourcebookVolumes.length) {
		errors.push(
			`Publication manifest declares ${manifestVolumes.size} volumes, expected exactly ${sourcebookVolumes.length}.`,
		);
	}

	for (const [key, entry] of Object.entries(manifest.entries)) {
		const publication = entry.publication;
		if (
			publication.version !== null ||
			publication.versionStatus !== "manual" ||
			publication.page !== null ||
			publication.pageStatus !== "manual"
		) {
			errors.push(
				`${key} invents version/page evidence; expected null/manual.`,
			);
		}
		if (publication.status === "published") {
			const volume = publication.volume
				? sourcebookVolumeBySlug[publication.volume as SourcebookSlug]
				: null;
			if (!volume || !publication.section) {
				errors.push(`${key} has an incomplete published placement.`);
			} else if (!volume.sections.includes(publication.section as never)) {
				errors.push(
					`${key} references unknown section ${publication.volume}/${publication.section}.`,
				);
			}
		} else if (publication.volume !== null || publication.section !== null) {
			errors.push(`${key} has an unverified volume/section placement.`);
		}
	}
	return errors;
}

async function validatePdf(
	pdfPath: string,
	minimumPageTarget: number | null,
): Promise<string[]> {
	const errors: string[] = [];
	const bytes = statSync(pdfPath).size;
	if (bytes <= 0) {
		errors.push(`${pdfPath} is empty.`);
		return errors;
	}
	try {
		const document = await PDFDocument.load(readFileSync(pdfPath));
		const pages = document.getPageCount();
		if (pages <= 0) errors.push(`${pdfPath} has no pages.`);
		if (minimumPageTarget && pages < minimumPageTarget) {
			errors.push(
				`${pdfPath} has ${pages} pages, below the authored ${minimumPageTarget}-page target.`,
			);
		}
		console.log(
			`PASS ${pdfPath}: ${pages} pages, ${(bytes / 1024 / 1024).toFixed(2)} MB.`,
		);
	} catch (error) {
		errors.push(`${pdfPath} is not a parseable PDF: ${String(error)}`);
	}
	return errors;
}

function runSelfTest(manifest: PublicationManifest): void {
	const clone = structuredClone(manifest);
	clone.volumes.pop();
	if (
		!validateSourceInventory(clone).some((error) => error.includes("volumes"))
	) {
		throw new Error(
			"Self-test failed: missing eighth volume was not rejected.",
		);
	}
	console.log("PASS self-test: missing eighth volume is rejected.");
}

async function main(): Promise<void> {
	if (!existsSync(manifestPath)) {
		console.error(`Missing authored publication manifest: ${manifestPath}`);
		process.exitCode = 1;
		return;
	}
	let manifest: PublicationManifest;
	try {
		manifest = JSON.parse(
			readFileSync(manifestPath, "utf8"),
		) as PublicationManifest;
	} catch (error) {
		console.error(`Invalid publication manifest JSON: ${String(error)}`);
		process.exitCode = 1;
		return;
	}

	const sourceErrors = validateSourceInventory(manifest);
	if (selfTest) runSelfTest(manifest);
	if (sourceErrors.length) {
		for (const error of sourceErrors) console.error(`FAIL ${error}`);
		process.exitCode = 1;
		return;
	}
	console.log(
		`PASS authored source crawl: ${sourcebookVolumes.length} volumes and ${Object.keys(manifest.entries).length} canonical publication records.`,
	);
	if (sourceOnly || selfTest) return;

	if (onlyValue && !(onlyValue in sourcebookVolumeBySlug)) {
		console.error(
			`Unknown --only value ${JSON.stringify(onlyValue)}. Use ${activeSourcebookSlugs.join(", ")}.`,
		);
		process.exitCode = 1;
		return;
	}
	if (!existsSync(exportRoot)) {
		console.error(`Generated export directory does not exist: ${exportRoot}`);
		process.exitCode = 1;
		return;
	}

	const selectedVolumes = onlyValue
		? [sourcebookVolumeBySlug[onlyValue as SourcebookSlug]]
		: sourcebookVolumes;
	const expectedNames = new Set(
		selectedVolumes.map((volume) => `${volume.outputBase}.pdf`),
	);
	const allPdfNames = readdirSync(exportRoot).filter(
		(file) => extname(file).toLowerCase() === ".pdf",
	);
	const outputErrors: string[] = [];
	for (const expected of expectedNames) {
		if (!allPdfNames.includes(expected)) {
			outputErrors.push(`Missing expected generated PDF ${expected}.`);
		}
	}
	if (!onlyValue) {
		for (const actual of allPdfNames) {
			if (!expectedNames.has(actual)) {
				outputErrors.push(`Unexpected generated PDF ${actual}.`);
			}
		}
		const htmlNames = readdirSync(exportRoot).filter(
			(file) => extname(file).toLowerCase() === ".html",
		);
		for (const html of htmlNames) {
			outputErrors.push(
				`Generated export directory contains forbidden HTML ${html}.`,
			);
		}
	}

	for (const volume of selectedVolumes) {
		const pdfPath = resolve(exportRoot, `${volume.outputBase}.pdf`);
		if (existsSync(pdfPath)) {
			outputErrors.push(
				...(await validatePdf(pdfPath, volume.minimumPageTarget)),
			);
		}
	}
	if (outputErrors.length) {
		for (const error of outputErrors) console.error(`FAIL ${error}`);
		process.exitCode = 1;
		return;
	}
	console.log(
		`PASS generated output crawl: ${selectedVolumes.length} expected sourcebook PDF${selectedVolumes.length === 1 ? "" : "s"}.`,
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
