import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportPath = path.join(__dirname, "knip-results.json");
const buffer = fs.readFileSync(reportPath);

let reportContent = buffer.toString("utf16le");
if (
	reportContent.charCodeAt(0) === 0xfeff ||
	reportContent.charCodeAt(0) === 0xfffe
) {
	reportContent = reportContent.substring(1);
}
if (!reportContent.includes('"issues"')) {
	reportContent = buffer.toString("utf8");
}

// Find a valid JSON chunk
let data = null;

// The JSON usually starts with {"issues":
// Or it starts with [{"file": ...
let startIdx = reportContent.indexOf('{"issues"');
if (startIdx === -1) {
	startIdx = reportContent.indexOf('[{"file"');
}

if (startIdx !== -1) {
	try {
		data = JSON.parse(reportContent.substring(startIdx));
	} catch (e) {
		console.error(
			"Failed to parse JSON even after finding known start signature.",
		);
	}
} else {
	// Try to just take everything after the first newline
	try {
		const afterNewline = reportContent
			.substring(reportContent.indexOf("\n") + 1)
			.trim();
		data = JSON.parse(afterNewline);
	} catch (e) {}
}

if (!data) {
	console.error("Could not find any JSON payload in the Knip output!");
	process.exit(1);
}

const issues = Array.isArray(data) ? data : data.issues || [];

let unusedExportsCount = 0;
let unusedTypesCount = 0;
const itemsToFix = [];

issues.forEach((issue) => {
	if (
		issue.type === "exports" ||
		issue.type === "types" ||
		issue.type === "duplicates"
	) {
		if (issue.type === "exports") unusedExportsCount++;
		if (issue.type === "types") unusedTypesCount++;

		itemsToFix.push({
			file: issue.file,
			name: issue.name,
			type: issue.type,
			line: issue.line,
			col: issue.col,
		});
	}
});

console.log(`Parsed ${issues.length} total issues from knip-results.json`);
console.log(`Unused exports: ${unusedExportsCount}`);
console.log(`Unused types: ${unusedTypesCount}`);

fs.writeFileSync(
	"knip_clean_data.json",
	JSON.stringify(itemsToFix, null, 2),
	"utf8",
);
console.log("Successfully wrote clean data to knip_clean_data.json");
