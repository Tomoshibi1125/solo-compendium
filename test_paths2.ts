import * as fs from "fs";

const pathsFile = fs.readFileSync("src/data/compendium/paths.ts", "utf-8");
const accessFile = fs.readFileSync("src/lib/pathAbilityAccess.ts", "utf-8");

const pathRegex = /job_name:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let match;
const allPaths = [];
while ((match = pathRegex.exec(pathsFile)) !== null) {
	allPaths.push({ job: match[1], path: match[2] });
}

const grantRegex = /jobName:\s*"([^"]+)",\s*pathName:\s*"([^"]+)"/g;
const grantedPaths = new Set();
while ((match = grantRegex.exec(accessFile)) !== null) {
	grantedPaths.add(match[1] + ":" + match[2]);
}

console.log("Total Paths in compendium:", allPaths.length);
console.log("Total Unique Granted Paths:", grantedPaths.size);

const missingPaths = allPaths.filter(
	(p) => !grantedPaths.has(p.job + ":" + p.path),
);
console.log("\nMissing Paths:");
for (const p of missingPaths) {
	console.log(`- ${p.job}: ${p.path}`);
}
