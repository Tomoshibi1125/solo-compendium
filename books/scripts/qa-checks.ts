import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
	activeSourcebookSlugs,
	type SourcebookSlug,
	sourcebookVolumeBySlug,
	sourcebookVolumes,
} from "./sourcebook-publication";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../..");
const exportRoot = resolve(rootDir, "books/exports");
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const onlyBook = onlyArg?.split("=")[1];

const outputBaseBySlug = Object.fromEntries(
	sourcebookVolumes.map((volume) => [volume.slug, volume.outputBase]),
) as Record<SourcebookSlug, string>;

const runSilentOpeningAnchors: Array<[string, RegExp]> = [
	["Bureau Threshold Cordon", /Bureau\s*Threshold\s*Cordon/i],
	["AFA sync", /AFA\s*sync/i],
	["requisition", /\brequisition\b/i],
	["Threshold crossing", /Threshold\s*crossing/i],
	["Survey Layer", /Survey\s*Layer/i],
	["Black Road", /Black\s*Road/i],
	["First Road", /First\s*Road/i],
	["relay spike", /relay\s*spike/i],
	["first contradiction", /first\s*contradiction/i],
	["first safehold", /first\s*safehold/i],
	["Starter Map and Handout Packet", /Starter\s*Map\s*and\s*Handout\s*Packet/i],
	["Bureau Threshold Cordon Map", /Bureau\s*Threshold\s*Cordon\s*Map/i],
	["Threshold Crossing Map", /Threshold\s*Crossing\s*Map/i],
	[
		"Survey Layer and First Road Map",
		/Survey\s*Layer\s*and\s*First\s*Road\s*Map/i,
	],
	["Relay Spike Handout", /Relay\s*Spike\s*Handout/i],
	[
		"Corrupted AFA First Contradiction Handout",
		/Corrupted\s*AFA\s*First\s*Contradiction\s*Handout/i,
	],
	["First Safehold or Wardline Map", /First\s*Safehold\s*or\s*Wardline\s*Map/i],
	["When the Sandbox Opens", /When\s*the\s*Sandbox\s*Opens/i],
	["Follow the Bureau Signal", /Follow\s*the\s*Bureau\s*Signal/i],
	["Seek Shelter", /Seek\s*Shelter/i],
	["Keep the Vehicle Moving", /Keep\s*the\s*Vehicle\s*Moving/i],
];

const glasslineAnchors: Array<[string, RegExp]> = [
	["The Glassline Claim", /The\s*Glassline\s*Claim/i],
	["Scene 0 New License Day", /Scene\s*0\s*:\s*New\s*License\s*Day/i],
	["L-3 Glassline Haul Sector", /L\s*-\s*3\s*Glassline\s*Haul\s*Sector/i],
	["L3-HOUND", /L3\s*-\s*HOUND/i],
	["Ironclad Rift-Hauler", /Ironclad\s*Rift\s*-\s*Hauler/i],
	["Ironclad Contract Briefing", /Ironclad\s*Contract\s*Briefing/i],
	["Bureau Threshold Intake", /Bureau\s*Threshold\s*Intake/i],
	["First Corridor Escort", /First\s*Corridor\s*Escort/i],
	["Survey Marker L-3", /Survey\s*Marker\s*L\s*-\s*3/i],
	["Rival Claim Dispute", /Rival\s*Claim\s*Dispute/i],
	["The Glassline Seam", /The\s*Glassline\s*Seam/i],
	["Claim Guardian", /Claim\s*Guardian/i],
	["Debrief And Carryover", /Debrief\s*And\s*Carryover/i],
	["Rewards", /\bRewards\b/i],
	[
		"Run Silent Transition Hook",
		/Run\s*Silent\s*Transition\s*Hook|Professional\s*Referral/i,
	],
];

const glasslineForbiddenTerms: Array<[string, RegExp]> = [
	["campaign-region lore", /\bGloamreach\b/i],
	["Memory-Care", new RegExp("\\bMemory-" + "Care\\b", "i")],
	["Day Zero", new RegExp("\\bDay " + "Zero\\b", "i")],
	["The Worn", /\bThe\s*Worn\b/i],
	["Worn Dead", /\bWorn\s*Dead\b/i],
	["The Quiet", /\bThe\s*Quiet\b/i],
	["Hunt Clock", /\bHunt\s*Clock\b/i],
	["Running This Horror", /\bRunning\s*This\s*Horror\b/i],
	["Dread", /\bDread\b/i],
	["sandbox", /\bsandbox\b/i],
];

function runCommand(command: string, args: string[]) {
	return spawnSync(command, args, { encoding: "utf8", cwd: rootDir });
}

