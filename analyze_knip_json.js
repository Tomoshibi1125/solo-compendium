const fs = require("fs");
const path = require("path");

const reportPath = path.join(__dirname, "knip-results.json");
const reportContent = fs.readFileSync(reportPath, "utf-8");
const data = JSON.parse(reportContent);

// Knip JSON format usually has: data.issues or an array of objects
const issues = Array.isArray(data) ? data : data.issues || [];

let unusedExportsCount = 0;
let unusedTypesCount = 0;
const filesToModify = new Set();
const exportNames = new Set();

issues.forEach((issue) => {
	if (issue.type === "exports") {
		unusedExportsCount++;
		filesToModify.add(issue.file);
		exportNames.add(issue.name);
	} else if (issue.type === "types") {
		unusedTypesCount++;
		filesToModify.add(issue.file);
		exportNames.add(issue.name);
	}
});

console.log(`Parsed ${issues.length} total issues from knip-results.json`);
console.log(`Unused exports: ${unusedExportsCount}`);
console.log(`Unused types: ${unusedTypesCount}`);
console.log(`Files to modify: ${filesToModify.size}`);

// Write a small preview of the first 5 issues to understand the structure
fs.writeFileSync(
	"knip_preview.json",
	JSON.stringify(issues.slice(0, 5), null, 2),
);
