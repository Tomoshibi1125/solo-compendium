import { execSync } from "child_process";
import { writeFileSync } from "fs";

let combined = "";
try {
	combined = execSync("npx @biomejs/biome check --max-diagnostics=500 .", {
		cwd: process.cwd(),
		encoding: "utf-8",
		maxBuffer: 10 * 1024 * 1024,
		stdio: ["pipe", "pipe", "pipe"],
	});
} catch (err) {
	combined = (err.stdout || "") + "\n" + (err.stderr || "");
}

const lines = combined.split("\n");
const issues = new Map();

let currentFile = null;
let currentLine = null;
let currentCol = null;

for (const line of lines) {
	const fileMatch = line.match(/^(src[\\/].+?\.\w+):(\d+):(\d+)/);
	if (fileMatch) {
		currentFile = fileMatch[1].replace(/\\/g, "/");
		currentLine = fileMatch[2];
		currentCol = fileMatch[3];
	}

	const ruleMatch = line.match(/lint\/(\w+)\/(\w+)/);
	if (ruleMatch && currentFile) {
		const category = ruleMatch[1];
		const rule = ruleMatch[2];
		const key = currentFile;
		if (!issues.has(key)) issues.set(key, []);
		issues.get(key).push({
			line: currentLine,
			col: currentCol,
			category,
			rule,
			fullRule: `lint/${category}/${rule}`,
		});
	}
}

const out = [];

// Count by rule
const ruleCounts = new Map();
for (const [, fileIssues] of issues) {
	for (const issue of fileIssues) {
		const key = issue.fullRule;
		ruleCounts.set(key, (ruleCounts.get(key) || 0) + 1);
	}
}

out.push("=== ISSUES BY RULE ===");
const sortedRules = [...ruleCounts.entries()].sort((a, b) => b[1] - a[1]);
for (const [rule, count] of sortedRules) {
	out.push(`  ${rule}: ${count}`);
}

out.push("");
out.push(`=== ISSUES BY FILE (${issues.size} files) ===`);
const sortedFiles = [...issues.entries()].sort(
	(a, b) => b[1].length - a[1].length,
);
for (const [file, fileIssues] of sortedFiles) {
	out.push(`${file} (${fileIssues.length}):`);
	for (const issue of fileIssues) {
		out.push(`  L${issue.line}:${issue.col} ${issue.fullRule}`);
	}
}

out.push("");
out.push(`Total files: ${issues.size}`);
out.push(
	`Total issues: ${[...issues.values()].reduce((s, i) => s + i.length, 0)}`,
);

writeFileSync("biome-report.txt", out.join("\n"), "utf-8");
console.log("Done! Wrote biome-report.txt");