function isRunSilentPdf(pdfPath: string): boolean {
	return pdfPath.endsWith(`${outputBaseBySlug["run-silent"]}.pdf`);
}

function isGlasslinePdf(pdfPath: string): boolean {
	return pdfPath.endsWith(`${outputBaseBySlug["glassline-claim"]}.pdf`);
}

function extractPdfTextForAudit(
	python: string,
	pdfPath: string,
): string | null {
	const script = `
from pypdf import PdfReader
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
reader = PdfReader(sys.argv[1])
for page in reader.pages:
    print(page.extract_text() or "")
`;
	const result = runCommand(python, ["-c", script, pdfPath]);
	if (result.status !== 0) return null;
	return result.stdout;
}

function findMissingRunSilentOpeningAnchors(text: string): string[] {
	return runSilentOpeningAnchors
		.filter(([, pattern]) => !pattern.test(text))
		.map(([label]) => label);
}

function findMissingGlasslineAnchors(text: string): string[] {
	return glasslineAnchors
		.filter(([, pattern]) => !pattern.test(text))
		.map(([label]) => label);
}

function findGlasslineForbiddenTerms(text: string): string[] {
	return glasslineForbiddenTerms
		.filter(([, pattern]) => pattern.test(text))
		.map(([label]) => label);
}

function findPythonExecutable(): string | null {
	const userProfile = process.env.USERPROFILE || "";
	const bundled = resolve(
		userProfile,
		".cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe",
	);
	if (existsSync(bundled)) return bundled;

	const where = runCommand("where.exe", ["python"]);
	if (where.status === 0) {
		const first = where.stdout.split(/\r?\n/).find(Boolean);
		if (first) return first.trim();
	}
	return null;
}

