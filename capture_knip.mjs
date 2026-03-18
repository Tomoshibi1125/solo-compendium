import { execSync } from "child_process";
import fs from "fs";

console.log("Running knip...");
let stdout;
try {
	stdout = execSync("npx knip --reporter json", {
		encoding: "utf-8",
		maxBuffer: 10 * 1024 * 1024,
		cwd: process.cwd(),
	});
} catch (e) {
	// Knip intentionally exits with code 1 if issues are found
	stdout = e.stdout;
}

console.log("Knip finished, parsing output...");
const startObj = stdout.indexOf('{"issues"');
const startArr = stdout.indexOf('[{"file"');
const first =
	startObj > -1 && startArr > -1
		? Math.min(startObj, startArr)
		: Math.max(startObj, startArr);

if (first > -1) {
	try {
		const jsonStr = stdout.substring(first);
		const data = JSON.parse(jsonStr);
		const issues = Array.isArray(data) ? data : data.issues || [];

		const itemsToFix = [];
		issues.forEach((issue) => {
			if (issue.type === "exports" || issue.type === "types") {
				itemsToFix.push({
					file: issue.file,
					name: issue.name,
					type: issue.type,
					line: issue.line,
				});
			}
		});

		fs.writeFileSync(
			"knip_clean_data.json",
			JSON.stringify(itemsToFix, null, 2),
		);
		console.log(
			`Successfully wrote ${itemsToFix.length} issues to knip_clean_data.json`,
		);
	} catch (err) {
		console.error("Failed to parse the extracted JSON:", err.message);
	}
} else {
	console.error(
		"No JSON found in output. Output was:",
		stdout.substring(0, 500),
	);
}
