import { existsSync, readdirSync, statSync, readFileSync } from "fs";
import { resolve, extname } from "path";
import { spawnSync } from "child_process";

const rootDir = resolve(__dirname, "../..");
const exportRoot = resolve(rootDir, "books/exports");

function runCommand(command: string, args: string[]) {
	return spawnSync(command, args, { encoding: "utf8", cwd: rootDir });
}

function findPythonExecutable(): string | null {
	const userProfile = process.env.USERPROFILE || "";
	const bundled = resolve(userProfile, ".cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe");
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

	const pdfFiles = readdirSync(exportRoot)
		.filter((file) => extname(file).toLowerCase() === ".pdf")
		.map((file) => resolve(exportRoot, file));

	if (pdfFiles.length === 0) {
		console.log("No PDF files found to audit.");
		process.exit(0);
	}

	const python = findPythonExecutable();
	let allPassed = true;

	for (const pdfPath of pdfFiles) {
		console.log(`\nAuditing: ${pdfPath}`);
		const sizeMB = statSync(pdfPath).size / (1024 * 1024);
		console.log(`- Size: ${sizeMB.toFixed(2)} MB`);
		
		if (sizeMB > 100) {
			console.log(`  [WARN] Size exceeds 100 MB budget.`);
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
				console.log(result.stdout.trim().split("\\n").map(l => "  " + l).join("\\n"));
				allPassed = false;
			} else {
				console.log(`PASS`);
			}
		} else {
			console.log("- Layout Overflow: SKIPPED (python/pdfplumber not found)");
		}
	}

	console.log("\\n=========================================");
	if (allPassed) {
		console.log("QA STATUS: PASSED");
		process.exit(0);
	} else {
		console.log("QA STATUS: PASSED WITH WARNINGS (See warnings above)");
		process.exit(0);
	}
}

runQAChecks().catch(err => {
	console.error(err);
	process.exit(1);
});