async function runQAChecks() {
	console.log("=========================================");
	console.log("        RIFT ASCENDANT QA AUDIT          ");
	console.log("=========================================\n");

	if (!existsSync(exportRoot)) {
		console.error("No exports directory found.");
		process.exit(1);
	}

	if (onlyBook && !(onlyBook in sourcebookVolumeBySlug)) {
		console.error(
			`Unknown --only value "${onlyBook}". Use ${activeSourcebookSlugs.join(", ")}.`,
		);
		process.exit(1);
	}

	const selectedVolumes = onlyBook
		? [sourcebookVolumeBySlug[onlyBook as SourcebookSlug]]
		: sourcebookVolumes;
	const discoveredPdfNames = readdirSync(exportRoot).filter(
		(file) => extname(file).toLowerCase() === ".pdf",
	);
	const expectedPdfNames = new Set(
		selectedVolumes.map((volume) => `${volume.outputBase}.pdf`),
	);
	let allPassed = true;
	for (const expected of expectedPdfNames) {
		if (!discoveredPdfNames.includes(expected)) {
			console.error(`FAIL: Missing expected PDF ${expected}.`);
			allPassed = false;
		}
	}
	if (!onlyBook) {
		for (const discovered of discoveredPdfNames) {
			if (!expectedPdfNames.has(discovered)) {
				console.error(`FAIL: Unexpected PDF ${discovered}.`);
				allPassed = false;
			}
		}
	}
	const pdfFiles = selectedVolumes
		.map((volume) => resolve(exportRoot, `${volume.outputBase}.pdf`))
		.filter(existsSync);

	const python = findPythonExecutable();

	for (const pdfPath of pdfFiles) {
		console.log(`\nAuditing: ${pdfPath}`);
		const sizeMB = statSync(pdfPath).size / (1024 * 1024);
		console.log(`- Size: ${sizeMB.toFixed(2)} MB`);

		if (sizeMB > 100) {
			console.log("  [FAIL] Size exceeds 100 MB budget.");
			allPassed = false;
		}

		// Check for severe layout overflow using pdfplumber
		if (python) {
			const script = `
import sys
import pdfplumber

path = sys.argv[1]
issues = []
max_issues = 5
try:
    with pdfplumber.open(path) as pdf:
        for page_index, page in enumerate(pdf.pages):
            if page_index == 0: continue
            words = page.extract_words(x_tolerance=1, y_tolerance=3, keep_blank_chars=False, use_text_flow=False) or []
            words = [w for w in words if str(w.get("text", "")).strip()]
            words.sort(key=lambda w: (float(w.get("top", 0)), float(w.get("x0", 0))))
            for i, a in enumerate(words):
                if len(issues) >= max_issues: break
                for b in words[i + 1 :]:
                    if float(b.get("top", 0)) > float(a.get("bottom", 0)): break
                    if float(b.get("x0", 0)) > float(a.get("x1", 0)): continue
                    if float(a.get("x0", 0)) > float(b.get("x1", 0)): continue
                    overlap_x = min(float(a.get("x1", 0)), float(b.get("x1", 0))) - max(float(a.get("x0", 0)), float(b.get("x0", 0)))
                    overlap_y = min(float(a.get("bottom", 0)), float(b.get("bottom", 0))) - max(float(a.get("top", 0)), float(b.get("top", 0)))
                    if overlap_x > 6 and overlap_y > 6:
                        issues.append(f"Page {page_index + 1}: '{a.get('text')}' overlaps '{b.get('text')}'")
            if len(issues) >= max_issues: break
    for issue in issues:
        print(issue)
except Exception as e:
    print(f"Error: {e}")
`;
			process.stdout.write("- Layout Overflow: ");
			const result = runCommand(python, ["-c", script, pdfPath]);
			if (result.stdout.trim()) {
				console.log(`FAIL`);
				console.log(
					result.stdout
						.trim()
						.split("\\n")
						.map((l) => "  " + l)
						.join("\\n"),
				);
				allPassed = false;
			} else {
				console.log(`PASS`);
			}
		} else {
			console.log("- Layout Overflow: SKIPPED (python/pdfplumber not found)");
		}

		if (isRunSilentPdf(pdfPath)) {
			if (!python) {
				console.log("- Run Silent Opening Flow: FAIL (python/pypdf not found)");
				console.log(
					"- Run Silent Source-Book Reuse: SKIPPED (python/pypdf not found)",
				);
				allPassed = false;
			} else {
				const text = extractPdfTextForAudit(python, pdfPath);
				if (!text) {
					console.log(
						"- Run Silent Opening Flow: FAIL (text extraction failed)",
					);
					console.log(
						"- Run Silent Source-Book Reuse: FAIL (text extraction failed)",
					);
					allPassed = false;
				} else {
					process.stdout.write("- Run Silent Opening Flow: ");
					const missing = findMissingRunSilentOpeningAnchors(text);
					if (missing.length) {
						console.log("FAIL");
						console.log(`  Missing anchors: ${missing.join(", ")}`);
						allPassed = false;
					} else {
						console.log("PASS");
					}

					// Source-book reuse: no dev-filename pointers may leak into the book,
					// and the campaign should cite the six core source books by name.
					process.stdout.write("- Run Silent Source-Book Reuse: ");
					const devRefs =
						text.match(
							/\b[a-z0-9-]+\.ts\b|spell-rank-[a-z]|power-powers|technique-techniques/gi,
						) || [];
					const sixBooks = [
						"Ascendant Guide",
						"Warden Guide",
						"Vaults of the Rift",
						"Awakened Arts",
						"Anomaly Manual",
						"Worldbook",
					];
					const uncited = sixBooks.filter((b) => !text.includes(b));
					if (devRefs.length) {
						console.log("FAIL");
						console.log(
							`  Dev-filename references leaked into the book: ${Array.from(new Set(devRefs)).slice(0, 8).join(", ")}`,
						);
						allPassed = false;
					} else if (uncited.length) {
						console.log(`WARN (source books not cited: ${uncited.join(", ")})`);
					} else {
						console.log(
							"PASS (no dev-filename refs; all six source books cited)",
						);
					}
				}
			}
		}

		if (isGlasslinePdf(pdfPath)) {
			if (!python) {
				console.log(
					"- Glassline One-Shot Anchors: FAIL (python/pypdf not found)",
				);
				console.log(
					"- Glassline Forbidden Terms: FAIL (python/pypdf not found)",
				);
				allPassed = false;
			} else {
				const text = extractPdfTextForAudit(python, pdfPath);
				if (!text) {
					console.log(
						"- Glassline One-Shot Anchors: FAIL (text extraction failed)",
					);
					console.log(
						"- Glassline Forbidden Terms: FAIL (text extraction failed)",
					);
					allPassed = false;
				} else {
					process.stdout.write("- Glassline One-Shot Anchors: ");
					const missing = findMissingGlasslineAnchors(text);
					if (missing.length) {
						console.log("FAIL");
						console.log(`  Missing anchors: ${missing.join(", ")}`);
						allPassed = false;
					} else {
						console.log("PASS");
					}

					process.stdout.write("- Glassline Forbidden Terms: ");
					const forbidden = findGlasslineForbiddenTerms(text);
					if (forbidden.length) {
						console.log("FAIL");
						console.log(`  Forbidden terms: ${forbidden.join(", ")}`);
						allPassed = false;
					} else {
						console.log("PASS");
					}
				}
			}
		}
	}

	console.log("\n=========================================");
	if (allPassed) {
		console.log("QA STATUS: PASSED");
		return;
	}
	console.error("QA STATUS: FAILED (See failures above)");
	process.exitCode = 1;
}

runQAChecks().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
